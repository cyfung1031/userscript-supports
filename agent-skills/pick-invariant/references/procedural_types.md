# Procedural Types and Boundary Checking

## Contents

1. Purpose
2. Producer guarantees and consumer requirements
3. Boundary object
4. Typical mismatch forms
5. When a seam is not merely boundary
6. Seam repair strategies
7. Type-checker discipline

## 1. Purpose

Pairwise procedure composition is primarily a **boundary (`B`) problem**: a producer's output must carry enough semantic guarantee for the consumer's requirement. Multi-piece/global composition has an additional legality obligation; pairwise seam coverage does not automatically license aggregation, inclusion/exclusion, or global reconstruction.

## 2. Producer guarantees and consumer requirements

Represent a producer output semantically:

```text
G(P) = {
  claim,
  scope,
  authority,
  evidence_class,
  freshness,
  caveats,
  identity,
  mutability,
  version,
  lineage,
  ordering,
  atomicity,
  completeness,
  durability,
  uncertainty,
  ...
}
```

Represent the consumer need similarly:

```text
Req(Q) = {...}
```

Composition is sound only when:

```text
G(P) >= Req(Q)
```

where `>=` means semantic coverage/subsumption for the target decision.

## 3. Boundary object

A compiled seam should preserve both sides:

```text
B(P,Q) = <producer guarantee, consumer requirement, bridge/refusal rule>
```

Do not erase caveats or provenance merely because the downstream procedure prefers a simpler
input type.

## 4. Typical mismatch forms

### Strength mismatch
Producer supports a weaker claim than consumer needs.

### Scope mismatch
Producer's guarantee applies to a subset/different population or region.

### Temporal mismatch
Producer evidence is too old or belongs to a different epoch.

### Authority mismatch
Producer is advisory while consumer requires an authoritative source.

### Caveat mismatch
Producer verdict is conditional but consumer treats it as unconditional.

### Identity/schema/unit mismatch
The two sides refer to values that look comparable but are not semantically aligned.

### Ownership mismatch
Each side assumes the other owns a necessary condition.

### Lineage/provenance mismatch
Surface-equal values come from different generations, origins, baselines, or transformation
histories and therefore require different interpretation.

### Ordering/atomicity/completeness/durability mismatch
The consumer assumes a total order, atomic snapshot, complete result, or durable commitment that
the producer does not guarantee.

### Uncertainty mismatch
The producer expresses unknown or partial evidence while the consumer assumes a decided result.

## 5. When a seam is not merely boundary

Escalate role diagnosis if direct `B` repair cannot reconstruct the target:

- `P` if one procedure is inapplicable in the observed composition;
- `I` if a producer/consumer lacks a local distinction it should own;
- `χ` if the decision depends on multi-hop, cyclic, overlapping, or other non-local
  structure beyond the pairwise seam.

## 6. Seam repair strategies

Prefer, in order:

1. prove existing guarantee already covers requirement;
2. preserve a caveat and restrict downstream use;
3. add a conversion/bridge with explicit semantics;
4. strengthen verification/evidence within existing owner authority;
5. add the smallest missing local or topological delta if contrast proves it is required;
6. refuse composition and emit an escape condition when sound coverage cannot be established.

## 7. Type-checker discipline

- Preserve native verdicts.
- Compare semantics, not labels.
- Do not silently coerce authority, freshness, scope, caveats, identity, or units.
- Do not treat pairwise seam validity as proof that a multi-procedure graph is globally sound;
  test `χ` when cycles/overlap/closure can change the target; and activate the composition gate when the global result assumes a particular merge/valuation law.
