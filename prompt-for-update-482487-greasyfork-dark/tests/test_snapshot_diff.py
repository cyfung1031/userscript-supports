#!/usr/bin/env python3
"""Exercise before/after diff justification checks."""

from pathlib import Path
import subprocess
import tempfile


ROOT = Path(__file__).parents[1]
HARNESS = ROOT / "scripts" / "audit_snapshot_diff.py"
FIXTURE = ROOT / "examples" / "mini-greasyfork-dark.user.js"
SOURCE = ROOT / "references" / "fixtures" / "current-application.css"


def run(before, after):
    return subprocess.run(
        [
            "python3",
            str(HARNESS),
            "--before",
            str(before),
            "--after",
            str(after),
            "--source-css",
            str(SOURCE),
            "--strict",
        ],
        capture_output=True,
        text=True,
    )


def main():
    with tempfile.TemporaryDirectory() as directory:
        directory = Path(directory)
        before = directory / "before.user.js"
        after = directory / "after.user.js"
        before.write_text(FIXTURE.read_text())
        after.write_text(FIXTURE.read_text())
        result = run(before, after)
        assert result.returncode == 0, result.stdout + result.stderr

        formatted = directory / "formatted.user.js"
        formatted.write_text(
            FIXTURE.read_text().replace("    color: #e9e9e9;", "color:#e9e9e9;", 1)
        )
        result = run(before, formatted)
        assert result.returncode != 0
        assert "format_only_changes" in result.stdout

        runtime_change = directory / "runtime-change.user.js"
        runtime_change.write_text(
            FIXTURE.read_text().replace(
                "    return cssTextFn();", "    return cssTextFn().concat('runtime');", 1
            )
        )
        result = run(before, runtime_change)
        assert result.returncode != 0
        assert "outside_general_changed" in result.stdout

        quote_change = directory / "quote-change.user.js"
        quote_change.write_text(
            FIXTURE.read_text().replace(
                ".inline-script-stats {",
                'form.new_user input[type="submit"] { display: block; }\n.inline-script-stats {',
                1,
            )
        )
        quoted_before = directory / "quoted-before.user.js"
        quoted_before.write_text(
            FIXTURE.read_text().replace(
                ".inline-script-stats {",
                "form.new_user input[type=submit] { display: block; }\n.inline-script-stats {",
                1,
            )
        )
        result = run(quoted_before, quote_change)
        assert result.returncode != 0
        assert "attribute-selector quote addition" in result.stdout

        both_spellings_before = directory / "both-spellings-before.user.js"
        both_spellings_before.write_text(
            FIXTURE.read_text().replace(
                ".inline-script-stats {",
                'form.new_user input[type=submit] { display: block; }\n'
                'form.new_user input[type="submit"] { display: block; }\n'
                ".inline-script-stats {",
                1,
            )
        )
        both_spellings_after = directory / "both-spellings-after.user.js"
        both_spellings_after.write_text(both_spellings_before.read_text())
        result = run(both_spellings_before, both_spellings_after)
        assert result.returncode == 0, result.stdout + result.stderr

    print("PASS: snapshot diff audit examples")


if __name__ == "__main__":
    main()
