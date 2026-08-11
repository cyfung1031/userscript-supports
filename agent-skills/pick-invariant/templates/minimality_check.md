# Target-Relative Minimality / Quotient Check

Use only after reconstruction sufficiency has been shown.

```text
target_decision:
certified_domain:
discriminator_class_QD:
candidate_representation:
sufficiency_rule:
dimensions_or_classes_tested:
  - distinction:
    delete_test:
      reconstructs_same_D: YES | NO | UNKNOWN
      contrast_ids:
    merge_test:
      merged_with:
      reconstructs_same_D: YES | NO | UNKNOWN
      contrast_ids:
    result: RETAIN | REMOVE | MERGE | UNKNOWN
stochastic_channel_relation: n/a | DECISION_EQUIVALENT | DECISION_DOMINATES |
                             INCOMPARABLE_INFORMATION
claim: SUFFICIENT | VALID_COMPRESSION | MINIMAL | UNKNOWN
scope_limit:
```

`MINIMAL` is target/domain/discriminator-relative. It does not imply canonicality or full-state
minimality.
