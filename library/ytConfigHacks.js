// ==UserScript==
// @name         ytConfigHacks
// @description  To provide a way to hack the yt.config_ such as EXPERIMENT_FLAGS
// @author       CY Fung
// @version      0.4.3
// @supportURL   https://github.com/cyfung1031/userscript-supports/
// @license      MIT
// @match        https://www.youtube.com/*
// ==/UserScript==

/*

MIT License

Copyright (c) 2021-2023 cyfung1031

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

(() => {

  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (this instanceof Window ? this : window);

  if (!win._ytConfigHacks) {

    let remainingCalls = 4;

    /** @extends {Set<Function>} */
    class YtConfigHacks extends Set {
      add(value) {
        if (remainingCalls <= 0) return console.warn("yt.config_ is already applied on the page.");
        if (typeof value === 'function') super.add(value);
      }
    }

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    const _ytConfigHacks = win._ytConfigHacks = new YtConfigHacks();

    let restoreOriginalYtCSI = () => {
      const originalYtcsi = win.ytcsi.originalYtcsi;
      if (originalYtcsi) {
        // delete win.ytcsi; // optional
        win.ytcsi = originalYtcsi;
        restoreOriginalYtCSI = null;
      }
    };

    let isValidConfig = null;
    const detectConfigDone = () => {
      if (remainingCalls >= 1) {
        const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;
        if (typeof config.INNERTUBE_API_KEY === 'string' && typeof config.EXPERIMENT_FLAGS === 'object') {
          if (--remainingCalls <= 0) restoreOriginalYtCSI && restoreOriginalYtCSI();
          isValidConfig = true;
          for (const hook of _ytConfigHacks) {
            hook(config);
          }
        }
      }
    };

    let restoreOriginalYtCSICount = 1;
    const hookIntoYtCSI = (ytcsi) => {
      if (ytcsi = (ytcsi || win.ytcsi)) {
        // delete win.ytcsi; // optional
        win.ytcsi = new Proxy(ytcsi, {
          get(target, prop, receiver) {
            if (prop === 'originalYtcsi') return target;
            detectConfigDone();
            if (isValidConfig && --restoreOriginalYtCSICount <= 0) restoreOriginalYtCSI && restoreOriginalYtCSI();
            return target[prop];
          }
        });
        return true;
      }
    };

    hookIntoYtCSI() || Object.defineProperty(win, 'ytcsi', {
      get() {
        return undefined;
      },
      set(newValue) {
        if (newValue) {
          delete win.ytcsi;
          hookIntoYtCSI(newValue);
        }
        return true;
      },
      enumerable: false,
      configurable: true,
    });

    const { addEventListener, removeEventListener } = Document.prototype;

    new Promise(resolve => {
      if (typeof AbortSignal !== "undefined") {
        addEventListener.call(document, 'yt-page-data-fetched', resolve, { once: true });
        addEventListener.call(document, 'yt-navigate-finish', resolve, { once: true });
        addEventListener.call(document, 'spfdone', resolve, { once: true });
      } else {
        const eventTriggerFn = () => {
          resolve();
          removeEventListener.call(document, 'yt-page-data-fetched', eventTriggerFn, false);
          removeEventListener.call(document, 'yt-navigate-finish', eventTriggerFn, false);
          removeEventListener.call(document, 'spfdone', eventTriggerFn, false);
        };
        addEventListener.call(document, 'yt-page-data-fetched', eventTriggerFn, false);
        addEventListener.call(document, 'yt-navigate-finish', eventTriggerFn, false);
        addEventListener.call(document, 'spfdone', eventTriggerFn, false);
      }
    }).then(detectConfigDone);

    new Promise(resolve => {
      if (typeof AbortSignal !== "undefined") {
        addEventListener.call(document, 'yt-action', resolve, { once: true, capture: true });
      } else {
        const eventTriggerFn = () => {
          resolve();
          removeEventListener.call(document, 'yt-action', eventTriggerFn, true);
        };
        addEventListener.call(document, 'yt-action', eventTriggerFn, true);
      }
    }).then(detectConfigDone);

    function onReady(event) {
      detectConfigDone();
      event && win.removeEventListener("DOMContentLoaded", onReady, false);
    }

    Promise.resolve().then(() => {
      if (document.readyState !== 'loading') {
        onReady();
      } else {
        win.addEventListener("DOMContentLoaded", onReady, false);
      }
    });

  }

})();
