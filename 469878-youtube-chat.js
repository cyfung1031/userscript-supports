// ==UserScript==
// @name                YouTube Super Fast Chat
// @version             0.31.0
// @license             MIT
// @name:ja             YouTube スーパーファーストチャット
// @name:zh-TW          YouTube 超快聊天
// @name:zh-CN          YouTube 超快聊天
// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/super-fast-chat.png
// @namespace           UserScript
// @match               https://www.youtube.com/live_chat*
// @match               https://www.youtube.com/live_chat_replay*
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
// @description         Ultimate Performance Boost for YouTube Live Chats
// @description:ja      YouTubeのライブチャットの究極のパフォーマンスブースト
// @description:zh-TW   YouTube直播聊天的終極性能提升
// @description:zh-CN   YouTube直播聊天的终极性能提升
//
// ==/UserScript==

((__CONTEXT__) => {
  'use strict';

  const ENABLE_REDUCED_MAXITEMS_FOR_FLUSH = true;         // TRUE to enable trimming down to MAX_ITEMS_FOR_FULL_FLUSH (25) messages when there are too many unrendered messages
  const MAX_ITEMS_FOR_TOTAL_DISPLAY = 90;                 // By default, 250 latest messages will be displayed, but displaying MAX_ITEMS_FOR_TOTAL_DISPLAY (90) messages is already sufficient.
  const MAX_ITEMS_FOR_FULL_FLUSH = 25;                    // If there are too many new (stacked) messages not yet rendered, clean all and flush MAX_ITEMS_FOR_FULL_FLUSH (25) latest messages then incrementally added back to MAX_ITEMS_FOR_TOTAL_DISPLAY (90) messages

  const ENABLE_NO_SMOOTH_TRANSFORM = true;                // Depends on whether you want the animation effect for new chat messages
  const USE_OPTIMIZED_ON_SCROLL_ITEMS = true;             // TRUE for the majority
  const USE_WILL_CHANGE_CONTROLLER = false;               // FALSE for the majority
  const ENABLE_DELAYED_CHAT_OCCURRENCE_PREFERRED = true;  // In Chrome, the rendering of new chat messages could be too fast for no smooth transform. 80ms delay of displaying new messages should be sufficient for element rendering.
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

  // images <Group#I01>
  const AUTHOR_PHOTO_SINGLE_THUMBNAIL = 1;  // 0 - disable; 1- smallest; 2- largest
  const EMOJI_IMAGE_SINGLE_THUMBNAIL = 1;   // 0 - disable; 1- smallest; 2- largest
  const LEAST_IMAGE_SIZE = 48;              // minium size = 48px

  const DO_LINK_PREFETCH = true;                      // DO NOT CHANGE
  // << if DO_LINK_PREFETCH >>
  const ENABLE_BASE_PREFETCHING = true;               // (SUB-)DOMAIN | dns-prefetch & preconnect
  const ENABLE_PRELOAD_THUMBNAIL = true;              // subresource (prefetch) [LINK for Images]
  const PREFETCH_LIMITED_SIZE_EMOJI = 512;            // DO NOT CHANGE THIS
  const PREFETCH_LIMITED_SIZE_AUTHOR_PHOTO = 68;      // DO NOT CHANGE THIS
  // << end >>

  const FIX_SETSRC_AND_THUMBNAILCHANGE_ = true;       // Function Replacement for yt-img-shadow....
  const FIX_THUMBNAIL_DATACHANGED = true;             // Function Replacement for yt-live-chat-author-badge-renderer..dataChanged
  // const REMOVE_PRELOADAVATARFORADDACTION = false;      // Function Replacement for yt-live-chat-renderer..preloadAvatarForAddAction

  const FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION = true;     // important [depends on <Group#I01>]
  const FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT = true;  // [depends on <Group#I01>]

  const ATTEMPT_ANIMATED_TICKER_BACKGROUND = 'steps'   // false OR '' for disabled, 'linear', 'steps' for easing-function
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
  // << end >>

  const FIX_TOOLTIP_DISPLAY = true;
  const USE_VANILLA_DEREF = true;
  const FIX_DROPDOWN_DERAF = true;                        // DONT CHANGE

  
  const FIX_MENU_REOPEN_RENDER_PERFORMANCE_1 = true;
  const FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK = true;
  // const FIX_MENU_CAPTURE_SCROLL = true;
  const CHAT_MENU_REFIT_ALONG_SCROLLING = 0;        // 0 for locking / default; 1 for unlocking only; 2 for unlocking and refit

  const RAF_FIX_keepScrollClamped = true;
  const RAF_FIX_scrollIncrementally = true;

  const FIX_MENU_POSITION_N_SIZING_ON_SHOWN = 1;       // correct size and position when the menu dropdown opens

  const CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN = true;


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

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

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
    opacity: 0.1 !important;
    opacity: 0.01 !important;
    opacity: 0.001 !important;
    opacity: 0.0001 !important;
    opacity: 0.00001 !important;
    opacity: 0.00000001 !important;

    pointer-events: none !important;
  }

  ${cssText10_show_more_blinker}

  `;


  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (this instanceof Window ? this : window);

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'mchbwnoasqph';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  if (!!ATTEMPT_ANIMATED_TICKER_BACKGROUND) {

    let te4 = setTimeout(() => { }); // dummy; skip timerId only;
    if (te4 < 3) {
      setTimeout(() => { });
      setTimeout(() => { });
    }

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

  function dr(s) {
    // reserved for future use
    return s;
    // return window.deWeakJS ? window.deWeakJS(s) : s;
  }

  const getProto = (element) => {
    if (element) {
      const cnt = element.inst || element;
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
  }


  console.assert(MAX_ITEMS_FOR_TOTAL_DISPLAY > 0 && MAX_ITEMS_FOR_FULL_FLUSH > 0 && MAX_ITEMS_FOR_TOTAL_DISPLAY > MAX_ITEMS_FOR_FULL_FLUSH)

  let ENABLE_DELAYED_CHAT_OCCURRENCE_CAPABLE = false;
  const isContainSupport = CSS.supports('contain', 'layout paint style');
  if (!isContainSupport) {
    console.warn("Your browser does not support css property 'contain'.\nPlease upgrade to the latest version.".trim());
  } else {
    ENABLE_DELAYED_CHAT_OCCURRENCE_CAPABLE = true;
  }

  let ENABLE_OVERFLOW_ANCHOR_CAPABLE = false;
  const isOverflowAnchorSupport = CSS.supports('overflow-anchor', 'auto');
  if (!isOverflowAnchorSupport) {
    console.warn("Your browser does not support css property 'overflow-anchor'.\nPlease upgrade to the latest version.".trim());
  } else {
    ENABLE_OVERFLOW_ANCHOR_CAPABLE = true;
  }

  const NOT_FIREFOX = !CSS.supports('-moz-appearance', 'none'); // 1. Firefox does not have the flicking issue; 2. Firefox's OVERFLOW_ANCHOR is less effective than Chromium's.

  const ENABLE_OVERFLOW_ANCHOR = ENABLE_OVERFLOW_ANCHOR_PREFERRED && ENABLE_OVERFLOW_ANCHOR_CAPABLE && ENABLE_NO_SMOOTH_TRANSFORM;
  const ENABLE_DELAYED_CHAT_OCCURRENCE = ENABLE_DELAYED_CHAT_OCCURRENCE_PREFERRED && ENABLE_DELAYED_CHAT_OCCURRENCE_CAPABLE && ENABLE_OVERFLOW_ANCHOR && ENABLE_NO_SMOOTH_TRANSFORM && NOT_FIREFOX;

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


  const flagsFnOnInterval = (ENABLE_FLAGS_MAINTAIN_STABLE_LIST || ENABLE_FLAGS_REUSE_COMPONENTS) ? (() => {

    const flags = () => {
      try {
        return ytcfg.data_.EXPERIMENT_FLAGS;
      } catch (e) { }
      return null;
    };

    const flagsForced = () => {
      try {
        return ytcfg.data_.EXPERIMENTS_FORCED_FLAGS;
      } catch (e) { }
      return null;
    };

    const flagsFn = (EXPERIMENT_FLAGS) => {

      if (!EXPERIMENT_FLAGS) return;

      if (ENABLE_FLAGS_MAINTAIN_STABLE_LIST) {
        if (USE_MAINTAIN_STABLE_LIST_ONLY_WHEN_KS_FLAG_IS_SET ? EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list === true : true) {
          EXPERIMENT_FLAGS.kevlar_tuner_should_test_maintain_stable_list = true;
          EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list = true;
        }
      }

      if (ENABLE_FLAGS_REUSE_COMPONENTS) {
        EXPERIMENT_FLAGS.kevlar_tuner_should_test_reuse_components = true;
        EXPERIMENT_FLAGS.kevlar_tuner_should_reuse_components = true;
      }

    };

    const uf = (EXPERIMENT_FLAGS) => {
      if (EXPERIMENT_FLAGS === undefined) EXPERIMENT_FLAGS = flags();
      if (EXPERIMENT_FLAGS) {
        flagsFn(EXPERIMENT_FLAGS);
        flagsFn(flagsForced());
      }
    }

    uf();

    const flagsFnOnInterval = (setInterval, clearInterval) => {

      uf();
      let cidFlags = 0;
      let kd = 0;
      new Promise(flagResolve => {

        const flagTimer = () => {
          const EXPERIMENT_FLAGS = flags();
          if (!EXPERIMENT_FLAGS) return;
          uf(EXPERIMENT_FLAGS);
          if (kd > 0) return;
          kd = 1;
          const delay1000 = new Promise(resolve => setTimeout(resolve, 1000));
          const moDeferred = new Promise(resolve => {
            let mo = new MutationObserver(() => {
              if (mo) {
                mo.disconnect();
                mo.takeRecords();
                mo = null;
                resolve();
              }
            });
            mo.observe(document, { subtree: true, childList: true });
          });
          Promise.race([delay1000, moDeferred]).then(flagResolve);
        };

        uf();
        cidFlags = setInterval(flagTimer, 1);
      }).then(() => {
        if (cidFlags > 0) clearInterval(cidFlags);
        cidFlags = 0;
        uf();
      });

    }

    return flagsFnOnInterval;

  })() : null;

  let kptPF = null;
  const emojiPrefetched = new Set();
  const authorPhotoPrefetched = new Set();

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
      const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval } = fc;
      const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      res.animate = HTMLElement.prototype.animate;
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  cleanContext(win).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, animate } = __CONTEXT__;

    let aeConstructor = null;

    // << if ENABLE_VIDEO_PROGRESS_STATE_FIX >>
    let pairForPauseResume = 0; // each increasion = number of ticker
    let pairForPauseResumeM = 0;
    // << end >>

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
            if (this.funcs.size === 0) {
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

    if (flagsFnOnInterval) flagsFnOnInterval(setInterval, clearInterval);

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



      const spliceIndicesFunc = (beforeParticipants, participants, idsBefore, idsAfter) => {

        const handler1 = {
          get(target, prop, receiver) {
            if (prop === 'object') {
              return participants; // avoid memory leakage
            }
            if (prop === 'type') {
              return 'splice';
            }
            return target[prop];
          }
        };
        const releaser = () => {
          participants = null;
        }

        let foundsForAfter = foundMap(idsAfter, idsBefore);
        let foundsForBefore = foundMap(idsBefore, idsAfter);

        let indexSplices = [];
        let contentUpdates = [];
        for (let i = 0, j = 0; i < foundsForBefore.length || j < foundsForAfter.length;) {
          if (beforeParticipants[i] === participants[j]) {
            i++; j++;
          } else if (idsBefore[i] === idsAfter[j]) {
            // content changed
            contentUpdates.push({ indexI: i, indexJ: j })
            i++; j++;
          } else {
            let addedCount = 0;
            for (let q = j; q < foundsForAfter.length; q++) {
              if (foundsForAfter[q] === false) addedCount++;
              else break;
            }
            let removedCount = 0;
            for (let q = i; q < foundsForBefore.length; q++) {
              if (foundsForBefore[q] === false) removedCount++;
              else break;
            }
            if (!addedCount && !removedCount) {
              throw 'ERROR(0xFF32): spliceIndicesFunc';
            }
            indexSplices.push(new Proxy({
              index: j,
              addedCount: addedCount,
              removed: removedCount >= 1 ? beforeParticipants.slice(i, i + removedCount) : []
            }, handler1));
            i += removedCount;
            j += addedCount;
          }
        }
        foundsForBefore = null;
        foundsForAfter = null;
        idsBefore = null;
        idsAfter = null;
        beforeParticipants = null;
        return { indexSplices, contentUpdates, releaser };

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

        const cnt = this; // "yt-live-chat-participant-list-renderer"
        mutexParticipants.lockWith(lockResolve => {

          const participants00 = cnt.participantsManager.participants;

          if (tid !== uvid || typeof (participants00 || 0).splice !== 'function') {
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

            let { indexSplices, contentUpdates, releaser } = spliceIndicesFunc(beforeParticipants, participants, idsBefore, idsAfter);

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
                releaser();
                releaser = null;
                cnt.__notifyPath5036__("participantsManager.participants.length",
                  participants.length
                );

              });

              await Promise.resolve(0); // play safe for the change of 'length'
              countOfElements = cnt.__getAllParticipantsDOMRenderedLength__();

              let wrongSize = participants.length !== countOfElements
              if (wrongSize) {
                console.warn("ERROR(0xE2C3): notifyPath7081", beforeParticipants.length, participants.length, doms.length)
                return 0;
              }

              res = 2 | 4;

            } else {

              indexSplices = null;
              releaser();
              releaser = null;

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
          const s = fiRSCB.split('.');
          if (s[0] === '0' && +s[1] > 381 && +s[1] < 391 && +s[2] > 228 && +s[2] < 238) {
            console.log(`flushRenderStamperComponentBindings_ ### ${fiRSCB} ### - OK`);
          } else {
            console.log(`flushRenderStamperComponentBindings_ ### ${fiRSCB} ### - Failed`);
          }
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
          const cnt = hostElement.inst || hostElement;
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
            if ((s.inst || s).isAttached === true) {
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
          requestAnimationFrame(() => {
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
        requestAnimationFrame(() => {
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
            requestAnimationFrame(() => {
              // foreground page
              // page visibly ready -> load the latest comments at initial loading
              const lcRenderer = lcRendererElm();
              if (lcRenderer) {
                (lcRenderer.inst || lcRenderer).scrollToBottom_();
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

      const mutFn = (items) => {
        for (let node = nLastElem(items); node !== null; node = nPrevElem(node)) {
          if (node.hasAttribute('wSr93')) break;
          node.setAttribute('wSr93', '');
          visObserver.observe(node);
        }
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
          ENABLE_DELAYED_CHAT_OCCURRENCE && bnForDelayChatOccurrence();
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

          // let div = document.createElement('div');
          // div.id = 'qwcc';
          // HTMLElement.prototype.appendChild.call(document.querySelector('yt-live-chat-item-list-renderer'), div )
          // bufferRegion =div;

          // buffObserver.takeRecords();
          // buffObserver.disconnect();
          // buffObserver.observe(div,  {
          //     childList: true,
          //     subtree: false
          // })

          if (ENABLE_DELAYED_CHAT_OCCURRENCE && isFirstList) {

            promiseForCustomYtElementsReady.then(() => {

              customElements.whenDefined('yt-live-chat-text-message-renderer').then(() => {




                setTimeout(() => {

                  /** @type {HTMLTemplateElement} */
                  let skz = document.createElement('yt-live-chat-text-message-renderer');

                  let cz1 = null;

                  if (skz && 'data' in skz && 'attached' in skz) {

                    const deferredZy1 = new Promise(resolve => {

                      skz.attached = function () {
                        cz1 = HTMLElement.prototype.querySelector.call(skz, '#message img') !== null;
                        resolve(skz.textContent);
                      }
                      skz.detached = function () {

                      }

                    });
                    skz.id = 'sk35z';
                    skzData(skz);


                    sk35zResolveFn = null;
                    const deferredMutation = new Promise(resolve => {
                      sk35zResolveFn = resolve;
                      HTMLElement.prototype.appendChild.call(m2, skz);
                    });

                    Promise.all([deferredZy1, deferredMutation]).then(async (res) => {
                      const [zy1, _] = res;
                      function fn() {
                        const zy2 = skz.textContent;
                        const cz2 = HTMLElement.prototype.querySelector.call(skz, '#message img') !== null;
                        if (typeof zy1 === 'string' && typeof zy2 === 'string') {
                          allowDontRender = zy1 === zy2 && cz1 === cz2; // '0:43N​em2oji'
                        }
                        if (allowDontRender === false) {

                          console.groupCollapsed(`%c${"YouTube Super Fast Chat"}%c${" | Incompatibility Found"}`,
                            "background-color: #010502; color: #fe806a; font-weight: 700; padding: 2px;",
                            "background-color: #010502; color: #fe806a; font-weight: 300; padding: 2px;"
                          );

                          console.warn(`%cWarning:\n\tYou might have added a userscript or extension that stops YouTube Super Fast Chat's quick loading.\n\tTo figure out which one affects the script, turn them off one by one and let the author know.`, 'color: #bada55');

                          console.groupEnd();
                        } else if (allowDontRender === true) {
                          return true;
                        }
                      }
                      await new Promise(r => setTimeout(r, 1));
                      if (fn()) {
                        await new Promise(r => requestAnimationFrame(r));
                        if (fn()) {
                          skz.remove();
                          skz.textContent = '';
                          console.log('%cALLOW_DELAYED_CHAT_OCCURRENCE', 'background-color: #16c450; color: #102624; padding: 2px 4px');
                        }
                      }
                    });

                  }

                }, 1);

              }).catch(console.warn);

            })

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

              if (typeof cProto.handlePostMessage_ === 'function' && !cProto.handlePostMessage66_) {

                cProto.handlePostMessage66_ = cProto.handlePostMessage_;

                cProto.handlePostMessage_ = function (a) {

                  const da = (a || 0).data || 0;
                  if (typeof da === 'object') {

                    // console.log('handlePostMessage_', da)
                    const qc = da['yt-player-state-change'];
                    if (qc === 3) { // pause
                      pairForPauseResume++;
                      pairForPauseResumeM++;
                    } else if (qc === 1) { // pause
                      pairForPauseResume++;
                      pairForPauseResumeM++;
                    } else if (qc === 2) {
                      pairForPauseResume++;
                      pairForPauseResumeM++;
                    }
                    if (pairForPauseResume > 1e9) pairForPauseResume = pairForPauseResume % 1e4;
                    if (pairForPauseResumeM > 1e9) pairForPauseResumeM = pairForPauseResumeM % 1e4;
                    return this.handlePostMessage66_(a);

                  }


                }

              }


            })();

          }

          if (isFirstList && DO_CHECK_TICKER_BACKGROUND_OVERRIDED) {
            setTimeout(() => {
              if (!hasTimerModified) return;
              const tickerRenderer = document.querySelector('#ticker yt-live-chat-ticker-renderer.style-scope.yt-live-chat-renderer');
              if (!tickerRenderer) return;

              const items = (tickerRenderer.$ || 0).items || 0;
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
              items.appendChild(dummy777);
              Promise.resolve(dummy777).then((dummy777) => {
                let container = HTMLElement.prototype.querySelector.call(dummy777, '#container') || 0;
                if (container.isConnected === true) {

                  const evaluated = `${window.getComputedStyle(container).background}`;

                  container = null;
                  dummy777.remove();
                  dummy777.textContent = '';
                  dummy777 = null;

                  if (evaluated.indexOf('0.') < 4) {

                    // not fulfilling
                    // rgba(0, 0, 0, 0.004) none repeat scroll 0% 0% / auto padding-box border-box

                    console.groupCollapsed(`%c${"YouTube Super Fast Chat"}%c${" | Incompatibility Found"}`,
                      "background-color: #010502; color: #fe806a; font-weight: 700; padding: 2px;",
                      "background-color: #010502; color: #fe806a; font-weight: 300; padding: 2px;"
                    );
                    console.warn(`%cWarning:\n\tYou might have added a userscript or extension that also modifies the ticker background.\n\tYouTube Super Fast Chat is taking over.`, 'color: #bada55');
                    console.groupEnd();

                    console.log('%cALLOW_ADVANCED_ANIMATED_TICKER_BACKGROUND (Overriding other scripting)', 'background-color: #7eb32b; color: #102624; padding: 2px 4px');

                  } else {

                    console.log('%cALLOW_ADVANCED_ANIMATED_TICKER_BACKGROUND', 'background-color: #16c450; color: #102624; padding: 2px 4px');
                  }
                }
              });

            }, 800);
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
          const cnt = (lcRenderer.inst || lcRenderer);
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

      if (document.documentElement && document.head) {
        addCssManaged();
      }
      // console.log(document.body===null)

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

        let mzk = 0;
        let myk = 0;
        let mlf = 0;
        let myw = 0;
        let mzt = 0;
        let zarr = null;
        let mlg = 0;

        if ((mclp.clearList || 0).length === 0) {
          assertor(() => fnIntegrity(mclp.clearList, '0.106.50'));
          mclp.clearList66 = mclp.clearList;
          mclp.clearList = function () {
            mzk++;
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
            await new Promise(requestAnimationFrame);
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
          if ((t29.inst || t29).isAttached === true) {
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


        if ((mclp.showNewItems_ || 0).length === 0 && ENABLE_NO_SMOOTH_TRANSFORM) {

          assertor(() => fnIntegrity(mclp.showNewItems_, '0.170.79'));
          mclp.showNewItems66_ = mclp.showNewItems_;

          mclp.showNewItems77_ = async function () {
            if (myk > 1e9) myk = 9;
            let tid = ++myk;

            await new Promise(requestAnimationFrame);

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


        if ((mclp.flushActiveItems_ || 0).length === 0) {

          assertor(() => fnIntegrity(mclp.flushActiveItems_, '0.137.81'));

          let hasMoreMessageState = !ENABLE_SHOW_MORE_BLINKER ? -1 : 0;

          let contensWillChangeController = null;

          mclp.flushActiveItems66_ = mclp.flushActiveItems_;

          mclp.flushActiveItems78_ = async function (tid) {
            try {
              if (tid !== mlf) return;
              const lockedMaxItemsToDisplay = this.data.maxItemsToDisplay944;
              let logger = false;
              const cnt = this;
              let immd = cnt.__intermediate_delay__;
              await new Promise(requestAnimationFrame);

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


              const items = (cnt.$ || 0).items;

              if (USE_WILL_CHANGE_CONTROLLER) {
                if (contensWillChangeController && contensWillChangeController.element !== items) {
                  contensWillChangeController.release();
                  contensWillChangeController = null;
                }
                if (!contensWillChangeController) contensWillChangeController = new WillChangeController(items, 'contents');
              }
              const wcController = contensWillChangeController;
              cnt.__intermediate_delay__ = Promise.all([cnt.__intermediate_delay__ || null, immd || null]);
              wcController && wcController.beforeOper();
              await Promise.resolve();
              const acItems = cnt.activeItems_;
              const len1 = acItems.length;
              if (!len1) console.warn('cnt.activeItems_.length = 0');
              let waitFor = [];


              /** @type {Set<string>} */
              const imageLinks = new Set();

              if (ENABLE_PRELOAD_THUMBNAIL || EMOJI_IMAGE_SINGLE_THUMBNAIL || AUTHOR_PHOTO_SINGLE_THUMBNAIL) {
                for (const item of acItems) {
                  fixLiveChatItem(item, imageLinks);
                }
              }
              if (ENABLE_PRELOAD_THUMBNAIL && kptPF !== null && (kptPF & (8 | 4)) && imageLinks.size > 0) {
                if (emojiPrefetched.size > PREFETCH_LIMITED_SIZE_EMOJI) emojiPrefetched.clear();
                if (authorPhotoPrefetched.size > PREFETCH_LIMITED_SIZE_AUTHOR_PHOTO) authorPhotoPrefetched.clear();

                // reference: https://github.com/Yuanfang-fe/Blog-X/issues/34
                const rel = kptPF & 8 ? 'subresource' : kptPF & 16 ? 'preload' : kptPF & 4 ? 'prefetch' : '';
                // preload performs the high priority fetching.
                // prefetch delays the chat display if the video resoruce is demanding.

                if (rel) {

                  imageLinks.forEach(imageLink => {
                    let d = false;
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

              skipDontRender = ((cnt.visibleItems || 0).length || 0) === 0;
              // console.log('ss1', Date.now())
              if (waitFor.length > 0) {
                await Promise.race([new Promise(r => setTimeout(r, 250)), Promise.all(waitFor)]);
              }
              waitFor.length = 0;
              waitFor = null;
              // console.log('ss2', Date.now())
              cnt.flushActiveItems66_();
              skipDontRender = ((cnt.visibleItems || 0).length || 0) === 0;
              const len2 = cnt.activeItems_.length;
              const bAsync = len1 !== len2;
              await Promise.resolve();
              if (wcController) {
                if (bAsync) {
                  cnt.async(() => {
                    wcController.afterOper();
                  });
                } else {
                  wcController.afterOper();
                }
              }
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
              logger && console.log('[End]')

              logger && console.groupEnd();

              if (!ENABLE_NO_SMOOTH_TRANSFORM) {


                const ff = () => {

                  if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                  //   if (tid !== mlf || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                  if (!cnt.atBottom && cnt.allowScroll && cnt.hasUserJustInteracted11_ && !cnt.hasUserJustInteracted11_()) {
                    cnt.scrollToBottom_();

                    Promise.resolve().then(() => {

                      if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                      if (!cnt.canScrollToBottom_()) cnt.scrollToBottom_();
                    });


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
                  scrollChatFn = () => Promise.resolve().then(f).then(f);
                }

                if (!ENABLE_DELAYED_CHAT_OCCURRENCE) scrollChatFn();
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
            await new Promise(requestAnimationFrame);
            if (runCond()) return this.flushActiveItems_() | 1;
          } catch (e) {
            console.warn(e);
          }
        }

        if ((mclp.atBottomChanged_ || 0).length === 1) {
          // note: if the scrolling is too frequent, the show more visibility might get wrong.
          assertor(() => fnIntegrity(mclp.atBottomChanged_, '1.75.39'));

          const querySelector = HTMLElement.prototype.querySelector;
          const U = (element) => ({
            querySelector: (selector) => querySelector.call(element, selector)
          });

          let qid = 0;
          mclp.atBottomChanged_ = function (a) {
            let tid = ++qid;
            let b = this;
            a ? this.hideShowMoreAsync_ || (this.hideShowMoreAsync_ = this.async(function () {
              if (tid !== qid) return;
              U(b.hostElement).querySelector("#show-more").style.visibility = "hidden"
            }, 200)) : (this.hideShowMoreAsync_ && this.cancelAsync(this.hideShowMoreAsync_),
              this.hideShowMoreAsync_ = null,
              U(this.hostElement).querySelector("#show-more").style.visibility = "visible")
          }

          console.log("atBottomChanged_", "OK");
        } else {
          console.log("atBottomChanged_", "NG");
        }

        if ((mclp.onScrollItems_ || 0).length === 1) {

          assertor(() => fnIntegrity(mclp.onScrollItems_, '1.17.9'));
          mclp.onScrollItems66_ = mclp.onScrollItems_;
          mclp.onScrollItems77_ = async function (evt) {
            if (myw > 1e9) myw = 9;
            let tid = ++myw;

            await new Promise(requestAnimationFrame);

            if (tid !== myw) {
              return;
            }

            const cnt = this;

            await Promise.resolve();
            if (USE_OPTIMIZED_ON_SCROLL_ITEMS) {
              await Promise.resolve().then(() => {
                this.ytRendererBehavior.onScroll(evt);
              }).then(() => {
                if (this.canScrollToBottom_()) {
                  const hasUserJustInteracted = this.hasUserJustInteracted11_ ? this.hasUserJustInteracted11_() : true;
                  if (hasUserJustInteracted) {
                    // only when there is an user action
                    this.setAtBottom();
                    return 1;
                  }
                } else {
                  // no message inserting
                  this.setAtBottom();
                  return 1;
                }
              }).then((r) => {

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
                if (r) {
                  // ensure setAtBottom is correctly set
                  this.setAtBottom();
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

        if ((mclp.handleLiveChatActions_ || 0).length === 1) {

          assertor(() => fnIntegrity(mclp.handleLiveChatActions_, '1.31.17'));
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

            await new Promise(requestAnimationFrame);

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

            const cnt = this;
            cnt.__intermediate_delay__ = new Promise(resolve => {
              cnt.handleLiveChatActions77_(arr).then(() => {
                resolve();
              });
            });
          }
          console.log("handleLiveChatActions_", "OK");
        } else {
          console.log("handleLiveChatActions_", "NG");
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

        if (typeof mclp.handleAddChatItemAction_ === 'function' && !mclp.handleAddChatItemAction66_ && FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION && (EMOJI_IMAGE_SINGLE_THUMBNAIL || AUTHOR_PHOTO_SINGLE_THUMBNAIL)) {

          mclp.handleAddChatItemAction66_ = mclp.handleAddChatItemAction_;
          mclp.handleAddChatItemAction_ = function (a) {
            try {
              if (a && typeof a === 'object' && !('length' in a)) {
                fixLiveChatItem(a.item, null);
                console.assert(arguments[0] === a);
              }
            } catch (e) { console.warn(e) }
            return this.handleAddChatItemAction66_.apply(this, arguments);
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

        let yd = (this.__dataHost || (this.inst || 0).__dataHost || 0).__data;

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
        const cnt = renderer.inst || renderer;
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


      const tags = ["yt-live-chat-ticker-paid-message-item-renderer", "yt-live-chat-ticker-paid-sticker-item-renderer",
        "yt-live-chat-ticker-renderer", "yt-live-chat-ticker-sponsor-item-renderer"];


      Promise.all(tags.map(tag => customElements.whenDefined(tag))).then(() => {

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-ticker-... hacks");
        console.log("[Begin]");

        // << if ENABLE_VIDEO_PROGRESS_STATE_FIX >>
        let isMainVideoOngoing = null;
        let mainVideoLastProgress = null;
        // << end >>

        for (const tag of tags) {
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            continue;
          }

          cProto.attached77 = cProto.attached;

          cProto.attached = function () {
            fpTicker(this.hostElement || this);
            return this.attached77();
          }

          for (const elm of document.getElementsByTagName(tag)) {
            if ((elm || elm.inst).isAttached === true) {
              fpTicker(elm);
            }
          }


          let rafHackState = 0;

          let isTimingFunctionHackable = false;

          let urt = 0;

          if (typeof cProto.startCountdown === 'function' && typeof cProto.updateTimeout === 'function' && typeof cProto.isAnimationPausedChanged === 'function') {

            // console.log('startCountdown', typeof cProto.startCountdown)
            // console.log('updateTimeout', typeof cProto.updateTimeout)
            // console.log('isAnimationPausedChanged', typeof cProto.isAnimationPausedChanged)

            isTimingFunctionHackable = fnIntegrity(cProto.startCountdown, '2.66.37') && fnIntegrity(cProto.updateTimeout, '1.76.45') && fnIntegrity(cProto.isAnimationPausedChanged, '2.56.30')

          } else {
            console.log(`Skip Timing Function Modification for ${tag}`);
            continue;
          }


          if (ENABLE_RAF_HACK_TICKERS && rafHub !== null) {

            // cancelable - this.rafId < isAnimationPausedChanged >
            rafHackState = 1;

            if (isTimingFunctionHackable) {
              rafHackState = 2;

            } else {
              rafHackState = 4;
            }

          }

          const isCSSPropertySupported = () => {

            if (typeof CSS !== 'object' || typeof (CSS || 0).registerProperty !== 'function') return;
            const documentElement = document.documentElement;
            if (!documentElement) {
              console.warn('document.documentElement is not found');
              return false;
            }
            if (`${window.getComputedStyle(documentElement).getPropertyValue('--ticker-rtime')}`.length === 0) {
              return false;
            }
            return true;

          };

          const doAnimator = !!ATTEMPT_ANIMATED_TICKER_BACKGROUND && isTimingFunctionHackable && typeof KeyframeEffect === 'function' && typeof animate === 'function' && typeof cProto.computeContainerStyle === 'function' && typeof cProto.colorFromDecimal === 'function' && isCSSPropertySupported();

          const doRAFHack = rafHackState === 2;

          cProto._throwOut = function () {
            this._r782 = 1;
            Promise.resolve().then(() => {
              this.detached();
              this.data = null;
              this.countdownMs = 0;
              this.lastCountdownTimeMs = null;
              if (this.__dataClientsReady === true) this.__dataClientsReady = false;
              if (this.__dataEnabled === true) this.__dataEnabled = false;
              if (this.__dataReady === true) this.__dataReady = false;
              const hm = this.hostElement || this;
              if (hm.parentNode) hm.remove();
              if (hm.firstChild) hm.textContent = '';
            }).catch(e => {
              console.warn(e);
            });
          };

          // cProto._checkTickerBackgroundChanged = doAnimator ? function () {
          //   if (runTickerClassName === 'run-ticker') {
          //     const container = (this.$ || 0).container || 0;
          //     if (!container) return;
          //     container.classList.add('run-ticker-test');
          //     const evaluated = `${window.getComputedStyle(container).background}`;
          //     container.classList.remove('run-ticker-test');
          //     if (evaluated.indexOf('0.') < 4) {
          //       // not fulfilling
          //       // rgba(0, 0, 0, 0.004) none repeat scroll 0% 0% / auto padding-box border-box
          //       runTickerClassName = 'run-ticker-forced';
          //       console.groupCollapsed(`%c${"YouTube Super Fast Chat"}%c${" | Incompatibility Found"}`,
          //         "background-color: #010502; color: #fe806a; font-weight: 700; padding: 2px;",
          //         "background-color: #010502; color: #fe806a; font-weight: 300; padding: 2px;"
          //       );
          //       console.warn(`%cWarning:\n\tYou might have added a userscript or extension that hacks ticker background too.\n\tYouTube Super Fast Chat will override it for you.`, 'color: #bada55');
          //       console.groupEnd();
          //     }
          //   }
          // } : null;

          cProto._makeAnimator = doAnimator ? function () {
            if (this._r782) return;
            // if (!this.isAttached) return;
            if (!this._runnerAE) {
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



                this._runnerAE = animate.call(aElement,
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

                this._runnerAE.onfinish = () => {
                  if (this.isAttached === true && !this._r782 && ((this.$ || 0).container || 0).isConnected === true) {
                    this._aeFinished();
                  }
                }

                let bq = (1.0 - (this.countdownMs / totalDuration)) * totalDuration;
                if (bq >= 0 && bq <= totalDuration) {

                  this._runnerAE.currentTime = bq
                } else {
                  console.warn('Error on setting _runnerAE.currentTime!');
                }


                aeConstructor = this._runnerAE.constructor; // constructor is from iframe
                return this._runnerAE;
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
          } : null;

          cProto._aeFinished = doAnimator ? function () {

            if (this._r782) return;

            if (this.isAttached === false && ((this.$ || 0).container || 0).isConnected === false) {
              this._throwOut();
              return;
            }

            if (doAnimator) {
              if (!this._runnerAE) console.warn('Error in .updateTimeout; this._runnerAE is undefined');

              let lc = window.performance.now();
              this.countdownMs = Math.max(0, this.countdownMs - (lc - this.lastCountdownTimeMs));
              if (this.countdownMs > this.countdownDurationMs) this.countdownMs = this.countdownDurationMs;
              this.lastCountdownTimeMs = lc;
              if (this.countdownMs > 10) console.warn('Warning: this.countdownMs is not zero when finished!', this.countdownMs); // just warning.

              this.countdownMs = 0;
              this.lastCountdownTimeMs = null;

              if (this.isAttached) {
                if (Date.now() - windowShownAt < 80) {
                  // no animation if the video page is switched from background to foreground
                  this.hostElement.style.display = 'none';
                } else {
                  "auto" === this.hostElement.style.width && this.setContainerWidth();
                  this.slideDown();
                }
              }


            } else {
              console.warn('unexpected issue')
            }
          } : null;


          if (ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX) {

            if (typeof cProto.handlePauseReplay === 'function' && !cProto.handlePauseReplay66 && cProto.handlePauseReplay.length === 0) {
              urt++;
              assertor(() => fnIntegrity(cProto.handlePauseReplay, '0.12.4'));
              cProto.handlePauseReplay66 = cProto.handlePauseReplay;
              cProto.handlePauseReplay = function () {
                if (this.isAttached) {

                  if (pairForPauseResumeM === 0) {
                    pairForPauseResume++;
                    if (pairForPauseResume > 1e9) pairForPauseResume = pairForPauseResume % 1e4;
                  }
                  // console.log('handlePauseReplay');
                  // console.log('handlePauseReplay', pairForPauseResume);
                  const r = this.handlePauseReplay66.apply(this, arguments);
                  isMainVideoOngoing = false;
                  return r;
                }
              };
            } else {
              console.log('Error for setting cProto.handlePauseReplay', tag)
            }

            if (typeof cProto.handleResumeReplay === 'function' && !cProto.handleResumeReplay66 && cProto.handlePauseReplay.length === 0) {
              urt++;
              assertor(() => fnIntegrity(cProto.handleResumeReplay, '0.8.2'));
              cProto.handleResumeReplay66 = cProto.handleResumeReplay;
              cProto.handleResumeReplay = function () {
                if (this.isAttached) {

                  if (pairForPauseResumeM === 0) {
                    pairForPauseResume++;
                    if (pairForPauseResume > 1e9) pairForPauseResume = pairForPauseResume % 1e4;
                  }
                  // console.log('handleResumeReplay');
                  // console.log('handleResumeReplay', pairForPauseResume);
                  const r = this.handleResumeReplay66.apply(this, arguments);
                  isMainVideoOngoing = true;
                  return r;

                }
              };
            } else {
              console.log('Error for setting cProto.handleResumeReplay', tag)
            }

            if (typeof cProto.handleReplayProgress === 'function' && !cProto.handleReplayProgress66 && cProto.handleReplayProgress.length === 1) {
              urt++;
              assertor(() => fnIntegrity(cProto.handleReplayProgress, '1.16.13'));
              cProto.handleReplayProgress66 = cProto.handleReplayProgress;
              cProto.handleReplayProgress = function (a) {
                if (this.isAttached) {
                  const p = mainVideoLastProgress;
                  mainVideoLastProgress = a;
                  if (isMainVideoOngoing === false) { // ignore isMainVideoOngoing === null ?
                    const d = a - p;
                    if (d > 0 && d < 0.28) isMainVideoOngoing = true; // timeupdate
                    // 0.28 is due to
                    //    - most browsers will fire the timeupdate event between 4 to 60 times per second
                    //    - i.e. timeupdate roughly every 15-250 milliseconds
                  }
                  let promiseResult = null;
                  if (this.isAnimationPaused) {
                    // unstable state for isMainVideoOngoing; delay required
                    // all the tickers' handleReplayProgress are executed in the same microtask
                    // execute after result returned
                    const lz1 = pairForPauseResume;
                    Promise.resolve().then(() => {
                      return promiseResult
                    }).then(() => {


                      if (isMainVideoOngoing === true && this.isAnimationPaused) {
                        const lz2 = pairForPauseResume;
                        // console.log( 10044000, lz1, lz2 , mainVideoLastProgress - a, isMainVideoOngoing  )
                        if (lz1 === lz2 && mainVideoLastProgress !== null && mainVideoLastProgress - a >= -1e-5) this.isAnimationPaused = false; // trigger isAnimationPausedChanged
                      }

                    });
                  }

                  const lq1 = pairForPauseResume;
                  promiseResult = Promise.resolve().then(() => {
                    const lq2 = pairForPauseResume;

                    if (lq1 === lq2) {
                      this.handleReplayProgress66(a);
                    }


                  })

                }
              };
            } else {
              console.log('Error for setting cProto.handleReplayProgress', tag)
            }

          }

          const ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED = ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX && urt === 3;

          const doTimerFnModification = (doRAFHack || doAnimator);

          let windowShownAt = 0;
          if (doTimerFnModification) {

            window.addEventListener('visibilitychange', () => {
              if (document.visibilityState === 'visible') windowShownAt = Date.now();
              else windowShownAt = 0;
            }, false);

          }

          cProto.startCountdown = doTimerFnModification ? function (a, b) { // .startCountdown(a.durationSec, a.fullDurationSec)

            // a.durationSec [s] => countdownMs [ms]
            // a.fullDurationSec [s] => countdownDurationMs [ms] OR countdownMs [ms]
            // lastCountdownTimeMs => raf ongoing
            // lastCountdownTimeMs = 0 when rafId = 0 OR countdownDurationMs = 0

            if (this._r782) return;

            if (this.isAttached === false && ((this.$ || 0).container || 0).isConnected === false) {
              this._throwOut();
              return;
            }

            if (doAnimator) {
              b = void 0 === b ? 0 : b;
              if (void 0 !== a) {
                this.countdownMs = 1E3 * a; // decreasing from durationSec[s] to zero
                this.countdownDurationMs = b ? 1E3 * b : this.countdownMs; // constant throughout the animation
                if (!(this.lastCountdownTimeMs || this.isAnimationPaused)) {
                  this.lastCountdownTimeMs = performance.now()
                  this.rafId = 1
                  if (this._runnerAE) console.warn('Error in .startCountdown; this._runnerAE already created.')
                  this.detlaSincePausedSecs = 0;
                  const ae = this._makeAnimator();
                  if (!ae) console.warn('Error in startCountdown._makeAnimator()');

                  // console.log(539, isMainVideoOngoing)
                  if (this.isAnimationPaused === void 0 && ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED && isMainVideoOngoing === false && mainVideoLastProgress !== null) {
                    // << This is mainly for [PlayBack Replay] backwards >>
                    // fix the case when the main video is paused but due to seeking the tickers are added
                    // play first then pause immediately to allow the visual effect of initial state
                    // don't forget to set the "playerProgressSec"
                    // otherwise when it resumes from paused state, the detlaSincePausedSecs will be huge
                    this.playerProgressSec = mainVideoLastProgress; // save the progress first
                    this.isAnimationPaused = true; // trigger isAnimationPausedChanged
                    this.detlaSincePausedSecs = 0;
                    this._forceNoDetlaSincePausedSecs783 = 1; // reset this.detlaSincePausedSecs = 0 when resumed
                  }
                }
              }
            } else {
              // console.log('cProto.startCountdown', tag) // yt-live-chat-ticker-sponsor-item-renderer
              if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
              b = void 0 === b ? 0 : b;
              void 0 !== a && (this.countdownMs = 1E3 * a,
                this.countdownDurationMs = b ? 1E3 * b : this.countdownMs,
                this.ratio = 1,
                this.lastCountdownTimeMs || this.isAnimationPaused || (this.lastCountdownTimeMs = performance.now(),
                  this.rafId = rafHub.request(this.boundUpdateTimeout37_)))
            }

          } : cProto.startCountdown;

          cProto.updateTimeout = doTimerFnModification ? function (a) {

            if (this._r782) return;

            if (this.isAttached === false && ((this.$ || 0).container || 0).isConnected === false) {
              this._throwOut();
              return;
            }

            if (doAnimator) {
              if (!this._runnerAE) console.warn('Error in .updateTimeout; this._runnerAE is undefined');
              this.countdownMs = Math.max(0, this.countdownMs - (a - (this.lastCountdownTimeMs || 0)));
              if (this.countdownMs > this.countdownDurationMs) this.countdownMs = this.countdownDurationMs;
              if (this.isAttached && this.countdownMs) {
                this.lastCountdownTimeMs = a
                const ae = this._makeAnimator(); // request raf
                if (!ae) console.warn('Error in startCountdown._makeAnimator()');
              } else {
                (this.lastCountdownTimeMs = null,
                  this.isAttached && ("auto" === this.hostElement.style.width && this.setContainerWidth(),
                    this.slideDown()));
              }
            } else {
              // console.log('cProto.updateTimeout', tag) // yt-live-chat-ticker-sponsor-item-renderer
              if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
              this.countdownMs = Math.max(0, this.countdownMs - (a - (this.lastCountdownTimeMs || 0)));
              this.ratio = this.countdownMs / this.countdownDurationMs;
              this.isAttached && this.countdownMs ? (this.lastCountdownTimeMs = a,
                this.rafId = rafHub.request(this.boundUpdateTimeout37_)) : (this.lastCountdownTimeMs = null,
                  this.isAttached && ("auto" === this.hostElement.style.width && this.setContainerWidth(),
                    this.slideDown()))
            }

          } : cProto.updateTimeout;

          // let ez = 0;
          cProto.isAnimationPausedChanged = doTimerFnModification ? function (a, b) {

            if (this._r782) return;

            if (this.isAttached === false && ((this.$ || 0).container || 0).isConnected === false) {
              this._throwOut();
              return;
            }
            let forceNoDetlaSincePausedSecs783 = this._forceNoDetlaSincePausedSecs783;
            this._forceNoDetlaSincePausedSecs783 = 0;

            Promise.resolve().then(() => {

              if (doAnimator) {

                const playState = (this._runnerAE || 0).playState;
                if (a && playState === 'running') {

                } else if (!a && playState !== 'running' && b) {

                } else {
                  return;
                }
              }

              // if (Math.abs(this.detlaSincePausedSecs) < 0.01) this.detlaSincePausedSecs = 0;
              if (doAnimator) {
                const pu = () => { // running -> pause
                  this._runnerAE.pause()
                  let lc = window.performance.now();
                  this.countdownMs = Math.max(0, this.countdownMs - (lc - this.lastCountdownTimeMs));
                  if (this.countdownMs > this.countdownDurationMs) this.countdownMs = this.countdownDurationMs;
                  this.lastCountdownTimeMs = lc;
                };
                const wa = () => { // pause -> running
                  if (forceNoDetlaSincePausedSecs783) this.detlaSincePausedSecs = 0;
                  a = this.detlaSincePausedSecs ? (this.lastCountdownTimeMs || 0) + 1000 * this.detlaSincePausedSecs : (this.lastCountdownTimeMs || 0);
                  this.detlaSincePausedSecs = 0;
                  this.updateTimeout(a);
                  this.lastCountdownTimeMs = window.performance.now();
                };
                a ? (this._runnerAE && pu()) : (!a && b && wa());
              } else {
                // ez++;
                // if(ez> 1e9) ez=9;
                if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
                a ? rafHub.cancel(this.rafId) : !a && b && (a = this.lastCountdownTimeMs || 0,
                  this.detlaSincePausedSecs && (a = (this.lastCountdownTimeMs || 0) + 1E3 * this.detlaSincePausedSecs,
                    this.detlaSincePausedSecs = 0),
                  this.boundUpdateTimeout37_(a),
                  this.lastCountdownTimeMs = window.performance.now())
              }

            }).catch(e => {
              console.log(e);
            });



          } : cProto.isAnimationPausedChanged;


          if (doAnimator) {

            assertor(() => fnIntegrity(cProto.computeContainerStyle, '2.81.31'));

            let dummyValueForStyleReturn = null;

            cProto.computeContainerStyle66 = cProto.computeContainerStyle;
            cProto.computeContainerStyle = function (a, b) {

              if (this._r782) return;

              if (this.isAttached === false && ((this.$ || 0).container || 0).isConnected === false) {
                this._throwOut();
                return;
              }

              const fullDurationSec = a ? a.fullDurationSec : 0;
              if (fullDurationSec > 0 && typeof b === 'number') {

                // usually zero

                // let currentDuationSrc = b * fullDurationSec; // a.durationSec

                // console.log(231, fullDurationSec, b, currentDuationSrc, a.durationSec);

                /*
                if (a.mdsz && typeof a.mdst) return a.mdst;
                a.mdsz = 1;



                let c1 = this.colorFromDecimal(a.startBackgroundColor);
                let c2 = this.colorFromDecimal(a.endBackgroundColor);

                let ratio = currentDuationSrc / fullDurationSec;

                let m = (ratio * 100).toFixed(1);


                let s = `--background:linear-gradient(90deg, ${c1},${c1} ${m}%,${c2} ${m}%,${c2});`
                let ro = {
                  "privateDoNotAccessOrElseSafeStyleWrappedValue_": s,
                  "implementsGoogStringTypedString": true
                };

                ro.getTypedStringValue = ro.toString = function () { return this.privateDoNotAccessOrElseSafeStyleWrappedValue_ };

                a.mdst = s;

                return ro;
                */
              }



              // return this.computeContainerStyle66.apply(this, arguments);

              if (dummyValueForStyleReturn === null) {

                let s = `--nx:82;`
                let ro = {
                  "privateDoNotAccessOrElseSafeStyleWrappedValue_": s,
                  "implementsGoogStringTypedString": true
                };

                ro.getTypedStringValue = ro.toString = function () { return this.privateDoNotAccessOrElseSafeStyleWrappedValue_ };


                dummyValueForStyleReturn = ro;


              }


              return dummyValueForStyleReturn;


            }

          }

          if (doTimerFnModification === true) hasTimerModified = true;

          if (!!ATTEMPT_ANIMATED_TICKER_BACKGROUND) {
            console.log('ATTEMPT_ANIMATED_TICKER_BACKGROUND', tag, doAnimator ? 'OK' : 'NG');
          }

          if (!doAnimator && (rafHackState === 2 || rafHackState === 4)) {
            console.log('RAF_HACK_TICKERS', tag, doRAFHack ? "OK" : "NG");
          }

        }
        console.log("[End]");
        console.groupEnd();


      }).catch(console.warn);

      customElements.whenDefined('yt-live-chat-ticker-renderer').then(() => {

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-ticker-renderer hacks");
        console.log("[Begin]");
        (() => {

          const tag = "yt-live-chat-ticker-renderer"
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          if (RAF_FIX_keepScrollClamped) {

            // to be improved

            if (typeof cProto.keepScrollClamped === 'function' && !cProto.keepScrollClamped72 && fnIntegrity(cProto.keepScrollClamped) === '0.17.10') {

              cProto.keepScrollClamped72 = cProto.keepScrollClamped;
              cProto.keepScrollClamped = function () {
                this._bound_keepScrollClamped = this._bound_keepScrollClamped || this.keepScrollClamped.bind(this);
                this.scrollClampRaf = requestAnimationFrame(this._bound_keepScrollClamped);
                this.maybeClampScroll()
              }

              console.log('RAF_FIX: keepScrollClamped', tag, "OK")
            } else {

              assertor(() => fnIntegrity(cProto.keepScrollClamped, '0.17.10'));
              console.log('RAF_FIX: keepScrollClamped', tag, "NG")
            }

          }


          if (RAF_FIX_scrollIncrementally && typeof cProto.startScrolling === 'function' && typeof cProto.scrollIncrementally === 'function' && fnIntegrity(cProto.startScrolling) === '1.44.32' && fnIntegrity(cProto.scrollIncrementally) === '1.82.43') {
            // to be replaced by animator

            cProto.startScrolling = function (a) {
              this.scrollStopHandle && this.cancelAsync(this.scrollStopHandle);
              this.asyncHandle && cancelAnimationFrame(this.asyncHandle);
              this.lastFrameTimestamp = this.scrollStartTime = performance.now();
              this.scrollRatePixelsPerSecond = a;
              this._bound_scrollIncrementally = this._bound_scrollIncrementally || this.scrollIncrementally.bind(this);
              this.asyncHandle = requestAnimationFrame(this._bound_scrollIncrementally)
            };

            cProto.scrollIncrementally = function (a) {
              var b = a - (this.lastFrameTimestamp || 0);
              this.$.items.scrollLeft += b / 1E3 * (this.scrollRatePixelsPerSecond || 0);
              this.maybeClampScroll();
              this.updateArrows();
              this.lastFrameTimestamp = a;
              this._bound_scrollIncrementally = this._bound_scrollIncrementally || this.scrollIncrementally.bind(this);
              0 < this.$.items.scrollLeft || this.scrollRatePixelsPerSecond && 0 < this.scrollRatePixelsPerSecond ? this.asyncHandle = requestAnimationFrame(this._bound_scrollIncrementally) : this.stopScrolling()
            };

            console.log('RAF_FIX: scrollIncrementally', tag, "OK")
          } else {
            assertor(() => fnIntegrity(cProto.startScrolling, '1.44.32'));
            assertor(() => fnIntegrity(cProto.scrollIncrementally, '1.82.43'));
            console.log('RAF_FIX: scrollIncrementally', tag, "NG")
          }


        })();

        console.log("[End]");

        console.groupEnd();

      }).catch(console.warn);


      if (ENABLE_RAF_HACK_INPUT_RENDERER && rafHub !== null) {


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

            let doHack = false;
            if (typeof cProto.handleTimeout === 'function' && typeof cProto.updateTimeout === 'function') {

              // not cancellable


              doHack = fnIntegrity(cProto.handleTimeout, '1.27.16') && fnIntegrity(cProto.updateTimeout, '1.50.33');

            }

            if (doHack) {

              cProto.handleTimeout = function (a) {
                console.log('cProto.handleTimeout', tag)
                if (!this.boundUpdateTimeout38_) this.boundUpdateTimeout38_ = this.updateTimeout.bind(this);
                this.timeoutDurationMs = this.timeoutMs = a;
                this.countdownRatio = 1;
                0 === this.lastTimeoutTimeMs && rafHub.request(this.boundUpdateTimeout38_)
              };
              cProto.updateTimeout = function (a) {
                console.log('cProto.updateTimeout', tag)
                if (!this.boundUpdateTimeout38_) this.boundUpdateTimeout38_ = this.updateTimeout.bind(this);
                this.lastTimeoutTimeMs && (this.timeoutMs = Math.max(0, this.timeoutMs - (a - this.lastTimeoutTimeMs)),
                  this.countdownRatio = this.timeoutMs / this.timeoutDurationMs);
                this.isAttached && this.timeoutMs ? (this.lastTimeoutTimeMs = a,
                  rafHub.request(this.boundUpdateTimeout38_)) : this.lastTimeoutTimeMs = 0
              };

              console.log('RAF_HACK_INPUT_RENDERER', tag, "OK")
            } else {

              console.log('typeof handleTimeout', typeof cProto.handleTimeout)
              console.log('typeof updateTimeout', typeof cProto.updateTimeout)

              console.log('RAF_HACK_INPUT_RENDERER', tag, "NG")
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
                // console.log('cProto.animateScroll_', tag) // yt-emoji-picker-renderer
                if (!this.boundAnimateScroll39_) this.boundAnimateScroll39_ = this.animateScroll_.bind(this);
                this.lastAnimationTime_ || (this.lastAnimationTime_ = a);
                a -= this.lastAnimationTime_;
                200 > a ? (U(this.hostElement).querySelector("#categories").scrollTop = this.animationStart_ + (this.animationEnd_ - this.animationStart_) * a / 200,
                  rafHub.request(this.boundAnimateScroll39_)) : (null != this.animationEnd_ && (U(this.hostElement).querySelector("#categories").scrollTop = this.animationEnd_),
                    this.animationEnd_ = this.animationStart_ = null,
                    this.lastAnimationTime_ = 0);
                this.updateButtons_()
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

              cProto.checkIntersections = function () {
                // console.log('cProto.checkIntersections', tag)
                if (this.dockableMessages.length) {
                  this.intersectRAF = rafHub.request(this.boundCheckIntersections);
                  let a = this.dockableMessages[0]
                    , b = this.hostElement.getBoundingClientRect();
                  a = a.getBoundingClientRect();
                  let c = a.top - b.top
                    , d = 8 >= c;
                  c = 8 >= c - this.hostElement.clientHeight;
                  if (d) {
                    let e;
                    for (; d;) {
                      e = this.dockableMessages.shift();
                      d = this.dockableMessages[0];
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
                    this.dock(e)
                  } else
                    c && this.dockedItem && this.clear()
                } else
                  this.intersectRAF = 0
              }

              cProto.onDockableMessagesChanged = function () {
                // console.log('cProto.onDockableMessagesChanged', tag) // yt-live-chat-docked-message
                this.dockableMessages.length && !this.intersectRAF && (this.intersectRAF = rafHub.request(this.boundCheckIntersections))
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


            if (typeof cProto.dataChanged === 'function' && !cProto.dataChanged86 && fnIntegrity(cProto.dataChanged) === '1.159.97') {



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

                const image = ((this || 0).$ || 0).image
                if (image && a && image.firstElementChild) {
                  let exisiting = image.firstElementChild;
                  if (exisiting === image.lastElementChild) {


                    if (a.icon && exisiting.nodeName.toUpperCase() === 'YT-ICON') {

                      let c = exisiting;
                      if ("MODERATOR" === a.icon.iconType && this.enableNewModeratorBadge) {
                        if (c.icon !== "yt-sys-icons:shield-filled") c.icon = "yt-sys-icons:shield-filled";
                        if (c.defaultToFilled !== true) c.defaultToFilled = true;
                      } else {
                        let p = "live-chat-badges:" + a.icon.iconType.toLowerCase();;
                        if (c.icon !== p) c.icon = p;
                        if (c.defaultToFilled !== false) c.defaultToFilled = false;
                      }
                      return;


                    } else if (a.customThumbnail && exisiting.nodeName.toUpperCase() == 'IMG') {

                      let c = exisiting;
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
              assertor(() => fnIntegrity(cProto.dataChanged, '1.159.97'));
              console.log("cProto.dataChanged - NG");

            }

          })();

          console.log("[End]");

          console.groupEnd();

        }).catch(console.warn);


      }


      if (FIX_TOOLTIP_DISPLAY) {


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
                let r = cProto._readyClients43.apply(this, arguments);
                if (this.$ && this.$$ && this.$.tooltip) this.root = null; // fix this.root = null != (b = a.root) ? b : this.host
                return r;
              }

              console.log("_readyClients - OK");

            } else {
              console.log("_readyClients - NG");

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

            // mdHandler282 : function (evt) {
            //   // console.log(evt, 1, document.querySelector('tp-yt-iron-dropdown[focused].style-scope.yt-live-chat-app'))
            //   if (!evt || !evt.isTrusted) return;
            //   muzTimestamp = 0;
            //   nszDropdown = null;

            //   const hostElement = this.hostElement || this;
            //   if (!evt || !evt.isTrusted || !hostElement.hasAttribute('menu-visible')) return;
            //   if (!hostElement.contains(evt.target)) return;
            //   let targetDropDown = null;
            //   for(const dropdown of document.querySelectorAll('tp-yt-iron-dropdown.style-scope.yt-live-chat-app')){
            //     if(dropdown && dropdown.positionTarget && hostElement.contains( dropdown.positionTarget)){
            //       targetDropDown = dropdown;
            //     }
            //   }
            //   if ((nszDropdown = targetDropDown)) {
            //     muzTimestamp = Date.now();
            //     evt.stopImmediatePropagation();
            //     evt.stopPropagation();
            //   }

            // },


            muHandler282: function (evt) {
              // console.log(evt, 7, document.querySelector('tp-yt-iron-dropdown[focused].style-scope.yt-live-chat-app'))
              if (!evt || !evt.isTrusted || !muzTimestamp) return;
              const dropdown = nszDropdown;
              muzTimestamp = 0;
              nszDropdown = null;

              const kurMPC = kRef(currentMenuPivotWR) || 0;
              const hostElement = kurMPC.hostElement || kurMPC;
              if (!hostElement.hasAttribute('menu-visible')) return;
              if (dropdown && dropdown.positionTarget && hostElement.contains(dropdown.positionTarget)) {
                muzTimestamp = Date.now();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
                Promise.resolve(dropdown).then((dropdown) => {
                  dropdown.cancel();
                });
                // document.body.click();
              }

            },

            mlHandler282: function (evt) {
              muzTimestamp = 0;
              nszDropdown = null;
            },

            ckHandler282: function (evt) {
              // console.log(evt, 3, document.querySelector('tp-yt-iron-dropdown[focused].style-scope.yt-live-chat-app'))

              if (!evt || !evt.isTrusted || !muzTimestamp) return;
              if (Date.now() - muzTimestamp < 40) {
                muzTimestamp = Date.now();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
              }

            },

            tapHandler282: function (evt) {
              // console.log(evt, 2, document.querySelector('tp-yt-iron-dropdown[focused].style-scope.yt-live-chat-app'))

              if (!evt || !evt.isTrusted || !muzTimestamp) return;
              if (Date.now() - muzTimestamp < 40) {
                muzTimestamp = Date.now();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
              }

            },


            handleEvent(evt) {


              if (evt) {
                const kurMPC = kRef(currentMenuPivotWR) || 0;
                const cnt = kurMPC.inst || kurMPC;
                const hostElement = cnt.hostElement || cnt;
                if (!cnt || cnt.isAttached !== true || hostElement.isConnected !== true) return;
                switch (evt.type) {
                  // case 'mousedown':
                  // return this.mdHandler282.call(kurMPC, evt);
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
            const kurMPC = kurMP.closest('[menu-visible]') || 0;

            if (!kurMPC.isClickableChatRow111 || !kurMPC.isClickableChatRow111() || !kurMPC.contains(evt.target)) return;

            let targetDropDown = null;
            for (const dropdown of document.querySelectorAll('tp-yt-iron-dropdown.style-scope.yt-live-chat-app')) {
              if (dropdown && dropdown.positionTarget === kurMP) {
                targetDropDown = dropdown;
              }
            }

            if ((nszDropdown = targetDropDown)) {
              muzTimestamp = Date.now();
              evt.stopImmediatePropagation();
              evt.stopPropagation();
              currentMenuPivotWR = mWeakRef(kurMPC);

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


        customElements.whenDefined('yt-live-chat-text-message-renderer').then(() => {


          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-text-message-renderer hacks");
          console.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-text-message-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            /*



                remarks:
                            
                const w=new Set();
                setInterval(()=>{
                for(const a of document.getElementsByTagName('*')) if(a.shouldSupportWholeItemClick) w.add(a.is||''); 
                console.log([...w.keys()]);
                },800);

                            
                [
                "yt-live-chat-ticker-sponsor-item-renderer",
                "yt-live-chat-banner-header-renderer",
                "yt-live-chat-text-message-renderer",
                "ytd-sponsorships-live-chat-gift-purchase-announcement-renderer",
                "ytd-sponsorships-live-chat-header-renderer",
                "ytd-sponsorships-live-chat-gift-redemption-announcement-renderer"
                ]
              
            */

            cProto.isClickableChatRow111 = function () {
              return (
                this.data && typeof this.shouldSupportWholeItemClick === 'function' && typeof this.hasModerationOverlayVisible === 'function' &&
                this.data.contextMenuEndpoint && this.wholeMessageClickable && this.shouldSupportWholeItemClick() && !this.hasModerationOverlayVisible()
              ); // follow .onItemTap(a)
            }



            const toHookDocumentMouseDown = typeof cProto.shouldSupportWholeItemClick === 'function' && typeof cProto.hasModerationOverlayVisible === 'function';

            if (toHookDocumentMouseDown) {

              hookDocumentMouseDownSetupFn();


              console.log("FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK - Doc MouseEvent OK");



            } else {

              console.log("FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK - Doc MouseEvent NG");

            }




          })();

          console.log("[End]");

          console.groupEnd();

        }).catch(console.warn);


      }



      if (CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN) {


        /*

        const w=new Set(); for(const a of document.getElementsByTagName('*')) if(a.showContextMenu && a.showContextMenu_) w.add(a.is||''); console.log([...w.keys()])

        */

        let pTags = [];
        const sTags = [
          "yt-live-chat-ticker-sponsor-item-renderer",
          "yt-live-chat-banner-header-renderer",
          "yt-live-chat-text-message-renderer",
          "ytd-sponsorships-live-chat-gift-purchase-announcement-renderer",
          "ytd-sponsorships-live-chat-header-renderer",
          "ytd-sponsorships-live-chat-gift-redemption-announcement-renderer"
        ];

        for (const tag of sTags) {
          pTags.push(customElements.whenDefined(tag));
        }


        Promise.all(pTags).then(() => {


          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | fixShowContextMenu");
          console.log("[Begin]");

          for (const tag of sTags) {



            (() => {

              const dummy = document.createElement(tag);

              const cProto = getProto(dummy);
              if (!cProto || !cProto.attached) {
                console.warn(`proto.attached for ${tag} is unavailable.`);
                return;
              }




              if (typeof cProto.showContextMenu === 'function' && typeof cProto.showContextMenu_ === 'function' && !cProto.showContextMenu37 && !cProto.showContextMenu37_ && cProto.showContextMenu.length === 1 && cProto.showContextMenu_.length === 1) {

                cProto.showContextMenu37_ = cProto.showContextMenu_;
                cProto.showContextMenu37 = cProto.showContextMenu;
    
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
    
                const wm37 = new WeakMap();
                cProto.showContextMenu = function (a) {
                  const endpoint = (this.data || 0).contextMenuEndpoint || 0;
                  if (endpoint) {
                    let resolvedEndpoint = wm37.get(endpoint);
                    if (resolvedEndpoint) {
                      resolvedEndpoint = deepCopy(resolvedEndpoint);
                      // let b = deepCopy(resolvedEndpoint, ['trackingParams', 'clickTrackingParams'])
                      Promise.resolve(resolvedEndpoint).then(() => {
                        this.showContextMenu37_(resolvedEndpoint);
                      });
                      return;
                      //this.showContextMenu37_(JSON.parse(JSON.stringify(a)));
                      //return;
                    }
                  }
                  return this.showContextMenu37(a);
                }
    
                cProto.showContextMenu_ = function (a) {
                  const endpoint = (this.data || 0).contextMenuEndpoint || 0;
                  if (endpoint) {
                    a = deepCopy(a);
                    wm37.set(endpoint, a);
                  }
                  return this.showContextMenu37_(a);
                }
    
    
                console.log("CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN - OK", tag);
    
    
    
              } else {
    
                console.log("CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN -  NG", tag);
    
              }


            })();

          }



          console.log("[End]");

          console.groupEnd();

        }).catch(console.warn);
      }


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
                Promise.resolve().then(() => {
                  fn.call(this);
                });
              }
              let r = this.__deraf66.apply(this, arguments);
              return r;
            }
            console.log("FIX_DROPDOWN_DERAF - OK");
          } else {
            console.log("FIX_DROPDOWN_DERAF - NG");
          }


          if (FIX_MENU_REOPEN_RENDER_PERFORMANCE_1 && typeof cProto.__openedChanged === 'function' && !cProto.__mtChanged__ && fnIntegrity(cProto.__openedChanged) === '0.46.20') {

            let lastClose = null;
            let lastOpen = null;
            let cid = 0;

            cProto.__mtChanged__ = function (b) {

              Promise.resolve().then(() => {
                this._applyFocus();
              }).then(() => {
                b ? this._renderOpened() : this._renderClosed();
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

                  let useVisibilityCollapse = true;
                  if (HTMLElement.prototype.querySelector.call(sizingTarget, 'yt-icon:empty')) {
                    useVisibilityCollapse = false;
                  }

                  if (useVisibilityCollapse) {
                    hostElement.style.visibility = 'collapse';
                    sizingTarget.style.visibility = 'collapse';
                  } else {
                    hostElement.setAttribute('rNgzQ', '');
                    sizingTarget.setAttribute('rNgzQ', '');
                  }

                  const gn = () => {

                    if (useVisibilityCollapse) {
                      hostElement.style.visibility = '';
                      sizingTarget.style.visibility = '';
                    } else {
                      hostElement.removeAttribute('rNgzQ');
                      sizingTarget.removeAttribute('rNgzQ');
                    }
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
                  an();


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
            console.log("FIX_MENU_REOPEN_RENDER_PERFORMANCE_1 - OK");

          } else {

            assertor(() => fnIntegrity(cProto.__openedChanged, '0.46.20'));
            console.log("FIX_MENU_REOPEN_RENDER_PERFORMANC_1 - NG");

          }


          if (FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK && typeof cProto.__openedChanged === 'function' && !cProto.__openedChanged82) {

            cProto.__openedChanged82 = cProto.__openedChanged;


            cProto.__openedChanged = function () {

              // currentMenuPivotWR = null;
              // console.log(1480, '__openedChanged.A', this.positionTarget)



              // if (this.opened && this.positionTarget) {

              //   const positionTarget = this.positionTarget;
              //   console.log(1480, '__openedChanged.B', positionTarget)
              //   currentMenuPivotWR = mWeakRef(positionTarget);

              // }

              const positionTarget = this.positionTarget;
              currentMenuPivotWR = positionTarget ? mWeakRef(positionTarget) : null;
              return this.__openedChanged82.apply(this, arguments);
            }
          }


          // if(FIX_MENU_CAPTURE_SCROLL && typeof cProto.__onCaptureScroll === 'function' && !cProto.__onCaptureScroll66){

          //   cProto.__onCaptureScroll66 = cProto.__onCaptureScroll;

          //   cProto.__onCaptureScroll = function(a){

          //     const q = true;
          //     if(this.scrollAction === 'lock'  && q && this.opened){

          //       // console.log(9107, this.scrollAction, this.__isAnimating, this.opened, a); // lock; __isAnimating = false
          //       async function af() {
          //         this.__isAnimating && this._finishRenderOpened();
          //         if (!this.opened) return;
          //         this.__restoreScrollPosition();
          //         await new Promise(r => requestAnimationFrame(r));
          //         if (!this.opened) return;
          //         this.opened && this.__isAnimating && this._finishRenderOpened();
          //         if (!this.opened) return;
          //         this.__restoreScrollPosition();
          //         await new Promise(r => requestAnimationFrame(r));
          //         if (!this.opened) return;
          //         this.opened && this.__isAnimating && this._finishRenderOpened();
          //         if (!this.opened) return;
          //         this.opened && !this.__isAnimating && this.refit();
          //       }
          //       Promise.resolve().then(af);

          //        return cProto.__onCaptureScroll66.apply(this, arguments);
          //     }else{

          //       // console.log(9102, this.scrollAction, this.__isAnimating, this.opened, a); // lock

          //       return cProto.__onCaptureScroll66.apply(this, arguments);
          //     }
          //   }
          //   console.log("FIX_MENU_CAPTURE_SCROLL - OK");
          // }else{
          //   console.log("FIX_MENU_CAPTURE_SCROLL - NG");

          // }


        })();

        console.log("[End]");

        console.groupEnd();

      }).catch(console.warn);




    }

    promiseForCustomYtElementsReady.then(onRegistryReadyForDOMOperations);





  });

})({ IntersectionObserver });
