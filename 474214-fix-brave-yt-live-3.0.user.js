// ==UserScript==
// @name         Fix Brave Bug for YouTube Live Chat
// @namespace    UserScripts
// @version      3.33
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

(async () => {
    'use strict';

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor;

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

    const setTimeout_ = setTimeout.bind(window);

    await customElements.whenDefined('ytd-live-chat-frame');

    const chat = document.querySelector('ytd-live-chat-frame') || document.createElement('ytd-live-chat-frame');

    if (!chat || chat.is !== 'ytd-live-chat-frame') return;

    const cnt = insp(chat);
    const cProto = cnt.constructor.prototype || 0;

    if (typeof cProto.urlChanged === 'function' && !cProto.urlChanged66 && !cProto.urlChangedAsync12 && cProto.urlChanged.length === 0) {
        cProto.urlChanged66 = cProto.urlChanged;
        let ath = 0;
        cProto.urlChangedAsync12 = async function () {
            const t = ath = (ath & 1073741823) + 1;
            const chatframe = this.chatframe || (this.$ || 0).chatframe || 0;
            if (chatframe instanceof HTMLIFrameElement) {
                if (chatframe.contentDocument === null) {
                    await Promise.resolve('#').catch(console.warn);
                    if (t !== ath) return;
                }
                const p1 = new Promise(resolve => setTimeout_(resolve, 706)).catch(console.warn);
                const p2 = new Promise(resolve => {
                    (new IntersectionObserver((entries, observer) => {
                        for (const entry of entries) {
                            const rect = entry.boundingClientRect || 0;
                            if (rect.width > 0 && rect.height > 0) {
                                observer.disconnect();
                                resolve('#');
                                break;
                            }
                        }
                    })).observe(chatframe);
                }).catch(console.warn);
                await Promise.race([p1, p2]);
                if (t !== ath) return;
            }
            this.urlChanged66();
        }
        cProto.urlChanged = function () {
            this.urlChangedAsync12();
        }
    }

})();
