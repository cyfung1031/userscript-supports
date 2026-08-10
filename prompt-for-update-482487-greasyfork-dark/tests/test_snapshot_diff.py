#!/usr/bin/env python3
"""Exercise before/after diff justification checks."""

from pathlib import Path
import subprocess
import tempfile


ROOT = Path(__file__).parents[1]
HARNESS = ROOT / "scripts" / "audit_snapshot_diff.py"
FIXTURE = ROOT / "examples" / "mini-greasyfork-dark.user.js"
SOURCE = ROOT / "references" / "fixtures" / "current-application.css"


def run(before, after, source=SOURCE):
    return subprocess.run(
        [
            "python3",
            str(HARNESS),
            "--before",
            str(before),
            "--after",
            str(after),
            "--source-css",
            str(source),
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

        context_swapped = directory / "context-swapped.user.js"
        context_swapped.write_text(
            FIXTURE.read_text()
            .replace("margin: auto 1.2vw;", "__SWAP__", 1)
            .replace("margin: auto 0;", "margin: auto 1.2vw;", 1)
            .replace("__SWAP__", "margin: auto 0;", 1)
        )
        result = run(before, context_swapped)
        assert result.returncode != 0
        assert "missing_non_color_tokens" in result.stdout

        ordered_source = directory / "ordered-source.css"
        ordered_source.write_text(".order-marker{margin:0;padding:1px;}")
        ordered_before = directory / "ordered-before.user.js"
        ordered_before.write_text(
            FIXTURE.read_text().replace(
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                "        .order-marker {\n"
                "            margin: 0;\n"
                "            padding: 1px;\n"
                "        }\n"
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                1,
            )
        )
        ordered_after = directory / "ordered-after.user.js"
        ordered_after.write_text(
            ordered_before.read_text().replace(
                "            margin: 0;\n            padding: 1px;",
                "            padding: 1px;\n            margin: 0;",
                1,
            )
        )
        result = run(ordered_before, ordered_after, ordered_source)
        assert result.returncode != 0
        assert "missing_non_color_tokens" in result.stdout

        nested_ordered_source = directory / "nested-ordered-source.css"
        nested_ordered_source.write_text(
            ".order-parent{margin:0;.nested{padding:1px;}width:2px;}"
        )
        nested_ordered_before = directory / "nested-ordered-before.user.js"
        nested_ordered_before.write_text(
            FIXTURE.read_text().replace(
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                ".order-parent {\n"
                "            margin: 0;\n"
                "            .nested {\n"
                "                padding: 1px;\n"
                "            }\n"
                "            width: 2px;\n"
                "        }\n"
                "        `,\n\n        // https://greasyfork.org/en/users/webhook-info",
                1,
            )
        )
        nested_ordered_after = directory / "nested-ordered-after.user.js"
        nested_ordered_after.write_text(
            nested_ordered_before.read_text().replace(
                "            .nested {\n"
                "                padding: 1px;\n"
                "            }\n"
                "            width: 2px;",
                "            width: 2px;\n"
                "            .nested {\n"
                "                padding: 1px;\n"
                "            }",
                1,
            )
        )
        result = run(nested_ordered_before, nested_ordered_after, nested_ordered_source)
        assert result.returncode != 0
        assert "missing_non_color_tokens" in result.stdout

        tabs = directory / "tabs.user.js"
        tabs.write_text(FIXTURE.read_text().replace("    color: #e9e9e9;", "\tcolor: #e9e9e9;", 1))
        result = run(before, tabs)
        assert result.returncode != 0
        assert "snapshot_tabs" in result.stdout

        trailing = directory / "trailing.user.js"
        trailing.write_text(FIXTURE.read_text().replace("    color: #e9e9e9;", "    color: #e9e9e9; ", 1))
        result = run(before, trailing)
        assert result.returncode != 0
        assert "snapshot_trailing_whitespace_lines" in result.stdout

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
