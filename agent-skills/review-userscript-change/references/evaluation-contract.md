# Evaluation contract

Use this contract to keep a best-effort evaluator useful without overstating what static checks or partial browser simulations prove.

## Evidence tiers

- `SOURCE_DETERMINISTIC`: exact source, metadata, or diff fact.
- `STATIC_WITH_SPEC_ASSUMPTION`: source pattern interpreted against a named userscript/browser contract.
- `FIXTURE_EXECUTED`: deterministic fixture or restricted parser run.
- `BROWSER_RUNTIME`: observed behavior in a local browser fixture; partial and environment-bound, never a universal guarantee.
- `EXTERNAL_INTEGRATION`: observed behavior through the actual userscript manager, host site, or API.

Preserve observability as `AVAILABLE_NOW`, `PROSPECTIVE_ONLY`, or `ERASED_UNRECOVERABLE`. Never upgrade a lower tier because a test is green.

## Contrast selection

For each changed family, name the smallest acceptance-changing pair before running a probe. Examples include:

| Family | Contrast | Required observation |
|---|---|---|
| Metadata/runtime | manager with and without a declared grant | API availability and failure behavior |
| DOM/CSS | empty versus long/narrow content | scroll owner, clipping, focus, and first-paint result |
| Async lifecycle | resolve before close versus after close/reopen | no stale overwrite or duplicate listener |
| Network/storage | success, rejection, timeout, and retry | state transition, cleanup, and user-visible error |
| Security boundary | trusted versus hostile page-provided input | no unintended evaluation, injection, or privilege escalation |

If the leading alternatives are not separated, stop at `UNVERIFIED` and name the missing oracle. A source marker is not a runtime observation.

## Review claims

Use `PROVEN`, `INFERRED`, `UNVERIFIED`, and `CONTRADICTED` for claims. Use separate fields:

- `audit_result`: `NO_GAP_FOUND`, `POTENTIAL_GAP`, `CONFIRMED_GAP`, or `INSUFFICIENT_EVIDENCE`;
- `written_source_status`: `SOURCE_READY` or `SOURCE_NOT_READY` for exact written-source checks;
- `runtime_validation`: `AVAILABLE`, `PARTIAL`, or `UNVERIFIED`;
- `review_disposition`: `READY`, `NOT_READY`, or `BLOCKED_ON_ORACLE`.

`SOURCE_READY` is a bounded best-effort claim about written code and checked static/spec seams. It does not certify manager/browser behavior, and a browser fixture remains a partial simulation. `review_disposition: READY` is an overall readiness claim and requires every decision-relevant runtime seam to have an available oracle; otherwise use `NOT_READY` while retaining `SOURCE_READY` if its narrower claim is supported. Negative claims such as “no flash”, “no duplicate listener”, or “no stale write” require direct forbidden-channel observation or a causal proof over a stated closure window.
