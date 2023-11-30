/*

MIT License

Copyright 2022 CY Fung

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
// @name                Disable YouTube AutoPause
// @name:en             Disable YouTube AutoPause
// @name:ja             Disable YouTube AutoPause
// @name:zh-TW          Disable YouTube AutoPause
// @name:zh-CN          Disable YouTube AutoPause
// @namespace           http://tampermonkey.net/
// @version             2023.12.01.0
// @license             MIT License
// @description         "Video paused. Continue watching?" and "Still watching? Video will pause soon" will not appear anymore.
// @description:en      "Video paused. Continue watching?" and "Still watching? Video will pause soon" will not appear anymore.
// @description:ja      「動画が一時停止されました。続きを視聴しますか？」と「視聴を続けていますか？動画がまもなく一時停止されます」は二度と起こりません。
// @description:zh-TW   「影片已暫停，要繼續觀賞嗎？」和「你還在螢幕前嗎？影片即將暫停播放」不再顯示。
// @description:zh-CN   「视频已暂停。是否继续观看？」和「仍在观看？视频即将暂停」不再显示。
// @author              CY Fung
// @match               https://www.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/disable-youtube-autopause.svg
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// ==/UserScript==

/* jshint esversion:8 */

(function (__Promise__) {
  'use strict';

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.  

  const youThereDataHashMapPauseDelay = new WeakMap();
  const youThereDataHashMapPromptDelay = new WeakMap();
  const youThereDataHashMapLactThreshold = new WeakMap();
  const websiteName = 'YouTube';
  let noDelayLogUntil = 0;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  function delayLog(...args) {
    if (Date.now() < noDelayLogUntil) return;
    noDelayLogUntil = Date.now() + 280; // avoid duplicated delay log in the same time ticker
    console.log(...args);
  }

  function defineProp1(youThereData, key, retType, constVal, fGet, fSet, hashMap) {
    Object.defineProperty(youThereData, key, {
      enumerable: true,
      configurable: true,
      get() {
        Promise.resolve(new Date).then(fGet).catch(console.warn);
        let ret = constVal;
        if (retType === 2) return `${ret}`;
        return ret;
      },
      set(newValue) {
        let oldValue = hashMap.get(this);
        Promise.resolve([oldValue, newValue, new Date]).then(fSet).catch(console.warn);
        hashMap.set(this, newValue);
        return true;
      }
    });
  }

  function defineProp2(youThereData, key, qKey) {
    Object.defineProperty(youThereData, key, {
      enumerable: true,
      configurable: true,
      get() {
        const r = this[qKey];
        if ((r || 0).length >= 1) r.length = 0;
        return r;
      },
      set(nv) {
        return true;
      }
    });
  }

  function hookYouThereData(youThereData) {
    if (!youThereData || youThereDataHashMapPauseDelay.has(youThereData)) return;
    const retPauseDelay = youThereData.playbackPauseDelayMs;
    const retPromptDelay = youThereData.promptDelaySec;
    const retLactThreshold = youThereData.lactThresholdMs;
    const tenPU = Math.floor(Number.MAX_SAFE_INTEGER * 0.1);
    const mPU = Math.floor(tenPU / 1000);

    if ('playbackPauseDelayMs' in youThereData && retPauseDelay >= 0 && retPauseDelay < 4 * tenPU) {
      youThereDataHashMapPauseDelay.set(youThereData, retPauseDelay);
      const retType = typeof retPauseDelay === 'string' ? 2 : +(typeof retPauseDelay === 'number');
      if (retType >= 1) {
        defineProp1(youThereData, 'playbackPauseDelayMs', retType, 5 * tenPU, d => {
          delayLog(`${websiteName} is trying to pause video...`, d.toLocaleTimeString());
        }, args => {
          const [oldValue, newValue, d] = args;
          console.log(`${websiteName} is trying to change value 'playbackPauseDelayMs' from ${oldValue} to ${newValue} ...`, d.toLocaleTimeString());
        }, youThereDataHashMapPauseDelay);
      }
      if (typeof ((youThereData.showPausedActions || 0).length) === 'number' && !youThereData.tvTyh) {
        youThereData.tvTyh = [];
        defineProp2(youThereData, 'showPausedActions', 'tvTyh');
      }
    }

    if ('promptDelaySec' in youThereData && retPromptDelay >= 0 && retPromptDelay < 4 * mPU) {
      youThereDataHashMapPromptDelay.set(youThereData, retPromptDelay);
      const retType = typeof retPromptDelay === 'string' ? 2 : +(typeof retPromptDelay === 'number');
      // lact -> promptDelaySec -> showDialog -> playbackPauseDelayMs -> pause
      if (retType >= 1) {
        defineProp1(youThereData, 'promptDelaySec', retType, 5 * mPU, d => {
          delayLog(`${websiteName} is trying to pause video...`, d.toLocaleTimeString());
        }, args => {
          const [oldValue, newValue, d] = args;
          console.log(`${websiteName} is trying to change value 'promptDelaySec' from ${oldValue} to ${newValue} ...`, d.toLocaleTimeString());
        }, youThereDataHashMapPromptDelay);

      }
    }

    if ('lactThresholdMs' in youThereData && retLactThreshold >= 0 && retLactThreshold < 4 * tenPU) {
      youThereDataHashMapLactThreshold.set(youThereData, retLactThreshold);
      const retType = typeof retLactThreshold === 'string' ? 2 : +(typeof retLactThreshold === 'number');
      // lact -> promptDelaySec -> showDialog -> playbackPauseDelayMs -> pause
      if (retType >= 1) {
        defineProp1(youThereData, 'lactThresholdMs', retType, 5 * tenPU, d => {
          // console.log(`${websiteName} is trying to pause video...`, d.toLocaleTimeString());
        }, args => {
          const [oldValue, newValue, d] = args;
          console.log(`${websiteName} is trying to change value 'lactThresholdMs' from ${oldValue} to ${newValue} ...`, d.toLocaleTimeString());
        }, youThereDataHashMapLactThreshold);
      }
    }

  }

  // e.performDataUpdate -> f.playerData = a.playerResponse;
  // youthereDataChanged_(playerData.messages)
  // youthereDataChanged_ -> b.youThereRenderer && fFb(this.youThereManager_, b.youThereRenderer)
  // a.youThereData_ = b.configData.youThereData;
  // a.youThereData_.playbackPauseDelayMs
  function onPageFinished() {
    if (arguments.length === 1) noDelayLogUntil = Date.now() + 3400; // no delay log for video changes
    Promise.resolve(0).then(() => {
      let messages = null;
      const pageMgrElm = document.querySelector('#page-manager') || 0;
      const pageMgrCnt = insp(pageMgrElm);
      try {
        messages = pageMgrCnt.data.playerResponse.messages;
      } catch (e) { }
      if (messages && messages.length > 0) {
        for (const message of messages) {
          if (message.youThereRenderer) {
            let youThereData = null;
            try {
              youThereData = message.youThereRenderer.configData.youThereData;
            } catch (e) { }
            if (youThereData) hookYouThereData(youThereData);
            youThereData = null;
            break;
          }
        }
      }

      const ytdFlexyElm = document.querySelector('ytd-watch-flexy') || 0;
      const ytdFlexyCnt = insp(ytdFlexyElm);

      if (ytdFlexyCnt) {
        const youThereManager_ = ytdFlexyElm.youThereManager_ || insp(ytdFlexyElm).youThereManager_;
        const youThereData_ = (youThereManager_ || 0).youThereData_ || 0;
        if (youThereData_) hookYouThereData(youThereData_);
        if (typeof ytdFlexyCnt.youthereDataChanged_ === 'function') {
          let f = ytdFlexyCnt.youthereDataChanged_;
          if (!f.lq2S7) {
            ytdFlexyCnt.youthereDataChanged_ = (function (f) {
              return function () {
                console.log('youthereDataChanged_()');
                const ret = f.apply(this, arguments);
                onPageFinished();
                return ret;
              }
            })(f);
            ytdFlexyCnt.youthereDataChanged_.lq2S7 = 1;
          }
        }
      }

    }).catch(console.warn)
  }
  document.addEventListener('yt-page-data-updated', onPageFinished, false);
  document.addEventListener('yt-navigate-finish', onPageFinished, false);
  document.addEventListener('spfdone', onPageFinished, false);

})(Promise);
