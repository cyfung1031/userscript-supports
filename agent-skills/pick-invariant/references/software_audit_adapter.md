# Optional Software Audit Adapter

Load this adapter for software, refactor, incident, migration, or code-review audits. It supplies
semantic families and high-yield probes; it does not replace the universal `P/I/B/χ` kernel.

## 1. Scope and coverage gate

Declare `FOCUSED_AUDIT`, `DELTA_AUDIT`, or `FULL_AUDIT` before pinpointing. Then build a coverage
map. A software audit is not complete merely because one bug is confirmed.

```text
family:
changed_or_affected_scope:
representatives:
status: CHECKED | EXCLUDED | UNVERIFIED
highest-risk seam:
evidence_tier:
remaining_risk:
```

Use separate rows for localization and formatting, DOM/event behavior, filtering and collection
semantics, API/cache/network logic, manager or procedure bridges, accessibility, persistence and
migration, and any other family introduced by the artifact. In `DELTA_AUDIT` and `FULL_AUDIT`,
continue through every material row; report `unverified_scope` when tools or an oracle block coverage.

## 2. Baseline and finding reconciliation

For a pull request or before/after artifact, bind:

```text
base_revision:
reviewed_revision:
owner_revision:
prior_findings:
resolved_findings:
stale_or_outdated_findings:
current_delta:
```

Check each candidate against current code and discussion. Classify it as:
`REPEAT_EXISTING`, `RESOLVED_BY_CURRENT_HEAD`, `NARROWER_REMAINDER`, or `NEW_FINDING`.
Suppress repeated/resolved findings; retain a narrower remainder only with its new witness.

## 3. Semantic path and transformation risks

Trace the stages present in the target:

```text
claim/spec
-> input/parse
-> representation/storage
-> transformation/transport
-> authorization/enforcement
-> mutation/side effect
-> persistence/restore
-> observation/test
```

Candidate families include:

- localization, formatting, and schema/identifier handling;
- DOM/event/listener ordering, propagation, default prevention, and detached-node updates;
- filtering, ordering, collection identity, and empty-state behavior;
- API/cache, retry, observer, listener, and manager-bridge composition;
- eager evaluation moved across guards, `await`, `try/catch/finally`, or lifecycle boundaries;
- identity, generation, closure, ownership, and binding changes;
- snapshot/patch/default/override, persistence, migration, and structured-error flattening;
- registration narrowing versus runtime enforcement and negative claims through indirect callbacks.

A syntactic transformation is not a finding until an admissible, reachable, oracle-bound contrast
or proof shows different required behavior.

## 4. Temporal, concurrency, and state-machine probes

For UI/event or asynchronous code, make these standard probes when relevant:

- same-target listener ordering, `preventDefault` versus propagation, and repeated trusted events;
- duplicate in-flight requests, request coalescing, late results, stale overwrites, and generation
  or identity guards;
- detached-node updates, cancellation, retry after terminal failure, and observer cleanup;
- before/after authoritative linearization points for abort, crash, retry, and recovery.

Whenever states such as `resolved`, `pending`, `timeout`, or `error` exist, construct a transition
table and test each relevant event against each state:

```text
state:
trigger:
next_state:
observable_UI:
allowed_actions:
duplicate-action behavior:
late-result behavior:
```

Whenever retries, late refreshes, observers, listeners, or async status checks are added, ask:

```text
can two invocations observe the same control?
can two requests be active for one target?
can late results arrive out of order?
is there an in-flight identity or generation guard?
```

Concurrency is not automatically `χ`; use `B` when one typed or temporal seam reconstructs the
decision. Use `χ` only for residual global cycles, shared ownership, reachability, or ordering that
cannot be reconstructed locally or at a direct boundary.

## 5. Preservation and evidence

For before/after claims, seek the smallest witness:

```text
Project(Trace(before, x)) != Project(Trace(after, x))
```

Project only contract-relevant events. Check guard dominance and eager evaluation before broadening.
Keep source proof distinct from fixture or browser proof using the current evidence tiers:
`SOURCE_DETERMINISTIC`, `STATIC_WITH_SPEC_ASSUMPTION`, `FIXTURE_EXECUTED`, `BROWSER_RUNTIME`,
`EXTERNAL_INTEGRATION`.

An earlier error callback does not prove that no request or write occurred. Require direct observation
of the forbidden channel for the certified window or a causal proof excluding it.

## 6. Finding and external-comment shape

The internal audit verdict may be `CONFIRMED_GAP`; an external review comment should contain only:

```text
witness:
consequence:
exact_location:
smallest_fix:
validation_limitation:
```

Keep the internal `P/I/B/χ` explanation, confidence, completeness, coverage ledger, stale-finding
status, and oracle limitations in the audit record unless the user requests the full reasoning.

After any authorized external review action, verify:

```text
target_revision:
comment_body:
author/account:
destination_url:
```

This is a post-write verification obligation, not permission to perform an outward-facing action.
