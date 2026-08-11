# Composition, Observation Value, and Refinement

This reference is lazy-loaded when a target depends on local-to-global composition, competing
observations, or a counterexample that may be an abstraction artifact.

## 1. Composition gate: valuation discipline

Pick's literal theorem is a valuation-like reconstruction result on a specific lattice domain. Outside
that domain, do not assume additivity or inclusion/exclusion automatically.

Activate `COMPOSITION_TRIGGER` when the target depends on combining overlapping pieces, repeated
partition/decomposition, local summaries, or pairwise compatibility into a global conclusion.

Classify the composition law:

```text
VALUATIVE              # justified inclusion/exclusion-style composition
CONSERVATIVE_MERGE     # monotone merge with explicit duplicate/overlap semantics
ORDER_SENSITIVE        # sequence changes the result
TOPOLOGY_SENSITIVE     # cycles/holes/connectivity/global constraints matter
NONCOMPOSABLE          # local summaries are insufficient
UNKNOWN
```

A valuation-style rule is licensed only when the domain and operation support the required identity.
Do not transfer Pick's coefficients or additivity merely because the decomposition resembles
interior/boundary pieces.

## 2. Ehrhart extension boundary

Ehrhart theory is a legitimate extension of the literal lattice-counting family when the object is a
lattice polytope and the target concerns lattice-point counts under integer dilation. It is not a
license for generic scaling laws.

Use an Ehrhart-style claim only after binding:

```text
lattice_polytope:
dimension:
integer_dilation_parameter:
counting_target:
required regularity/closedness assumptions:
```

Otherwise remain in `PICK_STRUCTURAL`.

## 3. Local-to-global obstruction gate

When all local facts and pairwise overlaps are valid but no globally consistent object/decision can be
reconstructed, activate `LOCAL_GLOBAL_OBSTRUCTION_TRIGGER`.

Use a sheaf-like compatibility model only as much as needed:

```text
local_sections/facts:
overlap_restrictions:
pairwise_compatibility:
global_gluing_possible: YES | NO | UNKNOWN
obstruction_witness:
```

This is specialized. Do not impose sheaf vocabulary on ordinary interface checks.

## 4. Observation value

When several observations could resolve an uncertainty, use ordinal value-of-information reasoning.
For each candidate observation `q`, consider:

```text
reachable_now?
operational_cost/risk?
which acceptance-changing hypotheses/classes can it separate?
will its result change action, authority, or confidence enough to matter?
is a cheaper observation equally discriminating?
```

Prefer the cheapest reachable observation that separates the leading target-relevant alternatives.

No numeric expected value is required. Do not fabricate priors, likelihoods, utilities, or monetary
values. If the user or authoritative model supplies them, a numeric VOI calculation may be used.

## 5. Refinement gate: CEGAR-style discipline

Activate `ABSTRACTION_REFINEMENT_TRIGGER` only when a counterexample, failed contrast, or verifier
result may be caused by abstraction loss.

Process:

```text
1. Produce/receive counterexample c.
2. Validate c against the raw/admissible semantics.
3. If c is real: preserve it as gap/failure evidence.
4. If c is spurious: identify the smallest missing observable distinction δ.
5. Refine the representation with δ.
6. Rerun the specific failed contrast plus relevant regressions.
7. Stop when target reconstruction is restored; do not broaden reflexively.
```

Record:

```text
counterexample_status: REAL | SPURIOUS | UNKNOWN
abstraction_loss_witness:
refinement_delta:
why_delta_is_smallest_known:
post_refinement_contrast:
```

A verifier failure does not automatically prove the underlying procedure is wrong. Conversely,
calling a witness "spurious" requires evidence that the raw semantics cannot realize the apparent
failure.

## 6. Refinement versus patching

Forbidden pattern:

```text
collapsed contrast
-> special-case the decision rule
-> keep the same insufficient representation
```

Required pattern:

```text
collapsed contrast
-> identify missing distinction
-> refine representation
-> reconstruct target
-> removal-test any extra additions
```

## 7. Escalation stop

Composition, VOI, and CEGAR are control tools, not output requirements. Once the target is decidable
with a smaller native-domain explanation, de-escalate and answer without theorem ceremony.
