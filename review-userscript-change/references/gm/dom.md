# GM DOM injection APIs

Review `GM_addStyle`/`GM.addStyle` and `GM_addElement`/`GM.addElement` as privileged DOM producers. The API may insert into a manager-selected document or style context, so the script must not silently assume the page document, an iframe document, or a particular insertion order.

## Contract to bind

- Current Violentmonkey documentation describes `GM_addStyle(css)` and `GM.addStyle(css)` as returning the injected `<style>` element synchronously. Older VM versions exposed an imitation Promise for `GM_addStyle`; bind the target version if code chains the result.
- `GM_addElement` and `GM.addElement` are synchronous in the current VM contract. They create an element with string HTML attributes, except `textContent`, and may accept an explicit parent; Tampermonkey documents two signatures and `null` on error. Bind the exact manager/version signature and default-parent algorithm.
- Check whether the returned node is immediately usable, which document owns it, and whether the script can remove or replace it during reinjection.
- CSS injection does not prove layout, cascade order, CSP compatibility, first paint, or cross-frame visibility.

## Deterministic probes

Stub the target document and record element type, parent, attributes, text, insertion order, duplicate injection, navigation/reinjection, and cleanup. For style content, run static selector/cascade checks before any optional browser fixture.

Primary references: [Tampermonkey GM_addStyle](https://www.tampermonkey.net/documentation.php?locale=en&q=GM_addStyle), [Tampermonkey GM_addElement](https://www.tampermonkey.net/documentation.php?locale=en&q=GM_addElement), [Violentmonkey privileged APIs](https://violentmonkey.github.io/api/gm/).
