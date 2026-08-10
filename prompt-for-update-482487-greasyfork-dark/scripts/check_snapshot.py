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
    "border-bottom",
    "border-color",
    "border-left",
    "border-right",
    "border-top",
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
    quote = ""
    escaped = False
    while index < len(css):
        if quote:
            char = css[index]
            active.append(char)
            if escaped:
                escaped = False
            elif char == chr(92):
                escaped = True
            elif char == quote:
                quote = ""
            index += 1
            continue
        if css.startswith("/*", index):
            end = css.find("*/", index + 2)
            if end < 0:
                fail("unterminated CSS comment")
            comments.append(css[index : end + 2])
            index = end + 2
        else:
            char = css[index]
            if char == chr(92):
                active.append(char)
                if index + 1 < len(css):
                    active.append(css[index + 1])
                    index += 2
                else:
                    index += 1
                continue
            active.append(char)
            if char in ("'", '"'):
                quote = char
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
        elif escaped:
            escaped = False
        elif char in ("'", '"'):
            quote = char
        elif char == chr(92):
            escaped = True
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


def _remove_css_whitespace(value):
    active, _ = scan_comments(value)
    result = []
    index = 0
    quote = ""
    pending_space = False
    while index < len(active):
        char = active[index]
        if quote:
            if pending_space:
                result.append(" ")
                pending_space = False
            result.append(char)
            if char == chr(92) and index + 1 < len(active):
                result.append(active[index + 1])
                index += 2
                continue
            if char == quote:
                quote = ""
            index += 1
            continue
        if char in ("'", '"'):
            if pending_space:
                result.append(" ")
                pending_space = False
            quote = char
            result.append(char)
        elif char.isspace():
            pending_space = True
        else:
            if pending_space:
                if result and result[-1] not in "([,>+~" and char not in ")]>,+~(":
                    result.append(" ")
                pending_space = False
            result.append(char)
        index += 1
    return "".join(result)


def _canonicalize_media_features(value):
    result = []
    index = 0
    quote = ""
    while index < len(value):
        char = value[index]
        if quote:
            result.append(char)
            if char == chr(92) and index + 1 < len(value):
                result.append(value[index + 1])
                index += 2
                continue
            if char == quote:
                quote = ""
            index += 1
            continue
        if char in ("'", '"'):
            quote = char
            result.append(char)
            index += 1
            continue
        match = re.match(r"(?:max-width|min-width)\s*:", value[index:])
        if match:
            result.append("width<=" if value.startswith("max-width", index) else "width>=")
            index += len(match.group(0))
            continue
        match = re.match(r"width\s*(?:<=|>=)\s*", value[index:])
        if match:
            result.append("width" + match.group(0)[5:].replace(" ", ""))
            index += len(match.group(0))
            continue
        result.append(char)
        index += 1
    return "".join(result)


def _quoted_attribute_value(value):
    if len(value) < 2 or value[0] not in ("'", '"'):
        return None
    quote = value[0]
    escaped = False
    for index in range(1, len(value)):
        char = value[index]
        if escaped:
            escaped = False
        elif char == chr(92):
            escaped = True
        elif char == quote:
            if index != len(value) - 1:
                return None
            return value[1:index]
    return None


def _canonicalize_attribute_content(content):
    operators = ("~=", "|=", "^=", "$=", "*=", "=")
    quote = ""
    escaped = False
    operator_start = None
    operator = None
    index = 0
    while index < len(content):
        char = content[index]
        if quote:
            if escaped:
                escaped = False
            elif char == chr(92):
                escaped = True
            elif char == quote:
                quote = ""
            index += 1
            continue
        if char in ("'", '"'):
            quote = char
            index += 1
            continue
        for candidate in operators:
            if content.startswith(candidate, index):
                operator_start = index
                operator = candidate
                break
        if operator is not None:
            break
        if char == chr(92):
            index += 2
        else:
            index += 1
    if operator is None:
        return content
    left = content[:operator_start].strip()
    right = content[operator_start + len(operator) :].strip()
    quoted = _quoted_attribute_value(right)
    if quoted is not None and re.fullmatch(r"[-_a-zA-Z][-_a-zA-Z0-9]*", quoted):
        right = quoted
    return left + operator + right


def _canonicalize_attributes(value):
    result = []
    index = 0
    quote = ""
    while index < len(value):
        char = value[index]
        if quote:
            result.append(char)
            if char == chr(92) and index + 1 < len(value):
                result.append(value[index + 1])
                index += 2
                continue
            if char == quote:
                quote = ""
            index += 1
            continue
        if char in ("'", '"'):
            quote = char
            result.append(char)
            index += 1
            continue
        if char != "[":
            result.append(char)
            if char == chr(92) and index + 1 < len(value):
                result.append(value[index + 1])
                index += 2
            else:
                index += 1
            continue
        end = index + 1
        attribute_quote = ""
        escaped = False
        while end < len(value):
            current = value[end]
            if attribute_quote:
                if escaped:
                    escaped = False
                elif current == chr(92):
                    escaped = True
                elif current == attribute_quote:
                    attribute_quote = ""
            elif current in ("'", '"'):
                attribute_quote = current
            elif current == chr(92):
                end += 1
            elif current == "]":
                break
            end += 1
        if end >= len(value) or attribute_quote:
            result.append(char)
            index += 1
            continue
        result.append("[" + _canonicalize_attribute_content(value[index + 1 : end]) + "]")
        index = end + 1
    return "".join(result)


def normalize(value):
    value = _remove_css_whitespace(value)
    value = _canonicalize_media_features(value)
    return _canonicalize_attributes(value)


def css_whitespace_metrics(css):
    lines = css.splitlines()
    if lines and not lines[-1].strip():
        lines.pop()
    return {
        "tabs": sum(line.count("\t") for line in lines),
        "trailing_whitespace_lines": sum(
            line.rstrip() != line for line in lines
        ),
    }


def _iter_css_code(css):
    """Yield non-comment, non-string CSS characters with nesting context."""
    index = 0
    parentheses = 0
    brackets = 0
    while index < len(css):
        if css.startswith("/*", index):
            end = css.find("*/", index + 2)
            if end < 0:
                fail("unterminated CSS comment")
            index = end + 2
            continue
        char = css[index]
        if char in ("'", '"'):
            quote = char
            index += 1
            while index < len(css):
                if css[index] == chr(92):
                    index += 2
                elif css[index] == quote:
                    index += 1
                    break
                else:
                    index += 1
            else:
                fail("unterminated CSS string")
            continue
        if char == chr(92):
            index += 2
            continue
        yield index, char, parentheses, brackets
        if char == "(":
            parentheses += 1
        elif char == ")" and parentheses:
            parentheses -= 1
        elif char == "[":
            brackets += 1
        elif char == "]" and brackets:
            brackets -= 1
        index += 1


def _find_css_block_opening(css, start=0):
    for index, char, parentheses, brackets in _iter_css_code(css[start:]):
        index += start
        if char == "{" and not parentheses and not brackets:
            return index
        if char == "}" and not parentheses and not brackets:
            return None
    return None


def _matching_css_brace(css, opening):
    depth = 1
    for index, char, parentheses, brackets in _iter_css_code(css[opening + 1 :]):
        index += opening + 1
        if char == "{" and not parentheses and not brackets:
            depth += 1
        elif char == "}" and not parentheses and not brackets:
            depth -= 1
            if depth == 0:
                return index
    fail("unbalanced CSS braces")


def _has_top_level_css_brace(css):
    return any(
        char == "{" and not parentheses and not brackets
        for _, char, parentheses, brackets in _iter_css_code(css)
    )


def _last_css_statement_separator(css, start, end):
    separator = start
    for index, char, parentheses, brackets in _iter_css_code(css[start:end]):
        if char == ";" and not parentheses and not brackets:
            separator = start + index + 1
    return separator


def _parse_css_blocks(css):
    blocks = []
    cursor = 0
    while cursor < len(css):
        opening = _find_css_block_opening(css, cursor)
        if opening is None:
            break
        header_start = _last_css_statement_separator(css, cursor, opening)
        closing = _matching_css_brace(css, opening)
        body = css[opening + 1 : closing]
        children = _parse_css_blocks(body) if _has_top_level_css_brace(body) else []
        blocks.append((css[header_start:opening].strip(), body, children))
        cursor = closing + 1
    return blocks


def _ordered_css_block_events(body):
    cursor = 0
    while True:
        opening = _find_css_block_opening(body, cursor)
        if opening is None:
            break
        header_start = _last_css_statement_separator(body, cursor, opening)
        for segment in _declaration_segments(body[cursor:header_start]):
            yield "declaration", segment
        closing = _matching_css_brace(body, opening)
        child_body = body[opening + 1 : closing]
        children = _parse_css_blocks(child_body) if _has_top_level_css_brace(child_body) else []
        yield "nested-rule", (
            body[header_start:opening].strip(),
            child_body,
            children,
        )
        cursor = closing + 1
    for segment in _declaration_segments(body[cursor:]):
        yield "declaration", segment


def css_rule_sequence(css):
    css = remove_excluded_branches(css)
    found = []

    def visit(blocks, context):
        for header, _, children in blocks:
            active_header, _ = scan_comments(header)
            selector = active_header.strip()
            key = normalize(selector)
            if key and not key.startswith("@") and not key.startswith(":root"):
                found.append((context, key))
            visit(children, context + ((key,) if key else ()))

    visit(_parse_css_blocks(css), ())
    return found


def css_selector_sequence(css):
    return [selector for _, selector in css_rule_sequence(css)]


def css_selectors(css):
    return set(css_selector_sequence(css))


def repeated_css_selector_counts(css):
    return Counter(css_selector_sequence(css))


def repeated_css_rule_counts(css):
    return Counter(css_rule_sequence(css))


def css_rule_selectors(css):
    return set(css_rule_sequence(css))


def _top_level_css_block_headers(css):
    header_start = 0
    braces = 0
    for index, char, parentheses, brackets in _iter_css_code(css):
        if parentheses or brackets:
            continue
        if char == "{":
            if braces == 0:
                yield header_start, index
            braces += 1
        elif char == "}":
            braces -= 1
            if braces < 0:
                fail("CSS closing delimiter appears before its opener")
            if braces == 0:
                header_start = index + 1
        elif char == ";" and braces == 0:
            header_start = index + 1


def _mask_css_parenthesized_literals(css):
    chars = [" "] * len(css)
    for index, char, parentheses, brackets in _iter_css_code(css):
        if not parentheses and not brackets:
            chars[index] = char
    return "".join(chars)


def _media_query_has_dark_scheme(header):
    masked = _mask_css_literals(header)
    media = re.search(r"@media\b", masked, flags=re.IGNORECASE)
    if media is None:
        return False

    feature = []
    function_context = []
    for index, char, parentheses, _ in _iter_css_code(masked[media.end() :]):
        absolute_index = media.end() + index
        if char == "(":
            previous = masked[absolute_index - 1] if absolute_index else ""
            function_context.append(previous.isalnum() or previous in "_-")
            continue
        if char == ")":
            if function_context:
                function_context.pop()
            continue
        if parentheses and not any(function_context):
            feature.append(char)
        else:
            feature.append(" ")
    return re.search(
        r"prefers-color-scheme\s*:\s*dark",
        "".join(feature),
        flags=re.IGNORECASE,
    ) is not None


def _excluded_css_branch(css):
    for header_start, opening in _top_level_css_block_headers(css):
        header = css[header_start:opening]
        root = re.search(
            r":root\s*$",
            _mask_css_parenthesized_literals(header),
        )
        if root:
            return header_start + root.start(), opening
        media = re.search(r"@media\b", header, flags=re.IGNORECASE)
        if media and _media_query_has_dark_scheme(header):
            return header_start + media.start(), opening
    return None


def remove_excluded_branches(css):
    while True:
        branch = _excluded_css_branch(css)
        if branch is None:
            return css
        start, opening = branch
        closing = _matching_css_brace(css, opening)
        css = css[:start] + css[closing + 1 :]


def _mask_css_literals(css):
    chars = list(css)
    index = 0
    quote = ""
    while index < len(css):
        if quote:
            if css[index] == chr(92):
                chars[index] = " "
                index += 1
                if index < len(css) and css[index] not in "\r\n":
                    chars[index] = " "
                    index += 1
            elif css[index] == quote:
                chars[index] = " "
                quote = ""
                index += 1
            else:
                if css[index] not in "\r\n":
                    chars[index] = " "
                index += 1
            continue
        if css.startswith("/*", index):
            end = css.find("*/", index + 2)
            if end < 0:
                fail("unterminated CSS comment")
            for position in range(index, end + 2):
                if css[position] not in "\r\n":
                    chars[position] = " "
            index = end + 2
            continue
        if css[index] in ("'", '"'):
            quote = css[index]
            chars[index] = " "
        elif css[index] == chr(92):
            chars[index] = " "
            if index + 1 < len(css) and css[index + 1] not in "\r\n":
                chars[index + 1] = " "
            index += 2
            continue
        index += 1
    return "".join(chars)


def _declaration_token(segment):
    declaration = _declaration_parts(segment)
    if declaration is None:
        return None
    property_name, value = declaration
    if property_name.startswith("--") or property_name in NON_COLOR_PROPERTIES:
        return None
    return property_name, " ".join(value.split())


def _declaration_parts(segment):
    active, _ = scan_comments(segment)
    match = re.match(
        r"\s*([-_a-zA-Z][-_a-zA-Z0-9]*)\s*:\s*(.*?)\s*$",
        active,
        flags=re.DOTALL,
    )
    if not match:
        return None
    return match.group(1), match.group(2)


def _declaration_segments(body):
    start = 0
    cursor = 0
    while cursor < len(body):
        progressed = False
        for index, char, parentheses, brackets in _iter_css_code(body[cursor:]):
            index += cursor
            if char == "{" and not parentheses and not brackets:
                cursor = _matching_css_brace(body, index) + 1
                start = cursor
                progressed = True
                break
            if char == ";" and not parentheses and not brackets:
                yield body[start:index]
                start = index + 1
                cursor = start
                progressed = True
                break
        if not progressed:
            if start < len(body):
                yield body[start:]
            return


def _declaration_tokens_in_body(body):
    tokens = set()
    for segment in _declaration_segments(body):
        token = _declaration_token(segment)
        if token is not None:
            tokens.add(token)
    return tokens


def declaration_token_sequence_by_context(css):
    return [
        (context, property_name, value)
        for event_type, context, property_name, value in _declaration_event_sequence_by_context(css)
        if event_type == "declaration"
    ]


def declaration_tokens_by_context(css):
    return set(declaration_token_sequence_by_context(css))


def _declaration_event_sequence_by_context(css):
    events = []
    css = remove_excluded_branches(css)

    def visit_block(block, context):
        header, body, _ = block
        active_header, _ = scan_comments(header)
        key = normalize(active_header.strip())
        block_context = context + ((key,) if key else ())
        for event_type, payload in _ordered_css_block_events(body):
            if event_type == "declaration":
                declaration = _declaration_token(payload)
                if declaration is not None:
                    events.append(("declaration", block_context) + declaration)
                continue
            child_header, _, child_children = payload
            active_child_header, _ = scan_comments(child_header)
            child_key = normalize(active_child_header.strip())
            child_context = block_context + ((child_key,) if child_key else ())
            events.append(("nested-rule", block_context, "<nested-rule>", child_key))
            visit_block((child_header, payload[1], child_children), block_context)

    for block in _parse_css_blocks(css):
        visit_block(block, ())
    return events


def ordered_missing_declaration_tokens_by_context(source_css, snapshot_css):
    source_events = _declaration_event_sequence_by_context(source_css)
    snapshot_events = _declaration_event_sequence_by_context(snapshot_css)
    source_by_context = {}
    snapshot_by_context = {}
    for event in source_events:
        source_by_context.setdefault(event[1], []).append(event)
    for event in snapshot_events:
        snapshot_by_context.setdefault(event[1], []).append(event)
    missing = []
    for context, events in source_by_context.items():
        snapshot_context_events = snapshot_by_context.get(context, [])
        cursor = 0
        for event in events:
            try:
                cursor = snapshot_context_events.index(event, cursor) + 1
            except ValueError:
                missing.append(event[1:])
    return missing


def declaration_tokens(css):
    return {
        (property_name, value)
        for _, property_name, value in declaration_tokens_by_context(css)
    }


def _matching_css_parenthesis(css, opening):
    depth = 0
    for index, char, _, _ in _iter_css_code(css[opening:]):
        index += opening
        if char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth == 0:
                return index
    fail("unbalanced CSS function parentheses")


def _css_function_uses(css, function_name):
    uses = []
    function_name = function_name.lower()
    for index, char, _, _ in _iter_css_code(css):
        if char.lower() != function_name[0]:
            continue
        end = index + len(function_name)
        if css[index:end].lower() != function_name or end >= len(css) or css[end] != "(":
            continue
        if index and (css[index - 1].isalnum() or css[index - 1] in "_-"):
            continue
        closing = _matching_css_parenthesis(css, end)
        content = css[end + 1 : closing]
        comma = None
        for content_index, content_char, parentheses, brackets in _iter_css_code(content):
            if content_char == "," and not parentheses and not brackets:
                comma = content_index
                break
        if comma is None:
            name = content
            fallback = None
        else:
            name = content[:comma]
            fallback = content[comma + 1 :]
        active_name, _ = scan_comments(name)
        uses.append((index, closing + 1, active_name.strip(), fallback))
    return uses


def _variable_scope(context):
    return tuple(item for item in context if item.startswith("@"))


def _effective_nested_selector(parent_selector, selector):
    if not selector or selector.startswith("@"):
        return parent_selector
    if not parent_selector:
        return selector
    combined = []
    for parent in _split_selector_list(parent_selector):
        for child in _split_selector_list(selector):
            if "&" in child:
                combined.append(child.replace("&", parent))
            else:
                combined.append(parent + " " + child)
    return normalize(",".join(combined))


def _split_selector_list(selector):
    selectors = []
    start = 0
    parentheses = 0
    brackets = 0
    quote = ""
    escaped = False
    for index, char in enumerate(selector):
        if quote:
            if escaped:
                escaped = False
            elif char == chr(92):
                escaped = True
            elif char == quote:
                quote = ""
            continue
        if char in ("'", '"'):
            quote = char
        elif char == chr(92):
            escaped = True
        elif char == "(":
            parentheses += 1
        elif char == ")" and parentheses:
            parentheses -= 1
        elif char == "[":
            brackets += 1
        elif char == "]" and brackets:
            brackets -= 1
        elif char == "," and not parentheses and not brackets:
            selectors.append(selector[start:index].strip())
            start = index + 1
    selectors.append(selector[start:].strip())
    return [item for item in selectors if item]


def _selector_compounds(selector):
    compounds = []
    current = []
    parentheses = 0
    brackets = 0
    quote = ""
    escaped = False
    index = 0
    while index < len(selector):
        char = selector[index]
        if quote:
            current.append(char)
            if escaped:
                escaped = False
            elif char == chr(92):
                escaped = True
            elif char == quote:
                quote = ""
            index += 1
            continue
        if char in ("'", '"'):
            quote = char
            current.append(char)
        elif char == chr(92):
            current.append(char)
            if index + 1 < len(selector):
                current.append(selector[index + 1])
                index += 1
        elif char == "(":
            parentheses += 1
            current.append(char)
        elif char == ")" and parentheses:
            parentheses -= 1
            current.append(char)
        elif char == "[":
            brackets += 1
            current.append(char)
        elif char == "]" and brackets:
            brackets -= 1
            current.append(char)
        elif not parentheses and not brackets and (
            char.isspace() or char in ">+~"
        ):
            if current:
                compounds.append("".join(current))
                current = []
        else:
            current.append(char)
        index += 1
    if current:
        compounds.append("".join(current))
    return compounds


def _selector_prefix_contains(candidate, selector):
    if candidate == selector:
        return True
    if not selector.startswith(candidate):
        return False
    return selector[len(candidate)] in ".#:[ >+~"


def _compound_contains(candidate, compound):
    if candidate == "*":
        return True
    start = compound.find(candidate)
    while start >= 0:
        end = start + len(candidate)
        before = start == 0 or compound[start - 1] in ".#:["
        after = end == len(compound) or compound[end] in ".#:["
        if before and after:
            return True
        start = compound.find(candidate, start + 1)
    return False


def _strip_document_root(selector):
    for root in ("html", "body", ":root"):
        if selector == root:
            return ""
        if selector.startswith(root) and selector[len(root)] in ".#:[ >+~":
            return selector[len(root) :].lstrip(" >+~")
    return None


def _selector_alternative_scope_contains(declaration_selector, use_selector):
    if declaration_selector == "*":
        return True
    if declaration_selector in ("html", "body", ":root"):
        return True
    if _selector_prefix_contains(declaration_selector, use_selector):
        return True

    rootless = _strip_document_root(declaration_selector)
    if rootless is not None and (
        not rootless or _selector_prefix_contains(rootless, use_selector)
    ):
        return True

    declaration_compounds = _selector_compounds(declaration_selector)
    use_compounds = _selector_compounds(use_selector)
    if len(declaration_compounds) == 1:
        return any(
            _compound_contains(declaration_compounds[0], compound)
            for compound in use_compounds
        )
    if len(declaration_compounds) > 1:
        for offset in range(len(use_compounds) - len(declaration_compounds) + 1):
            if all(
                _compound_contains(candidate, use_compounds[offset + index])
                for index, candidate in enumerate(declaration_compounds)
            ):
                return True
    return False


def _selector_scope_contains(declaration_selector, use_selector):
    if not declaration_selector or not use_selector:
        return False
    declaration_selectors = _split_selector_list(declaration_selector)
    use_selectors = _split_selector_list(use_selector)
    return all(
        any(
            _selector_alternative_scope_contains(candidate, use)
            for candidate in declaration_selectors
        )
        for use in use_selectors
    )


def _declared_in_scope(declarations, scope, selector, name):
    for length in range(len(scope), -1, -1):
        for declaration_selector, declaration_name in declarations.get(scope[:length], set()):
            if declaration_name == name and _selector_scope_contains(
                declaration_selector, selector
            ):
                return True
    return False


def _value_resolves(value, scope, selector, declarations):
    uses = _css_function_uses(value, "var")
    if not uses:
        return bool(value.strip())
    cursor = 0
    has_literal = False
    for start, end, name, fallback in uses:
        if value[cursor:start].strip():
            has_literal = True
        if not _variable_use_resolves(name, fallback, scope, selector, declarations):
            return False
        cursor = end
    if value[cursor:].strip():
        has_literal = True
    return has_literal or bool(uses)


def _variable_use_resolves(name, fallback, scope, selector, declarations):
    if not re.fullmatch(r"--[-_a-zA-Z0-9]+", name):
        return False
    if _declared_in_scope(declarations, scope, selector, name):
        return True
    return fallback is not None and _value_resolves(
        fallback, scope, selector, declarations
    )


def unresolved_css_variables(css):
    declarations = {}
    uses = []
    css = remove_excluded_branches(css)

    def visit(blocks, context, parent_selector):
        for header, body, children in blocks:
            active_header, _ = scan_comments(header)
            key = normalize(active_header.strip())
            block_context = context + ((key,) if key else ())
            scope = _variable_scope(block_context)
            selector = _effective_nested_selector(parent_selector, key)
            for segment in _declaration_segments(body):
                declaration = _declaration_parts(segment)
                if declaration is None:
                    continue
                property_name, value = declaration
                if property_name.startswith("--"):
                    declarations.setdefault(scope, set()).add((selector, property_name))
                uses.extend(
                    (scope, selector, use)
                    for use in _css_function_uses(value, "var")
                )
            visit(children, block_context, selector)

    visit(_parse_css_blocks(css), (), None)
    unresolved = []
    for scope, selector, (_, _, name, fallback) in uses:
        if not _variable_use_resolves(name, fallback, scope, selector, declarations):
            unresolved.append(name)
    return unresolved


def hex_colors(css):
    colors = set()
    for index, char, _, _ in _iter_css_code(css):
        if char != "#":
            continue
        end = index + 1
        while end < len(css) and css[end] in "0123456789abcdefABCDEF":
            end += 1
        token = css[index:end]
        if len(token) in (4, 5, 7, 9):
            colors.add(token)
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
    structural = _mask_css_literals(general)

    if ORPHAN_COMMENT_CATALOG in general:
        fail("orphan preserved-comment catalogue remains; attach comments to declarations or rules")
    if STRUCTURAL_MARKER in source or APPLICATION_COMMENT in source:
        fail("duplicate structural snapshot or upstream application-asset comment remains")
    excluded_branch = _excluded_css_branch(general)
    if excluded_branch is not None:
        branch_start, opening = excluded_branch
        branch_header = general[branch_start:opening]
        if re.search(
            r":root\s*$",
            _mask_css_parenthesized_literals(branch_header),
        ):
            fail("active :root variable block remains")
        if _media_query_has_dark_scheme(branch_header):
            fail("active official dark branch remains")
    for marker in REQUIRED_MARKERS:
        if marker not in structural:
            fail("missing current CSS structure marker: " + marker)
    for marker in SUPPLEMENTAL_MARKERS:
        if marker not in source:
            fail("missing supplemental style marker: " + marker)
    braces, parentheses, quote, escaped, _ = scan_balance(general)
    if (braces, parentheses) != (0, 0) or quote or escaped:
        fail("unbalanced CSS braces, parentheses, quotes, or escapes")

    unresolved = unresolved_css_variables(general)
    if unresolved:
        fail("unresolved CSS variable: " + unresolved[0])

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
        upstream = remove_excluded_branches(args.upstream_css.read_text())
        missing = sorted(css_rule_selectors(upstream) - css_rule_selectors(general))
        if missing:
            fail("current upstream selectors missing: " + repr(missing[:12]))
        upstream_counts = repeated_css_rule_counts(upstream)
        snapshot_counts = repeated_css_rule_counts(general)
        collapsed = sorted(
            (selector, count, snapshot_counts.get(selector, 0))
            for selector, count in upstream_counts.items()
            if count > 1 and snapshot_counts.get(selector, 0) < count
        )
        if collapsed:
            fail("repeated upstream CSS blocks were collapsed: " + repr(collapsed[:12]))
        missing_tokens = ordered_missing_declaration_tokens_by_context(
            upstream, general
        )
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
