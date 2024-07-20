/*

MIT License

Copyright 2024 CY Fung

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
// @name                YouTube Boost Chat
// @namespace           UserScripts
// @version             0.1.52
// @license             MIT
// @match               https://*.youtube.com/live_chat*
// @grant               none
// @author              CY Fung
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @description         5/13/2024, 9:58:33 PM
// @require             https://raw.githubusercontent.com/cyfung1031/userscript-supports/26ef1fda343c85285a388fcbf08290192e6e201d/library/html.min.js
// ==/UserScript==

(() => {

  const WeakMap = window.WeakMapOriginal || window.WeakMap;

  const _flag0281_ = window._flag0281_ = 0x2 | 0x4 | 0x8 | 0x40 | 0x80 | 0x100;

  const DEBUG_visibleItems_trace = false;

  const MAX_ITEMS_FOR_TOTAL_DISPLAY = 90;
  // const RENDER_MESSAGES_ONE_BY_ONE = true;
  const LOGTIME_FLUSHITEMS = false;

  let isThisBrowserSupported = true;

  if (isThisBrowserSupported && (typeof Element.prototype.attachShadow !== 'function' || typeof IntersectionObserver === 'undefined' || typeof CSS === 'undefined' || typeof CSS.supports === 'undefined')) {
    isThisBrowserSupported = false;
  } else {
    const isOverflowAnchorSupported = CSS.supports("overflow-anchor", "auto") && CSS.supports("overflow-anchor", "none");
    if (isThisBrowserSupported && !isOverflowAnchorSupported) {
      isThisBrowserSupported = false;
    }
  }

  if (!isThisBrowserSupported) {
    console.warn('Your browser does not support YouTube Boost Chat');
    return;
  }

  const { appendChild: fragmentAppendChild } = ((h0) => h0)(new DocumentFragment());

  /* globals WeakRef:false */

  /** @type {(o: Object | null) => WeakRef | null} */
  const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

  /** @type {(wr: Object | null) => Object | null} */
  const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  const PromiseExternal = ((resolve_, reject_) => {
    const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
    return class PromiseExternal extends Promise {
      constructor(cb = h) {
        super(cb);
        if (cb === h) {
          /** @type {(value: any) => void} */
          this.resolve = resolve_;
          /** @type {(reason?: any) => void} */
          this.reject = reject_;
        }
      }
    };
  })();

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  class VisibleItemList extends Array {
    constructor(targetListGet = null, targetListSet = null) {
      if (targetListGet && targetListSet && typeof targetListGet === 'function' && typeof targetListSet === 'function') {
        super();
        this.setTargetList(targetListGet, targetListSet);
        this.setBypass(false);
      }
      else {
        super(...arguments);
        this.setBypass(true);
      }
    }

    get length() {
      return super.length;
    }
    set length(n) {
      if (this.bypass) {

        super.length = n;
      } else {

        const targetListSet = kRef(this.targetListSet);

        if (!targetListSet) {

          console.error('targetList failure 0xFF01');
        }
        targetListSet(list => {
          list.length = 0;
          return list;
        });
        super.length = n;
      }
      return true;
    }

    setTargetList(targetListGet, targetListSet) {
      this.targetListGet = targetListGet ? mWeakRef(targetListGet) : null;
      this.targetListSet = targetListSet ? mWeakRef(targetListSet) : null;

    }

    setConvertorMap(convertorMap) {
      this.convertorMap = convertorMap ? mWeakRef(convertorMap) : null;
    }

    setBypass(b) {
      this.bypass = !!b;
    }

    reverse() {
      console.error('reverse failure 0xFFC1');
    }
    flat() {
      console.error('flat failure 0xFFC1');
    }
    flatMap() {
      console.error('flatMap failure 0xFFC1');
    }
    fill() {
      console.error('fill failure 0xFFC1');
    }
    sort() {
      console.error('sort failure 0xFFC1');
    }
    toReversed() {
      console.error('toReversed failure 0xFFC1');
    }
    toSorted() {
      console.error('toSorted failure 0xFFC1');
    }
    toSpliced() {
      console.error('toSpliced failure 0xFFC1');
    }
    with() {
      console.error('with failure 0xFFC1');
    }

    push(...itemsX) {
      if (this.bypass) return super.push(...itemsX);
      const targetListSet = kRef(this.targetListSet);

      if (!targetListSet) {

        console.error('targetListSet failure 0xFF01');
      }

      if (itemsX.length >= 1) {
        const convertorMap = kRef(this.convertorMap);
        if (!convertorMap) {

          console.error('convertorMap failure 0xFF01');
        }
        const itemsY = itemsX.map(x => convertorMap.get(x)).filter(y => !!y);
        if (itemsY.length !== itemsX.length) {
          console.error('convertorMap failure 0xFF02');
        }
        targetListSet(list => {
          list.push(...itemsY);
          return list;
        });
        return super.push(...itemsX);
      } else {
        targetListSet(list => {
          list.push();
          return list;
        });
        return super.push();
      }

    }

    pop() {
      if (this.bypass) return super.pop();
      const targetListSet = kRef(this.targetListSet);

      if (!targetListSet) {

        console.error('targetListSet failure 0xFF01');
      }
      targetListSet(list => {
        list.pop();
        return list;
      });
      return super.pop();

    }



    unshift(...itemsX) {
      if (this.bypass) return super.unshift(...itemsX);
      const targetListSet = kRef(this.targetListSet);

      if (!targetListSet) {

        console.error('targetListSet failure 0xFF01');
      }

      if (itemsX.length >= 1) {
        const convertorMap = kRef(this.convertorMap);
        if (!convertorMap) {

          console.error('convertorMap failure 0xFF01');
        }
        const itemsY = itemsX.map(x => convertorMap.get(x)).filter(y => !!y);
        if (itemsY.length !== itemsX.length) {
          console.error('convertorMap failure 0xFF02');
        }
        targetListSet(list => {
          list.unshift(...itemsY);
          return list;
        });
        return super.unshift(...itemsX);
      } else {

        targetListSet(list => {
          list.unshift();
          return list;
        });
        return super.unshift();
      }


    }

    shift() {
      if (this.bypass) return super.shift();
      const targetListSet = kRef(this.targetListSet);

      if (!targetListSet) {

        console.error('targetListSet failure 0xFF01');
      }

      targetListSet(list => {
        list.shift();
        return list;
      });
      return super.shift();

    }

    splice(start, deleteCount = undefined, ...itemsX) {
      if (this.bypass) return super.splice(start, deleteCount, ...itemsX);
      const targetListSet = kRef(this.targetListSet);

      if (!targetListSet) {

        console.error('targetListSet failure 0xFF01');
      }

      if (itemsX.length >= 1) {
        const convertorMap = kRef(this.convertorMap);
        if (!convertorMap) {

          console.error('convertorMap failure 0xFF01');
        }
        const itemsY = itemsX.map(x => convertorMap.get(x)).filter(y => !!y);
        if (itemsY.length !== itemsX.length) {
          console.error('convertorMap failure 0xFF02');
        }
        targetListSet(list => {
          list.splice(start, deleteCount, ...itemsY);
          return list;
        });
        return super.splice(start, deleteCount, ...itemsX);
      } else {

        targetListSet(list => {
          list.splice(start, deleteCount);
          return list;
        });
        return super.splice(start, deleteCount);
      }


    }





  }

  let mme = null;

  function getCodeLocation() {
    let p = new Error().stack;

    if (p.includes('solid')) return 'solid';
    if (p.includes('VisibleItemList.')) return 'solid';
    let q = p.match(/Array\.\w+[^\n\r]+[\r\n]+([^\n\r]+)/)
    q = q ? q[1] : p
    return q;
    // const callstack = new Error().stack.split("\n");
    // callstack.shift();
    // while (callstack.length && callstack[0].includes("-extension://")) {
    //     callstack.shift();
    // }
    // if (!callstack.length) {
    //     return "";
    // }
    // return '\n' + callstack[0].trim();
  }

  if (DEBUG_visibleItems_trace) {


    Array.prototype.push32 = Array.prototype.push;
    Array.prototype.push = function () {
      if (this === mme?.visibleItems && getCodeLocation() !== 'solid') {
        console.log('399 push', new Error().stack)
      }
      return this.push32(...arguments)
    }


    Array.prototype.splice32 = Array.prototype.splice;
    Array.prototype.splice = function () {
      if (this === mme?.visibleItems && getCodeLocation() !== 'solid') {
        // 399 splice     at a.splice (https://www.youtube.com/s/desktop/a7b1ec23/jsbin/live_chat_polymer.vflset/live_chat_polymer.js:2405:190)
        console.log('399 splice', new Error().stack)

      }
      return this.splice32(...arguments)
    }


    Array.prototype.unshift32 = Array.prototype.unshift;
    Array.prototype.unshift = function () {
      if (this === mme?.visibleItems && getCodeLocation() !== 'solid') {
        console.log('399 unshift', new Error().stack)
      }
      return this.unshift32(...arguments)
    }



    Array.prototype.shift32 = Array.prototype.shift;
    Array.prototype.shift = function () {
      if (this === mme?.visibleItems && getCodeLocation() !== 'solid') {
        console.log('399 shift', new Error().stack)
      }
      return this.shift32(...arguments)
    }

    Array.prototype.pop32 = Array.prototype.pop;
    Array.prototype.pop = function () {
      if (this === mme?.visibleItems && getCodeLocation() !== 'solid') {
        console.log('399 pop', new Error().stack)
      }
      return this.pop32(...arguments)
    }

  }


  const { _setAttribute, _insertBefore, _removeAttribute, replaceWith, appendChild } = (() => {
    let _setAttribute = Element.prototype.setAttribute;
    try {
      _setAttribute = ShadyDOM.nativeMethods.setAttribute || _setAttribute;
    } catch (e) { }
    let _insertBefore = Node.prototype.insertBefore;
    try {
      _insertBefore = ShadyDOM.nativeMethods.insertBefore || _insertBefore;
    } catch (e) { }
    let _removeAttribute = Element.prototype.removeAttribute;
    try {
      _removeAttribute = ShadyDOM.nativeMethods.removeAttribute || _removeAttribute;
    } catch (e) { }
    let replaceWith = Element.prototype.replaceWith;
    try {
      replaceWith = ShadyDOM.nativeMethods.replaceWith || replaceWith;
    } catch (e) { }
    let appendChild = Node.prototype.appendChild;
    try {
      appendChild = ShadyDOM.nativeMethods.appendChild || appendChild;
    } catch (e) { }
    return { _setAttribute, _insertBefore, _removeAttribute, replaceWith, appendChild };
  })();

  const isCustomElementsProvided = typeof customElements !== "undefined" && typeof (customElements || 0).whenDefined === "function";

  const promiseForCustomYtElementsReady = isCustomElementsProvided ? Promise.resolve(0) : new Promise((callback) => {
    const EVENT_KEY_ON_REGISTRY_READY = "ytI-ce-registry-created";
    if (typeof customElements === 'undefined') {
      if (!('__CE_registry' in document)) {
        // https://github.com/webcomponents/polyfills/
        Object.defineProperty(document, '__CE_registry', {
          get() {
            // return undefined
          },
          set(nv) {
            if (typeof nv == 'object') {
              delete this.__CE_registry;
              this.__CE_registry = nv;
              this.dispatchEvent(new CustomEvent(EVENT_KEY_ON_REGISTRY_READY));
            }
            return true;
          },
          enumerable: false,
          configurable: true
        })
      }
      let eventHandler = (evt) => {
        document.removeEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
        const f = callback;
        callback = null;
        eventHandler = null;
        f();
      };
      document.addEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
    } else {
      callback();
    }
  });

  const whenCEDefined = isCustomElementsProvided
    ? (nodeName) => customElements.whenDefined(nodeName)
    : (nodeName) => promiseForCustomYtElementsReady.then(() => customElements.whenDefined(nodeName));


  const inPlaceArrayPush = (() => {
    // for details, see userscript-supports/library/misc.js
    const LIMIT_N = typeof AbortSignal !== 'undefined' && typeof (AbortSignal || 0).timeout === 'function' ? 50000 : 10000;
    return function (dest, source) {
      let index = 0;
      const len = source.length;
      while (index < len) {
        let chunkSize = len - index; // chunkSize > 0
        if (chunkSize > LIMIT_N) {
          chunkSize = LIMIT_N;
          dest.push(...source.slice(index, index + chunkSize));
        } else if (index > 0) { // to the end
          dest.push(...source.slice(index));
        } else { // normal push.apply
          dest.push(...source);
        }
        index += chunkSize;
      }
    }

  })();

  const createPipeline = () => {
    let pipelineMutex = Promise.resolve();
    const pipelineExecution = fn => {
      return new Promise((resolve, reject) => {
        pipelineMutex = pipelineMutex.then(async () => {
          let res;
          try {
            res = await fn();
          } catch (e) {
            console.log('error_F1', e);
            reject(e);
          }
          resolve(res);
        }).catch(console.warn);
      });
    };
    return pipelineExecution;
  };



  let mloUz = -1;

  let mloPr = null;
  let mloPrReleaseAt = 0;
  let ezPr = null;

  setInterval(() => {
    if (mloPr !== null && mloPrReleaseAt > 0 && Date.now() > mloPrReleaseAt) mloPr.resolve();
  }, 100);

  const { mloPrSetup, mloCond } = (() => {

    let mloUz0 = -2;

    let messageListMOMap = new WeakMap();
    const mloCond = () => mloUz === mloUz0 && mloPr !== null;
    const mloF = () => {
      if (mloUz === mloUz0 && mloPr !== null) mloPr.resolve();
    };
    const mloSetup = (messageList, mloUz0_) => {

      if (mloPr !== null) mloPr.resolve();

      let mo = messageListMOMap.get(messageList);
      if (!mo) {
        messageListMOMap.set(messageList, mo = new MutationObserver(mloF));
      }

      mo.disconnect();
      mo.takeRecords();
      mloUz = -1;
      mloUz0 = mloUz0_;
      mloPr = new PromiseExternal();
      mo.observe(messageList, {
        subtree: false, childList: true
      });

      return mo;

    }

    const mloPrSetup = (messageList, mloUz0_) => {

      const mo = mloSetup(messageList, mloUz0_);
      return async () => {
        await mloPr.then();
        mo.disconnect();
        mo.takeRecords();
        mloPr = null;
      }

    }
    return { mloPrSetup, mloCond }
  })();

  const firstKey = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return key;
    }
    return null;
  }

  const firstObjectKey = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') return key;
    }
    return null;
  }

  const flushPE = createPipeline();


  class LimitedSizeSet extends Set {
    constructor(n) {
      super();
      this.limit = n;
    }

    add(key) {
      if (!super.has(key)) {
        super.add(key);
        let n = super.size - this.limit;
        if (n > 0) {
          const iterator = super.values();
          do {
            const firstKey = iterator.next().value; // Get the first (oldest) key
            super.delete(firstKey); // Delete the oldest key
          } while (--n > 0)
        }
      }
    }

    removeAdd(key) {
      super.delete(key);
      this.add(key);
    }

  }

  const flushKeys = new LimitedSizeSet(64);
  const mutableWM = new WeakMap();



  const canScrollIntoViewWithOptions = (() => {

    const element = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let i = 0;
    try {
      element.scrollIntoView({
        get behavior() { i++ },
        get block() { i++ }
      });
    } catch (e) {

    }
    return i === 2;


  })();

  if (!canScrollIntoViewWithOptions) {
    throw '[BST] Your browser is not supported.'
  }


  const cssTexts = {
    "outer": `


      .bst-yt-main ~ #items[id][class] {
        display: none !important;
      }
      .bst-yt-main ~ #item-scroller[id][class] {
        display: none !important;
      }
      .bst-yt-main{
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 0;
        top:0;
        left:0;
        bottom:0;
        right:0;
        contain: strict;
        overflow: auto;
      }

      yt-live-chat-item-list-renderer[class] {
        /*position: static;*/
      }
    `,
    "inner": `


      .bst-message-list {

          --bst-hyperlink-color: #3ea6ff;

          --color-transparent: rgba(0, 0, 0, 0);
          --color-opac-b-1: rgba(0, 0, 0, 0.05);
          --color-opac-b-2: rgba(0, 0, 0, 0.08);
          --color-opac-b-3: rgba(0, 0, 0, 0.13);
          --color-opac-b-4: rgba(0, 0, 0, 0.16);
          --color-opac-b-5: rgba(0, 0, 0, 0.22);
          --color-opac-b-6: rgba(0, 0, 0, 0.28);
          --color-opac-b-7: rgba(0, 0, 0, 0.4);
          --color-opac-b-8: rgba(0, 0, 0, 0.5);
          --color-opac-b-9: rgba(0, 0, 0, 0.6);
          --color-opac-b-10: rgba(0, 0, 0, 0.7);
          --color-opac-b-11: rgba(0, 0, 0, 0.75);
          --color-opac-b-12: rgba(0, 0, 0, 0.8);
          --color-opac-b-13: rgba(0, 0, 0, 0.85);
          --color-opac-b-14: rgba(0, 0, 0, 0.9);
          --color-opac-b-15: rgba(0, 0, 0, 0.95);
          --color-opac-gd-1: rgba(83, 83, 95, 0.38);
          --color-opac-gd-2: rgba(83, 83, 95, 0.48);
          --color-opac-gd-3: rgba(83, 83, 95, 0.55);
          --color-opac-gd-4: rgba(50, 50, 57, 0.62);
          --color-opac-gd-5: rgba(50, 50, 57, 0.95);

          --shadow-elevation-umbra: 0.34;
          --shadow-elevation-penumbra: 0.26;
          --shadow-elevation-ambient: 0.28;
          --shadow-elevation-1: 0 1px 2px var(--color-opac-b-14), 0 0px 2px var(--color-opac-b-14);
          --shadow-elevation-2: 0 4px 8px var(--color-opac-b-7), 0 0px 4px var(--color-opac-b-7);
          --shadow-elevation-3: 0 6px 16px var(--color-opac-b-8), 0 0px 4px var(--color-opac-b-7);
          --shadow-elevation-4: 0 12px 32px var(--color-opac-b-8), 0 0px 8px var(--color-opac-b-7);
          --shadow-elevation-5: 0 32px 64px var(--color-opac-b-9), 0 0px 16px var(--color-opac-b-7);
          --shadow-button-focus: 0 0 6px 0 var(--color-twitch-purple-8);
          --shadow-button-active: 0 0 6px 0 var(--color-twitch-purple-8);
          --shadow-button-disabled: none;
          --shadow-button-overlay-focus: 0 0 6px 0 var(--color-opac-w-6);
          --shadow-button-overlay-active: 0 0 6px 0 var(--color-opac-w-6);
          --shadow-tab-focus: 0 4px 6px -4px var(--color-twitch-purple-11);
          --shadow-balloon: 0 1px 1px var(--color-opac-b-5);
          --shadow-scrollbar: 0 0 1px 1px var(--color-opac-w-5);


        --color-opac-w-1: rgba(255, 255, 255, 0.05);
        --color-opac-w-2: rgba(255, 255, 255, 0.08);
        --color-opac-w-3: rgba(255, 255, 255, 0.13);
        --color-opac-w-4: rgba(255, 255, 255, 0.16);
        --color-opac-w-5: rgba(255, 255, 255, 0.22);
        --color-opac-w-6: rgba(255, 255, 255, 0.28);
        --color-opac-w-7: rgba(255, 255, 255, 0.4);
        --color-opac-w-8: rgba(255, 255, 255, 0.5);
        --color-opac-w-9: rgba(255, 255, 255, 0.6);
        --color-opac-w-10: rgba(255, 255, 255, 0.7);
        --color-opac-w-11: rgba(255, 255, 255, 0.75);
        --color-opac-w-12: rgba(255, 255, 255, 0.8);
        --color-opac-w-13: rgba(255, 255, 255, 0.85);
        --color-opac-w-14: rgba(255, 255, 255, 0.9);
        --color-opac-w-15: rgba(255, 255, 255, 0.95);

        --color-background-interactable-overlay-hover: var(--color-opac-w-3);

        --color-white: #ffffff;
        --color-black: #000000;
        --color-text-button-overlay-hover: var(--color-white);
        --color-background-button-icon-overlay-default: var(--color-transparent);
        --color-background-button-icon-overlay-hover: var(--color-background-interactable-overlay-hover);
        --color-background-button-icon-overlay-active: var(--color-background-interactable-overlay-active);
        --color-background-image-selector-overlay: var(--color-transparent);


        --opacity-pulse-animation: 0.7;
        --button-size-small: 2.4rem;
        --button-size-default: 3rem;
        --button-size-large: 3.6rem;

        --loading-spinner-size-small: 1.6rem;
        --loading-spinner-size-default: 2.2rem;
        --loading-spinner-size-large: 2.8rem;
        --progress-bar-size-extra-small: 0.3rem;
        --progress-bar-size-small: 0.5rem;
        --progress-bar-size-default: 1rem;
        --range-size: 0.2rem;
        --range-thumb-size: 1.6rem;
        --toggle-height: 2rem;
        --toggle-width: 3.5rem;
        --toggle-handle-size: 1.2rem;
        --toggle-handle-shadow: none;
        --toggle-handle-offset: 0.2rem;
        --border-width-default: 1px;
        --border-width-button: 2px;
        --border-width-checkbox: 2px;
        --border-width-drop-zone: 2px;
        --border-width-marked: 3px;
        --border-width-selectable: 2px;
        --border-width-spinner: 2px;
        --border-width-tag: 2px;
        --border-radius-none: 0;
        --border-radius-small: 0.2rem;
        --border-radius-medium: 0.4rem;
        --border-radius-large: 0.6rem;
        --border-radius-extra-large: 1rem;
        --border-radius-extra-extra-large: 1.6rem;
        --border-radius-rounded: 9000px;

      }

      .bst-message-list {

        --yt-spec-base-background: #fff;
        --yt-spec-raised-background: #fff;
        --yt-spec-menu-background: #fff;
        --yt-spec-inverted-background: #0f0f0f;
        --yt-spec-additive-background: rgba(0,0,0,0.05);

        --yt-deprecated-blue-light: hsl(205.9,80%,43.1%);
        --yt-deprecated-opalescence-grey-opacity-lighten-3: hsla(0,0%,53.3%,0.4);
        --yt-deprecated-opalescence-soft-grey-opacity-lighten-3: hsla(0,0%,93.3%,0.4);
        --yt-deprecated-luna-black-opacity-lighten-2: hsla(0,0%,6.7%,0.6);
        --yt-deprecated-luna-black-opacity-lighten-3: hsla(0,0%,6.7%,0.4);
        --yt-deprecated-luna-black-opacity-lighten-4: hsla(0,0%,6.7%,0.2);
        --yt-opalescence-dark-grey: hsl(0,0%,20%);
        --yt-deprecated-luna-black: hsl(0,0%,6.7%);
        --yt-deprecated-white-opacity-lighten-4: hsla(0,0%,100%,0.2);
        --yt-deprecated-opalescence-soft-grey-opacity-lighten-1: hsla(0,0%,93.3%,0.8);
        --yt-deprecated-opalescence-soft-grey: hsl(0,0%,93.3%);
        --yt-live-chat-background-color: var(--yt-spec-base-background);
        --yt-live-chat-secondary-background-color: var( --yt-deprecated-opalescence-soft-grey );
        --yt-live-chat-action-panel-background-color: var(--yt-spec-base-background);
        --yt-live-chat-action-panel-background-color-transparent: hsla(0,0%,97%,0.8);
        --yt-live-chat-additive-background-inverse: var(--yt-spec-white-1-alpha-10);
        --yt-live-chat-mode-change-background-color: var( --yt-deprecated-opalescence-soft-grey-opacity-lighten-3 );
        --yt-live-chat-primary-text-color: var(--yt-spec-text-primary);
        --yt-live-chat-secondary-text-color: var( --yt-deprecated-luna-black-opacity-lighten-2 );
        --yt-live-chat-secondary-text-color-inverse: var(--yt-spec-grey-2);
        --yt-live-chat-tertiary-text-color: var( --yt-deprecated-luna-black-opacity-lighten-3 );
        --yt-live-chat-tertiary-text-color-inverse: var(--yt-spec-white-1-alpha-30);
        --yt-live-chat-text-input-field-inactive-underline-color: #b8b8b8;
        --yt-live-chat-text-input-field-placeholder-color: var( --yt-deprecated-luna-black-opacity-lighten-2 );
        --yt-live-chat-text-input-field-underline-transition-duration: 0.25s;
        --yt-live-chat-icon-button-color: var(--yt-live-chat-primary-text-color);
        --yt-live-chat-enabled-send-button-color: #4285f4;
        --yt-live-chat-disabled-icon-button-color: var( --yt-deprecated-luna-black-opacity-lighten-4 );
        --yt-live-chat-picker-button-color: var( --yt-deprecated-luna-black-opacity-lighten-3 );
        --yt-live-chat-picker-button-active-color: var( --yt-deprecated-luna-black-opacity-lighten-1 );
        --yt-live-chat-picker-button-disabled-color: var( --yt-live-chat-disabled-icon-button-color );
        --yt-live-chat-picker-button-hover-color: var( --yt-deprecated-luna-black-opacity-lighten-2 );
        --yt-live-chat-mention-background-color: #ff5722;
        --yt-live-chat-mention-text-color: var(--yt-spec-static-overlay-text-primary);
        --yt-live-chat-deleted-message-color: rgba(0,0,0,0.5);
        --yt-live-chat-deleted-message-bar-color: rgba(11,11,11,0.2);
        --yt-live-chat-disabled-button-background-color: var( --yt-deprecated-opalescence-soft-grey );
        --yt-live-chat-disabled-button-text-color: var( --yt-deprecated-luna-black-opacity-lighten-3 );
        --yt-live-chat-sub-panel-background-color: var(--yt-spec-base-background);
        --yt-live-chat-sub-panel-background-color-transparent: var( --yt-spec-base-background );
        --yt-live-chat-header-background-color: var(--yt-spec-base-background);
        --yt-live-chat-header-button-color: var(--yt-deprecated-luna-black);
        --yt-live-chat-header-bottom-border: 1px solid var(--yt-spec-10-percent-layer);
        --yt-live-chat-count-color-early-warning: hsl(40,76%,55%);
        --yt-live-chat-count-color-error: hsl(10,51%,49%);
        --yt-live-chat-error-message-color: hsl(10,51%,49%);
        --yt-live-chat-reconnect-message-color: hsla(0,0%,7%,0.2);
        --yt-live-chat-moderator-color: hsl(225,84%,66%);
        --yt-live-chat-new-moderator-color: var(--yt-spec-call-to-action);
        --yt-live-chat-owner-color: hsl(40,76%,55%);
        --yt-live-chat-author-chip-owner-background-color: #ffd600;
        --yt-live-chat-author-chip-owner-text-color: rgba(0,0,0,0.87);
        --yt-live-chat-author-chip-verified-background-color: var(--yt-spec-grey-1);
        --yt-live-chat-author-chip-verified-text-color: var(--yt-spec-grey-5);
        --yt-live-chat-message-highlight-background-color: var( --yt-spec-raised-background );
        --yt-live-chat-sponsor-color: #107516;
        --yt-live-chat-overlay-color: hsla(0,0%,0%,0.6);
        --yt-live-chat-dialog-background-color: var( --yt-spec-static-white-background );
        --yt-live-chat-dialog-text-color: var( --yt-deprecated-luna-black-opacity-lighten-2 );
        --yt-live-chat-banner-border-color: var(--yt-spec-10-percent-layer);
        --yt-live-chat-banner-animation-duration: 0.35s;
        --yt-live-chat-banner-animation-fast-duration: 0.25s;
        --yt-live-chat-banner-gradient-scrim: linear-gradient(rgba(255,255,255,0.95),transparent);
        --yt-live-chat-banner-indeterminate-bar-background: repeating-linear-gradient(90deg,#fff,#fff 6px,#aaa 6px,#aaa 9px);
        --yt-live-chat-banner-bar-animation-duration: 1s;
        --yt-live-chat-action-panel-gradient-scrim: linear-gradient(to top,rgba(255,255,255,0.95),transparent);
        --yt-live-chat-call-for-questions-primary-text-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-call-for-questions-secondary-text-color: var( --yt-spec-static-overlay-text-secondary );
        --yt-live-chat-call-for-questions-ask-question-button-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-call-to-action-primary-text-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-call-to-action-secondary-text-color: var( --yt-spec-static-overlay-text-secondary );
        --yt-live-chat-call-to-action-ask-question-button-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-qna-primary-text-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-qna-start-panel-header-border-color: var( --yt-spec-10-percent-layer );
        --yt-live-chat-qna-panel-start-button-background-color: var( --yt-spec-call-to-action );
        --yt-live-chat-qna-panel-start-button-color: var( --yt-spec-general-background-b );
        --yt-live-chat-qna-start-panel-button-background-color-disabled: var( --yt-spec-badge-chip-background );
        --yt-live-chat-qna-panel-start-button-color-disabled: var( --yt-spec-text-disabled );
        --yt-live-chat-poll-primary-text-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-poll-secondary-text-color: var( --yt-spec-static-overlay-text-secondary );
        --yt-live-chat-poll-tertiary-text-color: var( --yt-spec-static-overlay-text-disabled );
        --yt-live-chat-poll-choice-text-color: var( --yt-live-chat-poll-primary-text-color );
        --yt-live-chat-poll-choice-additive-background-color: var( --yt-spec-black-pure-alpha-10 );
        --yt-live-chat-poll-choice-additive-background-color-inverse: var( --yt-spec-white-1-alpha-20 );
        --yt-live-chat-poll-banner-border-highlight-color: var(--yt-spec-white-3);
        --yt-live-chat-poll-choice-background-color: transparent;
        --yt-live-chat-poll-choice-border-radius: 2px;
        --yt-live-chat-poll-choice-border: 1px solid var(--yt-live-chat-poll-tertiary-text-color);
        --yt-live-chat-poll-choice-min-height: 16px;
        --yt-live-chat-poll-choice-vote-bar-background-color: var( --yt-spec-static-overlay-button-secondary );
        --yt-live-chat-poll-choice-hover-color: rgba(17,17,16,0.1);
        --yt-live-chat-poll-choice-animation-duration: 0.5s;
        --yt-live-chat-poll-choice-text-padding: 0 16px;
        --yt-live-chat-poll-editor-panel-header-border-color: var( --yt-spec-10-percent-layer );
        --yt-live-chat-poll-editor-start-button-color: var( --yt-spec-text-primary-inverse );
        --yt-live-chat-poll-editor-start-button-background-color: var( --yt-spec-call-to-action );
        --yt-live-chat-poll-editor-start-button-color-disabled: var( --yt-spec-text-disabled );
        --yt-live-chat-poll-editor-start-button-background-color-disabled: var( --yt-spec-badge-chip-background );
        --yt-live-interactivity-component-background-color: #264c8a;
        --yt-live-chat-panel-animation-duration: 0.5s;
        --yt-live-chat-universal-motion-curve: cubic-bezier(0.05,0,0,1);
        --yt-live-chat-moderation-mode-hover-background-color: var( --yt-deprecated-luna-black-opacity-lighten-4 );
        --yt-live-chat-additional-inline-action-button-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-additional-inline-action-button-background-color: hsla(0,0%,26%,0.8);
        --yt-live-chat-additional-inline-action-button-background-color-hover: hsla(0,0%,26%,1);
        --yt-formatted-string-emoji-size: 24px;
        --yt-live-chat-emoji-size: 24px;
        --yt-live-chat-text-input-field-suggestion-background-color: var( --yt-spec-static-white-background );
        --yt-live-chat-text-input-field-suggestion-background-color-hover: #eee;
        --yt-live-chat-text-input-field-suggestion-text-color: #666;
        --yt-live-chat-text-input-field-suggestion-text-color-hover: #333;
        --yt-live-chat-ticker-arrow-background: hsl(0,0%,97.3%);
        --yt-emoji-picker-category-background-color: var( --yt-live-chat-action-panel-background-color-transparent );
        --yt-emoji-picker-category-color: var(--yt-live-chat-secondary-text-color);
        --yt-emoji-picker-category-button-color: var(--yt-spec-text-disabled);
        --yt-emoji-picker-search-background-color: var(--yt-spec-white-2);
        --yt-emoji-picker-search-color: var( --yt-deprecated-luna-black-opacity-lighten-1 );
        --yt-emoji-picker-search-placeholder-color: var( --yt-deprecated-luna-black-opacity-lighten-2 );
        --yt-emoji-picker-base-with-variants-border: var( --yt-spec-black-pure-alpha-15 );
        --yt-emoji-picker-variant-selector-bg-color: #e0e0e0;
        --yt-live-chat-slider-active-color: #2196f3;
        --yt-live-chat-slider-container-color: #c8c8c8;
        --yt-live-chat-slider-markers-color: #505050;
        --yt-live-chat-toast-action-color: #2196f3;
        --yt-live-chat-toast-background-color: var(--yt-opalescence-dark-grey);
        --yt-live-chat-toast-text-color: var(--yt-spec-static-overlay-text-primary);
        --yt-live-chat-automod-button-background-color: var( --yt-deprecated-opalescence-soft-grey );
        --yt-live-chat-automod-button-background-color-hover: var( --yt-deprecated-luna-black-opacity-lighten-4 );
        --yt-live-chat-creator-support-button-border-radius: 2px;
        --yt-live-chat-creator-support-button-padding: 10px 16px;
        --yt-live-chat-creator-support-button-font-size: inherit;
        --yt-live-chat-countdown-opacity: 0.3;
        --yt-live-chat-shimmer-background-color: rgba(136,136,136,0.2);
        --yt-live-chat-shimmer-linear-gradient: linear-gradient(0deg,rgba(255,255,255,0) 40%,rgba(255,255,255,0.5) 50%,rgba(255,255,255,0) 65%);
        --yt-live-chat-vem-background-color: var( --yt-deprecated-opalescence-soft-grey );
        --yt-live-chat-upsell-dialog-renderer-button-padding: 10px 16px;
        --yt-live-chat-product-picker-icon-color: rgba(17,17,17,0.6);
        --yt-live-chat-product-picker-hover-color: rgba(17,17,16,0.1);
        --yt-live-chat-product-picker-disabled-icon-color: rgba(17,17,17,0.4);
        --yt-pdg-paid-stickers-tab-selection-bar-color: var(--yt-spec-dark-blue);
        --yt-pdg-paid-stickers-author-name-font-size: 14px;
        --yt-pdg-paid-stickers-author-subtext-font-size: 13px;
        --yt-pdg-paid-stickers-margin-left: 38px;
        --yt-live-chat-ninja-message-background-color: var(--yt-spec-base-background);
        --yt-live-chat-panel-pages-border-color: var(--yt-spec-10-percent-layer)
      }

      .bst-message-list[dark] {

        --yt-spec-base-background: #0f0f0f;
        --yt-spec-raised-background: #212121;
        --yt-spec-menu-background: #282828;
        --yt-spec-inverted-background: #f1f1f1;
        --yt-spec-additive-background: rgba(255,255,255,0.1);

        --yt-live-chat-background-color: var(--yt-spec-base-background);
        --yt-live-chat-action-panel-background-color: var(--yt-spec-base-background);
        --yt-live-chat-action-panel-background-color-transparent: rgba(40,40,40,0.8);
        --yt-live-chat-additive-background-inverse: var(--yt-spec-black-pure-alpha-5);
        --yt-live-chat-secondary-background-color: #282828;
        --yt-live-chat-toast-text-color: var(--yt-spec-static-overlay-text-primary);
        --yt-live-chat-toast-background-color: #323232;
        --yt-live-chat-mode-change-background-color: #333;
        --yt-live-chat-primary-text-color: var(--yt-spec-static-overlay-text-primary);
        --yt-live-chat-secondary-text-color: rgba(255,255,255,0.7);
        --yt-live-chat-secondary-text-color-inverse: var(--yt-spec-grey-5);
        --yt-live-chat-tertiary-text-color: rgba(255,255,255,0.54);
        --yt-live-chat-tertiary-text-color-inverse: var( --yt-spec-black-pure-alpha-30 );
        --yt-live-chat-text-input-field-inactive-underline-color: #666;
        --yt-live-chat-text-input-field-placeholder-color: #666;
        --yt-live-chat-icon-button-color: var(--yt-live-chat-primary-text-color);
        --yt-live-chat-enabled-send-button-color: #fff;
        --yt-live-chat-disabled-icon-button-color: rgba(255,255,255,0.3);
        --yt-live-chat-picker-button-color: var(--yt-live-chat-tertiary-text-color);
        --yt-live-chat-picker-button-active-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-picker-button-disabled-color: var( --yt-live-chat-disabled-icon-button-color );
        --yt-live-chat-picker-button-hover-color: rgba(255,255,255,0.74);
        --yt-live-chat-mention-background-color: #ff5722;
        --yt-live-chat-mention-text-color: #fff;
        --yt-live-chat-deleted-message-color: rgba(255,255,255,0.5);
        --yt-live-chat-deleted-message-bar-color: rgba(255,255,255,0.5);
        --yt-live-chat-error-message-color: var(--yt-spec-brand-link-text);
        --yt-live-chat-error-message-color-refresh: var(--yt-spec-error-indicator);
        --yt-live-chat-reconnect-message-color: #fff;
        --yt-live-chat-disabled-button-background-color: #444;
        --yt-live-chat-disabled-button-text-color: var( --yt-live-chat-secondary-text-color );
        --yt-live-chat-sub-panel-background-color: var(--yt-spec-base-background);
        --yt-live-chat-sub-panel-background-color-transparent: var( --yt-spec-base-background );
        --yt-live-chat-header-background-color: var(--yt-spec-base-background);
        --yt-live-chat-header-button-color: var(--yt-live-chat-secondary-text-color);
        --yt-live-chat-moderator-color: #5e84f1;
        --yt-live-chat-owner-color: #ffd600;
        --yt-live-chat-message-highlight-background-color: var( --yt-spec-raised-background );
        --yt-live-chat-author-chip-owner-text-color: var(--yt-deprecated-luna-black);
        --yt-live-chat-author-chip-verified-background-color: var(--yt-spec-grey-5);
        --yt-live-chat-author-chip-verified-text-color: var(--yt-spec-white-4);
        --yt-live-chat-sponsor-color: #2ba640;
        --yt-live-chat-overlay-color: rgba(0,0,0,0.5);
        --yt-live-chat-dialog-background-color: #424242;
        --yt-live-chat-dialog-text-color: var(--yt-spec-static-overlay-text-primary);
        --yt-live-chat-button-default-text-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-button-default-background-color: var( --yt-deprecated-white-opacity-lighten-4 );
        --yt-live-chat-button-dark-text-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-button-dark-background-color: var( --yt-deprecated-white-opacity-lighten-4 );
        --yt-emoji-picker-variant-selector-bg-color: #2f2f2f;
        --yt-live-chat-moderation-mode-hover-background-color: rgba(255,255,255,0.3);
        --yt-live-chat-additional-inline-action-button-color: var(--yt-grey);
        --yt-live-chat-additional-inline-action-button-background-color: var( --yt-deprecated-opalescence-soft-grey-opacity-lighten-1 );
        --yt-live-chat-additional-inline-action-button-background-color-hover: var( --yt-deprecated-opalescence-soft-grey );
        --yt-formatted-string-emoji-size: 24px;
        --yt-live-chat-emoji-size: 24px;
        --yt-live-chat-text-input-field-suggestion-background-color: #3e3e3e;
        --yt-live-chat-text-input-field-suggestion-background-color-hover: #343434;
        --yt-live-chat-text-input-field-suggestion-text-color: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-text-input-field-suggestion-text-color-hover: var( --yt-spec-static-overlay-text-primary );
        --yt-live-chat-text-input-field-placeholder-color: var( --yt-live-chat-secondary-text-color );
        --yt-live-chat-ticker-arrow-background: var( --yt-live-chat-action-panel-background-color );
        --yt-emoji-picker-category-background-color: var( --yt-live-chat-action-panel-background-color-transparent );
        --yt-emoji-picker-category-color: var(--yt-live-chat-secondary-text-color);
        --yt-emoji-picker-search-background-color: #444;
        --yt-emoji-picker-search-color: #fff;
        --yt-emoji-picker-search-placeholder-color: #999;
        --yt-emoji-picker-base-with-variants-border: var(--yt-spec-white-1-alpha-25);
        --yt-live-chat-slider-active-color: #2196f3;
        --yt-live-chat-slider-container-color: #515151;
        --yt-live-chat-slider-markers-color: #fff;
        --yt-live-chat-banner-gradient-scrim: linear-gradient(rgba(40,40,40,0.95),transparent);
        --yt-live-chat-action-panel-gradient-scrim: linear-gradient(to top,rgba(40,40,40,0.95),transparent);
        --yt-live-chat-poll-choice-additive-background-color: var( --yt-spec-white-1-alpha-20 );
        --yt-live-chat-poll-choice-additive-background-color-inverse: var( --yt-spec-black-pure-alpha-10 );
        --yt-live-chat-poll-banner-border-highlight-color: var(--yt-spec-black-3);
        --yt-live-chat-poll-editor-start-button-background-color-disabled: var( --yt-spec-grey-1 );
        --yt-live-chat-automod-button-background-color: var( --yt-deprecated-opalescence-grey-opacity-lighten-3 );
        --yt-live-chat-automod-button-background-color-hover: rgba(255,255,255,0.5);
        --yt-live-chat-automod-button-explanation-color: rgba(255,255,255,0.7);
        --yt-live-chat-countdown-opacity: 0.5;
        --yt-live-chat-shimmer-background-color: rgba(17,17,17,0.4);
        --yt-live-chat-shimmer-linear-gradient: linear-gradient(0deg,rgba(0,0,0,0.1) 40%,rgba(100,100,100,0.3) 50%,rgba(0,0,0,0.1) 60%);
        --yt-live-chat-vem-background-color: #3e3e3e;
        --yt-live-chat-product-picker-icon-color: rgba(255,255,255,0.5);
        --yt-live-chat-product-picker-hover-color: rgba(68,68,68,1);
        --yt-live-chat-product-picker-disabled-icon-color: rgba(255,255,255,0.3);
        --yt-pdg-paid-stickers-tab-selection-bar-color: var(--yt-spec-light-blue)
      }

      /*

      yt-icon, .yt-icon-container.yt-icon {
        display: inline-flexbox;
        display: -moz-inline-box;
        display: inline-flex;
        -moz-box-align: center;
        align-items: center;
        -moz-box-pack: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        fill: var(--iron-icon-fill-color,currentcolor);
        stroke: var(--iron-icon-stroke-color,none);
        width: var(--iron-icon-width,24px);
        height: var(--iron-icon-height,24px);
        animation: var(--iron-icon-animation);
        margin-top: var(--iron-icon-margin-top);
        margin-right: var(--iron-icon-margin-right);
        margin-bottom: var(--iron-icon-margin-bottom);
        margin-left: var(--iron-icon-margin-left);
        padding: var(--iron-icon-padding);
        contain: strict;
      }

      */


      .bst-message-list {
        --bst-default-text-color: #000;
        --yt-live-chat-sponsor-color-ori: var(--yt-live-chat-sponsor-color);
        --yt-live-chat-moderator-color-ori: var(--yt-live-chat-moderator-color);
        --yt-live-chat-author-chip-owner-background-color-ori: var(--yt-live-chat-author-chip-owner-background-color);
      }
      .bst-message-list[dark] {
        --bst-default-text-color: #fff;
      }
      .bst-message-list[dark] .bst-message-entry:not(.bst-membership-message) {
        --yt-live-chat-sponsor-color: #71ff8c;
        --yt-live-chat-moderator-color: #70a7ff;
        --yt-live-chat-author-chip-owner-background-color: #ffff3c;
      }

      .bst-message-list {
        --bst-username-color: var(--yt-live-chat-secondary-text-color);
        --bst-name-field-background-default: rgba(127, 127, 127, 0.15);
      }

      .bst-message-list[dark] {
        --bst-username-color: #a3e3e3;
        --bst-name-field-background-default: rgba(255, 255, 255, 0.15);
      }

      .bst-message-username {
        box-sizing: border-box;
        border-radius: 2px;
        color: var(--bst-username-color);
        font-weight: 500;
      }

      .bst-message-list {

        --yt-live-chat-first-line-height: calc( var(--yt-live-chat-emoji-size) + 2px );
        --yt-live-chat-profile-icon-size: 20px;
        --bst-message-entry-pl: calc( var(--yt-live-chat-profile-icon-size) + 6px );
        --yt-live-chat-tooltip-max-width: 60vw;

        --bst-list-pl: 20px;
        --bst-list-pr: 20px;
        --bst-list-pt: 8px;
        --bst-list-pb: 8px;

        --bst-list-gap: 10px;

        --bst-author-badge-mb: .2rem;
        /* --bst-author-badge-va: text-bottom; */
        --bst-author-badge-va: middle;
        --bst-author-badge-size: 16px;

        padding-left: var(--bst-list-pl);
        padding-right: var(--bst-list-pr);
        padding-top: var(--bst-list-pt);
        padding-bottom: var(--bst-list-pb);
        display: flex;
        gap: var(--bst-list-gap);
        flex-direction: column;
        background: var(--yt-live-chat-background-color);

      }

      yt-live-chat-renderer[hide-timestamps] {
          --yt-live-chat-item-timestamp-display: none;
      }
      .bst-message-time:empty {
          --yt-live-chat-item-timestamp-display: none;
      }

      .bst-message-time {
        display:inline;
        white-space: nowrap;
        vertical-align: baseline;
        display: var(--yt-live-chat-item-timestamp-display, inline);
        /* margin: var(--yt-live-chat-item-timestamp-margin, 0 8px 0 0); */
        color: var(--yt-live-chat-tertiary-text-color);
        font-size: 11px;
        display: var(--yt-live-chat-item-timestamp-display, inline-block);
        min-width: 3em;
        box-sizing: border-box;
        padding-right: 8px;
      }

      .bst-message-username {
        display:inline;
        vertical-align: baseline;
      }
      .bst-message-badges {
        display:inline;
        white-space: nowrap;
        vertical-align: baseline;

      }
      .bst-message-badges{
        margin-left: 2px;
      }
      .bst-message-badges:empty{
        margin:0;
      }
      .bst-message-badges::before{
        content:'';
        contain: strict;
        display:inline;
        user-select:none !important;
        pointer-events:none !important;
        line-height: var(--yt-live-chat-first-line-height);
        vertical-align: baseline;
      }
      .bst-message-badges img.bst-author-badge{
        margin-bottom: var(--bst-author-badge-mb);
        vertical-align: var(--bst-author-badge-va);
        width: var(--bst-author-badge-size);
        height: var(--bst-author-badge-size);
        max-height: 2rem;
        max-width: 2rem;
        contain: strict;
        margin: 0;
        margin-top: -4px;
        margin-top: -0.5rem;
        contain: strict;
      }
      .bst-message-badge-yt-icon{
        display: inline-flex;
        width: 16px;
        height: 16px;
        margin-bottom: var(--bst-author-badge-mb);
        vertical-align: var(--bst-author-badge-va);
        margin:0;
        contain: strict;
        fill: currentColor;
      }
      .bst-message-badge-yt-icon *{
        pointer-events: none;
      }
      .bst-message-head-colon{
        display:inline;
        vertical-align: baseline;
      }
      .bst-message-head-colon::after{
        content: ': ';
      }

      .bst-name-field {
        display: inline;
        --bst-name-field-background: transparent;
        position: relative;
      }

      .bst-name-field:hover {
        --bst-name-field-background: var(--bst-name-field-background-default);
        background-color: var(--bst-name-field-background);
        border-radius: 0.3rem;
        box-shadow: 0 0 0 0.3rem var(--bst-name-field-background);
        cursor: pointer;
      }
      .bst-message-body::before {
        content: '\u200b';
        opacity: 0;
        user-select: none;
      }

      .bst-message-profile-holder::before{
        content: '\u200b';
        opacity: 0;
        user-select: none;
      }

      [author-type="owner"] .bst-name-field {
        --bst-name-field-background: var(--yt-live-chat-author-chip-owner-background-color);
        background-color: var(--bst-name-field-background);
        border-radius: 0.3rem;
        box-shadow: 0 0 0 0.3rem var(--bst-name-field-background);
      }
      .bst-message-entry {
        display:block;
        position: relative;
        padding-left: var(--bst-message-entry-pl);
        box-sizing: border-box;
        min-height: 2.7rem;
        overflow-wrap: anywhere;
      }

      .bst-message-entry.bst-viewer-engagement-message {
        --bst-message-entry-pl: 0;
      }

      .bst-message-profile-anchor {
        margin-left: calc( -1 * var(--yt-live-chat-profile-icon-size) );
        position:absolute;
        left: -8px;
        display:inline-flex;
        align-items: center;

        vertical-align: super;
        width: var(--yt-live-chat-profile-icon-size);
        box-sizing:border-box;
      }


      .bst-message-head{
        flex-shrink: 0;
        display:inline;
        flex-direction:row;
        vertical-align: baseline;
        position: relative;
      }

      .bst-message-entry[author-type="owner"] .bst-message-head-colon {
        display: none;
      }
      .bst-message-entry[author-type="owner"] .bst-message-head{
        margin-right: 8px;
        margin-left: 4px;
      }

      .bst-message-list {
        --color-opac-w-4: rgba(255, 255, 255, 0.16);
        --border-radius-none: 0;
        --border-radius-small: 0.2rem;
        --border-radius-medium: 0.4rem;
        --border-radius-large: 0.6rem;
        --border-radius-extra-large: 1rem;
        --border-radius-extra-extra-large: 1.6rem;
        --border-radius-rounded: 9000px;
      }

      .bst-message-entry-highlight {
        bottom: -0.36rem;
        left: -0.86rem;
        right: -0.86rem;
        top: -0.36rem;
        border-radius: var(--border-radius-medium);
        position: absolute;
        --color-background-interactable-alpha-hover: var(--color-opac-w-4);
        --bst-highlight-color: var(--color-background-interactable-alpha-hover);
        pointer-events: none !important;
      }

      .bst-message-entry-line {
        position: relative;
        display: inline;
      }

      .bst-message-entry:hover .bst-message-entry-highlight{
        background-color: var(--bst-highlight-color);
      }

      .bst-message-before-content-button-container{
        flex-shrink: 0;
        display:inline;
        flex-direction:column;
        max-width:100%;
        vertical-align: baseline;
      }

      .bst-message-body{
        flex-shrink: 0;
        display:inline; /* block ? inline-block? */
        flex-direction:column;
        max-width:100%;
        vertical-align: baseline;
      }

      .bst-message-head ~ .bst-message-body{
        line-height: var(--yt-live-chat-first-line-height);
      }

      .bst-message-body a{
        color: inherit;
      }


      .bst-profile-img{
        display: inline;
        max-width: 100%;
        border-style: solid;
        border-width: 1.5px;
        border-radius: 9999px;
        vertical-align: middle;
        position: absolute;
        box-sizing:border-box;
      }

      .bst-message-profile-holder{
        display:inline-flex;
        align-items:center;
        position:relative;
        width:0;
        height:1rem;
        z-index: 1;
      }







      .bst-overflow-anchor{
        contain: strict;
        display:block;
        background: transparent;
        position: relative;
        flex-shrink: 0;
        top:-4px;
        border: 1px solid transparent;
        z-index: -1;
        visibility: collapse;
      }


      .bst-message-list {
        overflow-anchor: none;

      }
      .bst-overflow-anchor{
          overflow-anchor: auto;
      }






      .bst-message-body .emoji {
        contain: strict;
        width: var(--yt-live-chat-emoji-size);
        height: var(--yt-live-chat-emoji-size);
        max-height: 4rem;
        max-width: 4rem;
        margin: -1px 2px 1px;
        vertical-align: middle;
        margin-bottom: .1rem;
      }

      bst-tooltip {
        contain: content;
        position: absolute;
        background-color: var(--paper-tooltip-background, #616161);
        color: var(--paper-tooltip-text-color, white);
        padding: 6px 8px;
        outline: none;
        user-select: none;
        cursor: default;
        border-radius: 4px;
        margin-left: calc(-0.5 * var(--yt-live-chat-emoji-size));

        white-space: nowrap;
        max-width: var(--yt-live-chat-tooltip-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
        z-index: 2;
        pointer-events: none !important;
      }
      bst-tooltip:empty{
        display: none;
      }

      .bst-message-entry:hover{
        z-index:1;
      }
      bst-tooltip{
        transform:translate(-50%, 100%);
        margin-top: 0;
        margin-bottom: -4px;
      }

      /*
      [view-pos] ~ .bst-message-entry bst-tooltip {
        transform:translate(-50%, -100%);
      }
      */

      .bst-message-entry[view-pos="down"] bst-tooltip{
        transform:translate(-50%, -100%);
        margin-top: -4px;
        margin-bottom: 0;
      }



      .bst-message-entry[author-type="member"] .bst-message-name-color{
        --bst-username-color: var(--yt-live-chat-sponsor-color);
        color: var(--bst-username-color);
      }
      .bst-message-entry[author-type="moderator"] .bst-message-name-color{
        --bst-username-color: var(--yt-live-chat-moderator-color);
        color: var(--bst-username-color);
      }
      .bst-message-entry[author-type="owner"] .bst-message-name-color{
        --bst-username-color: var(--yt-live-chat-author-chip-owner-text-color);
        color: var(--bst-username-color);
      }


      .bst-message-entry .bst-message-name-color .bst-message-badge-yt-icon[icon-type="verified"] {
        color: var(--yt-live-chat-verified-color, inherit);
      }


      /**
       *
       *

      yt-live-chat-author-chip {
          display: inline-flex;
          align-items: baseline
      }

      yt-live-chat-author-chip[bold-color-usernames] #author-name.yt-live-chat-author-chip {
          color: var(--yt-live-chat-primary-text-color)
      }

      #author-name.yt-live-chat-author-chip {
          box-sizing: border-box;
          border-radius: 2px;
          color: var(--yt-live-chat-secondary-text-color);
          font-weight: 500
      }

      #author-name.single-line.yt-live-chat-author-chip {
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break: break-all
      }

      yt-live-chat-author-chip[is-highlighted] #author-name.yt-live-chat-author-chip {
          padding: 2px 4px;
          color: var(--yt-live-chat-author-chip-verified-text-color);
          background-color: var(--yt-live-chat-author-chip-verified-background-color)
      }

      yt-live-chat-author-chip[is-highlighted] #author-name.owner.yt-live-chat-author-chip,#author-name.owner.yt-live-chat-author-chip {
          background-color: var(--yt-live-chat-author-chip-owner-background-color);
          color: var(--yt-live-chat-author-chip-owner-text-color)
      }

      yt-live-chat-author-chip[disable-highlighting] #author-name.yt-live-chat-author-chip {
          color: var(--yt-live-chat-disable-highlight-message-author-name-color,rgba(255,255,255,.7));
          font-size: 110%;
      }

      yt-live-chat-author-chip[dashboard-money-feed] #author-name.yt-live-chat-author-chip {
          display: block;
          color: var(--yt-live-chat-secondary-text-color)
      }

      #author-name.moderator.yt-live-chat-author-chip {
          color: var(--yt-live-chat-moderator-color)
      }

      #author-name.member.yt-live-chat-author-chip {
          color: var(--yt-live-chat-sponsor-color)
      }


      **/

      /**
      *
      *
      *
      #chip-badges.yt-live-chat-author-chip:empty {
        display: none
      }

      yt-live-chat-author-chip[is-highlighted] #chat-badges.yt-live-chat-author-chip:not(:empty) {
        margin-left: 1px
      }

      #chat-badges.yt-live-chat-author-chip {
        white-space: nowrap
      }

      yt-live-chat-author-chip[prepend-chat-badges] yt-live-chat-author-badge-renderer.yt-live-chat-author-chip {
        margin: 0 2px 0 0
      }

      yt-live-chat-author-badge-renderer.yt-live-chat-author-chip {
        margin: 0 0 0 2px;
        vertical-align: sub
      }

      yt-live-chat-author-chip[is-highlighted] #chip-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer.yt-live-chat-author-chip {
        color: inherit
      }

      #chip-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer.yt-live-chat-author-chip:last-of-type {
        margin-right: -2px
      }

      #timestamp.yt-live-chat-auto-mod-message-renderer {
        display: var(--yt-live-chat-item-timestamp-display,inline);
        margin: var(--yt-live-chat-item-timestamp-margin,0 8px 0 0);
        color: var(--yt-live-chat-tertiary-text-color);
        font-size: 11px
      }

      #author-photo.yt-live-chat-auto-mod-message-renderer {
        display: block;
        margin-right: var(--yt-live-chat-author-photo-margin-right,16px);
        overflow: hidden;
        border-radius: 50%;
        flex: none
      }

      yt-live-chat-auto-mod-message-renderer[avatar-hidden] #author-photo.yt-live-chat-auto-mod-message-renderer {
        display: none
      }

      #menu.yt-live-chat-auto-mod-message-renderer {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        transform: translateX(100px)
      }

      **/

      .bst-viewer-engagement-message .bst-message-entry-line{
        display: flex;
        flex-direction: row;
        /* align-items: center; */
        padding: 12px 8px;
      }

      .bst-viewer-engagement-message .bst-message-body {
        flex: none;
        flex-shrink: initial;
      }

      .bst-system-message-yt-icon{
        display:inline-block;
      }

      .bst-viewer-engagement-message yt-icon {
        width: var(--iron-icon-width,24px);
        height: var(--iron-icon-height,24px);
        contain: strict;
      }
      .bst-system-message-icon-column {
        flex: none;
        margin-right: 12px;
      }

      .bst-viewer-engagement-message .bst-message-entry-highlight{
        margin-left:0;
        background-color: var(--bst-highlight-color);
      }

      .bst-paid-message{

        --yt-live-chat-paid-message-background-color: var( --yt-live-chat-paid-message-primary-color );
        --yt-live-chat-paid-message-header-background-color: var( --yt-live-chat-paid-message-secondary-color );
        --yt-live-chat-text-input-field-placeholder-color: var( --yt-live-chat-paid-message-color );
        --yt-live-chat-item-timestamp-display: var( --yt-live-chat-paid-message-timestamp-display,none )
      }


      .bst-paid-message .bst-message-body{
        display:block;
      }
      .bst-paid-message .bst-message-body:empty{
        display: none;
      }

      .bst-paid-message .bst-message-name-color .bst-message-username[class]{
        color: var(--yt-live-chat-disable-highlight-message-author-name-color,rgba(255,255,255,.7));
        font-size: 110%;
      }
      .bst-paid-sticker .bst-message-name-color .bst-message-username[class]{
        color: var(--yt-live-chat-disable-highlight-message-author-name-color,rgba(255,255,255,.7));
        font-size: 110%;
      }


      .bst-paid-message .bst-paid-amount{
        font-size: 115%;
      }
      .bst-paid-sticker .bst-paid-amount{
        font-size: 115%;
      }

      .bst-paid-amount{
        display: inline;
        white-space: nowrap;
        margin-left: 12px;

      }

      .bst-paid-message .bst-message-entry-highlight[class]{
        --bst-highlight-color: var(--yt-live-chat-paid-message-background-color,#1565c0);
        /* border-radius: 12px; */
        background-color: var(--bst-highlight-color);
      }
      .bst-paid-message .bst-message-head{

        color: var(--yt-live-chat-paid-message-header-color,var(--bst-default-text-color));
      }

      .bst-paid-message .bst-message-body{
        background-color: var(--yt-live-chat-paid-message-background-color,#1565c0);
        color: var(--yt-live-chat-paid-message-color,var(--bst-default-text-color));
      }

      .bst-message-list[class] .bst-membership-message[class],
      .bst-message-list[class] .bst-sponsorship-purchase[class],
      .bst-message-list[class] .bst-paid-sticker[class] {
        --yt-live-chat-sponsor-header-color: #0a8043;
        --yt-live-chat-sponsor-color: #0f9d58;
      }

      .bst-membership-message[class]{

        --yt-live-chat-sponsor-text-color: var(--bst-default-text-color);
        --yt-live-chat-item-timestamp-display: var( --yt-live-chat-paid-message-timestamp-display,none );
        --yt-live-chat-moderator-color: var(--yt-spec-static-overlay-text-secondary);
        --yt-live-chat-footer-button-text-color: #030303;
        --yt-live-chat-footer-button-text-background-color: var(--bst-default-text-color);
      }





      .bst-membership-message .bst-message-username[class]{
        color: var(--bst-default-text-color);
      }


      .bst-gift-message .bst-message-body{
        color: var(--yt-live-chat-secondary-text-color);
        font-style: italic;
        margin-left: 2px;
      }



      /*
      .bst-message-menu-container {
        display: none;
      }

      .bst-liveChatTextMessageRenderer .bst-message-menu-container {
        display: flex;
      }


      .bst-message-entry .bst-message-menu-container yt-icon {
        background-color: var(--yt-emoji-picker-search-background-color);
        opacity: 0.68;
      }



      .bst-message-entry .bst-message-menu-container yt-icon:hover {
        opacity: 0.88;
      }



      .bst-message-entry:hover .bst-message-menu-container {
        visibility: visible;
      }

      .bst-message-menu-container {
        visibility: collapse;


        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 26px;
        flex-direction: row;
        box-sizing: border-box;
        align-items: start;
        margin-top: -20px;
      }

      .bst-message-menu-container yt-icon {

        width: 26px;
        height: 26px;
        max-height: 100%;

        box-sizing: border-box;
        border-radius: 0px;
        contain: strict;
      }
      */




      .bst-sponsorship-purchase .bst-message-body{
        display:block;
      }
      .bst-sponsorship-purchase .bst-message-body:empty{
        display: none;
      }


      .bst-sponsorship-purchase{
        padding-right: 6rem;
        min-height: 6.6rem;
      }

      .bst-sponsorship-purchase .bst-message-entry-highlight {
        --bst-highlight-color: var(--yt-live-chat-sponsor-color);
        background: url(https://www.gstatic.com/youtube/img/sponsorships/sponsorships_gift_purchase_announcement_artwork.png); /* to be reviewed? */
        background-repeat: no-repeat;
        background-size: contain;
        background-position: 100% 50%;
        background-color: var(--bst-highlight-color);
        background-size: 6rem;
      }




      .bst-paid-sticker .bst-message-body{
        display:block;
      }
      .bst-paid-sticker .bst-message-body:empty{
        display: none;
      }


      .bst-paid-sticker{
        padding-right: 6rem;
        min-height: 6.6rem;
      }

      .bst-paid-sticker .bst-message-entry-highlight {
        --bst-highlight-color: var(--yt-live-chat-paid-sticker-background-color);
        background: var(--bst-paid-sticker-bg, initial);
        /* background: url(https://www.gstatic.com/youtube/img/sponsorships/sponsorships_gift_purchase_announcement_artwork.png);*/
        background-repeat: no-repeat;
        background-size: contain;
        background-position: 100% 50%;
        background-color: var(--bst-highlight-color);
        background-size: 6rem;
      }

      .bst-paid-sticker .bst-message-head /*.bst-paid-sticker .bst-paid-amount*/ {
        color: var(--yt-live-chat-paid-sticker-chip-text-color, var(--bst-default-text-color));
      }

      .bst-message-entry.bst-message-entry-ll {
        --bst-message-entry-pl:0;
      }
      .bst-message-entry-header {
        --bst-message-entry-pl: calc( var(--yt-live-chat-profile-icon-size) + 6px );
        padding-left: var(--bst-message-entry-pl);

      }

      .bst-membership-message .bst-message-entry-header .bst-message-entry-highlight[class]{
        --bst-highlight-color: var(--yt-live-chat-sponsor-header-color);
        background-color: var(--bst-highlight-color);
      }
      .bst-membership-message .bst-message-entry-body .bst-message-entry-highlight[class]{
        --bst-highlight-color: var(--yt-live-chat-sponsor-color);
        background-color: var(--bst-highlight-color);
      }

      .bst-membership-message .bst-message-entry-header .bst-message-entry-highlight.bst-message-entry-followed-by-body {
        bottom: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      .bst-membership-message .bst-message-entry-body .bst-message-entry-highlight {
        top: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }

      .bst-message-entry-header, .bst-message-entry-body {
        position: relative;
      }

      .bst-membership-message .bst-message-entry-body .bst-message-body::before {
        content: '';
        contain: strict;
        display: inline;
        user-select: none !important;
        pointer-events: none !important;
        line-height: var(--yt-live-chat-first-line-height);
        vertical-align: baseline;
      }

      .bst-membership-message .bst-message-entry-header .bst-message-head {
        margin-right: 8px;
      }

      .bst-membership-message .bst-message-entry-header .bst-message-body {
        margin-left: 0px;
        display: inline-block;
      }

      .bst-membership-message .bst-message-entry-body .bst-message-body {
        margin-left: 8px;
        color: var(--yt-live-chat-sponsor-text-color)
      }

      .bst-name-field-box {
        pointer-events: none;
        display: none;
        position: absolute;
        left: 0;
        top: calc(100% + 4px);
        background: white;
        color: black;
        z-index: 1;
        contain: content;
      }

      .bst-name-field:hover .bst-name-field-box {
        pointer-events: none;     /* display: block;*/
      }

      bst-live-chat-placeholder {
        display: none;
      }

      .bst-profile-card {
        position: absolute;
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        height: 100px;     /* border: 3px solid white; */
        box-sizing: border-box;
        z-index: 2;
        display: flex;
        flex-direction: row;
        border-top-left-radius: var(--border-radius-medium);
        border-top-right-radius: var(--border-radius-medium);
        box-shadow: var(--shadow-elevation-2);
        margin-left: 1.5rem;
        margin-right: 1.5rem;
        background: var(--yt-live-chat-background-color);
        top: calc(var(--fBottom) + 4px);
        transform: initial;
        margin-top: 0;
        margin-bottom: 0;
        max-height: 38vh;
      }

      .bst-profile-card-on-top {
        top: calc(var(--fTop) - 4px);
        transform: translateY(-100%);
        margin-top: 0;
        margin-bottom: 0;
      }

      .bst-profile-card-overlay {
        position: absolute;
        z-index: -1;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: var(--yt-spec-menu-background);
        pointer-events: none;
        opacity: 0.45;
      }

      .bst-profile-card-icon {
        margin: 1rem;
        margin-right: 0;
      }

      .bst-profile-card-icon-img {
        max-height: 50px;
        max-width: 50px;
      }

      .bst-profile-card-main {
        flex-grow: 1;
        margin: 1rem;
      }

      .bst-profile-card-main a[href] {
        --bst-hyperlink-color: var(--bst-default-text-color);
        color: var(--bst-hyperlink-color);
        text-decoration: none;
        display: inline;
      }

      .bst-profile-card-main a[href]:link,
      .bst-profile-card-main a[href]:visited,
      .bst-profile-card-main a[href]:hover,
      .bst-profile-card-main a[href]:active,
      .bst-profile-card-main a[href]:focus {
        color: var(--bst-hyperlink-color);
      }

      .bst-profile-card-cross {
        display: inline-flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        user-select: none;
        border-radius: var(--border-radius-medium);
        height: var(--button-size-default);
        width: var(--button-size-default);
        border: var(--border-width-default) solid transparent;
        cursor: pointer;
        margin: 0.5rem;
        font-family: system-ui;
        font-size: large;
        contain: strict;
      }

      .bst-profile-card-cross:hover {
        background-color: var(--color-background-button-icon-overlay-hover);
        color: var(--color-text-button-overlay-hover);
      }

      .bst-message-before-content-button-container button {
        border-radius: 12px;
        position: relative;
        margin: 0;
        white-space: nowrap;
        min-width: 0;
        text-transform: none;
        border: none;
        cursor: pointer;
        outline-width: 0;
        box-sizing: border-box;
        background: none;
        text-decoration: none;
        margin: 0;
        padding: 0;
        padding: 2px 6px;
        vertical-align: middle;
        margin-bottom: .1rem;
        margin-right: 2px;
        contain: content;
      }

      .bst-message-before-content-button-container button div {
        pointer-events: none !important;
      }

      .bst-message-before-content-button-container button .yt-spec-button-shape-next__icon {
        margin: 0;
        padding: 0;
        border: 0;
        width: 16px;
        height: 16px;
        line-height: 0;
        fill: currentColor;
        contain: strict;
      }

      .bst-message-before-content-button-container yt-touch-feedback-shape {
        display: none !important;
      }

      
      .bst-message-entry {
        /*transform: scale(0.15);*/
        transform-origin: bottom right; 
        transition: transform 160ms ease-in-out 16ms;
      }
      .bst-message-entry[view-pos]{
        transform: scale(1);
      }



      .bst-message-entry > .bst-message-container {
        opacity: 0.3;
        transition: opacity 80ms ease-in-out 8ms;
      }
      .bst-message-entry[view-pos] > .bst-message-container{
        opacity: 1;
      }


    `
  }

  /** @type {import('./library/html').SolidJS}.SolidJS */
  const { createSignal, onMount, createStore, html, render, Switch, Match, For, createEffect, createMemo, Show, onCleanup, createComputed, createRenderEffect } = SolidJS;


  function getThumbnail(thumbnails, min, max) {

    for (const thumbnail of thumbnails) {
      if (min >= 0 && thumbnail.width < min) {
        continue;
      }
      if (max >= 0 && thumbnail.width > max) {
        continue;
      }
      if (typeof thumbnail.url !== 'string') continue;
      return thumbnail.url;
    }
    return thumbnails?.[0]?.url || '';

  }

  function removeEntry(o) {

    const dataMutable = mutableWM.get(o);
    dataMutable && dataMutable.removeEntry();
  }

  function colorFromDecimal(a) {
    if (a === void 0 || a === null) return null;
    a = Number(a);
    if (!(a >= 0)) return null;
    const k = (a >> 24 & 255) / 255;
    let t = `${k}`;
    if (t.length > 9) t = k.toFixed(5);
    if (t === '1') {
      return "rgb(" + [a >> 16 & 255, a >> 8 & 255, a & 255].join() + ")"
    } else {
      return "rgba(" + [a >> 16 & 255, a >> 8 & 255, a & 255, t].join() + ")"
    }
  }


  const formatters = {
    authorBadges(badge, data) {


      try {
        const fk = firstObjectKey(badge) || '';
        const ek = badge[fk];

        /**
         *

                  if (a.icon) {
                      var c = document.createElement("yt-icon");
                      "MODERATOR" === a.icon.iconType && this.enableNewModeratorBadge ? (c.polymerController.icon = "yt-sys-icons:shield-filled",
                      c.polymerController.defaultToFilled = !0) : c.polymerController.icon = "live-chat-badges:" + a.icon.iconType.toLowerCase();
                      b.appendChild(c)
                  } else if (a.customThumbnail) {
                      c = document.createElement("img");
                      var d;
                      (d = (d = eD(a.customThumbnail.thumbnails, 16)) ? Vb(ic(d)) : null) ? (c.src = d,
                      b.appendChild(c),
                      c.setAttribute("alt", this.hostElement.ariaLabel || "")) : qr(new sn("Could not compute URL for thumbnail",a.customThumbnail))
                  }
        *
        */

        if (ek.icon) {

          const icon = ek.icon;
          const type = icon.iconType.toLowerCase();
          if (type === 'owner' && data.bst('shouldHighlight')) {

          } else {

            const tooltipText = () => ek.tooltip || ek.accessibility?.accessibilityData?.label || '';

            const dataMutable = mutableWM.get(data);
            if (dataMutable) {
              const badgeElementId = `badge-${dataMutable.tooltips.size + 1}`;
              dataMutable.tooltips.set(badgeElementId, createStore({
                displayedTooltipText: ''
              }));

              const displayedTooltipText = () => {
                const dataMutable = mutableWM.get(data);
                const [emojiDataStore, emojiDataStoreSet] = dataMutable.tooltips.get(badgeElementId);
                return emojiDataStore.displayedTooltipText
              }

              const onYtIconCreated = (el) => {
                const cnt = insp(el);
                cnt.icon = "live-chat-badges:" + type;
                _setAttribute.call(el, 'icon-type', type);
                _setAttribute.call(el, 'shared-tooltip-text', tooltipText());
              }
              return html`<yt-icon id="${() => badgeElementId}" class="bst-message-badge-yt-icon" ref="${onYtIconCreated}"></yt-icon><bst-tooltip>${displayedTooltipText}</bst-tooltip>`

            } else {
              return '';
            }


          }


        } else if (ek.customThumbnail) {

          const className = `style-scope yt-live-chat-author-badge-renderer bst-author-badge`
          const src = () => getThumbnail(ek.customThumbnail.thumbnails, 32, 64); // 16, 32
          const alt = () => ek.accessibility?.accessibilityData?.label || '';
          const tooltipText = () => ek.tooltip || ek.accessibility?.accessibilityData?.label || '';
          const dataMutable = mutableWM.get(data);
          if (dataMutable) {
            const badgeElementId = `badge-${dataMutable.tooltips.size + 1}`;
            dataMutable.tooltips.set(badgeElementId, createStore({
              displayedTooltipText: ''
            }));

            const displayedTooltipText = () => {
              const dataMutable = mutableWM.get(data);
              const [emojiDataStore, emojiDataStoreSet] = dataMutable.tooltips.get(badgeElementId);
              return emojiDataStore.displayedTooltipText
            }

            return html`<img id="${badgeElementId}" class="${className}" src="${src}" alt="${alt}" shared-tooltip-text="${tooltipText}" /><bst-tooltip>${displayedTooltipText}</bst-tooltip>`
          } else {
            return '';
          }


        }


      } catch (e) {
        console.warn(e);
      }

    },
    messageBody(message, data) {

      if (typeof message === 'string') return html`<span>${() => message}</span>`
      if (typeof message.text === 'string') {
        if (message.navigationEndpoint?.urlEndpoint?.url) {
          const urlEndpoint = message.navigationEndpoint.urlEndpoint;
          return html`<a href="${() => urlEndpoint.url}" rel="${() => urlEndpoint.nofollow === true ? 'nofollow' : null}" target="${() => urlEndpoint.target === "TARGET_NEW_WINDOW" ? '_blank' : null}">${() => message.text}</span>`
        }
        return html`<span>${() => message.text}</span>`
      }

      if (typeof message.emoji !== 'undefined') {


        try {
          const emoji = message.emoji;

          const className = `small-emoji emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer`
          const src = () => `${emoji.image.thumbnails[0].url}`
          const alt = () => emoji.image?.accessibility?.accessibilityData?.label || '';
          const tooltipText = () => emoji.shortcuts?.[0] || '';
          const emojiId = () => emoji.emojiId || '';
          const isCustomEmoji = () => emoji.isCustomEmoji || false;
          const dataMutable = mutableWM.get(data);
          if (dataMutable) {
            const emojiElementId = `emoji-${dataMutable.tooltips.size + 1}`;
            dataMutable.tooltips.set(emojiElementId, createStore({
              displayedTooltipText: ''
            }));

            const displayedTooltipText = () => {
              const dataMutable = mutableWM.get(data);
              const [emojiDataStore, emojiDataStoreSet] = dataMutable.tooltips.get(emojiElementId);
              return emojiDataStore.displayedTooltipText
            }

            return html`<img id="${emojiElementId}" class="${className}" src="${src}" alt="${alt}" shared-tooltip-text="${tooltipText}" data-emoji-id="${emojiId}" is-custom-emoji="${isCustomEmoji}" /><bst-tooltip>${displayedTooltipText}</bst-tooltip>`
          } else {
            return '';
          }

        } catch (e) {
          console.warn(e);
        }

      }
    }
  }

  let sharedButtonViewModel = null;
  let sharedNoscript = null;

  const extras = new WeakMap();
  const getExtra = (elm) => {
    if (!elm) return;
    const s = extras.get(elm);
    if (!s) return;
    return s;
  }
  const setExtra = (elm, extra) => {
    extras.set(elm, extra);
  }

  const SolidBeforeContentButton0 = (data) => {

    const onButtonContainerCreated = (div) => {

      if (!sharedNoscript) return;
      const beforeContentButtons = data.beforeContentButtons;
      if (!beforeContentButtons || beforeContentButtons.length !== 1) return;
      const buttonViewModel = beforeContentButtons[0].buttonViewModel;
      if (!buttonViewModel) return;

      const bvData = Object.assign({}, buttonViewModel, { title: "", trackingParams: "", title_: buttonViewModel.title });

      if (!sharedButtonViewModel) {
        sharedButtonViewModel = document.createElement('yt-button-view-model');
        sharedNoscript.appendChild(sharedButtonViewModel);
        let cloneNode = sharedButtonViewModel.cloneNode(false, false);
        sharedButtonViewModel.replaceWith(cloneNode);
        sharedButtonViewModel = cloneNode;
      }

      const modelNode = sharedButtonViewModel.cloneNode(false, false);
      insp(modelNode).data = bvData;

      div.appendChild(modelNode);

    };
    return html`
      <div ref=${onButtonContainerCreated} class="bst-message-before-content-button-container">
      </div>
    `
  }


  const SolidMessageList = (sb, profileCard) => {

    return html`
    <${Show}
      when=(${() => typeof profileCard.username === 'string'})
      >
      ${() => {

        return html`
      <div classList=(${{ "bst-profile-card": true, "bst-profile-card-on-top": profileCard.showOnTop }}) style=(${() => ({ "--fTop": profileCard.fTop + "px", "--fBottom": profileCard.fBottom + "px" })})>
        <div class="bst-profile-card-overlay"></div>
        <div class="bst-profile-card-icon">
        <img class="bst-profile-card-icon-img" src="${() => profileCard.iconUrl}">
        </div>
        <div class="bst-profile-card-main">
        <a target="_blank" href="${() => profileCard.profileUrl}">${() => profileCard.username}</a>
        </div>
        <div class="bst-profile-card-cross" onClick="${profileCard.onCrossClick}">
        X
        </div>
      </div>
      `

      }}
    <//>
      <${For} each=(${sb})>${(item) => {
        onCleanup(() => {
          removeEntry(item)
        });

        switch (item.aKey) {
          case 'liveChatViewerEngagementMessageRenderer':
            return SolidSystemMessage(item);
          case 'liveChatPaidMessageRenderer':
            return SolidPaidMessage(item);
          case 'liveChatMembershipItemRenderer':
            return SolidMembershipMessage(item);
          case 'liveChatSponsorshipsGiftRedemptionAnnouncementRenderer':
            return SolidGiftText(item);
          case 'liveChatSponsorshipsGiftPurchaseAnnouncementRenderer':
            return SolidSponsorshipPurchase(item);
          case 'liveChatPaidStickerRenderer':
            /** https://www.youtube.com/watch?v=97_KLlaUICQ&t=3600s */
            /* https://www.youtube.com/live/BDjEOkw_iOA?t=6636s */
            return SolidPaidSticker(item);
          case 'liveChatPlaceholderItemRenderer':
            return SolidMessagePlaceHolder(item);
          default:
            return SolidMessageText(item); // liveChatTextMessageRenderer
        }

      }}<//>
  `

  }


  const SolidSystemMessage = (data) => {

    const dataMutable = mutableWM.get(data);
    if (!dataMutable) return '';


    let p = null
    if (data.icon) {

      const icon = data.icon;
      const type = icon.iconType.toLowerCase();

      const onYtIconCreated = (el) => {
        const cnt = insp(el);
        cnt.icon = type;
        _setAttribute.call(el, 'icon-type', type);
      }
      p = () => html`<div class="bst-system-message-icon-column"><yt-icon class="bst-system-message-yt-icon" ref="${onYtIconCreated}"></yt-icon></div>`


    }
    return html`
  <div class="bst-message-entry bst-viewer-engagement-message" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <div class="bst-message-container">
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <${Show} when=(${() => !!data.icon})>${() => {
        return p();
      }}<//>
    <${Show} when=(${() => data.beforeContentButtons && data.beforeContentButtons.length === 1})>${() => SolidBeforeContentButton0(data)}<//>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
        return formatters.messageBody(message, data)
      }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
  </div>`

  }


  const SolidPaidMessage = (data) => {

    // const {authorNameTextColor, bodyBackgroundColor, bodyTextColor, headerBackgroundColor, headerTextColor, textInputBackgroundColor,timestampColor} = data;


    return html`
  <div class="${() => `bst-message-entry bst-paid-message`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <div class="bst-message-container">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
    <div class="bst-message-time">${() => data.bst('timestampText')}</div>
    <div class="bst-name-field bst-message-name-color">
      <div class="bst-message-username">${() => data.bst('getUsername')}</div>
      <div class="bst-message-badges">
      <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
      </div>
    </div>
    <div class="bst-paid-amount">${() => convertYTtext(data.purchaseAmountText)}</div>
    </div>
    <${Show} when=(${() => data.beforeContentButtons && data.beforeContentButtons.length === 1})>${() => SolidBeforeContentButton0(data)}<//>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
        return formatters.messageBody(message, data);
      }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
  </div>
`;
  };

  const SolidMembershipMessage = (data) => {
    return html`
  <div class="${() => `bst-message-entry bst-message-entry-ll bst-membership-message`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <div class="bst-message-container">
  <div classList=${{ "bst-message-entry-header": true, "bst-message-entry-followed-by-body": data.bst('hasMessageBody') }}>
    <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
    <div class="bst-message-entry-highlight"></div>
    <div class="bst-message-entry-line">
      <div class="bst-message-head">
        <div class="bst-message-time">${() => data.bst('timestampText')}</div>
        <div class="bst-name-field bst-message-name-color">
          <div class="bst-message-username">${() => data.bst('getUsername')}</div>
          <div class="bst-message-badges">
          <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
          </div>
        </div>
      </div>
      <div class="bst-message-body">${() => {
        return convertYTtext(data.headerPrimaryText || data.headerSubtext);
        // new member - only data.headerSubtext
        // return convertYTtext(data.headerSubtext)
      }}</div>
    </div>
    <div class="bst-message-menu-container">
    </div>
  </div>
  <${Show} when=(${() => data.bst('hasMessageBody')})>${() => {
        return html`
    <div class="bst-message-entry-body">
      <div class="bst-message-entry-highlight"></div>
      <div class="bst-message-entry-line">
        <div class="bst-message-body">
        <${For} each=(${() => data.bst('messages')})>${(message) => {
            return formatters.messageBody(message, data);
          }}<//>
        </div>
      </div>
    </div>
    `
      }}<//>
  </div>
  </div>
`;
  };



  const SolidGiftText = (data) => {
    return html`
  <div class="${() => `bst-message-entry bst-gift-message`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <div class="bst-message-container">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
      <div class="bst-message-time">${() => data.bst('timestampText')}</div>
      <div class="bst-name-field bst-message-name-color">
        <div class="bst-message-username">${() => data.bst('getUsername')}</div>
        <div class="bst-message-badges">
        <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
        </div>
      </div>
    </div>
    <${Show} when=(${() => data.beforeContentButtons && data.beforeContentButtons.length === 1})>${() => SolidBeforeContentButton0(data)}<//>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
        return formatters.messageBody(message, data);
      }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
  </div>
`;
  };




  const SolidSponsorshipPurchase = (data) => {

    // const {authorNameTextColor, bodyBackgroundColor, bodyTextColor, headerBackgroundColor, headerTextColor, textInputBackgroundColor,timestampColor} = data;


    return html`
  <div class="${() => `bst-message-entry bst-sponsorship-purchase`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <div class="bst-message-container">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
      <div class="bst-message-time">${() => data.bst('timestampText')}</div>
      <div class="bst-name-field bst-message-name-color">
        <div class="bst-message-username">${() => data.bst('getUsername')}</div>
        <div class="bst-message-badges">
        <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
        </div>
      </div>
    </div>
    <${Show} when=(${() => data.beforeContentButtons && data.beforeContentButtons.length === 1})>${() => SolidBeforeContentButton0(data)}<//>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
        return formatters.messageBody(message, data);
      }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
  </div>
`;
  };

  const SolidPaidSticker = (data) => {
    /* https://www.youtube.com/live/BDjEOkw_iOA?si=CGG7boBJvfT2KLFT&t=6636 */

    return html`
  <div class="${() => `bst-message-entry bst-paid-sticker`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <div class="bst-message-container">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight" style="${() => ({ '--bst-paid-sticker-bg': `url(${data.getStickerURL(80, 256)})` })}"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
      <div class="bst-message-time">${() => data.bst('timestampText')}</div>
      <div class="bst-name-field bst-message-name-color">
        <div class="bst-message-username">${() => data.bst('getUsername')}</div>
        <div class="bst-message-badges">
        <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
        </div>
      </div>
      <div class="bst-paid-amount">${() => convertYTtext(data.purchaseAmountText)}</div>
    </div>
    <${Show} when=(${() => data.beforeContentButtons && data.beforeContentButtons.length === 1})>${() => SolidBeforeContentButton0(data)}<//>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
        return formatters.messageBody(message, data);
      }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
  </div>
`;
  }

  const SolidMessageText = (data) => {
    return html`
  <div class="${() => `bst-message-entry bst-${data.aKey}`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <div class="bst-message-container">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
      <div class="bst-message-time">${() => data.bst('timestampText')}</div>
      <div class="bst-name-field bst-message-name-color">
        <div class="bst-name-field-box">
        <div>Icon</div>
        <div>Name</div>
        </div>
        <div class="bst-message-username">${() => data.bst('getUsername')}</div>
        <div class="bst-message-badges">
        <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
        </div>
      </div>
      <span class="bst-message-head-colon" aria-hidden="true"></span>
    </div>
    <${Show} when=(${() => data.beforeContentButtons && data.beforeContentButtons.length === 1})>${() => SolidBeforeContentButton0(data)}<//>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
        return formatters.messageBody(message, data);
      }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
  </div>
`;
  };

  const SolidMessagePlaceHolder = (data) => {

    return html`<bst-live-chat-placeholder ref="${mutableWM.get(data).setupFn}"></bst-live-chat-placeholder>`;

  };


  /**
   *
   * test links
   *
   *
   * moderator
   * https://www.youtube.com/watch?v=1-D4z79ZUV4
   *
   *
   * owner (long text)
   * https://www.youtube.com/watch?v=A930eAQYQog&t=1h32m50s
   *
   */


  function convertYTtext(val) {

    if (typeof (val || 0) !== 'object') return null;
    if (val.simpleText) return val.simpleText

    const runs = val.runs;
    if (runs && runs.length === 1) {
      let r = runs[0];
      return typeof r === 'string' ? r : typeof (r || 0).text === 'string' ? r.text : null;
    } else if (runs && runs.length >= 0) {
      return runs.map(r => (typeof r === 'string' ? r : typeof (r || 0).text === 'string' ? r.text : null)).join('');
    }
    return null;
  }

  const fixMessagesForEmoji = (() => {

    let Vkb = 0
      , Wkb = /tone[1-5]/
      , Xkb = " \uD83C\uDFFB \uD83C\uDFFC \uD83C\uDFFD \uD83C\uDFFE \uD83C\uDFFF".split(" ")
      , Ykb = "UCzC5CNksIBaiT-NdMJjJNOQ/COLRg9qOwdQCFce-qgodrbsLaA UCzC5CNksIBaiT-NdMJjJNOQ/CMKC7uKOwdQCFce-qgodqbsLaA UCzC5CNksIBaiT-NdMJjJNOQ/CJiQ8uiOwdQCFcx9qgodysAOHg UCzC5CNksIBaiT-NdMJjJNOQ/CI3h3uDJitgCFdARTgodejsFWg UCzC5CNksIBaiT-NdMJjJNOQ/CI69oYTKitgCFdaPTgodsHsP5g UCzC5CNksIBaiT-NdMJjJNOQ/CKzQr47KitgCFdCITgodq6EJZg UCzC5CNksIBaiT-NdMJjJNOQ/CPGD8Iu8kN4CFREChAod9OkLmg".split(" ")
      , Zkb = Number.MAX_SAFE_INTEGER
      , $kb = RegExp("\uFE0F", "g")

    let dQ = function (a, b, c) {
      return (a = a.emojiMap[b]) && (!a.isLocked || void 0 !== c && c) ? a : void 0
    }

    let gQ = function (a, b) {
      a = a.emojiShortcutMap[b.toLocaleLowerCase()];
      return !a || a.isLocked ? null : a
    }

    function resultAddText(r, text) {
      if (typeof text === 'string' && text.length >= 1) {
        r.push({ text: text });
      }
    }
    function resultAddEmoji(r, emoji) {
      if (emoji && typeof emoji === 'object') {
        r.push({ emoji: emoji });
      }
    }

    /*

        cQ.prototype.createDocumentFragment = function(a, b, c, d) {
            b = void 0 === b ? !1 : b;
            c = void 0 === c ? !0 : c;
            d = void 0 === d ? !1 : d;
            a = a.replace($kb, "");
            for (var e = document.createDocumentFragment(), g = 0, k, m = 0; null != (k = this.emojiRegex.exec(a)); ) {
                var p = dQ(this, k[0]) || gQ(this, k[0]);
                !p || p.isCustomEmoji && !b || (p = this.createEmoji(p, c),
                g !== k.index && e.appendChild(document.createTextNode(a.substring(g, k.index))),
                e.appendChild(p),
                g = k.index + k[0].length,
                m++)
            }
            if (!d || m)
                return e.appendChild(document.createTextNode(a.substr(g))),
                e
        }

        */

    /*

        cQ.prototype.createEmoji = function(a, b) {
            b = void 0 === b ? !0 : b;
            var c = document.createElement("img");
            a.isCustomEmoji && !x("render_custom_emojis_as_small_images") || c.classList.add("small-emoji");
            c.classList.add("emoji");
            c.classList.add("yt-formatted-string");
            c.src = a.image ? $C(a.image.thumbnails, this.emojiSize) || "" : "";
            var d = void 0;
            a.image && a.image.accessibility && a.image.accessibility.accessibilityData && (d = a.image.accessibility.accessibilityData.label);
            c.alt = d ? d : (a.isCustomEmoji && a.shortcuts ? a.shortcuts[0] : a.emojiId) || "";
            a.isCustomEmoji && (c.dataset.emojiId = a.emojiId);
            ce && (c.setAttribute("contenteditable", "false"),
            c.setAttribute("unselectable", "on"));
            b && (a.shortcuts && a.shortcuts.length && c.setAttribute("shared-tooltip-text", a.shortcuts[0]),
            c.id = "emoji-" + Vkb++);
            return c
        }
        */

    function createEmojiMX(a, b) {

      /*
        b = void 0 === b ? !0 : b;
        var c = document.createElement("img");
        a.isCustomEmoji && !x("render_custom_emojis_as_small_images") || c.classList.add("small-emoji");
        c.classList.add("emoji");
        c.classList.add("yt-formatted-string");
        c.src = a.image ? $C(a.image.thumbnails, this.emojiSize) || "" : "";
        var d = void 0;
        a.image && a.image.accessibility && a.image.accessibility.accessibilityData && (d = a.image.accessibility.accessibilityData.label);
        c.alt = d ? d : (a.isCustomEmoji && a.shortcuts ? a.shortcuts[0] : a.emojiId) || "";
        a.isCustomEmoji && (c.dataset.emojiId = a.emojiId);
        ce && (c.setAttribute("contenteditable", "false"),
        c.setAttribute("unselectable", "on"));
        b && (a.shortcuts && a.shortcuts.length && c.setAttribute("shared-tooltip-text", a.shortcuts[0]),
        c.id = "emoji-" + Vkb++);
        return c
*/

      /*


              try {
                const emoji = message.emoji;

                const className = `small-emoji emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer`
                const src = () => `${emoji.image.thumbnails[0].url}`
                const alt = () => emoji.image?.accessibility?.accessibilityData?.label || '';
                const tooltipText = () => emoji.shortcuts?.[0] || '';
                const emojiId = () => emoji.emojiId || '';
                const isCustomEmoji = () => emoji.isCustomEmoji || false;
                const dataMutable = mutableWM.get(data);
                if (dataMutable) {
                  const emojiElementId = `emoji-${dataMutable.tooltips.size + 1}`;
                  dataMutable.tooltips.set(emojiElementId, createStore({
                    displayedTooltipText: ''
                  }));

                  const displayedTooltipText = () => {
                    const dataMutable = mutableWM.get(data);
                    const [emojiDataStore, emojiDataStoreSet] = dataMutable.tooltips.get(emojiElementId);
                    return emojiDataStore.displayedTooltipText
                  }

                  return html`<img id="${emojiElementId}" class="${className}" src="${src}" alt="${alt}" shared-tooltip-text="${tooltipText}" data-emoji-id="${emojiId}" is-custom-emoji="${isCustomEmoji}" /><bst-tooltip>${displayedTooltipText}</bst-tooltip>`
                } else {
                  return '';
                }

              } catch (e) {
                console.warn(e);
              }
              */


      return a;
    }
    function fixMessagesForEmoji(a, b, c, d) {
      b = void 0 === b ? !1 : b; // false
      c = void 0 === c ? !0 : c; // true
      d = void 0 === d ? !1 : d; // false
      a = a.replace($kb, "");
      let e = document.createDocumentFragment();
      const r = [];
      let g = 0;
      let k;
      let m = 0;
      for (; null != (k = this.emojiRegex.exec(a));) {
        var p = dQ(this, k[0]) || gQ(this, k[0]);
        !p || p.isCustomEmoji && !b || (p = createEmojiMX.call(this, p, c),
          g !== k.index && resultAddText(r, a.substring(g, k.index)),
          resultAddEmoji(r, p),
          g = k.index + k[0].length,
          m++)
      }
      // if (!d || m) return e.appendChild(document.createTextNode(a.substr(g))), e;
      return resultAddText(r, a.substr(g)), r;
    }
    return fixMessagesForEmoji;

  })();

  whenCEDefined('yt-live-chat-item-list-renderer').then(() => {
    let dummy;
    let cProto;
    dummy = document.createElement('yt-live-chat-item-list-renderer');
    if (!(dummy instanceof Element)) return;
    cProto = insp(dummy).constructor.prototype;
    cProto.connectedCallback882 = cProto.connectedCallback;

    // share same objects

    /** @type {HTMLElement} */
    let wliveChatTextMessageRenderer = null;
    /** @type {HTMLElement} */
    let wliveChatTextInputRenderer = null;

    // ....

    /** @type {HTMLElement} */
    let messageList;
    /** @type {IntersectionObserver} */
    let ioMessageList = null;
    /** @type {HTMLElement} */
    let _messageOverflowAnchor = null;
    /** @type {HTMLElement} */
    let _bstMain = null;
    const qq = new WeakMap();
    let _flushed = 0;
    // let bstMainScrollCount = 0;

    const ioMessageListCallback = (entries) => {
      for (const entry of entries) {
        const target = entry?.target;
        const extra = getExtra(target);
        if (extra && typeof extra.interceptionRatioChange === 'function') {
          if (entry.rootBounds && (entry.rootBounds.height > 1 && entry.rootBounds.width > 1)) {

            extra.interceptionRatioChange(entry.intersectionRatio);
          }
        }
      }
    };

    const ioMessageListCleanup = () => {
      if (ioMessageList) {
        ioMessageList.disconnect();
        ioMessageList.takeRecords();
        ioMessageList = null;
      }
    }

    const addMessageOverflowAnchorToShadow = function (shadow) {

      const messageOverflowAnchor = document.createElement('div');
      messageOverflowAnchor.className = 'bst-overflow-anchor'
      shadow.appendChild(messageOverflowAnchor)

      let anchorVisible = false;

      const iooa = new IntersectionObserver((entries) => {
        if (_flushed) { // avoid initial check (not yet flushed)
          anchorVisible = entries[entries.length - 1].isIntersecting === true;
        }
        Promise.resolve().then(() => {
          if (!anchorVisible) {
            this.setAtBottomFalse();
          } else {
            this.setAtBottomTrue();
          }
        });
      }, { root: null, threshold: [0.05, 0.95], rootMargin: '0px' });
      iooa.observe(messageOverflowAnchor);

      _messageOverflowAnchor = messageOverflowAnchor;
    }

    cProto.computeIsEmpty_ = function () {
      mme = this;
      return !(this.visibleItems?.length || 0);
    }
    cProto._flag0281_ = _flag0281_;

    cProto.setupBoostChat = function () {
      let targetElement = (this.$.items || this.$['item-offset']);
      if (!targetElement) return;
      // if(!this.visibleItems__) this.visibleItems__ = [];
      ioMessageListCleanup();

      // this.visibleItemsCount = 0;
      targetElement = targetElement.closest('#item-offset.yt-live-chat-item-list-renderer') || targetElement;
      const bstMain = document.createElement('div');
      const hostElement = this.hostElement;

      const fragment = new DocumentFragment();
      const noscript = document.createElement('noscript');
      appendChild.call(noscript, (wliveChatTextMessageRenderer || (wliveChatTextMessageRenderer = document.createElement('yt-live-chat-text-message-renderer'))));
      appendChild.call(noscript, (wliveChatTextInputRenderer || (wliveChatTextInputRenderer = document.createElement('yt-live-chat-text-input-field-renderer'))));

      fragmentAppendChild.call(fragment, noscript);
      fragmentAppendChild.call(fragment, bstMain);
      const dummyItems = document.createElement('div');
      dummyItems.id = 'items';
      dummyItems.style.display = 'none';
      
      const dummyItemOffset = document.createElement('div');
      dummyItemOffset.id = 'item-offset';
      dummyItemOffset.style.display = 'none';
      appendChild.call(dummyItemOffset, dummyItems);
      

      fragmentAppendChild.call(fragment, dummyItemOffset);

      replaceWith.call(targetElement, fragment);
      sharedNoscript = noscript;

      const shadow = bstMain.attachShadow({ mode: "open" });
      qq.set(hostElement, {
        shadow,
        intersectionObserver: new IntersectionObserver(ioMessageListCallback, { root: bstMain, threshold: [0.05, 0.95] })
      });
      const { intersectionObserver } = qq.get(hostElement);
      bstMain.classList.add('bst-yt-main');
      bstMain.addEventListener('scroll', (a) => {
        // bstMainScrollCount++;
        this.onScrollItems_(a);
      }, false);
      _bstMain = bstMain;


      // const pp = bstMain.parentNode.insertBefore(document.createElement('div'), bstMain.nextSibling);
      // pp.id='item-offset'
      // pp.className = 'style-scope yt-live-chat-item-list-renderer'
      // pp.style.height= '100vh';
      // pp.style.visibility='collapse';


      document.head.appendChild(document.createElement('style')).textContent = `${cssTexts.outer}`

      shadow.appendChild(document.createElement('style')).textContent = `${cssTexts.inner}`
      messageList = document.createElement('div')
      messageList.className = 'bst-message-list';
      shadow.appendChild(messageList)

      messageList.getListRendererCnt = () => {

        let cnt = wliveChatTextMessageRenderer ? insp(wliveChatTextMessageRenderer) : null;
        while (cnt && cnt.is) {
          if (cnt.emojiManager) break;
          cnt = cnt.parentComponent;
          if (!cnt) break;
          cnt = insp(cnt);
        }
        return cnt;
      }

      messageList.getInputRendererCnt = () => {
        let cnt = wliveChatTextInputRenderer ? insp(wliveChatTextInputRenderer) : null;
        return cnt;
      }


      const [visibleCount, visibleCountChange] = createSignal();


      messageList.visibleCount = visibleCount;


      //  const mm = shadow.appendChild(document.createElement('div'))

      //  const [solidBuild, solidBuildSet] = createStore({
      //   list: []
      //  }, { equals: false });
      const [solidBuild, solidBuildSet] = createSignal([], { equals: false });

      this.setupVisibleItemsList(solidBuild, solidBuildSet);

      messageList.solidBuild = solidBuild;
      messageList.solidBuildSet = solidBuildSet;

      createEffect(() => {
        solidBuild() && (ezPr !== null) && Promise.resolve([ezPr]).then(h => h[0].resolve());
      });

      const isListEmpty = createMemo(() => solidBuild().length < 1);
      createEffect(() => {
        const cEmpty = isListEmpty();
        const change = (cEmpty) ^ (!!this.isEmpty);
        if (change) {
          this._setPendingProperty('isEmpty', cEmpty, !0) && this._invalidateProperties()
        }
      });

      const [profileCard, profileCardSet] = createStore({
        wElement: null,
        top: -1,
        showOnTop: null,
        iconUrl: null,
        username: null,
        profileUrl: null,
        onCrossClick: () => {
          profileCardSet({
            wElement: null,
            top: -1,
            showOnTop: null,
            iconUrl: null,
            username: null,
            profileUrl: null,
          });
          if (this.atBottom === true && this.allowScroll === false && this.contextMenuOpen === true) this.contextMenuOpen = false;
        }
      });

      messageList.profileCard = profileCard;
      messageList.profileCardSet = profileCardSet;
      render(SolidMessageList.bind(null, solidBuild, profileCard), messageList);

      addMessageOverflowAnchorToShadow.call(this, shadow);


      let mouseEntered = null;
      const getTooltip = (emojiElement) => {
        const entry = emojiElement ? emojiElement.closest('.bst-message-entry') : null;
        const dataMutable = entry ? mutableWM.get(entry) : null;
        return dataMutable ? dataMutable.tooltips.get(emojiElement.id) : null;
      }
      const leaveEmoji = (emojiElement) => {

        const tooltip = getTooltip(emojiElement);
        if (tooltip) {
          const [emojiDataStore, emojiDataStoreSet] = tooltip;
          emojiDataStoreSet({ displayedTooltipText: '' });
        }
      }
      messageList.addEventListener('mouseenter', function (evt) {
        if (mouseEntered) {
          leaveEmoji(mouseEntered)
          mouseEntered = null;
        }
        const target = evt.target;
        if ((target instanceof HTMLImageElement) || (target instanceof HTMLElement && target.nodeName === 'YT-ICON')) {
          if (target.hasAttribute('shared-tooltip-text')) {
            mouseEntered = target;
            const emojiElement = target;
            const tooltip = getTooltip(emojiElement);
            const [emojiDataStore, emojiDataStoreSet] = tooltip;
            emojiDataStoreSet({ displayedTooltipText: emojiElement.getAttribute('shared-tooltip-text') });
            // emojiData.displayedTooltipText = evt.target.getAttribute('shared-tooltip-text')
            // console.log(10, evt.target.getAttribute('shared-tooltip-text'))
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            return;
          }
        }


      }, true)
      messageList.addEventListener('mouseleave', function (evt) {
        const target = evt.target;
        if (target === mouseEntered && mouseEntered) {
          mouseEntered = null;

          const emojiElement = target;
          leaveEmoji(emojiElement);


          // console.log(12, evt.target.getAttribute('shared-tooltip-text'))
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          return;
        }

      }, true);

      const onNameFieldClick = (target, messageEntry, nameField) => {
        const extra = getExtra(messageEntry);
        if (!extra) return;
        const data = extra.getReactiveData();
        if (!data) return;

        if (this.atBottom === true && this.allowScroll === true && this.contextMenuOpen === false) this.contextMenuOpen = true;

        let r1 = nameField.getBoundingClientRect();
        let fTop = r1.top - messageList.getBoundingClientRect().top;
        let fBottom = fTop + r1.height;
        profileCardSet({
          wElement: mWeakRef(messageEntry),
          fTop,
          fBottom,
          showOnTop: messageEntry.getAttribute('view-pos') === 'down',
          iconUrl: data.getProfilePic(64, -1),
          username: data.bst('getUsername'),
          profileUrl: data.bst('authorAboutPage')
        });


      }

      messageList.addEventListener('click', function (evt) {

        const currentElement = kRef(profileCard.wElement);


        let b = false;
        const target = evt?.target;
        if (target) {
          const messageEntry = target.closest('.bst-message-entry');
          if (messageEntry) {
            const nameField = target.closest('.bst-name-field');
            if (nameField) {
              onNameFieldClick(target, messageEntry, nameField);
              b = true;
            }
          }
        }

        if (!b && currentElement && !target.closest('.bst-profile-card')) {
          profileCard.onCrossClick();
        }
        // console.log('click', target); // TODO
      });


      const attributeFn = () => {
        if (!messageList) return;
        let isDark = document.documentElement.hasAttribute('dark')
        if (isDark) _setAttribute.call(messageList, 'dark', '');
        else _removeAttribute.call(messageList, 'dark');
      };
      (new MutationObserver(attributeFn)).observe(document.documentElement, { attributes: true });
      attributeFn();


      // yt-live-chat-item-list-renderer
      // const lcrAttributeFn = () => {
      //   // if (!messageList) return;
      //   // let isDark = document.documentElement.hasAttribute('dark')
      //   // if (isDark) _setAttribute.call(messageList, 'dark', '');
      //   // else _removeAttribute.call(messageList, 'dark');
      // };
      // (new MutationObserver(lcrAttributeFn)).observe(this.hostElement, { attributes: true });
      // lcrAttributeFn();

      ioMessageList = intersectionObserver;

      createEffect(() => {
        const list = solidBuild();
        let j = 0;
        for (let i = 0; i < list.length; i++) {
          const mutable = mutableWM.get(list[i]);
          if (typeof mutable?.viewVisible === 'function' && typeof mutable?.viewVisibleIdxChange === 'function') {
            if (mutable?.viewVisible()) {
              j++;
              mutable?.viewVisibleIdxChange(j);
            } else {
              mutable?.viewVisibleIdxChange(null);
            }
          }
        }
        visibleCountChange(j);
      });


    }

    // const
    // shadow.appendChild(document.createElement('div')).className = 'bst-message-entry';





    function getAuthor(o) {
      if (o?.rendererFlag === 1) {
        return o?.header?.liveChatSponsorshipsHeaderRenderer;
      }
      return o;
    }


    function getProfilePic(min, max) {
      let w = getAuthor(this)?.authorPhoto || 0;
      w = w.thumbnails || w;
      if (w) {

        if (w.url) return w.url;
        if (typeof w === 'string') return w;
        if (w.length >= 0) {
          const url = getThumbnail(w, min, max);
          if (url) return url;
        }
      }
      return null;
    }

    function getStickerURL(min, max) {
      let w = this.sticker || 0;
      w = w.thumbnails || w;
      if (w) {

        if (w.url) return w.url;
        if (typeof w === 'string') return w;
        if (w.length >= 0) {
          const url = getThumbnail(w, min, max);
          if (url) return url;
        }
      }
      return null;
    }

    const fixMessages = (messages) => {

      const cnt = messageList?.getInputRendererCnt() || null;
      if (!cnt) return messages;

      let res = [];

      for (const message of messages) {
        if (typeof message.text === 'string') {
          let r;
          try {
            r = fixMessagesForEmoji.call(cnt.emojiManager, message.text)
          } catch (e) {
            console.warn(e)
          }
          if (r && r.length === 1 && r[0].text) {
            res.push(message); // eg. hyperlink
          } else if (r && r.length >= 1) {
            // res.push(...r);
            inPlaceArrayPush(res, r);
          } else {
            res.push(message);
          }

          // console.log(199, r)

          /*
          ((a,b,c,d)=>{
            let Wkb = /tone[1-5]/
            , Xkb = " \uD83C\uDFFB \uD83C\uDFFC \uD83C\uDFFD \uD83C\uDFFE \uD83C\uDFFF".split(" ")
            , Ykb = "UCzC5CNksIBaiT-NdMJjJNOQ/COLRg9qOwdQCFce-qgodrbsLaA UCzC5CNksIBaiT-NdMJjJNOQ/CMKC7uKOwdQCFce-qgodqbsLaA UCzC5CNksIBaiT-NdMJjJNOQ/CJiQ8uiOwdQCFcx9qgodysAOHg UCzC5CNksIBaiT-NdMJjJNOQ/CI3h3uDJitgCFdARTgodejsFWg UCzC5CNksIBaiT-NdMJjJNOQ/CI69oYTKitgCFdaPTgodsHsP5g UCzC5CNksIBaiT-NdMJjJNOQ/CKzQr47KitgCFdCITgodq6EJZg UCzC5CNksIBaiT-NdMJjJNOQ/CPGD8Iu8kN4CFREChAod9OkLmg".split(" ")
            , Zkb = Number.MAX_SAFE_INTEGER
            , $kb = RegExp("\uFE0F", "g")

            let b = false;
            let c= true;
            let d = false;
            a = a.replace($kb, "");
            for (var e = document.createDocumentFragment(), g = 0, k, m = 0; null != (k = this.emojiRegex.exec(a)); ) {
                var p = dQ(this, k[0]) || gQ(this, k[0]);
                !p || p.isCustomEmoji && !b || (p = this.createEmoji(p, c),
                g !== k.index && e.appendChild(document.createTextNode(a.substring(g, k.index))),
                e.appendChild(p),
                g = k.index + k[0].length,
                m++)
            }
            if (!d || m)
                return e.appendChild(document.createTextNode(a.substr(g))),
                e


          })(message.text)
          */
        } else {
          res.push(message);
        }
      }

      /*


    cQ.prototype.createDocumentFragment = function(a, b, c, d) {
        b = void 0 === b ? !1 : b;
        c = void 0 === c ? !0 : c;
        d = void 0 === d ? !1 : d;
        a = a.replace($kb, "");
        for (var e = document.createDocumentFragment(), g = 0, k, m = 0; null != (k = this.emojiRegex.exec(a)); ) {
            var p = dQ(this, k[0]) || gQ(this, k[0]);
            !p || p.isCustomEmoji && !b || (p = this.createEmoji(p, c),
            g !== k.index && e.appendChild(document.createTextNode(a.substring(g, k.index))),
            e.appendChild(p),
            g = k.index + k[0].length,
            m++)
        }
        if (!d || m)
            return e.appendChild(document.createTextNode(a.substr(g))),
            e
    }

    */

      return res;


    }


    const convertMessage = function () {

      let message = this.rendererFlag === 1 ? this.header?.liveChatSponsorshipsHeaderRenderer?.primaryText : this.message;
      if (typeof (message || 0) !== 'object') return [];
      let t;
      if ((t = message.simpleText) && typeof t === 'string') {
        message = [{ text: t }];
      } else if ((t = message.runs) && t.length >= 0) {
        message = t;
      } else {
        message = [];
      }
      return fixMessages(message);

    }

    function bst(prop) {

      if (prop === 'getUsername') {
        const authorName = this.rendererFlag === 1 ? this.header?.liveChatSponsorshipsHeaderRenderer?.authorName : this.authorName;
        return convertYTtext(authorName);
      } else if (prop === 'hasMessageBody') {


        const message = this.rendererFlag === 1 ? this.header?.liveChatSponsorshipsHeaderRenderer?.primaryText : this.message;
        if (typeof (message || 0) !== 'object') return false;
        if (message.simpleText) return true;

        const runs = message.runs;
        return runs && runs.length && runs[0];

      } else if (prop === 'messages') {

        return this.messageFixed;

      } else if (prop === 'authorBadges') {


        const badges = getAuthor(this)?.authorBadges;
        if (typeof (badges || 0) !== 'object') return null;
        return badges;

      } else if (prop === 'authorType') {

        function bP(a) {
          return a ? a.icon ? a.icon.iconType.toLowerCase() : a.customThumbnail ? "member" : "" : ""
        }
        if (!this.authorBadges || !(this.authorBadges.length >= 1)) return '';
        for (const badge of this.authorBadges) {
          const r = badge ? badge.liveChatAuthorBadgeRenderer : null;
          if (r && (b = (bP(r))) && "verified" !== b) {
            return b;
          }
        }
        return ''
      } else if (prop === 'shouldHighlight') {
        const authorType = this.bst('authorType');
        return authorType === 'owner';
      } else if (prop === 'timestampText') {
        if (this.timestampText) return convertYTtext(this.timestampText);
        const ts = +this.timestampUsec / 1000;
        if (ts > 1107183600000) {
          const now = Date.now();
          if (ts < (now + 120000)) {
            return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
          }
        }
        return null;
      } else if (prop === 'authorExternalChannelId') {
        return this.authorExternalChannelId;
      } else if (prop === 'authorAboutPage') {
        return `https://www.youtube.com/channel/${this.authorExternalChannelId}/about`;
      }


    }


    cProto.setAtBottomTrue = function () {


      if (this.atBottom === false) {
        this.atBottom = true;
        if (this.activeItems_.length > 0) this.flushActiveItems_();
      }

    }

    cProto.setAtBottomFalse = function () {

      if (this.atBottom === true) {
        this.atBottom = false;
      }

    }

    cProto.__notRequired__ = (cProto.__notRequired__ || 0) | 256;
    cProto.setAtBottom = (...args) => {

      console.log('setAtBottom', 583, ...args)

    }

    const scrollToEnd = () => {
      if (messageList && _messageOverflowAnchor && _bstMain) {
        _bstMain.scrollTop = _messageOverflowAnchor.offsetTop + 5;
      }
    }

    cProto.atBottomChanged_ = function (a) {

      // var b = this;
      // a ? this.hideShowMoreAsync_ || (this.hideShowMoreAsync_ = kw(function() {
      //     O(b.hostElement).querySelector("#show-more").style.visibility = "hidden"
      // }, 200)) : (this.hideShowMoreAsync_ && lw(this.hideShowMoreAsync_),
      // this.hideShowMoreAsync_ = null,
      // O(this.hostElement).querySelector("#show-more").style.visibility = "visible")

      // console.log('atBottomChanged_')

    }

    cProto.smoothScroll_ = function () {

    }

    cProto.resetSmoothScroll_ = function () {
      this.scrollTimeRemainingMs_ = this.scrollPixelsRemaining_ = 0;
      this.lastSmoothScrollUpdate_ = null;
      this.smoothScrollRafHandle_ && window.cancelAnimationFrame(this.smoothScrollRafHandle_);
      this.smoothScrollRafHandle_ = null;

    }

    cProto.isSmoothScrollEnabled_ = function () {
      return false;
    }


    cProto.maybeAddDockableMessage17_ = cProto.maybeAddDockableMessage_;
    cProto.maybeAddDockableMessage_ = function (a) {
      console.log('maybeAddDockableMessage_', 791, a)
      return this.maybeAddDockableMessage17_(a)
    }

    cProto.forEachItem_ = function (a) {
      // mme = this
      let status = 0;
      let i;
      try {
        status = 1;
        i = 0;
        for (const t of this.visibleItems) {
          a.call(this, "visibleItems", t, i++)
        }
        status = 2;
        i = 0;
        for (const t of this.activeItems_) {
          a.call(this, "activeItems_", t, i++);
        }
        status = 3;
      } catch (e) {
        console.error('forEachItem_', status, i, this.visibleItems.length, this.activeItems_.length)
        console.error(e)
      }
    }

    cProto.computeVisibleItems17 = cProto.computeVisibleItems;
    cProto.computeVisibleItems = function (a, b) {

      console.log('computeVisibleItems', 791, a, b)
      // if(!this.visibleItems__) this.visibleItems__ = [];
      // return this.visibleItems__;
      return this.computeVisibleItems17(a, b);

    }

    const replaceObject = (dist, src) => {
      const flushItem = dist;
      if (flushItem) {
        for (const k of Object.keys(flushItem)) {
          flushItem[k] = undefined
        }
        Object.assign(flushItem, src);
        return true;
      }
      return false;
    }
    function prettyPrint(obj, indent = 2) {
      const cache = new Set();

      function stringify(obj, level = 0) {
        const indentStr = ' '.repeat(level * indent);
        const nextIndentStr = ' '.repeat((level + 1) * indent);

        if (obj === null) return 'null';
        if (typeof obj === 'undefined') return 'undefined';
        if (typeof obj === 'string') return `"${obj}"`;
        if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
        if (typeof obj === 'function') return '[[ Function ]]';
        if (typeof obj !== 'object') return String(obj);

        if (cache.has(obj)) {
          return '[Circular]';
        }

        if (obj instanceof Node) {
          return `[[ ${obj.constructor.name} ]]`;
        }


        cache.add(obj);
        const entries = Object.entries(obj);

        if (Array.isArray(obj)) {
          const items = entries.map(([key, value]) => {
            return `${nextIndentStr}${stringify(value, level + 1)}`;
          }).join(',\n');
          return `[\n${items}\n${indentStr}]`;
        } else {
          const items = entries.map(([key, value]) => {
            return `${nextIndentStr}${key}: ${stringify(value, level + 1)}`;
          }).join(',\n');
          return `{\n${items}\n${indentStr}}`;
        }
      }

      return stringify(obj);
    }

    cProto.handleAddChatItemAction_ = function (a) {
      let c = a.item
        , fk = (firstObjectKey(c) || '');
      let e = c[fk]
        , replaceExistingItem = false;

      if (a && e && a.clientId && !e.__clientId__) e.__clientId__ = a.clientId;
      if (a && e && a.clientMessageId && !e.__clientMessageId__) e.__clientMessageId__ = a.clientMessageId;

      // to be reviewed for performance issue // TODO
      const aClientId = a.clientId || ''; // for user client request
      const eId = e.id || ''; // for network content update
      const replacementTo = [];　// expected number of entries - less than or equal to 1

      this.forEachItem_(function (tag, p, idx) {
        const aObjId = (p[fk] || 0).id || undefined;
        if (aObjId === aClientId || aObjId === eId) {
          replacementTo.push([tag, p, idx]);
        }
      });


      if (replacementTo.length > 0) {

        if (replacementTo.length > 1) {
          console.error('replacementTo.length > 1', replacementTo.slice(0));
          // replacementTo.splice(0, replacementTo.length - 1);
        }

        for (const entry of replacementTo) {
          const [tag, p, idx] = entry;
          // const aObj = p[fk];

          if ("visibleItems" === tag) {

            const list = messageList.solidBuild();
            const bObj = list[idx];
            const dataMutable = (bObj ? mutableWM.get(bObj) : null) || 0;

            if (typeof dataMutable.bObjChange === 'function') {
              // console.log(' ===== pV ====')
              // console.dir(prettyPrint(p))
              // console.log(' ===== cV ====')
              // console.dir(prettyPrint(c))
              if (replaceObject(p, c)) {
                dataMutable.bObjChange(e);
                replaceExistingItem = true; // to be added if not matched
                // console.log('replaceObject(visibleItems)', p);
              }
            }
          } else { // activeItems_
            // console.log(' ===== pA ====')
            // console.dir(prettyPrint(p))
            // console.log(' ===== cA ====')
            // console.dir(prettyPrint(c))
            if (replaceObject(p, c)) {
              replaceExistingItem = true;
              // console.log('replaceObject(activeItems_)', p);
            }
          }

        }
        replacementTo.length = 0;
      }

      const d = this.get("stickinessParams.dockAtTopDurationMs", a) || 0;
      if (d) {
        const k = messageList ? messageList.querySelector(`[message-id="${e.id}"]`) : null;
        k ? this.maybeAddDockableMessage_(k) : (this.itemIdToDockDurationMap[e.id] = d);
      }
      replaceExistingItem || this.activeItems_.push(c);
    }

    cProto.handleLiveChatActions_ = function (a) {
      // console.log(883,a) // TODO
      if (a.length) {
        for (const t of a) {
          this.handleLiveChatAction_(t);
        }
        // this.maybeResizeScrollContainer_(a);
        if (this.activeItems_.length > 0) this.flushActiveItems_();
        // kw(function() {
        // b.maybeScrollToBottom_()
        // });
      }
    }


    if (!cProto.handleRemoveChatItemAction72_ && typeof cProto.handleRemoveChatItemAction_ === 'function' && cProto.handleRemoveChatItemAction_.length === 1) {

      cProto.handleRemoveChatItemAction72_ = cProto.handleRemoveChatItemAction_;
      cProto.handleRemoveChatItemAction_ = function (a) {
        const aTargetItemId = a.targetItemId;
        if (!aTargetItemId) return this.handleRemoveChatItemAction72_(a)
        const entries = [];
        this.forEachItem_(function (tag, p, idx) {
          const k = p ? firstObjectKey(p) : null;
          const aObj = k ? p[k] : null;
          if (aObj && aObj.id === aTargetItemId) {
            entries.push([tag, idx]);
          }
        });
        if (entries.length >= 1) {
          if (entries.length > 1) console.warn('entries.length >= 1');
          for (const entry of entries) {
            const [tag, idx] = entry;
            this.splice(tag, idx, 1);
            if (tag === "visibleItems") this.resetSmoothScroll_();
          }
        }
      }
    }

    if (!cProto.handleReplaceChatItemAction72_ && typeof cProto.handleReplaceChatItemAction_ === 'function' && cProto.handleReplaceChatItemAction_.length === 1) {
      cProto.handleReplaceChatItemAction72_ = cProto.handleReplaceChatItemAction_;
      cProto.handleReplaceChatItemAction_ = function (a) {


        const aTargetItemId = a.targetItemId;
        const aReplacementItem = a.replacementItem;
        if (!aTargetItemId || !aReplacementItem) return this.handleReplaceChatItemAction72_(a)
        const itemKey = firstObjectKey(aReplacementItem);
        const rendererItem = itemKey ? aReplacementItem[itemKey] : null;
        if (!rendererItem) return this.handleReplaceChatItemAction72_(a)
        const entries = [];
        this.forEachItem_(function (tag, p, idx) {
          const k = p ? firstObjectKey(p) : null;
          const aObj = k ? p[k] : null;
          if (aObj && aObj.id === aTargetItemId) {
            entries.push([tag, p, idx]);
          }
        });
        if (entries.length >= 1) {
          if (entries.length > 1) console.warn('entries.length >= 1');
          for (const entry of entries) {
            const [tag, p, idx] = entry;
            if (tag === "visibleItems") {
              // this.splice(tag, idx, 1, aReplacementItem)
              const list = messageList.solidBuild();
              const bObj = list[idx];
              const dataMutable = (bObj ? mutableWM.get(bObj) : null) || 0;

              if (typeof dataMutable.bObjChange === 'function') {
                if (replaceObject(p, aReplacementItem)) {
                  dataMutable.bObjChange(rendererItem);
                  // replaceExistingItem = true; 

                  this.resetSmoothScroll_();
                }
              }

            } else {
              // this.activeItems_[idx] = aReplacementItem;
              if (replaceObject(p, aReplacementItem)) {
                // replaceExistingItem = true; 
              }
            }
          }
        }

      }


    }

    /*

        f.handleReplaceChatItemAction_ = function(a) {
        var b = this
          , c = a.replacementItem;
        this.forEachItem_(function(d, e, g) {
            var k = Object.keys(e)[0];
            (e = e[k]) && e.id === a.targetItemId && (d === "visibleItems" ? (b.splice(d, g, 1, c),
            b.resetSmoothScroll_()) : b.activeItems_[g] = c)
        })
    }

399 splice Error
at Array.splice (chrome-extension://fjkkdihifokoajcdnhdhmcdpifmkgeid/YouTube%20Boost%20Chat.user.js#204:136:31)
at a.splice (https://www.youtube.com/s/desktop/a7b1ec23/jsbin/live_chat_polymer.vflset/live_chat_polymer.js:2405:190)
at e.<anonymous> (https://www.youtube.com/s/desktop/a7b1ec23/jsbin/live_chat_polymer.vflset/live_chat_polymer.js:11638:148)
at cProto.forEachItem_ (chrome-extension://fjkkdihifokoajcdnhdhmcdpifmkgeid/YouTube%20Boost%20Chat.user.js#204:3219:13)
at f.handleRemoveChatItemAction_ (https://www.youtube.com/s/desktop/a7b1ec23/jsbin/live_chat_polymer.vflset/live_chat_polymer.js:11638:59)
at f.handleLiveChatAction_ (https://www.youtube.com/s/desktop/a7b1ec23/jsbin/live_chat_polymer.vflset/live_chat_polymer.js:11627:29)
at cProto.handleLiveChatActions_ (chrome-extension://fjkkdihifokoajcdnhdhmcdpifmkgeid/YouTube%20Boost%20Chat.user.js#204:3372:16)
at https://www.youtube.com/s/desktop/a7b1ec23/jsbin/live_chat_polymer.vflset/live_chat_polymer.js:1216:63
at https://www.youtube.com/s/desktop/a7b1ec23/jsbin/live_chat_polymer.vflset/live_chat_polymer.js:3173:62
at Map.forEach (<anonymous>)

f.handleRemoveChatItemAction_ = function(a) {
    var b = this;
    this.forEachItem_(function(c, d, e) {
        var g = Object.keys(d)[0];
        (d = d[g]) && d.id === a.targetItemId && (b.splice(c, e, 1),
        c === "visibleItems" && b.resetSmoothScroll_())
    })
}


*/

    cProto.setupVisibleItemsList = function (solidBuild, solidBuildSet) {
      if (this.visibleItems instanceof Array && !(this.visibleItems instanceof VisibleItemList)) {
        const q = this.visibleItems;
        const p = this.visibleItems.slice();
        this.visibleItems = new VisibleItemList(solidBuild, solidBuildSet);
        p.length >= 1 && inPlaceArrayPush(this.visibleItems, p);
        p.length = 0;
        q.length = 0;
      }
    }
    cProto.clearList = function () {
      if (!this.clearCount) this.clearCount = 1;
      this.clearCount++;
      if (this.clearCount > 1e9) this.clearCount = 9;
      if (this.activeItems_) this.activeItems_.length = 0;
      flushKeys.clear();
      // this.setupVisibleItemsList();
      if (this.visibleItems && (this.visibleItems.length > 0)) {
        if (typeof this.visibleItems.bypass === 'boolean') this.visibleItems.bypass = true;
        this.visibleItems.length = 0;
        if (typeof this.visibleItems.bypass === 'boolean') this.visibleItems.bypass = false;
        if (messageList) {
          messageList.classList.remove('bst-listloaded');
          messageList.solidBuildSet(a => ((a.length = 0), a));
        }
      }
      if (!this.activeItems_.length && !this.visibleItems.length) {
        // condition check for just in case
        this.setAtBottomTrue();
      }
      this.dockableMessages = [];
      this.isSmoothed_ = !0;
      this.lastSmoothChatMessageAddMs_ = null;
      this.chatRateMs_ = 1E3;
      this.lastSmoothScrollClockTime_ = this.lastSmoothScrollUpdate_ = null;
      this.scrollTimeRemainingMs_ = this.scrollPixelsRemaining_ = 0;
      this.smoothScrollRafHandle_ = null;
      this.preinsertHeight_ = 0;
      this.itemIdToDockDurationMap = {};
      this.$['docked-messages'].clear();
      this.bannerManager.reset();
      // this.maybeResizeScrollContainer_([]);
      // this.items.style.transform = "";
      // this.atBottom || this.scrollToBottom_()
    }

    /*
      cProto.clearList = function() {
        window.cancelAnimationFrame(this.scrollClampRaf || 0);
        // lw(this.scrollStopHandle || 0);
        window.cancelAnimationFrame(this.asyncHandle || 0);
        this.items = [];
        this.asyncHandle = null;
        this.shouldAnimateIn = !1;
        this.scrollClampRaf = this.lastFrameTimestamp = null;
        this.scrollStartTime = this.scrollRatePixelsPerSecond = 0;
        this.scrollStopHandle = null
      }
    */

    /*

      onScroll: function() {
          var a = Date.now();
          50 > a - this.lastHandledScroll_ || (this.lastHandledScroll_ = a,
          this.markDirty())
      },

      // no need

    */


    cProto.onScrollItems_ = function (a) {

      // console.log('onScrollItems_', 583, )
      this.ytRendererBehavior.onScroll(a);
      // this.setAtBottom();
      // this.flushActiveItems_();
    }
    cProto.__notRequired__ = (cProto.__notRequired__ || 0) | 512;

    cProto.scrollToBottom_ = function () {
      // console.log(1882)
      flushPE(async () => {

        scrollToEnd();

        this.setAtBottomTrue();
      })

      // this.itemScroller.scrollTop = Math.pow(2, 24);
      // this.atBottom = !0
    }

    cProto.showNewItems_ = function (...args) {

      console.log('showNewItems_', 583, ...args)

    }

    cProto.refreshOffsetContainerHeight_ = function () {

      console.log('refreshOffsetContainerHeight_', 583, ...args)
    }

    cProto.maybeResizeScrollContainer_ = function (...args) {


      console.log('maybeResizeScrollContainer_', 583, ...args)
    }


    /*

    this.push.apply(this, this.activeItems_)

    // c = visibleItems

    a=Array of ... [pending visibleItems]

    // g = this.visibleItems


            a.prototype.push = function(c) {
                var d = Ta.apply(1, arguments)
                  , e = {
                    path: ""
                }
                  , g = lu(this, c, e)
                  , k = g.length
                  , m = g.push.apply(g, la(d));
                d.length && pu(this, g, e.path, k, d.length, []);
                return m
            }

    */

    function getUID(aObj) {
      return `${aObj.authorExternalChannelId}:${aObj.timestampUsec}`
    }
    function convertAObj(aObj, aKey) {

      aObj.uid = getUID(aObj);
      if (aKey && typeof aKey === 'string') aObj.aKey = aKey;

      if (aObj.aKey === "liveChatSponsorshipsGiftPurchaseAnnouncementRenderer") {
        aObj.rendererFlag = 1;
      } else {
        aObj.rendererFlag = 0;
      }
      aObj.getProfilePic = getProfilePic;
      aObj.getStickerURL = getStickerURL;
      aObj.bst = bst;

      aObj.messageFixed = convertMessage.call(aObj);

      return convertAObj;
    }
    let nyhaDPr = null;
    window.addEventListener('message', (evt) => {
      if ((evt || 0).data === 'nyhaD' && nyhaDPr !== null) nyhaDPr.resolve();
    });
    const timelineResolve = async () => {
      if (nyhaDPr !== null) {
        await nyhaDPr.then();
        return;
      }
      nyhaDPr = new PromiseExternal();
      window.postMessage('nyhaD');
      await nyhaDPr.then();
      nyhaDPr = null;
    }

    const [modiValue, modiValueSet] = createSignal();
    const [tartValue, tartValueSet] = createSignal();
    const [ezValue, ezValueSet] = createSignal();

    createEffect(() => {
      if (modiValue() === tartValue() && mloPr !== null) {
        mloPr.resolve();
      }
    });


    // const isOverflowAnchorSupported = CSS.supports("overflow-anchor", "auto") && CSS.supports("overflow-anchor", "none");
    cProto.flushActiveItems37_ = cProto.flushActiveItems_;
    cProto.flushActiveItems_ = function () {
      const clearCount0 = this.clearCount;
      const items = (this.$ || 0).items;
      const hostElement = this.hostElement;
      if (!(items instanceof Element)) return;
      if (!qq.has(hostElement)) {
        this.setupBoostChat();
        const thisData = this.data;
        if (thisData.maxItemsToDisplay > 0) thisData.maxItemsToDisplay = MAX_ITEMS_FOR_TOTAL_DISPLAY;
      }

      if (!messageList) return;
      window.__bstFlush01__ = Date.now();

      // if(this.hostElement.querySelectorAll('*').length > 40) return;
      flushPE(async () => {

        // add activeItems_ to visibleItems

        // activeItems_ -> clear -> add to visibleItems

        // this.setupVisibleItemsList();


        window.__bstFlush02__ = Date.now();
        const activeItems_ = this.activeItems_;
        let _addLen = activeItems_.length;
        // console.log(55, _addLen)
        if (_addLen === 0) return;
        // if(this.visibleItemsCount > 40) return;

        const maxItemsToDisplay = this.data.maxItemsToDisplay;

        if (!this.canScrollToBottom_()) {

          _addLen > maxItemsToDisplay * 2 && activeItems_.splice(0, _addLen - maxItemsToDisplay)
          return;
        } else {
          if (_addLen > maxItemsToDisplay) {
            if (this.visibleItems && (this.visibleItems.length > 0)) {
              if (typeof this.visibleItems.bypass === 'boolean') this.visibleItems.bypass = true;
              this.visibleItems.length = 0;
              if (typeof this.visibleItems.bypass === 'boolean') this.visibleItems.bypass = false;
              if (messageList) {
                messageList.solidBuildSet(a => ((a.length = 0), a));
              }
            }
            activeItems_.splice(0, _addLen - maxItemsToDisplay);
          }

        }

        window.__bstFlush03__ = Date.now();



        _flushed = 1;
        const items = activeItems_.slice(0);

        {



          const pp = this.visibleItems.map(e => {
            if (!e) return null;
            if (typeof e === 'object') e = Object.values(e)[0] || 0;
            return e.id || null;
          });
          const fp = pp.filter(e => typeof (e || 0) === 'string')

          const cp = fp.filter(e => {
            let idx1 = fp.indexOf(e);
            if (idx1 >= 0) {
              return fp.indexOf(e, idx1 + 1) < 0;
            }
            return false;
          });
          if (pp.length !== fp.length || fp.length !== cp.length || pp.length !== cp.length) {

            console.log(992, pp.length, fp.length, cp.length)
          }

        }
        //  console.log(9192, 299, items);
        // activeItems_.length = 0;
        // const crCount = this.clearCount;
        // const pEmpty = this.isEmpty;


        if (clearCount0 !== this.clearCount) return;
        if (this.isAttached !== true) return;
        if (items.length === 0) return;

        let existing = new Set();
        for (const entry of this.visibleItems) {
          let k = entry ? firstObjectKey(entry) : null;
          let p = k ? entry[k] : null;
          p && p.id && existing.add(p.id);
        }

        let rearrangedW = items.map(flushItem => {

          const aKey = flushItem ? firstObjectKey(flushItem) : null;
          const aObj = aKey ? flushItem[aKey] : null;
          if (!aObj) return null;

          const id = aObj.id
          const uid = getUID(aObj);
          if (existing.has(id)) return null;
          existing.add(id);
          // if (flushKeys.has(uid)) return null;
          // flushKeys.add(uid);

          return {
            flushItem,
            aKey, aObj, uid
          };

        }).filter(e => !!e);
        existing.clear();

        const nd = rearrangedW.length;
        if (nd === 0) return;

        // await timelineResolve();
        await Promise.resolve();

        if (clearCount0 !== this.clearCount) return;
        if (this.isAttached !== true) return;

        const mapToFlushItem = new Map();
        // no filtering
        const rearrangedFn = entry => {

          const {
            flushItem,  // flushItem is object so it content can be replaced since rearrangedW
            aKey, aObj, uid
          } = entry;
          // flushKeys.removeAdd(uid);

          convertAObj(aObj, aKey);


          const [bObj, bObjSet] = createStore(aObj);
          const createdPromise = new PromiseExternal();
          const renderedPromise = new PromiseExternal();
          const mutable = {
            removeEntryFuncs: new Map(),
            tooltips: new Map(),
            createdPromise: createdPromise,
            renderedPromise: renderedPromise,
            removeEntry() {

              this.removeEntryFuncs.forEach((f) => {
                f.call(this);
              });
              this.removeEntryFuncs.clear();
              this.tooltips.clear();

              this.createdPromise = null;
              this.renderedPromise = null;
              this.removeEntryFuncs = null;
              this.tooltips = null;
              this.removeEntry = null;
              this.setupFn = null;
              this.bObjChange = null;

            },
            bObjChange(val) {
              if (typeof (val || 0) === 'object') {
                for (const s of ['authorBadges', 'message']) {
                  Reflect.has(val, s) || (val[s] = undefined);
                  Reflect.has(val, s) || (val[s] = undefined);
                }
              }
              convertAObj(val, val.aKey || undefined);
              bObjSet(val);
            },
            setupFn(_messageEntry) {

              // console.log(1299, _messageEntry)

              /** @type {HTMLElement} */
              const messageEntry = _messageEntry;
              mutableWM.set(messageEntry, mutable);

              const [interceptionRatio, interceptionRatioChange] = createSignal(null);
              const [viewVisible, viewVisibleChange] = createSignal(null);
              const [viewVisibleIdx, viewVisibleIdxChange] = createSignal(null); // 1 to n

              // messageEntry.interceptionRatio = interceptionRatio;
              // messageEntry.interceptionRatioChange = interceptionRatioChange;
              mutable.viewVisible = viewVisible;
              mutable.viewVisibleChange = viewVisibleChange;
              mutable.viewVisibleIdx = viewVisibleIdx;
              mutable.viewVisibleIdxChange = viewVisibleIdxChange;

              setExtra(messageEntry, {
                getReactiveData: () => bObj,
                interceptionRatioChange: interceptionRatioChange
              });

              const bObjChange = mutable.bObjChange;
              messageEntry.polymerController = {
                set(prop, val) {
                  if (prop === 'data') {
                    bObjChange(val);
                  }
                },
                get data() {
                  return bObj;
                },
                set data(val) {
                  bObjChange(val);
                },
                get dataRaw() {
                  return aObj;
                },
                get authorType() {
                  function bP(a) {
                    return a ? a.icon ? a.icon.iconType.toLowerCase() : a.customThumbnail ? "member" : "" : ""
                  }
                  if (!bObj.authorBadges || !(bObj.authorBadges.length >= 1)) return '';
                  for (const badge of bObj.authorBadges) {
                    const r = badge ? badge.liveChatAuthorBadgeRenderer : null;
                    if (r && (b = (bP(r))) && "verified" !== b) {
                      return b;
                    }
                  }
                  return ''
                }
              }
              // messageEntry.solidDispose = ()=>{};
              // messageEntry.removeEntry = function () {
              //   removeEntry(this);
              //   // this.solidDispose();
              // }
              mutable.removeEntryFuncs.set('baseRemove', () => {
                mutableWM.delete(bObj);
                mutableWM.delete(messageEntry);
              });

              !!(bObj.aKey && bObj.aKey !== 'liveChatTextMessageRenderer') && (() => {
                const a = bObj;
                const entries = Object.entries({


                  "--yt-live-chat-disable-highlight-message-author-name-color": colorFromDecimal(a.authorNameTextColor),
                  "--yt-live-chat-text-input-background-color": colorFromDecimal(a.textInputBackgroundColor),

                  ...(a.aKey === "liveChatPaidMessageRenderer" ? {

                    "--yt-live-chat-paid-message-primary-color": colorFromDecimal(a.bodyBackgroundColor),
                    "--yt-live-chat-paid-message-secondary-color": colorFromDecimal(a.headerBackgroundColor),
                    "--yt-live-chat-paid-message-header-color": colorFromDecimal(a.headerTextColor),
                    "--yt-live-chat-paid-message-timestamp-color": colorFromDecimal(a.timestampColor),
                    "--yt-live-chat-paid-message-color": colorFromDecimal(a.bodyTextColor),
                  } : {

                  }),

                  ...(a.aKey === "liveChatPaidStickerRenderer" ? {
                    "--yt-live-chat-paid-sticker-chip-background-color": colorFromDecimal(a.moneyChipBackgroundColor),
                    "--yt-live-chat-paid-sticker-chip-text-color": colorFromDecimal(a.moneyChipTextColor),
                    "--yt-live-chat-paid-sticker-background-color": colorFromDecimal(a.backgroundColor),
                  } : {

                  })


                });

                if (entries.length >= 1) {
                  for (const [key, value] of entries) {
                    if (value) messageEntry.style.setProperty(key, value);
                  }
                }

              })();

              /*
              const menuContainer = messageEntry.querySelector('.bst-message-menu-container');
              if(menuContainer){
                menuContainer.appendChild(document.createElement('yt-icon')).icon= 'yt-icons:more' // 'more_vert';
              }
              */

              // messageEntry.onInterception = function(){
              //   this.
              // }

              // change on state
              createEffect(() => {

                const visible = interceptionRatio();
                if (visible > 0.9) {
                  viewVisibleChange(1);
                } else if (visible < 0.1) {
                  viewVisibleChange(0);
                }

              });

              // change on state -> change on DOM
              // createRenderEffect(() => {
              //   const v = viewVisible();
              //   if (v === 1) {
              //     messageEntry.setAttribute('view-visible', '1');
              //   } else if (v === 0) {
              //     messageEntry.removeAttribute('view-visible');
              //   }
              // });

              // change on state
              const viewVisiblePos = createMemo(() => {
                if (!messageList) return;
                const viewCount = messageList.visibleCount();
                const num = viewVisibleIdx();
                if (num >= 1 && viewCount >= 1) {
                  return (num > (viewCount / 2)) ? 'down' : 'up';
                  // messageEntry.setAttribute('view-pos', (num > (viewCount / 2)) ? 'down' : 'up');
                } else {
                  return null;
                  // messageEntry.removeAttribute('view-pos');
                }
              });

              // change on state -> change on DOM
              createEffect(() => {
                const v = viewVisiblePos();
                if (v === null) {
                  _removeAttribute.call(messageEntry, 'view-pos');
                } else {
                  _setAttribute.call(messageEntry, 'view-pos', v);
                }
              });

              mutable.viewVisiblePos = viewVisiblePos;

              ioMessageList && ioMessageList.observe(messageEntry);

              createdPromise.resolve(messageEntry);

              modiValueSet(value => value + 1);


            }
          }
          mutableWM.set(bObj, mutable);

          mapToFlushItem.set(bObj, flushItem);


          return bObj;
        };

        const visibleItems = this.visibleItems;
        let wasEmpty = false;
        let needScrollToEnd = false;
        if (visibleItems.length === 0) {
          needScrollToEnd = true;
          wasEmpty = true;
        } else if (this.canScrollToBottom_() === true) {
          // try to avoid call offsetHeight or offsetTop directly
          const list = messageList.solidBuild();
          const bObj = list && list.length ? list[0] : null;
          if (bObj) {
            const dataMutable = mutableWM.get(bObj);
            if (dataMutable && typeof dataMutable.viewVisiblePos === 'function' && typeof dataMutable.viewVisiblePos() === 'string') { // down or up
              needScrollToEnd = true;
            }
          }
        }


        if (mloPr !== null) mloPr.resolve();
        mloPr = null;
        mloPrReleaseAt = 0;

        const promiseFn = mloPrSetup(messageList, nd - 1);
        let target0 = Date.now();
        tartValueSet(() => -1);
        modiValueSet(() => target0);

        let rJ = 0;
        let bObjX = null;

        const removeFromActiveItems = (flushItem) => {
          if (activeItems_.length > 0) {
            const index = activeItems_.indexOf(flushItem);
            if (index > -1) {
              if (index >= 1) {
                activeItems_.splice(index, 1);
              } else {
                activeItems_.shift();
              }
              return true;
            }
          }
          return false;
        }

        const loopFunc = (list) => {

          const bObj = bObjX;
          const flushItem = mapToFlushItem.get(bObj);
          const n = list.length - maxItemsToDisplay + 1;
          visibleItems.setBypass(true);
          if (n >= 1) {
            if (n > 1) {
              visibleItems.splice(0, n);
              list.splice(0, n);
            } else {
              visibleItems.shift();
              list.shift();
            }
          }
          removeFromActiveItems(flushItem);
          list.push(bObj);
          visibleItems.push(flushItem);
          visibleItems.setBypass(false);
          return list;
        }

        let awaitTime = 0;
        const timeline = new DocumentTimeline;
        const timelines = new Set();
        const t1 = performance.now();

        window.__bstFlush04__ = Date.now();
        let tq = t1;
        let mg = 0;
        ezPr = null;
        let listChangeCount = 0;
        for (; rJ < nd; rJ++) {
          if (clearCount0 !== this.clearCount || this.isAttached !== true) {
            flushKeys.clear();
            break;
          }
          const j = rJ;
          bObjX = rearrangedFn(rearrangedW[j]);
          timelines.add(`${timeline.currentTime}|${tq}`);
          mloUz = rJ;
          ezPr = new PromiseExternal();
          messageList.solidBuildSet(loopFunc);
          if (ezPr) await ezPr.then();
          listChangeCount++;
          // if(!wasEmpty && document.visibilityState==='visible') await new Promise(r=>requestAnimationFrame(r))
          const tu = performance.now();
          if (tu - tq >= 6) {
            // if (wasEmpty) scrollToEnd(); // before the last timelineResolve
            await timelineResolve();
            const tv = performance.now();
            awaitTime += Math.round(tv - tu);
            tq = tv;
            mg++;
          }
        }
        mapToFlushItem.clear();
        if (ezPr) await ezPr.then();
        rearrangedW.length = 0;
        rearrangedW = null;
        if (listChangeCount > 0) {
          mloPrReleaseAt = Date.now() + 100;
          const target1 = target0 + listChangeCount;
          tartValueSet(() => target1);
          if (!mloCond()) { // just in case
            // await timelineResolve();
            console.log(`flushItems: interupted; rJ=${rJ}; nd=${nd}`);
            // await new Promise(resolve=>setTimeout(resolve, 80));
            // return;
          }
          await promiseFn();
        }

        window.__bstFlush05__ = Date.now();
        mloPrReleaseAt = 0;
        if (mloPr !== null) mloPr.resolve();
        mloPr = null;
        if (needScrollToEnd) scrollToEnd(); // before the last timelineResolve
        // await timelineResolve();
        await Promise.resolve();
        if (wasEmpty) messageList.classList.add('bst-listloaded');
        const t2 = performance.now();
        // let at1 =  timeline.currentTime
        // console.log(5913,[...timelines], timeline.currentTime)

        // while(timeline.currentTime - at1 < 0.008){
        //   await timelineResolve();
        // }
        // console.log(5914,[...timelines], timeline.currentTime)

        if (LOGTIME_FLUSHITEMS) {
          const T = Math.round(t2 - t1);
          const t = T - awaitTime;
          if (mg > 0) console.log(`flushItems; n=${nd}; t=${t}(T=${T}); mg=${mg}`);
          if (nd > 20) console.log(`one-by-one = true <${nd}>; t=${t}(T=${T})`);
        }

        {

          const pp = this.visibleItems.map(e => {
            if (!e) return null;
            if (typeof e === 'object') e = Object.values(e)[0] || 0;
            return e.id || null;
          });
          const fp = pp.filter(e => typeof (e || 0) === 'string')

          const cp = fp.filter(e => {
            let idx1 = fp.indexOf(e);
            if (idx1 >= 0) {
              return fp.indexOf(e, idx1 + 1) < 0;
            }
            return false;
          });
          if (pp.length !== fp.length || fp.length !== cp.length || pp.length !== cp.length) {

            console.log(993, pp.length, fp.length, cp.length)
          }
        }

        window.__bstFlush06__ = Date.now();

        // await timelineResolve();

        // const tn2 = performance.now();

        // console.log('tn', tn2-tn1);



      });


    }


  });

})();
