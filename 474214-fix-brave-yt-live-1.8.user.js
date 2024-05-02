// ==UserScript==
// @name         Fix Brave Bug for YouTube Live Chat
// @namespace    UserScripts
// @version      1.8
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
    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

    await customElements.whenDefined('ytd-live-chat-frame');

    const chat = document.getElementById('chat') || (await new Promise(resolve => {
        let mo = new MutationObserver(entries => {
            const chat = document.getElementById('chat');
            if (chat && mo) {
                mo.disconnect();
                mo.takeRecords();
                mo = null;
                resolve(chat);
            }
        });
        mo.observe(document, { childList: true, subtree: true })
    }));

    if (!chat || chat.is !== 'ytd-live-chat-frame') return;

    const chatWR = new WeakRef(chat);

    /** @param {HTMLIFrameElement} chatframe */
    const onChatFrameFound = (chatframe) => {
        try {
            const body = chatframe.contentDocument.body;
            let io = new IntersectionObserver(function () {
                if (io) {
                    io.disconnect();
                    io.takeRecords();
                    io = null;
                    const chat = chatWR.deref();
                    if (chat) {
                        const frameLocation = chatframe.contentWindow.location;
                        let src = chatframe.src || '';
                        if (src === '' || src === 'about:blank') {
                            const cnt = insp(chat);
                            src = (cnt.url || '');
                            if (!src.includes('/live_chat')) src = cnt.liveChatPageUrl(cnt.baseUrl, cnt.collapsed, cnt.data, cnt.forceDarkTheme);
                        }
                        if (body.firstChild === null && src.includes('/live_chat') && frameLocation.href === 'about:blank') {
                            frameLocation.replace(src.replace(/&\d+$/, '') + "&1");
                        }
                    }
                    chatframe = null;
                }
            });
            io.observe(body);
        } catch (e) {
            console.warn(e);
        }
    }

    const f = () => {
        const chatframe = ((insp(chat).$ || chat.$ || chat).chatframe || 0);
        if (chatframe instanceof HTMLIFrameElement && chatframe.isConnected === true) {
            if (!chatframe.__b375__) {
                chatframe.__b375__ = 1;
                Promise.resolve(chatframe).then(onChatFrameFound);
            }
        }
    }

    const mo = new MutationObserver(f);

    mo.observe(chat, {
        attributes: true,
        attributeFilter: ['collapsed', 'hidden']
    });

    f();
})();