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
// @version             0.1.9
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
// @require             https://raw.githubusercontent.com/cyfung1031/userscript-supports/4a50e12e8211789058cb784433f2156a34783ba9/library/html.min.js
// ==/UserScript==

(() => {

  const MAX_ITEMS_FOR_TOTAL_DISPLAY = 90;
  const RENDER_MESSAGES_ONE_BY_ONE = true;

  const { replaceWith } = ((h0) => h0)(document.createElement('h0'));

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



  const firstKey = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return key;
    }
    return null;
  }


  const flushPE = createPipeline();

  let scrollEveryRound = null;
  

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
      super.add(key);
    }

  }

  const flushKeys = new LimitedSizeSet(64);
  const mutableWM = new WeakMap();


  let anchorVisible = false;

  const passiveCapture = typeof IntersectionObserver === 'function' ? { capture: true, passive: true } : true;


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


  const cssTexts =  {
    "outer":`
    

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
    "inner":`



      .bst-message-list {
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
      }

      */


      .bst-message-list {
        --yt-live-chat-sponsor-color-ori: var(--yt-live-chat-sponsor-color);
        --yt-live-chat-moderator-color-ori: var(--yt-live-chat-moderator-color);
        --yt-live-chat-author-chip-owner-background-color-ori: var(--yt-live-chat-author-chip-owner-background-color);
      }

      .bst-message-list[dark] .bst-message-entry:not(.bst-membership-message) {
        --yt-live-chat-sponsor-color: #71ff8c;
        --yt-live-chat-moderator-color: #70a7ff;
        --yt-live-chat-author-chip-owner-background-color: #ffff3c;
      }

      .bst-message-list[dark] .bst-message-entry .bst-message-username {
        --yt-live-chat-secondary-text-color: #a3e3e3;
      }

      .bst-message-username {
        box-sizing: border-box;
        border-radius: 2px;
        color: var(--yt-live-chat-secondary-text-color);
        font-weight: 500;
      }

      .bst-message-list {

        --yt-live-chat-first-line-height: calc( var(--yt-live-chat-emoji-size) + 2px );
        --yt-live-chat-profile-icon-size: 20px;
        --bst-message-entry-ml: calc( var(--yt-live-chat-profile-icon-size) + 6px );
        --yt-live-chat-tooltip-max-width: 60vw;

        --bst-list-pl: 20px;
        --bst-list-pr: 20px;
        --bst-list-pt: 8px;
        --bst-list-pb: 8px;

        --bst-list-gap: 10px;

        --bst-author-badge-mb: .2rem;
        --bst-author-badge-va: text-bottom;
        --bst-author-badge-size: 16px;

        padding-left: var(--bst-list-pl);
        padding-right: var(--bst-list-pr);
        padding-top: var(--bst-list-pt);
        padding-bottom: var(--bst-list-pb);
        display: flex;
        gap: var(--bst-list-gap);
        flex-direction: column;

      }
      .bst-message-time {
        display:inline;
        white-space: nowrap;
        vertical-align: baseline;
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
      }
      .bst-message-badge-yt-icon{
        display: inline-flex;
        width: 16px;
        height: 16px;
        margin-bottom: var(--bst-author-badge-mb);
        vertical-align: var(--bst-author-badge-va);
        margin:0;
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
      .bst-liveChatSponsorshipsGiftRedemptionAnnouncementRenderer[class] {
        flex-direction: row;
        flex-wrap: nowrap;
      }

      .bst-liveChatSponsorshipsGiftRedemptionAnnouncementRenderer .bst-message-head-colon {
        display: none;
      }
      .bst-liveChatSponsorshipsGiftRedemptionAnnouncementRenderer .bst-message-body {
        flex-shrink: initial;
      }

      .bst-message-entry {
        display:block;
        position: relative;
        margin-left: var(--bst-message-entry-ml);
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
      .bst-message-head-highlight{
        display: none;
        position: absolute;
        z-index: -1;
        background-color: var(--yt-live-chat-author-chip-owner-background-color);
        bottom: -0.4rem;
        left: -0.4rem;
        right: -0.4rem;
        top: -0.4rem;
        border-radius: var(--border-radius-medium);
      }
      .bst-message-entry[author-type="owner"] .bst-message-head-highlight{
        display: block;
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
        margin-left: calc(-1 * var(--bst-message-entry-ml) - 2px);
        --color-background-interactable-alpha-hover: var(--color-opac-w-4);
        --bst-highlight-color: var(--color-background-interactable-alpha-hover);
      }

      .bst-message-entry-line {
        position: relative;
        display: inline;
      }

      .bst-message-entry:hover .bst-message-entry-highlight{
        background-color: var(--bst-highlight-color);
      }


      .bst-message-body{
        flex-shrink: 0;
        display:inline;
        flex-direction:column;
        max-width:100%;
        vertical-align: baseline;
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
        transform:translate(-50%, -100%);
        margin-left: calc(-0.5 * var(--yt-live-chat-emoji-size));
        margin-top: -4px;

        white-space: nowrap;
        max-width: var(--yt-live-chat-tooltip-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
        z-index: 2;
      }
      bst-tooltip:empty{
        display: none;
      }


      .bst-message-entry[author-type="member"] .bst-message-name-color{
        color: var(--yt-live-chat-sponsor-color);
      }
      .bst-message-entry[author-type="moderator"] .bst-message-name-color{
        color: var(--yt-live-chat-moderator-color)
      }
      .bst-message-entry[author-type="owner"] .bst-message-name-color{
        color: var(--yt-live-chat-author-chip-owner-text-color);
      }


      .bst-message-entry .bst-message-name-color .bst-message-badge-yt-icon[icon-type="verified"] {
        color: var(--yt-live-chat-verified-color,#999);
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
          font-size: 14px
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

      .bst-message-entry.bst-viewer-engagement-message {
        margin-left: 0;
      }
      .bst-system-message-yt-icon{
        display:inline-block;
      }

      .bst-viewer-engagement-message yt-icon {
        width: var(--iron-icon-width,24px);
        height: var(--iron-icon-height,24px);
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

      .bst-paid-message .bst-message-name-color.bst-message-username[class]{
        color: var(--yt-live-chat-disable-highlight-message-author-name-color,rgba(255,255,255,.7));
        font-size: 14px;
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

        color: var(--yt-live-chat-paid-message-header-color,#fff);
      }

      .bst-paid-message .bst-message-body{
        background-color: var(--yt-live-chat-paid-message-background-color,#1565c0);
        color: var(--yt-live-chat-paid-message-color,#fff);
      }

      .bst-membership-message[class]{

        --yt-live-chat-sponsor-header-color: #0a8043;
        --yt-live-chat-sponsor-color: #0f9d58;
        --yt-live-chat-sponsor-text-color: #fff;
        --yt-live-chat-item-timestamp-display: var( --yt-live-chat-paid-message-timestamp-display,none );
        --yt-live-chat-moderator-color: var(--yt-spec-static-overlay-text-secondary);
        --yt-live-chat-footer-button-text-color: #030303;
        --yt-live-chat-footer-button-text-background-color: #fff;
      }



      .bst-membership-message .bst-message-entry-highlight[class]{

        /*

        background-color: var(--yt-live-chat-sponsor-header-color);
        */
        --bst-highlight-color: var(--yt-live-chat-sponsor-color);
        background-color: var(--bst-highlight-color);
      }

      .bst-membership-message .bst-message-body{

        margin-left: 8px;
        color: rgba(255,255,255,.7);
        /*
        font-weight: 500;
        font-size: 15px;
        */
      }


      .bst-membership-message .bst-message-username[class]{
        color: #fff;
      }


      .bst-gift-message .bst-message-body{
        color: var(--yt-live-chat-secondary-text-color);
        font-style: italic;
        margin-left: 2px;
      }



    
    `
  }

  /** @type {import('../src/html.js').SolidJS}.SolidJS */
  const { createSignal, onMount, createStore, html, render, Switch, Match, For, createEffect, createMemo, Show, onCleanup } = SolidJS;



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
    a = Number(a);
    return "rgba(" + [a >> 16 & 255, a >> 8 & 255, a & 255, ((a >> 24 & 255) / 255).toFixed(5)].join() + ")"
  }

  const formatters = {
    authorBadges(badge, data) {


        try {
          const fk = firstKey(badge) || '';
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
                  el.setAttribute('icon-type', type);
                  el.setAttribute('shared-tooltip-text', tooltipText());
                }
                return html`<yt-icon id="${() => badgeElementId}" class="bst-message-badge-yt-icon" ref="${onYtIconCreated}"></yt-icon><bst-tooltip>${displayedTooltipText}</bst-tooltip>`

              } else {
                return '';
              }


            }


          } else if (ek.customThumbnail) {

            const className = `style-scope yt-live-chat-author-badge-renderer bst-author-badge`
            const src = () => getThumbnail(ek.customThumbnail.thumbnails, 32, 64); // 16, 32
            const alt = () => ek.accessibility?.accessibiltyData?.label || '';
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
    messageBody(message, data){
      if (typeof message === 'string') return html`<span>${() => message}</span>`
      if (typeof message.text === 'string') return html`<span>${() => message.text}</span>`

      if (typeof message.emoji !== 'undefined') {

        try {
          const emoji = message.emoji;

          const className = `small-emoji emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer`
          const src = () => `${emoji.image.thumbnails[0].url}`
          const alt = () => emoji.image?.accessibility?.accessibiltyData?.label || '';
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

  const SolidMessageList = (sb) => {

    return html`
      <${For} each=(${sb})>${
        (item) => {
          onCleanup(()=>{
            removeEntry(item)
          });
          
          switch (item.aKey) {
            case 'liveChatViewerEngagementMessageRenderer':
              return SolidSystemMessage(item)
            case 'liveChatPaidMessageRenderer':
              return SolidPaidMessage(item)

            case 'liveChatMembershipItemRenderer':
              return SolidMembershipMessage(item)

            case 'liveChatSponsorshipsGiftRedemptionAnnouncementRenderer':

              return SolidGiftText(item)
            default:
              return SolidMessageText(item)
          }

        }
      }<//>
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
        el.setAttribute('icon-type', type);
      }
      p = () => html`<div class="bst-system-message-icon-column"><yt-icon class="bst-system-message-yt-icon" ref="${onYtIconCreated}"></yt-icon></div>`


    }
    return html`
  <div class="bst-message-entry bst-viewer-engagement-message" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <${Show} when=(${() => !!data.icon})>${() => {
        return p();
    }}<//>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
        return formatters.messageBody(message, data)
    }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>`

  }


  const SolidPaidMessage = (data) => {

    // const {authorNameTextColor, bodyBackgroundColor, bodyTextColor, headerBackgroundColor, headerTextColor, textInputBackgroundColor,timestampColor} = data;


    return html`
  <div class="${() => `bst-message-entry bst-paid-message`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
    <div class="bst-message-head-highlight"></div>  
    <div class="bst-message-time"></div>
      <div class="bst-message-username bst-message-name-color">${() => data.bst('getUsername')}</div>
      <div class="bst-message-badges bst-message-name-color">
      <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
      </div>
      <div class="bst-paid-amount">${() => convertYTtext(data.purchaseAmountText)}</div>
    </div>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
      return formatters.messageBody(message, data);
    }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
`;
  };

  const SolidMembershipMessage = (data) => {
    return html`
  <div class="${() => `bst-message-entry bst-membership-message`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
    <div class="bst-message-head-highlight"></div>  
    <div class="bst-message-time"></div>
      <div class="bst-message-username bst-message-name-color">${() => data.bst('getUsername')}</div>
      <div class="bst-message-badges bst-message-name-color">
      <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
      </div>
    </div>
    <div class="bst-message-body">${() => {
        return convertYTtext(data.headerSubtext)
    }}</div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
`;
  };



  const SolidGiftText = (data) => {
    return html`
  <div class="${() => `bst-message-entry bst-gift-message`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
    <div class="bst-message-head-highlight"></div>  
    <div class="bst-message-time"></div>
      <div class="bst-message-username bst-message-name-color">${() => data.bst('getUsername')}</div>
      <div class="bst-message-badges bst-message-name-color">
      <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
      </div>
    </div>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
      return formatters.messageBody(message, data);
    }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
`;
  };


  const SolidMessageText = (data) => {
    return html`
  <div class="${() => `bst-message-entry bst-${data.aKey}`}" message-uid="${() => data.uid}" message-id="${() => data.id}" ref="${mutableWM.get(data).setupFn}" author-type="${() => data.bst('authorType')}">
  <span class="bst-message-profile-holder"><a class="bst-message-profile-anchor"><img class="bst-profile-img" src="${() => data.getProfilePic(64, -1)}" /></a></span>
  <div class="bst-message-entry-highlight"></div>
  <div class="bst-message-entry-line">
    <div class="bst-message-head">
    <div class="bst-message-head-highlight"></div>  
    <div class="bst-message-time"></div>
      <div class="bst-message-username bst-message-name-color">${() => data.bst('getUsername')}</div>
      <div class="bst-message-badges bst-message-name-color">
      <${For} each=(${() => data.bst('authorBadges')})>${(badge) => {

        return formatters.authorBadges(badge, data);

      }}<//>
      </div>
      <span class="bst-message-head-colon" aria-hidden="true"></span>
    </div>
    <div class="bst-message-body">
    <${For} each=(${() => data.bst('messages')})>${(message) => {
      return formatters.messageBody(message, data);
    }}<//>
    </div>
  </div>
  <div class="bst-message-menu-container">
  </div>
  </div>
`;
  };



  /**
   * 
   * test links
   * 
   * 
   * moderator
   * https://www.youtube.com/watch?v=1-D4z79ZUV4
   * 
   */


  function convertYTtext(authorName) {

    if (typeof (authorName || 0) !== 'object') return null;
    if (authorName.simpleText) return authorName.simpleText

    const runs = authorName.runs;
    if (runs && runs.length === 1) {
      let r = runs[0];
      return typeof r === 'string' ? r : typeof (r || 0).text === 'string' ? r.text : null;
    } else if (runs && runs.length >= 0) {
      return runs.map(r => (typeof r === 'string' ? r : typeof (r || 0).text === 'string' ? r.text : null)).join('');
    }
    return null;
  }

  whenCEDefined('yt-live-chat-item-list-renderer').then(() => {
    let dummy;
    let cProto;
    dummy = document.createElement('yt-live-chat-item-list-renderer');
    if (!(dummy instanceof Element)) return;
    cProto = insp(dummy).constructor.prototype;
    cProto.connectedCallback882 = cProto.connectedCallback;

    /** @type {HTMLElement} */
    let messageList;
    /** @type {HTMLElement} */
    let messageOverflowAnchor;
    let setAtBottomFn;
    let lockAtBottom = 0;
    const qq = new WeakMap();
    let _flushed = 0;

    const $ = {
      $: '$'
    };

    cProto.computeIsEmpty_ = function () {
      return !(this.visibleItems?.length || 0);
    }
    cProto.setupBoostChat = function () {
      let targetElement = (this.$.items || this.$['item-offset']);
      if (!targetElement) return;
      // if(!this.visibleItems__) this.visibleItems__ = [];

      // this.visibleItemsCount = 0;
      targetElement = targetElement.closest('#item-offset.yt-live-chat-item-list-renderer') || targetElement;
      const bstMain = document.createElement('div');
      const hostElement = this.hostElement;
      replaceWith.call(targetElement, bstMain);

      qq.set(hostElement, bstMain.attachShadow({ mode: "open" }));
      const shadow = qq.get(hostElement);
      bstMain.classList.add('bst-yt-main');
      bstMain.addEventListener('scroll', (a) => {
        this.onScrollItems_(a);
      }, false)


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

      //  const mm = shadow.appendChild(document.createElement('div'))

      //  const [solidBuild, solidBuildSet] = createStore({
      //   list: []
      //  }, { equals: false });
      const [solidBuild, solidBuildSet] = createSignal([], { equals: false });

      messageList.solidBuild = solidBuild;
      messageList.solidBuildSet = solidBuildSet;

      const isListEmpty = createMemo(() => solidBuild().length < 1);
      createEffect(() => {
        const cEmpty = isListEmpty();
        const change = (cEmpty) ^ (!!this.isEmpty);
        if (change) {
          this._setPendingProperty('isEmpty', cEmpty, !0) && this._invalidateProperties()
        }
      });

      render(SolidMessageList.bind(null, solidBuild), messageList);


      messageOverflowAnchor = document.createElement('div');
      messageOverflowAnchor.className = 'bst-overflow-anchor'
      shadow.appendChild(messageOverflowAnchor)


      const iooa = new IntersectionObserver((entries) => {

        if (_flushed) {
          anchorVisible = entries[entries.length - 1].isIntersecting === true; // avoid initial check (not yet flushed)
        }

        Promise.resolve().then(() => {
          if (!anchorVisible) {
            this.setAtBottomFalse();
          } else {
            this.setAtBottomTrue();
          }
        });

      });
      iooa.observe(messageOverflowAnchor);


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

      }, true)


      const attributeFn = () => {
        if (!messageList) return;
        let isDark = document.documentElement.hasAttribute('dark')
        if (isDark) messageList.setAttribute('dark', '');
        else messageList.removeAttribute('dark');
      };
      (new MutationObserver(attributeFn)).observe(document.documentElement, { attributes: true });
      attributeFn();



    }

    // const
    // shadow.appendChild(document.createElement('div')).className = 'bst-message-entry';








    function getProfilePic(min, max) {
      let authorPhoto = this.authorPhoto || 0;
      authorPhoto = authorPhoto.thumbnails || authorPhoto;
      if (authorPhoto) {

        if (authorPhoto.url) return authorPhoto.url;
        if (typeof authorPhoto === 'string') return authorPhoto;
        if (authorPhoto.length >= 0) {
          const url = getThumbnail(authorPhoto, min, max);
          if (url) return url;
        }
      }
      return null;
    }


    function bst(prop) {

      if (prop === 'getUsername') {

        const authorName = this.authorName;
        return convertYTtext(authorName);

      } else if (prop === 'messages') {


        const message = this.message;
        if (typeof (message || 0) !== 'object') return [];
        if (message.simpleText) return [message.simpleText]

        const runs = message.runs;
        return runs || [];

      } else if (prop === 'authorBadges') {


        const badges = this.authorBadges;
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

    cProto.setAtBottom = (...args) => {

      console.log('setAtBottom', 583, ...args)

    }

    const scrollToEnd = () => messageList && messageList.scrollIntoView({ block: "end", behavior: "instant" });

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
      let i;
      i = 0;
      for (const t of this.visibleItems) {
        a.call(this, "visibleItems", t, i++)
      }
      i = 0;
      for (const t of this.activeItems_) {
        a.call(this, "activeItems_", t, i++);
      }
    }

    cProto.computeVisibleItems17 = cProto.computeVisibleItems;
    cProto.computeVisibleItems = function (a, b) {

      console.log('computeVisibleItems', 791, a, b)
      // if(!this.visibleItems__) this.visibleItems__ = [];
      // return this.visibleItems__;
      return this.computeVisibleItems17(a, b);

    }

    cProto.handleAddChatItemAction_ = function (a) {
      let b = this
        , c = a.item
        , fk = (firstKey(c) || '');
      let e = c[fk]
        , toAddNewItem = false;

      this.forEachItem_(function (tag, p, idx) {
        const aObj = p[fk];
        if (aObj) {
          if (aObj.id !== a.clientId && aObj.id !== e.id) {
          } else if ("visibleItems" === tag) {
            const uid = aObj.uid;
            uid && flushPE(async () => {
              if (!messageList) return;
              let idx = -1;
              const list = messageList.solidBuild();
              const filtered = list.filter((bObj, j) => {
                if (bObj.uid === uid) {
                  idx = j;
                  return true;
                }
                return false;
              });

              if (filtered && filtered.length === 1 && idx >= 0 && list[idx]?.uid === b.visibleItems[idx]?.[idx]?.uid) {
                const bObj = list[idx];
                const dataMutable = mutableWM.get(bObj);
                if (dataMutable && typeof dataMutable.bObjChange === 'function') {
                  b.visibleItems[idx] = c;
                  dataMutable.bObjChange(e);
                }
              }
              await Promise.resolve();
            });
          } else { // activeItems_
            b.activeItems_[idx] = c;
            toAddNewItem = true;
          }
        }
      });
      const d = this.get("stickinessParams.dockAtTopDurationMs", a) || 0;
      if (d) {
        const k = messageList ? messageList.querySelector(`[message-id="${e.id}"]`) : null;
        k ? this.maybeAddDockableMessage_(k) : this.itemIdToDockDurationMap[e.id] = d
      }
      toAddNewItem || this.activeItems_.push(c);
    }

    cProto.handleLiveChatActions_ = function (a) {
      if (a.length) {
        for (const t of a) {
          this.handleLiveChatAction_(t);
        }
        // this.maybeResizeScrollContainer_(a);
        this.flushActiveItems_();
        // kw(function() {
        // b.maybeScrollToBottom_()
        // });
      }
    }

    cProto.clearList = function () {
      if (!this.clearCount) this.clearCount = 1;
      this.clearCount++;
      if (this.clearCount > 1e9) this.clearCount = 9;
      if (this.activeItems_) this.activeItems_.length = 0;
      flushKeys.clear();
      if (this.visibleItems && (this.visibleItems.length >0)) {
        this.visibleItems.length = 0;
        if (messageList) {
          messageList.solidBuildSet(a => ( (a.length = 0), a));
        }
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
      this.maybeResizeScrollContainer_([]);
      this.items.style.transform = "";
      this.atBottom || this.scrollToBottom_()
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

    cProto.scrollToBottom_ = function () {
      // console.log(1882)
      flushPE(async () => {

        await scrollToEnd();

        this.setAtBottomTrue();
      })

      // this.itemScroller.scrollTop = Math.pow(2, 24);
      // this.atBottom = !0
    }

    cProto.refreshOffsetContainerHeight_ = function (...args) {

      console.log('refreshOffsetContainerHeight_', 583, ...args)

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

    // const isOverflowAnchorSupported = CSS.supports("overflow-anchor", "auto") && CSS.supports("overflow-anchor", "none");
    cProto.flushActiveItems37_ = cProto.flushActiveItems_;
    cProto.flushActiveItems_ = function () {
      const items = (this.$ || 0).items;
      const hostElement = this.hostElement;
      if (!(items instanceof Element)) return;
      if (!qq.has(hostElement)) {
        this.setupBoostChat();
        const thisData = this.data;
        if (thisData.maxItemsToDisplay > 0) thisData.maxItemsToDisplay = MAX_ITEMS_FOR_TOTAL_DISPLAY;
      }

      if (!messageList) return;

      // if(this.hostElement.querySelectorAll('*').length > 40) return;
      flushPE(async () => {
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
          if(_addLen > maxItemsToDisplay){
            if (this.visibleItems && (this.visibleItems.length >0) ) {
              this.visibleItems.length = 0;
              if (messageList) {
                messageList.solidBuildSet(a => ((a.length = 0), a));
              }
            }
            activeItems_.splice(0, _addLen - maxItemsToDisplay);
          }
          
        }

        const addLen = activeItems_.length;

        const lastVisibleItemCount = this.visibleItems.length
        let removeCount = lastVisibleItemCount + addLen - maxItemsToDisplay;
        if (removeCount < 0) removeCount = 0;

        _flushed = 1;
        const items = activeItems_.slice(0);




        //  console.log(9192, 299, items);
        // activeItems_.length = 0;
        const crCount = this.clearCount;
        // const pEmpty = this.isEmpty;

        const appendStates = new Map();

        let [mountedCounter, mountedCounterSet]= createSignal(0);

        const rearranged = items.map(flushItem => {


          const aKey = firstKey(flushItem);
          const aObj = flushItem[aKey];
          // console.log(9192, aKey,aObj);

          const uid = `${aObj.authorExternalChannelId}:${aObj.timestampUsec}`;
          if (flushKeys.has(uid)) {
            appendStates.set(flushItem, 1);
            return null;
          }
          flushKeys.add(uid);
          aObj.uid = uid;
          aObj.aKey = aKey;
          aObj.getProfilePic = getProfilePic;
          aObj.bst = bst;



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
              bObjSet(val);
            },
            setupFn(_messageEntry) {

              // console.log(1299, _messageEntry)

              /** @type {HTMLElement} */
              const messageEntry = _messageEntry;
              mutableWM.set(messageEntry, mutable);
              const bObjChange = this.bObjChange;
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

              !!(messageEntry.classList.contains('bst-paid-message')) && (() => {
                const a = bObj;
                const entries = Object.entries({

                  "--yt-live-chat-paid-message-primary-color": colorFromDecimal(a.bodyBackgroundColor),
                  "--yt-live-chat-paid-message-secondary-color": colorFromDecimal(a.headerBackgroundColor),
                  "--yt-live-chat-paid-message-header-color": colorFromDecimal(a.headerTextColor),
                  "--yt-live-chat-paid-message-timestamp-color": colorFromDecimal(a.timestampColor),
                  "--yt-live-chat-paid-message-color": colorFromDecimal(a.bodyTextColor),
                  "--yt-live-chat-disable-highlight-message-author-name-color": colorFromDecimal(a.authorNameTextColor),
                  "--yt-live-chat-text-input-background-color": colorFromDecimal(a.textInputBackgroundColor)
                });
                for (const [key, value] of entries) {
                  messageEntry.style.setProperty(key, value);
                }

              })();


              createdPromise.resolve(messageEntry);
              mountedCounterSet(a=>a+1);


            }
          }
          mutableWM.set(bObj, mutable);

          
          appendStates.set(flushItem, 2);

          return bObj;

        }).filter(e => !!e);

        if (crCount !== this.clearCount) return;
        if (this.isAttached !== true) return;

        const visibleItems = this.visibleItems;

        const isAtBottom = this.atBottom === true;

        if(!RENDER_MESSAGES_ONE_BY_ONE && rearranged.length > 1){

          let t1 = performance.now();

          let isCreated = false;
          const renderedPromise=new PromiseExternal();
          createEffect(() => {
            const count = mountedCounter()
            // console.log('count', count, isCreated);
            if (count === rearranged.length) renderedPromise.resolve();
          });
  
          messageList.solidBuildSet(list => {
            const shouldRemove = removeCount > 0 && lastVisibleItemCount === visibleItems.length && lastVisibleItemCount === list.length
            shouldRemove && visibleItems.splice(0, removeCount);
            shouldRemove && list.splice(0, removeCount);
            list.push.apply(list, rearranged);
            return list;
          });
   
          await Promise.all(rearranged.map(e => (mutableWM.get(e)?.createdPromise || 0)));
          isCreated = true;
  
          await renderedPromise.then();

          if (isAtBottom) {
            scrollToEnd();
          }

          mountedCounter = null;
          mountedCounterSet = null;


          let t2 = performance.now();
          if(rearranged.length > 20) console.log(`one-by-one = false <${rearranged.length}>`, t2-t1);


        } else {

          let t1 = performance.now();
          let _lastVisibleItemCount = lastVisibleItemCount;
          let targetCount = -1;
          let renderedPromise = null;

          createEffect(() => {
            const count = mountedCounter()
            // console.log('count', count, isCreated);
            if (count === targetCount) renderedPromise.resolve();
          });

          for(let j = 0; j< rearranged.length; j++){

            renderedPromise=new PromiseExternal();
            targetCount = j+1;

            let lastScrollTop = -1;
            if (scrollEveryRound===null && isAtBottom && messageList) {
              lastScrollTop = messageList.scrollTop;
            }
            

            messageList.solidBuildSet(list => {
              const shouldRemove = removeCount > 0 && _lastVisibleItemCount === visibleItems.length && _lastVisibleItemCount === list.length
              if (shouldRemove) {
                visibleItems.shift();
                list.shift();
                removeCount--;
                _lastVisibleItemCount--;
              }
              list.push(rearranged[j])
              return list;
            });

            await renderedPromise.then();

            if (scrollEveryRound === null && isAtBottom && messageList && messageList.scrollTop === lastScrollTop) {
              scrollToEnd();
              if (messageList.scrollTop !== lastScrollTop) {
                console.log('scrollEveryRound = true')
                scrollEveryRound = true;
              }
            } else {

              if (isAtBottom && scrollEveryRound) {
                scrollToEnd();
              }
            }

            if (isAtBottom && scrollEveryRound === null) scrollEveryRound = false;

          }
          if (isAtBottom && !scrollEveryRound) {
            scrollToEnd();
          }
          targetCount = -1;
          renderedPromise = null;

          mountedCounter = null;
          mountedCounterSet = null;

          let t2 = performance.now();
          if(rearranged.length > 20) console.log(`one-by-one = true <${rearranged.length}>`, t2-t1);

        }



        let jx = visibleItems.length;
        visibleItems.length = jx + rearranged.length;

        if (appendStates.size > 0) {
          let c1 = 0;
          let c2 = 0;
          for (const item of activeItems_) {
            const status = appendStates.get(item) || 0;
            if (!status) break;
            activeItems_[c1++] = null;
            if (status === 2) {
              visibleItems[jx + c2] = item;
              c2++
            }
          }
          c2 !== rearranged.length && (visibleItems.length = jx + c2);
          c1 > 0 && activeItems_.splice(0, c1);
          appendStates.clear();
        }



        // const tn2 = performance.now();

        // console.log('tn', tn2-tn1);



      });


    }


  });

})();
