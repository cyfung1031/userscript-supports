#!/usr/bin/env python3
"""Exercise source-token, selector-order, and repeated-block format checks."""

from pathlib import Path
import subprocess
import tempfile


ROOT = Path(__file__).parents[1]
HARNESS = ROOT / "scripts" / "audit_css_format.py"
FIXTURE = ROOT / "examples" / "mini-greasyfork-dark.user.js"
SOURCE = ROOT / "references" / "fixtures" / "current-application.css"


def run(target, source=SOURCE):
    return subprocess.run(
        [
            "python3",
            str(HARNESS),
            "--source-css",
            str(source),
            "--snapshot-file",
            str(target),
            "--strict",
        ],
        capture_output=True,
        text=True,
        check=False,
    )


def main():
    result = run(FIXTURE)
    assert result.returncode == 0, result.stdout + result.stderr
    assert "FORMAT_HARNESS: PASS" in result.stdout

    with tempfile.TemporaryDirectory() as directory:
        directory = Path(directory)

        token_drift = directory / "token-drift.user.js"
        token_drift.write_text(FIXTURE.read_text().replace("margin: auto 0;", "margin: auto 0px;", 1))
        result = run(token_drift)
        assert result.returncode != 0
        assert "missing_non_color_tokens" in result.stdout

        collapsed = directory / "collapsed.user.js"
        collapsed.write_text(
            FIXTURE.read_text().replace(
                ".diff ul {\n    color: #e9e9e9;\n}\n",
                "",
                1,
            )
        )
        result = run(collapsed)
        assert result.returncode != 0
        assert "collapsed_repeated_blocks" in result.stdout

    print("PASS: CSS format harness examples")


if __name__ == "__main__":
    main()
