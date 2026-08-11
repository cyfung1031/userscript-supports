# PickInvariant v11.1 — Evaluation Results

- T1 design proxy; parent = released v11.0.
- Behavioral composite: **9.9542 -> 9.9542** (equal).
- Synthetic reasoning cost: **3.0663 -> 3.0663** (equal).
- Maintainability: **9.30 -> 9.30** (equal; no score inflation for compression).
- Activation equivalence: **88/88**, zero drift.
- Core: **1316 -> 947 words** (28.04% smaller).
- Hard Pareto gate: **PASS**.

The strict improvement is token/context efficiency under transparent proxies, not a claimed reasoning
quality increase. See `activation_results.json`, `context_cost.json`, `score_matrix.csv`, and
`PARETO_PROOF.md`.
