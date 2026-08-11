# Optional Template: Activation Receipt

Use this receipt to bind one phase, its authority, and its transition. Link the full gap certificate
before derivation; never replace it with this receipt.

```text
receipt_id:
parent_receipt_id:
mode: BYPASS | PICK_EXPLORE | PICK_AUDIT | PICK_DERIVE
derive_phase: INVESTIGATE | COMPILE | n/a
audit_depth: FOCUSED_AUDIT | DELTA_AUDIT | FULL_AUDIT | n/a
owner:
owner_result: ADEQUATE | PROCEDURE_GAP | NONE
target_decision:
basis: explicit_audit | no_owner | gap_certificate | owner_adequate
oracle:
certified_domain:
artifact_identity_and_version:
gap_certificate: path-or-none
transition_authority: owner_adoption | higher_explicit_authority | no_owner | none
allowed_outputs:
forbidden_outputs:
closed_before_next_phase: YES | NO | n/a
observability_status: AVAILABLE_NOW | PROSPECTIVE_ONLY | ERASED_UNRECOVERABLE
specialized_triggers: probability | decision_quotient | composition | observation_value | abstraction_refinement | null_conditioning | symmetry | local_global | none
base_revision:
reviewed_revision:
review_completeness: COMPLETE_FOR_SCOPE | PARTIAL | FOCUSED_ONLY | n/a
missing_required_fields_escape: UNKNOWN | INSUFFICIENT_EVIDENCE | n/a
```
