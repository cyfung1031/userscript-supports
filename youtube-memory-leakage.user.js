// ==UserScript==
// @name                YouTube Memory Leakage Script
// @version             0.0.002
// @license             MIT
// @namespace           UserScript
// 1 @match               https://www.youtube.com/live_chat*
// 1 @match               https://www.youtube.com/live_chat_replay*
// 2 @match               https://www.youtube.com/*
// @match               https://*/*
// @author              CY Fung
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
//
// @compatible          firefox Violentmonkey
// @compatible          firefox Tampermonkey
// @compatible          firefox FireMonkey
// @compatible          chrome Violentmonkey
// @compatible          chrome Tampermonkey
// @compatible          opera Violentmonkey
// @compatible          opera Tampermonkey
// @compatible          safari Stay
// @compatible          edge Violentmonkey
// @compatible          edge Tampermonkey
// @compatible          brave Violentmonkey
// @compatible          brave Tampermonkey
//
// @description         for YouTube Memory Leakage
//
// ==/UserScript==


(() => {

  // possible leakage in ytd-engagement-panel-section-list-renderer
  // ytd-section-list-renderer
  // yt-img-shadow
  // "ytd-engagement-panel-section-list-renderer",
  // "yt-live-chat-viewer-engagement-message-renderer"



  const listOfPatchingTrue = new Set();
  const listOfPatchingFalse = new Set();

  const placeHolderReplacements = new Set(
    [
      // 'yt-attributed-string', 'yt-live-chat-ticker-paid-message-item-renderer', 'yt-live-chat-ticker-sponsor-item-renderer'
    ]
  );


  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  const createPlaceHolderClass = () => {
    // buggy


    class placeHolderClass extends HTMLElement {
      constructor() {
        super();
      }
    }
    return placeHolderClass;
  }


  (() => {


    const DEBUG_show_El0 = false; // El0 would not be able to GC
    const DEBUG_show_vdIZE = false;
    const DEBUG_show_cannotGC = false;
    const DEBUG_show_checker = false;

    const DEBUG_no_walker = false;
    const DEBUG_no_cleanChildren = false;
    const DEBUG_no_collectionCleanup = false;
    const DEBUG_no_laterRemoval = false;
    const DEBUG_no_setToDeadFn = false;

    const skipObjects = new WeakSet();
    const constructors = new WeakMap();
    const deadTree = new WeakSet();
    const walked = new WeakSet();

    const listOfConnect = new Set();
    const listOfDisconnect = new Set();


    skipObjects.add(Function);
    skipObjects.add(Object);

    const c66 = {};
    const f66 = function(){};

    const Promise = (async () => { })().constructor;

    class EmptyElement extends HTMLElement {

    }


    class EmptyNode extends Node {

    }

    const nativeDFAppend = DocumentFragment.prototype.__shady_native_append || DocumentFragment.prototype.append;

    const nativeElmAppend = Element.prototype.__shady_native_append || EmptyElement.prototype.append || Element.prototype.append;

    const nativeElmRemoveSelf = EmptyElement.prototype.remove || Element.prototype.remove;


    const isConnectedFn = Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected').get;

    const createDF = () => {
      try {
        return new DocumentFragment();
      } catch (e) { }
      return document.createDocumentFragment();
    }

    const { dummyObtain, d66Element } = (() => {



      const d66Object = {}
      const d66Element = document.createElement('noscript');
      const d66Function = function () { }

      const dummyObtain = (x) => {
        if (!x) return x;
        if (typeof x === 'function') return d66Function;
        if (typeof x === 'object') {
          if (x instanceof Node) return d66Element;
          return d66Object;
        }
        return 1;
      }


      nativeDFAppend.call(createDF(), d66Element);

      return { dummyObtain, d66Element };

    })();

    const collection = new Set();

    const myObjectList = window.myObjectList = new Set();


    const detachedNodes = new Set();

    const listA = window.listA = [];
    let lastLog = 0;

    listA.log = function (...args) {
      listA.push(args)
      if (listA.length > 0 && Date.now() - lastLog > 5000) {
        lastLog = Date.now();
        Promise.resolve(() => {
          lastLog = Date.now();
          const p = listA.slice();
          listA.length = 0;
          console.log(p)
          lastLog = Date.now();
        });
      }
    }

    const selfMap = new WeakMap();

    function onDetachedNodesAdded(wNode) {
      const node = wNode?.deref();
      if (!node) return;
      if (!isTrueElement(node)) return;
      if ((node instanceof EmptyElement)) return;
      // if(node.nodeName.split('-').length < 2 && !node.nodeName.includes('yt')) return;
      // if(node.nodeName.length < 15 && !(node.is ||'').includes('-') ) return;
      // if((node.nodeName.length < 15 && node.nodeName.length >= 8) || (node.nodeName.length < 7 && node.nodeName >=5) || (node.nodeName < 5) ) return; // XXXXX
      myObjectList.add(wNode);
    }


    function onDetachedNodesRemoved(wNode) {

    }



    const pDefine = customElements.define;

    const detectedInfoMap = new WeakMap();

    const setupHClass = (HClass) => {

      const pConnectedCallback = HClass.prototype.connectedCallback || function () { };

      const pDisconnectedCallback = HClass.prototype.disconnectedCallback || function () { };

      const aConnectedCallback = (elm) => {


        if (isTrueElement(elm)) {
          listOfConnect.add(elm.nodeName.toLowerCase());

          let p = elm;

          while ((p = p.constructor) && !skipObjects.has(p)) {
            skipObjects.add(p);
          }
          p = elm?.constructor?.prototype;
          p && skipObjects.add(p);


          if (!selfMap.has(elm)) selfMap.set(elm, new WeakRef(elm));
          collection.add(selfMap.get(elm));



          detectedInfoMap.delete(elm);
        }

      }


      const aDisconnectedCallback = async (elm) => {


        if (isTrueElement(elm)) {
          listOfDisconnect.add(elm.nodeName.toLowerCase());

          let p = elm;

          while ((p = p.constructor) && !skipObjects.has(p)) {
            skipObjects.add(p);
          }
          p = elm?.constructor?.prototype;
          p && skipObjects.add(p);

          if (!selfMap.has(elm)) selfMap.set(elm, new WeakRef(elm));
          const wNode = selfMap.get(elm);
          if (!detachedNodes.has(wNode)) {
            detachedNodes.add(wNode);
            onDetachedNodesAdded(wNode);
          }
          detectedInfoMap.set(elm, Date.now());

        }

      }

      HClass.prototype.connectedCallback = function () {
        if (deadTree.has(this)) return;
        /*
        if(deadTree.has(this)){
          console.log('deadTree connectedCallback', this)
        }
        let wConstructor = constructors.get(this);
        if (!wConstructor) {
          constructors.set(this, wConstructor = new WeakRef(this.constructor))
        }
        const ctr = wConstructor?.deref();
        if (ctr && ctr !== this.constructor) Object.setPrototypeOf(this, ctr.prototype);
        */
        Promise.resolve(this).then(aConnectedCallback);
        try {
          return pConnectedCallback.call(this);
        } catch (e) { }
      }
      HClass.prototype.disconnectedCallback = function () {
        if (deadTree.has(this)) return;
        /*
        if(deadTree.has(this)){
          console.log('deadTree disconnectedCallback', this)
        }
        let wConstructor = constructors.get(this);
        if (!wConstructor) {
          constructors.set(this, wConstructor = new WeakRef(this.constructor))
        }
        const ctr = wConstructor?.deref();
        if (ctr && ctr !== this.constructor) Object.setPrototypeOf(this, ctr.prototype);
        */
        Promise.resolve(this).then(aDisconnectedCallback);
        try {
          return pDisconnectedCallback.call(this);
        } catch (e) { }
      }

    }
    setupHClass(HTMLElement);


    customElements.define = function (a, b, c = undefined) {
      if (placeHolderReplacements.has(a)) {
        b = createPlaceHolderClass();
        c = undefined;
      }
      let p = b;
      do {
        skipObjects.add(p);
      } while ((p = p.constructor) && !skipObjects.has(p))
      b.prototype && skipObjects.add(b.prototype);
      setupHClass(b);
      return pDefine.call(this, a, b, c);
    }




    const forceGC = async () => {

      return await Promise.resolve().then(() => {
        const sCkww = window.sCkww = new Array(40001);
        sCkww[0] = Math.random();
        sCkww[10001] = Math.random();
        sCkww[20001] = Math.random();
        sCkww[30001] = Math.random();
        sCkww[40001] = Math.random();
      }).then(() => {
        const sCkww = window.sCkww;
        sCkww.push(1, ...sCkww, 3);
        if (sCkww[40001] + sCkww[0] > 1) sCkww.push(4);
      }).then(() => {
        const sCkww = window.sCkww;
        const n = sCkww.length;
        sCkww.length = 0;
        return n;
      });
    }

    const laterRemovals = new Set();



    const cleanChildren = (r) => {
      if (DEBUG_no_cleanChildren) return;

      if (!r || typeof r !== 'object') return;

      if (!isTrueElement(r)) return;
      let idc = null;
      try {
        idc = isConnectedFn.call(r);
      } catch (e) { }
      if (idc !== false) return;

      try {

        r.replaceChildren()
      } catch (e) { }



      // dummyNoscript.appendChild(r);
      try {
        // nativeElmAppend.call(dummyNoscript, r);
        const fragment = createDF();
        nativeDFAppend.call(fragment, r);
        fragment.replaceChildren();

      } catch (e) { }
    }




    let needCollectionCleanup = false;
    const collectionCleanup = async () => {

      if (DEBUG_no_collectionCleanup) return;

      const t1 = performance.now();
      let tq = t1;

      const f = (qNode) => walker(qNode, walked);

      for (const wQNode of collection) {


        const qNode = wQNode?.deref();
        if (!qNode || walked.has(qNode)) {
          collection.delete(wQNode);
          continue;
        }

        await Promise.resolve(qNode).then(f);


        if (performance.now() - tq > 6) {
          tq = performance.now()
          await Promise.resolve();
          tq = performance.now()
        }

      }



      const t2 = performance.now();

      if (t2 - t1 > 1) {
        listA.log('3782 cc', t2 - t1)

      }

    }

    const WALK_ARRAY_WITH_ITERATOR_ONLY = true;

    const isArrayFn = (obj) => {

      try {

        return obj && obj[Symbol.iterator] && obj.length >= 0 && typeof obj.splice === 'function';
      } catch (e) { }


      return false;
    }

    const isTrueElement = (v) => {
      if (v instanceof HTMLElement) {
        try {
          if (typeof v.nodeName === 'string') return true;
        } catch (e) { }
      }
      return false;
    }

    const walker = (obj, em) => {
      if (DEBUG_no_walker) return;
      // return;
      if (!obj) return;
      if (obj[Symbol.iterator] && (obj.constructor || 0).BYTES_PER_ELEMENT >= 1) return;
      if (obj instanceof NodeList || obj instanceof HTMLCollection || obj instanceof NodeIterator || obj instanceof DocumentFragment || obj instanceof Document) return;
      if (skipObjects.has(obj)) return;
      if (em.has(obj)) return;
      em.add(obj);
      const isArray = isArrayFn(obj);
      if (WALK_ARRAY_WITH_ITERATOR_ONLY && isArray) {

        let i = -1;
        for (const v of obj) {

          i++;
          if (!v) continue;
          if (typeof v === 'object' || typeof v === 'function') {
            walker(v, em);
            if (v instanceof EmptyElement) {
              obj[i] = d66Element;
            } else if (isTrueElement(v) && deadTree.has(v)) {
              obj[i] = dummyObtain(v);
            }
          }

        }

      }
      const pdEntries = Object.entries(Object.getOwnPropertyDescriptors(obj));
      for (const [k, pd] of pdEntries) {
        if (k in c66) continue;
        if (typeof pd.get === 'function') continue;
        const v = pd.value;
        if (!v) continue;
        if (typeof v === 'object' || typeof v === 'function') {
          walker(v, em);
          if (v instanceof EmptyElement) {

            if (isArray && k < obj.length && pd.writable === true) {
              obj[k] = d66Element;
            } else if (pd.configurable === true) {
              delete obj[k];
              obj[k] = d66Element;
            }

          } else if (isTrueElement(v) && deadTree.has(v)) {

            if (isArray && k < obj.length && pd.writable === true) {
              obj[k] = dummyObtain(v);
            } else if (pd.configurable === true) {
              delete obj[k];
              obj[k] = dummyObtain(v);
            }
          }
        }

      }
    }

    const objClean = (obj) => {
      // return;


      if (!obj) return;
      if (obj[Symbol.iterator] && (obj.constructor || 0).BYTES_PER_ELEMENT >= 1) return;
      if (obj instanceof NodeList || obj instanceof HTMLCollection || obj instanceof NodeIterator || obj instanceof DocumentFragment || obj instanceof Document) return;
      if (skipObjects.has(obj)) return;
      const isArray = isArrayFn(obj);
      if (isArray) {
        obj.length = 0;
      }

      const pdEntries = Object.entries(Object.getOwnPropertyDescriptors(obj));
      for (const [k, pd] of pdEntries) {
        if (k in c66) continue;

        const v = pd.value;

        if (v && (typeof v === 'object' || typeof v === 'function')) {

          if (pd.configurable === true) {
            delete obj[k];
            obj[k] = dummyObtain(v)
          } else if (pd.writable === true) {
            obj[k] = dummyObtain(v);

          }

        }


      }

    }



    const collectionCleanup_ = (obj, em) => {
      // return;
      if (!obj) return;
      if (obj[Symbol.iterator] && (obj.constructor || 0).BYTES_PER_ELEMENT >= 1) return;
      if (obj instanceof NodeList || obj instanceof HTMLCollection || obj instanceof NodeIterator || obj instanceof DocumentFragment || obj instanceof Document) return;
      if (skipObjects.has(obj)) return;
      if (em.has(obj)) return;
      em.add(obj);
      const isArray = isArrayFn(obj);
      if (WALK_ARRAY_WITH_ITERATOR_ONLY && isArray) {

        let i = -1;
        for (const v of obj) {

          i++;
          if (!v) continue;
          if (typeof v === 'object' || typeof v === 'function') {
            collectionCleanup_(v, em);
            if (v instanceof EmptyElement) {
              obj[i] = d66Element;
            }
          }

        }

      }
      const pdEntries = Object.entries(Object.getOwnPropertyDescriptors(obj));
      for (const [k, pd] of pdEntries) {
        if (k in c66) continue;
        if (typeof pd.get === 'function') continue;
        const v = pd.value;
        if (!v) continue;
        if (typeof v === 'object' || typeof v === 'function') {
          collectionCleanup_(v, em);
          if (v instanceof EmptyElement) {

            if (isArray && k < obj.length && pd.writable === true) {
              obj[k] = d66Element;
            } else if (pd.configurable === true) {
              delete obj[k];
              obj[k] = d66Element;
            }
          }
        }

      }
    }

    const diMap = new WeakMap();
    const getDI = (o) => {

      if (!o) return null;
      return diMap.get(o) || null;
    }
    const setDI = (o, v) => {
      if (v === null) diMap.delete(o);
      diMap.set(o, v);
      return v;
    }


    const setToDeadFn = (r) => {
      if (DEBUG_no_setToDeadFn) return;

      const t1 = performance.now();

      if (!r || typeof r !== 'object') return;

      if (!isTrueElement(r)) return;
      let idc = null;
      try {
        idc = isConnectedFn.call(r);
      } catch (e) { }
      if (idc !== false) return;

      r.__my_parents__ = '';
      try {

        let pn = r;
        while (pn = pn.parentNode) {
          r.__my_parents__ += '|' + (pn?.nodeName?.toLowerCase() || "NONE");
        }
        r.__my_parents__ = r.__my_parents__.substring(1);
      } catch (e) { }


      r.__html__ = '';
      try {
        r.__html__ = r.outerHTML;
      } catch (e) { }



      if (typeof r.is === 'string') {

        const cnt = insp(r);
        const pds = Object.getOwnPropertyDescriptors(cnt);

        if(cnt && typeof cnt.unregisterActionRouterEventListeners_ === 'function'){
          try{
          cnt.unregisterActionRouterEventListeners_();
          }catch(e){}
        }

        if(cnt && typeof cnt.removeMouseEventHandlers_ === 'function'){
          try{
            cnt.removeMouseEventHandlers_();
          }catch(e){}
        }


        if(cnt && typeof cnt._removeEventListenerFromNode === 'function'){
          try{
            cnt._removeEventListenerFromNode();
          }catch(e){}
        }

        if(cnt && typeof cnt._unlistenKeyEventListeners === 'function'){
          try{
            cnt._unlistenKeyEventListeners();
          }catch(e){}
        }

        if(cnt && typeof cnt._unsubscribeIronResize === 'function'){
          try{
            cnt._unsubscribeIronResize();
          }catch(e){}
        }

        if (cnt && typeof cnt.boundOnStamperFinished === 'function') {

          try {

            cnt.hostElement.removeEventListener("yt-rendererstamper-finished", cnt.boundOnStamperFinished);
          } catch (e) { }
          try {

            cnt.hostElement.removeEventListener("yt-renderidom-finished", cnt.boundOnStamperFinished);
          } catch (e) { }

        }


        if (cnt && typeof cnt.boundOnTouchStart === 'function') {

          try {

            cnt.hostElement.removeEventListener("touchstart", cnt.boundOnTouchStart);
          } catch (e) { } 

        }



        if (cnt && typeof cnt._boundOnFocus === 'function') {

          try {

            cnt.hostElement.removeEventListener("focus", cnt._boundOnFocus);
          } catch (e) { } 

        }

        if (cnt && typeof cnt._boundOnBlur === 'function') {

          try {

            cnt.hostElement.removeEventListener("blur", cnt._boundOnBlur);
          } catch (e) { } 

        }
        if (cnt && typeof cnt._boundOnDescendantIronResize === 'function') {

          try {

            cnt.hostElement.removeEventListener("iron-resize", cnt._boundOnDescendantIronResize);
          } catch (e) { } 

        }




        if (cnt && typeof cnt._boundFocusBlurHandler === 'function') {

          try {

            cnt.hostElement.removeEventListener("focus", cnt._boundFocusBlurHandler);
          } catch (e) { } 

        }



        if (cnt && typeof cnt._boundFocusBlurHandler === 'function') {

          try {

            cnt.hostElement.removeEventListener("blur", cnt._boundFocusBlurHandler);
          } catch (e) { } 

        }


        if (cnt && typeof cnt._boundScrollHandler === 'function') {

          try {

            cnt.hostElement.removeEventListener("scroll", cnt._boundScrollHandler);
          } catch (e) { } 

        }





        if (cnt && typeof cnt._boundSchedule === 'function') {

          try {

            cnt.hostElement.removeEventListener("slotchange", cnt._boundSchedule);
          } catch (e) { } 

        }


        if (cnt && typeof cnt._boundNotifyResize === 'function') {

          try {

            cnt.hostElement.removeEventListener("resize", cnt._boundNotifyResize);
          } catch (e) { } 

        }


        if (cnt && typeof cnt._boundEscKeydownHandler === 'function') {

          try {

            document.removeEventListener("keydown", cnt._boundEscKeydownHandler);
          } catch (e) { } 

        }






        if (pds?._holdJob?.writable === true && cnt._holdJob > 0) {
          clearInterval(cnt._holdJob);
        }


        if (pds?.refreshIntervalTimerId?.writable === true && cnt.refreshIntervalTimerId > 0 && typeof cnt.updateTime ==='function') {
          clearInterval(cnt.refreshIntervalTimerId);
        }
        if (pds?.scrollInterval_?.writable === true && cnt.scrollInterval_ > 0 && typeof cnt.endWindowScroll_ === 'function') {
          clearInterval(cnt.scrollInterval_);
        }
        if (pds?.watchEndpointStartTimeUpdaterInterval?.writable === true && cnt.watchEndpointStartTimeUpdaterInterval > 0 && typeof cnt.endStartTimeUpdater === 'function') {
          clearInterval(cnt.watchEndpointStartTimeUpdaterInterval);
        }
        if (pds?.playbackPauseInterval?.writable === true && cnt.playbackPauseInterval > 0 && typeof cnt.pausePlayer === 'function') {
          clearInterval(cnt.playbackPauseInterval);
        }
        if (pds?.timerId_?.writable === true && cnt.timerId_ > 0 && typeof cnt.disposeInternal === 'function') {
          clearInterval(cnt.timerId_);
        }


        if (pds?.playPingTimerId?.writable === true && cnt.playPingTimerId > 0) {
          clearInterval(cnt.playPingTimerId);
        }

        if(cnt && typeof cnt.unsubscribe_ ==='function'){
          cnt.unsubscribe_();
        }

        if (cnt && typeof cnt.unobserve_ === 'function') {
          cnt.unobserve_();
          cnt.visibilityObserverForChild_ = cnt.localVisibilityObserver_ = null
        }

        if (cnt && typeof cnt.actionHandlerBehavior !== 'undefined' && typeof cnt.actionHandlerBehavior?.unregisterActionMap === 'function') {

          try {
            cnt.behaviorActionMap && cnt.actionHandlerBehavior.unregisterActionMap(cnt.behaviorActionMap)
          } catch (e) { }

          try {
            cnt.behaviorActionMap_ && cnt.actionHandlerBehavior.unregisterActionMap(cnt.behaviorActionMap_)
          } catch (e) { }

        }


        if (cnt && typeof cnt.unregisterActionMap === 'function') {

          try {
            cnt.behaviorActionMap && cnt.unregisterActionMap(cnt.behaviorActionMap)
          } catch (e) { }

          try {
            cnt.behaviorActionMap_ && cnt.unregisterActionMap(cnt.behaviorActionMap_)
          } catch (e) { }

        }


        if(cnt && typeof cnt.cancelTimeout_ ==='function'){
          cnt.cancelTimeout_();
        }

        if (pds?.rafId?.writable === true && typeof cnt.rafId === 'number' && cnt.rafId >= 1) {
          window.cancelAnimationFrame(cnt.rafId);
          // cnt.rafId = 0;
        }
        if (pds?.scrollClampRaf?.writable === true && typeof cnt.scrollClampRaf === 'number' && cnt.scrollClampRaf >= 1) {
          window.cancelAnimationFrame(cnt.scrollClampRaf);
          // cnt.scrollClampRaf = 0;
        }
        if (pds?.asyncHandle?.writable === true && typeof cnt.asyncHandle === 'number' && cnt.asyncHandle >= 1) {
          window.cancelAnimationFrame(cnt.asyncHandle);
          // cnt.asyncHandle = 0;
        }
        if (pds?.__openedRaf?.writable === true && typeof cnt.__openedRaf === 'number' && cnt.__openedRaf >= 1) {
          window.cancelAnimationFrame(cnt.__openedRaf);
          // cnt.__openedRaf = null;
        }
        if (pds?.scrollHandler?.writable === true && typeof cnt.scrollHandler === 'number' && cnt.scrollHandler >= 1) {
          window.cancelAnimationFrame(cnt.scrollHandler);
          // cnt.scrollHandler = 0;
        }
        if (pds?.intersectRAF?.writable === true && typeof cnt.intersectRAF === 'number' && cnt.intersectRAF >= 1) {
          window.cancelAnimationFrame(cnt.intersectRAF);
          // cnt.intersectRAF = 0;
        }
        
        if(cnt && typeof cnt.disposeInternal === 'function'){
          try{
            cnt.disposeInternal();
          }catch(e){}
        }

        if(cnt && typeof cnt.dispose === 'function'){
          try{
            cnt.dispose();
          }catch(e){}
        }


        if (pds?._interestedResizables?.writable === true && typeof (cnt._interestedResizables||0) === 'object' && cnt._interestedResizables.length > 0) {
          cnt._interestedResizables.length = 0;
        }

        if (pds?._boundKeyHandlers?.writable === true && typeof (cnt._boundKeyHandlers||0) === 'object' && cnt._boundKeyHandlers.length > 0) {
          cnt._boundKeyHandlers.length = 0;
        }

        if(cnt && typeof cnt.onInputSlotChanged === 'function' && (cnt._inputElement instanceof Node) && typeof cnt._valueChangedEvent === 'string' && typeof cnt._boundValueChanged === 'function'){
          try{
            cnt._inputElement.removeEventListener(cnt._valueChangedEvent, cnt._boundValueChanged);
          }catch(e){}
        }


        for (const name of Object.getOwnPropertyNames(cnt)) {
          if (typeof name === 'string' && name.length > 5 && name.includes('bound')) {

            if (pds[name]?.writable === true && typeof pds[name]?.value === 'function') {
              const f = pds[name]?.value;
              if (f && (f.name || '').includes('bound')) {
                cnt[name] = f66;
              }
            }

          }
        }

        

        if (pds?.__dataEnabled?.writable === true && cnt.__dataEnabled === true) {
          cnt.__dataEnabled = false;
        }
        if (pds?.__dataInvalid?.writable === true && cnt.__dataInvalid === false) {
          cnt.__dataInvalid = true;
        }
        if (pds?.__dataClientsReady?.writable === true && cnt.__dataClientsReady === true) {
          cnt.__dataClientsReady = false;
        }
        try {
          if (cnt.__data && typeof cnt.__data === 'object') {
            cnt.__data = null;
          }
        } catch (e) { }
        try {
          if (cnt.data && typeof cnt.data === 'object') {
            cnt.data = null;
          }
        } catch (e) { }
        // if (pds?.usePatchedLifecycles?.writable === true && cnt.usePatchedLifecycles === true) {
        //   cnt.usePatchedLifecycles = false;
        // }
        // if (pds?.isPolySiElementConnected?.writable === true && cnt.isPolySiElementConnected === true) {
        //   cnt.isPolySiElementConnected = false;
        // }
        // if (pds?.didCallReady?.writable === true && cnt.didCallReady === true) {
        //   cnt.didCallReady = false;
        // }
        // try {
        //   if (cnt.mutablePropNames instanceof Set && cnt.mutablePropNames.size > 0) cnt.mutablePropNames.clear();
        // } catch (e) { }
        // try {
        //   const __dataHasAccessor = cnt?.__dataHasAccessor || 0;
        //   if (typeof __dataHasAccessor === 'object') {
        //     for (const p of Object.getOwnPropertyNames(__dataHasAccessor)) {
        //       if (__dataHasAccessor[p] === true) delete __dataHasAccessor[p];
        //     }
        //   }
        // } catch (e) { }
      }

      walker(r, walked);




      Object.setPrototypeOf(r, EmptyElement.prototype)


      objClean(r);

      cleanChildren(r)



      const t2 = performance.now();

      if (t2 - t1 > 1) {
        listA.log('3782 setToDeadFn', t2 - t1)

      }

      needCollectionCleanup = true;


    }

    let lastExecution = 0;
    let doForceGC = false;

    let urtLast = 0;

    const urt = () => {

      urtLast = performance.now();


      if (d66Element.firstChild !== null) {
        d66Element.replaceChildren();
      }

      const t1 = performance.now();

      if (needCollectionCleanup) {
        needCollectionCleanup = false;
        Promise.resolve().then(collectionCleanup);
      }

      if (DEBUG_no_laterRemoval && laterRemovals.size > 0) {
        const arr = [...laterRemovals];
        laterRemovals.clear();

        for (const ww of arr) {
          const w = ww?.deref();
          if (!w) continue;

          if (isTrueElement(w)) {

            // setToDeadFn(w);
            cleanChildren(w);

            walker(w, walked);
          }

        }
      }

      if (doForceGC) {
        doForceGC = false;
        forceGC().then((n) => {
          window.vdIZE = n * Math.random();
          if (DEBUG_show_vdIZE) console.log(1233, window.vdIZE)
        });
      }

      const currentTime = Date.now();
      if (currentTime - lastExecution > 1000) {
        lastExecution = currentTime;
        executeCheck();
      }

      const t2 = performance.now();

      if (t2 - t1 > 1) {
        listA.log('3782 mo', t2 - t1)

      }

    }
    new MutationObserver(() => {

      urt();

    }).observe(document, { subtree: true, childList: true });

    setInterval(() => {
      if (performance.now() - urtLast > 1200) {
        urt();
      }
    }, 1300);

    new MutationObserver((entries) => {
      if (!entries) return;
      for (const entry of entries) {
        const target = entry?.target;
        target && (target.__nogc__ = 1);
      }
    }).observe(document, { subtree: true, attributeFilter: ['__nogc__'], attributes: true })


    let efc = 0;
    let lastDeadCountMax = 0;

    let leftover = null;
    let leftoverCannotGC = null;

    let executeCheckBusy = false;

    const executeCheck = async () => {

      if (executeCheckBusy) return;
      executeCheckBusy = true;

      const tempLeftOver = {};
      const tempLeftOverCannotGC = {};
      const res = {};
      let k = 0;
      const currentTime = Date.now();
      for (const wNode of myObjectList) {
        const r = wNode.deref();
        if (!r) {
          myObjectList.delete(wNode);
          detachedNodes.delete(wNode);
          continue;
        }
        let nodeName = r.nodeName;
        if (!nodeName || typeof nodeName !== 'string') continue;
        nodeName = nodeName.toLowerCase();

        await (async () => {

          await Promise.resolve();


          if (!isConnectedFn.call(r)) {

            const di = getDI(r) || setDI(r, {});

            let { __lastDead__, __lastDeadCount__, __setToDead__ } = di;

            __lastDeadCount__ = detectedInfoMap.get(r) || 0; // no case for 0 (i think)
            if (!__lastDeadCount__) {
              console.log('detectedInfoMap failure');
              return;
            }
            if (__lastDeadCount__ > 0) __lastDeadCount__ = Math.floor((Date.now() - __lastDeadCount__) / 1000);
            if (__lastDeadCount__ > 16) __lastDeadCount__ = 17;

            if (__lastDeadCount__ > lastDeadCountMax) lastDeadCountMax = __lastDeadCount__;

            if (!__lastDead__) di.__lastDead__ = __lastDead__ = currentTime;
            else {
              if (__lastDeadCount__ > 16) {
                if (!di.__cannotGC__) {
                  di.__cannotGC__ = true;
                  if (DEBUG_show_cannotGC) console.log('Element cannot be garbage collected', r)
                  window.__gcFailedCount__ = (window.__gcFailedCount__ || 0) + 1

                  window.__gcFailures__ = window.__gcFailures__ || new Set();
                  window.__gcFailures__.add(nodeName);

                  window.__gcFailureList__ = (window.__gcFailureList__ || {});
                  window.__gcFailureList__[nodeName] = (window.__gcFailureList__[nodeName] || 0) + 1;
                }
              } else {

                // di.__lastDeadCount__ = __lastDeadCount__ = (__lastDeadCount__ || 0) + 1;
              }
            }
            if (__lastDeadCount__ > 4) {
              tempLeftOver[nodeName] = (tempLeftOver[nodeName] || 0) + 1;
              if (di.__cannotGC__) tempLeftOverCannotGC[nodeName] = (tempLeftOverCannotGC[nodeName] || 0) + 1;
              if (!__setToDead__ && !r.hasAttribute('__nogc__')) {

                di.__setToDead__ = __setToDead__ = currentTime;


                deadTree.add(r);

                if (typeof r.getElementsByTagName === 'function') {

                  for (const w of r.getElementsByTagName('*')) {

                    if (!w.hasAttribute('__nogc__')) {
                      deadTree.add(w);
                      DEBUG_no_laterRemoval || laterRemovals.add(new WeakRef(w));
                    }

                  }


                }

                setToDeadFn(r);

                const wr = new WeakRef(r);
                if (myObjectList.delete(wNode)) {
                  myObjectList.add(wr);
                }

                if (detachedNodes.delete(wNode)) {
                  detachedNodes.add(wr);
                }


                efc++;


                if (DEBUG_show_El0 && efc === 1) {
                  console.log(8914, window.r33 = r)
                }


                doForceGC = true;


                window.__setDeadCount__ = (window.__setDeadCount__ || 0) + 1;



              }
            }
            res[nodeName] = (res[nodeName] || 0) + 1;
            k++
          } else {



            const di = getDI(r);

            if (di && di.__setToDead__) {
              // already dead. should not reattached
              console.log('dead element get reattached');
            } else {

              if (di && !di.__setToDead__) {
                if (di.__lastDead__) di.__lastDead__ = 0;
                if (di.__lastDeadCount__) di.__lastDeadCount__ = 0;
              }
              setDI(r, null);

              myObjectList.delete(wNode);
              detachedNodes.delete(wNode);
            }


          }


          await Promise.resolve();
        })();


      }

      if (DEBUG_show_checker) {


        if (k > 0) console.log(49912, res)
        else console.log(49912, 'clear')


      }
      window.__gcCheckerCount__ = (window.__gcCheckerCount__ || 0) + 1;


      leftover = Object.assign({}, tempLeftOver);
      leftoverCannotGC = Object.assign({}, tempLeftOverCannotGC);

      executeCheckBusy = false;
    }




    window.__displayGC__ = () => {
      const { __gcCheckerCount__, __gcFailedCount__, vdIZE, __setDeadCount__, __gcFailures__, __gcFailureList__ } = window;
      const o = { __gcCheckerCount__, __gcFailedCount__, vdIZE, __setDeadCount__, efc, lastDeadCountMax, __gcFailures__: __gcFailures__ ? [...__gcFailures__] : null, leftover, leftoverCannotGC, detachedNodes, myObjectListSize: myObjectList.size, __gcFailureList__, collectionSize: collection.size, listOfConnect, listOfDisconnect, listOfPatchingTrue, listOfPatchingFalse }
      console.log(o)
      return o;
    }

    window.getDI = getDI;


  })();


  (() => {



    const getProto = (element) => {
      if (element) {
        const cnt = insp(element);
        return cnt.constructor.prototype || null;
      }
      return null;
    }


    //   ;var Bw = {
    //     YtActionHandlerBehavior: [{
    //         actionMap: {},
    //         attached: function() {
    //             this.registerActionMap(this.actionMap)
    //         },
    //         detached: function() {
    //             this.unregisterActionMap(this.actionMap)
    //         },
    //         registerActionMap: function(a) {
    //             for (var b = nw.getInstance(), c = h(Object.keys(a)), d = c.next(); !d.done; d = c.next()) {
    //                 var e = d.value;
    //                 d = a[e];
    //                 if (this && this[d]) {
    //                     var g = b.actionRoutingMap.get(e);
    //                     g || (g = new Map,
    //                     b.actionRoutingMap.set(e, g));
    //                     d = this[d].bind(this);
    //                     g.set(this, xm(d))
    //                 } else
    //                     g = Error("Unable to register undefined function"),
    //                     g.params = d,
    //                     ym(g)
    //             }
    //         },
    //         unregisterActionMap: function(a) {
    //             pw(nw.getInstance(), a, this)
    //         }
    //     }]
    // };

    const registerActionMap = function (a) {

      // for (var b = nw.getInstance(), c = h(Object.keys(a)), d = c.next(); !d.done; d = c.next()) {
      //   var e = d.value;
      //   d = a[e];
      //   if (this && this[d]) {
      //     var g = b.actionRoutingMap.get(e);
      //     g || (g = new Map,
      //       b.actionRoutingMap.set(e, g));
      //     d = this[d].bind(this);
      //     g.set(this, xm(d))
      //   } else
      //     g = Error("Unable to register undefined function"),
      //       g.params = d,
      //       ym(g)
      // }

    }

    customElements.whenDefined('yt-live-chat-ticker-sponsor-item-renderer').then(() => {



      const tag = "yt-live-chat-ticker-sponsor-item-renderer";
      const cProto = getProto(document.createElement(tag));
      if (!cProto || typeof cProto.attached !== 'function') {
        // for _registered, proto.attached shall exist when the element is defined.
        // for controller extraction, attached shall exist when instance creates.
        console.warn(`proto.attached for ${tag} is unavailable.`);
        return;
      }


      // console.log(12848, cProto, [cProto.dataChanged, cProto.attached])
      // cProto.dataChanged582 = cProto.dataChanged;
      // cProto.dataChanged = function(){

      //   try{



      //     let j = new WeakRef(this);

      //     let w = new Proxy({}, {
      //       get(target, prop){
      //         /*
      //         if(prop === 'hostElement'){
      //           return j?.deref()?.hostElement
      //         }
      //         if(prop === 'data'){
      //           return j?.deref()?.data
      //         }
      //         if(prop === 'ytLiveChatTickerItemBehavior'){
      //           return j?.deref()?.ytLiveChatTickerItemBehavior
      //         }
      //         if(prop === 'computeAriaLabel'){
      //           return j?.deref()?.computeAriaLabel.bind(j?.deref())
      //         }
      //           */

      //         const ths = j?.deref();
      //         if(!ths) return;

      //         const v = ths[prop];
      //         if(!v) return v;

      //         if(typeof v ==='function') return v.bind(ths);
      //         return v;


      //       }
      //     })

      //     let res;
      //     try{

      //        res = this.dataChanged582.apply(w, arguments);
      //     }catch(e){
      //       console.log(e);
      //     }
      //     Promise.resolve().then(()=>{
      //       j = null;
      //       w = null;
      //     });
      //     return res;

      //   }catch(e){
      //     console.warn(e);
      //   }
      //   // if(!this.__dataEnabled || this.__dataInvalid || !this.__dataClientsReady || !this.hostElement ||  this.hostElement.isConnected === false) return;
      //   // return this.dataChanged582.apply(this, arguments);
      //   // this.data = null;
      // }

      // cProto.attached582 = cProto.attached;
      // cProto.attached = function(){
      //   // if(!this.__dataEnabled || this.__dataInvalid || !this.__dataClientsReady || !this.hostElement ||  this.hostElement.isConnected === false ) return;
      //   // return this.attached582.apply(this, arguments);

      //   // Object.setPrototypeOf(this, window.Polymer.Base)
      //   // this.data = null;
      //   // this.

      // }


      if (typeof cProto.detached582MemoryLeak !== 'function' && typeof cProto.detached === 'function') {

        cProto.detached582MemoryLeak = cProto.detached;
        cProto.detached = function () {


          try {

            this.actionHandlerBehavior.unregisterActionMap(this.behaviorActionMap)

            // this.behaviorActionMap = 0;
            // this.isVisibilityRoot = 0;


          } catch (e) { }


          return this.detached582MemoryLeak();

        }


      }

      // cProto.attached582 = cProto.attached;
      // cProto.attached = function(){

      //   try{



      //     let j = new WeakRef(this);

      //     // let jcx = 0;

      //     let w = new Proxy({}, {
      //       get(target, prop){
      //         // return;
      //         const ths = j?.deref();
      //         if(!ths) return;

      //         // if(prop === 'behaviorActionMap'){
      //         //   return 0;
      //         // }
      //         // if(prop === 'isVisibilityRoot'){
      //         //   return 0;
      //         // }


      //         // jcx++;
      //         // if(jcx > 8 && jcx<=10){
      //         //   console.log(2883, jcx, prop)
      //         //   return 0 ;
      //         // }

      //         // if(prop === 'hostElement'){
      //         //   return j?.deref()?.hostElement
      //         // }
      //         // if(prop === 'data'){
      //         //   return j?.deref()?.data
      //         // }
      //         // if(prop === 'ytLiveChatTickerItemBehavior'){
      //         //   return j?.deref()?.ytLiveChatTickerItemBehavior
      //         // }
      //         // if(prop === 'computeAriaLabel'){
      //         //   return j?.deref()?.computeAriaLabel.bind(j?.deref())
      //         // }


      //         // console.log(7171, prop)


      //         // if(prop === 'registerActionMap' || typeof ths[prop] === 'function'){

      //         //   return registerActionMap

      //         // }

      //         // return ths[prop]

      //         const v = ths[prop];
      //         if(!v) return v;

      //         if(typeof v ==='function') return v.bind(ths);
      //         return v;


      //       },
      //       set(target,prop,value){


      //         const ths = j?.deref();
      //         if(!ths) return;
      //         ths[prop] = value;
      //         // console.log(7172, prop, value)
      //         return true;
      //       }
      //     });

      //     let res;
      //     try{

      //        res = this.attached582.apply(w, arguments);
      //     }catch(e){
      //       console.log(e);
      //     }
      //     Promise.resolve().then(()=>{
      //       j = null;
      //       w = null;
      //     });
      //     return res;

      //   }catch(e){
      //     console.warn(e);
      //   }
      // }


      /**
       * 
  eT.prototype.dataChanged = function() {
      var a = this;
      this.data && (Q(this.hostElement).querySelector("#content").style.color = this.ytLiveChatTickerItemBehavior.colorFromDecimal(this.data.detailTextColor),
      this.hostElement.ariaLabel = this.computeAriaLabel(this.data),
      this.ytLiveChatTickerItemBehavior.startCountdown(this.data.durationSec, this.data.fullDurationSec),
      vw(function() {
          a.ytLiveChatTickerItemBehavior.setContainerWidth()
      }))
  }

      e.prototype.attached = function() {
          b.prototype.attached.call(this);
          var p = d.attached;
          if (p)
              for (var q = 0; q < p.length; q++)
                  p[q].call(this)
      }

       * 
       */

    });




    /*
    
            a.behaviorActionMap = {
                "yt-live-chat-pause-replay": "handlePauseReplay",
                "yt-live-chat-resume-replay": "handleResumeReplay",
                "yt-live-chat-replay-progress": "handleReplayProgress"
            };
    
        f.attached = function() {
            this.hostElement.hasAttribute("role") || this.hostElement.setAttribute("role", "button");
            this.hostElement.hasAttribute("tabindex") || this.hostElement.setAttribute("tabindex", "0");
            this.actionHandlerBehavior.registerActionMap(this.behaviorActionMap)
        }
    
    
            behaviorActionMap_: {
                "yt-live-player-video-progress": "handlePlayerVideoProgress_",
                "yt-live-player-ad-start": "handlePlayerAdStart_",
                "yt-live-player-ad-end": "handlePlayerAdEnd_",
                "yt-live-player-state-change": "handlePlayerStateChange_",
                "yt-live-chat-seek-success": "handleChatSeekSuccess_",
                "yt-live-chat-seek-fail": "handleChatSeekFail_",
                "ytg-player-video-progress": "handleGamingPlayerVideoProgress_"
            },
    
    
            attached: function() {
                this.replayBuffer_ = new xnb;
                this.currentPlayerState_ = {};
                this.registerActionMap(this.behaviorActionMap_)
            },
            detached: function() {
                this.unregisterActionMap(this.behaviorActionMap_);
                this.replayBuffer_ = null
            },
    
    
    
    
    
    
    
    
    
    
            attached: function() {
                this.isVisibilityRoot && (this.visibilityObserverForChild_ = HFa(this.viewroot));
                vw(this.initVisibilityObserver_.bind(this))
            },
            initVisibilityObserver_: function() {
                this.visibilityObserver && this.configureVisibilityObserver_()
            },
            configureVisibilityObserver_: function() {
                var a = this;
                this.unobserve_();
                if (x("kevlar_vimio_use_shared_monitor"))
                    fIa(this.hostElement, {
                        data: this.data || null,
                        observer: this.visibilityObserver,
                        visibilityCallback: this.visibilityCallback.bind(this),
                        prescanCallback: this.onPrescanVisible.bind(this),
                        layer: this.getScreenLayer && this.getScreenLayer(),
                        showOption: this.visibilityOptionVisible_,
                        hideOption: this.visibilityOptionHidden_,
                        prescanOption: this.visibilityOptionPrescan_,
                        skipLogging: this.shouldSkipLogging.bind(this)
                    });
                else {
                    var b = [];
                    this.visibilityOptionVisible_ && b.push(this.visibilityObserver.observe(this.hostElement, function() {
                        return a.onVisible()
                    }, this.visibilityOptionVisible_));
                    this.visibilityOptionHidden_ && b.push(this.visibilityObserver.observe(this.hostElement, function() {
                        return a.onHidden()
                    }, this.visibilityOptionHidden_));
                    this.visibilityOptionPrescan_ && b.push(this.visibilityObserver.observe(this.hostElement, function() {
                        return a.onPrescanVisible()
                    }, this.visibilityOptionPrescan_));
                    this.visibilityMonitorKeys = b
                }
            },
            detached: function() {
                this.unobserve_();
                this.visibilityObserverForChild_ = this.localVisibilityObserver_ = null
            },
            unobserve_: function() {
                IB(this, this.visibilityObserver)
            },
            markDirtyVisibilityObserver: function() {
                this.localVisibilityObserver_ && this.configureVisibilityObserver_()
            },
            getVisibilityObserverForChild: function() {
                return this.visibilityObserverForChild_ ? this.visibilityObserverForChild_ : this.localVisibilityObserver_
            },
            get visibilityObserver() {
                if (this.localVisibilityObserver_)
                    return this.localVisibilityObserver_;
                var a = Oi(this.parentNode, function(c) {
                    var d, e = (d = c.polymerController) != null ? d : c;
                    return !!e.getVisibilityObserverForChild && e.getVisibilityObserverForChild()
                }, !0);
                if (a) {
                    var b;
                    this.localVisibilityObserver_ = ((b = a.polymerController) != null ? b : a).getVisibilityObserverForChild()
                } else
                    kIa || (kIa = HFa()),
                    this.localVisibilityObserver_ = kIa;
                return this.localVisibilityObserver_
            },
            visibilityCallback: function(a) {
                a ? this.onVisible() : this.onHidden()
            },
    
    
    
    
    
    
    
    
    
    
    
    */











  })();

  (() => {


    const debug22 = new Set();

    window.debug22 = debug22;





    const ytDOMWM = new WeakMap();
    Object.defineProperty(Element.prototype, 'usePatchedLifecycles', {
      // usePatchedLifecycles = true or false
      // true: as an ytElement
      // false: as a normal HTMLElement
      get() {
        let val = ytDOMWM.get(this);
        if (val === 0) val = false;
        return val;
      },
      set(nv) {


        if (window.debug11) console.log(this.is)

        let requireConversion = false;

        if (location.pathname === '/watch') {

        } else if (location.pathname.startsWith('/live_chat')) {

          // if(!(this.is && this.is.length > 5)){

          //   requireConversion = true;
          // }

          // if(this.is && /^yt.*?\-.*?renderer$/.test(this.is)){
          //   requireConversion = true;
          // }


          // if(this.is && /^yt.*?\-.*?rend.*?$/.test(this.is)){
          //   requireConversion = true;
          // }


          //   if(this.is && new Set([

          //     "ytd-engagement-panel-section-list-renderer",
          //     "yt-live-chat-viewer-engagement-message-renderer",

          //     "DIV",
          //     "SPAN",
          //     "YT-LIVE-CHAT-TICKER-PAID-MESSAGE-ITEM-RENDERER",
          //     "YT-IMG-SHADOW",
          //     "IMG",
          //     "DOM-IF",
          //     "TEMPLATE",
          //     "YT-ICON",
          //     "YT-ATTRIBUTED-STRING",
          //     "YT-LIVE-CHAT-TICKER-SPONSOR-ITEM-RENDERER",
          //     "YT-ICON-SHAPE",
          //     "ICON-SHAPE",
          //     "svg",
          //     "path"
          // ]).has(this.is)){
          //   requireConversion = true;
          // }

          /*
          if(this.is==='yt-live-chat-ticker-paid-message-item-renderer'){
            requireConversion = true;
    
          }
    
          if(this.is==='yt-attributed-string'){
            requireConversion = true;
    
          }
    
          */
        }

        if (requireConversion) {

          debug22.add(this.is)
          nv = 0;
        }

        ytDOMWM.set(this, nv);
        if (nv) {
          listOfPatchingTrue.add(this.is);
        } else {
          listOfPatchingFalse.add(this.is);

        }
        return true;
      },
      enumerable: false,
      configurable: true
    });

  })();

})();
