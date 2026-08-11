# GM HTTP APIs

Review `GM_xmlhttpRequest` and `GM.xmlHttpRequest` as a privileged, manager-mediated network boundary. The page's `fetch` policy and the GM request's policy are different; bind `@connect`, target origins, redirects, credentials, response type, and manager version.

## Contract to bind

- Callback form reports lifecycle through handlers such as `onload`, `onerror`, `ontimeout`, and `onabort`, and returns an abort control.
- Tampermonkey documents the promise form as resolving to a response object while exposing abort control; the legacy callback form returns an abort control. Other manager/version combinations must be bound explicitly.
- A successful HTTP response is not automatically an application-success response. Check status, content type, body shape, and final URL before mutating state.
- A missing `@grant GM_xmlhttpRequest` can prevent the API from being available. Tampermonkey documents `@connect` for privileged requests; the reviewed Violentmonkey references do not establish equivalent enforcement. Bind the target manager/version and keep unobserved origin rejection `UNVERIFIED`. Tampermonkey also documents `synchronous` as unsupported.

## Deterministic probes

Use a local stub for success, non-2xx status, invalid JSON, network rejection, timeout, abort, redirect, and a late response after close/reopen. Assert that each path settles exactly once, cleans up listeners/timers, and cannot write stale data into a newer view.

Never execute live requests in a source review. Primary references: [Tampermonkey GM_xmlhttpRequest](https://www.tampermonkey.net/documentation.php?q=GM_xmlhttpRequest), [Violentmonkey privileged APIs](https://violentmonkey.github.io/api/gm/).
