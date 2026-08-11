# PickInvariant v11.1 — Release Evaluation

## Release question

Can the always-loaded v11.0 kernel be made materially smaller **without weakening the skill or
changing when its machinery activates**?

## Acceptance rule

Release only if all declared behavioral scores/costs are non-regressing, maintainability is
non-regressing, v11.0 mode/depth/gate/reference activations are exactly reproduced, every declared
path context proxy is non-increasing, and at least one context dimension improves strictly.

## Result

The current run passes. See `PARETO_PROOF.md`, `SCORE_MATRIX.md`, `activation_results.json`, and
`CONTEXT_COST.md` for the bounded evidence.

No quality gain is claimed. v11.1's strict improvement is the smaller always-loaded/context
footprint under identical declared activation.
