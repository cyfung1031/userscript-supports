# Escalation Receipt

Use whenever reasoning depth increases. A topic's apparent difficulty is not a trigger by itself.

```text
from_depth: DIRECT | FAST_DELTA | STRUCTURAL
to_depth: FAST_DELTA | STRUCTURAL | COVERAGE
triggering_contrast_or_uncertainty:
what_deeper_depth_can_decide_that_shallower_depth_cannot:
target_decision:
oracle_or_authority:
observable_status: AVAILABLE_NOW | PROSPECTIVE_ONLY | ERASED_UNRECOVERABLE
stop_or_deescalation_condition:
```

For a structural trigger, prefer a target-bound witness such as
`R_coarse(x1) = R_coarse(x2)` with `D(x1) != D(x2)`. If no such uncertainty or decision effect is
named, remain at the shallower depth.
