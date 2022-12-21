// ==UserScript==
// @name         Cookie Manager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  For Developers Only. Control Cookies everywhere via DevTools
// @author       CY Fung
// @match        https://*/*
// @match        http://*/*
// @icon         https://github.com/cyfung1031/userscript-supports/blob/main/icons/cookie-manager.png?raw=true
// @grant        unsafeWindow
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js
// ==/UserScript==

/* global Cookies */

/*
usage:

cook.set('hello-world',100)
console.log(cook.get('hello-world'))
cook.remove('hello-world')

cook.myvar = 'abc'
console.log(cook.myvar)
cook.myvar = null

*/

(function () {
  'use strict';
  // Your code here...
  if (unsafeWindow.cook) return
  unsafeWindow.cook = new Proxy({
    set: Cookies.set.bind(Cookies),
    get: Cookies.get.bind(Cookies),
    remove: Cookies.remove.bind(Cookies)
  }, {
    get(target, prop) {
      if (prop in target) {
        return target[prop]
      }
      return Cookies.get(prop)
    },
    set(target, prop, val) {
      if (val === null) Cookies.remove(prop);
      else Cookies.set(prop, val);
      return true
    }
  })
})();
