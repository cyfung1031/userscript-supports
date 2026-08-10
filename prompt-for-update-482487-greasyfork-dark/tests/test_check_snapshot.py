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

        quoted_selector = directory / "quoted-selector.user.js"
        quoted_selector.write_text(
            source.replace(
                ".inline-script-stats {",
                '.form.new_user input[type="submit"] { display: block; }\n.inline-script-stats {',
                1,
            )
        )
        unquoted_upstream = directory / "upstream-unquoted-selector.css"
        unquoted_upstream.write_text(
            UPSTREAM.read_text()
            + "\n.form.new_user input[type=submit] { display: block; }\n"
        )
        expect_pass(run(quoted_selector, unquoted_upstream))

        collapsed_blocks = directory / "collapsed-blocks.user.js"
        collapsed_blocks.write_text(source.replace(".diff ul {\n    color: #e9e9e9;\n}\n", "", 1))
        expect_fail(
            run(collapsed_blocks),
            "repeated upstream CSS blocks were collapsed",
        )

        missing_token = directory / "missing-token.user.js"
        missing_token.write_text(source.replace("margin: auto 0;", "margin: auto 0px;", 1))
        token_upstream = directory / "upstream-with-source-token.css"
        token_upstream.write_text(UPSTREAM.read_text())
        expect_fail(run(missing_token, token_upstream), "current upstream declaration tokens missing")

        previous = directory / "previous.user.js"
        previous.write_text(source)
        missing_comment = directory / "missing-comment.user.js"
        missing_comment.write_text(source.replace("/* owner link color */", "", 1))
        expect_fail(run(missing_comment, previous=previous), "historical CSS comments lost")

        previous_with_catalogue = directory / "previous-with-catalogue.user.js"
        previous_with_catalogue.write_text(
            previous.read_text()
            .replace("\n        `,\n", "\n        /* Preserved comments from the previous // general snapshot. */\n        /* #detached; */\n        `,\n")
        )
        no_catalogue_loss = directory / "no-catalogue-loss.user.js"
        no_catalogue_loss.write_text(source)
        expect_pass(run(no_catalogue_loss, previous=previous_with_catalogue))

        orphan_comments = directory / "orphan-comments.user.js"
        orphan_comments.write_text(
            source.replace(
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                "        /* Preserved comments from the previous // general snapshot. */\n        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                1,
            )
        )
        expect_fail(
            run(orphan_comments),
            "orphan preserved-comment catalogue remains",
        )

    print("PASS: miniature snapshot examples")


if __name__ == "__main__":
    main()
