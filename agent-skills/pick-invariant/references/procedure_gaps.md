# Procedure Gaps and Pick-Role Diagnosis

## 1. Why a gap certificate exists

"Novelty" is too easy to rationalize. A procedure gap must be tied to a concrete decision
that the current owner cannot safely make.

A valid certificate identifies:

- **owner** — the validated procedure currently responsible;
- **certificate issuer** — the actor drafting or emitting the gap evidence;
- **adoption authority** — the owner or higher explicit authority permitting derivation;
- **decision** — the exact decision it must return;
- **target authority** — the source/evidence that owns the required decision;
- **observed state** — what it cannot classify/resolve/compose;
- **admissibility evidence** — why the state can occur in the certified domain;
- **unsoundness** — why forcing the state through the current ontology risks a wrong result;
- **suspected Pick role** — `P`, `I`, `B`, `χ`, or `UNKNOWN` before derivation;
- **missing distinction** — the smallest semantic feature believed necessary after considering whether existing states/classes can be safely merged;
- **preserved scope** — which existing semantics remain valid and must not be reopened.

Optionally record a candidate collapsed pair, decision-equivalence/merge witness, or why the owner cannot yet construct one. Do not
make the pair an activation prerequisite when the gap is otherwise falsifiable and the suspected
role remains `UNKNOWN`.

## 2. Valid gap families

### Applicability gap — usually `P`
A theorem/procedure precondition is false, unknown, stale, ambiguous, or outside authority.

### Local ontology gap — usually `I`
A local owner cannot represent a decision-relevant state within its own semantic region.

### Composition gap — usually `B`
Two procedures are individually valid but their guarantee/requirement seam is untyped,
underspecified, or contradictory.

### Structural/topology gap — usually `χ`
All relevant local facts and direct seams appear valid, yet global structure or an invalid local-to-global composition rule still changes the decision.

### Authority conflict — often `P` or `B`
Two authoritative sources/procedures impose incompatible obligations and no precedence or
reconciliation rule exists.

### Verification gap — often not a compiler gap
The contract is sufficient but evidence needed to evaluate it is missing, stale, correlated,
or misconfigured. Repair verification first unless the inability to verify is itself a
stable applicability distinction that must be compiled.

### No owner
No validated semantic owner exists for the required decision. PickInvariant may derive a
new minimal representation from scratch.

### Audit-confirmed gap
A non-authoritative audit may discover a collapsed contrast and draft a certificate. The result
remains audit evidence until the owning procedure or higher explicit authority adopts/emits the
complete owner/decision/authority/admissibility/unsoundness/preserved-scope certificate, or until
`NO_OWNER` is independently established. Record certificate issuer and adoption authority.

## 3. Invalid gap claims

These do not by themselves activate PickInvariant:

- the case is unusual;
- extra analysis might improve quality;
- the owner returns a normal `BLOCKED`, `FAIL`, caveat, or retry verdict;
- execution violated an already sufficient contract;
- a verifier is stale but the acceptance rule remains sound;
- a preferred optimization is not encoded;
- the operator dislikes the current native verdict.

## 4. Pick-role diagnosis is provisional

The owner may emit `suspected_pick_role: UNKNOWN`. PickInvariant should classify the gap
only after constructing contrast cases. Do not force every composition issue to remain `B`
if the contrast reveals a missing local fact or global topology term.

## 5. Escape conditions belong to procedures

Every compiled procedure/extension should state conditions under which it cannot safely
continue. A future escape should identify the failed precondition or collapsed distinction
when possible.

## 6. Procedure retains partial ownership

A gap does not erase the owner. If one seam is missing, preserve unrelated native rules,
verdicts, safeguards, and authority.
