# Integration: Procedure Resolution and Escape Signals

## 1. Preferred resolver behavior

```text
required decision
      |
      v
validated owner exists? ---- yes ----> run owner
      |                                  |
      no                                 +--> native verdict -> return
      |                                  +--> explicit explore -> PICK_EXPLORE
      |                                  +--> explicit audit -> PICK_AUDIT
      |                                  +--> adopted PROCEDURE_GAP -> PICK_DERIVE
      v
NO_OWNER + decision required ----------> PICK_DERIVE

explicit open exploration without commitment ------> PICK_EXPLORE
```

Do not insert PickInvariant as a shadow router before every mature procedure.

## 2. Owner escape signal

A useful escalation contains:

```text
owner:
required_decision:
observed_state:
why_native_representation_is_insufficient:
suspected_pick_role: P | I | B | CHI | UNKNOWN
smallest_missing_distinction:
preserved_scope:
```

The owner need not solve the gap. `UNKNOWN` is valid when the insufficiency is falsifiable but its
structural role is not yet known.

## 3. Ordinary failures stay inside owner

If the procedure already has a native state for the event—failure, blocked, caveat, retry, rejection,
incomplete verification—use that state. Do not escalate merely because the outcome is inconvenient.

## 4. Explicit exploration is not a routing failure

A user may ask to explore alternative conceptual models even when a mature owner exists. Preserve the
owner's result and enter `PICK_EXPLORE` only for the requested hypothesis generation. The exploration
cannot override the native result or become a hidden second decision procedure.

## 5. Explicit audit remains read-only

A user/owner may request `PICK_AUDIT` on an owned decision. Preserve the native result and bind the
audit scope/depth. A confirmed finding is evidence until derivation authority is separately granted.

## 6. Resolver ambiguity

If two mature procedures plausibly own the same decision and no precedence rule exists, resolve only
the precedence/seam needed for the target. If the task is merely to brainstorm possible ownership
models, exploration may precede a formal audit/derivation.

## 7. Fast versus structural derivation

After derivation authority exists:

- use `FAST_DELTA` when one observable seam/distinction is already sufficient;
- use `STRUCTURAL` when role, topology, information loss, temporal semantics, or interacting seams
  remain unresolved.

Do not run full structural compilation simply because PickInvariant was invoked.
