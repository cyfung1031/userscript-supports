// ==UserScript==
// @name        YouTube JS Engine Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.11.31
// @license     MIT
// @author      CY Fung
// @icon        https://github.com/cyfung1031/userscript-supports/raw/main/icons/yt-engine.png
// @description To enhance YouTube performance by modifying YouTube JS Engine
// @grant       none
// @require     https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@48a67f75465ee721fc1d39b6af82abcaa51b89d6/library/nextBrowserTick.min.js
// @run-at      document-start
// @unwrap
// @inject-into page
// @allFrames   true
// ==/UserScript==

(() => {

  const NATIVE_CANVAS_ANIMATION = false; // for #cinematics
  const FIX_schedulerInstanceInstance = 2 | 4;
  const FIX_yt_player = true;
  const FIX_Animation_n_timeline = true;
  const NO_PRELOAD_GENERATE_204 = false;
  const ENABLE_COMPUTEDSTYLE_CACHE = true;
  const NO_SCHEDULING_DUE_TO_COMPUTEDSTYLE = true;
  const CHANGE_appendChild = true; // discussions#236759

  const FIX_error_many_stack = true; // should be a bug caused by uBlock Origin
  // const FIX_error_many_stack_keepAliveDuration = 200; // ms
  // const FIX_error_many_stack_keepAliveDuration_check_if_n_larger_than = 8;

  const FIX_Iframe_NULL_SRC = true;

  const IGNORE_bindAnimationForCustomEffect = true; // prevent `v.bindAnimationForCustomEffect(this);` being executed

  const FIX_stampDomArray_stableList = true;
  const FIX_ytdExpander_childrenChanged = true;
  const FIX_paper_ripple_animate = true;
  const FIX_avoid_incorrect_video_meta = true; // omit the incorrect yt-animated-rolling-number
  const FIX_avoid_incorrect_video_meta_emitterBehavior = true;

  const FIX_doIdomRender = true;

  const FIX_Shady = true;

  const FIX_ytAction_ = true; // ytd-app
  const FIX_onVideoDataChange = false;
  // const FIX_onClick = true;
  const FIX_onStateChange = true;
  const FIX_onLoopRangeChange = true;
  // const FIX_maybeUpdateFlexibleMenu = true; // ytd-menu-renderer
  const FIX_VideoEVENTS_v2 = true; // true might cause bug in switching page

  const ENABLE_discreteTasking = true;
  // << if ENABLE_discreteTasking >>
  const ENABLE_weakenStampReferences = true;
  // << end >>

  const FIX_perfNow = true;
  const ENABLE_ASYNC_DISPATCHEVENT = false; // problematic

  const UNLOAD_DETACHED_POLYMER = false; // unstable

  const WEAK_REF_BINDING = true; // false if your browser is slow
  // << if WEAK_REF_BINDING >>
  const WEAK_REF_PROXY_DOLLAR = true; // false if your browser is slow
  // << end >>

  const FIX_XHR_REQUESTING = true;
  const FIX_VIDEO_BLOCKING = true; // usually it is a ads block issue

  const LOG_FETCHMETA_UPDATE = false;

  const IGNORE_bufferhealth_CHECK = false; // experimental; true will make "Stats for nerds" no info.

  const DENY_requestStorageAccess = true; // remove document.requestStorageAccess
  const DISABLE_IFRAME_requestStorageAccess = true; // no effect if DENY_requestStorageAccess is true

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


  // const setImmediate = ((self || 0).jmt || 0).setImmediate;
  /** @type {(f: ()=>{})=>{}} */
  const nextBrowserTick = (self || 0).nextBrowserTick || 0;
  const nextBrowserTick_ = nextBrowserTick || (f => f());

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

  /** 
    @param {number} x 
    @param {number} d */
  const toFixed2 = (x, d) => {
    let t = x.toFixed(d);
    let y = `${+t}`;
    return y.length > t.length ? t : y;
  }


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

  /** @type {(o: Object | null) => WeakRef | null} */
  const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null);

  /** @type {(wr: Object | null) => Object | null} */
  const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

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

  FIX_perfNow && (() => {
    let nowh = -1;
    const dtl = new DocumentTimeline();
    performance.now = performance.now16 = function () {

      /**
       * Bug 1842437 - When attempting to go back on youtube.com, the content remains the same
       *
       * If consecutive session history entries had history.state.entryTime set to same value,
       * back button doesn't work as expected. The entryTime value is coming from performance.now()
       * and modifying its return value slightly to make sure two close consecutive calls don't
       * get the same result helped with resolving the issue.
       */

      let t = nowh;
      let c = dtl.currentTime;
      return (nowh = (t + 1e-7 > c ? t + 1e-5 : c));
    }
    if (performance.now !== performance.now16) { // might not able to set in Firefox
      if (performance.now() === performance.now()) console.warn('performance.now() is not mono increasing.');
    }
  })();

  if (ENABLE_ASYNC_DISPATCHEVENT && nextBrowserTick) {
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
            nextBrowserTick(() => this.dispatchEvent938(event));
            return true;
          }
        }
      }
      return this.dispatchEvent938(event);
    }
  }

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
      return c;
    })();
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
  const qm57 = Symbol();
  const qm53 = Symbol();
  const qn53 = Symbol();


  const ump3 = new WeakMap();

  const stp = document.createElement('noscript');
  stp.id = 'weakref-placeholder'


  const setupD = typeof WeakRef !== 'undefined' ? (elm, s, usePlaceholder) => {

    const z = `${s}72`;

    if (s in elm) {
      // console.log(1162, elm[s], elm)

      const p = elm[s];

      delete elm[s];

      Object.defineProperty(elm, s, {
        get() {
          const elm = this;
          const wr = elm[z];
          if (!wr) return null;
          const m = kRef(wr);
          if (!m && usePlaceholder) {
            if (typeof usePlaceholder === 'function') usePlaceholder(elm);
            return stp;
          }
          return m;
        },
        set(nv) {
          const elm = this;
          elm[z] = nv ? mWeakRef(nv) : null;
          return true;
        },
        configurable: true,
        enumerable: true

      });

      elm[s] = p;
      elm = null;


    }
  } : null;

  const mxMap = new WeakMap();

  const myMap = new WeakSet();

  const setup$ = typeof WeakRef !== 'undefined' ? function (dh) {

    const $ = dh.$;
    // const elements_ = dh.elements_;

    // setupD(dh, '$');


    if (WEAK_REF_PROXY_DOLLAR && $ && typeof $ === 'object' && !dh.$ky37) {

      dh.$ky37 = 1;

      if (!myMap.has($)) {




        for (const k of Object.keys($)) {

          const v = $[k];
          if ($[k] instanceof Node) {

            $[k] = mWeakRef($[k]);

          }

        }



        dh.$ = mxMap.get($) || new Proxy($, {
          get(obj, prop) {
            const val = obj[prop];
            if (typeof (val || 0).deref === 'function') {
              return val.deref();
            }
            return val;
          },
          set(obj, prop, val) {
            if (val instanceof Node) {
              obj[prop] = mWeakRef(val);
            } else {
              obj[prop] = val;
            }
            return true;
          }
        });

        mxMap.set($, dh.$);
        myMap.add(dh.$);

      }




    }




    //     if (WEAK_REF_PROXY_DOLLAR && elements_ && typeof elements_ === 'object' && !dh.$ky38) {

    //       dh.$ky38 = 1;

    //       if (!myMap.has(elements_)) {




    //         for (const k of Object.keys(elements_)) {

    //           const v = elements_[k];
    //           if (elements_[k] instanceof Node) {

    //             elements_[k] = new WeakRef(elements_[k]);

    //           }

    //         }

    //         /*



    //         dh.elements_ = mxMap.get(elements_) || new Proxy(elements_, {
    //           get(obj, prop) {
    //             const val = obj[prop];
    //             if (typeof (val || 0).deref === 'function') {
    //               return val.deref();
    //             }
    //             return val;
    //           },
    //           set(obj, prop, val) {
    //             if (val instanceof Node) {
    //               obj[prop] = new WeakRef(val);
    //             } else {
    //               obj[prop] = val;
    //             }
    //             return true;
    //           }
    //         });

    //         console.log(dh, dh.elements_, elements_)

    //         mxMap.set(elements_, dh.elements_);
    //         myMap.add(dh.elements_);

    // */
    //       }




    //     }





  } : null;


  const configureVisibilityObserverT_ = function () {
    const hostElement = this.hostElement;
    if (!(hostElement instanceof Node) || hostElement.nodeName === 'NOSCRIPT') {
      this.unobserve_();
    } else {
      return this.configureVisibilityObserver27_();
    }
  };
  const getParentRendererT = function () {
    const hostElement = this.hostElement;
    if (!(hostElement instanceof Node) || hostElement.nodeName === 'NOSCRIPT') {
      return null;
    } else {
      return this.getParentRenderer27();
    }
  }
  const readyT = function () {
    const hostElement = this.hostElement;
    let b = false;
    if (this.enableContentEditableChanged_) {
      b = true;
    } else if (this.is && this.is.length > 15 && this.is.length < 20) {

    } else {
      b = true;
    }
    if (b) {
      if (!(hostElement instanceof Node) || hostElement.nodeName === 'NOSCRIPT') {
        return void 0;
      }
    }
    return this.ready27.apply(this, arguments);
  }
  const _enablePropertiesT = function () {
    const hostElement = this.hostElement;
    if (!(hostElement instanceof Node) || hostElement.nodeName === 'NOSCRIPT') {
      return void 0;
    }
    return this._enableProperties27();
  }

  const attachedT = function () {
    const hostElement = this.hostElement;
    if (!(hostElement instanceof Node) || hostElement.nodeName === 'NOSCRIPT') {
      if (this.isAttached === true) this.isAttached = false;
      return void 0;
    } else {
      return this.attached27();
    }
  }

  const hostElementCleanUp = (dh) => {
    if (typeof dh.dispose === 'function') {
      try {
        if (dh.visibilityMonitor || dh.visibilityObserver) {
          dh.dispose();
          dh.visibilityMonitor = null;
          dh.visibilityObserver = null;
        }
      } catch (e) { }
    }
    if (typeof dh.detached === 'function') {
      try {
        if (dh.visibilityObserverForChild_ || dh.localVisibilityObserver_) {
          dh.detached();
          dh.visibilityObserverForChild_ = null;
          dh.localVisibilityObserver_ = null;
        }
      } catch (e) { }
    }
    // if (dh.__dataEnabled === true) {
    //   dh.__dataEnabled = false;
    // }
  };
  const setupDataHost = setupD && setup$ ? function (dh, opt) {

    if (dh && typeof dh === 'object') {

      if (typeof dh.configureVisibilityObserver_ === 'function' && !dh.configureVisibilityObserver27_) {
        dh.configureVisibilityObserver27_ = dh.configureVisibilityObserver_;
        dh.configureVisibilityObserver_ = configureVisibilityObserverT_;
      }

      if (typeof dh.getParentRenderer === 'function' && !dh.getParentRenderer27) {
        dh.getParentRenderer27 = dh.getParentRenderer;
        dh.getParentRenderer = getParentRendererT;
      }

      // if (!opt) {

      //   if (typeof dh.ready === 'function' && !dh.ready27) {
      //     dh.ready27 = dh.ready;
      //     dh.ready = readyT;
      //   }

      // }

      // if (typeof dh._enableProperties === 'function' && !dh._enableProperties27) {
      //   dh._enableProperties27 = dh._enableProperties;
      //   dh._enableProperties = _enablePropertiesT;
      // }

      if (typeof dh.attached === 'function' && !dh.attached27) {
        dh.attached27 = dh.attached;
        dh.attached = attachedT;
      }

      setupD(dh, 'hostElement', hostElementCleanUp);
      setupD(dh, 'parentComponent');
      setupD(dh, 'localVisibilityObserver_');
      setupD(dh, 'cachedProviderNode_');


      setupD(dh, '__template');
      setupD(dh, '__templatizeOwner');
      setupD(dh, '__templateInfo');

      // setupD(dh, 'root', 1);

      const elements_ = dh.elements_;
      if (elements_ && typeof elements_ === 'object' && Object.keys(elements_).length > 0) setupD(dh, 'elements_');



      setup$(dh);
    }




  } : null;


  let delay300 = null;

  if (UNLOAD_DETACHED_POLYMER || WEAK_REF_BINDING) {
    delay300 = new PromiseExternal();
    setInterval(() => {
      delay300.resolve();
      delay300 = new PromiseExternal();
    }, 300);
  }

  const aDelay = async function () {
    await delay300.then();
    await delay300.then();
  }

  const convertionFuncMap = new WeakMap();
  let val_kevlar_should_maintain_stable_list = null;

  const createStampDomArrayFn_ = (fn) => {
    if (val_kevlar_should_maintain_stable_list === null) {
      const config_ = ((window.yt || 0).config_ || 0);
      val_kevlar_should_maintain_stable_list = ((config_ || 0).EXPERIMENT_FLAGS || 0).kevlar_should_maintain_stable_list === true
    }
    const gn = function (a, b, c, d, e, h) {
      const isNonEmptyArray = (a || 0).length >= 1
      if (!isNonEmptyArray) {
        return fn.call(this, undefined, b, undefined, d);
      } else if (h === undefined && typeof b === 'string' && c && typeof c === 'object' && this.is && val_kevlar_should_maintain_stable_list) {
        if (c.clientSideToggleMenuItemRenderer) {
          h = false;
        } else {
          h = true;
        }
      }
      return fn.call(this, a, b, c, d, e, h)
    }
    gn.originalFn = fn;
    convertionFuncMap.set(fn, gn);
    return gn;
  }

  const fixStampDomArrayStableList = (h) => {
    if (!h.stampDomArray_) return;
    const proto = h.__proto__;
    const f = proto.stampDomArray_;
    if (!proto.stampDomArrayF001_ && typeof f === 'function' && f.length === 6) {
      proto.stampDomArrayF001_ = 1;
      proto.stampDomArray_ = convertionFuncMap.get(f) || createStampDomArrayFn_(f);
    }
  }

  const weakenStampReferences = (() => {

    const DEBUG_STAMP = false;

    const s1 = Symbol();
    const handler1 = {
      get(target, prop, receiver) {
        if (prop === 'object') {
          return kRef(target[s1]); // avoid memory leakage
        }
        if (prop === '__proxy312__') return 1;
        return target[prop];
      }
    };
    const handler2 = {
      get(target, prop, receiver) {
        if (prop === 'indexSplices') {
          return kRef(target[s1]); // avoid memory leakage
        }
        if (prop === '__proxy312__') return 1;
        return target[prop];
      }
    }
    const handler3 = {
      get(target, prop, receiver) {
        if (prop === '__proxy312__') return 1;
        let w = target[prop]
        if (w && typeof w === 'object' && typeof w.deref === 'function') {
          return w.deref();
        }
        return w;
      }
    }
    return (h) => {

      if (h.rendererStamperApplyChangeRecord_ || h.stampDomArraySplices_) {
        const proto = h.__proto__;
        if (!proto.yzxer && (proto.rendererStamperApplyChangeRecord_ || proto.stampDomArraySplices_)) {
          proto.yzxer = 1;

          const list = [
            // "rendererStamperObserver_", // 3  ==> rendererStamperApplyChangeRecord_
            "rendererStamperApplyChangeRecord_", // 3
            "forwardRendererStamperChanges_", // 3
            "stampDomArraySplices_", // 3
            "stampDomArray_", // 6
            "deferRenderStamperBinding_", // 3
          ];
          for (const key of list) {
            const pey = `${key}$wq0iw_`
            if (typeof proto[key] !== 'function') continue;
            // console.log( proto.isRenderer_, 'ms_'+key, proto[key].length, h.is)
            if (proto[pey] || proto[key].length === 0) continue;

            // proto[pey] = proto[key];
            // proto[key] = function () {
            //   console.log(key, arguments.length, [...arguments]);

            //   return proto[pey].apply(this, arguments);
            // }


            if (key === 'stampDomArraySplices_' && proto[key].length === 3) {
              proto[pey] = proto[key];
              proto[key] = function (a, b, c) {

                if (typeof a === 'string' && typeof b === 'string' && typeof c === 'object' && c && c.indexSplices && c.indexSplices.length >= 1 && !c.indexSplices.rzgjr) {

                  c.indexSplices = c.indexSplices.map(e => {
                    if (e.__proxy312__) return e;
                    e[s1] = mWeakRef(e.object);
                    e.object = null;
                    return new Proxy(e, handler1);
                  });
                  c.indexSplices.rzgjr = 1;

                  c[s1] = mWeakRef(c.indexSplices);
                  c.indexSplices = null;
                  c = new Proxy(c, handler2)
                  arguments[2] = c;

                }
                // console.log(key, arguments.length, [...arguments]);
                return proto[pey].call(this, a, b, c);
              }

            } else if (key === 'rendererStamperApplyChangeRecord_' && proto[key].length === 3) {


              // proto[pey] = proto[key];
              // proto[key] = function (a, b, c) {

              //   if (typeof a === 'string' && typeof b === 'string' && typeof c === 'object' && c && c.value && c.base) {

              //     if(c.value.length >=1){


              //       c.value = c.value.map(e=>{

              //         if(!e.__proxy312__){

              //         for (const k of Object.keys(e)) {
              //           const v = e[k];
              //           if(typeof v ==='object' && v && typeof v.length ==='undefined' && !v.deref) e[k] = mWeakRef(v)

              //         }
              //         return new Proxy(e, handler3);

              //       }

              //       })


              //       window.se3=c.value;

              //     }

              //     if(c.base.length >=1){

              //       c.base = c.base.map(e=>{

              //         if(!e.__proxy312__){


              //           for (const k of Object.keys(e)) {
              //             const v = e[k];
              //             if(typeof v ==='object' && v && typeof v.length ==='undefined' && !v.deref) e[k] = mWeakRef(v)
              //           }
              //           return new Proxy(e, handler3);
              //         }


              //       })

              //       console.log(c.base);


              //       window.se4=c.base;

              //     }


              //   }
              //   // console.log(key, arguments.length, [...arguments]);
              //   return proto[pey].call(this, a, b, c);
              // }

            } else if (DEBUG_STAMP) {

              console.log(proto.isRenderer_, 'ms_' + key, proto[key].length, h.is)
              proto[pey] = proto[key];
              proto[key] = function () {
                if (key === 'rendererStamperApplyChangeRecord_' && typeof arguments[3] === 'object') {
                  console.log(key, arguments.length, { value: arguments[3].value, base: arguments[3].base, })
                }
                console.log(key, arguments.length, [...arguments]);
                return proto[pey].apply(this, arguments);
              }

            }

          }


          // const m = (Object.mkss = Object.mkss || new Set());
          // Object.keys(h.__proto__).filter(e => e.toLowerCase().includes('stamp') && typeof h[e] === 'function').forEach(e => m.add(e))
          // console.log([...m])
        }
      }

    }
  })();

  const setupDiscreteTasks = (h, rb) => {

    if (rb) {
      if (h.ky36) return;
    }


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



    /*


    if (typeof h.onYtAction_ === 'function' && !(h.onYtAction_.km34)) {
      const f = h.onYtAction_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onYtAction_ = g;

    }

    */



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




    if (typeof h.addTooltips === 'function' && !(h.addTooltips.km34)) {

      const f = h.addTooltips;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.addTooltips = g;

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




    /*
    // buggy for yt-player-updated
    if (typeof h.startLoadingWatch === 'function' && !(h.startLoadingWatch.km34)) {

      const f = h.startLoadingWatch;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.startLoadingWatch = g;

    }
    */













    if (typeof h.loadPage_ === 'function' && !(h.loadPage_.km34)) {
      const f = h.loadPage_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.loadPage_ = g;

    }
    if (typeof h.updatePageData_ === 'function' && !(h.updatePageData_.km34)) {
      const f = h.updatePageData_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updatePageData_ = g;

    }









    if (typeof h.onFocus_ === 'function' && !(h.onFocus_.km34)) {

      const f = h.onFocus_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onFocus_ = g;

    }

    if (typeof h.onBlur_ === 'function' && !(h.onBlur_.km34)) {

      const f = h.onBlur_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onBlur_ = g;

    }


    if (typeof h.buttonClassChanged_ === 'function' && !(h.buttonClassChanged_.km34)) {

      const f = h.buttonClassChanged_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.buttonClassChanged_ = g;

    }


    if (typeof h.buttonIconChanged_ === 'function' && !(h.buttonIconChanged_.km34)) {

      const f = h.buttonIconChanged_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.buttonIconChanged_ = g;

    }


    if (typeof h.dataChangedInBehavior_ === 'function' && !(h.dataChangedInBehavior_.km34)) {

      const f = h.dataChangedInBehavior_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.dataChangedInBehavior_ = g;

    }





    if (typeof h.continuationsChanged_ === 'function' && !(h.continuationsChanged_.km34)) {

      const f = h.continuationsChanged_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.continuationsChanged_ = g;

    }


    if (typeof h.forceChatPoll_ === 'function' && !(h.forceChatPoll_.km34)) {

      const f = h.forceChatPoll_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.forceChatPoll_ = g;

    }



    if (typeof h.onEndpointClick_ === 'function' && !(h.onEndpointClick_.km34)) {

      const f = h.onEndpointClick_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onEndpointClick_ = g;

    }


    if (typeof h.onEndpointTap_ === 'function' && !(h.onEndpointTap_.km34)) {

      const f = h.onEndpointTap_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onEndpointTap_ = g;

    }


    if (typeof h.handleClick_ === 'function' && !(h.handleClick_.km34)) {

      const f = h.handleClick_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleClick_ = g;

    }



    // return;



    if (typeof h.onReadyStateChange_ === 'function' && !(h.onReadyStateChange_.km34)) {

      const f = h.onReadyStateChange_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onReadyStateChange_ = g;

    }

    if (typeof h.onReadyStateChangeEntryPoint_ === 'function' && !(h.onReadyStateChangeEntryPoint_.km34)) {

      const f = h.onReadyStateChangeEntryPoint_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onReadyStateChangeEntryPoint_ = g;

    }


    if (typeof h.readyStateChangeHandler_ === 'function' && !(h.readyStateChangeHandler_.km34)) {

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


    if (typeof h.executeCallbacks_ === 'function' && !(h.executeCallbacks_.km34)) {

      const f = h.executeCallbacks_; // overloaded
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.executeCallbacks_ = g;

    }



    if (typeof h.handleInvalidationData_ === 'function' && !(h.handleInvalidationData_.km34)) {

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
    if (typeof h.onNavigate_ === 'function' && !(h.onNavigate_.km34)) {

      const f = h.onNavigate_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onNavigate_ = g;

    }

    /*
    if(typeof h.deferRenderStamperBinding_ ==='function' && !(h.deferRenderStamperBinding_.km34)){

            const f = h.deferRenderStamperBinding_;
      const g = function(){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.deferRenderStamperBinding_ = g;

    }
    */



    if (typeof h.ytRendererBehaviorDataObserver_ === 'function' && !(h.ytRendererBehaviorDataObserver_.km34)) {

      const f = h.ytRendererBehaviorDataObserver_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.ytRendererBehaviorDataObserver_ = g;

    }

    if (typeof h.ytRendererBehaviorTargetIdObserver_ === 'function' && !(h.ytRendererBehaviorTargetIdObserver_.km34)) {

      const f = h.ytRendererBehaviorTargetIdObserver_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.ytRendererBehaviorTargetIdObserver_ = g;

    }

    if (typeof h.unregisterRenderer_ === 'function' && !(h.unregisterRenderer_.km34)) {

      const f = h.unregisterRenderer_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.unregisterRenderer_ = g;

    }



    if (typeof h.textChanged_ === 'function' && !(h.textChanged_.km34)) {

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




    /*
    if(typeof h.stampDomArray_ ==='function' && !(h.stampDomArray_.km34)){

      if( h.stampDomArray_.length === 6){

            const f = h.stampDomArray_;
      const g = function(a,b,c,d,e,h){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampDomArray_ = g;

      }else{



            const f = h.stampDomArray_;
      const g = function(){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampDomArray_ = g;
      }


    }
    */

    /*
    if(typeof h.stampDomArraySplices_ ==='function' && !(h.stampDomArraySplices_.km34)){

      if(h.stampDomArraySplices_.length === 3){



            const f = h.stampDomArraySplices_;
      const g = function(a,b,c){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampDomArraySplices_ = g;


      }else{



            const f = h.stampDomArraySplices_;
      const g = function(){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampDomArraySplices_ = g;


      }

    }
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

    FIX_stampDomArray_stableList && fixStampDomArrayStableList(h);
    ENABLE_weakenStampReferences && weakenStampReferences(h);



    /// -----------------------


    // const isMainRenderer = (h) => {
    //   if (h.is && h.$ && h.__dataEnabled && h.__dataReady && h.__shady && h.__templateInfo && h.root && h.hostElement) {
    //     const q = (h.parentComponent ? 1 : 0) | (h.ytComponentBehavior ? 2 : 0);
    //     if (q === 3) {
    //       // chat renderer
    //       if (h.is.endsWith('-renderer')) {
    //         return true;
    //       }
    //     } else if (q === 0) {
    //       // custom lyrics engagement panel
    //       if (h.is.endsWith('-renderer')) {
    //         return true;
    //       }
    //     } else if (q === 1) {
    //       // input renderer
    //       if (h.is.endsWith('-renderer')) {
    //         return true;
    //       }
    //     }
    //   }
    //   return false;
    // }

    // const skipRenderer = (h) => {
    //   return (h.is === 'yt-live-chat-renderer') ||
    //     (h.is === 'yt-live-chat-item-list-renderer') ||
    //     (h.is === 'yt-live-chat-text-input-field-renderer') ||
    //     (h.is === 'yt-live-chat-message-buy-flow-renderer') ||
    //     false;
    // }


    /*
    if (typeof h.rendererStamperApplyChangeRecord_ === 'function' && !(h.rendererStamperApplyChangeRecord_.km31) && h.rendererStamperApplyChangeRecord_.length === 3) {

      const f = h.rendererStamperApplyChangeRecord_;
      h.rendererStamperApplyChangeRecord31_ = f;
      const g = ump3.get(f) || function (a, b, c) {
        if (isMainRenderer(this) || (this.updateChildVisibilityProperties && !this.markDirty)) {
          let y = false;
          if (!this.markDirty) {
            // yt-live-chat-dialog-renderer
            // ytd-engagement-panel-section-list-renderer
            y = true;
          } else if (!this.visibilityObserverForChild_ && !!this.getVisibilityObserverForChild) {
            const lobs = this.localVisibilityObserver_;
            if (this.isRenderer_ === true) {
              if (lobs) {
                if (lobs.observer && lobs.isConnected === true) {
                  // if (lobs.observer && lobs.isConnected === true && lobs.pauseObservingUntilReconnect === false && lobs.handlers && lobs.handlers.size > 0) {
                  // if ((this.__data || 0).isEmpty === false) {
                  //   // by pass
                  // } else if (this.is === 'yt-live-chat-renderer') {
                  //   y = true;
                  // }
                  if (this.is === 'yt-live-chat-renderer') {
                    y = true;
                  }
                } else {
                  y = true;
                }
              } else if (lobs === null) {
                y = true;
              } else {
                console.log('renderer-check-failure 01', this.is)
              }
            } else {
              console.log('renderer-check-failure 02', this.is)
            }
          }
          if (y) {
            return f.apply(this, arguments);
          }
        }
        let c2 = c;
        if (c && typeof c === 'object') {
          c2 = {};
          for (const entry of Object.entries(c)) {
            const [key, value] = entry;
            let choice = 0;
            if (value && typeof value === 'object') {
              if (key === 'base' && value.length >= 1) choice = 1;
              else if (key === 'value' && value.indexSplices && value.indexSplices.length >= 1) choice = 2;
            }
            if (choice === 1) c2[key] = value.slice(0);
            else if (choice === 2) c2[key] = Object.assign({}, value, { indexSplices: value.indexSplices.map(splice=>{

              if (!splice || typeof splice !== 'object') return splice;
              if (splice.removed && splice.removed.length >= 1) splice.removed = splice.removed.slice(0);
              if (splice.object && splice.object.length >= 1) splice.object = splice.object.slice(0);

              return splice;

            }) });
            else c2[key] = value;
          }
        }
        const acceptable = () => {
          return this.isAttached && this.data && this.__dataEnabled
        }
        // sequence on the same proto
        this[qm47] = (this[qm47] || Promise.resolve()).then(() => acceptable() && this.rendererStamperApplyChangeRecord31_(a, b, c2)).catch(console.log);
      }
      ump3.set(f, g);
      g.km31 = 1;
      h.rendererStamperApplyChangeRecord_ = g;


    }
    */




    /*
    if (typeof h.rendererStamperObserver_ === 'function' && !(h.rendererStamperObserver_.km34)) {

      const f = h.rendererStamperObserver_;
      const g = ump3.get(f) || function (a, b, c) {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.rendererStamperObserver_ = g;

    }


    if (typeof h.rendererStamperApplyChangeRecord_ === 'function' && !(h.rendererStamperApplyChangeRecord_.km34)) {

      const f = h.rendererStamperApplyChangeRecord_;
      const g = ump3.get(f) || function () {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.rendererStamperApplyChangeRecord_ = g;

    }



    if (typeof h.flushRenderStamperComponentBindings_ === 'function' && !(h.flushRenderStamperComponentBindings_.km34)) {

      const f = h.flushRenderStamperComponentBindings_;
      const g = ump3.get(f) || function () {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.flushRenderStamperComponentBindings_ = g;

    }


    if (typeof h.forwardRendererStamperChanges_ === 'function' && !(h.forwardRendererStamperChanges_.km34)) {

      const f = h.forwardRendererStamperChanges_;
      const g = ump3.get(f) || function () {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.forwardRendererStamperChanges_ = g;

    }
    */





    // console.log(123)

    // return;


    /*

    // buggy for page swtiching

    if (typeof h.dataChanged_ === 'function' && !(h.dataChanged_.km31)) {




      const f = h.dataChanged_;
      h.dataChanged31_ = f;
      const g = ump3.get(f) || function (...args) {

        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }

        // sequence on the same proto
        this[qm47] = (this[qm47] || Promise.resolve()).then(() => this.dataChanged31_(...args)).catch(console.log);
      }
      ump3.set(f, g);
      g.km31 = 1;
      h.dataChanged_ = g;


    }
    */


    /*

    if (typeof h.dataChanged_ === 'function' && !(h.dataChanged_.km34)) {

      const f = h.dataChanged_;
      const g = ump3.get(f) || function () {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.dataChanged_ = g;

    }
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

    /*
    // see https://github.com/cyfung1031/userscript-supports/issues/20
    if (typeof h.updateChangeRecord_ === 'function' && !(h.updateChangeRecord_.km34)) {

      const f = h.updateChangeRecord_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updateChangeRecord_ = g;

    }
    */


    if (typeof h.requestRenderChunk_ === 'function' && !(h.requestRenderChunk_.km34)) {

      const f = h.requestRenderChunk_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.requestRenderChunk_ = g;

    }





    return;



    /*
    if (typeof h.cancelPendingTasks_ === 'function' && !(h.cancelPendingTasks_.km34)) {

      const f = h.cancelPendingTasks_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.cancelPendingTasks_ = g;

    }


    if (typeof h.fillRange_ === 'function' && !(h.fillRange_.km34)) {

      const f = h.fillRange_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.fillRange_ = g;

    }
    */




    if (typeof h.addTextNodes_ === 'function' && !(h.addTextNodes_.km34)) {

      const f = h.addTextNodes_;
      const g = function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.addTextNodes_ = g;

    }




    if (typeof h.updateText_ === 'function' && !(h.updateText_.km34)) {

      const f = h.updateText_;
      const g = function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.updateText_ = g;

    }





    if (typeof h.stampTypeChanged_ === 'function' && !(h.stampTypeChanged_.km34)) {

      const f = h.stampTypeChanged_;
      const g = function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampTypeChanged_ = g;

    }




    // console.log(166)




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

  const setupWeakRef = (h) => {


    if (WEAK_REF_BINDING && !h.kz62 && setup$ && setupD && setupDataHost && (h.is || h.__dataHost)) {

      let skip = false;
      // if (h.is && typeof h.is === 'string' && h.is.length > 15 && h.is.length < 30) {
      //   if (h.is.includes('yt-') && !h.$ && h.is.length !== 20 && h.is.length !== 21 && h.is.length !== 22) {
      //     skip = true;
      //     // return;
      //   }
      // }

      h.kz62 = 1;

      //

      setup$(h);
      const hostElement = h.hostElement;

      if (hostElement !== h) {

        for (const s of ['__dataHost', '__CE_shadowRoot', '__template', '__templatizeOwner']) {
          setupD(h, s);

        }

        const dh = h.__dataHost;

        setupDataHost(dh, skip)
      }




      if (hostElement) {

        for (const s of ['__dataHost', '__CE_shadowRoot', '__template', '__templatizeOwner']) {
          setupD(hostElement, s);

        }

        const dh = hostElement.__dataHost;

        setupDataHost(dh, skip)




        aDelay().then(() => {
          setupD(hostElement, '__CE_shadowRoot');
        });


      }





    }

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

      if (WEAK_REF_BINDING && (this instanceof Node) && (this.is || this.__dataHost)) {
        setupWeakRef(this)
        // setupWeakRef(this.__dataHost)
      }
      return r;
    }
  }

  ENABLE_discreteTasking && Object.defineProperty(Object.prototype, 'connectedCallback', {
    get() {
      const f = this[keyStConnectedCallback];
      if (this.is) {
        setupDiscreteTasks(this, true);
        if (f) this.ky36 = 1;
      }
      if (WEAK_REF_BINDING && (this.is || this instanceof Node)) {
        setupWeakRef(this)
      }
      return f;
    },
    set(nv) {
      let gv;
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
      this[keyStConnectedCallback] = gv; // proto or object
      if (this.is) {
        setupDiscreteTasks(this);
      }
      if (WEAK_REF_BINDING && (this.is || this instanceof Node)) {
        setupWeakRef(this)
      }
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
    document.body.appendChild(st);


    // console.debug('90002', location.pathname)
    // console.log(90000, location.pathname)

  });

  const prepareLogs = [];

  const skipAdsDetection = new Set(['/robots.txt', '/live_chat', '/live_chat_replay']);

  let winError00 = window.onerror;

  let fix_error_many_stack_state = !FIX_error_many_stack ? 0 : skipAdsDetection.has(location.pathname) ? 2 : 1;

  if (!JSON || !('parse' in JSON)) fix_error_many_stack_state = 0;

  ; FIX_Iframe_NULL_SRC && (() => {

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



  // ================================================ 0.4.5 ================================================


  // ; (() => {

  //   if (FIX_error_many_stack && self instanceof Window) {
  //     // infinite stack due to matchesStackTrace inside objectPrune of AdsBlock

  //     const pdK = Object.getOwnPropertyDescriptor(window, 'onerror');
  //     if (!pdK || (pdK.get && pdK.configurable)) {

  //     } else {
  //       return;
  //     }

  //     let unsupportErrorFix = false;

  //     let firstHook = true;
  //     let busy33 = false;

  //     let state = 0;

  //     if (pdK) {
  //       delete window['onerror'];
  //     }

  //     const pd = {
  //       get() {
  //         const stack = (new Error()).stack;
  //         // targetStack = stack;
  //         let isGetExceptionToken = stack.indexOf('getExceptionToken') >= 0;
  //         state = isGetExceptionToken ? 1 : 0;
  //         delete Window.prototype['onerror'];
  //         let r = pdK ? pdK.get.call(this) : this.onerror;
  //         Object.defineProperty(Window.prototype, 'onerror', pd);
  //         //        console.log('onerror get', r)
  //         return r;
  //       },
  //       set(nv) {
  //         const stack = (new Error()).stack;
  //         let isGetExceptionToken = stack.indexOf('getExceptionToken') >= 0;
  //         state = state === 1 && isGetExceptionToken ? 2 : 0;
  //         /** @type {string?} */
  //         let sToken = null;
  //         if (unsupportErrorFix || busy33) {

  //         } else if (typeof nv === 'function' && state === 2) {
  //           if (firstHook) {
  //             firstHook = false;
  //             console.groupCollapsed('Infinite onerror Bug Found');
  //             console.log(location.href);
  //             console.log(stack);
  //             console.log(nv);
  //             console.groupEnd();
  //           }
  //           let _token = null;
  //           busy33 = true;
  //           String.prototype.includes76 = String.prototype.includes;
  //           String.prototype.includes = function (token) {
  //             _token = token;
  //             return true;
  //           }
  //           nv('token');
  //           String.prototype.includes = String.prototype.includes76;
  //           sToken = _token;
  //           busy33 = false;
  //           if (typeof sToken !== 'string') {
  //             unsupportErrorFix = true;
  //           }
  //         }
  //         delete Window.prototype['onerror'];
  //         if (typeof sToken === 'string' && sToken.length > 1) {
  //           /** @type {string} */
  //           const token = sToken;
  //           /** @type {OnErrorEventHandler & {errorTokens: Set<string>?} } */
  //           const currentOnerror = pdK ? pdK.get.call(this) : this.onerror;

  //           const now = Date.now();
  //           const tokenEntry = {
  //             token,
  //             expired: now + FIX_error_many_stack_keepAliveDuration
  //           }
  //           /** @typedef {typeof tokenEntry} TokenEntry */

  //           /** @type {Set<TokenEntry>} */
  //           const errorTokens = currentOnerror.errorTokens;

  //           if (errorTokens) {
  //             if (errorTokens.size > FIX_error_many_stack_keepAliveDuration_check_if_n_larger_than) {
  //               for (const entry of errorTokens) {
  //                 if (entry.expired < now) {
  //                   errorTokens.delete(entry);
  //                 }
  //               }
  //             }
  //             errorTokens.add(tokenEntry)
  //           } else {
  //             /** @type {Set<TokenEntry>} */
  //             const errorTokens = new Set([tokenEntry]);
  //             /** @type {OnErrorEventHandler & {errorTokens: Set<string>} } */
  //             const newOnerror = ((oe) => {
  //               const r = function (msg, ...args) {
  //                 if (typeof msg === 'string' && errorTokens.size > 0) {
  //                   for (const entry of errorTokens) {
  //                     if (msg.includes(entry.token)) return true;
  //                   }
  //                 }
  //                 if (typeof oe === 'function') {
  //                   return oe.apply(this, arguments);
  //                 }
  //               };
  //               r.errorTokens = errorTokens;
  //               return r;
  //             })(currentOnerror);

  //             if (pdK && pdK.set) pdK.set.call(this, newOnerror);
  //             else this.onerror = newOnerror;
  //           }
  //         } else {
  //           if (pdK && pdK.set) pdK.set.call(this, nv);
  //           else this.onerror = nv;
  //         }
  //         Object.defineProperty(Window.prototype, 'onerror', pd);

  //         // console.log('onerror set', nv)
  //         return true;
  //       },
  //       enumerable: true,
  //       configurable: true
  //     }

  //     Object.defineProperty(Window.prototype, 'onerror', pd);


  //   }


  // })();



  // ================================================ 0.4.5 ================================================


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

  const isCustomElementsProvided = typeof customElements !== "undefined" && typeof (customElements || 0).whenDefined === "function";

  const promiseForCustomYtElementsReady = isCustomElementsProvided ? null : new Promise((callback) => {
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

  // const assertor = (f) => f() || console.assert(false, f + "");

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

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
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

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
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

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
      return arr[0];
    }



  }


  const getzo = (_yt_player) => {
    const w = 'zo';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      if (
        typeof v === 'function' && v.length === 3 && k.length < 3
        && (v + "").includes("a.style[b]=c")
      ) {

        arr.push(k);

      }

    }


    if (arr.length === 0) {

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
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

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
      return arr[0];
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
        if (!url || url.pathname !== '/watch') {
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
    if (typeof AbortSignal !== 'undefined') {
      let hn = () => {
        if (!hn) return;
        hn = null;
        resolve(document.querySelector('ytd-app'));
      };
      document.addEventListener('yt-action', hn, { capture: true, passive: true, once: true });
    } else {
      let hn = () => {
        if (!hn) return;
        document.removeEventListener('yt-action', hn, true);
        hn = null;
        resolve(document.querySelector('ytd-app'));
      };
      document.addEventListener('yt-action', hn, true);
    }
  });



  cleanContext(window).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, clearTimeout, cancelAnimationFrame, setInterval, clearInterval, animate, requestIdleCallback, getComputedStyle, perfNow } = __CONTEXT__;


    performance.now17 = perfNow.bind(performance);



    __requestAnimationFrame__ = requestAnimationFrame;

    let rafPromise = null;

    const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
      requestAnimationFrame(hRes => {
        rafPromise = null;
        resolve(hRes);
      });
    }));


    const wmComputedStyle = new WeakMap();
    // const getComputedStyleCached = (elem) => {
    //     let cs = wmComputedStyle.get(elem);
    //     if (!cs) {
    //         cs = getComputedStyle(elem);
    //         wmComputedStyle.set(elem, cs);
    //     }
    //     return cs;
    // }

    if (!window.__native__getComputedStyle__ && !window.__jst__getComputedStyle__ && typeof window.getComputedStyle === 'function' && window.getComputedStyle.length === 1) {
      window.__native__getComputedStyle__ = getComputedStyle;
      if (ENABLE_COMPUTEDSTYLE_CACHE) {
        window.__original__getComputedStyle__ = window.getComputedStyle;
        window.getComputedStyle = function (elem) {
          if (!(elem instanceof Element) || (arguments.length === 2 && arguments[1]) || (arguments.length > 2)) {
            return window.__native__getComputedStyle__(...arguments);
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


    // class RAFHub {
    //   constructor() {
    //     /** @type {number} */
    //     this.startAt = 8170;
    //     /** @type {number} */
    //     this.counter = 0;
    //     /** @type {number} */
    //     this.rid = 0;
    //     /** @type {Map<number, FrameRequestCallback>} */
    //     this.funcs = new Map();
    //     const funcs = this.funcs;
    //     /** @type {FrameRequestCallback} */
    //     this.bCallback = this.mCallback.bind(this);
    //     this.pClear = () => funcs.clear();
    //   }
    //   /** @param {DOMHighResTimeStamp} highResTime */
    //   mCallback(highResTime) {
    //     this.rid = 0;
    //     Promise.resolve().then(this.pClear);
    //     this.funcs.forEach(func => Promise.resolve(highResTime).then(func).catch(console.warn));
    //   }
    //   /** @param {FrameRequestCallback} f */
    //   request(f) {
    //     if (this.counter > 1e9) this.counter = 9;
    //     let cid = this.startAt + (++this.counter);
    //     this.funcs.set(cid, f);
    //     if (this.rid === 0) {
    //       // console.log(2455)
    //       this.rid = requestAnimationFrame(this.bCallback);
    //     }
    //     return cid;
    //   }
    //   /** @param {number} cid */
    //   cancel(cid) {
    //     cid = +cid;
    //     if (cid > 0) {
    //       if (cid <= this.startAt) {
    //         return cancelAnimationFrame(cid);
    //       }
    //       if (this.rid > 0) {
    //         this.funcs.delete(cid);
    //         if (this.funcs.size === 0) {
    //           cancelAnimationFrame(this.rid);
    //           this.rid = 0;
    //         }
    //       }
    //     }
    //   }
    //   /** @param {number} cid */
    //   /** @param {FrameRequestCallback} f */
    //   replaceFunc(cid, f) {
    //     if (typeof this.funcs.get(cid) === 'function') {
    //       this.funcs.set(cid, f);
    //       return cid;
    //     } else {
    //       let r = this.request(f);
    //       this.cancel(cid);
    //       return r;
    //     }
    //   }
    // }


    //     WEAK_REF_BINDING && (async () => {

    //       ['tp-yt-paper-menu-button'].forEach(async tag => {

    //         const dummy = await new Promise(resolve => {
    //             whenCEDefined(tag).then(() => {
    //               resolve(document.createElement(tag));
    //             });

    //         });

    //         if (!dummy || dummy.is !== tag) return;

    //         const cProto = insp(dummy).constructor.prototype;

    //         if (typeof cProto.close === 'function' && !cProto.close58) {
    //           cProto.close58 = cProto.close;
    //           console.log(cProto.close58)
    //           cProto.close = function () {
    //             // const dropdown = (this.$ || 0).dropdown || 0;
    //             // if (!dropdown) return;
    //             try{
    //               return this.close58.apply(this, arguments);
    //             }catch(e){

    //             }

    //           }
    //         }


    //       });

    //     })();

    NATIVE_CANVAS_ANIMATION && (() => {

      observablePromise(() => {
        HTMLCanvasElement.prototype.animate = animate;
      }, promiseForTamerTimeout).obtain();

    })();

    FIX_ytAction_ && (async () => {

      const ytdApp = await new Promise(resolve => {

        whenCEDefined('ytd-app').then(() => {
          const ytdApp = document.querySelector('ytd-app');
          if (ytdApp) {
            resolve(ytdApp);
            return;
          }
          let mo = new MutationObserver(() => {
            const ytdApp = document.querySelector('ytd-app');
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
      return (((window || 0)._yt_player || 0) || 0);
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




    const generalEvtHandler = async (_evKey, _fvKey, _debug) => {

      const evKey = `${_evKey}`;
      const fvKey = `${_fvKey}`;
      const debug = !!_debug;


      // const rafHub = new RAFHub();


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

    // (FIX_maybeUpdateFlexibleMenu || WEAK_REF_BINDING) && (async () => {


    //   const dummy = await new Promise(resolve => {

    //       whenCEDefined('ytd-menu-renderer').then(() => {

    //         resolve(document.createElement('ytd-menu-renderer'));
    //       });



    //   });


    //   if (!dummy || dummy.is !== 'ytd-menu-renderer') return;

    //   const cProto = insp(dummy).constructor.prototype;

    //   if (FIX_maybeUpdateFlexibleMenu && typeof cProto.created === 'function' && !cProto.created58) {
    //     cProto.created58 = cProto.created;
    //     cProto.created = function (...args) {
    //       const r = this.created58(...args);
    //       if (typeof this.maybeUpdateFlexibleMenu === 'function' && !this.maybeUpdateFlexibleMenu57) {
    //         this.maybeUpdateFlexibleMenu57 = this.maybeUpdateFlexibleMenu;
    //         this.maybeUpdateFlexibleMenu = function (...args) {
    //           Promise.resolve().then(() => this.maybeUpdateFlexibleMenu57(...args));
    //         }
    //       }
    //       return r;
    //     }

    //   }



    //   // if (WEAK_REF_BINDING && typeof cProto.setupFlexibleMenu === 'function' && !cProto.setupFlexibleMenu58) {
    //   //   cProto.setupFlexibleMenu58 = cProto.setupFlexibleMenu;
    //   //   cProto.setupFlexibleMenu = function () {

    //   //     const hostElement = this.hostElement;
    //   //     if (!(hostElement instanceof Node) || hostElement.nodeName === 'NOSCRIPT') {
    //   //       return void 0;
    //   //     } else {
    //   //       return this.setupFlexibleMenu58.apply(this, arguments);
    //   //     }

    //   //   }



    //   // }


    //   // if (WEAK_REF_BINDING && typeof cProto.stampDomArray_ === 'function' && !cProto.stampDomArray58_) {
    //   //   cProto.stampDomArray58_ = cProto.stampDomArray_;
    //   //   cProto.stampDomArray_ = function (a, b, c, d, e, h) {

    //   //     const hostElement = this.hostElement;
    //   //     if (!(hostElement instanceof Node) || hostElement.nodeName === 'NOSCRIPT') {
    //   //       return void 0;
    //   //     } else {
    //   //       return this.stampDomArray58_.apply(this, arguments);
    //   //     }

    //   //   }



    //   // }





    //   //console.log(144,cProto.maybeUpdateFlexibleMenu)






    // })();

    (ENABLE_discreteTasking || UNLOAD_DETACHED_POLYMER) && (async () => {

      const Polymer = await polymerObservable.obtain();
      if (!Polymer) return;


      if (UNLOAD_DETACHED_POLYMER && typeof Polymer.Base.detached === 'function' && !Polymer.Base.detached92 && Polymer.Base.detached.length === 0) {
        Polymer.Base.detached92 = Polymer.Base.detached;

        const detachedPlus = async function (elem) {
          await delay300.then();
          if (elem.isAttached !== false) return;
          await delay300.then();
          if (elem.isAttached !== false) return;

          if (elem.__dataClientsReady === true) elem.__dataClientsReady = false;
          // if (elem.__dataEnabled === true) elem.__dataEnabled = false;
          if (elem.__dataReady === true) elem.__dataReady = false;

          elem.__dataLinkedPaths = elem.__dataToNotify = elem.__dataPendingClients = null;
          elem.__dataHasPaths = false;
          // elem.__dataCompoundStorage = null;
          elem.__dataHost = null;
          elem.__dataTemp = null;
          elem.__dataClientsInitialized = false;


          // elem.data = {};
          elem.data = null;
          elem.__dataPending = null;
          elem.__dataOld = null;
          elem.__dataInstanceProps = null;

          elem.__dataCounter = 0;
          elem.__serializing = false;

          // if (elem.$) elem.$ = {};
          // if (elem.root) elem.root = null;

          // let hostElement = elem.hostElement, tlm;
          // if (hostElement instanceof Node) {
          //   // if (hostElement.isConnected === false) {
          //   // while (tlm = hostElement.firstChild) tlm.remove();
          //   // }
          //   elem.hostElement = hostElement = null;
          // }


          // if (hostElement === null) {

          //   if (elem.animatedIconElement instanceof Node) elem.animatedIconElement = null;
          //   if (elem._target instanceof Node) elem._target = null;
          //   if (elem.iconset instanceof Node) elem.iconset = null;
          //   if (elem._svgIcon instanceof Node) elem._svgIcon = null;

          // }


        }
        Polymer.Base.detached = function () {
          Promise.resolve(this).then(detachedPlus);
          return Polymer.Base.detached92();
        };
      }


      if (ENABLE_discreteTasking) {

        Polymer.Base.__connInit__ = function () {
          setupDiscreteTasks(this);
          // if (WEAK_REF_BINDING && (this.is || this instanceof Node)) {
          //   setupWeakRef(this)
          // }
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

      let __src__ = '';
      const handlerCanplay = (evt) => {
        const a = evt.target;
        console.log('[yt-js-engine-tamer]', `video element added to dom | canplay`, mWeakRef(a), a.readyState, a.networkState, a.currentTime);
        if (a.currentTime < 1e-8 && a.currentTime > -1e-9 && a.autoplay === false) a.currentTime += 1e-8;
      };

      const handlerTimeupdate = (evt) => {
        const a = evt.target;
        console.log('[yt-js-engine-tamer]', `video element added to dom | ontimeupdate`, mWeakRef(a), a.readyState, a.networkState, a.currentTime);
        if (a.duration < 2.01 && a.duration > 1.99 && a.currentSrc === __src__) {
          try {
            URL.revokeObjectURL(__src__);
            __src__ = '';
          } finally {
            console.log('[yt-js-engine-tamer]', `video element added to dom | revokeObjectURL`, mWeakRef(a), a.readyState, a.networkState, a.currentTime);
          }
        }
      };

      const f = Node.prototype.appendChild73 = Node.prototype.appendChild;
      if (f) Node.prototype.appendChild = function (a) {
        if (this instanceof Element) { // exclude DocumentFragment
          try {
            if (a instanceof HTMLVideoElement && FIX_VIDEO_BLOCKING) {
              const src = `${a.src}`;
              const b = src.length > 5 && src.startsWith('blob:') && typeof a.ontimeupdate === 'function' && a.autoplay === false && a.paused === true && a.isConnected === false && typeof nextBrowserTick === 'function' && typeof AbortSignal !== 'undefined';
              if (b) {
                __src__ = src;
                a.addEventListener('canplay', handlerCanplay, { once: true, passive: true, capture: false });
                a.addEventListener('timeupdate', handlerTimeupdate, { once: true, passive: true, capture: false });
              }
              console.log('[yt-js-engine-tamer]', `video element added to dom | treatment = ${b}`, mWeakRef(a), a.readyState, a.networkState);
            } else {
              let checkFragmentA = true;
              if (!NO_PRELOAD_GENERATE_204_BYPASS && document.head === this) {
                if (headLinkCollection === null) headLinkCollection = document.head.getElementsByTagName('LINK');
                for (const node of headLinkCollection) {
                  if (node.rel === 'preload' && node.as === 'fetch') {
                    node.rel = 'prefetch'; // see https://github.com/GoogleChromeLabs/quicklink
                  }
                }
              } else if (this.nodeName.startsWith('YT-')) { // yt-animated-rolling-number, yt-attributed-string
                checkFragmentA = false;
              }
              if ((a instanceof DocumentFragment) && checkFragmentA && a.firstElementChild === null) {
                // no element in fragmentA
                let doNormal = false;
                for (let child = a.firstChild; child instanceof Node; child = child.nextSibling) {
                  if (child.nodeType === 3) { doNormal = true; break; }
                }
                if (!doNormal) return a;
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
        return arguments.length === 1 && this.appendChild73 ? this.appendChild73(a) : (this.appendChild73 || Node.prototype.appendChild73 || f).apply(this, arguments);
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
                if ((FIX_schedulerInstanceInstance & 4) && typeof nextBrowserTick == 'function') {
                  const f = requestingArgs[0];
                  const tir = ++mzt;
                  nextBrowserTick(() => {
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

    FIX_yt_player && (async () => {
      // rAf scheduling

      // const rafHub = new RAFHub();

      const _yt_player = await _yt_player_observable.obtain();

      if (!_yt_player || typeof _yt_player !== 'object') return;

      let keyZqOu = getZqOu(_yt_player);


      if (!keyZqOu) return;


      const g = _yt_player
      let k = keyZqOu

      const gk = g[k];
      if (typeof gk !== 'function') return;
      const gkp = gk.prototype;

      let dummyObject = new gk;
      let nilFunc = () => { };

      let nilObj = {};

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
          target[prop] = value

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
          getRafPromise().then(() => {
            this._activation = false;
            if (this[keyCidj]) {
              Promise.resolve().then(this[keyFuncC]);
            }
          });
        }
        this[keyCidj] = 1;
        this[keyBoolD] = true;
      }
        ;
      gkp.stop = function () {
        this[keyCidj] = null
      }


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

          if (c.length < 9) {

          } else if (c.startsWith('scalex(0.') || (c === 'scalex(0)' || c === 'scalex(1)')) {
            let p = c.substring(7, c.length - 1);
            let q = p.length >= 1 ? parseFloat(p) : -1;
            if (q > -1e-5 && q < 1 + 1e-5) {
              transformType = 'scaleX'
              transformValue = q;
              transformUnit = '';
              transformTypeI = 1;
            }
          } else if (c.startsWith('translateX(') && c.endsWith('px)')) {
            let p = c.substring(11, c.length - 3);
            let q = p.length >= 1 ? parseFloat(p) : NaN;
            if (typeof q === 'number' && !isNaN(q)) {
              transformType = 'translateX'
              transformValue = q;
              transformUnit = 'px';
              transformTypeI = 2;
            } else if (p === 'NaN') {
              return;
            }
          } else if (c.startsWith('scaley(0.') || (c === 'scaley(0)' || c === 'scaley(1)')) {
            let p = c.substring(7, c.length - 1);
            let q = p.length >= 1 ? parseFloat(p) : -1;
            if (q > -1e-5 && q < 1 + 1e-5) {
              transformType = 'scaleY'
              transformValue = q;
              transformUnit = '';
              transformTypeI = 1;
            }
          } else if (c.startsWith('translateY(') && c.endsWith('px)')) {
            let p = c.substring(11, c.length - 3);
            let q = p.length >= 1 ? parseFloat(p) : NaN;
            if (typeof q === 'number' && !isNaN(q)) {
              transformType = 'translateY'
              transformValue = q;
              transformUnit = 'px';
              transformTypeI = 2;
            } else if (p === 'NaN') {
              return;
            }
          } else if (c.startsWith('scalex(') && c.includes('e-')) {
            // scalex(1.252057684158767e-16)
            // scalex(3.0393632069734948e-9)
            let p = c.substring(7, c.length - 1);
            let q = p.length >= 1 ? parseFloat(p) : -1;
            if (q > -1e-5 && q < 1e-5) {
              transformType = 'scaleX'
              transformValue = 0;
              transformUnit = '';
              transformTypeI = 1;
            }
          } else if (c.startsWith('scaley(') && c.includes('e-')) {
            let p = c.substring(7, c.length - 1);
            let q = p.length >= 1 ? parseFloat(p) : -1;
            if (q > -1e-5 && q < 1e-5) {
              transformType = 'scaleY'
              transformValue = 0;
              transformUnit = '';
              transformTypeI = 1;
            }
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
        // const set77 = new Set(['top', 'left', 'bottom', 'right']); // caption positioning - immediate change

        const modifiedFn = (a, b, c, immediateChange = false) => {

          // console.log(140000, a, b, c);
          if (typeof c === 'number' && typeof b === 'string' && a instanceof HTMLElement) {
            const num = c;
            c = `${num}`;
            if (c.length > 5) c = (num < 10 && num > -10) ? toFixed2(num, 3) : toFixed2(num, 1);
          }

          if (typeof b === 'string' && typeof c === 'string' && a instanceof HTMLElement) {

            let elmPropTemp = null;

            if (b === "transform") {

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
                if (!a.classList.contains('caption-window') && !a.classList.contains('ytp-caption-segment')) {
                  console.log(27304, a, b, c)
                }
              }
            }

            attrUpdateFn.call(this, a, b, c);
            return;
          } else if (typeof (b || 0) === 'object') {

            // this is to fix caption positioning
            // const immediate = (a.id || 0).length > 14 && (('top' in b) || ('left' in b) || ('right' in b) || ('bottom' in b));
            const immediate = (a.id || 0).length > 14;
            for (const [k, v] of Object.entries(b)) {
              modifiedFn(a, k, v, immediate);
            }

          } else {
            console.log(27306, a, b, c);

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




    })();

    FIX_yt_player && (async () => {
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

          const style = document.createElement('style');
          style.textContent = `
            @keyFrames aF1 {
              0% {
                order: 0;
              }
              100% {
                order: 6;
              }
            }
            #a-f[id] {
              visibility: collapse !important;
              position: fixed !important;
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
            super.add(key); // Set the key with a dummy value (true)
            while (super.size > this.limit) {
              const firstKey = super.values().next().value; // Get the first (oldest) key
              super.delete(firstKey); // Delete the oldest key
            }
          }
        }

        removeAdd(key) {
          super.delete(key);
          super.add(key);
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


      const FIX_avoid_incorrect_video_meta_bool = FIX_avoid_incorrect_video_meta && isPrepareCachedV && check_for_set_key_order;


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
                if (mtzCount > 1e9) mtzCount = 1e4;
                ++mtzCount;
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


      FIX_ytdExpander_childrenChanged && whenCEDefined('ytd-expander').then(() => {

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
              getRafPromise().then(() => {
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
                getRafPromise().then(this._boundAnimate38);
              } else {
                this.onAnimationComplete()
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
            getRafPromise().then(f);
          } else {
            return setTimeout.apply(window, arguments)
          }

        }

        const xrequestAnimationFrame = function (f) {
          const h = f + "";
          if (h.startsWith("function(){setTimeout(function(){") && h.endsWith("})}")) {
            xsetTimeout.m511 = 1;
            f();
            xsetTimeout.m511 = 0;
          } else if (h.includes("requestAninmationFrameResolver")) {
            getRafPromise().then(f);
          } else {
            return requestAnimationFrame.apply(window, arguments);
          }
        }

        let busy = false;
        const doIdomRender = function () {
          if (busy) {
            return this.doIdomRender13.apply(this, arguments);
          }
          busy = true;
          const { requestAnimationFrame, setTimeout } = window;
          window.requestAnimationFrame = xrequestAnimationFrame;
          window.setTimeout = xsetTimeout;
          let r = this.doIdomRender13.apply(this, arguments);
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

            console.debug('FIX_doIdomRender', ytTag)



          });

        }

      }



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
