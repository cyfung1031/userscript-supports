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
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is to fix various features of YouTube Minimal on PC
// @author       CY Fung
// @supportURL   https://github.com/cyfung1031/userscript-supports
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @run-at       document-start
// @grant               none
// @unwrap
// @allFrames
// @inject-into page
// ==/UserScript==
"use strict";

//document.addEventListener('visibilitychange',function(evt){ evt.isTrusted && document.visibilityState==='hidden' && evt.stopPropagation() }, true)

(function () {
    "use strict";

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
    #player-control-overlay[class]:hover {
        animation: addFadeIn 1ms;
    }

    `


    const cssFNs = {

        addFadeIn(elm){
        elm.classList.add('fadein')

        },

        removeFadeIn(elm){
        elm.classList.remove('fadein')
        }

    }

    document.addEventListener('animationstart', (evt) => {

        let n = (evt||0).animationName

        let f = cssFNs[n]
        if(f) f(evt.target)


    }, true)



    function onReady(t) {
        if(t!==9) window.removeEventListener("DOMContentLoaded", onReady, false);

        document.head.appendChild(styleElm)
        styleElm = null
        onReady = null

    }



    if (document.readyState != 'loading') {
        onReady(9);
    } else {
        window.addEventListener("DOMContentLoaded", onReady, false);
    }



})();
