// ==UserScript==
// @name                A Universal Script to Re-Enable the Selection and Copying
// @name:zh-TW          A Universal Script to Re-Enable the Selection and Copying
// @name:zh-CN          通用脚本重开启选取复制
// @version             1.8.2.1
// @description         Enables select, right-click, copy and drag on pages that disable them. Enhanced Feature: Alt Key HyperLink Text Selection
// @description:zh-TW   破解鎖右鍵，解除禁止復制、剪切、選擇文本、右鍵菜單、文字複製、文字選取、圖片右鍵等限制。增強功能：Alt鍵超連結文字選取。
// @description:zh-CN   破解锁右键，解除禁止复制、剪切、选择文本、右键菜单、文字复制、文字选取、图片右键等限制。增强功能：Alt键超连结文字选取。
// @namespace           https://greasyfork.org/users/371179
// @author              CY Fung
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @match               http://*/*
// @match               https://*/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @exclude             https://github.dev/*/*
// @exclude             https://www.photopea.com/*
// @icon                https://cdn-icons-png.flaticon.com/512/3388/3388671.png
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_addValueChangeListener
// ==/UserScript==
(function $$() {
    'use strict';
    if (document == null || !document.documentElement) return window.requestAnimationFrame($$); // this is tampermonkey bug?? not sure
    //console.log('script at', location)
 
    function $nil() {}
 
    function isLatestBrowser(){
 
        let res;
        try{
            let o ={$nil};
            o?.$nil();
            o=null;
            o?.$nil();
            res = true;
        }catch(e){}
        return !!res;
    }
    if(!isLatestBrowser()) throw 'Browser version before 2020-01-01 is not supported. Please update to the latest version.';
 
    function isSupportAdvancedEventListener() {
        if ('_b1750' in $) return $._b1750
        let prop = 0;
        document.createAttribute('z').addEventListener('nil', $nil, {
            get passive() {
                prop++;
            },
            get once() {
                prop++;
            }
        });
        return ($._b1750 = prop == 2);
    }
 
    function isSupportPassiveEventListener() {
        if ('_b1650' in $) return $._b1650
        let prop = 0;
        document.createAttribute('z').addEventListener('nil', $nil, {
            get passive() {
                prop++;
            }
        });
        return ($._b1650 = prop == 1);
    }
 
    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
 
    const getSelection = window.getSelection || Error()(),
        requestAnimationFrame = window.requestAnimationFrame || Error()(),
        getComputedStyle = window.getComputedStyle.bind(window) || Error()();
 
    const $ = {
        utSelectionColorHack: 'msmtwejkzrqa',
        utTapHighlight: 'xfcklblvkjsj',
        utLpSelection: 'gykqyzwufxpz',
        utHoverBlock: 'meefgeibrtqx', // scc_emptyblock
        // utNonEmptyElm: 'ilkpvtsnwmjb',
        utNonEmptyElmPrevElm: 'jttkfplemwzo',
        utHoverTextWrap: 'oseksntfvucn',
        ksFuncReplacerNonFalse: '___dqzadwpujtct___',
        ksEventReturnValue: ' ___ndjfujndrlsx___',
        ksSetData: '___rgqclrdllmhr___',
        ksNonEmptyPlainText: '___grpvyosdjhuk___',
 
        eh_capture_passive: () => isSupportPassiveEventListener() ? ($._eh_capture_passive = ($._eh_capture_passive || {
            capture: true,
            passive: true
        })) : true,
 
        mAlert_DOWN: function() {}, // dummy function in case alert replacement is not valid
        mAlert_UP: function() {}, // dummy function in case alert replacement is not valid
 
 
        lpKeyPressing: false,
        lpKeyPressingPromise: Promise.resolve(),
 
        isNum: (d) => (d > 0 || d < 0 || d === 0),

        getNodeType: (n) => ((n instanceof Node) ? n.nodeType : -1),

        isAnySelection: function() {
            const sel = getSelection();
            return !sel ? null : (typeof sel.isCollapsed == 'boolean') ? !sel.isCollapsed : (sel.toString().length > 0);
        },
 
        createCSSElement: function(cssStyle, container) {
            const css = document.createElement('style'); // slope: DOM throughout
            css.textContent = cssStyle;
            if (container) container.appendChild(css);
            return css;
        },
 
        createFakeAlert: function(_alert) {
            if (typeof _alert != 'function') return null;
 
            function alert(msg) {
                alert.__isDisabled__() ? console.log("alert msg disabled: ", msg) : _alert.apply(this, arguments);
            };
            alert.toString = _alert.toString.bind(_alert);
            return alert;
        },
 
        createFuncReplacer: function(originalFunc, pName, resFX) {
            resFX = function(ev) {
                const res = originalFunc.apply(this, arguments);
                if (!this || this[pName] != resFX) return res; // if this is null or undefined, or this.onXXX is not this function
                if (res === false) return; // return undefined when "return false;"
                originalFunc[$.ksFuncReplacerNonFalse] = true;
                this[pName] = originalFunc; // restore original
                return res;
            }
            resFX.toString = () => originalFunc.toString();
            return resFX;
        },
 
        listenerDisableAll: function(evt) {
            let elmNode = evt.target;
            const pName = 'on' + evt.type;
            evt = null;
            Promise.resolve().then(() => {
                while (elmNode && elmNode.nodeType > 0) { // i.e. HTMLDocument or HTMLElement
                    const f = elmNode[pName];
                    if (typeof f == 'function' && f[$.ksFuncReplacerNonFalse] !== true) {
                        const nf = $.createFuncReplacer(f, pName);
                        nf[$.ksFuncReplacerNonFalse] = true;
                        elmNode[pName] = nf;
                    }
                    elmNode = elmNode.parentNode;
                }
            })
        },
 
        onceCssHighlightSelection: () => {
            if (document.documentElement.hasAttribute($.utLpSelection)) return;
            $.onceCssHighlightSelection = null
            Promise.resolve().then(() => {
                const s = [...document.querySelectorAll('a,p,div,span,b,i,strong,li')].filter(elm => elm.childElementCount === 0); // randomly pick an element containing text only to avoid css style bug
                const elm = !s.length ? document.body : s[s.length >> 1];
                return elm
            }).then(elm => {
                const selectionStyle = getComputedStyle(elm, ':selection');
                if (/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\)$/.test(selectionStyle.getPropertyValue('background-color'))) document.documentElement.setAttribute($.utSelectionColorHack, "");
                return elm;
            }).then(elm => {
                const elmStyle = getComputedStyle(elm)
                if (/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\)$/.test(elmStyle.getPropertyValue('-webkit-tap-highlight-color'))) document.documentElement.setAttribute($.utTapHighlight, "");
            })
        },
 
        clipDataProcess: function(clipboardData) {
 
            if (!clipboardData) return;
            const evt = clipboardData[$.ksSetData]; // NOT NULL when preventDefault is called
            if (!evt || evt.clipboardData !== clipboardData) return;
            const plainText = clipboardData[$.ksNonEmptyPlainText]; // NOT NULL when setData is called with non empty input
            if (!plainText) return;
 
            // BOTH preventDefault and setData are called.

            if (evt.cancelable !== true || evt.defaultPrevented !== false) return;


            // ---- disable text replacement on plain text node(s) ----

            let cSelection = getSelection();
            if (!cSelection) return; // ?
            let exactSelectionText = cSelection.toString();
            let trimedSelectionText = exactSelectionText.trim();
            if (exactSelectionText.length > 0 && exactSelectionText.length < plainText.length) {
                let pSelection = trimedSelectionText.replace(/[\r\n\t\b\x20\xA0\u200b\uFEFF\u3000]+/g, '');
                let pRequest = plainText.replace(/[\r\n\t\b\x20\xA0\u200b\uFEFF\u3000]+/g, '');
                // a newline char (\n) could be generated between nodes.
                let search = pRequest.indexOf(pSelection);
                if (search >= 0 && search < (plainText.length / 2) + 1 && $.getNodeType(cSelection.anchorNode) === 3 && $.getNodeType(cSelection.focusNode) === 3) {
                    console.log({
                        msg: "copy event - clipboardData replacement is NOT allowed as the text node(s) is/are selected.",
                        oldText: trimedSelectionText,
                        newText: plainText,
                    })
                    return;
                }
            }

            // --- allow preventDefault for text replacement ---

            $.bypass = true;
            evt.preventDefault();
            $.bypass = false;

            // ---- message log ----
 
 
            if (trimedSelectionText) {
                // there is replacement data and the selection is not empty
                console.log({
                    msg: "copy event - clipboardData replacement is allowed and the selection is not empty",
                    oldText: trimedSelectionText,
                    newText: plainText,
                })
            } else {
                // there is replacement data and the selection is empty
                console.log({
                    msg: "copy event - clipboardData replacement is allowed and the selection is empty",
                    oldText: trimedSelectionText,
                    newText: plainText,
                })
            }
 
        },
 
        enableSelectClickCopy: function() {
            $.eyEvts = ['keydown', 'keyup', 'copy', 'contextmenu', 'select', 'selectstart', 'dragstart', 'beforecopy']; // slope: throughout
 
            function isDeactivePreventDefault(evt) {
                if (!evt || $.bypass) return false;
                let j = $.eyEvts.indexOf(evt.type);
                switch (j) {
                    case 6:
                        if ($.enableDragging) return false;
                        if (evt.target && evt.target.nodeType==1 && evt.target.hasAttribute('draggable')) {
                            $.enableDragging = true;
                            return false;
                        }
                        // if(evt.target.hasAttribute('draggable')&&evt.target!=window.getSelection().anchorNode)return false;
                        return true;
                    case 3:
                        if (evt.target instanceof Element && (evt.target.textContent || "").trim().length === 0) return false; // exclude elements like video
                        return true;
                    case -1:
                        return false;
                    case 0:
                    case 1:
                        return (evt.keyCode == 67 && (evt.ctrlKey || evt.metaKey) && !evt.altKey && !evt.shiftKey && $.isAnySelection() === true);
                    case 2:
                        if (!('clipboardData' in evt && 'setData' in DataTransfer.prototype)) return true; // Event oncopy not supporting clipboardData
                        if (evt.cancelable && evt.defaultPrevented === false) {} else return true;
 
                        if (evt.clipboardData[$.ksSetData] && evt.clipboardData[$.ksSetData] != evt) return true; // in case there is a bug
                        evt.clipboardData[$.ksSetData] = evt;
 
                        $.clipDataProcess(evt.clipboardData);
 
                        return true; // preventDefault in clipDataProcess
 
 
                    default:
                        return true;
                }
            }
 
            !(function($setData) {
                DataTransfer.prototype.setData = (function setData() {
 
                    if (arguments[0] == 'text/plain' && typeof arguments[1] == 'string') {
                        if (arguments[1].trim().length > 0) {
                            this[$.ksNonEmptyPlainText] = arguments[1]
                        } else if (this[$.ksNonEmptyPlainText]) {
                            arguments[1] = this[$.ksNonEmptyPlainText]
                        }
                    }
 
                    $.clipDataProcess(this)
 
                    let res = $setData.apply(this, arguments)
 
                    return res;
 
                })
            })(DataTransfer.prototype.setData);
 
            Object.defineProperties(DataTransfer.prototype, {
                [$.ksSetData]: { // store the event
                    value: null,
                    writable: true,
                    enumerable: false,
                    configurable: true
                },
                [$.ksNonEmptyPlainText]: { // store the text
                    value: null,
                    writable: true,
                    enumerable: false,
                    configurable: true
                }
            })
 
 
            Event.prototype.preventDefault = (function(f) {
                function preventDefault() {
                    if (!isDeactivePreventDefault(this)) f.call(this);
                }
                preventDefault.toString = () => f.toString();
                return preventDefault;
            })(Event.prototype.preventDefault);
 
            Object.defineProperty(Event.prototype, "returnValue", {
                get() {
                    return $.ksEventReturnValue in this ? this[$.ksEventReturnValue] : true;
                },
                set(newValue) {
                    if (newValue === false && !isDeactivePreventDefault(this)) this.preventDefault();
                    this[$.ksEventReturnValue] = newValue;
                },
                enumerable: true,
                configurable: true
            });
 
            for (let i = 2, eventsCount = $.eyEvts.length; i < eventsCount; i++) {
                document.addEventListener($.eyEvts[i], $.listenerDisableAll, true); // Capture Event; passive:false; expected occurrence COMPLETELY before Target Capture and Target Bubble
            }
 
             // userscript bug ?  window.alert not working
            let window_ = null;
            try{
                window_ = new Function('return window')();
            }catch(e){}
            if(window_){
                let _alert = window_.alert; // slope: temporary
                if (typeof _alert == 'function') {
                    let _mAlert = $.createFakeAlert(_alert);
                    if (_mAlert) {
                        let clickBlockingTo = 0;
                        _mAlert.__isDisabled__ = () => clickBlockingTo > +new Date;
                        $.mAlert_DOWN = () => (clickBlockingTo = +new Date + 50);
                        $.mAlert_UP = () => (clickBlockingTo = +new Date + 20);
                        window_.alert = _mAlert
                    }
                    _mAlert=null;
                }
                _alert=null;
            }
            window_=null;
 
        },
 
        lpCheckPointer: function(targetElm) {
            if (targetElm && targetElm.nodeType == 1 && targetElm.matches('*:hover')) {
                if (getComputedStyle(targetElm).getPropertyValue('cursor') == 'pointer' && targetElm.textContent) return true;
            }
            return false;
        },
 
        eventCancel: function(evt, toPreventDefault) {
            $.bypass = true;
            !toPreventDefault || evt.preventDefault()
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            $.bypass = false;
        },
 
        lpHoverBlocks:[],
        lpKeyAltLastPressAt:0,
        lpKeyAltPressInterval:0,
 
        noPlayingVideo:function(){
 
            // prevent poor video preformance
 
            let noPlaying =true;
            for(const video of document.querySelectorAll('video[src]')){
 
                if(video.paused===false) noPlaying=false;
 
            }
            return noPlaying;
 
 
        },
 
 
        lpKeyDown: function(evt) {
 
            if(!$.gm_lp_enable)return;
 
            const isAltPress= (evt.key == "Alt" && evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey)
 
 
 
 
            if (isAltPress) {
 
                $.lpKeyAltLastPressAt=+new Date;
 
                let element=evt.target
 
 
                if($.lpKeyPressing == false && element && element.parentNode && !evt.repeat && $.noPlayingVideo()){
 
                    $.lpKeyPressing = true;
 
                    $.cid_lpKeyPressing=setInterval(()=>{
                        if($.lpKeyAltLastPressAt+500<+new Date){
                            $.lpCancelKeyPressAlt();
                        }
                    },137);
 
                    const rootNode = $.rootHTML(element);
                    if (rootNode) {
                        let tmp_wmEty = null;
 
 
                        let wmTextWrap = new WeakMap();
 
                        $.lpKeyPressingPromise = $.lpKeyPressingPromise.then(() => {
                            for (const elm of $.lpHoverBlocks) {
                                elm.removeAttribute($.utNonEmptyElmPrevElm)
                                elm.removeAttribute($.utHoverTextWrap)
                            }
                            $.lpHoverBlocks.length=0;
                        }).then(() => {
                            tmp_wmEty = new WeakMap(); // 1,2,3.....: non-empty elm,  -1:empty elm
                            const s = [...rootNode.querySelectorAll('*:not(button, textarea, input, script, noscript, style, link, img, br)')].filter((elm) => elm.childElementCount === 0 && (elm.textContent || '').trim().length > 0)
                            for (const elm of s) tmp_wmEty.set(elm, 1);
                            return s;
                        }).then((s) => {
                            let laterArr = [];
                            let promises = [];
 
                            let promiseCallback = parentNode => {
                                if (wmTextWrap.get(parentNode) !== null) return;
                                const m = [...parentNode.children].some(elm => {
                                    const value = getComputedStyle(elm).getPropertyValue('z-index');
                                    if (typeof value == 'string' && value.length > 0) return $.isNum(+value)
                                    return false
                                })
                                wmTextWrap.set(parentNode, m)
                                if (m) {
                                    $.lpHoverBlocks.push(parentNode);
                                    parentNode.setAttribute($.utHoverTextWrap, '')
                                }
 
                            };
 
                            for (const elm of s) {
                                let qElm = elm;
                                let qi = 1;
                                while (true) {
                                    let pElm = qElm.previousElementSibling;
                                    let anyEmptyHover = false;
                                    while (pElm) {
                                        if (tmp_wmEty.get(pElm) > 0) break;
                                        if (!pElm.matches(`button, textarea, input, script, noscript, style, link, img, br`) && (pElm.textContent || '').length === 0 && pElm.clientWidth * pElm.clientHeight > 0) {
                                            laterArr.push(pElm);
                                            anyEmptyHover = true;
                                        }
                                        pElm = pElm.previousElementSibling;
                                    }
                                    if (anyEmptyHover && !wmTextWrap.has(qElm.parentNode)) {
                                        wmTextWrap.set(qElm.parentNode, null)
                                        promises.push(Promise.resolve(qElm.parentNode).then(promiseCallback))
                                    }
                                    qElm = qElm.parentNode;
                                    if (!qElm || qElm === rootNode) break;
                                    qi++
                                    if (tmp_wmEty.get(qElm) > 0) break;
                                    tmp_wmEty.set(qElm, qi)
                                }
                            }
 
                            tmp_wmEty = null;
 
                            Promise.all(promises).then(() => {
                                promises.length = 0;
                                promises = null;
                                promiseCallback = null;
                                for (const pElm of laterArr) {
                                    let parentNode = pElm.parentNode
                                    if (wmTextWrap.get(parentNode) === true) {
                                        $.lpHoverBlocks.push(pElm);
                                        pElm.setAttribute($.utNonEmptyElmPrevElm, '');
                                    }
                                }
                                laterArr.length = 0;
                                laterArr = null;
                                wmTextWrap = null;
                            })
                        })
 
                    }
 
                }
 
 
            }else if($.lpKeyPressing==true){
 
                $.lpCancelKeyPressAlt();
 
            }
 
        },
        lpCancelKeyPressAlt:()=>{
            $.lpKeyPressing = false;
            if($.cid_lpKeyPressing>0) $.cid_lpKeyPressing=clearInterval($.cid_lpKeyPressing)
 
            $.lpKeyPressingPromise = $.lpKeyPressingPromise.then(() => {
                for (const elm of $.lpHoverBlocks) {
                    elm.removeAttribute($.utNonEmptyElmPrevElm)
                    elm.removeAttribute($.utHoverTextWrap)
                }
                $.lpHoverBlocks.length=0;
            })
 
 
            setTimeout(function(){
                if($.lpMouseActive == 1){
                    $.lpMouseUpClear();
                    $.lpMouseActive=0;
                }
            },32);
 
        },
        lpKeyUp: function(evt) {
 
            if(!$.gm_lp_enable)return;
 
            if ($.lpKeyPressing == true) {
                $.lpCancelKeyPressAlt();
            }
 
 
        },
 
        lpAltRoots:[],
 
        lpMouseDown: function(evt) {
 
            if(!$.gm_lp_enable)return;
 
            $.lpMouseActive = 0;
            if (evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && evt.button === 0 && $.noPlayingVideo()) {
                $.lpMouseActive = 1;
                $.eventCancel(evt, false);
                const rootNode = $.rootHTML(evt.target);
                $.lpAltRoots.push(rootNode);
                rootNode.setAttribute($.utLpSelection, '');
            }
        },
 
        lpMouseUpClear:function(){
                for(const rootNode of $.lpAltRoots) rootNode.removeAttribute($.utLpSelection);
                $.lpAltRoots.length=0;
                if ($.onceCssHighlightSelection) window.requestAnimationFrame($.onceCssHighlightSelection);
        },
 
        lpMouseUp: function(evt) {
 
            if(!$.gm_lp_enable)return;
 
            if ($.lpMouseActive == 1) {
                $.lpMouseActive = 2;
                $.eventCancel(evt, false);
                $.lpMouseUpClear();
            }
        },
 
        lpClick: function(evt) {
 
            if(!$.gm_lp_enable)return;
 
            if ($.lpMouseActive == 2) {
                $.eventCancel(evt, false);
            }
        },
 
        lpEnable: function() { // this is an optional feature for modern browser
            // the built-in browser feature has already disabled the default event behavior, the coding is just to ensure no "tailor-made behavior" occuring.
            document.addEventListener('keydown', $.lpKeyDown, {
                capture: true,
                passive: true
            })
            document.addEventListener('keyup', $.lpKeyUp, {
                capture: true,
                passive: true
            })
            document.addEventListener('mousedown', $.lpMouseDown, {
                capture: true,
                passive: true
            })
            document.addEventListener('mouseup', $.lpMouseUp, {
                capture: true,
                passive: true
            })
            document.addEventListener('click', $.lpClick, {
                capture: true,
                passive: true
            })
        },
 
        rootHTML: (node) => {
 
            if (!node || !(node.nodeType > 0)) return null;
            if (!node.ownerDocument) return node;
            let rootNode = node.getRootNode ? node.getRootNode() : null
            if (!rootNode) {
                let pElm = node;
                while (pElm) {
 
                    if (pElm.parentNode) pElm = pElm.parentNode;
                    else break;
 
                }
                rootNode = pElm;
            }
 
 
            rootNode = rootNode.querySelector('html') || node.ownerDocument.documentElement || null;
            return rootNode
 
        },
 
        mainEnableScript: () => {
            const cssStyleOnReady = `
            html, html *,
            html *::before, html *::after,
            html *:hover, html *:link, html *:visited, html *:active,
            html *[style], html *[class]{
                -khtml-user-select: auto !important; -moz-user-select: auto !important; -ms-user-select: auto !important;
                -webkit-touch-callout: default !important; -webkit-user-select: auto !important; user-select: auto !important;
            }
            *:hover>img[src]{pointer-events:auto !important;}
 
            [${$.utSelectionColorHack}] :not(input):not(textarea)::selection{ background-color: Highlight !important; color: HighlightText !important;}
            [${$.utSelectionColorHack}] :not(input):not(textarea)::-moz-selection{ background-color: Highlight !important; color: HighlightText !important;}
            [${$.utTapHighlight}] *{ -webkit-tap-highlight-color: rgba(0, 0, 0, 0.18) !important;}
 
            [${$.utHoverTextWrap}]>[${$.utNonEmptyElmPrevElm}]{pointer-events:none !important;}
            [${$.utHoverTextWrap}]>*{z-index:inherit !important;}
 
            html[${$.utLpSelection}] *:hover, html[${$.utLpSelection}] *:hover * { cursor:text !important;}
            html[${$.utLpSelection}] :not(input):not(textarea)::selection {background-color: rgba(255, 156, 179, 0.5) !important;}
            html[${$.utLpSelection}] :not(input):not(textarea)::-moz-selection {background-color: rgba(255, 156, 179, 0.5) !important;}
 
            img[${$.utHoverBlock}="4"]{display:none !important;}
            [${$.utHoverBlock}="7"]{padding:0 !important;overflow:hidden !important;}
            [${$.utHoverBlock}="7"]>img[${$.utHoverBlock}="4"]:first-child{
                display:inline-block !important;
                position: relative !important;
                top: auto !important;
                left: auto !important;
                bottom: auto !important;
                right: auto !important;
                opacity: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                height: 100% !important;
                outline: 0 !important;
                border: 0 !important;
                box-sizing: border-box !important;
                transform: initial !important;
                -khtml-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                -webkit-user-select: none !important;
                user-select: none !important;
                z-index:1 !important;
                float: left !important;
                cursor:inherit !important;
                pointer-events:inherit !important;
                border-radius: inherit !important;
                background:none !important;
            }
 
            `.trim();
 
            $.enableSelectClickCopy()
            $.createCSSElement(cssStyleOnReady, document.documentElement);
 
        },
 
        mainEvents: (listenerPress, listenerRelease) => {
            document.addEventListener("mousedown", listenerPress, true); // Capture Event; (desktop)
            document.addEventListener("contextmenu", listenerPress, true); // Capture Event; (desktop&mobile)
            document.addEventListener("mouseup", listenerRelease, false); // Bubble Event;
        },
 
        disableHoverBlock: () => {
 
            const nMap = new WeakMap();
 
            function elmParam(elm) {
 
                let mElm = nMap.get(elm);
                if (!mElm) nMap.set(elm, mElm = {});
                return mElm;
            }
 
            function overlapArea(rect1, rect2) {
 
                let l1 = {
                    x: rect1.left,
                    y: rect1.top
                }
 
                let r1 = {
                    x: rect1.right,
                    y: rect1.bottom
                }
                let l2 = {
                    x: rect2.left,
                    y: rect2.top
                }
 
                let r2 = {
                    x: rect2.right,
                    y: rect2.bottom
                }
 
                // Area of 1st Rectangle
                let area1 = Math.abs(l1.x - r1.x) * Math.abs(l1.y - r1.y);
 
                // Area of 2nd Rectangle
                let area2 = Math.abs(l2.x - r2.x) * Math.abs(l2.y - r2.y);
 
                // Length of intersecting part i.e
                // start from max(l1.x, l2.x) of
                // x-coordinate and end at min(r1.x,
                // r2.x) x-coordinate by subtracting
                // start from end we get required
                // lengths
                let x_dist = Math.min(r1.x, r2.x) - Math.max(l1.x, l2.x);
                let y_dist = Math.min(r1.y, r2.y) - Math.max(l1.y, l2.y);
                let areaI = 0;
                if (x_dist > 0 && y_dist > 0) {
                    areaI = x_dist * y_dist;
                }
 
                return {
                    area1,
                    area2,
                    areaI
                };
 
 
            }
 
            function redirectEvent(event, toElement) {
 
                toElement.dispatchEvent(new event.constructor(event.type, event));
                if (event.type != 'wheel') event.preventDefault();
                event.stopPropagation();
            }
 
            const floatingBlockHover = new WeakMap();
 
            let _nImgs = [];
 
 
            function nImgFunc() {
 
                for (const s of _nImgs) {
                    if (s.lastTime + 800 < +new Date) {
                        s.lastTime = +new Date;
                        return s.elm
                    }
                }
 
                let nImg = document.createElement('img');
                nImg.setAttribute('title', '　');
                nImg.setAttribute('alt', '　');
                nImg.onerror = function() {
                    if (this.parentNode != null) this.parentNode.removeChild(this)
                }
                nImg.setAttribute($.utHoverBlock, '4');
                const handle = function(event) {
                    if (this === event.target) {
                        if (event.button != 2) redirectEvent(event, this.parentNode)
                        Promise.resolve().then(() => {
                            for (const s of _nImgs) {
                                if (s.elm === this) {
                                    s.lastTime = +new Date
                                }
                            }
                        })
                    }
                }
                nImg.addEventListener('click', handle, true);
                nImg.addEventListener('mousedown', handle, true);
                nImg.addEventListener('mouseup', handle, true);
                nImg.addEventListener('mousemove', handle, true);
                nImg.addEventListener('mouseover', handle, true);
                nImg.addEventListener('mouseout', handle, true);
                nImg.addEventListener('mouseenter', handle, true);
                nImg.addEventListener('mouseleave', handle, true);
                // nImg.addEventListener('wheel', handle, $.eh_capture_passive());
                let resObj = {
                    elm: nImg,
                    lastTime: +new Date,
                    cid_fade: 0
                }
                _nImgs.push(resObj)
 
                return nImg;
 
            }
 
            const wmHoverUrl = new WeakMap();
            let lastMouseEnterElm = null;
            let lastMouseEnterAt = 0;
            let lastMouseEnterCid = 0;
 
            function mouseEnter() {
                lastMouseEnterCid = 0;
 
                if (+new Date - lastMouseEnterAt < 30) {
                    lastMouseEnterCid = setTimeout(mouseEnter, 82)
                    return;
                }
 
                // if($.lpKeyPressing)return;
 
                const targetElm = lastMouseEnterElm
 
                Promise.resolve()
                    .then(() => {
                        if (targetElm && targetElm.parentNode) {} else {
                            return;
                        }
                        if (floatingBlockHover.get(targetElm)) {
                            let url = null
                            if (targetElm.getAttribute($.utHoverBlock) == '7' && (url = wmHoverUrl.get(targetElm)) && targetElm.querySelector(`[${$.utHoverBlock}]`) == null) {
                                let _nImg = nImgFunc();
                                if (_nImg.parentNode !== targetElm) {
                                    _nImg.setAttribute('src', url);
                                    targetElm.insertBefore(_nImg, targetElm.firstChild);
                                }
                            }
                            return;
                        }
                        floatingBlockHover.set(targetElm, 1);
                        return 1;
                    }).then((ayRes) => {
                        if (!ayRes) return;
 
                        if (targetElm.nodeType != 1) return;
                        if ("|SVG|IMG|HTML|BODY|VIDEO|AUDIO|BR|HEAD|NOSCRIPT|SCRIPT|STYLE|TEXTAREA|AREA|INPUT|FORM|BUTTON|".indexOf(`|${targetElm.nodeName}|`) >= 0) return;
 
                        const targetArea = targetElm.clientWidth * targetElm.clientHeight
 
                        if (targetArea > 0) {} else {
                            return;
                        }
 
                        const targetCSS = getComputedStyle(targetElm)
                        const targetBgImage = targetCSS.getPropertyValue('background-image');
                        let exec1 = null
 
                        if (targetBgImage != 'none' && (exec1 = /^\s*url\s*\("?([^"\)]+\b(\.gif|\.png|\.jpeg|\.jpg|\.webp)\b[^"\)]*)"?\)\s*$/i.exec(targetBgImage))) {
                            if ((targetElm.textContent || "").trim().length > 0) return;
                            const url = exec1[1];
                            return url
 
                            // console.log(targetBgImage,[...exec1])
                        }
 
 
 
                        if (targetCSS.getPropertyValue('position') == 'absolute' && +targetCSS.getPropertyValue('z-index') > 0) {} else {
                            return;
                        }
                        if ((targetElm.textContent || "").trim().length > 0) return;
 
                        let possibleResults = [];
 
                        for (const imgElm of document.querySelectorAll('img[src]')) {
                            const param = elmParam(imgElm)
                            if (!param.area) {
                                const area = imgElm.clientWidth * imgElm.clientHeight
                                if (area > 0) param.area = area;
                            }
                            if (param.area > 0) {
                                if (targetArea > param.area * 0.9) possibleResults.push(imgElm)
                            }
                        }
 
                        let i = 0;
                        let j = 0;
                        for (const imgElm of possibleResults) {
 
                            const cmpVal = targetElm.compareDocumentPosition(imgElm)
 
                            /*
 
 
1: The two nodes do not belong to the same document.
2: p1 is positioned after p2.
4: p1 is positioned before p2.
8: p1 is positioned inside p2.
16: p2 is positioned inside p1.
32: The two nodes has no relationship, or they are two attributes on the same element.
 
            */
 
                            if (cmpVal & 8 || cmpVal & 16) return;
                            if (cmpVal & 2) j++; // I<p
                            else if (cmpVal & 4) break; // I>p
 
 
                            i++;
 
                        }
 
                        // before: j-1  after: j
 
                        let indexBefore = j - 1;
                        let indexAfter = j;
                        if (indexBefore < 0) indexBefore = 0;
                        if (indexAfter > possibleResults.length - 1) indexAfter = possibleResults.length - 1;
 
                        //    setTimeout(function(){
                        for (let i = indexBefore; i <= indexAfter; i++) {
                            const s = possibleResults[i];
                            const {
                                area1,
                                area2,
                                areaI
                            } = overlapArea(targetElm.getBoundingClientRect(), s.getBoundingClientRect())
                            const criteria = area1 * 0.7
                            if (areaI > 0.9 * area2) {
 
 
                                return s.getAttribute('src')
 
 
                            }
                        }
                        //   },1000);
 
                    }).then((sUrl) => {
 
                        if (typeof sUrl != 'string') return;
 
                        // console.log(targetElm, targetElm.querySelectorAll('img').length)
 
                        // console.log(313, evt.target, s)
                        let _nImg = nImgFunc();
 
 
                        if (_nImg.parentNode !== targetElm) {
                            _nImg.setAttribute('src', sUrl);
                            targetElm.insertBefore(_nImg, targetElm.firstChild);
                            wmHoverUrl.set(targetElm, sUrl);
                            targetElm.setAttribute($.utHoverBlock, '7');
                        }
 
 
 
                    })
 
            }
 
            document.addEventListener('mouseenter', function(evt) {
                if(!$.gm_disablehover_enable) return;
                lastMouseEnterElm = evt.target
                lastMouseEnterAt = +new Date;
                if (!lastMouseEnterCid) lastMouseEnterCid = setTimeout(mouseEnter, 82)
            }, $.eh_capture_passive())
 
 
 
        },
 
        acrAuxDown: function(evt) {
 
            if(!$.gm_prevent_aux_click_enable) return;
 
            if (evt.button === 1 ){
                let check = $.dmmMouseUpLast > $.dmmMouseDownLast && evt.timeStamp - $.dmmMouseUpLast < 40
                $.dmmMouseDownLast = evt.timeStamp;
                if( check ) {
                    $.eventCancel(evt, true);
                }
            }
 
        },
 
        acrAuxUp: function(evt) {
            if(!$.gm_prevent_aux_click_enable) return;
 
            if (evt.button === 1 ){
                let check = $.dmmMouseDownLast > $.dmmMouseUpLast && evt.timeStamp - $.dmmMouseDownLast < 40;
                $.dmmMouseUpLast = evt.timeStamp;
                if( check ) {
                    $.dmmMouseUpCancel = evt.timeStamp;
                    $.eventCancel(evt, true);
                }
            }
 
        },
 
 
        acrAuxClick: function(evt) {
            if(!$.gm_prevent_aux_click_enable) return;
 
            if (evt.button === 1 ){
                if( evt.timeStamp - $.dmmMouseUpCancel < 40 ) {
                    $.eventCancel(evt, true);
                }
            }
 
 
        },
 
        preventAuxClickRepeat:function(){
 
            document.addEventListener('mousedown', $.acrAuxDown, {
                capture: true,
                passive: false
            })
            document.addEventListener('mouseup', $.acrAuxUp, {
                capture: true,
                passive: false
            })
            document.addEventListener('auxclick', $.acrAuxClick, {
                capture: true,
                passive: false
            })
 
 
        },
 
        MenuEnable: (
            class MenuEnable{
 
                constructor(textToEnable, textToDisable, callback, initalEnable){
                    this.textToEnable=textToEnable;
                    this.textToDisable=textToDisable;
                    this.callback=callback;
                    this.gx=this.gx.bind(this);
                }
 
                unregister(){
                    (this.h>=0)?(GM_unregisterMenuCommand(this.h), (this.h=0)):0;
                }
 
                register(text){
                    if(typeof text == 'string') this.showText = text;
                    text = this.showText;
                    if(typeof text != 'string') return;
                    this.h=GM_registerMenuCommand(text, this.gx);
                }
 
                a(o){
 
                    if(this.enabled===o.bEnable) return;
                    this.enabled = o.bEnable;
                    this.unregister();
 
 
                    let pr= 0 ;
 
                    if($.gm_status_fn_store && $.gm_status_fn_store.indexOf(this)>=0){
 
                        let store = $.gm_status_fn_store
                        let idx = store.indexOf(this)
                        let count = store.length;
 
 
                        if(idx>=0&&idx<=count-2){
 
                            console.log(idx, count)
 
                            for(let jdx=idx+1;jdx<count;jdx++){
 
                                store[jdx].unregister();
                            }
 
                            this.register (o.bText);
 
                            for(let jdx=idx+1;jdx<count;jdx++){
 
                                store[jdx].register();
                            }
 
                            pr=1;
 
                        }
 
 
                    }
 
                    if(!pr) this.register (o.bText);
 
                    this.callback(this.enabled, o.byUserInput);
 
 
                }
 
                enableNow(byUserInput){
                    this.a({
                        bEnable: true,
                        bText: this.textToDisable,
                        byUserInput
                    });
 
                }
 
                gx(){
                    if(this.enabled) this.disableNow(true);
                    else this.enableNow(true);
 
                }
 
                disableNow(byUserInput){
                    this.a({
                        bEnable: false,
                        bText: this.textToEnable,
                        byUserInput
                    });
 
                }
 
                toggle(enable, byUserInput){
                    enable?this.enableNow(byUserInput):this.disableNow(byUserInput);
                }
 
            }
        ),
 
        gm_status_fn: function(gm_name, textToEnable, textToDisable, callback){
 
            let menuEnableName = gm_name + "$menuEnable";
 
            function set_gm(enabled){
                $[gm_name]=enabled;
                let menuEnable = $[menuEnableName];
                if( menuEnable ){
                    menuEnable.toggle(enabled)
                };
                callback(enabled)
            }
 
            set_gm(!!GM_getValue(gm_name));
 
            GM_addValueChangeListener(gm_name,function(name, old_value, new_value, remote){
 
                if(old_value === new_value) return;
                if(new_value === $[gm_name]) return;
                set_gm(new_value);
 
            });
 
            if(!inIframe()){
 
                $.gm_status_fn_store=$.gm_status_fn_store||[];
 
                $[menuEnableName]=new $.MenuEnable(textToEnable, textToDisable, (enabled) => {
                    GM_setValue(gm_name, !!enabled);
                });
 
                $.gm_status_fn_store.push($[menuEnableName]);
 
                $[menuEnableName].toggle(!!GM_getValue(gm_name));
 
            }
 
 
 
        }
 
    }
 
    // $.holdingElm=null;
 
    $.mainEnableScript();
 
    if (isSupportAdvancedEventListener()) $.lpEnable(); // top capture event for alt-click
 
    $.mainEvents(
        function(evt) {
            //   $.holdingElm=evt.target;
            //   console.log('down',evt.target)
            if ($.onceCssHighlightSelection) window.requestAnimationFrame($.onceCssHighlightSelection);
            if (evt.button == 2 || evt.type == "contextmenu") $.mAlert_DOWN();
        },
        function(evt) {
            //  $.holdingElm=null;
            //   console.log('up',evt.target)
            if (evt.button == 2) $.mAlert_UP();
            if ($.enableDragging) {
                $.enableDragging = false;
            }
        }
    );
 
    $.disableHoverBlock();
    $.preventAuxClickRepeat();
 
    console.log('userscript running - To Re-Enable Selection & Copying');
 
 
    $.gm_status_fn("gm_lp_enable", "To Enable `Enhanced build-in Alt Text Selection`", "To Disable `Enhanced build-in Alt Text Selection`", ()=>{
    // callback
    });
    $.gm_status_fn("gm_disablehover_enable", "To Enable `Hover on Image`", "To Disable `Hover on Image`", ()=>{
    // callback
    });
    $.gm_status_fn("gm_prevent_aux_click_enable", "To Enable `Repetitive AuxClick Prevention`", "To Disable `Repetitive AuxClick Prevention`", ()=>{
    // callback
    });
 
 
 
 
})();