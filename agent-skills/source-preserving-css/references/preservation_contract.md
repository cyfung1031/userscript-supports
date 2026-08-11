# Preservation contract

Bind these before editing:

- target region and host-language container;
- authoritative owner values/comments and upstream source;
- allowed transformations and excluded branches;
- comparison oracle and runtime limits.

Abort before mutation when any binding is missing, an owner/upstream authority conflict is
unresolved, or the lexer reports malformed/unsupported syntax. Record the resolving authority,
version, and locator for any conflict that is resolved; do not resolve by agent preference.

Structural delimiters are significant only in code state at the applicable nesting depth. Ignore
delimiters inside comments, quoted strings, escaped characters, parentheses, brackets, and opaque
URL/function payloads. Preserve raw text for values whose semantics or spelling are owned by the
source; use normalized keys only for comparison.

Required evidence:

1. The scanner sees nonzero source structure on minified input.
2. Data URLs and quoted/comment text do not create fake declarations or rules.
3. Nested rule context and declaration order survive transfer.
4. Repeated selectors remain repeated and ordered.
5. Excluded official branches are recognized case-insensitively without removing literals that only
   mention those strings.
6. Custom-property checks respect selector/context scope and fallback syntax.
7. The host-language syntax check and target-region diff pass.

The scanner's aggregate counts are sanity evidence, not a replacement for rule-context and
ownership checks when the transformation depends on them.

Use `scan_css.py --strict` as the lexical gate for rule-bearing CSS. Its `lexical_status` must be
`OK` and its process must exit zero; `EMPTY`, `NO_RULES`, `MALFORMED`, or `grammar_status=ERROR`
are failures. `grammar_status=UNKNOWN` is expected for otherwise lexically valid input: the
bundled grammar layer is only a conservative rejection filter for empty rule preambles, invalid
at-rule preambles, declaration segments without `:`, and dangling top-level text. It is never a
full grammar oracle. Declaration-only inputs such as an isolated `@import` also
require a parser with the required grammar. If that oracle is unavailable, mark the result
`INSUFFICIENT_EVIDENCE` and do not mutate.

Audit claims are bounded to the tested source/version and static oracle. Do not claim browser
runtime equivalence without a browser observation.
