(function (global) {
    "use strict";

    if (global.nextBrowserTick) {
        return;
    }

    function canUsePostMessage() {
        if (global.postMessage && !global.importScripts && global.addEventListener) {
            var ok = true;
            var mfn = function () {
                ok = false;
            }
            global.addEventListener('message', mfn, false);
            global.postMessage("", "*");
            global.removeEventListener('message', mfn, false);
            return ok;
        }
    }

    if (!canUsePostMessage()) {
        console.warn("Your browser environment cannot use nextBrowserTick");
        return;
    }

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    const PromiseExternal = ((resolve_, reject_) => {
        const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
        return class PromiseExternal extends Promise {
            constructor(cb = h) {
                super(cb);
                if (cb === h) {
                    /** @type {(value: any) => void} */
                    this.resolve = resolve_;
                    /** @type {(reason?: any) => void} */
                    this.reject = reject_;
                }
            }
        };
    })();

    let promise = null;

    const uid = (Math.random() + 8).toString().slice(2);
    const messageString = `$$nextBrowserTick$$${uid}$$`
    global[messageString] = 1;
    const mfn = (event) => {
        const data = promise !== null ? (event || 0).data : 0;
        if (data === messageString) {
            const { target, source } = event || {};
            if (target && source === target) {
                promise.resolve();
                promise = null;
            }
        }
    }
    global.addEventListener('message', mfn, false);

    global.nextBrowserTick = (f) => {
        if (!promise) {
            promise = new PromiseExternal();
            global.postMessage(messageString, "*");
        }
        promise.then(f).catch(console.warn);
    }

}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));
