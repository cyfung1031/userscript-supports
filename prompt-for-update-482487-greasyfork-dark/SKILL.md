---
name: prompt-for-update-482487-greasyfork-dark
description: Update the Greasy Fork Dark userscript's existing hard-coded // general CSS snapshot to the latest Greasy Fork application CSS while preserving the owner's dark palette, comments, selector-specific overrides, supplemental styles, and runtime architecture. Use when 482487-greasyfork-dark.user.js needs a CSS structure refresh, selector/media/layering update, or current application stylesheet comparison.
---

# Greasy Fork Dark CSS snapshot update

Use this skill for the one-file userscript update task. Read the agent guide at the cssTextFn boundary in 482487-greasyfork-dark.user.js before editing.

## Core contract

- Update the one existing // general template literal in place. Never append a second application CSS snapshot.
- Treat current application CSS as the structure oracle and the historical // general snapshot as the owner styling oracle.
- Treat the actual target script, especially its current or HEAD // general declarations, as authoritative for colors and comments. Reference files contain examples and procedure only; they may become stale.
- Preserve all CSS comments, hard-coded colors, selector-specific overrides, and webhook/userscript/extension/PrettyPrint/stats supplemental templates.
- Exclude active :root variables and the official prefers-color-scheme dark branch. Preserve the user's own dark-theme design.
- Do not redesign cssTextFn, removeNonColor, generalCSSFn, lifecycle timing, filtering, or style injection.
- Use PickInvariant as a focused structural audit: bind the owner snapshot, current browser-observed CSS, and these invariants before committing.

## Load by phase

- Update procedure, source/version mapping, merge rules, and stop condition: read references/workflow.md.
- Reading the existing JavaScript and converting upstream CSS into the snapshot: read references/source-and-conversion.md.
- Color substitutions and changed-selector policy: read references/color-policy.md.
- Deterministic checks and failure interpretation: read references/mechanical-checks.md.
- Concrete passing/failing command examples: read references/examples.md.

## Required handoff

Run the bundled checker, run JavaScript syntax and diff checks, obtain independent read-only sub-agent verification, commit incrementally, and push/update the PR only after all checks pass. Keep the final diff limited to the requested target and skill artifacts.
