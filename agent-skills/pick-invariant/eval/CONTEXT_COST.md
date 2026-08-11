# PickInvariant v11.1 — Hard Context Pareto Report

This release treats kernel/context efficiency as a **hard Pareto dimension relative to v11.0**.
The token claim remains conservative: no model tokenizer or latency benchmark is available here, so
whitespace words, Unicode characters, and UTF-8 bytes are reported transparently.

| Metric | v11.0 | v11.1 | Delta | Reduction |
|---|---:|---:|---:|---:|
| always-loaded words | 1316 | **947** | -369 | **28.04%** |
| characters | 11012 | **8401** | -2611 | **23.71%** |
| UTF-8 bytes | 11034 | **8408** | -2626 | **23.80%** |
| lines | 209 | 155 | -54 | 25.84% |

Activation equivalence is tested independently over 88 fixture/boundary cases. Because
v11.1 activates the same lazy references, every declared path is shorter by exactly
**369 whitespace words** before any unchanged reference content.

Hard context Pareto: **PASS**.

This is a context-footprint proxy, not a claim of exact model-token or latency reduction.
