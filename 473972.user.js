// ==UserScript==
// @name        YouTube JS Engine Tamer
// @name:ja     YouTube JS Engine Tamer
// @name:zh-TW  YouTube JS Engine Tamer
// @name:zh-CN  YouTube JS Engine Tamer
// @namespace   UserScripts
// @version     0.42.1
// @match       https://www.youtube.com/*
// @match       https://www.youtube-nocookie.com/embed/*
// @match       https://studio.youtube.com/live_chat*
// @license     MIT
// @author      CY Fung
// @icon        https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/yt-engine.png
// @grant       none
// @require     https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@c2b707e4977f77792042d4a5015fb188aae4772e/library/nextBrowserTick.min.js
// @run-at      document-start
// @unwrap
// @inject-into page
// @allFrames   true
// @exclude     /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
//
// @description         To enhance YouTube performance by modifying YouTube JS Engine
// @description:ja      YouTubeのJSエンジンを変更してパフォーマンスを向上させる
// @description:zh-TW   修改 YouTube 的 JS 引擎以提升效能
// @description:zh-CN   修改 YouTube 的 JS 引擎以提升性能
//
// ==/UserScript==

(() => {

  /** @type {WeakMapConstructor} */
  const WeakMap = window.WeakMapOriginal || window.WeakMap;

  const HOOK_ACTIVE_MODULES = true; // added in 0.37.0
  const HOOK_ACTIVE_MODULES_fetchUpdatedMetadata = true; // added in 0.37.0 (make likeCount update)
  
  const NATIVE_CANVAS_ANIMATION = false; // for #cinematics
  const FIX_schedulerInstanceInstance = 2 | 4;
  const FIX_yt_player = true; // DONT CHANGE
  const FIX_Animation_n_timeline = true;
  const FIX_Animation_n_timeline_cinematic = true;
  const FIX_ytScheduler = true;
  const NO_PRELOAD_GENERATE_204 = false;
  const ENABLE_COMPUTEDSTYLE_CACHE = true;
  const NO_SCHEDULING_DUE_TO_COMPUTEDSTYLE = true;
  const CHANGE_appendChild = true; // discussions#236759
  const FIX_bind_self_this = false;　// EXPERIMENTAL !!!!! this affect page switch after live ends

  const FIX_error_many_stack = true; // should be a bug caused by uBlock Origin

  const IGNORE_bindAnimationForCustomEffect = true; // prevent `v.bindAnimationForCustomEffect(this);` being executed

  const FIX_ytdExpander_childrenChanged = true;
  const FIX_paper_ripple_animate = true;
  const FIX_avoid_incorrect_video_meta = true; // [legacy feature for rolling number fixing] 2025.05.10 - obsoleted -> y.fetchUpdatedMetadata(t, e.continuation)
  const FIX_avoid_incorrect_video_meta_emitterBehavior = true; // [legacy feature for rolling number fixing] 2025.05.10 - obsoleted -> y.fetchUpdatedMetadata(t, e.continuation)

  const FIX_doIdomRender = true;

  const FIX_Shady = true;

  // [[ 2024.04.24 ]]
  const MODIFY_ShadyDOM_OBJ = true; // DON'T CHANGE. MUST BE TRUE
  // << if MODIFY_ShadyDOM_OBJ >>
  const WEAKREF_ShadyDOM = true;
  const OMIT_ShadyDOM_EXPERIMENTAL = 1 | 0; // 1 => enable; 2 => composedPath
  const OMIT_ShadyDOM_settings = 0 | 0 | 0; // 1: inUse; 2: handlesDynamicScoping; 4: force // {{ PRELIM TESTING PURPOSE }}
  // << end >>

  const WEAK_REF_BINDING_CONTROL = 1 | 2; // 2 - conflict control with ShadyDOM weakref

  const FIX_ytAction_ = true; // ytd-app
  const FIX_onVideoDataChange = false;
  // const FIX_onClick = true;
  const FIX_onStateChange = true;
  const FIX_onLoopRangeChange = true;
  // const FIX_maybeUpdateFlexibleMenu = true; // ytd-menu-renderer
  const FIX_VideoEVENTS_v2 = true; // true might cause bug in switching page

  const FIX_stampDomArray_ = true; // v0.30.0
  const FIX_stampDomArray = FIX_stampDomArray_ && typeof WeakRef === "function" && typeof FinalizationRegistry === "function";
  // const stampDomArray_MemoryFix_Flag001 = false;
  const XFlag = true; // root issue tbc
  
  const MemoryFix_Flag002 = 1 | 2 | 4 | 8 | 0 | 32 | 64 | 0 | 256; 
  // 32 required for new stampDomArray
  // 128 to be tested

  const FIX_perfNow = true; // history state issue; see https://bugzilla.mozilla.org/show_bug.cgi?id=1756970
  const ENABLE_ASYNC_DISPATCHEVENT = false; // problematic

  const FIX_Polymer_dom = true;
  const FIX_Polymer_AF = true;

  const SCRIPTLET_REMOVE_PRUNE_propNeedles = true; // brave scriptlet related
  const DEBUG_removePrune = false; // true for DEBUG

  const FIX_XHR_REQUESTING = true;

  const LOG_FETCHMETA_UPDATE = false; // for DEBUG

  const IGNORE_bufferhealth_CHECK = false; // experimental; true will make "Stats for nerds" no info.

  const DENY_requestStorageAccess = true; // remove document.requestStorageAccess
  const DISABLE_IFRAME_requestStorageAccess = true; // no effect if DENY_requestStorageAccess is true

  const DISABLE_COOLDOWN_SCROLLING = true; // YT cause scroll hang in MacOS

  const FIX_removeChild = true;
  const FIX_fix_requestIdleCallback_timing = true;

  const HOOK_CSSPD_LEFT = true; // global css hack for style.left
  const FORCE_NO_REUSEABLE_ELEMENT_POOL = true;

  const FIX_TRANSCRIPT_SEGMENTS = true; // Based on Tabview Youtube's implementation

  const FIX_POPUP_UNIQUE_ID = true; // currently only for channel about popup;

  // ------------------------------------------------------------------

  const MEMORY_RELEASE_NF00 = false; // need investigation of the implementation (no time) -> disable
  const MEMORY_RELEASE_NF00_SHOW_MESSAGE = false;
  const MEMORY_RELEASE_MAP_SET_REMOVE_NODE = true;
  const FULLY_REMOVE_ALL_EVENT_LISTENERS = true; // require MEMORY_RELEASE_NF00
  const FUZZY_EVENT_LISTENER_REMOVAL = true;
  const WEAK_CE_ROOT = true; // shadowRoot of the return value of attachShadow on the node

  const FIX_TEMPLATE_BINDING = true;
  const FIX_TEMPLATE_BINDING_SHOW_MESSAGE = false;

  const FIX_SHADY_METHODS = true;
  const FIX_FRAGEMENT_HOST = true;

  const USE_fastDomIf = 2; // fastDomIf is seem to be experimental  0 = no change, 1 = enable, 2 = disable
  const ENHANCE_DOMIF_createAndInsertInstance = true; // root does not need to store in the instance
  const ENHANCE_DOMIF_TEARDOWN = true; // require MEMORY_RELEASE_NF00

  const FIX_DOM_IF_DETACH = true;
  const FIX_DOM_IF_REPEAT = true; // semi-experimental (added in 0.17.0)
  const FIX_DOM_IF_TEMPLATE = true;
  // const FIX_DOM_REPEAT_TEMPLATE = true; // to be implemented

  const DEBUG_DBR847 = false;
  const FIX_DOM_IFREPEAT_RenderDebouncerChange_SET_TO_PROPNAME = true; // default true. false might be required for future change

  const FIX_ICON_RENDER = true;
  const FIX_GUIDE_ICON = true;
  const FIX_ACTIONS_TOOLTIPS = true;

  const FIX_VIDEO_PLAYER_MOUSEHOVER_EVENTS = true; // avoid unnecessary reflows due to cursor moves on the web player.

  const DISABLE_isLowLatencyLiveStream = false; // TBC

  const FIX_FlexibleItemSizing = true;
  
  const FIX_ROLLING_NUMBER_UPDATE = true;


  // ----------------------------- POPUP UNIQUE ID ISSUE -----------------------------
  // example. https://www.youtube.com/channel/UCgPev1KKSCMbnNRsvN83Hag/about
  // first tp-yt-paper-dialog: show once the page is loaded.
  // second tp-yt-paper-dialog: click "...more"
  // third tp-yt-paper-dialog: click "... and 3 more links"
  // check with document.querySelectorAll('ytd-popup-container tp-yt-paper-dialog').length
  // currently, uniqueId is preassigned by the network resolveCommand.
  // so don't modify the source side, just modify the display side (popup display) via handleOpenPopupAction
  // other related functions e.g. handleClosePopupCommand_, getAndMaybeCreatePopup_, handleClosePopupAction_, getAndMaybeCreatePopup_

  // handleOpenPopupAction -> createCacheKey
  // handleClosePopupAction_ -> createCacheKey
  // handleGetPopupOpenedAction_ -> createCacheKey
  // getAndMaybeCreatePopup_ -> createCacheKey
  // closePopup -> createCacheKey

  // yt-close-popup-command -> handleClosePopupCommand_

  // ensurePopup_ -> getAndMaybeCreatePopup_

  // yt-close-popup-action -> handleClosePopupAction_
  // closePopup -> handleClosePopupAction_
  // handleOpenPopupAction -> handleClosePopupAction_
  // handleClosePopupCommand_ -> handleClosePopupAction_
  // closeSheet -> handleClosePopupAction_("yt-sheet-view-model")

  // yt-open-popup-action -> handleOpenPopupAction


  // yt-close-popup-action -> handleClosePopupAction_ -> createCacheKey
  // yt-close-popup-command -> handleClosePopupCommand_ -> handleClosePopupAction_ -> createCacheKey

  // Experimental flag "ytpopup_disable_default_html_caching" is disabled by default.
  // Not sure enabling it can make GC or not (Yt Components are usually not GC-able)
  // ----------------------------- POPUP UNIQUE ID ISSUE -----------------------------


  const PROP_OverReInclusion_AVOID = true;
  const PROP_OverReInclusion_DEBUGLOG = false;
  const PROP_OverReInclusion_LIST = new Set([
    'hostElement72',
    'parentComponent72',
    'localVisibilityObserver_72',
    'cachedProviderNode_72',
    '__template72',
    '__templatizeOwner72',
    '__templateInfo72',
    '__dataHost72',
    '__CE_shadowRoot72',
    'elements_72',

    'ky36',
    'kz62',
    'm822',



    // To be reviewed.

    // chat messages
    'disabled', 'allowedProps',
    'filledButtonOverrides', 'openPopupConfig', 'supportsInlineActionButtons', 'allowedProps',

    'dimension', 'loadTime', 'pendingPaint',

    'countdownDurationMs', 'countdownMs', 'lastCountdownTimeMs', 'rafId', 'playerProgressSec', 'detlaSincePausedSecs', 'behaviorActionMap', 'selected', 'maxLikeCount', 'maxReplyCount', 'isMouseOver',

    'respectLangDir', 'noEndpoints',


    'objectURL',
    'buttonOverrides', 'queuedMessages',
    'STEP', 'BLOCK_ON', 'MIN_PROGESS', 'MAX_PROGESS',
    'DISMISSED_CONTENT_KEYSPACE', 'followUpDialogPromise', 'followUpDialogPromiseResolve', 'followUpDialogPromiseReject',
    'hoverJobId', 'JSC$14573_touched',


    // tbc
    'toggleable', 'isConnected',
    'scrollDistance', 'dragging', 'dragMouseStart', 'dragOffsetStart', 'containerWidthDiff',
    'disableDeselectEvent',
    'emojiSize',

    'buttonOverride',
    'shouldUseStickyPreferences', 'longPressTimeoutId',

    // others
    'observeVisibleOption', 'observeHiddenOption', 'observePrescanOption', 'visibilityMonitorKeys',
    // 'filledButtonOverrides', 'openPopupConfig', 'supportsInlineActionButtons',
    'observeVisibleOption', 'observeHiddenOption', 'observePrescanOption', 'visibilityMonitorKeys',
    //  'dimension', 'loadTime', 'pendingPaint',
    //  'disabled', 'allowedProps',


    // 'enableMssLazyLoad', 'popupContainerConfig', 'actionRouterNode', 'actionRouterIsRoot', 'actionMap', 'dynamicActionMap',
    // 'actionMap',

    // 'sharedTooltipPosition', 'sharedTooltipAnimationDelay', 'disableEmojiPickerIncrementalLoading', 'useResolveCommand', 'activeRequest', 'popoutWindowCheckIntervalId', 'supportedTooltipTargets', 'closeActionPanelTimerId', 'delayCloseActionPanelTimerId', 'tooltipTimerIds', 'queuedTooltips', 'isPopupConfigReady', 'popoutWindow', 'actionMap',

    'clearTimeout',
    'switchTemplateAtRegistration', 'hasUnmounted',
    'switchTemplateAtRegistration', 'stopKeyboardEventPropagation',
    'tangoConfiguration',
    'itemIdToDockDurationMap',
    'actionMap',

    'emojiManager', 'inputMethodEditorActive', 'suggestionIndex', 'JSC$10745_lastSuggestionRange',
    'actionMap', 'asyncHandle', 'shouldAnimateIn', 'lastFrameTimestamp', 'scrollClampRaf',
    'scrollRatePixelsPerSecond', 'scrollStartTime', 'scrollStopHandle'

    // 'buttonOverrides', 'queuedMessages', 'clearTimeout', 'actionMap',
    // 'stopKeyboardEventPropagation', 'emojiSize',
    // 'switchTemplateAtRegistration', 'hasUnmounted',
    // 'buttonOverrides', 'queuedMessages', 'clearTimeout', 'actionMap',
    // 'isReusable', 'tangoConfiguration',
    // 'itemIdToDockDurationMap', 'bottomAlignMessages', 'actionMap',
    // */

  ]);


  // const CAN_TUNE_VOLUMN_AFTER_RESUME_OR_PAUSE = false; // NO USE; TO BE REVIEWED

  // ----------------------------- Shortkey Keyboard Control -----------------------------

  /*
    window.addEventListener('edm',()=>{
      let p = [...this.onerror.errorTokens][0].token; (()=>{ console.log(p); throw new Error(p);console.log(334,p) })()
    });

    window.addEventListener('edn',()=>{
      let p = [...this.onerror.errorTokens][0].token+"X"; (()=>{ console.log(p); throw new Error(p);console.log(334,p) })()
    });
    window.addEventListener('edr',()=>{
      let p = '123'; (()=>{ console.log(p); throw new Error(p);console.log(334,p) })()
    });
  */

  // only for macOS with Chrome/Firefox 100+
  const advanceLogging = typeof AbortSignal !== 'undefined' && typeof (AbortSignal || 0).timeout === 'function' && typeof navigator !== 'undefined' && /\b(Macintosh|Mac\s*OS)\b/i.test((navigator || 0).userAgent || '');

  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'jswylcojvzts';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;



  const wk = Symbol();

  // const [setTimeoutX0, clearTimeoutX0] = [setTimeout, clearTimeout];

  let BY_PASS_KEYBOARD_CONTROL = false;


  // const setImmediate = ((self || 0).jmt || 0).setImmediate;
  /** @type {(f: ()=>{})=>{}} */
  const nextBrowserTick_ = nextBrowserTick;
  if (typeof nextBrowserTick_ !== "function" || (nextBrowserTick_.version || 0) < 2) {
    console.log('nextBrowserTick is not found.');
    return;
  }

  let p59 = 0;

  const Promise = (async () => { })().constructor;

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

  const FinalizationRegistry_ = typeof FinalizationRegistry !== "undefined" ? FinalizationRegistry : class FinalizationRegistry__ {
    constructor(callback = undefined) {

    }
    register(target, heldValue, unregisterToken = undefined) {

    }
    unregister(unregisterToken) {

    }
  }

  let ttpHTML = (s) => {
    ttpHTML = s => s;
    if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
      let s = s => s;
      trustedTypes.createPolicy('default', { createHTML: s, createScriptURL: s, createScript: s });
    }
    return s;
  }


  /** @type { typeof HTMLElement } */
  const HTMLElement_ = Reflect.getPrototypeOf(HTMLTitleElement);
  const nativeAppendE = HTMLElement_.prototype.append;
  const nativeRemoveE = HTMLElement_.prototype.remove;
  const DocumentFragment_ = DocumentFragment;
  const nativeAppendD = DocumentFragment_.prototype.append;
  const Node_ = Node;

  /**
    @param {number} x
    @param {number} d */
  const toFixed2 = (x, d) => {
    let t = x.toFixed(d);
    let y = `${+t}`;
    return y.length > t.length ? t : y;
  }


  const isChatRoomURL = location.pathname.startsWith('/live_chat');


  const TRANSLATE_DEBUG = false;


  let xdeadc00 = null; // a deteched node with __domApi
  let xlivec00 = null; // a deteched node with __domApi

  let removeTNodeRM = null;
  let removeTNodeBP = false;


  if (Node.isConnectedOverrided === undefined) {
    const pdConnected = Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected');
    if (pdConnected && pdConnected.get && pdConnected.configurable) {
      Node.isConnectedOverrided = null;
      const get_ = pdConnected.get;
      const get = function () {
        const overrided = Node.isConnectedOverrided;
        if (typeof overrided === 'boolean') return overrided;
        return get_.call(this);
      }
      Object.defineProperty(Node.prototype, 'isConnected', {
        ...pdConnected,
        get
      });
    }
  }

  const _nmSet = new Set();
  _nmSet.add = _nmSet.addOriginal || _nmSet.add;
  const _nmMap = new Set();
  _nmMap.add = _nmMap.addOriginal || _nmMap.add;
  const _nmMapV = new Set();
  _nmMapV.add = _nmMapV.addOriginal || _nmMapV.add;
  if (MEMORY_RELEASE_MAP_SET_REMOVE_NODE && !Set.prototype.addOriginal && !Map.prototype.setOriginal) {
    const Node_ = Node;
    Set.prototype.addOriginal = Set.prototype.add;
    Set.prototype.add = function (n) {
      if (n instanceof Node_) {
        if (!this[wk]) this[wk] = mWeakRef(this);
        _nmSet.add(this[wk]);
      }
      return this.addOriginal(n);
    };
    Map.prototype.setOriginal = Map.prototype.set;
    Map.prototype.set = function (n, v) {
      if (n instanceof Node_) {
        if (!this[wk]) this[wk] = mWeakRef(this);
        _nmMap.add(this[wk]);
      }
      if (v instanceof Node_) {
        if (!this[wk]) this[wk] = mWeakRef(this);
        _nmMapV.add(this[wk]);
      }
      return this.setOriginal(n, v);
    };
  }

  window.showNM00 = () => {
    const nmSet = [..._nmSet].map(e => kRef(e)).filter(e => !!e);
    const nmMap = [..._nmMap].map(e => kRef(e)).filter(e => !!e);
    const nmMapV = [..._nmMapV].map(e => kRef(e)).filter(e => !!e);
    return { nmSet, nmMap, nmMapV };
  };

  window.testNM00 = (x) => {
    const nmSet = [..._nmSet].map(e => kRef(e)).filter(e => !!e);
    const nmMap = [..._nmMap].map(e => kRef(e)).filter(e => !!e);
    const nmMapV = [..._nmMapV].map(e => kRef(e)).filter(e => !!e);
    for (const s of nmSet) if (s.has(x)) return 1;
    for (const m of nmMap) if (m.has(x)) return 2;
    for (const m of nmMapV) {
      for (const [u, v] of m.entries()) {
        if (v === x) return 4;
      }
    }
    return 0;
  };

  let FORCE_NO_REUSEABLE_ELEMENT_POOL_fired = false;

  const FORCE_NO_REUSEABLE_ELEMENT_POOL_fn = (mainCnt) => {

    if (FORCE_NO_REUSEABLE_ELEMENT_POOL_fired) return;

    FORCE_NO_REUSEABLE_ELEMENT_POOL_fired = true;

    if (typeof mainCnt.createComponent_ !== 'function' || mainCnt.createComponent_.length != 3) {
      console.warn('FORCE_NO_REUSEABLE_ELEMENT_POOL_fn failed.')
      return;
    }

    const mapGet = Map.prototype.get;
    const setHas = Set.prototype.has;

    /** @type {Map | null} */
    let qcMap = null;

    Set.prototype.has = function (a) {
      if (a === 'dummy-4718') return false; // false to allow re-use?
      return setHas.call(this, a);
    }

    Map.prototype.get = function (a) {
      if (a === 'dummy-4718') qcMap = this;
      return mapGet.call(this, a);
    };
    let r;
    try {
      r = mainCnt.createComponent_('dummy-4718', {}, true);
    } catch (e) {

    }

    Map.prototype.get = mapGet;
    Set.prototype.has = setHas;

    if (r && (r.nodeName || '').toLowerCase() === 'dummy-4718') {


      // clearInterval(ckId);
      // ckId = 0;

      if (qcMap !== null && qcMap instanceof Map) {

        console.log('[yt-js-engine-tamer] qcMap', qcMap);
        qcMap.__qcMap8781__ = true;

        const setArrayC = (c) => {
          if (c instanceof Array) {
            c.length = 0;
            c.push = function () { };
            c.pop = function () { };
            c.shift = function () { };
            c.unshift = function () { };
            c.splice = function () { };
            c.sort = function () { };
            c.reverse = function () { };
          }
        }

        const cleaning = function (m) {
          m.forEach(setArrayC);
          m.clear();
        }

        qcMap.set = function (b, c) {
          if (!this.__qcMap8781__) return Map.prototype.set.call(this, b, c);

          setArrayC(c);

          // console.log('qcMap.set', b, c);

          if (this.size > 0) {
            // play safe

            console.log('[yt-js-engine-tamer] qcMap', 'clear 01')
            cleaning(this);
          }

        }
        qcMap.get = function (b) {
          if (!this.__qcMap8781__) return Map.prototype.get.call(this, b);

          // console.log('qcMap.get', b);

          if (this.size > 0) {
            // play safe

            console.log('[yt-js-engine-tamer] qcMap', 'clear 02')
            cleaning(this);
          }

        }


        if (qcMap.size > 0) {

          console.log('[yt-js-engine-tamer] qcMap', 'clear 03')
          cleaning(qcMap);
        }

      }

    }

    r = null;
    qcMap = null;

  }

  const renderPathMake = (elements) => {
    if(!elements) return;
    if (!elements.length) elements = [elements];
    const s = new Set();
    s.add = s.addOriginal || s.add;
    for (const element of elements) {
      if (element && element.nodeType >= 1) {
        s.add(element);
        if (element.querySelectorAll) {
          for (const e of element.querySelectorAll('*')) {
            s.add(e);
          }
        }
      }
    }
    const y = [...s];
    s.clear();

    const f = (elm) => {
      let x = elm.nodeName.toLowerCase();
      let y = elm.id;
      return y ? `${x}#${y}` : `${x}`;
    }
    for (const element of y) {
      if (element && (element.nodeType >= 1) && !element.__renderPath522__) {
        let t = element;
        let w = [f(t)];
        if (!element.is) {
          while (t = t.parentNode) {
            w.unshift(f(t))
            if (t.is) break;
          }
        }
        element.__renderPath522__ = w.join('/');
      }
    }
  }


  const dispatchYtEvent = function (a, b, c, d) {
    d || (d = {
      bubbles: !0,
      cancelable: !1,
      composed: !0
    });
    c !== null && c !== void 0 && (d.detail = c);
    b = new CustomEvent(b, d);
    a.dispatchEvent(b);
    return b
  };

  if (DISABLE_isLowLatencyLiveStream) {
    const sm = Symbol();
    const f = () => {
      try {
        const videoDetails = ytInitialPlayerResponse.videoDetails;
        if (videoDetails && videoDetails.isLowLatencyLiveStream) {
          videoDetails.isLowLatencyLiveStream = false;
        }
        if (videoDetails && videoDetails.latencyClass === 'MDE_STREAM_OPTIMIZATIONS_RENDERER_LATENCY_LOW') {
          videoDetails.latencyClass = 'MDE_STREAM_OPTIMIZATIONS_RENDERER_LATENCY_NORMAL';
        }
        if (videoDetails && videoDetails.latencyClass === 'MDE_STREAM_OPTIMIZATIONS_RENDERER_LATENCY_ULTRA_LOW') {
          videoDetails.latencyClass = 'MDE_STREAM_OPTIMIZATIONS_RENDERER_LATENCY_NORMAL';
        }
      } catch (e) { }
    }
    Object.defineProperty(Object.prototype, 'isLowLatencyLiveStream', {
      get() {
        const v = this[sm];
        if (typeof v === 'undefined') return v;
        f();
        return v;
      },
      set(nv) {
        f();
        if (nv === true) nv = false;
        this[sm] = nv;
      },
      enumerable: false,
      configurable: true
    });

    const sm3 = Symbol();
    Object.defineProperty(Object.prototype, 'latencyClass', {
      get() {
        const v = this[sm3];
        if (typeof v === 'undefined') return v;
        f();
        return v;
      },
      set(nv) {
        f();
        if (nv === 'ULTRALOW' || nv === 'LOW') {
          nv = 'NORMAL';
        } else if (nv === 'MDE_STREAM_OPTIMIZATIONS_RENDERER_LATENCY_LOW' || nv === 'MDE_STREAM_OPTIMIZATIONS_RENDERER_LATENCY_ULTRA_LOW') {
          nv = 'MDE_STREAM_OPTIMIZATIONS_RENDERER_LATENCY_NORMAL';
        }
        this[sm3] = nv;
      },
      enumerable: false,
      configurable: true
    });

  }

  class PlainHTMLElement extends HTMLTitleElement {

  }

  const removeShady = function (shady) {
    if (!shady || typeof shady !== 'object') return;
    const props = [...Object.getOwnPropertyNames(shady), ...Object.getOwnPropertySymbols(shady)];
    for (const prop of props) {
      const node = shady[prop];
      if (typeof (node || 0) !== 'object') continue;
      if (node.nodeType >= 1 && node.isConnected === false) _removedElements.addNode(node);
    }
  }

  const shadys = new Set();
  shadys.add = shadys.addOriginal || shadys.add;

  window.showShadys00 = ()=>[...shadys].map(e=>kRef(e));

  const _removedElements = new Set();
  _removedElements.add = _removedElements.addOriginal || _removedElements.add;
  _removedElements.addNode_ = MEMORY_RELEASE_NF00 ? function (node) {
    if (!node || node.__keepInstance038__ || node.t792 || node instanceof HTMLTitleElement || node.nodeName === 'defs' || node.nodeName === 'TITLE') return;
    if (node && node.nodeType >= 1 && node.nodeType !== 9) {
      if (!node[wk]) node[wk] = mWeakRef(node);
      return this.add(node[wk]);
    }
  } : () => { };

  _removedElements.addNode = MEMORY_RELEASE_NF00 ? (node) => {
    if (!node || node.__keepInstance038__ || node.t792 || node instanceof HTMLTitleElement || node.nodeName === 'defs' || node.nodeName === 'TITLE') return;
    if (node && node.nodeType >= 1 && node.nodeType !== 9) {
      try {
        const rootNode = node.getRootNode();
        if (rootNode && rootNode !== node) {
          if (rootNode.nodeType >= 1 && rootNode.nodeType !== 9) _removedElements.addNode_(rootNode);
        }
      } catch (e) { }
      _removedElements.addNode_(node);
    }
  } : () => { };

  if (WEAK_CE_ROOT) {
    Object.defineProperty(Object.prototype, '__CE_shadowRoot', {
      get() {
        return kRef(this.__CE_shadowRoot366);
      },
      set(nv) {
        if (typeof nv !== 'object') { // null is okay
          if (this.__CE_shadowRoot366) this.__CE_shadowRoot366 = null;
          return false;
        }
        if (!nv || typeof nv !== 'object') {
          this.__CE_shadowRoot366 = nv;
        } else {
          if (!nv[wk]) nv[wk] = mWeakRef(nv);
          this.__CE_shadowRoot366 = nv[wk];
        }
        return true;
      }
    });
  }

  const _emptyElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const _emptyTipsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const _emptyVisibilityElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  // const _emptyShady = new (class EmptyShady { });

  const nf00 = new FinalizationRegistry_((x) => {
    if (MEMORY_RELEASE_NF00_SHOW_MESSAGE) console.log(`NF00: node[${x}] fully removed`);
  });
  let ud00 = 0;
  const ng00 = new Set();
  nf00.registerNode = function (node) {
    if (node && node.nodeType >= 1) {
      if (!node.t792) {
        node.t792 = (ud00 = (ud00 & 1073741823) + 1);
        const x = `${node.nodeName.toLowerCase()}#${node.t792}`;
        this.register(node, x);
        if (MEMORY_RELEASE_NF00_SHOW_MESSAGE) console.log(`NF00: try remove node[${x}]`);
        ng00.add(mWeakRef(node));
      }
    }
  }
  window.showNg00 = () => {
    const ng01 = new Set();
    ng01.add = ng01.addOriginal || ng01.add;
    for (const e of ng00) {
      const f = kRef(e);
      if (!f) continue;
      ng01.add(f);
    }
    const ng02 = [...ng01];
    ng01.clear();
    window.showNg01 = [...ng02];
    return window.showNg01;
  }
  window.showTemplates00 = () => {
    const result = {};
    const elements = document.querySelectorAll('*');
    for (const element of elements) {
      const tag = element.nodeName.toLocaleLowerCase();
      const r = result[tag] || [];
      const cnt = insp(element);
      if (cnt !== element) {
        if (cnt.templateInfo) {
          r.push(['cnt0', cnt.templateInfo, element]);
        }
        if (element._templateInfo) {
          r.push(['cnt1', cnt._templateInfo, element]);
        }
        if (element.__templateInfo) {
          r.push(['cnt2', cnt.__templateInfo, element]);
        }
      }
      if (element.templateInfo) {
        r.push(['elm0', element.templateInfo, element]);
      }
      if (element._templateInfo) {
        r.push(['elm1', element._templateInfo, element]);
      }
      if (element.__templateInfo) {
        r.push(['elm2', element.__templateInfo, element]);
      }
      if (r.length >= 1) result[tag] = r;
    }
    const strCmp = (a, b) => {
      if (a === b) return 0;
      let u = [a, b].sort();
      return u[0] === a ? -1 : 1;
    }
    const counting1 = Object.entries(result).map(e => [e[0], [...new Set(e[1].map(t => t[0]))].join('|')]).sort((a, b) => {
      return strCmp(`${a[1]}.${a[0]}`, `${b[1]}.${b[0]}`);
    });

    const counting2 = Object.entries(result).map(e => [e[0], [...new Set(e[1].map(t => t[1]))]]);

    const counting3 = Object.entries(result).map(e => {
      const a = [...new Set(e[1].map(t => t[1]))];
      const b = [...new Set(a.map(e => e.nodeList || e))];

      const r = [e[0], b];
      return r;
    });

    return {result, counting1, counting2, counting3};
  };

  window.showFrag00 = function(){

    const result = {};
    const elements = document.querySelectorAll('*');
    for (const element of elements) {
      const tag = element.nodeName.toLocaleLowerCase();
      const r = result[tag] || [];
      const cnt = insp(element);
      if (cnt !== element) {
        if (cnt.templateInfo) {
          r.push(['cnt0', cnt.templateInfo, element]);
        }
        if (element._templateInfo) {
          r.push(['cnt1', cnt._templateInfo, element]);
        }
        if (element.__templateInfo) {
          r.push(['cnt2', cnt.__templateInfo, element]);
        }
      }
      if (element.templateInfo) {
        r.push(['elm0', element.templateInfo, element]);
      }
      if (element._templateInfo) {
        r.push(['elm1', element._templateInfo, element]);
      }
      if (element.__templateInfo) {
        r.push(['elm2', element.__templateInfo, element]);
      }
      if (r.length >= 1) result[tag] = r;
    }
    return result;

  }

  const detachShadyRef = (node) => {

    const shadyArr = [...shadys];
    for (let shady of shadyArr) {
      shady = kRef(shady);
      if (!shady) continue;
      const keys = [...Object.getOwnPropertyNames(shady), ...Object.getOwnPropertySymbols(shady)];
      for (const p of keys) {
        const v = keys[p];
        if (!v) continue;
        if (v instanceof Node) {
          if (node === v || node.contains(v)) keys[p] = _emptyElement;
        } else if (typeof v === 'object' && v.splice && v.length > 0) {
          for (let i = v.length - 1; i >= 0; i--) {
            const t = v[i];
            if (t instanceof Node) {
              if (node === t || node.contains(t)) v.splice(i, 1);
            }
          }
        }
      }
    }
    shadyArr.length = 0;


  }

  if (MEMORY_RELEASE_NF00) {

    const __removedElements = new Set();
    __removedElements.add = __removedElements.addOriginal || __removedElements.add;

    setInterval(() => {
      const nodesSet = new Set();
      nodesSet.add = nodesSet.addOriginal || nodesSet.add;

      for (const nodeWr of __removedElements) {
        __removedElements.delete(nodeWr);
        const node = kRef(nodeWr);
        if (node && node.nodeType >= 1 && node.isConnected === false) {
          let rootNode;
          try {
            rootNode = node.getRootNode();
          } catch (e) { }
          if (rootNode && rootNode.nodeType >= 1 && rootNode.nodeType !== 9 && rootNode.isConnected === true) {
            // do nothing
          } else {
            nodesSet.add(node);
            if (node.querySelectorAll) {
              for (const p of node.querySelectorAll('*')) {
                nodesSet.add(p);
              }
            }
          }
        }
      }
      for (const nodeWr of _removedElements) {
        _removedElements.delete(nodeWr);
        const node = kRef(nodeWr);
        if (node && node.isConnected === false) {
          __removedElements.add(nodeWr);
        }
      }

      if(nodesSet.size === 0) return;

      const nmSet = [..._nmSet].map(e => kRef(e)).filter(e => !!e);
      const nmMap = [..._nmMap].map(e => kRef(e)).filter(e => !!e);
      const nmMapV = [..._nmMapV].map(e => kRef(e)).filter(e => !!e);

      for (const node of nodesSet) {
        if (node === _emptyElement || node.__keepInstance038__ || node.t792) continue;
        const hasToolTips = !!((insp(node).$ || 0).tooltip);

        if (node && node.__shady_getRootNode) {
          let k = null;
          try {
            k = node.__shady_getRootNode();
          } catch { }
          if (k && k.__keepInstance038__) k.__keepInstance038__ = false;
          if (k && k.nodeType >= 1 && k.isConnected === false) _removedElements.addNode(k);
        }
        if (node && node.getRootNode) {
          const k = node.getRootNode();
          if (k && k.__keepInstance038__) k.__keepInstance038__ = false;
          if (k && k.nodeType >= 1 && k.isConnected === false) _removedElements.addNode(k);
        }

        if (node.__instances) {
          for (const k of node.__instances) {
            if (k && k.__keepInstance038__) k.__keepInstance038__ = false;
            if (k && k.nodeType >= 1 && k.isConnected === false) _removedElements.addNode(k);
          }
          // node.__instances.length = 0;
        }
        if (node && node.nodeType === 1) {
          if (typeof insp(node).__teardownInstance === 'function') {
            try {
              insp(node).__teardownInstance();
            } catch (e) { }
          } else if (typeof node.__teardownInstance === 'function') {
            try {
              node.__teardownInstance();
            } catch (e) { }
          }
        }
        if (node && node.nodeType === 1 && node.__detachAndRemoveInstance && (node.__instances || 0).length >= 1) {
          for (let i = node.__instances.length - 1; i >= 0; i--) {
            node.__detachAndRemoveInstance(i)
          }
        }

        if (node && node.nodeType === 1 && node.is === void 0) {
          if (typeof insp(node).dispose === 'function') {
            insp(node).dispose();
          } else if (typeof node.dispose === 'function') {
            node.dispose();
          }
        }

        if (node && node.nodeType === 1) {
          if (typeof insp(node).unobserve_ === 'function') {
            insp(node).unobserve_();
          } else if (typeof node.unobserve_ === 'function') {
            node.unobserve_();
          }
        }

        if (node) {
          if (typeof insp(node).unobserveNodes === 'function') {
            insp(node).unobserveNodes();
          } else if (typeof node.unobserveNodes === 'function') {
            node.unobserveNodes();
          }
        }

        // if (node && node.nodeType === 1) {
        //   const cnt = insp(node);
        //   const paths = cnt.__dataLinkedPaths;
        //   if (paths && paths.length >= 1 && typeof cnt.unlinkPaths === 'function') {
        //     for (let k in paths) {
        //       cnt.unlinkPaths(k);
        //     }
        //   }
        // }

        const visibilityMonitorKeys = insp(node).visibilityMonitorKeys || node.visibilityMonitorKeys;
        if (visibilityMonitorKeys) {
          for (const entry of visibilityMonitorKeys) {
            if (entry.element) { entry.element = null }
          }
          visibilityMonitorKeys.length = 0;
        }
        const __instances = node.__instances;
        if (__instances) {
          for (const k of __instances) {
            if (k && k.__keepInstance038__) k.__keepInstance038__ = false;
            if (k && k.nodeType >= 1 && k.isConnected === false) _removedElements.addNode(k);
          }
          __instances.length = 0;
        }
        const sp = node.__shady_parentNode;
        if (sp && sp.nodeType >= 1 && sp.isConnected === false) _removedElements.addNode(sp);
        FULLY_REMOVE_ALL_EVENT_LISTENERS && node.removeAllEventListener001();
        if (node && node.remove) node.remove();

        /*
        if (node._templateInfo && node._templateInfo.content) {
          const templateInfoContent = node._templateInfo.content;
          if (templateInfoContent.nodeType >= 1 && templateInfoContent.isConnected === false) {
            _removedElements.addNode(templateInfoContent);
          }
          try{
            node._templateInfo.content = null;
          }catch(e){}
        }
        */
        if (node.__domApi) {
          node.__domApi = null;
        }

        const __shady = node.__shady;
        if (__shady) {
          delete node.__shady;
          if (shadyKey) {
            const shadyRootNode = __shady[shadyKey];
            if (shadyRootNode) {
              // console.log(shadyRootNode);
              __shady[shadyKey] = null;
              for (const key of [...Object.getOwnPropertyNames(__shady), ...Object.getOwnPropertySymbols(__shady)]) {
                shadyRootNode[key] = null;
              }
            }
          }
        }


        const ceRoot = node.__CE_shadowRoot;
        if (ceRoot) {
          node.__CE_shadowRoot = null;
          if (ceRoot.nodeType >= 1 && ceRoot.isConnected === false) {
            _removedElements.addNode(ceRoot);
          }

        }

        // xTeardownTemplateInfo
        const snChildNodes = node.__shady_native_childNodes;
        if (snChildNodes.length > 0) {
          for (const node of snChildNodes) {
            if (node && node.nodeType >= 1 && node.isConnected === false) {
              _removedElements.addNode(node);
            }
          }
          snChildNodes.length = 0;
        }
        node.__shady_native_childNodes = null;


        const __templateInfo = node.__templateInfo;
        if (__templateInfo) {
          node.__templateInfo = null;
          // xTeardownTemplateInfo(__templateInfo);
        }

        if (hasToolTips && insp(node).$) {
          insp(node).$.tooltip = _emptyTipsElement;
        }

        if (node && node.nodeType >= 1) {
          const pd = Object.getOwnPropertyDescriptor(node, 'visibilityMonitorKeys');
          if (pd && pd.value && pd.value.length >= 1) {
            const arr = pd.value;
            for (let i = 0; i < arr.length; i++) {
              arr[i].element = _emptyVisibilityElement;
              arr[i] = null;
            }
          }
        }

        if (node.__dataHost) {
          try {
            delete node.__dataHost
          } catch (e) { }
          try {
            node.__dataHost = null;
          } catch (e) { }
        }

        if (node.root) {
          try {
            delete node.root
          } catch (e) { }
          try {
            node.root = null;
          } catch (e) { }
        }

        if (node.children && node.children.splice) {
          try {
            delete node.children
          } catch (e) { }
          try {
            node.children = null;
          } catch (e) { }
        }

        if (node.__shady && typeof node.__shady === 'object') { 
          try {
            node.__shady = null;
          } catch (e) { }
        }

        if (node.nodeType === 1) Reflect.setPrototypeOf(node, PlainHTMLElement.prototype);

        for (const prop of Object.getOwnPropertyNames(node)) {
          if (prop === 'host' && typeof (node.host || 0) === 'object') {
            if (node.nodeType === 11) {
              const nodeHost = node.host;
              if (nodeHost && nodeHost.nodeType >= 1) {
                node.host = _emptyElement;
                if (nodeHost.isConnected === false && nodeHost !== _emptyElement) {
                  _removedElements.addNode(nodeHost);
                }
              } else {
                node.host = null;
              }
            } else {
              node.host = null;
            }
            continue;
          }
          const pd = Object.getOwnPropertyDescriptor(node, prop);
          if (pd.value) {
            const v = pd.value;
            if (typeof (v || 0) === 'object') node[prop] = null;
            else if (typeof (v || 0) === 'function') delete node[prop];
          }
        }

        for (const prop of Object.getOwnPropertySymbols(node)) {
          const v = node[prop];
          if (typeof (v || 0) === 'object' && !v.deref) node[prop] = null;
        }

        if (node.__shady_native_childNodes) {
          node.__shady_native_childNodes = _emptyElement.childNodes;
        }
        if (node.__shady_children) {
          node.__shady_children = _emptyElement.children;
        }

        for (const s of nmSet) s.delete(node);
        for (const m of nmMap) m.delete(node);

        mightTeardownShadyDomWrap(node);

        detachShadyRef(node);

        nf00.registerNode(node);



        // console.log(1883001, node)
        // console.log(3772001, node, node.countEvent767())
      }

      nodesSet.clear();

    }, 400);

  }


  if (FULLY_REMOVE_ALL_EVENT_LISTENERS && !EventTarget.prototype.addEventListener828 && !EventTarget.prototype.removeAllEventListener001) {
    const handlerMap = new WeakMap();
    EventTarget.prototype.addEventListener828 = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, handler, option = void 0) {
      const wr = this[wk] || (this[wk] = mWeakRef(this));
      let hds = handlerMap.get(wr);
      if (!hds) handlerMap.set(wr, (hds = new Set()));
      hds.add([type, handler, option]);
      return this.addEventListener828(type, handler, option);
    }
    EventTarget.prototype.removeEventListener828 = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function (type, handler, option = void 0) {
      const wr = this[wk] || (this[wk] = mWeakRef(this));
      let hds = handlerMap.get(wr);
      if (hds) {
        for (const entry of hds) {
          if (entry[0] === type && entry[1] === handler) {
            if (entry[2] === option) {
              hds.delete(entry);
              // break;
            } else if (FUZZY_EVENT_LISTENER_REMOVAL) {
              hds.delete(entry);
              this.removeEventListener828(type, handler, entry[2]);
            }
          }
        }
      }
      return this.removeEventListener828(type, handler, option);
    }
    EventTarget.prototype.countEvent767 = function(){
      const wr = this[wk] || (this[wk] = mWeakRef(this));
      return handlerMap.get(wr);
    }
    EventTarget.prototype.removeAllEventListener001 = function () {
      const wr = this[wk] || (this[wk] = mWeakRef(this));
      let hds = handlerMap.get(wr);
      if (hds) {
        handlerMap.delete(wr);
        for (const entry of hds) {
          const [type, handler, option] = entry;
          entry.length = 0;
          this.removeEventListener828(type, handler, option);
        }
        hds.clear();
      }
    }
  }

  const globalSetup = (key, setup)=>{
    let symb = Symbol();
    Object.defineProperty(Object.prototype, key, {
      get() {
        return this[symb];
      },
      set(nv) {
        if (typeof nv !== 'function') {
          this[symb] = nv;
          return true;
        }
        if (!(symb in this)) {
          setup(this);
        }
        this[symb] = nv;
        return true;
      },
      configurable: true,
      enumerable: false
    });
  }

  const toActualNode = (e) => {
    return e && e.getNode592177 ? e.getNode592177() : e;
  }

  const removeAllChildNodes = (o)=>{
    if ((o instanceof Node) && o.nodeType >= 1) {
      let t, q = null;
      while ((t = o.firstChild) && t !== q) {
        try {
          t.__keepInstance038__ = false;
          t.remove();
          _removedElements.addNode(t);
          q = t;
        } catch (e) { }
      }
      try {
        o.__keepInstance038__ = false;
        o.remove();
        _removedElements.addNode(o);
      } catch (e) { }
    }
  }

  let shadyInited = false;
  let shadyKey = '';
  let shadyKeyX = '';
  const setupShady = () => {
    shadyInited = true;
    let p = document.createComment('1');
    const x = document.implementation.createHTMLDocument();
    const y = x.firstElementChild;
    y.appendChild(p);
    let key = '';
    p.__shady = new Proxy({}, {
      get(target, prop) {
        key = prop;
        throw new Error();
      },
      set(target, prop, val) {
        throw new Error();
      }
    })
    try {
      p.__shady_getRootNode()
    } catch (e) { }
    
    let __shady = null;
    try {
      p.__shady = null;
      p.__shady_getRootNode()
      __shady = p.__shady;
    } catch (e) {

    }
    y.removeChild(p);


    if (0 && key && __shady && typeof __shady === 'object' && !('nodeType' in __shady) && !('nodeName' in __shady)) {
      const sProto = Reflect.getPrototypeOf(__shady);
      const symb = Symbol('__shady');
      // const symbKeys = ['root', 'firstChild', 'lastChild', 'parentNode', 'nextSibling', 'previousSibling'];
      Object.defineProperty(sProto, key, {
        get() {
          if(!this[wk]) this[wk] = mWeakRef(this);
          shadys.add(this[wk]);
          return kRef(this[symb]);
        },
        set(nv) {
          if(!this[wk]) this[wk] = mWeakRef(this);
          shadys.add(this[wk]);
          if (typeof (nv || 0) === 'object') {
            if (!nv[wk]) nv[wk] = mWeakRef(nv);
            this[symb] = nv[wk];
          } else {
            this[symb] = nv;
          }
          return true;
        },
        enumerable: false,
        configurable: true
      });
      shadyKey = key;
      console.log('[yt-js-engine-tamer] shadyKey', key);

    }


    if (0 && key && __shady && typeof __shady === 'object' && !('nodeType' in __shady) && !('nodeName' in __shady)) {
      const sProto = Reflect.getPrototypeOf(__shady);
      const symb = Symbol('__shady');
      const symbKeys = ['root', 'firstChild', 'lastChild', 'parentNode', 'nextSibling', 'previousSibling'];
      Object.defineProperty(sProto, key, {
        get() {
          if(!this[wk]) this[wk] = mWeakRef(this);
          shadys.add(this[wk]);
          return kRef(this[symb]);
        },
        set(nv) {
          if(!this[wk]) this[wk] = mWeakRef(this);
          shadys.add(this[wk]);
          if (typeof (nv || 0) === 'object') {
            if (!nv[wk]) nv[wk] = mWeakRef(nv);
            this[symb] = nv[wk];
          } else {
            this[symb] = nv;
          }
          return true;
        },
        enumerable: false,
        configurable: true
      });
      shadyKey = key;
      console.log('[yt-js-engine-tamer] shadyKey', key);

      let shadyKeyCached = new Set();
      const fixLastShady = () => {
        const shady = lastShady;
        for (const key of Object.keys(shady)) {
          if (shadyKeyCached.has(key)) continue;
          shadyKeyCached.add(key);
          if ((typeof shady[key] === 'object') && !(shady[key] || 0).deref) {
            if (!shadyKeyX && shady[key] === shady.root) {
              shadyKeyX = key;
              const sProto = Reflect.getPrototypeOf(shady);
              const symb = Symbol();
              Object.defineProperty(sProto, shadyKeyX, {
                get() {
                  return kRef(this[symb])
                },
                set(nv) {
                  if (typeof (nv || 0) === 'object') {
                    nv = kRef(nv);
                    if (!nv[wk]) nv[wk] = mWeakRef(nv);
                    this[symb] = nv[wk];
                  } else {
                    this[symb] = nv;
                  }
                  return true;
                },
                enumerable: false,
                configurable: true,
              });
              delete shady[key];
              shady[key] = shady.root;
            };
            // console.log(12883, shady[key], key);
            // assignedNodes, assignedSlot, ja, K, childNodes, ... (keep strong ref)
          }
        }
      }
      let lastShady = null;

      symbKeys.forEach(key => {
        const symb = Symbol(key);

        Object.defineProperty(sProto, key, {
          get() {
            if (this !== lastShady && lastShady) fixLastShady();
            lastShady = this;
            return kRef(this[symb]);
          },
          set(nv) {
            if (this !== lastShady && lastShady) fixLastShady();
            lastShady = this;
            if (typeof (nv || 0) === 'object') {
              nv = kRef(nv);
              if (!nv[wk]) nv[wk] = mWeakRef(nv);
              this[symb] = nv[wk];
            } else {
              this[symb] = nv;
            }
            return true;
          },
          enumerable: false,
          configurable: true
        });

      });

    }


    

  }

  const stampedNodes = new Map();  /* !!!!!! CAUTION FOR MEMORY LEAKAGE !!!!!!! */
  stampedNodes.set = stampedNodes.setOriginal || stampedNodes.set;
  const stampedFragment = new Map();  /* !!!!!! CAUTION FOR MEMORY LEAKAGE !!!!!!! */
  stampedFragment.set = stampedFragment.setOriginal || stampedFragment.set;


  class WeakNodeC extends Node {
    constructor() {
    }
    addEventListener(type, listener, option = void 0) {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      if (!node) return;
      return node.addEventListener(type, listener, option);
    }
    removeEventListener(type, listener, option = void 0) {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      if (!node) return;
      return node.removeEventListener(type, listener, option);
    }
    getNode592177() {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      return node;
    }

    set __dataHost(nv) {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      if (!node) return;
      node.__dataHost = nv;
      return true;
    }
    get __dataHost() {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      if (!node) return;
      return node.__dataHost;
    }

    set __dataCompoundStorage(nv) {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      if (!node) return;
      node.__dataCompoundStorage = nv;
      return true;
    }
    get __dataCompoundStorage() {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      if (!node) return;
      return node.__dataCompoundStorage;
    }

    set __shady_className(nv) {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      if (!node) return;
      node.__shady_className = nv;
      // debugger;
      return true;
    }
    get __shady_className() {
      const nodeWr = stampedNodes.get(this.eid);
      const node = kRef(nodeWr);
      if (!node) return;
      return node.__shady_className;
    }
  }

  if (FIX_TEMPLATE_BINDING) {
    const templateMap = new Map(); /* !!!!!! CAUTION FOR MEMORY LEAKAGE !!!!!!! */
    templateMap.set = templateMap.setOriginal || templateMap.set;
    // const parsedTemplate = new Map();


    const it0 = Date.now() - 80000000000;
    const genId = () => `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}_${(Date.now() - it0).toString(36)}`;


    /*
    

        M.prototype._bindTemplate = function(N, R) {
            var X = this.constructor._parseTemplate(N)
              , A = this.__preBoundTemplateInfo == X;
            if (!A)
                for (var l in X.propertyEffects)
                    this._createPropertyAccessor(l);
            R ? (X = Object.create(X),
            X.wasPreBound = A,
            this.__templateInfo ? (N = N._parentTemplateInfo || this.__templateInfo,
            R = N.lastChild,
            X.parent = N,
            N.lastChild = X,
            (X.previousSibling = R) ? R.nextSibling = X : N.firstChild = X) : this.__templateInfo = X) : this.__preBoundTemplateInfo = X;
            return X
        }
        ;
    */

    /*
        ** this.constructor._parseTemplate **
          d._parseTemplate = function(N, R) {
              if (!N._templateInfo) {
                  var X = N._templateInfo = {};
                  X.nodeInfoList = [];
                  X.nestedTemplate = !!R;
                  X.stripWhiteSpace = R && R.stripWhiteSpace || N.hasAttribute && N.hasAttribute("strip-whitespace");
                  this._parseTemplateContent(N, X, {
                      parent: null
                  })
              }
              return N._templateInfo
          }

    */


    const exceptionTriggered = new Set();
    const gxx = (window.gxxC572 || (window.gxxC572 = new Set()));

    // let initied1 = false;
    // let _parseTemplateByPass = false;
    const setup1 = (qxx) => {
      // if(initied1) return;
      // initied1 = true;
      const proto = qxx;
      const constructor = proto.constructor;
      const _bindTemplate = proto._bindTemplate;
      // console.log(12883, proto, constructor)


      const _parseTemplate = constructor._parseTemplate;
      if (typeof _parseTemplate === 'function' && _parseTemplate.length === 2 && !constructor._parseTemplate322) {

        FIX_TEMPLATE_BINDING_SHOW_MESSAGE && console.log('Hack00: _parseTemplate', _parseTemplate);
        constructor._parseTemplate322 = _parseTemplate;
        const parsedResults = new WeakMap();

        const _templateInfoPd = {
          get() {
            if (!this || !this[wk]) return undefined;
            const r = parsedResults.get(this[wk]);
            return r;
          },
          set(nv) {
            delete this._templateInfo;
            this._templateInfo = nv;
            console.warn('_templateInfoPd set');
            return true;
          },
          enumerable: true,
          configurable: true
        };
        constructor._parseTemplate = function (N, R) {
          if (!N) return _parseTemplate.call(this, N, R);
          if (!N[wk]) N[wk] = mWeakRef(N);
          let r = parsedResults.get(N[wk]);
          if (r) return r;
          r = _parseTemplate.call(this, N, R);
          if (r && !parsedResults.has(N[wk])) {
            parsedResults.set(N[wk], r);
            r.iAm68 = '_templateInfo';
            N.iHave68 = '_templateInfo';
            if (N._templateInfo && N._templateInfo === r) {
              delete N._templateInfo;
              if (!N._templateInfo) {
                Object.defineProperty(N, '_templateInfo', _templateInfoPd);
              }
            }
          }
          return r;
        }
      }
      if (typeof _bindTemplate === 'function' && _bindTemplate.length === 2 && !proto._bindTemplate322) {

        FIX_TEMPLATE_BINDING_SHOW_MESSAGE && console.log('Hack00: _bindTemplate', _bindTemplate);
        proto._bindTemplate322 = _bindTemplate;
        proto._bindTemplate = function (N, R) {
          // R = boolean true or undefined
          // N = template elemenet
          let M = N;
          if (typeof (N || 0) === 'object' && N instanceof HTMLTemplateElement && (N.content || 0).nodeType === 11) {
            let componentIs = '';
            try {
              componentIs = this ? this.is : '';
            } catch (e) { }
            if (typeof (componentIs || 0) === 'string') {
              if (!templateMap.has(componentIs)) {
                templateMap.set(componentIs, N);
                // const parser = this.constructor;
                // console.log(3882, parser._parseTemplate)
                /*
                if (parser._parseTemplate && !parser._parseTemplate477 && parser._parseTemplate.length === 2) {
                  parser._parseTemplate477 = parser._parseTemplate;
                  const _parseTemplate477 = parser._parseTemplate477;
                  parser._parseTemplate = function (N, R) {
                    if (!_parseTemplateByPass && N && N[wk]) {
                      const u = parsedTemplate.get(N[wk]);
                      if (u) {
                        console.log(1838, u)
                        return u;
                      }
                    }
                    return _parseTemplate477.call(this, N, R);
                  };
                }
                if (parser._parseTemplate && parser._parseTemplate477) {
                  if (N && !N[wk]) N[wk] = mWeakRef(N);
                  if (!parsedTemplate.has(N[wk])) {
                    _parseTemplateByPass = true;
                    parsedTemplate.set(N[wk], parser._parseTemplate477(N));
                    _parseTemplateByPass = false;
                  }
                }
                */
              } else {
                M = templateMap.get(componentIs);
              }
            }
          }
          let r_ = null;
          // Promise.resolve(N).then((N) => {
          //   console.log(3488,N.templateInfo, N.templateInfo === r_);
          // })
          const r = _bindTemplate.call(this, M, R);
          r_ = r;
          return r;
        }
      }

      const _runEffectsForTemplate = proto._runEffectsForTemplate;
      if (typeof _runEffectsForTemplate === 'function' && _runEffectsForTemplate.length === 4 && !proto._runEffectsForTemplate322) {
        proto._runEffectsForTemplate322 = _runEffectsForTemplate;

        // note: fastDomIf does not work well with runEffects ... 
        // so no runEffects actaully?
        const runner = (Tw, Nw, Rw, Xw, Aw) => {

          try {


            // console.log(988003)
            const T = kRef(Tw); // this
            const N = kRef(Nw); // __templateInfo
            if (!T || !N) return;

            // console.log(988004)
            const R = kRef(Rw); // __data
            const X = kRef(Xw); // temp Data ?
            const A = kRef(Aw); // boolean ?
            if (typeof (X || 0) === 'object') gxx.delete(X);
            if (typeof (A || 0) === 'object') gxx.delete(A);

            // console.log(988005)
            const nodeList_ = N.nodeList;

            // console.log(988006, nodeList_)
            const nodeList = nodeList_ ? nodeList_.map(e => toActualNode(e)) : nodeList_;

            // console.log(988007, nodeList)

            const Nx = {
              propertyEffects: N.propertyEffects,
              nodeList: nodeList,
              firstChild: kRef(N.firstChild)
            };

            // if (kRef(N.firstChild)) {
            //   console.log(977001, Nx)
            // }

            // console.log(988009, Nx, R, X, A)


            {


              const o = Nx;
              const { propertyEffects, nodeList, firstChild } = o;
              if (propertyEffects && nodeList && nodeList.length >= 0) {
                for (const [effectKey, propertyEffectArr] of Object.entries(propertyEffects)) {
                  for (let i = propertyEffectArr.length - 1; i >= 0; i--) {
                    const propertyEffect = propertyEffectArr[i];
                    const info = (propertyEffect || 0).info;
                    if (info && typeof info.index === 'number' && !nodeList[info.index]) {
                      propertyEffectArr.splice(i, 1);
                    }
                  }
                }
              }

            }


            // console.log({T, Nx, R, X , A })

            // console.log(1737001, T)
            // console.log(1737002, Nx)

            // console.log(1737003, R)
            // console.log(1737004, X)
            // console.log(1737005, A)

            const hostElement = T.hostElement;
            const pChildren = (hostElement instanceof Node && hostElement.isConnected === true) ? [...hostElement.childNodes] : null;
            renderPathMake(pChildren);

            try {
              _runEffectsForTemplate.call(T, Nx, R, X, A);

            } catch (err) {
              // debugger;
              const stack = err.stack;
              if (!exceptionTriggered.has(stack)) {
                exceptionTriggered.add(stack);
                console.warn(`[yt-js-engine-tamer] _runEffectsForTemplate EXCEPTION`+"\n\n", err);
              }
            }

            (pChildren || 0).length >= 1 && Promise.resolve(pChildren).then((pChildren) => {
              for (const node of pChildren) {
                if (node.parentNode !== hostElement && node.__weakNodeCId57__) {
                  _removedElements.addNode(node); // rn54001b
                }
                // if (node.isConnected === false) {
                //   let tNode = node;
                //   let pNode;
                //   while ((pNode = tNode.parentNode) && pNode.nodeType >= 1) {
                //     tNode = pNode;
                //   }
                //   // _removedElements.addNode(tNode); // rn54001
                // }
              }
              pChildren.length = 0;
              pChildren = null;
            });


          } catch (err) {
            // debugger;
            // const stack = err.stack;
            // if (!exceptionTriggered.has(stack)) {
            // exceptionTriggered.add(stack);
            // console.warn(`[yt-js-engine-tamer] _runEffectsForTemplate EXCEPTION`, err);
            console.error(err);
            // }
          }

        };


        proto._runEffectsForTemplate = function (N, R, X, A) {

          // console.log(988001)
          /*
           N {wasPreBound: true, nodeList: Array(23)}

           R  {showInput: false, narrow: false, menuStrings: {…}, pageDarkTheme: true, theater: false, …}
           X {showInput: undefined, narrow: undefined, menuStrings: undefined, pageDarkTheme: undefined, theater: undefined, …}
           A  false
           */

          const Nw = (!N || typeof N !== 'object') ? N : (N[wk] || (N[wk] = mWeakRef(N))); // __templateInfo
          const Xw = (!X || typeof X !== 'object') ? X : (X[wk] || (X[wk] = mWeakRef(X)));

          const Rw = (!R || typeof R !== 'object') ? R : (R[wk] || (R[wk] = mWeakRef(R))); // __data
          const Aw = (!A || typeof A !== 'object') ? A : (A[wk] || (A[wk] = mWeakRef(A)));

          if (typeof (X || 0) === 'object') gxx.add(X);
          if (typeof (A || 0) === 'object') gxx.add(A);

          const Tw = (!this || typeof this !== 'object') ? this : (this[wk] || (this[wk] = mWeakRef(this)));


          if (N.runEffects) {
            N.runEffects(() => {
              runner(Tw, Nw, Rw, Xw, Aw);
            }, R, A);
          } else {
            runner(Tw, Nw, Rw, Xw, Aw);
          }

          // console.log(988002)

          // const N_ = 

          // var l = this
          //   , k = function (T, W) {
          //     XK(l, N.propertyEffects, T, X, W, N.nodeList);
          //     for (var w = N.firstChild; w; w = w.nextSibling)
          //       l._runEffectsForTemplate(w, T, X, W)
          //   };
          // N.runEffects ? N.runEffects(k, R, A) : k(R, A)
        }

      }


      const _registerHost = proto._registerHost;
      if (_registerHost && !proto._registerHost322 && _registerHost.length === 0) {
        proto._registerHost322 = _registerHost;
        const map = new WeakMap();
        map.set = map.setOriginal || map.set;
        proto._registerHost = function () {
          if (!map.has(this)) {
            map.set(this, (this.__dataHost || null));
            Object.defineProperty(this, '__dataHost', {
              get() {
                return kRef(map.get(this)) || null
              },
              set(nv) {
                const w = kRef(nv);
                if (!w) {
                  map.set(this, null);
                } else {
                  if (!w[wk]) w[wk] = mWeakRef(w);
                  let byPass = false;
                  if (this.is === 'ytd-masthead') byPass = true;
                  if (byPass) {
                    map.set(this, w);
                  } else {
                    map.set(this, w[wk]);
                  }
                }
                return true;
              },
              enumerable: true,
              configurable: true
            });
          }
          let previousDataHost = this.__dataHost;
          renderPathMake(previousDataHost)
          let r = _registerHost.call(this);
          let currentDataHost = this.__dataHost;
          if (currentDataHost !== previousDataHost) { // future use only
            if (previousDataHost && previousDataHost.nodeType >= 1 && previousDataHost.isConnected === false) {
              _removedElements.addNode(previousDataHost); // rn54002
            }
          }
          return r;
        }
      }

    }
    globalSetup('_removeBoundDom', setup1);


    /*

        M.prototype._stampTemplate = function(N, R) {
            R = R || this._bindTemplate(N, !0);
            aU.push(this);
            N = d.prototype._stampTemplate.call(this, N, R);
            aU.pop();
            R.nodeList = N.nodeList;
            if (!R.wasPreBound)
                for (var X = R.childNodes = [], A = N.firstChild; A; A = A.nextSibling)
                    X.push(A);
            N.templateInfo = R;
            X = R.nodeList;
            A = R.nodeInfoList;
            if (A.length)
                for (var l = 0; l < A.length; l++) {
                    var k = X[l]
                      , T = A[l].bindings;
                    if (T)
                        for (var W = 0; W < T.length; W++) {
                            var w = T[W]
                              , p = k
                              , h = w;
                            if (h.isCompound) {
                                for (var I = p.__dataCompoundStorage || (p.__dataCompoundStorage = {}), O = h.parts, y = Array(O.length), c = 0; c < O.length; c++)
                                    y[c] = O[c].literal;
                                O = h.target;
                                I[O] = y;
                                h.literal && h.kind == "property" && (O === "className" && (p = (0,
                                _.FK)(p)),
                                p[O] = h.literal)
                            }
                            gM2(k, this, w)
                        }
                    k.__dataHost = this
                }
            this.__dataClientsReady && (this._runEffectsForTemplate(R, this.__data, null, !1),
            this._flushClients());
            return N
        }
        ;

    */

    const wnc = new Set();

    const __listWeakNodeC__ = window.__listWeakNodeC__ = () => {
      const result = __listWeakNodeC0__();
      return [...result].sort();
    }

    const __listWeakNodeC0__ = () => {
      let result = new Set();
      for (const nodeC of wnc) {
        for (const k of Object.getOwnPropertyNames(nodeC)) {
          result.add(k)
        }
      }
      return result;
    }

    setInterval(() => {
      if (wnc.size > 0 && __listWeakNodeC0__().size !== 1) console.warn(`[yt-js-engine-tamer] WARNING 0xF04E: ${__listWeakNodeC__()}`);
    }, 400);


    const dollarStore = new Map();

    const makeDollarClass = (idsJoined, ids) => {
      const $ = class {};
      const a = $.prototype;
      ids.forEach(id => {
        const p = `## ${id}`;
        Object.defineProperty(a, id, {
          get() {
            return kRef(this[p]);
          },
          set(nv) {
            if (nv instanceof Node) {
              if (!nv[wk]) nv[wk] = mWeakRef(nv);
              this[p] = nv[wk];
            } else {
              this[p] = nv;
            }
            return true;
          },
          enumerable: true,
          configurable: true
        });
      });
      a.__w646__ = true;
      dollarStore.set(idsJoined, $);
      return $;
    }

    // let initied2 = false;
    const setup2 = (qxx) => {
      // if(initied2) return;
      // initied2 = true;
      const proto = qxx;
      const constructor = proto.constructor;
      const _stampTemplate = proto._stampTemplate;
      // console.log(12883, proto, constructor)
      if (typeof _stampTemplate === 'function' && _stampTemplate.length === 2 && !proto._stampTemplate374) {
        proto._stampTemplate374 = _stampTemplate;
        proto._stampTemplate = function (N, R) {

          if (!shadyInited) setupShady();

          let e__ = null;
          try {
            // R = boolean true or binded template
            // N = template elemenet
            let M = N;
            let r_ = null;
            const r = _stampTemplate.call(this, M, R); // return the fragment created with nodeList
            r_ = r;
            // if (r && r.host) {
            //   console.log(2883, R.host)
            // }
            if (r && r.$ && !r.$.__w646__) {
              const $ = r.$;
              const ids = Object.getOwnPropertyNames($)
              const idsJoined = ids.join(' ');
              const C = dollarStore.get(idsJoined) || makeDollarClass(idsJoined, ids);
              const objVals = { ...$ };
              Reflect.setPrototypeOf($, C.prototype);
              for (const id of ids) {
                delete $[id];
                $[id] = objVals[id];
              }
            }
            if (r && r.nodeType === 11 && !r.__fragId57__) {

              const fid = genId();

              r.__fragId57__ = fid;
              if (!r[wk]) r[wk] = mWeakRef(r);
              stampedFragment.set(fid, r[wk]);

              if (r.nodeList) {
                const nl = r.nodeList;
                nl.__belongFragId57__ = fid;
                for (let i = 0, l = nl.length; i < l; i++) {
                  const t = nl[i];
                  if (t && t.nodeType >= 1 && !(t instanceof ShadowRoot)) {
                    if (!t[wk]) t[wk] = mWeakRef(t);
                    const eid = `${fid}::${i}`;
                    const wn = Object.create(WeakNodeC.prototype);
                    wn.eid = eid;
                    wnc.add(wn);
                    nl[i] = wn;
                    // we believe the stampedNodes shall be attached to the document DomTree
                    stampedNodes.set(eid, t[wk]);
                    t.__weakNodeCId57__ = eid;
                  } else {
                    if (t instanceof ShadowRoot) {
                      console.warn('[yt-js-engine-tamer]', 'ShadowRoot in _stampTemplate');
                    }
                  }
                }
              }

            }

            return r;
          } catch (e) { console.error(e); e__ = e; }
          throw e__;

        }
      }
    }

    globalSetup('_addMethodEventListenerToNode', setup2);

  }


  if (FIX_FRAGEMENT_HOST && !DocumentFragment.prototype.host577) {
    DocumentFragment.prototype.host577 = true;
    let propsOK = false;
    const finalizer = new FinalizationRegistry_((frag) => {

      if (!frag.hostCleared55) {
        frag.hostCleared55 = true;
        for (const p of [...Object.getOwnPropertyNames(frag), ...Object.getOwnPropertySymbols(frag)]) {
          const v = frag[p] || 0;
          if (typeof v === 'object') {
            frag[p] = null;
            if (v.length > 0) v.length = 0;
          }
        }
      }

    });
    Object.defineProperty(DocumentFragment.prototype, 'host', {
      get() {
        const r = kRef(this.host677);
        if (!propsOK && this.nodeType === 11 && r) setupProps(Reflect.getPrototypeOf(this));
        return r;
      },
      set(nv) {
        nv = kRef(nv);
        if (typeof (nv || 0) === 'object' && nv.nodeType === 1) {
          if (!nv[wk]) nv[wk] = mWeakRef(nv);
          this.host677 = nv[wk];
          finalizer.register(nv, this);
        } else {
          this.host677 = nv;
        }
        return true;
      },
      enumerable: true,
      configurable: true
    });


    const setupProps = (fragProto) => {

      propsOK = true;

      ["ownerDocument", "baseURI", "isConnected"].forEach(function (b) {

        const pd = Object.getOwnPropertyDescriptor(fragProto, b);
        const pdn = Object.getOwnPropertyDescriptor(Node.prototype, b);
        const get1 = pd && pd.get;
        const get2 = pdn && pdn.get;
        if (get1 && get2) {
          delete fragProto[b];
          Object.defineProperty(fragProto, b, {
            get: function () {
              return this.host ? get1.call(this) : get2.call(this);
            },
            configurable: !0
          });

        }

      });
    }

  }


  if (XFlag) {

    const cMap = new Set();
    cMap.add = cMap.addOriginal || cMap.add;
    const yMap = new Set();
    yMap.add = yMap.addOriginal || yMap.add;


    const ydMap = new Set();
    ydMap.add = ydMap.addOriginal || ydMap.add;

    window.yMap = yMap;
    window.cMap = cMap;
    window.ydMap = ydMap;

    const constructAts = new Set();
    constructAts.add = constructAts.addOriginal || constructAts.add;
    window.constructAts = constructAts;

    const kMap = new WeakMap();

    const kRefProp = (wr, prop)=>{
      let o = kRef(wr);
      return o ? o[prop] : null;
    }

    const wrObj = (objRef, props) => {
      let wr = mWeakRef(objRef);
      if (wr === objRef || !props || !props.length) return wr;
      let properties = {};
      props.forEach(k => {
        properties[k] = {
          get() {
            return kRefProp(this, k)
          },
          enumerable: false,
          configurable: true
        };
      });
      Object.defineProperties(wr, properties);
      return wr;
    }

    const sProtos = {};

    const setupCProto = function (cProto) {

      if(cProto === Object.prototype) return;

      if (!kMap.get(cProto)) kMap.set(cProto, `protoKey0_${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}_${Date.now()}`);
      cProto[kMap.get(cProto)] = true;
      // debugger;

      if (FIX_SHADY_METHODS && cProto.appendChild && cProto.cloneNode && cProto.contains && cProto.getRootNode && cProto.insertBefore && cProto.querySelector && cProto.querySelectorAll && cProto.removeAttribute && cProto.removeChild && cProto.replaceChild && cProto.setAttribute && cProto.is === undefined && !(cProto instanceof Node)) {
        if (!cProto.krmv757) {
          cProto.krmv757 = true;
          // const props = Object.entries(Object.getOwnPropertyDescriptors(cProto)).filter(a => {
          //   const e = a[1];
          //   return typeof e.value === 'function' && e.writable === true && e.enumerable === true && e.configurable === true
          // });
          // const keys = props.map(a => a[0]);
          const keys = ['querySelector', 'querySelectorAll'];
          keys.forEach(key => {
            if (!(key in HTMLTitleElement.prototype)) return;
            const bey = `${key}588`;
            cProto[bey] = cProto[key];
            const isDomChange = key === 'appendChild' || key === 'insertBefore' || key === 'removeChild' || key === 'replaceChild';
            cProto[key] = function () {
              const p = ((this || 0).root || 0).node;
              if (!isDomChange && (p instanceof Element) && p.nodeType === 1) {
                return p[key](...arguments);
              } else {
                return this[bey](...arguments);
              }
            }
          });
        }
      }

      const constructAt = `\n\n${new Error().stack}\n\n`.replace(/[\r\n]([^\r\n]*?\.user\.js[^\r\n]*?[\r\n]+)+/g, '\n').replace(/[\r\n]([^\r\n.]+[\r\n]+)+/g, '\n').trim().split(/[\r\n]+/)[0];
      constructAts.add(constructAt)

      if (MemoryFix_Flag002 & 32) {
        if (!cProto.dk322 && (cProto.__attachInstance || cProto.__detachInstance)) {
          fixDetachFn(cProto);
        }
      }

      if (MemoryFix_Flag002 & 2) {
        if (cProto._setPendingProperty && !cProto.__setPropDX38__) {
          cProto.__setPropDX38__ = true;

          if (cProto._setPendingProperty.length === 3) {
            cProto._setPendingProperty.bind = sProtos._setPendingProperty$bind || (sProtos._setPendingProperty$bind = function (obj, ...args) {
              let wobj = obj[wk] || (obj[wk] = mWeakRef(obj));
              return () => {
                const obj = kRef(wobj);
                let u = Reflect.apply(this, obj, args);
                args.length = 0;
                wobj = null;
                return u;
              };
            });
          }

        }
      }


      const cProtoConstructor = cProto.constructor;

      if (MemoryFix_Flag002 & 8) {
        if (cProtoConstructor._parseBindings && !cProtoConstructor.__parseBindingsDX38__) {
          cProtoConstructor.__parseBindingsDX38__ = true;

          ydMap.add(cProtoConstructor);

          if (cProtoConstructor._parseBindings.length === 2) {

            cProtoConstructor._parseBindings3858 = cProtoConstructor._parseBindings;

            cProtoConstructor._parseBindings = sProtos._parseBindings || (sProtos._parseBindings = function (c, d) {
              let p = this._parseBindings3858(c, d);
              this.__bindingsArrs__ = this.__bindingsArrs__ || [];
              if (p) this.__bindingsArrs__.push(p);
              return p;
            });

          }
        }
      }

      /*
      
          a.prototype._initializeProperties = function() {
              if (Em && this.hasAttribute("disable-upgrade"))
                  this.__isUpgradeDisabled = !0;
              else {
                  var e = Object.getPrototypeOf(this);
                  e.hasOwnProperty("__hasRegisterFinished") || (this._registered(),
                  e.__hasRegisterFinished = !0);
                  b.prototype._initializeProperties.call(this);
                  this.root = this;
                  this.created();
                  fpb && !this._legacyForceObservedAttributes && (this.hasAttributes() ? this._takeAttributes() : this.parentNode || (this.__needsAttributesAtConnected = !0));
                  this._applyListeners()
              }
          }
      
      */
      /*
      
          bOa = function(a, b, c) {
              var d = bya(a.prototype, $Na, a.prototype.behaviors);
              d.prototype.is = b;
              d.prototype.localName = b;
              c && aOa(d, c);
              return function(e) {
                  e && (d.prototype.hostElement = e);
                  var g = new d;
                  g.root = g;
                  g.hostElement = e;
                  return g
              }
          }
      
      */


    }
    const symDH = Symbol();

    const wfStore = new WeakMap();

    const wrapF = function (f, key) {
      if (wfStore.get(f)) return wfStore.get(f);

      let g = function () {
        const o = kRef(this);
        if (!o) return;
        const cnt = insp(o);
        // if (cnt === o) return;
        // if (!('ready' in cnt)) return;
        return f.apply(o, arguments);
      };
      g.key38 = key;
      g.originalFunc38 = f;
      g.__wrapF84__ = true;
      wfStore.set(f, g);
      wfStore.set(g, g);
      return g;
    };

    if (MemoryFix_Flag002 & 16) {
      ['_createPropertyAccessor', '_addPropertyToAttributeMap', '_definePropertyAccessor', 'ready', '_initializeProperties', '_initializeInstanceProperties', '_setProperty', '_getProperty', '_setPendingProperty', '_isPropertyPending', '_invalidateProperties', '_enableProperties', '_flushProperties', '_shouldPropertiesChange', '_propertiesChanged', '_shouldPropertyChange', 'attributeChangedCallback', '_attributeToProperty', '_propertyToAttribute', '_valueToNodeAttribute', '_serializeValue', '_deserializeValue'].forEach(key => {

        Object.defineProperty(Node.prototype, key, {
          get() {
            return this[`__a0939${key}__`];
          },
          set(nv) {
            if (typeof nv !== 'function') return;
            const g = (nv.__wrapF84__) ? nv : wrapF(nv, key);
            this[`__a0939${key}__`] = g;
            return true;
          }
        });


      });
    }



    // const wm = new WeakMap();

    const fixDetachFn = (tpProto) => { // & 32

      if (tpProto.dk322) return;
      tpProto.dk322 = true;

      window.__fixTemplateReuse1058__ = true;


      tpProto.__ensureTemplatized994 = tpProto.__ensureTemplatized;
      if (typeof tpProto.__ensureTemplatized994 === 'function' && tpProto.__ensureTemplatized994.length === 0) {
        tpProto.__ensureTemplatized = function () {
          // console.log(18470001)
          return this.__ensureTemplatized994();
        }
      }


      tpProto.__updateInstances994 = tpProto.__updateInstances;
      if (typeof tpProto.__updateInstances994 === 'function' && tpProto.__updateInstances994.length === 3) {
        let bypass= false;
        tpProto.__updateInstances = function (a, b, c) {

          // const a_ = [...a];
          if(!bypass && a === this.items && (a||0).length >=1 ){

            bypass = true;
            // console.log(18470002, a, b,c)
            let e;
            for (e = 0; e < b; e++) {
                let g = this.__instances[e]
                  , k = c[e]
                  , m = a[k];
                if(g && typeof (m||0) === 'object'){
                  // const q = g._shouldPropertyChange;
                  // g._shouldPropertyChange = ()=>true;
                  // g[this.as] = {};
                  // a_[k]=a[k] = m;
                  // g[this.as] = m;

                  // use public interface notifyPath instead of internal interface _setPendingProperty
                  const m_ = a[k] = Object.assign({}, a[k]);
                  try {
                    g.notifyPath(this.as, {}); 
                  } catch (e) { }
                  try {
                    g.notifyPath(this.as, m_);
                  } catch (e) { }

                  // g._setPendingProperty(this.as, {});
                  // g._setPendingProperty(this.as, m);
                  // g._setPendingProperty(this.indexAs, e);
                  // g._setPendingProperty(this.itemsIndexAs, k);
                  // delete g._shouldPropertyChange;
                  // if(g._shouldPropertyChange !== q) g._shouldPropertyChange = q;
                } 
            }
            bypass = false;

          }
          const r = this.__updateInstances994(a,b,c);

        //   for (e = 0; e < b; e++) {
        //     let g = this.__instances[e]
        //       , k = c[e]
        //       , m = a_[k];
        //     if(g){
        //       // const q = g._shouldPropertyChange;
        //       // g._shouldPropertyChange = ()=>true;
        //       // g[this.as] = m;
        //       // g._setPendingProperty(this.as, {});
        //       // g._setPendingProperty(this.as, m);
        //       // g._setPendingProperty(this.indexAs, e);
        //       // g._setPendingProperty(this.itemsIndexAs, k);
        //       // delete g._shouldPropertyChange;
        //       // if(g._shouldPropertyChange !== q) g._shouldPropertyChange = q;
        //     } 
        // }

          return r;
        }
      }

      tpProto.__detachInstance994 = tpProto.__detachInstance;
      if (typeof tpProto.__detachInstance994 === 'function' && tpProto.__detachInstance994.length === 1) {
        tpProto.__detachInstance = function (a) {
          const u = this.__instances[a];
          if (u && !u.__keepInstance038__) u.__keepInstance038__ = true;
          const children = (u || 0).children;
          if (children && children.length >= 1) {
            const pp = document.createDocumentFragment();
            for (const s of [...children]) {
              pp.appendChild(s);
            }
          }
          try {
            return this.__detachInstance994(a);
          } catch (e) { }
          return u;
        }
      }

      tpProto.__attachInstance994 = tpProto.__attachInstance;
      if (typeof tpProto.__attachInstance994 === 'function' && tpProto.__attachInstance994.length === 2) {
        tpProto.__attachInstance = function (a, b) {
          const u = this.__instances[a];
          if (u && !u.__keepInstance038__) u.__keepInstance038__ = true;
          if (u && u.root && b) {
            const root = u.root;
            const pp = document.createDocumentFragment();
            pp.appendChild(root);
            root.appendChild(pp);
            const r = this.__attachInstance994(a, b);
            if (!this.__chunkingId) this.__chunkingId = 0.25;
            return r;
          }
        }
      }

    }

    const ytTemplateDomEntry = (tpProto) => {

      console.log('ytTemplateDomEntry triggered')


      const convertToWeakArr = (arr) => {

        if (arr.isWeak) return;

        for (let i = 0, l = arr.length; i < l; i++) {
          const o = arr[i]
          if (o) {
            let p = kRef(o)
            if (!p) arr[i] = null;
            else {
              if (!o[wk]) o[wk] = mWeakRef(o);
              arr[i] = o[wk];
            }
          }
        }
        arr.isWeak = true;

      }

      const convertToNormalArr = (arr) => {

        if (!arr.isWeak) return;

        for (let i = 0, l = arr.length; i < l; i++) {
          const o = arr[i]
          if (o) {
            let p = kRef(o)
            arr[i] = p;
          }
        }
        arr.isWeak = false;

      }

      if (MemoryFix_Flag002 & 256) {
        Object.defineProperty(tpProto, '__instances', {
          get() {
            this.dk322 || fixDetachFn(Reflect.getPrototypeOf(this));
            let arr = this.__instances_actual471__;
            if (arr && arr.isWeak) {
              convertToNormalArr(arr);
              for (let i = arr.length - 1; i >= 0; i--) {
                const t = arr[i];
                if (!t) arr.splice(i, 1);
                else if (!t.__keepInstance038__) t.__keepInstance038__ = true;
              }
              Promise.resolve(arr).then(convertToWeakArr);
            }
            return arr;
          },
          set(nv) {
            this.dk322 || fixDetachFn(Reflect.getPrototypeOf(this));
            this.__instances_actual471__ = nv;
            if (nv && !nv.isWeak) {
              Promise.resolve(nv).then(convertToWeakArr);
            }
            return true;
          },
          enumerable: false,
          configurable: true
        });
      }

      // console.log(91901, tpProto.__detachInstance)
      if (MemoryFix_Flag002 & 32) {
        if (tpProto.__detachInstance) {
          fixDetachFn(tpProto);
        } else {
          Promise.resolve(tpProto).then((tpProto) => {
            // console.log(91902, tpProto.__detachInstance)
            fixDetachFn(tpProto);
          })
        }
      }

    }

    if (MemoryFix_Flag002 & 32) {
      Object.defineProperty(Object.prototype, '__ensureTemplatized', {
        set(nv) {
          if (nv === true) return false;
          tpProto = this;
          if ('connectedCallback' in tpProto && tpProto !== Node.prototype && !tpProto.__domDX37__) {
            tpProto.__domDX37__ = true;
            ytTemplateDomEntry(tpProto);
          }
          this.__ensureTemplatized949__ = nv;
          return true;
        },
        get() {
          return this.__ensureTemplatized949__;
        }
      });
    }


    if (MemoryFix_Flag002 & 64) {
      HTMLElement_.prototype.__dataHostBinding374 = true;
      Object.defineProperty(HTMLElement_.prototype, '__dataHost', {
        get() {
          return kRef(this.__dataHostWr413__);
        },
        set(nv) {
          if (nv && typeof nv === 'object' && !nv.deref) {
            if (!nv[wk]) nv[wk] = mWeakRef(nv);
            nv = nv[wk];
          }
          this.__dataHostWr413__ = nv;
          return true;
        }
      });
    }


    const setupYProto = function (yProto) {

      if(yProto === Object.prototype) return;

      if (!kMap.get(yProto)) kMap.set(yProto, `protoKey1_${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}_${Date.now()}`);
      yProto[kMap.get(yProto)] = true;

      if (FIX_DOM_IF_DETACH && !yProto.disconnectedCallback277 && yProto.disconnectedCallback && typeof yProto._readyClients === 'function' && typeof yProto._canApplyPropertyDefault === 'function' && typeof yProto._attachDom === 'function' && !yProto.is && typeof yProto.constructor._finalizeTemplate === 'function') {
        const disconnectedCallback277 = yProto.disconnectedCallback;
        yProto.disconnectedCallback277 = true;
        yProto.disconnectedCallback = function () {
          disconnectedCallback277.call(this);
          if (this.nodeName === 'DOM-IF' && this.__instance && typeof this.__teardownInstance === 'function') {
            const shadyParent = (this.__shady_parentNode || 0);
            const actualParent = (this.parentNode || 0);
            if (shadyParent !== actualParent && shadyParent.nodeType === 11 && actualParent.nodeType === 11) {
              // && (shadyParent.compareDocumentPosition(actualParent) & (1|8|16) === 1)
              // if (!this.restamp && !this.id && this.__ctor && this.isConnected === false) {
                const children = (this.__instance.children || 0).length;
                if (children >= 1) {
                  try {
                    this.__teardownInstance();
                  } catch (e) { }
                }
              // }
            }
          }
        }
      }


      if (MemoryFix_Flag002 & 32) {
        if (!yProto.dk322 && (yProto.__attachInstance || yProto.__detachInstance)) {
          fixDetachFn(yProto);
        }
      }

      if (MemoryFix_Flag002 & 128) {
        if (!yProto.__dataHostBinding374) {
          yProto.__dataHostBinding374 = true;
          Object.defineProperty(yProto, '__dataHost', {
            set(nv) {
              let dh = nv;
              if (dh && typeof dh === 'object' && !dh.deref) {
                const wr = dh[wk] || (dh[wk] = mWeakRef(dh));
                dh = wr;
              }
              this[symDH] = dh;
              return true;
            },
            get() {
              let wr = this[symDH];
              let obj = typeof wr === 'object' ? kRef(wr) : wr;
              return obj;
            },
            enumerable: false,
            configurable: true
          });
        }



        if (yProto._registerHost && yProto._enqueueClient && yProto.__enableOrFlushClients && !yProto._registerHostDX38__) {
          yProto._registerHostDX38__ = true;

          // yProto._registerHost7133 = yProto._registerHost;

          yProto.__enableOrFlushClients = function () {
            const c_ = this.__dataPendingClients;
            if (c_) {
              const c = c_.slice();
              c_.length = 0;
              for (let d = 0, l = c.length; d < l; d++) {
                let e = kRef(c[d]);
                if (e) {
                  e.__dataEnabled ? e.__dataPending && e._flushProperties() : e._enableProperties()
                }
              }
            }
          }

          yProto._enqueueClient = function (c) {
            if (c === this || !c || typeof c !== 'object') return;
            if (c.deref) c = kRef(c);
            const m = this.__dataPendingClients || (this.__dataPendingClients = []);
            if (!c[wk]) c[wk] = mWeakRef(c);
            m.push(c[wk]);
          }

        }
      }



    }
    const setupRendering = function () {

      const cnt = this;
      const cProto = Reflect.getPrototypeOf(cnt);
      let yProto = Reflect.getPrototypeOf(cProto);

      const yProtos = new Set();

      if (!yMap.has(yProto)) {
        // capture all ancenstor constructors of a and b (non-specific component type)

        do {
          if (yProto === Object.prototype || yProto === null) break;
          if (yProto === Element.prototype || yProto === Node.prototype || yProto === EventTarget.prototype || yProto === HTMLElement_.prototype) break;
          yProtos.add(yProto);
          yProto = Reflect.getPrototypeOf(yProto);
        } while (!yProtos.has(yProto));

        for (const yProto of yProtos) {
          yMap.add(yProto);
          setupYProto(yProto)
        }

      }


      if (!cMap.has(cProto)) {
        cMap.add(cProto); // cProto constrcutor is either a or b?  (specific component type)
        setupCProto(cProto);
      }

    }

    /*

    jF = function(M) {
            var d = YNV.call(this) || this;
            d._configureProperties(M);
            d.root = d._stampTemplate(d.__dataHost);
            var N = [];
            d.children = N;
            for (var R = d.root.firstChild; R; R = R.nextSibling)
                N.push(R),
                R.__templatizeInstance = d;
            d.__templatizeOwner && d.__templatizeOwner.__hideTemplateChildren__ && d._showHideChildren(!0);
            N = d.__templatizeOptions;
            (M && N.instanceProps || !N.instanceProps) && d._enableProperties();
            return d
        };
        */

    const sb1 = Symbol();
    Object.defineProperty(Object.prototype, 'root', {
      get() {
        return this[sb1];
      },
      set(nv){
        const p = this ? kRef(this) : null;
        const mv = nv ? kRef(nv) : null;

        // if (typeof (this.host || 0) === 'object' && !this.host6833) {
        //   const host = this.host;
        //   if (!host[wk]) host[wk] = mWeakRef(host);
        //   this.host6833 = host[wk];
        //   delete this.host;
        //   console.log(21883, host)
        //   Object.defineProperty(this, 'host', {
        //     get() {
        //       return kRef(this.host6833);
        //     },
        //     set(nv) {
        //       if (!nv) {
        //         this.host6833 = nv;
        //       } else {
        //         if (!nv[wk]) nv[wk] = mWeakRef(nv);
        //         this.host6833 = nv[wk];
        //       }
        //       return true;
        //     }, enumerable: false, configurable: true
        //   });
        // }

        if (mv && (mv instanceof Node) && !p.__setupRendered399__) {
          p.__setupRendered399__ = true;
          setupRendering.call(p);
        }
        if (mv && mv.is && !mv.__setupRendered399__) {
          mv.__setupRendered399__ = true;
          setupRendering.call(mv);
        }

        this[sb1] = nv;
        return true;
      }
    });


  }

  let _cssSheet = null;
  const addNewCSS = typeof CSSStyleSheet !== 'undefined' && document.adoptedStyleSheets ? (css) => {
    if (!_cssSheet) {
      _cssSheet = new CSSStyleSheet();
      document.adoptedStyleSheets.push(_cssSheet);
    }
    _cssSheet.insertRule(`${css}`);
  } : (css) => {
    let nonce = document.querySelector('style[nonce]');
    nonce = nonce ? nonce.getAttribute('nonce') : null;
    const st = document.createElement('style');
    if (typeof nonce === 'string') st.setAttribute('nonce', nonce);
    st.textContent = `${css}`;
    let parent;
    if (parent = document.head) parent.appendChild(st);
    else if (parent = (document.body || document.documentElement)) parent.insertBefore(st, parent.firstChild);
  }

  function getTranslate() {

    pLoad.then(() => {
      addNewCSS(".yt-formatted-string-block-line{display:block;}");
    });

    const snCache = new Map();

    if (TRANSLATE_DEBUG) {
      console.log(11)
    }

    /** @type {(str: string?) => string} */
    function _snippetText(str) {
      // str can be underfinded
      if (!str || typeof str !== 'string') return '';
      let res = snCache.get(str);
      if (res === undefined) {
        let b = false;
        res = str.replace(/[\s\u3000\u200b]*[\u200b\xA0\x20\n]+[\s\u3000\u200b]*/g, (m) => {
          b = true;
          return m.includes('\n') ? '\n' : m.replace(/\u200b/g, '').replace(/[\xA0\x20]+/g, ' ');
        });
        res = res.replace(/^[\s\u3000]+|[\u3000\s]+$/g, () => {
          b = true;
          return '';
        });
        if (b) {
          snCache.set(str, res);
          snCache.set(res, null);
        } else {
          res = null;
          snCache.set(str, null);
        }
      }
      return res === null ? str : res;
    }

    /** @type {(snippet: Object) => string} */
    function snippetText(snippet) {
      let runs = snippet.runs;
      const n = runs.length;
      if (n === 1) return _snippetText(runs[0].text);
      let res = new Array(n);
      let ci = 0;
      for (const s of runs) {
        res[ci++] = _snippetText(s.text);
      }
      return res.join('\n');
    }

    const _DEBUG_szz = (t) => t.map(x => {
      const tsr = x.transcriptSegmentRenderer;
      return ({
        t: tsr.snippet.runs.map(x => x.text).join('//'),
        a: tsr.startMs,
        b: tsr.endMs
      });
    });

    const fixRuns = (runs) => {
      if (runs.length === 1 && runs[0]?.text?.includes('\n')) {
        // https://www.youtube.com/watch?v=dmHJJ5k_G-A
        const text = runs[0].text;
        const nlc = text.includes('\r\n') ? '\r\n' : text.includes('\n\r') ? '\n\r' : text.includes('\r') ? '\r' : '\n';
        const s = text.split(nlc);
        let bi = 0;
        runs.length = s.length;
        for (const text of s) {
          runs[bi++] = { ...runs[0], text, ...{blockLine: true} };
        }
      }
      for (const s of runs) {
        s.text = _snippetText(s.text);
      }
    }

    function translate(initialSegments) {
      // 2023.07.13 - fix initialSegments with transcriptSectionHeaderRenderer

      if (!initialSegments) return initialSegments;

      if (TRANSLATE_DEBUG) {
        console.log(12);
        Promise.resolve(JSON.stringify(initialSegments)).then((r) => {
          let obj = JSON.parse(r);
          console.log(7558, 1, obj)
          return obj;
        }).then(p => {
          let obj = _DEBUG_szz(p)
          console.log(7558, 2, obj)
        })
      }


      //let mapRej = new WeakSet();

      const n1 = initialSegments.length;
      if (!n1) return fRes;
      let n2 = 0;


      const fRes = new Array(n1);
      // -----------------------------------------------------------------------------------------

      const s8 = Symbol();

      {

        /** @type {Map<String, Object>} */
        let cacheTexts = new Map(); // avoid duplicate with javascript object properties

        // /-* * @type {Map<String, number>} *-/
        // let mh1 = new Map(); // avoid duplicate with javascript object properties
        // 1: ok
        // 2: abandoned effect text

        for (const initialSegment of initialSegments) {
          const transcript = (initialSegment || 0).transcriptSegmentRenderer;
          if (!transcript) {
            // https://www.youtube.com/watch?v=dmHJJ5k_G-A - transcriptSectionHeaderRenderer
            fRes[n2++] = initialSegment;
            continue;
          }
  
          const runs = transcript.snippet.runs
          if (!runs || runs.length === 0) {
            initialSegment[s8] = true;
            continue;
          }
  
  
          let startMs = (+transcript.startMs || 0); //integer
          let endMs = (+transcript.endMs || 0); //integer
  
          if (startMs === endMs) {
            // effect text
            // https://www.youtube.com/watch?v=Ud73fm4Uoq0
            //mapRej.add(initialSegment)
            continue;
          }
          if (endMs - startMs < 30) {
            continue;
          }
  
          const text = snippetText(transcript.snippet);
          const hEntry = cacheTexts.get(text);
          const mh1e = hEntry === undefined ? 0 : hEntry === null ? 2 : 1;
          if (mh1e === 2) continue;
  
          const entry = {
            startMs,
            endMs,
            initialSegment,
            text
          };
  
          if (mh1e === 0) {
  
            if (/^[,.\x60\x27\x22\u200b\xA0\x20;-]*$/.test(text)) {
              initialSegment[s8] = true;
              cacheTexts.set(text, null);
              //effect only
              // https://www.youtube.com/watch?v=zLak0dxBKpM
              //mapRej.add(initialSegment)
              continue;
            }
          } else if (hEntry) {

            const timeDiff = entry.startMs - hEntry.endMs;
            let shouldMerge = false;

            if (timeDiff >= 0) {

              if (timeDiff < 25) {
                shouldMerge = true;
              } else if (timeDiff < 450 && entry.endMs - entry.startMs < 900) {
                shouldMerge = true;
              } else if (timeDiff < 150 && entry.endMs - entry.startMs > 800) {
                shouldMerge = true;
              }

              if (shouldMerge && hEntry.endMs <= endMs && startMs <= endMs) {
                // abandon the current entry.
                // absorbed by previous entry
                hEntry.endMs = entry.endMs;
                hEntry.initialSegment.transcriptSegmentRenderer.endMs = entry.initialSegment.transcriptSegmentRenderer.endMs; // update fRes & initialSegments as well using object reference
                //mapRej.add(entry.initialSegment);
                continue;
              }

            } else if (entry.startMs < hEntry.startMs && hEntry.startMs < entry.endMs) {

              // abandon the current entry.
              // absorbed by previous entry
              if (entry.endMs > hEntry.endMs) {
                hEntry.endMs = entry.endMs;
                hEntry.initialSegment.transcriptSegmentRenderer.endMs = entry.initialSegment.transcriptSegmentRenderer.endMs; // update fRes & initialSegments as well using object reference
              }
              //mapRej.add(entry.initialSegment);
              continue;

            }

          }
  
          //if not abandoned
          cacheTexts.set(text, entry); //replace the previous valid entry object if any
  
          // for (const s of runs) {
          //   s.text = _snippetText(s.text);
          // }
          fixRuns(runs);
  
          fRes[n2++] = initialSegment;
  
        }

        // cacheTexts.clear(); // let GC do it.
        cacheTexts = null;
        // mh1.clear(); // let GC do it.
        // mh1 = null;

      }

      const si_length = fRes.length = n2;
      const sj_length = n1;

      if (si_length !== sj_length) { // for equal length, no fix is required & ignore spacing fix
       
        // collect the abandon text to become second subtitle

        let sj_start = 0;
        let invalid_sj = -1;
        for (let si = 0; si < si_length; si++) {
          const segment = fRes[si];
          let transcript = segment.transcriptSegmentRenderer;
          if (!transcript) continue; // e.g. transcriptSectionHeaderRenderer
          const runs = transcript.snippet.runs;
          // fixRuns(runs);
          if (runs.length > 1 || runs[0].text.includes('\n')) continue; // skip multi lines
          const main_startMs = (+transcript.startMs || 0);
          const main_endMs = (+transcript.endMs || 0);
          transcript = null;

          /** @type {Map<string, number>} */
          let tMap = new Map(); // avoid duplicate with javascript object properties

          // assume that it is asc-ordered array of key startMs;
          for (let sj = sj_start; sj < sj_length; sj++) {
            const initialSegment = initialSegments[sj];

            if (!initialSegment || initialSegment[s8]) continue; // should invalid_sj be set ?

            const tSegment = initialSegment.transcriptSegmentRenderer;

            if (!tSegment) {
              // https://www.youtube.com/watch?v=dmHJJ5k_G-A - transcriptSectionHeaderRenderer
              invalid_sj = sj; // should invalid_sj be set ?
              continue;
            }

            const startMs = (+tSegment.startMs || 0)
            const isStartValid = startMs >= main_startMs;
            if (!isStartValid) {
              invalid_sj = sj;
              continue;
            }
            // isStartValid must be true
            if (startMs > main_endMs) {
              sj_start = invalid_sj + 1;
              break;
            }

            const endMs = (+tSegment.endMs || 0)
            if (endMs <= main_endMs) {
              const mt = snippetText(tSegment.snippet);
              const prev = tMap.get(mt);
              if (endMs >= startMs) {
                tMap.set(mt, (prev || 0) + 1 + (endMs - startMs));
              }
            }

          }

          if (tMap.size <= 1) continue; // no second line
          let rg = [...tMap.entries()]; // N x 2 2D-array [string,number][]
          tMap = null;

          // https://www.youtube.com/watch?v=Ud73fm4Uoq0

          rg.sort((a, b) => b[1] - a[1]); //descending order of number

          let targetZ = rg[1][1];
          if (targetZ > 4) {
            let az = 0;
            let fail = false;
            for (let idx = 2, rgl = rg.length; idx < rgl; idx++) {
              az += rg[idx][1];
              if (az >= targetZ) {
                fail = true;
                break;
              }
            }
            if (!fail) {
              const rgA = rg[0][0];
              const rgB = rg[1][0];
              const isDiff = rgB.replace(/\s/g, '') !== rgA.replace(/\s/g, '');
              if (isDiff && rgA === _snippetText(runs[0].text)) {
                if (runs[0] && runs[0].text) runs[0].blockLine = true;
                runs.push({ text: rgB, blockLine: true });
              }
            }
          }
          rg = null;
        }

        TRANSLATE_DEBUG && Promise.resolve(fRes).then((r) => {

          let obj = r;
          console.log(7559, 1, obj)
          return obj;
        }).then(p => {
          let obj = _DEBUG_szz(p)
          console.log(7559, 2, obj)

        });
      }

      // -----------------------------------------------------------------------------------------
      snCache.clear();
      return fRes;

    }


    return translate

  }


  let translateFn = null;

  FIX_TRANSCRIPT_SEGMENTS && !isChatRoomURL && (() => {

    const wmx = new WeakMap();

    function fixSegments(ytObj) {
      let a, b;
      let seg = ((a = ytObj.data) == null ? void 0 : a[b = 'searchResultSegments']) || ((a = ytObj.data) == null ? void 0 : a[b = 'initialSegments']) || [];
      if (!seg || !a || !b || typeof (seg || 0) !== 'object' || !Number.isFinite(seg.length * 1)) return;
      translateFn = translateFn || getTranslate();
      let cSeg;
      cSeg = wmx.get(seg);
      if (!cSeg) {
        let vSeg = null;
        try {
          vSeg = translateFn(seg);
        } catch (e) {
        }
        if (seg && typeof seg === 'object' && seg.length >= 1 && vSeg && typeof vSeg === 'object' && vSeg.length >= 1) {
          // console.log('translated', vSeg);
          cSeg = vSeg;
          wmx.set(seg, cSeg);
          wmx.set(cSeg, cSeg);
        }
      }
      if (cSeg && cSeg !== seg) {
        a[b] = cSeg;
      }
    }

    const dfn = Symbol();
    const Object_ = Object;
    Object_[dfn] = Object_.defineProperties;
    let activation = true;
    Object_.defineProperties = function (obj, pds) {
      let segments, get_;
      if (activation && pds && (segments = pds.segments) && (get_ = segments.get)) {
        activation = false;
        segments.get = function () {
          fixSegments(this);
          return get_.call(this);
        };
      }
      return Object_[dfn](obj, pds);
    };

  })();


  let pf31 = new PromiseExternal();

  // native RAF
  let __requestAnimationFrame__ = typeof webkitRequestAnimationFrame === 'function' ? window.webkitRequestAnimationFrame.bind(window) : window.requestAnimationFrame.bind(window);

  // 1st wrapped RAF
  const baseRAF = (callback) => {
    return p59 ? __requestAnimationFrame__(callback) : __requestAnimationFrame__((hRes) => {
      pf31.then(() => {
        callback(hRes);
      });
    });
  };

  // 2nd wrapped RAF
  window.requestAnimationFrame = baseRAF;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;
  const inup = o => {
    if (!o) return null;
    let instance = null, t;
    if ((t = o.__instance) && t.props) instance = t;
    else if ((t = o.instance) && t.props) instance = t;
    else if ((t = insp(o)) && t.props) instance = t;
    else if ((t = (o)) && t.props) instance = t;
    return instance;
  };

  const prototypeInherit = (d, b) => {
    const m = Object.getOwnPropertyDescriptors(b);
    for (const p in m) {
      if (!Object.getOwnPropertyDescriptor(d, p)) {
        Object.defineProperty(d, p, m[p]);
      }
    }
  };


  const firstObjectKey = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') return key;
    }
    return null;
  };

  function searchNestedObject(obj, predicate, maxDepth = 64) {
    // normal case: depth until 36
    const result = [];
    const visited = new WeakSet();

    function search(obj, depth) {
      visited.add(obj);
      for (const [key, value] of Object.entries(obj)) {
        // Recursively search nested objects and arrays
        if (value !== null && typeof value === 'object') {
          // Prevent infinite loops by checking if the object is already visited or depth exceeded
          if (depth + 1 <= maxDepth && !visited.has(value)) {
            search(value, depth + 1);
          }
        } else if (predicate(value)) {
          result.push([obj, key]);
        }
      }
    }

    typeof (obj || 0) === 'object' && search(obj, 0);
    return result;
  }

  /** @type {(o: Object | null) => WeakRef | null} */
  const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null);

  /** @type {(wr: Object | null) => Object | null} */
  const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

  const isIterable = (obj) => (Symbol.iterator in Object_(obj));

  if (typeof Document.prototype.requestStorageAccessFor === 'function') {
    if (DENY_requestStorageAccess) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/requestStorageAccessFor
      Document.prototype.requestStorageAccessFor = undefined;
      console.log('[yt-js-engine-tamer]', 'requestStorageAccessFor is removed.');
    } else if (DISABLE_IFRAME_requestStorageAccess && window !== top) {
      Document.prototype.requestStorageAccessFor = function () {
        return new Promise((resolve, reject) => {
          reject();
        });
      };
    }
  }

  const traceStack = (stack) => {
    let result = new Set();
    let p = new Set();
    let u = ''
    for (const s of stack.split('\n')) {
      if (s.split(':').length < 3) continue;
      let m = /(([\w-_\.]+):\d+:\d+)[^:\r\n]*/.exec(s);
      if (!m) continue;
      p.add(m[2]);
      if (p.size >= 3) break;
      if(!u) u = m[2];
      else if(p.size === 2 && u && u=== m[2]) break;
      result.add(s);
    }
    return [...result].join('\n');
  }

  if (FIX_bind_self_this && !Function.prototype.bind488 && !Function.prototype.bind588) {
    // window.m3bb = new Set();

    // const smb = Symbol();
    const vmb = 'dtz02' // Symbol(); // return kThis for thisArg
    const vmc = 'dtz04' // Symbol(); // whether it is proxied fn
    const vmd = 'dtz08' // Symbol(); // self fn proxy (fn--fn)

    const thisConversionFn = (thisArg) => {
      if (!thisArg) return null;
      const kThis = thisArg[vmb];
      if (kThis) {
        const ref = kThis.ref;
        return (ref ? kRef(ref) : null) || null;
      }
      return thisArg;
    }

    const pFnHandler2 = {
      get(target, prop) {
        if (prop === vmc) return target;
        return Reflect.get(target, prop);
      },
      apply(target, thisArg, argumentsList) {
        thisArg = thisConversionFn(thisArg);
        if (thisArg) return Reflect.apply(target, thisArg, argumentsList);
      }
    }


    const proxySelfHandler = {
      get(target, prop) {
        if(prop === vmb) return target;
        const ref = target.ref;
        const cnt = kRef(ref);
        if (!cnt) return;
        if (typeof cnt[prop] === 'function' && !cnt[prop][vmc] && !cnt[prop][vmb]) {
          if (!cnt[prop][vmd]) cnt[prop][vmd] = new Proxy(cnt[prop], pFnHandler2);
          return cnt[prop][vmd];
        }
        return cnt[prop];
      },
      set(target, prop, value) {
        const cnt = kRef(target.ref);
        if (!cnt) return true;
        if(value && (value[vmc] || value[vmb])){
          cnt[prop] = value[vmc] || thisConversionFn(value);
          return true;
        }
        cnt[prop] = value;
        return true;
      }
    };

    const weakWrap = (thisArg) => {
      thisArg = thisConversionFn(thisArg);
      if (!thisArg) {
        console.error('thisArg is not found');
        return null;
      }
      return new Proxy({ ref: mWeakRef(thisArg) }, proxySelfHandler);
    }

    if (!window.getComputedStyle533 && typeof window.getComputedStyle === 'function') {
      window.getComputedStyle533 = window.getComputedStyle;
      window.getComputedStyle = function (a, ...args) {
        a = thisConversionFn(a);
        if (a) {
          return getComputedStyle533(a, ...args);
        }
        return null;
      }
    }

    Function._count_bind_00 = 0;
    // Function._count_bind_01 = 0;

    // let matchNativeCode = (Object+"");
    // let matchNativeCode1 = matchNativeCode.includes("[native code]");
    // let matchNativeLen = matchNativeCode.length  - Object.name.length;

    // const matchConstructor = (thisArg) => {
    //   const f = `${(thisArg || 0).constructor}`;
    //   if (f.length > 45) return true;
    //   if (matchNativeCode1 && f.length - thisArg.constructor.name.length === matchNativeLen) {
    //     if (f.includes('[native code]')){
    //       return false;
    //     }
    //     return true;
    //   }
    //   return false;
    // }

    // const acceptThis = (thisArg)=>{
    //   // if(!thisArg || typeof thisArg !=='object') return false;
    //   // // if((((thisArg||0).constructor||0).name || 'XXXXXXXX').length < 3) return true;
    //   // if(typeof thisArg.path === 'string') return true;
    //   // if(typeof thisArg.fn === 'function') return true;
    //   // if(typeof thisArg.id === 'string') return true;
    //   // if(typeof thisArg.isLoaded === 'boolean') return true;
    //   return false;
    // }

    const patchFn = (fn) => {

      let s = `${fn}`;
      if (s.length < 11 || s.includes('\n')) return false;
      if(s.includes('bind(this')) return true;
      if(s.includes('=this') && /[,\s][a-zA-Z_][a-zA-Z0-9_]*=this[;,]/.test(s) ) return true;
      // var a=this;
      // f.bind(this)


      return false;
    }

    Function.prototype.bind488 = Function.prototype.bind;
    Function.prototype.bind = function(thisArg, ...args){

      if (thisConversionFn(thisArg) !== thisArg) {
        return this.bind488(thisArg, ...args);
      }
      if( thisArg && patchFn(this) ){

        // console.log(599,`${this}`)

        try {
          // let b1 = thisArg && typeof thisArg === 'object' && typeof thisArg.isAttached === 'boolean' && !thisArg.dtz06; // ready cnt
          // let b2 = !b1 && thisArg && (thisArg instanceof Node) && typeof thisArg.nodeName === 'string' && !thisArg.dtz06; // dom
          // let b3 = !b1 && !b2 && thisArg && typeof thisArg === 'object' && typeof thisArg.is === 'string' && !thisArg.dtz06; // init stage ?
          // // let b4 = !b1 && !b2 && !b3 && thisArg && typeof thisArg === 'object' && !thisArg.dtz06 && matchConstructor(thisArg);
          // // let b5 = !b1 && !b2 && !b3 && !b4 && thisArg && typeof thisArg === 'object' && !thisArg.dtz06 && acceptThis(thisArg);
          // // let b5 = !b1 && !b2 && !b3 && thisArg && typeof thisArg === 'object' && !thisArg.dtz06  && !(thisArg instanceof Window);
          // // let b4 = false;
          // let b4 =  !b1 && !b2 && !b3 && thisArg && !thisArg.dtz06;

          // // b3 = false;
          // // b4 = false;
          // // b5 = false;

          // if (b1 || b2 || b3 ||b4  ) {
            const f = this;
            const ps = thisArg.__proxySelf0__ || (thisArg.__proxySelf0__ = weakWrap(thisArg));
            if (ps && ps[vmb]) {
              Function._count_bind_00++;
              return f.bind488(ps, ...args)
            }
          // }
        } catch (e) {
          console.warn(e)
         }
      }
      return this.bind488(thisArg, ...args);
    }
    Function.prototype.bind588 = 1;
  }

  const ytSchedulerMethods = {
    addJob(a, b, c) {
      const instance = typeof yt !== 'undefined' ? ((yt || 0).scheduler || 0).instance : null;
      if (instance) {
        return instance.addJob(a, b, c);
      } else {
        return setTimeout(a, c);
      }
    },
    addImmediateJob(a) {
      const instance = typeof yt !== 'undefined' ? ((yt || 0).scheduler || 0).instance : null;
      if (instance) {
        return instance.addImmediateJob(a);
      } else {
        a();
      }
    },
    cancelJob(id) {
      const instance = typeof yt !== 'undefined' ? ((yt || 0).scheduler || 0).instance : null;
      if (instance) {
        return instance.cancelJob(id);
      } else {
        return clearTimeout(id);
      }
    }
  };

  if (FIX_ytScheduler) {

    let ytSchedulerFixed = 0;
    // let ytActioned = false;
    // let pr = new PromiseExternal();

    // const hn = function () {

    //   document.removeEventListener('yt-action', hn, true);
    //   nextBrowserTick_(() => {
    //     ytActioned = true;
    //     pr.resolve();
    //   });

    // }
    // document.addEventListener('yt-action', hn, true);

    // let cancelStore = {}; // tbc

    // yt.scheduler.instance.addJob
    const fixAddJob = (nv) => {

      /*
      
          function Z() {
              var a = w("ytglobal.schedulerInstanceInstance_");
              if (!a || a.s)
                  a = new M(I("scheduler") || {}),
                  x("ytglobal.schedulerInstanceInstance_", a);
              return a
          }
      
          */

      /*
      
      
          function R(a, b, c, d) {
              ++a.D;
              if (c === 10)
                  return P(a, b),
                  a.D;
              var e = a.D;
              a.h[e] = b;
              a.l && !d ? a.u.push({
                  id: e,
                  priority: c
              }) : (a.i[c].push(e),
              a.C || a.l || (a.g !== 0 && S(a) !== a.m && T(a),
              a.start()));
              return e
          }
      
          */

      /*
      
          function sa(a, b, c) {
              if (!c)
                  return c = c === void 0,
                  -R(Z(), a, b, c);
              var d = window.setTimeout(function() {
                  var e = R(Z(), a, b);
                  W[d] = e
              }, c);
              return d
          }
      
          */
      window.originalAddJob = nv;
      // const q1 = new PromiseExternal();
      // const q2 = new PromiseExternal();
      // let uu = 0;
      // let q3 = 0;
      // let mof = null;
      // const mo = new MutationObserver((mutation, observer) => {
      //   if (mof) {
      //     if (mof() === true) {
      //       observer.disconnect();
      //       mof = null;
      //     }
      //   }
      // });

      let lenSkip = -1;
      let lastLen = null;
      let fetchCommentJobTimerId = 0;
      let requestFinish = false;

      const fetchCommentJobDone = ()=>{
        clearInterval(fetchCommentJobTimerId);
        fetchCommentJobTimerId = 0;
        console.log('[yt-js-engine-tamer] fetchCommentJob done');
      }

      const fetchCommentJob = (a, cid) => {

        // if (cid && cancelStore[cid]) return; // tbc

          if(fetchCommentJobTimerId > 0){
            fetchCommentJobDone();
          }

        // if (mof) {
        //   console.log('[yt-js-engine-tamer] fetchCommentJob done');
        //   mof = null;
        // }

        let f = a;

        const selector = 'ytd-comments, ytd-comments > *, ytd-comments [id] > *, ytd-comments ytd-continuation-item-renderer';

        console.log('[yt-js-engine-tamer] fetchCommentJob start');

        lastLen = -1;
        let u = 0;
        let g = () => {
          if (requestFinish) lastLen = -1;
          const lastLen_ = lastLen;
          const len1 = lastLen = document.querySelectorAll(selector).length;
          let mm = true;
          let ff = false; 
          if (len1 !== lastLen_) {
            u = 0;
            f();
            const len2 = lastLen = document.querySelectorAll(selector).length;
            if (len2 !== len1) {
              ff = true;
              mm = false;
            }
          }
          if (mm) {
            ++u;
            if (u > 10 || document.querySelector('ytd-comments:not([hidden]) [id]')) {
              ff = true;
            }
          }

          if (requestFinish) {
            requestFinish = false;
            fetchCommentJobDone();
          } else if (ff){
            fetchCommentJobDone();
          }

        }


        fetchCommentJobTimerId = setInterval(g, 80);
        // g(9);
        // if (lastLen === lenSkip) {
        //   console.log('[yt-js-engine-tamer] fetchCommentJob done');
        //   g = f = null;
        //   return;
        // }
        // console.log('[yt-js-engine-tamer] fetchCommentJob done');
        // const q1 = lastLen;
        // mof = () => {
        //   const q2 = document.querySelectorAll(selector).length;
        //   if (q1 === q2) return;
        //   fetchCommentJobTimerId = setTimeout(g, 80);
        //   g = null;
        //   return true;
        // }
        // mo.observe(document, { childList: true, subtree: true });

      }

      // let pr72 = Promise.resolve();


      let qa = null;
      let qasf = '';


      document.addEventListener("fullscreenchange", (evt) => {
        if (evt.isTrusted !== true) return;
        if (qa) {
          // qa();
          nextBrowserTick_(qa);
        }
        // const pr = new Promise(resolve => { setTimeout(resolve, 94.25) });
        // pr72 = pr72.then(() => {
        //   return pr
        // });
      }, true);

      window.addEventListener("resize", (evt) => {
        if (evt.isTrusted !== true) return;
        if (qa) {
          // qa();
          nextBrowserTick_(qa);
        }
        // const pr = new Promise(resolve => { setTimeout(resolve, 94.25) });
        // pr72 = pr72.then(() => {
        //   return pr
        // });
      }, true);


      setInterval(() => {
        const f = qa;
        if (typeof f !== 'function') return;
        qa = null;
        // pr72 = pr72.then(() => {
        //   f();
        // });
        // nextBrowserTick_(()=>{
        f();
        // });
      }, 475.25);



      return function (a, b, c) {


        const f = a;
        // const g = ()=>{
        //   pr72 = pr72.then(()=>{
        //     f();
        //   });
        // }

        if (!c) return arguments.length < 3 ? nv(f, b) : nv(f, b, c);

        const c_ = c;

        if (c > 0.25 && (c % 1) === 0) c -= 0.125;

        if (b === 1 && c_ === 500) {
          const sf = `${a}`;
          if (qasf ? (sf === qasf) : (sf.includes('.mediaElement') && sf.includes('.getCurrentTime') && sf.includes('.seekTo'))) {
            qasf = sf;
            qa = a;
            // console.log(12883, a)
            return nv(() => {
              if (qa === a) {
                qa = null;
                a();
              }
            }, b, c);
          }
        }


        if (!b && c_ === 5000 && `${a}`.includes('.cleanupJob=0')) {
          // console.log('[yt-js-engine-tamer] cleanupJob 01');
          // const pr = new Promise(resolve => { setTimeout(resolve, 94.25) });
          // pr72 = pr72.then(() => {
          //   return pr
          // });
          // try {
            // yt.scheduler.instance.cancelAllJobs();
            // yt.scheduler.instance.dispose();
            // if(ytglobal.schedulerInstanceInstance_) ytglobal.schedulerInstanceInstance_.dispose();
            // console.log('[yt-js-engine-tamer] cleanupJob 02');
          // } catch (e) { }
          return  nv(f, b, c);
        }

        // if(!b && c > 50) c = 50;
        // console.log(58372,a,b,c)
        // function(){xxx(xxx)}
        if (!b && c_ === 1000 && `${a}`.length <= 20 && a.name === '' && /function\(\)\{\w{1,3}\(\w{1,3}\)\}/.test(`${a}`)) {

          /*

            V.setCommentsJobId = _.et(_.r0, function() {
                F5V(V)
            }, 1E3)

            */

            requestFinish = false;
          const cid = nv(() => { if(fetchCommentJobTimerId > 0) requestFinish = true;}, b, 1000);

          // lastLen = null;
          fetchCommentJob(a, cid);

          // queueMicrotask_(a);
          // nextBrowserTick_(a);
          // a(); // no need to delay
          return cid

          // return nv(a, b, 1.125);
          
          // const cid = window.setTimeout(() => {
          //   nextBrowserTick_(() => {
              
          //     if (cancelStore[cid]) {
          //       console.log('task cancelled');
          //       return;
          //     }
          //     a();

          //   });
          // }, 0.125);
          
          // return cid;
        } else {



          return nv(f,b,c);


          // if (c > 2400) c = 2400;
          // else if (c > 800) c = 800;
          // if (c > 0.2 && (c % 1) === c) c -= 0.125;
          // if (0 && ytActioned && !b) {
          //   const cid = window.setTimeout(() => {
          //     nextBrowserTick_(() => {
          //       if (cancelStore[cid]) {
          //         console.log('task cancelled');
          //         return;
          //       }
          //       a();
          //     });
          //   }, c);
          //   return cid;
          // } else {
          //   return nv(a, b, c);
          // }

        }
      }
    }

    const fixCancelJob = (nv) => {


      window.originalCancelJob = nv;
      return function (a) {
        if (a < 0) return nv(a);
        // cancelStore[a] = true; // tbc
        nv(a);
      }
    }

    const sk44 = Symbol();
    Object.defineProperty(Object.prototype, 'addJob', {
      get() {
        return this[sk44];
      },
      set(nv) {
        if (typeof nv === 'function' && !(ytSchedulerFixed & 1) && typeof yt !== 'undefined' && this === ((yt || 0).scheduler || 0).instance) {
          ytSchedulerFixed |= 1;
          nv = fixAddJob(nv);
        }
        this[sk44] = nv;
        return true;
      },
      enumerable: false,
      configurable: true
    });



    const sk45 = Symbol();
    Object.defineProperty(Object.prototype, 'cancelJob', {
      get() {
        return this[sk45];
      },
      set(nv) {
        if (typeof nv === 'function' && !(ytSchedulerFixed & 2) && typeof yt !== 'undefined' && this === ((yt || 0).scheduler || 0).instance) {
          ytSchedulerFixed |= 2;
          nv = fixCancelJob(nv);
        }
        this[sk45] = nv;
        return true;
      },
      enumerable: false,
      configurable: true
    });



    if (typeof yt !== 'undefined' && this === ((yt || 0).scheduler || 0).instance) {
      const { addJob, cancelJob } = yt.scheduler.instance;
      if (addJob) {
        yt.scheduler.instance.addJob = null;
        yt.scheduler.instance.addJob = addJob;
      }
      if (cancelJob) {
        yt.scheduler.instance.cancelJob = null;
        yt.scheduler.instance.cancelJob = cancelJob;
      }
    }


  }

  const isWatchPageURL = (url) => {
    url = url || location;
    return location.pathname === '/watch' || location.pathname.startsWith('/live/')
  };

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

  FIX_perfNow && performance.timeOrigin > 9 && (() => {
    if (performance.now23 || performance.now16 || typeof Performance.prototype.now !== 'function') return;
    const f = performance.now23 = Performance.prototype.now;

    let k = 0; // 0 <= k < 9998m
    let u = 0;
    let s = ((performance.timeOrigin % 7) + 1) / 7 - 1e-2 / 7; // s > 0.14

    // By definition, performance.now() is mono increasing.
    // Fixing in YouTube.com is required to ensure performance.now() is strictly increasing.
    performance.now = performance.now16 = function () {
      /**
       * Bug 1842437 - When attempting to go back on youtube.com, the content remains the same
       *
       * If consecutive session history entries had history.state.entryTime set to same value,
       * back button doesn't work as expected. The entryTime value is coming from performance.now()
       * and modifying its return value slightly to make sure two close consecutive calls don't
       * get the same result helped with resolving the issue.
       */
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=1756970
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=1842437

      const v = typeof (this || 0).now23 === 'function' ? this.now23() + s : f.call(performance) + s; // v > 0.14
      if (u + 0.0015 < (u = v)) k = 0; // note: hRes should be accurate to 5 µs in isolated contexts
      else if (k < 0.001428) k += 1e-6 / 7; // M = 10000 * m; m * 9996 = 0.001428
      else { // more than 9998 consecutive calls
        /**
         *
         * max no. of consecutive calls
         *
         * Sample Size: 4800
         * Sample Avg = 1565.375
         * Sample Median = 1469.5
         * Sample Max = 5660 << 7500 << 9999
         *
         *
         *  */
        k = 0;
        s += 1 / 7;
      }
      return v + k; // 0 < v - M < v - M + k < v
    }

    let loggerMsg = '';
    if (`${performance.now()}` === `${performance.now()}`) {
      const msg1 = 'performance.now is modified but performance.now() is not strictly increasing.';
      const msg2 = 'performance.now cannot be modified and performance.now() is not strictly increasing.';
      loggerMsg = performance.now !== performance.now16 ? msg1 : msg2; // might not able to set in Firefox
    }
    loggerMsg && console.warn(loggerMsg);
  })();

  // let __forceRemoveMode__ = false;
  FIX_removeChild && (() => {
    if (typeof Node.prototype.removeChild === 'function' && typeof Node.prototype.removeChild062 !== 'function') {
      let internalByPass = false;
      const fragD = document.createDocumentFragment();
      fragD.appendChild4201 = fragD.appendChild;
      fragD.removeChild4201 = fragD.removeChild;
      Node.prototype.removeChild062 = Node.prototype.removeChild;
      Node.prototype.removeChild = function (child) {
        try {
          return this.removeChild062(child);
        } catch (e) { }
        if (internalByPass) return child;
        if (this instanceof Node && child instanceof Node && this.nodeType === 11 && child.parentNode !== this && this.contains(child)) { // eg. child = DOM-IF
          let idx = (this.childNodes || 0).length >= 1 ? this.childNodes.indexOf(child) : -1;
          if (idx >= 0) {
            internalByPass = true;
            child.parentNode !== fragD && fragD.appendChild4201(child);
            this.childNodes[idx] === child && typeof this.childNodes.splice === 'function' && this.childNodes.splice(idx, 1);
            fragD.removeChild4201(child);
            internalByPass = false;
            return child;
          }
        }
        // if (this instanceof Node && child instanceof Node && child.parentNode && child.parentNode.nodeType === 11 && child.parentNode !== this && !this.contains(child)) {
        //   // force removal
        //   internalByPass = true;
        //   child.parentNode !== fragD && fragD.appendChild4201(child);
        //   fragD.removeChild4201(child);
        //   internalByPass = false;
        //   return child;
        // }
        if (this && child) {
          if (this.childNodes && this.childNodes.splice) { // tbc
            let idx = (this.childNodes || 0).length >= 1 ? this.childNodes.indexOf(child) : -1;
            if (idx >= 0) {
              internalByPass = true;
              child.parentNode !== fragD && fragD.appendChild4201(child);
              this.childNodes[idx] === child && typeof this.childNodes.splice === 'function' && this.childNodes.splice(idx, 1);
              fragD.removeChild4201(child);
              internalByPass = false;
              return child;
            }
          }

          if (child.parentNode !== this && child.parentNode && child.parentNode === child.__shady_parentNode && child.parentNode.nodeType === 11) {
            if (child.isConnected === false && (this.compareDocumentPosition(child) & (1 | 8 | 16)) === 1) {
              // just ignore   (!e.root && a.localName !== "slot" || f === a.__shady_native_parentNode) && f.__shady_native_removeChild(a));
              return child;
            }
          }

          if (child && child.is === 'tp-yt-paper-tooltip' && !child.parentNode && !child.__shady_parentNode) {
            // skip
            return child;
          }

          console.warn('[yt-js-engine-tamer] Node is not removed from parent', {
            parent: this, child: child,
            isParent: child.parentNode === this,
            isParentParent: (child.parentNode || 0).parentNode === this,
            parentNode: child.parentNode,
            shadyParent: child.__shady_parentNode,
            isShadyParent: child.__shady_parentNode === this,
            isAncestor: this instanceof Node && child instanceof Node && this.contains(child)
          });

        }
        return child;
      }
    }
  })();


  FIX_VIDEO_PLAYER_MOUSEHOVER_EVENTS && !isChatRoomURL && (() => {

    const [setIntervalX0, clearIntervalX0] = [setInterval, clearInterval];

    // let cid = 0;

    let mousemoveFn = null;
    let mousemoveDT = 0;
    let mousemoveCount = 0;
    // let qv = false;
    const cif = () => {
      if (!mousemoveFn) return;
      const ct = Date.now();
      if (mousemoveDT + 1200 > ct) { // avoid setTimeout delay too long without execution
        mousemoveFn && mousemoveFn();
      }
      mousemoveFn = null;
    };
    let mousemoveCId = 0;
    let mouseoverFn = null;
    HTMLElement_.prototype.addEventListener4882 = HTMLElement_.prototype.addEventListener;
    HTMLElement_.prototype.addEventListener = function (a, b, c) {
      if (this.id == 'movie_player' && `${a}`.startsWith('mouse') && c === undefined) {
        const bt = `${b}`;
        if (bt.length >= 61 && bt.length <= 71 && bt.startsWith('function(){try{return ') && bt.includes('.apply(this,arguments)}catch(')) {
          b[`__$$${a}$$1926__`] = true;
          this[`__$$${a}$$1937__`] = (this[`__$$${a}$$1937__`] || 0) + 1;
          if (this[`__$$${a}$$1937__`] > 1073741823) this[`__$$${a}$$1937__`] -= 536870911;
          // console.log(3928, a, this[`__$$${a}$$1937__`])
          if (!this[`__$$${a}$$1938__`]) {
            this[`__$$${a}$$1938__`] = b;
            if (a === 'mousemove') {
              this.addEventListener4882('mouseenter', (evt) => {
                if (mousemoveCId) return;
                mousemoveCId = setIntervalX0(cif, 380);
              });
              this.addEventListener4882('mouseleave', (evt) => {
                clearIntervalX0(mousemoveCId);
                mousemoveCId = 0;
              });
            }
            this.addEventListener4882(a, (evt) => {
              const evt_ = evt;
              if (!this[`__$$${a}$$1937__`]) return;
              if (!this[`__$$${a}$$1938__`]) return;
              if (a === 'mousemove') {
                mouseoverFn && mouseoverFn();
                if (mousemoveDT + 350 > (mousemoveDT = Date.now())) {
                  (++mousemoveCount > 1e9) && (mousemoveCount = 9);
                } else {
                  mousemoveCount = 0;
                }
                const f = mousemoveFn = () => {
                  if (f !== mousemoveFn) return;
                  mousemoveFn = null;
                  this[`__$$${a}$$1938__`](evt_);
                };
                if (mousemoveCount <= 1) mousemoveFn();
              } else {
                if (a === 'mouseout' || a === 'mouseleave') {
                  mousemoveFn = null; 
                  mousemoveDT = 0;
                  mousemoveCount = 0;
                  this[`__$$${a}$$1938__`](evt_);
                  mouseoverFn && mouseoverFn();
                } else { // mouseover, mouseenter
                  mousemoveFn = null;
                  mousemoveDT = 0;
                  mousemoveCount = 0;
                  mouseoverFn && mouseoverFn(); // just in case
                  const f = mouseoverFn = () => {
                    if (f !== mouseoverFn) return;
                    mouseoverFn = null;
                    this[`__$$${a}$$1938__`](evt_);
                  }
                  nextBrowserTick_(mouseoverFn);
                }
              }
            }, c);


            return;
          } else {

            return;
          }
        }

      }
      return this.addEventListener4882(a, b, c)
    }




    HTMLElement_.prototype.removeEventListener4882 = HTMLElement_.prototype.removeEventListener;
    HTMLElement_.prototype.removeEventListener = function (a, b, c) {
      if (this.id == 'movie_player' && `${a}`.startsWith('mouse') && c === undefined) {

        if (b[`__$$${a}$$1926__`]) {
          b[`__$$${a}$$1926__`] = false;

          if (this[`__$$${a}$$1937__`]) this[`__$$${a}$$1937__`] -= 1;

          //  console.log(3929, a, this[`__$$${a}$$1937__`], b[`__$$${a}$$1926__`])

          return;

        }

      }
      return this.removeEventListener4882(a, b, c)
    }


  })();


  FIX_DOM_IF_REPEAT && (() => {
    // https://www.youtube.com/s/desktop/26a583e4/jsbin/live_chat_polymer.vflset/live_chat_polymer.js
    // DOM-IF is still a core class of Polymer, so no polymerController is available.
    // Be careful of the mixture of polymer functions and native Element functions
    // Be careful of the coding design is different with the modern Yt elements


    /*


    function Ks(a, b, c) {
        if (kj && !BOa(a))
            throw Error("strictTemplatePolicy: template owner not trusted");
        c = c || {};
        if (a.__templatizeOwner)
            throw Error("A <template> can only be templatized once");
        a.__templatizeOwner = b;
        var d = (b ? b.constructor : Js)._parseTemplate(a)
          , e = d.templatizeInstanceClass;
        e || (e = COa(a, d, c),
        d.templatizeInstanceClass = e);
        var g = BOa(a);
        EOa(a, d, c, g);
        c = function() {
            return e.apply(this, arguments) || this
        }
        ;
        h(c, e);
        c.prototype._methodHost = g;
        c.prototype.__dataHost = a;
        c.prototype.__templatizeOwner = b;
        c.prototype.__hostProps = d.hostProps;
        return c
    }

    */

    // Polymer.enqueueDebouncer

    const s81 = Symbol();
    const s83 = Symbol();
    const s84 = Symbol();
    const s85 = Symbol();
    const s85b = Symbol();
    const s85c = Symbol();

    let renderDebounceTs = null;

    let renderDebouncePromise = null;
    let qp;

    const shadyFlushMO = new MutationObserver(() => {

      if (!renderDebounceTs) return;

      if (renderDebounceTs.size > 0) {
        console.warn('renderDebounceTs.size is incorect', renderDebounceTs.size);
        try {
          Polymer.flush();
          return;
        } catch (e) { }
      }

      renderDebouncePromise && Promise.resolve().then(() => {

        if (renderDebouncePromise) {
          renderDebouncePromise && renderDebouncePromise.resolve();
          renderDebouncePromise = null;
          DEBUG_DBR847 && console.log('__DBR847__ renderDebouncePromise.resolve by MutationObserver')
        }

      });

      // Polymer.flush

      window.ShadyDOM && ShadyDOM.flush();
      window.ShadyCSS && window.ShadyCSS.ScopingShim && window.ShadyCSS.ScopingShim.flush();


    });

    const setupPolymerAdv = () => {
      // here we can obtain the Polymer faster.
      // reserved for future use.
    }


    if (USE_fastDomIf) {
      // 0 = no effect. 1 = enable. 2 = disable
      // fastDomIf because it delayed the rendering process?
      Object.defineProperty(Object.prototype, 'fastDomIf', {
        get() {
          if (this === window.Polymer) {
            const v = USE_fastDomIf === 1 ? true : false;
            this.fastDomIf = v;
            delete Object.prototype.fastDomIf;
            setupPolymerAdv(this);
            return v;
          }
        },
        set(nv) {
          return false;
        }
      });
    }

    let setupDomIfDone = false;
    const setupDomIf = (DomIf)=>{
      setupDomIfDone = true;
      if(setupDomIfDone) return;

      const fProto = DomIf.prototype;


      // Polymer.DomIf
      // Polymer.DomIf = Polymer.fastDomIf ? ZbL : ESz
      // Assume ESz by default

      // We don't need to store "root" in DOM-IF
      if (ENHANCE_DOMIF_createAndInsertInstance && fProto.__createAndInsertInstance && !fProto.__createAndInsertInstance239 && fProto.__createAndInsertInstance.length === 1) {
        fProto.__createAndInsertInstance239 = fProto.__createAndInsertInstance;
        fProto.__createAndInsertInstance = function (M) {
          const r = this.__createAndInsertInstance239(M);
          const __instance = this.__instance;
          const __ctor = this.__ctor;
          if (__instance && __ctor && __instance instanceof __ctor) {
            for (const sym of Object.getOwnPropertySymbols(__instance)) {
              const o = __instance[sym];
              if (o && o.nodeType === 11) {
                __instance[sym] = null;
              }
            }
          }
          return r;
        }

        /*


            sX = function(M, d, N) {
                if (o_ && !vDv(M))
                    throw Error("Jd");
                N = N || {};
                if (M.__templatizeOwner)
                    throw Error("Kd");
                M.__templatizeOwner = d;
                var R = (d ? d.constructor : jF)._parseTemplate(M)
                  , X = R.templatizeInstanceClass;
                X || (X = sfi(M, R, N),
                R.templatizeInstanceClass = X);
                var A = vDv(M);
                y9Z(M, R, N, A);
                N = function() {
                    return X.apply(this, arguments) || this
                }
                ;
                _.v(N, X);
                N.prototype._methodHost = A;
                N.prototype.__dataHost = M;
                N.prototype.__templatizeOwner = d;
                N.prototype.__hostProps = R.hostProps;
                return N
            }

        */
      }

      // Polymer.DomIf
      
      // We can fully teardown the entire instance (including stampFrag and stampNodes), just keep ctor stamper
      if (ENHANCE_DOMIF_TEARDOWN && fProto.__teardownInstance && !fProto.__teardownInstance239 && fProto.__teardownInstance.length === 0) {
        fProto.__teardownInstance239 = fProto.__teardownInstance;
        fProto.__teardownInstance = function () {
          const { __instance, __invalidProps } = this;
          let r, e_;
          try {
            r = this.__teardownInstance239();
          } catch (e) { e_ = e }
          if (!__instance) return r;

          try {

            //console.log(599901,this.countEvent767());
            //console.log('__teardownInstance F', __instance, __invalidProps, this._removeEventListenerFromNode, __instance._removeEventListenerFromNode);
            __instance.__data = null;
            __instance.__dataClientsReady = __instance.__dataEnabled = __instance.__dataReady = false;
            __instance.__dataInvalid = true;
            __instance.__dataHost = __instance.__dataTemp = null;
            __instance.__isPropertyEffectsClient = false;
            __instance.__keepInstance038__ = false;


            const __templateInfo = __instance.__templateInfo;

            let stampFragId = null;
            if (__templateInfo && __templateInfo.nodeList) {
              stampFragId = __templateInfo.nodeList.__belongFragId57__;
              for (const weakNodeC of __templateInfo.nodeList) {
                const node = toActualNode(weakNodeC);
                if (node && node.nodeType >= 1) {
                  renderPathMake(node)
                  node.__keepInstance038__ = false;
                  node.remove();
                  _removedElements.addNode(node); // rn54011
                }
              }
              __templateInfo.nodeList.length = 0;
              __templateInfo.nodeList = null;
            }

            const stampFrag = stampFragId ? kRef(stampedFragment.get(stampFragId)) : null;

            if (stampFrag && stampFrag.nodeType === 11) {
              stampFrag.__keepInstance038__ = false;
              _removedElements.addNode(stampFrag); // rn54012
              removeAllChildNodes(stampFrag);
              try {
                stampFrag.remove();
              } catch (e) { }
              stampFrag.__shady = null;
              stampFrag.$ = null;
              stampFrag.__fragTeardowned57__ = true;
              stampFrag.nodeList = null;
              stampFrag.templateInfo = null;

            }

            for (const sym of Object.getOwnPropertySymbols(__instance)) {
              const o = __instance[sym];
              if (o && o.nodeType === 11) {
                __instance[sym] = null;
              }
            }

            const children = (__instance || 0).children;
            if (children && children.splice) {
              __instance.children = null;
              for (const n of children) {
                if (n && n.nodeType >= 1) {
                  n.__keepInstance038__ = false;
                  _removedElements.addNode(n); // rn54013
                }
              }
              children.length = 0;
            }

            if (__instance.__templateInfo) __instance.__templateInfo = null;

            if (__instance.root) __instance.root = null;

          } catch (e) {
            console.error(e);
          }

          // console.log(3882)
          if (e_) throw e_;
          return r;
        }
      }

    }

    if (ENHANCE_DOMIF_createAndInsertInstance || ENHANCE_DOMIF_TEARDOWN) {

      Object.defineProperty(Object.prototype, 'DomIf', {
        get() {
          return undefined;
        },
        set(nv) {
          if (typeof (nv || 0) !== 'function') return false;
          delete Object.prototype.DomIf;
          this.DomIf = nv;
          setupDomIf(nv);
          return true;
        },
        enumerable: false,
        configurable: true
      });

    }

    Object.defineProperty(Object.prototype, '_lastIf', {
      get() {
        return this[s81];
      },
      set(nv) {
        if (nv === false && this.nodeName === "DOM-IF" && this.__renderDebouncer === null && this[s81] === undefined) {
          // DOM-IF initialization
          nv = null; // avoid (this.if == this._lastIf) primitive type conversion (object vs false)

          this.__xiWB8__ = 2;
          // this.restamp = true;

          const cProto = this.__proto__;
          if (cProto && !cProto.__xiWB7__) {
            cProto.__xiWB7__ = 1;

            // dom-if __template
            // dom-repeat template
            if (FIX_DOM_IF_TEMPLATE && !cProto.__template && !cProto.__template847) {
              cProto.__template847 = true;
              try {
                // note: this is not "_template" in Polymer ( see POLYMER_COMPONENT_DEFINITION )
                Object.defineProperty(cProto, '__template', {
                  get() {
                    const v = this[s84];
                    return (typeof (v || 0) === 'object' && v.deref) ? kRef(v) : v;
                  },
                  set(nv) {
                    if (typeof (nv || 0) === 'object' && !nv.deref) nv = mWeakRef(nv);
                    this[s84] = nv;
                    return true;
                  }
                });
              } catch (e) {
                console.warn(e);
              }

              console.log('FIX_DOM_IF - __template')
            }

            // dom-if __ensureTemplate
            // dom-repeat __ensureTemplatized
            if (FIX_DOM_IF_TEMPLATE && !cProto.__ensureTemplate847 && typeof cProto.__ensureTemplate === 'function' && cProto.__ensureTemplate.length === 0 && this instanceof HTMLElement_ && `${cProto.__ensureTemplate}`.length > 20) {
              // note that "_templateInfo" diffs the different version of DOM-IF

              cProto.__ensureTemplate847 = cProto.__ensureTemplate;
              cProto.__ensureTemplate = function () {
                if (!(this instanceof HTMLElement_) || arguments.length > 0) return this.__ensureTemplate847(...arguments);
                if (!this.__template) {
                  let b;
                  if (this._templateInfo) {
                    b = this;
                  } else {
                    if (!this.__templateCollection011__) this.__templateCollection011__ = this.getElementsByTagName('template');
                    b = this.__templateCollection011__[0];
                    if (!b) {
                      if (!this[wk]) this[wk] = mWeakRef(this);
                      let a = this[wk];
                      let c = new MutationObserver(function () {
                        if (!this.__templateCollection011__[0]) throw Error("dom-if requires a <template> child"); // to be reviewed
                        if (c && a) {
                          c.disconnect();
                          a = kRef(a);
                          a && a.__render();
                          a && (a.__templateCollection011__ = null);
                        }
                        c = null;
                        a = null;
                      });
                      c && c.observe(this, {
                        childList: !0
                      });
                      return !1
                    } else {
                      this.__templateCollection011__ = null;
                    }
                  }
                  this.__template = b
                }
                return !0
              }

              console.log('FIX_DOM_IF - __ensureTemplate')

            }


            console.log('FIX_DOM_IF OK', Object.keys(cProto))
          }


          // need to fix __observeEffects
          // this.__observeEffects.if[0].info.method === this.__debounceRender
          const f = () => {

            const __observeEffects = this.__observeEffects;

            if (__observeEffects && __observeEffects.if && isIterable(__observeEffects.if)) {
              for (const effect of __observeEffects.if) {
                const info = effect.info;
                if (info && typeof info.method === 'function') {

                  if (info.method === this.__debounceRender847 || info.method === this.__debounceRender) {
                    info.method = FIX_DOM_IFREPEAT_RenderDebouncerChange_SET_TO_PROPNAME ? '__debounceRender' : this.__debounceRender;
                  }

                }
              }
            }


            if (__observeEffects && __observeEffects.restamp && isIterable(__observeEffects.restamp)) {
              for (const effect of __observeEffects.restamp) {
                const info = effect.info;
                if (info && typeof info.method === 'function') {

                  if (info.method === this.__debounceRender847 || info.method === this.__debounceRender) {
                    info.method = FIX_DOM_IFREPEAT_RenderDebouncerChange_SET_TO_PROPNAME ? '__debounceRender' : this.__debounceRender;
                  }

                }
              }
            }

            // console.log(5881, this.__observeEffects)
          }

        }
        this[s81] = nv;
        return true;
      }
    });


    Object.defineProperty(Object.prototype, '__renderDebouncer', {
      get() {
        return this[s85];
      },
      set(nv) {
        if (nv === null && this[s85] === undefined) {
          // DOM-IF / DOM-REPEAT initialization


          const cProto = this.__proto__;
          if (qp) {
            qp.obtain();
            qp = null;
            shadyFlushMO.observe(document.documentElement, { attributes: ['nw3a24np'] });
          }

        }
        this[s85] = nv;
        return true;
      }
    });

    // PS-DOM-REPEAT

    Object.defineProperty(Object.prototype, 'JSC$10034_renderDebouncer', {
      get() {
        return this[s85b];
      },
      set(nv) {

        this[s85b] = nv;
        return true;
      }
    })

    Object.defineProperty(Object.prototype, 'JSC$10027_renderDebouncer', {
      get() {
        return this[s85c];
      },
      set(nv) {

        this[s85c] = nv;
        return true;
      }
    })


  })();

  const setupXdeadC = (cnt)=>{

    let xdeadc = xdeadc00;
    if(!xdeadc){
      setupSDomWrapper(); // just in case
      const hostElement = cnt.hostElement;
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      hostElement.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
      hostElement.lastChild.replaceWith(el);
      el.insertAdjacentHTML('afterbegin', ttpHTML(`<div></div>`));
      const rid = `xdead_${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
      el.firstElementChild.id = rid;
      cnt.$[rid] = el.firstElementChild;
      cnt.stampDomArray9682_(null, rid, null, false, false, false);

      xdeadc =  cnt.getStampContainer_(rid);
      el.remove();
      xdeadc00 = xdeadc;
      // console.log(xdeadc.__domApi)
      // debugger;
      // const xdeadv = xdeadc.__domApi;
    }

    let xlivec = xlivec00;
    if(!xlivec){
      setupSDomWrapper(); // just in case
      const hostElement = cnt.hostElement;
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      hostElement.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
      hostElement.lastChild.replaceWith(el);
      el.insertAdjacentHTML('afterbegin', ttpHTML(`<div></div>`));
      const rid = `xlive_${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
      el.firstElementChild.id = rid;
      cnt.$[rid] = el.firstElementChild;
      cnt.stampDomArray9682_(null, rid, null, false, false, false);

      xlivec =  cnt.getStampContainer_(rid);
      xlivec00 = xlivec;
      // console.log(xdeadc.__domApi)
      // debugger;
      // const xdeadv = xdeadc.__domApi;
    }

    return xdeadc00;
  }

  let standardWrap_ = null;

  const setupSDomWrapper = () => {

    const sdwProto = ShadyDOM.Wrapper.prototype;

    if (sdwProto.__pseudo__isConnected__ !== null) {
      sdwProto.__pseudo__isConnected__ = null;
      const isConnectedPd = Object.getOwnPropertyDescriptor(sdwProto, 'isConnected');
      if (isConnectedPd && isConnectedPd.get && isConnectedPd.configurable === true) {
        const get = isConnectedPd.get;
        isConnectedPd.get = function () {
          const pseudoVal = this.__pseudo__isConnected__;
          return typeof pseudoVal === 'boolean' ? pseudoVal : get.call(this);
        }
        Object.defineProperty(sdwProto, 'isConnected', { ...isConnectedPd });
      }

      // debugger;
      // new xdeadc.__domApi.constructor(document.createElement('div'));
    }

  }

  let domApiConstructor = null;
  const setupDomApi = (daProto) => {

    daProto.__daHook377__ = true;

    domApiConstructor = daProto.constructor; // TBC

    // TBC

  }


  // WEAKREF_ShadyDOM

  let mightTeardownShadyDomWrap = () => { };

  MODIFY_ShadyDOM_OBJ && ((WeakRef) => {

    const setupPlainShadyDOM = (b) => {
      (OMIT_ShadyDOM_settings & 1) && (b.inUse === true) && (b.inUse = false);
      (OMIT_ShadyDOM_settings & 2) && (b.handlesDynamicScoping === true) && (b.handlesDynamicScoping = false);
      (OMIT_ShadyDOM_settings & 4) && (b.force === true) && (b.force = false);
      b.patchOnDemand = true;
      b.preferPerformance = true;
      b.noPatch = true;
    }

    const isPlainObject = (b, m) => {
      if (!b || typeof b !== 'object') return false;
      const e = Object.getOwnPropertyDescriptors(b);
      if (e.length <= m) return false;
      let pr = 0;
      for (const k in e) {
        const d = e[k];
        if (!d || d.get || d.set || !d.enumerable || !d.configurable) return false;
        if (!('value' in d) || typeof d.value === 'function') return false;
        pr++;
      }
      return pr > m;
    }

    let b;

    let lz = 0;

    const sdp = Object.getOwnPropertyDescriptor(window, 'ShadyDOM');
    if (sdp && sdp.configurable && sdp.value && sdp.enumerable && sdp.writable) {

      // Brave - ShadyDOM exists before userscripting
      b = sdp.value;

      if (b && typeof b === 'object' && isPlainObject(b, 0)) {
        OMIT_ShadyDOM_EXPERIMENTAL && setupPlainShadyDOM(b);
        lz = 1;
      }

    }


    if (sdp && sdp.configurable && sdp.value && sdp.enumerable && sdp.writable && !sdp.get && !sdp.set) {
    } else if (!sdp) {
    } else {
      console.log(3719, '[yt-js-engine-tamer] FIX::ShadyDOM is not applied [ PropertyDescriptor issue ]', sdp);
      return;
    }

    const shadyDOMNodeWRM = new WeakMap();

    console.log(3719, '[yt-js-engine-tamer] FIX::ShadyDOM << 01 >>', b);

    const weakWrapperNodeHandlerFn = () => ({
      get() {
        const wv = this[wk];
        if (typeof wv === 'undefined') return undefined;
        let node = kRef(wv);
        if (!node) this[wk] = undefined;
        return node || undefined;
      },
      set(nv) {
        const wv = nv ? (nv[wk] || (nv[wk] = mWeakRef(nv))) : nv;
        this[wk] = wv;
        return true;
      },
      enumerable: true,
      configurable: true
    });


    function weakWrapper(_ShadyDOM) {
      const ShadyDOM = _ShadyDOM;
      if (WEAKREF_ShadyDOM && lz < 3 && typeof WeakRef === 'function' && typeof ShadyDOM.Wrapper === 'function' && ShadyDOM.Wrapper.length === 1 && typeof (ShadyDOM.Wrapper.prototype || 0) === 'object') {
        let nullElement = { node: null };
        Object.setPrototypeOf(nullElement, Element.prototype);
        let p = new ShadyDOM.Wrapper(nullElement);
        let d = Object.getOwnPropertyDescriptor(p, 'node');
        if (d.configurable && d.enumerable && !d.get && !d.set && d.writable && d.value === nullElement && !Object.getOwnPropertyDescriptor(ShadyDOM.Wrapper.prototype, 'node')) {
          Object.defineProperty(ShadyDOM.Wrapper.prototype, 'node', weakWrapperNodeHandlerFn());
          console.log('[yt-js-engine-tamer] FIX::ShadyDOM << WEAKREF_ShadyDOM >>')
        }

      }
      if (typeof (((ShadyDOM || 0).Wrapper || 0).prototype || 0) === 'object') {
        try {
          setupSDomWrapper();
        } catch (e) { }
      }

    }

    let previousWrapStore = null;

    mightTeardownShadyDomWrap = (node) => {
      if (previousWrapStore) previousWrapStore.delete(node);
      if (shadyDOMNodeWRM) shadyDOMNodeWRM.delete(node);
    };

    const standardWrap = function (a) {
      if (a instanceof WeakNodeC) a = a.getNode592177();
      // if(a && a.deref) a= a.deref();
      if(!a) return a;
      if (a instanceof ShadowRoot || a instanceof ShadyDOM.Wrapper) return a;
      if (previousWrapStore) {
        const s = kRef(previousWrapStore.get(a)); // kRef for play safe only
        if (s) {
          previousWrapStore.delete(a);
          shadyDOMNodeWRM.set(a, mWeakRef(s));
        }
      }
      let u = kRef(shadyDOMNodeWRM.get(a));
      if (!u) {
        u = new ShadyDOM.Wrapper(a);
        shadyDOMNodeWRM.set(a, mWeakRef(u));
      }
      return u;
    }

    standardWrap_ = standardWrap;


    function setupWrapFunc(_ShadyDOM) {
      const ShadyDOM = _ShadyDOM;


      const wmPD = Object.getOwnPropertyDescriptor(WeakMap.prototype, 'get');
      if (!(wmPD && wmPD.writable && !wmPD.enumerable && wmPD.configurable && wmPD.value && !wmPD.get && !wmPD.set)) {
        return;
      }
      let mm = new Set();
      const pget = wmPD.value;
      WeakMap.prototype.get = function (a) {
        mm.add(this);
        return a;
      }
      try {
        let nullElement = { node: null };
        Object.setPrototypeOf(nullElement, Element.prototype);
        ShadyDOM.wrapIfNeeded(nullElement)
        ShadyDOM.wrap(nullElement)
      } catch (e) { }
      WeakMap.prototype.get = pget;
      if (mm.size !== 1) {
        mm.clear();
        return;
      }
      const p = mm.values().next().value;
      if (!(p instanceof WeakMap)) return;
      // p.clear();
      // p.get = function (a) { return a }
      // p.set = function (a, b) { return this }
      // console.log(188, window.n2n = mm, window.n2p = p)

      // console.log(34929,p.size)
      previousWrapStore = p;

      if (typeof ShadyDOM.wrap === 'function' && ShadyDOM.wrap.length === 1) {
        ShadyDOM.wrap = function (a) { 0 && console.log(3719, '[yt-js-engine-tamer] (OMIT_ShadyDOM) function call - wrap'); return standardWrap(a) }
      }
      if (typeof ShadyDOM.wrapIfNeeded === 'function' && ShadyDOM.wrapIfNeeded.length === 1) {
        ShadyDOM.wrapIfNeeded = function (a) { console.log(3719, '[yt-js-engine-tamer] (OMIT_ShadyDOM) function call - wrapIfNeeded'); return standardWrap(a) }
      }

    }

    function setupLZ3(nv) {

      const ShadyDOM = nv;

      const ShadyDOMSettings = ShadyDOM.settings;
      if (!(ShadyDOMSettings.inUse === true && ShadyDOM.inUse === true && (ShadyDOMSettings.handlesDynamicScoping || ShadyDOM.handlesDynamicScoping) === true)) {
        console.log(3719, '[yt-js-engine-tamer] OMIT_ShadyDOM is not applied [02]', window.ShadyDOM);
        return false;
      }

      weakWrapper(ShadyDOM);

      if (OMIT_ShadyDOM_EXPERIMENTAL && lz < 3) {

        setupPlainShadyDOM(ShadyDOMSettings);
        setupPlainShadyDOM(ShadyDOM);

        ShadyDOM.isShadyRoot = function () { console.log(3719, '[yt-js-engine-tamer] (OMIT_ShadyDOM) function call - isShadyRoot'); return false; }

        setupWrapFunc(ShadyDOM);
        ShadyDOM.patchElementProto = function () { console.log(3719, '[yt-js-engine-tamer] (OMIT_ShadyDOM) function call - patchElementProto') }
        ShadyDOM.patch = function () { console.log(3719, '[yt-js-engine-tamer] (OMIT_ShadyDOM) function call - patch') }

        // To be confirmed
        if (OMIT_ShadyDOM_EXPERIMENTAL & 2) {
          ShadyDOM.composedPath = function (e) {
            const t = (e || 0).target || null;
            if (!(t instanceof HTMLElement_)) {
              console.log(3719, '[yt-js-engine-tamer] (OMIT_ShadyDOM&2) composedPath', t)
            }
            return t instanceof HTMLElement_ ? [t] : [];
          };
        }

      }

    }


    function setupLZ6(nv) {

      const ShadyDOM = nv;

      const ShadyDOMSettings = ShadyDOM.settings;

      if (!(ShadyDOMSettings.inUse === true && ShadyDOM.inUse === true && (ShadyDOMSettings.handlesDynamicScoping || ShadyDOM.handlesDynamicScoping) === true)) {
        console.log(3719, '[yt-js-engine-tamer] OMIT_ShadyDOM is not applied [02]', window.ShadyDOM);
        return false;
      }

      weakWrapper(ShadyDOM);

      if (OMIT_ShadyDOM_EXPERIMENTAL && lz < 3) {

        setupPlainShadyDOM(ShadyDOMSettings);
        setupPlainShadyDOM(ShadyDOM);

        setupWrapFunc(ShadyDOM);

      }

    }

    if (b && typeof b.Wrapper === 'function' && typeof b.settings === 'object' && typeof b.wrap === 'function') {

      const nv = b;

      if (setupLZ6(nv) === false) return;

      lz = 6;

      console.log(3719, '[yt-js-engine-tamer] FIX::ShadyDOM << 02b >>', nv)

      return;
    }

    delete window.ShadyDOM;

    Object.defineProperty(window, 'ShadyDOM', {
      get() {
        return b;
      },
      set(nv) {
        let ret = 0;
        try {
          do {
            if (!nv || !nv.settings) {
              if (lz < 1 && nv && typeof nv === 'object' && isPlainObject(nv, 0)) {
                OMIT_ShadyDOM_EXPERIMENTAL && setupPlainShadyDOM(nv);
                lz = 1;
                break;
              } else {
                console.log(3719, '[yt-js-engine-tamer] FIX::ShadyDOM is not applied [nv:null]', nv);
                break;
              }
            }

            const sdp = Object.getOwnPropertyDescriptor(this || {}, 'ShadyDOM');
            if (!(sdp && sdp.configurable && sdp.get && sdp.set)) {
              console.log(3719, '[yt-js-engine-tamer] OMIT_ShadyDOM is not applied [ incorrect PropertyDescriptor ]', nv);
              break;
            }

            if (setupLZ3(nv) === false) break;

            lz = 3;

            console.log(3719, '[yt-js-engine-tamer] FIX::ShadyDOM << 02a >>', nv)

            ret = 1;

          } while (0);
        } catch (e) {
          console.log('[yt-js-engine-tamer] FIX::ShadyDOM << ERROR >>', e)
        }

        if (!ret) b = nv;
        else {
          delete this.ShadyDOM;
          this.ShadyDOM = nv;
        }
        return true;
      },
      enumerable: false,
      configurable: true
    });

  })(typeof WeakRef !== 'undefined' ? WeakRef : function () { });

  if (ENABLE_ASYNC_DISPATCHEVENT) {
    const filter = new Set([
      'yt-action',
      // 'iframe-src-replaced',
      'shown-items-changed',
      'can-show-more-changed', 'collapsed-changed',

      'yt-navigate', 'yt-navigate-start', 'yt-navigate-cache',
      'yt-player-updated', 'yt-page-data-fetched', 'yt-page-type-changed', 'yt-page-data-updated',
      'yt-navigate-finish',

      // 'data-changed','yt-watch-comments-ready'
    ])
    EventTarget.prototype.dispatchEvent938 = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function (event) {
      const type = (event || 0).type;
      if (typeof type === 'string' && event.isTrusted === false && (event instanceof CustomEvent) && event.cancelable === false) {
        if (!filter.has(type) && !type.endsWith('-changed')) {
          if (this instanceof Node || this instanceof Window) {
            nextBrowserTick_(() => this.dispatchEvent938(event));
            return true;
          }
        }
      }
      return this.dispatchEvent938(event);
    }
  }

  // avoid REGEXP testPattern execution in Brave's scriptlet for performance boost
  SCRIPTLET_REMOVE_PRUNE_propNeedles && (() => {
    // const xhr = new XMLHttpRequest;
    const pdOri = Object.getOwnPropertyDescriptor(Map.prototype, 'size');
    if (!pdOri || pdOri.configurable !== true) return;
    let propNeedles = null;
    const pdNew = {
      configurable: true,
      enumerable: true,
      get: function () {
        propNeedles = this;
        if (DEBUG_removePrune) debugger; // to locate Brave scriptlets
        throw new Error();
      }
    }
    Object.defineProperty(Map.prototype, 'size', pdNew);
    try {
      XMLHttpRequest.prototype.open.call(0);
      // xhr.open.call(null)
    } catch (e) { }
    Object.defineProperty(Map.prototype, 'size', pdOri);
    if (!propNeedles) return;
    const entries = [...propNeedles.entries()];
    propNeedles.clear();
    console.log('[yt-js-engine-tamer] propNeedles is cleared from scriptlet', entries, propNeedles);
  })();

  if (FIX_XHR_REQUESTING) {

    const URL = window.URL || new Function('return URL')();
    const createObjectURL = URL.createObjectURL.bind(URL);

    XMLHttpRequest = (() => {
      const XMLHttpRequest_ = XMLHttpRequest;
      if ('__xmMc8__' in XMLHttpRequest_.prototype) return XMLHttpRequest_;
      const url0 = createObjectURL(new Blob([], { type: 'text/plain' }));
      const c = class XMLHttpRequest extends XMLHttpRequest_ {
        constructor(...args) {
          super(...args);
        }
        open(method, url, ...args) {
          let skip = false;
          if (!url || typeof url !== 'string') skip = true;
          else if (typeof url === 'string') {
            let turl = url[0] === '/' ? `.youtube.com${url}` : `${url}`;
            if (turl.includes('googleads') || turl.includes('doubleclick.net')) {
              skip = true;
            } else if (turl.includes('.youtube.com/pagead/')) {
              skip = true;
            } else if (turl.includes('.youtube.com/ptracking')) {
              skip = true;
            } else if (turl.includes('.youtube.com/youtubei/v1/log_event?')) {
              skip = true;
            } else if (turl.includes('.youtube.com/api/stats/')) { // /api/stats/
              if (turl.includes('.youtube.com/api/stats/qoe?')) {
                skip = true;
              } else if (turl.includes('.youtube.com/api/stats/ads?')) {
                skip = true;
              } else {
                // skip = true; // for user activity logging e.g. watched videos
              }
            } else if (turl.includes('play.google.com/log')) {
              skip = true;
            } else if (turl.includes('.youtube.com//?')) { // //?cpn=
              skip = true;
            }
          }
          if (!skip) {
            this.__xmMc8__ = 1;
            return super.open(method, url, ...args);
          } else {
            this.__xmMc8__ = 2;
            return super.open('GET', url0);
          }
        }
        send(...args) {
          if (this.__xmMc8__ === 1) {
            return super.send(...args);
          } else if (this.__xmMc8__ === 2) {
            return super.send();
          } else {
            console.log('[yt-js-engine-tamer]', 'xhr warning');
            return super.send(...args);
          }
        }
      }
      c.prototype.__xmMc8__ = 0;
      prototypeInherit(c.prototype, XMLHttpRequest_.prototype);
      return c;
    })();
  }

  // Alternative HACK -> Tabview Youtube
  if (DISABLE_COOLDOWN_SCROLLING && typeof EventTarget.prototype.addEventListener52178 !== 'function' && typeof EventTarget.prototype.addEventListener === 'function') {

    // ---- << this.overscrollConfig HACK >>  -----

    // 2024.04.19 - Playlist in Single Column Mode cannot be scrolled correctly.

    /*

      ;function gZb(a, b) {
          b = void 0 === b ? !0 : b;
          a.addEventListener("wheel", hZb);
          a.overscrollConfig = {
              cooldown: b
          }
      }
      function iZb(a) {
          a.overscrollConfig = void 0;
          a.removeEventListener("wheel", hZb)
      }
      function hZb(a) {
          var b = a.deltaY
            , c = a.target
            , d = null;
          if (window.Polymer && window.Polymer.Element) {
              if (c = a.path || a.composedPath && a.composedPath()) {
                  c = g(c);
                  for (var e = c.next(); !e.done && (e = e.value,
                  !jZb(e, b)); e = c.next())
                      if (e.overscrollConfig) {
                          d = e;
                          break
                      }
              }
          } else
              for (; c && !jZb(c, b); ) {
                  if (c.overscrollConfig) {
                      d = c;
                      break
                  }
                  c = c.parentElement
              }
          d && (b = d.overscrollConfig,
          b.cooldown ? (d = a.deltaY,
          c = b.lastDeltaY || 0,
          b.lastDeltaY = d,
          e = b.lastStopped || 0,
          c && e && 0 < c == 0 < d ? Math.abs(c) >= Math.abs(d) ? (d = e + 1200,
          c = !1) : (d = e + 600,
          c = !0) : (d = Date.now() + 600,
          c = !0),
          d > Date.now() && (a.preventDefault(),
          c && (b.lastStopped = Date.now()))) : a.preventDefault())
      }
    */

    let wheelHandler = function (a) {
      if (window.Polymer && window.Polymer.Element) {
        let c;
        if (c = a.path || a.composedPath && a.composedPath()) {
          for (const e of c) {
            const cnt = insp(e);
            if (e.overscrollConfig) e.overscrollConfig = void 0;
            if (cnt.overscrollConfig) cnt.overscrollConfig = void 0;
          }
        }
      } else {
        let e = a.target;
        for (; e instanceof Element; e = e.parentElement) {
          const cnt = insp(e);
          if (e.overscrollConfig) e.overscrollConfig = void 0;
          if (cnt.overscrollConfig) cnt.overscrollConfig = void 0;
        }
      }
    };

    let checkWheelListenerObjs = null;

    let getObjsFn = () => {
      let euyVal = 0;
      const eukElm = {};
      Object.setPrototypeOf(eukElm, HTMLElement_.prototype);
      const euzObj = new Proxy(eukElm, {
        get(target, prop) {
          throw `ErrorF31.get(${prop})`
        },
        set(target, prop, value) {
          throw `ErrorF33.set(${prop}, ${value})`
        }
      });
      const euxElm = new Proxy(eukElm, {
        get(target, prop) {
          if (prop === 'scrollTop') {
            euyVal = euyVal | 8;
            return 0;
          }
          if (prop === 'overscrollConfig') {
            euyVal = euyVal | 16;
            return void 0;
          }
          if (prop === 'scrollHeight' || prop === 'clientHeight' || prop === 'offsetHeight') {
            return 640;
          }
          if (prop === 'scrollLeft') {
            euyVal = euyVal | 8;
            return 0;
          }
          if (prop === 'scrollWidth' || prop === 'clientWidth' || prop === 'offsetWidth') {
            return 800;
          }
          throw `ErrorF45.get(${prop})`
        },
        set(target, prop, value) {
          throw `ErrorF47.set(${prop}, ${value})`
        }
      });
      const eukEvt = {};
      Object.setPrototypeOf(eukEvt, WheelEvent.prototype);
      const euyEvt = new Proxy(eukEvt, {
        get(target, prop) {
          if (prop === 'deltaY' || prop === 'deltaX') {
            euyVal = euyVal | 1;
            return -999;
          }
          if (prop === 'target') {
            euyVal = euyVal | 2;
            return euxElm
          }
          if (prop === 'path' || prop === 'composedPath') {
            euyVal = euyVal | 2;
            return [euxElm]
          }
          throw `ErrorF51.get(${prop})`
        },
        set(target, prop, value) {
          throw `ErrorF53.set(${prop}, ${value})`
        }
      });
      const setVal = (v) => {
        euyVal = v;
      }
      const getVal = () => {
        return euyVal;
      }
      return { euzObj, euyEvt, setVal, getVal };
    }

    let checkWheelListener = (callback) => {

      let callbackIdentifier = '';

      let res = null;
      try {
        const { euzObj, euyEvt, getVal, setVal } = checkWheelListenerObjs || (checkWheelListenerObjs = getObjsFn());
        setVal(0);
        if (callback.call(euzObj, euyEvt) !== void 0) throw 'ErrorF99';
        throw `RESULT${getVal()}`;
      } catch (e) {
        res = e;
      }

      res = `${res}` || `${null}`;
      if (res.length > 20) res = `${res.substring(0, 20)}...`;

      callbackIdentifier = res;
      if (callbackIdentifier === 'RESULT27') 0;
      else if (callbackIdentifier === 'RESULT0') {
        // a.isSearch && !a.disableWheelScroll && B("desktop_enable_dmpanel_wheel_scroll")
      } else if (callbackIdentifier.startsWith('RESULT')) {
        console.log('wheel eventListener - RESULT', callbackIdentifier, callback)
      }
      return callbackIdentifier;

    };

    let callbackFound = false;
    EventTarget.prototype.addEventListener52178 = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, callback, option = void 0) {
      // M-youtube-js-engine-tamer.52178
      if (type === 'wheel' && !option && typeof callback === 'function' && callback.length === 1) {
        // (( match with signature `a.addEventListener("wheel", hZb);` )) [subject to further review]
        const callbackIdentifier = callback.yaujmoms || (callbackFound ? 'IGNORE' : (callback.yaujmoms = checkWheelListener(callback)));
        // RESULTXX / ErrorFXX / Other...
        if (callbackIdentifier === 'RESULT27') {
          this.overscrollConfigDisable = true;
          if (!callbackFound) {
            callbackFound = true; // suppose only one function is assigned to overscrollConfig cooldown [no function binding]
            getObjsFn = checkWheelListener = null;
            checkWheelListenerObjs = null;
            wheelHandler = null;
          }
          return void 0;
        } else if (!callbackFound && !this.overscrollConfigDisable) {
          this.overscrollConfigDisable = true;
          this.addEventListener52178('wheel', wheelHandler, { passive: false });
        }
      }
      return this.addEventListener52178(type, callback, option);
    };

    // ---- << this.overscrollConfig HACK >>  -----

  }

  const check_for_set_key_order = (() => {

    let mySet = new Set();

    mySet.add("value1");
    mySet.add("value2");
    mySet.add("value3");

    // Function to convert Set values to an array
    function getSetValues(set) {
      return Array.from(set.values());
    }

    // Function to test if the Set maintains insertion order
    function testSetOrder(set, expectedOrder) {
      let values = getSetValues(set);
      return expectedOrder.join(',') === values.join(',');
    }

    // Test 1: Initial order
    if (mySet.values().next().value !== "value1") return false;
    if (!testSetOrder(mySet, ["value1", "value2", "value3"])) return false;

    // Test 2: After deleting an element
    mySet.delete("value2");
    if (mySet.values().next().value !== "value1") return false;
    if (!testSetOrder(mySet, ["value1", "value3"])) return false;

    // Test 3: After re-adding a deleted element
    mySet.add("value2");
    if (mySet.values().next().value !== "value1") return false;
    if (!testSetOrder(mySet, ["value1", "value3", "value2"])) return false;

    // Test 4: After adding a new element
    mySet.add("value4");
    if (mySet.values().next().value !== "value1") return false;
    if (!testSetOrder(mySet, ["value1", "value3", "value2", "value4"])) return false;

    // Test 5: Delete+Add
    mySet.delete("value1");
    mySet.delete("value3");
    mySet.add("value3");
    mySet.add("value1");
    if (mySet.values().next().value !== "value2") return false;
    if (!testSetOrder(mySet, ["value2", "value4", "value3", "value1"])) return false;

    return true;
  })();


  // const qm47 = Symbol();
  // const qm57 = Symbol();
  const qm53 = Symbol();
  const qn53 = Symbol();


  const ump3 = new WeakMap();

  const stp = document.createElement('noscript');
  stp.id = 'weakref-placeholder';

  PROP_OverReInclusion_AVOID && (() => {


    if (typeof HTMLElement_.prototype.hasOwnProperty72 === 'function' || typeof HTMLElement_.prototype.hasOwnProperty !== 'function') return;
    const f = HTMLElement_.prototype.hasOwnProperty72 = HTMLElement_.prototype.hasOwnProperty;
    let byPassVal = null;
    let byPassCount = 0;
    let mmw = new Set();
    HTMLElement_.prototype.hasOwnProperty = function (prop) {
      if (arguments.length !== 1) return f.apply(this, arguments);
      if (byPassVal !== null && typeof prop === 'string') {

        if (PROP_OverReInclusion_LIST.has(prop)) {
          byPassCount++;
          return byPassVal;
        }
        PROP_OverReInclusion_DEBUGLOG && mmw.add(prop);

      }
      return this.hasOwnProperty72(prop);
    };


    /*


            z.prototype.forwardDynamicProps = function() {
                var B = m(this.inst);
                B = h(B);
                for (var F = B.next(); !F.done; F = B.next()) {
                    var H = h(F.value);
                    F = H.next().value;
                    H = H.next().value;
                    my(this, F, H);
                    r(b) && !ly(F) && Wua(this.inst, F)
                }
            }

            */



    let byPassZeroShowed = false;
    const forwardDynamicPropsGeneral = function () {
      byPassVal = true;
      byPassCount = 0;
      PROP_OverReInclusion_DEBUGLOG && mmw.clear();
      const ret = this.forwardDynamicProps72();
      byPassVal = null;
      if (byPassCount === 0 && !byPassZeroShowed) {
        byPassZeroShowed = true;
        console.log('[yt-js-engine-tamer] byPassCount = 0 in forwardDynamicProps')
      }
      byPassCount = 0;
      if (PROP_OverReInclusion_DEBUGLOG && mmw.size > 0) {
        console.log(399, '[yt-js-engine-tamer]', [...mmw]);
        mmw.clear();
      }
      return ret;
    };

    const propCheck = (proto) => {
      if (typeof (proto || 0) == 'object' && typeof proto.forwardDynamicProps === 'function' && typeof proto.forwardDynamicProps72 !== 'function') {
        proto.forwardDynamicProps72 = proto.forwardDynamicProps;
        if (proto.forwardDynamicProps.length === 0) {
          proto.forwardDynamicProps = forwardDynamicPropsGeneral;
        }
      }
    };

    const valMap = new WeakMap();
    Object.defineProperty(HTMLElement_.prototype, 'didForwardDynamicProps', {
      get() {
        propCheck(this.constructor.prototype);
        return valMap.get(this);
      },
      set(nv) {
        propCheck(this.constructor.prototype);
        valMap.set(this, nv);
        return true;
      },
      enumerable: false,
      configurable: true

    });

    promiseForCustomYtElementsReady.then(() => {
      if (typeof customElements !== 'object' || typeof customElements.define72 === 'function' || typeof customElements.define !== 'function') return;
      if (customElements.define.length !== 2) return;
      customElements.define72 = customElements.define;
      customElements.define = function (b, w) {
        propCheck(w.prototype);
        const ret = this.define72(b, w);
        return ret;
      }
    });

  })();

  if (FIX_FlexibleItemSizing) { // for youtube flow chat

    const flexibleItemListMo = new MutationObserver((mutations) => {
      // cnt.onStamperFinished
      // cnt.maybeUpdateFlexibleMenu
      const set = new Set();
      for (const mutation of mutations) {
        if (mutation && ((mutation.addedNodes || 0).length > 0 || (mutation.removedNodes || 0).length > 0)) {
          set.add(mutation.target);
        }
      }
      for (const s of set) {
        const cnt = insp(s);
        if (typeof cnt.maybeUpdateFlexibleMenuImpl === 'function') {
          cnt.maybeUpdateFlexibleMenuImpl();
        } else if (typeof cnt.maybeUpdateFlexibleMenu === 'function') {
          cnt.maybeUpdateFlexibleMenu();
        } else if (typeof cnt.onStamperFinished === 'function') {
          cnt.onStamperFinished();
        }
      }
      set.clear();
    });

    let checkConfig = true;
    const flexibleItemDocMo = new MutationObserver(() => {
      for (const s of document.querySelectorAll('ytd-menu-renderer[has-flexible-items]:not([b289ad])')) {
        s.setAttribute('b289ad', '');
        flexibleItemListMo.observe(s, { subtree: false, childList: true });
        s.appendChild(document.createComment('.')).remove();
      }
      if (checkConfig) {
        const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;
        if (config && config.EXPERIMENT_FLAGS) {
          checkConfig = false;
          config.EXPERIMENT_FLAGS.web_fix_missing_action_buttons = true;
        }
      }
    });
    flexibleItemDocMo.observe(document, { subtree: true, childList: true });

  }




  const observablePromise = (proc, timeoutPromise) => {
    let promise = null;
    return {
      obtain() {
        if (!promise) {
          promise = new Promise(resolve => {
            let mo = null;
            const f = () => {
              let t = proc();
              if (t) {
                mo.disconnect();
                mo.takeRecords();
                mo = null;
                resolve(t);
              }
            }
            mo = new MutationObserver(f);
            mo.observe(document, { subtree: true, childList: true })
            f();
            timeoutPromise && timeoutPromise.then(() => {
              resolve(null)
            });
          });
        }
        return promise
      }
    }
  }


  if (HOOK_ACTIVE_MODULES_fetchUpdatedMetadata) {
    observablePromise(() => {
      const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;
      if (config && config.EXPERIMENT_FLAGS) {
        config.EXPERIMENT_FLAGS.web_watch_get_updated_metadata_manager = true;
        return true;
      }
    }).obtain();
  }

  if (FIX_ROLLING_NUMBER_UPDATE) {


    observablePromise(() => {
      if (typeof customElements === 'undefined') return;
      const ce = customElements.get('yt-animated-rolling-number');
      if (!ce) return;
      return ce.prototype;
    }).obtain().then(async (cProto) => {

      const p = document.createElement('yt-animated-rolling-number');

      const frag = document.createDocumentFragment();
      frag.appendChild(p);
      const pDoc = document.implementation.createHTMLDocument();
      pDoc.body.appendChild(frag);

      let p88 = p;

      const __instance = await observablePromise(() => {
        const __instance = (p88 || 0).__instance;
        if (__instance && __instance.render) return __instance;
      }).obtain();
      p88 = null;

      const itProto = Reflect.getPrototypeOf(__instance);

      try {
        p.remove();
      } catch (e) { }

      if (itProto.render && !itProto.render37 && itProto.render.length === 1) {

        itProto.render37 = itProto.render;
        itProto.render = function (t) {
          // (this.xCounter = (this.xCounter & 1073741823)+1)
          let c33 = '';
          let r33 = null;
          let kc = 0;

          let dataType = 0;

          if (t && (('data' in t) || ('buttonShapeOverrideables' in t))) {
            dataType = 1;
          } else if (t && ('heightPx' in t)) {
            dataType = 2;
          } else if (t) {
            dataType = 3;
          }

          if (dataType === 3 && this && t && this.hookCounter >= 1 && !this.__unmounted && this.el) {
            const el = this.el;
            const ct = Date.now();
            const lastFireTime = (el.__lastFireTime491__ || 0);

            const fireTimeDiff = lastFireTime > 0 ? ct - lastFireTime : 1e9;

            if (fireTimeDiff < 80 && this.__previousRender61__) {
              return this.__previousRender61__;
            }

            // console.log(3772, t);

            const caseInt =
              (t && typeof t.numberText === 'string' && Number.isFinite(t.numberValue)) ? 1 :
                (t && typeof t.character === 'string') ? (
                  (typeof t.previousCharacter === 'string') ? 6 : 2
                ) : 0;

            if (caseInt === 6 && t.previousCharacter && t.character && this.__previousRender61__ && fireTimeDiff < 9400) {
              if (this[`__lastCharRender62__${t.previousCharacter}>${t.character}`] === this.__previousRender61__) {
                return this.__previousRender61__;
              }
            }
            if (caseInt === 1 && t.numberText.length > 0 && this.__previousRender61__ && fireTimeDiff < 9400) {
              if (this[`__lastCharRender65__${t.numberValue}>${t.numberText}`] === this.__previousRender61__) {
                return this.__previousRender61__;
              }
            }

            if (caseInt & 2) {

              if (caseInt & 4) {

                if (el.__lastCharacter353__ && el.__lastCharacter353__.length === 1 && t.character.length === 1 && t.previousCharacter.length === 1) {
                  if (t.character !== t.previousCharacter && t.character === el.__lastCharacter353__) {
                    t.previousCharacter = t.character;
                    kc = 1;
                  }
                }

                if (t && t.character && t.previousCharacter && t.shouldAnimate === true && t.character === t.previousCharacter) {
                  t.shouldAnimate = false;
                }
              }


              c33 = `__lastCharRender62__${t.previousCharacter}>${t.character}`;

              el.__lastCharacter353__ = t.character;

            } else if (caseInt === 1) {

              if (el.__lastNumberValue353__ === t.numberValue && t.shouldAnimate === true) {
                t.shouldAnimate = false;
              }
              el.__lastNumberValue353__ = t.numberValue;

              if (el.__lastNumberText353__ === t.numberText && t.shouldAnimate === true) {
                t.shouldAnimate = false;
              }
              el.__lastNumberText353__ = t.numberText;

              c33 = `__lastCharRender65__${t.numberValue}>${t.numberText}`;

            }

            // console.log(138002, this, t, caseInt, kc, fireTimeDiff);

            el.__lastFireTime491__ = ct;
          } else if (dataType === 2 && this && t && this.hookCounter >= 1 && !this.__unmounted && this.el) {
            const el = this.el;
            const ct = Date.now();
            const lastFireTime = (el.__lastFireTime493__ || 0);

            const fireTimeDiff = lastFireTime > 0 ? ct - lastFireTime : 1e9;

            if (fireTimeDiff < 80 && this.__previousRender63__) {
              return this.__previousRender63__;
            }

            // console.log(3772, t);

            const caseInt =
              (t && typeof t.numberText === 'string' && Number.isFinite(t.numberValue)) ? 1 :
                (t && typeof t.character === 'string') ? (
                  (typeof t.previousCharacter === 'string') ? 6 : 2
                ) : 0;

            if (caseInt === 6 && t.previousCharacter && t.character && this.__previousRender63__ && fireTimeDiff < 9400) {
              if (this[`__lastCharRender62__${t.previousCharacter}>${t.character}`] === this.__previousRender63__) {
                return this.__previousRender63__;
              }
            }
            if (caseInt === 1 && t.numberText.length > 0 && this.__previousRender63__ && fireTimeDiff < 9400) {
              if (this[`__lastCharRender65__${t.numberValue}>${t.numberText}`] === this.__previousRender63__) {
                return this.__previousRender63__;
              }
            }

            if (caseInt & 2) {

              if (caseInt & 4) {

                if (el.__lastCharacter353__ && el.__lastCharacter353__.length === 1 && t.character.length === 1 && t.previousCharacter.length === 1) {
                  if (t.character !== t.previousCharacter && t.character === el.__lastCharacter353__) {
                    t.previousCharacter = t.character;
                    kc = 1;
                  }
                }

                if (t && t.character && t.previousCharacter && t.shouldAnimate === true && t.character === t.previousCharacter) {
                  t.shouldAnimate = false;
                }
              }


              c33 = `__lastCharRender62__${t.previousCharacter}>${t.character}`;

              el.__lastCharacter353__ = t.character;

            } else if (caseInt === 1) {

              if (el.__lastNumberValue353__ === t.numberValue && t.shouldAnimate === true) {
                t.shouldAnimate = false;
              }
              el.__lastNumberValue353__ = t.numberValue;

              if (el.__lastNumberText353__ === t.numberText && t.shouldAnimate === true) {
                t.shouldAnimate = false;
              }
              el.__lastNumberText353__ = t.numberText;

              c33 = `__lastCharRender65__${t.numberValue}>${t.numberText}`;

            }

            // console.log(138002, this, t, caseInt, kc, fireTimeDiff);

            el.__lastFireTime493__ = ct;
          }

          // // console.log(21399, t.character, t.previousCharacter, (t.xCounter = (t.xCounter & 1073741823)+1), t, (this.xCounter = (this.xCounter & 1073741823)+1) )
          // // console.log(12883, this, t);
          const r = r33 || this.render37(t);
          if (dataType === 3) {
            this.__previousRender61__ = r;
          } else if (dataType === 2) {
            this.__previousRender63__ = r;
          }
          if (c33) this[c33] = r;
          return r
        }

      }

    });

  }

  if (HOOK_ACTIVE_MODULES) {

    let watchController;
    const watchControllerObservable = observablePromise(() => {
      const watchFlexy = document.querySelector('ytd-watch-flexy');
      if (!watchFlexy) return;
      return insp(watchFlexy).watchController;
    }).obtain();
    (async () => {
      watchController = await watchControllerObservable;

      const activeModules = watchController.activeModules;
      if (!activeModules) return;

      const checkFn = (activeModule) => {
        if (activeModule && typeof activeModule.fetchUpdatedMetadata === 'function' && activeModule.fetchUpdatedMetadata.length === 2) {
          HOOK_ACTIVE_MODULES_fetchUpdatedMetadata && hookActiveModuleFetchUpdatedMetadata(activeModule);
        }
      }
      if (!activeModules.push8792 && activeModules.push) {
        activeModules.push8792 = activeModules.push;
        activeModules.push = function (a, ...args) {
          checkFn(a);
          let r = args.length >= 1 ? this.push8792(a, ...args) : this.push8792(a);
          return r;
        }
      }
      activeModules.forEach(checkFn);

    })();

    let yieldResultWrappingByPass = false;
    let asyncProto = null;
    const yieldResultWrapping = (f) => {
      if (yieldResultWrappingByPass) return [f(), null];
      yieldResultWrappingByPass = true;
      let D = null;
      let promise, e_;
      if (asyncProto) {
        Object.defineProperty(asyncProto, 'yieldResult', {
          get() {
            return undefined;
          },
          set(nv) {
            delete asyncProto.yieldResult;
            this.yieldResult = nv;
            D = this;
            // console.log(122, this);
            return true;
          },
          enumerable: false,
          configurable: true
        });
        try {
          promise = f();
        } catch (e) { e_ = e }
        delete asyncProto.yieldResult;
        yieldResultWrappingByPass = false;
      } else {
        Object.defineProperty(Object.prototype, 'yieldResult', {
          get() {
            return undefined;
          },
          set(nv) {
            delete Object.prototype.yieldResult;
            this.yieldResult = nv;
            D = this;
            // console.log(122, this);
            return true;
          },
          enumerable: false,
          configurable: true
        });
        try {
          promise = f();
        } catch (e) { e_ = e }
        delete Object.prototype.yieldResult;
        yieldResultWrappingByPass = false;
        if (D) {
          asyncProto = Reflect.getPrototypeOf(D);
        }
      }
      if (e_) throw e_;
      return [promise, D];
    }

    const hookActiveModuleFetchUpdatedMetadata = (activeModule) => {

      const aProto = Reflect.getPrototypeOf(activeModule);

      if (!aProto || !aProto.fetchUpdatedMetadata || aProto.fetchUpdatedMetadata517) return;

      console.log('[yt-js-engine-tamer] hookActiveModuleFetchUpdatedMetadata');

      // console.log(12885)
      aProto.fetchUpdatedMetadata517 = aProto.fetchUpdatedMetadata;
      // let qxt=false;
      const renderLikeButtonViewModel = (likeButtonViewModel) => {
        if (!likeButtonViewModel || likeButtonViewModel.isConnected !== true) return;
        if (likeButtonViewModel.querySelector('yt-animated-rolling-number')) return; // no need to render
        const likeModelInstance = inup(likeButtonViewModel);
        const props = (likeModelInstance || 0).props;
        if (likeModelInstance && likeModelInstance.render && props) {
          const data = (props || 0).data;
          if (data && data.toggleButtonViewModel && props.likeCountEntity) {
            likeModelInstance.render(props)
            // likeModelInstance.functionComponent(props);
          }
        }
      }
      aProto.fetchUpdatedMetadata = function (t, P) {

        // if (!qxt) {
        //   qxt = true;
        //   var y = watchController.subscribe("WATCH_NEXT_RESPONSE_UPDATED", function (...args) {
        //     console.log(199001,...args)
        //   });
        //   this.addOnDisposeCallback(function (...args) {

        //     console.log(199002,...args)
        //     watchController.unsubscribeByKey(y)
        //     qxt = false;
        //   });
        // }
        const [promise, D] = yieldResultWrapping(() => this.fetchUpdatedMetadata517(t, P));
        if (D) promise.then(() => {
          const yieldResult = D.yieldResult;
          if (yieldResult) {
            const mutations = (((yieldResult || 0).frameworkUpdates || 0).entityBatchUpdate || 0).mutations;
            const mutations_ = mutations.slice(); // array clone
            if (mutations_ && mutations_.length >= 1) {
              let likeCountEntity = null;
              for (const mutation of mutations_) {
                if (typeof (mutation.entityKey || 0) === 'string' && (likeCountEntity = (mutation.payload || 0).likeCountEntity)) {
                  break;
                }
              }
              if (typeof (likeCountEntity || 0) === 'object') {
                const modelElement = document.querySelector('segmented-like-dislike-button-view-model');
                const model = insp(modelElement);
                const modelInstance = inup(modelElement);
                if (model && modelInstance) {
                  const data = ((modelInstance || 0).props || 0).data;
                  if (typeof (data || 0) === 'object') {
                    if (typeof data.likeCountEntity !== 'object') data.likeCountEntity = {};
                    // console.log(12838, {...data.likeCountEntity}, {...likeCountEntity})
                    const shouldModelUpdateInit = (data.likeCountEntity.key !== likeCountEntity.key);
                    const shouldModelUpdateModel = true;
                    Object.assign(data.likeCountEntity, likeCountEntity);
                    // data.likeCountEntity = likeCountEntity;
                    // if (shouldModelupdate) model.update();
                    // else {
                    //   if (typeof model.notifyPath === 'function' && model.notifyPath.length === 0) model.notifyPath();
                    // }
                    if (shouldModelUpdateModel) {
                      if (typeof model.enqueueUpdate === 'function' && model.enqueueUpdate.length === 0) {
                        model.enqueueUpdate();
                      } else if (typeof model.update === 'function' && model.update.length === 0) {
                        model.update();
                      } else {
                        console.warn('[yt-js-engine-tamer] cannot do model update.')
                      }
                    }
                    if (shouldModelUpdateInit) {
                      const likeButtonViewModel = modelElement.querySelector('like-button-view-model[class]');
                      if (likeButtonViewModel) {
                        if (!likeButtonViewModel.querySelector('yt-animated-rolling-number')) {
                          renderLikeButtonViewModel(likeButtonViewModel);
                        }
                      }
                    }

                  }
                }
              }
            }
          }
        }).catch(console.warn);
        return promise;
      };

    }

  }

  // ----------------------------

  const nativeNow = Reflect.getPrototypeOf(performance).now.bind(performance);

  const queueMicrotask_ = typeof queueMicrotask === 'function' ? queueMicrotask : (f) => (Promise.resolve().then(f), void 0);

  FIX_ICON_RENDER && whenCEDefined('yt-icon').then(async () => {


    // const globalPromiseStack = {};

    // let dummy;
    // while(!dummy){

    //   dummy = document.querySelector('yt-icon');
    //   await new Promise(r=>setTimeout(r,0));
    // }

    dummy = document.createElement('yt-icon');

    let cProto;
    if (!(dummy instanceof Element)) return;
    cProto = insp(dummy).constructor.prototype;

    cProto.handlePropertyChange671 = cProto.handlePropertyChange;
    cProto.determineIconSet671 = cProto.determineIconSet;
    cProto.switchToYtSysIconset671 = cProto.switchToYtSysIconset;
    cProto.useYtSysIconsetForMissingIcons671 = cProto.useYtSysIconsetForMissingIcons;
    cProto.getIconManager671 = cProto.getIconManager;
    cProto.getIconShapeData671 = cProto.getIconShapeData;
    cProto.renderIcon671 = cProto.renderIcon;

    // cProto.attached488 = cProto.attached;
    // cProto.attached = function(){
    //   console.log('attached')
    //   return this.attached488(...arguments);
    // }
    // cProto.detached488 = cProto.detached;
    // cProto.detached = function(){
    //   console.log('detached')
    //   return this.detached488(...arguments);
    // }

    if (cProto.__renderIconFix__) return;
    cProto.__renderIconFix__ = true;

    let taskStack = [];
    const cmObs = new MutationObserver(() => {
      const tasks = taskStack.slice();
      taskStack.length = 0;
      for (const task of tasks) {
        task();
      }
    })
    const cm = document.createComment('1');
    const stackTask = (f) => {
      taskStack.push(f);
      cm.data = `${(cm.data & 7) + 1}`;
    }
    cmObs.observe(cm, { characterData: true });

    // let iconManagers = {}; // assume shared

    // window.iconManagers = () => iconManagers;


    const setupYtIcon = (inst) => {

      if (inst.__ytIconSetup588__) return;
      const cProto = Reflect.getPrototypeOf(inst);
      cProto.__ytIconSetup588__ = true;


      const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;

      config.EXPERIMENT_FLAGS.wil_icon_render_when_idle = false;        // single rendering
      config.EXPERIMENT_FLAGS.wil_icon_load_immediately = true;         // single rendering
      // config.EXPERIMENT_FLAGS.wil_icon_use_mask_rendering = false;   // DON'T!
      config.EXPERIMENT_FLAGS.wil_icon_network_first = true;            // single rendering


      // this.renderingMode = _.x("wil_icon_use_mask_rendering") ? 1 : 0;
      // this.isNetworkFirstStrategy = _.x("wil_icon_network_first");
      // this.renderWhenIdle = _.x("wil_icon_render_when_idle");
      // this.waitForAnimationFrame = !_.x("wil_icon_load_immediately");



    }

    cProto.handlePropertyChange = function (...a) { // 10+

      const __data = this.__data;
      if (FIX_GUIDE_ICON && this.id === 'guide-icon' && __data && !__data.icon && typeof this.set === 'function') {
        this.set('icon', "yt-icons:menu")
      }

      if (!this.__ytIconSetup588__) setupYtIcon(this);
      this.__resolved__ = {

      };
      const a01 = this.isAttached;
      let a02, a03;


      const t = this.__stackedKey3818__ = (this.__stackedKey3818__ & 1073741823) + 1;

      const stackFn = () => {
        if (t !== this.__stackedKey3818__) {
          return;
        }
        a03 = this.isAttached;

        if (a01 === false && a02 === false && a03 === false) return;

        if (a01 === true && a02 === true && a03 === true) {

        } else {
          if (a01 === undefined && a02 === undefined && a03 === undefined && (this.hostElement || this).isConnected === false) {
            // unknown yt-icon#label-icon
            return;
          } else {
            console.log('[yt-icon] debug', a01, a02, a03, this)
          }
        }

        this.handlePropertyChange671(...arguments);

      };



      Promise.resolve().then(() => {
        a02 = this.isAttached;
        stackTask(stackFn);
      });


    }

    cProto.determineIconSet = function (a, b, c, d) { // 10-

      if (!this.__ytIconSetup588__) setupYtIcon(this);
      // string bool? bool=false int=24
      // NOTIFICATIONS_NONE OR LIKE
      // console.log('yt-icon.determineIconSet', ...arguments);

      const r = this.determineIconSet671(...arguments);
      return r;
    }

    cProto.switchToYtSysIconset = function (a, b, c, d) { // 10-

      if (!this.__ytIconSetup588__) setupYtIcon(this);
      // same as determineIconSet
      // console.log('yt-icon.switchToYtSysIconset', ...arguments);
      return this.switchToYtSysIconset671(...arguments);
    }

    cProto.useYtSysIconsetForMissingIcons = function (a, b, c, d) { // X

      if (!this.__ytIconSetup588__) setupYtIcon(this);
      // console.log('yt-icon.useYtSysIconsetForMissingIcons', ...arguments);
      return this.useYtSysIconsetForMissingIcons671(...arguments);
    }

    cProto.getIconManager = function () { // 10+

      if (!this.__ytIconSetup588__) setupYtIcon(this);
      if (!this.__resolved__) this.__resolved__ = {};
      if (!this.__resolved__.getIconManager) this.__resolved__.getIconManager = this.getIconManager671(...arguments);
      const r = this.__resolved__.getIconManager;
      return r;
    }

    cProto.getIconShapeData = function () { // 10+

      if (!this.__ytIconSetup588__) setupYtIcon(this);

      // no argument
      // console.log('yt-icon.getIconShapeData', ...arguments);
      if (!this.__resolved__) this.__resolved__ = {};
      if (!this.__resolved__.getIconShapeData) this.__resolved__.getIconShapeData = this.getIconShapeData671(...arguments);
      const r = this.__resolved__.getIconShapeData;
      return r
    }

    cProto.renderIcon = function (a, b) { // X

      if (!this.__ytIconSetup588__) setupYtIcon(this);
      // "" yt-icons:xxx
      // console.log('yt-icon.renderIcon', ...arguments);
      return this.renderIcon671(...arguments);
    }

  });


  /**
   * Compute the Longest Common Subsequence between two arrays.
   * Returns an array of the LCS elements (in order).
   */
  function computeLCS(a, b) {
    // Input validation
    if (!Array.isArray(a) || !Array.isArray(b)) {
      throw new Error('Inputs must be arrays');
    }

    const n = a.length, m = b.length;
    // Early termination for trivial cases
    if (n === 0 || m === 0) return [];
    // Check for shallow equality
    if (n === m && a.every((x, i) => x === b[i])) return a.slice();

    // Use smaller dimension for space optimization
    if (n > m) return computeLCS(b, a); // Ensure n <= m

    // dp[i%2][j] = length of LCS of a[i..] and b[j..]
    // Use Uint32Array for robustness with long sequences
    const dp = [
      new Uint32Array(m + 1),
      new Uint32Array(m + 1),
    ];
    // Store predecessor for backtracking: 0=diagonal, 1=down, 2=right
    // Optimize space by storing only necessary entries
    const pred = new Uint8Array(n * m); // Single array for moves

    for (let i = n - 1; i >= 0; i--) {
      const curr = i % 2;
      const next = 1 - curr;
      // Clear current row for reuse
      dp[curr].fill(0);

      for (let j = m - 1; j >= 0; j--) {
        const idx = i * m + j;
        if (a[i] === b[j]) {
          dp[curr][j] = dp[next][j + 1] + 1;
          pred[idx] = 0; // Diagonal
        } else if (dp[next][j] >= dp[curr][j + 1]) {
          dp[curr][j] = dp[next][j];
          pred[idx] = 1; // Down
        } else {
          dp[curr][j] = dp[curr][j + 1];
          pred[idx] = 2; // Right
        }
      }
    }

    // Check for potential overflow
    if (dp[0][0] > 0xFFFFFFFF) {
      throw new Error('LCS length exceeds safe integer limit');
    }

    // Backtrack to build the actual LCS
    const lcs = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      const idx = i * m + j;
      const p = pred[idx];
      if (p === 0) {
        lcs.push(a[i]);
        i++; j++;
      } else if (p === 1) {
        i++;
      } else {
        j++;
      }
    }
    return lcs;
  }

  /**
   * Given original[] and modified[], produce an array of splice-ops:
   *   [ [start0, deleteCount0, addedItems0],
   *     [start1, deleteCount1, addedItems1],
   *     … ]
   * When you do:
   *   let arr = original.slice();
   *   for (let [s, d, adds] of ops) arr.splice(s, d, ...adds);
   * arr will equal modified.
   */
  function diffSplices(original, modified) {
    // Input validation
    if (!Array.isArray(original) || !Array.isArray(modified)) {
      throw new Error('Inputs must be arrays');
    }

    const origLen = original.length;
    const modLen = modified.length;
    // Early termination for trivial cases
    if (origLen === 0 && modLen === 0) return [];
    if (origLen === 0) return [[0, 0, modified.slice()]];
    if (modLen === 0) return [[0, origLen, []]];

    // Trim common prefix and suffix
    let prefixLen = 0;
    while (prefixLen < origLen && prefixLen < modLen && original[prefixLen] === modified[prefixLen]) {
      prefixLen++;
    }
    let suffixLen = 0;
    while (
      suffixLen < origLen - prefixLen &&
      suffixLen < modLen - prefixLen &&
      original[origLen - 1 - suffixLen] === modified[modLen - 1 - suffixLen]
    ) {
      suffixLen++;
    }

    // Cache references for speed
    const orig = original.slice(prefixLen, origLen - suffixLen);
    const mod = modified.slice(prefixLen, modLen - suffixLen);
    const lcs = computeLCS(orig, mod);
    // Pre-allocate ops array, accounting for potential moves
    const ops = new Array(Math.ceil((orig.length + mod.length) / 1.5));
    let opCount = 0;

    let i = 0, j = 0, k = 0;
    let curIndex = prefixLen;
    const lcsLen = lcs.length;

    while (k < lcsLen) {
      const match = lcs[k];
      let deleteCount = 0;
      const deleted = [];
      const added = [];

      // 1) Collect deletions up to the next common element
      while (i < orig.length && orig[i] !== match) {
        deleted.push(orig[i]);
        deleteCount++;
        i++;
      }

      // 2) Collect insertions up to that same element
      while (j < mod.length && mod[j] !== match) {
        added.push(mod[j]);
        j++;
      }

      // 3) Check for a move (deleted segment matches inserted segment)
      let isMove = false;
      if (deleteCount > 0 && deleteCount === added.length) {
        isMove = deleted.every((x, idx) => x === added[idx]);
        if (isMove) {
          // If a move, split into delete and insert at different indices
          if (deleteCount > 0) {
            ops[opCount++] = [curIndex, deleteCount, []]; // Delete at current index
            ops[opCount++] = [curIndex, 0, added]; // Insert at same index
            curIndex += added.length; // Advance past inserted items
          }
        }
      }

      // 4) Combine delete and insert into a single operation if not a move
      if (!isMove && (deleteCount > 0 || added.length > 0)) {
        ops[opCount++] = [curIndex, deleteCount, added];
        curIndex += added.length; // Advance past inserted items
      }

      // 5) Skip over the matching element itself
      i++;
      j++;
      k++;
      curIndex++;
    }

    // 6) Handle any trailing deletions and insertions as a single operation
    const trailingDelete = orig.length - i;
    const trailingAdd = mod.slice(j);
    if (trailingDelete > 0 || trailingAdd.length > 0) {
      // Check for trailing move
      const trailingDeleted = orig.slice(i);
      let isMove = false;
      if (trailingDelete > 0 && trailingDelete === trailingAdd.length) {
        isMove = trailingDeleted.every((x, idx) => x === trailingAdd[idx]);
        if (isMove) {
          ops[opCount++] = [curIndex, trailingDelete, []];
          ops[opCount++] = [curIndex, 0, trailingAdd];
        }
      }
      if (!isMove) {
        ops[opCount++] = [curIndex, trailingDelete, trailingAdd];
      }
    }

    // 7) Truncate ops array to actual size
    ops.length = opCount;

    return ops;
  }
  // class listPlaceholder {
  //   constructor(len){
  //     this.length = len;
  //   }
  // }

  


//   rendererStamperApplyChangeRecord_: function(path, key, changeRecord) {
//     var renderJob = this.renderJobsMap_[key],
//         renderCallback = null;

//     if (path === changeRecord.path) {
//         let value = changeRecord.value;

//         if (!_.v_(value)) {
//             value = (value === void 0 || value === null) ? [] : [value];
//         }

//         let stampDomEntry = this.stampDom[path];

//         if (stampDomEntry.mapping) {
//             renderCallback = this.stampDomArray_.bind(
//                 this,
//                 value,
//                 key,
//                 stampDomEntry.mapping,
//                 stampDomEntry.reuseComponents,
//                 stampDomEntry.events,
//                 stampDomEntry.stamperStableList
//             );
//         }

//         if (renderJob) renderJob.cancel();

//         let taskManager = stampDomEntry.usePageScheduler ? this.getTaskManager()() : void 0;

//         if (!renderJob && stampDomEntry.initialRenderPriority == void 0) {
//             if (stampDomEntry.renderPriority != void 0 && !renderJob) {
//                 renderJob = new _.X6(stampDomEntry.renderPriority, stampDomEntry.waitForSignal, taskManager);
//                 this.renderJobsMap_[key] = renderJob;
//             }
//         } else {
//             renderJob = new _.X6(stampDomEntry.initialRenderPriority, stampDomEntry.waitForSignal, taskManager);
//             this.renderJobsMap_[key] = renderJob;
//             renderCallback = function(callback, job) {
//                 callback();
//                 q4C(job, 10);
//             }.bind(this, renderCallback, renderJob);
//         }
//     } else {
//         renderCallback = (path + ".splices" === changeRecord.path)
//             ? this.stampDomArraySplices_.bind(this, path, key, changeRecord.value)
//             : this.forwardRendererStamperChanges_.bind(this, path, key, changeRecord);
//     }

//     if (renderJob) {
//         _.vY(renderJob, renderCallback);
//     } else {
//         renderCallback();
//     }
// }

 



  const createStampDomFnsC_ = () => {

    const config = ((win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0);

    if (config.DEFERRED_DETACH === true) config.DEFERRED_DETACH = false;
    if (config.REUSE_COMPONENTS === true) config.REUSE_COMPONENTS = false;


    // const rq0 = document.createElement('rp');
    // rq0.setAttribute('yt-element-placholder', '');

    const it0 = Date.now() - 80000000000;
    const genId = () => `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}_${(Date.now() - it0).toString(36)}`;

    

    const getStampContainer_ = function (containerId) {

      return this.getStampContainer7409_(containerId);

    }




    const createComponent_ = function (componentConfig, data, canReuse) {

      return this.createComponent7409_(componentConfig, data, canReuse);

    }


    const s52 = Symbol();

    const deferRenderStamperBinding_ = function (component, typeOrConfig, data) {

      // if(component.querySelectorAll('dom-if').length > 0){

      //   // console.log(1233, component.isConnected, component.parentNode, component.querySelectorAll('dom-if'))
      //   if (component.isConnected === false) {
      //     for (const s of component.querySelectorAll('dom-if')) {
      //       try {
      //         console.log(1299);
      //         insp(s).__teardownInstance();
      //       } catch (e) { }
      //     }
      //   }

      // }

      if (typeof (data || 0) === 'object') {
        if (!data[s52]) data[s52] = genId();
        component[s52] = data[s52];
        // console.log(component[s52], data);
      } else {
        component[s52] = null;
      }

      return this.deferRenderStamperBinding7409_(component, typeOrConfig, data);

    }

    // let pr77 = Promise.resolve();
    

    const flushRenderStamperComponentBindings_ = function () {
      if (!this.__qsd477__ || !this.deferredBindingTasks_) return this.flushRenderStamperComponentBindings7409_();

      if (this.deferredBindingTasks_.length >= 0) {

        // const deferredBindingTasks_ = this.deferredBindingTasks_;

        const gid = this[`__$$stampFlushKey$$__`] = genId();
        const g = (() => {
          if (gid !== this[`__$$stampFlushKey$$__`]) { return; }
          // if (deferredBindingTasks_.length === 0) return;
          // let q = this.deferredBindingTasks_;
          // this.deferredBindingTasks_ = deferredBindingTasks_;
          this.flushRenderStamperComponentBindings7409_();
          // deferredBindingTasks_.length = 0;
          // this.deferredBindingTasks_ = q;

          const s = [...this.__lat457__];
          this.__lat457__.clear();

          for (const containerWr of s) {

            const container = kRef(containerWr);
            if (!container) continue;

            // const s = new Set();
            if (!container.querySelector('[ytx-flushing]')) {
              if (container.hasAttribute('ytx-flushing')) {
                const attrVal = container.getAttribute('ytx-flushing');
                container.removeAttribute('ytx-flushing');
                // s.add([container, attrVal]);
                addTask(container, attrVal);
                // addTaskIm(container, attrVal);
                let ancestor = container.closest('[ytx-flushing]');
                while (ancestor) {
                  if (ancestor.querySelector('[ytx-flushing]')) break;
                  const attrVal = ancestor.getAttribute('ytx-flushing');
                  ancestor.removeAttribute('ytx-flushing');
                  // s.add([ancestor, attrVal]);
                  addTask(ancestor, attrVal);
                  // addTaskIm(ancestor, attrVal);
                  ancestor = ancestor.closest('[ytx-flushing]');
                }
              }
            }
          }
          executeTasks();


        });
        
        g();
        // const useMicroTaskQueue = this.__qsd477__ === 2;
        // useMicroTaskQueue ? addTask2(g) : g();
        // executeTasks();

        // addTask2(g);
        // executeTasks();

      }

      throw new Error('e5bd8d2f');

    }

    let tasks = [];
    let excuted = false;
    const executeTasks = ()=>{
      if(excuted || tasks.length === 0) return;
      excuted = true;
      let t0 = 0;
      const perform = ()=>{
        if(!t0) t0 = nativeNow();
        const task = tasks.shift();
        if(!task){
          excuted = false;
          return;
        }
        task.fn(task);
        const t1 = nativeNow();
        if(t1 - t0 > 10){
          t0 = 0;
          nextBrowserTick_(perform);
        }else{
          queueMicrotask_(perform);
        }
      }
      queueMicrotask_(perform);
    }

    const taskFn = (task) => {

      if(!task) return;
      const { containerWr, attrVal } = task;
      const container = kRef(containerWr);
      if (!container) return;
      if (attrVal === '0') return;
      const bEventCb = attrVal === '2';
      const producerWr = containerMapping.get(container);
      const producer = kRef(producerWr);
      if (!producer) return;
      const hostElement = producer.hostElement;
      if (!hostElement) return;
      if (hostElement.isConnected !== true) return; // tbc
      producer.markDirty && producer.markDirty();
      bEventCb && dispatchYtEvent(hostElement, "yt-rendererstamper-finished", {
        container
      });

    }

    const addTask = (container, attrVal) => {
      if (!container) return;
      const containerWr = container[wk] || (container[wk] = mWeakRef(container));
      tasks.push({
        fn: taskFn,
        containerWr: containerWr,
        attrVal
      });
      // pr77 = pr77.then(()=>{

      // })
      // taskFn({
      //   containerWr: containerWr,
      //   attrVal
      //   })

    }

    const addTaskIm =  (container, attrVal) => {
      if (!container) return;
      const containerWr = container[wk] || (container[wk] = mWeakRef(container));
      taskFn({
        fn: taskFn,
        containerWr: containerWr,
        attrVal
      });

    }


    const addTask2 = (f) => {
      // pr77 = pr77.then(f).catch(console.warn);
      tasks.push({
        fn: f
      });

    }

    // const mo = new MutationObserver((mutations)=>{

    // });
    // mo.observe(document, {attributeFilter: ['ytx-flushing'], attributes: true, subtree: true, childList: false});

    const containerMapping = new WeakMap();

    // let pr77 = Promise.resolve();
    // let pr88 = Promise.resolve();
    const uA4 = function (t, P) {
      for (let y in t)
        if (t.hasOwnProperty(y) && P[y])
          return y;
      return null
    }

    const evaluteUseMicroTaskQueue = (ax_, containerId, hostIs_, producer, hostElement)=>{

      const ax = ax_;
      const useMicroTaskQueue = ax ? (ax[2] && ax[2]!==ax[0]) : false;
      let useMicroTaskQueue2 = ax && ax[1] && ax[2];
      // const useMicroTaskQueue = false;
      if (ax && ax[2] && ax[2] === ax[0]) { // short ... execute job
        ax[2].cancel();
        useMicroTaskQueue2 = false;
      }
      // console.log(1992,containerId, this.hostElement.is)

      // if (hostElement.nodeType !== 1 || !hostElement.is || hostElement.isConnected === false || !document.body.contains(hostElement)){
      //   console.log(12773, hostElement.nodeType !== 1, !hostElement.is, hostElement.isConnected === false, !document.body.contains(hostElement))
      //   return false;

      // }

      if (producer.hasFlexibleItems === true) {
        return false;
      }

      if (hostElement.isConnected === false || hostElement.closest('[hidden]')) {
        return false;
      }

      const hostIs = hostIs_;

      if (hostIs === 'ytd-masthead' || hostIs === 'ytd-button-renderer' || hostIs === 'yt-button-shape' || hostIs === 'yt-icon-button' || hostIs === 'ytd-notification-topbar-button-renderer' || containerId === 'buttons' || containerId === 'button' || containerId === 'icon' || hostIs === 'yt-interaction' || containerId === 'interaction') return false;

      if (containerId === 'overlays') useMicroTaskQueue2 = true;
      else if (hostIs === 'ytd-rich-grid-media' || hostIs === 'ytd-rich-grid-renderer') useMicroTaskQueue2 = true;
      // else if (hostIs === 'ytd-rich-grid-media' || hostIs === 'ytd-rich-grid-renderer') useMicroTaskQueue2 = false;
      // else if (containerId === 'menu') useMicroTaskQueue2 = true;
      else if (containerId === 'replies') useMicroTaskQueue2 = true;
      else if (containerId === 'flexible-item-buttons' && hostIs === 'ytd-menu-renderer') useMicroTaskQueue2 = true;
      else if(hostIs === 'ytd-menu-popup-renderer') useMicroTaskQueue2 = false;
      else if ( containerId === 'ghost-comment-section' && hostIs === 'ytd-continuation-item-renderer') useMicroTaskQueue2 = true;
      else if (hostIs === 'ytd-continuation-item-renderer') useMicroTaskQueue2 = false;
      else if (hostIs === 'ytd-feed-filter-chip-bar-renderer' ||  hostIs === 'yt-chip-cloud-renderer' || containerId==='filter' || containerId ==='chips' || containerId==='left-arrow-button' ||containerId==='right-arrow-button') useMicroTaskQueue2 =false;
      // else if (containerId === 'contents' || containerId === 'content' || containerId === 'header') useMicroTaskQueue2 = true;
      // else if( containerId === 'items') useMicroTaskQueue2 = true;
      else if (containerId === 'menu' && hostIs === 'ytd-playlist-panel-video-renderer') useMicroTaskQueue2 = true;
      else if (containerId === 'top-level-buttons-computed' && hostIs === 'ytd-menu-renderer') useMicroTaskQueue2 = false;
      else if (hostIs === 'ytd-comment-view-model') useMicroTaskQueue2 = true;
      // else if (hostIs === 'ytd-rich-item-renderer') useMicroTaskQueue2 = true;
      // else if (hostIs === 'ytd-rich-grid-media') useMicroTaskQueue2 = true;
      else if (hostIs === 'ytd-video-preview') useMicroTaskQueue2 = true;
      // else if (hostIs === 'ytd-game-card-renderer')useMicroTaskQueue2 = true;


      // console.log(19920030+(useMicroTaskQueue2?1:0), containerId, hostIs)


      // console.log(5992,stackAt)

      // console.log(2883, this[`__quu477#${containerId}__`] )
      // if (useMicroTaskQueue) {
      //   console.log(stackAt)
      // }

      // if (useMicroTaskQueue) {
      //   console.log(1120301)
      // }

      // if(hostElement.closest('ytd-feed-filter-chip-bar-renderer')) useMicroTaskQueue2 = false;

      return useMicroTaskQueue2;

    }

    const frag385 = document.createDocumentFragment();
    frag385.appendChild4202 = frag385.appendChild;
    frag385.removeChild4202 = frag385.removeChild;
            
    const cm385 = document.createComment('.');

    const doc385 = document.implementation.createHTMLDocument();
    const html385 = doc385.firstElementChild;
    const node385 = html385.appendChild(document.createElement('div'));

    const fixContainerApi = (container) => {
      if (container instanceof Node) {
        const containerDomApi = container.__domApi;
        if (containerDomApi && !containerDomApi.removeChild588 && containerDomApi.removeChild) {
          // console.log(123882, container)
          containerDomApi.removeChild588 = containerDomApi.removeChild;
          containerDomApi.removeChild = function (elem) {
            let r;
            for (const s of elem.querySelectorAll('[ytx-flushing]')) {
              s.setAttribute('ytx-flushing', '0');
            }
            try {
              r = this.removeChild588(elem);
            } catch (e) { }
            if (!r) {
              frag385.appendChild4202(elem);
              frag385.removeChild4202(elem);
              r = elem;
            }
            for (const s of elem.querySelectorAll('[ytx-flushing]')) {
              s.removeAttribute('ytx-flushing');
            }
            return r;
          }
        }
      }
    }

    const stampDomArray_ = function (dataList, containerId, typeOrConfig, bReuse, bEventCb, bStableList) {

      const sqq = this[`__$$stampSqq$$#${containerId}__`];
      if (typeof sqq === 'function') sqq();

      // trigger in rendererStamperApplyChangeRecord_

      // const stackAt = `\n\n${new Error().stack}\n\n`.replace(/[\r\n]([^\r\n]*?\.user\.js[^\r\n]*?[\r\n]+)+/g, '\n').replace(/[\r\n]([^\r\n.]+[\r\n]+)+/g, '\n').trim().split(/[\r\n]+/)[0];
      // const useMicroTaskQueue = (stackAt.includes('.rendererStamperApplyChangeRecord_'));
      // const useMicroTaskQueue = stackAt.includes('.<anonymous>') ? true : false;
      
      // const stackAt = `\n\n${new Error().stack}\n\n`.replace(/[\r\n]([^\r\n]*?\.user\.js[^\r\n]*?[\r\n]+)+/g, '\n').replace(/[\r\n]([^\r\n.]+[\r\n]+)+/g, '\n').trim().split(/[\r\n]+/)[0];

      // const isRenderJob = this[`__quu477#${containerId}__`] || !!this.renderJobsMap_[containerId];
      // const useMicroTaskQueue = isRenderJob && !stackAt.includes('scheduler.js') && 0 ? true : false; // avoid immediate job


      const ax = this[`__quu477#${containerId}__`];
      const hostIs = (this.hostElement || 0).is;
      const useMicroTaskQueue2 = evaluteUseMicroTaskQueue(ax, containerId, hostIs, this, this.hostElement);

      const container = this.getStampContainer7409_(containerId);
      const pChildren = (container instanceof Node && container.isConnected) ? [...container.children] : [];
      renderPathMake(pChildren)

      containerMapping.set(container, 
        (this[wk] || (this[wk] = mWeakRef(this)))
      );

      if (bEventCb) container.setAttribute('ytx-flushing', '2');
      else if (!container.hasAttribute('ytx-flushing')) container.setAttribute('ytx-flushing', '1');

      // let dataList_ = dataList;
      let dataList_ = typeof (dataList || 0) === 'object' ? (dataList.length >= 1 ? dataList.slice() : []) : dataList;

      dataList = null;
      const gid = this[`__$$stampSID$$#${containerId}__`] = genId();
      let fq = 0;
      const f = (() => {
        if(fq) return;
        fq = 1;
        if (gid !== this[`__$$stampSID$$#${containerId}__`]) { return; }
        this[`__$$stampSFn$$#${containerId}__`] = null;
        const container = this.getStampContainer7409_(containerId);

        this.__lat457__ = this.__lat457__ || new Set();
        if(!container[wk]) container[wk] = mWeakRef(container);
        this.__lat457__.add(container[wk]);
        fixContainerApi(container);

        // let q = this.deferredBindingTasks_;
        // this.deferredBindingTasks_ = [];
        this.__qsd477__ = useMicroTaskQueue2 ? 2 : 1;
        let e_;
        try {
          this.stampDomArray7409_(dataList_, containerId, typeOrConfig, false, bEventCb, bStableList);
        } catch (e) { e_ = e }
        this.__qsd477__ = false;
        dataList_ = typeOrConfig = null;
        fixContainerApi(container);
        // this.deferredBindingTasks_ = q;
        if(e_ && e_.message !== 'e5bd8d2f') throw e_;
        if (!e_) {
          // container.setAttribute('ytx-flushing', '0');
        }
        // if( container.childElementCount === 0 ){
        //   container.setAttribute('ytx-flushing', '0');
        //   this.markDirty && this.markDirty();
        //   bEventCb && dispatchYtEvent(this.hostElement, "yt-rendererstamper-finished", {
        //     container
        //   });
        // }




      });
      this[`__$$stampSFn$$#${containerId}__`] = f;
      this[`__$$stampSqq$$#${containerId}__`] = f;
      useMicroTaskQueue2 ? addTask2(f) : f();
      executeTasks();

      Promise.resolve(pChildren).then(pChildren => {
        for (const node of pChildren) {
          if (node.isConnected === false) {
            _removedElements.addNode(node); // rn54006
          }
        }
        pChildren.length = 0;
        pChildren = null;
      });

      // console.log(58801, this.hostElement.parentNode instanceof HTMLElement_);

      return undefined;

    }

    const stampDomArraySplices_ = function (stampKey, containerId, indexSplicesObj) {


      const sqq = this[`__$$stampSqq$$#${containerId}__`];
      if (typeof sqq === 'function') sqq();

      // trigger in rendererStamperApplyChangeRecord_

      if (typeof indexSplicesObj === 'object' && indexSplicesObj.indexSplices instanceof Array) {
      } else {
        return this.stampDomArraySplices7409_(stampKey, containerId, indexSplicesObj);
      }


      // trigger in rendererStamperApplyChangeRecord_

      // const stackAt = `\n\n${new Error().stack}\n\n`.replace(/[\r\n]([^\r\n]*?\.user\.js[^\r\n]*?[\r\n]+)+/g, '\n').replace(/[\r\n]([^\r\n.]+[\r\n]+)+/g, '\n').trim().split(/[\r\n]+/)[0];
      // const useMicroTaskQueue = (stackAt.includes('.rendererStamperApplyChangeRecord_'));
      // const useMicroTaskQueue = stackAt.includes('.<anonymous>') ? true : false;
      

      // const stackAt = `\n\n${new Error().stack}\n\n`.replace(/[\r\n]([^\r\n]*?\.user\.js[^\r\n]*?[\r\n]+)+/g, '\n').replace(/[\r\n]([^\r\n.]+[\r\n]+)+/g, '\n').trim().split(/[\r\n]+/)[0];

      // const isRenderJob = this[`__quu477#${containerId}__`] || !!this.renderJobsMap_[containerId];
      // const useMicroTaskQueue = isRenderJob && !stackAt.includes('scheduler.js') && 0 ? true : false; // avoid immediate job
      // const useMicroTaskQueue = this[`__quu477#${containerId}__`] ? true : false;

      const ax = this[`__quu477#${containerId}__`];
      const hostIs = (this.hostElement || 0).is;
      const useMicroTaskQueue2 = evaluteUseMicroTaskQueue(ax, containerId, hostIs, this, this.hostElement);


      // const stackAt = `\n\n${new Error().stack}\n\n`.replace(/[\r\n]([^\r\n]*?\.user\.js[^\r\n]*?[\r\n]+)+/g, '\n').replace(/[\r\n]([^\r\n.]+[\r\n]+)+/g, '\n').trim().split(/[\r\n]+/)[0];
      // const useMicroTaskQueue = true;
      
      const container = this.getStampContainer7409_(containerId);

      containerMapping.set(container, 
        (this[wk] || (this[wk] = mWeakRef(this)))
      );
      
      const bEventCb = this.stampDom[stampKey].events;
      if (bEventCb) container.setAttribute('ytx-flushing', '2');
      else if (!container.hasAttribute('ytx-flushing')) container.setAttribute('ytx-flushing', '1');

      // let indexSplicesObj_ = indexSplicesObj;
      // if (typeof indexSplicesObj === 'object' && indexSplicesObj.indexSplices instanceof Array) {
      //   indexSplicesObj_ = {
      //     indexSplices: indexSplicesObj.indexSplices.map(slice => {
      //       const { index, addedCount, removed, object, type } = slice;
      //       this[`__$$stampSpliceObj$$#${containerId}__`] = (object[wk] || (object[wk] = mWeakRef(object)));
      //       return { index, addedCount, removed, object, type };
      //     })
      //   };
      // }


      indexSplicesObj.indexSplices.forEach(slice => {
        const object = slice.object;
        if (!object || typeof object !== 'object') return;
        // const { index, addedCount, removed, object, type } = slice;
        this[`__$$stampSpliceObj$$#${containerId}__`] = (object[wk] || (object[wk] = mWeakRef(object)));
        // return { index, addedCount, removed, object, type };
      });

      // let indexSplicesObj_ = indexSplicesObj;

      // console.log(128783, indexSplicesObj)

      // let indexSplicesObj_ = indexSplicesObj.map(slice => {
      //   const { index, addedCount, removed, object, type } = slice;
      //   return { index, addedCount, removed, object, type };
      // });

      indexSplicesObj = null;

      if (!this[`__$$stampSID$$#${containerId}__`]) this[`__$$stampSID$$#${containerId}__`] = genId();
      const gid = this[`__$$stampSID$$#${containerId}__`];
      let fq = 0;
      const f = (() => {
        if(fq) return;
        fq = 1;
        if (gid !== this[`__$$stampSID$$#${containerId}__`]) { return; }
        if (this[`__$$stampSFn$$#${containerId}__`]) this[`__$$stampSFn$$#${containerId}__`]();
        const container = this.getStampContainer7409_(containerId);
        if(!container) return;

        // console.log(388 , kRef(this[`__$$stampSpliceObj$$#${containerId}__`]))

        const object = kRef(this[`__$$stampSpliceObj$$#${containerId}__`]);
        // const elementKeys = new Set(Array.prototype.map.call((container.__domApi || container).children, e=>e[s52]));
        const mapping = this.stampDom[stampKey].mapping;

        const map = new Map();

        const currentObjKeys = object.map(objEntry => {
          const mappingKey = uA4(mapping, objEntry);
          if(!mappingKey) return null;
          const data = objEntry[mappingKey];
          if (!data[s52]) data[s52] = genId();
          map.set(data[s52], objEntry);
          // return ({
          //   objEntry,
          //   data: data,
          //   mappingKey: mappingKey,
          //   key: data[s52],
          //   exist: elementKeys.has(data[s52])
          // });
          return data[s52]

        });

        const oldDomKeys = Array.prototype.map.call((container.__domApi || container).children, node=>node[s52]);

        // console.log(currentObjKeys, oldDomKeys, diffSplices(oldDomKeys, currentObjKeys));

        const splices =  diffSplices(oldDomKeys, currentObjKeys);

        // let myObject = object;
        let indexSplicesObj_ = {
          indexSplices: splices.map(splice => {
            const index = splice[0];
            const removedLen = splice[1];
            const added = splice[2];
            const addedCount = added.length;
            const object = {};
            object.length = index + addedCount;
            for (let i = 0; i < addedCount; i++) {
              object[index + i] = map.get(added[i]);
            }
            const removed = {};
            removed.length = removedLen;

            return { index, removed, object, addedCount }
          })
        };
        map.clear();


        this.__lat457__ = this.__lat457__ || new Set();
        if(!container[wk]) container[wk] = mWeakRef(container);
        this.__lat457__.add(container[wk]);
        fixContainerApi(container);

        // console.log(3882, indexSplicesObj_)
        // let q = this.deferredBindingTasks_;
        // this.deferredBindingTasks_ = [];
        this.__qsd477__ = useMicroTaskQueue2 ? 2 : 1;
        let e_;
        try {
          this.stampDomArraySplices7409_(stampKey, containerId, indexSplicesObj_);
        } catch (e) { e_ = e; }
        this.__qsd477__ = false;
        indexSplicesObj_ = null;
        stampKey = indexSplicesObj_ = null;
        fixContainerApi(container);
        // this.deferredBindingTasks_ = q;
        if(e_ && e_.message !== 'e5bd8d2f') throw e_;
        if (!e_) {
          // container.setAttribute('ytx-flushing', '0');
        }


      });
      this[`__$$stampSqq$$#${containerId}__`] = f;
      useMicroTaskQueue2 ? addTask2(f) : f();
      executeTasks();

      // console.log(58802, this.hostElement.parentNode instanceof HTMLElement_);

      return undefined;

    }

  

    const stampDomArrayWB_ = function (objWr, containerId, xxx_, renderJob0, dt0a) {
      const dt0 = dt0a[0];
      const dt1 = Date.now();
      const obj = kRef(objWr);
      if (!obj) return;
      const xxx = obj[`__stampDomArrayArgs_xxx__#${containerId}__`];
      if (xxx !== xxx_) return;
      const dataList = obj[`__stampDomArrayArgs_dataList__#${containerId}__`];
      const typeOrConfig = kRef(obj[`__stampDomArrayArgs_typeOrConfig__#${containerId}__`]);
      const bReuse = obj[`__stampDomArrayArgs_bReuse__#${containerId}__`];
      const bEventCb = obj[`__stampDomArrayArgs_bEventCb__#${containerId}__`];
      const bStableList = obj[`__stampDomArrayArgs_bStableList__#${containerId}__`];
      const renderJob1 = obj.renderJobsMap_[containerId]
      // console.log(3188, dt0, dt1, renderJob0, renderJob1)
      obj[`__quu477#${containerId}__`] = [renderJob0,  (dt1 - dt0 >= 1), renderJob1];
      let e_, r;
      try {
        r = obj.stampDomArray_(dataList, containerId, typeOrConfig, bReuse, bEventCb, bStableList);
      } catch (e) {
        e_ = e;
      }
      obj[`__quu477#${containerId}__`] = false;
      if (e_) throw e_;
      return r;
    };

    

    stampDomArray_.bind = function (obj, ...args) {
      let [dataList, containerId, typeOrConfig, bReuse, bEventCb, bStableList] = args;
      if (!obj[wk]) obj[wk] = mWeakRef(obj);
      obj[`__stampDomArrayArgs_dataList__#${containerId}__`] = dataList;
      const typeOrConfig_ = typeof (typeOrConfig || 0) === 'object' ? (typeOrConfig[wk] || (typeOrConfig[wk] = mWeakRef(typeOrConfig))) : typeOrConfig;
      obj[`__stampDomArrayArgs_typeOrConfig__#${containerId}__`] = typeOrConfig_;
      obj[`__stampDomArrayArgs_bReuse__#${containerId}__`] = bReuse;
      obj[`__stampDomArrayArgs_bEventCb__#${containerId}__`] = bEventCb;
      obj[`__stampDomArrayArgs_bStableList__#${containerId}__`] = bStableList;
       const xxx = obj[`__stampDomArrayArgs_xxx__#${containerId}__`] = `${Math.random()}_${Date.now()}`;


      const renderJob = obj.renderJobsMap_[containerId];

      const dt0a = [Date.now()];
      queueMicrotask_(() => { dt0a[0] = 0 });
      return stampDomArrayWB_.bind(null, obj[wk], containerId, xxx, renderJob, dt0a);
    };

    
    const stampDomArraySplicesWB_ = function (objWr, stampKey, containerId, indexSplicesObj, renderJob0, dt0a) {
      const dt0 = dt0a[0];
      const dt1 = Date.now();
      const obj = kRef(objWr);
      if (!obj) return;
      const renderJob1 = obj.renderJobsMap_[containerId];
      obj[`__quu477#${containerId}__`] = [renderJob0,  (dt1 - dt0 >= 1), renderJob1];
      let e_, r;
      try {
        r = obj.stampDomArraySplices_( stampKey, containerId, indexSplicesObj);
      } catch (e) {
        e_ = e;
      }
      obj[`__quu477#${containerId}__`] = false;
      if (e_) throw e_;
      return r;
    };

    

    stampDomArraySplices_.bind = function (obj, ...args) {
      let [stampKey, containerId, indexSplicesObj] = args;
      if (!obj[wk]) obj[wk] = mWeakRef(obj);

      const renderJob = obj.renderJobsMap_[containerId];

      const dt0a = [Date.now()];
      queueMicrotask_(() => { dt0a[0] = 0 });
      return stampDomArraySplicesWB_.bind(null, obj[wk], stampKey, containerId, indexSplicesObj, renderJob, dt0a);
    };

    const flushRenderStamperComponentBindings7419_ = function () {
      const tasks = this.deferredBindingTasks_;
      if (!(tasks || 0).length) return;
      const hostElement = this.hostElement;
      if ((hostElement instanceof Node) && hostElement.nodeType === 1) {
        if (hostElement.isConnected === true) {
          this.flushRenderStamperComponentBindings7409_();
        }
      } else if (hostElement) {
        console.log('flushRenderStamperComponentBindings7419_ 002')
        this.flushRenderStamperComponentBindings7409_();
      } else {
        console.log('flushRenderStamperComponentBindings7419_ 003')
        tasks.length = 0;
      }
    }

    return { getStampContainer_, createComponent_, deferRenderStamperBinding_, flushRenderStamperComponentBindings_, stampDomArray_, stampDomArraySplices_ , flushRenderStamperComponentBindings7419_};

  }

  const setupDiscreteTasks = (h, rb) => {

    if (typeof h.onYtRendererstamperFinished === 'function' && !(h.onYtRendererstamperFinished.km34)) {
      const f = h.onYtRendererstamperFinished;
      const g = ump3.get(f) || function () {
        if (this.updateChildVisibilityProperties && !this.markDirty) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onYtRendererstamperFinished = g;

    }

    if (typeof h.onYtUpdateDescriptionAction === 'function' && !(h.onYtUpdateDescriptionAction.km34)) {
      const f = h.onYtUpdateDescriptionAction;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onYtUpdateDescriptionAction = g;

    }

    if (typeof h.handleUpdateDescriptionAction === 'function' && !(h.handleUpdateDescriptionAction.km34)) {
      const f = h.handleUpdateDescriptionAction;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleUpdateDescriptionAction = g;

    }

    if (typeof h.handleUpdateLiveChatPollAction === 'function' && !(h.handleUpdateLiveChatPollAction.km34)) {
      const f = h.handleUpdateLiveChatPollAction;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleUpdateLiveChatPollAction = g;

    }

    if (typeof h.onTextChanged === 'function' && !(h.onTextChanged.km34)) {
      const f = h.onTextChanged;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onTextChanged = g;

    }

    if (typeof h.onVideoDataChange === 'function' && !(h.onVideoDataChange.km34)) {
      const f = h.onVideoDataChange;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onVideoDataChange = g;

    }

    if (typeof h.onVideoDataChange_ === 'function' && !(h.onVideoDataChange_.km34)) {
      const f = h.onVideoDataChange_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onVideoDataChange_ = g;

    } 

    if (typeof h.addTooltips_ === 'function' && !(h.addTooltips_.km34)) {

      const f = h.addTooltips_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.addTooltips_ = g;

    }

    if (typeof h.updateRenderedElements === 'function' && !(h.updateRenderedElements.km34)) {

      const f = h.updateRenderedElements;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updateRenderedElements = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 2) && typeof h.loadPage_ === 'function' && !(h.loadPage_.km34)) {
      const f = h.loadPage_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.loadPage_ = g;

    }
    // updatePageData_ : possible conflict with Omit ShadyDOM
    if ((WEAK_REF_BINDING_CONTROL & 2) && typeof h.updatePageData_ === 'function' && !(h.updatePageData_.km34)) {
      const f = h.updatePageData_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updatePageData_ = g;

    }


    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.onFocus_ === 'function' && !(h.onFocus_.km34)) {

      const f = h.onFocus_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onFocus_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.onBlur_ === 'function' && !(h.onBlur_.km34)) {

      const f = h.onBlur_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onBlur_ = g;

    }


    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.buttonClassChanged_ === 'function' && !(h.buttonClassChanged_.km34)) {

      const f = h.buttonClassChanged_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.buttonClassChanged_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.buttonIconChanged_ === 'function' && !(h.buttonIconChanged_.km34)) {

      const f = h.buttonIconChanged_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.buttonIconChanged_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.dataChangedInBehavior_ === 'function' && !(h.dataChangedInBehavior_.km34)) {

      const f = h.dataChangedInBehavior_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.dataChangedInBehavior_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.continuationsChanged_ === 'function' && !(h.continuationsChanged_.km34)) {

      const f = h.continuationsChanged_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.continuationsChanged_ = g;

    }


    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.forceChatPoll_ === 'function' && !(h.forceChatPoll_.km34)) {

      const f = h.forceChatPoll_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.forceChatPoll_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.onEndpointClick_ === 'function' && !(h.onEndpointClick_.km34)) {

      const f = h.onEndpointClick_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onEndpointClick_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.onEndpointTap_ === 'function' && !(h.onEndpointTap_.km34)) {

      const f = h.onEndpointTap_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onEndpointTap_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.handleClick_ === 'function' && !(h.handleClick_.km34)) {

      const f = h.handleClick_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleClick_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.onReadyStateChange_ === 'function' && !(h.onReadyStateChange_.km34)) {

      const f = h.onReadyStateChange_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onReadyStateChange_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.onReadyStateChangeEntryPoint_ === 'function' && !(h.onReadyStateChangeEntryPoint_.km34)) {

      const f = h.onReadyStateChangeEntryPoint_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onReadyStateChangeEntryPoint_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.readyStateChangeHandler_ === 'function' && !(h.readyStateChangeHandler_.km34)) {

      const f = h.readyStateChangeHandler_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.readyStateChangeHandler_ = g;

    }

    if (typeof h.xmlHttpHandler_ === 'function' && !(h.xmlHttpHandler_.km34)) {

      const f = h.xmlHttpHandler_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.xmlHttpHandler_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.executeCallbacks_ === 'function' && !(h.executeCallbacks_.km34)) {

      const f = h.executeCallbacks_; // overloaded
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.executeCallbacks_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.handleInvalidationData_ === 'function' && !(h.handleInvalidationData_.km34)) {

      const f = h.handleInvalidationData_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleInvalidationData_ = g;

    }

    if (typeof h.onInput_ === 'function' && !(h.onInput_.km34)) {

      const f = h.onInput_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onInput_ = g;

    }
    if (typeof h.trigger_ === 'function' && !(h.trigger_.km34)) {

      const f = h.trigger_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.trigger_ = g;

    }

    if (typeof h.requestData_ === 'function' && !(h.requestData_.km34)) {

      const f = h.requestData_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.requestData_ = g;

    }

    if (typeof h.onLoadReloadContinuation_ === 'function' && !(h.onLoadReloadContinuation_.km34)) {

      const f = h.onLoadReloadContinuation_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onLoadReloadContinuation_ = g;

    }

    if (typeof h.onLoadIncrementalContinuation_ === 'function' && !(h.onLoadIncrementalContinuation_.km34)) {

      const f = h.onLoadIncrementalContinuation_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onLoadIncrementalContinuation_ = g;

    }

    if (typeof h.onLoadSeekContinuation_ === 'function' && !(h.onLoadSeekContinuation_.km34)) {

      const f = h.onLoadSeekContinuation_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onLoadSeekContinuation_ = g;

    }
    if (typeof h.onLoadReplayContinuation_ === 'function' && !(h.onLoadReplayContinuation_.km34)) {

      const f = h.onLoadReplayContinuation_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onLoadReplayContinuation_ = g;

    }
    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.onNavigate_ === 'function' && !(h.onNavigate_.km34)) {

      const f = h.onNavigate_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onNavigate_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.ytRendererBehaviorDataObserver_ === 'function' && !(h.ytRendererBehaviorDataObserver_.km34)) {

      const f = h.ytRendererBehaviorDataObserver_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.ytRendererBehaviorDataObserver_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.ytRendererBehaviorTargetIdObserver_ === 'function' && !(h.ytRendererBehaviorTargetIdObserver_.km34)) {

      const f = h.ytRendererBehaviorTargetIdObserver_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.ytRendererBehaviorTargetIdObserver_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.unregisterRenderer_ === 'function' && !(h.unregisterRenderer_.km34)) {

      const f = h.unregisterRenderer_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.unregisterRenderer_ = g;

    }

    if ((WEAK_REF_BINDING_CONTROL & 1) && typeof h.textChanged_ === 'function' && !(h.textChanged_.km34)) {

      const f = h.textChanged_;
      const g = ump3.get(f) || function (a) {
        if (void 0 !== this.isAttached) {
          const hostElement = this.hostElement;
          if (!(hostElement instanceof Node) || hostElement.nodeName === 'NOSCRIPT') {
            return;
          }
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.textChanged_ = g;

    }



    /**
     *
     * Neglect following
     *
     * h.onYtAction_
     * h.startLoadingWatch [ buggy for yt-player-updated ]
     * h.deferRenderStamperBinding_
     *
     * h.stampDomArray_
     * h.stampDomArraySplices_
     *
     */


    // RP.prototype.searchChanged_ = RP.prototype.searchChanged_;
    // RP.prototype.skinToneChanged_ = RP.prototype.skinToneChanged_;
    // RP.prototype.onEmojiHover_ = RP.prototype.onEmojiHover_;
    // RP.prototype.onSelectCategory_ = RP.prototype.onSelectCategory_;
    // RP.prototype.onShowEmojiVariantSelector = RP.prototype.onShowEmojiVariantSelector;
    // RP.prototype.updateCategoriesAndPlaceholder_ = RP.prototype.updateCategoriesAndPlaceholder_;

    if (typeof h.searchChanged_ === 'function' && !(h.searchChanged_.km34)) {

      const f = h.searchChanged_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.searchChanged_ = g;

    }

    if (typeof h.skinToneChanged_ === 'function' && !(h.skinToneChanged_.km34)) {

      const f = h.skinToneChanged_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.skinToneChanged_ = g;

    }

    if (typeof h.onEmojiHover_ === 'function' && !(h.onEmojiHover_.km34)) {

      const f = h.onEmojiHover_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onEmojiHover_ = g;

    }

    if (typeof h.onSelectCategory_ === 'function' && !(h.onSelectCategory_.km34)) {

      const f = h.onSelectCategory_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onSelectCategory_ = g;

    }

    if (typeof h.onShowEmojiVariantSelector === 'function' && !(h.onShowEmojiVariantSelector.km34)) {

      const f = h.onShowEmojiVariantSelector;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onShowEmojiVariantSelector = g;

    }

    if (typeof h.updateCategoriesAndPlaceholder_ === 'function' && !(h.updateCategoriesAndPlaceholder_.km34)) {

      const f = h.updateCategoriesAndPlaceholder_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updateCategoriesAndPlaceholder_ = g;

    }

    if (typeof h.watchPageActiveChanged_ === 'function' && !(h.watchPageActiveChanged_.km34)) {

      const f = h.watchPageActiveChanged_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.watchPageActiveChanged_ = g;

    }

    if (typeof h.activate_ === 'function' && !(h.activate_.km34)) {

      const f = h.activate_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.activate_ = g;

    }
    if (typeof h.onYtPlaylistDataUpdated_ === 'function' && !(h.onYtPlaylistDataUpdated_.km34)) {

      const f = h.onYtPlaylistDataUpdated_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onYtPlaylistDataUpdated_ = g;

    }



    /**
     *
     * Neglect following
     *
     * h.rendererStamperObserver_
     * h.rendererStamperApplyChangeRecord_
     * h.flushRenderStamperComponentBindings_
     * h.forwardRendererStamperChanges_
     *
     */

    if (typeof h.tryRenderChunk_ === 'function' && !(h.tryRenderChunk_.km34)) {

      const f = h.tryRenderChunk_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.tryRenderChunk_ = g;

    }


    if (typeof h.renderChunk_ === 'function' && !(h.renderChunk_.km34)) {

      const f = h.renderChunk_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.renderChunk_ = g;

    }

    if (typeof h.deepLazyListObserver_ === 'function' && !(h.deepLazyListObserver_.km34)) {

      const f = h.deepLazyListObserver_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.deepLazyListObserver_ = g;

    }

    if (typeof h.onItemsUpdated_ === 'function' && !(h.onItemsUpdated_.km34)) {

      const f = h.onItemsUpdated_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onItemsUpdated_ = g;

    }

    if (typeof h.requestRenderChunk_ === 'function' && !(h.requestRenderChunk_.km34)) {

      const f = h.requestRenderChunk_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.requestRenderChunk_ = g;

    }

    /**
     *
     * Neglect following
     *
     * h.dataChanged_ [ buggy for page swtiching ]
     *
     * h.updateChangeRecord_ [ see https://github.com/cyfung1031/userscript-supports/issues/20 ]
     *
     * h.cancelPendingTasks_
     * h.fillRange_
     * h.addTextNodes_
     * h.updateText_
     * h.stampTypeChanged_
     *
     */


  }

  const keyStConnectedCallback = Symbol(); // avoid copying the value

  const dmf = new WeakMap();


  let nativeHTMLElement = Reflect.getPrototypeOf(HTMLFontElement);

  try {

    const q = document.createElement('template');
    q.innerHTML = '<ytz-null361></ytz-null361>';
    nativeHTMLElement = q.content.firstChild.constructor

  } catch (e) { }

  if (!nativeHTMLElement.prototype.connectedCallback) {
    nativeHTMLElement.prototype.connectedCallback79 = nativeHTMLElement.prototype.connectedCallback;
    nativeHTMLElement.prototype.connectedCallback = function () {
      let r;
      if (this.connectedCallback79) r = this.connectedCallback79.apply(this, arguments);
      return r;
    }
  }
  const pvr = Symbol()

  let stampDomArrayFnStore = null;
  const setupMap = new WeakSet();
  
  const setupYtComponent = (cnt) => {
    const cProto = Reflect.getPrototypeOf(cnt || 0) || 0;
    if (!cProto || setupMap.has(cProto)) return;
    setupMap.add(cProto);
    if (FIX_stampDomArray && !(cProto[pvr] & 1) && 'stampDomArray_' in cProto) {
      cProto[pvr] |= 1;



      if (FIX_stampDomArray && !location.pathname.startsWith('/live_chat') && cProto.stampDomArray_) {
        const b = cProto.stampDomArray_.length === 6
          && cProto.getStampContainer_ && cProto.getStampContainer_.length === 1
          && cProto.createComponent_ && cProto.createComponent_.length === 3
          && cProto.deferRenderStamperBinding_ && cProto.deferRenderStamperBinding_.length === 3
          && cProto.flushRenderStamperComponentBindings_ && cProto.flushRenderStamperComponentBindings_.length === 0
          && cProto.deferRenderStamperBinding_ === cnt.deferRenderStamperBinding_
        if (!b) {
          console.warn("YouTube Coding Changed. createStampDomFns_() is not applied")
        } else if(!cProto.createComponent7409_ && !cProto.deferRenderStamperBinding7409_ && !cProto.flushRenderStamperComponentBindings7409_) {
          
          if(!stampDomArrayFnStore) stampDomArrayFnStore = createStampDomFnsC_();
          const {getStampContainer_, createComponent_, deferRenderStamperBinding_, flushRenderStamperComponentBindings_, stampDomArray_, stampDomArraySplices_, flushRenderStamperComponentBindings7419_} = stampDomArrayFnStore;

          cProto.getStampContainer7409_ = cProto.getStampContainer_;
          cProto.createComponent7409_ = cProto.createComponent_;
          cProto.deferRenderStamperBinding7409_ = cProto.deferRenderStamperBinding_;
          cProto.flushRenderStamperComponentBindings7409_ = cProto.flushRenderStamperComponentBindings_;
          cProto.stampDomArray7409_ = cProto.stampDomArray_;
          cProto.stampDomArraySplices7409_ = cProto.stampDomArraySplices_;

          cProto.getStampContainer_ = getStampContainer_;
          cProto.createComponent_ = createComponent_;
          cProto.deferRenderStamperBinding_ = deferRenderStamperBinding_;
          cProto.flushRenderStamperComponentBindings_ = flushRenderStamperComponentBindings_;
          cProto.stampDomArray_ = stampDomArray_;
          cProto.stampDomArraySplices_ = stampDomArraySplices_;
          cProto.flushRenderStamperComponentBindings7419_ = flushRenderStamperComponentBindings7419_;

          
          
        }
      }


      


      // if(false && cProto._runEffectsForTemplate && !cProto._runEffectsForTemplate6344) {
      //   cProto._runEffectsForTemplate6344 = cProto._runEffectsForTemplate;

      //   if(cProto._runEffectsForTemplate6344.length === 4){

      //     cProto._runEffectsForTemplate = function (c, d, e, g) {
      //       const cnt = this;
      //       const { propertyEffects, nodeList, firstChild } = c;
      //       cnt._runEffectsForTemplate6344({ propertyEffects, nodeList, firstChild }, d, e, g);

      //     }

      //   }

      // }

    }
  };

  (FIX_stampDomArray) && Object.defineProperty(Object.prototype, 'connectedCallback', {
    get() {
      
      const f = this[keyStConnectedCallback];
      if (this.is) {
        setupYtComponent(this);
      }
      return f;
    },
    set(nv) {
      let gv = nv;
      this[keyStConnectedCallback] = gv; // proto or object
      return true;
    },
    enumerable: false,
    configurable: true

  });

  const pLoad = new Promise(resolve => {
    if (document.readyState !== 'loading') {
      resolve();
    } else {
      window.addEventListener("DOMContentLoaded", resolve, false);
    }
  });

  if (FIX_ACTIONS_TOOLTIPS) {
    pLoad.then(() => {
      addNewCSS("#actions .tp-yt-paper-tooltip{white-space:nowrap}");
    });
  }

  if (FIX_fix_requestIdleCallback_timing && !window.requestIdleCallback471 && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback471 = window.requestIdleCallback;
    window.requestIdleCallback = function (f, ...args) {
      return (this || window).requestIdleCallback471(async function () {
        await pLoad.then();
        // await new Promise(nextBrowserTick_);
        f.call(this, ...arguments)
      }, ...args);
    }
  }

  pLoad.then(() => {

    let nonce = document.querySelector('style[nonce]');
    nonce = nonce ? nonce.getAttribute('nonce') : null;
    const st = document.createElement('style');
    if (typeof nonce === 'string') st.setAttribute('nonce', nonce);
    st.textContent = "none-element-k47{order:0}";
    st.addEventListener('load', () => {
      pf31.resolve();
      p59 = 1;
    }, false);
    (document.body || document.head || document.documentElement).appendChild(st);

  });

  const prepareLogs = [];

  const skipAdsDetection = new Set(['/robots.txt', '/live_chat', '/live_chat_replay']);

  let winError00 = window.onerror;

  let fix_error_many_stack_state = !FIX_error_many_stack ? 0 : skipAdsDetection.has(location.pathname) ? 2 : 1;

  if (!JSON || !('parse' in JSON)) fix_error_many_stack_state = 0;

  ; fix_error_many_stack_state === 1 && (() => {


    let p1 = winError00;

    let stackNeedleDetails = null;

    Object.defineProperty(Object.prototype, 'matchAll', {
      get() {
        stackNeedleDetails = this;
        return true;
      },
      enumerable: true,
      configurable: true
    });

    try {
      JSON.parse("{}");
    } catch (e) {
      console.warn(e)
      fix_error_many_stack_state = 0;
    }

    delete Object.prototype['matchAll'];

    let p2 = window.onerror;

    window.onerror = p1;

    if (fix_error_many_stack_state === 0) return;

    if (stackNeedleDetails) {
      JSON.parse.stackNeedleDetails = stackNeedleDetails;
      stackNeedleDetails.matchAll = true;
    }

    if (p1 === p2) return (fix_error_many_stack_state = 0);

    // p1!==p2
    fix_error_many_stack_state = !stackNeedleDetails ? 4 : 3;

  })();

  ; fix_error_many_stack_state === 2 && (() => {


    let p1 = winError00;

    let objectPrune = null;
    let stackNeedleDetails = null;

    Object.defineProperty(Function.prototype, 'findOwner', {
      get() {
        objectPrune = this;
        return this._findOwner;
      },
      set(nv) {
        this._findOwner = nv;
        return true;
      },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(Object.prototype, 'matchAll', {
      get() {
        stackNeedleDetails = this;
        return true;
      },
      enumerable: true,
      configurable: true
    });

    try {
      JSON.parse("{}");
    } catch (e) {
      console.warn(e)
      fix_error_many_stack_state = 0;
    }

    delete Function.prototype['findOwner'];
    delete Object.prototype['matchAll'];

    let p2 = window.onerror;

    if (p1 !== p2) return (fix_error_many_stack_state = 4); // p1 != p2

    if (fix_error_many_stack_state == 0) return;

    // the following will only execute when Brave's scriptlets.js is executed.

    prepareLogs.push("fix_error_many_stack_state NB")

    if (stackNeedleDetails) {
      stackNeedleDetails.pattern = null;
      stackNeedleDetails.re = null;
      stackNeedleDetails.expect = null;
      stackNeedleDetails.matchAll = true;
    }

    if (objectPrune) {
      objectPrune.findOwner = objectPrune.mustProcess = objectPrune.logJson = () => { }
      delete objectPrune._findOwner;
    }

    fix_error_many_stack_state = 3;
    JSON.parse.stackNeedleDetails = stackNeedleDetails;
    JSON.parse.objectPrune = objectPrune;

  })();

  ; fix_error_many_stack_state === 3 && (() => {


    let p1 = winError00;

    try {
      JSON.parse("{}");
    } catch (e) {
      console.warn(e)
      fix_error_many_stack_state = 0;
    }

    let p2 = window.onerror;

    if (p1 === p2) return;

    window.onerror = p1;

    if (fix_error_many_stack_state === 0) return;

    fix_error_many_stack_state = 4; // p1 != p2


  })();

  fix_error_many_stack_state === 4 && (() => {

    // the following will only execute when Brave's scriptlets.js is executed.

    prepareLogs.push("fix_error_many_stack_state AB")

    JSON.parseProxy = JSON.parse;

    JSON.parse = ((parse) => {

      parse = parse.bind(JSON); // get a new instance of the current JSON.parse
      return function (text, reviver) {
        const onerror = window.onerror;
        window.onerror = null;
        let r;
        try {
          r = parse(...arguments);
        } catch (e) {
          r = e;
        }
        window.onerror = onerror;
        if (r instanceof Error) {
          throw r;
        }
        return r;
      }

    })(JSON.parse);


  })();


  // << if FIX_yt_player >>

  // credit to @nopeless (https://greasyfork.org/scripts/471489-youtube-player-perf/)
  const PERF_471489_ = true;
  // PERF_471489_ is not exactly the same to Youtube Player perf v0.7
  // This script uses a much gentle way to tamer the JS engine instead.

  // << end >>

  const steppingScaleN = 200; // transform: scaleX(k/N); 0<k<N



  const nilFn = () => { };

  let isMainWindow = false;
  try {
    isMainWindow = window.document === window.top.document
  } catch (e) { }

  let NO_PRELOAD_GENERATE_204_BYPASS = NO_PRELOAD_GENERATE_204 ? false : true;
  let headLinkCollection = null;


  // const assertor = (f) => f() || console.assert(false, `${f}`);

  const fnIntegrity_oldv1 = (f, d) => {
    if (!f || typeof f !== 'function') {
      console.warn('f is not a function', f);
      return;
    }
    let p = `${f}`, s = 0, j = -1, w = 0;
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
      return itz;
    } else {
      return itz === d;
    }
  };

  const fnIntegrity = (f, d) => {
    if (!f || typeof f !== 'function') {
      console.warn('f is not a function', f);
      return;
    }
    let p = `${f}`, s = 0, j = -1, w = 0, q = ' ';
    for (let i = 0, l = p.length; i < l; i++) {
      const t = p[i];
      if (((t >= 'a' && t <= 'z') || (t >= 'A' && t <= 'Z'))) {
        if (j < i - 1) {
          w++;
          if (q === '$') s--;
        }
        j = i;
      } else {
        s++;
      }
      q = t;
    }
    let itz = `${f.length}.${s}.${w}`;
    if (!d) {
      return itz;
    } else {
      return itz === d;
    }
  };

  const getZqOu = (_yt_player) => {

    const w = 'ZqOu';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p
        && typeof p.start === 'function' && p.start.length === 0 // Ou
        && typeof p.isActive === 'function' && p.isActive.length === 0
        && typeof p.stop === 'function' && p.stop.length === 0
        && !p.isComplete && !p.getStatus && !p.getResponseHeader && !p.getLastError
        && !p.send && !p.abort
        && !p.sample && !p.initialize && !p.fail && !p.getName
        // && !p.dispose && !p.isDisposed

      ) {
        arr = addProtoToArr(_yt_player, k, arr) || arr;


      }

    }

    if (arr.length === 0) {

      console.warn(`[yt-js-engine-tamer] (key-extraction) Key does not exist. [${w}]`);
    } else {

      console.log(`[yt-js-engine-tamer] (key-extraction) [${w}]`, arr);
      return arr[0];
    }

  }

  const getZqQu = (_yt_player) => {

    const w = 'ZqQu';

    let arr = [];


    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p
        && typeof p.start === 'function' && p.start.length === 1 // Qu
        && typeof p.isActive === 'function' && p.isActive.length === 0
        && typeof p.stop === 'function' && p.stop.length === 0
        && !p.isComplete && !p.getStatus && !p.getResponseHeader && !p.getLastError
        && !p.send && !p.abort
        && !p.sample && !p.initialize && !p.fail && !p.getName
        // && !p.dispose && !p.isDisposed

      ) {
        arr = addProtoToArr(_yt_player, k, arr) || arr;


      }

    }

    if (arr.length === 0) {

      console.warn(`[yt-js-engine-tamer] (key-extraction) Key does not exist. [${w}]`);
    } else {

      console.log(`[yt-js-engine-tamer] (key-extraction) [${w}]`, arr);
      return arr[0];
    }

  }


  const getVG = (_yt_player) => {
    const w = 'VG';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p
        && typeof p.show === 'function' && p.show.length === 1
        && typeof p.hide === 'function' && p.hide.length === 0
        && typeof p.stop === 'function' && p.stop.length === 0) {

        arr = addProtoToArr(_yt_player, k, arr) || arr;

      }

    }


    if (arr.length === 0) {

      console.warn(`[yt-js-engine-tamer] (key-extraction) Key does not exist. [${w}]`);
    } else {

      console.log(`[yt-js-engine-tamer] (key-extraction) [${w}]`, arr);
      return arr[0];
    }



  }


  const getzo = (_yt_player) => {
    const w = 'zo';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      if (
        typeof v === 'function' && v.length === 3 && k.length < 3
      ) {
        const vt = `${v}`;
        if (vt.length >= 21 && vt.includes(".style[")) {
          if (/\((\w{1,3}),(\w{1,3}),(\w{1,3})\)\{[\s\S]*\1\.style\[\2\]=\3\W/.test(vt)) {
            arr.push(k);
          } else {
            console.warn('[yt-js-engine-tamer] unexpected zo::vt', vt);
          }
        }
      }

    }

    if (arr.length === 0) {

      console.warn(`[yt-js-engine-tamer] (key-extraction) Key does not exist. [${w}]`);
    } else {

      console.log(`[yt-js-engine-tamer] (key-extraction) [${w}]`, arr);
      return arr[0];
    }

  }

  const addProtoToArr = (parent, key, arr) => {


    let isChildProto = false;
    for (const sr of arr) {
      if (parent[key].prototype instanceof parent[sr]) {
        isChildProto = true;
        break;
      }
    }

    if (isChildProto) return;

    arr = arr.filter(sr => {
      if (parent[sr].prototype instanceof parent[key]) {
        return false;
      }
      return true;
    });

    arr.push(key);

    return arr;


  }

  const getuG = (_yt_player) => {

    const w = 'uG';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;

      if (p
        && typeof p.createElement === 'function' && p.createElement.length === 2
        && typeof p.detach === 'function' && p.detach.length === 0
        && typeof p.update === 'function' && p.update.length === 1
        && typeof p.updateValue === 'function' && p.updateValue.length === 2
      ) {

        arr = addProtoToArr(_yt_player, k, arr) || arr;

      }

    }

    if (arr.length === 0) {

      console.warn(`[yt-js-engine-tamer] (key-extraction) Key does not exist. [${w}]`);
    } else {

      console.log(`[yt-js-engine-tamer] (key-extraction) [${w}]`, arr);
      return arr[0];
    }

  }

  /*

  // QT might be used in future changes
  const getQT = (_yt_player) => {
    const w = 'QT';

    let arr = [];
    let brr = new Map();

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p) {
        let q = 0;
        if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 7) q += 400;
        else if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 8) q += 300;
        else if (typeof p.handleGlobalKeyUp === 'function') q += 200;

        if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 0) q -= 600; // avoid SV

        if (q < 200) continue; // p.handleGlobalKeyUp must be available

        if (typeof p.handleGlobalKeyDown === 'function' && p.handleGlobalKeyDown.length === 8) q += 80;
        if (typeof p.handleGlobalKeyDown === 'function' && p.handleGlobalKeyDown.length === 7) q += 30;
        if (typeof p.step === 'function' && p.step.length === 1) q += 10;
        if (typeof p.step === 'function' && p.step.length !== 1) q += 5;


        // differentiate QT and DX

        q += 280;
        if (typeof p.cueVideoByPlayerVars === 'function') q += 4;
        if (typeof p.loadVideoByPlayerVars === 'function') q += 4;
        if (typeof p.preloadVideoByPlayerVars === 'function') q += 4;
        if (typeof p.seekBy === 'function') q += 4;
        if (typeof p.seekTo === 'function') q += 4;
        if (typeof p.getStoryboardFormat === 'function') q += 4;
        if (typeof p.getDuration === 'function') q += 4;
        if (typeof p.loadModule === 'function') q += 4;
        if (typeof p.unloadModule === 'function') q += 4;
        if (typeof p.getOption === 'function') q += 4;
        if (typeof p.getOptions === 'function') q += 4;
        if (typeof p.setOption === 'function') q += 4;
        if (typeof p.addCueRange === 'function') q += 4;
        if (typeof p.getDebugText === 'function') q += 4;
        if (typeof p.getCurrentBroadcastId === 'function') q += 4;
        if (typeof p.setSizeStyle === 'function') q += 4;
        if (typeof p.showControls === 'function') q += 4;
        if (typeof p.hideControls === 'function') q += 4;
        if (typeof p.getVideoContentRect === 'function') q += 4;
        if (typeof p.toggleFullscreen === 'function') q += 4;
        if (typeof p.isFullscreen === 'function') q += 4;
        if (typeof p.cancelPlayback === 'function') q += 4;
        if (typeof p.getProgressState === 'function') q += 4;
        if (typeof p.isInline === 'function') q += 4;
        if (typeof p.setInline === 'function') q += 4;
        if (typeof p.toggleSubtitles === 'function') q += 4;
        if (typeof p.getPlayerSize === 'function') q += 4;
        if (typeof p.wakeUpControls === 'function') q += 4;
        if (typeof p.setCenterCrop === 'function') q += 4;
        if (typeof p.getLoopVideo === 'function') q += 4;
        if (typeof p.setLoopVideo === 'function') q += 4;


        if (q > 0) arr = addProtoToArr(_yt_player, k, arr) || arr;

        if (q > 0) brr.set(k, q);

      }

    }

    if (arr.length === 0) {

      console.warn(`[yt-js-engine-tamer] (key-extraction) Key does not exist. [${w}]`);
    } else {

      arr = arr.map(key => [key, (brr.get(key) || 0)]);

      if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);

      if (arr.length > 2) console.log(`[yt-js-engine-tamer] (key-extraction) [${w}]`, arr);
      return arr[0][0];
    }

  }

  // SV might be used in future changes
  const getSV = (_yt_player) => {
    const w = 'SV';

    let arr = [];
    let brr = new Map();

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p) {
        let q = 0;
        if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 7) q += 400;
        else if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 8) q += 300;
        else if (typeof p.handleGlobalKeyUp === 'function') q += 200;

        if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 0) q += 600; // SV

        if (q < 200) continue; // p.handleGlobalKeyUp must be available

        if (typeof p.handleGlobalKeyDown === 'function' && p.handleGlobalKeyDown.length === 8) q += 80;
        if (typeof p.handleGlobalKeyDown === 'function' && p.handleGlobalKeyDown.length === 7) q += 30;
        if (typeof p.step === 'function' && p.step.length === 1) q += 10;
        if (typeof p.step === 'function' && p.step.length !== 1) q += 5;


        // differentiate QT and DX


        q += 280;

        if (typeof p.cueVideoByPlayerVars === 'function') q -= 4;
        if (typeof p.loadVideoByPlayerVars === 'function') q -= 4;
        if (typeof p.preloadVideoByPlayerVars === 'function') q -= 4;
        if (typeof p.seekBy === 'function') q -= 4;
        if (typeof p.seekTo === 'function') q -= 4;
        if (typeof p.getStoryboardFormat === 'function') q -= 4;
        if (typeof p.getDuration === 'function') q -= 4;
        if (typeof p.loadModule === 'function') q -= 4;
        if (typeof p.unloadModule === 'function') q -= 4;
        if (typeof p.getOption === 'function') q -= 4;
        if (typeof p.getOptions === 'function') q -= 4;
        if (typeof p.setOption === 'function') q -= 4;
        if (typeof p.addCueRange === 'function') q -= 4;
        if (typeof p.getDebugText === 'function') q -= 4;
        if (typeof p.getCurrentBroadcastId === 'function') q -= 4;
        if (typeof p.setSizeStyle === 'function') q -= 4;
        if (typeof p.showControls === 'function') q -= 4;
        if (typeof p.hideControls === 'function') q -= 4;
        if (typeof p.getVideoContentRect === 'function') q -= 4;
        if (typeof p.toggleFullscreen === 'function') q -= 4;
        if (typeof p.isFullscreen === 'function') q -= 4;
        if (typeof p.cancelPlayback === 'function') q -= 4;
        if (typeof p.getProgressState === 'function') q -= 4;
        if (typeof p.isInline === 'function') q -= 4;
        if (typeof p.setInline === 'function') q -= 4;
        if (typeof p.toggleSubtitles === 'function') q -= 4;
        if (typeof p.getPlayerSize === 'function') q -= 4;
        if (typeof p.wakeUpControls === 'function') q -= 4;
        if (typeof p.setCenterCrop === 'function') q -= 4;
        if (typeof p.getLoopVideo === 'function') q -= 4;
        if (typeof p.setLoopVideo === 'function') q -= 4;


        if (q > 0) arr = addProtoToArr(_yt_player, k, arr) || arr;

        if (q > 0) brr.set(k, q);

      }

    }

    if (arr.length === 0) {

      console.warn(`[yt-js-engine-tamer] (key-extraction) Key does not exist. [${w}]`);
    } else {

      arr = arr.map(key => [key, (brr.get(key) || 0)]);

      if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);

      if (arr.length > 2) console.log(`[yt-js-engine-tamer] (key-extraction) [${w}]`, arr);
      return arr[0][0];
    }

  }

  // no DX key
  const getDX = (_yt_player) => {
    const w = 'DX';

    let arr = [];
    let brr = new Map();

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p) {
        let q = 0;
        if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 7) q += 400;
        else if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 8) q += 300;
        else if (typeof p.handleGlobalKeyUp === 'function') q += 200;

        if (typeof p.handleGlobalKeyUp === 'function' && p.handleGlobalKeyUp.length === 0) q -= 600; // avoid SV


        if (!(typeof p.init === 'function' && p.init.length === 0)) q -= 300; // init is required

        if (q < 200) continue; // p.handleGlobalKeyUp must be available

        if (typeof p.handleGlobalKeyDown === 'function' && p.handleGlobalKeyDown.length === 8) q += 80;
        if (typeof p.handleGlobalKeyDown === 'function' && p.handleGlobalKeyDown.length === 7) q += 30;
        if (typeof p.step === 'function' && p.step.length === 1) q += 10;
        if (typeof p.step === 'function' && p.step.length !== 1) q += 5;


        // differentiate QT and DX


        q += 280;

        if (typeof p.cueVideoByPlayerVars === 'function') q -= 4;
        if (typeof p.loadVideoByPlayerVars === 'function') q -= 4;
        if (typeof p.preloadVideoByPlayerVars === 'function') q -= 4;
        if (typeof p.seekBy === 'function') q -= 4;
        if (typeof p.seekTo === 'function') q -= 4;
        if (typeof p.getStoryboardFormat === 'function') q -= 4;
        if (typeof p.getDuration === 'function') q -= 4;
        if (typeof p.loadModule === 'function') q -= 4;
        if (typeof p.unloadModule === 'function') q -= 4;
        if (typeof p.getOption === 'function') q -= 4;
        if (typeof p.getOptions === 'function') q -= 4;
        if (typeof p.setOption === 'function') q -= 4;
        if (typeof p.addCueRange === 'function') q -= 4;
        if (typeof p.getDebugText === 'function') q -= 4;
        if (typeof p.getCurrentBroadcastId === 'function') q -= 4;
        if (typeof p.setSizeStyle === 'function') q -= 4;
        if (typeof p.showControls === 'function') q -= 4;
        if (typeof p.hideControls === 'function') q -= 4;
        if (typeof p.getVideoContentRect === 'function') q -= 4;
        if (typeof p.toggleFullscreen === 'function') q -= 4;
        if (typeof p.isFullscreen === 'function') q -= 4;
        if (typeof p.cancelPlayback === 'function') q -= 4;
        if (typeof p.getProgressState === 'function') q -= 4;
        if (typeof p.isInline === 'function') q -= 4;
        if (typeof p.setInline === 'function') q -= 4;
        if (typeof p.toggleSubtitles === 'function') q -= 4;
        if (typeof p.getPlayerSize === 'function') q -= 4;
        if (typeof p.wakeUpControls === 'function') q -= 4;
        if (typeof p.setCenterCrop === 'function') q -= 4;
        if (typeof p.getLoopVideo === 'function') q -= 4;
        if (typeof p.setLoopVideo === 'function') q -= 4;


        if (q > 0) arr = addProtoToArr(_yt_player, k, arr) || arr;

        if (q > 0) brr.set(k, q);

      }

    }

    if (arr.length === 0) {

      console.warn(`[yt-js-engine-tamer] (key-extraction) Key does not exist. [${w}]`);
    } else {

      arr = arr.map(key => [key, (brr.get(key) || 0)]);

      if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);

      if (arr.length > 2) console.log(`[yt-js-engine-tamer] (key-extraction) [${w}]`, arr);
      return arr[0][0];
    }



  }

  */


  const isPrepareCachedV = (FIX_avoid_incorrect_video_meta ? true : false) && (window === top);

  let pageSetupVideoId = null; // set at finish; '' for indeterminate state
  let pageSetupState = 0;

  isPrepareCachedV && (() => {

    pageSetupVideoId = '';
    const clearCachedV = () => {
      pageSetupVideoId = '';
      pageSetupState = 0;
    }
    document.addEventListener('yt-navigate-start', clearCachedV, false); // user action
    document.addEventListener('yt-navigate-cache', clearCachedV, false); // pop state
    document.addEventListener('yt-page-data-fetched', clearCachedV, false); // still consider invalid until url is ready in yt-navigate-finish
    document.addEventListener('yt-navigate-finish', () => {
      pageSetupState = 1;
      try {
        const url = new URL(location.href);
        if (!url || !isWatchPageURL(url)) {
          pageSetupVideoId = '';
        } else {
          pageSetupVideoId = url.searchParams.get('v') || '';
        }
      } catch (e) {
        pageSetupVideoId = '';
      }
    }, false);

  })();

  let videoPlayingY = null;

  isPrepareCachedV && (() => {

    let getNext = true;
    let videoPlayingX = {
      get videoId() {
        if (getNext) {
          getNext = false;

          let elements = document.querySelectorAll('ytd-watch-flexy[video-id]');
          const arr = [];
          for (const element of elements) {
            if (!element.closest('[hidden]')) arr.push(element);
          }
          if (arr.length !== 1) this.__videoId__ = '';
          else {
            this.__videoId__ = arr[0].getAttribute('video-id');
          }

        }
        return this.__videoId__ || '';
      }
    }

    videoPlayingY = videoPlayingX;
    const handler = (evt) => {
      const target = (evt || 0).target;
      if (target instanceof HTMLVideoElement) {
        getNext = true;
      }
    }
    document.addEventListener('loadedmetadata', handler, true);
    document.addEventListener('durationchange', handler, true);

  })();



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
        frame.id = frameId;
        const blobURL = typeof webkitCancelAnimationFrame === 'function' && typeof kagi === 'undefined' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null; // avoid Brave Crash
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
        const { requestAnimationFrame, setTimeout, clearTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback, getComputedStyle } = fc;
        const res = { requestAnimationFrame, setTimeout, clearTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback, getComputedStyle };
        for (let k in res) res[k] = res[k].bind(win); // necessary
        if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
        res.animate = fc.HTMLElement.prototype.animate;
        res.perfNow = fc.performance.now;
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

  const promiseForYtActionCalled = new Promise(resolve => {

    const appTag = isChatRoomURL ? 'yt-live-chat-app' : 'ytd-app';
    if (typeof AbortSignal !== 'undefined') {
      let hn = () => {
        if (!hn) return;
        hn = null;
        resolve(document.querySelector(appTag));
      };
      document.addEventListener('yt-action', hn, { capture: true, passive: true, once: true });
    } else {
      let hn = () => {
        if (!hn) return;
        document.removeEventListener('yt-action', hn, true);
        hn = null;
        resolve(document.querySelector(appTag));
      };
      document.addEventListener('yt-action', hn, true);
    }
  });

  cleanContext(window).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, clearTimeout, cancelAnimationFrame, setInterval, clearInterval, animate, requestIdleCallback, getComputedStyle, perfNow } = __CONTEXT__;


    performance.now17 = perfNow.bind(performance);



    __requestAnimationFrame__ = requestAnimationFrame;


    const isGPUAccelerationAvailable = (() => {
      // https://gist.github.com/cvan/042b2448fcecefafbb6a91469484cdf8
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })();

    const foregroundPromiseFn_noGPU = (() => {

      if (isGPUAccelerationAvailable) return null;

      const pd = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
      if (!pd || typeof pd.get !== 'function') return null;
      const pdGet = pd.get;

      let pr = null;

      let hState = pdGet.call(document) === 'hidden';
      // let cid = 0;
      pureAddEventListener.call(document, 'visibilitychange', (evt) => {
        const newHState = pdGet.call(document) === 'hidden';
        if (hState !== newHState) {
          // if (cid > 0) cid = clearInterval(cid);
          hState = newHState;
          if (!hState && pr) pr = pr.resolve();
        }
      });

      // cid = setInterval(() => {
      //   const newHState = document.visibilityState === 'hidden';
      //   if (hState !== newHState) {
      //     hState = newHState;
      //     if (!hState && pr) pr = pr.resolve();
      //   }
      // }, 100);


      return (() => {
        if (pr) return pr;
        const w = ((!hState && setTimeout(() => {
          if (!hState && pr === w) pr = pr.resolve();
        })), (pr = new PromiseExternal()));
        return w;
      });

    })();


    let rafPromise = null;
    const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
      requestAnimationFrame(hRes => {
        rafPromise = null;
        resolve(hRes);
      });
    }));

    const foregroundPromiseFn = foregroundPromiseFn_noGPU || getRafPromise;


    const wmComputedStyle = new WeakMap();

    if (!window.__native__getComputedStyle__ && !window.__jst__getComputedStyle__ && typeof window.getComputedStyle === 'function' && window.getComputedStyle.length === 1) {
      window.__native__getComputedStyle__ = getComputedStyle;
      if (ENABLE_COMPUTEDSTYLE_CACHE) {
        window.__original__getComputedStyle__ = window.getComputedStyle;
        window.getComputedStyle = function (elem) {
          if (!(elem instanceof Element) || (arguments.length === 2 && arguments[1]) || (arguments.length > 2)) {
            return window.__original__getComputedStyle__(...arguments);
          }
          let cs = wmComputedStyle.get(elem);
          if (!cs) {
            cs = window.__native__getComputedStyle__(elem);
            wmComputedStyle.set(elem, cs);
          }
          return cs;
        };
      } else {
        window.__original__getComputedStyle__ = null;
      }
      window.__jst__getComputedStyle__ = window.getComputedStyle;
    }

    NO_SCHEDULING_DUE_TO_COMPUTEDSTYLE && promiseForYtActionCalled.then(() => {
      if (typeof window.__jst__getComputedStyle__ === 'function' && window.__jst__getComputedStyle__.length === 1 && window.__jst__getComputedStyle__ !== window.getComputedStyle) {
        window.getComputedStyle = window.__jst__getComputedStyle__;
      }
    });

    const isUrlInEmbed = location.href.includes('.youtube.com/embed/');
    const isAbortSignalSupported = typeof AbortSignal !== "undefined";

    const promiseForTamerTimeout = new Promise(resolve => {
      !isUrlInEmbed && isAbortSignalSupported && document.addEventListener('yt-action', function () {
        setTimeout(resolve, 480);
      }, { capture: true, passive: true, once: true });
      !isUrlInEmbed && isAbortSignalSupported && typeof customElements === "object" && whenCEDefined('ytd-app').then(() => {
        setTimeout(resolve, 1200);
      });
      setTimeout(resolve, 3000);
    });

    const promiseForPageInitied = new Promise(resolve => {
      !isUrlInEmbed && isAbortSignalSupported && document.addEventListener('yt-action', function () {
        setTimeout(resolve, 450);
      }, { capture: true, passive: true, once: true });
      !isUrlInEmbed && isAbortSignalSupported && typeof customElements === "object" && whenCEDefined('ytd-app').then(() => {
        setTimeout(resolve, 900);
      });
      setTimeout(resolve, 1800);
    });

    NO_PRELOAD_GENERATE_204_BYPASS || promiseForPageInitied.then(() => {
      NO_PRELOAD_GENERATE_204_BYPASS = true;
      headLinkCollection = null;
    });


    NATIVE_CANVAS_ANIMATION && (() => {

      observablePromise(() => {
        HTMLCanvasElement.prototype.animate = animate;
      }, promiseForTamerTimeout).obtain();

    })();




    FIX_ytAction_ && (async () => {

      const appTag = isChatRoomURL ? 'yt-live-chat-app' : 'ytd-app';

      const ytdApp = await new Promise(resolve => {

        whenCEDefined(appTag).then(() => {
          const ytdApp = document.querySelector(appTag);
          if (ytdApp) {
            resolve(ytdApp);
            return;
          }
          let mo = new MutationObserver(() => {
            const ytdApp = document.querySelector(appTag);
            if (!ytdApp) return;
            if (mo) {
              mo.disconnect();
              mo.takeRecords();
              mo = null;
            }
            resolve(ytdApp);
          });
          mo.observe(document, { subtree: true, childList: true });
        });

      });

      if (!ytdApp) return;
      const cProto = insp(ytdApp).constructor.prototype;

      if (!cProto) return;
      let mbd = 0;

      const fixer = (_ytdApp) => {
        const ytdApp = insp(_ytdApp);
        if (ytdApp && typeof ytdApp.onYtActionBoundListener_ === 'function' && !ytdApp.onYtActionBoundListener57_) {
          ytdApp.onYtActionBoundListener57_ = ytdApp.onYtActionBoundListener_;
          ytdApp.onYtActionBoundListener_ = ytdApp.onYtAction_.bind(ytdApp);
          mbd++;
        }
      }

      observablePromise(() => {

        if (typeof cProto.created === 'function' && !cProto.created56) {
          cProto.created56 = cProto.created;
          cProto.created = function (...args) {
            const r = this.created56(...args);
            fixer(this);
            return r;
          };
          mbd++;
        }

        if (typeof cProto.onYtAction_ === 'function' && !cProto.onYtAction57_) {
          cProto.onYtAction57_ = cProto.onYtAction_;
          cProto.onYtAction_ = function (...args) {
            Promise.resolve().then(() => this.onYtAction57_(...args));
          };
          mbd++;
        }

        if (ytdApp) fixer(ytdApp);

        /*
        const actionRouter_ = ytdApp ? ytdApp.actionRouter_ : null;
        if (actionRouter_ && typeof actionRouter_.handleAction === 'function' && !actionRouter_.handleAction57) {
          actionRouter_.handleAction57 = actionRouter_.handleAction;
          actionRouter_.handleAction = function (...args) {
            Promise.resolve().then(() => this.handleAction57(...args));
          }
          mbd++;
        }
        */

        // if(mbd === 3) return 1;
        if (mbd >= 3) return 1;

      }, new Promise(r => setTimeout(r, 1000))).obtain();

    })();


    FORCE_NO_REUSEABLE_ELEMENT_POOL && promiseForYtActionCalled.then(async () => {

      const appTag = isChatRoomURL ? 'yt-live-chat-app' : 'ytd-watch-flexy';

      const app = await observablePromise(() => {

        return document.querySelector(appTag);

      }).obtain();

      if (!app) return;

      const appCnt = insp(app);
      FORCE_NO_REUSEABLE_ELEMENT_POOL_fn(appCnt);




    });


    // let _yt_player_promise = null;
    /*
    const getYtPlayerPromise = () => {
      if (!_yt_player_promise) {
        _yt_player_promise = new Promise(resolve => {
          let cid = setInterval(() => {
            let t = (((window || 0)._yt_player || 0) || 0);
            if (t) {
              clearInterval(cid);
              resolve(t);
            }
          }, 1);
          promiseForTamerTimeout.then(() => {
            resolve(null)
          });
        });
      }
      return _yt_player_promise;
    }
    */
    const _yt_player_observable = observablePromise(() => {
      const _yt_player = (((window || 0)._yt_player || 0) || 0);
      if (_yt_player) {
        _yt_player[`__is_yt_player__${Date.now()}`] = 1;
        return _yt_player;
      }
    }, promiseForTamerTimeout);

    const polymerObservable = observablePromise(() => {
      const Polymer = window.Polymer;
      if (typeof Polymer !== 'function') return;
      if (!(Polymer.Base || 0).connectedCallback || !(Polymer.Base || 0).disconnectedCallback) return;
      return Polymer;
    }, promiseForTamerTimeout);

    const schedulerInstanceObservable = observablePromise(() => {
      return (((window || 0).ytglobal || 0).schedulerInstanceInstance_ || 0);
    }, promiseForTamerTimeout);

    const timelineObservable = observablePromise(() => {
      let t = (((document || 0).timeline || 0) || 0);
      if (t && typeof t._play === 'function') {
        return t;
      }
    }, promiseForTamerTimeout);
    const animationObservable = observablePromise(() => {
      let t = (((window || 0).Animation || 0) || 0);
      if (t && typeof t === 'function' && t.length === 2 && typeof t.prototype._updatePromises === 'function') {
        return t;
      }
    }, promiseForTamerTimeout);


    const getScreenInfo = {
      screenWidth: 0,
      screenHeight: 0,
      valueReady: false,
      onResize: () => {
        getScreenInfo.valueReady = false;
      },
      sizeProvided: () => {
        if (getScreenInfo.valueReady) return true;
        getScreenInfo.screenWidth = screen.width;
        getScreenInfo.screenHeight = screen.height;
        if (getScreenInfo.screenWidth * getScreenInfo.screenHeight > 1) {
          getScreenInfo.valueReady = true;
          return true;
        }
        return false;
      }
    };

    window.addEventListener('resize', getScreenInfo.onResize, true);


    // const hookLeftPending = new WeakMap();

    const isNaNx = Number.isNaN;

    const hookLeftPD = {
      get() {
        const p = 'left';
        // const o = hookLeftPending.get(this);
        // if (o && o.key) {
        //   this.setProperty(p, o.value);
        //   o.key = null
        // }
        return this.getPropertyValue(p);
      },
      set(v) {

        const p = 'left';
        const cv = this.getPropertyValue(p);
        const sv = v;

        // const did = Math.floor(Math.random() * 314159265359 + 314159265359).toString(36);

        // console.log(8380,did, cv, sv)
        if (!cv && !sv) return true;
        if (cv === sv) return true;

        // skip 0~9px => L>=4

        const qsv = `${sv}`.length >= 4 && `${sv}`.endsWith('px') ? +sv.slice(0, -2) : NaN;

        if (!isNaNx(qsv)) {
          const qcv = `${cv}`.length >= 4 && `${cv}`.endsWith('px') ? +cv.slice(0, -2) : NaN;

          if (!isNaNx(qcv) && getScreenInfo.sizeProvided()) {
            const { screenWidth, screenHeight } = getScreenInfo;
            let pWidth = screenWidth + 1024;
            let pHeight = screenHeight + 768;
            const minRatio = 0.003;
            const dw = pWidth * 0.0003; // min dw = 0.3072
            const dh = pHeight * 0.0003; // min dh = 0.2304
            // console.log(8381,did, Math.abs(qcv - qsv) < dw)
            if (Math.abs(qcv - qsv) < dw) return true;
          }

          v = `${qsv > -1e-5 && qsv < 1e-5 ? 0 : qsv.toFixed(4)}px`;
          if (`${v}`.length > `${sv}`.length) v = sv;
          // console.log(8382, did, sv, nv, cv, this)
        }

        // Promise.resolve().then(() => {
        //   const o = hookLeftPending.get(this);
        //   if (o && o.key === did) {
        //     this.setProperty(p, o.value);
        //     o.key = null;
        //   }
        // });
        // hookLeftPending.set(this, {
        //   key: did,
        //   value: nv
        // });

        // if (nv != v) {
        //   console.log(8387, v, nv);
        // }

        this.setProperty(p, v);
        // console.log(8383, did, this.getPropertyValue(p))
        return true;
      },
      enumerable: true,
      configurable: true
    };


    if (HOOK_CSSPD_LEFT) {


      Object.defineProperty(CSSStyleDeclaration.prototype, 'left', hookLeftPD);

    }





    const generalEvtHandler = async (_evKey, _fvKey, _debug) => {

      const evKey = `${_evKey}`;
      const fvKey = `${_fvKey}`;
      const debug = !!_debug;

      const _yt_player = await _yt_player_observable.obtain();


      if (!_yt_player || typeof _yt_player !== 'object') return;


      const getArr = (_yt_player) => {

        let arr = [];

        for (const [k, v] of Object.entries(_yt_player)) {

          const p = typeof v === 'function' ? v.prototype : 0;
          if (p
            && typeof p[evKey] === 'function' && p[evKey].length >= 0 && !p[fvKey]

          ) {
            arr = addProtoToArr(_yt_player, k, arr) || arr;

          }

        }

        if (arr.length === 0) {

          console.warn(`Key prop [${evKey}] does not exist.`);
        } else {

          return arr;
        }

      };

      const arr = getArr(_yt_player);


      if (!arr) return;

      debug && console.log(`FIX_${evKey}`, arr);

      const f = function (...args) {
        Promise.resolve().then(() => this[fvKey](...args));
      };


      for (const k of arr) {

        const g = _yt_player;
        const gk = g[k];
        const gkp = gk.prototype;

        debug && console.log(237, k, gkp)

        if (typeof gkp[evKey] == 'function' && !gkp[fvKey]) {
          gkp[fvKey] = gkp[evKey];
          gkp[evKey] = f;
        }
      }




    }

    if (!isChatRoomURL) {

      FIX_onVideoDataChange && generalEvtHandler('onVideoDataChange', 'onVideoDataChange57');
      // FIX_onClick && generalEvtHandler('onClick', 'onClick57');
      FIX_onStateChange && generalEvtHandler('onStateChange', 'onStateChange57');
      FIX_onLoopRangeChange && generalEvtHandler('onLoopRangeChange', 'onLoopRangeChange57');
      if (FIX_VideoEVENTS_v2) {
        const FIX_VideoEVENTS_DEBUG = 0;
        // generalEvtHandler('onVideoProgress', 'onVideoProgress57', FIX_VideoEVENTS_DEBUG); // -- // no onVideoProgress in latest YouTube Coding (2025.06.12)
        // generalEvtHandler('onAutoplayBlocked', 'onAutoplayBlocked57', FIX_VideoEVENTS_DEBUG);
        // generalEvtHandler('onLoadProgress', 'onLoadProgress57', FIX_VideoEVENTS_DEBUG); // << CAUSE ISSUE >>
        generalEvtHandler('onFullscreenChange', 'onFullscreenChange57', FIX_VideoEVENTS_DEBUG); // --
        // generalEvtHandler('onLoadedMetadata', 'onLoadedMetadata57', FIX_VideoEVENTS_DEBUG);
        // generalEvtHandler('onDrmOutputRestricted', 'onDrmOutputRestricted57', FIX_VideoEVENTS_DEBUG);
        // generalEvtHandler('onAirPlayActiveChange', 'onAirPlayActiveChange57', FIX_VideoEVENTS_DEBUG);
        // generalEvtHandler('onAirPlayAvailabilityChange', 'onAirPlayAvailabilityChange57', FIX_VideoEVENTS_DEBUG);
        // generalEvtHandler('onApiChange', 'onApiChange57', FIX_VideoEVENTS_DEBUG);

      }
      // onMutedAutoplayChange
      // onVolumeChange
      // onPlaybackRateChange

      // onAirPlayActiveChange
      // onAirPlayAvailabilityChange
      // onApiChange
      // onAutoplayBlocked
      // onDrmOutputRestricted
      // onFullscreenChange
      // onLoadProgress
      // onLoadedMetadata
      // onVideoDataChange
      // onVideoProgress

    }


    let isAmended_Polymer_RenderStatus = false;

    (FIX_Polymer_dom || FIX_Polymer_AF || FIX_stampDomArray) && (async () => {

      const Polymer = await polymerObservable.obtain();
      if (!Polymer) return;

      if (FIX_Polymer_AF && Polymer && Polymer.RenderStatus && !isAmended_Polymer_RenderStatus) {
        isAmended_Polymer_RenderStatus = true;

        if (typeof Polymer.RenderStatus.beforeNextRender === 'function' && typeof Polymer.RenderStatus.afterNextRender === 'function' && Polymer.RenderStatus.beforeNextRender.length === 3 && Polymer.RenderStatus.afterNextRender.length === 3) {
          let arrBefore = null, arrAfter = null;
          const push = Array.prototype.push;
          let arr = null;
          Array.prototype.push = function () {
            arr = this;
          }
          Polymer.RenderStatus.beforeNextRender({}, {}, {});
          if (arr) arrBefore = arr;
          arr = null;
          Polymer.RenderStatus.afterNextRender({}, {}, {});
          if (arr) arrAfter = arr;
          arr = null;
          Array.prototype.push = push;
          Polymer.RenderStatus.arrBefore = arrBefore;
          Polymer.RenderStatus.arrAfter = arrAfter;

          if (arrBefore && arrAfter) {

            Function.prototype.call7900 = Function.prototype.call;
            Function.prototype.apply7900 = Function.prototype.apply;
            Function.prototype.apply7948 = function (obj, args) {
              const f = this;
              let m = kRef(obj);
              if (!m) return;
              if (m.is && !m.nodeName) {
                if (!m.isAttached || !m.hostElement) {
                  return;
                }
              }
              try {
                return !args ? f.call7900(m) : f.apply7900(m, args);
              } catch (e) {
                console.warn(e);
              }
              return null;
            }

            arrBefore.push = arrAfter.push = function (a) {
              if (arguments.length !== 1 || !a || a.length === 0 || !a[0]) return push.apply(this, arguments);
              if (a[0].deref) a[0] = kRef(a[0]);
              const f = a[1]
              const obj = a[0]
              const args = a[2];
              f.apply = f.apply7948;
              if (!obj[wk]) obj[wk] = mWeakRef(obj);
              a[0] = obj[wk]
              // console.log(4992, a)
              return push.call(this, a);
            }

          }


        }
        // Polymer.RenderStatus.beforeNextRender
      }

      if (FIX_Polymer_dom) {

        const checkPDFuncValue = (pd) => {
          return pd && pd.writable && pd.enumerable && pd.configurable && typeof pd.value == 'function'
        }
        const checkPDFuncValue2 = (pd) => {
          return pd && typeof pd.value == 'function'
        }

        const checkPDFuncGet = (pd) => {
          return pd && typeof pd.get == 'function'
        }

        const domX = Polymer.dom(document.createElement('null'));
        const domXP = (((domX || 0).constructor || 0).prototype || 0);
        const pd1 = Object.getOwnPropertyDescriptor(domXP, 'getOwnerRoot');
        const pd2 = Object.getOwnPropertyDescriptor(Node.prototype, 'parentElement');
        const pd3 = Object.getOwnPropertyDescriptor(domXP, 'querySelector'); // undefined
        const pd4 = Object.getOwnPropertyDescriptor(Element.prototype, 'querySelector');
        const pd4b = Object.getOwnPropertyDescriptor(Document.prototype, 'querySelector');
        const pd5 = Object.getOwnPropertyDescriptor(domXP, 'querySelectorAll'); // undefined
        const pd6 = Object.getOwnPropertyDescriptor(Element.prototype, 'querySelectorAll');
        const pd6b = Object.getOwnPropertyDescriptor(Document.prototype, 'querySelectorAll');


        if ((!pd3 || checkPDFuncValue(pd3)) && checkPDFuncValue2(pd4) && checkPDFuncValue2(pd4b) && !('querySelector15' in domXP)) {

          domXP.querySelector15 = domXP.querySelector;

          const querySelectorFn = function (query) {
            try {
              const p = this.node;

              if (p instanceof Document && p.isConnected === true) {
                return pd4b.value.call(p, query);
              }

            } catch (e) { }
            return this.querySelector15(query);
          }

          Object.defineProperty(domXP, 'querySelector', {
            get() {
              return querySelectorFn;
            },
            set(nv) {
              if (nv === querySelectorFn) return true;
              this.querySelector15 = nv;
              return true;
            },

            enumerable: false,
            configurable: true
          });

          Polymer.__fixedQuerySelector__ = 1;
        }

        if ((!pd5 || checkPDFuncValue(pd5)) && checkPDFuncValue2(pd6) && checkPDFuncValue2(pd6b) && !('querySelectorAll15' in domXP)) {

          domXP.querySelectorAll15 = domXP.querySelectorAll;

          const querySelectorAllFn = function (query) {

            try {

              const p = this.node;

              if (p instanceof Document && p.isConnected === true) {
                return pd6b.value.call(p, query);
              }

            } catch (e) {

            }
            return this.querySelectorAll15(query);
          }

          Object.defineProperty(domXP, 'querySelectorAll', {
            get() {
              return querySelectorAllFn;
            },
            set(nv) {
              if (nv === querySelectorAllFn) return true;
              this.querySelectorAll15 = nv;
              return true;
            },

            enumerable: false,
            configurable: true
          });

          Polymer.__fixedQuerySelectorAll__ = 1;
        }
      }


      if (FIX_stampDomArray) {

        Polymer.Base.__connInit__ = function () {
          setupYtComponent(this);
        }


        /** @type {Function} */
        const connectedCallbackK = function (...args) {
          !this.mh35 && typeof this.__connInit__ === 'function' && this.__connInit__();
          const r = this[qm53](...args);
          !this.mh35 && typeof this.__connInit__ === 'function' && this.__connInit__();
          this.mh35 = 1;
          return r;
        };

        connectedCallbackK.m353 = 1;


        const qt53 = Polymer.Base.connectedCallback;
        Polymer.Base[qm53] = dmf.get(qt53) || qt53;

        Polymer.Base.connectedCallback = connectedCallbackK;


        /** @type {Function} */
        const createdK = function (...args) {
          !this.mh36 && typeof this.__connInit__ === 'function' && this.__connInit__();
          const r = this[qn53](...args);
          !this.mh36 && typeof this.__connInit__ === 'function' && this.__connInit__();
          this.mh36 = 1;
          return r;
        };


        createdK.m353 = 1;
        Polymer.Base[qn53] = Polymer.Base.created;
        Polymer.Base.created = createdK;











      }

    })();


    /*

      e.nativeAppendChild = d.prototype.appendChild,
      d.prototype.appendChild = function(h) {
          return function(l) {
              if (l instanceof DocumentFragment) {
                  var m = Array.from(l.children);
                  l = h.nativeAppendChild.call(this, l);
                  if (this.isConnected) {
                      m = g(m);
                      for (var p = m.next(); !p.done; p = m.next())
                          YD(p.value)
                  }
                  return l
              }
              m = l instanceof Element && l.isConnected;
              p = h.nativeAppendChild.call(this, l);
              m && ZD(l);
              this.isConnected && YD(l);
              return p
          }
      }(e),

    */

    CHANGE_appendChild && !Node.prototype.appendChild73 && Node.prototype.appendChild && (() => {

      const f = Node.prototype.appendChild73 = Node.prototype.appendChild;
      if (f) Node.prototype.appendChild = function (a) {
        if (this instanceof Element) { // exclude DocumentFragment
          try {
            let checkFragmentA = (a instanceof DocumentFragment);
            if (!NO_PRELOAD_GENERATE_204_BYPASS && document.head === this) {
              if (headLinkCollection === null) headLinkCollection = document.head.getElementsByTagName('LINK');
              for (const node of headLinkCollection) {
                if (node.rel === 'preload' && node.as === 'fetch') {
                  node.rel = 'prefetch'; // see https://github.com/GoogleChromeLabs/quicklink
                }
              }
            } else if (checkFragmentA && this.nodeName.startsWith('YT-')) { // yt-animated-rolling-number, yt-attributed-string
              checkFragmentA = false;
            }
            if (checkFragmentA && a.firstElementChild === null) {
              // no element in fragmentA
              let doNormal = false;
              for (let child = a.firstChild; child instanceof Node; child = child.nextSibling) {
                if (child.nodeType === 3) { doNormal = true; break; }
              }
              if (!doNormal) return a;
            }
          } catch (e) {
            console.log(e);
          }
        }
        return arguments.length === 1 ? f.call(this, a) : f.apply(this, arguments);
      }

    })();

    if (FIX_Shady) {

      observablePromise(() => {
        const { ShadyDOM, ShadyCSS } = window;
        if (ShadyDOM) {
          ShadyDOM.handlesDynamicScoping = false; // 9 of 10
          ShadyDOM.noPatch = true; // 1 of 10
          ShadyDOM.patchOnDemand = false; // 1 of 10
          ShadyDOM.preferPerformance = true; // 1 of 10
          ShadyDOM.querySelectorImplementation = undefined; // 1 of 10
        }
        if (ShadyCSS) {
          ShadyCSS.nativeCss = true; // 1 of 10
          ShadyCSS.nativeShadow = true; // 6 of 10
          ShadyCSS.cssBuild = undefined; // 1 of 10
          ShadyCSS.disableRuntime = true; // 1 of 10
        }
        if (ShadyDOM && ShadyCSS) return 1;
      }, promiseForTamerTimeout).obtain(); // clear until 1 is return

    }


    // let schedulerInstancePropOfTimerType = '';
    // let schedulerInstancePropOfTimerId = '';
    (FIX_schedulerInstanceInstance & 2) && (async () => {

      const schedulerInstanceInstance_ = await schedulerInstanceObservable.obtain();

      if (!schedulerInstanceInstance_) return;

      const checkOK = typeof schedulerInstanceInstance_.start === 'function' && !schedulerInstanceInstance_.start993 && !schedulerInstanceInstance_.stop && !schedulerInstanceInstance_.cancel && !schedulerInstanceInstance_.terminate && !schedulerInstanceInstance_.interupt;
      if (checkOK) {

        let resolveRendering = null;

        let cmPr = new PromiseExternal();
        const cm = document.createComment('0');
        const cmObs = new MutationObserver(() => {
          if (resolveRendering) {
            resolveRendering();
            resolveRendering = null;
          }
          cmPr.resolve();
          cmPr = new PromiseExternal();
        });
        cmObs.observe(cm, {characterData: true})

        let web_emulated_idle_callback_delay_val = null;

        const getRenderIdleCallbackMs = () => {
          if (typeof web_emulated_idle_callback_delay_val === 'number') return web_emulated_idle_callback_delay_val;
          const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;
          const delay = (config.EXPERIMENT_FLAGS || 0).web_emulated_idle_callback_delay || (config.EXPERIMENTS_FORCED_FLAGS || 0).web_emulated_idle_callback_delay;
          if (typeof delay === 'number') web_emulated_idle_callback_delay_val = delay;
          return web_emulated_idle_callback_delay_val;
        }
        let isDelayRenderFn_firstCheck = true;
        let isDelayRenderFn_key = null;
      
        const isDelayRenderFn = (f) => {
          if (!isDelayRenderFn_firstCheck) return (typeof ytglobal === 'undefined' ? false : ((ytglobal || 0).schedulerInstanceInstance_ || 0)[isDelayRenderFn_key] === f);
          isDelayRenderFn_firstCheck = false;
          if (typeof ytglobal === 'undefined') return false;
          const globalInstance = ((ytglobal || 0).schedulerInstanceInstance_ || 0);
          if (!globalInstance) return false;
          for (const entry of Object.entries(Object.getOwnPropertyDescriptors(globalInstance))) {
            if (entry[1].value === f && entry[1].enumerable && entry[1].writable && entry[1].configurable) {
              isDelayRenderFn_key = entry[0]
              console.log('[yt-js-engine-tamer] web_emulated_idle_callback fix applied');
              return true;
            }
          }
          return false;
        }

        schedulerInstanceInstance_.start993 = schedulerInstanceInstance_.start;

        let requestingFn = null;
        let requestingArgs = null;

        const f = function () {
          requestingFn = this.fn;
          requestingArgs = [...arguments];
          return 12373;
        };

        const fakeFns = [
          f.bind({ fn: requestAnimationFrame }),
          f.bind({ fn: setInterval }),
          f.bind({ fn: setTimeout }),
          f.bind({ fn: requestIdleCallback })
        ];

        let mzt = 0;

        let _fnSelectorProp = null;
        const mkFns = new Array(4);

        /*
          case 1:
              var a = this.K;
              this.g = this.I ? window.requestIdleCallback(a, {
                  timeout: 3E3
              }) : window.setTimeout(a, ma);
              break;
          case 2:
              this.g = window.setTimeout(this.M, this.N);
              break;
          case 3:
              this.g = window.requestAnimationFrame(this.L);
              break;
          case 4:
              this.g = window.setTimeout(this.J, 0)
          }

        */
        const startFnHandler = {
          get(target, prop, receiver) {
            if (prop === '$$12377$$') return true;
            if (prop === '$$12378$$') return target;

            // console.log('get',prop)
            return target[prop]
          },
          set(target, prop, value, receiver) {
            // console.log('set', prop, value)


            if (value >= 1 && value <= 4) _fnSelectorProp = prop;
            if (value === 12373 && _fnSelectorProp) {

              const schedulerTypeSelection = target[_fnSelectorProp];
              const timerIdProp = prop;

              //  console.log(3991, requestingFn, requestingArgs[0], requestingArgs[1])
              // if (schedulerTypeSelection && schedulerTypeSelection >= 1 && schedulerTypeSelection <= 4 && timerIdProp) {
              //   schedulerInstancePropOfTimerType = _fnSelectorProp || '';
              //   schedulerInstancePropOfTimerId = timerIdProp || '';
              // }

              if (schedulerTypeSelection === 3 && requestingFn === requestAnimationFrame) { // rAF(fn)
                target[timerIdProp] = baseRAF.apply(window, requestingArgs);
              } else if (schedulerTypeSelection === 2 && requestingFn === setTimeout) { // setTimeout(fn, delay)
                // rare
                target[timerIdProp] = mkFns[2].apply(window, requestingArgs);
              } else if (schedulerTypeSelection === 4 && requestingFn === setTimeout && !requestingArgs[1]) { // setTimeout(fn, 0)
                // often
                if ((FIX_schedulerInstanceInstance & 4)) {
                  const f = requestingArgs[0];
                  const tir = ++mzt;
                  nextBrowserTick_(() => {
                    if (target[timerIdProp] === -tir) f();
                  });
                  target[_fnSelectorProp] = 940;
                  target[timerIdProp] = -tir;
                } else {
                  const f = requestingArgs[0];
                  const tir = ++mzt;
                  Promise.resolve().then(() => {
                    if (target[timerIdProp] === -tir) f();
                  });
                  target[_fnSelectorProp] = 930;
                  target[timerIdProp] = -tir;
                }
              } else if (schedulerTypeSelection === 1 && (requestingFn === requestIdleCallback || requestingFn === setTimeout)) { // setTimeout(requestIdleCallback)
                // often
                if (requestingFn === requestIdleCallback && (requestingArgs[0] || 0).name === "bound " && (requestingArgs[1] || 0).timeout === 3000 && isDelayRenderFn(requestingArgs[0])) {
                  cm.data = (cm.data & 7) + 1;
                  let renderFn = requestingArgs[0];
                  const resolveRendering_ = () => {
                    const renderFn_ = renderFn;
                    if (renderFn_) {
                      renderFn = null;
                      renderFn_();
                    }
                  };
                  resolveRendering = resolveRendering_;
                  // console.log(299,requestingArgs[0], requestingArgs[0].name)
                  target[timerIdProp] = requestIdleCallback(resolveRendering_, { timeout: 300 });

                  // cm.data = (cm.data & 7) + 1;
                  // target[timerIdProp] = Math.random();

                } else if (requestingFn === setTimeout && (requestingArgs[0] || 0).name === "bound " && (requestingArgs[1] === getRenderIdleCallbackMs()) && isDelayRenderFn(requestingArgs[0])) {

                  cm.data = (cm.data & 7) + 1;

                  let renderFn = requestingArgs[0];
                  const resolveRendering_ = () => {
                    const renderFn_ = renderFn;
                    if (renderFn_) {
                      renderFn = null;
                      renderFn_();
                    }
                  };
                  resolveRendering = resolveRendering_;

                  target[timerIdProp] = mkFns[2].call(window, resolveRendering_, 300);


                } else {
                  if (requestingFn === requestIdleCallback) {
                    target[timerIdProp] = requestIdleCallback.apply(window, requestingArgs);
                  } else {
                    target[timerIdProp] = mkFns[2].apply(window, requestingArgs);
                  }
                }
              } else {
                target[_fnSelectorProp] = 0;
                target[timerIdProp] = 0;
              }
            } else {
              target[prop] = value;
            }
            return true;
          }
        };

        let startBusy = false;
        schedulerInstanceInstance_.start = function () {
          if (startBusy) return;
          startBusy = true;
          try {
            mkFns[0] = window.requestAnimationFrame;
            mkFns[1] = window.setInterval;
            mkFns[2] = window.setTimeout;
            mkFns[3] = window.requestIdleCallback;
            const tThis = this['$$12378$$'] || this;
            window.requestAnimationFrame = fakeFns[0]
            window.setInterval = fakeFns[1]
            window.setTimeout = fakeFns[2]
            window.requestIdleCallback = fakeFns[3]
            _fnSelectorProp = null;
            tThis.start993.call(new Proxy(tThis, startFnHandler));
            _fnSelectorProp = null;
            window.requestAnimationFrame = mkFns[0];
            window.setInterval = mkFns[1];
            window.setTimeout = mkFns[2];
            window.requestIdleCallback = mkFns[3];
          } catch (e) {
            console.warn(e);
          }
          startBusy = false;
        }

        schedulerInstanceInstance_.start.toString = schedulerInstanceInstance_.start993.toString.bind(schedulerInstanceInstance_.start993);

      }
    })();

    FIX_yt_player && !isChatRoomURL && (async () => {

      const fOption = 1 | 2 | 4;

      const _yt_player = await _yt_player_observable.obtain();

      if (!_yt_player || typeof _yt_player !== 'object') return;

      const g = _yt_player;
      let k;

      if (fOption & 1) {

        // rAf scheduling

        const keyZqOu = getZqOu(_yt_player);
        if (!keyZqOu) {
          console.warn('[yt-js-engine-tamer] FIX_yt_player::keyZqOu error');
          return;
        }
        k = keyZqOu

        const gk = g[k];
        if (typeof gk !== 'function') {
          console.warn('[yt-js-engine-tamer] FIX_yt_player::g[keyZqOu] error');
          return;
        }
        const gkp = gk.prototype;

        const dummyObject = new gk;
        const nilFunc = () => { };

        const nilObj = {};

        // console.log(1111111111)

        let keyBoolD = '';
        let keyWindow = '';
        let keyFuncC = '';
        let keyCidj = '';

        for (const [t, y] of Object.entries(dummyObject)) {
          if (y instanceof Window) keyWindow = t;
        }

        const dummyObjectProxyHandler = {
          get(target, prop) {
            let v = target[prop]
            if (v instanceof Window && !keyWindow) {
              keyWindow = t;
            }
            let y = typeof v === 'function' ? nilFunc : typeof v === 'object' ? nilObj : v;
            if (prop === keyWindow) y = {
              requestAnimationFrame(f) {
                return 3;
              },
              cancelAnimationFrame() {

              }
            }
            if (!keyFuncC && typeof v === 'function' && !(prop in target.constructor.prototype)) {
              keyFuncC = prop;
            }
            // console.log('[get]', prop, typeof target[prop])


            return y;
          },
          set(target, prop, value) {

            if (typeof value === 'boolean' && !keyBoolD) {
              keyBoolD = prop;
            }
            if (typeof value === 'number' && !keyCidj && value >= 2) {
              keyCidj = prop;
            }

            // console.log('[set]', prop, value)
            target[prop] = value;

            return true;
          }
        };

        dummyObject.start.call(new Proxy(dummyObject, dummyObjectProxyHandler));

        // console.log('gkp.start',gkp.start);
        // console.log('gkp.stop',gkp.stop);
        gkp._activation = false;

        gkp.start = function () {
          // p59 || console.log(12100)
          if (!this._activation) {
            this._activation = true;
            foregroundPromiseFn().then(() => {
              this._activation = false;
              if (this[keyCidj]) {
                Promise.resolve().then(this[keyFuncC]);
              }
            });
          }
          this[keyCidj] = 1;
          this[keyBoolD] = true;
        };

        gkp.stop = function () {
          this[keyCidj] = null;
        };


        /*
          g[k].start = function() {
              this.stop();
              this.D = true;
              var a = requestAnimationFrame
                , b = cancelAnimationFrame;
              this.j =  a.call(this.B, this.C)
          }
          ;
          g[k].stop = function() {
              if (this.isActive()) {
                  var a = requestAnimationFrame
                    , b = cancelAnimationFrame;
                  b.call(this.B, this.j)
              }
              this.j = null
          }
        */
      }

      if (fOption & 2) {
        const keyzo = PERF_471489_ ? getzo(_yt_player) : null;

        if (keyzo) {

          k = keyzo;

          const attrUpdateFn = g[k];
          // console.log(5992, attrUpdateFn)
          g['$$original$$' + k] = attrUpdateFn;
          const zoTransform = async (a, c) => {

            let transformType = '';
            let transformValue = 0;
            let transformUnit = '';
            let transformTypeI = 0;

            const aStyle = a.style;

            let cType = 0;

            const cl = c.length;

            if (cl >= 8) {
              // scale(1)
              if (c.startsWith('scale') && c.charCodeAt(6) === 40 && c.charCodeAt(cl - 1) === 41) {
                cType = 1;
                let t = c.charCodeAt(5);
                if (t === 88 || t === 120) cType = 1 | 4;
                if (t === 89 || t === 121) cType = 1 | 8;
              } else if (c.startsWith('translate') && c.charCodeAt(10) === 40 && c.charCodeAt(cl - 1) === 41) {
                cType = 2;
                let t = c.charCodeAt(9);
                if (t === 88 || t === 120) cType = 2 | 4;
                if (t === 89 || t === 121) cType = 2 | 8;
              }
              let w = 0;
              if (w = (cType === 5) ? 1 : (cType === 9) ? 2 : 0) {
                let p = c.substring(7, cl - 1);
                let q = p.length >= 1 ? parseFloat(p) : NaN;
                if (typeof q === 'number' && !isNaNx(q)) {
                  transformType = w === 1 ? 'scaleX' : 'scaleY';
                  transformValue = q;
                  transformUnit = '';
                  transformTypeI = 1;
                } else {
                  cType = 256;
                }
              } else if (w = (cType === 6) ? 1 : (cType === 10) ? 2 : 0) {
                if (c.endsWith('px)')) {
                  let p = c.substring(11, cl - 3);
                  let q = p.length >= 1 ? parseFloat(p) : NaN;
                  if (typeof q === 'number' && !isNaNx(q)) {
                    transformType = w === 1 ? 'translateX' : 'translateY';
                    transformValue = q;
                    transformUnit = 'px';
                    transformTypeI = 2;
                  } else if (p === 'NaN') {
                    return;
                  }
                } else {
                  cType = 256;
                }
              } else if (cType > 0) {
                cType = 256;
              }
            }


            if (cType === 256) {
              console.log('[yt-js-engine-tamer] zoTransform undefined', c);
            }

            if (transformTypeI === 1) {
              const q = Math.round(transformValue * steppingScaleN) / steppingScaleN;
              const vz = toFixed2(q, 3);
              c = `${transformType}(${vz})`;
              const cv = aStyle.transform;
              if (c === cv) return;
              aStyle.transform = c;
            } else if (transformTypeI === 2) {
              const q = transformValue;
              const vz = toFixed2(q, 1);
              c = `${transformType}(${vz}${transformUnit})`;
              const cv = aStyle.transform;
              if (c === cv) return;
              aStyle.transform = c;
            } else { // eg empty
              const cv = aStyle.transform;
              if (!c && !cv) return;
              else if (c === cv) return;
              aStyle.transform = c;
            }

          };

          const elmTransformTemp = new WeakMap();
          const elmPropTemps = {
            'display': new WeakMap(),
            'width': new WeakMap(),
            'height': new WeakMap(),
            'outlineWidth': new WeakMap(),
            'position': new WeakMap(),
            'padding': new WeakMap(),
            "cssText": new WeakMap(),
            "right": new WeakMap(),
            "left": new WeakMap(),
            "top": new WeakMap(),
            "bottom": new WeakMap(),
            "transitionDelay": new WeakMap(),
            "marginLeft": new WeakMap(),
            "marginTop": new WeakMap(),
            "marginRight": new WeakMap(),
            "marginBottom": new WeakMap(),
          }

          const ns5 = Symbol();
          const nextModify = (a, c, m, f, immediate) => {
            const a_ = a;
            const m_ = m;
            const noKey = !m_.has(a_);
            if (immediate || noKey) {
              m_.set(a_, ns5);
              f(a_, c);
              noKey && nextBrowserTick_(() => {
                const d = m_.get(a_);
                if (d === undefined) return;
                m_.delete(a_);
                if (d !== ns5) f(a_, d);
              });
            } else {
              m_.set(a_, c);
            }
          };

          const set66 = new Set();
          const log77 = new Map();
          // const set77 = new Set(['top', 'left', 'bottom', 'right']); // caption positioning - immediate change

          const modifiedFn = function (a, b, c, immediateChange = false) { // arrow function does not have function.prototype

            // console.log(140000, a, b, c);
            if (typeof c === 'number' && typeof b === 'string' && a instanceof HTMLElement_) {
              const num = c;
              c = `${num}`;
              if (c.length > 5) c = (num < 10 && num > -10) ? toFixed2(num, 3) : toFixed2(num, 1);
            }

            if (typeof b === 'string' && typeof c === 'string' && a instanceof HTMLElement_) {

              let elmPropTemp = null;

              if (b === "transform") {
                // div.ytp-hover-progress.ytp-hover-progress-light
                // div.ytp-play-progress.ytp-swatch-background-color

                nextModify(a, c, elmTransformTemp, zoTransform, immediateChange);
                return;

              } else if (elmPropTemp = elmPropTemps[b]) {

                // if (c.length > 5 && c.includes('.')) {
                //   console.log(123213, c)
                // }

                const b_ = b;
                nextModify(a, c, elmPropTemp, (a, c) => {
                  const style = a.style;
                  const cv = style[b_];
                  if (!cv && !c) return;
                  if (cv === c) return;
                  style[b_] = c;
                }, immediateChange);
                return;

              } else if (b === "outline-width") {

                const b_ = 'outlineWidth';
                elmPropTemp = elmPropTemps[b_];
                nextModify(a, c, elmPropTemp, (a, c) => {
                  const style = a.style;
                  const cv = style[b_];
                  if (!cv && !c) return;
                  if (cv === c) return;
                  style[b_] = c;
                }, immediateChange);
                return;

              } else if (b === 'maxWidth' || b === 'maxHeight') {
                // I think these can be directly assigned.

                const b_ = b;
                const style = a.style;
                const cv = style[b_];
                if (!cv && !c) return;
                if (cv === c) return;
                style[b_] = c;
                return;

              } else {
                // if(immediate && elmPropTemps[b]){
                //   console.log(5191, b)
                // }
                // caption-window
                // margin-left max-height max-width font-family fill color font-size background white-space margin
                // text-align background-color
                // console.log(27304, a, b, c)
                if (!set66.has(b)) {
                  set66.add(b);
                  nextBrowserTick_(() => {
                    if (!a.classList.contains('caption-window') && !a.classList.contains('ytp-caption-segment')) {
                      console.log(27304, a, b, c)
                    }
                  })
                }
              }

              attrUpdateFn.call(this, a, b, c);
              return;
            } else if (typeof (b || 0) === 'object') {

              // this is to fix caption positioning
              // const immediate = (a.id || 0).length > 14 && (('top' in b) || ('left' in b) || ('right' in b) || ('bottom' in b));
              const immediate = (a.id || 0).length > 14;
              for (const [k, v] of Object.entries(b)) {
                modifiedFn.call(this, a, k, v, immediate);
              }

            } else {

              // a = circle, b = stroke-dasharray, c= "1.8422857142857143 32"
              // ytp-ad-timed-pie-countdown-inner

              if (typeof b === 'string') {

                let m = log77.get(b);
                if (!m) {
                  m = [];
                  console.log('attrUpdateFn.debug.27304', m);
                  log77.set(b, m);
                }
                m.push([a, b, c]);

              } else {
                console.log('attrUpdateFn.debug.27306', a, b, c);
              }

              attrUpdateFn.call(this, a, b, c);
              return;
            }

            // console.log(130000, a, b, c);

          };
          g[k] = modifiedFn;


          /*

              g.zo = function(a, b, c) {
                  if ("string" === typeof b)
                      (b = yo(a, b)) && (a.style[b] = c);
                  else
                      for (var d in b) {
                          c = a;
                          var e = b[d]
                            , f = yo(c, d);
                          f && (c.style[f] = e)
                      }
              }


          */


        }
      }

      if (fOption & 4) {
        const keyuG = PERF_471489_ ? getuG(_yt_player) : null;

        if (keyuG) {

          k = keyuG;

          const gk = g[k];
          const gkp = gk.prototype;


          /** @type { Map<string, WeakMap<any, any>> } */
          const ntLogs = new Map();

          if (typeof gkp.updateValue === 'function' && gkp.updateValue.length === 2 && !gkp.updateValue31) {

            gkp.updateValue31 = gkp.updateValue;
            gkp.updateValue = function (a, b) {
              if (typeof a !== 'string') return this.updateValue31(a, b);

              const element = this.element;
              if (!(element instanceof HTMLElement_)) return this.updateValue31(a, b);

              let ntLog = ntLogs.get(a);
              if (!ntLog) ntLogs.set(a, (ntLog = new WeakMap()));

              let cache = ntLog.get(element);
              if (cache && cache.value === b) {
                return;
              }
              if (!cache) {
                this.__oldValueByUpdateValue__ = null;
                ntLog.set(element, cache = { value: b });
              } else {
                this.__oldValueByUpdateValue__ = cache.value;
                cache.value = b;
              }

              return this.updateValue31(a, b);
            }

            /*
              g.k.update = function(a) {
                  for (var b = g.u(Object.keys(a)), c = b.next(); !c.done; c = b.next())
                      c = c.value,
                      this.updateValue(c, a[c])
              }
              ;
              g.k.updateValue = function(a, b) {
                  (a = this.Td["{{" + a + "}}"]) && wG(this, a[0], a[1], b)
              }
            */

          }


        }
      }



    })();

    FIX_yt_player && !isChatRoomURL && (async () => {
      // timer scheduling

      const _yt_player = await _yt_player_observable.obtain();

      if (!_yt_player || typeof _yt_player !== 'object') return;

      let keyZqQu = getZqQu(_yt_player);

      if (!keyZqQu) return;

      const g = _yt_player
      let k = keyZqQu

      const gk = g[k];
      if (typeof gk !== 'function') return;
      const gkp = gk.prototype;

      const extractKeysZqQu = () => {


        let _keyeC = '';
        try {
          gkp.stop.call(new Proxy({
            isActive: () => { }
          }, {
            set(target, prop, value) {
              if (value === 0) _keyeC = prop;
              return true;
            }
          }));
        } catch (e) { }
        if (!_keyeC) return;
        const keyeC = _keyeC;

        let keyC = ''; // this.C = this.ST.bind(this)
        let keyhj = ''; // 1000ms
        try {
          gkp.start.call(new Proxy({
            stop: () => { },
            [keyeC]: 0,
          }, {
            get(target, prop) {
              if (prop in target) return target[prop];
              if (!keyC) {
                keyC = prop;
                return null; // throw error
              }
              else if (!keyhj) {
                keyhj = prop;
              }

            }
          }));
        } catch (e) {
          if (!keyC || !keyhj) {
            console.log(e)
          }
        }

        if (!keyC || !keyhj) return;
        let keyST = '';
        let keyj = '';
        let keyB = '';
        let keyxa = '';

        const possibleKs = new Set();

        for (const [k, v] of Object.entries(gkp)) {
          if (k === 'stop' || k === 'start' || k === 'isActive' || k === 'constructor' || k === keyeC || k === keyC || k === keyhj) {
            continue;
          }
          if (typeof v === 'function') {
            const m = /this\.(\w+)\.call\(this\.(\w+)\)/.exec(v + '');
            if (m) {
              keyST = k;
              keyj = m[1];
              keyB = m[2];
            } else {
              possibleKs.add(k);
            }
          }
        }

        if (!keyST || !keyj || !keyB) return;

        for (const k of possibleKs) {
          if (k === keyST || k === keyj || k === keyB) {
            continue;
          }
          const v = gkp[k];
          if (typeof v === 'function' && (v + '').includes(`this.stop();delete this.${keyj};delete this.${keyB}`)) {
            keyxa = k;
          }
        }

        return [keyeC, keyC, keyhj, keyST, keyj, keyB, keyxa];

      }

      const keys = extractKeysZqQu();
      if (!keys || !keys.length) return;
      const [keyeC, keyC, keyhj, keyST, keyj, keyB, keyxa] = keys; // [timerId, binded executorFn, 1000ms, executorFn, dataJ, objectB, disposeFn]

      if (!keyeC || !keyC || !keyhj || !keyST || !keyj || !keyB || !keyxa) return;

      let disposeKeys = null;

      gkp[keyxa] = function () {
        // dispose
        if (!disposeKeys) {
          disposeKeys = Object.getOwnPropertyNames(this).filter(key => {
            if (key != keyeC && key != keyC && key != keyhj && key != keyST && key != keyj && key != keyB && key != keyxa) {
              const t = typeof this[key];
              return t === 'undefined' || t === 'object'
            }
            return false;
          });
        }
        for (const key of disposeKeys) {
          const v = this[key];
          if ((v || 0).length >= 1) v.length = 0; // function (){if(this.fn)for(;this.fn.length;)this.fn.shift()()}
        }
        if (this[keyeC] > 0) this.stop();
        this[keyj] = null;
        this[keyB] = null;
      };

      gkp.start = function (a) {
        if (this[keyeC] > 0) this.stop();
        const delay = void 0 !== a ? a : this[keyhj];
        this[keyeC] = window.setTimeout(this[keyC], delay);
      };
      gkp.stop = function () {
        if (this[keyeC] > 0) {
          window.clearTimeout(this[keyeC]);
          this[keyeC] = 0;
        }
      };

      gkp.isActive = function () {
        return this[keyeC] > 0;
      };

      gkp[keyST] = function () {
        this.stop(); // this[keyeC] = 0;
        const fn = this[keyj];
        const obj = this[keyB];
        let skip = false;
        if (!fn) skip = true;
        else if (IGNORE_bufferhealth_CHECK && obj) {
          let m;
          if ((m = obj[keyC]) instanceof Map || (m = obj[keyj]) instanceof Map) {
            if (m.has("bufferhealth")) skip = true;
          }
        }
        if (!skip) {
          fn.call(obj);
        }
      };




      /*

      g.k.eC = 0;
      g.k.xa = function() {
          g.Qu.Vf.xa.call(this);
          this.stop();
          delete this.j;
          delete this.B
      }
      ;
      g.k.start = function(a) {
          this.stop();
          this.eC = g.gg(this.C, void 0 !== a ? a : this.hj)
      }
      ;
      g.k.stop = function() {
          this.isActive() && g.Sa.clearTimeout(this.eC);
          this.eC = 0
      }
      ;
      g.k.isActive = function() {
          return 0 != this.eC
      }
      ;
      g.k.ST = function() {
          this.eC = 0;
          this.j && this.j.call(this.B)
      }
      ;
      */




    })();

    FIX_Animation_n_timeline && (async () => {

      const [timeline, Animation] = await Promise.all([timelineObservable.obtain(), animationObservable.obtain()]);

      if (!timeline || !Animation) return;

      const animationsFix = (timeline) => {
        const animations = (timeline || 0)._animations || 0;
        const c = animations[0];
        if (c) {
          if (c && !c.id && c._isGroup === false && c._holdTime === 0 && c._paused === false && !c._callback && Number.isNaN(c._sequenceNumber) && c.effect.target instanceof HTMLCanvasElement) {
            animations.shift(); // keep animating but no looping
            // c.effect.remove();
          }
        }
      }

      const aniProto = Animation.prototype;
      // aniProto.sequenceNumber = 0; // native YouTube engine bug - sequenceNumber is not set

      const getXroto = (x) => {
        try {
          return x.__proto__;
        } catch (e) { }
        return null;
      }
      const timProto = getXroto(timeline);
      if (!timProto) return;
      if (
        (
          typeof timProto.getAnimations === 'function' && typeof timProto.play === 'function' &&
          typeof timProto._discardAnimations === 'function' && typeof timProto._play === 'function' &&
          typeof timProto._updateAnimationsPromises === 'function' && !timProto.nofCQ &&
          typeof aniProto._updatePromises === 'function' && !aniProto.nofYH
        )

      ) {

        timProto.nofCQ = 1;
        aniProto.nofYH = 1;

        const originalAnimationsWithPromises = ((_updateAnimationsPromises) => {


          /*
            v.animationsWithPromises = v.animationsWithPromises.filter(function (c) {
              return c._updatePromises();
            });
          */

          const p = Array.prototype.filter;

          let res = null;
          Array.prototype.filter = function () {

            res = this;
            return this;

          };

          _updateAnimationsPromises.call({});

          Array.prototype.filter = p;

          if (res && typeof res.length === 'number') {
            /** @type {any[]} */
            const _res = res;
            return _res;
          }


          return null;




        })(timProto._updateAnimationsPromises);

        if (!originalAnimationsWithPromises || typeof originalAnimationsWithPromises.length !== 'number') return;

        // console.log('originalAnimationsWithPromises', originalAnimationsWithPromises)

        aniProto._updatePromises31 = aniProto._updatePromises;

        /*
        aniProto._updatePromises = function(){
          console.log('eff',this._oldPlayState, this.playState)
          return this._updatePromises31.apply(this, arguments)
        }
        */

        aniProto._updatePromises = function () {
          var oldPlayState = this._oldPlayState;
          var newPlayState = this.playState;
          // console.log('ett', oldPlayState, newPlayState)
          if (newPlayState !== oldPlayState) {
            this._oldPlayState = newPlayState;
            if (this._readyPromise) {
              if ("idle" == newPlayState) {
                this._rejectReadyPromise();
                this._readyPromise = void 0;
              } else if ("pending" == oldPlayState) {
                this._resolveReadyPromise();
              } else if ("pending" == newPlayState) {
                this._readyPromise = void 0;
              }
            }
            if (this._finishedPromise) {
              if ("idle" == newPlayState) {
                this._rejectFinishedPromise();
                this._finishedPromise = void 0;
              } else if ("finished" == newPlayState) {
                this._resolveFinishedPromise();
              } else if ("finished" == oldPlayState) {
                this._finishedPromise = void 0;
              }
            }
          }
          return this._readyPromise || this._finishedPromise;
        };


        let restartWebAnimationsNextTickFlag = false;

        const looperMethodT = () => {

          const runnerFn = (hRes) => {
            var b = timeline;
            b.currentTime = hRes;
            b._discardAnimations();
            FIX_Animation_n_timeline_cinematic && animationsFix(b);
            if (0 == b._animations.length) {
              restartWebAnimationsNextTickFlag = false;
            } else {
              getRafPromise().then(runnerFn);
            }
          }

          const restartWebAnimationsNextTick = () => {
            if (!restartWebAnimationsNextTickFlag) {
              restartWebAnimationsNextTickFlag = true;
              getRafPromise().then(runnerFn);
            }
          }

          return { restartWebAnimationsNextTick }
        };


        const looperMethodN = () => {

          const acs = document.createElement('a-f');
          acs.id = 'a-f';

          if (!document.getElementById('afscript')) {
            const style = document.createElement('style');
            style.id = 'afscript';
            style.textContent = `
              @keyFrames aF1 {
                0% {
                  order: 0;
                }
                100% {
                  order: 1;
                }
              }
              #a-f[id] {
                visibility: collapse !important;
                position: fixed !important;
                display: block !important;
                top: -100px !important;
                left: -100px !important;
                margin:0 !important;
                padding:0 !important;
                outline:0 !important;
                border:0 !important;
                z-index:-1 !important;
                width: 0px !important;
                height: 0px !important;
                contain: strict !important;
                pointer-events: none !important;
                animation: 1ms steps(2, jump-none) 0ms infinite alternate forwards running aF1 !important;
              }
            `;
            (document.head || document.documentElement).appendChild(style);
          }

          document.documentElement.insertBefore(acs, document.documentElement.firstChild);

          const _onanimationiteration = function (evt) {
            const hRes = evt.timeStamp;
            var b = timeline;
            b.currentTime = hRes;
            b._discardAnimations();
            FIX_Animation_n_timeline_cinematic && animationsFix(b);
            if (0 == b._animations.length) {
              restartWebAnimationsNextTickFlag = false;
              acs.onanimationiteration = null;
            } else {
              acs.onanimationiteration = _onanimationiteration;
            }

          }



          const restartWebAnimationsNextTick = () => {
            if (!restartWebAnimationsNextTickFlag) {
              restartWebAnimationsNextTickFlag = true;
              acs.onanimationiteration = _onanimationiteration;

            }
          }

          return { restartWebAnimationsNextTick }
        };



        const { restartWebAnimationsNextTick } = ('onanimationiteration' in document.documentElement) ? looperMethodN() : looperMethodT();


        // console.log(571, timProto);
        timProto._play = function (c) {
          c = new Animation(c, this);
          this._animations.push(c);
          restartWebAnimationsNextTick();
          c._updatePromises();
          c._animation.play();
          c._updatePromises();
          return c
        }

        const animationsWithPromisesMap = new Set(originalAnimationsWithPromises);
        originalAnimationsWithPromises.length = 0;
        originalAnimationsWithPromises.push = null;
        originalAnimationsWithPromises.splice = null;
        originalAnimationsWithPromises.slice = null;
        originalAnimationsWithPromises.indexOf = null;
        originalAnimationsWithPromises.unshift = null;
        originalAnimationsWithPromises.shift = null;
        originalAnimationsWithPromises.pop = null;
        originalAnimationsWithPromises.filter = null;
        originalAnimationsWithPromises.forEach = null;
        originalAnimationsWithPromises.map = null;


        const _updateAnimationsPromises = () => {
          animationsWithPromisesMap.forEach(c => {
            if (!c._updatePromises()) animationsWithPromisesMap.delete(c);
          });
          /*
          v.animationsWithPromises = v.animationsWithPromises.filter(function (c) {
            return c._updatePromises();
          });
          */
        }

        timProto._updateAnimationsPromises31 = timProto._updateAnimationsPromises;

        timProto._updateAnimationsPromises = _updateAnimationsPromises;

        delete timProto._updateAnimationsPromises;
        Object.defineProperty(timProto, '_updateAnimationsPromises', {
          get() {
            if (animationsWithPromisesMap.size === 0) return nilFn;
            return _updateAnimationsPromises;
          },
          set(nv) {
            delete this._updateAnimationsPromises;
            this._updateAnimationsPromises = nv;
          },
          enumerable: true,
          configurable: true,
        });


        let pdFinished = Object.getOwnPropertyDescriptor(aniProto, 'finished');
        aniProto.__finished_native_get__ = pdFinished.get;
        if (typeof pdFinished.get === 'function' && !pdFinished.set && pdFinished.configurable === true && pdFinished.enumerable === true) {


          Object.defineProperty(aniProto, 'finished', {
            get() {
              this._finishedPromise || (!animationsWithPromisesMap.has(this) && animationsWithPromisesMap.add(this),
                this._finishedPromise = new Promise((resolve, reject) => {
                  this._resolveFinishedPromise = function () {
                    resolve(this)
                  };
                  this._rejectFinishedPromise = function () {
                    reject({
                      type: DOMException.ABORT_ERR,
                      name: "AbortError"
                    })
                  };
                }),
                "finished" == this.playState && this._resolveFinishedPromise());
              return this._finishedPromise
            },
            set: undefined,
            enumerable: true,
            configurable: true
          });

        }



        let pdReady = Object.getOwnPropertyDescriptor(aniProto, 'ready');
        aniProto.__ready_native_get__ = pdReady.get;
        if (typeof pdReady.get === 'function' && !pdReady.set && pdReady.configurable === true && pdReady.enumerable === true) {

          Object.defineProperty(aniProto, 'ready', {
            get() {
              this._readyPromise || (!animationsWithPromisesMap.has(this) && animationsWithPromisesMap.add(this),
                this._readyPromise = new Promise((resolve, reject) => {
                  this._resolveReadyPromise = function () {
                    resolve(this)
                  };
                  this._rejectReadyPromise = function () {
                    reject({
                      type: DOMException.ABORT_ERR,
                      name: "AbortError"
                    })
                  };
                }),
                "pending" !== this.playState && this._resolveReadyPromise());
              return this._readyPromise
            },
            set: undefined,
            enumerable: true,
            configurable: true
          });

        }


        if (IGNORE_bindAnimationForCustomEffect && typeof aniProto._rebuildUnderlyingAnimation === 'function' && !aniProto._rebuildUnderlyingAnimation21 && aniProto._rebuildUnderlyingAnimation.length === 0) {

          aniProto._rebuildUnderlyingAnimation21 = aniProto._rebuildUnderlyingAnimation;
          const _rebuildUnderlyingAnimation = function () {
            // if (isNaN(this._sequenceNumber)) return; // do not rebuild underlying animation if native animation is used.
            this.effect && this.effect._onsample && (this.effect._onsample = null);
            return this._rebuildUnderlyingAnimation21();
          }
          aniProto._rebuildUnderlyingAnimation = _rebuildUnderlyingAnimation;
          // delete aniProto._rebuildUnderlyingAnimation;
          // Object.defineProperty(aniProto, '_rebuildUnderlyingAnimation', {
          //   get() {
          //     if (isNaN(this._sequenceNumber)) return nilFn;
          //     return this._rebuildUnderlyingAnimation21;
          //   },
          //   set(nv) {
          //     delete this._rebuildUnderlyingAnimation;
          //     this._rebuildUnderlyingAnimation = nv;
          //   },
          //   enumerable: true,
          //   configurable: true
          // });
        }


        /*


          function f(c) {
              var b = v.timeline;
              b.currentTime = c;
              b._discardAnimations();
              0 == b._animations.length ? d = !1 : requestAnimationFrame(f)
          }
          var h = window.requestAnimationFrame;
          window.requestAnimationFrame = function(c) {
              return h(function(b) {
                  v.timeline._updateAnimationsPromises();
                  c(b);
                  v.timeline._updateAnimationsPromises()
              })
          }
          ;
          v.AnimationTimeline = function() {
              this._animations = [];
              this.currentTime = void 0
          }
          ;
          v.AnimationTimeline.prototype = {
              getAnimations: function() {
                  this._discardAnimations();
                  return this._animations.slice()
              },
              _updateAnimationsPromises: function() {
                  v.animationsWithPromises = v.animationsWithPromises.filter(function(c) {
                      return c._updatePromises()
                  })
              },
              _discardAnimations: function() {
                  this._updateAnimationsPromises();
                  this._animations = this._animations.filter(function(c) {
                      return "finished" != c.playState && "idle" != c.playState
                  })
              },
              _play: function(c) {
                  c = new v.Animation(c,this);
                  this._animations.push(c);
                  v.restartWebAnimationsNextTick();
                  c._updatePromises();
                  c._animation.play();
                  c._updatePromises();
                  return c
              },
              play: function(c) {
                  c && c.remove();
                  return this._play(c)
              }
          };
          var d = !1;
          v.restartWebAnimationsNextTick = function() {
              d || (d = !0,
              requestAnimationFrame(f))
          }
          ;
          var a = new v.AnimationTimeline;
          v.timeline = a;
          try {
              Object.defineProperty(window.document, "timeline", {
                  configurable: !0,
                  get: function() {
                      return a
                  }
              })
          } catch (c) {}
          try {
              window.document.timeline = a
          } catch (c) {}

        */



        /*

      var g = window.getComputedStyle;
      Object.defineProperty(window, "getComputedStyle", {
          configurable: !0,
          enumerable: !0,
          value: function() {
              v.timeline._updateAnimationsPromises();
              var e = g.apply(this, arguments);
              h() && (e = g.apply(this, arguments));
              v.timeline._updateAnimationsPromises();
              return e
          }
      });

      */




      }




    })();

    !isUrlInEmbed && Promise.resolve().then(() => {

      // ==================================== FIX_avoid_incorrect_video_meta ====================================



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

      // const wk3 = new WeakMap();

      // let mtxVideoId = '';
      // let aje3 = [];
      const mfvContinuationRecorded = new LimitedSizeSet(8);      // record all success continuation keys
      const mfyContinuationIgnored = new LimitedSizeSet(8);       // ignore continuation keys by copying the keys in the past
      let mtzlastAllowedContinuation = '';  // the key stored at the last success; clear when scheduling changes
      let mtzCount = 0;             // the key keeps unchanged
      // let mjtNextMainKey = '';
      let mjtRecordedPrevKey = ''; // the key stored at the last success (no clear)
      let mjtLockPreviousKey = ''; // the key before fetch() should be discarded. (uncertain continuation)
      let mbCId322 = 0;              // cid for delay fetchUpdatedMetadata
      // let allowNoDelay322=false;
      let mbDelayBelowNCalls = 0;   // after N calls, by pass delay; reset when scheduling changes

      let mpKey22 = '';           // last success continutation key & url pair
      let mpUrl22 = '';          // last success continutation key & url pair
      let mpKey21 = '';           // latest requested continutation key & url pair
      let mpUrl21 = '';         // latest requested continutation key & url pair


      async function sha1Hex(message) {
        const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8); // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""); // convert bytes to hex string
        return hashHex;
      }

      async function continuationLog(a, ...args) {
        let b = a;
        try {
          if (advanceLogging) b = await sha1Hex(a);
          let c = args.map(e => {
            return e === a ? b : e
          });
          console.log(...c)
        } catch (e) { console.warn(e) }
      }

      function copyPreviousContiuationToIgnored374(toClearRecorded) {


        if (mfvContinuationRecorded.length > 0) {
          for (const [e, d] of mfvContinuationRecorded) {
            mfyContinuationIgnored.removeAdd(e);
          }
          toClearRecorded && mfvContinuationRecorded.clear();
        }

      }

      function setup_ytTaskEmitterBehavior_TaskMgr374(taskMgr) {

        const tmProto = taskMgr.constructor.prototype;
        if (tmProto && typeof tmProto.addJob === 'function' && tmProto.addJob.length === 3 && typeof tmProto.cancelJob === 'function' && tmProto.cancelJob.length === 1) {

          if (!tmProto.addJob714) {

            tmProto.addJob714 = tmProto.addJob;

            tmProto.addJob = function (a, b, c) {
              const jobId = this.addJob714(a, b, c);
              if (jobId > 0) {
                // const ez = wk3.get(this);
                // const dz = ez ? ez.data?.updatedMetadataEndpoint?.updatedMetadataEndpoint : null;
                // aje3.push({mtx, jobId, a,b,c, element: this, dz, data: (ez?.data || null) })

                this.__lastJobId863__ = jobId;
              }
              return jobId;
            }

          }

          if (!tmProto.cancelJob714) {

            tmProto.cancelJob714 = tmProto.cancelJob;

            tmProto.cancelJob = function (a) {
              const res = this.cancelJob714(a);
              // if (a > 0) {
              //   for (const e of aje3) {
              //     if (e.jobId === a) e.cancelled = true;
              //   }
              // }
              return res;
            }

          }

        }
      }


      const FIX_avoid_incorrect_video_meta_bool = FIX_avoid_incorrect_video_meta && isPrepareCachedV && check_for_set_key_order && !isChatRoomURL;


      FIX_avoid_incorrect_video_meta_bool && whenCEDefined('ytd-video-primary-info-renderer').then(() => {
        let dummy;
        let cProto;
        // let mc = 4;
        // dummy = await observablePromise(() => {
        //   const r = document.querySelector('ytd-video-primary-info-renderer');
        //   if (!r) return;
        //   let cProto = insp(r).constructor.prototype;
        //   if (cProto.fetchUpdatedMetadata) return r;
        //   if (--mc < 0) return -1;
        //   return null;
        // }).obtain();
        dummy = document.createElement('ytd-video-primary-info-renderer');
        if (!(dummy instanceof Element)) return;
        // console.log(5022, dummy)
        cProto = insp(dummy).constructor.prototype;

        cProto.__getEmittorTaskMgr859__ = function () {
          let taskMgr_ = null;
          try {
            taskMgr_ = (this.ytTaskEmitterBehavior || 0).getTaskManager() || null;
          } catch (e) { }
          return taskMgr_;
        }
        if (typeof cProto.fetchUpdatedMetadata === 'function' && cProto.fetchUpdatedMetadata.length === 1 && !cProto.fetchUpdatedMetadata717) {
          // console.log(1234, cProto, cProto.is)
          cProto.fetchUpdatedMetadata717 = cProto.fetchUpdatedMetadata;

          let c_;
          cProto.fetchUpdatedMetadata718 = function (a) {
            // delay or immediate call the actual fetchUpdatedMetadata

            let doImmediately = false;
            if (a && typeof a === 'string' && mjtRecordedPrevKey && mjtRecordedPrevKey === mpKey22 && a === mpKey22 && (!pageSetupVideoId || pageSetupVideoId !== mpUrl22)) {

              if (!pageSetupVideoId && videoPlayingY.videoId === mpUrl22) doImmediately = true;

            } else if (typeof a !== 'string' || mbDelayBelowNCalls > 3 || !mpKey22 || (mpKey22 === a && mpKey22 !== mjtLockPreviousKey) || (mjtLockPreviousKey && mjtLockPreviousKey !== a)) {

              doImmediately = true;

            }

            if (mbCId322) {
              clearTimeout(mbCId322);
              mbCId322 = 0;
            }

            if (doImmediately) return this.fetchUpdatedMetadata717(a);

            let delay = mjtLockPreviousKey === a ? 8000 : 800;

            mbCId322 = setTimeout(() => {
              this.fetchUpdatedMetadata717(a);
            }, delay);

            console.log('[yt-js-engine-tamer]', '5190 delayed fetchUpdatedMetadata', delay);

          }

          cProto.fetchUpdatedMetadata = function (a) {

            if (!pageSetupState) {
              if (c_) clearTimeout(c_);
              c_ = setTimeout(() => {
                this.fetchUpdatedMetadata718(a);
              }, 300);
              return;
            }

            // pageSetupState == 0

            try {

              mbDelayBelowNCalls++;

              if (arguments.length > 1 || !(a === undefined || (typeof a === 'string' && a))) {
                console.warn("CAUTION: fetchUpdatedMetadata coding might have to be updated.");
              }

              // console.log('fum377', a)
              if (typeof a === 'string' && mfyContinuationIgnored.has(a)) {
                console.log('[yt-js-engine-tamer]', '5040 skip fetchUpdatedMetadata', a);
                return;
              }

              if (!a && (this.data || 0).updatedMetadataEndpoint) {
                if (mjtRecordedPrevKey && mjtLockPreviousKey !== mjtRecordedPrevKey) {
                  mjtLockPreviousKey = mjtRecordedPrevKey;
                  LOG_FETCHMETA_UPDATE && continuationLog(mjtLockPreviousKey, '5150 Lock Key', mjtLockPreviousKey);
                }
                // mjtNextMainKey = true;
                mtzlastAllowedContinuation = '';
                mtzCount = 0;
                // allowNoDelay322 = false;
                // fetch new metadata, cancel all previous continuations
                copyPreviousContiuationToIgnored374(true);
              } else if (typeof a === 'string') {
                const videoPlayingId = videoPlayingY.videoId;

                // if(mjtNextMainKey === true) mjtNextMainKey = a;

                let update21 = !!pageSetupVideoId;
                if (mpKey22 === a && mpUrl22 === videoPlayingId && mpUrl22 && videoPlayingId && (!pageSetupVideoId || pageSetupVideoId === videoPlayingId)) {
                  update21 = true;
                } else if (mpKey22 === a && mpUrl22 !== pageSetupVideoId) {
                  LOG_FETCHMETA_UPDATE && continuationLog(mpKey22, '5060 mpUrl22 mismatched', mpKey22, mpUrl22, pageSetupVideoId || '(null)', videoPlayingId || '(null)');
                  return;
                }
                if (update21) {
                  mpKey21 = a;
                  mpUrl21 = pageSetupVideoId || videoPlayingId;
                }

                if (!mfvContinuationRecorded.has(a)) mfvContinuationRecorded.add(a);
              }
              LOG_FETCHMETA_UPDATE && continuationLog(a, '5180 fetchUpdatedMetadata\t', a, pageSetupVideoId || '(null)', videoPlayingY.videoId || '(null)');
              // if (!pageSetupVideoId && typeof a === 'string' && a.length > 40) return; // ignore incorrect continuation
              // if(a === mjtNextMainKey) allowNoDelay322 = false;
              return this.fetchUpdatedMetadata718(a);

            } catch (e) {
              console.log('Code Error in fetchUpdatedMetadata', e);
            }
            return this.fetchUpdatedMetadata717(a)
          }
        }


        if (typeof cProto.scheduleInitialUpdatedMetadataRequest === 'function' && cProto.scheduleInitialUpdatedMetadataRequest.length === 0 && !cProto.scheduleInitialUpdatedMetadataRequest717) {
          // console.log(1234, cProto, cProto.is)
          cProto.scheduleInitialUpdatedMetadataRequest717 = cProto.scheduleInitialUpdatedMetadataRequest;
          let mJob = null;

          cProto.scheduleInitialUpdatedMetadataRequest = function () {

            try {

              if (arguments.length > 0) {
                console.warn("CAUTION: scheduleInitialUpdatedMetadataRequest coding might have to be updated.");
              }
              // mfy = mfv;

              // mjtNextMainKey = '';
              mtzlastAllowedContinuation = '';
              mtzCount = 0;
              if (mbCId322) {
                clearTimeout(mbCId322);
                mbCId322 = 0;
              }
              mbDelayBelowNCalls = 0;
              // allowNoDelay322 = false;
              copyPreviousContiuationToIgnored374(true);

              const taskMgr = this.__getEmittorTaskMgr859__();
              if (FIX_avoid_incorrect_video_meta_emitterBehavior && taskMgr && !taskMgr.addJob714 && taskMgr.addJob && taskMgr.cancelJob) setup_ytTaskEmitterBehavior_TaskMgr374(taskMgr);
              if (FIX_avoid_incorrect_video_meta_emitterBehavior && taskMgr && !taskMgr.addJob714) {
                console.log('[yt-js-engine-tamer]', 'scheduleInitialUpdatedMetadataRequest error 507');
              }

              // prevent depulicated schedule job by clearing previous JobId
              if (taskMgr && typeof taskMgr.addLowPriorityJob === 'function' && taskMgr.addLowPriorityJob.length === 2 && typeof taskMgr.cancelJob === 'function' && taskMgr.cancelJob.length === 1) {

                let res;

                if (mJob) {
                  const job = mJob;
                  mJob = null;
                  console.log('cancelJob', job)
                  taskMgr.cancelJob(job); // clear previous [Interval Meta Update] job
                  // p.cancelJob(a,b);
                }

                // const updatedMetadataEndpoint = this.data?.updatedMetadataEndpoint?.updatedMetadataEndpoint

                let pza = taskMgr.__lastJobId863__;
                try { res = this.scheduleInitialUpdatedMetadataRequest717(); } catch (e) { }
                let pzb = taskMgr.__lastJobId863__
                if (pza !== pzb) {
                  mJob = pzb; // set [Interval Meta Update] jobId
                }

                // if (updatedMetadataEndpoint && updatedMetadataEndpoint.videoId) {
                //   mtxVideoId = updatedMetadataEndpoint.videoId || ''; // set the current target VideoId
                // } else {
                //   mtxVideoId = ''; // sometimes updatedMetadataEndpoint is not ready
                // }

                return res;

              } else {
                console.log('[yt-js-engine-tamer]', 'scheduleInitialUpdatedMetadataRequest error 601');
              }

            } catch (e) {
              console.log('Code Error in scheduleInitialUpdatedMetadataRequest', e);
            }


            return this.scheduleInitialUpdatedMetadataRequest717();
          }
        }


      });

      FIX_avoid_incorrect_video_meta_bool && promiseForYtActionCalled.then((ytAppDom) => {
        let dummy;
        let cProto;
        dummy = ytAppDom;
        if (!(dummy instanceof Element)) return;
        cProto = insp(dummy).constructor.prototype;
        if (typeof cProto.sendServiceAjax_ === 'function' && cProto.sendServiceAjax_.length === 4 && !cProto.sendServiceAjax717_) {
          // console.log(1234, cProto, cProto.is);
          // cProto.handleServiceRequest717_ = cProto.handleServiceRequest_;
          // cProto.handleServiceRequest_ = function (a, b, c, d) {
          //   console.log(123401, arguments);
          //   return this.handleServiceRequest717_(a, b, c, d);
          // }

          // cProto.handleServiceRequest717_ = cProto.handleServiceRequest_;

          // cProto.handleServiceRequest_ = function(a,b,c,d){
          //   console.log(59901, a?.is, b?.updatedMetadataEndpoint?.videoId, c?.continuation)
          //   if(a?.is === 'ytd-video-primary-info-renderer' && b?.updatedMetadataEndpoint?.videoId && c?.continuation && typeof c?.continuation ==='string'){
          //     console.log('mfv', c.continuation);
          //     mfv.add( c.continuation);
          //   }
          //   return this.handleServiceRequest717_(a,b,c,d);
          // }

          function extraArguments322(a, b, c) {
            let is = (a || 0).is;
            let videoId = ((b || 0).updatedMetadataEndpoint || 0).videoId;
            let continuation = (c || 0).continuation;
            if (typeof is !== 'string') is = null;
            if (typeof videoId !== 'string') videoId = null;
            if (typeof continuation !== 'string') continuation = null;
            return { is, videoId, continuation };
          }

          cProto.sendServiceAjax717_ = cProto.sendServiceAjax_;
          cProto.sendServiceAjax_ = function (a, b, c, d) {

            // console.log(8001)
            try {

              const { is, videoId, continuation } = extraArguments322(a, b, c);

              if ((videoId || continuation) && (is !== 'ytd-video-primary-info-renderer')) {
                console.warn("CAUTION: sendServiceAjax_ coding might have to be updated.");
              }

              if (pageSetupVideoId && videoId && continuation) {
                if (mpKey21 && mpUrl21 && mpKey21 === continuation && mpUrl21 !== pageSetupVideoId) {
                  mfyContinuationIgnored.removeAdd(continuation);
                  mfvContinuationRecorded.delete(continuation);
                  return;
                }
              }

              if (mjtLockPreviousKey && mjtLockPreviousKey !== continuation && continuation) {
                copyPreviousContiuationToIgnored374(false);
                mfyContinuationIgnored.delete(continuation);
                mfvContinuationRecorded.removeAdd(continuation);
                mfyContinuationIgnored.removeAdd(mjtLockPreviousKey);
                mfvContinuationRecorded.delete(mjtLockPreviousKey);
                mjtLockPreviousKey = '';
              }
              // if (mjtNextMainKey === continuation) {
              //   copyPreviousContiuationToIgnored(false);
              //   mfyContinuationIgnored.delete(continuation);
              //   mfvContinuationRecorded.add(continuation);
              // }


              if (mfyContinuationIgnored && continuation) {
                if (mfyContinuationIgnored.has(continuation)) {
                  LOG_FETCHMETA_UPDATE && continuationLog(continuation, '5260 matched01', continuation)
                  return;
                }
              }

              // console.log(59902, a?.is, b,c,d)
              // console.log(59903, a?.is, b?.updatedMetadataEndpoint?.videoId, c?.continuation)
              if (is === 'ytd-video-primary-info-renderer' && videoId && continuation && !mfvContinuationRecorded.has(continuation)) {
                // console.log('mfv377', continuation);
                mfvContinuationRecorded.add(continuation);
              }

              // if (videoId) {
              //   if (!pageSetupVideoId) return; // ignore page not ready
              //   // if (mtxVideoId && b.updatedMetadataEndpoint.videoId !== mtxVideoId) return; // ignore videoID not matched
              //   if (videoId !== pageSetupVideoId) {
              //     return;
              //   }
              // }

            } catch (e) {
              console.log('Coding Error in sendServiceAjax_', e)
            }
            // console.log(8002)
            // console.log(123402, arguments);
            // console.log(5162, 'a',a?.is,'b',b,'c',c,'d',d);

            // console.log(5211, b?.updatedMetadataEndpoint?.kdkw33);
            // if(b &&b.updatedMetadataEndpoint && !b.updatedMetadataEndpoint.kdkw33){
            //   b.updatedMetadataEndpoint = new Proxy(b.updatedMetadataEndpoint, {
            //     get(target, prop, receiver){
            //       console.log('xxs99', target.videoId, mtx)
            //       if(prop ==='kdkw33') return 1;
            //       console.log(3322, prop, target)
            //       if(prop === 'initialDelayMs') {
            //         throw new Error("ABCC");
            //       }
            //       return target[prop];
            //     },
            //     set(target, prop, value, receiver){

            //       if(prop ==='kdkw33') return true;
            //       target[prop]=value;
            //       return true;
            //     }
            //   });
            // }
            // console.log(5533, b?.updatedMetadataEndpoint?.kdkw33)
            return this.sendServiceAjax717_(a, b, c, d);
          }
        }

        function delayClearOtherKeys(lztContinuation) {
          // // schedule delayed removal if mfyContinuationIgnored is not empty
          // getRafPromise().then(() => {
          //   // assume the repeat continuation could be only for popstate which is triggered by user interaction
          //   // foreground page only

          // });


          if (lztContinuation !== mtzlastAllowedContinuation) return;
          if (lztContinuation !== mpKey21 || lztContinuation !== mpKey22) return;
          if (!mfyContinuationIgnored.size) return;
          if (mfyContinuationIgnored.size > 1) {
            LOG_FETCHMETA_UPDATE && continuationLog(lztContinuation, 'delayClearOtherKeys, current = ', lztContinuation);
          }
          mfyContinuationIgnored.forEach((value, key) => {
            if (key !== lztContinuation) {
              mfyContinuationIgnored.delete(key);
              LOG_FETCHMETA_UPDATE && continuationLog(key, 'previous continuation removed from ignored store', key);
            }
          });

        }
        if (typeof cProto.getCancellableNetworkPromise_ === 'function' && cProto.getCancellableNetworkPromise_.length === 5 && !cProto.getCancellableNetworkPromise717_) {
          cProto.getCancellableNetworkPromise717_ = cProto.getCancellableNetworkPromise_;
          cProto.getCancellableNetworkPromise_ = function (a, b, c, d, e) {

            // console.log(8003)
            try {


              const { is, videoId, continuation } = extraArguments322(b, c, d);

              if ((videoId || continuation) && (is !== 'ytd-video-primary-info-renderer')) {
                console.warn("CAUTION: getCancellableNetworkPromise_ coding might have to be updated.");
              }

              if (pageSetupVideoId && videoId && continuation) {
                if (mpKey21 && mpUrl21 && mpKey21 === continuation && mpUrl21 !== pageSetupVideoId) {
                  mfyContinuationIgnored.removeAdd(continuation);
                  mfvContinuationRecorded.delete(continuation);
                  return;
                }
              }

              if (mjtLockPreviousKey && mjtLockPreviousKey !== continuation && continuation) {
                copyPreviousContiuationToIgnored374(false);
                mfyContinuationIgnored.delete(continuation);
                mfvContinuationRecorded.removeAdd(continuation);
                mfyContinuationIgnored.removeAdd(mjtLockPreviousKey);
                mfvContinuationRecorded.delete(mjtLockPreviousKey);
                mjtLockPreviousKey = '';
              }

              // if (mjtNextMainKey === continuation) {
              //   copyPreviousContiuationToIgnored(false);
              //   mfyContinuationIgnored.delete(continuation);
              //   mfvContinuationRecorded.add(continuation);
              // }

              const lztContinuation = continuation;

              if (mfyContinuationIgnored && lztContinuation && typeof lztContinuation === 'string') {
                if (mfyContinuationIgnored.has(lztContinuation)) {
                  LOG_FETCHMETA_UPDATE && continuationLog(lztContinuation, '5360 matched02', lztContinuation)
                  return;
                }
              }

              // if (videoId) {
              //   if (!pageSetupVideoId) return; // ignore page not ready
              //   // if (mtxVideoId && c.updatedMetadataEndpoint.videoId !== mtxVideoId) return; // ignore videoID not matched
              //   if (videoId !== pageSetupVideoId) {
              //     return;
              //   }
              // }

              if (typeof lztContinuation === 'string' && mtzlastAllowedContinuation !== lztContinuation) {
                mtzlastAllowedContinuation = lztContinuation;
                // console.log(70401, lztContinuation, mfyContinuationIgnored.size)

                LOG_FETCHMETA_UPDATE && continuationLog(lztContinuation, '5382 Continuation sets to\t', lztContinuation, `C${mtzCount}.R${mfvContinuationRecorded.size}.I${mfyContinuationIgnored.size}`);
                mjtRecordedPrevKey = lztContinuation;
                if (mjtLockPreviousKey === lztContinuation) mjtLockPreviousKey = '';
                // if (mfyContinuationIgnored.size > 0) {
                //   delayClearOtherKeys(lztContinuation);
                // }
                mtzCount = 0;
                // allowNoDelay322 = false;
              } else if (typeof lztContinuation === 'string' && mtzlastAllowedContinuation && mtzlastAllowedContinuation === lztContinuation) {
                // repeated
                if (++mtzCount > 1e9) mtzCount = 1e4;
                LOG_FETCHMETA_UPDATE && continuationLog(lztContinuation, '5386 Same Continuation\t\t', lztContinuation, `C${mtzCount}.R${mfvContinuationRecorded.size}.I${mfyContinuationIgnored.size}`);

                // if (mtzCount >= 3) allowNoDelay322 = true;
                if (mtzCount >= 3 && mfyContinuationIgnored.size > 0) {
                  Promise.resolve(lztContinuation).then(delayClearOtherKeys).catch(console.warn);
                }
                if (mtzCount === 5) {
                  mfvContinuationRecorded.clear();
                  mfvContinuationRecorded.add(lztContinuation);
                }

              }

              if (typeof lztContinuation === 'string' && lztContinuation && (pageSetupVideoId || videoPlayingY.videoId)) {
                mpKey22 = lztContinuation;
                mpUrl22 = pageSetupVideoId || videoPlayingY.videoId;
              }

              if (mbCId322) {
                clearTimeout(mbCId322);
                mbCId322 = 0;
              }
            } catch (e) {
              console.log('Coding Error in getCancellableNetworkPromise_', e)
            }

            // console.log(8004)
            // console.log(123403, arguments);
            // if(c.updatedMetadataEndpoint) console.log(123404, pageSetupVideoId, JSON.stringify(c.updatedMetadataEndpoint))

            // console.log(5163, a?.is,b,c,d,e);
            return this.getCancellableNetworkPromise717_(a, b, c, d, e);
          }
        }
      });

      // ==================================== FIX_avoid_incorrect_video_meta ====================================


      FIX_ytdExpander_childrenChanged && !isChatRoomURL && whenCEDefined('ytd-expander').then(() => {

        let dummy;
        let cProto;

        dummy = document.createElement('ytd-expander');
        cProto = insp(dummy).constructor.prototype;

        if (fnIntegrity(cProto.initChildrenObserver, '0.48.21') && fnIntegrity(cProto.childrenChanged, '0.40.22')) {

          cProto.initChildrenObserver14 = cProto.initChildrenObserver;
          cProto.childrenChanged14 = cProto.childrenChanged;

          cProto.initChildrenObserver = function () {
            var a = this;
            this.observer = new MutationObserver(function () {
              a.childrenChanged()
            }
            );
            this.observer.observe(this.content, {
              subtree: !0,
              childList: !0,
              attributes: !0,
              characterData: !0
            });
            this.childrenChanged()
          }
            ;
          cProto.childrenChanged = function () {
            if (this.alwaysToggleable) {
              this.canToggle = this.alwaysToggleable;
            } else if (!this.canToggleJobId) {
              this.canToggleJobId = 1;
              foregroundPromiseFn().then(() => {
                this.canToggleJobId = 0;
                this.calculateCanCollapse()
              })
            }
          }

          // console.log(cProto.initChildrenObserver)
          console.debug('ytd-expander-fix-childrenChanged');

        }

      });


      FIX_paper_ripple_animate && whenCEDefined('paper-ripple').then(() => {

        let dummy;
        let cProto;
        dummy = document.createElement('paper-ripple');
        cProto = insp(dummy).constructor.prototype;

        if (fnIntegrity(cProto.animate, '0.74.5')) {


          cProto.animate34 = cProto.animate;
          cProto.animate = function () {
            if (this._animating) {
              var a;
              const ripples = this.ripples;
              for (a = 0; a < ripples.length; ++a) {
                var b = ripples[a];
                b.draw();
                this.$.background.style.opacity = b.outerOpacity;
                b.isOpacityFullyDecayed && !b.isRestingAtMaxRadius && this.removeRipple(b)
              }
              if ((this.shouldKeepAnimating || 0) !== ripples.length) {
                if (!this._boundAnimate38) this._boundAnimate38 = this.animate.bind(this);
                foregroundPromiseFn().then(this._boundAnimate38);
              } else {
                this.onAnimationComplete();
              }
            }
          }

          console.debug('FIX_paper_ripple_animate')

          // console.log(cProto.animate)

        }

      });

      if (FIX_doIdomRender) {

        const xsetTimeout = function (f, d) {
          if (xsetTimeout.m511 === 1 && !d) {
            xsetTimeout.m511 = 2;
            xsetTimeout.m568 = f;
          } else {
            return setTimeout.apply(window, arguments)
          }

        }

        /**
         *
            IGb = function(a) {
                    var b, c = null == (b = a.requestAninmationFrameResolver) ? void 0 : b.promise;
                    c || (a.requestAninmationFrameResolver = new Vi,
                    c = a.requestAninmationFrameResolver.promise,
                    Da.requestAnimationFrame(function() {
                        var d;
                        null == (d = a.requestAninmationFrameResolver) || d.resolve();
                        a.requestAninmationFrameResolver = null
                    }));
                    return c
                }


         */

        const xrequestAnimationFrame = function (f) {
          const h = `${f}`;
          if (h.startsWith("function(){setTimeout(function(){") && h.endsWith("})}")) {
            let t = null;
            xsetTimeout.m511 = 1;
            f();
            if (xsetTimeout.m511 === 2) {
              t = xsetTimeout.m568;
              xsetTimeout.m568 = null;
            }
            xsetTimeout.m511 = 0;
            if (typeof t === 'function') {
              foregroundPromiseFn().then(t);
            }
          } else if (h.includes("requestAninmationFrameResolver")) {
            foregroundPromiseFn().then(f);
          } else {
            return requestAnimationFrame.apply(window, arguments);
          }
        }

        let busy = false;
        const doIdomRender = function () {

          if (!this) return;
          if (busy) {
            return this.doIdomRender13(...arguments);
          }
          busy = true;
          const { requestAnimationFrame, setTimeout } = window;
          window.requestAnimationFrame = xrequestAnimationFrame;
          window.setTimeout = xsetTimeout;
          let r = this.doIdomRender13(...arguments);
          window.requestAnimationFrame = requestAnimationFrame;
          window.setTimeout = setTimeout;
          busy = false;
          return r;
        };
        for (const ytTag of ['ytd-lottie-player', 'yt-attributed-string', 'yt-image', 'yt-icon-shape', 'yt-button-shape', 'yt-button-view-model', 'yt-icon-badge-shape']) {


          whenCEDefined(ytTag).then(() => {

            let dummy;
            let cProto;
            dummy = document.createElement(ytTag);
            cProto = insp(dummy).constructor.prototype;

            cProto.doIdomRender13 = cProto.doIdomRender;
            cProto.doIdomRender = doIdomRender;

            if (cProto.doIdomRender13 === cProto.templatingFn) cProto.templatingFn = doIdomRender;

            console.debug('[yt-js-engine-tamer] FIX_doIdomRender', ytTag)



          });

        }

      }




      FIX_POPUP_UNIQUE_ID && whenCEDefined('ytd-popup-container').then(async () => {

        const sMap = new Map();

        const ZTa = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        const ZT = function () {
          for (var a = Array(36), b = 0, c, d = 0; d < 36; d++)
            d == 8 || d == 13 || d == 18 || d == 23 ? a[d] = "-" : d == 14 ? a[d] = "4" : (b <= 2 && (b = 33554432 + Math.random() * 16777216 | 0),
              c = b & 15,
              b >>= 4,
              a[d] = ZTa[d == 19 ? c & 3 | 8 : c]);
          return a.join("")
        };


        const popupContainerCollection = document.getElementsByTagName('ytd-popup-container');

        const popupContainer = await observablePromise(() => {
          return popupContainerCollection[0];
        }).obtain();


        let cProto;
        cProto = insp(popupContainer).constructor.prototype;


        if (!cProto || typeof cProto.handleOpenPopupAction !== 'function' || cProto.handleOpenPopupAction3868 || cProto.handleOpenPopupAction.length !== 2) {
          console.log('FIX_POPUP_UNIQUE_ID NG')
          return;
        }
        cProto.handleOpenPopupAction3868 = cProto.handleOpenPopupAction;

        cProto.handleOpenPopupAction = function (a, b) {

          if (typeof (a || 0) === 'object' && !a.__jOdQA__) {

            a.__jOdQA__ = true;

            try {

              const h = this.hostElement;

              if (h instanceof HTMLElement_) {

                const map = h.__skme44__ = h.__skme44__ || new Map();

                let mKey = '';
                const wKey = firstObjectKey(a);
                const wObj = wKey ? a[wKey] : null;
                if (wKey && wObj && typeof (wObj.popup || 0) === 'object') {
                  const pKey = firstObjectKey(wObj.popup)
                  const pObj = pKey ? wObj.popup[pKey] : null;
                  let contentKey = '';
                  let headerKey = '';

                  if (pObj && pObj.identifier && pObj.content && pObj.header) {
                    contentKey = firstObjectKey(pObj.content)
                    headerKey = firstObjectKey(pObj.header)
                  }
                  if (contentKey && headerKey) {

                    mKey = `${wKey}(popupType:${wObj.popupType},popup(${pKey}(content(${contentKey}:...),header(${headerKey}:...),identifer(surface:${pObj.identifier.surface}))))`

                    if (mKey) {

                      if (!wObj.uniqueId) {
                        for (let i = 0; i < 8; i++) {
                          wObj.uniqueId = ZT();
                          if (!sMap.has(wObj.uniqueId)) break;
                        }
                      }
                      const oId = wObj.uniqueId

                      let nId_ = map.get(mKey);
                      if (!nId_) {
                        map.set(mKey, nId_ = oId);
                      }

                      wObj.uniqueId = nId_ || wObj.uniqueId;

                      const nId = wObj.uniqueId

                      sMap.set(oId, nId);
                      sMap.set(nId, nId);

                      wObj.uniqueId = nId;
                      pObj.targetId = nId;
                      pObj.identifier.tag = nId;

                      if (oId !== nId) {
                        console.log('FIX_POPUP_UNIQUE_ID', oId, nId);
                      }

                    }

                  }
                }

                // console.log(12213, mKey, a, b, h)

              }

            } catch (e) {
              console.warn(e)
            }

            try {

              const results = searchNestedObject(a, (x) => {
                if (typeof x === 'string' && x.length === 36) {
                  if (/[a-zA-Z\d]{8}-[a-zA-Z\d]{4}-[a-zA-Z\d]{4}-[a-zA-Z\d]{4}-[a-zA-Z\d]{12}/.test(x)) return true;
                }
                return false;
              });
              for (const [obj, key] of results) {
                const oId = obj[key];
                const nId = sMap.get(oId);
                if (nId) obj[key] = nId;
              }
            } catch (e) {
              console.warn(e)
            }


          }

          return this.handleOpenPopupAction3868(...arguments)
        }

        console.log('FIX_POPUP_UNIQUE_ID OK')


      });


      FIX_TRANSCRIPT_SEGMENTS && !isChatRoomURL && whenCEDefined('yt-formatted-string').then(async () => {

        let dummy;
        let cProto;
        dummy = document.createElement('yt-formatted-string');
        cProto = insp(dummy).constructor.prototype;

        if (!cProto || typeof cProto.setNodeStyle_ !== 'function' || cProto.setNodeStyle17_ || cProto.setNodeStyle_.length !== 2) {
          console.log('FIX_TRANSCRIPT_SEGMENTS(2) NG');
          return;
        }

        cProto.setNodeStyle17_ = cProto.setNodeStyle_;
        cProto.setNodeStyle_ = function (a, b) {
          if (b instanceof HTMLElement_ && typeof (a || 0) === 'object') b.classList.toggle('yt-formatted-string-block-line', !!a.blockLine);
          return this.setNodeStyle17_(a, b);
        }

        console.log('FIX_TRANSCRIPT_SEGMENTS(2) OK');
      });

    });

  });




  if (isMainWindow) {

    console.groupCollapsed(
      "%cYouTube JS Engine Tamer",
      "background-color: #EDE43B ; color: #000 ; font-weight: bold ; padding: 4px ;"
    );



    console.log("Script is loaded.");
    console.log("This script changes the core mechanisms of the YouTube JS engine.");

    console.log("This script is experimental and subject to further changes.");

    console.log("This might boost your YouTube performance.");

    console.log("CAUTION: This might break your YouTube.");


    if (prepareLogs.length >= 1) {
      console.log(" =========================================================================== ");

      for (const msg of prepareLogs) {
        console.log(msg)
      }

      console.log(" =========================================================================== ");
    }

    console.groupEnd();

  }



})();
