# Mechanical checks

Run from the repository root.

## Fixture test

Run the realistic miniature examples before changing the live target:

    python3 prompt-for-update-482487-greasyfork-dark/tests/test_check_snapshot.py

This test invokes the real checker and asserts one passing conversion plus failures for a duplicate general marker, a missing current selector, and a lost historical comment. It is a double-confirmation aid, not a substitute for reading the actual script and reviewing the formatted diff.

## Version-lineage check

For two readable adjacent published scripts, run:

    python3 prompt-for-update-482487-greasyfork-dark/scripts/classify_lineage.py \
      /tmp/greasyfork-v0.3.31.user.js /tmp/greasyfork-v0.3.32.user.js

The result must be reviewed before editing. `NO_GENERAL_CHANGE` means the historical transition
does not justify a snapshot edit; `TARGETED_OWNER_DELTA` means inspect a narrow owner delta;
`STRUCTURAL_REFRESH` means perform the full current-CSS merge. This check does not replace the
current live CSS coverage check.

## Source-format harness

Run the ordered source-to-snapshot harness before accepting the diff:

    python3 prompt-for-update-482487-greasyfork-dark/scripts/audit_css_format.py \
      --source-css /tmp/greasyfork-current-application.formatted.css \
      --snapshot-file 482487-greasyfork-dark.user.js \
      --strict

It reports source selectors missing from the snapshot, repeated blocks that were collapsed, and
best-effort non-color declaration-token drift. A pass does not prove visual equivalence or exact
order, so inspect the ordered diff; a failure is a repair signal, not a reason to weaken the rule.

## Standard update check

    python3 prompt-for-update-482487-greasyfork-dark/scripts/check_snapshot.py \
      --file 482487-greasyfork-dark.user.js \
      --base-ref HEAD \
      --upstream-css /tmp/greasyfork-current-application.formatted.css \
      --only-target
    node --check 482487-greasyfork-dark.user.js
    git diff --check

Use --only-target when the working tree contains only the userscript update or is clean after a
verified no-op. Omit it while the skill package itself is being created or changed.

When reapplying against the same live CSS asset, also require an empty target-only diff if the
checker passes. An empty target diff is evidence that the existing snapshot is already current;
it is not a missing implementation.

## What the checker proves

The checker verifies:

- exactly one // general template;
- no duplicate structural snapshot or application-asset comment;
- current media and selector markers are present;
- active :root and official prefers-color-scheme dark branches are absent;
- supplemental webhook, PrettyPrint, and stats markers remain;
- no orphan preserved-comment catalogue is present;
- required owner colors remain;
- CSS braces, parentheses, comments, quotes, and escapes are balanced;
- CSS variables are declared, including owner --gfdark-* variables;
- comments and hex colors from HEAD remain;
- every selector from an optional formatted upstream CSS input is represented;
- repeated upstream selector blocks are not collapsed into one block;
- best-effort non-color declaration tokens from the upstream CSS are represented, so unit/value drift such as `auto 0` → `auto 0px` is surfaced;
- node --check succeeds;
- optional full porcelain git scope, including untracked files, contains only the target userscript.

The checker does not certify visual equivalence or all formatting intent. Before trusting a pass,
review indentation, blank lines, selector grouping, declaration order, comment placement, and
whether unchanged blocks were needlessly reflowed, using references/format-contract.md and
references/source-fidelity.md. Token coverage is deliberately best-effort because selector regrouping
and equivalent CSS expressions can require human review.

## Failure handling

A failure is evidence of an incomplete merge, not a reason to weaken the check.

- Duplicate marker or structural snapshot: remove the appended block and update the existing general template.
- Missing current selector: inspect formatting, media nesting, and changed selector seams; do not silently exclude it.
- Historical comment/color loss: restore the old declaration or preserve its selector-specific rule in the same general template.
- Orphan preserved-comment catalogue: remove the detached comment list and attach each comment to its real declaration/rule; then re-audit source-to-snapshot coding coverage.
- Active root/dark branch or unresolved upstream variable: remove or resolve it while retaining owner custom properties.
- Scope failure: stop and inspect git status before staging.
