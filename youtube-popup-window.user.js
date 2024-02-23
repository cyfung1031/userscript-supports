// ==UserScript==
// @name                YouTube Popup Window
// @name:zh-TW          YouTube Popup Window
// @name:ja             YouTube Popup Window
// @namespace           http://tampermonkey.net/
// @version             0.2.2
// @description         Enhances YouTube with a popup window feature.
// @description:zh-TW   透過彈出視窗功能增強YouTube。
// @description:ja      YouTubeをポップアップウィンドウ機能で強化します。
// @author              CY Fung
// @license             MIT
// @match               https://www.youtube.com/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require             https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1.4.1
// @grant               GM_registerMenuCommand
// @allFrames           true
// ==/UserScript==

(async function () {
    'use strict';
    const shortcutKey = 'ctrlcmd-alt-keya';

    const winName = 'x4tGg';
    const styleName = 'rCbM3';

    const observablePromise = (proc, timeoutPromise) => {
        let promise = null;
        return {
            obtain() {
                if (!promise) {
                    promise = new Promise(resolve => {
                        let mo = null;
                        const f = () => {
                            let t = proc();
                            if (t) {
                                mo.disconnect();
                                mo.takeRecords();
                                mo = null;
                                resolve(t);
                            }
                        }
                        mo = new MutationObserver(f);
                        mo.observe(document, { subtree: true, childList: true })
                        f();
                        timeoutPromise && timeoutPromise.then(() => {
                            resolve(null)
                        });
                    });
                }
                return promise
            }
        }
    }

    function getVideo() {
        return document.querySelector('.video-stream.html5-main-video');
    }

    function registerKeyboard(o) {

        const { openPopup } = o;

        const { KeyboardService } = VM.shortcut;

        const service = new KeyboardService();

        service.setContext('activeOnInput', false);

        async function updateActiveOnInput() {
            const elm = document.activeElement;
            service.setContext('activeOnInput', elm instanceof HTMLInputElement || elm instanceof HTMLTextAreaElement);
        }

        document.addEventListener('focus', (e) => {
            updateActiveOnInput();
        }, true);

        document.addEventListener('blur', (e) => {
            updateActiveOnInput();
        }, true);

        service.register(shortcutKey, openPopup, {
            condition: '!activeOnInput',
        });
        service.enable();

    }

    if (window.name === winName && window === top) {

        if (!document.head) await observablePromise(() => document.head).obtain();

        let style = document.createElement('style');
        style.id = styleName;

        style.textContent = `
        *[class][id].style-scope.ytd-watch-flexy {
            min-width: unset !important;
            min-height: unset !important;
        }
        `

        document.head.appendChild(style);

    } else if (window !== top && top.name === winName) {

        if (!document.head) await observablePromise(() => document.head).obtain();

        let style = document.createElement('style');
        style.id = styleName;

        style.textContent = `
        * {
            min-width: unset !important;
            min-height: unset !important;
        }
        `

        document.head.appendChild(style);


    } else if (window === top) {

        function openPopup() {

            const currentUrl = window.location.href;
            const ytdAppElm = document.querySelector('ytd-app');
            if (!ytdAppElm) return;
            const rect = ytdAppElm.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const popupOptions = `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${w},height=${h}`;

            let video = getVideo();

            if (video) {
                video.pause();
            }
            const win = window.open(currentUrl, '', popupOptions);
            win.name = winName;

            const b = document.querySelector('#x4tGg');
            if (b) b.remove();

        }

        GM_registerMenuCommand('Open Popup Window', function () {

            if (document.querySelector('#x4tGg')) return;

            const div = document.body.appendChild(document.createElement('div'));
            div.id = 'x4tGg';
            div.textContent = 'Click to Open Popup'

            Object.assign(div.style, {
                'position': 'fixed',
                'left': '50vw',
                'top': '50vh',
                'padding': '28px',
                'backgroundColor': 'rgb(56, 94, 131)',
                'color': '#fff',
                'borderRadius': '16px',
                'fontSize': '18pt',
                'zIndex': '9999',
                'transform': 'translate(-50%, -50%)'
            })

            div.onclick = function () {
                openPopup();
            }

        });

        registerKeyboard({ openPopup });

    }
    // Your code here...

})();
