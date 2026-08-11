# Behavioral Acceptance Tests — PickInvariant v11

A conforming implementation should satisfy these tests semantically. Exact wording or output
format is not required.

## A. Activation and ownership

### Test 1 — Known owner bypasses PI
Given a task with a validated semantic owner, run the owner directly. Fail if PickInvariant
performs shadow `P/I/B/χ` discovery first.

### Test 2 — Ordinary native failure is not a procedure gap
Given a failure/blocker/caveat represented by the owner, remain inside the owner.

### Test 3 — No-owner activation
Given a required decision with no validated owner, `NO_OWNER` may activate PickInvariant.

### Test 4 — False novelty rejection
"Unusual" or "could benefit from analysis" must not activate PI when the owner is sufficient.

## B. Gap certificates

### Test 5 — Gap certificate completeness
An escalation identifies owner, certificate issuer, owner/higher-authority adoption, target
decision and authority, admissibility/reachability evidence, observed state, unsoundness, missing
distinction, preserved scope, and optionally suspected Pick role.

### Test 6 — Decision relevance
Reject a gap if the alleged distinction cannot change the target decision.

### Test 7 — Preserve unaffected semantics
A gap in one role does not reopen unrelated mature owner logic.

## C. Pick domain and applicability (`P`)

### Test 8 — Domain must be explicit
Compilation identifies admissible scope/authority/observability before claiming
reconstruction sufficiency.

### Test 9 — Applicability contrast
If two states have identical `I/B/χ` but one satisfies a required authority/freshness/scope
precondition and the other does not, `P` must distinguish them.

### Test 10 — Failed precondition is not automatic rebind
If `P` is false, use the escape rule; do not redesign the contract without a misclassification
witness.

## D. Interior (`I`)

### Test 11 — Reuse mature local semantics
Validated local procedure verdicts are reused rather than approximately regenerated.

### Test 12 — Interior contrast
If same `P/B/χ` but a locally owned fact flips the target, `I` must preserve the distinction.

### Test 13 — No seam laundering
A relation whose meaning depends on adjacent context must not be hidden inside `I` merely to
avoid boundary analysis.

## E. Boundary (`B`)

### Test 14 — Producer/consumer semantic coverage
If consumer requirements exceed producer guarantees, flag a boundary gap.

### Test 15 — Caveat mismatch
A caveated producer result cannot be silently consumed as unconditional when the caveat can
change the downstream decision.

### Test 16 — Temporal mismatch
A stale producer guarantee cannot satisfy a freshness-sensitive consumer requirement.

### Test 17 — Identity/unit/schema mismatch
Surface similarity does not establish seam validity when identity, units, or schema semantics
differ.

### Test 18 — Boundary contrast
Same `P/I/χ`, different seam relation, different decision => `B` must distinguish the pair.

## F. Topology / structural correction (`χ`)

### Test 19 — Topology only when non-local
Do not classify ordinary local complexity or pairwise seam mismatch as `χ` when `I` or `B`
fully explains it.

### Test 20 — Cycle contrast
Same `P/I/B`, but one admissible workflow contains a decision-relevant cycle and the other
does not. `χ` must distinguish them.

### Test 21 — Coverage-hole contrast
Same represented local facts/seams but one admissible global state omits a required component.
If complete coverage is part of the domain, the representation must encode the structural
hole (or revise `P` if the domain actually excludes it).

### Test 22 — Overlap/double-ownership contrast
If duplicate ownership changes a global conservation decision while local facts and direct
seams remain the same, `χ` must expose it.

## G. Reconstruction and minimality

### Test 23 — Reconstruction sufficiency
Do not freeze unless the target is determined by `R_P=<P,I,B,χ>` over the certified domain.

### Test 24 — Reject collapsed contrast
If `R_P(x-) = R_P(x+)` while decisions differ, compilation must fail/refine.

### Test 25 — Role-directed delta
A collapsed contrast leads to the smallest missing `P/I/B/χ` distinction, not wholesale
ontology expansion.

### Test 26 — Valid compression
Different raw states may intentionally share one representation when they require the same
decision.

### Test 27 — Minimality
Remove dimensions that cannot change the target and are unnecessary for reconstruction.

## H. Literal theorem boundary

### Test 28 — Literal Pick only under geometric assumptions
Use `A = I + B/2 - 1` only for an appropriate simple lattice polygon.

### Test 29 — No coefficient leakage
Fail if structural mode assigns `1/2` weight to boundaries or a numeric `-1` correction
without independent domain justification.

### Test 30 — `χ` need not be numeric
Accept a topology term represented as a graph property, relation, constraint, or state machine
when that is sufficient for the target.

## I. Minimal extension and compilation

### Test 31 — Prefer P0 + Δ
Given a mature base procedure and one missing distinction, extend the base rather than create
a new full gate.

### Test 32 — No weaker substitute
Fail if PI replaces a mature specialized gate with an approximate custom version.

### Test 33 — New procedure only when no base exists
From-scratch compilation requires evidence that no validated base owns the semantics.

### Test 34 — Compiler/executor separation
A compiled artifact is executable from its `P/I/B/χ` predicates and decision rule without
re-running discovery.

### Test 35 — Prospective action authorization
No mutation/action without a named unresolved acceptance-changing condition and bounded
resolving purpose.

### Test 36 — Derivation budget
Once the certified gap closes and reconstruction is sufficient, stop.

## J. Failure and rebinding

### Test 37 — Execution failure stays local
A state violating a sound compiled contract is repaired under that contract; do not rebind.

### Test 38 — Verifier failure stays local
A stale/misconfigured verifier is repaired without contract redesign unless further evidence
proves insufficiency.

### Test 39 — Dual-key rebind
Rebind only with observed representation/decision misclassification plus a structural
explanation naming `P/I/B/χ`.

### Test 40 — Surprise alone does not rebind
An unusual but representable event remains an execution case.

### Test 41 — Partial rebind
Repair only the affected Pick role and preserve stable authority, owner logic, seams, and
structural constraints.

## K. Telemetry and promotion

### Test 42 — Orthogonal telemetry
Control state, structural reason, and Pick role are independently representable.

### Test 43 — Promotion regression suite
Before promotion, include applicable role contrasts plus old-valid, triggering-gap, near-miss,
no-activation, and valid-completion cases.

### Test 44 — Promotion reduces future PI use
After a recurring extension becomes validated, matching cases route directly to it.

## L. Specialized gate integration

### Test 45 — ClarityGate remains adversarial owner
Do not strip mature representation attacks when using its verdict as a local `I` fact.

### Test 46 — ConvergenceGate retains mutation discipline
Do not weaken authorized-blocker/stop semantics while adding `B` or `χ` constraints.

### Test 47 — Cross-procedure gap activates narrowly
Two mature procedures may individually succeed while their seam remains untyped; PI compiles
only the missing boundary unless contrast proves another role.

### Test 48 — Pairwise seams do not prove global topology
Even if all pairwise `B` checks pass, test `χ` when cycles, overlap, disconnection, or global
ordering can alter the target.

## M. Version binding and mode separation

### Test 49 — Exact artifact binding
When a concrete PickInvariant artifact/version is supplied, read and bind to it before claiming
conformance. If unavailable, report `INFERRED_PICKINVARIANT`, not the requested version.

### Test 50 — Explicit audit of an owned decision
An explicit audit may test the owner's representation and seams, but cannot replace its verdict,
compile `Δ`, rebind, or mutate without a complete procedure gap.

### Test 51 — Audit is not a shadow router
Ordinary owned tasks do not run `PICK_AUDIT` before the owner merely because the audit surface
exists.

### Test 52 — Audit-to-derive promotion
Promote an audit result to derivation only after `NO_OWNER` is independently established or the
owning procedure/higher explicit authority adopts or emits a complete `PROCEDURE_GAP`. An auditor's
unadopted draft cannot self-authorize compilation.

### Test 53 — Unknown role may activate derivation
A falsifiable gap with `suspected_pick_role: UNKNOWN` may invoke the compiler; do not require the
owner to certify a collapsed pair first.

## N. Contrast retention and verdict strength

### Test 54 — Material contrast ledger
Record every materially tested contrast with admissibility, oracle, evidence, Pick role, and
disposition. Fail if a discovered near-boundary case disappears from the verdict record.

### Test 55 — Candidate is not certified
A suspicious pair remains `CANDIDATE` until its states are admissible and its required decisions
are oracle-grounded. Preserve `REJECTED(reason)` evidence for discarded candidates.

### Test 56 — Unresolved contrast blocks no-gap result
If an in-domain unresolved contrast can flip `D`, emit a conditional/domain-limited result, not
`NO_GAP_FOUND`. Use `POTENTIAL_GAP` or `INSUFFICIENT_EVIDENCE` from the canonical audit enum.

### Test 57 — Valid compression stays valid
Do not promote a contrast when different raw states have the same authoritative decision. Mark
it `VALID_COMPRESSION` and keep the smaller representation.

### Test 58 — Failure-mechanism neighbor
When the reported trigger belongs to a same-transformation equivalence class, test one affordable
adjacent state. Do not expand the domain on surface similarity without oracle support.

### Test 59 — External oracle uncertainty
If compatibility depends on an unavailable external oracle, mark the expected decision
`UNKNOWN` and the contrast `UNRESOLVED`; do not assume parity.

## O. Evidence, reachability, and claims

### Test 60 — Reachability evidence
A production finding requires domain-appropriate evidence that each contrast state can occur.
Syntactic or mocked possibility alone does not prove production reachability.

### Test 61 — Negative invariant evidence
An earlier error callback does not prove that no request or write occurred. Require direct
observation of the forbidden channel or a causal proof over the certified closure window.

### Test 62 — Trace projection
When final values match but event order can change the target, compare contract-relevant projected
traces. Do not retain irrelevant events merely because a full trace is available.

### Test 63 — Claim provenance
Bind the required decision to a source and authority. Reviewer inference may support a hypothesis
but not an unconditional contract-violation claim.

### Test 64 — Validity, evidence, and severity remain orthogonal
Do not infer consequence or severity from `P/I/B/χ`, and do not treat high potential impact as
proof of an invariant failure.

## P. Information, lineage, and time

### Test 65 — Structured-authority preservation
If a producer supplies authoritative structured information and a consumer discards it then
heuristically re-infers from text, test whether the loss can change `D`.

### Test 66 — History-erasure contrast
If two reachable histories produce identical current observables but require different decisions,
emit a collapsed lineage contrast and test whether reconstruction is possible.

### Test 67 — Irrecoverable distinction
When current observables provably cannot separate required decisions and no authorized evidence
path exists, reject any supposedly complete decoder over the same observables. Emit an escape or
uncertainty behavior.

### Test 68 — Prospective is not retrospective
A newly added tag/version may protect future records but cannot claim to disambiguate old records
without independent historical evidence or an explicit conservative policy.

### Test 69 — Linearization contrast
For a temporal operation with an authoritative linearization point, distinguish abort/crash/retry
before and after it. Do not invent the linearization point from convenience.

### Test 70 — Semantic versus operational minimality
The smallest semantic distinction is not a complete remedy unless the executor can obtain it for
every state in the claimed coverage domain.

## Q. Universality and feature preservation

### Test 71 — Domain adapter cannot replace the Pick kernel
Software, migration, audit, causal, or evidence adapters may generate contrasts and metadata but
must classify structural distinctions through `P/I/B/χ` and preserve reconstruction.

### Test 72 — Full established capability retention
Retain every established activation, role, literal-theorem, seam, minimal extension, compilation, freeze,
failure, rebind, telemetry, promotion, and specialized-gate behavior unless an explicit test above
adds a stricter non-conflicting obligation.

## R. Efficiency-preserving activation and execution

### Test 73 — Known structure remains auditable on explicit request
A validated owner normally causes `BYPASS`, but an explicit PickInvariant/invariant-audit request
must still enter non-authoritative `PICK_AUDIT`. Adequate known structure is not a reason to refuse
the requested audit.

### Test 74 — Owner-requested stress test remains auditable
A validated owner may request a representation or seam stress test without declaring itself broken.
Run `PICK_AUDIT`; preserve owner authority and do not mutate or compile.

### Test 75 — Scoped audit plus repair authority
If explicit higher authority requests both audit and repair, a confirmed audit gap may enter
`PICK_DERIVE` only inside the stated repair scope. Do not treat that authorization as global.

### Test 76 — Unknown gap may invoke, but not compile prematurely
A falsifiable `PROCEDURE_GAP` with `suspected_pick_role: UNKNOWN` may invoke derivation. Do not place
a candidate distinction into `DELTA/COMPILE` until contrast or equivalent proof establishes it.

### Test 77 — Compiler and executor remain separated
Rich derivation may use PickInvariant, but the executor receives only compiled applicability,
observable predicates, bounded authorized responses, verification, provenance, and escape rules.
It must not rediscover the representation during execution.

### Test 78 — Prospective action authorization survives optimization
Every nontrivial action must resolve or discriminate a named unresolved condition capable of
changing acceptance. Post-hoc usefulness does not retroactively authorize unrelated work.

### Test 79 — Resolver topology remains reachable by lazy loading
When owner selection, procedure composition, resolver topology, or gap-local compilation is
uncertain, load the architecture/procedure-resolution guidance rather than guessing or narrowing
PickInvariant's jurisdiction.

### Test 80 — Semantic grammar does not force presentation shape
`P/I/B/χ` and the reconstruction obligations constrain reasoning semantics, not the user's requested
output format. Preserve equivalent semantics in the most appropriate presentation.

## S. Standalone and lazy-load integrity

### Test 81 — Standalone package
No instruction may require a prior PickInvariant release. Every referenced `references/`, `integration/`, `templates/`, `examples/`, or `tests/` path needed for v11 behavior must exist in the package.

### Test 82 — Version identity is coherent
The skill metadata, core heading, architecture description, examples, tests, and agent-facing package
identity must not claim a different PickInvariant release when v11 is invoked.

### Test 83 — Efficiency cannot hide a required capability
A rule removed from always-loaded prose is safe only if either the core still states its governing
obligation or an explicit load trigger causes the relevant reference to be read before that rule can
affect audit, derivation, execution, verification, rebinding, or verdict strength.

## T. Audit scope, coverage, and review claims

### Test 84 — Explicit audit depth

An explicit audit must state exactly one of `FOCUSED_AUDIT`, `DELTA_AUDIT`, or `FULL_AUDIT`.
Fail if a focused audit implies whole-artifact cleanliness.

### Test 85 — Coverage map before pinpointing

Fail if an audit identifies a finding before mapping material semantic families as checked, excluded
with reason, or unverified with remaining risk.

### Test 86 — First finding is not the stopping condition

In delta or full mode, one confirmed finding does not end the audit. Continue until all material
families have a disposition or a named oracle blocks progress.

### Test 87 — Confidence and completeness are orthogonal

Require separate `finding_confidence` and `review_completeness` fields. A high-confidence finding
in one seam cannot imply a complete review.

### Test 88 — Current-head reconciliation

For a base-to-head audit, bind base, reviewed head, owner revision, prior/resolved/stale findings,
and current delta before publishing new findings.

### Test 89 — Stale-finding suppression

Classify a candidate as `REPEAT_EXISTING`, `RESOLVED_BY_CURRENT_HEAD`, `NARROWER_REMAINDER`, or
`NEW_FINDING`; only the last two can become new findings.

### Test 90 — Review claim boundary

Every audit declares audited scope, unverified scope, runtime validation, and oracle limitations.
It must not claim global cleanliness unless that claim is explicitly justified.

## U. Software temporal and state-machine coverage

### Test 91 — Standard asynchronous probes

When relevant, test listener ordering, default prevention/propagation, repeated trusted events,
duplicate in-flight requests, late results, stale overwrites, detached nodes, and retry after failure.

### Test 92 — State-machine completeness

For pending/resolved/timeout/error-like states, check each relevant trigger, next state, observable
UI, allowed actions, duplicate-action behavior, and late-result behavior.

### Test 93 — Request coalescing

When retries, observers, listeners, or async checks exist, test duplicate observation, concurrent
requests, out-of-order results, and identity/generation guards.

### Test 94 — Do not force χ

Concurrency or multiple callbacks remain `B` when one typed or temporal boundary reconstructs D.
Promote to `χ` only for residual non-local structure that changes D.

## V. Decision-first evidence and output separation

### Test 95 — Decision-first contrast

Before assigning a Pick role, state D, two states, required decisions, observable difference, and
current behavior. Reject label-first role assignment.

### Test 96 — Evidence tiers

Distinguish `SOURCE_DETERMINISTIC`, `STATIC_WITH_SPEC_ASSUMPTION`, `FIXTURE_EXECUTED`,
`BROWSER_RUNTIME`, and `EXTERNAL_INTEGRATION`; do not upgrade source proof into runtime frequency.

### Test 97 — Internal verdict versus external comment

Keep the internal certificate separate from an outward-facing review comment. The latter contains
witness, consequence, exact location, smallest fix, and validation limitation.

### Test 98 — Post-write verification

After an authorized external review action, verify target revision, comment body, author/account,
and destination URL. This verification does not authorize the action itself.

### Test 99 — Full legacy feature retention

All prior activation, role, theorem, seam, contrast, information-loss, derivation, compiler,
executor, failure, rebinding, telemetry, promotion, specialized-gate, and standalone behaviors
remain available in v11.


## W. Exploration and commitment firewall

### Test 100 — Explicit exploration is not audit
An explicit request to explore alternative models enters `PICK_EXPLORE`, not `PICK_AUDIT`, unless
the user also requests an invariant verdict over a declared scope. Exploration cannot emit
`NO_GAP_FOUND` or a coverage claim.

### Test 101 — Exploration preserves mature owner authority
When a mature owner already returns a native verdict, explicit exploration may generate alternatives
but must preserve the owner result and may not install a second operative decision procedure.

### Test 102 — Ontology switching is allowed in exploration
`PICK_EXPLORE` may move among graph, causal, information, optimization, temporal, or other useful
frames without first translating every hypothesis into `P/I/B/χ`.

### Test 103 — Multiple competing hypotheses may coexist
Fail if exploration prematurely chooses one hypothesis solely to simplify reasoning when available
evidence does not distinguish it from viable alternatives.

### Test 104 — Target reframing remains a proposal
Exploration may propose a reframing, but the original target and authority remain visible until the
user/owner explicitly adopts the new target.

### Test 105 — Exploration cannot mutate or compile
No exploration result may authorize an artifact mutation, compile `Δ`, rebind an owner, or install
procedure authority.

### Test 106 — Exploration-to-audit handoff is falsifiable
Before a hypothesis enters `PICK_AUDIT`, bind an exact target, domain, oracle/evidence basis, and a
decision-first contrast or falsifiable unresolved question.

### Test 107 — Exploration-to-derive handoff preserves authority
A handoff into `PICK_DERIVE` still requires `NO_OWNER` or an adopted `PROCEDURE_GAP`; conceptual
plausibility alone is insufficient.

### Test 108 — Exploration has a stop rule
Stop when requested breadth is satisfied, viable hypotheses are separated as far as evidence allows,
or a named missing observation blocks further discrimination. Generic curiosity is not a reason to
continue indefinitely.

## X. Adaptive rigor and fast-path parity

### Test 109 — Direct owner remains cheapest
A known mature-owner task with no explicit exploration/audit request must use `DIRECT` owner
execution and must not instantiate Pick roles or coverage maps.

### Test 110 — Obvious seam uses FAST_DELTA
For an adopted gap whose only missing distinction is a directly evidenced unit/schema/version or
other typed seam, compile `owner + Δ` without mandatory full `P/I/B/χ` decomposition.

### Test 111 — FAST_DELTA keeps minimum obligations
Even the fast path must bind applicability, target, evidence/oracle, verification, escape, and
preserved owner scope. Speed cannot erase safety.

### Test 112 — Fast path escalates on failed contrast
If a candidate fast delta still collapses admissible states requiring different decisions, escalate
to `STRUCTURAL`; do not stack speculative patches.

### Test 113 — Unknown role forces structural discovery
If the adopted gap is falsifiable but its missing role is `UNKNOWN`, do not compile a guessed fast
delta. Use structural reasoning until evidence establishes the distinction.

### Test 114 — Topology remains residual
A complicated implementation with one sufficient typed boundary remains a fast/direct seam case. Do
not escalate to `χ` or structural depth merely because several callbacks or components exist.

### Test 115 — Coverage is orthogonal to derivation
A normal derivation must not run `SURVEY -> MAP` across unrelated semantic families unless the user
also requested a coverage-bearing audit.

### Test 116 — Full audit still retains v7 coverage
`DELTA_AUDIT` and `FULL_AUDIT` keep semantic coverage mapping, first-finding continuation, revision
reconciliation, and claim boundaries even when individual findings are simple fast deltas.

### Test 117 — Anti-ceremony grammar
`P/I/B/χ` constrains semantics but need not appear in the user-facing answer or be enumerated when a
direct owner or fast delta already decides the target.

### Test 118 — De-escalation after structural discovery
If structural exploration proves that one boundary distinction alone reconstructs D, compile only
that minimal boundary delta rather than preserving unnecessary structural machinery.

## Y. No-drawback regression guards

### Test 119 — Owner parity
No routine ClarityGate-, ConvergenceGate-, or other mature-owner scenario may gain mandatory
PickInvariant overhead relative to direct owner execution.

### Test 120 — Exploration parity
Explicit open-ended exploration must permit conceptual frame changes and competing hypotheses at
least as freely as the v1 reasoning philosophy, while preserving the inherited commitment firewall.

### Test 121 — Fast-path parity
An obvious one-dimensional certified gap must not require more structural work than the v4
`owner + smallest Δ` pattern.

### Test 122 — Structural/evidence/audit parity
All v5 reconstruction/topology, v6.x evidence/oracle/history/temporal, and v7 audit coverage/revision
capabilities remain available when their triggers are reached.

### Test 123 — Claim monotonicity
A broader or stronger claim cannot be produced from weaker authority, evidence, or coverage than a
narrower claim. Exploration volume does not count as evidence.

### Test 124 — Graceful degradation
If a mandatory reference, oracle, runtime, or version artifact is unavailable, narrow/downgrade the
result or return insufficient evidence. Do not silently approximate away the missing safeguard.

### Test 125 — Cost monotonicity
Every new safeguard has an explicit activation trigger and stopping condition. Fail if an unrelated
routine task pays for exploration, full reconstruction, or full audit coverage by default.

### Test 126 — Simulation regression gate
The release evaluation must report zero critical authority/safety regressions versus v7 on the
certified design-level scenario suite and must separately disclose any cost or capability tradeoff.


## Z. Mixed-mode ambiguity and reversible depth

### Test 127 — One mode per phase
A mixed request may sequence exploration, audit, and derivation, but each phase must bind a separate
mode/authority receipt. Never blend `PICK_EXPLORE` and `PICK_DERIVE` authority.

### Test 128 — Audit intent outranks exploratory phrasing for verdict-bearing review
If the user asks to audit/review a declared scope and also says “explore possible issues,” use
`PICK_AUDIT` for the verdict-bearing phase. Hypothesis generation inside the audit does not convert
it into `PICK_EXPLORE`.

### Test 129 — Explore-then-audit requires handoff
If the user explicitly asks to explore alternatives and then audit the strongest candidate, close the
exploration receipt and bind a new audit receipt with exact target/oracle/coverage before any verdict.

### Test 130 — Audit-and-repair remains two authorities
An audit-plus-repair request cannot authorize mutation before a confirmed/adopted gap. Repair begins
under a separately named derivation/repair scope and preserves the audit record.

### Test 131 — Pareto guards remain release-only lazy doctrine
The always-loaded `SKILL.md` must not contain the detailed **No-drawback Pareto guards** section or
inline owner/exploration/fast-path/structural/audit parity checklist. Those release-regression rules
remain in `references/no_drawback_contract.md` and `eval/` and are loaded only for skill evolution,
release evaluation, or explicit regression analysis. Runtime tasks must not pay this doctrine cost.

## AA. v9 authority, roles, observability, and minimality

### Test 132 — Exploratory evidence is not audit authority
In `PICK_EXPLORE`, a strong contrast may reach `HANDOFF_READY`, but cannot emit an information-loss
certificate, `CONFIRMED_GAP`, `NO_GAP_FOUND`, `UNDER-SPECIFIED`, or any whole-scope verdict.

### Test 133 — Collapsed-contrast handoff is phase-separated
For any calibration case where the same coarse description has different target decisions, retain a
contrast witness and open a new audit receipt before using a certificate or verdict vocabulary.

### Test 134 — P and B have disjoint primary roles
`P` identifies which sampling semantics or authority governs. `B` identifies the producer/consumer
transport relation, such as `μ = F_*ν`. Do not duplicate the transport relation in `P` merely because
the producer protocol is part of the model.

### Test 135 — Observability is explicit
Every decision-relevant distinction is marked `AVAILABLE_NOW`, `PROSPECTIVE_ONLY`, or
`ERASED_UNRECOVERABLE`. A realized output cannot retrospectively reveal erased sampling history or
measure.

### Test 136 — Safe escape for erased probability semantics
When an underspecified sampling description omits its measure, request or declare the protocol,
narrow the target, or return insufficient evidence. Do not guess a unique distribution from symmetry
alone.

### Test 137 — Escalation receipt names the decision effect
Every `DIRECT`/`FAST_DELTA` to `STRUCTURAL` escalation records the triggering contrast or uncertainty
and what structural depth can decide that shallower depth cannot.

### Test 138 — Famous or difficult topics are not escalation triggers
Topic reputation or philosophical appearance alone does not justify `STRUCTURAL`; a target-bound
same-coarse-representation/different-decision witness or named uncertainty does.

### Test 139 — Sufficiency precedes minimality
Structural work first proves `R_P(x1) = R_P(x2) => D(x1) = D(x2)`, then tests removal of each claimed
dimension against a contrast suite.

### Test 140 — Minimality claim is bounded
Call a fixed-target distributional compression sufficient or valid compression unless removal
evidence supports the narrower target-relative `MINIMAL` claim. Do not treat an answer scalar as
automatically operationally meaningful minimal structure.

### Test 141 — χ remains residual
For any target where local semantics plus direct measure/transport reconstructs the decision, `χ`
remains empty. Add `χ` only after a residual non-local contrast changes `D`.

### Test 142 — Certificate phase is explicit
Information-loss and contrast certificates record `PICK_AUDIT` or `PICK_DERIVE` phase, target,
authority, oracle/evidence basis, and observability status.

### Test 143 — Release score matrix is recomputable
The release evaluation stores raw fixture/candidate scores, capability weights, fixture/version identity, seed, validation tier, Pareto rule, and generated matrices so another run can recompute the result.

### Test 144 — v9 safeguards transfer across domains
The phase firewall, role exclusivity, observability ledger, escalation receipt, and bounded minimality
rules apply to software, research, data, operational, and artifact decisions; no single worked
example is a prerequisite.

### Test 145 — Phase transitions are explicit
An exploratory receipt is closed before a new audit or derivation receipt is opened, and the new
receipt restates target, authority, domain, oracle, and allowed/forbidden outputs.

### Test 146 — Primary role is exclusive at commitment time
A distinction with downstream effects may record dependency metadata, but its committed primary role
is one of `P`, `I`, `B`, or `CHI` unless irreducible interaction is proven by an admissible contrast.

### Test 147 — Observation failure is not latent structure
Unavailable or conflicted observation produces `UNKNOWN`, `INSUFFICIENT_EVIDENCE`, or an explicit
escape condition. It does not silently become a guessed `χ` or invented precision.

### Test 148 — Minimality is scoped and recomputable
Every `MINIMAL` claim names its certified domain, oracle, contrast identifiers, observation window,
and dropped-dimension results. Otherwise the claim is `SUFFICIENT`, `VALID_COMPRESSION`, or `UNKNOWN`.

### Test 149 — No target-specific loading requirement
The core v9 kernel can enforce these safeguards for an unseen domain without loading any worked
example; domain examples are calibration evidence, not hidden prerequisites.

### Test 150 — De-escalation is evidenced
When structural analysis reduces to a sufficient boundary relation, the receipt records the
reconstruction evidence and removes unused structural machinery before compilation.

### Test 151 — Investigation is not compilation
An incomplete, unknown-role, or non-adopted procedure gap may be investigated, but cannot compile,
mutate, rebind, or authorize action until a complete adopted gap is recorded under `COMPILE`.

### Test 152 — Exploration has a finite budget
Every exploration receipt records a finite budget and a stop reason. “Explore broadly” does not
permit unbounded hypothesis generation.

### Test 153 — Fast delta proves observability and feasibility
`FAST_DELTA` names the decision-time observable, historical/closure window, operational feasibility,
negative or near-miss contrast, and escape condition before claiming a minimal delta.

### Test 154 — Role serialization round-trips
Machine-readable `CHI` and displayed `χ` normalize to one canonical role and do not create separate
semantic branches.

### Test 155 — Audit packet is complete enough for its claim
Missing oracle, revision, coverage, observability, or exclusion fields downgrade the audit to
`PARTIAL`/`INSUFFICIENT_EVIDENCE`; they cannot support a broad clean verdict.

## AB. v10/v10.1 probability and stochastic semantics

### Test 156 — Probability trigger is explicit and bounded
Random, uniform, sample, probability, distribution, Monte Carlo, conditioning, rejection, nonlinear
transform, many-to-one map, projection, or quotient language triggers the bounded probability check.
It does not force full structural analysis for an unrelated deterministic task.

### Test 157 — Uniformity requires a reference measure
No output may use bare `UNIFORM`. It must state the object space, reference measure, density or
equivalent law, coordinate chart, coordinate-change check, and normalization.

### Test 158 — Object representation is not a probability law
Choosing coordinates or reducing variable count does not imply that those coordinates are uniformly
distributed. The object representation and probability law are recorded separately.

### Test 159 — P.measure is complete for stochastic claims
For a probabilistic target, `P.measure` binds sample space, event structure, quotient/equivalence,
reference measure, probability law, normalization, independence/joint law, conditioning, symmetry
basis, authority, and scope—or records a safe missing-specification escape.

### Test 160 — Quotient before weighting
When multiple raw coordinate tuples represent one object, establish the equivalence relation and
quotient/multiplicity before assigning probability weights.

### Test 161 — Pushforward is explicit
For producer-to-consumer sampling, `B.transport` records `F` and `μ = F_*ν`, not merely the source
random variables and target geometry.

### Test 162 — Many-to-one maps audit fibers
Nonlinear, many-to-one, projected, or quotient maps require fiber multiplicity or an explicit reason
it is irrelevant to the requested target.

### Test 163 — Change of variables is not optional
When a density changes under a nonlinear map, record the Jacobian/change-of-variables basis or
return insufficient evidence. A uniform source law does not imply a uniform pushforward law.

### Test 164 — Conditioning changes the model
Rejection/redraw and mathematical conditioning record the condition and renormalization. They cannot
be silently treated as harmless implementation details.

### Test 165 — Numerical guards stay separate
A floating-point degeneracy guard is labeled separately from a mathematical condition and cannot
alter the stated probability model without an explicit scope decision.

### Test 166 — Canonicality needs symmetry plus uniqueness
`CANONICAL_RELATIVE_TO(G)` requires an explicit group action, invariance, uniqueness up to scale, and
normalization. Rotation/symmetry alone is insufficient.

### Test 167 — Minimality does not imply canonicality
A direct, low-dimensional, or target-sufficient representation cannot by itself justify a canonical
probability law.

### Test 168 — Distributional sufficiency is distinct
`DECISION_SUFFICIENT` may reconstruct one requested event. `DISTRIBUTION_SUFFICIENT` additionally
reconstructs the requested law or named stochastic observables.

### Test 169 — One-event agreement is not law agreement
Two admissible laws that agree on one event but differ on another requested observable must not be
reported as distributionally sufficient.

### Test 170 — Semantic underdetermination is named
If the specification permits multiple admissible probability laws, report
`UNDERDETERMINED_BY_SPECIFICATION` or `MULTIPLE_ADMISSIBLE_MEASURES`, not guessed uniqueness,
`UNKNOWN`, or an invented procedure gap.

### Test 171 — Missing measure is an authority-sensitive escape
An exploratory hypothesis may list candidate measures. A certificate or canonicality claim requires
a separately bound audit/derivation phase with measure authority and evidence.

### Test 172 — Probability protocol transfers across domains
The same checks apply to randomized software, scientific sampling, data pipelines, simulations,
Monte Carlo estimators, randomized UI behavior, and operational decisions.

### Test 173 — Probability trigger preserves anti-ceremony
Once the measure/transport question is resolved and no residual issue remains, de-escalate; do not
enumerate unrelated `P/I/B/χ` or probability fields.

### Test 174 — Score matrix covers stochastic failure families
The generic evaluation includes uniformity, transport/fibers, conditioning/guards, canonicality,
quotient multiplicity, distributional sufficiency, and underdetermination cases alongside legacy
non-probability scenarios.

### Test 175 — v10.1 Pareto gate protects stochastic behavior
No candidate may trade away uniformity binding, transport correctness, conditioning discipline,
canonicality claim limits, or distributional sufficiency merely to reduce cost; the local Pareto
stop reports any such regression.

## AC. Inherited v10.1 probability lazy-loading safeguards

### Test 176 — Probability doctrine is lazy, not deleted
The always-loaded core retains the materiality trigger and mandatory load firewall, while detailed
reference-measure, pushforward/fiber/Jacobian, conditioning, canonicality, quotient, and
distributional-sufficiency rules remain in `references/probability_semantics.md`.

### Test 177 — Stochastic vocabulary alone does not activate the protocol
A task mentioning `random` or `sample` does not activate the probability protocol when the realized
value is already authoritative and the stochastic law cannot change the requested target.

### Test 178 — Material stochastic semantics force the reference load
If the requested decision can change with the sampling law, reference measure, conditioning,
quotient weighting, or stochastic transport, `PROBABILITY_MEASURE_TRIGGER` requires loading
`references/probability_semantics.md` before any corresponding law-level claim.

### Test 179 — Missing probability reference causes claim downgrade
If the trigger fires but `references/probability_semantics.md` cannot be loaded, narrow the target or
return a weaker/insufficient conclusion. Do not silently substitute an implicit probability law.

### Test 180 — Mature deterministic owner retains direct parity
A mature deterministic owner task that contains incidental stochastic language still uses `DIRECT`
and does not pay for the probability reference unless law semantics can change the target.

### Test 181 — Heavy probability vocabulary stays out of the kernel
The always-loaded `SKILL.md` does not embed the detailed Jacobian/fiber, canonicality-certificate,
distributional-sufficiency, or semantic-underdetermination doctrine; those remain progressively
loaded.

### Test 182 — Probability reference retains v10 semantic completeness
The probability reference still covers reference measures, object/law separation, quotient
multiplicity, pushforward transport, fibers/Jacobians, conditioning/renormalization, numerical guard
separation, symmetry/uniqueness, canonicality limits, decision/distribution sufficiency, and
specification underdetermination.

### Test 183 — Historical v10.1 context baseline remains recorded
The evaluation retains the measured v10.1 core baseline (951 whitespace words) for comparison. v11 is not required to stay below it; context size is a transparent best-effort soft metric.

### Test 184 — Parent capability is not artificially discounted
The v10.1 parent profile remains explicit in the v11 T1 design proxy. v11 improvements come from declared capability/fixture differences and targeted cost assumptions, not deleting parent safeguards from the comparison.

### Test 185 — Context-cost report is recomputable
`eval/context_cost.py` reports the actual v11 core word count, the v10.1 parent baseline, specialist-reference word counts, triggered-path proxies, and the all-specialist-always-on control proxy.

## AD. v11 decision-preserving quotient safeguards

### Test 186 — Pick remains the dominant structural grammar
Structural commitment first classifies candidate distinctions by `P/I/B/CHI`; the decision-quotient
criterion governs retention but does not erase Pick's applicability/interior/boundary/non-local roles.

### Test 187 — Role classification does not imply retention
A valid `B` or `CHI` distinction that cannot alter the certified target is removed after merge/removal
testing rather than retained for ontology completeness.

### Test 188 — Safe merge is target-relative
Two raw states may share one compiled representation only when no admissible target-relevant
discriminator in the certified class can require different decisions.

### Test 189 — Unsafe merge is a representation failure
If two merged states require different decisions, the representation is refined; the decision rule is
not merely patched around the witness.

### Test 190 — Discriminator class is bounded
`Q_D` excludes impossible, out-of-authority, unobservable, or target-irrelevant distinctions from
blocking useful compression.

### Test 191 — Continuation-sensitive equivalence is triggered, not universal
When future admissible continuations can change `D`, equal snapshots are challenged by continuation.
A one-step target does not pay for state-machine equivalence analysis.

### Test 192 — Minimality includes merge tests
`MINIMAL` requires both deletion and class-merge challenges where applicable; deletion-only success
cannot prove that an unnecessarily fine partition is minimal.

### Test 193 — Minimality remains scoped
A minimal quotient is relative to target, domain, discriminator class, and evidence. It does not imply
canonicality or minimality for unrelated future decisions.

## AE. v11 stochastic information safeguards

### Test 194 — Observation channels are not coordinates
For stochastic decisions, two equal-dimensional observations are not presumed equally informative.
Decision-equivalence/dominance requires a justified channel or decision-class relation.

### Test 195 — Blackwell-style dominance is target-sensitive
A channel may dominate another for the bound decision class without being declared identical in full
distribution or raw information.

### Test 196 — Incomparable stochastic information is allowed
If each observation preserves a different acceptance-changing distinction, report
`INCOMPARABLE_INFORMATION` rather than forcing a total order.

### Test 197 — Approximate sufficiency needs authorized tolerance
`EPSILON_DECISION_SUFFICIENT` is unavailable unless an authority supplies epsilon and a loss/regret or
risk basis.

### Test 198 — No invented loss function
The skill does not fabricate priors, utilities, regret weights, or epsilon to make stochastic
sufficiency numerically convenient.

### Test 199 — Decision and distribution sufficiency remain distinct
The new information-channel doctrine does not weaken v10's `DECISION_SUFFICIENT` versus
`DISTRIBUTION_SUFFICIENT` distinction.

## AF. v11 composition and literal-extension safeguards

### Test 200 — Pick decomposition does not imply additivity
A `P/I/B/CHI` decomposition cannot be summed or combined by inclusion/exclusion unless the composition
law is independently licensed.

### Test 201 — Valuation composition is conditional
Overlapping pieces use a valuation-style rule only after domain/operation assumptions support the
required identity.

### Test 202 — Order-sensitive composition stays nonvaluative
If sequence changes the global result, classify the composition as order-sensitive rather than
forcing an additive valuation.

### Test 203 — Pairwise success can fail globally
All local facts and pairwise seams may pass while a cycle, overlap, or gluing obstruction changes the
global decision; the local owners remain valid.

### Test 204 — Sheaf-style machinery is specialized
Local/global obstruction reasoning is activated only when pairwise/local compatibility cannot decide
global existence/consistency; ordinary seams do not pay this tax.

### Test 205 — Ehrhart extension is literal-domain guarded
Ehrhart-style reasoning requires a genuine lattice-polytope counting/dilation setting (or separately
established theorem assumptions); generic process scaling remains `PICK_STRUCTURAL`.

## AG. v11 observation and refinement safeguards

### Test 206 — Cheapest separating observation wins
When several reachable observations can distinguish the same acceptance-changing alternatives, prefer
the least costly/risky sufficient observation.

### Test 207 — Information volume is not value of information
A richer or higher-dimensional observation is not preferred when a cheaper observation is equally
capable of deciding the target.

### Test 208 — VOI may remain ordinal
Without legitimate priors/utilities, rank observations qualitatively by reachability, cost, and target
discrimination rather than inventing expected numeric value.

### Test 209 — Counterexamples are validated against raw semantics
A failed abstract contrast is classified `REAL | SPURIOUS | UNKNOWN` before it is used to rebind a
procedure or refine the representation.

### Test 210 — Spurious counterexample refines abstraction only
When the raw semantics cannot realize the apparent failure, do not report an operative procedure gap;
add only the smallest distinction needed to eliminate the abstraction artifact.

### Test 211 — Real counterexample remains gap evidence
A realizable acceptance-changing witness is not dismissed as abstraction noise merely because a
refinement could encode it.

### Test 212 — Refinement is witness-bounded
CEGAR-style refinement adds only distinctions supported by the failed contrast and reruns the failed
contrast plus relevant regressions; it does not trigger unbounded ontology growth.

## AH. v11 probability-specialized safeguards

### Test 213 — Null-event conditioning triggers explicit semantics
Conditioning on a null/measure-zero event requires a regular-conditional, disintegration, explicit
limiting, or other authorized conditioning construction.

### Test 214 — Parameterization-sensitive conditioning can be underdetermined
If different admissible limiting/conditioning constructions yield different answers, report semantic
underdetermination instead of silently choosing coordinates.

### Test 215 — Ordinary conditioning avoids Borel ceremony
Positive-probability conditioning does not activate the null-event gate merely because conditional
probability is mentioned.

### Test 216 — Haar-style canonicality is relative
Invariant-measure reasoning based on a transformation group supports at most a justified
`CANONICAL_RELATIVE_TO(G)` claim unless stronger authority exists.

### Test 217 — Symmetry safeguards from v10 remain intact
The Haar-style extension does not weaken the existing requirements for explicit group action,
invariance, uniqueness where required, and normalization.

## AI. v11 prompt and presentation safeguards

### Test 218 — Theorem stack is internal by default
Routine user-facing answers do not print theorem names, `P/I/B/CHI`, quotient classes, receipts, or
certificates merely to demonstrate internal reasoning.

### Test 219 — Native-domain explanation is preferred
After internal structural reasoning identifies the decisive distinction, the final explanation uses
the task's native language unless theorem terminology itself is requested or clarifying.

### Test 220 — Principle wording beats theorem worship in embedded prompts
Operational prompts state obligations such as preserving decision-relevant distinctions or specifying
sampling laws; they do not require named theorem invocation where the principle is sufficient.

### Test 221 — Architecture requests may expose compact mappings
When the user asks how PickInvariant works, a compact Pick/Nerode/Bertrand/Blackwell/valuation/VOI/
CEGAR mapping is allowed, but it is not represented as an always-on execution trace.

### Test 222 — Ambiguity is preserved only when material
Multiple target/law/loss/authority readings are surfaced when they can change the answer; irrelevant
ambiguity does not force clarification ceremony.

## AJ. v11 Pareto and release safeguards

### Test 223 — v11 exact behavioral Pareto proof is recomputable
`eval/simulate.py` evaluates all 29 inherited fixtures plus v11 extension fixtures and verifies
elementwise non-regression in protected capabilities, fixture quality, synthetic fixture cost, and
maintainability, with at least one strict improvement over v10.1.

### Test 224 — Context cost is a transparent soft metric
The release reports the larger v11 kernel and triggered-path word proxies without claiming token or
latency savings; specialist doctrine remains lazy-loaded best-effort.

### Test 225 — Dominant theorem is evaluated, not assumed
The architectural neighborhood includes a Nerode-dominant variant and perturbation analysis. Pick may
remain dominant because of structural-control coherence only when it remains competitive and is not
strictly dominated on the protected matrix.


## AK. v11.1 hard-Pareto compression safeguards

### Test 226 — v11.1 compression cannot buy behavioral score
The v11.1 evaluation inherits v11.0 protected capability scores, fixture quality, synthetic execution
cost, and maintainability without assigning a bonus for shorter wording.

### Test 227 — Exact activation equivalence is a hard gate
Every declared v11.1 case must match the frozen v11.0 mode, depth, protected trigger vector, and
lazy-reference set exactly; any drift blocks release.

### Test 228 — Activation suite covers both sides of every gate
Each protected trigger has at least one firing and one non-firing case, preventing a trivial
always-on/always-off implementation from passing.

### Test 229 — Activation suite detects gate mutations
Deliberately flipping any protected mode/depth/trigger/reference field causes at least one activation
case to fail.

### Test 230 — Probability materiality boundary is unchanged
Incidental stochastic vocabulary remains non-triggering; material law/sampling/conditioning/channel
semantics still activate `PROBABILITY_MEASURE_TRIGGER` and the probability reference.

### Test 231 — Quotient boundary is unchanged
Raw difference alone does not load quotient doctrine; merge, continuation/channel equivalence, or a
material `MINIMAL` claim still does.

### Test 232 — Composition boundary is unchanged
Ordinary local seams do not activate composition doctrine; overlapping/repeated/global composition
still activates `COMPOSITION_TRIGGER` without changing authority mode by itself.

### Test 233 — Nested specialist gates remain nested
Null-conditioning and symmetry/invariant-measure gates require the material probability gate;
local/global obstruction requires material composition. Ehrhart remains literal-domain guarded.

### Test 234 — Coverage remains an audit breadth obligation
`FOCUSED_AUDIT` does not pay the coverage tax; `DELTA_AUDIT` and `FULL_AUDIT` do.

### Test 235 — Authority and depth routing are unchanged
Known owners still bypass by default, explicit explore/audit still override bypass, adopted/no-owner
gaps still permit derivation, and a structural witness still defeats `FAST_DELTA` eligibility.

### Test 236 — Prompt behavior is byte-identical
`agents/openai.yaml` and `references/prompt_and_presentation.md` match the released v11.0 bytes; kernel
compression cannot silently change embedded-prompt or presentation policy.

### Test 237 — Behavioral lazy references are unchanged
All non-release-evaluation behavioral references, integrations, templates, and worked examples remain
byte-identical to v11.0.

### Test 238 — Always-loaded context strictly decreases
`SKILL.md` must be strictly smaller than the released v11.0 kernel under whitespace-word, Unicode-
character, and UTF-8-byte proxies.

### Test 239 — Every declared activated path is no larger
Given exact lazy-reference equivalence, every declared v11.1 path must have a context proxy no larger
than its v11.0 counterpart; the strict kernel reduction supplies the strict Pareto dimension.

### Test 240 — v11.1 hard Pareto gate is recomputable
The release passes only when behavior, synthetic cost, maintainability, activation equivalence, and
context-path checks all pass simultaneously, with a strict context improvement. The claim remains a
bounded T1 design proxy rather than an exact tokenizer/latency or universal-model theorem.
