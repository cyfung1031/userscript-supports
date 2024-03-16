// ==UserScript==
// @name         SimpleUserJS
// @description  To provide stuffs for UserJS
// @author       CY Fung
// @version      0.1.0
// @supportURL   https://github.com/cyfung1031/userscript-supports/
// @license      MIT
// @match        https://*/*
// ==/UserScript==

/*

MIT License

Copyright (c) 2024 cyfung1031

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

    const __win__ = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (this instanceof Window ? this : window);

    if (!__win__.SimpleUserJS) {
        const window = __win__;
        __win__.SimpleUserJS = (win) => {
            win = win || window;

            const observablePromise = (proc, timeoutPromise) => {
                let promise = null;
                return {
                    obtain() {
                        if (!promise) {
                            promise = new Promise(resolve => {
                                let mo = null;
                                const f = () => {
                                    let t = proc();
                                    if (t) {
                                        mo.disconnect();
                                        mo.takeRecords();
                                        mo = null;
                                        resolve(t);
                                    }
                                }
                                mo = new MutationObserver(f);
                                mo.observe(document, { subtree: true, childList: true })
                                f();
                                timeoutPromise && timeoutPromise.then(() => {
                                    resolve(null)
                                });
                            });
                        }
                        return promise
                    }
                }
            }

            win.SimpleUserJS = Object.assign(win.SimpleUserJS || {}, {
                css(text) {
                    const css = document.createElement('style');
                    css.textContent = `${text}`;
                    observablePromise(() => document.head).obtain().then((head) => {
                        head && head.appendChild(css);
                    });
                    return css;
                },
                findAll(selector, callback) {
                    const wm = new WeakSet();
                    observablePromise(() => {
                        for (const s of document.querySelectorAll(selector)) {
                            if (wm.has(s)) return;
                            wm.add(s);
                            callback(s);
                        }
                    }).obtain()
                }
            });

        };

    }

})();
