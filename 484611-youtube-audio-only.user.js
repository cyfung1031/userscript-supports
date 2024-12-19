// ==UserScript==
// @name                YouTube: Audio Only
// @description         No Video Streaming
// @namespace           UserScript
// @version             1.9.2
// @author              CY Fung
// @match               https://www.youtube.com/*
// @match               https://www.youtube.com/embed/*
// @match               https://www.youtube-nocookie.com/embed/*
// @match               https://m.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/YouTube-Audio-Only.png
// @grant               GM_registerMenuCommand
// @grant               GM.setValue
// @grant               GM.getValue
// @grant               GM.listValues
// @grant               GM.deleteValue
// @run-at              document-start
// @license             MIT
// @compatible          chrome
// @compatible          firefox
// @compatible          opera
// @compatible          edge
// @compatible          safari
// @allFrames           true
//
// ==/UserScript==

(async function () {
    'use strict';

      !window.TTP && (() => {
        // credit to Benjamin Philipp
        // original source: https://greasyfork.org/en/scripts/433051-trusted-types-helper
      
        // --------------------------------------------------- Trusted Types Helper ---------------------------------------------------
      
        const overwrite_default = false; // If a default policy already exists, it might be best not to overwrite it, but to try and set a custom policy and use it to manually generate trusted types. Try at your own risk
        const prefix = `TTP`;
        var passThroughFunc = function (string, sink) {
          return string; // Anything passing through this function will be returned without change
        }
        var TTPName = "passthrough";
        var TTP_default, TTP = { createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc }; // We can use TTP.createHTML for all our assignments even if we don't need or even have Trusted Types; this should make fallbacks and polyfills easy
        var needsTrustedHTML = false;
        function doit() {
          try {
            if (typeof window.isSecureContext !== 'undefined' && window.isSecureContext) {
              if (window.trustedTypes && window.trustedTypes.createPolicy) {
                needsTrustedHTML = true;
                if (trustedTypes.defaultPolicy) {
                  log("TT Default Policy exists");
                  if (overwrite_default)
                    TTP = window.trustedTypes.createPolicy("default", TTP);
                  else
                    TTP = window.trustedTypes.createPolicy(TTPName, TTP); // Is the default policy permissive enough? If it already exists, best not to overwrite it
                  TTP_default = trustedTypes.defaultPolicy;
      
                  log("Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '" + TTPName + "' in var 'TTP':", TTP);
                }
                else {
                  TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);
                }
                log("Trusted-Type Policies: TTP:", TTP, "TTP_default:", TTP_default);
              }
            }
          } catch (e) {
            log(e);
          }
        }
      
        function log(...args) {
          if ("undefined" != typeof (prefix) && !!prefix)
            args = [prefix + ":", ...args];
          if ("undefined" != typeof (debugging) && !!debugging)
            args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
          console.log(...args);
        }
      
        doit();
      
        // --------------------------------------------------- Trusted Types Helper ---------------------------------------------------
      
        window.TTP = TTP;
      
      })();
      
      function createHTML(s) {
        if (typeof TTP !== 'undefined' && typeof TTP.createHTML === 'function') return TTP.createHTML(s);
        return s;
      }
      
      let trustHTMLErr = null;
      try {
        document.createElement('div').innerHTML = createHTML('1');
      } catch (e) {
        trustHTMLErr = e;
      }
      
      if (trustHTMLErr) {
        console.log(`trustHTMLErr`, trustHTMLErr);
        trustHTMLErr(); // exit userscript
      }

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    if (typeof AbortSignal === 'undefined') throw new DOMException("Please update your browser.", "NotSupportedError");

    async function confirm(message) {
        // Create the HTML for the dialog

        if (!document.body) return;

        let dialog = document.getElementById('confirmDialog794');
        if (!dialog) {

            const dialogHTML = `
            <div id="confirmDialog794" class="dialog-style" style="display: block;">
                <div class="confirm-box">
                    <p>${message}</p>
                    <div class="confirm-buttons">
                        <button id="confirmBtn">Confirm</button>
                        <button id="cancelBtn">Cancel</button>
                    </div>
                </div>
            </div>
        `;

            // Append the dialog to the document body
            document.body.insertAdjacentHTML('beforeend', createHTML(dialogHTML));
            dialog = document.getElementById('confirmDialog794');

        }

        // Return a promise that resolves or rejects based on the user's choice
        return new Promise((resolve) => {
            document.getElementById('confirmBtn').onclick = () => {
                resolve(true);
                cleanup();
            };

            document.getElementById('cancelBtn').onclick = () => {
                resolve(false);
                cleanup();
            };

            function cleanup() {
                dialog && dialog.remove();
                dialog = null;
            }
        });
    }



    if (location.pathname === '/live_chat' || location.pathname === 'live_chat_replay') return;

    const kEventListener = (evt) => {
        if (document.documentElement.hasAttribute('forceRefresh032')) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
        }
    }
    window.addEventListener('beforeunload', kEventListener, false);

    const pageInjectionCode = function () {

        let debugFlg001 = false;
        // let debugFlg002 = false;
        let globalPlayer = null;
        const SHOW_VIDEO_STATIC_IMAGE = true;
        const PATCH_MEDIA_PUBLISH = true;

        if (typeof AbortSignal === 'undefined') throw new DOMException("Please update your browser.", "NotSupportedError");

        const URL = window.URL || new Function('return URL')();
        const createObjectURL = URL.createObjectURL.bind(URL);

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

        /* globals WeakRef:false */

        /** @type {(o: Object | null) => WeakRef | null} */
        const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null);

        /** @type {(wr: Object | null) => Object | null} */
        const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

        /*

            g.k.playVideo = function(a) {
                this.logger.debug(function() {
                    return "play video, player type " + a
                });
                var b = g.rT(this, a);
                b && (this.appState === 2 ? (g.BR(this.X) && $U(this.Rb),
                N0(this)) : g.pF(b.getPlayerState(), 2) ? (b = 36,
                this.getVideoData().nk() && (b = 37),
                this.seekTo(0, void 0, void 0, void 0, b)) : b.playVideo())
            }

            g.k.getPresentingPlayerType = function(a) {
                if (this.appState === 1)
                    return 1;
                if (J0(this))
                    return 3;
                var b;
                if (a && ((b = this.ye) == null ? 0 : b.vl(this.getCurrentTime())))
                    return 2;
                var c;
                return g.zS(this.getVideoData()) && ((c = this.wb) == null ? 0 : c.vl()) ? 2 : g.rT(this).getPlayerType()
            }

            g.k.rS = function() {
                var a = this.app.getPresentingPlayerType();
                if (a === 2 && !this.app.Jf()) {
                    var b = zV(this.app.zb());
                    if (!Dkb(b) || Ekb(b))
                        return
                }
                a === 3 ? AT(this.app.zb()).iG("control_play") : this.app.U().L("html5_ssap_ignore_play_for_ad") && g.zS(this.app.Od()) && a === 2 || this.app.playVideo(a)
            }
        */

        // const onDurationAvailable = async function(player_, media){
        //     if (media instanceof HTMLMediaElement && media.__canPlayPromise__ && media.duration > 0 && media.networkState >= 2 && media.readyState >= 1) {
        //         skipPause = true;
        //         skipVisibility = true;
        //         debugFlg002 && console.log(1991, player_.getPresentingPlayerType())
        //         await player_.cancelPlayback();
        //         debugFlg002 && console.log(1992, player_.getPresentingPlayerType())
        //         await player_.pauseVideo();
        //         debugFlg002 && console.log(1993, player_.getPresentingPlayerType())
        //         // window.m33e = 1;
        //         window.m34e = player_;
        //         // await player_.clearQueue();
        //         await player_.playVideo();
        //         skipVisibility = false;
        //         skipPause = false;

        //         debugFlg002 && console.log('HTMLMediaElement A2', [media.readyState, media.paused, media.networkState]);
        //         if (media instanceof HTMLMediaElement && media.__canPlayPromise__ && media.duration > 0 && media.networkState >= 2 && media.readyState >= 4) {
        //             media.__canPlayPromise__.resolve();
        //             media.__canPlayPromise__ = null;
        //         }
        //     }
        // }

        // let skipPause = false;
        // let skipVisibility = false;
        // const durationchangeListener = async function (evt) {
        //     const media = evt ? evt.target : null;
        //     if (media instanceof HTMLMediaElement && media.__canPlayPromise__ && media.duration > 0 && media.networkState >= 2 && media.readyState >= 1) {
        //         if (media.readyState < 4) {
        //             debugFlg002 && console.log('HTMLMediaElement A1', [media.readyState, media.paused, media.networkState])
        //             const player_ = kRef(globalPlayer);
        //             if (player_) {
        //                 onDurationAvailable(player_, media);
        //             } else {
        //                 console.error("HTMLMediaElement", "player_ is not found when HTMLMediaElement duration change");
        //             }
        //         } else {
        //             debugFlg002 && console.log('HTMLMediaElement B', [media.readyState, media.paused, media.networkState])
        //             media.__canPlayPromise__.resolve();
        //             media.__canPlayPromise__ = null;
        //         }
        //     }
        // }

        // const canplayListener = function (evt) {
        //     const media = evt ? evt.target : null;
        //     if (media && media.__canPlayPromise__) {
        //         debugFlg002 && console.log('HTMLMediaElement canplay', [media.readyState, media.paused, media.networkState]);
        //         media.__canPlayPromise__.resolve();
        //         media.__canPlayPromise__ = null;
        //     }
        //     debugFlg002 && console.log('HTMLMediaElement canplay')
        // }

        // let x6CGdPr = null;
        // window.addEventListener('message', (evt)=>{
        //   if((evt||0).data === 'x6CGd' && x6CGdPr!==null) x6CGdPr.resolve();
        // });
        // const timelineResolve = async () => {
        //   if (x6CGdPr !== null) {
        //     await x6CGdPr.then();
        //     return;
        //   }
        //   x6CGdPr = new PromiseExternal();
        //   window.postMessage('x6CGd');
        //   await x6CGdPr.then();
        //   x6CGdPr = null;
        // }

        // let playWId = 0;

        // const mediaPlay = HTMLMediaElement.prototype.play
        // HTMLMediaElement.prototype.play = function () {
        //     debugFlg002 && console.log('HTMLMediaElement play')
        //     if (playWId > 1e9) playWId = 9;
        //     const tid = ++playWId;
        //     if (!this.paused) {
        //         return mediaPlay.apply(this, arguments);
        //     }
        //     if (this.readyState >= 4) return mediaPlay.apply(this, arguments);
        //     try {
        //         if (!this.__canPlayPromise__ && this.closest('#player')) {
        //             this.__canPlayPromise__ = new PromiseExternal();
        //             const player_ = kRef(globalPlayer);
        //             debugFlg002 && console.log('HTMLMediaElement play x', this.duration, player_)
        //             if (!(this.duration > 0)) {
        //                 this.removeEventListener('durationchange', durationchangeListener);
        //                 this.addEventListener('durationchange', durationchangeListener);
        //                 this.removeEventListener('canplay', canplayListener);
        //                 this.addEventListener('canplay', canplayListener);
        //             } else if (player_) {
        //                 this.removeEventListener('canplay', canplayListener);
        //                 this.addEventListener('canplay', canplayListener);
        //                 onDurationAvailable(player_, this);
        //             } else {
        //                 console.error("HTMLMediaElement", "player_ is not found when HTMLMediaElement plays");
        //             }

        //             //---------------


        //             // this.addEventListener('canplaythrough', function(){
        //             //     console.log('HTMLMediaElement canplaythrough')
        //             // });
        //             // this.addEventListener('loadeddata', function(){
        //             //     console.log('HTMLMediaElement loadeddata')
        //             // });
        //             // this.addEventListener('loadedmetadata', function(){
        //             //     console.log('HTMLMediaElement loadedmetadata')
        //             // });

        //             //---------------

        //             // this.addEventListener('abort', function(){
        //             //     console.log('HTMLMediaElement abort')
        //             // });
        //             // this.addEventListener('emptied', function(){
        //             //     console.log('HTMLMediaElement emptied')
        //             // });
        //             // this.addEventListener('error', function(){
        //             //     console.log('HTMLMediaElement error')
        //             // });
        //             // this.addEventListener('ended', function(){
        //             //     console.log('HTMLMediaElement ended')
        //             // });
        //             // this.addEventListener('loadstart', function(){
        //             //     console.log('HTMLMediaElement loadstart')
        //             // });
        //         }

        //     } catch (e) {
        //         console.log('HTMLMediaElement.prototype.play error');
        //         console.error(e);
        //         this.__canPlayPromise__ = Promise.resolve();
        //     }
        //     const promise = this.__canPlayPromise__;
        //     return (async () => {
        //         await promise.then();
        //         if (tid !== playWId) return;
        //         return await mediaPlay.apply(this, arguments);
        //     })();
        // }
        // const mediaPause = HTMLMediaElement.prototype.pause
        // HTMLMediaElement.prototype.pause = function () {
        //     if (skipPause) return;
        //     debugFlg002 && console.log('HTMLMediaElement pause')
        //     if (playWId > 1e9) playWId = 9;
        //     const tid = ++playWId;
        //     const promise = this.__canPlayPromise__;
        //     if (promise) {
        //         promise.resolve();
        //         this.__canPlayPromise__ = null;
        //     }
        //     return mediaPause.apply(this, arguments);
        // }



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


        const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

        const prototypeInherit = (d, b) => {
            const m = Object.getOwnPropertyDescriptors(b);
            for (const p in m) {
                if (!Object.getOwnPropertyDescriptor(d, p)) {
                    Object.defineProperty(d, p, m[p]);
                }
            }
        };

        let setTimeout_ = setTimeout;
        let clearTimeout_ = clearTimeout;

        const delayPn = delay => new Promise((fn => setTimeout_(fn, delay)));

        const isWatchPageURL = (url) => {
            url = url || location;
            return location.pathname === '/watch' || location.pathname.startsWith('/live/')
        };

        const mockEvent = (o, elem) => {
            o = o || {};
            elem = elem || null;
            return {
                preventDefault: () => { },
                stopPropagation: () => { },
                stopImmediatePropagation: () => { },
                returnValue: true,
                target: elem,
                srcElement: elem,
                defaultPrevented: false,
                cancelable: true,
                timeStamp: performance.now(),
                ...o
            }
        };


        const generalRegister = (prop, symbol, checker, pg) => {
            const objSet = new Set();
            let done = false;
            const f = (o) => {
                const ct = o.constructor;
                const proto = ct.prototype;
                if (!done && proto && ct !== Function && ct !== Object && checker(proto)) {
                    done = true;
                    delete Object.prototype[prop];
                    objSet.delete(proto);
                    objSet.delete(o);
                    for (const obj of objSet) {
                        obj[prop] = obj[symbol];
                        delete obj[symbol];
                    }
                    objSet.clear();
                    Object.defineProperty(proto, prop, pg);
                    return proto;
                }
                return false;
            };
            Object.defineProperty(Object.prototype, prop, {
                get() {
                    const p = f(this);
                    if (p) {
                        return p[prop];
                    } else {
                        return this[symbol];
                    }
                },
                set(nv) {
                    const p = f(this);
                    if (p) {
                        p[prop] = nv;
                    } else {
                        objSet.add(this);
                        this[symbol] = nv;
                    }
                    return true;
                },
                enumerable: false,
                configurable: true
            });

        };

        const mediaNetworkStateReady = async (audio) => {

            if (!(audio instanceof HTMLMediaElement)) {
                return '';
            }
            let done = false;
            const et = await Promise.race([

                new Promise(resolve => {
                    audio.addEventListener('timeupdate', (evt) => {
                        !done && resolve && resolve(evt.type);
                        resolve = null
                    }, { once: true, capture: true, passive: true })
                }),

                new Promise(resolve => {
                    audio.addEventListener('waiting', (evt) => {
                        !done && resolve && resolve(evt.type);
                        resolve = null
                    }, { once: true, capture: true, passive: true })
                }),

                new Promise(resolve => {
                    audio.addEventListener('loadstart', (evt) => {
                        !done && resolve && resolve(evt.type);
                        resolve = null
                    }, { once: true, capture: true, passive: true })
                }),

                new Promise(resolve => {
                    audio.addEventListener('durationchange', (evt) => {
                        !done && resolve && resolve(evt.type);
                        resolve = null
                    }, { once: true, capture: true, passive: true })
                })

            ]);
            done = true;
            return et;

        };

        const updateLastActiveTimeAsync = (player_) => {
            // TBC
            Promise.resolve().then(() => {
                if (typeof player_.updateLastActiveTime === 'function') {
                    player_.updateLastActiveTime();
                }
            });
        };

        const attachOneTimeEvent = function (eventType, callback) {
            let kz = false;
            document.addEventListener(eventType, function (evt) {
                if (kz) return;
                kz = true;
                callback(evt);
            }, { capture: true, passive: true, once: true });
        }

        function removeTempObjectProp01() {
            delete Object.prototype['kevlar_non_watch_unified_player'];
            delete Object.prototype['kevlar_unified_player'];
        }

        function ytConfigFix(config__) {
            const config_ = config__;

            if (config_) {

                const playerKevlar = ((config_ || 0).WEB_PLAYER_CONTEXT_CONFIGS || 0).WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH || 0;

                if (playerKevlar) {

                    // console.log(322, playerKevlar)
                    playerKevlar.allowWoffleManagement = false;
                    playerKevlar.cinematicSettingsAvailable = false;
                    playerKevlar.showMiniplayerButton = false;
                    playerKevlar.showMiniplayerUiWhenMinimized = false;
                    playerKevlar.transparentBackground = false;

                    playerKevlar.enableCsiLogging = false;
                    playerKevlar.externalFullscreen = false;

                    if (typeof playerKevlar.serializedExperimentFlags === 'string') {
                        playerKevlar.serializedExperimentFlags = '';
                        // playerKevlar.serializedExperimentFlags = playerKevlar.serializedExperimentFlags.replace(/[-\w]+=(\[\]|[.-\d]+|[_a-z]+|)(&|$)/g,'').replace(/&$/,'')
                    }

                    if (typeof playerKevlar.serializedExperimentIds === 'string') {
                        playerKevlar.serializedExperimentIds = '';
                        // playerKevlar.serializedExperimentIds = playerKevlar.serializedExperimentIds.replace(/\d+\s*(,\s*|$)/g,'')
                    }

                }

                removeTempObjectProp01();

                let configs = config_.WEB_PLAYER_CONTEXT_CONFIGS || {};
                for (const [key, entry] of Object.entries(configs)) {

                    if (entry && typeof entry.serializedExperimentFlags === 'string' && entry.serializedExperimentFlags.length > 16) {
                        // prevent idle playback failure
                        entry.serializedExperimentFlags = entry.serializedExperimentFlags.replace(/\b(html5_check_for_idle_network_interval_ms|html5_trigger_loader_when_idle_network|html5_sabr_fetch_on_idle_network_preloaded_players|html5_autonav_cap_idle_secs|html5_autonav_quality_cap|html5_disable_client_autonav_cap_for_onesie|html5_idle_rate_limit_ms|html5_sabr_fetch_on_idle_network_preloaded_players|html5_webpo_idle_priority_job|html5_server_playback_start_policy|html5_check_video_data_errors_before_playback_start|html5_check_unstarted|html5_check_queue_on_data_loaded)=([-_\w]+)(\&|$)/g, (_, a, b, c) => {
                            return a + '00' + '=' + b + c;
                        });

                    }

                }

                const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS;

                if (EXPERIMENT_FLAGS) {
                    EXPERIMENT_FLAGS.kevlar_unified_player = true;
                    EXPERIMENT_FLAGS.kevlar_non_watch_unified_player = true;
                }


                const EXPERIMENTS_FORCED_FLAGS = config_.EXPERIMENTS_FORCED_FLAGS;

                if (EXPERIMENTS_FORCED_FLAGS) {
                    EXPERIMENTS_FORCED_FLAGS.kevlar_unified_player = true;
                    EXPERIMENTS_FORCED_FLAGS.kevlar_non_watch_unified_player = true;
                }

            }
        }

        Object.defineProperty(Object.prototype, 'kevlar_non_watch_unified_player', {
            get() {
                // console.log(501, this.constructor.prototype)
                return true;
            },
            set(nv) {
                return true;
            },
            enumerable: false,
            configurable: true
        });


        Object.defineProperty(Object.prototype, 'kevlar_unified_player', {
            get() {
                // console.log(501, this.constructor.prototype)
                return true;
            },
            set(nv) {
                return true;
            },
            enumerable: false,
            configurable: true
        });

        let prr = new PromiseExternal();
        const prrPipeline = createPipeline();
        let stopAndReload = false;

        let fa = 0;

        let cv = null;
        let durationchangeForMobile = false;
        function fixThumbnailURL(src) {
            if (typeof src === 'string' && src.length >= 4) {
                let m = /\b[a-z0-9]{4,13}\.jpg\b/.exec(src);
                if (m && m[0]) {
                    const t = m[0];
                    let idx = src.indexOf(t);
                    let nSrc = idx >= 0 ? src.substring(0, idx + t.length) : '';
                    return nSrc;
                }
            }
            return src;
        }

        const isDesktopSite = location.origin === 'https://www.youtube.com' && !location.pathname.startsWith('/embed/');

        const getThumbnailUrlFromThumbnails = (thumbnails) => {

            let thumbnailUrl = '';
            if (thumbnails && thumbnails.length >= 1) {
                const arr = thumbnails.map(e => {
                    return e.url ? [e.width * e.height, e.url] : typeof e === 'string' ? [0, e] : [0, '']
                });
                arr.sort((a, b) => b[0] - a[0]);
                thumbnailUrl = arr[0][1]
                if (typeof thumbnailUrl === 'string') {
                    thumbnailUrl = fixThumbnailURL(thumbnailUrl);
                }
            }
            return thumbnailUrl;
        }

        const pmof = () => {

            if (SHOW_VIDEO_STATIC_IMAGE) {

                const medias = [...document.querySelectorAll('ytd-watch-flexy #player .html5-video-container .video-stream.html5-main-video')].filter(e => !e.closest('[hidden]'));
                if (medias.length !== 1) return;
                const mediaElement = medias[0];

                const container = mediaElement ? mediaElement.closest('.html5-video-container') : null;
                if (!container) return;

                let thumbnailUrl = '';
                const ytdPage = container.closest('ytd-watch-flexy');
                if (ytdPage && ytdPage.is === 'ytd-watch-flexy') {
                    const cnt = insp(ytdPage);
                    let thumbnails = null;
                    try {
                        thumbnails = cnt.polymerController.__data.playerData.videoDetails.thumbnail.thumbnails
                        // thumbnails = cnt.__data.watchNextData.playerOverlays.playerOverlayRenderer.autoplay.playerOverlayAutoplayRenderer.background.thumbnails
                    } catch (e) { }

                    thumbnailUrl = getThumbnailUrlFromThumbnails(thumbnails);
                }


                if (thumbnailUrl && typeof thumbnailUrl === 'string') {
                    container.style.setProperty('--audio-only-thumbnail-image', `url(${thumbnailUrl})`);
                } else {
                    container.style.removeProperty('--audio-only-thumbnail-image')
                }

            }


        }
        const pmo = new MutationObserver(pmof);

        isDesktopSite && document.addEventListener('yt-navigate-finish', () => {
            const ytdWatchFlexy = document.querySelector('ytd-watch-flexy');
            if (ytdWatchFlexy) {
                pmo.observe(ytdWatchFlexy, { attributes: true });
                ytdWatchFlexy.setAttribute('ytzNavigateFinish', Date.now());
            }
        });
        document.addEventListener('durationchange', (evt) => {
            const target = (evt || 0).target;
            if (!(target instanceof HTMLMediaElement)) return;
            const targetClassList = target.classList || 0;
            const isPlayerVideo = typeof targetClassList.contains === 'function' ? targetClassList.contains('video-stream') && targetClassList.contains('html5-main-video') : false;

            if (durationchangeForMobile || isPlayerVideo) {
                if (target.readyState !== 1) {
                    fa = 1;
                } else {
                    fa = 2;
                }
            }

            if (isPlayerVideo) {

                if (target.readyState === 1 && target.networkState === 2) {
                    target.__spfgs__ = true;
                    if (cv) {
                        cv.resolve();
                        cv = null;
                    }
                } else {
                    target.__spfgs__ = false;
                }

                if (isDesktopSite) {
                    const ytdWatchFlexy = document.querySelector('ytd-watch-flexy');
                    if (ytdWatchFlexy) {
                        ytdWatchFlexy.setAttribute('ytzMediaDurationChanged', Date.now());
                    }
                }

                if (onVideoChangeForMobile) {
                    onVideoChangeForMobile();
                }

            }
        }, true);



        // XMLHttpRequest.prototype.open299 = XMLHttpRequest.prototype.open;
        /*

        XMLHttpRequest.prototype.open2 = function(method, url, ...args){

              if (typeof url === 'string' && url.length > 24 && url.includes('/videoplayback?') && url.replace('?', '&').includes('&source=')) {
                if (vcc !== vdd) {
                  vdd = vcc;
                  window.postMessage({ ZECxh: url.includes('source=yt_live_broadcast') }, "*");
                }
              }

          return this.open299(method, url, ...args)
        }*/



        // desktop only
        // document.addEventListener('yt-page-data-fetched', async (evt) => {

        //   const pageFetchedDataLocal = evt.detail;
        //   let isLiveNow;
        //   try {
        //     isLiveNow = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.isLiveNow;
        //   } catch (e) { }
        //   window.postMessage({ ZECxh: isLiveNow === true }, "*");

        // }, false);

        // return;

        // let clickLockFn = null;


        let onVideoChangeForMobile = null;

        let removeBottomOverlayForMobile = null;

        let clickLockFn = null;
        let clickTarget = null;
        if (location.origin === 'https://m.youtube.com') {

            EventTarget.prototype.addEventListener322 = EventTarget.prototype.addEventListener;

            const dummyFn = () => { };
            EventTarget.prototype.addEventListener = function (evt, fn, opts) {

                let hn = fn;

                // if (evt === 'player-error') {
                // } else if (evt === 'player-detailed-error') {
                // } else if (evt === 'video-data-change') {
                // } else if (evt === 'player-state-change') {
                // } else
                if (evt === 'player-autonav-pause' || evt === 'visibilitychange') {
                    evt += 'y'
                    fn = dummyFn;
                } else if (evt === 'click' && this.id === 'movie_player') {
                    clickLockFn = fn;
                    clickTarget = this;
                }
                return this.addEventListener322(evt, hn, opts)

            }

        }



        (() => {

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
                                // skip = true; // for user activity logging e.g. watched videos
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
                            console.log('xhr warning');
                            return super.send(...args);
                        }
                    }
                }
                c.prototype.__xmMc8__ = 0;
                prototypeInherit(c.prototype, XMLHttpRequest_.prototype);
                return c;
            })();

            const s7 = Symbol();
            const f7 = () => true;

            !window.canRetry9048 && generalRegister('canRetry', s7, (p) => {
                return typeof p.onStateChange === 'function' && typeof p.dispose === 'function' && typeof p.hide === 'undefined' && typeof p.show === 'undefined' && typeof p.isComplete === 'undefined' && typeof p.getDuration === 'undefined'
            }, {
                get() {
                    if ('logger' in this && 'policy' in this && 'xhr' && this) {
                        if (this.errorMessage && typeof this.errorMessage === 'string' && this.errorMessage.includes('XMLHttpRequest') && this.errorMessage.includes('Invalid URL')) { // "SyntaxError_Failed to execute 'open' on 'XMLHttpRequest': Invalid URL"
                            // OKAY !
                            console.log('canRetry05 - ', this.errorMessage)
                            return f7;
                        }
                        // console.log(this)
                        console.log('canRetry02 - ', this.errorMessage, this)
                    } else {
                        console.log('canRetry ERR - ', this.errorMessage)
                    }
                    return this[s7];
                },
                set(nv) {
                    this[s7] = nv;
                    return true;
                },
                enumerable: false,
                configurable: true
            });
            window.canRetry9048 = 1;

        })();

        if (location.origin === 'https://www.youtube.com') {

            if (location.pathname.startsWith('/embed/')) {

                const ytEmbedReady = observablePromise(() => document.querySelector('#player > .ytp-embed')).obtain();

                const embedConfigFix = (async () => {
                    while (true) {
                        const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
                        if (config_) {
                            ytConfigFix(config_);
                            break;
                        }
                        await delayPn(60);
                    }
                });

                ytEmbedReady.then(async (embedPlayer) => {

                    embedConfigFix();

                    const player_ = embedPlayer;
                    // console.log(player_)

                    const asyncStateChange = async (audio, k) => {
                        const refreshAllStaleEntitiesForNonReadyAudio = async () => {
                            try {
                                if (audio.readyState == 0) await player_.refreshAllStaleEntities();
                            } catch (e) {
                            }
                        };
                        const triggerPlaying = async () => {
                            await player_.pauseVideo();
                            await player_.playVideo();
                        };
                        const seekToLiveHeadForLiveStream = async () => {
                            try {
                                await player_.seekToLiveHead();
                                if ((await player_.isAtLiveHead()) === true) {
                                    await player_.seekToStreamTime();
                                    return true;
                                }
                            } catch (e) {
                                console.log('error_F3', e);
                            }
                        };
                        const fixLiveAudioFn = async () => {
                            if (audio.paused === true) {

                                await player_.clearVideo(); // avoid error in live streaming
                                await player_.clearQueue(); // avoid error in live streaming
                                await delayPn(300);
                                for (let i = 0; i < 3; i++) {
                                    if (audio.readyState === 0) {
                                        if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                                    }
                                }
                                if (k === -1) {
                                    await refreshAllStaleEntitiesForNonReadyAudio();
                                } else if (k === 3) {
                                    while (audio.readyState === 0) {
                                        await refreshAllStaleEntitiesForNonReadyAudio();
                                        await triggerPlaying();
                                        await delayPn(300);
                                    }
                                }
                            } else if (audio.paused === false) {

                                if (!player_.isAtLiveHead()) {
                                    if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                                }
                                while (audio.readyState === 0) {
                                    await refreshAllStaleEntitiesForNonReadyAudio();
                                    await triggerPlaying();
                                    await delayPn(300);
                                }
                                if (!player_.isAtLiveHead()) {
                                    if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                                }
                                await refreshAllStaleEntitiesForNonReadyAudio();
                                if (audio.readyState > 0 && audio.paused === true) {
                                    await triggerPlaying();
                                }
                            }

                        }
                        try {
                            let ns23 = audio.networkState == 2 || audio.networkState == 3;

                            if (!ns23 && k === player_.getPlayerState()) {
                                if (k === -1 && audio.readyState === 0) {
                                    const et = await mediaNetworkStateReady(audio);
                                    if (audio.isConnected === false || player_.getPlayerState() === 5) return;
                                    ns23 = audio.networkState == 2 || audio.networkState == 3;
                                    // console.log(503, ns23, et, player_.getPlayerState());
                                    if (player_.getPlayerState() !== -1) return;
                                } else {
                                    console.log(507, k, audio.readyState, audio.networkState)
                                }
                            }

                            if (k === -1 && player_.getPlayerState() === -1 && audio.readyState === 0 && ns23) {
                                await delayPn(200);
                                if (k === -1 && player_.getPlayerState() === -1 && audio.readyState === 0 && ns23) {
                                    await fixLiveAudioFn();
                                }
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState === 1 && ns23 && audio.muted === false) {
                                await seekToLiveHeadForLiveStream();
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === false) {
                                await delayPn(60);
                                if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === false) {
                                    await fixLiveAudioFn();
                                }
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState === 1 && ns23 && audio.muted === true) {
                                await seekToLiveHeadForLiveStream();
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === true) {
                                await delayPn(60);
                                if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === true) {
                                    await fixLiveAudioFn();
                                }
                            }

                        } catch (e) {
                            console.log('error_F4', e)
                        }

                    };

                    // console.log(299, player_)
                    const _onPlayerStateChange = (k) => {
                        try {
                            if (typeof k === 'number' && k === player_.getPlayerState()) {

                                const audio = document.querySelector('#player audio.video-stream.html5-main-video');
                                if (audio) asyncStateChange(audio, k);

                            }
                        } catch (e) {
                            console.log('error_F5', e)
                        }
                    };

                    player_.addEventListener('onStateChange', _onPlayerStateChange);
                    const state0 = player_.getPlayerState();
                    if (typeof state0 === 'number') {
                        _onPlayerStateChange(state0);
                    }

                    player_.addEventListener('onVideoProgress', () => {
                        updateLastActiveTimeAsync(player_);
                    });

                    // console.log(1231)

                    if (SHOW_VIDEO_STATIC_IMAGE) {

                        let displayImage = '';
                        let html5Container = null;


                        const moviePlayer = document.querySelector('#movie_player .html5-video-container .video-stream.html5-main-video');
                        if (moviePlayer) {
                            html5Container = moviePlayer.closest('.html5-video-container');
                        }

                        if (html5Container) {

                            const overlayImage = document.querySelector('#movie_player .ytp-cued-thumbnail-overlay-image[style]');
                            if (overlayImage) {

                                const cStyle = window.getComputedStyle(overlayImage);
                                const cssImageValue = cStyle.backgroundImage;
                                if (cssImageValue && typeof cssImageValue === 'string' && cssImageValue.startsWith('url(')) {
                                    displayImage = cssImageValue;

                                }

                            }

                            if (!displayImage) {

                                const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
                                let embedded_player_response = null;
                                if (config_) {
                                    embedded_player_response = ((config_.PLAYER_VARS || 0).embedded_player_response || 0)
                                }
                                if (embedded_player_response && typeof embedded_player_response === 'string') {

                                    let idx1 = embedded_player_response.indexOf('"defaultThumbnail"');
                                    let idx2 = idx1 >= 0 ? embedded_player_response.lastIndexOf('"defaultThumbnail"') : -1;

                                    if (idx1 === idx2 && idx1 > 0) {

                                        let bk = 0;
                                        let j = -1;
                                        for (let i = idx1; i < embedded_player_response.length; i++) {
                                            if (i > idx1 + 40 && bk === 0) {
                                                j = i;
                                                break;
                                            }
                                            let t = embedded_player_response.charAt(i);
                                            if (t === '{') bk++;
                                            else if (t === '}') bk--;
                                        }

                                        if (j > idx1) {

                                            let defaultThumbnailString = embedded_player_response.substring(idx1, j);
                                            let defaultThumbnailObject = null;

                                            try {
                                                defaultThumbnailObject = JSON.parse(`{${defaultThumbnailString}}`);

                                            } catch (e) { }

                                            const thumbnails = ((defaultThumbnailObject.defaultThumbnail || 0).thumbnails || 0);

                                            if (thumbnails && thumbnails.length >= 1) {

                                                let thumbnailUrl = getThumbnailUrlFromThumbnails(thumbnails);

                                                if (thumbnailUrl && thumbnailUrl.length > 3) {
                                                    displayImage = `url(${thumbnailUrl})`;
                                                }
                                            }
                                        }

                                    }


                                }


                            }

                            if (displayImage) {

                                html5Container.style.setProperty('--audio-only-thumbnail-image', `${displayImage}`);
                            } else {
                                html5Container.style.removeProperty('--audio-only-thumbnail-image')
                            }

                        }


                    }

                });


            } else {

                attachOneTimeEvent('yt-action', () => {
                    const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
                    ytConfigFix(config_);
                });

                const setupAudioPlaying = (player00_) => {
                    const player_ = player00_;
                    if (!player_) return;
                    if (player_.__audio544__) return;
                    player_.__audio544__ = 1;

                    globalPlayer = mWeakRef(player_);

                    // console.log(1233, player_)
                    const mediaCollection = document.getElementsByClassName('html5-main-video');

                    const stopAndReloadFn = async () => {
                        let isLive = false;
                        if (isWatchPageURL()) {
                            const liveBtn = document.querySelector('.ytp-live-badge.ytp-button');
                            try {
                                if (liveBtn && !liveBtn.closest('[hidden]') && (liveBtn.textContent || '').trim().length > 0) {
                                    isLive = true;
                                }
                            } catch (e) { }
                        }
                        if (isLive) {
                            player_.destroy();
                            location.replace(location.href);
                            await delayPn(8000);
                        } else {
                            // await player_.stopVideo();
                            // await player_.updateVideoData();
                            // try{
                            //     await player_.refreshAllStaleEntities();
                            // }catch(e){}
                            // await player_.playVideo();
                        }
                    };
                    const asyncStateChange = async (audio, k) => {

                        const refreshAllStaleEntitiesForNonReadyAudio = async () => {
                            try {
                                if (audio.readyState == 0 && audio.isConnected === true) await player_.refreshAllStaleEntities();
                            } catch (e) {
                            }
                        };
                        const triggerPlaying = async () => {
                            await player_.cancelPlayback();
                            await player_.pauseVideo();
                            await player_.playVideo();
                        };
                        const seekToLiveHeadForLiveStream = async () => {
                            try {
                                audio.isConnected === true && await player_.seekToLiveHead();
                                if (audio.isConnected === true && (await player_.isAtLiveHead()) === true) {
                                    audio.isConnected === true && await player_.seekToStreamTime();
                                    return true;
                                }
                            } catch (e) {
                                console.log('error_F7', e);
                            }
                        };
                        const fixLiveAudioFn = async () => {
                            if (stopAndReload) {
                                stopAndReload = false;
                                await stopAndReloadFn();
                            }
                            if (audio.isConnected === true && audio.paused === true) {
                                await player_.clearVideo(); // avoid error in live streaming
                                await player_.clearQueue(); // avoid error in live streaming
                                await delayPn(300);
                                for (let i = 0; i < 3; i++) {
                                    if (audio.readyState === 0 && audio.isConnected === true) {
                                        if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                                    }
                                }
                                if (k === -1) {
                                    await refreshAllStaleEntitiesForNonReadyAudio();
                                } else if (k === 3) {
                                    while (audio.readyState === 0 && audio.isConnected === true) {
                                        await refreshAllStaleEntitiesForNonReadyAudio();
                                        await triggerPlaying();
                                        await delayPn(300);
                                    }
                                }
                            } else if (audio.isConnected === true && audio.paused === false) {
                                if (!player_.isAtLiveHead() && audio.isConnected === true) {
                                    if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                                }
                                while (audio.readyState === 0 && audio.isConnected === true) {
                                    await refreshAllStaleEntitiesForNonReadyAudio();
                                    await triggerPlaying();
                                    await delayPn(300);
                                }
                                if (!player_.isAtLiveHead() && audio.isConnected === true) {
                                    if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                                }
                                await refreshAllStaleEntitiesForNonReadyAudio();
                                if (audio.readyState > 0 && audio.paused === true && audio.isConnected === true) {
                                    await triggerPlaying();
                                }
                            }
                        }
                        try {

                            let ns23 = audio.networkState == 2 || audio.networkState == 3;

                            if (!ns23 && k === player_.getPlayerState()) {
                                if (k === -1 && audio.readyState === 0) {
                                    const et = await mediaNetworkStateReady(audio);
                                    if (audio.isConnected === false || player_.getPlayerState() === 5) return;
                                    ns23 = audio.networkState == 2 || audio.networkState == 3;
                                    console.log(513, ns23, et, player_.getPlayerState());
                                    if (player_.getPlayerState() !== -1) return;
                                } else if (k === 3 && audio.readyState === 0 && audio.networkState === 0) {
                                    const et = await Promise.race([mediaNetworkStateReady(audio), delayPn(800)]); // idk
                                    if (audio.isConnected === false || player_.getPlayerState() === 5) return;
                                    ns23 = audio.networkState == 2 || audio.networkState == 3;
                                    console.log(514, ns23, et, player_.getPlayerState());
                                    if (player_.getPlayerState() !== 3) return;
                                } else {
                                    console.log(517, k, audio.readyState, audio.networkState) // 517 3 0 0 after tab sleeping
                                }
                            }

                            if (k === -1 && player_.getPlayerState() === -1 && audio.readyState === 0 && ns23) {
                                await delayPn(200);
                                if (k === -1 && player_.getPlayerState() === -1 && audio.readyState === 0 && ns23) {
                                    await fixLiveAudioFn();
                                }
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState === 1 && ns23 && audio.muted === false) {
                                await seekToLiveHeadForLiveStream();
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === false) {
                                await delayPn(60);
                                if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === false) {
                                    await fixLiveAudioFn();
                                }
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState === 1 && ns23 && audio.muted === true) {
                                await seekToLiveHeadForLiveStream();
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === true) {
                                await delayPn(60);
                                if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === true) {
                                    await fixLiveAudioFn();
                                }
                            }

                        } catch (e) {
                            console.log('error_F8', e)
                        }

                    };
                    let mid = 0;
                    const getAudioElement = () => {
                        if (mediaCollection.length === 0) return null;
                        if (mediaCollection.length > 1) {
                            const audios = [...mediaCollection].filter(e => e && !e.closest('[hidden]') && e.closest('ytd-player'));
                            if (audios.length === 1) {
                                return audios[0];
                            }
                        } else if (mediaCollection.length === 1) {
                            const e = mediaCollection[0];
                            if (e && !e.closest('[hidden]') && e.closest('ytd-player')) return e;
                        }
                        return null;
                    };
                    const _onPlayerStateChange = (k_) => {
                        const k = k_;
                        const ps = player_.getPlayerState();
                        if (stopAndReload) {
                            stopAndReload = false;
                            const audio = getAudioElement();
                            if (audio) {
                                prrPipeline(async () => {
                                    await prr.then();
                                    await stopAndReloadFn();
                                });
                            }
                        }
                        if (typeof k === 'number' && k === ps && ps !== 5) {

                            if (mid > 1e9) mid = 9;
                            const t = ++mid;
                            prrPipeline(async () => {
                                if (t !== mid) return;
                                await prr.then();
                                if (t !== mid) return;
                                const audio = getAudioElement();

                                if (audio && player_.getPlayerState() === ps) {
                                    await asyncStateChange(audio, k);
                                }
                            });
                        }
                    };

                    player_.addEventListener('onStateChange', _onPlayerStateChange);
                    const state0 = player_.getPlayerState();
                    // console.log(221, state0)
                    if (typeof state0 === 'number') {
                        _onPlayerStateChange(state0);
                    }

                    player_.addEventListener('onVideoProgress', () => {
                        updateLastActiveTimeAsync(player_);
                    });

                }

                customElements.whenDefined('ytd-player').then(() => {
                    const dummy = document.querySelector('ytd-player') || document.createElement('ytd-player');
                    const cnt = insp(dummy);
                    const cProto = cnt.constructor.prototype;
                    cProto.createMainAppPlayer932_ = cProto.createMainAppPlayer_;
                    cProto.initPlayer932_ = cProto.initPlayer_;
                    const configFixBeforeCreate = () => {
                        try {
                            const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
                            if (config_) {
                                ytConfigFix(config_);
                            }
                        } catch (e) { }
                    }
                    cProto.createMainAppPlayer_ = function (a, b, c) {
                        configFixBeforeCreate();
                        let r = this.createMainAppPlayer932_(a, b, c);
                        try {
                            this.mainAppPlayer_.api.then(function (e) {
                                setupAudioPlaying(e);
                            })
                        } finally {
                            return r;
                        }
                    }
                    cProto.initPlayer_ = function (a) {
                        configFixBeforeCreate();
                        let r = this.initPlayer932_(a);
                        try {
                            r.then(() => {
                                setupAudioPlaying(this.player_);
                            })
                        } finally {
                            return r;
                        }
                    }
                })

                let useStopAndReload = !isWatchPageURL();
                document.addEventListener('yt-navigate-start', () => {
                    prr = new PromiseExternal();
                    if (useStopAndReload) stopAndReload = true;
                });

                document.addEventListener('yt-navigate-cache', () => {
                    prr = new PromiseExternal();
                    if (useStopAndReload) stopAndReload = true;
                });

                document.addEventListener('yt-navigate-finish', () => {
                    prr.resolve();
                });

            }

        } else if (location.origin === 'https://m.youtube.com') {

            removeBottomOverlayForMobile = async (delay) => {


                let closeBtnRenderer = document.querySelector('.ytm-bottom-sheet-overlay-renderer-close.icon-close');
                if (closeBtnRenderer) {

                    const btn = closeBtnRenderer.querySelector('button');
                    const container = closeBtnRenderer.closest('#global-loader ~ .ytm-bottom-sheet-overlay-container');

                    if (container) {
                        container.style.visibility = 'collapse';
                        container.style.zIndex = '-1';
                    }
                    if (btn) {
                        if (delay) {
                            await delayPn(delay);
                        }
                        btn.click();
                    }
                }

            }

            const getAppJSON = () => {
                let t;
                t = document.querySelector('player-microformat-renderer.PlayerMicroformatRendererHost script[type="application/ld+json"]');
                if (t) return t;
                t = document.querySelector('player-microformat-renderer.playerMicroformatRendererHost script[type="application/ld+json"]');
                if (t) return t;

                console.log('[mobile youtube audio only] getAppJSON fails.', document.querySelectorAll('script[type="application/ld+json"]').length);
                return null;

            }


            let lastPlayerInfoText = '';
            let mz = 0;
            onVideoChangeForMobile = async () => {


                let html5Container = null;

                const moviePlayer = document.querySelector('#player .html5-video-container .video-stream.html5-main-video');
                if (moviePlayer) {
                    html5Container = moviePlayer.closest('.html5-video-container');
                }

                console.log('STx00', html5Container)
                if (!html5Container) return;
                let thumbnailUrl = '';

                if (mz > 1e9) mz = 9;
                let mt = ++mz;
                const scriptText = await observablePromise(() => {
                    if (mt !== mz) return 1;
                    const t = getAppJSON();
                    const tt = (t ? t.textContent : '') || '';
                    if (tt === lastPlayerInfoText) return;
                    return tt;
                }).obtain();
                if (typeof scriptText !== 'string') return; // 1
                lastPlayerInfoText = scriptText;

                if (!scriptText) return;


                if (SHOW_VIDEO_STATIC_IMAGE) {
                    console.log('STx01')

                    let idx1 = scriptText.indexOf('"thumbnailUrl"');
                    let idx2 = idx1 >= 0 ? scriptText.lastIndexOf('"thumbnailUrl"') : -1;

                    if (idx1 === idx2 && idx1 > 0) {

                        let bk = 0;
                        let j = -1;
                        for (let i = idx1; i < scriptText.length; i++) {
                            if (i > idx1 + 20 && bk === 0) {
                                j = i;
                                break;
                            }
                            let t = scriptText.charAt(i);
                            if (t === '[') bk++;
                            else if (t === ']') bk--;
                            else if (t === '{') bk++;
                            else if (t === '}') bk--;
                        }


                        if (j > idx1) {

                            let thumbnailUrlString = scriptText.substring(idx1, j);
                            let thumbnailUrlObject = null;

                            try {
                                thumbnailUrlObject = JSON.parse(`{${thumbnailUrlString}}`);

                            } catch (e) { }

                            const thumbnails = thumbnailUrlObject.thumbnailUrl;

                            if (thumbnails && thumbnails.length >= 1 && typeof thumbnails[0] === 'string') {
                                if (thumbnails[0] && thumbnails[0].length > 3) {
                                    thumbnailUrl = thumbnails[0];
                                }
                            }
                        }

                    }
                    console.log('STx02', thumbnailUrl)

                    // const ytipr = (typeof ytInitialPlayerResponse !== 'undefined' ? ytInitialPlayerResponse : null) || 0;

                    // const thumbnails = (((ytipr.videoDetails || 0).thumbnail || 0).thumbnails || 0);

                    // if (thumbnails && thumbnails.length >= 1) {
                    //     thumbnailUrl = getThumbnailUrlFromThumbnails(thumbnails);

                    // }
                    if (thumbnailUrl && typeof thumbnailUrl === 'string') {
                        html5Container.style.setProperty('--audio-only-thumbnail-image', `url(${thumbnailUrl})`);
                    } else {
                        html5Container.style.removeProperty('--audio-only-thumbnail-image')
                    }

                }


                if (removeBottomOverlayForMobile) await removeBottomOverlayForMobile(40);

                await delayPn(80);
                const audio = moviePlayer;
                if (audio && audio.muted === true && audio.isConnected === true && audio.readyState >= 0 && audio.networkState >= 2 && audio.paused === false) {
                    await audio.click();
                }

            }

            let player0 = null;
            let mgg = null;
            const mff = function (e) {
                if (!player0) {
                    if (e && typeof ((e || 0).target || 0).getPlayerState === 'function') {
                        player0 = e.target
                        if (mgg) mgg();
                    }
                }


                // if (SHOW_VIDEO_STATIC_IMAGE && (e.type === 'player-state-change' || e.type === 'video-data-change')) {

                //     onVideoChangeForMobile();
                // }

            }

            document.addEventListener('player-initialized', mff, true);
            document.addEventListener('player-state-change', mff, true);
            document.addEventListener('player-ad-state-change', mff, true);
            document.addEventListener('player-detailed-error', mff, true);
            document.addEventListener('player-error', mff, true);
            document.addEventListener('on-play-autonav-video', mff, true);
            document.addEventListener('on-play-previous-autonav-video', mff, true);
            document.addEventListener('player-fullscreen-change', mff, true);
            document.addEventListener('player-fullscreen-toggled', mff, true);
            document.addEventListener('player-dom-paused', mff, true);
            document.addEventListener('yt-show-toast', mff, true);
            document.addEventListener('yt-innertube-command', mff, true);
            document.addEventListener('yt-update-c3-companion', mff, true);
            document.addEventListener('video-data-change', mff, true);
            document.addEventListener('video-progress', mff, true);
            document.addEventListener('local-media-change', mff, true);


            let tc = false;
            // let pw = null;
            (async () => {

                let player__;

                const getAudioElement = () => {
                    const elm = player__ || player0;
                    const audio = elm && elm.isConnected === true ? HTMLElement.prototype.querySelector.call(elm, '.video-stream.html5-main-video') : null;
                    return audio;
                }

                const asyncStateChange = async (audio, k) => {
                    const player_ = player__;
                    if (!player_) return;
                    if (typeof player_.getPlayerState !== 'function') return;

                    const refreshAllStaleEntitiesForNonReadyAudio = async () => {
                        // try {
                        //     if (audio.readyState == 0) await player_.refreshAllStaleEntities();
                        // } catch (e) {
                        // }
                    };
                    const triggerPlaying = async () => {
                        await player_.cancelPlayback();
                        await player_.pauseVideo();
                        await player_.playVideo();
                    };
                    const seekToLiveHeadForLiveStream = async () => {
                        try {
                            await player_.seekToLiveHead();
                            if ((await player_.isAtLiveHead()) === true) {
                                await player_.seekToStreamTime();
                                return true;
                            }
                        } catch (e) {
                            console.log('error_F9', e);
                        }
                    };
                    const fixLiveAudioFn = async () => {
                        if (audio.paused === true) {
                            await player_.clearVideo(); // avoid error in live streaming
                            await player_.clearQueue(); // avoid error in live streaming
                            await delayPn(300);
                            for (let i = 0; i < 3; i++) {
                                if (audio.readyState === 0) {
                                    if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                                }
                            }
                            if (k === -1) {
                                await refreshAllStaleEntitiesForNonReadyAudio();
                            } else if (k === 3) {
                                while (audio.readyState === 0) {
                                    await refreshAllStaleEntitiesForNonReadyAudio();
                                    await triggerPlaying();
                                    await delayPn(300);
                                }
                                // console.log(8809,audio.readyState)
                            }
                        } else if (audio.paused === false) {
                            if (!player_.isAtLiveHead()) {
                                if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                            }
                            while (audio.readyState === 0) {
                                await refreshAllStaleEntitiesForNonReadyAudio();
                                await triggerPlaying();
                                await delayPn(300);
                            }
                            if (!player_.isAtLiveHead()) {
                                if (await seekToLiveHeadForLiveStream()) await delayPn(60);
                            }
                            await refreshAllStaleEntitiesForNonReadyAudio();
                            if (audio.readyState > 0 && audio.paused === true) {
                                await triggerPlaying();
                            }
                        }

                    }
                    try {

                        let ns23 = audio.networkState == 2 || audio.networkState == 3
                        // console.log(127001, k, player_.getPlayerState(), audio.readyState, ns23, audio.muted)

                        if (!ns23 && k === player_.getPlayerState()) {
                            if (k === -1 && audio.readyState === 0) {
                                const et = await mediaNetworkStateReady(audio);
                                if (audio.isConnected === false || player_.getPlayerState() === 5) return;
                                ns23 = audio.networkState == 2 || audio.networkState == 3;
                                console.log(523, ns23, et, player_.getPlayerState());
                                if (player_.getPlayerState() !== -1) return;
                            } else {
                                console.log(527, k, audio.readyState, audio.networkState)
                            }
                        }

                        if (removeBottomOverlayForMobile) await removeBottomOverlayForMobile(300);

                        if (k === 3 && player_.getPlayerState() === 3 && audio.readyState > 0 && ns23 && audio.muted === true) {
                            tc = true;
                        }
                        if (k === -1 && player_.getPlayerState() === -1 && audio.readyState === 0 && ns23) {
                            await delayPn(200);
                            if (k === -1 && player_.getPlayerState() === -1 && audio.readyState === 0 && ns23) {
                                // console.log(8806)
                                await fixLiveAudioFn();
                            }
                        } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState === 1 && ns23 && audio.muted === false) {
                            await seekToLiveHeadForLiveStream();
                        } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23) {
                            await delayPn(60);
                            if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.paused === false) {
                                // console.log(8807)
                                await fixLiveAudioFn();
                            }

                        }

                    } catch (e) {
                        console.log('error_F10', e)
                    }

                };
                const _onPlayerStateChange = (e) => {
                    if (e && (e || 0).target) {
                        player__ = e.target
                    }
                    const player_ = player__;
                    try {
                        if (!player_) return;
                        let k = null;
                        if (e && e.detail && e.detail.state) {
                            k = e.detail.state
                        }
                        if (typeof player_.getPlayerState === 'function' && typeof k === 'number' && k === player_.getPlayerState()) {
                            const audio = getAudioElement();
                            if (audio) asyncStateChange(audio, k);
                        }
                    } catch (e) {
                        console.log('error_F11', e)
                    }
                };

                let idleAudioActivatePending = false;

                const _onVideoProgress = (e) => {
                    if (e && (e || 0).target) {
                        player__ = e.target
                    }
                    const player_ = player__;
                    if (!player_) return;
                    updateLastActiveTimeAsync(player_);
                    if (tc) {
                        tc = false;
                        if (!idleAudioActivatePending) {
                            idleAudioActivatePending = true;
                        }
                    }
                };

                mgg = function () {
                    const player_ = player0;
                    if (player_) {
                        const state0 = player_.getPlayerState();
                        if (typeof state0 === 'number') {
                            _onPlayerStateChange({ type: 'player-state-change', target: player_, detail: { state: state0 } });
                        }
                    }
                }

                document.addEventListener('player-state-change', _onPlayerStateChange, true);

                document.addEventListener('video-progress', _onVideoProgress, true);

            })();

            //       document.addEventListener('DOMContentLoaded', (evt) => {
            //         const mo = new MutationObserver((mutations)=>{
            //           console.log(5899, mutations)
            //         });
            //         mo.observe(document, {subtree: true, childList: true})
            //       })

            //       window.addEventListener('onReady', (evt) => {
            //         console.log(6811)
            //       }, true);

            //       window.addEventListener('localmediachange', (evt) => {
            //         console.log(6812)
            //       }, true);

            //       window.addEventListener('onVideoDataChange', (evt) => {
            //         console.log(6813)
            //       }, true);

            window.addEventListener('state-navigateend', async (evt) => {


                const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
                ytConfigFix(config_);

                try {
                    if (clickLockFn && clickTarget) {

                        let a = HTMLElement.prototype.querySelector.call(clickTarget, '.video-stream.html5-main-video');
                        if (!a) return;

                        if (a.muted === true && a.__spfgs__ !== true && a.paused === true && a.networkState === 0 && a.readyState === 0) {

                            const pr = new Promise(resolve => {

                                document.addEventListener('player-state-change', resolve, { once: true, passive: true, capture: false });

                            }).then();

                            clickLockFn.call(clickTarget, mockEvent({ type: 'click', target: clickTarget, detail: 1 }));
                            await delayPn(1);

                            if (a.muted === false && a.__spfgs__ !== true && a.paused === true && a.networkState === 0 && a.readyState === 0) {
                                clickLockFn.call(clickTarget, mockEvent({ type: 'click', target: clickTarget, detail: 1 }));
                                await delayPn(1);
                            }

                            delayRun(pr);

                        }

                    }

                } catch (e) { console.log('error_F12', e) }


            }, false);



            // document.addEventListener('volumechange', (evt) => {
            //   console.log('volumechange')
            // }, true)
            // document.addEventListener('play', (evt) => {
            //   console.log('play')
            // }, true)


            // document.addEventListener('player-initialized', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // document.addEventListener('renderer-module-load-start', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // document.addEventListener('video-data-change', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // document.addEventListener('player-state-change', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // document.addEventListener('updateui', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // document.addEventListener('renderer-module-load-end', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('player-autonav-pause', (evt) => {
            //   console.log(evt.type)
            // }, true)



            // document.addEventListener('player-ad-state-change', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('player-detailed-error', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('player-error', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('on-play-autonav-video', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('on-play-previous-autonav-video', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('player-fullscreen-change', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('player-fullscreen-toggled', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('player-dom-paused', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // document.addEventListener('yt-show-toast', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // document.addEventListener('yt-innertube-command', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // document.addEventListener('yt-update-c3-companion', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // document.addEventListener('video-progress', (evt) => {
            //   // console.log(evt.type)
            // }, true)
            // document.addEventListener('localmediachange', (evt) => {
            //   console.log(evt.type)
            // }, true)



            // window.addEventListener('player-initialized', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // window.addEventListener('renderer-module-load-start', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // window.addEventListener('video-data-change', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // window.addEventListener('player-state-change', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // window.addEventListener('updateui', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // window.addEventListener('renderer-module-load-end', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('player-autonav-pause', (evt) => {
            //   console.log(evt.type)
            // }, true)



            // window.addEventListener('player-ad-state-change', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('player-detailed-error', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('player-error', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('on-play-autonav-video', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('on-play-previous-autonav-video', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('player-fullscreen-change', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('player-fullscreen-toggled', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('player-dom-paused', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // window.addEventListener('yt-show-toast', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // window.addEventListener('yt-innertube-command', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // window.addEventListener('yt-update-c3-companion', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // window.addEventListener('video-progress', (evt) => {
            //   // console.log(evt.type)
            // }, true)
            // window.addEventListener('localmediachange', (evt) => {
            //   console.log(evt.type)
            // }, true)



            // document.addEventListener('player-error', (evt) => {
            //   console.log(3001, evt.type, evt)
            // }, true)
            // document.addEventListener('player-detailed-error', (evt) => {
            //   console.log(3002, evt.type, evt)
            // }, true)



            async function delayRun(pr) {

                let q = document.querySelector('#movie_player');
                if (!q) return;
                let a = document.querySelector('.video-stream.html5-main-video');
                if (!a) return;

                await pr.then();

                if (fa !== 1) {
                    return;
                } else if (a.muted === true) {
                    return;
                } else if (a.muted === false && a.readyState === 0 && a.networkState === 2) {
                    if (a.paused === false) return;
                } else {
                    return;
                }

                if (document.querySelector('.player-controls-content')) return;

                if (a.paused === true && a.muted === false && a.readyState === 0 && a.networkState === 2) {

                    clickLockFn.call(clickTarget, mockEvent({ type: 'click', target: clickTarget, detail: 1 }));

                }

                if (a.paused === true && a.muted === false && a.networkState === 2 && a.readyState === 0) {

                    if (typeof clickTarget.seekToLiveHead === 'function') await clickTarget.seekToLiveHead();
                    if (typeof clickTarget.isAtLiveHead === 'function' && (await clickTarget.isAtLiveHead()) === true) {
                        if (typeof clickTarget.seekToStreamTime === 'function') await clickTarget.seekToStreamTime();
                    }
                }

            }

            durationchangeForMobile = true;

        }

        attachOneTimeEvent('yt-action', function () {
            const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
            ytConfigFix(config_);
        });

        let prepared = false;
        function prepare() {
            if (prepared) return;
            prepared = true;

            if (typeof _yt_player !== 'undefined' && _yt_player && typeof _yt_player === 'object') {

                for (const [k, v] of Object.entries(_yt_player)) {

                    const p = typeof v === 'function' ? v.prototype : 0;

                    if (p
                        && typeof p.clone === 'function'
                        && typeof p.get === 'function' && typeof p.set === 'function'
                        && typeof p.isEmpty === 'undefined' && typeof p.forEach === 'undefined'
                        && typeof p.clear === 'undefined'
                    ) {

                        key = k;

                    }

                }

            }

            if (key) {

                const ClassX = _yt_player[key];
                _yt_player[key] = class extends ClassX {
                    constructor(...args) {

                        if (typeof args[0] === 'string' && args[0].startsWith('http://')) args[0] = '';
                        super(...args);

                    }
                }
                _yt_player[key].luX1Y = 1;
                prototypeInherit(_yt_player[key].prototype, ClassX.prototype);
            }

        }
        let s3 = Symbol();

        generalRegister('deviceIsAudioOnly', s3, (p) => {
            return typeof p.getPlayerType === 'function' && typeof p.getVideoEmbedCode === 'function' && typeof p.getVideoUrl === 'function' && !p.onCueRangeEnter && !p.getVideoData && !('ATTRIBUTE_NODE' in p)
        }, {

            get() {
                return this[s3];
            },
            set(nv) {
                if (typeof nv === 'boolean') this[s3] = true;
                else this[s3] = undefined;
                prepare();
                return true;
            },
            enumerable: false,
            configurable: true

        });


        let s1 = Symbol();
        let s2 = Symbol();
        Object.defineProperty(Object.prototype, 'defraggedFromSubfragments', {
            get() {
                // console.log(501, this.constructor.prototype)
                return undefined;
            },
            set(nv) {
                return true;
            },
            enumerable: false,
            configurable: true
        });

        Object.defineProperty(Object.prototype, 'hasSubfragmentedFmp4', {
            get() {
                // console.log(502, this.constructor.prototype)
                return this[s1];
            },
            set(nv) {
                if (typeof nv === 'boolean') this[s1] = false;
                else this[s1] = undefined;
                return true;
            },
            enumerable: false,
            configurable: true
        });

        Object.defineProperty(Object.prototype, 'hasSubfragmentedWebm', {
            get() {
                // console.log(503, this.constructor.prototype)
                return this[s2];
            },
            set(nv) {
                if (typeof nv === 'boolean') this[s2] = false;
                else this[s2] = undefined;
                return true;
            },
            enumerable: false,
            configurable: true
        });


        const supportedFormatsConfig = () => {

            function typeTest(type) {
                if (typeof type === 'string' && type.startsWith('video/')) {
                    return false;
                }
            }

            // return a custom MIME type checker that can defer to the original function
            function makeModifiedTypeChecker(origChecker) {
                // Check if a video type is allowed
                return function (type) {
                    let res = undefined;
                    if (type === undefined) res = false;
                    else {
                        res = typeTest.call(this, type);
                    }
                    if (res === undefined) res = origChecker.apply(this, arguments);
                    return res;
                };
            }

            // Override video element canPlayType() function
            const proto = (HTMLVideoElement || 0).prototype;
            if (proto && typeof proto.canPlayType == 'function') {
                proto.canPlayType = makeModifiedTypeChecker(proto.canPlayType);
            }

            // Override media source extension isTypeSupported() function
            const mse = window.MediaSource;
            // Check for MSE support before use
            if (mse && typeof mse.isTypeSupported == 'function') {
                mse.isTypeSupported = makeModifiedTypeChecker(mse.isTypeSupported);
            }

        };

        supportedFormatsConfig();


        PATCH_MEDIA_PUBLISH && (async ()=>{


            const _yt_player_observable = observablePromise(() => {
                return (((window || 0)._yt_player || 0) || 0);
            });
  

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


            };
            
            /*

                const getD0 = (_yt_player) => {

                    const w = 'D0';

                    let arr = [];

                    for (const [k, v] of Object.entries(_yt_player)) {

                    const p = typeof v === 'function' ? v.prototype : 0;
                    if (p
                        && typeof p.playVideo === 'function' && p.playVideo.length === 1
                        && typeof p.getVisibilityState === 'function' && p.getVisibilityState.length === 8
                        && typeof p.getVideoData === 'function' && p.getVideoData.length === 0
                        && typeof p.seekTo === 'function' && p.seekTo.length === 5
                        && typeof p.pauseVideo === 'function' && p.pauseVideo.length === 2
                        && typeof p.stopVideo === 'function' && p.stopVideo.length === 1
                        && typeof p.getPresentingPlayerType === 'function' && p.getPresentingPlayerType.length === 1
                        && typeof p.getCurrentTime === 'function' && p.getCurrentTime.length === 3
                        && typeof p.cancelPlayback === 'function' && p.cancelPlayback.length === 2
                        // && !p.getPlayerType

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
            */

            const gets0 = (_yt_player) => {

                const w = 's0';

                let arr = [];

                for (const [k, v] of Object.entries(_yt_player)) {

                const p = typeof v === 'function' ? v.prototype : 0;
                if (p
                    && typeof p.isBackground === 'function' && p.isBackground.length === 0
                    && typeof p.getPlaybackRate === 'function' && p.getPlaybackRate.length === 0
                    && typeof p.publish === 'function' && p.publish.length === 2
                    && typeof p.isAtLiveHead === 'function' && p.isAtLiveHead.length === 2



                    // && !p.getPlayerType

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

            };

            const printObject = (b)=>{
                return JSON.stringify( Object.entries(b||{}).filter(e=>typeof (e[1]||0)!=='object'));
            };

            /*
                (async () => {
                    // rAf scheduling
            
                    const _yt_player = await _yt_player_observable.obtain();
            
                    if (!_yt_player || typeof _yt_player !== 'object') return;
            
                    let keyD0 = getD0(_yt_player);
            
            
                    if (!keyD0) return;
            
            
                    const g = _yt_player
                    let k = keyD0
            
                    const gk = g[k];
                    if (typeof gk !== 'function') return;
                    const gkp = gk.prototype;


                    gkp.playVideo48 = gkp.playVideo;
                    gkp.playVideo = function(a) {
                        let r =  this.playVideo48(a);
                        // console.log('gkpD0 playVideo',r, a)
                        return r;
                    }

                    gkp.getVisibilityState48 = gkp.getVisibilityState;
                    gkp.getVisibilityState = function(a, b, c, d, e, f, h, l) {
                        let r =  this.getVisibilityState48(a, b, c, d, e, f, h, l);
                        // console.log('gkpD0 getVisibilityState',r, a,b,c,d,e,f,h,l)
                        r = 0;
                        return r;
                    }


                    gkp.getVideoData48 = gkp.getVideoData;
                    gkp.getVideoData = function() {
                        let r =  this.getVideoData48();
                        // console.log('gkpD0 getVideoData',r)
                        return r;
                    }

                    gkp.seekTo48 = gkp.seekTo;
                    gkp.seekTo = function(a, b, c, d, e) {
                        let r =  this.seekTo48(a, b, c, d, e);
                        // console.log('gkpD0 seekTo',r, a,b,c,d,e)
                        return r;
                    }

                    
                    gkp.pauseVideo48 = gkp.pauseVideo;
                    gkp.pauseVideo = function(a, b) {
                        let r =  this.pauseVideo48(a, b);
                        // console.log('gkpD0 pauseVideo',r, a,b);
                        return r;
                    }


                    gkp.stopVideo48 = gkp.stopVideo;
                    gkp.stopVideo = function(a) {
                        let r =  this.stopVideo48(a);
                        // console.log('gkpD0 stopVideo',r,a)
                        return r;
                    }




                    gkp.getPresentingPlayerType48 = gkp.getPresentingPlayerType;
                    gkp.getPresentingPlayerType = function(a) {
                        let r =  this.getPresentingPlayerType48(a);
                        // console.log('gkpD0 getPresentingPlayerType',r,a)
                        return r;
                    }

                    gkp.getCurrentTime48 = gkp.getCurrentTime;
                    gkp.getCurrentTime = function(a, b, c) {
                        let r =  this.getCurrentTime48(a, b, c);
                        // console.log('gkpD0 getCurrentTime',r, a,b,c)
                        return r;
                    }

                    
                    gkp.cancelPlayback48 = gkp.cancelPlayback;
                    gkp.cancelPlayback = function(a, b) {
                        let r =  this.cancelPlayback48(a, b);
                        // console.log('gkpD0 cancelPlayback',r, a,b);
                        return r;
                    }
            
                })();
            */



            /**
             * 
             * 

                g.k.mL = function(a) {
                    var b = a.target.Gf();
                    if (this.mediaElement && this.mediaElement.Gf() && this.mediaElement.Gf() === b) {
                        ehb(this, a.type);
                        switch (a.type) {
                        case "error":
                            var c = yFa(this.mediaElement) || ""
                            , d = this.mediaElement.xf();
                            if (c === "capability.changed") {
                                this.L("html5_restart_on_capability_change") ? (this.ma("capchg", {
                                    msg: d
                                }),
                                F_(this, !0)) : u0(this);
                                return
                            }
                            if (this.mediaElement.hasError() && (Ndb(this.al, c, {
                                msg: d
                            }) || g.zS(this.videoData) && this.wb && this.wb.handleError(c)))
                                return;
                            if (this.isBackground() && this.mediaElement.fh() === 4) {
                                this.So();
                                x0(this, "unplayable");
                                return
                            }
                            break;
                        case "durationchange":
                            c = this.mediaElement.getDuration();
                            isFinite(c) && (!this.Qa || c > 0) && c !== 1 && this.Hl(c);
                            break;
                        case "ratechange":
                            this.ya && this.ya.setPlaybackRate(this.mediaElement.getPlaybackRate());
                            xfb(this.Ch);
                            this.wc().onPlaybackRateChange(this.getPlaybackRate());
                            break;
                        case "loadedmetadata":
                            ghb(this);
                            this.publish("onLoadedMetadata");
                            W5a(this);
                            c = this.bf();
                            this.videoData.SB && (this.videoData.SB = c);
                            break;
                        case "loadstart":
                            W5a(this);
                            break;
                        case "progress":
                        case "suspend":
                            this.Uc();
                            this.publish("onLoadProgress", this, this.Sw());
                            break;
                        case "playing":
                            this.Rb.uv("plev");
                            this.bT && !k0(this) && (this.bT = !1,
                            this.isAtLiveHead() || (this.logger.debug("seek to infinity on PLAYING"),
                            this.seekTo(Infinity, {
                                kd: "videoplayer_onPlaying"
                            })));
                            break;
                        case "timeupdate":
                            c = this.mediaElement && !this.mediaElement.getCurrentTime();
                            d = this.mediaElement && this.mediaElement.Tk() === 0;
                            if (c && (!this.VK || d))
                                return;
                            this.VK = this.VK || !!this.mediaElement.getCurrentTime();
                            Vgb(this);
                            this.Uc();
                            if (!this.mediaElement || this.mediaElement.Gf() !== b)
                                return;
                            this.publish("onVideoProgress", this, this.getCurrentTime());
                            break;
                        case "waiting":
                            if (this.mediaElement.Vw().length > 0 && this.mediaElement.Eh().length === 0 && this.mediaElement.getCurrentTime() > 0 && this.mediaElement.getCurrentTime() < 5 && this.ya)
                                return;
                            this.L("html5_ignore_unexpected_waiting_cfl") && (this.mediaElement.isPaused() || this.mediaElement.Tk() > 2 || !this.mediaElement.isSeeking() && aK(this.mediaElement.Eh(), this.mediaElement.getCurrentTime())) && (c = this.mediaElement.uc(),
                            c.bh = sK(this.mediaElement).toFixed(3),
                            this.ma("uwe", c));
                            g.zS(this.videoData) && this.wb && n7a(this.wb, this.mediaElement.getCurrentTime());
                            break;
                        case "resize":
                            ghb(this);
                            this.videoData.B && this.videoData.B.video.quality === "auto" && this.publish("internalvideoformatchange", this.videoData, !1);
                            break;
                        case "pause":
                            if (this.TW && g.pF(this.playerState, 8) && !g.pF(this.playerState, 1024) && this.getCurrentTime() === 0 && g.VB) {
                                x0(this, "safari_autoplay_disabled");
                                return
                            }
                        }
                        if (this.mediaElement && this.mediaElement.Gf() === b) {
                            dgb(this.Tc, a, this.wb || void 0);
                            this.publish("videoelementevent", a);
                            b = this.playerState;
                            d = this.bE;
                            var e = this.mediaElement;
                            c = this.videoData.clientPlaybackNonce;
                            var f = g.zS(this.videoData) && this.wb ? jY(this.wb) : void 0;
                            if (!g.pF(b, 128)) {
                                var h = b.state;
                                e = e ? e : a.target;
                                var l = e.getCurrentTime();
                                if (!g.pF(b, 64) || a.type !== "ended" && a.type !== "pause") {
                                    f = f || e.getDuration();
                                    f = e.isEnded() || l > 1 && Math.abs(l - f) < 1.1;
                                    var m = a.type === "pause" && e.isEnded();
                                    l = a.type === "ended" || a.type === "waiting" || a.type === "timeupdate" && !g.pF(b, 4) && !a0(d, l);
                                    if (m || f && l)
                                        e.KJ() > 0 && e.Gf() && (h = 14);
                                    else
                                        switch (a.type) {
                                        case "error":
                                            yFa(e) && (h |= 128);
                                            break;
                                        case "pause":
                                            g.pF(b, 256) ? (h ^= 256) || (h = 64) : g.pF(b, 32) || g.pF(b, 2) || g.pF(b, 4) || (h = 4,
                                            g.pF(b, 1) && g.pF(b, 8) && (h |= 1));
                                            break;
                                        case "playing":
                                            l = h;
                                            h = (h | 8) & -1093;
                                            l & 4 ? (h |= 1,
                                            uK(d, e)) : a0(d, e.getCurrentTime()) && (h &= -2);
                                            g.pF(b, 1) && uK(d, e) && (h |= 1);
                                            break;
                                        case "seeking":
                                            h |= 16;
                                            g.pF(b, 8) && (h |= 1);
                                            h &= -3;
                                            break;
                                        case "seeked":
                                            h &= -17;
                                            uK(d, e);
                                            break;
                                        case "waiting":
                                            g.pF(b, 2) || (h |= 1);
                                            uK(d, e);
                                            break;
                                        case "timeupdate":
                                            l = g.pF(b, 16),
                                            f = g.pF(b, 4),
                                            (g.pF(b, 8) || l) && !f && a0(d, e.getCurrentTime()) && (h = 8),
                                            uK(d, e) && (h |= 1)
                                        }
                                }
                                d = h;
                                h = null;
                                d & 128 && (h = a.target,
                                e = yFa(h),
                                l = 1,
                                e ? (e === "capability.changed" && (l = 2),
                                f = "GENERIC_WITHOUT_LINK",
                                m = h.uc(),
                                m.mediaElem = "1",
                                /AUDIO_RENDERER/.test(h.xf()) && (f = "HTML5_AUDIO_RENDERER_ERROR"),
                                h = {
                                    errorCode: e,
                                    errorMessage: g.JV[f] || "",
                                    bP: f,
                                    KL: yJ(m),
                                    rJ: l,
                                    cpn: b.Pg ? b.Pg.cpn : ""
                                }) : h = null,
                                h && (h.cpn = c));
                                b = vK(b, d, h)
                            }
                            !g.pF(this.playerState, 1) && g.pF(b, 1) && dhb(this, "evt" + a.type);
                            this.Ic(b)
                        }
                    }
                }
                ;
             * 
             * 
             */




            (async () => {
                // rAf scheduling
          
                const _yt_player = await _yt_player_observable.obtain();
          
                if (!_yt_player || typeof _yt_player !== 'object') return;
          
                let keys0 = gets0(_yt_player);
          
          
                if (!keys0) return;
          
          
                const g = _yt_player
                let k = keys0
          
                const gk = g[k];
                if (typeof gk !== 'function') return;
                const gkp = gk.prototype;


                // gkp.isBackground48 = gkp.isBackground;
                // gkp.isBackground = function() {
                //     if(!this?.visibility?.isBackground88){
                //         this.visibility.isBackground88 = 1;
                //         this.visibility.isBackground = function(){
                //             return false;
                //         }
                //     }
                //     // console.log('gkps0', 'isBackground', this.visibility)
                //     // return false;
                //     // if(!this.mediaElement || !(this.mediaElement.readyState>=4)){
                //     //     return false;
                //     // }
                //     // console.log(1882,)
                //     return this.isBackground48();
                // }

                gkp.publish48 = gkp.publish;
                gkp.publish33 = async function(a,b){

                    const player_ = kRef(globalPlayer);
                    let publishStatus = 0;
                    const media = this.mediaElement;

                    if(a==='internalaudioformatchange' && typeof (b.author||0) === 'string' && media){

                        await player_.clearVideo(); // avoid error in live streaming
                        await player_.clearQueue(); // avoid error in live streaming
                        await refreshAllStaleEntitiesForNonReadyAudio();
                        // await player_.cancelPlayback();
                        publishStatus = media.__publishStatus17__ = 100;
                    }





                    const domMedia = media ? Object.values(media).filter(e => e instanceof HTMLMediaElement) : [];
                    if (this.mediaElement && a !== 'internalvideoformatchange' && player_ && domMedia.length === 1) {

                        const audio = domMedia[0];



                        const refreshAllStaleEntitiesForNonReadyAudio = async () => {
                            try {
                                if (audio.readyState == 0 && audio.isConnected === true) await player_.refreshAllStaleEntities();
                            } catch (e) {
                            }
                        };
                        // const triggerPlaying = async () => {
                        //     await player_.cancelPlayback();
                        //     this.pauseVideo();
                        //     this.playVideo();
                        //     await player_.pauseVideo();
                        //     await player_.playVideo();
                        // };
                        const seekToLiveHeadForLiveStream = async () => {
                            try {
                                audio.isConnected === true && await player_.seekToLiveHead();
                                if (audio.isConnected === true && (await player_.isAtLiveHead()) === true) {
                                    audio.isConnected === true && await player_.seekToStreamTime();
                                    return true;
                                }
                            } catch (e) {
                                console.log('error_F7', e);
                            }
                        };


                        if(a.includes('error') ){
 
                            if(!media.__publishStatus17__ || media.__publishStatus17__ < 200){

                                await player_.clearVideo(); // avoid error in live streaming
                                await player_.clearQueue(); // avoid error in live streaming
                                await refreshAllStaleEntitiesForNonReadyAudio();
                                // await player_.cancelPlayback();

                            }
    
     
    
    
                        }else{



                            media.__publishStatus17__ = media.__publishStatus17__ || 100;



                            if (media.__publishStatus17__ === 100) await refreshAllStaleEntitiesForNonReadyAudio();
                            if (media.__publishStatus17__ === 100 && audio.duration > 0 && player_.getPlayerState() === 3) {
    
    
    
                                media.__publishStatus17__ = 200
                                // await refreshAllStaleEntitiesForNonReadyAudio();
    
                                await player_.cancelPlayback();
                                await this.pauseVideo();
                                // this.playVideo();
                                // await player_.pauseVideo();
                                await player_.playVideo();
                                await seekToLiveHeadForLiveStream();
    
    
                                // fixLiveAudioFn(domMedia0, player_, player_.getPlayerState())
    
    
                                // skipPause = true;
                                // skipVisibility = true;
                                //  player_.cancelPlayback();
                                //  player_.pauseVideo();
                                //  player_.playVideo();
                                //  skipPause = false;
                                //  skipVisibility = false;
    
    
                            } 
    
    
    
                            if (a === 'onLoadedMetadata' && media.__publishStatus17__ === 200) media.__publishStatus17__ = 201;
                            if (a === 'videoelementevent' && b.type === 'loadedmetadata' && media.__publishStatus17__ === 201) media.__publishStatus17__ = 202;
                            if (a === 'videoelementevent' && b.type === 'progress' && media.__publishStatus17__ === 202) {
    
                                media.__publishStatus17__ = 203;
                                window.debug_mfk = this;
                                window.debug_mfp = player_;
    
                                // (async ()=>{
                                //     await timelineResolve();
                                //     const domMedia = Object.values(this.mediaElement).filter(e=>e instanceof HTMLMediaElement);
                                //     if(domMedia.length === 1){
                                //         const domMedia0 = domMedia[0]
    
                                //         if(domMedia0.duration >0 && domMedia0.readyState >= 4){
    
                                //             await timelineResolve();
                                //             console.log(939, domMedia0, domMedia0.paused, domMedia0.duration, domMedia0.readyState)
                                //             this.pauseVideo();
                                //             await timelineResolve();
                                //             this.playVideo();
    
                                //         }
                                //         // this.mediaElement.pause();
                                //         // this.mediaElement.play();
                                //     }
    
                                // })();
                            }
                            if (media.__publishStatus17__ === 203 && audio && audio.readyState === 1) {
    
    
                                media.__publishStatus17__ = 204;
                            
                                // await timelineResolve();
                                // await player_.cancelPlayback();
                                await this.pauseVideo();
                                // this.playVideo();
                                // await timelineResolve();
                                // await player_.pauseVideo();
                                await player_.playVideo();
                                // await timelineResolve();
                                await seekToLiveHeadForLiveStream();
    
    
    
                            }
    
    
                            if (media.__publishStatus17__ < 300 && media.__publishStatus17__ >= 200 && a === 'videoelementevent' && b.type==='timeupdate' && !audio.paused && audio.readyState >= 4 && audio.duration > 0) {
                                media.__publishStatus17__ = 300;
                                if(!player_.isAtLiveHead()) await seekToLiveHeadForLiveStream();
                            }
    

                        }


                        publishStatus = media.__publishStatus17__;

                        if (debugFlg001) console.log('gkps0 publish | ' + publishStatus, a, printObject(b))

                    }
                }
                gkp.publish = function(a,b){

                    this.publish33(a,b);
                    
                    return this.publish48.apply(this, arguments);
                }

                // console.log(23488)

            })();

        })();


    }

    const getVideoIdByURL = () => {
        // It's almost certainly going to stay at 11 characters. The individual characters come from a set of 64 possibilities (A-Za-z0-9_-).
        // base64 form; 26+26+10+2; 64^len
        // Math.pow(64,11) = 73786976294838210000

        const url = new URL(location.href);
        let m;

        if (m = /^\/watch\?v=([A-Za-z0-9_-]+)/.exec(url.pathname + url.search)) return `${m[1]}`;
        if (m = /^\/live\/([A-Za-z0-9_-]+)/.exec(url.pathname)) return `${m[1]}`;

        if (m = /^\/embed\/live_stream\?channel=([A-Za-z0-9_-]+)/.exec(url.pathname + url.search)) return `L:${m[1]}`;
        if (m = /^\/embed\/([A-Za-z0-9_-]+)/.exec(url.pathname)) return `${m[1]}`;

        if (m = /^\/channel\/([A-Za-z0-9_-]+)\/live\b/.exec(url.pathname)) return `L:${m[1]}`;
        if (url.hostname === 'youtu.be' && (m = /\/([A-Za-z0-9_-]+)/.exec(url.pathname))) return `${m[1]}`;

        return '';

    };

    const getVideoIdByElement = ()=>{
        const videoIdElements = [...document.querySelectorAll('[video-id]')].filter(v => !v.closest('[hidden]'));
        const videoId = videoIdElements.length > 0 ? videoIdElements[0].getAttribute('video-id') : null;
        return videoId || '';
    };

    const getEnableValue = async ()=>{
        const videoId = getVideoIdByURL() || getVideoIdByElement();
        const siteVal = videoId ? await GM.getValue(`isEnable_aWsjF_${videoId}`, null) : null;
        return (siteVal !== null) ? siteVal : await GM.getValue("isEnable_aWsjF", true);
    };

    const setEnableVal = async (val)=>{
        const videoId = getVideoIdByURL() || getVideoIdByElement();
        if (videoId) {
            try {
                const cv = await GM.getValue(`isEnable_aWsjF_${videoId}`, null);
                if (typeof cv === typeof val) await GM.setValue(`isEnable_aWsjF_${videoId}`, val);
            } catch (e) { }
        }
        await GM.setValue("isEnable_aWsjF", val);
    }

    const isEnable = (typeof GM !== 'undefined' && typeof GM.getValue === 'function') ? await getEnableValue() : null;
    if (typeof isEnable !== 'boolean') throw new DOMException("Please Update your browser", "NotSupportedError");
    if (isEnable) {
        const element = document.createElement('button');
        element.setAttribute('onclick', createHTML(`(${pageInjectionCode})()`));
        element.click();
    }

    GM_registerMenuCommand(`Turn ${isEnable ? 'OFF' : 'ON'} YouTube Audio Mode`, async function () {
        await setEnableVal(!isEnable);
        await GM.setValue('lastCheck_bWsm5', Date.now());
        document.documentElement.setAttribute('forceRefresh032', '');
        location.reload();
    });

    let messageCount = 0;
    let busy = false;
    window.addEventListener('message', (evt) => {

        const v = ((evt || 0).data || 0).ZECxh;
        if (typeof v === 'boolean') {
            if (messageCount > 1e9) messageCount = 9;
            const t = ++messageCount;
            if (v && isEnable) {
                requestAnimationFrame(async () => {
                    if (t !== messageCount) return;
                    if (busy) return;
                    busy = true;
                    if (await confirm("Livestream is detected. Press OK to disable YouTube Audio Mode.")) {
                        await setEnableVal(!isEnable);
                        await GM.setValue('lastCheck_bWsm5', Date.now());
                        document.documentElement.setAttribute('forceRefresh032', '');
                        location.reload();
                    }
                    busy = false;
                });
            }
        }

    });


    const pLoad = new Promise(resolve => {
        if (document.readyState !== 'loading') {
            resolve();
        } else {
            window.addEventListener("DOMContentLoaded", resolve, false);
        }
    });


    function contextmenuInfoItemAppearedFn(target) {

        const btn = target.closest('.ytp-menuitem[role="menuitem"]');
        if (!btn) return;
        if (btn.parentNode.querySelector('.ytp-menuitem[role="menuitem"].audio-only-toggle-btn')) return;
        document.documentElement.classList.add('with-audio-only-toggle-btn');
        const newBtn = btn.cloneNode(true)
        newBtn.querySelector('.ytp-menuitem-label').textContent = `Turn ${isEnable ? 'OFF' : 'ON'} YouTube Audio Mode`;
        newBtn.classList.add('audio-only-toggle-btn');
        btn.parentNode.insertBefore(newBtn, btn.nextSibling);
        newBtn.addEventListener('click', async (evt) => {
            try {
                evt.stopPropagation();
                evt.stopImmediatePropagation();
            } catch (e) { }
            await setEnableVal(!isEnable);
            await GM.setValue('lastCheck_bWsm5', Date.now());
            document.documentElement.setAttribute('forceRefresh032', '');
            location.reload();
        });
        let t;
        let h = 0;
        t = btn.closest('.ytp-panel-menu[style*="height"]');
        if (t) t.style.height = t.scrollHeight + 'px';
        t = btn.closest('.ytp-panel[style*="height"]');
        if (t) t.style.height = (h = t.scrollHeight) + 'px';
        t = btn.closest('.ytp-popup.ytp-contextmenu[style*="height"]');
        if (t && h > 0) t.style.height = h + 'px';
    }


    function mobileMenuItemAppearedFn(target) {

        const btn = target.closest('ytm-menu-item');
        if (!btn) return;
        if (btn.parentNode.querySelector('ytm-menu-item.audio-only-toggle-btn')) return;
        document.documentElement.classList.add('with-audio-only-toggle-btn');
        const newBtn = btn.cloneNode(true);
        newBtn.querySelector('.menu-item-button').textContent = `Turn ${isEnable ? 'OFF' : 'ON'} YouTube Audio Mode`;
        newBtn.classList.add('audio-only-toggle-btn');
        btn.parentNode.insertBefore(newBtn, btn.nextSibling);
        newBtn.addEventListener('click', async (evt) => {
            try {
                evt.stopPropagation();
                evt.stopImmediatePropagation();
            } catch (e) { }
            await setEnableVal(!isEnable);
            await GM.setValue('lastCheck_bWsm5', Date.now());
            document.documentElement.setAttribute('forceRefresh032', '');
            location.reload();
        });
    }

    const lastEntry = (arr) => {
        return arr.length > 0 ? arr[arr.length - 1] : null;
    }

    function mobileMenuItemAppearedV2Fn(target) {

        const btn = target.closest('yt-list-item-view-model');
        if (!(btn instanceof HTMLElement)) return;
        if (btn.parentNode.querySelector('yt-list-item-view-model.audio-only-toggle-btn')) return;
        const parentNode = btn.closest('player-settings-menu');
        if(!parentNode) return;
        let qt = 1E9;
        let targetBtnO = lastEntry([...parentNode.getElementsByTagName(btn.nodeName)].filter(e => e.parentElement === btn.parentElement).map((elm) => {
            const count = elm.getElementsByTagName('*').length;
            if (count < qt) qt = count;
            return {
                elm: elm,
                count: count
            }
        }).filter((o) => o.count === qt));

        const targetBtn = targetBtnO && targetBtnO.elm instanceof HTMLElement ? targetBtnO.elm : btn;


        const newBtn = targetBtn.cloneNode(true);
        if(newBtn instanceof HTMLElement){
            document.documentElement.classList.add('with-audio-only-toggle-btn');

            let newBtnContentElm = newBtn;
            let layerCN = 8;
            while (newBtnContentElm.childElementCount === 1 && layerCN--) {
                newBtnContentElm = newBtnContentElm.firstElementChild;
            }
            if (!(newBtnContentElm instanceof HTMLElement)) newBtnContentElm = newBtn;
            let t;
            if (t = lastEntry(newBtnContentElm.querySelectorAll('span[role="text"]'))) {
                newBtnContentElm = t;
                newBtnContentElm.classList.add('audio-only-toggle-btn-content2');
            } else if (t = lastEntry(newBtnContentElm.querySelectorAll('[role="text"]'))) {
                newBtnContentElm = t;
                newBtnContentElm.classList.add('audio-only-toggle-btn-content2');
            } else if (t = lastEntry(newBtnContentElm.querySelectorAll('span'))) {
                newBtnContentElm = t;
                newBtnContentElm.classList.add('audio-only-toggle-btn-content2');
            } else if (t = lastEntry(newBtnContentElm.querySelector('.yt-core-attributed-string'))) {
                newBtnContentElm = t;
                newBtnContentElm.classList.add('audio-only-toggle-btn-content2');
            }
            newBtnContentElm.textContent = `Turn ${isEnable ? 'OFF' : 'ON'} YouTube Audio Mode`;
            newBtn.classList.add('audio-only-toggle-btn');
            newBtnContentElm.classList.add('audio-only-toggle-btn-content');
            btn.parentNode.insertBefore(newBtn, btn.nextSibling);
            newBtn.addEventListener('click', async (evt) => {
                try {
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();
                } catch (e) { }
                await setEnableVal(!isEnable);
                await GM.setValue('lastCheck_bWsm5', Date.now());
                document.documentElement.setAttribute('forceRefresh032', '');
                location.reload();
            });
            const contentWrapper = newBtn.closest('#content-wrapper');
            if (contentWrapper) {
                contentWrapper.style.height = 'unset';
                contentWrapper.style.maxHeight = 'unset';
            }
        }
    }

    pLoad.then(() => {

        document.addEventListener('animationstart', (evt) => {
            const animationName = evt.animationName;
            if (!animationName) return;

            if (animationName === 'contextmenuInfoItemAppeared') contextmenuInfoItemAppearedFn(evt.target);
            if (animationName === 'mobileMenuItemAppeared') mobileMenuItemAppearedFn(evt.target);
            if (animationName === 'mobileMenuItemAppearedV2') mobileMenuItemAppearedV2Fn(evt.target);

        }, true);

        const cssForEnabled = isEnable ? `

            .html5-video-player {
                background-color: black;
            }

            [style*="--audio-only-thumbnail-image"]{
                background-image: var(--audio-only-thumbnail-image);
                object-fit: contain;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
            }
            .html5-video-player.ended-mode [style*="--audio-only-thumbnail-image"]{
                background-image: none;
            }

            .html5-video-player.ytp-ce-shown .html5-video-container {
                opacity: 0.5;
                transition: opacity 0.5s;
            }

            ytd-video-preview #media-container div#player-container,
            ytd-video-preview #media-container div#thumbnail-container{
                transition: initial !important;
                transition-duration:0ms !important;
                transition-delay:0ms !important;
            }
            ytd-video-preview #media-container div#thumbnail-container{
                /* pointer-events:none !important; */
                opacity:0;
                /* z-index:-1; */
            }
            ytd-video-preview #media-container div#player-container,
            ytd-video-preview #media-container div#inline-preview-player{
                background-color:transparent !important;
                background-image:none !important;
            }

            #movie_player > .html5-video-container:not(:empty) {
                box-sizing: border-box;
                height: 100%;
            }

            #movie_player [style*="--audio-only-thumbnail-image"] ~ .ytp-cued-thumbnail-overlay > .ytp-cued-thumbnail-overlay-image[style*="background-image"] {
                opacity: 0;
            }

            #movie_player [style*="--audio-only-thumbnail-image"]::before {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                /* background: transparent; */


                /* We use multiple backgrounds: one gradient per side */
                background:
                    /* Left border gradient */
                    linear-gradient(to right, rgba(0,0,0,0.4), transparent) left center,
                    /* Right border gradient */
                    linear-gradient(to left, rgba(0,0,0,0.4), transparent) right center,
                    /* Top border gradient */
                    linear-gradient(to bottom, rgba(0,0,0,0.4), transparent) center top,
                    /* Bottom border gradient */
                    linear-gradient(to top, rgba(0,0,0,0.4), transparent) center bottom;
                    
                /* Prevents repetition of gradients */
                background-repeat: no-repeat;
                
                /* Set the size of each gradient "border" */
                background-size:
                    12% 100%, /* left border width and full height */
                    12% 100%, /* right border width and full height */
                    100% 12%, /* top border full width and small height */
                    100% 12%; /* bottom border full width and small height */
                    
                /* Optional: a base background color inside the element */
                /* background-color: #fff; */
                /* background-color: var(--blinker-fmw83-bgc, transparent); */

                    opacity: var(--fmw83-opacity, 1);

                    pointer-events: none !important;
                    z-index:-1;

            }

            /*
            @keyframes blinker-fmw83 {
                0%, 60%, 100% {
                    opacity: 1;
                }
                30% {
                    opacity: 0.96;
                }
            }
                */
                
         
            #movie_player.playing-mode [style*="--audio-only-thumbnail-image"]{
                /* animation: blinker-fmw83 1.74s linear infinite; */
                --fmw83-opacity: 0.6;
                
            }
            


        `: "";

        const style = document.createElement('style');
        style.id = 'fm9v0';
        style.textContent = `

        ${cssForEnabled}

        @keyframes mobileMenuItemAppeared {
            0% {
                background-position-x: 3px;
           }
            100% {
                background-position-x: 4px;
           }
       }

        @keyframes mobileMenuItemAppearedV2 {
            0% {
                background-position-x: 3px;
           }
            100% {
                background-position-x: 4px;
           }
       }
        ytm-select.player-speed-settings ~ ytm-menu-item:last-of-type {
            animation: mobileMenuItemAppeared 1ms linear 0s 1 normal forwards;
       }

       player-settings-menu > yt-list-item-view-model:last-of-type {
            animation: mobileMenuItemAppearedV2 1ms linear 0s 1 normal forwards;
       }


       player-settings-menu .audio-only-toggle-btn-content {
            padding: 14px 24px;
            box-sizing: border-box;
            font-size: 130%;
       }

       player-settings-menu .audio-only-toggle-btn-content2 {
            padding: 0;
            box-sizing: border-box;
            font-size: inherit;
       }


        @keyframes contextmenuInfoItemAppeared {
            0% {
                background-position-x: 3px;
           }
            100% {
                background-position-x: 4px;
           }
       }
        .ytp-contextmenu .ytp-menuitem[role="menuitem"] path[d^="M22 34h4V22h-4v12zm2-30C12.95"]{
            animation: contextmenuInfoItemAppeared 1ms linear 0s 1 normal forwards;
       }
        #confirmDialog794 {
            z-index:999999 !important;
            display: none;
           /* Hidden by default */
            position: fixed;
           /* Stay in place */
            z-index: 1;
           /* Sit on top */
            left: 0;
            top: 0;
            width: 100%;
           /* Full width */
            height: 100%;
           /* Full height */
            overflow: auto;
           /* Enable scroll if needed */
            background-color: rgba(0,0,0,0.4);
           /* Black w/ opacity */
       }
        #confirmDialog794 .confirm-box {
            position:relative;
            color: black;
            z-index:999999 !important;
            background-color: #fefefe;
            margin: 15% auto;
           /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 30%;
           /* Could be more or less, depending on screen size */
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
       }
        #confirmDialog794 .confirm-buttons {
            text-align: right;
       }
        #confirmDialog794 button {
            margin-left: 10px;
       }

      `
        document.head.appendChild(style);

    });


    const pNavigateFinished = new Promise(resolve => {
        document.addEventListener('yt-navigate-finish', resolve, true);
    });

    pNavigateFinished.then(() => {
        const inputs = document.querySelectorAll('#masthead input[type="text"][name]');

        let lastInputTextValue = null;
        let busy = false;
        let disableMonitoring = false;
        const setGV = async (val)=>{

            const videoId = getVideoIdByURL() || getVideoIdByElement();
            if (videoId) {
                const cgv = await GM.getValue(`isEnable_aWsjF_${videoId}`, null);
                if (cgv !== val || isEnable !== val) {
                    disableMonitoring = true;
                    await GM.setValue(`isEnable_aWsjF_${videoId}`, val);
                    await GM.setValue('lastCheck_bWsm5', Date.now());
                    document.documentElement.setAttribute('forceRefresh032', '');
                    location.reload();
                }

            }
        }
        const checkTextChangeF = async (evt) => {
            busy = false;
            const inputElem = (evt || 0).target;
            if (inputElem instanceof HTMLInputElement && !disableMonitoring) {
                const cv = inputElem.value;
                if (cv === lastInputTextValue) return;
                lastInputTextValue = cv;
                if (cv === 'vvv') {

                    await setGV(false);

                } else if (cv === 'aaa') {

                    await setGV(true);

                }
            }
        }
        const checkTextChange = (evt) => {
            if (busy) return;
            busy = true;
            Promise.resolve(evt).then(checkTextChangeF)
        };
        for (const input of inputs) {
            input.addEventListener('input', checkTextChange, false);
            input.addEventListener('keydown', checkTextChange, false);
            input.addEventListener('keyup', checkTextChange, false);
            input.addEventListener('keypress', checkTextChange, false);
            input.addEventListener('change', checkTextChange, false);
        }
    });

    const autoCleanUpKey = async () => {

        const lastCheck = await GM.getValue('lastCheck_bWsm5', null) || 0;
        if (Date.now() - lastCheck < 16000) return; // 16s
        GM.setValue('lastCheck_bWsm5', Date.now());
        pLoad.then(async () => {
            const rArr = [];
            const arr = await GM.listValues();
            const cv = await GM.getValue("isEnable_aWsjF", null);
            const fn = async (entry) => {
                try {
                    if (typeof entry === 'string' && entry.length > 15 && entry.startsWith('isEnable_aWsjF_')) {
                        const res = await GM.getValue(entry, null);
                        if (typeof res === 'boolean' && res === cv) {
                            await GM.deleteValue(entry);
                            rArr.push(entry);
                        }
                    }
                } catch (e) {
                    console.warn(e);
                }
            }
            arr.length > 1 && (await Promise.all(arr.map(fn)));
            rArr.length > 0 && console.log('[YouTube Audio Only] autoCleanUpKey', rArr);
        });
    };

    autoCleanUpKey();


})();


