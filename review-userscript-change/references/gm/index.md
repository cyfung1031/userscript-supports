# GM API reference router

Load this router whenever the script calls a `GM_*` function, a `GM.*` method, or relies on a metadata grant. These are concise, manager-agnostic review contracts, not vendor documentation. They are optional guidance for portability questions and may become stale; confirm manager/version differences against the linked primary references before making a compatibility claim.

## Normalize the call before reviewing it

| Content seam | Legacy or callback form | Namespaced or promise form | Main risk to prove |
|---|---|---|---|
| Storage | `GM_getValue`, `GM_setValue`, `GM_deleteValue`, `GM_listValues`, `GM_addValueChangeListener` | `GM.getValue`, `GM.setValue`, `GM.deleteValue`, `GM.listValues`, `GM.addValueChangeListener`, `GM.removeValueChangeListener` | default, serialization, rejection, cross-tab change, stale overwrite |
| HTTP | `GM_xmlhttpRequest(details)` | `GM.xmlHttpRequest(details)` | `@connect`, response shape, abort, timeout, rejection, late result |
| DOM injection | `GM_addStyle`, `GM_addElement` | `GM.addStyle`, `GM.addElement` | owner document, insertion timing, returned element, cleanup, CSP |
| Menu and UI | `GM_registerMenuCommand`, `GM_unregisterMenuCommand`, `GM_notification`, `GM_setClipboard` | `GM.registerMenuCommand`, `GM.unregisterMenuCommand`, `GM.notification`, `GM.setClipboard` | callback event, permission, return/control shape, user gesture |
| Tabs/downloads | `GM_openInTab`, `GM_download` | `GM.openInTab`, `GM.download` | control object, popup policy, abort, filename, completion/error |
| Resources/context | `GM_getResourceText`, `GM_getResourceURL`, `GM_info`, `unsafeWindow` | `GM.getResourceText`, `GM.getResourceUrl`, `GM.info` | metadata/resource identity, sandbox world, origin, sync/async variant |

Do not assume that a legacy function and a namespaced method have the same return type or timing. If manager/version data is available, bind it with `@grant`, manager-specific `@connect` behavior, `@resource`, `@run-at`, and effective `@inject-into`/`@sandbox` assumptions. If it is unavailable, review the content against an abstract boundary contract and mark manager-specific timing, permission, and integration claims `UNVERIFIED`; do not invent a manager contract. Read [compatibility.md](compatibility.md) only for an in-scope portability claim. If official sources disagree, preserve the conflict.

## Simulation contract

Use a small injected harness rather than live manager or network access. Every stub should record its inputs and expose deterministic success, rejection, timeout, duplicate, abort, and late-result events as relevant:

- storage: per-script key space, missing-key default, JSON-serializability failure, local versus remote change callback;
- HTTP: status/headers/body, redirect or origin policy, `onload`/`onerror`/`ontimeout`, abort, and promise rejection;
- DOM injection: target document/frame, returned element, insertion order, duplicate calls, and removal;
- menu/UI: registration ID, callback event, unregister, notification/clipboard failure;
- tabs/downloads: returned controller, close/abort, completion/error;
- resources/context: declared versus missing resource, page-world versus sandbox-world access, and opaque URL handling.

Assert both the stub contract and the script's state transitions. A stub pass is `FIXTURE_EXECUTED`, not manager integration proof. Keep live requests, real storage, clipboard, notifications, tabs, and downloads disabled unless explicitly authorized.

## Freshness boundary

Vendor APIs and documentation change. The linked pages are navigation aids, not permanent truth; stale or conflicting information must narrow the claim, not block static content analysis.

## Primary references

- [Violentmonkey privileged APIs](https://violentmonkey.github.io/api/gm/) — broad API index and compatibility notes.
- [Violentmonkey metadata block](https://violentmonkey.github.io/api/metadata-block/) — grants, matching, injection, and metadata behavior.
- [Tampermonkey documentation](https://www.tampermonkey.net/documentation.php) — manager-specific API details and version notes.
