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

    print("PASS: CSS snapshot formatter examples")


if __name__ == "__main__":
    main()
