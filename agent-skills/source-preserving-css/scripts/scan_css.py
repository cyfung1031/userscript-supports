#!/usr/bin/env python3
"""Scan CSS structure without treating newlines or regex as grammar."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def scan(text: str) -> dict[str, int | bool | str]:
    def clean(segment: str) -> str:
        return re.sub(r"/\*.*?\*/", "", segment, flags=re.DOTALL).strip()

    def valid_at_rule(segment: str) -> bool:
        return bool(re.match(r"^@[-_a-zA-Z][-\w]*(?:\s+.+|\(.*\)|$)", segment))

    in_comment = False
    quote = ""
    escaped = False
    paren_depth = 0
    bracket_depth = 0
    braces = 0
    opening_braces = 0
    unmatched_closing_braces = 0
    unmatched_closing_parens = 0
    unmatched_closing_brackets = 0
    malformed_escapes = 0
    malformed_nesting = 0
    delimiter_stack: list[str] = []
    block_segment_starts: list[int] = []
    segment_start = 0
    grammar_errors = 0
    semicolons = 0
    comments = 0
    protected_delimiters = 0
    structural_delimiters = 0
    max_brace_depth = 0
    nonempty_tokens = 0
    index = 0

    while index < len(text):
        char = text[index]
        next_char = text[index + 1] if index + 1 < len(text) else ""

        if in_comment:
            if char == "*" and next_char == "/":
                in_comment = False
                index += 2
            else:
                index += 1
            continue

        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = ""
            elif char in "{};":
                protected_delimiters += 1
            index += 1
            continue

        if char == "/" and next_char == "*":
            comments += 1
            in_comment = True
            index += 2
            continue
        if char in "'\"":
            quote = char
            index += 1
            continue
        if char == "\\":
            if index + 1 >= len(text):
                malformed_escapes += 1
                index += 1
            else:
                index += 2
            continue
        if char == "(":
            delimiter_stack.append("(")
            paren_depth += 1
            index += 1
            continue
        if char == ")":
            if paren_depth:
                paren_depth -= 1
                if delimiter_stack and delimiter_stack[-1] == "(":
                    delimiter_stack.pop()
                else:
                    malformed_nesting += 1
            else:
                unmatched_closing_parens += 1
            index += 1
            continue
        if char == "[":
            delimiter_stack.append("[")
            bracket_depth += 1
            index += 1
            continue
        if char == "]":
            if bracket_depth:
                bracket_depth -= 1
                if delimiter_stack and delimiter_stack[-1] == "[":
                    delimiter_stack.pop()
                else:
                    malformed_nesting += 1
            else:
                unmatched_closing_brackets += 1
            index += 1
            continue

        if char in "{};":
            if paren_depth or bracket_depth:
                protected_delimiters += 1
            else:
                structural_delimiters += 1
                nonempty_tokens += 1
                if char == "{":
                    prelude = clean(text[segment_start:index])
                    if not prelude or (
                        prelude.startswith("@")
                        and not valid_at_rule(prelude)
                    ):
                        grammar_errors += 1
                    block_segment_starts.append(segment_start)
                    segment_start = index + 1
                    delimiter_stack.append("{")
                    opening_braces += 1
                    braces += 1
                    max_brace_depth = max(max_brace_depth, braces)
                elif char == "}":
                    segment = clean(text[segment_start:index])
                    if (
                        block_segment_starts
                        and segment
                        and not valid_at_rule(segment)
                        and ":" not in segment
                    ):
                        grammar_errors += 1
                    if braces:
                        braces -= 1
                        if delimiter_stack and delimiter_stack[-1] == "{":
                            delimiter_stack.pop()
                        else:
                            malformed_nesting += 1
                        block_segment_starts.pop()
                        segment_start = index + 1
                    else:
                        unmatched_closing_braces += 1
                else:
                    semicolons += 1
                    segment = clean(text[segment_start:index])
                    if (
                        block_segment_starts
                        and segment
                        and not valid_at_rule(segment)
                        and ":" not in segment
                    ):
                        grammar_errors += 1
                    segment_start = index + 1
        index += 1

    if not block_segment_starts and clean(text[segment_start:]):
        grammar_errors += 1

    return {
        "length": len(text),
        "comments": comments,
        "opening_braces": opening_braces,
        "unmatched_closing_braces": unmatched_closing_braces,
        "unmatched_closing_parens": unmatched_closing_parens,
        "unmatched_closing_brackets": unmatched_closing_brackets,
        "malformed_escapes": malformed_escapes,
        "malformed_nesting": malformed_nesting,
        "grammar_errors": grammar_errors,
        "unclosed_braces": braces,
        "max_brace_depth": max_brace_depth,
        "semicolons": semicolons,
        "protected_delimiters": protected_delimiters,
        "structural_delimiters": structural_delimiters,
        "nonempty_tokens": nonempty_tokens,
        "balanced": (
            not in_comment
            and not quote
            and not escaped
            and not braces
            and not paren_depth
            and not bracket_depth
            and not unmatched_closing_braces
            and not unmatched_closing_parens
            and not unmatched_closing_brackets
            and not malformed_escapes
            and not malformed_nesting
            and not delimiter_stack
        ),
        "lexical_status": (
            "EMPTY"
            if not nonempty_tokens
            else "NO_RULES"
            if not opening_braces
            else (
                "OK"
                if (
                    not in_comment
                    and not quote
                    and not escaped
                    and not braces
                    and not paren_depth
                    and not bracket_depth
                    and not unmatched_closing_braces
                    and not unmatched_closing_parens
                    and not unmatched_closing_brackets
                    and not malformed_escapes
                    and not malformed_nesting
                    and not delimiter_stack
                )
                else "MALFORMED"
            )
        ),
        "grammar_status": "ERROR" if grammar_errors else "UNKNOWN",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("css_file", type=Path)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    result = scan(args.css_file.read_text())
    print(json.dumps(result, sort_keys=True))
    if args.strict and (
        result["lexical_status"] != "OK" or result["grammar_status"] == "ERROR"
    ):
        raise SystemExit(2)


if __name__ == "__main__":
    main()
