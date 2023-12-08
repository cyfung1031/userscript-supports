// ==UserScript==
// @name        YouTube: Single Column Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @unwrap
// @inject-into page
// @version     0.0.2
// @author      CY Fung
// @description Re-adoption of Single Column Detection against video and browser sizes
// @license MIT
// ==/UserScript==

(() => {
  const ENABLE_WHEN_CONTENT_OCCUPY_MORE_THAN = 0.2 // 20% or more of other content can be displayed in your browser

  // protait screen & vertical live


  let always_single_column = false;
  let bypass = false;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

  const Promise = (async () => { })().constructor;

  let videoRatio = null;

  const getProto = (element) => {
    if (element) {
      const cnt = insp(element);
      return cnt.constructor.prototype || null;
    }
    return null;
  }

  let qm = 0;

  function changeQ(q) {

    if (!q || typeof q !== 'string') return q;

    q = q.replace('1000px', '200.2px');
    q = q.replace('629px', '129.2px');
    q = q.replace('657px', '157.2px');
    q = q.replace('630px', '130.2px');
    q = q.replace('1327px', '237.2px');

    return q;

  }


  function changeQ_alwaysSingleColumn(q) {

    if (!q || typeof q !== 'string') return q;

    q = q.replace('1000px', '998200.3px');
    q = q.replace('629px', '998129.3px');
    q = q.replace('657px', '998157.3px');
    q = q.replace('630px', '998130.3px');
    q = q.replace('1327px', '998237.3px');

    return q;

  }


  const querySet = new Set();
  (async () => {

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

          if (always_single_column) {
            q = changeQ_alwaysSingleColumn(this.lastQuery53_);
          } else if (qm) {
            q = changeQ(this.lastQuery53_);
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

  })();


  function getShouldSingleColumn() {
    const { clientHeight, clientWidth } = document.documentElement;
    if (clientHeight > clientWidth) {
      let referenceVideoHeight = clientWidth * videoRatio;
      let belowSpace = clientHeight - referenceVideoHeight;
      if (belowSpace > -1e-3) {
        if (belowSpace - ENABLE_WHEN_CONTENT_OCCUPY_MORE_THAN * clientHeight >= -1e-3) {
          return true;
        }
      }
    }
    return false;
  }


  (async () => {

    await customElements.whenDefined('ytd-watch-flexy');
    const dummy = document.querySelector('ytd-watch-flexy') || document.createElement('ytd-watch-flexy');
    const cProto = getProto(dummy);

    cProto.videoHeightToWidthRatioChanged23_ = cProto.videoHeightToWidthRatioChanged_;
    const ratioQueryFix24_ = (k) => {

      if (videoRatio > 1e-5) { } else return;
      let changeCSS = false;

      let always_single_column_ = always_single_column;
      always_single_column = typeof k === 'boolean' ? k : getShouldSingleColumn();
      let action = 0;
      if (always_single_column !== always_single_column_) {
        action |= 4;
      }
      if (!always_single_column) {
        if (videoRatio > 1.6 && videoRatio < 2.7) {
          if (!qm) {
            changeCSS = true;
            qm = 1;
            action |= 1;
          }
        } else {
          if (qm) {
            changeCSS = true;
            qm = 0;
            action |= 2;
          }
        }
      }
      if (action) {
        for (const p of querySet) {
          let elm = p.deref();
          if (!elm || !elm.lastQuery53_) continue;
          if (action & 4) {
            if (!elm.q00 && !elm.q02 && always_single_column) {
              elm.q00 = elm.lastQuery53_;
              elm.q02 = changeQ_alwaysSingleColumn(elm.q00);
            }
            action |= 8;
          }
          if (action & 1) {
            if (!elm.q00 && !elm.q01) {
              elm.q00 = elm.lastQuery53_;
              elm.q01 = changeQ(elm.q00);
            }
            if (elm.q00 && elm.q01) {
              action |= 8;
            }
          } else if (action & 2) {
            if (elm.q00 && elm.q01) {
              action |= 8;
            }
          }
        }

        if (action & 8) {
          bypass = true;
          for (const p of querySet) {
            let elm = p.deref();
            if (!elm) continue;
            if (elm.lastQuery53_ && elm.query) {
              elm.queryChanged();
            }
          }
          bypass = false;
        }

      }

      let cssElm = null;

      if (changeCSS) {

        cssElm = cssElm | document.querySelector('style#oh7T7lsvcHJQ');

        if (!cssElm) {

          cssElm = document.createElement('style');
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

        }
      }

      cssElm = cssElm | document.querySelector('style#oh7T7lsvcHJQ');
      if (cssElm) {
        if (qm && cssElm.disabled) cssElm.disabled = false;
        else if (!qm && !cssElm.disabled) cssElm.disabled = true;
      }
    };

    cProto.videoHeightToWidthRatioChanged_ = function () {
      videoRatio = this.videoHeightToWidthRatio_;
      Promise.resolve().then(ratioQueryFix24_);
      return this.videoHeightToWidthRatioChanged23_.apply(this, arguments);
    };

    let resizeBusy = false;
    let resizeQuene = Promise.resolve();

    Window.prototype.addEventListener.call(window, 'resize', function () {
      if (videoRatio > 1e-5) { } else return;
      if (resizeBusy) return;
      resizeBusy = true;
      resizeQuene = resizeQuene.then(() => {
        let k = getShouldSingleColumn();
        if (always_single_column !== k) {
          Promise.resolve(k).then(ratioQueryFix24_);
        }
      }).then(() => {
        resizeBusy = false;
      });
    }, { capture: false, passive: true });

  })();

})();
