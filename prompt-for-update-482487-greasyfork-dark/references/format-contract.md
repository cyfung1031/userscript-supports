# Snapshot format contract

Formatting is part of the owner-maintained snapshot contract. The current CSS supplies structure
and non-color declaration tokens; it does not authorize semantic normalization or reformatting the
existing userscript.

## Required editing behavior

1. Read the actual current/HEAD `// general` template before writing. Treat its indentation, blank
   lines, selector grouping, declaration order, comment placement, and line endings as the format
   baseline.
2. Keep top-level selectors/braces at column zero and use the established four spaces for
   declarations and nested content. Preserve source tokens as described in
   references/source-fidelity.md. Do not introduce tabs, trailing whitespace, formatter-specific
   wrapping, or a whole-file reflow.
3. Preserve unchanged blocks byte-for-byte where possible. Insert a new current rule at the nearest
   upstream structural position, but retain the surrounding snapshot's spacing and block shape.
   Multiple blocks with the same selector are intentional cascade units; do not merge, deduplicate,
   reorder, or combine them.
4. Preserve selector lists, attribute-selector quoting, pseudo-elements, combinators, source
   declaration values, declaration order, and comment adjacency unless the current CSS structure
   requires a changed selector or an owner color overlay.
5. Replace only the content between the existing `// general` backticks. Do not format the
   JavaScript wrapper, supplemental templates, or runtime code as part of a CSS refresh.

## Diff review

Inspect the diff as an ordered source-to-snapshot diff, not just as a semantic CSS result. A good
diff shows current selectors/media/layering changes and intentional owner-color changes; it does not show
unchanged blocks rewritten because of indentation, blank-line, selector-wrapping, attribute quoting,
declaration-ordering, unit, shorthand, semicolon, or zero-value drift.

The bundled checks are best-effort double confirmation. They can catch balance, coverage, comments,
colors, and obvious whitespace problems, but they cannot prove visual equivalence or that every
formatting choice is the owner's preference. Direct reading of the actual script and human review
of the focused diff remain primary.
