// ==UserScript==
// @name        YouTube JS Engine Tamer
// @namespace   UserScripts
// @version     0.20.3
// @match       https://www.youtube.com/*
// @match       https://www.youtube-nocookie.com/embed/*
// @match       https://studio.youtube.com/live_chat*
// @license     MIT
// @author      CY Fung
// @icon        https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/yt-engine.png
// @description To enhance YouTube performance by modifying YouTube JS Engine
// @grant       none
// @require     https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@c2b707e4977f77792042d4a5015fb188aae4772e/library/nextBrowserTick.min.js
// @run-at      document-start
// @unwrap
// @inject-into page
// @allFrames   true
// @exclude     /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// ==/UserScript==

(() => {

  /** @type {WeakMapConstructor} */
  const WeakMap = window.WeakMapOriginal || window.WeakMap;

  const NATIVE_CANVAS_ANIMATION = false; // for #cinematics
  const FIX_schedulerInstanceInstance = 2 | 4;
  const FIX_yt_player = true; // DONT CHANGE
  const FIX_Animation_n_timeline = true;
  const NO_PRELOAD_GENERATE_204 = false;
  const ENABLE_COMPUTEDSTYLE_CACHE = true;
  const NO_SCHEDULING_DUE_TO_COMPUTEDSTYLE = true;
  const CHANGE_appendChild = true; // discussions#236759
  const FIX_bind_self_this = false;　// EXPERIMENTAL !!!!! this affect page switch after live ends
  const FIX_weakMap_weakRef = false; // EXPERIMENTAL !!!!! Might Incompatible to some userscripts (as the strong relationship is removed)

  const FIX_error_many_stack = true; // should be a bug caused by uBlock Origin
  // const FIX_error_many_stack_keepAliveDuration = 200; // ms
  // const FIX_error_many_stack_keepAliveDuration_check_if_n_larger_than = 8;

  const FIX_Iframe_NULL_SRC = false;

  const IGNORE_bindAnimationForCustomEffect = true; // prevent `v.bindAnimationForCustomEffect(this);` being executed

  const FIX_ytdExpander_childrenChanged = true;
  const FIX_paper_ripple_animate = true;
  const FIX_avoid_incorrect_video_meta = true; // omit the incorrect yt-animated-rolling-number
  const FIX_avoid_incorrect_video_meta_emitterBehavior = true;

  const FIX_doIdomRender = true;

  const FIX_Shady = true;

  // [[ 2024.04.24 ]]
  const MODIFY_ShadyDOM_OBJ = true;
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

  const ENABLE_discreteTasking = false; // removed since 0.20.0
  const FIX_stampDomArray_ = true; // changed since 0.20.0
  const FIX_stampDomArray = FIX_stampDomArray_ && typeof WeakRef === "function" && typeof FinalizationRegistry === "function";

  const FIX_perfNow = true; // history state issue; see https://bugzilla.mozilla.org/show_bug.cgi?id=1756970
  const ENABLE_ASYNC_DISPATCHEVENT = false; // problematic

  const FIX_Polymer_dom = true;

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
  // const DO_createStampDomArrayFnE1_ = true; // added in 2025.02.11 - to improve stampDom responsiveness
  // const DO_createStampDomArrayFnE1_noConstraintE = true;
  // const DO_createStampDomArrayFnE1_nativeAppendD = true;
  // const DO_createStampDomArrayFnF1_ = true;
  // const DO_createStampDomArray_STRICT_FULFILLMENT = true; // avoid issues; can be changed to false
  // const DO_createStampDomArray_DEBUG = false;

  const FIX_POPUP_UNIQUE_ID = true; // currently only for channel about popup;

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


  const FIX_DOM_IF_REPEAT = true; // semi-experimental (added in 0.17.0)
  const FIX_DOM_IF_TEMPLATE = true;
  // const FIX_DOM_REPEAT_TEMPLATE = true; // to be implemented
  const FIX_DOM_IFREPEAT_RenderDebouncerChange = false; // semi-experimental (added in 0.17.0) // found buggy for chat ticker sizing
  const DEBUG_DBR847 = false;
  const DEBUG_xx847 = false;
  const FIX_DOM_IFREPEAT_RenderDebouncerChange_SET_TO_PROPNAME = true; // default true. false might be required for future change
  const DEBUG_renderDebounceTs = false;

  const FIX_ICON_RENDER = true;

  const FIX_VIDEO_PLAYER_MOUSEHOVER_EVENTS = true; // avoid unnecessary reflows due to cursor moves on the web player.

  /*

  FIX_DOM_IFREPEAT_RenderDebouncerChange

  avoid Polymer.flush
   // https://www.youtube.com/s/desktop/26a583e4/jsbin/live_chat_polymer.vflset/live_chat_polymer.js

    var Is = function() {
        do {
            var a = window.ShadyDOM && ShadyDOM.flush();
            window.ShadyCSS && window.ShadyCSS.ScopingShim && window.ShadyCSS.ScopingShim.flush();
            var b = NNa()
        } while (a || b)
    };

    , NNa = function() {
        var a = !!ts.size;
        ts.forEach(function(b) {
            try {
                b.flush()
            } catch (c) {
                setTimeout(function() {
                    throw c
                })
            }
        });
        return a
    };

    // why flush twice after all ts are completed? (!!ts.size => true => loop again)
    // this coding logic should be incorrect (mistake).

  */



  // ----------------------------- Shortkey Keyboard Control -----------------------------
  // dependency: FIX_yt_player

  const FIX_SHORTCUTKEYS = 2; // 0 - no fix; 1 - basic fix; 2 - advanced fix
  // [0] no fix - not recommended
  // [1] basic fix - just fix the global focus detection variable
  // [2] advanced fix - call the shortcut actions directly, auto foucs change, direct control of spacebar behavior, etc
  // (note) 0 or 1 if you find conflict with other userscripts/plugin

  const CHANGE_SPEEDMASTER_SPACEBAR_CONTROL = 0; // 0 - disable; 1 - force true; 2 - force false
  const USE_IMPROVED_PAUSERESUME_UNDER_NO_SPEEDMASTER = true; // only for SPEEDMASTER = false & FIX_SHORTCUTKEYS = 2

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

  let ttpHTML = (s) => {
    ttpHTML = s => s;
    if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
      let s = s => s;
      trustedTypes.createPolicy('default', { createHTML: s, createScriptURL: s, createScript: s });
    }
    return s;
  }


  const HTMLElement_ = HTMLElement;
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


  function getTranslate() {

    pLoad.then(() => {

      let nonce = document.querySelector('style[nonce]');
      nonce = nonce ? nonce.getAttribute('nonce') : null;
      const st = document.createElement('style');
      if (typeof nonce === 'string') st.setAttribute('nonce', nonce);
      st.textContent = ".yt-formatted-string-block-line{display:block;}";
      let parent;
      if (parent = document.head) parent.appendChild(st);
      else if (parent = (document.body || document.documentElement)) parent.insertBefore(st, parent.firstChild);

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

    // const fnProxySelf = function (...args) {
    //   if (args[0] === smb) return this;
    //   const cnt = kRef(this.ref);
    //   if (cnt) {
    //     if (typeof cnt[this.prop] !== 'function') console.error(`this.${this.prop} is not a function. [${cnt.is || 'nil'}]`)
    //     return cnt[this.prop](...args); // might throw error
    //   }
    // }
    // fnProxySelf.bind588 = fnProxySelf.bind;
    // const pFnHandler = {
    //   get(target, prop){
    //     if(prop === 'bind588') return 2;
    //     const fnThis = target(smb);
    //     if (fnThis && fnThis.prop && fnThis.ref) {
    //       const cnt = kRef(fnThis.ref || null) || null;
    //       if (cnt) {
    //         const h = cnt[fnThis.prop];
    //         const v = h[prop];
    //         if (typeof v === 'function'){
    //           if(typeof h === 'function'){
    //             if (prop === 'call' || prop === 'bind' || prop === 'bind588' || prop === 'bind488' || prop === 'apply') {
    //               if(h.bind588 === 1){
    //                 const g = function(...args){
    //                   console.log(1288, this)
    //                   return h.call(this, ...args);
    //                 };
    //                 console.log(399, g)
    //                 return g[prop];
    //                 // console.log(12778)
    //                 // console.log(target, target.call)
    //                 // return target[prop];
    //               }
    //               // independent of this
    //               return v; // function.bind, function.call, function.apply
    //             }
    //           }
    //           console.warn('cnt[fnThis.prop][prop] is function; might rely on this', { prop, fProp: fnThis.prop, is: cnt.is, h: h });

    //           // return new Proxy(fnProxySelf.bind588({ prop: prop, ref: new WeakRef(cnt[fnThis.prop]) }), pFnHandler);
    //         }
    //         return v;
    //       }
    //     }
    //   },
    //   set(target, prop, value) {
    //     const fnThis = target(smb);
    //     if (fnThis && fnThis.prop && fnThis.ref) {
    //       const cnt = kRef(fnThis.ref || null) || null;
    //       if (cnt) {
    //         const h = cnt[fnThis.prop];
    //         if (h) {
    //           h[prop] = value;
    //         } else {
    //           console.log('h is nout found', { prop, fProp: fnThis.prop, is: cnt.is, h: h });
    //         }
    //       }
    //     }
    //     return true;
    //   }
    // };

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


  if (FIX_weakMap_weakRef && !window.WeakMapOriginal && typeof window.WeakMap === 'function' && typeof WeakRef === 'function') {
    const WeakMapOriginal = window.WeakMapOriginal = window.WeakMap;
    const wm6 = new WeakMapOriginal();

    const skipW = new WeakSet();


    window.WeakMap = class WeakMap extends WeakMapOriginal {
      constructor(iterable = undefined) {
        super();
        if (iterable && iterable[Symbol.iterator]) {
          for (const entry of iterable) {
            entry && this.set(entry[0], entry[1]);
          }
        }
      }
      delete(a) {
        if (!this.has(a)) return false;
        super.delete(a);
        return true;
      }
      get(a) {
        const p = super.get(a);
        if (p && typeof p === 'object' && p.deref && !skipW.has(p)) {
          let v = kRef(p);
          if (!v) {
            super.delete(a);
          }
          return v || undefined;
        }
        return p;
      }
      has(a) {
        if (!super.has(a)) return false;
        const p = super.get(a);
        if (p && typeof p === 'object' && p.deref && !skipW.has(p)) {
          if (!kRef(p)) {
            super.delete(a);
            return false;
          }
        }
        return true;
      }
      set(a, b) {
        let wq = b;
        if (b && (typeof b === 'function' || typeof b === 'object')) {
          if (b.deref) {
            skipW.add(b);
            wq = b;
          } else {
            wq = wm6.get(b);
            if (!wq) {
              wq = mWeakRef(b);
              wm6.set(b, wq);
            }
          }
        }
        super.set(a, wq);
        return this;
      }
    }
    Object.defineProperty(window.WeakMap, Symbol.toStringTag, {
      configurable: true,
      enumerable: false,
      value: "WeakMap",
      writable: false
    });
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

  FIX_removeChild && (() => {
    if (typeof Node.prototype.removeChild === 'function' && typeof Node.prototype.removeChild062 !== 'function') {
      Node.prototype.removeChild062 = Node.prototype.removeChild;
      Node.prototype.removeChild = function (child) {
        if (typeof this.__shady_native_removeChild !== 'function' || ((child instanceof Node) && child.parentNode === this)) {
          this.removeChild062(child);
        } else if ((child instanceof Element) && child.is === 'tp-yt-paper-tooltip') {
          // tooltip bug
        } else {
          console.warn('[yt-js-engine-tamer] Node is not removed from parent', { parent: this, child: child })
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
    HTMLElement.prototype.addEventListener4882 = HTMLElement.prototype.addEventListener;
    HTMLElement.prototype.addEventListener = function (a, b, c) {
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




    HTMLElement.prototype.removeEventListener4882 = HTMLElement.prototype.removeEventListener;
    HTMLElement.prototype.removeEventListener = function (a, b, c) {
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

    let cme = 0;

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

    if (FIX_DOM_IFREPEAT_RenderDebouncerChange) {

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


      let p = 0;
      qp = observablePromise(() => {
        if (!(p & 1)) {

          if (window.ShadyDOM && ShadyDOM.flush) {
            p |= 1;
            if (!ShadyDOM.flush847) {

              ShadyDOM.flush847 = ShadyDOM.flush;
              ShadyDOM.flush = function () {

                DEBUG_xx847 && console.log('xx847 ShadyDOM.flush')
                renderDebouncePromise && Promise.resolve().then(() => {
                  if (renderDebouncePromise) {

                    renderDebouncePromise && renderDebouncePromise.resolve();
                    renderDebouncePromise = null;

                    DEBUG_DBR847 && console.log('__DBR847__ renderDebouncePromise.resolve by ShadyDOM.flush')

                  }

                });
                let r = this.flush847(...arguments);
                if (r) {
                  document.documentElement.setAttribute('nw3a24np', (cme = (cme % 511 + 1)));
                }
                return r
              }

            }
          }
        }

        if (!(p & 2)) {

          if (window.ShadyCSS && window.ShadyCSS.ScopingShim && window.ShadyCSS.ScopingShim.flush) {
            p |= 2;
            const ScopingShim = window.ShadyCSS && window.ShadyCSS.ScopingShim;
            if (!ScopingShim.flush848) {

              ScopingShim.flush848 = ScopingShim.flush;
              ScopingShim.flush = function () {

                DEBUG_xx847 && console.log('xx847 ScopingShim.flush')

                renderDebouncePromise && Promise.resolve().then(() => {

                  if (renderDebouncePromise) {

                    renderDebouncePromise && renderDebouncePromise.resolve();
                    renderDebouncePromise = null;

                    DEBUG_DBR847 && console.log('__DBR847__ renderDebouncePromise.resolve by ScopingShim.flush')



                  }

                });
                return this.flush848(...arguments);
              }

            }
          }
        }
        if (p === 3) {
          p |= 8;

          let r = (window.ShadyDOM && ShadyDOM.flush && ShadyDOM.flush847
            && window.ShadyCSS && window.ShadyCSS.ScopingShim &&
            window.ShadyCSS.ScopingShim.flush && window.ShadyCSS.ScopingShim.flush848);

          if (r) {
            let w = Set.prototype.add;
            let u = null;
            Set.prototype.add = function () {
              u = this;
              throw new Error();
            }
            try {
              Polymer.enqueueDebouncer()
            } catch (e) { }
            Set.prototype.add = w;
            if (u !== null) {
              renderDebounceTs = u;
              if (DEBUG_renderDebounceTs) {
                renderDebounceTs.add58438 = renderDebounceTs.add;
                renderDebounceTs.add = function () {
                  console.log('renderDebounceTs.add')
                  console.log(traceStack((new Error()).stack))
                  // debugger;
                  return this.add58438(...arguments)
                }

                renderDebounceTs.delete58438 = renderDebounceTs.delete;
                renderDebounceTs.delete = function () {
                  console.log('renderDebounceTs.delete')
                  const stack = `${(new Error()).stack}`
                  let isCallbackRemoval = false;
                  if (stack) {
                    let t = stack.replace(/[^\r\n]+renderDebounceTs\.delete[^\r\n]+/, '').replace('://','');
                    const s = t.split(':');
                    if (s.length === 3 && +s[1] > 0 && +s[2] > 0) {
                      isCallbackRemoval = true;
                    }
                  }
                  if (isCallbackRemoval) {
                    return this.delete58438(...arguments)
                  }
                  console.log(traceStack((new Error()).stack))
                  // debugger;
                  return this.delete58438(...arguments)
                }
              }
              DEBUG_renderDebounceTs && (window.renderDebounceTs = renderDebounceTs);
              console.log('renderDebounceTs', renderDebounceTs, `debug=${DEBUG_renderDebounceTs}`);
            }
          }

          return true;
        }
      })

      // if(window.ShadyDOM && ShadyDOM.flush){
      //   console.log('FIX_DOM_IF_RenderDebouncerChange X1')

      // }
      // if(window.ShadyCSS && window.ShadyCSS.ScopingShim && window.ShadyCSS.ScopingShim.flush){

      //   console.log('FIX_DOM_IF_RenderDebouncerChange X2')
      // }

      // console.log('FIX_DOM_IF_RenderDebouncerChange X3')

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
            if (FIX_DOM_IF_TEMPLATE && !cProto.__ensureTemplate847 && typeof cProto.__ensureTemplate === 'function' && cProto.__ensureTemplate.length === 0 && this instanceof HTMLElement && `${cProto.__ensureTemplate}`.length > 20) {
              // note that "_templateInfo" diffs the different version of DOM-IF

              cProto.__ensureTemplate847 = cProto.__ensureTemplate;
              cProto.__ensureTemplate = function () {
                if (!(this instanceof HTMLElement) || arguments.length > 0) return this.__ensureTemplate847(...arguments);
                if (!this.__template) {
                  let b;
                  if (this._templateInfo) {
                    b = this;
                  } else {
                    if (!this.__templateCollection011__) this.__templateCollection011__ = this.getElementsByTagName('template');
                    b = this.__templateCollection011__[0];
                    if (!b) {
                      let a = mWeakRef(this);
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


            // if(!cProto.__createAndInsertInstance847 && typeof cProto.__createAndInsertInstance === 'function' && cProto.__createAndInsertInstance.length === 1 && `${cProto.__createAndInsertInstance}`.length >20){

            //   cProto.__createAndInsertInstance847 = cProto.__createAndInsertInstance;

            //   cProto.__createAndInsertInstance = function (a) {
            //     Promise.resolve().then(()=>{
            //       console.log('__createAndInsertInstance')
            //       window.lm5 = window.lm5 || [];
            //       window.lm5.push([mWeakRef(this), mWeakRef(this.__instance)])
            //     });
            //     return this.__createAndInsertInstance847(a);
            //   }

            // }


            // if(!cProto._bindTemplate847 && typeof cProto._bindTemplate === 'function' && cProto._bindTemplate.length === 2){

            //   cProto._bindTemplate847 = cProto._bindTemplate;

            //   cProto._bindTemplate = function (a, b) {
            //     return this._bindTemplate847(kRef(a), b); // might throw Error as a -> null inside _bindTemplate847
            //   }

            // }
            // if(!cProto._stampTemplate847 && typeof cProto._stampTemplate === 'function' && cProto._stampTemplate.length === 2){

            //   cProto._stampTemplate847 = cProto._stampTemplate;

            //   cProto._stampTemplate = function (a, b) {
            //     return this._stampTemplate847(kRef(a), b); // might throw Error as a -> null inside _stampTemplate847
            //   }

            // }
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
          if (FIX_DOM_IFREPEAT_RenderDebouncerChange) {
            f();
            Promise.resolve().then(f);
            // afterward, don't care adding fn directly (the fn is already modified)
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
          if (FIX_DOM_IFREPEAT_RenderDebouncerChange && !cProto.__debounceRender847 && typeof cProto.__debounceRender === 'function' && !(`${cProto.__debounceRender}`.includes("{}"))) {

            cProto.__debounceRender847 = cProto.__debounceRender;

            if (cProto.__debounceRender.length === 2) {

              cProto.__debounceRender = function (a, b) {

                if (!renderDebounceTs) return this.__debounceRender847(a, b);

                b = b === void 0 ? 0 : b;

                /*
                        b = b === void 0 ? 0 : b;
                        this.__renderDebouncer = us(this.__renderDebouncer, b > 0 ? Rr.after(b) : Tr, a.bind(this));
                        vs(this.__renderDebouncer)
                */

                this.__DBR848__ = this.__DBR848__ || `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;

                if (!renderDebouncePromise) {
                  renderDebouncePromise = new PromiseExternal();
                  document.documentElement.setAttribute('nw3a24np', (cme = (cme % 511 + 1)));
                }

                renderDebouncePromise.then(async () => {
                  if (b > 0) await delayPn(b);

                  const f = this.__dsIRYqw1__;
                  if (f === cme) return;
                  this.__dsIRYqw1__ = cme;
                  a.call(this);
                  DEBUG_DBR847 && console.log(`__DBR847__ done 01 (delay=${b})`, this.__DBR848__)

                });

                DEBUG_DBR847 && console.log(`__DBR847__ add 01 (delay=${b})`, this.__DBR848__)
              }

            } else if (cProto.__debounceRender.length === 0) {


              cProto.__debounceRender = function () {

                if (!renderDebounceTs) return this.__debounceRender847();

                this.__DBR848__ = this.__DBR848__ || `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
                /*
                        var a = this;
                        this.__renderDebouncer = us(this.__renderDebouncer, Tr, function() {
                            return a.__render()
                        });
                        vs(this.__renderDebouncer)
                */

                if (!renderDebouncePromise) {
                  renderDebouncePromise = new PromiseExternal();
                  document.documentElement.setAttribute('nw3a24np', (cme = (cme % 511 + 1)));
                }
                renderDebouncePromise.then(() => {
                  const f = this.__dsIRYqw1__;
                  if (f === cme) return;
                  this.__dsIRYqw1__ = cme;
                  this.__render()
                  DEBUG_DBR847 && console.log('__DBR847__ done 02', this.__DBR848__)
                });
                DEBUG_DBR847 && console.log('__DBR847__ add 02', this.__DBR848__)


              }
            }
          }



          // if(FIX_DOM_IFREPEAT_RenderDebouncerChange && !cProto.render847 && typeof cProto.render === 'function' && cProto.render.length === 0 && !(`${cProto.render}`.includes("{}"))){
          //   cProto.render847 = cProto.render;
          //   cProto.render = function(){

          //     this.__DBR848__ = this.__DBR848__ || `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
          //     try{
          //       this.render847();
          //     }catch(e){}
          //     // if(this.__DBR847__){
          //     //   this.__DBR847__.resolve();
          //     //   DEBUG_DBR847 && console.log('__DBR847__ resolve', this.__DBR848__)
          //     // }

          //     // renderDebouncePromise && renderDebouncePromise.resolve()
          //     // renderDebouncePromise = null;
          //     // DEBUG_DBR847 && console.log('__DBR847__ renderDebouncePromise.resolve by render', this.__DBR848__)

          //   }
          //   console.log('FIX_DOM_IF - render', `${cProto.render847}`, cProto.render847)
          // }

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

  let xdeadc00 = null; // a deteched node with __domApi

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
    return xdeadc00;
  }

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



      // if (!sdwProto.__nodeMove__) {

      //   sdwProto.__nodeMove__ = function (dest) {


      //   }


      // }




      // debugger;
      // new xdeadc.__domApi.constructor(document.createElement('div'));
    }

  }
  const setupDomApi = (daProto) => {

    daProto.__daHook377__ = true;



  }


  // WEAKREF_ShadyDOM

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

    const selfWrKey = Symbol();

    const weakWrapperNodeHandlerFn = () => ({
      get() {
        const wv = this[selfWrKey];
        if (typeof wv === 'undefined') return undefined;
        let node = kRef(wv);
        if (!node) this[selfWrKey] = undefined;
        return node || undefined;
        // let w = shadyDOMNodeWRM.get(this);
        // if (typeof w === 'object') w = kRef(w) || (shadyDOMNodeWRM.delete(this), undefined);
        // return w;
      },
      set(nv) {
        const wv = (nv[selfWrKey] || (nv[selfWrKey] = mWeakRef(nv)));
        this[selfWrKey] = wv;
        return true;
      },
      enumerable: true,
      configurable: true
    });

    /*
    const weakWrapperNodeHandlerFn = () => ({
      get() {
        let w = shadyDOMNodeWRM.get(this);
        if (typeof w === 'object') w = kRef(w) || (shadyDOMNodeWRM.delete(this), undefined);
        return w;
      },
      set(nv) {
        const wv = (nv[selfWrKey] || (nv[selfWrKey] = mWeakRef(nv)));
        shadyDOMNodeWRM.set(this, wv);
        return true;
      },
      enumerable: true,
      configurable: true
    });
    */

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
        
        // Object.defineProperty(ShadyDOM.Wrapper.prototype, '__cleanup__', function(){
        //   // to be reviewed
        //   debugger;




        // });


      }
      if (typeof (((ShadyDOM || 0).Wrapper || 0).prototype || 0) === 'object') {
        try {
          setupSDomWrapper();
        } catch (e) { }
      }

    }

    let previousWrapStore = null;

    const standardWrap = function (a) {
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
            if (!(t instanceof HTMLElement)) {
              console.log(3719, '[yt-js-engine-tamer] (OMIT_ShadyDOM&2) composedPath', t)
            }
            return t instanceof HTMLElement ? [t] : [];
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
      Object.setPrototypeOf(eukElm, HTMLElement.prototype);
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

  const { pageMediaWatcher, shortcutKeysFixer, keyboardController } = (() => {

    let p_a_objWR = null;
    let isSpaceKeyImmediate = false; // for ADVANCED_FIX_SHORTCUTKEYS
    let ytPageReady = 0;

    let isSpeedMastSpacebarControlEnabled = false; // youtube experimental feature // can be forced by CHANGE_SPEEDMASTER_SPACEBAR_CONTROL
    let isGlobalSpaceControl = true;
    let mediaPlayerElementWR = null;
    let focusedElementAtSelection = null;

    // let want_control_video = false;

    let spaceBarControl_keyG = '';

    let lastUserAction = 0;

    const wmKeyControlPhase = new WeakMap();

    let currentSelectionText = null;

    const getCurrentSelectionText = () => {
      if (currentSelectionText !== null) return currentSelectionText
      return (currentSelectionText = `${getSelection()}`)
    }

    const pageMediaWatcher = () => {

      // CAN_TUNE_VOLUMN_AFTER_RESUME_OR_PAUSE && document.addEventListener('wheel', () => {
      //   want_control_video = false;
      // }, { capture: true, passive: true });

      document.addEventListener('yt-navigate', () => {
        ytPageReady = 0;
      });
      document.addEventListener('yt-navigate-start', () => {
        ytPageReady = 0;
      });
      document.addEventListener('yt-navigate-cache', () => {
        ytPageReady = 0;
      });

      document.addEventListener('yt-navigate-finish', () => {
        ytPageReady = 1;
      });

      document.addEventListener('durationchange', () => {
        for (const elm of document.querySelectorAll('#movie_player video[src], #movie_player audio[src]')) {
          if (elm.duration > 0.01) {
            if (elm.closest('[hidden]')) continue;
            mediaPlayerElementWR = mWeakRef(elm);
            return;
          }
        }
      }, { capture: true, passive: true });

      document.addEventListener('selectionchange', (evt) => {
        if (!evt || !evt.isTrusted || !(evt instanceof Event)) return;
        currentSelectionText = null;
        if (!(evt.target instanceof Node)) return;
        focusedElementAtSelection = evt.target;
      }, { capture: true, passive: true })

      document.addEventListener('pointerdown', (evt) => {
        if (evt.isTrusted && evt instanceof Event) lastUserAction = Date.now();
      }, { capture: true, passive: true });


      document.addEventListener('pointerup', (evt) => {
        if (evt.isTrusted && evt instanceof Event) lastUserAction = Date.now();
      }, { capture: true, passive: true });


      document.addEventListener('keydown', (evt) => {
        if (evt.isTrusted && evt instanceof Event) lastUserAction = Date.now();
      }, { capture: true, passive: true });

      document.addEventListener('keyup', (evt) => {
        if (evt.isTrusted && evt instanceof Event) lastUserAction = Date.now();
      }, { capture: true, passive: true });

    };


    const checkKeyB = (p_a_obj) => {

      const boolList = new Set();
      const p_a_obj_api = p_a_obj.api;

      const nilFunc0 = function () {
        return void 0
      };
      const mt = new Proxy({}, {
        get(target, prop) {
          if (prop === 'get') return nilFunc0;
          return mt;
        }
      });
      const nilFunc = function () {
        return mt
      };
      const mw = new Proxy({}, {
        get(target, prop) {
          if (prop in p_a_obj_api) {
            if (typeof p_a_obj_api.constructor.prototype[prop] === 'function') return nilFunc;
            let q = Object.getOwnPropertyDescriptor(p_a_obj_api, prop);
            if (q && q.value) {
              if (!q.writable) return q.value;
              if (typeof q.value === 'string') return '';
              if (typeof q.value === 'number') return 0;
              if (typeof q.value === 'boolean') return false;
              if (q.value && typeof q.value === 'object') return {};
            }
          }
          return undefined;
        },
        set(target, prop) {
          throw 'mwSet';
        }
      });

      const mq = new Proxy({}, {
        get(target, prop) {
          if (prop === 'api') return mw;
          if (prop in p_a_obj) {
            if (typeof p_a_obj.constructor.prototype[prop] === 'function') return nilFunc;
            let q = Object.getOwnPropertyDescriptor(p_a_obj, prop);
            if (q && q.value) {
              if (!q.writable) return q.value;
              if (typeof q.value === 'string') return '';
              if (typeof q.value === 'number') return 0;
              if (typeof q.value === 'boolean') return false;
              if (q.value && typeof q.value === 'object') return {};
            }
          }
          return undefined;
        },
        set(target, prop, val) {
          if (typeof val === 'boolean') boolList.add(prop)
          throw `mqSet(${prop},${val})`;
        }
      });

      let res = ''
      try {
        res = `RESULT::${p_a_obj.handleGlobalKeyUp.call(mq, 9, false, false, false, false, "Tab", "Tab")}`;
      } catch (e) {
        res = `ERROR::${e}`;
      }

      if (boolList.size === 1) {
        const value = boolList.values().next().value;
        if (res === `ERROR::mqSet(${value},${true})`) {
          p_a_obj.__uZWaD__ = value;
        }
      }

      console.log('[yt-js-engine-tamer] global shortcut control', { '__uZWaD__': p_a_obj.__uZWaD__ });

    }


    let pm_p_a = null;

    const p_a_init = function () {
      const r = this.init91();
      const keyBw = this.__cPzfo__ || '__NIL__';
      const p_a_obj = this[keyBw];
      if (!p_a_obj) return;
      try {
        checkKeyB(p_a_obj);
      } catch (e) { }
      p_a_objWR = mWeakRef(p_a_obj);
      if (FIX_SHORTCUTKEYS > 0) {
        if (p_a_obj && !p_a_obj.hVhtg) {
          p_a_obj.hVhtg = 1;

          p_a_obj.handleGlobalKeyUp91 = p_a_obj.handleGlobalKeyUp;
          p_a_obj.handleGlobalKeyUp = p_a_xt.handleGlobalKeyUp;
          p_a_obj.handleGlobalKeyDown91 = p_a_obj.handleGlobalKeyDown;
          p_a_obj.handleGlobalKeyDown = p_a_xt.handleGlobalKeyDown;
          p_a_obj.__handleGlobalKeyBefore__ = p_a_xt.__handleGlobalKeyBefore__;
          p_a_obj.__handleGlobalKeyAfter__ = p_a_xt.__handleGlobalKeyAfter__;

        }
        // if (CAN_TUNE_VOLUMN_AFTER_RESUME_OR_PAUSE && p_a_obj && p_a_obj.api && !p_a_obj.api.hVhtg) {
        //   const api = p_a_obj.api
        //   api.hVhtg = 1;
        //   api.playVideo91 = api.playVideo;
        //   api.playVideo = p_a_jt.playVideo;
        //   api.pauseVideo91 = api.pauseVideo;
        //   api.pauseVideo = p_a_jt.pauseVideo;
        // }
      }
      if (pm_p_a) {
        pm_p_a.resolve();
        pm_p_a = null;
      }
      return r;
    };

    const p_a_xt = {

      __handleGlobalKeyBefore__(a, b, c, d, e, f, h, activeElement) {

        if (FIX_SHORTCUTKEYS === 2) {

          // if (flagSpeedMaster !== false && !getGlobalSpacebarControlFlag()) return false;

          if (activeElement) {

            const controlPhaseCache = wmKeyControlPhase.get(activeElement);

            if (controlPhaseCache === 6 && getCurrentSelectionText() !== "") void 0;
            else if (controlPhaseCache === 1 || controlPhaseCache === 2 || controlPhaseCache === 5) return false;
            else if ((controlPhaseCache !== 6 || focusedElementAtSelection === document.activeElement) && getCurrentSelectionText() !== "") return false;

          }

          const isSpaceBar = a === 32 && b === false && c === false && d === false && e === false && f === ' ' && h === 'Space';
          const isDelayedSpaceBar = FIX_SHORTCUTKEYS === 2 && isSpaceBar && !isSpaceKeyImmediate && (isSpeedMastSpacebarControlEnabled = getSpeedMasterControlFlag());
          // console.log(582, isDelayedSpaceBar)
          if (isDelayedSpaceBar) return void 0; // accept delay spacebar under isSpeedMastSpacebarControlEnabled (no rejection)

          if (activeElement && (h === 'Space' || h === 'Enter')) {
            const controlPhase = wmKeyControlPhase.get(activeElement);
            if (controlPhase === 4 || controlPhase === 5) return false;
          }
          if (focusedElementAtSelection === activeElement && getCurrentSelectionText() !== "") return false;
          // if (!isSpeedMastSpacebarControlEnabled && a === 32 && b === false && c === false && d === false && e === false && f === ' ' && h === 'Space') {
          //   if (!isSpaceKeyImmediate) return false;
          // }
        }

      },

      __handleGlobalKeyAfter__(a, b, c, d, e, f, h, activeElement, ret) {

        if (FIX_SHORTCUTKEYS === 2 && ret && a >= 32 && ytPageReady === 1 && Date.now() - lastUserAction < 40 && activeElement === document.activeElement) {

          const isSpaceBar = a === 32 && b === false && c === false && d === false && e === false && f === ' ' && h === 'Space';
          const isDelayedSpaceBar = FIX_SHORTCUTKEYS === 2 && isSpaceBar && !isSpaceKeyImmediate && (isSpeedMastSpacebarControlEnabled = getSpeedMasterControlFlag());
          // console.log(583, isDelayedSpaceBar)
          if (isDelayedSpaceBar) return void 0; // accept delay spacebar under isSpeedMastSpacebarControlEnabled (no rejection)

          const mediaPlayerElement = kRef(mediaPlayerElementWR);

          let mediaWorking = false;
          if (mediaPlayerElement && (mediaPlayerElement.readyState === 4 || mediaPlayerElement.readyState === 1) && mediaPlayerElement.networkState === 2 && mediaPlayerElement.duration > 0.01) {
            mediaWorking = true;
          } else if (mediaPlayerElement && !mediaPlayerElement.paused && !mediaPlayerElement.muted && mediaPlayerElement.duration > 0.01) {
            mediaWorking = true;
          }
          // console.log(182, mediaWorking, mediaPlayerElement.readyState , mediaPlayerElement.networkState)
          mediaWorking && Promise.resolve().then(() => {
            if (activeElement === document.activeElement) {
              return activeElement.blur()
            } else {
              return false
            }
          }).then((r) => {
            r !== false && mediaPlayerElement.focus();
          });
        }
      },


      handleGlobalKeyUp(a, b, c, d, e, f, h) {

        if (BY_PASS_KEYBOARD_CONTROL) return this.handleGlobalKeyUp91(a, b, c, d, e, f, h);

        const activeElement = document.activeElement;

        const allow = typeof this.__handleGlobalKeyBefore__ === 'function' ? this.__handleGlobalKeyBefore__(a, b, c, d, e, f, h, activeElement) : void 0;
        if (allow === false) return false;

        const ret = this.handleGlobalKeyUp91(a, b, c, d, e, f, h);
        // console.log('handleGlobalKeyUp',ret, a, b, c, d, e, f, h);

        typeof this.__handleGlobalKeyAfter__ === 'function' && this.__handleGlobalKeyAfter__(a, b, c, d, e, f, h, activeElement, ret);

        return ret;
      },
      handleGlobalKeyDown(a, b, c, d, e, f, h, l) {


        if (BY_PASS_KEYBOARD_CONTROL) return this.handleGlobalKeyDown91(a, b, c, d, e, f, h, l);

        const activeElement = document.activeElement;
        // if (a === 32 && b === false && c === false && d === false && e === false && f === ' ' && h === 'Space' && !(isSpeedMastSpacebarControlEnabled = getSpeedMasterControlFlag())) {
        //   return this.handleGlobalKeyDown91(a, b, c, d, e, f, h, l);
        // }
        const allow = typeof this.__handleGlobalKeyBefore__ === 'function' ? this.__handleGlobalKeyBefore__(a, b, c, d, e, f, h, activeElement) : void 0;
        if (allow === false) return false;

        const ret = this.handleGlobalKeyDown91(a, b, c, d, e, f, h, l);
        // console.log('handleGlobalKeyDown',ret, a, b, c, d, e, f, h,l)

        typeof this.__handleGlobalKeyAfter__ === 'function' && this.__handleGlobalKeyAfter__(a, b, c, d, e, f, h, activeElement, ret);

        return ret;
      }

    };

    // const p_a_jt = { // API

    //   playVideo(a) { // without spinner effect

    //     if (CAN_TUNE_VOLUMN_AFTER_RESUME_OR_PAUSE) {

    //       const mediaPlayerElement = kRef(mediaPlayerElementWR);
    //       if (mediaPlayerElement && !mediaPlayerElement.paused && !mediaPlayerElement.muted && mediaPlayerElement.duration > 0.01) {
    //         want_control_video = true;
    //         // Promise.resolve().then(()=> mediaPlayerElement.focus() );
    //       }

    //     }
    //     return this.playVideo91(a);

    //   },

    //   pauseVideo(a) { // without spinner effect

    //     if (CAN_TUNE_VOLUMN_AFTER_RESUME_OR_PAUSE) {

    //       const mediaPlayerElement = kRef(mediaPlayerElementWR);
    //       if (mediaPlayerElement && mediaPlayerElement.paused && !mediaPlayerElement.muted && mediaPlayerElement.duration > 0.01) {
    //         want_control_video = true;
    //         // Promise.resolve().then(()=> mediaPlayerElement.focus() );
    //       }

    //     }
    //     return this.pauseVideo91(a);

    //   }
    // };

    let flagSpeedMaster = null;
    const getSpeedMasterControlFlag = () => {

      const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;
      isSpeedMastSpacebarControlEnabled = false;
      if (config && config.EXPERIMENT_FLAGS && config.EXPERIMENT_FLAGS.web_speedmaster_spacebar_control) {
        isSpeedMastSpacebarControlEnabled = true;
      }
      if (config && config.EXPERIMENTS_FORCED_FLAGS && config.EXPERIMENTS_FORCED_FLAGS.web_speedmaster_spacebar_control) {
        isSpeedMastSpacebarControlEnabled = true;
      }

      if (flagSpeedMaster === null) {
        const p = (((config || 0).WEB_PLAYER_CONTEXT_CONFIGS || 0).WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH || 0).serializedExperimentFlags;
        if (!p) {
          flagSpeedMaster = false;
        } else {

          flagSpeedMaster = (p.includes('web_enable_speedmaster=true') && p.includes('web_speedmaster_spacebar_control=true') && p.includes('web_speedmaster_updated_edu=true'));

        }

      }
      if (!flagSpeedMaster) isSpeedMastSpacebarControlEnabled = false;

      return isSpeedMastSpacebarControlEnabled;
    }


    const getGlobalSpacebarControlFlag = () => {

      const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;
      isGlobalSpaceControl = false;
      if (config && config.EXPERIMENT_FLAGS && config.EXPERIMENT_FLAGS.global_spacebar_pause) {
        isGlobalSpaceControl = true;
      }
      if (config && config.EXPERIMENTS_FORCED_FLAGS && config.EXPERIMENTS_FORCED_FLAGS.global_spacebar_pause) {
        isGlobalSpaceControl = true;
      }

      return isGlobalSpaceControl;
    }

    const keyboardController = async (_yt_player) => {

      const keyQT = getQT(_yt_player);
      const keySV = getSV(_yt_player);
      const keyDX = getDX(_yt_player);
      console.log(`[QT,SV,DX]`, [keyQT, keySV, keyDX]);

      if (!keyDX) return;
      if (keyDX === keyQT || keyDX === keySV) return;

      if (typeof keyDX !== 'string') return;

      let lastAccessKey = '';
      let lastAccessKeyConfirmed = '';
      const mb = new Proxy({}, {
        get(target, prop) {
          if (prop === 'handleGlobalKeyUp') lastAccessKeyConfirmed = lastAccessKey;
          throw 'mbGet'
        },
        set(target, prop, val) {
          throw 'mbSet'
        }
      });
      const ma = new Proxy({}, {
        get(target, prop) {
          lastAccessKey = prop;
          return mb
        },
        set(target, prop, val) {
          throw 'maSet'
        }
      });

      let keyBw = '';
      try {
        _yt_player[keyDX].prototype.handleGlobalKeyUp.call(ma);
      } catch (e) {
        if (e === 'mbGet' && typeof lastAccessKeyConfirmed === 'string' && lastAccessKeyConfirmed.length > 0) {
          keyBw = lastAccessKeyConfirmed;
        }
      }

      if (!keyBw) return;

      if (typeof _yt_player[keyDX].prototype.init !== 'function' || _yt_player[keyDX].prototype.init.length !== 0) return;

      pm_p_a = new PromiseExternal();

      _yt_player[keyDX].prototype.__cPzfo__ = keyBw;

      _yt_player[keyDX].prototype.init91 = _yt_player[keyDX].prototype.init;

      _yt_player[keyDX].prototype.init = p_a_init;

      await pm_p_a.then();
      const p_a_obj = kRef(p_a_objWR);

      const isSpeedMastSpacebarControlEnabledA = getSpeedMasterControlFlag();


      if (CHANGE_SPEEDMASTER_SPACEBAR_CONTROL > 0) {

        isSpeedMastSpacebarControlEnabled = CHANGE_SPEEDMASTER_SPACEBAR_CONTROL == 1;

        if (!isSpeedMastSpacebarControlEnabled) {

          if (config && config.EXPERIMENT_FLAGS) {
            config.EXPERIMENT_FLAGS.web_speedmaster_spacebar_control = false;
          }
          if (config && config.EXPERIMENTS_FORCED_FLAGS) {
            config.EXPERIMENTS_FORCED_FLAGS.web_speedmaster_spacebar_control = false;
          }

        } else {

          if (config && config.EXPERIMENT_FLAGS) {
            config.EXPERIMENT_FLAGS.web_speedmaster_spacebar_control = true;
          }
          if (config && config.EXPERIMENTS_FORCED_FLAGS) {
            config.EXPERIMENTS_FORCED_FLAGS.web_speedmaster_spacebar_control = true;
          }

        }

      }

      const isSpeedMastSpacebarControlEnabledB = getSpeedMasterControlFlag();




      console.log('[yt-js-engine-tamer] speedmaster by space (yt setting)', isSpeedMastSpacebarControlEnabledA, isSpeedMastSpacebarControlEnabledB);

      // console.log(p_a_obj.handleGlobalKeyUp)
      console.log('[yt-js-engine-tamer] p_a', p_a_obj);

      // console.log(p_a_obj.api)


      // QT -> DX(SV) -> p_a


      /*
       *
       *
        g.k.handleGlobalKeyUp = function(a, b, c, d, e, f, h) {
            b = void 0 === b ? !1 : b;
            c = void 0 === c ? !1 : c;
            d = void 0 === d ? !1 : d;
            e = void 0 === e ? !1 : e;
            var l = g.PT(this);
            l && l.handleGlobalKeyUp(a, b, c, d, e, f, h)
        }

      */

      /*
       *
       *
       *
        g.k.handleGlobalKeyUp = function(a, b, c, d, e, f, h) {
            return this.Bw ? this.Bw.handleGlobalKeyUp(a, b, c, d, e, f, h) : !1
        }

      */


      // if(!keyDX) return;

      // console.log(4999, keyDX)

    };


    const ytResumeFn = function () { // ADVANCED_FIX_SHORTCUTKEYS

      const p_a_obj = kRef(p_a_objWR);
      // const api = p_a_obj.api;


      // console.log(540);

      let boolList = null;
      let ret;
      isSpaceKeyImmediate = true;
      try {

        ret = 0;
        ret = ret | (p_a_obj.handleGlobalKeyDown(32, false, false, false, false, ' ', 'Space', false) ? 1 : 0);
        let p_a_objT;
        if (!spaceBarControl_keyG) { // just in case
          boolList = new Set();
          p_a_objT = new Proxy(p_a_obj, {
            get(target, prop, handler) {
              const val = target[prop];
              if (typeof val !== 'boolean') return val;
              boolList.add(prop);
              // console.log(555, prop, val);
              if (typeof prop === 'string' && prop.length <= 3 && val === true && boolList.length === 1) {
                spaceBarControl_keyG = prop;
                p_a_obj.__uZWaD__ = spaceBarControl_keyG;
                val = false;
              }
              return val;
            }
          });


        } else if (p_a_obj[spaceBarControl_keyG] === true) {
          p_a_obj[spaceBarControl_keyG] = false;
          p_a_objT = p_a_obj;
          // console.log(p_a_obj, spaceBarControl_keyG, p_a_obj[spaceBarControl_keyG] )
        } else {

          p_a_objT = p_a_obj;
        }

        ret = ret | (p_a_objT.handleGlobalKeyUp(32, false, false, false, false, ' ', 'Space') ? 2 : 0);


      } catch (e) {
        console.log(e)
      }
      isSpaceKeyImmediate = false;

      if (boolList && boolList.size === 1) {
        const value = boolList.values().next().value;
        spaceBarControl_keyG = value;
        p_a_obj.__uZWaD__ = spaceBarControl_keyG;

      }

      if (spaceBarControl_keyG && p_a_obj[spaceBarControl_keyG] === true) p_a_obj[spaceBarControl_keyG] = false;

      return ret;
    }

    const shortcutKeysFixer = () => {

      let pausePromiseControlJ = 0;


      const obtainCurrentControlPhase = (evt, mediaPlayerElement) => {

        let controlPhase = 0;
        const aElm = document.activeElement;

        if (aElm) {

          const controlPhaseCache = wmKeyControlPhase.get(aElm);

          if (typeof controlPhaseCache === 'number') {

            controlPhase = controlPhaseCache;
          } else {

            if (aElm instanceof HTMLInputElement) controlPhase = 1;
            else if (aElm instanceof HTMLTextAreaElement) controlPhase = 1;
            else if (aElm instanceof HTMLButtonElement) controlPhase = 2;
            else if (aElm instanceof HTMLIFrameElement) controlPhase = 2;
            else if (aElm instanceof HTMLImageElement) controlPhase = 2;
            else if (aElm instanceof HTMLEmbedElement) controlPhase = 2;
            else {
              if (aElm instanceof HTMLElement && aElm.closest('[role]')) controlPhase = 5;
              if (aElm instanceof HTMLDivElement) controlPhase = 2;
              else if (aElm instanceof HTMLAnchorElement) controlPhase = 2;
              else if (!(aElm instanceof HTMLElement) && (aElm instanceof Element)) controlPhase = 2; // svg
            }

            if ((controlPhase === 2 || controlPhase === 5) && (aElm instanceof HTMLElement) && aElm.contains(mediaPlayerElement)) {
              controlPhase = 0;
            }

            if ((controlPhase === 2 || controlPhase === 5) && evt && evt.target && evt.target === aElm) {
              if (aElm.closest('[contenteditable], input, textarea')) {
                controlPhase = 5;
              } else if (aElm.closest('button')) {
                controlPhase = 4;
              }
            }

            if (aElm.closest('#movie_player')) controlPhase = 6;

            wmKeyControlPhase.set(aElm, controlPhase);

          }
        }

        return controlPhase;

      }

      const isStateControllable = (api) => {
        let appState = null;
        let playerState = null;
        let adState = null;
        try {
          appState = api.getAppState();
          playerState = api.getPlayerState();
          adState = api.getAdState();
        } catch (e) { }
        // ignore playerState -1
        return appState === 5 && adState === -1 && (playerState === 1 || playerState === 2 || playerState === 3);
      };


      const keyEventListener = (evt) => {
        if (BY_PASS_KEYBOARD_CONTROL) return;

        if (evt.isTrusted && evt instanceof Event) lastUserAction = Date.now();
        if (isSpaceKeyImmediate || !evt.isTrusted || !(evt instanceof KeyboardEvent)) return;
        if (!ytPageReady) return;

        if (evt.defaultPrevented === true) return;

        const p_a_obj = kRef(p_a_objWR);

        if (!p_a_obj) return;


        const mediaPlayerElement = kRef(mediaPlayerElementWR);
        if (!mediaPlayerElement) return;

        // let focusBodyIfSuccess = false;

        const controlPhase = obtainCurrentControlPhase(evt, mediaPlayerElement);

        if (controlPhase === 6 && getCurrentSelectionText() !== "") void 0;
        else if (controlPhase === 1 || controlPhase === 2 || controlPhase === 5) return;
        else if ((controlPhase !== 6 || focusedElementAtSelection === document.activeElement) && getCurrentSelectionText() !== "") return;


        if (evt.code === 'Space' && !getGlobalSpacebarControlFlag()) return;

        // console.log(`${evt.type}::controlPhase`,controlPhase)

        // if (controlPhase == 4) {
        //   focusBodyIfSuccess = true;
        // }

        spaceBarControl_keyG = spaceBarControl_keyG || p_a_obj.__uZWaD__ || ''
        if (spaceBarControl_keyG && p_a_obj[spaceBarControl_keyG] === true) p_a_obj[spaceBarControl_keyG] = false;

        if (FIX_SHORTCUTKEYS < 2) return;
        if (!(!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey)) return; // ignore if modifier key is pressed -> let other event listener to handle first

        let rr;
        const isSpaceBar = evt.code === 'Space' && !evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey;



        let useImprovedPauseResume = false;

        if (USE_IMPROVED_PAUSERESUME_UNDER_NO_SPEEDMASTER && isSpaceBar && !(isSpeedMastSpacebarControlEnabled = getSpeedMasterControlFlag())) {

          const api = p_a_obj.api;
          const stateControllable = isStateControllable(api);
          // console.log(2122, appState, playerState, adState)

          if (stateControllable && isWatchPageURL() && mediaPlayerElement.duration > 0.01 && (mediaPlayerElement.readyState === 4 || mediaPlayerElement.readyState === 1) && mediaPlayerElement.networkState === 2) {

            useImprovedPauseResume = true;

          }


        }


        // force flag: CHANGE_SPEEDMASTER_SPACEBAR_CONTROL
        if (evt.type === 'keydown') {

          if (useImprovedPauseResume) {

            const isPaused = mediaPlayerElement.paused;

            const cj = ++pausePromiseControlJ;
            Promise.resolve().then(() => {

              if (cj !== pausePromiseControlJ) return;

              if (mediaPlayerElement.paused !== isPaused) return;

              const ret = ytResumeFn();
              if (!ret) { // fallback
                isPaused ? api.playVideo() : api.pauseVideo();
              }

              /*
                  let a = void 0;
                  console.log('Rb', api.Rb())
                  a = !window._yt_player.nL(api.Rb());
                  p_a_obj.Wd.kG(a)
                      a ? api.playVideo() : api.pauseVideo();

              */


            });
            rr = true;
          } else {

            isSpaceKeyImmediate = true;
            rr = p_a_obj.handleGlobalKeyDown(evt.keyCode, evt.shiftKey, evt.ctrlKey, evt.altKey, evt.metaKey, evt.key, evt.code, evt.repeat);
            isSpaceKeyImmediate = false;
            if (spaceBarControl_keyG && p_a_obj[spaceBarControl_keyG] === true) p_a_obj[spaceBarControl_keyG] = false;

          }


        } else if (evt.type === 'keyup') {

          if (isSpaceBar && useImprovedPauseResume && !(isSpeedMastSpacebarControlEnabled = getSpeedMasterControlFlag())) {

            rr = true;
          } else {

            isSpaceKeyImmediate = true;
            rr = p_a_obj.handleGlobalKeyUp(evt.keyCode, evt.shiftKey, evt.ctrlKey, evt.altKey, evt.metaKey, evt.key, evt.code);
            isSpaceKeyImmediate = false;
            if (spaceBarControl_keyG && p_a_obj[spaceBarControl_keyG] === true) p_a_obj[spaceBarControl_keyG] = false;

          }


          /*

              if (d)
                  switch (c) {
                  case 32:
                  case 13:
                      if ("BUTTON" === d.tagName || "A" === d.tagName || "INPUT" === d.tagName)
                          b = !0,
                          e = !1;
                      else if (e) {
                          var m = d.getAttribute("role");
                          !m || "option" !== m && "button" !== m && 0 !== m.indexOf("menuitem") || (b = !0,
                          d.click(),
                          f = !0)
                      }
                      break;
                  case 37:
                  case 39:
                  case 36:
                  case 35:
                      b = "slider" === d.getAttribute("role");
                      break;
                  case 38:
                  case 40:
                      m = d.getAttribute("role"),
                      d = 38 === c ? d.previousSibling : d.nextSibling,
                      "slider" === m ? b = !0 : e && ("option" === m ? (d && "option" === d.getAttribute("role") && d.focus(),
                      f = b = !0) : m && 0 === m.indexOf("menuitem") && (d && d.hasAttribute("role") && 0 === d.getAttribute("role").indexOf("menuitem") && d.focus(),
                      f = b = !0))
                  }
              if (e && !f)
                  switch (c) {
                  case 38:
                      f = Math.min(this.api.getVolume() + 5, 100);
                      XV(this.Wd, f, !1);
                      this.api.setVolume(f);
                      h = f = !0;
                      break;
                  case 40:
                      f = Math.max(this.api.getVolume() - 5, 0);
                      XV(this.Wd, f, !0);
                      this.api.setVolume(f);
                      h = f = !0;
                      break;
                  case 36:
                      this.api.Yh() && (this.api.startSeekCsiAction(),
                      this.api.seekTo(0, void 0, void 0, void 0, 79),
                      h = f = !0);
                      break;
                  case 35:
                      this.api.Yh() && (this.api.startSeekCsiAction(),
                      this.api.seekTo(Infinity, void 0, void 0, void 0, 80),
                      h = f = !0)
                  }
          */

        }


        if (rr) {

          // focusBodyIfSuccess && Promise.resolve().then(() => {
          //   activeElement === document.activeElement && activeElement.blur();
          // });

          evt.preventDefault();
          evt.stopImmediatePropagation();
          evt.stopPropagation();

        }

      };

      document.addEventListener('keydown', keyEventListener, { capture: true });


      document.addEventListener('keyup', keyEventListener, { capture: true });

    }

    return { pageMediaWatcher, shortcutKeysFixer, keyboardController };

  })();


  pageMediaWatcher();
  FIX_SHORTCUTKEYS > 0 && shortcutKeysFixer();


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
  const qm57 = Symbol();
  const qm53 = Symbol();
  const qn53 = Symbol();


  const ump3 = new WeakMap();

  const stp = document.createElement('noscript');
  stp.id = 'weakref-placeholder';

  PROP_OverReInclusion_AVOID && (() => {


    if (typeof HTMLElement.prototype.hasOwnProperty72 === 'function' || typeof HTMLElement.prototype.hasOwnProperty !== 'function') return;
    const f = HTMLElement.prototype.hasOwnProperty72 = HTMLElement.prototype.hasOwnProperty;
    let byPassVal = null;
    let byPassCount = 0;
    let mmw = new Set();
    HTMLElement.prototype.hasOwnProperty = function (prop) {
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
    Object.defineProperty(HTMLElement.prototype, 'didForwardDynamicProps', {
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


  let marcoPr = new PromiseExternal();
  const trackMarcoCm = document.createComment('1');
  const trackMarcoCmObs = new MutationObserver(()=>{
    marcoPr.resolve();
    marcoPr = new PromiseExternal();
  });
  trackMarcoCmObs.observe(trackMarcoCm, {characterData: true});


  // ----------------------------



  // const rendererStamperCreationFactory = (cProto, options) => {

  //   const { key, stamperDomClass, preloadFn } = options;

  //   // const newDoc = document.implementation.createHTMLDocument("NewDoc");
  //   const pSpace = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  //   document.documentElement.insertAdjacentElement('beforeend', pSpace);
  //   const pNode = document.createElement('ns-538');
  //   pSpace.insertAdjacentElement('beforeend', pNode);

  //   const pDiv = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  //   if (typeof pNode.attachShadow === 'function') {
  //     const pShadow = pNode.attachShadow({ mode: "open" });
  //     pShadow.replaceChildren(pDiv);
  //   } else {
  //     pNode.insertAdjacentElement('beforeend', pDiv);
  //   }

  //   const pDivNew = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  //   pDiv.insertAdjacentElement('beforeend', pDivNew);

  //   const wmRemoved = new Map();

  //   // const wmMapToItem = new WeakMap();
  //   // let wmPendingList = null;

  //   const nullComponents = new Map();

  //   const componentDefaultAttributes = new WeakMap();

  //   const fnKeyH = `${key}$$c472`;

  //   cProto[fnKeyH] = async function (cTag, cId, pr00) {
  //     // await the current executing task (if any)
  //     // and avoid stacking in the same marco task
  //     await Promise.all([pr00, nextBrowserTick_()]); 
  //     if (!this.ec389a && !this.ec389r) return;
  //     const addedCount0 = this.ec389a;
  //     const removedCount0 = this.ec389r;

  //     this.ec389 = false;
  //     this.ec389a = 0;
  //     this.ec389r = 0;

  //     const stampDomMap = this.stampDom[cTag].mapping;
  //     const isTickerRendering = cTag === 'tickerItems';
  //     const isMessageListRendering = cTag === 'visibleItems';

  //     // coming process can be stacked as ec389a and ec389r are reset.

  //     const deObjectComponent = (itemEntry) => {
  //       const I = firstObjectKey(itemEntry);
  //       const L = stampDomMap[I];
  //       const H = itemEntry[I];
  //       return [L, H];
  //     }

  //     const hostElement = this.hostElement;

  //     let renderNodeCount = 0;
  //     const renderList = this[cTag].map((item) => {
  //       const [L, H] = deObjectComponent(item);
  //       const node = kRef(renderMap.get(H));
  //       return node && hostElement.contains(node) ? (renderNodeCount++, node) : item;
  //     });

  //     // this.ec389 = null;
  //     // this.ec389a = 0;
  //     // this.ec389r = 0;

  //     let addedCounter = 0;
  //     let removedCounter = 0;

  //     const createConnectedComponentElm = (insertionObj, L, H, componentName) => {
  //       // const reusable = false;
  //       // const componentName = this.getComponentName_(L, H);
  //       let component;
  //       if (!nullComponents.has(componentName)) {
  //         nullComponents.set(componentName, (component = document.createElement(componentName)));
  //         component.className = stamperDomClass;
  //         // shadowElm.insertAdjacentElement('beforeend', component);
  //       } else {
  //         component = nullComponents.get(componentName);
  //       }
  //       component = component.cloneNode(false);

  //       // const cnt = insp(component);

  //       // cnt.__dataOld = cnt.__dataPending = null;
  //       pDivNew.insertAdjacentElement('beforeend', component);
  //       // cnt.__dataOld = cnt.__dataPending = null;

  //       return component;
  //     }

  //     const listDom = this.getStampContainer_(cId);

  //     const pnForNewItem = (item) => {

  //       const [L, H] = deObjectComponent(item);

  //       const componentName = this.getComponentName_(L, H);

  //       const wmList = wmRemoved.get(componentName.toLowerCase());

  //       let connectedComponent = null;
  //       if (wmList && (connectedComponent = wmList.firstElementChild)) {
  //         if (this.telemetry_) this.telemetry_.reuse++;
  //         // if (!wmPendingList) {
  //         //   wmPendingList = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  //         //   wmPendingList.setAttributeNS('http://www.w3.org/2000/svg', 'wm-pending', 'true');
  //         //   pDiv.insertAdjacentElement('afterend', wmPendingList);
  //         // }
  //         // wmPendingList.insertAdjacentElement('beforeend', connectedComponent);
  //         pDivNew.insertAdjacentElement('beforeend', connectedComponent);
  //         const attrMap = connectedComponent.attributes;
  //         const defaultAttrs = componentDefaultAttributes.get(connectedComponent);
  //         if (defaultAttrs) {
  //           for (const attr of attrMap) {
  //             const name = attr.name;
  //             if (name in defaultAttrs) attr.value = defaultAttrs[name];
  //             else attrMap.removeNamedItem(name);
  //           }
  //           if (attrMap.length !== defaultAttrs['"']) {
  //             for (const name in defaultAttrs) {
  //               if (!attrMap[name] && name !== '"') connectedComponent.setAttribute(name, defaultAttrs[name]);
  //             }
  //           }
  //         }

  //       } else {
  //         connectedComponent = createConnectedComponentElm(item, L, H, componentName);
  //         if (this.telemetry_) this.telemetry_.create++;
  //       }
  //       if (isTickerRendering) {
  //         const container = connectedComponent.firstElementChild;
  //         if (container) container.classList.add('yt-live-chat-ticker-stampdom-container');
  //       }

  //       return [item, L, H, connectedComponent];

  //     };

  //     let imgPreloadPr = null;
  //     if (isMessageListRendering) {
  //       const addedItems = renderList.filter(item => item === 'object' && (item instanceof Node));
  //       imgPreloadPr = preloadFn(addedItems)();
  //     }

  //     const newComponentsEntries = await executeTaskBatch(renderList.map(item => ({
  //       item,
  //       fn(task) {
  //         const { item } = task;
  //         return typeof item === 'object' && !(item instanceof Node) ? pnForNewItem(item) : item;
  //       }
  //     })));

  //     const imgPromises = [];

  //     const imgPaths = new Set();

  //     const pnForRenderNewItem = (entry) => {
  //       const [item, L, H, connectedComponent] = entry;

  //       const cnt = insp(connectedComponent);
  //       if (!cnt.__refreshData938__) {
  //         cnt.constructor.prototype.__refreshData938__ = __refreshData938__;
  //       }
  //       if (typeof cnt.data === 'object' && cnt.__dataEnabled === true && cnt.__dataReady === true && cnt.__dataInvalid === false) {
  //         cnt.data = H;
  //       } else {
  //         const q = this.deferRenderStamperBinding_
  //         let q2;
  //         if (typeof q === 'object') q2 = this.deferRenderStamperBinding_ = [];
  //         this.deferRenderStamperBinding_(connectedComponent, L, H);
  //         this.flushRenderStamperComponentBindings_();
  //         if (typeof q === 'object') {
  //           this.deferRenderStamperBinding_ = q;
  //           q2.length = 0;
  //         }
  //       }
  //       if (cnt.data) cnt.__refreshData938__('data', !0); // ensure data is invalidated

  //       // fix yt-icon issue
  //       for (const node of connectedComponent.getElementsByTagName('yt-icon')) {
  //         try {
  //           const cnt = insp(node);
  //           if (!cnt.__refreshProps938__) cnt.constructor.prototype.__refreshProps938__ = __refreshProps938__;
  //           cnt.__refreshProps938__();
  //         } catch (e) { }
  //       }

  //       componentDefaultAttributes.set(connectedComponent, getAttributes(connectedComponent));
  //       return entry;
  //     }

  //     const newRenderedComponents = await executeTaskBatch(newComponentsEntries.map(entry => ({
  //       entry,
  //       fn(task) {
  //         const { entry } = task;
  //         return typeof entry === 'object' && !(entry instanceof Node) ? pnForRenderNewItem(entry) : entry;
  //       }
  //     })));


  //     this.flushRenderStamperComponentBindings_(); // ensure all deferred flush render tasks clear.

  //     // imgPromises.push(imageFetch('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'));
  //     if (imgPromises.length > 0) {
  //       const pr1 = Promise.all(imgPromises).catch(e => { });
  //       const pr2 = autoTimerFn();
  //       await Promise.race([pr1, pr2]).catch(e => { });
  //       imgPaths.clear();
  //       imgPromises.length = 0;
  //     }
  //     if (imgPreloadPr) await imgPreloadPr;

  //     // const batching = [];
  //     // let j = 0;
  //     // let elNode;

  //     const sideProcesses = [];

  //     const removeStampNode_ = (elNode) => {
  //       const elm = elNode;
  //       const cnt = insp(elm);
  //       const componentName = elm.nodeName.toLowerCase();
  //       let wmList = wmRemoved.get(componentName);
  //       if (!wmList) {
  //         wmList = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  //         wmList.setAttributeNS('http://www.w3.org/2000/svg', 'wm-component', componentName);
  //         pDiv.insertAdjacentElement('afterend', wmList);
  //         wmRemoved.set(componentName, wmList);
  //       }
  //       wmList.insertAdjacentElement('beforeend', elm);
  //       const data = cnt.data;
  //       if (data) renderMap.delete(cnt.data);

  //       sideProcesses.push(reuseFixDataViewModel(elm));
  //       sideProcesses.push(reuseFixYtIconRendering(elm));
  //     }

  //     // const removeStampNode = async () => {

  //     //   removedCounter++;

  //     //   const nextElm = nextComponentSiblingFn(elNode);
  //     //   const elmId = elNode.id;
  //     //   removeStampNode_(elNode);
  //     //   // const dzid = this.getAttribute('dz-component-id');
  //     //   // ---- no-cache ----
  //     //   // try{
  //     //   //   elm.remove();
  //     //   // }catch(e){}
  //     //   // ---- no-cache ----

  //     //   if (cTag === 'visibleItems') {
  //     //     sideProcesses.push(onVisibleItemStampNodeRemoval(elmId));
  //     //   }

  //     //   j++;
  //     //   elNode = nextElm;

  //     // }

  //     // if (typeof Polymer !== "undefined" && typeof Polymer.flush === "function") {
  //     //   // clear all pending rendering first
  //     //   await stackMarcoTask(async () => {
  //     //     Polymer.flush();
  //     //   });
  //     // }

  //     // main UI thread - DOM modification
  //     await new Promise((resolveDM) => {
  //       nextBrowserTick_(() => {

  //         const isAtBottom = this.atBottom === true;
  //         // if (ENABLE_OVERFLOW_ANCHOR && isAtBottom) {
  //         //   shouldScrollAfterFlush = true;
  //         // }


  //         const tasks = [];

  //         const taskFn = {
  //           remove: (task) => {

  //             const { elNode } = task;

  //             removedCounter++;

  //             const elmId = elNode.id;
  //             removeStampNode_(elNode);
  //             // const dzid = this.getAttribute('dz-component-id');
  //             // ---- no-cache ----
  //             // try{
  //             //   elm.remove();
  //             // }catch(e){}
  //             // ---- no-cache ----

  //             if (isMessageListRendering) {
  //               sideProcesses.push(onVisibleItemStampNodeRemoval(elmId));
  //             }

  //             return 2

  //           },
  //           append: (task) => {

  //             const { newNode, nodeAfter, parentNode } = task;

  //             nodeAfter ? nodeAfter.insertAdjacentElement('beforebegin', newNode) : parentNode.insertAdjacentElement('beforeend', newNode);
  //             const connectedComponent = newNode;
  //             const cnt = insp(connectedComponent);
  //             renderMap.set(cnt.data, mWeakRef(connectedComponent));
  //             mutationDelayedRefreshData(cnt); // not included to sideProcesses
  //             addedCounter++;

  //             if (isTickerRendering) {
  //               sideProcesses.push(onTickerItemStampNodeAdded());
  //             }

  //             if (isMessageListRendering && isAtBottom) {

  //               const itemScroller = this.itemScroller;
  //               if (itemScroller && (!ENABLE_OVERFLOW_ANCHOR || itemScroller.scrollTop === 0)) itemScroller.scrollTop = 16777216;

  //             }

  //             return 1
  //           }
  //         }

  //         {
  //           const indexMap = new WeakMap();
  //           let index = 0;
  //           for (let elNode_ = firstComponentChildFn(listDom); elNode_ instanceof Node; elNode_ = nextComponentSiblingFn(elNode_)) {
  //             indexMap.set(elNode_, index++);
  //           }

  //           const keepIndices = new Array(renderNodeCount);
  //           let keepIndicesLen = 0, lastKeepIndex = -1, requireSort = false;
  //           for (let i = 0, l = newRenderedComponents.length; i < l; i++) {
  //             const entry = newRenderedComponents[i];
  //             if (entry instanceof Node) {
  //               const index = indexMap.get(entry);
  //               keepIndices[keepIndicesLen++] = [index, entry];
  //               if (index > lastKeepIndex) lastKeepIndex = index;
  //               else requireSort = true;
  //             }
  //           }
  //           keepIndices.length = keepIndicesLen;
  //           if (requireSort) keepIndices.sort((a, b) => a[0] - b[0]);
  //           let dk = 0;

  //           let j = 0;
  //           let elNode;

  //           elNode = firstComponentChildFn(listDom);

  //           for (const rcEntry of newRenderedComponents) {
  //             const index = indexMap.get(rcEntry);
  //             if (typeof index === 'number') {
  //               const indexEntry = keepIndices[dk++];
  //               const [dIdx, dNode] = indexEntry;
  //               indexMap.delete(rcEntry);
  //               const idx = dIdx;
  //               while (j < idx && elNode) {
  //                 tasks.push({
  //                   type: 'remove',
  //                   elNode,
  //                   fn: taskFn.remove
  //                 });
  //                 elNode = nextComponentSiblingFn(elNode);
  //                 j++;
  //               }
  //               if (j === idx) {
  //                 if (elNode) {
  //                   // if (dNode !== elNode) tasks.push({
  //                   //   type: 'swap',
  //                   //   earlyNode: indexEntry[1],
  //                   //   laterNode: elNode
  //                   // });
  //                   elNode = nextComponentSiblingFn(elNode);
  //                   j++;
  //                 } else {
  //                   console.warn('elNode is not available?', renderList, addedCount0, removedCount0, j, idx);
  //                 }
  //               }
  //             } else if (rcEntry instanceof Node) {
  //               // interruped by the external like clearList

  //               tasks.push({
  //                 type: 'remove',
  //                 elNode: rcEntry,
  //                 fn: taskFn.remove
  //               });

  //             } else {
  //               const [item, L, H, connectedComponent] = rcEntry;

  //               tasks.push({
  //                 type: 'append',
  //                 newNode: connectedComponent,
  //                 nodeAfter: elNode,
  //                 parentNode: listDom,
  //                 fn: taskFn.append
  //               });

  //             }

  //           }

  //           while (elNode) {

  //             tasks.push({
  //               type: 'remove',
  //               elNode,
  //               fn: taskFn.remove
  //             });
  //             elNode = nextComponentSiblingFn(elNode);

  //           }

  //         }


  //         executeTaskBatch(tasks).then(resolveDM).catch(console.warn);

  //       });
  //     }).catch(console.warn);

  //     {
  //       const arr = this[cTag];
  //       let b = 0;
  //       b = b | this._setPendingPropertyOrPath(`${cTag}.splices`, {}, true, true);
  //       b = b | this._setPendingPropertyOrPath(`${cTag}.length`, arr.length, true, true);
  //       b && this._invalidateProperties();
  //     }

  //     // this.flushRenderStamperComponentBindings_(); // just in case...

  //     await Promise.all(sideProcesses);

  //     const detail = {
  //       container: listDom
  //     };
  //     this.stampDom[cTag].events && this.hostElement.dispatchEvent(new CustomEvent("yt-rendererstamper-finished", {
  //       bubbles: !0,
  //       cancelable: !1,
  //       composed: !0,
  //       detail
  //     }));
  //     detail.container = null;

  //     // if (typeof Polymer !== "undefined" && typeof Polymer.flush === "function") {
  //     //   // clear all remaining rendering before promise resolve
  //     //   await stackMarcoTask(async () => {
  //     //     Polymer.flush();
  //     //   });
  //     // }

  //   }

  //   cProto[key] = function (cTag, cId, indexSplice) {
  //     // console.log('proceedStampDomArraySplices_')
  //     // assume no error -> no try catch (performance consideration)
  //     const { index, addedCount, removed } = indexSplice;
  //     const removedCount = removed ? removed.length : indexSplice.removedCount;
  //     indexSplice = null;
  //     if (!addedCount && !removedCount) {
  //       console.warn('proceedStampDomArraySplices_', 'Error 001');
  //       return false;
  //     }
  //     // const streamArr = this[cTag];
  //     if (!this.ec389) {
  //       if (this.ec389a || this.ec389r) {
  //         console.warn('proceedStampDomArraySplices_', 'Error 002');
  //         return false;
  //       }
  //       this.ec389 = true;
  //       this.ec389a = 0;
  //       this.ec389r = 0;
  //     }
  //     const shouldExecute = !this.ec389a && !this.ec389r;

  //     this.ec389a += addedCount;
  //     this.ec389r += removedCount;

  //     if (shouldExecute) {

  //       // let shouldScrollAfterFlush = false;
  //       const pr00 = this.ec389pr;
  //       const ec389pr = this.ec389pr = this[fnKeyH](cTag, cId, pr00).catch(console.warn);

  //       if (cTag === 'visibleItems') {
  //         this.prDelay288 = ec389pr;
  //         // this.hasUserJustInteracted12_ = (this.hasUserJustInteracted11_ || (() => false));

  //         // the first microtask after promise resolved
  //         // YYYYYYY
  //         // ec389pr.then(async () => {
  //         //   if (shouldScrollAfterFlush) {
  //         //     if (this.atBottom === false && this.allowScroll === true && !this.hasUserJustInteracted12_()) this.scrollToBottom_();
  //         //     wme.data = `${(wme.data & 7) + 1}`;
  //         //     await wmp;
  //         //     if (this.atBottom === false && this.allowScroll === true && !this.hasUserJustInteracted12_()) this.scrollToBottom_();
  //         //   }
  //         // });

  //       }

  //     }

  //     return true;
  //   }





  // }

  // ----------------------------


  // const convertionFuncMap = new WeakMap();
  // let val_kevlar_should_maintain_stable_list = null;

  // const csb = (a, b) => { for (const c in a) if (a.hasOwnProperty(c) && b[c]) return c; return null }
  // const createStampDomArrayFnE1_ = function (items, containerId, componentConfig, rendererConfig, shouldTriggerRendererStamperFinished, isStableList) {


  //   // this.__$$fs894$$__ = this.__$$fs894$$__  ||  `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;

  //   // console.log(1880, this.__$$fs894$$__)
  //   if(!this[`__0p893::${containerId}__`]) this[`__0p893::${containerId}__`]= [];

  //   // const task = 
  //   queueMicrotask_(()=>{


  //   });
  //   this[`__0p892::${containerId}__`] = (this[`__0p892::${containerId}__`] || Promise.resolve(0)).then(async () => {

  //     try {

  //       if ((this.hostElement || 0).isConnected) this[`__0fs892::${containerId}__`] = `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
  //       const t892 = this[`__0fs892::${containerId}__`];
  //       // a - array 
  //       // c - mapping
  //       // d - reuseComponents
  //       // e - events (shouldTriggerRendererStamperFinished)
  //       // h - stamperStableList

  //       // this is for flushing the new elements to a blank container. (without reusing)

  //       const b_ = containerId;
  //       const c_ = componentConfig;
  //       const items_ = items;

  //       const doDeferRenderStamperBinding_ = async (component) => {
  //         const i = component[stampIdxSb];
  //         const u = items_[i];
  //         const c = c_;
  //         const x = csb(c, u);
  //         this.deferRenderStamperBinding_(component, c[x], u[x]); // necessary?
  //       };

  //       const container = this.getStampContainer_(b_);

  //       const domShell = container.__domApi || container;
  //       if (!domShell || !domShell.appendChild || typeof domShell.childElementCount !== 'number') throw new Error();
  //       const domShellElementCount = domShell.childElementCount;
  //       const noscript = document.createElement('noscript');
  //       // document.body.appendChild(noscript); 

  //       let doc = document;

  //       const nofn = () => true;
  //       const n = items_.length;
  //       const fns = new Array(n);
  //       let cxt = 0;

  //       let qxd = domShellElementCount > 0 ? new WeakSet() : null;
  //       const nextTickFnE1 = () => {
  //         items_.some((item, i) => {

  //           const componentKey = csb(componentConfig, item);
  //           if (!componentKey) {
  //             fns[i] = nofn;
  //             cxt++;
  //           } else {

  //             const newComponent = this.createComponent_(componentConfig[componentKey], item[componentKey], rendererConfig);
  //             newComponent[stampIdxSb] = i;
  //             doDeferRenderStamperBinding_(newComponent);
  //             // mutex = mutex.then(() => {
  //             noscript.appendChild(newComponent);
  //             // });

  //             // Promise.resolve(cp).then(doDeferRenderStamperBinding_);
  //             let newComponent_ = newComponent;
  //             fns[i] = () => {
  //               if (!newComponent_) return true;
  //               if (newComponent_.parentNode === noscript) {
  //                 newComponent_ = null;
  //                 return true;
  //               }
  //               return false;
  //             };

  //           }

  //         });
  //         noscript.setAttribute('ylul8gr', `${Date.now()}`);
  //       };

  //       const nextTickFnF1 = () => {
  //         let startNode = null;

  //         const isSet = new Set();
  //         items_.some((item, i) => {

  //           const componentKey = csb(componentConfig, item);
  //           if (!componentKey) {
  //             fns[i] = nofn;
  //             cxt++;
  //           } else {

  //             const componentName = this.getComponentName_(componentConfig[componentKey], item[componentKey]);
  //             isSet.add(componentName);
  //             let np = startNode || domShell.firstElementChild;
  //             let chosenNode = null;
  //             while (np) {
  //               if (np instanceof Node_ && np.is === componentName && !qxd.has(np)) {
  //                 qxd.add(np);
  //                 chosenNode = np;
  //                 break;
  //               }
  //               np = np.nextElementSibling;
  //             }


  //             const cp = chosenNode || this.createComponent_(componentConfig[componentKey], item[componentKey], rendererConfig);
  //             let oldIdx = cp[stampIdxSb];

  //             cp[stampIdxSb] = i;
  //             doDeferRenderStamperBinding_(cp);
  //             if (chosenNode !== null && cp === chosenNode) {

  //               fns[i] = nofn;
  //               startNode = chosenNode;
  //             } else {

  //               // mutex = mutex.then(() => {
  //               noscript.appendChild(cp); // ui formation
  //               // });

  //               // Promise.resolve(cp).then(doDeferRenderStamperBinding_);
  //               let q = cp;
  //               fns[i] = () => {
  //                 if (q && q.parentNode === noscript) {
  //                   const cp = q;
  //                   q = null;
  //                 }
  //                 if (!q) return true;
  //               };

  //             }

  //           }

  //         });

  //         if (isSet.size === 1 && qxd !== null) {

  //           const is = isSet.values().next().value;

  //           if (typeof is === 'string' && is.length >= 1) {

  //             let np = startNode || domShell.firstElementChild;
  //             const removal = [];
  //             while (np) {
  //               if (np instanceof Node_ && np.is === is && !qxd.has(np)) {
  //                 removal.push(np);
  //                 np[stampIdxSb] = -1;
  //               }
  //               np = np.nextElementSibling;
  //             }
  //             // by default, removal.length shoule be zero. just play safe.
  //             if (removal.length > 0) {
  //               const dFrag = doc.createDocumentFragment();
  //               dFrag.append(...removal);
  //               removal.length = 0;
  //             }

  //           }

  //         }
  //         noscript.setAttribute('ylul8gr', `${Date.now()}`);



  //       }

  //       const pr = new Promise(resolvePR => {

  //         let mo = new MutationObserver(() => {
  //           if (typeof fns[n - 1] !== 'function') return;
  //           if (!noscript.hasAttribute('ylul8gr')) return;
  //           const everyTrue = fns.every(fn => fn() === true);
  //           if (everyTrue) {
  //             if (mo) {
  //               mo.disconnect();
  //               mo.takeRecords();
  //               mo = null;
  //             }
  //             resolvePR();
  //           }
  //         });
  //         mo.observe(noscript, { subtree: false, childList: true, attributes: ['ylul8gr'] });

  //         if (domShellElementCount > 0) {
  //           nextBrowserTick_(nextTickFnF1);
  //         } else {
  //           nextBrowserTick_(nextTickFnE1);
  //         }

  //       });
  //       await pr.then();
  //       fns.length = 0;
  //       qxd = null;

  //       // console.log(3025)



  //       // document.documentElement.appendChild.call(doc.documentElement, noscript);
  //       // nativeRemoveE.call(noscript);

  //       // nativeRemoveE.call(noscript);
  //       noscript.remove(); // trigger isAttached change
  //       const hostElement = this.hostElement;


  //       /** @type {DocumentFragment} */
  //       // const gFragment = document.createDocumentFragment();
  //       const gFragment = doc.createDocumentFragment();

  //       const fnE = () => {
  //         const evt = new CustomEvent("yt-rendererstamper-finished", {
  //           bubbles: !0,
  //           cancelable: !1,
  //           composed: !0,
  //           detail: {
  //             container
  //           }
  //         });
  //         hostElement.dispatchEvent(evt);
  //       };

  //       let f1, f2;
  //       f1 = async () => {
  //         await new Promise(r => nextBrowserTick_(r));
  //         if (t892 !== this[`__0fs892::${containerId}__`]) return;
  //         // await new Promise(r=>setTimeout(r, 1000));

  //         // if (this.data !== data || this.__data !== __data) return;

  //         const domShellElementCountCurrent = domShell.childElementCount;
  //         if (domShellElementCountCurrent !== domShellElementCount) return;
  //         if (hostElement.isConnected === false || this.isAttached === false || !hostElement.contains(container) || container.__domApi !== domShell) {
  //           return;
  //         }
  //         // const t1 = performance.now();

  //         if (DO_createStampDomArrayFnE1_nativeAppendD) {
  //           let elm;
  //           while (elm = noscript.firstChild) {
  //             nativeAppendD.call(gFragment, elm); // no attached / detached
  //           }
  //         } else {
  //           let elm;
  //           while (elm = noscript.firstChild) {
  //             gFragment.appendChild(elm);
  //           }
  //         }
  //         // const t2 = performance.now();

  //         // console.log('createStampDomArrayFn_{T2}', t2-t1);

  //         // nextBrowserTick_(f2);
  //         return true;
  //       };

  //       f2 = async () => {
  //         await new Promise(r => nextBrowserTick_(r));
  //         if (t892 !== this[`__0fs892::${containerId}__`]) return;
  //         // if (this.data !== data || this.__data !== __data) return;

  //         const domShellElementCountCurrent = domShell.childElementCount;
  //         if (domShellElementCountCurrent !== domShellElementCount) return;
  //         if (hostElement.isConnected === false || this.isAttached === false || !hostElement.contains(container) || container.__domApi !== domShell) {
  //           return;
  //         }

  //         domShell.appendChild(gFragment);
  //         this.flushRenderStamperComponentBindings_();
  //         this.markDirty && this.markDirty();

  //         if (shouldTriggerRendererStamperFinished) {
  //           nextBrowserTick_(fnE);
  //         }

  //         return true;

  //       };

  //       const r1 = await f1();
  //       if (r1 === true) {
  //         const r2 = await f2();
  //       }


  //     } catch (err) {

  //       console.warn(err);

  //     } finally {
  //       //
  //     }

  //   }).catch(() => 0);


  // };


  // const stampIdxSb = Symbol();
  // const byPassIs55 = new Set(['ytd-rich-grid-renderer', 'ytd-rich-item-renderer', 'ytd-rich-grid-media', 'ytd-rich-section-renderer', 'ytd-rich-shelf-renderer']); // some issues for the view model
  // const byPassIs55 = new Set(['ytd-rich-grid-renderer', 'ytd-rich-shelf-renderer']);
  // const byPassIs55 = new Set([
  //   'ytd-rich-grid-renderer', 'ytd-rich-shelf-renderer', // avoid disappearing of video/short entries
  //   'ytd-unified-share-panel-renderer', 'yt-third-party-share-target-section-renderer', 'ytd-add-to-playlist-renderer', // avoid share-panel being non-central
  //   'ytd-continuation-item-renderer', 'tp-yt-paper-spinner',
  //   'ytd-multi-page-menu-renderer', 'yt-multi-page-menu-section-renderer'
  // ]);
  // const byPassB55 = new Set(['continuations']);
  // const byPassB55 = new Set(['flexible-item-buttons', 'continuations', 'header', 'sections']);

  // let stampContainer = null;
  // const requestDomApiObject = { getStampContainer_: () => stampContainer };
  // const requestDomApiProxy = new Proxy(requestDomApiObject, {
  //   get(target, prop, receiver) {
  //     if (prop === 'getStampContainer_') return target[prop];
  //     throw new Error("requestDomApiProxyGet");
  //   },
  //   set(target, prop, value, receiver) {
  //     throw new Error("requestDomApiProxySet");
  //   }
  // });
  // const fulfillment2Set = new Set([
  //   'ytd-watch-next-secondary-results-renderer.items',
  //   'yt-related-chip-cloud-renderer.content',
  //   'yt-chip-cloud-renderer.chips',
  //   // 'ytd-section-list-renderer.contents', // affect loading of https://www.youtube.com/feed/history
  //   'ytd-engagement-panel-section-list-renderer.content',
  //   'ytd-engagement-panel-section-list-renderer.header',
  //   'ytd-video-description-infocards-section-renderer.items',
  //   'yt-clip-creation-renderer.title-input',
  //   'yt-clip-creation-renderer.scrubber',
  //   'ytd-watch-flexy.info-contents',
  //   'ytd-video-primary-info-renderer.menu',
  //   'ytd-menu-renderer.flexible-item-buttons',
  //   'ytd-metadata-row-container-renderer.always-shown',
  //   'ytd-subscribe-button-renderer.notification-preference-button',
  //   'ytd-watch-metadata.subscribe-button',
  //   'ytd-watch-metadata.teaser-carousel',
  //   'ytd-structured-description-content-renderer.items',
  //   'ytd-video-description-infocards-section-renderer.infocard-videos-button',
  //   'ytd-video-description-infocards-section-renderer.infocard-channel-button',
  //   'ytd-rich-metadata-row-renderer.contents',
  //   'ytd-subscribe-button-renderer.notification-preference-button',
  //   'ytd-watch-flexy.panels',
  //   // yt-live-chat
  //   'yt-live-chat-renderer.input-panel',
  //   'yt-live-chat-app.contents',
  //   'yt-live-chat-message-input-renderer.picker-buttons',
  //   'yt-live-chat-message-input-renderer.pickers',
  //   'yt-live-chat-message-input-renderer.emoji-picker-button',
  //   'yt-live-chat-product-picker-panel-view-model.items',
  //   'yt-live-chat-message-input-renderer.send-button',
  //   'yt-live-chat-renderer.continuations',
  //   // 'yt-live-chat-renderer.item-list', // affect yt live chat message init
  //   'yt-live-chat-renderer.ticker'
  // ]);

  const __refreshData938o__ = {};
  const __refreshData938__ = function (prop, opt) {
    const d = this[prop];
    if (d) {
      this._setPendingProperty(prop, __refreshData938o__, opt);
      this._setPendingProperty(prop, d, opt);
      this._invalidateProperties();
    }
  };

  // const pendingStampFlushs = [];

  const nativeNow = performance.constructor.prototype.now.bind(performance);

  const queueMicrotask_ = typeof queueMicrotask === 'function' ? queueMicrotask : (f) => (Promise.resolve().then(f), void 0);
  

  const executeTaskBatch = function (taskArr, firstMarco = true) {
    if (!(taskArr || 0).length) throw new TypeError(`Illegal invocation`);
    return new Promise(resolveFinal => {
      let resolveFn = null;
      const len = taskArr.length;
      const results = new Array(len);
      const makePromise = () => new Promise(resolve => { resolveFn = resolve });
      let firedCount = 0;
      const executor = () => {
        if (taskArr.length !== len) throw new TypeError(`Illegal invocation`);
        const resolveFn_ = resolveFn;
        let t0 = 0;
        let next = 0;
        taskArr.forEach((task, idx) => {
          if (typeof (task || 0) !== 'object') throw new TypeError(`Illegal invocation`);
          if (!task.fired) {
            queueMicrotask_(() => {
              if (next || task.fired) return;
              task.fired = true;
              if (++firedCount === len) next |= 2;
              if (!t0) t0 = nativeNow() + 10;
              const { fn } = task;
              results[idx] = fn(task); // sync task only
              if (nativeNow() > t0) next |= 1;
            });
          }
        });
        queueMicrotask_(() => resolveFn_(next))
      }
      const looper = (next) => {
        if (!next) throw new TypeError(`Illegal invocation`);
        if (next & 2) {
          if (next & 1) {
            nextBrowserTick_(() => resolveFinal(results))
          } else {
            resolveFinal(results);
          }
        } else {
          const p = makePromise();
          nextBrowserTick_(executor);
          p.then(looper);
        }
      }
      const p = makePromise();
      firstMarco ? nextBrowserTick_(executor) : executor();
      p.then(looper);

    })

  }


  FIX_ICON_RENDER && whenCEDefined('yt-icon').then(async () => {


    const globalPromiseStack = {};

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

    if(cProto.__renderIconFix__) return;
    cProto.__renderIconFix__ = true;

    let taskStack = [];
    const cmObs = new MutationObserver(()=>{
      const tasks = taskStack.slice();
      taskStack.length = 0;
      for(const task of tasks){
        task();
      }
    })
    const cm = document.createComment('1');
    const stackTask = (f)=>{
      taskStack.push(f);
      cm.data = `${(cm.data & 7) + 1}`;
    }
    cmObs.observe(cm, {characterData: true});

    let iconManagers = {}; // assume shared

    window.iconManagers = ()=>iconManagers;


    const setupYtIcon=(inst)=>{
    
      if(inst.__ytIconSetup588__) return;
      const cProto = Reflect.getPrototypeOf(inst);
      cProto. __ytIconSetup588__ = true; 

      
      const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;

      config.EXPERIMENT_FLAGS.wil_icon_render_when_idle = false;
      config.EXPERIMENT_FLAGS.wil_icon_load_immediately = true;
      config.EXPERIMENT_FLAGS.wil_icon_use_mask_rendering = false;
      config.EXPERIMENT_FLAGS.wil_icon_network_first = true;

      
      // this.renderingMode = _.x("wil_icon_use_mask_rendering") ? 1 : 0;
      // this.isNetworkFirstStrategy = _.x("wil_icon_network_first");
      // this.renderWhenIdle = _.x("wil_icon_render_when_idle");
      // this.waitForAnimationFrame = !_.x("wil_icon_load_immediately");



    }

    cProto.handlePropertyChange = function (...a) { // 10+

      if(!this.__ytIconSetup588__) setupYtIcon(this);
      // string bool=false bool int=24 (empty string?) bool? bool
      // undefined bool=false bool int bool? true


      // if(typeof a[0]==='string'&& typeof (a[1]||false)==='boolean' && typeof a[2]==='boolean' && typeof a[3] === 'number'){

      //   if(a[0].)
      //   this.determineIconSet()
        
      // }

      // const lastData = this.__lastData__;
      // let newData = '';
      this.__resolved__ = {

      };

      // let chAction = null;

      // let returnNone = false;

      // // w.nextAddress  ... 
      // if(typeof a[0] === 'string' && a[0].length > 9 && a[1]===false && a[2] ===false && a[3]===24 && a[5] === true && a[0].length >= 3){

      //   console.log(12398, this.icon, this.iconsetName, this.iconType)
      //   if(this.icon === a[0]  &&  this.icon === `${this.iconsetName}:${this.iconType}` && this.iconType && this.iconsetName && typeof this.targetContainer === 'string'){

      //     console.log(12399)
      //     newData = `renderIcon_${this.targetContainer}_${this.icon}`;
      //     chAction = ()=>{
      //       this.renderIcon(this.targetContainer, this.icon);
      //       console.log('yt-icon.xxs')
      //     }

      //     returnNone = true;
          
      //   }
      // }


      // if(!newData) newData = `x${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}_${Date.now()}`;

      // if (lastData !== newData) {
      //   this.__lastData__ = newData;

      //   if (chAction && newData.startsWith('renderIcon_')) {
      //     stackTask(chAction);
      //   }

      // }
      const a01 = this.isAttached;
      let a02, a03;


      const t = this.__stackedKey3818__ = (this.__stackedKey3818__ & 1073741823) + 1;

      const stackFn = ()=>{
        if(t!== this.__stackedKey3818__){
          return;
        }
        a03 = this.isAttached;

        // if(!a02 && !a03){

        // }

        if(a01 === false && a02 === false && a03 === false) return;

        if(a01===true && a02===true && a03===true){

        }else{
          if(a01 === undefined && a02 === undefined && a03 === undefined && (this.hostElement || this).isConnected === false ){
            // unknown yt-icon#label-icon
            return;
          }else{
            console.log('[yt-icon] debug', a01, a02, a03, this)
          }
        }
       
        this.handlePropertyChange671(...arguments);

      };



      Promise.resolve().then(()=>{
        a02= this.isAttached;
        stackTask(stackFn);
      })



      

      // console.log('yt-icon.handlePropertyChange', ...arguments);

      // if(returnNone) return;
      // return this.handlePropertyChange671(...arguments);
    }

    cProto.determineIconSet = function (a, b, c, d) { // 10-

      if(!this.__ytIconSetup588__) setupYtIcon(this);
      // string bool? bool=false int=24
      // NOTIFICATIONS_NONE OR LIKE
      // console.log('yt-icon.determineIconSet', ...arguments);

      const r = this.determineIconSet671(...arguments);
      // if(r.then){
      //   r.then((result)=>{
      //     console.log('yt-icon.determineIconSet.result = ', result)
      // })
      // }
      return r;
    }

    cProto.switchToYtSysIconset = function (a, b, c, d) { // 10-

      if(!this.__ytIconSetup588__) setupYtIcon(this);
      // same as determineIconSet
      // console.log('yt-icon.switchToYtSysIconset', ...arguments);
      return this.switchToYtSysIconset671(...arguments);
    }

    cProto.useYtSysIconsetForMissingIcons = function(a, b, c, d){ // X

      if(!this.__ytIconSetup588__) setupYtIcon(this);
      // console.log('yt-icon.useYtSysIconsetForMissingIcons', ...arguments);
      return this.useYtSysIconsetForMissingIcons671(...arguments);
    }

    cProto.getIconManager = function(){ // 10+

      if(!this.__ytIconSetup588__) setupYtIcon(this);
      // no argument

      // if(this.iconsetName && this.iconType){
      //   const p = kRef(iconManagers[this.iconsetName]);
      //   if(p) return p;
      // }
      // console.log(2388, this.iconType)
      // console.log('yt-icon.getIconManager', ...arguments);
      if(!this.__resolved__)this.__resolved__ ={};
      if(!this.__resolved__.getIconManager) this.__resolved__.getIconManager = this.getIconManager671(...arguments);
      const r = this.__resolved__.getIconManager;
      // if(r.then){
      //   r.then((result)=>{
      //     iconManagers[this.iconsetName] = mWeakRef(result);   
      //     console.log('yt-icon.getIconManager.result = ', result)
      // })
      // }
      return r;
    }

    cProto.getIconShapeData = function(){ // 10+

      if(!this.__ytIconSetup588__) setupYtIcon(this);

      // let rr;
      // if (typeof (this.iconType || 0) === 'string' && typeof (this.iconsetName || 0) === 'string' && this.icon === `${this.iconsetName}:${this.iconType}` && (+this.size >= 1)) {
      //   const a = this;
      //   rr= {
      //     iconName: a.iconType.toLowerCase(),
      //     iconStyle: (a.active || a.defaultToFilled || c ? "youtube_fill" : "youtube_outline"),
      //     iconSize: a.size,
      //     iconSetName: a.iconsetName
      //   };

      // }

      // no argument
      // console.log('yt-icon.getIconShapeData', ...arguments);
      if(!this.__resolved__)this.__resolved__ ={};
      if(!this.__resolved__.getIconShapeData) this.__resolved__.getIconShapeData = this.getIconShapeData671(...arguments);
      const r = this.__resolved__.getIconShapeData;
      // if (r.then) {
      //   r.then((result) =>{

      //     console.log('yt-icon.getIconShapeData.result = ', result)
      //     console.log('yt-icon.getIconShapeData.resultxx = ', rr)
      //   } )
      // }
      


      /*

      temp1.resolveIcon({
                    iconName: a.iconType.toLowerCase(),
                    iconStyle: (a.active || a.defaultToFilled || c ? "youtube_fill" : "youtube_outline"),
                    iconSize: a.size,
                    iconSetName: a.iconsetName
                })

                */
      return r
    }

    cProto.renderIcon = function(a, b){ // X

      if(!this.__ytIconSetup588__) setupYtIcon(this);
      // "" yt-icons:xxx
      // console.log('yt-icon.renderIcon', ...arguments);
      return this.renderIcon671(...arguments);
    }

  });

  // stampDomArray_
  const createStampDomArrayFn_ = () => {
    // if (val_kevlar_should_maintain_stable_list === null) {
    //   const config_ = ((window.yt || 0).config_ || 0);
    //   val_kevlar_should_maintain_stable_list = ((config_ || 0).EXPERIMENT_FLAGS || 0).kevlar_should_maintain_stable_list === true;
    // }

    // if(true){


    const pSpace = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    document.documentElement.insertAdjacentElement('beforeend', pSpace);
    const pNode = document.createElement('ns-538');
    pSpace.insertAdjacentElement('beforeend', pNode);

    const pDiv = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    if (typeof pNode.attachShadow === 'function') {
      const pShadow = pNode.attachShadow({ mode: "open" });
      pShadow.replaceChildren(pDiv);
    } else {
      pNode.insertAdjacentElement('beforeend', pDiv);
    }

    const pDivTempRemoval = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    pDiv.insertAdjacentElement('beforeend', pDivTempRemoval);
    pDivTempRemoval.setAttribute('attm', 'pDivTempRemoval');

    const pDivDeletion =  document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    pDiv.insertAdjacentElement('beforeend', pDivDeletion);
    pDivDeletion.setAttribute('attm', 'pDivDeletion');
    const pDivKeep =  document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    pDiv.insertAdjacentElement('beforeend', pDivKeep);
    pDivKeep.setAttribute('attm', 'pDivKeep');


    const pDivDeletionObs = new MutationObserver(() => {
      let node = pDivDeletion.firstElementChild;
      while (node) {
        let nextNode = node.nextElementSibling;
        if (node.__delayRemoved__) {
          removeTNode(node)
          // } else {
          // node.remove();
        }
        node = nextNode;
      }
      if (pDivDeletion.firstChild) pDivDeletion.textContent = '';
    });
    pDivDeletionObs.observe(pDivDeletion, { childList: true, subtree: false });
    

    // const URa = function (a, b) {
    //   for (var c in a)
    //     if (a.hasOwnProperty(c) && b[c])
    //       return c;
    //   return null
    // }

    const syta = Symbol(); // container uid
    // const sytb = Symbol();
    const sytc = Symbol(); // data & parent relationship
    const sytd = Symbol(); // bind data and component (in case not .data relationship -- to be reviewed)
    const syte = Symbol(); // data uid

    // const tmpElementNode = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    let fallbackToDefault = false;

    const attributeMutationObserver = new MutationObserver((mutations) => {
      const targets = new Set();
      for (const mutation of mutations) {
        targets.add(mutation.target);
      }
      for (const container of targets) {
        const tag = container.__closestYtTag388__;
        if (tag) {
          const hostElement = container.closest(tag);
          if (hostElement && hostElement.is === tag) {
            const detail = {
              container
            };
            hostElement.dispatchEvent(new CustomEvent("yt-rendererstamper-finished", {
              bubbles: !0,
              cancelable: !1,
              composed: !0,
              detail
            }));
            detail.container = null;
          }
        }
      }
    });

    const stamperTasksA = {};

    const YRa = (a, b) => {
      for (const c in a)
        if (a.hasOwnProperty(c) && b[c])
          return c;
      return null
    }

    // let lastClickX33 = 0;
    // let minusX33 = 0;
    // document.addEventListener('pointerdown', ()=>{
    //   nextBrowserTick_(()=>{
    //     minusX33 = 10000;
    //   });
    //   minusX33 = 0;
    //   lastClickX33 = Date.now();
    // },true);
    // document.addEventListener('keydown', ()=>{
    //   nextBrowserTick_(()=>{
    //     minusX33 = 10000;
    //   });
    //   minusX33 = 0;
    //   lastClickX33 = Date.now();
    // },true);
    // document.addEventListener('keyup', ()=>{
    //   nextBrowserTick_(()=>{
    //     minusX33 = 10000;
    //   });
    //   minusX33 = 0;
    //   lastClickX33 = Date.now();
    // },true);
    // document.addEventListener('pointerup', ()=>{
    //   nextBrowserTick_(()=>{
    //     minusX33 = 10000;
    //   });
    //   minusX33 = 0;
    //   lastClickX33 = Date.now();
    // },true);

    // document.addEventListener('pointercancel', ()=>{
    //   nextBrowserTick_(()=>{
    //     minusX33 = 10000;
    //   });
    //   minusX33 = 0;
    //   lastClickX33 = Date.now();
    // },true);

    let pageFirstDom = '';

    // let emComponents = new Set();
    let withStampDomExx = false;

    const DEBUG_STAMP_CHANGE = false;


    const reuseStore = typeof WeakRef === "function" && typeof FinalizationRegistry === "function" ? new Map() : null;
    const registry = typeof WeakRef === "function" && typeof FinalizationRegistry === "function" ? new FinalizationRegistry((heldValue) => {
      DEBUG_STAMP_CHANGE && console.log(`Object(${heldValue}) has been released`);
    }) : null;

    const registerFn = typeof WeakRef === "function" && typeof FinalizationRegistry === "function" ? (node, heldValue) => {
      Promise.resolve(node).then((node) => {
        registry.register(node, heldValue);
      });
    } : () => { }


    const go = function (a, b, c, d) {
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

    const removeTNode = (node) => { // need trigger removal of its parent component
      const xdeadv = xdeadc00.__domApi;
      if (node.isConnected === true) {
        if (node.parentNode !== pDivDeletion) {
          pDivDeletion.insertAdjacentHTML('afterbegin', ttpHTML('<!---->'));
          pDivDeletion.lastChild.replaceWith(node); // attached -> attached
        }

        // xdeadv.appendChild(node); // attached -> detached
        // xdeadv.removeChild(node); // detached -> detached

        node.remove(); // attached -> detached
        xdeadv.appendChild(node); // detached -> detached
        xdeadv.removeChild(node); // detached -> detached
      } else {
        

        node.remove(); // detached -> detached
        xdeadv.appendChild(node); // detached -> detached
        xdeadv.removeChild(node); // detached -> detached

        // xdeadv.appendChild(node); // detached -> detached
        // xdeadv.removeChild(node); // detached -> detached
      }
    }


    const removeTNodeDelayed = (node) => {
      if (node.isConnected === true) {
        node.__delayRemoved__ = true;
        pDivDeletion.insertAdjacentHTML('afterbegin', ttpHTML('<!---->'));
        pDivDeletion.lastChild.replaceWith(node); // attached -> attached
      } else {
        const xdeadv = xdeadc00.__domApi;
        xdeadv.appendChild(node); // detached -> detached
        xdeadv.removeChild(node); // detached -> detached
      }
    }

    let triggerCountWithinMicro = 0;

    

    const gn = function (items__, containerId, componentConfig, bReuseComponent, bEventCallback, bStableList) {
      if (!xdeadc00) setupXdeadC(this);
      let useSyncE = false; // essential components
      // let useNative = false; // native
      let disableTaskSkip = false;
      

      triggerCountWithinMicro++;
      const triggerCountWithinMicro_ = triggerCountWithinMicro;
      Promise.resolve().then(() => {
        triggerCountWithinMicro--;
      });

      const stack = new Error().stack;

      let appendFrag = null;


      // const safeFn0 = (items, containerId, componentConfig, bReuseComponent, bEventCallback, bStableList) => {

      //   let err, result;


      //   const qv1 = config.DEFERRED_DETACH;
      //   const qv2 = config.REUSE_COMPONENTS;
      //   const qv3 = config.STAMPER_STABLE_LIST;
      //   if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = false;
      //   if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = false;
      //   // if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = false;


      //   try {
      //     result = this.stampDomArray9682_(items, containerId, componentConfig, bReuseComponent, bEventCallback, bStableList);
      //   } catch (e) {
      //     err = e;
      //   }

      //   if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = qv1;
      //   if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = qv2;
      //   // if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = qv3;

      //   if (err) throw err;

      //   return result;


      // };

      // const safeFn = (items, containerId, componentConfig, bReuseComponent, bEventCallback, bStableList) => {

      //   let err, result;


      //   const qv1 = config.DEFERRED_DETACH;
      //   const qv2 = config.REUSE_COMPONENTS;
      //   const qv3 = config.STAMPER_STABLE_LIST;
      //   if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = false;
      //   if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = false;
      //   if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = false;


      //   try {
      //     this.stampDomArray9682_(null, containerId, null, bReuseComponent, null, null);
      //     result = this.stampDomArray9682_(items, containerId, componentConfig, bReuseComponent, bEventCallback, bStableList);
      //   } catch (e) {
      //     err = e;
      //   }

      //   if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = qv1;
      //   if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = qv2;
      //   if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = qv3;

      //   if (err) throw err;

      //   return result;


      // };

      // const safeClear = (containerId, bEventCallback, finishState) => {

      //   let err, result;


      //   const qv1 = config.DEFERRED_DETACH;
      //   const qv2 = config.REUSE_COMPONENTS;
      //   const qv3 = config.STAMPER_STABLE_LIST;
      //   if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = false;
      //   if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = false;
      //   if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = false;


      //   try {
      //     this.stampDomArray9682_(null, containerId, null, false, null, null);
      //     const k = this.getStampContainer_(containerId);

      //     if (finishState & 1) {
      //       this.flushRenderStamperComponentBindings_();
      //     }
      //     if (finishState & 2) {
      //       this.markDirty && this.markDirty();
      //     }
      //     if (finishState & 4) {
      //       bEventCallback && go(this.hostElement, "yt-rendererstamper-finished", {
      //         container: k
      //       });
      //     }
      //   } catch (e) {
      //     err = e;
      //   }

      //   if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = qv1;
      //   if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = qv2;
      //   if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = qv3;

      //   if (err) throw err;

      //   return result;


      // };



      // const safeAppendElm = (elm, items, containerId, componentConfig, bEventCallback, removeExisting, finishState) => {

      //   let err, result;


      //   const qv1 = config.DEFERRED_DETACH;
      //   const qv2 = config.REUSE_COMPONENTS;
      //   const qv3 = config.STAMPER_STABLE_LIST;
      //   if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = false;
      //   if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = false;
      //   if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = false;


      //   try {
      //     if (removeExisting) this.stampDomArray9682_(null, containerId, null, false, null, null);
      //     const c = componentConfig;
      //     const k = this.getStampContainer_(containerId);
      //     const b = k.__domApi || k;

      //     const g = appendFrag || (appendFrag = document.createDocumentFragment());
      //     let r;
      //     for (let i = 0, l = items.length; i < l; i++) {
      //       const u = items[i];
      //       const w = YRa(c, u);
      //       if (w) {
      //         r = elm;
      //         this.deferRenderStamperBinding_(r, c[w], u[w]);
      //         g.appendChild(r);
      //       }
      //     }
      //     b.appendChild(g)

      //     if (finishState & 1) {
      //       this.flushRenderStamperComponentBindings_();
      //     }
      //     if (finishState & 2) {
      //       this.markDirty && this.markDirty();
      //     }
      //     if (finishState & 4) {
      //       bEventCallback && go(this.hostElement, "yt-rendererstamper-finished", {
      //         container: k
      //       });
      //     }
      //   } catch (e) {
      //     err = e;
      //   }

      //   if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = qv1;
      //   if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = qv2;
      //   if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = qv3;

      //   if (err) throw err;

      //   return result;


      // };


      const safeAppend = (items, containerId, componentConfig, bEventCallback, removeExisting, finishState) => {

        let err, result;


        const qv1 = config.DEFERRED_DETACH;
        const qv2 = config.REUSE_COMPONENTS;
        const qv3 = config.STAMPER_STABLE_LIST;
        if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = false;
        if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = false;
        if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = false;


        try {
          if (removeExisting) this.stampDomArray9682_(null, containerId, null, false, null, null);
          const c = componentConfig;
          const k = this.getStampContainer_(containerId);
          const b = k.__domApi || k;
          /*
          const g = document.createDocumentFragment();
          let r;
          for(let i = 0, l =items.length; i<l;i++){
            const u = items[i];
            const w = YRa(c, u);
            if (w) {
              r = this.createComponent_(c[w], u[w], false);
              this.deferRenderStamperBinding_(r, c[w], u[w]);
              g.appendChild(r);
            }
          }
          b.appendChild(g)
          */

          const g = appendFrag || (appendFrag = document.createDocumentFragment());
          let r;
          for (let i = 0, l = items.length; i < l; i++) {
            const u = items[i];
            const w = YRa(c, u);
            if (w) {
              r = this.createComponent_(c[w], u[w], false);
              this.deferRenderStamperBinding_(r, c[w], u[w]);
              g.appendChild(r);
            }
          }
          b.appendChild(g)

          if (finishState & 1) {
            this.flushRenderStamperComponentBindings_();
          }
          if (finishState & 2) {
            this.markDirty && this.markDirty();
          }
          if (finishState & 4) {
            bEventCallback && go(this.hostElement, "yt-rendererstamper-finished", {
              container: k
            });
          }
        } catch (e) {
          err = e;
        }

        if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = qv1;
        if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = qv2;
        if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = qv3;

        if (err) throw err;

        return result;


      };


      const safeFinish = (containerId, bEventCallback) => {

        let err, result;


        const qv1 = config.DEFERRED_DETACH;
        const qv2 = config.REUSE_COMPONENTS;
        const qv3 = config.STAMPER_STABLE_LIST;
        if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = false;
        if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = false;
        if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = false;


        try {
          const k = this.getStampContainer_(containerId);

          this.flushRenderStamperComponentBindings_();
          this.markDirty && this.markDirty();
          bEventCallback && go(this.hostElement, "yt-rendererstamper-finished", {
            container: k
          });

        } catch (e) {
          err = e;
        }

        if (typeof qv1 !== 'undefined') config.DEFERRED_DETACH = qv1;
        if (typeof qv2 !== 'undefined') config.REUSE_COMPONENTS = qv2;
        if (typeof qv3 !== 'undefined') config.STAMPER_STABLE_LIST = qv3;

        if (err) throw err;

        return result;


      };

      const stamperTasksKey = `${this.is}::${containerId}`;
      const stamperTasks = stamperTasksA[stamperTasksKey] || (stamperTasksA[stamperTasksKey] = []);

      let renderJob = this.renderJobsMap_ && containerId ? this.renderJobsMap_[containerId] : null;
      const items_ = items__;

      const hasRunningTasks = stamperTasks.length >= 1;

      const config = (win.yt || 0).config_ || (win.ytcfg || 0).data_ || 0;
      if (!config) {
        console.warn('no config');
        fallbackToDefault = true;
      }

      if (!this.deferredBindingTasks_ || this.deferredBindingTasks_.length !== 0) {
        console.warn('no deferredBindingTasks_');
        fallbackToDefault = true;
      }

      const container = typeof this.getStampContainer_ === 'function' ? this.getStampContainer_(containerId) : (this.$ || 0)[containerId];

      if (!container) {
        console.warn('no container');
        fallbackToDefault = true;
      }
      if (!container.__xnHook944__) {
        if (container.__xnHook944__ === 2) {
          console.log('skip handling weird element (2)');
          return this.stampDomArray9682_(...arguments);// skip handling weird element
        }
        if (container.firstElementChild) {
          container.__xnHook944__ = 2;
          console.log('skip handling weird element (1)');
          return this.stampDomArray9682_(...arguments);// skip handling weird element
        }
        container.__xnHook944__ = 1;
        if (container.firstElementChild) {
          debugger;
          console.warn('container element?')
        }
        try {
          this.stampDomArray9682_(null, containerId, null, false, false, false); // bind the yt dom api
        } catch (e) { }
      }
      if (container.__domApi && !container.__domApi.__daHook377__) {
        setupDomApi(Reflect.getPrototypeOf(container.__domApi));
        setupSDomWrapper();
      }



      // if (!hasRunningTasks && !this[keyRequireAsync] && triggerCountWithinMicro_ === 1) {

      //   useSyncE = true;
      //   // useNative = true;
     
        
      // }
      // if(this.is === 'ytd-shorts' ||  this.hostElement.closest('ytd-shorts')) useNative = true;

      // const isParentFrag = this?.hostElement?.parentNode instanceof DocumentFragment_;
      // const isParentNode = this?.hostElement?.parentNode instanceof Node;

      // if(isParentFrag){
      //   // useNative = true;
      // }else if(isParentNode && bStableList !== false){

        
      //   if (bStableList || this.is === 'ytd-shorts' || this?.hostElement?.parentNode?.hasAttribute('__stampWithStableList__')) {
      //     if(!this[`__stamperStable#${containerId}__`]){

      //       console.log(12883, bStableList)

      //       this[`__stamperStable#${containerId}__`] = true;

      //       containerElement.setAttribute('__stampWithStableList__', '');
      //       this[`__stamperStable__`] = true;

      //     }
      //   }

      //   if(containerElement.closest('[__stampWithStableList__]')) useNative = true;
      // }

      // if(this.parentComponent){
      //   if(this.parentComponent.__stamperStable__){
      //     this[`__stamperStable__`] = true;
      //     useNative = true;
      //   }
      // }

      // if(containerElement.hasAttribute('__stampWithStableList__')) useNative = true;


      // if(useNative) fallbackToDefault = true;




      if (fallbackToDefault) {
        // this[keyRequireAsync] = this[key5993] = this[key5996] = null;
        return this.stampDomArray9682_(...arguments);
      }


      const bStableListA = bStableList !== undefined ? Boolean(bStableList) : (typeof config.STAMPER_STABLE_LIST !== "undefined" ? !!config.STAMPER_STABLE_LIST : false);

      const containerDomApi = (container || 0).__domApi || container;
      const containerElement = containerDomApi instanceof Node ? containerDomApi : insp(container).hostElement instanceof Node ? insp(container).hostElement : container;

      const keyRequireAsync = `__stamperRequireAsync#${containerId}__`;
      const key5993 = `__stamperCounter5993#${containerId}__`;
      const key5996 = `__stamperCounter5996#${containerId}__`;
      // const keyOnSync = `__stamperOnSync#${containerId}__`;



      let hasKey = false;
      if (items_ && items_.length >= 1) {

        hasKey = items_.some((v) => (typeof YRa(componentConfig, v) === 'string'));

      }

      if (bEventCallback) {
        if (!container.__rendererStamperEventCallback388__) {
          container.__rendererStamperEventCallback388__ = true;
          container.__closestYtTag388__ = this.is;
          attributeMutationObserver.observe(container, { attributes: ['ytxx-stamper-finished'] });
        }
      }


      if (!this.__rendererStamperFinishFn588__) {
        this.__rendererStamperFinishFn588__ = () => {
          if (this.deferredBindingTasks_ && this.deferredBindingTasks_.length >= 1) {
            this.flushRenderStamperComponentBindings_();
          }
          this.markDirty && this.markDirty();
        };

      }




      const items = hasKey ? items_.slice() : []; // avoid memory leakge

      this[key5993] = (this[key5993] & 1073741823) + 1;
 

      let leaveWithNoChange = false;


      if (!hasRunningTasks && !this[keyRequireAsync]) {
        if (!pageFirstDom) { // initial stamp action
          pageFirstDom = this.is;
          useSyncE = true;
          this.__stampDomExx__ = true;
        } else if (this.__stampDomExx__) { // essential component
          useSyncE = true;
        } else if (!withStampDomExx) { // not ready
          useSyncE = true;
        } else if (triggerCountWithinMicro_ === 1) { // first stamp action (user action)
          useSyncE = true;
        }
        if (!hasKey) { // noChange
          leaveWithNoChange = true;
          useSyncE = true;
        }
      }

      const useSync_ = useSyncE;
      const tryBatchUpdate_ = !useSync_ && (renderJob || hasRunningTasks || this[keyRequireAsync]);

      const skey = stamperTasks.__skey__ = `${Date.now()}`;

      let taskFinish = false;

      let result;

      let skipToNextTask = false;

      stamperTasks.push(() => {
        if (skey !== stamperTasks.__skey__ && !disableTaskSkip) {
          skipToNextTask = true;
          // taskFinish = true;
        }
      });

      if (leaveWithNoChange) {
        if (container.__rendererStamperEventCallback388__) {
          stamperTasks.push(() => {
            if (taskFinish) return;
            if(skipToNextTask) return;
            if (container.__rendererStamperEventCallback388__) {
              taskFinish = true;
              container.setAttribute('ytxx-stamper-finished', (container.getAttribute('ytxx-stamper-finished') & 7) + 1);
              return;
            }
          });
        }
      } else {

        this[key5996] = (this[key5996] & 1073741823) + 1;
      }

      // this[key5996] = (this[key5996] & 1073741823) + 1;


 



      containerElement[syta] = containerElement[syta] || `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}_${Date.now()}`;
      containerElement[sytd] = containerElement[sytd] || new WeakMap();

      const mkData = new Set();

      const pneItems = items.map(eq => {
        const dataKey = firstObjectKey(eq);
        const dataKey2 = YRa(componentConfig, eq)
        if (dataKey && dataKey2 === dataKey) {
          const targetComponentName = this.getComponentName_(componentConfig[dataKey], eq[dataKey]);
          const data = eq[dataKey];
          // if (data) data[sytb] = (data[sytb] & 1073741823) + 1;
          if (data) {
            data[syte] = data[syte] || `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}_${Date.now()}`;
            const arr = new Set((data[sytc] || '').split(','));
            arr.delete('');
            arr.add(containerElement[syta]);
            data[sytc] = [...arr].join(',');
            // addData.add(data);
            mkData.add(data[syte]);
            const dte = data[syte];
            return {
              targetComponentName,
              dataKey,
              data,
              item: eq,
              dte
            }
          }
        }
        return {
          data: void 0,
          item: eq,
          dte: ''
        };
      }).filter(e=>!!e.dte);


      let elementIter = containerElement.firstElementChild;
      const uneElements = !elementIter ? [] : new Array(containerElement.childElementCount);
      for (let i = 0, l = uneElements.length; i < l; i++) {
        const pageElement = elementIter;
        if (!pageElement) {
          uneElements.length = i;
          break;
        }
        const pageElementData = kRef(containerElement[sytd].get(pageElement));
        const dte_ = pageElement[syte];
        const dte = pageElementData && dte_ && pageElementData[syte] === dte_ && (insp(pageElement).data || 0)[syte] === dte_ ? dte_ : '';

        uneElements[i] = {
          pageElement: pageElement,
          pageElementData: pageElementData,
          dte
        }
        elementIter = elementIter.nextElementSibling;
      }


      const reuseKey = `${containerElement[syta]}**${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}_${Date.now()}`


      let reuseRefreshMode = 1;

      const setupComponent = (data, component, refNode, deferredBindingTask, reused = false) => {

        let noRenderTaskForResuedComponent = false;
        if (component instanceof Node) {


          if (data && data[syte]) {
            // component[sytb] = data[sytb]
            component[sytc] = data[sytc]
            component[syte] = data[syte];
            // containerElement[sytd].set(data, mWeakRef(component));
            containerElement[sytd].set(component, mWeakRef(data));
            if(reuseStore) reuseStore.set(data[syte], mWeakRef(component));
          }

          const cnt = insp(component);

          if (reused && reuseRefreshMode >= 1 && cnt.data) {
            if (!cnt.__refreshData938__) {
              cnt.constructor.prototype.__refreshData938__ = __refreshData938__;
            }
            try {
              cnt.__refreshData938__('data', !0);
              if(reuseRefreshMode >= 2) noRenderTaskForResuedComponent = true;
            } catch (e) {  
            }
          }

          if (refNode !== undefined) {
            const componentX = component;
            if (componentX instanceof Node) {
              if (refNode !== componentX) {
                if (!refNode) {
                  containerElement.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
                  containerElement.lastChild.replaceWith(componentX);
                } else {
                  refNode.insertAdjacentHTML('beforebegin', ttpHTML('<!---->'));
                  refNode.previousSibling.replaceWith(componentX);
                }
              }
            }

          }

          if (noRenderTaskForResuedComponent) {

          } else if (deferredBindingTask && deferredBindingTask.typeOrConfig) {
            this.deferredBindingTasks_.push(deferredBindingTask);
            this.flushRenderStamperComponentBindings_();
            if (this.deferredBindingTasks_.length >= 1) this.deferredBindingTasks_.length = 0;
          }

          return true;

        }
        return false;

      }

      // if(!useNative)
         stamperTasks.push(() => {

        if (taskFinish) return;
        if(skipToNextTask) return;

        // if(skipToNextTask) return;


        let tryStable = null;
        if (bStableListA) {
          tryStable = {};

          pneItems.forEach(pneItem => {


            const { item, dte, data, dataKey, targetComponentName } = pneItem;


            const q_ = reuseStore ? kRef(reuseStore.get(dte)) : null; // no rendered dom for the item

            if (!q_) {

              if(!tryStable[targetComponentName]) tryStable[targetComponentName] = new Set();

              tryStable[targetComponentName].add((node)=>{

                const component = node;
                const oldDte = node[syte];
                const cnt = insp(node);
                if (oldDte && oldDte !== dte && node.parentNode === containerElement && data && data[syte] && cnt.data && cnt.data[syte] ) {

                  this.telemetry_.reuse++;

                  // console.log(123992, node, componentConfig[dataKey], data, cnt.data, oldDte, dte )

                  // play safe
                  // component[sytb] = null;
                  component[sytc] = null;
                  component[syte] = null;
                  containerElement[sytd].delete(component);
                  // play safe

                  if (reuseStore) reuseStore.delete(oldDte);
                  node[syte] = dte;
                  node.___reuseFor__ = reuseKey; // once only



                  // cnt.data = data;
                  const deferredBindingTaskX = { component: component, typeOrConfig: componentConfig[dataKey], data: data }
                  setupComponent(data, component, undefined, deferredBindingTaskX, true);

                  // console.log(123993,'true')

                  return true;


                }

                return false;

              });

            }

          })

        }


        const removes = [];


        let node = containerElement.firstElementChild;
        while (node !== null) {

          const dte = node[syte];
          const nextNode = node.nextElementSibling;


          const tryStableCur = tryStable ? tryStable[node.is] : null;

          if (tryStableCur && dte && !mkData.has(dte) && tryStableCur.size >= 1) {
            // to be removed as no equal entry, but try to make it for tryStable

            // this.deferRenderStamperBinding_(r, c[t], g[t]);
            const fn = tryStableCur.values().next().value;
            tryStableCur.delete(fn) && fn(node);
            // this.deferRenderStamperBinding_(r, c[t], g[t]);

          }

          if(node.___reuseFor__ === reuseKey){


          } else if (!(typeof (dte || 0) === 'string' && mkData.has(dte))) {

            // console.log(insp(node).data);
            // console.log(items)
            removes.push(node);
            // q30 = true;
            // u.removeChild(node)
            // try{
            //   v.removeChild(node); // just to trigger some internal removal
            // }catch(e){
            // }
          }
          node = nextNode;

        }

        tryStable = null;

        if(removes.length === 0) return;

        // let xdeadc = xdeadc00;
        if (!xdeadc00) setupXdeadC(this);
        // const xdeadv = xdeadc.__domApi;

        for (const node of removes) {
          removeTNode(node);
          registerFn(node, '01');
        }

        // safeClear(containerId, null, 2 | 4)

      });
      


      let refNode = null;
      let refNodeIdx = -1;

      const taskPerPneItem = (pneItem) => {


        let reused = false;

        const { item, dte, data, dataKey, targetComponentName } = pneItem;

        refNode = ++refNodeIdx === 0 ? containerElement.firstElementChild : refNode && refNode.nextElementSibling;


        const q_ = reuseStore ? kRef(reuseStore.get(dte)) : null;
        const q = (q_ && (q_.___reuseFor__ === reuseKey || q_.closest('defs'))) ? q_ : null;

        let deferredBindingTaskX = null;
        let component = null;
        if (q && q.is === targetComponentName) {

          if (q_.closest('defs')) {

            const node = component = q;
            const cnt = insp(node);
            cnt.data = data;
            deferredBindingTaskX = { component: q, data: data }
            // listX.push(deferredBindingTaskX);

            DEBUG_STAMP_CHANGE && console.log('reuse X0')
            reused = true;

          } else {

            const node = component = q;
            const cnt = insp(node);
            // cnt.data = data;
            deferredBindingTaskX = { component: q, typeOrConfig: componentConfig[dataKey], data: data }
            // listX.push(deferredBindingTaskX);

            reused = true;

            DEBUG_STAMP_CHANGE && console.log('reuse S0')

          }



        } else {

          // console.log('new')


          // const qf2 = this.deferRenderStamperBinding_;
          // let deferredBindingTaskX = null;
          this.deferRenderStamperBinding_ = function (a, b, c) {
            deferredBindingTaskX = {
              component: a,
              typeOrConfig: b,
              data: c
            };
          }

          // console.log(23400, containerElement.childElementCount)
          safeAppend([item], containerId, componentConfig, bEventCallback, false, 0 | 2 | 4);

          // console.log(23401, containerElement.childElementCount)

          // safeFn([item], containerId, componentConfig, false, bEventCallback, false);

          delete this.deferRenderStamperBinding_;
          // this.deferRenderStamperBinding_ = qf2;
          // console.log(deferredBindingTaskX)
          // listX.push(deferredBindingTaskX);

          component = deferredBindingTaskX.component;

        }


        if (setupComponent(data, component, refNode, deferredBindingTaskX, reused)) {

          refNode = component;
        }




      }

      // if (!useNative)
      pneItems.forEach((pneItem, idx) => {

        stamperTasks.push(() => {
          if (taskFinish) return;
          if (skipToNextTask) return;

          if (skipToNextTask) {

            if (idx === 0) {

              for (const pneItem of pneItems) {

                taskPerPneItem(pneItem);
              }
            } else {
              // skip

            }
          } else {


            taskPerPneItem(pneItem);

          }

        });


      });


      // if(!useNative)
      stamperTasks.push(() => {
        if (taskFinish) return;
        if (skipToNextTask) return;
        // if (skipToNextTask) return;
        let node = refNode;
        if (!node) return;
        node = node.nextElementSibling;
        while (node) {
          let nextNode = node.nextElementSibling;
          removeTNode(node);
          registerFn(node, '02');
          node = nextNode;
        }
      });



      // if(useNative && stamperTasks.length === 0){


      //   this.stampDomArray9682_(...arguments); 
      //   return;

      // }


      // if (useNative) {

      //   useSyncE = true;

      //   stamperTasks.push(() => {

      //     if (taskFinish) return;
      //     // if (skipToNextTask) return;

      //     // safeFn0(items__, containerId, componentConfig, false, bEventCallback, false);
      //     // safeFn(pneItems.map(e => e.item), containerId, componentConfig, false, bEventCallback, false)

      //     // this.stampDomArray9682_(items_, containerId, componentConfig, false, bEventCallback, false);
      //     // this.stampDomArray9682_(pneItems.map(e => e.item), containerId, componentConfig, false, bEventCallback, false);


      //     safeFn0(pneItems.map(e => e.item), containerId, componentConfig, bReuseComponent, bEventCallback, bStableList);
      //     // this.stampDomArray9682_(pneItems.map(e => e.item), containerId, componentConfig, bReuseComponent, bEventCallback, bStableList);

      //     // this.stampDomArray9682_(...arguments);
      //   })

      // }



      stamperTasks.push(() => {


        if (!skipToNextTask) {

          safeFinish(containerId, bEventCallback);
        }

      });


      this[keyRequireAsync] = (this[keyRequireAsync] || 0) + 1;


      stamperTasks.push(() => {

        if (!skipToNextTask) {

          this.__rendererStamperFinishFn588__();
        }

        this[keyRequireAsync] = (this[keyRequireAsync] || 0) - 1;

      });


      if(
        // useNative &&
         !leaveWithNoChange) {
        disableTaskSkip = true;

        const tasks = stamperTasks.slice();
        stamperTasks.length = 0;

        for (const task of tasks) {
          task();
        }
        return;
      }

      
      if (useSync_) {

        disableTaskSkip = true;

        // [[ FOR CRITICAL TASK ]]

        // if (!this[keyOnSync]) this[keyOnSync] = 0;
        // this[keyOnSync]++;

        // const pr = marcoPr;
        // console.log(2992, pr, trackMarcoCm.data)
        // trackMarcoCm.data = `${(trackMarcoCm.data & 7) + 1}`;
        // pr.then(() => {
        //   this[keyOnSync]--;
        //   // console.log(3992, this.is);
        // });

        const tasks = stamperTasks.slice();
        stamperTasks.length = 0;

        for (const task of tasks) {
          task();
        }

        if (!withStampDomExx && useSyncE && this.is === pageFirstDom) {
          // we treat the components generated by initial stampDom as important

          for (const elm of document.getElementsByTagName('*')) {
            if (elm.is) {
              insp(elm).__stampDomExx__ = true;
              // emComponents.add(elm.is);
            }
          }
          withStampDomExx = true;
        }

      } else {

        if (!hasRunningTasks) {

          const f = () => {
            if (!stamperTasks.length) return;
            const tasks = stamperTasks.slice();
            stamperTasks.length = 0;
            executeTaskBatch(tasks.map(fn => ({ fn })), false);
          }

          if (tryBatchUpdate_) {
            nextBrowserTick_(f);// collecting all tasks (after reflow)
          } else {
            queueMicrotask_(f); // collecting some tasks (before reflow)
          }

        }

      }

      return;





    }

    return gn;

  };


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

  // const keyStDisconnectedCallback = Symbol(); // avoid copying the value
  const cmf = new WeakMap();
  const dmf = new WeakMap();

  const gvGenerator = (nv) => {
    return function () {
      const cnt = insp(this);
      const hostElement = cnt.hostElement || 0;
      const dollar = hostElement ? (this.$ || indr(this)) : 0;
      let p = (hostElement instanceof HTMLElement) && (dollar || !this.is);
      if (p && (!dollar && !this.is)) {
        const nodeName = hostElement.nodeName;
        if (typeof nodeName !== 'string') {
          // just in case
        } else if (nodeName.startsWith("DOM-")) {
          // dom-if, dom-repeat, etc
        } else {
          // yt element - new model, yt-xxxx, anixxxxxx
          p = false;
        }
      }
      if (p) {
        if (typeof cnt.markDirty === 'function') {
          // the yt element might call markDirty (occasionally)
          p = false;
        } else if (this.is === 'ytd-engagement-panel-section-list-renderer') {
          // see https://github.com/cyfung1031/userscript-supports/issues/20
          p = false;
        }
      }
      if (p) {

        // << dom-repeat & dom-if >>

        // sequence on the same instance
        this[qm57] = (this[qm57] || Promise.resolve()).then(() => nv.apply(this, arguments)).catch(console.log);
      } else {
        nv.apply(this, arguments);
      }
    };
  }

  // const assignedHolderWS = new WeakSet();

  const setupWeakRef = (h) => {


  }


  let nativeHTMLElement = window.HTMLElement;

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

  let stampDomArrayMethod = null;
  const setupMap = new WeakSet();

  // const ENABLE_weakenStampReferencesQ = ENABLE_weakenStampReferences && typeof DocumentTimeline !== 'undefined' && typeof WeakRef !== 'undefined';
  const setupYtComponent = (cnt) => {
    const cProto = (cnt || 0).__proto__ || 0;
    if (!cProto || setupMap.has(cProto)) return;
    setupMap.add(cProto);
    if (FIX_stampDomArray && !(cProto[pvr] & 1) && 'stampDomArray_' in cProto) {
      cProto[pvr] |= 1;
      if (FIX_stampDomArray && cProto.stampDomArray_ && !cProto.stampDomArray9682_) {
        if (!stampDomArrayMethod) stampDomArrayMethod = createStampDomArrayFn_();
        cProto.stampDomArray9682_ = cProto.stampDomArray_;
        cProto.stampDomArray_ = stampDomArrayMethod;
      }
    }
    if (ENABLE_discreteTasking && !(cProto[pvr] & 2) && (typeof (cProto.is || 0) === 'string' || ('attached' in cProto) || ('isAttached' in cProto))) {
      cProto[pvr] |= 2;
      setupDiscreteTasks(cProto);
    }
  };

  (ENABLE_discreteTasking || FIX_stampDomArray) && Object.defineProperty(Object.prototype, 'connectedCallback', {
    get() {
      
      const f = this[keyStConnectedCallback];
      if (this.is) {
        setupYtComponent(this);
      }
      /*
      if (this.is) {
        setupDiscreteTasks(this, true);
        if (f) this.ky36 = 1;
      }
      */
      return f;
    },
    set(nv) {
      let gv = nv;
      /*
      if (typeof nv === 'function') {

        gv = cmf.get(nv) || gvGenerator(nv);
        if (gv !== nv) {
          cmf.set(nv, gv);
          cmf.set(gv, gv);
          dmf.set(gv, nv);
        }

      } else {
        gv = nv;
      }
      */
      this[keyStConnectedCallback] = gv; // proto or object
      /*
      if (this.is) {
        setupDiscreteTasks(this);
      }
      */
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

  ; FIX_Iframe_NULL_SRC && !isChatRoomURL && typeof kagi === 'undefined' && (() => {

    const emptyBlobUrl = URL.createObjectURL(new Blob([], { type: 'text/html' }));
    const lcOpt = { sensitivity: 'base' };
    document.createElement24 = document.createElement;
    document.createElement = function (t) {
      if (typeof t === 'string' && t.length === 6) {
        if (t.localeCompare('iframe', undefined, lcOpt) === 0) {
          const p = this.createElement24(t);
          try {
            const stack = new Error().stack;
            const isSearchbox = stack.includes('initializeSearchbox'); // see https://greasyfork.org/scripts/473972-youtube-js-engine-tamer/discussions/217084
            if (!isSearchbox) {
              p.src = emptyBlobUrl; // avoid iframe is appended to DOM without any url
            }
          } catch (e) { }
          return p;
        }
      }
      return this.createElement24.apply(this, arguments);
    };

  })();

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

  const fnIntegrity = (f, d) => {
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

      if (typeof appCnt.createComponent_ !== 'function' || appCnt.createComponent_.length != 3) return;


      const mapGet = Map.prototype.get;


      /** @type {Map | null} */
      let qcMap = null;

      Map.prototype.get = function (a) {
        if (a === 'dummy-4718') qcMap = this;
        return mapGet.call(this, a);
      };
      const r = appCnt.createComponent_('dummy-4718', {}, true);
      Map.prototype.get = mapGet;

      if (r && (r.nodeName || '').toLowerCase() === 'dummy-4718') {


        // clearInterval(ckId);
        // ckId = 0;

        if (qcMap !== null && qcMap instanceof Map) {

          console.log('[yt-js-engine-tamer] qcMap', qcMap);

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

          const cleaning = function () {
            qcMap.forEach(setArrayC);
            qcMap.clear();
          }

          qcMap.set = function (b, c) {

            setArrayC(c);

            // console.log('qcMap.set', b, c);

            if (qcMap.size > 0) {
              // play safe

              console.log('[yt-js-engine-tamer] qcMap', 'clear 01')
              cleaning();
            }

          }
          qcMap.get = function (b) {

            // console.log('qcMap.get', b);

            if (qcMap.size > 0) {
              // play safe

              console.log('[yt-js-engine-tamer] qcMap', 'clear 02')
              cleaning();
            }

          }


          if (qcMap.size > 0) {

            console.log('[yt-js-engine-tamer] qcMap', 'clear 03')
            cleaning();
          }

        }

      }


    });


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
        generalEvtHandler('onVideoProgress', 'onVideoProgress57', FIX_VideoEVENTS_DEBUG); // --
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



    (ENABLE_discreteTasking || FIX_Polymer_dom || FIX_stampDomArray ) && (async () => {

      const Polymer = await polymerObservable.obtain();
      if (!Polymer) return;

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


        // getOwnerRoot - to be reviewed
        if (0 && checkPDFuncValue(pd1) && checkPDFuncGet(pd2) && !domXP.getOwnerRoot15 && typeof domXP.getOwnerRoot === 'function') {

          domXP.getOwnerRoot15 = domXP.getOwnerRoot;
          domXP.getOwnerRoot = function () {
            try {
              const p = this.node;

              if (p instanceof HTMLElement) {
                const pp = pd2.get.call(p);
                if (pp instanceof HTMLElement && pp.isConnected === true) {
                  return pp.getRootNode();
                }

              }
            } catch (e) { }
            return this.getOwnerRoot15();
          }

          Polymer.__fixedGetOwnerRoot__ = 1;
        }




        if ((!pd3 || checkPDFuncValue(pd3)) && checkPDFuncValue2(pd4) && checkPDFuncValue2(pd4b) && !('querySelector15' in domXP)) {

          domXP.querySelector15 = domXP.querySelector;

          const querySelectorFn = function (query) {
            try {
              const p = this.node;

              // if (p instanceof HTMLElement && p.isConnected === true) {
              //     return pd4.value.call(p, query);
              // }

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

              // if (p instanceof HTMLElement && p.isConnected === true) {
              //     return pd6.value.call(p, query);
              // }

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


      if (ENABLE_discreteTasking || FIX_stampDomArray) {

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
                if (requestingFn === requestIdleCallback) {
                  target[timerIdProp] = requestIdleCallback.apply(window, requestingArgs);
                } else {
                  target[timerIdProp] = mkFns[2].apply(window, requestingArgs);
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
            if (typeof c === 'number' && typeof b === 'string' && a instanceof HTMLElement) {
              const num = c;
              c = `${num}`;
              if (c.length > 5) c = (num < 10 && num > -10) ? toFixed2(num, 3) : toFixed2(num, 1);
            }

            if (typeof b === 'string' && typeof c === 'string' && a instanceof HTMLElement) {

              let elmPropTemp = null;

              if (b === "transform") {
                // div.ytp-hover-progress.ytp-hover-progress-light
                // div.ytp-play-progress.ytp-swatch-background-color

                nextModify(a, c, elmTransformTemp, zoTransform, immediateChange);
                // let ast = null;
                // if (a instanceof HTMLElement && !('__styleH745__' in a) && (ast = a.style)) {
                //   a.__styleH745__ = 1;
                //   Object.defineProperty(ast, 'left', hookLeftPD);
                // }
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
                  console.log(27306, m);
                  log77.set(b, m);
                }
                m.push([a, b, c]);

              } else {
                console.log(27306, a, b, c);
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
              if (!(element instanceof HTMLElement)) return this.updateValue31(a, b);

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


    FIX_yt_player && !isChatRoomURL && FIX_SHORTCUTKEYS > 0 && (async () => {
      // keyboard shortcut keys controller

      const _yt_player = await _yt_player_observable.obtain();

      if (!_yt_player || typeof _yt_player !== 'object') return;

      keyboardController(_yt_player);

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

              if (h instanceof HTMLElement) {

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


      // FIX_TRANSCRIPT_SEGMENTS && (async ()=>{


      // })();

      // FIX_TRANSCRIPT_SEGMENTS && whenCEDefined('ytd-transcript-search-panel-renderer').then(async () => {


      //   let dummy;
      //   let cProto;
      //   dummy = document.createElement('ytd-transcript-search-panel-renderer');
      //   cProto = insp(dummy).constructor.prototype;


      //   if (!cProto || typeof cProto.bodyChanged !== 'function' || cProto.bodyChanged1848 || cProto.bodyChanged.length !== 0) {
      //     console.log('FIX_TRANSCRIPT_SEGMENTS NG')
      //     return;
      //   }
      //   cProto.bodyChanged1848 = cProto.bodyChanged;

      //   const wmx = new WeakMap();

      //   const sb35 = Symbol();
      //   cProto.bodyChanged = function () {
      //     let a = null;
      //     try {
      //       a = this.getBodyRenderer();
      //     } catch (e) { }
      //     if (!a || !a.initialSegments) {
      //       a = this.data;
      //       if (a.body) a = a.body;
      //       if (a.transcriptSegmentListRenderer) a = a.transcriptSegmentListRenderer;
      //     }
      //     const a_ = a;
      //     const initialSegments = (a_ || 0).initialSegments;
      //     if (typeof (initialSegments || 0) === 'object' && initialSegments.length >= 1){
      //       ((async () => { })()).then(() => {

      //         const c = wmx.get(initialSegments);
      //         if (!c) {
      //           const d = translateFn(initialSegments);
      //           wmx.set(initialSegments, d);
      //           console.log('translated', d);
      //           wmx.set(d, d);
      //           a_.initialSegments = d;
      //         } else {
      //           a_.initialSegments = c;
      //         }


      //       }).then(() => {
      //         // this.bodyChanged1848();
      //       });

      //     }else{

      //       // return this.bodyChanged1848();
      //     }
      //   }

      //   console.log('FIX_TRANSCRIPT_SEGMENTS OK')




      // });


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
