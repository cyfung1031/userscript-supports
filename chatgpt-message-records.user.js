// ==UserScript==
// @name        ChatGPT: Message Records
// @namespace   UserScripts
// @match       https://chat.openai.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM_addValueChangeListener
// @grant       unsafeWindow
// @version     1.1.2
// @author      CY Fung
// @license     MIT
// @description Remind you how many quota you left
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

  let userOpenAction = null;

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
        frame.id = frameId;
        const blobURL = typeof webkitCancelAnimationFrame === 'function' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null; // avoid Brave Crash
        frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
        let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
        n.appendChild(frame);
        while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
        const root = document.documentElement;
        root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
        if (blobURL) Promise.resolve().then(() => URL.revokeObjectURL(blobURL));

        removeIframeFn = (setTimeout) => {
          const removeIframeOnDocumentReady = (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            win = null;
            const m = n;
            n = null;
            setTimeout(() => m.remove(), 200);
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

    let message_cap_window = null;
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

    const cssStyleText = () => `

          :root {
              --mr-background-color: #2a5c47;
              --mr-font-stack: "Ubuntu-Italic", "Lucida Sans", helvetica, sans;

              --mr-target-width: 30px;
              --mr-target-height: 30px;
              --mr-target-bottom: 90px;
              --mr-target-right: 50px;

              /* 8-0.5*x+0.25*x*x */
              --mr-tb-radius: calc(2.42 * var(--mr-border-width));
              /* 20 -> 8px.  14 -> 6px   4px. 10px */
              --mr-message-bubble-width: 200px;
              --mr-message-bubble-margin: 0;
              --mr-border-width: 2px;
              --mr-triangle-border-width: var(--mr-tb-radius);

              --mr-message-bubble-opacity: 0;
              --mr-message-bubble-scale: 0.5;
              --mr-message-bubble-transform-origin: bottom right;
              --mr-message-bubble-transition: opacity 0.3s, transform 0.3s, visibility 0s 0.3s;
              --mr-border-color: #666;

              --mr-tb-btm: calc(var(--mr-tb-radius) * 1.72);
            }

            html {
                --mr-message-bubble-bg-color: #ecf3e7;
                --mr-message-bubble-text-color: #414351;
                --progress-color: #807e1e;
            }

            html.dark{
                --mr-message-bubble-bg-color: #40414f;
                --mr-message-bubble-text-color: #ececf1;
            }

            html[mr-request-model="gpt-4"]{
                --progress-color: #ac68ff;
            }

            html[mr-request-model="gpt-3"] {
            --progress-color: #19c37d;
            }

            html[mr-request-state="request"] {
              --progress-percent: 25%;
              --progress-rr: 9px;
            }

            html[mr-request-state="response"] {
              --progress-percent: 75%;
              --progress-rr: 9px;
            }


            html[mr-request-state=""] {
              --progress-percent: 100%;
              --progress-rr: 20px;
            }


    html[mr-request-state=""] .mr-progress-bar::before {
    --mr-animate-background-image: none;
    }



            .mr-progress-bar.mr-progress-bar-show {

              visibility:visible;

            }

             .mr-progress-bar {
     display: inline-block;
     width: 200px;
     --progress-height: 16px;
     --progress-padding: 4px;
     /* --progress-percent: 50%; */
     /* --progress-color: #2bc253; */
     --progress-stripe-color: rgba(255, 255, 255, 0.2);
     --progress-shadow1: rgba(255, 255, 255, 0.3);
     --progress-shadow2: rgba(0, 0, 0, 0.4);
     --progress-rl: 20px;
     /* --progress-rr: 9px; */

     width: 100%;
     /* --progress-percent: 100%;
     --progress-rr: 20px;*/
     visibility: collapse;
   }


   @keyframes mr-progress-bar-move {
     0% {
       background-position: 0 0;
     }

     100% {
       background-position: 50px 50px;
     }
   }

   .mr-progress-bar {
     box-sizing: border-box;
     height: var(--progress-height);
     position: relative;
     background: #555;
     border-radius: 25px;
     box-shadow: inset 0 -1px 1px var(--progress-shadow1);
     display: inline-block;
   }

   .mr-progress-bar::before {
     box-sizing: border-box;
     content: "";
     display: block;
     margin: var(--progress-padding);
     border-top-right-radius: var(--progress-rr);
     border-bottom-right-radius: var(--progress-rr);
     border-top-left-radius: var(--progress-rl);
     border-bottom-left-radius: var(--progress-rl);
     background-color: var(--progress-color);
     box-shadow: inset 0 2px 9px var(--progress-shadow1), inset 0 -2px 6px var(--progress-shadow2);
     position: absolute;
     top: 0;
     left: 0;
     right: calc(100% - var(--progress-percent));
     transition: right 300ms, background-color 300ms;
     bottom: 0;



     --mr-animate-background-image: linear-gradient(-45deg, var(--progress-stripe-color) 25%, transparent 25%, transparent 50%, var(--progress-stripe-color) 50%, var(--progress-stripe-color) 75%, transparent 75%, transparent);

    background-image: var(--mr-animate-background-image);

     background-size: 50px 50px;
     animation: mr-progress-bar-move 2s linear infinite;

   }

   .mr-nostripes::before {
   --mr-animate-background-image: none;
   }


   #mr-msg-l {

      text-align: center;
      font-size: .875rem;
      color: var(--tw-prose-code);
      font-size: .875em;
      font-weight: 600;
   }
   #mr-msg-p {
      text-align: center;
      font-size: 1rem;
   }

   #mr-msg-p1{
      display: block;
   }
   #mr-msg-p2{
      display: block;
      font-size: .75rem;
   }



            body {
              background-color: var(--mr-background-color);
              font-family: var(--mr-font-stack);
              position: relative;
              height: 100vh;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }


            .mr-message-bubble {
              margin: 0;
              display: inline-block;
              position: absolute;
              width: var(--mr-message-bubble-width);
              height: auto;
              background-color: var(--mr-message-bubble-bg-color);
              opacity: var(--mr-message-bubble-opacity);
              transform: scale(var(--mr-message-bubble-scale));
              transform-origin: var(--mr-message-bubble-transform-origin);
              transition: var(--mr-message-bubble-transition);
              visibility: hidden;
              margin-bottom: var(--mr-tb-btm);
              bottom:0;
              right:0;
              color: var(--mr-message-bubble-text-color);
              --mr-user-select: auto-user-select;
            }

            .mr-border {
              border: var(--mr-border-width) solid var(--mr-border-color);
            }

            .mr-round {
              border-radius: var(--mr-tb-radius);
            }

            .mr-tri-right.mr-border.mr-btm-right:before {
              content: ' ';
              position: absolute;
              width: 0;
              height: 0;
              left: auto;
              right: calc(var(--mr-border-width) * -1);
              bottom: calc(var(--mr-tb-radius) * -2);
              border: calc(var(--mr-border-width) * 4) solid;
              border-color: transparent var(--mr-border-color) transparent transparent;
            }

            .mr-tri-right.mr-btm-right:after {
              content: ' ';
              position: absolute;
              width: 0;
              height: 0;
              left: auto;
              right: 0px;
              bottom: calc(var(--mr-tb-radius) * -1);
              border: var(--mr-triangle-border-width) solid;
              border-color: var(--mr-message-bubble-bg-color) var(--mr-message-bubble-bg-color) transparent transparent;
            }

            .mr-msg-text {
              padding: 1em;
              text-align: left;
              line-height: 1.5em;
            }

            .mr-message-bubble.mr-open {
              opacity: 1;
              transform: scale(1);
              visibility: visible;
              transition-delay: 0s;
            }

            .mr-msg-text p {
              margin: 0;
            }

            .mr-a33 {
              position: absolute;
              top: auto;
              left: auto;
              bottom: 0px;
              right: 0px;
            }

            .mr-k33 {
              position: absolute;
              contain: size layout style;
              width: 100%;
              height: 100%;
              transform: translate(-50%, -100%);
            }


            .mr-button-container[class] button[class] {
              opacity: 0.8;

            }
            .mr-button-container[class] button[class]:hover {
              opacity: 1;
            }

            .mr-button-container.mr-clicked[class] button[class],
            .mr-button-container.mr-clicked[class] button[class]:hover {
              background-color: #616a8a;
              opacity:1;
            }

            .mr-button-container[class], .mr-button-container[class] button[class] {

              --mr-user-select: none;
              user-select: var(--mr-user-select);

            }


          `;

    const addCssText = () => {
      if (document.querySelector('#mr-style811')) return;
      const style = document.createElement('style');
      style.id = 'mr-style811';
      style.textContent = cssStyleText();
      document.head.appendChild(style);

    }


    const updateGMRecord = () => {

      Promise.resolve().then(() => {
        GM.setValue(GM_RECORD_KEY, jStringify({
          version: 1,
          records: messageRecords
        }));
      });

    }

    const updateMessageRecordsOnCurrentAccount = () => {
      messageRecordsOnCurrentAccount = messageRecords.filter(entry => entry.$account_uid === `${currentAccount}.${currentUser}`);
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

      updateMessageRecordsOnCurrentAccount();
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


      if (messageRecords.length > 3600 || __recordId_new > 3600) {
        // around 4MB
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

      let tObj = jParseCatched(newValue || '{}');
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
      updateMessageRecordsOnCurrentAccount();



    }

    const onAccountDetectedOrChanged = () => {

      updateMessageRecordsOnCurrentAccount();


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

    const getRequestQuotaString = () => {

      let num = null;

      if (document.documentElement.getAttribute('mr-request-model') === 'gpt-4') {


        num = messageRecordsOnCurrentAccount.filter(entry => {
          return typeof entry.model === 'string' && entry.model.startsWith('gpt-4') && (entry.$recorded_at || entry.$record_time_ms || 0) > (Date.now() - (6 * 1000 * 60) - message_cap_window * 60 * 1000)

        }).length;

        + ' out of ' + message_cap;

        let p1 = document.querySelector('#mr-msg-p1')
        let p2 = document.querySelector('#mr-msg-p2')

        if (p1 && p2) {
          p1.textContent = `${num}`
          p2.textContent = ' out of ' + message_cap;
        }


      } else if (document.documentElement.getAttribute('mr-request-model') === 'gpt-3') {



        num = messageRecordsOnCurrentAccount.filter(entry => {
          return typeof entry.model === 'string' && entry.model.startsWith('text-davinci-002-render-sha') && (entry.$recorded_at || entry.$record_time_ms || 0) > (Date.now() - (6 * 1000 * 60) - 24 * 60 * 60 * 1000)

        }).length;

        let p1 = document.querySelector('#mr-msg-p1')
        let p2 = document.querySelector('#mr-msg-p2')

        if (p1 && p2) {
          p1.textContent = `${num}`
          p2.textContent = ` in past 24 hours`;
        }




      } else {

        let p1 = document.querySelector('#mr-msg-p1')
        let p2 = document.querySelector('#mr-msg-p2')

        if (p1 && p2) {
          p1.textContent = '';
          p2.textContent = '';
        }

        // return '';
      }


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

      const model = typeof bodyObject.model === 'string' ? bodyObject.model : null;
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


      let request_model = '';
      if (typeof model === 'string' && (model === 'text-davinci-002-render-sha' || model.startsWith('text-davinci-002-render-sha'))) {


        request_model = 'gpt-3';
      } else if (typeof model === 'string' && (model === 'gpt-4' || model.startsWith('gpt-4'))) {

        request_model = 'gpt-4';

      }

      if (request_model) {


        try {
          document.documentElement.setAttribute('mr-request-model', request_model);
          getRequestQuotaString();
          document.documentElement.setAttribute('mr-request-state', 'request');
          document.querySelector('.mr-progress-bar').classList.add('mr-progress-bar-show');

        } catch (e) { }

        if (userOpenAction === null && attachedGroup && attachedGroup.isConnected === true && isChatBubbleOpened() === false) {
          const myGroup = attachedGroup;
          myGroupClicked(myGroup);
        }



      } else {


        try {
          document.documentElement.setAttribute('mr-request-model', '')
          getRequestQuotaString();
          document.querySelector('.mr-progress-bar').classList.remove('mr-progress-bar-show');

        } catch (e) { }



      }




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


        if (document.documentElement.getAttribute('mr-request-state') === 'response') document.documentElement.setAttribute('mr-request-state', '')


        console.log('messageHandler: onAbort', evt, signal, newChatId);
      };

      const uid = ++__uid;

      const onResponse = (response, info) => {

        const { requestTime, responseTime } = info;

        // response.lockedBodyStream.then((body) => {

        //   // console.log(13, body)

        // })

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

        if (document.documentElement.getAttribute('mr-request-state') === 'request') document.documentElement.setAttribute('mr-request-state', 'response')

        try {

          getRequestQuotaString();
        } catch (e) { }

        // console.log(bodyObject)
        // console.log(response, info)
        // console.log({
        //   message_cap, message_cap_window,
        //   categories,
        //   models
        // })

      }

      return {
        uid,
        model,
        conversation_id,
        message_cap, message_cap_window,
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

    const authJsonPn = function () {

      const target = this['$a039$'] || this;
      return new Promise((resolve, reject) => {
        // console.log(112)

        target.json().then((result) => {


          const __jsonRes__ = result;


          if (typeof (__jsonRes__ || 0).user === 'object' && (__jsonRes__.user || 0).id) {
            currentUser = `${(__jsonRes__.user || 0).id}`;
            // console.log('user??', currentUser)
            // __NEXT_DATA__.props.pageProps.user.id // document.cookie.__puid
          }


          // console.log(566, result)
          resolve(result)
        }).catch(reject)

      })
    }

    const jsonPnForGetRequest = function () {

      const target = this['$a039$'] || this;
      return new Promise((resolve, reject) => {

        target.json().then((result) => {


          const __jsonRes__ = result;



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
          else if (((__jsonRes__ || 0).categories || 0).length >= 1 && ((__jsonRes__ || 0).models || 0).length >= 1) {

            const jsonRes = __jsonRes__;


            try {

              categories = [...jsonRes.categories];
            } catch (e) { }
            try {
              models = [...jsonRes.models];

            } catch (e) { }

            // console.log(233, categories, models)

          }




          // console.log(544, result)
          resolve(result)
        }).catch(reject)

      })
    };

    const message_limit_jsonPn = function () {

      const target = this['$a039$'] || this;
      return new Promise((resolve, reject) => {


        // console.log(114)
        target.clone().text().then(r => {

          // console.log(r)
          let jr = jParseCatched(r);
          if (jr) {

            if (jr.message_cap > 0 && jr.message_cap_window > 0) {
              message_cap = +jr.message_cap;
              message_cap_window = +jr.message_cap_window;
            }

          }

        })

        target.json().then((result) => {

          // console.log(result)
          resolve(result)
        }).catch(reject)

      })
    };

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

          // console.log(269, false, args[0], Object.assign({}, args[1] || {}))




          let rType = 0;


          if (typeof args[0] === 'string' && args[0].includes('/') && args[1] && args[1].method === 'GET') {
            rType = 1;
          } else if (args[0].includes('/api/auth/session')) {
            rType = 2;
          }


          actualRequest.then((result) => {

            if (rType > 0) {
              result = new Proxy(result, {
                get(target, key, receiver) {
                  if (key === '$a039$') return target;
                  const r = target[key];
                  if (key === 'json' && key in target) {


                    if (typeof r === 'function') {

                      if (rType === 1) {

                        if (typeof args[0] === 'string' && args[0].includes('/conversation_limit') && args[1] && args[1].method === 'GET') {
                          return message_limit_jsonPn;
                        } else {

                          return jsonPnForGetRequest;
                        }
                      }
                      else if (rType === 2) {


                        return authJsonPn;


                      }


                    }
                  }
                  if (typeof r === 'function') {

                    return (receiver['$b031$' + key] || (receiver['$b031$' + key] = ((r) => (function () { return r.apply(this['$a039$'] || this, arguments) }))(r)));

                  }
                  return r;

                }
              });
            }
            //   console.log(result)
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

        // console.log(269, true, args[0], Object.assign({}, args[1] || {}))






        actualRequest.then((result) => {
          const responseTime = Date.now();

          let mBodyResolve = null;
          const mBody = new Promise(r => {
            mBodyResolve = r;
          });

          const pRes = new Proxy(result, {
            get(target, property, receiver) {
              if (property === '$a039$') return target;
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
              } else if (typeof r === 'function') {


                return (receiver['$b031$' + property] || (receiver['$b031$' + property] = ((r) => (function () { return r.apply(this['$a039$'] || this, arguments) }))(r)));

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

    const xpathExpression = '//div[normalize-space(text())="?"][contains(@class, "h-") and contains(@class, "w-")]';
    let observer = null;
    let mct = 0;
    let wType = 0;

    let attachedGroup = null;


    function openChatBubble() {
      const chatBubble = document.querySelector(".mr-message-bubble");
      if (!chatBubble) return;
      chatBubble.classList.add('mr-open');
    }

    function isChatBubbleOpened() {
      const chatBubble = document.querySelector(".mr-message-bubble");
      if (!chatBubble) return null;
      return chatBubble.classList.contains('mr-open');
    }

    function closeChatBubble() {
      const chatBubble = document.querySelector(".mr-message-bubble");
      if (!chatBubble) return;
      chatBubble.classList.remove('mr-open');
    }


    const myGroupClicked = (myGroup) => {



      const chatBubble = document.querySelector(".mr-message-bubble");
      if (!chatBubble) return null;

      const msgP = document.querySelector("#mr-msg-p1");
      if (!msgP || msgP.firstChild === null) return null;

      if (!chatBubble.classList.contains('mr-open')) {
        myGroup.classList.add('mr-clicked');
        openChatBubble()

        return true;

      } else {

        myGroup.classList.remove('mr-clicked');
        closeChatBubble();

        return false;
      }
      return null;

    }

    /** @param {HTMLElement} myGroup */
    const setupMyGroup = (myGroup) => {

      addCssText();

      const buttonText = document.evaluate(xpathExpression, myGroup, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      buttonText.textContent = '\u{1F4D9}';



      const placeholder = document.createElement('div');

      placeholder.classList.add('mr-k33');
      placeholder.innerHTML = `
              <div class="mr-message-bubble mr-tri-right mr-round mr-border mr-btm-right">
              <div class="mr-msg-text">
                  <p id="mr-msg-l">count(messages)</p>
                  <p id="mr-msg-p"><span id="mr-msg-p1"></span><span id="mr-msg-p2"></span></p>
                <p class="mr-progress-bar"></p>
              </div>
            </div>

              `
      myGroup.classList.add('mr-button-container');


      myGroup.insertBefore(placeholder, myGroup.firstChild);






      myGroup.addEventListener('click', function (evt) {



        if (!evt || !evt.target) return;
        if (evt.target.closest('.mr-k33')) return;

        const myGroup = this;


        const chatBubble = document.querySelector(".mr-message-bubble");
        if (!chatBubble) return;


        let clickedResult = myGroupClicked(myGroup);
        if (typeof clickedResult === 'boolean') {

          if (evt.isTrusted === true) {

            if (clickedResult) {
              userOpenAction = true;

            } else {

              userOpenAction = false;
            }
          }
        }



      })


    }

    const onElementFound = (matchedElement) => {



      let group = matchedElement.closest('.group');
      if (!group) {
        console.log('The group parent of Question Mark Button cannot be found.')
        return;
      }
      let groupParent = group;
      let level = 0;
      while (groupParent && groupParent.nextSibling === null && groupParent.previousSibling === null && (groupParent.parentNode instanceof HTMLElement)) {

        groupParent = groupParent.parentNode;

        if (++level === 1) {
          groupParent.style.columnGap = '6px';
        }


        groupParent.classList.remove('flex-col');
        groupParent.classList.add('flex-row');

        groupParent.style.display = 'inline-flex'


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

        requestAnimationFrame(() => {

          setTimeout(function () {
            if (!observer) return;
            if (wType > 0) return;
            console.log('The Question Mark Button cannot be found.')
            observer.disconnect();
            observer.takeRecords();
            observer = null;
          }, 1200);

        })

      };
      requestAnimationFrame(tf)
    }

    if (document.readyState !== 'loading') {
      onReady();
    }

    window.addEventListener('load', onReady, false);



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