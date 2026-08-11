# Measure Certificate

Use when a target depends on a probability law or a `UNIFORM` claim.

```text
analysis_phase: PICK_EXPLORE | PICK_AUDIT | PICK_DERIVE
certificate_issuer:
adoption_authority:
oracle_or_authority:
target_decision_or_stochastic_observable:
sample_space_Ω:
sigma_algebra_or_event_family:
object_representation:
equivalence_relation_and_quotient:
reference_measure_λ:
probability_law_ν:
density_dν_dλ:
independence_or_joint_law:
conditioning:
conditioning_semantics: POSITIVE_MEASURE_EVENT | REGULAR_CONDITIONAL | DISINTEGRATION | LIMITING_CONSTRUCTION | UNSPECIFIED
null_event_status: NOT_NULL | NULL | UNKNOWN
normalization:
uniformity_claim: NONE | UNIFORM_WITH_RESPECT_TO(λ)
authority_and_scope:
observability_status:
safe_escape:
forbidden_outputs_without_adoption: adopted_measure | canonicality | procedure_gap | mutation
```

Do not emit bare `UNIFORM` when `reference_measure_λ` is absent.
