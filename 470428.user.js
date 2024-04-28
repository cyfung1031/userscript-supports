// ==UserScript==
// @name        YouTube EXPERIMENT_FLAGS Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     1.6.2
// @license     MIT
// @author      CY Fung
// @icon        https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/yt-engine.png
// @description Adjust EXPERIMENT_FLAGS
// @grant       none
// @unwrap
// @run-at      document-start
// @allFrames   true
// @inject-into page
// @require     https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
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
  const NO_CINEMATIC_LIGHTING_LABEL = false; // set true to show "Ambient Mode" label instead of "Cinematic lighting" Label
  const KEEP_unified_player = true; // for YouTube Audio Only

  const SET_POLYMER_FLAGS = true;
  const FLAG_STRATEGY_01 = true; // ignore ads related flags

  const FLAG_STRATEGY_02 = true; // ignore player related flags

  const FLAG_STRATEGY_03 = true; // ignore adblock related flags

  const FLAG_STRATEGY_20240413 = true; // ignore adblock related flags

  const FLAG_SKIP_CHAT_BUTTON = true;

  const ALLOW_FLAGS_202404 = true;

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

  const SPACEBAR_CONTROL = 1; // 0 - only scroll down; 1 - global pause; 2 - speed control pause



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

  // cinematic feature is no longer an experimental feature.
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

  // h5 flags
  const fOperAcceptList = new Set([

    ...(NO_CINEMATIC_LIGHTING_LABEL ? [
      'web_player_use_cinematic_label', // fallback
      'web_player_use_cinematic_label_0', // fallback
      'web_player_use_cinematic_label_1', // fallback
      'web_player_use_cinematic_label_2',
      'web_player_use_cinematic_label_3', // fallback
    ] : []),

    ...(FLAG_STRATEGY_03 ? [
      // do it with your separate script please
      'ab_pl_man', // https://www.uedbox.com/post/69238/
      'ab_fk_sk_cl', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
      'ab_det_apb_b',
      'ab_det_el_h',
      'ab_det_fet_wr',
      'ab_det_fet_wr_en',
      'ab_det_gen_re',
      'web_enable_ab_rsp_cl',
      'enable_ab_rp_int',
      'enable_ab_report_on_errorscreen',
      'enable_pl_r_si_fa',
      'ab_det_sc_inj_enf',
      'service_worker_enabled', // https://gist.github.com/BrokenGabe/51d55a11c2090d9402e40f12a6ece275
      'ab_deg_unex_thr', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
      'ab_net_tp_e', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
      'ad_net_pb_ab', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
      'ab_mis_log_err', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
      'ad_net_pb_pbp',

      'ab_det_sc_inj',
      'ab_det_sc_inj_val',
      'disable_enf_isd',
      'ks_det_gpbl',
      'ks_get_o_pp',
      'ab_deg_unex_thr',
      'enable_pl_r_si_fa',
      'debug_sk_em_precheck',

    ] : []),



    ...(FLAG_STRATEGY_01 ? [
      'web_player_defer_modules',
      'html5_defer_modules_on_ads_only',
      'web_player_defer_ad',
      'disable_defer_admodule_on_advertiser_video',
      'html5_onesie_defer_content_loader_ms',
      'html5_defer_fetch_att_ms',
      'embeds_web_enable_defer_loading_remote_js',
    ] : []),

    ...(KEEP_MIDDLEWAVE ? [
      'web_player_entities_middleware'
    ] : []),


    'web_settings_menu_icons',
    // see https://github.com/cyfung1031/userscript-supports/issues/27
    // see https://greasyfork.org/scripts/470428/discussions/216363


    // 'disable_new_pause_state3',
    // 'enable_cast_on_music_web',
    // 'gcf_config_store_enabled',
    // 'gel_queue_timeout_max_ms',
    // 'network_polling_interval',
    'player_doubletap_to_seek',
    // 'polymer_bad_build_labels',
    // 'skip_invalid_ytcsi_ticks',
    // 'use_player_cue_range_set',
    // 'woffle_used_state_report',

  ]);

  const fOperMapFn = (o) => new Map(Object.entries({
    // 1 true 2 false 3

    ...((o.no_autoplay_toggle !== true) ? {

      // 'player_allow_autonav_after_playlist',
      'web_player_autonav_toggle_always_listen': 1,
      // 'web_player_offline_playlist_auto_refresh',

      // 'allow_live_autoplay',
      // 'allow_poltergust_autoplay',
      // 'autoplay_time',
      // 'autoplay_time_for_fullscreen',
      // 'autoplay_time_for_music_content',
      'client_respect_autoplay_switch_button_renderer': 1,
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
      'web_player_decouple_autonav': 1,
      'web_player_move_autonav_toggle': 1,

    } : {}),

    ...(IGNORE_VIDEO_SOURCE_RELATED ? {

      'html5_live_use_alternate_bandwidth_window_sizes': 1,
      'html5_live_ultra_low_latency_bandwidth_window': 1,
      'html5_live_low_latency_bandwidth_window': 1,
      'html5_live_normal_latency_bandwidth_window': 1,
      // 'html5_skip_slow_ad_delay_ms': 1,
      'html5_player_preload_ad_fix': 1,
      // if (key.includes('_ad_') || key.includes('_ads_')) {
      'html5_ssdai_adfetch_dynamic_timeout_ms': 2,
      'html5_log_ssdai_fallback_ads': 2,
      'html5_deprecate_adservice': 2,
      // !key.includes('deprecat')) keep = true;


      //  if (key.startsWith('enable_h5_player_ad_block_')) keep = false;
      'fix_h5_toggle_button_a11y': 1,
      'h5_companion_enable_adcpn_macro_substitution_for_click_pings': 2,
      'h5_enable_generic_error_logging_event': 2,
      'h5_enable_unified_csi_preroll': 1,
      'h5_reset_cache_and_filter_before_update_masthead': 1,
      'web_player_enable_premium_hbr_in_h5_api': 1,
      // !key.includes('deprecat')) keep = true;

    } : {}),


    ...(KEEP_PLAYER_QUALITY_STICKY ? {

      html5_onesie_sticky_server_side: 2,
      html5_perf_cap_override_sticky: 1,
      html5_ustreamer_cap_override_sticky: 1,
      html5_exponential_memory_for_sticky: 1

    } : {}),


    'html5_streaming_xhr_time_based_consolidation_ms': 1,
    'html5_bypass_contention_secs': 1,

    'vp9_drm_live': 1,
    'html5_log_rebuffer_reason': 2,
    'html5_enable_audio_track_log': 2,


    'html5_safari_desktop_eme_min_version': 1,

    'html5_disable_av1': 1,
    'html5_disable_av1_hdr': 1,
    'html5_disable_hfr_when_vp9_encrypted_2k4k_unsupported': 1,
    'html5_account_onesie_format_selection_during_format_filter': 1,
    'html5_prefer_hbr_vp9_over_av1': 1,

    ...(!DISABLE_CINEMATICS ? {
      'web_cinematic_watch_settings': 1
    } : {}),

    'html5_apply_start_time_within_ads_for_ssdai_transitions': 2,
    'html5_enable_ads_client_monitoring_log_tv': 2,
    'html5_ignore_interruptive_ads_for_server_stitched': 1,

    'html5_no_video_to_ad_on_preroll': 1,
    'html5_no_video_to_ad_on_preroll_reset': 1,
    'html5_rebase_video_to_ad_timeline': 1,
    'html5_report_slow_ads_as_error': 1,

    'html5_default_ad_gain': 1, // just keep
    'html5_min_startup_buffered_ad_media_duration_secs': 1, // just keep

    'html5_skip_slow_ad_delay_ms': 7,
    'check_navigator_accuracy_timeout_ms': 8,
    'html5_ad_timeout_ms': 8,
    'html5_ads_preroll_lock_timeout_delay_ms': 9,
    'html5_slow_start_timeout_delay_ms': 8,
    'variable_buffer_timeout_ms': 9,

    'h5_expr_b9Nkc': 1,

  }));

  var fOperMap;

  const valur = (value, k) => {
    if (+value === 0) value = k;
    else if (+value > +k) value = k;
    return value;
  }

  function fOper(key, value) {

    if (fOperAcceptList.has(key)) return fOperAccept;
    if (key.length === 22 || key.length === 27 || key.length === 32) {

      if (SPACEBAR_CONTROL === 2 && key.includes('speedmaster')) {
        return fOperAccept;
      }

    }
    // if(key.length < 30)continue;
    // const kl = key.length;

    let keep = false;
    let nv = undefined;

    const no_autoplay_toggle = ENABLE_EXPERIMENT_FLAGS_NO_AUTOPLAY_TOGGLE.currentValue;

    fOperMap = fOperMap || fOperMapFn({ no_autoplay_toggle });

    const fm1 = fOperMap.get(key);

    switch (fm1) {
      case 1:
        keep = true;
        break;
      case 2:
        keep = false;
        break;
      case 7:
        const kv = typeof value === 'string' && +value > 2;
        keep = kv;
        if (kv && +value > 4) nv = '4';
        break;
      case 8:
        nv = valur(value, '4');
        keep = true;
        break;
      case 9:
        keep = false;
        break;
      default:

        if (FLAG_STRATEGY_20240413 && key.includes('network')) keep = true;
        else if (FLAG_STRATEGY_20240413 && key.includes('less')) keep = true;
        else if (FLAG_STRATEGY_20240413 && key.includes('latency')) keep = true;
        else if (FLAG_STRATEGY_20240413 && key.includes('slow')) keep = true;
        else if (FLAG_STRATEGY_20240413 && key.includes('steam')) keep = true;
        else if (key.includes('deprecat')) {
          keep = false;
        } else if (IGNORE_VIDEO_SOURCE_RELATED && key.includes('html5_') && !key.includes('_ad_') && !key.includes('_ads_')) {
          keep = true;
        } else if (IGNORE_VIDEO_SOURCE_RELATED && key.includes('h5_')) {
          keep = true;
        } else if (key.includes('_timeout') && typeof value === 'string') {
          if (+value > 3000) nv = '3000';
          keep = true;
        } else if (KEEP_PLAYER_QUALITY_STICKY && key.includes('_sticky')) {
          keep = true;
        } else if (key.startsWith('h5_expr_')) {
          // by userscript
          keep = true;
        }
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

        const r = fOper(key, value);
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
      const res = new Array(map.size);
      let i = 0;
      this.forEach((value, key) => {
        res[i++] = `${key}=${value}`;
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
      // mRes.set('html5_defer_modules_on_ads_only', 'true')
      mRes.set('html5_use_drm_retry', 'true')
      mRes.set('html5_delta_encode_fexp', 'true')
      mRes.set('html5_only_send_cas_health_pings', 'true')

      mRes.set('html5_modify_caption_vss_logging', 'true')
      // mRes.set('html5_allow_zero_duration_ads_on_timeline', 'true')
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

      // mRes.set('html5_default_ad_gain', 'false')
      mRes.set('html5_use_sabr_requests_for_debugging', 'false')
      // mRes.set('html5_enable_sabr_live_streaming_xhr', 'true')
      // mRes.set('html5_sabr_live_ultra_low_latency', 'true')

      // mRes.set('html5_sabr_live_low_latency', 'true')
      // mRes.set('html5_sabr_live', 'true') // sabr_live for audio only
      mRes.set('html5_sabr_post_live', 'true')
      mRes.set('html5_sabr_premiere', 'true')

      // mRes.set('html5_enable_sabr_live_streaming_xhr', 'true')
      // mRes.set('html5_enable_sabr_live_non_streaming_xhr', 'true')

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


  let brc = 1000;

  if (typeof AbortSignal !== 'undefined') {
    document.addEventListener('yt-action', function () {
      if (brc > 8) looperFn();
      brc = 0;
    }, { capture: true, passive: true, once: true });
  }


  // yt flags
  const cachedSetFn = (o) => {

    const { use_maintain_stable_list, use_maintain_reuse_components, use_defer_detach } = o;

    const BY_PASS = [

      ...(ALLOW_FLAGS_202404 ? [

        'suppress_error_204_logging',
        'use_request_time_ms_header',

        'remove_masthead_channel_banner_on_refresh',
        'action_companion_center_align_description',
        'disable_child_node_auto_formatted_strings',
        // 'enable_native_bridge_view_saved_playables',
        'enable_shadydom_free_scoped_query_methods',
        // 'enable_skippable_ads_for_unplugged_ad_pod',
        'enable_sparkles_web_clickable_description',
        'enable_window_constrained_buy_flow_dialog',
        // 'html5_enable_ads_client_monitoring_log_tv',
        'is_part_of_any_user_engagement_experiment',
        // 'kevlar_chapters_list_view_seek_by_chapter',
        // 'kevlar_enable_shorts_prefetch_in_sequence',
        // 'kevlar_resolve_command_for_confirm_dialog',
        // 'kevlar_shorts_seedless_retry_initial_load',
        // 'live_chat_enable_send_button_in_slow_mode',
        // 'live_chat_web_use_emoji_manager_singleton',
        'remove_masthead_channel_banner_on_refresh',
        // 'web_deprecate_service_ajax_map_dependency',
        'web_modern_player_settings_quality_bottom',
        // 'web_player_always_enable_auto_translation',
        // 'web_player_enable_cultural_moment_overlay',
        // 'ytidb_fetch_datasync_ids_for_data_cleanup',
        'kevlar_tuner_should_test_reuse_components',

        'web_player_ve_conversion_fixes_for_channel_info',
        'web_watch_updated_metadata_server_initial_delay',
        // 'trigger_impression_pings_on_view_search_desktop',

        'defer_menus',

      ] : []),

      ...(FLAG_SKIP_CHAT_BUTTON ? [
        'live_chat_overflow_hide_chat',
        'web_watch_chat_hide_button_killswitch',
      ] : []),


      ...(KEEP_unified_player ? [
        'kevlar_unified_player',
        'kevlar_non_watch_unified_player',
      ] : []),



      ...(FLAG_STRATEGY_03 ? [
        // do it with your separate script please
        'ab_pl_man', // https://www.uedbox.com/post/69238/
        'ab_fk_sk_cl', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
        'ab_det_apb_b',
        'ab_det_el_h',
        'ab_det_fet_wr',
        'ab_det_fet_wr_en',
        'ab_det_gen_re',
        'web_enable_ab_rsp_cl',
        'enable_ab_rp_int',
        'enable_ab_report_on_errorscreen',
        'enable_pl_r_si_fa',
        'ab_det_sc_inj_enf',
        'service_worker_enabled', // https://gist.github.com/BrokenGabe/51d55a11c2090d9402e40f12a6ece275
        'ab_deg_unex_thr', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
        'ab_net_tp_e', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
        'ad_net_pb_ab', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js
        'ab_mis_log_err', // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js

        'ab_det_sc_inj',
        'ab_det_sc_inj_val',
        'disable_enf_isd',
        'ks_det_gpbl',
        'ks_get_o_pp',
        'ab_deg_unex_thr',
        'enable_pl_r_si_fa',
        'debug_sk_em_precheck',

      ] : []),


      ...(FLAG_STRATEGY_02 ? [
        // do it with your separate script please
        'kevlar_client_enable_shorts_player_bootstrap',
        'kevlar_early_popup_close',
        'kevlar_hide_pp_url_param',
        'kevlar_touch_gesture_ves',
        'player_doubletap_to_seek',
        'shorts_controller_retrieve_seedless_sequence',
        'shorts_overlay_reshuffle',
      ] : []),


      ...(SET_POLYMER_FLAGS ? [
        'polymer_enable_mdx_queue',
        'polymer_on_demand_shady_dom',
      ] : []),

      ...(FLAG_STRATEGY_01 ? [
        'web_player_defer_modules',
        'html5_defer_modules_on_ads_only',
        'web_player_defer_ad',
        'disable_defer_admodule_on_advertiser_video',
        'html5_onesie_defer_content_loader_ms',
        'html5_defer_fetch_att_ms',
        'embeds_web_enable_defer_loading_remote_js',
      ] : []),

      ...(KEEP_MIDDLEWAVE ? [
        'web_player_entities_middleware'
      ] : []),

      'desktop_keyboard_capture_keydown_killswitch', // TBC
      'kevlar_autofocus_menu_on_keyboard_nav', // TBC
      'kevlar_keyboard_button_focus', // TBC
      'kevlar_macro_markers_keyboard_shortcut', // required

      // 'kevlar_appbehavior_attach_startup_tasks'
      // 'kevlar_clear_non_displayable_url_params'
      'kevlar_command_handler_formatted_string', // see https://github.com/cyfung1031/userscript-supports/issues/20
      'kevlar_miniplayer_queue_user_activation',
      'kevlar_player_watch_endpoint_navigation',
      // 'kevlar_watch_focus_on_engagement_panels'

      // playlist related flags
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

      // not sure
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
      // "rich_grid_resize_observer_only",

      'desktop_add_to_playlist_renderer_dialog_popup',

      ...(!DISABLE_CINEMATICS ? [

        'kevlar_measure_ambient_mode_idle',
        'kevlar_watch_cinematics_invisible',
        'web_cinematic_theater_mode',
        'web_cinematic_fullscreen',

        'enable_cinematic_blur_desktop_loading',
        'kevlar_watch_cinematics',
        'web_cinematic_masthead',
        'web_watch_cinematics_preferred_reduced_motion_default_disabled'

      ] : []),



      'kevlar_rendererstamper_event_listener', // https://github.com/cyfung1031/userscript-supports/issues/11




      'live_chat_web_enable_command_handler',
      'live_chat_channel_activity',
      'live_chat_web_input_update',

      'live_chat_web_enable_command_handler',

      ...(ALLOW_ALL_LIVE_CHATS_FLAGS ? [

        'live_chat_banner_expansion_fix',
        'live_chat_enable_mod_view',
        'live_chat_enable_qna_banner_overflow_menu_actions',
        'live_chat_enable_qna_channel',
        'live_chat_enable_send_button_in_slow_mode',
        'live_chat_filter_emoji_suggestions',
        'live_chat_increased_min_height',
        'live_chat_over_playlist',
        'live_chat_web_use_emoji_manager_singleton',
        'live_chat_whole_message_clickable',

        'live_chat_emoji_picker_toggle_state',
        'live_chat_enable_command_handler_resolver_map',
        'live_chat_enable_controller_extraction',
        'live_chat_enable_rta_manager',
        'live_chat_require_space_for_autocomplete_emoji',
        'live_chat_unclickable_message',

      ] : []),

      'kevlar_rendererstamper_event_listener', // https://github.com/cyfung1031/userscript-supports/issues/11

      // kevlar_enable_up_arrow - no use
      // kevlar_help_use_locale - might use
      // kevlar_refresh_gesture - might use
      // kevlar_smart_downloads - might use
      // kevlar_thumbnail_fluid
      'kevlar_ytb_live_badges',

      ...(!use_maintain_stable_list ? [
        'kevlar_tuner_should_test_maintain_stable_list',
        'kevlar_should_maintain_stable_list',
        'kevlar_tuner_should_maintain_stable_list', // fallback


      ] : []),


      ...(!use_maintain_reuse_components ? [

        'kevlar_tuner_should_test_reuse_components',
        'kevlar_tuner_should_reuse_components',
        'kevlar_should_reuse_components' // fallback

      ] : []),


      'kevlar_system_icons',

      // 'kevlar_prefetch_data_augments_network_data' continue;

      // home page / watch page icons
      'kevlar_three_dot_ink',
      'kevlar_use_wil_icons',
      'kevlar_home_skeleton',

      'kevlar_fluid_touch_scroll',
      'kevlar_watch_color_update',
      'kevlar_use_vimio_behavior', // home page - channel icon

      // collapsed meta; no teaser, use latest collapsed meta design
      'kevlar_structured_description_content_inline',
      'kevlar_watch_metadata_refresh',

      'kevlar_watch_js_panel_height', // affect Tabview Youtube

      'shorts_desktop_watch_while_p2',
      'web_button_rework',
      'web_darker_dark_theme_live_chat',
      'web_darker_dark_theme', // it also affect cinemtaics

      // modern menu
      'web_button_rework_with_live',
      'web_fix_fine_scrubbing_drag',

      // full screen -buggy
      'external_fullscreen',

      // minimize menu
      'web_modern_buttons',
      'web_modern_dialogs',

      // Tabview Youtube - multiline transcript
      'enable_mixed_direction_formatted_strings',

      'enable_unknown_lact_fix_on_html5',




      'live_chat_chunk_across_update_interval',

      'enable_native_live_chat_on_kevlar',

      'live_chat_author_name_color_usernames',
      'live_chat_seed_color_usernames',
      'live_chat_colored_usernames',
      'live_chat_simple_color_usernames',
      'web_button_rework_with_live',
      'live_chat_hide_avatars',
      'live_chat_enable_qna_replay',
      'live_chat_aggregation',
      'live_chat_web_use_emoji_manager_singleton',
      'enable_docked_chat_messages',
      'live_chat_taller_emoji_picker',
      'live_chat_emoji_picker_restyle',
      'live_chat_emoji_picker_restyle_remain_open_on_send',
      'live_chat_web_input_update',
      'live_chat_enable_send_button_in_slow_mode',

      'kevlar_watch_metadata_refresh_no_old_primary_data',
      // 'kevlar_watch_metadata_refresh_no_old_secondary_data', // for Tabview Youtube
      'enable_web_cosmetic_refresh_hashtag_page',
      'kevlar_watch_metadata_refresh_description_lines',




      'enable_service_ajax_csn',

      'kevlar_use_vimio_behavior',

      'web_use_cache_for_image_fallback',
      'kevlar_woffle_fallback_image',
      'yt_img_shadow_trigger_show_on_visible',
      'kevlar_thumbnail_bg',
      'web_rounded_thumbnails',



      'kevlar_rendererstamper_event_listener',

      'dialog_behavior_no_tap_killswitch',

      'handle_service_request_actions',

      'live_chat_whole_message_clickable',

      'live_chat_require_space_for_autocomplete_emoji',

      'kevlar_keyboard_button_focus',

      'live_chat_emoji_picker_toggle_state',
      'super_sticker_emoji_picker_category_button_icon_filled',
      'enable_super_chat_buy_flow_revamp_web',


      'web_modern_buttons',


      'web_modern_dialogs',
      'live_chat_disable_chat_feed_animation',
      'live_chat_overflow_hide_chat',
      'web_darker_dark_theme_live_chat',
      'live_chat_channel_activity',
      'live_chat_emoji_picker_restyle_remain_open_on_click_to_input_area',
      'live_chat_top_chat_sampling_enabled',

      'live_chat_enable_mod_view',
      'live_chat_web_enable_command_handler_action_handling',
      'web_modern_dialogs',
      'web_modern_dialog_layout',
      'web_modern_typography',

      'kevlar_disable_component_resizing_support',
      'web_rounded_thumbnails',
      'enable_quiz_desktop_animation',
      'kevlar_thumbnail_fluid',
      'web_enable_playlist_video_lockup_equalizer',
      'web_modern_collections_v2',
      'animated_live_badge_icon',
      'use_color_palettes_modern_collections_v2',
      'web_amsterdam_post_mvp_playlists',
      'enable_desktop_search_bigger_thumbs',
      'web_animated_actions',
      'mweb_animated_actions',
      'enable_desktop_amsterdam_info_panels',

      'kevlar_modern_sd',
      'problem_walkthrough_sd',
      'polymer_video_renderer_defer_menu',


      'enable_html5_teal_ad_badge',
      'kevlar_ytb_live_badges',
      'live_chat_enable_new_moderator_badge',
      'live_chat_prepend_badges',
      'live_chat_bold_color_usernames',
      'render_custom_emojis_as_small_images',

      'web_enable_dynamic_metadata',

      'web_animated_like',
      'web_animated_like_lazy_load',
      'desktop_delay_player_resizing',


    ];


    const s = new Set(BY_PASS);

    return s;

  };
  let cachedSet = null;

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

    cachedSet = cachedSet || cachedSetFn({ use_maintain_stable_list, use_maintain_reuse_components, use_defer_detach, no_autoplay_toggle });

    // I don't know why it requires to be extracted function.
    const mex = (EXPERIMENT_FLAGS, mzFlagDetected, fEntries) => {

      for (const [key, value] of fEntries) {


        if (value === true) {

          // if(key.indexOf('modern')>=0 || key.indexOf('enable')>=0 || key.indexOf('theme')>=0 || key.indexOf('skip')>=0  || key.indexOf('ui')>=0 || key.indexOf('observer')>=0 || key.indexOf('polymer')>=0 )continue;

          if (mzFlagDetected.has(key)) continue;
          mzFlagDetected.add(key);

          if (cachedSet.has(key)) continue;




          if (FLAG_STRATEGY_20240413 && key.includes('network')) continue;
          if (FLAG_STRATEGY_20240413 && key.includes('less')) continue;
          if (FLAG_STRATEGY_20240413 && key.includes('latency')) continue;
          if (FLAG_STRATEGY_20240413 && key.includes('slow')) continue;
          if (FLAG_STRATEGY_20240413 && key.includes('steam')) continue;

          // const kl = key.length;
          // const kl7 = kl % 7;
          // const kl5 = kl % 5;
          // const kl3 = kl % 3;
          // const kl2 = kl % 2;


          if (key.startsWith('html5_')) {

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

          } else if (key.startsWith('kevlar_')) {

          } else {

          }

          // console.log(key)
          EXPERIMENT_FLAGS[key] = false;
        }
      }
    }

    const mey = (EXPERIMENT_FLAGS, mzFlagDetected) => {
      // return;

      if (SPACEBAR_CONTROL === 0) {
        EXPERIMENT_FLAGS.disable_space_scroll_fix = false;
        EXPERIMENT_FLAGS.global_spacebar_pause = false;
        EXPERIMENT_FLAGS.web_speedmaster_spacebar_control = false;
      } else if (SPACEBAR_CONTROL === 1) {

        EXPERIMENT_FLAGS.disable_space_scroll_fix = false;
        EXPERIMENT_FLAGS.global_spacebar_pause = true;
        EXPERIMENT_FLAGS.web_speedmaster_spacebar_control = false;
      } else if (SPACEBAR_CONTROL === 2) {

        EXPERIMENT_FLAGS.disable_space_scroll_fix = false;
        EXPERIMENT_FLAGS.global_spacebar_pause = true;
        EXPERIMENT_FLAGS.web_speedmaster_spacebar_control = true;
      }

      EXPERIMENT_FLAGS.use_cfr_monitor = false;
      EXPERIMENT_FLAGS.skip_network_check_if_cfr = false;

      if (FLAG_STRATEGY_20240413) {
        EXPERIMENT_FLAGS.kevlar_watch_grid = false;
        EXPERIMENT_FLAGS.kevlar_watch_grid_hide_chips = false;
        EXPERIMENT_FLAGS.kevlar_watch_grid_reduced_top_margin_rich_grid = false;
        EXPERIMENT_FLAGS.kevlar_watch_grid_top_companion = false;
        EXPERIMENT_FLAGS.kevlar_watch_fixie = false;
        EXPERIMENT_FLAGS.kevlar_watch_grid_auto_open_playlist = false;
        EXPERIMENT_FLAGS.action_companion_center_align_description = false;
        EXPERIMENT_FLAGS.action_companion_truncate_domain = false;
      }

      if (ENABLE_MINOR_CHAT_FEATURE_UPGRADE) {


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


      if (NO_DESKTOP_DELAY_PLAYER_RESIZING) {

        EXPERIMENT_FLAGS.desktop_delay_player_resizing = false;
      }
      if (NO_ANIMATED_LIKE) {
        EXPERIMENT_FLAGS.web_animated_like = false;
        EXPERIMENT_FLAGS.web_animated_like_lazy_load = false;
      }

      if (use_maintain_stable_list) {
        if (USE_MAINTAIN_STABLE_LIST_ONLY_WHEN_KS_FLAG_IS_SET ? EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list === true : true) {
          // EXPERIMENT_FLAGS.kevlar_tuner_should_test_maintain_stable_list = true; // timestamp toggle issue
          EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list = true;
          // EXPERIMENT_FLAGS.kevlar_tuner_should_maintain_stable_list = true; // fallback // timestamp toggle issue
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
