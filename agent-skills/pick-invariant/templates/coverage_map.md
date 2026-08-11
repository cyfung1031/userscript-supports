# Optional Template: Semantic Coverage Map

Use one row per material decision family before pinpointing audit findings.

```text
audit_depth: FOCUSED_AUDIT | DELTA_AUDIT | FULL_AUDIT
base_revision:
reviewed_revision:

family:
changed_or_affected_scope:
representatives:
status: CHECKED | EXCLUDED | UNVERIFIED
highest-risk seam:
evidence_tier: SOURCE_DETERMINISTIC | STATIC_WITH_SPEC_ASSUMPTION | FIXTURE_EXECUTED |
                BROWSER_RUNTIME | EXTERNAL_INTEGRATION
remaining_risk:
```

In `DELTA_AUDIT` and `FULL_AUDIT`, do not finish while a material family lacks a disposition.
