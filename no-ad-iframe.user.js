// ==UserScript==
// @name         No Ad IFrame
// @namespace    https://staybrowser.com/
// @version      0.1.1

// @description         No Ad IFrame created by Stay
// @description:en      No Ad IFrame created by Stay
// @description:ja      No Ad IFrame created by Stay
// @description:zh-TW   No Ad IFrame created by Stay
// @description:zh-CN   No Ad IFrame created by Stay

// @author       You
// @match        *://*/*
// @grant        none
// @inject-into page
// @unwrap
// @run-at              document-start
// @license             MIT
// @compatible          chrome
// @compatible          firefox
// @compatible          opera
// @compatible          edge
// @compatible          safari
// @allFrames           true
// ==/UserScript==
(function () {
    'use strict';

    const TURN_ON_BLOCK_REMOVAL = true;

    if (Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "__src437__")) return;

    Object.defineProperty(HTMLIFrameElement.prototype, "__src437__", {
        value: undefined,
        writable: true,
        configurable: false,
        enumerable: false
    });

    if (!Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "__src437__")) return;

    const pd1 = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "src");
    const pd2 = Object.assign({}, pd1, {
        configurable: true,
        enumerable: true
    });

    const wSnb = Symbol();

    const adFilter = {

        'iframe[src*="doubleclick.net"]': 1,
        'iframe[src*="googlesyndication.com"]': 1,
        'iframe[src*="googleadservices.com"]': 1,
        'iframe[src*="googletagservices.com"]': 1,
        'iframe[src*="adservice.google.com"]': 1,
        'iframe[src*="adservice.yahoo.com"]': 1,
        'iframe[src*="amazon-adsystem.com"]': 1,
        'iframe[src*="adroll.com"]': 1,
        'iframe[src*="ads-twitter.com"]': 1,
        'iframe[src*="criteo.com"]': 1,
        'iframe[src*="taboola.com"]': 1,
        'iframe[src*="outbrain.com"]': 1,
        'iframe[src*="smartadserver.com"]': 1,
        'iframe[src*="openx.net"]': 1,
        'iframe[src*="rubiconproject.com"]': 1,

        'iframe[id^="aswift_"][src*="ads"][3]': 1,
        'iframe[id^="google_ads_iframe_"]': 1,
        'iframe[name^="google_ads_iframe_"]': 1,
        // 'iframe[src*="doubleclick.net"]': 1,
        // 'iframe[src*="googlesyndication.com"]': 1,
        'iframe[src*="adservice"]': 1,
        'iframe[src*="adserver"]': 1,
        // 'iframe[src*="/ads/"]': 1,
        // 'iframe[class*="ad-"]': 1,
        'iframe[data-ad-slot]': 1,

        // Additional patterns
        'iframe[id*="adframe"]': 1,         // Common variation like "adframe"
        'iframe[id*="ad_iframe"]': 1,       // "ad_iframe" naming pattern
        'iframe[id*="ad_container"]': 1,    // Container-like naming often used for ads
        'iframe[id*="ad_wrapper"]': 1,      // Another container naming pattern

        'iframe[class*="adslot"]': 1,       // "adslot" is a known pattern (e.g., GPT ad slots)
        'iframe[class*="adsense"]': 1,      // "adsense" typically indicates Google AdSense
        'iframe[class*="ad_frame"]': 1,     // Variation with underscore
        // 'iframe[class*="advert"]': 1,       // "advert" is another clue

        // Attribute patterns
        'iframe[data-ad-client]': 1,         // Data attribute used by some ad scripts
        'iframe[data-ad-region]': 1,         // Another ad-related data attribute

    };

    function createBase64DataURL(title) {
        // Construct a minimal HTML5 page with the given title
        const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${title}</title></head><body></body></html>`;

        // Encode the HTML string into Base64
        const base64String = btoa(html);

        // Return as a Data URL
        return `data:text/html;base64,${base64String}`;
    }


    const dynamicGeneration = () => {
        const key = Math.floor(Math.random() * 314159265359 + 314159265359).toString(36);
        return createBase64DataURL(key);
    }

    const caching = new Map();

    const hKey = `e-${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;

    const checkOnly = (elm) => {

        let noP = true;
        let noQ = true;
        let t = elm || 0;
        while (t = t.previousSibling) {

            if (t instanceof Text) {
                if (t.textContent.trim().length > 0) {
                    noP = false;
                    break;
                }
            } else if (t instanceof Element) {
                const nd = t.nodeName;
                if (nd === 'NOSCRIPT' || nd === 'SCRIPT' || nd === 'STYLE') continue;
                noP = false;
                break;
            } else if (t instanceof Comment) {

            } else {
                noP = false;
                break;
            }
        }
        if (noP === false) return false;

        t = elm || 0;
        while (t = t.nextSibling) {

            if (t instanceof Text) {
                if (t.textContent.trim().length > 0) {
                    noQ = false;
                    break;
                }
            } else if (t instanceof Element) {
                const nd = t.nodeName;
                if (nd === 'NOSCRIPT' || nd === 'SCRIPT' || nd === 'STYLE') continue;
                noQ = false;
                break;
            } else if (t instanceof Comment) {

            } else {
                noQ = false;
                break;
            }
        }

        if (noQ === false) return false;

        return true;


    };
    const hideIframe = (iframe) => {
        let noscriptWrapOK = false;
        try {
            if (iframe instanceof HTMLIFrameElement && iframe.isConnected === true && (iframe.parentNode || 0).nodeName !== 'NOSCRIPT') {
                const noscript = document.createElement('noscript');
                iframe.replaceWith(noscript);
                noscript.appendChild(iframe);
                noscriptWrapOK = true;
            }
        } catch (e) {
            console.warn(e);
        }

        if (TURN_ON_BLOCK_REMOVAL && noscriptWrapOK) {
            let layerNMax = 8;
            let parent = iframe;
            let lastSuccess = iframe;
            while (parent instanceof HTMLElement && checkOnly(parent)) {
                lastSuccess = parent;
                parent = parent.parentNode;
                layerNMax--;
                if (!layerNMax) break;
            }

            const effectNode = parent instanceof HTMLElement ? parent : lastSuccess;

            if ((effectNode instanceof HTMLElement) && effectNode.nodeName !== "NOSCRIPT") {
                effectNode.setAttribute(hKey, '');
                let noscriptWrapOK = false;
                try {
                    const noscript = document.createElement('noscript');
                    effectNode.replaceWith(noscript);
                    noscript.appendChild(effectNode);
                    noscriptWrapOK = true;
                } catch (e) { }
                if (!noscriptWrapOK) {
                    effectNode.style.setProperty('position', 'fixed', 'important');
                    effectNode.style.setProperty('left', '-130vw', 'important');
                    effectNode.style.setProperty('top', '-140vh', 'important');
                }
            }

        }

    };


    const convertionUrl = (nv, iframe) => {

        let btt = 0;

        if (typeof nv == 'string' && nv.length > 15 && iframe instanceof HTMLIFrameElement) {
            if ((iframe.parentNode || 0).nodeName === 'NOSCRIPT') return null;
            if (nv.length >= 22 && nv.startsWith('data:text/html;base64,')) return null;
            btt = 1;
        } else if ((nv || '') === '' && iframe instanceof HTMLIFrameElement) {
            btt = 2;
        }


        if (btt > 0) {
            if (btt === 1) {
                const cv = caching.get(nv);
                if (cv !== undefined) return cv;
            }
            for (const adf of Object.keys(adFilter)) {
                const adk = adf.replace(/\[\d+\w*\]/g, '');
                if (iframe.matches(adk)) {
                    const w = adFilter[adf];
                    const bv = typeof w === 'string' ? w : dynamicGeneration();
                    if (btt === 1) {
                        caching.set(nv, bv);
                        caching.set(bv, bv);
                    }
                    return bv;
                }
            }
            if (btt === 1) {
                caching.set(nv, null);
            }
        }
        return null;
    };
    const pd3 = {
        set(nv) {
            if (typeof nv === 'string') {
                if (this[wSnb] === nv) return true;
                if (nv.length >= 22 && nv.startsWith('data:text/html;base64,')) {
                } else if (nv.length > 15) {
                    const bv = convertionUrl(nv, this);
                    if (bv) {
                        hideIframe(this);
                        if ((this.parentNode || 0).nodeName !== 'NOSCRIPT') nv = bv;
                    }
                }
            }
            this[wSnb] = nv;
            return true;
        },
        get() {
            return this[wSnb];
        },
        configurable: true,
        enumerable: true
    };

    Object.defineProperty(HTMLIFrameElement.prototype, wSnb, pd2);


    Object.defineProperty(HTMLIFrameElement.prototype, "src", pd3);


    document.addEventListener('load', function (evt) {
        const evtTarget = evt.target;
        if (evtTarget instanceof HTMLIFrameElement) {
            const bv = convertionUrl(evtTarget.src, evtTarget);
            if (bv) {
                hideIframe(evtTarget);
                if ((evtTarget.parentNode || 0).nodeName !== 'NOSCRIPT') evtTarget.src = bv;
                evt.stopPropagation();
                evt.stopImmediatePropagation();
                evt.preventDefault();
            }
        }
    }, true);

    const um = new WeakSet();

    const iframeAll = document.getElementsByTagName('iframe');
    let iframeLC = 0;
    new MutationObserver(() => {
        const iframeTC = iframeAll.length;
        if (iframeTC !== iframeLC) {
            iframeLC = iframeTC;
            for (const iframe of iframeAll) {
                if (um.has(iframe)) continue;
                um.add(iframe);
                const bv = convertionUrl(iframe.src, iframe);
                if (bv) {
                    hideIframe(iframe);
                    if ((iframe.parentNode || 0).nodeName !== 'NOSCRIPT') iframe.src = bv;
                }
            }
        }
    }).observe(document, { subtree: true, childList: true });

    // Your code here...
})();
