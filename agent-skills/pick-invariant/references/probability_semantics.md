# Probability, Measure, and Information Semantics

This protocol activates only when a target materially depends on a random object, probability law,
sampling protocol, stochastic transport, conditioning construction, or information channel. It
extends `P/I/B/χ`; it does not add a fifth structural field.

## 0. Load contract

After `PROBABILITY_MEASURE_TRIGGER`, this reference is mandatory before a law-level, `UNIFORM`,
transport, conditioning, canonicality, quotient-weighting, stochastic-channel, or distributional
sufficiency claim. If it cannot be loaded, narrow or downgrade the claim.

Mere stochastic vocabulary does not trigger the protocol when the requested target depends only on an
authoritative realized value.

## 1. Object, law, channel, and conditioning are separate

Bind only the fields material to the target, but never silently conflate:

```text
P.measure:
  sample_or_object_space_Ω:
  observable_event_structure:
  raw_representation:
  equivalence_relation_and_quotient:
  reference_measure_λ:
  probability_law_ν:
  density_dν_dλ:
  normalization:
  independence_or_joint_law:
  observation_channel_or_experiment:
  conditioning_construction:
  symmetry_basis:
  authority_and_scope:
```

Coordinates do not determine a law. A quotient does not determine weights. An observed statistic does
not automatically preserve all decision-relevant information.

## 2. Uniformity certificate

`UNIFORM` is invalid without enough structure to identify what is uniform with respect to what:

```text
object_space:
reference_measure:
density_or_equivalent_law:
coordinate_chart:
coordinate_change_check:
normalization:
```

“Uniform in a coordinate” is not automatically uniform in area, volume, object space, or a quotient.
If the reference measure is missing, retain the phrase as a hypothesis or return
`UNDERDETERMINED_BY_SPECIFICATION`.

## 3. Transport and quotient audit

When a producer law is mapped to a consumer object, preserve:

```text
source_measure_ν:
mapping_F:
target_object_space:
target_measure_μ = F_*ν:
many_to_one_or_fiber_structure:
Jacobian_or_change_of_variables:
quotient_multiplicity:
selection_or_rejection_condition:
renormalization:
conditioning_status:
```

Trigger this audit for nonlinear maps, many-to-one maps, projection, quotienting, rejection/redraw,
or explicit conditioning. Do not call a pushforward law uniform merely because its source was
uniform.

A numerical guard is distinct from a mathematical condition:

```text
mathematical_condition: changes the model and may require renormalization
numeric_guard: handles numerical degeneracy without silently redefining the model
```

## 4. Conditioning semantics and the null-event gate

Ordinary positive-probability conditioning may use the usual conditional-law semantics.

If the conditioning event has zero/null measure, or the result depends on approaching a lower-
dimensional event through a parameterization/limit, activate `NULL_CONDITIONING_TRIGGER`.

Require one of:

```text
regular_conditional_distribution_basis
disintegration_basis
explicit_limiting_construction
other_authorized_conditioning_semantics
```

and record the relevant parameterization/reference measure. Do not write `given X=x` as though it
were automatically an ordinary finite-event conditioning rule when the underlying event is null.
If different admissible constructions yield different answers, report semantic underdetermination.

## 5. Symmetry, invariant measure, and canonicality

`SYMMETRY_CERTIFICATE` must bind:

```text
object_space:
transformation_group_G:
group_action:
required_invariance:
candidate_measure:
is_invariant:
unique_up_to_scale:
normalization_condition:
```

A Haar-style invariant-measure argument may establish canonicality relative to a specified group when
existence/invariance and the relevant uniqueness/normalization conditions are justified. Symmetry
alone, low variable count, direct sampling, or minimal representation does not establish
canonicality.

Use `CANONICAL_RELATIVE_TO(G)`, not an unqualified `CANONICAL`, unless a stronger authority explicitly
licenses that wording.

## 6. Decision versus distribution sufficiency

Use one explicit level:

```text
DECISION_SUFFICIENT       # reconstructs the requested decision/event
DISTRIBUTION_SUFFICIENT   # reconstructs the requested law or named stochastic observables
```

If two admissible laws agree on one event but differ on another requested observable, the
representation is only decision-sufficient for the first event.

If the specification admits multiple authorized laws, use:

```text
UNDERDETERMINED_BY_SPECIFICATION
MULTIPLE_ADMISSIBLE_MEASURES
```

This differs from `UNKNOWN` (oracle conflict) and `INSUFFICIENT_EVIDENCE` (missing evidence).

## 7. Blackwell-style information comparison

When comparing observation channels/experiments, the relevant question may be whether one observation
contains all decision-relevant information of another, not whether their coordinates match.

Use:

```text
DECISION_EQUIVALENT
DECISION_DOMINATES
INCOMPARABLE_INFORMATION
```

A dominance/equivalence claim requires a justified post-processing/garbling or equivalent decision-
class argument. Do not infer it from equal dimension, equal entropy, visual similarity, or one common
event probability.

Load `references/decision_quotients.md` for the target-relative discriminator and quotient details.

## 8. Le Cam-style approximate sufficiency

Only when the authority supplies an explicit tolerance/loss criterion may use:

```text
EPSILON_DECISION_SUFFICIENT(ε)
```

Bind `ε`, the loss/regret metric, decision class, and risk basis. Never invent them. Without an
authorized tolerance, exact decision sufficiency remains the default.

## 9. Bertrand principle

A random-object description is incomplete when different admissible generative protocols induce
different laws relevant to the target.

For any ambiguous "random X" request, ask internally:

```text
what is the object space?
what procedure/law generates it?
are coordinate representations many-to-one?
what measure is intended?
would another admissible protocol change the requested result?
```

If yes and the specification does not choose among them, return underdetermination rather than a
silently chosen convention.

## 10. Progressive output discipline

The measure machinery is internal unless the user asks for the derivation or the distinction itself
is the answer. In routine output, state the smallest useful conclusion, e.g. "the answer depends on
how the random chord is sampled," rather than dumping a complete measure certificate.
