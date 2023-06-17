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
// @version             0.4.0
// @license             MIT License

// @author              CY Fung
// @match               https://www.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/general-icon.png
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames
// @inject-into page

// @description         To restore YouTube Username to the traditional custom name
// @description:ja      YouTubeのユーザー名を伝統的なカスタム名に復元するために。
// @description:zh-TW   將 YouTube 使用者名稱從 Handle 恢復為自訂名稱
// @description:zh-CN   将 YouTube 用户名从 Handle 恢复为自定义名称

// @description:ko     YouTube 사용자 이름을 전통적인 사용자 지정 이름으로 복원합니다.
// @description:ru     Восстановление имени пользователя YouTube с помощью обычного настраиваемого имени
// @description:af     Herstel YouTube-gebruikersnaam vanaf Handvat na Aangepaste Naam
// @description:az     YouTube İstifadəçi Adını Özəl Adından İstifadə Etmək
// @description:id     Mengembalikan Nama Pengguna YouTube dari Handle ke Kustom
// @description:ms     Pulihkan Nama Pengguna YouTube dari Handle ke Tersuai
// @description:bs     Vrati YouTube korisničko ime sa ručke na prilagođeno ime
// @description:ca     Restaurar el nom d'usuari de YouTube de la màniga al personalitzat
// @description:cs     Obnovte uživatelské jméno YouTube z rukojeti na vlastní
// @description:da     Gendan YouTube-brugernavn fra Håndtag til Brugerdefineret
// @description:de     Stellt den YouTube-Benutzernamen von Handle auf Benutzerdefiniert wieder her
// @description:et     Taasta YouTube'i kasutajanimi käepidemelt kohandatud nimeks
// @description:es     Restaurar el nombre de usuario de YouTube de la manija al personalizado
// @description:eu     Berrezarri YouTube Erabiltzaile-izena Manipulatik Pertsonalizatuera
// @description:fr     Restaurer le nom d'utilisateur YouTube de la poignée au nom personnalisé
// @description:gl     Restaura o nome de usuario de YouTube da manexa ao personalizado
// @description:hr     Vrati YouTube korisničko ime s ručke na prilagođeno ime
// @description:zu     Hlanganisa Igama Lokusebenza lwe-YouTube kusuka kwi-Handle kuze kube kusebenza kakhulu
// @description:is     Endurheimtu YouTube Notandanafn frá Handfangi til Sérsniðins
// @description:it     Ripristina il nome utente di YouTube da Handle a Personalizzato
// @description:sw     Rejesha Jina la Mtumiaji wa YouTube kutoka kwa Kishughulikia hadi Desturi
// @description:lv     Atjaunot YouTube lietotāja vārdu no roktura uz pielāgotu
// @description:lt     Atkurti „YouTube“ naudotojo vardą iš rankenos į tinkamą
// @description:hu     Visszaállítja a YouTube felhasználónevet a fogantyútól a testreszabottra
// @description:nl     Herstel YouTube-gebruikersnaam van Handle naar Aangepaste naam
// @description:uz     YouTube foydalanuvchining nomini Hurda dan Shaxsiylashtirilgan nomga qaytarish
// @description:pl     Przywróć nazwę użytkownika YouTube z uchwytu na niestandardową
// @description:pt     Restaurar o nome de usuário do YouTube de Handle para Personalizado
// @description:pt-BR  Restaurar o nome de usuário do YouTube de Handle para Personalizado
// @description:ro     Restaurați Numele de Utilizator YouTube de la Mâner la Personalizat
// @description:sq     Rikthe emrin e përdoruesit të YouTube nga Maja në Personalizuar
// @description:sk     Obnovte používateľské meno YouTube z rukoväte na vlastné
// @description:sl     Obnovite uporabniško ime YouTube iz ročaja v prilagojeno ime
// @description:sr     Вратите YouTube корисничко име са ручке на прилагођено име
// @description:fi     Palauta YouTube-käyttäjänimi kahvasta räätälöityyn nimeen
// @description:sv     Återställ YouTube-användarnamnet från handtaget till anpassat namn
// @description:vi     Khôi phục Tên người dùng YouTube từ Tay cầm thành Tùy chỉnh
// @description:tr     Özel İsme Kullanıcı Adını İade Etme
// @description:be     Вярнуць імя карыстальніка YouTube з ручкі на наладжваецца
// @description:bg     Възстановяване на потребителско име на YouTube от дръжка до персонализирано име
// @description:ky     YouTube колдонуучунун атты боюнча атын тамашалау
// @description:kk     YouTube пайдаланушының атын Handle танымасынан Жеке атауға қайта түсіру
// @description:mk     Врати го името на YouTube корисникот од држачот во прилагодено име
// @description:mn     YouTube хэрэглэгчийн нэрийг хүчирхийлэгчидээс Байгууллагад нь солих
// @description:uk     Відновлення імені користувача YouTube з ручки на налаштоване ім'я
// @description:el     Επαναφορά Ονόματος Χρήστη YouTube από τη Λαβή σε Προσαρμοσμένο
// @description:hy     Վերականգնել YouTube-ի Օգտագործողի Անունը Ձեռքից Հատուցվածությանով
// @description:ur     ہینڈل سے یوٹیوب یوزر نیم کو کسٹم میں بحال کریں
// @description:ar     استعادة اسم مستخدم YouTube من المقبض إلى مخصص
// @description:fa     بازیابی نام کاربری یوتیوب از دستگیره به سفارشی
// @description:ne     ह्यान्डलबाट यूट्युब प्रयोगकर्तानाम अनुकूलमा उपयोग गर्नुहोस्
// @description:mr     हॅंडलमधून यूट्यूब वापरकर्तानाव अनुकूलित करा
// @description:hi     हैंडल से यूट्यूब यूजरनेम को कस्टम में बदलें
// @description:as     কাস্টম হতে হ্যান্ডেল পৰা ইউটিউব ব্যৱহাৰকাৰী নাম পুনৰ্স্থাপন কৰক
// @description:bn     হ্যান্ডেল থেকে কাস্টম করে ইউটিউব ব্যবহারকারীর নাম পুনরুদ্ধার করুন
// @description:pa     ਯੂਟਿਊਬ ਯੂਜਰਨਾਂ ਦਾ ਨਾਂ ਹੈਂਡਲ ਤੋਂ ਕਸਟਮ ਵਿੱਚ ਮੁੜ ਲਾਓ
// @description:gu     હેન્ડલથી કસ્ટમમાંથી YouTube વપરાશકર્તાનું નામ પુનર્સ્થાપિત કરો
// @description:or     କଷ୍ଟମରେ ହେନ୍ଡେଲରୁ YouTube ବ୍ୟବହାରକାରୀଙ୍କ ନାମ ପୁନର୍ପ୍ରାପ୍ତ କରନ୍ତୁ
// @description:ta     ஹேண்டில் இருந்து கஸ்டம் ஆக்கும் யூடியூப் பயனர்பெயரை மீட்டமைக்கவும்
// @description:te     హాండును నుంచి YouTube వాడుకరి పేరును కస్టమ్‌కు పునరుద్ధరించండి
// @description:kn     ಹ್ಯಾಂಡಲ್‌ನಿಂದ YouTube ಬಳಕೆದಾರ ಹೆಸರನ್ನು ಅನುಕೂಲಿತ ಮಾಡಿ
// @description:ml     ഹാന്റിൽ നിന്ന് കസ്റ്റം ആക്കാംമെന്ന് യുട്യൂബ് ഉപയോക്തൃനാമം മറ്റുള്ളവരെ മാറ്റുക
// @description:si     හැන්ඩල් සහිතව YouTube භාවිතයේ පරිශීලක නාමය ස්වයං කරයි
// @description:th     กู้คืนชื่อผู้ใช้ YouTube จากแฮนดิลไปเป็นชื่อที่กำหนดเอง
// @description:lo     ເຮັດຊະນິດຊື່ຜູ້ໃຊ້ YouTube ຈາກ Handle ຈົດໄວ້ເປັນຊື່ປັດຈຸບັນ
// @description:my     Handle မှ YouTube အသုံးပြုသူအမည်ကို စတင်ပြန်စစ်ဆေးပါ
// @description:ka     YouTube მომხმარებლის სახელის აღდგენა ხანდლიდან მორგებულ სახელში
// @description:am     ስለ YouTube የተጠቃሚ ስም ማስቀመጫዎቹን ከ Handle ወደ Custom ውስጥ እንደሚመጣ ይረዳሉ
// @description:km     កំណត់ YouTube ពាក្យឈ្មោះពី Handle ទៅជាឈ្មោះផ្ទាល់ខ្លួន

// ==/UserScript==

/* jshint esversion:8 */

(function () {
    'use strict';

    const cfg = {};
    class Mutex {

        constructor() {
            this.p = Promise.resolve()
        }

        lockWith(f) {
            this.p = this.p.then(() => new Promise(f)).catch(console.warn)
        }

    }

    class OrderedMutex extends Mutex {
        constructor() {
            super();
            this.nextIndex = 0;
            this.arr = [];
            this.lockFunc = resolve => {
                if (!this.arr.length) resolve();
                let f = this.arr[0];
                if (typeof f !== 'function') resolve();
                this.arr.shift();
                if (this.nextIndex > 0) this.nextIndex--;
                f(resolve);
            };
        }
        add(f) {
            if (this.nextIndex === this.arr.length) {
                this.arr.push(f); this.nextIndex++;
            } else {
                this.arr.splice(this.nextIndex++, 0, f);
            }
            this.lockWith(this.lockFunc);
        }
    }
    const mutex = new OrderedMutex();

    const displayNameCacheStore = new Map();

    const promisesStore = {};

    function createNetworkPromise(channelId) {

        return new Promise(networkResolve => {


            mutex.add(lockResolve => {

                let fetchedResult = displayNameCacheStore.get(channelId);
                if (fetchedResult) {
                    lockResolve();
                    networkResolve(fetchedResult);
                    return;
                }

                if (!document.querySelector(`[jkrgy="${channelId}"]`)) {
                    // element has already been removed
                    lockResolve();
                    networkResolve(null);
                    return;
                }

                //INNERTUBE_API_KEY = ytcfg.data_.INNERTUBE_API_KEY


                fetch(new window.Request(`/youtubei/v1/browse?key=${cfg.INNERTUBE_API_KEY}&prettyPrint=false`, {
                    "method": "POST",
                    "mode": "same-origin",
                    "credentials": "same-origin",

                    // (-- reference: https://javascript.info/fetch-api
                    referrerPolicy: "no-referrer",
                    cache: "default",
                    redirect: "error",
                    integrity: "",
                    keepalive: false,
                    signal: undefined,
                    window: window,
                    // --)

                    "headers": {
                        "Content-Type": "application/json",
                        "Accept-Encoding": "gzip, deflate, br"
                    },
                    "body": JSON.stringify({
                        "context": {
                            "client": {
                                "clientName": "MWEB",
                                "clientVersion": `${cfg.INNERTUBE_CLIENT_VERSION || '2.20230614.01.00'}`,
                                "originalUrl": `https://m.youtube.com/channel/${channelId}`,
                                "playerType": "UNIPLAYER",
                                "platform": "MOBILE",
                                "clientFormFactor": "SMALL_FORM_FACTOR",
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
                    lockResolve();
                    return res.json();
                }).then(res => {
                    networkResolve(res);
                }).catch(e => {
                    lockResolve();
                    console.warn(e);
                    networkResolve(null);
                })



            });

        })

    }

    const queueMicrotask_ = typeof queueMicrotask === 'function' ? queueMicrotask : requestAnimationFrame;

    function getDisplayName(channelId) {

        return new Promise(resolve => {

            let cachedResult = displayNameCacheStore.get(channelId);
            if (cachedResult) {
                resolve(cachedResult);
                return;
            }

            if (!promisesStore[channelId]) promisesStore[channelId] = createNetworkPromise(channelId);

            promisesStore[channelId].then(res => {
                // res might be null

                queueMicrotask_(() => {
                    promisesStore[channelId] = null;
                    delete promisesStore[channelId];
                });

                if ('verified123' in (res || 0)) {
                    resolve(res); // fetchedResult
                    return;
                }

                let resultInfo = ((res || 0).metadata || 0).channelMetadataRenderer;

                if (!resultInfo) {
                    resolve(null);
                } else {

                    const { title, externalId, ownerUrls, channelUrl, vanityChannelUrl } = res.metadata.channelMetadataRenderer;

                    const displayNameRes = { title, externalId, ownerUrls, channelUrl, vanityChannelUrl, verified123: false };
                    displayNameCacheStore.set(channelId, displayNameRes);

                    resolve(displayNameRes);

                }


            }).catch(console.warn);

        }).catch(console.warn);
    }

    const dataChangedFuncStore = new WeakMap();

    const obtainChannelId = (href) => {
        let m = /\/channel\/(UC[-_a-zA-Z0-9+=.]+)/.exec(`/${href}`);
        // let m = /\/channel\/([^/?#\s]+)/.exec(`/${href}`);
        return !m ? '' : (m[1] || '');
    };

    const dataChangeFuncProducer = (dataChanged) => {

        return function () {
            let anchors = null;
            try {
                anchors = HTMLElement.prototype.querySelectorAll.call(this, 'a[id][href*="channel/"][jkrgy]');
            } catch (e) { }
            if ((anchors || 0).length >= 1 && (this.data || 0).jkrgx !== 1) {
                for (const anchor of anchors) {
                    anchor.removeAttribute('jkrgy');
                }
            }
            return dataChanged.apply(this, arguments)
        }


    };

    const anchorIntegrityCheck = (anchor, channelHref, channelId) => {

        // https://www.youtube.com/channel/UCRmLncxsQFcOOC8OhzUIfxQ/videos /channel/UCRmLncxsQFcOOC8OhzUIfxQ UCRmLncxsQFcOOC8OhzUIfxQ


        let currentHref = anchor.getAttribute('href');
        if (currentHref === channelHref) return true; // /channel/UCRmLncxsQFcOOC8OhzUIfxQ // /channel/UCRmLncxsQFcOOC8OhzUIfxQ

        return (currentHref + '/').indexOf(channelHref + '/') >= 0;

    };

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

    const isDisplayAsHandle = (text) => {

        if (typeof text !== 'string') return false;
        if (text.length < 4) return false;
        if (text.indexOf('@') < 0) return false;
        return /^\s*@[a-zA-Z0-9_\-.]{3,30}\s*$/.test(text);


        /* https://support.google.com/youtube/answer/11585688?hl=en&co=GENIE.Platform%3DAndroid

        Handle naming guidelines

        Is between 3-30 characters
        Is made up of alphanumeric characters (A–Z, a–z, 0–9)
        Your handle can also include: underscores (_), hyphens (-), dots (.)
        Is not URL-like or phone number-like
        Is not already being used
        Follows YouTube's Community Guidelines

        // auto handle - without dot (.)

        */

    };

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
                return (resolveResult); // function as a Promise
            });
        }

        return null;
    };

    const domCheck = async (anchor, channelHref, mt) => {

        try {
            if (!channelHref || !mt) return;
            let parentNode = anchor.parentNode;
            while (parentNode instanceof Node) {
                if (typeof parentNode.is === 'string' && typeof parentNode.dataChanged === 'function') break;
                parentNode = parentNode.parentNode
            }
            if (parentNode instanceof Node && typeof parentNode.is === 'string' && typeof parentNode.dataChanged === 'function') { } else return;
            const authorText = (parentNode.data || 0).authorText;
            const currentDisplayed = (authorText || 0).simpleText;
            if (typeof currentDisplayed !== 'string') return;
            if (!isDisplayAsHandle(currentDisplayed)) return;

            const oldDataChanged = parentNode.dataChanged;
            if (typeof oldDataChanged === 'function' && !oldDataChanged.jkrgx) {
                let newDataChanged = dataChangedFuncStore.get(oldDataChanged)
                if (!newDataChanged) {
                    newDataChanged = dataChangeFuncProducer(oldDataChanged);
                    newDataChanged.jkrgx = 1;
                    dataChangedFuncStore.set(oldDataChanged, newDataChanged);
                }
                parentNode.dataChanged = newDataChanged;
            }

            const fetchResult = await getDisplayName(mt);

            if (fetchResult === null) return;

            const { title, externalId } = fetchResult;

            if (externalId !== mt) return; // channel id must be the same

            // anchor href might be changed by external
            if (!anchorIntegrityCheck(anchor, channelHref, externalId)) return;

            const parentNodeData = parentNode.data
            const funcPromises = [];
            if (parentNode.isAttached === true && parentNode.isConnected === true && typeof parentNodeData === 'object' && parentNodeData && parentNodeData.authorText === authorText) {

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
                    parentNode.data = Object.assign({}, md, { jkrgx: 1 });
                }

            }
        } catch (e) {
            console.warn(e);
        }


    }

    let firstDOMCheck = false;
    const firstDOMChecker = () => {

        let channelNameDOM = document.querySelector('ytd-channel-name.ytd-video-owner-renderer');
        let channelNameDOMData = (channelNameDOM || 0).__data;
        if (channelNameDOMData) {
            let mainChannelUrl = null;
            let mainFormattedNameUrl = null;
            let mainChannelText = null;
            let mainFormattedNameText = null;

            try {
                mainChannelUrl = channelNameDOMData.channelName.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl
                mainFormattedNameUrl = channelNameDOMData.formattedName.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl
                mainChannelText = channelNameDOMData.channelName.runs[0].text
                mainFormattedNameText = channelNameDOMData.formattedName.runs[0].text
            } catch (e) { }

            if (mainChannelUrl === mainFormattedNameUrl && mainChannelText === mainFormattedNameText && typeof mainChannelUrl === 'string' && typeof mainChannelText === 'string') {

                let m = /^\/(@[a-zA-Z0-9_\-.]{3,30})$/.test(mainChannelUrl);

                if (m && m[1] && mainChannelText !== m[1]) {

                    let channelId = obtainChannelId(mainChannelUrl);
                    if (channelId) {
                        if (mainChannelText.startsWith('@')) return;
                        if (mainChannelText.trim() !== mainChannelText) return;

                        displayNameCacheStore.set(channelId, {
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

    let lastNewAnchorLastWR = null;

    const domChecker = () => {

        const newAnchors = document.querySelectorAll('a[id][href*="channel/"]:not([jkrgy])');
        if (newAnchors.length === 0) return;
        const cNewAnchorFirst = newAnchors[0]; // non-null
        const cNewAnchorLast = newAnchors[newAnchors.length - 1]; // non-null
        /** @type {HTMLElement | null} */
        const lastNewAnchorLast = kRef(lastNewAnchorLastWR); // HTMLElement | null
        if (lastNewAnchorLast) {
            if ((lastNewAnchorLast.compareDocumentPosition(cNewAnchorLast) & 2) === 2) { // when "XX replies" clicked
                mutex.nextIndex = 0; // highest priority
            } else if (cNewAnchorLast !== cNewAnchorFirst && (lastNewAnchorLast.compareDocumentPosition(cNewAnchorFirst) & 2) === 1) { // rarely
                mutex.nextIndex = Math.floor(mutex.arr.length / 2); // relatively higher priority
            }
        }
        lastNewAnchorLastWR = mWeakRef(cNewAnchorLast);
        // newAnchorAdded = true;
        for (const anchor of newAnchors) {
            // author-text or name
            // normal url: /channel/xxxxxxx
            // Improve YouTube! - https://www.youtube.com/channel/xxxxxxx/videos
            const href = anchor.getAttribute('href');
            const channelId = obtainChannelId(href); // string, can be empty
            anchor.setAttribute('jkrgy', channelId);
            if (!firstDOMCheck) {
                firstDOMCheck = true;
                firstDOMChecker();
            }
            // intersectionobserver.unobserve(anchor);
            // intersectionobserver.observe(anchor); // force first occurance
            domCheck(anchor, href, channelId);
        }

    };


    /** @type {MutationObserver | null} */
    let domObserver = null;

    document.addEventListener('yt-page-data-fetched', function (evt) {

        const cfgData = (((window || 0).ytcfg || 0).data_ || 0);
        for (const key of ['INNERTUBE_API_KEY', 'INNERTUBE_CLIENT_VERSION']) {
            cfg[key] = cfgData[key];
        }

        if (!cfg['INNERTUBE_API_KEY']) {
            console.warn("Userscript Error: INNERTUBE_API_KEY is not found.");
            return;
        }

        if (!domObserver) {
            domObserver = new MutationObserver(domChecker);
        } else {
            domObserver.takeRecords();
            domObserver.disconnect();
        }

        domObserver.observe(evt.target || document.body, { childList: true, subtree: true });
        domChecker();

    });


})();