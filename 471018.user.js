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
// @name                YouTube Native - Vanilla Engine
// @namespace           UserScript
// @match               https://www.youtube.com/*
// @grant               none
// @version             0.1.13
// @license             MIT License
// @author              CY Fung
// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/yt-engine.png
// @run-at              document-start
// @unwrap
// @inject-into         page
// @allFrames           true
// @description         (YouTube Experimental) Disable the YouTube engine hacks and just use the native APIs
// ==/UserScript==

((__CONTEXT01__) => {


  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'ikkaorpwuzvt';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = ((async () => { })()).constructor;

  const cleanContext = async (win) => {


    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1'
      let frame = document.getElementById(frameId);
      let removeIframeFn = null;
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = 'vanillajs-iframe-v1';
        frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
        let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
        n.appendChild(frame);
        while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
        const root = document.documentElement;
        root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
        removeIframeFn = (setTimeout) => {
          const removeIframeOnDocumentReady = (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            win = null;
            setTimeout(() => {
              n.remove();
              n = null;
            }, 200);
          }
          if (document.readyState !== 'loading') {
            removeIframeOnDocumentReady();
          } else {
            win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
          }
        }
      }
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      const { requestAnimationFrame, cancelAnimationFrame, getComputedStyle, setInterval, clearInterval, setTimeout, clearTimeout } = fc;
      const res = { requestAnimationFrame, cancelAnimationFrame, getComputedStyle, setInterval, clearInterval, setTimeout, clearTimeout };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      res.animate = fc.Element.prototype.animate;
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  cleanContext(win).then(__CONTEXT02__ => {

    const { requestAnimationFrame, cancelAnimationFrame, getComputedStyle, setInterval, clearInterval, setTimeout, clearTimeout } = __CONTEXT02__;

    const { animate } = __CONTEXT02__;

    const { frames, defineProperty, window, CDATASection, ProcessingInstruction, FocusEvent } = __CONTEXT01__;

    const ENABLE_NATIVE_CONSTRUCTOR_CHECK = false;
    let cids = {};
    function cleanCId(k) {
      Promise.resolve().then(() => clearInterval(cids[k]));
    }


    Object.defineProperty = function (o, p, opts) {

      if (arguments.length !== 3) return defineProperty.apply(this, arguments);

      if (o instanceof Window) {
        if (p === 'getComputedStyle') return;
        if (p === 'Promise' && (p in o)) return; // WaterFox Classic
        if (p === 'customElements' || p === 'Polymer') {
          if (p in o) return; // duplicate declaration?
        }
        const value = opts.value;
        if (value) {
          opts.writable = true;
          opts.configurable = true;
          opts.enumerable = true;
        }
        if (p === 'ytInitialPlayerResponse' || p === 'playerResponse') {
          // Firefox Chatroom? TBC
        } else {
          console.log(923, 'window[p]=', p, opts);
        }
        return defineProperty.call(this, o, p, opts);
      }


      const nativeConstructorCheck = ENABLE_NATIVE_CONSTRUCTOR_CHECK ? (o.constructor + "").indexOf('native code') > 0 : true;

      if (p.startsWith('__shady_')) {

        const { get, value } = opts;
        if (!get) {
          o[p] = value;
          return;
        }

        if (p === '__shady_native_eventPhase') {
          // Event -> __shady_native_eventPhase
          return defineProperty.call(this, o, p, opts);
        }

        let constructor = o instanceof Node ? Node : o instanceof DocumentFragment ? DocumentFragment : o instanceof Document ? Document : null;

        if (!constructor) {
          let constructorName = (o.constructor || 0).name;
          if (constructorName === 'Node') {
            constructor = Node;
          }
        }

        if (constructor && opts && (typeof opts.get === 'function')) {

          if (!(p in o.constructor.prototype) && !(p in o)) {
            defineProperty.call(this, o.constructor.prototype, p, opts);
          }
          return;

        }
        console.log(926, o, p, opts, !!constructor, !!opts, !!(typeof opts.get === 'function'))
        // return;
      }

      if ((p in o) && nativeConstructorCheck) {
        if (o instanceof Text) return;
        if (o instanceof Comment) return;
        if (CDATASection && o instanceof CDATASection) return;
        if (ProcessingInstruction && o instanceof ProcessingInstruction) return;
        if (o instanceof Event) return;
        if (FocusEvent && o instanceof FocusEvent) return;
      }

      return defineProperty.call(this, o, p, opts);
    }

    const asserter = (f) => Promise.resolve().then(() => console.assert(f(), f + ""));

    const setVJS = () => {
      if (window.Promise !== Promise) window.Promise = Promise;
      if (window.getComputedStyle !== getComputedStyle) window.getComputedStyle = getComputedStyle;
      if (Element.prototype.animate !== animate) Element.prototype.animate = animate;
      if (window.requestAnimationFrame !== requestAnimationFrame) window.requestAnimationFrame = requestAnimationFrame
      if (window.cancelAnimationFrame !== cancelAnimationFrame) window.cancelAnimationFrame = cancelAnimationFrame
    };

    const finishFn = () => {
      cids.finish = 0;
      setVJS();
      try {
        document.getElementById('zihrS').remove();
      } catch (e) { }
      cleanCId('timeVJS');
      if (document.isConnected === false) return;
      setTimeout(() => {
        if (document.isConnected === false) return;
        asserter(() => window.Promise === Promise);
        asserter(() => window.getComputedStyle === getComputedStyle);
        asserter(() => Element.prototype.animate === animate);
        asserter(() => window.requestAnimationFrame === requestAnimationFrame);
        asserter(() => window.cancelAnimationFrame === cancelAnimationFrame);

      }, 800);

    };

    function fastenFinishFn() {
      if (cids.finish > 0) {
        clearInterval(cids.finish);
        cids.finish = setTimeout(finishFn, 40);
      }
    }

    function preFinishFn() {
      let mo = new MutationObserver(function () {
        Promise.resolve().then(fastenFinishFn)
        mo.disconnect();
        mo.takeRecords();
        mo = null;
      });
      mo.observe(document, { subtree: true, childList: true });
      return setTimeout(finishFn, 400);
    }

    cids.timeVJS = setInterval(() => {
      if (!cids.finish && ('Polymer' in window)) cids.finish = preFinishFn();
      setVJS();
    }, 1);


    let isInnerFrame = false;
    try {
      isInnerFrame = window !== top && window.document.domain === top.document.domain;
    } catch (e) { }

    if (!isInnerFrame) {

      console.groupCollapsed(
        "%cYouTube Native - Vanilla Engine (Experimental)",
        "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
      );

      console.log("Script is loaded.");
      console.log("This is an experimental script.");
      console.log("If you found any issue in using YouTube, please disable this script to check whether the issue is due to this script or not.");

      console.groupEnd();

    }


  });

})({
  frames,
  defineProperty: Object.defineProperty,
  window,
  CDATASection, ProcessingInstruction, FocusEvent
});
