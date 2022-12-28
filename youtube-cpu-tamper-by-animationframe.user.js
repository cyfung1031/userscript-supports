/*

MIT License

Copyright 2021 CY Fung

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
// @name                YouTube CPU Tamer by AnimationFrame
// @name:en             YouTube CPU Tamer by AnimationFrame
// @name:ja             YouTube CPU Tamer by AnimationFrame
// @name:zh-TW          YouTube CPU Tamer by AnimationFrame
// @name:zh-CN          YouTube CPU Tamer by AnimationFrame
// @namespace           http://tampermonkey.net/
// @version             2022.12.28.1
// @license             MIT License
// @description         Reduce Browser's Energy Impact for playing YouTube Video
// @description:en      Reduce Browser's Energy Impact for playing YouTube Video
// @description:ja      YouTubeビデオのエネルギーインパクトを減らす
// @description:zh-TW   減少YouTube影片所致的能源消耗
// @description:zh-CN   减少YouTube影片所致的能源消耗
// @author              CY Fung
// @match               https://www.youtube.com/*
// @match               https://www.youtube.com/embed/*
// @match               https://www.youtube-nocookie.com/embed/*
// @match               https://www.youtube.com/live_chat*
// @match               https://www.youtube.com/live_chat_replay*
// @match               https://music.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/youtube-cpu-tamper-by-animationframe.webp
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

  const $busy = Symbol('$busy');

  // Number.MAX_SAFE_INTEGER = 9007199254740991

  const INT_INITIAL_VALUE = 8192; // 1 ~ {INT_INITIAL_VALUE} are reserved for native setTimeout/setInterval
  const SAFE_INT_LIMIT = 2251799813685248; // in case cid would be used for multiplying
  const SAFE_INT_REDUCED = 67108864; // avoid persistent interval handlers with cids between {INT_INITIAL_VALUE + 1} and {SAFE_INT_REDUCED - 1}

  let toResetFuncHandlers = false;

  const [$$requestAnimationFrame, $$setTimeout, $$setInterval, $$clearTimeout, $$clearInterval, sb, rm] = (() => {

    let [window] = new Function('return [window];')(); // real window object

    const hkey_script = 'nzsxclvflluv';
    if (window[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
    window[hkey_script] = true;

    // copies of native functions

    /** @type {requestAnimationFrame} */
    const $$requestAnimationFrame = window.requestAnimationFrame.bind(window); // core looping
    /** @type {setTimeout} */
    const $$setTimeout = window.setTimeout.bind(window); // for race
    /** @type {setInterval} */
    const $$setInterval = window.setInterval.bind(window); // for background execution
    /** @type {clearTimeout} */
    const $$clearTimeout = window.clearTimeout.bind(window); // for native clearTimeout
    /** @type {clearInterval} */
    const $$clearInterval = window.clearInterval.bind(window); // for native clearInterval


    let mi = INT_INITIAL_VALUE; // skip first {INT_INITIAL_VALUE} cids to avoid browser not yet initialized
    /** @type { Map<number, object> } */
    const sb = new Map();
    let sFunc = (prop) => {
      return (func, ms, ...args) => {
        mi++; // start at {INT_INITIAL_VALUE + 1}
        if (mi > SAFE_INT_LIMIT) mi = SAFE_INT_REDUCED; // just in case
        if (ms > SAFE_INT_LIMIT) return mi
        let handler = args.length > 0 ? func.bind(null, ...args) : func; // original func if no extra argument
        handler[$busy] || (handler[$busy] = 0);
        sb.set(mi, {
          handler,
          [prop]: ms, // timeout / interval; value can be undefined
          nextAt: Date.now() + (ms > 0 ? ms : 0) // overload for setTimeout(func);
        });
        return mi;
      };
    };
    const rm = function (jd) {
      if (!jd) return; // native setInterval & setTimeout start from 1
      let o = sb.get(jd);
      if (typeof o !== 'object') { // to clear the same cid is unlikely to happen || requiring nativeFn is unlikely to happen
        if (jd <= INT_INITIAL_VALUE) this.nativeFn(jd); // only for clearTimeout & clearInterval
      } else {
        for (let k in o) o[k] = null;
        o = null;
        sb.delete(jd);
      }
    };
    window.setTimeout = sFunc('timeout');
    window.setInterval = sFunc('interval');
    window.clearTimeout = rm.bind({
      nativeFn: $$clearTimeout
    });
    window.clearInterval = rm.bind({
      nativeFn: $$clearInterval
    });
    try {
      window.setTimeout.toString = $$setTimeout.toString.bind($$setTimeout)
      window.setInterval.toString = $$setInterval.toString.bind($$setInterval)
      window.clearTimeout.toString = $$clearTimeout.toString.bind($$clearTimeout)
      window.clearInterval.toString = $$clearInterval.toString.bind($$clearInterval)
    } catch (e) { console.warn(e) }

    window.addEventListener("yt-navigate-finish", () => {
      toResetFuncHandlers = true; // ensure all function handlers can be executed after YouTube navigation.
    }, true); // capturing event - to let it runs before all everything else.

    window = null;
    sFunc = null;

    return [$$requestAnimationFrame, $$setTimeout, $$setInterval, $$clearTimeout, $$clearInterval, sb, rm];

  })();

  let nonResponsiveResolve = null
  const delayNonResponsive = (resolve) => (nonResponsiveResolve = resolve);

  const pf = (
    handler => new Promise(resolve => {
      // try catch is not required - no further execution on the handler
      // For function handler with high energy impact, discard 1st, 2nd, ... (n-1)th calling:  (a,b,c,a,b,d,e,f) => (c,a,b,d,e,f)
      // For function handler with low energy impact, discard or not discard depends on system performance
      if (handler[$busy] === 1) handler();
      handler[$busy]--;
      handler = null; // remove the reference of `handler`
      resolve();
      resolve = null; // remove the reference of `resolve`
    })
  );

  let bgExecutionAt = 0; // set at 0 to trigger tf in background startup when requestAnimationFrame is not responsive

  let dexActivePage = true; // true for default; false when checking triggered by setInterval
  /** @type {Function|null} */
  let interupter = null;
  const infiniteLooper = (resolve) => $$requestAnimationFrame(interupter = resolve); // rAF will not execute if document is hidden

  const mbx = async () => {

    // microTask #1
    let now = Date.now();
    // bgExecutionAt = now + 160; // if requestAnimationFrame is not responsive (e.g. background running)
    let promisesF = [];
    const lsb = sb;
    for (const jb of lsb.keys()) {
      const o = lsb.get(jb);
      const {
        handler,
        // timeout,
        interval,
        nextAt
      } = o;
      if (now < nextAt) continue;
      handler[$busy]++;
      promisesF.push(handler);
      if (interval > 0) { // prevent undefined, zero, negative values
        const _interval = +interval; // convertion from string to number if necessary; decimal is acceptable
        if (nextAt + _interval > now) o.nextAt += _interval;
        else if (nextAt + 2 * _interval > now) o.nextAt += 2 * _interval;
        else if (nextAt + 3 * _interval > now) o.nextAt += 3 * _interval;
        else if (nextAt + 4 * _interval > now) o.nextAt += 4 * _interval;
        else if (nextAt + 5 * _interval > now) o.nextAt += 5 * _interval;
        else o.nextAt = now + _interval;
      } else {
        // jb in sb must > INT_INITIAL_VALUE
        rm(jb); // remove timeout
      }
    }

    await Promise.resolve(0); // split microTasks inside async()

    // microTask #2
    // bgExecutionAt = Date.now() + 160; // if requestAnimationFrame is not responsive (e.g. background running)
    if (promisesF.length === 0) { // no handler functions
      // requestAnimationFrame when the page is active
      // execution interval is no less than AnimationFrame
      promisesF = null;
    } else if (dexActivePage) {
      // ret3: looping for all functions. First error leads resolve non-reachable;
      // the particular [$busy] will not reset to 0 normally
      let ret3 = new Promise(resolveK => {
        // error would not affect calling the next tick
        Promise.all(promisesF.map(pf)).then(resolveK); //microTasks
        promisesF.length = 0;
        promisesF = null;
      })
      let ret2 = new Promise(delayNonResponsive);
      // for every 125ms, ret2 probably resolve eariler than ret3
      // however it still be controlled by rAF (or 250ms) in the next looping
      let race = Promise.race([ret2, ret3]);
      // continue either 125ms time limit reached or all working functions have been done
      await race;
      nonResponsiveResolve = null;
    } else {
      new Promise(resolveK => {
        // error would not affect calling the next tick
        promisesF.forEach(pf); //microTasks
        promisesF.length = 0;
        promisesF = null;
      })
    }

  };

  (async () => {
    while (true) {
      bgExecutionAt = Date.now() + 160;
      await new Promise(infiniteLooper);
      if (interupter === null) {
        // triggered by setInterval
        dexActivePage = false;
      } else {
        // triggered by rAF
        interupter = null;
        if (dexActivePage === false) toResetFuncHandlers = true;
        dexActivePage = true;
      }
      if (toResetFuncHandlers) {
        // true if page change from hidden to visible OR yt-finish
        toResetFuncHandlers = false;
        for (let eb of sb.values()) eb.handler[$busy] = 0; // including the functions with error
      }
      await mbx();
    }
  })();

  $$setInterval(() => {
    if (nonResponsiveResolve !== null) {
      nonResponsiveResolve();
      return;
    }
    // no response of requestAnimationFrame; e.g. running in background
    let interupter_t = interupter, now;
    if (interupter_t !== null && (now = Date.now()) > bgExecutionAt) {
      // interupter not triggered by rAF
      bgExecutionAt = now + 230;
      interupter = null;
      interupter_t();
    }
  }, 125);
  // --- 2022.12.14 ---
  // 125ms for race promise 'nonResponsiveResolve' only; interupter still works with interval set by bgExecutionAt
  // Timer Throttling might be more serious since 125ms is used instead of 250ms
  // ---------------------
  // 4 times per second for background execution - to keep YouTube application functional
  // if there is Timer Throttling for background running, the execution become the same as native setTimeout & setInterval.


})();