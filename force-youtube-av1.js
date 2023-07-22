// ==UserScript==
// @name                Use YouTube AV1
// @description         Use AV1 for video playback on YouTube
// @name:zh-TW          使用 YouTube AV1
// @description:zh-TW   使用 AV1 進行 YouTube 影片播放
// @name:zh-HK          使用 YouTube AV1
// @description:zh-HK   使用 AV1 進行 YouTube 影片播放
// @name:zh-CN          使用 YouTube AV1
// @description:zh-CN   使用 AV1 进行 YouTube 视频播放
// @name:ja             YouTube AV1 の使用
// @description:ja      YouTube の動画再生に AV1 を使用する
// @name:ko             YouTube AV1 사용
// @description:ko      YouTube의 동영상 재생에 AV1을 사용하기
// @name:vi             Sử dụng YouTube AV1
// @description:vi      Sử dụng AV1 để phát video trên YouTube
// @name:de             YouTube AV1 verwenden
// @description:de      Verwende AV1 für die Videowiedergabe auf YouTube
// @name:fr             Utiliser YouTube AV1
// @description:fr      Utiliser AV1 pour la lecture des vidéos sur YouTube
// @name:it             Usa YouTube AV1
// @description:it      Usa AV1 per la riproduzione dei video su YouTube
// @name:es             Usar AV1 en YouTube
// @description:es      Usar AV1 para la reproducción de videos en YouTube
// @namespace           http://tampermonkey.net/
// @version             1.0.8
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
// @allFrames           true
// @inject-into         page
// ==/UserScript==

(function (__Promise__) {
  'use strict';

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  console.debug("force-youtube-av1", "injected");

  function enableAV1() {

    console.debug("force-youtube-av1", "AV1 enabled");


    // This is the setting to force AV1
    // localStorage['yt-player-av1-pref'] = '8192';
    Object.defineProperty(localStorage, 'yt-player-av1-pref', { value: '8192', writable: true, enumerable: true, configurable: true });

    function typeTest(type) {


      let disallowed_types = ['vp8', 'vp9'];
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




})(Promise);