#!/usr/bin/env python3
"""Best-effort source-to-snapshot format and cascade harness."""

from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path


CHECKER_PATH = Path(__file__).with_name("check_snapshot.py")
SPEC = importlib.util.spec_from_file_location("check_snapshot", CHECKER_PATH)
CHECKER = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(CHECKER)


def ordered_missing(source_sequence, snapshot_sequence):
    cursor = 0
    missing = []
    for selector in source_sequence:
        try:
            cursor = snapshot_sequence.index(selector, cursor) + 1
        except ValueError:
            missing.append(selector)
    return missing


def audit(source_css: str, snapshot_css: str) -> dict[str, object]:
    raw_snapshot_css = snapshot_css
    source_css = CHECKER.remove_excluded_branches(source_css)
    snapshot_css = CHECKER.remove_excluded_branches(snapshot_css)
    source_sequence = CHECKER.css_rule_sequence(source_css)
    snapshot_sequence = CHECKER.css_rule_sequence(snapshot_css)
    source_counts = CHECKER.repeated_css_rule_counts(source_css)
    snapshot_counts = CHECKER.repeated_css_rule_counts(snapshot_css)
    collapsed = sorted(
        (selector, count, snapshot_counts.get(selector, 0))
        for selector, count in source_counts.items()
        if count > 1 and snapshot_counts.get(selector, 0) < count
    )
    missing_tokens = CHECKER.ordered_missing_declaration_tokens_by_context(
        source_css, snapshot_css
    )
    whitespace = CHECKER.css_whitespace_metrics(raw_snapshot_css)
    return {
        "source_blocks": len(source_sequence),
        "snapshot_blocks": len(snapshot_sequence),
        "ordered_missing_selectors": ordered_missing(source_sequence, snapshot_sequence),
        "collapsed_repeated_blocks": collapsed,
        "missing_non_color_tokens": missing_tokens,
        "snapshot_tabs": whitespace["tabs"],
        "snapshot_trailing_whitespace_lines": whitespace["trailing_whitespace_lines"],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-css", type=Path, required=True)
    parser.add_argument("--snapshot-file", type=Path, required=True)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    source = args.source_css.read_text()
    snapshot = CHECKER.extract_general(args.snapshot_file.read_text())
    result = audit(source, snapshot)
    findings = {
        key: value
        for key, value in result.items()
        if key in {
            "ordered_missing_selectors",
            "collapsed_repeated_blocks",
            "missing_non_color_tokens",
        }
        and value
    }
    strict_findings = dict(findings)
    if args.strict:
        for key in ("snapshot_tabs", "snapshot_trailing_whitespace_lines"):
            if result[key]:
                strict_findings[key] = result[key]
    print("FORMAT_HARNESS: " + ("FAIL" if strict_findings else "PASS"))
    for key, value in result.items():
        print(f"{key}: {value}")
    if args.strict and strict_findings:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
