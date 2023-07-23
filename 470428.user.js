// ==UserScript==
// @name        YouTube EXPERIMENT_FLAGS Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.4.3
// @license     MIT
// @author      CY Fung
// @icon        https://github.com/cyfung1031/userscript-supports/raw/main/icons/yt-engine.png
// @description Adjust EXPERIMENT_FLAGS
// @grant       none
// @unwrap
// @run-at      document-start
// @allFrames   true
// @inject-into page
// ==/UserScript==

((__CONTEXT__) => {

  // Purpose 1: Remove Obsolete Flags
  // Purpose 2: Remove Flags bring no visual difference
  // Purpose 3: Enable Flags bring performance boost

  const DISABLE_CINEMATICS = false;
  const NO_SerializedExperiment = true;
  const KEEP_PLAYER_QUALITY_STICKY = true;
  const DISABLE_serializedExperimentIds = true;
  const DISABLE_serializedExperimentFlags = true;
  const ENABLE_EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST = {
    defaultValue: true,
    useExternal: () => typeof localStorage.EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST !== 'undefined',
    externalValue: () => (+localStorage.EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST ? true : false)
  };
  const ENABLE_EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS = {
    defaultValue: true,
    useExternal: () => typeof localStorage.EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS !== 'undefined',
    externalValue: () => (+localStorage.EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS ? true : false)
  };
  const ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH = {
    defaultValue: true,
    useExternal: () => typeof localStorage.ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH !== 'undefined',
    externalValue: () => (+localStorage.ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH ? true : false)
  };



  // TBC
  // kevlar_tuner_should_always_use_device_pixel_ratio
  // kevlar_tuner_should_clamp_device_pixel_ratio
  // kevlar_tuner_clamp_device_pixel_ratio
  // kevlar_tuner_should_use_thumbnail_factor
  // kevlar_tuner_thumbnail_factor
  // kevlar_tuner_min_thumbnail_quality
  // kevlar_tuner_max_thumbnail_quality

  // kevlar_tuner_should_test_visibility_time_between_jobs
  // kevlar_tuner_visibility_time_between_jobs_ms

  // kevlar_tuner_default_comments_delay
  // kevlar_tuner_run_default_comments_delay 

  let settled = null;
  // cinematic feature is no longer an experimential feature.
  // It has been officially implemented.
  // To disable cinematics, the user shall use other userscripts or just turn off the option in the video options.

  const getSettingValue = (fm) => fm.useExternal() ? fm.externalValue() : fm.defaultValue;

  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'jmimcvowrlzl';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = ((async () => { })()).constructor;

  let isMainWindow = false;
  let mzFlagDetected = new Set();
  let zPlayerKevlar = false;
  try {
    isMainWindow = window.document === window.top.document
  } catch (e) { }

  function fixSerializedExperiment(conf) {

    if (DISABLE_serializedExperimentIds && typeof conf.serializedExperimentIds === 'string') {
      let ids = conf.serializedExperimentIds.split(',');
      let newIds = [];
      for (const id of ids) {
        let keep = false;
        if (keep) {
          newIds.push(id);
        }
      }
      conf.serializedExperimentIds = newIds.join(',');
    }

    if (DISABLE_serializedExperimentFlags && typeof conf.serializedExperimentFlags === 'string') {
      const fg = conf.serializedExperimentFlags;
      const rx = /(^|&)(\w+)=([^=&|\s\{\}\[\]\(\)?]*)/g;
      let res = [];
      for (let m; m = rx.exec(fg);) {
        let key = m[2];
        let value = m[3];
        let keep = false;
        if (KEEP_PLAYER_QUALITY_STICKY) {
          if (key === 'html5_exponential_memory_for_sticky' || key.startsWith('h5_expr_')) {
            keep = true;
          }
        }
        if (keep) res.push(`${key}=${value}`);
      }
      conf.serializedExperimentFlags = res.join('&');
    }

  }


  const hLooper = ((fn) => {

    let nativeFnLoaded = false;
    let kc1 = 0;

    const setIntervalW = setInterval;
    const clearIntervalW = clearInterval;
    let microDisconnectFn = null;
    let fStopLooper = false;
    const looperFn = () => {
      if (fStopLooper) return;

      let config_ = null;
      let EXPERIMENT_FLAGS = null;
      try {
        config_ = yt.config_;
        EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS
      } catch (e) { }

      if (EXPERIMENT_FLAGS) {

        fn(EXPERIMENT_FLAGS, config_);

        if (microDisconnectFn) {
          let isYtLoaded = false;
          try {
            isYtLoaded = typeof ytcfg.set === 'function';
          } catch (e) { }
          if (isYtLoaded) {
            microDisconnectFn();
          }
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



    };

    const controller = {
      start() {
        kc1 = setIntervalW(looperFn, 1);
        (async () => {
          while (true && !nativeFnLoaded) {
            looperFn();
            if (fStopLooper) break;
            await (new Promise(requestAnimationFrame));
          }
        })();
        looperFn();
      },
      /**
       * 
       * @param {Window} __CONTEXT__ 
       */
      setupForCleanContext(__CONTEXT__) {

        const { requestAnimationFrame, setInterval, clearInterval, setTimeout, clearTimeout } = __CONTEXT__;

        (async () => {
          while (true) {
            looperFn();
            if (fStopLooper) break;
            await (new Promise(requestAnimationFrame));
          }
        })();

        let kc2 = setInterval(looperFn, 1);

        const marcoDisconnectFn = () => {
          if (fStopLooper) return;
          Promise.resolve().then(() => {
            if (kc1 || kc2) {
              kc1 && clearIntervalW(kc1); kc1 = 0;
              kc2 && clearInterval(kc2); kc2 = 0;
              looperFn();
            }
            fStopLooper = true;
          });
          document.removeEventListener('yt-page-data-fetched', marcoDisconnectFn, false);
          document.removeEventListener('yt-navigate-finish', marcoDisconnectFn, false);
          document.removeEventListener('spfdone', marcoDisconnectFn, false);
        };
        document.addEventListener('yt-page-data-fetched', marcoDisconnectFn, false);
        document.addEventListener('yt-navigate-finish', marcoDisconnectFn, false);
        document.addEventListener('spfdone', marcoDisconnectFn, false);


        function onReady() {
          if (!fStopLooper) {
            setTimeout(() => {
              !fStopLooper && marcoDisconnectFn();
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

        nativeFnLoaded = true;

        microDisconnectFn = () => Promise.resolve(marcoDisconnectFn).then(setTimeout);

      }
    };

    return controller;
  })((EXPERIMENT_FLAGS, config_) => {

    if (!EXPERIMENT_FLAGS) return;

    if (!settled) {
      settled = {
        use_maintain_stable_list: getSettingValue(ENABLE_EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST),
        use_maintain_reuse_components: getSettingValue(ENABLE_EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS),
        use_defer_detach: getSettingValue(ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH),
      }
      if (settled.use_maintain_stable_list) Promise.resolve().then(() => console.debug("use_maintain_stable_list"));
      if (settled.use_maintain_reuse_components) Promise.resolve().then(() => console.debug("use_maintain_reuse_components"));
      if (settled.use_defer_detach) Promise.resolve().then(() => console.debug("use_defer_detach"));
    }
    const { use_maintain_stable_list, use_maintain_reuse_components, use_defer_detach } = settled;

    const setFalseFn = (EXPERIMENT_FLAGS) => {


      for (const [key, value] of Object.entries(EXPERIMENT_FLAGS)) {


        if (value === true) {
          // if(key.indexOf('modern')>=0 || key.indexOf('enable')>=0 || key.indexOf('theme')>=0 || key.indexOf('skip')>=0  || key.indexOf('ui')>=0 || key.indexOf('observer')>=0 || key.indexOf('polymer')>=0 )continue;

          if (mzFlagDetected.has(key)) continue;
          mzFlagDetected.add(key);
          const kl = key.length;
          const kl7 = kl % 7;
          const kl5 = kl % 5;
          const kl3 = kl % 3;
          const kl2 = kl % 2;

          if (!DISABLE_CINEMATICS) {

 
              if(key ==='kevlar_measure_ambient_mode_idle' || key ==='kevlar_watch_cinematics_invisible'  || key === 'web_cinematic_theater_mode' || key ==='web_cinematic_fullscreen' ){
                continue;
              } 


            let cineKey = key === 'enable_cinematic_blur_desktop_loading' ? 1
              : key === 'kevlar_watch_cinematics' ? 2
                : key === 'web_cinematic_masthead' ? 3
                  : key === 'web_watch_cinematics_preferred_reduced_motion_default_disabled' ? 4 : 0;
            if (cineKey > 0) {
              return;
            }
          }

          if (key.indexOf('kevlar_') >= 0) {

            if (kl === 22) {
              // kevlar_enable_up_arrow - no use
              // kevlar_help_use_locale - might use
              // kevlar_refresh_gesture - might use
              // kevlar_smart_downloads - might use
              // kevlar_thumbnail_fluid
              // kevlar_ytb_live_badges

              if (key === 'kevlar_ytb_live_badges') continue;

            }


            if (!use_maintain_stable_list) {

              if (key === 'kevlar_tuner_should_test_maintain_stable_list') continue;
              if (key === 'kevlar_should_maintain_stable_list') continue;
              if (key === 'kevlar_tuner_should_maintain_stable_list') continue; // fallback
            }
            if (!use_maintain_reuse_components) {

              if (key === 'kevlar_tuner_should_test_reuse_components') continue;
              if (key === 'kevlar_tuner_should_reuse_components') continue;
              if (key === 'kevlar_should_reuse_components') continue; // fallback
            }

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

            if (key === 'web_button_rework') continue;

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

    }

    setFalseFn(EXPERIMENT_FLAGS);
    if (config_.EXPERIMENTS_FORCED_FLAGS) setFalseFn(config_.EXPERIMENTS_FORCED_FLAGS);

    EXPERIMENT_FLAGS.desktop_delay_player_resizing = false;
    EXPERIMENT_FLAGS.web_animated_like = false;
    EXPERIMENT_FLAGS.web_animated_like_lazy_load = false;

    if (use_maintain_stable_list) {
      EXPERIMENT_FLAGS.kevlar_tuner_should_test_maintain_stable_list = true;
      EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list = true;
      EXPERIMENT_FLAGS.kevlar_tuner_should_maintain_stable_list = true; // fallback
    }

    if (use_maintain_reuse_components) {
      EXPERIMENT_FLAGS.kevlar_tuner_should_test_reuse_components = true;
      EXPERIMENT_FLAGS.kevlar_tuner_should_reuse_components = true;
      EXPERIMENT_FLAGS.kevlar_should_reuse_components = true; // fallback
    }

    if(use_defer_detach){
      EXPERIMENT_FLAGS.kevlar_tuner_should_defer_detach= true;
    }

    // EXPERIMENT_FLAGS.kevlar_prefetch_data_augments_network_data = true; // TBC
  });

  hLooper.start();


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

    const { requestAnimationFrame, setInterval, clearInterval, setTimeout, clearTimeout } = __CONTEXT__;

    hLooper.setupForCleanContext(__CONTEXT__)

  });

})(null);
