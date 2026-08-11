# Decision-Preserving Quotients

## Purpose

Pick gives the dominant structural decomposition. This reference decides which discovered distinctions
are actually allowed to survive into the compiled representation.

The central principle is target-relative indistinguishability:

```text
x1 ~D x2
iff no admissible target-relevant discriminator q in Q_D
can require different decisions for x1 and x2.
```

The quotient `X / ~D` is the idealized compression target. In practice PickInvariant uses finite,
observable approximations supported by evidence.

## 1. Deterministic quotient test

Bind:

```text
target D:
admissible domain X_D:
authority/oracle:
discriminator class Q_D:
observability window:
```

Two states may be merged only if every discriminator that is both admissible and material to the
certified target fails to separate their required decisions.

Operationally:

```text
same compiled representation -> same required D
```

A separating witness proves the candidate quotient is too coarse.

This is analogous to Myhill-Nerode-style future indistinguishability and bisimulation-style
behavioral equivalence, but PickInvariant does not require a literal automaton. Use the analogy only
when the target semantics support it.

## 2. Admissible discriminator class

`Q_D` prevents unlimited or irrelevant distinctions from defeating compression. A discriminator is
admissible only when it is:

- within the certified domain and authority;
- reachable/possible enough for the claim being made;
- observable or prospectively encodable at the required decision point;
- capable of changing `D`, a bound consumer requirement, or a validity precondition;
- not merely a renamed copy of an already represented distinction.

Do not preserve features merely because they differ in raw state.

## 3. Future/continuation semantics

For process or state-machine targets, current observations may be equal while future admissible
continuations differ. Then equivalence must be continuation-sensitive:

```text
x1 ~D x2 only if every admissible continuation relevant to D
preserves decision equivalence.
```

A future-sensitive distinction usually belongs to `B` when it crosses a transition/interface, or
`χ` when it depends on non-local reachability/cycles/global structure.

## 4. Bisimulation-style refinement

When behavior unfolds through transitions, a candidate abstraction should preserve:

```text
observable target label
+ enabled target-relevant transitions
+ equivalence of successor classes
```

Do not demand full bisimulation when one-step decision reconstruction is sufficient. Escalate only
when a continuation contrast changes the requested target.

## 5. Sufficiency before minimality

Use this order:

```text
candidate representation
-> reconstruction / no-collapsed-contrast test
-> SUFFICIENT
-> removal/merge tests
-> VALID_COMPRESSION or MINIMAL
```

`MINIMAL` is scoped to the declared domain, target, discriminator class, and evidence set. It is not
a global ontology claim.

A useful removal test is stronger than "delete one field":

```text
remove or merge distinction δ
-> does this merge two previously separate ~D classes?
-> can an admissible contrast now require different D?
```

If yes, retain `δ`. If no, remove it.

## 6. Stochastic decision sufficiency: Blackwell-style order

When the input is an information channel/experiment rather than one realized state, raw-coordinate
equality is not the right comparison.

Let observation channel `E1` be at least as decision-informative as `E2` for a decision class when
`E2` can be obtained from `E1` by target-irrelevant garbling/post-processing without improving any
admissible decision rule.

PickInvariant uses three practical labels:

```text
DECISION_EQUIVALENT       # neither channel has target-relevant advantage for bound decision class
DECISION_DOMINATES        # one preserves at least the other's decision information
INCOMPARABLE_INFORMATION  # each may preserve a distinction the other loses
```

Do not claim full Blackwell equivalence without a justified channel/garbling argument. For ordinary
cases, use the labels as disciplined tests, not theorem-name decoration.

## 7. Approximate sufficiency: Le Cam-style tolerance

Exact equivalence may be unnecessarily strong when the target explicitly permits bounded decision
loss. Only when the authority supplies a tolerance/loss function may PickInvariant use:

```text
EPSILON_DECISION_SUFFICIENT(ε)
```

Bind:

```text
loss_or_regret_metric:
epsilon:
decision_class:
worst_case_or_declared_risk_basis:
```

Never invent `ε`, utilities, priors, or loss functions. Without an authorized tolerance, fall back to
exact decision sufficiency or `UNKNOWN`.

## 8. Relation to Pick roles

Pick roles answer **where a distinction lives**:

```text
P applicability/authority
I local semantics
B interface/context relation
χ non-local residual structure
```

The quotient criterion answers **whether it must survive**.

A fact can be a perfectly valid `B` distinction yet still be removable for a particular target if no
admissible target-relevant contrast depends on it.

## 9. Claim vocabulary

Use:

```text
SUFFICIENT
VALID_COMPRESSION
MINIMAL
DECISION_EQUIVALENT
DECISION_DOMINATES
INCOMPARABLE_INFORMATION
EPSILON_DECISION_SUFFICIENT(ε)
INSUFFICIENT_REPRESENTATION
UNKNOWN
```

Avoid `CANONICAL` merely because a quotient is minimal. Minimality, uniqueness, and canonicality are
separate claims.
