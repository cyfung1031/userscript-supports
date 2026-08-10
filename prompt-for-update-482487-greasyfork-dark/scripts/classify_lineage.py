#!/usr/bin/env python3
"""Classify the adjacent published-script change relevant to the // general snapshot."""

from __future__ import annotations

import argparse
import difflib
from pathlib import Path


GENERAL_MARKER = "        // general" + chr(10)
TARGETED_LINE_LIMIT = 24


def extract_general(source: str) -> str:
    if source.count(GENERAL_MARKER) != 1:
        raise ValueError("expected exactly one // general marker")
    marker = source.index(GENERAL_MARKER)
    opening = source.index(chr(96), marker)
    closing = source.index(chr(96), opening + 1)
    return source[opening + 1 : closing]


def changed_lines(previous: str, current: str) -> int:
    diff = difflib.ndiff(previous.splitlines(), current.splitlines())
    return sum(line[:2] in ("+ ", "- ") for line in diff)


def without_general(source: str) -> str:
    marker = source.index(GENERAL_MARKER)
    opening = source.index(chr(96), marker)
    closing = source.index(chr(96), opening + 1)
    return source[: opening + 1] + source[closing:]


def classify(previous: str, current: str) -> tuple[str, int, bool]:
    previous_general = extract_general(previous)
    current_general = extract_general(current)
    delta = changed_lines(previous_general, current_general)
    non_general_changed = without_general(previous) != without_general(current)
    if delta == 0:
        return "NO_GENERAL_CHANGE", delta, non_general_changed
    if delta <= TARGETED_LINE_LIMIT:
        return "TARGETED_OWNER_DELTA", delta, non_general_changed
    return "STRUCTURAL_REFRESH", delta, non_general_changed


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("previous", type=Path)
    parser.add_argument("current", type=Path)
    args = parser.parse_args()
    mode, delta, non_general_changed = classify(
        args.previous.read_text(), args.current.read_text()
    )
    print(f"previous: {args.previous}")
    print(f"current: {args.current}")
    print(f"mode: {mode}")
    print(f"changed_general_lines: {delta}")
    print(f"non_general_changed: {'yes' if non_general_changed else 'no'}")


if __name__ == "__main__":
    main()
