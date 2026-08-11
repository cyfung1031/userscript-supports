# Minimum Audit Packet

Use for `PICK_AUDIT`; the packet is read-only and does not authorize compilation or mutation.

```text
receipt_id:
parent_receipt_id:
audit_depth: FOCUSED_AUDIT | DELTA_AUDIT | FULL_AUDIT
target_decision:
target_authority:
certified_domain:
oracle_and_evidence_tier:
base_revision:
reviewed_revision:
owner_revision:
prior_findings_and_reconciliation:
observability_ledger:
coverage_dispositions: CHECKED | EXCLUDED(reason) | UNVERIFIED(risk)
finding_confidence: HIGH | MEDIUM | LOW
review_completeness: COMPLETE_FOR_SCOPE | PARTIAL | FOCUSED_ONLY
claim_boundary:
unavailable_or_conflicted_escape:
```

Missing fields narrow the claim to `PARTIAL` or `INSUFFICIENT_EVIDENCE`; they cannot support a broad
cleanliness claim.
