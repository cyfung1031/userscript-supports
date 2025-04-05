// ==UserScript==
// @name                Web CPU Tamer
// @name:ja             Web CPU Tamer
// @name:zh-TW          Web CPU Tamer
// @namespace           http://tampermonkey.net/
// @version             2025.100.0
// @license             MIT License
// @author              CY Fung
// @match               https://*/*
// @match               http://*/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/7b34986ad9cdf3af8766e54b0aecb394b036e970/icons/web-cpu-tamer.svg
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page

// @description         Reduce Browser's Energy Impact via implicit async scheduling delay
// @description:en      Reduce Browser's Energy Impact via implicit async scheduling delay
// @description:ja      非同期スケジューリングの遅延を利用してブラウザのエネルギー影響を軽減
// @description:zh-TW   透過隱性非同步排程延遲減少瀏覽器的能源影響
// @description:zh-CN   通过隐式的异步调度延迟减少浏览器的能耗

// @description:ko      암묵적 지연 스케줄링을 통해 브라우저의 에너지 영향을 줄입니다
// @description:ru      Снижает энергопотребление браузера с помощью неявной задержки планирования
// @description:af      Verminder die energie-impak van die blaaier via implisiete skeduleringvertraging
// @description:az      Brauzerin enerji təsirini gizli cədvəl gecikməsi ilə azaldır
// @description:id      Kurangi Dampak Energi Browser melalui penjadwalan asinkron implisit
// @description:ms      Kurangkan Impak Tenaga Pelayar melalui penjadualan tak segerak tersirat
// @description:bs      Smanjite energetski uticaj preglednika putem implicitnog kašnjenja zakazivanja
// @description:ca      Redueix l'impacte energètic del navegador mitjançant un retard implícit en la planificació
// @description:cs      Snížit energetický dopad prohlížeče pomocí implicitního zpoždění plánování
// @description:da      Reducer browserens energipåvirkning via implicit forsinkelse i planlægningen
// @description:de      Reduzieren Sie den Energieverbrauch des Browsers durch implizite asynchrone Zeitplanung
// @description:et      Vähendage brauseri energiamõju vaikimisi ajastamise viivituse kaudu
// @description:es      Reduzca el impacto energético del navegador mediante un retraso implícito en la programación
// @description:eu      Nabigatzailearen energia-inpaktua murriztu inplizituko programazio atzerapenaren bidez
// @description:fr      Réduire l'impact énergétique du navigateur grâce à un retard implicite dans la planification
// @description:gl      Reduza o impacto enerxético do navegador mediante unha demora implícita na programación
// @description:hr      Smanjite energetski utjecaj preglednika putem implicitnog kašnjenja zakazivanja
// @description:zu      Yehlisa Umthelela Webrowser we-Energy nge-Implicit Scheduling Delay
// @description:is      Minnkaðu orkunotkun vafrans með óbeinum töfum á tímasetningu
// @description:it      Riduci l'impatto energetico del browser tramite ritardo implicito nella pianificazione
// @description:sw      Punguza athari ya nishati ya kivinjari kupitia ucheleweshaji wa ratiba usio dhahiri
// @description:lv      Samaziniet pārlūkprogrammas enerģijas ietekmi, izmantojot netiešu plānošanas aizkavi
// @description:lt      Sumažinkite naršyklės energijos poveikį naudojant netiesioginį planavimo vėlavimą
// @description:hu      Csökkentse a böngésző energiaterhelését implicit ütemezési késleltetéssel
// @description:nl      Verminder het energieverbruik van de browser via impliciete planningsvertraging
// @description:uz      Brauzer energiyasi ta’sirini yashirin rejalashtirish kechikishi orqali kamaytiring
// @description:pl      Zmniejsz zużycie energii przeglądarki przez opóźnienie w planowaniu (implicit delay)
// @description:pt      Reduza o impacto energético do navegador com atraso implícito na programação
// @description:pt-BR   Reduza o impacto energético do navegador com atraso implícito na programação
// @description:ro      Reduceți impactul energetic al browserului prin întârziere implicită în planificare
// @description:sq      Zvogëloni ndikimin energjetik të shfletuesit me vonesë të planifikimit implicit
// @description:sk      Znížte energetický dopad prehliadača pomocou implicitného oneskorenia plánovania
// @description:sl      Zmanjšajte energijski vpliv brskalnika z implicitno zakasnitvijo načrtovanja
// @description:sr      Smanjite energetski uticaj pregledača korišćenjem implicitnog kašnjenja rasporeda
// @description:fi      Vähennä selaimen energiankulutusta käyttämällä implisiittistä aikataulun viivettä
// @description:sv      Minska webbläsarens energipåverkan med implicit schemaläggningsfördröjning
// @description:vi      Giảm tác động năng lượng của trình duyệt bằng cách trì hoãn lịch trình không rõ ràng
// @description:tr      Tarayıcının enerji etkisini örtük zamanlama gecikmesiyle azaltın
// @description:be      Змяншыце энергетычны ўплыў браўзера з дапамогай неяўнай затрымкі планавання
// @description:bg      Намалете енергийното въздействие на браузъра чрез неявно забавяне на планирането
// @description:ky      Браузердеги энергия таасирин жашыруун пландоо кечиктирүүсү менен азайтыңыз
// @description:kk      Браузердің энергия әсерін жасырын жоспарлау кешігуі арқылы азайтыңыз
// @description:mk      Намалете ја енергетската потрошувачка на прелистувачот преку неексплицитно задоцнување во планирањето
// @description:mn      Хөтчийн эрчим хүчний нөлөөллийг далд хуваарлалтын саатаар бууруулах
// @description:uk      Зменште енергоспоживання браузера за допомогою неявного затримання планування
// @description:el      Μειώστε τον ενεργειακό αντίκτυπο του προγράμματος περιήγησης μέσω καθυστέρησης προγραμματισμού
// @description:hy      Բրաուզերի էներգիայի ազդեցությունը նվազեցրեք անուղղակի պլանավորման ձգձգման միջոցով
// @description:ur      براؤزر کے توانائی اثر کو غیر واضح شیڈولنگ کی تاخیر سے کم کریں
// @description:ar      تقليل استهلاك الطاقة للمتصفح من خلال تأخير جدولة ضمني
// @description:fa      کاهش تأثیر انرژی مرورگر از طریق تأخیر ضمنی در زمان‌بندی
// @description:ne      ब्राउजरको ऊर्जा प्रभावलाई निहित शेड्युलिङ ढिलाइमार्फत कम गर्नुहोस्
// @description:mr      ब्राउझरच्या ऊर्जेच्या प्रभावावर सूचित शेड्यूलिंग विलंबाद्वारे कमी करा
// @description:hi      ब्राउज़र के ऊर्जा प्रभाव को निहित शेड्यूलिंग विलंब के माध्यम से कम करें
// @description:as      ব্রাউজাৰৰ শক্তি প্ৰভাৱ নেপথ্যভাৱে শিডিউলিং বিঢম্বন দ্বাৰা হ্ৰাস কৰক
// @description:bn      ব্রাউজারের শক্তি প্রভাব নীরবভাবে নির্ধারিত বিলম্বের মাধ্যমে হ্রাস করুন
// @description:pa      ਬਰਾਊਜ਼ਰ ਦੀ ਊਰਜਾ ਪ੍ਰਭਾਵ ਨੂੰ ਗੁਪਤ ਸਮੇਂਬੱਧਤਾ ਦੇ ਵਿਚੰਕਾਰ ਘਟਾਓ
// @description:gu      બ્રાઉઝરની ઊર્જા અસરને નમ્ર શેડ્યૂલિંગ વિલંબ દ્વારા ઘટાડો
// @description:or      ବ୍ରାଉଜରର ଶକ୍ତି ପ୍ରଭାବକୁ ଅସ୍ପଷ୍ଟ ଅନୁସୂଚୀତ ବିଳମ୍ବ ମାଧ୍ୟମରେ କମାନ୍ତୁ
// @description:ta      உலாவியின் சக்தி தாக்கத்தை மறைமுக அட்டவணை தாமதத்தின் மூலம் குறைக்கவும்
// @description:te      బ్రౌజర్ శక్తి ప్రభావాన్ని పరోక్ష షెడ్యూలింగ్ ఆలస్యంతో తగ్గించండి
// @description:kn      ಬ್ರೌಸರ್ ಶಕ್ತಿ ಪರಿಣಾಮವನ್ನು ಅಸ್ಪಷ್ಟವಾದ ಶೆಡ್ಯುಲಿಂಗ್ ವಿಳಂಬದ ಮೂಲಕ ಕಡಿಮೆಮಾಡಿ
// @description:ml      ബ്രൗസറിന്റെ ഊർജ്ജ പ്രഭാവം പരോക്ഷ ഷെഡ്യൂളിംഗ് വൈകലിലൂടെ കുറയ്ക്കുക
// @description:si      බ්‍රවුසරයේ බලපෑම අනුපූර්වව වැඩිවීමේ ප්‍රමාදය මඟින් අඩු කරන්න
// @description:th      ลดผลกระทบทางพลังงานของเบราว์เซอร์ด้วยการหน่วงเวลาการกำหนดตารางโดยปริยาย
// @description:lo      ລົດຜົນກະທົບດ້ານພະລັງງານຂອງບຣາວເຊີຜ່ານການລໍຖ້າການຈັດຕາຕະລາງແບບບໍ່ຊັດເຈນ
// @description:my      Browser ၏စွမ်းအင်သက်ရောက်မှုကို မသိသာသောအချိန်ဇယားနောက်ကျမှုဖြင့်လျော့ချပါ
// @description:ka      ბრაუზერის ენერგიის გავლენა შემცირდეს არაპირდაპირი დაგეგმვის შეფერხებით
// @description:am      አሳይነት የሆነ የመርሃግብር መዘግየትን በመጠቀም የአሳሽ ኃይል ተፅዕኖን አሳንሱ
// @description:km      បន្ថយផលប៉ះពាល់ថាមពលរបស់កម្មវិធីរុករកតាមការពន្យារបែបលាក់ៗនៃការកំណត់ពេលវេលា
// ==/UserScript==

/*

MIT License

Copyright 2025 CY Fung

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

/* jshint esversion:8 */

((o) => {
  'use strict';

  const [setTimeout_, setInterval_, requestAnimationFrame_, clearTimeout_, clearInterval_, cancelAnimationFrame_, Animation_] = o;
  const queueMicrotask_ = queueMicrotask;
  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'nzsxclvflluv';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  const getExternalPromise = () => {
    let f;
    const r = new Promise((resolve) => {
      f = resolve;
    });
    r.resolve = f;
    return r;
  };

  let pr = getExternalPromise();


  const cme = document.createComment('--WebCPUTamer--');
  const appendChild_ = HTMLElement.prototype.appendChild;
  let cmi = 0;
  let lastPr = null;
  function act() {
    if (lastPr !== pr) {
      lastPr = pr;
      if (!cmi) {
        appendChild_.call(document.documentElement, cme);
      }
      cmi = (cmi & 1073741823) + 1;
      if (cmi & 1) {
        cme.data = '++WebCPUTamer++'
      } else {
        cme.data = '--WebCPUTamer--'
      }
    }
  }

  let tl;
  if (typeof DocumentTimeline === 'function') {
    tl = new DocumentTimeline();
  } else {
    let Animation__ = Animation_;
    if (document.documentElement) {
      let e = document.documentElement.animate(null);
      if (typeof (e || 0) === 'object' && '_animation' in e && e.constructor === Object) {
        e = e._animation;
      }
      if (typeof (e || 0) === 'object' && 'timeline' in e && typeof e.constructor === 'function') {
        Animation__ = e.constructor;
      }
    }
    const ant = new Animation__();
    tl = ant.timeline;
  }
  const tl_ = tl;

  const mo = new MutationObserver(() => {
    pr.resolve();
    pr = getExternalPromise();
  });
  mo.observe(cme, {
    characterData: true,
  });

  const tz = new Set();
  const az = new Set();

  setTimeout = function (f, ...args) {
    let r;
    const g = async (...args) => {
      tz.add(r);
      queueMicrotask_(act);
      await pr;
      queueMicrotask_(act);
      await pr;
      tz.delete(r) && f(...args);
    }
    r = setTimeout_(g, ...args);
    return r;
  };

  setInterval = function (f, ...args) {
    let r;
    const g = async (...args) => {
      tz.add(r);
      queueMicrotask_(act);
      await pr;
      queueMicrotask_(act);
      await pr;
      tz.delete(r) && f(...args);
    }
    r = setInterval_(g, ...args);
    return r;
  };

  clearTimeout = function (cid) {
    tz.delete(cid);
    return clearTimeout_(cid);
  }

  clearInterval = function (cid) {
    tz.delete(cid);
    return clearInterval_(cid);
  }

  requestAnimationFrame = function (f) {
    let r;
    const upr = pr;
    const g = async (timeRes) => {
      az.add(r);
      const q1 = tl_.currentTime;
      await upr;
      const q2 = tl_.currentTime;
      az.delete(r) && f(timeRes + (q2 - q1));
    }
    queueMicrotask_(act);
    r = requestAnimationFrame_(g);
    return r;
  }

  cancelAnimationFrame = function (aid) {
    az.delete(aid);
    return cancelAnimationFrame_(aid);
  }

  try {
    if (typeof webkitRequestAnimationFrame === 'function' && location.hostname.endsWith('youtube.com') && navigator.userAgentData.brands.some(e => e.brand === 'Brave')) {  // fu*k you Brave!
      let q;
      q = Object.getOwnPropertyDescriptor(self, 'setTimeout');
      Object.defineProperty(self, 'setTimeout', { ...q, writable: false });

      q = Object.getOwnPropertyDescriptor(self, 'setInterval');
      Object.defineProperty(self, 'setInterval', { ...q, writable: false });
    }
  } catch (e) { }

})([setTimeout, setInterval, requestAnimationFrame, clearTimeout, clearInterval, cancelAnimationFrame, Animation]);

