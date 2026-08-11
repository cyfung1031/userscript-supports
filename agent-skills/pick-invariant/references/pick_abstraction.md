# Pick's Theorem as the Dominant Structural Model

## 1. Literal theorem

For an appropriate simple lattice polygon:

```text
A = I + B/2 - 1
```

where `A` is area, `I` counts lattice points strictly in the interior, and `B` counts boundary
lattice points.

The transferable lesson is not the coefficients. It is that a global target can sometimes be
reconstructed from a compact set of structural invariants **under explicit domain assumptions**.

## 2. Why Pick remains dominant in v11

Pick supplies a useful four-role grammar:

```text
P  applicability / admissible domain / authority
I  interior / locally owned information
B  boundary / context-dependent interface information
χ  topological or other non-local structural correction
```

This grammar remains the first structural decomposition because it distinguishes local ownership,
interfaces, global residuals, and theorem applicability in a domain-general way.

v11 adds an important limit:

> A valid Pick role tells us where a distinction belongs, not whether the target needs to retain it.

Retention is governed by target-relative decision-preserving quotienting.

## 3. What PickInvariant transfers

The canonical structural candidate is:

```text
R_P(x) = <P(x), I(x), B(x), χ(x)>
```

and a sufficient compiled representation must satisfy:

```text
R(x1) = R(x2) => D(x1) = D(x2)
```

The actual compiled `R` may omit or merge Pick-role dimensions when removal/merge testing proves them
irrelevant to the certified target.

## 4. What PickInvariant does not transfer

Outside genuine geometry, do not assume:

- additive decomposition;
- a boundary coefficient of `1/2`;
- a constant correction of `-1`;
- a numeric topology term;
- an area-like target;
- independent interior/boundary contributions;
- sufficiency merely because every fact was assigned a Pick role;
- minimality or canonicality merely because reconstruction succeeds.

A metaphorical mapping is not a theorem.

## 5. Literal, structural, and extension modes

### PICK_LITERAL

Use the actual theorem only after establishing the mathematical preconditions for the polygon.

### PICK_STRUCTURAL

Use `P/I/B/χ` as semantic roles and prove target-relative reconstruction. `χ` may be a set of
predicates, relation, graph property, precedence rule, or another finite structure.

### LATTICE_EXTENSION

Ehrhart-style or valuation-style reasoning is allowed only when its own assumptions are bound. A
lattice-polytope counting problem under integer dilation may justify Ehrhart theory; a generic
business/process decomposition does not.

## 6. Interior

An interior fact is locally meaningful within an owning region/procedure. Its interpretation does not
require inspecting an adjacent region or crossing an interface. Interior means **locally owned
semantics**, not merely "important".

## 7. Boundary

A boundary fact is a relation whose meaning depends on neighboring context: producer/consumer
contracts, handoffs, ownership transfers, temporal transitions, schema/unit conversion, caveat
propagation, or identity correspondence.

Treat semantic seams as first-class boundary objects.

## 8. Topology / structural correction

`χ` contains decision-relevant non-local information that independent local evaluation cannot recover:
cycles, overlap/double counting, holes in coverage, disconnected components, shared conservation
constraints, or global ordering/reachability effects.

Do not call a fact topological merely because it is difficult.

## 9. Applicability as theorem precondition

`P` records conditions under which the representation and decision rule are licensed: authority,
observable state space, scope, freshness, required evidence, mutability assumptions, version/schema,
and exclusions.

A failed precondition is an applicability failure until proven otherwise.

## 10. Valuation boundary

Pick's literal formula is closely related to compositional/inclusion-exclusion structure, but v11
requires an explicit composition gate before using that idea outside the literal domain.

When local/global reconstruction involves overlaps, ask whether the target behaves as a justified
valuation, conservative merge, order-sensitive composition, topology-sensitive composition, or is
noncomposable. See `references/composition_and_refinement.md`.

## 11. Compression is the point

```text
raw state X
-> Pick-role candidate distinctions
-> decision-preserving quotient
-> compact observable R(X)
-> decision D
```

If different raw states map to the same `R` and require the same decision, compression is working. If
they require different decisions, the quotient is too coarse. If a retained distinction can be
removed without creating such a witness, the representation is unnecessarily fine.
