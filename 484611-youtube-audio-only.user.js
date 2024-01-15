// ==UserScript==
// @name                YouTube: Audio Only
// @description         No Video Streaming
// @namespace           UserScript
// @version             1.1.5
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


    const pageInjectionCode = function () {

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



        // const observablePromise = (proc, timeoutPromise) => {
        //   let promise = null;
        //   return {
        //     obtain() {
        //       if (!promise) {
        //         promise = new Promise(resolve => {
        //           let mo = null;
        //           const f = () => {
        //             let t = proc();
        //             if (t) {
        //               mo.disconnect();
        //               mo.takeRecords();
        //               mo = null;
        //               resolve(t);
        //             }
        //           }
        //           mo = new MutationObserver(f);
        //           mo.observe(document, { subtree: true, childList: true })
        //           f();
        //           timeoutPromise && timeoutPromise.then(() => {
        //             resolve(null)
        //           });
        //         });
        //       }
        //       return promise
        //     }
        //   }
        // }


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

        // let vcc = 0;
        // let vdd = -1;

        let u33 = null;
        let fa = 0;
        let maj = 0;

        let cv = null;
        document.addEventListener('durationchange', (evt) => {
            const target = (evt || 0).target;
            if (!(target instanceof HTMLMediaElement)) return;

            if (target.classList.contains('video-stream') && target.classList.contains('html5-main-video')) {


                if (target.readyState !== 1) {
                    fa = 1;
                } else {
                    fa = 2;
                }


                // if (target.readyState === 1) {

                    // vcc++;

                // }
                if (target.readyState === 1 && target.networkState === 2) {
                    target.__spfgs__ = true;
                    if (u33) {
                        u33.resolve();
                        u33 = null;
                    }
                    if (cv) {
                        cv.resolve();
                        cv = null;
                    }
                } else {
                    target.__spfgs__ = false;

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

        let clickLockFn = null;
        let clickTarget = null;
        if (location.origin === 'https://m.youtube.com') {

            // const s1 = Symbol();
            // const s2 = Symbol();

            // Object.defineProperty(Object.prototype, 'videox', {
            //   get(){

            //     // let r = this[s1] || this.audio;

            //     // if(r && !r.isHdr){
            //     //   r.isHdr = function(){
            //     //     return false;
            //     //   }
            //     // }

            //     // return r;
            //     return undefined;
            //   },
            //   set(nv){
            //     this[s1]= nv;
            //     return true;

            //   },
            //   enumerable: false,
            //   configurable: true

            // });


            /*
                  Object.defineProperty(Object.prototype, 'videoTrack', {
                    get(){

                      return this[s2] || this.audioTrack;
                    },
                    set(nv){
                      this[s2]= nv;
                      return true;

                    },
                    enumerable: false,
                    configurable: true

                  });
                  */


            EventTarget.prototype.addEventListener322 = EventTarget.prototype.addEventListener;

            const dummyFn = () => { };
            EventTarget.prototype.addEventListener = function (evt, fn, opts) {


                let hn = fn;

                if (evt === 'player-error') {
                    // hn = function (evt) {

                    //     const err = evt.detail || 0;
                    //     if (err.errorCode === 5) {


                    //         console.log("4411", err)
                    //         debugger
                    //         return;
                    //     }

                    //     fn.call(this, evt);
                    // }

                } else if (evt === 'player-detailed-error') {
                    // hn = function (evt) {

                    //     if (evt.detail && typeof evt.detail === 'object') {

                    //         let key = Object.keys(evt.detail)[0];
                    //         if (key && evt.detail[key]) {

                    //             const err = evt.detail[key]
                    //             if (err.errorCode === 'player.exception' && err.messageKey === 'GENERIC_WITHOUT_LINK') {
                    //                 console.log("4422", err)
                    //                 return;
                    //             }
                    //         }

                    //     }

                    //     fn.call(this, evt);
                    // }
                } else if (evt === 'video-data-change') {
                    // hn = function (evt) {

                    //     if (maj > 0 && Date.now() - maj < 80) {


                    //     } else {
                    //         if (maj) return;
                    //         maj = Date.now();
                    //     }

                    //     fn.call(this, evt);
                    // }
                    // evt+='y'
                } else if (evt === 'player-state-change') {
                    // evt+='y'
                } else if (evt === 'player-autonav-pause' || evt === 'visibilitychange') {
                    evt += 'y'
                    fn = dummyFn;
                } else if (evt === 'click' && this.id === 'movie_player') {


                    clickLockFn = fn; clickTarget = this;
                    //   hn = function (e) {

                    //     // console.log(22 ,  e)
                    //     // console.log(433, e.type, e.detail, fn);
                    //     // window.em33 =  true;
                    //     //             if(e && e.type !=='updateui' && e.type!=='success' && e.type!==''){
                    //     //             console.log(433, e.type, e.detail);

                    //     //             }
                    //     return fn.apply(this, arguments)
                    //   }

                }

                /*

                if(evt ==='player-state-change' || evt == "player-autonav-pause" || evt === "video-data-change" || evt === "state-navigatestart"){

                  hn = function(){

                    let e = arguments[0];
                    if(e){
                    console.log(213, e.type, e.detail);

                    }
                    return fn.apply(this,  arguments)
                  }
                }
                */

                return this.addEventListener322(evt, hn, opts)

            }

            /*
            const XMLHttpRequest_ = XMLHttpRequest;

            (() => {
              XMLHttpRequest = class XMLHttpRequest extends XMLHttpRequest_ {
                constructor(...args) {
                  super(...args);
                }
                open(method, url, ...args) {

                  if (typeof url === 'string' && url.length > 24 && url.includes('/videoplayback?') && url.replace('?', '&').includes('&source=')) {
                    if (vcc !== vdd) {
                      vdd = vcc;
                      window.postMessage({ ZECxh: url.includes('source=yt_live_broadcast') }, "*");
                    }
                  }
                  return super.open(method, url, ...args)
                }
              }
            })();
            */
        }



        (() => {


            XMLHttpRequest = (() => {

                const XMLHttpRequest_ = XMLHttpRequest;

                if (XMLHttpRequest_.i9bnj) return XMLHttpRequest_;

                const url0 = createObjectURL(new Blob([], { type: 'text/plain' }));

                return class XMLHttpRequest extends XMLHttpRequest_ {
                    constructor(...args) {
                        super(...args);
                    }
                    open(method, url, ...args) {
                        let skip = false;

                        if (!url || typeof url !== 'string') skip = true;

                        if (typeof url === 'string') {
                            let turl = url[0] === '/' ? `.youtube.com${url}` : `${url}`;
                            if (turl.includes('googleads') || turl.includes('doubleclick.net')) {
                                skip = true;
                                // } else if (turl.includes('.youtube.com/generate_204')) {
                                // skip = true;
                            } else if (turl.includes('.youtube.com/pagead/')) {
                                skip = true;
                            } else if (turl.includes('.youtube.com/ptracking')) {
                                skip = true;
                            } else if (turl.includes('.youtube.com/api/stats/')) { // /api/stats/
                                skip = true;
                            } else if (turl.includes('play.google.com/log')) {
                                skip = true;
                            } else if (turl.includes('.youtube.com//?')) { // //?cpn=
                                skip = true;
                            }
                        }
                        // if(typeof method =='string'&& method.toUpperCase() ==='GET' && skip) skip = true;
                        // else skip = false;
                        if (!skip) {
                            // console.log(322, url)
                            this.__xmMc8__ = 1;
                            super.open(method, url, ...args);
                        } else {
                            this.__xmMc8__ = 2;
                            super.open('GET', url0);
                        }
                    }
                    send(...args) {
                        if (this.__xmMc8__ === 1) {
                            super.send(...args);
                        } else if (this.__xmMc8__ === 2) {
                            super.send();
                        }

                    }
                }

            })();
            XMLHttpRequest.i9bnj = 1;

            const s7 = Symbol();
            const f7 = () => true;


            !Object.canRetry9048 && generalRegister('canRetry', s7, (p) => {
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
            Object.canRetry9048 = 1;

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


            // const getZq = (_yt_player) => {

            //   const w = 'Zq';

            //   let arr = [];

            //   for (const [k, v] of Object.entries(_yt_player)) {

            //     const p = typeof v === 'function' ? v.prototype : 0;
            //     if (p
            //       // && typeof p.canRetry === 'function'
            //       // && typeof p.dispose === 'function'
            //       && typeof p.onStateChange === 'function'

            //     ) {
            //       arr = addProtoToArr(_yt_player, k, arr) || arr;


            //     }

            //   }

            //   console.log(299, arr)
            //   if (arr.length === 0) {

            //     console.warn(`Key does not exist. [${w}]`);
            //   } else {

            //     console.log(`[${w}]`, arr);
            //     return arr[0];
            //   }




            // }

            // (location.origin ==='https://www.youtube.com' ? document : window).addEventListener( location.origin ==='https://www.youtube.com' ? 'yt-action' : 'state-navigateend', ()=>{

            //   let arr = [];
            //   if (typeof _yt_player !== 'undefined' && _yt_player && typeof _yt_player === 'object') {

            //     for (const [k, v] of Object.entries(_yt_player)) {

            //       if (typeof v === 'function'
            //       //  && typeof v.prototype.canRetry === 'function'
            //         // && typeof v.prototype.dispose === 'function'
            //          && typeof v.prototype.onStateChange === 'function'


            //       ) {
            //         arr.push(k);

            //       }

            //     }
            //     getZq(_yt_player);

            //   }
            //   console.log(277, arr, typeof _yt_player);
            // }, {once: true, passive: true, capture: true})

        })();

        // const waitFor = (checker, ms) => {

        //     return new Promise(resolve => {

        //         let cid = setInterval(() => {
        //             if (!cid) return;
        //             let r = checker();
        //             if (r) {
        //                 clearInterval(cid);
        //                 cid = 0;
        //                 resolve(r);
        //             }
        //         }, ms);

        //     }).catch(console.warn)

        // };

        if (location.origin === 'https://www.youtube.com') {

            document.addEventListener('yt-action', () => {


                let configs = yt.config_ || 0;
                configs = configs.WEB_PLAYER_CONTEXT_CONFIGS || {};
                for (const [key, entry] of Object.entries(configs)) {

                    if (entry && typeof entry.serializedExperimentFlags === 'string') {
                        // prevent idle playback failure
                        entry.serializedExperimentFlags = entry.serializedExperimentFlags.replace(/\b(html5_check_for_idle_network_interval_ms|html5_trigger_loader_when_idle_network|html5_sabr_fetch_on_idle_network_preloaded_players|html5_autonav_cap_idle_secs|html5_autonav_quality_cap|html5_disable_client_autonav_cap_for_onesie|html5_idle_rate_limit_ms|html5_sabr_fetch_on_idle_network_preloaded_players|html5_webpo_idle_priority_job|html5_server_playback_start_policy|html5_check_video_data_errors_before_playback_start|html5_check_unstarted|html5_check_queue_on_data_loaded)=([-_\w]+)(\&|$)/g, (_, a, b, c) => {
                            return a + '00' + '=' + b + c;
                        });

                    }

                }



            }, { once: true, passive: true, capture: true })


            // console.log(1882)
            const playerAsync_ = window.playerAsync_ || (window.playerAsync_ = new Promise(resolve => {

                customElements.whenDefined('ytd-player').then(() => {
                    // console.log(1883)

                    const dummy = document.createElement('ytd-player');
                    const cnt = insp(dummy);
                    const cProto = cnt.constructor.prototype;
                    cProto.createMainAppPlayer932_ = cProto.createMainAppPlayer_;
                    cProto.initPlayer932_ = cProto.initPlayer_;

                    cProto.createMainAppPlayer_ = function (a, b, c) {
                        let r = this.createMainAppPlayer932_(a, b, c);
                        try {
                            this.mainAppPlayer_.api.then(function (e) {
                                resolve(e)
                            })
                        } finally {
                            return r;
                        }
                    }
                    cProto.initPlayer_ = function (a) {
                        let r = this.initPlayer932_(a);
                        try {
                            r.then(() => {
                                resolve(this.player_)
                            })
                        } finally {
                            return r;
                        }
                    }


                })


            }));


            // let pw = null;
            const playerAsyncControlled_ = (async () => {
                try {
                    const player_ = await playerAsync_.then();
                    const elm = [...document.querySelectorAll('ytd-player')].filter(e => !e.closest('[hidden]'))[0]
                    if (!elm) return player_;
                    const asyncStateChange = async (audio, k) => {
                        try {
                            // console.log(292, !!pw, k===-1, player_.getPlayerState()  == -1);
                            // if (pw) {
                            //     pw.resolve();
                            // }
                            // pw = new PromiseExternal();

                            let ns23 = audio.networkState == 2 || audio.networkState == 3;
                            if (k === 3 && player_.getPlayerState() === 3 && audio.readyState === 1 && ns23 && audio.muted === false) {
                                await player_.seekToStreamTime();
                                await player_.seekToLiveHead();
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === false) {

                                // console.log(1201)
                                await delayPn(60);
                                // console.log(1202, player_.getPlayerState() ,  audio.readyState , ns23, audio.paused === false, audio.muted === false)

                                if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.paused === false && audio.muted === false) {
                                    // pw = pw || new PromiseExternal();
                                    // const pw0 = pw;
                                    if (!player_.isAtLiveHead()) {
                                        await delayPn(60);
                                        // await player_.seekToLiveHead(); await delayPn(9);
                                        await player_.seekToStreamTime();
                                        await player_.seekToLiveHead();
                                        await delayPn(60);
                                    }
                                    while (audio.readyState === 0) {
                                        await player_.cancelPlayback();
                                        await player_.pauseVideo();
                                        await player_.playVideo(); await delayPn(60);
                                    }
                                    if (!player_.isAtLiveHead()) {
                                        await delayPn(60);
                                        // await player_.seekToLiveHead(); await delayPn(9);
                                        await player_.seekToStreamTime();
                                        await player_.seekToLiveHead();
                                        await delayPn(60);
                                    }
                                }

                            }

                        } catch (e) {
                            console.log(e)
                        }

                    };

                    // console.log(299, player_)
                    let qz = (k) => {
                        try {
                            if (k >= 0 && k === player_.getPlayerState()) {
                                const audio = HTMLElement.prototype.querySelector.call(elm, '.video-stream.html5-main-video');
                                if (audio) asyncStateChange(audio, k);
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    };

                    player_.addEventListener('onStateChange', qz);
                    const state0 = player_.getPlayerState();
                    if (typeof state0 === 'number') {
                        qz(state0);
                    }

                    player_.addEventListener('onVideoProgress', ()=>{
                        Promise.resolve().then(()=>{
                            player_.updateLastActiveTime();
                        });
                    });




                    return player_;


                } catch (e) {
                    console.log(e)
                }

            })();


            // document.addEventListener('yt-navigate-finish', async () => {
            //   try{

            //   const player_ = await playerAsyncControlled_.then();

            //   const fn = () => {

            //     const elm = document.querySelector('ytd-player#ytd-player');
            //     if (!elm) return;
            //     const cnt = insp(elm);
            //     if (!cnt) return;

            //     if (!cnt.player_) return;
            //     if (!cnt.player_.playVideo) return;

            //     return { elm, cnt };
            //   }
            //   let o = fn();
            //   if (!o) {
            //     o = await observablePromise(fn).obtain()
            //   }

            //   const { cnt, elm } = o;
            //   return;

            //   const audio = HTMLElement.prototype.querySelector.call(elm, '.video-stream.html5-main-video');
            //   if(!audio) return;

            //   if(player_.getPlayerState() === 3 && audio.readyState === 1 && audio.networkState === 2 && !audio.paused && !audio.muted){

            //   }else if(player_.getPlayerState() === 3 && audio.readyState === 0 && audio.networkState === 2 && !audio.paused && !audio.muted){

            //     if (audio.__spfgs__ !== true) { // undefined or false
            //       u33 = new PromiseExternal();
            //       await u33.then();
            //     }
            //     await waitFor(() => {
            //       return audio.readyState === 1 && audio.networkState === 2 && !audio.paused && !audio.muted
            //     }, 9);
            //   } else{
            //     return;
            //   }


            //   if (player_.getPlayerState() !== 3 || !audio.isConnected) return;

            //   console.log('x02', audio.readyState, audio.networkState, audio.paused, audio.muted) //  1 2 t f

            //   await player_.cancelPlayback();

            //   await waitFor(() => {
            //     return audio.readyState === 1 && audio.networkState === 2 && audio.paused && !audio.muted
            //   }, 9);

            //   console.log('x03', audio.readyState, audio.networkState, audio.paused, audio.muted) //  1 2 t f
            //   // await new Promise(resolve => window.setTimeout(resolve, 1));

            //   // console.log('x04', audio.readyState, audio.networkState, audio.paused, audio.muted) //  1 2 t f
            //   await player_.playVideo();

            //   await waitFor(() => {
            //     return audio.readyState === 1 && audio.networkState === 2 && !audio.paused && !audio.muted
            //   }, 9);

            //   console.log('x04', audio.readyState, audio.networkState, audio.paused, audio.muted) //  1 2 f f

            //   return;
            //   if (player_.getPlayerState() === 3) {
            //     const audio = HTMLElement.prototype.querySelector.call(elm, '.video-stream.html5-main-video');
            //     console.log('x01', audio.readyState, audio.networkState, audio.paused, audio.muted) //  0 2 f f
            //     if (audio.__spfgs__ !== true) { // undefined or false
            //       u33 = new PromiseExternal();
            //       await u33.then();
            //     }
            //     await waitFor(() => {
            //       return audio.readyState === 1 && audio.networkState === 2 && !audio.paused && !audio.muted
            //     }, 9);

            //     console.log('x02', audio.readyState, audio.networkState, audio.paused, audio.muted) //  1 2 f f
            //     if (player_.getPlayerState() !== 3 || !audio.isConnected) return;
            //     if (audio && audio.__spfgs__ === true) {
            //       await player_.cancelPlayback();

            //       await waitFor(() => {
            //         return audio.readyState === 1 && audio.networkState === 2 && audio.paused && !audio.muted
            //       }, 9);

            //       console.log('x03', audio.readyState, audio.networkState, audio.paused, audio.muted) //  1 2 t f
            //       // await new Promise(resolve => window.setTimeout(resolve, 1));

            //       // console.log('x04', audio.readyState, audio.networkState, audio.paused, audio.muted) //  1 2 t f
            //       await player_.playVideo();

            //       await waitFor(() => {
            //         return audio.readyState === 1 && audio.networkState === 2 && !audio.paused && !audio.muted
            //       }, 9);

            //       console.log('x04', audio.readyState, audio.networkState, audio.paused, audio.muted) //  1 2 f f

            //     }
            //   }

            // }catch(e){
            //   console.log(e)
            // }

            // });

        } else if (location.origin === 'https://m.youtube.com') {

            // let pw = null;
            (async () => {
                try {
                    let player_;
                    let elm;
                    const asyncStateChange = async (audio, k) => {
                        try {
                            if(!player_ || !elm || typeof player_.getPlayerState !=='function') return;
                            // console.log(292, !!pw, k===-1, player_.getPlayerState()  == -1);
                            // if (pw) {
                            //     pw.resolve();
                            // }
                            // pw = new PromiseExternal();

                            let ns23 = audio.networkState == 2 || audio.networkState == 3
                            console.log(127001, k, player_.getPlayerState(), audio.readyState, ns23, audio.muted)

                            if (k === 3 && player_.getPlayerState() === 3 && audio.readyState === 1 && ns23 && audio.muted === false) {
                                await player_.seekToStreamTime();
                                await player_.seekToLiveHead();
                            } else if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.muted === false) {

                                // console.log(1201)
                                await delayPn(60);
                                // console.log(1202, player_.getPlayerState() ,  audio.readyState , ns23, audio.paused === false, audio.muted === false)

                                console.log(127002, k, player_.getPlayerState(), audio.readyState, ns23, audio.muted)
                                if (k === 3 && player_.getPlayerState() === 3 && audio.readyState == 0 && ns23 && audio.paused === false && audio.muted === false) {
                                    // pw = pw || new PromiseExternal();
                                    // const pw0 = pw;

                                    console.log(127003)
                                    if (!player_.isAtLiveHead()) {
                                        await delayPn(60);
                                        // await player_.seekToLiveHead(); await delayPn(9);
                                        await player_.seekToStreamTime();
                                        await player_.seekToLiveHead();
                                        await delayPn(60);
                                    }

                                    console.log(127004, audio.readyState)
                                    while (audio.readyState === 0) {
                                        await player_.cancelPlayback();
                                        await player_.pauseVideo();
                                        await player_.playVideo(); await delayPn(60);
                                    }
                                    console.log(127005, audio.readyState)
                                    if (!player_.isAtLiveHead()) {
                                        await delayPn(60);
                                        // await player_.seekToLiveHead(); await delayPn(9);
                                        await player_.seekToStreamTime();
                                        await player_.seekToLiveHead();
                                        await delayPn(60);
                                    }
                                    console.log(127006, audio.readyState)

                                }

                            }

                        } catch (e) {
                            console.log(e)
                        }

                    };

                    // console.log(299, player_)
                    let qz = (e) => {
                        try {

                            if (e && (e || 0).target) {
                                elm = player_ = e.target
                            }
                            if (!elm || !player_) return;
                            let k = -2;
                            if (e && e.detail && e.detail.state) {
                                k = e.detail.state
                            }
                            if (typeof player_.getPlayerState === 'function' && k >= 0 && k === player_.getPlayerState()) {
                                const audio = HTMLElement.prototype.querySelector.call(elm, '.video-stream.html5-main-video');
                                if (audio) asyncStateChange(audio, k);
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    };

                    document.addEventListener('player-state-change', qz, true);
                    // const state0 = player_.getPlayerState();
                    // if (typeof state0 === 'number') {
                    //     qz({ type: 'player-state-change', target: player_, detail: { state: state0 } });
                    // }

                    document.addEventListener('video-progress', (e) => {

                        if (e && (e || 0).target) {

                            elm = player_ = e.target
                        }
                        if (!elm || !player_) return;
                        Promise.resolve().then(() => {
                            if(player_ && typeof  player_.updateLastActiveTime === 'function'){
                                player_.updateLastActiveTime();
                            }
                        });
                    }, true);




                    return player_;


                } catch (e) {
                    console.log(e)
                }

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


                let configs = yt.config_ || 0;
                configs = configs.WEB_PLAYER_CONTEXT_CONFIGS || {};
                for (const [key, entry] of Object.entries(configs)) {

                    if (entry && typeof entry.serializedExperimentFlags === 'string') {
                        // prevent idle playback failure
                        entry.serializedExperimentFlags = entry.serializedExperimentFlags.replace(/\b(html5_check_for_idle_network_interval_ms|html5_trigger_loader_when_idle_network|html5_sabr_fetch_on_idle_network_preloaded_players|html5_autonav_cap_idle_secs|html5_autonav_quality_cap|html5_disable_client_autonav_cap_for_onesie|html5_idle_rate_limit_ms|html5_sabr_fetch_on_idle_network_preloaded_players|html5_webpo_idle_priority_job|html5_server_playback_start_policy|html5_check_video_data_errors_before_playback_start|html5_check_unstarted|html5_check_queue_on_data_loaded)=([-_\w]+)(\&|$)/g, (_, a, b, c) => {
                            return a + '00' + '=' + b + c;
                        });

                    }

                }


                maj = 0;

                // console.log(5910)
                try {
                    if (clickLockFn && clickTarget) {


                        let a = HTMLElement.prototype.querySelector.call(clickTarget, '.video-stream.html5-main-video');


                        if (!a) return;

                        // if(fa!==1) return;



                        if (a.muted === true && a.__spfgs__ !== true && a.paused === true && a.networkState === 0 && a.readyState === 0) {


                            const pr = new Promise(resolve => {

                                document.addEventListener('player-state-change', resolve, { once: true, passive: true, capture: false });

                            }).then();

                            maj = 0;
                            clickLockFn.call(clickTarget, mockEvent({ type: 'click', target: clickTarget, detail: 1 }));
                            await delayPn(1);
                            // if(fa!==1) return;

                            if (a.muted === false && a.__spfgs__ !== true && a.paused === true && a.networkState === 0 && a.readyState === 0) {
                                maj = 0;
                                clickLockFn.call(clickTarget, mockEvent({ type: 'click', target: clickTarget, detail: 1 }));
                                await delayPn(1);
                                // if(fa!==1) return;
                            }



                            delayRun(pr);


                        }



                    }

                } catch (e) { console.log(e) }


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

                if (fa !== 1) return;

                if (a.muted) return;

                if (a.muted === false && a.readyState === 0 && a.networkState === 2) {

                } else {
                    return;
                }


                // console.log('xx2')
                if (a.muted === false && a.readyState === 0 && a.networkState === 2) {

                } else {
                    // clearInterval(cid);
                }
                if (a.paused !== true) return;
                // clearInterval(cid);
                // console.log('xx3')


                if (document.querySelector('.player-controls-content')) return;

                if (fa !== 1) return;

                if (a.paused === true && a.muted === false && a.readyState === 0 && a.networkState === 2) {

                    maj = 0;
                    clickLockFn.call(clickTarget, mockEvent({ type: 'click', target: clickTarget, detail: 1 }));

                }
                // console.log(a.paused)
                // console.log(7710)

                if(a.paused === true && a.muted === false && a.networkState === 2 && a.readyState === 0){
                    if (typeof clickTarget.seekToStreamTime === 'function') clickTarget.seekToStreamTime();
                    if (typeof clickTarget.seekToLiveHead === 'function') clickTarget.seekToLiveHead();
                }






            }

            document.addEventListener('durationchange', (evt) => {

                if (evt.target.readyState !== 1) {
                    fa = 1;
                } else {
                    fa = 2;
                }


            }, true)



        }



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
            location.reload();
        });
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


        const style = document.createElement('style');
        style.id = 'fm9v0';
        style.textContent = `
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
       .with-audio-only-toggle-btn .ytp-contextmenu,
       .with-audio-only-toggle-btn .ytp-contextmenu .ytp-panel-menu,
       .with-audio-only-toggle-btn .ytp-contextmenu .ytp-panel {
            height: 40vh !important;
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

