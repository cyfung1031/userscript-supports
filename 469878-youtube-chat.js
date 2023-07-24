// ==UserScript==
// @name                YouTube Super Fast Chat
// @version             0.11.1
// @license             MIT
// @name:ja             YouTube スーパーファーストチャット
// @name:zh-TW          YouTube 超快聊天
// @name:zh-CN          YouTube 超快聊天
// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/super-fast-chat.png
// @namespace           UserScript
// @match               https://www.youtube.com/live_chat*
// @author              CY Fung
// @require             https://greasyfork.org/scripts/465819-api-for-customelements-in-youtube/code/API%20for%20CustomElements%20in%20YouTube.js?version=1215280
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
//
// @description         Ultimate Performance Boost for YouTube Live Chats
// @description:ja      YouTubeのライブチャットの究極のパフォーマンスブースト
// @description:zh-TW   YouTube直播聊天的終極性能提升
// @description:zh-CN   YouTube直播聊天的终极性能提升
//
// ==/UserScript==

((__CONTEXT__) => {
  'use strict';

  const ENABLE_REDUCED_MAXITEMS_FOR_FLUSH = true;
  const MAX_ITEMS_FOR_TOTAL_DISPLAY = 90;
  const MAX_ITEMS_FOR_FULL_FLUSH = 25;

  const ENABLE_NO_SMOOTH_TRANSFORM = true;
  const USE_OPTIMIZED_ON_SCROLL_ITEMS = true;
  const USE_WILL_CHANGE_CONTROLLER = false;
  const ENABLE_FULL_RENDER_REQUIRED_PREFERRED = true;
  const ENABLE_OVERFLOW_ANCHOR_PREFERRED = true;

  const FIX_SHOW_MORE_BUTTON_LOCATION = true;
  const FIX_INPUT_PANEL_OVERFLOW_ISSUE = true;
  const FIX_INPUT_PANEL_BORDER_ISSUE = true;
  const SET_CONTAIN_FOR_CHATROOM = true;

  const FORCE_CONTENT_VISIBILITY_UNSET = true;
  const FORCE_WILL_CHANGE_UNSET = true;

  const ENABLE_RAF_HACK_TICKERS = true; // when there is a ticker
  const ENABLE_RAF_HACK_DOCKED_MESSAGE = true; // TBC
  const ENABLE_RAF_HACK_INPUT_RENDERER = true; // TBC
  const ENABLE_RAF_HACK_EMOJI_PICKER = true; // when change the page of emoji picker

  function dr(s) {
    // reserved for future use
    return s;
    // return window.deWeakJS ? window.deWeakJS(s) : s;
  }

  // necessity of cssText3_smooth_transform_position to be checked.
  const cssText3_smooth_transform_position = ENABLE_NO_SMOOTH_TRANSFORM ? `

    #item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer {
        position: static !important;
    }

  `: '';

  // fallback if dummy style fn fails
  const cssText4_smooth_transform_forced_props = ENABLE_NO_SMOOTH_TRANSFORM ? `

    /* optional */
    #item-offset.style-scope.yt-live-chat-item-list-renderer {
        height: auto !important;
        min-height: unset !important;
    }

    #items.style-scope.yt-live-chat-item-list-renderer {
        transform: translateY(0px) !important;
    }

    /* optional */

  `: '';

  const cssText5 = SET_CONTAIN_FOR_CHATROOM ? `

    /* ------------------------------------------------------------------------------------------------------------- */

    yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image img {
        contain: layout style;
    }

    #items.style-scope.yt-live-chat-item-list-renderer {
        contain: layout paint style;
    }

    #item-offset.style-scope.yt-live-chat-item-list-renderer {
        contain: style;
    }

    #item-scroller.style-scope.yt-live-chat-item-list-renderer {
        contain: size style;
    }

    #contents.style-scope.yt-live-chat-item-list-renderer, #chat.style-scope.yt-live-chat-renderer, img.style-scope.yt-img-shadow[width][height] {
        contain: size layout paint style;
    }

    .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label], .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label] > #container {
        contain: layout paint style;
    }

    yt-live-chat-text-message-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-membership-item-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-paid-message-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-banner-manager.style-scope.yt-live-chat-item-list-renderer {
        contain: layout style;
    }

    tp-yt-paper-tooltip[style*="inset"][role="tooltip"] {
        contain: layout paint style;
    }

    /* ------------------------------------------------------------------------------------------------------------- */

  ` : '';

  const cssText6b_show_more_button = FIX_SHOW_MORE_BUTTON_LOCATION ? `

    yt-live-chat-renderer[has-action-panel-renderer] #show-more.yt-live-chat-item-list-renderer{
        top: 4px;
        transition-property: top;
        bottom: unset;
    }

    yt-live-chat-renderer[has-action-panel-renderer] #show-more.yt-live-chat-item-list-renderer[disabled]{
        top: -42px;
    }

  `: '';

  const cssText6c_input_panel_overflow = FIX_INPUT_PANEL_OVERFLOW_ISSUE ? `

    #input-panel #picker-buttons yt-live-chat-icon-toggle-button-renderer#product-picker {
        contain: layout style;
    }

    #chat.yt-live-chat-renderer ~ #panel-pages.yt-live-chat-renderer {
        overflow: visible;
    }

  `: '';

  const cssText6d_input_panel_border = FIX_INPUT_PANEL_BORDER_ISSUE ? `

    html #panel-pages.yt-live-chat-renderer > #input-panel.yt-live-chat-renderer:not(:empty) {
        --yt-live-chat-action-panel-top-border: none;
    }

    html #panel-pages.yt-live-chat-renderer > #input-panel.yt-live-chat-renderer.iron-selected > *:first-child {
        border-top: 1px solid var(--yt-live-chat-panel-pages-border-color);
    }

    html #panel-pages.yt-live-chat-renderer {
        border-top: 0;
        border-bottom: 0;
    }

  `: '';

  const cssText7b_content_visibility_unset = FORCE_CONTENT_VISIBILITY_UNSET ? `

    img,
    yt-img-shadow[height][width],
    yt-img-shadow {
        content-visibility: visible !important;
    }

  `  : '';

  const cssText7c_will_change_unset = FORCE_WILL_CHANGE_UNSET ? `

    /* remove YouTube constant will-change */
    /* constant value will slow down the performance; default auto */

    /* www-player.css */
    html .ytp-contextmenu,
    html .ytp-settings-menu {
        will-change: unset;
    }

    /* frequently matched elements */
    html .fill.yt-interaction,
    html .stroke.yt-interaction,
    html .yt-spec-touch-feedback-shape__fill,
    html .yt-spec-touch-feedback-shape__stroke {
        will-change: unset;
    }

    /* live_chat_polymer.js */
    /*
    html .toggle-button.tp-yt-paper-toggle-button,
    html #primaryProgress.tp-yt-paper-progress,
    html #secondaryProgress.tp-yt-paper-progress,
    html #onRadio.tp-yt-paper-radio-button,
    html .fill.yt-interaction,
    html .stroke.yt-interaction,
    html .yt-spec-touch-feedback-shape__fill,
    html .yt-spec-touch-feedback-shape__stroke {
        will-change: unset;
    }
    */

    /* desktop_polymer_enable_wil_icons.js */
    /* html .fill.yt-interaction,
    html .stroke.yt-interaction, */
    html tp-yt-app-header::before,
    html tp-yt-iron-list,
    html #items.tp-yt-iron-list > *,
    html #onRadio.tp-yt-paper-radio-button,
    html .toggle-button.tp-yt-paper-toggle-button,
    html ytd-thumbnail-overlay-toggle-button-renderer[use-expandable-tooltip] #label.ytd-thumbnail-overlay-toggle-button-renderer,
    html #items.ytd-post-multi-image-renderer,
    html #items.ytd-horizontal-card-list-renderer,
    html #items.yt-horizontal-list-renderer,
    html #left-arrow.yt-horizontal-list-renderer,
    html #right-arrow.yt-horizontal-list-renderer,
    html #items.ytd-video-description-infocards-section-renderer,
    html #items.ytd-video-description-music-section-renderer,
    html #chips.ytd-feed-filter-chip-bar-renderer,
    html #chips.yt-chip-cloud-renderer,
    html #items.ytd-merch-shelf-renderer,
    html #items.ytd-product-details-image-carousel-renderer,
    html ytd-video-preview,
    html #player-container.ytd-video-preview,
    html #primaryProgress.tp-yt-paper-progress,
    html #secondaryProgress.tp-yt-paper-progress,
    html ytd-miniplayer[enabled] /* ,
    html .yt-spec-touch-feedback-shape__fill,
    html .yt-spec-touch-feedback-shape__stroke */ {
        will-change: unset;
    }

    /* other */
    .ytp-videowall-still-info-content[class],
    .ytp-suggestion-image[class] {
        will-change: unset !important;
    }

  ` : '';


  function addCssElement() {
    let s = document.createElement('style');
    s.id = 'ewRvC';
    return s;
  }

  const addCss = () => document.head.appendChild(dr(addCssElement())).textContent = `

  @supports (contain: layout paint style) {

    ${cssText5}

  }

  @supports (color: var(--general)) {

    html {
        --yt-live-chat-item-list-renderer-padding: 0px 0px;
    }

    ${cssText3_smooth_transform_position}

    ${cssText7c_will_change_unset}

    ${cssText7b_content_visibility_unset}

    yt-live-chat-item-list-renderer:not([allow-scroll]) #item-scroller.yt-live-chat-item-list-renderer {
        overflow-y: scroll;
        padding-right: 0;
    }

    ${cssText4_smooth_transform_forced_props}

    yt-icon[icon="down_arrow"] > *, yt-icon-button#show-more > * {
        pointer-events: none !important;
    }

    #continuations, #continuations * {
        contain: strict;
        position: fixed;
        top: 2px;
        height: 1px;
        width: 2px;
        height: 1px;
        visibility: collapse;
    }

    ${cssText6b_show_more_button}

    ${cssText6d_input_panel_border}

    ${cssText6c_input_panel_overflow}

  }


  @supports (overflow-anchor: auto) {

    .no-anchor * {
        overflow-anchor: none;
    }
    .no-anchor > item-anchor {
        overflow-anchor: auto;
    }

    item-anchor {

        height:1px;
        width: 100%;
        transform: scaleY(0.00001);
        transform-origin:0 0;
        contain: strict;
        opacity:0;
        display:flex;
        position:relative;
        flex-shrink:0;
        flex-grow:0;
        margin-bottom:0;
        overflow:hidden;
        box-sizing:border-box;
        visibility: visible;
        content-visibility: visible;
        contain-intrinsic-size: auto 1px;
        pointer-events:none !important;

    }

    #item-scroller.style-scope.yt-live-chat-item-list-renderer[class] {
        overflow-anchor: initial !important; /* whenever ENABLE_OVERFLOW_ANCHOR or not */
    }

    html item-anchor {

        height: 1px;
        width: 1px;
        top: auto;
        left: auto;
        right: auto;
        bottom: auto;
        transform: translateY(-1px);
        position: absolute;
        z-index: -1;

    }

  }

  @supports (color: var(--pre-rendering)) {

    @keyframes dontRenderAnimation {
        0% {
            background-position-x: 3px;
        }
        100% {
            background-position-x: 4px;
        }
    }

    /*html[dont-render-enabled] */ .dont-render{

        visibility: collapse !important;
        transform: scale(0.01) !important;
        transform: scale(0.00001) !important;
        transform: scale(0.0000001) !important;
        transform-origin: 0 0 !important;
        z-index:-1 !important;
        contain: strict !important;
        box-sizing: border-box !important;

        height: 1px !important;
        height: 0.1px !important;
        height: 0.01px !important;
        height: 0.0001px !important;
        height: 0.000001px !important;

        animation: dontRenderAnimation 1ms linear 80ms 1 normal forwards !important;

    }

  }

  `;


  const { IntersectionObserver } = __CONTEXT__;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  if (!IntersectionObserver) return console.error("Your browser does not support IntersectionObserver.\nPlease upgrade to the latest version.")

  const assertor = (f) => f() || console.assert(false, f + "");

  const fnIntegrity = (f, d) => {
    if (!f || typeof f !== 'function') {
      console.warn('f is not a function', f);
      return;
    }
    let p = f + "", s = 0, j = -1, w = 0;
    for (let i = 0, l = p.length; i < l; i++) {
      const t = p[i];
      if (((t >= 'a' && t <= 'z') || (t >= 'A' && t <= 'Z'))) {
        if (j < i - 1) w++;
        j = i;
      } else {
        s++;
      }
    }
    let itz = `${f.length}.${s}.${w}`;
    if (!d) {
      console.log(itz);
      return null;
    } else {
      return itz === d;
    }
  }


  let ENABLE_FULL_RENDER_REQUIRED_CAPABLE = false;
  const isContainSupport = CSS.supports('contain', 'layout paint style');
  if (!isContainSupport) {
    console.warn("Your browser does not support css property 'contain'.\nPlease upgrade to the latest version.".trim());
  } else {

    ENABLE_FULL_RENDER_REQUIRED_CAPABLE = true; // mainly for Chromium-based browsers

  }



  let ENABLE_OVERFLOW_ANCHOR_CAPABLE = false;
  const isOverflowAnchorSupport = CSS.supports('overflow-anchor', 'auto');
  if (!isOverflowAnchorSupport) {
    console.warn("Your browser does not support css property 'overflow-anchor'.\nPlease upgrade to the latest version.".trim());
  } else {

    ENABLE_OVERFLOW_ANCHOR_CAPABLE = true; // mainly for Chromium-based browsers

  }


  const ENABLE_OVERFLOW_ANCHOR = ENABLE_OVERFLOW_ANCHOR_PREFERRED && ENABLE_OVERFLOW_ANCHOR_CAPABLE && ENABLE_NO_SMOOTH_TRANSFORM;

  const NOT_FIREFOX = !CSS.supports('-moz-appearance', 'none'); // 1. Firefox does not have the flicking issue; 2. Firefox's OVERFLOW_ANCHOR does not work very well as chromium.

  const ENABLE_FULL_RENDER_REQUIRED = ENABLE_FULL_RENDER_REQUIRED_PREFERRED && ENABLE_FULL_RENDER_REQUIRED_CAPABLE && ENABLE_OVERFLOW_ANCHOR && ENABLE_NO_SMOOTH_TRANSFORM && NOT_FIREFOX;


  const fxOperator = (proto, propertyName) => {
    let propertyDescriptorGetter = null;
    try {
      propertyDescriptorGetter = Object.getOwnPropertyDescriptor(proto, propertyName).get;
    } catch (e) { }
    return typeof propertyDescriptorGetter === 'function' ? (e) => {
      try {

        return propertyDescriptorGetter.call(dr(e));
      } catch (e) { }
      return e[propertyName];
    } : (e) => e[propertyName];
  };

  const nodeParent = fxOperator(Node.prototype, 'parentNode');
  // const nFirstElem = fxOperator(HTMLElement.prototype, 'firstElementChild');
  const nPrevElem = fxOperator(HTMLElement.prototype, 'previousElementSibling');
  const nNextElem = fxOperator(HTMLElement.prototype, 'nextElementSibling');
  const nLastElem = fxOperator(HTMLElement.prototype, 'lastElementChild');

  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'mchbwnoasqph';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1';
      /** @type {HTMLIFrameElement | null} */
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
      const { requestAnimationFrame, setTimeout, cancelAnimationFrame } = fc;
      const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  cleanContext(win).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;


    const { requestAnimationFrame, setTimeout, cancelAnimationFrame } = __CONTEXT__;



    class RAFHub {
      constructor() {
        /** @type {number} */
        this.startAt = 8170;
        /** @type {number} */
        this.counter = 0;
        /** @type {number} */
        this.rid = 0;
        /** @type {Map<number, FrameRequestCallback>} */
        this.funcs = new Map();
        const funcs = this.funcs;
        /** @type {FrameRequestCallback} */
        this.bCallback = this.mCallback.bind(this);
        this.pClear = () => funcs.clear();
      }
      /** @param {DOMHighResTimeStamp} highResTime */
      mCallback(highResTime) {
        this.rid = 0;
        Promise.resolve().then(this.pClear);
        this.funcs.forEach(func => Promise.resolve(highResTime).then(func).catch(console.warn));
      }
      /** @param {FrameRequestCallback} f */
      request(f) {
        if (this.counter > 1e9) this.counter = 9;
        let cid = this.startAt + (++this.counter);
        this.funcs.set(cid, f);
        if (this.rid === 0) this.rid = requestAnimationFrame(this.bCallback);
        return cid;
      }
      /** @param {number} cid */
      cancel(cid) {
        cid = +cid;
        if (cid > 0) {
          if (cid <= this.startAt) {
            return cancelAnimationFrame(cid);
          }
          if (this.rid > 0) {
            this.funcs.delete(cid);
            if (this.funcs.size === 0) {
              cancelAnimationFrame(this.rid);
              this.rid = 0;
            }
          }
        }
      }
    }


    const sp7 = Symbol();


    let dt0 = Date.now() - 2000;
    const dateNow = () => Date.now() - dt0;
    // let lastScroll = 0;
    // let lastLShow = 0;
    let lastWheel = 0;
    let lastMouseDown = 0;
    let lastMouseUp = 0;
    let currentMouseDown = false;
    let lastTouchDown = 0;
    let lastTouchUp = 0;
    let currentTouchDown = false;
    let lastUserInteraction = 0;

    let scrollChatFn = null;

    ENABLE_FULL_RENDER_REQUIRED && (() => {

      document.addEventListener('animationstart', (evt) => {

        if (evt.animationName === 'dontRenderAnimation') {
          evt.target.classList.remove('dont-render');
          if (scrollChatFn) scrollChatFn();
        }
  
      }, true);

      const f = (elm) => {
        if (elm && elm.nodeType === 1) {
          elm.classList.add('dont-render');
        }
      }

      Node.prototype.__appendChild931__ = function (a) {
        a = dr(a);
        if (this.id === 'items' && this.classList.contains('yt-live-chat-item-list-renderer')) {
          if (a && a.nodeType === 1) f(a);
          else if (a instanceof DocumentFragment) {
            for (let n = a.firstChild; n; n = n.nextSibling) {
              f(n);
            }
          }
        }
      }

      Node.prototype.__appendChild932__ = function () {
        this.__appendChild931__.apply(this, arguments);
        return Node.prototype.appendChild.apply(this, arguments);
      }


    })();

    const proxyHelperFn = (dummy) => ({

      get(target, prop) {
        return (prop in dummy) ? dummy[prop] : prop === sp7 ? target : target[prop];
      },
      set(target, prop, value) {
        if (!(prop in dummy)) {
          target[prop] = value;
        }
        return true;
      },
      has(target, prop) {
        return (prop in target);
      },
      deleteProperty(target, prop) {
        return true;
      },
      ownKeys(target) {
        return Object.keys(target);
      },
      defineProperty(target, key, descriptor) {
        return Object.defineProperty(target, key, descriptor);
      },
      getOwnPropertyDescriptor(target, key) {
        return Object.getOwnPropertyDescriptor(target, key);
      },

    });




    /* globals WeakRef:false */

    /** @type {(o: Object | null) => WeakRef | null} */
    const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

    /** @type {(wr: Object | null) => Object | null} */
    const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

    const watchUserCSS = () => {

      // if (!CSS.supports('contain-intrinsic-size', 'auto var(--wsr94)')) return;

      const getElemFromWR = (nr) => {
        const n = kRef(nr);
        if (n && n.isConnected) return n;
        return null;
      }

      const clearContentVisibilitySizing = () => {
        Promise.resolve().then(() => {

          let btnShowMoreWR = mWeakRef(document.querySelector('#show-more[disabled]'));

          let lastVisibleItemWR = null;
          for (const elm of document.querySelectorAll('[wSr93]')) {
            if (elm.getAttribute('wSr93') === 'visible') lastVisibleItemWR = mWeakRef(elm);
            elm.setAttribute('wSr93', '');
            // custom CSS property --wsr94 not working when attribute wSr93 removed
          }
          requestAnimationFrame(() => {
            const btnShowMore = getElemFromWR(btnShowMoreWR); btnShowMoreWR = null;
            if (btnShowMore) btnShowMore.click();
            else {
              // would not work if switch it frequently
              const lastVisibleItem = getElemFromWR(lastVisibleItemWR); lastVisibleItemWR = null;
              if (lastVisibleItem) {

                Promise.resolve()
                  .then(() => lastVisibleItem.scrollIntoView())
                  .then(() => lastVisibleItem.scrollIntoView(false))
                  .then(() => lastVisibleItem.scrollIntoView({ behavior: "instant", block: "end", inline: "nearest" }))
                  .catch(e => { }) // break the chain when method not callable

              }
            }
          });

        });

      }

      const mutObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if ((mutation.addedNodes || 0).length >= 1) {
            for (const addedNode of mutation.addedNodes) {
              if (addedNode.nodeName === 'STYLE') {
                clearContentVisibilitySizing();
                return;
              }
            }
          }
          if ((mutation.removedNodes || 0).length >= 1) {
            for (const removedNode of mutation.removedNodes) {
              if (removedNode.nodeName === 'STYLE') {
                clearContentVisibilitySizing();
                return;
              }
            }
          }
        }
      });

      mutObserver.observe(document.documentElement, {
        childList: true,
        subtree: false
      });
      mutObserver.observe(document.head, {
        childList: true,
        subtree: false
      });
      mutObserver.observe(document.body, {
        childList: true,
        subtree: false
      });

    }

    const setupStyle = (m1, m2) => {
      if (!ENABLE_NO_SMOOTH_TRANSFORM) return;

      const dummy1v = {
        transform: '',
        height: '',
        minHeight: '',
        paddingBottom: '',
        paddingTop: ''
      };

      const dummyStyleFn = (k) => (function () { const style = this[sp7]; return style[k](...arguments); });
      for (const k of ['toString', 'getPropertyPriority', 'getPropertyValue', 'item', 'removeProperty', 'setProperty']) {
        dummy1v[k] = dummyStyleFn(k);
      }

      const dummy1p = proxyHelperFn(dummy1v);
      const sp1v = new Proxy(m1.style, dummy1p);
      const sp2v = new Proxy(m2.style, dummy1p);
      Object.defineProperty(m1, 'style', { get() { return sp1v }, set() { }, enumerable: true, configurable: true });
      Object.defineProperty(m2, 'style', { get() { return sp2v }, set() { }, enumerable: true, configurable: true });
      m1.removeAttribute("style");
      m2.removeAttribute("style");

    }


    class WillChangeController {
      constructor(itemScroller, willChangeValue) {
        this.element = itemScroller;
        this.counter = 0;
        this.active = false;
        this.willChangeValue = willChangeValue;
      }

      beforeOper() {
        if (!this.active) {
          this.active = true;
          this.element.style.willChange = this.willChangeValue;
        }
        this.counter++;
      }

      afterOper() {
        const c = this.counter;
        requestAnimationFrame(() => {
          if (c === this.counter) {
            this.active = false;
            this.element.style.willChange = '';
          }
        });
      }

      release() {
        const element = this.element;
        this.element = null;
        this.counter = 1e16;
        this.active = false;
        try {
          element.style.willChange = '';
        } catch (e) { }
      }

    }




    const { lcRendererElm, visObserver } = (() => {



      let lcRendererWR = null;

      const lcRendererElm = () => {
        let lcRenderer = kRef(lcRendererWR);
        if (!lcRenderer || !lcRenderer.isConnected) {
          lcRenderer = document.querySelector('yt-live-chat-item-list-renderer.yt-live-chat-renderer');
          lcRendererWR = lcRenderer ? mWeakRef(lcRenderer) : null;
        }
        return lcRenderer;
      };


      let hasFirstShowMore = false;

      const visObserverFn = (entry) => {

        const target = entry.target;
        if (!target) return;
        // if(target.classList.contains('dont-render')) return;
        let isVisible = entry.isIntersecting === true && entry.intersectionRatio > 0.5;
        // const h = entry.boundingClientRect.height;
        /*
        if (h < 16) { // wrong: 8 (padding/margin); standard: 32; test: 16 or 20
            // e.g. under fullscreen. the element created but not rendered.
            target.setAttribute('wSr93', '');
            return;
        }
        */
        if (isVisible) {
          // target.style.setProperty('--wsr94', h + 'px');
          target.setAttribute('wSr93', 'visible');
          if (nNextElem(target) === null) {

            // firstVisibleItemDetected = true;
            /*
              if (dateNow() - lastScroll < 80) {
                  lastLShow = 0;
                  lastScroll = 0;
                  Promise.resolve().then(clickShowMore);
              } else {
                  lastLShow = dateNow();
              }
              */
            // lastLShow = dateNow();
          } else if (!hasFirstShowMore) { // should more than one item being visible
            // implement inside visObserver to ensure there is sufficient delay
            hasFirstShowMore = true;
            requestAnimationFrame(() => {
              // foreground page
              // page visibly ready -> load the latest comments at initial loading
              const lcRenderer = lcRendererElm();
              if (lcRenderer) {
                (lcRenderer.inst || lcRenderer).scrollToBottom_();
              }
            });
          }
        }
        else if (target.getAttribute('wSr93') === 'visible') { // ignore target.getAttribute('wSr93') === '' to avoid wrong sizing

          // target.style.setProperty('--wsr94', h + 'px');
          target.setAttribute('wSr93', 'hidden');
        } // note: might consider 0 < entry.intersectionRatio < 0.5 and target.getAttribute('wSr93') === '' <new last item>

      }



      const visObserver = new IntersectionObserver((entries) => {

        for (const entry of entries) {

          Promise.resolve(entry).then(visObserverFn);

        }

      }, {
        // root: HTMLElement.prototype.closest.call(m2, '#item-scroller.yt-live-chat-item-list-renderer'), // nullable
        rootMargin: "0px",
        threshold: [0.05, 0.95],
      });


      return { lcRendererElm, visObserver }


    })();

    const { setupMutObserver } = (() => {

      const mutFn = (items) => {
        for (let node = nLastElem(items); node !== null; node = nPrevElem(node)) {
          if (node.hasAttribute('wSr93')) break;
          node.setAttribute('wSr93', '');
          visObserver.observe(node);
        }
      }

      const mutObserver = new MutationObserver((mutations) => {
        const items = (mutations[0] || 0).target;
        if (!items) return;
        mutFn(items);
      });

      const setupMutObserver = (m2) => {
        scrollChatFn = null;
        mutObserver.disconnect();
        mutObserver.takeRecords();
        if (m2) {
          if (typeof m2.__appendChild932__ === 'function') {
            if (typeof m2.appendChild === 'function') m2.appendChild = m2.__appendChild932__;
            if (typeof m2.__shady_native_appendChild === 'function') m2.__shady_native_appendChild = m2.__appendChild932__;
          }
          mutObserver.observe(m2, {
            childList: true,
            subtree: false
          });
          mutFn(m2);


          if (ENABLE_OVERFLOW_ANCHOR) {

            let items = m2;
            let addedAnchor = false;
            if (items) {
              if (items.nextElementSibling === null) {
                items.classList.add('no-anchor');
                addedAnchor = true;
                items.parentNode.appendChild(dr(document.createElement('item-anchor')));
              }
            }



            if (addedAnchor) {
              nodeParent(m2).classList.add('no-anchor'); // required
            }

          }

          // let div = document.createElement('div');
          // div.id = 'qwcc';
          // HTMLElement.prototype.appendChild.call(document.querySelector('yt-live-chat-item-list-renderer'), div )
          // bufferRegion =div;

          // buffObserver.takeRecords();
          // buffObserver.disconnect();
          // buffObserver.observe(div,  {
          //     childList: true,
          //     subtree: false
          // })



        }
      }

      return { setupMutObserver };



    })();

    const setupEvents = () => {


      let scrollCount = 0;

      const passiveCapture = typeof IntersectionObserver === 'function' ? { capture: true, passive: true } : true;


      const delayFlushActiveItemsAfterUserActionK_ = () => {

        const lcRenderer = lcRendererElm();
        if (lcRenderer) {
          const cnt = (lcRenderer.inst || lcRenderer);
          if (!cnt.hasUserJustInteracted11_) return;
          if (cnt.atBottom && cnt.allowScroll && cnt.activeItems_.length >= 1 && cnt.hasUserJustInteracted11_()) {
            cnt.delayFlushActiveItemsAfterUserAction11_ && cnt.delayFlushActiveItemsAfterUserAction11_();
          }
        }

      }

      document.addEventListener('scroll', (evt) => {
        if (!evt || !evt.isTrusted) return;
        // lastScroll = dateNow();
        if (++scrollCount > 1e9) scrollCount = 9;
      }, passiveCapture); // support contain => support passive

      let lastScrollCount = -1;
      document.addEventListener('wheel', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (lastScrollCount === scrollCount) return;
        lastScrollCount = scrollCount;
        lastWheel = dateNow();
        delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
      }, passiveCapture); // support contain => support passive

      document.addEventListener('mousedown', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (((evt || 0).target || 0).id !== 'item-scroller') return;
        lastMouseDown = dateNow();
        currentMouseDown = true;
        lastUserInteraction = lastMouseDown;
      }, passiveCapture);

      document.addEventListener('pointerdown', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (((evt || 0).target || 0).id !== 'item-scroller') return;
        lastMouseDown = dateNow();
        currentMouseDown = true;
        lastUserInteraction = lastMouseDown;
      }, passiveCapture);

      document.addEventListener('click', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (((evt || 0).target || 0).id !== 'item-scroller') return;
        lastMouseDown = lastMouseUp = dateNow();
        currentMouseDown = false;
        lastUserInteraction = lastMouseDown;
        delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
      }, passiveCapture);

      document.addEventListener('tap', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (((evt || 0).target || 0).id !== 'item-scroller') return;
        lastMouseDown = lastMouseUp = dateNow();
        currentMouseDown = false;
        lastUserInteraction = lastMouseDown;
        delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
      }, passiveCapture);


      document.addEventListener('mouseup', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (currentMouseDown) {
          lastMouseUp = dateNow();
          currentMouseDown = false;
          lastUserInteraction = lastMouseUp;
          delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
        }
      }, passiveCapture);


      document.addEventListener('pointerup', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (currentMouseDown) {
          lastMouseUp = dateNow();
          currentMouseDown = false;
          lastUserInteraction = lastMouseUp;
          delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
        }
      }, passiveCapture);

      document.addEventListener('touchstart', (evt) => {
        if (!evt || !evt.isTrusted) return;
        lastTouchDown = dateNow();
        currentTouchDown = true;
        lastUserInteraction = lastTouchDown;
      }, passiveCapture);

      document.addEventListener('touchmove', (evt) => {
        if (!evt || !evt.isTrusted) return;
        lastTouchDown = dateNow();
        currentTouchDown = true;
        lastUserInteraction = lastTouchDown;
      }, passiveCapture);

      document.addEventListener('touchend', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (currentTouchDown) {
          lastTouchUp = dateNow();
          currentTouchDown = false;
          lastUserInteraction = lastTouchUp;
          delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
        }
      }, passiveCapture);

      document.addEventListener('touchcancel', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (currentTouchDown) {
          lastTouchUp = dateNow();
          currentTouchDown = false;
          lastUserInteraction = lastTouchUp;
          delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
        }
      }, passiveCapture);


    }



    const getProto = (element) => {
      if (element) {
        const cnt = element.inst || element;
        return cnt.constructor.prototype || null;
      }
      return null;
    }

    const rafHub = (ENABLE_RAF_HACK_TICKERS || ENABLE_RAF_HACK_DOCKED_MESSAGE || ENABLE_RAF_HACK_INPUT_RENDERER || ENABLE_RAF_HACK_EMOJI_PICKER) ? new RAFHub() : null;


    customYtElements.onRegistryReady(() => {




      customElements.whenDefined('yt-live-chat-item-list-renderer').then(() => {


        const tag = "yt-live-chat-item-list-renderer"
        const dummy = document.createElement(tag);


        const cProto = getProto(dummy);
        if (!cProto || !cProto.attached) {
          console.warn(`proto.attached for ${tag} is unavailable.`);
          return;
        }



        console.groupCollapsed("YouTube Super Fast Check - yt-live-chat-item-list-renderer hacks");

        const mclp = cProto;
        try {
          assertor(() => typeof mclp.scrollToBottom_ === 'function');
          assertor(() => typeof mclp.flushActiveItems_ === 'function');
          assertor(() => typeof mclp.canScrollToBottom_ === 'function');
          assertor(() => typeof mclp.setAtBottom === 'function');
          assertor(() => typeof mclp.scrollToBottom66_ === 'undefined');
          assertor(() => typeof mclp.flushActiveItems66_ === 'undefined');
        } catch (e) { }


        try {
          assertor(() => typeof mclp.attached === 'function');
          assertor(() => typeof mclp.detached === 'function');
          assertor(() => typeof mclp.canScrollToBottom_ === 'function');
          assertor(() => typeof mclp.isSmoothScrollEnabled_ === 'function');
          assertor(() => typeof mclp.maybeResizeScrollContainer_ === 'function');
          assertor(() => typeof mclp.refreshOffsetContainerHeight_ === 'function');
          assertor(() => typeof mclp.smoothScroll_ === 'function');
          assertor(() => typeof mclp.resetSmoothScroll_ === 'function');
        } catch (e) { }

        mclp.__intermediate_delay__ = null;

        let mzk = 0;
        let myk = 0;
        let mlf = 0;
        let myw = 0;
        let mzt = 0;
        let zarr = null;
        let mlg = 0;

        if ((mclp.clearList || 0).length === 0) {
          assertor(() => fnIntegrity(mclp.clearList, '0.106.50'));
          mclp.clearList66 = mclp.clearList;
          mclp.clearList = function () {
            mzk++;
            myk++;
            mlf++;
            myw++;
            mzt++;
            mlg++;
            zarr = null;
            this.__intermediate_delay__ = null;
            this.clearList66();
          };
          console.log("clearList", "OK");
        } else {
          console.log("clearList", "NG");
        }


        let onListRendererAttachedDone = false;

        function setList(itemOffset, items){

          const isFirstTime = onListRendererAttachedDone === false;

          if (isFirstTime) {
            onListRendererAttachedDone = true;
            Promise.resolve().then(watchUserCSS);
            addCss();
            setupEvents();
          }

          setupStyle(itemOffset, items);

          setupMutObserver(items);
        }

        mclp.attached419 = async function () {

          let maxTrial = 16;
          while (!this.$ || !this.$['item-scroller'] || !this.$['item-offset'] || !this.$['items']) {
            if (--maxTrial < 0) return;
            await new Promise(requestAnimationFrame);
          }


          if (!this.$) {
            console.warn("!this.$");
            return;
          }
          if (!this.$) return;
          /** @type {HTMLElement | null} */
          const itemScroller = this.$['item-scroller'];
          /** @type {HTMLElement | null} */
          const itemOffset = this.$['item-offset'];
          /** @type {HTMLElement | null} */
          const items = this.$['items'];

          if (!itemScroller || !itemOffset || !items) {
            console.warn("items.parentNode !== itemOffset");
            return;
          }

          if (nodeParent(items) !== itemOffset) {

            console.warn("items.parentNode !== itemOffset");
            return;
          }


          if (items.id !== 'items' || itemOffset.id !== "item-offset") {

            console.warn("id incorrect");
            return;
          }

          const isTargetItems = HTMLElement.prototype.matches.call(items, '#item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer')

          if(!isTargetItems){
            console.warn("!isTargetItems");
            return;
          }

          setList(itemOffset, items);

        }

        mclp.attached331 = mclp.attached;
        mclp.attached = function () {
          this.attached419 && this.attached419();
          return this.attached331();
        }

        mclp.detached331 = mclp.detached;

        mclp.detached = function () {
          setupMutObserver();
          return this.detached331();
        }

        let t31_items = document.querySelector('#item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer');
        let t31_itemOffset = t31_items ? nodeParent(t31_items) : null;

        if (t31_items && t31_itemOffset) {
          setList(t31_itemOffset, t31_items);
        }

        if ((mclp.async || 0).length === 2 && (mclp.cancelAsync || 0).length === 1) {

          assertor(() => fnIntegrity(mclp.async, '2.24.15'));
          assertor(() => fnIntegrity(mclp.cancelAsync, '1.15.8'));

          /** @type {Map<number, any>} */
          const aMap = new Map();
          let count = 6150;
          mclp.async66 = mclp.async;
          mclp.async = function (e, f) {
            // ensure the previous operation is done
            // .async is usually after the time consuming functions like flushActiveItems_ and scrollToBottom_
            const hasF = arguments.length === 2;
            const stack = new Error().stack;
            const isFlushAsync = stack.indexOf('flushActiveItems_') >= 0;
            if (count > 1e9) count = 6159;
            const resId = ++count;
            aMap.set(resId, e);
            (this.__intermediate_delay__ || Promise.resolve()).then(rk => {
              const rp = aMap.get(resId);
              if (typeof rp !== 'function') {
                return;
              }
              let cancelCall = false;
              if (isFlushAsync) {
                if (rk < 0) {
                  cancelCall = true;
                } else if (rk === 2 && arguments[0] === this.maybeScrollToBottom_) {
                  cancelCall = true;
                }
              }
              if (cancelCall) {
                aMap.delete(resId);
              } else {
                const asyncEn = function () {
                  aMap.delete(resId);
                  return rp.apply(this, arguments);
                };
                aMap.set(resId, hasF ? this.async66(asyncEn, f) : this.async66(asyncEn));
              }
            });

            return resId;
          }

          mclp.cancelAsync66 = mclp.cancelAsync66;
          mclp.cancelAsync = function (resId) {
            if (resId <= 6150) {
              this.cancelAsync66(resId);
            } else if (aMap.has(resId)) {
              const rp = aMap.get(resId);
              aMap.delete(resId);
              if (typeof rp !== 'function') {
                this.cancelAsync66(rp);
              }
            }
          }

          console.log("async", "OK");
        } else {
          console.log("async", "NG");
        }



        if ((mclp.showNewItems_ || 0).length === 0 && ENABLE_NO_SMOOTH_TRANSFORM) {

          assertor(() => fnIntegrity(mclp.showNewItems_, '0.170.79'));
          mclp.showNewItems66_ = mclp.showNewItems_;

          mclp.showNewItems77_ = async function () {
            if (myk > 1e9) myk = 9;
            let tid = ++myk;

            await new Promise(requestAnimationFrame);

            if (tid !== myk) {
              return;
            }

            const cnt = this;

            await Promise.resolve();
            cnt.showNewItems66_();

            await Promise.resolve();

          }

          mclp.showNewItems_ = function () {

            const cnt = this;
            cnt.__intermediate_delay__ = new Promise(resolve => {
              cnt.showNewItems77_().then(() => {
                resolve();
              });
            });
          }

          console.log("showNewItems_", "OK");
        } else {
          console.log("showNewItems_", "NG");
        }




        if ((mclp.flushActiveItems_ || 0).length === 0) {

          assertor(() => fnIntegrity(mclp.flushActiveItems_, '0.137.81'));

          let contensWillChangeController = null;

          mclp.flushActiveItems66_ = mclp.flushActiveItems_;

          mclp.flushActiveItems77_ = async function () {
            try {

              const cnt = this;
              if (mlf > 1e9) mlf = 9;
              let tid = ++mlf;
              if (tid !== mlf || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
              if (!cnt.activeItems_ || cnt.activeItems_.length === 0) return;

              // 4 times to maxItems to avoid frequent trimming.
              // 1 ... 10 ... 20 ... 30 ... 40 ... 50 ... 60 => 16 ... 20 ... 30 ..... 60 ... => 16

              this.activeItems_.length > this.data.maxItemsToDisplay * 4 && this.data.maxItemsToDisplay > 4 && this.activeItems_.splice(0, this.activeItems_.length - this.data.maxItemsToDisplay - 1);
              if (cnt.canScrollToBottom_()) {
                let immd = cnt.__intermediate_delay__;
                await new Promise(requestAnimationFrame);
                if (tid !== mlf || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                if (!cnt.activeItems_ || cnt.activeItems_.length === 0) return;

                mlf++;
                if (mlg > 1e9) mlg = 9;
                ++mlg;

                const oMaxItemsToDisplay = this.data.maxItemsToDisplay;
                const reducedMaxItemsToDisplay = MAX_ITEMS_FOR_FULL_FLUSH;
                let changeMaxItemsToDisplay = false;
                if (ENABLE_REDUCED_MAXITEMS_FOR_FLUSH && this.activeItems_.length > this.data.maxItemsToDisplay) {
                  if (this.data.maxItemsToDisplay > reducedMaxItemsToDisplay) {
                    // as all the rendered chats are already "outdated"
                    // all old chats shall remove and reduced number of few chats will be rendered
                    // then restore to the original number
                    changeMaxItemsToDisplay = true;
                    this.data.maxItemsToDisplay = reducedMaxItemsToDisplay;
                  }
                  this.activeItems_.splice(0, this.activeItems_.length - this.data.maxItemsToDisplay);
                  //   console.log('changeMaxItemsToDisplay 01', this.data.maxItemsToDisplay, oMaxItemsToDisplay, reducedMaxItemsToDisplay)
                }

                // it is found that it will render all stacked chats after switching back from background
                // to avoid lagging in popular livestream with massive chats, trim first before rendering.
                // this.activeItems_.length > this.data.maxItemsToDisplay && this.activeItems_.splice(0, this.activeItems_.length - this.data.maxItemsToDisplay);



                const items = (cnt.$ || 0).items;

                if (USE_WILL_CHANGE_CONTROLLER) {
                  if (contensWillChangeController && contensWillChangeController.element !== items) {
                    contensWillChangeController.release();
                    contensWillChangeController = null;
                  }
                  if (!contensWillChangeController) contensWillChangeController = new WillChangeController(items, 'contents');
                }
                const wcController = contensWillChangeController;
                cnt.__intermediate_delay__ = Promise.all([cnt.__intermediate_delay__ || null, immd || null]);
                wcController && wcController.beforeOper();
                await Promise.resolve();
                const len1 = cnt.activeItems_.length;
                cnt.flushActiveItems66_();
                const len2 = cnt.activeItems_.length;
                let bAsync = len1 !== len2;
                await Promise.resolve();
                if (wcController) {
                  if (bAsync) {
                    cnt.async(() => {
                      wcController.afterOper();
                    });
                  } else {
                    wcController.afterOper();
                  }
                }
                if (changeMaxItemsToDisplay) {
                  if (this.data.maxItemsToDisplay === reducedMaxItemsToDisplay) {
                    this.data.maxItemsToDisplay = oMaxItemsToDisplay;
                    //   console.log('changeMaxItemsToDisplay 02', this.data.maxItemsToDisplay, oMaxItemsToDisplay, reducedMaxItemsToDisplay)
                  }
                }


                if (!ENABLE_NO_SMOOTH_TRANSFORM) {


                  const ff = () => {

                    if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                    //   if (tid !== mlf || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                    if (!cnt.atBottom && cnt.allowScroll && cnt.hasUserJustInteracted11_ && !cnt.hasUserJustInteracted11_()) {
                      cnt.scrollToBottom_();

                      Promise.resolve().then(() => {

                        if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                        if (!cnt.canScrollToBottom_()) cnt.scrollToBottom_();
                      });


                    }
                  }

                  ff();


                  Promise.resolve().then(ff);

                  // requestAnimationFrame(ff);
                } else if (true) { // it might not be sticky to bottom when there is a full refresh.

                  const knt = cnt;
                  if (!scrollChatFn) {
                    const cnt = knt;
                    const f = () => {
                      const itemScroller = cnt.itemScroller;
                      if (!itemScroller || itemScroller.isConnected === false || cnt.isAttached === false) return;
                      if (!cnt.atBottom) {
                        cnt.scrollToBottom_();
                      } else if (itemScroller.scrollTop === 0) { // not yet interacted by user; cannot stick to bottom
                        itemScroller.scrollTop = itemScroller.scrollHeight;
                      }
                    };
                    scrollChatFn = () => Promise.resolve().then(f).then(f);
                  }

                  if (!ENABLE_FULL_RENDER_REQUIRED) scrollChatFn();
                }


                return 1;
              } else {
                // cnt.flushActiveItems66_();
                // this.activeItems_.length > this.data.maxItemsToDisplay && this.activeItems_.splice(0, this.activeItems_.length - this.data.maxItemsToDisplay);
                return 2;
              }
            } catch (e) {
              console.warn(e);
            }
          }

          mclp.flushActiveItems_ = function () {
            const cnt = this;

            if (arguments.length !== 0 || !cnt.activeItems_ || !cnt.canScrollToBottom_) return cnt.flushActiveItems66_.apply(this, arguments);

            if (cnt.activeItems_.length === 0) {
              cnt.__intermediate_delay__ = null;
              return;
            }

            const cntData = ((cnt || 0).data || 0);
            if (cntData.maxItemsToDisplay > MAX_ITEMS_FOR_TOTAL_DISPLAY) cntData.maxItemsToDisplay = MAX_ITEMS_FOR_TOTAL_DISPLAY;

            // ignore previous __intermediate_delay__ and create a new one
            cnt.__intermediate_delay__ = new Promise(resolve => {
              cnt.flushActiveItems77_().then(rt => {
                if (rt === 1) resolve(1); // success, scroll to bottom
                else if (rt === 2) resolve(2); // success, trim
                else resolve(-1); // skip
              });
            });

          }
          console.log("flushActiveItems_", "OK");
        } else {
          console.log("flushActiveItems_", "NG");
        }

        mclp.delayFlushActiveItemsAfterUserAction11_ = async function () {
          try {
            if (mlg > 1e9) mlg = 9;
            const tid = ++mlg;
            const keepTrialCond = () => this.atBottom && this.allowScroll && (tid === mlg) && this.isAttached === true && this.activeItems_.length >= 1 && (this.hostElement || 0).isConnected === true;
            const runCond = () => this.canScrollToBottom_();
            if (!keepTrialCond()) return;
            if (runCond()) return this.flushActiveItems_() | 1; // avoid return promise
            await new Promise(r => setTimeout(r, 80));
            if (!keepTrialCond()) return;
            if (runCond()) return this.flushActiveItems_() | 1;
            await new Promise(requestAnimationFrame);
            if (runCond()) return this.flushActiveItems_() | 1;
          } catch (e) {
            console.warn(e);
          }
        }

        if ((mclp.atBottomChanged_ || 0).length === 1) {
          // note: if the scrolling is too frequent, the show more visibility might get wrong.
          assertor(() => fnIntegrity(mclp.atBottomChanged_, '1.75.39'));

          const querySelector = HTMLElement.prototype.querySelector;
          const U = (element) => ({
            querySelector: (selector) => querySelector.call(element, selector)
          });

          let qid = 0;
          mclp.atBottomChanged_ = function (a) {
            let tid = ++qid;
            var b = this;
            a ? this.hideShowMoreAsync_ || (this.hideShowMoreAsync_ = this.async(function () {
              if (tid !== qid) return;
              U(b.hostElement).querySelector("#show-more").style.visibility = "hidden"
            }, 200)) : (this.hideShowMoreAsync_ && this.cancelAsync(this.hideShowMoreAsync_),
              this.hideShowMoreAsync_ = null,
              U(this.hostElement).querySelector("#show-more").style.visibility = "visible")
          }

          console.log("atBottomChanged_", "OK");
        } else {
          console.log("atBottomChanged_", "NG");
        }

        if ((mclp.onScrollItems_ || 0).length === 1) {

          assertor(() => fnIntegrity(mclp.onScrollItems_, '1.17.9'));
          mclp.onScrollItems66_ = mclp.onScrollItems_;
          mclp.onScrollItems77_ = async function (evt) {
            if (myw > 1e9) myw = 9;
            let tid = ++myw;

            await new Promise(requestAnimationFrame);

            if (tid !== myw) {
              return;
            }

            const cnt = this;

            await Promise.resolve();
            if (USE_OPTIMIZED_ON_SCROLL_ITEMS) {
              await Promise.resolve().then(() => {
                this.ytRendererBehavior.onScroll(evt);
              }).then(() => {
                if (this.canScrollToBottom_()) {
                  const hasUserJustInteracted = this.hasUserJustInteracted11_ ? this.hasUserJustInteracted11_() : true;
                  if (hasUserJustInteracted) {
                    // only when there is an user action
                    this.setAtBottom();
                    return 1;
                  }
                } else {
                  // no message inserting
                  this.setAtBottom();
                  return 1;
                }
              }).then((r) => {

                if (this.activeItems_.length) {

                  if (this.canScrollToBottom_()) {
                    this.flushActiveItems_();
                    return 1 && r;
                  } else if (this.atBottom && this.allowScroll && (this.hasUserJustInteracted11_ && this.hasUserJustInteracted11_())) {
                    // delayed due to user action
                    this.delayFlushActiveItemsAfterUserAction11_ && this.delayFlushActiveItemsAfterUserAction11_();
                    return 0;
                  }
                }
              }).then((r) => {
                if (r) {
                  // ensure setAtBottom is correctly set
                  this.setAtBottom();
                }
              });
            } else {
              cnt.onScrollItems66_(evt);
            }

            await Promise.resolve();

          }

          mclp.onScrollItems_ = function (evt) {

            const cnt = this;
            cnt.__intermediate_delay__ = new Promise(resolve => {
              cnt.onScrollItems77_(evt).then(() => {
                resolve();
              });
            });
          }
          console.log("onScrollItems_", "OK");
        } else {
          console.log("onScrollItems_", "NG");
        }

        if ((mclp.handleLiveChatActions_ || 0).length === 1) {

          assertor(() => fnIntegrity(mclp.handleLiveChatActions_, '1.31.17'));
          mclp.handleLiveChatActions66_ = mclp.handleLiveChatActions_;

          mclp.handleLiveChatActions77_ = async function (arr) {
            if (typeof (arr || 0).length !== 'number') {
              this.handleLiveChatActions66_(arr);
              return;
            }
            if (mzt > 1e9) mzt = 9;
            let tid = ++mzt;

            if (zarr === null) zarr = arr;
            else Array.prototype.push.apply(zarr, arr);
            arr = null;

            await new Promise(requestAnimationFrame);

            if (tid !== mzt || zarr === null) {
              return;
            }

            const carr = zarr;
            zarr = null;

            await Promise.resolve();
            this.handleLiveChatActions66_(carr);
            await Promise.resolve();

          }

          mclp.handleLiveChatActions_ = function (arr) {

            const cnt = this;
            cnt.__intermediate_delay__ = new Promise(resolve => {
              cnt.handleLiveChatActions77_(arr).then(() => {
                resolve();
              });
            });
          }
          console.log("handleLiveChatActions_", "OK");
        } else {
          console.log("handleLiveChatActions_", "NG");
        }

        mclp.hasUserJustInteracted11_ = () => {
          const t = dateNow();
          return (t - lastWheel < 80) || currentMouseDown || currentTouchDown || (t - lastUserInteraction < 80);
        }

        if ((mclp.canScrollToBottom_ || 0).length === 0) {

          assertor(() => fnIntegrity(mclp.canScrollToBottom_, '0.9.5'));

          mclp.canScrollToBottom_ = function () {
            return this.atBottom && this.allowScroll && !this.hasUserJustInteracted11_();
          }

          console.log("canScrollToBottom_", "OK");
        } else {
          console.log("canScrollToBottom_", "NG");
        }

        if (ENABLE_NO_SMOOTH_TRANSFORM) {

          mclp.isSmoothScrollEnabled_ = function () {
            return false;
          }

          mclp.maybeResizeScrollContainer_ = function () {
            //
          }

          mclp.refreshOffsetContainerHeight_ = function () {
            //
          }

          mclp.smoothScroll_ = function () {
            //
          }

          mclp.resetSmoothScroll_ = function () {
            //
          }
          console.log("ENABLE_NO_SMOOTH_TRANSFORM", "OK");
        } else {
          console.log("ENABLE_NO_SMOOTH_TRANSFORM", "NG");
        }

        console.groupEnd();

      });




      const tickerContainerSetAttribute = function (attrName, attrValue) { // ensure '14.30000001%'.toFixed(1)

        let yd = (this.__dataHost || (this.inst || 0).__dataHost).__data;
  
        if (arguments.length === 2 && attrName === 'style' && yd && attrValue) {
  
          // let v = yd.containerStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_;
          let v = `${attrValue}`;
          // conside a ticker is 101px width
          // 1% = 1.01px
          // 0.2% = 0.202px
  
  
          const ratio1 = (yd.ratio * 100);
          if (ratio1 > -1) { // avoid NaN
  
            // countdownDurationMs
            // 600000 - 0.2%    <1% = 6s>  <0.2% = 1.2s>
            // 300000 - 0.5%    <1% = 3s>  <0.5% = 1.5s>
            // 150000 - 1%    <1% = 1.5s>
            // 75000 - 2%    <1% =0.75s > <2% = 1.5s>
            // 30000 - 5%    <1% =0.3s > <5% = 1.5s>
  
            // 99px * 5% = 4.95px
  
            // 15000 - 10%    <1% =0.15s > <10% = 1.5s>
  
  
  
  
            // 1% Duration
  
            let ratio2 = ratio1;
  
            const ydd = yd.data;
            const d1 = ydd.durationSec;
            const d2 = ydd.fullDurationSec;
  
            if (d1 === d2 && d1 > 1) {
  
              if (d1 > 400) ratio2 = Math.round(ratio2 * 5) / 5; // 0.2%
              else if (d1 > 200) ratio2 = Math.round(ratio2 * 2) / 2; // 0.5%
              else if (d1 > 100) ratio2 = Math.round(ratio2 * 1) / 1; // 1%
              else if (d1 > 50) ratio2 = Math.round(ratio2 * 0.5) / 0.5; // 2%
              else if (d1 > 25) ratio2 = Math.round(ratio2 * 0.2) / 0.2; // 5% (max => 99px * 5% = 4.95px)
              else ratio2 = Math.round(ratio2 * 0.2) / 0.2;
  
            } else {
              ratio2 = Math.round(ratio2 * 5) / 5; // 0.2% (min)
            }
  
            // ratio2 = Math.round(ratio2 * 5) / 5;
            ratio2 = ratio2.toFixed(1);
            v = v.replace(`${ratio1}%`, `${ratio2}%`).replace(`${ratio1}%`, `${ratio2}%`);
  
            if (yd.__style_last__ === v) return;
            yd.__style_last__ = v;
            // do not consider any delay here.
            // it shall be inside the looping for all properties changes. all the css background ops are in the same microtask.
  
          }
  
          HTMLElement.prototype.setAttribute.call(dr(this), attrName, v);
  
  
        } else {
          HTMLElement.prototype.setAttribute.apply(dr(this), arguments);
        }
  
      };


      const fp = (renderer) => {
        const cnt = renderer.inst || renderer;
        assertor(() => typeof (cnt || 0).is === 'string');
        assertor(() => ((cnt || 0).hostElement || 0).nodeType === 1);
        const container = (cnt.$ || 0).container;
        if (container) {
          assertor(() => (container || 0).nodeType === 1);
          assertor(() => typeof container.setAttribute === 'function');
          container.setAttribute = tickerContainerSetAttribute;
        } else {
          console.warn(`"container" does not exist in ${cnt.is}`);
        }
      };

      const tags = ["yt-live-chat-ticker-paid-message-item-renderer", "yt-live-chat-ticker-paid-sticker-item-renderer",
        "yt-live-chat-ticker-renderer", "yt-live-chat-ticker-sponsor-item-renderer"];


      Promise.all(tags.map(tag => customElements.whenDefined(tag))).then(() => {

        console.groupCollapsed("YouTube Super Fast Check - yt-live-chat-ticker-... hacks");
        console.log("[Begin]");

        for (const tag of tags) {
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            continue;
          }

          cProto.attached77 = cProto.attached;

          cProto.attached = function () {
            fp(this.hostElement || this);
            return this.attached77();
          }

          for (const elm of document.getElementsByTagName(tag)) {
            fp(elm);
          }

          if (ENABLE_RAF_HACK_TICKERS && rafHub !== null) {

            // cancelable - this.rafId < isAnimationPausedChanged >

            let doHack = false;

            if (typeof cProto.startCountdown === 'function' && typeof cProto.updateTimeout === 'function' && typeof cProto.isAnimationPausedChanged === 'function') {

              console.log('startCountdown', typeof cProto.startCountdown)
              console.log('updateTimeout', typeof cProto.updateTimeout)
              console.log('isAnimationPausedChanged', typeof cProto.isAnimationPausedChanged)

              doHack = fnIntegrity(cProto.startCountdown, '2.66.37') && fnIntegrity(cProto.updateTimeout, '1.76.45') && fnIntegrity(cProto.isAnimationPausedChanged, '2.56.30')

            }
            if (doHack) {

              cProto.startCountdown = function (a, b) {
                // console.log('cProto.startCountdown', tag) // yt-live-chat-ticker-sponsor-item-renderer
                if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
                b = void 0 === b ? 0 : b;
                void 0 !== a && (this.countdownMs = 1E3 * a,
                  this.countdownDurationMs = b ? 1E3 * b : this.countdownMs,
                  this.ratio = 1,
                  this.lastCountdownTimeMs || this.isAnimationPaused || (this.lastCountdownTimeMs = performance.now(),
                    this.rafId = rafHub.request(this.boundUpdateTimeout37_)))
              };

              cProto.updateTimeout = function (a) {
                // console.log('cProto.updateTimeout', tag) // yt-live-chat-ticker-sponsor-item-renderer
                if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
                this.countdownMs = Math.max(0, this.countdownMs - (a - (this.lastCountdownTimeMs || 0)));
                this.ratio = this.countdownMs / this.countdownDurationMs;
                this.isAttached && this.countdownMs ? (this.lastCountdownTimeMs = a,
                  this.rafId = rafHub.request(this.boundUpdateTimeout37_)) : (this.lastCountdownTimeMs = null,
                    this.isAttached && ("auto" === this.hostElement.style.width && this.setContainerWidth(),
                      this.slideDown()))
              };

              cProto.isAnimationPausedChanged = function (a, b) {
                if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
                a ? rafHub.cancel(this.rafId) : !a && b && (a = this.lastCountdownTimeMs || 0,
                  this.detlaSincePausedSecs && (a = (this.lastCountdownTimeMs || 0) + 1E3 * this.detlaSincePausedSecs,
                    this.detlaSincePausedSecs = 0),
                  this.boundUpdateTimeout37_(a),
                  this.lastCountdownTimeMs = window.performance.now())
              };

              console.log('RAF_HACK_TICKERS', tag, "OK")
            } else {

              console.log('RAF_HACK_TICKERS', tag, "NG")
            }

          }

        }
        console.log("[End]");
        console.groupEnd();


      })



      if (ENABLE_RAF_HACK_INPUT_RENDERER && rafHub !== null) {


        customElements.whenDefined("yt-live-chat-message-input-renderer").then(() => {


          console.groupCollapsed("YouTube Super Fast Check - yt-live-chat-message-input-renderer hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-message-input-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            let doHack = false;
            if (typeof cProto.handleTimeout === 'function' && typeof cProto.updateTimeout === 'function') {

              // not cancellable
              console.log('handleTimeout', typeof cProto.handleTimeout)
              console.log('updateTimeout', typeof cProto.updateTimeout)

              doHack = fnIntegrity(cProto.handleTimeout, '1.27.16') && fnIntegrity(cProto.updateTimeout, '1.50.33');

            }

            if (doHack) {

              cProto.handleTimeout = function (a) {
                console.log('cProto.handleTimeout', tag)
                if (!this.boundUpdateTimeout38_) this.boundUpdateTimeout38_ = this.updateTimeout.bind(this);
                this.timeoutDurationMs = this.timeoutMs = a;
                this.countdownRatio = 1;
                0 === this.lastTimeoutTimeMs && rafHub.request(this.boundUpdateTimeout38_)
              };
              cProto.updateTimeout = function (a) {
                console.log('cProto.updateTimeout', tag)
                if (!this.boundUpdateTimeout38_) this.boundUpdateTimeout38_ = this.updateTimeout.bind(this);
                this.lastTimeoutTimeMs && (this.timeoutMs = Math.max(0, this.timeoutMs - (a - this.lastTimeoutTimeMs)),
                  this.countdownRatio = this.timeoutMs / this.timeoutDurationMs);
                this.isAttached && this.timeoutMs ? (this.lastTimeoutTimeMs = a,
                  rafHub.request(this.boundUpdateTimeout38_)) : this.lastTimeoutTimeMs = 0
              };

              console.log('RAF_HACK_INPUT_RENDERER', tag, "OK")
            } else {

              console.log('RAF_HACK_INPUT_RENDERER', tag, "NG")
            }

          })();

          console.log("[End]");

          console.groupEnd();


        })



      }


      if (ENABLE_RAF_HACK_EMOJI_PICKER && rafHub !== null) {


        customElements.whenDefined("yt-emoji-picker-renderer").then(() => {

          console.groupCollapsed("YouTube Super Fast Check - yt-emoji-picker-renderer hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-emoji-picker-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            let doHack = false;
            if (typeof cProto.animateScroll_ === 'function') {

              // not cancellable
              console.log('animateScroll_', typeof cProto.animateScroll_)

              doHack = fnIntegrity(cProto.animateScroll_, '1.102.49')

            }

            if (doHack) {

              const querySelector = HTMLElement.prototype.querySelector;
              const U = (element) => ({
                querySelector: (selector) => querySelector.call(element, selector)
              });

              cProto.animateScroll_ = function (a) {
                // console.log('cProto.animateScroll_', tag) // yt-emoji-picker-renderer
                if (!this.boundAnimateScroll39_) this.boundAnimateScroll39_ = this.animateScroll_.bind(this);
                this.lastAnimationTime_ || (this.lastAnimationTime_ = a);
                a -= this.lastAnimationTime_;
                200 > a ? (U(this.hostElement).querySelector("#categories").scrollTop = this.animationStart_ + (this.animationEnd_ - this.animationStart_) * a / 200,
                  rafHub.request(this.boundAnimateScroll39_)) : (null != this.animationEnd_ && (U(this.hostElement).querySelector("#categories").scrollTop = this.animationEnd_),
                    this.animationEnd_ = this.animationStart_ = null,
                    this.lastAnimationTime_ = 0);
                this.updateButtons_()
              }

              console.log('ENABLE_RAF_HACK_EMOJI_PICKER', tag, "OK")
            } else {

              console.log('ENABLE_RAF_HACK_EMOJI_PICKER', tag, "NG")
            }

          })();

          console.log("[End]");

          console.groupEnd();
        });
      }




      if (ENABLE_RAF_HACK_DOCKED_MESSAGE && rafHub !== null) {


        customElements.whenDefined("yt-live-chat-docked-message").then(() => {

          console.groupCollapsed("YouTube Super Fast Check - yt-live-chat-docked-message hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-docked-message"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            let doHack = false;
            if (typeof cProto.detached === 'function' && typeof cProto.checkIntersections === 'function' && typeof cProto.onDockableMessagesChanged === 'function' && typeof cProto.boundCheckIntersections === 'undefined') {

              // cancelable - this.intersectRAF <detached>
              // yt-live-chat-docked-message
              // boundCheckIntersections <-> checkIntersections
              // onDockableMessagesChanged
              //  this.intersectRAF = window.requestAnimationFrame(this.boundCheckIntersections);

              console.log('detached', typeof cProto.detached)
              console.log('checkIntersections', typeof cProto.checkIntersections)
              console.log('onDockableMessagesChanged', typeof cProto.onDockableMessagesChanged)

              doHack = fnIntegrity(cProto.detached, '0.32.22') && fnIntegrity(cProto.checkIntersections, '0.128.85') && fnIntegrity(cProto.onDockableMessagesChanged, '0.20.11')

            }

            if (doHack) {

              cProto.checkIntersections = function () {
                console.log('cProto.checkIntersections', tag)
                if (this.dockableMessages.length) {
                  this.intersectRAF = rafHub.request(this.boundCheckIntersections);
                  var a = this.dockableMessages[0]
                    , b = this.hostElement.getBoundingClientRect();
                  a = a.getBoundingClientRect();
                  var c = a.top - b.top
                    , d = 8 >= c;
                  c = 8 >= c - this.hostElement.clientHeight;
                  if (d) {
                    for (var e; d;) {
                      e = this.dockableMessages.shift();
                      d = this.dockableMessages[0];
                      if (!d)
                        break;
                      d = d.getBoundingClientRect();
                      c = d.top - b.top;
                      var f = 8 >= c;
                      if (8 >= c - a.height)
                        if (f)
                          a = d;
                        else
                          return;
                      d = f
                    }
                    this.dock(e)
                  } else
                    c && this.dockedItem && this.clear()
                } else
                  this.intersectRAF = 0
              }

              cProto.onDockableMessagesChanged = function () {
                // console.log('cProto.onDockableMessagesChanged', tag) // yt-live-chat-docked-message 
                this.dockableMessages.length && !this.intersectRAF && (this.intersectRAF = rafHub.request(this.boundCheckIntersections))
              }

              cProto.detached = function () {
                this.intersectRAF && rafHub.cancel(this.intersectRAF)
              }

              console.log('ENABLE_RAF_HACK_DOCKED_MESSAGE', tag, "OK")
            } else {

              console.log('ENABLE_RAF_HACK_DOCKED_MESSAGE', tag, "NG")
            }

          })();

          console.log("[End]");

          console.groupEnd();

        });

      }



    });





  });

})({ IntersectionObserver });
