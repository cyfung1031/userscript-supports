# Binding, Minimal Pick Extensions, and Rebinding

## 1. Prefer extension over replacement

Given validated base procedure `P0` and a certified gap, prefer:

```text
P1 = P0 + Δ
```

where `Δ` is the smallest observable decision-relevant missing `P`, `I`, `B`, or `χ` distinction that survives quotient/minimality testing.

Do not synthesize a new full gate when the base procedure already owns most semantics.

## 2. Binding obligations

Before freezing `Δ`:

1. name the target decision, authority, and oracle it can change;
2. classify its Pick role;
3. define observable evidence for it;
4. challenge it with near-boundary contrast cases;
5. show how it changes the target-relative quotient / enters `R_P` and the reconstruction rule;
6. preserve unaffected owner semantics;
7. define the operational mechanism that supplies the semantic distinction across the claimed
   domain, including historical states where relevant;
8. define an escape condition when the distinction cannot be observed or resolved.

## 3. Authority-preserving freeze

After compilation:

- executor may evaluate compiled predicates;
- executor may take only authorized bounded responses;
- executor may not reinterpret `P/I/B/χ` semantics ad hoc;
- optional preferences do not become blockers;
- mature native verdicts remain authoritative within their preserved scope.

## 4. Dual-key rebinding

Rebinding requires both:

### Key A — observed failure
Evidence that the current representation or decision rule misclassifies a relevant case, including a validated real collapsed contrast:

```text
R_P(x1) = R_P(x2) but D(x1) != D(x2)
```

### Key B — structural explanation
A named missing/misbound role explains the failure:

```text
P gap | I gap | B gap | χ gap
```

Without Key A, structural speculation is not enough. Without Key B, a surprising failure is
not enough.

## 5. Partial rebinding

Repair only the affected role and dependencies. Preserve stable authority, local owner
logic, valid seams, verified topology constraints, and regression behavior.

## 6. Derivation budget

The certified gap is the budget. Once the updated representation reconstructs the target, survives the required contrast suite, and unnecessary distinctions are removed/merged, stop.
