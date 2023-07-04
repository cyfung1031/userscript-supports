// ==UserScript==
// @name                YouTube Super Fast Chat
// @version             0.5.5
// @license             MIT
// @name:ja             YouTube スーパーファーストチャット
// @name:zh-TW          YouTube 超快聊天
// @name:zh-CN          YouTube 超快聊天
// @namespace           UserScript
// @match               https://www.youtube.com/live_chat*
// @author              CY Fung
// @require             https://greasyfork.org/scripts/465819-api-for-customelements-in-youtube/code/API%20for%20CustomElements%20in%20YouTube.js?version=1215161
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
      [wSr93*="i"] {
        --wsr93-contain: size layout style;
        height: var(--wsr94);
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

      #item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer {
        position: static !important;
      }

      /* ------------------------------------------------------------------------------------------------------------- */
      yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image img {
        contain: layout style;
      }

      /*
      yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip,
      yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer,
      yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image,
      yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image img {
        contain: layout style;
        display: inline-flex;
        vertical-align: middle;
      }
      */
     /*
      #items yt-live-chat-text-message-renderer {
        contain: layout style;
      }
      */

      yt-live-chat-item-list-renderer:not([allow-scroll]) #item-scroller.yt-live-chat-item-list-renderer {
        overflow-y: scroll;
        padding-right: 0;
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

      /*
      #item-offset.style-scope.yt-live-chat-item-list-renderer {
        position: relative !important;
        height: auto !important;
      }
      */

      /* ------------------------------------------------------------------------------------------------------------- */


      #items.style-scope.yt-live-chat-item-list-renderer {
        padding-top: var(--items-top-padding);
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

    }

    `;

    const { Promise, requestAnimationFrame, IntersectionObserver } = __CONTEXT__;


    const isContainSupport = CSS.supports('contain', 'layout paint style');
    if (!isContainSupport) {
        console.error(`
  YouTube Light Chat Scroll: Your browser does not support 'contain'.
  Chrome >= 52; Edge >= 79; Safari >= 15.4, Firefox >= 69; Opera >= 39
  `.trim());
        return;
    }

    // const APPLY_delayAppendChild = false;

    let activeDeferredAppendChild = false; // deprecated

    // let delayedAppendParentWS = new WeakSet();
    // let delayedAppendOperations = [];
    // let commonAppendParentStackSet = new Set();

    let firstVisibleItemDetected = false; // deprecated

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


    // const dummy3v = {
    //   "background": "",
    //   "backgroundAttachment": "",
    //   "backgroundBlendMode": "",
    //   "backgroundClip": "",
    //   "backgroundColor": "",
    //   "backgroundImage": "",
    //   "backgroundOrigin": "",
    //   "backgroundPosition": "",
    //   "backgroundPositionX": "",
    //   "backgroundPositionY": "",
    //   "backgroundRepeat": "",
    //   "backgroundRepeatX": "",
    //   "backgroundRepeatY": "",
    //   "backgroundSize": ""
    // };
    // for (const k of ['toString', 'getPropertyPriority', 'getPropertyValue', 'item', 'removeProperty', 'setProperty']) {
    //   dummy3v[k] = ((k) => (function () { const style = this[sp7]; return style[k](...arguments); }))(k)
    // }

    // const dummy3p = phFn(dummy3v);

    const pt2DecimalFixer = (x) => Math.round(x * 5, 0) / 5;

    const tickerContainerSetAttribute = function (attrName, attrValue) {

        let yd = (this.__dataHost || 0).__data;

        if (arguments.length === 2 && attrName === 'style' && yd && attrValue) {

            // let v = yd.containerStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_;
            let v = `${attrValue}`;
            // conside a ticker is 101px width
            // 1% = 1.01px
            // 0.2% = 0.202px


            const ratio1 = (yd.ratio * 100);
            if (ratio1 > -1) { // avoid NaN

                const ratio2 = pt2DecimalFixer(ratio1);
                v = v.replace(`${ratio1}%`, `${ratio2}%`).replace(`${ratio1}%`, `${ratio2}%`)

                if (yd.__style_last__ === v) return;
                yd.__style_last__ = v;

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


    let scrollWillChangeController = null;
    let contensWillChangeController = null;

    // as it links to event handling, it has to be injected using immediateCallback
    customYtElements.whenRegistered('yt-live-chat-item-list-renderer', (proto) => {

        const mclp = proto;
        console.assert(typeof mclp.scrollToBottom_ === 'function')
        console.assert(typeof mclp.scrollToBottom66_ !== 'function')
        console.assert(typeof mclp.flushActiveItems_ === 'function')
        console.assert(typeof mclp.flushActiveItems66_ !== 'function')


        mclp.__intermediate_delay__ = null;

        mclp.scrollToBottom66_ = mclp.scrollToBottom_;
        mclp.scrollToBottom_ = function () {
            const itemScroller = this.itemScroller;
            if (scrollWillChangeController && scrollWillChangeController.element !== itemScroller) {
                scrollWillChangeController.release();
                scrollWillChangeController = null;
            }
            if (!scrollWillChangeController) scrollWillChangeController = new WillChangeController(itemScroller, 'scroll-position');
            const controller = scrollWillChangeController;
            controller.beforeOper();

            this.__intermediate_delay__ = new Promise(resolve => {
                Promise.resolve().then(() => {
                    this.scrollToBottom66_()
                    resolve();
                }).then(() => {
                    controller.afterOper();
                });
            });
        }

        mclp.flushActiveItems66_ = mclp.flushActiveItems_;
        mclp.flushActiveItems_ = function () {

            if (arguments.length !== 0) return this.flushActiveItems66_.apply(this, arguments);

            if (this.activeItems_.length === 0) {
                this.__intermediate_delay__ = null;
                return;
            }

            const items = this.$.items;
            if (contensWillChangeController && contensWillChangeController.element !== items) {
                contensWillChangeController.release();
                contensWillChangeController = null;
            }
            if (!contensWillChangeController) contensWillChangeController = new WillChangeController(items, 'contents');
            const controller = contensWillChangeController;

            // ignore previous __intermediate_delay__ and create a new one
            this.__intermediate_delay__ = new Promise(resolve => {
                if (this.activeItems_.length === 0) {
                    resolve();
                } else {
                    if (this.canScrollToBottom_()) {
                        controller.beforeOper();
                        Promise.resolve().then(() => {
                            this.flushActiveItems66_();
                            resolve();
                        }).then(() => {
                            this.async(() => {
                                controller.afterOper();
                                resolve();
                            });
                        })
                    } else {
                        Promise.resolve().then(() => {
                            this.flushActiveItems66_();
                            resolve();
                        })
                    }
                }
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
                lcRendererWR = mWeakRef(lcRenderer);
            }
            return lcRenderer
        };

        let hasFirstShowMore = false;

        const visObserver = new IntersectionObserver((entries) => {

            for (const entry of entries) {

                const target = entry.target;
                if (!target) continue;
                let isVisible = entry.isIntersecting === true && entry.intersectionRatio > 0.5;
                const h = entry.boundingClientRect.height;
                if (h < 16) { // wrong: 8 (padding/margin); standard: 32; test: 16 or 20
                    // e.g. under fullscreen. the element created but not rendered.
                    target.setAttribute('wSr93', '');
                    continue;
                }
                if (isVisible) {
                    target.style.setProperty('--wsr94', h + 'px');
                    target.setAttribute('wSr93', 'visible');
                    if (nNextElem(target) === null) {
                        firstVisibleItemDetected = true;
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
                            activeDeferredAppendChild = true;
                            // page visibly ready -> load the latest comments at initial loading
                            const lcRenderer = lcRendererElm();
                            lcRenderer.scrollToBottom_();
                        });
                    }
                }
                else if (target.getAttribute('wSr93') === 'visible') { // ignore target.getAttribute('wSr93') === '' to avoid wrong sizing

                    target.style.setProperty('--wsr94', h + 'px');
                    target.setAttribute('wSr93', 'hidden');
                } // note: might consider 0 < entry.intersectionRatio < 0.5 and target.getAttribute('wSr93') === '' <new last item>

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


        const mclp = (customElements.get('yt-live-chat-item-list-renderer') || 0).prototype
        if (mclp) {

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
            const container = renderer.$.container;
            if (container) {
                container.setAttribute = tickerContainerSetAttribute;
            }
        }
        const tags = ["yt-live-chat-ticker-paid-message-item-renderer", "yt-live-chat-ticker-paid-sticker-item-renderer",
            "yt-live-chat-ticker-renderer", "yt-live-chat-ticker-sponsor-item-renderer"];
        for (const tag of tags) {
            const proto = customElements.get(tag).prototype;
            proto.attached77 = proto.attached

            proto.attached = function () {
                fp(this);
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

        tmObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

    }

    if (document.readyState != 'loading') {
        onReady();
    } else {
        window.addEventListener("DOMContentLoaded", onReady, false);
    }

})({ Promise, requestAnimationFrame, IntersectionObserver });
