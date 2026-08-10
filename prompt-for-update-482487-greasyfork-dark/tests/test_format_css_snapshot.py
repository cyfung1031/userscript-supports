#!/usr/bin/env python3
"""Exercise the snapshot-ready CSS formatter against small realistic fixtures."""

from pathlib import Path
import subprocess
import tempfile


ROOT = Path(__file__).parents[1]
FORMATTER = ROOT / "scripts" / "format_css_snapshot.py"
SOURCE = ROOT / "references" / "fixtures" / "current-application.css"
OWNER = ROOT / "references" / "fixtures" / "previous-general.css"


def main():
    with tempfile.TemporaryDirectory() as directory:
        output = Path(directory) / "formatted.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(SOURCE),
                "--owner-snapshot",
                str(OWNER),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        formatted = output.read_text()
        assert "margin: auto 0" in formatted
        assert "margin: auto 0px" not in formatted
        assert formatted.count(".diff ul {") == 2
        assert "background: rgb(30, 30, 30);" in formatted
        assert "color: rgb(233, 233, 233);" in formatted
        assert "background-color: #24272d;" in formatted
        assert "a {" in formatted
        assert "color: #f7c67f" in formatted

        owner_with_trailing_catalogue = Path(directory) / "owner-with-trailing-catalogue.css"
        owner_with_trailing_catalogue.write_text(
            "a {\n    color: #f7c67f; /* attached owner color */\n}\n"
            "/* Preserved comments from the previous // general snapshot. */\n"
            "/*#f65e5e;*/\n"
        )
        output = Path(directory) / "trailing-catalogue.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                SOURCE,
                "--owner-snapshot",
                str(owner_with_trailing_catalogue),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        trailing_catalogue = output.read_text()
        assert "/* attached owner color */" in trailing_catalogue
        assert "Preserved comments from the previous // general snapshot" not in trailing_catalogue
        assert "/*#f65e5e;*/" not in trailing_catalogue

        source_with_border_color = Path(directory) / "source-with-border-color.css"
        source_with_border_color.write_text(".notice{border-left: 1px solid var(--border-color)}")
        owner_with_border_color = Path(directory) / "owner-with-border-color.css"
        owner_with_border_color.write_text(
            ".notice {\n"
            "    border-left: 6px solid #d7d171; /* owner border */\n"
            "    box-shadow: 0 0 3px #181a1b;\n"
            "}\n"
        )
        output = Path(directory) / "border-color.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(source_with_border_color),
                "--owner-snapshot",
                str(owner_with_border_color),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        border_output = output.read_text()
        assert "border-left: 6px solid #d7d171 /* owner border */;\n" in border_output
        assert "box-shadow: 0 0 3px #181a1b" in border_output

        source = Path(directory) / "source-with-quoted-equivalent.css"
        source.write_text('form.new_user input[type="submit"]{margin:auto 0}')
        owner = Path(directory) / "owner-with-unquoted-equivalent.css"
        owner.write_text("form.new_user input[type=submit] {\n    margin: 0\n}\n")
        output = Path(directory) / "quoted-equivalent.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(source),
                "--owner-snapshot",
                str(owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        assert "form.new_user input[type=submit] {" in output.read_text()
        assert 'input[type="submit"]' not in output.read_text()
        assert "margin: auto 0\n" in output.read_text()
        assert "margin: auto 0;" not in output.read_text()

        descendant_source = Path(directory) / "descendant-source.css"
        descendant_source.write_text(".a .b{color:red}")
        compound_owner = Path(directory) / "compound-owner.css"
        compound_owner.write_text(
            ".a.b {\n"
            "    color: #123456\n"
            "}\n"
        )
        output = Path(directory) / "descendant-vs-compound.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(descendant_source),
                "--owner-snapshot",
                str(compound_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        descendant_output = output.read_text()
        assert ".a .b {\n    color:red\n}" in descendant_output
        assert ".a.b {\n    color: #123456\n}" in descendant_output

        equivalent_source = Path(directory) / "equivalent-selector-source.css"
        equivalent_source.write_text(".a > .b, .c{color:red}")
        equivalent_owner = Path(directory) / "equivalent-selector-owner.css"
        equivalent_owner.write_text(
            ".a>.b,.c {\n"
            "    color: #123456\n"
            "}\n"
        )
        output = Path(directory) / "equivalent-selector.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(equivalent_source),
                "--owner-snapshot",
                str(equivalent_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        equivalent_output = output.read_text()
        assert equivalent_output.count(".a>.b,.c {") == 1
        assert "color: #123456" in equivalent_output
        assert "color:red" not in equivalent_output

        media_source = Path(directory) / "equivalent-media-source.css"
        media_source.write_text(
            "@media screen and ( min-width : 10px ){.media{color:red}}"
        )
        media_owner = Path(directory) / "equivalent-media-owner.css"
        media_owner.write_text(
            "@media screen and (width >= 10px) {\n"
            "    .media {\n"
            "        color: #123456\n"
            "    }\n"
            "}\n"
        )
        output = Path(directory) / "equivalent-media.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(media_source),
                "--owner-snapshot",
                str(media_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        media_output = output.read_text()
        assert "@media screen and (width >= 10px) {" in media_output
        assert "        color: #123456\n" in media_output
        assert "color:red" not in media_output

        escaped_selector_source = Path(directory) / "escaped-selector-source.css"
        escaped_selector_source.write_text(r".escaped\ .name{color:red}")
        escaped_selector_owner = Path(directory) / "escaped-selector-owner.css"
        escaped_selector_owner.write_text(
            r".escaped\ .name {" + "\n    color: #123456\n}\n"
        )
        output = Path(directory) / "escaped-selector.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(escaped_selector_source),
                "--owner-snapshot",
                str(escaped_selector_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        escaped_output = output.read_text()
        assert r".escaped\ .name {" in escaped_output
        assert "color: #123456" in escaped_output

        commented_source = Path(directory) / "commented-source.css"
        commented_source.write_text("/* source rule comment */ .x{margin:auto 0}")
        commented_owner = Path(directory) / "commented-owner.css"
        commented_owner.write_text(".x {\n    margin: 0\n}\n")
        output = Path(directory) / "commented-output.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(commented_source),
                "--owner-snapshot",
                str(commented_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        assert "/* source rule comment */" in output.read_text()

        excluded_comment_source = Path(directory) / "excluded-comment-source.css"
        excluded_comment_source.write_text(
            "/* mention :root and @media (prefers-color-scheme: dark) in a comment */\n"
            ":root{--light: white}\n.x{margin:auto 0}"
        )
        output = Path(directory) / "excluded-comment-output.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(excluded_comment_source),
                "--owner-snapshot",
                str(commented_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        assert "--light: white" not in output.read_text()
        assert "/* mention :root" in output.read_text()

        source_with_function_values = Path(directory) / "source-with-function-values.css"
        source_with_function_values.write_text(
            "@media (prefers-color-scheme: dark) and "
            "(min-width: calc(10px + (2 * var(--gap)))) {"
            ".dark { color: black; }"
            "}"
            ".asset{"
            "background-image: image-set(url(data:image/png;base64,abc;def) 1x, "
            "linear-gradient(red, blue) 2x /* function ; ) */);"
            'content: "literal; )";'
            'content: ":root{}";'
            "background-image: url(foo\\)bar);"
            "mask-image: url(data:image/svg+xml,<svg>{}</svg>);"
            "transform: translate(calc(100% - (2 * var(--gap))), rotate(10deg));"
            "color: red;"
            "}"
        )
        owner_with_function_values = Path(directory) / "owner-with-function-values.css"
        owner_with_function_values.write_text(
            ".asset {\n"
            "    color: #123456; /* owner color */\n"
            "}\n"
        )
        output = Path(directory) / "function-values.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(source_with_function_values),
                "--owner-snapshot",
                str(owner_with_function_values),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        function_output = output.read_text()
        assert (
            "background-image: image-set(url(data:image/png;base64,abc;def) 1x, "
            "linear-gradient(red, blue) 2x /* function ; ) */);"
        ) in function_output
        assert 'content: "literal; )";' in function_output
        assert 'content: ":root{}";' in function_output
        assert "background-image: url(foo\\)bar);" in function_output
        assert "mask-image: url(data:image/svg+xml,<svg>{}</svg>);" in function_output
        assert (
            "transform: translate(calc(100% - (2 * var(--gap))), rotate(10deg));"
            in function_output
        )
        assert "color: #123456 /* owner color */;" in function_output
        assert ".dark" not in function_output

        uppercase_dark_source = Path(directory) / "uppercase-dark-source.css"
        uppercase_dark_source.write_text(
            "@MEDIA screen and (PREFERS-COLOR-SCHEME: DARK) {"
            ".dark-only { color: black; }"
            "}"
            ".visible { color: white; }"
        )
        uppercase_dark_owner = Path(directory) / "uppercase-dark-owner.css"
        uppercase_dark_owner.write_text(".visible {\n    color: white\n}\n")
        output = Path(directory) / "uppercase-dark-output.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(uppercase_dark_source),
                "--owner-snapshot",
                str(uppercase_dark_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        uppercase_dark_output = output.read_text()
        assert ".dark-only" not in uppercase_dark_output
        assert ".visible {" in uppercase_dark_output

        mixed_source = Path(directory) / "mixed-source.css"
        mixed_source.write_text(
            ".component{"
            "color: red;"
            "&:hover{background: blue;}"
            "padding: 1px;"
            "@media (min-width: 10px){margin: 2px;}"
            "border: 0;"
            "}"
        )
        mixed_owner = Path(directory) / "mixed-owner.css"
        mixed_owner.write_text(".unrelated { color: black; }\n")
        output = Path(directory) / "mixed-output.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(mixed_source),
                "--owner-snapshot",
                str(mixed_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        mixed_output = output.read_text()
        mixed_tokens = (
            "color: red;",
            "&:hover {",
            "background: blue;",
            "padding: 1px;",
            "@media (min-width: 10px) {",
            "margin: 2px;",
            "border: 0;",
        )
        assert all(token in mixed_output for token in mixed_tokens)
        positions = [mixed_output.index(token) for token in mixed_tokens]
        assert positions == sorted(positions)

        quoted_selector_source = Path(directory) / "quoted-selector-source.css"
        quoted_selector_source.write_text(
            '/* source selector comment */ [data-label="/* keep this text */"]'
            "{margin:auto 0}"
        )
        quoted_selector_owner = Path(directory) / "quoted-selector-owner.css"
        quoted_selector_owner.write_text(
            '[data-label="/* keep this text */"] {\n'
            "    margin: 0\n"
            "}\n"
        )
        output = Path(directory) / "quoted-selector-output.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(quoted_selector_source),
                "--owner-snapshot",
                str(quoted_selector_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        quoted_selector_output = output.read_text()
        assert quoted_selector_output.count('[data-label="/* keep this text */"] {') == 1
        assert "/* source selector comment */" in quoted_selector_output
        assert '[data-label=""]' not in quoted_selector_output

        distinct_quoted_source = Path(directory) / "distinct-quoted-source.css"
        distinct_quoted_source.write_text('[data-label="a b"]{margin:auto 0}')
        distinct_quoted_owner = Path(directory) / "distinct-quoted-owner.css"
        distinct_quoted_owner.write_text(
            '[data-label="ab"] {\n'
            "    color: blue\n"
            "}\n"
        )
        output = Path(directory) / "distinct-quoted-output.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(distinct_quoted_source),
                "--owner-snapshot",
                str(distinct_quoted_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        distinct_quoted_output = output.read_text()
        assert distinct_quoted_output.count('[data-label="a b"] {') == 1
        assert distinct_quoted_output.count('[data-label="ab"] {') == 1

        distinct_comment_text_source = Path(directory) / "distinct-comment-text-source.css"
        distinct_comment_text_source.write_text(
            '/* real selector comment */ [data-label="/* keep text */"]{margin:auto 0}'
        )
        distinct_comment_text_owner = Path(directory) / "distinct-comment-text-owner.css"
        distinct_comment_text_owner.write_text(
            '[data-label="/*keep text*/"] {\n'
            "    color: blue\n"
            "}\n"
        )
        output = Path(directory) / "distinct-comment-text-output.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(distinct_comment_text_source),
                "--owner-snapshot",
                str(distinct_comment_text_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        distinct_comment_text_output = output.read_text()
        assert distinct_comment_text_output.count('[data-label="/* keep text */"] {') == 1
        assert distinct_comment_text_output.count('[data-label="/*keep text*/"] {') == 1
        assert "/* real selector comment */" in distinct_comment_text_output

        leading_statements_source = Path(directory) / "leading-statements-source.css"
        leading_statements_source.write_text(
            '@charset "UTF-8";\n'
            '@import url("theme.css");\n'
            ".card{margin:0}"
        )
        leading_statements_owner = Path(directory) / "leading-statements-owner.css"
        leading_statements_owner.write_text(
            ".card {\n"
            "    color: white\n"
            "}\n"
        )
        output = Path(directory) / "leading-statements-output.css"
        result = subprocess.run(
            [
                "python3",
                str(FORMATTER),
                "--source-css",
                str(leading_statements_source),
                "--owner-snapshot",
                str(leading_statements_owner),
                "--output",
                str(output),
            ],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        leading_statements_output = output.read_text()
        assert leading_statements_output.startswith(
            '@charset "UTF-8";\n@import url("theme.css");\n\n.card {'
        )
        assert leading_statements_output.count(".card {") == 1
        assert "@charset \"UTF-8\"; @import" not in leading_statements_output
        assert '@import url("theme.css"); .card' not in leading_statements_output

    print("PASS: CSS snapshot formatter examples")


if __name__ == "__main__":
    main()
