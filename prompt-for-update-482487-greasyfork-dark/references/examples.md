# Mechanical-check examples

Run these examples from the repository root after loading the skill and obtaining the raw current
application CSS asset. A formatted copy may be kept separately for navigation, but never for
declaration-token decisions.

The small realistic fixtures are stored in the skill package:

- examples/mini-greasyfork-dark.user.js is the miniature target coding file.
- references/fixtures/previous-general.css is the owner-style CSS sample.
- references/fixtures/current-application.css is the upstream structure sample.
- tests/test_check_snapshot.py runs the real checker against them.

## Example 1: normal refresh check

Use this after replacing only the existing // general template:

    python3 prompt-for-update-482487-greasyfork-dark/scripts/check_snapshot.py \
      --file 482487-greasyfork-dark.user.js \
      --base-ref HEAD \
      --upstream-css /tmp/greasyfork-current-application.raw.css \
      --only-target

Expected result:

    PASS: Greasy Fork Dark snapshot invariants satisfied

Interpretation: the current selector set is represented, the old comments and colors remain, official dark variables are inactive, supplemental blocks remain, JavaScript syntax is valid, and the working-tree scope is limited to the target file. If the skill folder itself is still uncommitted, omit --only-target until that package change is committed or isolated.

## Example 1b: classify a historical seam

    python3 prompt-for-update-482487-greasyfork-dark/scripts/classify_lineage.py \
      /tmp/greasyfork-v0.3.25.user.js /tmp/greasyfork-v0.3.30.user.js

Expected result includes:

    mode: STRUCTURAL_REFRESH

The same command for v0.3.30→v0.3.31 reports `NO_GENERAL_CHANGE`, while v0.3.31→v0.3.32
reports `TARGETED_OWNER_DELTA`. These are routing examples; the current live stylesheet remains
the structure oracle.

## Example 1c: format-focused diff review

Before accepting a snapshot refresh, run the diff program against the complete before/after
scripts:

    python3 prompt-for-update-482487-greasyfork-dark/scripts/audit_snapshot_diff.py \
      --before /tmp/greasyfork-before.user.js \
      --after /tmp/greasyfork-after.user.js \
      --source-css /tmp/greasyfork-current-application.raw.css \
      --strict

Then confirm that each remaining hunk has a raw-CSS STRUCTURE or owner OVERLAY witness. Unchanged
blocks must retain their prior indentation, blank lines, selector grouping, declaration order, and
adjacent comments. If a formatter rewrote unrelated blocks, restore the established shape and keep
only the CSS structure/owner-preference changes. The bundled checks are secondary confirmation for
this review; see references/format-contract.md.

## Example 2: duplicate snapshot failure

If an agent appends a new template literal instead of replacing the existing one, the checker must stop:

    FAIL: expected exactly one // general marker

If the old marker remains unique but a separate application block is added, the expected failure is:

    FAIL: duplicate structural snapshot or upstream application-asset comment remains

Repair by deleting the extra block and updating the existing // general template. Do not silence the check.

## Example 3: owner-color or comment loss

If an update removes the historical inline-color compatibility rule or its color, the check against HEAD must stop with a historical-loss error, for example:

    FAIL: historical CSS colors lost: 1

If review comments were removed, the corresponding result is:

    FAIL: historical CSS comments lost: 1

Restore the old declaration/comment or preserve the old selector-specific rule in the same // general template. Do not replace the owner color with the upstream light or official dark value.

## Example 4: current structure coverage failure

When the upstream CSS contains a selector that was not copied into the general snapshot:

    FAIL: current upstream selectors missing: ['.new-current-selector']

Treat this as a structural merge gap. Inspect whether the selector belongs in the existing snapshot, whether it is inside an excluded :root or official dark branch, or whether the formatter failed. Resolve the seam before committing.

## Example 5: source-token and comment-placement failure

If the source contains:

    .width-constraint{margin:auto 0}

the maintained snapshot may add indentation but must retain `auto 0`; `auto 0px;` is a semantic
and formatting drift. Likewise, a detached block headed `/* Preserved comments from the previous
// general snapshot. */` is a failure: preserve the complete rule or attach each comment beside
its declaration instead.

For selector fidelity, `form.new_user input[type=submit]` must remain unquoted when that is how the
source expresses it. Adding quotes changes the focused diff and can hide whether the source selector
was actually copied.

If the source contains two separate `.diff ul` blocks, the result must contain two separate blocks
in the same order. Whitespace/newline cleanup is allowed; merging the declarations into one block is
not.

For a before/after review, run the diff-audit harness on the two complete scripts. A changed line is
accepted only when the raw CSS shows a structural change or the actual previous snapshot shows an
intentional owner overlay. For example, if the before snapshot contains
`form.new_user input[type=submit]` and the current CSS writes
`form.new_user input[type="submit"]`, the selector is semantically equivalent and the quote-only
diff is rejected; retain the prior unquoted form. Likewise, a source-backed `margin: auto 0` must
not be rewritten as `margin: auto 0px;`.

The executable harness is the repeatable check for this boundary:

    python3 prompt-for-update-482487-greasyfork-dark/scripts/audit_css_format.py \
      --source-css prompt-for-update-482487-greasyfork-dark/references/fixtures/current-application.css \
      --snapshot-file prompt-for-update-482487-greasyfork-dark/examples/mini-greasyfork-dark.user.js \
      --strict

The snapshot-ready formatter is separate from that audit:

    python3 prompt-for-update-482487-greasyfork-dark/scripts/format_css_snapshot.py \
      --source-css prompt-for-update-482487-greasyfork-dark/references/fixtures/current-application.css \
      --owner-snapshot prompt-for-update-482487-greasyfork-dark/references/fixtures/previous-general.css

Its output may add indentation and newlines, but it must preserve source values, semicolon
presence, selector tokens, declaration order, attached comments, and duplicate blocks. It also
overlays recognized owner colors and custom properties from the actual previous snapshot; a
trailing detached comment catalogue is ignored. Review that owner overlay against the actual
userscript before insertion.
