# UserScript

## UserScript Manager

### Violentmonkey (v2.15.4 or above)
* Can be used in Chrome, Brave, Edge, Firefox, Opera, etc.
* Open source
* GitHub: https://github.com/violentmonkey/violentmonkey/ (Actively Maintained)
* Highly Recommended
* (Be aware of the [WTF behavior](https://github.com/violentmonkey/violentmonkey/issues/1901) - see https://github.com/violentmonkey/violentmonkey/issues/1023)

### Tampermonkey
* Can be used in Chrome, Brave, Edge, Firefox, Opera, etc.
* Closed source
* GitHub: https://github.com/Tampermonkey/tampermonkey/ (Inactively Maintained)
* Recommended

### Firemonkey
* Can be ONLY used in Firefox
* [Open source](https://github.com/erosman/support/tree/FireMonkey)
* GitHub: https://github.com/erosman/support/issues (Actively Maintained)
* NOT Recommended due to its intented to be highly secured.

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
* https://docs.scriptcat.org/

## UserScript Website
* https://greasyfork.org/ (Highly Recommended)
* https://sleazyfork.org/ (Recommended)
* https://openuserjs.org/
* https://scriptcat.org/ (for China Users)
* https://github.com/shenruisi/Stay-Offical-Userscript


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
