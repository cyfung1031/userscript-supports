# Optional Template: Contrast Certificate

Use one record per materially tested contrast. Compile only the smallest target-relevant distinction.

```text
analysis_kind:
decision_and_oracle:
target_authority_and_locator:
x_minus:
x_plus:
admissibility_and_reachability:
continuation_if_material:
raw_differing_feature:
observed_representation_or_projected_trace:
expected_D_minus:
expected_D_plus:
evidence_basis:
evidence_tier: SOURCE_DETERMINISTIC | STATIC_WITH_SPEC_ASSUMPTION | FIXTURE_EXECUTED |
               BROWSER_RUNTIME | EXTERNAL_INTEGRATION
pick_role: P | I | B | CHI | UNKNOWN
decision_equivalence_class_before:
decision_equivalence_class_after:
counterexample_status: REAL | SPURIOUS | UNKNOWN | n/a
state: CANDIDATE | ADMISSIBLE | SEPARATING | CERTIFIED_COLLAPSE | SEPARATED |
       VALID_COMPRESSION | UNRESOLVED | OUT_OF_DOMAIN(reason) | REJECTED(reason)
smallest_candidate_delta:
verification_or_next_check:
finding_confidence: HIGH | MEDIUM | LOW
review_completeness: COMPLETE_FOR_SCOPE | PARTIAL | FOCUSED_ONLY
```
