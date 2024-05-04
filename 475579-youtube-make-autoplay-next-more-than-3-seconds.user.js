// ==UserScript==
// @name        YouTube: Make AutoPlay Next More Than 3 seconds
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.2.4
// @author      CY Fung
// @license     MIT
// @description To make AutoPlay Next Duration longer
// @grant       none
// @run-at      document-start
// @unwrap
// @inject-into page
// ==/UserScript==

(() => {

  const second_to_play_next = +localStorage.second_to_play_next || 8;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

  const Promise = (async () => { })().constructor;

  /*
   *
 
 
 
      , $mb = function(a, b) {
          b = void 0 === b ? -1 : b;
          a = a.j.Ha("ytp-autonav-endscreen-upnext-header");
          g.of(a);
          if (0 <= b) {
              b = String(b);
              var c = "$SECONDS \u79d2\u5f8c\u306b\u6b21\u306e\u52d5\u753b\u3092\u518d\u751f".match(RegExp("\\$SECONDS", "gi"))[0]
                , d = "$SECONDS \u79d2\u5f8c\u306b\u6b21\u306e\u52d5\u753b\u3092\u518d\u751f".indexOf(c);
              if (0 <= d) {
                  a.appendChild(g.mf("$SECONDS \u79d2\u5f8c\u306b\u6b21\u306e\u52d5\u753b\u3092\u518d\u751f".slice(0, d)));
                  var e = g.lf("span");
                  g.$t(e, "ytp-autonav-endscreen-upnext-header-countdown-number");
                  g.Bf(e, b);
                  a.appendChild(e);
                  a.appendChild(g.mf("$SECONDS \u79d2\u5f8c\u306b\u6b21\u306e\u52d5\u753b\u3092\u518d\u751f".slice(d + c.length)));
                  return
              }
          }
          g.Bf(a, "\u6b21\u306e\u52d5\u753b")
      }
 
 
 
 
 
  */





  /*
   *
 
 
 
          if (!a.Qk()) {
              a.J.Bf() ? $mb(a, Math.round(anb(a) / 1E3)) : $mb(a);
              b = !!a.suggestion && !!a.suggestion.Bs;
              var c = a.J.Bf() || !b;
              g.fu(a.container.element, "ytp-autonav-endscreen-upnext-alternative-header-only", !c && b);
              g.fu(a.container.element, "ytp-autonav-endscreen-upnext-no-alternative-header", c && !b);
              g.FG(a.B, a.J.Bf());
              g.fu(a.element, "ytp-enable-w2w-color-transitions", bnb(a))
          }
 
 
  */

  /*
   *
   *
 
 
      , anb = function(a) {
          if (a.J.isFullscreen()) {
              var b;
              a = null == (b = a.J.getVideoData()) ? void 0 : b.CB;
              return -1 === a || void 0 === a ? 8E3 : a
          }
          return 0 <= a.J.Ss() ? a.J.Ss() : g.WJ(a.J.W().experiments, "autoplay_time") || 1E4
      }
 
  */

  // a.J instanceof g.AU
  /*
   *
   *
 
    g.AU {Dp: false, xk: undefined, app: g.b1, state: WQa, playerType: undefined, …}
  
    Dp: false
    UK: pYa {Dp: false, xk: Array(6), Ub: {…}, Td: {…}, element: div#ytp-id-18.ytp-popup.ytp-settings-menu, …}
    app: g.b1 {Dp: false, xk: Array(21), logger: g.pY, di: false, bA: false, …}
    element: null
    j: false
    playerType: undefined
    state: WQa {Dp: false, xk: undefined, D: Set(89), G: {…}, S: {…}, …}
    xk: undefined
  */

  // a.J.Ss = ƒ (){return this.app.Ss()}
  // a.J.app.Ss = ƒ (){return this.getVideoData().aU}
  // a.J.app.getVideoData() = ƒ (){return this.Qb.getVideoData()} = object instanceof g.sT
  // a.J.app.Qb.getVideoData = ƒ (){return this.videoData}
  // g.sT.prototype

  /*
   *
    getAudioTrack
    getAvailableAudioTracks
    getHeartbeatResponse
    getPlayerResponse
    getPlaylistSequenceForTime
    getStoryboardFormat
    hasProgressBarBoundaries
    hasSupportedAudio51Tracks
    isAd
    isDaiEnabled
    isLoaded
    isOtf
    useInnertubeDrmService
 
  */



  const getsT = (_yt_player) => {
    const w = 'sT';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p) {
        let q = 0;
        if (typeof p.hasSupportedAudio51Tracks === 'function' && p.hasSupportedAudio51Tracks.length === 0) q += 2;
        if (typeof p.getStoryboardFormat === 'function' && p.getStoryboardFormat.length === 0) q += 4;
        if (typeof p.getPlaylistSequenceForTime === 'function' && p.getPlaylistSequenceForTime.length === 1) q += 4;
        if (typeof p.isLoaded === 'function' && p.isLoaded.length === 0) q += 200;

        if (typeof p.isOtf === 'function' && p.isOtf.length === 0) q += 2;
        if (typeof p.getAvailableAudioTracks === 'function' && p.getAvailableAudioTracks.length === 0) q += 4;
        if (typeof p.getAudioTrack === 'function' && p.getAudioTrack.length === 0) q += 4;
        if (typeof p.getPlayerResponse === 'function' && p.getPlayerResponse.length === 0) q += 2;
        if (typeof p.getHeartbeatResponse === 'function' && p.getHeartbeatResponse.length === 0) q += 2;

        if (typeof p.isAd === 'function' && p.isAd.length === 0) q += 2;
        if (typeof p.isDaiEnabled === 'function' && p.isDaiEnabled.length === 1) q += 2;
        if (typeof p.useInnertubeDrmService === 'function' && p.useInnertubeDrmService.length === 0) q++;
        if (typeof p.hasProgressBarBoundaries === 'function' && p.hasProgressBarBoundaries.length === 0) q += 2;

        if (q < 200) continue; // p.isLoaded is required

        if (q > 0) arr.push([k, q]);

      }

    }


    if (arr.length === 0) {

      console.warn(`Key does not exist. [${w}]`);
    } else {

      if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);


      console.log(`[${w}]`, arr);
      return arr[0][0];
    }



  }


  // const addProtoToArr = (parent, key, arr) => {


  //   let isChildProto = false;
  //   for (const sr of arr) {
  //     if (parent[key].prototype instanceof parent[sr]) {
  //       isChildProto = true;
  //       break;
  //     }
  //   }

  //   if (isChildProto) return;

  //   arr = arr.filter(sr => {
  //     if (parent[sr].prototype instanceof parent[key]) {
  //       return false;
  //     }
  //     return true;
  //   });

  //   arr.push(key);

  //   return arr;


  // }


  // const getAU = (_yt_player) => {
  //   const w = 'VG';

  //   let arr = [];

  //   for (const [k, v] of Object.entries(_yt_player)) {

  //     const p = typeof v === 'function' ? v.prototype : 0;
  //     if (p
  //       && typeof p.show === 'function' && p.show.length === 1
  //       && typeof p.hide === 'function' && p.hide.length === 0
  //       && typeof p.stop === 'function' && p.stop.length === 0) {

  //       arr = addProtoToArr(_yt_player, k, arr) || arr;

  //     }

  //   }


  //   if (arr.length === 0) {

  //     console.warn(`Key does not exist. [${w}]`);
  //   } else {

  //     console.log(`[${w}]`, arr);
  //     return arr[0];
  //   }



  // }



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
            win = null;
            const m = n;
            n = null;
            setTimeout(() => m.remove(), 200);
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



  cleanContext(window).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { setTimeout } = __CONTEXT__;

    const isUrlInEmbed = location.href.includes('.youtube.com/embed/');
    const isAbortSignalSupported = typeof AbortSignal !== "undefined";

    const promiseForTamerTimeout = new Promise(resolve => {
      !isUrlInEmbed && isAbortSignalSupported && document.addEventListener('yt-action', function () {
        setTimeout(resolve, 480);
      }, { capture: true, passive: true, once: true });
      !isUrlInEmbed && isAbortSignalSupported && typeof customElements === "object" && customElements.whenDefined('ytd-app').then(() => {
        setTimeout(resolve, 1200);
      });
      setTimeout(resolve, 3000);
    });


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

    (async () => {

      const autoplayRendererP = new PromiseExternal();
      const instReadyP = new PromiseExternal();

      let bSetupDone = false;

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

      if (isAbortSignalSupported && !isUrlInEmbed) {
        await customElements.whenDefined('ytd-player');
      }

      const _yt_player = await observablePromise(() => {
        return (((window || 0)._yt_player || 0) || 0);
      }, promiseForTamerTimeout).obtain();

      if (!_yt_player || typeof _yt_player !== 'object') return;

      // store and control variables
      const pm = new Proxy({}, {
        set(target, prop, value, receiver) {
          let old = target[prop];
          if (old !== value) {
            target[prop] = old = value;
            if (prop === 'instsT') value && objProceed(true);
          }
        }
      });

      const objProceed = (toResolveInstSetPromise) => {
        const resAssigned = obtainOAR();
        if (resAssigned) bSetupDone ? assignDurationToOAR(pm.playerOAR, null) : autoplayRendererP.resolve();
        if (toResolveInstSetPromise) instReadyP.resolve();
      }

      const assignDurationToOAR = (playerOAR) => {
        if (!playerOAR) return;
        const t4 = playerOAR.countDownSecsForFullscreen;
        const t5 = playerOAR.countDownSecs;
        let b = t4 === t5
        playerOAR.countDownSecsForFullscreen = second_to_play_next;
        if (b) playerOAR.countDownSecs = second_to_play_next;
        return b;
      }

      Promise.all([autoplayRendererP, instReadyP]).then(() => {

        const inst = pm.instsT;
        const playerOAR = pm.playerOAR;
        if (!inst || !playerOAR) return;

        let entriesA = Object.entries(inst).filter(e => typeof e[1] === 'number');
        let m = new Map();
        for (const entry of entriesA) {
          m.set(entry[0], entry[1]);
        }

        let b = assignDurationToOAR(playerOAR);

        bSetupDone = true;

        setTimeout(() => {
          const entriesB = Object.entries(inst).filter(e => typeof e[1] === 'number' && m.get(e[0]) !== e[1]);
          m = null;
          const filtered = entriesB.filter(e => Math.abs(e[1] - second_to_play_next * 1E3) < 1e-8);
          if (filtered.length >= 1) {
            pm.targetKeys = filtered.map(e => e[0]);
          } else {
            pm.targetKeys = null;
          }
          console.log(`sT(${b ? 'T' : 'F'}):`, filtered, filtered.length)
        }, 80);

      });

      const obtainOAR = () => {

        let playerOAR = null;
        let pageDataMgr = document.querySelector('ytd-page-manager#page-manager');
        let pageData = pageDataMgr ? insp(pageDataMgr).data : null;
        if (pageData) {
          try {
            playerOAR = pageData.response.playerOverlays.playerOverlayRenderer.autoplay.playerOverlayAutoplayRenderer;
          } catch (e) { }
        }
        if (playerOAR && typeof playerOAR.countDownSecsForFullscreen === 'number' && playerOAR.countDownSecsForFullscreen < 15) {
          pm.playerOAR = playerOAR;
          return true;
        }

      };

      document.addEventListener('yt-navigate-finish', function () {
        objProceed(false);
      }, false);

      const g = _yt_player;
      const keysT = getsT(_yt_player);

      if (keysT) {
        let k = keysT;
        let gk = g[k];
        let gkp = g[k].prototype;


        /*
         *
          if (typeof p.hasSupportedAudio51Tracks === 'function' && p.hasSupportedAudio51Tracks.length === 0) q += 2;
          if (typeof p.getStoryboardFormat === 'function' && p.getStoryboardFormat.length === 0) q += 4;
          if (typeof p.getPlaylistSequenceForTime === 'function' && p.getPlaylistSequenceForTime.length === 1) q += 4;
          if (typeof p.isLoaded === 'function' && p.isLoaded.length === 0) q += 2;
  
          if (typeof p.isOtf === 'function' && p.isOtf.length === 0) q += 2;
          if (typeof p.getAvailableAudioTracks === 'function' && p.getAvailableAudioTracks.length === 0) q += 4;
          if (typeof p.getAudioTrack === 'function' && p.getAudioTrack.length === 0) q += 4;
          if (typeof p.getPlayerResponse === 'function' && p.getPlayerResponse.length === 0) q += 2;
          if (typeof p.getHeartbeatResponse === 'function' && p.getHeartbeatResponse.length === 0) q += 2;
  
          if (typeof p.isAd === 'function' && p.isAd.length === 0) q += 2;
          if (typeof p.isDaiEnabled === 'function' && p.isDaiEnabled.length === 1) q += 2;
          if (typeof p.useInnertubeDrmService === 'function' && p.useInnertubeDrmService.length === 0) q++;
          if (typeof p.hasProgressBarBoundaries === 'function' && p.hasProgressBarBoundaries.length === 0) q += 2;
  
        */

        //       for(const pk of ['hasSupportedAudio51Tracks','getStoryboardFormat','getPlaylistSequenceForTime','isLoaded',
        //                      'isOtf',//'getAvailableAudioTracks','getAudioTrack',
        //                      'getPlayerResponse','getHeartbeatResponse',
        //                     // 'isAd',
        //                        'isDaiEnabled','useInnertubeDrmService',
        //                        //'hasProgressBarBoundaries'
        //                     ]){

        //       }


        if (!gkp.isLoaded75 && typeof gkp.isLoaded === 'function') {
          gkp.isLoaded75 = gkp.isLoaded;
          gkp.isLoaded = function () {
            pm.instsT = this;
            return arguments.length === 0 ? this.isLoaded75() : this.isLoaded75(...arguments);
          }
        }

      }





    })();

  });

})();