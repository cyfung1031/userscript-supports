// ==UserScript==
// @name         YouTube Minimal Fixs
// @version      0.7.8
// @description  This is to fix various features of YouTube Minimal on PC
// @namespace    http://tampermonkey.net/
// @author       CY Fung
// @license      MIT
// @supportURL   https://github.com/cyfung1031/userscript-supports
// @run-at       document-start
// @match        https://m.youtube.com/*
// @icon         https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/youtube-minimal.png
// @grant        none
// @unwrap
// @allFrames    true
// @inject-into  page
// ==/UserScript==
"use strict";

/*

MIT License

Copyright 2023 CY Fung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

//document.addEventListener('visibilitychange',function(evt){ evt.isTrusted && document.visibilityState==='hidden' && evt.stopPropagation() }, true)

(function (__CONTEXT__) {
    "use strict";

    const showNativeControls = false;

    const { Promise } = __CONTEXT__;

    let [window] = new Function('return [window]')();

    if (window.document.addEventListener399) return;
    window.document.addEventListener399 = window.document.addEventListener
    //    let i = 0
    window.document.addEventListener = function (type, listener, options) {
        if (type === 'visibilitychange') {
            // i++
            if (listener.length === 0 && !listener.name) {


                let s = listener + "";
                if (s.length >= 17 && s.length <= 19) {
                    return // ƒ (){a.Eh()} 18
                } else if (s.length > 348 && s.indexOf(".getVisibilityState()") > 0) {

                    return

                }

            }
            /*
            if(i==4 || i==2){
                console.log(listener, (listener+"").length)
                return
                            }
                            */
            //            return
        }
        return this.addEventListener399.apply(this, arguments)
    }




    let styleElm = document.createElement('style')
    styleElm.textContent = `

    @keyframes addFadeIn {
        from{background-position:1px;}
        to{background-position:2px;}
    }
    @keyframes removeFadeIn {
        from{background-position:1px;}
        to{background-position:2px;}
    }
    #player-control-overlay[class] {
        animation: removeFadeIn 1ms;
    }
    #player-control-overlay[class]:hover
     {
        animation: addFadeIn 1ms;
    }
    h2.slim-video-information-title{
        animation: initUI 1ms;

    }

    #player-control-overlay[class]{
        pointer-events: all !important;
    }

    ytm-cinematic-container-renderer, ytm-cinematic-container-renderer * {
        contain: layout size style;
        user-select: none;
        touch-action: none;
        pointer-events: none;
    }

    ytm-custom-control .player-controls-bottom .icon-button:hover>c3-icon svg path,
    ytm-custom-control .player-controls-middle .icon-button:hover>c3-icon svg path,
    ytm-custom-control .player-controls-top .icon-button:hover>c3-icon svg path,
    ytm-custom-control .player-controls-pb .icon-button:hover>c3-icon,
    ytm-custom-control .player-controls-top ytm-closed-captioning-button button[aria-pressed=true]:hover>c3-icon svg path,
    ytm-custom-control .player-controls-top ytm-closed-captioning-button button[aria-pressed=false]:hover>c3-icon svg path ,

    ytm-custom-control .player-controls-top ytm-closed-captioning-button button:hover>c3-icon svg path,
    ytm-custom-control .player-controls-middle .icon-button.icon-disable:hover>c3-icon svg path
    {


        fill: #006aff;

    }

    #player-control-overlay.fadein .player-controls-background[class] {
        background: linear-gradient(to bottom, rgba(0,0,0,0) 78%, rgba(0,0,0,0.32) 100%);
    }

    #player, #player-control-container, .ytp-autohide[class] {
        cursor: initial !important;
    }

    button.icon-button:hover {
        color: #006aff;
    }

    .ytWebScrimHost[class] {
        cursor: initial;
    }

    #player-control-overlay:not(.fadein)[id] {
        height: unset;
    }

    #player-control-overlay::before {
        content: '';
        display: block;
        position: absolute;
        left: -4px;
        top: -4px;
        right: -4px;
        bottom: -4px;
        box-sizing: border-box;
        background: transparent;
        border: 0;
        margin: 0;
        padding: 0;
        z-index: -1;
    }

    `

    let controlsInitialized = false

    async function videoToggle(video) {

        if (video.paused) video.play(); else video.pause();
    }

    let elements = {

    }

    const eventHandlers = {

        pbMouseUp(evt) {


            let pb = this
            //                console.log(evt.target, evt, this)
            let m = evt.offsetX / pb.offsetWidth
            if (m < 0 || m > 1) return

            let video = document.querySelector('#movie_player video[src]')
            if (!video) return

            let ct = video.currentTime
            let d = video.duration
            if (!ct || ct < 0) return
            if (!d || d < 0) return

            video.currentTime = m * d


            evt.preventDefault()
            evt.stopPropagation()
            evt.stopImmediatePropagation()


        },
        pbMouseClick(evt) {



            evt.preventDefault()
            evt.stopPropagation()
            evt.stopImmediatePropagation()


        },
        pbMouseDown(evt) {



            evt.preventDefault()
            evt.stopPropagation()
            evt.stopImmediatePropagation()


        },
        backDropClick(evt) {




            if (evt && evt.target) { } else return;

            let target = evt.target
            if (target.nodeName === "DIV" && (target.className || '').indexOf('player-controls-background') >= 0) { } else return;


            let video = document.querySelector('#movie_player video[src]')
            if (!video) return;


            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            videoToggle(video);


        },
        docKeyDown(evt) {
            if (evt.target.nodeName === 'BODY') {
                // console.log(evt)
                if (evt.code === "Space") {

                    let video = document.querySelector('#movie_player video[src]')
                    if (!video) return;
                    videoToggle(video);
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();

                } else if (evt.code === 'ArrowLeft') {


                    let video = document.querySelector('#movie_player video[src]')
                    if (!video) return;

                    if (video.currentTime >= 5)
                        video.currentTime = video.currentTime - 5

                } else if (evt.code === 'ArrowRight') {


                    let video = document.querySelector('#movie_player video[src]')
                    if (!video) return;

                    if (video.duration >= video.currentTime + 5)
                        video.currentTime = video.currentTime + 5


                }

            }
        }

    }

    function uiSetup(elm) {

        if (!elm) return;


        if (!controlsInitialized) {
            controlsInitialized = true;

            const isProgressBarExist = document.querySelector('[role="slider"], yt-progress-bar, ytm-progress-bar, .yt-progress-bar, .ytm-progress-bar, .YtmProgressBarProgressBar, .watch-page-progress-bar')

            // (( pb element to be reviewed. ))

            if (isProgressBarExist) {

                // let pb = document.querySelector('.player-controls-pb .ytm-progress-bar')

                // if (!pb) {
                //     console.log("'.player-controls-pb .ytm-progress-bar' cannot be found");
                // } else {

                //     pb.addEventListener('mouseup', eventHandlers.pbMouseUp, true)

                elm.addEventListener('click', eventHandlers.backDropClick, true)

                document.addEventListener('keydown', eventHandlers.docKeyDown, true)

                // }
            }

        }

    }

    const cssFNs = {

        addFadeIn(elm) {
            elm.classList.add('fadein')
            uiSetup(elm)
        },

        removeFadeIn(elm) {
            let skip = false
            let video = document.querySelector('#movie_player video[src]')
            if (video && video.paused) {
                skip = true
            }
            if (!skip) elm.classList.remove('fadein')

            uiSetup(elm)
        },
        initUI() {

            let elm = document.querySelector('#player-control-overlay[class]')
            uiSetup(elm)

        }

    }

    document.addEventListener('animationstart', (evt) => {

        let n = (evt || 0).animationName

        let f = cssFNs[n]
        if (f) f(evt.target)


    }, true)



    function onReady() {

        (document.head || document.documentElement).appendChild(styleElm);
        styleElm = null;

    }



    Promise.resolve().then(() => {
        if (document.readyState !== 'loading') {
            onReady();
        } else {
            window.addEventListener("DOMContentLoaded", onReady, false);
        }
    });

    if (showNativeControls) {
        // ==UserScript==
        // @name Show Native Controls
        // @match https://m.youtube.com/*
        // @run-at document-start
        // ==/UserScript==


        let addedCSS = false;
        function setupVideo(video) {

            if (!addedCSS) {

                document.documentElement.appendChild(document.createElement('style')).textContent = `

                    #player-control-overlay:not(.fadein){
                        height: calc(100% - 64px);
                    }

                    #player-control-overlay .player-controls-background{
                        pointer-events: none;
                    }

                    #player-control-overlay:not(.fadein) .player-controls-background{
                        bottom: -64px;
                    }

                `
            }
            const v = video;
            /*
            try {
              v.controls = true;
              v.nextSibling.childNodes[0].style['pointer-events'] = 'none'
              v.nextSibling.childNodes[0].childNodes[1].style['pointer-events'] = 'auto'
            } catch (e) { }
            */

            v.controls = true;

            const observer = new MutationObserver((list, observer) => {
                let q = !!document.querySelector('#player-control-overlay:not(.fadein)');
                if (v.controls !== q) {

                    v.controls = q;
                }

            })

            observer.observe(v, { attributes: true, attributeFilter: ['controls'] });
            v.setAttribute('w68u4', '1')

        }

        const parentMO = new MutationObserver(() => {

            let q = !!document.querySelector('#player-control-overlay:not(.fadein)');

            if (q) {

                for (const v of document.querySelectorAll('.html5-main-video[w68u4="1"]')) {

                    if (v.controls !== q) {
                        v.controls = q;
                    }
                }

            }

        });


        new MutationObserver(() => {

            const video = document.querySelector('.html5-main-video:not([w68u4])');
            if (!video) return;
            video.setAttribute('w68u4', '');
            if (!(video instanceof HTMLMediaElement)) return;

            setupVideo(video);

            for (const elm of document.querySelectorAll('#player-control-overlay, ytm-custom-control, ytm-custom-control .new-controls, ytm-custom-control .player-controls-content, ytm-custom-control .player-controls-content, ytm-custom-control .player-controls-background-container, #player')) {
                parentMO.observe(elm, { childList: true, attributes: true });
            }


        }).observe(document, { subtree: true, childList: true });

    }


    const isCtrl = (e) => ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey));

    const eventFn1 = (evt) => {
        if (isCtrl(evt)) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
        }
    };

    document.addEventListener('mousedown', eventFn1, true);

    document.addEventListener('mouseup', eventFn1, true);

    document.addEventListener('pointerdown', eventFn1, true);

    document.addEventListener('pointerup', eventFn1, true);

    document.addEventListener('click', eventFn1, true);

    document.addEventListener('playing', (evt) => {

        if (evt && evt.isTrusted === true && evt.target instanceof HTMLVideoElement && evt.target.closest('#player')) {

            evt.target.style.pointerEvents = "none";
            if (!evt.target.muted) evt.target.volume = 1; // fixed at 1.0

        }

    }, true);


})({ Promise });
