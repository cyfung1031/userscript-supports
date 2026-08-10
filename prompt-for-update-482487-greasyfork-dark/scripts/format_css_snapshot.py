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


@dataclass
class Declaration:
    text: str
    terminated: bool


@dataclass
class Block:
    header: str
    declarations: list[Declaration]
    children: list["Block"]


def matching_brace(css: str, opening: int) -> int:
    depth = 1
    quote = ""
    comment = False
    index = opening + 1
    while index < len(css):
        if comment:
            if css.startswith("*/", index):
                comment = False
                index += 2
                continue
            index += 1
            continue
        if css.startswith("/*", index):
            comment = True
            index += 2
            continue
        char = css[index]
        if quote:
            if char == "\\":
                index += 2
                continue
            if char == quote:
                quote = ""
        elif char in "\"'":
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index
        index += 1
    raise ValueError("unbalanced CSS braces")


def has_top_level_brace(css: str) -> bool:
    quote = ""
    comment = False
    bracket_depth = 0
    index = 0
    while index < len(css):
        if comment:
            if css.startswith("*/", index):
                comment = False
                index += 2
                continue
            index += 1
            continue
        if css.startswith("/*", index):
            comment = True
            index += 2
            continue
        char = css[index]
        if quote:
            if char == "\\":
                index += 2
                continue
            if char == quote:
                quote = ""
        elif char in "\"'":
            quote = char
        elif char == "[":
            bracket_depth += 1
        elif char == "]":
            bracket_depth -= 1
        elif char == "{" and bracket_depth == 0:
            return True
        index += 1
    return False


def split_declarations(body: str) -> list[Declaration]:
    result = []
    start = 0
    quote = ""
    comment = False
    bracket_depth = 0
    index = 0
    while index < len(body):
        if comment:
            if body.startswith("*/", index):
                comment = False
                index += 2
                continue
            index += 1
            continue
        if body.startswith("/*", index):
            comment = True
            index += 2
            continue
        char = body[index]
        if quote:
            if char == "\\":
                index += 2
                continue
            if char == quote:
                quote = ""
        elif char in "\"'":
            quote = char
        elif char == "[":
            bracket_depth += 1
        elif char == "]":
            bracket_depth -= 1
        elif char == ";" and bracket_depth == 0:
            text = body[start:index].strip()
            if text:
                result.append(Declaration(text, True))
            start = index + 1
        index += 1
    text = body[start:].strip()
    if text:
        result.append(Declaration(text, False))
    return result


def remove_excluded_branches_keep_comments(css: str) -> str:
    patterns = (
        re.compile(r":root\s*\{"),
        re.compile(r"@media\s*\([^)]*prefers-color-scheme\s*:\s*dark[^)]*\)\s*\{"),
    )
    while True:
        masked = mask_comments(css)
        matches = [match for pattern in patterns if (match := pattern.search(masked))]
        if not matches:
            return css
        match = min(matches, key=lambda item: item.start())
        closing = matching_brace(css, match.end() - 1)
        css = css[: match.start()] + css[closing + 1 :]


def mask_comments(css: str) -> str:
    chars = list(css)
    index = 0
    while index < len(chars) - 1:
        if chars[index : index + 2] == ["/", "*"]:
            end = css.find("*/", index + 2)
            if end < 0:
                raise ValueError("unterminated CSS comment")
            for position in range(index, end + 2):
                if chars[position] not in "\n\r":
                    chars[position] = " "
            index = end + 2
        else:
            index += 1
    return "".join(chars)


def parse_blocks(css: str) -> list[Block]:
    blocks = []
    cursor = 0
    while cursor < len(css):
        opening = cursor
        quote = ""
        comment = False
        bracket_depth = 0
        while opening < len(css):
            if comment:
                if css.startswith("*/", opening):
                    comment = False
                    opening += 2
                    continue
                opening += 1
                continue
            if css.startswith("/*", opening):
                comment = True
                opening += 2
                continue
            char = css[opening]
            if quote:
                if char == "\\":
                    opening += 2
                    continue
                if char == quote:
                    quote = ""
            elif char in "\"'":
                quote = char
            elif char == "[":
                bracket_depth += 1
            elif char == "]":
                bracket_depth -= 1
            elif char == "{" and bracket_depth == 0:
                break
            opening += 1
        if opening >= len(css):
            if css[cursor:].strip():
                raise ValueError("CSS text outside a rule: " + css[cursor:].strip()[:80])
            break
        header = css[cursor:opening].strip()
        closing = matching_brace(css, opening)
        body = css[opening + 1 : closing]
        if has_top_level_brace(body):
            block = Block(header, [], parse_blocks(body))
        else:
            block = Block(header, split_declarations(body), [])
        blocks.append(block)
        cursor = closing + 1
    return blocks


def selector_key(header: str) -> str:
    header = re.sub(r"/\*.*?\*/", "", header, flags=re.DOTALL)
    header = re.sub(r"\bmax-width\s*:", "width <=", header)
    header = re.sub(r"\bmin-width\s*:", "width >=", header)
    header = "".join(header.split())

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
    source_comments = re.findall(r"/\*.*?\*/", source_header, flags=re.DOTALL)
    owner_comments = re.findall(r"/\*.*?\*/", owner_header, flags=re.DOTALL)
    comments = owner_comments + [comment for comment in source_comments if comment not in owner_comments]
    owner_selector = re.sub(r"/\*.*?\*/", "", owner_header, flags=re.DOTALL).strip()
    return "\n".join(comments + [owner_selector]) if comments else owner_selector


def format_block(
    block: Block,
    path: tuple[str, ...],
    styles: dict[tuple[str, ...], list[Block]],
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
    if block.children:
        child_lines = []
        child_path = path + (selector_key(block.header),)
        for child in block.children:
            if child_lines:
                child_lines.append("")
            child_lines.extend(
                format_block(
                    child,
                    child_path,
                    styles,
                    occurrences,
                    indent_unit,
                    level + 1,
                )
            )
        lines.extend(child_lines)
    else:
        for index, declaration in enumerate(block.declarations):
            text = declaration.text.strip()
            if ":" in text and not text.startswith("/*"):
                name, value = text.split(":", 1)
                text = name.strip() + ": " + value.strip()
            is_last = index == len(block.declarations) - 1
            suffix = ";" if declaration.terminated else ""
            lines.append(indent_unit * (level + 1) + text + suffix)
    lines.append(indent_unit * level + "}")
    return lines


def format_snapshot(source_css: str, owner_css: str) -> str:
    source_css = remove_excluded_branches_keep_comments(source_css)
    owner_css = remove_excluded_branches_keep_comments(owner_css)
    source_blocks = parse_blocks(source_css)
    owner_blocks = parse_blocks(owner_css)
    styles = collect_owner_styles(owner_blocks)
    indent_unit = infer_indent(owner_css)
    occurrences: Counter[tuple[str, ...]] = Counter()
    output = []
    for block in source_blocks:
        if output:
            output.append("")
        output.extend(
            format_block(block, (), styles, occurrences, indent_unit, 0)
        )
    return "\n".join(output) + "\n"


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
