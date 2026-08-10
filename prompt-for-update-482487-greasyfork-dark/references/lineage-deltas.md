# Published version-lineage deltas

Use the published script history as a procedure check, not as a replacement for the current
userscript or current Greasy Fork CSS. The actual target's current/HEAD `// general` snapshot owns
colors, comments, custom properties, and preserved supplemental rules.

## PickInvariant audit receipt

- mode: `PICK_AUDIT`
- audit depth: `DELTA_AUDIT` for adjacent published versions; `FOCUSED_AUDIT` for the final live-CSS refresh
- owner: the actual `482487-greasyfork-dark.user.js` and its existing `// general` template
- target decision: update that one template so its structure follows the current application CSS while owner styling remains effective
- structure oracle: the current stylesheet observed on the live Greasy Fork page
- exclusions: active `:root`, official `prefers-color-scheme: dark` rules, runtime architecture, and supplemental templates that are not part of `// general`
- evidence limit: the update host mapping is retained for reproducibility, but a browser/client block is not evidence that the update-host bytes were fetched; use a readable Greasy Fork code page or a locally saved source when necessary

## Reconstructed adjacent families

| Transition | Observed family | Procedure consequence |
| --- | --- | --- |
| v0.3.21 → v0.3.22 | structural refresh | Rebuild/merge the existing snapshot against current selectors, media, and grouping; preserve owner colors/comments. |
| v0.3.22 → v0.3.23 | targeted owner delta | Inspect the narrow general diff for an intentional color or formatting preference; do not perform a broad rewrite. |
| v0.3.23 → v0.3.24 | same targeted correction carried forward | Treat repeated content as resolved history, not a new finding. |
| v0.3.24 → v0.3.25 | no general change | Do not touch the snapshot because only non-general metadata changed. |
| v0.3.25 → v0.3.30 | structural refresh plus runtime preservation | Merge the changed PrettyPrint/diff/Ace structure in place; preserve `--gfdark-*` properties because the runtime filter was changed to retain them. |
| v0.3.30 → v0.3.31 | no general change | Do not copy the Stylis `require` or version bump into the CSS snapshot. |
| v0.3.31 → v0.3.32 | targeted owner delta | Preserve the owner’s PrettyPrint comment color preference as a narrow declaration change. |

## Mechanical classification rule

Run `scripts/classify_lineage.py` on adjacent published script files before designing the edit.
It compares only the existing `// general` contents and reports whether the transition is:

- `STRUCTURAL_REFRESH`: the general snapshot changed substantially; perform the current-CSS merge.
- `TARGETED_OWNER_DELTA`: the general snapshot changed only a small number of lines; inspect that
  focused delta and carry the owner preference into the current merge.
- `NO_GENERAL_CHANGE`: the general snapshot is identical; leave it alone unless the live current CSS
  independently proves that the snapshot is stale. Non-general changes remain outside the snapshot.

The threshold is a routing aid, not a color authority: a small change still requires inspection,
and a current live stylesheet always outranks historical snapshots for structure.

## Historical token evidence

The published v0.3.22, v0.3.23, v0.3.25, v0.3.30, and v0.3.32 snapshots retain the responsive rule
as `margin: auto 0` in the existing snapshot style. They do not add `px` or an invented trailing
semicolon. This is a confirmed owner/source seam, not a formatter preference. Historical updates
also keep source selector spelling such as unquoted attribute selectors when that spelling is
unchanged; a structural refresh must not normalize these tokens while adding new rules.
