// ==UserScript==
// @name                Disable YouTube AV1
// @description         Disable AV1 for video playback on YouTube
// @name:zh-TW          停用 YouTube AV1
// @description:zh-TW   停用 YouTube 的 AV1 影片播放
// @name:zh-HK          停用 YouTube AV1
// @description:zh-HK   停用 YouTube 的 AV1 影片播放
// @name:zh-CN          停用 YouTube AV1
// @description:zh-CN   停用 YouTube 的 AV1 视频播放
// @name:ja             YouTube AV1 停用
// @description:ja      YouTube の動画再生に AV1 を停用する
// @name:ko             YouTube AV1 비활성화
// @description:ko      YouTube의 동영상 재생에 AV1을 비활성화하기
// @name:vi             Vô hiệu hóa YouTube AV1
// @description:vi      Vô hiệu hóa AV1 để phát video trên YouTube
// @name:de             YouTube AV1 deaktivieren
// @description:de      Deaktiviert AV1 für die Videowiedergabe auf YouTube
// @name:fr             Désactiver YouTube AV1
// @description:fr      Désactivez AV1 pour la lecture des vidéos sur YouTube
// @name:it             Disabilita YouTube AV1
// @description:it      Disabilita AV1 per la riproduzione dei video su YouTube
// @name:es             Desactivar AV1 en YouTube
// @description:es      Desactivar AV1 para la reproducción de videos en YouTube
// @namespace           http://tampermonkey.net/
// @version             2.0.1
// @author              CY Fung
// @match               https://www.youtube.com/*
// @match               https://www.youtube.com/embed/*
// @match               https://www.youtube-nocookie.com/embed/*
// @exclude             https://www.youtube.com/live_chat*
// @exclude             https://www.youtube.com/live_chat_replay*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant               none
// @run-at              document-start
// @license             MIT
// @compatible          chrome
// @compatible          firefox
// @compatible          opera
// @compatible          edge
// @compatible          safari
// @unwrap
// @allFrames           true
// @inject-into         page
// ==/UserScript==

console.log("Disable YouTube AV1", "This script is abandoned by the author. Please uninstall it.");
