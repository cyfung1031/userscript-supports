# Canonical Pick Representation

## 1. Representation object

For a target decision `D` over admissible states `X`, use Pick's dominant structural grammar:

```text
R_P(x) = <P(x), I(x), B(x), χ(x)>
```

The fields are semantic partitions, not mandatory data structures. For machine-readable receipts,
serialize the residual role as `CHI`; `χ` is display-only alias.

v11 adds a second obligation: **classification does not imply retention**. A discovered distinction
must also survive the target-relative quotient test.

## 2. Classification test

When a missing distinction `δ` is discovered, classify it by asking in order:

```text
P: Does δ determine applicability, observability, or authority?
I: If applicable, is δ fully meaningful inside one local owner/region?
B: Does δ express a relation across an interface, transition, or adjacent context?
χ: Does δ depend on global structure not recoverable from local pieces plus direct seams?
```

Use the narrowest primary role that explains the decision difference. Dependency roles may be
recorded diagnostically; do not duplicate one committed fact across roles without evidence of an
irreducible interaction.

## 3. Retention / quotient test

After role classification ask:

```text
Is δ admissible/reachable for the certified claim?
Can δ alter D, a consumer requirement, or validity precondition?
Can the executor observe δ at the required time?
If δ is removed or merged, does an admissible acceptance-changing contrast collapse?
```

If no target-relevant contrast depends on `δ`, remove it even if its Pick role is valid.

See `references/decision_quotients.md` for continuation-sensitive, stochastic-channel, and approximate
sufficiency variants.

## 4. Interior ownership rule

A fact belongs in `I` only if a mature local owner can state and verify its semantics without
consulting neighboring regions. If the same raw value has different meaning depending on where it
crosses, belongs, or is consumed, the relevant relation belongs in `B`.

## 5. Boundary ownership rule

Boundary objects should name both sides when possible:

```text
producer / left region
consumer / right region
guarantee
requirement
relation / conversion
freshness / authority / caveat semantics
```

Do not flatten a seam into a local predicate if doing so hides the context that makes it meaningful.

## 6. Topology rule

Use `χ` when independent evaluation of interiors and direct boundaries still cannot determine the
target. Typical non-local questions include cycles, omitted regions, disconnected components,
overlap/double ownership, global ordering, shared conservation constraints, reachability, or closure.

`χ` may be a predicate, graph summary, equivalence relation, count, ordering, constraint set, or state
machine. Numeric form is not required. Complexity alone does not justify `χ`.

## 7. Reconstruction obligation

The representation is sufficient only if the target factors through it:

```text
exists d such that for all admissible x:
D(x) = d(R_P(x))
```

Operationally:

```text
R_P(x1) = R_P(x2) => D(x1) = D(x2)
```

A counterexample witnesses an insufficient quotient, not merely a bad final rule.

## 8. Minimality obligation

After sufficiency, attempt both deletion and merge tests. If dropping/merging `δ` preserves
reconstruction over the certified domain and discriminator class, discard it.

`MINIMAL` is target-relative and evidence-relative. It does not mean canonical or globally smallest
under every possible future task.

## 9. Observable lattice discipline

Compile only predicates/relations that the executor can determine from available evidence. Record the
observation method, window/freshness, verifier, and status:

```text
OBSERVED | SPECIFIED | FIXTURE_OWNED | UNAVAILABLE | CONFLICTED
```

If a necessary distinction is unavailable, use an escape condition or verification requirement rather
than inventing latent precision or recovering erased history.

## 10. Probability and information extension

When the target is stochastic, keep separate:

```text
object representation
probability law
information/observation channel
transport
conditioning construction
```

`P.measure` binds sample/object space, quotient/equivalence, reference measure, law, normalization,
independence/joint law, conditioning, and symmetry basis. `B.transport` binds mapping, pushforward,
fibers/multiplicity, Jacobian, selection/rejection, and renormalization.

Use `DECISION_SUFFICIENT` only for the named event/decision. Use `DISTRIBUTION_SUFFICIENT` only when the
requested law/observables reconstruct. For channel comparison use the decision-quotient reference.

## 11. Composition extension

A decomposition into `I/B/χ` does not license addition. If a global result combines local pieces,
overlaps, or repeated decompositions, classify the composition rule using
`references/composition_and_refinement.md`. Use valuation/Ehrhart structure only under its own domain
assumptions.

## 12. Representation certificate

A full provenance record may contain:

```text
target_decision:
target_authority_and_oracle:
certified_domain:             # P
discriminator_class_QD:
measure_certificate:          # when stochastic
interior_facts:               # I
boundary_relations:           # B
transport_certificate:        # when stochastic
topology_corrections:         # χ
composition_class:
reconstruction_rule:
quotient_merge_tests:
stochastic_sufficiency:
contrast_ledger:
minimality_claim: SUFFICIENT | VALID_COMPRESSION | MINIMAL | UNKNOWN
operational_feasibility:
escape_condition:
```

The executor and user-facing answer should normally receive a much smaller native-domain form.
