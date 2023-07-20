/*

MIT License

Copyright 2021-2023 CY Fung

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
// @name:ja             YouTube CPU Tamer by AnimationFrame
// @name:zh-TW          YouTube CPU Tamer by AnimationFrame
// @namespace           http://tampermonkey.net/
// @version             2023.07.20.4
// @license             MIT License
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
// @allFrames           true
// @inject-into         page

// @description         Reduce Browser's Energy Impact for playing YouTube Video
// @description:en      Reduce Browser's Energy Impact for playing YouTube Video
// @description:ja      YouTubeビデオのエネルギーインパクトを減らす
// @description:zh-TW   減少YouTube影片所致的能源消耗
// @description:zh-CN   减少YouTube影片所致的能源消耗

// @description:ko      YouTube 비디오 재생 시 브라우저의 에너지 영향을 줄입니다.
// @description:ru      Снижает энергетическое воздействие браузера при воспроизведении видео на YouTube.
// @description:af      Verminder die energie-impak van die blaaier vir YouTube-video speel
// @description:az      YouTube videolarını oynamaq üçün Brauzer enerji təsirini azaldır
// @description:id      Kurangi Dampak Energi Browser untuk memutar Video YouTube
// @description:ms      Kurangkan Impak Tenaga Pelayar untuk memainkan Video YouTube
// @description:bs      Smanji energetski uticaj preglednika za reprodukciju YouTube videa
// @description:ca      Redueix l'impacte energètic del navegador per reproduir vídeos de YouTube
// @description:cs      Snížit energetický dopad prohlížeče při přehrávání videí na YouTube
// @description:da      Reducer browserens energipåvirkning for at afspille YouTube-video
// @description:de      Reduzieren Sie die Energieauswirkungen des Browsers für die Wiedergabe von YouTube-Videos
// @description:et      Vähendage YouTube'i video esitamiseks brauseri energiamõju
// @description:es      Reduzca el impacto energético del navegador al reproducir videos de YouTube
// @description:eu      Gutxitu nabigatzeko energiaren eragina YouTube bideoak erreproduzitzeko
// @description:fr      Réduire l'impact énergétique du navigateur lors de la lecture de vidéos YouTube
// @description:gl      Reduzca o impacto enerxético do navegador para reproducir vídeos de YouTube
// @description:hr      Smanjite energetski utjecaj preglednika za reprodukciju YouTube videa
// @description:zu      Qaqalitsha Umbono We-Energy we-Browser ukuze udlale i-Video ye-YouTube
// @description:is      Minkaðu orkuáhrif vafra til að spila YouTube myndband
// @description:it      Riduci l'impatto energetico del browser per la riproduzione di video di YouTube
// @description:sw      Punguza Athari ya Nishati ya Kivinjari kwa kucheza Video za YouTube
// @description:lv      Samaziniet pārlūkprogrammas enerģijas ietekmi YouTube video atskaņošanai
// @description:lt      Sumažinkite naršyklės energijos poveikį žaidžiant „YouTube“ vaizdo įrašus
// @description:hu      Csökkentse a böngésző energiaterhelését a YouTube videó lejátszásához
// @description:nl      Verminder de energie-impact van de browser bij het afspelen van YouTube-video's
// @description:uz      YouTube videoni tinglash uchun brauzer energiyasi ta'sirini kamaytirish
// @description:pl      Zmniejsz zużycie energii przeglądarki podczas odtwarzania filmów na YouTube
// @description:pt      Reduza o Impacto Energético do Navegador ao reproduzir Vídeos do YouTube
// @description:pt-BR   Reduza o Impacto Energético do Navegador ao reproduzir Vídeos do YouTube
// @description:ro      Reduceți impactul energetic al browser-ului pentru redarea videoclipurilor YouTube
// @description:sq      Zvogëlo ndikimin e energjisë të shfletuesit për luajtjen e video YouTube
// @description:sk      Znížte energetický dopad prehliadača pri prehrávaní videí na YouTube
// @description:sl      Zmanjšajte energijski vpliv brskalnika pri predvajanju videoposnetkov YouTube
// @description:sr      Smanjite energetski uticaj pregledača za reprodukciju YouTube videa
// @description:fi      Vähennä selaimen energiankulutusta YouTube-videoiden toistossa
// @description:sv      Minska webbläsarens energipåverkan för att spela YouTube-video
// @description:vi      Giảm tác động năng lượng của trình duyệt khi phát Video YouTube
// @description:tr      YouTube Videolarını Oynatırken Tarayıcının Enerji Etkisini Azaltın
// @description:be      Змяншыце энергетычны ўплыў браўзара на прайграванне YouTube-відэа
// @description:bg      Намалете енергийния влияние на браузъра при възпроизвеждане на видео в YouTube
// @description:ky      YouTube видеонун ойнотуусунан башкаруу үчүн браузердеги энергиялык турмуштарды көмүштөштүрүү
// @description:kk      YouTube-дың браузерде көрсету мүмкіндігін көмеге қысқартыңыз
// @description:mk      Намалете ја енергетската присутност на пребарувачот за репродукција на YouTube видео
// @description:mn      YouTube видеогийг тоглуулж буй хөтөчийн энерги хүчинг буурах
// @description:uk      Зменште енергетичний вплив браузера на відтворення відео на YouTube
// @description:el      Μειώστε την ενεργειακή επίδραση του προγράμματος περιήγησης για την αναπαραγωγή βίντεο στο YouTube
// @description:hy      Փոքրանալիքայինը դանդարեցրեք բրաուզերի էներգիայի ազդեցությունը YouTube վիդեոների ներածման դեպքում
// @description:ur      یوٹیوب ویڈیو کھیلنے کے لئے براؤزر کی توانائی پر اثر کم کریں
// @description:ar      تقليل تأثير استهلاك الطاقة لمتصفح تشغيل مقاطع فيديو يوتيوب
// @description:fa      کاهش تأثیر انرژی مرورگر برای پخش ویدئوی یوتیوب
// @description:ne      युट्युब भिडियो खेल्नका लागि ब्राउजरको ऊर्जा प्रभाव कम गर्नुहोस्
// @description:mr      YouTube व्हिडिओ चालवण्यासाठी ब्राउझरचे ऊर्जाचे प्रभाव कमी करा
// @description:hi      यूट्यूब वीडियो चलाने के लिए ब्राउज़र की ऊर्जा प्रभाव को कम करें
// @description:as      YouTube ভিডিঅ' প্ৰশ্ন কৰা ব্ৰাউজাৰৰ শক্তিৰ প্ৰভাৱ কমিয়া দিব
// @description:bn      YouTube ভিডিও চালাতে ব্রাউজারের শক্তি প্রভাব কমান
// @description:pa      YouTube ਵਿਡੀਓ ਚਲਾਉਣ ਲਈ ਬਰਾਉਜ਼ਰ ਦੀ ਊਰਜਾ ਪ੍ਰਭਾਵ ਘਟਾਓ
// @description:gu      YouTube વિડિઓ ચલાવવા માટે બ્રાઉઝરનું ઊર્જા પ્રભાવ ઘટાડો
// @description:or      YouTube ଭିଡିଓ ଚାଲାନ୍ତୁ ପାଇଁ ବ୍ରାଉଜରର ଶକ୍ତି ପ୍ରଭାବ କମାନ୍ତୁ
// @description:ta      யூடியூப் வீடியோவை இயக்குவதற்கான உலாவியின் மிக்க விளைவுகளை குறைக்கவும்
// @description:te      YouTube వీడియోను ప్రసారం చేయడానికి బ్రౌజర్ యొక్క శక్తి ప్రభావాన్ని తగ్గించుకోండి
// @description:kn      YouTube ವೀಡಿಯೊಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲು ಬ್ರೌಸರ್ ಯನ್ನು ಉಪಯೋಗಿಸುವಾಗ ಶಕ್ತಿ ಪ್ರಭಾವವನ್ನು ಕಡಿಮೆಗೊಳಿಸಿ
// @description:ml      YouTube വീഡിയോ പ്രവർത്തിപ്പിക്കുവാൻ ബ്രൗസർയുടെ പ്രഭാവം കുറയ്ക്കുക
// @description:si      YouTube වීඩියෝ චාරිකා කිරීම සඳහා බ්‍රවුසරයේ ඊම්ජි බලන්න
// @description:th      ลดผลกระทบทางพลังงานของเบราว์เซอร์ในการเล่นวิดีโอ YouTube
// @description:lo      ບຣາຣິໂຄດລາວເອີ້ນໃນການເພີ່ມເວັບວຽກຂອງ YouTube ສຳ ລັບການຂະໜາດໃນການເພີ່ມເວັບວຽກ
// @description:my      YouTube ဗီဒီယိုများကို ဖွင့်ရန် Browser အတွက် Energy Impact ကိုအနိုင်ရန်
// @description:ka      YouTube ვიდეოების დაკვრებისას ბრაუზერის ენერგიის შეცვლა
// @description:am      YouTube ቪዲዮዎችን ለመቀነስ የባህሪውን አርእስት ግንኙነት ማድረግ
// @description:km      បង្កើតការធ្វើបរិមាណលំអិតរបស់ការកំណត់ការដាក់នៅលើសម្ពាធរបស់ប្រព័ន្ធបញ្ចូលបន្ទាត់ YouTube
// ==/UserScript==

/* jshint esversion:8 */

/**
 *
 * This script does not support the following syntax intentionally.
 *
 * - string parameter as TimerHandler
 * e.g. setTimeout("console.log('300ms')", 300)
 * - no delay for `setInterval`
 * e.g. setInterval(f)
 *
 */

/**
    @typedef TimerObject
    @type {Object}
    @property {Function} handler
    @property {number?} timeout
    @property {number?} interval
    @property {number} nextAt

*/

(function (__CONTEXT__) {
  'use strict';

  const UNDERCLOCK = +localStorage.cpuTamerUnderclock || 10; // default 10ms; increase to make the timer less responsive.

  // "UNDERCLOCK" is set at 10ms by default. You can increase it to avoid unnecessary timer callbacks.
  // Suggested values: 10ms, 16ms, 24ms, 32ms, 48ms, 64ms.
  // Note: The script is not designed to operate with values higher 200ms. Please be careful of changing UNDERCLOCK value.

  const win = this || window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'nzsxclvflluv';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.
  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      const mx = 16; // MAX TRIAL
      const frame = document.createElement('iframe');
      frame.sandbox = 'allow-same-origin';
      const n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
      n.appendChild(frame);
      while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
      const root = document.documentElement;
      root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      const { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout } = fc;
      const res = { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      n.remove();
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  let videoIsPaused = 0; // for video is fetching data
  let isAllMediaPaused = false; // only when there is any video is fetching data

  cleanContext(win).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;


    // Create a symbol to represent the busy state of a handler function
    const $busy = Symbol('$busy');

    // Define some constants for the initial value and the safe limits of the timer ID
    const INT_INITIAL_VALUE = 8192; // 1 ~ {INT_INITIAL_VALUE} are reserved for native setTimeout/setInterval
    const SAFE_INT_LIMIT = 2251799813685248; // in case cid would be used for multiplying
    const SAFE_INT_REDUCED = 67108864; // avoid persistent interval handlers with cids between {INT_INITIAL_VALUE + 1} and {SAFE_INT_REDUCED - 1}
    // Note: Number.MAX_SAFE_INTEGER = 9007199254740991

    // Define a flag to indicate whether the function handlers need to be reset
    let toResetFuncHandlers = false;

    // Assign the Promise constructor to a local variable
    const { requestAnimationFrame, setTimeout, setInterval, clearTimeout, clearInterval } = __CONTEXT__;

    const onPromiseErrorFn = (e) => { Promise.resolve(e).then(e => console.error(e)); }; // Promise will be resolved for Promise.all

    const pq = new Map();
    const [sb, rm] = (() => {

      let mi = INT_INITIAL_VALUE; // skip first {INT_INITIAL_VALUE} cids to avoid browser not yet initialized

      /** @type { Map<number, TimerObject> } */
      const sb = new Map(); // map of timer objects

      /**
       * Define a helper function to create a timer object with a handler, a delay and a next execution time
       * @param {string} prop timeout / interval
       * @returns
       */
      const sFunc = (prop) => {
        /**
         * @param {Function} func TimerHandler
         * @param {number?} ms TimerHandler
         * @param {any[]} args
         */
        return (func, ms, ...args) => {
          mi++; // start at {INT_INITIAL_VALUE + 1}
          if (mi > SAFE_INT_LIMIT) mi = SAFE_INT_REDUCED; // just in case
          if (ms > SAFE_INT_LIMIT) return mi;
          if (typeof func === 'function') { // ignore all non-function parameter (e.g. string)

            const hasArgs = args.length > 0;
            if (videoIsPaused > 0 && !hasArgs && prop === 'timeout') { // no exceptional case for hasArgs can be found

              // 0, 10
              // 20 (rare)
              // 100
              // 250, 1000, 10000, 20000
              if (ms < 16 && !isAllMediaPaused) {
                // typical example for ms: 0, 10 [no undefined was found]

                const jd = mi;
                const cid = setTimeout(() => {
                  func();
                  Promise.resolve().then(() => pq.delete(jd));
                }, ms);
                pq.set(mi, cid);
                return mi;

              } else if (ms < 200) {
                // 20ms, TBC
                // 100ms
                ms = 200;

              } else if (ms < 800) {
                // 250ms
                // no modification
                // for video resume by user
              } else {
                // 1000ms, 10000ms, 20000ms
                if (isAllMediaPaused) {
                  if (ms < 8000) ms = 32000;
                  else if (ms < 80000) ms = 320000;
                  else ms = ms + 380000;
                }
              }

            }

            let handler = hasArgs ? func.bind(null, ...args) : func; // original func if no extra argument
            handler[$busy] || (handler[$busy] = 0);
            sb.set(mi, {
              handler,
              [prop]: ms, // timeout / interval; value can be undefined
              nextAt: Date.now() + (ms > 0 ? ms : 0) // overload for setTimeout(func);
            });
          }
          return mi;
        };
      };

      /**
       * Define a helper function to remove a timer object from the map or call the native method if not found
       * @param {number} jd timeoutID / intervalID
       * @returns
       */
      const rm = function (jd) {
        if (!jd) return; // native setInterval & setTimeout start from 1
        if (typeof jd === 'string') jd = +jd;
        const o = sb.get(jd);
        if (typeof o !== 'object') { // to clear the same cid is unlikely to happen || requiring nativeFn is unlikely to happen
          let action = jd <= INT_INITIAL_VALUE;
          if (!action) {
            const cid = pq.get(jd);
            if (cid > 0) {
              action = true;
              pq.delete(jd);
              jd = cid;
            }
          }
          if (action) {
            const nativeFn = this.nativeFn; // de::this
            nativeFn(jd); // only for clearTimeout & clearInterval
          }
        } else {
          for (const k in o) o[k] = null;
          sb.delete(jd);
        }
      };

      // Override the window methods for setTimeout and setInterval with custom functions that use the helper function sFunc
      win.setTimeout = sFunc('timeout');
      win.setInterval = sFunc('interval');

      // Override the window methods for clearTimeout and clearInterval with custom functions that use the helper function rm
      win.clearTimeout = rm.bind({
        nativeFn: clearTimeout
      });
      win.clearInterval = rm.bind({
        nativeFn: clearInterval
      });

      // Try to override the toString methods of the window methods with the native ones
      try {
        win.setTimeout.toString = setTimeout.toString.bind(setTimeout)
        win.setInterval.toString = setInterval.toString.bind(setInterval)
        win.clearTimeout.toString = clearTimeout.toString.bind(clearTimeout)
        win.clearInterval.toString = clearInterval.toString.bind(clearInterval)
      } catch (e) { console.warn(e) }

      // Add an event listener for when YouTube finishes navigating to a new page and set the flag to reset the function handlers
      win.addEventListener("yt-navigate-finish", () => {
        videoIsPaused = 0; // reset; no weaker tamer after navigation until video is paused afterwards.
        isAllMediaPaused = false; // reset first
        toResetFuncHandlers = true; // ensure all function handlers can be executed after YouTube navigation.
        Promise.resolve().then(executeNow);
      }, true); // capturing event - to let it runs before all everything else.

      return [sb, rm];

    })();

    /** @type {Function|null} */
    let nonResponsiveResolve = null;
    /** @type {(resolve: () => void)}  */
    const delayNonResponsive = (resolve) => (nonResponsiveResolve = resolve);

    /** @param {Function} handler */
    const pfMicroFn = (handler) => {
      // For function handler with high energy impact, discard 1st, 2nd, ... (n-1)th calling:  (a,b,c,a,b,d,e,f) => (c,a,b,d,e,f)
      // For function handler with low energy impact, discard or not discard depends on system performance
      if (handler[$busy] === 1) handler();
      // error in handler would stop the following code execution and jump out to the Promise.all considered as "resolved" due to ignorePromiseErrorFn
      handler[$busy]--;
    };

    /**
     *
     * @param {Function} handler
     */
    const pf = (
      handler => Promise.resolve(handler).then(pfMicroFn).catch(onPromiseErrorFn) // catch here to avoid no resolve to the race promise & avoid immediate end of the promise.all
    );

    // Define a variable to store the next background execution time
    let bgExecutionAt = 0; // set at 0 to trigger tf in background startup when requestAnimationFrame is not responsive

    // Define a variable to store the active page state
    let dexActivePage = true; // true for default; false when checking triggered by setInterval

    /** @type {Function|null} */
    let afInterupter = null;

    /** @type {(resolve: () => void)}  */
    const infiniteLooper = (resolve) => requestAnimationFrame(afInterupter = resolve); // rAF will not execute if document is hidden
    const infiniteLooperForNoPlaying = (resolve) => (afInterupter = resolve); // rAF will not execute if document is hidden

    /** @type {(aHandlers: Function[])}  */
    const microTaskExecutionActivePage = (aHandlers) => Promise.all(aHandlers.map(pf));

    /** @type {(aHandlers: Function[])}  */
    const microTaskExecutionBackgroundPage = (aHandlers) => {
      // error would not affect calling the next tick
      aHandlers.forEach(pf); // microTasks
      aHandlers.length = 0;
    };

    const nextTickExecutionMT1 = async () => { // microTask #1
      const now = Date.now();
      // bgExecutionAt = now + 160; // if requestAnimationFrame is not responsive (e.g. background running)
      /** @type {Function[]} */
      const sHandlers = []; // an array of handlers being executed in this tick
      const lsb = sb; // vairable scope < global to local > for better performance
      lsb.forEach((sV, sK) => {
        const {
          handler,
          // timeout,
          interval,
          nextAt
        } = sV;
        if (now < nextAt) return;
        handler[$busy]++;
        sHandlers.push(handler);
        if (interval > 0) { // prevent undefined, zero, negative values
          const _interval = +interval; // convertion from string to number if necessary; decimal is acceptable
          if (nextAt + _interval > now) sV.nextAt += _interval;
          else if (nextAt + 2 * _interval > now) sV.nextAt += 2 * _interval;
          else if (nextAt + 3 * _interval > now) sV.nextAt += 3 * _interval;
          else if (nextAt + 4 * _interval > now) sV.nextAt += 4 * _interval;
          else if (nextAt + 5 * _interval > now) sV.nextAt += 5 * _interval;
          else sV.nextAt = now + _interval;
        } else {
          // sK in sb must > INT_INITIAL_VALUE
          rm(sK); // remove timeout
        }
      });
      await Promise.resolve();
      return sHandlers;
    }

    /**
     *
     * @param {Function[]} sHandlers
     */
    const nextTickExecutionMT2 = async (sHandlers) => { // microTask #2
      if (sHandlers.length === 0) { // no handler functions
        // requestAnimationFrame when the page is active
        // execution interval is no less than AnimationFrame
      } else if (dexActivePage) {

        // retFP: looping for all functions. First error leads resolve non-reachable;
        // the particular [$busy] will not reset to 0 normally
        const retFP = Promise.resolve(sHandlers).then(microTaskExecutionActivePage);
        // inside Promise (async function), error would not affect calling the next tick

        const retNR = new Promise(delayNonResponsive);
        // for every 125ms, retNR probably resolve eariler than retFP
        // however it still be controlled by rAF (or 250ms) in the next looping

        await Promise.race([retFP, retNR]); // continue either 125ms time limit reached or all working functions have been done
        sHandlers.length = 0;
        nonResponsiveResolve = null;
      } else {
        Promise.resolve(sHandlers).then(microTaskExecutionBackgroundPage);
      }
    };

    let intervalTimerResolve = null;
    setInterval(() => {
      if (intervalTimerResolve !== null) {
        intervalTimerResolve();
        intervalTimerResolve = null;
      }
    }, UNDERCLOCK);
    const pTimerFn = resolve => { intervalTimerResolve = resolve };

    (async () => {
      while (true) {
        bgExecutionAt = Date.now() + 160;
        if (isAllMediaPaused) {
          await new Promise(infiniteLooperForNoPlaying);
          afInterupter = null;
          toResetFuncHandlers = false;
          dexActivePage = false;
        } else {
          const pTimer = new Promise(pTimerFn);
          await new Promise(infiniteLooper); // resolve by rAF or timer@250ms
          await pTimer; // resolve by timer@10ms
          if (afInterupter === null) {
            // triggered by setInterval
            dexActivePage = false;
          } else {
            // triggered by rAF
            afInterupter = null;
            if (dexActivePage === false) toResetFuncHandlers = true;
            dexActivePage = true;
          }
          if (toResetFuncHandlers) {
            // true if page change from hidden to visible OR yt-finish
            toResetFuncHandlers = false;
            for (const eb of sb.values()) eb.handler[$busy] = 0; // including the functions with error
          }
        }
        const sHandlers = await nextTickExecutionMT1();
        await nextTickExecutionMT2(sHandlers);
      }
    })();

    setInterval(() => {
      if (videoIsPaused > 0) {
        // videoIsPaused = 2 => 125ms
        // videoIsPaused = 3 => 250ms ...
        if (videoIsPaused < 16) {
          videoIsPaused++;
          if (videoIsPaused === 8) {  // 875ms
            Promise.resolve().then(() => {
              if (videoIsPaused > 0) {
                /** @type {NodeListOf<HTMLMediaElement | HTMLVideoElement >} */
                let medias = document.querySelectorAll('video[src], audio[src]');
                let mp = true;
                for (const media of medias) {
                  if (media.paused !== true) {
                    mp = false;
                    break;
                  }
                }
                if (mp) {
                  // check spinner as well
                  for (const spinner of document.querySelectorAll('.ytp-spinner')) {
                    const rect = spinner.getBoundingClientRect();
                    if (rect.width * rect.height > 4) {
                      mp = false;
                      break;
                    }
                  }
                }
                if (!mp) {
                  videoIsPaused = false;
                  isAllMediaPaused = false;
                  Promise.resolve().then(executeNow);
                } else {
                  isAllMediaPaused = true;
                }
              }
            })
          }
        }
      }
      if (nonResponsiveResolve !== null) {
        nonResponsiveResolve();
        return;
      }
      // no response of requestAnimationFrame; e.g. running in background
      const dInterupter = afInterupter;
      let now;
      if (dInterupter !== null && (now = Date.now()) > bgExecutionAt) {
        // interupter not triggered by rAF
        afInterupter = null;
        bgExecutionAt = now + 230;
        dInterupter();
      }
    }, 125);
    // --- 2022.12.14 ---
    // 125ms for race promise 'nonResponsiveResolve' only; interupter still works with interval set by bgExecutionAt
    // Timer Throttling might be more serious since 125ms is used instead of 250ms
    // ---------------------
    // 4 times per second for background execution - to keep YouTube application functional
    // if there is Timer Throttling for background running, the execution become the same as native setTimeout & setInterval.


    const passiveCapture = typeof IntersectionObserver === 'function' ? { capture: true, passive: true } : true;


    function executeNow() {
      // in order to immediate fire setTimeout(..., 0) when livestream is paused (laggy)

      if (nonResponsiveResolve !== null) {
        nonResponsiveResolve();
      }

      if (intervalTimerResolve !== null) {
        intervalTimerResolve();
        intervalTimerResolve = null;
      }

      const dInterupter = afInterupter;
      if (dInterupter !== null) {
        afInterupter = null;
        bgExecutionAt = Date.now() + 230;
        dInterupter();
      }

    }

    document.addEventListener('pause', function (evt) {

      const target = (evt || 0).target;
      if (target instanceof HTMLVideoElement && target.networkState === 2) {
        // the video paused might not be the main video; i.e. weaker tamer will apply to non-watch page (like home page)
        // networkState will be useful to filter out no source or fully loaded video
        // weaker tamer focuses on the video is loading (fetching from the server)
        // execute whatever videoIsPaused is.
        videoIsPaused = 1;
        Promise.resolve().then(executeNow);
      }

    }, passiveCapture);


    document.addEventListener('play', function (evt) {

      const target = (evt || 0).target;
      if (target instanceof HTMLVideoElement && ((target.networkState % 3) >= 1)) {
        // reset even it is ads or hover element
        // execute whatever videoIsPaused is.
        videoIsPaused = 0;
        isAllMediaPaused = false;
        Promise.resolve().then(executeNow);
      }

    }, passiveCapture);

  })


})(null);
