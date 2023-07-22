// ==UserScript==
// @name                YouTube: Force html5_exponential_memory_for_sticky
// @namespace           Violentmonkey Scripts
// @match               https://www.youtube.com/*
// @version             0.2.2
// @license             MIT
// @author              CY Fung
// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/yt-engine.png
// @description         To prevent YouTube to change the video quality automatically during YouTube Live Streaming.
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// ==/UserScript==

// html5_exponential_memory_for_sticky
/* "YouTube to change the video quality automatically during YouTube Live Streaming" refers to the following code:

k_=function(a){if(a.Tf){var b=a.Zi;var c=a.Tf;a=a.Dv();if(b.va.qt().isInline())var d=gO;else b.N("html5_exponential_memory_for_sticky")?d=.5>Jwa(b.Z.Wf,"sticky-lifetime")?"auto":TH[xL()]:d=TH[xL()],d=g.RH("auto",d,!1,"s");if(SH(d)){d=n_a(b,c);var e=d.compose,f;a:if((f=c.j)&&f.videoInfos.length){for(var h=g.u(f.videoInfos),l=h.next();!l.done;l=h.next()){l=l.value;var m=void 0;if(null==(m=l.u)?0:m.smooth){f=l.video.j;break a}}f=f.videoInfos[0].video.j}else f=0;Tma()&&!g.MM(b.Z)&&hI(c.j.videoInfos[0])&&
(f=Math.min(f,g.QH.large));d=e.call(d,new PH(0,f,!1,"o"));e=d.compose;f=4320;!b.Z.u||g.FM(b.Z)||b.Z.N("hls_for_vod")||b.Z.N("mweb_remove_360p_cap")||(f=g.QH.medium);(h=g.AL(b.Z.experiments,"html5_default_quality_cap"))&&c.j.j&&!c.videoData.aj&&!c.videoData.me&&(f=Math.min(f,h));h=g.AL(b.Z.experiments,"html5_random_playback_cap");l=/[a-h]$/;h&&l.test(c.videoData.clientPlaybackNonce)&&(f=Math.min(f,h));if(l=h=g.AL(b.Z.experiments,"html5_hfr_quality_cap"))a:{l=c.j;if(l.j)for(l=g.u(l.videoInfos),m=l.next();!m.done;m=
l.next())if(32<m.value.video.fps){l=!0;break a}l=!1}l&&(f=Math.min(f,h));(h=g.AL(b.Z.experiments,"html5_live_quality_cap"))&&c.videoData.isLivePlayback&&(f=Math.min(f,h));f=A_a(b,c,f);d=e.call(d,new PH(0,4320===f?0:f,!1,"d")).compose(z_a(b)).compose(B_a(b,c.videoData,c)).compose(y_a(b,c)).compose(q_a(b,c));SH(a)&&(d=d.compose(r_a(b,c)))}else b.N("html5_perf_cap_override_sticky")&&(d=d.compose(y_a(b,c))),b.N("html5_ustreamer_cap_override_sticky")&&(d=d.compose(r_a(b,c)));d=d.compose(q_a(b,c));b=c.videoData.Yx.compose(d).compose(c.videoData.lT).compose(a)}else b=
gO;return b};

*/

((__CONTEXT__) => {


    const win = this instanceof Window ? this : window;
  
    // Create a unique key for the script and check if it is already running
    const hkey_script = 'ezinmgkfbpgh';
    if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
    win[hkey_script] = true;
  
    /** @type {globalThis.PromiseConstructor} */
    const Promise = ((async () => { })()).constructor;
  
    let isMainWindow = false;
    try {
      isMainWindow = window.document === window.top.document
    } catch (e) { }
  
  
  
    const hLooper = ((fn) => {
  
      let nativeFnLoaded = false;
      let kc1 = 0;
  
      const setIntervalW = setInterval;
      const clearIntervalW = clearInterval;
      let microDisconnectFn = null;
      let fStopLooper = false;
      const looperFn = () => {
        if (fStopLooper) return;
  
  
  
        let obj = null;
        try {
          obj = ytcfg.data_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH;
        } catch (e) { }
  
  
  
        if (obj) {
  
          fn(obj);
  
          if (microDisconnectFn) {
            let isYtLoaded = false;
            try {
              isYtLoaded = typeof ytcfg.set === 'function';
            } catch (e) { }
            if (isYtLoaded) {
              microDisconnectFn();
            }
          }
  
        }
  
  
  
  
      };
  
      const controller = {
        start() {
          kc1 = setIntervalW(looperFn, 1);
          (async () => {
            while (true && !nativeFnLoaded) {
              looperFn();
              if (fStopLooper) break;
              await (new Promise(requestAnimationFrame));
            }
          })();
          looperFn();
        },
        setupForCleanContext(__CONTEXT__) {
  
          const { requestAnimationFrame, setInterval, clearInterval, setTimeout, clearTimeout } = __CONTEXT__;
  
          (async () => {
            while (true) {
              looperFn();
              if (fStopLooper) break;
              await (new Promise(requestAnimationFrame));
            }
          })();
  
          let kc2 = setInterval(looperFn, 1);
  
          const marcoDisconnectFn = () => {
            if (fStopLooper) return;
            Promise.resolve().then(() => {
              if (kc1 || kc2) {
                kc1 && clearIntervalW(kc1); kc1 = 0;
                kc2 && clearInterval(kc2); kc2 = 0;
                looperFn();
              }
              fStopLooper = true;
            });
            document.removeEventListener('yt-page-data-fetched', marcoDisconnectFn, false);
            document.removeEventListener('yt-navigate-finish', marcoDisconnectFn, false);
            document.removeEventListener('spfdone', marcoDisconnectFn, false);
          };
          document.addEventListener('yt-page-data-fetched', marcoDisconnectFn, false);
          document.addEventListener('yt-navigate-finish', marcoDisconnectFn, false);
          document.addEventListener('spfdone', marcoDisconnectFn, false);
  
  
          function onReady() {
            if (!fStopLooper) {
              setTimeout(() => {
                !fStopLooper && marcoDisconnectFn();
              }, 1000);
            }
          }
  
          Promise.resolve().then(() => {
            if (document.readyState !== 'loading') {
              onReady();
            } else {
              window.addEventListener("DOMContentLoaded", onReady, false);
            }
          });
  
          nativeFnLoaded = true;
  
          microDisconnectFn = () => Promise.resolve(marcoDisconnectFn).then(setTimeout);
  
        }
      };
  
      return controller;
    })((obj) => {
  
      if (typeof obj.serializedExperimentFlags === 'string') {
        if (obj.serializedExperimentFlags.indexOf('&h5_expr_b9Nkc=true') > 0) return;
        obj.serializedExperimentFlags = obj.serializedExperimentFlags.replace(/(^|&)html5_exponential_memory_for_sticky=\w+/, '') + '&html5_exponential_memory_for_sticky=true&h5_expr_b9Nkc=true';
      }
  
  
  
    });
  
    hLooper.start();
  
  
    const cleanContext = async (win) => {
      const waitFn = requestAnimationFrame; // shall have been binded to window
      try {
        let mx = 16; // MAX TRIAL
        const frameId = 'vanillajs-iframe-v1'
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
        const { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout } = fc;
        const res = { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout };
        for (let k in res) res[k] = res[k].bind(win); // necessary
        if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
        return res;
      } catch (e) {
        console.warn(e);
        return null;
      }
    };
  
    cleanContext(win).then(__CONTEXT__ => {
  
      const { requestAnimationFrame, setInterval, clearInterval, setTimeout, clearTimeout } = __CONTEXT__;
  
      hLooper.setupForCleanContext(__CONTEXT__)
  
    });
  
  })(null);
  