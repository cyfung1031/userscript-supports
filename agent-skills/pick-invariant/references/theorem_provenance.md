# Theorem Provenance and Transfer Boundaries

This file documents where v11's control principles come from. It is explanatory provenance, not an
always-on execution checklist.

## Pick's Theorem — dominant structural grammar

Literal role: reconstruct polygon area from interior/boundary lattice-point information under a
specific lattice-polygon domain.

Transferred principle: a global target may be reconstructible from a compact structural invariant
set, provided applicability assumptions are explicit.

Not transferred: `1/2`, `-1`, additivity, numeric topology, or an area-like target outside the literal
domain.

## Myhill–Nerode / bisimulation — decision-preserving quotient

Literal theories concern equivalence/minimization of formal-language or transition-system states
under future observable behavior.

Transferred principle: two states may be represented identically only when the admissible behavior
relevant to the target cannot distinguish them. For process targets, future continuations may matter.

Not transferred: the assumption that every PickInvariant problem is a DFA/LTS, or that full
bisimulation is required for one-step decisions.

## Bertrand paradox — generative-law ambiguity

Transferred principle: an object description such as "random chord" does not determine a probability
law when different admissible generation protocols induce different target probabilities.

Not transferred: any one Bertrand construction as the universal canonical law.

## Blackwell / Le Cam — stochastic decision sufficiency

Transferred principle: observation channels should be compared by decision-relevant information, not
coordinate dimension alone; approximate equivalence requires an explicit loss/tolerance notion.

Not transferred: a formal Blackwell/Le Cam theorem claim without the required statistical experiment,
channel, loss, and decision-class assumptions.

## Valuation / Ehrhart — composition and lattice extension

Transferred principle: local-to-global composition needs a licensed algebraic rule; overlap and
decomposition can change global reconstruction. Ehrhart is a legitimate literal extension in its
lattice-polytope dilation domain.

Not transferred: generic additivity, inclusion/exclusion, or polynomial scaling for arbitrary process
systems.

## Value of information — observation economy

Transferred principle: when several observations could resolve the target, prefer the least costly
reachable one that separates the acceptance-changing alternatives.

Not transferred: invented priors, utilities, or numeric expected values.

## CEGAR — witness-guided abstraction refinement

Transferred principle: validate a counterexample against raw semantics; real witnesses support a gap,
while spurious witnesses justify the smallest abstraction refinement needed to eliminate the artifact.

Not transferred: a requirement that every reasoning task run an iterative model-checking loop.

## Borel–Kolmogorov / disintegration — null conditioning

Transferred principle: conditioning on null/lower-dimensional events needs an explicit conditional
construction when the target depends on how that conditioning is defined; parameterization/limiting
choices can matter. A regular conditional distribution tied to an explicit conditioning random variable
may already provide the needed semantics.

Not transferred: declaring all continuous conditioning ambiguous or invoking null-event machinery for
ordinary positive-probability events.

## Haar measure — symmetry and relative canonicality

Transferred principle: symmetry-based canonical-measure claims require a specified transformation
group, invariance, and the relevant uniqueness/normalization basis.

Not transferred: symmetry alone as proof of a unique probability law.

## Sheaf/local-to-global language — compatibility obstruction

Transferred principle: individually valid local facts and pairwise overlap consistency may still fail
to assemble into a globally consistent state.

Not transferred: sheaf terminology or machinery for ordinary pairwise interface checks.

## Operational rule

The theorem names are provenance. The skill prompt should normally encode the transferred principle in
observable, target-relative language and activate literal theorem machinery only when its domain
assumptions are actually established.


## Grounding pointers

These are provenance pointers, not runtime dependencies:

- Myhill–Nerode/minimization: *General Myhill-Nerode Theorem*, arXiv:2102.05968.
- Blackwell/Le Cam comparison: *Coarse-graining and the Blackwell Order*, arXiv:1701.07602.
- CEGAR real/spurious refinement: *A Counterexample Guided Abstraction-Refinement Framework for Markov Decision Processes*, arXiv:0807.1173.
- Pick/Ehrhart relation: *Lattice point inequalities for centered convex bodies*, arXiv:math/0507528, and modern Ehrhart literature cited there.
- Borel–Kolmogorov conditioning: *A resolution of the Borel–Kolmogorov paradox*, arXiv:2009.04778.
- Haar measure: *Computing Haar Measures*, arXiv:1906.12220.
- Costly observation selection: *Decision Making under Costly Sequential Information Acquisition*, arXiv:2401.00569.

The operational transfer remains narrower than these source theories; theorem names never substitute
for checking the assumptions stated above.
