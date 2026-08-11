---
name: pick-invariant
description: >
  Principle-driven adaptive reasoning for unresolved decisions, safe conceptual exploration,
  invariant audits, and owner-identified procedure or composition gaps. Pick's Theorem remains the
  dominant structural grammar; decision-preserving quotienting determines which distinctions may be
  safely forgotten. Preserve owner authority, explicit stochastic semantics, observable seams,
  witness-driven refinement, and the smallest sufficient compiled representation.
---

# PickInvariant v11

Use PickInvariant as an adaptive meta-skill governed by this hierarchy:

> **Preserve the target. Preserve authority and semantics. Keep only decision-relevant distinctions.
> Prefer the cheapest sufficient observation and representation. Refine only on an explicit witness.**

Pick remains the dominant structural grammar:

```text
R_P(x) = <P(x), I(x), B(x), χ(x)>
D(x) = d(R_P(x))
```

`P` binds applicability, authority, and observable scope; `I` preserves locally owned semantics; `B`
preserves decision-relevant seams; `χ` preserves genuinely non-local structure. Pick supplies
candidate structural roles; it does **not** by itself license every distinction to survive
compression.

The governing compression criterion is target-relative:

```text
x1 ~D x2  iff  no admissible target-relevant discriminator separates their required decisions
R(x) = equivalence class of x under ~D
R(x1) = R(x2) => D(x1) = D(x2)
```

Use the coarsest observable representation supported by evidence. A distinction earns retention only
when removing/merging it collapses an acceptance-changing contrast or violates a bound semantic
requirement.

## 1. Bind authority and one primary mode

Bind a supplied artifact/version before claiming exact conformance; otherwise mark
`INFERRED_PICKINVARIANT`.

```text
explicit authority > validated owner > validated extension > PickInvariant derivation > preference
```

- **BYPASS** — adequate validated owner exists and no Pick exploration/audit was requested. Run it
  directly without shadow analysis.
- **PICK_EXPLORE** — explicit open-ended exploration/reframing. Non-authoritative: may switch frames
  and retain competing hypotheses, but cannot emit audit passes, compile `Δ`, mutate, rebind, or
  install authority.
- **PICK_AUDIT** — explicit read-only invariant stress test. Preserve owner authority and bind audit
  depth before coverage claims.
- **PICK_DERIVE** — only for `NO_OWNER` or an owner/higher-authority adopted `PROCEDURE_GAP`. Bind
  `phase: INVESTIGATE | COMPILE`; only `COMPILE` may authorize action from a complete adopted gap.

Exploration/audit evidence does not create derivation authority.

## 2. Keep discovery broad and commitment narrow

In `PICK_EXPLORE`, anchor the original target, authority, observations, and constraints while freely
trying useful representations. A hypothesis crosses the commitment firewall only after translation
into a target-bound observable contrast, falsifiable question, or adopted procedure gap.

The theorem stack is **internal control logic, not mandatory user-facing ceremony**. Unless the user
asks for the reasoning architecture or theorem mapping, answer in the domain's native language. Do
not dump `P/I/B/χ`, quotient classes, certificates, theorem names, or escalation receipts merely to
show work. Surface only distinctions that materially improve the requested answer.

## 3. Use adaptive reasoning depth

- **DIRECT** — validated owner/native mechanism. Default for known structure.
- **FAST_DELTA** — inside authorized derivation, use `owner + smallest observable Δ` when one typed
  distinction has direct evidence, known decision effect, no role ambiguity, and no residual
  interaction. Do not ceremonially enumerate structural fields.
- **STRUCTURAL** — escalate when role is unknown, a candidate quotient collapses an
  acceptance-changing contrast, multiple seams interact, information/history/time is nontrivial,
  or local facts plus direct boundaries cannot reconstruct `D`. Probability/composition specialist
  gates are orthogonal: use them at the current sufficient depth unless they expose structural
  uncertainty that itself requires escalation.
- **COVERAGE** — breadth obligation only for `DELTA_AUDIT`, `FULL_AUDIT`, or another explicit
  completeness claim; never a universal tax.

Every escalation names the witness and what the deeper level can decide that the shallower one
cannot. Stop or de-escalate as soon as a simpler sufficient representation survives the relevant
contrasts.

## 4. Audit with bounded completeness claims

For `PICK_AUDIT`, bind exactly one depth:

```text
FOCUSED_AUDIT | DELTA_AUDIT | FULL_AUDIT
```

For delta/full audits use `SURVEY -> MAP -> CONTRAST -> PINPOINT`; continue until every material
semantic family is `CHECKED`, `EXCLUDED(reason)`, or `UNVERIFIED(risk)`, or a named oracle blocks
progress. Keep finding confidence separate from review completeness. Reconcile revision changes and
stale/resolved findings. Never inflate scoped `NO_GAP_FOUND` into global cleanliness.

## 5. Structural commitment: Pick grammar + quotient criterion

Before structural derivation/rebinding, bind domain, target, oracle, observables, exclusions, and the
admissible discriminator class `Q_D`. Mark each needed observable `AVAILABLE_NOW`,
`PROSPECTIVE_ONLY`, or `ERASED_UNRECOVERABLE`.

Use Pick roles to locate candidate distinctions, then test whether they are target-relevant:

```text
candidate distinction
-> admissible/reachable?
-> can it change D or a bound consumer requirement?
-> observable at decision time?
-> if removed, does a valid contrast collapse?
```

Only then retain it. Preserve semantic seam coverage `producer_guarantee >= consumer_requirement`. Prove sufficiency before minimality. Reserve `MINIMAL` for a target-relative
removal/merge-tested claim; otherwise use `SUFFICIENT` or `VALID_COMPRESSION`.

For stochastic observations, decision equivalence may depend on the information channel rather than
one realized state. When materially relevant, use the probability reference's Blackwell/Le Cam
sufficiency rules instead of treating equal coordinates as equal information.

For local-to-global composition, do not assume additivity. Activate `COMPOSITION_TRIGGER` when the
conclusion depends on combining overlapping pieces, inclusion/exclusion, repeated decomposition, or
non-local compatibility. Use valuation-like composition only when its assumptions are actually
licensed. A validated owner that already owns the composition semantics remains `DIRECT`.

## 6. Probability-law firewall

If a stochastic law, sampling protocol, distribution, conditioning/rejection step, quotient,
nonlinear transport, or information channel can materially change the target, activate
`PROBABILITY_MEASURE_TRIGGER` and **load `references/probability_semantics.md` before any law-level,
`UNIFORM`, stochastic-sufficiency, conditioning, transport, canonicality, or quotient-weighting
claim**. Mere stochastic vocabulary with no target effect does not activate it. A validated stochastic
owner that already binds the material law/channel/conditioning semantics may remain `DIRECT`; do not
reconstruct a duplicate measure certificate.

If conditioning is on a null/measure-zero event or depends on a limiting parameterization, require an
explicit conditioning construction/disintegration basis. If canonicality is asserted from symmetry,
require the symmetry/invariant-measure gate. If required detail cannot be loaded, narrow or downgrade
the claim rather than substituting an implicit law.

## 7. Observation choice and witness-driven refinement

When several unresolved distinctions could be inspected within existing evidence-acquisition
authority, prefer the cheapest reachable observation that can separate the leading acceptance-changing
hypotheses. Do not invent numeric probabilities or
utilities when they are unavailable; ordinal value-of-information reasoning is enough.

A failed contrast may mean either a real procedure failure or an abstraction that is too coarse. If
that distinction matters, activate the refinement gate:

```text
counterexample -> validate against raw/admissible state
  real      -> report gap/failure within authority; audit evidence still needs adoption to derive
  spurious  -> refine representation by the smallest witness-backed distinction
```

Never patch only the decision rule while leaving a known-insufficient representation unchanged.

## 8. Commit only the smallest authorized result

Only `PICK_DERIVE` may use:

```text
DELTA -> OBSERVE -> COMPILE -> FREEZE -> VERIFY -> REBIND -> STOP
```

Prefer owner + smallest `Δ`; preserve mature safeguards. Every nontrivial action must prospectively
resolve or discriminate a named acceptance-changing condition. Executors consume compiled artifacts
and never rediscover PickInvariant. Rebind only on observed decision misclassification plus a named
missing structural distinction. The certified gap is the derivation budget.

## 9. Literal theorem boundary and progressive loading

Use `PICK_LITERAL` only for an appropriate lattice polygon:

```text
A = I + B/2 - 1
```

Else use `PICK_STRUCTURAL`; never import literal coefficients without independent basis. Ehrhart and
valuation theory may justify broader lattice/composition statements only under their own assumptions.

Load detail only when triggered:

- exploration/rigor: `references/exploration_and_adaptive_rigor.md`
- theorem/roles: `references/pick_abstraction.md`, `references/pick_representation.md`
- theorem provenance/transfer boundaries: `references/theorem_provenance.md` only when explaining or auditing the mathematical architecture
- decision quotient/minimality/stochastic sufficiency: `references/decision_quotients.md` when merge/continuation/channel equivalence or a `MINIMAL` claim is material
- audit/coverage: `references/audit_and_contrast.md`, `references/review_scope_and_coverage.md`
- derivation/failure: `references/procedure_gaps.md`, `references/binding_and_rebinding.md`, `references/execution_and_failures.md`
- architecture/resolution: `references/architecture.md`, `integration/procedure_resolution.md`
- seams/history/time: `references/seams_information_and_time.md`
- probability/measure semantics: `references/probability_semantics.md` after the materiality trigger
- composition/observation/refinement: `references/composition_and_refinement.md` when its trigger fires
- specialized gates: `integration/specialized_gates.md`
- prompt/presentation behavior: `references/prompt_and_presentation.md` when designing or auditing embedded prompts or user-facing reasoning format
- robustness: `references/robustness.md`
- release evolution/regression evaluation only: `references/no_drawback_contract.md`, `eval/`
- outputs/calibration: `templates/`, `examples/`, `tests/`

Mandatory load triggers are part of the algorithm. If required detail cannot be loaded, narrow or
downgrade the conclusion rather than pretending it was applied.
