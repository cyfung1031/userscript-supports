// ==UserScript==
// @name                Unhold YouTube Resource Locks
// @name:en             Unhold YouTube Resource Locks
// @name:ja             Unhold YouTube Resource Locks
// @name:zh-TW          Unhold YouTube Resource Locks
// @name:zh-CN          Unhold YouTube Resource Locks
// @namespace           http://tampermonkey.net/
// @version             2022.12.27.3
// @license             MIT License
// @description         Release YouTube's used IndexDBs & Disable WebLock to make background tabs able to sleep
// @description:en      Release YouTube's used IndexDBs & Disable WebLock to make background tabs able to sleep
// @description:ja      YouTube の 使用済みIndexDB を解放し、WebLock を無効にして、バックグラウンドページを休止状態になるように
// @description:zh-TW   釋放 YouTube 用過的 IndexDBs 並禁用 WebLock 讓後台頁面能進入休眠
// @description:zh-CN   释放 YouTube 用过的 IndexDBs 并禁用 WebLock 让后台页面能进入休眠
// @author              CY Fung
// @match               https://www.youtube.com/*
// @match               https://www.youtube.com/embed/*
// @match               https://www.youtube-nocookie.com/embed/*
// @match               https://www.youtube.com/live_chat*
// @match               https://www.youtube.com/live_chat_replay*
// @match               https://music.youtube.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/youtube-unlock-indexedDB.png
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames
// @inject-into page
// ==/UserScript==

/* jshint esversion:8 */

const DEBUG_LOG = false;
const DB_NAME_FOR_TESTING = 'testdb-Q4IOpq0p'
let runCount = 0;
let initialChecking = null;
const isSupported = (function (console, consoleX) {
  'use strict';
  let [window] = new Function('return [window];')(); // real window object

  if (typeof (((window||0).navigator||0).locks||0).request === 'function') {
    // disable WebLock
    // WebLock is just an experimental feature and not really required for YouTube
    window.navigator.locks.query = function () {
      console.log(arguments)
      return new Promise(resolve => {
        // do nothing
      });
    };
    window.navigator.locks.request = function () {
      console.log(arguments)
      return new Promise(resolve => {
        // do nothing
      });
    };
  }

  const isSupported = (((window || 0).indexedDB || 0).constructor || 0).name === 'IDBFactory' && typeof requestIdleCallback === 'function'
  if (isSupported) {
    const addEventListenerKey = Symbol();
    const removeEventListenerKey = Symbol();
    const openKey = Symbol();
    const funcHooks = new WeakMap();
    let openCount = 0;

    const msgStore = [];
    let messageDisplayCId = 0;
    const message = (message) => {
      msgStore.push(message);
      if (openCount === 0 && msgStore.length > 0) {
        if (messageDisplayCId > 0) {
          clearTimeout(messageDisplayCId);
          messageDisplayCId = 0;
        }
        messageDisplayCId = setTimeout(() => {
          messageDisplayCId = 0;
          if (openCount === 0 && msgStore.length > 0) {
            let messages = [...msgStore];
            msgStore.length = 0;
            messages.sort((a, b) => a.databaseId.localeCompare(b.databaseId) || a.time - b.time);
            consoleX.dir(messages)
          }
        }, 300);
      }
    };
    const mTime = Date.now()
    function releaseOnIdle(db, databaseId, eventType, event_type) {
      setTimeout(() => {
        requestIdleCallback(() => {
          Promise.resolve(db).then((db) => {
            DEBUG_LOG && console.log(db, databaseId, eventType, event_type);
            db.close();
            db = null;
            openCount--;
            message({ databaseId: databaseId, action: 'close', time: Date.now() });
            runCount++;
            if (runCount > 1e9) runCount = 0;
          }).catch(consoleX.warn);
          db = null;
        }, { timeout: 600 });
      }, 1200);
    }

    function makeHandler(handler, databaseId, eventType) {
      return function (event) {
        DEBUG_LOG && console.log(32, 'addEventListener', databaseId, eventType, event.type);
        handler.call(this, arguments);
        releaseOnIdle(event.target.result, databaseId, eventType, event.type);
        DEBUG_LOG && console.log(441, 'addEventListener', databaseId, eventType, event.type);
      }
    }

    function makeAddEventListener(databaseId) {
      return function (eventType, handler) {
        const addEventListener = this[addEventListenerKey];
        if (arguments.length !== 2) return addEventListener.call(this, ...arguments);
        if (eventType === 'error' || eventType === 'success') {
          DEBUG_LOG && console.log(31, databaseId, eventType);
          let gx = funcHooks.get(handler);
          if (!gx) {
            gx = makeHandler(handler, databaseId, eventType); // databaseId and eventType are just for logging; not reliable
            funcHooks.set(handler, gx);
          }
          return addEventListener.call(this, eventType, gx);
        }
        return addEventListener.call(this, ...arguments);
      }
    }

    function makeRemoveEventListener(databaseId) {
      return function (eventType, handler) {
        const removeEventListener = this[removeEventListenerKey];
        if (arguments.length !== 2) return removeEventListener.call(this, ...arguments);
        if (eventType === 'error' || eventType === 'success') {
          let gx = funcHooks.get(handler);
          DEBUG_LOG && console.log(30, 'removeEventListener', databaseId, eventType);
          let ret = removeEventListener.call(this, eventType, gx || handler);
          DEBUG_LOG && console.log(442, 'removeEventListener', databaseId, eventType);
          return ret;
        }
        return removeEventListener.call(this, ...arguments);
      }
    }

    function makeOpen() {
      return function (databaseId) {
        initialChecking && initialChecking();
        let request = this[openKey](databaseId); // IDBRequest
        request[addEventListenerKey] = request.addEventListener;
        request.addEventListener = makeAddEventListener(databaseId);
        request[removeEventListenerKey] = request.removeEventListener;
        request.removeEventListener = makeRemoveEventListener(databaseId);
        openCount++
        message({ databaseId: databaseId, action: 'open', time: Date.now() });
        return request;
      }
    }
    window.indexedDB.constructor.prototype[openKey] = window.indexedDB.constructor.prototype.open;
    window.indexedDB.constructor.prototype.open = makeOpen();

  }
  console.log(22)

  return isSupported

})(DEBUG_LOG ? console : Object.assign({}, console, { log: function () { } }), console);

initialChecking = isSupported ? function () {
  initialChecking = null;
  let request = indexedDB.open(DB_NAME_FOR_TESTING);
  let mi = 0;
  let px = function () {
    mi += 1000;
  };
  request.addEventListener('success', px);
  request.addEventListener('success', function () {
    mi += 101;
  });
  request.addEventListener('error', px);
  request.addEventListener('error', function () {
    mi += 201;
  });
  request.removeEventListener('success', px);
  request.removeEventListener('error', px);

  indexedDB.deleteDatabase(DB_NAME_FOR_TESTING);

  setTimeout(() => {
    Promise.resolve(0).then(() => {
      if ((mi === 101 || mi === 201) && runCount >= 1) {
        console.log(`%cYouTube Unhold IndexDB - %cInjection Success ${mi} ${runCount}`, 'background: #222; color: #fff', 'background: #222; color: #bada55');
      } else {
        console.log(`%cYouTube Unhold IndexDB - %cInjection Failure ${mi} ${runCount}`, 'background: #222; color: #fff', 'background: #222; color: #da5a2f');
      }
    }).catch(console.warn);
  }, 3600);

} : null;