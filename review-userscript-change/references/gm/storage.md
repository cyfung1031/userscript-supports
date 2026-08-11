# GM storage APIs

Review `GM_getValue`/`GM.setValue` families as a per-script persistence boundary. Also route `GM_getValues`/`GM.setValues`/`GM.deleteValues` and namespaced equivalents when present. Check key identity, default behavior, serializability, migration/versioning, concurrent writers, and whether the caller expects synchronous or promise timing.

## Contract to bind

- `getValue(key, defaultValue)` returns the stored value or the supplied default.
- `setValue(key, value)` persists a supported serializable value; do not assume DOM objects, functions, or cyclic objects round-trip.
- `deleteValue(key)` removes the key; `listValues()` reports keys for this script's store.
- Bulk `getValues`, `setValues`, and `deleteValues` methods are version-bound; verify the exact input shape and return timing before using them as a portable contract.
- `addValueChangeListener` receives key, old value, new value, and a local/remote indicator where supported; remove the listener on teardown.
- Tampermonkey documents legacy setters as synchronous/no-return and namespaced storage plus listener registration/removal as promise-based. Current Violentmonkey documentation describes legacy value calls as synchronous while namespaced storage methods are asynchronous, with listener timing requiring its own manager/version check. Bind the manager/version rather than inferring timing from spelling alone.

## Deterministic probes

Stub missing keys, `null`, malformed migrated data, serialization failure, local writes, remote writes, deletion, and two writes completing out of order. Treat `undefined` as the missing/created/deleted sentinel unless the target manager documents otherwise; do not assume it is a persisted value. Verify that a rejected write does not advance in-memory state and that a late read cannot overwrite a newer value.

Primary references: [Tampermonkey GM values](https://www.tampermonkey.net/documentation.php?locale=en&q=GM_values), [Violentmonkey storage APIs](https://violentmonkey.github.io/api/gm/).
