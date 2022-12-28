/*

MIT License

Copyright 2022 CY Fung

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
// @name         Reset YouTube Settings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Due to YouTube making changes to its layout, some obsolete settings might remain and cause some problems to you. Use this to reset them.
// @author       CY Fung
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js#sha512=wT7uPE7tOP6w4o28u1DN775jYjHQApdBnib5Pho4RB0Pgd9y7eSkAV1BTqQydupYDB9GBhTcQQzyNMPMV3cAew==
// ==/UserScript==

/* global Cookies */

(function () {
  'use strict';
  GM_registerMenuCommand('Reset YouTube Settings', function () {
    const whilelist = [
      // cookies
      'PREF', 'SID', 'APISID', 'SAPISID', /^__Secure-\w+$/, 'SIDCC',
      // localstorage
      'yt-remote-device-id', 'yt-player-headers-readable',
      'ytidb::LAST_RESULT_ENTRY_KEY',
      'yt-remote-connected-devices', 'yt-player-bandwidth',
      'userscript-tabview-settings', // Tabview Youtube
      /^[\-\w]*h264ify[\-\w]+$/ // h264ify or enhanced-h264ify
    ];
    const cookiesObject = Cookies.get();
    for (const key of Object.keys(cookiesObject)) {
      let value = cookiesObject[key];
      if (typeof value !== 'string') continue;
      if (whilelist.includes(key)) continue;
      let isSkip = false;
      for (const s of whilelist) {
        if (isSkip) break;
        if (typeof s === 'object' && s.constructor.name === 'RegExp') {
          if (s.test(key)) isSkip = true;
        }
      }
      if (isSkip) continue;
      Cookies.remove(key);
      Cookies.remove(key, { domain: 'youtube.com' }); // most youtube cookies use youtube.com
      Cookies.remove(key, { domain: 'www.youtube.com' }); // some cookies such as 'WEVNSM' and 'WNMCID' use www.youtube.com
    }

    const lsObject = localStorage;
    for (const key of Object.keys(lsObject)) {
      let value = lsObject[key];
      if (typeof value !== 'string') continue;
      if (whilelist.includes(key)) continue;
      let isSkip = false;
      for (const s of whilelist) {
        if (isSkip) break;
        if (typeof s === 'object' && s.constructor.name === 'RegExp') {
          if (s.test(key)) isSkip = true;
        }
      }
      if (isSkip) continue;
      localStorage.removeItem(key);
    }
  })
})();