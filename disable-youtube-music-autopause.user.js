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
// @name                Disable YouTube Music AutoPause
// @name:en             Disable YouTube Music AutoPause
// @name:ja             Disable YouTube Music AutoPause
// @name:zh-TW          Disable YouTube Music AutoPause
// @name:zh-CN          Disable YouTube Music AutoPause
// @namespace           http://tampermonkey.net/
// @version             2023.12.01.0
// @license             MIT License
// @description         "Video paused. Continue watching?" and "Still watching? Video will pause soon" will not appear anymore.
// @description:en      "Video paused. Continue watching?" and "Still watching? Video will pause soon" will not appear anymore.
// @description:ja      「動画が一時停止されました。続きを視聴しますか？」と「視聴を続けていますか？動画がまもなく一時停止されます」は二度と起こりません。
// @description:zh-TW   「影片已暫停，要繼續觀賞嗎？」和「你還在螢幕前嗎？影片即將暫停播放」不再顯示。
// @description:zh-CN   「视频已暂停。是否继续观看？」和「仍在观看？视频即将暂停」不再显示。
// @author              CY Fung
// @match               https://music.youtube.com/*
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
  const websiteName = 'YouTube Music';
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

  let symbol877 = Symbol();

  // e.performDataUpdate -> f.playerData = a.playerResponse;
  // youthereDataChanged_(playerData.messages)
  // youthereDataChanged_ -> b.youThereRenderer && fFb(this.youThereManager_, b.youThereRenderer)
  // a.youThereData_ = b.configData.youThereData;
  // a.youThereData_.playbackPauseDelayMs

  let psChangeRid = 0;

  function onPlayerStateChange(evtValue) {
    if (evtValue == 1 || evtValue == 3) { // the event is just the state value
      // this is after getPlayerState()
      // in case youThereData is added after onPlayerStateChange
      if (psChangeRid > 1e9) psChangeRid = 9;
      let tid = psChangeRid;
      requestAnimationFrame(() => { // assume no update of messages in background; delayed to save processing energy
        if (tid !== psChangeRid) return;
        messageHook();
      });

    }
  }

  function messageHook() {

    let messages = null;
    const playerElm = document.querySelector('#player') || 0;
    try {
      messages = (insp(playerElm).__data || playerElm.__data || 0).playerResponse_.messages;
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

  }


  let messagesRunnerRid = 0;

  function messagesRunner() {


    messageHook();

    /*

    , fhb = function(a, b) {
        a.reset();
        if (1 === a.JSC$10962_playerApi.getPlayerState() || 3 === a.JSC$10962_playerApi.getPlayerState())
            if (a.youThereData = Fa("configData.youThereData", b),
                a.youThereData) {
                var c = a.JSC$10962_playerApi.getCurrentTime();
                a.showPromptJobId = mp(0, function() {
                    ghb(a, b)
                }, 1E3 * Math.max((a.youThereData.promptDelaySec || 0) - c, 0))
            }
    }

    */

    const playerElm = document.querySelector('#player') || 0;
    const playerApi = insp(playerElm).playerApi_ || playerElm.playerApi_ || insp(playerElm).playerApi || playerElm.playerApi || 0;
    if (typeof playerApi === 'object') {

      if (typeof playerApi[symbol877] === 'undefined' && typeof playerApi.getPlayerState === 'function') {
        playerApi[symbol877] = playerApi.getPlayerState;
        playerApi.getPlayerState = function () {
          let res = this[symbol877](...arguments);
          if (res == 1 || res == 3) {
            try {
              messageHook();
            } catch (e) { }
          }
          return res;
        };
      }
      if ('removeEventListener' in playerApi && 'addEventListener' in playerApi) {
        playerApi.removeEventListener("onStateChange", onPlayerStateChange, false);
        playerApi.addEventListener("onStateChange", onPlayerStateChange, false);
      }
    }

  }


  async function canplayHandlerAsync() {
    noDelayLogUntil = Date.now() + 3400; // no delay log for video changes

    messagesRunnerRid++;
    let tid = messagesRunnerRid;
    if (messagesRunnerRid > 1e9) messagesRunnerRid = 9;

    await Promise.resolve(0);
    if (tid !== messagesRunnerRid) return;
    messagesRunner();

    // run at 3.2s and 8.6s to ensure the page update is finished.
    // avoid duplicated calls if canplay is called more than one time (page is rapidly changing)
    await new Promise(r => setTimeout(r, 3200));
    if (tid !== messagesRunnerRid) return;
    messagesRunner();

    await new Promise(r => setTimeout(r, 5400));
    if (tid !== messagesRunnerRid) return;
    messagesRunner();

  }

  function canplayHandler(evt) {
    if (evt.target.nodeName != 'VIDEO') return;
    if (!evt.target.closest('#player')) return;
    canplayHandlerAsync();
  }

  document.addEventListener('canplay', canplayHandler, true);

})(Promise);
