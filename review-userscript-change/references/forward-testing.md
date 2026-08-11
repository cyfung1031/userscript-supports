# Forward-testing protocol

Use fresh subagents as independent users. Give them the skill and the raw userscript artifact or diff, with a generic request that a real reviewer could make. Do not give the intended finding, expected verdict, suspected bug, or a summary that leaks the oracle.

Require each pass to bind revisions when possible, run the auditor, load only triggered modules, state evidence tiers, and separate `audit_result` from `review_disposition`. Compare the output against an evaluator-held oracle after the pass. If success depends on seeing the expected answer or prior diagnosis, tighten the kernel or fixture and repeat.

Keep forward-test artifacts isolated and disposable. A subagent may inspect and report, but must not edit the repository, post review comments, push, or access live systems. Acceptance requires the generated skill to pass its validator, deterministic tests, at least one bound differential test, and independent PickInvariant review.
