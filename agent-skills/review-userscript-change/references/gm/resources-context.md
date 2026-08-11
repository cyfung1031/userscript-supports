# GM resources, context, and sandbox APIs

Review `GM_getResourceText`, `GM_getResourceURL`, `GM.getResourceText`, `GM.getResourceUrl`, `GM.info`, `unsafeWindow`, and related context crossings as identity and privilege boundaries.

## Contract to bind

- Resource access depends on matching `@resource` declarations and exact names; missing or changed resources are failure cases, not empty strings to assume away.
- Resource URLs are opaque manager-provided URLs and can be affected by CSP, document ownership, or manager version. Do not assume a `blob:` or `data:` scheme without a bound manager/version.
- `GM.getResourceText` is synchronous in the current Violentmonkey contract, while `GM.getResourceUrl` is asynchronous; legacy resource functions and older namespaced spellings can differ. Bind the manager/version.
- `GM.info` is manager-provided metadata; do not use one manager's fields as a portable contract without checking.
- Do not equate `unsafeWindow` with the page world. In Violentmonkey, effective `@inject-into` mode controls the accessible global; bind `GM_info.injectInto` and treat page-world access as unverified unless observed. Validate values and isolate writes.
- The historical `GM.getResourceURL` spelling was used by a limited older VM range; prefer the documented `GM.getResourceUrl` after binding the target version.

## Deterministic probes

Stub declared/missing resources, changed resource content, blob/data URL selection, page-world mutation, hostile globals, and absent fields. Verify origin checks, type checks, and cleanup. Do not load remote `@require` code or real page globals during a source review.

Resources are predeclared through `@resource`; missing or changed declarations are part of the input contract. Primary references: [Tampermonkey resource/context documentation](https://www.tampermonkey.net/documentation.php?locale=en&q=GM_getResource), [Tampermonkey resource metadata](https://www.tampermonkey.net/documentation.php?locale=en&q=externals), [Violentmonkey privileged APIs](https://violentmonkey.github.io/api/gm/).
