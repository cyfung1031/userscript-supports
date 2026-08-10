#!/usr/bin/env python3
"""Run realistic pass/fail checks against the bundled miniature fixture."""

from pathlib import Path
import subprocess
import tempfile


ROOT = Path(__file__).parents[1]
CHECKER = ROOT / "scripts" / "check_snapshot.py"
FIXTURE = ROOT / "examples" / "mini-greasyfork-dark.user.js"
UPSTREAM = ROOT / "references" / "fixtures" / "current-application.css"


def run(target, upstream=UPSTREAM, previous=None):
    command = [
        "python3",
        str(CHECKER),
        "--file",
        str(target),
        "--upstream-css",
        str(upstream),
    ]
    if previous is not None:
        command.extend(["--previous-general", str(previous)])
    return subprocess.run(command, capture_output=True, text=True)


def expect_pass(result):
    assert result.returncode == 0, result.stdout + result.stderr
    assert "PASS: Greasy Fork Dark snapshot invariants satisfied" in result.stdout


def expect_fail(result, message):
    assert result.returncode != 0, result.stdout
    assert message in result.stderr, result.stdout + result.stderr


def main():
    expect_pass(run(FIXTURE))
    source = FIXTURE.read_text()
    with tempfile.TemporaryDirectory() as directory:
        directory = Path(directory)

        duplicate = directory / "duplicate.user.js"
        duplicate.write_text(source.replace("        // general", "        // general\n        // general", 1))
        expect_fail(run(duplicate), "expected exactly one // general marker")

        missing_selector = directory / "missing-selector.user.js"
        missing_selector.write_text(source)
        upstream = directory / "upstream-with-new-selector.css"
        upstream.write_text(UPSTREAM.read_text() + "\n.new-current-selector { color: #fff; }\n")
        expect_fail(run(missing_selector, upstream), "current upstream selectors missing")

        previous = directory / "previous.user.js"
        previous.write_text(source)
        missing_comment = directory / "missing-comment.user.js"
        missing_comment.write_text(source.replace("/* owner link color */", "", 1))
        expect_fail(run(missing_comment, previous=previous), "historical CSS comments lost")

    print("PASS: miniature snapshot examples")


if __name__ == "__main__":
    main()
