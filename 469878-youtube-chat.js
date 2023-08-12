// ==UserScript==
// @name                YouTube Super Fast Chat
// @version             0.20.5
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

  const ENABLE_REDUCED_MAXITEMS_FOR_FLUSH = true;         // TRUE to enable trimming down to 25 messages when there are too many unrendered messages
  const MAX_ITEMS_FOR_TOTAL_DISPLAY = 90;                 // By default, 250 latest messages will be displayed, but displaying 90 messages is already sufficient.
  const MAX_ITEMS_FOR_FULL_FLUSH = 25;                    // If there are too many new (stacked) messages not yet rendered, clean all and flush 25 latest messages then incrementally added back to 90 messages

  const ENABLE_NO_SMOOTH_TRANSFORM = true;                // Depends on whether you want the animation effect for new chat messages
  const USE_OPTIMIZED_ON_SCROLL_ITEMS = true;             // TRUE for the majority
  const USE_WILL_CHANGE_CONTROLLER = false;               // FALSE for the majority
  const ENABLE_FULL_RENDER_REQUIRED_PREFERRED = true;     // In Chrome, the rendering of new chat messages could be too fast for no smooth transform. 80ms delay of displaying new messages should be sufficient for element rendering.
  const ENABLE_OVERFLOW_ANCHOR_PREFERRED = true;          // Enable `overflow-anchor: auto` to lock the scroll list at the bottom for no smooth transform.

  const FIX_SHOW_MORE_BUTTON_LOCATION = true;             // When there are voting options (bottom panel), move the "show more" button to the top.
  const FIX_INPUT_PANEL_OVERFLOW_ISSUE = true;            // When the super chat button is flicking with color, the scrollbar might come out.
  const FIX_INPUT_PANEL_BORDER_ISSUE = true;              // No border should be allowed if there is an empty input panel.
  const SET_CONTAIN_FOR_CHATROOM = true;                  // Rendering hacks (`contain`) for chatroom elements. [ General ]

  const FORCE_CONTENT_VISIBILITY_UNSET = true;            // Content-visibility should be always VISIBLE for high performance and great rendering.
  const FORCE_WILL_CHANGE_UNSET = true;                   // Will-change should be always UNSET (auto) for high performance and low energy impact.

  // Replace requestAnimationFrame timers with custom implementation
  const ENABLE_RAF_HACK_TICKERS = true;         // When there is a ticker
  const ENABLE_RAF_HACK_DOCKED_MESSAGE = true;  // To be confirmed
  const ENABLE_RAF_HACK_INPUT_RENDERER = true;  // To be confirmed
  const ENABLE_RAF_HACK_EMOJI_PICKER = true;    // When changing the page of the emoji picker

  // Force rendering all the character subsets of the designated font(s) before messages come (Pre-Rendering of Text)
  const ENABLE_FONT_PRE_RENDERING_PREFERRED = 1 | 2 | 4 | 8 | 16;

  // Backdrop `filter: blur(4px)` inside the iframe can extend to the whole page, causing a negative visual impact on the video you are watching.
  const NO_BACKDROP_FILTER_WHEN_MENU_SHOWN = true;

  // Data Manipulation for Participants (Participant List)
  const DO_PARTICIPANT_LIST_HACKS = true;                     // TRUE for the majority
  const SHOW_PARTICIPANT_CHANGES_IN_CONSOLE = false;          // Just too annoying to show them all in popular chat
  const CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT = true;  // Only consider changes in renderable content (not concerned with the last chat message of the participants)
  const PARTICIPANT_UPDATE_ONLY_ONLY_IF_MODIFICATION_DETECTED = true;

  const ENABLE_SHOW_MORE_BLINKER = true;                      // BLINK WHEN NEW MESSAGES COME

  const { IntersectionObserver } = __CONTEXT__;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  if (!IntersectionObserver) return console.warn("Your browser does not support IntersectionObserver.\nPlease upgrade to the latest version.")

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

        user-select: none !important;
        pointer-events: none !important;
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

    .dont-render {

        visibility: collapse !important;
        transform: scale(0.01) !important;
        transform: scale(0.00001) !important;
        transform: scale(0.0000001) !important;
        transform-origin: 0 0 !important;
        z-index:-1 !important;
        contain: strict !important;
        box-sizing: border-box !important;

        height: 1px !important;
        height: 0.1px !important;
        height: 0.01px !important;
        height: 0.0001px !important;
        height: 0.000001px !important;

        animation: dontRenderAnimation 1ms linear 80ms 1 normal forwards !important;

    }

  }

  ${cssText10_show_more_blinker}

  `;


  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (this instanceof Window ? this : window);

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'mchbwnoasqph';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;


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
      console.log(itz);
      return null;
    } else {
      return itz === d;
    }
  }


  console.assert(MAX_ITEMS_FOR_TOTAL_DISPLAY > 0 && MAX_ITEMS_FOR_FULL_FLUSH > 0 && MAX_ITEMS_FOR_TOTAL_DISPLAY > MAX_ITEMS_FOR_FULL_FLUSH)

  let ENABLE_FULL_RENDER_REQUIRED_CAPABLE = false;
  const isContainSupport = CSS.supports('contain', 'layout paint style');
  if (!isContainSupport) {
    console.warn("Your browser does not support css property 'contain'.\nPlease upgrade to the latest version.".trim());
  } else {
    ENABLE_FULL_RENDER_REQUIRED_CAPABLE = true;
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
  const ENABLE_FULL_RENDER_REQUIRED = ENABLE_FULL_RENDER_REQUIRED_PREFERRED && ENABLE_FULL_RENDER_REQUIRED_CAPABLE && ENABLE_OVERFLOW_ANCHOR && ENABLE_NO_SMOOTH_TRANSFORM && NOT_FIREFOX;


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
      const { requestAnimationFrame, setTimeout, cancelAnimationFrame } = fc;
      const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  cleanContext(win).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, cancelAnimationFrame } = __CONTEXT__;


    (() => {
      // data manipulation

      if (!DO_PARTICIPANT_LIST_HACKS) return;

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


      /**

       h.onParticipantsChanged = function() {
          this.notifyPath("participantsManager.participants")
      }


      at h.onParticipantsChanged (live_chat_polymer.js:8334:41)
      at e.<anonymous> (live_chat_polymer.js:1637:69)
      at e.Bb [as __shady_dispatchEvent] (webcomponents-sd.js:46:110)
      at k.dispatchEvent (webcomponents-sd.js:122:237)
      at mu (live_chat_polymer.js:1677:71)
      at Object.wga [as fn] (live_chat_polymer.js:1678:99)
      at a._propertiesChanged (live_chat_polymer.js:1726:426)
      at b._flushProperties (live_chat_polymer.js:1597:200)
      at a._invalidateProperties (live_chat_polymer.js:1718:69)
      at a.notifyPath (live_chat_polymer.js:1741:182)

      */


      const beforeParticipantsMap = new WeakMap();

      const { notifyPath7081 } = (() => {

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

          const tag = "yt-live-chat-participant-list-renderer"
          const cProto = getProto(document.createElement(tag));
          if (!cProto || typeof cProto.attached !== 'function') {
            // for _registered, proto.attached shall exist when the element is defined.
            // for controller extraction, attached shall exist when instance creates.
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }


          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-participant-list-renderer hacks");

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
          assertor(() => fnIntegrity(cProto.flushRenderStamperComponentBindings_, '0.386.233')) // just warning


          cProto.flushRenderStamperComponentBindings66_ = cProto.flushRenderStamperComponentBindings_;

          cProto.flushRenderStamperComponentBindings_ = function () {
            // console.log('flushRenderStamperComponentBindings_')
            this.flushRenderStamperComponentBindings66_();
            if (this.resolveForDOMRendering781) {
              this.resolveForDOMRendering781();
              this.resolveForDOMRendering781 = null;
            }
          }

          cProto.__getAllParticipantsDOMRenderedLength__ = function () {
            const container = this.$.participants;
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

          console.groupEnd();

          if (onPageElements.length >= 1) {
            for (const s of onPageElements) {
              if ((s.inst || s).isAttached === true) {
                fpPList(s);
              }
            }
          }

        });

      };

      promiseForCustomYtElementsReady.then(onRegistryReadyForDataManipulation);


    })();

    IntersectionObserver && (() => {

      // dom manipulation

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


      const rafHub = (ENABLE_RAF_HACK_TICKERS || ENABLE_RAF_HACK_DOCKED_MESSAGE || ENABLE_RAF_HACK_INPUT_RENDERER || ENABLE_RAF_HACK_EMOJI_PICKER) ? new RAFHub() : null;


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

      ENABLE_FULL_RENDER_REQUIRED && (() => {

        document.addEventListener('animationstart', (evt) => {

          if (evt.animationName === 'dontRenderAnimation') {
            evt.target.classList.remove('dont-render');
            if (scrollChatFn) scrollChatFn();
          }

        }, true);

        const f = (elm) => {
          if (elm && elm.nodeType === 1) {
            elm.classList.add('dont-render');
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


      })();


      const watchUserCSS = () => {

        // if (!CSS.supports('contain-intrinsic-size', 'auto var(--wsr94)')) return;

        const getElemFromWR = (nr) => {
          const n = kRef(nr);
          if (n && n.isConnected) return n;
          return null;
        }

        const clearContentVisibilitySizing = () => {
          Promise.resolve().then(() => {

            let btnShowMoreWR = mWeakRef(document.querySelector('#show-more[disabled]'));

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

        const mightFirstCheckOnYtInit = () => {
          if (firstCheckedOnYtInit) return;
          firstCheckedOnYtInit = true;

          if (!document.body || !document.head) return;

          if (!assertor(() => location.pathname.startsWith('/live_chat') && location.search.indexOf('continuation=') >= 0)) return;

          addCssManaged();

          let efsContainer = document.getElementById('elzm-fonts-yk75g');
          if (efsContainer && efsContainer.parentNode !== document.body) {
            document.body.appendChild(efsContainer);
          }


        }

        if (!assertor(() => location.pathname.startsWith('/live_chat') && location.search.indexOf('continuation=') >= 0)) return;
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
                const len1 = cnt.activeItems_.length;
                cnt.flushActiveItems66_();
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

                  if (!ENABLE_FULL_RENDER_REQUIRED) scrollChatFn();
                }

                return 1;


              } catch (e) {
                console.warn(e);
              }
            }

            mclp.flushActiveItems77_ = async function () {
              try {

                const cnt = this;
                if (mlf > 1e9) mlf = 9;
                let tid = ++mlf;
                if (tid !== mlf || cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
                if (!cnt.activeItems_ || cnt.activeItems_.length === 0) return;

                // 4 times to maxItems to avoid frequent trimming.
                // 1 ... 10 ... 20 ... 30 ... 40 ... 50 ... 60 => 16 ... 20 ... 30 ..... 60 ... => 16

                const lockedMaxItemsToDisplay = this.data.maxItemsToDisplay944;
                this.activeItems_.length > lockedMaxItemsToDisplay * 4 && lockedMaxItemsToDisplay > 4 && this.activeItems_.splice(0, this.activeItems_.length - lockedMaxItemsToDisplay - 1);
                if (cnt.canScrollToBottom_()) {
                  if (cnt.mutexPromiseFA77) await cnt.mutexPromiseFA77;
                  if (tid !== mlf) return;
                  let qResolve = null;
                  cnt.mutexPromiseFA77 = new Promise(resolve => { qResolve = resolve; })
                  let res;
                  try {
                    res = await cnt.flushActiveItems78_(tid);
                    if (hasMoreMessageState === 1) {
                      hasMoreMessageState = 0;
                      const showMore = cnt.$['show-more'];
                      if (showMore) {
                        showMore.classList.remove('has-new-messages-miuzp');
                      }
                    }
                  } catch (e) {
                    console.warn(e);
                  }
                  qResolve && qResolve();
                  return res;
                } else {
                  if (hasMoreMessageState === 0) {
                    hasMoreMessageState = 1;
                    const showMore = cnt.$['show-more'];
                    if (showMore) {
                      showMore.classList.add('has-new-messages-miuzp');
                    }
                  }
                  // cnt.flushActiveItems66_();
                  // this.activeItems_.length > this.data.maxItemsToDisplay && this.activeItems_.splice(0, this.activeItems_.length - this.data.maxItemsToDisplay);
                  return 2;
                }
              } catch (e) {
                console.warn(e);
              }
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
                cnt.flushActiveItems77_().then(rt => {
                  if (rt === 1) resolve(1); // success, scroll to bottom
                  else if (rt === 2) resolve(2); // success, trim
                  else resolve(-1); // skip
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
              var b = this;
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

          console.log("[End]");
          console.groupEnd();

        });


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
              const d1 = ydd.durationSec;
              const d2 = ydd.fullDurationSec;

              if (d1 === d2 && d1 > 1) {

                if (d1 > 400) ratio2 = Math.round(ratio2 * 5) / 5; // 0.2%
                else if (d1 > 200) ratio2 = Math.round(ratio2 * 2) / 2; // 0.5%
                else if (d1 > 100) ratio2 = Math.round(ratio2 * 1) / 1; // 1%
                else if (d1 > 50) ratio2 = Math.round(ratio2 * 0.5) / 0.5; // 2%
                else if (d1 > 25) ratio2 = Math.round(ratio2 * 0.2) / 0.2; // 5% (max => 99px * 5% = 4.95px)
                else ratio2 = Math.round(ratio2 * 0.2) / 0.2;

              } else {
                ratio2 = Math.round(ratio2 * 5) / 5; // 0.2% (min)
              }

              // ratio2 = Math.round(ratio2 * 5) / 5;
              ratio2 = ratio2.toFixed(1);
              v = v.replace(`${ratio1}%`, `${ratio2}%`).replace(`${ratio1}%`, `${ratio2}%`);

              if (yd.__style_last__ === v) return;
              yd.__style_last__ = v;
              // do not consider any delay here.
              // it shall be inside the looping for all properties changes. all the css background ops are in the same microtask.

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

            if (ENABLE_RAF_HACK_TICKERS && rafHub !== null) {

              // cancelable - this.rafId < isAnimationPausedChanged >

              let doHack = false;

              if (typeof cProto.startCountdown === 'function' && typeof cProto.updateTimeout === 'function' && typeof cProto.isAnimationPausedChanged === 'function') {

                console.log('startCountdown', typeof cProto.startCountdown)
                console.log('updateTimeout', typeof cProto.updateTimeout)
                console.log('isAnimationPausedChanged', typeof cProto.isAnimationPausedChanged)

                doHack = fnIntegrity(cProto.startCountdown, '2.66.37') && fnIntegrity(cProto.updateTimeout, '1.76.45') && fnIntegrity(cProto.isAnimationPausedChanged, '2.56.30')

              }
              if (doHack) {

                cProto.startCountdown = function (a, b) {
                  // console.log('cProto.startCountdown', tag) // yt-live-chat-ticker-sponsor-item-renderer
                  if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
                  b = void 0 === b ? 0 : b;
                  void 0 !== a && (this.countdownMs = 1E3 * a,
                    this.countdownDurationMs = b ? 1E3 * b : this.countdownMs,
                    this.ratio = 1,
                    this.lastCountdownTimeMs || this.isAnimationPaused || (this.lastCountdownTimeMs = performance.now(),
                      this.rafId = rafHub.request(this.boundUpdateTimeout37_)))
                };

                cProto.updateTimeout = function (a) {
                  // console.log('cProto.updateTimeout', tag) // yt-live-chat-ticker-sponsor-item-renderer
                  if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
                  this.countdownMs = Math.max(0, this.countdownMs - (a - (this.lastCountdownTimeMs || 0)));
                  this.ratio = this.countdownMs / this.countdownDurationMs;
                  this.isAttached && this.countdownMs ? (this.lastCountdownTimeMs = a,
                    this.rafId = rafHub.request(this.boundUpdateTimeout37_)) : (this.lastCountdownTimeMs = null,
                      this.isAttached && ("auto" === this.hostElement.style.width && this.setContainerWidth(),
                        this.slideDown()))
                };

                cProto.isAnimationPausedChanged = function (a, b) {
                  if (!this.boundUpdateTimeout37_) this.boundUpdateTimeout37_ = this.updateTimeout.bind(this);
                  a ? rafHub.cancel(this.rafId) : !a && b && (a = this.lastCountdownTimeMs || 0,
                    this.detlaSincePausedSecs && (a = (this.lastCountdownTimeMs || 0) + 1E3 * this.detlaSincePausedSecs,
                      this.detlaSincePausedSecs = 0),
                    this.boundUpdateTimeout37_(a),
                    this.lastCountdownTimeMs = window.performance.now())
                };

                console.log('RAF_HACK_TICKERS', tag, "OK")
              } else if (tag === 'yt-live-chat-ticker-renderer') {

                // no timer function to be set on yt-live-chat-ticker-renderer

              } else {

                console.log('RAF_HACK_TICKERS', tag, "NG")
              }

            }

          }
          console.log("[End]");
          console.groupEnd();


        })


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
                console.log('handleTimeout', typeof cProto.handleTimeout)
                console.log('updateTimeout', typeof cProto.updateTimeout)

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
                  console.log('cProto.checkIntersections', tag)
                  if (this.dockableMessages.length) {
                    this.intersectRAF = rafHub.request(this.boundCheckIntersections);
                    var a = this.dockableMessages[0]
                      , b = this.hostElement.getBoundingClientRect();
                    a = a.getBoundingClientRect();
                    var c = a.top - b.top
                      , d = 8 >= c;
                    c = 8 >= c - this.hostElement.clientHeight;
                    if (d) {
                      for (var e; d;) {
                        e = this.dockableMessages.shift();
                        d = this.dockableMessages[0];
                        if (!d)
                          break;
                        d = d.getBoundingClientRect();
                        c = d.top - b.top;
                        var f = 8 >= c;
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

          });

        }


      }

      promiseForCustomYtElementsReady.then(onRegistryReadyForDOMOperations);


    })();


  });

})({ IntersectionObserver });
