# Audit, Contrast, Evidence, and Verdict Discipline

## Contents

1. Audit authority
2. Activation receipt
3. Claim and target binding
4. Target decomposition
5. Contrast lifecycle
6. Admissibility and reachability
7. Failure-mechanism scope
8. External oracles
9. Evidence and negative invariants
10. Consequence and compensation
11. Coverage and stopping
12. Verdict contract

## 1. Audit authority

Use `PICK_AUDIT` as a read-only stress test of an existing representation, invariant, decision,
or semantic seam. Do not treat explicit invocation as derivation authority.

Permit these outputs:

```text
NO_GAP_FOUND(inspected_domain, coverage)
POTENTIAL_GAP(hypothesis, missing_evidence)
CONFIRMED_GAP(certificate)
INSUFFICIENT_EVIDENCE(blocking_oracle_or_observable)
```

Do not compile `Δ`, mutate the artifact, rebind an owner, or install procedure authority in
audit mode. A `CONFIRMED_GAP` may draft evidence, but derivation requires the owning procedure or
higher explicit authority to adopt/emit the complete certificate, or requires `NO_OWNER` to be
independently established.

## 2. Activation receipt

Bind mode before analysis:

```text
mode:
owner:
owner_result:
target_decision:
oracle:
certified_domain:
explicit_exclusions:
artifact_identity_and_version:
```

When a supplied artifact is unavailable, mark `artifact_identity_and_version` as
`INFERRED_PICKINVARIANT`. Never reconstruct a named version from memory while claiming exact
conformance.

## 3. Claim and target binding

For an audit, record:

```text
analysis_kind: PRESERVATION | CLAIM_VALIDATION | REPRESENTATION | SEAM | OTHER
normalized_claim_or_invariant:
source_locator:
source_authority:
status: OBSERVED | INFERRED | CONFLICTED
conflicting_sources:
required_decision_D:
```

Use source order to discover the claim, not to invent authority precedence. If prose, code,
tests, specifications, and mature procedures disagree, report the conflict explicitly.

Keep `analysis_kind` outside `R_P`; classify the decision-relevant structural distinction as
`P`, `I`, `B`, or `χ`.

## 4. Target decomposition

Split independent decisions before topology analysis:

```text
D = <D1, D2, ...>
```

Retain a combined decision only when interactions among components change its result. A large
container, many symptoms, or several claims is not by itself `χ`.

## 5. Contrast lifecycle

Track a contrast through these states:

```text
CANDIDATE
-> ADMISSIBLE
-> SEPARATING
-> CERTIFIED_COLLAPSE

or
-> SEPARATED
-> VALID_COMPRESSION
-> UNRESOLVED
-> OUT_OF_DOMAIN(reason)
-> REJECTED(reason)
```

- `CANDIDATE`: a pair or proof idea may expose a decision distinction.
- `ADMISSIBLE`: both states belong to the certified domain or one legitimately tests `P`.
- `SEPARATING`: the oracle establishes different required decisions.
- `CERTIFIED_COLLAPSE`: the observed representation cannot distinguish the separating states.
- `SEPARATED`: the representation already preserves the required distinction.
- `VALID_COMPRESSION`: raw states differ, but the oracle requires the same decision.
- `UNRESOLVED`: admissibility, oracle, observation, or decision remains unknown.
- `OUT_OF_DOMAIN`: a stated authority/domain rule excludes the state.
- `REJECTED`: the candidate premise or expected decision was false.

Do not require a certified collapse before a falsifiable `UNKNOWN` procedure gap may invoke the
compiler. Do require contrast or an equivalent proof before a candidate distinction enters
`DELTA/COMPILE` or becomes a confirmed audit finding.

## 6. Admissibility and reachability

Separate these questions without turning them into new Pick roles:

```text
POSSIBLE            Can the state be represented syntactically or in a mock?
ADMISSIBLE          Does it satisfy the certified domain or test an applicability boundary?
REACHABLE           Can the relevant runtime/history/actor produce it?
OBSERVABLE          Can the auditor or executor distinguish it?
DECISION_RELEVANT   Can it change D under the bound oracle?
```

Classify the resulting distinction in `P/I/B/χ`. An impossible production state may still be
a verifier fixture, but it cannot by itself authorize a production remedy.

## 7. Failure-mechanism scope

Do not equate the literal report with the full certified domain. Ask:

```text
Is the reported trigger one witness of a larger equivalence class produced by the same
transformation, decoder, boundary, or topology?
```

Test one strongest affordable adjacent state with the same mechanism. Expand scope only when
admissibility and the oracle support the same decision relation. Preserve explicit exclusions.

## 8. External oracles

Bind external compatibility, specification, policy, or reference-implementation targets:

```text
oracle_identity:
version_or_epoch:
authority:
observation_method:
status: OBSERVED | SPECIFIED | FIXTURE_OWNED | UNAVAILABLE | CONFLICTED
```

Use `UNKNOWN` rather than assuming an expected decision when the controlling oracle is
unavailable or conflicting. Do not require live access when an authoritative specification or
accepted fixture already owns the decision.

## 9. Evidence and negative invariants

Describe evidence basis without false precision:

```text
DETERMINISTIC_PROOF
DETERMINISTIC_TRACE
RUNTIME_OBSERVED
AUTHORITATIVE_SPEC
ENVIRONMENT_DEPENDENT
INFERENCE
HYPOTHESIS
```

Record the source locator, observation window, verifier, confidence basis, and missing next
check. Keep evidence metadata outside `R_P` unless it changes applicability or the target.

For a claim that an event **does not happen**, require either:

- direct observation of the forbidden event channel over the certified closure window; or
- a causal proof that execution cannot reach the event.

An earlier callback, absent success callback, or final value alone does not prove that a
request, write, disclosure, or other forbidden side effect never occurred.

## 10. Consequence and compensation

Record the earliest representation/invariant widening separately from final consequence:

```text
earliest_violated_invariant:
later_enforcement_points:
compensating_guards:
guard_authority_and_independence:
final_observable_consequence:
remaining_exposure_or_reliability_consequence:
```

Do not erase an early contract violation merely because a later guard compensates. Do not
claim the uncompensated consequence when the later guard is effective. Preserve redundant
enforcement when layers have distinct authorities or independent failure modes.

Keep severity orthogonal to invariant validity. A valid collapse may be low severity; a severe
hypothesis remains unconfirmed until evidence supports it.

## 11. Coverage and stopping

For bounded audits, inventory semantic families rather than every file or line:

```text
family:
coverage: CHECKED | EXCLUDED(reason) | UNVERIFIED
representatives:
highest-risk seam:
result:
```

Follow the smallest semantic path needed to decide the claim:

```text
claim -> representation -> enforcement -> transformation -> observation
```

Expand only for unresolved seams, downstream compensation, contrast validity, topology, or
provenance. An unverified decision-relevant family blocks an unqualified whole-scope pass but
does not block a correctly labeled domain-limited result.

Stop when all material contrasts and semantic families in the certified domain have a
disposition, or when a named oracle/observable is unavailable. Do not continue for generic
confidence, curiosity, or unrelated polish.

## 12. Verdict contract

Keep the full structural diagnosis in the internal audit packet. In user-facing output, lead with the native-domain witness, decision difference, and consequence. Expose Pick roles, quotient classes, theorem names, or certificate vocabulary only when the user asks for them or when they materially clarify the result. Internal control logic is not mandatory user-facing ceremony.

Emit `NO_GAP_FOUND(inspected_domain, coverage)` only when:

1. the certified domain, target, oracle, and exclusions are explicit;
2. all materially tested contrasts have dispositions;
3. no `UNRESOLVED` contrast can flip `D` inside the domain;
4. negative invariants have direct or causal evidence;
5. decision-relevant semantic families are checked or excluded with authority.

Otherwise use one of the remaining canonical audit results:

```text
POTENTIAL_GAP(hypothesis, missing_evidence)
CONFIRMED_GAP(certificate)
INSUFFICIENT_EVIDENCE(blocking_oracle_or_observable)
```

Never translate `NO_GAP_FOUND` into a global proof of absence.
