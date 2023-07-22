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
// @name                Restore YouTube Username from Handle to Custom
// @namespace           http://tampermonkey.net/
// @version             0.8.2
// @license             MIT License

// @author              CY Fung
// @match               https://www.youtube.com/*
// @match               https://m.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/general-icon.png
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page

// @compatible          firefox Violentmonkey
// @compatible          firefox Tampermonkey
// @compatible          firefox Firemonkey
// @compatible          chrome Violentmonkey
// @compatible          chrome Tampermonkey
// @compatible          opera Violentmonkey
// @compatible          opera Tampermonkey
// @compatible          safari Stay
// @compatible          edge Violentmonkey
// @compatible          edge Tampermonkey
// @compatible          brave Violentmonkey
// @compatible          brave Tampermonkey

// @description         To restore YouTube Username to the traditional custom name
// @description:ja      YouTubeのユーザー名を伝統的なカスタム名に復元するために。
// @description:zh-TW   將 YouTube 使用者名稱從 Handle 恢復為自訂名稱
// @description:zh-CN   将 YouTube 用户名从 Handle 恢复为自定义名称

// @description:ko      YouTube 사용자 이름을 전통적인 사용자 지정 이름으로 복원합니다.
// @description:ru      Восстановление имени пользователя YouTube с помощью обычного настраиваемого имени
// @description:af      Herstel YouTube-gebruikersnaam vanaf Handvat na Aangepaste Naam
// @description:az      YouTube İstifadəçi Adını Özəl Adından İstifadə Etmək
// @description:id      Mengembalikan Nama Pengguna YouTube dari Handle ke Kustom
// @description:ms      Pulihkan Nama Pengguna YouTube dari Handle ke Tersuai
// @description:bs      Vrati YouTube korisničko ime sa ručke na prilagođeno ime
// @description:ca      Restaurar el nom d'usuari de YouTube de la màniga al personalitzat
// @description:cs      Obnovte uživatelské jméno YouTube z rukojeti na vlastní
// @description:da      Gendan YouTube-brugernavn fra Håndtag til Brugerdefineret
// @description:de      Stellt den YouTube-Benutzernamen von Handle auf Benutzerdefiniert wieder her
// @description:et      Taasta YouTube'i kasutajanimi käepidemelt kohandatud nimeks
// @description:es      Restaurar el nombre de usuario de YouTube de la manija al personalizado
// @description:eu      Berrezarri YouTube Erabiltzaile-izena Manipulatik Pertsonalizatuera
// @description:fr      Restaurer le nom d'utilisateur YouTube de la poignée au nom personnalisé
// @description:gl      Restaura o nome de usuario de YouTube da manexa ao personalizado
// @description:hr      Vrati YouTube korisničko ime s ručke na prilagođeno ime
// @description:zu      Hlanganisa Igama Lokusebenza lwe-YouTube kusuka kwi-Handle kuze kube kusebenza kakhulu
// @description:is      Endurheimtu YouTube Notandanafn frá Handfangi til Sérsniðins
// @description:it      Ripristina il nome utente di YouTube da Handle a Personalizzato
// @description:sw      Rejesha Jina la Mtumiaji wa YouTube kutoka kwa Kishughulikia hadi Desturi
// @description:lv      Atjaunot YouTube lietotāja vārdu no roktura uz pielāgotu
// @description:lt      Atkurti „YouTube“ naudotojo vardą iš rankenos į tinkamą
// @description:hu      Visszaállítja a YouTube felhasználónevet a fogantyútól a testreszabottra
// @description:nl      Herstel YouTube-gebruikersnaam van Handle naar Aangepaste naam
// @description:uz      YouTube foydalanuvchining nomini Hurda dan Shaxsiylashtirilgan nomga qaytarish
// @description:pl      Przywróć nazwę użytkownika YouTube z uchwytu na niestandardową
// @description:pt      Restaurar o nome de usuário do YouTube de Handle para Personalizado
// @description:pt-BR   Restaurar o nome de usuário do YouTube de Handle para Personalizado
// @description:ro      Restaurați Numele de Utilizator YouTube de la Mâner la Personalizat
// @description:sq      Rikthe emrin e përdoruesit të YouTube nga Maja në Personalizuar
// @description:sk      Obnovte používateľské meno YouTube z rukoväte na vlastné
// @description:sl      Obnovite uporabniško ime YouTube iz ročaja v prilagojeno ime
// @description:sr      Вратите YouTube корисничко име са ручке на прилагођено име
// @description:fi      Palauta YouTube-käyttäjänimi kahvasta räätälöityyn nimeen
// @description:sv      Återställ YouTube-användarnamnet från handtaget till anpassat namn
// @description:vi      Khôi phục Tên người dùng YouTube từ Tay cầm thành Tùy chỉnh
// @description:tr      Özel İsme Kullanıcı Adını İade Etme
// @description:be      Вярнуць імя карыстальніка YouTube з ручкі на наладжваецца
// @description:bg      Възстановяване на потребителско име на YouTube от дръжка до персонализирано име
// @description:ky      YouTube колдонуучунун атты боюнча атын тамашалау
// @description:kk      YouTube пайдаланушының атын Handle танымасынан Жеке атауға қайта түсіру
// @description:mk      Врати го името на YouTube корисникот од држачот во прилагодено име
// @description:mn      YouTube хэрэглэгчийн нэрийг хүчирхийлэгчидээс Байгууллагад нь солих
// @description:uk      Відновлення імені користувача YouTube з ручки на налаштоване ім'я
// @description:el      Επαναφορά Ονόματος Χρήστη YouTube από τη Λαβή σε Προσαρμοσμένο
// @description:hy      Վերականգնել YouTube-ի Օգտագործողի Անունը Ձեռքից Հատուցվածությանով
// @description:ur      ہینڈل سے یوٹیوب یوزر نیم کو کسٹم میں بحال کریں
// @description:ar      استعادة اسم مستخدم YouTube من المقبض إلى مخصص
// @description:fa      بازیابی نام کاربری یوتیوب از دستگیره به سفارشی
// @description:ne      ह्यान्डलबाट यूट्युब प्रयोगकर्तानाम अनुकूलमा उपयोग गर्नुहोस्
// @description:mr      हॅंडलमधून यूट्यूब वापरकर्तानाव अनुकूलित करा
// @description:hi      हैंडल से यूट्यूब यूजरनेम को कस्टम में बदलें
// @description:as      কাস্টম হতে হ্যান্ডেল পৰা ইউটিউব ব্যৱহাৰকাৰী নাম পুনৰ্স্থাপন কৰক
// @description:bn      হ্যান্ডেল থেকে কাস্টম করে ইউটিউব ব্যবহারকারীর নাম পুনরুদ্ধার করুন
// @description:pa      ਯੂਟਿਊਬ ਯੂਜਰਨਾਂ ਦਾ ਨਾਂ ਹੈਂਡਲ ਤੋਂ ਕਸਟਮ ਵਿੱਚ ਮੁੜ ਲਾਓ
// @description:gu      હેન્ડલથી કસ્ટમમાંથી YouTube વપરાશકર્તાનું નામ પુનર્સ્થાપિત કરો
// @description:or      କଷ୍ଟମରେ ହେନ୍ଡେଲରୁ YouTube ବ୍ୟବହାରକାରୀଙ୍କ ନାମ ପୁନର୍ପ୍ରାପ୍ତ କରନ୍ତୁ
// @description:ta      ஹேண்டில் இருந்து கஸ்டம் ஆக்கும் யூடியூப் பயனர்பெயரை மீட்டமைக்கவும்
// @description:te      హాండును నుంచి YouTube వాడుకరి పేరును కస్టమ్‌కు పునరుద్ధరించండి
// @description:kn      ಹ್ಯಾಂಡಲ್‌ನಿಂದ YouTube ಬಳಕೆದಾರ ಹೆಸರನ್ನು ಅನುಕೂಲಿತ ಮಾಡಿ
// @description:ml      ഹാന്റിൽ നിന്ന് കസ്റ്റം ആക്കാംമെന്ന് യുട്യൂബ് ഉപയോക്തൃനാമം മറ്റുള്ളവരെ മാറ്റുക
// @description:si      හැන්ඩල් සහිතව YouTube භාවිතයේ පරිශීලක නාමය ස්වයං කරයි
// @description:th      กู้คืนชื่อผู้ใช้ YouTube จากแฮนดิลไปเป็นชื่อที่กำหนดเอง
// @description:lo      ເຮັດຊະນິດຊື່ຜູ້ໃຊ້ YouTube ຈາກ Handle ຈົດໄວ້ເປັນຊື່ປັດຈຸບັນ
// @description:my      Handle မှ YouTube အသုံးပြုသူအမည်ကို စတင်ပြန်စစ်ဆေးပါ
// @description:ka      YouTube მომხმარებლის სახელის აღდგენა ხანდლიდან მორგებულ სახელში
// @description:am      ስለ YouTube የተጠቃሚ ስም ማስቀመጫዎቹን ከ Handle ወደ Custom ውስጥ እንደሚመጣ ይረዳሉ
// @description:km      កំណត់ YouTube ពាក្យឈ្មោះពី Handle ទៅជាឈ្មោះផ្ទាល់ខ្លួន

// ==/UserScript==

/* jshint esversion:8 */


/**
    @typedef DisplayNameResultObject
    @type {Object}
    @property {string} title
    @property {string?} externalId
    @property {string[]} ownerUrls
    @property {string} channelUrl
    @property {string} vanityChannelUrl
    @property {boolean|undefined} verified123

*/

/**
    @typedef ChannelIdToHandleResult
    @type {Object}
    @property {string} handleText
    @property {boolean} justPossible
 */

(function (__CONTEXT__) {
    'use strict';

    const USE_RSS_FETCHER = true;
    const USE_TIMEOUT_SIGNAL = false;
    const USE_CHANNEL_META = true;
    const CHANGE_FOR_SHORTS_CHANNEL_NAME = false;

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    const { fetch, JSON, Request, AbortController, setTimeout, clearTimeout } = __CONTEXT__; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    const timeoutSignal = AbortController && USE_TIMEOUT_SIGNAL ? (timeout) => {
        let controller = new AbortController();
        const r = controller.signal;
        let cid = setTimeout(() => {
            if (cid >= 1) {
                cid = 0;
                controller && controller.abort();
                controller = null;
            }
        }, timeout);
        r.clearTimeout = () => {
            if (cid >= 1) {
                clearTimeout(cid);
                cid = 0;
            }
        }
        return r;
    } : () => { };

    const fxOperator = (proto, propertyName) => {
        let propertyDescriptorGetter = null;
        try {
            propertyDescriptorGetter = Object.getOwnPropertyDescriptor(proto, propertyName).get;
            // https://github.com/cyfung1031/userscript-supports/issues/9
            // .parentNode becomes DocumentFragment
            /**
             *
             * Issue Description: YtCustomElements - Custom DOM Operations overrided in FireFox
             *
             * e.g. ytd-comment-renderer#comment > div#body
             *
             * ${div#body}.parentNode = DocumentFragment <Node.parentNode>
             * ${ytd-comment-renderer#comment}.firstElementChild <Element.firstElementChild>
             *
             * Cofirmed Affected: parentNode, firstChild, firstElementChild, lastChild, lastElementChild, querySelector, & querySelectorAll
             *
             * Alternative way: ytCustomElement.$.xxxxxxx
             *
             */
        } catch (e) { }
        return typeof propertyDescriptorGetter === 'function' ? (e) => propertyDescriptorGetter.call(e) : (e) => e[propertyName];
    };

    const fxAPI = (proto, propertyName) => {
        const methodFunc = proto[propertyName];
        return typeof methodFunc === 'function' ? (e, ...args) => methodFunc.apply(e, args) : (e, ...args) => e[propertyName](...args);
    };

    /** @type { (node: Node)=>Node | null } */
    const nodeParent = fxOperator(Node.prototype, 'parentNode');
    /** @type { (node: Node)=>Node | null } */
    const nodeFirstChild = fxOperator(Node.prototype, 'firstChild');
    /** @type { (node: Node)=>Node | null } */
    const nodeNextSibling = fxOperator(Node.prototype, 'nextSibling');

    /** @type { (node: ParentNode, selector: string)=>Element | null } */
    const elementQS = fxAPI(Element.prototype, 'querySelector');
    /** @type { (node: ParentNode, selector: string)=>Element[] } */
    const elementQSA = fxAPI(Element.prototype, 'querySelectorAll');

    /*
 
 
    init
 
        initialdata
        state-progress
        state-responsereceived
        player-autonav-pause
        state-change
        state-navigateend
        player-initialized
        renderer-module-load-start
        video-data-change
        player-state-change
        updateui
        renderer-module-load-end -> channel owner DOM available
        player-autonav-pause
        updateui
        renderer-module-load-start
        updateui
        renderer-module-load-end
 
 
        playing
 
        h5player.video-progress
        h5player.video-progress
        h5player.video-progress
        h5player.video-progress
        ...
 
 
 
 
    navigate new video
 
        state-navigatestart
        state-change => channel owener DOM vanished
        state-progress
        ...
        h5player.player-state-change
        h5player.video-data-change
        h5player.player-state-change
        h5player.muted-autoplay-change
        h5player.volume-change
        h5player.video-data-change
        h5player.volume-change
        ...
 
        state-progress
        ...
 
        state-progress => channel owner DOM appear [just before state-responsereceived]
        state-responsereceived
 
        video-data-change
        state-change
        state-navigateend
 
 
 
 
    UX interaction
 
        user-activity
        player-autonav-pause
 
 
 
 
 
    EventTarget.prototype.uhfsE = EventTarget.prototype.dispatchEvent
 
    EventTarget.prototype.dispatchEvent = function (ev) {
        if (ev instanceof Event) {
            if (ev.type === 'video-progress') { } else {
                console.log(ev.type, this, ev.target)
                if (ev.target === null) {
                    console.log(ev.type, (document.querySelector('ytm-app') || 0).data)
                    console.log(ev.type, (document.querySelector('ytm-slim-owner-renderer') || 0).textContent)
                }
            }
        }
        return this.uhfsE.apply(this, arguments);
    }
 
 
 
*/

    const isMobile = location.hostname === 'm.youtube.com';

    const cfg = {};
    class Mutex {

        constructor() {
            this.p = Promise.resolve()
        }

        /**
         *  @param {(lockResolve: () => void)} f
         */
        lockWith(f) {
            this.p = this.p.then(() => new Promise(f).catch(console.warn))
        }

    }

    class OrderedMutex extends Mutex {
        constructor() {
            super();
            this.nextIndex = 0;
            this.arr = [];
            this.lockFunc = resolve => {
                if (this.arr.length >= 1) {
                    let f = this.arr[0];
                    if (typeof f === 'function') {
                        this.arr.shift();
                        if (this.nextIndex > 0) this.nextIndex--;
                        f(resolve);
                        return;
                    } else {
                        // reset if unknown error
                        this.arr.length = 0;
                        this.nextIndex = 0;
                    }
                }
                resolve();
            };
        }
        /**
         *  @param {(lockResolve: () => void)} f
         */
        add(f) {
            if (this.nextIndex === this.arr.length) {
                this.arr.push(f); this.nextIndex++;
            } else {
                this.arr.splice(this.nextIndex++, 0, f);
            }
            this.lockWith(this.lockFunc);
        }
    }
    // usage: run network request one by one
    const mutex = new OrderedMutex();

    /**
   * @typedef { AsyncValue<T> | T} AsyncOrResolvedValue<T>
   * @template T
   */

    //
    /**
     * usage: cache the network result per web application instance.
     *  @type {Map<string, AsyncOrResolvedValue<DisplayNameResultObject>>} */
    const displayNameResStore = new Map();

    /**
     * usage: mapping the .dataChanged() to the wrapped function - only few entries as most are {ytd-comment-renderer}.dataChanged().
     *  @type {WeakMap<Function, Function>} */
    const dataChangedFuncStore = new WeakMap();

    /**
     * usage: for \@Mention inside comments in YouTube Mobile that without hyperlinks for channelId.
     *  @type {Map<string, AsyncOrResolvedValue<string>>} */
    const handleToChannelId = new Map();

    /**
     * usage: in RSS fetching, no handle text will be obtained from the response. inject the handle into the response.
     * @type {Map<string, ChannelIdToHandleResult>} */
    const channelIdToHandle = new Map();


    /**
     * AsyncValue
     * @class
     * @template T
     */
    class AsyncValue {
        constructor() {
            /** @type {T | null} */
            this.__value__ = null;
            /** @type {((value: any)=>void) | null} */
            this.__resolve__ = null;
            this.__promise__ = new Promise(resolve => {
                this.__resolve__ = resolve;
            });
        }
        /**
         *
         * @param {T} value
         */
        setValue(value) {
            const promise = this.__promise__;
            if (promise === null) throw 'Value has already been set.';
            this.__value__ = value;
            this.__promise__ = null;
            this.__resolve__ ? this.__resolve__() : Promise.resolve().then(() => this.__resolve__());
        }
        /**
         *
         * @returns {Promise<T>}
         */
        async getValue() {
            const promise = this.__promise__;
            if (promise === null) return this.__value__;
            await promise; // promise become null
            this.__promise__ = null; // just in case
            this.__resolve__ = null;
            return this.__value__;
        }
    }

    /**
     *
     * @param {DisplayNameResultObject} resultInfo
     * @param {string} channelId
     */
    const cacheHandleToChannel = (resultInfo, channelId) => {

        const { vanityChannelUrl, ownerUrls } = resultInfo;

        let handleText = urlToHandle(vanityChannelUrl || '');

        if (handleText) {
            // match = true;
        } else if ((ownerUrls || 0).length >= 1) {
            for (const ownerUrl of ownerUrls) {
                handleText = urlToHandle(ownerUrl || '');

                if (handleText) {
                    //  match = true;
                    break;
                }
            }
        }
        if (handleText) {

            const asyncValue = handleToChannelId.get(handleText); // nothing if no pending promise
            if (asyncValue instanceof AsyncValue) {
                asyncValue.setValue(channelId);
            }
            handleToChannelId.set(handleText, channelId);
        }


    }

    /**
     *
     * @param {string} channelId
     * @param {Function} onDownloaded
     * @param {Function} onResulted
     * @param {Function} onError
     */
    const fetcherBrowseAPI = (channelId, onDownloaded, onResulted, onError) => {

        let signal = timeoutSignal(4000);

        fetch(new Request(`/youtubei/v1/browse?key=${cfg.INNERTUBE_API_KEY}&prettyPrint=false`, {
            "method": "POST",
            "mode": "same-origin",
            "credentials": "omit",

            referrerPolicy: "no-referrer",
            cache: "default", // no effect on POST request
            // cache: "force-cache",
            redirect: "error", // there shall be no redirection in this API request
            integrity: "",
            keepalive: false,
            signal,

            "headers": {
                "Content-Type": "application/json", // content type of the body data in POST request
                "Accept-Encoding": "gzip, deflate, br", // YouTube Response - br
                // X-Youtube-Bootstrap-Logged-In: false,
                // X-Youtube-Client-Name: 1, // INNERTUBE_CONTEXT_CLIENT_NAME
                // X-Youtube-Client-Version: "2.20230622.06.00" // INNERTUBE_CONTEXT_CLIENT_VERSION

                "Accept": "application/json",
            },
            "body": JSON.stringify({
                "context": {
                    "client": {
                        "visitorData": "Cgs0aVg0VjFWM0U0USi0jvOkBg%3D%3D", // [optional] fake visitorData to avoid dynamic visitorData generated in response
                        "clientName": "MWEB", // "WEB", "MWEB"
                        "clientVersion": `${cfg.INNERTUBE_CLIENT_VERSION || '2.20230614.01.00'}`, // same as WEB version
                        "originalUrl": `https://m.youtube.com/channel/${channelId}`,
                        "playerType": "UNIPLAYER",
                        "platform": "MOBILE", // "DESKTOP", "MOBILE", "TABLET"
                        "clientFormFactor": "SMALL_FORM_FACTOR", // "LARGE_FORM_FACTOR", "SMALL_FORM_FACTOR"
                        "acceptHeader": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "mainAppWebInfo": {
                            "graftUrl": `/channel/${channelId}`,
                            "webDisplayMode": "WEB_DISPLAY_MODE_BROWSER",
                            "isWebNativeShareAvailable": true
                        }
                    },
                    "user": {
                        "lockedSafetyMode": false
                    },
                    "request": {
                        "useSsl": true,
                        "internalExperimentFlags": [],
                        "consistencyTokenJars": []
                    }
                },
                "browseId": `${channelId}`
            })
        })).then(res => {
            signal && signal.clearTimeout && signal.clearTimeout();
            signal = null;
            onDownloaded();
            onDownloaded = null;
            return res.json();
        }).then(resJson => {
            let resultInfo = ((resJson || 0).metadata || 0).channelMetadataRenderer;
            onResulted(resultInfo);
            onResulted = null;
        }).catch(onError);

    };

    /**
     *
     * @param {string} channelId
     * @param {Function} onDownloaded
     * @param {Function} onResulted
     * @param {Function} onError
     */
    const fetcherRSS = location.origin !== 'https://www.youtube.com' ? null : (channelId, onDownloaded, onResulted, onError) => {

        let signal = timeoutSignal(4000);
        fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
            // YouTube RSS Response - public, max-age=900

            "method": "GET",
            "mode": "same-origin",
            "credentials": "omit",

            referrerPolicy: "no-referrer",
            cache: "default",
            // cache: "no-cache",
            redirect: "error", // there shall be no redirection in this API request
            integrity: "",
            keepalive: false,
            signal,

            "headers": {
                "Cache-Control": "public, max-age=900, stale-while-revalidate=1800",
                // refer "Cache-Control Use Case Examples" in https://www.koyeb.com/blog/using-cache-control-and-cdns-to-improve-performance-and-reduce-latency
                // seems YouTube RSS Feeds server insists its own Cache-Control.

                // "Content-Type": "text/xml; charset=UTF-8",
                "Accept-Encoding": "gzip, deflate, br", // YouTube Response - gzip
                // X-Youtube-Bootstrap-Logged-In: false,
                // X-Youtube-Client-Name: 1, // INNERTUBE_CONTEXT_CLIENT_NAME
                // X-Youtube-Client-Version: "2.20230622.06.00" // INNERTUBE_CONTEXT_CLIENT_VERSION

                "Accept": "text/xml",
            }
        }).then(res => {
            signal && signal.clearTimeout && signal.clearTimeout();
            signal = null;
            onDownloaded();
            onDownloaded = null;
            return res.text();
        }).then(resText => {
            let eIdx = resText.indexOf('<entry>');
            let mText = (eIdx > 0) ? `${resText.substring(0, eIdx).trim()}</feed>` : resText;

            // simple: https://www.youtube.com/feeds/videos.xml?channel_id=UC-MUu72gixoYlhV5_mWa36g
            // standard: https://www.youtube.com/feeds/videos.xml?channel_id=UCGSfK5HeiIhuFfXoKE47TzA
            // long: https://www.youtube.com/feeds/videos.xml?channel_id=UC8cSGjKxDuh2mWG1hDOTdBg
            // special: http://www.youtube.com/feeds/videos.xml?channel_id=UCmZ2-GUxmdWFKfXA5IN0x-w


            let name, uri, mt;

            // ===============================================================

            /* removed in 2023.06.30 */


            // ===============================================================


            const wIdx1 = mText.indexOf('<author>');
            const wIdx2 = wIdx1 > 0 ? mText.indexOf('</author>', wIdx1 + 8) : -1;

            if (wIdx1 > 0 && wIdx2 > 0) {
                let qText = mText.substring(wIdx1, wIdx2 + '</author>'.length);
                const template = document.createElement('template');
                template.innerHTML = qText;
                /** @type {HTMLElement | null} */
                let authorChild = ((template.content || 0).firstElementChild || 0).firstElementChild;
                for (; authorChild !== null; authorChild = authorChild.nextElementSibling) {
                    const nodeName = authorChild.nodeName;
                    if (nodeName === 'NAME') name = authorChild.textContent;
                    else if (nodeName === 'URI') {
                        uri = authorChild.textContent;
                        mt = obtainChannelId(uri);
                    }
                }
                template.innerHTML = '';
            }

            if (!name && !uri) {

                // fallback

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(mText, "text/xml");

                // const author = xmlDoc.querySelector("author");

                // https://extendsclass.com/xpath-tester.html

                const authorChilds = xmlDoc.evaluate("//*[name()='author']/*", xmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

                let authorChild;
                while ((authorChild = authorChilds.iterateNext()) !== null) {
                    if (authorChild.nodeName === 'name') name = authorChild.textContent;
                    else if (authorChild.nodeName === 'uri') {
                        uri = authorChild.textContent;
                        mt = obtainChannelId(uri)
                    }
                }

                try {
                    xmlDoc.firstChild.remove();
                } catch (e) { }

            }




            let res = null;

            if (name && uri && mt && mt === channelId) {


                let object = channelIdToHandle.get(mt);

                if (object) {

                    if (object.handleText === name) channelIdToHandle.delete(mt);
                    else {
                        object.justPossible = false; // ignore @handle checking

                        res = {
                            "title": name,
                            "externalId": mt,
                            "ownerUrls": [
                                `http://www.youtube.com/${object.handleText}`
                            ],
                            "channelUrl": uri,
                            "vanityChannelUrl": `http://www.youtube.com/${object.handleText}`
                        };

                    }
                }
            }

            onResulted(res);
            onResulted = null;

            // let resultInfo = ((res || 0).metadata || 0).channelMetadataRenderer;
            // onResulted(resultInfo);
        }).catch(onError);



    }

    /**
     *
     * @param {string} channelId
     */
    function stackNewRequest(channelId) {

        mutex.add(lockResolve => {

            let bResult = displayNameResStore.get(channelId);
            if (!(bResult instanceof AsyncValue)) {
                // resolved or removed
                lockResolve(); lockResolve = null;
                return;
            }

            let setResult = (result) => {
                setResult = null;
                if (!result) {
                    bResult.fetchingState = 0;
                    bResult.setValue(null);
                    displayNameResStore.delete(channelId); // create another network response in the next request
                } else {
                    bResult.fetchingState = 4;
                    bResult.setValue(result);
                    displayNameResStore.set(channelId, result); // update store result to resolved value
                }
                bResult = null;
            }

            if (bResult.fetchingState >= 2) { // fetchingState == 3 or 4
                // request is already done. no need to stack any request
                lockResolve(); lockResolve = null;
                return;
            }

            if (!document.querySelector(`[jkrgy="${channelId}"]`)) {
                // element has already been removed
                lockResolve(); lockResolve = null;
                setResult(null);
                return;
            }

            //INNERTUBE_API_KEY = ytcfg.data_.INNERTUBE_API_KEY

            bResult.fetchingState = 2;


            // note: when setResult(null), the fetch will be requested again if the same username appears. (multiple occurrences)
            // consider the network problem might be fixed in the 2nd attempt, the name will be changed in the 2nd attempt but ignore 1st attempt.
            const fetcher = USE_RSS_FETCHER && fetcherRSS && channelIdToHandle.has(channelId) ? fetcherRSS : fetcherBrowseAPI;
            fetcher(channelId, () => {
                bResult.fetchingState = 3;
                lockResolve();
                lockResolve = null;
            }, resultInfo => {

                if (!resultInfo) {
                    // invalid json format
                    setResult(null);
                    return;
                }

                cacheHandleToChannel(resultInfo, channelId);

                const { title, externalId, ownerUrls, channelUrl, vanityChannelUrl } = resultInfo;

                const displayNameRes = { title, externalId, ownerUrls, channelUrl, vanityChannelUrl, verified123: false };

                setResult(displayNameRes);
            }, e => {
                lockResolve && lockResolve();
                lockResolve = null;
                console.warn(e);
                setResult && setResult(null);
            });

        });

    }

    /**
     *
     * @param {string} url Example: _www\.youtube\.com/\@yr__kd_
     * @returns Example: _\@yr__kd_
     */
    function urlToHandle(url) {

        if (typeof url !== 'string') return '';
        let i = url.indexOf('.youtube.com/');
        if (i >= 1) url = url.substring(i + '.youtube.com/'.length);
        else if (url.charAt(0) === '/') url = url.substring(1);
        return isDisplayAsHandle(url) ? url : '';

    }

    /**
     *
     * @param {string} channelId Example: UC0gmRdmpDWJ4dt7DAeRaawA
     * @returns {Promise<DisplayNameResultObject | null>}
     */
    async function getDisplayName(channelId) {

        let cache = displayNameResStore.get(channelId);
        let isStackNewRequest = false;

        /** @type {AsyncValue<DisplayNameResultObject> | null | undefined} */
        let aResult;

        if (cache instanceof AsyncValue) {
            aResult = cache;
            if (aResult.fetchingState >= 2) {
                // aResult.fetchingState
                // 2: network fetch started
                // 3: network fetch ended
                // isStackNewRequest = false;
            } else {
                // 0: invalid before
                // 1: scheduled but not yet fetch
                isStackNewRequest = true;
            }
        } else if (cache) {
            // resolved result
            return cache;
        } else {
            // else no cached value found
            /** @type {AsyncValue<DisplayNameResultObject>} */
            aResult = new AsyncValue();
            displayNameResStore.set(channelId, aResult);
            isStackNewRequest = true;
        }

        if (isStackNewRequest) {
            aResult.fetchingState = 1;
            stackNewRequest(channelId);
        }
        return await aResult.getValue();
    }


    /**
     *
     * @param {string} href Example: https\:\/\/www\.youtube\.com/channel/UC0gmRdmpDWJ4dt7DAeRaawA
     * @returns
     */
    const obtainChannelId = (href) => {
        let m = /\/channel\/(UC[-_a-zA-Z0-9+=.]+)/.exec(`/${href}`);
        // let m = /\/channel\/([^/?#\s]+)/.exec(`/${href}`);
        return !m ? '' : (m[1] || '');
    };


    /**
     *
     * @param {Element} ytElm
     */
    const resetWhenDataChanged = (ytElm) => {
        if (ytElm instanceof Element) {
            const anchors = elementQSA(ytElm, 'a[id][href*="channel/"][jkrgy]');
            if ((anchors || 0).length >= 1 && ((ytElm.inst || ytElm).data || 0).jkrgx !== 1) {
                for (const anchor of anchors) {
                    anchor.removeAttribute('jkrgy');
                }
            }
        }
    }

    /**
     *
     * @param {Function} dataChanged original dataChanged function
     * @returns new dataChanged function
     */
    const dataChangeFuncProducer = (dataChanged) => {
        /** @this HTMLElement */
        return function () {
            resetWhenDataChanged(this);
            return dataChanged.apply(this, arguments);
        }
    };

    /**
     *
     * @param {HTMLAnchorElement} anchor Example: https\:\/\/www\.youtube\.com/channel/UCRmLncxsQFcOOC8OhzUIfxQ/videos
     * @param {string} channelHref Example: /channel/UCRmLncxsQFcOOC8OhzUIfxQ
     * @param {string} channelId Example: UCRmLncxsQFcOOC8OhzUIfxQ
     * @returns
     */
    const anchorIntegrityCheck = (anchor, channelHref, channelId) => {

        let currentHref = anchor.getAttribute('href');
        if (currentHref === channelHref) return true; // /channel/UCRmLncxsQFcOOC8OhzUIfxQ // /channel/UCRmLncxsQFcOOC8OhzUIfxQ

        return (currentHref + '/').indexOf(channelHref + '/') >= 0;

    };

    /**
     *
     * @param {string} currentDisplayed
     * @param {DisplayNameResultObject} fetchResult
     * @returns
     */
    const verifyAndConvertHandle = (currentDisplayed, fetchResult) => {

        const { title, externalId, ownerUrls, channelUrl, vanityChannelUrl, verified123 } = fetchResult;

        const currentDisplayTrimmed = currentDisplayed.trim();
        let match = false;
        if (verified123) {
            match = true;
        } else if ((vanityChannelUrl || '').endsWith(`/${currentDisplayTrimmed}`)) {
            match = true;
        } else if ((ownerUrls || 0).length >= 1) {
            for (const ownerUrl of ownerUrls) {
                if ((ownerUrl || '').endsWith(`/${currentDisplayTrimmed}`)) {
                    match = true;
                    break;
                }
            }
        }
        if (match) {
            return currentDisplayTrimmed;
        }
        return '';

    };

    /**
     *
     *
 
        ### [Handle naming guidelines](https://support.google.com/youtube/answer/11585688?hl=en&co=GENIE.Platform%3DAndroid)
 
        - Is between 3-30 characters
        - Is made up of alphanumeric characters (A–Z, a–z, 0–9)
        - Your handle can also include: underscores (_), hyphens (-), dots (.)
        - Is not URL-like or phone number-like
        - Is not already being used
        - Follows YouTube's Community Guidelines
 
        ### Handle automatically generated by YouTube
        - `@user-XXXX`
        - without dot (.)
     *
     * @param {string} text
     * @returns
     */
    const isDisplayAsHandle = (text) => {

        if (typeof text !== 'string') return false;
        if (text.length < 4) return false;
        if (text.indexOf('@') < 0) return false;
        return /^\s*@[-_a-zA-Z0-9.]{3,30}\s*$/.test(text);

    };

    /**
     *
     * @param {Object[]} contentTexts
     * @param {number} idx
     * @returns
     */
    const contentTextProcess = (contentTexts, idx) => {
        const contentText = contentTexts[idx];
        const text = (contentText || 0).text;
        const url = (((contentText.navigationEndpoint || 0).commandMetadata || 0).webCommandMetadata || 0).url;
        if (typeof url === 'string' && typeof text === 'string') {

            if (!isDisplayAsHandle(text)) return null;
            const channelId = obtainChannelId(url);

            return getDisplayName(channelId).then(fetchResult => {
                let resolveResult = null;
                if (fetchResult) {
                    // note: if that user shown is not found in `a[id]`, the hyperlink would not change

                    const textTrimmed = verifyAndConvertHandle(text, fetchResult);
                    if (textTrimmed) {
                        resolveResult = (md) => {
                            let runs = ((md || 0).contentText || 0).runs;
                            if (!runs || !runs[idx]) return;
                            if (runs[idx].text !== text) return;
                            runs[idx].text = text.replace(textTrimmed, `@${fetchResult.title}`); // HyperLink always @SomeOne
                            md.contentText = Object.assign({}, md.contentText);
                        };
                    }
                }
                return resolveResult; // function as a Promise
            });
        }

        return null;
    };

    /**
     *
     * @param {ParentNode} parentNode
     * @param {Function} callback
     */
    function findTextNodes(parentNode, callback) {
        /**
         *
         * @param {Node} node
         * @returns
         */
        function traverse(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let r = callback(node);
                if (r === true) return true;
            }

            let childNode = nodeFirstChild(node);
            while (childNode) {
                let r = traverse(childNode);
                if (r === true) return true;
                childNode = nodeNextSibling(childNode);
            }
        }

        traverse(parentNode);
    }

    /**
     *
     * @param {ParentNode} parentNode
     * @param {Object[]} contentTexts
     * @param {number} aidx
     * @returns
     */
    const mobileContentHandleAsync = async (parentNode, contentTexts, aidx) => {


        let commentText = elementQS(parentNode, '.comment-text');
        if (!commentText) return;
        commentText = elementQS(commentText, '.yt-core-attributed-string') || commentText;
        let currentText = commentText.textContent;
        let textMatch = commentText.textContent === contentTexts.map(e => e.text).join('');
        if (!textMatch) return;

        const contentText = contentTexts[aidx];

        /** @type {string} */
        const handleText = contentText.text.trim();
        /** @type {string | null | undefined} */
        let channelId;

        let cache = handleToChannelId.get(handleText);

        if (typeof cache === 'string') {
            channelId = cache;
        } else if (cache instanceof AsyncValue) {
            channelId = await cache.getValue();
        } else {
            /** @type {AsyncValue<string>} */
            const asyncValue = new AsyncValue();
            handleToChannelId.set(handleText, asyncValue);
            channelId = await asyncValue.getValue();  // note: it could be never resolved
        }

        if (!channelId) return; // just in case

        if (commentText.isConnected !== true) return; // already removed
        if (commentText.textContent !== currentText) return; // already changed

        const fetchResult = await getDisplayName(channelId);

        if (fetchResult === null) return;

        const { title, externalId } = fetchResult;
        if (externalId !== channelId) return; // channel id must be the same

        if (commentText.isConnected !== true) return; // already removed
        if (commentText.textContent !== currentText) return; // already changed

        let search = contentText.text;
        if (typeof search === 'string') {

            const searchTrimmed = search.trim();
            if (searchTrimmed === handleText) { // ensure integrity after getDisplayName
                contentText.text = search.replace(searchTrimmed, "@" + title);

                findTextNodes(commentText, (textnode) => {
                    if (textnode.nodeValue.indexOf(search) >= 0) {
                        textnode.nodeValue = textnode.nodeValue.replace(search, contentText.text);
                        return true;
                    }
                });
            }

        }

    }

    /**
     * Process Checking when there is new (unprocessed) anchor DOM element with hyperlink of channel
     * @type { (anchor: HTMLElement, channelHref: string?, mt: string?) => Promise<void> }
     */
    const domCheckAsync = isMobile ? async (anchor, channelHref, mt) => {

        try {
            if (!channelHref || !mt) return;
            let parentNode = nodeParent(anchor);
            while (parentNode instanceof Node) {
                if (parentNode.nodeName === 'YTM-COMMENT-RENDERER' || ('_commentData' in parentNode)) break;
                parentNode = nodeParent(parentNode);
            }
            if (parentNode instanceof Node) { } else return;

            let displayTextDOM = elementQS(parentNode, '.comment-header .comment-title');
            if (!displayTextDOM) return;
            displayTextDOM = elementQS(displayTextDOM, '.yt-core-attributed-string') || displayTextDOM;
            let airaLabel = anchor.getAttribute('aria-label')
            const parentNodeData = (parentNode.inst || parentNode).data;
            let runs = ((parentNodeData || 0).authorText || 0).runs;

            if (displayTextDOM && airaLabel && displayTextDOM.textContent.trim() === airaLabel.trim() && isDisplayAsHandle(airaLabel) && runs && (runs[0] || 0).text === airaLabel) {

                if (!channelIdToHandle.has(mt)) {
                    channelIdToHandle.set(mt, {
                        handleText: airaLabel.trim(),
                        justPossible: true
                    });
                }

                const fetchResult = await getDisplayName(mt);

                if (fetchResult === null) return;

                const { title, externalId } = fetchResult;

                if (externalId !== mt) return; // channel id must be the same

                // anchor href might be changed by external
                if (!anchorIntegrityCheck(anchor, channelHref, externalId)) return;

                if (displayTextDOM.isConnected !== true) return; // already removed

                let found = false;

                findTextNodes(displayTextDOM, (textnode) => {
                    if (textnode.nodeValue === airaLabel) {
                        textnode.nodeValue = title;
                        found = true;
                        return true;
                    }
                });

                if (!found) return;
                anchor.setAttribute('aria-label', title);
                runs[0].text = title;


                const contentTexts = (parentNodeData.contentText || 0).runs;
                if (contentTexts && contentTexts.length >= 2) {
                    for (let aidx = 0; aidx < contentTexts.length; aidx++) {
                        const contentText = contentTexts[aidx] || 0;
                        if (contentText.italics !== true) {
                            let isHandle = isDisplayAsHandle(contentText.text);
                            if (isHandle) {
                                mobileContentHandleAsync(parentNode, contentTexts, aidx);
                            }
                        }
                    }
                }

            }
        } catch (e) {
            console.warn(e);
        }

    } : async (anchor, channelHref, mt) => {

        try {
            if (!channelHref || !mt) return;
            let parentNode = nodeParent(anchor);
            while (parentNode instanceof Node) {
                const cnt = parentNode.inst || parentNode;
                if (typeof cnt.is === 'string' && typeof cnt.dataChanged === 'function') break;
                parentNode = nodeParent(parentNode);
            }
            if (parentNode instanceof Node) { } else return;
            const parentNodeController = parentNode.inst || parentNode;
            const authorText = (parentNodeController.data || 0).authorText;
            const currentDisplayed = (authorText || 0).simpleText;
            if (typeof currentDisplayed !== 'string') return;
            if (!isDisplayAsHandle(currentDisplayed)) return;

            if (!channelIdToHandle.has(mt)) {
                channelIdToHandle.set(mt, {
                    handleText: currentDisplayed.trim(),
                    justPossible: true
                });
            }

            const oldDataChanged = parentNodeController.dataChanged;
            if (typeof oldDataChanged === 'function' && !oldDataChanged.jkrgx) {
                let newDataChanged = dataChangedFuncStore.get(oldDataChanged);
                if (!newDataChanged) {
                    newDataChanged = dataChangeFuncProducer(oldDataChanged);
                    newDataChanged.jkrgx = 1;
                    dataChangedFuncStore.set(oldDataChanged, newDataChanged);
                }
                parentNodeController.dataChanged = newDataChanged;
            }

            const fetchResult = await getDisplayName(mt);

            if (fetchResult === null) return;

            const { title, externalId } = fetchResult;

            if (externalId !== mt) return; // channel id must be the same

            // anchor href might be changed by external
            if (!anchorIntegrityCheck(anchor, channelHref, externalId)) return;

            const parentNodeData = parentNodeController.data;
            const funcPromises = [];

            if (parentNodeController.isAttached === true && parentNode.isConnected === true && typeof parentNodeData === 'object' && parentNodeData && parentNodeData.authorText === authorText) {

                if (authorText.simpleText !== currentDisplayed) return;
                const currentDisplayTrimmed = verifyAndConvertHandle(currentDisplayed, fetchResult);
                const cSimpleText = ((parentNodeData.authorText || 0).simpleText || '');
                if (currentDisplayTrimmed && currentDisplayed !== title && cSimpleText === currentDisplayed) {

                    // the inside hyperlinks will be only converted if its parent author name is handle
                    const contentTexts = (parentNodeData.contentText || 0).runs;
                    if (contentTexts && contentTexts.length >= 1) {
                        for (let aidx = 0; aidx < contentTexts.length; aidx++) {
                            const r = contentTextProcess(contentTexts, aidx);
                            if (r instanceof Promise) funcPromises.push(r);
                        }
                    }

                    const md = Object.assign({}, parentNodeData);
                    let setBadge = false;
                    if (((((md.authorCommentBadge || 0).authorCommentBadgeRenderer || 0).authorText || 0).simpleText || '').trim() === cSimpleText.trim()) {
                        setBadge = true;
                    }
                    // parentNode.data = Object.assign({}, { jkrgx: 1 });
                    md.authorText = Object.assign({}, md.authorText, { simpleText: currentDisplayed.replace(currentDisplayTrimmed, title) });
                    if (setBadge) {
                        md.authorCommentBadge = Object.assign({}, md.authorCommentBadge);
                        md.authorCommentBadge.authorCommentBadgeRenderer = Object.assign({}, md.authorCommentBadge.authorCommentBadgeRenderer);
                        md.authorCommentBadge.authorCommentBadgeRenderer.authorText = Object.assign({}, md.authorCommentBadge.authorCommentBadgeRenderer.authorText, { simpleText: title });

                    }
                    if (funcPromises.length >= 1) {
                        let funcs = await Promise.all(funcPromises);

                        for (const func of funcs) {
                            if (typeof func === 'function') {
                                func(md);
                            }
                        }
                    }

                    if (parentNodeController.isAttached === true && parentNode.isConnected === true) {
                        parentNodeController.data = Object.assign({}, md, { jkrgx: 1 });
                    }


                }

            }
        } catch (e) {
            console.warn(e);
        }

    }

    /**
     *
     * @param {string} url
     * @returns
     */
    const channelUrlUnify = (url) => {

        if (typeof url !== 'string') return url; // type unchanged
        let c0 = url.charAt(0);
        if (c0 === '/') return url;
        let i = url.indexOf('.youtube.com/');
        if (i >= 1) url = url.substring(i + '.youtube.com/'.length - 1);
        else if (url.charAt(0) !== '/') url = '/' + url;
        return url

    }

    const parentYtElement = (node, nodeName, maxN) => {
        for (let pDom = nodeParent(node); (pDom instanceof HTMLElement) && maxN-- > 0; pDom = nodeParent(pDom)) {
            if (pDom.nodeName === nodeName) {
                return pDom;
            }
        }
        return null;
    }

    const checkShortsChannelName = (rchannelNameDOM) => {
        let browseId = '';
        const pDom = parentYtElement(rchannelNameDOM, 'YTD-REEL-PLAYER-HEADER-RENDERER', 18);

        if (pDom instanceof HTMLElement) {
            const pDomController = pDom.inst || pDom;
            const runs = (((pDomController.data || 0).channelTitleText || 0).runs || 0);
            if (runs.length === 1) {
                const browserEndpoint = (((runs[0] || 0).navigationEndpoint || 0).browseEndpoint || 0);
                browseId = (browserEndpoint.browseId || '');
                const currentDisplayText = runs[0].text || ''

                if (/^UC[-_a-zA-Z0-9+=.]+$/.test(browseId) && isDisplayAsHandle(currentDisplayText)) {

                    if (!channelIdToHandle.has(browseId)) {
                        channelIdToHandle.set(browseId, {
                            handleText: currentDisplayText.trim(),
                            justPossible: true
                        });
                    }


                    // let anchorNode = elementQS(rchannelNameDOM, `a[href="${browserEndpoint.canonicalBaseUrl}"]`);
                    // anchorNode && anchorNode.setAttribute('jkrgy', browseId); // for checking
                    // anchorNode &&
                    getDisplayName(browseId).then(fetchResult => {

                        if (fetchResult === null) return;

                        const { title, externalId } = fetchResult;
                        if (externalId !== browseId) return; // channel id must be the same

                        let hDom = pDom;
                        const hDomHostElement = hDom.hostElement || hDom;
                        const hDomController = hDom.inst || hDom;
                        let hData = (hDomController || 0).data || 0;
                        const runs = (((hData || 0).channelTitleText || 0).runs || 0);
                        if (runs && runs.length === 1 && (runs[0] || 0).text === currentDisplayText && hDomHostElement.isConnected === true) {

                            let runs2 = [Object.assign({}, runs[0], { text: title })];


                            /*
                            runs.push({text: title, bold: true, "fontColor": "black",
 
                        size: "SIZE_DEFAULT",
                        style: "STYLE_TEXT",
                                      });
                            */

                            hDomController.data = Object.assign({}, hDomController.data, { channelTitleText: { runs: runs2 }, rSk0e: 1 });

                            byPassCheckStore.delete(rchannelNameDOM);
                        }



                    })
                }


            }
        }
        return browseId
    }

    let firstDOMCheck = false;
    const firstDOMChecker = isMobile ? () => {

        const channelNameDOM = document.querySelector('ytm-slim-owner-renderer');
        const channelNameCData = !channelNameDOM ? null : (channelNameDOM.inst || channelNameDOM || 0).data;

        if (channelNameCData) {
            let mainChannelUrl = null;
            let mainFormattedNameUrl = null;
            let mainChannelText = null;
            let mainFormattedNameText = null;

            try {
                mainChannelUrl = channelUrlUnify(channelNameCData.channelUrl)
                mainFormattedNameUrl = channelUrlUnify(channelNameCData.title.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl)
                mainChannelText = channelNameCData.channelName
                mainFormattedNameText = channelNameCData.title.runs[0].text
            } catch (e) { }

            if (mainChannelUrl === mainFormattedNameUrl && mainChannelText === mainFormattedNameText && typeof mainChannelUrl === 'string' && typeof mainChannelText === 'string') {


                let channelId = obtainChannelId(mainChannelUrl);
                if (channelId) {
                    if (mainChannelText.startsWith('@')) return;
                    if (mainChannelText.trim() !== mainChannelText) return;

                    displayNameResStore.set(channelId, {
                        channelUrl: `https://www.youtube.com/channel/${channelId}`,
                        externalId: `${channelId}`,
                        ownerUrls: [],
                        title: mainChannelText,
                        vanityChannelUrl: null,
                        verified123: true
                    });
                }


            }
        }

    } : () => {

        const channelNameDOM = document.querySelector('ytd-channel-name.ytd-video-owner-renderer');
        const channelNameCnt = !channelNameDOM ? null : channelNameDOM.inst || channelNameDOM;
        const channelNameCData = (channelNameCnt || 0).__data || (channelNameDOM || 0).__data;
        if (channelNameCData) {
            let mainChannelUrl = null;
            let mainFormattedNameUrl = null;
            let mainChannelText = null;
            let mainFormattedNameText = null;

            try {
                mainChannelUrl = channelNameCData.channelName.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl
                mainFormattedNameUrl = channelNameCData.formattedName.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl
                mainChannelText = channelNameCData.channelName.runs[0].text
                mainFormattedNameText = channelNameCData.formattedName.runs[0].text
            } catch (e) { }

            if (mainChannelUrl === mainFormattedNameUrl && mainChannelText === mainFormattedNameText && typeof mainChannelUrl === 'string' && typeof mainChannelText === 'string') {

                let m = /^\/(@[-_a-zA-Z0-9.]{3,30})$/.test(mainChannelUrl);

                if (m && m[1] && mainChannelText !== m[1]) {

                    let channelId = obtainChannelId(mainChannelUrl);
                    if (channelId) {
                        if (mainChannelText.startsWith('@')) return;
                        if (mainChannelText.trim() !== mainChannelText) return;

                        displayNameResStore.set(channelId, {
                            channelUrl: `https://www.youtube.com/channel/${channelId}`,
                            externalId: `${channelId}`,
                            ownerUrls: [],
                            title: mainChannelText,
                            vanityChannelUrl: null,
                            verified123: true
                        });
                    }

                }
            }
        }

    };

    // let newAnchorAdded = false;
    /*
 
    const intersectionobserver = new IntersectionObserver((entries) => {
        let anchorAppear = false;
        for (const entry of entries) {
            if (entry.isIntersecting === true) {
                anchorAppear = true;
                break;
            }
        }
        if (anchorAppear && newAnchorAdded) {
            newAnchorAdded = false; // stacking will be only reset when one or more anchor added to DOM.
            mutex.nextIndex = 0; // higher pirority for new elements being shown
        }
    }, {
        rootMargin:"0px 0px 0px 0px",
        threshold:1
    })
    */


    /* globals WeakRef:false */

    /** @type {(o: Object | null) => WeakRef | null} */
    const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

    /** @type {(wr: Object | null) => Object | null} */
    const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

    let doShortsChecking = false;
    let doDescriptionChecking = true;

    let lastNewAnchorLastWR = null;

    const mutexForDOMMutations = new Mutex();

    const byPassCheckStore = new WeakSet();

    const mutObserverForShortsChannelName = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const target = mutation.target;
            if (!target) continue;
            const rchannelNameElm = parentYtElement(target, 'YTD-CHANNEL-NAME', 18);
            if (!rchannelNameElm) continue;
            const rchannelNameCnt = rchannelNameElm.inst || rchannelNameElm;
            if ((rchannelNameCnt.data || 0).rSk0e) continue;
            const channelId = rchannelNameElm.getAttribute('jkrgy');
            if (channelId) {
                if (byPassCheckStore.has(rchannelNameElm)) continue;
                const object = channelIdToHandle.get(channelId);
                if (object && object.handleText && !object.justPossible) {
                    const textDom = ((rchannelNameCnt.$ || 0).text || 0);
                    if (textDom) {
                        let t = textDom.textContent.trim()
                        if (t === object.handleText || t === '') {
                            rchannelNameElm.removeAttribute('jkrgy');
                            Promise.resolve().then(domChecker);
                        }
                    }
                }
            }
        }
    })

    let domCheckScheduledForShorts = false;
    const domCheckSelectorForShorts = [
        'ytd-channel-name.ytd-reel-player-header-renderer:not([jkrgy]) a.yt-simple-endpoint[href]'
    ].join(', ');
    const domCheckerForShorts = () => {

        if (domCheckScheduledForShorts) return;
        if (document.querySelector(domCheckSelectorForShorts) === null) {
            return;
        }
        domCheckScheduledForShorts = true;

        mutexForDOMMutations.lockWith(lockResolve => {


            // setTimeout(()=>{ // delay due to data update is after [is-active] switching


            domCheckScheduledForShorts = false;

            const nodes = document.querySelectorAll(domCheckSelectorForShorts);
            if (nodes.length === 0) {
                lockResolve();
                return;
            }

            for (const node of nodes) {

                const rchannelNameElm = parentYtElement(node, 'YTD-CHANNEL-NAME', 18);
                if (rchannelNameElm) {
                    mutObserverForShortsChannelName.observe(rchannelNameElm, {
                        childList: true,
                        subtree: true
                    });
                    let channelId = '';
                    byPassCheckStore.add(rchannelNameElm);
                    channelId = checkShortsChannelName(rchannelNameElm);
                    rchannelNameElm.setAttribute('jkrgy', channelId || '');
                }

            }

            lockResolve();

            // }, 80);


        })

    }

    const domCheckerForDescriptionAnchor = (s) => {

        findTextNodes(s, (textNode) => {
            const p = textNode.nodeValue;
            const index = p.indexOf('@');
            if (index < 0) return;
            const q = p.substring(index);
            const b = isDisplayAsHandle(q);
            if (b) {
                const href = s.getAttribute('href')

                const channelId = obtainChannelId(href);
                if (channelId) {
                    let h = q.trim();

                    if (!channelIdToHandle.has(channelId)) {
                        channelIdToHandle.set(channelId, {
                            handleText: h,
                            justPossible: true
                        });
                    }

                    s.setAttribute('jkrgy', channelId);

                    getDisplayName(channelId).then(fetchResult => {

                        if (fetchResult === null) return;

                        const { title, externalId } = fetchResult;
                        if (externalId !== channelId) return; // channel id must be the same

                        const anchorElement = s;
                        const anchorTextNode = textNode;

                        if (anchorElement.isConnected === true && anchorTextNode.isConnected === true && anchorElement.contains(anchorTextNode) && anchorTextNode.nodeValue === p && s.getAttribute('href') === href) {

                            anchorTextNode.nodeValue = `${p.substring(0, index)}${q.replace(h, title)}`;

                        }

                    });
                }
            }
            return true;
        });

    }
    const domCheckerForDescription = isMobile ? ()=>{
        // example https://m.youtube.com/watch?v=jKt4Ah47L7Q
        for (const s of document.querySelectorAll('span.yt-core-attributed-string a.yt-core-attributed-string__link.yt-core-attributed-string__link--display-type.yt-core-attributed-string__link--call-to-action-color[href*="channel/"]:not([dxcPj])')) {
            s.setAttribute('dxcPj', '');
            domCheckerForDescriptionAnchor(s);
        }
    } : () => {
        // example https://www.youtube.com/watch?v=jKt4Ah47L7Q
        for (const s of document.querySelectorAll('yt-attributed-string a.yt-core-attributed-string__link.yt-core-attributed-string__link--display-type.yt-core-attributed-string__link--call-to-action-color[href*="channel/"]:not([dxcPj])')) {
            s.setAttribute('dxcPj', '');
            domCheckerForDescriptionAnchor(s);
        }
    };

    let domCheckScheduled = false;
    const domCheckSelector = isMobile ? 'a[aria-label^="@"][href*="channel/"]:not([jkrgy])' : 'a[id][href*="channel/"]:not([jkrgy])';
    const domChecker = () => {

        doShortsChecking && domCheckerForShorts();
        doDescriptionChecking && domCheckerForDescription();

        if (domCheckScheduled) return;
        if (document.querySelector(domCheckSelector) === null) {
            return;
        }
        domCheckScheduled = true;

        mutexForDOMMutations.lockWith(lockResolve => {
            domCheckScheduled = false;

            const newAnchors = document.querySelectorAll(domCheckSelector);
            if (newAnchors.length === 0) {
                lockResolve();
                return;
            }

            const cNewAnchorFirst = newAnchors[0]; // non-null
            const cNewAnchorLast = newAnchors[newAnchors.length - 1]; // non-null
            /** @type {HTMLElement | null} */
            const lastNewAnchorLast = kRef(lastNewAnchorLastWR); // HTMLElement | null
            lastNewAnchorLastWR = mWeakRef(cNewAnchorLast);

            if (!firstDOMCheck) {
                firstDOMCheck = true;
                USE_CHANNEL_META && firstDOMChecker();
            }

            Promise.resolve()
                .then(() => {
                    if (lastNewAnchorLast && mutex.nextIndex >= 1) {
                        if ((lastNewAnchorLast.compareDocumentPosition(cNewAnchorFirst) & 2) === 2) {
                            mutex.nextIndex = 0;
                        }
                    }
                }).then(() => {

                    // newAnchorAdded = true;
                    for (const anchor of newAnchors) {
                        // author-text or name
                        // normal url: /channel/xxxxxxx
                        // Improve YouTube! - https://www.youtube.com/channel/xxxxxxx/videos
                        const href = anchor.getAttribute('href');
                        const channelId = obtainChannelId(href); // string, can be empty
                        anchor.setAttribute('jkrgy', channelId);
                        // intersectionobserver.unobserve(anchor);
                        // intersectionobserver.observe(anchor); // force first occurance
                        domCheckAsync(anchor, href, channelId);
                    }

                }).then(lockResolve).catch(e => {
                    lockResolve();
                    console.warn(e);
                });

        });


    };


    /** @type {MutationObserver | null} */
    let domObserver = null;

    /** @type {(callback: (event: Event)=>{})} */
    const onPageFetched = isMobile ? (callback) => {

        let state = 0;

        window.addEventListener('state-change', function (evt) {
            if (state === 1) return; // ignore intermediate events
            state = 1; // before value: 0 or 2;
            callback(evt);
        }, false);

        window.addEventListener('state-navigateend', function (evt) { // fallback
            let inSeq = state === 1;
            state = 2; // 2 when loaded
            if (!inSeq) callback(evt);
        }, false);

    } : (callback) => {

        let state = 0;

        document.addEventListener('yt-page-data-fetched', function (evt) {
            if (state === 1) return; // ignore intermediate events if any
            state = 1; // before value: 0 or 2;
            callback(evt);
        }, false);

        document.addEventListener('yt-navigate-finish', function (evt) { // fallback
            let inSeq = state === 1;
            state = 2; // 2 when loaded
            if (!inSeq) callback(evt);
        }, false);

    };

    /**
     *
     * @param {Node} app
     * @returns
     */
    function setupOnPageFetched(app) {

        firstDOMCheck = false;

        if (!cfg['INNERTUBE_API_KEY']) {
            console.warn("Userscript Error: INNERTUBE_API_KEY is not found.");
            return;
        }

        if (CHANGE_FOR_SHORTS_CHANNEL_NAME && location.pathname.startsWith('/shorts/')) {
            doShortsChecking = true;
        } else {
            doShortsChecking = false;
        }

        if (!domObserver) {
            domObserver = new MutationObserver(domChecker);
        } else {
            domObserver.takeRecords();
            domObserver.disconnect();
        }

        domObserver.observe(app, { childList: true, subtree: true });
        domChecker();

    }

    /**
     *
     * @param {Object|null} dest
     * @param {Object} ytcfg
     * @param {string[]} keys
     * @returns
     */
    function getYtConfig(dest, ytcfg, keys) {
        dest = dest || {};
        if (typeof ytcfg.get === 'function') { // mobile
            for (const key of keys) {
                dest[key] = ytcfg.get(key);
            }
        } else {
            const cfgData = ytcfg.data_ || ytcfg.__data || ytcfg._data || ytcfg.data || ytcfg; // dekstop - ytcfg.data_
            for (const key of keys) {
                dest[key] = cfgData[key];
            }
        }
        return dest;
    }

    /** @type { (evt: Object) => Element | null } */
    const getPageApp = isMobile
        ? ((evt) => (document.querySelector('ytm-app#app') || document.querySelector('ytm-app')))
        : ((evt) => ((evt || 0).target || document.querySelector('ytd-app')));

    onPageFetched(async (evt) => {
        const app = getPageApp(evt);
        console.assert(app);
        const ytcfg = ((window || 0).ytcfg || 0);
        getYtConfig(cfg, ytcfg, ['INNERTUBE_API_KEY', 'INNERTUBE_CLIENT_VERSION']);
        setupOnPageFetched(app);
    });

})({ fetch, JSON, Request, AbortController, setTimeout, clearTimeout });
