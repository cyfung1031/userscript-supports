# Symmetry / Canonicality Certificate

Use only when the output claims a measure is canonical relative to a stated symmetry principle.

```text
analysis_phase: PICK_EXPLORE | PICK_AUDIT | PICK_DERIVE
certificate_issuer:
adoption_authority:
oracle_or_authority:
object_space:
transformation_group_G:
group_action:
required_invariance:
invariant_measure_family_or_Haar_applicability:
candidate_measure:
is_invariant: YES | NO | UNKNOWN
unique_up_to_scale: YES | NO | UNKNOWN
existence_evidence:
uniqueness_evidence:
normalization_condition:
canonicality_claim: NONE | CANONICAL_RELATIVE_TO(G)
countermodels_or_residual_family:
evidence_and_verifier:
scope_limit:
forbidden_outputs_without_adoption: adopted_measure | canonicality | procedure_gap | mutation
```

Minimality, directness, symmetry without uniqueness, or agreement on one event cannot substitute for
`unique_up_to_scale: YES`.
