# Execution, Verification, and Failure Classes

## 1. Compiled execution should be boring

The executor receives an already compiled observable representation and decision rule. It should not rediscover Pick roles, quotient classes, theorem gates, or invent new semantics during ordinary execution.

A useful executor view is:

```text
applicability predicates      # P
local predicates              # I
seam predicates               # B
global structural predicates  # χ
decision rule
bounded responses
verification
escape condition
```

## 2. Prospective action authorization

Every nontrivial action must correspond to a named unresolved condition that can change
acceptance. The purpose must be prospective and bounded:

```text
blocker -> authorized resolving/discriminating action -> verification -> reevaluate
```

## 3. Failure classification

### Execution failure
The compiled contract is sound but the current state violates it. Repair the state under the
contract.

### Verifier/evidence failure
The rule is sound but evidence collection is stale, incomplete, corrupted, or misconfigured.
Repair evidence/verification first.

### Applicability failure (`P`)
A compiled precondition is false or undecidable. Follow the escape rule; do not pretend the
decision rule still applies.

### Contract/representation failure
Observed states expose an actual misclassification or collapsed contrast. This may justify rebinding if validation shows the witness is real and a structural explanation identifies the missing `P/I/B/χ` distinction. If the witness is spurious under raw semantics, refine the abstraction rather than declaring procedure failure.

### Procedure gap
A mature owner reaches an explicit escape condition indicating its representation cannot
soundly decide or compose the observed case.

## 4. Closure

Completion requires all compiled acceptance predicates to hold under valid applicability and
verification. Pairwise local success is insufficient if required `B` or `χ` predicates are
unresolved.

## 5. Stop discipline

When the target is accepted and no certified blocker remains, stop. Do not exploit the
presence of PickInvariant to perform unrelated optimization.
