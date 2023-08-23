// ==UserScript==
// @name        ChatGPT: Message Records
// @namespace   UserScripts
// @match       https://chat.openai.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM_addValueChangeListener
// @grant       unsafeWindow
// @version     0.0.0
// @author      CY Fung
// @license     MIT
// @description 8/21/2023, 11:24:53 PM
// @run-at      document-start
// @inject-into page
// ==/UserScript==

const __errorCode21167__ = (() => {

    try {
        Promise.resolve('\u{1F4D9}', ((async () => { })()).constructor);
    } catch (e) {
        console.log('%cUnsupported Browser', 'background-color: #FAD02E; color: #333; padding: 4px 8px; font-weight: bold; border-radius: 4px;');
        return 0x3041;
    }

    if (typeof GM_addValueChangeListener !== 'function' || typeof GM !== 'object' || typeof (GM || 0).setValue !== 'function') {
        console.log('%cUnsupported UserScript Manager', 'background-color: #FAD02E; color: #333; padding: 4px 8px; font-weight: bold; border-radius: 4px;');
        return 0x3042;
    }

    return 0;
})();

__errorCode21167__ || (() => {

    /** @type {Window} */
    const uWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    /** @type {{ globalThis.PromiseConstructor}} */
    const Promise = ((async () => { })()).constructor;

    let __recordId_new = 1;
    let abortCounter = 0;

    const kPattern = (num) => {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const k = num % 9;
        const j = Math.floor(num / 9);
        const letter = letters[j];
        return `${letter}${k + 1}`;
    }

    const kHash = (n) => {
        if (n < 0 || n > 54755) {
            throw new Error('Number out of range');
        }

        const nValue = 9 * 26; // precompute this value since it's constant

        // Simplified equation, combined terms
        let hashBase = (n * 9173) % 54756;
        // ((54756 - n) * 9173 + (n) * 7919 + (n) * 5119) % 54756;`

        let hash = '';
        for (let i = 0; i < 2; i++) {
            const t = hashBase % nValue;
            hash = kPattern(t) + hash;
            hashBase = Math.floor(hashBase / nValue);
        }

        return hash;
    }

    const cleanContext = async (win, gmWindow) => {
        /** @param {Window} fc */
        const sanitize = (fc) => {
            const { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } = fc;
            const res = { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame };
            for (let k in res) res[k] = res[k].bind(win); // necessary
            return res;
        }
        if (gmWindow && typeof gmWindow === 'object' && gmWindow.GM_info && gmWindow.GM) {
            let isIsolatedContext = (
                (gmWindow.requestAnimationFrame !== win.requestAnimationFrame) &&
                (gmWindow.cancelAnimationFrame !== win.cancelAnimationFrame) &&
                (gmWindow.setTimeout !== win.setTimeout) &&
                (gmWindow.setInterval !== win.setInterval) &&
                (gmWindow.clearTimeout !== win.clearTimeout) &&
                (gmWindow.clearInterval !== win.clearInterval)
            );
            if (isIsolatedContext) {
                return sanitize(gmWindow);
            }
        }
        const waitFn = requestAnimationFrame; // shall have been binded to window
        try {
            let mx = 16; // MAX TRIAL
            const frameId = 'vanillajs-iframe-v1'
            let frame = document.getElementById(frameId);
            let removeIframeFn = null;
            if (!frame) {
                frame = document.createElement('iframe');
                frame.id = 'vanillajs-iframe-v1';
                frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
                let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
                n.appendChild(frame);
                while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
                const root = document.documentElement;
                root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
                removeIframeFn = (setTimeout) => {
                    const removeIframeOnDocumentReady = (e) => {
                        e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
                        win = null;
                        setTimeout(() => {
                            n.remove();
                            n = null;
                        }, 200);
                    }
                    if (document.readyState !== 'loading') {
                        removeIframeOnDocumentReady();
                    } else {
                        win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
                    }
                }
            }
            while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
            const fc = frame.contentWindow;
            if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
            const res = sanitize(fc);
            if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
            return res;
        } catch (e) {
            console.warn(e);
            return null;
        }
    };

    cleanContext(uWin, window).then((__CONTEXT__) => {

        const { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } = __CONTEXT__;

        const console = Object.assign({}, window.console);
        /** @type {JSON.parse} */
        const jParse = window.JSON.parse.bind(window.JSON);
        const jParseCatched = (val) => {
            let res = null;
            try {
                res = jParse(val);
            } catch (e) { }
            return res;
        }
        const jStringify = window.JSON.stringify.bind(window.JSON);

        const GM_RECORD_KEY = 'TOTAL_MESSAGE_RECORDS';

        let __foregroundActivityMeasure = 0;
        let __totalActivityMeasure = 0;
        const foregroundActivityMeasureInterval = 500;
        const amiUL = foregroundActivityMeasureInterval * 1.1;
        const amiLL = foregroundActivityMeasureInterval * 0.9;
        const activityMeasure = {
            get foreground() {
                return __foregroundActivityMeasure;
            },

            get background() {
                return activityMeasure.total - activityMeasure.foreground;
            },
            get total() {
                return Math.round(__totalActivityMeasure)
            }
        }


        let __uid = 0;

        let message_cap = null;
        let categories = null;
        let models = null;
        let currentAccount = null;
        let currentUser = null;
        const getUserId = () => currentAccount && currentUser ? `${currentAccount}.${currentUser}` : '';

        const dummyObject = {};
        for (const [key, value] of Object.entries(console)) {
            if (typeof value === 'function' && typeof dummyObject[key] !== 'function') {
                console[key] = value.bind(window.console);
            }
        }

        const messageRecords = [];
        let messageRecordsOnCurrentAccount = null;

        const findRecordIndexByRId = (rid) => {

            if (!rid) return null;
            for (let i = 0; i < messageRecords.length; i++) {
                const record = messageRecords[i];
                if (record.$recordId && rid === record.$recordId) {
                    return i;
                }
            }
            return -1;

        }


        const updateGMRecord = () => {

            Promise.resolve().then(() => {
                GM.setValue(GM_RECORD_KEY, jStringify({
                    version: 1,
                    records: messageRecords
                }));
            });

        }

        const fixOverRecords = () => {
            messageRecords.splice(0, Math.floor(messageRecords.length / 2));
            let rid = 1;
            for (const record of messageRecords) {
                record.$recordId = rid;
                messageRecords.push(record);
                rid++;
            }
            __recordId_new = rid;
            keep.length = 0;
            keep = null;
            updateGMRecord();
        }

        const addRecord = (record) => {
            if (!currentAccount || !currentUser || !record || record.$account_uid) {
                console.log('addRecord aborted');
                return;
            }

            record.$account_uid = getUserId();

            const recordId = __recordId_new;
            record.$recordId = recordId;

            record.$recorded_at = Date.now(); // Local Time
            messageRecords.push(record);
            __recordId_new++;
            messageRecordsOnCurrentAccount.push(record);


            if (messageRecords.length > 52000 || __recordId_new > 52000) {
                Promise.resolve().then(fixOverRecords);
            }


            return recordId;

        }



        Object.assign(uWin, {
            $$mr$$getMessageRecords() {
                return messageRecords;
            },
            $$mr$$getMessageRecordsFromGM() {
                return GM.getValue(GM_RECORD_KEY);
            },
            $$mr$$clearMessageRecords() {
                return GM.deleteValue(GM_RECORD_KEY);
            },
            $$mr$$getUserId() {
                const r = getUserId();
                if (!r) console.log(`!! ${currentAccount}.${currentUser} !!`)
                return r;
            },
            $$mr$$activityMeasure() {
                return Object.assign({}, activityMeasure)
            }
        });



        const setRecordsByJSONString = (newValue, initial) => {

            const tObj = jParseCatched(newValue || '{}');
            if (!tObj || !tObj.version || !tObj.records) tObj = { version: 1, records: [] };

            if (tObj.version !== 1) {
                if (initial) {
                    GM.deleteValue(GM_RECORD_KEY);
                    // and wait change confirmed by listener
                } else {
                    console.warn('record version is incorrect. please reload the page.');
                }
                return;
            }

            if (messageRecords.length > 0) messageRecords.length = 0;
            __recordId_new = 1;
            let rid = 1;
            for (const record of tObj.records) {
                if (record.$recordId >= rid) rid = record.$recordId + 1;
                messageRecords.push(record);
                __recordId_new++;
            }
            __recordId_new = rid;
            messageRecordsOnCurrentAccount = messageRecords.filter(entry => entry.$account_uid === currentAccount);



        }

        const onAccountDetectedOrChanged = () => {

            messageRecordsOnCurrentAccount = messageRecords.filter(entry => entry.$account_uid === currentAccount);

        }


        let rzt = 0;
        let gmValueListenerId = GM_addValueChangeListener(GM_RECORD_KEY, (key, oldValue, newValue, remote) => {
            let tid = ++rzt;

            requestAnimationFrame(() => {
                if (tid !== rzt) return;
                setRecordsByJSONString(newValue)

            });
        });

        Promise.resolve().then(() => GM.getValue(GM_RECORD_KEY)).then(result => {
            //

            result = result || '{}';

            if (typeof result !== 'string') {
                console.log('GM.getValue aborted')
                return;
            }

            GM.setValue()
            setRecordsByJSONString(result, true)


        })

        const arrayTypeFix = (a) => {
            return a === null || a === undefined ? [] : a;
        }
        function onRequest(_body) {

            const body = _body;

            const bodyObject = jParseCatched(body);
            if (!bodyObject) {
                console.log('invalid JSON object');
                return;
            }

            if (!('messages' in bodyObject)) {
                console.log('invalid format of JSON body')
                return;
            }

            const model = bodyObject.model;
            const messages = arrayTypeFix(bodyObject.messages);

            if (!model || !messages || typeof (messages || 0).length !== 'number') {
                console.log('invalid format of JSON body')
                return;
            }

            if (!currentAccount) {
                console.log('No account information is found. Message Record aborted.')
                return;
            }

            let conversation_id = bodyObject.conversation_id;
            if (!conversation_id) conversation_id = "***"

            let recordIds = null;

            const onAbort = (evt, signal, newChatId) => {

                if (typeof newChatId === 'string' && newChatId) {

                    const cd002 = !!recordIds && recordIds.length === 1 && recordIds[0] > 0;
                    console.log('condition 002', cd002);

                    if (cd002) {
                        const rid = recordIds[0];
                        const idx = findRecordIndexByRId(rid);

                        if (idx === null || idx < 0 || !messageRecords[idx] || messageRecords[idx].conversation_id !== '***') {
                            console.warn('error found in onAbort');
                        } else {
                            messageRecords[idx].conversation_id = newChatId
                
                            console.log(`record#${rid} is updated with conversation_id = "${newChatId}"`)
                        }

                    }

                }

                if (recordIds && recordIds.length >= 1) {

                    const completionTime = evt.__aborted_at__ > 0 ? evt.__aborted_at__ : 0;

                    if (completionTime) {
                        for (const rid of recordIds) {
                            const idx = findRecordIndexByRId(rid);
                            if (idx === null || idx < 0 || !messageRecords[idx]) {
                                console.warn('completionTime found in onAbort');
                            } else if (messageRecords[idx].conversation_id === '***') {
                                // TBC
                            } else {
                                messageRecords[idx].$completed_at = completionTime;
                            }
                        }
                    }

                }




                updateGMRecord();

                console.log('messageHandler: onAbort', evt, signal, newChatId);
            };

            const uid = ++__uid;

            const onResponse = (response, info) => {

                const { requestTime, responseTime } = info;

                response.lockedBodyStream.then((body) => {

                    console.log(13, body)

                })

                if (!currentAccount) {
                    console.log('No account information is found. Message Record aborted.')
                    return;
                }

                if (recordIds !== null) {
                    console.warn('recordIds !== null');
                }
                recordIds = [];
                for (const message of messages) {

                    const rid = addRecord({
                        model,
                        conversation_id,
                        message,
                        $requested_at: requestTime, 
                        $responsed_at: responseTime
                    });
                    recordIds.push(rid);

                }

                updateGMRecord();


                console.log(bodyObject)
                console.log(response, info)
                console.log({
                    message_cap,
                    categories,
                    models
                })

            }

            return {
                uid,
                model,
                conversation_id,
                message_cap,
                categories,
                bodyObject,

                messages,
                onAbort,
                onResponse,

            }


        }


        uWin.__fetch247__ = uWin.fetch;

        let onceRgStr = false;

        let __newChatIdResolveFn__ = null;

        uWin.fetch = function (a) {
            const args = arguments;
            return new Promise((resolve, reject) => {
                let doCatch = false;
                let body = null;

                let _onAbort = null;

                if (typeof a === 'string' && a.endsWith('/backend-api/conversation')) {
                    const b = args[1] || 0;
                    if (b.method === "POST" && typeof b.body === 'string' && ((b.headers || 0)['Content-Type'] || '').includes('application/json')) {
                        doCatch = true;
                        body = b.body;

                    }
                    if (b && b.signal) {

                        const signal = b.signal;
                        const tid = ++abortCounter;
                        signal.addEventListener('abort', (evt) => {
                            evt.__aborted_at__ = Date.now();
                            const aid = abortCounter;
                            ++abortCounter;

                            console.log('onabort', aid, tid, evt, signal)

                            if (aid === tid && _onAbort) {
                                _onAbort(evt, signal);
                            }



                        });
                    }
                } else if (typeof a === 'string' && a.startsWith('https://events.statsigapi.net/v1/rgstr')) {
                    if (onceRgStr) {
                        resolve = null;
                        reject = null;
                        return; // no resolve or reject for subsequent requests
                    }
                    onceRgStr = true; // no resolve or reject for next request
                } else if (__newChatIdResolveFn__ && typeof a === 'string' && a.startsWith('https://chat.openai.com/backend-api/conversation/gen_title/')) {

                    let m = /gen_title\/([-0-9a-z]+)(\/|$)/.exec(a);
                    if (m && m[1]) {
                        __newChatIdResolveFn__(m[1]);
                    }
                }

                const unprocessedFetch = () => {

                    const actualRequest = uWin.__fetch247__.apply(this, args);

                    console.log(269, false, args[0], Object.assign({}, args[1] || {}))

                    actualRequest.then((result) => {
                        resolve(result);

                    }).catch((error) => {
                        reject(error);
                    });

                }

                const messageHandler = doCatch ? onRequest(body) : false;
                if (!messageHandler) {
                    unprocessedFetch();
                    return;
                }
                const requireNewChatId = (messageHandler.conversation_id === '***');

                _onAbort = (evt, signal) => {

                    __newChatIdResolveFn__ = null;

                    if (requireNewChatId) {
                        let resolveFn = null;
                        let promise = new Promise(resolve => {
                            resolveFn = resolve;
                        })
                        __newChatIdResolveFn__ = (x) => {
                            resolveFn && resolveFn(x);
                            resolveFn = null;
                        };
                        setTimeout(() => {
                            resolveFn && resolveFn();
                            resolveFn = null;
                        }, 16);

                        // 777ms -> 781ms => 16ms shall be sufficient
                        promise.then((newChatId) => {
                            if (__newChatIdResolveFn__ === null) {
                                console.warn('unexpected error');
                                return;
                            }
                            __newChatIdResolveFn__ = null;

                            newChatId = newChatId || null;
                            console.log(`newChatId: ${newChatId}`);
                            messageHandler.onAbort(evt, signal, newChatId);
                        })
                    } else {

                        messageHandler.onAbort(evt, signal, false);
                    }

                }


                const requestTime1 = Date.now();
                const actualRequest = uWin.__fetch247__.apply(this, args);
                const requestTime2 = Date.now();
                const requestTime = Math.round((requestTime1 + requestTime2) / 2);

                console.log(269, true, args[0], Object.assign({}, args[1] || {}))






                actualRequest.then((result) => {
                    const responseTime = Date.now();

                    let mBodyResolve = null;
                    const mBody = new Promise(r => {
                        mBodyResolve = r;
                    });

                    const pRes = new Proxy(result, {
                        get(target, property, receiver) {
                            const r = target[property];
                            /**
                             * 
                             * property's get order
                             * 
                             * then
                             * status
                             * then
                             * 
                             * ----
                             * 
                             * type
                             * status
                             * clone
                             * headers
                             * headers
                             * ok
                             * body
                             * 
                             * 
                             */
                            if (property === 'body') {
                                mBodyResolve && mBodyResolve(r);
                                // console.log(667, r);
                            }
                            return r;
                        }
                    });

                    const mResult = {
                        headers: result.headers, ok: result.ok, redirected: result.redirected, status: result.status,
                        statusText: result.statusText, type: result.type, url: result.url, get lockedBodyStream() { return mBody },

                    };

                    resolve(pRes);
                    Promise.resolve().then(() => {
                        messageHandler.onResponse(mResult, { requestTime, responseTime });
                    }).catch(console.warn);

                }).catch((error) => {
                    reject(error);
                })

            });
        }

        const xpathExpression = '//div[@role="presentation"]//div[normalize-space(text())="?"][contains(@class, "h-") and contains(@class, "w-")]';
        let observer = null;
        let mct = 0;
        let wType = 0;

        let attachedGroup = null;

        const setupMyGroup = (myGroup) => {

            const buttonText = document.evaluate(xpathExpression, myGroup, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            buttonText.textContent = '\u{1F4D9}';


            myGroup.addEventListener('click', function () {

                console.log(1554);

            })



        }

        const onElementFound = (matchedElement) => {



            let group = matchedElement.closest('.group');
            if (!group) {
                console.log('The group parent of Question Mark Button cannot be found.')
                return;
            }
            if (!attachedGroup) {


                let myGroup = group.cloneNode(true);
                group.parentNode.insertBefore(myGroup, group);
                setupMyGroup(myGroup);

                attachedGroup = myGroup;
            } else {
                group.parentNode.insertBefore(attachedGroup, group);

            }

        }

        const setupMRAM = () => {

            const mram = document.createElement('mr-activity-measure');
            mram.setAttribute('m', '')
            document.head.appendChild(document.createElement('style')).textContent = `
            mr-activity-measure[m] {
              visibility: collapse !important;
              width: 1px !important;
              height: 1px !important;
    
              display: block !important;
              z-index: -1 !important;
              contain: strict !important;
              box-sizing: border-box !important;
    
              position: fixed !important;
              top: -1000px !important;
              left: -1000px !important;
              animation: ${foregroundActivityMeasureInterval}ms ease-in 500ms infinite alternate forwards running mrActivityMeasure !important;
            }
            @keyframes mrActivityMeasure{
              0%{
                order: 0;
              }
              100%{
                order: 1;
              }
            }
    
    
    
            `
            let lastEt = 0;
            mram.onanimationiteration = function (evt) {
                const et = evt.elapsedTime * 1000;
                if (__totalActivityMeasure > et) {
                    this.onanimationiteration = null;
                    return;
                }
                const wt = lastEt;
                lastEt = et;
                const dt = et - wt;
                if (dt < amiUL && dt > amiLL) __foregroundActivityMeasure += foregroundActivityMeasureInterval;

                __totalActivityMeasure = et;
                // console.log(evt)
            }
            document.documentElement.appendChild(mram);
        }

        const findAndHandleElement = () => {
            if (!observer) return;
            if (wType === 0) {


                const result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const matchedElement = result.singleNodeValue;

                if (matchedElement && !wType) {
                    wType = 1;

                    // observer.disconnect();
                    // observer.takeRecords();
                    // observer = null;
                    Promise.resolve(matchedElement).then(onElementFound).then(setupMRAM).catch(console.warn);


                }


            } else {

                if (!attachedGroup) return;
                if (attachedGroup.isConnected) return;




                const result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const matchedElement = result.singleNodeValue;

                if (matchedElement) {


                    Promise.resolve(matchedElement).then(onElementFound).catch(console.warn);

                }


            }
        }

        observer = new MutationObserver(function (mutationsList, observer) {
            if (!observer) return;
            let tid = ++mct;
            requestAnimationFrame(function () {
                if (tid !== mct) return;
                findAndHandleElement();
            });
        });

        observer.observe(document, { childList: true, subtree: true });

        function onReady() {
            if (!onReady) return;
            onReady = null;
            if (!observer) return;
            if (wType > 0) return;
            let tf = () => {

                if (!document.querySelector('main')) return tf();

                setTimeout(function () {
                    if (!observer) return;
                    if (wType > 0) return;
                    console.log('The Question Mark Button cannot be found.')
                    observer.disconnect();
                    observer.takeRecords();
                    observer = null;
                }, 1200);

            };
            requestAnimationFrame(tf)
        }

        if (document.readyState !== 'loading') {
            onReady();
        }

        window.addEventListener('load', onReady, false);




        ((Response) => {

            Response.prototype.__json7961__ = Response.prototype.json;
            Response.prototype.json = function () {

                /** @type {globalThis.Response} */
                const __this__ = this;
                /** @type {Promise<any>} */
                let jsonPromise = __this__.__json7961__.apply(__this__, arguments);

                jsonPromise = jsonPromise.then(__jsonRes__ => {

                    //         console.log(123);
                    //         console.log(__jsonRes__);


                    if (typeof (__jsonRes__ || 0).message_cap === 'number') {
                        message_cap = __jsonRes__.message_cap;
                    }

                    if (typeof (__jsonRes__ || 0).user === 'object' && (__jsonRes__.user || 0).id) {
                        currentUser = `${(__jsonRes__.user || 0).id}`;
                    }



                    if (typeof (__jsonRes__ || 0).accounts === 'object') {
                        const tmpSet = new Set();
                        if (((__jsonRes__ || 0).accounts || 0).length > 0) {

                            for (const account of __jsonRes__.accounts) {
                                tmpSet.add(`${account.account_id}.${account.account_user_id}`);
                            }

                        } else {

                            for (let [key, account] of Object.entries(__jsonRes__.accounts)) {
                                account = account.account || account;
                                tmpSet.add(`${account.account_id}.${account.account_user_id}`);

                            }

                        }
                        if (tmpSet.size !== 1) {
                            console.log('account detection failed')
                        } else {
                            let acc = [...tmpSet.keys()][0];
                            if (acc !== currentAccount) {

                                currentAccount = acc;
                                onAccountDetectedOrChanged();
                            }
                        }




                    }


                    if (((__jsonRes__ || 0).categories || 0).length >= 1 && ((__jsonRes__ || 0).models || 0).length >= 1) {

                        const jsonRes = __jsonRes__;


                        try {

                            categories = [...jsonRes.categories];
                        } catch (e) { }
                        try {
                            models = [...jsonRes.models];

                        } catch (e) { }


                    }

                    return __jsonRes__;

                });
                return jsonPromise;

            };
        })(uWin.Response);


        console.log('script loaded')



    })


})();


/**
 * 
 

$record_time_ms:  1692831419486
$requested_at:    1692831418865
$responsed_at:    1692831419485
create_time:      1692831782.061773


server time is now() + 6 minutes

 * 
 * 
 */