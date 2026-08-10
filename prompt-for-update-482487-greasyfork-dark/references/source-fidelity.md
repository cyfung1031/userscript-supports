# CSS source-fidelity contract

The upstream CSS is the authority for non-color declaration tokens. The owner script is the
authority for deliberate dark-theme color replacements and owner comments. Do not normalize source
values while transferring structure.

## Preserve source tokens

- Keep numeric units, zero spelling, function syntax, comma spacing, selector pseudo-element form,
  combinators, selector grouping, and declaration order from the source rule unless the owner script
  has an explicit override. For a selector already represented by the owner snapshot, preserve its
  existing spelling when the source change is cosmetic; use the raw source spelling for a genuinely
  new or structurally changed selector.
- Treat every source rule as an ordered cascade unit. If `.diff ul` appears in multiple CSS blocks,
  keep multiple `.diff ul` blocks in the same order; do not merge their declarations, deduplicate
  the selector, move a later override earlier, or collapse the cascade into one block.
- `margin:auto 0` may be indented as `margin: auto 0`, but it must not become `margin: auto 0px;`.
- `form.new_user input[type=submit]` may be indented or placed in the snapshot's block layout, but
  it must not become `form.new_user input[type="submit"]` merely because the current source adds
  quotes. If the selector is genuinely new, copy the raw source spelling instead.
- Do not add `px` to zero values, add/remove semicolons, expand shorthand, convert color syntax, or
  reorder declarations merely because a formatter prefers it.
- Use the raw CSS asset for token decisions. A separately pretty-printed copy is only a navigation
  aid for selectors and block boundaries; it must not supply declaration values or silently rewrite
  tokens before conversion.

## Preserve comments as code context

Comments are preserved at the declaration or rule they describe. A trailing legacy catalogue is
input debris, not a CSS rule: ignore the literal catalogue marker and its detached comment-only
entries, then recover any needed token from its real declaration/rule if it exists. Never append a catalogue such as
`/* Preserved comments from the previous // general snapshot. */` followed by detached color and
review comments. That form is not maintainable and does not preserve the source coding it describes.

When a historical rule is renamed or regrouped, carry its comment with the corresponding current
rule. When no current equivalent exists, preserve the complete old selector/declaration rule in
the existing snapshot context, or record an explicit exclusion in the review; never retain only
the comment text.

## Source-to-snapshot inventory

For every non-excluded source rule, record one of these outcomes:

- copied with source declaration tokens;
- merged into an existing selector while retaining source non-color tokens;
- overlaid with an owner color while retaining the source property and structure; or
- explicitly excluded because it is an active `:root`/official dark branch or outside the snapshot.

An orphan comment is not an inventory outcome, and a selector check that passes while its
declarations are missing is not sufficient coverage.

Block multiplicity and order are part of source-to-snapshot coverage. A set-based selector check
cannot prove order; the bundled check only double-confirms repeated-block counts, so inspect the
ordered diff directly.

The bundled token check is deliberately only a double confirmation: it compares best-effort
non-color property/value pairs after excluding the official branches. Human review must still
confirm that each declaration is attached to the correct selector and media/layering context.
