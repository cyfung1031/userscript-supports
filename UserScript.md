# UserScript

## UserScript Manager

### Violentmonkey (v2.15.4 or above)
* Can be used in Chrome, Brave, Edge, Firefox, Opera, etc.
* Open source
* GitHub: https://github.com/violentmonkey/violentmonkey/ (Actively Maintained)
* Highly Recommended
* (Be aware of the [WTF behavior](https://github.com/violentmonkey/violentmonkey/issues/1901) - see https://github.com/violentmonkey/violentmonkey/issues/1023)
* 80% userscripts (for China userscripts, 65%) can run in Violentmonkey without issues

### Tampermonkey
* Can be used in Chrome, Brave, Edge, Firefox, Opera, etc.
* Closed source (`This repository contains the source of the Tampermonkey extension up to version 2.9. All newer versions are distributed under a proprietary license.`)
* GitHub: https://github.com/Tampermonkey/tampermonkey/ (Inactively Maintained)
* Recommended
* (This is the most popular one but actually this is closed source)
* 99% userscripts can run in Tampermonkey without issues

### Firemonkey
* Can be ONLY used in Firefox
* [Open source](https://github.com/erosman/support/tree/FireMonkey)
* GitHub: https://github.com/erosman/support/issues (Actively Maintained)
* NOT Recommended due to its intented to be highly secured.
* 65% userscripts (for China userscripts, 30%) can run in Firemonkey without issues

### Stay
* MacOS, Safari, iPhone, iPad, etc.
* Open Source
* GitHub: https://github.com/shenruisi/Stay
* By China developer, and with Chinese Community
* (You have no other good choice in Apple's stuff)

### Userscripts
* MacOS
* Not Recommended because Stay is better

### ScriptCat
* Can be used in Chrome, Brave, Edge, Firefox, Opera, etc.
* Open Source
* GitHub: https://github.com/scriptscat/scriptcat
* By China developer, and with Chinese Community
* https://docs.scriptcat.org/

### Greasemonkey
* Can be ONLY used in Firefox
* Highly NOT recommended
* Just a shit
* GitHub: https://github.com/greasemonkey/greasemonkey (no one maintain)
* 25% userscripts (for China userscripts, 10%) can run in Greasemonkey without issues



## UserScript Website
* https://greasyfork.org/ (Highly Recommended)
* https://sleazyfork.org/ (Recommended)
* https://openuserjs.org/
* https://scriptcat.org/ (for China Users)
* https://github.com/shenruisi/Stay-Offical-Userscript

## Guidelines
* https://www.tampermonkey.net/documentation.php?locale=en
* https://violentmonkey.github.io/
* https://erosman.github.io/support/content/help.html


## Standard Template

```js
// ==UserScript==
// @name        Hello World
// @namespace   UserScripts
// @match       https://*/*
// @grant       none
// @version     0.1.0
// @author      Author
// @license     MIT
// @description Description Here
// @allFrames   true
// @unwrap
// @run-at document-start
// @inject-into page
// ==/UserScript==
(()=>{
  // TODO
})();
```
