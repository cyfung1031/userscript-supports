// ==UserScript==
// @name         YouTube Popup Window
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Enhances YouTube with a popup window feature.
// @author       CY Fung
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @allFrames
// ==/UserScript==

(function $$() {
    'use strict';
    const winName = 'x4tGg';
    const styleName = 'rCbM3';

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


            let video = document.querySelector('#player video');

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

    }
    // Your code here...
})();