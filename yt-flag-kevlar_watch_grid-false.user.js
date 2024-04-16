// ==UserScript==
// @name        YouTube: kevlar_watch_grid = false
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.1
// @author      CY Fung
// @description Disable kevlar_watch_grid
// @run-at      document-start
// @inject-into page
// @unwrap
// @require     https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
// @license     MIT
// ==/UserScript==

(() => {
  window._ytConfigHacks.add((config_) => {
    const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS;
    if (EXPERIMENT_FLAGS) {
      EXPERIMENT_FLAGS.kevlar_watch_grid = false;
    }
  });
})();