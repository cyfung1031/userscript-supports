// ==UserScript==
// @name                YouTube: Audio Only
// @version             2.3.10
// @description         No Video Streaming
// @namespace           UserScript
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
// @grant               GM_addElement
// @run-at              document-start
// @require             https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@5d83d154956057bdde19e24f95b332cb9a78fcda/library/default-trusted-type-policy.js
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


    const defaultPolicy = (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy) || { createHTML: s => s };
    function createHTML(s) {
        return defaultPolicy.createHTML(s);
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
    
    const winAddEventListener = typeof unsafeWindow === "object" ? unsafeWindow.addEventListener.bind(unsafeWindow) : window.addEventListener.bind(window);

    const kEventListener = (evt) => {
        if (document.documentElement.hasAttribute('forceRefresh032')) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
        }
    }
    winAddEventListener('beforeunload', kEventListener, false);

    const pageInjectionCode = function () {

        let debugFlg001 = false;
        // let debugFlg002 = false;
        // let globalPlayer = null;
        const SHOW_VIDEO_STATIC_IMAGE = true;

        if (typeof AbortSignal === 'undefined') throw new DOMException("Please update your browser.", "NotSupportedError");

        const hURL = typeof URL === "function" ? URL : document.documentElement.getRootNode().defaultView.URL;
        const createObjectURL = hURL.createObjectURL.bind(hURL);

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

        const [setTimeout_, clearTimeout_] = [setTimeout, clearTimeout];

        /* globals WeakRef:false */

        /** @type {(o: Object | null) => WeakRef | null} */
        const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null);

        /** @type {(wr: Object | null) => Object | null} */
        const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

        const isIterable = (x) => Symbol.iterator in Object(x);

        let skipPlayPause = 0;
        let dirtyMark = 1 | 2 | 4 | 8;

        const dmo = {};

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


        const attachOneTimeEvent = function (eventType, callback) {
            let kz = false;
            document.addEventListener(eventType, function (evt) {
                if (kz) return;
                kz = true;
                callback(evt);
            }, { capture: true, passive: true, once: true });
        }

        const evaluateInternalAppScore = (internalApp) => {


            let r = 0;
            if (!internalApp || typeof internalApp !== 'object') {
                return -999;
            }

            if (internalApp.app) r -= 100;

            if (!('mediaElement' in internalApp)) r -= 500;

            if (!('videoData' in internalApp)) r -= 50;

            if (!('playerState' in internalApp)) r -= 50;

            if ('getVisibilityState' in internalApp) r += 20;
            if ('visibility' in internalApp) r += 40;
            if ('isBackground' in internalApp) r += 40;
            if ('publish' in internalApp) r += 10;


            if (('playerType' in internalApp)) r += 10;
            if (('playbackRate' in internalApp)) r += 10;
            if (('playerState' in internalApp)) r += 10;
            if (typeof (internalApp.playerState || 0) === 'object') r += 50;


            return r;



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

                    playerKevlar.deviceIsAudioOnly = true;          // ← new

                    const usp = new URLSearchParams("?" + yt.config_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH.serializedExperimentFlags);
                    usp.set("html5_onesie_audio_only_playback", "true");
                    usp.set("allow_vb_audio_formats", "true");
                    usp.set("allow_vb_audio_formats_with_mta", "true");
                    usp.set("ws_use_centralized_hqa_filter", "true");
                    usp.set("web_cinematic_watch_settings", "false");
                    usp.set("web_l3_storyboard", "false")
                    playerKevlar.serializedExperimentFlags = `${usp}`.replace(/^\?+/g,"");

                }

                const EXPERIMENT_FLAGS = (config_ || 0).EXPERIMENT_FLAGS;

                if(EXPERIMENT_FLAGS){
                    EXPERIMENT_FLAGS.kevlar_watch_cinematics = false;
                    EXPERIMENT_FLAGS.mweb_cinematic_watch = false;
                }

                if (config_.PLAYER_CONFIG) {
                    config_.PLAYER_CONFIG.deviceIsAudioOnly = true; // ← new
                }

            }
        }

        // let prr = new PromiseExternal();
        // const prrPipeline = createPipeline();
        // let stopAndReload = false;

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

        const staticImageMap = new Map();

        const delayedUpdateStaticImage = (target) => {

            dmo.delayedUpdateStaticImage && dmo.delayedUpdateStaticImage(target);


        }

        const pmof = () => {

            if (SHOW_VIDEO_STATIC_IMAGE) {

                let medias = [...document.querySelectorAll('ytd-watch-flexy #player .html5-video-container .video-stream.html5-main-video')].filter(e => !e.closest('[hidden]'));
                if(medias.length === 0) medias = [...document.querySelectorAll('ytd-watch-flexy .html5-video-container .video-stream.html5-main-video')].filter(e => !e.closest('[hidden]'));
                if (medias.length !== 1) return;
                const mediaElm = medias[0];

                const container = mediaElm ? mediaElm.closest('.html5-video-container') : null;
                if (!container) return;

                const movie_player = mediaElm.closest('#movie_player, #masthead-player');

                let videoId = '';
                try {
                    videoId = movie_player && insp(movie_player).getVideoData().video_id;
                } catch (e) { }

                let thumbnailUrl = '';

                if (videoId) { thumbnailUrl = staticImageMap.get(videoId); }

                if (!thumbnailUrl) {
                    const ytdPage = container.closest('ytd-watch-flexy');
                    if (ytdPage && ytdPage.is === 'ytd-watch-flexy') {
                        const cnt = insp(ytdPage);
                        let thumbnails = null;
                        let videoDetails = null;
                        try {
                            videoDetails = insp(cnt).__data.playerData.videoDetails;
                            thumbnails = videoDetails.thumbnail.thumbnails;
                            // thumbnails = cnt.__data.watchNextData.playerOverlays.playerOverlayRenderer.autoplay.playerOverlayAutoplayRenderer.background.thumbnails
                        } catch (e) { }

                        thumbnailUrl = getThumbnailUrlFromThumbnails(thumbnails);

                        if (videoId && thumbnailUrl && typeof thumbnailUrl === 'string' && videoId === videoDetails.videoId ) {
                            staticImageMap.set(videoId, thumbnailUrl);
                        }

                    }
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
            dirtyMark = 1 | 2 | 4 | 8;
            target.__lastTouch582__ = Date.now();
            const targetClassList = target.classList || 0;
            const isPlayerVideo = typeof targetClassList.contains === 'function' ? targetClassList.contains('video-stream') && targetClassList.contains('html5-main-video') : false;
            delayedUpdateStaticImage(target);
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
                } else if (evt === 'click' && (this.id === 'movie_player' || this.id === 'masthead-player')) {
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


        const updateLastActiveTimeAsync_ = (player_) => {
            if (player_ && typeof player_.updateLastActiveTime === 'function') {
                player_.updateLastActiveTime();
            }
        };

        const updateLastActiveTimeAsync = (evt) => {
            Promise.resolve(evt?.updateLastActiveTime ? evt : evt?.target).then(updateLastActiveTimeAsync_);
        };



        const { setupAudioPlaying, internalAppPTFn, standardAppPTFn, playerDapPTFn } = (() => {

            // playerApp: external API [ external use ]
            // playerDap: internal player ( with this.app and this.state ) [ the internal interface for both app and state ]
            // standardApp: .app of internal player [without isBackground, with fn getVideoDate(), etc]
            // internalApp: internal controller inside standardApp (normally non-accessible) [with isBackground, data field videoData, etc]

            // window.gt1 -> playerApp
            // window.gt11 -> playerDap
            // window.gt2 -> standardApp
            // window.gt3 -> internalApp

            let key_mediaElementT = '';

            let key_yn = '';
            let key_nS = '';

            let key_L1 = ''; // playerDap -> internalDap

            let internalAppXT = null;
            let standardAppXT = null;
            let playerAppXT = null;
            let playerDapXT = null;


            const internalAppUT = new Set();
            const standardAppUT = new Set();
            const playerAppUT = new Set();
            const playerDapUT = new Set();


            let playerDapPTDone = false;
            // let playerAppPTDone = false;
            let standardAppPTDone = false;
            let internalAppPTDone = false;


            window.gtz = () => {
                return {
                    internalAppUT, standardAppUT, playerAppUT, playerDapUT, dirtyMark
                }
            }

            const getMediaElement = () => {

                const internalApp = internalAppXM();
                const standardApp = standardAppXM();

                let t;

                if (t = internalApp?.mediaElement?.[key_mediaElementT]) return t;


                if (t = standardApp?.mediaElement?.[key_mediaElementT]) return t;

                return null;



            }

            const internalApp_ZZ_sync = function () {
                return this.sync9383(...arguments)
            };

            const updateInternalAppFn_ = () => {

                const internalApp = internalAppXT;
                if (internalApp && !internalApp.__s4538__) {
                    if (internalApp.mediaElement) internalApp.__s4538__ = true;

                    const arr = Object.entries(internalApp).filter(e => e[1] && typeof e[1].sync === 'function');
                    for (const [key, o] of arr) {
                        const p = o.__proto__ || o;
                        if (!p.sync9383 && typeof p.sync === 'function') {
                            p.sync9383 = p.sync;
                            p.sync = internalApp_ZZ_sync;
                        }
                    }

                    if (!key_yn || !key_nS) {

                        for (const [key, value] of Object.entries(internalApp)) {
                            if (!key_yn && typeof (value || 0) === 'object' && value.experiments && value.experiments.flags && !isIterable(value)) {
                                key_yn = key;
                                console.log(1959, 'key_yn', key_yn)
                            } else if (!key_nS && typeof (value || 0) === 'object' && 'videoTrack' in value && 'audioTrack' in value && 'isSuspended' in value && !isIterable(value)) {
                                key_nS = key;
                                console.log(1959, 'key_nS', key_nS)
                            }
                        }

                    }

                    if (!key_mediaElementT) {
                        const iaMedia = internalApp.mediaElement || 0;
                        // console.log(1959, internalApp, iaMedia)

                        if (internalApp && typeof iaMedia === 'object') {
                            for (const [key, value] of Object.entries(iaMedia)) {
                                if (value instanceof HTMLMediaElement) {
                                    key_mediaElementT = key;
                                    console.log(1959, 'key_mediaElementT', key_mediaElementT)
                                }
                            }
                        }

                    }

                }


                if (!internalAppPTDone) {
                    const proto = internalApp ? internalApp.__proto__ : null;
                    if (proto) {
                        internalAppPTDone = true;
                        internalAppPTFn(proto);
                    }
                }

            }

            const updateInternalAppFn = (x) => {
                if (x !== internalAppXT) {
                    dirtyMark = 1 | 2 | 4 | 8;
                    internalAppUT.add(x);
                    internalAppXT = x;
                    // videoData
                    // stopVideo
                    // pauseVideo 
                    window.ytInternalAppPT = internalAppXT;

                }
                updateInternalAppFn_();
            }

            window.gt3 = () => internalAppXM();
            window.gt3x = () => internalAppUT;
            const internalAppXM = () => {
                if (!(dirtyMark & 4)) return internalAppXT;
                if (!key_mediaElementT) return internalAppXT;
                let result = null;
                const possibleResults = [];
                for (const p of internalAppUT) {
                    const iaMediaP = p.mediaElement;
                    if (!iaMediaP) {
                        // internalAppUT.delete(p);
                    } else {
                        const element = iaMediaP[key_mediaElementT];
                        if (element instanceof Element) {
                            if (element instanceof HTMLMediaElement && Number.isNaN(element.duration)) {

                            } else if (!element.isConnected) {
                                // valid entry but audio is not on the page

                            } else if (element.closest('[hidden]')) {

                            } else if (result === null && element.duration > 0) {
                                possibleResults.push([p, (element.__lastTouch582__ || 0), element.duration, (element.paused?1:0)]);
                                // 3600 ads might be added
                            }
                        }
                    }
                }
                if (possibleResults.length > 0) {
                    if (possibleResults.length === 1) result = possibleResults[0][0];
                    else {
                        possibleResults.sort((a, b) => {

                            let t = (b[1] - a[1]);
                            if (t < 360 && t > -360) t = 0;
                            if (t > 0 || t < 0) return t;
                            if (b[3] && !a[3]) return -1;
                            if (!b[3] && a[3]) return 1;
                            return (b[2] - a[2]); 


                        });
                        result = possibleResults[0][0];
                    }
                    possibleResults.length = 0;
                }
                if (!result) return result;
                if (!internalAppUT.has(result)) {
                    for (const p of internalAppUT) {
                        const iaMediaP = p.mediaElement;
                        if (!iaMediaP) {
                            internalAppUT.delete(p);
                        }
                    }
                    internalAppUT.add(result);
                }
                internalAppXT = result;
                updateInternalAppFn_();
                if (dirtyMark & 4) dirtyMark -= 4;
                return result;
            }

            const updateStandardAppFn_ = () => {
                const standardAppXT_ = standardAppXT;
                if (!standardAppPTDone) {
                    const proto = standardAppXT_ ? standardAppXT_.__proto__ : null;
                    if (proto) {
                        standardAppPTDone = true;
                        standardAppPTFn(proto);
                    }
                }
            }

            const updateStandardAppFn = (x) => {
                if (x !== standardAppXT) {
                    dirtyMark = 1 | 2 | 4 | 8;
                    standardAppUT.add(x);
                    standardAppXT = x;
                    // isAtLiveHead
                    // cancelPlayback
                    // stopVideo
                    // pauseVideo
                }
                updateStandardAppFn_(x);
            }
            window.gt2 = () => standardAppXM();

            const loadVideoByPlayerVarsP20 = {};
            const loadVideoByPlayerVarsQ20 = new Map();


            const standardAppXM = () => {

                if (!(dirtyMark & 2)) return standardAppXT;

                const internalApp = internalAppXM();
                if (!internalApp) return standardAppXT;
                const iaMedia = internalApp.mediaElement;


                let result = null;
                for (const p of standardAppUT) {
                    const iaMediaP = p.mediaElement;
                    if (!iaMediaP) {
                        // standardAppUT.delete(p);
                    } else {
                        if (iaMediaP === iaMedia) result = p;
                    }
                }
                if (!result) return result;
                if (!standardAppUT.has(result)) {
                    for (const p of standardAppUT) {
                        const iaMediaP = p.mediaElement;
                        if (!iaMediaP) {
                            standardAppUT.delete(p);
                        }
                    }
                    standardAppUT.add(result);
                }
                standardAppXT = result;
                updateStandardAppFn_();
                if (dirtyMark & 2) dirtyMark -= 2;
                return result;

            }

            const updatePlayerDapFn_ = () => {

                const playerD_ = playerDapXT;
                if (!playerD_.__onVideoProgressF381__) {
                    playerD_.__onVideoProgressF381__ = true;
                    try {
                        playerD_.removeEventListener('onVideoProgress', updateLastActiveTimeAsync); // desktop
                    } catch (e) { }
                    playerD_.addEventListener('onVideoProgress', updateLastActiveTimeAsync); // desktop
                }

                if (!playerDapPTDone) {
                    const proto = playerD_ ? playerD_.__proto__ : null;
                    if (proto) {
                        playerDapPTDone = true;
                        playerDapPTFn(proto);
                    }
                }

                const standardApp_ = playerD_.app || 0;
                if (standardApp_) {
                    updateStandardAppFn(standardApp_);
                }
            }

            const updatePlayerDapFn = (x) => {
                if (x !== playerDapXT) {
                    dirtyMark = 1 | 2 | 4 | 8;
                    // console.log('updatePlayerDapFn')
                    playerDapUT.add(x);
                    playerDapXT = x;
                    window.ytPlayerDapXT = playerDapXT;
                }
                updatePlayerDapFn_(x);

            }

            window.gt11 = () => {
                return playerDapXM();
            }
            const playerDapXM = () => {

                if (!(dirtyMark & 8)) return playerDapXT;
                const standardApp = standardAppXM();
                if (!standardApp) return playerDapXT;
                let result = null;
                for (const p of playerDapUT) {
                    if (!p.app || !p.app.mediaElement) {
                        // playerDapUT.delete(p);
                    }
                    else if (p.app === standardApp) result = p;
                }
                if (!result) return result;
                playerDapUT.add(result);
                playerDapXT = result;
                updatePlayerDapFn_();
                if (dirtyMark & 8) dirtyMark -= 8;
                return result;
            }

            const updatePlayerAppFn_ = () => {

                const player_ = playerAppXT;


                if (!player_.__s4539__ || !player_.__s4549__) {
                    player_.__s4539__ = true;


                    if (!player_.__onVideoProgressF381__ && typeof player_.addEventListener === 'function') {
                        player_.__onVideoProgressF381__ = true;
                        try {
                            player_.removeEventListener('onVideoProgress', updateLastActiveTimeAsync); // desktop
                        } catch (e) { }
                        player_.addEventListener('onVideoProgress', updateLastActiveTimeAsync); // desktop
                    }

                    const playerPT = player_.__proto__;
                    if (playerPT && typeof playerPT.getPlayerStateObject === 'function' && !playerPT.getPlayerStateObject949) {
                        playerPT.getPlayerStateObject949 = playerPT.getPlayerStateObject;
                        playerPT.getPlayerStateObject = function () {
                            updatePlayerAppFn(this);
                            return this.getPlayerStateObject949(...arguments);
                        }
                    } else if (player_ && typeof player_.getPlayerStateObject === 'function' && !player_.getPlayerStateObject949) {
                        player_.getPlayerStateObject949 = player_.getPlayerStateObject;
                        player_.getPlayerStateObject = function () {
                            updatePlayerAppFn(this);
                            return this.getPlayerStateObject949(...arguments);
                        }
                    }



                    // globalPlayer = mWeakRef(player_);
                    // window.gp3 = player_;


                    let playerDap_ = null;
                    {


                        const objectSets = new Set();
                        Function.prototype.apply129 = Function.prototype.apply;
                        Function.prototype.apply = function () {
                            objectSets.add([this, ...arguments]);
                            return this.apply129(...arguments)
                        }
                        player_.getPlayerState();

                        Function.prototype.apply = Function.prototype.apply129;

                        console.log(39912, [...objectSets]);
                        let filteredObjects = [...objectSets].filter(e => {
                            return Object(e[1]).getPlayerState === e[0]
                        });
                        console.log(39914, filteredObjects);

                        if (filteredObjects.length > 1) {
                            filteredObjects = filteredObjects.filter((e) => !(e[1] instanceof Node));
                        }

                        if (filteredObjects.length === 1) {
                            playerDap_ = filteredObjects[0][1];
                        }

                        objectSets.clear();
                        filteredObjects.length = 0;

                    }
                    {


                        let internalApp_ = null;
                        if (playerDap_ && playerDap_.app && playerDap_.state) {
                            const playerDapP_ = playerDap_.__proto__;
                            if (playerDapP_ && (playerDapP_.stopVideo || playerDapP_.pauseVideo) && (playerDapP_.playVideo)) {
                                if (!key_L1) {
                                    const listOfPossibles = [];
                                    for (const [key, value] of Object.entries(playerDapP_)) {
                                        if (typeof value === 'function' && value.length === 0 && `${value}`.endsWith('(this.app)}')) { // return g.O5(this.app)
                                            let m = null;
                                            try {
                                                m = playerDap_[key]()
                                            } catch (e) { }
                                            if (typeof (m || 0) === 'object') {
                                                listOfPossibles.push([key, m, evaluateInternalAppScore(m)]);
                                            }
                                        }
                                    }

                                    if (listOfPossibles.length >= 2) {
                                        listOfPossibles.sort((a, b) => {
                                            return b[2] - a[2];
                                        })
                                    }
                                    if (listOfPossibles.length >= 1) {
                                        key_L1 = listOfPossibles[0][0];
                                        internalApp_ = listOfPossibles[0][1];
                                        console.log('[yt-audio-only] key_L1', key_L1);
                                    }
                                    listOfPossibles.length = 0;
                                    // key_L1 = '';
                                }
                                updatePlayerDapFn(playerDap_);
                            }
                        }

                        if (key_L1) {
                            const internalApp = internalApp_ || playerDap_[key_L1]();
                            if (internalApp) {
                                updateInternalAppFn(internalApp);
                                player_.__s4549__ = true;
                            }
                        }
                    }


                    setupFns();


                }


            }

            // player could be just a DOM element without __proto__
            // will this update fail?
            const updatePlayerAppFn = (x) => {
                if (x !== playerAppXT) {
                    dirtyMark = 1 | 2 | 4 | 8;
                    // console.log('updatePlayerAppFn')
                    playerAppUT.add(x);
                    playerAppXT = x;
                }
                updatePlayerAppFn_();
            }
            const playerAppXM = () => {

                if (!(dirtyMark & 1)) return playerAppXT;

                const standardApp = standardAppXM();
                if (!standardApp) return playerAppXT;

                const playerAppUA = [...playerAppUT];
                loadVideoByPlayerVarsQ20.clear();
                for (let i = 0; i < playerAppUA.length; i++) {
                    const playerApp = playerAppUA[i];
                    loadVideoByPlayerVarsP20.index = i;
                    try {
                        playerApp.loadVideoByPlayerVars(loadVideoByPlayerVarsP20, 0, 0);
                    } catch (e) { }
                    loadVideoByPlayerVarsP20.index = -1;
                }
                window.loadVideoByPlayerVarsQ20 = loadVideoByPlayerVarsQ20;

                const j = loadVideoByPlayerVarsQ20.get(standardApp);

                const result = Number.isFinite(j) && j >= 0 ? playerAppUA[j] : null;

                const idxSet = new Set(loadVideoByPlayerVarsQ20.values());

                for (let i = 0; i < playerAppUA.length; i++) {
                    if (!idxSet.has(i)) playerAppUT.delete(playerAppUA[i]);
                }
                // loadVideoByPlayerVarsQ20.clear();
                if (!result) return result;
                playerAppUT.add(result);
                playerAppXT = result;
                updatePlayerAppFn_();
                if (dirtyMark & 1) dirtyMark -= 1;
                return result;

            }
            window.gt1 = () => playerAppXM();





            const playerDapPTFn = (playerDapPT_) => {

                const playerDapPT = playerDapPT_;


                if (playerDapPT && typeof playerDapPT.getPlayerStateObject === 'function' && !playerDapPT.getPlayerStateObject949) {

                    playerDapPT.getPlayerStateObject949 = playerDapPT.getPlayerStateObject;
                    playerDapPT.getPlayerStateObject = function () {
                        updatePlayerDapFn(this);
                        return this.getPlayerStateObject949(...arguments);
                    };

                }
            };


            const standardAppPTFn = (standardAppPT_) => {

                const standardAppPT = standardAppPT_;

                if (standardAppPT && typeof standardAppPT.loadVideoByPlayerVars === 'function' && !standardAppPT.loadVideoByPlayerVars311) {

                    let lastRecord = [];

                    standardAppPT.loadVideoByPlayerVars311 = standardAppPT.loadVideoByPlayerVars;

                    standardAppPT.loadVideoByPlayerVars = function (p, C, V, N, H) {
                        if (p === loadVideoByPlayerVarsP20) {
                            // console.log('loadVideoByPlayerVarsP20', p, p.index)
                            loadVideoByPlayerVarsQ20.set(this, p.index);
                            return;
                        }
                        try {
                            // update static image here!
                            updateStandardAppFn(this)
                            if (p && typeof p === 'object') {

                                const { adPlacements, adSlots } = p.raw_player_response || {};
                                if (isIterable(adPlacements)) adPlacements.length = 0;
                                if (isIterable(adSlots)) adSlots.length = 0;

                                lastRecord.length = 0;
                                lastRecord.push(...[p, C, V, N, H]);
                                console.log('lastRecord 03022', [...lastRecord])
                                const videoDetails = ((p || 0).raw_player_response || 0).videoDetails || 0;
                                if (videoDetails) {
                                    const thumbnails = (videoDetails.thumbnail || 0).thumbnails || 0;
                                    const url = thumbnails ? getThumbnailUrlFromThumbnails(thumbnails) : '';
                                    const videoId = videoDetails.videoId;
                                    videoId && url && typeof url === 'string' && typeof videoId === 'string' && staticImageMap.set(videoId, url);
                                    // console.log('staticImageMap set', videoId, url);
                                }
                                dirtyMark = 1 | 2 | 4 | 8;
                            }

                        } catch (e) {
                            console.warn(e);
                        }

                        return this.loadVideoByPlayerVars311(...arguments);
                    }
                }


            };



            const { internalAppPTFn } = (() => {

                const fixMediaElement = (p) => {

                }

                const internalAppPTFn = (internalAppPT_) => {

                    const internalAppPT = internalAppPT_;

                    if (internalAppPT && internalAppPT.playVideo && !internalAppPT.playVideo9391) {
                        internalAppPT.playVideo9391 = internalAppPT.playVideo;

                        internalAppPT.playVideo = function (p, C) {
                            updateInternalAppFn(this);
                            console.log(`[yt-audio-only] internalApp.playVideo; skipPlayPause=${skipPlayPause}`);
                            try {
                                // flagOn();
                                return this.playVideo9391(...arguments);
                            } catch (e) {
                                console.warn(e);
                            } finally {
                                // flagOff();
                            }
                        }
                        internalAppPT.playVideo.toString = internalAppPT.playVideo9391.toString.bind(internalAppPT.playVideo9391);



                    }


                    if (internalAppPT && internalAppPT.pauseVideo && !internalAppPT.pauseVideo9391) {

                        internalAppPT.pauseVideo9391 = internalAppPT.pauseVideo;

                        internalAppPT.pauseVideo = function (p) {
                            updateInternalAppFn(this);
                            console.log(`[yt-audio-only] internalApp.pauseVideo; skipPlayPause=${skipPlayPause}`);
                            try {
                                // flagOn();
                                return this.pauseVideo9391(...arguments);
                            } catch (e) {
                                console.warn(e);
                            } finally {
                                // flagOff();
                            }
                        }
                        internalAppPT.pauseVideo.toString = internalAppPT.pauseVideo9391.toString.bind(internalAppPT.pauseVideo9391);


                    }


                    if (internalAppPT && internalAppPT.stopVideo && !internalAppPT.stopVideo9391) {

                        internalAppPT.stopVideo9391 = internalAppPT.stopVideo;

                        internalAppPT.stopVideo = function () {
                            updateInternalAppFn(this);
                            console.log(`[yt-audio-only] internalApp.stopVideo; skipPlayPause=${skipPlayPause ? 1 : 0}`);
                            try {
                                // flagOn();
                                return this.stopVideo9391(...arguments);
                            } catch (e) {
                                console.warn(e);
                            } finally {
                                // flagOff();
                            }
                        }
                        internalAppPT.stopVideo.toString = internalAppPT.stopVideo9391.toString.bind(internalAppPT.stopVideo9391);


                    }

                    if (internalAppPT && internalAppPT.isBackground && !internalAppPT.isBackground9391) {
                        internalAppPT.isBackground9391 = internalAppPT.isBackground;

                        const f = () => false;
                        internalAppPT.isBackground = function () {
                            try {
                                if (this.visibility.isBackground !== f) this.visibility.isBackground = f;
                                return f();
                            } catch (e) {
                            }
                            return false;
                        }

                    }

                    if (internalAppPT && internalAppPT.sendAbandonmentPing && !internalAppPT.sendAbandonmentPing9391) {
                        internalAppPT.sendAbandonmentPing9391 = internalAppPT.sendAbandonmentPing;

                        internalAppPT.sendAbandonmentPing = function () {

                            console.log('[yt-audio-only] sendAbandonmentPing');

                            dirtyMark = 1 | 2 | 4 | 8;

                            return this.sendAbandonmentPing9391(...arguments);
                        }
                    }

                    if (!internalAppPT.setMediaElement661 && typeof internalAppPT.setMediaElement === 'function') {
                        internalAppPT.setMediaElement661 = internalAppPT.setMediaElement;
                        internalAppPT.setMediaElement = function (p) {
                            window.ytInternalAppPT = this;
                            dirtyMark = 1 | 2 | 4 | 8;
                            updateInternalAppFn(this);
                            fixMediaElement(p);
                            console.log('setMediaElement', p)
                            const mediaEm = p && key_mediaElementT ? p[key_mediaElementT] : null;
                            if (mediaEm) mediaEm.__lastTouch582__ = Date.now();
                            delayedUpdateStaticImage(getMediaElement());
                            return this.setMediaElement661(...arguments);
                        }
                    }



                }

                return { internalAppPTFn }


            })();



            let setupFnsB = false;
            const setupFns = () => {
                if (setupFnsB) return;
                setupFnsB = true;

                try {

                    let u75 = 0;

                    const delayedUpdateStaticImage = async (target) => {

                        if (u75 > 1e9) u75 = 9;
                        const t75 = ++u75;
                        await delayPn(40);
                        if (t75 !== u75) return;

                        const date0 = Date.now();

                        const mediaEm = target;

                        if (!mediaEm || mediaEm.isConnected === false) return;

                        let movie_player, h5vc;

                        while (Date.now() - date0 < 800) {
                            movie_player = mediaEm.closest('#movie_player, #masthead-player');
                            h5vc = mediaEm.closest('.html5-video-container');
                            if (movie_player && h5vc) break;
                            await delayPn(40);
                            if (t75 !== u75) return;
                        }

                        if (!movie_player || !h5vc) return;

                        if (!mediaEm || mediaEm.isConnected === false) return;

                        if (movie_player.querySelectorAll('video, audio').length !== 1) return;
                        if (h5vc.querySelectorAll('video, audio').length !== 1) return;

                        let videoId = '';
                        try {
                            videoId = movie_player && insp(movie_player).getVideoData().video_id;
                        } catch (e) { }

                        if (!videoId) return;
                        let thumbnailUrl = '';

                        if (videoId) { thumbnailUrl = staticImageMap.get(videoId); }

                        if (!thumbnailUrl) return;

                        const displayImage = `url(${thumbnailUrl})`;
                        h5vc.style.setProperty('--audio-only-thumbnail-image', `${displayImage}`);

                    }
                    Object.assign(dmo, {  delayedUpdateStaticImage });


                    let playBusy = 0;


                    console.log('[yt-audio-only] DONE')

                } catch (e) {
                    console.warn(e);
                }




            }

            const setupAudioPlaying = (player00_) => {

                // console.log(5939,player00_);

                try {
                    const player_ = player00_;
                    if (!player_) return;
                    if (player_.__audio544__) return;
                    player_.__audio544__ = 1;

                    updatePlayerAppFn(player_);

                } catch (e) {
                    console.warn(e);
                }
            }

            if (!window.__ugAtg3747__) {
                window.__ugAtg3747__ = true;
                const updateLastActiveTimeGeneral = () => {
                    // player_ -> yuu
                    const player_ = playerDapXM() || playerAppXM();
                    if (player_) player_.updateLastActiveTime();
                };
                document.addEventListener('timeupdate', updateLastActiveTimeGeneral, true);
            }

            return { setupAudioPlaying, internalAppPTFn, standardAppPTFn, playerDapPTFn };

        })();


        if (location.origin === 'https://www.youtube.com') {



            if (location.pathname.startsWith('/embed/')) {

                // youtube embed

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



                const ytEmbedPageReady = observablePromise(() => document.querySelector('audio, video')).obtain();


                embedConfigFix();

                let qc2 = false;
                let nd2 = null;

                const loadStaticImage = () => {

                    let displayImage = '';
                    let html5Container = null;


                    const moviePlayer = document.querySelector('#movie_player .html5-video-container .video-stream.html5-main-video, #masthead-player .html5-video-container .video-stream.html5-main-video');
                    if (moviePlayer) {
                        html5Container = moviePlayer.closest('.html5-video-container');
                    }

                    if (html5Container) {

                        const overlayImage = document.querySelector('#movie_player .ytp-cued-thumbnail-overlay-image[style], #masthead-player .ytp-cued-thumbnail-overlay-image[style]') || document.querySelector('#player-controls .ytmVideoCoverThumbnail[style]');
                        if (overlayImage) {
                            const cStyle = window.getComputedStyle(overlayImage);
                            const cssImageValue = cStyle.backgroundImage;
                            if (cssImageValue && typeof cssImageValue === 'string' && cssImageValue.startsWith('url(')) {
                                displayImage = cssImageValue;
                                overlayImage.setAttribute("yehww14", "");
                                qc2 = true;
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
                            nd2 = `${displayImage}`;
                        } else {
                            html5Container.style.removeProperty('--audio-only-thumbnail-image')
                            nd2 = null;
                        }

                    }

                };

                if (SHOW_VIDEO_STATIC_IMAGE) {

                    ytEmbedPageReady.then(() => {
                        loadStaticImage();
                    });

                    let loadImage = 0;

                    setInterval(() => {
                        if (loadImage > 0) {
                            loadImage--;
                            let t0 = nd2;
                            loadStaticImage();
                            if (t0 !== nd2 && nd2) loadImage = 0;
                        }
                    }, 500);
                    document.addEventListener("loadedmetadata", (ev) => {
                        if (ev.target instanceof HTMLMediaElement) {
                            loadImage = 8;
                        }
                    }, true);

                    new MutationObserver(() => {
                        if (loadImage > 0 && qc2) {
                            if (!document.querySelector("[yehww14]")) {
                                loadStaticImage();
                            } else {
                                loadImage = 0;
                            }
                        }
                    }).observe(document.documentElement, { subtree: true, childList: true });

                }



            } else {


                // youtube normal

                attachOneTimeEvent('yt-action', () => {
                    const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
                    ytConfigFix(config_);
                });

                let r3 = new PromiseExternal();
                document.addEventListener('yt-action', () => {
                    let u = document.querySelector('ytd-watch-flexy');
                    if (u && typeof insp(u).calculateCurrentPlayerSize_ === 'function') {
                        r3.resolve(u);
                    }

                }, true);

                r3.then((watchFlexy) => {
                    // for offline video, without audio -> so no size

                    if (!watchFlexy) return;
                    const cnt = insp(watchFlexy);
                    if (typeof cnt.calculateCurrentPlayerSize_ === 'function' && !cnt.calculateCurrentPlayerSize3991_) {

                        cnt.calculateCurrentPlayerSize3991_ = cnt.calculateCurrentPlayerSize_;
                        cnt.calculateCurrentPlayerSize_ = function () {
                            const r = this.calculateCurrentPlayerSize3991_(...arguments);

                            if (r && r.width > 10 && !Number.isFinite(r.height)) {
                                r.height = Math.round(r.width / 16 * 9);
                            }
                            return r;

                        }

                    }

                });



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
                        // Force audio-only on the per-instance config passed in.
                        try {
                            if (a && typeof a === 'object') {
                                a.deviceIsAudioOnly = true;
                                if (a.attrs && typeof a.attrs === 'object') a.attrs.deviceIsAudioOnly = true;
                                if (a.args && typeof a.args === 'object') a.args.audio_only = '1';
                            }
                        } catch (e) { }
                        let r = this.createMainAppPlayer932_(a, b, c);
                        try {
                            (async () => {
                                const e = await this.mainAppPlayer_.api;
                                setupAudioPlaying(e); // desktop normal
                            })();
                        } finally {
                            return r;
                        }
                    }
                    cProto.initPlayer_ = function (a) {
                        configFixBeforeCreate();
                        let r = this.initPlayer932_(a);
                        try {
                            (async () => {
                                const e = await r;
                                setupAudioPlaying(this.player_); // desktop normal
                            })();
                        } finally {
                            return r;
                        }
                    }
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
                    console.log('STx02', thumbnailUrl);

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
            const mff = function (e) {
                const target = (e || 0).target || 0;
                if (target !== player0 && target && typeof target.getPlayerState === 'function') {
                    player0 = target;
                    setupAudioPlaying(target); // mobile 
                }
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



            document.addEventListener('video-progress', updateLastActiveTimeAsync, true); // mobile



            //       document.addEventListener('DOMContentLoaded', (evt) => {
            //         const mo = new MutationObserver((mutations)=>{
            //           console.log(5899, mutations)
            //         });
            //         mo.observe(document, {subtree: true, childList: true})
            //       })

            //       winAddEventListener('onReady', (evt) => {
            //         console.log(6811)
            //       }, true);

            //       winAddEventListener('localmediachange', (evt) => {
            //         console.log(6812)
            //       }, true);

            //       winAddEventListener('onVideoDataChange', (evt) => {
            //         console.log(6813)
            //       }, true);

            winAddEventListener('state-navigateend', async (evt) => {

                delayPn(200).then(() => {
                    if (!getAppJSON()) {
                        console.log('[mobile youtube audio only] getAppJSON fails.', document.querySelectorAll('script[type="application/ld+json"]').length);
                    }
                });

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



            // winAddEventListener('player-initialized', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // winAddEventListener('renderer-module-load-start', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // winAddEventListener('video-data-change', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // winAddEventListener('player-state-change', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // winAddEventListener('updateui', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // winAddEventListener('renderer-module-load-end', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('player-autonav-pause', (evt) => {
            //   console.log(evt.type)
            // }, true)



            // winAddEventListener('player-ad-state-change', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('player-detailed-error', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('player-error', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('on-play-autonav-video', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('on-play-previous-autonav-video', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('player-fullscreen-change', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('player-fullscreen-toggled', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('player-dom-paused', (evt) => {
            //   console.log(evt.type)
            // }, true)

            // winAddEventListener('yt-show-toast', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // winAddEventListener('yt-innertube-command', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // winAddEventListener('yt-update-c3-companion', (evt) => {
            //   console.log(evt.type)
            // }, true)
            // winAddEventListener('video-progress', (evt) => {
            //   // console.log(evt.type)
            // }, true)
            // winAddEventListener('localmediachange', (evt) => {
            //   console.log(evt.type)
            // }, true)



            // document.addEventListener('player-error', (evt) => {
            //   console.log(3001, evt.type, evt)
            // }, true)
            // document.addEventListener('player-detailed-error', (evt) => {
            //   console.log(3002, evt.type, evt)
            // }, true)



            async function delayRun(pr) {

                let q = document.querySelector('#movie_player') || document.querySelector('#masthead-player');
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


            if (!window.__YtAudioDataSetFix__ && typeof _yt_player !== 'undefined' && _yt_player && typeof _yt_player === 'object') {

                for (const [k, v] of Object.entries(_yt_player)) {
                    const p = typeof v === 'function' ? v.prototype : 0;
                    if (!p || !p.setData) continue;
                    if (typeof p.setData !== 'function') continue;
                    if (p.setData.length < 1) continue;
                    if (typeof p.getAudioTrack !== 'function') continue;
                    if (p.setData.__YtAudioDataSetFix__) continue;
                    p.setData8117 = p.setData;
                    p.setData = function (B, ...args) {
                        const heartbeatParams = ((B || 0).raw_player_response || 0).heartbeatParams;
                        if (heartbeatParams) {
                            heartbeatParams.softFailOnError = true;
                            // heartbeatParams.useInnertubeHeartbeatsForDrm = false;
                            heartbeatParams.maxRetries = 2;
                            if (typeof heartbeatParams.intervalMilliseconds === "string" || typeof heartbeatParams.intervalMilliseconds === "number") {
                                const l = +heartbeatParams.intervalMilliseconds;
                                if (l > 1 && l < 3600000) {
                                    let d = 3600000;
                                    heartbeatParams.intervalMilliseconds = typeof heartbeatParams.intervalMilliseconds === "string" ? `${d}` : d;
                                }
                            }
                            console.log("[yt-audio-only] setData heartbeatParams", heartbeatParams);
                        }
                        return this.setData8117(B, ...args);
                    };
                    p.setData.__YtAudioDataSetFix__ = true;
                    window.__YtAudioDataSetFix__ = true;
                    console.log("[yt-audio-only]", "__YtAudioDataSetFix__");
                }
            }


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

        const supportedFormatsConfig = () => {

            let types = new Set();
            function makeModifiedTypeChecker(origChecker) {
                return function (type) {
                    const res = origChecker.apply(this, arguments);
                    if (res) {
                        if (type && typeof type === "string" && type.includes("audio/")) types.add(type);
                    }
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

            const msep = (mse || 0).prototype || 0;

            // -------------------------------------------------------------
            // Fake video SourceBuffer factory
            // -------------------------------------------------------------
            // Why this exists (fixes live-stream audio-only playback):
            //
            // YouTube's base.js sets up TWO source buffers (audio + video) for
            // every playback session. For manifestless live streams (24/7
            // radios, channel/live URLs, etc.) the player gates initial
            // playback on an "initial sync" promise that only resolves once
            // BOTH videoTrack.S and audioTrack.S are no longer -1. Those
            // values only leave -1 when the player observes an `updateend`
            // event on each track's underlying SourceBuffer (the player's
            // segment state machine advances on `updateend`).
            //
            // Previously this script returned `undefined` for video
            // addSourceBuffer calls. That left the video track without any
            // EventTarget, no `updateend` ever fired, the sync promise never
            // resolved, the player gave up and entered a stopVideo /
            // pauseVideo / setMediaElement / playVideo loop -- the symptom
            // observed in the console (a second `Media Codec` line never
            // appears the way it does for VOD).
            //
            // VOD continued to work because the manifestless-live sync gate
            // is only armed when `Pa.isManifestless && !policy.N` (base.js
            // line ~2701), so for normal videos, no `updateend` is required
            // from the video buffer for playback to progress.
            //
            // Fix: instead of returning `undefined`, return a minimal stub
            // that quacks like a SourceBuffer and fires `updateend` after
            // each `appendBuffer`/`remove` call. The stub silently drops
            // the bytes, but the player's state machine advances and live
            // playback proceeds with audio only. No video bandwidth is
            // actually consumed by the browser's decoder since the bytes
            // are never passed to it.
            // -------------------------------------------------------------
            // Toggle to silence the stub's per-call logs while keeping
            // creation + error logs. Kept OFF: on a live stream the player
            // appends a new video chunk every few tens of ms, so per-append
            // logging floods the console (this was the "continuous logging"
            // that exposed the issue). A throttled summary (below) gives
            // visibility without the flood; flip to true only for deep debug.
            const FAKE_SB_DEBUG = true;
            // Throttled one-line summary (at most once per interval) so you
            // can still see that video bytes are being dropped without spam.
            const FAKE_SB_SUMMARY = true;
            const FAKE_SB_SUMMARY_INTERVAL_MS = 5000;
            // Monotonic id so multiple stubs (e.g. format switches) can be
            // told apart in the console.
            let fakeSbCounter = 0;

            function makeFakeVideoSourceBuffer(mimeType, mediaSource) {
                const sbId = ++fakeSbCounter;
                const logPrefix = `[yt-audio-only] FakeSB #${sbId}:`;

                const dlog = (...args) => {
                    if (FAKE_SB_DEBUG) console.log(logPrefix, ...args);
                };

                const elog = (...args) => {
                    console.error(logPrefix, ...args);
                };

                const fake = Object.create(SourceBuffer.prototype);
                const eventTarget = new EventTarget();

                let isUpdating = false;
                let currentMode = 'segments';
                let tsOffset = 0;
                let windowStart = 0;
                let windowEnd = Infinity;
                let bufferedReads = 0;
                let droppedBytes = 0;
                let lastSummaryAt = 0;

                const stats = {
                    id: sbId,
                    mimeType,
                    createdAt: Date.now(),
                    listeners: {
                        updatestart: 0,
                        update: 0,
                        updateend: 0,
                        abort: 0,
                        error: 0
                    },
                    appendBufferCount: 0,
                    removeCount: 0,
                    abortCount: 0,
                    writeHeadCount: 0,
                    changeTypeCount: 0,
                    bufferedReadCount: 0,
                    droppedBytes: 0,
                    lastAppendByteLength: 0,
                    lastRemoveRange: null,
                    lastChangeType: null,
                    lastEventType: null,
                    lastError: null,
                    get updating() {
                        return isUpdating;
                    },
                    get mode() {
                        return currentMode;
                    },
                    get timestampOffset() {
                        return tsOffset;
                    },
                    get appendWindowStart() {
                        return windowStart;
                    },
                    get appendWindowEnd() {
                        return windowEnd;
                    }
                };

                Object.defineProperty(fake, '__ytAudioOnlyStats__', {
                    value: stats,
                    enumerable: false,
                    configurable: true
                });

                const queueTask = typeof queueMicrotask === 'function'
                    ? queueMicrotask
                    : (fn) => Promise.resolve().then(fn);

                const byteLengthOf = (buf) => {
                    if (!buf) return 0;
                    if (typeof buf.byteLength === 'number') return buf.byteLength;
                    if (typeof buf.length === 'number') return buf.length;
                    return 0;
                };

                const maybePrintSummary = () => {
                    if (!FAKE_SB_SUMMARY) return;

                    const now = Date.now();
                    if (now - lastSummaryAt < FAKE_SB_SUMMARY_INTERVAL_MS) return;
                    lastSummaryAt = now;

                    console.log(
                        `[yt-audio-only] FakeSB #${sbId} summary: ` +
                        `append=${stats.appendBufferCount}, ` +
                        `remove=${stats.removeCount}, ` +
                        `abort=${stats.abortCount}, ` +
                        `writeHead=${stats.writeHeadCount}, ` +
                        `changeType=${stats.changeTypeCount}, ` +
                        `bufferedReads=${stats.bufferedReadCount}, ` +
                        `droppedBytes=${stats.droppedBytes}`
                    );
                };

                const getAudioSibling = () => {
                    try {
                        if (mediaSource && mediaSource.__ytAOAudioSB__) {
                            return mediaSource.__ytAOAudioSB__;
                        }

                        const list = mediaSource && mediaSource.sourceBuffers;
                        if (list) {
                            for (let i = 0; i < list.length; i++) {
                                const sb = list[i];
                                if (sb && sb !== fake && !sb.__ytAudioOnlyStats__) return sb;
                            }
                        }
                    } catch (e) {
                        dlog('getAudioSibling error:', e);
                    }

                    return null;
                };

                const getAudioSiblingProp = (prop, fallback) => {
                    try {
                        const audioSb = getAudioSibling();
                        if (audioSb) return audioSb[prop];
                    } catch (e) {
                        dlog(`audio ${prop} read error:`, e);
                    }

                    return fallback;
                };

                const setAudioSiblingProp = (prop, value) => {
                    try {
                        const audioSb = getAudioSibling();
                        if (audioSb) audioSb[prop] = value;
                    } catch (e) {
                        dlog(`audio ${prop} write error:`, e);
                    }
                };

                const emptyTimeRanges = {
                    length: 0,
                    start() {
                        throw new DOMException(
                            "Failed to execute 'start' on 'TimeRanges': The index provided is greater than or equal to the number of ranges.",
                            "IndexSizeError"
                        );
                    },
                    end() {
                        throw new DOMException(
                            "Failed to execute 'end' on 'TimeRanges': The index provided is greater than or equal to the number of ranges.",
                            "IndexSizeError"
                        );
                    }
                };

                const makeEvent = (type) => {
                    const ev = new Event(type);

                    try {
                        Object.defineProperties(ev, {
                            target: {
                                value: fake,
                                configurable: true
                            },
                            currentTarget: {
                                value: fake,
                                configurable: true
                            },
                            srcElement: {
                                value: fake,
                                configurable: true
                            }
                        });
                    } catch (e) { }

                    return ev;
                };

                const triggerEvent = (type) => {
                    stats.lastEventType = type;

                    const ev = makeEvent(type);

                    const directHandler = fake[`on${type}`];
                    if (typeof directHandler === 'function') {
                        try {
                            directHandler.call(fake, ev);
                        } catch (err) {
                            stats.lastError = err;
                            elog(`Error in on${type} handler:`, err);
                        }
                    }

                    try {
                        eventTarget.dispatchEvent(ev);
                    } catch (err) {
                        stats.lastError = err;
                        elog(`Error dispatching ${type}:`, err);
                    }

                    dlog('event fired:', type);
                };

                const beginOperation = (methodName) => {
                    if (isUpdating) {
                        throw new DOMException(
                            `Failed to execute '${methodName}' on 'SourceBuffer': This SourceBuffer is still processing an 'appendBuffer' or 'remove' operation.`,
                            "InvalidStateError"
                        );
                    }

                    isUpdating = true;
                };

                const finishOperationAsync = () => {
                    queueTask(() => {
                        triggerEvent('updatestart');

                        queueTask(() => {
                            isUpdating = false;
                            triggerEvent('update');
                            triggerEvent('updateend');
                            maybePrintSummary();
                        });
                    });
                };

                const _add = eventTarget.addEventListener.bind(eventTarget);
                fake.addEventListener = function (type, handler, options) {
                    if (stats.listeners[type] !== undefined) stats.listeners[type]++;
                    dlog('addEventListener', type, 'count:', stats.listeners[type]);
                    return _add(type, handler, options);
                };

                const _remove = eventTarget.removeEventListener.bind(eventTarget);
                fake.removeEventListener = function (type, handler, options) {
                    if (stats.listeners[type] !== undefined) {
                        stats.listeners[type] = Math.max(0, stats.listeners[type] - 1);
                    }

                    dlog('removeEventListener', type, 'remaining:', stats.listeners[type]);
                    return _remove(type, handler, options);
                };

                fake.dispatchEvent = function (evt) {
                    dlog('dispatchEvent called externally:', evt && evt.type);
                    return eventTarget.dispatchEvent(evt);
                };

                Object.defineProperties(fake, {
                    updating: {
                        get: () => isUpdating,
                        configurable: true,
                        enumerable: true
                    },
                    mode: {
                        get: () => currentMode,
                        set: (val) => {
                            if (isUpdating) {
                                throw new DOMException(
                                    "Failed to set 'mode' on 'SourceBuffer': This SourceBuffer is still processing an operation.",
                                    "InvalidStateError"
                                );
                            }

                            if (val !== 'segments' && val !== 'sequence') {
                                throw new TypeError(
                                    "Failed to set 'mode' on 'SourceBuffer': The provided value is not a valid SourceBuffer mode."
                                );
                            }

                            currentMode = val;
                            dlog('mode set:', val);
                        },
                        configurable: true,
                        enumerable: true
                    },
                    timestampOffset: {
                        get: () => getAudioSiblingProp('timestampOffset', tsOffset),
                        set: (val) => {
                            if (isUpdating) {
                                throw new DOMException(
                                    "Failed to set 'timestampOffset' on 'SourceBuffer': This SourceBuffer is still processing an operation.",
                                    "InvalidStateError"
                                );
                            }

                            tsOffset = val;
                            setAudioSiblingProp('timestampOffset', val);
                            dlog('timestampOffset set:', val);
                        },
                        configurable: true,
                        enumerable: true
                    },
                    appendWindowStart: {
                        get: () => getAudioSiblingProp('appendWindowStart', windowStart),
                        set: (val) => {
                            if (isUpdating) {
                                throw new DOMException(
                                    "Failed to set 'appendWindowStart' on 'SourceBuffer': This SourceBuffer is still processing an operation.",
                                    "InvalidStateError"
                                );
                            }

                            windowStart = val;
                            setAudioSiblingProp('appendWindowStart', val);
                            dlog('appendWindowStart set:', val);
                        },
                        configurable: true,
                        enumerable: true
                    },
                    appendWindowEnd: {
                        get: () => getAudioSiblingProp('appendWindowEnd', windowEnd),
                        set: (val) => {
                            if (isUpdating) {
                                throw new DOMException(
                                    "Failed to set 'appendWindowEnd' on 'SourceBuffer': This SourceBuffer is still processing an operation.",
                                    "InvalidStateError"
                                );
                            }

                            windowEnd = val;
                            setAudioSiblingProp('appendWindowEnd', val);
                            dlog('appendWindowEnd set:', val);
                        },
                        configurable: true,
                        enumerable: true
                    },
                    buffered: {
                        get: () => {
                            bufferedReads++;
                            stats.bufferedReadCount = bufferedReads;

                            try {
                                const audioSb = getAudioSibling();
                                if (audioSb && audioSb.buffered) {
                                    const b = audioSb.buffered;

                                    if (FAKE_SB_DEBUG && bufferedReads <= 5) {
                                        let rangeText = 'empty';
                                        try {
                                            rangeText = b.length ? `[${b.start(0)}, ${b.end(b.length - 1)}]` : 'empty';
                                        } catch (e) {
                                            rangeText = 'unreadable';
                                        }

                                        dlog('buffered read #', bufferedReads, '(mirroring audio SB:', rangeText, ')');
                                    } else if (FAKE_SB_DEBUG && bufferedReads === 6) {
                                        dlog('buffered read #6 -- further reads suppressed');
                                    }

                                    return b;
                                }
                            } catch (e) {
                                dlog('audio buffered read err', e);
                            }

                            if (FAKE_SB_DEBUG && bufferedReads <= 5) {
                                dlog('buffered read #', bufferedReads, '(audio fallback empty TimeRanges used)');
                            } else if (FAKE_SB_DEBUG && bufferedReads === 6) {
                                dlog('buffered read #6 -- further fallback reads suppressed');
                            }

                            return emptyTimeRanges;
                        },
                        configurable: true,
                        enumerable: true
                    }
                });

                ['updatestart', 'update', 'updateend', 'abort', 'error'].forEach(type => {
                    let internalValue = null;

                    Object.defineProperty(fake, `on${type}`, {
                        get: () => internalValue,
                        set: (fn) => {
                            internalValue = typeof fn === 'function' ? fn : null;
                            dlog(`on${type} direct handler set:`, !!internalValue);
                        },
                        configurable: true,
                        enumerable: true
                    });
                });

                fake.appendBuffer = function (buf) {
                    beginOperation('appendBuffer');

                    const len = byteLengthOf(buf);

                    stats.appendBufferCount++;
                    stats.lastAppendByteLength = len;
                    droppedBytes += len;
                    stats.droppedBytes = droppedBytes;

                    dlog('appendBuffer called; dropping fake video segment bytes:', len);

                    finishOperationAsync();
                };

                fake.remove = function (start, end) {
                    beginOperation('remove');

                    stats.removeCount++;
                    stats.lastRemoveRange = [start, end];

                    dlog(`remove window clear requested range: [${start}, ${end}]`);

                    finishOperationAsync();
                };

                fake.abort = function () {
                    stats.abortCount++;
                    dlog('abort track requested');

                    if (isUpdating) {
                        isUpdating = false;
                        triggerEvent('abort');
                        triggerEvent('updateend');
                    } else {
                        triggerEvent('abort');
                    }

                    maybePrintSummary();
                };

                fake.changeType = function (type) {
                    if (isUpdating) {
                        throw new DOMException(
                            "Failed to execute 'changeType' on 'SourceBuffer': This SourceBuffer is still processing an operation.",
                            "InvalidStateError"
                        );
                    }

                    stats.changeTypeCount++;
                    stats.lastChangeType = type;

                    dlog(`changeType conversion requested to: ${type}`);
                };

                fake.writeHead = function (...args) {
                    stats.writeHeadCount++;
                    dlog('writeHead method called with parameters:', ...args);
                    maybePrintSummary();
                    return true;
                };

                fake.appendBufferAsync = function (buf) {
                    dlog('appendBufferAsync called');

                    return new Promise((resolve, reject) => {
                        try {
                            const done = () => {
                                fake.removeEventListener('updateend', done);
                                resolve();
                            };

                            fake.addEventListener('updateend', done);
                            fake.appendBuffer(buf);
                        } catch (e) {
                            reject(e);
                        }
                    });
                };

                fake.removeAsync = function (start, end) {
                    dlog('removeAsync called');

                    return new Promise((resolve, reject) => {
                        try {
                            const done = () => {
                                fake.removeEventListener('updateend', done);
                                resolve();
                            };

                            fake.addEventListener('updateend', done);
                            fake.remove(start, end);
                        } catch (e) {
                            reject(e);
                        }
                    });
                };

                window.__ytAudioOnlyLastFakeSB__ = fake;

                console.log(
                    `[yt-audio-only] fake video SourceBuffer #${sbId} created for ${mimeType}; ` +
                    `inspect via window.__ytAudioOnlyLastFakeSB__.__ytAudioOnlyStats__`
                );

                return fake;
            }

            if (msep && typeof msep.addSourceBuffer == 'function' && !msep.addSourceBuffer078) {
                msep.addSourceBuffer078 = msep.addSourceBuffer;
                msep.addSourceBuffer = function (type, ...rest) {
                    if (typeof type === 'string' && type.includes("video/")) {
                        // Return a stub instead of undefined so the player's
                        // video track gets a real EventTarget and its segment
                        // state machine can advance on updateend events. This
                        // is required for manifestless live streams; harmless
                        // for VOD. The stub mirrors this MediaSource's audio
                        // SourceBuffer (captured below) for buffered/writeHead.
                        console.log("[yt-audio-only] Media Codec (stub):", type);
                        try {
                            return makeFakeVideoSourceBuffer(type, this);
                        } catch (e) {
                            console.warn("[yt-audio-only] fake video SB factory failed:", e);
                            return; // fall back to old behavior on error
                        }
                    }
                    const realSB = this.addSourceBuffer078(type, ...rest);
                    if (typeof type === 'string' && type.includes("audio/")) {
                        // Remember the real audio SourceBuffer on the owning
                        // MediaSource so the fake video SB created on the same
                        // MediaSource can mirror its buffered range + writeHead.
                        try { this.__ytAOAudioSB__ = realSB; } catch (e) { }
                    }
                    console.log("[yt-audio-only] Media Codec:", type, [...types]);
                    return realSB;
                };
            }


        };

        supportedFormatsConfig();


        ; (async () => {


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

            const getEntriesForPlayerInterfaces = (_yt_player) => {

                const entries = Object.entries(_yt_player);

                const arr = new Array(entries.length);
                let arrI = 0;

                for (const entry of entries) {
                    const [k, v] = entry;

                    const p = typeof v === 'function' ? v.prototype : 0;
                    if (p) {

                        const b = (
                            typeof p.cancelPlayback === 'function' ||
                            typeof p.stopVideo === 'function' ||
                            typeof p.pauseVideo === 'function' ||
                            typeof p.playVideo === 'function' ||
                            typeof p.getPlayerStateObject === 'function'
                        );
                        if (b) arr[arrI++] = entry;
                    }
                }

                arr.length = arrI;
                return arr;


            }


            const getKeyPlayerDap = (_yt_player, filteredEntries) => {
                // one is quu (this.app.getPlayerStateObject(p))
                // one is standardApp (return this.getPresentingPlayerType()===3?R$(this.C7).g7:g.O5(this,p).getPlayerState())


                const w = 'keyPlayerDap';

                let arr = [];
                let brr = new Map();

                for (const [k, v] of filteredEntries) {

                    const p = typeof v === 'function' ? v.prototype : 0;
                    if (p) {

                        let q = 0;

                        if (typeof p.cancelPlayback === 'function') q += 50;
                        if (typeof p.stopVideo === 'function') q += 50;
                        if (typeof p.pauseVideo === 'function') q += 50;
                        if (typeof p.playVideo === 'function') q += 50;
                        if (typeof p.getPlayerStateObject === 'function') q += 50;

                        if (q < 250) continue;

                        if (typeof p.cancelPlayback === 'function' && p.cancelPlayback.length === 0) q += 20;
                        if (typeof p.stopVideo === 'function' && p.stopVideo.length === 1) q += 20;
                        if (typeof p.pauseVideo === 'function' && p.pauseVideo.length === 1) q += 20;
                        if (typeof p.playVideo === 'function' && p.playVideo.length === 2) q += 20;
                        if (typeof p.getPlayerStateObject === 'function' && p.getPlayerStateObject.length === 1) q += 20;


                        if (typeof p.isBackground === 'function') q -= 5;
                        if (typeof p.isBackground === 'function' && p.isBackground.length === 0) q -= 2;

                        if (typeof p.getPlaybackRate === 'function') q += 25;
                        if (typeof p.getPlaybackRate === 'function' && p.getPlaybackRate.length === 0) q += 15;

                        if (typeof p.publish === 'function') q += 25;
                        if (typeof p.publish === 'function' && p.publish.length === 1) q += 15;

                        if (typeof p.addEventListener === 'function') q += 40;
                        if (typeof p.addEventListener === 'function' && p.addEventListener.length === 2) q += 25;
                        if (typeof p.removeEventListener === 'function') q += 40;
                        if (typeof p.removeEventListener === 'function' && p.removeEventListener.length === 2) q += 25;

                        if (q > 0) arr = addProtoToArr(_yt_player, k, arr) || arr;

                        if (q > 0) brr.set(k, q);

                    }


                }

                if (arr.length === 0) {

                    console.warn(`[yt-audio-only] (key-extraction) Key does not exist (1). [${w}]`);
                } else {

                    arr = arr.map(key => [key, (brr.get(key) || 0)]);

                    if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);

                    let match = null;
                    for (const [key, _] of arr) {
                        const p = _yt_player[key].prototype
                        const f = (p ? p.getPlayerStateObject : null) || 0;
                        if (f) {
                            const o = {};
                            const w = new Proxy({}, {
                                get(target, p) {
                                    o[p] = 1;
                                    return w;
                                },
                                set(target, p, v) {
                                    return true;
                                }
                            });
                            try {
                                f.call(w)
                            } catch (e) { }
                            if (o.app) {
                                match = key;
                            }
                        }
                    }


                    if (!match) {

                        console.warn(`[yt-audio-only] (key-extraction) Key does not exist (2). [${w}]`);

                    } else {
                        return match;
                    }

                }



            }

            const getKeyStandardApp = (_yt_player, filteredEntries) => {
                // one is quu (this.app.getPlayerStateObject(p))
                // one is standardApp (return this.getPresentingPlayerType()===3?R$(this.C7).g7:g.O5(this,p).getPlayerState())


                const w = 'keyStandardApp';

                let arr = [];
                let brr = new Map();

                for (const [k, v] of filteredEntries) {

                    const p = typeof v === 'function' ? v.prototype : 0;
                    if (p) {

                        let q = 0;

                        if (typeof p.cancelPlayback === 'function') q += 50;
                        if (typeof p.stopVideo === 'function') q += 50;
                        if (typeof p.pauseVideo === 'function') q += 50;
                        if (typeof p.playVideo === 'function') q += 50;
                        if (typeof p.getPlayerStateObject === 'function') q += 50;

                        if (q < 250) continue;

                        if (typeof p.cancelPlayback === 'function' && p.cancelPlayback.length === 2) q += 20;
                        if (typeof p.stopVideo === 'function' && p.stopVideo.length === 1) q += 20;
                        if (typeof p.pauseVideo === 'function' && p.pauseVideo.length === 2) q += 20;
                        if (typeof p.playVideo === 'function' && p.playVideo.length === 2) q += 20;
                        if (typeof p.getPlayerStateObject === 'function' && p.getPlayerStateObject.length === 1) q += 20;


                        if (typeof p.isBackground === 'function') q -= 5;
                        if (typeof p.isBackground === 'function' && p.isBackground.length === 0) q -= 2;

                        if (typeof p.getPlaybackRate === 'function') q -= 5;
                        if (typeof p.getPlaybackRate === 'function' && p.getPlaybackRate.length === 0) q -= 2;

                        if (typeof p.publish === 'function') q -= 5;
                        if (typeof p.publish === 'function' && p.publish.length === 2) q -= 2;

                        if (typeof p.addEventListener === 'function') q -= 5;
                        if (typeof p.addEventListener === 'function' && p.addEventListener.length === 2) q -= 2;
                        if (typeof p.removeEventListener === 'function') q -= 5;
                        if (typeof p.removeEventListener === 'function' && p.removeEventListener.length === 2) q -= 2;


                        if (q > 0) arr = addProtoToArr(_yt_player, k, arr) || arr;

                        if (q > 0) brr.set(k, q);

                    }


                }

                if (arr.length === 0) {

                    console.warn(`[yt-audio-only] (key-extraction) Key does not exist (1). [${w}]`);
                } else {

                    arr = arr.map(key => [key, (brr.get(key) || 0)]);

                    if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);

                    let match = null;
                    for (const [key, _] of arr) {
                        const p = _yt_player[key].prototype
                        const f = (p ? p.getPlayerStateObject : null) || 0;
                        if (f) {
                            const o = {};
                            const w = new Proxy({}, {
                                get(target, p) {
                                    o[p] = 1;
                                    return w;
                                },
                                set(target, p, v) {
                                    return true;
                                }
                            });
                            try {
                                f.call(w)
                            } catch (e) { }
                            if (!o.app) {
                                match = key;
                            }
                        }
                    }


                    if (!match) {

                        console.warn(`[yt-audio-only] (key-extraction) Key does not exist (2). [${w}]`);

                    } else {
                        return match;
                    }

                }



            }


            const getKeyInternalApp = (_yt_player, filteredEntries) => {
                // internalApp

                const w = 'keyInternalApp';

                let arr = [];
                let brr = new Map();

                for (const [k, v] of filteredEntries) {

                    const p = typeof v === 'function' ? v.prototype : 0;
                    if (p) {

                        let q = 0;

                        if (typeof p.stopVideo === 'function') q += 1;
                        if (typeof p.playVideo === 'function') q += 1;
                        if (typeof p.pauseVideo === 'function') q += 1;

                        if (q < 2) continue;

                        if (typeof p.isBackground === 'function') q += 120;
                        if (typeof p.getPlaybackRate === 'function') q += 50;
                        // if (typeof p.publish === 'function') q += 50;
                        if (typeof p.isAtLiveHead === 'function') q += 50;
                        if (typeof p.getVideoData === 'function') q += 10;
                        if (typeof p.getVolume === 'function') q += 10;
                        if (typeof p.getStreamTimeOffset === 'function') q += 10;
                        if (typeof p.getPlayerType === 'function') q += 10;
                        if (typeof p.getPlayerState === 'function') q += 10;
                        if (typeof p.getPlayerSize === 'function') q += 10;
                        if (typeof p.cancelPlayback === 'function') q -= 4;

                        if (q < 10) continue;

                        if ('mediaElement' in p) q += 50;
                        if ('videoData' in p) q += 50;
                        if ('visibility' in p) q += 50;

                        if (typeof p.isBackground === 'function' && p.isBackground.length === 0) q += 20;
                        if (typeof p.getPlaybackRate === 'function' && p.getPlaybackRate.length === 0) q += 20;
                        if (typeof p.publish === 'function' && p.publish.length === 2) q += 18;
                        if (typeof p.isAtLiveHead === 'function' && p.isAtLiveHead.length === 2) q += 18;

                        if (q > 0) arr = addProtoToArr(_yt_player, k, arr) || arr;

                        if (q > 0) brr.set(k, q);

                    }


                }

                if (arr.length === 0) {

                    console.warn(`[yt-audio-only] (key-extraction) Key does not exist. [${w}]`);
                } else {

                    arr = arr.map(key => [key, (brr.get(key) || 0)]);

                    if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);

                    if (arr.length > 2) console.log(`[yt-audio-only] (key-extraction) [${w}]`, arr);
                    return arr[0][0];
                }



            };


            (async () => {
                // rAf scheduling

                const _yt_player = await _yt_player_observable.obtain();

                if (!_yt_player || typeof _yt_player !== 'object') return;

                window.ktg = _yt_player;

                // console.log(keys0)

                const entriesForPlayerInterfaces = getEntriesForPlayerInterfaces(_yt_player);

                const keyPlayerDap = getKeyPlayerDap(_yt_player, entriesForPlayerInterfaces)
                const keyStandardApp = getKeyStandardApp(_yt_player, entriesForPlayerInterfaces)
                const keyInternalApp = getKeyInternalApp(_yt_player, entriesForPlayerInterfaces);

                console.log('[yt-audio-only] key obtained', [keyPlayerDap, keyStandardApp, keyInternalApp]);

                if (!keyPlayerDap || !keyStandardApp || !keyInternalApp) {
                    console.warn('[yt-audio-only] key failure', [keyPlayerDap, keyStandardApp, keyInternalApp]);
                }


                if (keyPlayerDap) {
                    const playerDapCT = _yt_player[keyPlayerDap];
                    if (typeof playerDapCT === 'function') {
                        const playerDapPT = playerDapCT.prototype;
                        playerDapPTFn(playerDapPT);
                    }
                }


                if (keyStandardApp) {
                    const standardAppCT = _yt_player[keyStandardApp];
                    if (typeof standardAppCT === 'function') {
                        const standardAppPT = standardAppCT.prototype;
                        standardAppPTFn(standardAppPT);
                    }
                }

                if (keyInternalApp) {
                    const internalAppCT = _yt_player[keyInternalApp];
                    if (typeof internalAppCT === 'function') {
                        const internalAppPT = internalAppCT.prototype;
                        internalAppPTFn(internalAppPT);
                    }
                }



            })();

        })();


        //# sourceURL=debug://userscript/yt-audio-only.js


    }

    const getVideoIdByURL = () => {
        // It's almost certainly going to stay at 11 characters. The individual characters come from a set of 64 possibilities (A-Za-z0-9_-).
        // base64 form; 26+26+10+2; 64^len
        // Math.pow(64,11) = 73786976294838210000

        const url = new URL(location.href);
        let m;

        if (m = /^\/watch\?v=([A-Za-z0-9_-]+)/.exec(`${url.pathname}?v=${url.searchParams.get('v')}`)) return `${m[1]}`;
        if (m = /^\/live\/([A-Za-z0-9_-]+)/.exec(url.pathname)) return `${m[1]}`;

        if (m = /^\/embed\/live_stream\?channel=([A-Za-z0-9_-]+)/.exec(`${url.pathname}?channel=${url.searchParams.get('channel')}`)) return `L:${m[1]}`;
        if (m = /^\/embed\/([A-Za-z0-9_-]+)/.exec(url.pathname)) return `${m[1]}`;

        if (m = /^\/channel\/([A-Za-z0-9_-]+)\/live\b/.exec(url.pathname)) return `L:${m[1]}`;
        if (url.hostname === 'youtu.be' && (m = /\/([A-Za-z0-9_-]+)/.exec(url.pathname))) return `${m[1]}`;

        return '';

    };

    const getVideoIdByElement = () => {
        const videoIdElements = [...document.querySelectorAll('[video-id]')].filter(v => !v.closest('[hidden]'));
        const videoId = videoIdElements.length > 0 ? videoIdElements[0].getAttribute('video-id') : null;
        return videoId || '';
    };

    const getEnableValue = async () => {
        const videoId = getVideoIdByURL() || getVideoIdByElement();
        const siteVal = videoId ? await GM.getValue(`isEnable_aWsjF_${videoId}`, null) : null;
        return (siteVal !== null) ? siteVal : await GM.getValue("isEnable_aWsjF", true);
    };

    const setEnableVal = async (val) => {
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
        // const element = document.createElement('button');
        // element.setAttribute('onclick', createHTML(`(${pageInjectionCode})()`));
        // element.click();
        GM_addElement(document.head || document.documentElement, "script", {textContent: `(${pageInjectionCode})()`});
    }

    GM_registerMenuCommand(`Turn ${isEnable ? 'OFF' : 'ON'} YouTube Audio Mode`, async function () {
        await setEnableVal(!isEnable);
        await GM.setValue('lastCheck_bWsm5', Date.now());
        document.documentElement.setAttribute('forceRefresh032', '');
        location.reload();
    });

    let messageCount = 0;
    let busy = false;
    winAddEventListener('message', (evt) => {

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
            winAddEventListener("DOMContentLoaded", resolve, false);
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
        if (!parentNode) return;
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
        if (newBtn instanceof HTMLElement) {
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

            #movie_player > .html5-video-container:not(:empty),
            #masthead-player > .html5-video-container:not(:empty) {
                box-sizing: border-box;
                height: 100%;
            }

            #movie_player [style*="--audio-only-thumbnail-image"] ~ .ytp-cued-thumbnail-overlay > .ytp-cued-thumbnail-overlay-image[style*="background-image"],
            #masthead-player [style*="--audio-only-thumbnail-image"] ~ .ytp-cued-thumbnail-overlay > .ytp-cued-thumbnail-overlay-image[style*="background-image"] {
                opacity: 0;
            }

            #movie_player [style*="--audio-only-thumbnail-image"]::before,
            #masthead-player [style*="--audio-only-thumbnail-image"]::before {
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


            #movie_player.playing-mode [style*="--audio-only-thumbnail-image"],
            #masthead-player.playing-mode [style*="--audio-only-thumbnail-image"] {
                /* animation: blinker-fmw83 1.74s linear infinite; */
                --fmw83-opacity: 0.6;

            }

            #global-loader ytw-scrim {
                display: none;
            }

            yt-player-storyboard img {
                display: none;
            }

            yt-player-storyboard .ytPlayerStoryboardStoryboardImageWrapper {
                display: none;
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
        const setGV = async (val) => {

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
