#!/usr/bin/env python3
"""Regression checks for raw one-line CSS audit coverage."""

import importlib.util
from pathlib import Path
import subprocess
import tempfile


ROOT = Path(__file__).parents[1]
CHECKER = ROOT / "scripts" / "check_snapshot.py"
FIXTURE = ROOT / "examples" / "mini-greasyfork-dark.user.js"
UPSTREAM = ROOT / "references" / "fixtures" / "current-application.css"
SPEC = importlib.util.spec_from_file_location("check_snapshot", CHECKER)
CHECKER_MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(CHECKER_MODULE)


def run(target, upstream):
    return subprocess.run(
        [
            "python3",
            str(CHECKER),
            "--file",
            str(target),
            "--upstream-css",
            str(upstream),
        ],
        capture_output=True,
        text=True,
    )


def main():
    parser_input = (
        "/* ignored{padding:999px} */"
        ':root{--ignored:"{ ; }";}'
        'article[data-value="{"]{content:"/* not a comment */;";padding:calc(1px + 2px)}'
        r'.escaped\{token[data-value="]"]{content:"{ ; }";padding:calc(1px + 2px)}'
        "@media screen and (width<=400px){.nested:hover{margin:auto 0;color:red}}"
        ".repeat{display:block}.repeat{display:flex}"
    )
    assert CHECKER_MODULE.css_selector_sequence(parser_input) == [
        'article[data-value="{"]',
        r'.escaped\{token[data-value="]"]',
        ".nested:hover",
        ".repeat",
        ".repeat",
    ]
    assert CHECKER_MODULE.declaration_tokens(parser_input) == {
        ('content', '"/* not a comment */;"'),
        ('content', '"{ ; }"'),
        ("padding", "calc(1px + 2px)"),
        ("margin", "auto 0"),
        ("display", "block"),
        ("display", "flex"),
    }

    border_declarations = (
        ".border{"
        "border-top:1px solid #111;"
        "border-right:0;"
        "border-bottom:2px dashed #fff;"
        "border-left:3px;"
        "border-top-color:#abc;"
        "}"
    )
    assert CHECKER_MODULE.declaration_tokens(border_declarations) == {
        ("border-top-color", "#abc"),
    }

    escaped_input = r'.escaped\{name{content:"}";color:red}'
    assert CHECKER_MODULE.css_selector_sequence(escaped_input) == [r'.escaped\{name']
    assert CHECKER_MODULE.declaration_tokens(escaped_input) == {
        ("content", '"}"'),
    }

    excluded_input = (
        ':root{.root{display:none}}'
        '@media screen and (prefers-color-scheme: dark){.dark{display:none}}'
        '.live{display:block}'
    )
    assert CHECKER_MODULE.css_rule_sequence(excluded_input) == [((), ".live")]

    payload_input = (
        '.asset{background:url(data:text/css,:root{.fake{display:none}}'
        '@media screen and (prefers-color-scheme: dark){.fake-dark{display:none}})}'
        '.live{display:block}'
    )
    assert CHECKER_MODULE.remove_excluded_branches(payload_input) == payload_input
    lexical_literals = (
        '.quoted{content:":root{.fake{display:none}}"}'
        '/* @media screen and (prefers-color-scheme: dark){.fake{display:none}} */'
        r'.escaped\:root\{token{display:none}'
    )
    assert CHECKER_MODULE.remove_excluded_branches(lexical_literals) == lexical_literals

    real_branches = (
        ':root{.root{display:none}}'
        '@MEDIA screen and (PREFERS-COLOR-SCHEME: DARK){.dark{display:none}}'
        '.live{display:block}'
    )
    assert CHECKER_MODULE.remove_excluded_branches(real_branches) == '.live{display:block}'

    assert CHECKER_MODULE.unresolved_css_variables(
        'html{--x:red}.child{color:var(--x)}'
    ) == []
    assert CHECKER_MODULE.unresolved_css_variables(
        '.parent{--x:red}.parent .child{color:var(--x)}'
    ) == []
    assert CHECKER_MODULE.unresolved_css_variables(
        '.parent{--x:red;.child{color:var(--x)}}'
    ) == []
    assert CHECKER_MODULE.unresolved_css_variables(
        '.compound{--x:red}.compound.child:hover{color:var(--x)}'
    ) == []
    assert CHECKER_MODULE.unresolved_css_variables(
        '.parent{--x:red}.unrelated .child{color:var(--x)}'
    ) == ["--x"]
    assert CHECKER_MODULE.ordered_missing_declaration_tokens_by_context(
        '.ctx{margin:0;padding:1px}',
        '.ctx{padding:1px;margin:0}',
    ) == [(('.ctx',), "padding", "1px")]
    assert CHECKER_MODULE.ordered_missing_declaration_tokens_by_context(
        '.ctx{margin:0}',
        '.ctx{width:1px;margin:0}',
    ) == []
    mixed_case_dark = (
        '@MEDIA screen and (PREFERS-COLOR-SCHEME: DARK){.dark{display:none}}'
        '.live{display:block}'
    )
    assert CHECKER_MODULE.css_rule_sequence(mixed_case_dark) == [((), ".live")]

    assert CHECKER_MODULE.unresolved_css_variables(
        '.scope{color:var(--missing, rgb(1, 2, 3));background:var(--other, var(--fallback, red))}'
    ) == []
    assert CHECKER_MODULE.unresolved_css_variables(
        '.decl{--local:red}.use{color:var(--local)}'
    ) == ["--local"]
    assert CHECKER_MODULE.unresolved_css_variables(
        '.decl{--local:red}.decl:hover{color:var(--local)}'
    ) == []

    assert CHECKER_MODULE.css_selector_sequence(
        'form.new_user input[type="submit"]{}'
    ) == ["form.new_user input[type=submit]"]
    assert CHECKER_MODULE.normalize(".a .b") != CHECKER_MODULE.normalize(".a.b")
    assert CHECKER_MODULE.normalize(
        "@media screen and (width <= 400px)"
    ) == CHECKER_MODULE.normalize("@media screen and(width<=400px)")
    assert CHECKER_MODULE.css_rule_sequence(
        '@media screen {.x{margin:auto 0}}@media print {.x{margin:auto 1px}}'
    ) == [
        (("@media screen",), ".x"),
        (("@media print",), ".x"),
    ]
    assert CHECKER_MODULE.unresolved_css_variables(
        '.a{content:"var(--fake)";/*var(--comment)*/--local:red;color:var(--local)}'
    ) == []
    assert CHECKER_MODULE.unresolved_css_variables(
        '@media screen{.a{--local:red}}@media print{.b{color:var(--local)}}'
    ) == ["--local"]
    assert CHECKER_MODULE.unresolved_css_variables(
        '.a{color:var(--missing, var(--fallback))}'
    ) == ["--missing", "--fallback"]

    minified = "".join(line.strip() for line in UPSTREAM.read_text().splitlines())
    with tempfile.TemporaryDirectory() as directory:
        directory = Path(directory)

        data_url_payload = directory / "data-url-payload.user.js"
        data_url_payload.write_text(
            FIXTURE.read_text().replace(
                "html {",
                ".asset { background: url(data:text/css,:root{.fake{display:none}}"
                "@media%20screen%20and%20%28prefers-color-scheme:dark%29"
                "{.fake-dark{display:none}}); }\nhtml {",
                1,
            )
        )
        result = run(data_url_payload, UPSTREAM)
        assert result.returncode == 0, result.stdout + result.stderr

        active_root = directory / "active-root.user.js"
        active_root.write_text(
            FIXTURE.read_text().replace(
                "html {",
                ":root { --ignored: red; }\nhtml {",
                1,
            )
        )
        result = run(active_root, UPSTREAM)
        assert result.returncode != 0, result.stdout
        assert "active :root variable block remains" in result.stderr

        missing_selector = directory / "minified-upstream-missing-selector.css"
        missing_selector.write_text(
            minified + '.new-current-selector[data-value="{"]{display:block}'
        )
        result = run(FIXTURE, missing_selector)
        assert result.returncode != 0, result.stdout
        assert "current upstream selectors missing" in result.stderr

        nested_variables = directory / "nested-variables.user.js"
        nested_variables.write_text(
            FIXTURE.read_text().replace(
                "html {",
                '.nested-vars{color:var(--missing,var(--fallback,red));content:"var(--quoted)";}\nhtml {',
                1,
            )
        )
        result = run(nested_variables, UPSTREAM)
        assert result.returncode == 0, result.stdout + result.stderr

        nested_inherited = directory / "nested-inherited.user.js"
        nested_inherited.write_text(
            FIXTURE.read_text().replace(
                "html {",
                ".parent{--x:red;.child{color:var(--x)}}\nhtml {",
                1,
            )
        )
        nested_upstream = directory / "nested-inherited.css"
        nested_upstream.write_text(
            UPSTREAM.read_text() + "\n.parent{--x:red;.child{color:var(--x)}}\n"
        )
        result = run(nested_inherited, nested_upstream)
        assert result.returncode == 0, result.stdout + result.stderr

        mixed_case_target = directory / "mixed-case-dark.user.js"
        mixed_case_target.write_text(
            FIXTURE.read_text().replace(
                "html {",
                "@MEDIA screen and (PREFERS-COLOR-SCHEME: DARK) {"
                ".dark { display: none; }\n}\nhtml {",
                1,
            )
        )
        result = run(mixed_case_target, UPSTREAM)
        assert result.returncode != 0, result.stdout
        assert "active official dark branch remains" in result.stderr

        missing_token = directory / "minified-upstream-missing-token.css"
        missing_token.write_text(
            minified.replace("overflow-y: scroll;", "overflow-y: scroll;padding:1rem;")
        )
        result = run(FIXTURE, missing_token)
        assert result.returncode != 0, result.stdout
        assert "current upstream declaration tokens missing" in result.stderr

    print("PASS: minified CSS checker regressions")


if __name__ == "__main__":
    main()
