var nextBrowserTick = typeof nextBrowserTick !== "undefined" && nextBrowserTick.version >= 2 ? nextBrowserTick : (() => {
    "use strict";
    const world = typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : this;

    let ok = true;
    function canUsePostMessage(e) {
        if (e) return (ok = false);
        if (world.postMessage && !world.importScripts && world.addEventListener) {
            world.addEventListener('message', canUsePostMessage, false);
            world.postMessage("$$$", "*");
            world.removeEventListener('message', canUsePostMessage, false);
            return ok;
        }
    }

    if (!canUsePostMessage()) {
        console.warn("Your browser environment cannot use nextBrowserTick");
        return;
    }

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    let promise = null;
    const fns = new Map();

    const {floor, random} = Math;

    let tmp;
    do {
        tmp = `$$nextBrowserTick$$${(random() + 8).toString().slice(2)}$$`;
    } while (tmp in world);
    const messageString = tmp;
    const p = messageString.length + 9;
    world[messageString] = 1;
    const mfn = (evt) => {
        if (fns.size !== 0) {
            const data = (evt || 0).data;
            if (typeof data === 'string' && data.length === p && evt.source === (evt.target || 1)) {
                const fn = fns.get(data);
                if (fn) {
                    if (data[0] === 'p') promise = null;
                    fns.delete(data);
                    fn();
                }
            }
        }
    };
    world.addEventListener('message', mfn, false);

    const g = (f = fns) => {
        if (f === fns) {
            if (promise) return promise;
            let code;
            do {
                code = `p${messageString}${floor(random() * 314159265359 + 314159265359).toString(36)}`;
            } while (fns.has(code));
            promise = new Promise(resolve => {
                fns.set(code, resolve);
            });
            world.postMessage(code, "*");
            code = null;
            return promise;
        } else {
            let code;
            do {
                code = `f${messageString}${floor(random() * 314159265359 + 314159265359).toString(36)}`;
            } while (fns.has(code));
            fns.set(code, f);
            world.postMessage(code, "*");
        }
    };
    g.version = 2;
    return g;

})();