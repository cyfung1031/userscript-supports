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
// @version             2023.06.22.1
// @license             MIT License
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
// ==/UserScript==

/* jshint esversion:8 */

(function (__Promise__) {
  'use strict';

  const $busy = Symbol('$busy');

  // Number.MAX_SAFE_INTEGER = 9007199254740991

  const INT_INITIAL_VALUE = 8192; // 1 ~ {INT_INITIAL_VALUE} are reserved for native setTimeout/setInterval
  const SAFE_INT_LIMIT = 2251799813685248; // in case cid would be used for multiplying
  const SAFE_INT_REDUCED = 67108864; // avoid persistent interval handlers with cids between {INT_INITIAL_VALUE + 1} and {SAFE_INT_REDUCED - 1}

  let toResetFuncHandlers = false;

  const Promise = __Promise__; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

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
        if (typeof func === 'function') { // ignore all non-function parameter
          let handler = args.length > 0 ? func.bind(null, ...args) : func; // original func if no extra argument
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


})(Promise);