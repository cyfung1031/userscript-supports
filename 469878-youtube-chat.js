// ==UserScript==
// @name                YouTube Super Fast Chat
// @version             0.102.26
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
// @require             https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@c2b707e4977f77792042d4a5015fb188aae4772e/library/nextBrowserTick.min.js
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

  /** @type {WeakMapConstructor} */
  const WeakMap = window.WeakMapOriginal || window.WeakMap;

  const DEBUG_LOG_GROUP_EXPAND = +localStorage.__debugSuperFastChat__ > 0;
  const DEBUG_LOG_HIDE_OK = true;
  const DEBUG_skipLog001 = true;
  const DEBUG_preprocessChatLiveActions = false;
  const DEBUG_customCreateComponent = false;
  
  // const SHOW_DEVTOOL_DEBUG = true; // for debug use
  const SHOW_DEVTOOL_DEBUG = typeof ResizeObserver === 'function' && CSS.supports('position-area:center');

  // *********** DON'T REPORT NOT WORKING DUE TO THE CHANGED SETTINGS ********************
  // The settings are FIXED! You might change them to try but if the script does not work due to your change, please, don't report them as issues

  /// -------------------------------------------------------------------------

  const USE_ADVANCED_TICKING = true;                      // DONT CHANGE
  // << if USE_ADVANCED_TICKING >>
  const FIX_TIMESTAMP_FOR_REPLAY = true;
  const FIX_TIMESTAMP_TEXT = true;
  const ATTEMPT_TICKER_ANIMATION_START_TIME_DETECTION = true; // MUST BE true
  const REUSE_TICKER = true;  // for better memory control; currently it is only available in ADVANCED_TICKING; to be further reviewed << NO EFFECT SINCE ENABLE_TICKERS_BOOSTED_STAMPING IS USED >>
  // << end >>

  const ENABLE_CHAT_MESSAGES_BOOSTED_STAMPING = true;     // TRUE to boost chat messages rendering (DONT CHANGE)
  const ENABLE_TICKERS_BOOSTED_STAMPING = true;           // TRUE to boost chat messages rendering (DONT CHANGE)
  const DISABLE_DYNAMIC_TICKER_WIDTH = true;              // We use the opacity change instead
  const FIX_REMOVE_TICKER_ITEM_BY_ID = true;              // TRUE by default

  /// -------------------------------------------------------------------------

  // ENABLE_REDUCED_MAXITEMS_FOR_FLUSH and MAX_ITEMS_FOR_FULL_FLUSH are removed due to ENABLE_CHAT_MESSAGES_BOOSTED_STAMPING is introduced

  // const ENABLE_REDUCED_MAXITEMS_FOR_FLUSH = true;         // TRUE to enable trimming down to MAX_ITEMS_FOR_FULL_FLUSH (25) messages when there are too many unrendered messages
  const MAX_ITEMS_FOR_TOTAL_DISPLAY = 90;                 // By default, 250 latest messages will be displayed, but displaying MAX_ITEMS_FOR_TOTAL_DISPLAY (90) messages is already sufficient. (not exceeding 900)
  // const MAX_ITEMS_FOR_FULL_FLUSH = 25;                    // If there are too many new (stacked) messages not yet rendered, clean all and flush MAX_ITEMS_FOR_FULL_FLUSH (25) latest messages then incrementally added back to MAX_ITEMS_FOR_TOTAL_DISPLAY (90) messages. (not exceeding 900)

  const ENABLE_NO_SMOOTH_TRANSFORM = true;                // Depends on whether you want the animation effect for new chat messages <<< DON'T CHANGE >>>
  // const USE_OPTIMIZED_ON_SCROLL_ITEMS = true;             // TRUE for the majority
  const ENABLE_OVERFLOW_ANCHOR_PREFERRED = true;          // Enable `overflow-anchor: auto` to lock the scroll list at the bottom for no smooth transform. (Safari is not supported)

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
  
  // Don't delay dispatchEvent
  const ENABLE_untrack_fire_custom_event_killswitch = true;

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

  // BROWSER SUPPORT: Chrome 75+, Edge 79+, Safari 13.1+, Firefox 63+, Opera 62+
  const TICKER_MAX_STEPS_LIMIT = 500;                       //  NOT LESS THAN 5 STEPS!!
  // (( KEEP AS ALTERNATIVE IF USE_ADVANCED_TICKING NOT WORKING ))
  // [limiting 500 max steps] is recommended for "confortable visual change"
  //      min. step increment 0.2% => max steps: 500 =>  800ms per each update
  //      min. step increment 0.5% => max steps: 200 => 1000ms per each update
  //      min. step increment 1.0% => max steps: 100 => 1000ms per each update
  //      min. step increment 2.5% => max steps:  40 => 1000ms per each update
  //      min. step increment 5.0% => max steps:  20 => 1250ms per each update
  const ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX = true;    // for video playback's ticker issue. [ Playback Replay - Pause at Middle - Backwards Seeking ]
  const SKIP_VIDEO_PLAYBACK_PROGRESS_STATE_FIX_FOR_NO_TIMEFX = false; // debug use; yt-live-chat-ticker-renderer might not require ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX
  // << end >>

  const FIX_TOOLTIP_DISPLAY = true;                       // changed in 2024.05.02; updated in 2025.01.10
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

  const CHANGE_MANAGER_UNSUBSCRIBE = true;

  const INTERACTIVITY_BACKGROUND_ANIMATION = 1;         // mostly for pinned message
  // 0 = default Yt animation background [= no fix];
  // 1 = disable default animation background [= keep special animation];
  // 2 = disable all animation backgrounds [= no animation backbround]

  const CLOSE_TICKER_PINNED_MESSAGE_WHEN_HEADER_CLICKED = true;

  const MAX_TOOLTIP_NO_WRAP_WIDTH = '72vw'; // '' for disable; accept values like '60px', '25vw'

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

  const FIX_UNKNOWN_BUG_FOR_OVERLAY = true;       // no .prepare() in backdrop element. reason is unknown.

  const FIX_MOUSEOVER_FN = true;  // avoid onMouseOver_ being triggerd quite a lot

  // -------------------------------

  const USE_OBTAIN_LCR_BY_BOTH_METHODS = false; // true for play safe

  const FIX_MEMORY_LEAKAGE_TICKER_ACTIONMAP = true;       // To fix Memory Leakage in yt-live-chat-ticker-...-item-renderer
  const FIX_MEMORY_LEAKAGE_TICKER_STATSBAR = true;        // To fix Memory Leakage in updateStatsBarAndMaybeShowAnimation
  const FIX_MEMORY_LEAKAGE_TICKER_TIMER = true;           // To fix Memory Leakage in setContainerWidth, slideDown, collapse // Dec 2024 fix in advance tickering
  const FIX_MEMORY_LEAKAGE_TICKER_DATACHANGED_setContainerWidth = true; // To fix Memory Leakage due to _.ytLiveChatTickerItemBehavior.setContainerWidth()


  // const USE_RM_ON_FOUNTAIN_MODEL = false;                 // No longer working since 2025.04.15
  // const DEBUG_RM_ON_FOUNTAIN_MODEL = false;
  // const FOUNTAIN_MODEL_TIME_CONFIRM = 1600; // 800 not sufficient; re-adding?
  const MODIFY_EMIT_MESSAGES_FOR_BOOST_CHAT = true; // enabled for boost chat only; instant emit & no background flush

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


  /// ------

  // https://www.youtube.com/watch?v=byyvH5t0hKc
  // yt-live-chat-ticker-creator-goal-view-model
  // no ticker effect on timing

  /*


          {
              "id": "ChwKGkNQS0pyNV9NdG9vREZVYlB6Z2FkRHWFUv2E",
              "initialTickerText": {
                  "content": "Goal",
                  "styleRuns": [
                      {
                          "startIndex": 0,
                          "length": 4
                      }
                  ]
              },
              "tickerIcon": {
                  "sources": [
                      {
                          "clientResource": {
                              "imageName": "TARGET_ADD"
                          }
                      }
                  ]
              },
              "showGoalStatusCommand": {
                  "innertubeCommand": {
                      "clickTrackingParams": "CCQQ7NANIhMI58DT_ef5rhMVxMW1Cx4qBzTz",
                      "showEngagementPanelEndpoint": {
                          "engagementPanel": {
                              "engagementPanelSectionListRenderer": {
                                  "header": {
                                      "engagementPanelTitleHeaderRenderer": {
                                          "actionButton": {
                                              "buttonRenderer": {
                                                  "icon": {
                                                      "iconType": "QUESTION_CIRCLE"
                                                  },
                                                  "trackingParams": "CCgQ8FsiEwjm0Iz72rbKBxXT1EQBJekHNQM=",
                                                  "command": {
                                                      "clickTrackingParams": "CCgQ8FsiEwjm0Iz72rbKBxXT1EQBJekHNQM=",
                                                      "commandExecutorCommand": {
                                                          "commands": [
                                                              {
                                                                  "clickTrackingParams": "CCgQ8FsiEwjm0Iz72rbKBxXT1EQBJekHNQM=",
                                                                  "liveChatDialogEndpoint": {
                                                                      "content": {
                                                                          "liveChatDialogRenderer": {
                                                                              "trackingParams": "CCkQzS8iEwjm0Iz72rbKBxXT1EQBJekHNQM=",
                                                                              "title": {
                                                                                  "runs": [
                                                                                      {
                                                                                          "text": "Super Chat Goal"
                                                                                      }
                                                                                  ]
                                                                              },
                                                                              "dialogMessages": [
                                                                                  {
                                                                                      "runs": [
                                                                                          {
                                                                                              "text": "Join the fun by participating in the goal! "
                                                                                          },
                                                                                          {
                                                                                              "text": "Learn more.\n",
                                                                                              "navigationEndpoint": {
                                                                                                  "clickTrackingParams": "CCkQzS8iEwjm0Iz72rbKBxXT1EQBJekHNQM="
                                                                                              }
                                                                                          }
                                                                                      ]
                                                                                  },
                                                                                  {
                                                                                      "runs": [
                                                                                          {
                                                                                              "text": "How to participate",
                                                                                              "bold": true,
                                                                                              "textColor": 4294967295
                                                                                          },
                                                                                          {
                                                                                              "text": "\n"
                                                                                          },
                                                                                          {
                                                                                              "text": "1. Press \"Continue\"\n2. Purchase a Super Chat \n3. Watch the progress towards the goal\n4. Celebrate achieving it with the community!",
                                                                                              "textColor": 4294967295
                                                                                          }
                                                                                      ]
                                                                                  }
                                                                              ],
                                                                              "confirmButton": {
                                                                                  "buttonRenderer": {
                                                                                      "style": "STYLE_MONO_FILLED",
                                                                                      "size": "SIZE_DEFAULT",
                                                                                      "isDisabled": false,
                                                                                      "text": {
                                                                                          "simpleText": "Got it"
                                                                                      },
                                                                                      "trackingParams": "CCoQ8FsiEwjm0Iz72rbKBxXT1EQBJekHNQM=",
                                                                                      "accessibilityData": {
                                                                                          "accessibilityData": {
                                                                                              "label": "Got it"
                                                                                          }
                                                                                      }
                                                                                  }
                                                                              }
                                                                          }
                                                                      }
                                                                  }
                                                              },
                                                              {
                                                                  "clickTrackingParams": "CCgQ8FsiEwjm0Iz72rbKBxXT1EQBJekHNQM=",
                                                                  "hideEngagementPanelEndpoint": {
                                                                      "identifier": {
                                                                          "surface": "ENGAGEMENT_PANEL_SURFACE_LIVE_CHAT",
                                                                          "tag": "creator_goal_progress_engagement_panel"
                                                                      }
                                                                  }
                                                              }
                                                          ]
                                                      }
                                                  }
                                              }
                                          },
                                          "trackingParams": "CCUQ040EIhMI58DT_ef5rhMVxMW1Cx4qBzTz"
                                      }
                                  },
                                  "content": {
                                      "sectionListRenderer": {
                                          "contents": [
                                              {
                                                  "creatorGoalProgressFlowViewModel": {
                                                      "creatorGoalEntityKey": "EgtieXl2SDV0MGhLYyG7BzhF",
                                                      "progressFlowButton": {
                                                          "buttonViewModel": {
                                                              "onTap": {
                                                                  "innertubeCommand": {
                                                                      "clickTrackingParams": "CCcQ8FsiEwjm0Iz72rbKBxXT1EQBJekHNQM=",
                                                                      "commandMetadata": {
                                                                          "webCommandMetadata": {
                                                                              "ignoreNavigation": true
                                                                          }
                                                                      },
                                                                      "liveChatPurchaseMessageEndpoint": {
                                                                          "params": "Q2lrcUp3b1lWVU14ZFdObmIwTmZjMGQzZDE5RmRYVTFhVTF4Y0ZGM0VndGllWGwyU0RWME1HaExZeEFCSUFFNEFFSUNDQUUlM0Q="
                                                                      }
                                                                  }
                                                              },
                                                              "style": "BUTTON_VIEW_MODEL_STYLE_MONO",
                                                              "trackingParams": "CCcQ8FsiEwjm0Iz72rbKBxXT1EQBJekHNQM=",
                                                              "type": "BUTTON_VIEW_MODEL_TYPE_FILLED",
                                                              "titleFormatted": {
                                                                  "content": "Continue",
                                                                  "styleRuns": [
                                                                      {
                                                                          "startIndex": 0,
                                                                          "length": 8
                                                                      }
                                                                  ]
                                                              }
                                                          }
                                                      },
                                                      "progressCountA11yLabel": "Super Chat goal progress: $0 out of $1"
                                                  }
                                              }
                                          ],
                                          "trackingParams": "CCYQui8iEwjm0Iz72rbKBxXT1EQBJekHNQM="
                                      }
                                  },
                                  "identifier": {
                                      "surface": "ENGAGEMENT_PANEL_SURFACE_LIVE_CHAT",
                                      "tag": "creator_goal_progress_engagement_panel"
                                  }
                              }
                          },
                          "identifier": {
                              "surface": "ENGAGEMENT_PANEL_SURFACE_LIVE_CHAT",
                              "tag": "creator_goal_progress_engagement_panel"
                          },
                          "engagementPanelPresentationConfigs": {
                              "engagementPanelPopupPresentationConfig": {
                                  "popupType": "PANEL_POPUP_TYPE_DIALOG"
                              }
                          }
                      }
                  }
              },
              "creatorGoalEntityKey": "EgtieXl2SDV0MGhLYyG7BzhF",
              "shouldShowSetUpFlowOnMobile": true,
              "a11yLabel": "See Super Chat goal",
              "loggingDirectives": {
                  "trackingParams": "CCQQ7NANIhMI58DT_ef5rhMVxMW1Cx4qBzTz",
                  "visibility": {
                      "types": "12"
                  }
              }
          }


  */


  // ------

  const { IntersectionObserver } = __CONTEXT__;
  let _x69;
  try {
    _x69 = document.createAttributeNS("http://www.w3.org/2000/svg", "nil").addEventListener;
  } catch (e) { }
  const pureAddEventListener = _x69;
  if (!pureAddEventListener) return console.warn("pureAddEventListener cannot be obtained.");

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.
  const [setTimeout_] = [setTimeout];
  // let jsonParseFix = null;
  const Image_ = Image;
  /** @type {typeof HTMLElement} */
  const HTMLElement_ = Reflect.getPrototypeOf(HTMLTitleElement);

  const nextBrowserTick_ = nextBrowserTick;
  if (typeof nextBrowserTick_ !== "function" || (nextBrowserTick_.version || 0) < 2) {
    console.log('nextBrowserTick is not found.');
    return;
  }

  if (!IntersectionObserver) return console.warn("Your browser does not support IntersectionObserver.\nPlease upgrade to the latest version.");
  if (typeof WebAssembly !== 'object') return console.warn("Your browser is too old.\nPlease upgrade to the latest version."); // for passive and once

  if (typeof CSS === 'undefined' || typeof (CSS || 0).supports !== 'function' || !CSS.supports('left', 'clamp(-100%, calc( -100% * 0.5 ), 0%)')) {
    return console.warn("Your browser is too old.\nPlease upgrade to the latest version."); // for advanced tickering
  }


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

  const ENABLE_FONT_PRE_RENDERING = typeof HTMLElement_.prototype.append === 'function' ? (ENABLE_FONT_PRE_RENDERING_PREFERRED || 0) : 0;
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

  const cssText19_FOR_ADVANCED_TICKING = USE_ADVANCED_TICKING ? `

      ticker-bg-overlay {
        display: block;
        position: absolute;
        z-index: -1;
        box-sizing: border-box;
        border: 0;
        padding: 0;
        margin: 0;
        width: 200%;
        top: 0;
        bottom: 0;
        left: clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%);
        contain: strict;
        pointer-events: none;
      }
      ticker-bg-overlay-end2 {

        all:unset;
        position: fixed;
        display: block;
        margin-left: -0.5px;
        top: 8px;
        left: clamp(-250px, calc( 250px * ( ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) - 1 ) ), 2px);

        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        box-sizing: border-box;
        border: 0;
        padding: 0;
        margin: 0;
        contain: strict;
        z-index: -1;
        visibility: collapse;


      }


        /* .r6-closing-ticker is provided in ADVANCED_TICKING */
        /* so .r6-width-adjustable is only available for ADVANCED_TICKING too */

        /* DO NOT use .r6-width-adjustable ~ .r6-width-adjustable  => very laggy */

        /*
        yt-live-chat-ticker-renderer {
          --r6-transition-duration: 0.2s;
        }

        .r6-width-adjustable, .yt-live-chat-ticker-stampdom {
          --r6-transition-duration-v: var(--r6-transition-duration);
          transition: var(--r6-transition-duration-v);
        }

        .r6-width-adjustable-f {
          --r6-transition-duration-v: 0s;
        }

        .r6-closing-ticker[class] {
          --r6-transition-duration-v: var(--r6-transition-duration);
        }
          */



        .r6-width-adjustable {
          --r6-min-width: 0;
          min-width: var(--r6-min-width);
        }

        .r6-width-adjustable-f {
          --r6-min-width: max-content;
        }

        .r6-closing-ticker[class] {
          --r6-min-width: 0;
        }

  ` : '';

  const cssText20_TICKER_SIZING = ENABLE_TICKERS_BOOSTED_STAMPING && DISABLE_DYNAMIC_TICKER_WIDTH ? `

    :root {
      --ticker-items-gap: 8px;
    }
    #ticker-items.yt-live-chat-ticker-renderer {
        position: relative;
        transform: translateZ(1px);
        box-sizing: border-box;
        contain: style;
        display: flex;
        flex-direction: row;
        gap: var(--ticker-items-gap);
    }
    #container.yt-live-chat-ticker-renderer {
        contain: layout paint style;
    }

    .yt-live-chat-ticker-stampdom {
      position: static;
      width: max-content;
      content-visibility:auto;
    }
    .yt-live-chat-ticker-stampdom[class] {
      transition: none;
    }
    .yt-live-chat-ticker-stampdom-container {
      position: static;
      width: max-content;
      content-visibility:auto;
    }

    .yt-live-chat-ticker-stampdom {
      margin-right:0 !important; /* flex gap 8px */
    }

    
    /* default animation */
    .yt-live-chat-ticker-stampdom {
        animation: ticker-shown-animation 220ms ease-in 0s 1 normal forwards;
    }
    
   
    /* default animation */
    @keyframes ticker-shown-animation {
        0%, 70%, 100% { opacity: 1; }
        30% { opacity: 0.2; }
    }


  ` : "";
  // const cssText19_FOR_ADVANCED_TICKING = `

  // ticker-bg-overlay {
  //   display: block;
  //   position: absolute;
  //   z-index: -1;
  //   box-sizing: border-box;
  //   border: 0;
  //   padding: 0;
  //   margin: 0;
  //   width: 200%;
  //   top: 0;
  //   bottom: 0;
  //   left: clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%);
  //   contain: strict;
  // }
  //   /*
  // ticker-bg-overlay-end {
  //   position: absolute;
  //   right: 0px;
  //   top: 50%;
  //   display: block;
  //   width: 1px;
  //   height: 1px;
  //   opacity: 0;
  //   pointer-events: none;
  //   box-sizing: border-box;
  //   border: 0;
  //   padding: 0;
  //   margin: 0;
  //   contain: strict;
  // }
  //   */

  // ticker-bg-overlay-end2 {

  //   all:unset;
  //   position: fixed;
  //   display: block;
  //   margin-left: -0.5px;
  //   top: 8px;
  //   left: clamp(-250px, calc( 250px * ( ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) - 1 ) ), 2px);

  //   width: 1px;
  //   height: 1px;
  //   opacity: 0;
  //   pointer-events: none;
  //   box-sizing: border-box;
  //   border: 0;
  //   padding: 0;
  //   margin: 0;
  //   contain: strict;
  //   z-index: -1;
  //   visibility: collapse;


  // }

  // /* USE_ADVANCED_TICKING */

  // /*

  // .ticker-no-transition-time, .ticker-no-transition-time [id] {
  //   transition-duration: 0s !important;
  // }

  // [r6-advanced-ticking] .style-scope.yt-live-chat-ticker-renderer ~ .style-scope.yt-live-chat-ticker-renderer:not(.r6-closing-ticker) {
  //   transition-duration: 0s !important;
  // }

  // */

  // .r6-width-adjustable ~ .r6-width-adjustable {
  //   --r6-min-width: max-content;
  // }

  // .r6-closing-ticker[class] {
  //   --r6-min-width: 0px;
  // }

  // .r6-width-adjustable {
  //   min-width: var(--r6-min-width, 0px);
  // }


  //   /*


  // .r6-width-adjustable {
  //   transition-duration: var(--r6-transition-duration, 0s) !important;
  // }

  // .r6-width-adjustable-first {
  //   --r6-transition-duration: 0.2s;
  // }

  // .r6-width-adjustable ~ .r6-width-adjustable-first {
  //   --r6-transition-duration: 0s;
  // }

  // .r6-closing-ticker {
  //   --r6-transition-duration: 0.2s;
  // }
  //   */

  // /*


  //   ey.style.position = 'absolute';
  //   ey.style.right = '0px';
  //   ey.style.top = '50%';
  //   ey.style.display='block';
  //   ey.style.width='1px';
  //   ey.style.height='1px';
  //   ey.style.opacity = '0';

  //   em.style.display = 'block';
  //   em.style.position = 'absolute';
  //   em.style.boxSizing = 'border-box';
  //   em.style.width = '200%';
  //   em.style.top = '0';
  //   em.style.bottom = '0';
  //   // em.style.height = '100%';


  //   // em.style.left = '-50%';
  //   // em.style.left = "clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%)";

  // */

  // `;

  const addCss = () => `

    yt-live-chat-renderer {
      max-height: 100vh;
    }

    @property --ticker-rtime {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 0%;
    }

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
    
      #item-scroller.style-scope.yt-live-chat-item-list-renderer[class] {
        overflow-anchor: initial !important; /* whenever ENABLE_OVERFLOW_ANCHOR or not */
      }
    }

      
    item-anchor {

        height: 1px;
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

    ${cssText20_TICKER_SIZING}

  `;

  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (this instanceof Window ? this : window);

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'mchbwnoasqph';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  const setTimeoutX0 = setTimeout;
  const clearTimeoutX0 = clearTimeout;
  const setIntervalX0 = setInterval;
  const clearIntervalX0 = clearInterval;

  const __shady_native_appendChild = HTMLElement_.prototype.__shady_native_appendChild || HTMLElement_.prototype.appendChild;
  const __shady_native_removeChild = HTMLElement_.prototype.__shady_native_removeChild || HTMLElement_.prototype.removeChild;

  const isEmptyObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  const firstObjectKey = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') return key;
    }
    return null;
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

  let ttpHTML = (s) => {
    ttpHTML = s => s;
    if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
      let s = s => s;
      trustedTypes.createPolicy('default', { createHTML: s, createScriptURL: s, createScript: s });
    }
    return s;
  }

  // YTid 名稱修復器
  // https://chromewebstore.google.com/detail/ytid-%E5%90%8D%E7%A8%B1%E4%BF%AE%E5%BE%A9%E5%99%A8/ajdaedmmnojooglhpjlgajfhddchhcog
  // https://addons.mozilla.org/zh-TW/firefox/addon/ytid-%E5%90%8D%E7%A8%B1%E4%BF%AE%E5%BE%A9%E5%99%A8/
  // https://greasyfork.org/scripts/469878/discussions/317330
  const fixForYTidRenamer = (node) => {
    const s = new Set();
    const testFn = (node) => node.hasAttribute("data-ytid-handle") || node.hasAttribute("data-ytid-replaced");
    if (node && node.nodeType > 0 && testFn(node)) {
      s.add(node);
      if (node && node.nodeType === 1) {
        for (const childNode of node.querySelectorAll("*")) {
          if (testFn(childNode)) s.add(childNode);
        }
      }
      for (const node of s) {
        node.removeAttribute("data-ytid-replaced");
        if (node.dataset) {
          if (node.nodeName === "SPAN") {
            const handle = node.dataset.ytidHandle || "";
            const display = node.dataset.ytidDisplay || "";
            const handleTrimmed = handle.trim();
            const displayTrimmed = display.trim();
            if (handleTrimmed && displayTrimmed && node.textContent.trim() === displayTrimmed) {
              node.textContent = node.textContent.replace(displayTrimmed, handleTrimmed);
            }
          }
          delete node.dataset.ytidDisplay;
          delete node.dataset.ytidHandle;
          delete node.dataset.ytidChannelId;
          delete node.dataset.ytidBoundHandle;
          delete node.dataset.ytidCommentKey;
        }
      }
      s.clear();
    }
  };

  if (ENABLE_CHAT_MESSAGES_BOOSTED_STAMPING) {

    let shouldCheckYTidRenamer = false;
    document.addEventListener("youtube-chat-element-before-remove", (event) => {
      shouldCheckYTidRenamer && fixForYTidRenamer(event.target);
    }, true);
    document.addEventListener("youtube-chat-element-after-append", (event) => {
      if (tryCheckCount > 4) tryCheckCount = 4;
      shouldCheckYTidRenamer && fixForYTidRenamer(event.target);
    }, true);

    let tryCheckCount = 9999;
    (new MutationObserver((mutations, observer) => {
      if (--tryCheckCount <= 0) observer.disconnect();
      if (!shouldCheckYTidRenamer) {
        if (document.querySelector("[data-ytid-handle], [data-ytid-replaced]")) {
          shouldCheckYTidRenamer = true;
          console.log("[yt-chat] fixForYTidRenamer is enabled");
        }
      }
    })).observe(document, { subtree: true, childList: true });

  }

  // const nextBrowserTick_ = nextBrowserTick;
  // const nextBrowserTick_ = (f) => {
  //   typeof nextBrowserTick === 'function' ? nextBrowserTick(f) : setTimeout(f, Number.MIN_VALUE);
  // };


  // const { accurateTiming, isAccurateTimingUsable } = (() => {
  //   let audioCtx_ = null;
  //   let sampleRate = 0;
  //   const isAccurateTimingUsable = () => sampleRate > 0;
  //   const kill = () => {
  //     sampleRate = audioCtx_.currentTime;
  //     document.removeEventListener('pointerdown', listener, { capture: true, passive: true });
  //     document.removeEventListener('keydown', listener, { capture: true, passive: true });
  //   };
  //   const listener = (e) => {
  //     if (e.isTrusted === true) {
  //       if (!audioCtx_) {
  //         audioCtx_ = new (window.AudioContext || window.webkitAudioContext)();
  //       }
  //       if (audioCtx_.state === 'suspended') {
  //         const p = audioCtx_.resume();
  //         if (p && typeof p.then === 'function') p.then(kill);
  //       } else if (audioCtx_.state === 'running') {
  //         kill();
  //       }
  //     }
  //   };
  //   document.addEventListener('pointerdown', listener, { capture: true, passive: true });
  //   document.addEventListener('keydown', listener, { capture: true, passive: true });
  //   const fnSym = Symbol()
  //   const commonOscClean = (osc) => {
  //     osc[fnSym] = osc.onended = null;
  //   }
  //   const commonOscOnEnded = function () {
  //     this[fnSym]()
  //     Promise.resolve(this).then(commonOscClean)
  //   }
  //   let buffer_;
  //   const accurateTiming = (fn, delay) => {
  //     if (!sampleRate) return false;
  //     const audioCtx = audioCtx_;
  //     const ct = audioCtx.currentTime;

  //     if (!(delay >= 0)) delay = 0;
  //     const stopTime = ct + delay;
  //     let startTime = ct + delay - (1 / sampleRate);
  //     if (startTime === stopTime) startTime -= 1;
  //     if (startTime < 0) startTime = 0;

  //     if (!buffer_) {
  //       buffer_ = audioCtx.createBuffer(1, 1, sampleRate);
  //       // const data = buffer.getChannelData(0)
  //       // data[0] = 1e-20 // tiny pulse – not silent!
  //     }

  //     const buffer = buffer_;
  //     const source = audioCtx.createBufferSource()
  //     source.buffer = buffer
  //     source.connect(audioCtx.destination) // or silent gain node

  //     source[fnSym] = fn
  //     source.onended = commonOscOnEnded
  //     source.start(startTime) // schedule start

  //     return true;
  //   }
  //   return { accurateTiming, isAccurateTimingUsable }
  // })();

  const toUniqueArr = (arr) => {
    const s = new Set(arr);
    const r = [...s];
    s.clear();
    return r;
  }

  let qWidthAdjustable = null;

  /** @type {typeof PromiseExternal.prototype | null} */
  let relayPromise = null;


  /** @type {typeof PromiseExternal.prototype | null} */
  let onPlayStateChangePromise = null;


  const reuseId = `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;

  const reuseStore = new Map();
  reuseStore.set = reuseStore.setOriginal || reuseStore.set;

  let onPageContainer = null;

  let timestampRef = null;

  const timestampUsecTranslator = (x) => {
    if (!x || typeof x !== "string") return x;
    if (timestampRef === null) {
      // 9 years -> 48.01 bits. 2^(48-53) = 0.03125 for μs
      timestampRef = Math.floor(+x / 1000 - 9 * 365 * 24 * 60 * 60 * 1000); // store millisecond
    }
    if (x.charCodeAt(0) === 57 ? x.length < 16 : x.length < 17) {
      return x - timestampRef * 1000;
    } else {
      return Number(BigInt(x) - BigInt(timestampRef) * 1000n);
    }
  };

  const progressTimeRefOrigin = Math.floor(performance.timeOrigin / 1000 / 300_000 - 180) * 300_000; // <integer second>
  const timeOriginDT = progressTimeRefOrigin; // <integer second>

  const customCreateComponent = (component, data, bool, onCreateComponentError)=>{

    const componentTag = typeof component === 'string'  ? component : typeof (component||0).component === 'string' ? (component||0).component  : '';
    if(componentTag){

      if(REUSE_TICKER && data.id && data.fullDurationSec){
        // bool (param c) is true by default; just force it to reuse no matter true or false

        if (!bool) {
          // show a warning if it is false.
          console.warn('[yt-chat] REUSE_TICKER: reuse bool is false');
        }

        const record = reuseStore.get(`<${componentTag}>${data.id}:${data.fullDurationSec}`);

        const cnt = kRef(record);


        if(cnt && cnt.isAttached === false){

          const hostElement = cnt.hostElement;

          if(hostElement instanceof HTMLElement_ && hostElement.isConnected === false && hostElement.parentNode === null && hostElement.getAttribute('__reuseid__')===reuseId ){

          // console.log(952, cnt.hostElement.parentNode)
          // debugger;
            if (hostElement.hasAttribute('__nogc__')) {

              Promise.resolve(hostElement).then((hostElement) => {
                // microtask to provide some time for DOM attachment.
                hostElement.isConnected && hostElement.removeAttribute('__nogc__');
              });

            }

            //  ------- follow rm3 -------

            // a.prototype._initializeProtoProperties = function(c) {
            //         this.__data = Object.create(c);
            //         this.__dataPending = Object.create(c);
            //         this.__dataOld = {}
            //     }
            // a.prototype._initializeProperties = function() {
            //     this.__dataProto && (this._initializeProtoProperties(this.__dataProto),
            //     this.__dataProto = null);
            //     b.prototype._initializeProperties.call(this)
            // }
            // ;

            if(!cnt.__dataInvalid && cnt.__dataEnabled && cnt.__dataReady ){

              // console.log(12883);


              if (!onPageContainer) {
                let p = document.createElement('noscript');
                p.style.all = 'unset';
                document.body.prepend(p);
                onPageContainer = p;
              }

              onPageContainer.appendChild(hostElement); // to fix some issues for the rendered elements

              cnt.__dataInvalid = false;
              cnt.__dataEnabled = true;
              cnt.__dataReady = true;
              // cnt._initializeProtoProperties(cnt.data)

              // window.meaa = cnt.$.container;
              if (cnt.__data) cnt.__data = Object.assign({}, cnt.__data);
              cnt.__dataPending = {};
              cnt.__dataOld = {}

              try{
                cnt.markDirty();
              }catch(e){}
              try{
                cnt.markDirtyVisibilityObserver();
              }catch(e){}
              try{
                cnt.wasPrescan = cnt.wasVisible = !1
              }catch(e){}
  
              // try{
              //   cnt._setPendingProperty('data', Object.assign({}, cntData), !0);
              // }catch(e){}
              // // cnt.__dataInvalid = false;
              // // cnt._enableProperties();

              // try {
              //   cnt._flushProperties();
              // } catch (e) { }
  
              // cnt.ready();

            return hostElement;

            }


            // console.log(12323)

            // setTimeoutX0(()=>{
            //   console.log(window.meaa.parentNode)
            // }, 1000)


              // ------------ commented ------------
            
              // cnt.__dataInvalid = false;
              // cnt.__dataEnabled = false;
              // if (cnt.__dataPending && typeof cnt.__dataPending === 'object') cnt.__dataPending = null;
              // if (cnt.__dataOld && typeof cnt.__dataOld === 'object') cnt.__dataOld = null;
              // if (cnt.__dataCounter && typeof cnt.__dataCounter === 'number') cnt.__dataCounter = 0;
              // if ('__dataClientsInitialized' in cnt || '__dataClientsReady' in cnt) {
              //   cnt.__dataClientsReady = !1;
              //   cnt.__dataLinkedPaths = cnt.__dataToNotify = cnt.__dataPendingClients = null;
              //   cnt.__dataHasPaths = !1;
              //   cnt.__dataCompoundStorage = null; // cnt.__dataCompoundStorage = cnt.__dataCompoundStorage || null;
              //   cnt.__dataHost = null; // cnt.__dataHost = cnt.__dataHost || null;
              //   if (!cnt.__dataTemp) cnt.__dataTemp = {}; // cnt.__dataTemp = {};
              //   cnt.__dataClientsInitialized = !1;
              // }
  
              // try{
              //   cnt._flushProperties();
              // }catch(e){
              //   console.warn(e)
              // }
            
              // for (const elm of cnt.hostElement.getElementsByTagName('*')) {
              //   if (elm.is) {
              //     const cnt = insp(elm);
  
              //     cnt.__dataInvalid = false;
              //     cnt.__dataEnabled = false;
              //     if (cnt.__dataPending && typeof cnt.__dataPending === 'object') cnt.__dataPending = null;
              //     if (cnt.__dataOld && typeof cnt.__dataOld === 'object') cnt.__dataOld = null;
              //     if (cnt.__dataCounter && typeof cnt.__dataCounter === 'number') cnt.__dataCounter = 0;
              //     if ('__dataClientsInitialized' in cnt || '__dataClientsReady' in cnt) {
              //       cnt.__dataClientsReady = !1;
              //       cnt.__dataLinkedPaths = cnt.__dataToNotify = cnt.__dataPendingClients = null;
              //       cnt.__dataHasPaths = !1;
              //       cnt.__dataCompoundStorage = null; // cnt.__dataCompoundStorage = cnt.__dataCompoundStorage || null;
              //       cnt.__dataHost = null; // cnt.__dataHost = cnt.__dataHost || null;
              //       if (!cnt.__dataTemp) cnt.__dataTemp = {}; // cnt.__dataTemp = {};
              //       cnt.__dataClientsInitialized = !1;
              //     }
  
              //     try {
              //       cnt._flushProperties();
              //     } catch (e) {
              //       console.warn(e)
              //     }
  
              //     if (elm.nodeName === 'YT-ICON') {
              //       // console.log(2133, JSON.stringify( cnt.__data))
              //       const qq = Object.assign({}, cnt.__data)
              //       console.log(1232466)
              //       const _qww = cnt;
              //       cnt.__data = new Proxy(Object.assign({}, qq), {
              //         get(target, p) {
              //           console.log(12838, p)
  
              //           if (p === 'icon') {
              //             window.wmk = _qww.hostElement;
              //             //  debugger;
              //           }
              //           return target[p]
              //         },
              //         set(target, p, v) {
              //           console.log(12839, p)
              //           target[p] = v;
              //           if (p === 'icon') debugger;
              //           return true;
              //         }
              //       });
  
  
              //       Promise.resolve(cnt).then((cnt) => {
              //         cnt.__data = Object.assign({}, qq);
              //       });
              //     }
  
              //     // let q = elm.nextSibling;
              //     // let h = elm.parentNode;
              //     //             elm.remove();
              //     //           h.insertBefore(elm, q);
              //     // console.log(2233, elm)
              //   }
              // }
            
              // ------------ commented ------------

            //  ------- follow rm3 -------

            // console.log('[yt-chat] reuse')



          }

        }

      }

    }
    DEBUG_customCreateComponent && console.log(component, data, bool);
    /*

                  const cntData = this.data;
                  reuseStore.set(`${cntData.id}:${cntData.fullDurationSec}`, mWeakRef(this));
                  */

  }

  const valAssign = (elm, attr, val) => {
    if (typeof val === 'number') val = val.toFixed(3);
    const currentVal = elm.style.getPropertyValue(attr);
    if (currentVal === '' || !(Math.abs(currentVal - val) < 1e-5)) {
      elm.style.setProperty(attr, val);
      return true;
    }
    return false;
  };

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;


  const getAttributes = (node) => {
    const attrs = node.attributes;
    const res = {};
    for (const { name, value } of attrs) {
      res[name] = value;
    }
    res['"'] = attrs.length;
    // const res = new Array(attrs.length);
    // for (let i = 0; i < res.length; i++) {
    //   const { name, value } = attrs[i];
    //   res[i] = { name, value };
    // }
    return res;
  };

  // const __refreshData938o__ = {};
  // const __refreshData938__ = function (prop, opt) {
  //   const d = this[prop];
  //   if (d) {
  //     this._setPendingProperty(prop, __refreshData938o__, opt);
  //     this._setPendingProperty(prop, d, opt);
  //     this._invalidateProperties();
  //   }
  // };

  // const __refreshData933__ = function (prop, opt) {
  //   const d = this[prop];
  //   if (d) {
  //     this.signalProxy.setWithPath([prop], d);
  //   }
  // }

  // const setupRefreshData930 = (cnt) => {
  //   if (cnt.__refreshData930__ !== undefined) return;
  //   const cProto = Reflect.getPrototypeOf(cnt);
  //   let r = null;
  //   let flag = 0;
  //   if (typeof cnt._setPendingProperty === 'function' && typeof cnt._invalidateProperties === 'function' && cnt._setPendingProperty.length === 3 && cnt._invalidateProperties.length === 0) {
  //     flag |= 1;
  //   }
  //   if (typeof cnt.signalProxy !== "undefined") {
  //     flag |= 2;
  //   }
  //   if (typeof (cnt.signalProxy || 0).setWithPath === 'function' && cnt.signalProxy.setWithPath.length === 2) {
  //     flag |= 4;
  //   }
  //   if (r === 1) r = __refreshData938__;
  //   // else if (r === 6) r = __refreshData933__;
  //   cProto.__refreshData930__ = r;
  //   // ytd-comments-header-renderer : no _invalidateProperties (cnt.signalProxy.setWithPath)
  // }

  // const __refreshProps938__ = function () {
  //   const __data = this.__data;
  //   if (__data) {
  //     for (const key in __data) {
  //       const v = __data[key];
  //       if (typeof v === 'boolean') {
  //         this._setPendingProperty(key, !v) && this._setPendingProperty(key, v);
  //       } else if (typeof v === 'string') {
  //         this._setPendingProperty(key, `!${v}`) && this._setPendingProperty(key, `${v}`);
  //       } else if (typeof v === 'number') {
  //         this._setPendingProperty(key, v + 1) && this._setPendingProperty(key, v);
  //       }
  //     }
  //   }
  // }

  // const setupRefreshProps930 = (cnt) => {
  //   if (cnt.__refreshProps930__ !== undefined) return;
  //   const cProto = Reflect.getPrototypeOf(cnt);
  //   let r = null;
  //   let flag = 0;
  //   if (typeof cnt._setPendingProperty === 'function' && typeof cnt._invalidateProperties === 'function' && cnt._setPendingProperty.length === 3 && cnt._invalidateProperties.length === 0) {
  //     flag |= 1;
  //   }
  //   if (typeof cnt.signalProxy !== "undefined") {
  //     flag |= 2;
  //   }
  //   if (typeof (cnt.signalProxy || 0).setWithPath === 'function' && cnt.signalProxy.setWithPath.length === 2) {
  //     flag |= 4;
  //   }
  //   if (r === 1) r = __refreshProps938__;
  //   cProto.__refreshProps930__ = r;
  //   // ytd-comments-header-renderer : no _invalidateProperties (cnt.signalProxy.setWithPath)
  // }

  // const refreshChildrenYtIcons = (node) => {
  //   let goNext = false;
  //   for (const iconElm of node.getElementsByTagName('yt-icon')) {
  //     try {
  //       const cnt = insp(iconElm);
  //       setupRefreshProps930(cnt);
  //       if (cnt.__refreshProps930__) {
  //         cnt.__refreshProps930__();
  //         goNext = true;
  //       }
  //       // cnt.removeIconShape(); // detach iconShapeDataSignal?
  //       // cnt._setPendingProperty('isAttached', false);
  //     } catch (e) { }
  //     if (!goNext) break;
  //   }
  // }


  // const imageFetchCache = new Set();
  // const imageFetch = function (imageLink) {
  //   return new Promise(resolve => {
  //     let img = null;
  //     for (const cacheWR of imageFetchCache) {
  //       let p = kRef(cacheWR);
  //       if (!p) {
  //         imageFetchCache.delete(cacheWR);
  //       } else if (img.busy588 === false) {
  //         img = p;
  //         break;
  //       }
  //     }
  //     if (!img) {
  //       img = new Image_();
  //       imageFetchCache.add(mWeakRef(img));
  //     }
  //     img.busy588 = true;

  //     window.mkek = imageFetchCache.size;
  //     let f = () => {
  //       resolve && resolve();
  //       resolve = null;
  //       img.onload = null;
  //       img.onerror = null;
  //       img.busy588 = false;
  //       img = null;
  //     }
  //     img.onload = f;
  //     img.onerror = f;
  //     img.src = imageLink;
  //     f = null;
  //     imageLink = null;
  //   });
  // };


  const autoTimerFn = (() => {

    let p1 = null;
    let p2 = null;
    let p3 = null;
    setInterval(() => {
      if (p1) p1.resolve();
      p1 = p2;
      p2 = p3;
      p3 = null;
    }, 345.00123);

    return () => {
      const p = (p3 || (p3 = new PromiseExternal()));
      return p;
    };

  })();

  const __mockChildren__ = { get length() { return 0 } };
  const mockCommentElement = (x) => {
    // for flow chat
    if (x instanceof Node && x.nodeType !== 1 && !x.children) {
      x.children = __mockChildren__;
    }
    return x;
  }

  const wme = mockCommentElement(document.createComment('1'));
  let wmp = new PromiseExternal();
  const wmo = new MutationObserver(() => {
    wmp.resolve();
    wmp = new PromiseExternal();
  });
  wmo.observe(wme, { characterData: true });

  // ----- ticker removal helpers -----
  let storeTickerIds761 = new Map();
  const storeTickerIdInc761 = (dataId) => {
    if (dataId) {
      const store761 = storeTickerIds761;
      let w = store761.get(dataId) || 0;
      if (w) store761.delete(dataId);
      w = (w & 1073741823) + 1;
      store761.set(dataId, w);
      return w;
    }
    return 0;
  }
  let stampProcessId761_ = ""; // assign a random protection id during each stamping process
  // ----- ticker removal helpers -----

  let playEventsStack = Promise.resolve();

  let playerProgressChangedArg1 = null;
  let playerProgressChangedArg2 = null;
  let playerProgressChangedArg3 = null;

  let dntElementWeak = null;


  let timestampUnderLiveMode = false;

  const updateTickerCurrentTime = () => {

    if (resistanceUpdateDebugMode) {
      console.log('updateTickerCurrentTime')

      if (!dntElementWeak || !kRef(dntElementWeak)) dntElementWeak = mWeakRef(document.querySelector('yt-live-chat-ticker-renderer'));
      timestampUnderLiveMode = true;
    }

    const dntElement = kRef(dntElementWeak);
    const v = timestampUnderLiveMode ? (Date.now() / 1000 - timeOriginDT) : playerProgressChangedArg1;
    if (dntElement instanceof HTMLElement_ && v >= 0) {
      valAssign(dntElement, '--ticker-current-time', v);
    }
  }

  // ================== FOR USE_ADVANCED_TICKING ================

  let startResistanceUpdaterStarted = false;

  const RESISTANCE_UPDATE_OPT = 3;
  let resistanceUpdateLast = 0;
  let resistanceUpdateBusy = false;
  const resistanceUpdateDebugMode = false;
  const allBackgroundOverLays = document.getElementsByTagName('ticker-bg-overlay');
  // const rgFlag = {};
  const resistanceUpdateFn = (b) => {
    if (!resistanceUpdateDebugMode && allBackgroundOverLays.length === 0) return;
    resistanceUpdateBusy = false;
    const t = Date.now();
    const d = t - resistanceUpdateLast;
    if (d > 375) {
      resistanceUpdateLast = t;
      updateTickerCurrentTime();
    }
  }
  const resistanceUpdateFn_ = (forced = false) => {
    if (forced === true || timestampUnderLiveMode) {
      if (!resistanceUpdateBusy) {
        resistanceUpdateBusy = true;
        Promise.resolve().then(resistanceUpdateFn);
      }
    }
  }
  const startResistanceUpdater = () => {

    if (startResistanceUpdaterStarted) return;
    startResistanceUpdaterStarted = true;

    if (RESISTANCE_UPDATE_OPT & 1)
      document.addEventListener('yt-action', () => {
        resistanceUpdateFn_(true);
      }, true)

    resistanceUpdateFn_(true);
    setIntervalX0(resistanceUpdateFn_, 400);
  }

  if(resistanceUpdateDebugMode) startResistanceUpdater();


  function dr(s) {
    // reserved for future use
    return s;
    // return window.deWeakJS ? window.deWeakJS(s) : s;
  }


  const getProto = (element) => {
    if (element) {
      const cnt = insp(element);
      return cnt.constructor.prototype || null;
    }
    return null;
  }



  const logFn = (key, f) => {
    return Function.prototype.bind.call(console.log, console, `%c ${key}`, 'background: #222; color: #bada55', f);
  }



  const assertor = (f) => f() || (console.assert(false, `${f}`), false);

  const fnIntegrity_oldv1 = (f, d) => {


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


  const fnIntegrity = (f, d) => {


    if (!f || typeof f !== 'function') {
      console.warn('f is not a function', f);
      return;
    }
    // return; // M44
    let p = `${f}`, s = 0, j = -1, w = 0, q = ' ';
    // return; // M44
    for (let i = 0, l = p.length; i < l; i++) {
      let t = p[i];
      if (((t >= 'a' && t <= 'z') || (t >= 'A' && t <= 'Z'))) {
        if (j < i - 1) {
          w++;
          if (q === '$') s--;
        }
        j = i;
      } else {
        s++;
      }
      q = t;
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

  // let createElement_fountain_model_fn = null;
  // let createElement_fountain_model_enabled = null;

  // ; (USE_RM_ON_FOUNTAIN_MODEL) && (()=>{
  //   document.createElement4719 = document.createElement;
  //   document.createElement = function (a) {
  //     if (createElement_fountain_model_enabled) {
  //       const r = createElement_fountain_model_fn(a);
  //       if (r) return r;
  //     }
  //     return document.createElement4719(a);
  //   }
  // })();

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

      if (ENABLE_untrack_fire_custom_event_killswitch) {
        EXPERIMENT_FLAGS.untrack_fire_custom_event_killswitch = true;
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

  console.assert(MAX_ITEMS_FOR_TOTAL_DISPLAY > 0)
  // console.assert(MAX_ITEMS_FOR_TOTAL_DISPLAY > 0 && MAX_ITEMS_FOR_FULL_FLUSH > 0 && MAX_ITEMS_FOR_TOTAL_DISPLAY > MAX_ITEMS_FOR_FULL_FLUSH)

  const isContainSupport = CSS.supports('contain', 'layout paint style');
  if (!isContainSupport) {
    console.warn("Your browser does not support css property 'contain'.\nPlease upgrade to the latest version.".trim());
  }

  const isOverflowAnchorSupport = CSS.supports('overflow-anchor', 'auto');
  if (!isOverflowAnchorSupport) {
    console.warn("Your browser does not support css property 'overflow-anchor'.\nPlease upgrade to the latest version.".trim());
  }

  const ENABLE_OVERFLOW_ANCHOR = ENABLE_OVERFLOW_ANCHOR_PREFERRED && isOverflowAnchorSupport && ENABLE_NO_SMOOTH_TRANSFORM && typeof ResizeObserver === 'function';
  let WITH_SCROLL_ANCHOR = false;

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
  const nPrevElem = fxOperator(HTMLElement_.prototype, 'previousElementSibling');
  const nNextElem = fxOperator(HTMLElement_.prototype, 'nextElementSibling');
  const nLastElem = fxOperator(HTMLElement_.prototype, 'lastElementChild');

  let groupCI = [];
  let groupDI = 0;

  const [console_] = [console];
  const console1 = {
    log(...args) {
      if (!SHOW_DEVTOOL_DEBUG) return;
      if (groupDI === 1) return grouppedConsoleLog(...args);
      return console_.log(...args);
    },
    warn(...args) {
      if (!SHOW_DEVTOOL_DEBUG) return;
      if (groupDI === 1) return grouppedConsoleWarn(...args);
      return console_.warn(...args);
    },
    debug(...args) {
      if (!SHOW_DEVTOOL_DEBUG) return;
      if (groupDI === 1) return grouppedConsoleDebug(...args);
      return console_.debug(...args);
    }
  }
  const grouppedConsoleLog = (...args) => {
    if (DEBUG_LOG_HIDE_OK) {
      for (const arg of args) {
        if (typeof arg !== 'string') break;
        if (arg.endsWith('OK')) return;
      }
    }
    groupCI.push(['log', ...args]);
  }
  const grouppedConsoleWarn = (...args) => {
    groupCI.push(['warn', ...args]);
  }
  const grouppedConsoleDebug = (...args) => {
    groupCI.push(['debug', ...args]);
  }
  const groupCollapsed = (text1, text2) => {
    if (!SHOW_DEVTOOL_DEBUG) return;
    if (groupDI !== 0) console_.warn('groupDI in groupCollapsed fails', groupDI);
    groupDI++;
    groupCI.length = 0;

    let w = 'groupCollapsed';
    if (DEBUG_LOG_GROUP_EXPAND) w = 'group';
    groupCI.push([w, `%c${text1}%c${text2}`,
      "background-color: #010502; color: #6acafe; font-weight: 700; padding: 2px;",
      "background-color: #010502; color: #6ad9fe; font-weight: 300; padding: 2px;"
    ]);
  }
  const groupEnd = () => {
    if (!SHOW_DEVTOOL_DEBUG) return;
    groupDI--;
    if (groupDI !== 0) console_.warn('groupDI in groupEnd fails', groupDI);
    if (groupCI.length >= 0) {
      let withContent = false;
      for (const entry of groupCI) {
        if (entry[0] === 'group' || entry[0] === 'groupCollapsed') continue;
        if (entry[1] === '[Begin]' || entry[1] === '[End]') continue;
        withContent = true;
        break;
      }
      if (withContent) {
        for (const entry of groupCI) {
          const args = entry.slice(1);
          let colorHighLight = '';
          for (const arg of args) {
            if (typeof arg !== 'string') {
              colorHighLight = '';
              break;
            }
            if (arg === 'OK' || arg === 'NG') {
              colorHighLight = arg;
            } else {
              if (arg.endsWith(' OK')) colorHighLight = 'OK';
              else if (arg.endsWith(' NG')) colorHighLight = 'NG';
            }
          }
          let print = args;
          if (colorHighLight) {
            print = [args.map(e => `%c${e}`).join(' '), ...args.map(e => {
              if (colorHighLight === 'OK' && e.includes(colorHighLight)) return "background-color:rgb(29, 29, 29); color:rgb(57, 215, 83); font-weight: 600;";
              if (colorHighLight === 'NG' && e.includes(colorHighLight)) return "background-color:rgb(29, 29, 29); color:rgb(215, 133, 57); font-weight: 600;";
              return "background-color:rgb(29, 29, 29); color:rgb(231, 231, 231); font-weight: 400;";
            })];
          }
          console[entry[0]](...print);
        }
        console.groupEnd();
        groupCI.length = 0;
      }
    }
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

  const { insertBeforeNaFn, appendChildNaFn } = (() => {
    // native methods

    const insertBefore = HTMLElement_.prototype.insertBefore;
    const appendChild = HTMLElement_.prototype.appendChild;

    return {
      insertBeforeNaFn: (parent, node, child) => {
        insertBefore.call(parent, node, child);
      },
      appendChildNaFn: (parent, node) => {
        appendChild.call(parent, node);
      }
    };

    /*
        const insertBeforeFn = (parent, node, child) => {
          if ('__shady_native_insertBefore' in parent) parent.__shady_native_insertBefore(node, child);
          else parent.insertBefore(node, child);
        }

        const appendChildFn = (parent, node) =>{
          if('__shady_native_appendChild' in parent) parent.__shady_native_appendChild(node);
          else parent.appendChild(node);
        }
    */

  })();



  let __LCRInjection__ = 0; // 0 for no injection
  const LCRImmedidates = []; // array of sync. func

  let getLCRDummyP_ = null;
  // lcrPromiseFn
  const getLCRDummy = () => {

    /* remarks */

    /*

    // YouTube uses `<ps-dom-if class="style-scope ytd-live-chat-frame"><template></template></ps-dom-if>` to create yt-live-chat-renderer
    // <ps-dom-if> is located inside ytd-live-chat-frame#chat in main frame
    // <ps-dom-if>.hostElement is located as iframe's yt-live-chat-app > div#contents > yt-live-chat-renderer

    */


    // direct createElement or createComponent_ will make the emoji rendering crashed. reason TBC

    return getLCRDummyP_ || (getLCRDummyP_ = Promise.all([customElements.whenDefined('yt-live-chat-app'), customElements.whenDefined('yt-live-chat-renderer')]).then(async () => {

      const tag = "yt-live-chat-renderer"
      let dummy = document.querySelector(tag);
      if (!dummy) {

        let mo = null;

        const ytLiveChatApp = document.querySelector('yt-live-chat-app') || document.createElement('yt-live-chat-app');

        const lcaProto = getProto(ytLiveChatApp);
        let fz38;

        let qt38=0;
        let bypass = false;


        dummy = await new Promise(resolve => {


          if (typeof lcaProto.createComponent_ === 'function' && !lcaProto.createComponent99_ && (lcaProto.createComponent_.length === 4 || lcaProto.createComponent_.length === 3)) {
            console.log('[yt-chat-lcr] lcaProto.createComponent_ is found');

            lcaProto.createComponent99_ = lcaProto.createComponent_;
            // onCreateComponentError - see https://github.com/cyfung1031/userscript-supports/issues/99
            lcaProto.createComponent98_ = function (a, b, c, onCreateComponentError) {
              const z = customCreateComponent(a, b, c, onCreateComponentError);
              if (z !== undefined) return z;
              // (3) ['yt-live-chat-renderer', {…}, true]
              const r = this.createComponent99_(a, b, c, onCreateComponentError);
              const componentTag = (typeof a === 'string' ? a : (a||0).component) || `${(r||0).nodeName}`.toLowerCase();
              if ( componentTag === 'yt-live-chat-renderer' && !bypass) {
                qt38 = 1;

                __LCRInjection__ =  __LCRInjection__ | 1;

                // r.polymerController.__proto__.handleLiveChatActions471_ = r.polymerController.__proto__.handleLiveChatActions_;
                // r.polymerController.__proto__.handleLiveChatActions_ = function (arr) {


                //   preprocessChatLiveActions(arr);

                //   return this.handleLiveChatActions471_(arr);


                // }

                for (const f of LCRImmedidates) {
                  f(r);
                }
                LCRImmedidates.length = 0;

                resolve(r); // note: this dom is not yet adopted, but promise resolve is later than ops.
                console.log('[yt-chat-lcr] element found by method 1');
              }
              return r;
            };
            lcaProto.createComponent_ = lcaProto.createComponent98_;

            if (!USE_OBTAIN_LCR_BY_BOTH_METHODS) return;

          }

          // console.log('[yt-chat] lcaProto traditional');

          const pz38 = document.getElementsByTagName(tag);
          fz38 = () => {
            const t = pz38[0]
            if (t) {
              qt38 = 2;

              __LCRInjection__ =  __LCRInjection__ | 2;
              resolve(t);
              console.log('[yt-chat-lcr] element found by method 2');
            }
          };
          mo = new MutationObserver(fz38);
          mo.observe(document, { subtree: true, childList: true, attributes: true });
          document.addEventListener('yt-action', fz38, true);
          fz38();

        });

        bypass = true;

        if (mo) {
          mo.disconnect();
          mo.takeRecords();
          mo = null;
        }
        if (fz38) {
          document.removeEventListener('yt-action', fz38, true);
          fz38 = null;
        }
        console.log(`[yt-chat-lcr] lcr appears, dom = ${document.getElementsByTagName(tag).length}, method = ${qt38}`);


        // if (lcaProto.createComponent99_ && lcaProto.createComponent_ && lcaProto.createComponent98_ === lcaProto.createComponent_) {
        //   lcaProto.createComponent_ = lcaProto.createComponent99_;
        //   lcaProto.createComponent99_ = null;
        //   lcaProto.createComponent98_ = null;
        // }

      } else {
        console.log('[yt-chat-lcr] lcr exists');
      }
      return dummy;

    }));
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

      console1.log('number of elzm-font elements', arr.length);

      HTMLElement_.prototype.append.apply(efsContainer, arr);

      (document.body || document.documentElement).appendChild(efsContainer);


      console1.log('elzm-font elements have been added to the page for rendering.');

      groupEnd();

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

  const linkerOnload = function () {
    this.resolveFn({
      link: this,
      success: true
    });
    this.remove();
  };
  const linkerOnError = function () {
    this.resolveFn({
      link: this,
      success: false
    });
    this.remove();
  };
  function linker(link, rel, href, _as) {
    return new Promise(resolve => {
      if (!link) link = document.createElement('link');
      link.rel = rel;
      if (_as) link.setAttribute('as', _as);
      link.resolveFn = resolve;
      link.onload = linkerOnload;
      link.onerror = linkerOnError;
      link.href = href;
      document.head.appendChild(link);
      link = null;
    });
  }

  // ------- side process [sideProcesses] -------
  const reuseFixDataViewModel = (elm) => {
    // detach data-view model signal
    return Promise.resolve(elm).then((elm) => {
      for (const node of elm.getElementsByTagName('*')) {
        const cnt = insp(node);
        if (typeof cnt.dispose === 'function' && cnt.dispose.length === 0) {
          try {
            cnt.dispose();
          } catch (e) { }
        } else if (typeof node.dispose === 'function' && node.dispose.length === 0) {
          try {
            node.dispose();
          } catch (e) { }
        }
      }
    }).catch(console.warn);;
  };
  const reuseFixYtIconRendering = (elm) => {
    // make properties fresh for flushing
    // return Promise.resolve(elm).then((elm) => {
    //   refreshChildrenYtIcons(elm);
    // }).catch(console.warn);;
  };
  const tickerMessageRemovalMo = new MutationObserver(() => {
    const elements = document.querySelectorAll('[ticker-message-removed]:nth-child(n + 40)');
    for (const s of elements) {
      insp(s).requestRemoval();
    }
  });
  tickerMessageRemovalMo.observe(document, { subtree: true, attributes: true, attributeFilter: ['ticker-message-removed'] });
  const onVisibleItemStampNodeRemoval = (elmId) => {
    // set the corresponding ticker [ticker-message-removed]
    return Promise.resolve(elmId).then((elmId) => {
      const tickerElm = document.querySelector(`.style-scope.yt-live-chat-ticker-renderer[id="${elmId}"]`);
      if (tickerElm) {
        tickerElm.setAttribute('ticker-message-removed', '');
      }
    }).catch(console.warn);;
  };
  let onTickerItemStampNodeAddedwaiting = false;
  const onTickerItemStampNodeAdded = () =>{
    // remove the stale ticker(s)
    if (onTickerItemStampNodeAddedwaiting) return;
    onTickerItemStampNodeAddedwaiting = true;
    return Promise.resolve().then(() => {
      onTickerItemStampNodeAddedwaiting = false;
      const selector = "[ticker-message-removed]:nth-child(n + 40)";
      const tickerElm = document.querySelector(selector);
      if (tickerElm) { // likely false
        const tickerElms = document.querySelectorAll(selector);
        for (const tickerElm of tickerElms) insp(tickerElm).requestRemoval();
      }
    }).catch(console.warn);;
  };
  // const mutationDelayedRefreshData = async (cnt) => {
  //   // ensure data is invalidated correctly after mutation
  //   return Promise.resolve(cnt).then(async cnt => {
  //     wme.data = `${(wme.data & 7) + 1}`;
  //     await wmp;
  //     cnt.__refreshData930__ && cnt.data && cnt.isAttached && cnt.parentComponent && cnt.__refreshData930__('data', !0);
  //   });
  // }
  // ------- side process [sideProcesses] -------

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

    // const iAFP = foregroundPromiseFn_noGPU ? foregroundPromiseFn_noGPU : typeof IntersectionObserver === 'undefined' ? getRafPromise : (() => {

    //   const ioWM = new WeakMap();
    //   const ek = Symbol();
    //   /** @type {IntersectionObserverCallback} */
    //   const ioCb = (entries, observer) => {
    //     /** @type {PromiseExternal} */
    //     const pr = observer[ek];
    //     const resolve = pr.resolve;
    //     let target;
    //     if (resolve && (target = ((entries ? entries[0] : 0) || 0).target) instanceof Element) {
    //       pr.resolve = null;
    //       observer.unobserve(target);
    //       resolve();
    //     }
    //   };
    //   /**
    //    *
    //    * @param {Element} elm
    //    * @returns {Promise<void>}
    //    */
    //   const iAFP = (elm) => {
    //     let io = ioWM.get(elm);
    //     if (!io) {
    //       io = new IntersectionObserver(ioCb);
    //       ioWM.set(elm, io); // strong reference
    //     }
    //     let pr = io[ek];
    //     if (!pr) {
    //       pr = io[ek] = new PromiseExternal();
    //       io.observe(elm);
    //     }
    //     return pr;
    //   }

    //   return iAFP;

    // })();

    let playerState = null;
    let _playerState = null;
    let lastPlayerProgress = null;
    let relayCount = 0;
    let playerEventsByIframeRelay = false;
    let isPlayProgressTriggered = false;
    let waitForInitialDataCompletion = 0;



    // let aeConstructor = null;

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
    let lastMouseUp = 0;
    let currentMouseDown = false;
    let lastTouchDown = 0;
    let lastTouchUp = 0;
    let currentTouchDown = false;
    let lastUserInteraction = 0;

    let scrollChatFn = null;

    // let skipDontRender = true; // true first; false by flushActiveItems_
    // let allowDontRender = null;

    // ---- #items mutation ----
    // let firstList = true;

    // << end >>


    const stackMarcoTask = (f) => {
      return new Promise(resolve => {
        nextBrowserTick_(async () => {
          try {
            await f();
          } catch (e) {
            console.warn(e);
          } finally {
            resolve();
          }
        });
      })
    };


    const elementFirstElementChild = Object.getOwnPropertyDescriptor(Element.prototype, 'firstElementChild');
    const sFirstElementChild = Symbol();
    Object.defineProperty(Element.prototype, sFirstElementChild, elementFirstElementChild);

    const elementLastElementChild = Object.getOwnPropertyDescriptor(Element.prototype, 'lastElementChild');
    const sLastElementChild = Symbol();
    Object.defineProperty(Element.prototype, sLastElementChild, elementLastElementChild);

    const elementPrevElementSibling = Object.getOwnPropertyDescriptor(Element.prototype, 'previousElementSibling');
    const sPrevElementSibling = Symbol();
    Object.defineProperty(Element.prototype, sPrevElementSibling, elementPrevElementSibling);

    const elementNextElementSibling = Object.getOwnPropertyDescriptor(Element.prototype, 'nextElementSibling');
    const sNextElementSibling = Symbol();
    Object.defineProperty(Element.prototype, sNextElementSibling, elementNextElementSibling);

    const firstComponentChildFn = (elNode) => {
      elNode = elNode[sFirstElementChild];
      while ((elNode instanceof Element) && !elNode.is) elNode = elNode[sNextElementSibling];
      return elNode;
    }
    const lastComponentChildFn = (elNode) => {
      elNode = elNode[sLastElementChild];
      while ((elNode instanceof Element) && !elNode.is) elNode = elNode[sPrevElementSibling];
      return elNode;
    }
    const nextComponentSiblingFn = (elNode) => {
      do {
        elNode = elNode[sNextElementSibling];
      } while ((elNode instanceof Element) && !elNode.is);
      return elNode;
    }

    const nativeNow = performance.constructor.prototype.now.bind(performance);

    const queueMicrotask_ = typeof queueMicrotask === 'function' ? queueMicrotask : (f) => (Promise.resolve().then(f), void 0);
    

    const executeTaskBatch = function (taskArr, firstMarco = true) {
      if (!(taskArr || 0).length) throw new TypeError(`Illegal invocation`);
      return new Promise(resolveFinal => {
        let resolveFn = null;
        const len = taskArr.length;
        const results = new Array(len);
        const makePromise = () => new Promise(resolve => { resolveFn = resolve });
        let firedCount = 0;
        const executor = () => {
          if (taskArr.length !== len) throw new TypeError(`Illegal invocation`);
          const resolveFn_ = resolveFn;
          let t0 = 0;
          let next = 0;
          taskArr.forEach((task, idx) => {
            if (typeof (task || 0) !== 'object') throw new TypeError(`Illegal invocation`);
            if (!task.fired) {
              queueMicrotask_(() => {
                if (next || task.fired) return;
                task.fired = true;
                if (++firedCount === len) next |= 2;
                if (!t0) t0 = nativeNow() + 10;
                const { fn } = task;
                results[idx] = fn(task); // sync task only
                if (nativeNow() > t0) next |= 1;
              });
            }
          });
          queueMicrotask_(() => resolveFn_(next))
        }
        const looper = (next) => {
          if (!next) throw new TypeError(`Illegal invocation`);
          if (next & 2) {
            if (next & 1) {
              nextBrowserTick_(() => resolveFinal(results))
            } else {
              resolveFinal(results);
            }
          } else {
            const p = makePromise();
            nextBrowserTick_(executor);
            p.then(looper);
          }
        }
        const p = makePromise();
        firstMarco ? nextBrowserTick_(executor) : executor();
        p.then(looper);

      })

    }
    // window.executeTaskBatch = executeTaskBatch;


    const renderMap = new WeakMap();


    // reserved for future use
    const countKeys = (H) => {

      const countKeys_ = (H, u, q, l) => {
        if (u.has(H)) return;
        u.add(H);
        const pds = Object.getOwnPropertyDescriptors(H);
        for (const name in pds) {
          const pd_ = pds[name];
          const o = pd_.value;
          if (o && pd_.configurable && pd_.writable && !(o instanceof EventTarget)) {
            if (typeof o === 'object') {
              q.push([l, name.length]); 
              countKeys_(o, u, q, l+1);
            }
          }
        }
      };
      const m = [];
      countKeys_(H, new WeakSet(), m, 0);
      
      return `-${tupleHash(m, false).toString(36)}${tupleHash(m, true).toString(36)}`; // 12 chars
    }

    // reserved for future use
    function tupleHash(pairs, reversed) {
      let hash = 17; // Prime seed
      const prime1 = 31;
      for (let i = 0; i < pairs.length; i++) {
        const [a_, b_] = pairs[i];
        const a = reversed ? b_ : a_;
        const b = reversed ? a_ : b_;
        // Combine a and b into pairHash
        let pairHash = ((a * prime1) ^ b) >>> 0;
        // Mix pairHash into hash with bitwise operations
        hash ^= pairHash;
        hash = ((hash << 5) | (hash >>> 27)) >>> 0; // Rotate left 5 bits
        hash = (hash * 37 + 11) >>> 0; // Small prime multiplier and offset
      }
      // Finalize to ensure fixed range (optional: constrain to 30 bits)
      return 0x2FFFFFFF + (hash & 0x3FFFFFFF); // Mask to 30 bits (max: 1073741823)
    }


    const rendererStamperFactory = (cProto, options) => {

      let pDivResourceEventCount = 0; 

      const pDivOnResource = function (evt) {
        const target = evt.target;
        if (target && target.nodeType === 1 && target.nodeName === "IMG") {
          pDivResourceEventCount = (pDivResourceEventCount & 1073741823) + 1;
        }
      };

      const { key, stamperDomClass, preloadFn } = options;

      // const newDoc = document.implementation.createHTMLDocument("NewDoc");
      const pSpace = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      document.documentElement.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
      mockCommentElement(document.documentElement.lastChild);
      document.documentElement.lastChild.replaceWith(pSpace);
      const pNode = document.createElement('ns-538');
      pSpace.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
      mockCommentElement(pSpace.lastChild);
      pSpace.lastChild.replaceWith(pNode);

      const pDiv = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      if (typeof pNode.attachShadow === 'function') {
        const pShadow = pNode.attachShadow({ mode: "open" });
        pShadow.replaceChildren(pDiv);
      } else {
        pNode.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
        mockCommentElement(pNode.lastChild);
        pNode.lastChild.replaceWith(pDiv);
      }

      const pDivNew = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

      pDiv.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
      mockCommentElement(pDiv.lastChild);
      pDiv.lastChild.replaceWith(pDivNew);

      pDivNew.addEventListener('load', pDivOnResource, true);
      pDivNew.addEventListener('error', pDivOnResource, true);

      const wmRemoved = new Map();
      wmRemoved.set = wmRemoved.setOriginal || wmRemoved.set;

      // const wmMapToItem = new WeakMap();
      // let wmPendingList = null;

      const nullComponents = new Map();
      nullComponents.set = nullComponents.setOriginal || nullComponents.set;

      const componentDefaultAttributes = new WeakMap();

      const fnKeyH = `${key}$$c472`;
      let spliceTempDisabled = false;

      cProto.__ensureContainerDomApi7577 = function (cId) {
        const container = this.getStampContainer_(cId);
        if (container && !container.__checkedDomApi33__) {
          container.__checkedDomApi33__ = true;
          if (!container.__domApi) {
            if (typeof this.stampDomArray366_ === 'function' && this.stampDomArray366_.length === 6) {
              let c = container;
              try {
                this.stampDomArray366_.call({
                  getStampContainer_(d) {
                    return c
                  },
                  get is() {
                    throw new Error('');
                  },
                  get hostElement() {
                    throw new Error('');
                  }
                }, 0, cId, false, false, false, false);
              } catch (e) { }
              c = null;
            }
          }
        }
      }

      cProto[fnKeyH] = async function (cTag, cId, pr00) {

        // console.log(38806)
        if (!this) return;
        const fxCounter_ = this.fxCounter5355 = (this.fxCounter5355 & 1073741823) + 1;

        // await the current executing task (if any)
        // and avoid stacking in the same marco task
        await Promise.all([pr00, nextBrowserTick_()]);
        if (fxCounter_ !== this.fxCounter5355) return;

        const addedCount0 = this.ec389a;
        const removedCount0 = this.ec389r;

        this.ec389 = false;
        this.ec389a = 0;
        this.ec389r = 0;

        if (!addedCount0 && !removedCount0) return;
        const stampDom_ = (this.stampDom || 0)[cTag] || 0;
        const stampDomMap_ = stampDom_.mapping;
        const stampDomEvent_ = stampDom_.events;
        if (!stampDomMap_) return;
        if (!this.__ensureContainerDomApi7577) return;
        const hostElement = this.hostElement;
        if (!hostElement) return;

        spliceTempDisabled = true;

        this.__ensureContainerDomApi7577(cId);

        const isTickerRendering = cTag === 'tickerItems';
        const isMessageListRendering = cTag === 'visibleItems';

        // coming process can be stacked as ec389a and ec389r are reset.

        const deObjectComponent = (itemEntry) => {
          const I = firstObjectKey(itemEntry);
          const L = stampDomMap_[I];
          const H = itemEntry[I];
          return [L, H];
        };

        let renderNodeCount = 0;

        let renderOrdering = {};
        let doFix = false;
        let dataEntries_ = this[cTag];
        const renderEntries = dataEntries_.map((item) => {
          const [L, H] = deObjectComponent(item);
          const componentName = this.getComponentName_(L, H);
          if (H && H.id && componentName) {
            const wId = `${componentName}#${H.id}`;
            if (!H.__renderOrderId422__) {
              H.__renderOrderId422__ = this.__renderOrderId411__ = (this.__renderOrderId411__ & 1073741823) + 1;
            }
            let p = renderOrdering[wId];
            if (p) doFix = true;
            if (!p || p > H.__renderOrderId422__) {
              renderOrdering[wId] = H.__renderOrderId422__;
            }
            return [item, L, H, componentName, wId];
          } else {
            return [item, L, H, componentName, true];
          }
        });
        if (doFix) {
          for (let i = renderEntries.length - 1; i >= 0; i--) {
            const e = renderEntries[i];
            let m = e[4];
            if (m === true) {
            } else if (renderOrdering[m] === e[2].__renderOrderId422__) {
            } else {
              dataEntries_.splice(i, 1);
              renderEntries.splice(i, 1);
            }
          }
        }
        dataEntries_ = null;
        renderOrdering = null;

        const renderList = renderEntries.map((e) => {
          const [item, L, H, componentName] = e;
          const node = kRef(renderMap.get(H));
          if (node && hostElement.contains(node)) {
            renderNodeCount++;
            return node;
          } else if (node && !hostElement.contains(node)) {
            renderMap.delete(H);
            return item;
          } else {
            return item;
          }
        });

        const isRenderListEmpty = renderList.length === 0;

        // console.log(1773, this.ec389a, this.ec389r)

        this.ec389a = 0;
        this.ec389r = 0;


        // this.ec389 = null;
        // this.ec389a = 0;
        // this.ec389r = 0;

        let addedCounter = 0;
        let removedCounter = 0;

        const createConnectedComponentElm = (insertionObj, L, H, componentName) => {
          // const reusable = false;
          // const componentName = this.getComponentName_(L, H);
          let component;
          if (!nullComponents.has(componentName)) {
            nullComponents.set(componentName, (component = document.createElement(componentName)));
            component.className = stamperDomClass;
            // shadowElm.insertAdjacentElement('beforeend', component);
          } else {
            component = nullComponents.get(componentName);
          }
          component = component.cloneNode(false);

          // const cnt = insp(component);

          // cnt.__dataOld = cnt.__dataPending = null;
          pDivNew.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
          mockCommentElement(pDivNew.lastChild);
          pDivNew.lastChild.replaceWith(component);
          // cnt.__dataOld = cnt.__dataPending = null;

          return component;
        }

        const listDom = this.getStampContainer_(cId);

        const pnForNewItem = (item) => {

          const [L, H] = deObjectComponent(item);

          const componentName = this.getComponentName_(L, H);

          const wmList = wmRemoved.get(componentName.toLowerCase());

          let connectedComponent = null;
          if (wmList && (connectedComponent = wmList.firstElementChild)) {
            if (this.telemetry_) this.telemetry_.reuse++;
            // if (!wmPendingList) {
            //   wmPendingList = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            //   wmPendingList.setAttributeNS('http://www.w3.org/2000/svg', 'wm-pending', 'true');
            //   pDiv.insertAdjacentElement('afterend', wmPendingList);
            // }
            // wmPendingList.insertAdjacentElement('beforeend', connectedComponent);
            pDivNew.insertAdjacentHTML('beforeend', ttpHTML('<!---->'));
            mockCommentElement(pDivNew.lastChild);
            pDivNew.lastChild.replaceWith(connectedComponent);
            const attrMap = connectedComponent.attributes;
            const defaultAttrs = componentDefaultAttributes.get(connectedComponent);
            if (defaultAttrs) {
              for (const attr of [...attrMap]) {
                const name = attr.name;
                if (name in defaultAttrs) attr.value = defaultAttrs[name];
                else attrMap.removeNamedItem(name);
              }
              if (attrMap.length !== defaultAttrs['"']) {
                for (const name in defaultAttrs) {
                  if (!attrMap[name] && name !== '"') connectedComponent.setAttribute(name, defaultAttrs[name]);
                }
              }
            }

          } else {
            connectedComponent = createConnectedComponentElm(item, L, H, componentName);
            if (this.telemetry_) this.telemetry_.create++;
          }
          if (isTickerRendering) {
            const container = connectedComponent.firstElementChild;
            if (container) container.classList.add('yt-live-chat-ticker-stampdom-container');
          }

          return [item, L, H, connectedComponent];

        };

        let imgPreloadPr = null;
        if (isMessageListRendering) {
          const addedItems = renderList.filter(item => item === 'object' && (item instanceof Node));
          imgPreloadPr = preloadFn(addedItems)();
        }

        spliceTempDisabled = false;

        // const pt1 = performance.now();
        // const newComponentsEntries = await Promise.all(renderList.map((item) => {
        //   return typeof item === 'object' && !(item instanceof Node) ? Promise.resolve(item).then(pnForNewItem) : item;
        // }));
        const newComponentsEntries = isRenderListEmpty ? [] : await executeTaskBatch(renderList.map(item => ({
          item,
          fn(task) {
            const { item } = task;
            return typeof item === 'object' && !(item instanceof Node) ? pnForNewItem(item) : item;
          }
        })));
        // const pt2 = performance.now();

        const imgPromises = [];

        const imgPaths = new Set();

        const pnForRenderNewItem = (entry) => {
          const [item, L, H, connectedComponent] = entry;

          // const cnt = insp(connectedComponent);
          // setupRefreshData930(cnt);
          // if (typeof cnt.data === 'object' && cnt.__dataEnabled === true && cnt.__dataReady === true && cnt.__dataInvalid === false) {
          //   cnt.data = H;
          // } else {
            const q = this.deferRenderStamperBinding_
            let q2;
            if (typeof q === 'object') q2 = this.deferRenderStamperBinding_ = [];
            this.deferRenderStamperBinding_(connectedComponent, L, Object.assign({}, H)); // pre-flush
            this.flushRenderStamperComponentBindings_();
            if (typeof q === 'object') {
              this.deferRenderStamperBinding_ = q;
              q2.length = 0;
            }
          // }
          // if (cnt.__refreshData930__ && cnt.data) cnt.__refreshData930__('data', !0); // ensure data is invalidated

          // fix yt-icon issue
          // refreshChildrenYtIcons(connectedComponent);

          // const imgs = connectedComponent.getElementsByTagName('IMG');
          // if (imgs.length > 0) {
          //   for (let i = 0, l = imgs.length; i < l; i++) {
          //     const src = imgs[i].src;
          //     if (src.includes('://') && !imgPaths.has(src)) {
          //       imgPaths.add(src);
          //       imgPromises.push(imageFetch(src));
          //     }
          //   }
          // }
          componentDefaultAttributes.set(connectedComponent, getAttributes(connectedComponent));
          return entry;
        }

        // const pt3 = performance.now();
        // const newRenderedComponents = await Promise.all(newComponentsEntries.map((entry) => {
        //   return typeof entry === 'object' && !(entry instanceof Node) ? Promise.resolve(entry).then(pnForRenderNewItem) : entry;
        // }));
        const newRenderedComponents = isRenderListEmpty ? [] : await executeTaskBatch(newComponentsEntries.map(entry => ({
          entry,
          fn(task) {
            const { entry } = task;
            return typeof entry === 'object' && !(entry instanceof Node) ? pnForRenderNewItem(entry) : entry;
          }
        })));
        // const pt4 = performance.now();

        // console.log('xxss' , pt2-pt1, pt4-pt3)

        this.flushRenderStamperComponentBindings_(); // ensure all deferred flush render tasks clear.

        // imgPromises.push(imageFetch('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'));
        if (imgPromises.length > 0) {
          const pr1 = Promise.all(imgPromises).catch(e => { });
          const pr2 = autoTimerFn();
          await Promise.race([pr1, pr2]).catch(e => { });
          imgPaths.clear();
          imgPromises.length = 0;
        }
        if (imgPreloadPr) await imgPreloadPr;

        // const batching = [];
        // let j = 0;
        // let elNode;

        const sideProcesses = [];

        const removeStampNode_ = (elNode) => {

          elNode.dispatchEvent(new CustomEvent("youtube-chat-element-before-remove"));

          const elm = elNode;
          const cnt = insp(elm);
          let elemCount1 = elm.querySelectorAll('yt-img-shadow').length;

          const elParent = elm.parentNode;
          if (elm.__requestRemovalAt003__) {
            elm.__requestRemovalAt003__ = 0;
          } else {
            if (cnt.requestRemoval) cnt.requestRemoval();
          }
          try {
            (elParent.__domApi || elParent).removeChild(elm);
          } catch (e) { }
          const frag = document.createDocumentFragment();
          frag.appendChild(elm);

          const componentName = elm.nodeName.toLowerCase();
          let wmList = wmRemoved.get(componentName);
          if (!wmList) {
            wmList = document.createDocumentFragment();
            wmRemoved.set(componentName, wmList);
          }
          const data = cnt.data;
          if (data) renderMap.delete(cnt.data);

          let elemCount2 = elm.querySelectorAll('yt-img-shadow').length;

          const [p1, p2] = [reuseFixDataViewModel(elm), reuseFixYtIconRendering(elm)];

          sideProcesses.push(p1);
          sideProcesses.push(p2);

          if (!window.__fixTemplateReuse1058__ && elemCount1 !== elemCount2) return; // cannot reuse

          Promise.all([elm, wmList, p1, p2]).then((r) => {
            const [elm, wmList] = r;
            wmList.appendChild(elm);
          });
        }

        // const removeStampNode = async () => {

        //   removedCounter++;

        //   const nextElm = nextComponentSiblingFn(elNode);
        //   const elmId = elNode.id;
        //   removeStampNode_(elNode);
        //   // const dzid = this.getAttribute('dz-component-id');
        //   // ---- no-cache ----
        //   // try{
        //   //   elm.remove();
        //   // }catch(e){}
        //   // ---- no-cache ----

        //   if (cTag === 'visibleItems') {
        //     sideProcesses.push(onVisibleItemStampNodeRemoval(elmId));
        //   }

        //   j++;
        //   elNode = nextElm;

        // }

        // if (typeof Polymer !== "undefined" && typeof Polymer.flush === "function") {
        //   // clear all pending rendering first
        //   await stackMarcoTask(async () => {
        //     Polymer.flush();
        //   });
        // }

        // main UI thread - DOM modification
        await new Promise((resolveDM) => {
          nextBrowserTick_(() => {

            const isAtBottom = this.atBottom === true;
            // if (ENABLE_OVERFLOW_ANCHOR && isAtBottom) {
            //   shouldScrollAfterFlush = true;
            // }


            const tasks = [];
            const stampProcessId761 = stampProcessId761_ = `${Date.now()}.${Math.random()}`;
            let fragAppend = document.createDocumentFragment();
            let shouldManualScroll = null;
            let scrollTop1 = null, scrollTop2 = null;

            const dataProcessTickerRendering = (data) => {
              if (data.__tickerRemovingId761__) data.__tickerRemovingId761__ = undefined;
              data.__stampp761__ = stampProcessId761;
            };

            const taskFn = {
              remove: (task) => {

                const { elNode } = task;

                removedCounter++;

                const elmId = elNode.id;
                removeStampNode_(elNode);
                // const dzid = this.getAttribute('dz-component-id');
                // ---- no-cache ----
                // try{
                //   elm.remove();
                // }catch(e){}
                // ---- no-cache ----

                if (isMessageListRendering) {
                  sideProcesses.push(onVisibleItemStampNodeRemoval(elmId));
                }

                return 2

              },
              append: (task) => {

                if (!fragAppend) return;

                const { newNode, nodeAfter, parentNode, L, H } = task;

                fragAppend.appendChild(newNode);

                const itemScrollerX = (isMessageListRendering && isAtBottom) ? this.itemScroller : null;

                if (itemScrollerX) {
                  if (scrollTop1 === null) scrollTop1 = itemScrollerX.scrollTop;
                }

                if (nodeAfter) {
                  (parentNode.__domApi || parentNode).insertBefore(fragAppend, nodeAfter);
                } else {
                  (parentNode.__domApi || parentNode).appendChild(fragAppend);
                }

                if (isTickerRendering && typeof (H || 0).id === "string") dataProcessTickerRendering(H);
                this.deferRenderStamperBinding_(newNode, L, H);
                this.flushRenderStamperComponentBindings_();

                // nodeAfter ? nodeAfter.insertAdjacentElement('beforebegin', newNode) : parentNode.insertAdjacentElement('beforeend', newNode);
                const connectedComponent = newNode;
                const cnt = insp(connectedComponent);
                const cntData = cnt.data;
                if (isTickerRendering && typeof (cntData || 0).id === "string") dataProcessTickerRendering(cntData);
                renderMap.set(cntData, mWeakRef(connectedComponent));
                // mutationDelayedRefreshData(cnt); // not included to sideProcesses
                addedCounter++;

                if (isTickerRendering) {
                  sideProcesses.push(onTickerItemStampNodeAdded());
                }

                if (itemScrollerX) {
                  if (scrollTop2 === null) scrollTop2 = itemScrollerX.scrollTop;
                  if (shouldManualScroll === null) shouldManualScroll = (scrollTop1 >= 0 && scrollTop2 >= 0 && Math.abs(scrollTop2 - scrollTop1) < 6);
                  if (shouldManualScroll) {
                    itemScrollerX.scrollTop = scrollTop2 + 16777216;
                  }
                }

                newNode.dispatchEvent(new CustomEvent("youtube-chat-element-after-append"));

                return 1
              }
            }

            {
              
              const indexMap = new WeakMap();
              // let index = 0;

              if (!isRenderListEmpty) {
                for (let elNode_ = firstComponentChildFn(listDom), index = 0; elNode_ instanceof Node; elNode_ = nextComponentSiblingFn(elNode_)) {
                  indexMap.set(elNode_, index++);
                }
              }



              const keepIndices = new Array(renderNodeCount);
              let keepIndicesLen = 0, lastKeepIndex = -1, requireSort = false;
              for (let i = 0, l = newRenderedComponents.length; i < l; i++) {
                const entry = newRenderedComponents[i];
                if (entry instanceof Node) {
                  const index = indexMap.get(entry);
                  keepIndices[keepIndicesLen++] = [index, entry];
                  if (index > lastKeepIndex) lastKeepIndex = index;
                  else requireSort = true;
                }
              }
              keepIndices.length = keepIndicesLen;
              if (requireSort) keepIndices.sort((a, b) => a[0] - b[0]);
              let dk = 0;

              let j = 0;
              let elNode;

              elNode = firstComponentChildFn(listDom);

              if (!isRenderListEmpty) {
                for (const rcEntry of newRenderedComponents) {
                  const index = indexMap.get(rcEntry);
                  if (typeof index === 'number') {
                    const indexEntry = keepIndices[dk++];
                    const [dIdx, dNode] = indexEntry;
                    indexMap.delete(rcEntry);
                    const idx = dIdx;
                    while (j < idx && elNode) {
                      tasks.push({
                        type: 'remove',
                        elNode,
                        fn: taskFn.remove
                      });
                      elNode = nextComponentSiblingFn(elNode);
                      j++;
                    }
                    if (j === idx) {
                      if (elNode) {
                        // if (dNode !== elNode) tasks.push({
                        //   type: 'swap',
                        //   earlyNode: indexEntry[1],
                        //   laterNode: elNode
                        // });
                        elNode = nextComponentSiblingFn(elNode);
                        j++;
                      } else {
                        console.warn('elNode is not available?', renderList, addedCount0, removedCount0, j, idx);
                      }
                    }
                  } else if (rcEntry instanceof Node) {
                    // interruped by the external like clearList

                    tasks.push({
                      type: 'remove',
                      elNode: rcEntry,
                      fn: taskFn.remove
                    });

                  } else if ((rcEntry || 0).length >= 4) { // bug ?
                    const [item, L, H, connectedComponent] = rcEntry;

                    tasks.push({
                      type: 'append',
                      newNode: connectedComponent,
                      nodeAfter: elNode,
                      parentNode: listDom,
                      item, L, H,
                      fn: taskFn.append
                    });

                  }

                }
              }

              while (elNode) {

                tasks.push({
                  type: 'remove',
                  elNode,
                  fn: taskFn.remove
                });
                elNode = nextComponentSiblingFn(elNode);

              }

            }

            const finalizerFn = () => {
              fragAppend = null;
              stampProcessId761_ = "";
              resolveDM();
            };
            if (tasks.length >= 1) {
              executeTaskBatch(tasks).then(finalizerFn).catch(console.warn);
            } else {
              finalizerFn();
            }

          });
        }).catch(console.warn);

        {
          const arr = this[cTag];
          let b = 0;
          b = b | this._setPendingPropertyOrPath(`${cTag}.splices`, {}, true, true);
          b = b | this._setPendingPropertyOrPath(`${cTag}.length`, arr.length, true, true);
          b && this._invalidateProperties();
        }

        // this.flushRenderStamperComponentBindings_(); // just in case...

        await Promise.all(sideProcesses);

        const detail = {
          container: listDom
        };
        stampDomEvent_ && this.hostElement.dispatchEvent(new CustomEvent("yt-rendererstamper-finished", {
          bubbles: !0,
          cancelable: !1,
          composed: !0,
          detail
        }));
        detail.container = null;

        // if (typeof Polymer !== "undefined" && typeof Polymer.flush === "function") {
        //   // clear all remaining rendering before promise resolve
        //   await stackMarcoTask(async () => {
        //     Polymer.flush();
        //   });
        // }

      }

      // proceedStampDomArraySplices371_ // proceedStampDomArraySplices381_
      cProto[key] = function (cTag, cId, indexSplice) {
        if (spliceTempDisabled) return true;
        // console.log('proceedStampDomArraySplices_')
        // assume no error -> no try catch (performance consideration)
        const { index, addedCount, removed } = indexSplice;
        const removedCount = removed ? removed.length : indexSplice.removedCount;
        indexSplice = null;
        if (!addedCount && !removedCount) {
          console.warn('proceedStampDomArraySplices_', 'Error 001');
          return false;
        }
        if (this.ec389) {
          this.ec389a += addedCount;
          this.ec389r += removedCount;
        } else {
          if (this.ec389a || this.ec389r) {
            console.warn('proceedStampDomArraySplices_', 'Error 002');
            return false;
          }
          if (typeof (cTag || 0) !== 'string' || typeof (cId || 0) !== 'string') {
            console.warn('proceedStampDomArraySplices_', 'Error 003');
            return false;
          }
          this.ec389 = true;
          this.ec389a = addedCount;
          this.ec389r = removedCount;
          const pr00 = this.ec389pr;
          const pr11 = this.ec389pr = this[fnKeyH](cTag, cId, pr00).catch(console.warn);
          if (cTag === 'visibleItems') {
            this.prDelay288 = pr11;
          }
        }
        return true;
      };


    }


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
        const cid = this.startAt + (this.counter = (this.counter & 1073741823) + 1);
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
          
          if (ENABLE_BASE_PREFETCHING) console1.log('dns-prefetch', (kptPF & 1) ? 'OK' : 'NG');
          if (ENABLE_BASE_PREFETCHING) console1.log('preconnect', (kptPF & 2) ? 'OK' : 'NG');
          if (ENABLE_PRELOAD_THUMBNAIL) console1.log('prefetch', (kptPF & 4) ? 'OK' : 'NG');
          if (ENABLE_PRELOAD_THUMBNAIL) console1.log('preload', (kptPF & 16) ? 'OK' : 'NG');
          groupEnd();

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
        const r = base.map(baseEntry => contentSet.has(baseEntry));
        contentSet.clear();
        return r

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
              r95dm = (r95dm & 1073741823) + 1;
              participants00.push = function () {
                r95dm = (r95dm & 1073741823) + 1;
                return Array.prototype.push.apply(this, arguments);
              }
              participants00.pop = function () {
                r95dm = (r95dm & 1073741823) + 1;
                return Array.prototype.pop.apply(this, arguments);
              }
              participants00.shift = function () {
                r95dm = (r95dm & 1073741823) + 1;
                return Array.prototype.shift.apply(this, arguments);
              }
              participants00.unshift = function () {
                r95dm = (r95dm & 1073741823) + 1;
                return Array.prototype.unshift.apply(this, arguments);
              }
              participants00.splice = function () {
                r95dm = (r95dm & 1073741823) + 1;
                return Array.prototype.splice.apply(this, arguments);
              }
              participants00.sort = function () {
                r95dm = (r95dm & 1073741823) + 1;
                return Array.prototype.sort.apply(this, arguments);
              }
              participants00.reverse = function () {
                r95dm = (r95dm & 1073741823) + 1;
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
              await nextBrowserTick_();

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


          resPromise.then(async (resValue) => {
            const condition = resValue === 0 ? 1 : (resValue & 4) === 4 ? 2 : 0;
            const isLogRequired = SHOW_PARTICIPANT_CHANGES_IN_CONSOLE && condition > 0;
            isLogRequired && groupCollapsed("Participant List Change", `tid = ${tid}; res = ${resValue}`);
            if (condition === 1) {
              isLogRequired && console1.log("Full Refresh begins");
              await new Promise(resolve => {
                cnt.resolveForDOMRendering781 = resolve;
                cnt.__notifyPath5036__("participantsManager.participants"); // full refresh
              });
              isLogRequired && console1.log("Full Refresh ends");
            } else if (condition === 2) {
              isLogRequired && console1.log(`Number of participants (before): ${beforeParticipants.length}`);
              isLogRequired && console1.log(`Number of participants (after): ${participants.length}`);
              isLogRequired && console1.log(`Total number of rendered participants: ${cnt.__getAllParticipantsDOMRenderedLength__()}`);
              isLogRequired && console1.log(`Participant Renderer Content Updated: ${(resValue & 8) === 8}`);
              // requestAnimationFrame is required to avoid particiant update during DOM changing (stampDomArraySplices_)
              // mutex lock with requestAnimationFrame can also disable participants update in background
            }
            isLogRequired && groupEnd();
            (condition === 2) && (await new Promise(requestAnimationFrame));
            lockResolve();
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
        console1.log(`EXPERIMENT_FLAGS: ${JSON.stringify(fgs, null, 2)}`);

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

        console1.log(`Data Manipulation Boost = ${canDoReplacement}`);

        assertor(() => fnIntegrity(cProto.attached, '0.32.22')) // just warning
        if (typeof cProto.flushRenderStamperComponentBindings_ === 'function') {
          const fiRSCB = fnIntegrity(cProto.flushRenderStamperComponentBindings_);
          console1.log(`flushRenderStamperComponentBindings_ ### ${fiRSCB} ###`);
        } else {
          console1.log("flushRenderStamperComponentBindings_ - not found");
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
          return HTMLElement_.prototype.querySelectorAll.call(container, 'yt-live-chat-participant-renderer').length;
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
          cnt.__notifyPath5036__ = cnt.notifyPath
          const participants = ((cnt.participantsManager || 0).participants || 0);
          assertor(() => (participants.length > -1 && typeof participants.slice === 'function'));
          console1.log(`initial number of participants: ${participants.length}`);
          const newParticipants = (participants.length >= 1 && typeof participants.slice === 'function') ? participants.slice(0) : [];
          beforeParticipantsMap.set(cnt, newParticipants);
          cnt.notifyPath = notifyPath7081;
          console1.log(`CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT = ${CHECK_CHANGE_TO_PARTICIPANT_RENDERER_CONTENT}`);
          groupEnd();
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
          console1.log(`ENABLE_FLAGS_MAINTAIN_STABLE_LIST_FOR_PARTICIPANTS_LIST - OK`);
        } else {
          console1.log(`ENABLE_FLAGS_MAINTAIN_STABLE_LIST_FOR_PARTICIPANTS_LIST - NG`);
        }

        groupEnd();

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

    const transitionEndHooks = new WeakSet();
    const transitionEndAfterFnSimple = new WeakMap();
    let transitionEndAfterFnSimpleEnable = 0;
    // let prevTransitionClosing = null;

    const passiveCapture = typeof IntersectionObserver === 'function' ? { capture: true, passive: true } : true;


    const transitionEndAfterFn = (evt) => {
      if (transitionEndAfterFnSimpleEnable > 0 && evt.propertyName && !evt.pseudoElement) {
        const elm = evt.target;
        const f = transitionEndAfterFnSimple.get(elm);
        if (f) {
          transitionEndAfterFnSimple.delete(elm);
          f.resolve(evt.propertyName);
        }
      }
    };

    const fixChildrenIssue = !!fixChildrenIssue801;
    if (fixChildrenIssue && typeof Object.getOwnPropertyDescriptor === 'function' && typeof Proxy !== 'undefined') {
      let fixChildrenIssue_status = false;
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
        const dp2 = Object.getOwnPropertyDescriptor(HTMLElement_.prototype, 'children');
        const dp3 = Object.getOwnPropertyDescriptor(divProto, 'children');

        if (dp && dp.configurable === true && dp.enumerable === true && typeof dp.get === 'function' && !dp2 && !dp3) {

          if (divProto instanceof HTMLElement_ && divProto instanceof Element) {

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

            fixChildrenIssue_status = true;
            

          }
        }

      }

      if (!fixChildrenIssue_status) {
        console.log('fixChildrenIssue - set NG')
      }


    }


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
          for (const elm of document.querySelectorAll('[wsr93]')) {
            if (elm.getAttribute('wsr93') === 'visible') lastVisibleItemWR = mWeakRef(elm);
            elm.setAttribute('wsr93', '');
            // custom CSS property --wsr94 not working when attribute wsr93 removed
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

        }).catch(console.warn);

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
      // let lastVisible = null;

      const visObserverFn = (entry) => {

        const target = entry.target;
        if (!target || !target.hasAttribute('wsr93')) return;
        // if(target.classList.contains('dont-render')) return;
        let isVisible = entry.isIntersecting === true && entry.intersectionRatio > 0.5;
        // const h = entry.boundingClientRect.height;
        /*
        if (h < 16) { // wrong: 8 (padding/margin); standard: 32; test: 16 or 20
            // e.g. under fullscreen. the element created but not rendered.
            target.setAttribute('wsr93', '');
            return;
        }
        */
        if (isVisible) {
          // target.style.setProperty('--wsr94', h + 'px');
          target.setAttribute('wsr93', 'visible');
          // lastVisible = mWeakRef(target);
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
            // foregroundPromiseFn().then(() => {
            //   // foreground page
            //   // page visibly ready -> load the latest comments at initial loading
            //   const lcRenderer = lcRendererElm();
            //   if (lcRenderer) {
            //     nextBrowserTick_(() => {
            //       const cnt = insp(lcRenderer);
            //       if (cnt.isAttached === false || (cnt.hostElement || cnt).isConnected === false) return;
            //       cnt.scrollToBottom_();
            //     });
            //   }
            // });
          }
        }
        else if (target.getAttribute('wsr93') === 'visible') { // ignore target.getAttribute('wsr93') === '' to avoid wrong sizing

          // target.style.setProperty('--wsr94', h + 'px');
          target.setAttribute('wsr93', 'hidden');
        } // note: might consider 0 < entry.intersectionRatio < 0.5 and target.getAttribute('wsr93') === '' <new last item>

      }



      const visObserver = new IntersectionObserver((entries) => {

        for (const entry of entries) {

          Promise.resolve(entry).then(visObserverFn);

        }

      }, {
        rootMargin: "0px",
        threshold: [0.05, 0.95],
      });


      return { lcRendererElm, visObserver }


    })();

    // let itemsResizeObserverAttached = false;
    // const resizeObserverFallback = new IntersectionObserver((mutation, observer) => {
    //   const itemScroller = mutation[0].target;
    //   observer.unobserve(itemScroller);
    //   if (itemScroller.scrollTop === 0) itemScroller.scrollTop = window.screen.height; // scrollTop changing
    // });

    const itemScrollerResizeObserver = typeof ResizeObserver === 'function' && ENABLE_OVERFLOW_ANCHOR ? new ResizeObserver((mutations) => {
      const mutation = mutations[mutations.length - 1];
      // console.log('resizeObserver', mutation)
      const itemScroller = (mutation || 0).target;
      if (!itemScroller) return;
      const listDom = itemScroller.closest('yt-live-chat-item-list-renderer');
      if (!listDom) return;
      const listCnt = insp(listDom);
      if(listCnt.visibleItems.length === 0) return;
      if (listCnt.atBottom !== true) return;
      // if (itemScroller.scrollTop === 0) {
      itemScroller.scrollTop = 16777216; // scrollTop changing
      // }
    }) : null;

    const { setupMutObserver } = (() => {


      const mutFn = (items) => {
        let seqIndex = -1;
        const elementSet = new Set();
        elementSet.add = elementSet.addOriginal || elementSet.add;
        for (let node = nLastElem(items); node !== null; node = nPrevElem(node)) { // from bottom
          let found = node.hasAttribute('wsr93') ? (node.hasAttribute('yt-chat-item-seq') ? 2 : 1) : 0;
          if (found === 1) node.removeAttribute('wsr93'); // reuse -> wsr93: hidden after re-attach
          if (found === 2) {
            seqIndex = parseInt(node.getAttribute('yt-chat-item-seq'), 10);
            break;
          }
          visObserver.unobserve(node); // reuse case
          node.setAttribute('wsr93', '');
          visObserver.observe(node);
          elementSet.add(node);
        }
        let iter = elementSet.values();
        let i = seqIndex + elementSet.size;
        for (let curr; curr = iter.next().value;) { // from bottom
          curr.setAttribute('yt-chat-item-seq', i % 60);
          curr.classList.add('yt-chat-item-' + ((i % 2) ? 'odd' : 'even'));
          i--;
        }
        iter = null;
        elementSet.clear();
      }

      // const itemsResizeObserver = typeof ResizeObserver === 'function' && 0 ? new ResizeObserver((mutations) => {
      //   const mutation = mutations[mutations.length - 1];
      //   // console.log('resizeObserver', mutation)
      //   const items = (mutation || 0).target;
      //   if (!items) return;
      //   const listDom = items.closest('yt-live-chat-item-list-renderer');
      //   if (!listDom) return;
      //   const listCnt = insp(listDom);
      //   if (listCnt.atBottom !== true) return;
      //   const itemScroller = listCnt.itemScroller || listCnt.$['item-scroller'] || listCnt.querySelector('#item-scroller') || 0;
      //   // if (itemScroller.scrollTop === 0) {
      //     itemScroller.scrollTop = mutation.contentRect.height; // scrollTop changing
      //   // }
      // }) : null;
      // itemsResizeObserverAttached = itemsResizeObserver !== null;

      const mutObserver = new MutationObserver((mutations) => {
        const items = (mutations[0] || 0).target;
        if (!items) return;
        mutFn(items);
      });

      const setupMutObserver = (items) => {
        scrollChatFn = null;
        mutObserver.disconnect();
        mutObserver.takeRecords();
        if (items) {
          if (typeof items.__appendChild932__ === 'function') {
            if (typeof items.appendChild === 'function') items.appendChild = items.__appendChild932__;
            if (typeof items.__shady_native_appendChild === 'function') items.__shady_native_appendChild = items.__appendChild932__;
          }
          mutObserver.observe(items, {
            childList: true,
            subtree: false
          });
          mutFn(items);


          // if (itemsResizeObserver) itemsResizeObserver.observe(items);

          // const isFirstList = firstList;
          // firstList = false;


          if (items && items.nextElementSibling === null) {
            items.parentNode.appendChild(dr(document.createElement('item-anchor')));
            WITH_SCROLL_ANCHOR = true;
            if (ENABLE_OVERFLOW_ANCHOR) {
              items.classList.add('no-anchor');
              nodeParent(items).classList.add('no-anchor'); // required
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
                    lastPlayerProgress = vp > 0 ? vp : 0; // no use ?


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


        }
      }

      return { setupMutObserver };



    })();

    const setupEvents = () => {
      // not called when boost chat is enabled

      // global - currentMouseDown, lastUserInteraction

      let scrollCount = 0;
      let lastScrollCount = -1;
      let lastMouseDown = 0;

      const passiveCapture = typeof IntersectionObserver === 'function' ? { capture: true, passive: true } : true;

      // const delayFlushActiveItemsAfterUserActionK_ = () => {

      //   const lcRenderer = lcRendererElm();
      //   if (lcRenderer) {
      //     const cnt = insp(lcRenderer);
      //     if (!cnt.hasUserJustInteracted11_) return;
      //     if (cnt.atBottom && cnt.allowScroll && cnt.activeItems_.length >= 1 && cnt.hasUserJustInteracted11_()) {
      //       cnt.delayFlushActiveItemsAfterUserAction11_ && cnt.delayFlushActiveItemsAfterUserAction11_();
      //     }
      //   }

      // }

      const delayFlushActiveItemsAfterUserActionK_ = null;

      document.addEventListener('scroll', (evt) => {
        if (!evt || !evt.isTrusted) return;
        // lastScroll = dateNow();
        scrollCount = (scrollCount & 1073741823) + 1;
      }, passiveCapture); // support contain => support passive

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

    // const getTimestampUsec = (itemRenderer) => {
    //   if (itemRenderer && 'timestampUsec' in itemRenderer) {
    //     return itemRenderer.timestampUsec
    //   } else if (itemRenderer && itemRenderer.showItemEndpoint) {
    //     const messageRenderer = ((itemRenderer.showItemEndpoint.showLiveChatItemEndpoint || 0).renderer || 0);
    //     if (messageRenderer) {

    //       const messageRendererKey = firstObjectKey(messageRenderer);
    //       if (messageRendererKey && messageRenderer[messageRendererKey]) {
    //         const messageRendererData = messageRenderer[messageRendererKey];
    //         if (messageRendererData && 'timestampUsec' in messageRendererData) {
    //           return messageRendererData.timestampUsec
    //         }
    //       }
    //     }
    //   }
    //   return null;
    // }

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

      const preprocessChatLiveActionsMap = new WeakSet();

      const toLAObj=(aItem)=>{

        if (!aItem || typeof aItem !== 'object') return false;
        const key = firstObjectKey(aItem); // addLiveChatTickerItemAction
        if (!key) return false;
        let obj = aItem[key];
        if (!obj || typeof obj !== 'object') return false;

        if (typeof (obj.item || 0) == 'object' && firstObjectKey(obj) === 'item') {
          obj = obj.item;
          const key = firstObjectKey(obj);
          if (key) {
            obj = obj[key];
          }
        }

        return obj;

      };

      const groupsK38 = [];


      function intervalsOverlap(a1, a2, b1, b2) {
        // Order the intervals without using Math functions
        var startA = a1 <= a2 ? a1 : a2;
        var endA   = a1 <= a2 ? a2 : a1;

        var startB = b1 <= b2 ? b1 : b2;
        var endB   = b1 <= b2 ? b2 : b1;

        // Check for overlap
        return endA >= startB && endB >= startA;
      }



      const insertIntoSortedArrayA28 = (arr, val) => {
        let left = 0;
        const n = arr.length;
        let right = n;

        // Binary search to find the correct insertion index:
        // We want the first index where arr[index][2] >= val[2].
        while (left < right) {
          const mid = (left + right) >>> 1;
          if (arr[mid][0] < val[0]) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }

        // 'left' is now the insertion index
        left === n ? arr.push(val): arr.splice(left, 0, val);
      };

      function removeNullsInPlace(arr, startI = 0) {
        let insertPos = startI;
        for (let i = startI; i < arr.length; i++) {
          if (arr[i] !== null) {
            insertPos !== i && (arr[insertPos] = arr[i]);
            insertPos++;
          }
        }
        arr.length = insertPos; // Remove the trailing nulls.
      }

      let fir = 0;

      const limitAddition = (a, b) => {
        // Number.MAX_SAFE_INTEGER = 9007199254740991
        // formula = Math.round((a + b) / (1 + a * b / k / k))
        // avoid a*b > 9007199254740991
        // say a, b <= 94800000
        // Consider (x+x) - (x+x) / (1 + x^2 / k^2) < 0.49
        // x < 130095

        const w = 130095;
        if (a < w && b < w) return a + b;
        const k2 = 94800000 * 94800000;
        return Math.round((a + b) / (1 + (a * b) / k2));
      }

      // const formatHMS = (seconds) => {
      //   seconds = seconds | 0;
      //   const h = (seconds / 3600) | 0;
      //   const m = ((seconds - h * 3600) / 60) | 0;
      //   const s = seconds - h * 3600 - m * 60;

      //   return h
      //     ? h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s
      //     : m + ':' + (s < 10 ? '0' : '') + s;
      // };

      const parseHMS = (str) => {
        let parts = str.split(':');
        let s = 0;
        for (let i = 0; i < parts.length; i++) {
          s = s * 60 + (+parts[i]);
        }
        return s;
      };

      const preprocessChatLiveActions = (arr, ct_) =>{

        if (!ct_) ct_ = Date.now();

        if (!fir) {

          if (!__LCRInjection__) {
            console.error('[yt-chat] preprocessChatLiveActions might fail because of no __LCRInjection__');
          }

          DEBUG_preprocessChatLiveActions && console.log('[yt-chat-debug] 5990', 'preprocessChatLiveActions', arr)

          DEBUG_preprocessChatLiveActions && console.log('[yt-chat-debug] 5991', document.querySelectorAll('yt-live-chat-ticker-renderer #ticker-items [class]').length)

          fir = 1;
          // debugger;
        }

        if (!arr || !arr.length) return arr;

        if (preprocessChatLiveActionsMap.has(arr)) return arr;
        preprocessChatLiveActionsMap.add(arr);



        const ct = ct_;

        let groups_ = null;

        // console.log(1237005);
        // const conversionMap = new WeakMap();

        const additionalInfo = new WeakMap();

        // const adjustmentMap = new Map();

        if (FIX_TIMESTAMP_FOR_REPLAY) {

          // console.log('group02331')
          // console.time('FIX_TIMESTAMP_FOR_REPLAY')

          // const stack = new Array(arr.length);
          // let stackL = 0;

          // const arrHash = new Array(arr.length);


          const groups = groupsK38;
          // const delta = 2.0; // head-to-tail + 0.5 + 0.5 = 1.0  -> symmetric -> 1.0 * 2 = 2.0
          // (2)
          // (1.5, 2.5)
          // (1.51, 2.49)
          // -> (1.01, 2.01) , (1.99, 2.99)
          // 2.99 - 1.01 = 1.98 -> 2



          const pushToGroup = (t0mu) => {

            const t0auDv = t0mu - 1e6; // t0buDv - t0auDv = 2e6
            const t0buDv = t0mu + 1e6;
            // const t0auEv = t0mu - 2e6;
            // const t0buEv = t0mu + 2e6;

            let groupK = false;
            // let m = -1;
            // let q= 0;
            //const qq =true;
            //qq && console.log('-------')

            let lastRight = null;
            let lastK = null;
            let deletedStartIndex = -1;

            for (let k = 0, kl = groups.length; k < kl; k++) {

              const group = groups[k];
              const [groupStart, groupEnd, gCount] = group;
              //qq && console.log(`-- ${k} ----- ${groupMid} : [${groupStart},${groupEnd}] || C1 = ${t0buEv < groupMid} || C2 = ${t0auEv > groupMid}`);

              // if (t0bsEv < groupMid) continue; // if(t0m + 1.0 < groupMid - 1.0) continue;
              // if (m < 0) m = k;
              // if (t0asEv > groupMid){
              //   continue; // if(t0m - 1.0 > groupMid + 1.0) break;
              // }


              // if (m < 0) m = k;

              if (lastRight > groupStart) {
                if (!groupK) {
                  // just in case sth wrong
                  console.warn('logic ERROR');
                  groups[k] = null;
                  if (deletedStartIndex < 0) deletedStartIndex = k;
                  break;
                } else {


                  // GroupA: N_a' = N_a + n_e{1} ; Note n_e is the only way to shift right to cause " (lastRight > groupStart) "
                  // GroupB: N_b
                  // Merge Group (A) = N_a' + N_b

                  // without entry moditification, no overlap
                  // this must be due to entry moditifcation
                  // entry is already count. so can be skipped after merging

                  // for merging, groupA will move to right side but left than groupB, so no overlap to groupC

                  const group = groups[lastK];
                  const newN = limitAddition(group[2], gCount);

                  const factor = gCount / (group[2] + gCount);

                  // group[0] = (group[0] * group[2] + groupStart * gCount) / (group[2] + gCount)
                  group[0] += (groupStart - group[0]) * factor;

                  // group[1] = lastRight = (group[1] * group[2] + groupEnd * gCount) / (group[2] + gCount)
                  group[1] += (groupEnd - group[1]) * factor;

                  group[2] = newN;
                  // no change of lastK
                  groups[k] = null;
                  if(deletedStartIndex < 0) deletedStartIndex = k;
                  continue;
                }
              }

              const minGroupStart = lastRight; // all groupStart, groupEnd >= minGroupStart for k, k+1, ...
              if (t0buDv < minGroupStart) {
                // no overlapping could be possible
                break;
              }

              if (intervalsOverlap(t0auDv, t0buDv, groupStart, groupEnd)) {

                groupK = true;

                // if (t0auDv > groupStart) group[0] = t0auDv;
                // else if (t0buDv < groupEnd) group[1] = t0buDv;

                // const newStart = (groupStart * gCount + t0auDv) / (gCount + 1);
                const newStart = groupStart + (t0auDv - groupStart) * 1 / (gCount + 1);

                if (newStart < lastRight) {
                  // n_e{1} will make N_b shift left

                  // GroupA: N_a
                  // GroupB: N_b
                  // Merge Group (A) = N_a + N_b + n_e{1}

                  const group = groups[lastK];
                  const newN = limitAddition(limitAddition(group[2], gCount), 1);
                  const f1 = gCount / (group[2] + gCount + 1);
                  const f2 = 1 / (group[2] + gCount + 1);

                  // group[0] = (group[0] * group[2] + groupStart * gCount + t0auDv) / (group[2] + gCount + 1);
                  group[0] += (groupStart - group[0]) * f1 + (t0auDv - group[0]) * f2;

                  // group[1] = lastRight = (group[1] * group[2] + groupEnd * gCount + t0buDv) / (group[2] + gCount + 1)
                  lastRight = (group[1] += (groupEnd - group[1]) * f1 + (t0buDv - group[1]) * f2);

                  group[2] = newN;
                  // no change of lastK
                  groups[k] = null;
                  if (deletedStartIndex < 0) deletedStartIndex = k;
                  continue;

                } else {
                  // n_e{1} will make N_b shift either left or right

                  // GroupT: N_t
                  // Group (T) = N_t + n_e{1}

                  const newN = limitAddition(gCount, 1);

                  group[0] = newStart;
                  // group[1] = lastRight = (groupEnd * gCount + t0buDv) / (gCount + 1);
                  group[1] = lastRight = groupEnd + (t0buDv - groupEnd) * 1 / (gCount + 1);
                  group[2] = newN;

                  lastK = k;

                  //  (t0asDv > groupStart)  &&  (t0bsDv < groupEnd)   means full containement
                  // however, group size is smaller than or equal to t0width
                }


              } else {
                // just update record for next iteration

                lastRight = groupEnd;
                lastK = k;
              }



            }

            if (deletedStartIndex >= 0) {
              // rarely used

              removeNullsInPlace(groups, deletedStartIndex);

            }
            if (!groupK) {
              // groups.push([t0auDv, t0buDv, 1]);
              insertIntoSortedArrayA28(groups, [t0auDv, t0buDv, 1]);
              // insertIntoSortedArrayA27(groups, [t0auDv, t0buDv, t0mu]);
            }


          }

          // let autoTimeStampFrameChoose = 0;

          // console.log('group02332')
          for (let j = 0, l = arr.length; j < l; j++) {
            const aItem = arr[j];

            const obj = toLAObj(aItem);
            if (obj === false) continue;

            let p = obj.timestampText;
            let p2, p3 = null, p4a = null, p4b = null;
            if (p && p.simpleText) p2 = p.simpleText;

            let q = timestampUsecTranslator(obj.timestampUsec); // <offsetted μs>
            let q2;

            if(q && q > 1e12) q2 = +q; // <offsetted μs>
            // if (q2 > 0 && !autoTimeStampFrameChoose) {
              // const q2cc = Math.round(q2 / 1_000_000); // <integer second>
              // autoTimeStampFrameChoose = q2cc - (q2cc % 10_000_000);
              // if (q2cc - autoTimeStampFrameChoose < 2_000_000) autoTimeStampFrameChoose -= 10_000_000;
              // around 10day range
              // exceeded ~10day -> above 10000000
            // }

          // console.log('group02333', p2, q2)
            // console.log(3775, q2/1e6, autoTimeStampFrameChoose)



            if (p2 && q2) {

              // Trim whitespace manually (faster than trim() in hot paths)
              let str = p2;
              let start = 0;
              let end = str.length;

              // Skip leading whitespace
              while (start < end && (str.charCodeAt(start) === 32 || str.charCodeAt(start) === 9)) start++;
              // Skip trailing whitespace
              while (end > start && (str.charCodeAt(end - 1) === 32 || str.charCodeAt(end - 1) === 9)) end--;

              const len = end - start;

              if (len > 0) {
                const s = str;

                let negative = false;
                let i = start;

                // Check for optional leading '-'
                if (s.charCodeAt(i) === 45) { // '-'
                  negative = true;
                  i++;
                }

                // Must have at least one digit now
                if (i < end && s.charCodeAt(i) >= 48 && s.charCodeAt(i) <= 57) {

                  // Parse numbers separated by ':'
                  const parts = [];
                  let num = 0;

                  for (; i < end; i++) {
                    const code = s.charCodeAt(i);
                    if (code >= 48 && code <= 57) { // '0'-'9'
                      num = num * 10 + (code - 48);
                    } else if (code === 58) { // ':'
                      parts.push(num);
                      num = 0;
                    } else {
                      parts.length = 0;
                      break; // invalid char
                    }
                  }
                  parts.push(num); // last part
                  const partCount = parts.length;
                  // Only support 2 or 3 parts: MM:SS or HH:MM:SS
                  if (partCount === 2 || partCount === 3) {

                    // Validate all parts >= 0 (already ensured by digit parsing)
                    // But we still need to ensure no leading zeros issue or overflow — but for performance, skip if trusted

                    let seconds;
                    if (partCount === 2) {
                      // MM:SS
                      const mins = parts[0];
                      const secs = parts[1];
                      seconds = mins * 60 + secs;
                    } else {
                      // HH:MM:SS
                      const hours = parts[0];
                      const mins = parts[1];
                      const secs = parts[2];
                      seconds = hours * 3600 + mins * 60 + secs;
                    }

                    // Apply sign
                    if (negative) {
                      seconds = -seconds;
                    }

                    // p3 = seconds;

                    // Compute half-open interval [seconds - 0.5, seconds + 0.5)
                    p4a = seconds - 0.5;
                    p4b = seconds + 0.5;

                  }

                }

              }

            }

            if(p4a !== null && p4b !== null && q2 > 0){

              // q2_us = t0_us + dt_us
              // p4a_us <= dt_us < p4b_us
              let p4au = p4a * 1_000_000; // <small μs>
              let p4bu = p4b * 1_000_000; // <small μs>

              // p4a_us <= q2_us - t0_us < p4b_us


              // p4a_us - q2_us <=  - t0_us < p4b_us - q2_us

              // -p4a_us + q2_us >= t0_us > -p4b_us + q2_us


              let t0au = q2 - p4bu; // q2_us - p4b_us <offsetted μs>
              let t0bu = q2 - p4au; // q2_us - p4a_us <offsetted μs>

              // t0 (t0au, t0bu]

              const t0mu = (t0au + t0bu) / 2; // <offsetted μs>

              // stack[stackL++]=({
              //   id: obj.id,
              //   idx: j,
              //   p2,
              //   // q2s : (q2/ 1e6 - autoTimeStampFrameChoose).toFixed(2),
              //   p3,
              //   /*
              //   timestampText: obj.timestampText,
              //   timestampUsec: obj.timestampUsec, // us = 1/1000 ms
              //   q2,
              //   p4a,
              //   p4b,
              //   */
              //   q2s: +(q2 / 1e6 - autoTimeStampFrameChoose).toFixed(2),
              //   t0as: +(t0au / 1e6 - autoTimeStampFrameChoose).toFixed(2),
              //   t0bs: +(t0bu /1e6 - autoTimeStampFrameChoose).toFixed(2),

              //   t0au,
              //   t0bu,
              //   t0mu
              // });

              // console.log('group02334')
              let wobj = additionalInfo.get(obj);
              if (!wobj) additionalInfo.set(obj, wobj = {});

              wobj.timestampUsecOriginal = q2; // <offsetted μs>
              // wobj.timestampUsecAdjusted = q2;
              wobj.t0au = t0au; // <offsetted μs>
              wobj.t0bu = t0bu; // <offsetted μs>
              wobj.t0mu = t0mu; // <offsetted μs>

              // arrHash[j] = {
              //   index: j,
              //   id: obj.id,
              //   timestampUsec: q2,
              //   t0au,
              //   t0bu,
              //   t0mu
              // };

              pushToGroup(t0mu);

              // console.log('group02335')
              // console.log('grouping', `${obj.id}.${obj.timestampUsec}`);

              // timestamp (q2) can be incorrect.

              // https://www.youtube.com/watch?v=IKKar5SS29E
              // ChwKGkNQZUxfXzZxLS04Q0ZXNGxyUVlkODZrQzNR

              /*


                  [
                    {
                      "id": "ChwKGkNNWHZqXy1xLS04Q0ZXNGxyUVlkODZrQzNR",
                      "p2": "2:04",
                      "p3": 124,
                      "t0as": 8320733.78,
                      "t0bs": 8320734.78
                    },
                    {
                      "id": "ChwKGkNQZUxfXzZxLS04Q0ZXNGxyUVlkODZrQzNR",
                      "p2": "2:04",
                      "p3": 124,
                      "t0as": 8320898.89, // incorrect
                      "t0bs": 8320899.89
                    }
                  ]


              */

            }

          }

          // stack.length = stackL;

          groups_ = groups;
          // console.log('groups', groups)

        }

        const groupMids = FIX_TIMESTAMP_FOR_REPLAY ? groups_.map(group => {
          // const [groupStart, groupEnd] = group;
          // const groupMid = (groupStart + groupEnd) / 2;
          // return groupMid;
          return (group[0] + group[1]) / 2;
        }) : null;
        // console.log('groupMids', groupMids)

        const adjustTimestampFn = (obj) => {

          const groupCount = groupMids.length;

          if (groupCount < 1) return null;

          // const obj = toLAObj(aItem);
          if (obj === false) return null;

          const wobj = additionalInfo.get(obj);
          if (!wobj) return null;

          const { t0mu } = wobj;

          let i0 = 0;

          if (groupCount >= 3) {
            // For larger arrays, use binary search.
            let low = 0;
            let high = groupCount - 1;

            while (high - low > 1) {
              const mid = (low + high) >>> 1;
              if (groupMids[mid] >= t0mu) {
                high = mid;
              } else {
                low = mid;
              }
            }
            i0 = low;

          }

          let upperDiff = -1;
          let lowerDiff = -1;
          for (let i = i0; i < groupCount; i++) {
            const y = groupMids[i] - t0mu;
            if (y >= 0) {
              upperDiff = y; // >=0, entry > value is found
              break;
            }
            lowerDiff = -y; // >0, cache
          }

          const d1 = upperDiff;
          const d2 = lowerDiff;

          // console.log(5381, index1 ,d1, index2 , d2);

          if (d1 >= 0 && ((d2 < 0) || (d1 <= d2))) {
            wobj.chosenT0 = t0mu + d1; // groupMids[index1];
          } else if (d2 >= 0 && ((d1 < 0) || (d2 <= d1))) {
            wobj.chosenT0 = t0mu - d2; // groupMids[index2];
          } else {
            console.warn('logic error');
            return null;
          }

          const adjusted = wobj.timestampUsecOriginal - wobj.chosenT0; // <μs>

          // wobj.timestampUsecAdjusted = adjusted + 1110553200000;

          // console.log('adjusted', `${obj.id}.${obj.timestampUsec}`, wobj.timestampUsecOriginal - wobj.chosenT0);

          // adjustmentMap.set(`${obj.id}.${obj.timestampUsec}`, wobj.timestampUsecOriginal - wobj.chosenT0);

          return adjusted;

        };

        // console.log(1237001);

        {
          const mapper = new Map();
          const mapVOT = new Map();
          const progressOffsets = new Map();
          let uXt = -Infinity;
          let sXt = "";

          // Cache mapSetter
          const mapSetter = mapper.setOriginal || mapper.set;
          mapper.set = mapSetter;
          mapVOT.set = mapSetter;
          progressOffsets.set = mapSetter;

          // First pass: Build maps and collect indices
          const length = arr.length;
          const mArr1 = new Array(length);
          const idxices = new Array(length);
          const objEntries = new Array(length);
          let mArr1Length = 0;

          // sort live superchats
          const mArrLiveSC = new Array(length);
          const idxicesLiveSC = new Array(length);
          let mLenLiveSC = 0;

          // sort live chat messages
          const mArrLiveMsg = new Array(length);
          const idxicesLiveMsg = new Array(length);
          let mLenLiveMsg = 0;

          for (let idx = 0; idx < length; idx++) {
            const aItem = arr[idx];
            const obj = toLAObj(aItem);

            if (!obj) continue;

            if (obj.id && !obj.__timestampActionRequest__) {
              // for all item entries
              obj.__timestampActionRequest__ = ct;
            }

            const baseTsUsec = obj.timestampUsec;

            if (!baseTsUsec) {
              // ticker
              const t1 = obj.__timestampActionRequest__; // ms
              const t0 = t1 - (obj.fullDurationSec - obj.durationSec) * 1000; // ms
              if (t0 > 1000) { // not NaN
                const k = mLenLiveSC++;
                idxicesLiveSC[k] = idx;
                mArrLiveSC[k] = { t0: t0, t1: t1, aItem, obj };
              }
              continue;
            }

            const baseText = obj.timestampText;
            if (!baseText) {
              // live chat messages

              const baseTime = timestampUsecTranslator(baseTsUsec); // <offsetted μs>
              if (baseTime > 1000) { // not NaN
                const k = mLenLiveMsg++;
                idxicesLiveMsg[k] = idx;
                mArrLiveMsg[k] = { ts: baseTime, aItem, obj };
              }

              continue;
            }
            // timestampText - only for reply
            // timestampUsec - only for chat message

            // const timestampUsec = +toLAObj(aItem).timestampUsec; // +false.x = NaN
            // const timestampUsec = +toLAObj(aItem).adjustedTime;

            let timestampUsec;

            if (FIX_TIMESTAMP_FOR_REPLAY) {

              // const adjustmentTime = adjustmentMap.get(`${obj.id}.${obj.timestampUsec}`);

              // // const wobj = additionalInfo.get(obj);

              // // if(!wobj){
              // //   console.warn('FIX_TIMESTAMP_FOR_REPLAY - no wobj', obj)
              // //   return false;
              // // }

              // // timestampUsec =  +wobj.timestampUsecAdjusted;
              // if (!Number.isFinite(adjustmentTime)) {
              //   console.warn(`FIX_TIMESTAMP_FOR_REPLAY - no adjustmentTime for ${obj.id}.${obj.timestampUsec}`, obj, [...adjustmentMap])
              //   return false;
              // }
              // timestampUsec = adjustmentTime;

              const adjustmentTime = Math.floor(adjustTimestampFn(obj)); // <μs>
              if (!Number.isFinite(adjustmentTime)) {
                console.warn(`FIX_TIMESTAMP_FOR_REPLAY - no adjustmentTime for ${obj.id}.${obj.timestampUsec}`, obj);
                continue;
              }
              timestampUsec = adjustmentTime; // <μs> (couting from the start of video)
            } else {

              const baseTime = timestampUsecTranslator(baseTsUsec); // <offsetted μs>
              if (!Number.isFinite(baseTime)) {
                console.warn(`no baseTime for ${obj.id}.${obj.timestampUsec}`, obj);
                continue;
              }
              timestampUsec = baseTime; // <offsetted μs>
            }

            mapper.set(aItem, timestampUsec);

            const vot = obj.__videoOffsetTimeMsec__;
            if (vot) {
              mapVOT.set(vot, timestampUsec);
            }
          }

          // sort ticker orders for livestreams
          // note: for replay tickers, __videoOffsetTimeMsec__ will override this sorting
          if (mLenLiveSC >= 2) {
            const len = mLenLiveSC;
            mArrLiveSC.length = len;
            idxicesLiveSC.length = len;
            // console.log(1213, 'mArrLiveSC', [...mArrLiveSC]);
            mArrLiveSC.sort((a, b) => {
              // sort by: (1) start time - earlier first; (2) end time - earlier first
              return a.t0 - b.t0 || a.t1 - b.t1 || 0;
            });
            for (let j = 0; j < len; j++) {
              arr[idxicesLiveSC[j]] = mArrLiveSC[j].aItem;
            }
            // console.log(1213, 'sorted arr for LiveSC', [...arr]);
          }

          // sort chat message orders for livestreams
          if (mLenLiveMsg >= 2) {
            const len = mLenLiveMsg;
            mArrLiveMsg.length = len;
            idxicesLiveMsg.length = len;
            // console.log(1413, 'mArrLiveMsg', [...mArrLiveMsg]);
            mArrLiveMsg.sort((a, b) => {
              // sort by: timestampUsec - earlier first
              return a.ts - b.ts || 0;
            });
            for (let j = 0; j < len; j++) {
              arr[idxicesLiveMsg[j]] = mArrLiveMsg[j].aItem;
            }
            // console.log(1413, 'sorted arr for LiveMsg', [...arr]);
          }

          if (mapper.size >= 2) {
            // live_replay, with at least two chat messages of different timestamps

            // Second pass: Filter and collect indices (combined with progress offset collection)
            for (let idx = 0; idx < length; idx++) {
              const aItem = arr[idx];
              const obj = toLAObj(aItem);

              if (obj) {
                let timestampUsec = null;

                const u = mapper.get(aItem);
                if (u !== undefined) {
                  timestampUsec = u;
                } else {
                  const vot = obj.__videoOffsetTimeMsec__;
                  if (vot) {
                    const mappedTimestamp = mapVOT.get(vot);
                    if (mappedTimestamp !== undefined) {
                      // relate the ticker to the chat message order using __videoOffsetTimeMsec__
                      mapper.set(aItem, mappedTimestamp);
                      timestampUsec = mappedTimestamp;
                    }
                  }
                }

                if (timestampUsec !== null) {
                  const addIdx = mArr1Length++;
                  idxices[addIdx] = idx;
                  // aItem.__iAmTarget__ = timestampUsec;
                  mArr1[addIdx] = { timestampUsec, aItem };

                  // Process progress offsets in the same pass
                  const o = obj;
                  // Quick property check instead of while loop

                  if (o.id && o.__progressAt__ > 0) {
                    const key = `${o.__progressAt__}`;
                    const currentMax = progressOffsets.get(key);

                    if (!currentMax || timestampUsec > currentMax) {
                      progressOffsets.set(key, timestampUsec);
                    }

                    objEntries[addIdx] = { key, o, timestampUsec };
                  } else {

                    objEntries[addIdx] = null;
                  }

                }
              }
            }

            const len = mArr1Length;

            // Trim the array to actual size
            idxices.length = len;
            mArr1.length = len;
            objEntries.length = len;

            // Process progress adjustments
            for (let i = 0; i < len; i++) {
              const entry = objEntries[i];
              if (entry) {
                const { o, timestampUsec, key } = entry;
                const maxTs = progressOffsets.get(key);
                if (maxTs !== undefined) {
                  const k = maxTs - timestampUsec; // >= 0 <μs>
                  if (k > 0) {
                    // if (k > 1e-6) {
                    o.__progressAt__ -= k / 1_000_000;
                  }
                }
              }
            }

            mArr1.sort((a, b) => {
              return a.timestampUsec - b.timestampUsec; // <integer μs>
              // const av = a.timestampUsec; // <integer μs>
              // const bv = b.timestampUsec; // <integer μs>
              // const diff = av - bv;

              // More efficient epsilon check
              // if (diff > 1e-6) return 1;
              // if (diff < -1e-6) return -1;
              // return 0;

              // low index = oldest = smallest timestamp
            });

            // Update original array with sorted items
            for (let j = 0; j < len; j++) {
              arr[idxices[j]] = mArr1[j].aItem;
            }

            // console.log(9126, arr.map((e) => {
            //   const o = toLAObj(e);
            //   return {
            //     tsText: o.timestampText?.simpleText || "",
            //     tsUsec: o.timestampUsec,
            //     __progressAt__: o.__progressAt__,

            //     __iAmTarget__: mapper.get(e),
            //     xInfo: additionalInfo.get(o),

            //   }
            // }));

            // after sorting, fix the timestamp text
            if (FIX_TIMESTAMP_TEXT) {
              for (const aItem of arr) {
                const obj = toLAObj(aItem);
                const timestampText = (obj || 0).timestampText;
                if (timestampText) {
                  const t = timestampText.simpleText || timestampText;
                  if (typeof t === "string" && t.length > 0 && t !== sXt) {
                    const x = parseHMS(t);
                    if (x < uXt) {
                      if (typeof timestampText.simpleText === "string") {
                        timestampText.simpleText = sXt;
                      } else if (typeof timestampText === "string") {
                        obj.timestampText = sXt;
                      }
                    } else if (x > uXt) {
                      uXt = x;
                      sXt = t;
                    }
                  }
                }
              }
            }
          }

          // idxices.length = 0;
          // mArr1.length = 0;
          // objEntries.length = 0;
          // mapper.clear();
          // mapVOT.clear();
          // progressOffsets.clear();

        }

        // console.log(1237005)

        // console.log(378, arr);

        return arr;


      }

      if (ATTEMPT_TICKER_ANIMATION_START_TIME_DETECTION) {

        console.log('[yt-chat-control] ATTEMPT_TICKER_ANIMATION_START_TIME_DETECTION is used.')

        // console.log('ATTEMPT_TICKER_ANIMATION_START_TIME_DETECTION 0001')

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
                      if (playerProgressChangedArg1 > 1000) {
                        renderer.__progressAt__ = playerProgressChangedArg1;
                      } else {
                        renderer.__progressAt__ = undefined;
                      }

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

        // lcrFn2 will run twice to ensure the method is successfully injected.
        const lcrFn2 = (lcrDummy)=>{
          // make minimal function overhead by pre-defining all possible outside.

          const tag = "yt-live-chat-renderer"
          const dummy = lcrDummy;

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          // mightFirstCheckOnYtInit();
          // groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-renderer hacks");
          // console.log("[Begin]");


          if (typeof cProto.playerProgressChanged_ === 'function' && !cProto.playerProgressChanged32_) {

            cProto.playerProgressChanged32_ = cProto.playerProgressChanged_;


            cProto.playerProgressChanged_ = function (a, b, c) {
              // console.log(48117005)
              if (a === 0) a = arguments[0] = Number.MIN_VALUE; // avoid issue dealing with zero value
              playerProgressChangedArg1 = (+a) + progressTimeRefOrigin;
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

          // console.log("[End]");
          // groupEnd();


        };
        !__LCRInjection__ && LCRImmedidates.push(lcrFn2);


        // console.log('ATTEMPT_TICKER_ANIMATION_START_TIME_DETECTION 0002')

        // getLCRDummy() must be called for injection
        getLCRDummy().then(lcrFn2);

      }

      const stackDM = (()=>{

        let cm, stack, mo;

        let firstRun = ()=>{
          
          cm = mockCommentElement(document.createComment('1'));
          stack = new Set();
          mo = new MutationObserver(()=>{
            const stack_ = stack;
            stack = new Set();
            // for(const value of stack_){
            //   Promise.resolve(value).then(f=>f());
            // }
            for(const value of stack_){
              value();
            }
            stack_.clear();
          });
          mo.observe(cm, {characterData: true});

        }


        const stackDM = (f) => {

          if (firstRun) firstRun = firstRun();
          stack.add(f);
          cm.data = `${(cm.data & 1) + 1}`;
        }
        return stackDM;
      })();
      window.stackDM = stackDM;


      const widthReq = (()=>{

        let widthIORes;
        let widthIO;

        let firstRun = () => {
          widthIORes = new WeakMap();
          widthIO = new IntersectionObserver((mutations) => {
            const r = new Map();
            for (const mutation of mutations) {
              r.set(mutation.target, mutation.boundingClientRect);
            }

            for (const [elm, rect] of r) {
              widthIO.unobserve(elm);
              const o = widthIORes.get(elm);
              o && widthIORes.delete(elm);
              const { promise, values } = o || {};
              if (promise && values) {
                values.width = rect.width;
                promise.resolve(values);
              }
            }
          });
        };

        const widthReq = (elm) => {

          if (firstRun) firstRun = firstRun();

          {
            const { promise, values } = widthIORes.get(elm) || {};
            if (promise) return promise;
          }

          const promise = new PromiseExternal();
          widthIORes.set(elm, { promise, values: {} });
          widthIO.unobserve(elm);
          widthIO.observe(elm);

          return promise;

        }
        return widthReq;
      })();




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
        console1.log("[Begin]");

        const mclp = cProto;
        const _flag0281_ = window._flag0281_;

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

        mclp.prDelay171 = null;

        let myk = 0; // showNewItems77_
        let mlf = 0; // flushActiveItems77_
        let myw = 0; // onScrollItems77_
        let mzt = 0; // handleLiveChatActions77_
        let mlg = 0; // delayFlushActiveItemsAfterUserAction11_
        let zarr = null;

        if ((_flag0281_ & 0x2000) == 0) {

          if ((mclp.clearList || 0).length === 0) {
            (_flag0281_ & 0x2) == 0 && assertor(() => fnIntegrity(mclp.clearList, '0.106.50'));
            mclp.clearList66 = mclp.clearList;
            mclp.clearList = function () {
              myk = (myk & 1073741823) + 1;
              mlf = (mlf & 1073741823) + 1;
              myw = (myw & 1073741823) + 1;
              mzt = (mzt & 1073741823) + 1;
              mlg = (mlg & 1073741823) + 1;
              zarr = null;
              this.prDelay171 = null;
              this.clearList66();
            };
            console1.log("clearList", "OK");
          } else {
            console1.log("clearList", "NG");
          }

        }



        let onListRendererAttachedDone = false;

        function setList(itemOffset, items) {

          const isFirstTime = onListRendererAttachedDone === false;

          if (isFirstTime) {
            onListRendererAttachedDone = true;
            Promise.resolve().then(watchUserCSS);
            addCssManaged();

            const isBoostChatEnabled = (window._flag0281_ & 0x40000) === 0x40000;
            if (!isBoostChatEnabled) setupEvents();
          }

          setupStyle(itemOffset, items);

          setupMutObserver(items);

          console.log('[yt-chat] setupMutObserver DONE')
        }


        const deferSeqFns = []; // ensure correct sequence
        let deferSeqFnI = 0;
        const deferCallbackLooper = entry => {
          nextBrowserTick_(() => {
            const { a, b } = entry;
            const cnt = kRef(a);
            if (cnt && b) b.call(cnt);
            entry.a = entry.b = null;
          });
        }
        const deferCallback = async (cnt, callback) => {
          const a = cnt.__weakRef9441__ || (cnt.__weakRef9441__ = mWeakRef(cnt));
          deferSeqFns[deferSeqFnI++] = { a, b: callback };
          if (deferSeqFnI > 1) return;
          const pr288 = cnt.prDelay288;
          await pr288;
          wme.data = `${(wme.data & 7) + 1}`;
          await wmp;
          const l = deferSeqFnI;
          deferSeqFnI = 0;
          for (let i = 0; i < l; i++) {
            const o = deferSeqFns[i];
            deferSeqFns[i] = null;
            Promise.resolve(o).then(deferCallbackLooper);
          }
        };

        let showMoreBtnTransitionTrigg = null;

        mclp.__showMoreBtn_transitionstart011__ = function (evt) {
          showMoreBtnTransitionTrigg = true;
          const newVisibility = (this.atBottom === true) ? "hidden" : "visible";
          if (newVisibility === "visible") {
            const btn = evt.target;
            if (btn.style.visibility !== newVisibility) btn.style.visibility = newVisibility;
          }
        };


        mclp.__showMoreBtn_transitionend011__ = function (evt) {
          showMoreBtnTransitionTrigg = true;
          const newVisibility = (this.atBottom === true) ? "hidden" : "visible";
          if (newVisibility === "hidden") {
            const btn = evt.target;
            if (btn.style.visibility !== newVisibility) btn.style.visibility = newVisibility;
          }
        };
        
        mclp.attached419 = async function () {

          if (!this.isAttached) return;

          let maxTrial = 16;
          while (!this.$ || !this.$['item-scroller'] || !this.$['item-offset'] || !this.$['items']) {
            if (--maxTrial < 0 || !this.isAttached) return;
            await nextBrowserTick_();
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

          const isTargetItems = HTMLElement_.prototype.matches.call(items, '#item-offset.style-scope.yt-live-chat-item-list-renderer > #items.style-scope.yt-live-chat-item-list-renderer')

          if (!isTargetItems) {
            console.warn("!isTargetItems");
            return;
          }

          setList(itemOffset, items);

          if (WITH_SCROLL_ANCHOR) this.__itemAnchorColl011__ = itemOffset.getElementsByTagName('item-anchor');
          else this.__itemAnchorColl011__ = null;



          // btn-show-more-transition
          const btn = this.$['show-more'];
          if (btn) {
            if (!this.__showMoreBtn_transitionstart012__) this.__showMoreBtn_transitionstart012__ = this.__showMoreBtn_transitionstart011__.bind(this);
            if (!this.__showMoreBtn_transitionend012__) this.__showMoreBtn_transitionend012__ = this.__showMoreBtn_transitionend011__.bind(this);
            btn.addEventListener('transitionrun', this.__showMoreBtn_transitionstart012__, false);
            btn.addEventListener('transitionstart', this.__showMoreBtn_transitionstart012__, false);
            btn.addEventListener('transitionend', this.__showMoreBtn_transitionend012__, false);
            btn.addEventListener('transitioncancel', this.__showMoreBtn_transitionend012__, false);
          }

          // fix panel height changing issue (ENABLE_OVERFLOW_ANCHOR only)
          if (itemScrollerResizeObserver) itemScrollerResizeObserver.observe(this.itemScroller || this.$['item-scroller']);

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
          const cnt = insp(t29);
          if (cnt.isAttached === true) {
            cnt.attached419();
          }
        }

        if ((mclp.async || 0).length === 2 && (mclp.cancelAsync || 0).length === 1) {

          assertor(() => fnIntegrity(mclp.async, '2.24.15'));
          assertor(() => fnIntegrity(mclp.cancelAsync, '1.15.8'));

          /** @type {Map<number, any>} */
          const aMap = new Map();
          const mcid = setTimeout(() => 0, 0.625);
          const maid = requestAnimationFrame(() => 0);
          clearTimeout(mcid);
          cancelAnimationFrame(maid);
          const count0 = mcid + maid + 1740;
          let count = count0;
          mclp.async66 = mclp.async;
          mclp.async = function (e, f) {
            // ensure the previous operation is done
            // .async is usually after the time consuming functions like flushActiveItems_ and scrollToBottom_
            const hasF = arguments.length === 2;
            if (count > 1e9) count = count0 + 9;
            const resId = ++count;
            aMap.set(resId, e);
            const pr1 = Promise.all([this.prDelay288, wmp, this.prDelay171, Promise.resolve()]);
            const pr2 = autoTimerFn();
            Promise.race([pr1, pr2]).then(() => {
              const rp = aMap.get(resId);
              if (typeof rp !== 'function') {
                return;
              }
              const asyncEn = function () {
                return aMap.delete(resId) && rp.apply(this, arguments);
              };
              aMap.set(resId, hasF ? this.async66(asyncEn, f) : this.async66(asyncEn));
            });

            return resId;
          }

          mclp.cancelAsync66 = mclp.cancelAsync;
          mclp.cancelAsync = function (resId) {
            if (resId <= count0) {
              this.cancelAsync66(resId);
            } else if (aMap.has(resId)) {
              const rp = aMap.get(resId);
              aMap.delete(resId);
              if (typeof rp !== 'function') {
                this.cancelAsync66(rp);
              }
            }
          }

          console1.log("async", "OK");
        } else {
          console1.log("async", "NG");
        }


        if ((_flag0281_ & 0x2) == 0) {
          if ((mclp.showNewItems_ || 0).length === 0 && ENABLE_NO_SMOOTH_TRANSFORM) {

            assertor(() => fnIntegrity(mclp.showNewItems_, '0.170.79'));
            mclp.showNewItems66_ = mclp.showNewItems_;
            mclp.showNewItems_ = function () {
              //
            }

            console1.log("showNewItems_", "OK");
          } else {
            console1.log("showNewItems_", "NG");
          }

        }



        if ((_flag0281_ & 0x2) == 0) {
          if ((mclp.onScrollItems_ || 0).length === 1) {

            if (mclp.onScrollItems3641_) {

            } else {
              assertor(() => fnIntegrity(mclp.onScrollItems_, '1.17.9'));

            }

            if (typeof mclp.setAtBottom === 'function' && mclp.setAtBottom.length === 0) {

              mclp.setAtBottom217 = mclp.setAtBottom;
              mclp.setAtBottom = function () {
                const v = this.ec217;
                if (typeof v !== 'boolean') return this.setAtBottom217();
                const u = this.atBottom;
                if (u !== v && typeof u === 'boolean') this.atBottom = v;
                // this.atBottom = a.scrollTop >= a.scrollHeight - a.clientHeight - 15
              }

              let lastScrollTarget = null;
              mclp.onScrollItems66_ = mclp.onScrollItems_;
              let callback = () => { };

              // let itemScrollerWR = null;
              let lastEvent = null;

              let io2 = null, io1 = null;
              const io2f = (entries, observer) => {
                const entry = entries[entries.length - 1];
                if (entry.target !== lastScrollTarget) return;
                callback(entry);
              };
              const io1f = (entries, observer) => {
                const entry = entries[entries.length - 1];
                observer.unobserve(entry.target);
                if (entry.target !== lastScrollTarget) return;
                lastScrollTarget = null;
                callback(entry);
              };
              mclp.onScrollItems3885cb2_ = function (entry) {
                const v = (entry.isIntersecting === true);
                this.ec217 = v;
                this.onScrollItems66_(lastEvent);
                this.ec217 = null;
              }
              mclp.onScrollItems3885cb1_ = function (entry) {
                const v = (entry.intersectionRatio > 0.98);
                this.ec217 = v;
                this.onScrollItems66_(lastEvent);
                this.ec217 = null;
              };

              mclp.onScrollItems_ = function (evt) {

                if (evt === lastEvent) return;
                if (evt && lastEvent && evt.timeStamp === lastEvent.timeStamp) return;
                lastEvent = evt;
                const ytRendererBehavior = this.ytRendererBehavior || 0;
                if (typeof ytRendererBehavior.onScroll === 'function') ytRendererBehavior.onScroll(evt);
                const coll = this.__itemAnchorColl011__;
                if (coll) {
                  const anchorElement = coll.length === 1 ? coll[0] : null;
                  if (lastScrollTarget !== anchorElement) {
                    if (io2) io2.disconnect();
                    lastScrollTarget = anchorElement;
                    if (anchorElement) {
                      if (!this.onScrollItems3886cb2_) this.onScrollItems3886cb2_ = this.onScrollItems3885cb2_.bind(this);
                      callback = this.onScrollItems3886cb2_;
                      if (!io2) io2 = new IntersectionObserver(io2f);
                      io2.observe(anchorElement);
                    }
                  }
                } else {
                  const items = this.$.items;
                  if (!items) return this.onScrollItems66_();
                  const lastComponent = lastComponentChildFn(items);
                  if (!lastComponent) return this.onScrollItems66_();
                  if (lastScrollTarget === lastComponent) return;
                  lastScrollTarget = lastComponent;

                  if (io1) io1.disconnect();
                  if (!this.onScrollItems3886cb1_) this.onScrollItems3886cb1_ = this.onScrollItems3885cb1_.bind(this);
                  callback = this.onScrollItems3886cb1_;
                  if (!io1) io1 = new IntersectionObserver(io1f);
                  io1.observe(lastComponent);
                }
              };

            }

            
            console1.log("onScrollItems_", "OK");
          } else {
            console1.log("onScrollItems_", "NG");
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
            console1.log("refreshOffsetContainerHeight_", "OK");
          } else {
            console1.log("refreshOffsetContainerHeight_", "NG");
          }

        }

        if ((_flag0281_ & 0x2000) == 0) {
          if ((mclp.flushActiveItems_ || 0).length === 0) {

            if ((_flag0281_ & 0x2) == 0) {

              const sfi = fnIntegrity(mclp.flushActiveItems_);

              if (sfi === '0.156.86') {

                // https://www.youtube.com/s/desktop/2cf5dafc/jsbin/live_chat_polymer.vflset/live_chat_polymer.js


                //   f.flushActiveItems_ = function() {
                //     var a = this;
                //     if (this.activeItems_.length > 0)
                //         if (this.canScrollToBottom_()) {
                //             var b = Math.max(this.visibleItems.length + this.activeItems_.length - this.data.maxItemsToDisplay, 0);
                //             b && this.splice("visibleItems", 0, b);
                //             if (this.isSmoothScrollEnabled_() || this.dockableMessages.length)
                //                 this.preinsertHeight_ = this.items.clientHeight;
                //             this.activeItems_.unshift("visibleItems");
                //             try {
                //                 this.push.apply(this, this.activeItems_)
                //             } catch (c) {
                //                 $m(c)
                //             }
                //             this.activeItems_ = [];
                //             this.isSmoothScrollEnabled_() ? this.canScrollToBottom_() && wy(function() {
                //                 a.showNewItems_()
                //             }) : wy(function() {
                //                 a.refreshOffsetContainerHeight_();
                //                 a.maybeScrollToBottom_()
                //             })
                //         } else
                //             this.activeItems_.length > this.data.maxItemsToDisplay && this.activeItems_.splice(0, this.activeItems_.length - this.data.maxItemsToDisplay)
                // }
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
                assertor(() => fnIntegrity(mclp.flushActiveItems_, '0.157.86'))
                 || logFn('mclp.flushActiveItems_', mclp.flushActiveItems_)();
              }
            }

            let hasMoreMessageState = !ENABLE_SHOW_MORE_BLINKER ? -1 : 0;

            mclp.flushActiveItems66a_ = mclp.flushActiveItems_;
            // let lastLastRow = null;


  
            const preloadFn = (acItems) => {
              let waitFor = [];
              /** @type {Set<string>} */
              const imageLinks = new Set();
              imageLinks.add = imageLinks.addOriginal || imageLinks.add;

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
              imageLinks.clear();

              return async () => {
                if (waitFor.length > 0) {
                  await Promise.race([new Promise(r => setTimeout(r, 250)), Promise.all(waitFor)]);
                }
                waitFor.length = 0;
                waitFor = null;
              };

            };

            if (ENABLE_CHAT_MESSAGES_BOOSTED_STAMPING && `${mclp.flushActiveItems_}`.includes("this.push.apply(this,this.activeItems_)") && `${mclp.flushActiveItems_}`.includes(`this.splice("visibleItems",0,`)
              && !cProto.notifyPath371 && !cProto.proceedStampDomArraySplices381_
              && !cProto.stampDomArraySplices381_ && !cProto.push377 && !cProto.splice377) {

              {

                rendererStamperFactory(cProto, {
                  key: 'proceedStampDomArraySplices381_',
                  stamperDomClass: 'style-scope yt-live-chat-item-list-renderer yt-live-chat-item-list-stampdom',
                  preloadFn
                });
                
                cProto.notifyPath371 = cProto.notifyPath;

                cProto.stampDomArraySplices381_ = cProto.stampDomArraySplices_;

                if (typeof cProto.stampDomArraySplices381_ === 'function' && cProto.stampDomArraySplices381_.length >= 3) {
                  cProto.stampDomArraySplices_ = function (a, b, c) {
                    if (a === 'visibleItems' && b === 'items' && (c || 0).indexSplices) {
                      // if (this.ec388) {
                      const indexSplices = c.indexSplices;
                      if (indexSplices.length === 1 || typeof indexSplices.length === "undefined") {
                        const indexSplice = indexSplices[0] || indexSplices || 0;
                        if (indexSplice.type === 'splice' && (indexSplice.addedCount >= 1 || (indexSplice.removed || []).length >= 1)) {
                          // console.log(1059, a, b, indexSplice);
                          if (this.proceedStampDomArraySplices381_(a, b, indexSplice)) return;
                        }
                      }
                      // } else {
                      //   console.warn('stampDomArraySplices_ warning', ...arguments);
                      // }
                    }
                    return this.stampDomArraySplices381_(...arguments);
                  };
                } else {
                  console.warn('0xF0230 Function Signature Changed');
                }

                cProto.stampDomArray366_ = cProto.stampDomArray_;

                if (typeof cProto.stampDomArray366_ === 'function' && cProto.stampDomArray366_.length >= 5) {
                  cProto.stampDomArray_ = function (items, containerId, componentConfig, rxConfig, shouldCallback, isStableList) {
                    const isTickerRendering = items === this.tickerItems && containerId === 'ticker-items';
                    const isMessageListRendering = items === this.visibleItems && containerId === 'items';

                    if (!isTickerRendering && !isMessageListRendering) {
                      console.log('stampDomArray_ warning 0xF501', ...arguments)
                      return this.stampDomArray366_(...arguments);
                    }

                    const container = (this.$ || 0)[containerId];
                    if (!container) {
                      console.log('stampDomArray_ warning 0xF502', ...arguments)
                      return this.stampDomArray366_(...arguments);
                    }

                    if (container[sFirstElementChild] === null && items.length === 0) {

                    } else {
                      const cTag = isTickerRendering ? 'tickerItems' : 'visibleItems';
                      this.proceedStampDomArraySplices381_(cTag, containerId, {
                        addedCount: items.length,
                        removedCount: container.childElementCount
                      });
                    }

                    const f = () => {
                      this.markDirty && this.markDirty();
                      const detail = {
                        container
                      };
                      shouldCallback && this.hostElement.dispatchEvent(new CustomEvent("yt-rendererstamper-finished", {
                        bubbles: !0,
                        cancelable: !1,
                        composed: !0,
                        detail
                      }));
                      detail.container = null;
                    };

                    if (this.ec389pr) {
                      this.ec389pr.then(f)
                    } else {
                      f();
                    }

                  };
                } else {
                  console.warn('0xF0230 Function Signature Changed');
                }

                mclp.push377 = mclp.push;
                mclp.splice377 = mclp.splice;

                const emptyArr = [];
                emptyArr.push = () => 0;
                emptyArr.unshift = () => 0;
                emptyArr.pop = () => void 0;
                emptyArr.shift = () => void 0;
                emptyArr.splice = () => void 0;
                emptyArr.slice = function () { return this };

                if (typeof mclp.push377 === 'function' && mclp.push377.length >= 1) {
                  mclp.push = function (cTag, ...fnArgs) {
                    if (cTag !== 'visibleItems' || !fnArgs.length || !fnArgs[0]) return this.push377(...arguments);
                    const arr = this.visibleItems;
                    const len = arr.length;
                    const newTotalLen = arr.push(...fnArgs);
                    const addedCount = fnArgs.length;
                    // console.log('push')
                    this.proceedStampDomArraySplices381_('visibleItems', 'items', {
                      index: len, addedCount: addedCount, removedCount: 0
                    })
                    return newTotalLen;
                  }
                } else {
                  console.warn('0xF0230 Function Signature Changed');
                }

                if (typeof mclp.splice377 === 'function' && mclp.splice377.length >= 1) {
                  mclp.splice = function (cTag, ...fnArgs) {
                    if (cTag !== 'visibleItems' || !fnArgs.length || (fnArgs.length === 2 && !fnArgs[1]) || (fnArgs.length > 2 && !fnArgs[2])) return this.splice377(...arguments);
                    const arr = this.visibleItems;
                    const removed = arr.splice(...fnArgs);
                    const removedCount = removed.length;
                    const addedCount = (fnArgs.length > 2 ? fnArgs.length - 2 : 0);
                    if (fnArgs.length >= 2 && removedCount !== fnArgs[1]) {
                      console.warn(`incorrect splice count. expected = ${fnArgs[1]}; actual = ${removedCount}`);
                    }
                    // console.log('splice')
                    this.proceedStampDomArraySplices381_('visibleItems', 'items', {
                      index: fnArgs[0], addedCount: addedCount, removedCount
                    })
                    return removed;
                  }
                } else {
                  console.warn('0xF0230 Function Signature Changed');
                }

              }              

              mclp.flushActiveItemsFix001_ = function () {

                // fix YouTube wrong code
                // var b = Math.max(this.visibleItems.length + this.activeItems_.length - this.data.maxItemsToDisplay, 0);
                // b && this.splice("visibleItems", 0, b);
                // e.g. 0 + 99 - 90 = 9

                const data = this.data;
                if (!data) return;
                const visibleItems = this.visibleItems;
                const activeItems_ = this.activeItems_;
                if (!visibleItems || !activeItems_) return;
                const viLen = visibleItems.length;
                const aiLen = activeItems_.length;
                const maxDisplayLen = data.maxItemsToDisplay;
                if (!maxDisplayLen) return;
                if (viLen + aiLen > maxDisplayLen) {
                  if (aiLen > maxDisplayLen) activeItems_.splice(0, aiLen - maxDisplayLen);
                  // visibleItems splice done by original flushActiveItems_
                }
              }

              mclp.flushActiveItems3641_ = mclp.flushActiveItems_;

              mclp.__moreItemButtonBlinkingCheck183__ = function () {
                const hasPendingItems = (this.activeItems_ && this.activeItems_.length > 0) ? 1 : 0;
                const shouldChange = (hasMoreMessageState === (1 - hasPendingItems));
                if (shouldChange) {
                  hasMoreMessageState = hasPendingItems;
                  const showMore = (this.$ || 0)['show-more'];
                  if (showMore) {
                    showMore.classList.toggle('has-new-messages-miuzp', hasPendingItems ? true : false);
                  }
                }
              }

              let ps00 = false;
              mclp.flushActiveItems_ = function () {
                if (ps00) return;
                // console.log('flushActiveItems_')
                ps00 = true;
                deferCallback(this, () => {
                  ps00 = false;
                  // console.log('flushActiveItems3641_')
                  if (this.activeItems_.length > 0) {
                    const data = this.data;
                    if (data) {
                      if (data.maxItemsToDisplay > MAX_ITEMS_FOR_TOTAL_DISPLAY) data.maxItemsToDisplay = MAX_ITEMS_FOR_TOTAL_DISPLAY;
                      this.flushActiveItemsFix001_(); // bug fix
                      this.flushActiveItems3641_();
                      if (ENABLE_SHOW_MORE_BLINKER) {
                        this.__moreItemButtonBlinkingCheck183__(); // blink the button if there are activeItems remaining.
                      }
                    }
                  }
                }).catch(console.warn);
              };

              mclp.showNewItems3641_ = mclp.showNewItems_;
              mclp.refreshOffsetContainerHeight3641_ = mclp.refreshOffsetContainerHeight_;
              mclp.maybeScrollToBottom3641_ = mclp.maybeScrollToBottom_;

              let ps01 = false;
              mclp.showNewItems_ = function () {
                if (ps01) return;
                // console.log('showNewItems_')
                ps01 = true;
                deferCallback(this, () => {
                  ps01 = false;
                  this.showNewItems3641_();
                }).catch(console.warn);
              };

              if (!ENABLE_NO_SMOOTH_TRANSFORM && !mclp.refreshOffsetContainerHeight26_) {
                let ps02 = false;
                mclp.refreshOffsetContainerHeight_ = function () {
                  if (ps02) return;
                  // console.log('refreshOffsetContainerHeight_')
                  ps02 = true;
                  deferCallback(this, () => {
                    ps02 = false;
                    this.refreshOffsetContainerHeight3641_();
                  }).catch(console.warn);
                };
              }


              let ps03 = false;
              mclp.maybeScrollToBottom_ = function () {
                if (ps03) return;
                // console.log('maybeScrollToBottom_')
                ps03 = true;
                deferCallback(this, () => {
                  ps03 = false;
                  if (this.atBottom === true) {

                    // if (itemsResizeObserverAttached !== true && this.atBottom === true) {
                    //   // fallback for old browser
                    //   const itemScroller = this.itemScroller || this.$['item-scroller'] || this.querySelector('#item-scroller') || 0;
                    //   if (itemScroller.scrollTop === 0) {
                    //     resizeObserverFallback.observe(itemScroller);
                    //   }
                    // }
                  } else {

                    this.maybeScrollToBottom3641_();
                  }
                }).catch(console.warn);
              };

              mclp.onScrollItems3641_ = mclp.onScrollItems_;
              mclp.maybeResizeScrollContainer3641_ = mclp.maybeResizeScrollContainer_;
              mclp.handleLiveChatActions3641_ = mclp.handleLiveChatActions_;

              let ps11 = false;
              mclp.onScrollItems_ = function (a) {
                if (ps11) return;
                // console.log('onScrollItems_')
                ps11 = true;
                deferCallback(this, () => {
                  ps11 = false;
                  this.onScrollItems3641_(a);
                }).catch(console.warn);
              };

              if (!ENABLE_NO_SMOOTH_TRANSFORM) { // no function for ENABLE_NO_SMOOTH_TRANSFORM
                let ps12 = false;
                mclp.maybeResizeScrollContainer_ = function (a) {
                  if (ps12) return;
                  // console.log('maybeResizeScrollContainer_')
                  ps12 = true;
                  deferCallback(this, () => {
                    ps12 = false;
                    this.maybeResizeScrollContainer3641_(a);
                  }).catch(console.warn);
                };
              }

            }

            console1.log("flushActiveItems_", "OK");
          } else {
            console1.log("flushActiveItems_", "NG");
          }
        }


        if ((_flag0281_ & 0x40) == 0 ) {


          let showBtnLastState = null;
          let lastAtBottomState = null;
          // let showMoreBtnTransitionTrigg = false;
          mclp.atBottomChanged314_ = mclp.atBottomChanged_;
          mclp.atBottomChanged_ = function () {

            const currentAtBottomState = this.atBottom;
            if(lastAtBottomState === currentAtBottomState) return;
            lastAtBottomState = currentAtBottomState;

            // console.log(1289, showMoreBtnTransitionTrigg)

            /*
              if (!this.___btn3848___) {
                this.___btn3848___ = true;
                const btn = ((this || 0).$ || 0)["show-more"] || 0;
                if (btn) {
                  btn.addEventListener('transitionstart', (evt) => {
                    showMoreBtnTransitionTrigg = true;
                    const newVisibility = (this.atBottom === true) ? "hidden" : "visible";
                    if (newVisibility === "visible") {
                      const btn = evt.target;
                      if (btn.style.visibility !== newVisibility) btn.style.visibility = newVisibility;
                    }
                  });
                  btn.addEventListener('transitionend', (evt) => {
                    showMoreBtnTransitionTrigg = true;
                    const newVisibility = (this.atBottom === true) ? "hidden" : "visible";
                    if (newVisibility === "hidden") {
                      const btn = evt.target;
                      if (btn.style.visibility !== newVisibility) btn.style.visibility = newVisibility;
                    }
                  });
                  btn.addEventListener('transitioncancel', (evt) => {
                    showMoreBtnTransitionTrigg = true;
                    const newVisibility = (this.atBottom === true) ? "hidden" : "visible";
                    if (newVisibility === "hidden") {
                      const btn = evt.target;
                      if (btn.style.visibility !== newVisibility) btn.style.visibility = newVisibility;
                    }
                  });
                }
              }
            */

            // btn-show-more-transition
            if (showMoreBtnTransitionTrigg) return;

            const btn = ((this || 0).$ || 0)["show-more"] || 0;
            if (!btn) return this.atBottomChanged314_();

            const showBtnCurrentState = btn.hasAttribute('disabled');
            if (showBtnLastState === showBtnCurrentState) return;
            showBtnLastState = showBtnCurrentState;

            if (this.visibleItems.length === 0) {
              if (this.atBottom === true) {
                btn.setAttribute('disabled', '');
                showBtnLastState = true;
              }
              const newVisibility = (this.atBottom === true) ? "hidden" : "visible";
              if (btn.style.visibility !== newVisibility) btn.style.visibility = newVisibility;
              return;
            }

            nextBrowserTick_(() => {

              if (showMoreBtnTransitionTrigg) return;

              // fallback

              // const isAtBottom = this.atBottom === true;
              // if (isAtBottom) {
              //   if (!this.hideShowMoreAsync_) {
              //     this.hideShowMoreAsync_ = setTimeoutX0(function () {
              //       const btn = ((this || 0).$ || 0)["#show-more"] || 0;
              //       if (btn) btn.style.visibility = "hidden";
              //     }, 200 - 0.125);
              //   }
              // } else {
              //   if (this.hideShowMoreAsync_) {
              //     clearTimeoutX0(this.hideShowMoreAsync_);
              //     this.hideShowMoreAsync_ = null;
              //   }
              //   const btn = ((this || 0).$ || 0)["#show-more"] || 0;
              //   if (btn) btn.style.visibility = "visible";
              // }

              const btn = ((this || 0).$ || 0)["show-more"] || 0;
              const newVisibility = (this.atBottom === true) ? "hidden" : "visible";

              if (newVisibility === "hidden") {
                console.warn('show-more-btn no transition')
              }

              if (btn && btn.style.visibility !== newVisibility) btn.style.visibility = newVisibility;

            });

          };

          
        }



        if ((_flag0281_ & 0x2) == 0) {
          if ((mclp.handleLiveChatActions_ || 0).length === 1) {

            const sfi = fnIntegrity(mclp.handleLiveChatActions_);
            // handleLiveChatActions66_
            if (sfi === '1.40.20') {
              // https://www.youtube.com/s/desktop/c01ea7e3/jsbin/live_chat_polymer.vflset/live_chat_polymer.js


              // f.handleLiveChatActions_ = function(a) {
              //     var b = this;
              //     a.length && (a.forEach(this.handleLiveChatAction_, this),
              //     this.maybeResizeScrollContainer_(a),
              //     this.flushActiveItems_(),
              //     $u(function() {
              //         b.maybeScrollToBottom_()
              //     }))
              // }

            } else if (sfi === '1.39.20') {
              // TBC
            } else if (sfi === '1.31.17') {
              // original
            } else if (mclp.handleLiveChatActions3641_){
              
            } else {
              assertor(() => fnIntegrity(mclp.handleLiveChatActions_, '1.40.20'))
                || logFn('mclp.handleLiveChatActions_', mclp.handleLiveChatActions_)();
            }

            mclp.handleLiveChatActions66_ = mclp.handleLiveChatActions_;

            mclp.handleLiveChatActions_ = function (arr) {
              if ((arr || 0).length >= 1) {
                try {
                  preprocessChatLiveActions(arr);
                } catch (e) {
                  console.warn(e);
                }
                this.handleLiveChatActions66_(arr);
              } else if ((this.activeItems_ || 0).length >= 1) {
                this.flushActiveItems_();
              }
              resistanceUpdateFn_(true);
            }
            console1.log("handleLiveChatActions_", "OK");
          } else {
            console1.log("handleLiveChatActions_", "NG");
          }
        }

        // we do not need to do user interaction check for Boost Chat (0x40000)
        const noScrollToBottomCheckForBoostChat = (_flag0281_ & 0x40000) === 0x40000;

        if (noScrollToBottomCheckForBoostChat === false) {

          mclp.hasUserJustInteracted11_ = () => {
            const t = dateNow();
            return (t - lastWheel < 80) || currentMouseDown || currentTouchDown || (t - lastUserInteraction < 80);
          }

          if ((mclp.canScrollToBottom_ || 0).length === 0 && !mclp.canScrollToBottom157_) {

            assertor(() => fnIntegrity(mclp.canScrollToBottom_, '0.9.5'));

            mclp.canScrollToBottom157_ = mclp.canScrollToBottom_;
            mclp.canScrollToBottom_ = function () {
              return this.canScrollToBottom157_() && !this.hasUserJustInteracted11_();
            }

            console1.log("canScrollToBottom_", "OK");


          } else {
            console1.log("canScrollToBottom_", "NG");
          }

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
          console1.log("ENABLE_NO_SMOOTH_TRANSFORM", "OK");
        } else {
          console1.log("ENABLE_NO_SMOOTH_TRANSFORM", "NG");
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

          if (FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION) console1.log("handleAddChatItemAction_ [ FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION ]", "OK");
        } else {

          if (FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION) console1.log("handleAddChatItemAction_ [ FIX_THUMBNAIL_SIZE_ON_ITEM_ADDITION ]", "OK");
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

          if (FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT) console1.log("handleReplaceChatItemAction_ [ FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT ]", "OK");
        } else {

          if (FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT) console1.log("handleReplaceChatItemAction_ [ FIX_THUMBNAIL_SIZE_ON_ITEM_REPLACEMENT ]", "OK");
        }

        console1.log("[End]");
        groupEnd();

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

          HTMLElement_.prototype.setAttribute.call(dr(this), attrName, v);


        } else {
          HTMLElement_.prototype.setAttribute.apply(dr(this), arguments);
        }

      };


      const fpTicker = (renderer) => {
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

      // const wmList = new Set;

      // true && (new MutationObserver((mutations) => {

      //   const s = new Set();
      //   for (const mutation of mutations) {
      //     if (mutation.type === 'attributes') {
      //       s.add(mutation.target);
      //     }
      //   }
      //   // for (const target of s) {
      //   //   const p = target && target.isConnected === true ? target.getAttribute('q92wb') : '';
      //   //   if (p === '1') {
      //   //     target.setAttribute('q92wb', '2');
      //   //     const cnt = insp(target);
      //   //     const dataId = ((cnt || 0).data || 0).id;
      //   //     if (cnt && typeof cnt.requestRemoval49 === 'function' && dataId) {
      //   //       target.id = dataId;
      //   //       cnt.requestRemoval49();
      //   //       target.setAttribute('q92wb', '3');
      //   //     }
      //   //   } else if (p === '3') {
      //   //     target.setAttribute('q92wb', '4');
      //   //     const cnt = insp(target);
      //   //     const dataId = ((cnt || 0).data || 0).id;
      //   //     if (cnt && typeof cnt.requestRemoval49 === 'function' && dataId) {
      //   //       target.id = dataId;
      //   //       const parentComponent = target.closest('yt-live-chat-ticker-renderer') || cnt.parentComponent;
      //   //       const parentCnt = insp(parentComponent);
      //   //       if(parentComponent && parentCnt && parentCnt.removeTickerItemById){
      //   //         parentCnt.removeTickerItemById(dataId);
      //   //         target.setAttribute('q92wb', '5');
      //   //       }
      //   //     }
      //   //   }
      //   // }
      //   s.clear();

      // })).observe(document, { attributes: true, attributeFilter: ['q92wb'], subtree: true });
      

      Promise.all(tags.map(tag => customElements.whenDefined(tag))).then(() => {

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-ticker-... hacks");
        console1.log("[Begin]");


        let tickerAttachmentId = 0;


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


        const overlayBgMap = new WeakMap();

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


            const hostElement = (this || 0).hostElement;
            if (USE_ADVANCED_TICKING && (this || 0).__isTickerItem58__ && hostElement instanceof HTMLElement_) {
 
              // otherwise the startCountDown not working
              hostElement.style.removeProperty('--ticker-start-time');
              hostElement.style.removeProperty('--ticker-duration-time');

              if (kRef(qWidthAdjustable) === hostElement) {

                // need to update the first ticker
                const q = document.querySelector('.r6-width-adjustable');
                if (q instanceof HTMLElement_ && q.classList.contains('r6-width-adjustable-f')) {
                  q.classList.remove('r6-width-adjustable-f');
                }
                qWidthAdjustable = mWeakRef(q);

              }
            }

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
            this.__ticker_attachmentId__ = tickerAttachmentId = (tickerAttachmentId & 1073741823) + 1;

            const hostElement = (this || 0).hostElement;
            if (USE_ADVANCED_TICKING && (this || 0).__isTickerItem58__ && hostElement instanceof HTMLElement_) {
              const prevElement = kRef(qWidthAdjustable);
              if (prevElement instanceof HTMLElement_) {
                prevElement.classList.add('r6-width-adjustable-f');
              }
              if (hostElement.__fgvm573__) {
                hostElement.classList.remove('r6-closing-ticker');
                hostElement.classList.remove('r6-width-adjustable-f');
              } else {
                hostElement.__fgvm573__ = 1;
                hostElement.classList.add('r6-width-adjustable');
              }
              qWidthAdjustable = mWeakRef(hostElement);
            }


            fpTicker(hostElement || this);
            return this.attached77();

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




          /** @type {()} */
          handlePauseReplayForPlaybackProgressState: function () {
            if (!playerEventsByIframeRelay) return this.handlePauseReplay66.apply(this, arguments);

            const attachementId = this.__ticker_attachmentId__;
            if(!attachementId) return;

            const jr = mWeakRef(this);

            if (onPlayStateChangePromise) {

              const tid = this._Y7rtu = (this._Y7rtu & 1073741823) + 1;

              onPlayStateChangePromise.then(() => {
                const cnt = kRef(jr) || 0;
                if (attachementId !== cnt.__ticker_attachmentId__) return;
                if (cnt.isAttached) {
                  if (tid === cnt._Y7rtu && !onPlayStateChangePromise && typeof cnt.handlePauseReplay === 'function' && cnt.hostElement) cnt.handlePauseReplay.apply(cnt, arguments);
                  // this.handlePauseReplay can be undefined if it is memory cleaned
                }
              });

              return;
            }

            if (playerState !== 2) return;
            if (this.isAttached) {
              const tid = this._Y7rtk = (this._Y7rtk & 1073741823) + 1;
              const tc = relayCount;
              foregroundPromiseFn().then(() => {
                const cnt = kRef(jr);
                if (attachementId !== (cnt || 0).__ticker_attachmentId__) return;
                if (cnt.isAttached) {
                  if (tid === cnt._Y7rtk && tc === relayCount && playerState === 2 && _playerState === playerState && cnt.hostElement) {
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

              const tid = this._Y7rtv = (this._Y7rtv & 1073741823) + 1;

              onPlayStateChangePromise.then(() => {
                const cnt = kRef(jr);
                if(attachementId !== (cnt || 0).__ticker_attachmentId__) return;
                if (tid === cnt._Y7rtv && !onPlayStateChangePromise && typeof cnt.handleResumeReplay === 'function' && cnt.hostElement) cnt.handleResumeReplay.apply(cnt, arguments);
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
                if(attachementId !== (cnt || 0).__ticker_attachmentId__) return;
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
              const tid = this._Y7rtk = (this._Y7rtk & 1073741823) + 1;
              const jr = mWeakRef(kRef(this));
              foregroundPromiseFn().then(() => {
                const cnt = kRef(jr);
                if(attachementId !== (cnt || 0).__ticker_attachmentId__) return;
                if (cnt.isAttached) {
                  if (tid === cnt._Y7rtk && cnt.hostElement) {
                    cnt.handleReplayProgress66(a);
                  }
                }
              })
            }
          }


        }



        const isTickerItemsScrolling = function () {
          const elm = document.querySelector('#ticker-bar.yt-live-chat-ticker-renderer');
          if (!elm) return false;
          return (elm.scrollLeft > 0);
        }




        const u37fn = function (cnt) {

          if (cnt.__dataEnabled === false || cnt.__dataInvalid === true) return;

          if (!__LCRInjection__) {
            console.error('[yt-chat] USE_ADVANCED_TICKING fails because of no __LCRInjection__');
          }

          const cntData = ((cnt || 0).__data || 0).data || (cnt || 0).data || 0;
          if (!cntData) return;
          const cntElement = cnt.hostElement;
          if (!(cntElement instanceof HTMLElement_)) return;

          const duration = (cntData.fullDurationSec || cntData.durationSec || 0);

          let ct;

          if (__LCRInjection__ && cntData && duration > 0 && !('__progressAt__' in cntData)) {
            ct = Date.now();

            if (!cntData.__timestampActionRequest__) {
              console.log(' 5688001 ');
              // console.log(`(5688001) ${new Error().stack}`);
            }
            cntData.__liveTimestamp__ = ((cntData.__timestampActionRequest__ || ct) / 1000 - timeOriginDT) || Number.MIN_VALUE;
            timestampUnderLiveMode = true;
          } else if (__LCRInjection__ && cntData && duration > 0 && cntData.__progressAt__ > 0) {
            timestampUnderLiveMode = false;
          }
          // console.log(48117007, cntData)

          let tk = cntData.__progressAt__ || cntData.__liveTimestamp__;

          if (!tk) {
            console.log('time property is not found', !!__LCRInjection__, !!cntData, !!(duration > 0), !('__progressAt__' in cntData), cntData.__progressAt__, cntData.__liveTimestamp__);
            return;
          }



          const liveOffsetMs = ct > 0 && cntData.__timestampActionRequest__ > 0 ? ct - cntData.__timestampActionRequest__ : 0;

          // console.log(1237, liveOffsetMs, cntData.durationSec)

          if (liveOffsetMs > 0) {
            cntData.durationSec -= Math.floor(liveOffsetMs / 1000);
            if (cntData.durationSec < 0) cntData.durationSec = 0;
            // console.log(1238, liveOffsetMs, cntData.durationSec)
            if (!cntData.durationSec) {
              try {
                cnt.requestRemoval();
              } catch (e) { }
              return;
            }
          }


          let offset = cntData.fullDurationSec - cntData.durationSec; // consider this is live replay video, offset can be > 0
          if (offset > 0) tk -= offset;
          // in livestreaming. tk can be negative as we use performance.timeOrigin for t=0s time frame



          const existingOverlaySelector = `ticker-bg-overlay[ticker-id="${cnt.__ticker_attachmentId__}"]`;

          const q = kRef(overlayBgMap.get(cnt));

          let r = valAssign(cntElement, '--ticker-start-time', tk);

          if ((r || !q || q.isConnected === false) && duration > 0) {

            // t0 ...... 1 ... fullDurationSec
            // tk ...... k ... fullDurationSec-durationSec
            // t0-fullDurationSec ...... 0 ... 0

            // now - (fullDurationSec-durationSec)


            // update dntElementWeak
            const dnt = cnt.parentComponent;
            const dntElement = dnt ? dnt.hostElement || dnt : 0;
            if (dntElement) {
              dntElementWeak = mWeakRef(dntElement);
              resistanceUpdateBusy = false;
              if (!startResistanceUpdaterStarted) startResistanceUpdater();
              else updateTickerCurrentTime();
            }


            // create overlay if needed
            if (!cntElement.querySelector(existingOverlaySelector)) {

              // remove if any
              const oldElement = cntElement.querySelector('ticker-bg-overlay');
              if (oldElement) oldElement.remove();

              // use advancedTicking, ticker enabled
              cnt.__advancedTicking038__ = 1;

              const em = q || document.createElement('ticker-bg-overlay');

              overlayBgMap.set(cnt, mWeakRef(em));
              // const ey = document.createElement('ticker-bg-overlay-end');
              const wy = document.createElement('ticker-bg-overlay-end2');

              const cr1 = cnt.colorFromDecimal(cntData.startBackgroundColor);
              const cr2 = cnt.colorFromDecimal(cntData.endBackgroundColor);

              const container = cnt.$.container;

              em.setAttribute('ticker-id', `${cnt.__ticker_attachmentId__}`);

              const tid = `ticker-${cnt.__ticker_attachmentId__}-${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;

              em.id = `${tid}-b`;
              em.style.background = `linear-gradient(90deg, ${cr1},${cr1} 50%,${cr2} 50%,${cr2})`;

              if (!(container instanceof HTMLElement_)) {
                // em.insertBefore(ey, em.firstChild);
                insertBeforeNaFn(cntElement, em, cntElement.firstChild); // cntElement.insertBefore(em, cntElement.firstChild);
                cntElement.style.borderRadius = '16px';
                container.style.borderRadius = 'initial';
              } else {
                // em.insertBefore(ey, em.firstChild);
                insertBeforeNaFn(container, em, container.firstChild); // container.insertBefore(em, container.firstChild);
              }

              // em.style.left = '-50%';
              // em.style.left = "clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%)";

              if (container instanceof HTMLElement_) {

                container.style.background = 'transparent';
                container.style.backgroundColor = 'transparent';
                // container.style.zIndex = '1';
              }
              // em.style.zIndex = '-1';
              valAssign(cntElement, '--ticker-duration-time', duration)

              valAssign(wy, '--ticker-start-time', tk);
              valAssign(wy, '--ticker-duration-time', duration);
              wy.id = `${tid}-e`;

              appendChildNaFn(dntElement, wy);

              // if (wio instanceof IntersectionObserver) {
              //   wio.observe(ey);
              // }

              const wio2 = dProto.wio2;
              if (wio2 instanceof IntersectionObserver) {
                wio2.observe(wy);
              }

            }
          }
        };



        const timeFn749 = (cnt) => {
          cnt = kRef(cnt);
          if (!cnt) return;
          if (cnt.__startCountdownAdv477__ < 0) return;
          if (!cnt.__startCountdownAdv477__) {
            cnt.__startCountdownAdv477__ = Date.now();
            if (cnt.__advancedTicking038__ === 2) cnt.__advancedTicking038__ = 1;
          }

          if (
            cnt
            && (cnt.hostElement && cnt.isAttached && cnt.hostElement.isConnected)
            && cnt.parentComponent // startCountdown is triggered by dataChanged; // not yet attached to the actual dom tree
            && cnt.__ticker_attachmentId__
          ) {

            const data = cnt.data;
            const dataId = data ? ((cnt || 0).data || 0).id : null;
            const elemId = ((cnt || 0).hostElement || 0).id;

            if (dataId && dataId === elemId) {

              const attachId = cnt.__ticker_attachmentId__;
              const uid = `${attachId}!${dataId}`;

              if (data.__wsi6c__ !== uid) {
                data.__wsi6c__ = uid;
                Promise.resolve(cnt).then(u37fn);
                return true;
              }

            }

          }

          return false;
        }

        let tagI = 0;
        for (const tag of tagsItemRenderer) { // ##tag##

          tagI++;

          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console1.warn(`proto.attached for ${tag} is unavailable.`);
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
            if (!isTimingFunctionHackable) console1.log('isTimingFunctionHackable = false');
            withTimerFn_ = isTimingFunctionHackable ? 2 : 1;
          } else {
            let flag = 0;
            if (typeof cProto.startCountdown === 'function') flag |= 1;
            if (typeof cProto.updateTimeout === 'function') flag |= 2;
            if (typeof cProto.isAnimationPausedChanged === 'function') flag |= 4;

            console1.log(`Skip Timing Function Modification[#${tagI}]: ${flag} / ${1 + 2 + 4}`, ` ${tag}`);
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
                assertor(() => fnIntegrity(cProto.handlePauseReplay, '0.8.2'));
              }
            } else {
              if (withTimerFn_ > 0) console1.log('Error for setting cProto.handlePauseReplay', tag)
            }

            if (typeof cProto.handleResumeReplay === 'function' && !cProto.handleResumeReplay66 && cProto.handleResumeReplay.length === 0) {
              urt++;
              assertor(() => fnIntegrity(cProto.handleResumeReplay, '0.8.2'));
            } else {
              if (withTimerFn_ > 0) console1.log('Error for setting cProto.handleResumeReplay', tag)
            }

            if (typeof cProto.handleReplayProgress === 'function' && !cProto.handleReplayProgress66 && cProto.handleReplayProgress.length === 1) {
              urt++;
              assertor(() => fnIntegrity(cProto.handleReplayProgress, '1.16.13'));
            } else {
              if (withTimerFn_ > 0) console1.log('Error for setting cProto.handleReplayProgress', tag)
            }



          }

          const ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED = ENABLE_VIDEO_PLAYBACK_PROGRESS_STATE_FIX && urt === 3 && (SKIP_VIDEO_PLAYBACK_PROGRESS_STATE_FIX_FOR_NO_TIMEFX ? (withTimerFn_ > 0) : true);
          cProto.__ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED__ = ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED;

          if (ENABLE_VIDEO_PROGRESS_STATE_FIX_AND_URT_PASSED) {

            cProto._Y7rtk = 0;
            cProto._Y7rtu = 0;
            cProto._Y7rtv = 0;

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
            if (!USE_ADVANCED_TICKING && typeof cProto.setContainerWidth === 'function' && !cProto.setContainerWidth55 && cProto.setContainerWidth.length === 0) {
              cProto.setContainerWidth55 = cProto.setContainerWidth;
              cProto.setContainerWidth = dProto.setContainerWidthNoSelfLeakage;
              flgLeakageFixApplied |= 4;
            }
            if (!USE_ADVANCED_TICKING && typeof cProto.slideDown === 'function' && !cProto.slideDown55 && cProto.slideDown.length === 0) {
              cProto.slideDown55 = cProto.slideDown;
              cProto.slideDown = dProto.slideDownNoSelfLeakage;
              flgLeakageFixApplied |= 8;
            }
            if (!USE_ADVANCED_TICKING && typeof cProto.collapse === 'function' && !cProto.collapse55 && cProto.collapse.length === 0) {
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

          const flgTotal = USE_ADVANCED_TICKING ?  1 + 2 + 32 : 1 + 2 + 4 + 8 + 16 + 32;

          console1.log(`FIX_MEMORY_LEAKAGE_TICKER_[#${tagI}]: ${flgLeakageFixApplied} / ${flgTotal}`, cProto.is);

          // ------------- FIX_MEMORY_LEAKAGE_TICKER_TIMER -------------



          const canDoAdvancedTicking = 1 &&
            ATTEMPT_TICKER_ANIMATION_START_TIME_DETECTION &&
            typeof cProto.startCountdown === 'function' && !cProto.startCountdown49 && cProto.startCountdown.length === 2 &&
            typeof cProto.updateTimeout === 'function' && !cProto.updateTimeout49 && cProto.updateTimeout.length === 1 &&
            typeof cProto.isAnimationPausedChanged === 'function' && !cProto.isAnimationPausedChanged49 && cProto.isAnimationPausedChanged.length === 2 &&
            typeof cProto.setContainerWidth === 'function' && cProto.setContainerWidth.length === 0 &&
            typeof cProto.requestRemoval === 'function' && !cProto.requestRemoval49 && cProto.requestRemoval.length === 0
            CSS.supports("left","clamp(-100%, calc( -100% * ( var(--ticker-current-time) - var(--ticker-start-time) ) / var(--ticker-duration-time) ), 0%)");



          if (USE_ADVANCED_TICKING && canDoAdvancedTicking && ENABLE_TICKERS_BOOSTED_STAMPING) {
            // startResistanceUpdater();
            // live replay video ->   48117005 -> 48117006 keep fire.  ->48117007 0 -> 48117007 {...}
            // live stream video -> 48117007 0 -> 48117007 YES

            document.documentElement.setAttribute('r6-advanced-ticking', '');
            console1.log(`USE_ADVANCED_TICKING[#${tagI}]::START`)

            const wio2 = dProto.wio2 || (dProto.wio2 = new IntersectionObserver((mutations) => {

              for (const mutation of mutations) {
                if (mutation.isIntersecting) {

                  const marker = mutation.target;
                  let endId = marker.id
                  if (!endId) continue;
                  let tid = endId.substring(0, endId.length - 2);
                  if (!tid) continue;
                  // let bId = `${tid}-b`;
                  const bgElm = document.querySelector(`#${tid}-b`);
                  if (!bgElm) continue;
                  const overlay = bgElm;

                  wio2.unobserve(marker);
                  marker.remove();
                  let p = overlay || 0;
                  let cn = 4;
                  while ((p = p.parentElement) instanceof HTMLElement_) {
                    if (p instanceof HTMLElement_) {
                      const cnt = insp(p);
                      if (cnt && typeof cnt.slideDown === 'function' && typeof cnt.setContainerWidth === 'function' && cnt.__advancedTicking038__ === 1) {

                        cnt.__advancedTicking038__ = 2;

                        let deletionMode = false;
                        const cntData = ((cnt || 0).__data || 0).data || (cnt || 0).data || 0;
                        if (timestampUnderLiveMode && cntData && cntData.durationSec > 0 && cntData.__timestampActionRequest__ > 0) {

                          // time choose - 0.2s for transition (slideDown sliding-down)
                          // 60hz = 17ms
                          // choose 0.28s
                          const targetFutureTime = cntData.__timestampActionRequest__ + cntData.durationSec * 1000;
                          // check whether the targetFutureTime is already the past
                          if (targetFutureTime + 280 < Date.now()) {
                            // just dispose
                            deletionMode = true;
                          }
                        } else if (__LCRInjection__ && !timestampUnderLiveMode && cntData && cntData.durationSec > 0 && cntData.__progressAt__ > 0) {

                          const targetFutureTime = (cntData.__progressAt__ + cntData.durationSec);
                          // check whether the targetFutureTime is already the past
                          if (targetFutureTime + 0.28 < playerProgressChangedArg1) {
                            // just dispose
                            deletionMode = true;
                          }


                        }


                        if (deletionMode) {
                          __requestRemoval__(cnt);
                        } else {

                          const w = cnt.hostElement.style.width;
                          if (w === "auto" || w === "") cnt.setContainerWidth();
                          cnt.slideDown();
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

              // console.log(mutations);
            }, {

              rootMargin: '0px',
              threshold: [1]

            }));



            cProto.__isTickerItem58__ = 1;
            cProto.attached747 = cProto.attached;
            cProto.attached = function () {
              const hostElement = (this || 0).hostElement;
              // if (hostElement && hostElement.hasAttribute('q92wb')) hostElement.removeAttribute('q92wb');
              storeTickerIdInc761(this.hostElement?.id);
              const d = this.data;
              if (d) {
                storeTickerIdInc761(d.id);
                if (d.__tickerRemovingId761__) d.__tickerRemovingId761__ = undefined;
                d.__stampp761__ = stampProcessId761_ || undefined;
              }
              if (hostElement && hostElement.__requestRemovalAt003__) hostElement.__requestRemovalAt003__ = 0;
              if (this.__startCountdownAdv477__ < 0) this.__startCountdownAdv477__ = 0;
              Promise.resolve().then(() => {
                if (this.hostElement && this.isAttached && this.hostElement.isConnected && this.parentComponent) {
                  if (this.__startCountdownAdv477__ > 0) Promise.resolve(this).then(timeFn749);
                }
              }).catch(console.warn);
              return this.attached747();
            };
            
            cProto.startCountdown = dProto.startCountdownAdv || (dProto.startCountdownAdv = function (a, b) {


              timeFn749(this);

             

            });

            cProto.updateTimeout = dProto.updateTimeoutAdv || (dProto.updateTimeoutAdv = function (a) {



            });

            cProto.isAnimationPausedChanged = dProto.isAnimationPausedChangedAdv || (dProto.isAnimationPausedChangedAdv = function (a, b) {



            });


            if (typeof cProto.slideDown === 'function' && !cProto.slideDown43 && cProto.slideDown.length === 0) {

              cProto.slideDown43 = cProto.slideDown;
              cProto.slideDown = dProto.slideDownAdv || (dProto.slideDownAdv = async function () {
                if (this.__startCountdownAdv477__ < 0) return;

                // console.log('calling slideDown', Date.now())
                if (this.__advancedTicking038__) {

                  if (this.__advancedTicking038__ === 1) this.__advancedTicking038__ = 2; // ignore intersectionobserver detection


                  const hostElement = this.hostElement;
                  const container = this.$.container;

                  const parentComponentCnt = insp(this.parentComponent);
                  const parentComponentElm = parentComponentCnt? parentComponentCnt.hostElement : null;

                  if (hostElement instanceof HTMLElement_ && container instanceof HTMLElement_ && parentComponentElm instanceof HTMLElement_) {
                    // const prevTransitionClosingElm = kRef(prevTransitionClosing);
                    // if (prevTransitionClosingElm !== hostElement) {
                    //   prevTransitionClosingElm && prevTransitionClosingElm.classList.add('ticker-no-transition-time');
                    //   prevTransitionClosing = mWeakRef(hostElement);
                    // }
                    // if (hostElement.classList.contains('ticker-no-transition-time')) hostElement.classList.remove('ticker-no-transition-time');
                    hostElement.classList.add('r6-closing-ticker');

                    if (!transitionEndHooks.has(parentComponentElm)) {
                      transitionEndHooks.add(parentComponentElm);
                      document.addEventListener('transitionend', transitionEndAfterFn, passiveCapture);
                    }

                    const pr = new PromiseExternal();
                    transitionEndAfterFnSimple.set(hostElement, pr);
                    transitionEndAfterFnSimple.set(container, pr);
                    transitionEndAfterFnSimpleEnable++;
                    hostElement.classList.add("sliding-down");
                    await pr.then();
                    transitionEndAfterFnSimpleEnable--;
                    transitionEndAfterFnSimple.delete(hostElement);
                    transitionEndAfterFnSimple.delete(container);
                    if (this && this.hostElement instanceof HTMLElement_) {

                      this.collapse();
                    }
                    return;
                  }
                }
                this.slideDown43();

              });


              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::slideDown - OK`)
            } else {

              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::slideDown - NG`)
            }


            if (typeof cProto.collapse === 'function' && !cProto.collapse43 && cProto.collapse.length === 0) {
              cProto.collapse43 = cProto.collapse;
              cProto.collapse = dProto.collapseAdv || (dProto.collapseAdv = async function () {


                if (this.__advancedTicking038__) {


                  if (this.__advancedTicking038__ === 1) this.__advancedTicking038__ = 2; // ignore intersectionobserver detection


                  const hostElement = this.hostElement;
                  const container = this.$.container;

                  const parentComponentCnt = insp(this.parentComponent);
                  const parentComponentElm = parentComponentCnt ? parentComponentCnt.hostElement : null;

                  if (hostElement instanceof HTMLElement_ && container instanceof HTMLElement_ && parentComponentElm instanceof HTMLElement_) {
                    // const prevTransitionClosingElm = kRef(prevTransitionClosing);
                    // if (prevTransitionClosingElm !== hostElement) {
                    //   prevTransitionClosingElm && prevTransitionClosingElm.classList.add('ticker-no-transition-time');
                    //   prevTransitionClosing = mWeakRef(hostElement);
                    // }
                    // if (hostElement.classList.contains('ticker-no-transition-time')) hostElement.classList.remove('ticker-no-transition-time');
                    hostElement.classList.add('r6-closing-ticker');

                    if (!transitionEndHooks.has(parentComponentElm)) {
                      transitionEndHooks.add(parentComponentElm);
                      document.addEventListener('transitionend', transitionEndAfterFn, passiveCapture);
                    }

                    const pr = new PromiseExternal();
                    transitionEndAfterFnSimple.set(hostElement, pr);
                    transitionEndAfterFnSimple.set(container, pr);
                    transitionEndAfterFnSimpleEnable++;
                    hostElement.classList.add("collapsing");
                    hostElement.style.width = "0";
                    await pr.then();
                    transitionEndAfterFnSimpleEnable--;
                    transitionEndAfterFnSimple.delete(hostElement);
                    transitionEndAfterFnSimple.delete(container);
                    if (this && this.hostElement instanceof HTMLElement_) {

                      this.requestRemoval();
                    }

                    return;
                  }


                }
                this.collapse43();


              });

              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::collapse - OK`)
            } else {

              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::collapse - NG`)
            }



            if (typeof cProto.requestRemoval === 'function' && !cProto.requestRemoval49 && !cProto.__requestRemovalPre48__ && cProto.requestRemoval.length === 0) {

              cProto.requestRemoval49 = cProto.requestRemoval;
              cProto.__requestRemovalPre48__ = function (){

                if (this.__startCountdownAdv477__ < 0) return;
                this.__startCountdownAdv477__ = -1;
                const hostElement = this.hostElement;
                hostElement.__requestRemovalAt003__ = Date.now();
                if (this.__advancedTicking038__) {
                  try {
                    const overlayBg = hostElement.querySelector('ticker-bg-overlay[id]');
                    if (overlayBg) {
                      const overlayBgId = overlayBg.id;
                      const tid = overlayBgId ? overlayBgId.substring(0, overlayBgId.length - 2) : '';
                      const endElm = tid ? document.querySelector(`#${tid}-e`) : null;
                      if (endElm) {
                        wio2.unobserve(endElm);
                        endElm.remove();
                      }
                    }
                  } catch (e) { }
                  this.__advancedTicking038__ = 2;
                  // console.log('requestRemoval!!')
                  if (hostElement instanceof HTMLElement_) {
                    // otherwise the startCountDown not working
                    hostElement.style.removeProperty('--ticker-start-time');
                    hostElement.style.removeProperty('--ticker-duration-time');
                  }
                  if (REUSE_TICKER) {
                    const cntData = this.data;
                    if (hostElement instanceof HTMLElement_ && cntData.id && cntData.fullDurationSec && !hostElement.hasAttribute('__reuseid__')) {
                      hostElement.setAttribute('__reuseid__', reuseId);
                      hostElement.setAttribute('__nogc__', ''); // provided to leakage detection script
                      // this.__markReuse13__ = true;
                      reuseStore.set(`<${this.is}>${cntData.id}:${cntData.fullDurationSec}`, mWeakRef(this));
                    }
                  }
                }
                if (hostElement instanceof HTMLElement_) {
                  // try {
                  //   // hostElement.remove();

                  //   if (!hostElement.classList.contains('ticker-no-transition-time')) hostElement.classList.add('ticker-no-transition-time');
                  // } catch (e) { }

                  try {

                    hostElement.classList.remove('r6-closing-ticker');
                    hostElement.classList.remove('r6-width-adjustable-f');
                  } catch (e) { }

                  // if(ADVANCED_TICKING_MEMORY_CLEAN_FOR_REMOVAL){
                  //   const wr = mWeakRef(hostElement);
                  //   const wf = ()=>{
                  //     const element = kRef(wr);
                  //     if(!element) {
                  //       console.log('[yt-chat-removalrequest] element was memory cleaned.');
                  //       return;
                  //     }

                  //     setTimeout(wf, 8000);
                  //     if(element.isConnected){
                  //       console.log('[yt-chat-removalrequest] element is still connected to DOM Tree.');
                  //       return;
                  //     }

                  //     const cnt = insp(element)
                  //     if(typeof cnt.requestRemoval !== 'function'){

                  //       console.log('[yt-chat-removalrequest] element is not connected to cnt.');
                  //       return;
                  //     }
                  //     console.log('[yt-chat-removalrequest] element is not GC.');
                  //     try{
                  //     cnt.data = null;
                  //     }catch(e){}

                  //     Object.setPrototypeOf(cnt, Object.prototype);
                  //     for(const k of Object.getOwnPropertyNames(cnt)){
                  //       try{
                  //       cnt[k] = null;
                  //       }catch(e){}

                  //       try{
                  //         delete cnt[k];
                  //         }catch(e){}
                  //     }


                  //     for(const k of Object.getOwnPropertySymbols(cnt)){
                  //       try{
                  //       cnt[k] = null;
                  //       }catch(e){}

                  //       try{
                  //         delete cnt[k];
                  //         }catch(e){}
                  //     }

                  //   }
                  //   setTimeout(wf, 8000);
                  // }

                  // hostElement.setAttribute('q92wb', '1');
                }
              };
              cProto.requestRemoval = dProto.requestRemovalAdv || (dProto.requestRemovalAdv = function () {
                try {
                  this.__requestRemovalPre48__();
                } catch (e) {
                  console.warn(e);
                }
                return this.requestRemoval49();
              });


              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::requestRemoval - OK`)
            } else {

              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::requestRemoval - NG`)
            }


            if (typeof cProto.computeContainerStyle === 'function' && !cProto.computeContainerStyle49 && cProto.computeContainerStyle.length === 2) {
              cProto.computeContainerStyle49 = cProto.computeContainerStyle;
              cProto.computeContainerStyle = dProto.computeContainerStyleAdv || (dProto.computeContainerStyleAdv = function (a, b) {
                if (this.__advancedTicking038__) {
                  return "";
                }
                return this.computeContainerStyle49(a, b);
              });


              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::computeContainerStyle - OK`)
            } else {

              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::computeContainerStyle - NG`)
            }



            if(ENABLE_TICKERS_BOOSTED_STAMPING && DISABLE_DYNAMIC_TICKER_WIDTH && typeof cProto.updateWidthOnDataChanged === 'function' && cProto.updateWidthOnDataChanged.length === 0 && !cProto.updateWidthOnDataChanged41){

              cProto.updateWidthOnDataChanged41 = cProto.updateWidthOnDataChanged;
              cProto.updateWidthOnDataChanged = dProto.updateWidthOnDataChangedAdv || (dProto.updateWidthOnDataChangedAdv = function(){
              
                const style = this.hostElement.style;
                style.width = "";
                style.overflow = "";
              });

            }


            if (!cProto.setStandardContainerWidth8447) {
              cProto.setStandardContainerWidth8447 = dProto.setStandardContainerWidthAdv || (dProto.setStandardContainerWidthAdv =  async function (kName) {
                if (this.__startCountdownAdv477__ < 0) return;
                if (this.__startCountdownAdv477__ > 0) Promise.resolve(this).then(timeFn749);

                const hostElement = (this || 0).hostElement;
                const container = this.$.container;

                let qw = null;
                let qt = '';

                {

                  let maxC = 4;

                  for (let p = qt = hostElement.getAttribute('r6-ticker-width') || ''; maxC--;) {

                    const ed = `${hostElement.id}`
                    if (!p || !p.startsWith(`${ed}::`)) {

                      const w = hostElement.style.width;
                      if (w !== '' && w !== 'auto') hostElement.style.width = 'auto';

                      const res = await widthReq(container);

                      if (res.width < 1 || !Number.isFinite(res.width)) {
                        // just skip due to iron-page hidden
                        return;
                      }

                      hostElement.setAttribute('r6-ticker-width', p = qt = `${ed}::${(res.width).toFixed(2)}`);

                    } else {
                      qw = p.split('::');
                      break;
                    }

                  }

                }

                if (!qw) {

                  console.log('container width failure');
                  if(kName === 'setContainerWidth') this.setContainerWidth41(); else this.setRevampContainerWidth41();
                  return; // failure
                }


                const shouldAnimateIn = ((this || 0).ytLiveChatTickerItemBehavior || 0).shouldAnimateIn || (this || 0).shouldAnimateIn || false;
                if (shouldAnimateIn) {

                  stackDM(async () => {

                    if (hostElement.getAttribute('r6-ticker-width') !== qt || hostElement.isConnected !== true) return;
                    if (hostElement.previousElementSibling || isTickerItemsScrolling()) {

                      hostElement.style.width = `${qw[1]}px`;

                    } else {

                      const w = hostElement.style.width;
                      if (w !== '0px' && w !== '0') hostElement.style.width = '0';

                      await widthReq(container);

                      hostElement.style.width = `${qw[1]}px`;
                    }


                  });


                } else {


                  stackDM(async () => {



                    if (hostElement.getAttribute('r6-ticker-width') !== qt || hostElement.isConnected !== true) return;

                    hostElement.style.width = `${qw[1]}px`;

                  });
                }



              });
            }

            if (typeof cProto.setRevampContainerWidth === 'function' && !cProto.setRevampContainerWidth41 && cProto.setRevampContainerWidth.length === 0 && typeof cProto.setStandardContainerWidth8447 === 'function' && cProto.setStandardContainerWidth8447.length === 1) {
              cProto.setRevampContainerWidth41 = cProto.setRevampContainerWidth;
              if (ENABLE_TICKERS_BOOSTED_STAMPING && DISABLE_DYNAMIC_TICKER_WIDTH) {

                cProto.setRevampContainerWidth = dProto.setRevampContainerWidthAdv || (dProto.setRevampContainerWidthAdv = async function () {
                  if (this.__startCountdownAdv477__ < 0) return;
                  const hostElement = this.hostElement;
                  if (((hostElement || 0).style || 0).width) hostElement.style.width = '';
                  return;
                });

              } else {



                cProto.setRevampContainerWidth = dProto.setRevampContainerWidthAdv || (dProto.setRevampContainerWidthAdv = async function () {

                  // not sure the reason for auto instead of pixel.
                  // this is a new function in Dec 2024, but not mainly adopted in the coding yet

                  /*
  
  
                          var a = this;
                          (R(this.hostElement).querySelector("#container").clientWidth || 0) === 0 ? (this.hostElement.style.overflow = "visible",
                          this.hostElement.style.width = "auto") : (this.hostElement.style.overflow = "hidden",
                          this.ytLiveChatTickerItemBehavior.shouldAnimateIn ? (this.hostElement.style.width = "0",
                          Zu(function() {
                              a.hostElement.style.width = "auto"
                          }, 1)) : this.hostElement.style.width = "auto")
  
                  */


                  return this.setStandardContainerWidth8447('setRevampContainerWidth');

                });
              }


              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::setRevampContainerWidth - OK`)
            } else {

              DEBUG_skipLog001 || console1.log(`USE_ADVANCED_TICKING[#${tagI}]::setRevampContainerWidth - NG (acceptable)`)
            }


            if (typeof cProto.setContainerWidth === 'function' && !cProto.setContainerWidth41 && cProto.setContainerWidth.length === 0 && typeof cProto.setStandardContainerWidth8447 === 'function' && cProto.setStandardContainerWidth8447.length === 1) {
              cProto.setContainerWidth41 = cProto.setContainerWidth;

              if (ENABLE_TICKERS_BOOSTED_STAMPING && DISABLE_DYNAMIC_TICKER_WIDTH) {

                cProto.setContainerWidth = dProto.setContainerWidthAdv || (dProto.setContainerWidthAdv = async function () {
                  if (this.__startCountdownAdv477__ < 0) return;
                  const hostElement = this.hostElement;
                  if (((hostElement || 0).style || 0).width) hostElement.style.width = '';
                  return;
                });

              } else {

                cProto.setContainerWidth = dProto.setContainerWidthAdv || (dProto.setContainerWidthAdv = async function () {



                  /*
  
  
                    var a = this
                      , b = R(this.hostElement).querySelector("#container").clientWidth || 0;
                    b === 0 ? (this.hostElement.style.overflow = "visible",
                    this.hostElement.style.width = "auto") : (this.hostElement.style.overflow = "hidden",
                    this.shouldAnimateIn ? (this.hostElement.style.width = "0",
                    Zu(function() {
                        a.hostElement.style.width = b + "px"
                    }, 1)) : this.hostElement.style.width = b + "px")
  
                  */
  
                  return this.setStandardContainerWidth8447('setContainerWidth');

                });

              }



              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::setContainerWidth - OK`)
            } else {


              console1.log(`USE_ADVANCED_TICKING[#${tagI}]::setContainerWidth - NG`)
            }




          } else if (USE_ADVANCED_TICKING) {
            console1.log(`USE_ADVANCED_TICKING[#${tagI}] is not injected.`);
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

        console1.log("[End]");
        groupEnd();


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

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-ticker-renderer hacks");
        console1.log("[Begin]");
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
            console1.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          const findObjWithId = (obj) => {
            while (obj && typeof obj === "object") {
              if (typeof obj.id === "string") return obj;
              const key = firstObjectKey(obj);
              if (!key) break;
              obj = obj[key];
            }
            return null;
          };

          let mDelCount = 0;

          let removingSet761 = new WeakSet();

          if (FIX_REMOVE_TICKER_ITEM_BY_ID && typeof cProto.splice === 'function' && typeof cProto.markDirty === 'function' && typeof cProto.removeTickerItemById === 'function' && !cProto.removeTickerItemById737 && !cProto.__removeDelayed722__) {
            cProto.removeTickerItemById737 = cProto.removeTickerItemById;
            cProto.__removeDelayed722__ = function () {
              const removingSet = removingSet761;
              removingSet761 = new WeakSet();
              if (!mDelCount) return;
              mDelCount = 0;
              const stampProcessId761 = stampProcessId761_ || false; // check whether it is added with the same stamping process
              if (!this || !this.splice || !this.markDirty || !this.tickerItems?.length) return;
              let dirty = false;
              const tickerItems = this.tickerItems;
              const store761 = storeTickerIds761;
              for (let i = tickerItems.length - 1; i >= 0; i--) {
                if (removingSet.delete(tickerItems[i]) === true) {
                  const obj = findObjWithId(tickerItems[i]);
                  if (!obj) continue;
                  const trr761 = obj.__tickerRemovingId761__;
                  if (!trr761) continue;
                  obj.__tickerRemovingId761__ = undefined;
                  const dataId = obj.id;
                  if (trr761 === `${dataId}::${store761.get(dataId)}`) {
                    storeTickerIdInc761(dataId);
                    if (stampProcessId761 && obj.__stampp761__ === stampProcessId761) continue;
                    store761.delete(dataId);
                    this.splice("tickerItems", i, 1);
                    dirty = true;
                  }
                }
              }
              if (dirty) {
                this.markDirty();
              }
            };
            cProto.removeTickerItemById = function (a) {
              // console.log('removeTickerItemById#01', a);
              if (this.tickerItemsQuery !== '#ticker-items' || typeof (a || 0) !== 'string') return this.removeTickerItemById737(a);
              // console.log('removeTickerItemById#02', a);
              const hostElement = this.hostElement;
              if (!hostElement || !a) return this.removeTickerItemById737(a);
              const stampProcessId761 = stampProcessId761_ || false;
              // console.log('removeTickerItemById#03', a);
              const arr = hostElement.querySelectorAll(`[id="${a}"]`);
              const s = new Set();
              if (typeof (a || 0) === 'string') s.add(a);
              for (const elem of arr) {
                if (!elem) continue;
                const elemId = elem.id;
                if (!elemId) continue;
                if (stampProcessId761 && (insp(elem).data || 0).__stampp761__ === stampProcessId761) continue;
                s.add(elemId);
                const data = (insp(elem).data || 0);
                if (data) {
                  const u = data.id;
                  if (u) s.add(u);
                  else data.id = elemId;
                }
              }
              const tickerItems = this.tickerItems;
              // let deleteCount = 0;
              let uDelCount = mDelCount;
              const oldStore761 = storeTickerIds761;
              storeTickerIds761 = new Map();
              for (let i = tickerItems.length - 1; i >= 0; i--) {
                const obj = findObjWithId(tickerItems[i]);
                if (!obj) continue;
                const dataId = obj.id;
                const p = storeTickerIds761.get(dataId) || oldStore761.get(dataId);
                if (p) storeTickerIds761.set(dataId, p);
                if (stampProcessId761 && obj.__stampp761__ === stampProcessId761) continue;
                if (s.has(dataId)) {
                  removingSet761.add(tickerItems[i]);
                  const w = storeTickerIdInc761(dataId);
                  const trr761 = `${dataId}::${w}`;
                  obj.__tickerRemovingId761__ = trr761;
                  mDelCount++;
                  // deleteCount++;
                }
              }
              oldStore761.clear();
              // console.log('removeTickerItemById#06', a, deleteCount);
              s.has(this.highlightId) && (this.highlightId = void 0);
              // console.log('removeTickerItemById#07', a, deleteCount);
              if (!uDelCount && mDelCount) {
                nextBrowserTick_(() => this.__removeDelayed722__());
              }
            }
          }

          // const imgCollection = document.getElementsByTagName('IMG');

          if (ENABLE_TICKERS_BOOSTED_STAMPING && typeof cProto.notifyPath === 'function' && cProto.notifyPath.length === 2 && typeof cProto.stampDomArraySplices_ === 'function' && cProto.stampDomArraySplices_.length === 3
            && !cProto.notifyPath371 && !cProto.proceedStampDomArraySplices371_
            && !cProto.stampDomArraySplices371_ && !cProto.stampDomArray366_) {

            rendererStamperFactory(cProto, {
              key: 'proceedStampDomArraySplices371_',
              stamperDomClass: 'style-scope yt-live-chat-ticker-renderer yt-live-chat-ticker-stampdom'
            });

            cProto.notifyPath371 = cProto.notifyPath;

            cProto.stampDomArraySplices371_ = cProto.stampDomArraySplices_;

            if (typeof cProto.stampDomArraySplices371_ === 'function' && cProto.stampDomArraySplices371_.length >= 3) {
              cProto.stampDomArraySplices_ = function (a, b, c) {
                if (a === 'tickerItems' && b === 'ticker-items' && (c || 0).indexSplices) {
                  // if (this.ec388) {
                  const indexSplices = c.indexSplices;
                  if (indexSplices.length === 1 || typeof indexSplices.length === "undefined") {
                    const indexSplice = indexSplices[0] || indexSplices || 0;
                    if (indexSplice.type === 'splice' && (indexSplice.addedCount >= 1 || (indexSplice.removed || 0).length >= 1)) {
                      // console.log(1059, a, b, indexSplice);
                      if (this.proceedStampDomArraySplices371_(a, b, indexSplice)) return;
                    }
                  }
                  // } else {
                  //   console.warn('stampDomArraySplices_ warning', ...arguments);
                  // }
                }
                return this.stampDomArraySplices371_(...arguments);
              };
            } else {
              console.warn('0xF0230 Function Signature Changed');
            }

            cProto.stampDomArray366_ = cProto.stampDomArray_;
            if (typeof cProto.stampDomArray366_ === 'function' && cProto.stampDomArray366_.length >= 5) {
              cProto.stampDomArray_ = function (items, containerId, componentConfig, rxConfig, shouldCallback, isStableList) {
                const isTickerRendering = items === this.tickerItems && containerId === 'ticker-items';
                const isMessageListRendering = items === this.visibleItems && containerId === 'items';

                if (!isTickerRendering && !isMessageListRendering) {
                  console.log('stampDomArray_ warning 0xF501', ...arguments)
                  return this.stampDomArray366_(...arguments);
                }

                const container = (this.$ || 0)[containerId];
                if (!container) {
                  console.log('stampDomArray_ warning 0xF502', ...arguments)
                  return this.stampDomArray366_(...arguments);
                }

                if (container[sFirstElementChild] === null && items.length === 0) {

                } else {
                  const cTag = isTickerRendering ? 'tickerItems' : 'visibleItems';
                  this.proceedStampDomArraySplices371_(cTag, containerId, {
                    addedCount: items.length,
                    removedCount: container.childElementCount
                  });
                }

                const f = () => {
                  this.markDirty && this.markDirty();
                  const detail = {
                    container
                  };
                  shouldCallback && this.hostElement.dispatchEvent(new CustomEvent("yt-rendererstamper-finished", {
                    bubbles: !0,
                    cancelable: !1,
                    composed: !0,
                    detail
                  }));
                  detail.container = null;
                };

                if (this.ec389pr) {
                  this.ec389pr.then(f)
                } else {
                  f();
                }

              };
            } else {
              console.warn('0xF0230 Function Signature Changed');
            }

          }

          if (typeof cProto.createComponent_ === 'function' && (cProto.createComponent_.length === 4 || cProto.createComponent_.length === 3) && !cProto.createComponent58_) {

            cProto.createComponent58_ = cProto.createComponent_;
            cProto.createComponent_ = function (a, b, c, onCreateComponentError) {

              const z = customCreateComponent(a, b, c, onCreateComponentError);
              if (z !== undefined) return z;
              const r = this.createComponent58_(a, b, c, onCreateComponentError);
              return r;

            }

          } else {
            console.warn('0xF0230 Function Signature Changed');
          }


            /* Dec 2024 */

            /*


                f.handleLiveChatActions = function(a) {
                    a.length && (a.forEach(this.handleLiveChatAction, this),
                    this.updateHighlightedItem(),
                    this.shouldAnimateIn = !0)
                }
                ;
                f.handleLiveChatAction = function(a) {
                    var b = z(a, fL)
                      , c = z(a, gL)
                      , d = z(a, eL)
                      , e = z(a, gdb)
                      , g = z(a, rdb)
                      , k = z(a, Deb);
                    a = z(a, Ceb);
                    b ? this.unshift("tickerItems", b.item) : c ? this.handleMarkChatItemAsDeletedAction(c) : d ? this.removeTickerItemById(d.targetItemId) : e ? this.handleMarkChatItemsByAuthorAsDeletedAction(e) : g ? this.handleRemoveChatItemByAuthorAction(g) : k ? this.showCreatorGoalTickerChip(k) : a && this.removeCreatorGoalTickerChip(a)
                }
            */


          if (USE_ADVANCED_TICKING && !cProto.handleLiveChatActions47 && typeof cProto.handleLiveChatActions === 'function' && cProto.handleLiveChatActions.length === 1) {

            cProto.handleLiveChatActions47 = cProto.handleLiveChatActions;

            cProto.handleLiveChatActions = function (a) {

              // first loading in livestream. so this is required for sorting.

              try {
                preprocessChatLiveActions(a);
              } catch (e) {
                console.warn(e);
              }
              return this.handleLiveChatActions47(a);

            }

            console1.log("USE_ADVANCED_TICKING::handleLiveChatActions - OK");

          } else if (USE_ADVANCED_TICKING) {


            console1.log("USE_ADVANCED_TICKING::handleLiveChatActions - NG");

          }

          // yt-live-chat-ticker-renderer hacks


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

              console1.log('RAF_FIX: keepScrollClamped', tag, "OK")
            } else {

              assertor(() => fnIntegrity(cProto.keepScrollClamped, '0.17.10'));
              console1.log('RAF_FIX: keepScrollClamped', tag, "NG")
            }

          }


          if (RAF_FIX_scrollIncrementally && typeof cProto.startScrolling === 'function' && typeof cProto.scrollIncrementally === 'function'
            && '|1.43.31|1.44.31|'.indexOf('|' + fnIntegrity(cProto.startScrolling) + '|') >= 0
            && '|1.78.45|1.82.43|1.43.31|'.indexOf('|' + fnIntegrity(cProto.scrollIncrementally) + '|') >= 0) {
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

                /**
                 *
                  // 2024.12.20



                  f.startScrolling = function(a) {
                      this.scrollStopHandle && av(this.scrollStopHandle);
                      this.asyncHandle && window.cancelAnimationFrame(this.asyncHandle);
                      this.scrollStartTime = performance.now();
                      this.lastFrameTimestamp = performance.now();
                      this.scrollRatePixelsPerSecond = a;
                      this.asyncHandle = window.requestAnimationFrame(this.scrollIncrementally.bind(this))
                  }

                 *
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
              if (!tickerBarQuery) return; // memory leakage. to be reviewed
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
              if (!tickerBarQuery) return; // memory leakage. to be reviewed
              tickerBarQuery.scrollLeft += b / 1E3 * (cnt.scrollRatePixelsPerSecond || 0);
              cnt.maybeClampScroll();
              cnt.updateArrows();
              cnt.lastFrameTimestamp = a;
              cnt._bound_scrollIncrementally = cnt._bound_scrollIncrementally || cnt.scrollIncrementally.bind(mWeakRef(cnt));
              0 < tickerBarQuery.scrollLeft || cnt.scrollRatePixelsPerSecond && 0 < cnt.scrollRatePixelsPerSecond ? cnt.asyncHandle = requestAnimationFrame(cnt._bound_scrollIncrementally) : cnt.stopScrolling()
            };

            console1.log(`RAF_FIX: scrollIncrementally${RAF_FIX_scrollIncrementally}`, tag, "OK")
          } else {
            assertor(() => fnIntegrity(cProto.startScrolling, '1.43.31'))
              || logFn('cProto.startScrolling', cProto.startScrolling)();
            assertor(() => fnIntegrity(cProto.scrollIncrementally, '1.78.45'))
              || logFn('cProto.scrollIncrementally', cProto.scrollIncrementally)();
            console1.log('RAF_FIX: scrollIncrementally', tag, "NG")
          }


          if (CLOSE_TICKER_PINNED_MESSAGE_WHEN_HEADER_CLICKED && typeof cProto.attached === 'function' && !cProto.attached37 && typeof cProto.detached === 'function' && !cProto.detached37) {

            cProto.attached37 = cProto.attached;
            cProto.detached37 = cProto.detached;

            let naohzId = 0;
            cProto.__naohzId__ = 0;
            cProto.attached = function () {
              Promise.resolve(this).then((cnt) => {

                const hostElement = cnt.hostElement || cnt;
                if (!(hostElement instanceof HTMLElement_)) return;
                if (!HTMLElement_.prototype.matches.call(hostElement, '.yt-live-chat-renderer')) return;
                const ironPage = HTMLElement_.prototype.closest.call(hostElement, 'iron-pages.yt-live-chat-renderer');
                // or #chat-messages
                if (!ironPage) return;

                if (cnt.__naohzId__) removeEventListener.call(ironPage, 'click', cnt.messageBoxClickHandlerForFade, { capture: false, passive: true });
                cnt.__naohzId__ = naohzId = (naohzId & 1073741823) + 1;
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

              for (let p = target; p instanceof HTMLElement_; p = nodeParent(p)) {
                const is = p.is;
                if (typeof is === 'string' && is) {

                  if (is === 'yt-live-chat-pinned-message-renderer') {
                    return;
                  }
                  if (is === 'iron-pages' || is === 'yt-live-chat-renderer' || is === 'yt-live-chat-app') {
                    const fade = HTMLElement_.prototype.querySelector.call(p, 'yt-live-chat-pinned-message-renderer:not([hidden]) #fade');
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

            console1.log("CLOSE_TICKER_PINNED_MESSAGE_WHEN_HEADER_CLICKED - OK")

          } else {
            console1.log("CLOSE_TICKER_PINNED_MESSAGE_WHEN_HEADER_CLICKED - NG")
          }


        })();

        console1.log("[End]");

        groupEnd();

      }).catch(console.warn);



      if (ENABLE_RAF_HACK_INPUT_RENDERER || DELAY_FOCUSEDCHANGED) {

        customElements.whenDefined("yt-live-chat-message-input-renderer").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-message-input-renderer hacks");
          console1.log("[Begin]");
          (() => {



            const tag = "yt-live-chat-message-input-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }


            if (ENABLE_RAF_HACK_INPUT_RENDERER && rafHub !== null) {

              let doHack = false;
              if (typeof cProto.handleTimeout === 'function' && typeof cProto.updateTimeout === 'function') {

                // not cancellable

                // <<< to be reviewed cProto.updateTimeout --- isTimingFunctionHackable -- doHack >>>

                doHack = fnIntegrity(cProto.handleTimeout, '1.27.16') && fnIntegrity(cProto.updateTimeout, '1.50.33');

                if (!doHack) console1.log('doHack = false')

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

                console1.log('RAF_HACK_INPUT_RENDERER', tag, "OK")
              } else {

                console1.log('typeof handleTimeout', typeof cProto.handleTimeout)
                console1.log('typeof updateTimeout', typeof cProto.updateTimeout)

                console1.log('RAF_HACK_INPUT_RENDERER', tag, "NG")
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

          console1.log("[End]");

          groupEnd();


        })

      }


      if (ENABLE_RAF_HACK_EMOJI_PICKER && rafHub !== null) {

        customElements.whenDefined("yt-emoji-picker-renderer").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-emoji-picker-renderer hacks");
          console1.log("[Begin]");
          (() => {

            const tag = "yt-emoji-picker-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            let doHack = false;
            if (typeof cProto.animateScroll_ === 'function') {

              // not cancellable
              console1.log('animateScroll_: function - OK')

              doHack = fnIntegrity(cProto.animateScroll_, '1.102.49')

            } else {

              console1.log('animateScroll_', typeof cProto.animateScroll_)
            }

            if (doHack) {

              const querySelector = HTMLElement_.prototype.querySelector;
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

              console1.log('ENABLE_RAF_HACK_EMOJI_PICKER', tag, "OK")
            } else {

              console1.log('ENABLE_RAF_HACK_EMOJI_PICKER', tag, "NG")
            }

          })();

          console1.log("[End]");

          groupEnd();
        });
      }

      if (ENABLE_RAF_HACK_DOCKED_MESSAGE && rafHub !== null) {

        customElements.whenDefined("yt-live-chat-docked-message").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-docked-message hacks");
          console1.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-docked-message"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            let doHack = false;
            if (typeof cProto.detached === 'function' && typeof cProto.checkIntersections === 'function' && typeof cProto.onDockableMessagesChanged === 'function' && typeof cProto.boundCheckIntersections === 'undefined') {

              // cancelable - this.intersectRAF <detached>
              // yt-live-chat-docked-message
              // boundCheckIntersections <-> checkIntersections
              // onDockableMessagesChanged
              //  this.intersectRAF = window.requestAnimationFrame(this.boundCheckIntersections);

              console1.log(`detached: function - OK`)
              console1.log('checkIntersections: function - OK')
              console1.log('onDockableMessagesChanged: function - OK')

              doHack = fnIntegrity(cProto.detached, '0.32.22') && fnIntegrity(cProto.checkIntersections, '0.128.85') && fnIntegrity(cProto.onDockableMessagesChanged, '0.20.11')

            } else {

              console1.log('detached', typeof cProto.detached, 'NG')
              console1.log('checkIntersections', typeof cProto.checkIntersections, 'NG')
              console1.log('onDockableMessagesChanged', typeof cProto.onDockableMessagesChanged, 'NG')
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

              console1.log('ENABLE_RAF_HACK_DOCKED_MESSAGE', tag, "OK")
            } else {

              console1.log('ENABLE_RAF_HACK_DOCKED_MESSAGE', tag, "NG")
            }

          })();

          console1.log("[End]");

          groupEnd();

        }).catch(console.warn);

      }

      if (FIX_SETSRC_AND_THUMBNAILCHANGE_) {

        customElements.whenDefined("yt-img-shadow").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-img-shadow hacks");
          console1.log("[Begin]");
          (() => {

            const tag = "yt-img-shadow"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            if (typeof cProto.thumbnailChanged_ === 'function' && !cProto.thumbnailChanged66_) {

              cProto.thumbnailChanged66_ = cProto.thumbnailChanged_;
              cProto.thumbnailChanged_ = function (a) {

                if (this.oldThumbnail_ && this.thumbnail && this.oldThumbnail_.thumbnails === this.thumbnail.thumbnails) return;
                if (!this.oldThumbnail_ && !this.thumbnail) return;

                return this.thumbnailChanged66_.apply(this, arguments)

              }
              console1.log("cProto.thumbnailChanged_ - OK");

            } else {
              console1.log("cProto.thumbnailChanged_ - NG");

            }
            if (typeof cProto.setSrc_ === 'function' && !cProto.setSrc66_) {

              cProto.setSrc66_ = cProto.setSrc_;
              cProto.setSrc_ = function (a) {
                if ((((this || 0).$ || 0).img || 0).src === a) return;
                return this.setSrc66_.apply(this, arguments)
              }

              console1.log("cProto.setSrc_ - OK");
            } else {

              console1.log("cProto.setSrc_ - NG");
            }

          })();

          console1.log("[End]");

          groupEnd();

        }).catch(console.warn);

      }

      if (FIX_THUMBNAIL_DATACHANGED) {

        customElements.whenDefined("yt-live-chat-author-badge-renderer").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-author-badge-renderer hacks");
          console1.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-author-badge-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
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
              console1.log("cProto.dataChanged - OK");

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
              console1.log("cProto.dataChanged - OK");

            } else {
              assertor(() => fnIntegrity(cProto.dataChanged, '0.169.106'));
              console1.log("cProto.dataChanged - NG");

            }

          })();

          console1.log("[End]");

          groupEnd();

        }).catch(console.warn);


      }

      if (USE_ADVANCED_TICKING) {
        // leading the emoji cannot be rendered.

        // const qz38 = lcrPromiseFn();

        // qz38.then((lcrGet) => {

        // const tag = "yt-live-chat-renderer"
        // const dummy = lcrGet();

        const lcrFn2 = (lcrDummy) => {

          const tag = "yt-live-chat-renderer"
          const dummy = lcrDummy;


          const cProto = getProto(dummy);

          // dummy.usePatchedLifecycles = false;
          // dummy.data = null;
          // dummy.__data = null;
          // Object.setPrototypeOf(dummy, Object.prototype);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          /*
          <tp-yt-paper-tooltip class="style-scope yt-live-chat-author-badge-renderer" role="tooltip" tabindex="-1" style="--paper-tooltip-delay-in: 0ms; inset: -63.3984px auto auto 0px;
          */

          if (cProto && typeof cProto.immediatelyApplyLiveChatActions === 'function' && cProto.immediatelyApplyLiveChatActions.length === 1 && !cProto.immediatelyApplyLiveChatActions82) {
            cProto.immediatelyApplyLiveChatActions82 = cProto.immediatelyApplyLiveChatActions;
            cProto.immediatelyApplyLiveChatActions = function (arr) {


              // console.log(1237)
              try {
                preprocessChatLiveActions(arr);
              } catch (e) {
                console.warn(e);
              }
              return this.immediatelyApplyLiveChatActions82(arr);
            };
          }


          if (cProto && typeof cProto.preprocessActions_ === 'function' && cProto.preprocessActions_.length === 1 && !cProto.preprocessActions82_) {
            cProto.preprocessActions82_ = cProto.preprocessActions_;
            cProto.preprocessActions_ = function (arr) {

              const ct_ = Date.now();

              arr = this.preprocessActions82_(arr);

              try {
                preprocessChatLiveActions(arr, ct_);
              } catch (e) {
                console.warn(e);
              }
              return arr;
            };
          }



        };
        !__LCRInjection__ && LCRImmedidates.push(lcrFn2);
        getLCRDummy().then(lcrFn2);
      }

      if (MODIFY_EMIT_MESSAGES_FOR_BOOST_CHAT) {

        const lcrFn2 = (lcrDummy) => {

          const tag = "yt-live-chat-renderer"
          const dummy = lcrDummy;


          const cProto = getProto(dummy);

          // dummy.usePatchedLifecycles = false;
          // dummy.data = null;
          // dummy.__data = null;
          // Object.setPrototypeOf(dummy, Object.prototype);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          /*

              // https://www.youtube.com/s/desktop/c01ea7e3/jsbin/live_chat_polymer.vflset/live_chat_polymer.js


              YP.prototype.emitSmoothedMessages = function() {
                  this.JSC$10797_nextUpdateId = null;
                  if (this.JSC$10797_messageQueue.length) {
                      var a = 1E4;
                      this.JSC$10797_estimatedUpdateInterval !== null && this.JSC$10797_lastUpdateTime !== null && (a = this.JSC$10797_estimatedUpdateInterval - Date.now() + this.JSC$10797_lastUpdateTime);
                      var b = this.JSC$10797_messageQueue.length < a / 80 ? 1 : Math.ceil(this.JSC$10797_messageQueue.length / (a / 80));
                      var c = aba(this.JSC$10797_messageQueue.splice(0, b));
                      this.callback && this.callback(c);
                      this.JSC$10797_messageQueue.length && (b === 1 ? (b = a / this.JSC$10797_messageQueue.length,
                      b *= Math.random() + .5,
                      b = Math.min(1E3, b),
                      b = Math.max(80, b)) : b = 80,
                      this.JSC$10797_nextUpdateId = window.setTimeout(this.emitSmoothedMessages.bind(this), b))
                  }
              }
              // emitSmoothedMessages: say b = 1000, 858.24, 529.49, 357.15, 194.96, 82.12, 80, 80, 80 ....

          */


          const _flag0281_ = window._flag0281_;


          if ((_flag0281_ & 0x40000) === 0x40000 && cProto && typeof cProto.preprocessActions_ === 'function' && cProto.preprocessActions_.length === 1 && !cProto.preprocessActions92_) {
            // we can disable smooth message emitting if boost chat is enabled (0x40000)
            let byPass = false;
            let q33 = false;
            let key_estimatedUpdateInterval = '';
            let key_lastUpdateTime = '';
            let key_messageQueue = '';
            const emitSmoothedMessagesInstantFn = function () {
              if (byPass) return this.emitSmoothedMessages018();
              byPass = true;
              try {
                if (!q33) {
                  const keys = Object.getOwnPropertyNames(this);
                  for (const key of keys) {
                    if (`${key}`.endsWith('_estimatedUpdateInterval')) key_estimatedUpdateInterval = key;
                    else if (`${key}`.endsWith('_lastUpdateTime')) key_lastUpdateTime = key;
                    else if (`${key}`.endsWith('_messageQueue')) key_messageQueue = key;
                    else continue;
                    if (key_estimatedUpdateInterval && key_lastUpdateTime && key_messageQueue) break;
                  }
                  if (key_estimatedUpdateInterval && key_lastUpdateTime && key_messageQueue) {
                    q33 = true;
                  }
                }
                if (key_estimatedUpdateInterval && key_lastUpdateTime) {
                  this[key_estimatedUpdateInterval] = 78; // 80 - 2
                  this[key_lastUpdateTime] = Date.now() - 1;
                }
              } catch (e) { }
              // console.log(19893,key_estimatedUpdateInterval,  key_lastUpdateTime)
              // make a = this.JSC$10797_estimatedUpdateInterval - Date.now() + this.JSC$10797_lastUpdateTime small

              // this.JSC$10797_estimatedUpdateInterval = Date.now() + 1
              // this.JSC$10797_lastUpdateTime  = Date.now()

              // if (!window.setTimeout837) {
              //   window.setTimeout837 = window.setTimeout;
              //   window.setTimeout838 = function (f, d) {
              //     if (arguments.length !== 2) return window.setTimeout837(...arguments);
              //     console.log(12883, d)
              //     return window.setTimeout837(f, d > 80 ? 80 : d)
              //   }
              // }
              // else if (window.setTimeout837 !== window.setTimeout) {
              //   window.setTimeout837 = window.setTimeout;
              // }
              // let r;
              // if (window.setTimeout837 && window.setTimeout838) {
              //   window.setTimeout = window.setTimeout838;
              //   r = this.emitSmoothedMessages018();
              //   window.setTimeout = window.setTimeout837;
              // } else {
              //   r = this.emitSmoothedMessages018();
              // }
              let doInNextCall = false;
              try {
                const messageQueue = key_messageQueue ? this[key_messageQueue] : null;
                if (!messageQueue || !messageQueue.length) {

                } else if (messageQueue.length > 255) {

                } else if (!document.hidden) {

                } else {
                  doInNextCall = true;
                }
              } catch (e) { }

              let r;
              if (doInNextCall) {
                setTimeout_(() => this.emitSmoothedMessages019(), 250);
              } else {
                r = this.emitSmoothedMessages018();
              }
              byPass = false;
              return r;
            };
            cProto.preprocessActions92_ = cProto.preprocessActions_;
            cProto.preprocessActions_ = function (arr) {

              arr = this.preprocessActions92_(arr);

              try {

                const smoothedQueue_ = this.smoothedQueue_;
                if (smoothedQueue_ && !smoothedQueue_.__fix018__) {
                  smoothedQueue_.__fix018__ = true;
                  if (!smoothedQueue_.emitSmoothedMessages018 && typeof smoothedQueue_.emitSmoothedMessages === 'function' && smoothedQueue_.emitSmoothedMessages.length === 0) {
                    smoothedQueue_.emitSmoothedMessages018 = smoothedQueue_.emitSmoothedMessages;
                    smoothedQueue_.emitSmoothedMessages019 = emitSmoothedMessagesInstantFn;
                    smoothedQueue_.emitSmoothedMessages = emitSmoothedMessagesInstantFn;
                  }
                }
              } catch (e) {
                console.warn(e);
              }
              return arr;
            };
          }




        };
        !__LCRInjection__ && LCRImmedidates.push(lcrFn2);
        getLCRDummy().then(lcrFn2);
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
            if (EU instanceof HTMLElement_ && EU.is) {
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
                      const cnt = insp(this);
                      const hostElement = cnt.hostElement || cnt;
                      let a = hostElement.parentNode, b = hostElement.getRootNode();
                      const fr = cnt.for || hostElement.for;
                      return (fr ? b.querySelector("#" + fr) : a)
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

          // 2025.01.10 fix
          const CS = EU;
          if (!CS._showing && CS.__shady_parentNode && CS.__shady_parentNode !== CS.parentNode) {
            if (CS.__shady_parentNode) {
              try {
                CS.__shady_parentNode.__shady_removeChild(CS);
              } catch (e) { }
            }
            if (CS.__shady_parentNode) {
              try {
                CS.__shady_parentNode.removeChild(CS);
              } catch (e) { }
            }
            if (CS.__shady_parentNode) {
              try {
                CS.__shady_parentNode.__shady_native_removeChild(CS);
              } catch (e) { }
            }
            if (CS.__shady_parentNode) {
              try {
                __shady_native_removeChild.call(CS.__shady_parentNode, CS);
              } catch (e) { }
            }
            if (CS.parentNode && !CS.__shady_parentNode) {
              try {
                __shady_native_removeChild.call(CS.parentNode, CS);
              } catch (e) { }
            }
          }

          return r;
        };


        // added in 2024.05.02
        const lcrFn2 =  (lcrDummy) => {

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

        };
        !__LCRInjection__ && LCRImmedidates.push(lcrFn2);
        getLCRDummy().then(lcrFn2);

        // ----------------------------------------------------------------------------------------------------

        customElements.whenDefined("tp-yt-paper-tooltip").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | tp-yt-paper-tooltip hacks");
          console1.log("[Begin]");
          (() => {

            const tag = "tp-yt-paper-tooltip"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
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

              console1.log("_readyClients - OK");

            } else {
              console1.log("_readyClients - NG");

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

              console1.log("trim tooltip content - OK");

            } else {
              console1.log("trim tooltip content - NG");

            }


          })();

          console1.log("[End]");

          groupEnd();

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

              const chatBanner = HTMLElement_.prototype.closest.call(hostElement, 'yt-live-chat-banner-renderer') || 0;
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
            const kurMPCe = HTMLElement_.prototype.closest.call(kurMP, '[menu-visible]') || 0; // element

            if (!kurMPCe || !kurMPCe.hasAttribute('whole-message-clickable')) return;

            const kurMPCc = insp(kurMPCe); // controller

            if (!kurMPCc.isClickableChatRow111 || !kurMPCc.isClickableChatRow111() || !HTMLElement_.prototype.contains.call(kurMPCe, evt.target)) return;

            const chatBanner = HTMLElement_.prototype.closest.call(kurMPCe, 'yt-live-chat-banner-renderer') || 0;
            if (chatBanner) return;

            let targetDropDown = null;
            for (const dropdown of document.querySelectorAll('tp-yt-iron-dropdown.style-scope.yt-live-chat-app')) {
              if (dropdown && dropdown.positionTarget === kurMP) {
                targetDropDown = dropdown;
              }
            }

            if (!targetDropDown) return;

            if (evt.target.closest('ytd-menu-popup-renderer')) return;

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

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-message-renderer(s)... hacks");
          console1.log("[Begin]");
          let doMouseHook = false;

          const dProto = {
            isClickableChatRow111: function () {
              return (
                this.data && typeof this.shouldSupportWholeItemClick === 'function' && typeof this.hasModerationOverlayVisible === 'function' &&
                this.data.contextMenuEndpoint && this.wholeMessageClickable && this.shouldSupportWholeItemClick() && !this.hasModerationOverlayVisible()
              ); // follow .onItemTap(a)
            },
            updateMessage374: function () { // conflict with weak dom root?
              try {
                return this.updateMessage372();
              } catch (e) {
                console.warn(e);
              }
              // const a = this.data.message;
              // const b = this.$.message || this.hostElement.querySelector('#message');
              // b.textContent = "";
              // a && b.appendChild(this.ytLiveChatItemBehavior.createDocumentFragment(a));
            }
          };

          for (const sTag of sTags) { // ##tag##


            (() => {

              const tag = sTag;
              const dummy = document.createElement(tag);

              const cProto = getProto(dummy);
              if (!cProto || !cProto.attached) {
                console1.warn(`proto.attached for ${tag} is unavailable.`);
                return;
              }

              if (cProto && typeof cProto.updateMessage === 'function' && !cProto.updateMessage373 && cProto.updateMessage.length === 0 && fnIntegrity(cProto.updateMessage)) {
                const w = fnIntegrity(cProto.updateMessage);
                if (w !== '0.36.21') {
                  console.warn('updateMessage signature changed', w, '0.36.21', cProto.updateMessage);
                } else {
                  cProto.updateMessage373 = true;
                  cProto.updateMessage372 = cProto.updateMessage;
                  cProto.updateMessage = dProto.updateMessage374;
                }
              }

              const dCnt = insp(dummy);
              if ('wholeMessageClickable' in dCnt && typeof dCnt.hasModerationOverlayVisible === 'function' && typeof dCnt.shouldSupportWholeItemClick === 'function') {

                cProto.isClickableChatRow111 = dProto.isClickableChatRow111;

                const toHookDocumentMouseDown = typeof cProto.shouldSupportWholeItemClick === 'function' && typeof cProto.hasModerationOverlayVisible === 'function';

                if (toHookDocumentMouseDown) {
                  doMouseHook = true;
                }

                console1.log("shouldSupportWholeItemClick - OK", tag);

              } else {

                console1.log("shouldSupportWholeItemClick - NG", tag);
              }


            })();

          }


          if (doMouseHook) {

            hookDocumentMouseDownSetupFn();

            console1.log("FIX_CLICKING_MESSAGE_MENU_DISPLAY_ON_MOUSE_CLICK - Doc MouseEvent OK");
          }

          console1.log("[End]");

          groupEnd();


        }).catch(console.warn);


        // https://www.youtube.com/watch?v=oQzFi1NO7io


      }

      if (NO_ITEM_TAP_FOR_NON_STATIONARY_TAP) {
        let targetElementCntWR = null;
        let _e0 = null;
        document.addEventListener('mousedown', (e) => {
          if (!e || !e.isTrusted) return;
          let element = e.target;
          for (; element instanceof HTMLElement_; element = element.parentNode) {
            if (element.is) break;
          }
          if (!element || !element.is) return;
          if (element.closest('ytd-menu-popup-renderer')) return;
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
          } else if (`${window.getSelection()}`.trim().replace(/[\u2000-\u200a\u202f\u2800\u200B\u200C\u200D\uFEFF]+/g, '').length >= 1) {
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
          if (target.closest('ytd-menu-popup-renderer')) return;

          while (target instanceof HTMLElement_) {
            if (++j1 > maxloopDOMTreeElements) break;
            if (typeof (target.is || insp(target).is || null) === 'string') break;
            target = nodeParent(target);
          }
          const components = [];
          while (target instanceof HTMLElement_) {
            if (++j2 > maxloopYtCompontents) break;
            const cnt = insp(target);
            if (typeof (target.is || cnt.is || null) === 'string') {
              components.push(target);
            }
            if (typeof cnt.showContextMenu === 'function') break;
            target = target.parentComponent || cnt.parentComponent || null;
          }
          if (!(target instanceof HTMLElement_)) return;
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

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | fixShowContextMenu");
        console1.log("[Begin]");


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
              console1.warn(`proto.attached for ${tag} is unavailable.`);
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
              console1.log("CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN - OK", tag);
            } else {
              console1.log("CACHE_SHOW_CONTEXT_MENU_FOR_REOPEN - NG", tag);
            }

            if (ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU && typeof cProto.showContextMenu === 'function' && typeof cProto.showContextMenu_ === 'function' && !cProto.showContextMenu48 && !cProto.showContextMenu48_ && cProto.showContextMenu.length === 1 && cProto.showContextMenu_.length === 1) {
              cProto.showContextMenu48 = cProto.showContextMenu;
              cProto.showContextMenu = dProto.showContextMenuWithDisableScroll;
              console1.log("ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU - OK", tag);
            } else if (!ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU) {
              DEBUG_skipLog001 || console1.log("ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU - N/A", tag);
            } else {
              console1.log("ADVANCED_NOT_ALLOW_SCROLL_FOR_SHOW_CONTEXT_MENU - NG", tag);
            }


            if (ENABLE_MUTEX_FOR_SHOW_CONTEXT_MENU && typeof cProto.showContextMenu === 'function' && typeof cProto.showContextMenu_ === 'function' && !cProto.showContextMenu47 && !cProto.showContextMenu47_ && cProto.showContextMenu.length === 1 && cProto.showContextMenu_.length === 1) {
              cProto.showContextMenu47_ = cProto.showContextMenu_;
              cProto.showContextMenu47 = cProto.showContextMenu;
              cProto.__showContextMenu_mutex_unlock_isEmpty__ = dProto.__showContextMenu_mutex_unlock_isEmpty__;
              cProto.__showContextMenu_assign_lock__ = dProto.__showContextMenu_assign_lock__;
              cProto.showContextMenu = dProto.showContextMenuWithMutex;
              cProto.showContextMenu_ = dProto.showContextMenuWithMutex_;
              console1.log("ENABLE_MUTEX_FOR_SHOW_CONTEXT_MENU - OK", tag);
            } else {
              console1.log("ENABLE_MUTEX_FOR_SHOW_CONTEXT_MENU - NG", tag);
            }

          })();

        }

        console1.log("[End]");

        groupEnd();

      }).catch(console.warn);



      if (FIX_UNKNOWN_BUG_FOR_OVERLAY) {
        // this is to fix " TypeError: this.backdropElement.prepare is not a function "

        customElements.whenDefined('tp-yt-paper-dialog').then(() => {


          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | tp-yt-paper-dialog hacks");
          console1.log("[Begin]");
          (() => {

            const tag = "tp-yt-paper-dialog";
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
              return;
            }

            if (typeof cProto.__openedChanged === 'function' && !cProto.__openedChanged49 && cProto.__openedChanged.length === 0) {


              cProto.__openedChanged49 = cProto.__openedChanged;

              cProto.__openedChanged = function () {
                const manager = (this || 0)._manager || 0;
                if (manager && !manager.trackBackdrop49 && manager.trackBackdrop) {
                  manager.trackBackdrop49 = manager.trackBackdrop;
                  if (manager.trackBackdrop.length === 0) {
                    manager.trackBackdrop = function () {
                      try {
                        return this.trackBackdrop49();
                      } catch (e) {
                        let showMessage = true;
                        if (e instanceof TypeError && e.message === 'this.backdropElement.prepare is not a function') {
                          // this is well known issue.
                          showMessage = false;
                        }
                        showMessage && console.log('manager.trackBackdrop', e);
                      }
                    }
                  }
                }
                return this.__openedChanged49();
              };


            }


          })();


          console1.log("[End]");

          groupEnd();


        }).catch(console.warn);

      }


      customElements.whenDefined('tp-yt-iron-dropdown').then(() => {

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | tp-yt-iron-dropdown hacks");
        console1.log("[Begin]");
        (() => {

          const tag = "tp-yt-iron-dropdown";
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console1.warn(`proto.attached for ${tag} is unavailable.`);
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
            console1.log("USE_VANILLA_DEREF - OK");
          } else {
            console1.log("USE_VANILLA_DEREF - NG");
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
            console1.log("FIX_DROPDOWN_DERAF - OK");
          } else {
            console1.log("FIX_DROPDOWN_DERAF - NG");
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
              console1.log("FIX_MENU_POSITION_ON_SHOWN - OK");

            } else {

              console1.log("FIX_MENU_POSITION_ON_SHOWN - NG");

            }



            cProto.__openedChanged = function () {
              // console.log(123445)
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
                  // console.log('[yt-chat-dialog]', this._manager)
                  try{
                  this._manager.addOverlay(this);
                  }catch(e){
                    console.log('this._manager.addOverlay(this) fails.')
                  }
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
                  // console.log('[yt-chat-dialog]', this._manager)
                  try{
                  this._manager.removeOverlay(this);
                  }catch(e){
                    console.log('this._manager.removeOverlay(this) fails.')
                  }
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
            console1.log("BOOST_MENU_OPENCHANGED_RENDERING - OK");

          } else {

            assertor(() => fnIntegrity(cProto.__openedChanged, '0.46.20'));
            console1.log("FIX_MENU_REOPEN_RENDER_PERFORMANC_1 - NG");

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

        console1.log("[End]");

        groupEnd();

      }).catch(console.warn);



      FIX_ToggleRenderPolymerControllerExtractionBug && customElements.whenDefined('yt-live-chat-toggle-renderer').then(() => {

        mightFirstCheckOnYtInit();
        groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-toggle-renderer hacks");
        console1.log("[Begin]");
        (() => {

          const tag = "yt-live-chat-toggle-renderer";
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console1.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

        })();

        console1.log("[End]");
        groupEnd();

      });

      FIX_MOUSEOVER_FN && (() => {

        // this is to show tooltip for emoji


        let lastShow = 0;

        const wm = new WeakSet();
        const mo1 = new MutationObserver((mutations) => {

          for (const p of document.querySelectorAll('[shared-tooltip-text]:not([__a6cwm__])')) {
            p.setAttribute('__a6cwm__', '');
          }

        });
        mo1.observe(document, { subtree: true, attributes: true, attributeFilter: ['shared-tooltip-text'], childList: true });

        const mo2 = new MutationObserver((mutations) => {

          for (const mutation of mutations) {
            const p = mutation.target;
            if (mutation.attributeName) {
              if (p.getAttribute('shared-tooltip-text')) { // allow hack
                wm.add(p);
                for (const e of p.getElementsByTagName('*')) {
                  wm.add(e);
                }
              } else {
                if (wm.has(p)) {
                  wm.remove(p);
                  for (const e of p.getElementsByTagName('*')) {
                    wm.remove(e);
                  }
                }
              }
            }
          }
        });
        mo2.observe(document, { subtree: true, attributes: true, attributeFilter: ['__a6cwm__', 'shared-tooltip-text'], childList: false });


        let done = 0;
        // lcrFn2 will run twice to ensure the method is successfully injected.
        const lcrFn2 = (lcrDummy) => {
          // make minimal function overhead by pre-defining all possible outside.

          const tag = "yt-live-chat-renderer"
          const dummy = lcrDummy;

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          // mightFirstCheckOnYtInit();
          // groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-renderer hacks");
          // console.log("[Begin]");



          if (done !== 1 && typeof cProto.onMouseOver_ === 'function' && !cProto.onMouseOver37_ && typeof cProto.createTooltipIfRequired_ === 'function' && cProto.createTooltipIfRequired_.length === 0) {

            done = 1;
            const onMouseOver37_ = cProto.onMouseOver37_ = cProto.onMouseOver_;

            const checkMatch = (() => {


              let accessList = [];
              let withError = false;
              try {

                onMouseOver37_.call(lcrDummy, {
                  type: 'mouseover',
                  target: new Proxy({
                    nodeName: 'DIV',
                    tagName: 'DIV',
                    getAttribute: function () { },
                    parentNode: null
                  }, {
                    get(target, p) {
                      accessList.push(`getter:${p}`);
                      if (!(p in target)) throw Error(`getter ${p} is not found`);
                    },
                    set(target, p, v) {
                      accessList.push(`setter:${p}`);
                      throw Error(`setter ${p} is not found`);
                    }
                  })
                });
              } catch (e) {
                withError = true;
                // console.warn(e);
              }

              if (withError) return false;

              if (accessList.join(',') !== 'getter:getAttribute,getter:parentNode') return false;

              accessList.length = 0;

              let parent;
              try {

                parent = new Proxy({
                  nodeName: 'DIV',
                  tagName: 'DIV',
                  getAttribute: function (e) {

                    accessList.push(`getter:getAttribute(${e})`);
                    return e === 'shared-tooltip-text' ? ':cherry_blossom:' : null;

                  },
                  parentNode: null
                }, {
                  get(target, p) {
                    accessList.push(`getter:${p}`);
                    if (!(p in target)) throw Error(`getter ${p} is not found`);
                    return target[p]
                  },
                  set(target, p, v) {
                    accessList.push(`setter:${p}`);
                    throw Error(`setter ${p} is not found`);
                  }
                });

                onMouseOver37_.call(lcrDummy, {
                  type: 'mouseover',
                  target: new Proxy({
                    nodeName: 'IMG',
                    tagName: 'IMG',
                    id: 'img',
                    getAttribute: function (e) {

                      accessList.push(`getter:getAttribute(${e})`);
                      return e === 'shared-tooltip-text' ? ':cherry_blossom:' : null;

                    },
                    get parentNode() {
                      return parent
                    },
                    get parentElement() {
                      return parent
                    }
                  }, {
                    get(target, p) {
                      accessList.push(`getter:${p}`);
                      if (!(p in target)) throw Error(`getter ${p} is not found`);
                      return target[p]
                    },
                    set(target, p, v) {
                      accessList.push(`setter:${p}`);
                      throw Error(`setter ${p} is not found`);
                    }
                  })
                });
              } catch (e) {
                withError = true;
                // console.warn(e);
              }
              parent = null;

              if (withError && accessList.join(',') === 'getter:getAttribute,getter:getAttribute,getter:getAttribute(shared-tooltip-text),getter:getAttribute,getter:getAttribute(shared-tooltip-text),getter:tagName,getter:parentElement,getter:id,getter:id,getter:$$') {
                return true;
              }



            })();
            if (checkMatch) {

              cProto.onMouseOver_ = function (evt) {
                const p = (evt || 0).target || 0;
                if (p.nodeType === 1 && wm.has(p)) {
                  const ct = Date.now();
                  if (lastShow + 18 > ct) return;
                  const cnt = insp(this);
                  lastShow = ct;
                  try {
                    cnt.onMouseOver37_.call(this, evt);
                  } catch (e) {
                    console.warn(e);
                  }
                }
              };

              
              const lcrs = toUniqueArr([lcrDummy, ...document.querySelectorAll('yt-live-chat-renderer')]);
              for (const lcr of lcrs) {
                const cnt = insp(lcr);
                const hostElement = cnt.hostElement;
                if (hostElement && cnt.isAttached === true && cnt.onMouseOver37_ === cProto.onMouseOver37_ && typeof cProto.onMouseOver_ === 'function' && cProto.onMouseOver_ !== cProto.onMouseOver37_ && cnt.onMouseOver_ === cProto.onMouseOver_) {
                  hostElement.removeEventListener("mouseover", cProto.onMouseOver37_, !0)
                  hostElement.addEventListener("mouseover", cProto.onMouseOver_, !0)
                }
              }

              console.log('[yt-chat-lcr] FIX_MOUSEOVER_FN - OK')

            } else {

              console.log('[yt-chat-lcr] FIX_MOUSEOVER_FN - NG')

            }

          } else if (done !== 1) {
            done = 2;
            console.log('[yt-chat-lcr] FIX_MOUSEOVER_FN - NG')
          }

          // console.log("[End]");
          // groupEnd();


        };
        !__LCRInjection__ && LCRImmedidates.push(lcrFn2);
        // getLCRDummy() must be called for injection
        getLCRDummy().then(lcrFn2);

      })();


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
        console1.log("[Begin]");

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
              lza = (lza & 1073741823) + 1;
              const qta = -lza;
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


          console1.log("CHANGE_MANAGER_UNSUBSCRIBE - OK")

        } else {

          console1.log("CHANGE_MANAGER_UNSUBSCRIBE - NG")
        }

        console1.log("[End]");

        groupEnd();

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
        console1.log("[Begin]");
        (() => {

          const tag = "yt-invalidation-continuation"
          const dummy = document.createElement(tag);

          const cProto = getProto(dummy);
          if (!cProto || !cProto.attached) {
            console1.warn(`proto.attached for ${tag} is unavailable.`);
            return;
          }

          const dummyManager = insp(dummy).manager_ || 0;
          __dummyManager__ = dummyManager;


        })();

        console1.log("[End]");

        groupEnd();



        onManagerFound(__dummyManager__);

      }).catch(console.warn);


      if (INTERACTIVITY_BACKGROUND_ANIMATION >= 1) {

        customElements.whenDefined("yt-live-interactivity-component-background").then(() => {

          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-interactivity-component-background hacks");
          console1.log("[Begin]");
          (() => {

            const tag = "yt-live-interactivity-component-background"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
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
                  if (stopAfterRun && (this.hostElement instanceof HTMLElement_)) {
                    this.__toStopAfterRun__(this.hostElement); // primary
                  }
                  const r = this.maybeLoadAnimationBackground77.apply(this, arguments);
                  if (stopAfterRun && this.lottieAnimation) {
                    this.lottieAnimation.stop(); // fallback if no mutation
                  }
                  return r;
                }
              }

              console1.log(`INTERACTIVITY_BACKGROUND_ANIMATION(${INTERACTIVITY_BACKGROUND_ANIMATION}) - OK`);

            } else {
              console1.log(`INTERACTIVITY_BACKGROUND_ANIMATION(${INTERACTIVITY_BACKGROUND_ANIMATION}) - NG`);

            }

          })();

          console1.log("[End]");

          groupEnd();


        }).catch(console.warn);

      }


      if (DELAY_FOCUSEDCHANGED) {

        customElements.whenDefined("yt-live-chat-text-input-field-renderer").then(() => {


          mightFirstCheckOnYtInit();
          groupCollapsed("YouTube Super Fast Chat", " | yt-live-chat-text-input-field-renderer hacks");
          console1.log("[Begin]");
          (() => {

            const tag = "yt-live-chat-text-input-field-renderer"
            const dummy = document.createElement(tag);

            const cProto = getProto(dummy);
            if (!cProto || !cProto.attached) {
              console1.warn(`proto.attached for ${tag} is unavailable.`);
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

          console1.log("[End]");

          groupEnd();

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
