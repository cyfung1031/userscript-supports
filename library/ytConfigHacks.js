// ==UserScript==
// @name         ytConfigHacks
// @description  To provide a way to hack the yt.config_ such as EXPERIMENT_FLAGS
// @author       CY Fung
// @version      0.1.2
// @supportURL   https://github.com/cyfung1031/userscript-supports/
// @license      MIT
// @match        https://www.youtube.com/*
// ==/UserScript==

/*

MIT License

Copyright (c) 2021-2023 cyfung1031

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


(() => {

    let hasYtConfigHacks = !!window._ytConfigHacks;
  
    window._ytConfigHacks = window._ytConfigHacks || [];
  
    if (!hasYtConfigHacks) {
  
      function setYtCSI() {
  
        let brm = 4;
        if (window.ytcsi) {
  
          window.ytcsi958 = window.ytcsi;
  
          function restore() {
            if (window.ytcsi958) {
              window.ytcsi = window.ytcsi958;
              delete window.ytcsi958;
            }
          }
  
          function ex() {
  
            if (brm >= 1) {
              let config_ = null;
              try {
                config_ = yt.config_ || ytcfg.data_;
              } catch (e) { }
              if (config_) {
                for (const f of _ytConfigHacks) {
                  if (typeof f === 'function') f(config_);
                }
                if (--brm <= 0) restore();
              }
            }
  
          }
  
          window.ytcsi = new Proxy(window.ytcsi, {
            get(target, prop, receiver) {
              ex();
              return target[prop];
            }
          })
  
        }
  
  
      }
  
      if (window.ytcsi) {
        setYtCSI();
      } else {
  
        Object.defineProperty(window, 'ytcsi', {
          get() {
            return undefined;
          },
          set(nv) {
            if (nv) {
              delete window.ytcsi;
              window.ytcsi = nv;
              setYtCSI();
            }
            return true;
          },
          enumerable: false,
          configurable: true,
        });
  
      }
  
    }
  })();

  