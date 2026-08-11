# Async and lifecycle module

Load when the diff has `async`, promises, timers, observers, cancellation, retries, open/close, teardown, or callbacks that outlive a target.

Write the smallest state table needed for the changed seam. Probe duplicate in-flight actions, out-of-order results, close during await, reopen with a new identity, retry after failure, detached targets, and cleanup. Require an identity or generation guard where an old result can reach a new consumer.

Do not infer temporal safety from the presence of a variable named `generation`, `active`, or `destroyed`. Trace the guard from producer to consumer and observe the forbidden stale action when practical. If time or event ordering cannot be controlled, keep the claim `UNVERIFIED`.
