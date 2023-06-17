// ==UserScript==
// @name                YouTube Live Chat Tamper
// @namespace           http://tampermonkey.net/
// @version             2023.06.17.0
// @author              CY Fung
// @match               https://www.youtube.com/live_chat*
// @match               https://www.youtube.com/live_chat_replay*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames
// @inject-into page

// @compatible          firefox 55
// @compatible          chrome 61
// @compatible          opera 48
// @compatible          safari 11.1
// @compatible          edge 16

// @description         to maximize chat refresh performance
// @description         to maximize the performance of YouTube Live Chat Refresh
// @description:ja      YouTubeライブチャットリフレッシュのパフォーマンスを最大化するためのもの
// @description:zh-TW   用於最大化YouTube直播聊天刷新的性能
// @description:zh-CN   用于最大化YouTube直播聊天刷新的性能

// @description:ko      YouTube 라이브 채팅 새로 고침 성능 최대화를 위한 것
// @description:ru      для максимизации производительности обновления чата YouTube Live
// @description:af      om die prestasie van YouTube Live Chat Refresh te maksimeer
// @description:az      YouTube Live Chat Təzələmənin performansını maksimuma çıxarmaq üçün
// @description:id      untuk memaksimalkan kinerja Pembaruan Chat Langsung YouTube
// @description:ms      untuk memaksimumkan prestasi Penyegaran Cakap Langsung YouTube
// @description:bs      za maksimiziranje performansi YouTube Live Chat Osvežavanja
// @description:ca      per maximitzar el rendiment de l'actualització del xat en directe de YouTube
// @description:cs      pro maximalizaci výkonu aktualizace živého chatu YouTube
// @description:da      for at maksimere ydeevnen af ​​YouTube Live Chat Refresh
// @description:de      um die Leistung der Aktualisierung des YouTube Live-Chats zu maximieren
// @description:et      YouTube Live'i vestluse värskendamise jõudluse maksimeerimiseks
// @description:es      para maximizar el rendimiento de la actualización del chat en vivo de YouTube
// @description:eu      YouTube Live Txat Freskatzearen errendimendua maximizatzeko
// @description:fr      pour maximiser les performances de la mise à jour du chat en direct de YouTube
// @description:gl      para maximizar o rendemento da actualización do chat en directo de YouTube
// @description:hr      za maksimiziranje performansi ažuriranja YouTube Live Chata
// @description:zu      ukuqinisekisa ukwakha ubuchwepheshe be YouTube Live Chat
// @description:is      til að hámarka afköst endurnýjunar YouTube Live spjalls
// @description:it      per massimizzare le prestazioni dell'aggiornamento della chat live di YouTube
// @description:sw      ili kuongeza utendaji wa Sasisho la Gumzo la YouTube Moja kwa Moja
// @description:lv      lai maksimizētu YouTube Live Čata atjauninājuma veiktspēju
// @description:lt      siekiant maksimalizuoti „YouTube Live Chat Refresh“ našumą
// @description:hu      a YouTube Live Chat frissítésének teljesítményének maximalizálása érdekében
// @description:nl      om de prestaties van de YouTube Live Chat Refresh te maximaliseren
// @description:uz      YouTube Live Chat Yangilashning samaradorligini maksimal xisoblash uchun
// @description:pl      w celu maksymalizacji wydajności odświeżania czatu na żywo YouTube
// @description:pt      para maximizar o desempenho da atualização do bate-papo ao vivo do YouTube
// @description:pt-BR   para maximizar o desempenho da atualização do bate-papo ao vivo do YouTube
// @description:ro      pentru a maximiza performanța actualizării chat-ului live de pe YouTube
// @description:sq      për të maksimizuar performancën e rifreskimit të bisedës në drejtpërdrejtë të YouTube
// @description:sk      pre maximalizáciu výkonu obnovy chatu naživo YouTube
// @description:sl      za maksimiziranje zmogljivosti posodabljanja klepeta v živo YouTube
// @description:sr      за максимизирање перформанси освежавања ЈуТјубовог уживо чета
// @description:fi      YouTube Live Chat -päivityksen suorituskyvyn maksimoimiseksi
// @description:sv      för att maximera prestandan för YouTube Live Chat Refresh
// @description:vi      để tối đa hóa hiệu suất Cập nhật Trò chuyện Trực tiếp YouTube
// @description:tr      YouTube Canlı Sohbet Yenileme performansını maksimize etmek için
// @description:be      для максімізацыі прадукцыйнасці абнаўлення YouTube Live Chat
// @description:bg      за максимизиране на производителността на актуализацията на YouTube Live Chat
// @description:ky      YouTube Live Chat Жаңыроодоонын иштетүүнү улантуу үчүн
// @description:kk      YouTube Live Chat үшін жаңарту әрекеттескілікті максималдооу
// @description:mk      за максимизирање на перформансите на ажурирањето на YouTube Live Chat
// @description:mn      YouTube Live Chat Дэлгэрэнгүй шинэчлэх үйлдлийг өргөтгөх
// @description:uk      для максимізації продуктивності оновлення YouTube Live Chat
// @description:el      για να μεγιστοποιήσετε την απόδοση της ανανέωσης της ζωντανής συνομιλίας του YouTube
// @description:hy      աջակցելու համար YouTube Live Chat Refresh-ի արագության մշակման
// @description:ur      یوٹیوب لائیو چیٹ تازہ کاری کی کارکردگی کو زیادہ سے زیادہ کرنے کے لئے
// @description:ar      لتحسين أداء تحديث الدردشة المباشرة على YouTube
// @description:fa      برای بیشینه‌سازی عملکرد به‌روزرسانی گفتگوی زنده یوتیوب
// @description:ne      YouTube लाइभ च्याट ताजाकरणको प्रदर्शनको अधिकताको लागि
// @description:mr      YouTube Live चॅट रिफ्रेशची प्रदर्शनाची जास्तीत जास्त करण्यासाठी
// @description:hi      YouTube लाइव चैट ताजगीची परफॉर्मन्स मोठी करण्यासाठी
// @description:as      YouTube Live চ্যাট তাজামৰ কাৰ্যক্ষমতা সৰ্বাধিক কৰিবলৈ
// @description:bn      YouTube লাইভ চ্যাট আপডেট এর পারফরমেন্স প্রধান করতে
// @description:pa      ਯੂਟਿਊਬ ਲਾਈਵ ਚੈਟ ਨਵੀਨਤਾ ਦੀ ਪ੍ਰਦਰਸ਼ਨ ਵੱਧ ਤੱਕ ਲਈ
// @description:gu      YouTube Live ચેટ રિફ્રેશનું કાર્યકિંચિત કરવા માટે સર્વોચ્ચ પ્રદર્શન
// @description:or      YouTube Live ଚାଟ ରିଫ୍ରେଶର ପ୍ରଦର୍ଶନ ବଢାଉଛିବା ଜଣାଇବା ପାଇଁ
// @description:ta      YouTube நேரடி உரையாடல் மீள்பதிவைப் பெரியதாக்க முடியும்
// @description:te      YouTube లైవ్ చాట్ రిఫ్రెష్ యొక్క పనిచేయబడిన ప్రదర్శనను గర్వించడానికి
// @description:kn      YouTube ನೇರವಾಗಿ ಸಂಭಾಷಣೆ ಪುನರ್ನವೀಕರಣದ ಪ್ರದರ್ಶನವನ್ನು ಗಣನೀಯವಾಗಿ ಮಾಡಲು
// @description:ml      YouTube Live Chat Refresh പ്രദർശനം അധികപ്പെടുത്താൻ
// @description:si      YouTube සජීවී නිර්මාණයේ නවතම Chat Refresh ප්‍ර‌ත්‍යාත්ම‌ාන සංවාදයක්
// @description:th      เพื่อเพิ่มประสิทธิภาพการรีเฟรชแชทสดของ YouTube
// @description:lo      ສັດລອນແລະຂະແໜງການອັບເດດໂດຍສາມາດການຂະຫຍາຍໄວ້ຂອງ YouTube Live Chat
// @description:my      YouTube Live Chat Refresh ကိုရှင်းတောက်သောအရှင့်အများ
// @description:ka      YouTube მაუსის გამოყენების გამოყენების დროს ხშირად მოხდება YouTube Live Chat Refresh
// @description:am      YouTube Live Chat Refresh-የሚሠራ ማጣሪያ
// @description:km      ដើម្បីធ្វើអោយភារកិច្ចសង្គមប្រទេសរបស់ YouTube ស្មើភាពខ្ពស់ក្នុងការធ្វើឱ្យទាន់សម័យបាន

// ==/UserScript==

/* jshint esversion:8 */

(function () {
    'use strict';

    window.__requestAnimationFrame__ = window.requestAnimationFrame; // native function



    const t0 = Date.now();
    let smoothScrollCallable = 0;
    let smoothScrollFunc = null;
    let updateTimeoutCallable = 0;
    let updateTimeoutFunc = null;

    const prettyStack = (stack) => {
        let lines = stack.split('\n');
        lines = lines.map(line => {
            line = line.replace(/\@[a-z\-]+\:\/\/\S+/g, (_) => {
                let m = /[^\/]+$/.exec(_);
                return m && m[0] ? '@' + m[0] : _;
            });
            return line
        })
        stack = lines.join('\n');
        return stack;
    }

    class Mutex {

        constructor() {
            this.p = Promise.resolve()
        }

        lockWith(f) {
            this.p = this.p.then(() => new Promise(f)).catch(console.warn)
        }

    }
    const mutex = new Mutex();
    /*
    const fStore = new WeakMap();
    const replaceFunc = (f, id) => {
        let cache = fStore.get(f);
        if (!cache) fStore.set(f, cache = {});
        if (cache[id]) return cache[id];
        let oriFunc = f;
        if (id === 'smoothScroll') {
            cache[id] = f = () => {
                smoothScrollCallable--;
                if (smoothScrollCallable === 0) oriFunc();
            };
        } else if (id === 'DOMscheduler') {
            // avoid parallel running - use mutex
            cache[id] = f = () => {
                mutex.lockWith(lockResolve => {
                    Promise.resolve(0).then(oriFunc).then(() => {
                        lockResolve();
                    });
                });
            };
        } else {
            console.warn('invalid id')
        }
        cache = null;
        return f;
    }
    */
    let byPass = false;
    const fix = () => {

        window.requestAnimationFrame = (function (f) {
            if (byPass) {
                return this.__requestAnimationFrame__(f);
            }

            const stack = new Error().stack;
            let oriFunc = f;

            // no modification on .showNewItems_ under MutationObserver
            if (stack.indexOf('.smoothScroll_') > 0) {
                smoothScrollCallable++;
                f = (hRes) => {
                    smoothScrollCallable--;
                    if (smoothScrollCallable === 0) oriFunc(hRes); // oriFunc refers to the last oriFunc
                    f = null;
                    oriFunc = null;
                };
            } else if (stack.indexOf('.start') > 0 || stack.indexOf('.unsubscribe') > 0) {
                // avoid parallel running - use mutex
                // under HTMLDivElement.removeChild or HTMLImageElement.<anonymous> => onLoad_
                f = (hRes) => {
                    mutex.lockWith(lockResolve => {
                        Promise.resolve(hRes).then(oriFunc).then(() => {
                            lockResolve();
                            f = null;
                            oriFunc = null;
                        });
                    });
                };
            } else if (stack.indexOf('.updateTimeout') > 0) {
                updateTimeoutCallable++;
                f = (hRes) => {
                    updateTimeoutCallable--;
                    if (updateTimeoutCallable === 0) oriFunc(hRes); // oriFunc refers to the last oriFunc
                    f = null;
                    oriFunc = null;
                };
            }
            // console.log(65, 'modified', oriFunc !== f);
            // console.log(prettyStack(stack));
            if (this.__requestAnimationFrame2__) {
                let m = this.requestAnimationFrame
                this.requestAnimationFrame = this.__requestAnimationFrame2__;
                byPass = true;
                let r = this.requestAnimationFrame(f); // the modified requestAnimationFrame will be called with byPass = true
                byPass = false;
                this.requestAnimationFrame = m;
                return r;
            } else {
                return this.__requestAnimationFrame__(f);
            }
        }).bind(window)

    }
    fix();
    let comparisonFunc = window.requestAnimationFrame;
    let cid = setInterval(() => {
        if (Date.now() - t0 > 8000) return clearInterval(cid); // give up after 8s
        if (window.requestAnimationFrame === comparisonFunc) return;
        clearInterval(cid);
        if ((window.requestAnimationFrame + "").indexOf('_updateAnimationsPromises') > 0) {
            // clearInterval(cid);
            window.__requestAnimationFrame2__ = window.requestAnimationFrame; // youtube's own schduler function
            // window.__requestAnimationFrame__ = window.requestAnimationFrame;
            fix();
            return;
        }
    }, 1);

    // Your code here...
})();