// ==UserScript==
// @name        yt-url-at-time
// @namespace   mechalynx/yt-url-at-time
// @license     MIT
// @grant       none
// @description On youtube, use alt+` to set the url to the current timestamp, for easy bookmarking
// @include     https://www.youtube.com/*
// @version     0.2.7
// @copyright   2017, MechaLynx (https://github.com/MechaLynx)
// @run-at document-idle
// @author      MechaLynx
// ==/UserScript==
// jshint esversion: 6


/**
 * 
 * This is the modified version from https://greasyfork.org/scripts/35760-yt-url-at-time/
 * 
 * MIT, credit to "MechaLynx"
 * 
 */

// `video` element utility
var video = {
  get element() {
    return document.querySelector('#movie_player video');
  },

  get _timehash() {
    var secs = Math.floor(this.element.currentTime);
    return [(h = ~~(secs / 3600)) && h + 'h' || null,
    (m = ~~(secs % 3600 / 60)) && m + 'm' || null,
    (s = ~~(secs % 3600 % 60)) && s + 's'].join('');
  },
  get _plaintimehash() {
    return Math.floor(this.element.currentTime);
  },

  // get timehash() {
  //   return 't=' + `${this._timehash}`;
  // },
  // get plaintimehash() {
  //   return 't=' + `${this._plaintimehash}`
  // },
  // get notimehash() {
  //   return window.location.origin +
  //   window.location.pathname +
  //   window.location.search +
  //   window.location.hash.replace(/#t=[^=#&]*/g, '');
  // },
  getURL(precise) {
    // const hash = precise ? `${video.notimehash}&${video.plaintimehash}` : `${video.notimehash}&${video.timehash}`;
    const uo = new URL(window.location.href.replace(/#t=[^=#&]*/g, ''));
    uo.searchParams.set('t', `${precise ? this._plaintimehash : this._timehash}`);
    return uo.toString();
  }
};

// Keep looking for the time indicator span, until it's found
// The `load` event is insufficient
var wait_for_page = window.setInterval(function () {
  var current_time_element = document.querySelector('.ytp-time-current');
  if (current_time_element) {
    window.clearInterval(wait_for_page);

    // Add CSS for time indicator span
    let time_style = document.createElement('style');
    time_style.setAttribute('name', "yt-url-at-time");
    time_style.innerHTML = `
      .url-at-time-element-hover:hover{
        cursor: pointer;
      }
      .url-at-time-clipboard-helper{
        position: absolute;
        top: 0;
        left: 0;
        padding: none;
        margin: none;
        border: none;
        width: 0;
        height: 0;
      }
	  `;
    document.body.appendChild(time_style);

    // Toggle the class so that it doesn't look clickable
    // during ads, which would be confusing
    current_time_element.onmouseover = function () {
      if (document.querySelector('.videoAdUi')) {
        current_time_element.classList.remove('url-at-time-element-hover');
      } else {
        current_time_element.classList.add('url-at-time-element-hover');
      }
    };

    current_time_element.addEventListener('click', function (e) {
      if (e.altKey) {
        hashmodifier(true);
      } else {
        hashmodifier(false);
      }

      if (e.ctrlKey) {
        copy_url_to_clipboard();
      }
    });
  }
}, 1000);


// Add the timestamp to the URL
var hashmodifier = function (precise = false) {
  if (location.href.match(/.*watch.*/) && document.querySelector('.videoAdUi') === null) {
    const hash = video.getURL(precise);
    history.replaceState(false, false, hash);
  }
};



var copy_url_to_clipboard = function (attempt_to_restore = false) {
  // Current focus and selection cannot be restored
  // since clicking on the timer causes the movie player to be focused
  // clearing the selection and changing the active element before we arrive here
  // However, attempting to restore them is meaningful if called through a hotkey
  if (attempt_to_restore) {
    var selection = document.getSelection();
    var current_selection = selection.getRangeAt(0);
    var current_focus = document.activeElement;
  }

  // Add invisible textarea to allow copying the generated URL to clipboard
  let clipboard_helper = document.createElement('textarea');
  clipboard_helper.classList.add('url-at-time-clipboard-helper');
  document.body.appendChild(clipboard_helper);

  clipboard_helper.value = window.location.href;
  clipboard_helper.select();
  clipboard_helper.setSelectionRange(0, clipboard_helper.value.length);
  document.execCommand('copy');

  document.body.removeChild(clipboard_helper);

  if (attempt_to_restore) {
    current_focus.focus();

    // https://gist.github.com/dantaex/543e721be845c18d2f92652c0ebe06aa
    selection.empty();
    selection.addRange(current_selection);
  }
};

var _alt = false;
var _q = false;
// Listen for the hotkey
document.addEventListener('keydown', z => {
  // if you want to change the hotkey
  // you can use this: http://mechalynx.github.io/keypress/
  // or another tester if you don't like this one
  if (z.code === 'KeyQ') {
    _q = true;
  }
  if (z.altKey && z.code === 'Backquote') {
    hashmodifier(_alt);
    _alt = true;
  }
  if (_q && _alt) {
    copy_url_to_clipboard(true);
  }
});

document.addEventListener('keyup', z => {
  if (!z.altKey) {
    _alt = false;
  }
  if (z.code === "KeyQ") {
    _q = false;
  }
});
