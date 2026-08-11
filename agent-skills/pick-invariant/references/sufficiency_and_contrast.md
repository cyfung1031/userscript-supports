# Reconstruction, Decision Quotients, and Contrast

## 1. Target-relative reconstruction

For admissible state space `X_D`, representation `R`, and target `D`, require:

```text
R(x1) = R(x2) => D(x1) = D(x2)
```

Equivalently, `D = d ∘ R` for some executor-level rule `d`.

The representation need not preserve full state. It must preserve every admissible distinction that
can alter the target, a bound consumer requirement, or applicability.

## 2. Decision-preserving equivalence

Define the operational equivalence relation relative to a bound discriminator class `Q_D`:

```text
x1 ~D x2
iff no q in Q_D separates an acceptance-changing outcome.
```

`Q_D` must itself be scoped by authority, reachability, observability, and target materiality. This
prevents pathological "distinctions" that cannot occur, cannot be observed, or cannot affect the
certified decision from blocking useful compression.

## 3. Pick-specific contrast matrix

Challenge candidate roles independently when affordable.

### Applicability contrast (`P`)
Same local facts, but authority/scope/freshness/observability preconditions differ and change whether
the rule is licensed.

### Interior contrast (`I`)
Same boundary/global context, but one locally owned fact changes the required decision.

### Boundary contrast (`B`)
Same local facts and global topology, but a handoff relation, identity, caveat, time, unit, transform,
or producer/consumer contract differs.

### Topology contrast (`χ`)
Same local and direct seam facts, but cycle/overlap/disconnection/ordering/global constraint differs
and changes the decision.

Role classification locates the witness. It does not by itself prove the distinction is needed for
other targets.

## 4. Collapsed contrast is a witness

If:

```text
R(x-) = R(x+)
D(x-) != D(x+)
```

then the representation is unsound for the certified domain. Do not patch only `d`; refine `R` with
the smallest observable distinction supported by the witness.

If the apparent counterexample is not realizable in the raw/admissible semantics, classify it as
`SPURIOUS` and refine the abstraction only if needed to prevent the false alarm.

## 5. Contrast admissibility

A contrast used to justify retention/minimality should record:

```text
domain membership
reachability/feasibility
authority/oracle
observation method and window
raw differing feature
projected/compiled representation
required decisions
```

Synthetic impossible states may be useful exploration probes but cannot alone certify a production
distinction.

## 6. Continuation-sensitive contrast

For state machines/processes, two current states may be observationally equal but differ under future
admissible continuations. When the target depends on future behavior, challenge continuations rather
than only snapshots.

Do not pay for continuation analysis when one-step reconstruction already decides the target.

## 7. Stochastic contrast

For random observations, compare information channels/laws rather than only realized coordinates.
Two channels may be decision-equivalent for one target while distributionally different. Conversely,
two equal-dimensional summaries may lose different acceptance-changing information.

Use `references/decision_quotients.md` and `references/probability_semantics.md` when material.

## 8. Minimality: delete and merge

After sufficiency, challenge each retained distinction by:

```text
DELETE: remove δ entirely
MERGE: collapse δ's classes with a neighboring class
```

If both preserve reconstruction over the certified contrast/discriminator set, discard the finer
distinction. `MINIMAL` requires a scoped record of these tests; otherwise use `VALID_COMPRESSION` or
`SUFFICIENT`.

## 9. Observation choice

When multiple contrasts are unresolved, prefer the least costly reachable observation that can
separate the leading acceptance-changing classes. Do not maximize information irrelevant to `D`.

## 10. Strongest affordable challenge

Formal proof may be impractical. Prefer high-leverage contrasts near the certified decision boundary,
especially those capable of falsifying role classification, quotient sufficiency, stochastic law
assumptions, or local-to-global composition.
