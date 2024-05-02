// ==UserScript==
// @name         Fix Brave Bug for YouTube Live Chat
// @namespace    UserScripts
// @version      3.0
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

        const pIfr = document.createElement('iframe');
        
        // p.style.display='fixed';
        // p.style.opacity = '0';
        // p.style.width='1px'
        // p.style.height='1px'
        // p.style.left='-9px';
        // p.style.top='-9px';
        
        pIfr.style.display = 'none';
        document.body.appendChild(pIfr);

        let url1 = null;
        let url2 = null;

        const pfn = resolve => {
            pIfr.onload = resolve;
            if (!url1) url1 = URL.createObjectURL(new Blob([], { type: 'text/html' }));
            const c = url1;
            url1 = url2;
            url2 = c;
            pIfr.contentDocument.location.replace(c);
        };

        const urlChanged66 = cnt.__proto__.urlChanged;
        cnt.__proto__.urlChanged = function () {

            const pr = (new Promise(pfn)).catch(() => { });
            pr.then(() => {
                pIfr.onload = null;
                arguments.length === 0 ? urlChanged66.call(this) : urlChanged66.apply(this, arguments);
            });

        }

    })();
})();
