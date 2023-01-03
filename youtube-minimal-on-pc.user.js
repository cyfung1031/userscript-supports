/*

MIT License

Copyright 2023 CY Fung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
// ==UserScript==
// @name         YouTube Minimal on PC
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Watch YouTube with the least CPU usage
// @author       CY Fung
// @supportURL   https://github.com/cyfung1031/userscript-supports
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js#sha512=wT7uPE7tOP6w4o28u1DN775jYjHQApdBnib5Pho4RB0Pgd9y7eSkAV1BTqQydupYDB9GBhTcQQzyNMPMV3cAew==
// @run-at       document-start
// ==/UserScript==
"use strict";

/* global Cookies */

(function () {
    "use strict";

    function addParam(u, s) {
        if (typeof u === 'string') {
            u += (u.indexOf('?') > 0 ? '&' : '?') + s
        }
        return u
    }

    let mUrl = Cookies.get("userjs-ym-url", { domain: "youtube.com", secure: true });
    if (mUrl) {
        Cookies.remove("userjs-ym-url", { domain: "youtube.com", secure: true });
        mUrl = addParam(mUrl, 'app=' + (mUrl.charAt(8) === 'w' ? 'desktop' : 'm'))
        location.replace(mUrl);
        return;
    }

    function getUrl() {
        return location.href.replace(/(?<=[&?])(persist_app|app)=\w+(&|$)/g, '').replace(/[?&]$/, '')
    }

    let href = getUrl() || '';
    let hrefC8 = href.charAt(8) || '';

    let iAmDesktop = hrefC8 === 'w';
    let iAmMini = hrefC8 === 'm';

    let redirection = false

    if (href.indexOf(".youtube.com/watch") >= 0) {
        redirection = true
    } else if (href.endsWith('youtube.com/')) {
        redirection = true
    }

    function addMenuCommand(s, url, b) {

        GM_registerMenuCommand(s, function () {
            if (redirection) {
                let h = getUrl()
                if (b) h = h.replace("https://www.youtube.com/", "https://m.youtube.com/");
                else h = h.replace("https://m.youtube.com/", "https://www.youtube.com/");
                Cookies.set("userjs-ym-url", h, { domain: "youtube.com", secure: true });
            }
            location.replace(url);
        });

    }
    if (iAmDesktop) {
        addMenuCommand("Force YouTube Mini", "https://m.youtube.com/?persist_app=1&app=m", true);
        addMenuCommand("Normal YouTube Mini", "https://m.youtube.com/?persist_app=0&app=m", true);

    } else if (iAmMini) {
        addMenuCommand("Force YouTube Dekstop", "http://www.youtube.com/?persist_app=1&app=desktop", false);
        addMenuCommand("Normal YouTube Dekstop", "http://www.youtube.com/?persist_app=0&app=desktop", false);

    }

    addMenuCommand = null

    // Your code here...
})();