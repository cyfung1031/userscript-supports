# Optional Template: Derived Extension

Prefer this when extending a mature procedure rather than creating a new gate.

```text
base_procedure:
gap_certificate:
primary_pick_role: P | I | B | CHI
dependency_roles: optional metadata only
role_rationale:

target_decision:
certified_domain:
discriminator_class_QD:
delta:
semantic_delta:
operational_mechanism:
applicability_of_delta:
observable_evidence:
observable_state: AVAILABLE_NOW | PROSPECTIVE_ONLY | ERASED_UNRECOVERABLE
observation_method:
observation_window_or_freshness:
verifier:
observation_status: OBSERVED | SPECIFIED | FIXTURE_OWNED | UNAVAILABLE | CONFLICTED
evidence_authority:
stable_at_decision_time:
new_state_required:
representation_effect:
  P:
  I:
  B:
  chi:
quotient_effect:
  classes_separated_or_merged:
  witness:
acceptance_effect:
composition_effect_if_material:
authorized_actions:
verification:
provenance:
repair_scope: prospective | retrospective | both | n/a
coverage_domain:
required_historical_evidence:
residual_unhandled_states:
escape_condition:
contrast_cases:
  negative:
  positive:
minimality_check:
  claim: SUFFICIENT | VALID_COMPRESSION | MINIMAL | UNKNOWN
  certified_domain:
  oracle:
  contrast_ids:
  delete_tests:
  merge_tests:
  semantic_minimality:
  operational_feasibility:
```

The extension preserves all unaffected base-procedure semantics and should contain only distinctions
that survive target-relative quotient/minimality testing.
