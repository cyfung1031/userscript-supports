// ==UserScript==
// @name                YouTube Super Fast Chat
// @version             0.5.18
// @license             MIT
// @name:ja             YouTube スーパーファーストチャット
// @name:zh-TW          YouTube 超快聊天
// @name:zh-CN          YouTube 超快聊天
// @namespace           UserScript
// @match               https://www.youtube.com/live_chat*
// @author              CY Fung
// @require             https://greasyfork.org/scripts/465819-api-for-customelements-in-youtube/code/API%20for%20CustomElements%20in%20YouTube.js?version=1215280
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
//
// @description         To make your YouTube Live Chat scroll instantly without smoothing transform CSS
// @description:ja      YouTubeライブチャットをスムーズな変形CSSなしで瞬時にスクロールさせるために。
// @description:zh-TW   讓您的 YouTube 直播聊天即時滾動，不經過平滑轉換 CSS。
// @description:zh-CN   让您的 YouTube 直播聊天即时滚动，不经过平滑转换 CSS。
//
// ==/UserScript==

((__CONTEXT__) => {

    // const ACTIVE_DEFERRED_APPEND = false; // somehow buggy

    // const ACTIVE_CONTENT_VISIBILITY = true;
    // const ACTIVE_CONTAIN_SIZE = true;

    const addCss = () => document.head.appendChild(document.createElement('style')).textContent = `


    @supports (contain:layout paint style) and (content-visibility:auto) and (contain-intrinsic-size:auto var(--wsr94)) {

      [wSr93="hidden"]:nth-last-child(n+4) {
        --wsr93-content-visibility: auto;
        contain-intrinsic-size: auto var(--wsr94);
      }

    }

    @supports (contain:layout paint style) {

      [wSr93] {
        --wsr93-contain: layout style;
        contain: var(--wsr93-contain, unset) !important;
        box-sizing: border-box !important;
        content-visibility: var(--wsr93-content-visibility, visible);
      }
      [wSr93="hidden"] { /* initial->[wSr93]->[wSr93="visible"]->[wSr93="hidden"] => reliable rendered height */
        --wsr93-contain: size layout style;
        height: var(--wsr94);
      }


      /* ------------------------------------------------------------------------------------------------------------- */

      yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image img {
        contain: layout style;
      }

      body yt-live-chat-app {
        contain: size layout paint style;
        overflow: hidden;
      }

      #items.style-scope.yt-live-chat-item-list-renderer {
        contain: layout paint style;
      }

      #item-offset.style-scope.yt-live-chat-item-list-renderer {
        contain: style;
      }

      #item-scroller.style-scope.yt-live-chat-item-list-renderer {
        contain: size style;
      }

      #contents.style-scope.yt-live-chat-item-list-renderer, #chat.style-scope.yt-live-chat-renderer, img.style-scope.yt-img-shadow[width][height] {
        contain: size layout paint style;
      }

      .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label], .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label] > #container {
        contain: layout paint style;
      }

      yt-live-chat-text-message-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-membership-item-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-paid-message-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-banner-manager.style-scope.yt-live-chat-item-list-renderer {
        contain: layout style;
      }

      tp-yt-paper-tooltip[style*="inset"][role="tooltip"] {
        contain: layout paint style;
      }

      /* ------------------------------------------------------------------------------------------------------------- */

    }

    @supports (color: var(--general)) {

        #item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer {
            position: static !important;
        }

        .ytp-contextmenu[class],
        .toggle-button.tp-yt-paper-toggle-button[class],
        .yt-spec-touch-feedback-shape__fill[class],
        .fill.yt-interaction[class],
        .ytp-videowall-still-info-content[class],
        .ytp-suggestion-image[class] {
          will-change: unset !important;
        }

        yt-img-shadow[height][width] {
          content-visibility: visible !important;
        }

        yt-live-chat-item-list-renderer:not([allow-scroll]) #item-scroller.yt-live-chat-item-list-renderer {
            overflow-y: scroll;
            padding-right: 0;
        }


        /* optional */
        #item-offset.style-scope.yt-live-chat-item-list-renderer {
        height: auto !important;
        min-height: unset !important;
        }

        #items.style-scope.yt-live-chat-item-list-renderer {
        transform: translateY(0px) !important;
        }

        /* optional */
        yt-icon[icon="down_arrow"] > *, yt-icon-button#show-more > * {
        pointer-events: none !important;
        }

        #continuations, #continuations * {
            contain: strict;
            position: fixed;
            top: 2px;
            height: 1px;
            width: 2px;
            height: 1px;
            visibility: collapse;
        }

        yt-live-chat-renderer[has-action-panel-renderer] #show-more.yt-live-chat-item-list-renderer{
            top: 4px;
            transition-property: top;
            bottom: unset;
        }

        yt-live-chat-renderer[has-action-panel-renderer] #show-more.yt-live-chat-item-list-renderer[disabled]{
            top: -42px;
        }

        html #panel-pages.yt-live-chat-renderer > #input-panel.yt-live-chat-renderer:not(:empty) {
            --yt-live-chat-action-panel-top-border: none;
        }

        html #panel-pages.yt-live-chat-renderer > #input-panel.yt-live-chat-renderer.iron-selected > *:first-child {
            border-top: 1px solid var(--yt-live-chat-panel-pages-border-color);
        }

        html #panel-pages.yt-live-chat-renderer {
            border-top: 0;
            border-bottom: 0;
        }

    }

    `;

    const { Promise, requestAnimationFrame, IntersectionObserver } = __CONTEXT__;


    const isContainSupport = CSS.supports('contain', 'layout paint style');
    if (!isContainSupport) {
        console.warn("Your browser does not support css property 'contain'.\nPlease upgrade to the latest version.".trim());
    }

    // const APPLY_delayAppendChild = false;

    // let activeDeferredAppendChild = false; // deprecated

    // let delayedAppendParentWS = new WeakSet();
    // let delayedAppendOperations = [];
    // let commonAppendParentStackSet = new Set();

    // let firstVisibleItemDetected = false; // deprecated

    const sp7 = Symbol();


    let dt0 = Date.now() - 2000;
    const dateNow = () => Date.now() - dt0;
    // let lastScroll = 0;
    // let lastLShow = 0;
    let lastWheel = 0;

    const proxyHelperFn = (dummy) => ({

        get(target, prop) {
            return (prop in dummy) ? dummy[prop] : prop === sp7 ? target : target[prop];
        },
        set(target, prop, value) {
            if (!(prop in dummy)) {
                target[prop] = value;
            }
            return true;
        },
        has(target, prop) {
            return (prop in target)
        },
        deleteProperty(target, prop) {
            return true;
        },
        ownKeys(target) {
            return Object.keys(target);
        },
        defineProperty(target, key, descriptor) {
            return Object.defineProperty(target, key, descriptor);
        },
        getOwnPropertyDescriptor(target, key) {
            return Object.getOwnPropertyDescriptor(target, key);
        },

    });

    const tickerContainerSetAttribute = function (attrName, attrValue) { // ensure '14.30000001%'.toFixed(1)

        let yd = (this.__dataHost || (this.inst || 0).__dataHost).__data;

        if (arguments.length === 2 && attrName === 'style' && yd && attrValue) {

            // let v = yd.containerStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_;
            let v = `${attrValue}`;
            // conside a ticker is 101px width
            // 1% = 1.01px
            // 0.2% = 0.202px


            const ratio1 = (yd.ratio * 100);
            if (ratio1 > -1) { // avoid NaN

                // countdownDurationMs
                // 600000 - 0.2%    <1% = 6s>  <0.2% = 1.2s>
                // 300000 - 0.5%    <1% = 3s>  <0.5% = 1.5s>
                // 150000 - 1%    <1% = 1.5s>
                // 75000 - 2%    <1% =0.75s > <2% = 1.5s>
                // 30000 - 5%    <1% =0.3s > <5% = 1.5s>

                // 99px * 5% = 4.95px

                // 15000 - 10%    <1% =0.15s > <10% = 1.5s>




                // 1% Duration 

                let ratio2 = ratio1;

                const ydd = yd.data;
                const d1 = ydd.durationSec;
                const d2 = ydd.fullDurationSec;

                if (d1 === d2 && d1 > 1) {

                    if (d1 > 400) ratio2 = Math.round(ratio2 * 5) / 5; // 0.2%
                    else if (d1 > 200) ratio2 = Math.round(ratio2 * 2) / 2; // 0.5%
                    else if (d1 > 100) ratio2 = Math.round(ratio2 * 1) / 1; // 1%
                    else if (d1 > 50) ratio2 = Math.round(ratio2 * 0.5) / 0.5; // 2%
                    else if (d1 > 25) ratio2 = Math.round(ratio2 * 0.2) / 0.2; // 5% (max => 99px * 5% = 4.95px)
                    else ratio2 = Math.round(ratio2 * 0.2) / 0.2;

                } else {
                    ratio2 = Math.round(ratio2 * 5) / 5; // 0.2% (min)
                }

                // ratio2 = Math.round(ratio2 * 5) / 5;
                ratio2 = ratio2.toFixed(1)
                v = v.replace(`${ratio1}%`, `${ratio2}%`).replace(`${ratio1}%`, `${ratio2}%`)

                if (yd.__style_last__ === v) return;
                yd.__style_last__ = v;
                // do not consider any delay here.
                // it shall be inside the looping for all properties changes. all the css background ops are in the same microtask.

            }

            HTMLElement.prototype.setAttribute.call(this, attrName, v);


        } else {
            HTMLElement.prototype.setAttribute.apply(this, arguments);
        }

    };

    const fxOperator = (proto, propertyName) => {
        let propertyDescriptorGetter = null;
        try {
            propertyDescriptorGetter = Object.getOwnPropertyDescriptor(proto, propertyName).get;
        } catch (e) { }
        return typeof propertyDescriptorGetter === 'function' ? (e) => propertyDescriptorGetter.call(e) : (e) => e[propertyName];
    };

    const nodeParent = fxOperator(Node.prototype, 'parentNode');
    // const nFirstElem = fxOperator(HTMLElement.prototype, 'firstElementChild');
    const nPrevElem = fxOperator(HTMLElement.prototype, 'previousElementSibling');
    const nNextElem = fxOperator(HTMLElement.prototype, 'nextElementSibling');
    const nLastElem = fxOperator(HTMLElement.prototype, 'lastElementChild');


    /* globals WeakRef:false */

    /** @type {(o: Object | null) => WeakRef | null} */
    const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

    /** @type {(wr: Object | null) => Object | null} */
    const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

    const watchUserCSS = () => {

        // if (!CSS.supports('contain-intrinsic-size', 'auto var(--wsr94)')) return;

        const getElemFromWR = (nr) => {
            const n = kRef(nr);
            if (n && n.isConnected) return n;
            return null;
        }

        const clearContentVisibilitySizing = () => {
            Promise.resolve().then(() => {

                let btnShowMoreWR = mWeakRef(document.querySelector('#show-more[disabled]'));

                let lastVisibleItemWR = null;
                for (const elm of document.querySelectorAll('[wSr93]')) {
                    if (elm.getAttribute('wSr93') === 'visible') lastVisibleItemWR = mWeakRef(elm);
                    elm.setAttribute('wSr93', '');
                    // custom CSS property --wsr94 not working when attribute wSr93 removed
                }
                requestAnimationFrame(() => {
                    const btnShowMore = getElemFromWR(btnShowMoreWR); btnShowMoreWR = null;
                    if (btnShowMore) btnShowMore.click();
                    else {
                        // would not work if switch it frequently
                        const lastVisibleItem = getElemFromWR(lastVisibleItemWR); lastVisibleItemWR = null;
                        if (lastVisibleItem) {

                            Promise.resolve()
                                .then(() => lastVisibleItem.scrollIntoView())
                                .then(() => lastVisibleItem.scrollIntoView(false))
                                .then(() => lastVisibleItem.scrollIntoView({ behavior: "instant", block: "end", inline: "nearest" }))
                                .catch(e => { }) // break the chain when method not callable

                        }
                    }
                })

            })

        }

        const mutObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if ((mutation.addedNodes || 0).length >= 1) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeName === 'STYLE') {
                            clearContentVisibilitySizing();
                            return;
                        }
                    }
                }
                if ((mutation.removedNodes || 0).length >= 1) {
                    for (const removedNode of mutation.removedNodes) {
                        if (removedNode.nodeName === 'STYLE') {
                            clearContentVisibilitySizing();
                            return;
                        }
                    }
                }
            }
        });

        mutObserver.observe(document.documentElement, {
            childList: true,
            subtree: false
        })

        mutObserver.observe(document.head, {
            childList: true,
            subtree: false
        })
        mutObserver.observe(document.body, {
            childList: true,
            subtree: false
        });

    }

    const setupStyle = (m1, m2) => {

        const dummy1v = {
            transform: '',
            height: '',
            minHeight: '',
            paddingBottom: '',
            paddingTop: ''
        };
        for (const k of ['toString', 'getPropertyPriority', 'getPropertyValue', 'item', 'removeProperty', 'setProperty']) {
            dummy1v[k] = ((k) => (function () { const style = this[sp7]; return style[k](...arguments); }))(k)
        }

        const dummy1p = proxyHelperFn(dummy1v);
        const sp1v = new Proxy(m1.style, dummy1p);
        const sp2v = new Proxy(m2.style, dummy1p);
        Object.defineProperty(m1, 'style', { get() { return sp1v }, set() { }, enumerable: true, configurable: true });
        Object.defineProperty(m2, 'style', { get() { return sp2v }, set() { }, enumerable: true, configurable: true });
        m1.removeAttribute("style");
        m2.removeAttribute("style");

    }


    class WillChangeController {
        constructor(itemScroller, willChangeValue) {
            this.element = itemScroller;
            this.counter = 0;
            this.active = false;
            this.willChangeValue = willChangeValue;
        }

        beforeOper() {
            if (!this.active) {
                this.active = true;
                this.element.style.willChange = this.willChangeValue;
            }
            this.counter++;
        }

        afterOper() {
            const c = this.counter;
            requestAnimationFrame(() => {
                if (c === this.counter) {
                    this.active = false;
                    this.element.style.willChange = '';
                }
            })
        }

        release() {
            const element = this.element;
            this.element = null;
            this.counter = 1e16;
            this.active = false;
            try {
                element.style.willChange = '';
            } catch (e) { }
        }

    }


    customYtElements.onRegistryReady(() => {

        let scrollWillChangeController = null;
        let contensWillChangeController = null;

        // as it links to event handling, it has to be injected using immediateCallback
        customYtElements.whenRegistered('yt-live-chat-item-list-renderer', (cProto) => {

            const mclp = cProto;
            console.assert(typeof mclp.scrollToBottom_ === 'function')
            console.assert(typeof mclp.scrollToBottom66_ !== 'function')
            console.assert(typeof mclp.flushActiveItems_ === 'function')
            console.assert(typeof mclp.flushActiveItems66_ !== 'function')


            mclp.__intermediate_delay__ = null;

            mclp.scrollToBottom66_ = mclp.scrollToBottom_;
            mclp.scrollToBottom_ = function () {
                const cnt = this;
                const itemScroller = cnt.itemScroller;
                if (scrollWillChangeController && scrollWillChangeController.element !== itemScroller) {
                    scrollWillChangeController.release();
                    scrollWillChangeController = null;
                }
                if (!scrollWillChangeController) scrollWillChangeController = new WillChangeController(itemScroller, 'scroll-position');
                const wcController = scrollWillChangeController;
                wcController.beforeOper();
                cnt.__intermediate_delay__ = new Promise(resolve => {
                    Promise.resolve().then(() => {
                        cnt.scrollToBottom66_();
                    }).then(() => {
                        wcController.afterOper();
                        resolve();
                    });
                });
            }

            mclp.flushActiveItems77_ = async function () {
                try {

                    const cnt = this;
                    if (lastFlushActiveItemsCalled > 1e9) lastFlushActiveItemsCalled = 9;
                    let tid = ++lastFlushActiveItemsCalled;
                    if (tid !== lastFlushActiveItemsCalled || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                    if (!cnt.activeItems_ || cnt.activeItems_.length === 0) return;
                    if (cnt.canScrollToBottom_()) {
                        let immd = cnt.__intermediate_delay__;
                        await new Promise(requestAnimationFrame);
                        if (tid !== lastFlushActiveItemsCalled || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                        if (!cnt.activeItems_ || cnt.activeItems_.length === 0) return;

                        const items = (cnt.$ || 0).items;
                        if (contensWillChangeController && contensWillChangeController.element !== items) {
                            contensWillChangeController.release();
                            contensWillChangeController = null;
                        }
                        if (!contensWillChangeController) contensWillChangeController = new WillChangeController(items, 'contents');
                        const wcController = contensWillChangeController;
                        cnt.__intermediate_delay__ = Promise.all([cnt.__intermediate_delay__ || null, immd || null]);
                        wcController.beforeOper();
                        await Promise.resolve();
                        const len1 = cnt.activeItems_.length;
                        cnt.flushActiveItems66_();
                        const len2 = cnt.activeItems_.length;
                        let bAsync = len1 !== len2;
                        await Promise.resolve();
                        if (bAsync) {
                            cnt.async(() => {
                                wcController.afterOper();
                            });
                        } else {
                            wcController.afterOper();
                        }
                    } else {
                        cnt.flushActiveItems66_();
                    }
                } catch (e) {
                    console.warn(e);
                }
            }

            mclp.flushActiveItems66_ = mclp.flushActiveItems_;
            let lastFlushActiveItemsCalled = 0;
            mclp.flushActiveItems_ = function () {
                const cnt = this;

                if (arguments.length !== 0 || !cnt.activeItems_ || !cnt.canScrollToBottom_) return cnt.flushActiveItems66_.apply(this, arguments);

                if (cnt.activeItems_.length === 0) {
                    cnt.__intermediate_delay__ = null;
                    return;
                }

                // ignore previous __intermediate_delay__ and create a new one
                cnt.__intermediate_delay__ = new Promise(resolve => {
                    cnt.flushActiveItems77_().then(resolve);
                });

            }

            mclp.async66 = mclp.async;
            mclp.async = function () {
                // ensure the previous operation is done
                // .async is usually after the time consuming functions like flushActiveItems_ and scrollToBottom_

                (this.__intermediate_delay__ || Promise.resolve()).then(() => {
                    this.async66.apply(this, arguments);
                });

            }

        })

    });

    const getProto = (element) => {
        let proto = null;
        if (element) {
            if (element.inst) proto = element.inst.constructor.prototype;
            else proto = element.constructor.prototype;
        }
        return proto || null;
    }

    let done = 0;
    let main = async (q) => {

        if (done) return;

        if (!q) return;
        let m1 = nodeParent(q);
        let m2 = q;
        if (!(m1 && m1.id === 'item-offset' && m2 && m2.id === 'items')) return;

        done = 1;

        Promise.resolve().then(watchUserCSS);

        addCss();

        setupStyle(m1, m2);

        let lcRendererWR = null;

        const lcRendererElm = () => {
            let lcRenderer = kRef(lcRendererWR);
            if (!lcRenderer || !lcRenderer.isConnected) {
                lcRenderer = document.querySelector('yt-live-chat-item-list-renderer.yt-live-chat-renderer');
                lcRendererWR = lcRenderer ? mWeakRef(lcRenderer) : null;
            }
            return lcRenderer
        };

        let hasFirstShowMore = false;

        const visObserverFn = (entry) => {

            const target = entry.target;
            if (!target) return;
            let isVisible = entry.isIntersecting === true && entry.intersectionRatio > 0.5;
            const h = entry.boundingClientRect.height;
            if (h < 16) { // wrong: 8 (padding/margin); standard: 32; test: 16 or 20
                // e.g. under fullscreen. the element created but not rendered.
                target.setAttribute('wSr93', '');
                return;
            }
            if (isVisible) {
                target.style.setProperty('--wsr94', h + 'px');
                target.setAttribute('wSr93', 'visible');
                if (nNextElem(target) === null) {
                    // firstVisibleItemDetected = true;
                    /*
                      if (dateNow() - lastScroll < 80) {
                          lastLShow = 0;
                          lastScroll = 0;
                          Promise.resolve().then(clickShowMore);
                      } else {
                          lastLShow = dateNow();
                      }
                      */
                    // lastLShow = dateNow();
                } else if (!hasFirstShowMore) { // should more than one item being visible
                    // implement inside visObserver to ensure there is sufficient delay
                    hasFirstShowMore = true;
                    requestAnimationFrame(() => {
                        // foreground page
                        // activeDeferredAppendChild = true;
                        // page visibly ready -> load the latest comments at initial loading
                        const lcRenderer = lcRendererElm();
                        if (lcRenderer) {
                            (lcRenderer.inst || lcRenderer).scrollToBottom_();
                        }
                    });
                }
            }
            else if (target.getAttribute('wSr93') === 'visible') { // ignore target.getAttribute('wSr93') === '' to avoid wrong sizing

                target.style.setProperty('--wsr94', h + 'px');
                target.setAttribute('wSr93', 'hidden');
            } // note: might consider 0 < entry.intersectionRatio < 0.5 and target.getAttribute('wSr93') === '' <new last item>

        }

        const visObserver = new IntersectionObserver((entries) => {

            for (const entry of entries) {

                Promise.resolve(entry).then(visObserverFn);

            }

        }, {
            /*
        root: items,
        rootMargin: "0px",
        threshold: 1.0,
        */
            // root: HTMLElement.prototype.closest.call(m2, '#item-scroller.yt-live-chat-item-list-renderer'), // nullable
            rootMargin: "0px",
            threshold: [0.05, 0.95],
        });

        //m2.style.visibility='';

        const mutFn = (items) => {
            for (let node = nLastElem(items); node !== null; node = nPrevElem(node)) {
                if (node.hasAttribute('wSr93')) break;
                node.setAttribute('wSr93', '');
                visObserver.observe(node);
            }
        }

        const mutObserver = new MutationObserver((mutations) => {
            const items = (mutations[0] || 0).target;
            if (!items) return;
            mutFn(items);
        });

        const setupMutObserver = (m2) => {
            mutObserver.disconnect();
            mutObserver.takeRecords();
            if (m2) {
                mutObserver.observe(m2, {
                    childList: true,
                    subtree: false
                });
                mutFn(m2);
            }
        }

        setupMutObserver(m2);

        const mclp = getProto(document.querySelector('yt-live-chat-item-list-renderer'));
        if (mclp && mclp.attached) {

            mclp.attached66 = mclp.attached;
            mclp.attached = function () {
                let m2 = document.querySelector('#item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer');
                let m1 = nodeParent(m2);
                setupStyle(m1, m2);
                setupMutObserver(m2);
                return this.attached66();
            }

            mclp.detached66 = mclp.detached;
            mclp.detached = function () {
                setupMutObserver();
                return this.detached66();
            }

            mclp.canScrollToBottom_ = function () {
                return this.atBottom && this.allowScroll && !(dateNow() - lastWheel < 80)
            }

            mclp.isSmoothScrollEnabled_ = function () {
                return false;
            }

        } else {
            console.warn(`proto.attached for yt-live-chat-item-list-renderer is unavailable.`)
        }


        let scrollCount = 0;
        document.addEventListener('scroll', (evt) => {
            if (!evt || !evt.isTrusted) return;
            // lastScroll = dateNow();
            if (++scrollCount > 1e9) scrollCount = 9;
        }, { passive: true, capture: true }) // support contain => support passive

        // document.addEventListener('scroll', (evt) => {

        //     if (!evt || !evt.isTrusted) return;
        //     if (!firstVisibleItemDetected) return;
        //     const isUserAction = dateNow() - lastWheel < 80; // continuous wheel -> continuous scroll -> continuous wheel -> continuous scroll
        //     if (!isUserAction) return;
        //     // lastScroll = dateNow();

        // }, { passive: true, capture: true }) // support contain => support passive


        let lastScrollCount = -1;
        document.addEventListener('wheel', (evt) => {

            if (!evt || !evt.isTrusted) return;
            if (lastScrollCount === scrollCount) return;
            lastScrollCount = scrollCount;
            lastWheel = dateNow();

        }, { passive: true, capture: true }) // support contain => support passive


        const fp = (renderer) => {
            const cnt = renderer.inst || renderer;
            const container = (cnt.$ || 0).container;
            if (container) {
                container.setAttribute = tickerContainerSetAttribute;
            }
        }
        const tags = ["yt-live-chat-ticker-paid-message-item-renderer", "yt-live-chat-ticker-paid-sticker-item-renderer",
            "yt-live-chat-ticker-renderer", "yt-live-chat-ticker-sponsor-item-renderer"];
        for (const tag of tags) {
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
                console.warn(`proto.attached for ${tag} is unavailable.`)
                continue;
            }

            const __updateTimeout__ = cProto.updateTimeout;

            const canDoUpdateTimeoutReplacement = (() => {

                if (dummy.countdownMs < 1 && dummy.lastCountdownTimeMs < 1 && dummy.countdownMs < 1 && dummy.countdownDurationMs < 1) {
                    return typeof dummy.setContainerWidth === 'function' && typeof dummy.slideDown === 'function';
                }
                return false;

            })(dummy.inst || dummy) && ((__updateTimeout__ + "").indexOf("window.requestAnimationFrame(this.updateTimeout.bind(this))") > 0);



            if (canDoUpdateTimeoutReplacement) {

                const killTicker = (cnt) => {
                    if ("auto" === cnt.hostElement.style.width) cnt.setContainerWidth();
                    cnt.slideDown()
                };

                cProto.__ratio__ = null;
                cProto._updateTimeout21_ = function (a) {

                    /*
                    let pRatio = this.countdownMs / this.countdownDurationMs;
                    this.countdownMs -= (a - (this.lastCountdownTimeMs || 0));
                    let noMoreCountDown = this.countdownMs < 1e-6;
                    let qRatio = this.countdownMs / this.countdownDurationMs;
                    if(noMoreCountDown){
                        this.countdownMs = 0;
                        this.ratio = 0;
                    } else if( pRatio - qRatio < 0.001 && qRatio < pRatio){

                    }else{
                        this.ratio = qRatio;
                    }
                    */

                    this.countdownMs -= (a - (this.lastCountdownTimeMs || 0));

                    let currentRatio = this.__ratio__;
                    let tdv = this.countdownMs / this.countdownDurationMs;
                    let nextRatio = Math.round(tdv * 500) / 500; // might generate 0.143000000001

                    const validCountDown = nextRatio > 0;
                    const isAttached = this.isAttached;

                    if (!validCountDown) {

                        this.lastCountdownTimeMs = null;

                        this.countdownMs = 0;
                        this.__ratio__ = null;
                        this.ratio = 0;

                        if (isAttached) Promise.resolve(this).then(killTicker);

                    } else if (!isAttached) {

                        this.lastCountdownTimeMs = null;

                    } else {

                        this.lastCountdownTimeMs = a;

                        const ratioDiff = currentRatio - nextRatio;  // 0.144 - 0.142 = 0.002
                        if (ratioDiff < 0.001 && ratioDiff > -1e-6) {
                            // ratioDiff = 0

                        } else {
                            // ratioDiff = 0.002 / 0.004 ....
                            // OR ratioDiff < 0

                            this.__ratio__ = nextRatio;

                            this.ratio = nextRatio;
                        }

                        return true;
                    }

                };

                cProto._updateTimeout21_ = function (a) {
                    this.countdownMs = Math.max(0, this.countdownMs - (a - (this.lastCountdownTimeMs || 0)));
                    this.ratio = this.countdownMs / this.countdownDurationMs;
                    if (this.isAttached && this.countdownMs) {
                        this.lastCountdownTimeMs = a;
                        return true;
                    } else {
                        this.lastCountdownTimeMs = null;
                        if (this.isAttached) {
                            ("auto" === this.hostElement.style.width && this.setContainerWidth(), this.slideDown())
                        }
                    }
                }


                // temporarily removed; buggy for playback
                /*
                  cProto.updateTimeout = async function (a) {
  
                      let ret = this._updateTimeout21_(a);
                      while (ret) {
                          let a = await new Promise(resolve => {
                              this.rafId = requestAnimationFrame(resolve)
                          }); // could be never resolve
                          ret = this._updateTimeout21_(a);
                      }
  
                  };
                */


            }

            cProto.attached77 = cProto.attached

            cProto.attached = function () {
                fp(this.hostElement || this);
                return this.attached77();
            }

            for (const elm of document.getElementsByTagName(tag)) {
                fp(elm);
            }


        }

    };


    function onReady() {
        let tmObserver = new MutationObserver(() => {

            let p = document.getElementById('items'); // fast
            if (!p) return;
            let q = document.querySelector('#item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer'); // check

            if (q) {
                tmObserver.disconnect();
                tmObserver.takeRecords();
                tmObserver = null;
                Promise.resolve(q).then((q) => {
                    // confirm Promis.resolve() is resolveable
                    // execute main without direct blocking
                    main(q);
                })
            }

        });

        tmObserver.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });

    }

    Promise.resolve().then(() => {

        if (document.readyState !== 'loading') {
            onReady();
        } else {
            window.addEventListener("DOMContentLoaded", onReady, false);
        }

    });

})({ Promise, requestAnimationFrame, IntersectionObserver });
