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

    print("PASS: CSS snapshot formatter examples")


if __name__ == "__main__":
    main()
