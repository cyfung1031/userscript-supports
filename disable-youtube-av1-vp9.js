// ==UserScript==
// @name                Disable YouTube AV1 and VP9
// @description         Disable AV1 and VP9 for video playback on YouTube
// @name:zh-TW          停用 YouTube AV1 和 VP9
// @description:zh-TW   停用 YouTube 的 AV1 和 VP9 影片播放
// @name:zh-HK          停用 YouTube AV1 和 VP9
// @description:zh-HK   停用 YouTube 的 AV1 和 VP9 影片播放
// @name:zh-CN          停用 YouTube AV1 和 VP9
// @description:zh-CN   停用 YouTube 的 AV1 和 VP9 视频播放
// @name:ja             YouTube AV1 と VP9 の停用
// @description:ja      YouTube の動画再生に AV1 と VP9 を停用する
// @name:ko             YouTube AV1과 VP9 비활성화
// @description:ko      YouTube의 동영상 재생에 AV1과 VP9를 비활성화하기
// @name:vi             Vô hiệu hóa YouTube AV1 và VP9
// @description:vi      Vô hiệu hóa AV1 và VP9 để phát video trên YouTube
// @name:de             YouTube AV1 und VP9 deaktivieren
// @description:de      Deaktiviert AV1 und VP9 für die Videowiedergabe auf YouTube
// @name:fr             Désactiver YouTube AV1 et VP9
// @description:fr      Désactivez AV1 et VP9 pour la lecture des vidéos sur YouTube
// @name:it             Disabilita YouTube AV1 e VP9
// @description:it      Disabilita AV1 e VP9 per la riproduzione dei video su YouTube
// @name:es             Desactivar AV1 y VP9 en YouTube
// @description:es      Desactivar AV1 y VP9 para la reproducción de videos en YouTube
// @namespace           http://tampermonkey.net/
// @version             1.0.2
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
// @allFrames
// @inject-into page
// ==/UserScript==

(function () {
    'use strict';
  
    console.debug("disable-youtube-av1-and-vp9", "injected");
  
    function disableAV1() {
  
      console.debug("disable-youtube-av1-and-vp9", "AV1 disabled");
  
  
      // This is the setting to disable AV1
      // localStorage['yt-player-av1-pref'] = '-1';
      Object.defineProperty(localStorage, 'yt-player-av1-pref', { value: '-1', writable: true, enumerable: true, configurable: true });
  
      function typeTest(type) {
  
  
        let disallowed_types = ['vp8', 'vp9', 'av1', 'av01', 'vp09'];
        for (const disallowed_type of disallowed_types) {
          if (type.includes(disallowed_type)) return false;
        }
  
        let force_allow_types = ['hev1'];
        for (const force_allow_type of force_allow_types) {
          if (type.includes(force_allow_type)) return true;
        }
  
      }
  
      // return a custom MIME type checker that can defer to the original function
      function makeModifiedTypeChecker(origChecker) {
        // Check if a video type is allowed
        return function (type) {
          let res = undefined;
          if (type === undefined) res = false;
          else {
            res = typeTest(type);
          }
          if (res === undefined) res = origChecker.apply(this, arguments);
  
          // console.debug(20, type, res)
  
          return res;
        };
      }
  
      // Override video element canPlayType() function
      const proto = (HTMLVideoElement || 0).prototype;
      if (proto && typeof proto.canPlayType == 'function') {
        proto.canPlayType = makeModifiedTypeChecker(proto.canPlayType);
      }
  
      // Override media source extension isTypeSupported() function
      const mse = window.MediaSource;
      // Check for MSE support before use
      if (mse && typeof mse.isTypeSupported == 'function') {
        mse.isTypeSupported = makeModifiedTypeChecker(mse.isTypeSupported);
      }
  
    }
  
  
    disableAV1();
  
  
  
  
  })();