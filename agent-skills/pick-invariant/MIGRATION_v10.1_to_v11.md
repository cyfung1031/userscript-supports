# Migration: PickInvariant v10.1 -> v11

## What stays stable

- authority ordering and mature-owner priority;
- `BYPASS / PICK_EXPLORE / PICK_AUDIT / PICK_DERIVE`;
- `DIRECT / FAST_DELTA / STRUCTURAL / COVERAGE`;
- `P/I/B/χ` structural roles and literal Pick boundary;
- exploration/commitment firewall;
- audit depth and completeness discipline;
- observability / history / evidence safeguards;
- compiler/executor separation;
- v10 probability object/law/transport/conditioning/canonicality/distribution safeguards.

## What changes conceptually

v10.1 asked primarily:

```text
Can D be reconstructed from P/I/B/χ?
```

v11 asks:

```text
1. Where does each candidate distinction live?        # Pick
2. Which distinctions must survive for target D?      # decision quotient
3. If stochastic, what law/channel generated it?      # Bertrand + measure + Blackwell/Le Cam
4. Is local-to-global composition actually licensed?  # valuation/Ehrhart/local-global
5. Which observation should be acquired next?         # VOI
6. Is a counterexample real or abstraction-induced?   # CEGAR-style refinement
```

## Compiled artifact impact

Existing v10.1 compiled procedures remain valid if their representations already reconstruct the
target and no known merge/removal contrast exposes unnecessary or missing distinctions.

v11 does **not** require automatic migration of every artifact to include theorem labels. New optional
fields such as `discriminator_class_QD`, merge tests, composition class, or stochastic information
relation are added only when material to the target or to a v11 claim such as `MINIMAL`.

## Minimality claim change

A v10.1 `MINIMAL` claim should be reviewed if it was based only on deleting dimensions. v11 prefers
both deletion and class-merge challenges where applicable.

## Probability claim change

Existing v10.1 probability certificates remain structurally compatible. v11 adds:

- information-channel comparison;
- epsilon decision sufficiency only with an authorized loss/tolerance;
- explicit null-event conditioning construction;
- stronger relative-canonicality language for symmetry/invariant-measure arguments.

## Presentation change

Theorem machinery becomes more powerful internally but **less** appropriate as default output.
Routine answers should be shorter/native-domain; architecture terminology is surfaced only when it
helps the user or is requested.

## Evaluation compatibility

The 29 v10.1 fixtures remain in the v11 evaluation as inherited regression tests. v11 adds 23 fixtures
for the new capabilities and reports context cost separately as a soft metric.
