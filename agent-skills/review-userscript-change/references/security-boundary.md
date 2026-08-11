# Security boundary module

Load when the diff evaluates code, injects HTML, crosses into `unsafeWindow`, handles page-provided strings, or changes a privilege boundary.

Trace each value from its source to its sink. Treat DOM strings, URL/query values, messages, remote responses, stored values, and page globals as hostile until proven otherwise. Check injection, code evaluation, origin validation, privilege escalation, prototype/global mutation, and whether a userscript-manager grant is broader than the consumer requires.

Use static evidence to locate the boundary and a controlled hostile-input fixture to observe it. Do not publish secrets, private data, or weaponizable exploit details. A source pattern is a review trigger, not proof of exploitability or safety.
