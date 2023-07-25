// ==UserScript==
// @name                YouTube Live Chat Tamer
// @namespace           http://tampermonkey.net/
// @version             2023.07.25.1
// @license             MIT License
// @author              CY Fung
// @match               https://www.youtube.com/live_chat*
// @match               https://www.youtube.com/live_chat_replay*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page

// @description         (Deprecated) to maximize the performance of YouTube Live Chat Refresh

// ==/UserScript==

console.warn(
    "%cYouTube Live Chat Tamer is no longer maintained (deprecated). \n" +
    "Please visit and install https://greasyfork.org/scripts/469878 instead.",
    "color: #4ba5dc; font-weight: 600; padding: 4px;");
