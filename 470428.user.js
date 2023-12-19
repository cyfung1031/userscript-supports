// ==UserScript==
// @name        YouTube EXPERIMENT_FLAGS Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     1.3.23
// @license     MIT
// @author      CY Fung
// @icon        https://github.com/cyfung1031/userscript-supports/raw/main/icons/yt-engine.png
// @description Adjust EXPERIMENT_FLAGS
// @grant       none
// @unwrap
// @run-at      document-start
// @allFrames   true
// @inject-into page
// @require     https://update.greasyfork.org/scripts/475632/1252746/ytConfigHacks.js
// ==/UserScript==

(() => {

  // Purpose 1: Remove Obsolete Flags
  // Purpose 2: Remove Flags bring no visual difference
  // Purpose 3: Enable Flags bring performance boost

  const DISABLE_CINEMATICS = false; // standard design
  const NO_SerializedExperiment = true;
  const KEEP_PLAYER_QUALITY_STICKY = true; // see https://greasyfork.org/scripts/471033/
  const DISABLE_serializedExperimentIds = true;
  const DISABLE_serializedExperimentFlags = true;
  const IGNORE_VIDEO_SOURCE_RELATED = true;
  const NO_REFRESH = true;
  const ENABLE_MINOR_CHAT_FEATURE_UPGRADE = true;
  const ENABLE_EMOJI_PICKER_NEW_STYLE = false;
  const ENABLE_BADGE_STYLE = false;
  const NO_DESKTOP_DELAY_PLAYER_RESIZING = false;
  const NO_ANIMATED_LIKE = false;
  const KEEP_MIDDLEWAVE = true;

  const SET_POLYMER_FLAGS = true;
  const FLAG_STRATEGY_01 = true; // ignore ads related flags

  const FLAG_STRATEGY_02 = true; // ignore player related flags

  const FLAG_STRATEGY_03 = true; // ignore adblock related flags

  const ENABLE_EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST = {
    defaultValue: true, // performance boost
    useExternal: () => typeof localStorage.EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST !== 'undefined',
    externalValue: () => (+localStorage.EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST ? true : false)
  };
  const ENABLE_EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS = {
    defaultValue: true, // not sure
    useExternal: () => typeof localStorage.EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS !== 'undefined',
    externalValue: () => (+localStorage.EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS ? true : false)
  };
  const ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH = {
    defaultValue: true, // not sure
    useExternal: () => typeof localStorage.ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH !== 'undefined',
    externalValue: () => (+localStorage.ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH ? true : false)
  };

  const ENABLE_EXPERIMENT_FLAGS_NO_AUTOPLAY_TOGGLE = {
    defaultValue: false, // true to remove autoplay toggle button
    useExternal: () => typeof localStorage.ENABLE_EXPERIMENT_FLAGS_NO_AUTOPLAY_TOGGLE !== 'undefined',
    externalValue: () => (+localStorage.ENABLE_EXPERIMENT_FLAGS_NO_AUTOPLAY_TOGGLE ? true : false)
  };

  const ALLOW_ALL_LIVE_CHATS_FLAGS = false;

  const USE_MAINTAIN_STABLE_LIST_ONLY_WHEN_KS_FLAG_IS_SET = false;

  const COMMENTS_NO_DELAY = true;



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
  const mzFlagDetected1 = new Set();
  const mzFlagDetected2 = new Set();
  let zPlayerKevlar = false;
  try {
    isMainWindow = window.document === window.top.document
  } catch (e) { }

  const fOperAccept = Symbol();
  const fOperReject = Symbol();

  const autoplayKeys = new Set([
    // 'player_allow_autonav_after_playlist',
    'web_player_autonav_toggle_always_listen',
    // 'web_player_offline_playlist_auto_refresh',

    // 'allow_live_autoplay',
    // 'allow_poltergust_autoplay',
    // 'autoplay_time',
    // 'autoplay_time_for_fullscreen',
    // 'autoplay_time_for_music_content',
    'client_respect_autoplay_switch_button_renderer',
    // 'embeds_enable_muted_autoplay',
    // 'embeds_web_enable_autoplay_not_supported_logging_fix',
    // 'embeds_web_enable_log_splay_as_autoplay',
    // 'embeds_web_enable_mobile_autoplay',
    // 'html5_autoplay_default_quality_cap',
    // 'mweb_muted_autoplay_animation',

    // 'html5_player_autonav_logging',
    // 'web_player_always_enable_auto_translation',
    // 'web_player_autonav_empty_suggestions_fix',
    // 'web_player_autonav_use_server_provided_state',
    'web_player_decouple_autonav',
    'web_player_move_autonav_toggle',
  ]);

  function fOper(key, value) {

    const kl = key.length;

    if (FLAG_STRATEGY_01) {

      if (key === 'web_player_defer_modules') return fOperAccept;
      if (key === 'html5_defer_modules_on_ads_only') return fOperAccept;
      if (key === 'web_player_defer_ad') return fOperAccept;
      if (key === 'disable_defer_admodule_on_advertiser_video') return fOperAccept;
      if (key === 'html5_onesie_defer_content_loader_ms') return fOperAccept;
      if (key === 'html5_defer_fetch_att_ms') return fOperAccept;
      if (key === 'embeds_web_enable_defer_loading_remote_js') return fOperAccept;

    }

    if (kl === 23) {

      if (KEEP_MIDDLEWAVE && key === 'web_key_moments_markers') return fOperAccept;

    }

    if (kl === 24) {

      // if(key ==='disable_new_pause_state3') return fOperAccept;
      // if(key ==='enable_cast_on_music_web') return fOperAccept;
      // if(key ==='gcf_config_store_enabled') return fOperAccept;
      // if(key ==='gel_queue_timeout_max_ms') return fOperAccept;
      // if(key ==='network_polling_interval') return fOperAccept;
      if (key === 'player_doubletap_to_seek') return fOperAccept;
      // if(key ==='polymer_bad_build_labels') return fOperAccept;
      // if(key ==='skip_invalid_ytcsi_ticks') return fOperAccept;
      // if(key ==='use_player_cue_range_set') return fOperAccept;
      // if(key ==='woffle_used_state_report') return fOperAccept;

    }


    let keep = false;
    let nv = undefined;

    const no_autoplay_toggle = ENABLE_EXPERIMENT_FLAGS_NO_AUTOPLAY_TOGGLE.currentValue;

    if (no_autoplay_toggle === true) {

    } else if (key.indexOf('auto') >= 0 && key.indexOf('play') >= 0) {
      if (autoplayKeys.has(key)) {
        keep = true;
      }
    }

    if (IGNORE_VIDEO_SOURCE_RELATED && key.indexOf('html5_') >= 0) {


      if (key === 'html5_live_use_alternate_bandwidth_window_sizes') {
        keep = true;
      }
      else if (key === 'html5_live_ultra_low_latency_bandwidth_window') {
        keep = true;
      }
      else if (key === 'html5_live_low_latency_bandwidth_window') {
        keep = true;
      }
      else if (key === 'html5_live_normal_latency_bandwidth_window') {
        keep = true;
      } else if (key === 'html5_skip_slow_ad_delay_ms') {
        keep = true;
        if (typeof value === 'string' && +value > 2) {
          keep = true;
          if (+value > 4) nv = '4';
        } else {
          keep = false;
        }
      } else if (key === 'html5_player_preload_ad_fix') {
        keep = true;
      } else if (key.includes('_ad_') || key.includes('_ads_')) {
        keep = false;
      } else if (key === 'html5_ssdai_adfetch_dynamic_timeout_ms') {
        keep = false;
      } else if (key === 'html5_log_ssdai_fallback_ads' || key === 'html5_deprecate_adservice') {
        keep = false;
      } else {
        if (!key.includes('deprecat')) keep = true;
      }


    } else if (IGNORE_VIDEO_SOURCE_RELATED && key.indexOf('h5_') >= 0) {
      if (key.startsWith('enable_h5_player_ad_block_')) keep = false;
      else if (key === 'fix_h5_toggle_button_a11y') keep = true;
      else if (key === 'h5_companion_enable_adcpn_macro_substitution_for_click_pings') keep = false;
      else if (key === 'h5_enable_generic_error_logging_event') keep = false;
      else if (key === 'h5_enable_unified_csi_preroll') keep = true;
      else if (key === 'h5_reset_cache_and_filter_before_update_masthead') keep = true;
      else if (key === 'web_player_enable_premium_hbr_in_h5_api') keep = true;
      else {
        if (!key.includes('deprecat')) keep = true;
      }
    }

    // if(key.includes('sticky')){

    // console.log(5599,key)
    // }

    if (key.includes('_timeout') && typeof value === 'string') {
      const valur = (value, k) => {
        if (+value === 0) value = k;
        else if (+value > +k) value = k;
        return value;
      }
      if (key === 'check_navigator_accuracy_timeout_ms') {
        nv = valur(value, '4');
        keep = true;
      } else if (key === 'html5_ad_timeout_ms') {
        nv = valur(value, '4');
        keep = true;
      } else if (key === 'html5_ads_preroll_lock_timeout_delay_ms') {
        // value = valur(value, '4');
        // keep = true;
        keep = false;
      } else if (key === 'html5_slow_start_timeout_delay_ms') {
        nv = valur(value, '4');
        keep = true;
      } else if (key === 'variable_buffer_timeout_ms') {
        // value = valur(value, '4');
        // keep = true;
        keep = false;
      } else {
        if (+value > 3000) nv = '3000';
        keep = true;
      }
    }


    if (KEEP_PLAYER_QUALITY_STICKY && key.includes('_sticky')) {


      if (key === 'html5_onesie_sticky_server_side') {
        keep = false;

      } else if (key === 'html5_perf_cap_override_sticky') {
        keep = true;

      } else if (key === 'html5_ustreamer_cap_override_sticky') {
        keep = true;


      } else if (key === 'html5_exponential_memory_for_sticky') {
        keep = true;

      } else {
        keep = true;

      }

    }


    if (key === 'html5_streaming_xhr_time_based_consolidation_ms') keep = true;
    if (key === 'html5_bypass_contention_secs') keep = true;

    if (key === 'vp9_drm_live') keep = true;
    if (key === 'html5_log_rebuffer_reason') keep = false;
    if (key === 'html5_enable_audio_track_log') keep = false;

    if (key.startsWith('h5_expr_')) {
      // by userscript
      keep = true;
    } else if (key.includes('deprecat')) {
      keep = false;
    }

    if (key === 'html5_safari_desktop_eme_min_version') keep = true;

    if (key === 'html5_disable_av1') keep = true;
    if (key === 'html5_disable_av1_hdr') keep = true;
    if (key === 'html5_disable_hfr_when_vp9_encrypted_2k4k_unsupported') keep = true;
    if (key === 'html5_account_onesie_format_selection_during_format_filter') keep = true;
    if (key === 'html5_prefer_hbr_vp9_over_av1') keep = true;

    if (!DISABLE_CINEMATICS && key === 'web_cinematic_watch_settings') {
      keep = true;
    }
    if (!keep) {
      return fOperReject;
      // vRes.delete(key);
    } else if (nv !== undefined && nv !== value) {
      return nv;
      // vRes.set(key, nv)
    } else {
      return fOperAccept;
    }

  }
  function deSerialized(str, fOper) {

    const map = new Map();
    let start = 0;

    while (start < str.length) {
      // Find the next '&' or the end of the string
      const nextAmpersand = str.indexOf('&', start);
      const end = nextAmpersand === -1 ? str.length : nextAmpersand;

      // Extract the key-value pair
      const equalsSign = str.indexOf('=', start);
      if (equalsSign !== -1 && equalsSign < end) {
        const key = str.substring(start, equalsSign);
        const value = str.substring(equalsSign + 1, end);

        let r = fOper(key, value);
        if (typeof r !== 'symbol') {
          map.set(key, r)
        } else if (r === fOperAccept) {
          map.set(key, value);
        }

      }

      // Move to the next key-value pair
      start = end + 1;
    }

    map.toString = function () {
      const res = [];
      this.forEach((value, key) => {
        res.push(`${key}=${value}`);
      });
      return res.join('&');
    }
    return map;
  }

  function fixSerializedExperiment(conf) {

    const supportAV1 = window.MediaSource.isTypeSupported('video/webm; codecs=av01.0.05M.08');
    const supportVP9 = window.MediaSource.isTypeSupported('video/webm; codecs=vp09.01.20.08.01.01.01.01.00');

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

    const mez = (mRes) => {

      mRes.set('html5_disable_low_pipeline', 'false');
      mRes.set('html5_min_startup_buffered_ad_media_duration_secs', '0')

      if (supportAV1 === false && localStorage['yt-player-av1-pref'] === '-1') {

        mRes.set('html5_disable_av1', 'true');
        mRes.set('html5_disable_av1_hdr', 'true');
        mRes.set('html5_prefer_hbr_vp9_over_av1', 'true');



      } else if (supportAV1 === true && supportVP9 === true && localStorage['yt-player-av1-pref'] === '8192') {

        mRes.set('html5_disable_av1', 'false');
        mRes.set('html5_disable_av1_hdr', 'false');
        mRes.set('html5_prefer_hbr_vp9_over_av1', 'false');
      }


      // html5_perf_cap_override_sticky = true;
      // html5_perserve_av1_perf_cap = true;


      mRes.set('html5_enable_server_format_filter', 'true')
      mRes.set('html5_use_ump', 'true')

      mRes.set('html5_live_defrag_only_h264_playbacks', 'true')
      mRes.set('html5_live_defrag_only_h264_formats', 'true')

      mRes.set('html5_disable_protected_hdr', 'false')
      mRes.set('html5_disable_vp9_encrypted', 'false')
      mRes.set('html5_ignore_h264_framerate_cap', 'true')

      mRes.set('html5_allow_asmjs', 'true')
      mRes.set('html5_defer_modules_on_ads_only', 'true')
      mRes.set('html5_use_drm_retry', 'true')
      mRes.set('html5_delta_encode_fexp', 'true')
      mRes.set('html5_only_send_cas_health_pings', 'true')

      mRes.set('html5_modify_caption_vss_logging', 'true')
      mRes.set('html5_allow_zero_duration_ads_on_timeline', 'true')
      mRes.set('html5_reset_daistate_on_audio_codec_change', 'true')
      mRes.set('html5_enable_safari_fairplay', 'true')

      mRes.set('html5_safari_fairplay_ignore_hdcp', 'true')

      mRes.set('html5_enable_vp9_fairplay', 'true')
      mRes.set('html5_eme_loader_sync', 'true')

      mRes.set('html5_enable_same_language_id_matching', 'true');
      mRes.set('html5_enable_new_hvc_enc', 'true')
      mRes.set('html5_enable_ssap', 'true')
      mRes.set('html5_enable_short_gapless', 'true')
      mRes.set('html5_enable_aac51', 'true')
      mRes.set('html5_enable_ssap_entity_id', 'true')

      mRes.set('html5_high_res_logging_always', 'true')
      mRes.set('html5_local_playsinline', 'true')
      mRes.set('html5_disable_media_element_loop_on_tv', 'true')
      mRes.set('html5_native_audio_track_switching', 'true')

      mRes.set('html5_format_hybridization', 'true')
      mRes.set('html5_disable_encrypted_vp9_live_non_2k_4k', 'false')

      mRes.set('html5_default_ad_gain', 'false')
      mRes.set('html5_use_sabr_requests_for_debugging', 'false')
      mRes.set('html5_enable_sabr_live_streaming_xhr', 'true')
      mRes.set('html5_sabr_live_ultra_low_latency', 'true')

      mRes.set('html5_sabr_live_low_latency', 'true')
      mRes.set('html5_sabr_live', 'true')
      mRes.set('html5_sabr_post_live', 'true')
      mRes.set('html5_sabr_premiere', 'true')

      mRes.set('html5_enable_sabr_live_streaming_xhr', 'true')
      mRes.set('html5_enable_sabr_live_non_streaming_xhr', 'true')



      mRes.set('html5_enable_subsegment_readahead_v3', 'true')
      mRes.set('html5_ultra_low_latency_subsegment_readahead', 'true')
      mRes.set('html5_disable_move_pssh_to_moov', 'true')



      mRes.set('html5_modern_vp9_mime_type', 'true')






    }

    if (DISABLE_serializedExperimentFlags && typeof conf.serializedExperimentFlags === 'string') {
      const fg = conf.serializedExperimentFlags;

      const vRes = deSerialized(fg, fOper);

      mez(vRes);

      const kg = vRes.toString();

      conf.serializedExperimentFlags = kg;

    }

  }


  const all_live_chat_flags = new Set([
    "live_chat_banner_expansion_fix",
    "live_chat_enable_mod_view",
    "live_chat_enable_qna_banner_overflow_menu_actions",
    "live_chat_enable_qna_channel",
    "live_chat_enable_send_button_in_slow_mode",
    "live_chat_filter_emoji_suggestions",
    "live_chat_increased_min_height",
    "live_chat_over_playlist",
    "live_chat_web_enable_command_handler",
    "live_chat_web_use_emoji_manager_singleton",
    "live_chat_whole_message_clickable"
  ]);

  const all_noti_flags = new Set([ // not sure
    // "check_user_lact_at_prompt_shown_time_on_web",
    "clear_user_partitioned_ls",
    "desktop_notification_high_priority_ignore_push",
    "desktop_notification_set_title_bar",
    "enable_first_user_action_csi_logging",
    "enable_get_account_switcher_endpoint_on_webfe",
    "enable_handles_account_menu_switcher",
    "enable_names_handles_account_switcher", // TBC
    "enable_pass_sdc_get_accounts_list",
    "enable_server_stitched_dai",
    "enable_yt_ata_iframe_authuser",
    // "fill_single_video_with_notify_to_lasr",
    "html5_server_stitched_dai_group",
    // "is_part_of_any_user_engagement_experiment",
    "kevlar_miniplayer_queue_user_activation",
    // "rich_grid_resize_observer",
    // "rich_grid_resize_observer_only"
  ]);

  const all_list_flags = new Set([

    "shorts_in_playlists_web",


    "live_chat_over_playlist",

    "web_amsterdam_playlists",

    "browse_next_continuations_migration_playlist",
    "desktop_add_to_playlist_renderer_dialog_popup",
    "enable_horizontal_list_renderer_scroll_based_on_items_visibility",
    "enable_pass_sdc_get_accounts_list",
    "enable_programmed_playlist_color_sample",
    "enable_programmed_playlist_redesign",
    "enable_section_list_scroll_to_item_section_web",
    "gda_enable_playlist_download",
    "include_autoplay_count_in_playlists",
    "kevlar_chapters_list_view_seek_by_chapter",
    "kevlar_enable_editable_playlists",
    "kevlar_enable_reorderable_playlists",
    "kevlar_fix_playlist_continuation",
    "kevlar_hide_playlist_playback_status",
    "kevlar_lazy_list_resume_for_autofill",
    "kevlar_no_autoscroll_on_playlist_hover",
    "kevlar_passive_event_listeners",
    "kevlar_player_playlist_use_local_index",
    "kevlar_playlist_drag_handles",
    "kevlar_playlist_use_x_close_button",
    "kevlar_rendererstamper_event_listener",
    "kevlar_should_maintain_stable_list",
    "kevlar_show_playlist_dl_btn",
    "music_on_main_open_playlist_recommended_videos_in_miniplayer",
    "player_allow_autonav_after_playlist",
    "player_enable_playback_playlist_change",
    "web_amsterdam_post_mvp_playlists",

  ]);

  let brc = 1000;

  if (typeof AbortSignal !== 'undefined') {
    document.addEventListener('yt-action', function () {
      if (brc > 8) looperFn();
      brc = 0;
    }, { capture: true, passive: true, once: true });
  }

  const hExperimentFlagsFn = () => {

    if (brc > 4) brc = 4;

    const use_maintain_stable_list = getSettingValue(ENABLE_EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST);
    const use_maintain_reuse_components = getSettingValue(ENABLE_EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS);
    const use_defer_detach = getSettingValue(ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH);
    const no_autoplay_toggle = getSettingValue(ENABLE_EXPERIMENT_FLAGS_NO_AUTOPLAY_TOGGLE);
    ENABLE_EXPERIMENT_FLAGS_NO_AUTOPLAY_TOGGLE.currentValue = no_autoplay_toggle;

    if (use_maintain_stable_list) Promise.resolve().then(() => console.debug("use_maintain_stable_list"));
    if (use_maintain_reuse_components) Promise.resolve().then(() => console.debug("use_maintain_reuse_components"));
    if (use_defer_detach) Promise.resolve().then(() => console.debug("use_defer_detach"));
    if (no_autoplay_toggle) Promise.resolve().then(() => console.debug("no_autoplay_toggle"));

    // I don't know why it requires to be extracted function.
    const mex = (EXPERIMENT_FLAGS, mzFlagDetected, fEntries) => {

      for (const [key, value] of fEntries) {


        if (value === true) {

          // if(key.indexOf('modern')>=0 || key.indexOf('enable')>=0 || key.indexOf('theme')>=0 || key.indexOf('skip')>=0  || key.indexOf('ui')>=0 || key.indexOf('observer')>=0 || key.indexOf('polymer')>=0 )continue;

          if (mzFlagDetected.has(key)) continue;
          mzFlagDetected.add(key);

          const kl = key.length;
          const kl7 = kl % 7;
          const kl5 = kl % 5;
          const kl3 = kl % 3;
          const kl2 = kl % 2;

          if (FLAG_STRATEGY_03 && kl >= 11 && kl <= 31) {
            // do it with your separate script please
            if (key === 'ab_det_apb_b') continue;
            if (key === 'ab_det_el_h') continue;
            if (key === 'ab_det_fet_wr') continue;
            if (key === 'ab_det_fet_wr_en') continue;
            if (key === 'ab_det_gen_re') continue;
            if (key === 'web_enable_ab_rsp_cl') continue;
            if (key === 'enable_ab_rp_int') continue;
            if (key === 'enable_ab_report_on_errorscreen') continue;
            if (key === 'enable_pl_r_si_fa') continue;
            if (key === 'ab_det_sc_inj_enf') continue;
          }

          if (FLAG_STRATEGY_02) {


            if (kl === 24 || kl === 44) {


              if (key === 'kevlar_client_enable_shorts_player_bootstrap') continue;
              if (key === 'kevlar_early_popup_close') continue;
              if (key === 'kevlar_hide_pp_url_param') continue;
              if (key === 'kevlar_touch_gesture_ves') continue;
              if (key === 'player_doubletap_to_seek') continue;
              if (key === 'shorts_controller_retrieve_seedless_sequence') continue;
              if (key === 'shorts_overlay_reshuffle') continue;

              // if (
              //   [

              //     // 'enable_offer_suppression'
              //     // 'enable_purchase_activity_in_paid_memberships'
              //     // 'enable_time_out_messages'
              //     // 'enable_true_inline_for_desktop_home_feed_vac'
              //     // 'enable_wiz_next_lp2_msof'
              //     // 'enable_ytc_refunds_submit_form_signal_action'
              //     // 'gcf_config_store_enabled'
              //     'kevlar_client_enable_shorts_player_bootstrap',
              //     'kevlar_early_popup_close',
              //     // 'kevlar_gel_error_routing'
              //     'kevlar_hide_pp_url_param',
              //     // 'kevlar_startup_lifecycle'
              //     // 'kevlar_structured_description_content_inline'
              //     'kevlar_touch_gesture_ves',
              //     // 'kevlar_typography_update'
              //     // 'kevlar_voice_logging_fix'
              //     // 'kevlar_watch_disable_legacy_metadata_updates'
              //     // 'migrate_remaining_web_ad_badges_to_innertube'
              //     // 'mweb_render_wrapped_icon'
              //     'player_doubletap_to_seek',
              //     // 'polymer_bad_build_labels'
              //     'shorts_controller_retrieve_seedless_sequence',
              //     'shorts_overlay_reshuffle',
              //     // 'show_civ_reminder_on_web'
              //     // 'skip_invalid_ytcsi_ticks'
              //     // 'web_hide_autonav_keyline'
              //     // 'web_player_autonav_use_server_provided_state'
              //   ].includes(key)
              // ) continue;

            }

          }

          if (SET_POLYMER_FLAGS) {

            if (key === 'polymer_enable_mdx_queue') continue;
            if (key === 'polymer_on_demand_shady_dom') continue;

          }

          if (FLAG_STRATEGY_01) {

            if (key === 'web_player_defer_modules') continue;
            if (key === 'html5_defer_modules_on_ads_only') continue;
            if (key === 'web_player_defer_ad') continue;
            if (key === 'disable_defer_admodule_on_advertiser_video') continue;
            if (key === 'html5_onesie_defer_content_loader_ms') continue;
            if (key === 'html5_defer_fetch_att_ms') continue;
            if (key === 'embeds_web_enable_defer_loading_remote_js') continue;

          }

          if (kl === 30) {
            if (KEEP_MIDDLEWAVE && key === 'web_player_entities_middleware') continue;
          }

          if (kl > 27 && kl < 44) {
            if (key === 'desktop_keyboard_capture_keydown_killswitch') continue; // TBC
            if (key === 'kevlar_autofocus_menu_on_keyboard_nav') continue; // TBC
            if (key === 'kevlar_keyboard_button_focus') continue; // TBC
            if (key === 'kevlar_macro_markers_keyboard_shortcut') continue; // required
          }

          if (kl === 39) {
            // if(key === 'kevlar_appbehavior_attach_startup_tasks') continue;
            // if(key === 'kevlar_clear_non_displayable_url_params') continue;
            if (key === 'kevlar_command_handler_formatted_string') continue; // see https://github.com/cyfung1031/userscript-supports/issues/20
            if (key === 'kevlar_miniplayer_queue_user_activation') continue;
            if (key === 'kevlar_player_watch_endpoint_navigation') continue;
            // if(key === 'kevlar_watch_focus_on_engagement_panels') continue;

          }

          if (kl > 16) {
            if (all_list_flags.has(key)) continue;
          }

          if (kl > 24 && kl < 50 && all_noti_flags.has(key)) continue;

          // if (kl > 4 && (key.includes("server") || key.includes("notif") || key.includes("account") || key.includes("user"))){
          //   console.log(key)
          //   continue;
          // }

          if (kl === 45) {
            if (key === 'desktop_add_to_playlist_renderer_dialog_popup') continue;
            // if(key === 'enable_buenos_aires_page_header_mini_app_dest')continue;
            // if(key === 'enable_dsa_compliant_banner_image_ad_renderer')continue;
            // if(key === 'enable_get_account_switcher_endpoint_on_webfe')continue;
            // if(key === 'enable_structured_description_shorts_web_mweb')continue;
            // if(key === 'kevlar_fill_offline_availability_type_for_gda')continue;
            // if(key === 'kevlar_text_inline_expander_formatted_snippet')continue;
          }

          if (!DISABLE_CINEMATICS) {

            // web_watch_cinematics_disabled_by_default
            // web_watch_cinematics_preferred_reduced_motion_default_disabled

            if (key === 'kevlar_measure_ambient_mode_idle' || key === 'kevlar_watch_cinematics_invisible' || key === 'web_cinematic_theater_mode' || key === 'web_cinematic_fullscreen') {
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

          if (key.indexOf('html5_') === 0) {


            if (IGNORE_VIDEO_SOURCE_RELATED) {
              continue;
            }

            // if(IGNORE_VIDEO_SOURCE_RELATED){
            //   if(key ==='html5_enable_vp9_fairplay') continue;
            //   if(key ==='html5_disable_av1_hdr') continue;
            //   if(key ==='html5_disable_hfr_when_vp9_encrypted_2k4k_unsupported') continue;
            //   if(key ==='html5_account_onesie_format_selection_during_format_filter') continue;
            //   if(key ==='html5_prefer_hbr_vp9_over_av1') continue;
            // }

          } else if (key.indexOf('kevlar_') === 0) {



            if (kl7 === 2 && kl5 === 2 && kl2 === 1 && kl3 === 1) {
              if (key === 'kevlar_rendererstamper_event_listener') continue; // https://github.com/cyfung1031/userscript-supports/issues/11
            }

            if (kl === 22) {
              // kevlar_enable_up_arrow - no use
              // kevlar_help_use_locale - might use
              // kevlar_refresh_gesture - might use
              // kevlar_smart_downloads - might use
              // kevlar_thumbnail_fluid
              // kevlar_ytb_live_badges

              if (key === 'kevlar_ytb_live_badges') continue;

            }


            // if (!use_maintain_stable_list) {

            if (key === 'kevlar_tuner_should_test_maintain_stable_list') continue;
            if (key === 'kevlar_should_maintain_stable_list') continue;
            if (key === 'kevlar_tuner_should_maintain_stable_list') continue; // fallback
            // }
            // if (!use_maintain_reuse_components) {

            if (key === 'kevlar_tuner_should_test_reuse_components') continue;
            if (key === 'kevlar_tuner_should_reuse_components') continue;
            if (key === 'kevlar_should_reuse_components') continue; // fallback
            // }

            if (key === 'kevlar_tuner_should_defer_detach') continue;

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


            if (ALLOW_ALL_LIVE_CHATS_FLAGS && kl > 20 && kl < 55 && all_live_chat_flags.has(key)) {
              continue;
              /*
               *
              live_chat_banner_expansion_fix
              live_chat_enable_mod_view
              live_chat_enable_qna_banner_overflow_menu_actions
              live_chat_enable_qna_channel
              live_chat_enable_send_button_in_slow_mode
              live_chat_filter_emoji_suggestions
              live_chat_increased_min_height
              live_chat_over_playlist
              live_chat_web_enable_command_handler
              live_chat_web_use_emoji_manager_singleton
              live_chat_whole_message_clickable

              */
            }

            if (kl7 === 1 && kl5 === 1 && kl2 === 0 && kl3 === 0) {
              if (key === 'live_chat_web_enable_command_handler') continue;

            }
            if (kl7 === 1 && kl5 === 4 && kl3 === 2 && kl2 === 1) {

              if (key === 'shorts_desktop_watch_while_p2') continue;
            }

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

            if (key === 'enable_unknown_lact_fix_on_html5') continue;

          }

          if (key === 'live_chat_chunk_across_update_interval') continue;

          if (key === 'enable_native_live_chat_on_kevlar') continue;

          if (key === 'live_chat_author_name_color_usernames') continue;
          if (key === 'live_chat_seed_color_usernames') continue;
          if (key === 'live_chat_colored_usernames') continue;
          if (key === 'live_chat_simple_color_usernames') continue;
          if (key === 'web_button_rework_with_live') continue;
          if (key === 'live_chat_hide_avatars') continue;
          if (key === 'live_chat_enable_qna_replay') continue;
          if (key === 'live_chat_aggregation') continue;
          if (key === 'live_chat_web_use_emoji_manager_singleton') continue;
          if (key === 'enable_docked_chat_messages') continue;
          if (key === 'live_chat_taller_emoji_picker') continue;
          if (key === 'live_chat_emoji_picker_restyle') continue;
          if (key === 'live_chat_emoji_picker_restyle_remain_open_on_send') continue;
          if (key === 'live_chat_web_input_update') continue;
          if (key === 'live_chat_enable_send_button_in_slow_mode') continue;

          if (key === 'kevlar_watch_metadata_refresh_no_old_primary_data') continue;
          // if (key === 'kevlar_watch_metadata_refresh_no_old_secondary_data') continue; // for Tabview Youtube
          if (key === 'enable_web_cosmetic_refresh_hashtag_page') continue;
          if (key === 'kevlar_watch_metadata_refresh_description_lines') continue;




          if (key === 'enable_service_ajax_csn') continue;

          if (key === 'kevlar_use_vimio_behavior') continue;

          if (key === 'web_use_cache_for_image_fallback') continue;
          if (key === 'kevlar_woffle_fallback_image') continue;
          if (key === 'yt_img_shadow_trigger_show_on_visible') continue;
          if (key === 'kevlar_thumbnail_bg') continue;
          if (key === 'web_rounded_thumbnails') continue;



          if (key === 'kevlar_rendererstamper_event_listener') continue;

          if (key === 'dialog_behavior_no_tap_killswitch') continue;

          if (key === 'handle_service_request_actions') continue;

          if (key === 'live_chat_whole_message_clickable') continue;

          if (key === 'live_chat_require_space_for_autocomplete_emoji') continue;

          if (key === 'kevlar_keyboard_button_focus') continue;

          if (key === 'live_chat_emoji_picker_toggle_state') continue;
          if (key === 'super_sticker_emoji_picker_category_button_icon_filled') continue;
          if (key === 'enable_super_chat_buy_flow_revamp_web') continue;


          if (key === 'web_modern_buttons') continue;


          if (key === 'web_modern_dialogs') continue;
          if (key === 'live_chat_disable_chat_feed_animation') continue;
          if (key === 'live_chat_overflow_hide_chat') continue;
          if (key === 'web_darker_dark_theme_live_chat') continue;
          if (key === 'live_chat_channel_activity') continue;
          if (key === 'live_chat_emoji_picker_restyle_remain_open_on_click_to_input_area') continue;
          if (key === 'live_chat_top_chat_sampling_enabled') continue;

          if (key === 'live_chat_enable_mod_view') continue;
          if (key === 'live_chat_web_enable_command_handler_action_handling') continue;
          if (key === 'web_modern_dialogs') continue;
          if (key === 'web_modern_dialog_layout') continue;
          if (key === 'web_modern_typography') continue;

          if (key === 'kevlar_disable_component_resizing_support') continue;
          if (key === 'web_rounded_thumbnails') continue;
          if (key === 'enable_quiz_desktop_animation') continue;
          if (key === 'kevlar_thumbnail_fluid') continue;
          if (key === 'web_enable_playlist_video_lockup_equalizer') continue;
          if (key === 'web_modern_collections_v2') continue;
          if (key === 'animated_live_badge_icon') continue;
          if (key === 'use_color_palettes_modern_collections_v2') continue;
          if (key === 'web_amsterdam_post_mvp_playlists') continue;
          if (key === 'enable_desktop_search_bigger_thumbs') continue;
          if (key === 'web_animated_actions') continue;
          if (key === 'mweb_animated_actions') continue;
          if (key === 'enable_desktop_amsterdam_info_panels') continue;

          if (key === 'kevlar_modern_sd') continue;
          if (key === 'problem_walkthrough_sd') continue;
          if (key === 'polymer_video_renderer_defer_menu') continue;


          if (key === 'enable_html5_teal_ad_badge') continue;
          if (key === 'kevlar_ytb_live_badges') continue;
          if (key === 'live_chat_enable_new_moderator_badge') continue;
          if (key === 'live_chat_prepend_badges') continue;
          if (key === 'live_chat_bold_color_usernames') continue;
          if (key === 'render_custom_emojis_as_small_images') continue;

          if (key === 'web_enable_dynamic_metadata') continue;

          if (key === 'web_animated_like') continue;
          if (key === 'web_animated_like_lazy_load') continue;
          if (key === 'desktop_delay_player_resizing') continue;


          // console.log(key)
          EXPERIMENT_FLAGS[key] = false;
        }
      }
    }

    const mey = (EXPERIMENT_FLAGS, mzFlagDetected) => {
      // return;
      /*
      EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_no_old_primary_data = true;

      EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_no_old_secondary_data = false; // for Tabview Youtube
      EXPERIMENT_FLAGS.kevlar_unified_player = true;


      EXPERIMENT_FLAGS.defer_menus = true;
      EXPERIMENT_FLAGS.defer_overlays = true;
      EXPERIMENT_FLAGS.faster_load_overlay = true;
      EXPERIMENT_FLAGS.disable_moving_thumbs_handling = true;
      EXPERIMENT_FLAGS.polymer_video_renderer_defer_menu = true;
      EXPERIMENT_FLAGS.web_announce_stop_seeing_this_ad_text_a11y_bugfix = true;

      EXPERIMENT_FLAGS.disable_chips_intersection_observer = true;

      EXPERIMENT_FLAGS.live_chat_top_chat_sampling_enabled = true;

      EXPERIMENT_FLAGS.kevlar_dropdown_fix = true;

      EXPERIMENT_FLAGS.debug_forward_web_query_parameters = false;
      EXPERIMENT_FLAGS.cancel_pending_navs = true;
      EXPERIMENT_FLAGS.web_no_lock_on_touchstart_killswitch = false;


*/

      if (SET_POLYMER_FLAGS) {
        // EXPERIMENT_FLAGS.polymer_video_renderer_defer_menu = true;
        // EXPERIMENT_FLAGS.polymer_on_demand_shady_dom = true;
        // EXPERIMENT_FLAGS.polymer_enable_mdx_queue = true;
      }


      // EXPERIMENT_FLAGS.kevlar_appbehavior_attach_startup_tasks = true;
      // EXPERIMENT_FLAGS.kevlar_clear_non_displayable_url_params = true;
      // EXPERIMENT_FLAGS.kevlar_command_handler_formatted_string = true;
      // EXPERIMENT_FLAGS.kevlar_miniplayer_queue_user_activation = true;
      // EXPERIMENT_FLAGS.kevlar_player_watch_endpoint_navigation = true;
      // EXPERIMENT_FLAGS.kevlar_watch_focus_on_engagement_panels = true;

      // EXPERIMENT_FLAGS.live_chat_author_name_color_usernames = true;
      // EXPERIMENT_FLAGS.live_chat_seed_color_usernames = true;
      // EXPERIMENT_FLAGS.live_chat_colored_usernames = true;
      // EXPERIMENT_FLAGS.live_chat_simple_color_usernames = true;
      // live_chat_hide_avatars
      if (ENABLE_MINOR_CHAT_FEATURE_UPGRADE) {



        // EXPERIMENT_FLAGS.mweb_wiz_skip_render = true;
        // EXPERIMENT_FLAGS.kevlar_wiz_prototype_enable_all_components= true;
        // EXPERIMENT_FLAGS.kevlar_wiz_enable_on_demand_alternative_components= true;

        // EXPERIMENT_FLAGS.web_enable_dynamic_metadata = true;

        EXPERIMENT_FLAGS.web_supports_animations_api = true;
        EXPERIMENT_FLAGS.smartimation_background = true;
        // EXPERIMENT_FLAGS.register_web_smartimations_component = true;

        EXPERIMENT_FLAGS.enable_native_live_chat_on_kevlar = true;

        EXPERIMENT_FLAGS.live_chat_enable_qna_replay = true;
        EXPERIMENT_FLAGS.live_chat_aggregation = true;
        EXPERIMENT_FLAGS.live_chat_web_use_emoji_manager_singleton = true;
        // EXPERIMENT_FLAGS.enable_docked_chat_messages = true;

        EXPERIMENT_FLAGS.live_chat_mention_regex_update = true;

      }

      // EXPERIMENT_FLAGS.live_chat_taller_emoji_picker = true;
      // EXPERIMENT_FLAGS.live_chat_web_input_update = true;

      if (ENABLE_EMOJI_PICKER_NEW_STYLE) {

        EXPERIMENT_FLAGS.live_chat_emoji_picker_restyle = true;
        EXPERIMENT_FLAGS.live_chat_emoji_picker_restyle_remain_open_on_send = true;
        EXPERIMENT_FLAGS.live_chat_taller_emoji_picker = false;

      }

      if (ENABLE_BADGE_STYLE) {

        EXPERIMENT_FLAGS.enable_html5_teal_ad_badge = true;
        EXPERIMENT_FLAGS.kevlar_ytb_live_badges = true;
        EXPERIMENT_FLAGS.live_chat_enable_new_moderator_badge = true;
        EXPERIMENT_FLAGS.live_chat_prepend_badges = true;

        EXPERIMENT_FLAGS.live_chat_bold_color_usernames = true;
        EXPERIMENT_FLAGS.render_custom_emojis_as_small_images = true;


      }

      // EXPERIMENT_FLAGS.kevlar_wiz_prototype_enable_all_components = true;


      EXPERIMENT_FLAGS.html5_allow_asmjs = true;
      EXPERIMENT_FLAGS.html5_honor_caption_availabilities_in_audio_track = true;
      EXPERIMENT_FLAGS.web_player_hide_nitrate_promo_tooltip = true;
      EXPERIMENT_FLAGS.html5_enable_vod_slar_with_notify_pacf = true;
      EXPERIMENT_FLAGS.html5_recognize_predict_start_cue_point = true;
      EXPERIMENT_FLAGS.enable_player_logging_lr_home_infeed_ads = false;

      EXPERIMENT_FLAGS.log_gel_compression_latency = true;
      EXPERIMENT_FLAGS.log_gel_compression_latency_lr = true;
      EXPERIMENT_FLAGS.log_jspb_serialize_latency = true;

      if (NO_REFRESH) {

        EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_standardized_body_typography = false;
        EXPERIMENT_FLAGS.kevlar_refresh_gesture = false;


      }

      // EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_no_old_primary_data = true;
      // EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_no_old_secondary_data = true;
      // EXPERIMENT_FLAGS.enable_web_cosmetic_refresh_hashtag_page = true;
      // EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_description_lines = true;




      if (NO_DESKTOP_DELAY_PLAYER_RESIZING) {

        EXPERIMENT_FLAGS.desktop_delay_player_resizing = false;
      }
      if (NO_ANIMATED_LIKE) {
        EXPERIMENT_FLAGS.web_animated_like = false;
        EXPERIMENT_FLAGS.web_animated_like_lazy_load = false;
      }

      if (use_maintain_stable_list) {
        if (USE_MAINTAIN_STABLE_LIST_ONLY_WHEN_KS_FLAG_IS_SET ? EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list === true : true) {
          EXPERIMENT_FLAGS.kevlar_tuner_should_test_maintain_stable_list = true;
          EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list = true;
          EXPERIMENT_FLAGS.kevlar_tuner_should_maintain_stable_list = true; // fallback
        }
      }

      if (use_maintain_reuse_components) {
        EXPERIMENT_FLAGS.kevlar_tuner_should_test_reuse_components = true;
        EXPERIMENT_FLAGS.kevlar_tuner_should_reuse_components = true;
        EXPERIMENT_FLAGS.kevlar_should_reuse_components = true; // fallback
      }

      if (use_defer_detach) {
        EXPERIMENT_FLAGS.kevlar_tuner_should_defer_detach = true;
      }

      // EXPERIMENT_FLAGS.kevlar_prefetch_data_augments_network_data = true; // TBC

      EXPERIMENT_FLAGS.kevlar_clear_non_displayable_url_params = true;
      EXPERIMENT_FLAGS.kevlar_clear_duplicate_pref_cookie = true;
      // EXPERIMENT_FLAGS.kevlar_unified_player_clear_watch_next_killswitch = true;
      EXPERIMENT_FLAGS.kevlar_player_playlist_use_local_index = true;
      // EXPERIMENT_FLAGS.kevlar_non_watch_unified_player = true;
      // EXPERIMENT_FLAGS.kevlar_player_update_killswitch = true;

      EXPERIMENT_FLAGS.web_secure_pref_cookie_killswitch = true;
      EXPERIMENT_FLAGS.ytidb_clear_optimizations_killswitch = true;
      // EXPERIMENT_FLAGS.defer_overlays = true;


      if (COMMENTS_NO_DELAY) {
        EXPERIMENT_FLAGS.kevlar_tuner_default_comments_delay = 0;
        EXPERIMENT_FLAGS.kevlar_tuner_run_default_comments_delay = false;
      }

    }
    const setterFn = (EXPERIMENT_FLAGS, mzFlagDetected) => {

      const fEntries = Object.entries(EXPERIMENT_FLAGS);
      mex(EXPERIMENT_FLAGS, mzFlagDetected, fEntries);
      mey(EXPERIMENT_FLAGS, mzFlagDetected);

    };

    return setterFn;


  };

  let _setterFn = null;

  const setupConfig = (config_) => {

    if (config_.EXPERIMENT_FLAGS) {

      const setterFn = _setterFn || (_setterFn = hExperimentFlagsFn());

      setterFn(config_.EXPERIMENT_FLAGS, mzFlagDetected1);

      if (config_.EXPERIMENTS_FORCED_FLAGS) setterFn(config_.EXPERIMENTS_FORCED_FLAGS, mzFlagDetected2);
    }

    const playerKevlar = (config_.WEB_PLAYER_CONTEXT_CONFIGS || 0).WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH || 0;

    if (playerKevlar && !zPlayerKevlar) {
      zPlayerKevlar = true;

      if (NO_SerializedExperiment && typeof playerKevlar.serializedExperimentFlags === 'string' && typeof playerKevlar.serializedExperimentIds === 'string') {
        fixSerializedExperiment(playerKevlar);
      }

    }

  }


  const looperFn = (config_) => {
    if (--brc < 0) return;

    if (!config_) {
      try {
        config_ = yt.config_ || ytcfg.data_;
      } catch (e) { }
    }
    if (config_) setupConfig(config_);

  };


  window._ytConfigHacks.add((config_) => {
    looperFn(config_);
  });
  looperFn();

  if (isMainWindow) {

    console.groupCollapsed(
      "%cYouTube EXPERIMENT_FLAGS Tamer",
      "background-color: #EDE43B ; color: #000 ; font-weight: bold ; padding: 4px ;"
    );

    console.log("Script is loaded.");
    console.log("This might affect the new features when YouTube rolls them out to general users.");
    console.log("If you found any issue in using YouTube, please disable this script to check whether the issue is due to this script or not.");

    console.groupEnd();

  }

})();
