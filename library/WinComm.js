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
!(function (exports) {
  'use strict';

  /**
   * @typedef {Object} HandlerData
   * @prop {string} action
   * @prop {string | number} communicationId
   * @prop {Object?} data
   * @prop {(string | number)?} callbackId
   * @typedef {(d: Partial<HandlerData>, evt: MessageEvent)} Handler
   * @typedef {Object.<string, Handler>} Handlers
   */

  /** 
   * A map to store callback functions.
   * @type {Map<number, (value: any) => void>} 
   */
  const callbacks = new Map();
  let callbackUd = 1;

  /**
   * Creates an instance for communication.
   * @function
   * @memberof WinComm
   * @param {string | number} communicationId - ID for communication.
   * @returns {WinCommInstance} An instance of communication.
   */
  const createInstance = (communicationId) => {

    /** @param {string} key @param {Handlers} handlers @param {string} origin */
    const hook = (key, handlers, origin = location.origin) => {
      if (window[key]) {
        window.removeEventListener('message', window[key], false);
      } else {
        window[key] = (evt) => window[key].handleEvent(evt);
      }
      /** @param {MessageEvent} evt */
      window[key].handleEvent = (evt) => {
        if (!evt || evt.origin !== origin) return;
        const d = evt.data;
        if (d.communicationId !== communicationId) return;
        /** @type {Function?} */
        const handler = handlers[d.action];
        if (typeof handler === 'function') {
          handler(d, evt);
        }
      }
      window.addEventListener('message', window[key], false);
    };

    /** @param {string} key @param {boolean} removal */
    const unhook = (key, removal = true) => {
      window.removeEventListener('message', window[key], false);
      removal && (window[key] = null);
    }

    /** @param {string} action @param {any} data @param {string} origin */
    const send = (action, data, origin = location.origin) => {
      window.postMessage({
        communicationId,
        action,
        data
      }, origin);
    }

    /** @param {string} action @param {any} data @param {string} origin */
    const request = (action, data, origin = location.origin) => {
      return new Promise(resolve => {
        if (callbackUd > 8e5) callbackUd = callbackUd % 1e2;
        const callbackId = callbackUd++;
        callbacks.set(callbackId, resolve);
        window.postMessage({
          communicationId,
          callbackId,
          action,
          data
        }, origin);
      });
    }

    /** @param {MessageEvent} evt */
    const response = (evt, action, data) => {
      evt.source.postMessage({
        communicationId,
        action,
        data,
        callbackId: evt.data.callbackId
      }, evt.origin);
    }

    /** @param {Partial<HandlerData>} d @param {MessageEvent} evt */
    const handleResponse = (d, evt) => {
      const c = d.callbackId;
      const f = callbacks.get(c);
      if (f) {
        callbacks.delete(c);
        f(d);
      }
    }

    const res = {
      hook,
      unhook,
      send,
      request,
      response,
      handleResponse
    };

    /** @typedef { typeof res } WinCommInstance */

    return res

  }

  /**
   * Generates a new communication ID.
   * @function
   * @memberof WinComm
   * @returns {string} A new communication ID.
   */
  const newCommunicationId = () => `${(Date.now() % 1000) + 1000}${Math.random().toFixed(4)}`;

  exports.createInstance = createInstance;
  exports.newCommunicationId = newCommunicationId;

})(this.WinComm || (this.WinComm = {}));
