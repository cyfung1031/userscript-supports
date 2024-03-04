// ==UserScript==
// @name            YouTube: Floating Chat Window on Fullscreen
// @namespace       UserScript
// @match           https://www.youtube.com/*
// @exclude         /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @version         0.4.2
// @license         MIT License
// @author          CY Fung
// @description     To make floating chat window on fullscreen
// @require         https://update.greasyfork.org/scripts/465819/1304833/API%20for%20CustomElements%20in%20YouTube.js
// @run-at          document-start
// @grant           none
// @unwrap
// @allFrames       true
// @inject-into     page
// ==/UserScript==


((__CONTEXT__) => {


    let activeStyle = false;

    let _lastStyleText = null;
    let tvc = 0;


    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

    let c27 = 0;
    let mouseDownActiveElement = null;
    document.addEventListener('click', function (evt) {

        if (!document.fullscreenElement) return;

        let byPass = false;

        if (Date.now() - c27 < 40) byPass = true;
        else {
            return;
        }


        if (evt.target && evt.target.id === 'chat' && evt.target.nodeName.toLowerCase() === 'ytd-live-chat-frame') byPass = false;
        else if (evt.target && evt.target.nodeName.toLowerCase() === 'iframe') byPass = false;

        if (byPass) {

            evt.stopPropagation();
            evt.stopImmediatePropagation();
            c27 = Date.now();
        }
        c27 = 0;

    }, { capture: true, passive: false });
    document.addEventListener('mousedown', function (evt) {

        if (!document.fullscreenElement) return;
        let byPass = false;
        const activeElement = document.activeElement || 0;
        mouseDownActiveElement = null;
        if (activeElement.nodeName === 'IFRAME') {
            if (activeElement.matches('[floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]) iframe')) {
                byPass = true;
                mouseDownActiveElement = activeElement;
            }
        }

        if (evt.target && evt.target.id === 'chat' && evt.target.nodeName.toLowerCase() === 'ytd-live-chat-frame') byPass = false;
        else if (evt.target && evt.target.nodeName.toLowerCase() === 'iframe') byPass = false;


        if (byPass) {

            evt.stopPropagation();
            evt.stopImmediatePropagation();
            c27 = Date.now();
        } else {
            mouseDownActiveElement = null;
        }
        c27 = 0;



    }, { capture: true, passive: false });
    document.addEventListener('mouseup', function (evt) {

        if (!document.fullscreenElement) return;
        let mde = mouseDownActiveElement;
        mouseDownActiveElement = null;

        if (!mde) return;

        let byPass = false;
        const activeElement = mde || 0;
        if (activeElement.nodeName === 'IFRAME') {
            if (activeElement.matches('[floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]) iframe')) {
                byPass = true;
            }
        }

        // if(Date.now()-c27 < 40 ) byPass = true;
        c27 = 0;

        if (evt.target && evt.target.id === 'chat' && evt.target.nodeName.toLowerCase() === 'ytd-live-chat-frame') byPass = false;
        else if (evt.target && evt.target.nodeName.toLowerCase() === 'iframe') byPass = false;

        if (byPass) {

            evt.stopPropagation();
            evt.stopImmediatePropagation();
            c27 = Date.now();
        }


    }, { capture: true, passive: false });


    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (this instanceof Window ? this : window);

    const hkey_script = 'vdnvorrwsksy';
    if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
    win[hkey_script] = true;

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    const svgDefs = () => `
            <svg version="1.1" xmlns="//www.w3.org/2000/svg" xmlns:xlink="//www.w3.org/1999/xlink" style="display:none;">
              <defs>
                <filter id="stroke-text-svg-filter-03">
  
                  <feColorMatrix type="matrix" in="SourceGraphic" values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 1 0" result="white-text"/>
                  <feMorphology in="white-text" result="DILATED" operator="dilate" radius="2"></feMorphology>
                  <feFlood flood-color="transparent" flood-opacity="1" result="PINK" id="floodColor-03"></feFlood>
                  <feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE"></feComposite>
                  <feMerge>
                    <feMergeNode in="OUTLINE" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                    <filter id="stroke-text-svg-filter-04">
                      <feMorphology operator="dilate" radius="2"></feMorphology>
                      <feComposite operator="xor" in="SourceGraphic"/>
                    </filter>
              </defs>
  
            </svg>
          `;




    const createStyleTextForTopWin = () => `
  
  
    [floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]) {
      position:fixed !important;
        top: var(--f3-top, 5px) !important;
        left: var(--f3-left, calc(60vw + 100px)) !important;
        height: var(--f3-h, 60vh) !important;
        width: var(--f3-w, 320px) !important;
        display:flex !important;
        flex-direction: column !important;
        padding: 4px;
        cursor: all-scroll;
        z-index:9999;
        box-sizing: border-box !important;
        margin:0 !important;
        opacity: var(--floating-window-opacity, 1.0) !important;
        background: transparent;
        background-color: rgba(0, 0, 0, 0.5);
        transition: background-color 300ms;
    }
  
    [floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]):hover {
        background-color: rgba(0, 0, 0, 0.85);
  
    }
  
    .no-floating[floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]) {
  
        top: -300vh !important;
        left: -300vh !important;
    }
  
  
    [floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]) #show-hide-button[class]{
        flex-grow: 0;
        flex-shrink:0;
        position:static;
        cursor: all-scroll;
    }
    [floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]) #show-hide-button[class] *[class]{
        cursor: inherit;
    }
    [floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]) iframe[class]{
        flex-grow: 100;
        flex-shrink:0;
        height: 0;
        position:static;
    }
  
  
    html{
        --fc7-handle-color: #0cb8da;
    }
    html[dark]{
        --fc7-handle-color: #0c74e4;
    }
  
    :fullscreen .resize-handle {
  
        position: absolute !important;
        top: 0;
        left: 0;
        bottom: 0;
        background: transparent;
        right: 0;
        z-index: 999 !important;
        border-radius: inherit !important;
        box-sizing: border-box !important;
        pointer-events:none !important;
        visibility: collapse;
        border: 4px solid transparent;
        border-color: transparent;
        transition: border-color 300ms;
    }
  
    [floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]):hover .resize-handle {
  
        visibility: visible;
  
        border-color: var(--fc7-handle-color);
    }
  
    [moving] {
        cursor: all-scroll;
        --pointer-events:initial;
    }
  
    [moving] body {
        --pointer-events:none;
    }
  
    [moving] ytd-live-chat-frame#chat{
  
        --pointer-events:initial;
    }
  
  
    [moving] ytd-live-chat-frame#chat iframe {
  
        --pointer-events:none;
    }
  
  
    [moving="move"]  ytd-live-chat-frame#chat {
        background-color: var(--yt-spec-general-background-a);
  
    }
  
  
    [moving="move"] ytd-live-chat-frame#chat iframe {
  
        visibility: collapse;
    }
  
    [moving] * {
        pointer-events:var(--pointer-events) !important;
  
    }
    [moving] *, [moving] [class] {
        user-select: none !important;
    }
  
    :fullscreen tyt-iframe-popup-btn{
        display: none !important;
    }
  
    [moving] tyt-iframe-popup-btn{
        display: none !important;
    }
  
    [floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed]) #show-hide-button.ytd-live-chat-frame>ytd-toggle-button-renderer.ytd-live-chat-frame {
  
      background: transparent;
  
    }
  
  
  
    `;

    const createStyleTextForIframe = () => `
  
  
    .youtube-floating-chat-iframe yt-live-chat-docked-message#docked-messages.style-scope.yt-live-chat-item-list-renderer {
      margin-top:var(--fc7-top-banner-mt);
      transition: margin-top 180ms;
    }
  
    .youtube-floating-chat-iframe yt-live-chat-banner-manager#live-chat-banner.style-scope.yt-live-chat-item-list-renderer {
      margin-top:var(--fc7-top-banner-mt);
      transition: margin-top 180ms;
    }
  
    .youtube-floating-chat-iframe #action-panel.style-scope.yt-live-chat-renderer {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
    }
  
    .youtube-floating-chat-iframe yt-live-chat-header-renderer.style-scope.yt-live-chat-renderer {
      position: relative;
      z-index: 8;
      background: rgb(0,0,0);
      visibility: var(--fc7-panel-visibility);
    }
  
  
  
    .youtube-floating-chat-iframe #chat-messages.style-scope.yt-live-chat-renderer.iron-selected > #contents.style-scope.yt-live-chat-renderer{
      position: fixed;
      z-index: 4;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  
    .youtube-floating-chat-iframe #right-arrow-container.yt-live-chat-ticker-renderer,
    .youtube-floating-chat-iframe #left-arrow-container.yt-live-chat-ticker-renderer
  
    {
      background: transparent;
    }
  
    .youtube-floating-chat-iframe yt-live-chat-renderer.yt-live-chat-app {
  
      --yt-live-chat-background-color: transparent;
      --yt-live-chat-action-panel-background-color: rgba(0, 0, 0, 0.08);
      --yt-live-chat-header-background-color: rgba(0, 0, 0, 0.18);
      --yt-spec-static-overlay-background-medium: rgba(0, 0, 0, 0.08);
      --yt-live-chat-banner-gradient-scrim: transparent;
  
    }
  
    .youtube-floating-chat-iframe{
      --fc7-top-banner-mt: 0px;
      --fc7-banner-opacity: 0.86;
      --fc7-system-message-opacity: 0.66;
      --fc7-system-message-opacity2: 0.66;
      --fc7-panel-display: none;
      --fc7-panel-visibility: collapse;
      --fc7-panel-position: absolute;
    }
    .youtube-floating-chat-iframe:focus-within,
    html:focus-within,
    body:focus-within,
    yt-live-chat-app:focus-within,
    yt-live-chat-renderer.yt-live-chat-app:focus-within
     {
      --fc7-top-banner-mt: 56px;
      --fc7-banner-opacity: 1.0;
      --fc7-system-message-opacity: 1.0;
      --fc7-system-message-opacity2: 1.00;
      --fc7-panel-display: invalid;
      --fc7-panel-visibility: invalid;
      --fc7-panel-position: absolute;
    }
  
    .youtube-floating-chat-iframe yt-live-chat-app:hover {
      --fc7-top-banner-mt: 56px;
      --fc7-banner-opacity: 1.0;
      --fc7-system-message-opacity: 1.0;
      --fc7-system-message-opacity2: 1.00;
      --fc7-panel-display: invalid;
      --fc7-panel-visibility: invalid;
      --fc7-panel-position: absolute;
    }
  
  
    .youtube-floating-chat-iframe yt-live-chat-renderer.yt-live-chat-app #visible-banners > yt-live-chat-banner-renderer {
      opacity: var(--fc7-banner-opacity) !important;
    }
  
  
    .youtube-floating-chat-iframe yt-live-chat-renderer.yt-live-chat-app yt-live-chat-viewer-engagement-message-renderer {
      opacity: var(--fc7-system-message-opacity) !important;
    }
  
  
    .youtube-floating-chat-iframe yt-live-chat-app yt-live-chat-renderer.yt-live-chat-app yt-live-chat-message-input-renderer {
      visibility: var(--fc7-panel-visibility);
      position: var(--fc7-panel-position);
  
        transform: translateY(-100%);
        left: 0;
        right: 0;
        opacity: 1;
        background: rgba(0,0,0,0.86);
    }
  
  
    /* hide message with input panel hidden */
    .youtube-floating-chat-iframe yt-live-chat-app > tp-yt-iron-dropdown.yt-live-chat-app yt-tooltip-renderer[slot="dropdown-content"][position-type="OPEN_POPUP_POSITION_TOP"].yt-live-chat-app {
      visibility: var(--fc7-panel-visibility);
    }
  
  
  
  
    [dark].youtube-floating-chat-iframe yt-live-chat-app ::-webkit-scrollbar-track,
    [dark].youtube-floating-chat-iframe yt-live-chat-kevlar-container ::-webkit-scrollbar-track {
        background-color: var(--ytd-searchbox-legacy-button-color);
    }
  
    .youtube-floating-chat-iframe yt-live-chat-app ::-webkit-scrollbar-track,
    .youtube-floating-chat-iframe yt-live-chat-kevlar-container ::-webkit-scrollbar-track {
        background-color: #fcfcfc;
    }
  
  
    [dark].youtube-floating-chat-iframe yt-live-chat-app ::-webkit-scrollbar-thumb,
    [dark].youtube-floating-chat-iframe yt-live-chat-kevlar-container ::-webkit-scrollbar-thumb{
  
        background-color: var(--ytd-searchbox-legacy-button-color);
        border: 2px solid var(--ytd-searchbox-legacy-button-color);
  
    }
  
  
  
    .youtube-floating-chat-iframe yt-live-chat-renderer[has-action-panel-renderer] #action-panel.yt-live-chat-renderer {
      --yt-live-chat-action-panel-gradient-scrim: transparent;
    }
  
  
    .youtube-floating-chat-iframe yt-live-chat-renderer[has-action-panel-renderer] #action-panel.yt-live-chat-renderer yt-live-chat-action-panel-renderer {
      opacity: var(--fc7-system-message-opacity2) !important;
    }
  
    `;

    const { isIframe, isTopFrame } = (() => {

        let isIframe = false, isTopFrame = false;
        try {
            isIframe = window.document !== top.document
        } catch (e) { }

        try {
            isTopFrame = window.document === top.document
        } catch (e) { }

        return { isIframe, isTopFrame };

    })();

    if (isIframe ^ isTopFrame) { } else return;

    if (isTopFrame) {




        const addCSS = (createStyleText) => {
            let text = createStyleText();
            let style = document.createElement('style');
            style.id = 'rvZ0t';
            style.textContent = text;
            document.head.appendChild(style);
        }



        const cleanContext = async (win) => {
            const waitFn = requestAnimationFrame; // shall have been binded to window
            try {
                let mx = 16; // MAX TRIAL
                const frameId = 'vanillajs-iframe-v1'
                let frame = document.getElementById(frameId);
                let removeIframeFn = null;
                if (!frame) {
                    frame = document.createElement('iframe');
                    frame.id = 'vanillajs-iframe-v1';
                    frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
                    let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
                    n.appendChild(frame);
                    while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
                    const root = document.documentElement;
                    root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
                    removeIframeFn = (setTimeout) => {
                        const removeIframeOnDocumentReady = (e) => {
                            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
                            win = null;
                            setTimeout(() => {
                                n.remove();
                                n = null;
                            }, 200);
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
                const { requestAnimationFrame, setTimeout } = fc;
                const res = { requestAnimationFrame, setTimeout };
                for (let k in res) res[k] = res[k].bind(win); // necessary
                if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
                return res;
            } catch (e) {
                console.warn(e);
                return null;
            }
        };

        cleanContext(win).then(__CONTEXT__ => {
            if (!__CONTEXT__) return null;

            const { requestAnimationFrame } = __CONTEXT__;

            let chatWindowWR = null;
            let showHideButtonWR = null;

            /* globals WeakRef:false */

            /** @type {(o: Object | null) => WeakRef | null} */
            const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

            /** @type {(wr: Object | null) => Object | null} */
            const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

            let startX;
            let startY;
            let startWidth;
            let startHeight;


            let edge = 0;


            let initialLeft;
            let initialTop;

            let stopResize;
            let stopMove;


            const getXY = (e) => {
                let rect = e.target.getBoundingClientRect();
                let x = e.clientX - rect.left; //x position within the element.
                let y = e.clientY - rect.top;  //y position within the element.
                return { x, y }
            }

            let beforeEvent = null;

            function resizeWindow(e) {


                const chatWindow = kRef(chatWindowWR);
                if (chatWindow) {

                    const mEdge = edge;

                    if (mEdge == 4 || mEdge == 1) {

                    } else if (mEdge == 8 || mEdge == 16) {
                    } else {
                        return;
                    }


                    Promise.resolve(chatWindow).then(chatWindow => {
                        let rect;

                        if (mEdge == 4 || mEdge == 1 || mEdge == 16) {

                            let newWidth = startWidth + (startX - e.pageX);

                            let newLeft = initialLeft + startWidth - newWidth;
                            chatWindow.style.setProperty('--f3-w', newWidth + "px");
                            chatWindow.style.setProperty('--f3-left', newLeft + "px");



                            let newHeight = startHeight + (startY - e.pageY);

                            let newTop = initialTop + startHeight - newHeight;
                            chatWindow.style.setProperty('--f3-h', newHeight + "px");
                            chatWindow.style.setProperty('--f3-top', newTop + "px");

                            rect = {
                                x: newLeft,
                                y: newTop,
                                w: newWidth,

                                h: newHeight,


                            };



                        } else if (mEdge == 8) {

                            let newWidth = startWidth + e.pageX - startX;
                            let newHeight = startHeight + e.pageY - startY;

                            chatWindow.style.setProperty('--f3-w', newWidth + "px");
                            chatWindow.style.setProperty('--f3-h', newHeight + "px");


                            rect = {
                                x: initialLeft,
                                y: initialTop,
                                w: newWidth,

                                h: newHeight,


                            };

                        }



                        updateOpacity(chatWindow, rect, screen);

                    })


                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();


                }

            }

            let isMoved = false;

            function moveWindow(e) {



                const chatWindow = kRef(chatWindowWR);
                if (chatWindow) {

                    Promise.resolve(chatWindow).then(chatWindow => {


                        let newX = initialLeft + e.pageX - startX;
                        let newY = initialTop + e.pageY - startY;

                        if (Math.abs(e.pageX - startX) > 10 || Math.abs(e.pageY - startY) > 10) isMoved = true;

                        chatWindow.style.setProperty('--f3-left', newX + "px");
                        chatWindow.style.setProperty('--f3-top', newY + "px");



                        updateOpacity(chatWindow, {
                            x: newX,
                            y: newY,
                            w: startWidth,

                            h: startHeight,


                        }, screen);

                    });



                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();

                }
            }




            function initializeResize(e) {

                if (!document.fullscreenElement) return;

                if (!document.querySelector('[floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed])')) return;

                if (e.target.id !== 'chat') return;



                const { x, y } = getXY(e);
                edge = 0;
                if (x < 16 && y < 16) { edge = 16; }
                else if (x < 16) edge = 4;
                else if (y < 16) edge = 1;
                else edge = 8;

                if (edge <= 0) return;

                startX = e.pageX;
                startY = e.pageY;

                const chatWindow = kRef(chatWindowWR);
                if (chatWindow) {

                    Promise.resolve(chatWindow).then(chatWindow => {

                        let rect = chatWindow.getBoundingClientRect();
                        initialLeft = rect.x;
                        initialTop = rect.y;



                        startWidth = rect.width;
                        startHeight = rect.height;


                        chatWindow.style.setProperty('--f3-left', initialLeft + "px");
                        chatWindow.style.setProperty('--f3-top', initialTop + "px");
                        chatWindow.style.setProperty('--f3-w', startWidth + "px");
                        chatWindow.style.setProperty('--f3-h', startHeight + "px");

                    });

                }




                document.documentElement.setAttribute('moving', 'resize');

                document.documentElement.removeEventListener("mousemove", resizeWindow, false);
                document.documentElement.removeEventListener("mousemove", moveWindow, false);
                document.documentElement.removeEventListener("mouseup", stopResize, false);
                document.documentElement.removeEventListener("mouseup", stopMove, false);

                isMoved = false;
                document.documentElement.addEventListener("mousemove", resizeWindow);
                document.documentElement.addEventListener("mouseup", stopResize);

            }


            let updateOpacityRid = 0;

            function updateOpacity(chatWindow, rect, screen) {

                let tid = ++updateOpacityRid;

                requestAnimationFrame(() => {


                    if (tid !== updateOpacityRid) return;

                    let { x, y, w, h } = rect;
                    let [left, top, right, bottom] = [x, y, x + w, y + h];


                    let opacityW = (Math.min(right, screen.width) - Math.max(0, left)) / w;
                    let opacityH = (Math.min(bottom, screen.height) - Math.max(0, top)) / h;

                    let opacity = Math.min(opacityW, opacityH);

                    chatWindow.style.setProperty('--floating-window-opacity', Math.round(opacity * 100 * 5, 0) / 5 / 100);


                })





            }

            function initializeMove(e) {

                if (!document.fullscreenElement) return;
                if (!document.querySelector('[floating-chat-window]:fullscreen ytd-live-chat-frame#chat:not([collapsed])')) return;



                const chatWindow = kRef(chatWindowWR);



                startX = e.pageX;
                startY = e.pageY;


                if (chatWindow) {

                    Promise.resolve(chatWindow).then(chatWindow => {


                        let rect = chatWindow.getBoundingClientRect();
                        initialLeft = rect.x;
                        initialTop = rect.y;



                        startWidth = rect.width;
                        startHeight = rect.height;


                        chatWindow.style.setProperty('--f3-left', initialLeft + "px");
                        chatWindow.style.setProperty('--f3-top', initialTop + "px");
                        chatWindow.style.setProperty('--f3-w', startWidth + "px");
                        chatWindow.style.setProperty('--f3-h', startHeight + "px");

                    })


                }



                document.documentElement.setAttribute('moving', 'move');

                document.documentElement.removeEventListener("mousemove", resizeWindow, false);
                document.documentElement.removeEventListener("mousemove", moveWindow, false);
                document.documentElement.removeEventListener("mouseup", stopResize, false);
                document.documentElement.removeEventListener("mouseup", stopMove, false);
                isMoved = false;

                document.documentElement.addEventListener("mousemove", moveWindow, false);
                document.documentElement.addEventListener("mouseup", stopMove, false);

                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();

                beforeEvent = e;

            }


            function checkClick(beforeEvent, currentEvent) {

                const d = currentEvent.timeStamp - beforeEvent.timeStamp;
                if (d < 300 && d > 30 && !isMoved) {

                    document.documentElement.classList.add('no-floating');

                }

            }


            stopResize = (e) => {

                document.documentElement.removeEventListener("mousemove", resizeWindow, false);
                document.documentElement.removeEventListener("mousemove", moveWindow, false);
                document.documentElement.removeEventListener("mouseup", stopResize, false);
                document.documentElement.removeEventListener("mouseup", stopMove, false);

                document.documentElement.removeAttribute('moving');

                e.stopImmediatePropagation();
                e.stopPropagation();

            }

            stopMove = (e) => {

                document.documentElement.removeEventListener("mousemove", resizeWindow, false);
                document.documentElement.removeEventListener("mousemove", moveWindow, false);
                document.documentElement.removeEventListener("mouseup", stopResize, false);
                document.documentElement.removeEventListener("mouseup", stopMove, false);

                document.documentElement.removeAttribute('moving');
                beforeEvent && checkClick(beforeEvent, e);
                beforeEvent = null;

                e.stopImmediatePropagation();
                e.stopPropagation();

            }


            function reset() {

                document.documentElement.removeAttribute('moving');
                document.documentElement.removeEventListener("mousemove", resizeWindow, false);
                document.documentElement.removeEventListener("mousemove", moveWindow, false);
                document.documentElement.removeEventListener("mouseup", stopResize, false);
                document.documentElement.removeEventListener("mouseup", stopMove, false);


                startX = 0;
                startY = 0;
                startWidth = 0;
                startHeight = 0;


                edge = 0;


                initialLeft = 0;
                initialTop = 0;

                beforeEvent = null;


            }

            function iframeLoaded() {

            }

            function iframeFullscreenChanged() {
                const iframeDoc = this;


                _lastStyleText = null;

                if (!document.fullscreenElement) {
                    activeStyle = false;
                    iframeDoc.documentElement.classList.remove('youtube-floating-chat-iframe');
                } else {
                    activeStyle = true;
                    iframeDoc.documentElement.classList.add('youtube-floating-chat-iframe');

                }


            }

            let iframeFullscreenChangedBinded = null;



            function onMessage(evt) {
                if (evt.data === hkey_script) {

                    const iframeWin = evt.source;
                    if (!iframeWin) return;
                    const iframeDoc = iframeWin.document;


                    function onReady() {

                        iframeDoc.head.appendChild(document.createElement('style')).textContent = createStyleTextForIframe();






                        const tm = document.createElement('template');
                        tm.innerHTML = svgDefs();
                        iframeDoc.body.appendChild(tm.content)

                        if (iframeFullscreenChangedBinded) document.removeEventListener('fullscreenchange', iframeFullscreenChangedBinded, false);
                        iframeFullscreenChangedBinded = iframeFullscreenChanged.bind(iframeDoc);
                        document.addEventListener('fullscreenchange', iframeFullscreenChangedBinded, false);

                        iframeFullscreenChangedBinded();





                        setInterval(() => {

                            if (!activeStyle) return;


                            let xpathExpression = "//style[text()[contains(., 'userscript-control[floating-chat-iframe]')]]";

                            // Evaluating the XPath expression and getting string value directly
                            let result = iframeDoc.evaluate(xpathExpression, iframeDoc, null, XPathResult.STRING_TYPE, null);

                            let newText = result && result.stringValue ? result.stringValue : null;

                            if (newText !== _lastStyleText) {
                                _lastStyleText = newText;
                                // console.log(123)

                                let tid = ++tvc;

                                requestAnimationFrame(() => {

                                    if (tid !== tvc) return;



                                    let style = iframeWin.getComputedStyle(iframeDoc.documentElement);

                                    let fc = style.getPropertyValue('--floodcolor');
                                    if (fc) {

                                        console.log(fc)


                                        let floodColor03 = iframeDoc.querySelector('#floodColor-03');
                                        floodColor03 && floodColor03.setAttribute('flood-color', fc);

                                        let floodColor04 = iframeDoc.querySelector('#floodColor-04');
                                        floodColor04 && floodColor04.setAttribute('flood-color', fc);

                                        iframeDoc.documentElement.setAttribute('hpkns', '')
                                    } else {
                                        iframeDoc.documentElement.removeAttribute('hpkns')

                                    }




                                });



                            }



                        }, 100);


                    }

                    Promise.resolve().then(() => {

                        if (iframeDoc.readyState !== 'loading') {
                            onReady();
                        } else {
                            iframeWin.addEventListener("DOMContentLoaded", onReady, false);
                        }

                    });


                }

            }


            function setChat(chat) {

                if (!(chat instanceof Element)) return;
                let resizeHandle = HTMLElement.prototype.querySelector.call(chat, '.resize-handle')
                if (resizeHandle) return;

                const chatDollar = insp(chat).$ || chat.$ || 0;

                let cw = (() => {
                    try {
                        const { head, body } = chatDollar.chatframe.contentWindow.document;
                        return { head, body }

                    } catch (e) { return null; }
                })();

                if (!cw) return;

                window.removeEventListener('message', onMessage, false);
                window.addEventListener('message', onMessage, false);



                let script = document.getElementById('rvZ0t') || (document.evaluate("//div[contains(text(), 'userscript-control[enable-customized-floating-window]')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null) || 0).singleNodeValue;
                if (!script) addCSS(createStyleTextForTopWin);
                /*
                const tm = document.createElement('template');
                tm.innerHTML=svgDefs();
                document.body.appendChild(tm.content)
                */

                if (!document.documentElement.hasAttribute('floating-chat-window')) document.documentElement.setAttribute('floating-chat-window', '');


                chat.setAttribute('allowtransparency', 'true');



                resizeHandle = document.createElement("div");
                resizeHandle.className = "resize-handle";
                chat.appendChild(resizeHandle);
                resizeHandle = null;

                let chatWindow;
                let showHideButton;

                chatWindow = kRef(chatWindowWR);
                showHideButton = kRef(showHideButtonWR);



                if (chatWindow) chatWindow.removeEventListener("mousedown", initializeResize, false);
                if (showHideButton) showHideButton.removeEventListener("mousedown", initializeMove, false);


                chatWindow = chat;
                showHideButton = HTMLElement.prototype.querySelector.call(chat, '#show-hide-button');
                chatWindowWR = mWeakRef(chat)
                showHideButtonWR = mWeakRef(showHideButton);



                chatWindow.addEventListener("mousedown", initializeResize, false);
                showHideButton.addEventListener("mousedown", initializeMove, false);

                reset();

            }


            const fullscreenchangePageFn = () => {
                if (!document.fullscreenElement) {
                    document.documentElement.classList.remove('no-floating')
                }
            };

            function noChat(chat) {

                if (!(chat instanceof Element)) return;

                let chatWindow;
                let showHideButton;

                chatWindow = kRef(chatWindowWR);
                showHideButton = kRef(showHideButtonWR);



                if (chatWindow) chatWindow.removeEventListener("mousedown", initializeResize, false);
                if (showHideButton) showHideButton.removeEventListener("mousedown", initializeMove, false);


                let resizeHandle = HTMLElement.prototype.querySelector.call(chat, '.resize-handle')
                if (resizeHandle) {
                    resizeHandle.remove();
                }

                chat.removeEventListener("mousedown", initializeResize, false);


                showHideButton = HTMLElement.prototype.querySelector.call(chat, '#show-hide-button');

                if (showHideButton) showHideButton.removeEventListener("mousedown", initializeMove, false);


                reset();
            }


            document.removeEventListener('fullscreenchange', fullscreenchangePageFn, false);
            document.addEventListener('fullscreenchange', fullscreenchangePageFn, false);
            fullscreenchangePageFn();

            customYtElements.whenRegistered('ytd-live-chat-frame', (proto) => {


                proto.attached = ((attached) => (function () { Promise.resolve(this.hostElement || this).then(setChat).catch(console.warn); return attached.apply(this, arguments) }))(proto.attached);

                proto.detached = ((detached) => (function () { Promise.resolve(this.hostElement || this).then(noChat).catch(console.warn); return detached.apply(this, arguments) }))(proto.detached);

                let chat = document.querySelector('ytd-live-chat-frame');
                if (chat) Promise.resolve(chat).then(setChat).catch(console.warn);

            })


        });


    } else if (isIframe && top === parent) {



        top.postMessage(hkey_script, `${location.protocol}//${location.hostname}`);




    }





})({ requestAnimationFrame });
