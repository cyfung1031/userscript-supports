// ==UserScript==
// @name        YouTube JS Engine Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.3.0
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

  const Promise = (async () => { })().constructor;

  let isMainWindow = false;
  try {
    isMainWindow = window.document === window.top.document
  } catch (e) { }

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


    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p
        && typeof p.start === 'function'
        && typeof p.isActive === 'function'
        && typeof p.stop === 'function') {

        return k;

      }

    }


  }


  const getVG = (_yt_player) => {


    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p
        && typeof p.show === 'function' && p.show.length === 1
        && typeof p.hide === 'function' && p.hide.length === 0
        && typeof p.stop === 'function' && p.stop.length === 0) {

        return k;

      }

    }


  }

  let foregroundPromise = null;

  const getForegroundPromise = () => {
    if (document.visibilityState === 'visible') return Promise.resolve();
    else {
      return foregroundPromise = foregroundPromise || new Promise(resolve => {
        requestAnimationFrame(() => {
          foregroundPromise = null;
          resolve();
        });
      });
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
    const getRafPromiseForTickers = () => (rafPromiseForTickers = (rafPromiseForTickers || new Promise(resolve => {
      requestAnimationFrame((hRes) => {
        rafPromiseForTickers = null;
        resolve(hRes);
      });
    })));

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

        let timerId = null;
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
              getForegroundPromise().then(runnerFn);
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

    console.groupEnd();

  }


})();