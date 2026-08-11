# Evaluation — PickInvariant v11.1

v11.1 is evaluated as a hard-Pareto compression release over v11.0.

Run in order:

```bash
python eval/derive_v11_0_activation_oracle.py
python eval/activation_sim.py
python eval/context_cost.py
python eval/simulate.py
python eval/static_conformance.py
```

## Layers

1. **Behavior matrix** — 52 v11.0 fixtures; candidate behavior/cost scores are frozen equal to the
   released parent, so compression receives no scoring bonus.
2. **Activation equivalence** — 88 cases: 52 fixture mappings + 36 fire/do-not-fire boundaries.
   Mode, depth, protected gates, and lazy-reference sets must match v11.0 exactly.
3. **Context Pareto** — exact v11.0/v11.1 kernel snapshots are compared by words, characters, and
   bytes; every declared activated path must be non-increasing.
4. **Static/asset parity** — critical behavioral references, integrations, templates, worked examples,
   and the embedded default prompt remain byte-identical to v11.0.
5. **Sensitivity** — 50,000 positive context-cost perturbations; no behavioral gains are introduced.

Current machine-readable outputs are `results.json`, `activation_results.json`, `context_cost.json`,
`score_matrix.csv`, `context_path_matrix.csv`, and `behavioral_hashes_v11_0.json`.

Historical v11.0-only neighborhood artifacts are under `eval/v11_0_archive/` and are not current
v11.1 results.
