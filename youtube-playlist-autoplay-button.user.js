// ==UserScript==
// @name        YouTube Playlist Autoplay Button
// @description Allows the user to toggle autoplaying to the next video once the current video ends. Stores the setting locally.
// @version     2.0.7
// @license     GNU GPLv3
// @match       https://www.youtube.com/*
// @namespace   https://greasyfork.org/users/701907
// @require     https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@8fac46500c5a916e6ed21149f6c25f8d1c56a6a3/library/ytZara.js
// @require     https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@48a67f75465ee721fc1d39b6af82abcaa51b89d6/library/nextBrowserTick.min.js
// @run-at      document-start
// @unwrap
// @inject-into page
// @noframes
// ==/UserScript==

/**
 *
 * This is based on the [YouTube Prevent Playlist Autoplay](https://greasyfork.org/en/scripts/415542-youtube-prevent-playlist-autoplay)
 * GNU GPLv3 license, credited to [MegaScientifical](https://greasyfork.org/en/users/701907-megascientifical) (https://www.github.com/MegaScience)
 *
**/

/**
 * This script now is maintained by [CY Fung](https://greasyfork.org/en/users/371179)
 * It uses the technlogy same as Tabview Youtube and YouTube Super Fast Chat to achieve the robust implementation and high performance.
 *
 * This userscript supports Violentmonkey, Tampermonkey, Firemonkey, Stay, MeddleMonkey, etc. EXCEPT GreaseMonkey.
 *
**/

/**

Copyright (c) 2020-2023 MegaScientifical
Copyright (c) 2023 CY Fung

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 3
of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see http://www.gnu.org/licenses/.


**/

(async () => {

  const { insp, indr, isYtHidden } = ytZara;
  const Promise = (async () => { })().constructor;

  let debug = false
  const elementCSS = {
    parent: [
      '#playlist-action-menu[autoplay-container="1"] .top-level-buttons', // Playlist parent area in general.
      'ytd-playlist-panel-renderer[playlist-type] #playlist-action-menu[autoplay-container="2"]' // Playlist parent area for Mixes.
    ],
    cssId: 'YouTube-Prevent-Playlist-Autoplay-Style', // ID for the Style element to be injected into the page.
    buttonOn: 'YouTube-Prevent-Playlist-Autoplay-Button-On',
    buttonContainer: 'YouTube-Prevent-Playlist-Autoplay-Button-Container',
    buttonBar: 'YouTube-Prevent-Playlist-Autoplay-Button-Bar',
    buttonCircle: 'YouTube-Prevent-Playlist-Autoplay-Button-Circle'
  }
  const prefix = 'YouTube Prevent Playlist Autoplay:'
  const localStorageProperty = 'YouTubePreventPlaylistAutoplayStatus'
  // Get current autoplay setting from local storage.
  let autoplayStatus = loadAutoplayStatus()
  let transition = false
  let navigateStatus = -1;
  let fCounter = 0;

  // Instead of writing the same log function prefix throughout
  // the code, this function automatically applies the prefix.
  const customLog = (...inputs) => console.log(prefix, ...inputs)

  // Functions to get/set if you have autoplay off or on.
  // This applies to localStorage of the domain, so
  // clearing that will clear the stored value.
  function loadAutoplayStatus() {
    if (debug) customLog('Loading autoplay status.')
    return window.localStorage.getItem(localStorageProperty) === 'true'
  }

  function saveAutoplayStatus() {
    if (debug) customLog('Saving autoplay status.')
    window.localStorage.setItem(localStorageProperty, autoplayStatus)
  }

  // Ancient, common function for adding a style to the page.
  function addStyle(id, css) {
    if (document.getElementById(id) !== null) {
      if (debug) customLog('CSS has already been applied.')
      return
    }
    const head = document.head || document.getElementsByTagName('head')[0]
    if (!head) {
      if (debug) customLog('document.head is missing.')
      return
    }
    const style = document.createElement('style')
    style.id = id
    style.textContent = css
    head.appendChild(style)
  }

  // Sets the ability to autoplay based on the user's current setting,
  // then sets the state of all autoplay toggle switches in the page.
  function setAssociatedAutoplay() {
    const manager = getManager()
    if (!manager) {
      if (debug) customLog('Manager is missing.')
      return
    }
    if (typeof manager.canAutoAdvance_ !== 'boolean') {
      customLog('manager.canAutoAdvance_ is not boolean');
    } else {
      if (navigateStatus !== 1) manager.canAutoAdvance_ = !!autoplayStatus;
    }
    for (const b of document.body.getElementsByClassName(elementCSS.buttonContainer)) {
      b.classList.toggle(elementCSS.buttonOn, autoplayStatus)
      b.setAttribute('title', `Autoplay is ${autoplayStatus ? 'on' : 'off'}`)
    }
  }

  // Toggles the ability to autoplay, then sets the rest
  // and stores the current status of autoplay locally.
  function toggleAutoplay(e) {
    e.stopPropagation()
    if (transition) {
      if (debug) customLog('Button is transitioning.')
      e.preventDefault()
      return
    }
    autoplayStatus = !autoplayStatus
    setAssociatedAutoplay()
    saveAutoplayStatus()
    if (debug) customLog('Autoplay toggled to:', autoplayStatus)
  }

  // Retrieves the current playlist manager to adjust and use.
  function getManager() {
    return insp(document.querySelector('yt-playlist-manager'));
  }

  // Playlists cannot autoplay if the variable "canAutoAdvance_" is set to false.
  // It is messy to toggle back since various functions switch it.
  // Luckily, all attempts to set it to true are done through the same function.
  // By replacing this function, autoplay can be controlled by the user.
  function interceptManagerForAutoplay() {
    const manager = getManager()
    if (!manager) {
      if (debug) customLog('Manager is missing.')
      return
    }
    if (manager.interceptedForAutoplay) return
    manager.interceptedForAutoplay = true
    addStyle(elementCSS.cssId, elementCSS.styleText)
    if (debug) customLog('Autoplay is now controlled.')
  }

  const transitionOn = () => {
    transition = true;
    // container.style.pointerEvents = 'none';
  }
  const transitionOff = () => {
    transition = false;
    // container.style.pointerEvents = '';
  }

  const moButtonAttachment = new MutationObserver((entries) => {
    for (const entry of entries) {
      const { target, previousSibling, removedNodes } = entry;
      if (removedNodes.length >= 1 && target.isConnected === true && previousSibling && previousSibling.isConnected === true) {
        for (const elem of removedNodes) {
          if (elem.classList.contains(`${elementCSS.buttonContainer}`) && elem.isConnected === false) {
            target.insertBefore(elem, previousSibling.nextSibling);
          }
        }
      }
    }
  })

  function appendButtonContainer(domElement) {
    if (!domElement || !(domElement instanceof Element) || !elementCSS.buttonContainer || domElement.querySelector(`.${elementCSS.buttonContainer}`)) return;
    const container = document.createElement('div')
    container.classList.add(elementCSS.buttonContainer)
    container.classList.toggle(elementCSS.buttonOn, autoplayStatus)
    container.setAttribute('title', `Autoplay is ${autoplayStatus ? 'on' : 'off'}`)
    container.addEventListener('click', toggleAutoplay, false)
    // if (debug && e) container.event = [...e]

    const bar = document.createElement('div')
    bar.classList.add(elementCSS.buttonBar)
    container.appendChild(bar)

    const circle = document.createElement('div')
    circle.classList.add(elementCSS.buttonCircle)
    // Use the transition as the cooldown.
    circle.addEventListener('transitionrun', transitionOn, { passive: true, capture: false });
    circle.addEventListener('transitionend', transitionOff, { passive: true, capture: false });
    circle.addEventListener('transitioncancel', transitionOff, { passive: true, capture: false });
    container.appendChild(circle)

    domElement.appendChild(container)
    if (debug) customLog('Button added.')

    moButtonAttachment.observe(domElement, { childList: true, subtree: false }); // re-adding after removal

  }

  function appendButtonContainerToMenu(menu) {
    if (!menu || !(menu instanceof Element)) return;
    const headers = menu.querySelectorAll('.top-level-buttons:not([hidden])')
    if (headers.length >= 1) {
      for (const header of headers) {
        // add button to each matched header, ignore those have been proceeded without re-rendering.
        appendButtonContainer(header);
      }
      menu.setAttribute('autoplay-container', '1');
    } else {
      // add button to the menu if no header is found, ignore those have been proceeded without re-rendering.
      appendButtonContainer(menu);
      menu.setAttribute('autoplay-container', '2');
    }
  }

  const ytReady = new Promise(_resolve => {
    document.addEventListener('yt-action', async function () {
      const resolve = _resolve;
      _resolve = null;
      if (!resolve) return;
      await customElements.whenDefined('yt-playlist-manager').then();
      await new Promise(resolve => setTimeout(resolve, 100));
      resolve();
    }, { once: true, passive: true, capture: true });
  })

  async function setupMenu(menu) {
    if (!(menu instanceof Element)) return;
    await ytReady.then();

    // YouTube can have multiple variations of the playlist UI hidden in the page.
    // For instance, the sidebar and corner playlists. They also misuse IDs,
    // whereas they can appear multiple times in the same page.
    // This isolates one potentially visible instance.
    if (isYtHidden(menu)) {
      // the menu is invalid
      menu.removeAttribute('autoplay-container');
    } else {
      interceptManagerForAutoplay()
      appendButtonContainerToMenu(menu);
      setAssociatedAutoplay() // set canAutoAdvance_ when the page is loaded.
    }
  }

  function onNavigateStart() { // navigation endpoint is clicked
    // canAutoAdvance_ will become false in onYtNavigateStart_
    navigateStatus = 1;
    if (fCounter > 1e9) fCounter = 9;
    fCounter++;
  }

  function onNavigateCache() {
    navigateStatus = 1;
    if (fCounter > 1e9) fCounter = 9;
    fCounter++;
  }

  function onNavigateFinish() {
    // canAutoAdvance_ will become true in onYtNavigateFinish_
    navigateStatus = 2;
    if (fCounter > 1e9) fCounter = 9;
    fCounter++;
    const t = fCounter;
    interceptManagerForAutoplay()
    setTimeout(() => {
      if (t !== fCounter) return;
      if (navigateStatus === 2) {
        // canAutoAdvance_ has become true in onYtNavigateFinish_
        setAssociatedAutoplay();  // set canAutoAdvance_ to true or false as per preferred setting
      }
    }, 100);
  }

  const attrMo = new MutationObserver((entries) => {
    // the state of DOM is being changed, expand/collaspe state, rendering after dataChanged, etc.
    let m = new Set();
    for (const entry of entries) {
      m.add(entry.target); // avoid proceeding the same element target
    }
    m.forEach((target) => {
      if (target && target.isConnected === true) { // ensure the DOM is valid and attached to the document
        setupMenu(indr(target)['playlist-action-menu']); // add the button to the menu, if applicable
      }
    });
    m.clear();
    m = null;
  });

  // listen events on the script execution in document-start
  document.addEventListener('yt-navigate-start', onNavigateStart, false);
  document.addEventListener('yt-navigate-cache', onNavigateCache, false);
  document.addEventListener('yt-navigate-finish', onNavigateFinish, false);


  elementCSS.styleText = `
        ${elementCSS.parent.join(', ')} {
            align-items: center;
        }
        .${elementCSS.buttonContainer} {
            position: relative;
            height: 20px;
            width: 36px;
            cursor: pointer;
            margin-left: 8px;
        }
        .${elementCSS.buttonContainer} .${elementCSS.buttonBar} {
            position: absolute;
            top: calc(50% - 7px);
            height: 14px;
            width: 36px;
            background-color: var(--paper-toggle-button-unchecked-bar-color, #000000);
            border-radius: 8px;
            opacity: 0.4;
        }
        .${elementCSS.buttonContainer} .${elementCSS.buttonCircle} {
            position: absolute;
            left: 0;
            height: 20px;
            width: 20px;
            background-color: var(--paper-toggle-button-unchecked-button-color, var(--paper-grey-50));
            border-radius: 50%;
            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
            transition: left linear .08s, background-color linear .08s;
        }
        .${elementCSS.buttonContainer}.${elementCSS.buttonOn} .${elementCSS.buttonCircle} {
            position: absolute;
            left: calc(100% - 20px);
            background-color: var(--paper-toggle-button-checked-button-color, var(--primary-color));
        }
      `;

  if (!document.documentElement) await ytZara.docInitializedAsync(); // wait for document.documentElement is provided

  await ytZara.promiseRegistryReady(); // wait for YouTube's customElement Registry is provided (old browser only)

  const cProto = await ytZara.ytProtoAsync('ytd-playlist-panel-renderer'); // wait for customElement registration

  if (cProto.attached145 || cProto.setupPlaylistActionMenu145) {
    console.warn('YouTube Playlist Autoplay Button cannot inject JS code to ytd-playlist-panel-renderer');
    return;
  }

  cProto.attached145 = cProto.attached;
  cProto.setupPlaylistActionMenu145 = function () {
    nextBrowserTick(() => { // avoid blocking the DOM tree rendering
      const hostElement = this.hostElement;
      if (!hostElement || hostElement.isConnected !== true) return;
      attrMo.observe(hostElement, {
        attributes: true,
        attributeFilter: [
          'has-playlist-buttons', 'has-toolbar', 'hidden', 'playlist-type', 'within-miniplayer', 'hide-header-text'
        ]
      });
      setupMenu(indr(this)['playlist-action-menu']); // add the button to the menu which is just attached to Dom Tree, if applicable
    });
  }
  cProto.attached = function () {
    try {
      this.setupPlaylistActionMenu145();
    } finally {
      const f = this.attached145;
      return f ? f.apply(this, arguments) : void 0;
    }
  }

  if (debug) customLog('Initialized.')


})();
