// ==UserScript==
// @name                YouTube: Add Channel Name to Shorts Thumbnail
// @namespace           UserScript
// @match               https://www.youtube.com/*
// @version             0.2.6
// @license             MIT License
// @author              CY Fung
// @grant               none
// @unwrap
// @inject-into         page
// @run-at              document-start
// @description         To add channel name to YouTube Shorts thumbnail
// @description:ja      YouTube Shortsのサムネイルにチャンネル名を追加する
// @description:zh-TW   在 YouTube Shorts 縮圖中添加頻道名稱
// @description:zh-CN   在 YouTube Shorts 缩略图中添加频道名称
// @require             https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@8fac46500c5a916e6ed21149f6c25f8d1c56a6a3/library/ytZara.js
// ==/UserScript==

/*

MIT License

Copyright 2024 CY Fung

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



(() => {


  !window.TTP && (() => {
    // credit to Benjamin Philipp
    // original source: https://greasyfork.org/en/scripts/433051-trusted-types-helper

    // --------------------------------------------------- Trusted Types Helper ---------------------------------------------------

    const overwrite_default = false; // If a default policy already exists, it might be best not to overwrite it, but to try and set a custom policy and use it to manually generate trusted types. Try at your own risk
    const prefix = `TTP`;
    var passThroughFunc = function (string, sink) {
      return string; // Anything passing through this function will be returned without change
    }
    var TTPName = "passthrough";
    var TTP_default, TTP = { createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc }; // We can use TTP.createHTML for all our assignments even if we don't need or even have Trusted Types; this should make fallbacks and polyfills easy
    var needsTrustedHTML = false;
    function doit() {
      try {
        if (typeof window.isSecureContext !== 'undefined' && window.isSecureContext) {
          if (window.trustedTypes && window.trustedTypes.createPolicy) {
            needsTrustedHTML = true;
            if (trustedTypes.defaultPolicy) {
              log("TT Default Policy exists");
              if (overwrite_default)
                TTP = window.trustedTypes.createPolicy("default", TTP);
              else
                TTP = window.trustedTypes.createPolicy(TTPName, TTP); // Is the default policy permissive enough? If it already exists, best not to overwrite it
              TTP_default = trustedTypes.defaultPolicy;

              log("Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '" + TTPName + "' in var 'TTP':", TTP);
            }
            else {
              TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);
            }
            log("Trusted-Type Policies: TTP:", TTP, "TTP_default:", TTP_default);
          }
        }
      } catch (e) {
        log(e);
      }
    }

    function log(...args) {
      if ("undefined" != typeof (prefix) && !!prefix)
        args = [prefix + ":", ...args];
      if ("undefined" != typeof (debugging) && !!debugging)
        args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
      console.log(...args);
    }

    doit();

    // --------------------------------------------------- Trusted Types Helper ---------------------------------------------------

    window.TTP = TTP;

  })();

  function createHTML(s) {
    if (typeof TTP !== 'undefined' && typeof TTP.createHTML === 'function') return TTP.createHTML(s);
    return s;
  }

  let trustHTMLErr = null;
  try {
    document.createElement('div').innerHTML = createHTML('1');
  } catch (e) {
    trustHTMLErr = e;
  }

  if (trustHTMLErr) {
    console.log(`trustHTMLErr`, trustHTMLErr);
    trustHTMLErr(); // exit userscript
  }


  // -----------------------------------------------------------------------------------------------------------------------------




  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  const fetch_ = fetch;

  const HTMLElement_ = HTMLElement;

  /**
   *  @param {Element} elm
   * @param {string} selector
   * @returns {Element | null}
   *  */
  const qsOne = (elm, selector) => {
    return HTMLElement_.prototype.querySelector.call(elm, selector);
  }

  /**
   *  @param {Element} elm
   * @param {string} selector
   * @returns {NodeListOf<Element>}
   *  */
  const qsAll = (elm, selector) => {
    return HTMLElement_.prototype.querySelectorAll.call(elm, selector);
  }

  const cssFn = () => `

    [ePCWu]::before {
        width: 100%;
        content: attr(ePCWu);
        display: block;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
  
  `;


  const addCSSProcess = () => {
    if (document.querySelector('style#ePCWv')) return;
    const style = document.createElement('style')
    style.id = 'ePCWv'
    style.textContent = cssFn();
    document.head.appendChild(style);
  };

  const { networkRequestOfChannelName } = (() => {

    let chainPromise = Promise.resolve();

    const resolvedValues = new Map();

    /**
     * 
     * @param {Response} fetchRes
     * @param {(value: any)=>void} resolve 
     */
    const onFetched = async (fetchRes, resolve) => {
      const resText = await fetchRes.text();
      let resultName = '';
      let wIdx2 = resText.indexOf('itemprop="author"');
      let wIdx1 = wIdx2 > 0 ? resText.lastIndexOf('<span', wIdx2) : -1;
      let wIdx3 = wIdx1 > 0 ? resText.indexOf('<\/span>', wIdx2) : -1;
      if (wIdx3 > 0) {
        let mText = resText.substring(wIdx1, wIdx3 + '<\/span>'.length);
        let template = document.createElement('template');
        template.innerHTML = createHTML(mText);
        let span = template.content.firstElementChild;
        if (span && span.nodeName === "SPAN") {
          const nameElm = qsOne(span, 'link[itemprop="name"]')
          resultName = (nameElm ? nameElm.getAttribute('content') : '') || '';
        }
        template.innerHTML = createHTML('');
      }
      resolve(resultName);
    }

    const createPromise = (videoId) => {

      return new Promise(resolve => {

        chainPromise = chainPromise.then(async () => {

          let fetchRes = null;
          try {

            fetchRes = await fetch_(`/watch?v=${videoId}`, {

              "method": "GET",
              "mode": "same-origin",
              "credentials": "omit",
              referrerPolicy: "no-referrer",
              cache: "default",
              redirect: "error", // there shall be no redirection in this API request
              integrity: "",
              keepalive: false,

              "headers": {
                "Cache-Control": "public, max-age=900, stale-while-revalidate=1800",
                // refer "Cache-Control Use Case Examples" in https://www.koyeb.com/blog/using-cache-control-and-cdns-to-improve-performance-and-reduce-latency
                // seems YouTube RSS Feeds server insists its own Cache-Control.

                // "Content-Type": "text/xml; charset=UTF-8",
                "Accept-Encoding": "gzip, deflate, br", // YouTube Response - gzip
                // X-Youtube-Bootstrap-Logged-In: false,
                // X-Youtube-Client-Name: 1, // INNERTUBE_CONTEXT_CLIENT_NAME
                // X-Youtube-Client-Version: "2.20230622.06.00" // INNERTUBE_CONTEXT_CLIENT_VERSION

                "Accept": "text/html",
                "Pragma": ""
              }

            });

          } catch (e) {
            console.warn(e);
          }

          fetchRes && onFetched(fetchRes, resolve).catch(console.warn);

        });


      });


    };

    const networkRequestOfChannelName = (videoId) => {
      let promise = resolvedValues.get(videoId);
      if (!promise) {
        promise = createPromise(videoId);
        resolvedValues.set(videoId, promise);
      }
      return promise;
    }

    return { networkRequestOfChannelName };

  })();



  const firstObjectKey = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') return key;
    }
    return null;
  }

  const getEntryVideoId = (wtObj) => {

    let videoId = '';

    if (wtObj.overlayMetadata && typeof wtObj.entityId == 'string' && (wtObj.inlinePlayerData || 0).onVisible) {
      const watchEndpoint = ((wtObj.inlinePlayerData || 0).onVisible.innertubeCommand || 0).watchEndpoint || 0;
      if (watchEndpoint && typeof (watchEndpoint.videoId || 0) === 'string') {
        videoId = watchEndpoint.videoId;
      }
    }

    if (!videoId && wtObj.overlayMetadata && typeof wtObj.entityId == 'string' && (wtObj.onTap || 0).innertubeCommand) {
      const reelWatchEndpoint = ((wtObj.onTap || 0).innertubeCommand || 0).reelWatchEndpoint || 0;
      if (reelWatchEndpoint && typeof (reelWatchEndpoint.videoId || 0) === 'string') {
        videoId = reelWatchEndpoint.videoId;
      }
    }

    return videoId;
  }

  const getSubheadElement = (mainElement) => {
    return qsOne(mainElement, '.ShortsLockupViewModelHostMetadataSubhead, .ShortsLockupViewModelHostOutsideMetadataSubhead, .shortsLockupViewModelHostMetadataSubhead, .shortsLockupViewModelHostOutsideMetadataSubhead');
  }

  const addChannelNamePerItem = async (entry) => {
    const wKey = firstObjectKey(entry);
    const wObj = wKey ? entry[wKey] : null;
    if (wObj) {
      const rsVideoId = wObj.rsVideoId;
      const videoId = getEntryVideoId(wObj);
      if (videoId === rsVideoId && videoId) {
        return {
          entry,
          rsVideoId,
          rsChannelName: wObj.rsChannelName
        };
      } else if (videoId !== rsVideoId && videoId) {
        const name = await networkRequestOfChannelName(videoId);
        return {
          entry,
          rsVideoId: videoId,
          rsChannelName: name
        };
      }
    }
    return {
      entry,
      rsVideoId: '',
      rsChannelName: ''
    };
  };

  const apGridListFn = async function (cnt_) {

    const cnt = cnt_ || this;
    // const hostElement = cnt.hostElement || cnt;
    const data = cnt.data;

    const items = data.items;
    if (!items || !items.length) return;

    const itemsElm = (cnt.$ || 0).items || 0;
    if (!itemsElm) return;

    const results = await Promise.all(items.map(addChannelNamePerItem));

    const mapping = new Map();

    for (const result of results) {
      if (!result || !result.rsVideoId) continue;
      const entry = (result.entry || 0);
      if (!entry) continue;
      const wKey = firstObjectKey(entry);
      const wObj = wKey ? entry[wKey] : null;
      const entityId = wObj ? wObj.entityId : null;
      if (typeof entityId === 'string') {
        mapping.set(entityId, result);
      }
    }

    for (const elm of qsAll(itemsElm, 'ytm-shorts-lockup-view-model')) {
      const entityId = ((elm.data || 0).entityId || 0);

      let nameToAdd = '';
      if (typeof entityId === 'string') {
        const result = mapping.get(entityId);
        if (result) {
          elm.data.rsVideoId = result.rsVideoId;
          elm.data.rsChannelName = result.rsChannelName;
          nameToAdd = result.rsChannelName;
        }
      }

      const subhead = getSubheadElement(elm);
      if (subhead) {
        if (nameToAdd) {
          subhead.setAttribute('ePCWu', nameToAdd);
        } else {
          subhead.removeAttribute('ePCWu');
        }
      } else {
        console.log('subhead cannot be found', elm);
      }

    }

    mapping.clear();


  }

  const apSingleGridFn = async function (cnt_) {

    let useOldModel = true;
    const cnt = cnt_ || this;
    const hostElement = cnt.hostElement || cnt;
    let nameToAdd = '';
    const data = cnt.data;

    const details = data && data.videoType && data.videoId ? ((cnt.$ || 0).details || 0) : null;
    const content = data && data.videoType && data.videoId ? null : ((cnt.$ || 0).content || 0);

    if (data && data.videoType === "REEL_VIDEO_TYPE_VIDEO" && typeof data.videoId === 'string') {
      const videoId = data.videoId;
      if (data.rsVideoId === videoId && typeof data.rsChannelName === 'string') {
        nameToAdd = data.rsChannelName;

        const metaline = details ? qsOne(details, '#details #metadata-line') : qsOne(hostElement, 'ytd-reel-item-renderer #details #metadata-line');
        if (metaline) {
          metaline.setAttribute('ePCWu', nameToAdd);
        } else {
          console.log('metaline cannot be found', content);
        }

      } else {
        const name = await networkRequestOfChannelName(videoId);
        cnt.data = Object.assign({}, cnt.data, { rsVideoId: videoId, rsChannelName: name });
      }

    } else if (data && data.content && content instanceof Element) {

      useOldModel = false;
      const wKey = firstObjectKey(data.content);
      const wObj = wKey ? data.content[wKey] : null;

      if (wObj) {

        const rsVideoId = wObj.rsVideoId;
        const videoId = getEntryVideoId(wObj);

        if (videoId !== rsVideoId && videoId) {
          const name = await networkRequestOfChannelName(videoId);
          const newFirstObject = Object.assign({}, cnt.data.content[wKey], { rsVideoId: videoId, rsChannelName: name });
          const newContent = Object.assign({}, cnt.data.content, { [wKey]: newFirstObject });
          cnt.data = Object.assign({}, cnt.data, { content: newContent });
        } else if (rsVideoId === videoId && rsVideoId) {
          nameToAdd = wObj.rsChannelName;
          const subhead = getSubheadElement(content);
          if (subhead) {
            subhead.setAttribute('ePCWu', nameToAdd);
          } else {
            console.log('subhead cannot be found', content);
          }
        }

      }

    }

    if (!nameToAdd) {
      if (useOldModel) {
        const metaline = details ? qsOne(details, '[ePCWu]') : qsOne(hostElement, '[ePCWu]');
        if (metaline) {
          metaline.removeAttribute('ePCWu');
        }
      } else if (content) {
        const subhead = qsOne(content, '[ePCWu]');
        if (subhead) {
          subhead.removeAttribute('ePCWu');
        }
      }
    }

  };

  ytZara.ytProtoAsync("ytd-rich-grid-slim-media").then((cProto) => {
    Promise.resolve().then(addCSSProcess);
    if (cProto && !cProto.__ulLSbep46I6H__ && typeof cProto.onDataChanged === 'function') {
      cProto.__ulLSbep46I6H__ = apSingleGridFn;
      const onDataChanged = cProto.onDataChanged;
      cProto.onDataChanged = function () {
        const cnt = this;
        Promise.resolve(this).then(apSingleGridFn).catch(console.warn);
        return onDataChanged ? onDataChanged.apply(cnt, arguments) : void 0;
      };
    }
  });


  const onVisiblePn = (cProto) => {
    Promise.resolve().then(addCSSProcess);
    if (cProto && !cProto.__ulLSbep46I6H__ && typeof cProto.onVisible === 'function') {
      cProto.__ulLSbep46I6H__ = apSingleGridFn;
      const onVisible = cProto.onVisible;
      cProto.onVisible = function () {
        const cnt = this;
        Promise.resolve(this).then(apSingleGridFn).catch(console.warn);
        return onVisible ? onVisible.apply(cnt, arguments) : void 0;
      };
    }
  };

  ytZara.ytProtoAsync("ytd-reel-item-renderer").then(onVisiblePn);
  ytZara.ytProtoAsync("ytd-rich-item-renderer").then(onVisiblePn);

  ytZara.ytProtoAsync("yt-horizontal-list-renderer").then((cProto) => {
    Promise.resolve().then(addCSSProcess);
    if (cProto && !cProto.__wwVgbwDkvCQY__ && typeof cProto.onVisible === 'function') {
      cProto.__wwVgbwDkvCQY__ = apGridListFn;
      const onVisible = cProto.onVisible;
      cProto.onVisible = function () {
        const cnt = this;
        Promise.resolve(this).then(apGridListFn).catch(console.warn);
        return onVisible ? onVisible.apply(cnt, arguments) : void 0;
      };
    }
  });


})();