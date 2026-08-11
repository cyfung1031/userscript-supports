# Exploration Receipt

```text
mode: PICK_EXPLORE
original_target:
known_authority:
observed_facts:
explicit_constraints:
allowed_reframings:
forbidden_commitments:
artifact_identity_and_version:
exploration_budget:
stop_reason: BREADTH_SATISFIED | HYPOTHESES_SEPARATED | MISSING_OBSERVATION | BUDGET_EXHAUSTED

hypotheses:
  - id:
    frame:
    status: HYPOTHESIS | TRANSLATABLE | CONTRASTABLE | HANDOFF_READY | DORMANT | REJECTED
    target_relation:
    observable_discriminator:
    missing_evidence:
```

exploration_claim_boundary:
  allowed: hypothesis | contrast_witness | handoff_question
  forbidden: CONFIRMED_GAP | NO_GAP_FOUND | UNDER-SPECIFIED | certificate | compiled_delta |
             mutation | rebinding | installed_authority
observability_status: AVAILABLE_NOW | PROSPECTIVE_ONLY | ERASED_UNRECOVERABLE
next_phase_if_any: PICK_AUDIT | PICK_DERIVE | NONE
handoff_oracle_and_scope:

Exploration receipts are non-authoritative. A `HANDOFF_READY` status means that a separate phase may
bind the target, authority, oracle, scope, and contrast; it does not itself issue a verdict or
certificate.
