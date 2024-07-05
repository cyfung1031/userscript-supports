// ==UserScript==
// @name         Fix Brave Bug for YouTube Live Chat
// @namespace    UserScripts
// @version      3.26
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

        if (typeof cProto.urlChanged === 'function' && !cProto.urlChanged66 && !cProto.urlChangedAsync12 && cProto.urlChanged.length === 0) {
            cProto.urlChanged66 = cProto.urlChanged;
            let ath = 0;
            cProto.urlChangedAsync12 = async function () {
                if (ath > 1e9) ath = 9;
                const t = ++ath;
                const chatframe = this.chatframe || (this.$ || 0).chatframe || 0;
                if (chatframe) {
                    if (chatframe.contentDocument === null) await Promise.resolve();
                    if (t !== ath) return;
                    let win = chatframe.contentWindow;
                    win && await new Promise(r => win.setTimeout(r));
                    win = null;
                    if (t !== ath) return;
                }
                this.urlChanged66();
            }
            cProto.urlChanged = function () {
                this.urlChangedAsync12();
            }
        }


    })();
})();
