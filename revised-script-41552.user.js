// ==UserScript==
// @name        YouTube Prevent Playlist Autoplay
// @description Allows the user to toggle autoplaying to the next video once the current video ends. Stores the setting locally.
// @license     GNU GPLv3
// @match       https://www.youtube.com/*
// @version     1.4.0
// @namespace   https://greasyfork.org/users/701907
// @run-at      document-start
// @inject-into page
// @noframes
// ==/UserScript==

/**
 * 
 * This is the modified version from https://greasyfork.org/scripts/415542-youtube-prevent-playlist-autoplay/
 * 
 * GNU GPLv3 License, credit to "MegaScientifical"
 * 
 */

const primary = function () {
    let debug = false
    const elementCSS = {
        //parent:          '#playlist-action-menu #top-level-buttons',
        parent: '#playlist-action-menu .top-level-buttons',
        style: 'YouTube-Prevent-Playlist-Autoplay-Style',
        buttonOn: 'YouTube-Prevent-Playlist-Autoplay-Button-On',
        buttonContainer: 'YouTube-Prevent-Playlist-Autoplay-Button-Container',
        buttonBar: 'YouTube-Prevent-Playlist-Autoplay-Button-Bar',
        buttonCircle: 'YouTube-Prevent-Playlist-Autoplay-Button-Circle'
    }
    const prefix = 'YouTube Prevent Playlist Autoplay:'
    const localStorageProperty = 'YouTubePreventPlaylistAutoplayStatus'
    // Get current autoplay setting from local storage.
    let autoplayStatus = loadAutoplayStatus()
    // Because "canAutoAdvance_" has a functional purpose,
    // track the expected state for safety sake.
    let currentExpected = true
    let transition = false

    // Instead of writing the same log function prefix throughout
    // the code, this function automatically applies the prefix.
    function customLog(...inputs) {
        console.log(prefix, ...inputs)
    }

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
        style.textContent = `${css}`;

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
        manager.canAutoAdvance_ = !autoplayStatus ? false : currentExpected
        for (const b of document.body.getElementsByClassName(elementCSS.buttonContainer)) {
            b.classList.toggle(elementCSS.buttonOn, autoplayStatus)
            b.setAttribute('title', `Autoplay is ${autoplayStatus ? 'on' : 'off'}`)
        }
    }

    // Toggles the ability to autoplay, then sets the rest
    // and stores the current status of autoplay locally.
    function toggleAutoplay() {
        if (transition) {
            if (debug) customLog('Button is transitioning.')
            return
        }
        autoplayStatus = !autoplayStatus
        setAssociatedAutoplay()
        saveAutoplayStatus()
        if (debug) customLog('Autoplay toggled to:', autoplayStatus)
    }

    // Retrieves the current playlist manager to adjust and use.
    function getManager() {
        const managerElement = document.querySelector('yt-playlist-manager')
        if (!managerElement) return null
        const managerController = managerElement.polymerController || managerElement.inst || managerElement
        return managerController
    }

    function onPageLoaded(...e) {
        const isPageMatched = !/^https?:\/\/(www.)?youtube\.com\/(embed|about|trends|kids|jobs|ads|yt|creators|creatorresearch|creators-for-change|nextup|space|csai-match|supported_browsers|howyoutubeworks|(t|intl)\/[^\/]+)\/.*$/.test(location.href)
        if (!isPageMatched) return
        main() // fallback
        // YouTube can have multiple variations of the playlist UI hidden in the page.
        // For instance, the sidebar and corner playlists. They also misuse IDs,
        // whereas they can appear multiple times in the same page.
        // This isolates one potentially visible instance.
        //const header = document.body.querySelector('ytd-watch-flexy.ytd-page-manager:not([hidden]) ytd-playlist-panel-renderer:not([collapsed]) #playlist-action-menu #top-level-buttons, ytd-miniplayer[expanded] #playlist-action-menu #top-level-buttons')
        const headers = document.body.querySelectorAll('ytd-watch-flexy.ytd-page-manager:not([hidden]) ytd-playlist-panel-renderer:not([collapsed]) #playlist-action-menu .top-level-buttons:not([hidden]), ytd-miniplayer[expanded] #playlist-action-menu .top-level-buttons:not([hidden])')
        for (const header of headers) {
            if (header == null || header.closest('[hidden]')) {
                if (debug) customLog('Header is missing.')
                continue
            }
            if (debug) customLog('Removing old buttons.')
            for (const oldButton of header.getElementsByClassName(elementCSS.buttonContainer)) {
                if (debug) customLog('Button with the event of ', oldButton.event, ' removed.')
                oldButton.remove()
            }
            const container = document.createElement('div')
            container.classList.add(elementCSS.buttonContainer)
            container.classList.toggle(elementCSS.buttonOn, autoplayStatus)
            container.setAttribute('title', `Autoplay is ${autoplayStatus ? 'on' : 'off'}`)
            container.addEventListener('click', toggleAutoplay)
            if (debug && e) container.event = [...e]

            const bar = document.createElement('div')
            bar.classList.add(elementCSS.buttonBar)
            container.appendChild(bar)

            const circle = document.createElement('div')
            circle.classList.add(elementCSS.buttonCircle)
            // Use the transition as the cooldown.
            circle.addEventListener('transitionrun', () => transition = true)
            circle.addEventListener('transitionend', () => transition = false)
            circle.addEventListener('transitioncancel', () => transition = false)
            container.appendChild(circle)

            header.appendChild(container)
            if (debug) customLog('Button added.')
        }
        setAssociatedAutoplay() // set canAutoAdvance_ when the page is loaded.
    }

    // Playlists cannot autoplay if the variable "canAutoAdvance_" is set to false.
    // It is messy to toggle back since various functions switch it.
    // Luckily, all attempts to set it to true are done through the same function.
    // By replacing this function, autoplay can be controlled by the user.
    function main() {
        const manager = getManager()
        if (!manager) {
            if (debug) customLog('Manager is missing.')
            return
        }
        if (manager.interceptedForAutoplay) return
        addStyle(elementCSS.style, elementCSS.styleSheet)
        manager.interceptedForAutoplay = true
        manager.onYtNavigateStart_ = function () { this.canAutoAdvance_ = currentExpected = false }
        manager.onYtNavigateFinish_ = function () { currentExpected = true; this.canAutoAdvance_ = autoplayStatus ? currentExpected : false }
        customLog('Autoplay is now controlled.')
    }

    // Adds the CSS to style the autoplay toggle button.
    function init() {
        elementCSS.styleSheet = `${elementCSS.parent} {
            align-items: center;
        }

        ${elementCSS.parent} .${elementCSS.buttonContainer} {
            position: relative;
            height: 20px;
            width: 36px;
            cursor: pointer;
            margin-left: 8px;
        }

        ${elementCSS.parent} .${elementCSS.buttonContainer} .${elementCSS.buttonBar} {
            position: absolute;
            top: calc(50% - 7px);
            height: 14px;
            width: 36px;
            background-color: var(--paper-toggle-button-unchecked-bar-color, #000000);
            border-radius: 8px;
            opacity: 0.4;
        }

        ${elementCSS.parent} .${elementCSS.buttonContainer} .${elementCSS.buttonCircle} {
            position: absolute;
            left: 0;
            height: 20px;
            width: 20px;
            background-color: var(--paper-toggle-button-unchecked-button-color, var(--paper-grey-50));
            border-radius: 50%;
            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
            transition: left linear .08s, background-color linear .08s
        }

        ${elementCSS.parent} .${elementCSS.buttonContainer}.${elementCSS.buttonOn} .${elementCSS.buttonCircle} {
            position: absolute;
            left: calc(100% - 20px);
            background-color: var(--paper-toggle-button-checked-button-color, var(--primary-color));
        }`
        customLog('Initialized.')
    }

    init()

    // Initializes autoplay control.
    window.addEventListener('yt-playlist-data-updated', main, { once: true })
    //window.addEventListener('yt-player-updated', main, { once: true })
    // Each page change, checks if it needs to be (re)applied.
    window.addEventListener('yt-page-type-changed', main)
    // Adds the autoplay switches to the page where appropriate.
    //window.addEventListener('yt-visibility-refresh', addButton) // No longer works.
    //window.addEventListener('yt-playlist-data-updated', addButton) // Works a lot of the time, but has cases where it won't.
    window.addEventListener('yt-navigate-finish', onPageLoaded) // Lets just check if it's needed each time this happens...
}

let mo = new MutationObserver(() => {
    const root = (document.body || document.head || document.documentElement)
    if (root) {
        mo.disconnect()
        mo.takeRecords()
        mo = null
        const script = document.createElement('script')
        script.textContent = `(${primary})()` // script.appendChild(document.createTextNode(`(${primary})()`));
        root.appendChild(script)
    }
})
mo.observe(document, { childList: true, subtree: true })