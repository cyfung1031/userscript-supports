# Publication contract

Before mutation, record:

```text
repository, PR-or-prospective_PR, base, branch, expected_head, authenticated_account, authorized_action, intended_paths
```

For a new PR, keep the PR number/URL unknown until the creation response supplies them; validate
the prospective base/head refs, title, body, and intended paths instead of inventing an identifier.

Every binding field must be present and nonconflicting before mutation. If sources conflict, record
the resolving authority, account, version, and locator; never resolve by agent preference. The precondition is
`remote_head == expected_head`. A branch update is valid only when the new
commit contains exactly the intended patch and the update is non-forced or explicitly authorized.

Validate repository syntax with `^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$`, a positive PR number for
existing-PR operations, branch refs with `git check-ref-format`, and relative paths with no `..`,
backslash, control character, or absolute-prefix. Validate 40-hex commit SHAs, the authenticated
account identity, and a review action in `COMMENT`, `APPROVE`, or `REQUEST_CHANGES`. Reject malformed
values before any write.

After mutation, verify:

```text
new_head, changed_paths, checks, draft, mergeable, review_id_or_url
```

For a posted review, also compare the exact body, author/account, action, and anchored commit to
the intended values.

Perform one final `remote_head` read immediately before posting the review. If it differs from the
verified target revision, stop and rebind/reverify; never post a review against a stale head.

For merge, close, ready-for-review, or other PR metadata transitions, re-read the expected current
state immediately before the write, abort on drift, then compare the resulting state to the requested
transition and confirm that no unrelated field changed.

For PR creation, compare the returned title and body to the bound prospective values as well as
the returned URL/number, base/head, and initial state.

Keep these decisions separate: code correctness, review disposition, approval, checks, draft/ready
state, and mergeability. A comment saying LGTM is not an approval, and mergeability is not proof
that checks or runtime behavior are complete.

If an API hides object IDs or only supports per-file commits, do not invent IDs or claim atomicity.
Use deterministic fallbacks only when authorized, verify after every required boundary, and disclose
the resulting commit shape.
