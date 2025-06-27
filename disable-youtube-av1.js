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
// @version             2.4.5
// @author              CY Fung
// @match               https://www.youtube.com/*
// @match               https://www.youtube.com/embed/*
// @match               https://www.youtube-nocookie.com/embed/*
// @match               https://m.youtube.com/*
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

(function () {
  'use strict';

  console.debug("disable-youtube-av1", "injected");

  const supportedFormatsConfig = () => {

    function typeTest(type) {

      if (typeof type === 'string' && type.startsWith('video/')) {
        if (type.includes('av01')) {
          if (/codecs[\x20-\x7F]+\bav01\b/.test(type)) return false;
        } else if (type.includes('av1')) {
          if (/codecs[\x20-\x7F]+\bav1\b/.test(type)) return false;
        }
      }

    }

    // return a custom MIME type checker that can defer to the original function
    function makeModifiedTypeChecker(origChecker, dx) {
      // Check if a video type is allowed
      return function (type) {
        let res = undefined;
        if (type === undefined) res = false;
        else res = typeTest(type);
        if (res === undefined) res = origChecker.apply(this, arguments);
        else res = !dx ? res : (res ? "probably" : "");

        // console.debug(20, type, res)

        return res;
      };
    }

    // Override video element canPlayType() function
    const proto = (HTMLVideoElement || 0).prototype;
    if (proto && typeof proto.canPlayType == 'function') {
      proto.canPlayType = makeModifiedTypeChecker(proto.canPlayType, true);
    }

    // Override media source extension isTypeSupported() function
    const mse = window.MediaSource;
    // Check for MSE support before use
    if (mse && typeof mse.isTypeSupported == 'function') {
      mse.isTypeSupported = makeModifiedTypeChecker(mse.isTypeSupported);
    }

  };

  function disableAV1() {

    // This is the setting to disable AV1 [ 480p (or below) - AV1, above 480p - VP9 ]
    // localStorage['yt-player-av1-pref'] = '480';
    try {
      Object.defineProperty(localStorage.constructor.prototype, 'yt-player-av1-pref', {
        get() {
          if (this === localStorage) return '480';
          return this.getItem('yt-player-av1-pref');
        },
        set(nv) {
          this.setItem('yt-player-av1-pref', nv);
          return true;
        },
        enumerable: true,
        configurable: true
      });
    } catch (e) {
      // localStorage['yt-player-av1-pref'] = '480';
    }

    if (localStorage['yt-player-av1-pref'] !== '480') {

      console.warn('disable-youtube-av1', '"yt-player-av1-pref = 480" is not supported in your browser.');
      return;
    }

    console.debug("disable-youtube-av1", "AV1 disabled by yt-player-av1-pref = 480");

  }

  disableAV1();

  supportedFormatsConfig();

})();
