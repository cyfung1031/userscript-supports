// ==UserScript==
// @name         Fix Brave Bug for YouTube Live Chat
// @namespace    UserScripts
// @version      2.0
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

    const setTimeout = window.setTimeout.bind(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
    const delayPn = delay => new Promise((fn => setTimeout(fn, delay)));

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


    let um = null;
    let ur = null;

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

    document.addEventListener('load', function (evt) {
        const target = (evt || 0).target;
        if (target instanceof HTMLIFrameElement) {
            if (target.id === 'chatframe') {
                um && um.resolve();
                um = null;
            }
        }
    }, true);


    (async () => {
        'use strict';

        await customElements.whenDefined('ytd-live-chat-frame');

        const chat = document.createElement('ytd-live-chat-frame');

        if (!chat || chat.is !== 'ytd-live-chat-frame') return;

        const cnt = insp(chat);

        const liveChatPageUrl66 = cnt.__proto__.liveChatPageUrl;
        cnt.__proto__.liveChatPageUrl = function (baseUrl, collapsed, data, forceDarkTheme) {

            let r = liveChatPageUrl66.apply(this, arguments);
            if (r !== ur && typeof r === 'string') {
                ur = r;
                if (!um) um = new PromiseExternal();
            }

            return r;
        }


        const urlChanged66 = cnt.__proto__.urlChanged;

        cnt.__proto__.urlChanged = function () {

            const url = this.url;
            const pm = (typeof url === 'string' && url === ur) ? um : null;
            (pm ? Promise.race([pm, delayPn(1800)]) : Promise.resolve()).then(() => {
                urlChanged66.apply(this, arguments)
            });
        }

    })();
})();
