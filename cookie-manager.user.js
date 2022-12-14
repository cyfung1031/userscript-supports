/*

MIT License

Copyright 2022 CY Fung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
// ==UserScript==
// @name         Cookie Manager
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  For Developers Only. Control Cookies everywhere via DevTools
// @author       CY Fung
// @supportURL   https://github.com/cyfung1031/userscript-supports
// @match        https://*/*
// @match        http://*/*
// @icon         https://github.com/cyfung1031/userscript-supports/blob/main/icons/cookie-manager.png?raw=true
// @grant        unsafeWindow
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js#sha512=wT7uPE7tOP6w4o28u1DN775jYjHQApdBnib5Pho4RB0Pgd9y7eSkAV1BTqQydupYDB9GBhTcQQzyNMPMV3cAew==
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

cook.get()

const api = cook.chef(null, { path: '/', domain: '.example.com' })
const api = cook.chef({
  write: function (value, name) {
    return value.toUpperCase()
  }
}, null)
 
*/

(function (Cookies) {
  'use strict';
  // Your code here...
  if (unsafeWindow.cook) return
  const { get, set, remove } = Cookies
  function chefFunc(converter, attributes) {
    converter = converter ? Object.assign({}, this.converter, converter) : this.converter
    attributes = attributes ? Object.assign({}, this.attributes, attributes) : this.attributes
    return init(converter, attributes)
  }
  const target = {
    set: set.bind(Cookies),
    get: get.bind(Cookies),
    remove: remove.bind(Cookies),
    chef: chefFunc.bind(Cookies),
    replaceChef: (chef) => {
      Cookies = chef
      target.set = set.bind(Cookies)
      target.get = get.bind(Cookies)
      target.remove = remove.bind(Cookies)
      target.chef = chefFunc.bind(Cookies)
    }
  }
  unsafeWindow.cook = new Proxy(target, {
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
})(Cookies);
