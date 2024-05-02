// ==UserScript==
// @name         Fix Brave Bug for YouTube Live Chat
// @namespace    UserScripts
// @version      3.2
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

    (async () => {
        'use strict';

        await customElements.whenDefined('ytd-live-chat-frame');

        const chat = document.createElement('ytd-live-chat-frame');

        if (!chat || chat.is !== 'ytd-live-chat-frame') return;

        const cnt = insp(chat);
        const cProto = cnt.constructor.prototype || 0;

        if(typeof cProto.urlChanged !== 'function' || cProto.urlChanged66) return;

        const _ytIframeReloadDelay_ = window._ytIframeReloadDelay_ = window._ytIframeReloadDelay_ || (function () {
            let pIfr = 0;
            let url1 = null;
            let url2 = null;
            const pfn = resolve => {
                if (!pIfr) {
                    pIfr = document.getElementById('d8y9c');
                    if (!pIfr) {
                        pIfr = document.createElement('iframe');
                        pIfr.id = 'd8y9c';
                        pIfr.style.display = 'none';
                        document.body.appendChild(pIfr);
                    }
                }
                pIfr.onload = resolve;
                if (!url1) url1 = URL.createObjectURL(new Blob([], { type: 'text/html' }));
                const c = url1;
                url1 = url2;
                url2 = c;
                pIfr.contentDocument.location.replace(c);
            };
            return () => (new Promise(pfn)).catch(console.warn).then(() => { pIfr.onload = null; });
        })();
 
        cProto.urlChanged66 = cProto.urlChanged;
        cProto.urlChanged = function () {

            _ytIframeReloadDelay_().then(() => {
                arguments.length === 0 ? this.urlChanged66() : this.urlChanged66(...arguments);
            });

        }

    })();
})();
