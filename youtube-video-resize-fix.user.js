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
// @version             0.4.2
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
// @allFrames           true
// @inject-into         page
// ==/UserScript==

/* jshint esversion:8 */

((__CONTEXT01__) => {
  'use strict';


  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'ahceihvpbosz';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.
  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1'
      let frame = document.getElementById(frameId);
      let removeIframeFn = null;
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = frameId;
        const blobURL = typeof webkitCancelAnimationFrame === 'function' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null; // avoid Brave Crash
        frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
        let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
        n.appendChild(frame);
        while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
        const root = document.documentElement;
        root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
        if (blobURL) Promise.resolve().then(() => URL.revokeObjectURL(blobURL));

        removeIframeFn = (setTimeout) => {
          const removeIframeOnDocumentReady = (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            e = n;
            n = win = removeIframeFn = 0;
            setTimeout ? setTimeout(() => e.remove(), 200) : e.remove();
          }
          if (!setTimeout || document.readyState !== 'loading') {
            removeIframeOnDocumentReady();
          } else {
            win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
          }
        }
      }
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      try {
        const { requestAnimationFrame, setTimeout, clearTimeout } = fc;
        const res = { requestAnimationFrame, setTimeout, clearTimeout };
        for (let k in res) res[k] = res[k].bind(win); // necessary
        if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
        return res;
      } catch (e) {
        if (removeIframeFn) removeIframeFn();
        return null;
      }
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  cleanContext(win).then(__CONTEXT02__ => {
    if (!__CONTEXT02__) return null;

    const { ResizeObserver } = __CONTEXT01__;
    const { requestAnimationFrame, setTimeout, clearTimeout } = __CONTEXT02__;
    const elements = {};
    let rid1 = 0;
    let rid2 = 0;
    /** @type {MutationObserver | null} */
    let attrObserver = null;
    /** @type {ResizeObserver | null} */
    let resizeObserver = null;
    let isHTMLAttrApplied = false;
    const core = {
      begin() {
        document.addEventListener('yt-player-updated', core.hanlder, true);
        document.addEventListener('ytd-navigate-finish', core.hanlder, true);
      },
      hanlder: () => {
        rid1++;
        if (rid1 > 1e9) rid1 = 9;
        const tid = rid1;
        requestAnimationFrame(() => {
          if (tid !== rid1) return;
          core.runner();
        })
      },
      async runner() {
        if (!location.href.startsWith('https://www.youtube.com/watch')) return;

        elements.ytdFlexy = document.querySelector('ytd-watch-flexy');
        elements.video = document.querySelector('ytd-watch-flexy #movie_player video');
        if (elements.ytdFlexy && elements.video) { } else return;
        elements.moviePlayer = elements.video.closest('#movie_player');
        if (!elements.moviePlayer) return;

        // resize Video
        let { ytdFlexy } = elements;
        if (!ytdFlexy.ElYTL) {
          ytdFlexy.ElYTL = 1;
          const ytdFlexyCnt = insp(ytdFlexy);
          if (typeof ytdFlexyCnt.calculateNormalPlayerSize_ === 'function') {
            ytdFlexyCnt.calculateNormalPlayerSize_ = core.resizeFunc(ytdFlexyCnt.calculateNormalPlayerSize_, 1);
          } else {
            console.warn('ytdFlexyCnt.calculateNormalPlayerSize_ is not a function.')
          }
          if (typeof ytdFlexyCnt.calculateCurrentPlayerSize_ === 'function') {
            ytdFlexyCnt.calculateCurrentPlayerSize_ = core.resizeFunc(ytdFlexyCnt.calculateCurrentPlayerSize_, 0);
          } else {
            console.warn('ytdFlexyCnt.calculateCurrentPlayerSize_ is not a function.')
          }
        }
        ytdFlexy = null;

        // when video is fetched
        elements.video.removeEventListener('canplay', core.triggerResizeDelayed, false);
        elements.video.addEventListener('canplay', core.triggerResizeDelayed, false);

        // when video is resized
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        if (typeof ResizeObserver === 'function') {
          resizeObserver = new ResizeObserver(core.triggerResizeDelayed);
          resizeObserver.observe(elements.moviePlayer);
        }

        // MutationObserver:[collapsed] @ ytd-live-chat-frame#chat
        if (attrObserver) {
          attrObserver.takeRecords();
          attrObserver.disconnect();
          attrObserver = null;
        }
        let chat = document.querySelector('ytd-watch-flexy ytd-live-chat-frame#chat');
        if (chat) {
          // resize due to DOM update
          attrObserver = new MutationObserver(core.triggerResizeDelayed);
          attrObserver.observe(chat, { attributes: true, attributeFilter: ["collapsed"] });
          chat = null;
        }

        // resize on idle
        Promise.resolve().then(core.triggerResizeDelayed);
      },
      resizeFunc(originalFunc, kb) {
        return function () {
          rid2++;
          if (!isHTMLAttrApplied) {
            isHTMLAttrApplied = true;
            Promise.resolve(0).then(() => {
              document.documentElement.classList.add('youtube-video-resize-fix');
            }).catch(console.warn);
          }
          if (document.fullscreenElement === null) {

            // calculateCurrentPlayerSize_ shall be always return NaN to make correct positioning of toolbars
            if (!kb) return { width: NaN, height: NaN };

            let ret = core.calculateSize();
            if (ret.height > 0 && ret.width > 0) {
              return ret;
            }
          }
          return originalFunc.apply(this, arguments);
        }
      },
      calculateSize_() {
        const { moviePlayer, video } = elements;
        const rect1 = { width: video.videoWidth, height: video.videoHeight }; // native values independent of css rules
        if (rect1.width > 0 && rect1.height > 0) {
          const rect2 = moviePlayer.getBoundingClientRect();
          const aspectRatio = rect1.width / rect1.height;
          let h2 = rect2.width / aspectRatio;
          let w2 = rect2.height * aspectRatio;
          return { rect2, h2, w2 };
        }
        return null;
      },
      calculateSize() {
        let rs = core.calculateSize_();
        if (!rs) return { width: NaN, height: NaN };
        const { rect2, h2, w2 } = rs;
        if (h2 > rect2.height) {
          return { width: w2, height: rect2.height };
        } else {
          return { width: rect2.width, height: h2 };
        }
      },
      triggerResizeDelayed: () => {
        rid2++;
        if (rid2 > 1e9) rid2 = 9;
        const tid = rid2;
        requestAnimationFrame(() => {
          if (tid !== rid2) return;
          const { ytdFlexy } = elements;
          let r = false;
          const ytdFlexyCnt = insp(ytdFlexy);
          const windowSize_ = ytdFlexyCnt.windowSize_;
          if (windowSize_ && typeof ytdFlexyCnt.onWindowResized_ === 'function') {
            try {
              ytdFlexyCnt.onWindowResized_(windowSize_);
              r = true;
            } catch (e) { }
          }
          if (!r) window.dispatchEvent(new Event('resize'));
        })
      }
    };
    core.begin();







    // YouTube Watch Page Reflect (WPR)



    // This script enhances the functionality of YouTube pages by reflecting changes in the page state.

    (async function youTubeWPR() {

      // A WeakSet to keep track of elements being monitored for mutations.
      const monitorWeakSet = new WeakSet();

      /** @type {globalThis.PromiseConstructor} */
      const Promise = (async () => { })().constructor;

      // Function to reflect the current state of the YouTube page.
      async function _reflect() {
        await Promise.resolve();

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
      async function reflect(nodeName, attrNames, forced) {
        await Promise.resolve();

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
      let g = async (forced) => {
        await Promise.resolve();
        let b = 0;
        b = b | monitor(document.querySelector("ytd-watch-flexy"));
        b = b | monitor(document.querySelector("ytd-live-chat-frame#chat"));
        if (b || forced) {
          _reflect();
        }
      }

      // Event handler function that triggers when the page finishes navigation or page data updates.
      let eventHandlerFunc = async (evt) => {
        timeout = Date.now() + 800;
        g(1);
        if (evt.type === 'yt-navigate-finish') {
          // delay required when page type is changed for #chat (home -> watch).
          setTimeout(() => {
            g(1);
          }, 80);
          setTimeout(() => {
            g(1);
          }, 180);
        }
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

  });

})({ ResizeObserver });
