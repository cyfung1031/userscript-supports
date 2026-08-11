---
name: review-userscript-change
description: Review browser userscript changes in JavaScript userscript files, focusing on scripting content and its HTML/CSS behavior, with metadata as a binding gate plus DOM/CSS, userscript-manager APIs, persistence, network, security, asynchronous lifecycle, and compatibility seams. Use when reviewing a userscript file diff or pull request and the review needs exact revision binding, PickInvariant-scoped probes, deterministic simulation, and explicit runtime-evidence limits.
---

# Review userscript changes

Use this small activation kernel for any userscript diff. Bind the artifact, classify its changed seams, load only the matching module references, and produce a read-only, best-effort review. The main oracle is static proof within the declared written-source and specification scope; optional browser fixtures are a last-resort partial simulation, not a guarantee. Do not assume a browser, a userscript manager, or a specific host site is available.

## Activate and bind

Use PickInvariant in `PICK_AUDIT` mode. Choose `FOCUSED_AUDIT` for one isolated semantic family and `DELTA_AUDIT` when the diff crosses families; use `FULL_AUDIT` only when completeness is explicitly required. Run `SURVEY -> MAP -> CONTRAST -> PINPOINT` and retain only distinctions that can change the review decision.

Record a compact activation receipt before loading modules: target and authority, base/head observables, Pick mode/depth, changed semantic families, available oracle, exclusions, and the `Q_D` review decision. Before a delta or full audit, load the installed PickInvariant `references/audit_and_contrast.md` and `references/review_scope_and_coverage.md`; do not reproduce their full theorem stack in this kernel.

Bind the exact base revision, head revision, changed path, and blob identities before making exact claims. Set `review_skill_root` to the directory containing this `SKILL.md`; its parent directory may be anywhere:

```bash
review_skill_root="/path/to/review-userscript-change"
node "$review_skill_root/scripts/bind_review_target.js" \
  --repo /path/to/repo --base <base-ref> --head <head-ref> \
  --path path/to/script.user.js --json > review-manifest.json
node "$review_skill_root/scripts/audit_userscript_change.js" \
  --manifest review-manifest.json --json
```

If the head is unavailable, report `INSUFFICIENT_EVIDENCE` or `BLOCKED_ON_ORACLE`; do not substitute a synthetic fixture, a nearby commit, or an inferred patch. `--source` is for unit fixtures only and is always marked `UNBOUND`.

## Route only the material modules

Run the auditor first. Load the direct reference only when its trigger appears in the changed source or diff:

- userscript metadata, `@grant`, `@require`, `@run-at`, `@inject-into`, or `@sandbox` -> [userscript-runtime.md](references/userscript-runtime.md) and [gm/index.md](references/gm/index.md); load [gm/compatibility.md](references/gm/compatibility.md) only when a manager/version-specific portability claim is in scope;
- `GM_getValue`, `GM.setValue`, listeners, or other storage calls -> [gm/storage.md](references/gm/storage.md);
- `GM_xmlhttpRequest`, `GM.xmlHttpRequest`, or privileged HTTP -> [gm/network.md](references/gm/network.md);
- `GM_addStyle`, `GM.addStyle`, `GM_addElement`, or `GM.addElement` -> [gm/dom.md](references/gm/dom.md);
- menu commands, notifications, clipboard, tabs, or downloads -> [gm/ui.md](references/gm/ui.md);
- `GM_info`, resources, `unsafeWindow`, or context crossings -> [gm/resources-context.md](references/gm/resources-context.md);
- DOM, event listeners, observers, injected markup, styles, layout, or theme/appearance -> [dom-css.md](references/dom-css.md);
- `async`, `await`, promises, timers, observers, cancellation, retries, open/close, or teardown -> [async-state.md](references/async-state.md);
- `fetch`, XHR, `GM.xmlHttpRequest`, storage, cache, IndexedDB, or cross-context messaging -> [network-storage.md](references/network-storage.md);
- `eval`, `Function`, `innerHTML`, `document.write`, `unsafeWindow`, or untrusted HTML/code boundaries -> [security-boundary.md](references/security-boundary.md).

Read [evaluation-contract.md](references/evaluation-contract.md) when choosing simulation cases or calibrating evidence claims. Read [forward-testing.md](references/forward-testing.md) only when validating or extending this skill. Do not load every module by default.

## Audit and simulate

Metadata and syntax checks are entry gates, not the substantive review. Trace the changed scripting content from inputs through state and control flow to DOM/HTML/CSS effects, manager calls, network/storage boundaries, and cleanup. The auditor performs syntax parsing, metadata-boundary checks, duplicate-directive checks, seam classification, changed-diff routing, and base-versus-head module comparison without executing the candidate userscript. It emits `audit_result`, a bounded `written_source_status`, `review_disposition`, evidence tiers, and typed runtime limitations. A static pass can prove selected written-source properties for the checked scope; it is not a guarantee that every manager/browser renders, schedules, or integrates it identically.

When content behavior is difficult to execute, prefer a small deterministic harness with manager-agnostic stubs for API boundaries, DOM nodes, timers, fetch/XHR, storage, and hostile inputs. Use it to separate success, rejection, timeout, duplicate, late-result, teardown, and reinjection paths. Manager-specific references are optional and may be stale; do not block the content review or package installation on them. Do not treat a passing stub as proof of the real manager or network; retain the exact stub contract and mark integration behavior `UNVERIFIED`.

For every material family, choose the cheapest reachable contrast that can change acceptance: prefer a source check or deterministic fixture; use a local browser runtime only as a last-resort partial simulation; and treat the actual userscript manager as an unavailable or external oracle unless observed. For async work, simulate duplicate actions, late results, teardown, retry, and identity/generation guards. For DOM/CSS work, exercise long content, narrow viewports, scroll ownership, first paint, focus, and clipping only when a visual oracle is available. Label absent, fragile, or prospective observations `UNVERIFIED`.

## Report and stop

Report the bound revision and scope, module routing, one coverage row per material semantic family, findings with source locators and reproducible states, commands and evidence tiers, unresolved limitations, and a final `READY`, `NOT_READY`, or `BLOCKED_ON_ORACLE` disposition. Keep `audit_result`, `written_source_status`, `runtime_validation`, and `review_disposition` separate: `SOURCE_READY` describes only bounded written-source checks; overall `READY` requires every decision-relevant runtime seam to have an available oracle. If any required manager/browser/network seam is unverified, retain `SOURCE_READY` where justified but set overall `NOT_READY`.

Do not post review comments, modify the PR, push, or install dependencies unless the user separately authorizes that outward or state-changing action.
