// ==UserScript==
// @name                YouTube Music: Audio Only
// @description         No Video Streaming
// @description:en      No Video Streaming
// @description:ja      No Video Streaming
// @description:zh-TW   No Video Streaming
// @description:zh-CN   No Video Streaming
// @namespace           UserScript
// @version             0.1.17
// @author              CY Fung
// @match               https://music.youtube.com/*
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

        const A_D_B_Y_PASS = true;

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
                            console.log(e);
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

        if (!Object.defineProperty322 && typeof Object.defineProperty === 'function' && Object.defineProperty.length === 3) {
            // _definePropertyAccessor
            Object.defineProperty322 = Object.defineProperty;
            const st = new Set(
                [
                    'videoMode', 'hasAvSwitcher', 'isVideo',
                    'playbackMode', 'selectedItemHasVideo'
                ]
            );
            const defineProperty322 = Object.defineProperty322;
            if (defineProperty322) {

                Object.defineProperty = function (o, k, t) {
                    if (typeof o.is === 'string') {
                        if (!('configurable' in t) && typeof t.get === 'function' && typeof t.set === 'function') {
                            t.configurable = true;
                            if (st.has(k)) {
                                t.set = function (e) {
                                    this._setPendingProperty(k, e, !0) && this._invalidateProperties()
                                }
                            }
                        }
                    }
                    return defineProperty322(o, k, t);
                }
            }
        }

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



        let cw = 0;
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

        const avFix = async () => {

            // if (cw < 6) cw = 6;

            // const config_ = typeof yt !== 'undefined' ? (yt || 0).config_ : 0;
            // ytConfigFix(config_);


            const songImageThumbnail = document.querySelector('#song-image #thumbnail');
            if (songImageThumbnail) {

                if (songImageThumbnail.getAttribute('object-fit') !== 'CONTAIN') songImageThumbnail.setAttribute('object-fit', 'CONTAIN');

                mo2.observe(songImageThumbnail, { attributes: true });

                const img = HTMLElement.prototype.querySelector.call(songImageThumbnail, 'img#img[src]');
                if (img) {

                    mo2.observe(img, { attributes: true });

                    const src = img.getAttribute('src');

                    let nSrc = fixThumbnailURL(src);
                    if (nSrc !== src && nSrc && src) {
                        // https://i.ytimg.com/vi/gcCqclvIcn4/sddefault.jpg?sqp=-oa&rs=A
                        // https://i.ytimg.com/vi/gcCqclvIcn4/sddefault.jpg
                        img.setAttribute('src', nSrc)
                    }

                    /*
                    iurl: "default.jpg",
                    iurlmq: "mqdefault.jpg",
                    iurlhq: "hqdefault.jpg",
                    iurlsd: "sddefault.jpg",
                    iurlpop1: "pop1.jpg",
                    iurlpop2: "pop2.jpg",
                    iurlhq720: "hq720.jpg",
                    iurlmaxres: "maxresdefault.jpg"
                    */

                }

            }

            for (const s of document.querySelectorAll('[playback-mode][selected-item-has-video]')) {
                s.removeAttribute('selected-item-has-video');
            }

            for (const s of document.querySelectorAll('ytmusic-player-page')) {
                // s.setAttribute('has-av-switcher', '')
                s.removeAttribute('has-av-switcher')
            }

            for (const s of document.querySelectorAll('[video-mode]')) {
                s.removeAttribute('video-mode')
            }

            for (const ytElement of document.querySelectorAll('ytmusic-player-page')) {
                if (ytElement.is === 'ytmusic-player-page') {
                    mo2.observe(ytElement, { attributes: true });

                    const cnt = insp(ytElement);

                    const cProto = cnt.constructor.prototype;

                    if (!cProto.setFn322) {
                        cProto.setFn322 = function () {
                            if (this.videoMode === true) this.videoMode = false;
                            // if (this.hasAvSwitcher === false) this.hasAvSwitcher = true;
                            if (this.hasAvSwitcher === true) this.hasAvSwitcher = false;
                        }
                    }

                    if (typeof cProto.computeShowAvSwitcher === 'function' && !cProto.computeShowAvSwitcher322) {
                        cProto.computeShowAvSwitcher322 = cProto.computeShowAvSwitcher;
                        cProto.computeShowAvSwitcher = function () {
                            this.setFn322();
                            return this.computeShowAvSwitcher322(...arguments);
                        }
                    }


                    cnt.setFn322();
                }
            }


            for (const ytElement of document.querySelectorAll('ytmusic-av-toggle')) {
                if (ytElement.is === 'ytmusic-av-toggle') {
                    mo2.observe(ytElement, { attributes: true });

                    const cnt = insp(ytElement);
                    // cnt.toggleDisabled = false;
                    const cProto = cnt.constructor.prototype;

                    if (!cProto.setFn322) {
                        cProto.setFn322 = function () {
                            if (this.mustPlayAudioOnly === false) this.mustPlayAudioOnly = true;
                            // if(this.isVideo === true) this.isVideo = false;
                            // if(this.playbackMode !== 'ATV_PREFERRED') this.playbackMode = 'ATV_PREFERRED';
                            if (this.selectedItemHasVideo === true) this.selectedItemHasVideo = false;
                        }
                    }

                    if (typeof cProto.computeToggleDisabled === 'function' && !cProto.computeToggleDisabled322) {
                        cProto.computeToggleDisabled322 = cProto.computeToggleDisabled;
                        cProto.computeToggleDisabled = function () {
                            this.setFn322();
                            return this.computeToggleDisabled322(...arguments);
                        }
                    }


                    cnt.setFn322();
                    // cnt.computeToggleDisabled = ()=>{};
                    // if(cnt.isVideo === true) cnt.isVideo = false;
                    // cnt.mustPlayAudioOnly = false;
                    // cnt.playbackMode = 'ATV_PREFERRED';
                    // if(cnt.selectedItemHasVideo === true) cnt.selectedItemHasVideo = false;

                    if (!cnt.onVideoAvToggleTap322 && typeof cnt.onVideoAvToggleTap === 'function' && cnt.onVideoAvToggleTap.length === 0) {
                        cnt.onVideoAvToggleTap322 = cnt.onVideoAvToggleTap;
                        cnt.onVideoAvToggleTap = function () {

                            const pr = new Proxy(this, {
                                get(target, prop) {
                                    // if (prop === 'mustPlayAudioOnly') return true;
                                    // if (prop === 'playbackMode') return 'NONE';
                                    if (prop === 'selectedItemHasVideo') return false;
                                    // if (prop === 'isVideo') return false;
                                    let v = target[prop];
                                    // if (typeof v === 'function') return () => { };
                                    return v;
                                },
                                set(target, prop, value) {
                                    return true;
                                }
                            });

                            this.onVideoAvToggleTap322.call(pr);

                        }
                    }


                    if (!cnt.onSongAvToggleTap322 && typeof cnt.onSongAvToggleTap === 'function' && cnt.onSongAvToggleTap.length === 0) {
                        cnt.onSongAvToggleTap322 = cnt.onSongAvToggleTap;
                        cnt.onSongAvToggleTap = function () {

                            const pr = new Proxy(this, {
                                get(target, prop) {
                                    // if (prop === 'mustPlayAudioOnly') return true;
                                    // if (prop === 'playbackMode') return 'NONE';
                                    if (prop === 'selectedItemHasVideo') return false;
                                    // if (prop === 'isVideo') return false;
                                    let v = target[prop];
                                    // if (typeof v === 'function') return () => { };
                                    return v;
                                },
                                set(target, prop, value) {
                                    return true;
                                }
                            });

                            this.onSongAvToggleTap322.call(pr);

                        }
                    }
                    cnt.onSongAvToggleTap();
                    // cnt.playbackMode = 'ATV_PREFERRED';

                }
            }

            if (A_D_B_Y_PASS) Promise.resolve().then(() => {
                // skip a$d.s

                const isAdsPlaying = document.querySelector('[is-advertisement-playing]');
                if (isAdsPlaying && !isAdsPlaying.querySelector('img[src]')) {
                    const audios = document.querySelectorAll('audio');
                    if (audios.length === 1 && audios[0].paused === false && audios[0].currentTime > 0 && audios[0].duration > audios[0].currentTime) audios[0].playbackRate = 15 - Math.random() * 0.04;
                }

            }).catch(console.warn);

        }

        const mo = new MutationObserver(() => {
            if (cw > 0) {
                cw--;
                avFix();
            }
        });

        mo.observe(document, { childList: true, subtree: true });


        const mo2 = new MutationObserver(() => {
            if (cw < 1) cw = 1;
            if (cw > 0) {
                cw--;
                avFix();
            }
        });




        document.addEventListener('fullscreenchange', () => {
            if (cw < 3) cw = 3;
        });

        document.addEventListener('yt-navigate-start', () => {
            if (cw < 3) cw = 3;
        });

        document.addEventListener('yt-navigate-finish', () => {
            if (cw < 6) cw = 6;
            avFix();
        });

        document.addEventListener('yt-navigate-cache', () => {
            if (cw < 3) cw = 3;
        });


        window.addEventListener("updateui", function () {
            if (cw < 3) cw = 3;
        });

        window.addEventListener("resize", () => {
            if (cw < 3) cw = 3;
        });
        window.addEventListener("state-navigatestart", function () {
            if (cw < 3) cw = 3;
        });
        window.addEventListener("state-navigateend", () => {
            if (cw < 6) cw = 6;
            avFix();
        })


        let cv = null;
        document.addEventListener('durationchange', (evt) => {
            const target = (evt || 0).target;
            if (!(target instanceof HTMLMediaElement)) return;
            const targetClassList = target.classList || 0;
            const isPlayerVideo = typeof targetClassList.contains === 'function' ? targetClassList.contains('video-stream') && targetClassList.contains('html5-main-video') : false;

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

                if (cw < 6) cw = 6;
                avFix();


            }
        }, true);



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

        // supportedFormatsConfig(); // avoid issue due to failure on only video source (like ads)
    }

    const isEnable = (typeof GM !== 'undefined' && typeof GM.getValue === 'function') ? (await GM.getValue("isEnable_aWsjF", true)) : null;
    if (typeof isEnable !== 'boolean') throw new DOMException("Please Update your browser", "NotSupportedError");
    if (isEnable) {
        const element = document.createElement('button');
        element.setAttribute('onclick', createHTML(`(${pageInjectionCode})()`));
        element.click();
    }

    GM_registerMenuCommand(`Turn ${isEnable ? 'OFF' : 'ON'} YouTube Audio Mode`, async function () {
        await GM.setValue("isEnable_aWsjF", !isEnable);
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

        const btn = target.closest('[role="option"]');
        if (!btn) return;
        if (btn.parentNode.querySelector('[role="option"].audio-only-toggle-btn')) return;
        document.documentElement.classList.add('with-audio-only-toggle-btn');
        const newBtn = btn.cloneNode(true);
        const h = () => {
            newBtn.classList.remove('iron-selected');
            newBtn.classList.remove('focused');
            newBtn.removeAttribute('iron-selected');
            newBtn.removeAttribute('focused');
            let a = newBtn.querySelector('a');
            if (a) a.removeAttribute('href');
            newBtn.classList.add('audio-only-toggle-btn');
        }
        h();
        async function reloadPage() {
            await GM.setValue("isEnable_aWsjF", !isEnable);
            document.documentElement.setAttribute('forceRefresh032', '');
            location.reload();
        }
        newBtn.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            reloadPage();
        }, true);
        btn.parentNode.insertBefore(newBtn, null);
        // let t;
        // let h = 0;
        // t = btn.closest('.ytp-panel-menu[style*="height"]');
        // if (t) t.style.height = t.scrollHeight + 'px';
        // t = btn.closest('.ytp-panel[style*="height"]');
        // if (t) t.style.height = (h = t.scrollHeight) + 'px';
        // t = btn.closest('.ytp-popup.ytp-contextmenu[style*="height"]');
        // if (t && h > 0) t.style.height = h + 'px';

        const f = () => {
            h();
            const mx = newBtn.querySelector('yt-formatted-string');
            if (mx) {
                mx.removeAttribute('is-empty');
                mx.textContent = `Turn ${isEnable ? 'OFF' : 'ON'} YouTube Audio Mode`;
            }
            let t;
            t = btn.closest('ytmusic-menu-popup-renderer[style*="max-height"]');
            if (t) t.style.maxHeight = t.scrollHeight + 'px';
        }
        f();
        setTimeout(f, 40);


    }


    function mobileMenuItemAppearedFn(target) {

    }


    pLoad.then(() => {

        document.addEventListener('animationstart', (evt) => {
            const animationName = evt.animationName;
            if (!animationName) return;

            if (animationName === 'contextmenuInfoItemAppeared') contextmenuInfoItemAppearedFn(evt.target);
            if (animationName === 'mobileMenuItemAppeared') mobileMenuItemAppearedFn(evt.target);

        }, true);


        const style = document.createElement('style');
        style.id = 'fm9v0';
        style.textContent = `

        .html5-video-player {
            background-color: black;
        }

        #song-image.ytmusic-player {
            background-color: black;
        }

        ytmusic-player-page:not([player-fullscreened]) #main-panel.style-scope.ytmusic-player-page[style*="padding"] {
            padding: 0px 0px !important;
            box-sizing: border-box;
        }

        ytmusic-player-page:not([player-fullscreened]) ytmusic-player#player.style-scope.ytmusic-player-page {
            max-height: 100%;
            margin-top: calc(-1*var(--ytmusic-player-page-vertical-padding));
            box-sizing: border-box;
        }

        /* #movie_player > .ytp-iv-video-content {
            pointer-events: none; // allow clicking
        } */

        #movie_player > .html5-video-container:not(:empty) {
            box-sizing: border-box;
            height: 100%;
        }

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
       ytmusic-popup-container.ytmusic-app ytmusic-menu-popup-renderer tp-yt-paper-listbox > [role="option"]:first-child {
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
    })


})();
