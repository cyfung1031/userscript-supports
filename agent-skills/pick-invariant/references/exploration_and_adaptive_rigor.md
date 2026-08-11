# Exploration and Adaptive Rigor

## 1. Purpose

PickInvariant v11 separates **discovery freedom** from **commitment authority**. Earlier versions
progressively constrained reasoning to improve reliability; v10.1 preserves broad exploration in a
non-authoritative sandbox while preserving strict adoption rules.

The invariant is:

```text
hypothesis breadth may increase freely
commitment breadth may increase only with authority + evidence + decision relevance
```

Evidence strength and authority to issue a verdict are separate axes. A strong contrast can make a
hypothesis `HANDOFF_READY` without making it a confirmed gap.

## 2. PICK_EXPLORE receipt

Bind before exploration:

```text
mode: PICK_EXPLORE
exploration_budget: finite count/time/token bound
stop_reason:
original_target:
known_authority:
observed_facts:
explicit_constraints:
allowed_reframings:
forbidden_commitments:
artifact_identity_and_version:
```

If the original target is ambiguous, record multiple candidate readings rather than silently choosing
one. A proposed reframing never replaces the original target until explicitly adopted by the user or
other controlling authority.

## 3. Hypothesis lifecycle

Exploration may use any conceptual representation. Track candidates as:

```text
HYPOTHESIS
-> TRANSLATABLE
-> CONTRASTABLE
-> HANDOFF_READY

or
-> REJECTED(reason)
-> DORMANT(missing_evidence)
```

- `HYPOTHESIS` — plausible explanatory frame.
- `TRANSLATABLE` — can be related to the bound target and observable distinctions.
- `CONTRASTABLE` — admits a pair/proof that could separate decisions.
- `HANDOFF_READY` — suitable evidence/question for a separately bound `PICK_AUDIT` or derivation
  phase; it is not itself a certificate.

Do not require all hypotheses to use `P/I/B/χ`. That grammar becomes mandatory only when a structural
claim is audited/compiled, unless a direct fast delta already suffices.

## 4. Safe ontology freedom

Permitted exploration includes, for example:

- graph/topology and reachability;
- information bottlenecks and lossy transformations;
- causal/temporal traces;
- conservation and accounting identities;
- adversarial/game-theoretic models;
- optimization or resource-allocation models;
- probabilistic or uncertainty models;
- geometric or symmetry representations;
- state machines and protocol views;
- alternative decompositions of the same target.

The model may switch frames when one is unproductive. Keep the observations and authoritative target
anchors stable while doing so.

## 5. Handoff firewall

Exploration cannot directly produce:

- `NO_GAP_FOUND`;
- `CONFIRMED_GAP` as an authoritative audit verdict;
- `UNDER-SPECIFIED` as an authoritative verdict;
- information-loss or contrast certificates;
- `Δ` compilation;
- mutation authorization;
- owner rebinding;
- a whole-scope cleanliness claim.

To hand off into `PICK_AUDIT`, bind the exact target, domain, oracle/evidence basis, and proposed
contrast or seam. To hand off into `PICK_DERIVE`, additionally require `NO_OWNER` or an adopted
`PROCEDURE_GAP`.

## 6. Adaptive rigor ladder

Use the least expensive sufficient route.

### DIRECT

Use a mature owner/native mechanism. No Pick analysis unless explicitly requested.

### FAST_DELTA

Use when all are true:

1. a valid derivation authority exists;
2. one observable distinction or typed seam is already identified;
3. the oracle/authority establishes its decision effect;
4. admissibility/reachability is adequate for the target domain;
5. no unresolved contrast suggests a different Pick role;
6. no residual topology or multi-seam interaction is needed;
7. owner safeguards can be preserved unchanged.

Minimum fast-delta artifact:

```text
owner:
target_decision:
applicability:
observed_gap:
Δ:
decision_rule:
evidence/oracle:
verification:
escape:
preserved_scope:
```

Do not enumerate empty or irrelevant `P/I/B/χ` sections.

### STRUCTURAL

Escalate when any fast-delta condition fails because of structural uncertainty, including:

- gap role `UNKNOWN`;
- a separating contrast still collapses under the candidate delta;
- multiple seams interact;
- historical information loss or temporal ordering changes the target;
- local facts + direct boundaries fail reconstruction;
- residual cycle/coverage/overlap/reachability structure changes `D`;
- competing candidate deltas remain observationally indistinguishable.

Then use Pick-role classification, decision-quotient reconstruction, and target-relative minimality. Load `references/decision_quotients.md` when safe merging/continuation equivalence is material.

The escalation receipt is mandatory. A same-coarse-representation / different-`D` witness is a valid
structural trigger; topic fame or conceptual depth alone is not.

### COVERAGE

Coverage is orthogonal to structural depth. It is mandatory only when the audit claim itself carries
breadth: `DELTA_AUDIT`, `FULL_AUDIT`, or another explicit completeness assertion.

A structural derivation is not automatically a full audit. A full audit may contain mostly simple
checks without requiring topology.

## 7. Escalation and de-escalation

Every escalation must name its trigger:

```text
from_depth:
to_depth:
triggering_contrast_or_uncertainty:
what_the_deeper_mode_can_decide_that_the_shallower_mode_cannot:
```

Stop escalating when the target is reconstructed and the relevant merge/removal tests survive. If a complex hypothesis reduces to one sufficient boundary relation, de-escalate to a minimal compiled delta. In structural review, distinguish
`SUFFICIENT` from `MINIMAL`: the latter requires a removal-by-contrast record for every deleted
dimension. Do not call a target-relevant marginal globally minimal merely because it reconstructs
`D` for one fixed event.


## 7A. Observation-value discipline

When multiple missing observations could resolve the same uncertainty, rank them by reachability,
operational cost/risk, and ability to separate acceptance-changing hypotheses. Prefer the cheapest
sufficient discriminator; do not fabricate numeric priors, utilities, or expected values.

If a failed contrast may be an artifact of a coarse abstraction rather than a real procedure failure,
activate the refinement gate in `references/composition_and_refinement.md` and classify the witness as
`REAL | SPURIOUS | UNKNOWN` before rebinding or patching.

## 8. Exploration versus audit

Use exploration when the user asks for alternative models, theories, reframings, or open-ended
reasoning and does not require a coverage-bearing verdict.

Use audit when the user asks whether an existing claim, invariant, artifact, or change is sound over
a declared scope.

Do not convert exploration into audit merely to obtain more authoritative-sounding language.

## 9. Exploration versus derivation

Use derivation only when a decision procedure is actually missing. Exploration may generate a
candidate procedure, but it remains a hypothesis until the target, authority, observability, and
contrast obligations are satisfied.

## 10. Stop rules

`PICK_EXPLORE` stops when one of these occurs:

- the requested hypothesis breadth has been supplied;
- leading hypotheses have been separated as far as available evidence allows;
- a handoff-ready falsifiable question/gap has been produced;
- further exploration would only add ungrounded variants;
- a named missing observation/oracle blocks discrimination.

Exploration is not permission for unlimited brainstorming. If no bound is supplied, use a small
finite default and record the stop reason; a vague request does not authorize unbounded expansion.

## 11. Observability lattice

For every decision-relevant distinction, record one of:

```text
AVAILABLE_NOW        # executor can inspect it at the decision point
PROSPECTIVE_ONLY     # can be encoded for future runs, not recovered now
ERASED_UNRECOVERABLE # history, measure, or authority was compressed away
```

If the target depends on `PROSPECTIVE_ONLY` or `ERASED_UNRECOVERABLE` information, request or
declare the missing protocol/measure, narrow the target, or return `INSUFFICIENT_EVIDENCE`. Never
guess a sampling law from a realized chord or other output.

## 12. Mixed requests use sequential phases, not blended authority

Select one mode per phase. When a request mixes exploration, audit, and repair, sequence receipts so
a lower-authority phase cannot silently inherit higher authority.

Typical precedence:

```text
need operative native decision and owner exists -> BYPASS owner first
explicit coverage/verdict request              -> PICK_AUDIT
explicit ideation without verdict              -> PICK_EXPLORE
adopted gap / NO_OWNER requiring procedure     -> PICK_DERIVE
```

Examples:

- “Brainstorm what else could go wrong; don't claim bugs.” -> `PICK_EXPLORE`.
- “Audit this PR for invariant violations.” -> `PICK_AUDIT`, even though hypothesis generation occurs internally.
- “Explore alternatives, then audit the strongest one.” -> `PICK_EXPLORE` receipt closes, then a new `PICK_AUDIT` receipt binds the chosen target/oracle.
- “Audit and fix confirmed issues.” -> audit first; derivation/repair begins only after the confirmed gap is adopted under the requested repair scope.

Never merge modes merely to save a receipt.
