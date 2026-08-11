# Optional Template: Compiled Procedure

Use when no sound base procedure exists. The executor should not need theorem machinery.

```text
name:
required_decision:
mode: PICK_LITERAL | PICK_STRUCTURAL
derive_phase: COMPILE
adopted_gap_complete: YES | NO
target_authority_and_oracle:
certified_domain:
discriminator_class_QD:
P_applicability:
I_interior_predicates:
B_boundary_predicates:
chi_topology_predicates:
composition_rule_if_material:
reconstruction_or_decision_rule:
quotient_or_merge_basis:
blocker_classes:
authorized_responses:
verification_closure:
evidence_basis:
provenance:
escape_condition:
contrast_tests:
minimality_or_compression_claim:
telemetry:
```

The executor receives only operationally necessary predicates/rules. It must not rediscover Pick,
Nerode/bisimulation, Blackwell/Le Cam, valuation, VOI, CEGAR, or other theorem-specific reasoning.
