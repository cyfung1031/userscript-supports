#!/usr/bin/env python3
"""Adversarial scanner checks used by the source-preserving skill."""

from scan_css import scan


def main() -> None:
    result = scan(
        '/* fake{; } */'
        ':root{--x:"{;}";}'
        '.asset{background:url(data:image/png;base64,abc;{});content:"/*;*/";}'
        '@media screen and (width<=400px){.nested:hover{margin:auto 0;color:red}}'
        '.repeat{display:block}.repeat{display:flex}'
    )
    assert result["comments"] == 1
    assert result["unclosed_braces"] == 0
    assert result["max_brace_depth"] == 2
    assert result["protected_delimiters"] >= 4
    assert result["structural_delimiters"] > 0
    assert result["balanced"] is True
    assert result["grammar_status"] == "UNKNOWN"

    escaped = scan(r'.escaped\{name[data-value="{"]{content:"}";var(--x, var(--fallback, red))}')
    assert escaped["balanced"] is True
    assert escaped["opening_braces"] == 1

    for malformed in (")", "]", "}"):
        assert scan(malformed)["balanced"] is False
    assert scan("\\")["balanced"] is False
    assert scan("([)]")["balanced"] is False
    assert scan(" ")["lexical_status"] == "EMPTY"
    assert scan(";")["lexical_status"] == "NO_RULES"
    assert scan("{}")["grammar_status"] == "ERROR"
    assert scan("@{}")["grammar_status"] == "ERROR"
    assert scan("a{color}")["grammar_status"] == "ERROR"
    assert scan("a{color:red} .b")["grammar_status"] == "ERROR"
    assert scan("a{color:red} @")["grammar_status"] == "ERROR"
    assert scan("a{color:red}/* trailing comment */")["grammar_status"] == "UNKNOWN"
    assert scan("a{@}")["grammar_status"] == "ERROR"
    assert scan("a{color:red; @}")["grammar_status"] == "ERROR"
    assert scan("@foo?{}")["grammar_status"] == "ERROR"

    print("PASS: source-preserving CSS scanner")


if __name__ == "__main__":
    main()
