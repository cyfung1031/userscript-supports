// ==UserScript==
// @name         ytZara
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  A tool for YouTube's Polymer.js
// @author       CY Fung
// @grant        none
// @license      MIT
// ==/UserScript==

/*

MIT License

Copyright (c) 2023 cyfung1031

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

var ytZara = (function () {
  'use strict';
  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;
  const ytZara = {
    insp,
    indr,
    onRegistryReady(callback) {
      if (typeof customElements === 'undefined') {
        if (!('__CE_registry' in document)) {
          // https://github.com/webcomponents/polyfills/
          Object.defineProperty(document, '__CE_registry', {
            get() {
              // return undefined
            },
            set(nv) {
              if (typeof nv == 'object') {
                delete this.__CE_registry;
                this.__CE_registry = nv;
                this.dispatchEvent(new CustomEvent(EVENT_KEY_ON_REGISTRY_READY));
              }
              return true;
            },
            enumerable: false,
            configurable: true
          })
        }
        let eventHandler = (evt) => {
          document.removeEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
          const f = callback;
          callback = null;
          eventHandler = null;
          f();
        };
        document.addEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
      } else {
        callback();
      }
    }
  }
  return ytZara;
})();
