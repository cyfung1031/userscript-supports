// ==UserScript==
// @name                YouTube Popup Window
// @name:zh-TW          YouTube Popup Window
// @name:ja             YouTube Popup Window
// @namespace           http://tampermonkey.net/
// @version             0.2.0
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

(function $$() {
    'use strict';
    const shortcutKey = 'ctrlcmd-a-keya';

    const winName = 'x4tGg';
    const styleName = 'rCbM3';

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

        if (!document.head) return requestAnimationFrame($$);

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


        if (!document.head) return requestAnimationFrame($$);

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

            var currentUrl = window.location.href;
            let rect = document.querySelector('ytd-app').getBoundingClientRect();
            let w = rect.width;
            let h = rect.height;
            var popupOptions = `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${w},height=${h}`;

            let video = getVideo();

            if (video) {
                video.pause();
            }
            let win = window.open(currentUrl, '', popupOptions);
            win.name = winName;

            document.querySelector('#x4tGg').remove();

        }

        GM_registerMenuCommand('Open Popup Window', function () {

            if (document.querySelector('#x4tGg')) return;

            let div = document.body.appendChild(document.createElement('div'));
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
