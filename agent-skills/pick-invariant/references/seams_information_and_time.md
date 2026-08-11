# Semantic Seams, Information Loss, and Time

## Contents

1. Typed boundary contract
2. Information-loss patterns
3. Lineage and history-erasure contrasts
4. Irrecoverability certificate
5. Prospective and retrospective remedies
6. Temporal and causal contrasts
7. Observability and verification
8. Seam repair ladder
9. Semantic and operational minimality

## 1. Typed boundary contract

Represent a seam as:

```text
B(P,Q) = <producer guarantee, consumer requirement, bridge/refusal rule>
```

Compare only target-relevant dimensions, but do not drop one merely for brevity:

```text
claim          scope          authority       evidence_class
freshness      caveats        identity        mutability
schema         version        units           lineage/provenance
ordering       atomicity      completeness    durability
uncertainty    ownership      capability      confidentiality
```

Use semantic subsumption:

```text
G(P) >= Req(Q)
```

If direct seam repair does not reconstruct the decision, reclassify the missing distinction as
`P`, `I`, or `χ` from evidence rather than forcing it to remain `B`.

## 2. Information-loss patterns

Use these as non-exclusive contrast generators:

```text
B1  structured fact -> text -> heuristic reparse
B2  identity/generation -> value-only comparison
B3  versioned record -> unversioned representation
B4  ownership/authority -> existence-only predicate
B5  atomic producer result -> split consumer reads
B6  terminal state -> generic completion
B7  ordered events -> unordered collection
B8  scoped capability -> global capability
B9  durable state -> volatile acknowledgement
B10 explicit uncertainty/caveat -> assumed outcome
B11 snapshot -> patch without representation tag
B12 explicit user choice -> value indistinguishable from a default
```

Treat this library as a retrieval aid. Classify each proven missing distinction through the
universal `P/I/B/χ` representation.

## 3. Lineage and history-erasure contrasts

Ask:

```text
Can the same observable or serialized value be produced by two admissible histories that
require different downstream decisions?
```

Typical surface-equal/meaning-different pairs include:

- full snapshot versus sparse override;
- old schema versus new schema;
- absolute value versus delta;
- computed default versus explicit user choice;
- server-generated versus client-authored value;
- pre-migration versus post-migration record;
- old identity versus new generation with the same value.

Use `B` when the distinction is lineage across a producer/consumer or temporal boundary. Use
`P` when lineage determines whether a decoder/procedure applies. Use `χ` only when multiple
histories form a decision-relevant non-local structure that local lineage seams cannot capture.

## 4. Irrecoverability certificate

When two admissible states have the same observable representation but require different
decisions, record:

```text
target_decision:
observable_state:
history_x1 / required_D1:
history_x2 / required_D2:
erased_distinction:
erasure_point:
pick_role:
why_current_observables_cannot_reconstruct_D:
safe_escape_or_uncertainty_behavior:
future_encoding_requirement:
retrospective_migration_evidence_required:
```

Do not claim a complete decoder can be compiled from information already erased. Prefer an
escape, user confirmation, conservative branch, external migration record, or explicit
uncertainty.

## 5. Prospective and retrospective remedies

Separate:

- **prospective soundness** — tag/version/fingerprint future representations so the needed
  distinction remains observable;
- **retrospective recovery** — determine whether existing ambiguous records can be migrated
  from independent evidence;
- **fallback** — define safe behavior when old meaning is unknowable.

A future-safe tag does not retroactively identify legacy data. A heuristic migration must name
its false-positive/false-negative consequences and an escape condition.

## 6. Temporal and causal contrasts

Use target-relative projected traces when final values hide order or side effects:

```text
Project(Trace(system, x))
```

Include only contract-relevant observations: state commits, messages, requests, writes,
callbacks, timers, capability grants, cleanup, and externally visible ordering.

Useful probes:

- guard-dominance: did a side effect move before a guard that previously dominated it?
- eager evaluation: did argument/default/initializer evaluation move work earlier?
- `await`/callback crossing: can interleaving change identity, freshness, or ordering?
- `try/finally` crossing: did cleanup or failure behavior move?
- linearization: at which observable point does the operation take effect?
- cancel/commit race: does cancellation occur before or after the durable linearization point?
- split read: can fields come from different epochs?
- retry cycle: does local success compose into non-termination or duplicate action?

Classify a local ordering fact in `I`, a two-stage temporal contract in `B`, and only genuine
multi-hop/cyclic/global ordering in `χ`.

## 7. Observability and verification

For every proposed `Δ`, specify:

```text
predicate_source:
executor_observation:
verification_channel:
closure_window:
failure_locality:
escape_when_unobservable:
```

For negative invariants, observe the forbidden event channel directly or prove the event is
causally unreachable. Match the test witness to the claim:

```text
claim: no request occurs
insufficient: error callback occurred first
sufficient examples: request spy remains zero through closure; dispatch is provably unreachable
```

Do not equate a verifier weakness with representation insufficiency unless the inability to
verify is itself a stable decision-relevant distinction.

## 8. Seam repair ladder

Prefer, in order:

1. prove the existing guarantee covers the requirement;
2. preserve caveats/uncertainty and restrict downstream use;
3. add a typed conversion or bridge;
4. retain structured/authoritative information through the seam;
5. strengthen observation or verification within owner authority;
6. add the smallest proven `P/I/B/χ` distinction;
7. refuse composition or emit an escape when sound reconstruction is impossible.

Preserve redundant layers when they enforce different authorities or fail independently.

## 9. Semantic and operational minimality

Check two different obligations:

- **semantic minimality** — no smaller observable distinction reconstructs the target over the
  certified domain;
- **operational feasibility** — an executor can obtain and apply that distinction for every
  state the remedy claims to cover.

Do not prefer a smaller patch that fails semantic sufficiency. Do not call an abstract bit a
complete remedy when historical or runtime evidence cannot supply it. Record the operational
mechanism, coverage domain, historical evidence, residual unhandled states, and escape.
