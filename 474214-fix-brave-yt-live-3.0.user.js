// ==UserScript==
// @name         Fix Brave Bug for YouTube Live Chat
// @namespace    UserScripts
// @version      3.23
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

    const { _setAttribute, _insertBefore } = (() => {
        let _setAttribute = Element.prototype.setAttribute;
        try {
            _setAttribute = ShadyDOM.nativeMethods.setAttribute;
        } catch (e) { }
        let _insertBefore = Node.prototype.insertBefore;
        try {
            _insertBefore = ShadyDOM.nativeMethods.insertBefore;
        } catch (e) { }
        return { _setAttribute, _insertBefore };
    })();

    const getDMHelper = () => {
        let _dm = document.getElementById('d-m');
        if (!_dm) {
            _dm = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            _dm.id = 'd-m';
            _insertBefore.call(document.documentElement, _dm, document.documentElement.firstChild);
        }
        const dm = _dm;
        dm._setAttribute = _setAttribute;
        let j = 0;
        let attributeName_;
        while (dm.hasAttribute(attributeName_ = `dm-${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`)) {
            // none
        }
        const attributeName = attributeName_;
        let qr = null;
        const mo = new MutationObserver(() => {
            if (qr !== null) {
                if (j > 8) j = 0;
                qr = (qr(), null);
            }
        });
        mo.observe(document, { childList: true, subtree: true, attributes: true });
        return (resolve) => {
            if (!qr) dm._setAttribute(attributeName, ++j);
            return qr = resolve;
            // return qr = afInterupter = resolve;
        };
    };

    (async () => {
        'use strict';

        await customElements.whenDefined('ytd-live-chat-frame');

        const chat = document.createElement('ytd-live-chat-frame');

        if (!chat || chat.is !== 'ytd-live-chat-frame') return;

        const dmPN = getDMHelper();

        let _dmPromise = null;
        const getDMPromise = () => {
            return (_dmPromise || (_dmPromise = (new Promise(dmPN)).then(() => {
                _dmPromise = null;
            })))
        };

        const cnt = insp(chat);
        const cProto = cnt.constructor.prototype || 0;


        if (typeof cProto.urlChanged === 'function' && !cProto.urlChanged66 && !cProto.urlChangedAsync12) {
            cProto.urlChanged66 = cProto.urlChanged;
            let ath = 0;
            cProto.urlChangedAsync12 = async function () {
                if (ath > 1e9) ath = 9;
                const t = ++ath;
                const chatframe = this.chatframe || (this.$ || 0).chatframe || 0;
                if (chatframe.contentDocument === null) await Promise.resolve();
                if (t !== ath) return;
                await getDMPromise();
                if (t !== ath) return;
                this.urlChanged66();
            }
            cProto.urlChanged = function () {
                this.urlChangedAsync12();
            }
        }


    })();
})();
