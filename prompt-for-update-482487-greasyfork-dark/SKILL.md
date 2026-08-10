---
name: prompt-for-update-482487-greasyfork-dark
description: Update the Greasy Fork Dark userscript's existing hard-coded // general CSS snapshot to the latest Greasy Fork application CSS while preserving the owner's dark palette, comments, selector-specific overrides, supplemental styles, and runtime architecture. Use when 482487-greasyfork-dark.user.js needs a CSS structure refresh, selector/media/layering update, or current application stylesheet comparison.
---

# Greasy Fork Dark CSS snapshot update

Use this skill for the one-file userscript update task. Read the agent guide at the cssTextFn boundary in 482487-greasyfork-dark.user.js before editing.

## Core contract

- Update the one existing // general template literal in place. Never append a second application CSS snapshot.
- Treat the raw current application CSS as the structure/non-color-token oracle and the historical // general snapshot as the owner styling oracle. Formatted copies are navigation aids only.
- Treat the actual target script, especially its current or HEAD // general declarations, as authoritative for colors and comments. Reference files contain examples and procedure only; they may become stale.
- Preserve attached CSS comments, hard-coded colors, selector-specific overrides, and webhook/userscript/extension/PrettyPrint/stats supplemental templates. If the old snapshot has a detached `/* Preserved comments from the previous // general snapshot. */` catalogue, treat it as stale migration debris: do not copy the catalogue or its detached tokens; recover each item only from its real declaration/rule when present.
- Exclude active :root variables and the official prefers-color-scheme dark branch. Preserve the user's own dark-theme design.
- Do not redesign cssTextFn, removeNonColor, generalCSSFn, lifecycle timing, filtering, or style injection.
- Use PickInvariant as a focused structural audit: bind the owner snapshot, current browser-observed CSS, and these invariants before committing.

## Load by phase

- Update procedure, source/version mapping, merge rules, and stop condition: read references/workflow.md.
- Published adjacent-version patterns and the routing classifier: read references/lineage-deltas.md and run scripts/classify_lineage.py when version sources are available.
- Reading the existing JavaScript and converting upstream CSS into the snapshot: read references/source-and-conversion.md.
- Snapshot indentation, ordering, comments, and focused-diff rules: read references/format-contract.md before editing.
- Source declaration tokens and maintainable comment placement: read references/source-fidelity.md before converting CSS.
- Source-to-snapshot formatting/cascade harness: run scripts/audit_css_format.py with --strict before accepting the diff.
- Snapshot-ready whitespace/newline conversion: run scripts/format_css_snapshot.py with the raw CSS
  and actual previous snapshot. It transfers source structure/layout, overlays recognized owner
  colors and --gfdark-* declarations, carries attached owner comments, and preserves complete
  owner-only rules; review the result before inserting it.
- Before/after diff justification: run scripts/audit_snapshot_diff.py with the raw CSS and reject
  FORMAT-ONLY hunks or non-general runtime changes without separate evidence.
- Color substitutions and changed-selector policy: read references/color-policy.md.
- Deterministic checks and failure interpretation: read references/mechanical-checks.md.
- Concrete passing/failing command examples: read references/examples.md.

## Required handoff

Run the bundled checker, all fixture tests including tests/test_snapshot_diff.py, JavaScript syntax
and diff checks, obtain independent read-only sub-agent verification, commit incrementally, and
push/update the PR only after all checks pass. Treat these as best-effort double confirmation; the
actual script, format contract, focused diff, and owner comments remain primary. Keep the final diff
limited to the requested target and skill artifacts.
