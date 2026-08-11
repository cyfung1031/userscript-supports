# Network and storage module

Load when the diff changes fetch/XHR, `GM.xmlHttpRequest`, storage, cache, IndexedDB, messaging, or retry behavior.

Check authorization and origin scope, request cancellation, timeout/retry duplication, response validation, cache invalidation, serialization, concurrent writers, error visibility, and cleanup. Distinguish page-context requests from manager-privileged requests. Use a local stub for deterministic success/failure/late-result cases; use external integration evidence only when the actual manager and host are observed.

Never include secrets or real private data in fixtures. Treat page-provided strings, remote responses, and stored values as hostile data during review.
