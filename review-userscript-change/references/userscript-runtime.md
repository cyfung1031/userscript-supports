# Userscript runtime module

Load when the diff changes metadata or userscript-manager APIs. For concrete API calls, also load the matching contract under [gm/](gm/index.md); this module binds the manager, injection, and permission assumptions while the GM modules bind call and return behavior.

If a target manager/version is supplied, bind its assumptions before reviewing `GM_*`, `GM.*`, `unsafeWindow`, `@grant`, `@require`, `@run-at`, `@inject-into`, `@sandbox`, `@match`, and cross-context messaging. Otherwise use manager-agnostic API-boundary contracts and mark exact sync/promise, permission, injection-world, and host/origin behavior `UNVERIFIED`. Tampermonkey and Violentmonkey use different context metadata; bind `GM_info.sandboxMode` or `GM_info.injectInto` only when that manager is in scope.

Treat metadata as executable configuration. Compare base and head directives, duplicate or conflicting grants, changed match scope, new remote requirements, and changes that can run earlier or in a different world. Source parsing proves spelling and presence only; manager behavior is `EXTERNAL_INTEGRATION` unless observed.

Do not execute remote `@require` content during a source review. Record its URL, pin/version, trust boundary, and the missing verification separately.
