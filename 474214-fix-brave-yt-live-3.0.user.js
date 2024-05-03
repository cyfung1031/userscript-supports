// ==UserScript==
// @name         Fix Brave Bug for YouTube Live Chat
// @namespace    UserScripts
// @version      3.9
// @description  To Fix Brave Bug for YouTube Live Chat
// @author       CY Fung
// @license      MIT
// @icon         https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@main/icons/brave.png
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @unwrap
// @inject-into  page
// ==/UserScript==

(() => {

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor;

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

    const _ytIframeReloadDelay_ = window._ytIframeReloadDelay_ = window._ytIframeReloadDelay_ || (function () {
        let pIfr = 0;
        let url1 = null;
        let url2 = null;
        const pfn = resolve => {
            if (!pIfr) {
                pIfr = document.getElementById('d8y9c');
                if (!pIfr) {
                    let tp = document.createElement('template');
                    tp.innerHTML = '<iframe id="d8y9c" style="display:none" sandbox="allow-same-origin"></iframe>';
                    pIfr = tp.content.firstElementChild;
                    tp = null;
                    (document.body || document.documentElement).appendChild(pIfr);
                }
            }
            pIfr.onload = resolve;
            if (!url1) url1 = URL.createObjectURL(new Blob([], { type: 'text/html' }));
            const c = url1;
            url1 = url2;
            url2 = c;
            pIfr.contentDocument.location.replace(c);
        };
        let aLock = Promise.resolve();
        return (() => {
            const p = aLock = aLock.then(() => new Promise(pfn).catch(console.warn)).then(() => {
                pIfr.onload = null;
            });
            return p.then();
        });
    })();

    (async () => {
        'use strict';

        await customElements.whenDefined('ytd-live-chat-frame');

        const chat = document.createElement('ytd-live-chat-frame');

        if (!chat || chat.is !== 'ytd-live-chat-frame') return;

        const cnt = insp(chat);
        const cProto = cnt.constructor.prototype || 0;

        if (typeof cProto.urlChanged !== 'function' || cProto.urlChanged66) return;

        cProto.urlChanged66 = cProto.urlChanged;
        let rz = 0;
        let mz = '';
        cProto.urlChanged = function () {
            const chatframe = this.chatframe || (this.$ || 0).chatframe;
            if (!chatframe || !this.url) return;
            let loc = '';
            try {
                loc = chatframe.contentDocument.location.href
            } catch (e) { }
            if (loc === this.url) return;
            const t = `${loc}->${this.url}`;
            if (t === mz) return;
            mz = t;
            if (rz > 1e9) rz = 9;
            const tz = ++rz;
            _ytIframeReloadDelay_().then(() => {
                if (tz !== rz) return;
                arguments.length === 0 ? this.urlChanged66() : this.urlChanged66(...arguments);
            });
        }

    })();
})();
