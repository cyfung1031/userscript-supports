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
// @version             0.3.1
// @description         This Userscript can fix the video sizing issue. Please use it with other Userstyles / Userscripts.
// @description:ja      この Userscript は、動画のサイズ変更の問題を修正できます。 他のユーザースタイル・ユーザースクリプトと合わせてご利用ください。
// @description:zh-TW   此 Userscript 可以解決影片大小變形問題。 請將它與其他Userstyles / Userscripts一起使用。
// @description:zh-CN   此 Userscript 可以解决视频大小变形问题。请将它与其他Userstyles / Userscripts一起使用。
// @namespace           http://tampermonkey.net/
// @author              CY Fung
// @license             MIT License
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @match               https://www.youtube.com/*
// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/youtube-video-resize-fix.png?v1
// @grant               none
// @unwrap
// @allFrames
// @inject-into page
// ==/UserScript==

/* jshint esversion:8 */

(function (__Promise__) {
  'use strict';
  const Promise = __Promise__ // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.
  const elements = {}
  let rid1 = 0
  let rid2 = 0
  /** @type {MutationObserver | null} */
  let attrObserver = null
  /** @type {ResizeObserver | null} */
  let resizeObserver = null
  let isHTMLAttrApplied = false
  const core = {
    begin() {
      document.addEventListener('yt-player-updated', core.hanlder, true)
      document.addEventListener('ytd-navigate-finish', core.hanlder, true)
    },
    hanlder() {
      rid1++
      if (rid1 > 1e9) rid1 = 9
      const tid = rid1
      window.requestAnimationFrame(() => {
        if (tid !== rid1) return
        core.runner()
      })
    },
    async runner() {
      if (!location.href.startsWith('https://www.youtube.com/watch')) return

      elements.ytdFlexy = document.querySelector('ytd-watch-flexy')
      elements.video = document.querySelector('ytd-watch-flexy #movie_player video')
      if (elements.ytdFlexy && elements.video) { } else return
      elements.moviePlayer = elements.video.closest('#movie_player')
      if (!elements.moviePlayer) return

      // resize Video
      let { ytdFlexy } = elements
      if (!ytdFlexy.ElYTL) {
        ytdFlexy.ElYTL = 1
        ytdFlexy.calculateNormalPlayerSize_ = core.resizeFunc(ytdFlexy.calculateNormalPlayerSize_, 1)
        ytdFlexy.calculateCurrentPlayerSize_ = core.resizeFunc(ytdFlexy.calculateCurrentPlayerSize_, 0)
      }
      ytdFlexy = null

      // when video is fetched
      elements.video.removeEventListener('canplay', core.triggerResizeDelayed, false)
      elements.video.addEventListener('canplay', core.triggerResizeDelayed, false)

      // when video is resized
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }
      if (typeof ResizeObserver === 'function') {
        resizeObserver = new ResizeObserver(core.triggerResizeDelayed)
        resizeObserver.observe(elements.moviePlayer)
      }

      // MutationObserver:[collapsed] @ ytd-live-chat-frame#chat
      if (attrObserver) {
        attrObserver.takeRecords()
        attrObserver.disconnect()
        attrObserver = null
      }
      let chat = document.querySelector('ytd-watch-flexy ytd-live-chat-frame#chat')
      if (chat) {
        // resize due to DOM update
        attrObserver = new MutationObserver(core.triggerResizeDelayed)
        attrObserver.observe(chat, { attributes: true, attributeFilter: ["collapsed"] })
        chat = null
      }

      // resize on idle
      core.triggerResizeDelayed()
    },
    resizeFunc(originalFunc, kb) {
      return function () {
        rid2++
        if (!isHTMLAttrApplied) {
          isHTMLAttrApplied = true
          Promise.resolve(0).then(() => {
            document.documentElement.classList.add('youtube-video-resize-fix')
          }).catch(console.warn)
        }
        if (document.fullscreenElement === null) {

          // calculateCurrentPlayerSize_ shall be always return NaN to make correct positioning of toolbars
          if (!kb) return { width: NaN, height: NaN }

          let ret = core.calculateSize()
          if (ret.height > 0 && ret.width > 0) {
            return ret
          }
        }
        return originalFunc.apply(this, arguments)
      }
    },
    calculateSize_() {
      const { moviePlayer, video } = elements
      const rect1 = { width: video.videoWidth, height: video.videoHeight } // native values independent of css rules
      if (rect1.width > 0 && rect1.height > 0) {
        const rect2 = moviePlayer.getBoundingClientRect()
        const aspectRatio = rect1.width / rect1.height
        let h2 = rect2.width / aspectRatio
        let w2 = rect2.height * aspectRatio
        return { rect2, h2, w2 }
      }
      return null
    },
    calculateSize() {
      let rs = core.calculateSize_()
      if (!rs) return { width: NaN, height: NaN }
      const { rect2, h2, w2 } = rs
      if (h2 > rect2.height) {
        return { width: w2, height: rect2.height }
      } else {
        return { width: rect2.width, height: h2 }
      }
    },
    triggerResizeDelayed() {
      rid2++
      if (rid2 > 1e9) rid2 = 9
      const tid = rid2
      window.requestAnimationFrame(() => {
        if (tid !== rid2) return
        let { ytdFlexy } = elements
        let r = false
        const windowSize_ = (ytdFlexy || 0).windowSize_
        if (windowSize_ && typeof ytdFlexy.onWindowResized_ === 'function') {
          try {
            ytdFlexy.onWindowResized_(windowSize_)
            r = true
          } catch (e) { }
        }
        if (!r) window.dispatchEvent(new Event('resize'))
      })
    }
  }
  core.begin()







  // YouTube Watch Page Reflect (WPR)



  // This script enhances the functionality of YouTube pages by reflecting changes in the page state.

  (async function youTubeWPR() {

    // A WeakSet to keep track of elements being monitored for mutations.
    const monitorWeakSet = new WeakSet();

    // Function to reflect the current state of the YouTube page.
    function _reflect() {
      const youtubeWpr = document.documentElement.getAttribute("youtube-wpr");
      let s = '';

      // Check if the current page is the video watch page.
      if (location.pathname === '/watch') {
        let watch = document.querySelector("ytd-watch-flexy");
        let chat = document.querySelector("ytd-live-chat-frame#chat");

        if (watch) {
          // Determine the state of the chat and video player on the watch page and generate a state string.
          s += !chat ? 'h0' : (chat.hasAttribute('collapsed') || !document.querySelector('iframe#chatframe')) ? 'h1' : 'h2';
          s += watch.hasAttribute('is-two-columns_') ? 's' : 'S';
          s += watch.hasAttribute('fullscreen') ? 'F' : 'f';
          s += watch.hasAttribute('theater') ? 'T' : 't';
        }
      }

      // Update the reflected state if it has changed.
      if (s !== youtubeWpr) {
        document.documentElement.setAttribute("youtube-wpr", s);
      }
    }

    // Function to reflect changes in specific attributes of monitored elements.
    function reflect(nodeName, attrNames, forced) {
      if (!forced) {
        let skip = true;
        for (const attrName of attrNames) {
          if (nodeName === 'ytd-live-chat-frame') {
            if (attrName === 'collapsed') skip = false;
          } else if (nodeName === 'ytd-watch-flexy') {
            if (attrName === 'is-two-columns_') skip = false;
            else if (attrName === 'fullscreen') skip = false;
            else if (attrName === 'theater') skip = false;
          }
        }
        if (skip) return;
      }

      // Log the mutated element and its attributes.
      // console.log(nodeName, attrNames);

      // Call _reflect() to update the reflected state.
      _reflect();
    }

    // Callback function for the MutationObserver that tracks mutations in monitored elements.
    function callback(mutationsList) {
      const attrNames = new Set();
      let nodeName = null;
      for (const mutation of mutationsList) {
        if (nodeName === null && mutation.target) nodeName = mutation.target.nodeName.toLowerCase();
        attrNames.add(mutation.attributeName);
      }
      reflect(nodeName, attrNames, false);
    }

    // Function to start monitoring an element for mutations.
    function monitor(element) {
      if (!element) return;
      if (monitorWeakSet.has(element)) {
        return;
      }

      monitorWeakSet.add(element);

      const observer = new MutationObserver(callback);
      observer.observe(element, { attributes: true });

      return 1;
    }

    let timeout = 0;

    // Function to monitor relevant elements and update the reflected state.
    let g = (forced) => {
      let b = 0;
      b = b | monitor(document.querySelector("ytd-watch-flexy"));
      b = b | monitor(document.querySelector("ytd-live-chat-frame#chat"));
      if (b || forced) {
        _reflect();
      }
    }

    // Event handler function that triggers when the page finishes navigation or page data updates.
    let eventHandlerFunc = async () => {
      timeout = Date.now() + 800;
      g(1);
    }

    let loadState = 0;

    // Function to initialize the script and start monitoring the page.
    async function actor() {
      if (loadState === 0) {
        if (!document.documentElement.hasAttribute("youtube-wpr")) {
          loadState = 1;
          document.documentElement.setAttribute("youtube-wpr", "");
          document.addEventListener("yt-navigate-finish", eventHandlerFunc, false);
          document.addEventListener("yt-page-data-updated", eventHandlerFunc, false);
        } else {
          loadState = -1;
          document.removeEventListener("yt-page-data-fetched", actor, false);
          return;
        }
      }
      if (loadState === 1) {
        timeout = Date.now() + 800;
        // Function to continuously monitor elements and update the reflected state.
        let pf = () => {
          g(0);
          if (Date.now() < timeout) requestAnimationFrame(pf);
        };
        pf();
      }
    }

    // Event listener that triggers when page data is fetched.
    document.addEventListener("yt-page-data-fetched", actor, false);
  })();


})(Promise);
