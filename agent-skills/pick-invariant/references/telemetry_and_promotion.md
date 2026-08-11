# Telemetry, Evaluation, Regression, and Promotion

## 1. Orthogonal telemetry

Track independent dimensions rather than one overloaded status.

### Control state

```text
BYPASS | EXPLORE | AUDIT | DERIVE | COMPILE | EXECUTE | BLOCKED | VERIFY | REBIND | STOP | PROMOTE
```

### Structural reason

```text
NO_OWNER | PROCEDURE_GAP | COMPOSITION_GAP | AUTHORITY_CONFLICT |
REPRESENTATION_FAILURE | VERIFIER_FAILURE | EXECUTION_FAILURE |
ABSTRACTION_SPURIOUS_COUNTEREXAMPLE | STOCHASTIC_SPEC_GAP
```

### Pick role

```text
P | I | B | CHI | MULTI | NONE | UNKNOWN
```

### Quotient/refinement status (when material)

```text
SAFE_TO_MERGE | KEEP_SEPARATE | QUOTIENT_UNKNOWN |
COUNTEREXAMPLE_REAL | COUNTEREXAMPLE_SPURIOUS | COUNTEREXAMPLE_UNKNOWN
```

### Composition status (when material)

```text
VALUATIVE | CONSERVATIVE_MERGE | ORDER_SENSITIVE | TOPOLOGY_SENSITIVE |
NONCOMPOSABLE | COMPOSITION_UNKNOWN
```

Do not infer audit outcome, severity, authority, repair scope, or confidence from any one axis.

## 2. Promotion criteria

Promote a recurring extension when it has:

- stable applicability (`P`);
- stable local semantics (`I`) where relevant;
- explicit seam contracts (`B`) where relevant;
- stable non-local corrections (`χ`) where relevant;
- a stable target-relative quotient / retained distinction set;
- deterministic or appropriately bound stochastic decision semantics;
- an explicit composition rule where local results are aggregated;
- explicit escape conditions;
- positive, negative, and merge/removal contrast cases;
- regression behavior for old valid states and the triggering gap;
- repeated evidence that the decision boundary is stable.

## 3. Regression suite

Before promotion, include at least:

- old-valid case;
- triggering-gap case;
- near-miss case;
- no-activation case;
- applicability contrast where relevant;
- interior contrast where relevant;
- broken-boundary contrast where relevant;
- topology/global-composition contrast where relevant;
- valid completion case;
- safe-compression case where distinct raw states intentionally share one representation and decision;
- unsafe-merge case where a collapsed class would change `D`;
- spurious-counterexample case if abstraction refinement is part of the owner;
- stochastic law/channel contrast if the owner makes probability/information claims.

## 4. Success metric

A successful meta-skill should make itself less necessary. Stable recurring Pick role classifications,
decision quotients, composition rules, and evidence procedures should become direct validated owners,
reducing future derivation and theorem-gate activation.
