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

        context_source = directory / "context-source.css"
        context_source.write_text(
            "@media screen and (width <= 400px) { .context-marker { margin: 0; } }"
            "@media screen and (width > 400px) { .context-marker { margin: 1px; } }"
        )
        context_snapshot = directory / "context-swapped.user.js"
        context_snapshot.write_text(
            FIXTURE.read_text().replace(
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                ""
                "@media screen and (width <= 400px) {\n"
                "    .context-marker {\n"
                "        margin: 1px;\n"
                "    }\n"
                "}\n"
                "@media screen and (width > 400px) {\n"
                "    .context-marker {\n"
                "        margin: 0;\n"
                "    }\n"
                "}\n"
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                1,
            )
        )
        result = run(context_snapshot, context_source)
        assert result.returncode != 0
        assert "missing_non_color_tokens" in result.stdout

        ordered_source = directory / "ordered-source.css"
        ordered_source.write_text(".order-marker{margin:0;padding:1px;}")
        ordered_snapshot = directory / "ordered-snapshot.user.js"
        ordered_snapshot.write_text(
            FIXTURE.read_text().replace(
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                "        .order-marker {\n"
                "            padding: 1px;\n"
                "            margin: 0;\n"
                "        }\n"
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                1,
            )
        )
        result = run(ordered_snapshot, ordered_source)
        assert result.returncode != 0
        assert "missing_non_color_tokens" in result.stdout

        nested_ordered_source = directory / "nested-ordered-source.css"
        nested_ordered_source.write_text(
            ".order-parent{margin:0;.nested{padding:1px;}width:2px;}"
        )
        nested_ordered_snapshot = directory / "nested-ordered-snapshot.user.js"
        nested_ordered_snapshot.write_text(
            FIXTURE.read_text().replace(
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                ".order-parent {\n"
                "    margin: 0;\n"
                "    width: 2px;\n"
                "    .nested {\n"
                "        padding: 1px;\n"
                "    }\n"
                "}\n"
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                1,
            )
        )
        result = run(nested_ordered_snapshot, nested_ordered_source)
        assert result.returncode != 0
        assert "missing_non_color_tokens" in result.stdout

        nested_owner_extra = directory / "nested-owner-extra.user.js"
        nested_owner_extra.write_text(
            FIXTURE.read_text().replace(
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                ".order-parent {\n"
                "    margin: 0;\n"
                "    height: 3px;\n"
                "    .nested {\n"
                "        padding: 1px;\n"
                "    }\n"
                "    width: 2px;\n"
                "}\n"
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                1,
            )
        )
        result = run(nested_owner_extra, nested_ordered_source)
        assert result.returncode == 0, result.stdout + result.stderr

        owner_extra = directory / "owner-extra.user.js"
        owner_extra.write_text(
            ordered_snapshot.read_text().replace(
                "            padding: 1px;\n            margin: 0;",
                "            width: 1px;\n            margin: 0;\n            padding: 1px;",
                1,
            )
        )
        result = run(owner_extra, ordered_source)
        assert result.returncode == 0, result.stdout + result.stderr

        border_source = directory / "border-source.css"
        border_source.write_text(
            ".border-regression{"
            "border-top:1px solid black;"
            "border-right:0;"
            "border-bottom:2px dashed #fff;"
            "border-left:3px;"
            "border-top-color:#abc;"
            "}"
        )
        border_snapshot = directory / "border-snapshot.user.js"
        border_snapshot.write_text(
            FIXTURE.read_text().replace(
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                "        .border-regression {\n"
                "            border-top: 6px solid #111;\n"
                "            border-right: 2px solid #222;\n"
                "            border-bottom: 4px dotted #333;\n"
                "            border-left: 5px solid #444;\n"
                "            border-top-color: #abc;\n"
                "        }\n"
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                1,
            )
        )
        result = run(border_snapshot, border_source)
        assert result.returncode == 0, result.stdout + result.stderr
        assert "FORMAT_HARNESS: PASS" in result.stdout

        border_color_drift = directory / "border-color-drift.user.js"
        border_color_drift.write_text(
            border_snapshot.read_text().replace(
                "border-top-color: #abc;", "border-top-color: #def;", 1
            )
        )
        result = run(border_color_drift, border_source)
        assert result.returncode != 0
        assert "missing_non_color_tokens" in result.stdout

        bad_whitespace = directory / "bad-whitespace.user.js"
        bad_whitespace.write_text(
            FIXTURE.read_text().replace(
                "    color: #e9e9e9;\n",
                "\tcolor: #e9e9e9; \n",
                1,
            )
        )
        result = run(bad_whitespace)
        assert result.returncode != 0
        assert "snapshot_tabs" in result.stdout
        assert "snapshot_trailing_whitespace_lines" in result.stdout

    print("PASS: CSS format harness examples")


if __name__ == "__main__":
    main()
