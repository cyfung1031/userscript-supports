// ==UserScript==
// @name        YouTube: Single Column Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @unwrap
// @inject-into page
// @version     0.1.7
// @author      CY Fung
// @description Re-adoption of Single Column Detection against video and browser sizes
// @require     https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@8fac46500c5a916e6ed21149f6c25f8d1c56a6a3/library/ytZara.js
// @require     https://update.greasyfork.org/scripts/475632/1359675/ytConfigHacks.js
// @license     MIT
// ==/UserScript==

(() => {
  const ENABLE_WHEN_CONTENT_OCCUPY_MORE_THAN = 0.2 // 20% or more of other content can be displayed in your browser

  // protait screen & vertical live

  let _isSingleColumnPreferred = false;
  let bypass = false;
  let videoRatio = null;
  let _forceTwoCols = 0;
  let cachedSCUsage = null;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

  const Promise = (async () => { })().constructor;

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

  let rafPromise = null;
  const rafFn = (typeof webkitRequestAnimationFrame !== 'undefined' ? webkitRequestAnimationFrame : requestAnimationFrame).bind(window); // eslint-disable-line no-undef, no-constant-condition

  const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
    rafFn(hRes => {
      rafPromise = null;
      resolve(hRes);
    });
  }));

  const getProto = (element) => {
    if (element) {
      const cnt = insp(element);
      return cnt.constructor.prototype || null;
    }
    return null;
  };

  function toQueryForcedTwoCols(q) {
    if (q && typeof q === 'string') {
      q = q.replace('1000px', '200.2px');
      q = q.replace('629px', '129.2px');
      q = q.replace('657px', '157.2px');
      q = q.replace('630px', '130.2px');
      q = q.replace('1327px', '237.2px');
    }
    return q;
  }

  function toQueryForcedOneCol(q) {
    if (q && typeof q === 'string') {
      q = q.replace('1000px', '998200.3px');
      q = q.replace('629px', '998129.3px');
      q = q.replace('657px', '998157.3px');
      q = q.replace('630px', '998130.3px');
      q = q.replace('1327px', '998237.3px');
    }
    return q;
  }

  function getShouldSingleColumn() {
    if (typeof cachedSCUsage == 'boolean') return cachedSCUsage;
    const { clientHeight, clientWidth } = document.documentElement;
    if (clientHeight > clientWidth) {
      const referenceVideoHeight = clientWidth * videoRatio;
      const belowSpace = clientHeight - referenceVideoHeight;
      if (belowSpace > -1e-3 && belowSpace - ENABLE_WHEN_CONTENT_OCCUPY_MORE_THAN * clientHeight > -1e-3 && belowSpace > 65) {
        return (cachedSCUsage = true);
      }
    }
    return (cachedSCUsage = false);
  }

  /** @type {Set<WeakRef<Object>>} */
  const querySet = new Set();
  const protoFnQueryChanged = async () => {

    await customElements.whenDefined('iron-media-query');
    const dummy = document.querySelector('iron-media-query') || document.createElement('iron-media-query');
    const cProto = getProto(dummy);

    if (typeof cProto.queryChanged !== 'function') return;
    if (cProto.queryChanged71) return;
    if (cProto.queryChanged.length !== 0) return;
    cProto.queryChanged71 = cProto.queryChanged;

    cProto.queryChanged = function () {

      /** @type {string} */
      let q = this.query;

      if (q) {

        if (!this.addedToSet53_) {
          this.addedToSet53_ = 1;
          querySet.add(new WeakRef(this));
        }

        if (!bypass) {
          if (q.length > 3 && !q.includes('.')) {
            this.lastQuery53_ = q;
          }
        }


        if (this.lastQuery53_) {

          if (_isSingleColumnPreferred) {
            q = toQueryForcedOneCol(this.lastQuery53_);
          } else if (_forceTwoCols) {
            q = toQueryForcedTwoCols(this.lastQuery53_);
          } else {
            q = this.lastQuery53_;
          }

        }

        if (q !== this.query && typeof q === 'string' && q) {
          this.query = q;
        }

      }

      return this.queryChanged71();

    }

  };

  const createCSSElement = ()=>{
    
    const cssElm = document.createElement('style');
    cssElm.id = 'oh7T7lsvcHJQ';
    document.head.appendChild(cssElm);

    cssElm.textContent = `

        ytd-watch-flexy[flexy][is-two-columns_] {
          --ytd-watch-flexy-min-player-height-ss: 10px;
        }
        ytd-watch-flexy[flexy][is-two-columns_] #primary.ytd-watch-flexy {
          min-width: calc(var(--ytd-watch-flexy-min-player-height-ss)*1.7777777778);
        }
        ytd-watch-flexy[flexy][is-two-columns_]:not([is-four-three-to-sixteen-nine-video_]):not([is-extra-wide-video_]):not([full-bleed-player][full-bleed-no-max-width-columns]):not([fixed-panels]) #primary.ytd-watch-flexy {
          min-width: calc(var(--ytd-watch-flexy-min-player-height-ss)*1.7777777778);
        }
    `;
    return cssElm;
  }

  const protoFnRatioChanged = async () => {

    await customElements.whenDefined('ytd-watch-flexy');
    const dummy = document.querySelector('ytd-watch-flexy') || document.createElement('ytd-watch-flexy');
    const cProto = getProto(dummy);

    if (typeof cProto.videoHeightToWidthRatioChanged_ !== 'function') return;
    if (cProto.videoHeightToWidthRatioChanged23_) return;
    // if (cProto.videoHeightToWidthRatioChanged_.length !== 2) return;

    cProto.videoHeightToWidthRatioChanged23_ = cProto.videoHeightToWidthRatioChanged_;
    const ratioQueryFix24_ = () => {

      if (videoRatio > 1e-5) { } else return;
      let changeCSS = false;

      const changedSingleColumn = _isSingleColumnPreferred !== (_isSingleColumnPreferred = getShouldSingleColumn());
      let action = 0;
      if (changedSingleColumn) {
        action |= 4;
      }
      if (!_isSingleColumnPreferred) {
        const isVerticalRatio = videoRatio > 1.6 && videoRatio < 2.7;
        if (isVerticalRatio && !_forceTwoCols) {
          changeCSS = true;
          _forceTwoCols = 1;
          action |= 1;
        } else if (!isVerticalRatio && _forceTwoCols) {
          changeCSS = true;
          _forceTwoCols = 0;
          action |= 2;
        }
      }
      if (action) {
        for (const p of querySet) {
          const qnt = p.deref();
          if (!qnt || !qnt.lastQuery53_) continue;
          if (action & 4) {
            if (!qnt.q00 && !qnt.q02 && _isSingleColumnPreferred) {
              qnt.q00 = qnt.lastQuery53_;
              qnt.q02 = toQueryForcedOneCol(qnt.q00);
            }
            action |= 8;
          }
          if (action & 1) {
            if (!qnt.q00 && !qnt.q01) {
              qnt.q00 = qnt.lastQuery53_;
              qnt.q01 = toQueryForcedTwoCols(qnt.q00);
            }
            if (qnt.q00 && qnt.q01) {
              action |= 8;
            }
          } else if (action & 2) {
            if (qnt.q00 && qnt.q01) {
              action |= 8;
            }
          }
        }

        if (action & 8) {
          bypass = true;
          for (const p of querySet) {
            const qnt = p.deref();
            if (qnt && qnt.lastQuery53_ && qnt.query) {
              qnt.queryChanged();
            }
          }
          bypass = false;
        }

      }

      let cssElm = null;

      if (changeCSS) {
        cssElm = cssElm || document.querySelector('style#oh7T7lsvcHJQ') || createCSSElement();
      } else {
        cssElm = cssElm || document.querySelector('style#oh7T7lsvcHJQ');
      }
      
      if (cssElm) {
        if (_forceTwoCols && cssElm.disabled) cssElm.disabled = false;
        else if (!_forceTwoCols && !cssElm.disabled) cssElm.disabled = true;
      }
    };

    const resizePipeline = createPipeline();

    cProto.videoHeightToWidthRatioChanged_ = function () {
      try {
        cachedSCUsage = null;
        videoRatio = this.videoHeightToWidthRatio_;
        resizePipeline(ratioQueryFix24_);
      } catch (e) {
      }
      return this.videoHeightToWidthRatioChanged23_(...arguments);
    };

    let rzid = 0;
    Window.prototype.addEventListener.call(window, 'resize', function () {
      cachedSCUsage = null;
      if (videoRatio > 1e-5) { } else return;
      if (rzid > 1e9) rzid = 9;
      const t = ++rzid;
      resizePipeline(async () => {
        if (t !== rzid) return;
        await getRafPromise();
        if (t !== rzid) return;
        let k = getShouldSingleColumn();
        if (_isSingleColumnPreferred !== k) {
          resizePipeline(ratioQueryFix24_);
        }
      });
    }, { capture: false, passive: true });

  };

  window._ytConfigHacks.add((config_) => {

    const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS;

    if (EXPERIMENT_FLAGS) {

      EXPERIMENT_FLAGS.kevlar_set_internal_player_size = false; // vertical live -> schedulePlayerSizeUpdate_

    }

  });

  (async () => {

    if (!document.documentElement) await ytZara.docInitializedAsync(); // wait for document.documentElement is provided

    await ytZara.promiseRegistryReady(); // wait for YouTube's customElement Registry is provided (old browser only)

    protoFnQueryChanged();
    protoFnRatioChanged();

  })();

})();
