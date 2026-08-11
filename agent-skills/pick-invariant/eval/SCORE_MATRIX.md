# PickInvariant v11.1 — Hard Pareto Score Matrix

| Dimension | v11.0 | v11.1 | Direction | Result |
|---|---:|---:|---|---|
| Behavior composite | 9.95419 | 9.95419 | higher is better | **NON-REGRESSION** |
| Synthetic reasoning cost | 3.06633 | 3.06633 | lower is better | **NON-REGRESSION** |
| Maintainability | 9.3 | 9.3 | higher is better | **NON-REGRESSION** |
| Activation drift count | 0 | 0 | lower is better | **NON-REGRESSION** |
| Always-loaded words | 1316 | 947 | lower is better | **STRICT IMPROVEMENT** |
| Always-loaded chars | 11012 | 8401 | lower is better | **STRICT IMPROVEMENT** |
| Always-loaded bytes | 11034 | 8408 | lower is better | **STRICT IMPROVEMENT** |

- Fixture quality non-regression: **52/52**.
- Fixture synthetic-cost non-increase: **52/52**.
- Protected-capability non-regression: **23/23**.
- Exact activation equivalence: **88/88**, drift **0**.
- Hard Pareto improvement: **PASS**.
