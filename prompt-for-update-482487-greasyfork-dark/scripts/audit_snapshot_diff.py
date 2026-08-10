#!/usr/bin/env python3
"""Audit a userscript before/after diff against the raw CSS source."""

from __future__ import annotations

import argparse
from collections import Counter
import difflib
import importlib.util
import re
import subprocess
from pathlib import Path


CHECKER_PATH = Path(__file__).with_name("check_snapshot.py")
SPEC = importlib.util.spec_from_file_location("check_snapshot", CHECKER_PATH)
CHECKER = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(CHECKER)


def without_general(source: str) -> str:
    marker = CHECKER.GENERAL_MARKER
    if source.count(marker) != 1:
        raise ValueError("expected exactly one // general marker")
    marker_index = source.index(marker)
    opening = source.index("`", marker_index)
    closing = source.index("`", opening + 1)
    return source[:opening] + "`<GENERAL-SNAPSHOT>`" + source[closing + 1 :]


def format_only_changes(before: str, after: str) -> list[str]:
    findings = []
    before_lines = before.splitlines()
    after_lines = after.splitlines()
    exact_common = sum(
        (Counter(before_lines) & Counter(after_lines)).values()
    )
    normalized_before = ["".join(line.split()) for line in before_lines]
    normalized_after = ["".join(line.split()) for line in after_lines]
    normalized_common = sum(
        (Counter(normalized_before) & Counter(normalized_after)).values()
    )
    if normalized_common > exact_common:
        findings.append(
            f"{normalized_common - exact_common} lines retain code after whitespace normalization"
        )
    matcher = difflib.SequenceMatcher(a=before_lines, b=after_lines)
    for tag, start, end, other_start, other_end in matcher.get_opcodes():
        if tag != "replace":
            continue
        old = before_lines[start:end]
        new = after_lines[other_start:other_end]
        if len(old) != len(new):
            continue
        if all("".join(left.split()) == "".join(right.split()) for left, right in zip(old, new)):
            findings.append(f"lines {start + 1}-{end}: whitespace-only rewrite")
    return findings


def forbidden_transformations(before: str, after: str) -> list[str]:
    findings = []
    if re.search(r"margin\s*:\s*auto 0(?:\s*;)?", before) and re.search(
        r"margin\s*:\s*auto 0px\s*;", after
    ):
        findings.append("margin: auto 0 -> margin: auto 0px;")
    for match in re.finditer(r"""[^{}\n]*\[[^\]=]+=[^\]"']+\][^{}\n]*""", before):
        unquoted = match.group(0)
        quoted = re.sub(r"""(\[[^=\]]+=)([^\]"']+)(\])""", r'\1"\2"\3', unquoted)
        # A historical snapshot may intentionally contain both spellings in
        # separate cascade units. Report an actual conversion only when the
        # quoted spelling is newly added and the unquoted spelling is removed.
        if after.count(quoted) > before.count(quoted) and after.count(unquoted) < before.count(unquoted):
            findings.append(f"attribute-selector quote addition: {unquoted.strip()}")
    return findings


def ordered_missing(source_sequence: list[str], snapshot_sequence: list[str]) -> list[str]:
    cursor = 0
    missing = []
    for selector in source_sequence:
        try:
            cursor = snapshot_sequence.index(selector, cursor) + 1
        except ValueError:
            missing.append(selector)
    return missing


def audit(
    before: str,
    after: str,
    source: str,
    before_name: str = "before",
    after_name: str = "after",
) -> dict[str, object]:
    diff = subprocess.run(
        ["diff", "-U3", before_name, after_name],
        input=None,
        capture_output=True,
        text=True,
    )
    before_general = CHECKER.extract_general(before)
    after_general = CHECKER.extract_general(after)
    source = CHECKER.remove_excluded_branches(source)
    whitespace = CHECKER.css_whitespace_metrics(after_general)
    after_snapshot_tabs = whitespace["tabs"]
    after_snapshot_trailing_whitespace_lines = whitespace[
        "trailing_whitespace_lines"
    ]
    after_general = CHECKER.remove_excluded_branches(after_general)
    source_sequence = CHECKER.css_rule_sequence(source)
    after_sequence = CHECKER.css_rule_sequence(after_general)
    source_counts = CHECKER.repeated_css_rule_counts(source)
    after_counts = CHECKER.repeated_css_rule_counts(after_general)
    collapsed = sorted(
        (selector, count, after_counts.get(selector, 0))
        for selector, count in source_counts.items()
        if count > 1 and after_counts.get(selector, 0) < count
    )
    missing_tokens = CHECKER.ordered_missing_declaration_tokens_by_context(
        source, after_general
    )
    return {
        "diff_hunks": sum(line.startswith("@@") for line in diff.stdout.splitlines()),
        "diff_changed_lines": sum(
            line.startswith(("+", "-")) and not line.startswith(("+++", "---"))
            for line in diff.stdout.splitlines()
        ),
        "outside_general_changed": without_general(before) != without_general(after),
        "format_only_changes": format_only_changes(before_general, after_general),
        "forbidden_transformations": forbidden_transformations(before_general, after_general),
        "ordered_missing_selectors": ordered_missing(source_sequence, after_sequence),
        "collapsed_repeated_blocks": collapsed,
        "missing_non_color_tokens": missing_tokens,
        "snapshot_tabs": after_snapshot_tabs,
        "snapshot_trailing_whitespace_lines": after_snapshot_trailing_whitespace_lines,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--before", type=Path, required=True)
    parser.add_argument("--after", type=Path, required=True)
    parser.add_argument("--source-css", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    result = audit(
        args.before.read_text(),
        args.after.read_text(),
        args.source_css.read_text(),
        str(args.before),
        str(args.after),
    )
    findings = {
        key: value
        for key, value in result.items()
        if key != "diff_hunks" and key != "diff_changed_lines" and value
    }
    print("SNAPSHOT_DIFF_AUDIT: " + ("FAIL" if findings else "PASS"))
    for key, value in result.items():
        print(f"{key}: {value}")
    if args.strict and findings:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
