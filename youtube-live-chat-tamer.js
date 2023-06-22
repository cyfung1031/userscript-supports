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
// @name                YouTube Live Chat Tamer
// @namespace           http://tampermonkey.net/
// @version             2023.06.22.3
// @license             MIT License
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

    // const DELAY_AFTER_NEW_ITEMS_FETCHED = 145; // 145ms
    // - DOM will be created but not shown. after 145ms, the .smoothScroll_ will be called
    //   and `transform: translateY(...)` will be updated sequentially

    window.__requestAnimationFrame__ = window.requestAnimationFrame; // native function
    const _queueMicrotask = typeof queueMicrotask === 'function' ? queueMicrotask : (f) => Promise.resolve().then(f);

    const _setInterval = setInterval.bind(window); // native setInterval to avoid error
    const _clearInterval = clearInterval.bind(window); // native clearInterval to avoid error

    const t0 = Date.now();

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

        /**
         *  @param { (lockResolve: () => void} f
         */
        lockWith(f) {
            this.p = this.p.then(() => new Promise(f).catch(console.warn))
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
    class FuncBuilder {
        constructor() {
            this.callable = 0;
            this.func = null;
            this.reset = 0;
            this.rid = 0;
            this.g = (lockId, hRes) => {
                if (this.rid !== lockId) return;
                const uFunc = this.func; // uFunc refers to the last oriFunc
                if (!uFunc) return;
                this.callable--;
                const now = Date.now();
                if (this.reset < now) { // this will be set at 1st run, rarely run on subsequent calls
                    this.reset = now + 1000;
                    this.callable = 0;
                    ++this.rid;
                    if (this.rid > 1e9) this.rid = 1e3;
                }
                if (this.callable === 0) {
                    this.func = null; // unknown bug is found that this.func must be clear before execution

                    // avoid interuption with user operation
                    /*
                    _queueMicrotask(() => {
                        uFunc(hRes);
                    });
                    */
                    Promise.resolve(hRes).then(uFunc);
                    this.reset = now + 1000;
                }
            };
        }
        wrapper(oriFunc) {
            this.callable++;
            this.func = oriFunc;
            let lockId = this.rid;
            return (hRes) => this.g(lockId, hRes);
        }

    }
    // const smoothScrollF = new FuncBuilder();
    // const updateTimeoutF = new FuncBuilder();
    let byPass = false;
    /*
    let mww = [0, 0, 0, 0]
    _setInterval(()=>console.log(2323, mww), 5000)


        if(stack.indexOf('.smoothScroll_') > 0) mww[0]++
        if(stack.indexOf('.start') > 0) mww[1]++
        if(stack.indexOf('.unsubscribe') > 0) mww[2]++
        if(stack.indexOf('.updateTimeout') > 0) mww[3]++

    // livestream

    [71, 31, 8, 0]
    [106, 84, 23, 0]
    [122, 126, 37, 0]
    [141, 169, 51, 0]
    [162, 218, 65, 0]
    [188, 276, 81, 0]
    [203, 310, 94, 0]
    [225, 362, 109, 0]
    [243, 406, 122, 0]
    [256, 438, 134, 0]
    [271, 475, 146, 0]
    [284, 499, 153, 0]
    [382, 527, 164, 0]
    [425, 539, 169, 0]
    [477, 548, 176, 0]
    [536, 558, 183, 0]
    [628, 577, 193, 0]
    [752, 600, 203, 0]
    [838, 662, 218, 0]
    [853, 701, 233, 0]
    [869, 745, 247, 0]

    // replay

    [37, 37, 0, 349]
    [108, 81, 0, 851]
    [125, 115, 0, 1320]
    [143, 155, 0, 1736]
    [162, 202, 0, 2119]
    [180, 251, 0, 2442]
    [196, 291, 0, 2732]




    */
    /*
     const asyncWaiter = async (delay) => {
         let t = Date.now() + delay;
         do {
             await new Promise(r => window.__requestAnimationFrame__(r));
         } while (Date.now() < t);
     }
     */
    // let mz3 = 0;
    // let delayLocked = false;
    let mz1 = 0; let mz2 = 0; let mz3 = 0;
    const fix = () => {

        window.requestAnimationFrame = (function (f) {
            if (byPass) {
                return this.__requestAnimationFrame__(f);
            }
            const stack = new Error().stack;
            let useSimpleRAF = false;
            const oriFunc = f;
            // let delayBeforeRAF = 0;
            let rAfHandling = 0;
            // no modification on .showNewItems_ under MutationObserver
            let pj = 0;
            if (stack.indexOf('.smoothScroll_') > 0) {
                // Function Requested: .smoothScroll_
                // console.log('stack', '.smoothScroll_')
                // essential function for auto scrolling
                useSimpleRAF = true; // repeating calls
                // all calls have to be executed otherwise scrolling will be locked occasionally.
                rAfHandling = 1; // .smoothScroll_: performance.now() - lastTimestamp per each rAf; with `transform: translate(...)` update
                // f = smoothScrollF.wrapper(oriFunc); // one smoothScroll per multiple new items
                // Performance Analaysis: performance.now() - lastTimestamp per each rAf
            } else if (stack.indexOf('.showNewItems_') > 0) {
                // Function Requested: .smoothScroll_
                // console.log('stack', '.showNewItems_')
                // essential function for showing new item(s)
                useSimpleRAF = false; // when new items avaiable
                rAfHandling = 2; // lock with DELAY_AFTER_NEW_ITEMS_FETCHED
                // delayBeforeRAF = DELAY_AFTER_NEW_ITEMS_FETCHED; // delayed the first smoothScroll_
                // delayBeforeRAF = 1;
                // if (++mz3 > 1e9) mz3 = 1e3;
                if (++mz1 > 1e9) mz1 = 1e3;
                pj = 1;
            } else if (stack.indexOf('.start') > 0 || (stack.indexOf('.unsubscribe') > 0 ? (useSimpleRAF = true) : false)) {
                // .start will also match ".startCountdown"
                // console.log('stack', '.start/unsubscribe', 'unsubscribe=' + useSimpleRAF)
                // avoid parallel running - use mutex
                // under HTMLDivElement.removeChild or HTMLImageElement.<anonymous> => onLoad_
                // .unsubscribe: non essential function => useSimpleRAF
                rAfHandling = 2; // lock with DELAY_AFTER_NEW_ITEMS_FETCHED
                // Performance Analaysis: (when the chat is idle) .unsubscribe => .start => .showNewItems_ => .smoothScroll_ X N
                // delayBeforeRAF = 1;
                if (useSimpleRAF) {
                    pj = 3;
                    if (++mz3 > 1e9) mz3 = 1e3;
                } else {
                    pj = 2;
                    if (++mz2 > 1e9) mz2 = 1e3;
                }
            } else if (stack.indexOf('.updateTimeout') > 0) {
                // console.log('stack', '.updateTimeout')
                // .updateTimeout: non essential function => useSimpleRAF
                useSimpleRAF = true;
                rAfHandling = 0; // multiple video::timeupdate might call in one nimation Frame; but no DOM manipulation (state update only)
                // f = updateTimeoutF.wrapper(oriFunc);
                // Performance Analaysis: triggered by video::timeupdate
            } else if (stack.indexOf('__deraf') > 0 || stack.indexOf('rEa') > 0) {
                // useSimpleRAF to avoid dead lock in participant list
                useSimpleRAF = true;
                // Performance Analaysis: as a core control
            } else {
                // console.log('stack', '??')
                useSimpleRAF = false;
                // when page is first loaded:
                // 1) new hv -> ev
                // 2) .initializeFirstPartyVeLogging
                // 3) .keepScrollClamped
                // console.log(65, 'modified', oriFunc !== f);
                // console.log(prettyStack(stack));
                // Performance Analaysis: mainly for initialization
            }

            /*
            if (delayBeforeRAF > 0) {
                const delay = delayBeforeRAF;
                if (!delayLocked) {
                    mutex.lockWith(lockResolve => {
                        delayLocked = true; // set just before asyncWaiter, reset when rAf fires
                        asyncWaiter(delay).then(() => {
                            lockResolve();
                            delayLocked = false;
                        });
                    });
                }
            }
            */

            let delayedFunc = oriFunc;
            // let lz3 = mz3;
            let lz1 = mz1;
            // let lz2 = mz2;
            let lz3 = mz3;
            switch (rAfHandling) {
                case 1:
                    f = (hRes) => {
                        // avoid interuption with user operation
                        /*
                        _queueMicrotask(() => {
                            delayedFunc(hRes);
                        });
                        */
                        Promise.resolve(hRes).then(delayedFunc);
                    };
                    break;
                case 2:
                    f = (hRes) => {
                        if (pj === 1 && lz1 !== mz1) return; // skip all hidden .showNewItems_'s f
                        //if(pj===2 && lz2!==mz2) return;
                        if (pj === 3 && lz3 !== mz3) return; // skip all hidden .unsubscribe's f
                        // if (lz3 !== mz3) {
                        //     // bypass ".start" once restored from background tab to foreground tab
                        //     return;
                        // }
                        mutex.lockWith(lockResolve => {
                            // force calls in order
                            // pause {DELAY_AFTER_NEW_ITEMS_FETCHED}ms after .showNewItems_ execution
                            // fetch more new items by batch due to delay
                            const final = () => {
                                lockResolve();
                                delayedFunc = null;
                                lockResolve = null;
                            };
                            Promise.resolve(hRes).then(delayedFunc).then(final).catch(final);
                        });
                    };
                    break;
            }

            // console.log(65, 'modified', oriFunc !== f);
            // console.log(prettyStack(stack));

            let r;
            if (!useSimpleRAF && this.__requestAnimationFrame2__) {
                byPass = true;
                let m = this.requestAnimationFrame
                this.requestAnimationFrame = this.__requestAnimationFrame2__;
                r = this.requestAnimationFrame(f); // the modified requestAnimationFrame will be called with byPass = true
                this.requestAnimationFrame = m;
                byPass = false;
            } else {
                byPass = true; // just in case, avoid infinite loops
                r = this.__requestAnimationFrame__(f);
                byPass = false;
            }
            return r;
        }).bind(window)

    }
    fix();
    let comparisonFunc = window.requestAnimationFrame;
    let cid = _setInterval(() => {
        if (Date.now() - t0 > 8000) return _clearInterval(cid); // give up after 8s
        if (window.requestAnimationFrame === comparisonFunc) return;
        if (!comparisonFunc) return;
        comparisonFunc = null;
        _clearInterval(cid);
        if ((window.requestAnimationFrame + "").indexOf('_updateAnimationsPromises') > 0) {
            // _clearInterval(cid);
            window.__requestAnimationFrame2__ = window.requestAnimationFrame; // youtube's own schduler function
            // window.__requestAnimationFrame__ = window.requestAnimationFrame;
            fix();
            return;
        }
    }, 1);


    /**

     h.onParticipantsChanged = function() {
        this.notifyPath("participantsManager.participants")
    }



    at h.onParticipantsChanged (live_chat_polymer.js:8334:41)
    at e.<anonymous> (live_chat_polymer.js:1637:69)
    at e.Bb [as __shady_dispatchEvent] (webcomponents-sd.js:46:110)
    at k.dispatchEvent (webcomponents-sd.js:122:237)
    at mu (live_chat_polymer.js:1677:71)
    at Object.wga [as fn] (live_chat_polymer.js:1678:99)
    at a._propertiesChanged (live_chat_polymer.js:1726:426)
    at b._flushProperties (live_chat_polymer.js:1597:200)
    at a._invalidateProperties (live_chat_polymer.js:1718:69)
    at a.notifyPath (live_chat_polymer.js:1741:182)

    */

    const foundMap = (base, content) => {

        let lastSearch = 0;
        let founds = base.map(baseEntry => {
            let search = content.indexOf(baseEntry, lastSearch);
            if (search < 0) return false;
            lastSearch = search + 1;
            return true;
        });
        return founds;


    }



    const spliceIndicesFunc = (beforeParticipants, participants, idsBefore, idsAfter) => {

        const handler1 = {
            get(target, prop, receiver) {
                if (prop === 'object') {
                    return participants; // avoid memory leakage
                }
                if (prop === 'type') {
                    return 'splice';
                }
                return target[prop];
            }
        };
        const releaser = () => {
            beforeParticipants = null;
            participants = null;
            idsBefore = null;
            idsAfter = null;
        }


        let foundsForAfter = foundMap(idsAfter, idsBefore);
        let foundsForBefore = foundMap(idsBefore, idsAfter);

        let indexSplices = [];
        let contentUpdates = [];
        for (let i = 0, j = 0; i < foundsForBefore.length || j < foundsForAfter.length;) {

            if (beforeParticipants[i] === participants[j]) {
                i++; j++;
            } else if (idsBefore[i] === idsAfter[j]) {
                // content changed
                contentUpdates.push({ indexI: i, indexJ: j })
                i++; j++;
            } else {
                let addedCount = 0;
                for (let q = j; q < foundsForAfter.length; q++) {
                    if (foundsForAfter[q] === false) addedCount++;
                    else break;
                }

                let removedCount = 0;
                for (let q = i; q < foundsForBefore.length; q++) {
                    if (foundsForBefore[q] === false) removedCount++;
                    else break;
                }
                if (!addedCount && !removedCount) {
                    throw 'ERROR(0xFF32): spliceIndicesFunc';
                }
                indexSplices.push(new Proxy({
                    index: j,
                    addedCount: addedCount,
                    removed: removedCount >= 1 ? beforeParticipants.slice(i, i + removedCount) : []
                }, handler1));

                i += removedCount;
                j += addedCount;

            }
        }
        return { indexSplices, contentUpdates, releaser };


    }

    const mutexParticipants = new Mutex();


    /*

    customElements.get("yt-live-chat-participant-renderer").prototype.notifyPath=function(){  console.log(123);  console.log(new Error().stack)}

    VM63631:1 Error
    at customElements.get.notifyPath (<anonymous>:1:122)
    at e.forwardRendererStamperChanges_ (live_chat_polymer.js:4453:35)
    at e.rendererStamperApplyChangeRecord_ (live_chat_polymer.js:4451:12)
    at e.rendererStamperObserver_ (live_chat_polymer.js:4448:149)
    at Object.pu [as fn] (live_chat_polymer.js:1692:118)
    at ju (live_chat_polymer.js:1674:217)
    at a._propertiesChanged (live_chat_polymer.js:1726:122)
    at b._flushProperties (live_chat_polymer.js:1597:200)
    at a._invalidateProperties (live_chat_polymer.js:1718:69)
    at a.notifyPath (live_chat_polymer.js:1741:182)

    */

    function convertToIds(participants) {
        return participants.map(participant => {
            if (!participant || typeof participant !== 'object') {
                console.warn('Error(0xFA41): convertToIds', participant);
                return participant; // just in case
            }
            let keys = Object.keys(participant);
            // liveChatTextMessageRenderer
            // liveChatParticipantRenderer - livestream channel owner [no authorExternalChannelId]
            // liveChatPaidMessageRenderer
            /*

            'yt-live-chat-participant-renderer' utilizes the following:
            authorName.simpleText: string
            authorPhoto.thumbnails: Object{url:string, width:int, height:int} []
            authorBadges[].liveChatAuthorBadgeRenderer.icon.iconType: string
            authorBadges[].liveChatAuthorBadgeRenderer.tooltip: string
            authorBadges[].liveChatAuthorBadgeRenderer.accessibility.accessibilityData: Object{label:string}

            */
            if (keys.length !== 1) {
                console.warn('Error(0xFA42): convertToIds', participant);
                return participant; // just in case
            }
            let key = keys[0];
            let renderer = (participant[key] || 0);
            let authorName = (renderer.authorName || 0);
            let text = `${authorName.simpleText || authorName.text}`
            let res = participant; // fallback if it is not a vaild entry
            if (typeof text !== 'string') {
                console.warn('Error(0xFA53): convertToIds', participant);
            } else {
                text = `${renderer.authorExternalChannelId || 'null'}|${text || ''}`;
                if (text.length > 1) res = text;
            }
            return res;
            // return renderer?`${renderer.id}|${renderer.authorExternalChannelId}`: '';
            // note: renderer.id will be changed if the user typed something to trigger the update of the participants' record.
        });
    }

    const CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT = false;
    const checkChangeToParticipantRendererContent = CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT ? (p1, p2) => {
        // just update when content is changed.
        if (p1.authorName !== p2.authorName) return true;
        if (p1.authorPhoto !== p2.authorPhoto) return true;
        if (p1.authorBadges !== p2.authorBadges) return true;
        return false;
    } : (p1, p2) => {
        // keep integrity all the time.
        return p1 !== p2; // always true
    }

    async function asyncOnDOMReady(participants, listDom) {
        // assume listDOM items would not be changed externally
        let expired = Date.now() + 1200;
        let res = -1;
        do {
            let doms = HTMLElement.prototype.querySelectorAll.call(listDom, 'yt-live-chat-participant-renderer');
            if (participants.length === doms.length) {
                res = 0;
                break;
            }
            await new Promise(resolve => window.__requestAnimationFrame__(resolve));
        } while (Date.now() < expired);

        return res;

        // let doms = HTMLElement.prototype.querySelectorAll.call(this,'yt-live-chat-participant-renderer')
        // console.log(participants.length, doms.length) // different if no requestAnimationFrame
    }

    function notifyPath7081(path) {

        let stack = new Error().stack;
        if (path !== "participantsManager.participants" || stack.indexOf('.onParticipantsChanged') < 0) {
            return this.__notifyPath5035__.apply(this, arguments);
        }

        mutexParticipants.lockWith(lockResolve => {

            const participants = [...this.participantsManager.participants];

            const beforeParticipants = beforeParticipantsMap.get(this) || [];
            beforeParticipantsMap.set(this, participants);

            let doms = HTMLElement.prototype.querySelectorAll.call(this, 'yt-live-chat-participant-renderer')
            // console.log(participants.length, doms.length) // different if no requestAnimationFrame
            if (beforeParticipants.length !== doms.length) {
                // there is somewrong for the cache. - sometimes happen
                this.__notifyPath5035__("participantsManager.participants"); // full refresh
                asyncOnDOMReady(participants, this).then(() => {
                    window.__requestAnimationFrame__(() => {
                        _queueMicrotask(lockResolve);
                    });
                });
                return;
                // console.warn("ERROR(0xE2C1): notifyPath7081", beforeParticipants.length, doms.length)
            }

            const idsBefore = convertToIds(beforeParticipants);
            const idsAfter = convertToIds(participants);

            const { indexSplices, contentUpdates, releaser } = spliceIndicesFunc(beforeParticipants, participants, idsBefore, idsAfter);

            let delayLockResolve = false;
            let lengthChanged = false;


            if (indexSplices.length >= 1) {


                // let p2 =  participants.slice(indexSplices[0].index, indexSplices[0].index+indexSplices[0].addedCount);
                // let p1 = indexSplices[0].removed;
                // console.log(indexSplices.length, indexSplices ,p1,p2,  convertToIds(p1),convertToIds(p2))

                /* folllow
                    a.notifyPath(c + ".splices", d);
                    a.notifyPath(c + ".length", b.length);
                */
                // stampDomArraySplices_

                this.__notifyPath5035__("participantsManager.participants.splices", {
                    indexSplices
                });
                releaser();
                this.__notifyPath5035__("participantsManager.participants.length",
                    participants.length
                );
                lengthChanged = true;

                // let doms = HTMLElement.prototype.querySelectorAll.call(this,'yt-live-chat-participant-renderer')
                // console.log(participants.length, doms.length) // different if no requestAnimationFrame

                /*
                for(const indexSplice of indexSplices){
                    if(indexSplice.addedCount === indexSplices.removed.length){
                        participants.slice(indexSplice.index, indexSplice.index+indexSplice.addedCount).map(p=>((p||0).liveChatTextMessageRenderer||0).id)
                    }
                }
                */


                delayLockResolve = true;
            } else {
                if (beforeParticipants.length !== participants.length) {
                    console.warn("ERROR(0xFAB7): notifyPath7081")
                    lengthChanged = true;
                }

                // if (beforeParticipants.length !== participants.length) {
                //     // just in case. should not happen
                //     this.__notifyPath5035__("participantsManager.participants.length",
                //         participants.length
                //     );
                //     delayLockResolve = true;
                // }

            }

            (lengthChanged ? asyncOnDOMReady(participants, this) : Promise.resolve(0)).then(() => {

                let doms = HTMLElement.prototype.querySelectorAll.call(this, 'yt-live-chat-participant-renderer')
                // console.log(participants.length, doms.length) // different if no requestAnimationFrame
                let wrongSize = participants.length !== doms.length;

                if (wrongSize) {

                    console.warn("ERROR(0xE2C3): notifyPath7081", beforeParticipants.length, participants.length, doms.length)

                    this.__notifyPath5035__("participantsManager.participants"); // full refresh
                    asyncOnDOMReady(participants, this).then(() => {
                        window.__requestAnimationFrame__(() => {
                            _queueMicrotask(lockResolve);
                        });
                    })
                    return;

                } else {

                    // participants.length === doms.length before contentUpdates
                    if (contentUpdates.length >= 1) {
                        for (const contentUpdate of contentUpdates) {
                            let isChanged = checkChangeToParticipantRendererContent(beforeParticipants[contentUpdate.indexI], participants[contentUpdate.indexJ]);
                            if (isChanged) {
                                this.__notifyPath5035__(`participantsManager.participants[${contentUpdate.indexJ}]`);
                            }
                        }
                        delayLockResolve = true;
                    }

                }

                if (delayLockResolve) {
                    // __requestAnimationFrame__ is required to avoid particiant update during DOM changing (stampDomArraySplices_)
                    // mutex lock with requestAnimationFrame can also disable participants update in background
                    window.__requestAnimationFrame__(() => {
                        _queueMicrotask(lockResolve);
                    });
                } else {
                    lockResolve();
                }

            });






        });

        /*

        c
        'shownItems.splices'
        d
        {indexSplices: Array(1)}
        indexSplices
        :
        Array(1)
        0
        :
        {index: 1, addedCount: 1, removed: Array(0), object: Array(2), type: 'splice'}
        length
        :
        1
        [[Prototype]]
        :
        Array(0)
        [[Prototype]]
        :
        Object

        */


    }


    let beforeParticipantsMap = new WeakMap();

    /*
    let cid2 = _setInterval(() => {


        for (const s of document.querySelectorAll('yt-live-chat-participant-list-renderer:not(.n9fJ3)')) {
            s.classList.add('n9fJ3');
            Promise.resolve(s).then(s => {


                if (typeof s.notifyPath !== 'function' || typeof s.__notifyPath5035__ !== 'undefined') {


                    console.warn("ERROR(0xE318): yt-live-chat-participant-list-renderer")
                    return;
                }


                s.__notifyPath5035__ = s.notifyPath

                beforeParticipantsMap.set(s, [...s.participantsManager.participants]);
                s.notifyPath = notifyPath7081;

                // if(typeof s.onParticipantsChanged !=='function') return;
                // s.onParticipantsChanged = function(){

                //     // this.notifyPath("participantsManager.participants");
                // }


            });
        }

    }, 1);
    */


    const setup322 = () => {

        customElements.whenDefined("yt-live-chat-participant-list-renderer").then(p => {

            let proto = window.customElements.get("yt-live-chat-participant-list-renderer").prototype
            if (typeof proto.attached !== 'function') return;
            proto.__attached411__ = proto.attached;
            proto.__setup334__ = function () {

                if (beforeParticipantsMap.has(this)) return;

                const s = this;
                s.classList.add('n9fJ3');
                Promise.resolve(s).then(s => {


                    if (typeof s.notifyPath !== 'function' || typeof s.__notifyPath5035__ !== 'undefined') {
                        console.warn("ERROR(0xE318): yt-live-chat-participant-list-renderer")
                        return;
                    }


                    s.__notifyPath5035__ = s.notifyPath

                    beforeParticipantsMap.set(s, [...s.participantsManager.participants]);
                    s.notifyPath = notifyPath7081;

                    // if(typeof s.onParticipantsChanged !=='function') return;
                    // s.onParticipantsChanged = function(){

                    //     // this.notifyPath("participantsManager.participants");
                    // }


                });


            }
            proto.attached = function () {

                this.__setup334__();

                proto.__attached411__.apply(this, arguments);
            };

            // for elements before this execution.
            requestAnimationFrame(() => {
                for (const s of document.querySelectorAll('yt-live-chat-participant-list-renderer:not(.n9fJ3)')) {
                    if (s.__dataEnabled === true || s.__dataReady === true) {
                        s.__setup334__();
                    }
                }
            });

        });

    }

    let cid2 = _setInterval(() => {

        if (typeof customElements !== "object") return; // waiting polyfill
        _clearInterval(cid2);
        if (typeof (customElements || 0).whenDefined !== 'function') return; // error - ignore

        setup322();

    }, 1);



    // Your code here...
})();