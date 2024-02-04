// ==UserScript==
// @name                YouTube: Audio Only
// @description         No Video Streaming
// @namespace           UserScript
// @version             1.6.8
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
            document.body.insertAdjacentHTML('beforeend', dialogHTML);
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

        const SHOW_VIDEO_STATIC_IMAGE = true;

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

        let setTimeout_ = setTimeout;
        let clearTimeout_ = clearTimeout;

        const delayPn = delay => new Promise((fn => setTimeout_(fn, delay)));


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

                const embedConfigFix = async () => {
                    while (true) {
                        const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
                        if (config_) {
                            ytConfigFix(config_);
                            break;
                        }
                        await delayPn(60);
                    }
                };

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
                                console.log('error_F3',e);
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
                            const ns23 = audio.networkState == 2 || audio.networkState == 3;
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

                })


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
                    // console.log(1233, player_)
                    const mediaCollection = document.getElementsByClassName('html5-main-video');

                    const stopAndReloadFn = async () => {
                        let isLive = false;
                        if (location.pathname === '/watch') {
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

                            const ns23 = audio.networkState == 2 || audio.networkState == 3;
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

                let useStopAndReload = location.pathname !== '/watch';
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


            let lastPlayerInfoText = '';
            let mz = 0;
            onVideoChangeForMobile = async () => {


                let html5Container = null;

                const moviePlayer = document.querySelector('#player .html5-video-container .video-stream.html5-main-video');
                if (moviePlayer) {
                    html5Container = moviePlayer.closest('.html5-video-container');
                }
                if (!html5Container) return;
                let thumbnailUrl = '';

                if (mz > 1e9) mz = 9;
                let mt = ++mz;
                const scriptText = await observablePromise(() => {
                    if (mt !== mz) return 1;
                    const t = document.querySelector('player-microformat-renderer.PlayerMicroformatRendererHost script[type="application/ld+json"]');
                    const tt = (t ? t.textContent : '') || '';
                    if (tt === lastPlayerInfoText) return;
                    return tt;
                }).obtain();
                if (typeof scriptText !== 'string') return; // 1
                lastPlayerInfoText = scriptText;

                if (!scriptText) return;


                if (SHOW_VIDEO_STATIC_IMAGE) {

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

                        const ns23 = audio.networkState == 2 || audio.networkState == 3
                        // console.log(127001, k, player_.getPlayerState(), audio.readyState, ns23, audio.muted)


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

                    if (typeof v === 'function' && typeof v.prototype.clone === 'function'
                        && typeof v.prototype.get === 'function' && typeof v.prototype.set === 'function'

                        && typeof v.prototype.isEmpty === 'undefined' && typeof v.prototype.forEach === 'undefined'
                        && typeof v.prototype.clear === 'undefined'

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
    }

    const isEnable = (typeof GM !== 'undefined' && typeof GM.getValue === 'function') ? (await GM.getValue("isEnable_aWsjF", true)) : null;
    if (typeof isEnable !== 'boolean') throw new DOMException("Please Update your browser", "NotSupportedError");
    if (isEnable) {
        const element = document.createElement('button');
        element.setAttribute('onclick', `(${pageInjectionCode})()`);
        element.click();
    }

    GM_registerMenuCommand(`Turn ${isEnable ? 'OFF' : 'ON'} YouTube Audio Mode`, async function () {
        await GM.setValue("isEnable_aWsjF", !isEnable);
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
                        await GM.setValue("isEnable_aWsjF", !isEnable);
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
        newBtn.addEventListener('click', async () => {
            await GM.setValue("isEnable_aWsjF", !isEnable);
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
        newBtn.addEventListener('click', async () => {
            await GM.setValue("isEnable_aWsjF", !isEnable);
            document.documentElement.setAttribute('forceRefresh032', '');
            location.reload();
        });
    }


    pLoad.then(() => {

        document.addEventListener('animationstart', (evt) => {
            const animationName = evt.animationName;
            if (!animationName) return;

            if (animationName === 'contextmenuInfoItemAppeared') contextmenuInfoItemAppearedFn(evt.target);
            if (animationName === 'mobileMenuItemAppeared') mobileMenuItemAppearedFn(evt.target);

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
        ytm-select.player-speed-settings ~ ytm-menu-item:last-of-type {
            animation: mobileMenuItemAppeared 1ms linear 0s 1 normal forwards;
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

        if (false && isEnable) {
            let mzId = 0;

            let mz = 0;
            const mof = async () => {
                mzId && clearInterval(mzId);
                if (mz > 1e9) mz = 9;
                const mt = ++mz;

                let q = document.querySelector('#video-preview > ytd-video-preview.style-scope.ytd-app');
                if(!q) return;
                if (q.hasAttribute('active') && !q.hasAttribute('hidden')) {

                }else{
                    return;
                }


                let inlinePreviewPlayer = null;
                const ss = [HTMLElement.prototype.querySelector.call(q, '#inline-preview-player')].filter(e=>e && !e.closest('[hidden]'));
                if (ss && ss.length === 1) {
                    inlinePreviewPlayer = ss[0];
                }
                if(!inlinePreviewPlayer) return;

                const f = ()=>{
                    if (mz !== mt || !(q.hasAttribute('active') && !q.hasAttribute('hidden')) || !(inlinePreviewPlayer && inlinePreviewPlayer.isConnected === true)) {
                        mzId && clearInterval(mzId);
                        mzId= 0;
                        return;
                    }

                    const s = inlinePreviewPlayer;
                    s.classList.remove('ytp-hide-inline-preview-progress-bar');
                    s.classList.remove('ytp-hide-inline-preview-audio-controls');
                    s.classList.add('ytp-show-inline-preview-progress-bar');
                    s.classList.add('ytp-show-inline-preview-audio-controls');
                    s.classList.remove('ytp-autohide');
                    if (q.hasAttribute('hide-volume-controls')) {
                        q.removeAttribute('hide-volume-controls')
                    }
                    
                    if(s.classList.contains('playing-mode') && !q.hasAttribute('playing')){
                        q.setAttribute('playing','')
                    }
                }
                mzId = setInterval(f, 40);
                f();

            }
            const mo = new MutationObserver(mof);
            document.addEventListener('yt-navigate-finish', async function () {

                for (const s of document.querySelectorAll('ytd-video-preview')) {
                    mo.observe(s, {
                        attributes: true,
                        attributeFilter: ["hidden", "active"],
                        attributeOldValue: false
                    });
                    mof();
                }

            }, false);
            
        }
    })


})();
