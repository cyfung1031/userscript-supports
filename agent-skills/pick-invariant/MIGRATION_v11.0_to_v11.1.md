# Migration — PickInvariant v11.0 -> v11.1

v11.1 is a **hard-Pareto kernel compression release**. It does not change the theorem architecture,
mode authority, adaptive-depth rules, specialist gate semantics, lazy-reference routing, embedded
prompt behavior, or user-facing presentation contract.

## Runtime change

`SKILL.md` is rewritten to remove repeated explanation already present in lazy references while
retaining the routing predicates, hard firewalls, authority boundaries, stop conditions, and
progressive-load map needed before those references are opened.

The released v11.0 kernel is preserved at `eval/SKILL.v11.0.baseline.md` for recomputation.

## Hard release conditions

v11.1 is releasable only when all hold relative to v11.0:

- all protected capability and fixture-quality rows are non-regressing;
- all synthetic fixture costs are non-increasing;
- maintainability is non-regressing;
- mode, depth, protected gates, and lazy-reference sets are exactly activation-equivalent on the
  declared fixture + boundary suite;
- every declared activated path is no larger under the transparent context proxies;
- at least one context dimension improves strictly.

No behavioral score bonus is assigned for shorter wording.

## Activation invariance

`eval/activation_cases.jsonl` freezes the v11.0 activation oracle over 52 release fixtures plus 36
boundary cases. `eval/activation_sim.py` must report zero drift and must detect intentional mutations
of every protected activation field.

## Prompt behavior

`agents/openai.yaml` and `references/prompt_and_presentation.md` remain byte-identical to v11.0. The
rule that theorem machinery is internal by default is unchanged.

## Context claim

The package reports whitespace words, Unicode characters, and UTF-8 bytes. These are transparent
context proxies, not an exact model-token or latency benchmark.
