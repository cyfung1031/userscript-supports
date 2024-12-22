// ==UserScript==
// @name                YouTube Super Fast Chat
// @version             0.66.1
// @license             MIT
// @name:ja             YouTube スーパーファーストチャット
// @name:zh-TW          YouTube 超快聊天
// @name:zh-CN          YouTube 超快聊天
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/super-fast-chat.png
// @namespace           UserScript
// @match               https://www.youtube.com/live_chat*
// @match               https://www.youtube.com/live_chat_replay*
// @author              CY Fung
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @require             https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
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
// @description         Ultimate Performance Boost for YouTube Live Chats
// @description:ja      YouTubeのライブチャットの究極のパフォーマンスブースト
// @description:zh-TW   YouTube直播聊天的終極性能提升
// @description:zh-CN   YouTube直播聊天的终极性能提升
//
// ==/UserScript==

((__CONTEXT__) => { 
  'use strict';

  const WeakMap = window.WeakMapOriginal || window.WeakMap;

  // *********** DON'T REPORT NOT WORKING DUE TO THE CHANGED SETTINGS ********************
  // The settings are FIXED! You might change them to try but if the script does not work due to your change, please, don't report them as issues

  const ENABLE_REDUCED_MAXITEMS_FOR_FLUSH = true;         // TRUE to enable trimming down to MAX_ITEMS_FOR_FULL_FLUSH (25) messages when there are too many unrendered messages
  const MAX_ITEMS_FOR_TOTAL_DISPLAY = 90;                 // By default, 250 latest messages will be displayed, but displaying MAX_ITEMS_FOR_TOTAL_DISPLAY (90) messages is already sufficient. (not exceeding 900)
  const MAX_ITEMS_FOR_FULL_FLUSH = 25;                    // If there are too many new (stacked) messages not yet rendered, clean all and flush MAX_ITEMS_FOR_FULL_FLUSH (25) latest messages then incrementally added back to MAX_ITEMS_FOR_TOTAL_DISPLAY (90) messages. (not exceeding 900)

  const ENABLE_NO_SMOOTH_TRANSFORM = true;                // Depends on whether you want the animation effect for new chat messages <<< DON'T CHANGE >>>
  const USE_OPTIMIZED_ON_SCROLL_ITEMS = true;             // TRUE for the majority
  const ENABLE_OVERFLOW_ANCHOR_PREFERRED = true;          // Enable `overflow-anchor: auto` to lock the scroll list at the bottom for no smooth transform.

  const FIX_SHOW_MORE_BUTTON_LOCATION = true;             // When there are voting options (bottom panel), move the "show more" button to the top.
  const FIX_INPUT_PANEL_OVERFLOW_ISSUE = true;            // When the super chat button is flicking with color, the scrollbar might come out.
  const FIX_INPUT_PANEL_BORDER_ISSUE = true;              // No border should be allowed if there is an empty input panel.
  const SET_CONTAIN_FOR_CHATROOM = true;                  // Rendering hacks (`contain`) for chatroom elements. [ General ]

  const FORCE_CONTENT_VISIBILITY_UNSET = true;            // Content-visibility should be always VISIBLE for high performance and great rendering.
  const FORCE_WILL_CHANGE_UNSET = true;                   // Will-change should be always UNSET (auto) for high performance and low energy impact.

  // Replace requestAnimationFrame timers with custom implementation
  const ENABLE_RAF_HACK_TICKERS = true;           // When there is a ticker
  const ENABLE_RAF_HACK_DOCKED_MESSAGE = true;    // To be confirmed
  const ENABLE_RAF_HACK_INPUT_RENDERER = true;    // To be confirmed
  const ENABLE_RAF_HACK_EMOJI_PICKER = true;      // When changing the page of the emoji picker

  // Force rendering all the character subsets of the designated font(s) before messages come (Pre-Rendering of Text)
  const ENABLE_FONT_PRE_RENDERING_PREFERRED = 1 | 2 | 4 | 8 | 16;

  // Backdrop `filter: blur(4px)` inside the iframe can extend to the whole page, causing a negative visual impact on the video you are watching.
  const NO_BACKDROP_FILTER_WHEN_MENU_SHOWN = true;

  // Data Manipulation for Participants (Participant List)
  // << if DO_PARTICIPANT_LIST_HACKS >>
  const DO_PARTICIPANT_LIST_HACKS = true;                     // TRUE for the majority
  const SHOW_PARTICIPANT_CHANGES_IN_CONSOLE = false;          // Just too annoying to show them all in popular chat
  const CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT = true;  // Only consider changes in renderable content (not concerned with the last chat message of the participants)
  const PARTICIPANT_UPDATE_ONLY_ONLY_IF_MODIFICATION_DETECTED = true;
  // << end >>

  // show more button
  const ENABLE_SHOW_MORE_BLINKER = true;                      // BLINK WHEN NEW MESSAGES COME

  // faster stampDomArray_ for participants list creation
  const ENABLE_FLAGS_MAINTAIN_STABLE_LIST_VAL = 1;            // 0 - OFF; 1 - ON; 2 - ON(PARTICIPANTS_LIST ONLY)
  const USE_MAINTAIN_STABLE_LIST_ONLY_WHEN_KS_FLAG_IS_SET = false;

  // reuse yt components
  const ENABLE_FLAGS_REUSE_COMPONENTS = true;

  // ShadyDom Free is buggy
  const DISABLE_FLAGS_SHADYDOM_FREE = true;

  // images <Group#I01>
  const AUTHOR_PHOTO_SINGLE_THUMBNAIL = 1;  // 0 - disable; 1- smallest; 2- largest
  const EMOJI_IMAGE_SINGLE_THUMBNAIL = 1;   // 0 - disable; 1- smallest; 2- largest
  const LEAST_IMAGE_SIZE = 48;              // minium size = 48px

  const DO_LINK_PREFETCH = true;                      // DO NOT CHANGE
  // << if DO_LINK_PREFETCH >>
  const ENABLE_BASE_PREFETCHING = true;               // (SUB-)DOMAIN | dns-prefetch & preconnect
  const ENABLE_PRELOAD_THUMBNAIL = true;              // subresource (prefetch) [LINK for Images]
  const SKIP_PRELOAD_EMOJI = true;
  const PREFETCH_LIMITED_SIZE_EMOJI = 512;            // DO NOT CHANGE THIS
  const PREFETCH_LIMITED_SIZE_AUTHOR_PHOTO = 68;      // DO NOT CHANGE THIS
  // << end >>

  const FIX_SETSRC_AND_THUMBNAILCHANGE_ = true;       // Function Replacement for yt-img-shadow....
  const FIX_THUMBNAIL_DATACHANGED = true;             // Function Replacement for yt-live-chat-author-badge-renderer..dataChanged
  // const REMOVE_PRELOADAVATARFORADDACTION = false;      // Function Replacement for yt-live-chat-renderer..preloadAvatarForAddAction

  const FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION = true;     // important [depends on <Group#I01>]
  const FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT = true;  // [depends on <Group#I01>]

  const ATTEMPT_ANIMATED_TICKER_BACKGROUND = '';   // false OR '' for disabled, 'linear', 'steps' for easing-function
  // <<<< ATTEMPT_ANIMATED_TICKER_BACKGROUND to be reviewed with memory leakage issues >>>>
  // << if ATTEMPT_ANIMATED_TICKER_BACKGROUND >>
  // BROWSER SUPPORT: Chrome 75+, Edge 79+, Safari 13.1+, Firefox 63+, Opera 62+
  const TICKER_MAX_STEPS_LIMIT = 500;                       //  NOT LESS THAN 5 STEPS!!
  // [limiting 500 max steps] is recommended for "confortable visual change"
  //      min. step increment 0.2% => max steps: 500 =>  800ms per each update
  //      min. step increment 0.5% => max steps: 200 => 1000ms per each update
  //      min. step increment 1.0% => max steps: 100 => 1000ms per each update
  //      min. step increment 2.5% => max steps:  40 => 1000ms per each update
  //      min. step increment 5.0% => max steps:  20 => 1250ms per each update
  const ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX = true;    // for video playback's ticker issue. [ Playback Replay - Pause at Middle - Backwards Seeking ]
  const SKIP_VIDEO_PLAYBACK_PROGRESS_STATE_FIX_FOR_NO_TIMEFX = false; // debug use; yt-live-chat-ticker-renderer might not require ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX
  // << end >>

  const FIX_TOOLTIP_DISPLAY = true;                       // changed in 2024.05.02
  const USE_VANILLA_DEREF = true;
  const FIX_DROPDOWN_DERAF = true;                        // DONT CHANGE


  const CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN = true;                // cache the menu data and used for the next reopen
  const ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU = false;   // pause auto scroll faster when the context menu is about to show
  const ENABLE_MUTEX_FOR_SHOW_CONTEXT_MENU = true;                // avoid multiple requests on the same time

  const BOOST_MENU_OPENCHANGED_RENDERING = true;
  const FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK = true;  // click again = close
  const NO_ITEM_TAP_FOR_NON_STATIONARY_TAP = true;                // dont open the menu (e.g. text message) if cursor is moved or long press
  const TAP_ACTION_DURATION = 280;                                // exceeding 280ms would not consider as a tap action
  const PREREQUEST_CONTEXT_MENU_ON_MOUSE_DOWN = true;             // require CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN = true
  // const FIX_MENU_CAPTURE_SCROLL = true;
  const CHAT_MENU_REFIT_ALONG_SCROLLING = 0;                      // 0 for locking / default; 1 for unlocking only; 2 for unlocking and refit

  const RAF_FIX_keepScrollClamped = true;
  const RAF_FIX_scrollIncrementally = 2;                          // 0: no action; 1: basic fix; 2: also fix scroll position

  // << if BOOST_MENU_OPENCHANGED_RENDERING >>
  const FIX_MENU_POSITION_N_SIZING_ON_SHOWN = 1;       // correct size and position when the menu dropdown opens

  const CHECK_JSONPRUNE = true;                        // This is a bug in Brave
  // << end >>

  // const LIVE_CHAT_FLUSH_ON_FOREGROUND_ONLY = false;

  const CHANGE_DATA_FLUSH_ASYNC = false;
  // CHANGE_DATA_FLUSH_ASYNC is disabled due to bug report: https://greasyfork.org/scripts/469878/discussions/199479
  // to be further investigated

  const CHANGE_MANAGER_UNSUBSCRIBE = true;

  const INTERACTIVITY_BACKGROUND_ANIMATION = 1;         // mostly for pinned message
  // 0 = default Yt animation background [= no fix];
  // 1 = disable default animation background [= keep special animation];
  // 2 = disable all animation backgrounds [= no animation backbround]

  const CLOSE_TICKER_PINNED_MESSAGE_WHEN_HEADER_CLICKED = true;

  const MAX_TOOLTIP_NO_WRAP_WIDTH = '72vw'; // '' for disable; accept values like '60px', '25vw'



  // (Dec 2024: AMEND_TICKER_handleLiveChatAction to be removed)
  const AMEND_TICKER_handleLiveChatAction = false; // to fix ticker duplication and unresponsively fast ticker generation
  // AMEND_TICKER_handleLiveChatAction to be fixed (2024.05.21)

  // (Dec 2024: AMEND_TICKER_handleLiveChatAction_v3 to be removed)
  const AMEND_TICKER_handleLiveChatAction_v3 = true; // responsiveness fix (Major Feature)

  const USE_ADVANCED_TICKING = true; // added in Dec 2024; need to ensure it would not affect the function if ticker design changed. to be reviewed




  const ATTEMPT_TICKER_ANIMATION_START_TIME_DETECTION = true;
  const ADJUST_TICKER_DURATION_ALIGN_RENDER_TIME = true;
  const FIX_BATCH_TICKER_ORDER = true;

  const DISABLE_Translation_By_Google = true;

  const FASTER_ICON_RENDERING = true;

  const DELAY_FOCUSEDCHANGED = true;

  const skipErrorForhandleAddChatItemAction_ = true; // currently depends on ENABLE_NO_SMOOTH_TRANSFORM
  const fixChildrenIssue801 = true; // if __children801__ is set [fix polymer controller method extration for `.set()`]

  const SUPPRESS_refreshOffsetContainerHeight_ = true; // added in FEB 2024; true for default layout options; no effect if ENABLE_NO_SMOOTH_TRANSFORM is false

  const NO_FILTER_DROPDOWN_BORDER = true; // added in 2024.03.02

  const FIX_ANIMATION_TICKER_TEXT_POSITION = true; // CSS fix; experimental; added in 2024.04.07
  const FIX_AUTHOR_CHIP_BADGE_POSITION = true;

  const FIX_ToggleRenderPolymerControllerExtractionBug = false; // to be reviewed

  const REACTION_ANIMATION_PANEL_CSS_FIX = true;

  // -------------------------------


  const FIX_MEMORY_LEAKAGE_TICKER_ACTIONMAP = true;       // To fix Memory Leakage in yt-live-chat-ticker-...-item-renderer
  const FIX_MEMORY_LEAKAGE_TICKER_STATSBAR = true;        // To fix Memory Leakage in updateStatsBarAndMaybeShowAnimation
  const FIX_MEMORY_LEAKAGE_TICKER_TIMER = true;           // To fix Memory Leakage in setContainerWidth, slideDown, collapse
  const FIX_MEMORY_LEAKAGE_TICKER_DATACHANGED_setContainerWidth = true; // To fix Memory Leakage due to _.ytLiveChatTickerItemBehavior.setContainerWidth()

  // leakage in ytd-sponsorships-live-chat-gift-purchase-announcement-renderer - to be confirmed

  // <<<<< FOR MEMORY LEAKAGE >>>>
  const DEBUG_wmList = false;
  let DEBUG_wmList_started = false;
  // const FLAG_001 = true;
  const FLAG_001a = false;
  const FLAG_001b = false;
  const FLAG_001c = false;
  const FLAG_001d = false;
  const FLAG_001e = false;
  const FLAG_001f = false;
  // const FLAG_001g = true;



/**
 * 
 * 
 * 
 * 
 * 
        rendererStamperObserver_: function(a, b, c) {
            if (c.path == a) {
                if (c.value === void 0 && !this.hasDataPath_[a])
                    return;
                this.hasDataPath_[a] = c.value !== void 0
            }
            this.rendererStamperApplyChangeRecord_(a, b, c)
        },


        addStampDomObserverFns_: function() {
            for (var a in this.stampDom) {
                var b = this.stampDom[a];
                b.id ? (this[SQa(b.id)] = this.rendererStamperObserver_.bind(this, a, b.id),
                this.hasDataPath_[a] = !1) : Er(new Dn("Bad rendererstamper config",this.is + ":" + a))
            }
        },
 * 
 * 
 * 
 * 
 * 
 */






  // <<<<< FOR MEMORY LEAKAGE >>>>

  // ========= EXPLANTION FOR 0.2% @ step timing [min. 0.2%] ===========
  /*

    ### Time Approach

    // all below values can make the time interval > 250ms
    // 250ms (practical value) refers to the minimum frequency for timeupdate in most browsers (typically, shorter timeupdate interval in modern browsers)
    if (totalDuration > 400000) stepInterval = 0.2;  // 400000ms with 0.2% increment => 800ms
    else if (totalDuration > 200000) stepInterval = 0.5; // 200000ms with 0.5% increment => 1000ms
    else if (totalDuration > 100000) stepInterval = 1; // 100000ms with 1% increment => 1000ms
    else if (totalDuration > 50000) stepInterval = 2; // 50000ms with 2% increment => 1000ms
    else if (totalDuration > 25000) stepInterval = 5; // 25000ms with 5% increment => 1250ms

    ### Pixel Check
    // Target Max Pixel Increment < 5px for Short Period Ticker (Rapid Background Change)
    // Assume total width <= 99px for short period ticker, like small donation & member welcome
    99px * 5% = 4.95px < 5px [Condition Fulfilled]

    ### Example - totalDuration = 280000
    totalDuration 280000
    stepInterval 0.5
    numOfSteps = Math.round(100 / stepInterval) = 200
    time interval = 280000 / 200 = 1400ms <acceptable>

    ### Example - totalDuration = 18000
    totalDuration 18000
    stepInterval 5
    numOfSteps = Math.round(100 / stepInterval) = 20
    time interval = 18000 / 20 = 900ms <acceptable>

    ### Example - totalDuration = 5000
    totalDuration 5000
    stepInterval 5
    numOfSteps = Math.round(100 / stepInterval) = 20
    time interval = 5000 / 20 = 250ms <threshold value>

    ### Example - totalDuration = 3600
    totalDuration 3600
    stepInterval 5
    numOfSteps = Math.round(100 / stepInterval) = 20
    time interval = 3600 / 20 = 180ms <reasonable for 3600ms ticker>

  */

  // =======================================================================================================

  // AUTOMAICALLY DETERMINED
  const ENABLE_FLAGS_MAINTAIN_STABLE_LIST = ENABLE_FLAGS_MAINTAIN_STABLE_LIST_VAL === 1;
  const ENABLE_FLAGS_MAINTAIN_STABLE_LIST_FOR_PARTICIPANTS_LIST = ENABLE_FLAGS_MAINTAIN_STABLE_LIST_VAL >= 1;
  const CHAT_MENU_SCROLL_UNLOCKING = CHAT_MENU_REFIT_ALONG_SCROLLING >= 1;
  let runTickerClassName = 'run-ticker';

  const dummyImgURL = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  /*
    WebP: data:image/webp;base64,UklGRjAB
    PNG: data:image/png;base64,iVBORw0KGg==
    JPEG: data:image/jpeg;base64,/9j/4AA=
    GIF: data:image/gif;base64,R0lGODlhAQABAIA=
    BMP: data:image/bmp;base64,Qk1oAAAA
    SVG: data:image/svg+xml;base64,PHN2Zy8+Cg==

    WebP: data:image/webp;base64,AAAAAAA=
    PNG:  data:image/png;base64,AAAAAAA=
    JPEG: data:image/jpeg;base64,AAAAAAA=
    GIF:  data:image/gif;base64,AAAAAAA=
    BMP:  data:image/bmp;base64,AAAAAAA=

    data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==


  */

  // image sizing code
  // (d = (d = KC(a.customThumbnail.thumbnails, 16)) ? lc(oc(d)) : null)


  //   function KC(a, b, c, d) {
  //     d = void 0 === d ? "width" : d;
  //     if (!a || !a.length)
  //         return null;
  //     if (z("kevlar_tuner_should_always_use_device_pixel_ratio")) {
  //         var e = window.devicePixelRatio;
  //         z("kevlar_tuner_should_clamp_device_pixel_ratio") ? e = Math.min(e, zl("kevlar_tuner_clamp_device_pixel_ratio")) : z("kevlar_tuner_should_use_thumbnail_factor") && (e = zl("kevlar_tuner_thumbnail_factor"));
  //         HC = e
  //     } else
  //         HC || (HC = window.devicePixelRatio);
  //     e = HC;
  //     z("kevlar_tuner_should_always_use_device_pixel_ratio") ? b *= e : 1 < e && (b *= e);
  //     if (z("kevlar_tuner_min_thumbnail_quality"))
  //         return a[0].url || null;
  //     e = a.length;
  //     if (z("kevlar_tuner_max_thumbnail_quality"))
  //         return a[e - 1].url || null;
  //     if (c)
  //         for (var h = 0; h < e; h++)
  //             if (0 <= a[h].url.indexOf(c))
  //                 return a[h].url || null;
  //     for (c = 0; c < e; c++)
  //         if (a[c][d] >= b)
  //             return a[c].url || null;
  //     for (b = e - 1; 0 < b; b--)
  //         if (a[b][d])
  //             return a[b].url || null;
  //     return a[0].url || null
  // }

  const { IntersectionObserver } = __CONTEXT__;
  let _x69;
  try {
    _x69 = document.createAttributeNS("http://www.w3.org/2000/svg", "nil").addEventListener;
  } catch (e) { }
  const pureAddEventListener = _x69;
  if (!pureAddEventListener) return console.warn("pureAddEventListener cannot be obtained.");

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  // let jsonParseFix = null;

  if (!IntersectionObserver) return console.warn("Your browser does not support IntersectionObserver.\nPlease upgrade to the latest version.");
  if (typeof WebAssembly !== 'object') return console.warn("Your browser is too old.\nPlease upgrade to the latest version."); // for passive and once

  // necessity of cssText3_smooth_transform_position to be checked.
  const cssText3_smooth_transform_position = ENABLE_NO_SMOOTH_TRANSFORM ? `

    #item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer {
        position: static !important;
    }

  `: '';

  // fallback if dummy style fn fails
  const cssText4_smooth_transform_forced_props = ENABLE_NO_SMOOTH_TRANSFORM ? `

    /* optional */
    #item-offset.style-scope.yt-live-chat-item-list-renderer {
        height: auto !important;
        min-height: unset !important;
    }

    #items.style-scope.yt-live-chat-item-list-renderer {
        transform: translateY(0px) !important;
    }

    /* optional */

  `: '';

  const cssText5 = SET_CONTAIN_FOR_CHATROOM ? `

    /* ------------------------------------------------------------------------------------------------------------- */

    yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image, yt-live-chat-author-chip #chat-badges.yt-live-chat-author-chip yt-live-chat-author-badge-renderer #image img {
        contain: layout style;
    }

    #items.style-scope.yt-live-chat-item-list-renderer {
        contain: layout paint style;
    }

    #item-offset.style-scope.yt-live-chat-item-list-renderer {
        contain: style;
    }

    #item-scroller.style-scope.yt-live-chat-item-list-renderer {
        contain: size style;
    }

    #contents.style-scope.yt-live-chat-item-list-renderer, #chat.style-scope.yt-live-chat-renderer, img.style-scope.yt-img-shadow[width][height] {
        contain: size layout paint style;
    }

    .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label], .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label] > #container {
        contain: layout paint style;
    }

    yt-live-chat-text-message-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-membership-item-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-paid-message-renderer.style-scope.yt-live-chat-item-list-renderer, yt-live-chat-banner-manager.style-scope.yt-live-chat-item-list-renderer {
        contain: layout style;
    }

    tp-yt-paper-tooltip[style*="inset"][role="tooltip"] {
        contain: layout paint style;
    }

    /* ------------------------------------------------------------------------------------------------------------- */

  ` : '';

  const cssText6b_show_more_button = FIX_SHOW_MORE_BUTTON_LOCATION ? `

    yt-live-chat-renderer[has-action-panel-renderer] #show-more.yt-live-chat-item-list-renderer{
        top: 4px;
        transition-property: top;
        bottom: unset;
    }

    yt-live-chat-renderer[has-action-panel-renderer] #show-more.yt-live-chat-item-list-renderer[disabled]{
        top: -42px;
    }

  `: '';

  const cssText6c_input_panel_overflow = FIX_INPUT_PANEL_OVERFLOW_ISSUE ? `

    #input-panel #picker-buttons yt-live-chat-icon-toggle-button-renderer#product-picker {
        contain: layout style;
    }

    #chat.yt-live-chat-renderer ~ #panel-pages.yt-live-chat-renderer {
        overflow: visible;
    }

  `: '';

  const cssText6d_input_panel_border = FIX_INPUT_PANEL_BORDER_ISSUE ? `

    html #panel-pages.yt-live-chat-renderer > #input-panel.yt-live-chat-renderer:not(:empty) {
        --yt-live-chat-action-panel-top-border: none;
    }

    html #panel-pages.yt-live-chat-renderer > #input-panel.yt-live-chat-renderer.iron-selected > *:first-child {
        border-top: 1px solid var(--yt-live-chat-panel-pages-border-color);
    }

    html #panel-pages.yt-live-chat-renderer {
        border-top: 0;
        border-bottom: 0;
    }

  `: '';

  const cssText7b_content_visibility_unset = FORCE_CONTENT_VISIBILITY_UNSET ? `

    img,
    yt-img-shadow[height][width],
    yt-img-shadow {
        content-visibility: visible !important;
    }

  `  : '';

  const cssText7c_will_change_unset = FORCE_WILL_CHANGE_UNSET ? `

    /* remove YouTube constant will-change */
    /* constant value will slow down the performance; default auto */

    /* www-player.css */
    html .ytp-contextmenu,
    html .ytp-settings-menu {
        will-change: unset;
    }

    /* frequently matched elements */
    html .fill.yt-interaction,
    html .stroke.yt-interaction,
    html .yt-spec-touch-feedback-shape__fill,
    html .yt-spec-touch-feedback-shape__stroke {
        will-change: unset;
    }

    /* live_chat_polymer.js */
    /*
    html .toggle-button.tp-yt-paper-toggle-button,
    html #primaryProgress.tp-yt-paper-progress,
    html #secondaryProgress.tp-yt-paper-progress,
    html #onRadio.tp-yt-paper-radio-button,
    html .fill.yt-interaction,
    html .stroke.yt-interaction,
    html .yt-spec-touch-feedback-shape__fill,
    html .yt-spec-touch-feedback-shape__stroke {
        will-change: unset;
    }
    */

    /* desktop_polymer_enable_wil_icons.js */
    /* html .fill.yt-interaction,
    html .stroke.yt-interaction, */
    html tp-yt-app-header::before,
    html tp-yt-iron-list,
    html #items.tp-yt-iron-list > *,
    html #onRadio.tp-yt-paper-radio-button,
    html .toggle-button.tp-yt-paper-toggle-button,
    html ytd-thumbnail-overlay-toggle-button-renderer[use-expandable-tooltip] #label.ytd-thumbnail-overlay-toggle-button-renderer,
    html #items.ytd-post-multi-image-renderer,
    html #items.ytd-horizontal-card-list-renderer,
    html #items.yt-horizontal-list-renderer,
    html #left-arrow.yt-horizontal-list-renderer,
    html #right-arrow.yt-horizontal-list-renderer,
    html #items.ytd-video-description-infocards-section-renderer,
    html #items.ytd-video-description-music-section-renderer,
    html #chips.ytd-feed-filter-chip-bar-renderer,
    html #chips.yt-chip-cloud-renderer,
    html #items.ytd-merch-shelf-renderer,
    html #items.ytd-product-details-image-carousel-renderer,
    html ytd-video-preview,
    html #player-container.ytd-video-preview,
    html #primaryProgress.tp-yt-paper-progress,
    html #secondaryProgress.tp-yt-paper-progress,
    html ytd-miniplayer[enabled] /* ,
    html .yt-spec-touch-feedback-shape__fill,
    html .yt-spec-touch-feedback-shape__stroke */ {
        will-change: unset;
    }

    /* other */
    .ytp-videowall-still-info-content[class],
    .ytp-suggestion-image[class] {
        will-change: unset !important;
    }

  ` : '';

  const ENABLE_FONT_PRE_RENDERING = typeof HTMLElement.prototype.append === 'function' ? (ENABLE_FONT_PRE_RENDERING_PREFERRED || 0) : 0;
  const cssText8_fonts_pre_render = ENABLE_FONT_PRE_RENDERING ? `

    elzm-fonts {
        visibility: collapse;
        position: fixed;
        top: -10px;
        left: -10px;
        font-size: 10pt;
        line-height: 100%;
        width: 100px;
        height: 100px;
        transform: scale(0.1);
        transform: scale(0.01);
        transform: scale(0.001);
        transform-origin: 0 0;
        contain: strict;
        display: block;

        pointer-events: none !important;
        user-select: none !important;
    }

    elzm-fonts[id]#elzm-fonts-yk75g {
        user-select: none !important;
        pointer-events: none !important;
    }

    elzm-font {
        visibility: collapse;
        position: absolute;
        line-height: 100%;
        width: 100px;
        height: 100px;
        contain: strict;
        display: block;

        user-select: none !important;
        pointer-events: none !important;
    }

    elzm-font::before {
        visibility: collapse;
        position: absolute;
        line-height: 100%;
        width: 100px;
        height: 100px;
        contain: strict;
        display: block;

        content: '0aZ!@#$~^&*()_-+[]{}|;:><?\\0460\\0301\\0900\\1F00\\0370\\0102\\0100\\28EB2\\28189\\26DA0\\25A9C\\249BB\\23F61\\22E8B\\21927\\21076\\2048E\\1F6F5\\FF37\\F94F\\F0B2\\9F27\\9D9A\\9BEA\\9A6B\\98EC\\9798\\9602\\949D\\9370\\926B\\913A\\8FA9\\8E39\\8CC1\\8B26\\8983\\8804\\8696\\8511\\83BC\\828D\\8115\\7F9A\\7E5B\\7D07\\7B91\\7A2C\\78D2\\776C\\7601\\74AA\\73B9\\7265\\70FE\\6FBC\\6E88\\6D64\\6C3F\\6A9C\\6957\\67FE\\66B3\\6535\\63F2\\628E\\612F\\5FE7\\5E6C\\5CEE\\5B6D\\5A33\\58BC\\575B\\5611\\54BF\\536E\\51D0\\505D\\4F22\\4AD1\\41DB\\3B95\\3572\\2F3F\\26FD\\25A1\\2477\\208D\\1D0A\\1FB\\A1\\A3\\B4\\2CB\\60\\10C\\E22\\A5\\4E08\\B0\\627\\2500\\5E\\201C\\3C\\B7\\23\\26\\3E\\D\\20\\25EE8\\1F235\\FFD7\\FA10\\F92D\\9E8B\\9C3E\\9AE5\\98EB\\971D\\944A\\92BC\\9143\\8F52\\8DC0\\8B2D\\8973\\87E2\\8655\\84B4\\82E8\\814A\\7F77\\7D57\\7BC8\\7A17\\7851\\768C\\7511\\736C\\7166\\6F58\\6D7C\\6B85\\69DD\\6855\\667E\\64D2\\62CF\\6117\\5F6C\\5D9B\\5BBC\\598B\\57B3\\5616\\543F\\528D\\50DD\\4F57\\4093\\3395\\32B5\\31C8\\3028\\2F14\\25E4\\24D1\\2105\\2227\\A8\\2D9\\2CA\\2467\\B1\\2020\\2466\\251C\\266B\\AF\\4E91\\221E\\2464\\2266\\2207\\4E32\\25B3\\2463\\2010\\2103\\3014\\25C7\\24\\25BD\\4E18\\2460\\21D2\\2015\\2193\\4E03\\7E\\25CB\\2191\\25BC\\3D\\500D\\4E01\\25\\30F6\\2605\\266A\\40\\2B\\4E16\\7C\\A9\\4E\\21\\1F1E9\\FEE3\\F0A7\\9F3D\\9DFA\\9C3B\\9A5F\\98C8\\972A\\95B9\\94E7\\9410\\92B7\\914C\\8FE2\\8E2D\\8CAF\\8B5E\\8A02\\8869\\86E4\\8532\\83B4\\82A9\\814D\\7FFA\\7ED7\\7DC4\\7CCC\\7BC3\\7ACA\\797C\\783E\\770F\\760A\\74EF\\73E7\\72DD\\719C\\7005\\6ED8\\6DC3\\6CB2\\6A01\\68E1\\6792\\663A\\64F8\\63BC\\623B\\60FA\\5FD1\\5EA3\\5D32\\5BF5\\5AB2\\5981\\5831\\570A\\5605\\5519\\53FB\\52A2\\5110\\4FE3\\4EB8\\3127\\279C\\2650\\254B\\23E9\\207B\\1D34\\2AE\\176\\221A\\161\\200B\\300C\\4E4C\\1F921\\FF78\\FA0A\\F78A\\9EB9\\9D34\\9BD3\\9A6F\\9912\\97C6\\964E\\950C\\93E4\\92E5\\91F0\\90BB\\8F68\\8E18\\8B6C\\89F6\\889B\\874C\\8602\\84B1\\8378\\826E\\8113\\7FB1\\7EAF\\7D89\\7C20\\7AFB\\7988\\7840\\7705\\75CC\\749A\\73B3\\727F\\7113\\6FE8\\6ED6\\6DD3\\6CDA\\6BBB\\6A31\\6900\\67D9\\66A7\\655D\\6427\\630D\\61C6\\60AC\\5F78\\5E34\\5CE0\\5B80\\5A51\\590B\\57A1\\566F\\5551\\543D\\52DB\\518F\\5032\\3A17\\305C\\2749\\264A\\2567\\2476\\2139\\1EC0\\11AF\\2C8\\1AF\\E17\\2190\\2022\\2502\\2312\\2025\\50';

        user-select: none !important;
        pointer-events: none !important;
    }

  `: '';

  const cssText9_no_backdrop_filter_when_menu_shown = NO_BACKDROP_FILTER_WHEN_MENU_SHOWN ? `
    tp-yt-iron-dropdown.yt-live-chat-app ytd-menu-popup-renderer  {
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
    }
  `: '';

  const cssText10_show_more_blinker = ENABLE_SHOW_MORE_BLINKER ? `

    @keyframes blinker-miuzp {
        0%, 60%, 100% {
            opacity: 1;
        }
        30% {
            opacity: 0.6;
        }
    }

    yt-icon-button#show-more.has-new-messages-miuzp {
        animation: blinker-miuzp 1.74s linear infinite;
    }

  `: '';

  const cssText11_entire_message_clickable = FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK ? `

    yt-live-chat-paid-message-renderer.yt-live-chat-item-list-renderer[whole-message-clickable] #menu.style-scope[class] {
      pointer-events: none !important;
    }

    yt-live-chat-membership-item-renderer.yt-live-chat-item-list-renderer[whole-message-clickable] #menu.style-scope[class] {
      pointer-events: none !important;
    }

    yt-live-chat-paid-sticker-renderer.yt-live-chat-item-list-renderer[whole-message-clickable] #menu.style-scope[class] {
      pointer-events: none !important;
    }

    yt-live-chat-text-message-renderer.yt-live-chat-item-list-renderer[whole-message-clickable] #menu.style-scope[class] {
      pointer-events: none !important; /* TO_BE_REVIEWED */
    }

    yt-live-chat-auto-mod-message-renderer.yt-live-chat-item-list-renderer[whole-message-clickable] #menu.style-scope[class] {
      pointer-events: none !important;
    }

  `: '';

  const cssText12_nowrap_tooltip = MAX_TOOLTIP_NO_WRAP_WIDTH && typeof MAX_TOOLTIP_NO_WRAP_WIDTH === 'string' ? `


    tp-yt-paper-tooltip[role="tooltip"] {
      box-sizing: content-box !important;
      margin: 0px !important;
      padding: 0px !important;
      contain: none !important;
    }

    tp-yt-paper-tooltip[role="tooltip"] #tooltip[style-target="tooltip"] {
      box-sizing: content-box !important;
      display: inline-block;
      contain: none !important;
    }


    tp-yt-paper-tooltip[role="tooltip"] #tooltip[style-target="tooltip"]{
      max-width: ${MAX_TOOLTIP_NO_WRAP_WIDTH};
      width: max-content;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }


  `: '';


  const cssText13_no_text_select_when_menu_visible = `
    [menu-visible] {
      --sfc47-text-select: none;
    }
    [menu-visible] #header[id][class],
    [menu-visible] #content[id][class],
    [menu-visible] #header[id][class] *,
    [menu-visible] #content[id][class] * {
      user-select: var(--sfc47-text-select) !important;
    }
    [menu-visible] #menu {
      --sfc47-text-select: inherit;
    }
  `;

  const cssText14_NO_FILTER_DROPDOWN_BORDER = NO_FILTER_DROPDOWN_BORDER ? `
  yt-live-chat-header-renderer.yt-live-chat-renderer #label.yt-dropdown-menu::before {
    border:0;
  }
  ` : '';

  const cssText15_FIX_ANIMATION_TICKER_TEXT_POSITION = FIX_ANIMATION_TICKER_TEXT_POSITION ? `
    .style-scope.yt-live-chat-ticker-renderer #animation-container[id][class] {
      position: relative;
      display: grid;
      grid-auto-columns: 1fr;
      grid-auto-rows: 1fr;
      grid-template-columns: repeat(1, 1fr);
      gap: 7px;
      padding-bottom: 0;
      margin-bottom: 0;
      padding-top: 0;
      align-self: flex-start;
      flex-wrap: nowrap;
      margin-top: 1px;
  }

  .style-scope.yt-live-chat-ticker-renderer #animation-container > [id][class] {
      margin-top: 0px;
      margin-bottom: 0px;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
  }

  .style-scope.yt-live-chat-ticker-renderer #animation-container > [id][class]:first-child::after {
      content: '補';
      visibility: collapse;
      display: inline-block;
      position: relative;
      width: 0;
      line-height: 22px;
  }

  ` : '';

  const cssText16_FIX_AUTHOR_CHIP_BADGE_POSITION = FIX_AUTHOR_CHIP_BADGE_POSITION ? `
    #card  #author-name-chip > yt-live-chat-author-chip[single-line] {
        flex-wrap: nowrap;
        white-space: nowrap;
        display: inline-flex;
        flex-direction: row;
        text-wrap: nowrap;
        flex-shrink: 0;
        align-items: center;
    }

    #card  #author-name-chip {
        display: inline-flex;
        flex-direction: row;
        align-items: flex-start;
    }
  `: '';


  // Example: https://www.youtube.com/watch?v=Xfytz-igsuc
  const cssText17_FIX_overwidth_banner_message = `
    yt-live-chat-banner-manager#live-chat-banner.style-scope.yt-live-chat-item-list-renderer {
      max-width: 100%;
      box-sizing: border-box;
    }
  `;


  const cssText18_REACTION_ANIMATION_PANEL_CSS_FIX = REACTION_ANIMATION_PANEL_CSS_FIX ? `
    #reaction-control-panel-overlay[class] {
      contain: strict;
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
      will-change: initial;
    }
    #reaction-control-panel-overlay[class] *[class] {
      will-change: initial;
    }
  `: '';

  const cssText19_FOR_ADVANCED_TICKING = `
  
  ticker-bg-overlay {
    display: block;
    position: absolute;
    box-sizing: border-box;
    border: 0;
    padding: 0;
    margin: 0;
    width: 200%;
    top: 0;
    bottom: 0;
    left: clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%);
  }
  ticker-bg-overlay-end {
    position: absolute;
    right: 0px;
    top: 50%;
    display: block;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
    box-sizing: border-box;
    border: 0;
    padding: 0;
    margin: 0;
  }

  /*


    ey.style.position = 'absolute';
    ey.style.right = '0px';
    ey.style.top = '50%';
    ey.style.display='block';
    ey.style.width='1px';
    ey.style.height='1px';
    ey.style.opacity = '0';

    em.style.display = 'block';
    em.style.position = 'absolute';
    em.style.boxSizing = 'border-box';
    em.style.width = '200%';
    em.style.top = '0';
    em.style.bottom = '0';
    // em.style.height = '100%';


    // em.style.left = '-50%';
    // em.style.left = "clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%)";

  */

  `;

  const addCss = () => `

    @property --ticker-rtime {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 0%;
    }

    /*
    .run-ticker {
      background:linear-gradient(90deg, var(--ticker-c1),var(--ticker-c1) var(--ticker-rtime),var(--ticker-c2) var(--ticker-rtime),var(--ticker-c2));
    }

    .run-ticker-test {
      background: #00000001;
    }

    .run-ticker-forced,
    yt-live-chat-ticker-renderer #items > * > #container.run-ticker-forced,
    yt-live-chat-ticker-renderer[class] #items[class] > *[class] > #container.run-ticker-forced[class]
    {
      background:linear-gradient(90deg, var(--ticker-c1),var(--ticker-c1) var(--ticker-rtime),var(--ticker-c2) var(--ticker-rtime),var(--ticker-c2)) !important;
    }
    */

    .run-ticker {
      --ticker-bg:linear-gradient(90deg, var(--ticker-c1),var(--ticker-c1) var(--ticker-rtime),var(--ticker-c2) var(--ticker-rtime),var(--ticker-c2));
    }

    .run-ticker,
    yt-live-chat-ticker-renderer #items > * > #container.run-ticker,
    yt-live-chat-ticker-renderer[class] #items[class] > *[class] > #container.run-ticker[class]
    {
      background: var(--ticker-bg) !important;
    }

    yt-live-chat-ticker-dummy777-item-renderer {
      background: #00000001;
    }

    yt-live-chat-ticker-dummy777-item-renderer[dummy777] {
      position: fixed !important;
      top: -1000px !important;
      left: -1000px !important;
      font-size: 1px !important;
      color: transparent !important;
      pointer-events: none !important;
      z-index: -1 !important;
      contain: strict !important;
      box-sizing: border-box !important;
      pointer-events: none !important;
      user-select: none !important;
      max-width: 1px !important;
      max-height: 1px !important;
      overflow: hidden !important;
      visibility: collapse !important;
      display: none !important;
    }

    yt-live-chat-ticker-dummy777-item-renderer #container {
      background: inherit;
    }


    ${cssText8_fonts_pre_render}

    ${cssText9_no_backdrop_filter_when_menu_shown}

    @supports (contain: layout paint style) {

      ${cssText5}

    }

    @supports (color: var(--general)) {

      html {
          --yt-live-chat-item-list-renderer-padding: 0px 0px;
      }

      ${cssText3_smooth_transform_position}

      ${cssText7c_will_change_unset}

      ${cssText7b_content_visibility_unset}

      yt-live-chat-item-list-renderer:not([allow-scroll]) #item-scroller.yt-live-chat-item-list-renderer {
          overflow-y: scroll;
          padding-right: 0;
      }

      ${cssText4_smooth_transform_forced_props}

      yt-icon[icon="down_arrow"] > *, yt-icon-button#show-more > * {
          pointer-events: none !important;
      }

      #continuations, #continuations * {
          contain: strict;
          position: fixed;
          top: 2px;
          height: 1px;
          width: 2px;
          height: 1px;
          visibility: collapse;
      }

      ${cssText6b_show_more_button}

      ${cssText6d_input_panel_border}

      ${cssText6c_input_panel_overflow}

    }


    @supports (overflow-anchor: auto) {

      .no-anchor * {
          overflow-anchor: none;
      }
      .no-anchor > item-anchor {
          overflow-anchor: auto;
      }

      item-anchor {

          height:1px;
          width: 100%;
          transform: scaleY(0.00001);
          transform-origin:0 0;
          contain: strict;
          opacity:0;
          display:flex;
          position:relative;
          flex-shrink:0;
          flex-grow:0;
          margin-bottom:0;
          overflow:hidden;
          box-sizing:border-box;
          visibility: visible;
          content-visibility: visible;
          contain-intrinsic-size: auto 1px;
          pointer-events:none !important;

      }

      #item-scroller.style-scope.yt-live-chat-item-list-renderer[class] {
          overflow-anchor: initial !important; /* whenever ENABLE_OVERFLOW_ANCHOR or not */
      }

      html item-anchor {

          height: 1px;
          width: 1px;
          top: auto;
          left: auto;
          right: auto;
          bottom: auto;
          transform: translateY(-1px);
          position: absolute;
          z-index: -1;

      }

    }

    @supports (color: var(--pre-rendering)) {

      @keyframes dontRenderAnimation {
          0% {
              background-position-x: 3px;
          }
          100% {
              background-position-x: 4px;
          }
      }

      .dont-render[class] {
          /* visibility: collapse !important; */
          /* visibility: collapse will make innerText become "" which conflicts with BetterStreamChat; see https://greasyfork.org/scripts/469878/discussions/197267 */

          transform: scale(0.01) !important;
          transform: scale(0.00001) !important;
          transform: scale(0.0000001) !important;
          transform-origin: 0 0 !important;
          z-index: -1 !important;
          contain: strict !important;
          box-sizing: border-box !important;

          height: 1px !important;
          height: 0.1px !important;
          height: 0.01px !important;
          height: 0.0001px !important;
          height: 0.000001px !important;

          animation: dontRenderAnimation 1ms linear 80ms 1 normal forwards !important;

          pointer-events: none !important;
          user-select: none !important;

      }

      #sk35z {
        display: block !important;

        visibility: collapse !important;

        transform: scale(0.01) !important;
        transform: scale(0.00001) !important;
        transform: scale(0.0000001) !important;
        transform-origin: 0 0 !important;
        z-index: -1 !important;
        contain: strict !important;
        box-sizing: border-box !important;

        height: 1px !important;
        height: 0.1px !important;
        height: 0.01px !important;
        height: 0.0001px !important;
        height: 0.000001px !important;

        position: absolute !important;
        top: -1000px !important;
        left: -1000px !important;

      }

    }

    [rNgzQ] {
      opacity: 0 !important;
      pointer-events: none !important;
    }


    ${cssText10_show_more_blinker}

    ${cssText11_entire_message_clickable}

    ${cssText12_nowrap_tooltip}

    ${cssText13_no_text_select_when_menu_visible}

    ${cssText14_NO_FILTER_DROPDOWN_BORDER}

    ${cssText15_FIX_ANIMATION_TICKER_TEXT_POSITION}

    ${cssText16_FIX_AUTHOR_CHIP_BADGE_POSITION}

    ${cssText17_FIX_overwidth_banner_message}

    ${cssText18_REACTION_ANIMATION_PANEL_CSS_FIX}

    ${cssText19_FOR_ADVANCED_TICKING}

  `;


  const konsole = {
    nil: Symbol(),
    logs: [],
    style: '',
    log(...args) {
      konsole.logs.push({
        type: 'log',
        msg: [konsole.tag || konsole.nil, ...args, konsole.style || konsole.nil].filter(e => e !== konsole.nil)
      });
    },
    setTag(tag) {
      konsole.tag = tag;
    },
    setStyle(style) {
      konsole.style = style;
    },
    groupCollapsed(...args) {

      konsole.logs.push({
        type: 'groupCollapsed',
        msg: [...args].filter(e => e !== konsole.nil)
      });
    },
    groupEnd() {

      konsole.logs.push({
        type: 'groupEnd'
      })
    },
    print() {
      const copy = konsole.logs.slice(0);
      konsole.logs.length = 0;
      for (const { type, msg } of copy) {
        if (type === 'log') {
          console.log(...msg)
        } else if (type === 'groupCollapsed') {

          console.groupCollapsed(...msg)
        } else if (type === 'groupEnd') {
          console.groupEnd();
        }

      }

    }
  };

  /*
  konsole.groupCollapsedX = (text1, text2) => {

    if(!text2){

      konsole.groupCollapsed(`%c${text1}`,
      "background-color: #010502; color: #6acafe; font-weight: 700; padding: 2px;"
    );
    }else{

      konsole.groupCollapsed(`%c${text1}%c${text2}`,
      "background-color: #010502; color: #6acafe; font-weight: 700; padding: 2px;",
      "background-color: #010502; color: #6ad9fe; font-weight: 300; padding: 2px;"
    );
    }
  }

  konsole.groupCollapsedX('YouTube Super Fast Chat');

  setTimeout(()=>{

    konsole.setTag('[[Fonts Pre-Rendering]]');
    konsole.log(123);
    konsole.log('wsd',332, 'ssa');
    konsole.setTag('');
  }, 100);

  setTimeout(()=>{

    konsole.setTag('[[Fonts Pre-Rendering 2]]');
    konsole.log(123);
    konsole.log('wsd',332, 'ssa');
    konsole.setTag('');
  }, 300);

  setTimeout(()=>{

  konsole.groupEnd();
  konsole.print();
  }, 1000);

  */

  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (this instanceof Window ? this : window);

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'mchbwnoasqph';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  let unexpectedErr = "";

  if (!!ATTEMPT_ANIMATED_TICKER_BACKGROUND) {

    let te4 = setTimeout(() => { }); // dummy; skip timerId only;
    if (te4 < 3) {
      setTimeout(() => { });
      setTimeout(() => { });
    }

  }

  const firstKey = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return key;
    }
    return null;
  }

  const firstObjectKey = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') return key;
    }
    return null;
  }

  /**
 * Takes in a __SORTED__ array and inserts the provided value into
 * the correct, sorted, position.
 * > https://github.com/bhowell2/binary-insert-js/
 * @param array the sorted array where the provided value needs to be inserted (in order)
 * @param insertValue value to be added to the array
 * @param comparator function that helps determine where to insert the value (
 */
  function binaryInsert(array, insertValue, comparator) {
    let left = 0;
    let right = array.length;

    let z;
    // Directly return if array is empty or the insertValue should be at the end
    if (right === 0 || (z = comparator(array[right - 1], insertValue)) <= 0) {
      array.push(insertValue);
      return array;
    }

    // Check if the insertValue should be at the beginning
    if ((right === 1 ? z : comparator(array[0], insertValue)) >= 0) {
      array.unshift(insertValue);
      return array;
    }
    ++left; --right;

    // Main binary search loop to find the insertion position
    while (left < right) {
      const mid = Math.floor((right + left) / 2);
      const compared = comparator(array[mid], insertValue);
      if (compared < 0) {
        left = mid + 1;
      } else if (compared > 0) {
        right = mid;
      } else {
        // If equal, insert at the mid position
        left = right = mid;
        break;
      }
    }

    // Insertion is always at the right position due to the nature of the binary search
    array.splice(right, 0, insertValue);
    return array;
  }




  class LimitedSizeSet extends Set {
    constructor(n) {
      super();
      this.limit = n;
    }

    add(key) {
      if (!super.has(key)) {
        super.add(key);
        let n = super.size - this.limit;
        if (n > 0) {
          const iterator = super.values();
          do {
            const firstKey = iterator.next().value; // Get the first (oldest) key
            super.delete(firstKey); // Delete the oldest key
          } while (--n > 0)
        }
      }
    }

    removeAdd(key) {
      super.delete(key);
      this.add(key);
    }

  }


  class LimitedSizeMap extends Map {
    constructor(n) {
      super();
      this.limit = n;
    }

    set(key, val) {
      if (!super.has(key)) {
        super.set(key, val);
        let n = super.size - this.limit;
        if (n > 0) {
          const iterator = super.keys();
          do {
            const firstKey = iterator.next().value; // Get the first (oldest) key
            super.delete(firstKey); // Delete the oldest key
          } while (--n > 0)
        }
      }
    }

    removeSet(key, val) {
      super.delete(key);
      this.set(key, val);
    }

  }

  // function removeElementFromArray(arr, index) {
  //   if (index >= 0 && index < arr.length) {
  //     arr.splice(index, 1);
  //   }
  // }

  // function getRandomInt(a, b) {
  //   // Ensure that 'a' and 'b' are integers
  //   a = Math.ceil(a);
  //   b = Math.floor(b);

  //   // Generate a random integer in the range [a, b]
  //   return Math.floor(Math.random() * (b - a + 1)) + a;
  // }

  function deepCopy(obj, skipKeys) {
    skipKeys = skipKeys || [];
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.map(item => deepCopy(item, skipKeys));
    }
    const copy = {};
    for (let key in obj) {
      if (!skipKeys.includes(key)) {
        copy[key] = deepCopy(obj[key], skipKeys);
      }
    }
    return copy;
  }

  class Mutex {

    constructor() {
      this.p = Promise.resolve()
    }

    /**
     *  @param {(lockResolve: () => void)} f
     */
    lockWith(f) {
      this.p = this.p.then(() => new Promise(f).catch(console.warn))
    }

  }

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

  const tickerPE = createPipeline();

  /** @type {typeof PromiseExternal.prototype | null} */
  let relayPromise = null;


  /** @type {typeof PromiseExternal.prototype | null} */
  let onPlayStateChangePromise = null;




  const valAssign = (elm, attr, val) => {
    val = val.toFixed(3);
    if (!(Math.abs(elm.style.getPropertyValue(attr) - val) < 1e-5)) {
      elm.style.setProperty(attr, val);
      return true;
    }
    return false;
  };

  let timestampUnderLiveMode = false;

  const updateTickerCurrentTime = () => {

    const dntElement = kRef(dntElementWeak);
    const v = timestampUnderLiveMode ? (Date.now() / 1000 - timeOriginDT / 1000) : playerProgressChangedArg1;
    if (dntElement instanceof HTMLElement && v >= 0) {
      valAssign(dntElement, '--ticker-current-time', v);
    }
  }

  let playEventsStack = Promise.resolve();


  let playerProgressChangedArg1 = null;
  let playerProgressChangedArg2 = null;
  let playerProgressChangedArg3 = null;

  let dntElementWeak = null;

  // ================== FOR USE_ADVANCED_TICKING ================

  const timeOriginDT = +new Date(performance.timeOrigin);
  let startResitanceUpdaterStarted = false;

  const RESISTANCE_UPDATE_OPT = 3;
  let resitanceUpdateLast = 0;
  const allBackgroundOverLays = document.getElementsByTagName('ticker-bg-overlay');
  const resitanceUpdateFn = ()=>{
    if(allBackgroundOverLays.length === 0) return;
    const t = Date.now();
    if (t - resitanceUpdateLast > 375) {
      resitanceUpdateLast = t;
      updateTickerCurrentTime();
    }
  }
  const startResitanceUpdater = () => {

    if (startResitanceUpdaterStarted) return;
    startResitanceUpdaterStarted = true;


    if (RESISTANCE_UPDATE_OPT & 1)
      document.addEventListener('yt-action', () => {
        resitanceUpdateFn();
      }, true)

    if (RESISTANCE_UPDATE_OPT & 2)
      new MutationObserver(() => {
        resitanceUpdateFn();
      }).observe(document, {
        subtree: true, childList: true, attributes: true
      });
    resitanceUpdateFn();
  }


  function dr(s) {
    // reserved for future use
    return s;
    // return window.deWeakJS ? window.deWeakJS(s) : s;
  }

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  const getProto = (element) => {
    if (element) {
      const cnt = insp(element);
      return cnt.constructor.prototype || null;
    }
    return null;
  }

  const assertor = (f) => f() || console.assert(false, f + "");

  const fnIntegrity = (f, d) => {


    if (!f || typeof f !== 'function') {
      console.warn('f is not a function', f);
      return;
    }
    // return; // M44
    let p = `${f}`, s = 0, j = -1, w = 0;
    // return; // M44
    for (let i = 0, l = p.length; i < l; i++) {
      const t = p[i];
      if (((t >= 'a' && t <= 'z') || (t >= 'A' && t <= 'Z'))) {
        if (j < i - 1) w++;
        j = i;
      } else {
        s++;
      }
    }
    // if(p.length > 44 && p.length < 50){

    //   (window.skam|| (window.skam=[])).push(p);
    //   return false;
    // }

    //     if(p.length >  405 && p.length < 415 ){ //350 450


    //  //  [353, 411, 411, 411]

    //       // if(p.length >= 350 && p.length<=450){

    //       //   (window.skam|| (window.skam=[])).push(p.length);
    //       // }
    //       (window.skam|| (window.skam=[])).push(p);
    //       return false;
    //     }

    // if(p.length < 50) return true; else return false;
    // return; // M44
    let itz = `${f.length}.${s}.${w}`;
    if (!d) {
      return itz;
    } else if (itz !== d) {
      console.warn('fnIntegrity=false', itz);
      return false;
    } else {
      return true;
    }
  }


  const px2cm = (px) => px * window.devicePixelRatio * 0.026458333;
  const px2mm = (px) => px * window.devicePixelRatio * 0.26458333;


  ; (ENABLE_FLAGS_MAINTAIN_STABLE_LIST || ENABLE_FLAGS_REUSE_COMPONENTS || DISABLE_FLAGS_SHADYDOM_FREE) && (() => {

    const _config_ = () => {
      try {
        return ytcfg.data_;
      } catch (e) { }
      return null;
    };

    const flagsFn = (EXPERIMENT_FLAGS) => {

      // console.log(700)

      if (!EXPERIMENT_FLAGS) return;

      if (ENABLE_FLAGS_MAINTAIN_STABLE_LIST) {
        if (USE_MAINTAIN_STABLE_LIST_ONLY_WHEN_KS_FLAG_IS_SET ? EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list === true : true) {
          // EXPERIMENT_FLAGS.kevlar_tuner_should_test_maintain_stable_list = true; // timestamp toggle issue
          EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list = true;
          // console.log(701)
        }
      }

      if (ENABLE_FLAGS_REUSE_COMPONENTS) {
        EXPERIMENT_FLAGS.kevlar_tuner_should_test_reuse_components = true;
        EXPERIMENT_FLAGS.kevlar_tuner_should_reuse_components = true;
        // console.log(702);
      }

      if (DISABLE_FLAGS_SHADYDOM_FREE) {
        EXPERIMENT_FLAGS.enable_shadydom_free_scoped_node_methods = false;
        EXPERIMENT_FLAGS.enable_shadydom_free_scoped_query_methods = false;
        EXPERIMENT_FLAGS.enable_shadydom_free_scoped_readonly_properties_batch_one = false;
        EXPERIMENT_FLAGS.enable_shadydom_free_parent_node = false;
        EXPERIMENT_FLAGS.enable_shadydom_free_children = false;
        EXPERIMENT_FLAGS.enable_shadydom_free_last_child = false;
      }

      //   EXPERIMENT_FLAGS.enable_button_behavior_reuse = false;

    };

    const uf = (config_) => {
      config_ = config_ || _config_();
      if (config_) {
        const { EXPERIMENT_FLAGS, EXPERIMENTS_FORCED_FLAGS } = config_;
        if (EXPERIMENT_FLAGS) {
          flagsFn(EXPERIMENT_FLAGS);
          if (EXPERIMENTS_FORCED_FLAGS) flagsFn(EXPERIMENTS_FORCED_FLAGS);
        }
      }
    }

    window._ytConfigHacks.add((config_) => {
      uf(config_);
    });

    uf();

  })();

  if (DISABLE_Translation_By_Google) {

    let mo = new MutationObserver(() => {

      if (!mo) return;
      let h = document.head;
      if (!h) return;
      mo.disconnect();
      mo.takeRecords();
      mo = null;

      let meta = document.createElement('meta');
      meta.setAttribute('name', 'google');
      meta.setAttribute('content', 'notranslate');
      h.appendChild(meta);


    });
    mo.observe(document, { subtree: true, childList: true });
  }


  console.assert(MAX_ITEMS_FOR_TOTAL_DISPLAY > 0 && MAX_ITEMS_FOR_FULL_FLUSH > 0 && MAX_ITEMS_FOR_TOTAL_DISPLAY > MAX_ITEMS_FOR_FULL_FLUSH)

  const isContainSupport = CSS.supports('contain', 'layout paint style');
  if (!isContainSupport) {
    console.warn("Your browser does not support css property 'contain'.\nPlease upgrade to the latest version.".trim());
  }

  const isOverflowAnchorSupport = CSS.supports('overflow-anchor', 'auto');
  if (!isOverflowAnchorSupport) {
    console.warn("Your browser does not support css property 'overflow-anchor'.\nPlease upgrade to the latest version.".trim());
  }

  const ENABLE_OVERFLOW_ANCHOR = ENABLE_OVERFLOW_ANCHOR_PREFERRED && isOverflowAnchorSupport && ENABLE_NO_SMOOTH_TRANSFORM;

  let hasTimerModified = null;
  const DO_CHECK_TICKER_BACKGROUND_OVERRIDED = !!ATTEMPT_ANIMATED_TICKER_BACKGROUND || ENABLE_RAF_HACK_TICKERS;

  const fxOperator = (proto, propertyName) => {
    let propertyDescriptorGetter = null;
    try {
      propertyDescriptorGetter = Object.getOwnPropertyDescriptor(proto, propertyName).get;
    } catch (e) { }
    return typeof propertyDescriptorGetter === 'function' ? (e) => {
      try {

        return propertyDescriptorGetter.call(dr(e));
      } catch (e) { }
      return e[propertyName];
    } : (e) => e[propertyName];
  };

  const nodeParent = fxOperator(Node.prototype, 'parentNode');
  // const nFirstElem = fxOperator(HTMLElement.prototype, 'firstElementChild');
  const nPrevElem = fxOperator(HTMLElement.prototype, 'previousElementSibling');
  const nNextElem = fxOperator(HTMLElement.prototype, 'nextElementSibling');
  const nLastElem = fxOperator(HTMLElement.prototype, 'lastElementChild');

  const groupCollapsed = (text1, text2) => {

    console.groupCollapsed(`%c${text1}%c${text2}`,
      "background-color: #010502; color: #6acafe; font-weight: 700; padding: 2px;",
      "background-color: #010502; color: #6ad9fe; font-weight: 300; padding: 2px;"
    );
  }

  // const microNow = () => performance.now() + (performance.timeOrigin || performance.timing.navigationStart);


  const EVENT_KEY_ON_REGISTRY_READY = "ytI-ce-registry-created";
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

  const promiseForCustomYtElementsReady = new Promise(onRegistryReady);

  const renderReadyPn = typeof ResizeObserver !== 'undefined' ? (sizingTarget) => {

    return new Promise(resolve => {

      let ro = new ResizeObserver(entries => {
        if (entries && entries.length >= 1) {
          resolve();
          ro.disconnect();
          ro = null;
        }
      });
      ro.observe(sizingTarget);



    });

  } : (sizingTarget) => {


    return new Promise(resolve => {

      let io = new IntersectionObserver(entries => {
        if (entries && entries.length >= 1) {
          resolve();
          io.disconnect();
          io = null;
        }
      });
      io.observe(sizingTarget);



    });

  };

  /* globals WeakRef:false */

  /** @type {(o: Object | null) => WeakRef | null} */
  const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null);

  /** @type {(wr: Object | null) => Object | null} */
  const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

  const getLCRDummy = () => {
    // direct createElement or createComponent_ will make the emoji rendering crashed. reason TBC

    return Promise.all([customElements.whenDefined('yt-live-chat-app'), customElements.whenDefined('yt-live-chat-renderer')]).then(async () => {

      const tag = "yt-live-chat-renderer"
      let dummy = document.querySelector(tag);
      if (!dummy) {

        let mo = null;

        const ytLiveChatApp = document.querySelector('yt-live-chat-app') || document.createElement('yt-live-chat-app');

        const lcaProto = getProto(ytLiveChatApp);

        dummy = await new Promise(resolve => {

          if (typeof lcaProto.createComponent_ === 'function' && !lcaProto.createComponent99_) {

            lcaProto.createComponent99_ = lcaProto.createComponent_;
            lcaProto.createComponent98_ = function (a, b, c) {
              // (3) ['yt-live-chat-renderer', {…}, true]
              const r = this.createComponent99_.apply(this, arguments);
              if (a === 'yt-live-chat-renderer') {
                resolve(r);
              }
              return r;
            };
            lcaProto.createComponent_ = lcaProto.createComponent98_;

          } else {

            mo = new MutationObserver(() => {
              const t = document.querySelector(tag);
              if (t) {
                resolve(t);
              }
            });
            mo.observe(document, { subtree: true, childList: true })
          }

        });

        if (mo) {
          mo.disconnect();
          mo.takeRecords();
          mo = null;
        }

        if (lcaProto.createComponent99_ && lcaProto.createComponent_ && lcaProto.createComponent98_ === lcaProto.createComponent_) {
          lcaProto.createComponent_ = lcaProto.createComponent99_;
          lcaProto.createComponent99_ = null;
          lcaProto.createComponent98_ = null;
        }

      }
      return dummy;

    });
  }

  const { addCssManaged } = (() => {

    const addFontPreRendering = () => {

      groupCollapsed("YouTube Super Fast Chat", " | Fonts Pre-Rendering");

      let efsContainer = document.createElement('elzm-fonts');
      efsContainer.id = 'elzm-fonts-yk75g'

      const arr = [];
      let p = document.createElement('elzm-font');
      arr.push(p);

      if (ENABLE_FONT_PRE_RENDERING & 1) {
        for (const size of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {

          p = document.createElement('elzm-font');
          p.style.fontWeight = size;
          arr.push(p);
        }
      }

      if (ENABLE_FONT_PRE_RENDERING & 2) {
        for (const size of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {

          p = document.createElement('elzm-font');
          p.style.fontFamily = 'Roboto';
          p.style.fontWeight = size;
          arr.push(p);
        }
      }

      if (ENABLE_FONT_PRE_RENDERING & 4) {
        for (const size of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {

          p = document.createElement('elzm-font');
          p.style.fontFamily = '"YouTube Noto",Roboto,Arial,Helvetica,sans-serif';
          p.style.fontWeight = size;
          arr.push(p);
        }
      }


      if (ENABLE_FONT_PRE_RENDERING & 8) {
        for (const size of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {

          p = document.createElement('elzm-font');
          p.style.fontFamily = '"Noto",Roboto,Arial,Helvetica,sans-serif';
          p.style.fontWeight = size;
          arr.push(p);
        }
      }


      if (ENABLE_FONT_PRE_RENDERING & 16) {
        for (const size of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {

          p = document.createElement('elzm-font');
          p.style.fontFamily = 'sans-serif';
          p.style.fontWeight = size;
          arr.push(p);
        }
      }

      console.log('number of elzm-font elements', arr.length);

      HTMLElement.prototype.append.apply(efsContainer, arr);

      (document.body || document.documentElement).appendChild(efsContainer);


      console.log('elzm-font elements have been added to the page for rendering.');

      console.groupEnd();

    }

    let isCssAdded = false;

    function addCssElement() {
      let s = document.createElement('style');
      s.id = 'ewRvC';
      return s;
    }

    const addCssManaged = () => {
      if (!isCssAdded && document.documentElement && document.head) {
        isCssAdded = true;
        document.head.appendChild(dr(addCssElement())).textContent = addCss();
        if (ENABLE_FONT_PRE_RENDERING) {
          Promise.resolve().then(addFontPreRendering)
        }
      }
    }

    return { addCssManaged };
  })();


  const { setupStyle } = (() => {

    const sp7 = Symbol();

    const proxyHelperFn = (dummy) => ({

      get(target, prop) {
        return (prop in dummy) ? dummy[prop] : prop === sp7 ? target : target[prop];
      },
      set(target, prop, value) {
        if (!(prop in dummy)) {
          target[prop] = value;
        }
        return true;
      },
      has(target, prop) {
        return (prop in target);
      },
      deleteProperty(target, prop) {
        return true;
      },
      ownKeys(target) {
        return Object.keys(target);
      },
      defineProperty(target, key, descriptor) {
        return Object.defineProperty(target, key, descriptor);
      },
      getOwnPropertyDescriptor(target, key) {
        return Object.getOwnPropertyDescriptor(target, key);
      },

    });

    const setupStyle = (m1, m2) => {
      if (!ENABLE_NO_SMOOTH_TRANSFORM) return;

      const dummy1v = {
        transform: '',
        height: '',
        minHeight: '',
        paddingBottom: '',
        paddingTop: ''
      };

      const dummyStyleFn = (k) => (function () { const style = this[sp7]; return style[k](...arguments); });
      for (const k of ['toString', 'getPropertyPriority', 'getPropertyValue', 'item', 'removeProperty', 'setProperty']) {
        dummy1v[k] = dummyStyleFn(k);
      }

      const dummy1p = proxyHelperFn(dummy1v);
      const sp1v = new Proxy(m1.style, dummy1p);
      const sp2v = new Proxy(m2.style, dummy1p);
      Object.defineProperty(m1, 'style', { get() { return sp1v }, set() { }, enumerable: true, configurable: true });
      Object.defineProperty(m2, 'style', { get() { return sp2v }, set() { }, enumerable: true, configurable: true });
      m1.removeAttribute("style");
      m2.removeAttribute("style");

    }

    return { setupStyle };

  })();



  function setThumbnails(config) {

    const { baseObject, thumbnails, flag0, imageLinks } = config;

    if (flag0 || (ENABLE_PRELOAD_THUMBNAIL && imageLinks)) {


      if (thumbnails && thumbnails.length > 0) {
        if (flag0 > 0 && thumbnails.length > 1) {
          let pSize = 0;
          let newThumbnails = [];
          for (const thumbnail of thumbnails) {
            if (!thumbnail || !thumbnail.url) continue;
            const squarePhoto = thumbnail.width === thumbnail.height && typeof thumbnail.width === 'number';
            const condSize = pSize <= 0 || (flag0 === 1 ? pSize > thumbnail.width : pSize < thumbnail.width);
            const leastSizeFulfilled = squarePhoto ? thumbnail.width >= LEAST_IMAGE_SIZE : true;
            if ((!squarePhoto || condSize) && leastSizeFulfilled) {
              newThumbnails.push(thumbnail);
              if (imageLinks) imageLinks.add(thumbnail.url);
            }
            if (squarePhoto && condSize && leastSizeFulfilled) {
              pSize = thumbnail.width;
            }
          }
          if (thumbnails.length !== newThumbnails.length && thumbnails === baseObject.thumbnails && newThumbnails.length > 0) {
            baseObject.thumbnails = newThumbnails;
          } else {
            newThumbnails.length = 0;
          }
          newThumbnails = null;
        } else {
          for (const thumbnail of thumbnails) {
            if (thumbnail && thumbnail.url) {
              if (imageLinks) imageLinks.add(thumbnail.url);
            }
          }
        }
      }

    }
  }

  function fixLiveChatItem(item, imageLinks) {
    const liveChatTextMessageRenderer = (item || 0).liveChatTextMessageRenderer || 0;
    if (liveChatTextMessageRenderer) {
      const messageRuns = (liveChatTextMessageRenderer.message || 0).runs || 0;
      if (messageRuns && messageRuns.length > 0) {
        for (const run of messageRuns) {
          const emojiImage = (((run || 0).emoji || 0).image || 0);
          setThumbnails({
            baseObject: emojiImage,
            thumbnails: emojiImage.thumbnails,
            flag0: EMOJI_IMAGE_SINGLE_THUMBNAIL,
            imageLinks
          });
        }
      }
      const authorPhoto = liveChatTextMessageRenderer.authorPhoto || 0;
      setThumbnails({
        baseObject: authorPhoto,
        thumbnails: authorPhoto.thumbnails,
        flag0: AUTHOR_PHOTO_SINGLE_THUMBNAIL,
        imageLinks
      });
    }
  }



  let kptPF = null;
  const emojiPrefetched = new LimitedSizeSet(PREFETCH_LIMITED_SIZE_EMOJI);
  const authorPhotoPrefetched = new LimitedSizeSet(PREFETCH_LIMITED_SIZE_AUTHOR_PHOTO);

  function linker(link, rel, href, _as) {
    return new Promise(resolve => {
      if (!link) link = document.createElement('link');
      link.rel = rel;
      if (_as) link.setAttribute('as', _as);
      link.onload = function () {
        resolve({
          link: this,
          success: true
        })
        this.remove();
      };
      link.onerror = function () {
        resolve({
          link: this,
          success: false
        });
        this.remove();
      };
      link.href = href;
      document.head.appendChild(link);
      link = null;
    });
  }



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
        const blobURL = typeof webkitCancelAnimationFrame === 'function' && typeof kagi === 'undefined' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null; // avoid Brave Crash
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
            e = n;
            n = win = removeIframeFn = 0;
            setTimeout ? setTimeout(() => e.remove(), 200) : e.remove();
          }
          if (!setTimeout || document.readyState !== 'loading') {
            removeIframeOnDocumentReady();
          } else {
            win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
          }
        }
      }
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      try {
        const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, getComputedStyle } = fc;
        const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, getComputedStyle };
        for (let k in res) res[k] = res[k].bind(win); // necessary
        if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);

        /** @type {HTMLElement} */
        const HTMLElementProto = fc.HTMLElement.prototype;
        /** @type {EventTarget} */
        const EventTargetProto = fc.EventTarget.prototype;
        // jsonParseFix = {
        //   _JSON: fc.JSON, _parse: fc.JSON.parse
        // }
        return {
          ...res,
          animate: HTMLElementProto.animate,
          addEventListener: EventTargetProto.addEventListener,
          removeEventListener: EventTargetProto.removeEventListener
        };
      } catch (e) {
        if (removeIframeFn) removeIframeFn();
        return null;
      }
    } catch (e) {
      console.warn(e);
      return null;
    }
  };


  let xoIcjPr = null;
  window.addEventListener('message', (evt) => {
    if ((evt || 0).data === 'xoIcj' && xoIcjPr !== null) xoIcjPr.resolve();
  });
  const timelineResolve = async () => {
    if (xoIcjPr !== null) {
      await xoIcjPr.then();
      return;
    }
    xoIcjPr = new PromiseExternal();
    window.postMessage('xoIcj');
    await xoIcjPr.then();
    xoIcjPr = null;
  }

  cleanContext(win).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, animate, getComputedStyle, addEventListener, removeEventListener } = __CONTEXT__;

    const wmComputedStyle = new WeakMap();
    const getComputedStyleCached = (elem) => {
      let cs = wmComputedStyle.get(elem);
      if (!cs) {
        cs = getComputedStyle(elem);
        wmComputedStyle.set(elem, cs);
      }
      return cs;
    }


    const isGPUAccelerationAvailable = (() => {
      // https://gist.github.com/cvan/042b2448fcecefafbb6a91469484cdf8
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })();

    const foregroundPromiseFn_noGPU = (() => {

      if (isGPUAccelerationAvailable) return null;

      const pd = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
      if (!pd || typeof pd.get !== 'function') return null;
      const pdGet = pd.get;

      let pr = null;

      let hState = pdGet.call(document) === 'hidden';
      // let cid = 0;
      pureAddEventListener.call(document, 'visibilitychange', (evt) => {
        const newHState = pdGet.call(document) === 'hidden';
        if (hState !== newHState) {
          // if (cid > 0) cid = clearInterval(cid);
          hState = newHState;
          if (!hState && pr) pr = pr.resolve();
        }
      });

      // cid = setInterval(() => {
      //   const newHState = document.visibilityState === 'hidden';
      //   if (hState !== newHState) {
      //     hState = newHState;
      //     if (!hState && pr) pr = pr.resolve();
      //   }
      // }, 100);


      return (() => {
        if (pr) return pr;
        const w = ((!hState && setTimeout(() => {
          if (!hState && pr === w) pr = pr.resolve();
        })), (pr = new PromiseExternal()));
        return w;
      });

    })();

    // window.foregroundPromiseFn_noGPU = foregroundPromiseFn_noGPU;

    let rafPromise = null;
    const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
      requestAnimationFrame(hRes => {
        rafPromise = null;
        resolve(hRes);
      });
    }));
    const foregroundPromiseFn = foregroundPromiseFn_noGPU || getRafPromise;

    const iAFP = foregroundPromiseFn_noGPU ? foregroundPromiseFn_noGPU : typeof IntersectionObserver === 'undefined' ? getRafPromise : (() => {

      const ioWM = new WeakMap();
      const ek = Symbol();
      /** @type {IntersectionObserverCallback} */
      const ioCb = (entries, observer) => {
        /** @type {PromiseExternal} */
        const pr = observer[ek];
        const resolve = pr.resolve;
        let target;
        if (resolve && (target = ((entries ? entries[0] : 0) || 0).target) instanceof Element) {
          pr.resolve = null;
          observer.unobserve(target);
          resolve();
        }
      };
      /**
       *
       * @param {Element} elm
       * @returns {Promise<void>}
       */
      const iAFP = (elm) => {
        let io = ioWM.get(elm);
        if (!io) {
          io = new IntersectionObserver(ioCb);
          ioWM.set(elm, io); // strong reference
        }
        let pr = io[ek];
        if (!pr) {
          pr = io[ek] = new PromiseExternal();
          io.observe(elm);
        }
        return pr;
      }

      return iAFP;

    })();

    let playerState = null;
    let _playerState = null;
    let lastPlayerProgress = null;
    let relayCount = 0;
    let playerEventsByIframeRelay = false;
    let isPlayProgressTriggered = false;
    let waitForInitialDataCompletion = 0;



    let aeConstructor = null;

    // << __openedChanged82 >>
    let currentMenuPivotWR = null;

    // << if DO_PARTICIPANT_LIST_HACKS >>
    const beforeParticipantsMap = new WeakMap();
    // << end >>



    // << if onRegistryReadyForDOMOperations >>

    let dt0 = Date.now() - 2000;
    const dateNow = () => Date.now() - dt0;
    // let lastScroll = 0;
    // let lastLShow = 0;
    let lastWheel = 0;
    let lastMouseDown = 0;
    let lastMouseUp = 0;
    let currentMouseDown = false;
    let lastTouchDown = 0;
    let lastTouchUp = 0;
    let currentTouchDown = false;
    let lastUserInteraction = 0;

    let scrollChatFn = null;

    let skipDontRender = true; // true first; false by flushActiveItems_
    let allowDontRender = null;

    // ---- #items mutation ----
    let sk35zResolveFn = null;
    let firstList = true;

    // << end >>

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
        this.keepRAF = false;
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
        if (this.rid === 0) this.rid = requestAnimationFrame(this.bCallback);
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
            if (this.funcs.size === 0 && !this.keepRAF) {
              cancelAnimationFrame(this.rid);
              this.rid = 0;
            }
          }
        }
      }
    }

    function basePrefetching() {

      new Promise(resolve => {

        if (document.readyState !== 'loading') {
          resolve();
        } else {
          win.addEventListener("DOMContentLoaded", resolve, false);
        }

      }).then(() => {
        const hostL1 = [
          'https://www.youtube.com', 'https://googlevideo.com',
          'https://googleapis.com', 'https://accounts.youtube.com',
          'https://www.gstatic.com', 'https://ggpht.com',
          'https://yt3.ggpht.com', 'https://yt4.ggpht.com'
        ];

        const hostL2 = [
          'https://youtube.com',
          'https://fonts.googleapis.com', 'https://fonts.gstatic.com'
        ];

        let link = null;

        function kn() {

          link = document.createElement('link');
          if (link.relList && link.relList.supports) {
            kptPF = (link.relList.supports('dns-prefetch') ? 1 : 0) + (link.relList.supports('preconnect') ? 2 : 0) + (link.relList.supports('prefetch') ? 4 : 0) + (link.relList.supports('subresource') ? 8 : 0) + (link.relList.supports('preload') ? 16 : 0)
          } else {
            kptPF = 0;
          }

          groupCollapsed("YouTube Super Fast Chat", " | PREFETCH SUPPORTS");
          if (ENABLE_BASE_PREFETCHING) console.log('dns-prefetch', (kptPF & 1) ? 'OK' : 'NG');
          if (ENABLE_BASE_PREFETCHING) console.log('preconnect', (kptPF & 2) ? 'OK' : 'NG');
          if (ENABLE_PRELOAD_THUMBNAIL) console.log('prefetch', (kptPF & 4) ? 'OK' : 'NG');
          // console.log('subresource', (kptPF & 8) ? 'OK' : 'NG');
          if (ENABLE_PRELOAD_THUMBNAIL) console.log('preload', (kptPF & 16) ? 'OK' : 'NG');
          console.groupEnd();

        }

        for (const h of hostL1) {

          if (kptPF === null) kn();
          if (ENABLE_BASE_PREFETCHING) {
            // if (kptPF & 1) {
            //   linker(link, 'dns-prefetch', h);
            //   link = null;
            // }
            if (kptPF & 2) {
              linker(link, 'preconnect', h);
              link = null;
            }
          }
        }

        for (const h of hostL2) {
          if (kptPF === null) kn();
          if (ENABLE_BASE_PREFETCHING) {
            if (kptPF & 1) {
              linker(link, 'dns-prefetch', h);
              link = null;
            }
          }
        }

      })


    }

    if (DO_LINK_PREFETCH) basePrefetching();

    const { notifyPath7081 } = (() => {
      // DO_PARTICIPANT_LIST_HACKS

      const mutexParticipants = new Mutex();

      let uvid = 0;
      let r95dm = 0;
      let c95dm = -1;

      const foundMap = (base, content) => {
        /*
          let lastSearch = 0;
          let founds = base.map(baseEntry => {
            let search = content.indexOf(baseEntry, lastSearch);
            if (search < 0) return false;
            lastSearch = search + 1;
            return true;
          });
          return founds;
        */
        const contentSet = new Set(content);
        return base.map(baseEntry => contentSet.has(baseEntry));

      }



      let participantsForSpliceWR = null;

      class IndexSpliceEntry {
        /**
         *
         * @param {number} _index
         * @param {number} _addedCount
         * @param {any[]} _removed
         */
        constructor(_index, _addedCount, _removed) {
          this.index = _index;
          this.addedCount = _addedCount;
          this.removed = _removed;
        }
        get __proxy312__() {
          return 1
        }
        get type() {
          return 'splice'
        }
        get object() {
          return kRef(participantsForSpliceWR); // avoid memory leakage
        }
      }

      const spliceIndicesFunc = (beforeParticipants, participants, idsBefore, idsAfter) => {

        let foundsForAfter = foundMap(idsAfter, idsBefore);
        let foundsForBefore = foundMap(idsBefore, idsAfter);

        const nAfter = foundsForAfter.length;
        const nBefore = foundsForBefore.length;

        const indexSplices = [];
        const contentUpdates = [];
        participantsForSpliceWR = null;
        for (let i = 0, j = 0; i < nBefore || j < nAfter;) {
          if (beforeParticipants[i] === participants[j]) {
            i++; j++;
          } else if (idsBefore[i] === idsAfter[j]) {
            // content changed
            contentUpdates.push({ indexI: i, indexJ: j })
            i++; j++;
          } else {
            let addedCount = 0;
            for (let q = j; q < nAfter; q++) {
              if (foundsForAfter[q] === false) addedCount++;
              else break;
            }
            let removedCount = 0;
            for (let q = i; q < nBefore; q++) {
              if (foundsForBefore[q] === false) removedCount++;
              else break;
            }
            if (!addedCount && !removedCount) {
              throw 'ERROR(0xFF32): spliceIndicesFunc';
            }
            const entry = new IndexSpliceEntry(
              j,
              addedCount,
              removedCount >= 1 ? beforeParticipants.slice(i, i + removedCount) : []
            );
            indexSplices.push(entry);
            i += removedCount;
            j += addedCount;
          }
        }
        foundsForBefore = null;
        foundsForAfter = null;
        idsBefore = null;
        idsAfter = null;
        beforeParticipants = null;
        participantsForSpliceWR = indexSplices.length > 0 ? mWeakRef(participants) : null;
        participants = null;
        return { indexSplices, contentUpdates };

      }

      /*

      customElements.get("yt-live-chat-participant-renderer").prototype.notifyPath=function(){  console.log(123);  console.log(new Error().stack)}

      VM63631:1 Error
      at customElements.get.notifyPath (<anonymous>:1:122)
      at e.forwardRendererStamperChanges_ (live_chat_polymer.js:4453:35)
      at e.rendererStamperApplyChangeRecord_ (live_chat_polymer.js:4451:12)
      at e.rendererStamperObserver_ (live_chat_polymer.js:4448:149)
      at Object.pu [as fn] (live_chat_polymer.js:1692:118)
      at ju (live_chat_polymer.js:1674:217)
      at a._propertiesChanged (live_chat_polymer.js:1726:122)
      at b._flushProperties (live_chat_polymer.js:1597:200)
      at a._invalidateProperties (live_chat_polymer.js:1718:69)
      at a.notifyPath (live_chat_polymer.js:1741:182)

      */

      function convertToIds(participants) {
        return participants.map(participant => {
          if (!participant || typeof participant !== 'object') {
            console.warn('Error(0xFA41): convertToIds', participant);
            return participant; // just in case
          }
          let keys = Object.keys(participant);
          // liveChatTextMessageRenderer
          // liveChatParticipantRenderer - livestream channel owner [no authorExternalChannelId]
          // liveChatPaidMessageRenderer
          /*

            'yt-live-chat-participant-renderer' utilizes the following:
            authorName.simpleText: string
            authorPhoto.thumbnails: Object{url:string, width:int, height:int} []
            authorBadges[].liveChatAuthorBadgeRenderer.icon.iconType: string
            authorBadges[].liveChatAuthorBadgeRenderer.tooltip: string
            authorBadges[].liveChatAuthorBadgeRenderer.accessibility.accessibilityData: Object{label:string}

          */
          if (keys.length !== 1) {
            console.warn('Error(0xFA42): convertToIds', participant);
            return participant; // just in case
          }
          let key = keys[0];
          let renderer = (participant[key] || 0);
          let authorName = (renderer.authorName || 0);
          let text = `${authorName.simpleText || authorName.text}`
          let res = participant; // fallback if it is not a vaild entry
          if (typeof text !== 'string') {
            console.warn('Error(0xFA53): convertToIds', participant);
          } else {
            text = `${renderer.authorExternalChannelId || 'null'}|${text || ''}`;
            if (text.length > 1) res = text;
          }
          return res;
          // return renderer?`${renderer.id}|${renderer.authorExternalChannelId}`: '';
          // note: renderer.id will be changed if the user typed something to trigger the update of the participants' record.
        });
      }

      const checkChangeToParticipantRendererContent = CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT ? (p1, p2) => {
        // just update when content is changed.
        if (p1.authorName !== p2.authorName) return true;
        if (p1.authorPhoto !== p2.authorPhoto) return true;
        if (p1.authorBadges !== p2.authorBadges) return true;
        return false;
      } : (p1, p2) => {
        // keep integrity all the time.
        return p1 !== p2; // always true
      }

      function notifyPath7081(path) { // cnt "yt-live-chat-participant-list-renderer"

        if (PARTICIPANT_UPDATE_ONLY_ONLY_IF_MODIFICATION_DETECTED) {
          if (path !== "participantsManager.participants") {
            return this.__notifyPath5036__.apply(this, arguments);
          }
          if (c95dm === r95dm) return;
        } else {
          const stack = new Error().stack;
          if (path !== "participantsManager.participants" || stack.indexOf('.onParticipantsChanged') < 0) {
            return this.__notifyPath5036__.apply(this, arguments);
          }
        }

        if (uvid > 1e8) uvid = uvid % 100;
        let tid = ++uvid;


        // const cnt = this; // "yt-live-chat-participant-list-renderer"

        const wNode = mWeakRef(this);

        mutexParticipants.lockWith(lockResolve => {

          const cnt = kRef(wNode);

          const participants00 = (((cnt || 0).participantsManager || 0).participants || 0);

          if (tid !== uvid || !cnt || typeof (participants00 || 0).splice !== 'function') {
            lockResolve();
            return;
          }

          let doUpdate = false;

          if (PARTICIPANT_UPDATE_ONLY_ONLY_IF_MODIFICATION_DETECTED) {

            if (!participants00.r94dm) {
              participants00.r94dm = 1;
              if (++r95dm > 1e9) r95dm = 9;
              participants00.push = function () {
                if (++r95dm > 1e9) r95dm = 9;
                return Array.prototype.push.apply(this, arguments);
              }
              participants00.pop = function () {
                if (++r95dm > 1e9) r95dm = 9;
                return Array.prototype.pop.apply(this, arguments);
              }
              participants00.shift = function () {
                if (++r95dm > 1e9) r95dm = 9;
                return Array.prototype.shift.apply(this, arguments);
              }
              participants00.unshift = function () {
                if (++r95dm > 1e9) r95dm = 9;
                return Array.prototype.unshift.apply(this, arguments);
              }
              participants00.splice = function () {
                if (++r95dm > 1e9) r95dm = 9;
                return Array.prototype.splice.apply(this, arguments);
              }
              participants00.sort = function () {
                if (++r95dm > 1e9) r95dm = 9;
                return Array.prototype.sort.apply(this, arguments);
              }
              participants00.reverse = function () {
                if (++r95dm > 1e9) r95dm = 9;
                return Array.prototype.reverse.apply(this, arguments);
              }
            }

            if (c95dm !== r95dm) {
              c95dm = r95dm;
              doUpdate = true;
            }

          } else {
            doUpdate = true;
          }

          if (!doUpdate) {
            lockResolve();
            return;
          }

          const participants = participants00.slice(0);
          const beforeParticipants = beforeParticipantsMap.get(cnt) || [];
          beforeParticipantsMap.set(cnt, participants);

          const resPromise = (async () => {

            if (beforeParticipants.length === 0) {
              // not error
              return 0;
            }

            let countOfElements = cnt.__getAllParticipantsDOMRenderedLength__()

            // console.log(participants.length, doms.length) // different if no requestAnimationFrame
            if (beforeParticipants.length !== countOfElements) {
              // there is somewrong for the cache. - sometimes happen
              return 0;
            }

            const idsBefore = convertToIds(beforeParticipants);
            const idsAfter = convertToIds(participants);

            let { indexSplices, contentUpdates } = spliceIndicesFunc(beforeParticipants, participants, idsBefore, idsAfter);

            let res = 1; // default 1 for no update

            if (indexSplices.length >= 1) {


              // let p2 =  participants.slice(indexSplices[0].index, indexSplices[0].index+indexSplices[0].addedCount);
              // let p1 = indexSplices[0].removed;
              // console.log(indexSplices.length, indexSplices ,p1,p2,  convertToIds(p1),convertToIds(p2))

              /* folllow
                  a.notifyPath(c + ".splices", d);
                  a.notifyPath(c + ".length", b.length);
              */
              // stampDomArraySplices_


              await new Promise(resolve => {
                cnt.resolveForDOMRendering781 = resolve;

                cnt.__notifyPath5036__("participantsManager.participants.splices", {
                  indexSplices
                });
                indexSplices = null;
                participantsForSpliceWR = null;
                cnt.__notifyPath5036__("participantsManager.participants.length",
                  participants.length
                );

              });

              // play safe for the change of 'length'
              if (typeof nextBrowserTick !== 'function') {
                await Promise.resolve(0);
              } else {
                await new Promise(resolve => nextBrowserTick(resolve)).then();
              }

              countOfElements = cnt.__getAllParticipantsDOMRenderedLength__();

              const wrongSize = participants.length !== countOfElements
              if (wrongSize) {
                console.warn("ERROR(0xE2C3): notifyPath7081", beforeParticipants.length, participants.length, doms.length)
                return 0;
              }

              res = 2 | 4;

            } else {

              indexSplices = null;
              participantsForSpliceWR = null;

              if (participants.length !== countOfElements) {
                // other unhandled cases
                return 0;
              }

            }

            // participants.length === countOfElements before contentUpdates
            if (contentUpdates.length >= 1) {
              for (const contentUpdate of contentUpdates) {
                let isChanged = checkChangeToParticipantRendererContent(beforeParticipants[contentUpdate.indexI], participants[contentUpdate.indexJ]);
                if (isChanged) {
                  cnt.__notifyPath5036__(`participantsManager.participants[${contentUpdate.indexJ}]`);
                  res |= 4 | 8;
                }
              }
            }
            contentUpdates = null;

            return res;


          })();


          resPromise.then(resValue => {

            const isLogRequired = SHOW_PARTICIPANT_CHANGES_IN_CONSOLE && ((resValue === 0) || ((resValue & 4) === 4));
            isLogRequired && groupCollapsed("Participant List Change", `tid = ${tid}; res = ${resValue}`);
            if (resValue === 0) {
              new Promise(resolve => {
                cnt.resolveForDOMRendering781 = resolve;
                isLogRequired && console.log("Full Refresh begins");
                cnt.__notifyPath5036__("participantsManager.participants"); // full refresh
              }).then(() => {
                isLogRequired && console.log("Full Refresh ends");
                console.groupEnd();
              }).then(lockResolve);
              return;
            }

            const delayLockResolve = (resValue & 4) === 4;

            if (delayLockResolve) {
              isLogRequired && console.log(`Number of participants (before): ${beforeParticipants.length}`);
              isLogRequired && console.log(`Number of participants (after): ${participants.length}`);
              isLogRequired && console.log(`Total number of rendered participants: ${cnt.__getAllParticipantsDOMRenderedLength__()}`);
              isLogRequired && console.log(`Participant Renderer Content Updated: ${(resValue & 8) === 8}`);
              isLogRequired && console.groupEnd();
              // requestAnimationFrame is required to avoid particiant update during DOM changing (stampDomArraySplices_)
              // mutex lock with requestAnimationFrame can also disable participants update in background
              requestAnimationFrame(lockResolve);
            } else {
              lockResolve();
            }

          });

        });

      }

      return { notifyPath7081 };

    })();

    const whenDefinedMultiple = async (tags) => {

      const sTags = [...new Set(tags)];
      const len = sTags.length;

      const pTags = new Array(len);
      for (let i = 0; i < len; i++) {
        pTags[i] = customElements.whenDefined(sTags[i]);
      }

      await Promise.all(pTags);
      pTags.length = 0;

      return sTags;

    }

    const onRegistryReadyForDataManipulation = () => {

      function dummy5035(a, b, c) { }
      function dummy411(a, b, c) { }



      customElements.whenDefined("yt-live-chat-participant-list-renderer").then(() => {

        if (!DO_PARTICIPANT_LIST_HACKS) return;

        const tag = "yt-live-chat-participant-list-renderer";
        const cProto = getProto(document.createElement(tag));
        if (!cProto || typeof cProto.attached !== 'function') {
          // for _registered, proto.attached shall exist when the element is defined.
          // for controller extraction, attached shall exist when instance creates.
          console.warn(`proto.attached for ${tag} is unavailable.`);
          return;
        }


        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-participant-list-renderer hacks");

        const fgsArr = ['kevlar_tuner_should_test_maintain_stable_list', 'kevlar_should_maintain_stable_list', 'kevlar_tuner_should_test_reuse_components', 'kevlar_tuner_should_reuse_components'];
        const fgs = {};
        for (const key of fgsArr) fgs[key] = undefined;

        try {
          const EXPERIMENT_FLAGS = ytcfg.data_.EXPERIMENT_FLAGS;
          for (const key of fgsArr) fgs[key] = EXPERIMENT_FLAGS[key];
        } catch (e) { }
        console.log(`EXPERIMENT_FLAGS: ${JSON.stringify(fgs, null, 2)}`);

        const canDoReplacement = (() => {
          if (typeof cProto.__notifyPath5035__ === 'function' && cProto.__notifyPath5035__.name !== 'dummy5035') {
            console.warn('YouTube Live Chat Tamer is running.');
            return;
          }

          if (typeof cProto.__attached411__ === 'function' && cProto.__attached411__.name !== 'dummy411') {
            console.warn('YouTube Live Chat Tamer is running.');
            return;
          }

          cProto.__notifyPath5035__ = dummy5035 // just to against Live Chat Tamer
          cProto.__attached411__ = dummy411 // just to against Live Chat Tamer

          if (typeof cProto.flushRenderStamperComponentBindings_ !== 'function' || cProto.flushRenderStamperComponentBindings_.length !== 0) {
            console.warn("ERROR(0xE355): cProto.flushRenderStamperComponentBindings_ not found");
            return;
          }

          if (typeof cProto.flushRenderStamperComponentBindings66_ === 'function') {
            console.warn("ERROR(0xE356): cProto.flushRenderStamperComponentBindings66_");
            return;
          }

          if (typeof cProto.__getAllParticipantsDOMRenderedLength__ === 'function') {
            console.warn("ERROR(0xE357): cProto.__getAllParticipantsDOMRenderedLength__");
            return;
          }
          return true;
        })();

        console.log(`Data Manipulation Boost = ${canDoReplacement}`);

        assertor(() => fnIntegrity(cProto.attached, '0.32.22')) // just warning
        if (typeof cProto.flushRenderStamperComponentBindings_ === 'function') {
          const fiRSCB = fnIntegrity(cProto.flushRenderStamperComponentBindings_);
          // const s = fiRSCB.split('.');
          // Feb 2024: 0.403.247 => NG
          // if (s[0] === '0' && +s[1] > 381 && +s[1] < 391 && +s[2] > 228 && +s[2] < 238) {
          //   console.log(`flushRenderStamperComponentBindings_ ### ${fiRSCB} ### - OK`);
          // } else {
          //   console.log(`flushRenderStamperComponentBindings_ ### ${fiRSCB} ### - NG`);
          // }
          console.log(`flushRenderStamperComponentBindings_ ### ${fiRSCB} ###`);
        } else {
          console.log("flushRenderStamperComponentBindings_ - not found");
        }
        // assertor(() => fnIntegrity(cProto.flushRenderStamperComponentBindings_, '0.386.233')) // just warning

        if (typeof cProto.flushRenderStamperComponentBindings_ === 'function') {
          cProto.flushRenderStamperComponentBindings66_ = cProto.flushRenderStamperComponentBindings_;
          cProto.flushRenderStamperComponentBindings_ = function () {
            // console.log('flushRenderStamperComponentBindings_')
            this.flushRenderStamperComponentBindings66_();
            if (this.resolveForDOMRendering781) {
              this.resolveForDOMRendering781();
              this.resolveForDOMRendering781 = null;
            }
          };
        }

        cProto.__getAllParticipantsDOMRenderedLength__ = function () {
          const container = ((this || 0).$ || 0).participants;
          if (!container) return 0;
          return HTMLElement.prototype.querySelectorAll.call(container, 'yt-live-chat-participant-renderer').length;
        }

        const onPageElements = [...document.querySelectorAll('yt-live-chat-participant-list-renderer:not(.n9fJ3)')];

        cProto.__attached412__ = cProto.attached;
        const fpPList = function (hostElement) {
          const cnt = insp(hostElement);
          if (beforeParticipantsMap.has(cnt)) return;
          hostElement.classList.add('n9fJ3');

          assertor(() => (cnt.__dataEnabled === true && cnt.__dataReady === true));
          if (typeof cnt.notifyPath !== 'function' || typeof cnt.__notifyPath5036__ !== 'undefined') {
            console.warn("ERROR(0xE318): yt-live-chat-participant-list-renderer")
            return;
          }

          groupCollapsed("Participant List attached", "");
          // cnt.$.participants.appendChild = cnt.$.participants.__shady_native_appendChild =  function(){
          //   console.log(123, 'appendChild');
          //   return HTMLElement.prototype.appendChild.apply(this, arguments)
          // }

          // cnt.$.participants.insertBefore =cnt.$.participants.__shady_native_insertBefore =  function(){
          //   console.log(123, 'insertBefore');
          //   return HTMLElement.prototype.insertBefore.apply(this, arguments)
          // }

          cnt.__notifyPath5036__ = cnt.notifyPath
          const participants = ((cnt.participantsManager || 0).participants || 0);
          assertor(() => (participants.length > -1 && typeof participants.slice === 'function'));
          console.log(`initial number of participants: ${participants.length}`);
          const newParticipants = (participants.length >= 1 && typeof participants.slice === 'function') ? participants.slice(0) : [];
          beforeParticipantsMap.set(cnt, newParticipants);
          cnt.notifyPath = notifyPath7081;
          console.log(`CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT = ${CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT}`);
          console.groupEnd();
        }
        cProto.attached = function () {
          fpPList(this.hostElement || this);
          this.__attached412__.apply(this, arguments);
        };


        if (ENABLE_FLAGS_MAINTAIN_STABLE_LIST_FOR_PARTICIPANTS_LIST) {

          /** @type {boolean | (()=>boolean)} */
          let toUseMaintainStableList = USE_MAINTAIN_STABLE_LIST_ONLY_WHEN_KS_FLAG_IS_SET ? (() => ytcfg.data_.EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list === true) : true;
          if (typeof cProto.stampDomArray_ === 'function' && cProto.stampDomArray_.length === 6 && !cProto.stampDomArray_.nIegT && !cProto.stampDomArray66_) {

            let lastMessageDate = 0;
            cProto.stampDomArray66_ = cProto.stampDomArray_;

            cProto.stampDomArray_ = function (...args) {
              if (args[0] && args[0].length > 0 && args[1] === "participants" && args[2] && args[3] === true && !args[5]) {
                if (typeof toUseMaintainStableList === 'function') {
                  toUseMaintainStableList = toUseMaintainStableList();
                }
                args[5] = toUseMaintainStableList;
                let currentDate = Date.now();
                if (currentDate - lastMessageDate > 440) {
                  lastMessageDate = currentDate;
                  console.log('maintain_stable_list for participants list', toUseMaintainStableList);
                }
              }
              return this.stampDomArray66_.apply(this, args);
            }

            cProto.stampDomArray_.nIegT = 1;

          }
          console.log(`ENABLE_FLAGS_MAINTAIN_STABLE_LIST_FOR_PARTICIPANTS_LIST - YES`);
        } else {
          console.log(`ENABLE_FLAGS_MAINTAIN_STABLE_LIST_FOR_PARTICIPANTS_LIST - NO`);
        }

        console.groupEnd();

        if (onPageElements.length >= 1) {
          for (const s of onPageElements) {
            if (insp(s).isAttached === true) {
              fpPList(s);
            }
          }
        }

      }).catch(console.warn);

    };

    if (DO_PARTICIPANT_LIST_HACKS) {
      promiseForCustomYtElementsReady.then(onRegistryReadyForDataManipulation);
    }



    const rafHub = (ENABLE_RAF_HACK_TICKERS || ENABLE_RAF_HACK_DOCKED_MESSAGE || ENABLE_RAF_HACK_INPUT_RENDERER || ENABLE_RAF_HACK_EMOJI_PICKER) ? new RAFHub() : null;


    const fixChildrenIssue = !!fixChildrenIssue801;
    if (fixChildrenIssue && typeof Object.getOwnPropertyDescriptor === 'function' && typeof Proxy !== 'undefined') {
      const divProto = HTMLDivElement.prototype;
      const polymerControllerSetData3 = function (c, d, e) {
        return insp(this).set(c, d, e);
      }
      const polymerControllerSetData2 = function (c, d) {
        return insp(this).set(c, d);
      }
      const dummyFn = function () {
        console.log('dummyFn', ...arguments);
      };

      const wm44 = new Map();
      function unPolymerSet(elem) {
        const is = elem.is;
        if (is && !elem.set) {
          let rt = wm44.get(is);
          if (!rt) {
            rt = 1;
            const cnt = insp(elem);
            if (cnt !== elem && cnt && typeof cnt.set === 'function') {
              const pcSet = cnt.constructor.prototype.set;
              if (pcSet && typeof pcSet === 'function' && pcSet.length === 3) {
                rt = polymerControllerSetData3;
              } else if (pcSet && typeof pcSet === 'function' && pcSet.length === 2) {
                rt = polymerControllerSetData2;
              }
            }
            wm44.set(is, rt);
          }
          if (typeof rt === 'function') {
            elem.set = rt;
          } else {
            elem.set = dummyFn;
          }
        }
      }
      if (!divProto.__children577__ && !divProto.__children578__) {

        const dp = Object.getOwnPropertyDescriptor(Element.prototype, 'children');
        const dp2 = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'children');
        const dp3 = Object.getOwnPropertyDescriptor(divProto, 'children');

        if (dp && dp.configurable === true && dp.enumerable === true && typeof dp.get === 'function' && !dp2 && !dp3) {

          if (divProto instanceof HTMLElement && divProto instanceof Element) {

            let m = Object.assign({}, dp);
            divProto.__children577__ = dp.get;
            divProto.__children578__ = function () {
              if (this.__children803__) return this.__children803__;
              if (this.__children801__) {
                let arr = [];
                for (let elem = this.firstElementChild; elem !== null; elem = elem.nextElementSibling) {
                  if (elem.is) {
                    unPolymerSet(elem);
                    arr.push(elem);
                  }
                }
                if (this.__children801__ === 2) this.__children803__ = arr;
                return arr;
              }
              return 577;
            };
            m.get = function () {
              const r = this.__children578__();
              if (r !== 577) return r;
              return this.__children577__();
            };
            Object.defineProperty(divProto, 'children', m);

            console.log('fixChildrenIssue - set OK')

          }
        }

      }


    }


    const bnForDelayChatOccurrence = () => {

      document.addEventListener('animationstart', (evt) => {

        if (evt.animationName === 'dontRenderAnimation') {
          evt.target.classList.remove('dont-render');
          if (scrollChatFn) scrollChatFn();
        }

      }, true);

      const f = (elm) => {
        if (elm && elm.nodeType === 1) {
          if (!skipDontRender && allowDontRender === true) {
            // innerTextFixFn();
            elm.classList.add('dont-render');
          }
        }
      }

      Node.prototype.__appendChild931__ = function (a) {
        a = dr(a);
        if (this.id === 'items' && this.classList.contains('yt-live-chat-item-list-renderer')) {
          if (a && a.nodeType === 1) f(a);
          else if (a instanceof DocumentFragment) {
            for (let n = a.firstChild; n; n = n.nextSibling) {
              f(n);
            }
          }
        }
      }

      Node.prototype.__appendChild932__ = function () {
        this.__appendChild931__.apply(this, arguments);
        return Node.prototype.appendChild.apply(this, arguments);
      }


    };

    const watchUserCSS = () => {

      // if (!CSS.supports('contain-intrinsic-size', 'auto var(--wsr94)')) return;

      const getElemFromWR = (nr) => {
        const n = kRef(nr);
        if (n && n.isConnected) return n;
        return null;
      }

      const clearContentVisibilitySizing = () => {
        Promise.resolve().then(() => {

          const e = document.querySelector('#show-more[disabled]');
          let btnShowMoreWR = e ? mWeakRef(e) : null;

          let lastVisibleItemWR = null;
          for (const elm of document.querySelectorAll('[wSr93]')) {
            if (elm.getAttribute('wSr93') === 'visible') lastVisibleItemWR = mWeakRef(elm);
            elm.setAttribute('wSr93', '');
            // custom CSS property --wsr94 not working when attribute wSr93 removed
          }
          foregroundPromiseFn().then(() => {
            const btnShowMore = getElemFromWR(btnShowMoreWR); btnShowMoreWR = null;
            if (btnShowMore) btnShowMore.click();
            else {
              // would not work if switch it frequently
              const lastVisibleItem = getElemFromWR(lastVisibleItemWR); lastVisibleItemWR = null;
              if (lastVisibleItem) {

                Promise.resolve()
                  .then(() => lastVisibleItem.scrollIntoView())
                  .then(() => lastVisibleItem.scrollIntoView(false))
                  .then(() => lastVisibleItem.scrollIntoView({ behavior: "instant", block: "end", inline: "nearest" }))
                  .catch(e => { }) // break the chain when method not callable

              }
            }
          });

        });

      }

      const mutObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if ((mutation.addedNodes || 0).length >= 1) {
            for (const addedNode of mutation.addedNodes) {
              if (addedNode.nodeName === 'STYLE') {
                clearContentVisibilitySizing();
                return;
              }
            }
          }
          if ((mutation.removedNodes || 0).length >= 1) {
            for (const removedNode of mutation.removedNodes) {
              if (removedNode.nodeName === 'STYLE') {
                clearContentVisibilitySizing();
                return;
              }
            }
          }
        }
      });

      mutObserver.observe(document.documentElement, {
        childList: true,
        subtree: false
      });
      mutObserver.observe(document.head, {
        childList: true,
        subtree: false
      });
      mutObserver.observe(document.body, {
        childList: true,
        subtree: false
      });

    }


    class WillChangeController {
      constructor(itemScroller, willChangeValue) {
        this.element = itemScroller;
        this.counter = 0;
        this.active = false;
        this.willChangeValue = willChangeValue;
      }

      beforeOper() {
        if (!this.active) {
          this.active = true;
          this.element.style.willChange = this.willChangeValue;
        }
        this.counter++;
      }

      afterOper() {
        const c = this.counter;
        foregroundPromiseFn().then(() => {
          if (c === this.counter) {
            this.active = false;
            this.element.style.willChange = '';
          }
        });
      }

      release() {
        const element = this.element;
        this.element = null;
        this.counter = 1e16;
        this.active = false;
        try {
          element.style.willChange = '';
        } catch (e) { }
      }

    }


    const skzData = (skz) => skz.data = {
      "message": {
        "runs": [
          {
            "text": "em2o"
          },
          {
            "emoji": {
              "emojiId": "cm35z",
              "shortcuts": [
                ":_s:",
                ":s:"
              ],
              "searchTerms": [
                "_s",
                "s"
              ],
              "image": {
                "thumbnails": [
                  {
                    "url": dummyImgURL,
                    "width": 48,
                    "height": 48
                  }
                ],
                "accessibility": {
                  "accessibilityData": {
                    "label": "s"
                  }
                }
              },
              "isCustomEmoji": true
            }
          },
          {
            "text": "ji"
          }
        ]
      },
      "authorName": {
        "simpleText": "N"
      },
      "authorPhoto": {
        "thumbnails": [
          {
            "url": dummyImgURL,
            "width": 64,
            "height": 64
          }
        ]
      },
      "contextMenuEndpoint": {
        "commandMetadata": {
          "webCommandMetadata": {
            "ignoreNavigation": true
          }
        },
        "liveChatItemContextMenuEndpoint": {
          "params": "123=="
        }
      },
      "id": "sk35z",
      "timestampUsec": "1232302352350000",
      "authorBadges": [
        {
          "liveChatAuthorBadgeRenderer": {
            "customThumbnail": {
              "thumbnails": [
                {
                  "url": dummyImgURL,
                  "width": 16,
                  "height": 16
                },
                {
                  "url": dummyImgURL,
                  "width": 32,
                  "height": 32
                }
              ]
            },
            "tooltip": "T",
            "accessibility": {
              "accessibilityData": {
                "label": "E"
              }
            }
          }
        }
      ],
      "authorExternalChannelId": "A",
      "contextMenuAccessibility": {
        "accessibilityData": {
          "label": "E"
        }
      },
      "timestampText": {
        "simpleText": "0:43"
      }
    };



    const { lcRendererElm, visObserver } = (() => {



      let lcRendererWR = null;

      const lcRendererElm = () => {
        let lcRenderer = kRef(lcRendererWR);
        if (!lcRenderer || !lcRenderer.isConnected) {
          lcRenderer = document.querySelector('yt-live-chat-item-list-renderer.yt-live-chat-renderer');
          lcRendererWR = lcRenderer ? mWeakRef(lcRenderer) : null;
        }
        return lcRenderer;
      };


      let hasFirstShowMore = false;

      const visObserverFn = (entry) => {

        const target = entry.target;
        if (!target) return;
        // if(target.classList.contains('dont-render')) return;
        let isVisible = entry.isIntersecting === true && entry.intersectionRatio > 0.5;
        // const h = entry.boundingClientRect.height;
        /*
        if (h < 16) { // wrong: 8 (padding/margin); standard: 32; test: 16 or 20
            // e.g. under fullscreen. the element created but not rendered.
            target.setAttribute('wSr93', '');
            return;
        }
        */
        if (isVisible) {
          // target.style.setProperty('--wsr94', h + 'px');
          target.setAttribute('wSr93', 'visible');
          if (nNextElem(target) === null) {

            // firstVisibleItemDetected = true;
            /*
              if (dateNow() - lastScroll < 80) {
                  lastLShow = 0;
                  lastScroll = 0;
                  Promise.resolve().then(clickShowMore);
              } else {
                  lastLShow = dateNow();
              }
              */
            // lastLShow = dateNow();
          } else if (!hasFirstShowMore) { // should more than one item being visible
            // implement inside visObserver to ensure there is sufficient delay
            hasFirstShowMore = true;
            foregroundPromiseFn().then(() => {
              // foreground page
              // page visibly ready -> load the latest comments at initial loading
              const lcRenderer = lcRendererElm();
              if (lcRenderer) {
                if (typeof nextBrowserTick !== 'function') {
                  insp(lcRenderer).scrollToBottom_();
                } else {
                  nextBrowserTick(() => {
                    const cnt = insp(lcRenderer);
                    if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                    cnt.scrollToBottom_();
                  });
                }
              }
            });
          }
        }
        else if (target.getAttribute('wSr93') === 'visible') { // ignore target.getAttribute('wSr93') === '' to avoid wrong sizing

          // target.style.setProperty('--wsr94', h + 'px');
          target.setAttribute('wSr93', 'hidden');
        } // note: might consider 0 < entry.intersectionRatio < 0.5 and target.getAttribute('wSr93') === '' <new last item>

      }



      const visObserver = new IntersectionObserver((entries) => {

        for (const entry of entries) {

          Promise.resolve(entry).then(visObserverFn);

        }

      }, {
        // root: HTMLElement.prototype.closest.call(m2, '#item-scroller.yt-live-chat-item-list-renderer'), // nullable
        rootMargin: "0px",
        threshold: [0.05, 0.95],
      });


      return { lcRendererElm, visObserver }


    })();

    const { setupMutObserver } = (() => {

      async function asyncTickerBackgroundOverridedChecker() {

        try {
          await promiseForCustomYtElementsReady.then();
          await customElements.whenDefined('yt-live-chat-text-message-renderer');
          await new Promise(r => setTimeout(r, 800));

          if (!hasTimerModified) return;
          const tickerRenderer = document.querySelector('#ticker yt-live-chat-ticker-renderer.style-scope.yt-live-chat-renderer');
          if (!tickerRenderer) return;

          const tickerRendererDollar = indr(tickerRenderer);
          const items = (tickerRendererDollar || 0).items || 0;
          if (!items) return;
          const template = document.createElement('template');
          template.innerHTML = `<yt-live-chat-ticker-dummy777-item-renderer class="style-scope yt-live-chat-ticker-renderer" whole-message-clickable=""
            modern="" aria-label="¥1,000" role="button" tabindex="0" id="Chw777" style="width: 94px; overflow: hidden;"
            dimmed="" [dummy777]>
            <div id="container" dir="ltr" class="style-scope yt-live-chat-ticker-dummy777-item-renderer"
              style="--background:linear-gradient(90deg, rgba(1,2,3,1),rgba(1,2,3,1) 7%,rgba(4,0,0,1) 7%,rgba(4,0,0,1));">
              <div id="content" class="style-scope yt-live-chat-ticker-dummy777-item-renderer" style="color: rgb(255, 255, 255);">
                <yt-img-shadow777 id="author-photo" height="24" width="24"
                  class="style-scope yt-live-chat-ticker-dummy777-item-renderer no-transition"
                  style="background-color: transparent;" loaded=""><img id="img"
                    draggable="false" class="style-scope yt-img-shadow" alt="I" height="24" width="24"
                    src="${dummyImgURL}"></yt-img-shadow777>

                <span id="text" dir="ltr" class="style-scope yt-live-chat-ticker-dummy777-item-renderer">¥1,000</span>
              </div>
            </div>
          </yt-live-chat-ticker-dummy777-item-renderer>`;
          const dummy777 = template.content.firstElementChild;
          await Promise.resolve().then();
          let res = 0;
          if (items instanceof HTMLElement && items.isConnected === true) {
            try {
              items.appendChild(dummy777);
              let container = HTMLElement.prototype.querySelector.call(dummy777, '#container') || 0;
              if (container.isConnected === true) {
                const evaluated = `${getComputedStyleCached(container).background}`;
                container = null;
                res = evaluated.indexOf('0.') < 4 ? 1 : 2;
              }
            } catch (e) { console.warn(e) }
            HTMLElement.prototype.remove.call(dummy777);
          }
          await Promise.resolve().then();
          dummy777.textContent = '';
          if (res === 1) {
            // not fulfilling
            // rgba(0, 0, 0, 0.004) none repeat scroll 0% 0% / auto padding-box border-box
            console.groupCollapsed(`%c${"YouTube Super Fast Chat"}%c${" | Incompatibility Found"}`,
              "background-color: #010502; color: #fe806a; font-weight: 700; padding: 2px;",
              "background-color: #010502; color: #fe806a; font-weight: 300; padding: 2px;"
            );
            console.warn(`%cWarning:\n\tYou might have added a userscript or extension that also modifies the ticker background.\n\tYouTube Super Fast Chat is taking over.`, 'color: #bada55');
            console.groupEnd();
            console.log('%cALLOW_ADVANCED_ANIMATED_TICKER_BACKGROUND (Overriding other scripting)', 'background-color: #7eb32b; color: #102624; padding: 2px 4px');
          } else if (res === 2) {
            console.log('%cALLOW_ADVANCED_ANIMATED_TICKER_BACKGROUND', 'background-color: #16c450; color: #102624; padding: 2px 4px');
          }
        } catch (e) {
          console.warn(e);
        }
      }

      async function asyncDelayChatOccurrence(m2) {
        try {
          await promiseForCustomYtElementsReady.then();
          await customElements.whenDefined('yt-live-chat-text-message-renderer');
          await new Promise(r => setTimeout(r, 1));
          const dummy888 = document.createElement('yt-live-chat-text-message-renderer');
          // const template = document.createElement('template');
          // template.innerHTML = "<yt-live-chat-text-message-renderer></yt-live-chat-text-message-renderer>"
          // const dummy888 = template.content.firstElementChild;
          const skzCnt = insp(dummy888);
          if (!(skzCnt && 'data' in skzCnt && 'attached' in skzCnt)) {
            return;
          }
          if (!skzCnt.hostElement) skzCnt.hostElement = dummy888;
          /** @type {HTMLTemplateElement} */
          const skzElem = dummy888;
          let cz1 = null;
          const deferredZy1 = new Promise(resolve => {
            skzCnt.attached = function () {
              cz1 = HTMLElement.prototype.querySelector.call(skzElem, '#message img') !== null;
              resolve(skzElem.textContent);
            }
            skzCnt.detached = function () {
            }
          });
          skzElem.id = 'sk35z';
          skzData(skzCnt);
          sk35zResolveFn = null;
          const deferredMutation = new Promise(resolve => {
            sk35zResolveFn = resolve;
            HTMLElement.prototype.appendChild.call(m2, skzElem);
          });
          const [zy1, _] = await Promise.all([deferredZy1, deferredMutation]);
          skzCnt.attached = function () { };
          function fn() {
            const zy2 = skzElem.textContent;
            const cz2 = HTMLElement.prototype.querySelector.call(skzElem, '#message img') !== null;
            if (typeof zy1 === 'string' && typeof zy2 === 'string') {
              allowDontRender = zy1 === zy2 && cz1 === cz2; // '0:43N​em2oji'
            }
            if (allowDontRender === true) return true;
            if (allowDontRender === false) {
              console.groupCollapsed(`%c${"YouTube Super Fast Chat"}%c${" | Incompatibility Found"}`,
                "background-color: #010502; color: #fe806a; font-weight: 700; padding: 2px;",
                "background-color: #010502; color: #fe806a; font-weight: 300; padding: 2px;"
              );
              console.warn(`%cWarning:\n\tYou might have added a userscript or extension that stops YouTube Super Fast Chat's quick loading.\n\tTo figure out which one affects the script, turn them off one by one and let the author know.`, 'color: #bada55');
              console.groupEnd();
            }
          }
          await new Promise(r => setTimeout(r, 1));
          if (!fn()) return;
          await foregroundPromiseFn().then();
          if (!fn()) return;
          skzElem.remove();
          await Promise.resolve().then();
          skzElem.textContent = '';
          console.log('%cALLOW_DELAYED_CHAT_OCCURRENCE', 'background-color: #16c450; color: #102624; padding: 2px 4px');
        } catch (e) {
          console.warn(e);
        }
      }

      const mutFn = (items) => {
        let seqIndex = -1;
        const elementSet = new Set();
        for (let node = nLastElem(items); node !== null; node = nPrevElem(node)) {
          if (node.hasAttribute('wSr93')) {
            seqIndex = parseInt(node.getAttribute('yt-chat-item-seq'), 10);
            break;
          }
          node.setAttribute('wSr93', '');
          visObserver.observe(node);
          elementSet.add(node);
        }
        let iter = elementSet.values();
        let i = seqIndex + elementSet.size;
        for (let curr; curr = iter.next().value;) {
          curr.setAttribute('yt-chat-item-seq', i % 60);
          curr.classList.add('yt-chat-item-' + ((i % 2) ? 'odd' : 'even'));
          i--;
        }
        iter = null;
        elementSet.clear();
      }

      const mutObserver = new MutationObserver((mutations) => {
        const items = (mutations[0] || 0).target;
        if (!items) return;
        if (sk35zResolveFn) {
          sk35zResolveFn();
          sk35zResolveFn = null;
        }
        mutFn(items);
      });

      const setupMutObserver = (m2) => {
        scrollChatFn = null;
        mutObserver.disconnect();
        mutObserver.takeRecords();
        if (m2) {
          if (typeof m2.__appendChild932__ === 'function') {
            if (typeof m2.appendChild === 'function') m2.appendChild = m2.__appendChild932__;
            if (typeof m2.__shady_native_appendChild === 'function') m2.__shady_native_appendChild = m2.__appendChild932__;
          }
          mutObserver.observe(m2, {
            childList: true,
            subtree: false
          });
          mutFn(m2);

          const isFirstList = firstList;
          firstList = false;

          if (ENABLE_OVERFLOW_ANCHOR) {

            let items = m2;
            let addedAnchor = false;
            if (items) {
              if (items.nextElementSibling === null) {
                items.classList.add('no-anchor');
                addedAnchor = true;
                items.parentNode.appendChild(dr(document.createElement('item-anchor')));
              }
            }



            if (addedAnchor) {
              nodeParent(m2).classList.add('no-anchor'); // required
            }

          }



          if (ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX) {

            (() => {

              const tag = 'yt-iframed-player-events-relay'
              const dummy = document.createElement(tag);

              const cProto = getProto(dummy);
              if (!cProto || !cProto.handlePostMessage_) {
                console.warn(`proto.handlePostMessage_ for ${tag} is unavailable.`);
                return;
              }

              if (typeof cProto.handlePostMessage_ === 'function' && !cProto.handlePostMessage66_ && !cProto.handlePostMessage67_ ) {

                cProto.handlePostMessage66_ = cProto.handlePostMessage_;

                const handlePostMessageAfterPromiseA = (da) => {

                  if (!da || typeof da !== 'object') return;

                  if ('yt-player-state-change' in da) {

                    const qc = da['yt-player-state-change'];


                    let isQcChanged = false;

                    if (qc === 2) { isQcChanged = qc !== _playerState; _playerState = 2; relayCount = 0; } // paused
                    else if (qc === 3) { isQcChanged = qc !== _playerState; _playerState = 3; } // playing
                    else if (qc === 1) { isQcChanged = qc !== _playerState; _playerState = 1; } // playing


                    if ((isQcChanged) && playerState !== _playerState) {
                      playerEventsByIframeRelay = true;
                      onPlayStateChangePromise = new Promise((resolve) => {
                        const k = _playerState;
                        foregroundPromiseFn().then(() => {
                          if (k === _playerState && playerState !== _playerState) playerState = _playerState;
                          onPlayStateChangePromise = null;
                          resolve();
                        })
                      }).catch(console.warn);

                    }

                  } else if ('yt-player-video-progress' in da) {
                    const vp = da['yt-player-video-progress'];


                    relayCount++;
                    lastPlayerProgress = vp > 0 ? vp : 0;


                    if (relayPromise && vp > 0 && relayCount >= 2) {
                      if (onPlayStateChangePromise) {
                        onPlayStateChangePromise.then(() => {
                          relayPromise && relayPromise.resolve();
                          relayPromise = null;
                        })
                      } else {
                        relayPromise.resolve();
                        relayPromise = null;
                      }
                    }

                  }

                };

                cProto.handlePostMessage67_ = function (a) {

                  let da = a.data;
                  const wNode = mWeakRef(this);
                  // const wData = mWeakRef(da);

                  playEventsStack = playEventsStack.then(() => {

                    const cnt = kRef(wNode);
                    // const da = kRef(wData);

                    if (!cnt || !a || !da) return;
                    handlePostMessageAfterPromiseA(da);
                    da = null;

                    const r = cnt.handlePostMessage66_(a);
                    a = null;

                  }).catch(console.warn);

                }

                const handlePostMessageAfterPromiseB = (da) => {

                  const lcr = document.querySelector('yt-live-chat-renderer');
                  const psc = document.querySelector("yt-player-seek-continuation");
                  if (lcr && psc && lcr.replayBuffer_) {

                    const rbProgress = lcr.replayBuffer_.lastVideoOffsetTimeMsec;
                    const daProgress = da['yt-player-video-progress'] * 1000
                    // document.querySelector('yt-live-chat-renderer').playerProgressChanged_(1e-5);

                    const front_ = (lcr.replayBuffer_.replayQueue || 0).front_;
                    const back_ = (lcr.replayBuffer_.replayQueue || 0).back_;

                    // console.log(deepCopy( front_))
                    // console.log(deepCopy( back_))
                    // console.log(rbProgress, daProgress, )
                    if (front_ && back_ && rbProgress > daProgress && back_.length > 2 && back_.some(e => e && +e.videoOffsetTimeMsec > daProgress) && back_.some(e => e && +e.videoOffsetTimeMsec < daProgress)) {
                      // no action
                      // console.log('ss1')
                    } else if (rbProgress < daProgress + 3400 && rbProgress > daProgress - 1200) {
                      //  daProgress - 1200 < rbProgress < daProgress + 3400
                      // console.log('ss2')
                    } else {

                      lcr.previousProgressSec = 1E-5;
                      // lcr._setIsSeeking(!0),
                      lcr.replayBuffer_.clear()
                      psc.fireSeekContinuation_(da['yt-player-video-progress']);
                    }

                  }


                };

                cProto.handlePostMessage_ = function (a) {

                  let da = (a || 0).data || 0;
                  const wNode = mWeakRef(this);

                  if (typeof da !== 'object') return;

                  if (waitForInitialDataCompletion === 1) return;

                  if (!isPlayProgressTriggered) {
                    isPlayProgressTriggered = true; // set once

                    if ('yt-player-video-progress' in da) {
                      waitForInitialDataCompletion = 1;

                      const wrapWith = (data) => {
                        const { origin } = a;
                        return {
                          origin,
                          data
                        };
                      }

                      this.handlePostMessage67_(wrapWith({
                        "yt-iframed-parent-ready": true
                      }));


                      playEventsStack = playEventsStack.then(() => {

                        const cnt = kRef(wNode);

                        if (!cnt || !a || !da) return;

                        handlePostMessageAfterPromiseB(da);
                        da = null;

                        waitForInitialDataCompletion = 2;

                        const r = cnt.handlePostMessage_(a); // isPlayProgressTriggered is set
                        a = null;

                      }).catch(console.warn);

                      return;

                    }

                  }

                  this.handlePostMessage67_(a);

                }

              }


            })();

          }

          if (isFirstList && DO_CHECK_TICKER_BACKGROUND_OVERRIDED) {
            asyncTickerBackgroundOverridedChecker();
          }

        }
      }

      return { setupMutObserver };



    })();

    const setupEvents = () => {


      let scrollCount = 0;

      const passiveCapture = typeof IntersectionObserver === 'function' ? { capture: true, passive: true } : true;


      const delayFlushActiveItemsAfterUserActionK_ = () => {

        const lcRenderer = lcRendererElm();
        if (lcRenderer) {
          const cnt = insp(lcRenderer);
          if (!cnt.hasUserJustInteracted11_) return;
          if (cnt.atBottom && cnt.allowScroll && cnt.activeItems_.length >= 1 && cnt.hasUserJustInteracted11_()) {
            cnt.delayFlushActiveItemsAfterUserAction11_ && cnt.delayFlushActiveItemsAfterUserAction11_();
          }
        }

      }

      document.addEventListener('scroll', (evt) => {
        if (!evt || !evt.isTrusted) return;
        // lastScroll = dateNow();
        if (++scrollCount > 1e9) scrollCount = 9;
      }, passiveCapture); // support contain => support passive

      let lastScrollCount = -1;
      document.addEventListener('wheel', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (lastScrollCount === scrollCount) return;
        lastScrollCount = scrollCount;
        lastWheel = dateNow();
        delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
      }, passiveCapture); // support contain => support passive

      document.addEventListener('mousedown', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (((evt || 0).target || 0).id !== 'item-scroller') return;
        lastMouseDown = dateNow();
        currentMouseDown = true;
        lastUserInteraction = lastMouseDown;
      }, passiveCapture);

      document.addEventListener('pointerdown', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (((evt || 0).target || 0).id !== 'item-scroller') return;
        lastMouseDown = dateNow();
        currentMouseDown = true;
        lastUserInteraction = lastMouseDown;
      }, passiveCapture);

      document.addEventListener('click', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (((evt || 0).target || 0).id !== 'item-scroller') return;
        lastMouseDown = lastMouseUp = dateNow();
        currentMouseDown = false;
        lastUserInteraction = lastMouseDown;
        delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
      }, passiveCapture);

      document.addEventListener('tap', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (((evt || 0).target || 0).id !== 'item-scroller') return;
        lastMouseDown = lastMouseUp = dateNow();
        currentMouseDown = false;
        lastUserInteraction = lastMouseDown;
        delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
      }, passiveCapture);


      document.addEventListener('mouseup', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (currentMouseDown) {
          lastMouseUp = dateNow();
          currentMouseDown = false;
          lastUserInteraction = lastMouseUp;
          delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
        }
      }, passiveCapture);


      document.addEventListener('pointerup', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (currentMouseDown) {
          lastMouseUp = dateNow();
          currentMouseDown = false;
          lastUserInteraction = lastMouseUp;
          delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
        }
      }, passiveCapture);

      document.addEventListener('touchstart', (evt) => {
        if (!evt || !evt.isTrusted) return;
        lastTouchDown = dateNow();
        currentTouchDown = true;
        lastUserInteraction = lastTouchDown;
      }, passiveCapture);

      document.addEventListener('touchmove', (evt) => {
        if (!evt || !evt.isTrusted) return;
        lastTouchDown = dateNow();
        currentTouchDown = true;
        lastUserInteraction = lastTouchDown;
      }, passiveCapture);

      document.addEventListener('touchend', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (currentTouchDown) {
          lastTouchUp = dateNow();
          currentTouchDown = false;
          lastUserInteraction = lastTouchUp;
          delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
        }
      }, passiveCapture);

      document.addEventListener('touchcancel', (evt) => {
        if (!evt || !evt.isTrusted) return;
        if (currentTouchDown) {
          lastTouchUp = dateNow();
          currentTouchDown = false;
          lastUserInteraction = lastTouchUp;
          delayFlushActiveItemsAfterUserActionK_ && delayFlushActiveItemsAfterUserActionK_();
        }
      }, passiveCapture);


    }

    const getTimestampUsec = (itemRenderer) => {
      if (itemRenderer && 'timestampUsec' in itemRenderer) {
        return itemRenderer.timestampUsec
      } else if (itemRenderer && itemRenderer.showItemEndpoint) {
        const messageRenderer = ((itemRenderer.showItemEndpoint.showLiveChatItemEndpoint || 0).renderer || 0);
        if (messageRenderer) {

          const messageRendererKey = firstObjectKey(messageRenderer);
          if (messageRendererKey && messageRenderer[messageRendererKey]) {
            const messageRendererData = messageRenderer[messageRendererKey];
            if (messageRendererData && 'timestampUsec' in messageRendererData) {
              return messageRendererData.timestampUsec
            }
          }
        }
      }
      return null;
    }

    const onRegistryReadyForDOMOperations = () => {

      let firstCheckedOnYtInit = false;

      const assertorURL = () => assertor(() => location.pathname.startsWith('/live_chat') && (location.search.indexOf('continuation=') > 0 || location.search.indexOf('v=') > 0));

      const mightFirstCheckOnYtInit = () => {
        if (firstCheckedOnYtInit) return;
        firstCheckedOnYtInit = true;

        if (!document.body || !document.head) return;
        if (!assertorURL()) return;

        addCssManaged();

        let efsContainer = document.getElementById('elzm-fonts-yk75g');
        if (efsContainer && efsContainer.parentNode !== document.body) {
          document.body.appendChild(efsContainer);
        }

      };

      if (!assertorURL()) return;
      // if (!assertor(() => document.getElementById('yt-masthead') === null)) return;


      const { weakWrap } = (() => {


        // const tickerFuncProps = new Set([
        //   'animateShowStats', 'animateHideStats',  // updateStatsBarAndMaybeShowAnimationRevised
        //   'collapse', // slideDownNoSelfLeakage
        //   'requestRemoval', // collapseNoSelfLeakage
        //   'setContainerWidth', 'get', 'set', // deletedChangedNoSelfLeakage
        //   'computeAriaLabel', //dataChanged
        //   'startCountdown', // dataChanged [in case]
        // ]);

        // const tickerTags = new Set([
        //   "yt-live-chat-ticker-renderer",
        //   "yt-live-chat-ticker-paid-message-item-renderer",
        //   "yt-live-chat-ticker-paid-sticker-item-renderer",
        //   "yt-live-chat-ticker-sponsor-item-renderer"
        // ]);

        // const emptySet = new Set();



        // const tickerFuncPropsFn = (cnt) => {

        //   const is = `${cnt.is}`;

        //   if (tickerTags.has(is)) {
        //     let flg = 0;
        //     if (cnt.get && cnt.set) flg |= 1;
        //     if (cnt.setContainerWidth && cnt.collapse && cnt.requestRemoval) flg |= 2;
        //     if (cnt.animateShowStats && cnt.animateHideStats) flg |= 4;
        //     if (cnt.startCountdown) flg |= 8;
        //     console.log(`DEBUG flag_6877 = ${flg}`, is);
        //     // DEBUG flag_6877 = 15 yt-live-chat-ticker-paid-message-item-renderer
        //     // DEBUG flag_6877 = 11 yt-live-chat-ticker-sponsor-item-renderer
        //     return tickerFuncProps;
        //   }

        //   return emptySet;


        // }


        // const smb = Symbol();
        const vmb = 'dtz02' // Symbol(); // return kThis for thisArg
        const vmc = 'dtz04' // Symbol(); // whether it is proxied fn
        const vmd = 'dtz08' // Symbol(); // self fn proxy (fn--fn)




        const thisConversionFn = (thisArg) => {
          if (!thisArg) return null;
          const kThis = thisArg[vmb];
          if (kThis) {
            const ref = kThis.ref;
            return (ref ? kRef(ref) : null) || null;
          }
          return thisArg;
        }
    
        const pFnHandler2 = {
          get(target, prop) {
            if (prop === vmc) return target;
            return Reflect.get(target, prop);
          },
          apply(target, thisArg, argumentsList) {
            thisArg = thisConversionFn(thisArg);
            if (thisArg) return Reflect.apply(target, thisArg, argumentsList);
          }
        }
    
        
        const proxySelfHandler = {
          get(target, prop) {
            if(prop === vmb) return target;
            const ref = target.ref;
            const cnt = kRef(ref);
            if (!cnt) return;
            if (typeof cnt[prop] === 'function' && !cnt[prop][vmc] && !cnt[prop][vmb]) {
              if (!cnt[prop][vmd]) cnt[prop][vmd] = new Proxy(cnt[prop], pFnHandler2);
              return cnt[prop][vmd];
            }
            return cnt[prop];
          },
          set(target, prop, value) {
            const cnt = kRef(target.ref);
            if (!cnt) return true;
            if(value && (value[vmc] || value[vmb])){
              cnt[prop] = value[vmc] || thisConversionFn(value);
              return true;
            }
            cnt[prop] = value;
            return true;
          }
        };
    
        const weakWrap = (thisArg) => {
          thisArg = thisConversionFn(thisArg);
          if (!thisArg) {
            console.error('thisArg is not found');
            return null;
          }
          return new Proxy({ ref: mWeakRef(thisArg) }, proxySelfHandler);
        }






        if (!window.getComputedStyle533 && typeof window.getComputedStyle === 'function') {
          window.getComputedStyle533 = window.getComputedStyle;
          window.getComputedStyle = function (a, ...args) {
            a = thisConversionFn(a);
            if (a) {
              return getComputedStyle533(a, ...args);
            }
            return null;
          }
        }







        // const fnProxySelf = function (...args) {
        //   const cnt = kRef(this.ref);
        //   if (cnt) {
        //     return cnt[this.prop](...args); // might throw error
        //   }
        // }
        // const proxySelfHandler = {
        //   get(target, prop) {
        //     const ref = target.ref;
        //     const cnt = kRef(ref);
        //     if (!cnt) return;
        //     if (prop === 'dtz06') return 1;
        //     if (typeof cnt[prop] === 'function') {
        //       if (!target.funcs.has(prop)) {
        //         console.warn(`proxy get to function | prop: ${prop} | is: ${cnt.is}`);
        //       }
        //       if (!target[`$$${prop}$$`]) target[`$$${prop}$$`] = fnProxySelf.bind({ prop, ref });
        //       return target[`$$${prop}$$`];
        //     }
        //     return cnt[prop];
        //   },
        //   set(target, prop, value) {
        //     const cnt = kRef(target.ref);
        //     if (!cnt) return true;
        //     if (typeof value === 'function') {
        //       console.warn(`proxy set to function | prop: ${prop} | is: ${cnt.is}`);
        //       cnt[prop] = value;
        //       return true;
        //     }
        //     cnt[prop] = value;
        //     return true;
        //   }
        // };

        // return { tickerFuncPropsFn, proxySelfHandler }

        return {weakWrap}
      })();



      if (document.documentElement && document.head) {
        addCssManaged();
      }
      // console.log(document.body===null)

      if (ATTEMPT_TICKER_ANIMATION_START_TIME_DETECTION) {
        getLCRDummy().then(async (lcrDummy) => {

          const tag = "yt-live-chat-renderer"
          const dummy = lcrDummy;

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-renderer hacks");
          console.log("[Begin]");






          if (typeof cProto.playerProgressChanged_ === 'function' && !cProto.playerProgressChanged32_) {

            cProto.playerProgressChanged32_ = cProto.playerProgressChanged_;

            const pop078 = function () {
              const r = this.pop78();

              if (r && (r.actions || 0).length >= 1 && r.videoOffsetTimeMsec) {
                for (const action of r.actions) {

                  const itemActionKey = !action ? null : 'addChatItemAction' in action ? 'addChatItemAction' : 'addLiveChatTickerItemAction' in action ? 'addLiveChatTickerItemAction' : null;
                  if (itemActionKey) {

                    const itemAction = action[itemActionKey];
                    const item = (itemAction || 0).item;
                    if (typeof item === 'object') {

                      const rendererKey = firstObjectKey(item);
                      if (rendererKey) {
                        const renderer = item[rendererKey];
                        if (renderer && typeof renderer === 'object') {
                          renderer.__videoOffsetTimeMsec__ = r.videoOffsetTimeMsec;
                          renderer.__progressAt__ = playerProgressChangedArg1;

                          // console.log(48117006)
                        }

                      }

                    }
                  }
                }
              }
              return r;
            }

            const replayQueueProxyHandler = {
              get(target, prop, receiver) {
                if (prop === 'qe3') return 1;
                const v = target[prop];
                if (prop === 'front_') {
                  if (v && typeof v.length === 'number') {
                    if (!v.pop78) {
                      v.pop78 = v.pop;
                      v.pop = pop078;
                    }
                  }
                }
                return v;
              }
            };

            cProto.playerProgressChanged_ = function (a, b, c) {
              // console.log(48117005)
              playerProgressChangedArg1 = a;
              playerProgressChangedArg2 = b;
              playerProgressChangedArg3 = c;
              const replayBuffer_ = this.replayBuffer_;
              if (replayBuffer_) {
                const replayQueue = replayBuffer_.replayQueue
                if (replayQueue && typeof replayQueue === 'object' && !replayQueue.qe3) {
                  replayBuffer_.replayQueue = new Proxy(replayBuffer_.replayQueue, replayQueueProxyHandler);
                }
              }
              Promise.resolve().then(updateTickerCurrentTime);
              return this.playerProgressChanged32_.apply(this, arguments);
            };

          }

          console.log("[End]");
          console.groupEnd();


        });

      }

      customElements.whenDefined('yt-live-chat-item-list-renderer').then(() => {


        const tag = "yt-live-chat-item-list-renderer"
        const dummy = document.createElement(tag);

        const cProto = getProto(dummy);
        if (!cProto || !cProto.attached) {
          console.warn(`proto.attached for ${tag} is unavailable.`);
          return;
        }

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-item-list-renderer hacks");
        console.log("[Begin]");

        const mclp = cProto;
        const _flag0281_ = window._flag0281_ || mclp._flag0281_;

        try {
          assertor(() => typeof mclp.scrollToBottom_ === 'function');
          assertor(() => typeof mclp.flushActiveItems_ === 'function');
          assertor(() => typeof mclp.canScrollToBottom_ === 'function');
          assertor(() => typeof mclp.setAtBottom === 'function');
          assertor(() => typeof mclp.scrollToBottom66_ === 'undefined');
          assertor(() => typeof mclp.flushActiveItems66_ === 'undefined');
        } catch (e) { }


        try {
          assertor(() => typeof mclp.attached === 'function');
          assertor(() => typeof mclp.detached === 'function');
          assertor(() => typeof mclp.canScrollToBottom_ === 'function');
          assertor(() => typeof mclp.isSmoothScrollEnabled_ === 'function');
          assertor(() => typeof mclp.maybeResizeScrollContainer_ === 'function');
          assertor(() => typeof mclp.refreshOffsetContainerHeight_ === 'function');
          assertor(() => typeof mclp.smoothScroll_ === 'function');
          assertor(() => typeof mclp.resetSmoothScroll_ === 'function');
        } catch (e) { }

        mclp.__intermediate_delay__ = null;

        let myk = 0;
        let mlf = 0;
        let myw = 0;
        let mzt = 0;
        let zarr = null;
        let mlg = 0;

        if ((_flag0281_ & 0x2000) == 0) {

          if ((mclp.clearList || 0).length === 0) {
            (_flag0281_ & 0x2) == 0 && assertor(() => fnIntegrity(mclp.clearList, '0.106.50'));
            mclp.clearList66 = mclp.clearList;
            mclp.clearList = function () {
              myk++;
              mlf++;
              myw++;
              mzt++;
              mlg++;
              zarr = null;
              this.__intermediate_delay__ = null;
              this.clearList66();
            };
            console.log("clearList", "OK");
          } else {
            console.log("clearList", "NG");
          }

        }



        let onListRendererAttachedDone = false;

        function setList(itemOffset, items) {

          const isFirstTime = onListRendererAttachedDone === false;

          if (isFirstTime) {
            onListRendererAttachedDone = true;
            Promise.resolve().then(watchUserCSS);
            addCssManaged();
            setupEvents();
          }

          setupStyle(itemOffset, items);

          setupMutObserver(items);
        }

        mclp.attached419 = async function () {

          if (!this.isAttached) return;

          let maxTrial = 16;
          while (!this.$ || !this.$['item-scroller'] || !this.$['item-offset'] || !this.$['items']) {
            if (--maxTrial < 0 || !this.isAttached) return;
            await iAFP(this.hostElement).then();
            // await new Promise(requestAnimationFrame);
          }

          if (this.isAttached !== true) return;

          if (!this.$) {
            console.warn("!this.$");
            return;
          }
          if (!this.$) return;
          /** @type {HTMLElement | null} */
          const itemScroller = this.$['item-scroller'];
          /** @type {HTMLElement | null} */
          const itemOffset = this.$['item-offset'];
          /** @type {HTMLElement | null} */
          const items = this.$['items'];

          if (!itemScroller || !itemOffset || !items) {
            console.warn("items.parentNode !== itemOffset");
            return;
          }

          if (nodeParent(items) !== itemOffset) {

            console.warn("items.parentNode !== itemOffset");
            return;
          }


          if (items.id !== 'items' || itemOffset.id !== "item-offset") {

            console.warn("id incorrect");
            return;
          }

          const isTargetItems = HTMLElement.prototype.matches.call(items, '#item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer')

          if (!isTargetItems) {
            console.warn("!isTargetItems");
            return;
          }

          setList(itemOffset, items);

        }

        mclp.attached331 = mclp.attached;
        mclp.attached = function () {
          this.attached419 && this.attached419();
          return this.attached331();
        }

        mclp.detached331 = mclp.detached;

        mclp.detached = function () {
          setupMutObserver();
          return this.detached331();
        }

        const t29s = document.querySelectorAll("yt-live-chat-item-list-renderer");
        for (const t29 of t29s) {
          if (insp(t29).isAttached === true) {
            t29.attached419();
          }
        }

        if ((mclp.async || 0).length === 2 && (mclp.cancelAsync || 0).length === 1) {

          assertor(() => fnIntegrity(mclp.async, '2.24.15'));
          assertor(() => fnIntegrity(mclp.cancelAsync, '1.15.8'));

          /** @type {Map<number, any>} */
          const aMap = new Map();
          let count = 6150;
          mclp.async66 = mclp.async;
          mclp.async = function (e, f) {
            // ensure the previous operation is done
            // .async is usually after the time consuming functions like flushActiveItems_ and scrollToBottom_
            const hasF = arguments.length === 2;
            const stack = new Error().stack;
            const isFlushAsync = stack.indexOf('flushActiveItems_') >= 0;
            if (count > 1e9) count = 6159;
            const resId = ++count;
            aMap.set(resId, e);
            (this.__intermediate_delay__ || Promise.resolve()).then(rk => {
              const rp = aMap.get(resId);
              if (typeof rp !== 'function') {
                return;
              }
              let cancelCall = false;
              if (isFlushAsync) {
                if (rk < 0) {
                  cancelCall = true;
                } else if (rk === 2 && arguments[0] === this.maybeScrollToBottom_) {
                  cancelCall = true;
                }
              }
              if (cancelCall) {
                aMap.delete(resId);
              } else {
                const asyncEn = function () {
                  aMap.delete(resId);
                  return rp.apply(this, arguments);
                };
                aMap.set(resId, hasF ? this.async66(asyncEn, f) : this.async66(asyncEn));
              }
            });

            return resId;
          }

          mclp.cancelAsync66 = mclp.cancelAsync;
          mclp.cancelAsync = function (resId) {
            if (resId <= 6150) {
              this.cancelAsync66(resId);
            } else if (aMap.has(resId)) {
              const rp = aMap.get(resId);
              aMap.delete(resId);
              if (typeof rp !== 'function') {
                this.cancelAsync66(rp);
              }
            }
          }

          console.log("async", "OK");
        } else {
          console.log("async", "NG");
        }


        if ((_flag0281_ & 0x2) == 0) {
          if ((mclp.showNewItems_ || 0).length === 0 && ENABLE_NO_SMOOTH_TRANSFORM) {

            assertor(() => fnIntegrity(mclp.showNewItems_, '0.170.79'));
            mclp.showNewItems66_ = mclp.showNewItems_;

            mclp.showNewItems77_ = async function () {
              if (myk > 1e9) myk = 9;
              let tid = ++myk;

              await iAFP(this.hostElement).then();
              // await new Promise(requestAnimationFrame);

              if (tid !== myk) {
                return;
              }

              const cnt = this;

              await Promise.resolve();
              cnt.showNewItems66_();

              await Promise.resolve();

            }

            mclp.showNewItems_ = function () {

              const cnt = this;
              cnt.__intermediate_delay__ = new Promise(resolve => {
                cnt.showNewItems77_().then(() => {
                  resolve();
                });
              });
            }

            console.log("showNewItems_", "OK");
          } else {
            console.log("showNewItems_", "NG");
          }

        }

        if ((_flag0281_ & 0x2000) == 0) {
          if ((mclp.flushActiveItems_ || 0).length === 0) {

            if ((_flag0281_ & 0x2) == 0) {

              const sfi = fnIntegrity(mclp.flushActiveItems_);
              if (sfi === '0.156.86') {
                // https://www.youtube.com/s/desktop/f61c8d85/jsbin/live_chat_polymer.vflset/live_chat_polymer.js

                // added "refreshOffsetContainerHeight_"

                //   f.flushActiveItems_ = function() {
                //     var a = this;
                //     if (0 < this.activeItems_.length)
                //         if (this.canScrollToBottom_()) {
                //             var b = Math.max(this.visibleItems.length + this.activeItems_.length - this.data.maxItemsToDisplay, 0);
                //             b && this.splice("visibleItems", 0, b);
                //             if (this.isSmoothScrollEnabled_() || this.dockableMessages.length)
                //                 this.preinsertHeight_ = this.items.clientHeight;
                //             this.activeItems_.unshift("visibleItems");
                //             try {
                //                 this.push.apply(this, this.activeItems_)
                //             } catch (c) {
                //                 fm(c)
                //             }
                //             this.activeItems_ = [];
                //             this.isSmoothScrollEnabled_() ? this.canScrollToBottom_() && Mw(function() {
                //                 a.showNewItems_()
                //             }) : Mw(function() {
                //                 a.refreshOffsetContainerHeight_();
                //                 a.maybeScrollToBottom_()
                //             })
                //         } else
                //             this.activeItems_.length > this.data.maxItemsToDisplay && this.activeItems_.splice(0, this.activeItems_.length - this.data.maxItemsToDisplay)
                // }
                // ;

              } else if (sfi === '0.150.84') {
                // https://www.youtube.com/s/desktop/e4d15d2c/jsbin/live_chat_polymer.vflset/live_chat_polymer.js
                // var b = Math.max(this.visibleItems.length + this.activeItems_.length - this.data.maxItemsToDisplay, 0);
                //     b && this.splice("visibleItems", 0, b);
                //     if (this.isSmoothScrollEnabled_() || this.dockableMessages.length)
                //         this.preinsertHeight_ = this.items.clientHeight;
                //     this.activeItems_.unshift("visibleItems");
                //     try {
                //         this.push.apply(this, this.activeItems_)
                //     } catch (c) {
                //         nm(c)
                //     }
                //     this.activeItems_ = [];
                //     this.isSmoothScrollEnabled_() ? this.canScrollToBottom_() && zQ(function() {
                //         a.showNewItems_()
                //     }) : zQ(function() {
                //         a.maybeScrollToBottom_()
                //     })
              } else if (sfi === '0.137.81' || sfi === '0.138.81') {
                // e.g. https://www.youtube.com/yts/jsbin/live_chat_polymer-vflCyWEBP/live_chat_polymer.js
              } else {
                assertor(() => fnIntegrity(mclp.flushActiveItems_, '0.150.84'));
              }
            }

            let hasMoreMessageState = !ENABLE_SHOW_MORE_BLINKER ? -1 : 0;

            mclp.flushActiveItems66_ = mclp.flushActiveItems_;


            const preloadFn = (acItems) => {
              let waitFor = [];
              /** @type {Set<string>} */
              const imageLinks = new Set();

              if (ENABLE_PRELOAD_THUMBNAIL || EMOJI_IMAGE_SINGLE_THUMBNAIL || AUTHOR_PHOTO_SINGLE_THUMBNAIL) {
                for (const item of acItems) {
                  fixLiveChatItem(item, imageLinks);
                }
              }
              if (ENABLE_PRELOAD_THUMBNAIL && kptPF !== null && (kptPF & (8 | 4)) && imageLinks.size > 0) {

                // reference: https://github.com/Yuanfang-fe/Blog-X/issues/34
                const rel = kptPF & 8 ? 'subresource' : kptPF & 16 ? 'preload' : kptPF & 4 ? 'prefetch' : '';
                // preload performs the high priority fetching.
                // prefetch delays the chat display if the video resoruce is demanding.

                if (rel) {

                  imageLinks.forEach(imageLink => {
                    let d = false;
                    if (SKIP_PRELOAD_EMOJI && imageLink.includes('.ggpht.com/')) return;
                    const isEmoji = imageLink.includes('/emoji/');
                    const pretechedSet = isEmoji ? emojiPrefetched : authorPhotoPrefetched;
                    if (!pretechedSet.has(imageLink)) {
                      pretechedSet.add(imageLink);
                      d = true;
                    }
                    if (d) {
                      waitFor.push(linker(null, rel, imageLink, 'image'));

                    }
                  })

                }

              }

              return async () => {
                if (waitFor.length > 0) {
                  await Promise.race([new Promise(r => setTimeout(r, 250)), Promise.all(waitFor)]);
                }
                waitFor.length = 0;
                waitFor = null;
              };

            };

            mclp.flushActiveItems78_ = async function (tid) {
              try {

                if (tid !== mlf) return;
                if ((this._flag0281_ & 0x4) == 0x4) {
                  const cnt = this;

                  if (tid !== mlf || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                  if (!cnt.activeItems_ || cnt.activeItems_.length === 0) return;

                  mlf++;
                  if (mlg > 1e9) mlg = 9;
                  ++mlg;
                  const acItems = cnt.activeItems_;
                  if (acItems.length < MAX_ITEMS_FOR_FULL_FLUSH) {
                    const pn = preloadFn(acItems);
                    await pn();
                  }
                  cnt.flushActiveItems66_();

                  return 1;

                }
                const lockedMaxItemsToDisplay = this.data.maxItemsToDisplay944;
                let logger = false;
                const cnt = this;
                let immd = cnt.__intermediate_delay__;
                await iAFP(this.hostElement).then();
                // await new Promise(requestAnimationFrame);

                if (tid !== mlf || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                if (!cnt.activeItems_ || cnt.activeItems_.length === 0) return;

                mlf++;
                if (mlg > 1e9) mlg = 9;
                ++mlg;

                const tmpMaxItemsCount = this.data.maxItemsToDisplay;
                const reducedMaxItemsToDisplay = MAX_ITEMS_FOR_FULL_FLUSH;
                let changeMaxItemsToDisplay = false;
                const activeItemsLen = this.activeItems_.length;
                if (activeItemsLen > tmpMaxItemsCount && tmpMaxItemsCount > 0) {
                  logger = true;

                  groupCollapsed("YouTube Super Fast Chat", " | flushActiveItems78_");

                  logger && console.log('[Begin]')

                  console.log('this.activeItems_.length > N', activeItemsLen, tmpMaxItemsCount);
                  if (ENABLE_REDUCED_MAXITEMS_FOR_FLUSH && lockedMaxItemsToDisplay === tmpMaxItemsCount && lockedMaxItemsToDisplay !== reducedMaxItemsToDisplay) {
                    console.log('reduce maxitems');
                    if (tmpMaxItemsCount > reducedMaxItemsToDisplay) {
                      // as all the rendered chats are already "outdated"
                      // all old chats shall remove and reduced number of few chats will be rendered
                      // then restore to the original number
                      changeMaxItemsToDisplay = true;
                      this.data.maxItemsToDisplay = reducedMaxItemsToDisplay;
                      console.log(`'maxItemsToDisplay' is reduced from ${tmpMaxItemsCount} to ${reducedMaxItemsToDisplay}.`)
                    }
                    this.activeItems_.splice(0, activeItemsLen - this.data.maxItemsToDisplay);
                    //   console.log('changeMaxItemsToDisplay 01', this.data.maxItemsToDisplay, oMaxItemsToDisplay, reducedMaxItemsToDisplay)

                    console.log('new this.activeItems_.length > N', this.activeItems_.length);
                  } else {
                    this.activeItems_.splice(0, activeItemsLen - (tmpMaxItemsCount < 900 ? tmpMaxItemsCount : 900));

                    console.log('new this.activeItems_.length > N', this.activeItems_.length);
                  }
                }
                // it is found that it will render all stacked chats after switching back from background
                // to avoid lagging in popular livestream with massive chats, trim first before rendering.
                // this.activeItems_.length > this.data.maxItemsToDisplay && this.activeItems_.splice(0, this.activeItems_.length - this.data.maxItemsToDisplay);

                cnt.__intermediate_delay__ = Promise.all([cnt.__intermediate_delay__ || null, immd || null]);
                await Promise.resolve();
                const acItems = cnt.activeItems_;
                const len1 = acItems.length;
                if (!len1) console.warn('cnt.activeItems_.length = 0');

                const pn = preloadFn(acItems);
                const noVisibleItem1 = ((cnt.visibleItems || 0).length || 0) === 0;
                skipDontRender = noVisibleItem1;
                await pn();
                // console.log('ss2', Date.now())
                cnt.flushActiveItems66_();
                const noVisibleItem2 = ((cnt.visibleItems || 0).length || 0) === 0;
                skipDontRender = noVisibleItem2;
                await Promise.resolve();
                if (changeMaxItemsToDisplay && this.data.maxItemsToDisplay === reducedMaxItemsToDisplay && tmpMaxItemsCount > reducedMaxItemsToDisplay) {
                  this.data.maxItemsToDisplay = tmpMaxItemsCount;

                  logger && console.log(`'maxItemsToDisplay' is restored from ${reducedMaxItemsToDisplay} to ${tmpMaxItemsCount}.`);
                  //   console.log('changeMaxItemsToDisplay 02', this.data.maxItemsToDisplay, oMaxItemsToDisplay, reducedMaxItemsToDisplay)
                } else if (changeMaxItemsToDisplay) {

                  logger && console.log(`'maxItemsToDisplay' cannot be restored`, {
                    maxItemsToDisplay: this.data.maxItemsToDisplay,
                    reducedMaxItemsToDisplay,
                    originalMaxItemsToDisplay: tmpMaxItemsCount
                  });
                }
                logger && console.log('[End]');

                logger && console.groupEnd();

                if (noVisibleItem1 && !noVisibleItem2) {
                  // fix possible no auto scroll issue.
                  !((cnt.__notRequired__ || 0) & 256) && setTimeout(() => cnt.setAtBottom(), 1);
                }

                if (!ENABLE_NO_SMOOTH_TRANSFORM) {


                  const ff = () => {

                    if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                    //   if (tid !== mlf || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                    if (!cnt.atBottom && cnt.allowScroll && cnt.hasUserJustInteracted11_ && !cnt.hasUserJustInteracted11_()) {

                      if (typeof nextBrowserTick !== 'function') {
                        cnt.scrollToBottom_();
                        Promise.resolve().then(() => {
                          if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                          if (!cnt.canScrollToBottom_()) cnt.scrollToBottom_();
                        });
                      } else {
                        nextBrowserTick(() => {
                          if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                          cnt.scrollToBottom_();
                        });
                      }

                    }
                  }

                  ff();


                  Promise.resolve().then(ff);

                  // requestAnimationFrame(ff);
                } else if (true) { // it might not be sticky to bottom when there is a full refresh.

                  const knt = cnt;
                  if (!scrollChatFn) {
                    const cnt = knt;
                    const f = () => {
                      const itemScroller = cnt.itemScroller;
                      if (!itemScroller || itemScroller.isConnected === false || cnt.isAttached === false) return;
                      if (!cnt.atBottom) {
                        cnt.scrollToBottom_();
                      } else if (itemScroller.scrollTop === 0) { // not yet interacted by user; cannot stick to bottom
                        itemScroller.scrollTop = itemScroller.scrollHeight;
                      }
                    };
                    if (typeof nextBrowserTick !== 'function') {
                      scrollChatFn = () => Promise.resolve().then(f).then(f);
                    } else {
                      scrollChatFn = () => nextBrowserTick(f);
                    }
                  }

                  scrollChatFn();
                }

                return 1;


              } catch (e) {
                console.warn(e);
              }
            }

            mclp.flushActiveItems77_ = function () {

              return new Promise(resResolve => {
                try {
                  const cnt = this;
                  if (mlf > 1e9) mlf = 9;
                  let tid = ++mlf;
                  const hostElement = cnt.hostElement || cnt;
                  if (tid !== mlf || cnt.isAttached === false || hostElement.isConnected === false) return resResolve();
                  if (!cnt.activeItems_ || cnt.activeItems_.length === 0) return resResolve();

                  // 4 times to maxItems to avoid frequent trimming.
                  // 1 ... 10 ... 20 ... 30 ... 40 ... 50 ... 60 => 16 ... 20 ... 30 ..... 60 ... => 16

                  const lockedMaxItemsToDisplay = this.data.maxItemsToDisplay944;
                  this.activeItems_.length > lockedMaxItemsToDisplay * 4 && lockedMaxItemsToDisplay > 4 && this.activeItems_.splice(0, this.activeItems_.length - lockedMaxItemsToDisplay - 1);
                  if (cnt.canScrollToBottom_()) {
                    cnt.mutexPromiseFA78 = (cnt.mutexPromiseFA78 || Promise.resolve())
                      .then(() => cnt.flushActiveItems78_(tid)) // async function
                      .then((asyncResult) => {
                        resResolve(asyncResult); // either undefined or 1
                        resResolve = null;
                      }).catch((e) => {
                        console.warn(e);
                        if (resResolve) resResolve();
                      });
                  } else {
                    resResolve(2);
                    resResolve = null;
                  }
                } catch (e) {
                  console.warn(e);
                  if (resResolve) resResolve();
                }


              });

            }

            mclp.flushActiveItems_ = function () {
              const cnt = this;

              if (arguments.length !== 0 || !cnt.activeItems_ || !cnt.canScrollToBottom_) return cnt.flushActiveItems66_.apply(this, arguments);

              if (cnt.activeItems_.length === 0) {
                cnt.__intermediate_delay__ = null;
                return;
              }

              const cntData = ((cnt || 0).data || 0);
              if (cntData.maxItemsToDisplay944 === undefined) {
                cntData.maxItemsToDisplay944 = null;
                if (cntData.maxItemsToDisplay > MAX_ITEMS_FOR_TOTAL_DISPLAY) cntData.maxItemsToDisplay = MAX_ITEMS_FOR_TOTAL_DISPLAY;
                cntData.maxItemsToDisplay944 = cntData.maxItemsToDisplay || null;
              }

              // ignore previous __intermediate_delay__ and create a new one
              cnt.__intermediate_delay__ = new Promise(resolve => {
                cnt.flushActiveItems77_().then(rt => {  // either undefined or 1 or 2
                  if (rt === 1) {
                    resolve(1); // success, scroll to bottom
                    if (hasMoreMessageState === 1) {
                      hasMoreMessageState = 0;
                      const showMore = (cnt.$ || 0)['show-more'];
                      if (showMore) {
                        showMore.classList.remove('has-new-messages-miuzp');
                      }
                    }
                  }
                  else if (rt === 2) {
                    resolve(2); // success, trim
                    if (hasMoreMessageState === 0) {
                      hasMoreMessageState = 1;
                      const showMore = cnt.$['show-more'];
                      if (showMore) {
                        showMore.classList.add('has-new-messages-miuzp');
                      }
                    }
                  }
                  else resolve(-1); // skip
                }).catch(e => {
                  console.warn(e);
                });
              });

            }
            console.log("flushActiveItems_", "OK");
          } else {
            console.log("flushActiveItems_", "NG");
          }
        }

        if ((_flag0281_ & 0x40) == 0) {

          if (ENABLE_NO_SMOOTH_TRANSFORM && SUPPRESS_refreshOffsetContainerHeight_ && typeof mclp.refreshOffsetContainerHeight_ === 'function' && !mclp.refreshOffsetContainerHeight26_ && mclp.refreshOffsetContainerHeight_.length === 0) {
            assertor(() => fnIntegrity(mclp.refreshOffsetContainerHeight_, '0.31.21'));
            mclp.refreshOffsetContainerHeight26_ = mclp.refreshOffsetContainerHeight_;
            mclp.refreshOffsetContainerHeight_ = function () {
              // var a = this.itemScroller.clientHeight;
              // this.itemOffset.style.height = this.items.clientHeight + "px";
              // this.bottomAlignMessages && (this.itemOffset.style.minHeight = a + "px")
            }
            console.log("refreshOffsetContainerHeight_", "OK");
          } else {
            console.log("refreshOffsetContainerHeight_", "NG");
          }

        }

        if ((_flag0281_ & 0x80) == 0) {
          mclp.delayFlushActiveItemsAfterUserAction11_ = async function () {
            try {
              if (mlg > 1e9) mlg = 9;
              const tid = ++mlg;
              const keepTrialCond = () => this.atBottom && this.allowScroll && (tid === mlg) && this.isAttached === true && this.activeItems_.length >= 1 && (this.hostElement || 0).isConnected === true;
              const runCond = () => this.canScrollToBottom_();
              if (!keepTrialCond()) return;
              if (runCond()) return this.flushActiveItems_() | 1; // avoid return promise
              await new Promise(r => setTimeout(r, 80));
              if (!keepTrialCond()) return;
              if (runCond()) return this.flushActiveItems_() | 1;
              await iAFP(this.hostElement).then();
              // await new Promise(requestAnimationFrame);
              if (runCond()) return this.flushActiveItems_() | 1;
            } catch (e) {
              console.warn(e);
            }
          }
        }

        if ((_flag0281_ & 0x40) == 0 ) {

          if( (mclp.atBottomChanged_ || 0).length === 0) {
            // note: if the scrolling is too frequent, the show more visibility might get wrong.





            const sfi = fnIntegrity(mclp.atBottomChanged_);

            if(sfi === '0.75.37'){
              // https://www.youtube.com/s/desktop/f7495da0/jsbin/live_chat_polymer.vflset/live_chat_polymer.js


              // Dec 2024.

              /**
               * 
               * 
                          
                  f.atBottomChanged_ = function() {
                      var a = this;
                      this.atBottom ? this.hideShowMoreAsync_ || (this.hideShowMoreAsync_ = Zu(function() {
                          R(a.hostElement).querySelector("#show-more").style.visibility = "hidden"
                      }, 200)) : (this.hideShowMoreAsync_ && $u(this.hideShowMoreAsync_),
                      this.hideShowMoreAsync_ = null,
                      R(this.hostElement).querySelector("#show-more").style.visibility = "visible")
                  }
              * 
              */

            } else {
              assertor(() => fnIntegrity(mclp.atBottomChanged_, '0.75.37'));
            }


            const querySelector = HTMLElement.prototype.querySelector;
            const U = (element) => ({
              querySelector: (selector) => querySelector.call(element, selector)
            });

            let qid = 0;
            mclp.__updateButtonVisibility371__ = function (button) {
              Promise.resolve(this).then((cnt) => {
                button.style.visibility = cnt.__buttonVisibility371__;
              });
            }
            const fixButtonOnClick = function (cnt, button) {
              button.addEventListener('click', (evt) => {
                evt.stopImmediatePropagation();
                evt.stopPropagation();
                evt.preventDefault();
                Promise.resolve(cnt).then((cnt) => {
                  cnt.scrollToBottom_();
                });
              }, true);
              // button.addEventListener('pointerup', (evt)=>{
              //   evt.stopImmediatePropagation();
              //   evt.stopPropagation();
              // }, true);
              // button.addEventListener('mouseup', (evt)=>{
              //   evt.stopImmediatePropagation();
              //   evt.stopPropagation();
              // }, true);
            }
            mclp.atBottomChanged_ = function () {
              let a = this.atBottom;
              const button = (this.$ || 0)['show-more'];
              if (button) {
                // primary execution
                if (a) {
                  if (this.__buttonVisibility371__ !== "hidden") {
                    this.__buttonVisibility371__ = "hidden";
                    if (!this.hideShowMoreAsync_) {
                      const tid = ++qid;
                      this.hideShowMoreAsync_ = foregroundPromiseFn().then(() => {
                        if (tid !== qid) {
                          return;
                        }
                        this.__updateButtonVisibility371__(button);
                      });
                    }
                  }
                } else {
                  if (this.__buttonVisibility371__ !== "visible") {
                    this.__buttonVisibility371__ = "visible";
                    if (this.hideShowMoreAsync_) {
                      qid++;
                    }
                    this.hideShowMoreAsync_ = null;
                    if (!button.__fix_onclick__) {
                      button.__fix_onclick__ = true;
                      fixButtonOnClick(this, button);
                    }
                    this.__updateButtonVisibility371__(button);
                  }
                }
              } else {
                // fallback
                let tid = ++qid;
                let b = this;
                a ? this.hideShowMoreAsync_ || (this.hideShowMoreAsync_ = this.async(function () {
                  if (tid !== qid) return;
                  U(b.hostElement).querySelector("#show-more").style.visibility = "hidden"
                }, 200)) : (this.hideShowMoreAsync_ && this.cancelAsync(this.hideShowMoreAsync_),
                  this.hideShowMoreAsync_ = null,
                  U(this.hostElement).querySelector("#show-more").style.visibility = "visible")
              }
            }

            console.log("atBottomChanged_", "OK");

          } else if ((mclp.atBottomChanged_ || 0).length === 1) {
            // note: if the scrolling is too frequent, the show more visibility might get wrong.

            const sfi = fnIntegrity(mclp.atBottomChanged_);
            if (sfi === '1.73.37') {
              // https://www.youtube.com/s/desktop/e4d15d2c/jsbin/live_chat_polymer.vflset/live_chat_polymer.js

              /**
               * 
               * 
               * 
                          
                  f.atBottomChanged_ = function(a) {
                      var b = this;
                      a ? this.hideShowMoreAsync_ || (this.hideShowMoreAsync_ = zQ(function() {
                          T(b.hostElement).querySelector("#show-more").style.visibility = "hidden"
                      }, 200)) : (this.hideShowMoreAsync_ && AQ(this.hideShowMoreAsync_), 
                      this.hideShowMoreAsync_ = null, 
                      T(this.hostElement).querySelector("#show-more").style.visibility = "visible")
                  };

              * 
               * 
               */


            } else if (sfi === '1.75.39') {
              // e.g. https://www.youtube.com/yts/jsbin/live_chat_polymer-vflCyWEBP/live_chat_polymer.js
            } else {
              assertor(() => fnIntegrity(mclp.atBottomChanged_, '1.73.37'));
            }

            const querySelector = HTMLElement.prototype.querySelector;
            const U = (element) => ({
              querySelector: (selector) => querySelector.call(element, selector)
            });

            let qid = 0;
            mclp.__updateButtonVisibility371__ = function (button) {
              Promise.resolve(this).then((cnt) => {
                button.style.visibility = cnt.__buttonVisibility371__;
              });
            }
            const fixButtonOnClick = function (cnt, button) {
              button.addEventListener('click', (evt) => {
                evt.stopImmediatePropagation();
                evt.stopPropagation();
                evt.preventDefault();
                Promise.resolve(cnt).then((cnt) => {
                  cnt.scrollToBottom_();
                });
              }, true);
              // button.addEventListener('pointerup', (evt)=>{
              //   evt.stopImmediatePropagation();
              //   evt.stopPropagation();
              // }, true);
              // button.addEventListener('mouseup', (evt)=>{
              //   evt.stopImmediatePropagation();
              //   evt.stopPropagation();
              // }, true);
            }
            mclp.atBottomChanged_ = function (a) {
              const button = (this.$ || 0)['show-more'];
              if (button) {
                // primary execution
                if (a) {
                  if (this.__buttonVisibility371__ !== "hidden") {
                    this.__buttonVisibility371__ = "hidden";
                    if (!this.hideShowMoreAsync_) {
                      const tid = ++qid;
                      this.hideShowMoreAsync_ = foregroundPromiseFn().then(() => {
                        if (tid !== qid) {
                          return;
                        }
                        this.__updateButtonVisibility371__(button);
                      });
                    }
                  }
                } else {
                  if (this.__buttonVisibility371__ !== "visible") {
                    this.__buttonVisibility371__ = "visible";
                    if (this.hideShowMoreAsync_) {
                      qid++;
                    }
                    this.hideShowMoreAsync_ = null;
                    if (!button.__fix_onclick__) {
                      button.__fix_onclick__ = true;
                      fixButtonOnClick(this, button);
                    }
                    this.__updateButtonVisibility371__(button);
                  }
                }
              } else {
                // fallback
                let tid = ++qid;
                let b = this;
                a ? this.hideShowMoreAsync_ || (this.hideShowMoreAsync_ = this.async(function () {
                  if (tid !== qid) return;
                  U(b.hostElement).querySelector("#show-more").style.visibility = "hidden"
                }, 200)) : (this.hideShowMoreAsync_ && this.cancelAsync(this.hideShowMoreAsync_),
                  this.hideShowMoreAsync_ = null,
                  U(this.hostElement).querySelector("#show-more").style.visibility = "visible")
              }
            }

            console.log("atBottomChanged_", "OK");
          } else {
            console.log("atBottomChanged_", "NG");
          }
        }


        if ((_flag0281_ & 0x2) == 0) {
          if ((mclp.onScrollItems_ || 0).length === 1) {

            assertor(() => fnIntegrity(mclp.onScrollItems_, '1.17.9'));
            mclp.onScrollItems66_ = mclp.onScrollItems_;
            mclp.onScrollItems77_ = async function (evt) {
              if (myw > 1e9) myw = 9;
              let tid = ++myw;

              await iAFP(this.hostElement).then();
              // await new Promise(requestAnimationFrame);

              if (tid !== myw) {
                return;
              }

              const cnt = this;

              await Promise.resolve();
              if (USE_OPTIMIZED_ON_SCROLL_ITEMS) {
                const onScrollItemsBasicOnly_ = !!((cnt.__notRequired__ || 0) & 512);
                await Promise.resolve().then(() => {
                  this.ytRendererBehavior.onScroll(evt);
                }).then(() => {
                  if (onScrollItemsBasicOnly_) return;
                  if (this.canScrollToBottom_()) {
                    const hasUserJustInteracted = this.hasUserJustInteracted11_ ? this.hasUserJustInteracted11_() : true;
                    if (hasUserJustInteracted) {
                      // only when there is an user action
                      !((cnt.__notRequired__ || 0) & 256) && this.setAtBottom();
                      return 1;
                    }
                  } else {
                    // no message inserting
                    !((cnt.__notRequired__ || 0) & 256) && this.setAtBottom();
                    return 1;
                  }
                }).then((r) => {

                  if (onScrollItemsBasicOnly_) return;
                  if (this.activeItems_.length) {

                    if (this.canScrollToBottom_()) {
                      this.flushActiveItems_();
                      return 1 && r;
                    } else if (this.atBottom && this.allowScroll && (this.hasUserJustInteracted11_ && this.hasUserJustInteracted11_())) {
                      // delayed due to user action
                      this.delayFlushActiveItemsAfterUserAction11_ && this.delayFlushActiveItemsAfterUserAction11_();
                      return 0;
                    }
                  }
                }).then((r) => {
                  if (onScrollItemsBasicOnly_) return;
                  if (r) {
                    // ensure setAtBottom is correctly set
                    !((cnt.__notRequired__ || 0) & 256) && this.setAtBottom();
                  }
                });
              } else {
                cnt.onScrollItems66_(evt);
              }

              await Promise.resolve();

            }

            mclp.onScrollItems_ = function (evt) {

              const cnt = this;
              cnt.__intermediate_delay__ = new Promise(resolve => {
                cnt.onScrollItems77_(evt).then(() => {
                  resolve();
                });
              });
            }
            console.log("onScrollItems_", "OK");
          } else {
            console.log("onScrollItems_", "NG");
          }
        }

        if ((_flag0281_ & 0x2) == 0) {
          if ((mclp.handleLiveChatActions_ || 0).length === 1) {

            const sfi = fnIntegrity(mclp.handleLiveChatActions_);
            if (sfi === '1.39.20') {
              // TBC
            } else if (sfi === '1.31.17') {
              // original
            } else {
              assertor(() => fnIntegrity(mclp.handleLiveChatActions_, '1.31.17'));
            }

            mclp.handleLiveChatActions66_ = mclp.handleLiveChatActions_;

            mclp.handleLiveChatActions77_ = async function (arr) {
              if (typeof (arr || 0).length !== 'number') {
                this.handleLiveChatActions66_(arr);
                return;
              }
              if (mzt > 1e9) mzt = 9;
              let tid = ++mzt;

              if (zarr === null) zarr = arr;
              else Array.prototype.push.apply(zarr, arr);
              arr = null;

              await iAFP(this.hostElement).then();
              // await new Promise(requestAnimationFrame);

              if (tid !== mzt || zarr === null) {
                return;
              }

              const carr = zarr;
              zarr = null;

              await Promise.resolve();
              this.handleLiveChatActions66_(carr);
              await Promise.resolve();

            }

            mclp.handleLiveChatActions_ = function (arr) {


              const mapper = new Map();

              // without delaying. get the time of request 
              // (both streaming and replay, but replay relys on progress update so background operation is suppressed)
              const ct = Date.now();
              for (let j = 0, l = arr.length; j < l; j++) {
                const aItem = arr[j];
                if (!aItem || typeof aItem !== 'object') continue;
                const key = firstObjectKey(aItem); // addLiveChatTickerItemAction
                if (!key) continue;
                let obj = aItem[key];
                if (!obj || typeof obj !== 'object') continue;

                if (typeof (obj.item || 0) == 'object' && firstObjectKey(obj) === 'item') {
                  obj = obj.item;
                  const key = firstObjectKey(obj);
                  if (key) {
                    obj = obj[key];
                  }
                }
                if (obj.id && !obj.__timestampActionRequest__) {
                  obj.__timestampActionRequest__ = ct;
                }

                if (obj.id && obj.__timestampActionRequest__ > 0 && obj.durationSec > 0 && obj.fullDurationSec) {

                  mapper.set(aItem, __timestampActionRequest__ - (obj.fullDurationSec - obj.durationSec) * 1000);


                }

              }

              if (mapper.size > 1) {

                // sort ticker
                let mArr1 = arr.filter(aItem => {

                  if (mapper.has(aItem)) return true;
                  return false;

                });

                let mArr2 = mArr1.slice(0).sort((a, b) => {
                  return mapper.get(a) - mapper.get(b);
                });


                // console.log(948701, arr);
                arr = arr.map(aItem => {
                  const idx = mArr1.indexOf(aItem);
                  if (idx < 0) return aItem;
                  return mArr2[idx];
                });
                // console.log(948702, arr);

              }



              // console.log(1929, cnt.activeItems_)
              // console.log(9487, arr);

              const cnt = this;
              cnt.__intermediate_delay__ = new Promise(resolve => {
                cnt.handleLiveChatActions77_(arr).then(() => {
                  resolve();
                });
              });

              Promise.resolve().then(resitanceUpdateFn);
            }
            console.log("handleLiveChatActions_", "OK");
          } else {
            console.log("handleLiveChatActions_", "NG");
          }
        }

        mclp.hasUserJustInteracted11_ = () => {
          const t = dateNow();
          return (t - lastWheel < 80) || currentMouseDown || currentTouchDown || (t - lastUserInteraction < 80);
        }

        if ((mclp.canScrollToBottom_ || 0).length === 0) {

          assertor(() => fnIntegrity(mclp.canScrollToBottom_, '0.9.5'));

          mclp.canScrollToBottom_ = function () {
            return this.atBottom && this.allowScroll && !this.hasUserJustInteracted11_();
          }

          console.log("canScrollToBottom_", "OK");
        } else {
          console.log("canScrollToBottom_", "NG");
        }

        if (ENABLE_NO_SMOOTH_TRANSFORM) {

          mclp.isSmoothScrollEnabled_ = function () {
            return false;
          }

          mclp.maybeResizeScrollContainer_ = function () {
            //
          }

          mclp.refreshOffsetContainerHeight_ = function () {
            //
          }

          mclp.smoothScroll_ = function () {
            //
          }

          mclp.resetSmoothScroll_ = function () {
            //
          }
          console.log("ENABLE_NO_SMOOTH_TRANSFORM", "OK");
        } else {
          console.log("ENABLE_NO_SMOOTH_TRANSFORM", "NG");
        }

        if ((_flag0281_ & 0x8) == 0) {


          if (typeof mclp.forEachItem_ === 'function' && !mclp.forEachItem66_ && skipErrorForhandleAddChatItemAction_ && mclp.forEachItem_.length === 1) {

            mclp.forEachItem66_ = mclp.forEachItem_;
            mclp.forEachItem_ = function (a) {

              if ((this._flag0281_ & 0x8) == 0x8) return this.forEachItem66_(a);

              // ƒ (a){this.visibleItems.forEach(a.bind(this,"visibleItems"));this.activeItems_.forEach(a.bind(this,"activeItems_"))}

              try {

                let items801 = false;
                if (typeof a === 'function') {
                  const items = this.items;
                  if (items instanceof HTMLDivElement) {
                    const ev = this.visibleItems;
                    const ea = this.activeItems_;
                    if (ev && ea && ev.length >= 0 && ea.length >= 0) {
                      items801 = items;
                    }
                  }
                }

                if (items801) {
                  items801.__children801__ = 1;
                  const res = this.forEachItem66_(a);
                  items801.__children801__ = 0;
                  return res;
                }

              } catch (e) { }
              return this.forEachItem66_(a);


              // this.visibleItems.forEach((val, idx, arr)=>{
              //   a.call(this, 'visibleItems', val, idx, arr);
              // });

              // this.activeItems_.forEach((val, idx, arr)=>{
              //   a.call(this, 'activeItems_', val, idx, arr);
              // });



            }


          }

        }

        if (typeof mclp.handleAddChatItemAction_ === 'function' && !mclp.handleAddChatItemAction66_ && FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION && (EMOJI_IMAGE_SINGLE_THUMBNAIL || AUTHOR_PHOTO_SINGLE_THUMBNAIL)) {

          mclp.handleAddChatItemAction66_ = mclp.handleAddChatItemAction_;
          mclp.handleAddChatItemAction_ = function (a) {
            try {
              if (a && typeof a === 'object' && !('length' in a)) {
                fixLiveChatItem(a.item, null);
                console.assert(arguments[0] === a);
              }
            } catch (e) { console.warn(e) }
            let res;
            if (skipErrorForhandleAddChatItemAction_) { // YouTube Native Engine Issue
              try {
                res = this.handleAddChatItemAction66_.apply(this, arguments);
              } catch (e) {
                if (e && (e.message || '').includes('.querySelector(')) {
                  console.log("skipErrorForhandleAddChatItemAction_", e.message);
                } else {
                  throw e;
                }
              }
            } else {
              res = this.handleAddChatItemAction66_.apply(this, arguments);
            }
            return res;
          }

          if (FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION) console.log("handleAddChatItemAction_ [ FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION ]", "OK");
        } else {

          if (FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION) console.log("handleAddChatItemAction_ [ FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION ]", "OK");
        }


        if (typeof mclp.handleReplaceChatItemAction_ === 'function' && !mclp.handleReplaceChatItemAction66_ && FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT && (EMOJI_IMAGE_SINGLE_THUMBNAIL || AUTHOR_PHOTO_SINGLE_THUMBNAIL)) {

          mclp.handleReplaceChatItemAction66_ = mclp.handleReplaceChatItemAction_;
          mclp.handleReplaceChatItemAction_ = function (a) {
            try {
              if (a && typeof a === 'object' && !('length' in a)) {
                fixLiveChatItem(a.replacementItem, null);
                console.assert(arguments[0] === a);
              }
            } catch (e) { console.warn(e) }
            return this.handleReplaceChatItemAction66_.apply(this, arguments);
          }

          if (FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT) console.log("handleReplaceChatItemAction_ [ FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT ]", "OK");
        } else {

          if (FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT) console.log("handleReplaceChatItemAction_ [ FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT ]", "OK");
        }

        console.log("[End]");
        console.groupEnd();

      }).catch(console.warn);


      const tickerContainerSetAttribute = function (attrName, attrValue) { // ensure '14.30000001%'.toFixed(1)

        let yd = (this.__dataHost || insp(this).__dataHost || 0).__data;

        if (arguments.length === 2 && attrName === 'style' && yd && attrValue) {

          // let v = yd.containerStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_;
          let v = `${attrValue}`;
          // conside a ticker is 101px width
          // 1% = 1.01px
          // 0.2% = 0.202px


          const ratio1 = (yd.ratio * 100);
          if (ratio1 > -1) { // avoid NaN

            // countdownDurationMs
            // 600000 - 0.2%    <1% = 6s>  <0.2% = 1.2s>
            // 300000 - 0.5%    <1% = 3s>  <0.5% = 1.5s>
            // 150000 - 1%    <1% = 1.5s>
            // 75000 - 2%    <1% =0.75s > <2% = 1.5s>
            // 30000 - 5%    <1% =0.3s > <5% = 1.5s>

            // 99px * 5% = 4.95px

            // 15000 - 10%    <1% =0.15s > <10% = 1.5s>


            // 1% Duration

            let ratio2 = ratio1;

            const ydd = yd.data;
            if (ydd) {

              const d1 = ydd.durationSec;
              const d2 = ydd.fullDurationSec;

              // @ step timing [min. 0.2%]
              let numOfSteps = 500;
              if ((d1 === d2 || (d1 + 1 === d2)) && d1 > 1) {
                if (d2 > 400) numOfSteps = 500; // 0.2%
                else if (d2 > 200) numOfSteps = 200; // 0.5%
                else if (d2 > 100) numOfSteps = 100; // 1%
                else if (d2 > 50) numOfSteps = 50; // 2%
                else if (d2 > 25) numOfSteps = 20; // 5% (max => 99px * 5% = 4.95px)
                else numOfSteps = 20;
              }
              if (numOfSteps > TICKER_MAX_STEPS_LIMIT) numOfSteps = TICKER_MAX_STEPS_LIMIT;
              if (numOfSteps < 5) numOfSteps = 5;

              const rd = numOfSteps / 100.0;

              ratio2 = Math.round(ratio2 * rd) / rd;

              // ratio2 = Math.round(ratio2 * 5) / 5;
              ratio2 = ratio2.toFixed(1);
              v = v.replace(`${ratio1}%`, `${ratio2}%`).replace(`${ratio1}%`, `${ratio2}%`);

              if (yd.__style_last__ === v) return;
              yd.__style_last__ = v;
              // do not consider any delay here.
              // it shall be inside the looping for all properties changes. all the css background ops are in the same microtask.

            }
          }

          HTMLElement.prototype.setAttribute.call(dr(this), attrName, v);


        } else {
          HTMLElement.prototype.setAttribute.apply(dr(this), arguments);
        }

      };


      const fpTicker = (renderer) => {
        if (FLAG_001a) return;
        const cnt = insp(renderer);
        assertor(() => typeof (cnt || 0).is === 'string');
        assertor(() => ((cnt || 0).hostElement || 0).nodeType === 1);
        const container = (cnt.$ || 0).container;
        if (container) {
          assertor(() => (container || 0).nodeType === 1);
          assertor(() => typeof container.setAttribute === 'function');
          container.setAttribute = tickerContainerSetAttribute;
        } else {
          console.warn(`"container" does not exist in ${cnt.is}`);
        }
      };


      const tags = [
        "yt-live-chat-ticker-renderer",
        "yt-live-chat-ticker-paid-message-item-renderer",
        "yt-live-chat-ticker-paid-sticker-item-renderer",
        "yt-live-chat-ticker-sponsor-item-renderer"
      ];

      const tagsItemRenderer = [
        "yt-live-chat-ticker-renderer",
        "yt-live-chat-ticker-paid-message-item-renderer",
        "yt-live-chat-ticker-paid-sticker-item-renderer",
        "yt-live-chat-ticker-sponsor-item-renderer"
      ];

      const wmList = new Set;
      if (DEBUG_wmList) {

        setInterval(() => {
          let q = document.querySelector('#label-text');
          if(!q) return;
          const size = new Set([...wmList].filter(e => e?.deref()?.isConnected === false).map(e => e?.deref())).size;
          q.textContent = `${48833}, ${DEBUG_wmList_started}, ${size}`;

          // console.log(48833, )
        }, 100);
      }


      /*
            Promise.all(tags.map(tag => customElements.whenDefined(tag))).then(() => {
      
      
              const dProto = {
      
                detachedForTickerInit: function () {
      
                  try {
      
                    this.actionHandlerBehavior.unregisterActionMap(this.behaviorActionMap)
      
                    // this.behaviorActionMap = 0;
                    // this.isVisibilityRoot = 0;
      
      
                  } catch (e) { }
      
      
                  return this.detached582MemoryLeak();
                },
      
                attachedForTickerInit: function () {
                  wmList.add(new WeakRef(this))
      
                  // fpTicker(this.hostElement || this);
                  return this.attached77();
      
                },
      
      
              }
      
      
              for (const tag of tagsItemRenderer) { // ##tag##
                const dummy = document.createElement(tag);
      
                const cProto = getProto(dummy);
                if (!cProto || !cProto.attached) {
                  console.warn(`proto.attached for ${tag} is unavailable.`);
                  continue;
                }
      
                if (FIX_MEMORY_LEAKAGE_TICKER_ACTIONMAP && typeof cProto.detached582MemoryLeak !== 'function' && typeof cProto.detached === 'function') {
                  cProto.detached582MemoryLeak = cProto.detached;
                  cProto.detached = cProto.detachedForTickerInit;
                }
      
                cProto.attached77 = cProto.attached;
      
                cProto.attached = dProto.attachedForTickerInit;
      
      
              }
      
            });
            */


            
      Promise.all(tags.map(tag => customElements.whenDefined(tag))).then(() => {

        if (FLAG_001b) return;
        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-ticker-... hacks");
        console.log("[Begin]");

        let dummyValueForStyleReturn = null;

        const genDummyValueForStyleReturn = () => {
          let s = `--nx:82;`
          let ro = {
            "privateDoNotAccessOrElseSafeStyleWrappedValue_": s,
            "implementsGoogStringTypedString": true
          };
          ro.getTypedStringValue = ro.toString = function () { return this.privateDoNotAccessOrElseSafeStyleWrappedValue_ };
          return ro;
        }

        let isCSSPropertySupported_ = null;
        const isCSSPropertySupported = () => {

          // @property --ticker-rtime

          if (typeof isCSSPropertySupported_ === 'boolean') return isCSSPropertySupported_;
          isCSSPropertySupported_ = false;

          if (typeof CSS !== 'object' || typeof (CSS || 0).registerProperty !== 'function') return false;
          const documentElement = document.documentElement;
          if (!documentElement) {
            console.warn('document.documentElement is not found');
            return false;
          }
          if (`${getComputedStyleCached(documentElement).getPropertyValue('--ticker-rtime')}`.length === 0) {
            return false;
          }

          const ae = animate.call(documentElement,
            [
              { '--ticker-rtime': '70%' },
              { '--ticker-rtime': '30%' }
            ],
            {
              fill: "forwards",
              duration: 1000 * 40,
              easing: 'linear'
            }
          );

          let animatedValue = getComputedStyleCached(document.documentElement).getPropertyValue('--ticker-rtime');
          ae.finish();
          if (`${animatedValue}`.length !== 3) return false;

          isCSSPropertySupported_ = true;
          return true;

        };

        let tickerAttachmentId = 0;

        let windowShownAt = -1;
        const setupEventForWindowShownAt = () => {
          window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') windowShownAt = Date.now();
            else windowShownAt = 0;
          }, false);
        }

        const __requestRemoval__ = function (cnt) {
          if (cnt.hostElement && typeof cnt.requestRemoval === 'function') {
            try {
              const id = (cnt.data || 0).id;
              if (!id) cnt.data = { id: 1 };
            } catch (e) { }
            try {
              cnt.requestRemoval();
              return true;
            } catch (e) { }
          }
          return false;
        }



        const dProto = {


            /**
             * 

    f.updateStatsBarAndMaybeShowAnimation = function(a, b, c) {
        var d = this;
        a || c();
        a && this.statsBar && this.username && this.textContent && (this.isMouseOver ? (b(),
        c()) : (a = this.animateShowStats(),
        this.data.animationOrigin && this.data.trackingParams && aB().stateChanged(this.data.trackingParams, {
            animationEventData: {
                origin: this.data.animationOrigin
            }
        }),
        a.finished.then(function() {
            var e;
            setTimeout(function() {
                b();
                c();
                if (!d.isMouseOver) {
                    var g, k;
                    d.animateHideStats(((g = d.data) == null ? void 0 : g.dynamicStateData.stateSlideDurationMs) || 0, ((k = d.data) == null ? void 0 : k.dynamicStateData.stateUpdateDelayAfterMs) || 0)
                }
            }, ((e = d.data) == null ? void 0 : e.dynamicStateData.stateUpdateDelayBeforeMs) || 0)
        })))
    }

             * 
             */



        /**
         * 
         * 

    f.animateShowStats = function() {
        var a = this.textContent.animate({
            transform: "translateY(-30px)"
        }, {
            duration: this.data.dynamicStateData.stateSlideDurationMs,
            fill: "forwards"
        });
        this.username.animate({
            opacity: 0
        }, {
            duration: 500,
            fill: "forwards"
        });
        this.statsBar.animate({
            opacity: 1
        }, {
            duration: 500,
            fill: "forwards"
        });
        return a
    }
    ;
    f.animateHideStats = function(a, b) {
        this.textContent.animate({
            transform: "translateY(0)"
        }, {
            duration: a,
            fill: "forwards",
            delay: b
        });
        this.username.animate({
            opacity: 1
        }, {
            duration: 300,
            fill: "forwards",
            delay: b
        });
        this.statsBar.animate({
            opacity: 0
        }, {
            duration: 300,
            fill: "forwards",
            delay: b
        })
    }
         * 
         */
        
          updateStatsBarAndMaybeShowAnimationRevised: function (a, b, c) {
            // prevent memory leakage due to d.data was asked in  a.finished.then
            try{
              // console.log('updateStatsBarAndMaybeShowAnimation called', this.is)
              if (!this.__proxySelf0__) this.__proxySelf0__ = weakWrap(this);
              return this.updateStatsBarAndMaybeShowAnimation38.call(this.__proxySelf0__, a, b, c);
            }catch(e){
              console.log('updateStatsBarAndMaybeShowAnimationRevised ERROR');
              console.error(e);
            }
          },

          detachedForMemoryLeakage: function () {

            try{
  
              this.actionHandlerBehavior.unregisterActionMap(this.behaviorActionMap)
              
              // this.behaviorActionMap = 0;
              // this.isVisibilityRoot = 0;
  
  
            }catch(e){}
          
            return this.detached582MemoryLeak();
          },

          detachedForTickerInit: function () {

            Promise.resolve(this).then((cnt) => {
              if (cnt.isAttached) return;
              cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false && __requestRemoval__(cnt);
              cnt.rafId > 1 && rafHub.cancel(cnt.rafId);
            }).catch(console.warn);

            let r;
            try {
              r = this.detached77();
            } catch (e) {
              console.warn(e);
            }
            this.__ticker_attachmentId__ = 0;
            return r;
          },

          attachedForTickerInit: function () {
            if (tickerAttachmentId > 1e9) tickerAttachmentId = 9;
            this.__ticker_attachmentId__ = ++tickerAttachmentId;

            DEBUG_wmList && wmList.add(new WeakRef(this))
            if (DEBUG_wmList && !DEBUG_wmList_started) {
              console.log('!!!!!!!!!!!!! DEBUG_wmList_started !!!!!!!!!')
              DEBUG_wmList_started = 1;
            }

            fpTicker(this.hostElement || this);
            return this.attached77();

          },


          // doAnimator

          _makeAnimator: function () {
            if (this._r782) return;
            // if (!this.isAttached) return;
            if (!this._runnerAE) {
              /** @type {HTMLElement | null} */
              const aElement = (this.$ || 0).container;
              if (!aElement) return console.warn("this.$.container is undefined");
              const da = this.data;
              if (!da || !da.startBackgroundColor || !da.endBackgroundColor) return console.warn("this.data is undefined or incorrect");
              const c1 = this.colorFromDecimal(da.startBackgroundColor);
              const c2 = this.colorFromDecimal(da.endBackgroundColor);
              if (typeof c1 !== 'string' || typeof c2 !== 'string') return console.warn('c1, c2 is not a string');

              // if (!this.__tickerBackgroundInitialChecked__) {
              //   this.constructor.prototype.__tickerBackgroundInitialChecked__ = true;
              //   console.log('__tickerBackgroundInitialChecked__')
              //   this._checkTickerBackgroundChanged();
              // }

              aElement.style.setProperty('--ticker-c1', c1);
              aElement.style.setProperty('--ticker-c2', c2);
              aElement.classList.add(runTickerClassName);
              const p = (this.countdownMs / this.countdownDurationMs) * 100;
              // this._aeStartV = this.countdownMs;
              // this._aeStartT = this.countdownDurationMs;
              if (!(p >= 0 && p <= 100)) {
                console.warn('incorrect time ratio', p);
              } else {
                /*
                const u0 = p.toFixed(4) + '%';
                this._runnerAE = animate.call(aElement,
                  [
                    { '--ticker-rtime': u0 },
                    { '--ticker-rtime': '0%' }
                  ]
                  ,
                  {
                    fill: "forwards",
                    duration: this.countdownMs,
                    easing: "linear"
                  }
                );
                */

                let timingFn = 'linear';

                const totalDuration = this.countdownDurationMs;

                if (ATTEMPT_ANIMATED_TICKER_BACKGROUND === 'steps') {

                  // @ step timing [min. 0.2%]
                  let stepInterval = 0.2; // unit: %
                  if (totalDuration > 400000) stepInterval = 0.2;
                  else if (totalDuration > 200000) stepInterval = 0.5;
                  else if (totalDuration > 100000) stepInterval = 1;
                  else if (totalDuration > 50000) stepInterval = 2;
                  else if (totalDuration > 25000) stepInterval = 5;
                  else stepInterval = 5;

                  let numOfSteps = Math.round(100 / stepInterval);

                  if (numOfSteps > TICKER_MAX_STEPS_LIMIT) numOfSteps = TICKER_MAX_STEPS_LIMIT;
                  if (numOfSteps < 5) numOfSteps = 5;

                  timingFn = `steps(${numOfSteps}, end)`;

                }


                /** @type {Animation} */
                const ae = animate.call(aElement,
                  [
                    { '--ticker-rtime': '100%' },
                    { '--ticker-rtime': '0%' }
                  ]
                  ,
                  {
                    fill: "forwards",
                    duration: totalDuration,
                    easing: timingFn
                  }
                );

                this._runnerAE = ae;

                ae.onfinish = (event) => {
                  this.onfinish = null;
                  if (this._runnerAE !== ae) return;
                  if (this.isAttached === true && !this._r782 && ((this.$ || 0).container || 0).isConnected === true) {
                    this._aeFinished(event);
                  }
                }

                let bq = (1.0 - (this.countdownMs / totalDuration)) * totalDuration;

                if (bq >= 0 && bq <= totalDuration) {

                  if (bq > totalDuration - 1) {
                    ae.currentTime = bq;
                    // setTimeout(() => {
                    //   if (this._runnerAE === ae && ae.onfinish) ae.onfinish();
                    // }, 1);
                  } else {
                    ae.currentTime = bq;
                  }
                } else {
                  console.warn('Error on setting _runnerAE.currentTime!');
                }


                aeConstructor = ae.constructor; // constructor is from iframe
                return ae;
              }
            } else {
              if (!aeConstructor) return console.warn('aeConstructor is undefined');
              // assume just time update
              const ae = this._runnerAE;
              if (!(ae instanceof aeConstructor)) return console.warn('this._runnerAE is not Animation');
              if (ae.playState !== 'paused') console.warn('ae.playState !== paused');
              let p = (this.countdownMs / this.countdownDurationMs) * 100;
              if (!(p >= 0 && p <= 100)) {
                console.warn('incorrect time ratio', p);
              } else {
                // let u0 = p.toFixed(4) + '%'
                /*
                ae.effect.setKeyframes([
                  { '--ticker-rtime': u0 },
                  { '--ticker-rtime': '0%' }
                ]);
                ae.effect.updateTiming({ duration: this.countdownMs });
                */
                // ae.currentTime = 0;



                let bq = (1.0 - (this.countdownMs / this.countdownDurationMs)) * this.countdownDurationMs;
                if (bq >= 0 && bq <= this.countdownDurationMs) {

                  this._runnerAE.currentTime = bq
                } else {
                  console.warn('Error on setting _runnerAE.currentTime!');
                }


                ae.play();
                return ae;
              }
            }
          },

          _aeFinished: function (event) {

            if (this._r782) return;

            if (this.isAttached === false && ((this.$ || 0).container || 0).isConnected === false) {
              this._throwOut();
              return;
            }

            if (!this._runnerAE) console.warn('Error in .updateTimeout; this._runnerAE is undefined');

            let lc = window.performance.now();
            this.countdownMs = Math.max(0, this.countdownMs - (lc - this.lastCountdownTimeMs));
            if (this.countdownMs > this.countdownDurationMs) this.countdownMs = this.countdownDurationMs;
            this.lastCountdownTimeMs = this._lastCountdownTimeMsX0 = lc;
            if (this.countdownMs > 76) console.warn('Warning: this.countdownMs is not zero when finished!', this.countdownMs, this, event); // just warning.

            this.countdownMs = 0;
            this.lastCountdownTimeMs = this._lastCountdownTimeMsX0 = null;

            if (this.isAttached) {
              let fastRemoved = false;
              if (Date.now() - windowShownAt < 80 && typeof this.requestRemoval === 'function') {
                // no animation if the video page is switched from background to foreground
                // this.hostElement.style.display = 'none';

                fastRemoved = __requestRemoval__(this);
              }

              if (!fastRemoved) {
                "auto" === this.hostElement.style.width && this.setContainerWidth();
                this.slideDown();
              }
            }



          },


          /** @type {()} */
          _throwOut: function () {
            this._r782 = 1;
            Promise.resolve(this).then((cnt) => {
              __requestRemoval__(cnt);
              cnt.detached();
              if (cnt.__dataClientsReady === true) cnt.__dataClientsReady = false;
              if (cnt.__dataEnabled === true) cnt.__dataEnabled = false;
              if (cnt.__dataReady === true) cnt.__dataReady = false;
              cnt.data = null;
              cnt.countdownMs = 0;
              cnt.lastCountdownTimeMs = null;
              const hm = cnt.hostElement || cnt;
              if (hm.parentNode) hm.remove();
              for (let t; t = hm.firstChild;) t.remove();
            }).catch(e => {
              console.warn(e);
            });
          },


          // doTimerFnModification


          /** @type {(a, b)} */
          startCountdownForTimerFnModA: function (a, b) { // .startCountdown(a.durationSec, a.fullDurationSec)
            try {

              const cnt = kRef(this);
              if (!cnt) return;
              if (!cnt.hostElement) return;

              const attachementId = cnt.__ticker_attachmentId__;
              if(!attachementId) return;

              // a.durationSec [s] => countdownMs [ms]
              // a.fullDurationSec [s] => countdownDurationMs [ms] OR countdownMs [ms]
              // lastCountdownTimeMs => raf ongoing
              // lastCountdownTimeMs = 0 when rafId = 0 OR countdownDurationMs = 0

              if (cnt._r782) return;

              if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
                cnt._throwOut();
                return;
              }

              // TimerFnModA

              b = void 0 === b ? 0 : b;
              if (void 0 !== a) {

                cnt.countdownMs = 1E3 * a; // decreasing from durationSec[s] to zero
                cnt.countdownDurationMs = b ? 1E3 * b : cnt.countdownMs; // constant throughout the animation
                if (!(cnt.lastCountdownTimeMs || cnt.isAnimationPaused)) {
                  cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = performance.now()
                  cnt.rafId = 1
                  if (cnt._runnerAE) console.warn('Error in .startCountdown; cnt._runnerAE already created.')
                    cnt.detlaSincePausedSecs = 0;
                  const ae = cnt._makeAnimator();
                  if (!ae) console.warn('Error in startCountdown._makeAnimator()');

                  // if (playerProgressChangedArg1 === null) {
                  //   console.log('startCountdownForTimerFnModA', cnt.data)
                  // }

                  if (isPlayProgressTriggered && cnt.isAnimationPaused !== true && cnt.__ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED__) {




                    cnt.playerProgressSec = lastPlayerProgress > 0 ? lastPlayerProgress : 0; // save the progress first
                    cnt.isAnimationPaused = true; // trigger isAnimationPausedChanged
                    cnt.detlaSincePausedSecs = 0;
                    cnt._forceNoDetlaSincePausedSecs783 = 1; // reset cnt.detlaSincePausedSecs = 0 when resumed

                    relayPromise = relayPromise || new PromiseExternal();

                    relayPromise.then(() => {

                      const cnt = kRef(this);
                      if (!cnt) return;
                      if (!cnt.hostElement) return;

                      if (attachementId !== cnt.__ticker_attachmentId__) return;
                      
                      if (cnt.isAttached === true && cnt.countdownDurationMs > 0 && cnt.isAnimationPaused === true && cnt.isReplayPaused !== true) {
                        cnt.isAnimationPaused = false;
                      }
                    });


                  }



                }
              }

            } catch (e) {
              console.warn(e);
            }

          },



          /** @type {(a, b)} */
          startCountdownForTimerFnModT: function (a, b) { // .startCountdown(a.durationSec, a.fullDurationSec)

            try {
              const cnt = kRef(this);
              if (!cnt) return;
              if (!cnt.hostElement) return;

              const attachementId = cnt.__ticker_attachmentId__;
              if(!attachementId) return;

              // a.durationSec [s] => countdownMs [ms]
              // a.fullDurationSec [s] => countdownDurationMs [ms] OR countdownMs [ms]
              // lastCountdownTimeMs => raf ongoing
              // lastCountdownTimeMs = 0 when rafId = 0 OR countdownDurationMs = 0

              if (cnt._r782) return;

              if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
                cnt._throwOut();
                return;
              }

              // TimerFnModT

              // console.log('cProto.startCountdown', tag) // yt-live-chat-ticker-sponsor-item-renderer
              if (!cnt.boundUpdateTimeout37_) cnt.boundUpdateTimeout37_ = cnt.updateTimeout.bind(mWeakRef(cnt));
              b = void 0 === b ? 0 : b;
              void 0 !== a && (cnt.countdownMs = 1E3 * a,
                cnt.countdownDurationMs = b ? 1E3 * b : cnt.countdownMs,
                cnt.ratio = 1,
                cnt.lastCountdownTimeMs || cnt.isAnimationPaused || (cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = performance.now(),
                  cnt.rafId = rafHub.request(cnt.boundUpdateTimeout37_)))

            } catch (e) {
              console.warn(e);
            }

          },


          /** @type {(a,)} */
          updateTimeoutForTimerFnModA: function (a) {

            try {
              const cnt = kRef(this);
              if (!cnt) return;
              if (!cnt.hostElement) return; // memory leakage. to be reviewed

              const attachementId = cnt.__ticker_attachmentId__;
              if(!attachementId) return;

              // _lastCountdownTimeMsX0 is required since performance.now() is not fully the same with rAF timestamp

              if (cnt._r782) return;

              if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
                cnt._throwOut();
                return;
              }

              // TimerFnModA

              if (!cnt._runnerAE) console.warn('Error in .updateTimeout; cnt._runnerAE is undefined');
              if (cnt.lastCountdownTimeMs !== cnt._lastCountdownTimeMsX0) {
                cnt.countdownMs = Math.max(0, cnt.countdownMs - (a - (cnt.lastCountdownTimeMs || 0)));
              }
              if (cnt.countdownMs > cnt.countdownDurationMs) cnt.countdownMs = cnt.countdownDurationMs;
              if (cnt.isAttached && cnt.countdownMs) {
                cnt.lastCountdownTimeMs = a
                const ae = cnt._makeAnimator(); // request raf
                if (!ae) console.warn('Error in startCountdown._makeAnimator()');
              } else {
                (cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = null,
                  cnt.isAttached && ("auto" === cnt.hostElement.style.width && cnt.setContainerWidth(),
                    cnt.slideDown()));
              }

            } catch (e) {
              console.warn(e);
            }


          },

          /** @type {(a,)} */
          updateTimeoutForTimerFnModT: function (a) {

            try {
              const cnt = kRef(this);
              if (!cnt) return;
              if (!cnt.hostElement) return; // memory leakage. to be reviewed

              const attachementId = cnt.__ticker_attachmentId__;
              if(!attachementId) return;

              // _lastCountdownTimeMsX0 is required since performance.now() is not fully the same with rAF timestamp

              if (cnt._r782) return;

              if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
                cnt._throwOut();
                return;
              }

              // TimerFnModT

              // console.log('cProto.updateTimeout', tag) // yt-live-chat-ticker-sponsor-item-renderer
              if (!cnt.boundUpdateTimeout37_) cnt.boundUpdateTimeout37_ = cnt.updateTimeout.bind(mWeakRef(cnt));
              if (cnt.lastCountdownTimeMs !== cnt._lastCountdownTimeMsX0) {
                cnt.countdownMs = Math.max(0, cnt.countdownMs - (a - (cnt.lastCountdownTimeMs || 0)));
              }
              // console.log(703, cnt.countdownMs)
              cnt.ratio = cnt.countdownMs / cnt.countdownDurationMs;
              cnt.isAttached && cnt.countdownMs ? (cnt.lastCountdownTimeMs = a,
                cnt.rafId = rafHub.request(cnt.boundUpdateTimeout37_)) : (cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = null,
                  cnt.isAttached && ("auto" === cnt.hostElement.style.width && cnt.setContainerWidth(),
                    cnt.slideDown()))


            } catch (e) {
              console.warn(e);
            }
          },

          /** @type {(a,b)} */
          isAnimationPausedChangedForTimerFnModA: function (a, b) {

            const cnt = kRef(this);
            if (!cnt) return;
            if (!cnt.hostElement) return; // memory leakage. to be reviewed

            const attachementId = cnt.__ticker_attachmentId__;
            if(!attachementId) return;

            if (cnt._r782) return;

            if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
              cnt._throwOut();
              return;
            }
            let forceNoDetlaSincePausedSecs783 = cnt._forceNoDetlaSincePausedSecs783;
            cnt._forceNoDetlaSincePausedSecs783 = 0;

            Promise.resolve(cnt).then((cnt) => {

              if(attachementId !== cnt.__ticker_attachmentId__) return;

              if (a) {

                if (cnt._runnerAE && cnt._runnerAE.playState === 'running') {

                  cnt._runnerAE.pause()
                  let lc = window.performance.now();
                  cnt.countdownMs = Math.max(0, cnt.countdownMs - (lc - cnt.lastCountdownTimeMs));
                  if (cnt.countdownMs > cnt.countdownDurationMs) cnt.countdownMs = cnt.countdownDurationMs;
                  cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = lc;
                }

              } else if (!a && b) {


                if (forceNoDetlaSincePausedSecs783) cnt.detlaSincePausedSecs = 0;
                a = cnt.detlaSincePausedSecs ? (cnt.lastCountdownTimeMs || 0) + 1000 * cnt.detlaSincePausedSecs : (cnt.lastCountdownTimeMs || 0);
                cnt.detlaSincePausedSecs = 0;
                cnt.updateTimeout(a);
                cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = window.performance.now();

              }

              cnt = null;


            }).catch(e => {
              console.log(e);
            });



          },


          /** @type {(a,b)} */
          isAnimationPausedChangedForTimerFnModT: function (a, b) {

            const cnt = kRef(this);
            if (!cnt) return;
            if (!cnt.hostElement) return; // memory leakage. to be reviewed

            const attachementId = cnt.__ticker_attachmentId__;
            if(!attachementId) return;

            if (cnt._r782) return;

            if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
              cnt._throwOut();
              return;
            }
            // let forceNoDetlaSincePausedSecs783 = cnt._forceNoDetlaSincePausedSecs783;
            // cnt._forceNoDetlaSincePausedSecs783 = 0;

            Promise.resolve(cnt).then((cnt) => {

              if(attachementId !== cnt.__ticker_attachmentId__) return;

              // TimerFnModT

              // ez++;
              // if(ez> 1e9) ez=9;
              if (!cnt.boundUpdateTimeout37_) cnt.boundUpdateTimeout37_ = cnt.updateTimeout.bind(mWeakRef(cnt));
              a ? rafHub.cancel(cnt.rafId) : !a && b && (a = cnt.lastCountdownTimeMs || 0,
                cnt.detlaSincePausedSecs && (a = (cnt.lastCountdownTimeMs || 0) + 1E3 * cnt.detlaSincePausedSecs,
                  cnt.detlaSincePausedSecs = 0),
                cnt.boundUpdateTimeout37_(a),
                cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = window.performance.now())

              cnt = null;

            }).catch(e => {
              console.log(e);
            });



          },

          setContainerWidthNoSelfLeakage: function(){
            // prevent memory leakage due ot delay function
            try{
              if (!this.__proxySelf0__) this.__proxySelf0__ = weakWrap(this);
              return this.setContainerWidth55.call(this.__proxySelf0__);
            }catch(e){
              console.log('setContainerWidthNoSelfLeakage ERROR');
              console.error(e);
            }

          },

          slideDownNoSelfLeakage: function(){
            // prevent memory leakage due ot delay function
            try{
              if (!this.__proxySelf0__) this.__proxySelf0__ = weakWrap(this);
              return this.slideDown55.call(this.__proxySelf0__);
            }catch(e){
              console.log('slideDownNoSelfLeakage ERROR');
              console.error(e);
            }
            
          },

          collapseNoSelfLeakage: function(){
            // prevent memory leakage due ot delay function
            try{
              if (!this.__proxySelf0__) this.__proxySelf0__ = weakWrap(this);
              return this.collapse55.call(this.__proxySelf0__);
            }catch(e){
              console.log('collapseNoSelfLeakage ERROR');
              console.error(e);
            }
          },

          deletedChangedNoSelfLeakage: function(){
            // prevent memory leakage due ot delay function
            try{
              if (!this.__proxySelf0__) this.__proxySelf0__ = weakWrap(this);
              return this.deletedChanged55.call(this.__proxySelf0__);
            }catch(e){
              console.log('deletedChangedNoSelfLeakage ERROR');
              console.error(e);
            }

          },


          /** @type {(a,b)} */
          computeContainerStyleForAnimatorEnabled: function (a, b) {

            if (this._r782) return;
            const attachementId = this.__ticker_attachmentId__;
            if(!attachementId) return;

            if (this.isAttached === false && ((this.$ || 0).container || 0).isConnected === false) {
              this._throwOut();
              return;
            }

            return (dummyValueForStyleReturn || (dummyValueForStyleReturn = genDummyValueForStyleReturn()));

          },



          /** @type {()} */
          handlePauseReplayForPlaybackProgressState: function () {
            if (!playerEventsByIframeRelay) return this.handlePauseReplay66.apply(this, arguments);

            const attachementId = this.__ticker_attachmentId__;
            if(!attachementId) return;

            const jr = mWeakRef(this);

            if (onPlayStateChangePromise) {

              if (this.rtu > 1e9) this.rtu = this.rtu % 1e4;
              const tid = ++this.rtu;

              onPlayStateChangePromise.then(() => {
                const cnt = kRef(jr);
                if(attachementId !== cnt.__ticker_attachmentId__) return;
                if (cnt.isAttached) {
                  if (tid === cnt.rtu && !onPlayStateChangePromise && typeof cnt.handlePauseReplay === 'function' && cnt.hostElement) cnt.handlePauseReplay.apply(cnt, arguments);
                  // this.handlePauseReplay can be undefined if it is memory cleaned
                }
              });

              return;
            }

            if (playerState !== 2) return;
            if (this.isAttached) {
              if (this.rtk > 1e9) this.rtk = this.rtk % 1e4;
              const tid = ++this.rtk;
              const tc = relayCount;
              
              foregroundPromiseFn().then(() => {
                const cnt = kRef(jr);
                if (attachementId !== cnt.__ticker_attachmentId__) return;
                if (cnt.isAttached) {
                  if (tid === cnt.rtk && tc === relayCount && playerState === 2 && _playerState === playerState && cnt.hostElement) {
                    cnt.handlePauseReplay66();
                  }
                }

              })
            }
          },

          /** @type {()} */
          handleResumeReplayForPlaybackProgressState: function () {
            if (!playerEventsByIframeRelay) return this.handleResumeReplay66.apply(this, arguments);

            const attachementId = this.__ticker_attachmentId__;
            if(!attachementId) return;

            const jr = mWeakRef(this);
            if (onPlayStateChangePromise) {

              if (this.rtv > 1e9) this.rtv = this.rtv % 1e4;
              const tid = ++this.rtv;

              onPlayStateChangePromise.then(() => {
                const cnt = kRef(jr);
                if(attachementId !== cnt.__ticker_attachmentId__) return;
                if (tid === cnt.rtv && !onPlayStateChangePromise && typeof cnt.handleResumeReplay === 'function' && cnt.hostElement) cnt.handleResumeReplay.apply(cnt, arguments);
                // this.handleResumeReplay can be undefined if it is memory cleaned
              });

              return;
            }


            if (playerState !== 1) return;
            if (this.isAttached) {
              const tc = relayCount;

              relayPromise = relayPromise || new PromiseExternal();
              relayPromise.then(() => {
                const cnt = kRef(jr);
                if(attachementId !== cnt.__ticker_attachmentId__) return;
                if (relayCount > tc && playerState === 1 && _playerState === playerState && cnt.hostElement) {
                  cnt.handleResumeReplay66();
                }
              });
            }
          },

          /** @type {(a,)} */
          handleReplayProgressForPlaybackProgressState: function (a) {
            if (this.isAttached) {
              const attachementId = this.__ticker_attachmentId__;
              if(!attachementId) return;
              const tid = ++this.rtk;
              const jr = mWeakRef(kRef(this));
              foregroundPromiseFn().then(() => {
                const cnt = kRef(jr);
                if(attachementId !== cnt.__ticker_attachmentId__) return;
                if (cnt.isAttached) {
                  if (tid === cnt.rtk && cnt.hostElement) {
                    cnt.handleReplayProgress66(a);
                  }
                }
              })
            }
          }


        }


        for (const tag of tagsItemRenderer) { // ##tag##


          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            continue;
          }

          if (FIX_MEMORY_LEAKAGE_TICKER_ACTIONMAP && typeof cProto.detached582MemoryLeak !== 'function' && typeof cProto.detached === 'function') {
            cProto.detached582MemoryLeak = cProto.detached;
            cProto.detached = dProto.detachedForMemoryLeakage;
          }

          cProto.detached77 = cProto.detached;
          cProto.detached = dProto.detachedForTickerInit;

          cProto.attached77 = cProto.attached;

          cProto.attached = dProto.attachedForTickerInit;

          if (FLAG_001c) continue;

          let flgLeakageFixApplied = 0;

          if (FIX_MEMORY_LEAKAGE_TICKER_STATSBAR && typeof cProto.updateStatsBarAndMaybeShowAnimation === 'function' && !cProto.updateStatsBarAndMaybeShowAnimation38 && cProto.updateStatsBarAndMaybeShowAnimation.length === 3) {

            cProto.updateStatsBarAndMaybeShowAnimation38 = cProto.updateStatsBarAndMaybeShowAnimation;
            cProto.updateStatsBarAndMaybeShowAnimation = dProto.updateStatsBarAndMaybeShowAnimationRevised;

            flgLeakageFixApplied |= 2;
          } else {
            // the function is only in yt-live-chat-ticker-paid-message-item-renderer
          }


          // ------------- withTimerFn_ -------------

          let withTimerFn_ = 0;
          if (typeof cProto.startCountdown === 'function' && typeof cProto.updateTimeout === 'function' && typeof cProto.isAnimationPausedChanged === 'function') {

            // console.log('startCountdown', typeof cProto.startCountdown)
            // console.log('updateTimeout', typeof cProto.updateTimeout)
            // console.log('isAnimationPausedChanged', typeof cProto.isAnimationPausedChanged)

            // <<< to be reviewed cProto.updateTimeout --- isTimingFunctionHackable -- doHack >>>
            const isTimingFunctionHackable = fnIntegrity(cProto.startCountdown, '2.66.37') && fnIntegrity(cProto.updateTimeout, '1.76.45') && fnIntegrity(cProto.isAnimationPausedChanged, '2.56.30')
            if (!isTimingFunctionHackable) console.log('isTimingFunctionHackable = false');
            withTimerFn_ = isTimingFunctionHackable ? 2 : 1;
          } else {
            let flag = 0;
            if (typeof cProto.startCountdown === 'function') flag |= 1;
            if (typeof cProto.updateTimeout === 'function') flag |= 2;
            if (typeof cProto.isAnimationPausedChanged === 'function') flag |= 4;

            console.log(`Skip Timing Function Modification: ${flag} / ${1 + 2 + 4}`, ` ${tag}`);
            // console.log(Object.getOwnPropertyNames(cProto))
            // continue;
          }
          
          // ------------- withTimerFn_ -------------

          // ------------- ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX -------------

          let urt = 0;

          if (ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX) {


            /**
             * 
                  f.handlePauseReplay = function() {
                    this.isAnimationPaused = !0;
                    this.detlaSincePausedSecs = 0
                }
            */

            /**
             * 
            
            f.handlePauseReplay = function() {
                this.isReplayPaused = !0
            }
            * 
            */

            if (typeof cProto.handlePauseReplay === 'function' && !cProto.handlePauseReplay66 && cProto.handlePauseReplay.length === 0) {
              const fi = fnIntegrity(cProto.handlePauseReplay);
              urt++;
              if (fi === '0.8.2' || fi === '0.12.4') {
              } else {
                assertor(() => fnIntegrity(cProto.handlePauseReplay, '0.12.4'));
              }
            } else {
              if (withTimerFn_ > 0) console.log('Error for setting cProto.handlePauseReplay', tag)
            }

            if (typeof cProto.handleResumeReplay === 'function' && !cProto.handleResumeReplay66 && cProto.handleResumeReplay.length === 0) {
              urt++;
              assertor(() => fnIntegrity(cProto.handleResumeReplay, '0.8.2'));
            } else {
              if (withTimerFn_ > 0) console.log('Error for setting cProto.handleResumeReplay', tag)
            }

            if (typeof cProto.handleReplayProgress === 'function' && !cProto.handleReplayProgress66 && cProto.handleReplayProgress.length === 1) {
              urt++;
              assertor(() => fnIntegrity(cProto.handleReplayProgress, '1.16.13'));
            } else {
              if (withTimerFn_ > 0) console.log('Error for setting cProto.handleReplayProgress', tag)
            }



          }

          const ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED = ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX && urt === 3 && (SKIP_VIDEO_PLAYBACK_PROGRESS_STATE_FIX_FOR_NO_TIMEFX ? (withTimerFn_ > 0) : true);
          cProto.__ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED__ = ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED;

          if (ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED) {

            cProto.rtk = 0;
            cProto.rtu = 0;
            cProto.rtv = 0;

            cProto.handlePauseReplay66 = cProto.handlePauseReplay;
            cProto.handlePauseReplay = dProto.handlePauseReplayForPlaybackProgressState;

            cProto.handleResumeReplay66 = cProto.handleResumeReplay;
            cProto.handleResumeReplay = dProto.handleResumeReplayForPlaybackProgressState;

            cProto.handleReplayProgress66 = cProto.handleReplayProgress;
            cProto.handleReplayProgress = dProto.handleReplayProgressForPlaybackProgressState;

          }

          // ------------- ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX -------------

          // ------------- FIX_MEMORY_LEAKAGE_TICKER_TIMER -------------

          if (FIX_MEMORY_LEAKAGE_TICKER_TIMER) {
            if (typeof cProto.setContainerWidth === 'function' && !cProto.setContainerWidth55 && cProto.setContainerWidth.length === 0) {
              cProto.setContainerWidth55 = cProto.setContainerWidth;
              cProto.setContainerWidth = dProto.setContainerWidthNoSelfLeakage;
              flgLeakageFixApplied |= 4;
            }
            if (typeof cProto.slideDown === 'function' && !cProto.slideDown55 && cProto.slideDown.length === 0) {
              cProto.slideDown55 = cProto.slideDown;
              cProto.slideDown = dProto.slideDownNoSelfLeakage;
              flgLeakageFixApplied |= 8;
            }
            if (typeof cProto.collapse === 'function' && !cProto.collapse55 && cProto.collapse.length === 0) {
              cProto.collapse55 = cProto.collapse;
              cProto.collapse = dProto.collapseNoSelfLeakage;
              flgLeakageFixApplied |= 16;
            }
            if (typeof cProto.deletedChanged === 'function' && !cProto.deletedChanged55 && cProto.deletedChanged.length === 0) {

              cProto.deletedChanged55 = cProto.deletedChanged;
              cProto.deletedChanged = dProto.deletedChangedNoSelfLeakage;
              flgLeakageFixApplied |= 32;
            }

          }

          console.log(`FIX_MEMORY_LEAKAGE_TICKER_: ${flgLeakageFixApplied} / ${1 + 2 + 4 + 8 + 16 + 32}`, cProto.is);

          // ------------- FIX_MEMORY_LEAKAGE_TICKER_TIMER -------------




          if (withTimerFn_ > 0) {

            const isTimingFunctionHackable = withTimerFn_ & 2;

            let doAnimator_ = false;

            let rafHackState = 0;
            // continue;
            if (ENABLE_RAF_HACK_TICKERS && rafHub !== null) {

              // cancelable - this.rafId < isAnimationPausedChanged >
              rafHackState = 1;

              if (isTimingFunctionHackable) {
                rafHackState = 2;

              } else {
                rafHackState = 4;
              }

            }
            // continue;

            doAnimator_ = !USE_ADVANCED_TICKING && !!ATTEMPT_ANIMATED_TICKER_BACKGROUND && isTimingFunctionHackable && typeof KeyframeEffect === 'function' && typeof animate === 'function' && typeof cProto.computeContainerStyle === 'function' && typeof cProto.colorFromDecimal === 'function' && isCSSPropertySupported();


            const doAnimator = doAnimator_;

            cProto._throwOut = dProto._throwOut;

            cProto._makeAnimator = doAnimator ? dProto._makeAnimator : null;

            cProto._aeFinished = doAnimator ? dProto._aeFinished : null;


            const doRAFHack = rafHackState === 2;


            const doTimerFnModification = !USE_ADVANCED_TICKING && (doRAFHack || doAnimator);
            // doTimerFnModification = false; // M55

            if (doTimerFnModification) { // including memory fix leakage

              if (doAnimator && windowShownAt < 0) {
                windowShownAt = 0;
                setupEventForWindowShownAt();
              }

              cProto.startCountdown = (
                doAnimator ? dProto.startCountdownForTimerFnModA : dProto.startCountdownForTimerFnModT
              );

              // _lastCountdownTimeMsX0 is required since performance.now() is not fully the same with rAF timestamp
              cProto.updateTimeout = (
                doAnimator ? dProto.updateTimeoutForTimerFnModA : dProto.updateTimeoutForTimerFnModT
              );


              // let ez = 0;
              cProto.isAnimationPausedChanged = (
                doAnimator ? dProto.isAnimationPausedChangedForTimerFnModA : dProto.isAnimationPausedChangedForTimerFnModT
              );

              flgLeakageFixApplied |= 1;
            }


            if (doAnimator) {


              const s = fnIntegrity(cProto.computeContainerStyle);

              if (s === '2.46.29') {
                // f.computeContainerStyle = function(a, b) {
                //     if (!a)
                //         return $h(kmb);
                //     var c = this.colorFromDecimal(a.startBackgroundColor);
                //     a = this.colorFromDecimal(a.endBackgroundColor);
                //     b = 100 * b + "%";
                //     return $h(lmb, c, c, b, a, b, a)
                // }
              } else if (s === '2.44.29' || s === '2.81.31') {

                //     var ofb = da([""])
                //         pfb = da("background:linear-gradient(90deg, {,{ {,{ {,{);".split("{"))

                // f.computeContainerStyle = function(a, b) {
                //     if (!a)
                //         return pi(ofb);
                //     var c = this.colorFromDecimal(a.startBackgroundColor);
                //     a = this.colorFromDecimal(a.endBackgroundColor);
                //     b = 100 * b + "%";
                //     return pi(pfb, c, c, b, a, b, a)
                // }

              } else {
                assertor(() => fnIntegrity(cProto.computeContainerStyle, '2.46.29'));
              }

              cProto.computeContainerStyle66 = cProto.computeContainerStyle;

              cProto.computeContainerStyle = dProto.computeContainerStyleForAnimatorEnabled;

            }

            if (doTimerFnModification === true) hasTimerModified = true;


            if (!!ATTEMPT_ANIMATED_TICKER_BACKGROUND) {
              console.log('ATTEMPT_ANIMATED_TICKER_BACKGROUND', tag, doAnimator ? 'OK' : 'NG');
            }


            if (!doAnimator && (rafHackState === 2 || rafHackState === 4)) {
              console.log('RAF_HACK_TICKERS', tag, doRAFHack ? "OK" : "NG");
            }
          }

          const canDoAdvancedTicking = 1 &&
            typeof cProto.startCountdown === 'function' && !cProto.startCountdown49 && cProto.startCountdown.length === 2 &&
            typeof cProto.updateTimeout === 'function' && !cProto.updateTimeout49 && cProto.updateTimeout.length === 1 &&
            typeof cProto.isAnimationPausedChanged === 'function' && !cProto.isAnimationPausedChanged49 && cProto.isAnimationPausedChanged.length === 2 &&
            typeof cProto.setContainerWidth === 'function' && cProto.setContainerWidth.length === 0 &&
            typeof cProto.slideDown === 'function' && cProto.slideDown.length === 0 &&
            CSS.supports("left","clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%)");
            


          if (USE_ADVANCED_TICKING && canDoAdvancedTicking) {
            // startResitanceUpdater();
            // live replay video ->   48117005 -> 48117006 keep fire.  ->48117007 0 -> 48117007 {...}
            // live stream video -> 48117007 0 -> 48117007 YES

            console.log('USE_ADVANCED_TICKING')


            const wio = dProto.wio || (dProto.wio = new IntersectionObserver((mutations) => {

              for (const mutation of mutations) {
                if (mutation.isIntersecting) {
                  const marker = mutation.target;
                  const overlay = marker instanceof HTMLElement ? marker.closest('ticker-bg-overlay') : 0;
                  wio.unobserve(marker);
                  marker.remove();
                  let p = overlay || 0;
                  let cn = 4;
                  while ((p = p.parentElement) instanceof HTMLElement) {
                    if (p instanceof HTMLElement) {
                      const cnt = insp(p);
                      if (cnt && typeof cnt.slideDown === 'function' && typeof cnt.setContainerWidth === 'function' && cnt.__advancedTicking038__ === 1 ) {

                        cnt.__advancedTicking038__ = 2;

                        let deletionMode = false;
                        const cntData = ((cnt || 0).__data || 0).data || (cnt || 0).data || 0;
                        if (timestampUnderLiveMode && cntData && cntData.duration > 0 && cntData.__timestampActionRequest__ > 0) {

                          const targetFutureTime = cntData.__timestampActionRequest__ + cntData.durationSec * 1000;
                          // check whether the targetFutureTime is already the past
                          if (targetFutureTime + 800 < Date.now()) {
                            // just dispose
                            deletionMode = true;
                          }
                        }
          

                        if (deletionMode) {
                          __requestRemoval__(cnt);
                        } else {

                          ("auto" === cnt.hostElement.style.width && cnt.setContainerWidth(),
                            cnt.slideDown());
                        }

                        break;
                      }
                    }
                    cn--;
                    if (!cn) {
                      console.log('cnt not found for ticker-bg-overlay');
                      break;
                    }
                  }
                }
              }
            }, {
              rootMargin: '1px',
              threshold: [0]
            }));

            // cProto._throwOut = dProto._throwOut;


            const u37fn = dProto.u37fn || (dProto.u37fn = function (cnt) {

              const cntData = ((cnt || 0).__data || 0).data || (cnt || 0).data || 0;
              if(!cntData) return;
              const cntElement = cnt.hostElement;

              const duration = (cntData.fullDurationSec || cntData.durationSec || 0);

              let ct;

              if (cntData && duration > 0 && !('__progressAt__' in cntData)) {
                ct = Date.now();
                cntData.__liveTimestamp__ = (cntData.__timestampActionRequest__ || ct) / 1000 - timeOriginDT / 1000;
                timestampUnderLiveMode = true;
              } else if (cntData && duration > 0 && cntData.__progressAt__ > 0) {
                timestampUnderLiveMode = false;
              }
              // console.log(48117007, cntData)

              let tk = cntData.__progressAt__ || cntData.__liveTimestamp__;

              if (!tk || !(cntElement instanceof HTMLElement)) return;



              const liveOffsetMs = ct > 0 && cntData.__timestampActionRequest__ > 0 ? ct - cntData.__timestampActionRequest__ : 0;

              // console.log(1237, liveOffsetMs, cntData.durationSec)

              if (liveOffsetMs > 0) {
                cntData.durationSec -= Math.floor(liveOffsetMs / 1000);
                if(cntData.durationSec < 0) cntData.durationSec = 0;
                // console.log(1238, liveOffsetMs, cntData.durationSec)
                if(!cntData.durationSec ){
                  try {
                    cnt.requestRemoval();
                  } catch (e) { }
                  return;
                }
              }


              let offset = cntData.fullDurationSec - cntData.durationSec; // consider this is live replay video, offset can be > 0
              if (offset > 0) tk -= offset;
              // in livestreaming. tk can be negative as we use performance.timeOrigin for t=0s time frame



              if (valAssign(cntElement, '--ticker-start-time', tk) && duration > 0) {

                // t0 ...... 1 ... fullDurationSec
                // tk ...... k ... fullDurationSec-durationSec
                // t0-fullDurationSec ...... 0 ... 0

                // now - (fullDurationSec-durationSec)



                const dnt = cnt.parentComponent;
                const dntElement = dnt ? dnt.hostElement || dnt : 0;
                if (dntElement) {
                  dntElementWeak = mWeakRef(dntElement);
                  updateTickerCurrentTime();
                }
                if (!cntElement.querySelector(`ticker-bg-overlay[ticker-id="${cnt.__ticker_attachmentId__}"]`)) {

                  const oldElement = cntElement.querySelector('ticker-bg-overlay');
                  if (oldElement) oldElement.remove();

                  
                  cnt.__advancedTicking038__ = 1;


                  const em = document.createElement('ticker-bg-overlay');
                  const ey = document.createElement('ticker-bg-overlay-end');

                  const cr1 = cnt.colorFromDecimal(cntData.startBackgroundColor);
                  const cr2 = cnt.colorFromDecimal(cntData.endBackgroundColor);


                  const container = cnt.$.container;
                  
                  em.setAttribute('ticker-id', `${cnt.__ticker_attachmentId__}`);
                  em.style.background = `linear-gradient(90deg, ${cr1},${cr1} 50%,${cr2} 50%,${cr2})`;

                  const attachmentCode = container instanceof HTMLElement ? 1 : 0;
                  if(attachmentCode === 0){
                    em.insertBefore(ey, em.firstChild);
                    cntElement.insertBefore(em, cntElement.firstChild);
                    cntElement.style.borderRadius = '16px';
                    container.style.borderRadius = 'initial';
                  } else {

                    em.insertBefore(ey, em.firstChild);
                    container.insertBefore(em, container.firstChild);
                  }

                  // em.style.left = '-50%';
                  // em.style.left = "clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%)";

                  if (container instanceof HTMLElement) {

                    container.style.background = 'transparent';
                    container.style.backgroundColor = 'transparent';
                    // container.style.zIndex = '1';
                  }
                  em.style.zIndex = '-1';
                  valAssign(cntElement, '--ticker-duration-time', duration)

                  if (wio instanceof IntersectionObserver) {
                    wio.observe(ey);
                  }

                }
              }
            });

            const timeFn = (cnt)=>{

              if (!cnt) return;
              if (!cnt.hostElement) return;

              const attachementId = cnt.__ticker_attachmentId__;
              if (!attachementId) return;

              Promise.resolve(cnt).then(u37fn);

            }

            cProto.startCountdown = dProto.startCountdownAdv || (dProto.startCountdownAdv = function (a, b) {

              timeFn(kRef(this));

              // try {
              //   const cnt = kRef(this);
              //   if (!cnt) return;
              //   if (!cnt.hostElement) return;

              //   const attachementId = cnt.__ticker_attachmentId__;
              //   if (!attachementId) return;

              //   // a.durationSec [s] => countdownMs [ms]
              //   // a.fullDurationSec [s] => countdownDurationMs [ms] OR countdownMs [ms]
              //   // lastCountdownTimeMs => raf ongoing
              //   // lastCountdownTimeMs = 0 when rafId = 0 OR countdownDurationMs = 0

              //   // if (cnt._r782) return;

              //   // if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
              //   //   cnt._throwOut();
              //   //   return;
              //   // }

              //   // TimerFnModT

              //   // b = void 0 === b ? 0 : b;
              //   // void 0 !== a && (cnt.countdownMs = 1E3 * a,
              //   //   cnt.countdownDurationMs = b ? 1E3 * b : cnt.countdownMs,
              //   //   // cnt.ratio = 1,
              //   //   cnt.lastCountdownTimeMs || cnt.isAnimationPaused || (cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = performance.now(),
              //   //     cnt.rafId = -1))

              //   Promise.resolve(cnt).then((cnt) => {
              //     u37fn(cnt);
              //   })

              // } catch (e) {
              //   console.warn(e);
              // }


            });

            cProto.updateTimeout = dProto.updateTimeoutAdv || (dProto.updateTimeoutAdv = function (a) {


              // timeFn(kRef(this));

              // try {
              //   const cnt = kRef(this);
              //   if (!cnt) return;
              //   if (!cnt.hostElement) return; // memory leakage. to be reviewed

              //   const attachementId = cnt.__ticker_attachmentId__;
              //   if (!attachementId) return;

              //   // _lastCountdownTimeMsX0 is required since performance.now() is not fully the same with rAF timestamp

              //   // if (cnt._r782) return;

              //   // if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
              //   //   cnt._throwOut();
              //   //   return;
              //   // }

              //   // if (cnt.lastCountdownTimeMs !== cnt._lastCountdownTimeMsX0) {
              //   //   cnt.countdownMs = Math.max(0, cnt.countdownMs - (a - (cnt.lastCountdownTimeMs || 0)));
              //   // }
              //   // console.log(703, cnt.countdownMs)
              //   // cnt.ratio = cnt.countdownMs / cnt.countdownDurationMs;

              //   // u37fn(cnt);
              //   // cnt.isAttached && cnt.countdownMs ? (cnt.lastCountdownTimeMs = a,
              //   //   cnt.rafId = -1) : (cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = null,
              //   //     cnt.isAttached && ("auto" === cnt.hostElement.style.width && cnt.setContainerWidth(),
              //   //       cnt.slideDown()))


              // } catch (e) {
              //   console.warn(e);
              // }

            });

            cProto.isAnimationPausedChanged = dProto.isAnimationPausedChangedAdv || (dProto.isAnimationPausedChangedAdv = function (a, b) {


              // timeFn(kRef(this));

              // const cnt = kRef(this);
              // if (!cnt) return;
              // if (!cnt.hostElement) return; // memory leakage. to be reviewed

              // const attachementId = cnt.__ticker_attachmentId__;
              // if (!attachementId) return;

              // if (cnt._r782) return;

              // if (cnt.isAttached === false && ((cnt.$ || 0).container || 0).isConnected === false) {
              //   cnt._throwOut();
              //   return;
              // }
              // let forceNoDetlaSincePausedSecs783 = cnt._forceNoDetlaSincePausedSecs783;
              // cnt._forceNoDetlaSincePausedSecs783 = 0;

              // u37fn(cnt);
              // Promise.resolve(cnt).then((cnt) => {

              //   if (attachementId !== cnt.__ticker_attachmentId__) return;

              //   // a ? 0 : !a && b && (a = cnt.lastCountdownTimeMs || 0,
              //   //   cnt.detlaSincePausedSecs && (a = (cnt.lastCountdownTimeMs || 0) + 1E3 * cnt.detlaSincePausedSecs,
              //   //     cnt.detlaSincePausedSecs = 0),
              //   //   cnt.lastCountdownTimeMs = cnt._lastCountdownTimeMsX0 = window.performance.now())

              //   cnt = null;

              // }).catch(e => {
              //   console.log(e);
              // });


            });

            if (typeof cProto.computeContainerStyle === 'function' && !cProto.computeContainerStyle49 && cProto.computeContainerStyle.length === 2) {
              cProto.computeContainerStyle49 = cProto.computeContainerStyle;
              cProto.computeContainerStyle = dProto.computeContainerStyleAdv || (dProto.computeContainerStyleAdv = function (a, b) {
                if (this.__advancedTicking038__) {
                  return "";
                }
                return this.computeContainerStyle49(a, b);
              });
            }

          }



        }

        const selector = tags.join(', ');
        const elements = document.querySelectorAll(selector);
        if (elements.length >= 1) {
          for (const elm of elements) {
            if (insp(elm).isAttached === true) {
              fpTicker(elm);
            }
          }
        }

        console.log("[End]");
        console.groupEnd();


      }).catch(console.warn);

      if(FIX_MEMORY_LEAKAGE_TICKER_DATACHANGED_setContainerWidth){

        /**
         * 
         *    
         * 
         * 
            cT.prototype.dataChanged = function() {
                var a = this;
                this.data && (Q(this.hostElement).querySelector("#content").style.color = this.ytLiveChatTickerItemBehavior.colorFromDecimal(this.data.detailTextColor),
                this.hostElement.ariaLabel = this.computeAriaLabel(this.data),
                this.ytLiveChatTickerItemBehavior.startCountdown(this.data.durationSec, this.data.fullDurationSec),
                qw(function() {
                    a.ytLiveChatTickerItemBehavior.setContainerWidth()
                }))
            }


            znb.prototype.dataChanged = function(a) {
                var b = this;
                a && (a.tickerThumbnails.length > 1 && Q(this.hostElement).querySelector("#content").classList.add("multiple-thumbnails"),
                this.ytLiveChatTickerItemBehavior.startCountdown(a.durationSec, a.fullDurationSec),
                qw(function() {
                    b.ytLiveChatTickerItemBehavior.setContainerWidth()
                }))
            }

        * 
        */

        const dProto = {
          dataChanged54500: function () {
            // prevent memory leakage due to _.ytLiveChatTickerItemBehavior.setContainerWidth() in _.dataChanged
            if (typeof (this.ytLiveChatTickerItemBehavior || 0).setContainerWidth === 'function') {
              try {
                if (!this.__proxySelf0__) this.__proxySelf0__ = weakWrap(this);
                return this.dataChanged544.call(this.__proxySelf0__);
              } catch (e) {
                console.log('dataChanged54500 ERROR');
                console.error(e);
              }
            } else {
              return this.dataChanged544();
            }
          },
          dataChanged54501: function (a) {
            // prevent memory leakage due to _.ytLiveChatTickerItemBehavior.setContainerWidth() in _.dataChanged
            if (typeof (this.ytLiveChatTickerItemBehavior || 0).setContainerWidth === 'function') {
              try {
                if (!this.__proxySelf0__) this.__proxySelf0__ = weakWrap(this);
                return this.dataChanged544.call(this.__proxySelf0__, a);
              } catch (e) {
                console.log('dataChanged54501 ERROR');
                console.error(e);
              }
            } else {
              return this.dataChanged544(a);
            }
          },
        }

        for (const sto of [
          'yt-live-chat-ticker-sponsor-item-renderer',
          'yt-live-chat-ticker-paid-sticker-item-renderer'
        ].map(tag => [tag, customElements.whenDefined(tag)])) {
  
          const [tag, promise] = sto;
  
          promise.then(()=>{
  
            const dummy = document.createElement(tag);
  
            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }
  
            if (!cProto.dataChanged || cProto.dataChanged544 || typeof cProto.dataChanged !== 'function' || !(cProto.dataChanged.length >= 0 && cProto.dataChanged.length <= 1)) return;

            cProto.dataChanged544 = cProto.dataChanged;

            if (cProto.dataChanged.length === 0) cProto.dataChanged = dProto.dataChanged54500;
            else if (cProto.dataChanged.length === 1) cProto.dataChanged = dProto.dataChanged54501;
            
  
  
          })
  
  
        }

      }

      customElements.whenDefined('yt-live-chat-ticker-renderer').then(() => {

        if (FLAG_001d) return;

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-ticker-renderer hacks");
        console.log("[Begin]");
        (() => {

          /* pending!!

          handleLiveChatAction

          removeTickerItemById

          _itemsChanged
          itemsChanged

          handleMarkChatItemAsDeletedAction
          handleMarkChatItemsByAuthorAsDeletedAction
          handleRemoveChatItemByAuthorAction


          */

          const tag = "yt-live-chat-ticker-renderer"
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          const do_amend_ticker_handleLiveChatAction = AMEND_TICKER_handleLiveChatAction && !AMEND_TICKER_handleLiveChatAction_v3
            && typeof cProto.handleLiveChatAction === 'function' && !cProto.handleLiveChatAction45 && cProto.handleLiveChatAction.length === 1
            && typeof cProto.handleLiveChatActions === 'function' && !cProto.handleLiveChatActions45 && cProto.handleLiveChatActions.length === 1
            && typeof cProto.unshift === 'function' && cProto.unshift.length === 1
            && typeof cProto.handleMarkChatItemAsDeletedAction === 'function' && cProto.handleMarkChatItemAsDeletedAction.length === 1
            && typeof cProto.removeTickerItemById === 'function' && cProto.removeTickerItemById.length === 1
            && typeof cProto.handleMarkChatItemsByAuthorAsDeletedAction === 'function' && cProto.handleMarkChatItemsByAuthorAsDeletedAction.length === 1
            && typeof cProto.handleRemoveChatItemByAuthorAction === 'function' && cProto.handleRemoveChatItemByAuthorAction.length === 1
            ;

          console.log('do_amend_ticker_handleLiveChatAction', fnIntegrity(cProto.handleLiveChatAction), fnIntegrity(cProto.handleLiveChatActions))


          if (do_amend_ticker_handleLiveChatAction) {


            if (fnIntegrity(cProto.handleLiveChatActions) === '1.23.12') {

              console.log(`handleLiveChatActions`, 'modified');

              cProto.handleLiveChatActions45 = cProto.handleLiveChatActions;

              cProto.handleLiveChatActions = function (a) {
                /**
                 *
                    f.handleLiveChatActions = function(a) {
                        a.length && (a.forEach(this.handleLiveChatAction, this),
                        this.updateHighlightedItem(),
                        this.shouldAnimateIn = !0)
                    }
                 *
                 */
                const len = a.length;
                if (len) {
                  const batchToken = String.fromCharCode(Date.now() % 26 + 97) + Math.floor(Math.random() * 19861 + 19861).toString(36);

                  if (FIX_BATCH_TICKER_ORDER && len >= 2) {

                    // Primarily for the initial batch, this is due to replayBuffer._back.
                    const entries = [];
                    const entriesI = [];
                    for (let i = 0; i < len; i++) {
                      const item = ((a[i] || 0).addLiveChatTickerItemAction || 0).item || 0;
                      const timestampUsec = item ? parseInt(getTimestampUsec(item[firstObjectKey(item)]), 10) : 0;
                      if (timestampUsec > 0) {
                        entriesI.push(i);
                        binaryInsert(entries, { e: a[i], timestampUsec }, (a, b) => {
                          const diff = a.timestampUsec - b.timestampUsec;
                          return diff > 0.1 ? 1 : diff < -0.1 ? -1 : 0;
                        });
                      }
                    }
                    const mLen = entries.length;
                    if (mLen >= 2) {
                      for (let j = 0; j < mLen; j++) {
                        a[entriesI[j]] = entries[j].e;
                      }
                    }
                    entries.length = 0;
                    entriesI.length = 0;
                  }
                  for (const action of a) {
                    action.__batchId45__ = batchToken;
                    this.handleLiveChatAction(action);
                  }
                }
              }


            }


            console.log(`handleLiveChatAction`, 'modified');

            const cacheChatActions = new LimitedSizeSet(16);

            cProto.handleLiveChatAction45 = cProto.handleLiveChatAction;

            cProto.handleLiveChatAction = function (a) {

              const key = firstObjectKey(a);
              if (!key) return;

              const val = a[key];
              let itemKey = '';
              let itemId = '';
              const valItem = val ? val.item : null;
              if (valItem) {
                itemKey = firstObjectKey(valItem);
                if (itemKey) {
                  const itemVal = valItem[itemKey];
                  itemId = itemVal ? itemVal.id : '';
                  if (itemId) {
                    const cacheKey = `${key}.${itemKey}::${itemId}`;
                    if (key === 'addChatItemAction' && itemId) return; // no need
                    if (cacheChatActions.has(cacheKey)) {
                      console.log('handleLiveChatAction Repeated Item', cacheKey);
                      return;
                    } else {
                      cacheChatActions.add(cacheKey);
                    }
                  }
                }
              }
              return this.handleLiveChatAction45(a);
            };

            console.log("AMEND_TICKER_handleLiveChatAction - OK (v2)");

          } else if (0 && do_amend_ticker_handleLiveChatAction
            && '|1.63.48|1.64.48|'.includes(`|${fnIntegrity(cProto.handleLiveChatAction)}|`)
            && fnIntegrity(cProto.handleLiveChatActions) === '1.23.12'
          ) {

            cProto.handleLiveChatActions45 = cProto.handleLiveChatActions;

            cProto.handleLiveChatActions = function (a) {
              /**
               *
                  f.handleLiveChatActions = function(a) {
                      a.length && (a.forEach(this.handleLiveChatAction, this),
                      this.updateHighlightedItem(),
                      this.shouldAnimateIn = !0)
                  }
               *
               */

              if (a.length) {
                const batchToken = String.fromCharCode(Date.now() % 26 + 97) + Math.floor(Math.random() * 19861 + 19861).toString(36);
                const len = a.length;
                if (FIX_BATCH_TICKER_ORDER && len >= 2) {
                  // Primarily for the initial batch, this is due to replayBuffer._back.
                  const entries = [];
                  const entriesI = [];
                  for (let i = 0; i < len; i++) {
                    const item = ((a[i] || 0).addLiveChatTickerItemAction || 0).item || 0;
                    if (item) {
                      const itemRendererKey = firstObjectKey(item);
                      const itemRenderer = item[itemRendererKey];
                      if (itemRenderer) {
                        let timestampUsec = getTimestampUsec(itemRenderer);
                        if (timestampUsec !== null) {
                          timestampUsec = parseInt(timestampUsec, 10);
                          if (timestampUsec > 0) {
                            entriesI.push(i);
                            entries.push({ e: a[i], timestampUsec })
                          }
                        }
                      }
                    }
                  }
                  const mLen = entries.length;
                  if (mLen >= 2) {
                    entries.sort((a, b) => {
                      const diff = a.timestampUsec - b.timestampUsec;
                      return diff > 0.1 ? 1 : diff < -0.1 ? -1 : 0;
                    });
                    for (let j = 0; j < mLen; j++) {
                      const i = entriesI[j];
                      a[i] = entries[j].e;
                    }
                  }
                  entries.length = 0;
                  entriesI.length = 0;
                }
                for (const action of a) {
                  action.__batchId45__ = batchToken;
                  this.handleLiveChatAction(action);
                }
              }
            }

            cProto.handleLiveChatAction45 = cProto.handleLiveChatAction;

            cProto._nszlv_ = 0;
            cProto._stackedLCAs_ = null;
            cProto._lastAddItem_ = null;
            cProto._lastAddItemInStack_ = false;
            cProto.handleLiveChatAction = function (a) {

              /**
               *
               *
                f.handleLiveChatAction = function(a) {
                    var b = C(a, xO)
                      , c = C(a, yO)
                      , d = C(a, o1a)
                      , e = C(a, p1a);
                    a = C(a, A1a);
                    b ? this.unshift("items", b.item) : c ? this.handleMarkChatItemAsDeletedAction(c) : d ? this.removeTickerItemById(d.targetItemId) : e ? this.handleMarkChatItemsByAuthorAsDeletedAction(e) : a && this.handleRemoveChatItemByAuthorAction(a)
                }
               *
               */

              // return this.handleLiveChatAction45(a)
              const { addChatItemAction, addLiveChatTickerItemAction, markChatItemAsDeletedAction,
                removeChatItemAction, markChatItemsByAuthorAsDeletedAction, removeChatItemByAuthorAction, __batchId45__ } = a

              if (addChatItemAction) return;
              const d = Date.now();

              if (this._stackedLCAs_ === null) this._stackedLCAs_ = [];
              const stackArr = this._stackedLCAs_;
              let newStackEntry = null;
              if (addLiveChatTickerItemAction) {
                let isDuplicated = false;

                const newItem = addLiveChatTickerItemAction.item;
                const tickerType = firstObjectKey(newItem);
                if (!tickerType) return;
                const tickerItem = newItem[tickerType];
                const tickerId = tickerItem.id;
                if (!tickerId) return;

                if (this._lastAddItem_ && this._lastAddItem_.id === tickerId) {
                  let prevTickerItem = null;
                  if (this._lastAddItemInStack_) {
                    const entry = stackArr[stackArr.length - 1]; // only consider the last entry
                    if (entry && entry.action === 'addItem') {
                      prevTickerItem = entry.data; // only consider the first item;
                    }
                  } else {
                    prevTickerItem = this.items[0]; // only consider the first item;
                  }
                  if (prevTickerItem && prevTickerItem[tickerType]) {
                    if (prevTickerItem[tickerType].id === tickerId) {
                      isDuplicated = true;
                    }
                  }
                }
                if (!isDuplicated) {
                  this._lastAddItem_ = tickerItem;
                  this._lastAddItemInStack_ = true;
                  // console.log('newItem', newItem)

                  const item = newItem;
                  const key = firstObjectKey(item);
                  if (key) {
                    const itemRenderer = item[key] || 0;
                    if (itemRenderer.fullDurationSec > 0) {
                      itemRenderer.__actionAt__ = d;
                    }
                  }

                  newStackEntry = { action: 'addItem', data: newItem };

                } else {
                  console.log('handleLiveChatAction Repeated Item', tickerItem.id, tickerItem); // happen in both live and playback. Reason Unknown.
                  return;
                }

              } else {
                markChatItemAsDeletedAction && (newStackEntry = { action: 'mcItemD', data: markChatItemAsDeletedAction });
                removeChatItemAction && (newStackEntry = { action: 'removeItemById', data: removeChatItemAction.targetId });
                markChatItemsByAuthorAsDeletedAction && (newStackEntry = { action: 'mcItemAD', data: markChatItemsByAuthorAsDeletedAction });
                removeChatItemByAuthorAction && (newStackEntry = { action: 'removeItemA', data: removeChatItemByAuthorAction })
              }


              if (!newStackEntry) return;
              stackArr.push(newStackEntry);


              this._nszlv_++;
              if (this._nszlv_ > 1e9) this._nszlv_ = 9;
              const tid = this._nszlv_;

              newStackEntry.__batchId45__ = __batchId45__ || '';
              newStackEntry.dateTime = Date.now();


              foregroundPromiseFn().then(() => {

                if (tid !== this._nszlv_) return;
                const dateNow = Date.now(); // time difference to shift animation start time shall be considered. (pending)
                const stackArr = this._stackedLCAs_.slice(0);
                this._stackedLCAs_.length = 0;
                this._lastAddItemInStack_ = false;
                let lastDateTime = 0;
                let prevBatchId = '';
                const addItems = [];
                // const previousShouldAnimateIn = this.shouldAnimateIn;

                const addItemsFx = () => {

                  if (addItems.length >= 1) {
                    const eArr = addItems.slice(0);
                    addItems.length = 0;
                    if (ADJUST_TICKER_DURATION_ALIGN_RENDER_TIME) {

                      const arr = []; // size of arr <= size of eArr
                      const d = Date.now();
                      for (const item of eArr) {
                        const key = firstObjectKey(item);
                        if (key) {


                          const itemRenderer = item[key] || 0;
                          const { durationSec, fullDurationSec, __actionAt__ } = itemRenderer;
                          if (__actionAt__ > 0 && durationSec > 0 && fullDurationSec > 0) {


                            const offset = d - __actionAt__;
                            if (offset > 0 && typeof durationSec === 'number' && typeof fullDurationSec === 'number' && fullDurationSec >= durationSec) {
                              const adjustedDurationSec = durationSec - Math.floor(offset / 1000);
                              if (adjustedDurationSec < durationSec) { // prevent NaN
                                // console.log('adjustedDurationSec', adjustedDurationSec);
                                if (adjustedDurationSec > 0) {
                                  // console.log('offset Sec', Math.floor(offset / 1000));
                                  itemRenderer.durationSec = adjustedDurationSec;
                                } else {
                                  // if adjustedDurationSec equal 0 or invalid
                                  continue; // skip adding
                                }
                              }

                            }

                          }

                          if (fullDurationSec > 0 && durationSec < 1) continue; // fallback check



                        }
                        arr.push(item)
                        // arr.unshift(item);
                      }


                      // console.log(arr.slice(0))
                      this.unshift("items", ...arr);
                    } else {
                      this.unshift("items", ...eArr);
                    }
                  }
                }

                for (const entry of stackArr) {

                  const { action, data, dateTime, __batchId45__ } = entry;

                  const finishLastAction = (
                    (prevBatchId !== __batchId45__ && prevBatchId)
                    || (dateNow - lastDateTime >= 1000 && dateNow - dateTime < 1000)
                  );

                  const addPrevItems = addItems.length >= 1 && (finishLastAction || action !== 'addItem');
                  lastDateTime = dateTime;
                  prevBatchId = __batchId45__;

                  if (addPrevItems) {
                    addItemsFx();
                  }

                  if (action === 'addItem') addItems.unshift(data);
                  else if (action === 'mcItemD') this.handleMarkChatItemAsDeletedAction(data);
                  else if (action === 'removeItemById') this.removeTickerItemById(data);
                  else if (action === 'mcItemAD') this.handleMarkChatItemsByAuthorAsDeletedAction(data);
                  else if (action === 'removeItemA') this.handleRemoveChatItemByAuthorAction(data);

                }

                addItemsFx();
              })

            }

            console.log("AMEND_TICKER_handleLiveChatAction - OK (v1)");
          } else {
            console.log("AMEND_TICKER_handleLiveChatAction - NG");
          }



          const do_amend_ticker_handleLiveChatAction_v3 = AMEND_TICKER_handleLiveChatAction_v3 && !AMEND_TICKER_handleLiveChatAction
            && typeof cProto.handleLiveChatAction === 'function' && !cProto.handleLiveChatAction45 && cProto.handleLiveChatAction.length === 1
            && typeof cProto.handleLiveChatActions === 'function' && !cProto.handleLiveChatActions45 && cProto.handleLiveChatActions.length === 1
            && typeof cProto.unshift === 'function' && cProto.unshift.length === 1
            && typeof cProto.handleMarkChatItemAsDeletedAction === 'function' && cProto.handleMarkChatItemAsDeletedAction.length === 1
            && typeof cProto.removeTickerItemById === 'function' && cProto.removeTickerItemById.length === 1
            && typeof cProto.handleMarkChatItemsByAuthorAsDeletedAction === 'function' && cProto.handleMarkChatItemsByAuthorAsDeletedAction.length === 1
            && typeof cProto.handleRemoveChatItemByAuthorAction === 'function' && cProto.handleRemoveChatItemByAuthorAction.length === 1
            ;

          if (do_amend_ticker_handleLiveChatAction_v3) {

            /*
                f.handleLiveChatActions = function(a) {
                    a.length && (a.forEach(this.handleLiveChatAction, this),
                    this.updateHighlightedItem(),
                    this.shouldAnimateIn = !0)
                }
                */

            /*

                f.handleLiveChatAction = function(a) {
                var b = y(a, PM)
                  , c = y(a, QM)
                  , d = y(a, OM)
                  , e = y(a, Yab);
                a = y(a, ibb);
                b && this.enableCreatorGoalRevamp ? this.unshift("tickerItems", b.item) : b ? this.unshift("items", b.item) : c ? this.handleMarkChatItemAsDeletedAction(c) : d ? this.removeTickerItemById(d.targetItemId) : e ? this.handleMarkChatItemsByAuthorAsDeletedAction(e) : a && this.handleRemoveChatItemByAuthorAction(a)
            }
            */

            const arr00 = new Array(1);
            arr00.forEach = () => { };
            arr00.push = (...args) => { return 1 + args.length };
            arr00.pop = () => { };
            arr00.shift = () => { };
            arr00.unshift = () => { };
            arr00.splice = () => [];
            cProto.handleLiveChatActionsArr0 = arr00;

            cProto.handleLiveChatActions58 = cProto.handleLiveChatActions;
            cProto.xGqq4mo = null;
            cProto.xGqq4Flg = 0;
            cProto.xGqq4moPreparePromise = null;
            cProto.xGqq4f = function () {
              if (this.xGqq4Flg === 2) {
                this.xGqq4Flg = 0;
                tickerPE(async () => { // avoid confliction with ticker generation
                  await this.xGqq4moPreparePromise; // just in case
                  const s = this.handleLiveChatActionsArr0;
                  try {
                    this.handleLiveChatActions58(s);
                  } catch (e) {
                    console.warn(e);
                  }
                  // console.log('xGqq4f done')
                });

              }
            }
            const liveActionQM = new WeakSet();
            let liveActionsLastTickerAction = null;
            const lastTickerActionM = new WeakSet();
            cProto.handleLiveChatActions = function (a) {
              // let promise = null;
              if (a && a.length) {
                /** @type {MutationObserver | null} */
                let mo = this.xGqq4mo;
                // console.log('xGqq4f aaaa')
                const hostElement = this.hostElement;
                if (hostElement instanceof HTMLElement) {
                  if (mo === null || (mo instanceof MutationObserver && this.xGqq4p !== hostElement.xGqq4q)) {
                    if (mo instanceof MutationObserver) {
                      mo.disconnect();
                      mo.takeRecords();
                    }
                    this.xGqq4mo = mo = new MutationObserver(() => {
                      this.xGqq4f();
                    })
                    const moid = `dm-${Date.now()}-${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;;
                    this.xGqq4p = moid;
                    hostElement.xGqq4q = moid;
                    mo.observe(hostElement, { subtree: true, childList: true });
                  }
                }
                for (const u of a) {
                  u && liveActionQM.add(u)
                }

                /** @type {Promise} */
                const pastPromise = this.xGqq4moPreparePromise || null;
                this.xGqq4moPreparePromise = (async () => {
                  try {
                    await pastPromise; // just in case
                    liveActionsLastTickerAction = null;
                    a.forEach(this.handleLiveChatAction, this);
                    if (liveActionsLastTickerAction) lastTickerActionM.add(liveActionsLastTickerAction)
                  } catch (e) { console.warn(e); } // Promise catch can make the promise always resolved
                  // now tickerPE can execute
                })();


                // console.log('xGqq4f bbbb')
                // promise = this.handleLiveChatAction_LastPromise;
                // const f = () => {
                //   const s = this.handleLiveChatActionsArr0;
                //   try {
                //     return this.handleLiveChatActions58(s);
                //   } catch (e) {
                //     console.warn(e);
                //   }
                // }
                // if (!promise) {
                //   f();
                // } else {
                //   promise.then(f);
                // }
              } else {
                return this.handleLiveChatActions58(a);
              }
            }

            // 12:17:05.748 PM
            // 12:17:05.785 v {name: 'addLiveChatTickerItemAction'}
            // 12:17:08.059 QM
            // 12:17:08.068 v {name: 'markChatItemAsDeletedAction'}
            // 12:17:09.123 OM
            // 12:17:09.133 v {name: 'removeChatItemAction'}
            // 12:17:11.566 Yab
            // 12:17:11.574 v {name: 'markChatItemsByAuthorAsDeletedAction'}
            // 12:17:14.272 ibb
            // 12:17:14.282 v {name: 'removeChatItemByAuthorAction'}

            const keyFilter = (a, keySet) => {
              if (typeof (a || 0) === 'object') {
                for (const k of Object.keys(a)) {
                  if (keySet.has(k)) {
                    return k;
                  }
                }
              }
              return null;
            }

            cProto.lcuJB = function () {
              this.ddnB8 = 1;
              let res = new Set();
              const pxy = new Proxy({}, {
                get(target, prop) {
                  res.add(prop);
                },
                set(target, prop, value) {
                  return true;
                }
              });
              this.handleLiveChatAction(pxy);
              this.ddnB8 = 0;
              return res.size > 0 ? res : null;
            }

            cProto.ddnB8 = 0;
            cProto.handleLiveChatAction58 = cProto.handleLiveChatAction;
            cProto.liveChatActionFilterKeys = null;
            cProto.handleLiveChatActionTM = new LimitedSizeMap(24);
            const tt0 = Date.now() - 100000;
            cProto.handleLiveChatAction = function (a) {
              if (this.ddnB8) return this.handleLiveChatAction58(a);
              const inQM = a && liveActionQM.delete(a); // true if added from handleLiveChatActions
              let keySet = this.liveChatActionFilterKeys;
              if (keySet === null) {
                const keys = this.lcuJB();
                this.liveChatActionFilterKeys = keySet = (keys || false);
              }
              if (!keySet) {
                if (!unexpectedErr) {
                  console.error(unexpectedErr = "************************ [YouTube Super Fast Chat] TickerRenderer:handleLiveChatAction keySet not found; ERR 0xF3D0 ************************");
                }
                return this.handleLiveChatAction58(a);
              }
              const key = keyFilter(a, keySet);
              if (!key) {
                return this.handleLiveChatAction58(a); // just by default
              }

              // ------ avoid duplicate items -------
              const item = ((a[key] || 0).item || 0);
              const ifk = item ? firstObjectKey(item) : null;
              const rendererItem = ifk ? item[ifk] : null;
              if (rendererItem && rendererItem.id) {
                const id = rendererItem.id || 0;
                if (typeof id === 'string') {
                  const map = this.handleLiveChatActionTM;
                  if (map) {
                    const mid = `${rendererItem.authorExternalChannelId}::${rendererItem.id}`;
                    const prevTime = map.get(mid);
                    const now = Date.now() - tt0;
                    map.removeSet(mid, now);
                    
                    if (prevTime > 0 && now - prevTime < 2400) {
                      console.log('handleLiveChatAction Repeated Item OK', rendererItem.id, rendererItem);
                      return; // skip
                    } else if (prevTime) {
                      console.log('handleLiveChatAction Repeated Item NG', mid, now, prevTime, rendererItem.id, rendererItem);
                    }
                    // map.removeSet(mid, now);
                  }
                }
              }
              // ------ avoid duplicate items -------

              if (inQM) {
                liveActionsLastTickerAction = a;
              }
              this.handleLiveChatAction_LastPromise = tickerPE(async () => {
                await this.xGqq4moPreparePromise; // avoid tickerPE is called before actions under looping in handleLiveChatActions
                const inLQM = lastTickerActionM.delete(a); // multiple candidates
                if (inLQM) this.xGqq4Flg = 2; // 2 to 2 in case two batches are added "in the same time"
                this.handleLiveChatAction58(a);
                // if (inLQM) await timelineResolve(); // timing split by marco event to make tickers generation in different 16ms frame
                // else await Promise.resolve();
                // await Promise.resolve();
                await timelineResolve(); // timing split by marco event to make tickers generation in different 16ms frame
              });
            }

          }

          if (RAF_FIX_keepScrollClamped) {

            // to be improved

            if (typeof cProto.keepScrollClamped === 'function' && !cProto.keepScrollClamped72 && fnIntegrity(cProto.keepScrollClamped) === '0.17.10') {

              cProto.keepScrollClamped72 = cProto.keepScrollClamped;
              cProto.keepScrollClamped = function () {

                const cnt = kRef(this);
                if (!cnt) return;
                if (!cnt.hostElement) return; // memory leakage. to be reviewed

                cnt._bound_keepScrollClamped = cnt._bound_keepScrollClamped || cnt.keepScrollClamped.bind(mWeakRef(cnt));
                cnt.scrollClampRaf = requestAnimationFrame(cnt._bound_keepScrollClamped);
                cnt.maybeClampScroll()
              }

              console.log('RAF_FIX: keepScrollClamped', tag, "OK")
            } else {

              assertor(() => fnIntegrity(cProto.keepScrollClamped, '0.17.10'));
              console.log('RAF_FIX: keepScrollClamped', tag, "NG")
            }

          }


          if (RAF_FIX_scrollIncrementally && typeof cProto.startScrolling === 'function' && typeof cProto.scrollIncrementally === 'function' && fnIntegrity(cProto.startScrolling) === '1.44.31' && '|1.78.45|1.82.43|1.43.31'.indexOf('|' + fnIntegrity(cProto.scrollIncrementally) + '|') >= 0) {
            // to be replaced by animator

            cProto.startScrolling = function (a) {

              const cnt = kRef(this);
              if (!cnt) return;
              if (!cnt.hostElement) return; // memory leakage. to be reviewed

              cnt.scrollStopHandle && cnt.cancelAsync(cnt.scrollStopHandle);
              cnt.asyncHandle && cancelAnimationFrame(cnt.asyncHandle);
              cnt.lastFrameTimestamp = cnt.scrollStartTime = performance.now();
              cnt.scrollRatePixelsPerSecond = a;
              cnt._bound_scrollIncrementally = cnt._bound_scrollIncrementally || cnt.scrollIncrementally.bind(mWeakRef(cnt));
              cnt.asyncHandle = requestAnimationFrame(cnt._bound_scrollIncrementally)
            };

            // related functions: startScrollBack, startScrollingLeft, startScrollingRight, etc.

            /**
             * 
             * // 2024.12.17
             * // https://www.youtube.com/s/desktop/f7495da0/jsbin/live_chat_polymer.vflset/live_chat_polymer.js

                f.startScrolling = function(a) {
                    this.scrollStopHandle && $u(this.scrollStopHandle);
                    this.asyncHandle && window.cancelAnimationFrame(this.asyncHandle);
                    this.scrollStartTime = performance.now();
                    this.lastFrameTimestamp = performance.now();
                    this.scrollRatePixelsPerSecond = a;
                    this.asyncHandle = window.requestAnimationFrame(this.scrollIncrementally.bind(this))
                }
                ;
                f.scrollIncrementally = function(a) {
                    var b = a - (this.lastFrameTimestamp || 0);
                    R(this.hostElement).querySelector(this.tickerBarQuery).scrollLeft += b / 1E3 * (this.scrollRatePixelsPerSecond || 0);
                    this.maybeClampScroll();
                    this.updateArrows();
                    this.lastFrameTimestamp = a;
                    R(this.hostElement).querySelector(this.tickerBarQuery).scrollLeft > 0 || this.scrollRatePixelsPerSecond && this.scrollRatePixelsPerSecond > 0 ? this.asyncHandle = window.requestAnimationFrame(this.scrollIncrementally.bind(this)) : this.stopScrolling()
                }
                ;
             * 
             */

            cProto.__getTickerBarQuery__ = function () {
              const tickerBarQuery = this.tickerBarQuery === '#items' ? this.$.items : this.hostElement.querySelector(this.tickerBarQuery);
              return tickerBarQuery;
            }

            cProto.scrollIncrementally = (RAF_FIX_scrollIncrementally === 2) ? function (a) {

              const cnt = kRef(this);
              if (!cnt) return;
              if (!cnt.hostElement) return; // memory leakage. to be reviewed

              const b = a - (cnt.lastFrameTimestamp || 0);
              const rate = cnt.scrollRatePixelsPerSecond
              const q = b / 1E3 * (rate || 0);

              const tickerBarQuery = cnt.__getTickerBarQuery__();
              const sl = tickerBarQuery.scrollLeft;
              // console.log(rate, sl, q)
              if (cnt.lastFrameTimestamp == cnt.scrollStartTime) {

              } else if (q > -1e-5 && q < 1e-5) {

              } else {
                let cond1 = sl > 0 && rate > 0 && q > 0;
                let cond2 = sl > 0 && rate < 0 && q < 0;
                let cond3 = sl < 1e-5 && sl > -1e-5 && rate > 0 && q > 0;
                if (cond1 || cond2 || cond3) {
                  tickerBarQuery.scrollLeft += q;
                  cnt.maybeClampScroll();
                  cnt.updateArrows();
                }
              }

              cnt.lastFrameTimestamp = a;
              cnt._bound_scrollIncrementally = cnt._bound_scrollIncrementally || cnt.scrollIncrementally.bind(mWeakRef(cnt));
              0 < tickerBarQuery.scrollLeft || rate && 0 < rate ? cnt.asyncHandle = requestAnimationFrame(cnt._bound_scrollIncrementally) : cnt.stopScrolling()
            } : function (a) {

              const cnt = kRef(this);
              if (!cnt) return;
              if (!cnt.hostElement) return; // memory leakage. to be reviewed

              const b = a - (cnt.lastFrameTimestamp || 0);
              const tickerBarQuery = cnt.__getTickerBarQuery__();
              tickerBarQuery.scrollLeft += b / 1E3 * (cnt.scrollRatePixelsPerSecond || 0);
              cnt.maybeClampScroll();
              cnt.updateArrows();
              cnt.lastFrameTimestamp = a;
              cnt._bound_scrollIncrementally = cnt._bound_scrollIncrementally || cnt.scrollIncrementally.bind(mWeakRef(cnt));
              0 < tickerBarQuery.scrollLeft || cnt.scrollRatePixelsPerSecond && 0 < cnt.scrollRatePixelsPerSecond ? cnt.asyncHandle = requestAnimationFrame(cnt._bound_scrollIncrementally) : cnt.stopScrolling()
            };

            console.log(`RAF_FIX: scrollIncrementally${RAF_FIX_scrollIncrementally}`, tag, "OK")
          } else {
            assertor(() => fnIntegrity(cProto.startScrolling, '1.44.31'));
            assertor(() => fnIntegrity(cProto.scrollIncrementally, '1.78.45'));
            console.log('cProto.startScrolling', cProto.startScrolling);
            console.log('cProto.scrollIncrementally', cProto.scrollIncrementally);
            console.log('RAF_FIX: scrollIncrementally', tag, "NG")
          }


          if (CLOSE_TICKER_PINNED_MESSAGE_WHEN_HEADER_CLICKED && typeof cProto.attached === 'function' && !cProto.attached37 && typeof cProto.detached === 'function' && !cProto.detached37) {

            cProto.attached37 = cProto.attached;
            cProto.detached37 = cProto.detached;

            let naohzId = 0;
            cProto.__naohzId__ = 0;
            cProto.attached = function () {
              Promise.resolve(this).then((cnt) => {

                const hostElement = cnt.hostElement || cnt;
                if (!(hostElement instanceof HTMLElement)) return;
                if (!HTMLElement.prototype.matches.call(hostElement, '.yt-live-chat-renderer')) return;
                const ironPage = HTMLElement.prototype.closest.call(hostElement, 'iron-pages.yt-live-chat-renderer');
                // or #chat-messages
                if (!ironPage) return;

                if (cnt.__naohzId__) removeEventListener.call(ironPage, 'click', cnt.messageBoxClickHandlerForFade, { capture: false, passive: true });
                if (naohzId > 1e9) naohzId = naohzId % 1e4;
                cnt.__naohzId__ = ++naohzId;
                ironPage.setAttribute('naohz', `${+cnt.__naohzId__}`);

                addEventListener.call(ironPage, 'click', cnt.messageBoxClickHandlerForFade, { capture: false, passive: true });
                
                cnt = null;

              });
              return this.attached37.apply(this, arguments);
            };
            cProto.detached = function () {
              Promise.resolve(this).then((cnt) => {

                const ironPage = document.querySelector(`iron-pages[naohz="${+cnt.__naohzId__}"]`);
                if (!ironPage) return;

                removeEventListener.call(ironPage, 'click', cnt.messageBoxClickHandlerForFade, { capture: false, passive: true });

                cnt = null;

              });
              return this.detached37.apply(this, arguments);
            };

            const clickFade = (u) => {
              u.click();
            };
            cProto.messageBoxClickHandlerForFade = async (evt) => {

              const target = (evt || 0).target || 0;
              if (!target) return;

              for (let p = target; p instanceof HTMLElement; p = nodeParent(p)) {
                const is = p.is;
                if (typeof is === 'string' && is) {

                  if (is === 'yt-live-chat-pinned-message-renderer') {
                    return;
                  }
                  if (is === 'iron-pages' || is === 'yt-live-chat-renderer' || is === 'yt-live-chat-app') {
                    const fade = HTMLElement.prototype.querySelector.call(p, 'yt-live-chat-pinned-message-renderer:not([hidden]) #fade');
                    if (fade) {
                      Promise.resolve(fade).then(clickFade);
                      evt && evt.stopPropagation();
                    }
                    return;
                  }
                  if (is !== 'yt-live-chat-ticker-renderer') {
                    if (is.startsWith('yt-live-chat-ticker-')) return;
                    if (!is.endsWith('-renderer')) return;
                  }

                } else {
                  if ((p.nodeName || '').includes('BUTTON')) return;
                }

              }
            };

            console.log("CLOSE_TICKER_PINNED_MESSAGE_WHEN_HEADER_CLICKED - OK")

          } else {
            console.log("CLOSE_TICKER_PINNED_MESSAGE_WHEN_HEADER_CLICKED - NG")
          }


        })();

        console.log("[End]");

        console.groupEnd();

      }).catch(console.warn);



      if (ENABLE_RAF_HACK_INPUT_RENDERER || DELAY_FOCUSEDCHANGED) {

        customElements.whenDefined("yt-live-chat-message-input-renderer").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-message-input-renderer hacks");
          console.log("[Begin]");
          (() => {



            const tag = "yt-live-chat-message-input-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }


            if (ENABLE_RAF_HACK_INPUT_RENDERER && rafHub !== null) {

              let doHack = false;
              if (typeof cProto.handleTimeout === 'function' && typeof cProto.updateTimeout === 'function') {

                // not cancellable

                // <<< to be reviewed cProto.updateTimeout --- isTimingFunctionHackable -- doHack >>>

                doHack = fnIntegrity(cProto.handleTimeout, '1.27.16') && fnIntegrity(cProto.updateTimeout, '1.50.33');

                if (!doHack) console.log('doHack = false')

              }
              // doHack = false; // M55

              if (doHack) {

                cProto.handleTimeout = function (a) {

                  const cnt = kRef(this);
                  if (!cnt) return;
                  if (!cnt.hostElement) return; // memory leakage. to be reviewed

                  console.log('cProto.handleTimeout', tag)
                  if (!cnt.boundUpdateTimeout38_) cnt.boundUpdateTimeout38_ = cnt.updateTimeout.bind(mWeakRef(cnt));
                  cnt.timeoutDurationMs = cnt.timeoutMs = a;
                  cnt.countdownRatio = 1;
                  0 === cnt.lastTimeoutTimeMs && rafHub.request(cnt.boundUpdateTimeout38_)
                };
                cProto.updateTimeout = function (a) {

                  const cnt = kRef(this);
                  if (!cnt) return;
                  if (!cnt.hostElement) return; // memory leakage. to be reviewed

                  console.log('cProto.updateTimeout', tag)
                  if (!cnt.boundUpdateTimeout38_) cnt.boundUpdateTimeout38_ = cnt.updateTimeout.bind(mWeakRef(cnt));
                  cnt.lastTimeoutTimeMs && (cnt.timeoutMs = Math.max(0, cnt.timeoutMs - (a - cnt.lastTimeoutTimeMs)),
                    cnt.countdownRatio = cnt.timeoutMs / cnt.timeoutDurationMs);
                  cnt.isAttached && cnt.timeoutMs ? (cnt.lastTimeoutTimeMs = a,
                    rafHub.request(cnt.boundUpdateTimeout38_)) : cnt.lastTimeoutTimeMs = 0
                };

                console.log('RAF_HACK_INPUT_RENDERER', tag, "OK")
              } else {

                console.log('typeof handleTimeout', typeof cProto.handleTimeout)
                console.log('typeof updateTimeout', typeof cProto.updateTimeout)

                console.log('RAF_HACK_INPUT_RENDERER', tag, "NG")
              }


            }

            if (DELAY_FOCUSEDCHANGED && typeof cProto.onFocusedChanged === 'function' && cProto.onFocusedChanged.length === 1 && !cProto.onFocusedChanged372) {
              cProto.onFocusedChanged372 = cProto.onFocusedChanged;
              cProto.onFocusedChanged = function (a) {
                Promise.resolve(this).then((cnt) => {
                  if (cnt.isAttached === true) cnt.onFocusedChanged372(a);
                  cnt = null;
                }).catch(console.warn);
              }
            }

          })();

          console.log("[End]");

          console.groupEnd();


        })

      }


      if (ENABLE_RAF_HACK_EMOJI_PICKER && rafHub !== null) {

        customElements.whenDefined("yt-emoji-picker-renderer").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-emoji-picker-renderer hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-emoji-picker-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            let doHack = false;
            if (typeof cProto.animateScroll_ === 'function') {

              // not cancellable
              console.log('animateScroll_', typeof cProto.animateScroll_)

              doHack = fnIntegrity(cProto.animateScroll_, '1.102.49')

            }

            if (doHack) {

              const querySelector = HTMLElement.prototype.querySelector;
              const U = (element) => ({
                querySelector: (selector) => querySelector.call(element, selector)
              });

              cProto.animateScroll_ = function (a) {

                const cnt = kRef(this);
                if (!cnt) return;
                if (!cnt.hostElement) return; // memory leakage. to be reviewed

                // console.log('cProto.animateScroll_', tag) // yt-emoji-picker-renderer
                if (!cnt.boundAnimateScroll39_) cnt.boundAnimateScroll39_ = cnt.animateScroll_.bind(mWeakRef(cnt));
                cnt.lastAnimationTime_ || (cnt.lastAnimationTime_ = a);
                a -= cnt.lastAnimationTime_;
                200 > a ? (U(cnt.hostElement).querySelector("#categories").scrollTop = cnt.animationStart_ + (cnt.animationEnd_ - cnt.animationStart_) * a / 200,
                  rafHub.request(cnt.boundAnimateScroll39_)) : (null != cnt.animationEnd_ && (U(cnt.hostElement).querySelector("#categories").scrollTop = cnt.animationEnd_),
                    cnt.animationEnd_ = cnt.animationStart_ = null,
                    cnt.lastAnimationTime_ = 0);
                cnt.updateButtons_()
              }

              console.log('ENABLE_RAF_HACK_EMOJI_PICKER', tag, "OK")
            } else {

              console.log('ENABLE_RAF_HACK_EMOJI_PICKER', tag, "NG")
            }

          })();

          console.log("[End]");

          console.groupEnd();
        });
      }

      if (ENABLE_RAF_HACK_DOCKED_MESSAGE && rafHub !== null) {

        customElements.whenDefined("yt-live-chat-docked-message").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-docked-message hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-docked-message"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            let doHack = false;
            if (typeof cProto.detached === 'function' && typeof cProto.checkIntersections === 'function' && typeof cProto.onDockableMessagesChanged === 'function' && typeof cProto.boundCheckIntersections === 'undefined') {

              // cancelable - this.intersectRAF <detached>
              // yt-live-chat-docked-message
              // boundCheckIntersections <-> checkIntersections
              // onDockableMessagesChanged
              //  this.intersectRAF = window.requestAnimationFrame(this.boundCheckIntersections);

              console.log('detached', typeof cProto.detached)
              console.log('checkIntersections', typeof cProto.checkIntersections)
              console.log('onDockableMessagesChanged', typeof cProto.onDockableMessagesChanged)

              doHack = fnIntegrity(cProto.detached, '0.32.22') && fnIntegrity(cProto.checkIntersections, '0.128.85') && fnIntegrity(cProto.onDockableMessagesChanged, '0.20.11')

            }

            if (doHack) {

              cProto.__boundCheckIntersectionsSubstitutionFn__ = function () {
                const cnt = this;
                if (!cnt.i5zmk && typeof cnt.boundCheckIntersections === 'function' && typeof cnt.checkIntersections === 'function') {
                  cnt.i5zmk = 1
                  cnt.boundCheckIntersections = cnt.checkIntersections.bind(mWeakRef(cnt));
                }
              }

              cProto.checkIntersections = function () {

                const cnt = kRef(this);
                if (!cnt) return;
                if (!cnt.hostElement) return; // memory leakage. to be reviewed

                if(typeof cnt.__boundCheckIntersectionsSubstitutionFn__ === 'function') cnt.__boundCheckIntersectionsSubstitutionFn__();

                // console.log('cProto.checkIntersections', tag)
                if (cnt.dockableMessages.length) {
                  cnt.intersectRAF = rafHub.request(cnt.boundCheckIntersections);
                  let a = cnt.dockableMessages[0]
                    , b = cnt.hostElement.getBoundingClientRect();
                  a = a.getBoundingClientRect();
                  let c = a.top - b.top
                    , d = 8 >= c;
                  c = 8 >= c - cnt.hostElement.clientHeight;
                  if (d) {
                    let e;
                    for (; d;) {
                      e = cnt.dockableMessages.shift();
                      d = cnt.dockableMessages[0];
                      if (!d)
                        break;
                      d = d.getBoundingClientRect();
                      c = d.top - b.top;
                      let f = 8 >= c;
                      if (8 >= c - a.height)
                        if (f)
                          a = d;
                        else
                          return;
                      d = f
                    }
                    cnt.dock(e)
                  } else
                    c && cnt.dockedItem && cnt.clear()
                } else
                  cnt.intersectRAF = 0
              }

              cProto.onDockableMessagesChanged = function () {
                const cnt = this;
                if(typeof cnt.__boundCheckIntersectionsSubstitutionFn__ === 'function') cnt.__boundCheckIntersectionsSubstitutionFn__();
                // console.log('cProto.onDockableMessagesChanged', tag) // yt-live-chat-docked-message
                cnt.dockableMessages.length && !cnt.intersectRAF && (cnt.intersectRAF = rafHub.request(cnt.boundCheckIntersections))
              }

              cProto.detached = function () {
                this.intersectRAF && rafHub.cancel(this.intersectRAF)
              }

              console.log('ENABLE_RAF_HACK_DOCKED_MESSAGE', tag, "OK")
            } else {

              console.log('ENABLE_RAF_HACK_DOCKED_MESSAGE', tag, "NG")
            }

          })();

          console.log("[End]");

          console.groupEnd();

        }).catch(console.warn);

      }

      if (FIX_SETSRC_AND_THUMBNAILCHANGE_) {

        customElements.whenDefined("yt-img-shadow").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-img-shadow hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-img-shadow"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            if (typeof cProto.thumbnailChanged_ === 'function' && !cProto.thumbnailChanged66_) {

              cProto.thumbnailChanged66_ = cProto.thumbnailChanged_;
              cProto.thumbnailChanged_ = function (a) {

                if (this.oldThumbnail_ && this.thumbnail && this.oldThumbnail_.thumbnails === this.thumbnail.thumbnails) return;
                if (!this.oldThumbnail_ && !this.thumbnail) return;

                return this.thumbnailChanged66_.apply(this, arguments)

              }
              console.log("cProto.thumbnailChanged_ - OK");

            } else {
              console.log("cProto.thumbnailChanged_ - NG");

            }
            if (typeof cProto.setSrc_ === 'function' && !cProto.setSrc66_) {

              cProto.setSrc66_ = cProto.setSrc_;
              cProto.setSrc_ = function (a) {
                if ((((this || 0).$ || 0).img || 0).src === a) return;
                return this.setSrc66_.apply(this, arguments)
              }

              console.log("cProto.setSrc_ - OK");
            } else {

              console.log("cProto.setSrc_ - NG");
            }

          })();

          console.log("[End]");

          console.groupEnd();

        }).catch(console.warn);

      }

      if (FIX_THUMBNAIL_DATACHANGED) {

        customElements.whenDefined("yt-live-chat-author-badge-renderer").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-author-badge-renderer hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-author-badge-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            if (typeof cProto.dataChanged === 'function' && !cProto.dataChanged86 && '|0.169.106|'.includes(`|${fnIntegrity(cProto.dataChanged)}|`)) {

              cProto.dataChanged86 = cProto.dataChanged;
              cProto.dataChanged = function () {

                /* 2024.12.15 */
                /*
                      zO.prototype.dataChanged = function() {
                        for (var a = Ov(R(this.hostElement).querySelector("#image")); a.firstChild; )
                            a.removeChild(a.firstChild);
                        if (this.data)
                            if (this.data.icon) {
                                var b = document.createElement("yt-icon");
                                this.data.icon.iconType === "MODERATOR" && this.enableNewModeratorBadge ? (b.polymerController.icon = "yt-sys-icons:shield-filled",
                                b.polymerController.defaultToFilled = !0) : b.polymerController.icon = "live-chat-badges:" + this.data.icon.iconType.toLowerCase();
                                a.appendChild(b)
                            } else if (this.data.customThumbnail) {
                                b = document.createElement("img");
                                var c;
                                (c = (c = UA(this.data.customThumbnail.thumbnails, 16)) ? Yb(kc(c)) : null) ? (b.src = c,
                                a.appendChild(b),
                                b.setAttribute("alt", this.hostElement.ariaLabel || "")) : Fq(new Zn("Could not compute URL for thumbnail",this.data.customThumbnail))
                            }
                        }
                  */

                const a = (this || 0).data;
                const image = ((this || 0).$ || 0).image;
                if (image && a && image.firstElementChild) {
                  const exisiting = image.firstElementChild;
                  if (exisiting === image.lastElementChild) {

                    if (a.icon && exisiting.nodeName.toUpperCase() === 'YT-ICON') {

                      const c = exisiting;
                      const t = insp(c);
                      const w = ('icon' in t || 'defaultToFilled' in t) ? t : c;
                      if ("MODERATOR" === a.icon.iconType && this.enableNewModeratorBadge) {
                        if (w.icon !== "yt-sys-icons:shield-filled") w.icon = "yt-sys-icons:shield-filled";
                        if (w.defaultToFilled !== true) w.defaultToFilled = true;
                      } else {
                        const p = "live-chat-badges:" + a.icon.iconType.toLowerCase();;
                        if (w.icon !== p) w.icon = p;
                        if (w.defaultToFilled !== false) w.defaultToFilled = false;
                      }
                      return;


                    } else if (a.customThumbnail && exisiting.nodeName.toUpperCase() == 'IMG') {

                      const c = exisiting;
                      if (a.customThumbnail.thumbnails.map(e => e.url).includes(c.src)) {

                        c.setAttribute("alt", this.hostElement.ariaLabel || "");
                        return;
                      }
                      /*

                        var d;
                        (d = (d = KC(a.customThumbnail.thumbnails, 16)) ? lc(oc(d)) : null) ? (c.src = d,

                        c.setAttribute("alt", this.hostElement.ariaLabel || "")) : lq(new tm("Could not compute URL for thumbnail", a.customThumbnail))
                        */
                    }

                  }
                }
                return this.dataChanged86.apply(this, arguments)

              }
              console.log("cProto.dataChanged - OK");

            } else if (typeof cProto.dataChanged === 'function' && !cProto.dataChanged86 && '|1.163.100|1.162.100|1.160.97|1.159.97|'.includes(`|${fnIntegrity(cProto.dataChanged)}|`)) {

              cProto.dataChanged86 = cProto.dataChanged;
              cProto.dataChanged = function (a) {

                /*

                  for (var b = xC(Z(this.hostElement).querySelector("#image")); b.firstChild; )
                      b.removeChild(b.firstChild);
                  if (a)
                      if (a.icon) {
                          var c = document.createElement("yt-icon");
                          "MODERATOR" === a.icon.iconType && this.enableNewModeratorBadge ? (c.icon = "yt-sys-icons:shield-filled",
                          c.defaultToFilled = !0) : c.icon = "live-chat-badges:" + a.icon.iconType.toLowerCase();
                          b.appendChild(c)
                      } else if (a.customThumbnail) {
                          c = document.createElement("img");
                          var d;
                          (d = (d = KC(a.customThumbnail.thumbnails, 16)) ? lc(oc(d)) : null) ? (c.src = d,
                          b.appendChild(c),
                          c.setAttribute("alt", this.hostElement.ariaLabel || "")) : lq(new tm("Could not compute URL for thumbnail",a.customThumbnail))
                      }

                */


                /* 2024.04.20 */
                /*
                  for (var b = Tx(N(this.hostElement).querySelector("#image")); b.firstChild; )
                      b.removeChild(b.firstChild);
                  if (a)
                      if (a.icon) {
                          var c = document.createElement("yt-icon");
                          "MODERATOR" === a.icon.iconType && this.enableNewModeratorBadge ? (c.polymerController.icon = "yt-sys-icons:shield-filled",
                          c.polymerController.defaultToFilled = !0) : c.polymerController.icon = "live-chat-badges:" + a.icon.iconType.toLowerCase();
                          b.appendChild(c)
                      } else if (a.customThumbnail) {
                          c = document.createElement("img");
                          var d;
                          (d = (d = WD(a.customThumbnail.thumbnails, 16)) ? Sb(ec(d)) : null) ? (c.src = d,
                          b.appendChild(c),
                          c.setAttribute("alt", this.hostElement.ariaLabel || "")) : nr(new mn("Could not compute URL for thumbnail",a.customThumbnail))
                      }
                */

                const image = ((this || 0).$ || 0).image
                if (image && a && image.firstElementChild) {
                  const exisiting = image.firstElementChild;
                  if (exisiting === image.lastElementChild) {

                    if (a.icon && exisiting.nodeName.toUpperCase() === 'YT-ICON') {

                      const c = exisiting;
                      const t = insp(c);
                      const w = ('icon' in t || 'defaultToFilled' in t) ? t : c;
                      if ("MODERATOR" === a.icon.iconType && this.enableNewModeratorBadge) {
                        if (w.icon !== "yt-sys-icons:shield-filled") w.icon = "yt-sys-icons:shield-filled";
                        if (w.defaultToFilled !== true) w.defaultToFilled = true;
                      } else {
                        const p = "live-chat-badges:" + a.icon.iconType.toLowerCase();;
                        if (w.icon !== p) w.icon = p;
                        if (w.defaultToFilled !== false) w.defaultToFilled = false;
                      }
                      return;


                    } else if (a.customThumbnail && exisiting.nodeName.toUpperCase() == 'IMG') {

                      const c = exisiting;
                      if (a.customThumbnail.thumbnails.map(e => e.url).includes(c.src)) {

                        c.setAttribute("alt", this.hostElement.ariaLabel || "");
                        return;
                      }
                      /*

                        var d;
                        (d = (d = KC(a.customThumbnail.thumbnails, 16)) ? lc(oc(d)) : null) ? (c.src = d,

                        c.setAttribute("alt", this.hostElement.ariaLabel || "")) : lq(new tm("Could not compute URL for thumbnail", a.customThumbnail))
                        */
                    }

                  }
                }
                return this.dataChanged86.apply(this, arguments)

              }
              console.log("cProto.dataChanged - OK");

            } else {
              assertor(() => fnIntegrity(cProto.dataChanged, '0.169.106'));
              console.log("cProto.dataChanged - NG");

            }

          })();

          console.log("[End]");

          console.groupEnd();

        }).catch(console.warn);


      }


      if (FIX_TOOLTIP_DISPLAY) {

        // ----------------------------------------------------------------------------------------------------

        const checkPDGet = (pd) => {
          return pd && pd.get && !pd.set && pd.enumerable && pd.configurable;
        }

        const tooltipUIWM = new WeakMap();
        const tooltipInitProps = {};
        const createTooltipIfRequired_ = function () {
          let r;
          if (tooltipUIWM.get(this) === void 0) {
            const w = document.createElement;
            let EU = null;
            tooltipUIWM.set(this, null);
            document.createElement = function () {
              let r = w.apply(this, arguments);
              EU = r;
              return r;
            };
            r = this.createTooltipIfRequired14_();
            document.createElement = w;
            if (EU instanceof HTMLElement && EU.is) {
              tooltipUIWM.set(this, EU);
              EU.setAttribute('__nogc__', ''); // avoid gc process script

              if (typeof EU.offset === 'number') tooltipInitProps['offset'] = EU.offset;
              if (typeof EU.fitToVisibleBounds === 'boolean') tooltipInitProps['fitToVisibleBounds'] = EU.fitToVisibleBounds;
              if (typeof EU.position === 'string') tooltipInitProps['position'] = EU.position;
              if (typeof EU.for === 'string') tooltipInitProps['for'] = EU.for;

              // this.__mcT__ = EU.outerHTML;
              // EU.__dataX = JSON.stringify(EU.__data);
              // EU.__dataY = Object.entries(EU);

              // <<< FOR DEBUG >>>
              // let kx;
              // Object.defineProperty(EU, '_target', {
              //   get(){
              //     return kx;
              //   },
              //   set(nv){
              //     kx= nv;
              //     debugger;
              //     return true;
              //   }
              // });
              // <<< FOR DEBUG >>>

              if (typeof Polymer !== 'undefined' && Polymer.__fixedGetOwnerRoot__ && Polymer.__fixedQuerySelector__) {

              } else {
                let eProto = null;
                const euCnt = insp(EU);
                if (checkPDGet(Object.getOwnPropertyDescriptor(euCnt.constructor.prototype || {}, 'target'))) {

                  eProto = euCnt.constructor.prototype;
                } else if (checkPDGet(Object.getOwnPropertyDescriptor(EU.constructor.prototype || {}, 'target'))) {

                  eProto = EU.constructor.prototype;
                }
                if (eProto) {
                  delete eProto.target;
                  /*

                      get target() {
                          var a = Pv(this).parentNode, b = Pv(this).getOwnerRoot(), c;
                          this.for ? c = Pv(b).querySelector("#" + this.for) : c = a.nodeType == Node.DOCUMENT_FRAGMENT_NODE ? b.host : a;
                          return c
                      },
                  */
                  Object.defineProperty(eProto, 'target', {
                    get() {
                      let a = this.parentNode, b = this.getRootNode();
                      return (this.for ? b.querySelector("#" + this.for) : a)
                    }
                  })
                }
              }
              // setInterval(()=>EU.updatePosition(), 100)

            } else {
              tooltipUIWM.set(this, null);
            }
          } else {
            r = this.createTooltipIfRequired14_();
          }

          const EU = tooltipUIWM.get(this);
          if (EU) {
            EU.remove();
            if (typeof tooltipInitProps.offset === 'number') EU['offset'] = tooltipInitProps.offset;
            if (typeof tooltipInitProps.fitToVisibleBounds === 'boolean') EU['fitToVisibleBounds'] = tooltipInitProps.fitToVisibleBounds;
            try {
              if (typeof tooltipInitProps.position === 'string') EU['position'] = tooltipInitProps.position;
              if (typeof tooltipInitProps.for === 'string') EU['for'] = tooltipInitProps.for; else delete EU.for;
            } catch (e) { }
          }
          return r;
        };


        // added in 2024.05.02
        getLCRDummy().then(async (lcrDummy) => {

          // console.log(8171, 99);
          const tag = "yt-live-chat-renderer"
          const dummy = lcrDummy;

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          /*
          <tp-yt-paper-tooltip class="style-scope yt-live-chat-author-badge-renderer" role="tooltip" tabindex="-1" style="--paper-tooltip-delay-in: 0ms; inset: -63.3984px auto auto 0px;
          */

          if (cProto && typeof cProto.createTooltipIfRequired_ === 'function' && cProto.createTooltipIfRequired_.length === 0 && !cProto.createTooltipIfRequired14_) {
            cProto.createTooltipIfRequired14_ = cProto.createTooltipIfRequired_;
            cProto.createTooltipIfRequired_ = createTooltipIfRequired_;
          }

        });

        // ----------------------------------------------------------------------------------------------------

        customElements.whenDefined("tp-yt-paper-tooltip").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | tp-yt-paper-tooltip hacks");
          console.log("[Begin]");
          (() => {

            const tag = "tp-yt-paper-tooltip"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            if (typeof cProto.attached === 'function' && typeof cProto.detached === 'function' && cProto._readyClients && cProto._attachDom && cProto.ready && !cProto._readyClients43) {

              cProto._readyClients43 = cProto._readyClients;
              cProto._readyClients = function () {
                // console.log(1238)

                let r = cProto._readyClients43.apply(this, arguments);
                if (this.$ && this.$$ && this.$.tooltip) this.root = null; // fix this.root = null != (b = a.root) ? b : this.host
                return r;
              }

              console.log("_readyClients - OK");

            } else {
              console.log("_readyClients - NG");

            }

            if (typeof cProto.show === 'function' && !cProto.show17) {
              cProto.show17 = cProto.show;
              cProto.show = function () {

                let r = this.show17.apply(this, arguments);
                this._showing === true && Promise.resolve(this).then((cnt) => {
                  const tooltip = (cnt.$ || 0).tooltip;

                  if (tooltip && tooltip.firstElementChild === null) {
                    let text = tooltip.textContent;
                    if (typeof text === 'string' && text.length >= 2) {
                      tooltip.textContent = text.trim();
                    }
                  }
                  cnt = null;
                }).catch(console.warn)
                return r;
              }

              console.log("trim tooltip content - OK");

            } else {
              console.log("trim tooltip content - NG");

            }


          })();

          console.log("[End]");

          console.groupEnd();

        }).catch(console.warn);

      }


      if (FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK) {

        const hookDocumentMouseDownSetupFn = () => {

          let muzTimestamp = 0;
          let nszDropdown = null;

          const handlerObject = {

            muHandler282: function (evt) {
              // console.log(evt, 7, document.querySelector('tp-yt-iron-dropdown[focused].style-scope.yt-live-chat-app'))
              if (!evt || !evt.isTrusted || !muzTimestamp) return;
              const dropdown = nszDropdown;
              muzTimestamp = 0;
              nszDropdown = null;

              const kurMPCe = kRef(currentMenuPivotWR) || 0;
              const hostElement = kurMPCe.hostElement || kurMPCe; // should be always hostElement === kurMPCe ?
              if (!hostElement.hasAttribute('menu-visible')) return;

              const chatBanner = HTMLElement.prototype.closest.call(hostElement, 'yt-live-chat-banner-renderer') || 0;
              if (chatBanner) return;

              if (dropdown && dropdown.positionTarget && hostElement.contains(dropdown.positionTarget)) {
                muzTimestamp = Date.now();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
                Promise.resolve(dropdown).then((dropdown) => {
                  dropdown.cancel();
                  dropdown = null;
                });
              }

            },

            mlHandler282: function (evt) {
              muzTimestamp = 0;
              nszDropdown = null;
            },

            ckHandler282: function (evt) {
              if (!evt || !evt.isTrusted || !muzTimestamp) return;
              if (Date.now() - muzTimestamp < 40) {
                muzTimestamp = Date.now();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
              }
            },

            tapHandler282: function (evt) {
              if (!evt || !evt.isTrusted || !muzTimestamp) return;
              if (Date.now() - muzTimestamp < 40) {
                muzTimestamp = Date.now();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
              }
            },

            handleEvent(evt) {
              if (evt) {
                const kurMPCe = kRef(currentMenuPivotWR) || 0;
                const kurMPCc = insp(kurMPCe);
                const hostElement = kurMPCc.hostElement || kurMPCc;
                if (!kurMPCc || kurMPCc.isAttached !== true || hostElement.isConnected !== true) return;
                switch (evt.type) {
                  case 'mouseup':
                    return this.muHandler282(evt);
                  case 'mouseleave':
                    return this.mlHandler282(evt);
                  case 'tap':
                    return this.tapHandler282(evt);
                  case 'click':
                    return this.ckHandler282(evt);
                }
              }
            }

          }

          document.addEventListener('mousedown', function (evt) {

            if (!evt || !evt.isTrusted || !evt.target) return;

            muzTimestamp = 0;
            nszDropdown = null;

            /** @type {HTMLElement | null} */
            const kurMP = kRef(currentMenuPivotWR);
            if (!kurMP) return;
            const kurMPCe = HTMLElement.prototype.closest.call(kurMP, '[menu-visible]') || 0; // element

            if (!kurMPCe || !kurMPCe.hasAttribute('whole-message-clickable')) return;

            const kurMPCc = insp(kurMPCe); // controller

            if (!kurMPCc.isClickableChatRow111 || !kurMPCc.isClickableChatRow111() || !HTMLElement.prototype.contains.call(kurMPCe, evt.target)) return;

            const chatBanner = HTMLElement.prototype.closest.call(kurMPCe, 'yt-live-chat-banner-renderer') || 0;
            if (chatBanner) return;

            let targetDropDown = null;
            for (const dropdown of document.querySelectorAll('tp-yt-iron-dropdown.style-scope.yt-live-chat-app')) {
              if (dropdown && dropdown.positionTarget === kurMP) {
                targetDropDown = dropdown;
              }
            }

            if (!targetDropDown) return;

            if ((nszDropdown = targetDropDown)) {
              muzTimestamp = Date.now();
              evt.stopImmediatePropagation();
              evt.stopPropagation();
              currentMenuPivotWR = mWeakRef(kurMPCe);

              const listenOpts = { capture: true, passive: false, once: true };

              // remove unexcecuted eventHandler
              document.removeEventListener('mouseup', handlerObject, listenOpts);
              document.removeEventListener('mouseleave', handlerObject, listenOpts);
              document.removeEventListener('tap', handlerObject, listenOpts);
              document.removeEventListener('click', handlerObject, listenOpts);

              // inject one time eventHandler to by pass events
              document.addEventListener('mouseup', handlerObject, listenOpts);
              document.addEventListener('mouseleave', handlerObject, listenOpts);
              document.addEventListener('tap', handlerObject, listenOpts);
              document.addEventListener('click', handlerObject, listenOpts);

            }

          }, true);

        }


        // yt-live-chat-paid-message-renderer ??

        /*

        [...(new Set([...document.querySelectorAll('*')].filter(e=>e.is&&('shouldSupportWholeItemClick' in e)).map(e=>e.is))).keys()]


        "yt-live-chat-ticker-paid-message-item-renderer"
        "yt-live-chat-ticker-paid-sticker-item-renderer"
        "yt-live-chat-paid-message-renderer"
        "yt-live-chat-text-message-renderer"
        "yt-live-chat-paid-sticker-renderer"

        */


        whenDefinedMultiple([

          "yt-live-chat-paid-message-renderer",
          "yt-live-chat-membership-item-renderer",
          "yt-live-chat-paid-sticker-renderer",
          "yt-live-chat-text-message-renderer",
          "yt-live-chat-auto-mod-message-renderer",

          /*
          "yt-live-chat-ticker-paid-message-item-renderer",
          "yt-live-chat-ticker-paid-sticker-item-renderer",
          "yt-live-chat-paid-message-renderer",
          "yt-live-chat-text-message-renderer",
          "yt-live-chat-paid-sticker-renderer",

          "yt-live-chat-ticker-sponsor-item-renderer",
          "yt-live-chat-banner-header-renderer",
          "ytd-sponsorships-live-chat-gift-purchase-announcement-renderer",
          "ytd-sponsorships-live-chat-header-renderer",
          "ytd-sponsorships-live-chat-gift-redemption-announcement-renderer",




          "yt-live-chat-auto-mod-message-renderer",
          "yt-live-chat-text-message-renderer",
          "yt-live-chat-paid-message-renderer",

          "yt-live-chat-legacy-paid-message-renderer",
          "yt-live-chat-membership-item-renderer",
          "yt-live-chat-paid-sticker-renderer",
          "yt-live-chat-donation-announcement-renderer",
          "yt-live-chat-moderation-message-renderer",
          "ytd-sponsorships-live-chat-gift-purchase-announcement-renderer",
          "ytd-sponsorships-live-chat-gift-redemption-announcement-renderer",
          "yt-live-chat-viewer-engagement-message-renderer",

          */


        ]).then(sTags => {
          // return; // M33

          if (FLAG_001e) return;

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-message-renderer(s)... hacks");
          console.log("[Begin]");
          let doMouseHook = false;

          const dProto = {
            isClickableChatRow111: function () {
              return (
                this.data && typeof this.shouldSupportWholeItemClick === 'function' && typeof this.hasModerationOverlayVisible === 'function' &&
                this.data.contextMenuEndpoint && this.wholeMessageClickable && this.shouldSupportWholeItemClick() && !this.hasModerationOverlayVisible()
              ); // follow .onItemTap(a)
            }
          };

          for (const sTag of sTags) { // ##tag##


            (() => {

              const tag = sTag;
              const dummy = document.createElement(tag);

              const cProto = getProto(dummy);
              if (!cProto || !cProto.attached) {
                console.warn(`proto.attached for ${tag} is unavailable.`);
                return;
              }

              const dCnt = insp(dummy);
              if ('wholeMessageClickable' in dCnt && typeof dCnt.hasModerationOverlayVisible === 'function' && typeof dCnt.shouldSupportWholeItemClick === 'function') {

                cProto.isClickableChatRow111 = dProto.isClickableChatRow111;

                const toHookDocumentMouseDown = typeof cProto.shouldSupportWholeItemClick === 'function' && typeof cProto.hasModerationOverlayVisible === 'function';

                if (toHookDocumentMouseDown) {
                  doMouseHook = true;
                }

                console.log("shouldSupportWholeItemClick Y", tag);

              } else {

                console.log("shouldSupportWholeItemClick N", tag);
              }


            })();

          }


          if (doMouseHook) {

            hookDocumentMouseDownSetupFn();

            console.log("FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK - Doc MouseEvent OK");
          }

          console.log("[End]");

          console.groupEnd();


        }).catch(console.warn);


        // https://www.youtube.com/watch?v=oQzFi1NO7io


      }

      if (NO_ITEM_TAP_FOR_NON_STATIONARY_TAP) {
        let targetElementCntWR = null;
        let _e0 = null;
        document.addEventListener('mousedown', (e) => {
          if (!e || !e.isTrusted) return;
          let element = e.target;
          for (; element instanceof HTMLElement; element = element.parentNode) {
            if (element.is) break;
          }
          if (!element || !element.is) return;
          const cnt = insp(element);
          if (typeof cnt.onItemTap === 'function') {
            cnt._onItemTap_isNonStationary = 0;
            const cProto = getProto(element);
            if (!cProto.onItemTap366 && typeof cProto.onItemTap === 'function' && cProto.onItemTap.length === 1) {
              cProto.onItemTap366 = cProto.onItemTap; // note: [onItemTap] .some(function(){...})
              cProto.onItemTap = function (a) {
                const t = this._onItemTap_isNonStationary;
                this._onItemTap_isNonStationary = 0;
                if (t > Date.now()) return;
                return this.onItemTap366.apply(this, arguments)
              }
            }
            _e0 = e;
            targetElementCntWR = mWeakRef(cnt);
          } else {
            _e0 = null;
            targetElementCntWR = null;
          }
        }, { capture: true, passive: true });

        document.addEventListener('mouseup', (e) => {
          if (!e || !e.isTrusted) return;
          const e0 = _e0;
          _e0 = null;
          if (!e0) return;
          const cnt = kRef(targetElementCntWR);
          targetElementCntWR = null;
          if (!cnt) return;
          if (e.timeStamp - e0.timeStamp > TAP_ACTION_DURATION) {
            cnt._onItemTap_isNonStationary = Date.now() + 40;
          } else if ((window.getSelection() + "").trim().replace(/[\u2000-\u200a\u202f\u2800\u200B\u200C\u200D\uFEFF]+/g, '').length >= 1) {
            cnt._onItemTap_isNonStationary = Date.now() + 40;
          } else {
            const dx = e.clientX - e0.clientX;
            const dy = e.clientY - e0.clientY;
            const dd = Math.sqrt(dx * dx + dy * dy);
            const ddmm = px2mm(dd);
            if (ddmm > 1.0) {
              cnt._onItemTap_isNonStationary = Date.now() + 40;
            } else {
              cnt._onItemTap_isNonStationary = 0;
            }
          }
        }, { capture: true, passive: true });

      }


      const __showContextMenu_assign_lock_with_external_unlock_ = function (targetCnt) {

        let rr = null;
        const p1 = new Promise(resolve => {
          rr = resolve;
        });

        const p1unlock = () => {
          const f = rr;
          if (f) {
            rr = null;
            f();
          }
        }

        return {
          p1,
          p1unlock,
          assignLock: (targetCnt, timeout) => {
            targetCnt.__showContextMenu_assign_lock__(p1);
            if (timeout) setTimeout(p1unlock, timeout);
          }
        }

      }

      if (PREREQUEST_CONTEXT_MENU_ON_MOUSE_DOWN) {

        document.addEventListener('mousedown', function (evt) {

          const maxloopDOMTreeElements = 4;
          const maxloopYtCompontents = 4;
          let j1 = 0;
          let j2 = 0;
          let target = (evt || 0).target || 0;
          if (!target) return;


          while (target instanceof HTMLElement) {
            if (++j1 > maxloopDOMTreeElements) break;
            if (typeof (target.is || insp(target).is || null) === 'string') break;
            target = nodeParent(target);
          }
          const components = [];
          while (target instanceof HTMLElement) {
            if (++j2 > maxloopYtCompontents) break;
            const cnt = insp(target);
            if (typeof (target.is || cnt.is || null) === 'string') {
              components.push(target);
            }
            if (typeof cnt.showContextMenu === 'function') break;
            target = target.parentComponent || cnt.parentComponent || null;
          }
          if (!(target instanceof HTMLElement)) return;
          const targetCnt = insp(target);
          if (typeof targetCnt.handleGetContextMenuResponse_ !== 'function' || typeof targetCnt.handleGetContextMenuError !== 'function') {
            console.log('Error Found: handleGetContextMenuResponse_ OR handleGetContextMenuError is not defined on a component with showContextMenu')
            return;
          }

          const endpoint = (targetCnt.data || 0).contextMenuEndpoint
          if (!endpoint) return;
          if (targetCnt.opened || !targetCnt.isAttached) return;

          if (typeof targetCnt.__cacheResolvedEndpointData__ !== 'function') {
            console.log(`preRequest for showContextMenu in ${targetCnt.is} is not yet supported.`)
          }

          const targetDollar = indr(target);

          let doPreRequest = false;
          if (components.length >= 2 && components[0].id === 'menu-button' && (targetDollar || 0)['menu-button'] === components[0]) {
            doPreRequest = true;
          } else if (components.length === 1 && components[0] === target) {
            doPreRequest = true;
          } else if (components.length >= 2 && components[0].id === 'author-photo' && (targetDollar || 0)['author-photo'] === components[0]) {
            doPreRequest = true;
          }
          if (doPreRequest === false) {
            console.log('doPreRequest = fasle on showContextMenu', components);
            return;
          }

          if (typeof targetCnt.__getCachedEndpointData__ !== 'function' || targetCnt.__getCachedEndpointData__(endpoint)) return;

          if ((typeof targetCnt.__showContextMenu_mutex_unlock_isEmpty__ === 'function') && !targetCnt.__showContextMenu_mutex_unlock_isEmpty__()) {
            console.log('preRequest on showContextMenu aborted due to stacked network request');
            return;
          }


          const onSuccess = (a) => {
            /*

              dQ() && (a = a.response);
              a.liveChatItemContextMenuSupportedRenderers && a.liveChatItemContextMenuSupportedRenderers.menuRenderer && this.showContextMenu_(a.liveChatItemContextMenuSupportedRenderers.menuRenderer);
              a.actions && Eu(this.hostElement, "yt-live-chat-actions", [a.actions])

            */

            a = a.response || a;

            if (!a) {
              console.log('unexpected error in prerequest for showContextMenu.onSuccess');
              return;
            }

            let z = null;
            a.liveChatItemContextMenuSupportedRenderers && a.liveChatItemContextMenuSupportedRenderers.menuRenderer && (z = a.liveChatItemContextMenuSupportedRenderers.menuRenderer);

            if (z) {
              a = z;
              targetCnt.__cacheResolvedEndpointData__(endpoint, a, true);
            }

          };
          const onFailure = (a) => {

            /*

              if (a instanceof Error || a instanceof Object || a instanceof String)
                  var b = a;
              hq(new xm("Error encountered calling GetLiveChatItemContextMenu",b))

            */

            targetCnt.__cacheResolvedEndpointData__(endpoint, null);
            // console.log('onFailure', a)

          };

          if (doPreRequest) {

            let propertyCounter = 0;
            const pm1 = __showContextMenu_assign_lock_with_external_unlock_(targetCnt);
            const p1Timeout = 800;
            const proxyKey = '__$$__proxy_to_this__$$__' + Date.now();

            try {

              const onSuccessHelperFn = function () {
                pm1.p1unlock();
                if (propertyCounter !== 5) {
                  console.log('Error in prerequest for showContextMenu.onSuccessHelperFn')
                  return;
                }
                if (this[proxyKey] !== targetCnt) {
                  console.log('Error in prerequest for showContextMenu.this');
                  return;
                }
                onSuccess(...arguments);
              };
              const onFailureHelperFn = function () {
                pm1.p1unlock();
                if (propertyCounter !== 5) {
                  console.log('Error in prerequest for showContextMenu.onFailureHelperFn')
                  return;
                }
                if (this[proxyKey] !== targetCnt) {
                  console.log('Error in prerequest for showContextMenu.this');
                  return;
                }
                onFailure(...arguments);

              }
              const fakeTargetCnt = new Proxy({
                __showContextMenu_forceNativeRequest__: 1,
                get handleGetContextMenuResponse_() {
                  propertyCounter += 2;
                  return onSuccessHelperFn;
                },
                get handleGetContextMenuError() {
                  propertyCounter += 3;
                  return onFailureHelperFn;
                }
              }, {
                get(_, key, receiver) {
                  if (key in _) return _[key];
                  if (key === proxyKey) return targetCnt;

                  let giveNative = false;
                  if (key in targetCnt) {
                    if (key === 'data') giveNative = true;
                    else if (typeof targetCnt[key] === 'function') giveNative = true;
                  }
                  if (giveNative) return targetCnt[key];
                }
              });

              const fakeEvent = (() => {
                const { target, bubbles, cancelable, cancelBubble, srcElement, timeStamp, defaultPrevented, currentTarget, composed } = evt;
                const nf = function () { }
                const [stopPropagation, stopImmediatePropagation, preventDefault] = [nf, nf, nf];

                return {
                  type: 'tap',
                  eventPhase: 0,
                  isTrusted: false,
                  __composed: true,
                  bubbles, cancelable, cancelBubble, timeStamp,
                  target, srcElement, defaultPrevented, currentTarget, composed,
                  stopPropagation, stopImmediatePropagation, preventDefault
                };
              })(evt);
              targetCnt.showContextMenu.call(fakeTargetCnt, fakeEvent);


            } catch (e) {
              console.warn(e);
              propertyCounter = 7;

            }
            if (propertyCounter !== 5) {
              console.log('Error in prerequest for showContextMenu', propertyCounter);
              return;
            }

            pm1.assignLock(targetCnt, p1Timeout);

          }






        }, true);


      }



      /*

      const w=new Set(); for(const a of document.getElementsByTagName('*')) if(a.showContextMenu && a.showContextMenu_) w.add(a.is||''); console.log([...w.keys()])

      */

      whenDefinedMultiple([
        "yt-live-chat-ticker-sponsor-item-renderer",
        "yt-live-chat-ticker-paid-message-item-renderer",

        "yt-live-chat-banner-header-renderer",
        "yt-live-chat-text-message-renderer",
        "ytd-sponsorships-live-chat-gift-purchase-announcement-renderer",
        "ytd-sponsorships-live-chat-header-renderer",
        "ytd-sponsorships-live-chat-gift-redemption-announcement-renderer",

        "yt-live-chat-paid-sticker-renderer",
        "yt-live-chat-viewer-engagement-message-renderer",
        "yt-live-chat-paid-message-renderer"




      ]).then(sTags => {

        if (FLAG_001f) return;

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | fixShowContextMenu");
        console.log("[Begin]");


        const __showContextMenu_mutex__ = new Mutex();
        let __showContextMenu_mutex_unlock__ = null;
        let lastShowMenuTarget = null;




        const wm37 = new WeakMap();

        const dProto = {


          // CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN

          __cacheResolvedEndpointData__: (endpoint, a, doDeepCopy) => {
            if (a) {
              if (doDeepCopy) a = deepCopy(a);
              wm37.set(endpoint, a);
            } else {
              wm37.remove(endpoint);
            }
          },
          __getCachedEndpointData__: function (endpoint) {
            endpoint = endpoint || (this.data || 0).contextMenuEndpoint || 0;
            if (endpoint) return wm37.get(endpoint);
            return null;
          },
          /** @type {(resolvedEndpoint: any) => void 0} */
          __showCachedContextMenu__: function (resolvedEndpoint) { // non-null

            resolvedEndpoint = deepCopy(resolvedEndpoint);
            // let b = deepCopy(resolvedEndpoint, ['trackingParams', 'clickTrackingParams'])
            Promise.resolve(resolvedEndpoint).then((resolvedEndpoint) => {
              this.__showContextMenu_skip_cacheResolvedEndpointData__ = 1;
              this.showContextMenu_(resolvedEndpoint);
              this.__showContextMenu_skip_cacheResolvedEndpointData__ = 0;
              resolvedEndpoint = null;
            });


          },



          showContextMenuForCacheReopen: function (a) {
            if (this && this.__showContextMenu_forceNativeRequest__) return this.showContextMenu37(a);
            if (!this || !this.isAttached) return; // in case; avoid Error: No provider for: InjectionToken(NETWORK_TOKEN) in _.showContextMenu
            if (!this.__showContextMenu_forceNativeRequest__) {
              const endpoint = (this.data || 0).contextMenuEndpoint || 0;
              if (endpoint) {
                const resolvedEndpoint = this.__getCachedEndpointData__(endpoint);
                if (resolvedEndpoint) {
                  this.__showCachedContextMenu__(resolvedEndpoint);
                  a && a.stopPropagation()
                  return;
                }
              }
            }
            return this.showContextMenu37(a);
          },

          showContextMenuForCacheReopen_: function (a) {
            if (this && this.__showContextMenu_forceNativeRequest__) return this.showContextMenu37_(a);
            if (!this || !this.isAttached) return; // in case; avoid Error: No provider for: InjectionToken(NETWORK_TOKEN) in _.showContextMenu
            if (!this.__showContextMenu_skip_cacheResolvedEndpointData__) {
              const endpoint = (this.data || 0).contextMenuEndpoint || 0;
              if (endpoint) {
                const f = this.__cacheResolvedEndpointData__;
                if (typeof f === 'function') f(endpoint, a, true);
              }
            }
            return this.showContextMenu37_(a);
          },

          // ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU

          showContextMenuWithDisableScroll: function (a) {

            const endpoint = (this.data || 0).contextMenuEndpoint || 0;
            if (endpoint && typeof this.is === 'string' && this.menuVisible === false && this.menuOpen === false) {

              const parentComponent = this.parentComponent;
              if (parentComponent && parentComponent.is === 'yt-live-chat-item-list-renderer' && parentComponent.contextMenuOpen === false && parentComponent.allowScroll === true) {
                parentComponent.contextMenuOpen = true; // computeAllowScroll_(contextMenuOpen, moderationModeEnabled): allowScroll = !(contextMenuOpen || moderationModeEnabled)
              }
            }

            return this.showContextMenu48.apply(this, arguments);

          },

          // ENABLE_MUTEX_FOR_SHOW_CONTEXT_MENU

          __showContextMenu_mutex_unlock_isEmpty__: () => {
            return __showContextMenu_mutex_unlock__ === null;
          },

          __showContextMenu_assign_lock__: function (p) {

            const mutex = __showContextMenu_mutex__;

            mutex.lockWith(unlock => {
              p.then(unlock);
              p = null;
              unlock = null;
            });

          },

          showContextMenuWithMutex: function (a) {
            if (this.__showContextMenu_forceNativeRequest__) return this.showContextMenu47(a);
            if (!this || !this.isAttached) return; // in case; avoid Error: No provider for: InjectionToken(NETWORK_TOKEN) in _.showContextMenu
            lastShowMenuTarget = this;
            const wNode = mWeakRef(this);


            const mutex = __showContextMenu_mutex__;

            mutex.lockWith(unlock => {
              const cnt = kRef(wNode);
              if (lastShowMenuTarget !== cnt || !cnt) {
                unlock();
                return;
              }

              setTimeout(unlock, 800); // in case network failure
              __showContextMenu_mutex_unlock__ = unlock;
              try {
                cnt.showContextMenu47(a);
              } catch (e) {
                console.warn(e);
                unlock(); // in case function script error
              }

            });


          },

          showContextMenuWithMutex_: function (a) {

            if (__showContextMenu_mutex_unlock__ && this === lastShowMenuTarget) {
              __showContextMenu_mutex_unlock__();
              __showContextMenu_mutex_unlock__ = null;
            }
            return this.showContextMenu47_(a);

          }

        }

        for (const tag of sTags) { // ##tag##

          (() => {

            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }


            if (CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN && typeof cProto.showContextMenu === 'function' && typeof cProto.showContextMenu_ === 'function' && !cProto.showContextMenu37 && !cProto.showContextMenu37_ && cProto.showContextMenu.length === 1 && cProto.showContextMenu_.length === 1) {
              cProto.showContextMenu37_ = cProto.showContextMenu_;
              cProto.showContextMenu37 = cProto.showContextMenu;
              cProto.__showContextMenu_forceNativeRequest__ = 0;
              cProto.__cacheResolvedEndpointData__ = dProto.__cacheResolvedEndpointData__
              cProto.__getCachedEndpointData__ = dProto.__getCachedEndpointData__
              cProto.__showCachedContextMenu__ = dProto.__showCachedContextMenu__
              cProto.showContextMenu = dProto.showContextMenuForCacheReopen;
              cProto.showContextMenu_ = dProto.showContextMenuForCacheReopen_;
              console.log("CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN - OK", tag);
            } else {
              console.log("CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN - NG", tag);
            }

            if (ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU && typeof cProto.showContextMenu === 'function' && typeof cProto.showContextMenu_ === 'function' && !cProto.showContextMenu48 && !cProto.showContextMenu48_ && cProto.showContextMenu.length === 1 && cProto.showContextMenu_.length === 1) {
              cProto.showContextMenu48 = cProto.showContextMenu;
              cProto.showContextMenu = dProto.showContextMenuWithDisableScroll;
              console.log("ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU - OK", tag);
            } else if (!ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU) {
              console.log("ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU - N/A", tag);
            } else {
              console.log("ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU - NG", tag);
            }


            if (ENABLE_MUTEX_FOR_SHOW_CONTEXT_MENU && typeof cProto.showContextMenu === 'function' && typeof cProto.showContextMenu_ === 'function' && !cProto.showContextMenu47 && !cProto.showContextMenu47_ && cProto.showContextMenu.length === 1 && cProto.showContextMenu_.length === 1) {
              cProto.showContextMenu47_ = cProto.showContextMenu_;
              cProto.showContextMenu47 = cProto.showContextMenu;
              cProto.__showContextMenu_mutex_unlock_isEmpty__ = dProto.__showContextMenu_mutex_unlock_isEmpty__;
              cProto.__showContextMenu_assign_lock__ = dProto.__showContextMenu_assign_lock__;
              cProto.showContextMenu = dProto.showContextMenuWithMutex;
              cProto.showContextMenu_ = dProto.showContextMenuWithMutex_;
              console.log("ENABLE_MUTEX_FOR_SHOW_CONTEXT_MENU - OK", tag);
            } else {
              console.log("ENABLE_MUTEX_FOR_SHOW_CONTEXT_MENU - NG", tag);
            }

          })();

        }

        console.log("[End]");

        console.groupEnd();

      }).catch(console.warn);



      customElements.whenDefined('tp-yt-iron-dropdown').then(() => {

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | tp-yt-iron-dropdown hacks");
        console.log("[Begin]");
        (() => {

          const tag = "tp-yt-iron-dropdown";
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          if (USE_VANILLA_DEREF && typeof cProto.__deraf === 'function' && cProto.__deraf.length === 2 && !cProto.__deraf34 && fnIntegrity(cProto.__deraf) === '2.42.24') {
            cProto.__deraf_hn__ = function (sId, fn) {
              const rhKey = `_rafHandler_${sId}`;
              const m = this[rhKey] || (this[rhKey] = new WeakMap());
              if (m.has(fn)) return m.get(fn);
              const resFn = () => {
                this.__rafs[sId] = null;
                fn.call(this)
              };
              m.set(fn, resFn);
              m.set(resFn, resFn);
              return resFn;
            };
            cProto.__deraf34 = cProto.__deraf;
            cProto.__deraf = function (a, b) { // sId, fn
              let c = this.__rafs;
              null !== c[a] && cancelAnimationFrame(c[a]);
              c[a] = requestAnimationFrame(this.__deraf_hn__(a, b));
            };
            console.log("USE_VANILLA_DEREF - OK");
          } else {
            console.log("USE_VANILLA_DEREF - NG");
          }

          if (FIX_DROPDOWN_DERAF && typeof cProto.__deraf === 'function' && cProto.__deraf.length === 2 && !cProto.__deraf66) {
            cProto.__deraf66 = cProto.__deraf;
            cProto.__deraf = function (sId, fn) {
              if (this.__byPassRAF__) {
                Promise.resolve(this).then((cnt) => {
                  fn.call(cnt);
                  cnt = null;
                });
              }
              let r = this.__deraf66.apply(this, arguments);
              return r;
            }
            console.log("FIX_DROPDOWN_DERAF - OK");
          } else {
            console.log("FIX_DROPDOWN_DERAF - NG");
          }


          if (BOOST_MENU_OPENCHANGED_RENDERING && typeof cProto.__openedChanged === 'function' && !cProto.__mtChanged__ && fnIntegrity(cProto.__openedChanged) === '0.46.20') {

            let lastClose = null;
            let lastOpen = null;
            let cid = 0;

            cProto.__mtChanged__ = function (b) {

              Promise.resolve(this).then((cnt) => {
                cnt._applyFocus();
                return cnt;
              }).then((cnt) => {
                b ? cnt._renderOpened() : cnt._renderClosed();
                cnt = null;
              }).catch(console.warn);

            };

            const __moChanged__ = () => {
              if (!cid) return;
              // console.log(553, !!lastOpen, !!lastClose);
              cid = 0;
              if (lastOpen && !lastClose && lastOpen.isAttached) {
                lastOpen.__mtChanged__(1)
              } else if (lastClose && !lastOpen && lastClose.isAttached) {
                lastClose.__mtChanged__(0);
              }
              lastOpen = null;
              lastClose = null;
            };


            if (typeof cProto._openedChanged === 'function' && !cProto._openedChanged66) {
              cProto._openedChanged66 = cProto._openedChanged;
              cProto._openedChanged = function () {
                // this.__byPassRAF__ = !lastOpen ? true : false; // or just true?
                this.__byPassRAF__ = true;
                let r = this._openedChanged66.apply(this, arguments);
                this.__byPassRAF__ = false;
                return r;
              }
            }

            const pSetGet = (key, pdThis, pdBase) => {
              // note: this is not really a standard way for the getOwnPropertyDescriptors; but it is sufficient to make the job done
              return {
                get: (pdThis[key] || 0).get || (pdBase[key] || 0).get,
                set: (pdThis[key] || 0).set || (pdBase[key] || 0).set
              };
            };

            cProto.__modifiedMenuPropsFn__ = function () {
              const pdThis = Object.getOwnPropertyDescriptors(this.constructor.prototype)
              const pdBase = Object.getOwnPropertyDescriptors(this)

              const pdAutoFitOnAttach = pSetGet('autoFitOnAttach', pdThis, pdBase);
              const pdExpandSizingTargetForScrollbars = pSetGet('expandSizingTargetForScrollbars', pdThis, pdBase);
              const pdAllowOutsideScroll = pSetGet('allowOutsideScroll', pdThis, pdBase);

              if (pdAutoFitOnAttach.get || pdAutoFitOnAttach.set) {
                console.warn('there is setter/getter for autoFitOnAttach');
                return;
              }
              if (pdExpandSizingTargetForScrollbars.get || pdExpandSizingTargetForScrollbars.set) {
                console.warn('there is setter/getter for expandSizingTargetForScrollbars');
                return;
              }
              if (!pdAllowOutsideScroll.get || !pdAllowOutsideScroll.set) {
                console.warn('there is NO setter-getter for allowOutsideScroll');
                return;
              }

              let { autoFitOnAttach, expandSizingTargetForScrollbars, allowOutsideScroll } = this;

              this.__AllowOutsideScrollPD__ = pdAllowOutsideScroll;

              const fitEnable = CHAT_MENU_REFIT_ALONG_SCROLLING === 2;

              Object.defineProperties(this, {
                autoFitOnAttach: {
                  get() {
                    if (fitEnable && this._modifiedMenuPropOn062__) return true;
                    return autoFitOnAttach;
                  },
                  set(nv) {
                    autoFitOnAttach = nv;
                    return true;
                  },
                  enumerable: true,
                  configurable: true
                }, expandSizingTargetForScrollbars: {
                  get() {
                    if (fitEnable && this._modifiedMenuPropOn062__) return true;
                    return expandSizingTargetForScrollbars;
                  },
                  set(nv) {
                    expandSizingTargetForScrollbars = nv;
                    return true;
                  },
                  enumerable: true,
                  configurable: true
                }, allowOutsideScroll: {
                  get() {
                    if (this._modifiedMenuPropOn062__) return true;
                    return allowOutsideScroll;
                  },
                  set(nv) {
                    allowOutsideScroll = nv;
                    this.__AllowOutsideScrollPD__.set.call(this, nv);
                    return true;
                  },
                  enumerable: true,
                  configurable: true
                }
              })
            };

            /*
               // ***** position() to be changed. *****
              tp-yt-iron-dropdown[class], tp-yt-iron-dropdown[class] #contentWrapper, tp-yt-iron-dropdown[class] ytd-menu-popup-renderer[class] {

                  overflow: visible !important;
                  min-width: max-content !important;
                  max-width: max-content !important;
                  max-height: max-content !important;
                  min-height: max-content !important;
                  white-space: nowrap;
              }

            */
            if (FIX_MENU_POSITION_N_SIZING_ON_SHOWN && typeof cProto.position === 'function' && !cProto.position34 && typeof cProto.refit === 'function') {

              let m34 = 0;
              cProto.__refitByPosition__ = function () {
                m34++;
                if (m34 <= 0) m34 = 0;
                if (m34 !== 1) return;
                const hostElement = this.hostElement || this;
                if (document.visibilityState === 'visible') {
                  const sizingTarget = this.sizingTarget;
                  if (!sizingTarget) {
                    m34 = 0;
                    return;
                  }
                  hostElement.setAttribute('rNgzQ', '');
                  sizingTarget.setAttribute('rNgzQ', '');

                  const gn = () => {
                    hostElement.removeAttribute('rNgzQ');
                    sizingTarget.removeAttribute('rNgzQ');
                  }

                  const an = async () => {
                    while (m34 >= 1) {
                      await renderReadyPn(sizingTarget);
                      if (this.opened && this.isAttached && sizingTarget.isConnected === true && sizingTarget === this.sizingTarget) {
                        if (sizingTarget.matches('ytd-menu-popup-renderer[slot="dropdown-content"].yt-live-chat-app')) this.refit();
                      }
                      m34--;
                    }
                    m34 = 0;
                    Promise.resolve().then(gn);
                  }
                  setTimeout(an, 4); // wait those resizing function calls


                } else {
                  m34 = 0;
                }
              }
              cProto.position34 = cProto.position
              cProto.position = function () {
                if (this._positionInitialize_) {
                  this._positionInitialize_ = 0;
                  this.__refitByPosition__();
                }
                let r = cProto.position34.apply(this, arguments);
                return r;
              }
              console.log("FIX_MENU_POSITION_ON_SHOWN - OK");

            } else {

              console.log("FIX_MENU_POSITION_ON_SHOWN - NG");

            }



            cProto.__openedChanged = function () {
              this._positionInitialize_ = 1;
              // this.removeAttribute('horizontal-align')
              // this.removeAttribute('vertical-align')
              if (typeof this.__menuTypeCheck__ !== 'boolean') {
                this.__menuTypeCheck__ = true;
                if (CHAT_MENU_SCROLL_UNLOCKING) {
                  this._modifiedMenuPropOn062__ = false;
                  // console.log(513, this.positionTarget && this.positionTarget.classList.contains('yt-live-chat-text-message-renderer'))
                  // this.autoFitOnAttach = true;
                  // this.expandSizingTargetForScrollbars = true;
                  // this.allowOutsideScroll = true;
                  // console.log(519,Object.getOwnPropertyDescriptors(this.constructor.prototype))
                  this.__modifiedMenuPropsFn__();
                  // this.constrain= function(){}
                  // this.position= function(){}

                  // this.autoFitOnAttach = true;
                  // this.expandSizingTargetForScrollbars = true;
                  // this.allowOutsideScroll = true;
                }
              }
              if (CHAT_MENU_SCROLL_UNLOCKING && this.opened) {
                let newValue = null;
                const positionTarget = this.positionTarget;
                if (positionTarget && positionTarget.classList.contains('yt-live-chat-text-message-renderer')) {
                  if (this._modifiedMenuPropOn062__ === false) {
                    newValue = true;
                  }
                } else if (this._modifiedMenuPropOn062__ === true) {
                  newValue = false;
                }
                if (newValue !== null) {
                  const beforeAllowOutsideScroll = this.allowOutsideScroll;
                  this._modifiedMenuPropOn062__ = newValue;
                  const afterAllowOutsideScroll = this.allowOutsideScroll;
                  if (beforeAllowOutsideScroll !== afterAllowOutsideScroll) this.__AllowOutsideScrollPD__.set.call(this, afterAllowOutsideScroll);
                }
              }

              if (this.opened) {

                Promise.resolve().then(() => {

                  this._prepareRenderOpened();
                }).then(() => {
                  this._manager.addOverlay(this);
                  if (this._manager._overlays.length === 1) {
                    lastOpen = this;
                    lastClose = null;
                  } else {
                    return 1;
                  }
                  // if (cid) {
                  //   clearTimeout(cid);
                  //   cid = -1;
                  //   this.__moChanged__();
                  //   cid = 0;
                  // } else {
                  //   cid = -1;
                  //   this.__moChanged__();
                  //   cid = 0;
                  // }
                  // cid = cid > 0 ? clearTimeout(cid) : 0;
                  // console.log(580, this.positionTarget && this.positionTarget.classList.contains('yt-live-chat-text-message-renderer'))
                  // cid = cid || setTimeout(__moChanged__, delay1);
                  cid = cid || requestAnimationFrame(__moChanged__);
                }).then((r) => {

                  if (r) this.__mtChanged__(1);
                }).catch(console.warn);

              } else {
                Promise.resolve().then(() => {
                  this._manager.removeOverlay(this);
                  if (this._manager._overlays.length === 0) {
                    lastClose = this;
                    lastOpen = null;
                  } else {
                    return 1;
                  }
                  // cid = cid > 0 ? clearTimeout(cid) : 0;
                  // console.log(581, this.positionTarget && this.positionTarget.classList.contains('yt-live-chat-text-message-renderer'))
                  // cid = cid || setTimeout(__moChanged__, delay1);
                  cid = cid || requestAnimationFrame(__moChanged__);
                }).then((r) => {
                  if (r) this.__mtChanged__(0);
                }).catch(console.warn);

              }

            }
            console.log("BOOST_MENU_OPENCHANGED_RENDERING - OK");

          } else {

            assertor(() => fnIntegrity(cProto.__openedChanged, '0.46.20'));
            console.log("FIX_MENU_REOPEN_RENDER_PERFORMANC_1 - NG");

          }


          if (FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK && typeof cProto.__openedChanged === 'function' && !cProto.__openedChanged82) {

            cProto.__openedChanged82 = cProto.__openedChanged;


            cProto.__openedChanged = function () {
              const positionTarget = this.positionTarget;
              currentMenuPivotWR = positionTarget ? mWeakRef(positionTarget) : null;
              return this.__openedChanged82.apply(this, arguments);
            }
          }


        })();

        console.log("[End]");

        console.groupEnd();

      }).catch(console.warn);



      FIX_ToggleRenderPolymerControllerExtractionBug && customElements.whenDefined('yt-live-chat-toggle-renderer').then(() => {

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-toggle-renderer hacks");
        console.log("[Begin]");
        (() => {

          const tag = "yt-live-chat-toggle-renderer";
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

        })();

        console.log("[End]");
        console.groupEnd();

      });




      /*





          var FU = function() {
              var a = this;
              this.nextHandle_ = 1;
              this.clients_ = {};
              this.JSC$10323_callbacks_ = {};
              this.unsubscribeAsyncHandles_ = {};
              this.subscribe = vl(function(b, c, d) {
                  var e = Geb(b);
                  if (e in a.clients_)
                      e in a.unsubscribeAsyncHandles_ && Jq.cancel(a.unsubscribeAsyncHandles_[e]);
                  else {
                      a: {
                          var h = Geb(b), l;
                          for (l in a.unsubscribeAsyncHandles_) {
                              var m = a.clients_[l];
                              if (m instanceof KO) {
                                  delete a.clients_[l];
                                  delete a.JSC$10323_callbacks_[l];
                                  Jq.cancel(a.unsubscribeAsyncHandles_[l]);
                                  delete a.unsubscribeAsyncHandles_[l];
                                  i6a(m);
                                  m.objectId_ = new FQa(h);
                                  m.register();
                                  d = m;
                                  break a
                              }
                          }
                          d.objectSource = b.invalidationId.objectSource;
                          d.objectId = h;
                          if (b = b.webAuthConfigurationData)
                              b.multiUserSessionIndex && (d.sessionIndex = parseInt(b.multiUserSessionIndex, 10)),
                              b.pageId && (d.pageId = b.pageId);
                          d = new KO(d,a.handleInvalidationData_.bind(a));
                          d.register()
                      }
                      a.clients_[e] = d;
                      a.JSC$10323_callbacks_[e] = {}
                  }
                  d = a.nextHandle_++;
                  a.JSC$10323_callbacks_[e][d] = c;
                  return d
              })
          };
          FU.prototype.unsubscribe = function(a, b) {
              var c = Geb(a);
              if (c in this.JSC$10323_callbacks_ && (delete this.JSC$10323_callbacks_[c][b],
              !this.JSC$10323_callbacks_[c].length)) {
                  var d = this.clients_[c];
                  b = Jq.run(function() {
                      ei(d);
                      delete this.clients_[c];
                      delete this.unsubscribeAsyncHandles_[c]
                  }
                  .bind(this));
                  this.unsubscribeAsyncHandles_[c] = b
              }
          }
          ;


      */


      const onManagerFound = (dummyManager) => {
        if (!dummyManager || typeof dummyManager !== 'object') return;

        const mgrProto = dummyManager.constructor.prototype;

        let keyCallbackStore = '';
        for (const [key, v] of Object.entries(dummyManager)) {
          if (key.includes('_callbacks_')) keyCallbackStore = key;
        }

        if (!keyCallbackStore || typeof mgrProto.unsubscribe !== 'function' || mgrProto.unsubscribe.length !== 2) return;

        if (mgrProto.unsubscribe16) return;

        mgrProto.unsubscribe16 = mgrProto.unsubscribe;

        groupCollapsed("YouTube Super Fast Chat", " | *live-chat-manager* hacks");
        console.log("[Begin]");

        const isEmptyObject = ((obj) => (firstKey(obj) === null));

        const idMapper = new Map();

        const convertId = function (objectId) {
          if (!objectId || typeof objectId !== 'string') return null;

          let result = idMapper.get(objectId)
          if (result) return result;
          result = atob(objectId.replace(/-/g, "+").replace(/_/g, "/"));
          idMapper.set(objectId, result)
          return result;
        }


        const rafHandleHolder = [];

        let pzw = 0;
        let lza = 0;
        const rafHandlerFn = () => {
          pzw = 0;
          if (rafHandleHolder.length === 1) {
            const f = rafHandleHolder[0];
            rafHandleHolder.length = 0;
            f();
          } else if (rafHandleHolder.length > 1) {
            const arr = rafHandleHolder.slice(0);
            rafHandleHolder.length = 0;
            for (const fn of arr) fn();
          }
        };


        if (CHANGE_MANAGER_UNSUBSCRIBE) {

          const checkIntegrityForSubscribe = (mgr) => {
            if (mgr
              && typeof mgr.unsubscribe16 === 'function' && mgr.unsubscribe16.length === 2
              && typeof mgr.subscribe18 === 'function' && (mgr.subscribe18.length === 0 || mgr.subscribe18.length === 3)) {

              const ns = new Set(Object.keys(mgr));
              const ms = new Set(Object.keys(mgr.constructor.prototype));

              if (ns.size >= 6 && ms.size >= 4) {
                // including 'subscribe18'
                // 'unsubscribe16', 'subscribe19'

                let r = 0;
                for (const k of ['nextHandle_', 'clients_', keyCallbackStore, 'unsubscribeAsyncHandles_', 'subscribe', 'subscribe18']) {
                  r += ns.has(k) ? 1 : 0;
                }
                for (const k of ['unsubscribe', 'handleInvalidationData_', 'unsubscribe16', 'subscribe19']) {
                  r += ms.has(k) ? 1 : 0;
                }
                if (r === 10) {
                  const isObject = (c) => (c || 0).constructor === Object;

                  if (isObject(mgr['clients_']) && isObject(mgr[keyCallbackStore]) && isObject(mgr['unsubscribeAsyncHandles_'])) {

                    return true;
                  }


                }

              }


            }
            return false;
          }

          mgrProto.subscribe19 = function (o, f, opts) {

            const ct_clients_ = this.clients_ || 0;
            const ct_handles_ = this.unsubscribeAsyncHandles_ || 0;

            if (this.__doCustomSubscribe__ !== true || !ct_clients_ || !ct_handles_) return this.subscribe18.apply(this, arguments);

            let objectId = ((o || 0).invalidationId || 0).objectId;
            if (!objectId) return this.subscribe18.apply(this, arguments);
            objectId = convertId(objectId);

            // console.log('subscribe', objectId, ct_clients_[objectId], arguments);

            if (ct_clients_[objectId]) {
              if (ct_handles_[objectId] < 0) delete ct_handles_[objectId];
            }

            return this.subscribe18.apply(this, arguments);
          }

          mgrProto.unsubscribe = function (o, d) {
            if (!this.subscribe18 && typeof this.subscribe === 'function') {
              this.subscribe18 = this.subscribe;
              this.subscribe = this.subscribe19;
              this.__doCustomSubscribe__ = checkIntegrityForSubscribe(this);
            }
            const ct_clients_ = this.clients_;
            const ct_handles_ = this.unsubscribeAsyncHandles_;
            if (this.__doCustomSubscribe__ !== true || !ct_clients_ || !ct_handles_) return this.unsubscribe16.apply(this, arguments);

            let objectId = ((o || 0).invalidationId || 0).objectId;
            if (!objectId) return this.unsubscribe16.apply(this, arguments);

            objectId = convertId(objectId);


            // console.log('unsubscribe', objectId, ct_clients_[objectId], arguments);

            const callbacks = this[keyCallbackStore] || 0;
            const callbackObj = callbacks[objectId] || 0;


            if (callbackObj && (delete callbackObj[d], isEmptyObject(callbackObj))) {
              const w = ct_clients_[objectId];
              --lza;
              if (lza < -1e9) lza = -1;
              const qta = lza;
              rafHandleHolder.push(() => {
                if (qta === ct_handles_[objectId]) {
                  const o = {
                    callbacks, callbackObj,
                    client: ct_clients_[objectId],
                    handle: ct_handles_[objectId]
                  };
                  let p = 0;
                  try {
                    if (ct_clients_[objectId] === w) {
                      w && "function" === typeof w.dispose && w.dispose();
                      delete ct_clients_[objectId];
                      delete ct_handles_[objectId];
                      p = 1;
                    } else {
                      // w && "function" === typeof w.dispose && w.dispose();
                      // delete ct_clients_[objectId];
                      // delete ct_handles_[objectId];
                      p = 2;
                    }
                  } catch (e) {
                    console.warn(e);
                  }
                  console.log(`unsubscribed: ${p}`, this, o);
                }
              });
              ct_handles_[objectId] = qta;
              if (pzw === 0) {
                pzw = requestAnimationFrame(rafHandlerFn);
              }
            }
          }


          console.log("CHANGE_MANAGER_UNSUBSCRIBE - OK")

        } else {

          console.log("CHANGE_MANAGER_UNSUBSCRIBE - NG")
        }

        console.log("[End]");

        console.groupEnd();

      }



      /*


              a.prototype.async = function(e, h) {
                  return 0 < h ? Iq.run(e.bind(this), h) : ~Kq.run(e.bind(this))
              }
              ;
              a.prototype.cancelAsync = function(e) {
                  0 > e ? Kq.cancel(~e) : Iq.cancel(e)
              }

      */


      (FASTER_ICON_RENDERING && Promise.all(
        [
          customElements.whenDefined("yt-icon-shape"),
          customElements.whenDefined("yt-icon")
          //  document.createElement('icon-shape'),
        ]
      )).then(() => {
        let cq = 0;
        let dummys = [document.createElement('yt-icon-shape'), document.createElement('yt-icon')]
        for (const dummy of dummys) {
          let cProto = getProto(dummy);
          if (cProto && typeof cProto.shouldRenderIconShape === 'function' && !cProto.shouldRenderIconShape571 && cProto.shouldRenderIconShape.length === 1) {
            assertor(() => fnIntegrity(cProto.shouldRenderIconShape, '1.70.38'));
            cq++;
            cProto.shouldRenderIconShape571 = cProto.shouldRenderIconShape;
            cProto.shouldRenderIconShape = function (a) {
              if (this.isAnimatedIcon) return this.shouldRenderIconShape571(a);
              if (!this.iconType || !this.iconShapeData) return this.shouldRenderIconShape571(a);
              if (!this.iconName) return this.shouldRenderIconShape571(a);
              return false;
              // console.log(1051, this.iconType)
              // console.log(1052, this.iconShapeData)
              // console.log(1053, this.isAnimatedIcon)
            }
          }
          // if(cProto && cProto.switchTemplateAtRegistration){
          //   cProto.switchTemplateAtRegistration = false;
          // }
        }
        if (cq === 1) {
          console.log("modified shouldRenderIconShape - Y")
        } else {
          console.log("modified shouldRenderIconShape - N", cq)
        }
      });

      customElements.whenDefined("yt-invalidation-continuation").then(() => {

        let __dummyManager__ = null;

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-invalidation-continuation hacks");
        console.log("[Begin]");
        (() => {

          const tag = "yt-invalidation-continuation"
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          const dummyManager = insp(dummy).manager_ || 0;
          __dummyManager__ = dummyManager;

          if (CHANGE_DATA_FLUSH_ASYNC && typeof cProto.async === 'function' && !cProto.async71 && cProto.async.length === 2 && typeof cProto.cancelAsync === 'function' && !cProto.cancelAsync71 && cProto.cancelAsync.length === 1) {


            const rafHub = new RAFHub();

            rafHub.keepRAF = true;
            cProto.async71 = cProto.async;
            cProto.cancelAsync71 = cProto.cancelAsync;

            // mostly for subscription timeoutMs 10000ms
            let mcw = 1; // 1, 3, 5, ...
            let arr = new Map();

            let __asyncInited__ = 0;
            let __timeoutStartId__ = null;
            const __asyncInit__ = () => {

              if (__asyncInited__) return;
              __asyncInited__ = 1;

              __timeoutStartId__ = setTimeout(() => { });
              mcw = __timeoutStartId__ * 2 + 1;

              setInterval(() => {

                if (!arr.length) return;

                const p = Date.now();
                let deleteKeys = [];
                arr.forEach((entry, key) => {


                  if (entry.cid === -1) {
                    entry.cid = -2;
                  } else if (entry.cid === -2) {

                    let offset = p - entry.add
                    if (offset < 0) offset = 0;
                    let delay2 = entry.delay - offset;
                    if (delay2 < 0) delay2 = 0;
                    entry.cid = setTimeout(entry.q(), delay2);
                    entry.q = null;

                  } else if (entry.add + entry.delay < p) {
                    deleteKeys.push(key);

                  }

                })

                for (const key of deleteKeys) arr.delete(key);

              }, 2000)

            }


            cProto.async = function (e, h) {

              if (!(0 < h)) return this.async71(e, h); // unknown timing Fn

              if (h < 8000) return this.async71(e, h) * 2; // native setTimeout

              if (typeof h !== 'number') return this.async71(e, h); // exceptional case


              if (!this.__asyncInited__) {
                this.__asyncInited__ = 1;
                __asyncInit__();
              }
              mcw += 2; // 2K+3, 2K+4, ...
              if (mcw > 1e9) mcw = mcw % 1e4;
              const cid = mcw;
              const q = () => {
                return () => {
                  console.log('async h > 8000');
                  e.call(this);
                }
              }
              // setTimeout(q, delay)
              arr.set(cid, {
                cid: -1, // -1 -> -2 -> cid
                add: Date.now(),
                q,
                delay: h
              });
              // console.log('cid-async', cid)
              return cid;

            }


            cProto.cancelAsync = function (e) {

              if (typeof e !== 'number') return this.cancelAsync71(e); // exceptional case

              // console.log('cid-unasync', e)

              if (0 > e) return this.cancelAsync71(e); // unknown timing fn

              if (e > __timeoutStartId__ * 2) { // __timeoutStartId__ is recorded and min is 2K+1

                if ((e % 2) === 0) return this.cancelAsync71(e / 2); // 2(K+1), 2(K+2), ...

                if (!arr.has(e)) return; // duplciated cancel

                const entry = arr.get(e);
                if (entry.cid < 0) {
                  entry.cid = 0;
                  arr.delete(e);
                } else {
                  clearTimeout(entry.cid); // cid >= 1
                  entry.cid = 0;
                  arr.delete(e);
                }

              } else {

                return this.cancelAsync71(e);

              }

            }

            console.log("CHANGE_DATA_FLUSH_ASYNC - OK");

          } else if(!CHANGE_DATA_FLUSH_ASYNC){
            console.log("CHANGE_DATA_FLUSH_ASYNC - N/A");
          } else {
            console.log("CHANGE_DATA_FLUSH_ASYNC - NG");

          }

        })();

        console.log("[End]");

        console.groupEnd();



        onManagerFound(__dummyManager__);

      }).catch(console.warn);


      if (INTERACTIVITY_BACKGROUND_ANIMATION >= 1) {

        customElements.whenDefined("yt-live-interactivity-component-background").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-interactivity-component-background hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-live-interactivity-component-background"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            cProto.__toStopAfterRun__ = function (hostElement) {
              let mo = new MutationObserver(() => {
                mo.disconnect();
                mo.takeRecords();
                mo = null;
                this.lottieAnimation && this.lottieAnimation.stop(); // primary
                foregroundPromiseFn().then(() => { // if the lottieAnimation is started with rAf triggering
                  this.lottieAnimation && this.lottieAnimation.stop(); // fallback
                });
              });
              mo.observe(hostElement, { subtree: true, childList: true });
            }

            if (INTERACTIVITY_BACKGROUND_ANIMATION >= 1 && typeof cProto.maybeLoadAnimationBackground === 'function' && !cProto.maybeLoadAnimationBackground77 && cProto.maybeLoadAnimationBackground.length === 0) {

              cProto.maybeLoadAnimationBackground77 = cProto.maybeLoadAnimationBackground;
              cProto.maybeLoadAnimationBackground = function () {
                let toRun = true;
                let stopAfterRun = false;
                if (!this.__bypassDisableAnimationBackground__) {
                  let doFix = false;
                  if (INTERACTIVITY_BACKGROUND_ANIMATION === 1) {
                    if (!this.lottieAnimation) {
                      doFix = true;
                    }
                  } else if (INTERACTIVITY_BACKGROUND_ANIMATION === 2) {
                    doFix = true;
                  }
                  if (doFix) {
                    if (this.useAnimationBackground === true) {
                      console.log('DISABLE_INTERACTIVITY_BACKGROUND_ANIMATION', this.lottieAnimation);
                    }
                    toRun = true;
                    stopAfterRun = true;
                  }
                }
                if (toRun) {
                  if (stopAfterRun && (this.hostElement instanceof HTMLElement)) {
                    this.__toStopAfterRun__(this.hostElement); // primary
                  }
                  const r = this.maybeLoadAnimationBackground77.apply(this, arguments);
                  if (stopAfterRun && this.lottieAnimation) {
                    this.lottieAnimation.stop(); // fallback if no mutation
                  }
                  return r;
                }
              }

              console.log(`INTERACTIVITY_BACKGROUND_ANIMATION(${INTERACTIVITY_BACKGROUND_ANIMATION}) - OK`);

            } else {
              console.log(`INTERACTIVITY_BACKGROUND_ANIMATION(${INTERACTIVITY_BACKGROUND_ANIMATION}) - NG`);

            }

          })();

          console.log("[End]");

          console.groupEnd();


        }).catch(console.warn);

      }


      if (DELAY_FOCUSEDCHANGED) {

        customElements.whenDefined("yt-live-chat-text-input-field-renderer").then(() => {


          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-text-input-field-renderer hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-text-input-field-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            if (DELAY_FOCUSEDCHANGED && typeof cProto.focusedChanged === 'function' && cProto.focusedChanged.length === 0 && !cProto.focusedChanged372) {
              cProto.focusedChanged372 = cProto.focusedChanged;
              cProto.focusedChanged = function () {
                Promise.resolve(this).then((cnt) => {
                  if (cnt.isAttached === true) cnt.focusedChanged372();
                });
              }
            }

          })();

          console.log("[End]");

          console.groupEnd();

        });

      }


    }




    promiseForCustomYtElementsReady.then(onRegistryReadyForDOMOperations);

    const fixJsonParse = () => {

      let p1 = window.onerror;

      try {
        JSON.parse("{}");
      } catch (e) {
        console.warn(e);
      }

      let p2 = window.onerror;

      if (p1 !== p2) {


        console.groupCollapsed(`%c${"YouTube Super Fast Chat"}%c${" | JS Engine Issue Found"}`,
          "background-color: #010502; color: #fe806a; font-weight: 700; padding: 2px;",
          "background-color: #010502; color: #fe806a; font-weight: 300; padding: 2px;"
        );

        console.warn("\nJSON.parse is hacked (e.g. Brave's script injection) which causes window.onerror changes on every JSON.parse call.\nPlease install https://greasyfork.org/scripts/473972-youtube-js-engine-tamer to fix the issue.\n");

        console.groupEnd();

      }

    }

    if (CHECK_JSONPRUNE) {
      promiseForCustomYtElementsReady.then(fixJsonParse);
    }

  });



})({ IntersectionObserver });
