// ==UserScript==
// @name        Disable all YouTube EXPERIMENT_FLAGS
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.2.4
// @license     MIT
// @author      CY Fung
// @description To Disable all YouTube EXPERIMENT_FLAGS
// @grant       none
// @unwrap
// @run-at      document-start
// @allFrames   true
// @inject-into page
// ==/UserScript==

((__CONTEXT__) => {

  const DISABLE_CINEMATICS = false;
  const NO_SerializedExperiment = true;
  // cinematic feature is no longer an experimential feature.
  // It has been officially implemented.
  // To disable cinematics, the user shall use other userscripts or just turn off the option in the video options.


  const win = this || window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'jmimcvowrlzl';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  const Promise = ((async () => { })()).constructor;

  const cleanContext = async (win) => {
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
      const { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout } = fc;
      const res = { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  cleanContext(win).then(__CONTEXT__ => {

    let fStop = false;
    let isMainWindow = false;
    let mz = new Set();
    try {
      isMainWindow = window.document === window.top.document
    } catch (e) { }

    const { requestAnimationFrame, setInterval, clearInterval, setTimeout, clearTimeout } = __CONTEXT__;

    let zPlayerKevlar = false;

    function fixSerializedExperiment(conf) {

      let ids = null, flags = null;

      if (typeof conf.serializedExperimentIds === 'string') {
        ids = conf.serializedExperimentIds.split(',');
        let newIds = [];
        for (const id of ids) {
          let keep = false;
          if (keep) {
            newIds.push(id);
          }
        }
        conf.serializedExperimentIds = newIds.join(',');
      }

      if (typeof conf.serializedExperimentFlags === 'string') {
        const fg = conf.serializedExperimentFlags;
        const rx = /(^|&)(\w+)=([^=&|\s\{\}\[\]\(\)?]*)/g;

        let res = [];

        for (let m; m = rx.exec(fg);) {
          let key = m[2];
          let value = m[3];
          let keep = false;
          if (key === 'html5_exponential_memory_for_sticky' || key.startsWith('h5_expr_')) {
            keep = true;
          }
          if (keep) res.push(`${key}=${value}`);
        }

        conf.serializedExperimentFlags = res.join('&');

      }



    }




    function f() {
      if (fStop) return;
      let EXPERIMENT_FLAGS = null;
      try {
        EXPERIMENT_FLAGS = yt.config_.EXPERIMENT_FLAGS
      } catch (e) { }

      if (EXPERIMENT_FLAGS) {

        if (isMainWindow) {
          for (const [key, value] of Object.entries(EXPERIMENT_FLAGS)) {

            if (value === true) {
              // if(key.indexOf('modern')>=0 || key.indexOf('enable')>=0 || key.indexOf('theme')>=0 || key.indexOf('skip')>=0  || key.indexOf('ui')>=0 || key.indexOf('observer')>=0 || key.indexOf('polymer')>=0 )continue;

              if (mz.has(key)) continue;
              mz.add(key);
              const kl = key.length;
              const kl7 = kl % 7;
              const kl5 = kl % 5;
              const kl3 = kl % 3;
              const kl2 = kl % 2;
              if (!DISABLE_CINEMATICS) {

                let cineKey = key === 'enable_cinematic_blur_desktop_loading' ? 1
                  : key === 'kevlar_watch_cinematics' ? 2
                    : key === 'web_cinematic_masthead' ? 3
                      : key === 'web_watch_cinematics_preferred_reduced_motion_default_disabled' ? 4 : 0;
                if (cineKey > 0) {
                  return;
                }
              }

              if (key.indexOf('kevlar_') >= 0) {

                if (kl7 === 5 && kl5 == 4 && kl2 === 1 && kl3 === 1) {
                  if (key === 'kevlar_system_icons') continue;
                }

                // if(key==='kevlar_prefetch_data_augments_network_data') continue;

                if (kl7 === 6 && kl5 === 0 && kl3 === 2 && kl2 === 0) { // home page / watch page icons

                  if (key === 'kevlar_three_dot_ink') continue;
                  if (key === 'kevlar_use_wil_icons') continue;
                  if (key === 'kevlar_home_skeleton') continue;
                }

                if (kl7 === 4 && kl5 === 0 && kl3 === 1 && kl2 === 1) {

                  if (key === 'kevlar_fluid_touch_scroll') continue;
                  if (key === 'kevlar_watch_color_update') continue;
                  if (key === 'kevlar_use_vimio_behavior') continue; // home page - channel icon

                }

                if (kl3 === 2 && kl5 === 4 && kl2 < 2) {  // collapsed meta
                  // no teaser, use latest collapsed meta design
                  if (key === 'kevlar_structured_description_content_inline') continue;
                  if (key === 'kevlar_watch_metadata_refresh') continue;

                }


                if (kl5 === 3 && kl3 === 1 && kl2 === 0) {

                  if (key === 'kevlar_watch_js_panel_height') continue; // affect Tabview Youtube


                }


              } else {

                if (kl7 === 3 && kl5 == 1 && kl2 === 1 && kl3 === 1) {
                  if (key === 'web_darker_dark_theme_live_chat') continue;
                }

                if (kl5 === 1 && kl3 === 0 && kl2 === 1 && kl7 === 0) {
                  if (key === 'web_darker_dark_theme') return; // it also affect cinemtaics
                }

                if (kl3 === 0 && kl5 === 2) {  // modern menu

                  if (key === 'web_button_rework_with_live') continue;
                  if (key === 'web_fix_fine_scrubbing_drag') continue;
                }


                if (kl3 === 1 && kl5 === 4 && kl2 === 1) {  // full screen -buggy
                  if (key === 'external_fullscreen') continue;
                }

                if (kl3 === 0 && kl5 === 3 && kl2 === 0) { // minimize menu
                  if (key === 'web_modern_buttons') continue;
                  if (key === 'web_modern_dialogs') continue;

                }

                if (kl3 === 1 && kl5 === 0 && kl7 === 5 && kl2 === 0) { // Tabview Youtube - multiline transcript
                  if (key === 'enable_mixed_direction_formatted_strings') continue;
                }

              }






              // console.log(key)
              EXPERIMENT_FLAGS[key] = false;
            }

          }
        } else {


          for (const [key, value] of Object.entries(EXPERIMENT_FLAGS)) {

            if (value === true) {
              // if(key.indexOf('modern')>=0 || key.indexOf('enable')>=0 || key.indexOf('theme')>=0 || key.indexOf('skip')>=0  || key.indexOf('ui')>=0 || key.indexOf('observer')>=0 || key.indexOf('polymer')>=0 )continue;

              if (mz.has(key)) continue;
              mz.add(key);




              // console.log(key)
              EXPERIMENT_FLAGS[key] = false;
            }

          }


        }

        EXPERIMENT_FLAGS.desktop_delay_player_resizing = false;
        EXPERIMENT_FLAGS.web_animated_like = false;
        EXPERIMENT_FLAGS.web_animated_like_lazy_load = false;

        // EXPERIMENT_FLAGS.kevlar_prefetch_data_augments_network_data = true; // TBC

        let isYtLoaded = false;
        try {
          isYtLoaded = typeof ytcfg.set === 'function';
        } catch (e) { }
        if (isYtLoaded) {
          Promise.resolve().then(fhandler);
        }

      }

      let playerKevlar = null;

      try {
        playerKevlar = ytcfg.data_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH;
      } catch (e) { }

      if (playerKevlar && !zPlayerKevlar) {
        zPlayerKevlar = true;

        if (NO_SerializedExperiment && typeof playerKevlar.serializedExperimentFlags === 'string' && typeof playerKevlar.serializedExperimentIds === 'string') {
          fixSerializedExperiment(playerKevlar);
        }


      }



    }
    let cid = setInterval(f, 1);
    (async () => {
      while (true) {
        f();
        if (fStop) break;
        await (new Promise(requestAnimationFrame));
      }
    })();
    f();
    function fhandler() {
      if (fStop) return;
      Promise.resolve().then(() => {
        if (cid) {
          cid && clearInterval(cid); cid = 0;
          f();
        }
        fStop = true;
      });
      document.removeEventListener('yt-page-data-fetched', fhandler, false);
      document.removeEventListener('yt-navigate-finish', fhandler, false);
      document.removeEventListener('spfdone', fhandler, false);
    }
    document.addEventListener('yt-page-data-fetched', fhandler, false);
    document.addEventListener('yt-navigate-finish', fhandler, false);
    document.addEventListener('spfdone', fhandler, false);


    function onReady() {
      if (!fStop) {
        setTimeout(() => {
          !fStop && fhandler();
        }, 1000);
      }
    }

    Promise.resolve().then(() => {
      if (document.readyState !== 'loading') {
        onReady();
      } else {
        window.addEventListener("DOMContentLoaded", onReady, false);
      }
    });

  });

})(null);
