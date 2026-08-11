# PickInvariant v11.1

PickInvariant v11.1 is a **semantics-preserving compression release** of the principle-driven v11
architecture. Pick remains the dominant structural grammar; decision-preserving quotienting remains
the retention criterion; probability, composition, refinement, and specialized theorem families keep
their v11.0 trigger boundaries.

The governing hierarchy is unchanged:

> Preserve the target. Preserve authority and semantics. Keep only decision-relevant distinctions.
> Prefer the cheapest sufficient observation and representation. Refine only on an explicit witness.

## What changed

Only the always-loaded kernel was materially rewritten. Repeated explanation already available in
lazy references was removed or compacted, while routing predicates, authority boundaries, hard
firewalls, stop conditions, and progressive-load semantics remain in `SKILL.md`.

The embedded default prompt and prompt/presentation reference are unchanged from v11.0.

## Hard Pareto release gate

Run:

```bash
python eval/derive_v11_0_activation_oracle.py
python eval/activation_sim.py
python eval/context_cost.py
python eval/simulate.py
python eval/static_conformance.py
```

The release compares against the packaged v11.0 baseline and requires:

- protected capability and fixture-quality non-regression;
- synthetic execution-cost and maintainability non-regression;
- exact mode/depth/gate/lazy-reference activation equivalence;
- non-increasing context proxy on every declared activated path;
- at least one strict context reduction.

No reasoning-quality bonus is awarded merely because v11.1 is shorter.

## Evaluation scope

The behavior matrix retains all 52 v11.0 fixtures. The activation suite contains those 52 mappings
plus 36 boundary cases testing both firing and non-firing conditions for probability, quotient,
composition, null-conditioning, symmetry, Ehrhart, observation-value, abstraction-refinement,
local/global, and coverage gates.

The claim is bounded T1 design evidence, not a live-model benchmark or proof of universal dominance.
Context figures are word/character/byte proxies, not exact model tokens or latency.
