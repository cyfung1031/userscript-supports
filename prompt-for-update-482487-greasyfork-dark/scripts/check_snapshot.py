#!/usr/bin/env python3
"""Mechanical invariants for the Greasy Fork Dark CSS snapshot update."""

from __future__ import annotations

import argparse
from collections import Counter
import re
import subprocess
import sys
from pathlib import Path


TARGET = "482487-greasyfork-dark.user.js"
GENERAL_MARKER = "        // general" + chr(10)
STRUCTURAL_MARKER = "Structural additions and changes from the current Greasy Fork application CSS."
APPLICATION_COMMENT = "// https://greasyfork.org/vite/assets/application-"
ORPHAN_COMMENT_CATALOG = "/* Preserved comments from the previous // general snapshot. */"
REQUIRED_MARKERS = (
    "@media screen and (width <= 1228px)",
    ":is(.pagination, .pagy)",
    "#site-nav > nav",
    ".inline-script-stats",
)
SUPPLEMENTAL_MARKERS = (
    "// https://greasyfork.org/en/users/webhook-info",
    "// https://greasyfork.org/en/scripts/482487-greasyfork-dark/stats",
    ".prettyprint.linenums",
)
NON_COLOR_PROPERTIES = {
    "accent-color",
    "background",
    "background-color",
    "background-image",
    "border",
    "border-color",
    "box-shadow",
    "caret-color",
    "color",
    "column-rule",
    "fill",
    "outline",
    "stroke",
    "text-decoration-color",
    "text-shadow",
}


def fail(message):
    print("FAIL: " + message, file=sys.stderr)
    raise SystemExit(1)


def extract_general(source):
    if source.count(GENERAL_MARKER) != 1:
        fail("expected exactly one // general marker")
    marker = source.index(GENERAL_MARKER)
    opening = source.index(chr(96), marker)
    closing = source.index(chr(96), opening + 1)
    return source[opening + 1 : closing]


def scan_comments(css):
    active = []
    comments = []
    index = 0
    while index < len(css):
        if css.startswith("/*", index):
            end = css.find("*/", index + 2)
            if end < 0:
                fail("unterminated CSS comment")
            comments.append(css[index : end + 2])
            index = end + 2
        else:
            active.append(css[index])
            index += 1
    return "".join(active), comments


def remove_orphan_comment_catalogue(css):
    marker = css.find(ORPHAN_COMMENT_CATALOG)
    if marker < 0:
        return css
    trailing = css[marker:]
    active, _ = scan_comments(trailing)
    return css[:marker] if not active.strip() else css


def scan_balance(css):
    active, comments = scan_comments(css)
    braces = 0
    parentheses = 0
    quote = ""
    escaped = False
    for char in active:
        if quote:
            if escaped:
                escaped = False
            elif char == chr(92):
                escaped = True
            elif char == quote:
                quote = ""
        elif char in ("'", '"'):
            quote = char
        elif char == "{":
            braces += 1
        elif char == "}":
            braces -= 1
        elif char == "(":
            parentheses += 1
        elif char == ")":
            parentheses -= 1
        if braces < 0 or parentheses < 0:
            fail("CSS closing delimiter appears before its opener")
    return braces, parentheses, quote, escaped, comments


def normalize(value):
    return "".join(value.split())


def css_selectors(css):
    return set(css_selector_sequence(css))


def css_selector_sequence(css):
    active, _ = scan_comments(css)
    found = []
    for line in active.splitlines():
        if "{" not in line:
            continue
        selector = line.split("{", 1)[0].strip()
        if not selector or selector.startswith("@") or selector.startswith(":root"):
            continue
        found.append(normalize(selector))
    return found


def repeated_css_selector_counts(css):
    return Counter(css_selector_sequence(css))


def remove_excluded_branches(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
    patterns = (
        re.compile(r":root\s*\{"),
        re.compile(r"@media\s*\([^)]*prefers-color-scheme\s*:\s*dark[^)]*\)\s*\{"),
    )
    while True:
        matches = [match for pattern in patterns if (match := pattern.search(css))]
        if not matches:
            return css
        match = min(matches, key=lambda item: item.start())
        depth = 0
        closing = None
        for index in range(match.end() - 1, len(css)):
            if css[index] == "{":
                depth += 1
            elif css[index] == "}":
                depth -= 1
                if depth == 0:
                    closing = index + 1
                    break
        if closing is None:
            fail("excluded CSS branch is unbalanced")
        css = css[: match.start()] + css[closing:]


def declaration_tokens(css):
    tokens = set()
    css = remove_excluded_branches(css)
    for match in re.finditer(
        r"(?m)^\s*([-_a-zA-Z][-_a-zA-Z0-9]*)\s*:\s*([^;{}]+)(?:;|(?=\}))",
        css,
    ):
        property_name = match.group(1)
        if property_name.startswith("--") or property_name in NON_COLOR_PROPERTIES:
            continue
        value = " ".join(match.group(2).split())
        tokens.add((property_name, value))
    return tokens


def hex_colors(css):
    colors = set()
    index = 0
    while index < len(css):
        if css[index] != "#":
            index += 1
            continue
        end = index + 1
        while end < len(css) and css[end] in "0123456789abcdefABCDEF":
            end += 1
        token = css[index:end]
        if len(token) in (4, 5, 7, 9):
            colors.add(token)
        index = end
    return colors


def previous_from_git(base_ref, target):
    try:
        result = subprocess.run(
            ["git", "show", base_ref + ":" + target],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as error:
        fail("cannot read previous target: " + error.stderr.strip())
    return result.stdout


def check_git_scope(target):
    result = subprocess.run(
        ["git", "status", "--porcelain", "--untracked-files=all"],
        check=True,
        capture_output=True,
        text=True,
    )
    changed = [line[3:] for line in result.stdout.splitlines() if line]
    if changed not in ([], [target]):
        fail("working-tree scope is " + repr(changed) + "; expected clean or only " + repr(target))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", default=TARGET)
    parser.add_argument("--base-ref")
    parser.add_argument("--previous-general", type=Path)
    parser.add_argument("--upstream-css", type=Path)
    parser.add_argument("--only-target", action="store_true")
    args = parser.parse_args()

    target_path = Path(args.file)
    if not target_path.is_file():
        fail("target file does not exist: " + str(target_path))
    source = target_path.read_text()
    general = extract_general(source)
    active, _ = scan_comments(general)

    if ORPHAN_COMMENT_CATALOG in general:
        fail("orphan preserved-comment catalogue remains; attach comments to declarations or rules")
    if STRUCTURAL_MARKER in source or APPLICATION_COMMENT in source:
        fail("duplicate structural snapshot or upstream application-asset comment remains")
    if ":root" in active:
        fail("active :root variable block remains")
    if "@media (prefers-color-scheme: dark)" in active:
        fail("active official dark branch remains")
    for marker in REQUIRED_MARKERS:
        if marker not in active:
            fail("missing current CSS structure marker: " + marker)
    for marker in SUPPLEMENTAL_MARKERS:
        if marker not in source:
            fail("missing supplemental style marker: " + marker)
    braces, parentheses, quote, escaped, _ = scan_balance(general)
    if (braces, parentheses) != (0, 0) or quote or escaped:
        fail("unbalanced CSS braces, parentheses, quotes, or escapes")

    position = 0
    while True:
        position = active.find("var(", position)
        if position < 0:
            break
        end = active.find(")", position)
        if end < 0:
            fail("unterminated CSS variable use")
        variable = active[position + 4 : end].strip()
        if not variable.startswith("--") or variable + ":" not in active:
            fail("unresolved CSS variable: " + variable)
        position = end + 1

    previous_source = None
    if args.previous_general:
        previous_source = args.previous_general.read_text()
    elif args.base_ref:
        previous_source = previous_from_git(args.base_ref, args.file)
    if previous_source is not None:
        previous_general = remove_orphan_comment_catalogue(extract_general(previous_source))
        _, previous_comments = scan_comments(previous_general)
        missing_comments = [item for item in set(previous_comments) if item not in general]
        if missing_comments:
            fail("historical CSS comments lost: " + str(len(missing_comments)))
        missing_colors = [item for item in hex_colors(previous_general) if item not in general]
        if missing_colors:
            fail("historical CSS colors lost: " + str(len(missing_colors)))
    if args.upstream_css:
        upstream = args.upstream_css.read_text()
        missing = sorted(css_selectors(upstream) - css_selectors(general))
        if missing:
            fail("current upstream selectors missing: " + repr(missing[:12]))
        upstream_counts = repeated_css_selector_counts(upstream)
        snapshot_counts = repeated_css_selector_counts(general)
        collapsed = sorted(
            (selector, count, snapshot_counts.get(selector, 0))
            for selector, count in upstream_counts.items()
            if count > 1 and snapshot_counts.get(selector, 0) < count
        )
        if collapsed:
            fail("repeated upstream CSS blocks were collapsed: " + repr(collapsed[:12]))
        missing_tokens = sorted(declaration_tokens(upstream) - declaration_tokens(general))
        if missing_tokens:
            fail("current upstream declaration tokens missing: " + repr(missing_tokens[:12]))
    if args.only_target:
        check_git_scope(args.file)

    try:
        subprocess.run(
            ["node", "--check", str(target_path)],
            check=True,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError:
        fail("node is required for userscript syntax verification")
    except subprocess.CalledProcessError as error:
        fail("node --check failed: " + error.stderr.strip())
    print("PASS: Greasy Fork Dark snapshot invariants satisfied")


if __name__ == "__main__":
    main()
