// ==UserScript==
// @name        YouTube JS Engine Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.4.7
// @license     MIT
// @author      CY Fung
// @icon        https://github.com/cyfung1031/userscript-supports/raw/main/icons/yt-engine.png
// @description To enhance YouTube performance by modifying YouTube JS Engine
// @grant       none
// @run-at      document-start
// @unwrap
// @inject-into page
// @allFrames   true
// ==/UserScript==

(() => {

  const NATIVE_CANVAS_ANIMATION = true; // for #cinematics
  const FIX_schedulerInstanceInstance_ = true;
  const FIX_yt_player = true;
  const FIX_Animation_n_timeline = true;
  const NO_PRELOAD_GENERATE_204 = false;
  const CHANGE_appendChild = true;

  const FIX_error_many_stack = true; // should be a bug caused by uBlock Origin
  // const FIX_error_many_stack_keepAliveDuration = 200; // ms
  // const FIX_error_many_stack_keepAliveDuration_check_if_n_larger_than = 8;

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


  const prepareLogs = [];

  const skipAdsDetection = new Set(['/robots.txt', '/live_chat', '/live_chat_replay']);

  let winError00 = window.onerror;

  let fix_error_many_stack_state = !FIX_error_many_stack ? 0 : skipAdsDetection.has(location.pathname) ? 2 : 1;

  if (!JSON || !('parse' in JSON)) fix_error_many_stack_state = 0;

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

    if (p1 !== p2) return (fix_error_many_stack_state = -1); // p1 != p2

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

    fix_error_many_stack_state = 1;
    JSON.parse.stackNeedleDetails = stackNeedleDetails;
    JSON.parse.objectPrune = objectPrune;

  })();

  ; fix_error_many_stack_state === 1 && (() => {


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

    fix_error_many_stack_state = -1; // p1 != p2
    

  })();

  fix_error_many_stack_state === -1 && (()=>{

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

  const Promise = (async () => { })().constructor;

  let isMainWindow = false;
  try {
    isMainWindow = window.document === window.top.document
  } catch (e) { }

  let NO_PRELOAD_GENERATE_204_BYPASS = NO_PRELOAD_GENERATE_204 ? false : true;

  const onRegistryReady = (callback) => {
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
  };

  const getZq = (_yt_player) => {

    const w = 'Zq';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p
        && typeof p.start === 'function' && p.start.length === 0
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



  // << if FIX_schedulerInstanceInstance_ >>

  let idleFrom = Date.now() + 2700;
  let slowMode = false;

  let ytEvented = false;


  function setupEvents() {

    document.addEventListener('yt-navigate', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 2700;

    });
    document.addEventListener('yt-navigate-start', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 2700;

    });

    document.addEventListener('yt-page-type-changed', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 1700;

    });


    document.addEventListener('yt-player-updated', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 1700;

    });


    document.addEventListener('yt-page-data-fetched', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 1700;

    });

    document.addEventListener('yt-navigate-finish', () => {

      ytEvented = true;
      slowMode = false;
      let t = Date.now() + 700;
      if (t > idleFrom) idleFrom = t;

    });

    document.addEventListener('yt-page-data-updated', () => {

      ytEvented = true;
      slowMode = false;
      let t = Date.now() + 700;
      if (t > idleFrom) idleFrom = t;

    });

    document.addEventListener('yt-watch-comments-ready', () => {

      ytEvented = true;
      slowMode = false;
      let t = Date.now() + 700;
      if (t > idleFrom) idleFrom = t;

    });
  }


  // << end >>

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
      const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback, getComputedStyle } = fc;
      const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback, getComputedStyle };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      res.animate = fc.HTMLElement.prototype.animate;
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };


  const promiseForCustomYtElementsReady = new Promise(onRegistryReady);

  cleanContext(window).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, animate, requestIdleCallback, getComputedStyle } = __CONTEXT__;



    let rafPromiseForTickers = null;

    const getRafPromiseForTickers = () => rafPromiseForTickers || (rafPromiseForTickers = new Promise(resolve => {
      requestAnimationFrame(hRes => {
        rafPromiseForTickers = null;
        resolve(hRes);
      });
    }));

    const getForegroundPromise = () => {
      if (document.visibilityState === 'visible') {
        return Promise.resolve();
      } else {
        return getRafPromiseForTickers();
      }
    };

    NO_PRELOAD_GENERATE_204_BYPASS || promiseForCustomYtElementsReady.then(() => {
      setTimeout(() => {
        NO_PRELOAD_GENERATE_204_BYPASS = true;
      }, 1270);
    });

    const promiseForTamerTimeout = new Promise(resolve => {
      promiseForCustomYtElementsReady.then(() => {
        customElements.whenDefined('ytd-app').then(() => {
          setTimeout(resolve, 1200);
        });
      });
      setTimeout(resolve, 3000);
    });


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



    NATIVE_CANVAS_ANIMATION && (() => {

      HTMLCanvasElement.prototype.animate = animate;

      let cid = setInterval(() => {
        HTMLCanvasElement.prototype.animate = animate;
      }, 1);

      promiseForTamerTimeout.then(() => {
        clearInterval(cid)
      });

    })();

    CHANGE_appendChild && (() => {

      HTMLElement.prototype.appendChild73 = HTMLElement.prototype.appendChild;
      HTMLElement.prototype.appendChild = function (a) {
        if (!NO_PRELOAD_GENERATE_204_BYPASS && document.head === this) {
          for (let node = this.firstElementChild; node instanceof HTMLElement; node = node.nextElementSibling) {
            if (node.nodeName === 'LINK' && node.rel === 'preload' && node.as === 'fetch' && !node.__m848__) {
              node.__m848__ = 1;
              node.rel = 'prefetch'; // see https://github.com/GoogleChromeLabs/quicklink
            }
          }
        }
        if (a instanceof DocumentFragment) {
          if (a.firstElementChild === null) return a;
        }
        return this.appendChild73.apply(this, arguments)
      }


    })();


    FIX_schedulerInstanceInstance_ && (async () => {


      const schedulerInstanceInstance_ = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((window || 0).ytglobal || 0).schedulerInstanceInstance_ || 0);
          if (t) {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);
        promiseForTamerTimeout.then(() => {
          resolve(null)
        });
      });

      if (!schedulerInstanceInstance_) return;


      if (!ytEvented) {
        idleFrom = Date.now() + 2700;
        slowMode = false; // integrity
      }

      const checkOK = typeof schedulerInstanceInstance_.start === 'function' && !schedulerInstanceInstance_.start991 && !schedulerInstanceInstance_.stop && !schedulerInstanceInstance_.cancel && !schedulerInstanceInstance_.terminate && !schedulerInstanceInstance_.interupt;
      if (checkOK) {

        schedulerInstanceInstance_.start991 = schedulerInstanceInstance_.start;

        let requestingFn = null;
        let requestingArgs = null;
        let requestingDT = 0;

        // let timerId = null;
        const entries = [];
        const f = function () {
          requestingFn = this.fn;
          requestingArgs = [...arguments];
          requestingDT = Date.now();
          entries.push({
            fn: requestingFn,
            args: requestingArgs,
            t: requestingDT
          });
          // if (Date.now() < idleFrom) {
          //   timerId = this.fn.apply(window, arguments);
          // } else {
          //   timerId = this.fn.apply(window, arguments);

          // }
          // timerId = 12377;
          return 12377;
        }


        const fakeFns = [
          f.bind({ fn: requestAnimationFrame }),
          f.bind({ fn: setInterval }),
          f.bind({ fn: setTimeout }),
          f.bind({ fn: requestIdleCallback })
        ]




        let timerResolve = null;
        setInterval(() => {
          timerResolve && timerResolve();
          timerResolve = null;
          if (!slowMode && Date.now() > idleFrom) slowMode = true;
        }, 250);

        let mzt = 0;

        let fnSelectorProp = null;

        schedulerInstanceInstance_.start = function () {

          const mk1 = window.requestAnimationFrame
          const mk2 = window.setInterval
          const mk3 = window.setTimeout
          const mk4 = window.requestIdleCallback

          const tThis = this['$$12378$$'] || this;


          window.requestAnimationFrame = fakeFns[0]
          window.setInterval = fakeFns[1]
          window.setTimeout = fakeFns[2]
          window.requestIdleCallback = fakeFns[3]

          fnSelectorProp = null;


          tThis.start991.call(new Proxy(tThis, {
            get(target, prop, receiver) {
              if (prop === '$$12377$$') return true;
              if (prop === '$$12378$$') return target;

              // console.log('get',prop)
              return target[prop]
            },
            set(target, prop, value, receiver) {
              // console.log('set', prop, value)


              if (value >= 1 && value <= 4) fnSelectorProp = prop;
              if (value === 12377 && fnSelectorProp) {

                const originalSelection = target[fnSelectorProp];
                const timerIdProp = prop;

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

                const doForegroundSlowMode = () => {

                  const tir = ++mzt;
                  const f = requestingArgs[0];


                  getForegroundPromise().then(() => {


                    new Promise(r => {
                      timerResolve = r
                    }).then(() => {
                      if (target[timerIdProp] === -tir) f();
                    });

                  })

                  target[fnSelectorProp] = 931;
                  target[prop] = -tir;
                }

                if (target[fnSelectorProp] === 2 && requestingFn === setTimeout) {
                  if (slowMode && !(requestingArgs[1] > 250)) {

                    doForegroundSlowMode();

                  } else {
                    target[prop] = setTimeout.apply(window, requestingArgs);

                  }

                } else if (target[fnSelectorProp] === 3 && requestingFn === requestAnimationFrame) {

                  if (slowMode) {

                    doForegroundSlowMode();

                  } else {
                    target[prop] = requestAnimationFrame.apply(window, requestingArgs);
                  }


                } else if (target[fnSelectorProp] === 4 && requestingFn === setTimeout && !requestingArgs[1]) {

                  const f = requestingArgs[0];
                  const tir = ++mzt;
                  Promise.resolve().then(() => {
                    if (target[timerIdProp] === -tir) f();
                  });
                  target[fnSelectorProp] = 930;
                  target[prop] = -tir;

                } else if (target[fnSelectorProp] === 1 && (requestingFn === requestIdleCallback || requestingFn === setTimeout)) {

                  doForegroundSlowMode();

                } else {
                  // target[prop] = timerId;
                  target[fnSelectorProp] = 0;
                  target[prop] = 0;
                }

                // *****
                // console.log('[[set]]', slowMode , prop, value, `fnSelectorProp: ${originalSelection} -> ${target[fnSelectorProp]}`)
              } else {

                target[prop] = value;
              }
              // console.log('set',prop,value)
              return true;
            }
          }));

          fnSelectorProp = null;


          window.requestAnimationFrame = mk1;
          window.setInterval = mk2
          window.setTimeout = mk3
          window.requestIdleCallback = mk4;



        }

        schedulerInstanceInstance_.start.toString = function () {
          return schedulerInstanceInstance_.start991.toString();
        }

        // const funcNames = [...(schedulerInstanceInstance_.start + "").matchAll(/[\(,]this\.(\w{1,2})[,\)]/g)].map(e => e[1]).map(prop => ({
        //   prop,
        //   value: schedulerInstanceInstance_[prop],
        //   type: typeof schedulerInstanceInstance_[prop]

        // }));
        // console.log('fcc', funcNames)




      }
    })();


    FIX_yt_player && (async () => {



      const rafHub = new RAFHub();


      const _yt_player = await new Promise(resolve => {

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



      if (!_yt_player || typeof _yt_player !== 'object') return;



      let keyZq = getZq(_yt_player);
      let keyVG = getVG(_yt_player);
      let buildVG = _yt_player[keyVG];
      let u = new buildVG({
        api: {},
        element: document.createElement('noscript'),
        api: {},
        hide: () => { }
      }, 250);
      const timeDelayConstructor = u.delay.constructor; // g.br
      // console.log(keyVG, u)
      // buildVG.prototype.show = function(){}
      // _yt_player[keyZq] = g.k

      if (!keyZq) return;


      const g = _yt_player
      let k = keyZq

      const gk = g[k];
      if (typeof gk !== 'function') return;

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

      dummyObject.start.call(new Proxy(dummyObject, dummyObjectProxyHandler))

      /*
            console.log({
              keyBoolD,
              keyFuncC,
              keyWindow,
              keyCidj
            })

            console.log( dummyObject[keyFuncC])


            console.log(2222222222)
      */




      g[k].prototype.start = function () {
        this.stop();
        this[keyBoolD] = true;
        this[keyCidj] = rafHub.request(this[keyFuncC]);
      }
        ;
      g[k].prototype.stop = function () {
        if (this.isActive() && this[keyCidj]) {
          rafHub.cancel(this[keyCidj]);
        }
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

        k = keyzo

        const setCSSProp = (() => {

          let animationPropCapable = false;
          try {
            const propName = "--ibxpf"
            const value = 2;
            const keyframes = [{
              [propName]: value
            }];
            window.CSS.registerProperty({
              name: "--ibxpf",
              syntax: "<number>",
              inherits: false,
              initialValue: 1,
            });
            animationPropCapable = '1' === `${getComputedStyle(document.documentElement).getPropertyValue('--ibxpf')}`
          } catch (e) { }

          if (!animationPropCapable) {
            return (element, cssProp, value) => {


              element.style.setProperty(cssProp, value);

            }
          }

          const propMaps = new Map();

          function setCustomCSSProperty(element, propName, value) {
            let wm = propMaps.get(propName);
            if (!wm) {

              try {
                window.CSS.registerProperty({
                  name: propName,
                  syntax: "*",
                  inherits: false
                });
              } catch (e) {
                console.warn(e);
              }

              propMaps.set(propName, (wm = new WeakMap()));
            }

            // Create the animation keyframes with the provided property and value
            const keyframes = [{
              [propName]: value
            }];

            let currentAnimation = wm.get(element);
            if (currentAnimation) {

              currentAnimation.effect.setKeyframes(keyframes);

            } else {



              // Set the animation on the element and immediately pause it
              const animation = animate.call(element, keyframes, {
                duration: 1, // Very short duration as we just want to set the value
                fill: 'forwards',
                iterationStart: 1,
                iterations: 2,
                direction: 'alternate'
              });


              // animation.currentTime = 1;
              animation.pause();

              wm.set(element, animation);


            }

          }

          return setCustomCSSProperty;


        })();


        const attrUpdateFn = g[k];
        g['$$original$$' + k] = attrUpdateFn;
        g[k] = function (a, b, c) {

          // console.log(140000, a, b, c);

          let transformType = '';
          let transformValue = 0;
          let transformUnit = '';

          let byPassDefaultFn = false;
          if (b === "transform" && typeof c === 'string') {

            byPassDefaultFn = true;

            const aStyle = a.style;

            // let beforeMq = aStyle.getPropertyValue('--mq-transform');
            if (!(a instanceof HTMLElement)) return;
            if (c.length === 0) {

            } else if (c.startsWith('scalex(0.') || (c === 'scalex(0)' || c === 'scalex(1)')) {
              let p = c.substring(7, c.length - 1);
              let q = p.length >= 1 ? parseFloat(p) : -1;
              if (q > -1e-5 && q < 1 + 1e-5) {
                transformType = 'scalex'
                transformValue = q;
                transformUnit = '';
              }


            } else if (c.startsWith('translateX(') && c.endsWith('px)')) {

              let p = c.substring(11, c.length - 3);
              let q = p.length >= 1 ? parseFloat(p) : NaN;

              if (typeof q === 'number' && !isNaN(q)) {
                transformType = 'translateX'
                transformValue = q;
                transformUnit = 'px';
              }


            } else if (c.startsWith('scaley(0.') || (c === 'scaley(0)' || c === 'scaley(1)')) {
              let p = c.substring(7, c.length - 1);
              let q = p.length >= 1 ? parseFloat(p) : -1;
              if (q > -1e-5 && q < 1 + 1e-5) {
                transformType = 'scaley'
                transformValue = q;
                transformUnit = '';
              }


            } else if (c.startsWith('translateY(') && c.endsWith('px)')) {

              let p = c.substring(11, c.length - 3);
              let q = p.length >= 1 ? parseFloat(p) : NaN;

              if (typeof q === 'number' && !isNaN(q)) {
                transformType = 'translateY'
                transformValue = q;
                transformUnit = 'px';
              }


            }

            if (transformType) {

              if (transformType === 'scalex' || transformType === 'scaley') {

                const q = transformValue;


                /*

                let vz = Math.round(steppingScaleN * q);
                const customPropName = '--discrete-'+transformType

                const currentValue = aStyle.getPropertyValue(customPropName);

                const transform = (aStyle.transform || '');
                const u = transform.includes(customPropName)
                if (`${currentValue}` === `${vz}`) {
                  if (u) return;
                }


                setCSSProp(a,customPropName, vz);
                // aStyle.setProperty(customPropName, vz)

                let ck = '';

                if (c.length === 9) ck = c;
                else if (!u) ck = c.replace(/[.\d]+/, '0.5');

                if (ck && beforeMq !== ck) {
                  aStyle.setProperty('--mq-transform', ck);
                }

                if (u) return;
                c = `${transformType}(calc(var(--discrete-${transformType})/${steppingScaleN}))`;



                */

                const vz = +(Math.round(q * steppingScaleN) / steppingScaleN).toFixed(3);

                c = `${transformType === 'scalex' ? 'scaleX' : 'scaleY'}(${vz})`
                const cv = aStyle.transform;

                // console.log(157, cv,c)

                if (c === cv) return;
                // console.log(257, cv,c)

                aStyle.transform = c;

                // return;

              } else if (transformType === 'translateX' || transformType === 'translateY') {

                const q = transformValue;

                /*

                let vz = q.toFixed(1);
                const customPropName = '--discrete-'+transformType

                const aStyle = a.style;
                const currentValue = (aStyle.getPropertyValue(customPropName) || '').replace('px', '');


                const transform = (aStyle.transform || '');
                const u = transform.includes(customPropName)
                if (parseFloat(currentValue).toFixed(1) === vz) {
                  if (u) return;
                }

                setCSSProp(a,customPropName, vz + 'px');
                // aStyle.setProperty(customPropName, vz + 'px')

                let ck = '';
                if (c.length === 15) ck = c;
                else if (!u) ck = c.replace(/[.\d]+/, '0.5');

                if (ck && beforeMq !== ck) {
                  aStyle.setProperty('--mq-transform', ck);
                }

                if (u) return;
                c = `${transformType}(var(--discrete-${transformType}))`;

                */


                const vz = +q.toFixed(1);

                c = `${transformType}(${vz}${transformUnit})`
                const cv = aStyle.transform;

                // console.log(158, cv,c)

                if (c === cv) return;
                // console.log(258, cv,c)

                aStyle.transform = c;

                // return;

              } else {
                throw new Error();
              }

            } else {
              // if(beforeMq) a.style.setProperty('--mq-transform', '');
              const cv = aStyle.transform
              if (!c && !cv) return;
              else if (c === cv) return;
              aStyle.transform = c;
              // return;
            }

          } else if (b === "display") {

            const cv = a.style.display;
            if (!cv && !c) return;
            if (cv === c) return;


          } else if (b === "width") {

            const cv = a.style.width;
            if (!cv && !c) return;
            if (cv === c) return;

          }

          // console.log(130000, a, b, c);

          if (byPassDefaultFn) return;
          return attrUpdateFn.call(this, a, b, c);
        }


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



    FIX_Animation_n_timeline && (async () => {


      const timeline = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((document || 0).timeline || 0) || 0);
          if (t && typeof t._play === 'function') {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);

        promiseForTamerTimeout.then(() => {
          resolve(null)
        });

      });


      const Animation = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((window || 0).Animation || 0) || 0);
          if (t && typeof t === 'function' && t.length === 2 && typeof t.prototype._updatePromises === 'function') {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);

        promiseForTamerTimeout.then(() => {
          resolve(null)
        });

      });

      if (!timeline) return;
      if (!Animation) return;

      const aniProto = Animation.prototype;

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
              getRafPromiseForTickers().then(runnerFn);
            }
          }

          const restartWebAnimationsNextTick = () => {
            if (!restartWebAnimationsNextTickFlag) {
              restartWebAnimationsNextTickFlag = true;
              getRafPromiseForTickers().then(runnerFn);
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
              animation: 1ms steps(2) 0ms infinite alternate forwards running aF1 !important;
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
          })
          /*
          v.animationsWithPromises = v.animationsWithPromises.filter(function (c) {
            return c._updatePromises();
          });
          */
        }

        timProto._updateAnimationsPromises31 = timProto._updateAnimationsPromises;

        timProto._updateAnimationsPromises = _updateAnimationsPromises;


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



  });


  setupEvents();



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