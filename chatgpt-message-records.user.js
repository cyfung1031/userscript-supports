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

const errorCode = (() => {

    try {
        Promise.resolve('\u{1F4D9}');
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

((o) => {
    const { uWin } = o

    if (errorCode > 0) return;

    const GM_RECORD_KEY = 'TOTAL_MESSAGE_RECORDS';

    const jParse = JSON.parse.bind(JSON);

    const jStringify = JSON.stringify.bind(JSON);

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


    let message_cap = null;
    let categories = null;
    let models = null;
    let currentAccount = null;
    let currentUser = null;
    const getUserId = () => currentAccount && currentUser ? `${currentAccount}.${currentUser}` : '';

    const dummyObject = {};
    const console = Object.assign({}, uWin.console);
    for (const [key, value] of Object.entries(console)) {

        if (typeof value === 'function' && typeof dummyObject[key] !== 'function') {
            console[key] = value.bind(uWin.console);
        }
    }

    const messageRecords = [];
    let messageRecordsOnCurrentAccount = null;

    let runningMs = 0;

    function addRecord(record) {
        if (!currentAccount || !currentUser || !record || record.$account_uid) {
            console.log('addRecord aborted');
            return;
        }


        record.$account_uid = getUserId();
        record.$record_time_ms = Date.now(); // Local Time

        const create_time = +(record.message || 0).create_time;
        if (create_time > 9) {

            let create_time_ms = null;
            if (create_time > 1000000001 && create_time < 9999999991) {
                create_time_ms = Math.round(create_time * 1000);
            } else if (create_time > 1000000001000 && create_time < 9999999991000) {
                create_time_ms = Math.round(create_time);
            }
            if (create_time_ms) {

                delete record.message.create_time;

                record.$create_time_ms = create_time_ms; // GPT server
            }

        }

        if(record.$create_time_ms > 1000000001000 && record.$create_time_ms < 9999999991000 && record.$record_time_ms > 1000000001000 && record.$record_time_ms < 9999999991000){
            record.record_time_delayed_by = record.$record_time_ms - record.$create_time_ms
        }
        messageRecords.push(record);
        messageRecordsOnCurrentAccount.push(record);

        Promise.resolve().then(() => {
            GM.setValue(GM_RECORD_KEY, jStringify({
                version: 1,
                records: messageRecords
            }));
        });





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



    function setRecordsByJSONString(newValue, initial) {

        let tObj = null;
        try {
            tObj = jParse(newValue || '{}');
        } catch (e) { }
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

        for (const record of tObj.records) {
            messageRecords.push(record);
        }
        messageRecordsOnCurrentAccount = messageRecords.filter(entry => entry.$account_uid === currentAccount);



    }

    function onAccountDetectedOrChanged() {

        messageRecordsOnCurrentAccount = messageRecords.filter(entry => entry.$account_uid === currentAccount);

    }


    let rzt = 0;
    let gmValueListenerId = GM_addValueChangeListener(GM_RECORD_KEY, function (key, oldValue, newValue, remote) {
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

    function arrayTypeFix(a) {
        return a === null || a === undefined ? [] : a;
    }
    function catchReqeust(body, response, info) {

        response.lockedBodyStream.then((body) => {

            console.log(13, body)

        })


        let bodyObject = null;
        try {
            bodyObject = jParse(body);
        } catch (e) { }
        if (!bodyObject) {

            console.log('invalid JSON object');
            return;
        }

        let { conversation_id, model } = bodyObject;


        if (!model || !('messages' in bodyObject)) {
            console.log('invalid format of JSON body')
            return;


        }

        if (!conversation_id) conversation_id = "***"

        const messages = arrayTypeFix(bodyObject.messages);
        if (typeof (messages || 0).length !== 'number') {
            console.log('invalid messages in fetch request')
            return;
        }

        if (!currentAccount) {
            console.log('No account information is found. Message Record aborted.')
            return;
        }

        for (const message of messages) {

            addRecord({
                model,
                conversation_id,
                message
            })


        }



        console.log(bodyObject)
        console.log(response, info)
        console.log({
            message_cap,
            categories,
            models
        })



    }



    uWin.__fetch247__ = uWin.fetch;

    uWin.fetch = function (a) {
        const args = arguments;
        return new Promise((resolve, reject) => {
            let doCatch = false;
            let body = null;

            if (typeof a === 'string' && a.endsWith('/backend-api/conversation')) {
                const b = args[1] || 0;
                if (b.method === "POST" && typeof b.body === 'string' && ((b.headers || 0)['Content-Type'] || '').includes('application/json')) {
                    doCatch = true;
                    body = b.body;

                }
            }


            const actualRequest = uWin.__fetch247__.apply(this, args);



            if (!doCatch) {

                actualRequest.then((result) => {
                    resolve(result);

                }).catch((error) => {
                    reject(error);
                })

                return;
            }

            const requestTime = Date.now();


            actualRequest.then((result) => {
                const responseTime = Date.now();
                /*
        
        
                result.__arrayBuffer = result.arrayBuffer
                result.__blob = result.blob
                result.__formData = result.formData
                result.__json = result.json
                result.__text = result.text
        
                result.json = function(){
        
                  console.log(422)
                  return new Promise((resolve,reject)=>{
        
                    this.__json().then(r=>{
                      console.log(453, r)
                      resolve(r)
                    }).catch(reject);
        
        
                  });
                }
        
        
        
                result.text = function(){
        
                  console.log(422)
                  return new Promise((resolve,reject)=>{
        
                    this.__text().then(r=>{
                      console.log(453, r)
                      resolve(r)
                    }).catch(reject);
        
        
                  });
                }
        
        
                result.formData = function(){
        
                  console.log(422)
                  return new Promise((resolve,reject)=>{
        
                    this.__formData().then(r=>{
                      console.log(453, r)
                      resolve(r)
                    }).catch(reject);
        
        
                  });
                }
        
        
                result.blob = function(){
        
                  console.log(422)
                  return new Promise((resolve,reject)=>{
        
                    this.__blob().then(r=>{
                      console.log(453, r)
                      resolve(r)
                    }).catch(reject);
        
        
                  });
                }
        
        
        
                result.arrayBuffer = function(){
        
                  console.log(422)
                  return new Promise((resolve,reject)=>{
        
                    this.__arrayBuffer().then(r=>{
                      console.log(453, r)
                      resolve(r)
                    }).catch(reject);
        
        
                  });
                }
        
                const rRes = {headers: result.headers, ok:result.ok, redirected: result.redirected, status:result.status,
                         statusText:result.statusText, type:result.type, url:result.url }
        
                Object.defineProperty(rRes, 'body', {
                  get(){
                    let p = result.body;
                    console.log(666, p);
                    return p
                  }
                })
        
                console.log(322,result);
        
                resolve(rRes)
                */

                /*
                const clonedResult = result.clone();
                   resolve(result.clone());
        
        
                  Promise.resolve().then(()=>{
                    catchReqeust(body, clonedResult, {requestTime, responseTime})
                  }).catch(console.warn);
                */


                /*
                const mResult = {headers: result.headers, ok:result.ok, redirected: result.redirected, status:result.status,
                         statusText:result.statusText, type:result.type, url: result.url };
        
                resolve(result);
                  Promise.resolve().then(()=>{
                    catchReqeust(body, mResult, {requestTime, responseTime})
                  }).catch(console.warn);
                  */

                let mBodyResolve = null;
                const mBody = new Promise(r => {

                    mBodyResolve = r;

                }).then((body) => {

                    /*
                      const [mainStream, clonedStream] = response.body.tee();
          
                      // Use mainStream for your main logic
                      const mainData = await new Response(mainStream).json();
          
                      // Use clonedStream somewhere else or later
                      const clonedData = await new Response(clonedStream).json();
          
                      console.log(mainData, clonedData);
                      */
                    return body;

                })

                /*
                const rRes = {headers: result.headers, ok:result.ok, redirected: result.redirected, status:result.status,
                         statusText:result.statusText, type:result.type, url:result.url }
        
                Object.defineProperty(rRes, 'body', {
                  get(){
                    let p = result.body;
                    mBodyResolve(p);
                    console.log(666, p);
                    return p
                  }
                });
                */

                const pRes = new Proxy(result, {
                    get(target, property, receiver) {
                        const r = target[property];
                        if (property === 'body') {
                            mBodyResolve && mBodyResolve(r);
                            // console.log(667, r);
                        }
                        return r;
                    }
                })


                const mResult = {
                    headers: result.headers, ok: result.ok, redirected: result.redirected, status: result.status,
                    statusText: result.statusText, type: result.type, url: result.url, get lockedBodyStream() { return mBody }
                };

                resolve(pRes);
                Promise.resolve().then(() => {
                    catchReqeust(body, mResult, { requestTime, responseTime })
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

    function setupMyGroup(myGroup) {

        const buttonText = document.evaluate(xpathExpression, myGroup, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        buttonText.textContent = '\u{1F4D9}';


        myGroup.addEventListener('click', function () {

            console.log(1554);

        })



    }

    function onElementFound(matchedElement) {



        let group = matchedElement.closest('.group');
        if (!group) {
            console.log('The group parent of Question Mark Button cannot be found.')
            return;
        }
        if (!attachedGroup) {


            let myGroup = group.cloneNode(true);
            group.parentNode.insertBefore(myGroup, group);
            setupMyGroup(myGroup)

            attachedGroup = myGroup;
        } else {
            group.parentNode.insertBefore(attachedGroup, group);

        }

    }

    function setupMRAM() {

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

    function findAndHandleElement() {
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

})({ uWin: typeof unsafeWindow !== 'undefined' ? unsafeWindow : window });
