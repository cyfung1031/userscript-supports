# Mechanical checks

Run from the repository root.

## Standard update check

    python3 prompt-for-update-482487-greasyfork-dark/scripts/check_snapshot.py \
      --file 482487-greasyfork-dark.user.js \
      --base-ref HEAD \
      --upstream-css /tmp/greasyfork-current-application.formatted.css \
      --only-target
    node --check 482487-greasyfork-dark.user.js
    git diff --check

Use --only-target when the working tree contains only the userscript update. Omit it while the skill package itself is being created or changed.

## What the checker proves

The checker verifies:

- exactly one // general template;
- no duplicate structural snapshot or application-asset comment;
- current media and selector markers are present;
- active :root and official prefers-color-scheme dark branches are absent;
- supplemental webhook, PrettyPrint, and stats markers remain;
- required owner colors remain;
- CSS braces, parentheses, comments, quotes, and escapes are balanced;
- CSS variables are declared, including owner --gfdark-* variables;
- comments and hex colors from HEAD remain;
- every selector from an optional formatted upstream CSS input is represented;
- node --check succeeds;
- optional full porcelain git scope, including untracked files, contains only the target userscript.

## Failure handling

A failure is evidence of an incomplete merge, not a reason to weaken the check.

- Duplicate marker or structural snapshot: remove the appended block and update the existing general template.
- Missing current selector: inspect formatting, media nesting, and changed selector seams; do not silently exclude it.
- Historical comment/color loss: restore the old declaration or preserve its selector-specific rule in the same general template.
- Active root/dark branch or unresolved upstream variable: remove or resolve it while retaining owner custom properties.
- Scope failure: stop and inspect git status before staging.
