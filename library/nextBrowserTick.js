(function (world) {
    "use strict";

    if (world.nextBrowserTick) {
        return;
    }

    function canUsePostMessage() {
        if (world.postMessage && !world.importScripts && world.addEventListener) {
            let ok = true;
            let mfn = () => {
                ok = false;
            }
            world.addEventListener('message', mfn, false);
            world.postMessage("", "*");
            world.removeEventListener('message', mfn, false);
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

    let tmp;
    do {
        const uid = (Math.random() + 8).toString().slice(2);
        tmp = `$$nextBrowserTick$$${uid}$$`;
    } while (tmp in world);
    const messageString = tmp;
    world[messageString] = 1;
    const mfn = (evt) => {
        const data = promise !== null ? (evt || 0).data : 0;
        if (data === messageString && evt.source === (evt.target || 1)) {
            promise.resolve(promise = null);
        }
    }
    world.addEventListener('message', mfn, false);

    world.nextBrowserTick = (f) => {
        if (!promise) {
            promise = new PromiseExternal();
            world.postMessage(messageString, "*");
        }
        promise.then(f).catch(console.warn);
    }

}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));
