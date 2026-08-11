# Worked Examples — PickInvariant v9

These illustrate the architecture, not mandatory output formats.

## Example 1 — Routine representation audit bypasses PickInvariant

A team asks whether five themes can safely support a roadmap decision. ClarityGate is the
validated owner and can express the relevant omission/transport/seam failures.

```text
resolver -> ClarityGate -> native verdict
```

No `P/I/B/χ` rediscovery is needed.

## Example 2 — Cross-service deployment consistency is a boundary delta

Service A and Service B each satisfy their local completion contracts, but deployment is
unsafe unless both committed the same transaction epoch.

Pick representation:

```text
P: deployment spans both ledger services and both epoch reads are authoritative
I: A locally complete; B locally complete
B: epoch_A = epoch_B
χ: none required for this decision
```

Reconstruction:

```text
may_stop = P AND I_A AND I_B AND (epoch_A = epoch_B)
```

The missing distinction is `B`, not a new distributed-completion ontology.

## Example 3 — Caveat crossing from trust into convergence is a boundary object

ClarityGate returns `TRUST_WITH_CAVEAT(C)`. ConvergenceGate wants to use the summary to
decide whether another code mutation is justified.

```text
I: native ClarityGate verdict = TRUST_WITH_CAVEAT(C)
B: can C alter any ConvergenceGate completion condition?
```

If no, consume while preserving caveat provenance. If yes, repair representation/evidence
first. PickInvariant compiles the seam only.

## Example 4 — Feedback cycle reveals a topology delta

A workflow was compiled for linear stages `A -> B -> C`. An observed run returns from `C`
to `B`, and termination depends on retry policy.

Suppose local stage facts and pairwise handoffs are identical between two runs, but one graph
contains a retry cycle and the other does not. Required termination decisions differ.

```text
same P
same I
same pairwise B
χ differs: retry cycle / retry policy semantics
```

The collapsed contrast proves `χ` is required.

## Example 5 — Omitted region as structural correction

A portfolio decision aggregates all represented segments correctly, and each segment's local
metrics are valid. One strategic segment is absent from the representation entirely.

If the certified domain claims complete portfolio coverage, the missing component is a
`χ`-style hole in coverage. If the domain explicitly excludes that segment, the issue is
instead `P` applicability/scope. Role classification depends on the declared domain.

## Example 6 — Contrast rejects a fake boundary rule

Candidate extension:

```text
"matching schema names are enough to compose two procedure outputs"
```

Contrast pair:

- `x-`: same schema names, same units, same authority, same epoch;
- `x+`: same schema names but one value is milliseconds and the other seconds.

The candidate `B` representation collapses the pair while the safe decision differs. Add
unit semantics; do not invent a broad new procedure.

## Example 7 — Applicability failure is not contract failure

A compiled procedure requires evidence newer than 15 minutes. The only available snapshot is
one day old.

```text
P: freshness precondition fails
```

Do not conclude the interior, boundary, or topology rules are wrong. Acquire fresh evidence
if authorized or follow the escape condition.

## Example 8 — Verifier failure does not trigger rebinding

A compiled migration procedure requires:

```text
source_count = migrated_count + documented_exclusions
```

The checker reads yesterday's snapshot. This is verifier failure. Repair measurement. The
representation is not recompiled unless a real collapsed contrast appears.

## Example 9 — Executor handoff

PickInvariant compiles:

```text
P: deployment spans both ledger services; authoritative committed-epoch reads available
I: local completion A; local completion B
B: epoch_A = epoch_B
χ: none
Decision: STOP iff P and both I facts and B equality hold
Mismatch action: reconcile epoch only
Verification: reread committed epochs from authoritative stores
Escape: authority conflict over governing epoch
```

A smaller executor can now run the artifact without structural rediscovery.

## Example 10 — Compression is valid

Two deployments differ in dozens of irrelevant log lines, hostnames, and timing details, but
share the same certified `P/I/B/χ` representation and require the same stop decision.

Mapping them to one representation is desirable compression, not information loss.

## Example 11 — Literal Pick mode

For a verified simple lattice polygon, use the actual theorem:

```text
A = I + B/2 - 1
```

Here `I` and `B` are literal lattice-point counts. Do not reuse the `1/2` coefficient in a
software workflow simply because the structural mode also uses the labels `I` and `B`.

## Example 12 — Promotion

The cross-service epoch boundary recurs across deployments, with stable applicability,
explicit escape conditions, strong positive/negative contrasts, and regression behavior.
Promote it into a specialized deployment-consistency procedure. Future matching work bypasses
PickInvariant.

## Example 13 — Explicit audit preserves owner authority

A validated release procedure says a change passes. The user explicitly asks PickInvariant to
stress-test its representation.

```text
mode: PICK_AUDIT
owner: release procedure
target: whether the stated pass preserves the published contract
```

Run `DOMAIN -> P/I/B/χ -> RECONSTRUCT -> CONTRAST`. If no collapse is found, report
`NO_GAP_FOUND` for the inspected domain. Do not compile a replacement release gate. If a certified
collapse appears, draft `CONFIRMED_GAP` evidence and return it to the owner. Enter derivation only
if the owner or higher explicit authority adopts/emits the complete certificate; retain all
unaffected owner semantics.

## Example 14 — External compatibility oracle remains unknown

A local URL parser treats both an empty string and whitespace as the current page. The target is
compatibility with an external implementation whose whitespace behavior is unavailable.

```text
x-: ""
x+: " "
local transformation: same target
external required decision: UNKNOWN for x+
```

Record the contrast as `UNRESOLVED`. Do not infer compatibility or emit unconditional pass/fail.

## Example 15 — History erases a boundary distinction

One JSON object may mean a legacy full snapshot or a current sparse override. Both histories are
reachable and produce the same stored value, but upgrading defaults requires different results.

```text
P: both storage generations are admitted
I: current default and stored JSON are locally observable
B: producer generation/lineage was erased at the storage boundary
χ: none required
```

The current observables cannot reconstruct the decision. Emit an information-loss certificate.
Tag future data prospectively; require historical evidence or a conservative escape for old data.

## Example 16 — Final values hide a causal trace difference

A refactor moves UI construction into an eagerly evaluated argument that runs before an existing
disable guard. Final local variables match, but observable traces differ:

```text
before(disabled): []
after(disabled):  [append panel]
```

Use a projected trace as contrast evidence. Classify the moved guard/side-effect relation in the
narrowest `I/B/χ` role supported by the ownership and execution structure; do not create a new
structural role for “causal.”

## Example 17 — Decompose targets before topology

A proposal bundles three independent fixes. Define `D1`, `D2`, and `D3` separately and then the
container disposition. The number of fixes is not `χ`. Add topology only if an interaction such
as ordering, shared ownership, or a cycle changes the combined decision.

## Example 18 — Negative claim needs direct or causal evidence

A test observes `onerror` before `onload`, but the claim is “no request is initiated.” The callback
order does not exclude a request.

```text
sufficient evidence options:
- request spy remains zero through the closure window; or
- control-flow proof shows dispatch is unreachable
```

Until then, qualify the negative invariant even if the error behavior itself is verified.


## Example 19 — Explore freely without changing the operative verdict

ConvergenceGate returns `STOP` for a completed local coding task. The user asks: “Explore whether a
global coordination model could reveal a class of failures we have not considered; do not change
anything.”

```text
mode: PICK_EXPLORE
owner_result: ConvergenceGate = STOP
frames tried:
- dependency graph / cycle
- stale-generation causal trace
- shared-resource conservation

result:
- two hypotheses rejected by current observations
- one topology hypothesis remains DORMANT pending cross-service trace data
- operative verdict remains STOP
```

No audit cleanliness claim and no mutation authority are created.

## Example 20 — Fast delta avoids ceremonial structural decomposition

A validated consumer interprets producer latency as seconds while the producer contract guarantees
milliseconds. The owner adopts the procedure gap and the oracle establishes the units.

```text
mode: PICK_DERIVE
depth: FAST_DELTA
Δ: convert milliseconds to seconds at the typed seam
verification: producer 1500 ms -> consumer 1.5 s
escape: unknown/missing unit metadata
```

Do not invent `χ` or enumerate empty interior/topology fields.

## Example 21 — Fast delta fails and escalates structurally

Two services appear to need only `epoch_A == epoch_B`. A contrast shows equal service epochs but a
different coordinator committed epoch changes the correct global decision.

```text
FAST_DELTA rejected by contrast
        ↓
STRUCTURAL
P: authoritative epoch sources available
I: both local owners complete
B: local service epochs
χ/B candidate: coordinator commit relation
RECONSTRUCT and minimize
```

Escalation is justified by a concrete failed contrast rather than generic complexity.

## Example 22 — Broad review does not steal conceptual freedom or over-audit simple tasks

A user asks for a full review of a PR. Use `PICK_AUDIT / FULL_AUDIT` and semantic coverage mapping.
If one family contains a simple unit mismatch, diagnose that finding with the smallest boundary
witness, but continue reviewing the remaining material families because audit completeness and
finding complexity are separate axes.
## Bertrand random-chord exploration: handoff, not verdict

For an open request to explain Bertrand's paradox, bind `PICK_EXPLORE` and preserve the target
`D = Pr(L > sqrt(3)R)`. The local event is `I: r < R/2`. The three admissible constructions—uniform
endpoints, uniform line offset, and uniform midpoint area—share the coarse circle/chord/event
description but yield `1/3`, `1/2`, and `1/4`. This is a target-bound collapsed-contrast witness.

The leading hypothesis is that the phrase “random chord” omits the sampling-to-measure transport,
not that local chord geometry is ambiguous. A structural candidate separates:

```text
P: which sampling semantics/measure is authorized
I: local chord geometry and E = {r < R/2}
B: (Ω,ν) --F--> (C,μ), μ = F_*ν
χ: empty unless another non-local decision effect is demonstrated
```

The exploration status is `HANDOFF_READY`, with `observable_status: ERASED_UNRECOVERABLE` if only the
realized chord and the words “random chord” are available. Do not emit an information-loss
certificate or an `UNDER-SPECIFIED` verdict in this phase. A separately bound audit may verify the
contrast and issue a scoped result; until then, request or declare the sampling protocol/measure.

For minimality, `F_r` is a target-relative sufficient compression because `D = F_r(R/2)`. It is not
called globally `MINIMAL` unless each removed dimension has been tested against the contrast suite.

## Example 23 — Safe quotient removes a valid but irrelevant distinction

A deployment object records both `region` and `build_color`. `build_color` is a legitimate local `I`
fact, but the certified target is only whether the artifact hash matches the authoritative release.
Every admissible contrast that changes `build_color` alone leaves `D` unchanged.

```text
Pick classification: build_color -> I
quotient test: safe to merge color classes for this target
compiled representation: omit build_color
claim: VALID_COMPRESSION
```

The distinction is not denied; it is simply target-irrelevant.

## Example 24 — Continuation-sensitive quotient prevents unsafe merge

Two workflow states show the same current status `READY`, but one retains a retry edge and the other
is terminal. The target asks whether the workflow is guaranteed to terminate under admissible future
actions.

A snapshot-only representation would merge the states. A continuation contrast separates them, so the
retry/terminal structure must survive, likely as `B`/`CHI` depending ownership and graph scope.

## Example 25 — Blackwell-style information dominance without full-law identity

A decision needs only whether a measurement exceeds a threshold. Channel A returns the full numeric
measurement; Channel B returns only `above_threshold: YES|NO` derived from A.

For this one threshold decision, B may be decision-equivalent to A even though it is distributionally
poorer. Do not call the channels identical, and do not conclude distributional sufficiency.

## Example 26 — Composition is not automatically additive

Three services each report a local count. Two counts overlap because one resource is jointly owned.
Adding all three double-counts the shared resource.

```text
local I facts: valid
pairwise ownership seams: known
COMPOSITION_TRIGGER: fires
composition: requires explicit overlap/inclusion-exclusion semantics
```

Pick's decomposition helps locate the pieces, but the arithmetic composition rule must be independently
licensed.

## Example 27 — VOI chooses the cheaper discriminator

A release decision is blocked by two hypotheses: stale metadata versus wrong artifact identity.

- Test A downloads a 2 GB artifact and recomputes everything.
- Test B reads the signed manifest epoch and identity fields.

If Test B separates the two acceptance-changing hypotheses just as well, choose B. No numeric prior or
monetary utility is needed; ordinal reachability/cost/discrimination is enough.

## Example 28 — Spurious counterexample refines the abstraction

An abstract model treats two retries as independent and produces a nontermination counterexample.
Raw semantics show both retries share one monotonically decreasing budget, so the abstract trace is
unrealizable.

```text
counterexample_status: SPURIOUS
abstraction_loss_witness: shared retry budget was erased
refinement_delta: retain shared-budget relation
```

Do not report the underlying procedure as failing. Rerun the failed contrast after refinement.

## Example 29 — Null-event conditioning needs a construction

A continuous model asks for a conditional distribution "given X = x" where `P(X=x)=0`. Do not apply
ordinary finite-event conditioning mechanically. Bind a regular-conditional/disintegration or explicit
limiting construction. If different admissible constructions produce different answers, return
semantic underdetermination rather than silently choosing a parameterization.

## Example 30 — Internal theorem control, native user-facing answer

Internal reasoning may identify a Pick boundary, a quotient witness, and a VOI-selected observation.
If the user's question is simply "Why did the deployment fail?", the answer should normally be:

> The producer marked the artifact complete using epoch 41, but the consumer required epoch 42. The
> smallest useful check is the signed manifest epoch; no global topology issue is needed.

Do not append a theorem inventory unless the user asks how the reasoning architecture reached that
conclusion.
