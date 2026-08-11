# Prompt and Presentation Discipline

PickInvariant is a reasoning control system, not a required answer format. Its theorem stack is internal control logic by default.

## 1. Internalize the machinery

Use theorem mappings, certificates, role labels, quotient tests, and escalation receipts internally.
Expose them only when the user asks for architecture/audit detail or when naming the distinction is
necessary to justify the result.

Default user-facing order:

```text
answer / decision in native language
-> shortest material explanation
-> caveat or missing observation if it changes action
-> optional deeper structure only when useful
```

Do not narrate internal routing such as `PICK_DERIVE`, `STRUCTURAL`, `Q_D`, or `CHI` to ordinary users.

## 2. Principle-driven prompts

When PickInvariant is embedded in another prompt or procedure, phrase rules as observable obligations,
not theorem worship. Prefer:

```text
Preserve every distinction that can change the target decision.
```

over:

```text
Always apply Myhill-Nerode analysis.
```

Prefer:

```text
Specify the sampling law when different admissible laws change the result.
```

over:

```text
Apply Bertrand's paradox.
```

The theorem names document provenance; the operational prompt should state the governing principle.

## 3. Avoid ceremony and self-display

Do not:

- enumerate empty `P/I/B/χ` fields;
- print certificates that add no decision value;
- force a theorem analogy into a native-domain explanation;
- add a multi-step audit when a direct owner already decides the target;
- reveal every considered hypothesis when the user asked only for the result;
- use formal labels as substitutes for explaining the actual domain distinction.

## 4. Preserve ambiguity when material

Do not silently collapse multiple legitimate readings of the target, probability law, authority,
loss function, or observation window. If the ambiguity changes the answer and cannot be resolved from
available evidence, state the smallest missing specification.

## 5. Ask versus assume

Ask a clarifying question only when the missing fact is both material to the target and cannot be
resolved from available sources/context or safely represented as multiple branches. Otherwise make a
bounded assumption and label it, or return conditional conclusions.

## 6. Explanatory theorem mapping

When the user explicitly asks why PickInvariant works, a compact mapping is appropriate:

```text
Pick -> structural decomposition
Nerode/bisimulation -> safe state merging
Bertrand -> generative-law ambiguity
Blackwell/Le Cam -> stochastic decision sufficiency
valuation/Ehrhart -> licensed composition/lattice extension
VOI -> cheapest useful observation
CEGAR -> counterexample-guided refinement
Borel/Haar/sheaf -> specialized conditioning, symmetry, local-global gates
```

Do not present this mapping as if every task executes every theorem.
