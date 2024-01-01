// ======================================= setImmediate =======================================
// 
// GitHub: https://github.com/YuzuJS/setImmediate
// based on version 1.0.5 -  https://cdnjs.cloudflare.com/ajax/libs/setImmediate/1.0.5/setImmediate.js
// modified by CY Fung => version 1.1.0
// ES2015+ without supporting IE; adjusted `currentlyRunningATask` behavior
/**
 * 
 * 
      Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola

      Permission is hereby granted, free of charge, to any person obtaining
      a copy of this software and associated documentation files (the
      "Software"), to deal in the Software without restriction, including
      without limitation the rights to use, copy, modify, merge, publish,
      distribute, sublicense, and/or sell copies of the Software, and to
      permit persons to whom the Software is furnished to do so, subject to
      the following conditions:

      The above copyright notice and this permission notice shall be
      included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
      NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
      LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
      OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
      WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * 
 */

(function (global, undefined) {
    "use strict";

    var attachTo = (global.jmt || (global.jmt = {}));

    if (global.setImmediate) { // Node, Deno, Bun, etc
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    /**
    * @typedef {Object} Task
    * @property {Function} callback - Callback Function
    * @property {any[] | number} args - Callback Arguments
    */
    var /** @type { Map<number, Task> } */ tasksByHandle = new Map();
    var currentlyRunningATask = false;
    var currentlyRunningATaskEnable = typeof AbortSignal !== 'function';
    // Ignoring currentlyRunningATask in Chrome 66+, Edge 16+, Firefox 57+, Opera 53+, Safari 11.1+
    var doc = global.document;
    var /** @type { (handle: number) => void 0 } */ registerImmediate;

    /** @param { Function | string } callback */
    function setImmediate(callback, ...args) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function(`${callback}`);
        }
        // Store and register the task
        var task = { callback: callback, args: args.length ? args : 0 };
        tasksByHandle.set(nextHandle, task);
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        tasksByHandle.delete(handle);
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case undefined:
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATaskEnable && currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle.get(handle);
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function (handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var mfn = function () {
                postMessageIsAsynchronous = false;
            }
            global.addEventListener('message', mfn, false);
            global.postMessage("", "*");
            global.removeEventListener('message', mfn, false);
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = `setImmediate$${Math.random()}$`;
        var onGlobalMessage = function (event) {
            if (event.source === global) {
                var data = event.data;
                if (typeof data === "string" && data.startsWith(messagePrefix)) {
                    runIfPresent(+data.slice(messagePrefix.length));
                }
            }
        };

        global.addEventListener("message", onGlobalMessage, false);

        registerImmediate = function (handle) {
            global.postMessage(`${messagePrefix}${handle}`, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function (handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function (handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage() && global.addEventListener) {
        // For modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

// 
// ======================================= setImmediate =======================================
