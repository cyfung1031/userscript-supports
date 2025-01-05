if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
    let s = s => s;
    trustedTypes.createPolicy('default', { createHTML: s, createScriptURL: s, createScript: s });
}