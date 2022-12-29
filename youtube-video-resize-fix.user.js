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
// @name                YouTube Video Resize Fix
// @name:ja             YouTube Video Resize Fix
// @name:zh-TW          YouTube Video Resize Fix
// @name:zh-CN          YouTube Video Resize Fix
// @version             0.1.0
// @description         This Userscript can fix the video sizing issue. Please use it with other Userstyles / Userscripts.
// @description:ja      この Userscript は、動画のサイズ変更の問題を修正できます。 他のユーザースタイル・ユーザースクリプトと合わせてご利用ください。
// @description:zh-TW   此 Userscript 可以解決影片大小變形問題。 請將它與其他Userstyles / Userscripts一起使用。
// @description:zh-CN   此 Userscript 可以解决视频大小变形问题。请将它与其他Userstyles / Userscripts一起使用。
// @namespace           http://tampermonkey.net/
// @author              CY Fung
// @license             MIT License
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @match               https://www.youtube.com/watch*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant               none
// @unwrap
// @allFrames
// @inject-into page
// ==/UserScript==

/* jshint esversion:8 */

(function () {
  'use strict';
  const elements = {}
  let rid = 0
  /** @type {MutationObserver | null} */
  let observer = null
  const core = {
    begin() {
      document.addEventListener('yt-player-updated', core.hanlder, true)
      document.addEventListener('ytd-navigate-finish', core.hanlder, true)
    },
    hanlder() {
      rid++
      const tid = rid
      window.requestAnimationFrame(() => {
        if (tid !== rid) return
        core.runner()
      })
    },
    async runner() {
      if (!/^https:\/\/www\.youtube\.com\/watch\?/.test(location.href)) return

      elements.ytdFlexy = document.querySelector('ytd-watch-flexy')
      elements.video = document.querySelector('ytd-watch-flexy #movie_player video')
      if (elements.ytdFlexy && elements.video) { } else return

      // resize Video
      let { ytdFlexy } = elements;
      if (!ytdFlexy.ElYTL) {
        ytdFlexy.ElYTL = 1;
        (function (ytdFlexy, calculateNormalPlayerSize_, calculateCurrentPlayerSize_) {
          ytdFlexy.calculateNormalPlayerSize_ = function () {
            return core.isSkip() ? calculateNormalPlayerSize_.call(this) : core.calculateSize();
          };
          ytdFlexy.calculateCurrentPlayerSize_ = function () {
            return core.isSkip() ? calculateCurrentPlayerSize_.call(this) : core.calculateSize();
          };
        })(ytdFlexy, ytdFlexy.calculateNormalPlayerSize_, ytdFlexy.calculateCurrentPlayerSize_);
      }
      ytdFlexy = null

      if (observer) {
        observer.takeRecords()
        observer.disconnect()
        observer = null
      }

      let chat = document.querySelector('ytd-watch-flexy ytd-live-chat-frame#chat')
      if (chat) {
        // resize due to DOM update
        observer = new MutationObserver(core.triggerResize);
        observer.observe(chat, { attributes: true });
        chat = null
      }

      if (typeof window.requestIdleCallback === 'function') await new Promise(resolve => requestIdleCallback(resolve));
      await Promise.resolve(0);
      core.triggerResize()
    },
    isSkip() {
      const { ytdFlexy } = elements
      return ytdFlexy.theater === true || ytdFlexy.isTwoColumns_ === false || document.fullscreenElement !== null
    },
    calculateSize() {
      const { video } = elements
      const rect = video.getBoundingClientRect()
      return { width: rect.width, height: rect.height };
    },
    triggerResize() {
      window.dispatchEvent(new Event('resize'))
    }
  };
  core.begin();
})();