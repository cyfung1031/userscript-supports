// ==UserScript==
// @name                Force YouTube AV1
// @description         Force YouTube to use AV1 for video playback
// @name:zh-TW          強制 YouTube AV1
// @description:zh-TW   強制 YouTube 使用 AV1 進行影片播放
// @name:zh-HK          強制 YouTube AV1
// @description:zh-HK   強制 YouTube 使用 AV1 進行影片播放
// @name:zh-CN          强制 YouTube AV1
// @description:zh-CN   强制 YouTube 使用 AV1 进行视频播放
// @name:ja             YouTube AV1 強制再生
// @description:ja      YouTube の動画再生に AV1 を強制的に使用する
// @name:ko             YouTube AV1 강제 사용
// @description:ko      YouTube의 동영상 재생에 AV1을 강제로 사용하기
// @name:vi             Bắt buộc YouTube sử dụng AV1
// @description:vi      Bắt buộc YouTube sử dụng AV1 để phát video
// @name:de             YouTube AV1 erzwingen
// @description:de      Erzwingt die Verwendung von AV1 für die Videowiedergabe auf YouTube
// @name:fr             Forcer YouTube AV1
// @description:fr      Force YouTube à utiliser AV1 pour la lecture des vidéos
// @name:it             Forza YouTube AV1
// @description:it      Forza YouTube a utilizzare AV1 per la riproduzione dei video
// @name:es             Forzar AV1 en YouTube
// @description:es      Forzar a YouTube a usar AV1 para la reproducción de videos
// @namespace           http://tampermonkey.net/
// @version             1.0.4
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
// @unwrap
// @allFrames
// @inject-into page
// ==/UserScript==

(function () {
  'use strict';

  console.debug("force-youtube-av1", "injected");

  function enableAV1() {

    console.debug("force-youtube-av1", "AV1 enabled");


    // This is the setting to force AV1
    // localStorage['yt-player-av1-pref'] = '8192';
    Object.defineProperty(localStorage, 'yt-player-av1-pref', { value: '8192', writable: true, enumerable: true, configurable: true });

    function typeTest(type) {


      let disallowed_types = ['vp8', 'vp9', 'avc1'];
      // mp4a is a container for AAC. In most cases (<192kbps), Opus is better than AAC.
      // vp09 will be also disabled if av1 is enabled.
      for (const disallowed_type of disallowed_types) {
        if (type.includes(disallowed_type)) return false;
      }

      let force_allow_types = ['av1', 'av01', 'hev1'];
      // av1 is currently supported by Firefox and Chrome except Edge
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


  let promise = null;

  function callback(result) {

    if (result && result.supported && result.smooth) enableAV1();
    else {
      console.warn("force-youtube-av1", 'Your browser does not support AV1. You might conside to use the latest version of Google Chrome or Mozilla FireFox.');

    }
  }


  try {
    promise = navigator.mediaCapabilities.decodingInfo({
      type: "file",
      video: {
        contentType: "video/mp4; codecs=av01.0.05M.08.0.110.05.01.06.0",
        height: 1080,
        width: 1920,
        framerate: 30,
        bitrate: 2826848,
      },
      audio: {
        contentType: "audio/webm; codecs=opus",
        channels: "2.1",
        samplerate: 44100,
        bitrate: 255236,
      }
    }).then(callback).catch(callback);

  } catch (e) {
    promise = null;
  }

  if (!promise) promise = Promise.resolve(0).then(callback).catch(callback);




})();