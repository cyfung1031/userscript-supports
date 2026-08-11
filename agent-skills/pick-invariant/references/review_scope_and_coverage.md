# Review Scope, Coverage, and Claim Boundary

Use this reference for any explicit invariant audit. It governs completeness claims while the
Pick kernel governs semantic sufficiency.

## Audit-depth contract

```text
FOCUSED_AUDIT = named seam, owner delta, or hypothesis
DELTA_AUDIT   = every decision-relevant family changed or affected base -> head
FULL_AUDIT    = whole artifact plus relevant unchanged surrounding behavior
```

State one depth before pinpointing. A focused result is never a whole-artifact verdict. Delta and
full audits continue after the first finding until every material family is checked, explicitly
excluded, unverified with risk, or blocked by a named oracle.

## Coverage map

```text
family:
changed_or_affected_scope:
representatives:
status: CHECKED | EXCLUDED | UNVERIFIED
highest-risk seam:
evidence_tier:
remaining risk:
```

The map is a semantic partition, not a file list. Use domain adapters to propose families, then
retain only families whose states can change the target decision. Keep the map even when a family
has no finding.

## Confidence versus completeness

```text
finding_confidence: HIGH | MEDIUM | LOW
review_completeness: COMPLETE_FOR_SCOPE | PARTIAL | FOCUSED_ONLY
```

High confidence means the witness and required decision are well supported. Complete-for-scope means
all material families in the declared scope have a disposition. Neither field implies the other.

## Revision reconciliation

```text
base_revision:
reviewed_revision:
owner_revision:
prior_findings:
resolved_findings:
stale_or_outdated_findings:
current_delta:
```

Candidate statuses are `REPEAT_EXISTING`, `RESOLVED_BY_CURRENT_HEAD`, `NARROWER_REMAINDER`, and
`NEW_FINDING`. A repeated or resolved item is not a new finding. A narrower remainder requires a
fresh decision-first contrast.

## Review claim boundary

Every audit handoff declares:

```text
audited_scope:
unverified_scope:
runtime_validation:
oracle_limitations:
global_cleanliness_claim: FORBIDDEN unless explicitly justified
```

Do not turn `NO_GAP_FOUND` for one domain, family, or revision into “the artifact is clean.”
