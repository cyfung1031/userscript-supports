// ==UserScript==
// @name        YouTube JS Engine Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.6.7
// @license     MIT
// @author      CY Fung
// @icon        https://github.com/cyfung1031/userscript-supports/raw/main/icons/yt-engine.png
// @description To enhance YouTube performance by modifying YouTube JS Engine
// @grant       none
// @run-at      document-start
// @unwrap
// @inject-into page
// @allFrames   true
// ==/UserScript==

(() => {

  const NATIVE_CANVAS_ANIMATION = false; // for #cinematics
  const FIX_schedulerInstanceInstance_V1 = false;
  const FIX_schedulerInstanceInstance_V2 = true;
  const FIX_yt_player = true;
  const FIX_Animation_n_timeline = true;
  const NO_PRELOAD_GENERATE_204 = false;
  const CHANGE_appendChild = true;

  const FIX_error_many_stack = true; // should be a bug caused by uBlock Origin
  // const FIX_error_many_stack_keepAliveDuration = 200; // ms
  // const FIX_error_many_stack_keepAliveDuration_check_if_n_larger_than = 8;

  const FIX_Iframe_NULL_SRC = true;

  const IGNORE_bindAnimationForCustomEffect = true; // prevent `v.bindAnimationForCustomEffect(this);` being executed

  const FIX_ytdExpander_childrenChanged = true;
  const FIX_paper_ripple_animate = true;

  const FIX_doIdomRender = true;

  const FIX_Shady = true;

  const FIX_ytAction_ = true; // ytd-app
  const FIX_onVideoDataChange = true;
  // const FIX_onClick = true;
  const FIX_onStateChange = true;
  const FIX_onLoopRangeChange = true;
  const FIX_maybeUpdateFlexibleMenu = true; // ytd-menu-renderer
  const FIX_VideoEVENTS = true;

  const ENABLE_discreteTasking = true;






  /*
  window.addEventListener('edm',()=>{
    let p = [...this.onerror.errorTokens][0].token; (()=>{ console.log(p); throw new Error(p);console.log(334,p) })()
  });

  window.addEventListener('edn',()=>{
    let p = [...this.onerror.errorTokens][0].token+"X"; (()=>{ console.log(p); throw new Error(p);console.log(334,p) })()
  });
  window.addEventListener('edr',()=>{
    let p = '123'; (()=>{ console.log(p); throw new Error(p);console.log(334,p) })()
  });
*/



  let p59 = 0;

  const Promise = (async () => { })().constructor;

  const PromiseExternal = ((resolve_, reject_) => {
    const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
    return class PromiseExternal extends Promise {
      constructor(cb = h) {
        super(cb);
        if (cb === h) {
          /** @type {(value: any) => void} */
          this.resolve = resolve_;
          /** @type {(reason?: any) => void} */
          this.reject = reject_;
        }
      }
    };
  })();


  let pf31 = new PromiseExternal();

  // native RAF
  let __requestAnimationFrame__ = typeof webkitRequestAnimationFrame === 'function' ? window.webkitRequestAnimationFrame.bind(window) : window.requestAnimationFrame.bind(window);

  // 1st wrapped RAF
  const baseRAF = (callback) => {
    return p59 ? __requestAnimationFrame__(callback) : __requestAnimationFrame__((hRes) => {
      pf31.then(() => {
        callback(hRes);
      });
    });
  };

  // 2nd wrapped RAF
  window.requestAnimationFrame = baseRAF;





  const ump3 = new WeakMap();

  const setupDiscreteTasks = (h, rb) => {

    if (rb) {
      if (this.ky36) return;
    }



    if (typeof h.onYtRendererstamperFinished === 'function' && !(h.onYtRendererstamperFinished.km34)) {
      const f = h.onYtRendererstamperFinished;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onYtRendererstamperFinished = g;

    }




    if (typeof h.onYtUpdateDescriptionAction === 'function' && !(h.onYtUpdateDescriptionAction.km34)) {
      const f = h.onYtUpdateDescriptionAction;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onYtUpdateDescriptionAction = g;

    }



    if (typeof h.handleUpdateDescriptionAction === 'function' && !(h.handleUpdateDescriptionAction.km34)) {
      const f = h.handleUpdateDescriptionAction;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleUpdateDescriptionAction = g;

    }

    if (typeof h.handleUpdateLiveChatPollAction === 'function' && !(h.handleUpdateLiveChatPollAction.km34)) {
      const f = h.handleUpdateLiveChatPollAction;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleUpdateLiveChatPollAction = g;

    }



    /*


    if (typeof h.onYtAction_ === 'function' && !(h.onYtAction_.km34)) {
      const f = h.onYtAction_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onYtAction_ = g;

    }

    */



    if (typeof h.onTextChanged === 'function' && !(h.onTextChanged.km34)) {
      const f = h.onTextChanged;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onTextChanged = g;

    }






    if (typeof h.onVideoDataChange === 'function' && !(h.onVideoDataChange.km34)) {
      const f = h.onVideoDataChange;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onVideoDataChange = g;

    }





    if (typeof h.onVideoDataChange_ === 'function' && !(h.onVideoDataChange_.km34)) {
      const f = h.onVideoDataChange_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onVideoDataChange_ = g;

    }




    if (typeof h.addTooltips === 'function' && !(h.addTooltips.km34)) {

      const f = h.addTooltips;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.addTooltips = g;

    }




    if (typeof h.addTooltips_ === 'function' && !(h.addTooltips_.km34)) {

      const f = h.addTooltips_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.addTooltips_ = g;

    }



    if (typeof h.updateRenderedElements === 'function' && !(h.updateRenderedElements.km34)) {

      const f = h.updateRenderedElements;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updateRenderedElements = g;

    }




    if (typeof h.startLoadingWatch === 'function' && !(h.startLoadingWatch.km34)) {

      const f = h.startLoadingWatch;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.startLoadingWatch = g;

    }













    if (typeof h.loadPage_ === 'function' && !(h.loadPage_.km34)) {
      const f = h.loadPage_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.loadPage_ = g;

    }
    if (typeof h.updatePageData_ === 'function' && !(h.updatePageData_.km34)) {
      const f = h.updatePageData_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updatePageData_ = g;

    }









    if (typeof h.onFocus_ === 'function' && !(h.onFocus_.km34)) {

      const f = h.onFocus_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onFocus_ = g;

    }

    if (typeof h.onBlur_ === 'function' && !(h.onBlur_.km34)) {

      const f = h.onBlur_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onBlur_ = g;

    }


    if (typeof h.buttonClassChanged_ === 'function' && !(h.buttonClassChanged_.km34)) {

      const f = h.buttonClassChanged_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.buttonClassChanged_ = g;

    }


    if (typeof h.buttonIconChanged_ === 'function' && !(h.buttonIconChanged_.km34)) {

      const f = h.buttonIconChanged_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.buttonIconChanged_ = g;

    }


    if (typeof h.dataChangedInBehavior_ === 'function' && !(h.dataChangedInBehavior_.km34)) {

      const f = h.dataChangedInBehavior_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.dataChangedInBehavior_ = g;

    }





    if (typeof h.continuationsChanged_ === 'function' && !(h.continuationsChanged_.km34)) {

      const f = h.continuationsChanged_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.continuationsChanged_ = g;

    }


    if (typeof h.forceChatPoll_ === 'function' && !(h.forceChatPoll_.km34)) {

      const f = h.forceChatPoll_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.forceChatPoll_ = g;

    }



    if (typeof h.onEndpointClick_ === 'function' && !(h.onEndpointClick_.km34)) {

      const f = h.onEndpointClick_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onEndpointClick_ = g;

    }


    if (typeof h.onEndpointTap_ === 'function' && !(h.onEndpointTap_.km34)) {

      const f = h.onEndpointTap_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onEndpointTap_ = g;

    }


    if (typeof h.handleClick_ === 'function' && !(h.handleClick_.km34)) {

      const f = h.handleClick_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleClick_ = g;

    }



    // return;



    if (typeof h.onReadyStateChange_ === 'function' && !(h.onReadyStateChange_.km34)) {

      const f = h.onReadyStateChange_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onReadyStateChange_ = g;

    }

    if (typeof h.onReadyStateChangeEntryPoint_ === 'function' && !(h.onReadyStateChangeEntryPoint_.km34)) {

      const f = h.onReadyStateChangeEntryPoint_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onReadyStateChangeEntryPoint_ = g;

    }


    if (typeof h.readyStateChangeHandler_ === 'function' && !(h.readyStateChangeHandler_.km34)) {

      const f = h.readyStateChangeHandler_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.readyStateChangeHandler_ = g;

    }




    if (typeof h.xmlHttpHandler_ === 'function' && !(h.xmlHttpHandler_.km34)) {

      const f = h.xmlHttpHandler_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.xmlHttpHandler_ = g;

    }


    if (typeof h.executeCallbacks_ === 'function' && !(h.executeCallbacks_.km34)) {

      const f = h.executeCallbacks_; // overloaded
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.executeCallbacks_ = g;

    }



    if (typeof h.handleInvalidationData_ === 'function' && !(h.handleInvalidationData_.km34)) {

      const f = h.handleInvalidationData_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.handleInvalidationData_ = g;

    }

    if (typeof h.onInput_ === 'function' && !(h.onInput_.km34)) {

      const f = h.onInput_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onInput_ = g;

    }


    if (typeof h.trigger_ === 'function' && !(h.trigger_.km34)) {

      const f = h.trigger_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.trigger_ = g;

    }


    if (typeof h.requestData_ === 'function' && !(h.requestData_.km34)) {

      const f = h.requestData_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.requestData_ = g;

    }

    if (typeof h.onLoadReloadContinuation_ === 'function' && !(h.onLoadReloadContinuation_.km34)) {

      const f = h.onLoadReloadContinuation_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onLoadReloadContinuation_ = g;

    }



    if (typeof h.onLoadIncrementalContinuation_ === 'function' && !(h.onLoadIncrementalContinuation_.km34)) {

      const f = h.onLoadIncrementalContinuation_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onLoadIncrementalContinuation_ = g;

    }

    if (typeof h.onLoadSeekContinuation_ === 'function' && !(h.onLoadSeekContinuation_.km34)) {

      const f = h.onLoadSeekContinuation_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onLoadSeekContinuation_ = g;

    }
    if (typeof h.onLoadReplayContinuation_ === 'function' && !(h.onLoadReplayContinuation_.km34)) {

      const f = h.onLoadReplayContinuation_;
      const g = ump3.get(f) || function (a, b) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onLoadReplayContinuation_ = g;

    }
    if (typeof h.onNavigate_ === 'function' && !(h.onNavigate_.km34)) {

      const f = h.onNavigate_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onNavigate_ = g;

    }

    /*
    if(typeof h.deferRenderStamperBinding_ ==='function' && !(h.deferRenderStamperBinding_.km34)){

            const f = h.deferRenderStamperBinding_;
      const g = function(){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.deferRenderStamperBinding_ = g;

    }
    */



    if (typeof h.ytRendererBehaviorDataObserver_ === 'function' && !(h.ytRendererBehaviorDataObserver_.km34)) {

      const f = h.ytRendererBehaviorDataObserver_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.ytRendererBehaviorDataObserver_ = g;

    }

    if (typeof h.ytRendererBehaviorTargetIdObserver_ === 'function' && !(h.ytRendererBehaviorTargetIdObserver_.km34)) {

      const f = h.ytRendererBehaviorTargetIdObserver_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.ytRendererBehaviorTargetIdObserver_ = g;

    }

    if (typeof h.unregisterRenderer_ === 'function' && !(h.unregisterRenderer_.km34)) {

      const f = h.unregisterRenderer_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.unregisterRenderer_ = g;

    }



    if (typeof h.textChanged_ === 'function' && !(h.textChanged_.km34)) {

      const f = h.textChanged_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.textChanged_ = g;

    }




    /*
    if(typeof h.stampDomArray_ ==='function' && !(h.stampDomArray_.km34)){

      if( h.stampDomArray_.length === 6){

            const f = h.stampDomArray_;
      const g = function(a,b,c,d,e,h){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampDomArray_ = g;

      }else{



            const f = h.stampDomArray_;
      const g = function(){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampDomArray_ = g;
      }


    }
    */

    /*
    if(typeof h.stampDomArraySplices_ ==='function' && !(h.stampDomArraySplices_.km34)){

      if(h.stampDomArraySplices_.length === 3){



            const f = h.stampDomArraySplices_;
      const g = function(a,b,c){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampDomArraySplices_ = g;


      }else{



            const f = h.stampDomArraySplices_;
      const g = function(){
        Promise.resolve().then(()=>f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampDomArraySplices_ = g;


      }

    }
    */




    // RP.prototype.searchChanged_ = RP.prototype.searchChanged_;
    // RP.prototype.skinToneChanged_ = RP.prototype.skinToneChanged_;
    // RP.prototype.onEmojiHover_ = RP.prototype.onEmojiHover_;
    // RP.prototype.onSelectCategory_ = RP.prototype.onSelectCategory_;
    // RP.prototype.onShowEmojiVariantSelector = RP.prototype.onShowEmojiVariantSelector;
    // RP.prototype.updateCategoriesAndPlaceholder_ = RP.prototype.updateCategoriesAndPlaceholder_;



    if (typeof h.searchChanged_ === 'function' && !(h.searchChanged_.km34)) {

      const f = h.searchChanged_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.searchChanged_ = g;

    }

    if (typeof h.skinToneChanged_ === 'function' && !(h.skinToneChanged_.km34)) {

      const f = h.skinToneChanged_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.skinToneChanged_ = g;

    }

    if (typeof h.onEmojiHover_ === 'function' && !(h.onEmojiHover_.km34)) {

      const f = h.onEmojiHover_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onEmojiHover_ = g;

    }

    if (typeof h.onSelectCategory_ === 'function' && !(h.onSelectCategory_.km34)) {

      const f = h.onSelectCategory_;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onSelectCategory_ = g;

    }

    if (typeof h.onShowEmojiVariantSelector === 'function' && !(h.onShowEmojiVariantSelector.km34)) {

      const f = h.onShowEmojiVariantSelector;
      const g = ump3.get(f) || function (a) {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onShowEmojiVariantSelector = g;

    }

    if (typeof h.updateCategoriesAndPlaceholder_ === 'function' && !(h.updateCategoriesAndPlaceholder_.km34)) {

      const f = h.updateCategoriesAndPlaceholder_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updateCategoriesAndPlaceholder_ = g;

    }





    if (typeof h.watchPageActiveChanged_ === 'function' && !(h.watchPageActiveChanged_.km34)) {

      const f = h.watchPageActiveChanged_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.watchPageActiveChanged_ = g;

    }


    if (typeof h.activate_ === 'function' && !(h.activate_.km34)) {

      const f = h.activate_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.activate_ = g;

    }
    if (typeof h.onYtPlaylistDataUpdated_ === 'function' && !(h.onYtPlaylistDataUpdated_.km34)) {

      const f = h.onYtPlaylistDataUpdated_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onYtPlaylistDataUpdated_ = g;

    }



    /// -----------------------


    const isMainRenderer = (h) => {
      return (h.is === 'yt-live-chat-renderer') ||
        (h.is === 'yt-live-chat-item-list-renderer') ||
        (h.is === 'yt-live-chat-text-input-field-renderer') ||
        0;
    }



    if (typeof h.rendererStamperApplyChangeRecord_ === 'function' && !(h.rendererStamperApplyChangeRecord_.km31)) {




      const f = h.rendererStamperApplyChangeRecord_;
      h.rendererStamperApplyChangeRecord31_ = f;
      const g = ump3.get(f) || function (a, b, c) {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        this.qm47 = (this.qm47 || Promise.resolve()).then(() => this.rendererStamperApplyChangeRecord31_(a, b, c)).catch(console.log);
      }
      ump3.set(f, g);
      g.km31 = 1;
      h.rendererStamperApplyChangeRecord_ = g;


    }




    /*
    if (typeof h.rendererStamperObserver_ === 'function' && !(h.rendererStamperObserver_.km34)) {

      const f = h.rendererStamperObserver_;
      const g = ump3.get(f) || function (a, b, c) {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.rendererStamperObserver_ = g;

    }


    if (typeof h.rendererStamperApplyChangeRecord_ === 'function' && !(h.rendererStamperApplyChangeRecord_.km34)) {

      const f = h.rendererStamperApplyChangeRecord_;
      const g = ump3.get(f) || function () {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.rendererStamperApplyChangeRecord_ = g;

    }



    if (typeof h.flushRenderStamperComponentBindings_ === 'function' && !(h.flushRenderStamperComponentBindings_.km34)) {

      const f = h.flushRenderStamperComponentBindings_;
      const g = ump3.get(f) || function () {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.flushRenderStamperComponentBindings_ = g;

    }


    if (typeof h.forwardRendererStamperChanges_ === 'function' && !(h.forwardRendererStamperChanges_.km34)) {

      const f = h.forwardRendererStamperChanges_;
      const g = ump3.get(f) || function () {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.forwardRendererStamperChanges_ = g;

    }
    */





    // console.log(123)

    // return;




    if (typeof h.dataChanged_ === 'function' && !(h.dataChanged_.km31)) {




      const f = h.dataChanged_;
      h.dataChanged31_ = f;
      const g = ump3.get(f) || function (...args) {

        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        this.qm47 = (this.qm47 || Promise.resolve()).then(() => this.dataChanged31_(...args)).catch(console.log);
      }
      ump3.set(f, g);
      g.km31 = 1;
      h.dataChanged_ = g;


    }


    /*

    if (typeof h.dataChanged_ === 'function' && !(h.dataChanged_.km34)) {

      const f = h.dataChanged_;
      const g = ump3.get(f) || function () {
        if (isMainRenderer(this)) {
          return f.apply(this, arguments);
        }
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.dataChanged_ = g;

    }
    */



    if (typeof h.tryRenderChunk_ === 'function' && !(h.tryRenderChunk_.km34)) {

      const f = h.tryRenderChunk_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.tryRenderChunk_ = g;

    }


    if (typeof h.renderChunk_ === 'function' && !(h.renderChunk_.km34)) {

      const f = h.renderChunk_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.renderChunk_ = g;

    }

    if (typeof h.deepLazyListObserver_ === 'function' && !(h.deepLazyListObserver_.km34)) {

      const f = h.deepLazyListObserver_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.deepLazyListObserver_ = g;

    }


    if (typeof h.onItemsUpdated_ === 'function' && !(h.onItemsUpdated_.km34)) {

      const f = h.onItemsUpdated_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.onItemsUpdated_ = g;

    }

    if (typeof h.updateChangeRecord_ === 'function' && !(h.updateChangeRecord_.km34)) {

      const f = h.updateChangeRecord_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.updateChangeRecord_ = g;

    }


    if (typeof h.requestRenderChunk_ === 'function' && !(h.requestRenderChunk_.km34)) {

      const f = h.requestRenderChunk_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.requestRenderChunk_ = g;

    }





    return;



    /*
    if (typeof h.cancelPendingTasks_ === 'function' && !(h.cancelPendingTasks_.km34)) {

      const f = h.cancelPendingTasks_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.cancelPendingTasks_ = g;

    }


    if (typeof h.fillRange_ === 'function' && !(h.fillRange_.km34)) {

      const f = h.fillRange_;
      const g = ump3.get(f) || function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);
      }
      ump3.set(f, g);
      g.km34 = 1;
      h.fillRange_ = g;

    }
    */




    if (typeof h.addTextNodes_ === 'function' && !(h.addTextNodes_.km34)) {

      const f = h.addTextNodes_;
      const g = function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.addTextNodes_ = g;

    }




    if (typeof h.updateText_ === 'function' && !(h.updateText_.km34)) {

      const f = h.updateText_;
      const g = function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.updateText_ = g;

    }





    if (typeof h.stampTypeChanged_ === 'function' && !(h.stampTypeChanged_.km34)) {

      const f = h.stampTypeChanged_;
      const g = function () {
        Promise.resolve().then(() => f.apply(this, arguments)).catch(console.log);;
      }
      g.km34 = 1;
      h.stampTypeChanged_ = g;

    }




    // console.log(166)




  }

  const keyStConnectedCallback = Symbol(); // avoid copying the value

  ENABLE_discreteTasking && Object.defineProperty(Object.prototype, 'connectedCallback', {
    get() {
      const f = this[keyStConnectedCallback];
      if (this.is) {
        setupDiscreteTasks(this, true);
        if (f) this.ky36 = 1;
      }
      return f;
    },
    set(nv) {
      this[keyStConnectedCallback] = nv; // proto or object
      if (this.is) {
        setupDiscreteTasks(this);
      }
      return true;
    },
    enumerable: false,
    configurable: true

  });


  const pLoad = new Promise(resolve => {
    if (document.readyState !== 'loading') {
      resolve();
    } else {
      window.addEventListener("DOMContentLoaded", resolve, false);
    }
  });
  pLoad.then(() => {

    let nonce = document.querySelector('style[nonce]');
    nonce = nonce ? nonce.getAttribute('nonce') : null;
    const st = document.createElement('style');
    if (typeof nonce === 'string') st.setAttribute('nonce', nonce);
    st.textContent = "none-element-k47{order:0}";
    st.addEventListener('load', () => {
      pf31.resolve();
      p59 = 1;
    }, false);
    document.body.appendChild(st);


    // console.debug('90002', location.pathname)
    // console.log(90000, location.pathname)

  });

  const prepareLogs = [];

  const skipAdsDetection = new Set(['/robots.txt', '/live_chat', '/live_chat_replay']);

  let winError00 = window.onerror;

  let fix_error_many_stack_state = !FIX_error_many_stack ? 0 : skipAdsDetection.has(location.pathname) ? 2 : 1;

  if (!JSON || !('parse' in JSON)) fix_error_many_stack_state = 0;

  ; FIX_Iframe_NULL_SRC && (() => {

    let emptyBlobUrl = URL.createObjectURL(new Blob([], { type: 'text/html' }));
    const lcOpt = { sensitivity: 'base' };
    document.createElement24 = document.createElement;
    document.createElement = function (t) {
      if (typeof t === 'string' && t.length === 6) {
        if (t.localeCompare('iframe', undefined, lcOpt) === 0) {
          let p = this.createElement24(t);
          p.src = emptyBlobUrl; // avoid iframe is appended to DOM without any url
          return p;
        }
      }
      return this.createElement24.apply(this, arguments);
    };

  })();

  ; fix_error_many_stack_state === 1 && (() => {


    let p1 = winError00;

    let stackNeedleDetails = null;

    Object.defineProperty(Object.prototype, 'matchAll', {
      get() {
        stackNeedleDetails = this;
        return true;
      },
      enumerable: true,
      configurable: true
    });

    try {
      JSON.parse("{}");
    } catch (e) {
      console.warn(e)
      fix_error_many_stack_state = 0;
    }

    delete Object.prototype['matchAll'];

    let p2 = window.onerror;

    window.onerror = p1;

    if (fix_error_many_stack_state === 0) return;

    if (stackNeedleDetails) {
      JSON.parse.stackNeedleDetails = stackNeedleDetails;
      stackNeedleDetails.matchAll = true;
    }

    if (p1 === p2) return (fix_error_many_stack_state = 0);

    // p1!==p2
    fix_error_many_stack_state = !stackNeedleDetails ? 4 : 3;

  })();

  ; fix_error_many_stack_state === 2 && (() => {


    let p1 = winError00;

    let objectPrune = null;
    let stackNeedleDetails = null;

    Object.defineProperty(Function.prototype, 'findOwner', {
      get() {
        objectPrune = this;
        return this._findOwner;
      },
      set(nv) {
        this._findOwner = nv;
        return true;
      },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(Object.prototype, 'matchAll', {
      get() {
        stackNeedleDetails = this;
        return true;
      },
      enumerable: true,
      configurable: true
    });

    try {
      JSON.parse("{}");
    } catch (e) {
      console.warn(e)
      fix_error_many_stack_state = 0;
    }

    delete Function.prototype['findOwner'];
    delete Object.prototype['matchAll'];

    let p2 = window.onerror;

    if (p1 !== p2) return (fix_error_many_stack_state = 4); // p1 != p2

    if (fix_error_many_stack_state == 0) return;

    // the following will only execute when Brave's scriptlets.js is executed.

    prepareLogs.push("fix_error_many_stack_state NB")

    if (stackNeedleDetails) {
      stackNeedleDetails.pattern = null;
      stackNeedleDetails.re = null;
      stackNeedleDetails.expect = null;
      stackNeedleDetails.matchAll = true;
    }

    if (objectPrune) {
      objectPrune.findOwner = objectPrune.mustProcess = objectPrune.logJson = () => { }
      delete objectPrune._findOwner;
    }

    fix_error_many_stack_state = 3;
    JSON.parse.stackNeedleDetails = stackNeedleDetails;
    JSON.parse.objectPrune = objectPrune;

  })();

  ; fix_error_many_stack_state === 3 && (() => {


    let p1 = winError00;

    try {
      JSON.parse("{}");
    } catch (e) {
      console.warn(e)
      fix_error_many_stack_state = 0;
    }

    let p2 = window.onerror;

    if (p1 === p2) return;

    window.onerror = p1;

    if (fix_error_many_stack_state === 0) return;

    fix_error_many_stack_state = 4; // p1 != p2


  })();

  fix_error_many_stack_state === 4 && (() => {

    // the following will only execute when Brave's scriptlets.js is executed.

    prepareLogs.push("fix_error_many_stack_state AB")

    JSON.parseProxy = JSON.parse;

    JSON.parse = ((parse) => {

      parse = parse.bind(JSON); // get a new instance of the current JSON.parse
      return function (text, reviver) {
        const onerror = window.onerror;
        window.onerror = null;
        let r;
        try {
          r = parse(...arguments);
        } catch (e) {
          r = e;
        }
        window.onerror = onerror;
        if (r instanceof Error) {
          throw r;
        }
        return r;
      }

    })(JSON.parse);


  })();



  // ================================================ 0.4.5 ================================================


  // ; (() => {

  //   if (FIX_error_many_stack && self instanceof Window) {
  //     // infinite stack due to matchesStackTrace inside objectPrune of AdsBlock

  //     const pdK = Object.getOwnPropertyDescriptor(window, 'onerror');
  //     if (!pdK || (pdK.get && pdK.configurable)) {

  //     } else {
  //       return;
  //     }

  //     let unsupportErrorFix = false;

  //     let firstHook = true;
  //     let busy33 = false;

  //     let state = 0;

  //     if (pdK) {
  //       delete window['onerror'];
  //     }

  //     const pd = {
  //       get() {
  //         const stack = (new Error()).stack;
  //         // targetStack = stack;
  //         let isGetExceptionToken = stack.indexOf('getExceptionToken') >= 0;
  //         state = isGetExceptionToken ? 1 : 0;
  //         delete Window.prototype['onerror'];
  //         let r = pdK ? pdK.get.call(this) : this.onerror;
  //         Object.defineProperty(Window.prototype, 'onerror', pd);
  //         //        console.log('onerror get', r)
  //         return r;
  //       },
  //       set(nv) {
  //         const stack = (new Error()).stack;
  //         let isGetExceptionToken = stack.indexOf('getExceptionToken') >= 0;
  //         state = state === 1 && isGetExceptionToken ? 2 : 0;
  //         /** @type {string?} */
  //         let sToken = null;
  //         if (unsupportErrorFix || busy33) {

  //         } else if (typeof nv === 'function' && state === 2) {
  //           if (firstHook) {
  //             firstHook = false;
  //             console.groupCollapsed('Infinite onerror Bug Found');
  //             console.log(location.href);
  //             console.log(stack);
  //             console.log(nv);
  //             console.groupEnd();
  //           }
  //           let _token = null;
  //           busy33 = true;
  //           String.prototype.includes76 = String.prototype.includes;
  //           String.prototype.includes = function (token) {
  //             _token = token;
  //             return true;
  //           }
  //           nv('token');
  //           String.prototype.includes = String.prototype.includes76;
  //           sToken = _token;
  //           busy33 = false;
  //           if (typeof sToken !== 'string') {
  //             unsupportErrorFix = true;
  //           }
  //         }
  //         delete Window.prototype['onerror'];
  //         if (typeof sToken === 'string' && sToken.length > 1) {
  //           /** @type {string} */
  //           const token = sToken;
  //           /** @type {OnErrorEventHandler & {errorTokens: Set<string>?} } */
  //           const currentOnerror = pdK ? pdK.get.call(this) : this.onerror;

  //           const now = Date.now();
  //           const tokenEntry = {
  //             token,
  //             expired: now + FIX_error_many_stack_keepAliveDuration
  //           }
  //           /** @typedef {typeof tokenEntry} TokenEntry */

  //           /** @type {Set<TokenEntry>} */
  //           const errorTokens = currentOnerror.errorTokens;

  //           if (errorTokens) {
  //             if (errorTokens.size > FIX_error_many_stack_keepAliveDuration_check_if_n_larger_than) {
  //               for (const entry of errorTokens) {
  //                 if (entry.expired < now) {
  //                   errorTokens.delete(entry);
  //                 }
  //               }
  //             }
  //             errorTokens.add(tokenEntry)
  //           } else {
  //             /** @type {Set<TokenEntry>} */
  //             const errorTokens = new Set([tokenEntry]);
  //             /** @type {OnErrorEventHandler & {errorTokens: Set<string>} } */
  //             const newOnerror = ((oe) => {
  //               const r = function (msg, ...args) {
  //                 if (typeof msg === 'string' && errorTokens.size > 0) {
  //                   for (const entry of errorTokens) {
  //                     if (msg.includes(entry.token)) return true;
  //                   }
  //                 }
  //                 if (typeof oe === 'function') {
  //                   return oe.apply(this, arguments);
  //                 }
  //               };
  //               r.errorTokens = errorTokens;
  //               return r;
  //             })(currentOnerror);

  //             if (pdK && pdK.set) pdK.set.call(this, newOnerror);
  //             else this.onerror = newOnerror;
  //           }
  //         } else {
  //           if (pdK && pdK.set) pdK.set.call(this, nv);
  //           else this.onerror = nv;
  //         }
  //         Object.defineProperty(Window.prototype, 'onerror', pd);

  //         // console.log('onerror set', nv)
  //         return true;
  //       },
  //       enumerable: true,
  //       configurable: true
  //     }

  //     Object.defineProperty(Window.prototype, 'onerror', pd);


  //   }


  // })();



  // ================================================ 0.4.5 ================================================


  // << if FIX_yt_player >>

  // credit to @nopeless (https://greasyfork.org/scripts/471489-youtube-player-perf/)
  const PERF_471489_ = true;
  // PERF_471489_ is not exactly the same to Youtube Player perf v0.7
  // This script uses a much gentle way to tamer the JS engine instead.

  // << end >>

  const steppingScaleN = 200; // transform: scaleX(k/N); 0<k<N



  const nilFn = () => { };

  let isMainWindow = false;
  try {
    isMainWindow = window.document === window.top.document
  } catch (e) { }

  let NO_PRELOAD_GENERATE_204_BYPASS = NO_PRELOAD_GENERATE_204 ? false : true;

  const onRegistryReady = (callback) => {
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
  };


  const assertor = (f) => f() || console.assert(false, f + "");

  const fnIntegrity = (f, d) => {
    if (!f || typeof f !== 'function') {
      console.warn('f is not a function', f);
      return;
    }
    let p = f + "", s = 0, j = -1, w = 0;
    for (let i = 0, l = p.length; i < l; i++) {
      const t = p[i];
      if (((t >= 'a' && t <= 'z') || (t >= 'A' && t <= 'Z'))) {
        if (j < i - 1) w++;
        j = i;
      } else {
        s++;
      }
    }
    let itz = `${f.length}.${s}.${w}`;
    if (!d) {
      return itz;
    } else {
      return itz === d;
    }
  };

  const getZq = (_yt_player) => {

    const w = 'Zq';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p
        && typeof p.start === 'function' && p.start.length === 0
        && typeof p.isActive === 'function' && p.isActive.length === 0
        && typeof p.stop === 'function' && p.stop.length === 0
        && !p.isComplete && !p.getStatus && !p.getResponseHeader && !p.getLastError
        && !p.send && !p.abort
        && !p.sample && !p.initialize && !p.fail && !p.getName
        // && !p.dispose && !p.isDisposed

      ) {
        arr = addProtoToArr(_yt_player, k, arr) || arr;


      }

    }

    if (arr.length === 0) {

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
      return arr[0];
    }




  }


  const getVG = (_yt_player) => {
    const w = 'VG';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      const p = typeof v === 'function' ? v.prototype : 0;
      if (p
        && typeof p.show === 'function' && p.show.length === 1
        && typeof p.hide === 'function' && p.hide.length === 0
        && typeof p.stop === 'function' && p.stop.length === 0) {

        arr = addProtoToArr(_yt_player, k, arr) || arr;

      }

    }


    if (arr.length === 0) {

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
      return arr[0];
    }



  }


  const getzo = (_yt_player) => {
    const w = 'zo';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {

      if (
        typeof v === 'function' && v.length === 3 && k.length < 3
        && (v + "").includes("a.style[b]=c")
      ) {

        arr.push(k);

      }

    }


    if (arr.length === 0) {

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
      return arr[0];
    }

  }

  const addProtoToArr = (parent, key, arr) => {


    let isChildProto = false;
    for (const sr of arr) {
      if (parent[key].prototype instanceof parent[sr]) {
        isChildProto = true;
        break;
      }
    }

    if (isChildProto) return;

    arr = arr.filter(sr => {
      if (parent[sr].prototype instanceof parent[key]) {
        return false;
      }
      return true;
    });

    arr.push(key);

    return arr;


  }

  const getuG = (_yt_player) => {

    const w = 'uG';

    let arr = [];

    for (const [k, v] of Object.entries(_yt_player)) {


      const p = typeof v === 'function' ? v.prototype : 0;

      if (p
        && typeof p.createElement === 'function' && p.createElement.length === 2
        && typeof p.detach === 'function' && p.detach.length === 0
        && typeof p.update === 'function' && p.update.length === 1
        && typeof p.updateValue === 'function' && p.updateValue.length === 2
      ) {

        arr = addProtoToArr(_yt_player, k, arr) || arr;

      }

    }





    if (arr.length === 0) {

      console.warn(`Key does not exist. [${w}]`);
    } else {

      console.log(`[${w}]`, arr);
      return arr[0];
    }

  }



  // << if FIX_schedulerInstanceInstance_ >>

  let idleFrom = Date.now() + 2700;
  let slowMode = false;

  let ytEvented = false;


  const setupEvents = FIX_schedulerInstanceInstance_V1 && !FIX_schedulerInstanceInstance_V2 ? () => {

    document.addEventListener('yt-navigate', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 2700;

    });
    document.addEventListener('yt-navigate-start', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 2700;

    });

    document.addEventListener('yt-page-type-changed', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 1700;

    });


    document.addEventListener('yt-player-updated', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 1700;

    });


    document.addEventListener('yt-page-data-fetched', () => {

      ytEvented = true;
      slowMode = false;
      idleFrom = Date.now() + 1700;

    });

    document.addEventListener('yt-navigate-finish', () => {

      ytEvented = true;
      slowMode = false;
      let t = Date.now() + 700;
      if (t > idleFrom) idleFrom = t;

    });

    document.addEventListener('yt-page-data-updated', () => {

      ytEvented = true;
      slowMode = false;
      let t = Date.now() + 700;
      if (t > idleFrom) idleFrom = t;

    });

    document.addEventListener('yt-watch-comments-ready', () => {

      ytEvented = true;
      slowMode = false;
      let t = Date.now() + 700;
      if (t > idleFrom) idleFrom = t;

    });
  } : () => { };


  // << end >>

  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1';
      /** @type {HTMLIFrameElement | null} */
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
      const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback, getComputedStyle } = fc;
      const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback, getComputedStyle };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      res.animate = fc.HTMLElement.prototype.animate;
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };


  const promiseForCustomYtElementsReady = new Promise(onRegistryReady);

  cleanContext(window).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, animate, requestIdleCallback, getComputedStyle } = __CONTEXT__;

    __requestAnimationFrame__ = requestAnimationFrame;

    let rafPromise = null;

    const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
      requestAnimationFrame(hRes => {
        rafPromise = null;
        resolve(hRes);
      });
    }));

    const getForegroundPromise = () => {
      if (document.visibilityState === 'visible') {
        return Promise.resolve();
      } else {
        return getRafPromise();
      }
    };

    NO_PRELOAD_GENERATE_204_BYPASS || promiseForCustomYtElementsReady.then(() => {
      setTimeout(() => {
        NO_PRELOAD_GENERATE_204_BYPASS = true;
      }, 1270);
    });

    const promiseForTamerTimeout = new Promise(resolve => {
      promiseForCustomYtElementsReady.then(() => {
        customElements.whenDefined('ytd-app').then(() => {
          setTimeout(resolve, 1200);
        });
      });
      setTimeout(resolve, 3000);
    });


    class RAFHub {
      constructor() {
        /** @type {number} */
        this.startAt = 8170;
        /** @type {number} */
        this.counter = 0;
        /** @type {number} */
        this.rid = 0;
        /** @type {Map<number, FrameRequestCallback>} */
        this.funcs = new Map();
        const funcs = this.funcs;
        /** @type {FrameRequestCallback} */
        this.bCallback = this.mCallback.bind(this);
        this.pClear = () => funcs.clear();
      }
      /** @param {DOMHighResTimeStamp} highResTime */
      mCallback(highResTime) {
        this.rid = 0;
        Promise.resolve().then(this.pClear);
        this.funcs.forEach(func => Promise.resolve(highResTime).then(func).catch(console.warn));
      }
      /** @param {FrameRequestCallback} f */
      request(f) {
        if (this.counter > 1e9) this.counter = 9;
        let cid = this.startAt + (++this.counter);
        this.funcs.set(cid, f);
        if (this.rid === 0) {
          console.log(2455)
          this.rid = requestAnimationFrame(this.bCallback);
        }
        return cid;
      }
      /** @param {number} cid */
      cancel(cid) {
        cid = +cid;
        if (cid > 0) {
          if (cid <= this.startAt) {
            return cancelAnimationFrame(cid);
          }
          if (this.rid > 0) {
            this.funcs.delete(cid);
            if (this.funcs.size === 0) {
              cancelAnimationFrame(this.rid);
              this.rid = 0;
            }
          }
        }
      }
      /** @param {number} cid */
      /** @param {FrameRequestCallback} f */
      replaceFunc(cid, f) {
        if (typeof this.funcs.get(cid) === 'function') {
          this.funcs.set(cid, f);
          return cid;
        } else {
          let r = this.request(f);
          this.cancel(cid);
          return r;
        }
      }
    }



    NATIVE_CANVAS_ANIMATION && (() => {

      HTMLCanvasElement.prototype.animate = animate;

      let cid = setInterval(() => {
        HTMLCanvasElement.prototype.animate = animate;
      }, 1);

      promiseForTamerTimeout.then(() => {
        clearInterval(cid)
      });

    })();

    FIX_ytAction_ && (async () => {

      const ytdApp = await new Promise(resolve => {

        promiseForCustomYtElementsReady.then(() => {
          customElements.whenDefined('ytd-app').then(() => {
            const ytdApp = document.querySelector('ytd-app');
            if (ytdApp) {
              resolve(ytdApp);
              return;
            }
            let mo = new MutationObserver(() => {
              const ytdApp = document.querySelector('ytd-app');
              if (!ytdApp) return;
              if (mo) {
                mo.disconnect();
                mo.takeRecords();
                mo = null;
              }
              resolve(ytdApp);
            });
            mo.observe(document, { subtree: true, childList: true });
          });
        });



      });



      if (!ytdApp) return;
      const cProto = (ytdApp.inst || ytdApp).constructor.prototype;


      if (!cProto) return;
      let mbd = 0;

      const fixer = (_ytdApp) => {

        const ytdApp = _ytdApp ? (_ytdApp.inst || _ytdApp) : null;

        if (ytdApp && typeof ytdApp.onYtActionBoundListener_ === 'function' && !ytdApp.onYtActionBoundListener57_) {
          ytdApp.onYtActionBoundListener57_ = ytdApp.onYtActionBoundListener_;
          ytdApp.onYtActionBoundListener_ = ytdApp.onYtAction_.bind(ytdApp);
          mbd++;
        }


      }

      let cid = setInterval(() => {


        if (typeof cProto.created === 'function' && !cProto.created57) {
          cProto.created57 = cProto.created;
          cProto.created = function (...args) {
            const r = this.created57(...args);
            fixer(this);
            return r;
          };
          mbd++;
        }


        if (typeof cProto.onYtAction_ === 'function' && !cProto.onYtAction57_) {
          cProto.onYtAction57_ = cProto.onYtAction_;
          cProto.onYtAction_ = function (...args) {
            Promise.resolve().then(() => this.onYtAction57_(...args));
          };
          mbd++;
        }

        if (ytdApp) fixer(ytdApp);

        /*
        const actionRouter_ = ytdApp ? ytdApp.actionRouter_ : null;
        if (actionRouter_ && typeof actionRouter_.handleAction === 'function' && !actionRouter_.handleAction57) {
          actionRouter_.handleAction57 = actionRouter_.handleAction;
          actionRouter_.handleAction = function (...args) {
            Promise.resolve().then(() => this.handleAction57(...args));
          }
          mbd++;
        }
        */

        // if(mbd === 3) clearInterval(cid);
        if (mbd >= 3) clearInterval(cid);

      }, 1);

      setTimeout(() => {

        clearInterval(cid);
      }, 1000);

    })();


    const generalEvtHandler = async (_evKey, _fvKey, _debug) => {

      const evKey = `${_evKey}`;
      const fvKey = `${_fvKey}`;
      const debug = !!_debug;


      // const rafHub = new RAFHub();


      const _yt_player = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((window || 0)._yt_player || 0) || 0);
          if (t) {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);

        promiseForTamerTimeout.then(() => {
          resolve(null)
        });

      });


      if (!_yt_player || typeof _yt_player !== 'object') return;


      const getArr = (_yt_player) => {

        let arr = [];

        for (const [k, v] of Object.entries(_yt_player)) {

          const p = typeof v === 'function' ? v.prototype : 0;
          if (p
            && typeof p[evKey] === 'function' && p[evKey].length >= 0 && !p[fvKey]

          ) {
            arr = addProtoToArr(_yt_player, k, arr) || arr;

          }

        }

        if (arr.length === 0) {

          console.warn(`Key prop [${evKey}] does not exist.`);
        } else {

          return arr;
        }

      };

      const arr = getArr(_yt_player);


      if (!arr) return;

      debug && console.log(`FIX_${evKey}`, arr);

      const f = function (...args) {
        Promise.resolve().then(() => this[fvKey](...args));
      };


      for (const k of arr) {

        const g = _yt_player;
        const gk = g[k];
        const gkp = gk.prototype;

        debug && console.log(237, k, gkp)

        if (typeof gkp[evKey] == 'function' && !gkp[fvKey]) {
          gkp[fvKey] = gkp[evKey];
          gkp[evKey] = f;
        }
      }




    }

    FIX_onVideoDataChange && generalEvtHandler('onVideoDataChange', 'onVideoDataChange57');
    // FIX_onClick && generalEvtHandler('onClick', 'onClick57');
    FIX_onStateChange && generalEvtHandler('onStateChange', 'onStateChange57');
    FIX_onLoopRangeChange && generalEvtHandler('onLoopRangeChange', 'onLoopRangeChange57');
    if (FIX_VideoEVENTS) {
      const FIX_VideoEVENTS_DEBUG = 0;
      generalEvtHandler('onVideoProgress', 'onVideoProgress57', FIX_VideoEVENTS_DEBUG);
      generalEvtHandler('onAutoplayBlocked', 'onAutoplayBlocked57', FIX_VideoEVENTS_DEBUG);
      generalEvtHandler('onLoadProgress', 'onLoadProgress57', FIX_VideoEVENTS_DEBUG);
      generalEvtHandler('onFullscreenChange', 'onFullscreenChange57', FIX_VideoEVENTS_DEBUG);
      generalEvtHandler('onLoadedMetadata', 'onLoadedMetadata57', FIX_VideoEVENTS_DEBUG);
      generalEvtHandler('onDrmOutputRestricted', 'onDrmOutputRestricted57', FIX_VideoEVENTS_DEBUG);
      generalEvtHandler('onAirPlayActiveChange', 'onAirPlayActiveChange57', FIX_VideoEVENTS_DEBUG);
      generalEvtHandler('onAirPlayAvailabilityChange', 'onAirPlayAvailabilityChange57', FIX_VideoEVENTS_DEBUG);
      generalEvtHandler('onApiChange', 'onApiChange57', FIX_VideoEVENTS_DEBUG);

    }
    // onMutedAutoplayChange
    // onVolumeChange
    // onPlaybackRateChange

    // onAirPlayActiveChange
    // onAirPlayAvailabilityChange
    // onApiChange
    // onAutoplayBlocked
    // onDrmOutputRestricted
    // onFullscreenChange
    // onLoadProgress
    // onLoadedMetadata
    // onVideoDataChange
    // onVideoProgress

    FIX_maybeUpdateFlexibleMenu && (async () => {


      const dummy = await new Promise(resolve => {

        promiseForCustomYtElementsReady.then(() => {
          customElements.whenDefined('ytd-menu-renderer').then(() => {

            resolve(document.createElement('ytd-menu-renderer'));
          });
        });



      });


      if (!dummy || dummy.is !== 'ytd-menu-renderer') return;

      const cProto = (dummy.inst || dummy).constructor.prototype;

      if (typeof cProto.created === 'function' && !cProto.created57) {
        cProto.created57 = cProto.created;
        cProto.created = function (...args) {
          const r = this.created57(...args);
          if (typeof this.maybeUpdateFlexibleMenu === 'function' && !this.maybeUpdateFlexibleMenu57) {
            this.maybeUpdateFlexibleMenu57 = this.maybeUpdateFlexibleMenu;
            this.maybeUpdateFlexibleMenu = function (...args) {
              Promise.resolve().then(() => this.maybeUpdateFlexibleMenu57(...args));
            }
          }
          return r;
        }

      }

      //console.log(144,cProto.maybeUpdateFlexibleMenu)






    })();

    ENABLE_discreteTasking && (async () => {

      const Polymer = await new Promise(resolve => {

        let cid = 0;
        const f = () => {
          const Polymer = window.Polymer;
          if (typeof Polymer !== 'function') return;
          if (!(Polymer.Base || 0).connectedCallback || !(Polymer.Base || 0).disconnectedCallback) return;
          cid && clearInterval(cid);
          cid = 0;
          resolve(Polymer);
        };
        cid = setInterval(f, 1);

      });
      if (!Polymer) return;

      Polymer.Base.__connInit__ = function () {
        setupDiscreteTasks(this);
      }


      /** @type {Function} */
      const connectedCallbackK = function (...args) {
        !this.mh35 && typeof this.__connInit__ === 'function' && this.__connInit__();
        const r = this.connectedCallback53(...args);
        !this.mh35 && typeof this.__connInit__ === 'function' && this.__connInit__();
        this.mh35 = 1;
        return r;
      };


      // /** @type {Function} */
      // const disconnectedCallbackK = function (...args) {
      //   typeof this.__connInit__ === 'function' && this.__connInit__();
      //    this.disconnectedCallback53(...args);
      //   typeof this.__connInit__ === 'function' && this.__connInit__();
      // };


      connectedCallbackK.m353 = 1;
      // disconnectedCallbackK.m353 = 1;



      Polymer.Base.connectedCallback53 = Polymer.Base.connectedCallback;
      // Polymer.Base.disconnectedCallback53 = Polymer.Base.disconnectedCallback;

      Polymer.Base.connectedCallback = connectedCallbackK;
      // Polymer.Base.disconnectedCallback = disconnectedCallbackK;






      /** @type {Function} */
      const createdK = function (...args) {
        !this.mh36 && typeof this.__connInit__ === 'function' && this.__connInit__();
        const r = this.created53(...args);
        !this.mh36 && typeof this.__connInit__ === 'function' && this.__connInit__();
        this.mh36 = 1;
        return r;
      };


      createdK.m353 = 1;
      Polymer.Base.created53 = Polymer.Base.created;
      Polymer.Base.created = createdK;

    })();

    CHANGE_appendChild && (() => {

      HTMLElement.prototype.appendChild73 = HTMLElement.prototype.appendChild;
      HTMLElement.prototype.appendChild = function (a) {


        if (this instanceof HTMLElement) {

          if (!NO_PRELOAD_GENERATE_204_BYPASS && document.head === this) {
            for (let node = this.firstElementChild; node instanceof HTMLElement; node = node.nextElementSibling) {
              if (node.nodeName === 'LINK' && node.rel === 'preload' && node.as === 'fetch' && !node.__m848__) {
                node.__m848__ = 1;
                node.rel = 'prefetch'; // see https://github.com/GoogleChromeLabs/quicklink
              }
            }
          } else if (this.nodeName.startsWith('YT-')) { // yt-animated-rolling-number, yt-attributed-string
            return this.appendChild73.apply(this, arguments);
          }

          if (a instanceof DocumentFragment) {
            if (a.firstElementChild === null) {
              let child = a.firstChild;
              if (child === null) return a;
              let doNormal = false;
              while (child instanceof Node) {
                if (child.nodeType === 3) { doNormal = true; break; }
                child = child.nextSibling;
              }
              if (!doNormal) return a;
            }
          }

        }


        return this.appendChild73.apply(this, arguments)
      }


    })();

    if (FIX_Shady) {

      let cidSL = setInterval(() => {
        const { ShadyDOM, ShadyCSS } = window;
        if (ShadyDOM && ShadyCSS) {
          clearInterval(cidSL);
          cidSL = 0;
        }
        if (ShadyDOM) {
          ShadyDOM.handlesDynamicScoping = false; // 9 of 10
          ShadyDOM.noPatch = true; // 1 of 10
          ShadyDOM.patchOnDemand = false; // 1 of 10
          ShadyDOM.preferPerformance = true; // 1 of 10
          ShadyDOM.querySelectorImplementation = undefined; // 1 of 10
        }
        if (ShadyCSS) {
          ShadyCSS.nativeCss = true; // 1 of 10
          ShadyCSS.nativeShadow = true; // 6 of 10
          ShadyCSS.cssBuild = undefined; // 1 of 10
          ShadyCSS.disableRuntime = true; // 1 of 10
        }
      }, 1);

    }


    FIX_schedulerInstanceInstance_V1 && !FIX_schedulerInstanceInstance_V2 && (async () => {


      const schedulerInstanceInstance_ = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((window || 0).ytglobal || 0).schedulerInstanceInstance_ || 0);
          if (t) {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);
        promiseForTamerTimeout.then(() => {
          resolve(null)
        });
      });

      if (!schedulerInstanceInstance_) return;


      if (!ytEvented) {
        idleFrom = Date.now() + 2700;
        slowMode = false; // integrity
      }

      const checkOK = typeof schedulerInstanceInstance_.start === 'function' && !schedulerInstanceInstance_.start991 && !schedulerInstanceInstance_.stop && !schedulerInstanceInstance_.cancel && !schedulerInstanceInstance_.terminate && !schedulerInstanceInstance_.interupt;
      if (checkOK) {


        schedulerInstanceInstance_.start991 = schedulerInstanceInstance_.start;

        let requestingFn = null;
        let requestingArgs = null;
        let requestingDT = 0;

        // let timerId = null;
        const entries = [];
        const f = function () {
          requestingFn = this.fn;
          requestingArgs = [...arguments];
          requestingDT = Date.now();
          entries.push({
            fn: requestingFn,
            args: requestingArgs,
            t: requestingDT
          });
          // if (Date.now() < idleFrom) {
          //   timerId = this.fn.apply(window, arguments);
          // } else {
          //   timerId = this.fn.apply(window, arguments);

          // }
          // timerId = 12377;
          return 12377;
        }


        const fakeFns = [
          f.bind({ fn: requestAnimationFrame }),
          f.bind({ fn: setInterval }),
          f.bind({ fn: setTimeout }),
          f.bind({ fn: requestIdleCallback })
        ]




        let timerResolve = null;
        setInterval(() => {
          timerResolve && timerResolve();
          timerResolve = null;
          if (!slowMode && Date.now() > idleFrom) slowMode = true;
        }, 250);

        let mzt = 0;

        let fnSelectorProp = null;

        schedulerInstanceInstance_.start = function () {

          const mk1 = window.requestAnimationFrame
          const mk2 = window.setInterval
          const mk3 = window.setTimeout
          const mk4 = window.requestIdleCallback

          const tThis = this['$$12378$$'] || this;


          window.requestAnimationFrame = fakeFns[0]
          window.setInterval = fakeFns[1]
          window.setTimeout = fakeFns[2]
          window.requestIdleCallback = fakeFns[3]

          fnSelectorProp = null;


          tThis.start991.call(new Proxy(tThis, {
            get(target, prop, receiver) {
              if (prop === '$$12377$$') return true;
              if (prop === '$$12378$$') return target;

              // console.log('get',prop)
              return target[prop]
            },
            set(target, prop, value, receiver) {
              // console.log('set', prop, value)


              if (value >= 1 && value <= 4) fnSelectorProp = prop;
              if (value === 12377 && fnSelectorProp) {

                const originalSelection = target[fnSelectorProp];
                const timerIdProp = prop;

                /*


          case 1:
              var a = this.K;
              this.g = this.I ? window.requestIdleCallback(a, {
                  timeout: 3E3
              }) : window.setTimeout(a, ma);
              break;
          case 2:
              this.g = window.setTimeout(this.M, this.N);
              break;
          case 3:
              this.g = window.requestAnimationFrame(this.L);
              break;
          case 4:
              this.g = window.setTimeout(this.J, 0)
          }

          */

                const doForegroundSlowMode = () => {

                  const tir = ++mzt;
                  const f = requestingArgs[0];


                  getForegroundPromise().then(() => {


                    new Promise(r => {
                      timerResolve = r
                    }).then(() => {
                      if (target[timerIdProp] === -tir) f();
                    });

                  })

                  target[fnSelectorProp] = 931;
                  target[prop] = -tir;
                }

                if (target[fnSelectorProp] === 2 && requestingFn === setTimeout) {
                  if (slowMode && !(requestingArgs[1] > 250)) {

                    doForegroundSlowMode();

                  } else {
                    target[prop] = setTimeout.apply(window, requestingArgs);

                  }

                } else if (target[fnSelectorProp] === 3 && requestingFn === requestAnimationFrame) {

                  if (slowMode) {

                    doForegroundSlowMode();

                  } else {
                    target[prop] = requestAnimationFrame.apply(window, requestingArgs);
                  }


                } else if (target[fnSelectorProp] === 4 && requestingFn === setTimeout && !requestingArgs[1]) {

                  const f = requestingArgs[0];
                  const tir = ++mzt;
                  Promise.resolve().then(() => {
                    if (target[timerIdProp] === -tir) f();
                  });
                  target[fnSelectorProp] = 930;
                  target[prop] = -tir;

                } else if (target[fnSelectorProp] === 1 && (requestingFn === requestIdleCallback || requestingFn === setTimeout)) {

                  doForegroundSlowMode();

                } else {
                  // target[prop] = timerId;
                  target[fnSelectorProp] = 0;
                  target[prop] = 0;
                }

                // *****
                // console.log('[[set]]', slowMode , prop, value, `fnSelectorProp: ${originalSelection} -> ${target[fnSelectorProp]}`)
              } else {

                target[prop] = value;
              }
              // console.log('set',prop,value)
              return true;
            }
          }));

          fnSelectorProp = null;


          window.requestAnimationFrame = mk1;
          window.setInterval = mk2
          window.setTimeout = mk3
          window.requestIdleCallback = mk4;



        }

        schedulerInstanceInstance_.start.toString = function () {
          return schedulerInstanceInstance_.start991.toString();
        }

        // const funcNames = [...(schedulerInstanceInstance_.start + "").matchAll(/[\(,]this\.(\w{1,2})[,\)]/g)].map(e => e[1]).map(prop => ({
        //   prop,
        //   value: schedulerInstanceInstance_[prop],
        //   type: typeof schedulerInstanceInstance_[prop]

        // }));
        // console.log('fcc', funcNames)




      }
    })();



    FIX_schedulerInstanceInstance_V2 && !FIX_schedulerInstanceInstance_V1 && (async () => {


      const schedulerInstanceInstance_ = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((window || 0).ytglobal || 0).schedulerInstanceInstance_ || 0);
          if (t) {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);
        promiseForTamerTimeout.then(() => {
          resolve(null)
        });
      });

      if (!schedulerInstanceInstance_) return;


      const checkOK = typeof schedulerInstanceInstance_.start === 'function' && !schedulerInstanceInstance_.start991 && !schedulerInstanceInstance_.stop && !schedulerInstanceInstance_.cancel && !schedulerInstanceInstance_.terminate && !schedulerInstanceInstance_.interupt;
      if (checkOK) {

        schedulerInstanceInstance_.start991 = schedulerInstanceInstance_.start;



        let busy = false;

        // console.log('1667',schedulerInstanceInstance_.start);
        schedulerInstanceInstance_.start = function () {

          // p59 || console.log(location.pathname, 16400);

          if (busy) {

            return this.start991.call(this);

          }

          busy = true;

          const mk1 = window.requestAnimationFrame
          // const mk2 = window.setInterval
          // const mk3 = window.setTimeout
          // const mk4 = window.requestIdleCallback

          // by pass Youtube Engine's wrapping
          window.requestAnimationFrame = baseRAF;
          // window.setInterval = setInterval
          // window.setTimeout = setTimeout
          // window.requestIdleCallback = requestIdleCallback


          this.start991.call(this);


          window.requestAnimationFrame = mk1;
          // window.setInterval = mk2
          // window.setTimeout = mk3
          // window.requestIdleCallback = mk4;

          busy = false;



        }

        schedulerInstanceInstance_.start.toString = function () {
          return schedulerInstanceInstance_.start991.toString();
        }

        // const funcNames = [...(schedulerInstanceInstance_.start + "").matchAll(/[\(,]this\.(\w{1,2})[,\)]/g)].map(e => e[1]).map(prop => ({
        //   prop,
        //   value: schedulerInstanceInstance_[prop],
        //   type: typeof schedulerInstanceInstance_[prop]

        // }));
        // console.log('fcc', funcNames)




      }
    })();

    FIX_yt_player && (async () => {



      // const rafHub = new RAFHub();


      const _yt_player = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((window || 0)._yt_player || 0) || 0);
          if (t) {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);

        promiseForTamerTimeout.then(() => {
          resolve(null)
        });

      });



      if (!_yt_player || typeof _yt_player !== 'object') return;



      let keyZq = getZq(_yt_player);
      let keyVG = getVG(_yt_player);
      let buildVG = _yt_player[keyVG];
      let u = new buildVG({
        api: {},
        element: document.createElement('noscript'),
        api: {},
        hide: () => { }
      }, 250);
      const timeDelayConstructor = u.delay.constructor; // g.br
      // console.log(keyVG, u)
      // buildVG.prototype.show = function(){}
      // _yt_player[keyZq] = g.k

      if (!keyZq) return;


      const g = _yt_player
      let k = keyZq

      const gk = g[k];
      if (typeof gk !== 'function') return;
      const gkp = gk.prototype;

      let dummyObject = new gk;
      let nilFunc = () => { };

      let nilObj = {};

      // console.log(1111111111)

      let keyBoolD = '';
      let keyWindow = '';
      let keyFuncC = '';
      let keyCidj = '';

      for (const [t, y] of Object.entries(dummyObject)) {
        if (y instanceof Window) keyWindow = t;
      }

      const dummyObjectProxyHandler = {
        get(target, prop) {
          let v = target[prop]
          if (v instanceof Window && !keyWindow) {
            keyWindow = t;
          }
          let y = typeof v === 'function' ? nilFunc : typeof v === 'object' ? nilObj : v;
          if (prop === keyWindow) y = {
            requestAnimationFrame(f) {
              return 3;
            },
            cancelAnimationFrame() {

            }
          }
          if (!keyFuncC && typeof v === 'function' && !(prop in target.constructor.prototype)) {
            keyFuncC = prop;
          }
          // console.log('[get]', prop, typeof target[prop])


          return y;
        },
        set(target, prop, value) {

          if (typeof value === 'boolean' && !keyBoolD) {
            keyBoolD = prop;
          }
          if (typeof value === 'number' && !keyCidj && value >= 2) {
            keyCidj = prop;
          }

          // console.log('[set]', prop, value)
          target[prop] = value

          return true;
        }
      };

      dummyObject.start.call(new Proxy(dummyObject, dummyObjectProxyHandler))

      /*
            console.log({
              keyBoolD,
              keyFuncC,
              keyWindow,
              keyCidj
            })

            console.log( dummyObject[keyFuncC])


            console.log(2222222222)
      */


      // console.log('gkp.start',gkp.start);
      // console.log('gkp.stop',gkp.stop);
      gkp._activation = false;

      gkp.start = function () {
        // p59 || console.log(12100)
        if (!this._activation) {
          this._activation = true;
          getRafPromise().then(() => {
            this._activation = false;
            if (this[keyCidj]) {
              Promise.resolve().then(this[keyFuncC]);
            }
          });
        }
        this[keyCidj] = 1;
        this[keyBoolD] = true;
      }
        ;
      gkp.stop = function () {
        this[keyCidj] = null
      }


      /*
        g[k].start = function() {
            this.stop();
            this.D = true;
            var a = requestAnimationFrame
              , b = cancelAnimationFrame;
            this.j =  a.call(this.B, this.C)
        }
        ;
        g[k].stop = function() {
            if (this.isActive()) {
                var a = requestAnimationFrame
                  , b = cancelAnimationFrame;
                b.call(this.B, this.j)
            }
            this.j = null
        }
      */



      const keyzo = PERF_471489_ ? getzo(_yt_player) : null;

      if (keyzo) {

        k = keyzo

        const setCSSProp = (() => {

          let animationPropCapable = false;
          try {
            const propName = "--ibxpf"
            const value = 2;
            const keyframes = [{
              [propName]: value
            }];
            window.CSS.registerProperty({
              name: "--ibxpf",
              syntax: "<number>",
              inherits: false,
              initialValue: 1,
            });
            animationPropCapable = '1' === `${getComputedStyle(document.documentElement).getPropertyValue('--ibxpf')}`
          } catch (e) { }

          if (!animationPropCapable) {
            return (element, cssProp, value) => {


              element.style.setProperty(cssProp, value);

            }
          }

          const propMaps = new Map();

          function setCustomCSSProperty(element, propName, value) {
            let wm = propMaps.get(propName);
            if (!wm) {

              try {
                window.CSS.registerProperty({
                  name: propName,
                  syntax: "*",
                  inherits: false
                });
              } catch (e) {
                console.warn(e);
              }

              propMaps.set(propName, (wm = new WeakMap()));
            }

            // Create the animation keyframes with the provided property and value
            const keyframes = [{
              [propName]: value
            }];

            let currentAnimation = wm.get(element);
            if (currentAnimation) {

              currentAnimation.effect.setKeyframes(keyframes);

            } else {



              // Set the animation on the element and immediately pause it
              const animation = animate.call(element, keyframes, {
                duration: 1, // Very short duration as we just want to set the value
                fill: 'forwards',
                iterationStart: 1,
                iterations: 2,
                direction: 'alternate'
              });


              // animation.currentTime = 1;
              animation.pause();

              wm.set(element, animation);


            }

          }

          return setCustomCSSProperty;


        })();


        const attrUpdateFn = g[k];
        g['$$original$$' + k] = attrUpdateFn;
        g[k] = function (a, b, c) {

          // console.log(140000, a, b, c);

          let transformType = '';
          let transformValue = 0;
          let transformUnit = '';

          let byPassDefaultFn = false;
          if (b === "transform" && typeof c === 'string') {

            byPassDefaultFn = true;

            const aStyle = a.style;

            // let beforeMq = aStyle.getPropertyValue('--mq-transform');
            if (!(a instanceof HTMLElement)) return;
            if (c.length === 0) {

            } else if (c.startsWith('scalex(0.') || (c === 'scalex(0)' || c === 'scalex(1)')) {
              let p = c.substring(7, c.length - 1);
              let q = p.length >= 1 ? parseFloat(p) : -1;
              if (q > -1e-5 && q < 1 + 1e-5) {
                transformType = 'scalex'
                transformValue = q;
                transformUnit = '';
              }


            } else if (c.startsWith('translateX(') && c.endsWith('px)')) {

              let p = c.substring(11, c.length - 3);
              let q = p.length >= 1 ? parseFloat(p) : NaN;

              if (typeof q === 'number' && !isNaN(q)) {
                transformType = 'translateX'
                transformValue = q;
                transformUnit = 'px';
              }


            } else if (c.startsWith('scaley(0.') || (c === 'scaley(0)' || c === 'scaley(1)')) {
              let p = c.substring(7, c.length - 1);
              let q = p.length >= 1 ? parseFloat(p) : -1;
              if (q > -1e-5 && q < 1 + 1e-5) {
                transformType = 'scaley'
                transformValue = q;
                transformUnit = '';
              }


            } else if (c.startsWith('translateY(') && c.endsWith('px)')) {

              let p = c.substring(11, c.length - 3);
              let q = p.length >= 1 ? parseFloat(p) : NaN;

              if (typeof q === 'number' && !isNaN(q)) {
                transformType = 'translateY'
                transformValue = q;
                transformUnit = 'px';
              }


            }

            if (transformType) {

              if (transformType === 'scalex' || transformType === 'scaley') {

                const q = transformValue;


                /*

                let vz = Math.round(steppingScaleN * q);
                const customPropName = '--discrete-'+transformType

                const currentValue = aStyle.getPropertyValue(customPropName);

                const transform = (aStyle.transform || '');
                const u = transform.includes(customPropName)
                if (`${currentValue}` === `${vz}`) {
                  if (u) return;
                }


                setCSSProp(a,customPropName, vz);
                // aStyle.setProperty(customPropName, vz)

                let ck = '';

                if (c.length === 9) ck = c;
                else if (!u) ck = c.replace(/[.\d]+/, '0.5');

                if (ck && beforeMq !== ck) {
                  aStyle.setProperty('--mq-transform', ck);
                }

                if (u) return;
                c = `${transformType}(calc(var(--discrete-${transformType})/${steppingScaleN}))`;



                */

                const vz = +(Math.round(q * steppingScaleN) / steppingScaleN).toFixed(3);

                c = `${transformType === 'scalex' ? 'scaleX' : 'scaleY'}(${vz})`
                const cv = aStyle.transform;

                // console.log(157, cv,c)

                if (c === cv) return;
                // console.log(257, cv,c)

                aStyle.transform = c;

                // return;

              } else if (transformType === 'translateX' || transformType === 'translateY') {

                const q = transformValue;

                /*

                let vz = q.toFixed(1);
                const customPropName = '--discrete-'+transformType

                const aStyle = a.style;
                const currentValue = (aStyle.getPropertyValue(customPropName) || '').replace('px', '');


                const transform = (aStyle.transform || '');
                const u = transform.includes(customPropName)
                if (parseFloat(currentValue).toFixed(1) === vz) {
                  if (u) return;
                }

                setCSSProp(a,customPropName, vz + 'px');
                // aStyle.setProperty(customPropName, vz + 'px')

                let ck = '';
                if (c.length === 15) ck = c;
                else if (!u) ck = c.replace(/[.\d]+/, '0.5');

                if (ck && beforeMq !== ck) {
                  aStyle.setProperty('--mq-transform', ck);
                }

                if (u) return;
                c = `${transformType}(var(--discrete-${transformType}))`;

                */


                const vz = +q.toFixed(1);

                c = `${transformType}(${vz}${transformUnit})`
                const cv = aStyle.transform;

                // console.log(158, cv,c)

                if (c === cv) return;
                // console.log(258, cv,c)

                aStyle.transform = c;

                // return;

              } else {
                throw new Error();
              }

            } else {
              // if(beforeMq) a.style.setProperty('--mq-transform', '');
              const cv = aStyle.transform
              if (!c && !cv) return;
              else if (c === cv) return;
              aStyle.transform = c;
              // return;
            }

          } else if (b === "display") {

            const cv = a.style.display;
            if (!cv && !c) return;
            if (cv === c) return;


          } else if (b === "width") {

            const cv = a.style.width;
            if (!cv && !c) return;
            if (cv === c) return;

          }

          // console.log(130000, a, b, c);

          if (byPassDefaultFn) return;
          return attrUpdateFn.call(this, a, b, c);
        }


        /*

            g.zo = function(a, b, c) {
                if ("string" === typeof b)
                    (b = yo(a, b)) && (a.style[b] = c);
                else
                    for (var d in b) {
                        c = a;
                        var e = b[d]
                          , f = yo(c, d);
                        f && (c.style[f] = e)
                    }
            }


        */


      }



      const keyuG = PERF_471489_ ? getuG(_yt_player) : null;

      if (keyuG) {

        k = keyuG;

        const gk = g[k];
        const gkp = gk.prototype;


        /** @type { Map<string, WeakMap<any, any>> } */
        const ntLogs = new Map();

        if (typeof gkp.updateValue === 'function' && gkp.updateValue.length === 2 && !gkp.updateValue31) {

          gkp.updateValue31 = gkp.updateValue;
          gkp.updateValue = function (a, b) {
            if (typeof a !== 'string') return this.updateValue31(a, b);

            const element = this.element;
            if (!(element instanceof HTMLElement)) return this.updateValue31(a, b);

            let ntLog = ntLogs.get(a);
            if (!ntLog) ntLogs.set(a, (ntLog = new WeakMap()));

            let cache = ntLog.get(element);
            if (cache && cache.value === b) {
              return;
            }
            if (!cache) {
              this.__oldValueByUpdateValue__ = null;
              ntLog.set(element, cache = { value: b });
            } else {
              this.__oldValueByUpdateValue__ = cache.value;
              cache.value = b;
            }


            return this.updateValue31(a, b);
          }


          /*
            g.k.update = function(a) {
                for (var b = g.u(Object.keys(a)), c = b.next(); !c.done; c = b.next())
                    c = c.value,
                    this.updateValue(c, a[c])
            }
            ;
            g.k.updateValue = function(a, b) {
                (a = this.Td["{{" + a + "}}"]) && wG(this, a[0], a[1], b)
            }
          */


        }


      }




    })();



    FIX_Animation_n_timeline && (async () => {


      const timeline = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((document || 0).timeline || 0) || 0);
          if (t && typeof t._play === 'function') {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);

        promiseForTamerTimeout.then(() => {
          resolve(null)
        });

      });


      const Animation = await new Promise(resolve => {

        let cid = setInterval(() => {
          let t = (((window || 0).Animation || 0) || 0);
          if (t && typeof t === 'function' && t.length === 2 && typeof t.prototype._updatePromises === 'function') {

            clearInterval(cid);
            resolve(t);
          }
        }, 1);

        promiseForTamerTimeout.then(() => {
          resolve(null)
        });

      });

      if (!timeline) return;
      if (!Animation) return;

      const aniProto = Animation.prototype;
      // aniProto.sequenceNumber = 0; // native YouTube engine bug - sequenceNumber is not set

      const getXroto = (x) => {
        try {
          return x.__proto__;
        } catch (e) { }
        return null;
      }
      const timProto = getXroto(timeline);
      if (!timProto) return;
      if (
        (
          typeof timProto.getAnimations === 'function' && typeof timProto.play === 'function' &&
          typeof timProto._discardAnimations === 'function' && typeof timProto._play === 'function' &&
          typeof timProto._updateAnimationsPromises === 'function' && !timProto.nofCQ &&
          typeof aniProto._updatePromises === 'function' && !aniProto.nofYH
        )

      ) {

        timProto.nofCQ = 1;
        aniProto.nofYH = 1;

        const originalAnimationsWithPromises = ((_updateAnimationsPromises) => {


          /*
            v.animationsWithPromises = v.animationsWithPromises.filter(function (c) {
              return c._updatePromises();
            });
          */

          const p = Array.prototype.filter;

          let res = null;
          Array.prototype.filter = function () {

            res = this;
            return this;

          };

          _updateAnimationsPromises.call({});

          Array.prototype.filter = p;

          if (res && typeof res.length === 'number') {
            /** @type {any[]} */
            const _res = res;
            return _res;
          }


          return null;




        })(timProto._updateAnimationsPromises);

        if (!originalAnimationsWithPromises || typeof originalAnimationsWithPromises.length !== 'number') return;

        // console.log('originalAnimationsWithPromises', originalAnimationsWithPromises)

        aniProto._updatePromises31 = aniProto._updatePromises;

        /*
        aniProto._updatePromises = function(){
          console.log('eff',this._oldPlayState, this.playState)
          return this._updatePromises31.apply(this, arguments)
        }
        */

        aniProto._updatePromises = function () {
          var oldPlayState = this._oldPlayState;
          var newPlayState = this.playState;
          // console.log('ett', oldPlayState, newPlayState)
          if (newPlayState !== oldPlayState) {
            this._oldPlayState = newPlayState;
            if (this._readyPromise) {
              if ("idle" == newPlayState) {
                this._rejectReadyPromise();
                this._readyPromise = void 0;
              } else if ("pending" == oldPlayState) {
                this._resolveReadyPromise();
              } else if ("pending" == newPlayState) {
                this._readyPromise = void 0;
              }
            }
            if (this._finishedPromise) {
              if ("idle" == newPlayState) {
                this._rejectFinishedPromise();
                this._finishedPromise = void 0;
              } else if ("finished" == newPlayState) {
                this._resolveFinishedPromise();
              } else if ("finished" == oldPlayState) {
                this._finishedPromise = void 0;
              }
            }
          }
          return this._readyPromise || this._finishedPromise;
        };


        let restartWebAnimationsNextTickFlag = false;

        const looperMethodT = () => {

          const runnerFn = (hRes) => {
            var b = timeline;
            b.currentTime = hRes;
            b._discardAnimations();
            if (0 == b._animations.length) {
              restartWebAnimationsNextTickFlag = false;
            } else {
              getRafPromise().then(runnerFn);
            }
          }

          const restartWebAnimationsNextTick = () => {
            if (!restartWebAnimationsNextTickFlag) {
              restartWebAnimationsNextTickFlag = true;
              getRafPromise().then(runnerFn);
            }
          }

          return { restartWebAnimationsNextTick }
        };


        const looperMethodN = () => {

          const acs = document.createElement('a-f');
          acs.id = 'a-f';

          const style = document.createElement('style');
          style.textContent = `
            @keyFrames aF1 {
              0% {
                order: 0;
              }
              100% {
                order: 6;
              }
            }
            #a-f[id] {
              visibility: collapse !important;
              position: fixed !important;
              top: -100px !important;
              left: -100px !important;
              margin:0 !important;
              padding:0 !important;
              outline:0 !important;
              border:0 !important;
              z-index:-1 !important;
              width: 0px !important;
              height: 0px !important;
              contain: strict !important;
              pointer-events: none !important;
              animation: 1ms steps(2) 0ms infinite alternate forwards running aF1 !important;
            }
          `;
          (document.head || document.documentElement).appendChild(style);

          document.documentElement.insertBefore(acs, document.documentElement.firstChild);

          const _onanimationiteration = function (evt) {
            const hRes = evt.timeStamp;
            var b = timeline;
            b.currentTime = hRes;
            b._discardAnimations();
            if (0 == b._animations.length) {
              restartWebAnimationsNextTickFlag = false;
              acs.onanimationiteration = null;
            } else {
              acs.onanimationiteration = _onanimationiteration;
            }

          }



          const restartWebAnimationsNextTick = () => {
            if (!restartWebAnimationsNextTickFlag) {
              restartWebAnimationsNextTickFlag = true;
              acs.onanimationiteration = _onanimationiteration;

            }
          }

          return { restartWebAnimationsNextTick }
        };



        const { restartWebAnimationsNextTick } = ('onanimationiteration' in document.documentElement) ? looperMethodN() : looperMethodT();


        // console.log(571, timProto);
        timProto._play = function (c) {
          c = new Animation(c, this);
          this._animations.push(c);
          restartWebAnimationsNextTick();
          c._updatePromises();
          c._animation.play();
          c._updatePromises();
          return c
        }

        const animationsWithPromisesMap = new Set(originalAnimationsWithPromises);
        originalAnimationsWithPromises.length = 0;
        originalAnimationsWithPromises.push = null;
        originalAnimationsWithPromises.splice = null;
        originalAnimationsWithPromises.slice = null;
        originalAnimationsWithPromises.indexOf = null;
        originalAnimationsWithPromises.unshift = null;
        originalAnimationsWithPromises.shift = null;
        originalAnimationsWithPromises.pop = null;
        originalAnimationsWithPromises.filter = null;
        originalAnimationsWithPromises.forEach = null;
        originalAnimationsWithPromises.map = null;


        const _updateAnimationsPromises = () => {
          animationsWithPromisesMap.forEach(c => {
            if (!c._updatePromises()) animationsWithPromisesMap.delete(c);
          });
          /*
          v.animationsWithPromises = v.animationsWithPromises.filter(function (c) {
            return c._updatePromises();
          });
          */
        }

        timProto._updateAnimationsPromises31 = timProto._updateAnimationsPromises;

        timProto._updateAnimationsPromises = _updateAnimationsPromises;

        delete timProto._updateAnimationsPromises;
        Object.defineProperty(timProto, '_updateAnimationsPromises', {
          get() {
            if (animationsWithPromisesMap.size === 0) return nilFn;
            return _updateAnimationsPromises;
          },
          set(nv) {
            delete this._updateAnimationsPromises;
            this._updateAnimationsPromises = nv;
          },
          enumerable: true,
          configurable: true,
        });


        let pdFinished = Object.getOwnPropertyDescriptor(aniProto, 'finished');
        aniProto.__finished_native_get__ = pdFinished.get;
        if (typeof pdFinished.get === 'function' && !pdFinished.set && pdFinished.configurable === true && pdFinished.enumerable === true) {


          Object.defineProperty(aniProto, 'finished', {
            get() {
              this._finishedPromise || (!animationsWithPromisesMap.has(this) && animationsWithPromisesMap.add(this),
                this._finishedPromise = new Promise((resolve, reject) => {
                  this._resolveFinishedPromise = function () {
                    resolve(this)
                  };
                  this._rejectFinishedPromise = function () {
                    reject({
                      type: DOMException.ABORT_ERR,
                      name: "AbortError"
                    })
                  };
                }),
                "finished" == this.playState && this._resolveFinishedPromise());
              return this._finishedPromise
            },
            set: undefined,
            enumerable: true,
            configurable: true
          });

        }



        let pdReady = Object.getOwnPropertyDescriptor(aniProto, 'ready');
        aniProto.__ready_native_get__ = pdReady.get;
        if (typeof pdReady.get === 'function' && !pdReady.set && pdReady.configurable === true && pdReady.enumerable === true) {

          Object.defineProperty(aniProto, 'ready', {
            get() {
              this._readyPromise || (!animationsWithPromisesMap.has(this) && animationsWithPromisesMap.add(this),
                this._readyPromise = new Promise((resolve, reject) => {
                  this._resolveReadyPromise = function () {
                    resolve(this)
                  };
                  this._rejectReadyPromise = function () {
                    reject({
                      type: DOMException.ABORT_ERR,
                      name: "AbortError"
                    })
                  };
                }),
                "pending" !== this.playState && this._resolveReadyPromise());
              return this._readyPromise
            },
            set: undefined,
            enumerable: true,
            configurable: true
          });

        }


        if (IGNORE_bindAnimationForCustomEffect && typeof aniProto._rebuildUnderlyingAnimation === 'function' && !aniProto._rebuildUnderlyingAnimation21 && aniProto._rebuildUnderlyingAnimation.length === 0) {

          aniProto._rebuildUnderlyingAnimation21 = aniProto._rebuildUnderlyingAnimation;
          const _rebuildUnderlyingAnimation = function () {
            // if (isNaN(this._sequenceNumber)) return; // do not rebuild underlying animation if native animation is used.
            this.effect && this.effect._onsample && (this.effect._onsample = null);
            return this._rebuildUnderlyingAnimation21();
          }
          aniProto._rebuildUnderlyingAnimation = _rebuildUnderlyingAnimation;
          // delete aniProto._rebuildUnderlyingAnimation;
          // Object.defineProperty(aniProto, '_rebuildUnderlyingAnimation', {
          //   get() {
          //     if (isNaN(this._sequenceNumber)) return nilFn;
          //     return this._rebuildUnderlyingAnimation21;
          //   },
          //   set(nv) {
          //     delete this._rebuildUnderlyingAnimation;
          //     this._rebuildUnderlyingAnimation = nv;
          //   },
          //   enumerable: true,
          //   configurable: true
          // });
        }


        /*


          function f(c) {
              var b = v.timeline;
              b.currentTime = c;
              b._discardAnimations();
              0 == b._animations.length ? d = !1 : requestAnimationFrame(f)
          }
          var h = window.requestAnimationFrame;
          window.requestAnimationFrame = function(c) {
              return h(function(b) {
                  v.timeline._updateAnimationsPromises();
                  c(b);
                  v.timeline._updateAnimationsPromises()
              })
          }
          ;
          v.AnimationTimeline = function() {
              this._animations = [];
              this.currentTime = void 0
          }
          ;
          v.AnimationTimeline.prototype = {
              getAnimations: function() {
                  this._discardAnimations();
                  return this._animations.slice()
              },
              _updateAnimationsPromises: function() {
                  v.animationsWithPromises = v.animationsWithPromises.filter(function(c) {
                      return c._updatePromises()
                  })
              },
              _discardAnimations: function() {
                  this._updateAnimationsPromises();
                  this._animations = this._animations.filter(function(c) {
                      return "finished" != c.playState && "idle" != c.playState
                  })
              },
              _play: function(c) {
                  c = new v.Animation(c,this);
                  this._animations.push(c);
                  v.restartWebAnimationsNextTick();
                  c._updatePromises();
                  c._animation.play();
                  c._updatePromises();
                  return c
              },
              play: function(c) {
                  c && c.remove();
                  return this._play(c)
              }
          };
          var d = !1;
          v.restartWebAnimationsNextTick = function() {
              d || (d = !0,
              requestAnimationFrame(f))
          }
          ;
          var a = new v.AnimationTimeline;
          v.timeline = a;
          try {
              Object.defineProperty(window.document, "timeline", {
                  configurable: !0,
                  get: function() {
                      return a
                  }
              })
          } catch (c) {}
          try {
              window.document.timeline = a
          } catch (c) {}

        */



        /*

      var g = window.getComputedStyle;
      Object.defineProperty(window, "getComputedStyle", {
          configurable: !0,
          enumerable: !0,
          value: function() {
              v.timeline._updateAnimationsPromises();
              var e = g.apply(this, arguments);
              h() && (e = g.apply(this, arguments));
              v.timeline._updateAnimationsPromises();
              return e
          }
      });

      */




      }




    })();




    promiseForCustomYtElementsReady.then(() => {

      FIX_ytdExpander_childrenChanged && customElements.whenDefined('ytd-expander').then(() => {



        let dummy;
        let cProto;



        dummy = document.createElement('ytd-expander');
        cProto = (dummy.inst || dummy).constructor.prototype;


        if (fnIntegrity(cProto.initChildrenObserver, '0.48.21') && fnIntegrity(cProto.childrenChanged, '0.40.22')) {


          cProto.initChildrenObserver14 = cProto.initChildrenObserver;
          cProto.childrenChanged14 = cProto.childrenChanged;

          cProto.initChildrenObserver = function () {
            var a = this;
            this.observer = new MutationObserver(function () {
              a.childrenChanged()
            }
            );
            this.observer.observe(this.content, {
              subtree: !0,
              childList: !0,
              attributes: !0,
              characterData: !0
            });
            this.childrenChanged()
          }
            ;
          cProto.childrenChanged = function () {
            if (this.alwaysToggleable) {
              this.canToggle = this.alwaysToggleable;
            } else if (!this.canToggleJobId) {
              this.canToggleJobId = 1;
              getRafPromise().then(() => {
                this.canToggleJobId = 0;
                this.calculateCanCollapse()
              })
            }
          }


          // console.log(cProto.initChildrenObserver)
          console.debug('ytd-expander-fix-childrenChanged');

        }

      })



      FIX_paper_ripple_animate && customElements.whenDefined('paper-ripple').then(() => {



        let dummy;
        let cProto;
        dummy = document.createElement('paper-ripple');
        cProto = (dummy.inst || dummy).constructor.prototype;

        if (fnIntegrity(cProto.animate, '0.74.5')) {


          cProto.animate34 = cProto.animate;
          cProto.animate = function () {
            if (this._animating) {
              var a;
              const ripples = this.ripples;
              for (a = 0; a < ripples.length; ++a) {
                var b = ripples[a];
                b.draw();
                this.$.background.style.opacity = b.outerOpacity;
                b.isOpacityFullyDecayed && !b.isRestingAtMaxRadius && this.removeRipple(b)
              }
              if ((this.shouldKeepAnimating || 0) !== ripples.length) {
                if (!this._boundAnimate38) this._boundAnimate38 = this.animate.bind(this);
                getRafPromise().then(this._boundAnimate38);
              } else {
                this.onAnimationComplete()
              }
            }
          }

          console.debug('FIX_paper_ripple_animate')

          // console.log(cProto.animate)

        }

      });

      if (FIX_doIdomRender) {


        const xsetTimeout = function (f, d) {
          if (xsetTimeout.m511 === 1 && !d) {
            xsetTimeout.m511 = 2;
            getRafPromise().then(f);
          } else {
            return setTimeout.apply(window, arguments)
          }

        }

        const xrequestAnimationFrame = function (f) {
          const h = f + "";
          if (h.startsWith("function(){setTimeout(function(){") && h.endsWith("})}")) {
            xsetTimeout.m511 = 1;
            f();
            xsetTimeout.m511 = 0;
          } else if (h.includes("requestAninmationFrameResolver")) {
            getRafPromise().then(f);
          } else {
            return requestAnimationFrame.apply(window, arguments);
          }
        }

        let busy = false;
        const doIdomRender = function () {
          if (busy) {
            return this.doIdomRender13.apply(this, arguments);
          }
          busy = true;
          const { requestAnimationFrame, setTimeout } = window;
          window.requestAnimationFrame = xrequestAnimationFrame;
          window.setTimeout = xsetTimeout;
          let r = this.doIdomRender13.apply(this, arguments);
          window.requestAnimationFrame = requestAnimationFrame;
          window.setTimeout = setTimeout;
          busy = false;
          return r;
        };
        for (const ytTag of ['ytd-lottie-player', 'yt-attributed-string', 'yt-image', 'yt-icon-shape', 'yt-button-shape', 'yt-button-view-model', 'yt-icon-badge-shape']) {


          customElements.whenDefined(ytTag).then(() => {

            let dummy;
            let cProto;
            dummy = document.createElement(ytTag);
            cProto = (dummy.inst || dummy).constructor.prototype;

            cProto.doIdomRender13 = cProto.doIdomRender;
            cProto.doIdomRender = doIdomRender;

            if (cProto.doIdomRender13 === cProto.templatingFn) cProto.templatingFn = doIdomRender;

            console.debug('FIX_doIdomRender', ytTag)



          });

        }

      }



    });

  });


  setupEvents();



  if (isMainWindow) {

    console.groupCollapsed(
      "%cYouTube JS Engine Tamer",
      "background-color: #EDE43B ; color: #000 ; font-weight: bold ; padding: 4px ;"
    );



    console.log("Script is loaded.");
    console.log("This script changes the core mechanisms of the YouTube JS engine.");

    console.log("This script is experimental and subject to further changes.");

    console.log("This might boost your YouTube performance.");

    console.log("CAUTION: This might break your YouTube.");


    if (prepareLogs.length >= 1) {
      console.log(" =========================================================================== ");

      for (const msg of prepareLogs) {
        console.log(msg)
      }

      console.log(" =========================================================================== ");
    }

    console.groupEnd();

  }






})();