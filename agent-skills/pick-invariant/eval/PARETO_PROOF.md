# PickInvariant v11.1 — Bounded Hard Pareto Proof

The release claim is relative to the declared T1 design proxy and the frozen v11.0 activation oracle.
It is not a universal or live-model dominance theorem.

## Hard gate

| Requirement | Result |
|---|---|
| 23 protected capability scores non-regressing | **PASS** |
| 52 fixture-quality rows non-regressing | **PASS** |
| 52 synthetic execution-cost rows non-increasing | **PASS** |
| maintainability non-regressing | **PASS** |
| mode/depth/gate/reference activation exactly equal to v11.0 | **PASS** |
| activation suite mutation-sensitive | **PASS** |
| always-loaded + declared path context proxies non-increasing | **PASS** |
| at least one strict improvement | **PASS** |

**Result: HARD PARETO IMPROVEMENT**.

v11.1 deliberately receives **no behavioral score bonus** for being shorter. Its behavior score,
protected capability vector, maintainability score, and synthetic execution costs are inherited
unchanged from released v11.0. Strict improvement comes only from the smaller always-loaded kernel:
1316 -> **947 words**
(28.04% reduction), with exact activation equivalence across
88 declared fixture/boundary cases.

## Sensitivity

Across 50,000 positive context-cost perturbations, v11.1 wins **100.00%**.
Behavior and synthetic execution-cost deltas remain exactly zero in these runs; the test therefore
cannot hide a reasoning regression behind aggregate weighting.
