// ==UserScript==
// @name                中英文之间加空白
// @name:zh-TW          中英文之間加空白

// @version             0.7.5
// @author              CY Fung
// @namespace           UserScript
// @license             MIT
// @require             https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@d3c4230917dbea8c5317b70457cef4160021b298/library/pangu-lite.js

// @match               http://*/*
// @match               https://*/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @exclude             /^shttps?://yuzu-emu.org/*$/

// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/blank-letter.png
// @grant               GM_setValue
// @grant               unsafeWindow
// @run-at              document-start
// @allFrames           true
// @inject-into         content

// @description         自动替你在网页中所有的中文字和半形的英文、数字、符号之间插入空白，让文字变得美观好看。(pangu, 盤古之白)
// @description:zh-TW   自動替你在網頁中所有的中文字和半形的英文、數字、符號之間插入空白，讓文字變得美觀好看。(pangu, 盤古之白)

// @downloadURL https://update.greasyfork.org/scripts/470865/%E4%B8%AD%E8%8B%B1%E6%96%87%E4%B9%8B%E9%97%B4%E5%8A%A0%E7%A9%BA%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/470865/%E4%B8%AD%E8%8B%B1%E6%96%87%E4%B9%8B%E9%97%B4%E5%8A%A0%E7%A9%BA%E7%99%BD.meta.js
// ==/UserScript==


((__CONTEXT__) => {

  const { pangu } = __CONTEXT__;

  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (this instanceof Window ? this : window);

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'depcyxozwnig';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

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
          const removeIframeOnDocumentReady = async (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            e = n;
            n = win = removeIframeFn = 0;
            if (setTimeout) await new Promise(resolve => setTimeout(resolve, 200));
            try {
              e.remove();
            } catch (e) { }
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

  cleanContext(win).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame } = __CONTEXT__;

    let rafPromise = null;

    const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
      requestAnimationFrame(hRes => {
        rafPromise = null;
        resolve(hRes);
      });
    }));

    class Mutex {

      constructor() {
        this.p = Promise.resolve()
      }

      lockWith(f) {
        this.p = this.p.then(() => new Promise(f).catch(console.warn))
      }

    }

    let busy = false;

    const mutex = new Mutex();

    function executor(f) {
      mutex.lockWith(unlock => {
        if (busy) {
          unlock();
          return;
        }
        busy = true;
        Promise.resolve().then(() => {
          f();
        }).then(() => {
          busy = false;
        }).then(unlock);
      });
    }

    let np_ = null;
    try {
      np_ = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode').get;
    } catch (e) { }
    const np = np_ || function () { return this.parentNode };
    np_ = null;

    const nativeContains = Node.prototype.contains;

    /** @param {Node} n */
    const myw = new Set();
    nativeContains && np && document.addEventListener('DOMNodeInserted', function (e) {
      if (!busy) {
        myw.add(e.target);
      }
    }, { capture: false, passive: true });

    function f77() {

      executor(() => {
        const elements = [...myw];
        myw.clear();
        let commonParent_ = null;
        try {
          for (n of elements) {
            // checking of body contains
            // 1. complete the algo logic
            // 2. prevent the element is added and then removed from the DOM tree
            if (nativeContains.call(document.body, n)) {
              if (commonParent_ === null) {
                commonParent_ = np.call(n);
                // myz.contains(n) === true
              } else if (commonParent_ instanceof Node) {
                let maxLooping = 600;
                while (!nativeContains.call(commonParent_, n) && --maxLooping > 0) { // worst case: myz = document.body
                  commonParent_ = np.call(commonParent_);
                }
                if (maxLooping <= 0) commonParent_ = document.body; // rare case
                // myz.contains(n) === true
              }
            }
          }
        } catch (e) { commonParent_ = null; }
        const node = commonParent_;
        if (node instanceof Node) {
          pangu.spacingPageTitle();
          pangu.spacingNode(node);
        }
      });

    }

    const delayForSiteContentReady = (location.hostname.endsWith('nga.cn') || location.pathname.includes('/code')) ? getRafPromise : () => 0;

    async function onReady() {
      window.removeEventListener("DOMContentLoaded", onReady, false);

      let bodyDOM = null;
      try {
        bodyDOM = document.body;
        let maxLoopCount = 16;
        while (!bodyDOM && --maxLoopCount >= 0) {
          await getRafPromise();
          bodyDOM = document.body;
        }
      } catch (e) {
        bodyDOM = null;
      }

      if (!bodyDOM) return;

      if (await delayForSiteContentReady() !== 0) await new Promise(r => setTimeout(r, 177));

      executor(() => {
        pangu.spacingPageTitle();
        pangu.spacingPageBody();
      });

      let m33 = 0;
      const config = {
        childList: true,
        subtree: true
      };
      let observer;
      const callback = async () => {
        if (!observer) return;
        if (m33++ > 1e9) m33 = 9;
        let tid = m33;
        await getRafPromise();
        if (tid !== m33) return;
        let tmp = false;
        try {
          f77();
          await Promise.resolve();
          if (!observer) return;
          tmp = document.body;
        } catch (e) {
        }
        if (tmp != bodyDOM) {
          observer.takeRecords();
          observer.disconnect();
          if (tmp === false) {
            // Facebook - cross-frame error
            observer = null;
            bodyDOM = null;
          } else {
            bodyDOM = tmp;
            if (bodyDOM) {
              observer.observe(bodyDOM, config);
              callback();
            }
          }
        }

      };
      observer = new MutationObserver(callback);
      observer.observe(bodyDOM, config);
      callback();

    }



    Promise.resolve().then(() => {

      if (document.readyState !== 'loading') {
        onReady();
      } else {
        window.addEventListener("DOMContentLoaded", onReady, false);
      }

    });

  });


})({ pangu });
