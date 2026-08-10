#!/usr/bin/env python3
"""Format raw application CSS into the owner's snapshot style without normalizing values."""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from dataclasses import dataclass
import importlib.util
import re
from pathlib import Path


CHECKER_PATH = Path(__file__).with_name("check_snapshot.py")
SPEC = importlib.util.spec_from_file_location("check_snapshot", CHECKER_PATH)
CHECKER = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(CHECKER)


OWNER_COLOR_PROPERTIES = set(CHECKER.NON_COLOR_PROPERTIES) | {
    "border-bottom",
    "border-left",
    "border-right",
    "border-top",
    "column-rule-color",
    "outline-color",
}
ORPHAN_COMMENT_CATALOG = "/* Preserved comments from the previous // general snapshot. */"


@dataclass
class Declaration:
    text: str
    terminated: bool


@dataclass
class Block:
    header: str
    declarations: list[Declaration]
    children: list["Block"]
    items: list[Declaration | "Block"]


def _iter_css_code(css: str):
    """Yield CSS code characters with the nesting state before each character."""
    index = 0
    quote = ""
    comment = False
    parenthesis_depth = 0
    bracket_depth = 0
    while index < len(css):
        if comment:
            if css.startswith("*/", index):
                comment = False
                index += 2
                continue
            index += 1
            continue
        if quote:
            char = css[index]
            if char == "\\":
                index += 2
                continue
            if char == quote:
                quote = ""
            index += 1
            continue
        if css.startswith("/*", index):
            comment = True
            index += 2
            continue
        char = css[index]
        if char == "\\":
            index += 2
            continue
        yield index, char, parenthesis_depth, bracket_depth
        if char in "\"'":
            quote = char
        elif char == "(":
            parenthesis_depth += 1
        elif char == ")" and parenthesis_depth:
            parenthesis_depth -= 1
        elif char == "[":
            bracket_depth += 1
        elif char == "]" and bracket_depth:
            bracket_depth -= 1
        index += 1


def matching_brace(css: str, opening: int) -> int:
    depth = 1
    offset = opening + 1
    for index, char, parenthesis_depth, bracket_depth in _iter_css_code(css[offset:]):
        if char == "{" and parenthesis_depth == 0 and bracket_depth == 0:
            depth += 1
        elif char == "}" and parenthesis_depth == 0 and bracket_depth == 0:
            depth -= 1
            if depth == 0:
                return offset + index
    raise ValueError("unbalanced CSS braces")


def has_top_level_brace(css: str) -> bool:
    return any(
        char == "{" and parenthesis_depth == 0 and bracket_depth == 0
        for _, char, parenthesis_depth, bracket_depth in _iter_css_code(css)
    )


def _find_top_level_opening(css: str, start: int = 0) -> int | None:
    for index, char, parenthesis_depth, bracket_depth in _iter_css_code(css[start:]):
        if char == "{" and parenthesis_depth == 0 and bracket_depth == 0:
            return start + index
    return None


def _last_top_level_semicolon(css: str) -> int | None:
    separator = None
    for index, char, parenthesis_depth, bracket_depth in _iter_css_code(css):
        if char == ";" and parenthesis_depth == 0 and bracket_depth == 0:
            separator = index
    return separator


def _first_top_level_semicolon(css: str, start: int = 0) -> int | None:
    for index, char, parenthesis_depth, bracket_depth in _iter_css_code(css[start:]):
        if char == ";" and parenthesis_depth == 0 and bracket_depth == 0:
            return start + index
    return None


def _append_declaration(result: list[Declaration], text: str, terminated: bool) -> None:
    text = text.strip()
    if not text:
        return
    leading, remainder = leading_comments(text)
    if leading and result:
        result[-1].text += " " + " ".join(comments_in(leading))
        text = remainder.strip()
    if result and comments_only(text):
        result[-1].text += " " + text
    elif text:
        result.append(Declaration(text, terminated))


def split_declarations(body: str) -> list[Declaration]:
    result = []
    start = 0
    for index, char, parenthesis_depth, bracket_depth in _iter_css_code(body):
        if (
            char == ";"
            and parenthesis_depth == 0
            and bracket_depth == 0
        ):
            _append_declaration(result, body[start:index], True)
            start = index + 1
    _append_declaration(result, body[start:], False)
    return result


def _mask_css_tokens(css: str, *, mask_strings: bool) -> str:
    chars = list(css)
    index = 0
    quote = ""
    while index < len(css):
        if quote:
            char = css[index]
            if char == "\\":
                if mask_strings:
                    chars[index] = " " if char not in "\n\r" else char
                    if index + 1 < len(css) and css[index + 1] not in "\n\r":
                        chars[index + 1] = " "
                index += 2
                continue
            if char == quote:
                if mask_strings and char not in "\n\r":
                    chars[index] = " "
                quote = ""
            elif mask_strings and char not in "\n\r":
                chars[index] = " "
            index += 1
            continue
        if css.startswith("/*", index):
            end = css.find("*/", index + 2)
            if end < 0:
                raise ValueError("unterminated CSS comment")
            for position in range(index, end + 2):
                if css[position] not in "\n\r":
                    chars[position] = " "
            index = end + 2
            continue
        char = css[index]
        if char in "\"'":
            quote = char
            if mask_strings:
                chars[index] = " "
        elif char == "\\":
            index += 2
            continue
        index += 1
    return "".join(chars)


def _css_nesting_depths(css: str) -> dict[int, tuple[int, int]]:
    return {
        index: (parenthesis_depth, bracket_depth)
        for index, _, parenthesis_depth, bracket_depth in _iter_css_code(css)
    }


def _first_top_level_match(
    pattern: re.Pattern[str], masked: str, depths: dict[int, tuple[int, int]]
):
    start = 0
    while match := pattern.search(masked, start):
        if depths.get(match.start(), (0, 0)) == (0, 0):
            return match
        start = match.start() + 1
    return None


def leading_comments(text: str) -> tuple[str, str]:
    cursor = 0
    while True:
        while cursor < len(text) and text[cursor].isspace():
            cursor += 1
        if not text.startswith("/*", cursor):
            return text[:cursor], text[cursor:]
        closing = text.find("*/", cursor + 2)
        if closing < 0:
            raise ValueError("unterminated CSS comment")
        cursor = closing + 2


def comments_only(text: str) -> bool:
    return not mask_comments(text).strip() and bool(comments_in(text))


def find_excluded_branch(css: str) -> tuple[int, int] | None:
    masked = _mask_css_tokens(css, mask_strings=True)
    depths = _css_nesting_depths(css)
    candidates = []
    root_match = _first_top_level_match(re.compile(r":root\s*\{"), masked, depths)
    if root_match:
        candidates.append((root_match.start(), root_match.end() - 1))

    for index, char, parenthesis_depth, bracket_depth in _iter_css_code(css):
        if char != "@" or parenthesis_depth or bracket_depth:
            continue
        media_match = re.match(r"@media\b", css[index:], re.IGNORECASE)
        if not media_match:
            continue
        prelude_start = index + media_match.end()
        opening = next(
            (
                prelude_start + relative_index
                for relative_index, prelude_char, prelude_parenthesis, prelude_bracket in _iter_css_code(
                    css[prelude_start:]
                )
                if prelude_char == "{"
                and prelude_parenthesis == 0
                and prelude_bracket == 0
            ),
            None,
        )
        if opening is not None:
            prelude = _mask_css_tokens(css[prelude_start:opening], mask_strings=True)
            if re.search(
                r"prefers-color-scheme\s*:\s*dark", prelude, re.IGNORECASE
            ):
                candidates.append((index, opening))

    return min(candidates) if candidates else None


def remove_excluded_branches_keep_comments(css: str) -> str:
    while True:
        branch = find_excluded_branch(css)
        if branch is None:
            return css
        start, opening = branch
        closing = matching_brace(css, opening)
        css = css[:start] + css[closing + 1 :]


def mask_comments(css: str) -> str:
    return _mask_css_tokens(css, mask_strings=False)


def split_leading_statements(css: str) -> tuple[list[str], str]:
    statements = []
    cursor = 0
    while True:
        semicolon = _first_top_level_semicolon(css, cursor)
        opening = _find_top_level_opening(css, cursor)
        if semicolon is None or (opening is not None and opening < semicolon):
            break
        statement = css[cursor : semicolon + 1]
        masked = mask_comments(statement)
        if not re.match(r"\s*@(?:charset|import)\b", masked, re.IGNORECASE):
            break
        statements.append(statement.strip())
        cursor = semicolon + 1
    return statements, css[cursor:]


def _parse_block_body(body: str) -> tuple[list[Declaration], list[Block], list[Declaration | Block]]:
    items: list[Declaration | Block] = []
    cursor = 0
    while True:
        opening = _find_top_level_opening(body, cursor)
        if opening is None:
            items.extend(split_declarations(body[cursor:]))
            break

        prelude = body[cursor:opening]
        separator = _last_top_level_semicolon(prelude)
        declaration_end = separator + 1 if separator is not None else 0
        items.extend(split_declarations(prelude[:declaration_end]))

        header = prelude[declaration_end:].strip()
        if not header:
            raise ValueError("CSS nested block without a header")
        closing = matching_brace(body, opening)
        child_body = body[opening + 1 : closing]
        declarations, children, child_items = _parse_block_body(child_body)
        items.append(Block(header, declarations, children, child_items))
        cursor = closing + 1

    declarations = [item for item in items if isinstance(item, Declaration)]
    children = [item for item in items if isinstance(item, Block)]
    return declarations, children, items


def parse_blocks(css: str) -> list[Block]:
    _, css = split_leading_statements(css)
    blocks = []
    cursor = 0
    while cursor < len(css):
        opening = _find_top_level_opening(css, cursor)
        if opening is None:
            if css[cursor:].strip():
                raise ValueError("CSS text outside a rule: " + css[cursor:].strip()[:80])
            break
        header = css[cursor:opening].strip()
        closing = matching_brace(css, opening)
        body = css[opening + 1 : closing]
        declarations, children, items = _parse_block_body(body)
        block = Block(header, declarations, children, items)
        blocks.append(block)
        cursor = closing + 1
    return blocks


def _compact_selector(header: str) -> str:
    result = []
    quote = ""
    bracket_depth = 0
    parenthesis_depth = 0
    media_feature_depth = 0
    media_header = bool(
        re.match(r"^\s*(?:(?:/\*.*?\*/\s*)*)@media\b", header, re.IGNORECASE | re.DOTALL)
    )
    pending_space = False
    index = 0

    def append_pending_space(next_char: str) -> None:
        nonlocal pending_space
        if not pending_space:
            return
        previous_char = result[-1] if result else ""
        selector_punctuation = ",>+~|"
        media_punctuation = ":<>=()"
        attribute_punctuation = "=~|^$*"
        discard = (
            not result
            or previous_char in selector_punctuation
            or next_char in selector_punctuation
            or (
                media_feature_depth
                and (
                    previous_char in media_punctuation
                    or next_char in media_punctuation
                )
            )
            or (
                bracket_depth
                and (
                    previous_char in attribute_punctuation + "["
                    or next_char in attribute_punctuation + "]"
                )
            )
        )
        if not discard:
            result.append(" ")
        pending_space = False

    while index < len(header):
        if quote:
            char = header[index]
            result.append(char)
            if char == "\\" and index + 1 < len(header):
                result.append(header[index + 1])
                index += 2
                continue
            if char == quote:
                quote = ""
            index += 1
            continue
        if header.startswith("/*", index):
            closing = header.find("*/", index + 2)
            if closing < 0:
                raise ValueError("unterminated CSS comment")
            index = closing + 2
            continue
        char = header[index]
        if char.isspace():
            pending_space = True
            index += 1
            continue
        if char in "\"'":
            append_pending_space(char)
            quote = char
            result.append(char)
        elif char == "\\":
            append_pending_space(char)
            result.append(char)
            if index + 1 < len(header):
                result.append(header[index + 1])
                index += 2
                continue
        else:
            append_pending_space(char)
            result.append(char)
            if char == "[":
                bracket_depth += 1
            elif char == "]" and bracket_depth:
                bracket_depth -= 1
            elif char == "(":
                parenthesis_depth += 1
                if media_header and parenthesis_depth == 1:
                    media_feature_depth = 1
                elif media_feature_depth:
                    media_feature_depth += 1
            elif char == ")":
                if media_feature_depth:
                    media_feature_depth -= 1
                if parenthesis_depth:
                    parenthesis_depth -= 1
        index += 1
    return "".join(result)


def _replace_outside_quotes(
    text: str, pattern: re.Pattern[str], replacement: str
) -> str:
    result = []
    outside = []
    quote = ""
    index = 0
    while index < len(text):
        char = text[index]
        if quote:
            result.append(char)
            if char == "\\" and index + 1 < len(text):
                result.append(text[index + 1])
                index += 2
                continue
            if char == quote:
                quote = ""
        elif char in "\"'":
            result.append(pattern.sub(replacement, "".join(outside)))
            outside = []
            result.append(char)
            quote = char
        else:
            outside.append(char)
        index += 1
    result.append(pattern.sub(replacement, "".join(outside)))
    return "".join(result)


def selector_key(header: str) -> str:
    header = _compact_selector(header)
    header = _replace_outside_quotes(
        header, re.compile(r"\bmax-width\s*:", re.IGNORECASE), "width<="
    )
    header = _replace_outside_quotes(
        header, re.compile(r"\bmin-width\s*:", re.IGNORECASE), "width>="
    )

    return re.sub(
        r"\[([^=\]~|^$*]+)([~|^$*]?=)(?:\"([^\"]*)\"|'([^']*)'|([^\]]+))\]",
        lambda match: "[{}{}{}]".format(
            match.group(1),
            match.group(2),
            match.group(3) or match.group(4) or match.group(5) or "",
        ),
        header,
    )


def block_key(path: tuple[str, ...], block: Block) -> tuple[str, ...]:
    return path + (selector_key(block.header),)


def collect_owner_styles(blocks: list[Block]) -> dict[tuple[str, ...], list[Block]]:
    styles: dict[tuple[str, ...], list[Block]] = defaultdict(list)

    def visit(nodes: list[Block], path: tuple[str, ...]) -> None:
        for block in nodes:
            key = block_key(path, block)
            styles[key].append(block)
            if block.children:
                visit(block.children, path + (selector_key(block.header),))

    visit(blocks, ())
    return styles


def collect_owner_contexts(blocks: list[Block]) -> dict[tuple[str, ...], list[Block]]:
    contexts: dict[tuple[str, ...], list[Block]] = defaultdict(list)

    def visit(nodes: list[Block], path: tuple[str, ...]) -> None:
        contexts[path].extend(nodes)
        for block in nodes:
            if block.children:
                visit(block.children, path + (selector_key(block.header),))

    visit(blocks, ())
    return contexts


def property_name(text: str) -> str | None:
    match = re.search(r"(?:^|\*/\s*)([-_a-zA-Z][-_a-zA-Z0-9]*)\s*:", text)
    return match.group(1).lower() if match else None


def infer_indent(owner_css: str) -> str:
    declaration_lines = []
    for line in owner_css.splitlines():
        if re.match(r"^\s*[-_a-zA-Z][-_a-zA-Z0-9]*\s*:", line):
            declaration_lines.append(line)
    indents = [re.match(r"^\s*", line).group(0) for line in declaration_lines]
    indent = Counter(indents).most_common(1)[0][0] if indents else "    "
    return indent


def format_header(header: str) -> list[str]:
    return [line.strip() for line in header.splitlines() if line.strip()]


def merge_owner_header(source_header: str, owner_header: str | None) -> str:
    if owner_header is None:
        return source_header
    source_comments = comments_in(source_header)
    owner_comments = comments_in(owner_header)
    comments = owner_comments + [comment for comment in source_comments if comment not in owner_comments]
    owner_selector = mask_comments(owner_header).strip()
    return "\n".join(comments + [owner_selector]) if comments else owner_selector


def comments_in(text: str) -> list[str]:
    comments = []
    index = 0
    quote = ""
    while index < len(text):
        if quote:
            char = text[index]
            if char == "\\":
                index += 2
                continue
            if char == quote:
                quote = ""
            index += 1
            continue
        if text.startswith("/*", index):
            closing = text.find("*/", index + 2)
            if closing < 0:
                raise ValueError("unterminated CSS comment")
            comments.append(text[index : closing + 2])
            index = closing + 2
            continue
        char = text[index]
        if char in "\"'":
            quote = char
        elif char == "\\":
            index += 2
            continue
        index += 1
    return comments


def normalized_declaration(text: str) -> str:
    text = text.strip()
    if ":" not in text or text.startswith("/*"):
        return text
    name, value = text.split(":", 1)
    return name.strip() + ": " + value.strip()


def owner_overlay_declarations(
    declarations: list[Declaration], owner: Block | None
) -> list[Declaration]:
    if owner is None:
        return declarations
    owner_by_property: dict[str, Declaration] = {}
    for declaration in owner.declarations:
        prop = property_name(declaration.text)
        if prop:
            owner_by_property.setdefault(prop, declaration)
    result = []
    seen_properties = set()
    for declaration in declarations:
        prop = property_name(declaration.text)
        source_text = normalized_declaration(declaration.text)
        owner_declaration = owner_by_property.get(prop) if prop else None
        if owner_declaration is not None:
            seen_properties.add(prop)
            owner_comments = comments_in(owner_declaration.text)
            if prop in OWNER_COLOR_PROPERTIES or prop.startswith("--gfdark-"):
                source_text = normalized_declaration(owner_declaration.text)
            source_comments = comments_in(source_text)
            missing_comments = [comment for comment in owner_comments if comment not in source_comments]
            if missing_comments:
                source_text = source_text.rstrip() + " " + " ".join(missing_comments)
        result.append(Declaration(source_text, declaration.terminated))
    for prop, owner_declaration in owner_by_property.items():
        if prop in seen_properties:
            continue
        if prop in OWNER_COLOR_PROPERTIES or prop.startswith("--gfdark-"):
            if result and not result[-1].terminated:
                result[-1] = Declaration(result[-1].text, True)
            result.append(Declaration(normalized_declaration(owner_declaration.text), owner_declaration.terminated))
    return result


def format_block(
    block: Block,
    path: tuple[str, ...],
    styles: dict[tuple[str, ...], list[Block]],
    owner_contexts: dict[tuple[str, ...], list[Block]],
    occurrences: Counter[tuple[str, ...]],
    indent_unit: str,
    level: int,
) -> list[str]:
    key = block_key(path, block)
    occurrence = occurrences[key]
    occurrences[key] += 1
    owner_matches = styles.get(key, [])
    owner = owner_matches[occurrence] if occurrence < len(owner_matches) else None
    header = merge_owner_header(block.header, owner.header if owner is not None else None)
    lines = []
    for index, header_line in enumerate(format_header(header)):
        lines.append(indent_unit * level + header_line + (" {" if index == len(format_header(header)) - 1 else ""))
    declarations = owner_overlay_declarations(block.declarations, owner)
    declaration_index = 0
    items = block.items or [*block.declarations, *block.children]
    child_path = path + (selector_key(block.header),)
    for item in items:
        if isinstance(item, Declaration):
            declaration = declarations[declaration_index]
            declaration_index += 1
            text = declaration.text
            suffix = ";" if declaration.terminated else ""
            lines.append(indent_unit * (level + 1) + text + suffix)
            continue
        lines.extend(
            format_block(
                item,
                child_path,
                styles,
                owner_contexts,
                occurrences,
                indent_unit,
                level + 1,
            )
        )
    if block.children:
        lines.extend(
            render_nodes(
                [],
                child_path,
                styles,
                owner_contexts,
                occurrences,
                indent_unit,
                level + 1,
            )
        )
    for declaration in declarations[declaration_index:]:
        text = declaration.text
        suffix = ";" if declaration.terminated else ""
        lines.append(indent_unit * (level + 1) + text + suffix)
    lines.append(indent_unit * level + "}")
    return lines


def render_nodes(
    source_nodes: list[Block],
    path: tuple[str, ...],
    styles: dict[tuple[str, ...], list[Block]],
    owner_contexts: dict[tuple[str, ...], list[Block]],
    occurrences: Counter[tuple[str, ...]],
    indent_unit: str,
    level: int,
) -> list[str]:
    lines = []
    for block in source_nodes:
        if lines:
            lines.append("")
        lines.extend(
            format_block(
                block,
                path,
                styles,
                owner_contexts,
                occurrences,
                indent_unit,
                level,
            )
        )

    owner_seen: Counter[tuple[str, ...]] = Counter()
    for owner_block in owner_contexts.get(path, []):
        key = block_key(path, owner_block)
        owner_index = owner_seen[key]
        owner_seen[key] += 1
        source_count = occurrences[key]
        if owner_index < source_count:
            continue
        if lines:
            lines.append("")
        lines.extend(
            format_block(
                owner_block,
                path,
                styles,
                owner_contexts,
                occurrences,
                indent_unit,
                level,
            )
        )
    return lines


def format_snapshot(source_css: str, owner_css: str) -> str:
    source_css = remove_excluded_branches_keep_comments(source_css)
    owner_css = remove_orphan_comment_catalogue(owner_css)
    owner_css = remove_excluded_branches_keep_comments(owner_css)
    source_statements, source_css = split_leading_statements(source_css)
    owner_statements, owner_css = split_leading_statements(owner_css)
    source_blocks = parse_blocks(source_css)
    owner_blocks = parse_blocks(owner_css)
    styles = collect_owner_styles(owner_blocks)
    owner_contexts = collect_owner_contexts(owner_blocks)
    indent_unit = infer_indent(owner_css)
    occurrences: Counter[tuple[str, ...]] = Counter()
    output = render_nodes(source_blocks, (), styles, owner_contexts, occurrences, indent_unit, 0)
    statements = source_statements or owner_statements
    if statements:
        statement_lines = [
            line for statement in statements for line in format_header(statement)
        ]
        output = statement_lines + ([""] if output else []) + output
    return "\n".join(output) + "\n"


def remove_orphan_comment_catalogue(css: str) -> str:
    marker = css.find(ORPHAN_COMMENT_CATALOG)
    if marker < 0:
        return css
    trailing = css[marker:]
    if mask_comments(trailing).strip():
        return css
    return css[:marker]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-css", type=Path, required=True)
    parser.add_argument("--owner-snapshot", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    owner_source = args.owner_snapshot.read_text()
    if CHECKER.GENERAL_MARKER in owner_source:
        owner_source = CHECKER.extract_general(owner_source)
    formatted = format_snapshot(args.source_css.read_text(), owner_source)
    if args.output:
        args.output.write_text(formatted)
    else:
        print(formatted, end="")


if __name__ == "__main__":
    main()
