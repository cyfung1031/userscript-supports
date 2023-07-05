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
// ==UserScript==
// @name         YouTube Minimal Fixs
// @version      0.6
// @description  This is to fix various features of YouTube Minimal on PC
// @namespace    http://tampermonkey.net/
// @author       CY Fung
// @license      MIT
// @supportURL   https://github.com/cyfung1031/userscript-supports
// @run-at       document-start
// @match        https://m.youtube.com/*
// @icon         https://github.com/cyfung1031/userscript-supports/raw/main/icons/youtube-minimal.png
// @grant        none
// @unwrap
// @allFrames    true
// @inject-into  page
// ==/UserScript==
"use strict";

//document.addEventListener('visibilitychange',function(evt){ evt.isTrusted && document.visibilityState==='hidden' && evt.stopPropagation() }, true)

(function (__CONTEXT__) {
    "use strict";

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


        if (!controlsInitialized) {
            controlsInitialized = true;


            let pb = document.querySelector('.player-controls-pb .ytm-progress-bar')



            pb.addEventListener('mouseup', eventHandlers.pbMouseUp, true)

            elm.addEventListener('click', eventHandlers.backDropClick, true)


            document.addEventListener('keydown', eventHandlers.docKeyDown, true)

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



})({ Promise });
