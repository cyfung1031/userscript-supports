#!/usr/bin/env python3
"""Exercise the lineage router with small realistic snapshot transitions."""

from pathlib import Path
import subprocess
import tempfile


ROOT = Path(__file__).parents[1]
CLASSIFIER = ROOT / "scripts" / "classify_lineage.py"
FIXTURE = ROOT / "examples" / "mini-greasyfork-dark.user.js"


def run(previous, current):
    return subprocess.run(
        ["python3", str(CLASSIFIER), str(previous), str(current)],
        capture_output=True,
        text=True,
        check=False,
    )


def main():
    source = FIXTURE.read_text()
    with tempfile.TemporaryDirectory() as directory:
        directory = Path(directory)
        previous = directory / "previous.user.js"
        previous.write_text(source)

        unchanged = directory / "unchanged.user.js"
        unchanged.write_text(source)
        result = run(previous, unchanged)
        assert result.returncode == 0, result.stderr
        assert "mode: NO_GENERAL_CHANGE" in result.stdout

        targeted = directory / "targeted.user.js"
        targeted.write_text(source.replace("#24272d", "#25282e", 1))
        result = run(previous, targeted)
        assert result.returncode == 0, result.stderr
        assert "mode: TARGETED_OWNER_DELTA" in result.stdout

        structural = directory / "structural.user.js"
        extra_rules = "\n".join(
            f".new-current-selector-{index} {{ color: #fff; }}"
            for index in range(30)
        )
        structural.write_text(source.replace("        `,\n\n        // https", f"{extra_rules}\n        `,\n\n        // https", 1))
        result = run(previous, structural)
        assert result.returncode == 0, result.stderr
        assert "mode: STRUCTURAL_REFRESH" in result.stdout

    print("PASS: lineage classifier examples")


if __name__ == "__main__":
    main()
