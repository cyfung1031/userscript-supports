# Architecture: Principle-Driven PickInvariant v11

## 1. Dominant theorem and control stack

Pick's Theorem remains the dominant structural model because it contributes the reusable grammar that
separates applicability, local semantics, interfaces, and residual non-local structure:

```text
P / I / B / χ
```

Dominance does not mean exclusivity. v11 uses a layered control stack:

```text
Pick                  -> where a candidate distinction lives
Decision quotient     -> whether the distinction must survive compression
Bertrand/measure      -> whether hidden generative law changes the target
Blackwell/Le Cam      -> whether stochastic information is decision-equivalent / approximately sufficient
Valuation/Ehrhart     -> whether local-to-global composition is licensed
Value of information -> which unresolved observation is worth acquiring next
CEGAR-style refinement-> whether a counterexample is real or abstraction-induced
Borel/Haar/sheaf      -> specialized null-conditioning, canonical-measure, local-global gates
```

The stack is internal control logic. User-facing answers remain native to the task unless theorem
language itself is requested or materially explanatory.

## 2. Runtime topology

PickInvariant is not a mandatory router.

```text
TASK
  |
  +--> adequate known owner -------------------------> DIRECT owner result
  |        |
  |        +--> explicit explore --------------------> PICK_EXPLORE
  |        +--> explicit audit ----------------------> PICK_AUDIT
  |        +--> adopted PROCEDURE_GAP --------------> PICK_DERIVE
  |
  +--> no owner + decision required ----------------> PICK_DERIVE
  |
  +--> explicit open exploration -------------------> PICK_EXPLORE
```

Authority mode and reasoning depth are separate:

```text
DIRECT       known procedure/native mechanism
FAST_DELTA   obvious one-dimensional adopted gap
STRUCTURAL   Pick roles + decision-quotient reconstruction
COVERAGE     breadth obligation for delta/full audit claims
```

Specialized gates do not create new authority modes.

## 3. Principle hierarchy

Resolve conflicts in this order:

1. preserve explicit authority and applicability;
2. preserve the requested target and bound semantic requirements;
3. preserve only distinctions whose loss can alter the target;
4. require decision-time observability or an explicit escape;
5. keep stochastic object/law/channel semantics explicit when material;
6. prefer the coarsest sufficient representation;
7. acquire the cheapest observation that separates acceptance-changing alternatives;
8. refine only on a validated witness;
9. keep reasoning machinery internal unless exposing it helps the user.

A lower principle never overrides a higher one merely to reduce complexity.

## 4. Discovery and commitment are asymmetric

Exploration may switch conceptual frames freely. Commitment is narrower:

```text
wide hypothesis space
        |
        v
reframings / models / candidate distinctions
        |
   translation firewall
        |
        v
bounded target + authority + admissible observable contrast
        |
        +--> audit evidence
        |
        +--> adopted gap -> compiled procedure
```

A theorem analogy can inspire a hypothesis without granting a theorem-level claim.

## 5. Structural path: locate, quotient, reconstruct

When structure is unresolved:

```text
1. Pick locate
   P -> domain/applicability/authority/observability
   I -> mature local semantics
   B -> contextual seams, transformations, ownership, time
   χ -> residual non-local structure

2. Quotient test
   Which candidate distinctions can be merged without changing D?

3. Reconstruction
   R(x1) = R(x2) => D(x1) = D(x2)

4. Minimality
   remove/merge every unsupported distinction
```

A Pick role is therefore necessary classification metadata in structural mode, but not sufficient
reason to retain a field.

## 6. Mature procedures remain interior theorems

A mature procedure owns its validated domain. Its native semantics normally become reusable `I`
facts in larger compositions and are not regenerated. An explicit explore/audit request may inspect
the owner without changing its authority.

Success should reduce future PickInvariant activation.

## 7. Fast-delta path

When an adopted gap is already one observable acceptance-changing distinction with direct evidence,
prefer:

```text
owner + Δ
```

A fast delta must preserve applicability, evidence/oracle, owner safeguards, verification, and escape
behavior. It need not expose theorem machinery. Escalate only when a contrast collapses, role is
unknown, seams interact, stochastic semantics matter, or non-local composition prevents
reconstruction.

## 8. Boundary-first composition

For producer `P1` and consumer `P2`:

```text
G(P1) >= Req(P2)
```

Check semantic coverage over the dimensions relevant to the target: authority, scope, freshness,
identity, schema, units, evidence, caveats, atomicity, completeness, mutability, and uncertainty.

If multiple pieces/overlaps are being combined, separately ask whether the composition rule is
licensed. Pairwise seam validity does not imply global composability.

## 9. Probability and information channels

When law semantics are material, the probability firewall loads the measure protocol. Distinguish:

```text
object representation
probability law
observation/information channel
conditioning construction
transport/pushforward
```

Decision sufficiency for an information channel is not the same as coordinate equality or full
law equivalence. Approximate sufficiency requires an authorized tolerance/loss metric.

## 10. Witness-driven refinement

Keep three broad failure classes separate:

- execution failure — procedure sufficient, state violates it;
- verifier/evidence failure — procedure may be sufficient, observation is inadequate;
- representation/contract failure — abstraction collapses states requiring different decisions.

When a reported counterexample may be induced by abstraction loss, validate it against raw/admissible
semantics before changing the procedure. Real witnesses support a gap; spurious witnesses support the
smallest representation refinement.

Rebinding still requires observed decision misclassification plus a named structural explanation.

## 11. Observation selection

If several tests can resolve an uncertainty, rank them ordinally by:

```text
reachability
cost/risk
acceptance-changing discrimination
redundancy with known observations
```

Choose the cheapest sufficient discriminator. Do not invent numeric priors/utilities to make this
look like a formal expected-value calculation.

## 12. Coverage-aware audit path

`PICK_AUDIT` is read-only. Audit depth determines claim breadth:

```text
FOCUSED_AUDIT
DELTA_AUDIT
FULL_AUDIT
```

For delta/full audit:

```text
SURVEY -> MAP -> CONTRAST -> PINPOINT
```

The first finding is not a stopping condition. Completeness is about semantic families in the bound
scope, not number of files inspected.

## 13. Compiler/executor and presentation separation

The compiler may explore, compare abstractions, and invoke theorem-specific gates. The executor
receives only the adopted operational artifact:

- applicability/domain;
- observable predicates;
- decision rule;
- bounded authorized actions;
- verification closure;
- provenance;
- regression contrasts;
- escape conditions.

The user-facing answer receives only what is useful for the requested task. Neither executor nor
presentation layer should rediscover or ceremonially expose PickInvariant.

## 14. Promotion loop

```text
unknown or gap
-> explore/audit if useful
-> candidate Pick distinctions
-> decision-preserving quotient
-> smallest sufficient compiled distinction
-> repeated successful use
-> stable applicability and escape boundary
-> contrast/regression suite
-> validated specialized procedure
-> direct owner execution
```
