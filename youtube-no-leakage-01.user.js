// ==UserScript==
// @name        YouTube: Fix Memory Leakage by usePatchedLifecycles
// @namespace   UserScripts
// @match       https://*.youtube.com/*
// @exclude     /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @grant       none
// @version     0.0.5
// @author      CY Fung
// @license     MIT
// @description Some dummy elements leak.
// @run-at      document-start
// @inject-into page
// @unwrap
// @license             MIT
// @compatible          chrome
// @compatible          firefox
// @compatible          opera
// @compatible          edge
// @compatible          safari
// @allFrames           true
// ==/UserScript==


(() => {

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
    const indr = o => insp(o).$ || o.$ || 0;
  
    const getThumbnail = (thumbnails) => {
      let v = 0, n = (thumbnails || 0).length;
      if (!n) return null;
      let j = -1;
      for (let i = 0; i < n; i++) {
        const thumbnail = thumbnails[i];
        let k = thumbnail.width * thumbnail.height;
        if (k > v) {
          j = i;
          v = k;
        }
      }
      if (j >= 0) {
        return thumbnails[j];
      }
      return null;
    }
  
    // let normal = false;
    const ytDOMWM = new WeakMap();
    Object.defineProperty(Element.prototype, 'usePatchedLifecycles', {
      get() {
        let val = ytDOMWM.get(this);
        if (val === 0) val = false;
        if (val && !this.isConnected && !this.classList.contains('style-scope')) val = false;
        return val;
      },
      set(nv) {
        let control = false;
        const nodeName = (this?.nodeName || '').toLowerCase();
        switch (nodeName) {
          case 'yt-attributed-string':
          case 'yt-image':
            if (this?.classList?.length > 0) {
              control = false;
            } else {
              control = true;
            }
            break;
  
          case 'yt-player-seek-continuation':
          // case 'yt-iframed-player-events-relay':
          case 'yt-payments-manager':
          case 'yt-visibility-monitor':
          // case 'yt-invalidation-continuation': // live chat loading
          case 'yt-live-chat-replay-continuation':
          case 'yt-reload-continuation':
          case 'yt-timed-continuation':
  
            control = true;
            break;
          case 'yt-horizontal-list-renderer':
          case 'ytd-rich-grid-slim-media':
          case 'ytd-rich-item-renderer':
          case 'yt-emoji-picker-renderer':
            // if (!normal) {
              // control = true;
            // }
            break;
          case 'yt-img-shadow':
            if (nv) {
              const cnt = insp(this);
              const url0 = getThumbnail(cnt?.__data?.thumbnail?.thumbnails)?.url
              if (url0 && url0.length > 17) {
                // normal = true;
                control = true;
                Promise.resolve(0).then(() => {
                  const url = getThumbnail(cnt?.__data?.thumbnail?.thumbnails)?.url || url0;
                  cnt.$.img.src = `${url}`;
                });
              } else {
                control = false;
              }
            }
            break;
          default:
            control = false;
            // if (nv) {
            //   if (!normal) {
            //     Promise.resolve(0).then(() => {
            //       if (!normal && (this.classList.contains('style-scope') || this.isConnected === true)) {
            //         normal = true;
            //       }
            //     });
            //   }
            // }
        }
        if (control) nv = 0;
        ytDOMWM.set(this, nv);
        return true;
      },
      enumerable: false,
      configurable: true
    });
  
  })();