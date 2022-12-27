/*

Copyright 2022 CY Fung

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
// ==UserScript==
// @name                Disable YouTube AutoPause
// @name:en             Disable YouTube AutoPause
// @name:ja             Disable YouTube AutoPause
// @name:zh-TW          Disable YouTube AutoPause
// @name:zh-CN          Disable YouTube AutoPause
// @namespace           http://tampermonkey.net/
// @version             2022.12.28
// @license             MIT License
// @description         "Video paused. Continue watching?" will not appear anymore.
// @description:en      "Video paused. Continue watching?" will not appear anymore.
// @description:ja      「動画が一時停止されました。続きを視聴しますか？」は二度と起こりません。
// @description:zh-TW   「影片已暫停，要繼續撥放嗎?」不再顯示。
// @description:zh-CN   「视频已暂停。是否继续观看?」不再显示。
// @author              CY Fung
// @match               https://www.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/disable-youtube-autopause.svg
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames
// @inject-into page
// ==/UserScript==

/* jshint esversion:8 */

(function () {
  'use strict';
  const youThereDataHashMap = new WeakMap();
  function fixMessage(message) {
    let youThereData = null;
    try {
      youThereData = message.youThereRenderer.configData.youThereData;
    } catch (e) { }
    if (!youThereData || youThereDataHashMap.has(youThereData)) return;
    let ret = youThereData.playbackPauseDelayMs;
    let tenPU = Math.floor(Number.MAX_SAFE_INTEGER * 0.1);
    if (ret > 0 && ret < 4 * tenPU) {
      youThereDataHashMap.set(youThereData, ret);
      Object.defineProperty(youThereData, 'playbackPauseDelayMs', {
        enumerable: true,
        configurable: true,
        get() {
          Promise.resolve(new Date).then(d => {
            console.log('YouTube is trying to pause video...', d.toLocaleTimeString());
          });
          return 5 * tenPU;
        },
        set(newValue) {
          let oldValue = youThereDataHashMap.get(this);
          Promise.resolve([oldValue, newValue, new Date]).then(args => {
            const [oldValue, newValue, d] = args;
            console.log(`YouTube is trying to change value 'playbackPauseDelayMs' from ${oldValue} to ${newValue} ...`, d.toLocaleTimeString());
          })
          youThereDataHashMap.set(this, newValue);
          return true;
        }
      });
    }
  }

  // e.performDataUpdate -> f.playerData = a.playerResponse;
  // youthereDataChanged_(playerData.messages)
  // youthereDataChanged_ -> b.youThereRenderer && fFb(this.youThereManager_, b.youThereRenderer)
  // a.youThereData_ = b.configData.youThereData;
  // a.youThereData_.playbackPauseDelayMs
  function onYtPageDataUpdated(evt) {
    let messages = null;
    try {
      messages = document.querySelector('#page-manager').data.playerResponse.messages;
    } catch (e) { }
    if (!messages || !messages.length) return;
    for (const message of messages) {
      if (message.youThereRenderer) {
        fixMessage(message);
        break;
      }
    }
  }
  document.addEventListener('yt-page-data-updated', onYtPageDataUpdated, true);

})();
