# Optional Template: State-Machine and Concurrency Probe

Use when a target has pending, resolved, timeout, error, retry, observer, listener, or async states.

```text
state:
trigger:
next_state:
observable_UI:
allowed_actions:
duplicate-action behavior:
late-result behavior:
in_flight_identity_or_generation:
oracle:
continuation_discriminator_or_future_suffix:
quotient_equivalence_status: SAME_CLASS | SEPARATED | UNKNOWN
evidence_tier:
pick_role: I | B | CHI | UNKNOWN
```
