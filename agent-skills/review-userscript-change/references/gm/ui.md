# GM UI, menu, tab, clipboard, and download APIs

Review `GM_registerMenuCommand`, `GM_unregisterMenuCommand`, `GM_notification`, `GM_setClipboard`, `GM_openInTab`, and `GM_download` as user-facing or externally visible effects.

## Contract to bind

- Menu registration returns a manager-defined ID, caption, or handle; official Violentmonkey API and generated-type pages record different version cutovers, while Tampermonkey documents an ID. Bind an explicit manager/version before relying on the return value. Legacy unregister returns no value in Tampermonkey. Retain the ID if unregistering or replacing commands. Callback event shape and option support vary by manager/version.
- Notifications, clipboard writes, opening tabs, and downloads can require permission, user gesture, browser policy, or manager UI state. A call returning without throwing does not prove the user-visible effect.
- Tab controls may expose `closed`, `close`, and `onclose`; downloads have separate abort/completion/error behavior. Tampermonkey documents `GM.download` as promise-based with abort, while manager/type references can differ. Do not treat a download as a tab controller; bind the exact API and version.
- Localized or dynamic menu labels can create duplicate registrations if setup runs more than once. Clipboard behavior can also depend on browser permissions, including Firefox-specific permission requirements.

## Deterministic probes

Stub registration IDs, callback events, unregister, notification failure, clipboard rejection, tab close, download success, download failure, and duplicate setup. Verify cleanup and idempotency. Mark actual UI, clipboard, tab, and download behavior `UNVERIFIED` unless observed in the real manager/browser.

Primary references: [Tampermonkey GM_registerMenuCommand](https://www.tampermonkey.net/documentation.php?locale=en&q=GM_registerMenuCommand), [Tampermonkey GM_download](https://www.tampermonkey.net/documentation.php?locale=en&q=GM_download), [Violentmonkey privileged APIs](https://violentmonkey.github.io/api/gm/).
