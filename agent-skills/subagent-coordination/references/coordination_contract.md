# Coordination Contract

Use this contract when delegation has dependencies, shared artifacts, external side effects, or a
claim of review or forward-test completeness.

## Activation receipt

Record:

```text
objective:
target_and_version:
immutable_artifact_identity:
authority_and_owner:
authority_locator:
authorized_actor:
allowed_actions:
intended_paths_or_artifacts:
workers_and_roles:
dependencies:
acceptance_oracle:
time_budget:
retry_budget:
review_depth:
audited_scope:
unverified_scope:
coverage_map:
stop_rule:
```

If authority, target version, ownership, or allowed action conflicts, stop before dispatch or
mutation and name the smallest resolving observation.

## Worker packet

Each packet must contain:

```text
packet_id:
attempt_id:
worker_id_and_role:
objective:
raw_inputs_and_locators:
target_and_version:
artifact_revision:
authority_locator:
in_scope:
out_of_scope:
write_scope:
required_domain_skills:
depends_on:
dependency_state: READY | WAITING | BLOCKED | FAILED
upstream_result_revision:
evidence_required:
deadline_or_escape:
result_schema:
```

Pass raw artifacts and the minimum context needed to act. Never pass secrets or an expected answer
that would make the validation circular.

## Result contract

Require:

```text
status: ACCEPTED | PARTIAL | BLOCKED | FAILED
packet_id:
attempt_id:
claim_scope:
observations:
artifacts_or_changed_paths:
commands_or_oracles:
assumptions:
conflict_set:
resolver_outcome:
target_and_version:
artifact_revision:
freshness: FRESH | STALE | TIMED_OUT | SUPERSEDED
observed_at:
evidence:
  tier: DETERMINISTIC_PROOF | DETERMINISTIC_TRACE | RUNTIME_OBSERVED | AUTHORITATIVE_SPEC | ENVIRONMENT_DEPENDENT | INFERENCE | HYPOTHESIS
  locator:
  method:
  observation_window:
  verifier:
residual_unverified:
recommended_next_action:
```

Classify each claim as `OBSERVED`, `SIMULATED`, `INFERRED`, or `UNVERIFIED`. Keep evidence metadata
separate from the domain artifact unless it changes the target decision.

## State and integration

Use the smallest state machine that preserves decisions:

```text
BOUND -> DISPATCHED -> RUNNING -> OBSERVED -> VERIFIED -> INTEGRATED -> CLOSED
                         |            |             |
                         v            v             v
                       BLOCKED      CONFLICTED    REBIND_REQUIRED
```

`BLOCKED` needs a named missing input or oracle. `CONFLICTED` needs a conflict set and
source/version/authority reconciliation. `REBIND_REQUIRED` means the target, revision, owner, or
artifact changed. A timed-out, stale, superseded, or late attempt cannot advance or integrate. Do
not advance a state using a worker's assertion alone when the coordinator can cheaply re-observe it.

## External-action receipt

Keep this separate from ordinary worker packets:

```text
external_action:
authorization_reference:
authorized_account:
destination:
target_revision:
post_write_verification:
worker_may_execute: false
```

Only an explicitly authorized coordinator action may set `worker_may_execute` to true, and the
owning domain skill still governs the operation.

## Negative side effects

For every claim that a forbidden side effect did not occur, record:

```text
forbidden_channel:
closure_window:
observation_method:
verifier:
status: DIRECTLY_OBSERVED | CAUSALLY_PROVEN | UNVERIFIED
```

Absence of a success callback or a final value is not proof that the forbidden channel was unused.

## Coverage and handoff

For a bounded review, bind `review_depth`, map each material semantic family to `CHECKED`,
`EXCLUDED(reason)`, or `UNVERIFIED(risk)`, and retain the packet inventory. Distinguish finding
confidence from completeness. The final handoff must state the integrated result, accepted
evidence, worker failures or contradictions, finite budget use, unauthorized-side-effect check,
audited and unverified scope, and the exact remaining blocker or runtime limitation. Do not claim a
pass or completeness while a material family is undisposed.
