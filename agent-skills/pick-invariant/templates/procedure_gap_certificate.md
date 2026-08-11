# Optional Template: Procedure Gap Certificate

Use only when a mature owner cannot safely classify, resolve, or compose an observed state.
Adapt freely; semantics matter more than format.

```text
owner:
certificate_issuer:
adoption_authority:
required_decision:
target_authority_and_evidence_locator:
observed_state:
admissibility_or_reachability_evidence:
why_current_procedure_is_insufficient:
suspected_pick_role: P | I | B | CHI | UNKNOWN
smallest_missing_distinction:
preserved_scope:
candidate_collapsed_pair_or_reason_unavailable:
structural_reason: PROCEDURE_GAP | COMPOSITION_GAP | AUTHORITY_CONFLICT | other
```

A certificate is invalid if the owner can already express the state as an ordinary native
failure/verdict.

The candidate pair is diagnostic, not an activation prerequisite. Permit `UNKNOWN` when the
owner can show a falsifiable unsoundness but cannot yet localize the collapsed distinction.
An auditor may draft this certificate but cannot adopt it for derivation unless the user explicitly
authorizes both audit and repair. Otherwise require the owner or higher authority to adopt/emit it.
