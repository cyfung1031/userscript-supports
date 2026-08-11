---
name: source-preserving-css
description: >
  Preserve-source CSS transformation for standalone CSS and CSS embedded in JavaScript, TypeScript,
  HTML, or user scripts. Use automatically when parsing, formatting, transferring, auditing, or
  regex-editing CSS that may be minified, nested, comment-rich, escaped, quoted, or contain data
  URLs; use it for source-to-snapshot updates and any change where selector spelling, cascade order,
  comments, declaration values, or surrounding code must remain intact.
---

# Source-preserving CSS

Kernel: lex first, retain every target-relevant distinction, mutate only the named region, then
prove preservation with adversarial fixtures and a diff. Regex may classify already-tokenized
leaves; never use it alone to find CSS structural boundaries.

## Workflow

1. Bind the target file/version, embedded-region locator, owner rules, allowed edits, and oracle.
   Stop before mutation if any binding is missing or authoritative sources conflict without an
   explicit resolution.
2. Extract the CSS with a host-language-aware method. Fail if the region is ambiguous or absent.
3. Lex structural syntax with `scripts/scan_css.py --strict` or an equivalent state machine. This
   helper is a lexical/conservative sanity gate, not a complete CSS grammar parser. Track comments,
   quotes, escapes, parentheses, brackets, and brace depth; ignore delimiters inside protected text.
   Stop on an unbalanced, malformed, or unsupported lexical state; the bundled strict mode must
   exit nonzero for malformed input. If syntax exceeds the scanner model, switch to a parser that
   supports it and record the unsupported case; never treat a partial parse as success.
4. Represent rules and declarations with raw text, normalized comparison keys, source order, rule
   context, and source offsets. Keep owner and upstream provenance separate.
5. Transform only approved fields. Preserve comments, selector spelling, repeated rules, order,
   custom values, data URLs, and all bytes outside the target region.
6. Run the smallest sufficient regression matrix, a CSS grammar oracle when grammar correctness is
   decision-relevant, the host-language syntax check, and the target transform checks. Then inspect
   `git diff --check`, changed-file scope, parser counts, and source/snapshot token deltas. A
   zero-rule or zero-token parse is a failed observation, never a pass.
7. Stop when the target invariants pass. Report unverified runtime behavior instead of inferring it.

## Required contrasts

Exercise at least: one-line/minified input; nested blocks; comments containing delimiters; quoted
strings; escaped selectors; `url(data:...)` values with semicolons/braces; repeated selectors;
mixed-case excluded branches; and nested/fallback `var(...)` values. Add a real regression fixture
for every discovered failure mechanism.

## Resources

- `scripts/scan_css.py`: newline-independent structural scanner and sanity summary.
- `references/preservation_contract.md`: invariants, oracle limits, and review checklist.
