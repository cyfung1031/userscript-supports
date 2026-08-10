# Update workflow

## 1. Bind the evidence

Read the actual target, its embedded agent guide, repository instructions, and the other relevant references. The target's current or HEAD declarations outrank every reference example. Record git status. Use PickInvariant focused audit with:

- owner: the existing // general template and its historical effective colors;
- structure oracle: the current browser-observed Greasy Fork application CSS;
- scope: selectors, media queries, layout/layering seams, hard-coded visual declarations, and preserved comments;
- exclusions: official root/dark branches and runtime architecture.

For a published script version, use this mapping:

    https://greasyfork.org/en/scripts/482487-greasyfork-dark?version=<version>
    https://update.greasyfork.org/scripts/482487/<version>/GreasyFork%20Dark.user.js

For the application CSS, use the current stylesheet link observed in the live page, not a stale historical asset. Save a formatted snapshot outside the repository when useful.

## 2. Compare and design

Extract the old // general template from HEAD before editing. Compare its selector families, responsive conditions, and layering with the current CSS. Version v0.3.22, “Update to latest CSS,” is the validated historical precedent. Later versions provide targeted history, such as the v0.3.23 self-link color correction.

Build a current-structure snapshot in the previous formatting style. Remove active :root and prefers-color-scheme dark branches. Resolve upstream variables into owner values where the actual old snapshot establishes them. Merge visual declarations by exact normalized selector first; then retain old unmatched selector-specific rules in the same // general template for renamed or regrouped selectors. Keep review comments next to their declarations and retain --gfdark-* properties needed by diff hover behavior.

## 3. Edit narrowly

Replace only the content between the existing // general template backticks. Derive the color map from the actual previous target snapshot; do not copy a fixed palette from references. Do not append a new snapshot marker. Do not delete, move, or rewrite webhook-info, PrettyPrint, stats, or other supplemental templates. Do not redesign cssTextFn, removeNonColor, generalCSSFn, lifecycle timing, filtering, or style injection.

A stylesheet-link predicate is outside the default snapshot change. Change it only when direct current-page evidence proves the old predicate no longer matches the live stylesheet link, and keep that change isolated.

## 4. Verify, commit, and hand off

Run references/mechanical-checks.md and obtain independent read-only sub-agent verification. Commit meaningful stages separately, verifying after each commit. Push the branch and update or open the PR only after final checks pass.

Stop when the existing general snapshot has current structure, owner colors/comments/supplementals remain, all mechanical checks pass, the sub-agent is green, and no duplicate snapshot or architectural change is present.
