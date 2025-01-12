// ==UserScript==
// @name                YouTube Boost Chat
// @namespace           UserScripts
// @version             0.2.7
// @license             MIT
// @match               https://*.youtube.com/live_chat*
// @grant               none
// @author              CY Fung
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @require             https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@5d83d154956057bdde19e24f95b332cb9a78fcda/library/default-trusted-type-policy.js
// @require             https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@b020bbb73dfa65d72b4656596f8e9ff1549becd6/library/solid-js-prod.js
// @description         Full Replacement of YouTube Chat Message List
// @description:ja      YouTubeチャットメッセージリストの完全置き換え
// @description:zh-TW   完全替換 YouTube 聊天訊息列表
// @description:zh-CN   完全替换 YouTube 聊天消息列表
// ==/UserScript==

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

(() => {

  const USE_SHADOWROOT = false;

  const MAX_ITEMS_FOR_TOTAL_DISPLAY = 90;
  // const RENDER_MESSAGES_ONE_BY_ONE = true;
  const LOGTIME_FLUSHITEMS = false;
  const DEBUG_windowVars = false;

  // ----------------------------------------------------------------------------------------------------------

  /** @type {WeakMapConstructor} */
  const WeakMap = window.WeakMapOriginal || window.WeakMap;




  let isThisBrowserSupported = true;
  let DO_scrollIntoViewIfNeeded = false;

  if (isThisBrowserSupported && (typeof Element.prototype.attachShadow !== 'function' || typeof IntersectionObserver === 'undefined' || typeof CSS === 'undefined' || typeof CSS.supports === 'undefined')) {
    isThisBrowserSupported = false;
  } else {
    const isOverflowAnchorSupported = CSS.supports("overflow-anchor", "auto") && CSS.supports("overflow-anchor", "none");
    const isScrollIntoViewIfNeededSupported = typeof Element.prototype.scrollIntoViewIfNeeded === 'function';

    if (isThisBrowserSupported && !isOverflowAnchorSupported && isScrollIntoViewIfNeededSupported) {
      DO_scrollIntoViewIfNeeded = true; // for webkit (Safari, Orion)
    } else if (isThisBrowserSupported && !isOverflowAnchorSupported && !isScrollIntoViewIfNeededSupported) {
      isThisBrowserSupported = false;
    }
  }

  if (!isThisBrowserSupported) {
    console.warn('Your browser does not support YouTube Boost Chat');
    return;
  }

  const _flag0281_ = window._flag0281_ = 0x2 | 0x4 | 0x8 | 0x40 | 0x80 | 0x100 | 0x40000;



  const defaultPolicy = (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy) || { createHTML: s => s };
  function createHTML(s) {
    return defaultPolicy.createHTML(s);
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

  if (!HTMLElement.prototype.getAttribute23751 && !HTMLElement.prototype.getAttribute23752 && typeof HTMLElement.prototype.getAttribute === 'function') {

    HTMLElement.prototype.getAttribute23751 = HTMLElement.prototype.getAttribute;
    HTMLElement.prototype.getAttribute23752 = function (x) {
      if (x === 'shared-tooltip-text' && arguments.length === 1) {
        return null;
      }
      return this.getAttribute23751(x)
    };

  }

  const isCtrl = (e) => !!((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey));
  const isAlt = (e) => !!(e.altKey);

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  class VisibleItemList extends Array {
    constructor(...args) {
      super(...args);
      R(this);
    }

    reverse() {
      return W(this) && super.reverse();
    }
    flat(depth = 1) {
      return W(this) && super.flat(...arguments);
    }
    flatMap(callbackFn, thisArg = undefined) {
      return W(this) && super.flatMap(...arguments);
    }
    fill(value, start = undefined, end = undefined) {
      return W(this) && super.fill(...arguments);
    }
    sort(compareFn = undefined) {
      return W(this) && super.sort(...arguments);
    }

    push(...elements) {
      return W(this) && super.push(...arguments);
    }

    pop() {
      return W(this) && super.pop();
    }

    unshift(...elements) {
      return W(this) && super.unshift(...arguments);
    }

    shift() {
      return W(this) && super.shift();
    }
 
    splice(start, deleteCount, ...items) {
      return W(this) && super.splice(...arguments);
    }


    setLength(n) {
      W(this).length = n;
    }

    getLength(){
      return this.length;
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
            res = await fn(); // performance concern? (8.6ms)
          } catch (e) {
            console.log('[yt-bst] error_F1', e);
            reject(e);
          }
          resolve(res);
        }).catch(console.warn);
      });
    };
    return pipelineExecution;
  };



  const firstObjectKey = (obj) => { // performance concern? (8.6ms)
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
        display: inline;
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

        /* transform-origin: bottom right; */
        /* transition: transform 160ms ease-in-out 16ms; */
        contain: layout style;
        --bst-message-entry-opacity-v: 0.3; /* .bst-message-entry > .bst-message-container */

      }

      .bst-message-entry[view-pos] {
        /* transform: scale(1); */
        --bst-message-entry-opacity-v: 1.0;
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

      .bst-message-entry-holding .bst-message-entry-highlight{
        --color-background-interactable-alpha-hover: var(--color-opac-w-5);
      }

      .bst-message-entry-line {
        position: relative;
        display: inline;
      }

      .bst-message-entry:hover .bst-message-entry-highlight{
        background-color: var(--bst-highlight-color);
      }

      .bst-message-entry-holding .bst-message-entry-highlight{
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

      /* avoid "~" operator */ /* [^\s"']\s*[~\+]\s*[a-zA-Z] */
      .bst-message-body-next-to-head{
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
        contain: content;
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
        all: unset;
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

        transform: var(--bst-tooltip-transform, translate(-50%, 100%));
        margin-top: var(--bst-tooltip-mt, 0);
        margin-bottom: var(--bst-tooltip-mb, -4px);

      }
      bst-tooltip:empty{
        display: none;
      }

      .bst-message-entry:hover{
        z-index:1;
      }
      .bst-message-entry-holding{
        z-index:2;
      }

      .bst-message-entry[view-pos="down"] {
        --bst-tooltip-transform: translate(-50%, -100%);
        --bst-tooltip-mt: -4px;
        --bst-tooltip-mb: 0;
        --bst-message-menu-container-bottom: 100%;
      }

      .bst-message-menu-container tp-yt-paper-listbox{
        display: var(--bst-message-menu-listbox-display, flex) !important;
        flex-direction: var(--bst-message-menu-listbox-flex-direction, column) !important;
      }

      .bst-message-entry{
        --bst-message-menu-listbox-display: flex;
        --bst-message-menu-listbox-flex-direction: column;
      }

      .bst-message-entry[view-pos="down"]{
        --bst-message-menu-listbox-flex-direction: column-reverse;
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



      .bst-viewer-engagement-message .bst-message-entry-line{
        display: flex;
        flex-direction: row;
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
        display: block;
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


      .bst-paid-message, .bst-paid-sticker{
        --bst-paid-amount-font-size: 115%;
      }

      .bst-paid-amount{
        display: inline;
        white-space: nowrap;
        margin-left: 12px;
        font-size: var(--bst-paid-amount-font-size, inherit);
      }

      .bst-paid-message .bst-message-entry-highlight[class]{
        --bst-highlight-color: var(--yt-live-chat-paid-message-background-color,#1565c0);
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



      .bst-message-entry-holding{
        --bst-message-menu-display: block;
      }

      .bst-message-menu-container{

        pointer-events: none !important;

        display: var(--bst-message-menu-display, none);

        position: absolute;
        left: 0;
        right: 0;
        padding: 8px;

        bottom: var(--bst-message-menu-container-bottom, initial);

      }

      .bst-message-menu-item{
      
        padding: 4px 8px;
        background-color: var(--color-opac-w-4);
        margin:2px;
        cursor: pointer;

      }

      .bst-message-menu-item:hover{
       
        background-color: var(--color-opac-w-6); 

      }






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

      .bst-paid-sticker .bst-message-head {
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
        pointer-events: none;
      }

      bst-live-chat-placeholder {
        display: none;
      }

      .bst-live-chat-element[class] {
        padding:0;
        margin:0;
      }

      bst-live-chat-unknownitem {
        display: block;
        height: 3.4rem;
        background-color: rgb(127, 127, 127);
        cursor: not-allowed;
        opacity: 0.6;
      }
      bst-live-chat-unknownitem:hover{
        opacity: 1;
      }

      .bst-profile-card {
        position: absolute;
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        height: 100px;     /* border: 3px solid white; */
        box-sizing: border-box;
        z-index: 3;
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

      .bst-message-container {
        opacity: var(--bst-message-entry-opacity-v, 1.0);
        transition: opacity 80ms ease-in-out 8ms;
      }

      .bst-message-container-f {
        --bst-message-entry-opacity-v: 1.0; /* just opacity effect for the last message */
        transition: initial;
      }


      .bst-message-menu-list{
        display: flex;
        justify-content: end;
        pointer-events: none !important;
      }

      .bst-message-menu-list ytd-menu-popup-renderer{
        max-width: initial !important;
        min-width: initial !important;
        max-height: initial !important;
        min-height: initial !important;
        pointer-events: initial !important;
      }

    `
  }

  /** @type {import('./library/html').SolidJS}.SolidJS */
  const { createSignal, onMount, createStore, html, render, Switch, Match, For, createEffect, createMemo, Show, onCleanup, createComputed, createRenderEffect, unwrap } = SolidJS;

  const { R, W ,rwWrap } = (() => {

    /*
    const sWrapper = (w) => {
      const [singalGet, singalSet] = createSignal(1);
      return function (e = 0) {
        e ? Promise.resolve(x => (x & 1073741823) + e).then(singalSet) : singalGet();
        return w;
      };
    };
    */

    
    const sWrapper = (w) => {
      let u = 2;
      const [singalGet, singalSet] = createSignal(1);
      const p = (m) => singalSet(u); // first Promise
      // const p = (m) => m === u && singalSet(u); // last Promise
      // const p = (m) => singalSet(u + (m === u)); // first and last Promise
      return function (e = 0) {
        e
          ? Promise.resolve((u = (u & 1073741823) + e)).then(p)
          : singalGet();
        (this !== w && this)?.valueOf?.(e);
        return w;
      };
    };

    const op = Object.prototype;
    const R = (x) => {
      let valueOf = x.valueOf;
      if (valueOf === op.valueOf) valueOf = x.valueOf = sWrapper(x);
      return valueOf();
    };
    const W = (x) => {
      let valueOf = x.valueOf;
      if (valueOf === op.valueOf) valueOf = x.valueOf = sWrapper(x);
      return valueOf(3);
    }
    const rwWrap = (x) => {
      if(typeof x === 'function') return x;
      let valueOf = x.valueOf;
      if (valueOf === op.valueOf) valueOf = x.valueOf = sWrapper(x);
      return x.valueOf;
    }

    return { R, W, rwWrap };

  })();

  window.MMR = R;
  window.MMW = W;

  const memoStore = new WeakMap();


  let rcPromise = null;
  const [rcSignal ,rcSignalSet]=createSignal(1);
  let rcValue = 1;

  const rcSignalAdd = (p) => {
    if (p) {
      rcValue = (rcValue & 1073741823) + 1;
    }
    rcSignalSet(r => (r & 1073741823) + 1);
  };


  createEffect(() => {
    const m = rcSignal();
    if (rcValue === m) {
      rcPromise && rcPromise.resolve();
      rcPromise= null;
    }
  });


  const MEMO = (obj, key, val) => {

    if (key === null) {
      memoStore.delete(obj);
      return;
    } else if (!key) {
      return memoStore.get(obj);
    }

    const m = `${key}`;
    if (val === null) {
      let s = memoStore.get(obj);
      if (s && s[m]) s[m] = null;
    } else if (val) {
      let s = memoStore.get(obj);
      if (!s) memoStore.set(obj, s = {});
      if (!s[m]) {
        s[m] = createMemo(val);
      } else {
        console.warn('MEMO setter: duplicated');
      }
      return s[m];
    } else {
      let s = memoStore.get(obj);
      let r = s ? s[m] : null;
      if (!r) {
        console.warn('MEMO getter: duplicated');
      }
      return r;
    }
  }

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

    /*


      aObj.uid = aObj.uid || createMemo(() => { 
      })

      if (aKey && typeof aKey === 'string') W(aObj).aKey = aKey;

      MEMO(aObj, 'rendererFlag', ()=>{ 
      });

      MEMO(aObj, 'authorName', () => { 
      });
 
      aObj.getProfilePic = getProfilePic;
      aObj.getStickerURL = getStickerURL;
      aObj.bst = bst;

 
      MEMO(aObj, 'messageXT', () =>{
 
      });


      */

    if (o.uid) {
      o.uid = null;
    }

    MEMO(o, 'rendererFlag', null);

    MEMO(o, 'authorName', null); 

    MEMO(o, 'messageXT', null);

    MEMO(o, null);

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
    authorBadges(badge, data) {  // performance concern? (11.0ms)


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

        if (ek.icon && typeof ek.icon === 'object') {

          const icon = ek.icon;
          const type = icon.iconType.toLowerCase();
          if (type === 'owner' && R(data).bst('shouldHighlight')) {

          } else {

            let tooltipText = () => ek.tooltip || ek.accessibility?.accessibilityData?.label || '';

            let [tooltipDisplay, tooltipDisplaySet] = createSignal('');
            let elmWR = null;
            let onYtIconCreated = (el) => {
              const cnt = insp(el);
              cnt.icon = "live-chat-badges:" + type;
              _setAttribute.call(el, 'icon-type', type);
              tooltipText = tooltipText();
              _setAttribute.call(el, 'shared-tooltip-text', tooltipText);
              tooltipDisplaySet(tooltipText);
              if (el.getAttribute23752) {
                el.getAttribute = el.getAttribute23752;
              }
              elmWR = mWeakRef(el);
              onYtIconCreated = null;
            }
            onCleanup(() => {
              elmWR = null;
              tooltipDisplay = tooltipDisplaySet = null;
            });
            return html`<yt-icon class="bst-message-badge-yt-icon" ref="${onYtIconCreated}"></yt-icon><bst-tooltip>${() => (kRef(tooltipTarget()) || 1) === (kRef(elmWR) || 2) ? tooltipDisplay() : ''}</bst-tooltip>`;

          }

        } else if (typeof (ek.customThumbnail || 0) === 'object') {

          // const className = `style-scope yt-live-chat-author-badge-renderer bst-author-badge`
          const className = `bst-author-badge`;
          const src = () => getThumbnail(ek.customThumbnail.thumbnails, 32, 64); // 16, 32
          const alt = () => ek.accessibility?.accessibilityData?.label || '';




          let tooltipText = () => ek.tooltip || ek.accessibility?.accessibilityData?.label || '';

          let [tooltipDisplay, tooltipDisplaySet] = createSignal('');
          let elmWR = null;
          let onImgCreated = (el) => {
            tooltipText = tooltipText();
            tooltipDisplaySet(tooltipText);
            if (el.getAttribute23752) {
              el.getAttribute = el.getAttribute23752;
            }
            elmWR = mWeakRef(el);
            onImgCreated = null;
          }
          onCleanup(() => {
            tooltipDisplay = tooltipDisplaySet = null;
          });
          return html`<img ref="${onImgCreated}" class="${className}" src="${src}" alt="${alt}" shared-tooltip-text="${tooltipText}" /><bst-tooltip>${() => (kRef(tooltipTarget()) || 1) === (kRef(elmWR) || 2) ? tooltipDisplay() : ''}</bst-tooltip>`





        }


      } catch (e) {
        console.warn(e);
      }

    }
    // messageBody(message, data) {

    //   if (typeof message === 'string') return html`<span>${() => message}</span>`
    //   if (typeof message.text === 'string') {
    //     if (message.navigationEndpoint?.urlEndpoint?.url) {
    //       const urlEndpoint = message.navigationEndpoint.urlEndpoint;
    //       return html`<a href="${() => R(urlEndpoint).url}" rel="${() => R(urlEndpoint).nofollow === true ? 'nofollow' : null}" target="${() => R(urlEndpoint).target === "TARGET_NEW_WINDOW" ? '_blank' : null}">${() => R(message).text}</span>`
    //     }
    //     return html`<span>${() => R(message).text}</span>`
    //   }




    //   if (typeof message.emoji !== 'undefined' && typeof (message.emoji||0) === 'object') {


    //     try {

    //         const emoji = message.emoji;


    //         const className = `small-emoji emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer`


    //         const src = () => `${emoji.image.thumbnails[0].url}` // performance concern? (3.3ms)
    //         const alt = () => emoji.image?.accessibility?.accessibilityData?.label || ''; // performance concern? (1.7ms)
    //         let tooltipText = () => emoji.shortcuts?.[0] || ''; // performance concern? (1.7ms)
    //         const emojiId = () => emoji.emojiId || '';
    //         const isCustomEmoji = () => emoji.isCustomEmoji || false;






    //         let [tooltipDisplay, tooltipDisplaySet] = createSignal('');
    //         let elmWR = null;
    //         let onImgCreated = (el) => {
    //           tooltipText = tooltipText();
    //           tooltipDisplaySet(tooltipText);
    //           if (el.getAttribute23752) {
    //             el.getAttribute = el.getAttribute23752;
    //           }
    //           elmWR = mWeakRef(el);
    //         }
    //         onCleanup(()=>{
    //           tooltipDisplay = tooltipDisplaySet = onImgCreated = null;
    //         });
    //         return html`<img ref="${onImgCreated}" class="${className}" src="${src}" alt="${alt}" shared-tooltip-text="${tooltipText}" data-emoji-id="${emojiId}" is-custom-emoji="${isCustomEmoji}" /><bst-tooltip>${() => (kRef(tooltipTarget()) || 1) === (kRef(elmWR) || 2) ? tooltipDisplay() : ''}</bst-tooltip>`



    //     } catch (e) {
    //       console.warn(e);
    //     }

    //   }


    // }
  };

  let sharedButtonViewModel = null;
  let sharedNoscript = null;

  function simulateClickOnBody() {
    // Create and dispatch pointerdown
    const pointerDownEvent = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      // You can add more PointerEvent-specific properties as needed
    });
    document.body.dispatchEvent(pointerDownEvent);
  
    // Create and dispatch mousedown
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      // You can add coordinates, modifiers, etc. as needed
    });
    document.body.dispatchEvent(mouseDownEvent);
  
    // Create and dispatch pointerup
    const pointerUpEvent = new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    document.body.dispatchEvent(pointerUpEvent);
  
    // Create and dispatch mouseup
    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    document.body.dispatchEvent(mouseUpEvent);
  
    // Finally, create and dispatch click
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    document.body.dispatchEvent(clickEvent);
  }
  

  const SolidBeforeContentButton0 = (props) => {

    const onButtonContainerCreated = (div) => {
      let data = props.entryData;

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

      data = null;
      props = null;
      div = null;

    };
    return html`
      <div ref=${onButtonContainerCreated} class="bst-message-before-content-button-container">
      </div>
    `
  };

  let createIdx = 0;
  let ux302 = null;
  let popupKey302 = '';
  const onSolidMenuListCreated_ = async (items, div, ytLiveChatAppCnt) => {

    const createIdx_ = createIdx = (createIdx & 1073741823) + 1;

    let ux0 = null;

    const popups_ = ytLiveChatAppCnt.popups_;


    const popupKey = popupKey302;
    const ux = ux302;

    if (ux && popupKey) {
      ux0 = popups_[popupKey];
      popups_[popupKey] = ux;
    }

    const ud = {
      "items": [
        ...items
      ],
      "openImmediately": true,
      "__iwme848__": true,
    };


    const openPopupActionObj = {
      "popupType": "DROPDOWN",
      "popup": {
        "menuPopupRenderer": ud
      }
    };


    let pr = new PromiseExternal();
    let mo = new MutationObserver(() => {

      if (createIdx_ !== createIdx) {
        mo && mo.disconnect();
        mo = null
        return;
      }


      const elements = [...document.querySelectorAll('ytd-menu-popup-renderer[class]')].filter(e => {
        return !!insp(e)?.data?.__iwme848__;
      })

      if (elements[0]) {
        pr && pr.resolve(elements[0]);
        pr = null;
      }

    });

    mo && mo.observe(document, { subtree: true, childList: true });

    if (ux && popupKey) {

      const contentWrapper = ux?.popup?.$?.contentWrapper;
      const popupContent = ux.popupContent;

      if (contentWrapper instanceof Node && popupContent instanceof Node && typeof ytLiveChatAppCnt.completeOpenPopupAction_ === 'function' && ytLiveChatAppCnt.completeOpenPopupAction_.length === 3) {
        contentWrapper?.appendChild(popupContent);

        ytLiveChatAppCnt.completeOpenPopupAction_(openPopupActionObj, div, ux);

      } else {

        if (ux.rendererName && ux.openPopupAction.uniqueId && typeof ytLiveChatAppCnt.handleClosePopupAction_ === 'function' && ytLiveChatAppCnt.handleClosePopupAction_.length === 2) {
          ytLiveChatAppCnt.handleClosePopupAction_(ux.rendererName, ux.openPopupAction.uniqueId);
        }

        delete ytLiveChatAppCnt.popups_[popupKey];

        ytLiveChatAppCnt.handleOpenPopupAction({
          "openPopupAction": openPopupActionObj,
        }, div);
      }


    } else {

      ytLiveChatAppCnt.handleOpenPopupAction({
        "openPopupAction": openPopupActionObj,
      }, div);

    }

    const elm = pr ? await pr.then() : null;
    pr = null;
    mo && mo.disconnect();

    if (elm && createIdx_ === createIdx) {
      div.appendChild(elm);
    }

    (() => {
      popupKey302 = '';
      const popups_ = ytLiveChatAppCnt.popups_;
      if (popups_) {
        for (const k of Object.keys(popups_)) {
          const v = popups_[k];
          if (v && v.popupContent && insp(v.popupContent).data?.__iwme848__) {
            popupKey302 = k;
            ux302 = v;
            break;
          }
        }
      }
      if (popupKey302) {
        if (ux0) {
          popups_[popupKey302] = ux0;
        } else {
          delete popups_[popupKey302];
        }
      }
    })();

    setTimeout(simulateClickOnBody, 1);
    setTimeout(simulateClickOnBody, 80); // play-safe




  };
  const SolidMenuList = (props) => {


    const onSolidMenuListCreated = (div) => {

      let items = props.items;
      /*

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

      */

    /*

      let ytdMenu = document.querySelector('#bst-menu-popup-renderer');
      if(!ytdMenu){

        ytdMenu =  document.createElement('ytd-menu-popup-renderer');
        ytdMenu.id='bst-menu-popup-renderer';
        sharedNoscript.appendChild(ytdMenu);
      }

      insp(ytdMenu).data=Object.assign({}, {items: items, openImmediately: true})

      */

      const ytLiveChatAppElm = document.querySelector('yt-live-chat-app');
      const ytLiveChatAppCnt = insp(ytLiveChatAppElm);


      if (!ytLiveChatAppCnt) return;
      if (!ytLiveChatAppCnt.handleOpenPopupAction || ytLiveChatAppCnt.handleOpenPopupAction.length !== 2) return;

      // ytLiveChatAppCnt.handleCloseAllPopupsAction_();
      onSolidMenuListCreated_(items, div, ytLiveChatAppCnt);

      // div.appendChild(ytdMenu);
      data = null;
      props = null;
      div = null;

    };
    return html`
      <div ref=${onSolidMenuListCreated} class="bst-message-menu-list">
      </div>
    `
  };

  const replaceAll = String.prototype.replaceAll ? function (str, pattern, replacement) {
    return str.replaceAll(pattern, replacement);
  } : function (str, search, replace) {
    if (typeof search === 'string') {
      return str.split(search).join(replace);
    } else if (search instanceof RegExp) {
      const newRegExp = new RegExp(search.source, search.flags + 'g');
      return str.replace(newRegExp, replace);
    }
    throw new TypeError('The search argument must be a string or a RegExp');
  };
  const emojiIdSymbol = Symbol();
  const messageFlattenIcons = new Map();

  const messageUnflatten = (str) => {

    const b1 = String.fromCharCode(0xE274);
    let p = str.includes(`${b1}@`);
    return str.split(`${b1};`).map(s => {

      const r = s.split(`${b1},`);
      if (p && s.includes(`${b1}@`)) {
        for (let i = 0; i < r.length; i++) {
          r[i] = r[i].replace(`${b1}@`, `${b1}`);
        }

      }
      return r;

    });

  }
  let fixMessages = null;
  const messageFlatten = (message) => {

    // E${b1},${emojiId}${b1};T${b1},${text}${b1};E${b1},${emojiId}

    let runs = null;

    // ------ convertMessage ------
    let t;
    if (typeof (message || 0) !== 'object') runs = [];
    else if ((t = message.simpleText) && typeof t === 'string') {
      runs = [{ text: t }];
    } else if ((t = message.runs) && t.length >= 0) {
      runs = t;
    } else {
      runs = [];
    }
    // ------ convertMessage ------

    // ------ fixMessages ------

    fixMessages && (runs = fixMessages(runs));

    // ------ fixMessages ------

    const resultArr = new Array(runs.length);
    let i = 0;
    const b1 = String.fromCharCode(0xE274);

    for (const run of runs) {
      const wKey = typeof run.text === 'string' ? 'text' : firstObjectKey(run);
      const wVal = wKey ? run[wKey] : null;
      if (wKey === 'emoji' && typeof wVal === 'object') {
        let emojiId = wVal[emojiIdSymbol] || wVal.emojiId;
        if (typeof (emojiId || 0) !== 'string') {
          emojiId = wVal[emojiIdSymbol] = `$$${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
        }
        let iconStored = messageFlattenIcons.get(emojiId);
        if (!iconStored) {
          messageFlattenIcons.set(emojiId, iconStored = wVal);
        }
        if (emojiId.includes(b1)) {
          // invalid. just skip
          console.warn('Error 0481', run);
        } else {
          t = `E${b1},${emojiId}`;
          resultArr[i++] = t
        }
      } else if (wKey === 'text' && typeof wVal === 'string') {
        t = wVal;
        if (t.includes(b1)) {
          t = replaceAll(t, b1, `${b1}@`);
        }
        const urlEndpoint = run.navigationEndpoint?.urlEndpoint;
        const url = urlEndpoint?.url;
        if (url) {
          const { nofollow, target } = urlEndpoint;
          t = `T${b1},${t}${b1},A${b1},${url}${b1},${nofollow || ''}${b1},${target || ''}`;
        } else {
          t = `T${b1},${t}`;
        }
        resultArr[i++] = t;
      } else {
        console.warn('Error 0482', run);
      }
    }


    resultArr.length = i;
    return resultArr.join(`${b1};`);




/*
[
    {
        "text": "大好き"
    },
    {
        "emoji": {
            "emojiId": "UCz1RAeb7dVaUcd-4rEgyxPw/M72iZYbCHr2k_9EP9fGUmAo",
            "shortcuts": [
                ":_にぱぁ:",
                ":にぱぁ:"
            ],
            "searchTerms": [
                "_にぱぁ",
                "にぱぁ"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://yt3.ggpht.com/4Q8_RUaekNbE6XTkylSGx2IEbXp7OalBZB7IDLu_zGT0tyDjY8Mi8zTfS4f6CE1mN0Us0_nm=w48-h48-c-k-nd",
                        "width": 48,
                        "height": 48
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "にぱぁ"
                    }
                }
            },
            "isCustomEmoji": true
        }
    }
]

*/

/*

[
    {
        "emoji": {
            "emojiId": "🌭",
            "shortcuts": [
                ":hot_dog:"
            ],
            "searchTerms": [
                "hot",
                "dog"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://fonts.gstatic.com/s/e/notoemoji/15.1/1f32d/72.png"
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "🌭"
                    }
                }
            }
        }
    },
    {
        "emoji": {
            "emojiId": "🧜‍♀",
            "shortcuts": [
                ":mermaid:"
            ],
            "searchTerms": [
                "mermaid"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://fonts.gstatic.com/s/e/notoemoji/15.1/1f9dc_200d_2640/72.png"
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "🧜‍♀"
                    }
                }
            }
        }
    },
    {
        "emoji": {
            "emojiId": "🥖",
            "shortcuts": [
                ":baguette_bread:"
            ],
            "searchTerms": [
                "baguette",
                "bread"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://fonts.gstatic.com/s/e/notoemoji/15.1/1f956/72.png"
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "🥖"
                    }
                }
            }
        }
    },
    {
        "emoji": {
            "emojiId": "💗",
            "shortcuts": [
                ":growing_heart:",
                ":heartpulse:"
            ],
            "searchTerms": [
                "growing",
                "heart",
                "heartpulse"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://fonts.gstatic.com/s/e/notoemoji/15.1/1f497/72.png"
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "💗"
                    }
                }
            }
        }
    }
]




[
    {
        "emoji": {
            "emojiId": "UCz1RAeb7dVaUcd-4rEgyxPw/lf4nZJyyLYnWgwODzpuQBA",
            "shortcuts": [
                ":_ペンライト:",
                ":ペンライト:"
            ],
            "searchTerms": [
                "_ペンライト",
                "ペンライト"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://yt3.ggpht.com/qFvk19WffG348lFrdIk2ACLc8tn5_OIqyNINCfHCjz83vl1z8ITziwKIxOD06skW_aHQHAwWk0M=w48-h48-c-k-nd",
                        "width": 48,
                        "height": 48
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "ペンライト"
                    }
                }
            },
            "isCustomEmoji": true
        }
    },
    {
        "emoji": {
            "emojiId": "UCz1RAeb7dVaUcd-4rEgyxPw/M72iZbzDHr2k_9EP9fGUmAo",
            "shortcuts": [
                ":_クラッチ:",
                ":クラッチ:"
            ],
            "searchTerms": [
                "_クラッチ",
                "クラッチ"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://yt3.ggpht.com/Oi2sH_kWkyq4_dJbdsYKyTA68sZsCtYqq58_cfwmf2NHgq5_-lEyiOQW6myBhFnIBCiSWqSMYvY=w48-h48-c-k-nd",
                        "width": 48,
                        "height": 48
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "クラッチ"
                    }
                }
            },
            "isCustomEmoji": true
        }
    },
    {
        "emoji": {
            "emojiId": "UCz1RAeb7dVaUcd-4rEgyxPw/M72iZenDHr2k_9EP9fGUmAo",
            "shortcuts": [
                ":_ゲーミングペンライト:",
                ":ゲーミングペンライト:"
            ],
            "searchTerms": [
                "_ゲーミングペンライト",
                "ゲーミングペンライト"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://yt3.ggpht.com/mFhN5NK8Qm-Lu_QN3iTukx--9_hfHs_C3GTpoQzUdyc3JwwCXGtJ0ffuPWvL4rY67nCfRgZ5T-U=w48-h48-c-k-nd",
                        "width": 48,
                        "height": 48
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "ゲーミングペンライト"
                    }
                }
            },
            "isCustomEmoji": true
        }
    },
    {
        "emoji": {
            "emojiId": "UCz1RAeb7dVaUcd-4rEgyxPw/lf4nZJyyLYnWgwODzpuQBA",
            "shortcuts": [
                ":_ペンライト:",
                ":ペンライト:"
            ],
            "searchTerms": [
                "_ペンライト",
                "ペンライト"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://yt3.ggpht.com/qFvk19WffG348lFrdIk2ACLc8tn5_OIqyNINCfHCjz83vl1z8ITziwKIxOD06skW_aHQHAwWk0M=w48-h48-c-k-nd",
                        "width": 48,
                        "height": 48
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "ペンライト"
                    }
                }
            },
            "isCustomEmoji": true
        }
    },
    {
        "emoji": {
            "emojiId": "UCz1RAeb7dVaUcd-4rEgyxPw/M72iZbzDHr2k_9EP9fGUmAo",
            "shortcuts": [
                ":_クラッチ:",
                ":クラッチ:"
            ],
            "searchTerms": [
                "_クラッチ",
                "クラッチ"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://yt3.ggpht.com/Oi2sH_kWkyq4_dJbdsYKyTA68sZsCtYqq58_cfwmf2NHgq5_-lEyiOQW6myBhFnIBCiSWqSMYvY=w48-h48-c-k-nd",
                        "width": 48,
                        "height": 48
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "クラッチ"
                    }
                }
            },
            "isCustomEmoji": true
        }
    },
    {
        "emoji": {
            "emojiId": "UCz1RAeb7dVaUcd-4rEgyxPw/M72iZenDHr2k_9EP9fGUmAo",
            "shortcuts": [
                ":_ゲーミングペンライト:",
                ":ゲーミングペンライト:"
            ],
            "searchTerms": [
                "_ゲーミングペンライト",
                "ゲーミングペンライト"
            ],
            "image": {
                "thumbnails": [
                    {
                        "url": "https://yt3.ggpht.com/mFhN5NK8Qm-Lu_QN3iTukx--9_hfHs_C3GTpoQzUdyc3JwwCXGtJ0ffuPWvL4rY67nCfRgZ5T-U=w48-h48-c-k-nd",
                        "width": 48,
                        "height": 48
                    }
                ],
                "accessibility": {
                    "accessibilityData": {
                        "label": "ゲーミングペンライト"
                    }
                }
            },
            "isCustomEmoji": true
        }
    }
]


*/


  }

  let timelineResolve;

  const ojWrap = (obj => {
    return typeof obj === 'function' ? obj : () => obj;
  });
  const ojUnwrap = (obj => {
    return typeof obj === 'function' ? obj() : obj;
  });

  const SolidMessageElementTags = window.SolidMessageElementTags = new Set();

  let SolidMessageElementTagsSizeCached = 0;

  const SolidMessageListEntry = (props) =>{

    // rcSignalAdd(1);
    rcValue++;
    onMount(async () => {
      timelineResolve && (await timelineResolve());
      rcSignalAdd(0);
    });
    onCleanup(() => {
      props = null;
    });

    const aKey = props.data().aKey;
    switch (aKey) { // performance concern? (1.5ms)
      case 'liveChatViewerEngagementMessageRenderer':
        return SolidSystemMessage(props);
      case 'liveChatPaidMessageRenderer':
        return SolidPaidMessage(props);
      case 'liveChatMembershipItemRenderer':
        return SolidMembershipMessage(props);
      case 'liveChatSponsorshipsGiftRedemptionAnnouncementRenderer':
        return SolidGiftText(props);
      case 'liveChatSponsorshipsGiftPurchaseAnnouncementRenderer':
        return SolidSponsorshipPurchase(props);
      case 'liveChatPaidStickerRenderer':
        /** https://www.youtube.com/watch?v=97_KLlaUICQ&t=3600s */
        /* https://www.youtube.com/live/BDjEOkw_iOA?t=6636s */
        return SolidPaidSticker(props);
      case 'liveChatPlaceholderItemRenderer':
        return SolidMessagePlaceHolder(props);

      case 'liveChatTextMessageRenderer': 
      return SolidMessageText(props); // liveChatTextMessageRenderer

      case 'liveChatOfferClickCountMessageRenderer':
      // return SolidOfferClick(props); // just append the native element. might have memory leakage

      default:

        SolidMessageElementTags.add(aKey);
        const size = SolidMessageElementTags.size;
        if (size !== SolidMessageElementTagsSizeCached) {
          SolidMessageElementTagsSizeCached = size;
          if (size > 0 && aKey !== 'liveChatOfferClickCountMessageRenderer') {
            console.warn(`SolidMessageElementTags: ${[...SolidMessageElementTags].join(', ')}`);
          }
        }
        return SolidDefaultElement(props); // just append the native element. might have memory leakage

    }

  }

  const SolidMessageList = (sb) => {

    onCleanup(() => {
      // console.log('SolidMessageList cleanup 0001')
      sb = null;
    });

    return html`
      <${Show} when=(${() => typeof R(profileCard).username === 'string'})>
        <div classList=(${{ "bst-profile-card": true, "bst-profile-card-on-top": R(profileCard).showOnTop }}) style=(${() => ({ "--fTop": R(profileCard).fTop + "px", "--fBottom": R(profileCard).fBottom + "px" })})>
          <div class="bst-profile-card-overlay"></div>
          <div class="bst-profile-card-icon">
          <img class="bst-profile-card-icon-img" src="${() => R(profileCard).iconUrl}">
          </div>
          <div class="bst-profile-card-main">
          <a target="_blank" href="${() => R(profileCard).profileUrl}">${() => R(profileCard).username}</a>
          </div>
          <div class="bst-profile-card-cross" onClick="${profileCard_onCrossClick}">
          X
          </div>
        </div>
      <//>
      <${For} each=(${() => R(sb)})>${(qItem) => {

        const wKey = qItem ? firstObjectKey(qItem) : '';
        const wItem = wKey ? qItem[wKey] : null;
        let item = wItem ? R(wItem) : null;

        let eItem = item ? mutableWM.get(item) : null;
        if (eItem) {

          let itemWrapped = rwWrap(item);
          item = null;
          // let uww = false;
          onCleanup(() => {

            // if(uww) console.log('SolidMessageListItem cleanup 1001', item.uid !== null)
            removeEntry(itemWrapped())
            itemWrapped = null;
          });

          eItem.convert();
          eItem = null;

          return html`<${SolidMessageListEntry} data=(${() => itemWrapped}) />`;

        }

      }}<//>
  `
  };



  const SolidMessageRenderer = (props) => {

    const data = props.entryData;
    const messageXT = R(data).bst('messageXM');

    onCleanup(() => {
      props = null;
    });

    return html`<${For} each=(${() => messageXT()})>${(arr => {

      // console.log(1338, arr)
      const [p1, v1, p2, v2, ...args] = arr;

      // console.log(21392, p1,v1,p2,v2, ...args)
      if (p1 === 'T') {

        if (p2 === 'A' && v2) {

          const text = v1;
          const url = v2;
          const [nofollow, target] = args;

          return html`<a href="${() => url}" rel="${() => nofollow === 'true' ? 'nofollow' : null}" target="${() => target === "TARGET_NEW_WINDOW" ? '_blank' : null}">${() => text}</span>`

        }

        return html`<span>${() => v1}</span>`;

      } else if (p1 === 'E') {
        const emojiId = v1;

        const emoji = messageFlattenIcons.get(emojiId);
        if (emoji) {

          const className = `small-emoji emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer`

          const src = () => `${emoji.image.thumbnails[0].url}` // performance concern? (3.3ms)
          const alt = () => emoji.image?.accessibility?.accessibilityData?.label || ''; // performance concern? (1.7ms)
          let tooltipText = () => emoji.shortcuts?.[0] || ''; // performance concern? (1.7ms)
          const emojiId = () => emoji.emojiId || '';
          const isCustomEmoji = () => emoji.isCustomEmoji || false;

          let [tooltipDisplay, tooltipDisplaySet] = createSignal('');
          let elmWR = null;
          let onImgCreated = (el) => {
            tooltipText = tooltipText();
            tooltipDisplaySet(tooltipText);
            if (el.getAttribute23752) {
              el.getAttribute = el.getAttribute23752;
            }
            elmWR = mWeakRef(el);
          }
          onCleanup(() => {
            tooltipDisplay = tooltipDisplaySet = onImgCreated = null;
          });
          return html`<img ref="${onImgCreated}" class="${className}" src="${src}" alt="${alt}" shared-tooltip-text="${tooltipText}" data-emoji-id="${emojiId}" is-custom-emoji="${isCustomEmoji}" /><bst-tooltip>${() => (kRef(tooltipTarget()) || 1) === (kRef(elmWR) || 2) ? tooltipDisplay() : ''}</bst-tooltip>`;

        }
      }

      return '';

    })}
    <//>`

  };

  const SolidSystemMessage = (props) => {
    let data = props.data();

    const { rendererFlag, authorName, messageXT } = MEMO(data);

    const dataMutable = mutableWM.get(data);
    if (!dataMutable) return '';

    let icon = data.icon;
    let onYtIconCreated = null;
    if (icon) {
      const type = icon.iconType.toLowerCase();
      onYtIconCreated = (el) => {
        const cnt = insp(el);
        cnt.icon = type;
        _setAttribute.call(el, 'icon-type', type);
        onYtIconCreated = null;
      }
    }

    onCleanup(() => {
      removeEntry(data)
      props = data = null; 
      icon = null;
    });

    return html`
  <div class="bst-message-entry bst-viewer-engagement-message" message-uid="${() => R(data).uid()}" message-id="${() => R(data).id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => R(data).bst('authorType')}">
  <div classList="${()=>({'bst-message-container': true, 'bst-message-container-f': mf() !== R(data).uid()})}">
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <${Show} when=(${() => typeof onYtIconCreated === 'function'})>
    <div class="bst-system-message-icon-column"><yt-icon class="bst-system-message-yt-icon" ref="${onYtIconCreated}"></yt-icon></div>
    <//>
    <${Show} when=(${() => R(data).beforeContentButtons?.length === 1})>
    <${SolidBeforeContentButton0} entryData=(${()=>data}) />
    <//>
    <div class="bst-message-body">
    <${SolidMessageRenderer} entryData=(${()=>data}) />
    </div>
  </div>
  <div class="bst-message-menu-container">
    <${Show} when=(${() => R(menuRenderObj).messageUid === R(data).uid() && !R(menuRenderObj).loading })>
    <${SolidMenuList} items=(${() => R(menuRenderObj).menuListXd()}) />
    <//>
  </div>
  </div>
  </div>`

  };


  const SolidPaidMessage = (props) => {

    let data = props.data();

    const { rendererFlag, authorName, messageXT } = MEMO(data);

    // const {authorNameTextColor, bodyBackgroundColor, bodyTextColor, headerBackgroundColor, headerTextColor, textInputBackgroundColor,timestampColor} = data;

    onCleanup(() => {
      removeEntry(data)
      props = data = null; 
    });

    return html`
  <div classList="${()=>({'bst-message-entry': true, [`bst-paid-message`]: true, 'bst-message-entry-holding': entryHolding() === R(data).uid()})}" message-uid="${() => R(data).uid()}" message-id="${() => R(data).id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => R(data).bst('authorType')}">
  <div classList="${()=>({'bst-message-container': true, 'bst-message-container-f': mf() !== R(data).uid()})}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => R(data).getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
    <div class="bst-message-time">${() => R(data).bst('timestampText')}</div>
    <div class="bst-name-field bst-message-name-color">
      <div class="bst-message-username">${() => R(data).bst('getUsername')}</div>
      <div class="bst-message-badges">
      <${For} each=(${() => R(data).bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
      </div>
    </div>
    <div class="bst-paid-amount">${() => convertYTtext(R(data).purchaseAmountText)}</div>
    </div>
    <${Show} when=(${() => R(data).beforeContentButtons?.length === 1})>
    <${SolidBeforeContentButton0} entryData=(${()=>data}) />
    <//>
    <div class="bst-message-body bst-message-body-next-to-head">
    <${SolidMessageRenderer} entryData=(${()=>data}) />
    </div>
  </div>
  <div class="bst-message-menu-container">
    <${Show} when=(${() => R(menuRenderObj).messageUid === R(data).uid() && !R(menuRenderObj).loading })>
    <${SolidMenuList} items=(${() => R(menuRenderObj).menuListXd()}) />
    <//>
  </div>
  </div>
  </div>
`;
  };

  const SolidMembershipMessage = (props) => {
    let data = props.data();

    const { rendererFlag, authorName, messageXT } = MEMO(data);

    onCleanup(() => {
      removeEntry(data)
      props = data = null; 
    });

    return html`
  <div classList="${()=>({'bst-message-entry': true, [`bst-message-entry-ll`]: true, [`bst-membership-message`]: true, 'bst-message-entry-holding': entryHolding() === R(data).uid()})}" message-uid="${() => R(data).uid()}" message-id="${() => R(data).id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => R(data).bst('authorType')}">
  <div classList="${()=>({'bst-message-container': true, 'bst-message-container-f': mf() !== R(data).uid()})}">
  <div classList=${{ "bst-message-entry-header": true, "bst-message-entry-followed-by-body": R(data).bst('hasMessageBody') }}>
    <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => R(data).getProfilePic(64, -1)}" /></a></span>
    <div class="bst-message-entry-highlight"></div>
    <div class="bst-message-entry-line">
      <div class="bst-message-head">
        <div class="bst-message-time">${() => R(data).bst('timestampText')}</div>
        <div class="bst-name-field bst-message-name-color">
          <div class="bst-message-username">${() => R(data).bst('getUsername')}</div>
          <div class="bst-message-badges">
          <${For} each=(${() => R(data).bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
          </div>
        </div>
      </div>
      <div class="bst-message-body bst-message-body-next-to-head">${() => {
        return convertYTtext(R(data).headerPrimaryText || R(data).headerSubtext);
        // new member - only data.headerSubtext
        // return convertYTtext(data.headerSubtext)
      }}</div>
    </div>
    <div class="bst-message-menu-container">
    <${Show} when=(${() => R(menuRenderObj).messageUid === R(data).uid() && !R(menuRenderObj).loading })>
    <${SolidMenuList} items=(${() => R(menuRenderObj).menuListXd()}) />
    <//>
    </div>
  </div>
  <${Show} when=(${() => R(data).bst('hasMessageBody')})>
    <div class="bst-message-entry-body">
      <div class="bst-message-entry-highlight"></div>
      <div class="bst-message-entry-line">
        <div class="bst-message-body">
        <${SolidMessageRenderer} entryData=(${() => data}) />
        </div>
      </div>
    </div>
  <//>
  </div>
  </div>
`;
  };



  const SolidGiftText = (props) => {
    let data = props.data();

    const { rendererFlag, authorName, messageXT } = MEMO(data);

    onCleanup(() => {
      removeEntry(data)
      props = data = null; 
    });

    return html`
  <div classList="${()=>({'bst-message-entry': true, [`bst-gift-message`]: true, 'bst-message-entry-holding': entryHolding() === R(data).uid()})}" message-uid="${() => R(data).uid()}" message-id="${() => R(data).id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => R(data).bst('authorType')}">
  <div classList="${()=>({'bst-message-container': true, 'bst-message-container-f': mf() !== R(data).uid()})}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => R(data).getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
      <div class="bst-message-time">${() => R(data).bst('timestampText')}</div>
      <div class="bst-name-field bst-message-name-color">
        <div class="bst-message-username">${() => R(data).bst('getUsername')}</div>
        <div class="bst-message-badges">
        <${For} each=(${() => R(data).bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
        </div>
      </div>
    </div>
    <${Show} when=(${() => R(data).beforeContentButtons?.length === 1})>
    <${SolidBeforeContentButton0} entryData=(${() => data}) />
    <//>
    <div class="bst-message-body bst-message-body-next-to-head">
    <${SolidMessageRenderer} entryData=(${() => data}) />
    </div>
  </div>
  <div class="bst-message-menu-container">
    <${Show} when=(${() => R(menuRenderObj).messageUid === R(data).uid() && !R(menuRenderObj).loading })>
    <${SolidMenuList} items=(${() => R(menuRenderObj).menuListXd()}) />
    <//>
  </div>
  </div>
  </div>
`;
  };




  const SolidSponsorshipPurchase = (props) => {

    let data = props.data();

    const { rendererFlag, authorName, messageXT } = MEMO(data);


    onCleanup(() => {
      removeEntry(data)
      props = data = null;
    });

    // const {authorNameTextColor, bodyBackgroundColor, bodyTextColor, headerBackgroundColor, headerTextColor, textInputBackgroundColor,timestampColor} = data;


    return html`
  <div classList="${()=>({'bst-message-entry': true, [`bst-sponsorship-purchase`]: true, 'bst-message-entry-holding': entryHolding() === R(data).uid()})}" message-uid="${() => R(data).uid()}" message-id="${() => R(data).id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => R(data).bst('authorType')}">
  <div classList="${()=>({'bst-message-container': true, 'bst-message-container-f': mf() !== R(data).uid()})}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => R(data).getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
      <div class="bst-message-time">${() => R(data).bst('timestampText')}</div>
      <div class="bst-name-field bst-message-name-color">
        <div class="bst-message-username">${() => R(data).bst('getUsername')}</div>
        <div class="bst-message-badges">
        <${For} each=(${() => R(data).bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
        </div>
      </div>
    </div>
    <${Show} when=(${() => R(data).beforeContentButtons?.length === 1})>
    <${SolidBeforeContentButton0} entryData=(${() => data}) />
    <//>
    <div class="bst-message-body bst-message-body-next-to-head">
    <${SolidMessageRenderer} entryData=(${() => data}) />
    </div>
  </div>
  <div class="bst-message-menu-container">
    <${Show} when=(${() => R(menuRenderObj).messageUid === R(data).uid() && !R(menuRenderObj).loading })>
    <${SolidMenuList} items=(${() => R(menuRenderObj).menuListXd()}) />
    <//>
  </div>
  </div>
  </div>
`;
  };

  const SolidPaidSticker = (props) => {
    /* https://www.youtube.com/live/BDjEOkw_iOA?si=CGG7boBJvfT2KLFT&t=6636 */

    let data = props.data();

    onCleanup(() => {
      removeEntry(data)
      props = data = null; 
    });


    return html`
  <div classList="${()=>({'bst-message-entry': true, [`bst-paid-sticker`]: true, 'bst-message-entry-holding': entryHolding() === R(data).uid()})}" message-uid="${() => R(data).uid()}" message-id="${() => R(data).id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => R(data).bst('authorType')}">
  <div classList="${()=>({'bst-message-container': true, 'bst-message-container-f': mf() !== R(data).uid()})}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => R(data).getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight" style="${() => ({ '--bst-paid-sticker-bg': `url(${R(data).getStickerURL(80, 256)})` })}"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
      <div class="bst-message-time">${() => R(data).bst('timestampText')}</div>
      <div class="bst-name-field bst-message-name-color">
        <div class="bst-message-username">${() => R(data).bst('getUsername')}</div>
        <div class="bst-message-badges">
        <${For} each=(${() => R(data).bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
        </div>
      </div>
      <div class="bst-paid-amount">${() => convertYTtext(R(data).purchaseAmountText)}</div>
    </div>
    <${Show} when=(${() => R(data).beforeContentButtons?.length === 1})>
    <${SolidBeforeContentButton0} entryData=(${()=>data}) />
    <//>
    <div class="bst-message-body bst-message-body-next-to-head">
    <${SolidMessageRenderer} entryData=(${()=>data}) />
    </div>
  </div>
  <div class="bst-message-menu-container">
    <${Show} when=(${() => R(menuRenderObj).messageUid === R(data).uid() && !R(menuRenderObj).loading })>
    <${SolidMenuList} items=(${() => R(menuRenderObj).menuListXd()}) />
    <//>
  </div>
  </div>
  </div>
`;
  }



  const SolidMessageText = (props) => {


    let data = props.data();

    const { rendererFlag, authorName, messageXT } = MEMO(data);


    onCleanup(() => {
      removeEntry(data)
      props = data = null; 
    });

    return html`
  <div classList="${()=>({'bst-message-entry': true, [`bst-${R(data).aKey}`]: true, 'bst-message-entry-holding': entryHolding() === R(data).uid()})}" message-uid="${() => R(data).uid()}" message-id="${() => R(data).id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => R(data).bst('authorType')}">
  <div classList="${()=>({'bst-message-container': true, 'bst-message-container-f': mf() !== R(data).uid()})}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => R(data).getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
      <div class="bst-message-time">${() => R(data).bst('timestampText')}</div>
      <div class="bst-name-field bst-message-name-color">
        <div class="bst-name-field-box">
        <div>Icon</div>
        <div>Name</div>
        </div>
        <div class="bst-message-username">${() => R(data).bst('getUsername')}</div>
        <div class="bst-message-badges">
        <${For} each=(${() => R(data).bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
        </div>
      </div>
      <span class="bst-message-head-colon" aria-hidden="true"></span>
    </div>
    <${Show} when=(${() => R(data).beforeContentButtons?.length === 1})>
    <${SolidBeforeContentButton0} entryData=(${() => data}) />
    <//>
    <div class="bst-message-body bst-message-body-next-to-head">
    <${SolidMessageRenderer} entryData=(${() => data}) />
    </div>
  </div>
  <div class="bst-message-menu-container">
    <${Show} when=(${() => R(menuRenderObj).messageUid === R(data).uid() && !R(menuRenderObj).loading })>
    <${SolidMenuList} items=(${() => R(menuRenderObj).menuListXd()}) />
    <//>
  </div>
  </div>
  </div>
`;
  };

  const SolidMessagePlaceHolder = (props) => {

    let data = props.data();

    const { rendererFlag, authorName, messageXT } = MEMO(data);

    onCleanup(() => {
      removeEntry(data)
      props = data = null; 
    });

    return html`<bst-live-chat-placeholder ref="${mutableWM.get(data).setupFn}"></bst-live-chat-placeholder>`;

  };

  const SolidOfferClick = (props)=>{


    let data = props.data();
 
    const setupFn_ = (elm)=>{


      const mElm = document.createElement('yt-live-chat-offer-click-count-message-renderer')
      sharedNoscript.appendChild(mElm);
      mElm.data = data;

      mElm.classList.add('bst-live-chat-element');

      elm.appendChild(mElm);

      return mutableWM.get(data).setupFn(elm);


    }
    

      /*
      // https://www.youtube.com/watch?v=TeLstIBwC6M

      {
    "id": "ChwKGkNPaW5fUHpUZzRrREZlb0oxZ0FkOGZ3SG5n",
    "timestampUsec": "1728557900305443",
    "messageTitle": {
        "runs": [
            {
                "text": "Popular · 50 product views"
            }
        ]
    },
    "productTitle": "hololive closet 姫森ルーナ ワンピース衣装 グッズ / 【旧価格】姫森ルーナ ワンピース衣装",
    "ctaTitle": "View details",
    "onClickCommand": {
        "clickTrackingParams": "CEZQvHwLGEbQwHjMoJcY9ayKAyXC31wCHe8FQF5=",
        "commandExecutorCommand": {
            "commands": [
                {
                    "clickTrackingParams": "CEZQvHwLGEbQwHjMoJcY9ayKAyXC31wCHe8FQF5=",
                    "commandMetadata": {
                        "webCommandMetadata": {
                            "sendPost": true,
                            "apiUrl": "/youtubei/v1/feedback"
                        }
                    },
                    "feedbackEndpoint": {
                        "feedbackToken": "AB4yrpHVTUG7-rpeiRCAr9ZWG5BYET3y"
                    }
                },
                {
                    "clickTrackingParams": "CEZQvHwLGEbQwHjMoJcY9ayKAyXC31wCHe8FQF5=",
                    "commandMetadata": {
                        "webCommandMetadata": {
                            "url": "https://shop.hololivepro.com/products/hololivecloset_himemoriluna_1?variant=44046847443164&country=JP&currency=JPY&utm_campaign=sag_organic&srsltid=AfmBOLW3QuMFovsS&utm_term=UCa9YHRVrnw&utm_medium=product_shelf&utm_source=youtube",
                            "webPageType": "WEB_PAGE_TYPE_UNKNOWN",
                            "rootVe": 83769
                        }
                    },
                    "urlEndpoint": {
                        "url": "https://shop.hololivepro.com/products/hololivecloset_himemoriluna_1?variant=44046847443164&country=JP&currency=JPY&utm_campaign=sag_organic&srsltid=Afm8wkUDmFuA4&utm_content=YT3-0jm-H1Z2sZRVrnw&utm_medium=product_shelf&utm_source=youtube",
                        "target": "TARGET_NEW_WINDOW"
                    }
                }
            ]
        }
    },
    "trackingParams": "CEZQvHwLGEbQwHjMoJcY9ayKAyXC31wCHe8FQF5=",
    "__clientId__": "COin_PzWg5kDFeoJ2gAd9fwSmg",
    "uid": "undefined:1728557900305443",
    "aKey": "liveChatOfferClickCountMessageRenderer",
    "rendererFlag": 0,
    "messageFixed": []
}
    */


    return html`<bst-live-chat-elementholder ref="${setupFn_}"></bst-live-chat-elementholder>`;

  };

  const mapToElementTag = new Map(Object.entries({
    liveChatAutoModMessageRenderer: "yt-live-chat-auto-mod-message-renderer",
    liveChatPaidMessageRenderer: "yt-live-chat-paid-message-renderer",
    liveChatLegacyPaidMessageRenderer: "yt-live-chat-legacy-paid-message-renderer",
    liveChatMembershipItemRenderer: "yt-live-chat-membership-item-renderer",
    liveChatTextMessageRenderer: "yt-live-chat-text-message-renderer",
    liveChatPaidStickerRenderer: "yt-live-chat-paid-sticker-renderer",
    liveChatDonationAnnouncementRenderer: "yt-live-chat-donation-announcement-renderer",
    liveChatModeChangeMessageRenderer: "yt-live-chat-mode-change-message-renderer",
    liveChatModerationMessageRenderer: "yt-live-chat-moderation-message-renderer",
    liveChatOfferClickCountMessageRenderer: "yt-live-chat-offer-click-count-message-renderer",
    liveChatPlaceholderItemRenderer: "yt-live-chat-placeholder-item-renderer",
    liveChatPurchasedProductMessageRenderer: "ytd-live-chat-purchased-product-message-renderer",
    liveChatSponsorshipsGiftPurchaseAnnouncementRenderer: "ytd-sponsorships-live-chat-gift-purchase-announcement-renderer",
    liveChatSponsorshipsGiftRedemptionAnnouncementRenderer: "ytd-sponsorships-live-chat-gift-redemption-announcement-renderer",
    liveChatViewerEngagementMessageRenderer: "yt-live-chat-viewer-engagement-message-renderer",
    serverErrorMessage: "yt-live-chat-server-error-message"
  }));
  // mapToElementTag.set('liveChatOfferClickCountMessageRenderer' ,'yt-live-chat-offer-click-count-message-renderer');


  const SolidDefaultElement = (props) => {

    let data = props.data();
    const aKey = data.aKey;
    let elementTag = '';

    if (aKey) {
      elementTag = mapToElementTag.get(aKey);
      if (!elementTag) {
        const lcrCnt = getLcRendererCnt();
        if (lcrCnt) {
          const mapping = lcrCnt.configureRendererStamper()?.visibleItems?.mapping;
          if (mapping && typeof mapping === 'object') {
            elementTag = mapping[aKey];
            elementTag = (elementTag && elementTag.component) || elementTag;
            if (typeof (elementTag || 0) !== 'string') elementTag = '';
          }
        }
        mapToElementTag.set(aKey, (elementTag || ''));
      }
    }

    const setupFn_ = (elm) => {
      if (elementTag) {
        const mElm = document.createElement(elementTag)
        sharedNoscript.appendChild(mElm);
        mElm.data = data;
        mElm.classList.add('bst-live-chat-element');
        elm.appendChild(mElm);
      } else {
        const mElm = document.createElement('bst-live-chat-unknownitem')
        mElm.classList.add('bst-live-chat-element');
        mElm.setAttribute('title', 'unknown');
        elm.appendChild(mElm);
      }
      const r = mutableWM.get(data).setupFn(elm);
      data = null;
      elm = null;
      elementTag = '';
      props = null;
      return r;
    };

    return html`<bst-live-chat-elementholder ref="${setupFn_}"></bst-live-chat-elementholder>`;

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
 
    function fixMessagesForEmoji(a, b, c, d) {
      b = void 0 === b ? !1 : b; // false
      c = void 0 === c ? !0 : c; // true
      d = void 0 === d ? !1 : d; // false
      a = a.replace($kb, "");
      // let e = document.createDocumentFragment();
      const r = [];
      let g = 0;
      let k;
      let m = 0;
      for (; null != (k = this.emojiRegex.exec(a));) {
        var p = dQ(this, k[0]) || gQ(this, k[0]);
        !p || p.isCustomEmoji && !b || (p = p,
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


  // class StoreType {

  // }

  // const storeTypeFn = ()=>{
  //   let p = {};
  //   let q = '';
  //   return function(x){
  //     if(typeof x === 'object'){
  //       let id = q = `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}|${Date.now()}`;
  //       p = {[id]: x};
  //       return true;
  //     }
  //     return p[`${x || q}`] || null;
  //   }
  // }

  const storeTypeFn = (key) => {
    let obj = {};
    let ud = false;
    const resFn = function () {
      return obj[this[key]];
    };
    resFn.update = (nv) => {
      ud = !ud;
      const id = `${ud}`;
      obj = { [id]: nv };
      return id;
    }
    return resFn;

  }

  const menuRenderObj = {

    menuListXp: '',
    messageUid: '',
    loading: false,
    error: 0,
    menuListXd: storeTypeFn('menuListXp')

  };


  const profileCard = {
    wElement: null,
    top: -1,
    showOnTop: null,
    iconUrl: null,
    username: null,
    profileUrl: null
  };

  const profileCard_onCrossClick = (e) => {
    !e?.button && Object.assign(W(profileCard), {
      wElement: null,
      top: -1,
      showOnTop: null,
      iconUrl: null,
      username: null,
      profileUrl: null,
    });
  };

  const solidContextMenuOpened = createMemo(() => {
    const e1 = !!R(menuRenderObj).menuListXd();
    const e2 = !!R(menuRenderObj).messageUid;
    const e3 = R(profileCard).wElement;
    return (e1 && e2) || kRef(e3);
  });

  const [atBottom0, atBottom0Set] = createSignal(true);
  const [atBottom1, atBottom1Set] = createSignal(true);
  const [bottomPauseAt, bottomPauseAtSet] = createSignal(0);
  const [bottomKeepAt, bottomKeepAtSet] = createSignal(0);
  createEffect(() => {
    atBottom1Set(atBottom0() ? true : false);
  });

  let lcRendererWR = null;

  const getLcRendererCnt = () => {

    lcRendererWR = lcRendererWR || mWeakRef(document.querySelector('yt-live-chat-item-list-renderer'));
    const lcrElement = kRef(lcRendererWR);
    if (!lcrElement) lcRendererWR = null;
    const lcrCnt = insp(lcrElement);
    return lcrCnt;

  }

  const onContextMenuOpened_ = () => {

    const lcrCnt = getLcRendererCnt();
    if (!lcrCnt) return;

    if (typeof lcrCnt.onContextMenuOpened_ === 'function' && lcrCnt.onContextMenuOpened_.length === 0) {
      lcrCnt.onContextMenuOpened_();
    } else {
      lcrCnt.contextMenuOpen = !0;
    }


  }


  const onContextMenuClosed_ = () => {
    const lcrCnt = getLcRendererCnt();

    if (!lcrCnt) return;

    if (typeof lcrCnt.onContextMenuClosed_ === 'function' && lcrCnt.onContextMenuClosed_.length === 0) {
      lcrCnt.onContextMenuClosed_();
    } else {
      lcrCnt.contextMenuOpen = !1;
    }


  }

  


  createEffect(() => {
    const p = solidContextMenuOpened();
    if (p) {
      onContextMenuOpened_();
    } else if (!p) {
      onContextMenuClosed_();
    }

  })

  const [entryHolding, entryHoldingChange] = createSignal("");
  const [mf, mfChange] = createSignal("");
  const [tooltipTarget, tooltipTargetChange] = createSignal(null);
  let mouseActionP = null;
  let noFlushTP = false;

  const delayPn = delay => new Promise((fn => setTimeout(fn, delay)));

  const getElementText = function (el) {
    let text = '';
    const tagName = el.nodeType === 1 ? el.nodeName.toLocaleLowerCase() : '';
    switch (tagName) {
      case '':
        // Text node (3) or CDATA node (4) - return its text
        if ((el.nodeType === 3) || (el.nodeType === 4)) text = el.nodeValue;
        break;
      case 'tp-yt-paper-tooltip':
      case 'bst-tooltip':
      case 'script':
      case 'style':
      case 'meta':
      case 'noscript':
      case 'link':
      case 'audio':
      case 'video':
      case 'object':
        break;
      case 'img':
        // If node is an element (1) and an img, input[type=image], or area element, return its alt text
        text = el.getAttribute('shared-tooltip-text', 1) || el.getAttribute('alt') || '';
        break;
      case 'area':
        // If node is an element (1) and an img, input[type=image], or area element, return its alt text
        text = el.getAttribute('alt') || '';
        break;
      case 'input':
        // If node is an element (1) and an img, input[type=image], or area element, return its alt text
        if (
          (el.getAttribute('type') && el.getAttribute('type').toLowerCase() == 'image')
        ) {
          text = el.getAttribute('alt') || '';
          break;
        }
      default:
        // Traverse children unless this is a script or style element
        if ((el.nodeType === 1)) {
          let node = el.__shady_native_firstChild || el.firstChild;
          for (; node; node = node.__shady_native_nextSibling || node.nextSibling) {
            text += getElementText(node);
          }
        }
    }
    return text;
  };

  const solidBuildAt = (sb, x)=>{

    const qItem = sb[x];
    const wKey = qItem ? firstObjectKey(qItem) : null;
    const wItem = wKey ? qItem[wKey] : null;
    const item = wItem;

    return item;
    
  }

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
    const wAttachRoot = new WeakMap();
    let _flushed = 0;
    // let bstMainScrollCount = 0;

    const ioMessageListCallback = (entries) => { // performance concern? (6.1ms)
      for (const entry of entries) { // performance concern? (1.1ms)
        const target = entry?.target;
        const mutable = target ? mutableWM.get(target) : null;
        const interceptionRatioChange = mutable?.interceptionRatioChange || 0;
        if (typeof interceptionRatioChange === 'function') {
          if (entry.rootBounds && (entry.rootBounds.height > 1 && entry.rootBounds.width > 1)) { // performance concern? (2.2ms)

            interceptionRatioChange(entry.intersectionRatio);
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

    const addMessageOverflowAnchorToShadow = function (attachRoot) {

      const messageOverflowAnchor = document.createElement('div');
      messageOverflowAnchor.className = 'bst-overflow-anchor';
      attachRoot.appendChild(messageOverflowAnchor);

      let anchorVisible = false;

      const iooa = new IntersectionObserver((entries) => {
        if (_flushed) { // avoid initial check (not yet flushed)
          anchorVisible = entries[entries.length - 1].isIntersecting === true;
        }
        Promise.resolve().then(() => {
          if (!anchorVisible) {
            if (bottomKeepAt() + 80 > Date.now()) {
              this.scrollToBottom_();
            } else {
              this.setAtBottomFalse();
            }
          } else if (!hasAnySelection()) {
            this.setAtBottomTrue();
          }
        });
      }, { root: null, threshold: [0.05, 0.95], rootMargin: '0px' });
      iooa.observe(messageOverflowAnchor);

      _messageOverflowAnchor = messageOverflowAnchor;
    }

    if (!cProto.canScrollToBottom581_ && typeof cProto.canScrollToBottom_ === 'function' && cProto.canScrollToBottom_.length === 0) {


      cProto.pointerHolding581 = false;

      cProto.canScrollToBottom581_ = cProto.canScrollToBottom_;

      cProto.canScrollToBottom_ = function () {
        return this.canScrollToBottom581_() && !this.pointerHolding581;
      }

    }

    cProto.computeIsEmpty_ = function () {
      mme = this;
      return !(this.visibleItems?.length || 0);
    }
    // cProto._flag0281_ = _flag0281_;

    const resetSelection = () => {
      if (profileCard.wElement) {
        Object.assign(W(profileCard), {
          wElement: null,
          top: -1,
          showOnTop: null,
          iconUrl: null,
          username: null,
          profileUrl: null,
        });
      }
      if (menuRenderObj.messageUid) {
        Object.assign(W(menuRenderObj), {
          menuListXp: '',
          messageUid: '',
          loading: false,
        });
      }
      if (entryHolding()) {
        entryHoldingChange('');
      }
    }

    const hasAnySelection = () => {
      return !!(profileCard.wElement || menuRenderObj.messageUid || entryHolding());
    }

    cProto.setupBoostChat = function () {
      let targetElement = (this.$.items || this.$['item-offset']);
      if (!targetElement) return;
      // if(!this.visibleItems__) this.visibleItems__ = [];
      ioMessageListCleanup();

      // this.visibleItemsCount = 0;
      targetElement = targetElement.closest('#item-offset.yt-live-chat-item-list-renderer') || targetElement;
      const bstMain = document.createElement('div');
      const hostElement = this.hostElement;

      {
        const fragment = new DocumentFragment();
        const noscript = document.createElement('noscript');
        noscript.id = 'bst-noscript';
        appendChild.call(noscript, (wliveChatTextMessageRenderer || (wliveChatTextMessageRenderer = document.createElement('yt-live-chat-text-message-renderer'))));
        appendChild.call(noscript, (wliveChatTextInputRenderer || (wliveChatTextInputRenderer = document.createElement('yt-live-chat-text-input-field-renderer'))));

        const div0 = document.createElement('div');
        div0.id = 'bst-noscript-div';
        appendChild.call(noscript, div0);
        const shadowDiv0 = div0.attachShadow({ mode: "open" });
        shadowDiv0.appendChild(wliveChatTextMessageRenderer);
        shadowDiv0.appendChild(wliveChatTextInputRenderer);

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
      }

      const shadowRoot = USE_SHADOWROOT ? bstMain.attachShadow({ mode: "open" }) : null;
      const attachRoot = (USE_SHADOWROOT ? shadowRoot : bstMain);
      const intersectionObserver = new IntersectionObserver(ioMessageListCallback, { root: bstMain, threshold: [0.05, 0.95] });
      wAttachRoot.set(hostElement, {
        shadowRoot,
        bstMain
      });
      bstMain.classList.add('bst-yt-main');
      bstMain.addEventListener('scroll', (a) => {
        // bstMainScrollCount++;
        this.onScrollItems_(a);
      }, false);
      {
        const mListenerQ27 = async () => {
          noFlushTP = true;
        }
        const mListenerQ28 = () => {
          noFlushTP = false;
          const p = mouseActionP;
          if (p) {
            mouseActionP = null;
            p.resolve();
          }
        };

        const mListenerQ29 = (evt) => {
          if (evt.target === bstMain) {
            noFlushTP = false;
            const p = mouseActionP;
            if (p) {
              mouseActionP = null;
              p.resolve();
            }
          }
        };
        bstMain.addEventListener('pointerdown', mListenerQ27, { passive: true, capture: true });
        bstMain.addEventListener('pointerup', mListenerQ28, { passive: true, capture: true });
        bstMain.addEventListener('pointercancel', mListenerQ28, { passive: true, capture: true });
        bstMain.addEventListener('pointerleave', mListenerQ29, { passive: true, capture: false });
        bstMain.addEventListener('pointerenter', mListenerQ29, { passive: true, capture: false });
        // bstMain.addEventListener('mouseenter', mListenerQ28, { passive: true, capture: true });
        // bstMain.addEventListener('mouseleave', mListenerQ28, { passive: true, capture: true });

        if (typeof ResizeObserver !== 'undefined') {
          const ro = new ResizeObserver(() => {
            const dt = bottomPauseAt();
            if (!dt || dt + 60 > 0) {
              bottomKeepAtSet(Date.now());
            }
          });
          ro.observe(bstMain);
        }

      }
      _bstMain = bstMain;

      document.head.appendChild(document.createElement('style')).textContent = `${cssTexts.outer}`;

      attachRoot.appendChild(document.createElement('style')).textContent = `${cssTexts.inner}`;
      messageList = document.createElement('div')
      messageList.className = 'bst-message-list';
      attachRoot.appendChild(messageList);

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


      const solidBuild = new VisibleItemList();


      this.setupVisibleItemsList(solidBuild);

      messageList.solidBuild = solidBuild;
      createMemo((prev) => {
        const list = R(solidBuild);
        (list.length !== prev) && Promise.resolve().then(resetSelection);
        return list.length;
      }, 0);

      

      // createEffect(() => {
      //   solidBuild() && (ezPr !== null) && Promise.resolve([ezPr]).then(h => h[0].resolve());
      // });

      const isListEmpty = createMemo(() => R(solidBuild).length < 1);
      createEffect(() => {
        const cEmpty = isListEmpty();
        const change = (cEmpty) ^ (!!this.isEmpty);
        if (change) {
          this._setPendingProperty('isEmpty', cEmpty, !0) && this._invalidateProperties()
        }
      });



      messageList.profileCard = profileCard;
      render(SolidMessageList.bind(null, solidBuild), messageList);

      addMessageOverflowAnchorToShadow.call(this, attachRoot);

      {

        let mouseEntered = null;



        messageList.addEventListener('mouseenter', function (evt) {

          const target = evt?.target; 


          if (mouseEntered) {
            tooltipTargetChange(null)
            mouseEntered = null;
          } 
          if ((target instanceof HTMLImageElement) || (target instanceof HTMLElement && target.nodeName === 'YT-ICON')) {
            if (target.hasAttribute('shared-tooltip-text')) {
              mouseEntered = target;
              tooltipTargetChange(mWeakRef(target)); 
              evt.stopPropagation();
              evt.stopImmediatePropagation();
              return;
            }
          }


        }, true);
        messageList.addEventListener('mouseleave', function (evt) {


          const target = evt?.target;

          if (target === mouseEntered && mouseEntered) {
            mouseEntered = null;
 
            tooltipTargetChange(null);


            // console.log(12, evt.target.getAttribute('shared-tooltip-text'))
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            return;
          }

        }, true);

      }

      const onNameFieldClick = (target, messageEntry, nameField) => {
        const data = mutableWM.get(messageEntry)?.getDataObj();
        if (!data) return;

        entryHoldingChange(messageEntry.getAttribute('message-uid') || '');
        // if (this.atBottom === true && this.allowScroll === true && this.contextMenuOpen === false) this.contextMenuOpen = true;

        let r1 = nameField.getBoundingClientRect();
        let fTop = r1.top - messageList.getBoundingClientRect().top;
        let fBottom = fTop + r1.height;
        Object.assign(W(profileCard), {
          wElement: mWeakRef(messageEntry),
          fTop,
          fBottom,
          showOnTop: messageEntry.getAttribute('view-pos') === 'down',
          iconUrl: data.getProfilePic(64, -1),
          username: data.bst('getUsername'),
          profileUrl: data.bst('authorAboutPage')
        });

        console.log('[yt-bst] onNameFieldClick', Object.assign({}, (data)));

      }


      let pointerDown = -1;
      let waitingToShowMenu = null;
      let waitingToCloseMenu = null;
      let qcz7 = 0;

      const dblClickMessage = async (messageEntry, target) => {

        const ct = Date.now();
        if (lastSingleClick + 180 > ct) return;

        resetSelection();

        const singleEmoji = target.closest('img.emoji');
        let text;
        if (singleEmoji) {


          text = getElementText(singleEmoji).trim();
        } else {

          const body = messageEntry.querySelector('.bst-message-body');
          text = body ? getElementText(body).trim() : '';
        }
        if (text) {


          const renderer = document
            .querySelector('yt-live-chat-text-input-field-renderer[class]');
          const input = renderer
            ?.querySelector('#input');

          if (input && !input.closest('[hidden]')) {

            await delayPn(40);

            const cnt = getLcRendererCnt();
            const isAtBottom = cnt ? cnt.atBottom && cnt.canScrollToBottom_() : null;
            if (isAtBottom) bottomKeepAtSet(Date.now());

            await input.focus();

            // await delayPn(1);

            insp(renderer).setText('');
            insp(renderer).onInputChange();

            // await delayPn(1);

            const textSplit = text.split(/(:+[^:]+:)/g);
            const data = new DataTransfer();
            for (const s of textSplit) {
              if (!s) continue;
              data.setData('text/plain', s);
              input.dispatchEvent(
                new ClipboardEvent('paste', { bubbles: true, clipboardData: data })
              );
              insp(renderer).onInputChange();
            }

            const range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(input);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            const selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection

            
            // if (isAtBottom) {

            //   const pcz = qcz7 = (qcz7 & 1073741823) + 1;
            //   flushPE(async () => {
            //     if (pcz !== qcz7) return;
            //     setTimeout(() => {
            //       if (pcz !== qcz7) return;
            //       const cnt = getLcRendererCnt();
            //       if (cnt && (!cnt.atBottom || !cnt.canScrollToBottom_())) cnt.scrollToBottom_();
            //     }, 80);
            //   });
            // }
            if (isAtBottom) bottomKeepAtSet(Date.now());

            setTimeout(() => {
              input.scrollTop += 1e9;
            }, 1);

          }

        }


      }

      messageList.addEventListener('dblclick', function (evt) {


        if (evt.button) return;
        const target = evt?.target;


        if (target instanceof Element) {

          const testElement = target.closest('.bst-message-entry, .bst-message-head, .bst-message-profile-holder, .bst-message-menu-container');


          if (testElement?.classList?.contains('bst-message-entry')) {

            dblClickMessage(testElement, target);

          }
        }


      });

      messageList.addEventListener('pointerdown', function (evt) {
        if (evt.button || pointerDown >= 0) return;
        pointerDown = -1;


        dblClickDT = Date.now();
        promiseForDblclick && promiseForDblclick.resolve();
        if (promiseForDblclick) return;

        const lcrCnt = getLcRendererCnt();
        if (lcrCnt) {
          lcrCnt.pointerHolding581 = true;
        }

        const target = evt?.target;
        waitingToShowMenu = null;
        waitingToCloseMenu = null;

        if (target instanceof Element) {

          const messageEntry0 = target.closest('.bst-message-entry');
          const messageUid = messageEntry0 ? messageEntry0.getAttribute('message-uid') : '';

          if (messageUid && messageEntry0 && kRef(profileCard.wElement) !== messageEntry0) {
            profileCard_onCrossClick();
          }


          // console.log(389588, 1, messageUid);
          if (messageUid) {


              const testElement = target.closest('.bst-message-entry, .bst-message-head, .bst-message-profile-holder, .bst-message-menu-container');
              if (testElement?.classList?.contains('bst-message-menu-container')) {
                menuMenuCache.delete(messageUid); // menu action will change menu items
              } else if (menuRenderObj.messageUid !== messageUid && testElement && testElement === messageEntry0) {
  
                const shouldShowMenuAction = isCtrl(evt) || isAlt(evt);
 
                if (shouldShowMenuAction) {
                  if (entryHolding() !== messageUid) entryHoldingChange(messageUid ? messageUid : '');

                  if (menuRenderObj.messageUid) {

                    Object.assign(W(menuRenderObj),{
                      menuListXp: '',
                      messageUid: '',
                      loading: false,
                    });

                  }

                  waitingToShowMenu = { pageX0: evt.pageX, pageY0: evt.pageY };
                  preShowMenu(messageEntry0);
                } else {
                  if (entryHolding()) entryHoldingChange('');


                  if (menuRenderObj.messageUid) {

                    Object.assign(W(menuRenderObj),{
                      menuListXp: '',
                      messageUid: '',
                      loading: false,
                    });

                  }

                }
  
              } else if (menuRenderObj.messageUid && testElement && testElement !== messageEntry0) {
  
  
  
                // console.log(389588, 3, messageUid);
                // if (entryHolding() !== messageUid) entryHoldingChange(messageUid ? messageUid : '');
  
                if (menuRenderObj.messageUid) {
                  Object.assign(W(menuRenderObj),{
                    menuListXp: '',
                    messageUid: '',
                    loading: false,
                  });
  
                }
                entryHoldingChange('');
  
  
              } else if (menuRenderObj.messageUid && target.closest('.bst-message-entry, .bst-message-menu-container')?.classList?.contains('bst-message-entry')) {
  
                // console.log(389588, 4, messageUid);
                waitingToCloseMenu = { pageX0: evt.pageX, pageY0: evt.pageY };
  
  
  
              } else if (entryHolding() !== messageUid) {
  
                // console.log(389588, 5, messageUid);
                // if(entryHolding()!==messageUid) entryHoldingChange(messageUid ? messageUid : '');
  
                if (menuRenderObj.messageUid) {
                  Object.assign(W(menuRenderObj),{
                    menuListXp: '',
                    messageUid: '',
                    loading: false,
                  });
                }
  
                entryHoldingChange('');
  
  
              } else {
  
                // console.log(389588, 6, messageUid);
                entryHoldingChange('');
              }

             


          } else if (entryHolding()) {

            // console.log(389588, 7, messageUid);
            if (entryHolding() !== messageUid) entryHoldingChange(messageUid ? messageUid : '');

            if (menuRenderObj.messageUid) {

              Object.assign(W(menuRenderObj),{
                menuListXp: '',
                messageUid: '',
                loading: false,
              });
            }

          }

        }


      });



      messageList.addEventListener('pointerup', function (evt) {


        if (pointerDown >= 0) return;

        pointerDown = -1;

        const lcrCnt = getLcRendererCnt();
        if (lcrCnt && !`${window.getSelection()}`) {
          lcrCnt.pointerHolding581 = false;
        }



      });


      messageList.addEventListener('pointercancel', function (evt) {


        if (pointerDown >= 0) return;

        pointerDown = -1;



      });

      const distance = (x, y) => Math.sqrt(x * x + y * y);

      let promiseForDblclick = null;
      let dblClickDT = 0;
      let lastSingleClick = 0;

      messageList.addEventListener('click', async function (evt) {


        const waitingToShowMenu_ = waitingToShowMenu;
        waitingToShowMenu = null;

        const waitingToCloseMenu_ = waitingToCloseMenu;
        waitingToCloseMenu = null;


        dblClickDT = 0;
        promiseForDblclick = new PromiseExternal();
        await Promise.race([promiseForDblclick, delayPn(140)]);
        promiseForDblclick = null;
        const ct = Date.now();
        if (dblClickDT + 180 > ct) return;
        lastSingleClick = ct;

        const currentProfileCardElement = kRef(profileCard.wElement);

        let b = false;
        const target = evt?.target;
        if (target instanceof Element) {
          const messageEntry = target.closest('.bst-message-entry');
          if (messageEntry) {
            const nameField = target.closest('.bst-name-field');
            if (nameField) {
              onNameFieldClick(target, messageEntry, nameField);
              b = true;
            }
          }
        }

        if (!b && currentProfileCardElement && !target.closest('.bst-profile-card')) {
          profileCard_onCrossClick();
        }

        if (waitingToShowMenu_ && target instanceof Element) {
          const { pageX0, pageY0 } = waitingToShowMenu_;
          const { pageX, pageY } = evt;

          const d = distance(pageX - pageX0, pageY - pageY0);

          const messageEntry0 = target.closest('.bst-message-entry');
          const messageUid = messageEntry0 ? messageEntry0.getAttribute('message-uid') : '';
          if (d < 4 && messageUid) {

            const elementRect = messageEntry0.getBoundingClientRect();

            if (pageX >= elementRect.left && pageX <= elementRect.right && pageY >= elementRect.top && pageY <= elementRect.bottom) {

              showMenu(messageEntry0);
            } else if (menuRenderObj.messageUid) {

              Object.assign(W(menuRenderObj),{
                menuListXp: '',
                messageUid: '',
                loading: false,
              });

              entryHoldingChange('');
            }
          } else {

            if (entryHolding() !== messageUid) entryHoldingChange(messageUid ? messageUid : '');
            if (menuRenderObj.messageUid) {

              Object.assign(W(menuRenderObj),{
                menuListXp: '',
                messageUid: '',
                loading: false,
              });

              entryHoldingChange('');
            }

          }

        }

        if (waitingToCloseMenu_ && target instanceof Element) {

          const messageEntry0 = target.closest('.bst-message-entry');
          const messageUid = messageEntry0 ? messageEntry0.getAttribute('message-uid') : '';


          if (messageUid) {

            const testElement = target.closest('.bst-message-entry, .bst-message-head, .bst-message-profile-holder');
            if (menuRenderObj.messageUid !== messageUid && testElement && testElement === messageEntry0) {

            } else if (menuRenderObj.messageUid && testElement && testElement !== messageEntry0) {

            } else if (menuRenderObj.messageUid && target.closest('.bst-message-entry, .bst-message-menu-container')?.classList?.contains('bst-message-entry')) {


              const { pageX0, pageY0 } = waitingToCloseMenu_;
              const { pageX, pageY } = evt;

              const d = distance(pageX - pageX0, pageY - pageY0);


              if (d < 4) {

                // if (entryHolding() !== messageUid) entryHoldingChange(messageUid ? messageUid : '');
                Object.assign(W(menuRenderObj),{
                  menuListXp: '',
                  messageUid: '',
                  loading: false,
                });
                entryHoldingChange('');

              }
            }

          }
        }


      });

      {
        const attributeFn = () => {
          if (!messageList) return;
          const isDark = document.documentElement.hasAttribute('dark')
          if (isDark) _setAttribute.call(messageList, 'dark', '');
          else _removeAttribute.call(messageList, 'dark');
        };
        (new MutationObserver(attributeFn)).observe(document.documentElement, { attributes: true });
        attributeFn();
      }


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
        const list = R(solidBuild);
        let j = 0;
        for (let i = 0; i < list.length; i++) {
          const listItem =solidBuildAt(list, i);
          const mutable = mutableWM.get(listItem);
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


      Promise.resolve().then(() => {
        
        let qcz4 = 0;
        document.addEventListener('keydown', (evt) => {
          const target = (evt?.target || 0);
          if (target instanceof HTMLElement && target.id === 'input') {
            const cnt = getLcRendererCnt();
            const isAtBottom = cnt ? cnt.atBottom && cnt.canScrollToBottom_() : null;
            target.__ah46n__ = isAtBottom;
          }
        });
        document.addEventListener('keyup', (evt) => {
          const target = (evt?.target || 0);
          const isAtBottom__ = target.__ah46n__;
          if (isAtBottom__) {
            target.__ah46n__ = null;
            const pcz = ++qcz4;
            flushPE(()=>{
              if(pcz !== qcz4) return;
              setTimeout(() => {
                if(pcz !== qcz4) return;
                const cnt = getLcRendererCnt();
                if (!cnt) return;
                if (cnt.atBottom && cnt.canScrollToBottom_()) {
                } else {
                  cnt.scrollToBottom_();
                }
              }, 80);
            })
          }
        });


      });

    }

    // const
    // shadow.appendChild(document.createElement('div')).className = 'bst-message-entry';





    function getAuthor(o) {
      if (MEMO(o, 'rendererFlag')() === 1) {
        return o?.header?.liveChatSponsorshipsHeaderRenderer;
      }
      return o;
    }

    function getAuthorBadgeType(authorBadges) {
      if (!authorBadges || !(authorBadges.length >= 1)) return ''; // performance concern? (1.8ms)
      for (const badge of authorBadges) {
        const r = badge ? badge.liveChatAuthorBadgeRenderer : null;
        if (r) {
          const b = r ? r.icon ? r.icon.iconType.toLowerCase() : r.customThumbnail ? "member" : "" : ""
          if (b && "verified" !== b) {
            return b;
          }
        }
      }
      return '';
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

    fixMessages = (messages) => {

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


    function bst(prop) {

      if (prop === 'getUsername') {
        
        return MEMO(this, 'authorName')();
      } else if (prop === 'hasMessageBody') {

        const message = MEMO(this, 'rendererFlag')() === 1 ? this.header?.liveChatSponsorshipsHeaderRenderer?.primaryText : this.message;
        if (typeof (message || 0) !== 'object') return false;
        if (message.simpleText) return true;

        const runs = message.runs;
        return runs && runs.length && runs[0];

      } else if(prop === 'messageXM'){

        return MEMO(this, 'messageXM');
      
      } else if (prop === 'authorBadges') {


        const badges = getAuthor(this)?.authorBadges;
        if (typeof (badges || 0) !== 'object') return null; // performance concern? (31.1ms)
        return badges;

      } else if (prop === 'authorType') {

        return  getAuthorBadgeType(this.authorBadges);
      } else if (prop === 'shouldHighlight') {
        const authorType = this.bst('authorType');
        return authorType === 'owner';
      } else if (prop === 'timestampText') {
        if (this.timestampText) return convertYTtext(this.timestampText);
        const ts = +this.timestampUsec / 1000;
        if (ts > 1107183600000) {
          const now = Date.now();
          if (ts < (now + 120000)) {
            return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); // performance concern? (1.4ms)
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
        resetSelection();
        this.atBottom = true;
        atBottom0Set(true);
        bottomPauseAtSet(0);
        if (this.activeItems_.length > 0) this.flushActiveItems_();
      }

    }

    cProto.setAtBottomFalse = function () {

      if (this.atBottom === true) {
        this.atBottom = false;
        atBottom0Set(false);
        bottomPauseAtSet(Date.now());
      }

    }

    cProto.__notRequired__ = (cProto.__notRequired__ || 0) | 256;
    cProto.setAtBottom = (...args) => {

      console.log('[yt-bst] setAtBottom', 583, ...args)

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
      console.log('[yt-bst] maybeAddDockableMessage_', 791, a)
      return this.maybeAddDockableMessage17_(a)
    }

    cProto.forEachItem_ = function (a) {
      // mme = this
      let status = 0;
      let i;
      try {
        status = 1;
        i = 0;
        for (const t of this.visibleItems) { // performance concern? (2.1ms)
          a.call(this, "visibleItems", t, i++) // performance concern? (12.8ms)
        }
        status = 2;
        i = 0;
        for (const t of this.activeItems_) {
          a.call(this, "activeItems_", t, i++);
        }
        status = 3;
      } catch (e) {
        console.error('[yt-bst] forEachItem_', status, i, this.visibleItems.length, this.activeItems_.length)
        console.error(e)
      }
    }

    cProto.computeVisibleItems17 = cProto.computeVisibleItems;
    cProto.computeVisibleItems = function (a, b) {

      console.log('[yt-bst] computeVisibleItems', 791, a, b)
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
          console.error('[yt-bst] replacementTo.length > 1', replacementTo.slice(0));
          // replacementTo.splice(0, replacementTo.length - 1);
        }

        for (const entry of replacementTo) {
          const [tag, p, idx] = entry;
          // const aObj = p[fk];

          if ("visibleItems" === tag) {

            const list = messageList.solidBuild;
            const bObj = solidBuildAt(list, idx);
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
              const list = messageList.solidBuild;
              const bObj = solidBuildAt(list, idx);
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

    cProto.setupVisibleItemsList = function (solidBuild) {
      const q = this.visibleItems;
      if (q instanceof Array && !(q instanceof VisibleItemList)) {
        const p = q.slice();
        const r = this.visibleItems = solidBuild;
        p.length >= 1 && inPlaceArrayPush(r, p);
        p.length = 0;
        q.length = 0;
      }
    }
    cProto.bstClearCount = 0;
    cProto.clearList = function () {
      
      this.bstClearCount = (this.bstClearCount & 1073741823) + 1;
      const activeItems_ = this.activeItems_;
      if (activeItems_) activeItems_.length = 0;
      flushKeys.clear();
      // this.setupVisibleItemsList();
      const visibleItems = this.visibleItems;
      if (visibleItems && (visibleItems.length > 0)) { 
        visibleItems.length = 0; 
        if (messageList) {
          messageList.classList.remove('bst-listloaded');
          const solidBuild = messageList.solidBuild;
          solidBuild.setLength(0);
        }
      }
      if (!activeItems_.length && !visibleItems.length) {
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

    let qcz9 = 0;
    cProto.scrollToBottom_ = function () {
      // console.log(1882)

      const pcz = qcz9 = (qcz9 & 1073741823) + 1;
      flushPE(async () => {
        if (pcz !== qcz9) return;
        resetSelection();
        scrollToEnd();
        this.setAtBottomTrue();
      })

      // this.itemScroller.scrollTop = Math.pow(2, 24);
      // this.atBottom = !0
    }

    cProto.showNewItems_ = function (...args) {

      console.log('[yt-bst] showNewItems_', 583, ...args)

    }

    cProto.refreshOffsetContainerHeight_ = function () {

      console.log('[yt-bst] refreshOffsetContainerHeight_', 583, ...args)
    }

    cProto.maybeResizeScrollContainer_ = function (...args) {


      console.log('[yt-bst] maybeResizeScrollContainer_', 583, ...args)
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
      return `${aObj.authorExternalChannelId || `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`}:${aObj.timestampUsec || 0}`
    }
    function convertAObj(aObj, aKey) {

      if(!aObj || aObj.uid) {
        console.warn('convertAObj warning')
      }

      aObj.uid = aObj.uid || createMemo(() => {
        return getUID(R(aObj));
      })

      if (aKey && typeof aKey === 'string') W(aObj).aKey = aKey;

      const rendererFlag = MEMO(aObj, 'rendererFlag', ()=>{
        if(R(aObj).aKey === "liveChatSponsorshipsGiftPurchaseAnnouncementRenderer") return 1;
        return 0;
      });

      MEMO(aObj, 'authorName', () => {
        const dx = R(aObj) && rendererFlag() === 1 ? aObj.header?.liveChatSponsorshipsHeaderRenderer : aObj
        return convertYTtext(dx.authorName);
      });
 
      aObj.getProfilePic = getProfilePic;
      aObj.getStickerURL = getStickerURL;
      aObj.bst = bst;

      const messageXT = createMemo(()=>{
        const data = R(aObj);
        const m1 = rendererFlag() === 1 ? data.header?.liveChatSponsorshipsHeaderRenderer?.primaryText : data.message;
        return messageFlatten(m1);
      })

      MEMO(aObj, 'messageXM', () =>{
        const str = messageXT();
        return messageUnflatten(str);
      })


    }

    let nyhaDPr = null;
    const nyhaDId = `nyhaD${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
    const nyhaDPost = window.postMessage.bind(window, nyhaDId);
    window.addEventListener('message', (evt) => {
      if ((evt || 0).data === nyhaDId) {
        const t = nyhaDPr;
        if (t !== null) {
          nyhaDPr = null;
          t.resolve();
        }
      }
    });
    timelineResolve = async () => {
      let t = nyhaDPr;
      if (t === null) {
        t = nyhaDPr = new PromiseExternal();
        nyhaDPost();
      }
      await t.then();
    }



    const menuMenuCache = new Map();

    const preShowMenu = function (messageEntry_) {


      const messageEntry = messageEntry_ || this;
      const messageUid = (messageEntry.getAttribute('message-uid') || '');
      if (messageUid) {


        const resT = menuMenuCache.get(messageUid);


        if (resT) return resT;

        const resPR = new Promise(resolve => {


          const cnt = insp(wliveChatTextMessageRenderer);
          cnt.showContextMenu.call({
            data: {
              contextMenuEndpoint: messageEntry.polymerController.dataRaw.contextMenuEndpoint
            },
            isAttached: true,
            is: cnt.is,
            __showContextMenu_forceNativeRequest__: true,
            showContextMenu37: cnt.showContextMenu37,
            showContextMenu47: cnt.showContextMenu47,
            showContextMenu47_: cnt.showContextMenu47_,
            showContextMenu_: cnt.showContextMenu_,
            showContextMenu: cnt.showContextMenu,

            handleGetContextMenuResponse_: function (a) {
              a.isSuccess = true;
              menuMenuCache.set(messageUid, a);
              resolve(a);
            },
            handleGetContextMenuError: function (a) {

              a.isFailure = true;
              menuMenuCache.set(messageUid, a);
              resolve(a);

            }
          }, undefined);



        });
        menuMenuCache.set(messageUid, resPR);

        return resPR;



      }
      return null;
    }

    const showMenu = function (messageEntry_) {
      const messageEntry = messageEntry_ || this;
      const messageUid = (messageEntry.getAttribute('message-uid') || '');
      if (messageUid) {

        if (menuRenderObj.messageUid === messageUid) return;
        entryHoldingChange(messageUid);
        Object.assign(W(menuRenderObj),{
          menuListXp: '',
          messageUid: messageUid,
          loading: true,
        });

        const callback = (a) => {

          if (a && a.isSuccess) {

            let menuRenderer = null;
            if (a && typeof a === 'object') {
              for (const [key, value] of Object.entries(a)) {
                if (typeof (value || 0) === 'object' && value.menuRenderer) {
                  menuRenderer = value.menuRenderer;
                  break;
                }
              }
            }


            const items = menuRenderer ? menuRenderer.items : null; // no login -> no items; only {openImmediately: true, trackingParams: XXXX}
            if (items) {

              Object.assign(W(menuRenderObj),{
                menuListXp: menuRenderObj.menuListXd.update(items.slice(0)),
                messageUid: messageUid,
                loading: false,
              });
            } else {

              Object.assign(W(menuRenderObj),{
                menuListXp: '',
                messageUid: '',
                loading: false,
              });
              if (entryHolding()) {
                entryHoldingChange('');
              }

            }




          } else {

            Object.assign(W(menuRenderObj),{
              menuListXp: '',
              messageUid: '',
              loading: false,
              // error: 1
            });
            if (entryHolding()) {
              entryHoldingChange('');
            }
          }


        }

        const resA = preShowMenu(messageEntry);
        if (resA && typeof resA.then === 'function') {
          resA.then(callback);
        } else if (resA) {
          callback(resA);
        }

      }
    }

    const freqMap = new Map(); // for temp use.
    // const isOverflowAnchorSupported = CSS.supports("overflow-anchor", "auto") && CSS.supports("overflow-anchor", "none");
    cProto.flushActiveItems37_ = cProto.flushActiveItems_;
    cProto.flushActiveItems_ = function () {
      const bstClearCount0 = this.bstClearCount;
      const items = (this.$ || 0).items;
      const hostElement = this.hostElement;
      if (!(items instanceof Element)) return;
      if (!wAttachRoot.has(hostElement)) {
        this.setupBoostChat();
        const thisData = this.data;
        if (thisData.maxItemsToDisplay > 0) thisData.maxItemsToDisplay = MAX_ITEMS_FOR_TOTAL_DISPLAY;
      }

      if (!messageList) return;
      if (DEBUG_windowVars) window.__bstFlush01__ = Date.now();

      // if(this.hostElement.querySelectorAll('*').length > 40) return;
      flushPE(async () => {

        while (noFlushTP) {
          mouseActionP = mouseActionP || new PromiseExternal();
          await mouseActionP.then();
        }

        // add activeItems_ to visibleItems

        // activeItems_ -> clear -> add to visibleItems

        // this.setupVisibleItemsList();


        if (DEBUG_windowVars) window.__bstFlush02__ = Date.now();
        const activeItems_ = this.activeItems_;
        const _addLen = activeItems_.length;
        // console.log(55, _addLen)
        if (_addLen === 0) return;
        // if(this.visibleItemsCount > 40) return;

        const maxItemsToDisplay = this.data.maxItemsToDisplay;

        if (!this.canScrollToBottom_()) {

          _addLen > maxItemsToDisplay * 2 && activeItems_.splice(0, _addLen - maxItemsToDisplay)
          return;
        } else {
          if (_addLen > maxItemsToDisplay) {
            const visibleItems = this.visibleItems;
            if (visibleItems && (visibleItems.length > 0)) {
              visibleItems.length = 0;
              if (messageList) {
                const solidBuild = messageList.solidBuild;
                solidBuild.setLength(0);
              }
            }
            activeItems_.splice(0, _addLen - maxItemsToDisplay);
          }

        }

        if (DEBUG_windowVars) window.__bstFlush03__ = Date.now();



        _flushed = 1;
        const items = activeItems_.slice(0);

        const generatePFC = () => {

          freqMap.clear();

          const visibleItems = this.visibleItems;

          const fp = new Array(visibleItems.length);
          let fpI = 0;

          const pp = visibleItems.map(e => {
            if (!e) return null;
            if (typeof e === 'object') e = Object.values(e)[0] || 0;
            const r = e.id || null;
            if (typeof r === 'string') {
              fp[fpI++] = r;
              freqMap.set(r, freqMap.has(r) ? false : true);
            }
            return r;
          }); // e.id (non-empty) or null

          fp.length = fpI;

          const cp = new Array(fpI);
          let cpI = 0;
          for (const [key, isUnique] of freqMap.entries()) {
            if (isUnique) {
              cp[cpI++] = key;
            }
          }
          cp.length = cpI;

          return { pp, fp, cp };

        }

        {


          const { pp, fp, cp } = generatePFC();
          if (pp.length !== fp.length || fp.length !== cp.length || pp.length !== cp.length) {

            console.log(`[yt-bst] flushItems; length mismatched (01); pp=${pp.length}, fp=${fp.length}, cp=${cp.length}`);

            // stuck in here.  cannot flush more items
          }

        }
        //  console.log(9192, 299, items);
        // activeItems_.length = 0;
        // const crCount = this.bstClearCount;
        // const pEmpty = this.isEmpty;


        if (bstClearCount0 !== this.bstClearCount) return;
        if (this.isAttached !== true) return;
        if (items.length === 0) return;

        let existingSet = new Set();
        for (const entry of this.visibleItems) {
          let k = entry ? firstObjectKey(entry) : null;
          let p = k ? entry[k] : null;
          p && p.id && existingSet.add(p.id);
        }

        let rearrangedW = items.map(flushItem => {

          const aKey = flushItem ? firstObjectKey(flushItem) : null;
          const aObj = aKey ? flushItem[aKey] : null;
          if (!aObj) return null;

          const id = aObj.id
          const uid = getUID(aObj);
          if (existingSet.has(id)) return null;
          existingSet.add(id);
        // if (flushKeys.has(uid)) return null;
        // flushKeys.add(uid);



          return {
            flushItem,
            aKey, aObj, uid
          };

        }).filter(e => !!e);
        existingSet.clear();
        existingSet = null;

        const nd = rearrangedW.length;
        if (nd === 0) return;

        // await timelineResolve();
        await Promise.resolve();

        if (bstClearCount0 !== this.bstClearCount) return;
        if (this.isAttached !== true) return;

        const mapToFlushItem = new Map();
        // no filtering
        const rearrangedFn = entry => {

          const {
            flushItem,  // flushItem is object so it content can be replaced since rearrangedW
            aKey, aObj, uid
          } = entry;
          // flushKeys.removeAdd(uid);

          const bObj = aObj;
          let bObjWR = mWeakRef(aObj);
          let mutableWR;
          let createdPromise = new PromiseExternal();

          let messageEntryWR = null;


          const bObjChange = (val) => {
            const f = kRef(mutableWR)?.bObjChange
            if (f) f(val);
          }

          const mutable = {
            getDataObj() {
              return kRef(bObjWR);
            },
            convert() {
              let aObj = kRef(bObjWR);
              if (!aObj) return;
              if (!aObj.uid) convertAObj(aObj, aKey);
            },
            removeEntryFuncs: new Map(),
            tooltips: new Map(),
            createdPromise: createdPromise,
            removeEntry() {
              this.convert = null;

              this.removeEntryFuncs.forEach((f) => {
                f.call(this);
              });
              this.removeEntryFuncs.clear();
              this.tooltips.clear();

              this.createdPromise = null;
              this.removeEntryFuncs = null;
              this.tooltips = null;
              this.removeEntry = null;
              this.setupFn = null;
              this.bObjChange = null;

            },
            bObjChange(val) {
              let bObj = kRef(bObjWR);
              if (!bObj) return;
              if (typeof (val || 0) === 'object') {
                for (const s of ['authorBadges', 'message']) {
                  Reflect.has(val, s) || (val[s] = undefined);
                  Reflect.has(val, s) || (val[s] = undefined);
                }
              }
              convertAObj(val, val.aKey || undefined);
              Object.assign(W(bObj), val);
            },
            setupFn(_messageEntry) {

              if (messageEntryWR) {
                console.warn('setupFn warning 01');
                return;
              }

              /** @type {HTMLElement} */
              messageEntryWR = mWeakRef(_messageEntry); 

              if (!kRef(bObjWR) || !kRef(mutableWR)) {
                console.warn('setupFn warning 02');
                return;
              }

              const [interceptionRatio, interceptionRatioChange] = createSignal(null);
              const [viewVisible, viewVisibleChange] = createSignal(null);
              const [viewVisibleIdx, viewVisibleIdxChange] = createSignal(null); // 1 to n

              const baseRemoveFn = () => {
                const bObj = kRef(bObjWR);
                const messageEntry = kRef(messageEntryWR);
                mutableWM.delete(bObj);
                mutableWM.delete(messageEntry);
              };

              {
                const messageEntry = _messageEntry;
                let mutable = kRef(mutableWR);
                mutable.viewVisible = viewVisible;
                mutable.viewVisibleChange = viewVisibleChange;
                mutable.viewVisibleIdx = viewVisibleIdx;
                mutable.viewVisibleIdxChange = viewVisibleIdxChange;
                mutable.interceptionRatioChange = interceptionRatioChange;
                mutableWM.set(messageEntry, mutable);
                messageEntry.showMenu = showMenu;
                mutable.removeEntryFuncs.set('baseRemove', baseRemoveFn);
                mutable = null;
              }


              const polymerController = {
                set(prop, val) {
                  if (prop === 'data') {
                    bObjChange(val);
                  }
                },
                get data() {
                  return kRef(bObjWR);
                },
                set data(val) {
                  bObjChange(val);
                },
                get dataRaw() {
                  return kRef(bObjWR);
                },
                get dataMutable() {
                  return kRef(mutableWR);
                },
                get authorType() {
                  const bObj = kRef(bObjWR);
                  return getAuthorBadgeType(bObj.authorBadges);
                }
              };


              {

                const messageEntry = _messageEntry;
                messageEntry.polymerController =polymerController;

              }

              {

                let bObj = kRef(bObjWR);

                if (!!(bObj.aKey && bObj.aKey !== 'liveChatTextMessageRenderer')) {

                  const messageEntry = kRef(messageEntryWR);
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

                }

              }

              // change on state
              createEffect(() => {

                const visible = interceptionRatio();
                if (visible > 0.9) {
                  viewVisibleChange(1);
                } else if (visible < 0.1) {
                  viewVisibleChange(0);
                }

              });
 
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
                const messageEntry = kRef(messageEntryWR);
                if (v === null) {
                  _removeAttribute.call(messageEntry, 'view-pos');
                } else {
                  _setAttribute.call(messageEntry, 'view-pos', v);
                }
              });

              {
                const messageEntry = _messageEntry;
                let mutable = kRef(mutableWR);
                mutable.viewVisiblePos = viewVisiblePos;
                ioMessageList && ioMessageList.observe(messageEntry);
                createdPromise && createdPromise.resolve(messageEntry);
                createdPromise = null;
              }
              rcSignalAdd(1);

            }
          }
          mutableWR = mWeakRef(mutable);
          mutableWM.set(bObj, mutable);

          mapToFlushItem.set(bObj, flushItem);

          return bObj;
        };

        const visibleItems = this.visibleItems;
        let wasEmpty = false;
        // let needScrollToEnd = false;
        if (visibleItems.length === 0) {
          // needScrollToEnd = true;
          wasEmpty = true;
        } 
        // else if (this.canScrollToBottom_() === true) {

        // // try to avoid call offsetHeight or offsetTop directly
        // const list = messageList.solidBuild;
        // const bObj = list && list.length ? list[0] : null;
        // if (bObj) {
        //   const dataMutable = mutableWM.get(bObj);
        //   if (dataMutable && typeof dataMutable.viewVisiblePos === 'function' && typeof dataMutable.viewVisiblePos() === 'string') { // down or up
        //     needScrollToEnd = true;
        //   }
        // }

        // if (!needScrollToEnd && _messageOverflowAnchor && typeof _messageOverflowAnchor.scrollIntoViewIfNeeded === 'function') {
        //   _messageOverflowAnchor.scrollIntoViewIfNeeded(false);
        //   // unknown reason
        //   // example https://www.youtube.com/watch?v=18tiVN9sxMc&t=14m15s -> 14m21s
        //   // example https://www.youtube.com/watch?v=czgZWwziG9Y&t=48m5s -> 48m12s
        //   // guess: ticker added -> yt-live-chat-ticker-renderer appears -> height changed -> overflow-anchor not working
        // }

        // }

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


        const solidBuild = messageList.solidBuild;

        const loopFunc = (bObjX) => {
          const bObj = bObjX;
          const flushItem = mapToFlushItem.get(bObj);
          const n = solidBuild.getLength() - maxItemsToDisplay + 1;
          if (n >= 1) {
            if (n > 1) {
              visibleItems.splice(0, n);
            } else {
              visibleItems.shift();
            }
          }
          removeFromActiveItems(flushItem);
          const uid = getUID(bObj);
          mfChange(uid);
          visibleItems.push(flushItem);
        }

        

        let awaitTime = 0;

        // console.log('[yt-bst] XX', '000000')
        bottomKeepAtSet(Date.now() + 86400000);
        if (DEBUG_windowVars) window.__bstFlush04__ = Date.now();
        let mg = 0;
        rcValue = rcSignal();
        const t1 = performance.now();
        let a2 = t1;
        let b2 = 0;
        for (let rJ = 0; rJ < nd; rJ++) {
          if (bstClearCount0 !== this.bstClearCount || this.isAttached !== true) {
            flushKeys.clear();
            break;
          }
          const bObjX = rearrangedFn(rearrangedW[rJ]);
          rcSignalAdd(1);
          loopFunc(bObjX, solidBuild);
          const c2 = performance.now();
          // console.log('[yt-bst] XX', c2, mg, rcSignal(), rcValue )
          b2++;
          if ((c2 - a2) * (b2 + 1) - 14 * b2 > 0) { //  // (c2-a2)*((b2+1)/b2)>14
            await timelineResolve();
            const t = performance.now();
            awaitTime += Math.round(t - c2);
            a2 = t;
            b2 = 0;
            mg++;
            // console.log('[yt-bst] YY', t, mg)
          } else {
            await Promise.resolve();
          }
        }
        mapToFlushItem.clear();
        rearrangedW.length = 0;
        rearrangedW = null;

        // console.log('[yt-bst] XX', '111111')
        
        const rcPromise_ = rcPromise = new PromiseExternal();
        // rcSignalAdd(1);
        rcValue++;
        await timelineResolve();
        rcSignalAdd(0);
        await rcPromise_.then();
        if (rcPromise_ === rcPromise) rcPromise = null;
        resetSelection();

        if (DO_scrollIntoViewIfNeeded) {
          _messageOverflowAnchor && _messageOverflowAnchor.scrollIntoViewIfNeeded();
        }

        if (DEBUG_windowVars) window.__bstFlush05__ = Date.now();
        // if (needScrollToEnd) scrollToEnd(); // before the last timelineResolve
        
        await Promise.resolve();
        if (wasEmpty) messageList.classList.add('bst-listloaded');
        const t2 = performance.now();

        if (LOGTIME_FLUSHITEMS && t2 - t1 > 100) {
          const T = Math.round(t2 - t1);
          const t = T - awaitTime;
          console.log(`[yt-bst] flushItems; n=${nd}; t=${T}-${awaitTime}=${t}; mg=${mg}`);
        }

        {


          const { pp, fp, cp } = generatePFC();
          if (pp.length !== fp.length || fp.length !== cp.length || pp.length !== cp.length) {

            console.log(`[yt-bst] flushItems; length mismatched (02); pp=${pp.length}, fp=${fp.length}, cp=${cp.length}`);
          }

        }

        if (DEBUG_windowVars) window.__bstFlush06__ = Date.now();


        bottomKeepAtSet(Date.now());


      });


    }


  });

})();
