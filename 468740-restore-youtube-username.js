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
// @version             0.13.7
// @license             MIT License

// @author              CY Fung
// @match               https://www.youtube.com/*
// @match               https://m.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/general-icon.png
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

!window.TTP && (()=>{
    // credit to Benjamin Philipp
    // original source: https://greasyfork.org/en/scripts/433051-trusted-types-helper

// --------------------------------------------------- Trusted Types Helper ---------------------------------------------------

const overwrite_default = false; // If a default policy already exists, it might be best not to overwrite it, but to try and set a custom policy and use it to manually generate trusted types. Try at your own risk
const prefix = `TTP`;
var passThroughFunc = function(string, sink){
	return string; // Anything passing through this function will be returned without change
}
var TTPName = "passthrough";
var TTP_default, TTP = {createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc}; // We can use TTP.createHTML for all our assignments even if we don't need or even have Trusted Types; this should make fallbacks and polyfills easy
var needsTrustedHTML = false;
function doit(){
	try{
		if(typeof window.isSecureContext !== 'undefined' && window.isSecureContext){
			if (window.trustedTypes && window.trustedTypes.createPolicy){
				needsTrustedHTML = true;
				if(trustedTypes.defaultPolicy){
					log("TT Default Policy exists");
					if(overwrite_default)
						TTP = window.trustedTypes.createPolicy("default", TTP);
					else
						TTP = window.trustedTypes.createPolicy(TTPName, TTP); // Is the default policy permissive enough? If it already exists, best not to overwrite it
					TTP_default = trustedTypes.defaultPolicy;

					log("Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '" + TTPName + "' in var 'TTP':", TTP);
				}
				else{
					TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);
				}
				log("Trusted-Type Policies: TTP:", TTP, "TTP_default:", TTP_default);
			}
		}
	}catch(e){
		log(e);
	}
}

function log(...args){
	if("undefined" != typeof(prefix) && !!prefix)
		args = [prefix + ":", ...args];
	if("undefined" != typeof(debugging) && !!debugging)
		args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
	console.log(...args);
}

doit();

// --------------------------------------------------- Trusted Types Helper ---------------------------------------------------

window.TTP = TTP;

})();

const NUM_CHANNEL_ID_MIN_LEN_old1 = 4; // 4 = @abc
const NUM_CHANNEL_ID_MIN_LEN_1 = 2; // 4 = @abc -> 2 = @a
const NUM_CHANNEL_ID_MIN_LEN_2 = 3; // 5 = /@abc -> 3 = /@a 


function createHTML(s) {
    if (typeof TTP !== 'undefined' && typeof TTP.createHTML === 'function') return TTP.createHTML(s);
    return s;
}

let trustHTMLErr = null;
try {
    document.createElement('div').innerHTML = createHTML('1');
} catch (e) {
    trustHTMLErr = e;
}

if (trustHTMLErr) {
    console.log(`trustHTMLErr`, trustHTMLErr);
    trustHTMLErr(); // exit userscript
}


// -----------------------------------------------------------------------------------------------------------------------------

/* jshint esversion:8 */

/**
    @typedef {string} HandleText
    * \@[-_a-zA-Z0-9.]{3,30} (before May 2024)
    * See isDisplayAsHandle
*/

/**
    @typedef {string} ChannelId
    * UC[-_a-zA-Z0-9+=.]{22}
    * https://support.google.com/youtube/answer/6070344?hl=en
    * The channel ID is the 24 character alphanumeric string that starts with 'UC' in the channel URL.
*/

/**
    @typedef {string} DisplayName
    * Display Name
*/

/**
    @typedef DisplayNameResultObject
    @type {Object}
    @property {DisplayName} title
    @property {DisplayName} langTitle
    @property {ChannelId?} externalId
    @property {string[]} ownerUrls
    @property {string} channelUrl
    @property {string} vanityChannelUrl
    @property {boolean|undefined} verified123
*/

/**
    @typedef ChannelIdToHandleResult
    @type {Object}
    @property {HandleText} handleText
    @property {boolean} justPossible
*/

(function (__CONTEXT__) {
    'use strict';

    // const JUST_REMOVE_AT_FOR_EXPANDED_LANG = true;

    const USE_RSS_FETCHER = true; // might 404
    const USE_TIMEOUT_SIGNAL = false;
    const USE_CHANNEL_META = true;
    const CHANGE_FOR_SHORTS_CHANNEL_NAME = false;
    const USE_LANG_SPECIFIC_NAME = true;
    const UPDATE_PIN_NAME = true; // for USE_LANG_SPECIFIC_NAME
    const FIX_RTL_ISSUE = true;

    const IGNORE_NO_NAME = false;

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

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

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

    if (!isMobile && typeof AbortSignal !== 'undefined') {
        document.addEventListener('yt-action', () => {
            try {
                yt.config_.EXPERIMENT_FLAGS.enable_profile_cards_on_comments = true;
            } catch (e) { }
        }, { capture: true, passive: true, once: true })
    }


    const delayPn = delay => new Promise((fn => setTimeout(fn, delay)));

    const { retrieveCE } = isMobile ? (() => {

        const retrieveCE = () => {
            console.warn('retrieveCE is not supported');
        }
        return { retrieveCE };

    })() : (() => {

        const isCustomElementsProvided = typeof customElements !== "undefined" && typeof (customElements || 0).whenDefined === "function";

        const promiseForCustomYtElementsReady = isCustomElementsProvided ? Promise.resolve(0) : new Promise((callback) => {
            const EVENT_KEY_ON_REGISTRY_READY = "ytI-ce-registry-created";
            if (typeof customElements === 'undefined') {
                if (!('__CE_registry' in document)) {
                    // https://github.com/webcomponents/polyfills/
                    Object.defineProperty(document, '__CE_registry', {
                        get() {
                            // return undefined
                        },
                        set(nv) {
                            if (typeof nv == 'object') {
                                delete this.__CE_registry;
                                this.__CE_registry = nv;
                                this.dispatchEvent(new CustomEvent(EVENT_KEY_ON_REGISTRY_READY));
                            }
                            return true;
                        },
                        enumerable: false,
                        configurable: true
                    })
                }
                let eventHandler = (evt) => {
                    document.removeEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
                    const f = callback;
                    callback = null;
                    eventHandler = null;
                    f();
                };
                document.addEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
            } else {
                callback();
            }
        });

        const retrieveCE = async (nodeName) => {
            try {
                isCustomElementsProvided || (await promiseForCustomYtElementsReady);
                await customElements.whenDefined(nodeName);
                const dummy = document.querySelector(nodeName) || document.createElement(nodeName);
                const cProto = insp(dummy).constructor.prototype;
                return cProto;
            } catch (e) {
                console.warn(e);
            }
        }

        return { retrieveCE };

    })();

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

    const createPipeline = () => {
        let pipelineMutex = Promise.resolve();
        const pipelineExecution = fn => {
            return new Promise((resolve, reject) => {
                pipelineMutex = pipelineMutex.then(async () => {
                    let res;
                    try {
                        res = await fn();
                    } catch (e) {
                        console.log('error_F1', e);
                        reject(e);
                    }
                    resolve(res);
                }).catch(console.warn);
            });
        };
        return pipelineExecution;
    };

    /**
     * @typedef { AsyncValue<T> | T} AsyncOrResolvedValue<T>
     * @template T */

    /**
     * usage: cache the network result per web application instance.
     *  @type {Map<ChannelId, AsyncOrResolvedValue<DisplayNameResultObject>>} */
    const displayNameResStore = new Map();

    /**
     * usage: mapping the .dataChanged() to the wrapped function - only few entries as most are {ytd-comment-renderer}.dataChanged().
     *  @type {WeakMap<Function, Function>} */
    const dataChangedFuncStore = new WeakMap();

    /**
     * usage: for \@Mention inside comments in YouTube Mobile that without hyperlinks for channelId.
     *  @type {Map<HandleText, AsyncOrResolvedValue<ChannelId>>} */
    const handleToChannelId = new Map();

    /**
     * usage: in RSS fetching, no handle text will be obtained from the response. inject the handle into the response.
     * @type {Map<ChannelId, ChannelIdToHandleResult>} */
    const channelIdToHandle = new Map();

    /**
     * usage: replace handle to lang-specific display name
     * @type {Map<HandleText, DisplayName>} */
    const langPreferredDisplayNameMap = new Map();

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

    let isCSSAdded = false;
    const addCSSRulesIfRequired = () => {
        if (isCSSAdded) return;
        isCSSAdded = true;
        const style = document.createElement('style')
        let nonce = document.querySelector('head style[nonce]');
        nonce = nonce ? nonce.getAttribute('nonce') : null;

        /* #contenteditable-root.yt-formatted-string:lang(he) */ /* Hebrew (LTR, when mixed with LTR languages) */
        /* #contenteditable-root.yt-formatted-string:lang(he) */ /* Hebrew (pure) */

        const cssText01_FIX_RTL_ISSUE = FIX_RTL_ISSUE ? `

            /* Left-to-Right (LTR) Languages */
            #contenteditable-root.yt-formatted-string:lang(en) /* English */,
            #contenteditable-root.yt-formatted-string:lang(es) /* Spanish */,
            #contenteditable-root.yt-formatted-string:lang(fr) /* French */,
            #contenteditable-root.yt-formatted-string:lang(de) /* German */,
            #contenteditable-root.yt-formatted-string:lang(it) /* Italian */,
            #contenteditable-root.yt-formatted-string:lang(pt) /* Portuguese */,
            #contenteditable-root.yt-formatted-string:lang(ru) /* Russian */,
            #contenteditable-root.yt-formatted-string:lang(zh) /* Chinese */,
            #contenteditable-root.yt-formatted-string:lang(ja) /* Japanese */,
            #contenteditable-root.yt-formatted-string:lang(ko) /* Korean */,
            #contenteditable-root.yt-formatted-string:lang(nl) /* Dutch */,
            #contenteditable-root.yt-formatted-string:lang(sv) /* Swedish */,
            #contenteditable-root.yt-formatted-string:lang(fi) /* Finnish */,
            #contenteditable-root.yt-formatted-string:lang(da) /* Danish */,
            #contenteditable-root.yt-formatted-string:lang(no) /* Norwegian */,
            #contenteditable-root.yt-formatted-string:lang(pl) /* Polish */,
            #contenteditable-root.yt-formatted-string:lang(cs) /* Czech */,
            #contenteditable-root.yt-formatted-string:lang(sk) /* Slovak */,
            #contenteditable-root.yt-formatted-string:lang(hu) /* Hungarian */,
            #contenteditable-root.yt-formatted-string:lang(tr) /* Turkish */,
            #contenteditable-root.yt-formatted-string:lang(el) /* Greek */,
            #contenteditable-root.yt-formatted-string:lang(id) /* Indonesian */,
            #contenteditable-root.yt-formatted-string:lang(ms) /* Malay */,
            #contenteditable-root.yt-formatted-string:lang(th) /* Thai */,
            #contenteditable-root.yt-formatted-string:lang(vi) /* Vietnamese */
            {
                direction: ltr;
            }

            /* Right-to-Left (RTL) Languages */
            #contenteditable-root.yt-formatted-string:lang(ar) /* Arabic */,
            #contenteditable-root.yt-formatted-string:lang(fa) /* Persian */,
            #contenteditable-root.yt-formatted-string:lang(ur) /* Urdu */,
            #contenteditable-root.yt-formatted-string:lang(dv) /* Divehi */
            {
                direction: rtl;
            }

        ` : '';
        style.textContent = `
            ${cssText01_FIX_RTL_ISSUE}
        `.trim();
        if (nonce) style.setAttribute('nonce', nonce);
        document.head.appendChild(style);
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

        const requestBody = {
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
        };

        if (USE_LANG_SPECIFIC_NAME && cfg.HL && cfg.GL) {
            Object.assign(requestBody.context.client, {
                "hl": cfg.HL,
                "gl": cfg.GL,
            });
        }

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
            "body": JSON.stringify(requestBody)
        })).then(res => {
            signal && signal.clearTimeout && signal.clearTimeout();
            signal = null;
            onDownloaded();
            onDownloaded = null;
            return res.json();
        }).then(resJson => {
            const resultInfo = ((resJson || 0).metadata || 0).channelMetadataRenderer;
            const title = resultInfo ? resultInfo.title : null;
            if (title || title === '') {

                resultInfo.title = '';
                resultInfo.langTitle = title;

                if (cfg.ownerProfileUrl && cfg.ownerChannelName && cfg.ownerChannelName !== title) {
                    let matched = false;

                    const ownerProfileUrlLowerCase = cfg.ownerProfileUrl.toLowerCase();
                    if (ownerProfileUrlLowerCase.endsWith(`/channel/${channelId.toLowerCase()}`)) matched = true;
                    else {

                        for (const ownerUrl of resultInfo.ownerUrls) {
                            if (ownerUrl.toLowerCase().endsWith(ownerProfileUrlLowerCase)) {
                                matched = true;
                                break;
                            }
                        }

                    }

                    if (matched) {
                        resultInfo.title = cfg.ownerChannelName;
                    }
                }

            }

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
    let fetchRSSFailed = false;
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

            if (res.ok === true && res.redirected === false && res.status === 200 && res.type === "basic") {

                onDownloaded();
                onDownloaded = null;
                return res.text();

            }
            return null;

        }).then(resText => {
            if (resText && typeof resText === 'string' && resText.includes('<feed') && !resText.includes('<!DOCTYPE')) {

            } else {
                if (onDownloaded) {

                    onDownloaded();
                    onDownloaded = null;
                }
                onResulted(-1);
                return;

            }


            // console.log(124,  , resText)
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
                template.innerHTML = createHTML(qText);
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
                template.innerHTML = createHTML('');
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
                        mt = obtainChannelId(uri);
                    }
                }

                try {
                    xmlDoc.firstChild.remove();
                } catch (e) { }

            }




            let res = null;

            if ((name || name === '') && uri && mt && mt === channelId) {


                const handleObj = channelIdToHandle.get(mt);

                if (handleObj) {

                    const handleText = handleObj.handleText;

                    if (handleText === name) channelIdToHandle.delete(mt);
                    else {
                        handleObj.justPossible = false; // ignore @handle checking

                        res = {
                            "title": name,
                            "externalId": mt,
                            "ownerUrls": [
                                `http://www.youtube.com/${handleText}`
                            ],
                            "channelUrl": uri,
                            "vanityChannelUrl": `http://www.youtube.com/${handleText}`
                        };

                        if (USE_LANG_SPECIFIC_NAME) {
                            const langPreferredDisplayName = langPreferredDisplayNameMap.get(handleText);
                            if (langPreferredDisplayName && name !== langPreferredDisplayName) res.langTitle = langPreferredDisplayName;
                        }

                    }
                }
            }

            onResulted(res);
            onResulted = null;

            // let resultInfo = ((res || 0).metadata || 0).channelMetadataRenderer;
            // onResulted(resultInfo);
        }).catch(onError);



    }

    sessionStorage.setItem('js-yt-usernames', '');
    let isFirstStackNewRequestSuccess = true;
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


            const retry = () => {

                fetchRSSFailed = true;

                bResult.fetchingState = 2;

                // Promise.resolve(channelId).then(stackNewRequest);
                fetcherBrowseAPI(channelId, mobj.fetchOnDownload, mobj.fetchOnSuccess, mobj.fetchOnFail);
            }

            const mobj = {
                fetchOnDownload: () => {
                    bResult.fetchingState = 3;
                },
                fetchOnSuccess: resultInfo => {

                    if (resultInfo === -1) {
                        retry();
                        return;
                    }

                    lockResolve && lockResolve();
                    lockResolve = null;
                    // console.log(900)

                    if (!resultInfo) {
                        // invalid json format
                        setResult(null);
                        return;
                    }

                    const titleForDisplay = resultInfo.langTitle || resultInfo.title;
                    const handleObj = channelIdToHandle.get(channelId);
                    const handleId = handleObj ? handleObj.handleText : '';
                    if (IGNORE_NO_NAME && !titleForDisplay) {
                        if (handleId) {
                            resultInfo.langTitle = resultInfo.title = handleObj.handleText;
                        } else {
                            setResult(null);
                            return;
                        }
                    }

                    cacheHandleToChannel(resultInfo, channelId);

                    const { title, langTitle, externalId, ownerUrls, channelUrl, vanityChannelUrl } = resultInfo;

                    const displayNameRes = { title, langTitle, externalId, ownerUrls, channelUrl, vanityChannelUrl, verified123: false };

                    if (handleId) {
                        if (isFirstStackNewRequestSuccess) {
                            isFirstStackNewRequestSuccess = false;
                            sessionStorage.setItem('js-yt-usernames', `${handleId}\t${titleForDisplay}`);
                        } else {
                            let current = sessionStorage.getItem('js-yt-usernames') || '';
                            if (current.length > 900000) {
                                const na = current.split('\n');
                                const n3 = Math.floor(na.length / 3);
                                if (n3 > 2) {
                                    const newText = na.slice(0, n3).concat(na.slice(na.length - n3)).join('\n');
                                    if (newText.length < 720000) {
                                        current = newText;
                                    }
                                }
                            }
                            sessionStorage.setItem('js-yt-usernames', `${current}\n${handleId}\t${titleForDisplay}`);
                        }
                    }

                    setResult(displayNameRes);
                },
                fetchOnFail: e => {


                    console.warn(e);
                    if (mobj.fetcher === fetcherRSS) {
                        retry();

                    } else {

                        lockResolve && lockResolve();
                        lockResolve = null;
                        // console.warn(e);
                        setResult && setResult(null);
                    }
                }
            }


            // note: when setResult(null), the fetch will be requested again if the same username appears. (multiple occurrences)
            // consider the network problem might be fixed in the 2nd attempt, the name will be changed in the 2nd attempt but ignore 1st attempt.
            mobj.fetcher = USE_RSS_FETCHER && fetcherRSS && !fetchRSSFailed && channelIdToHandle.has(channelId) ? fetcherRSS : fetcherBrowseAPI;
            mobj.fetcher(channelId, mobj.fetchOnDownload, mobj.fetchOnSuccess, mobj.fetchOnFail);

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
        const result = await aResult.getValue();
        return result;
    }


    /**
     *
     * @param {string} href Example: https\:\/\/www\.youtube\.com/channel/UC0gmRdmpDWJ4dt7DAeRaawA
     * @returns
     * * Outdated?
     */
    const obtainChannelId = (href) => {
        const s = `/${href}`;
        if (s.length >= 33) {
            const m = /\/channel\/(UC[-_a-zA-Z0-9+=.]{22})(\/|$)/.exec(s);
            return !m ? '' : (m[1] || '');
        }
        return '';
    };

    const isUCBrowserId = (browseId) => {
        return typeof browseId === 'string' && browseId.length === 24 && browseId.startsWith('UC') && /^UC[-_a-zA-Z0-9+=.]{22}$/.test(browseId);
    }

    const browseEndpointBaseUrlType = (browseEndpoint, displayText) => {
        if (isDisplayAsHandle(displayText) && isUCBrowserId(browseEndpoint.browseId) && typeof browseEndpoint.canonicalBaseUrl === 'string') {
            if (`/${displayText}` === browseEndpoint.canonicalBaseUrl) return 1 | 2;
            if (`/channel/${browseEndpoint.browseId}` === browseEndpoint.canonicalBaseUrl) return 1 | 4;
            if (browseEndpoint.canonicalBaseUrl.includes(`/${browseEndpoint.browseId}`)) return 1 | 8;
            return 1;
        }
        return 0;
    }

    /**
     *
     * @param {Element} ytElm
     */
    const resetWhenDataChanged = (ths) => {
        const cnt = insp(ths);
        const ytElm = cnt.hostElement instanceof Element ? cnt.hostElement : cnt instanceof Element ? cnt : ths;
        if (ytElm instanceof Element) {
            const anchors = elementQSA(ytElm, 'a[id][href][jkrgy]');
            // const anchors = elementQSA(ytElm, 'a[id][href*="channel/"][jkrgy]');
            if ((anchors || 0).length >= 1 && (insp(ytElm).data || 0).jkrgx !== 1) {
                for (const anchor of anchors) {
                    anchor.removeAttribute('jkrgy');
                }
            }
        }
    }

    /**
     *
     * @param {Element} ytElm
     */
    const resetWhenPropChanged = (ths) => {
        const cnt = insp(ths);
        const ytElm = cnt.hostElement instanceof Element ? cnt.hostElement : cnt instanceof Element ? cnt : ths;
        if (ytElm instanceof Element) {
            const anchors = elementQSA(ytElm, 'a[id][href][jkrgy]');
            // const anchors = elementQSA(ytElm, 'a[id][href*="channel/"][jkrgy]');
            if ((anchors || 0).length >= 1 && ((insp(ytElm).commentEntity || 0).author || 0).jkrgx !== 1) {
                for (const anchor of anchors) {
                    anchor.removeAttribute('jkrgy');
                }
            }
        }
    }

    /**
     *
     * @param {HTMLAnchorElement} anchor Example: https\:\/\/www\.youtube\.com/channel/UCRmLncxsQFcOOC8OhzUIfxQ/videos
     * @param {string} hrefAttribute Example: /channel/UCRmLncxsQFcOOC8OhzUIfxQ (old)   2024 Feb -> /@user-abc1234
     * @param {string} channelId Example: UCRmLncxsQFcOOC8OhzUIfxQ
     * @returns
     */
    const anchorIntegrityCheck = (anchor, hrefAttribute) => {

        let currentHref = anchor.getAttribute('href');
        if (currentHref === hrefAttribute) return true; // /channel/UCRmLncxsQFcOOC8OhzUIfxQ // /channel/UCRmLncxsQFcOOC8OhzUIfxQ

        return (currentHref + '/').indexOf(hrefAttribute + '/') >= 0;

    };

    /**
     *
     * @param {string} currentDisplayed
     * @param {DisplayNameResultObject} fetchResult
     * @returns
     */
    const verifyAndConvertHandle = (currentDisplayed, fetchResult) => {

        const { title, langTitle, externalId, ownerUrls, channelUrl, vanityChannelUrl, verified123 } = fetchResult;

        const currentDisplayTrimmed = currentDisplayed.trim(); // @IORIMATSUNAGA
        const currentDisplayTrimmedLowerCase = currentDisplayTrimmed.toLowerCase(); // @iorimatsunaga
        let match = false;
        if (verified123) {
            match = true;
        } else if ((vanityChannelUrl || '').toLowerCase().endsWith(`/${currentDisplayTrimmedLowerCase}`)) {
            match = true;
        } else if ((ownerUrls || 0).length >= 1) {
            for (const ownerUrl of ownerUrls) {
                if ((ownerUrl || '').toLowerCase().endsWith(`/${currentDisplayTrimmed}`)) {
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


        ## Intl. Language Support
        #### Since May~June 2024

        - Before: Is made up of alphanumeric characters (A–Z, a–z, 0–9)

        - After: Uses alphabet letters or numbers from one of our 75 supported languages
            - Your handle can also include: underscores (_), hyphens (-), periods (.), Latin middle dots (·).
            - Mixed scripts are only allowed in certain circumstances.
            - Left-to-right scripts cannot be mixed with right-to-left scripts in a single handle except when numbers are added to the end of the handle.




     *
     * @param {string} text
     * @returns
     */
    const isDisplayAsHandle = (text) => {
        if (typeof text !== 'string') return false;
        const n = text.length;
        if (n <= NUM_CHANNEL_ID_MIN_LEN_old1) {
            if (n < NUM_CHANNEL_ID_MIN_LEN_1) return false; // @
            // @巡空 -> <1, 2>
            // @abc -> <4, 0>
            const textFullL = text.replace(/[\u20-\uFF]+/g, '').length;
            const textHalfL = n - textFullL;
            if (textHalfL < 1) return false;
            if (textFullL === 0 && textHalfL < 4) return false;
        }
        if (text.indexOf('@') < 0) return false;
        return exactHandleText(text.trim(), true);
    };

    const isValidMinSlashHandle = (text) => {
        return text && typeof text === 'string' && text.length >= NUM_CHANNEL_ID_MIN_LEN_2 && text.startsWith('/@');
    }


    const languageMapR0 = [];

    const languageMap = [
        { range: [0x0041, 0x005A], langs: ['English', 'Afrikaans', 'Albanian', 'Bosnian', 'Catalan', 'Croatian', 'Czech', 'Danish', 'Dutch', 'Estonian', 'Filipino', 'Finnish', 'French', 'Galician', 'German', 'Hungarian', 'Icelandic', 'Indonesian', 'Italian', 'Latvian', 'Lithuanian', 'Macedonian', 'Malay', 'Norwegian', 'Polish', 'Portuguese', 'Romanian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Swahili', 'Turkish', 'Zulu'] },  // Basic Latin (A-Z)
        { range: [0x0061, 0x007A], langs: ['English', 'Afrikaans', 'Albanian', 'Bosnian', 'Catalan', 'Croatian', 'Czech', 'Danish', 'Dutch', 'Estonian', 'Filipino', 'Finnish', 'French', 'Galician', 'German', 'Hungarian', 'Icelandic', 'Indonesian', 'Italian', 'Latvian', 'Lithuanian', 'Macedonian', 'Malay', 'Norwegian', 'Polish', 'Portuguese', 'Romanian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Swahili', 'Turkish', 'Zulu'] },  // Basic Latin (a-z)
        { range: [0x00C0, 0x00FF], langs: ['French', 'Portuguese', 'Spanish', 'Afrikaans'] },  // Latin-1 Supplement
        { range: [0x0100, 0x017F], langs: ['Latvian', 'Lithuanian', 'Polish', 'Czech', 'Slovak', 'Slovenian', 'Croatian', 'Bosnian', 'Serbian', 'Montenegrin'] },  // Latin Extended-A
        { range: [0x0180, 0x024F], langs: ['African languages', 'Esperanto'] },  // Latin Extended-B
        { range: [0x0370, 0x03FF], langs: ['Greek'] },  // Greek and Coptic
        { range: [0x0400, 0x04FF], langs: ['Russian', 'Ukrainian', 'Bulgarian', 'Serbian', 'Macedonian', 'Belarusian', 'Kazakh', 'Kyrgyz', 'Uzbek'] },  // Cyrillic
        { range: [0x0500, 0x052F], langs: ['Kazakh', 'Kyrgyz', 'Uzbek'] },  // Cyrillic Supplement
        { range: [0x0530, 0x058F], langs: ['Armenian'] },  // Armenian
        { range: [0x0590, 0x05FF], langs: ['Hebrew'] },  // Hebrew
        { range: [0x0600, 0x06FF], langs: ['Arabic', 'Persian', 'Urdu'] },  // Arabic
        { range: [0x0700, 0x074F], langs: ['Syriac'] },  // Syriac
        { range: [0x0750, 0x077F], langs: ['Arabic Supplement'] },  // Arabic Supplement
        { range: [0x0780, 0x07BF], langs: ['Thaana'] },  // Thaana
        { range: [0x0900, 0x097F], langs: ['Hindi', 'Marathi', 'Sanskrit', 'Nepali'] },  // Devanagari
        { range: [0x0980, 0x09FF], langs: ['Bengali', 'Assamese'] },  // Bengali
        { range: [0x0A00, 0x0A7F], langs: ['Punjabi'] },  // Gurmukhi
        { range: [0x0A80, 0x0AFF], langs: ['Gujarati'] },  // Gujarati
        { range: [0x0B00, 0x0B7F], langs: ['Odia'] },  // Oriya
        { range: [0x0B80, 0x0BFF], langs: ['Tamil'] },  // Tamil
        { range: [0x0C00, 0x0C7F], langs: ['Telugu'] },  // Telugu
        { range: [0x0C80, 0x0CFF], langs: ['Kannada'] },  // Kannada
        { range: [0x0D00, 0x0D7F], langs: ['Malayalam'] },  // Malayalam
        { range: [0x0D80, 0x0DFF], langs: ['Sinhala'] },  // Sinhala
        { range: [0x0E00, 0x0E7F], langs: ['Thai'] },  // Thai
        { range: [0x0E80, 0x0EFF], langs: ['Lao'] },  // Lao
        { range: [0x0F00, 0x0FFF], langs: ['Tibetan'] },  // Tibetan
        { range: [0x1000, 0x109F], langs: ['Burmese'] },  // Myanmar
        { range: [0x10A0, 0x10FF], langs: ['Georgian'] },  // Georgian
        { range: [0x1100, 0x11FF], langs: ['Korean'] },  // Hangul Jamo
        { range: [0x1200, 0x137F], langs: ['Amharic', 'Tigrinya', 'Geez'] },  // Ethiopic
        { range: [0x13A0, 0x13FF], langs: ['Cherokee'] },  // Cherokee
        { range: [0x1400, 0x167F], langs: ['Canadian Aboriginal'] },  // Unified Canadian Aboriginal Syllabics
        { range: [0x1680, 0x169F], langs: ['Ogham'] },  // Ogham
        { range: [0x16A0, 0x16FF], langs: ['Runic'] },  // Runic
        { range: [0x1700, 0x171F], langs: ['Tagalog'] },  // Tagalog
        { range: [0x1720, 0x173F], langs: ['Hanunoo'] },  // Hanunoo
        { range: [0x1740, 0x175F], langs: ['Buhid'] },  // Buhid
        { range: [0x1760, 0x177F], langs: ['Tagbanwa'] },  // Tagbanwa
        { range: [0x1780, 0x17FF], langs: ['Khmer'] },  // Khmer
        { range: [0x1800, 0x18AF], langs: ['Mongolian'] },  // Mongolian
        { range: [0x1E00, 0x1EFF], langs: ['Latin Extended Additional'] },  // Latin Extended Additional
        { range: [0x1F00, 0x1FFF], langs: ['Greek Extended'] },  // Greek Extended
        { range: [0x2000, 0x206F], langs: ['General Punctuation'] },  // General Punctuation
        { range: [0x2070, 0x209F], langs: ['Superscripts and Subscripts'] },  // Superscripts and Subscripts
        { range: [0x20A0, 0x20CF], langs: ['Currency Symbols'] },  // Currency Symbols
        { range: [0x2100, 0x214F], langs: ['Letterlike Symbols'] },  // Letterlike Symbols
        { range: [0x2150, 0x218F], langs: ['Number Forms'] },  // Number Forms
        { range: [0x2190, 0x21FF], langs: ['Arrows'] },  // Arrows
        { range: [0x2200, 0x22FF], langs: ['Mathematical Operators'] },  // Mathematical Operators
        { range: [0x2300, 0x23FF], langs: ['Miscellaneous Technical'] },  // Miscellaneous Technical
        { range: [0x2400, 0x243F], langs: ['Control Pictures'] },  // Control Pictures
        { range: [0x2440, 0x245F], langs: ['Optical Character Recognition'] },  // Optical Character Recognition
        { range: [0x2460, 0x24FF], langs: ['Enclosed Alphanumerics'] },  // Enclosed Alphanumerics
        { range: [0x2500, 0x257F], langs: ['Box Drawing'] },  // Box Drawing
        { range: [0x2580, 0x259F], langs: ['Block Elements'] },  // Block Elements
        { range: [0x25A0, 0x25FF], langs: ['Geometric Shapes'] },  // Geometric Shapes
        { range: [0x2600, 0x26FF], langs: ['Miscellaneous Symbols'] },  // Miscellaneous Symbols
        { range: [0x2700, 0x27BF], langs: ['Dingbats'] },  // Dingbats

        { range: [0x3000, 0x303F], langs: ['Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese', 'Korean'] },

        // { range: [0x3000, 0x303F], langs: ['CJK Symbols and Punctuation'] },  // CJK Symbols and Punctuation
        { range: [0x3040, 0x309F], langs: ['Japanese'] },  // Hiragana
        { range: [0x30A0, 0x30FF], langs: ['Japanese'] },  // Katakana
        { range: [0x3100, 0x312F], langs: ['Bopomofo'] },  // Bopomofo
        { range: [0x3130, 0x318F], langs: ['Korean'] },  // Hangul Compatibility Jamo
        { range: [0x3190, 0x319F], langs: ['Kanbun'] },  // Kanbun
        { range: [0x31A0, 0x31BF], langs: ['Bopomofo Extended'] },  // Bopomofo Extended
        { range: [0x31F0, 0x31FF], langs: ['Katakana Phonetic Extensions'] },  // Katakana Phonetic Extensions
        { range: [0x3200, 0x32FF], langs: ['Enclosed CJK Letters and Months'] },  // Enclosed CJK Letters and Months
        { range: [0x3300, 0x33FF], langs: ['CJK Compatibility'] },  // CJK Compatibility
        { range: [0x4E00, 0x9FFF], langs: ['Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese', 'Korean'] },  // CJK Unified Ideographs
        { range: [0xAC00, 0xD7AF], langs: ['Korean'] },  // Hangul Syllables
        { range: [0xD800, 0xDBFF], langs: ['High Surrogates'] },  // High Surrogates
        { range: [0xDC00, 0xDFFF], langs: ['Low Surrogates'] },  // Low Surrogates
        { range: [0xF900, 0xFAFF], langs: ['CJK Compatibility Ideographs'] },  // CJK Compatibility Ideographs
        { range: [0xFB00, 0xFB4F], langs: ['Alphabetic Presentation Forms'] },  // Alphabetic Presentation Forms
        { range: [0xFB50, 0xFDFF], langs: ['Arabic Presentation Forms-A'] },  // Arabic Presentation Forms-A
        { range: [0xFE20, 0xFE2F], langs: ['Combining Half Marks'] },  // Combining Half Marks
        { range: [0xFE70, 0xFEFF], langs: ['Arabic Presentation Forms-B'] },  // Arabic Presentation Forms-B
        { range: [0xFF00, 0xFFEF], langs: ['Halfwidth and Fullwidth Forms'] },  // Halfwidth and Fullwidth Forms
        { range: [0xFFF0, 0xFFFF], langs: ['Specials'] },  // Specials
        { range: [0x10000, 0x1007F], langs: ['Linear B Syllabary'] },  // Linear B Syllabary
        { range: [0x10080, 0x100FF], langs: ['Linear B Ideograms'] },  // Linear B Ideograms
        { range: [0x10100, 0x1013F], langs: ['Aegean Numbers'] },  // Aegean Numbers
        { range: [0x10140, 0x1018F], langs: ['Ancient Greek Numbers'] },  // Ancient Greek Numbers
        { range: [0x10190, 0x101CF], langs: ['Ancient Symbols'] },  // Ancient Symbols
        { range: [0x101D0, 0x101FF], langs: ['Phaistos Disc'] },  // Phaistos Disc
        { range: [0x10280, 0x1029F], langs: ['Lycian'] },  // Lycian
        { range: [0x102A0, 0x102DF], langs: ['Carian'] },  // Carian
        { range: [0x10300, 0x1032F], langs: ['Old Italic'] },  // Old Italic
        { range: [0x10330, 0x1034F], langs: ['Gothic'] },  // Gothic
        { range: [0x10380, 0x1039F], langs: ['Ugaritic'] },  // Ugaritic
        { range: [0x103A0, 0x103DF], langs: ['Old Persian'] },  // Old Persian
        { range: [0x10400, 0x1044F], langs: ['Deseret'] },  // Deseret
        { range: [0x10450, 0x1047F], langs: ['Shavian'] },  // Shavian
        { range: [0x10480, 0x104AF], langs: ['Osmanya'] },  // Osmanya
        { range: [0x10800, 0x1083F], langs: ['Cypriot Syllabary'] },  // Cypriot Syllabary
        { range: [0x10840, 0x1085F], langs: ['Imperial Aramaic'] },  // Imperial Aramaic
        { range: [0x10900, 0x1091F], langs: ['Phoenician'] },  // Phoenician
        { range: [0x10920, 0x1093F], langs: ['Lydian'] },  // Lydian
        { range: [0x10A00, 0x10A5F], langs: ['Kharoshthi'] },  // Kharoshthi
        { range: [0x10A60, 0x10A7F], langs: ['Old South Arabian'] },  // Old South Arabian
        { range: [0x10B00, 0x10B3F], langs: ['Avestan'] },  // Avestan
        { range: [0x10B40, 0x10B5F], langs: ['Inscriptional Parthian'] },  // Inscriptional Parthian
        { range: [0x10B60, 0x10B7F], langs: ['Inscriptional Pahlavi'] },  // Inscriptional Pahlavi
        { range: [0x10C00, 0x10C4F], langs: ['Old Turkic'] },  // Old Turkic
        { range: [0x10E60, 0x10E7F], langs: ['Rumi Numeral Symbols'] },  // Rumi Numeral Symbols
        { range: [0x11000, 0x1107F], langs: ['Brahmi'] },  // Brahmi
        { range: [0x11080, 0x110CF], langs: ['Kaithi'] },  // Kaithi
        { range: [0x12000, 0x123FF], langs: ['Cuneiform'] },  // Cuneiform
        { range: [0x13000, 0x1342F], langs: ['Egyptian Hieroglyphs'] },  // Egyptian Hieroglyphs
        { range: [0x16800, 0x16A3F], langs: ['Bamum'] },  // Bamum
        { range: [0x1B000, 0x1B0FF], langs: ['Kana Supplement'] },  // Kana Supplement
        { range: [0x1D000, 0x1D0FF], langs: ['Byzantine Musical Symbols'] },  // Byzantine Musical Symbols
        { range: [0x1D100, 0x1D1FF], langs: ['Musical Symbols'] },  // Musical Symbols
        { range: [0x1D200, 0x1D24F], langs: ['Ancient Greek Musical Notation'] },  // Ancient Greek Musical Notation
        { range: [0x1D300, 0x1D35F], langs: ['Tai Xuan Jing Symbols'] },  // Tai Xuan Jing Symbols
        { range: [0x1D360, 0x1D37F], langs: ['Counting Rod Numerals'] },  // Counting Rod Numerals
        { range: [0x1D400, 0x1D7FF], langs: ['Mathematical Alphanumeric Symbols'] },  // Mathematical Alphanumeric Symbols
        { range: [0x1F000, 0x1F02F], langs: ['Mahjong Tiles'] },  // Mahjong Tiles
        { range: [0x1F030, 0x1F09F], langs: ['Domino Tiles'] },  // Domino Tiles
        { range: [0x1F0A0, 0x1F0FF], langs: ['Playing Cards'] },  // Playing Cards
        { range: [0x1F100, 0x1F1FF], langs: ['Enclosed Alphanumeric Supplement'] },  // Enclosed Alphanumeric Supplement
        { range: [0x1F200, 0x1F2FF], langs: ['Enclosed Ideographic Supplement'] },  // Enclosed Ideographic Supplement
        { range: [0x1F300, 0x1F5FF], langs: ['Miscellaneous Symbols and Pictographs'] },  // Miscellaneous Symbols and Pictographs
        { range: [0x1F600, 0x1F64F], langs: ['Emoticons'] },  // Emoticons
        { range: [0x1F680, 0x1F6FF], langs: ['Transport and Map Symbols'] },  // Transport and Map Symbols
        { range: [0x1F700, 0x1F77F], langs: ['Alchemical Symbols'] },  // Alchemical Symbols
        { range: [0x20000, 0x2A6DF], langs: ['CJK Unified Ideographs Extension B'] },  // CJK Unified Ideographs Extension B
        { range: [0x2A700, 0x2B73F], langs: ['CJK Unified Ideographs Extension C'] },  // CJK Unified Ideographs Extension C
        { range: [0x2B740, 0x2B81F], langs: ['CJK Unified Ideographs Extension D'] },  // CJK Unified Ideographs Extension D
        { range: [0x2F800, 0x2FA1F], langs: ['CJK Compatibility Ideographs Supplement'] },  // CJK Compatibility Ideographs Supplement
    ];



    let lastLangEntry = null;

    function getPossibleLanguages(unicodeChar) {
        const unicode = typeof unicodeChar === 'number' ? unicodeChar : typeof unicodeChar === 'string' ? unicodeChar.codePointAt(0) : 0;

        if (unicode >= 0x20) {
            if (unicode >= 0x0370 && lastLangEntry && unicode >= lastLangEntry.range[0] && unicode <= lastLangEntry.range[1]) {
                return lastLangEntry.langs;
            }
            for (const entry of languageMap) {
                if (unicode >= entry.range[0] && unicode <= entry.range[1]) {
                    if (entry.range[0] >= 0x0370) lastLangEntry = entry;
                    return entry.langs;
                }
                if (entry.range[0] >= unicode && entry.range[1] >= unicode) break;
            }
        }

        return languageMapR0;
    }

    const handleTextAllowSymbolsNChars = new Set('_-.·0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(e => e.codePointAt()));
    const blacklistChars = new Set('@;:"\'!$#%^&*()[]<>,?/\\+{}|~`!'.split('').map(e => e.codePointAt()));

    const _cache_isExactHandleText = new Map();
    const isExactHandleText = (text, i = 0) => {
        let cpCount = 0, cp = 0;
        let cpMin = Number.MAX_VALUE
        let cpMax = Number.MIN_VALUE
        const suffixNumber = /\d+$/.exec(text);
        const suffixNumberLen = `${suffixNumber || ''}`.length;
        const textLen = text.length;
        if (textLen - i > 30) return false;
        let l = textLen - suffixNumberLen;
        let maxCpCount = 30 - suffixNumberLen;
        if (maxCpCount <= 0) return maxCpCount === 0;
        const mtext = text.substring(i);
        let res = _cache_isExactHandleText.get(mtext);
        if (typeof res !== 'undefined') return res;

        const retFn = (res) => {
            _cache_isExactHandleText.set(mtext, res);
            return res;
        }

        let uchars = [];
        const uRanges = new Set();
        for (; i < l; i++) {
            cp = text.codePointAt(i);
            if (!cp) break;
            if (!handleTextAllowSymbolsNChars.has(cp)) {
                // @[LANG]-c2w (found in Dec 2024)
                if (blacklistChars.has(cp)) return retFn(false);
                const uRange = getPossibleLanguages(cp);
                uRanges.add(uRange);
                uchars.push(cp);
                if (cpMin > cp) cpMin = cp;
                if (cpMax < cp) cpMax = cp;
            }
            if (cp < 0x7FFFFFFF) {
                while (cp > 0xFFFF) {
                    cp = cp >> 16;
                    i++;
                }
            } else {
                console.warn('cp >= 0x7FFFFFFF')
                return retFn(false);
            }
            cpCount++;
            if (cpCount > 30) {
                return retFn(false);
            }
        }

        // console.log(mtext, cpMin,cpMax, uRanges)
        if (!uRanges.size || (cpMin >= 32 && cpMax <= 122)) {
            return retFn(/^[-_a-zA-Z0-9.·]{3,30}$/.test(mtext));
        }

        let mm = {}, mi = 0;
        for (const uRange of uRanges) {
            if (uRange) {
                for (const lang of uRange) {
                    if (lang) {
                        mm[lang] = (mm[lang] || 0) + 1;
                    }
                }
            }
            mi++;
        }
        let unilang = "";
        let dd = Object.entries(mm).filter(a => a[1] === mi);
        if (dd.length === 1) {
            unilang = dd[0];
        } else if (dd.length === 3 && dd[0][0] === 'Arabic' && dd[1][0] === 'Persian' && dd[2][0] === 'Urdu') {
            return retFn("Arabic");
        }else if (dd.length === 4 && dd[0][0] === 'Chinese (Simplified)' && dd[1][0] === 'Chinese (Traditional)' && dd[2][0] === 'Japanese' && dd[3][0] === 'Korean') {
            return retFn("CJK");
        }



        if (unilang[0] === "Japanese") {
            return retFn("Japanese"); // japanese handle can mix with kanji
        }


        if (cpMin >= 0x1000) {
            const ft = String.fromCodePoint(...uchars);
            if (cpMin >= 0x4E00 && cpMax <= 0xD7AF) {
                if (/^[\u4E00-\u9FFF\uAC00-\uD7AF]{1,10}$/.test(ft)) return retFn("Han|Hangul");
            } else if (cpMin >= 0x1200 && cpMax <= 0x30FF) {
                if (/^[\u1200-\u137F\u3040-\u30FF]{2,20}$/.test(ft)) return retFn("Ethiopic|Hiragana|Katakana");
            }
        }

        return retFn(false);

    }

    const exactHandleText = (text, b) => {
        return text.startsWith('@') && isExactHandleText(text, 1) ? (b ? true : text.substring(1)) : (b ? false : '');
    }

    const exactHandleUrl_ = (text, b, c) => {
        if (c === 2) {
            if (isValidMinSlashHandle(text)) {
                text = urlHandleConversion(text) || text;
            } else {
                return b ? false : '';
            }
        } else if (c === 1 && (text.length < NUM_CHANNEL_ID_MIN_LEN_2 || text.length > 32)) { // 2+30
            return false;
        }
        return text.startsWith('/@') && isExactHandleText(text, 2) ? (b ? true : text.substring(2)) : (b ? false : '');
    }

    const _cache_urlHandleConversion = new Map();
    const urlHandleConversion = (text) => {

        let converted = _cache_urlHandleConversion.get(text);

        if (typeof converted === 'string') {

            text = converted;

        } else if (text.includes('%')) {
            let text0 = text;

            let text2 = text.substring(2);
            if (/%[0-9A-Fa-f]{2}/.test(text2) && /^[-_a-zA-Z%0-9.·]+$/.test(text2)) {
                try {
                    text2 = decodeURI(text2);
                } catch (e) { }
                text = `/@${text2}`
            }
            _cache_urlHandleConversion.set(text0, text);

        }


        if (exactHandleUrl_(text, true, 1)) {
            return text;
        } 

    }
    const exactHandleUrl = (text, b) => {
        return exactHandleUrl_(text, b, 2);
    }

    try {
        // https://www.youtube.com/watch?v=hfopp1vLFmk
        // https://www.youtube.com/watch?v=V-4PiHDX2Mg
        let b = true


        b = b && isDisplayAsHandle('@7r0n215 ');
        b = b && isDisplayAsHandle('@user-ox5by7bw1m ');
        b = b && isDisplayAsHandle('@Samsungfan2016 ');
        b = b && isDisplayAsHandle('@김태래 ');
        b = b && !isDisplayAsHandle('@%EA%B9%80%ED%83%9C%EB%9E%98 ');

        b = b && !exactHandleText('@7r0n215 ', true);
        b = b && !exactHandleText('@user-ox5by7bw1m ', true);
        b = b && !exactHandleText('@Samsungfan2016 ', true);
        b = b && !exactHandleText('@김태래 ', true);
        b = b && !exactHandleText('@%EA%B9%80%ED%83%9C%EB%9E%98 ', true);


        b = b && !exactHandleUrl('/@7r0n215 ', true);
        b = b && !exactHandleUrl('/@user-ox5by7bw1m ', true);
        b = b && !exactHandleUrl('/@Samsungfan2016 ', true);
        b = b && !exactHandleUrl('/@김태래 ', true);
        b = b && !exactHandleUrl('/@%EA%B9%80%ED%83%9C%EB%9E%98 ', true);


        b = b && isDisplayAsHandle(' @7r0n215');
        b = b && isDisplayAsHandle(' @user-ox5by7bw1m');
        b = b && isDisplayAsHandle(' @Samsungfan2016');
        b = b && isDisplayAsHandle(' @김태래');
        b = b && !isDisplayAsHandle(' @%EA%B9%80%ED%83%9C%EB%9E%98');

        b = b && !exactHandleText(' @7r0n215', true);
        b = b && !exactHandleText(' @user-ox5by7bw1m', true);
        b = b && !exactHandleText(' @Samsungfan2016', true);
        b = b && !exactHandleText(' @김태래', true);
        b = b && !exactHandleText(' @%EA%B9%80%ED%83%9C%EB%9E%98', true);

        b = b && !exactHandleUrl(' /@7r0n215', true);
        b = b && !exactHandleUrl(' /@user-ox5by7bw1m', true);
        b = b && !exactHandleUrl(' /@Samsungfan2016', true);
        b = b && !exactHandleUrl(' /@김태래', true);
        b = b && !exactHandleUrl(' /@%EA%B9%80%ED%83%9C%EB%9E%98', true);


        b = b && isDisplayAsHandle('@7r0n215');
        b = b && isDisplayAsHandle('@user-ox5by7bw1m');
        b = b && isDisplayAsHandle('@Samsungfan2016');
        b = b && isDisplayAsHandle('@김태래');
        b = b && !isDisplayAsHandle('@%EA%B9%80%ED%83%9C%EB%9E%98');

        b = b && exactHandleText('@7r0n215', true);
        b = b && exactHandleText('@user-ox5by7bw1m', true);
        b = b && exactHandleText('@Samsungfan2016', true);
        b = b && exactHandleText('@김태래', true);
        b = b && !exactHandleText('@%EA%B9%80%ED%83%9C%EB%9E%98', true);


        b = b && exactHandleUrl('/@7r0n215', true);
        b = b && exactHandleUrl('/@user-ox5by7bw1m', true);
        b = b && exactHandleUrl('/@Samsungfan2016', true);
        b = b && exactHandleUrl('/@김태래', true);
        b = b && exactHandleUrl('/@%EA%B9%80%ED%83%9C%EB%9E%98', true);

        b = b && isDisplayAsHandle('@Lions_joyfulpenda');
        b = b && isDisplayAsHandle('@kowlsl12');
        b = b && isDisplayAsHandle('@hyezzozzo_baseball_curtaincall');
        b = b && isDisplayAsHandle('@blue-pink-love');


        b = b && isDisplayAsHandle('@mr.memebear901');
        b = b && isDisplayAsHandle('@すいちゃん可愛い');
        b = b && exactHandleUrl('/@%E3%81%99%E3%81%84%E3%81%A1%E3%82%83%E3%82%93%E5%8F%AF%E6%84%9B%E3%81%84');
        b = b && isDisplayAsHandle('@ハシビロ公');
        b = b && exactHandleUrl('/@%E3%83%8F%E3%82%B7%E3%83%93%E3%83%AD%E5%85%AC');
        b = b && isDisplayAsHandle('@ex1524')
        b = b && isDisplayAsHandle('@K88571')
        b = b && isDisplayAsHandle('@مجلةالرابالعربي')
        b = b && !isDisplayAsHandle('@@مجلةالرابالعربي')

        b = b && isDisplayAsHandle('@ともとも-e7d8b')
        b = b && isDisplayAsHandle('@佐藤漣-x7i')
        b = b && isDisplayAsHandle('@巡空')
        b = b && isDisplayAsHandle('@abc')
        b = b && isDisplayAsHandle('@巡')
        b = b && !isDisplayAsHandle('@xy')
        b = b && !isDisplayAsHandle('@z')
        
        b = b && isDisplayAsHandle('@茶々-l9y')


        if (!b) console.error('!!!! wrong coding !!!!');
    } catch (e) {
        console.error('!!!! wrong coding !!!!', e);
    }
    /**
     *
     * @param {Object[]} contentTexts
     * @param {number} idx
     * @returns
     */
    const contentTextProcess = (_md, contentTexts, idx) => {
        const md = _md;
        const contentText = contentTexts[idx];
        const text = (contentText || 0).text;
        const browseId = ((contentText.navigationEndpoint || 0).browseEndpoint || 0).browseId || '';
        const canonicalBaseUrl = ((contentText.navigationEndpoint || 0).browseEndpoint || 0).canonicalBaseUrl || ''; // TBC
        const url = (((contentText.navigationEndpoint || 0).commandMetadata || 0).webCommandMetadata || 0).url; // TBC
        if (typeof url === 'string' && typeof text === 'string' && typeof browseId === 'string' && browseId && isUCBrowserId(browseId)) {

            if (!isDisplayAsHandle(text)) return null;
            const channelId = browseId;

            return getDisplayName(channelId).then(fetchResult => {
                let resolveResult = null;
                if (fetchResult) {
                    // note: if that user shown is not found in `a[id]`, the hyperlink would not change

                    const textTrimmed = verifyAndConvertHandle(text, fetchResult);
                    if (textTrimmed) {
                        resolveResult = (() => {
                            let runs = ((md || 0).contentText || 0).runs;
                            if (!runs || !runs[idx]) return;
                            if (runs[idx].text !== text) return;
                            runs[idx].text = text.replace(textTrimmed, `@${fetchResult.title}`); // HyperLink always @SomeOne
                            md.contentText = Object.assign({}, md.contentText);
                        })();
                    }
                }
                return resolveResult; // function as a Promise
            });
        }

        return null;
    };

    const dynamicEditableTextByControllerResolve = isMobile ? 0 : (() => {
        /**
         *
         *
            f.showReplyDialog = function(a) {
                if (a) {
                    var b = this.replyBox;
                    b || (b = document.createElement("ytd-comment-reply-dialog-renderer"),
                    b.id = "replybox",
                    qF(this.replyDialogDiv).appendChild(b));
                    b.data = a;
                    this.replyDialogDiv.hidden = !1;
                    b.openDialog()
                }
            }

            // a = <ytd-comment-engagement-bar>...</ytd-comment-engagement-bar>
            // b = "showReplyDialog"
            // c = undefined
            function Lpb(a, b, c) {
                var d = a.polymerController;
                a[b] = function() {
                    var e = va.apply(0, arguments);
                    a.loggingStatus.currentExternalCall = b;
                    a.loggingStatus.bypassProxyController = !0;
                    var g, k = ((g = a.is) != null ? g : a.tagName).toLowerCase();
                    ZE(k, b, "PROPERTY_ACCESS_CALL_EXTERNAL");
                    var m;
                    g = (m = c != null ? c : d[b]) == null ? void 0 : m.call.apply(m, [d].concat(ha(e)));
                    a.loggingStatus.currentExternalCall = void 0;
                    a.loggingStatus.bypassProxyController = !1;
                    return g
                }
            }

            // a = {..., commandMetadata, createCommentReplyDialogEndpoint}
            // b = {commandController: {onSuccess: ƒ, onServerError: ƒ} ,  forceClickLogging : true, form: {element, event}  }
            kQb.prototype.resolveCommand = function(a, b) {
                var c, d, e, g, k, m, p, q;
                return t(function(r) {
                    e = (c = G(a, n6a)) == null ? void 0 : (d = c.dialog) == null ? void 0 : d.commentReplyDialogRenderer;
                    if (!e)
                        throw new Em("No dialog in createCommentReplyDialogEndpoint");
                    k = (g = b.form) == null ? void 0 : g.event;
                    if (!k)
                        throw new Em("Event not passed in when resolving command");
                    m = h(k.composedPath());
                    for (p = m.next(); !p.done; p = m.next())
                        if (q = p.value,
                        q.tagName === "YTD-COMMENT-ACTION-BUTTONS-RENDERER" || q.tagName === "YTD-COMMENT-ENGAGEMENT-BAR")
                            return q.showReplyDialog(e),
                            r.return();
                    ma(r)
                })
            }


        *
        */


        const setupForCommentReplyDialogRenderer = (cProto) => {
            if (cProto && typeof cProto.showReplyDialog === 'function' && cProto.showReplyDialog.length === 1 && !cProto.showReplyDialog392) {
                cProto.showReplyDialog392 = cProto.showReplyDialog;
                cProto.showReplyDialog = function (a) {
                    let goDefault = true;
                    try {
                        if (a && a.editableText) {
                            const arr = [];
                            fixCommentReplyDialogRenderer(a, arr);
                            const pAll = Promise.all(arr).catch(e => console.warn);
                            Promise.race([pAll, delayPn(300)]).then(() => { // network request should be already done before
                                this.showReplyDialog392(a);
                            });
                            goDefault = false;
                        }
                    } catch (e) { }
                    if (goDefault) {
                        return this.showReplyDialog392(a);
                    }
                };
            }
        };

        retrieveCE('ytd-comment-action-buttons-renderer').then(cProto => {
            setupForCommentReplyDialogRenderer(cProto);
        });
        retrieveCE('ytd-comment-engagement-bar').then(cProto => {
            setupForCommentReplyDialogRenderer(cProto);
        });

        return 1;

    })();

    const editableTextProcess = (_commentReplyDialogRenderer, editableTexts, idx) => {
        const commentReplyDialogRenderer = _commentReplyDialogRenderer;
        const editableText = editableTexts[idx];
        const text = (editableText || 0).text;

        const browseId = ((editableText.navigationEndpoint || 0).browseEndpoint || 0).browseId || '';
        const canonicalBaseUrl = ((editableText.navigationEndpoint || 0).browseEndpoint || 0).canonicalBaseUrl || ''; // TBC
        const url = (((editableText.navigationEndpoint || 0).commandMetadata || 0).webCommandMetadata || 0).url; // TBC
        if (typeof url === 'string' && typeof text === 'string' && typeof browseId === 'string' && browseId && isUCBrowserId(browseId)) {

            if (!isDisplayAsHandle(text)) return null;
            const channelId = browseId;

            return getDisplayName(channelId).then(fetchResult => {
                let resolveResult = null;
                if (fetchResult) {
                    // note: if that user shown is not found in `a[id]`, the hyperlink would not change

                    const textTrimmed = verifyAndConvertHandle(text, fetchResult);
                    if (textTrimmed) {
                        resolveResult = (() => {
                            if (!commentReplyDialogRenderer) return;
                            const editableText = commentReplyDialogRenderer.editableText || 0;
                            let runs = (editableText || 0).runs;
                            if (!runs || !runs[idx]) return;
                            if (runs[idx].text !== text) return;
                            runs[idx].text = text.replace(textTrimmed, `@${fetchResult.title}`); // HyperLink always @SomeOne
                            commentReplyDialogRenderer.editableText = Object.assign({}, commentReplyDialogRenderer.editableText);
                        })();
                    }
                }
                return resolveResult; // function as a Promise
            });
        }

        return null;
    };
    const contentTextProcessViewModel = async (content, idx) => {
        const { commandRuns, content: text, styleRuns } = content;
        if (typeof text !== 'string') return;
        const names = [];

        function replaceNamePN(o) {
            return getDisplayName(o.channelId).then(fetchResult => {
                let resolveResult = null;
                if (fetchResult) {
                    const textTrimmed = verifyAndConvertHandle(o.handle, fetchResult);
                    if (textTrimmed) {
                        o.display = `@${fetchResult.title}`;
                        o.newText = o.oldText.replace(o.handle, o.display);
                    }
                }
                return resolveResult; // function as a Promise
            });
        }
        const promises = [];
        for (const commandRun of commandRuns) {
            let browseEndpoint = null;
            if (commandRun.length >= 1 && commandRun.startIndex >= 0 && (browseEndpoint = ((commandRun.onTap || 0).innertubeCommand || 0).browseEndpoint)) {
                let substr = text.substring(commandRun.startIndex, commandRun.startIndex + commandRun.length);
                const substrTrimmed = substr.trim();
                const valBrowseEndpointBaseUrlType = browseEndpointBaseUrlType(browseEndpoint, substrTrimmed);
                if (valBrowseEndpointBaseUrlType > 1) {
                    const o = {
                        startIndex: commandRun.startIndex,
                        endIndex: commandRun.startIndex + commandRun.length,
                        handle: substrTrimmed,
                        oldText: substr,
                        newText: null,
                        channelId: browseEndpoint.browseId,
                        nStartIndex: null,
                        nEndIndex: null,
                        nText: null
                    }
                    names.push(o);
                    promises.push(replaceNamePN(o));
                }
            }
        }
        await Promise.all(promises);

        let offset = 0;
        for (const o of names) {
            o.nStartIndex = o.startIndex + offset;
            o.nText = o.newText === null ? o.oldText : o.newText;
            o.nEndIndex = o.nStartIndex + offset + o.nText.length;
            offset += o.nText.length - o.oldText.length;
        }

        let w1 = 0, w2 = 0;
        let s = [];
        let j = 0;
        for (let i = 0; i < text.length;) {
            while (w1 < commandRuns.length && commandRuns[w1].startIndex < i) w1++;
            while (w2 < styleRuns.length && styleRuns[w2].startIndex < i) w2++;

            if (j < names.length && i == names[j].startIndex) {

                if (w1 < commandRuns.length && commandRuns[w1].startIndex === names[j].startIndex) {
                    const run = commandRuns[w1];
                    const o = names[j];
                    if (run.length === o.endIndex - o.startIndex) {
                        run.startIndex = o.nStartIndex;
                        run.length = o.nText.length;
                    }
                    w1++;
                }

                if (w2 < styleRuns.length && styleRuns[w2].startIndex === names[j].startIndex) {
                    const run = styleRuns[w2];
                    const o = names[j];
                    if (run.length === o.endIndex - o.startIndex) {
                        run.startIndex = o.nStartIndex;
                        run.length = o.nText.length;
                    }
                    w2++;
                }


                // s.push(text.substring(names[j].startIndex, names[j].endIndex));
                s.push(names[j].nText);
                i = names[j].endIndex;
                j++;
            } else {
                if (j >= names.length) {
                    s.push(text.substring(i));
                    i = text.length;
                } else {
                    if (j < names.length && names[j].startIndex > i + 1) {
                        s.push(text.substring(i, names[j].startIndex));
                        i = names[j].startIndex;
                    } else {
                        s.push(text.charAt(i));
                        i++;
                    }
                }
            }
        }

        content.content = s.join('');
        s.length = 0;


    };

    /**
     *
     * @param {ParentNode & Element} parentNode
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
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                for (let childNode = nodeFirstChild(node); childNode; childNode = nodeNextSibling(childNode)) {
                    const r = traverse(childNode);
                    if (r === true) return true;
                }
            }
        }

        traverse(parentNode);
    }

    function updatePinnedCommentBadge(md, title, langTitle) {
        const titleForDisplay = langTitle || title;
        if (typeof titleForDisplay !== 'string') return;
        if (title === titleForDisplay) return;
        const runs = ((((md.pinnedCommentBadge || 0).pinnedCommentBadgeRenderer || 0).label || 0).runs || 0); // can be 0
        if (runs.length === 2) {
            let idx = 0;
            let jdx = -1;
            for (const textRun of runs) {
                if (textRun.text === title) {
                    jdx = idx;
                    break;
                }
                idx++;
            }
            if (jdx >= 0) {
                const runs = md.pinnedCommentBadge.pinnedCommentBadgeRenderer.label.runs.slice(0);
                runs[jdx] = Object.assign({}, runs[jdx], { text: titleForDisplay });
                md.pinnedCommentBadge = Object.assign({}, md.pinnedCommentBadge);
                md.pinnedCommentBadge.pinnedCommentBadgeRenderer = Object.assign({}, md.pinnedCommentBadge.pinnedCommentBadgeRenderer);
                md.pinnedCommentBadge.pinnedCommentBadgeRenderer.label = Object.assign({}, md.pinnedCommentBadge.pinnedCommentBadgeRenderer.label, { runs });
            }
        }
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

        const { title, langTitle, externalId } = fetchResult;
        const titleForDisplay = langTitle || title;
        if (externalId !== channelId) return; // channel id must be the same

        if (commentText.isConnected !== true) return; // already removed
        if (commentText.textContent !== currentText) return; // already changed

        let search = contentText.text;
        if (typeof search === 'string') {

            const searchTrimmed = search.trim();
            if (searchTrimmed === handleText) { // ensure integrity after getDisplayName
                contentText.text = search.replace(searchTrimmed, "@" + titleForDisplay); // mention

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
     * @type { (anchor: HTMLElement, anchorHref: string?, mt: string?) => Promise<void> }
     */

    const getDisplayTextDOMForCommentRenderer = (root) => { // mobile
        let displayTextDOM = elementQS(root, '.comment-header .comment-title');
        if (displayTextDOM) {
            displayTextDOM = elementQS(displayTextDOM, '.yt-core-attributed-string') || displayTextDOM;
        }
        return displayTextDOM;
    }

    const ytPathnameExtract = (href) => {

        if (!href || typeof href !== 'string') return '';
        let i = 0;
        if (href.startsWith('/')) {

        } else if ((i = href.indexOf('youtube.com/')) >= 0) {
            href = href.substring(i + 11);
        } else {
            return '';
        }
        return href;

    }

    const getHrefType = (href) => {
        if (href && typeof href === 'string') {
            if (href.length === 33 && href.startsWith('/channel/') && /^\/channel\/UC[-_a-zA-Z0-9+=.]{22}$/.test(href)) {
                return 1;
            } else {
                if (isValidMinSlashHandle(href)) {
                    href = urlHandleConversion(href) || href;
                }
                if (href && exactHandleUrl_(href, true, 1)) {
                    return 2;
                }
            }
        }
        return 0;
    }

    const getYTextType = (text) => {
        // if (typeof text === 'string') return 1;
        if (typeof text === 'object' && text) {
            if (typeof text.simpleText === 'string') return 2;
            const runs = text.runs;
            if (runs && runs.length === 1) {
                let r = runs[0];
                return typeof r === 'string' ? 3 : typeof (r || 0).text === 'string' ? 4 : null;
            }
        }
        return null;
    }

    const getYTextContent = (text) => {
        // if (typeof text === 'string') return text;
        if (typeof text === 'object' && text) {
            const simpleText = text.simpleText;
            if (typeof simpleText === 'string') return simpleText;
            const runs = text.runs;
            if (runs && runs.length === 1) {
                let r = runs[0];
                return typeof r === 'string' ? r : typeof (r || 0).text === 'string' ? r.text : null;
            }
        }
        return null;
    }

    const setYTextContent = (text, fn) => {
        // if (typeof text === 'string') {
        //     res=fn(text);
        // }
        if (typeof text === 'object' && text) {
            const simpleText = text.simpleText;
            if (typeof simpleText === 'string') {
                return Object.assign({}, text, { simpleText: fn(simpleText) });
            }
            const runs = text.runs;
            if (runs && runs.length === 1) {
                let r = runs[0];
                return typeof r === 'string' ? Object.assign({}, text, { runs: [fn(r)] }) : typeof (r || 0).text === 'string' ? Object.assign({}, text, { runs: [Object.assign({}, r, { text: fn(r.text) })] }) : null;
            }
        }
        return null;
    }

    const fixCommentReplyDialogRenderer = (commentReplyDialogRenderer, funcPromises) => {
        if (!commentReplyDialogRenderer) return;
        const editableText = commentReplyDialogRenderer.editableText;
        if (!editableText) return;
        const editableTexts = editableText.runs;
        if (editableTexts && editableTexts.length >= 1) {
            for (let aidx = 0; aidx < editableTexts.length; aidx++) {
                const r = editableTextProcess(commentReplyDialogRenderer, editableTexts, aidx);
                if (r instanceof Promise) funcPromises.push(r);
            }
        }
        // $0.polymerController.$['action-buttons'].polymerController.__data.replyButtonRenderer.navigationEndpoint.createCommentReplyDialogEndpoint.dialog.commentReplyDialogRenderer.editableText
    }

    const domCheckAsync = isMobile ? async (anchor, hrefAttribute, mt) => {

        let sHandleName = null;
        let sNodeValue = null;
        try {
            if (!hrefAttribute || !mt) return;
            let parentNode = nodeParent(anchor);
            while (parentNode instanceof Node) {
                if (parentNode.nodeName === 'YTM-COMMENT-RENDERER' || ('_commentData' in parentNode)) break;
                parentNode = nodeParent(parentNode);
            }
            if (parentNode instanceof Node) { } else return;

            const commentRendererAuthorTextDOM = getDisplayTextDOMForCommentRenderer(parentNode);
            const anchorAiraLabel = anchor.getAttribute('aria-label');
            const anchorHrefValue = ytPathnameExtract(anchor.getAttribute('href')); // guess (Feb 2024)

            const cnt = insp(parentNode);
            const parentNodeData = cnt._commentData || cnt.data || 0;
            const authorTextData = (parentNodeData.authorText || 0);

            let tHandleName = null;

            if (commentRendererAuthorTextDOM && authorTextData) {
                const hType = getHrefType(anchorHrefValue);
                let ytext = null;
                if (hType === 2) {
                    tHandleName = anchorHrefValue.substring(1); // guess
                } else if (hType === 1) {
                    ytext = getYTextContent(authorTextData)
                    tHandleName = ytext; // authorTextData.runs[0].text
                }
                if (typeof tHandleName === 'string' && commentRendererAuthorTextDOM.textContent.trim() === tHandleName && isDisplayAsHandle(tHandleName)) {
                    ytext = ytext || getYTextContent(authorTextData)
                    if (ytext === tHandleName) {
                        sHandleName = tHandleName;
                        sNodeValue = tHandleName;
                    }
                }
            }

            if (typeof sHandleName === 'string' && typeof sNodeValue === 'string') {

                if (!channelIdToHandle.has(mt)) {
                    channelIdToHandle.set(mt, {
                        handleText: sHandleName,
                        justPossible: true
                    });
                }

                const fetchResult = await getDisplayName(mt);

                if (fetchResult === null) return;

                const { title, langTitle, externalId } = fetchResult;
                const titleForDisplay = langTitle || title;
                if (externalId !== mt) return; // channel id must be the same

                // anchor href might be changed by external
                if (!anchorIntegrityCheck(anchor, hrefAttribute)) return;

                if (commentRendererAuthorTextDOM.isConnected !== true) return; // already removed

                let found = false;

                findTextNodes(commentRendererAuthorTextDOM, (textnode) => {
                    if (textnode.nodeValue === sNodeValue) {
                        textnode.nodeValue = titleForDisplay;
                        found = true;
                        return true;
                    }
                });

                if (!found) return;
                if (anchorAiraLabel && anchorAiraLabel.trim() === sHandleName) anchor.setAttribute('aria-label', anchorAiraLabel.replace(sHandleName, titleForDisplay));
                const authorTextDataNew = setYTextContent(authorTextData, (t) => t.replace(t.trim(), titleForDisplay));
                if (authorTextDataNew && parentNodeData.authorText === authorTextData) {
                    parentNodeData.authorText = authorTextDataNew;
                }

                if (UPDATE_PIN_NAME && title && langTitle && langTitle !== title) {
                    const renderer = HTMLElement.prototype.closest.call(anchor, 'ytm-comment-renderer');
                    const pinned = !renderer ? null : HTMLElement.prototype.querySelector.call(renderer, 'ytm-pinned-comment-badge-renderer');
                    const spanText = !pinned ? null : HTMLElement.prototype.querySelector.call(pinned, 'span.yt-core-attributed-string[role="text"]');
                    const tc = spanText ? spanText.textContent : '';
                    updatePinnedCommentBadge(parentNodeData, title, langTitle);
                    let idx;
                    if (tc && tc === spanText.textContent && (idx = tc.indexOf(title)) >= 0) {
                        spanText.textContent = tc.substring(0, idx) + langTitle + tc.substring(idx + title.length);
                    }
                }

                const contentTexts = (parentNodeData.contentText || 0).runs;
                if (contentTexts && contentTexts.length >= 2) {
                    for (let aidx = 0; aidx < contentTexts.length; aidx++) {
                        const contentText = contentTexts[aidx] || 0;
                        if (contentText.italics !== true && isDisplayAsHandle(contentText.text)) {
                            mobileContentHandleAsync(parentNode, contentTexts, aidx);
                        }
                    }
                }

            }

        } catch (e) {
            console.warn(e);
        }

    } : async (anchor, hrefAttribute, mt) => {

        try {
            if (!hrefAttribute || !mt) return;
            let parentNode = nodeParent(anchor);
            let isCommentViewModel = 0;
            while (parentNode instanceof Node) {
                const cnt = insp(parentNode);
                if (typeof cnt.is === 'string') {
                    if (cnt.commentEntity && !cnt._propertiesChanged) { isCommentViewModel = 2; break; } // 2024.04.30: ytd-comment-view-model (v3)
                    if (cnt.commentEntity && typeof cnt._propertiesChanged === 'function') { isCommentViewModel = 1; break; } // Feb 2024: ytd-comment-view-model (v1 & v2)
                    else if (typeof cnt.dataChanged === 'function') break;
                }
                parentNode = nodeParent(parentNode);
            }
            if (parentNode instanceof Node) { } else return;
            const parentNodeController = insp(parentNode);

            if (isCommentViewModel > 0) {

                const commentEntity = parentNodeController.commentEntity || 0;
                const commentEntityAuthor = commentEntity.author || 0;
                const currentDisplayed = commentEntityAuthor.displayName || 0;
                if (typeof currentDisplayed !== 'string') return;
                if (!isDisplayAsHandle(currentDisplayed)) return;
                if (!channelIdToHandle.has(mt)) {
                    channelIdToHandle.set(mt, {
                        handleText: currentDisplayed.trim(),
                        justPossible: true
                    });
                }

                // not working for CommentViewModel v3
                if (typeof parentNodeController._propertiesChanged === 'function' && !parentNodeController._propertiesChanged159) {
                    const cntp = parentNodeController.constructor.prototype;
                    const c = cntp._propertiesChanged === parentNodeController._propertiesChanged ? cntp : parentNodeController;
                    c._propertiesChanged159 = c._propertiesChanged;
                    c._propertiesChanged = function () {
                        resetWhenPropChanged(this);
                        return this._propertiesChanged159.apply(this, arguments);
                    };
                }

                const fetchResult = await getDisplayName(mt);

                if (fetchResult === null) return;

                const { title, langTitle, externalId } = fetchResult;
                const titleForDisplay = langTitle || title;
                if (externalId !== mt) return; // channel id must be the same

                // anchor href might be changed by external
                if (!anchorIntegrityCheck(anchor, hrefAttribute)) return;

                if (commentEntityAuthor.displayName === currentDisplayed && commentEntityAuthor.channelId === mt) {
                    commentEntityAuthor.displayName = titleForDisplay;

                    if (commentEntity.properties) {
                        if (commentEntity.properties.authorButtonA11y === currentDisplayed) {
                            commentEntity.properties.authorButtonA11y = titleForDisplay;
                        }

                        // the inside hyperlinks will be only converted if its parent author name is handle
                        const content = commentEntity.properties.content;
                        if (content && (content.commandRuns || 0).length >= 1) {
                            try {
                                await contentTextProcessViewModel(content);

                                // $0.polymerController.commentEntity = Object.assign({}, $0.polymerController.commentEntity , { properties: Object.assign({}, $0.polymerController.commentEntity.properties, { content: Object.assign({},$0.polymerController.commentEntity.properties.content)  } )})

                                // parentNodeController.commentEntity.properties = Object.assign({}, parentNodeController.commentEntity.properties, {
                                //     content: Object.assign({}, parentNodeController.commentEntity.properties.content)
                                // });

                                commentEntity.properties.content = Object.assign({}, content);
                            } catch (e) {
                                console.log(e);
                            }

                        }

                    }

                    if (commentEntityAuthor && parentNodeController.isAttached === true && parentNode.isConnected === true) {
                        commentEntityAuthor.jkrgx = 1;
                        addCSSRulesIfRequired();
                    }

                    let commentReplyDialogRenderer;

                    const actionButtonsCnt = insp((parentNodeController.$ || 0)['action-buttons'] || 0);
                    if (actionButtonsCnt) {

                        try {
                            commentReplyDialogRenderer = actionButtonsCnt.__data.replyButtonRenderer.navigationEndpoint.createCommentReplyDialogEndpoint.dialog.commentReplyDialogRenderer;
                        } catch (e) { }
                    }
                    const funcPromises = [];
                    commentReplyDialogRenderer && fixCommentReplyDialogRenderer(commentReplyDialogRenderer, funcPromises);


                    if (funcPromises.length >= 1) {
                        await Promise.all(funcPromises);
                    }

                    parentNodeController.commentEntity = Object.assign({}, parentNodeController.commentEntity);

                }
            } else {

                const authorText = (parentNodeController.data || 0).authorText;
                const currentDisplayed = getYTextContent(authorText || 0);   // authorText.simpleText
                if (typeof currentDisplayed !== 'string') return;
                if (!isDisplayAsHandle(currentDisplayed)) return;

                if (!channelIdToHandle.has(mt)) {
                    channelIdToHandle.set(mt, {
                        handleText: currentDisplayed.trim(),
                        justPossible: true
                    });
                }

                if (typeof parentNodeController.dataChanged === 'function' && !parentNodeController.dataChanged159) {
                    const cntp = parentNodeController.constructor.prototype;
                    const c = cntp.dataChanged === parentNodeController.dataChanged ? cntp : parentNodeController;
                    c.dataChanged159 = c.dataChanged;
                    c.dataChanged = function () {
                        resetWhenDataChanged(this);
                        return this.dataChanged159.apply(this, arguments);
                    };
                }

                const fetchResult = await getDisplayName(mt);

                if (fetchResult === null) return;

                const { title, langTitle, externalId } = fetchResult;
                const titleForDisplay = langTitle || title;
                if (externalId !== mt) return; // channel id must be the same

                // anchor href might be changed by external
                if (!anchorIntegrityCheck(anchor, hrefAttribute)) return;

                const parentNodeData = parentNodeController.data;
                const funcPromises = [];

                if (parentNodeController.isAttached === true && parentNode.isConnected === true && typeof parentNodeData === 'object' && parentNodeData && parentNodeData.authorText === authorText) {

                    if (getYTextContent(authorText) !== currentDisplayed) return;
                    const currentDisplayTrimmed = verifyAndConvertHandle(currentDisplayed, fetchResult);
                    const cSimpleText = (getYTextContent(parentNodeData.authorText || 0) || '');
                    if (currentDisplayTrimmed && currentDisplayed !== titleForDisplay && cSimpleText === currentDisplayed) {

                        const md = Object.assign({}, parentNodeData);

                        // the inside hyperlinks will be only converted if its parent author name is handle
                        const contentTexts = (md.contentText || 0).runs;
                        if (contentTexts && contentTexts.length >= 1) {
                            for (let aidx = 0; aidx < contentTexts.length; aidx++) {
                                const r = contentTextProcess(md, contentTexts, aidx);
                                if (r instanceof Promise) funcPromises.push(r);
                            }
                        }

                        const authorCommentBadgeAuthorText = (((md.authorCommentBadge || 0).authorCommentBadgeRenderer || 0).authorText || 0);

                        const authorCommentBadgeAuthorTextNew = authorCommentBadgeAuthorText ? setYTextContent(authorCommentBadgeAuthorText, (currentText) => {
                            if ((currentText || '').trim() === cSimpleText.trim()) {
                                return (currentText || '').replace((currentText || '').trim(), titleForDisplay);
                            } else {
                                return currentText;
                            }
                        }) : null;

                        // parentNode.data = Object.assign({}, { jkrgx: 1 });
                        const authorTextNew = setYTextContent(md.authorText, (t) => t.replace(currentDisplayTrimmed, titleForDisplay))
                        md.authorText = authorTextNew;

                        if (authorCommentBadgeAuthorTextNew) {
                            const authorCommentBadgeRendererNew = Object.assign({}, md.authorCommentBadge.authorCommentBadgeRenderer, { authorText: authorCommentBadgeAuthorTextNew });
                            md.authorCommentBadge = Object.assign({}, md.authorCommentBadge, { authorCommentBadgeRenderer: authorCommentBadgeRendererNew });
                        }

                        let setReplyEditableText = false;
                        if (((((((((parentNodeData.actionButtons || 0).commentActionButtonsRenderer || 0).replyButton || 0).buttonRenderer || 0).navigationEndpoint || 0).createCommentReplyDialogEndpoint || 0).dialog || 0).commentReplyDialogRenderer || 0).editableText) {
                            setReplyEditableText = true;
                        }
                        if (setReplyEditableText) {
                            const commentReplyDialogRenderer = parentNodeData.actionButtons.commentActionButtonsRenderer.replyButton.buttonRenderer.navigationEndpoint.createCommentReplyDialogEndpoint.dialog.commentReplyDialogRenderer;
                            fixCommentReplyDialogRenderer(commentReplyDialogRenderer, funcPromises);

                        }

                        if (UPDATE_PIN_NAME) {
                            updatePinnedCommentBadge(md, title, langTitle);
                        }

                        if (funcPromises.length >= 1) {
                            await Promise.all(funcPromises);
                        }

                        if (parentNodeController.isAttached === true && parentNode.isConnected === true) {
                            parentNodeController.data = Object.assign({}, md, { jkrgx: 1 });
                            addCSSRulesIfRequired();
                        }


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
            const pDomController = insp(pDom);
            const channelTitleText = (pDomController.data || 0).channelTitleText || 0;
            const runs = ((channelTitleText || 0).runs || 0);
            if (getYTextType(channelTitleText) === 4) {
                const browserEndpoint = (((runs[0] || 0).navigationEndpoint || 0).browseEndpoint || 0);
                browseId = (browserEndpoint.browseId || '');
                const currentDisplayText = runs[0].text || ''

                if (isUCBrowserId(browseId) && isDisplayAsHandle(currentDisplayText)) {

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

                        const { title, langTitle, externalId } = fetchResult;
                        const titleForDisplay = langTitle || title;
                        if (externalId !== browseId) return; // channel id must be the same

                        const hDom = pDom;
                        const hDomHostElement = hDom.hostElement || hDom;
                        const hDomController = insp(hDom);
                        const hData = (hDomController || 0).data || 0;
                        const hChannelTitleText = (hData || 0).channelTitleText || 0;
                        const runs = ((hChannelTitleText).runs || 0);
                        if (getYTextType(hChannelTitleText) === 4 && (runs[0] || 0).text === currentDisplayText && hDomHostElement.isConnected === true) {

                            const channelTitleTextNew = { runs: [Object.assign({}, runs[0], { text: titleForDisplay })] }

                            hDomController.data = Object.assign({}, hDomController.data, { channelTitleText: channelTitleTextNew, rSk0e: 1 });
                            addCSSRulesIfRequired();

                            byPassCheckStore.delete(rchannelNameDOM);
                        }

                    })
                }

            }
        }
        return browseId
    }

    let firstDOMCheck = false;
    const updateDisplayNameFn = (channelId, newName) => {
        const cached = displayNameResStore.get(channelId);
        if (typeof (cached || 0).title === 'string') {
            cached.title = newName;
        } else if (!cached) {
            displayNameResStore.set(channelId, {
                channelUrl: `https://www.youtube.com/channel/${channelId}`,
                externalId: `${channelId}`,
                ownerUrls: [],
                title: newName,
                vanityChannelUrl: null,
                verified123: true
            });
        } else {
            console.warn('unexpected display name cache', cached);
        }
    };
    const firstDOMChecker = isMobile ? () => {

        let playerMicroformatRenderer = null;
        try {
            playerMicroformatRenderer = window.ytInitialPlayerResponse.microformat.playerMicroformatRenderer
        } catch (e) { }
        if (playerMicroformatRenderer && playerMicroformatRenderer.ownerChannelName && playerMicroformatRenderer.ownerProfileUrl) {
            cfg.ownerChannelName = playerMicroformatRenderer.ownerChannelName;
            cfg.ownerProfileUrl = playerMicroformatRenderer.ownerProfileUrl.replace(/[\S]+youtube.com\//, 'youtube.com/');
        }

        const channelNameDOM = document.querySelector('ytm-slim-owner-renderer');
        const channelNameCData = !channelNameDOM ? null : insp(channelNameDOM).data;

        if (channelNameCData) {
            let mainChannelUrl = null;
            let mainFormattedNameUrl = null;
            let mainChannelText = null;
            let mainFormattedNameText = null;
            let mainChannelBrowseId = null;

            try {
                mainChannelUrl = channelUrlUnify(channelNameCData.channelUrl)   // channelUrlUnify("http://www.youtube.com/channel/UC5CwaMl1eIgY8h02uZw7u8A")
                mainFormattedNameUrl = channelUrlUnify(channelNameCData.title.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl) // channelUrlUnify("/channel/UC5CwaMl1eIgY8h02uZw7u8A")
                mainChannelText = channelNameCData.channelName
                mainFormattedNameText = channelNameCData.title.runs[0].text
                mainChannelBrowseId = channelNameCData.navigationEndpoint.browseEndpoint.browseId;
            } catch (e) { }

            if (mainChannelUrl === mainFormattedNameUrl && mainChannelText === mainFormattedNameText && typeof mainChannelUrl === 'string' && typeof mainChannelText === 'string' && mainChannelBrowseId && isUCBrowserId(mainChannelBrowseId)) {

                const channelId = mainChannelBrowseId;
                if (channelId) {
                    if (mainChannelText.startsWith('@')) return;
                    if (mainChannelText.trim() !== mainChannelText) return;
                    updateDisplayNameFn(channelId, mainChannelText);
                }


            }
        }

    } : () => {

        const channelNameDOM = document.querySelector('ytd-channel-name.ytd-video-owner-renderer');
        const channelNameCnt = insp(channelNameDOM);
        const channelNameCData = (channelNameCnt || 0).__data || (channelNameDOM || 0).__data;
        if (channelNameCData) {
            let mainChannelUrl = null;
            let mainFormattedNameUrl = null;
            let mainChannelText = null;
            let mainFormattedNameText = null;
            let mainChannelBrowseId = null;
            try {
                mainChannelUrl = channelNameCData.channelName.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl
                mainFormattedNameUrl = channelNameCData.formattedName.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl
                mainChannelText = channelNameCData.channelName.runs[0].text
                mainFormattedNameText = channelNameCData.formattedName.runs[0].text
                mainChannelBrowseId = channelNameCData.channelName.runs[0].navigationEndpoint.browseEndpoint.browseId;
            } catch (e) { }

            if (mainChannelUrl === mainFormattedNameUrl && mainChannelText === mainFormattedNameText && typeof mainChannelUrl === 'string' && typeof mainChannelText === 'string' && mainChannelBrowseId && isUCBrowserId(mainChannelBrowseId)) {

                const m = exactHandleUrl(mainChannelUrl, false);

                if (m && mainChannelText !== m) {

                    const channelHandle = m[1];
                    if (/[^-_a-zA-Z0-9.]/.test(mainChannelText)) {
                        langPreferredDisplayNameMap.set(channelHandle, mainChannelText);
                    }

                } else {

                    const channelId = mainChannelBrowseId;
                    if (channelId) {
                        if (mainChannelText.startsWith('@')) return;
                        if (mainChannelText.trim() !== mainChannelText) return;
                        updateDisplayNameFn(channelId, mainChannelText);
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

    const pipelineForDOMMutations = createPipeline();

    const byPassCheckStore = new WeakSet();

    const mutObserverForShortsChannelName = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const target = mutation.target;
            if (!target) continue;
            const rchannelNameElm = parentYtElement(target, 'YTD-CHANNEL-NAME', 18);
            if (!rchannelNameElm) continue;
            const rchannelNameCnt = insp(rchannelNameElm);
            if ((rchannelNameCnt.data || 0).rSk0e) continue;
            const channelId = rchannelNameElm.getAttribute('jkrgy');
            if (channelId) {
                if (byPassCheckStore.has(rchannelNameElm)) continue;
                const handleObj = channelIdToHandle.get(channelId);
                if (handleObj && handleObj.handleText && !handleObj.justPossible) {
                    const textDom = ((rchannelNameCnt.$ || 0).text || 0);
                    if (textDom) {
                        let t = textDom.textContent.trim()
                        if (t === handleObj.handleText || t === '') {
                            rchannelNameElm.removeAttribute('jkrgy');
                            // Promise.resolve().then(domChecker);
                        }
                    }
                }
            }
        }
    });

    let domCheckScheduledForShorts = false;
    const domCheckSelectorForShorts = [
        'ytd-channel-name.ytd-reel-player-header-renderer:not([jkrgy]) a.yt-simple-endpoint[href]'
    ].join(', ');


    const domCheckerForShorts = async () => {

        if (domCheckScheduledForShorts) return;
        if (document.querySelector(domCheckSelectorForShorts) === null) {
            return;
        }
        domCheckScheduledForShorts = true;

        await pipelineForDOMMutations(async () => {

            domCheckScheduledForShorts = false;
            // setTimeout(()=>{ // delay due to data update is after [is-active] switching

            try {

                const nodes = document.querySelectorAll(domCheckSelectorForShorts);
                if (nodes.length === 0) {
                    return;
                }

                for (const node of nodes) {

                    const rchannelNameElm = parentYtElement(node, 'YTD-CHANNEL-NAME', 18);
                    if (rchannelNameElm) {
                        mutObserverForShortsChannelName.observe(rchannelNameElm, {
                            childList: true,
                            subtree: true
                        });
                        byPassCheckStore.add(rchannelNameElm);
                        const channelId = checkShortsChannelName(rchannelNameElm);
                        rchannelNameElm.setAttribute('jkrgy', channelId || '');
                    }

                }

            } catch (e) {
                console.log('error occur', e);
            }

        });
        domCheckScheduledForShorts = false;

    };

    /** @param {Element} s */
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
                    const h = q.trim();

                    if (!firstDOMCheck) {
                        firstDOMCheck = true;
                        USE_CHANNEL_META && firstDOMChecker();
                    }

                    if (!channelIdToHandle.has(channelId)) {
                        channelIdToHandle.set(channelId, {
                            handleText: h,
                            justPossible: true
                        });
                    }

                    s.setAttribute('jkrgy', channelId);
                    getDisplayName(channelId).then(fetchResult => {

                        if (fetchResult === null) return;

                        const { title, langTitle, externalId } = fetchResult;
                        const titleForDisplay = langTitle || title;
                        if (externalId !== channelId) return; // channel id must be the same

                        const anchorElement = s;
                        const anchorTextNode = textNode;

                        if (anchorElement.isConnected === true && anchorTextNode.isConnected === true && anchorElement.contains(anchorTextNode) && anchorTextNode.nodeValue === p && s.getAttribute('href') === href) {

                            anchorTextNode.nodeValue = `${p.substring(0, index)}${q.replace(h, titleForDisplay)}`;

                        }

                    });
                }
            }
            return true;
        });

    }

    // domCheckerForDescription: To be reviewed
    // Example: https://www.youtube.com/watch?v=1NL-sIP9p_U
    const domCheckerForDescription = isMobile ? () => {
        // example https://m.youtube.com/watch?v=jKt4Ah47L7Q
        for (const s of document.querySelectorAll('span.yt-core-attributed-string a.yt-core-attributed-string__link.yt-core-attributed-string__link--display-type.yt-core-attributed-string__link--call-to-action-color[href*="channel/"]:not([dxcpj])')) {
            s.setAttribute('dxcpj', '');
            domCheckerForDescriptionAnchor(s);
        }
    } : () => {
        // example https://www.youtube.com/watch?v=jKt4Ah47L7Q
        for (const s of document.querySelectorAll('yt-attributed-string a.yt-core-attributed-string__link.yt-core-attributed-string__link--display-type.yt-core-attributed-string__link--call-to-action-color[href*="channel/"]:not([dxcpj])')) {
            s.setAttribute('dxcpj', '');
            domCheckerForDescriptionAnchor(s);
        }
    };

    const domCheckScheduledBools = [];
    const domCheckScheduledSelectors = isMobile ? [
        'a[aria-label^="@"][href*="channel/"]:not([jkrgy])', // old; Before Feb 2024
        'a.comment-icon-container[href*="/@"]:not([jkrgy])', // Feb 2024
        'a.comment-icon-container[href*="channel/"]:not([jkrgy])' // Mar 2024
    ] : [
        'a[id][href*="channel/"]:not([jkrgy])', // old; Before Feb 2024
        'a.yt-simple-endpoint.style-scope[id][href^="/@"]:not([jkrgy])', // Feb 2024
        'a.yt-simple-endpoint.style-scope[id][href^="http://www.youtube.com/@"]:not([jkrgy])' // Dec 2024
    ];

    const newAuthorAnchorsProceed = async (newAnchors) => {

        const cNewAnchorFirst = newAnchors[0]; // non-null
        const cNewAnchorLast = newAnchors[newAnchors.length - 1]; // non-null
        /** @type {HTMLElement | null} */
        const lastNewAnchorLast = kRef(lastNewAnchorLastWR); // HTMLElement | null
        lastNewAnchorLastWR = mWeakRef(cNewAnchorLast);

        if (!firstDOMCheck) {
            firstDOMCheck = true;
            USE_CHANNEL_META && firstDOMChecker();
        }

        await Promise.resolve();

        if (lastNewAnchorLast && mutex.nextIndex >= 1) {
            if ((lastNewAnchorLast.compareDocumentPosition(cNewAnchorFirst) & 2) === 2) {
                mutex.nextIndex = 0;
            }
            await Promise.resolve();
        }

        // newAnchorAdded = true;
        for (const anchor of newAnchors) {
            const hrefAttribute = anchor.getAttribute('href');
            const hrefV = ytPathnameExtract(hrefAttribute);
            let mChannelId = '';
            const ytElm = isMobile ? closestYtmData(anchor) : closestYtParent(anchor);
            if (ytElm) {
                const cnt = insp(ytElm);
                const { browseId, canonicalBaseUrl } = getAuthorBrowseEndpoint(cnt) || 0;
                let wChannelId = '';
                if (!browseId && !canonicalBaseUrl && cnt) {
                    // Dec 2024; no browserEndPoint -> urlEndpoint -> channelId not available
                    // comment view model -> commentEntity.author.channelId
                    const author = ((cnt.__data || cnt.data || 0).commentEntity || 0).author || 0;
                    if (author) {
                        const { channelId } = author;
                        const innertubeCommand = ((author || 0).channelPageEndpoint || 0).innertubeCommand || 0;
                        const endpoint = innertubeCommand.browseEndpoint || innertubeCommand.urlEndpoint || author.browseEndpoint || browseEndpoint.urlEndpoint || 0;
                        const url = endpoint.canonicalBaseUrl || endpoint.url || 0;
                        if (channelId && ytPathnameExtract(url) === hrefV && channelId.startsWith('UC') && /^UC[-_a-zA-Z0-9+=.]{22}$/.test(channelId)) {
                            wChannelId = channelId;
                        }
                    }
                } else if (browseId && ytPathnameExtract(canonicalBaseUrl) === hrefV && browseId.startsWith('UC') && /^UC[-_a-zA-Z0-9+=.]{22}$/.test(browseId)) {
                    wChannelId = browseId;
                }

                if (wChannelId) {

                    const hrefType = getHrefType(hrefV);
                    // console.log(599, hrefV, hrefType)
                    if (hrefType === 1) {
                        if (hrefV === `/channel/${wChannelId}`) {
                            let authorText = null;
                            if (isMobile) { // mobile only
                                authorText = (cnt._commentData || cnt.data || ytElm._commentData || ytElm.data || 0).authorText || 0;
                            } else if (!isMobile) {
                                authorText = (cnt.data || 0).authorText || 0;
                            }
                            if (authorText) {
                                const text = getYTextContent(authorText);
                                if (typeof text === 'string' && text.startsWith('@') && exactHandleText(text, true)) {
                                    channelIdToHandle.set(wChannelId, {
                                        handleText: `${text}`,
                                        justPossible: true
                                    });
                                }
                            }
                            mChannelId = wChannelId;
                        }
                    } else if (hrefType === 2) {
                        const handle = hrefV.substring(2);
                        channelIdToHandle.set(wChannelId, {
                            handleText: `@${handle}`
                        });
                        mChannelId = wChannelId;
                    }

                }

                if (!mChannelId && hrefV) { // fallback

                    // author-text or name
                    // normal url: /channel/xxxxxxx
                    // Improve YouTube! - https://www.youtube.com/channel/xxxxxxx/videos

                    const temp = obtainChannelId(hrefV); // string, can be empty
                    if (temp) {
                        mChannelId = temp;
                    }

                }
            }
            anchor.setAttribute('jkrgy', mChannelId);
            if (mChannelId) {
                domCheckAsync(anchor, hrefAttribute, mChannelId);
            }
        }

    }

    const closestYtParent = (dom) => {
        while (dom instanceof Element) {
            if (typeof dom.is === 'string' && dom.is) return dom;
            dom = dom.parentNode;
        }
        return null;
    };
    const closestYtmData = (dom) => {
        while (dom instanceof Element) {
            if (typeof (dom._commentData || dom.data || 0) === 'object') return dom;
            dom = dom.parentNode;
        }
        return null;
    };
    /*
    const cntWithParent = (cnt, parentSelector) => {
        const hostElement = cnt.hostElement || cnt;
        if (hostElement instanceof HTMLElement) {
            return hostElement.closest(parentSelector);
        }
        return null;
    }
    */
    const noAuthorDataSet = new Set();
    const getAuthorBrowseEndpoint = (cnt) => {
        let d;
        let haveData = false;
        if (isMobile) {
            const data = ((cnt || 0).data || 0);
            if (data) {
                haveData = true;
                if (d = (data.authorNameEndpoint || data.authorEndpoint)) return d.browseEndpoint || null;
            }
        } else {
            const __data = ((cnt || 0).__data || 0);
            if (__data) {
                haveData = true;
                if (d = __data.authorTextCommand) return d.browseEndpoint || null; // ytd-comment-renderer
                if (d = (__data.authorNameEndpoint || __data.authorEndpoint)) return d.browseEndpoint || null; // ytd-comment-view-model (v1 & v2)
                if ((d = (__data.data || 0)) && (d = (d.authorNameEndpoint || d.authorEndpoint))) return d.browseEndpoint || null; // ytd-author-comment-badge-renderer
                // note: authorNameEndpoint instead of authorEndpoint for ytd-comment-view-model since 2024.04

            } else {

                if ((d = ((cnt || 0).data || 0)) && (d = (d.authorTextCommand || d.authorNameEndpoint || d.authorEndpoint))) return d.browseEndpoint || null; // ytd-comment-view-model (2024.05.25 ?)

                if (d = (cnt.authorTextCommand || cnt.authorNameEndpoint || cnt.authorEndpoint)) return d.browseEndpoint || null; // ytd-comment-view-model (2024.04.30) (v3) (?)

            }

        }
        if (haveData) {
            const tag = cnt.is;
            if (!noAuthorDataSet.has(tag)) {
                noAuthorDataSet.add(tag);
                if (tag === 'ytd-video-description-infocards-section-renderer') {
                    return null; // skip console logging
                } else if (tag === 'ytd-thumbnail') {
                    return null;
                } else if (tag === 'ytd-structured-description-channel-lockup-renderer') {
                    return null;
                } else if (tag === 'ytd-rich-grid-media') {
                    return null;
                } else if (tag === 'ytd-rich-metadata-renderer') {
                    return null;
                } else if (tag === 'ytd-guide-entry-renderer') {
                    return null;
                } else if (tag === 'ytd-grid-channel-renderer') {
                    return null;
                } else if (tag === 'ytd-channel-renderer') {
                    return null;
                }
                console.log('no browseEndpoint can be found', tag);
            }
        } else {
            console.log('no browseEndpoint can be found', (cnt || 0).is, 'NO DATA');
        }
        return null;
    };

    const domAuthorNameCheckN = async (kq) => {
        if (domCheckScheduledBools[kq]) return;
        const selector = domCheckScheduledSelectors[kq];
        if (!selector || document.querySelector(selector) === null) return;
        domCheckScheduledBools[kq] = true;
        await pipelineForDOMMutations(async () => {
            domCheckScheduledBools[kq] = false;
            try {
                const newAnchors = document.querySelectorAll(selector);
                if (newAnchors.length === 0) return;
                await newAuthorAnchorsProceed(newAnchors);
            } catch (e) {
                console.log('error occur', e);
            }
        });
        domCheckScheduledBools[kq] = false;
    };

    let _lastAnchorCount = -1;
    const anchorCollection = document.getElementsByTagName('A');

    /*
    const collectionChangeObserverFn = (collection)=>{
        let _len = -1;
        let ws = null;
        ws = new WeakSet(collection);
        return {check: ()=>{
            const lastLen = _len;
            const len = collection.length;
            if(len !== lastLen){
                ws = new WeakSet(collection);
                return true;
            }
            for (const elm of collection) {
                if (!ws.has(elm)){
                    ws = new WeakSet(collection);
                    return true;
                }
            }
            return false;
        }}

    }
    */

    const domChecker = (mutations) => {

        const currAnchorCount = anchorCollection.length;
        const lastAnchorCount = _lastAnchorCount;
        _lastAnchorCount = currAnchorCount;
        if (currAnchorCount === 0) return;

        if (mutations && lastAnchorCount === currAnchorCount) {
            // test to skip
            let state = 0;
            let addedNonElement = false;
            for (const mutation of mutations) {
                const addedNodes = mutation.addedNodes || 0;
                const removedNodes = mutation.removedNodes || 0;
                const target = mutation.target || 0;
                if (target.nodeName === 'YT-FORMATTED-STRING') continue; // ignore changes in <yt-formatted-string>
                if (addedNodes.length >= 1) {
                    state |= 1;
                    if (!addedNonElement) {
                        for (const addedNode of addedNodes) {
                            if (!(addedNode instanceof Element)) {
                                addedNonElement = true;
                                break;
                            }
                        }
                    }
                    if (state & 2) break;
                } else if (removedNodes.length >= 1) {
                    state |= 2;
                    if (state & 1) break;
                } else {
                    state |= 4;
                    break;
                }
            }
            if (state === 1) {
                if (!addedNonElement) return; // no change in anchor
            } else if (state === 2) {
                return; // only removal
            } else if (state === 0) {
                return; // no recognized mutation
            }
        }

        doShortsChecking && domCheckerForShorts();
        doDescriptionChecking && domCheckerForDescription();
        for (let i = 0; i < domCheckScheduledSelectors.length; i++) domAuthorNameCheckN(i);

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


    // let mActive = false;
    // let lastContent = '';
    const removeAttrs = () => {
        for (const s of document.querySelectorAll('a[href][dxcpj]')) {
            s.removeAttribute('dxcpj');
        }
        for (const s of document.querySelectorAll('a[href][jkrgy]')) {
            s.removeAttribute('jkrgy');
        }
    }

    // setInterval(() => {
    //     if (!mActive) return;
    //     let content = (document.querySelector('ytd-comments-header-renderer #title') || 0).textContent || '';
    //     if (content !== lastContent) {
    //         lastContent = content;
    //         removeAttrs();
    //     }
    // }, 400);

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

        _lastAnchorCount = -1;

        if (!domObserver) {
            domObserver = new MutationObserver(domChecker);
        } else {
            domObserver.takeRecords();
            domObserver.disconnect();
        }

        // lastContent = (document.querySelector('ytd-comments-header-renderer #title') || 0).textContent || '';
        // mActive = true;
        removeAttrs();

        domObserver.observe(app, { childList: true, subtree: true, attributes: true, attributeFilter: ['jkrgy', 'href', 'dxcpj'] });
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
        getYtConfig(cfg, ytcfg, ['INNERTUBE_API_KEY', 'INNERTUBE_CLIENT_VERSION', 'HL', 'GL']);
        setupOnPageFetched(app);
    });

})({ fetch, JSON, Request, AbortController, setTimeout, clearTimeout });
