# PickInvariant v11.1 — Evaluation Assumptions

v11.1 is a **semantics-preserving kernel compression release**. The evaluation therefore uses a
stricter assumption set than v11.0: no new theorem capability, quality score, synthetic execution
cost reduction, or maintainability bonus is credited to the candidate.

## Frozen parent behavior

The released v11.0 Pick-dominant profile in `results_v11_0.json` is the behavioral parent. v11.1
inherits its 23 protected capability scores, 52 fixture-quality rows, synthetic fixture costs, and
maintainability score exactly. If the shorter kernel truly weakened behavior, that must appear as an
activation/static/acceptance failure; the scorer is not allowed to compensate with a higher aggregate
quality prior.

## Activation oracle

`activation_cases.jsonl` stores a frozen v11.0 oracle over 52 release fixtures and 36 boundary cases.
`derive_v11_0_activation_oracle.py` is a separate interpreter of the released v11.0 mode/depth/gate/
progressive-loading rules. `activation_sim.py` implements the v11.1 candidate interpreter and must
match the frozen oracle exactly.

The activation suite is a T1 formalization, not a live LLM trace. To make it falsifiable rather than
purely ceremonial, every protected trigger has both fire and do-not-fire cases, and mutation tests
must detect changes to mode, depth, triggers, and reference sets.

## Context metric

No matching GPT-5.6 Sol tokenizer/latency benchmark is installed in the package runtime. The hard
context comparison therefore uses three transparent proxies: whitespace words, Unicode characters,
and UTF-8 bytes. These are not claimed as exact model tokens.

Because activation/reference sets are required to be exactly equal, any strict reduction in the
always-loaded kernel produces the same-direction context reduction on every declared path regardless
of path prevalence.

## Sensitivity

The 50,000-run sensitivity test varies only positive conversions from the transparent context proxies
to an abstract context cost. Behavioral quality, synthetic execution cost, and activation are held
equal to the parent. This prevents the sensitivity layer from inventing a reasoning-quality gain to
make compression look favorable.

## Bounded claim

The release claim is:

`HARD_PARETO_OVER_DECLARED_BEHAVIOR_ACTIVATION_COST_MAINTAINABILITY_AND_CONTEXT_PROXIES`

It is not a proof of universal model equivalence, exact token count, latency reduction, or dominance
outside the declared fixtures/boundaries.
