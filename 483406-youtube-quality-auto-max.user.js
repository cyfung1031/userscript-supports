// ==UserScript==
// @name        YouTube: Quality Auto Max
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.3.0
// @author      CY Fung
// @license     MIT
// @description To make Quality Auto Max
// @grant       none
// @run-at      document-start
// @unwrap
// @inject-into page
//
// ==/UserScript==

(() => {

    const Promise = (async () => { })().constructor;

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

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

    const getResValue = (m) => {

        return m.width < m.height ? m.width : m.height
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

    const getuU = (_yt_player) => {
        const w = 'uU';

        let arr = [];
        let brr = new Map();

        for (const [k, v] of Object.entries(_yt_player)) {

            const p = typeof v === 'function' ? v.prototype : 0;
            if (p) {
                let q = 0;
                if (typeof p.setPlaybackQualityRange === 'function' && p.setPlaybackQualityRange.length === 3) q += 200;
                if (typeof p.updateVideoData === 'function' && p.updateVideoData.length === 2) q += 80;
                if (p.getVideoAspectRatio) q += 20;
                if (p.getStreamTimeOffset) q += 20;
                // if (typeof p.updatePlaylist ==='function' && p.updatePlaylist.length===1)q += 80;

                if (q < 200) continue; // p.setPlaybackQualityRange must be available

                if (q > 0) arr = addProtoToArr(_yt_player, k, arr) || arr;

                if (q > 0) brr.set(k, q);

            }

        }

        if (arr.length === 0) {

            console.warn(`Key does not exist. [${w}]`);
        } else {

            arr = arr.map(key => [key, (brr.get(key) || 0)]);

            if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);

            console.log(`[${w}]`, arr);
            return arr[0][0];
        }



    }

    const getL0 = (_yt_player) => {
        const w = 'L0';

        let arr = [];

        for (const [k, v] of Object.entries(_yt_player)) {

            const p = typeof v === 'function' ? v.prototype : 0;
            if (p) {
                let q = 0;
                if (typeof p.getPreferredQuality === 'function' && p.getPreferredQuality.length === 0) q += 200;
                if (typeof p.getVideoData === 'function' && p.getVideoData.length === 0) q += 80;
                if (typeof p.isPlaying === 'function' && p.isPlaying.length === 0) q += 2;

                if (typeof p.getPlayerState === 'function' && p.getPlayerState.length === 0) q += 2;

                if (typeof p.getPlayerType === 'function' && p.getPlayerType.length === 0) q += 2;

                if (q < 280) continue; // p.getPreferredQuality and p.getVideoData must be available

                if (q > 0) arr.push([k, q])

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


    const getZf = (vL0) => {
        const w = 'vL0';

        let arr = [];

        for (const [k, v] of Object.entries(vL0)) {

            // console.log(k,v)

            const p = v;
            if (p) {
                let q = 0;
                if (typeof p.videoData === 'object' && p.videoData) {

                    if (Object.keys(p).length === 2) q += 200;

                }


                if (q > 0) arr.push([k, q])

            }

        }

        if (arr.length === 0) {

            // console.warn(`Key does not exist. [${w}]`);
        } else {

            if (arr.length > 1) arr.sort((a, b) => b[1] - a[1]);


            console.log(`[${w}]`, arr);
            return arr[0][0];
        }



    }

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


    const isUrlInEmbed = location.href.includes('.youtube.com/embed/');
    const isAbortSignalSupported = typeof AbortSignal !== "undefined";

    cleanContext(window).then(__CONTEXT__ => {
        if (!__CONTEXT__) return null;

        const { setTimeout } = __CONTEXT__;

        const promiseForTamerTimeout = new Promise(resolve => {
            !isUrlInEmbed && isAbortSignalSupported && document.addEventListener('yt-action', function () {
                setTimeout(resolve, 480);
            }, { capture: true, passive: true, once: true });
            !isUrlInEmbed && isAbortSignalSupported && typeof customElements === "object" && customElements.whenDefined('ytd-app').then(() => {
                setTimeout(resolve, 1200);
            });
            setTimeout(resolve, 3000);
        });


        let resultantQualities = null;
        let byPass = false;

        // @@ durationchange @@
        let pm2 = new PromiseExternal();
        let lastURL = null;

        let activatedOnce = false;

        const fn = async (evt) => {
            try {
                const target = (evt || 0).target
                if (!(target instanceof HTMLMediaElement)) return;
                pm2.resolve();
                const pm1 = pm2 = new PromiseExternal();
                const mainMedia = await observablePromise(() => {
                    return isUrlInEmbed ? document.querySelector('#movie_player .html5-main-video') : document.querySelector('ytd-player#ytd-player #movie_player .html5-main-video')
                }, pm2.then()).obtain();
                if (!mainMedia) return;
                if (pm1 !== pm2) return;
                const ytdPlayerElm = isUrlInEmbed ? mainMedia.closest('#movie_player') : mainMedia.closest('ytd-player#ytd-player');
                if (!ytdPlayerElm) return;

                let player_
                for (let i = 10; --i;) {
                    player_ = isUrlInEmbed ? ytdPlayerElm : await ((insp(ytdPlayerElm) || 0).player_ || 0);
                    if (player_) break;
                    if (pm1 !== pm2) return;
                    await new Promise(r => setTimeout(r, 18));
                }

                if (!player_) return;
                for (let i = 10; --i;) {
                    if (player_.setPlaybackQualityRange) break;
                    if (pm1 !== pm2) return;
                    await new Promise(r => setTimeout(r, 18));
                }

                if (pm1 !== pm2) return;
                if (typeof player_.setPlaybackQualityRange !== 'function') return;

                let _url = lastURL;
                let url = mainMedia.src;
                if (url === _url) return;
                lastURL = url;

                if (resultantQualities) {
                    !activatedOnce && console.log('YouTube Quality Auto Max is activated.');
                    activatedOnce = true;
                    let resultantQuality;
                    let qualityThreshold = +localStorage.qualityThreshold || 0;
                    if (!(qualityThreshold > 60)) qualityThreshold = 0;
                    for (const entry of resultantQualities) {
                        const entryRes = getResValue(entry);

                        if (entryRes > 60 && entry.quality && typeof entry.quality === 'string') {

                            if (qualityThreshold === 0 || (qualityThreshold > 60 && entryRes <= qualityThreshold)) {
                                resultantQuality = entry.quality;
                                break;
                            }

                        }
                    }
                    if (resultantQuality) {
                        byPass = true;
                        player_.setPlaybackQualityRange(resultantQuality, resultantQuality);
                        byPass = false;
                        console.log('YouTube Quality Auto Max sets Quality to ', resultantQuality);
                    }
                }
            } catch (e) {
                console.warn(e)
            }
        };
        // document.addEventListener('loadstart', fn, true)
        document.addEventListener('durationchange', fn, true);

        // @@ durationchange @@

        (async () => {

            try {


                const _yt_player = await observablePromise(() => {
                    return (((window || 0)._yt_player || 0) || 0);
                }, promiseForTamerTimeout).obtain();

                if (!_yt_player || typeof _yt_player !== 'object') return;

                const vmHash = new WeakSet();

                const g = _yt_player;
                const keyuU = getuU(_yt_player);
                const keyL0 = getL0(_yt_player);

                if (keyuU) {

                    let k = keyuU;
                    let gk = g[k];
                    let gkp = g[k].prototype;

                    if(typeof gkp.setPlaybackQualityRange132 !== "function" && typeof gkp.setPlaybackQualityRange === "function"){

                        gkp.setPlaybackQualityRange132 = gkp.setPlaybackQualityRange;
                        gkp.setPlaybackQualityRange = function (...args) {
                            if (!byPass && resultantQualities && document.visibilityState === 'visible') {
                                if (args[0] === args[1] && typeof args[0] === 'string' && args[0]) {
                                    const selectionEntry = resultantQualities.filter(e => e.quality === args[0])[0] || 0
                                    const selectionHeight = selectionEntry ? getResValue(selectionEntry) : 0;
                                    if (selectionHeight > 60) {
                                        localStorage.qualityThreshold = selectionHeight;
                                    }
                                } else if (!args[0] && !args[1]) {
                                    delete localStorage.qualityThreshold;
                                }
                            }
                            return this.setPlaybackQualityRange132(...args)
                        };

                        console.log('YouTube Quality Auto Max - function modified [setPlaybackQualityRange]')

                    }

                }

                if (keyL0) {
                    let k = keyL0;
                    let gk = g[k];
                    let gkp = g[k].prototype;

                    let keyZf = null;

                    if (typeof gkp.getVideoData31 !== "function" && typeof gkp.getVideoData === "function" && typeof gkp.setupOnNewVideoData61 !== "function") {

                        gkp.getVideoData31 = gkp.getVideoData;
                        gkp.setupOnNewVideoData61 = function () {

                            keyZf = getZf(this);
                            if (!keyZf) return;

                            const tZf = this[keyZf];

                            if (!tZf) return;

                            let keyJ = Object.keys(tZf).filter(e => e !== 'videoData')[0]

                            const tZfJ = tZf[keyJ];
                            const videoData = tZf.videoData;
                            if (!tZfJ || !videoData || !tZfJ.videoInfos) return;


                            let videoTypes = tZfJ.videoInfos.map(info => info.video);


                            // console.log(videoTypes)
                            if (!videoTypes[0] || !videoTypes[0].quality || !getResValue(videoTypes[0])) return;

                            let highestQuality = videoTypes[0].quality

                            // console.log('highestQuality', highestQuality)

                            let keyLists = new Set();
                            let keyLists2 = new Set();
                            const o = {
                                [keyZf]: {
                                    videoData: new Proxy(videoData, {
                                        get(obj, key) {
                                            keyLists.add(key);
                                            const v = obj[key];
                                            if (typeof v === 'object') return new Proxy(v, {
                                                get(obj, key) {
                                                    keyLists2.add(key);
                                                    return obj[key]
                                                }
                                            })
                                            return v
                                        }
                                    })
                                }
                            }

                            this.getPreferredQuality.call(o)
                            // console.log(keyLists.size, keyLists2.size)
                            if (keyLists.size !== 2) return;
                            if (keyLists2.size < 3) return;



                            /*
                             * 1080p Premium
                
                                g.k.Nj = function(a) {
                                    h_a(this);
                                    this.options[a].element.setAttribute("aria-checked", "true");
                                    this.Yd(this.Dk(a));
                                    this.C = a
                                }
                
                            */

                            /*
                                TP = function(a) {
                                    return SP[a.j || a.B] || "auto"
                                }
                            */

                            const [keyAy, keyxU] = [...keyLists];
                            const keyLs = [...keyLists2]
                            const keyPs = [keyAy, keyxU]

                            let cz = 0;
                            function inc() {
                                for (const pey of keyPs) {

                                    for (const ley of keyLs) {
                                        const val = videoData[pey][ley]
                                        if (typeof val === 'number' && val >= 0 && ~~val === val) {
                                            if (!cz) cz = ley;
                                            if (cz === ley) {
                                                // videoData[pey][ley]  = 5120;
                                                // videoData[pey][ley] = videoTypes[0].height;
                                                continue
                                            }
                                            videoData[pey][ley] = getResValue(videoTypes[0]);
                                            // videoData[pey][ley]='1080p Premium'
                                            // videoData[pey][ley] = '1080p';
                                            videoData[pey]['reason'] = 'm'
                                        } else if (typeof val === 'boolean' && val === false) {
                                            videoData[pey][ley] = true;
                                        }
                                    }

                                }
                            }

                            // console.log(22, this)

                            // const keyyU=getyU(_yt_player);
                            // _yt_player[keyyU].prototype.

                            resultantQualities = videoTypes;


                            console.log('YouTube Quality Auto Max - resultantQualities is detected.');

                            // inc();
                            // console.log(this.getPreferredQuality())
                            // inc();
                            // console.log(this.getPreferredQuality())
                            // console.log(videoData, keyxU)

                            // console.log(this)
                            // console.log(1237, keyZf, keyJ, this[keyZf], videoTypes, videoData[keyAy], videoData[keyxU], keyLists2)

                        }
                        gkp.getVideoData = function () {
                            const vd = this.getVideoData31();;
                            if (!vd || typeof vd !== 'object') return vd;
                            if (!vmHash.has(vd)) {
                                vmHash.add(vd);
                                this.setupOnNewVideoData61();
                                if (!keyZf) vmHash.delete(vd)
                            }
                            return vd;
                        }

                        console.log('YouTube Quality Auto Max - function modified [getVideoData]')
                    }

                }




            } catch (e) {
                console.warn(e)
            }



        })();

    });

})();