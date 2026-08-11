# GM manager compatibility contract

Use this optional module only when a manager/version-specific portability claim is in scope. The same spelling can have different timing, return values, permissions, context, or version support in Tampermonkey and Violentmonkey. It is not required to compile the skill or review scripting content.

## Bind these assumptions

Record the manager and version, browser, metadata grants, `@connect` policy, `@resource` declarations, and effective execution context. Tampermonkey documents `@sandbox` and `GM_info.sandboxMode`; Violentmonkey documents `@inject-into` and `GM_info.injectInto`. Do not translate one metadata key into the other without an explicit compatibility decision.

`@grant` is a capability gate. Verify every privileged call against the declared grants, including namespaced `GM.*` methods. Treat `@grant none`, missing grants, and permission prompts as distinct cases; `GM_info` may remain available even when other GM APIs are not.

## Version-bound examples

- Tampermonkey documents synchronous legacy storage calls and promise-based namespaced storage calls; bulk storage APIs are version-bound.
- Tampermonkey documents legacy `GM_xmlhttpRequest` as returning an abort control and `GM.xmlHttpRequest` as returning a promise with abort; its `synchronous` request flag is unsupported.
- Violentmonkey documents current `GM_addStyle`/`GM.addStyle` and `GM_addElement`/`GM.addElement` as synchronous, while older compatibility behavior may differ.
- Menu return values and download controls have conflicting or versioned documentation across manager/API pages. Require an explicit version before relying on them.

These are review anchors, not universal behavior. Vendor knowledge can be stale or internally inconsistent. If sources disagree or the manager/version is unknown, preserve the conflict, use an abstract or version-specific stub as appropriate, and mark unobserved integration `UNVERIFIED`; continue static content analysis.

Primary references: [Tampermonkey `@grant`](https://www.tampermonkey.net/documentation.php?locale=en&q=grant), [Tampermonkey `@sandbox`](https://www.tampermonkey.net/documentation.php?locale=en&q=sandbox), [Violentmonkey metadata block](https://violentmonkey.github.io/api/metadata-block/), [Violentmonkey privileged APIs](https://violentmonkey.github.io/api/gm/).
