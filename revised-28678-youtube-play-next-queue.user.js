// ==UserScript==
// @name         Youtube Play Next Queue
// @version      2.5.1
// @description  Don't like the youtube autoplay suggestion? This script can create a queue with videos you want to play after your current video has finished!
// @author       Cpt_mathix
// @match        https://www.youtube.com/*
// @include      https://www.youtube.com/*
// @license      GPL-2.0-or-later; http://www.gnu.org/licenses/gpl-2.0.txt
// @require      https://cdn.jsdelivr.net/gh/culefa/JavaScript-autoComplete@19203f30f148e2d9d810ece292b987abb157bbe0/auto-complete.min.js
// @namespace    https://greasyfork.org/users/16080
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==


/**
 * 
 * This is the modified version from https://greasyfork.org/scripts/28678-youtube-play-next-queue/
 * 
 * GPL-2.0-or-later, credit to "Cptmathix"
 * 
 */


/**
 * This script now is maintained by [CY Fung](https://greasyfork.org/en/users/371179)
 * 
 * This userscript supports Violentmonkey, Tampermonkey.
 *
**/



/* jshint esversion: 6 */

(function() {
    'use strict';

    // ================================================================================= //
    // ============================ YOUTUBE PLAY NEXT QUEUE ============================ //
    // ================================================================================= //

    function youtube_play_next_queue_modern() {

        const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

        let script = {
            version: "2.0.0",
            initialized: false,

            queue: null,
            ytplayer: null,

            queue_visible: false,
            queue_rendered_observer: null,
            video_renderer_observer: null,
            playnext_data_observer: null,

            debug: false
        };

        document.addEventListener("load", loadScript);
        document.addEventListener("DOMContentLoaded", initScript);

        window.addEventListener("storage", function(event) {
            if (script.initialized && /YTQUEUE-MODERN#.*#QUEUE/.test(event.key)) {
                initQueue();
                displayQueue();
            }
        });

        // reload script on page change using youtube polymer fire events
        window.addEventListener("yt-page-data-updated", function(event) {
            if (script.debug) { console.log("# page updated #"); }
            startScript(2);
        });

        function initScript() {
            if (script.debug) { console.log("### Youtube Play Next Queue Initializing ###"); }

            if (window.Polymer === undefined) {
                return;
            }

            initQueue();
            injectCSS();

            // TODO, better / more efficient alternative?
            setInterval(addThumbOverlayClickListeners, 250);
            setInterval(initThumbOverlays, 1000);

            if (script.debug) { console.log("### Youtube Play Next Queue Initialized ###"); }
            script.initialized = true;
        }

        function loadScript() {
            startScript(5);
        }

        function startScript(retry) {
            script.queue_visible = false;

            if (script.initialized && isPlayerAvailable()) {
                if (script.debug) { console.log("videoplayer is available"); }
                if (script.debug) { console.log("ytplayer: ", script.ytplayer); }

                if (script.ytplayer) {
                    if (script.debug) { console.log("initializing queue"); }
                    displayQueue();

                    if (script.debug) { console.log("initializing video statelistener"); }
                    initVideoStateListener();

                    if (script.debug) { console.log("initializing playnext data observer"); }
                    initPlayNextDataObserver();
                } else {
                    hideQueue();
                }
            } else if (retry > 0) { // fix conflict with Youtube+ script
                setTimeout( function() {
                    startScript(--retry);
                }, 1000);
            } else {
                if (script.debug) { console.log("videoplayer is unavailable"); }
            }
        }

        // *** LISTENERS & OBSERVERS *** //

        function initVideoStateListener() {
            if (!script.ytplayer.classList.contains('initialized-listeners')) {
                script.ytplayer.classList.add('initialized-listeners');
                script.ytplayer.addEventListener("onStateChange", handleVideoStateChanged);
            } else {
                if (script.debug) { console.log("statelistener already initialized"); }
            }

            // run handler once to make sure queue is in sync
            handleVideoStateChanged(script.ytplayer.getPlayerState());
        }

        function handleVideoStateChanged(videoState) {
            if (script.debug) { console.log("player state changed: " + videoState + "; queue empty: " + script.queue.isEmpty()); }

            const FINISHED_STATE = 0;
            const PLAYING_STATE = 1;
            const PAUSED_STATE = 2;
            const BUFFERING_STATE = 3;
            const CUED_STATE = 5;

            if (!script.queue.isEmpty()) {
                // dequeue video from the queue if it is currently playing
                if (script.ytplayer.getVideoData().video_id === script.queue.peek().id) {
                    script.queue.dequeue();
                }
            }

            let currentVideoIdFromUrl = getVideoIdFromUrl(window.location.href);
            if (videoState !== BUFFERING_STATE && isWatchPage() && !!currentVideoIdFromUrl && script.ytplayer.getVideoData().video_id !== currentVideoIdFromUrl && script.ytplayer.getVideoData().isListed) {
                if (script.debug) { console.log("Videoplayer not correctly loaded, LoadVideoById manually"); }
                script.ytplayer.loadVideoById(currentVideoIdFromUrl);
                script.ytplayer.playVideo();
            }

            if ((videoState === PLAYING_STATE || videoState === PAUSED_STATE) && !script.queue.isEmpty() && !isPlaylist()) {
                if (script.debug) { console.log("SetAsNextVideo: HandleVideoStateChanged"); }
                script.queue.peek().setAsNextVideo();
            }

            if (videoState === PAUSED_STATE) {
                // TODO: check if this works
                // Check for annoying "are you still watching" popup
                setTimeout(() => {
                    let button = document.querySelector('yt-confirm-dialog-renderer #confirm-button');
                    if (button && !!(button.offsetWidth || button.offsetHeight || button.getClientRects().length)) {
                        if (script.debug) { console.log("### Clicking confirm button popup ###"); }
                        button.click();
                    }
                }, 1000);
            }
        }

        function initQueueRenderedObserver() {
            if (script.queue_rendered_observer) {
                script.queue_rendered_observer.disconnect();
            }

            // if the queue is completely rendered, mutationCount is equal to the queue size
            // => initialize queue button listeners for Play Now, Play Next and Remove
            let mutationCount = 0;
            script.queue_rendered_observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutationCount += mutation.addedNodes.length;
                    if (mutationCount === script.queue.size()) {
                        initQueueButtons();
                        script.queue_rendered_observer.disconnect();
                    }
                });
            });

            let observable = document.querySelector('#youtube-play-next-queue-renderer > #contents');
            script.queue_rendered_observer.observe(observable, { childList: true });
        }

        function initPlayNextDataObserver() {
            if (script.playnext_data_observer) {
                script.playnext_data_observer.disconnect();
            }

            // If youtube updates the videoplayer with the autoplay suggestion,
            // replace it with the next video in our queue.
            script.playnext_data_observer = new MutationObserver(function(mutations) {
                if (!script.queue.isEmpty() && script.queue_visible) {
                    if (isPlaylist()) {
                        if (script.debug) { console.log("Play next observer triggered but found playlist, hiding current queue"); }
                        hideQueue();
                    } else {
                        forEach(mutations, function(mutation) {
                            if (mutation.attributeName === "href") {
                                let nextVideoId = getVideoIdFromUrl(document.querySelector('.ytp-next-button').href);
                                let nextQueueItem = script.queue.peek();
                                if (nextQueueItem.id !== nextVideoId) {
                                    if (script.debug) { console.log("SetAsNextVideo: PlayNextDataObserver"); }
                                    nextQueueItem.setAsNextVideo();
                                }
                            }
                        });
                    }
                }
            });

            let observable = document.querySelector('.ytp-next-button');
            script.playnext_data_observer.observe(observable, { attributes: true });
        }

        // *** VIDEOPLAYER *** //

        function getVideoPlayer() {
            return insp(document.getElementById('movie_player'));
        }

        function isPlayerAvailable() {
            script.ytplayer =  getVideoPlayer();
            return script.ytplayer !== null && !!script.ytplayer.getVideoData().video_id;
        }

        function isPlaylist() {
            return !!script.ytplayer.getVideoStats().list || !document.querySelector('ytd-playlist-panel-renderer.ytd-watch-flexy[hidden]');
        }

        // function isLivePlayer() {
        //     return script.ytplayer.getVideoData().isLive;
        // }

        // function isPlayerFullscreen() {
        //     return script.ytplayer.classList.contains('ytp-fullscreen');
        // }

        function isPlayerMinimized() {
            return !!document.querySelector('ytd-miniplayer[active][enabled]');
        }

        function isWatchPage() {
            return !!insp(document.querySelector('ytd-app')).__data.isWatchPage;
        }

        function getVideoData(element) {
            let data = insp(element).__data.data;

            if (data.content) {
                return data.content.videoRenderer;
            } else {
                return data;
            }
        }

        function getAutoplaySuggestion() {
            return document.querySelector('ytd-compact-autoplay-renderer ytd-compact-video-renderer') || document.querySelector('#related > ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer');
        }

        function getVideoIdFromUrl(url) {
            let o = null;
            try {
                o = new URL(url);
            } catch (e) { }
            let v = (o.searchParams ? o.searchParams.get('v') : '') || '';
            return v;
        }

        // function getVideoInfoFromUrl(url, info) {
        //     if (url.indexOf("?") === -1) {
        //         return null;
        //     }

        //     let urlVariables = url.split("?")[1].split("&");

        //     for(let i = 0; i < urlVariables.length; i++) {
        //         let varName = urlVariables[i].split("=");

        //         if (varName[0] === info) {
        //             return varName[1] === undefined ? null : varName[1];
        //         }
        //     }
        // }

        // *** OBJECTS *** //

        // QueueItem object
        class QueueItem {
            constructor(id, data, type) {
                this.id = id;
                this.data = data;
                this.type = type;
            }

            getVideoLength() {
                if (this.data.lengthText) {
                    return this.data.lengthText.simpleText;
                } else if (this.data.thumbnailOverlays && this.data.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) {
                    return this.data.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer.text.simpleText;
                } else {
                    return "";
                }
            }

            getSmallestThumb() {
                return this.data.thumbnail.thumbnails.reduce(function (thumb, currentSmallestThumb) {
                    return (currentSmallestThumb.height * currentSmallestThumb.width < thumb.height * thumb.width) ? currentSmallestThumb : thumb;
                });
            }

            getBiggestThumb() {
                return this.data.thumbnail.thumbnails.reduce(function (thumb, currentBiggestThumb) {
                    return (currentBiggestThumb.height * currentBiggestThumb.width > thumb.height * thumb.width) ? currentBiggestThumb : thumb;
                });
            }

            setAsNextVideo() {
                const PLAYING_STATE = 1;
                const PAUSED_STATE = 2;

                if (isPlaylist()) { return; }

                let currentVideoState = script.ytplayer.getPlayerState();
                if (currentVideoState !== PLAYING_STATE && currentVideoState !== PAUSED_STATE) {
                    return;
                }

                if (this.id === script.ytplayer.getVideoData().video_id) {
                    return;
                }

                if (script.debug) { console.log("changing next video"); }

                // next video autoplay settings
                let watchNextData = insp(document.querySelector('ytd-player')).__data.watchNextData;

                if (watchNextData && watchNextData.contents && watchNextData.contents.twoColumnWatchNextResults && watchNextData.playerOverlays && watchNextData.playerOverlays.playerOverlayRenderer) {
                    if (watchNextData.contents.twoColumnWatchNextResults.playlist) {
                        return;
                    }

                    let watchNextEndScreenRenderer = watchNextData.playerOverlays.playerOverlayRenderer.endScreen.watchNextEndScreenRenderer;
                    watchNextEndScreenRenderer.results[0].endScreenVideoRenderer = this.data;
                    watchNextEndScreenRenderer.results[0].endScreenVideoRenderer.lengthInSeconds = hmsToSeconds(this.getVideoLength());

                    let playerOverlayAutoplayRenderer = watchNextData.playerOverlays.playerOverlayRenderer.autoplay.playerOverlayAutoplayRenderer;
                    playerOverlayAutoplayRenderer.background.thumbnails = this.data.thumbnail.thumbnails;
                    playerOverlayAutoplayRenderer.byline = this.data.longBylineText || this.data.shortBylineText;
                    playerOverlayAutoplayRenderer.nextButton.buttonRenderer.navigationEndpoint = this.data.navigationEndpoint;
                    playerOverlayAutoplayRenderer.videoId = this.data.videoId;
                    playerOverlayAutoplayRenderer.videoTitle = this.data.title.simpleText || this.data.title.runs[0].text;

                    let autoplay = watchNextData.contents.twoColumnWatchNextResults.autoplay.autoplay;
                    autoplay.sets[0].autoplayVideo.watchEndpoint.videoId = this.data.videoId;

                    let watchNextResponse = { "raw_watch_next_response" : watchNextData};
                    script.ytplayer.updateVideoData(watchNextResponse);

                    if (!script.queue_visible) {
                        displayQueue();
                    }
                }
            }

            clearBadges() {
                this.data.badges = [];
            }

            addBadge(label, classes = []) {
                let badge = {
                    "metadataBadgeRenderer": {
                        "style": classes.join(" "),
                        "label": label
                    }
                };

                this.data.badges.push(badge);
            }

            toNode(classes = []) {
                let node = document.createElement("ytd-compact-video-renderer");
                node.classList.add("style-scope", "ytd-watch-next-secondary-results-renderer");
                classes.forEach(className => node.classList.add(className));
                node.data = this.data;
                return node;
            }

            static fromDOM(element) {
                let data = Object.assign({}, getVideoData(element));
                data.navigationEndpoint.watchEndpoint = { "videoId": data.videoId };
                data.navigationEndpoint.commandMetadata = { "webCommandMetadata": { "url": "/watch?v=" + data.videoId, webPageType: "WEB_PAGE_TYPE_WATCH" } };
                data.shortBylineText = data.shortBylineText || { "runs": [ { "text": data.title.accessibility.accessibilityData.label } ] };

                let id = data.videoId;
                let type = element.tagName.toLowerCase();

                return new QueueItem(id, data, type);
            }

            static fromJSON(json) {
                let data = json.data;
                let id = json.id;
                let type = json.type;
                return new QueueItem(id, data, type);
            }
        }

        // Queue object
        class Queue {
            constructor() {
                this.queue = [];
            }

            get() {
                return this.queue;
            }

            set(queue) {
                this.queue = queue;
                setCache("QUEUE", queue);
            }

            size() {
                return this.queue.length;
            }

            isEmpty() {
                return this.size() === 0;
            }

            contains(videoId) {
                for (let i = 0; i < this.queue.length; i++) {
                    if (this.queue[i].id === videoId) {
                        return true;
                    }
                }
                return false;
            }

            peek() {
                return this.queue[0];
            }

            enqueue(item) {
                this.queue.push(item);
                this.update();
                this.show(250);
            }

            dequeue() {
                let item = this.queue.shift();
                this.update();
                this.show(0);
                return item;
            }

            remove(index) {
                this.queue.splice(index, 1);
                this.update();
                this.show(250);
            }

            playNext(index) {
                let video = this.queue.splice(index, 1);
                this.queue.unshift(video[0]);
                this.update();
                this.show(0);
            }

            playNow() {
                script.ytplayer.nextVideo(true);
            }

            update() {
                setCache("QUEUE", this.get());
                if (script.debug) { console.log("updated queue: ", this.get().slice()); }
            }

            show(delay) {
                setTimeout(function() {
                    if (isPlayerAvailable()) {
                        displayQueue();
                    }
                }, delay);
            }

            reset() {
                this.queue = [];
                this.update();
                this.show(0);
            }
        }

        // *** QUEUE *** //

        function initQueue() {
            script.queue = new Queue();
            let cachedQueue = getCache("QUEUE");

            if (cachedQueue) {
                try {
                    cachedQueue = cachedQueue.map(queueItem => QueueItem.fromJSON(queueItem));
                    script.queue.set(cachedQueue);
                } catch(e) {
                    setCache("QUEUE", script.queue.get());
                }
            } else {
                setCache("QUEUE", script.queue.get());
            }
        }

        function displayQueue() {
            if (script.debug) { console.log("showing queue: ", script.queue.get()); }

            script.queue_visible = true;

            let queue = document.querySelector('#youtube-play-next-queue-renderer #contents');
            if (!queue && isWatchPage()) {
                let anchor = document.querySelector('#related');
                if (anchor) {
                    let node = document.createElement("ytd-item-section-renderer");
                    node.classList.add("style-scope", "ytd-watch-next-secondary-results-renderer", "youtube-play-next-queue");
                    node.id = "youtube-play-next-queue-renderer";
                    window.Polymer.dom(anchor).insertBefore(node, anchor.firstChild);
                    queue = document.querySelector('#youtube-play-next-queue-renderer #contents');
                }
            } else if (!queue) {
                return;
            }

            // clear current content
            queue.innerHTML = "";

            initQueueRenderedObserver();

            // don't show the queue on playlist pages
            if (isPlaylist()) {
                if (script.debug) { console.log("Playlist found, hiding queue"); }
                queue.parentNode.setAttribute("hidden", "");
                script.queue_visible = false;
                return;
            }

            // display new queue
            if (!script.queue.isEmpty()) {
                queue.parentNode.removeAttribute("hidden", "");

                let autoplay = document.querySelector('ytd-compact-autoplay-renderer #contents');
                if (autoplay) { autoplay.setAttribute("hidden", "") }

                forEach(script.queue.get(), function(item, index) {
                    try {
                        loadQueueItem(item, index, queue);
                    } catch (ex) {
                        console.log("Failed to display queue item", ex);
                    }
                });
            } else {
                queue.parentNode.setAttribute("hidden", "");

                let autoplay = document.querySelector('ytd-compact-autoplay-renderer #contents');
                if (autoplay) { autoplay.removeAttribute("hidden", ""); }

                // restore autoplay suggestion in video player
                if (script.debug) { console.log("SetAsNextVideo: Restore suggestion"); }
                let autoplaySuggestion = getAutoplaySuggestion();
                if (autoplaySuggestion) {
                    QueueItem.fromDOM(getAutoplaySuggestion()).setAsNextVideo();
                }

                script.queue_visible = false;
            }
        }

        function loadQueueItem(item, index, queueContents) {
            item.clearBadges();
            if (index === 0) {
                if (script.debug) { console.log("SetAsNextVideo: Load first queue item"); }
                item.setAsNextVideo();
                item.addBadge("Play Now", ["QUEUE_BUTTON", "QUEUE_PLAY_NOW"]);
                // item.addBadge("↓", ["QUEUE_BUTTON", "QUEUE_MOVE_DOWN"]);
                item.addBadge("Remove", ["QUEUE_BUTTON", "QUEUE_REMOVE"]);
            } else {
                item.addBadge("Play Next", ["QUEUE_BUTTON", "QUEUE_PLAY_NEXT"]);
                // item.addBadge("↑", ["QUEUE_BUTTON", "QUEUE_MOVE_UP"]);
                // item.addBadge("↓", ["QUEUE_BUTTON", "QUEUE_MOVE_DOWN"]);
                item.addBadge("Remove", ["QUEUE_BUTTON", "QUEUE_REMOVE"]);
            }
            window.Polymer.dom(queueContents).appendChild(item.toNode(["queue-item"]));
        }

        function hideQueue() {
            script.queue_visible = false;

            if (script.debug) { console.log("hiding queue"); }

            let queue = document.querySelector('#youtube-play-next-queue-renderer #contents');
            if (!queue) { return; }

            openToast("Youtube Play Next Queue hidden while playlist, mix or native youtube queue is active.");

            // clear current content
            queue.innerHTML = "";
            queue.parentNode.setAttribute("hidden", "");
        }

        // The "remove queue and all its videos" button
        function initRemoveQueueButton(anchor) {
            let html = "<div class=\"queue-button remove-queue\">Remove Queue</div>";
            anchor.innerHTML = html;

            if (!anchor.querySelector(".flex-whitebox")) {
                anchor.classList.add("flex-none");
                anchor.insertAdjacentHTML("afterend", "<div class=\"flex-whitebox\"></div>");
            }

            anchor.querySelector('.remove-queue').addEventListener("click", function handler(e) {
                e.preventDefault();
                script.queue.reset();
                this.parentNode.innerHTML = "Up next";
            });
        }

        // *** THUMB OVERLAYS *** //

        function addThumbOverlay(thumbOverlays) {
            // we don't use the toggled icon, that's why both have the same values.
            let overlay = {
                "thumbnailOverlayToggleButtonRenderer": {
                    "ytQueue": true,
                    "isToggled": false,
                    "toggledIcon": {iconType: "ADD"},
                    "toggledTooltip": "Queue",
                    "toggledAccessibility": {
                        "accessibilityData": {
                            "label": "Queue"
                        }
                    },
                    "untoggledIcon": {iconType: "ADD"},
                    "untoggledTooltip": "Queue",
                    "untoggledAccessibility": {
                        "accessibilityData": {
                            "label": "Queue"
                        }
                    }
                }
            };

            thumbOverlays.push(overlay);
        }

        function hasThumbOverlay(videoOverlays) {
            for(let i = 0; i < videoOverlays.length; i++) {
                if (videoOverlays[i].thumbnailOverlayToggleButtonRenderer && videoOverlays[i].thumbnailOverlayToggleButtonRenderer.ytQueue) {
                    return true;
                }
            }
            return false;
        }

        function initThumbOverlay(videoRenderer) {
            let videoData = getVideoData(videoRenderer);

            if (videoData && videoData.thumbnailOverlays && !hasThumbOverlay(videoData.thumbnailOverlays) && !videoData.upcomingEventData) {
                addThumbOverlay(videoData.thumbnailOverlays);
            }
        }

        function initThumbOverlays() {
            let videoRenderers = document.querySelectorAll('ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-video-renderer, ytd-playlist-video-renderer, ytd-rich-grid-video-renderer, ytd-rich-item-renderer');
            forEach(videoRenderers, function(videoRenderer) {
                initThumbOverlay(videoRenderer);
            });
        }

        function addThumbOverlayClickListeners() {
            let overlays = document.querySelectorAll('ytd-thumbnail-overlay-toggle-button-renderer > yt-icon');

            forEach(overlays, function(overlay) {
                overlay.removeEventListener("click", handleThumbOverlayClick);

                if (overlay.parentNode.getAttribute("aria-label") !== "Queue") {
                    return;
                }

                overlay.addEventListener("click", handleThumbOverlayClick);
            });
        }

        function handleThumbOverlayClick(event) {
            event.stopPropagation(); event.preventDefault();

            let path = event.path || (event.composedPath && event.composedPath()) || event._composedPath;
            for(let i = 0; i < path.length; i++) {
                let tagNames = ["YTD-COMPACT-VIDEO-RENDERER", "YTD-GRID-VIDEO-RENDERER", "YTD-VIDEO-RENDERER", "YTD-PLAYLIST-VIDEO-RENDERER", "YTD-RICH-GRID-VIDEO-RENDERER", "YTD-RICH-ITEM-RENDERER"];
                if (tagNames.includes(path[i].tagName)) {
                    let newQueueItem = QueueItem.fromDOM(path[i]);
                    if (!script.queue.contains(newQueueItem.id)) {
                        script.queue.enqueue(newQueueItem);

                        if (script.queue_visible && (isWatchPage() || isPlayerMinimized())) {
                            openToast("Video Added to Queue!", event.target);
                        } else if (isPlaylist()) {
                            openToast("Video Added to Queue! Queue is hidden while playlist, mix or native youtube queue is active", event.target);
                        } else {
                            openToast("Video Added to Queue! Play any video to view it.", event.target);
                        }
                    } else {
                        openToast("Video Already Queued", event.target);
                    }
                    break;
                }
            }
        }

        // *** BUTTONS *** //

        function initQueueButtons() {
            // initQueueButtonAction("queue-play-now", () => script.queue.playNow());
            initQueueButtonAction("queue-play-next", (pos) => script.queue.playNext(pos+1));
            initQueueButtonAction("queue-remove", (pos) => script.queue.remove(pos));
        }

        function initQueueButtonAction(className, btnAction) {
            let buttons = document.getElementsByClassName(className);

            forEach(buttons, function(button, index) {
                let pos = index;
                if (!button.classList.contains("button-listener")) {
                    button.addEventListener("click", function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        btnAction(pos);
                    });
                    button.classList.add("button-listener");
                }
            });
        }

        // *** POPUPS *** //

        function openToast(text, target) {
            let openPopupAction = {
                "openPopupAction": {
                    "popup": {
                        "notificationActionRenderer": {
                            "responseText": {simpleText: text},
                            "trackingParams": ""
                        }
                    },
                    "popupType": "TOAST"
                }
            };

            let popupContainer = document.querySelector('ytd-popup-container');
            if (popupContainer.handleOpenPopupAction_) {
                popupContainer.handleOpenPopupAction_(openPopupAction, target || document.documentElement);
            } else {
                popupContainer.handleOpenPopupAction(openPopupAction, target || document.documentElement);
            }
        }

        // *** LOCALSTORAGE *** //

        function getCache(key) {
            return JSON.parse(localStorage.getItem("YTQUEUE-MODERN#" + script.version + "#" + key));
        }

        function deleteCache(key) {
            localStorage.removeItem("YTQUEUE-MODERN#" + script.version + "#" + key);
        }

        function setCache(key, value) {
            localStorage.setItem("YTQUEUE-MODERN#" + script.version + "#" + key, JSON.stringify(value));
        }

        // *** CSS *** //

        // injecting css
        function injectCSS() {
            let css = `
#youtube-play-next-queue-renderer {
    height: 310px;
    position: sticky; /* needed for chrome to show resize handler */
    border: 1px solid var(--yt-spec-10-percent-layer);
    padding: 5px 0 0 5px;
    margin-bottom: 16px;
    overflow-y: visible;
    overflow-x: hidden;
    resize: vertical;
}

ytd-compact-autoplay-renderer > #contents { padding-bottom: 8px }

.queue-item { margin-top: 0px !important; margin-bottom: 6px !important; }
.queue-item #metadata-line { display: none; }

.queue-button { height: 15px; line-height: 1.7rem !important; padding: 5px !important; margin: 5px 3px !important; cursor: default; z-index: 99; background-color: var(--yt-spec-10-percent-layer); color: var(--yt-spec-text-secondary); }
.queue-button.queue-play-now, .queue-button.queue-play-next { margin: 5px 3px 5px 0 !important; }
.queue-button:hover { box-shadow: 0px 0px 3px black; }
[dark] .queue-button:hover { box-shadow: 0px 0px 3px white; }

ytd-thumbnail-overlay-toggle-button-renderer[aria-label=Queue] { bottom: 0; top: auto !important; right: auto; left: 0; }
ytd-thumbnail-overlay-toggle-button-renderer[aria-label=Queue] #label-container { left: 28px !important; right: auto !important; }
ytd-thumbnail-overlay-toggle-button-renderer[aria-label=Queue] #label-container > #label { padding: 0 8px 0 2px !important; }
ytd-thumbnail-overlay-toggle-button-renderer[aria-label=Queue] paper-tooltip { right: -70px !important; left: auto !important }
.queue-item ytd-thumbnail-overlay-toggle-button-renderer[aria-label=Queue] { display: none; }

ytd-thumbnail-overlay-toggle-button-renderer[aria-label=Queued] { display: none; }
`;

            let style = document.createElement("style");
            style.type = "text/css";
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            (document.body || document.head || document.documentElement).appendChild(style);
        }

        // *** FUNCTIONALITY *** //

        function forEach(array, callback, scope) {
            for (let i = 0; i < array.length; i++) {
                callback.call(scope, array[i], i);
            }
        }

        // When you want to remove elements
        function forEachReverse(array, callback, scope) {
            for (let i = array.length - 1; i >= 0; i--) {
                callback.call(scope, array[i], i);
            }
        }

        // hh:mm:ss => only seconds
        function hmsToSeconds(str) {
            let p = str.split(":"),
                s = 0, m = 1;

            while (p.length > 0) {
                s += m * parseInt(p.pop(), 10);
                m *= 60;
            }

            return s;
        }
    }

    function youtube_search_while_watching_video() {

        const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

        let script = {
            initialized: false,

            ytplayer: null,

            search_bar: null,
            search_autocomplete: null,
            search_suggestions: [],
            searched: false,

            debug: false
        };

        document.addEventListener("DOMContentLoaded", initScript);

        // reload script on page change using youtube polymer fire events
        window.addEventListener("yt-page-data-updated", function(event) {
            if (script.debug) { console.log("# page updated #"); }
            cleanupSearch();
            startScript(2);
        });

        function initScript() {
            if (script.debug) { console.log("### Youtube Search While Watching Video Initializing ###"); }

            initSearch();
            injectCSS();

            if (script.debug) { console.log("### Youtube Search While Watching Video Initialized ###"); }
            script.initialized = true;

            startScript(5);
        }

        function startScript(retry) {
            if (script.initialized && isPlayerAvailable()) {
                if (script.debug) { console.log("videoplayer is available"); }
                if (script.debug) { console.log("ytplayer: ", script.ytplayer); }

                if (script.ytplayer) {
                    try {
                        if (script.debug) { console.log("initializing search"); }
                        loadSearch();
                    } catch (error) {
                        console.log("Failed to initialize search: ", (script.debug) ? error : error.message);
                    }
                }
            } else if (retry > 0) { // fix conflict with Youtube+ script
                setTimeout( function() {
                    startScript(--retry);
                }, 1000);
            } else {
                if (script.debug) { console.log("videoplayer is unavailable"); }
            }
        }

        // *** VIDEOPLAYER *** //

        function getVideoPlayer() {
            return document.getElementById('movie_player');
        }

        function isPlayerAvailable() {
            script.ytplayer = getVideoPlayer();
            return script.ytplayer !== null && script.ytplayer.getVideoData().video_id;
        }

        function isPlaylist() {
            return script.ytplayer.getVideoStats().list;
        }

        function isLivePlayer() {
            return script.ytplayer.getVideoData().isLive;
        }

        // *** SEARCH *** //

        function initSearch() {
            // callback function for search suggestion results
            window.suggestions_callback = suggestionsCallback;
        }

        function loadSearch() {
            // prevent double searchbar
            let playlistOrLiveSearchBar = document.querySelector('#suggestions-search.playlist-or-live');
            if (playlistOrLiveSearchBar) { playlistOrLiveSearchBar.remove(); }

            let searchbar = document.getElementById('suggestions-search');
            if (!searchbar) {
                createSearchBar();
            } else {
                searchbar.value = "";
            }

            script.searched = false;
        }

        function cleanupSearch() {
            if (script.search_autocomplete) {
                script.search_autocomplete.destroy();
            }

            cleanupSuggestionRequests();
        }

        function createSearchBar() {
            let anchor, html;

            anchor = document.querySelector('ytd-compact-autoplay-renderer > #contents');
            if (anchor) {
                html = "<input id=\"suggestions-search\" type=\"search\" placeholder=\"Search\">";
                anchor.insertAdjacentHTML("afterend", html);
            } else { // playlist, live video or experimental youtube layout (where autoplay is not a separate renderer anymore)
                anchor = document.querySelector('#related > ytd-watch-next-secondary-results-renderer');
                if (anchor) {
                    html = "<input id=\"suggestions-search\" class=\"playlist-or-live\" type=\"search\" placeholder=\"Search\">";
                    anchor.insertAdjacentHTML("beforebegin", html);
                }
            }

            let searchBar = document.getElementById('suggestions-search');
            if (searchBar) {
                script.search_bar = searchBar;

                script.search_autocomplete = new window.autoComplete({
                    selector: '#suggestions-search',
                    minChars: 1,
                    delay: 100,
                    source: function(term, suggest) {
                        script.search_suggestions = {
                            query: term,
                            suggest: suggest
                        };
                        searchSuggestions(term);
                    },
                    onSelect: function(event, term, item) {
                        prepareNewSearchRequest(term);
                    }
                });

                script.search_bar.addEventListener("keyup", function(event) {
                    if (this.value === "") {
                        resetSuggestions();
                    }
                });

                // seperate keydown listener because the search listener blocks keyup..?
                script.search_bar.addEventListener("keydown", function(event) {
                    const ENTER = 13;
                    if (this.value.trim() !== "" && (event.key == "Enter" || event.keyCode === ENTER)) {
                        prepareNewSearchRequest(this.value.trim());
                    }
                });

                script.search_bar.addEventListener("search", function(event) {
                    if(this.value === "") {
                        script.search_bar.blur(); // close search suggestions dropdown
                        script.search_suggestions = []; // clearing the search suggestions

                        resetSuggestions();
                    }
                });

                script.search_bar.addEventListener("focus", function(event) {
                    this.select();
                });
            }
        }

        // callback from search suggestions attached to window
        function suggestionsCallback(data) {
            if (script.debug) { console.log(data); }

            let query = data[0];
            if (query !== script.search_suggestions.query) {
                return;
            }

            let raw = data[1]; // extract relevant data from json
            let suggestions = raw.map(function(array) {
                return array[0]; // change 2D array to 1D array with only suggestions
            });

            script.search_suggestions.suggest(suggestions);
        }

        function searchSuggestions(query) {
            // youtube search parameters
            const GeoLocation = window.yt.config_.INNERTUBE_CONTEXT_GL;
            const HostLanguage = window.yt.config_.INNERTUBE_CONTEXT_HL;

            if (script.debug) { console.log("suggestion request send", query); }
            let scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.className = "suggestion-request";
            scriptElement.src = "https://clients1.google.com/complete/search?client=youtube&hl=" + HostLanguage + "&gl=" + GeoLocation + "&gs_ri=youtube&ds=yt&q=" + encodeURIComponent(query) + "&callback=suggestions_callback";
            (document.body || document.head || document.documentElement).appendChild(scriptElement);
        }

        function cleanupSuggestionRequests() {
            let requests = document.getElementsByClassName('suggestion-request');
            forEachReverse(requests, function(request) {
                request.remove();
            });
        }

        // send new search request (with the search bar)
        function prepareNewSearchRequest(value) {
            if (script.debug) { console.log("searching for " + value); }

            script.search_bar.blur(); // close search suggestions dropdown
            script.search_suggestions = []; // clearing the search suggestions
            cleanupSuggestionRequests();

            sendSearchRequest("https://www.youtube.com/results?pbj=1&search_query=" + encodeURIComponent(value));
        }

        // given the url, retrieve the search results
        function sendSearchRequest(url) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    processSearch(xmlHttp.responseText);
                }
            };

            xmlHttp.open("GET", url, true);
            xmlHttp.setRequestHeader("x-youtube-client-name", window.yt.config_.INNERTUBE_CONTEXT_CLIENT_NAME);
            xmlHttp.setRequestHeader("x-youtube-client-version", window.yt.config_.INNERTUBE_CONTEXT_CLIENT_VERSION);
            xmlHttp.setRequestHeader("x-youtube-client-utc-offset", new Date().getTimezoneOffset() * -1);

            if (window.yt.config_.ID_TOKEN) { // null if not logged in
                xmlHttp.setRequestHeader("x-youtube-identity-token", window.yt.config_.ID_TOKEN);
            }

            xmlHttp.send(null);
        }

        // process search request
        function processSearch(responseText) {
            try {
                let data = JSON.parse(responseText);

                let found = searchJson(data, (key, value) => {
                    if (key === "itemSectionRenderer") {
                        if (script.debug) { console.log(value.contents); }
                        let succeeded = createSuggestions(value.contents);
                        return succeeded;
                    }
                    return false;
                });

                if (!found) {
                    alert("The search request was succesful but the script was unable to parse the results");
                }
            } catch (error) {
                alert("Failed to retrieve search data, sorry!\nError message: " + error.message + "\nSearch response: " + responseText);
            }
        }

        function searchJson(json, func) {
            let found = false;

            for (let item in json) {
                found = func.apply(this, [item, json[item]]);
                if (found) { break; }

                if (json[item] !== null && typeof(json[item]) == "object") {
                    found = searchJson(json[item], func);
                    if (found) { break; }
                }
            }

            return found;
        }

        // *** HTML & CSS *** //

        function createSuggestions(data) {
            // filter out promotional stuff
            if (data.length < 10) {
                return false;
            }

            // remove current suggestions
            let hidden_continuation_item_renderer;
            let watchRelated = document.querySelector('#related ytd-watch-next-secondary-results-renderer #items ytd-item-section-renderer #contents') || document.querySelector('#related ytd-watch-next-secondary-results-renderer #items');
            forEachReverse(watchRelated.children, function(item) {
                if (item.tagName === "YTD-CONTINUATION-ITEM-RENDERER") {
                    item.setAttribute("hidden", "");
                    hidden_continuation_item_renderer = item;
                } else if (item.tagName !== "YTD-COMPACT-AUTOPLAY-RENDERER") {
                    item.remove();
                }
            });

            // create suggestions
            forEach(data, function(videoData) {
                if (videoData.videoRenderer || videoData.compactVideoRenderer) {
                    window.Polymer.dom(watchRelated).appendChild(videoQueuePolymer(videoData.videoRenderer || videoData.compactVideoRenderer, "ytd-compact-video-renderer"));
                } else if (videoData.radioRenderer || videoData.compactRadioRenderer) {
                    window.Polymer.dom(watchRelated).appendChild(videoQueuePolymer(videoData.radioRenderer || videoData.compactRadioRenderer, "ytd-compact-radio-renderer"));
                } else if (videoData.playlistRenderer || videoData.compactPlaylistRenderer) {
                    window.Polymer.dom(watchRelated).appendChild(videoQueuePolymer(videoData.playlistRenderer || videoData.compactPlaylistRenderer, "ytd-compact-playlist-renderer"));
                }
            });

            if (hidden_continuation_item_renderer) {
                watchRelated.appendChild(hidden_continuation_item_renderer);
            }

            script.searched = true;

            return true;
        }

        function resetSuggestions() {
            if (script.searched) {
                let itemSectionRenderer = document.querySelector('#related ytd-watch-next-secondary-results-renderer #items ytd-item-section-renderer') || document.querySelector("#related ytd-watch-next-secondary-results-renderer");
                let data = insp(itemSectionRenderer).__data.data;
                createSuggestions(data.contents || data.results);

                // restore continuation renderer
                let continuation = itemSectionRenderer.querySelector('ytd-continuation-item-renderer[hidden]');
                if (continuation) {
                    continuation.removeAttribute("hidden");
                }
            }

            script.searched = false;
        }

        function videoQueuePolymer(videoData, type) {
            let node = document.createElement(type);
            node.classList.add("style-scope", "ytd-watch-next-secondary-results-renderer", "yt-search-generated");
            node.data = videoData;
            return node;
        }

        function injectCSS() {
            let css = `
.autocomplete-suggestions {
text-align: left; cursor: default; border: 1px solid var(--ytd-searchbox-legacy-border-color); border-top: 0; background: var(--ytd-searchbox-background);
position: absolute; /*display: none; z-index: 9999;*/ max-height: 254px; overflow: hidden; overflow-y: auto; box-sizing: border-box; box-shadow: -1px 1px 3px rgba(0,0,0,.1);
    left: auto; top: auto; width: 100%; margin: 0; contain: content; /* 1.2.0 */
}
.autocomplete-suggestion { position: relative; padding: 0 .6em; line-height: 23px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 1.22em; color: var(--ytd-searchbox-text-color); }
.autocomplete-suggestion b { font-weight: normal; color: #b31217; }
.autocomplete-suggestion.selected { background: #ddd; }
[dark] .autocomplete-suggestion.selected { background: #333; }

autocomplete-holder {
    overflow: visible; position: absolute; left: auto; top: auto; width: 100%; height: 0; z-index: 9999; box-sizing: border-box; margin:0; padding:0; border:0; contain: size layout;
}

ytd-compact-autoplay-renderer { padding-bottom: 0px; }

#suggestions-search {
outline: none; width: 100%; padding: 6px 5px; margin-bottom: 16px;
border: 1px solid var(--ytd-searchbox-legacy-border-color); border-radius: 2px 0 0 2px;
box-shadow: inset 0 1px 2px var(--ytd-searchbox-legacy-border-shadow-color);
color: var(--ytd-searchbox-text-color); background-color: var(--ytd-searchbox-background);
}
`;

            let style = document.createElement("style");
            style.type = "text/css";
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            (document.body || document.head || document.documentElement).appendChild(style);
        }

        // *** FUNCTIONALITY *** //

        function forEach(array, callback, scope) {
            for (let i = 0; i < array.length; i++) {
                callback.call(scope, array[i], i);
            }
        }

        // When you want to remove elements
        function forEachReverse(array, callback, scope) {
            for (let i = array.length - 1; i >= 0; i--) {
                callback.call(scope, array[i], i);
            }
        }
    }

    // ================================================================================= //
    // =============================== INJECTING SCRIPTS =============================== //
    // ================================================================================= //

    document.documentElement.setAttribute("youtube-play-next-queue", "");

    if (!document.getElementById("autocomplete_script")) {
        let autoCompleteScript = document.createElement('script');
        autoCompleteScript.id = "autocomplete_script";
        autoCompleteScript.appendChild(document.createTextNode('window.autoComplete = ' + autoComplete + ';'));
        (document.body || document.head || document.documentElement).appendChild(autoCompleteScript);
    }

    if (!document.getElementById("play_next_queue_script")) {
        let playNextQueueScript = document.createElement('script');
        playNextQueueScript.id = "play_next_queue_script";
        playNextQueueScript.appendChild(document.createTextNode('('+ youtube_play_next_queue_modern +')();'));
        (document.body || document.head || document.documentElement).appendChild(playNextQueueScript);
    }

    if (!document.getElementById("search_while_watching_video")) {
        let searchWhileWatchingVideoScript = document.createElement('script');
        searchWhileWatchingVideoScript.id = "search_while_watching_video";
        searchWhileWatchingVideoScript.appendChild(document.createTextNode('('+ youtube_search_while_watching_video +')();'));
        (document.body || document.head || document.documentElement).appendChild(searchWhileWatchingVideoScript);
    }
})();