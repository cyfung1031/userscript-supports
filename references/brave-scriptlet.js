(function() {
    const scriptletGlobals = new Map();
    let deAmpEnabled = true;
    try {
    {
      const args = [".ytd-merch-shelf-renderer", "display", "block", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    
      (function spoofCSS(
        selector,
        ...args
    ) {
        if ( typeof selector !== 'string' ) { return; }
        if ( selector === '' ) { return; }
        const toCamelCase = s => s.replace(/-[a-z]/g, s => s.charAt(1).toUpperCase());
        const propToValueMap = new Map();
        for ( let i = 0; i < args.length; i += 2 ) {
            if ( typeof args[i+0] !== 'string' ) { break; }
            if ( args[i+0] === '' ) { break; }
            if ( typeof args[i+1] !== 'string' ) { break; }
            propToValueMap.set(toCamelCase(args[i+0]), args[i+1]);
        }
        const safe = safeSelf();
        const canDebug = scriptletGlobals.has('canDebug');
        const shouldDebug = canDebug && propToValueMap.get('debug') || 0;
        const shouldLog = canDebug && propToValueMap.has('log') || 0;
        const spoofStyle = (prop, real) => {
            const normalProp = toCamelCase(prop);
            const shouldSpoof = propToValueMap.has(normalProp);
            const value = shouldSpoof ? propToValueMap.get(normalProp) : real;
            if ( shouldLog === 2 || shouldSpoof && shouldLog === 1 ) {
                safe.uboLog(prop, value);
            }
            return value;
        };
        self.getComputedStyle = new Proxy(self.getComputedStyle, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const style = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(args[0]) === false ) { return style; }
                const proxiedStyle = new Proxy(style, {
                    get(target, prop, receiver) {
                        if ( typeof target[prop] === 'function' ) {
                            if ( prop === 'getPropertyValue' ) {
                                return (function(prop) {
                                    return spoofStyle(prop, target[prop]);
                                }).bind(target);
                            }
                            return target[prop].bind(target);
                        }
                        return spoofStyle(prop, Reflect.get(target, prop, receiver));
                    },
                    getOwnPropertyDescriptor(target, prop) {
                        if ( propToValueMap.has(prop) ) {
                            return {
                                configurable: true,
                                enumerable: true,
                                value: propToValueMap.get(prop),
                                writable: true,
                            };
                        }
                        return Reflect.getOwnPropertyDescriptor(target, prop);
                    },
                });
                return proxiedStyle;
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        Element.prototype.getBoundingClientRect = new Proxy(Element.prototype.getBoundingClientRect, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const rect = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(thisArg) === false ) { return rect; }
                let { height, width } = rect;
                if ( propToValueMap.has('width') ) {
                    width = parseFloat(propToValueMap.get('width'));
                }
                if ( propToValueMap.has('height') ) {
                    height = parseFloat(propToValueMap.get('height'));
                }
                return new self.DOMRect(rect.x, rect.y, width, height);
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    (_ => {
      const origPerfNow = window.performance.now;
      let previous = 0;
    
      window.performance.now = function () {
        let current = origPerfNow.apply(this);
        if (current <= previous) {
          current = previous + Number.EPSILON * 100000;
        }
    
        return previous = current;
      }
    })();
    
    } catch ( e ) { }
    try {
    {
      const args = ["ytd-search-pyv-renderer", "display", "block", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    
      (function spoofCSS(
        selector,
        ...args
    ) {
        if ( typeof selector !== 'string' ) { return; }
        if ( selector === '' ) { return; }
        const toCamelCase = s => s.replace(/-[a-z]/g, s => s.charAt(1).toUpperCase());
        const propToValueMap = new Map();
        for ( let i = 0; i < args.length; i += 2 ) {
            if ( typeof args[i+0] !== 'string' ) { break; }
            if ( args[i+0] === '' ) { break; }
            if ( typeof args[i+1] !== 'string' ) { break; }
            propToValueMap.set(toCamelCase(args[i+0]), args[i+1]);
        }
        const safe = safeSelf();
        const canDebug = scriptletGlobals.has('canDebug');
        const shouldDebug = canDebug && propToValueMap.get('debug') || 0;
        const shouldLog = canDebug && propToValueMap.has('log') || 0;
        const spoofStyle = (prop, real) => {
            const normalProp = toCamelCase(prop);
            const shouldSpoof = propToValueMap.has(normalProp);
            const value = shouldSpoof ? propToValueMap.get(normalProp) : real;
            if ( shouldLog === 2 || shouldSpoof && shouldLog === 1 ) {
                safe.uboLog(prop, value);
            }
            return value;
        };
        self.getComputedStyle = new Proxy(self.getComputedStyle, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const style = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(args[0]) === false ) { return style; }
                const proxiedStyle = new Proxy(style, {
                    get(target, prop, receiver) {
                        if ( typeof target[prop] === 'function' ) {
                            if ( prop === 'getPropertyValue' ) {
                                return (function(prop) {
                                    return spoofStyle(prop, target[prop]);
                                }).bind(target);
                            }
                            return target[prop].bind(target);
                        }
                        return spoofStyle(prop, Reflect.get(target, prop, receiver));
                    },
                    getOwnPropertyDescriptor(target, prop) {
                        if ( propToValueMap.has(prop) ) {
                            return {
                                configurable: true,
                                enumerable: true,
                                value: propToValueMap.get(prop),
                                writable: true,
                            };
                        }
                        return Reflect.getOwnPropertyDescriptor(target, prop);
                    },
                });
                return proxiedStyle;
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        Element.prototype.getBoundingClientRect = new Proxy(Element.prototype.getBoundingClientRect, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const rect = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(thisArg) === false ) { return rect; }
                let { height, width } = rect;
                if ( propToValueMap.has('width') ) {
                    width = parseFloat(propToValueMap.get('width'));
                }
                if ( propToValueMap.has('height') ) {
                    height = parseFloat(propToValueMap.get('height'));
                }
                return new self.DOMRect(rect.x, rect.y, width, height);
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["ytInitialPlayerResponse.adPlacements", "undefined", "{{3}}", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    function runAt(fn, when) {
        const intFromReadyState = state => {
            const targets = {
                'loading': 1,
                'interactive': 2, 'end': 2, '2': 2,
                'complete': 3, 'idle': 3, '3': 3,
            };
            const tokens = Array.isArray(state) ? state : [ state ];
            for ( const token of tokens ) {
                const prop = `${token}`;
                if ( targets.hasOwnProperty(prop) === false ) { continue; }
                return targets[prop];
            }
            return 0;
        };
        const runAt = intFromReadyState(when);
        if ( intFromReadyState(document.readyState) >= runAt ) {
            fn(); return;
        }
        const onStateChange = ( ) => {
            if ( intFromReadyState(document.readyState) < runAt ) { return; }
            fn();
            safe.removeEventListener.apply(document, args);
        };
        const safe = safeSelf();
        const args = [ 'readystatechange', onStateChange, { capture: true } ];
        safe.addEventListener.apply(document, args);
    }
    function setConstantCore(
        trusted = false,
        chain = '',
        cValue = ''
    ) {
        if ( chain === '' ) { return; }
        const safe = safeSelf();
        const extraArgs = safe.getExtraArgs(Array.from(arguments), 3);
        function setConstant(chain, cValue) {
            const trappedProp = (( ) => {
                const pos = chain.lastIndexOf('.');
                if ( pos === -1 ) { return chain; }
                return chain.slice(pos+1);
            })();
            if ( trappedProp === '' ) { return; }
            const thisScript = document.currentScript;
            const cloakFunc = fn => {
                safe.Object_defineProperty(fn, 'name', { value: trappedProp });
                const proxy = new Proxy(fn, {
                    defineProperty(target, prop) {
                        if ( prop !== 'toString' ) {
                            return Reflect.defineProperty(...arguments);
                        }
                        return true;
                    },
                    deleteProperty(target, prop) {
                        if ( prop !== 'toString' ) {
                            return Reflect.deleteProperty(...arguments);
                        }
                        return true;
                    },
                    get(target, prop) {
                        if ( prop === 'toString' ) {
                            return function() {
                                return `function ${trappedProp}() { [native code] }`;
                            }.bind(null);
                        }
                        return Reflect.get(...arguments);
                    },
                });
                return proxy;
            };
            if ( cValue === 'undefined' ) {
                cValue = undefined;
            } else if ( cValue === 'false' ) {
                cValue = false;
            } else if ( cValue === 'true' ) {
                cValue = true;
            } else if ( cValue === 'null' ) {
                cValue = null;
            } else if ( cValue === "''" || cValue === '' ) {
                cValue = '';
            } else if ( cValue === '[]' || cValue === 'emptyArr' ) {
                cValue = [];
            } else if ( cValue === '{}' || cValue === 'emptyObj' ) {
                cValue = {};
            } else if ( cValue === 'noopFunc' ) {
                cValue = cloakFunc(function(){});
            } else if ( cValue === 'trueFunc' ) {
                cValue = cloakFunc(function(){ return true; });
            } else if ( cValue === 'falseFunc' ) {
                cValue = cloakFunc(function(){ return false; });
            } else if ( /^-?\d+$/.test(cValue) ) {
                cValue = parseInt(cValue);
                if ( isNaN(cValue) ) { return; }
                if ( Math.abs(cValue) > 0x7FFF ) { return; }
            } else if ( trusted ) {
                if ( cValue.startsWith('{') && cValue.endsWith('}') ) {
                    try { cValue = safe.JSON_parse(cValue).value; } catch(ex) { return; }
                }
            } else {
                return;
            }
            if ( extraArgs.as !== undefined ) {
                const value = cValue;
                if ( extraArgs.as === 'function' ) {
                    cValue = ( ) => value;
                } else if ( extraArgs.as === 'callback' ) {
                    cValue = ( ) => (( ) => value);
                } else if ( extraArgs.as === 'resolved' ) {
                    cValue = Promise.resolve(value);
                } else if ( extraArgs.as === 'rejected' ) {
                    cValue = Promise.reject(value);
                }
            }
            let aborted = false;
            const mustAbort = function(v) {
                if ( trusted ) { return false; }
                if ( aborted ) { return true; }
                aborted =
                    (v !== undefined && v !== null) &&
                    (cValue !== undefined && cValue !== null) &&
                    (typeof v !== typeof cValue);
                return aborted;
            };
            // https://github.com/uBlockOrigin/uBlock-issues/issues/156
            //   Support multiple trappers for the same property.
            const trapProp = function(owner, prop, configurable, handler) {
                if ( handler.init(configurable ? owner[prop] : cValue) === false ) { return; }
                const odesc = Object.getOwnPropertyDescriptor(owner, prop);
                let prevGetter, prevSetter;
                if ( odesc instanceof Object ) {
                    owner[prop] = cValue;
                    if ( odesc.get instanceof Function ) {
                        prevGetter = odesc.get;
                    }
                    if ( odesc.set instanceof Function ) {
                        prevSetter = odesc.set;
                    }
                }
                try {
                    safe.Object_defineProperty(owner, prop, {
                        configurable,
                        get() {
                            if ( prevGetter !== undefined ) {
                                prevGetter();
                            }
                            return handler.getter(); // cValue
                        },
                        set(a) {
                            if ( prevSetter !== undefined ) {
                                prevSetter(a);
                            }
                            handler.setter(a);
                        }
                    });
                } catch(ex) {
                }
            };
            const trapChain = function(owner, chain) {
                const pos = chain.indexOf('.');
                if ( pos === -1 ) {
                    trapProp(owner, chain, false, {
                        v: undefined,
                        init: function(v) {
                            if ( mustAbort(v) ) { return false; }
                            this.v = v;
                            return true;
                        },
                        getter: function() {
                            return document.currentScript === thisScript
                                ? this.v
                                : cValue;
                        },
                        setter: function(a) {
                            if ( mustAbort(a) === false ) { return; }
                            cValue = a;
                        }
                    });
                    return;
                }
                const prop = chain.slice(0, pos);
                const v = owner[prop];
                chain = chain.slice(pos + 1);
                if ( v instanceof Object || typeof v === 'object' && v !== null ) {
                    trapChain(v, chain);
                    return;
                }
                trapProp(owner, prop, true, {
                    v: undefined,
                    init: function(v) {
                        this.v = v;
                        return true;
                    },
                    getter: function() {
                        return this.v;
                    },
                    setter: function(a) {
                        this.v = a;
                        if ( a instanceof Object ) {
                            trapChain(a, chain);
                        }
                    }
                });
            };
            trapChain(window, chain);
        }
        runAt(( ) => {
            setConstant(chain, cValue);
        }, extraArgs.runAt);
    }
    
      (function setConstant(
        ...args
    ) {
        setConstantCore(false, ...args);
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["ytInitialPlayerResponse.playerAds", "undefined", "{{3}}", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    function runAt(fn, when) {
        const intFromReadyState = state => {
            const targets = {
                'loading': 1,
                'interactive': 2, 'end': 2, '2': 2,
                'complete': 3, 'idle': 3, '3': 3,
            };
            const tokens = Array.isArray(state) ? state : [ state ];
            for ( const token of tokens ) {
                const prop = `${token}`;
                if ( targets.hasOwnProperty(prop) === false ) { continue; }
                return targets[prop];
            }
            return 0;
        };
        const runAt = intFromReadyState(when);
        if ( intFromReadyState(document.readyState) >= runAt ) {
            fn(); return;
        }
        const onStateChange = ( ) => {
            if ( intFromReadyState(document.readyState) < runAt ) { return; }
            fn();
            safe.removeEventListener.apply(document, args);
        };
        const safe = safeSelf();
        const args = [ 'readystatechange', onStateChange, { capture: true } ];
        safe.addEventListener.apply(document, args);
    }
    function setConstantCore(
        trusted = false,
        chain = '',
        cValue = ''
    ) {
        if ( chain === '' ) { return; }
        const safe = safeSelf();
        const extraArgs = safe.getExtraArgs(Array.from(arguments), 3);
        function setConstant(chain, cValue) {
            const trappedProp = (( ) => {
                const pos = chain.lastIndexOf('.');
                if ( pos === -1 ) { return chain; }
                return chain.slice(pos+1);
            })();
            if ( trappedProp === '' ) { return; }
            const thisScript = document.currentScript;
            const cloakFunc = fn => {
                safe.Object_defineProperty(fn, 'name', { value: trappedProp });
                const proxy = new Proxy(fn, {
                    defineProperty(target, prop) {
                        if ( prop !== 'toString' ) {
                            return Reflect.defineProperty(...arguments);
                        }
                        return true;
                    },
                    deleteProperty(target, prop) {
                        if ( prop !== 'toString' ) {
                            return Reflect.deleteProperty(...arguments);
                        }
                        return true;
                    },
                    get(target, prop) {
                        if ( prop === 'toString' ) {
                            return function() {
                                return `function ${trappedProp}() { [native code] }`;
                            }.bind(null);
                        }
                        return Reflect.get(...arguments);
                    },
                });
                return proxy;
            };
            if ( cValue === 'undefined' ) {
                cValue = undefined;
            } else if ( cValue === 'false' ) {
                cValue = false;
            } else if ( cValue === 'true' ) {
                cValue = true;
            } else if ( cValue === 'null' ) {
                cValue = null;
            } else if ( cValue === "''" || cValue === '' ) {
                cValue = '';
            } else if ( cValue === '[]' || cValue === 'emptyArr' ) {
                cValue = [];
            } else if ( cValue === '{}' || cValue === 'emptyObj' ) {
                cValue = {};
            } else if ( cValue === 'noopFunc' ) {
                cValue = cloakFunc(function(){});
            } else if ( cValue === 'trueFunc' ) {
                cValue = cloakFunc(function(){ return true; });
            } else if ( cValue === 'falseFunc' ) {
                cValue = cloakFunc(function(){ return false; });
            } else if ( /^-?\d+$/.test(cValue) ) {
                cValue = parseInt(cValue);
                if ( isNaN(cValue) ) { return; }
                if ( Math.abs(cValue) > 0x7FFF ) { return; }
            } else if ( trusted ) {
                if ( cValue.startsWith('{') && cValue.endsWith('}') ) {
                    try { cValue = safe.JSON_parse(cValue).value; } catch(ex) { return; }
                }
            } else {
                return;
            }
            if ( extraArgs.as !== undefined ) {
                const value = cValue;
                if ( extraArgs.as === 'function' ) {
                    cValue = ( ) => value;
                } else if ( extraArgs.as === 'callback' ) {
                    cValue = ( ) => (( ) => value);
                } else if ( extraArgs.as === 'resolved' ) {
                    cValue = Promise.resolve(value);
                } else if ( extraArgs.as === 'rejected' ) {
                    cValue = Promise.reject(value);
                }
            }
            let aborted = false;
            const mustAbort = function(v) {
                if ( trusted ) { return false; }
                if ( aborted ) { return true; }
                aborted =
                    (v !== undefined && v !== null) &&
                    (cValue !== undefined && cValue !== null) &&
                    (typeof v !== typeof cValue);
                return aborted;
            };
            // https://github.com/uBlockOrigin/uBlock-issues/issues/156
            //   Support multiple trappers for the same property.
            const trapProp = function(owner, prop, configurable, handler) {
                if ( handler.init(configurable ? owner[prop] : cValue) === false ) { return; }
                const odesc = Object.getOwnPropertyDescriptor(owner, prop);
                let prevGetter, prevSetter;
                if ( odesc instanceof Object ) {
                    owner[prop] = cValue;
                    if ( odesc.get instanceof Function ) {
                        prevGetter = odesc.get;
                    }
                    if ( odesc.set instanceof Function ) {
                        prevSetter = odesc.set;
                    }
                }
                try {
                    safe.Object_defineProperty(owner, prop, {
                        configurable,
                        get() {
                            if ( prevGetter !== undefined ) {
                                prevGetter();
                            }
                            return handler.getter(); // cValue
                        },
                        set(a) {
                            if ( prevSetter !== undefined ) {
                                prevSetter(a);
                            }
                            handler.setter(a);
                        }
                    });
                } catch(ex) {
                }
            };
            const trapChain = function(owner, chain) {
                const pos = chain.indexOf('.');
                if ( pos === -1 ) {
                    trapProp(owner, chain, false, {
                        v: undefined,
                        init: function(v) {
                            if ( mustAbort(v) ) { return false; }
                            this.v = v;
                            return true;
                        },
                        getter: function() {
                            return document.currentScript === thisScript
                                ? this.v
                                : cValue;
                        },
                        setter: function(a) {
                            if ( mustAbort(a) === false ) { return; }
                            cValue = a;
                        }
                    });
                    return;
                }
                const prop = chain.slice(0, pos);
                const v = owner[prop];
                chain = chain.slice(pos + 1);
                if ( v instanceof Object || typeof v === 'object' && v !== null ) {
                    trapChain(v, chain);
                    return;
                }
                trapProp(owner, prop, true, {
                    v: undefined,
                    init: function(v) {
                        this.v = v;
                        return true;
                    },
                    getter: function() {
                        return this.v;
                    },
                    setter: function(a) {
                        this.v = a;
                        if ( a instanceof Object ) {
                            trapChain(a, chain);
                        }
                    }
                });
            };
            trapChain(window, chain);
        }
        runAt(( ) => {
            setConstant(chain, cValue);
        }, extraArgs.runAt);
    }
    
      (function setConstant(
        ...args
    ) {
        setConstantCore(false, ...args);
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["ytInitialPlayerResponse.adSlots", "undefined", "{{3}}", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    function runAt(fn, when) {
        const intFromReadyState = state => {
            const targets = {
                'loading': 1,
                'interactive': 2, 'end': 2, '2': 2,
                'complete': 3, 'idle': 3, '3': 3,
            };
            const tokens = Array.isArray(state) ? state : [ state ];
            for ( const token of tokens ) {
                const prop = `${token}`;
                if ( targets.hasOwnProperty(prop) === false ) { continue; }
                return targets[prop];
            }
            return 0;
        };
        const runAt = intFromReadyState(when);
        if ( intFromReadyState(document.readyState) >= runAt ) {
            fn(); return;
        }
        const onStateChange = ( ) => {
            if ( intFromReadyState(document.readyState) < runAt ) { return; }
            fn();
            safe.removeEventListener.apply(document, args);
        };
        const safe = safeSelf();
        const args = [ 'readystatechange', onStateChange, { capture: true } ];
        safe.addEventListener.apply(document, args);
    }
    function setConstantCore(
        trusted = false,
        chain = '',
        cValue = ''
    ) {
        if ( chain === '' ) { return; }
        const safe = safeSelf();
        const extraArgs = safe.getExtraArgs(Array.from(arguments), 3);
        function setConstant(chain, cValue) {
            const trappedProp = (( ) => {
                const pos = chain.lastIndexOf('.');
                if ( pos === -1 ) { return chain; }
                return chain.slice(pos+1);
            })();
            if ( trappedProp === '' ) { return; }
            const thisScript = document.currentScript;
            const cloakFunc = fn => {
                safe.Object_defineProperty(fn, 'name', { value: trappedProp });
                const proxy = new Proxy(fn, {
                    defineProperty(target, prop) {
                        if ( prop !== 'toString' ) {
                            return Reflect.defineProperty(...arguments);
                        }
                        return true;
                    },
                    deleteProperty(target, prop) {
                        if ( prop !== 'toString' ) {
                            return Reflect.deleteProperty(...arguments);
                        }
                        return true;
                    },
                    get(target, prop) {
                        if ( prop === 'toString' ) {
                            return function() {
                                return `function ${trappedProp}() { [native code] }`;
                            }.bind(null);
                        }
                        return Reflect.get(...arguments);
                    },
                });
                return proxy;
            };
            if ( cValue === 'undefined' ) {
                cValue = undefined;
            } else if ( cValue === 'false' ) {
                cValue = false;
            } else if ( cValue === 'true' ) {
                cValue = true;
            } else if ( cValue === 'null' ) {
                cValue = null;
            } else if ( cValue === "''" || cValue === '' ) {
                cValue = '';
            } else if ( cValue === '[]' || cValue === 'emptyArr' ) {
                cValue = [];
            } else if ( cValue === '{}' || cValue === 'emptyObj' ) {
                cValue = {};
            } else if ( cValue === 'noopFunc' ) {
                cValue = cloakFunc(function(){});
            } else if ( cValue === 'trueFunc' ) {
                cValue = cloakFunc(function(){ return true; });
            } else if ( cValue === 'falseFunc' ) {
                cValue = cloakFunc(function(){ return false; });
            } else if ( /^-?\d+$/.test(cValue) ) {
                cValue = parseInt(cValue);
                if ( isNaN(cValue) ) { return; }
                if ( Math.abs(cValue) > 0x7FFF ) { return; }
            } else if ( trusted ) {
                if ( cValue.startsWith('{') && cValue.endsWith('}') ) {
                    try { cValue = safe.JSON_parse(cValue).value; } catch(ex) { return; }
                }
            } else {
                return;
            }
            if ( extraArgs.as !== undefined ) {
                const value = cValue;
                if ( extraArgs.as === 'function' ) {
                    cValue = ( ) => value;
                } else if ( extraArgs.as === 'callback' ) {
                    cValue = ( ) => (( ) => value);
                } else if ( extraArgs.as === 'resolved' ) {
                    cValue = Promise.resolve(value);
                } else if ( extraArgs.as === 'rejected' ) {
                    cValue = Promise.reject(value);
                }
            }
            let aborted = false;
            const mustAbort = function(v) {
                if ( trusted ) { return false; }
                if ( aborted ) { return true; }
                aborted =
                    (v !== undefined && v !== null) &&
                    (cValue !== undefined && cValue !== null) &&
                    (typeof v !== typeof cValue);
                return aborted;
            };
            // https://github.com/uBlockOrigin/uBlock-issues/issues/156
            //   Support multiple trappers for the same property.
            const trapProp = function(owner, prop, configurable, handler) {
                if ( handler.init(configurable ? owner[prop] : cValue) === false ) { return; }
                const odesc = Object.getOwnPropertyDescriptor(owner, prop);
                let prevGetter, prevSetter;
                if ( odesc instanceof Object ) {
                    owner[prop] = cValue;
                    if ( odesc.get instanceof Function ) {
                        prevGetter = odesc.get;
                    }
                    if ( odesc.set instanceof Function ) {
                        prevSetter = odesc.set;
                    }
                }
                try {
                    safe.Object_defineProperty(owner, prop, {
                        configurable,
                        get() {
                            if ( prevGetter !== undefined ) {
                                prevGetter();
                            }
                            return handler.getter(); // cValue
                        },
                        set(a) {
                            if ( prevSetter !== undefined ) {
                                prevSetter(a);
                            }
                            handler.setter(a);
                        }
                    });
                } catch(ex) {
                }
            };
            const trapChain = function(owner, chain) {
                const pos = chain.indexOf('.');
                if ( pos === -1 ) {
                    trapProp(owner, chain, false, {
                        v: undefined,
                        init: function(v) {
                            if ( mustAbort(v) ) { return false; }
                            this.v = v;
                            return true;
                        },
                        getter: function() {
                            return document.currentScript === thisScript
                                ? this.v
                                : cValue;
                        },
                        setter: function(a) {
                            if ( mustAbort(a) === false ) { return; }
                            cValue = a;
                        }
                    });
                    return;
                }
                const prop = chain.slice(0, pos);
                const v = owner[prop];
                chain = chain.slice(pos + 1);
                if ( v instanceof Object || typeof v === 'object' && v !== null ) {
                    trapChain(v, chain);
                    return;
                }
                trapProp(owner, prop, true, {
                    v: undefined,
                    init: function(v) {
                        this.v = v;
                        return true;
                    },
                    getter: function() {
                        return this.v;
                    },
                    setter: function(a) {
                        this.v = a;
                        if ( a instanceof Object ) {
                            trapChain(a, chain);
                        }
                    }
                });
            };
            trapChain(window, chain);
        }
        runAt(( ) => {
            setConstant(chain, cValue);
        }, extraArgs.runAt);
    }
    
      (function setConstant(
        ...args
    ) {
        setConstantCore(false, ...args);
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = [".ytd-page-top-ad-layout-renderer", "display", "block", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    
      (function spoofCSS(
        selector,
        ...args
    ) {
        if ( typeof selector !== 'string' ) { return; }
        if ( selector === '' ) { return; }
        const toCamelCase = s => s.replace(/-[a-z]/g, s => s.charAt(1).toUpperCase());
        const propToValueMap = new Map();
        for ( let i = 0; i < args.length; i += 2 ) {
            if ( typeof args[i+0] !== 'string' ) { break; }
            if ( args[i+0] === '' ) { break; }
            if ( typeof args[i+1] !== 'string' ) { break; }
            propToValueMap.set(toCamelCase(args[i+0]), args[i+1]);
        }
        const safe = safeSelf();
        const canDebug = scriptletGlobals.has('canDebug');
        const shouldDebug = canDebug && propToValueMap.get('debug') || 0;
        const shouldLog = canDebug && propToValueMap.has('log') || 0;
        const spoofStyle = (prop, real) => {
            const normalProp = toCamelCase(prop);
            const shouldSpoof = propToValueMap.has(normalProp);
            const value = shouldSpoof ? propToValueMap.get(normalProp) : real;
            if ( shouldLog === 2 || shouldSpoof && shouldLog === 1 ) {
                safe.uboLog(prop, value);
            }
            return value;
        };
        self.getComputedStyle = new Proxy(self.getComputedStyle, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const style = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(args[0]) === false ) { return style; }
                const proxiedStyle = new Proxy(style, {
                    get(target, prop, receiver) {
                        if ( typeof target[prop] === 'function' ) {
                            if ( prop === 'getPropertyValue' ) {
                                return (function(prop) {
                                    return spoofStyle(prop, target[prop]);
                                }).bind(target);
                            }
                            return target[prop].bind(target);
                        }
                        return spoofStyle(prop, Reflect.get(target, prop, receiver));
                    },
                    getOwnPropertyDescriptor(target, prop) {
                        if ( propToValueMap.has(prop) ) {
                            return {
                                configurable: true,
                                enumerable: true,
                                value: propToValueMap.get(prop),
                                writable: true,
                            };
                        }
                        return Reflect.getOwnPropertyDescriptor(target, prop);
                    },
                });
                return proxiedStyle;
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        Element.prototype.getBoundingClientRect = new Proxy(Element.prototype.getBoundingClientRect, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const rect = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(thisArg) === false ) { return rect; }
                let { height, width } = rect;
                if ( propToValueMap.has('width') ) {
                    width = parseFloat(propToValueMap.get('width'));
                }
                if ( propToValueMap.has('height') ) {
                    height = parseFloat(propToValueMap.get('height'));
                }
                return new self.DOMRect(rect.x, rect.y, width, height);
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["ytd-ad-slot-renderer", "display", "block", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    
      (function spoofCSS(
        selector,
        ...args
    ) {
        if ( typeof selector !== 'string' ) { return; }
        if ( selector === '' ) { return; }
        const toCamelCase = s => s.replace(/-[a-z]/g, s => s.charAt(1).toUpperCase());
        const propToValueMap = new Map();
        for ( let i = 0; i < args.length; i += 2 ) {
            if ( typeof args[i+0] !== 'string' ) { break; }
            if ( args[i+0] === '' ) { break; }
            if ( typeof args[i+1] !== 'string' ) { break; }
            propToValueMap.set(toCamelCase(args[i+0]), args[i+1]);
        }
        const safe = safeSelf();
        const canDebug = scriptletGlobals.has('canDebug');
        const shouldDebug = canDebug && propToValueMap.get('debug') || 0;
        const shouldLog = canDebug && propToValueMap.has('log') || 0;
        const spoofStyle = (prop, real) => {
            const normalProp = toCamelCase(prop);
            const shouldSpoof = propToValueMap.has(normalProp);
            const value = shouldSpoof ? propToValueMap.get(normalProp) : real;
            if ( shouldLog === 2 || shouldSpoof && shouldLog === 1 ) {
                safe.uboLog(prop, value);
            }
            return value;
        };
        self.getComputedStyle = new Proxy(self.getComputedStyle, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const style = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(args[0]) === false ) { return style; }
                const proxiedStyle = new Proxy(style, {
                    get(target, prop, receiver) {
                        if ( typeof target[prop] === 'function' ) {
                            if ( prop === 'getPropertyValue' ) {
                                return (function(prop) {
                                    return spoofStyle(prop, target[prop]);
                                }).bind(target);
                            }
                            return target[prop].bind(target);
                        }
                        return spoofStyle(prop, Reflect.get(target, prop, receiver));
                    },
                    getOwnPropertyDescriptor(target, prop) {
                        if ( propToValueMap.has(prop) ) {
                            return {
                                configurable: true,
                                enumerable: true,
                                value: propToValueMap.get(prop),
                                writable: true,
                            };
                        }
                        return Reflect.getOwnPropertyDescriptor(target, prop);
                    },
                });
                return proxiedStyle;
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        Element.prototype.getBoundingClientRect = new Proxy(Element.prototype.getBoundingClientRect, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const rect = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(thisArg) === false ) { return rect; }
                let { height, width } = rect;
                if ( propToValueMap.has('width') ) {
                    width = parseFloat(propToValueMap.get('width'));
                }
                if ( propToValueMap.has('height') ) {
                    height = parseFloat(propToValueMap.get('height'));
                }
                return new self.DOMRect(rect.x, rect.y, width, height);
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    /// brave-fix.js
    /// alias bf.js
    delete Navigator.prototype.brave
    delete window.navigator.brave
    
    } catch ( e ) { }
    try {
    {
      const args = ["#player-ads", "display", "block", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    
      (function spoofCSS(
        selector,
        ...args
    ) {
        if ( typeof selector !== 'string' ) { return; }
        if ( selector === '' ) { return; }
        const toCamelCase = s => s.replace(/-[a-z]/g, s => s.charAt(1).toUpperCase());
        const propToValueMap = new Map();
        for ( let i = 0; i < args.length; i += 2 ) {
            if ( typeof args[i+0] !== 'string' ) { break; }
            if ( args[i+0] === '' ) { break; }
            if ( typeof args[i+1] !== 'string' ) { break; }
            propToValueMap.set(toCamelCase(args[i+0]), args[i+1]);
        }
        const safe = safeSelf();
        const canDebug = scriptletGlobals.has('canDebug');
        const shouldDebug = canDebug && propToValueMap.get('debug') || 0;
        const shouldLog = canDebug && propToValueMap.has('log') || 0;
        const spoofStyle = (prop, real) => {
            const normalProp = toCamelCase(prop);
            const shouldSpoof = propToValueMap.has(normalProp);
            const value = shouldSpoof ? propToValueMap.get(normalProp) : real;
            if ( shouldLog === 2 || shouldSpoof && shouldLog === 1 ) {
                safe.uboLog(prop, value);
            }
            return value;
        };
        self.getComputedStyle = new Proxy(self.getComputedStyle, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const style = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(args[0]) === false ) { return style; }
                const proxiedStyle = new Proxy(style, {
                    get(target, prop, receiver) {
                        if ( typeof target[prop] === 'function' ) {
                            if ( prop === 'getPropertyValue' ) {
                                return (function(prop) {
                                    return spoofStyle(prop, target[prop]);
                                }).bind(target);
                            }
                            return target[prop].bind(target);
                        }
                        return spoofStyle(prop, Reflect.get(target, prop, receiver));
                    },
                    getOwnPropertyDescriptor(target, prop) {
                        if ( propToValueMap.has(prop) ) {
                            return {
                                configurable: true,
                                enumerable: true,
                                value: propToValueMap.get(prop),
                                writable: true,
                            };
                        }
                        return Reflect.getOwnPropertyDescriptor(target, prop);
                    },
                });
                return proxiedStyle;
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        Element.prototype.getBoundingClientRect = new Proxy(Element.prototype.getBoundingClientRect, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const rect = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(thisArg) === false ) { return rect; }
                let { height, width } = rect;
                if ( propToValueMap.has('width') ) {
                    width = parseFloat(propToValueMap.get('width'));
                }
                if ( propToValueMap.has('height') ) {
                    height = parseFloat(propToValueMap.get('height'));
                }
                return new self.DOMRect(rect.x, rect.y, width, height);
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["/\"adPlacements.*?(\"adSlots\"|\"adBreakHeartbeatParams\")/gms", "$1", "youtubei/v1/player", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function shouldLog(details) {
        if ( details instanceof Object === false ) { return false; }
        return scriptletGlobals.has('canDebug') && details.log;
    }
    function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    function parsePropertiesToMatch(propsToMatch, implicit = '') {
        const safe = safeSelf();
        const needles = new Map();
        if ( propsToMatch === undefined || propsToMatch === '' ) { return needles; }
        const options = { canNegate: true };
        for ( const needle of propsToMatch.split(/\s+/) ) {
            const [ prop, pattern ] = needle.split(':');
            if ( prop === '' ) { continue; }
            if ( pattern !== undefined ) {
                needles.set(prop, safe.initPattern(pattern, options));
            } else if ( implicit !== '' ) {
                needles.set(implicit, safe.initPattern(prop, options));
            }
        }
        return needles;
    }
    function matchObjectProperties(propNeedles, ...objs) {
        if ( matchObjectProperties.extractProperties === undefined ) {
            matchObjectProperties.extractProperties = (src, des, props) => {
                for ( const p of props ) {
                    const v = src[p];
                    if ( v === undefined ) { continue; }
                    des[p] = src[p];
                }
            };
        }
        const safe = safeSelf();
        const haystack = {};
        const props = safe.Array_from(propNeedles.keys());
        for ( const obj of objs ) {
            if ( obj instanceof Object === false ) { continue; }
            matchObjectProperties.extractProperties(obj, haystack, props);
        }
        for ( const [ prop, details ] of propNeedles ) {
            let value = haystack[prop];
            if ( value === undefined ) { continue; }
            if ( typeof value !== 'string' ) {
                try { value = JSON.stringify(value); }
                catch(ex) { }
                if ( typeof value !== 'string' ) { continue; }
            }
            if ( safe.testPattern(details, value) ) { continue; }
            return false;
        }
        return true;
    }
    
      (function trustedReplaceXhrResponse(
        pattern = '',
        replacement = '',
        propsToMatch = ''
    ) {
        const safe = safeSelf();
        const xhrInstances = new WeakMap();
        const extraArgs = safe.getExtraArgs(Array.from(arguments), 3);
        const logLevel = shouldLog({
            log: pattern === '' && 'all' || extraArgs.log,
        });
        const log = logLevel ? ((...args) => { safe.uboLog(...args); }) : (( ) => { }); 
        if ( pattern === '*' ) { pattern = '.*'; }
        const rePattern = safe.patternToRegex(pattern);
        const propNeedles = parsePropertiesToMatch(propsToMatch, 'url');
        self.XMLHttpRequest = class extends self.XMLHttpRequest {
            open(method, url, ...args) {
                const outerXhr = this;
                const xhrDetails = { method, url };
                let outcome = 'match';
                if ( propNeedles.size !== 0 ) {
                    if ( matchObjectProperties(propNeedles, xhrDetails) === false ) {
                        outcome = 'nomatch';
                    }
                }
                if ( outcome === logLevel || outcome === 'all' ) {
                    log(`xhr.open(${method}, ${url}, ${args.join(', ')})`);
                }
                if ( outcome === 'match' ) {
                    xhrInstances.set(outerXhr, xhrDetails);
                }
                return super.open(method, url, ...args);
            }
            get response() {
                const innerResponse = super.response;
                const xhrDetails = xhrInstances.get(this);
                if ( xhrDetails === undefined ) {
                    return innerResponse;
                }
                const responseLength = typeof innerResponse === 'string'
                    ? innerResponse.length
                    : undefined;
                if ( xhrDetails.lastResponseLength !== responseLength ) {
                    xhrDetails.response = undefined;
                    xhrDetails.lastResponseLength = responseLength;
                }
                if ( xhrDetails.response !== undefined ) {
                    return xhrDetails.response;
                }
                if ( typeof innerResponse !== 'string' ) {
                    return (xhrDetails.response = innerResponse);
                }
                const textBefore = innerResponse;
                const textAfter = textBefore.replace(rePattern, replacement);
                const outcome = textAfter !== textBefore ? 'match' : 'nomatch';
                if ( outcome === logLevel || logLevel === 'all' ) {
                    log(
                        `trusted-replace-xhr-response (${outcome})`,
                        `\n\tpattern: ${pattern}`, 
                        `\n\treplacement: ${replacement}`,
                    );
                }
                return (xhrDetails.response = textAfter);
            }
            get responseText() {
                const response = this.response;
                if ( typeof response !== 'string' ) {
                    return super.responseText;
                }
                return response;
            }
        };
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["/\"adPlacements.*?([A-Z]\"\\}|\"\\}{2})\\}\\],/", "", "player?key=", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function shouldLog(details) {
        if ( details instanceof Object === false ) { return false; }
        return scriptletGlobals.has('canDebug') && details.log;
    }
    function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    function parsePropertiesToMatch(propsToMatch, implicit = '') {
        const safe = safeSelf();
        const needles = new Map();
        if ( propsToMatch === undefined || propsToMatch === '' ) { return needles; }
        const options = { canNegate: true };
        for ( const needle of propsToMatch.split(/\s+/) ) {
            const [ prop, pattern ] = needle.split(':');
            if ( prop === '' ) { continue; }
            if ( pattern !== undefined ) {
                needles.set(prop, safe.initPattern(pattern, options));
            } else if ( implicit !== '' ) {
                needles.set(implicit, safe.initPattern(prop, options));
            }
        }
        return needles;
    }
    function matchObjectProperties(propNeedles, ...objs) {
        if ( matchObjectProperties.extractProperties === undefined ) {
            matchObjectProperties.extractProperties = (src, des, props) => {
                for ( const p of props ) {
                    const v = src[p];
                    if ( v === undefined ) { continue; }
                    des[p] = src[p];
                }
            };
        }
        const safe = safeSelf();
        const haystack = {};
        const props = safe.Array_from(propNeedles.keys());
        for ( const obj of objs ) {
            if ( obj instanceof Object === false ) { continue; }
            matchObjectProperties.extractProperties(obj, haystack, props);
        }
        for ( const [ prop, details ] of propNeedles ) {
            let value = haystack[prop];
            if ( value === undefined ) { continue; }
            if ( typeof value !== 'string' ) {
                try { value = JSON.stringify(value); }
                catch(ex) { }
                if ( typeof value !== 'string' ) { continue; }
            }
            if ( safe.testPattern(details, value) ) { continue; }
            return false;
        }
        return true;
    }
    function replaceFetchResponseFn(
        trusted = false,
        pattern = '',
        replacement = '',
        propsToMatch = ''
    ) {
        if ( trusted !== true ) { return; }
        const safe = safeSelf();
        const extraArgs = safe.getExtraArgs(Array.from(arguments), 4);
        const logLevel = shouldLog({
            log: pattern === '' || extraArgs.log,
        });
        const log = logLevel ? ((...args) => { safe.uboLog(...args); }) : (( ) => { }); 
        if ( pattern === '*' ) { pattern = '.*'; }
        const rePattern = safe.patternToRegex(pattern);
        const propNeedles = parsePropertiesToMatch(propsToMatch, 'url');
        self.fetch = new Proxy(self.fetch, {
            apply: function(target, thisArg, args) {
                if ( logLevel === true ) {
                    log('replace-fetch-response:', JSON.stringify(Array.from(args)).slice(1,-1));
                }
                const fetchPromise = Reflect.apply(target, thisArg, args);
                if ( pattern === '' ) { return fetchPromise; }
                let outcome = 'match';
                if ( propNeedles.size !== 0 ) {
                    const objs = [ args[0] instanceof Object ? args[0] : { url: args[0] } ];
                    if ( objs[0] instanceof Request ) {
                        try { objs[0] = safe.Request_clone.call(objs[0]); }
                        catch(ex) { log(ex); }
                    }
                    if ( args[1] instanceof Object ) {
                        objs.push(args[1]);
                    }
                    if ( matchObjectProperties(propNeedles, ...objs) === false ) {
                        outcome = 'nomatch';
                    }
                    if ( outcome === logLevel || logLevel === 'all' ) {
                        log(
                            `replace-fetch-response (${outcome})`,
                            `\n\tpropsToMatch: ${JSON.stringify(Array.from(propNeedles)).slice(1,-1)}`,
                            '\n\tprops:', ...args,
                        );
                    }
                }
                if ( outcome === 'nomatch' ) { return fetchPromise; }
                return fetchPromise.then(responseBefore => {
                    const response = responseBefore.clone();
                    return response.text().then(textBefore => {
                        const textAfter = textBefore.replace(rePattern, replacement);
                        const outcome = textAfter !== textBefore ? 'match' : 'nomatch';
                        if ( outcome === logLevel || logLevel === 'all' ) {
                            log(
                                `replace-fetch-response (${outcome})`,
                                `\n\tpattern: ${pattern}`, 
                                `\n\treplacement: ${replacement}`,
                            );
                        }
                        if ( outcome === 'nomatch' ) { return responseBefore; }
                        const responseAfter = new Response(textAfter, {
                            status: responseBefore.status,
                            statusText: responseBefore.statusText,
                            headers: responseBefore.headers,
                        });
                        Object.defineProperties(responseAfter, {
                            ok: { value: responseBefore.ok },
                            redirected: { value: responseBefore.redirected },
                            type: { value: responseBefore.type },
                            url: { value: responseBefore.url },
                        });
                        return responseAfter;
                    }).catch(reason => {
                        log('replace-fetch-response:', reason);
                        return responseBefore;
                    });
                }).catch(reason => {
                    log('replace-fetch-response:', reason);
                    return fetchPromise;
                });
            }
        });
    }
    
      (function trustedReplaceFetchResponse(...args) {
        replaceFetchResponseFn(true, ...args);
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = [".ytp-suggested-action-badge", "display", "block", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    
      (function spoofCSS(
        selector,
        ...args
    ) {
        if ( typeof selector !== 'string' ) { return; }
        if ( selector === '' ) { return; }
        const toCamelCase = s => s.replace(/-[a-z]/g, s => s.charAt(1).toUpperCase());
        const propToValueMap = new Map();
        for ( let i = 0; i < args.length; i += 2 ) {
            if ( typeof args[i+0] !== 'string' ) { break; }
            if ( args[i+0] === '' ) { break; }
            if ( typeof args[i+1] !== 'string' ) { break; }
            propToValueMap.set(toCamelCase(args[i+0]), args[i+1]);
        }
        const safe = safeSelf();
        const canDebug = scriptletGlobals.has('canDebug');
        const shouldDebug = canDebug && propToValueMap.get('debug') || 0;
        const shouldLog = canDebug && propToValueMap.has('log') || 0;
        const spoofStyle = (prop, real) => {
            const normalProp = toCamelCase(prop);
            const shouldSpoof = propToValueMap.has(normalProp);
            const value = shouldSpoof ? propToValueMap.get(normalProp) : real;
            if ( shouldLog === 2 || shouldSpoof && shouldLog === 1 ) {
                safe.uboLog(prop, value);
            }
            return value;
        };
        self.getComputedStyle = new Proxy(self.getComputedStyle, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const style = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(args[0]) === false ) { return style; }
                const proxiedStyle = new Proxy(style, {
                    get(target, prop, receiver) {
                        if ( typeof target[prop] === 'function' ) {
                            if ( prop === 'getPropertyValue' ) {
                                return (function(prop) {
                                    return spoofStyle(prop, target[prop]);
                                }).bind(target);
                            }
                            return target[prop].bind(target);
                        }
                        return spoofStyle(prop, Reflect.get(target, prop, receiver));
                    },
                    getOwnPropertyDescriptor(target, prop) {
                        if ( propToValueMap.has(prop) ) {
                            return {
                                configurable: true,
                                enumerable: true,
                                value: propToValueMap.get(prop),
                                writable: true,
                            };
                        }
                        return Reflect.getOwnPropertyDescriptor(target, prop);
                    },
                });
                return proxiedStyle;
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        Element.prototype.getBoundingClientRect = new Proxy(Element.prototype.getBoundingClientRect, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const rect = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(thisArg) === false ) { return rect; }
                let { height, width } = rect;
                if ( propToValueMap.has('width') ) {
                    width = parseFloat(propToValueMap.get('width'));
                }
                if ( propToValueMap.has('height') ) {
                    height = parseFloat(propToValueMap.get('height'));
                }
                return new self.DOMRect(rect.x, rect.y, width, height);
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["/\"adPlacements.*?([A-Z]\"\\}|\"\\}{2})\\}\\],/", "", "/playlist\\?list=|player\\?key=|watch\\?v=|youtubei\\/v1\\/player/", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function shouldLog(details) {
        if ( details instanceof Object === false ) { return false; }
        return scriptletGlobals.has('canDebug') && details.log;
    }
    function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    function parsePropertiesToMatch(propsToMatch, implicit = '') {
        const safe = safeSelf();
        const needles = new Map();
        if ( propsToMatch === undefined || propsToMatch === '' ) { return needles; }
        const options = { canNegate: true };
        for ( const needle of propsToMatch.split(/\s+/) ) {
            const [ prop, pattern ] = needle.split(':');
            if ( prop === '' ) { continue; }
            if ( pattern !== undefined ) {
                needles.set(prop, safe.initPattern(pattern, options));
            } else if ( implicit !== '' ) {
                needles.set(implicit, safe.initPattern(prop, options));
            }
        }
        return needles;
    }
    function matchObjectProperties(propNeedles, ...objs) {
        if ( matchObjectProperties.extractProperties === undefined ) {
            matchObjectProperties.extractProperties = (src, des, props) => {
                for ( const p of props ) {
                    const v = src[p];
                    if ( v === undefined ) { continue; }
                    des[p] = src[p];
                }
            };
        }
        const safe = safeSelf();
        const haystack = {};
        const props = safe.Array_from(propNeedles.keys());
        for ( const obj of objs ) {
            if ( obj instanceof Object === false ) { continue; }
            matchObjectProperties.extractProperties(obj, haystack, props);
        }
        for ( const [ prop, details ] of propNeedles ) {
            let value = haystack[prop];
            if ( value === undefined ) { continue; }
            if ( typeof value !== 'string' ) {
                try { value = JSON.stringify(value); }
                catch(ex) { }
                if ( typeof value !== 'string' ) { continue; }
            }
            if ( safe.testPattern(details, value) ) { continue; }
            return false;
        }
        return true;
    }
    
      (function trustedReplaceXhrResponse(
        pattern = '',
        replacement = '',
        propsToMatch = ''
    ) {
        const safe = safeSelf();
        const xhrInstances = new WeakMap();
        const extraArgs = safe.getExtraArgs(Array.from(arguments), 3);
        const logLevel = shouldLog({
            log: pattern === '' && 'all' || extraArgs.log,
        });
        const log = logLevel ? ((...args) => { safe.uboLog(...args); }) : (( ) => { }); 
        if ( pattern === '*' ) { pattern = '.*'; }
        const rePattern = safe.patternToRegex(pattern);
        const propNeedles = parsePropertiesToMatch(propsToMatch, 'url');
        self.XMLHttpRequest = class extends self.XMLHttpRequest {
            open(method, url, ...args) {
                const outerXhr = this;
                const xhrDetails = { method, url };
                let outcome = 'match';
                if ( propNeedles.size !== 0 ) {
                    if ( matchObjectProperties(propNeedles, xhrDetails) === false ) {
                        outcome = 'nomatch';
                    }
                }
                if ( outcome === logLevel || outcome === 'all' ) {
                    log(`xhr.open(${method}, ${url}, ${args.join(', ')})`);
                }
                if ( outcome === 'match' ) {
                    xhrInstances.set(outerXhr, xhrDetails);
                }
                return super.open(method, url, ...args);
            }
            get response() {
                const innerResponse = super.response;
                const xhrDetails = xhrInstances.get(this);
                if ( xhrDetails === undefined ) {
                    return innerResponse;
                }
                const responseLength = typeof innerResponse === 'string'
                    ? innerResponse.length
                    : undefined;
                if ( xhrDetails.lastResponseLength !== responseLength ) {
                    xhrDetails.response = undefined;
                    xhrDetails.lastResponseLength = responseLength;
                }
                if ( xhrDetails.response !== undefined ) {
                    return xhrDetails.response;
                }
                if ( typeof innerResponse !== 'string' ) {
                    return (xhrDetails.response = innerResponse);
                }
                const textBefore = innerResponse;
                const textAfter = textBefore.replace(rePattern, replacement);
                const outcome = textAfter !== textBefore ? 'match' : 'nomatch';
                if ( outcome === logLevel || logLevel === 'all' ) {
                    log(
                        `trusted-replace-xhr-response (${outcome})`,
                        `\n\tpattern: ${pattern}`, 
                        `\n\treplacement: ${replacement}`,
                    );
                }
                return (xhrDetails.response = textAfter);
            }
            get responseText() {
                const response = this.response;
                if ( typeof response !== 'string' ) {
                    return super.responseText;
                }
                return response;
            }
        };
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    (async _ => {
      if (self.cookieStore === undefined) {
        // Do nothing on iOS. The problem doesn't exist there, and the
        // solution wouldn't work anyway
        return
      }
      const storeKey = 'brave::wide'
      const cookieKey = 'wide'
    
      const wideCookie = await cookieStore.get(cookieKey)
      const wideCookieBackup = localStorage.getItem(storeKey)
    
      // Set the cookie from localStorage iff: 
      // 1) it doesn't already exist.
      // 2) we have a backup in localStorage.
      if (!wideCookie && wideCookieBackup) {
        // The cookie object is stored as a string. Parse it.
        const cookieObj = JSON.parse(wideCookieBackup)
        await cookieStore.set(cookieObj)
        // Refresh the page to make YT use the new cookie.
        location.reload()
      }
    
      // Persist the cookie value to localStorage every second.
      setInterval(async _ => {
        try {
          const wideCookie = await cookieStore.get(cookieKey)
          // We have to stringify the cookie object to store it in localStorage.
          if (wideCookie) {
            localStorage.setItem(storeKey, JSON.stringify(wideCookie))
          } else {
            localStorage.removeItem(storeKey)
          }
        } catch (e) {
          // swallow error from no cookie existing
        }
      }, 1000)
    })();
    
    } catch ( e ) { }
    try {
    {
      const args = ["playerResponse.adPlacements", "undefined", "{{3}}", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    function runAt(fn, when) {
        const intFromReadyState = state => {
            const targets = {
                'loading': 1,
                'interactive': 2, 'end': 2, '2': 2,
                'complete': 3, 'idle': 3, '3': 3,
            };
            const tokens = Array.isArray(state) ? state : [ state ];
            for ( const token of tokens ) {
                const prop = `${token}`;
                if ( targets.hasOwnProperty(prop) === false ) { continue; }
                return targets[prop];
            }
            return 0;
        };
        const runAt = intFromReadyState(when);
        if ( intFromReadyState(document.readyState) >= runAt ) {
            fn(); return;
        }
        const onStateChange = ( ) => {
            if ( intFromReadyState(document.readyState) < runAt ) { return; }
            fn();
            safe.removeEventListener.apply(document, args);
        };
        const safe = safeSelf();
        const args = [ 'readystatechange', onStateChange, { capture: true } ];
        safe.addEventListener.apply(document, args);
    }
    function setConstantCore(
        trusted = false,
        chain = '',
        cValue = ''
    ) {
        if ( chain === '' ) { return; }
        const safe = safeSelf();
        const extraArgs = safe.getExtraArgs(Array.from(arguments), 3);
        function setConstant(chain, cValue) {
            const trappedProp = (( ) => {
                const pos = chain.lastIndexOf('.');
                if ( pos === -1 ) { return chain; }
                return chain.slice(pos+1);
            })();
            if ( trappedProp === '' ) { return; }
            const thisScript = document.currentScript;
            const cloakFunc = fn => {
                safe.Object_defineProperty(fn, 'name', { value: trappedProp });
                const proxy = new Proxy(fn, {
                    defineProperty(target, prop) {
                        if ( prop !== 'toString' ) {
                            return Reflect.defineProperty(...arguments);
                        }
                        return true;
                    },
                    deleteProperty(target, prop) {
                        if ( prop !== 'toString' ) {
                            return Reflect.deleteProperty(...arguments);
                        }
                        return true;
                    },
                    get(target, prop) {
                        if ( prop === 'toString' ) {
                            return function() {
                                return `function ${trappedProp}() { [native code] }`;
                            }.bind(null);
                        }
                        return Reflect.get(...arguments);
                    },
                });
                return proxy;
            };
            if ( cValue === 'undefined' ) {
                cValue = undefined;
            } else if ( cValue === 'false' ) {
                cValue = false;
            } else if ( cValue === 'true' ) {
                cValue = true;
            } else if ( cValue === 'null' ) {
                cValue = null;
            } else if ( cValue === "''" || cValue === '' ) {
                cValue = '';
            } else if ( cValue === '[]' || cValue === 'emptyArr' ) {
                cValue = [];
            } else if ( cValue === '{}' || cValue === 'emptyObj' ) {
                cValue = {};
            } else if ( cValue === 'noopFunc' ) {
                cValue = cloakFunc(function(){});
            } else if ( cValue === 'trueFunc' ) {
                cValue = cloakFunc(function(){ return true; });
            } else if ( cValue === 'falseFunc' ) {
                cValue = cloakFunc(function(){ return false; });
            } else if ( /^-?\d+$/.test(cValue) ) {
                cValue = parseInt(cValue);
                if ( isNaN(cValue) ) { return; }
                if ( Math.abs(cValue) > 0x7FFF ) { return; }
            } else if ( trusted ) {
                if ( cValue.startsWith('{') && cValue.endsWith('}') ) {
                    try { cValue = safe.JSON_parse(cValue).value; } catch(ex) { return; }
                }
            } else {
                return;
            }
            if ( extraArgs.as !== undefined ) {
                const value = cValue;
                if ( extraArgs.as === 'function' ) {
                    cValue = ( ) => value;
                } else if ( extraArgs.as === 'callback' ) {
                    cValue = ( ) => (( ) => value);
                } else if ( extraArgs.as === 'resolved' ) {
                    cValue = Promise.resolve(value);
                } else if ( extraArgs.as === 'rejected' ) {
                    cValue = Promise.reject(value);
                }
            }
            let aborted = false;
            const mustAbort = function(v) {
                if ( trusted ) { return false; }
                if ( aborted ) { return true; }
                aborted =
                    (v !== undefined && v !== null) &&
                    (cValue !== undefined && cValue !== null) &&
                    (typeof v !== typeof cValue);
                return aborted;
            };
            // https://github.com/uBlockOrigin/uBlock-issues/issues/156
            //   Support multiple trappers for the same property.
            const trapProp = function(owner, prop, configurable, handler) {
                if ( handler.init(configurable ? owner[prop] : cValue) === false ) { return; }
                const odesc = Object.getOwnPropertyDescriptor(owner, prop);
                let prevGetter, prevSetter;
                if ( odesc instanceof Object ) {
                    owner[prop] = cValue;
                    if ( odesc.get instanceof Function ) {
                        prevGetter = odesc.get;
                    }
                    if ( odesc.set instanceof Function ) {
                        prevSetter = odesc.set;
                    }
                }
                try {
                    safe.Object_defineProperty(owner, prop, {
                        configurable,
                        get() {
                            if ( prevGetter !== undefined ) {
                                prevGetter();
                            }
                            return handler.getter(); // cValue
                        },
                        set(a) {
                            if ( prevSetter !== undefined ) {
                                prevSetter(a);
                            }
                            handler.setter(a);
                        }
                    });
                } catch(ex) {
                }
            };
            const trapChain = function(owner, chain) {
                const pos = chain.indexOf('.');
                if ( pos === -1 ) {
                    trapProp(owner, chain, false, {
                        v: undefined,
                        init: function(v) {
                            if ( mustAbort(v) ) { return false; }
                            this.v = v;
                            return true;
                        },
                        getter: function() {
                            return document.currentScript === thisScript
                                ? this.v
                                : cValue;
                        },
                        setter: function(a) {
                            if ( mustAbort(a) === false ) { return; }
                            cValue = a;
                        }
                    });
                    return;
                }
                const prop = chain.slice(0, pos);
                const v = owner[prop];
                chain = chain.slice(pos + 1);
                if ( v instanceof Object || typeof v === 'object' && v !== null ) {
                    trapChain(v, chain);
                    return;
                }
                trapProp(owner, prop, true, {
                    v: undefined,
                    init: function(v) {
                        this.v = v;
                        return true;
                    },
                    getter: function() {
                        return this.v;
                    },
                    setter: function(a) {
                        this.v = a;
                        if ( a instanceof Object ) {
                            trapChain(a, chain);
                        }
                    }
                });
            };
            trapChain(window, chain);
        }
        runAt(( ) => {
            setConstant(chain, cValue);
        }, extraArgs.runAt);
    }
    
      (function setConstant(
        ...args
    ) {
        setConstantCore(false, ...args);
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["resolve(1)", "5000", "0.001", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    
      (function adjustSetTimeout(
        needleArg = '',
        delayArg = '',
        boostArg = ''
    ) {
        if ( typeof needleArg !== 'string' ) { return; }
        const safe = safeSelf();
        const reNeedle = safe.patternToRegex(needleArg);
        let delay = delayArg !== '*' ? parseInt(delayArg, 10) : -1;
        if ( isNaN(delay) || isFinite(delay) === false ) { delay = 1000; }
        let boost = parseFloat(boostArg);
        boost = isNaN(boost) === false && isFinite(boost)
            ? Math.min(Math.max(boost, 0.001), 50)
            : 0.05;
        self.setTimeout = new Proxy(self.setTimeout, {
            apply: function(target, thisArg, args) {
                const [ a, b ] = args;
                if (
                    (delay === -1 || b === delay) &&
                    reNeedle.test(a.toString())
                ) {
                    args[1] = b * boost;
                }
                return target.apply(thisArg, args);
            }
        });
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    try {
    {
      const args = ["ytd-banner-promo-renderer", "display", "block", "{{4}}", "{{5}}", "{{6}}", "{{7}}", "{{8}}", "{{9}}"];
      let last_arg_index = 0;
      for (const arg_index in args) {
        if (args[arg_index] === '{{' + (Number(arg_index) + 1) + '}}') {
          break;
        }
        last_arg_index += 1;
      }
      function safeSelf() {
        if ( scriptletGlobals.has('safeSelf') ) {
            return scriptletGlobals.get('safeSelf');
        }
        const self = globalThis;
        const safe = {
            'Array_from': Array.from,
            'Error': self.Error,
            'Function_toStringFn': self.Function.prototype.toString,
            'Function_toString': thisArg => safe.Function_toStringFn.call(thisArg),
            'Math_floor': Math.floor,
            'Math_max': Math.max,
            'Math_min': Math.min,
            'Math_random': Math.random,
            'Object_defineProperty': Object.defineProperty.bind(Object),
            'RegExp': self.RegExp,
            'RegExp_test': self.RegExp.prototype.test,
            'RegExp_exec': self.RegExp.prototype.exec,
            'Request_clone': self.Request.prototype.clone,
            'XMLHttpRequest': self.XMLHttpRequest,
            'addEventListener': self.EventTarget.prototype.addEventListener,
            'removeEventListener': self.EventTarget.prototype.removeEventListener,
            'fetch': self.fetch,
            'JSON': self.JSON,
            'JSON_parseFn': self.JSON.parse,
            'JSON_stringifyFn': self.JSON.stringify,
            'JSON_parse': (...args) => safe.JSON_parseFn.call(safe.JSON, ...args),
            'JSON_stringify': (...args) => safe.JSON_stringifyFn.call(safe.JSON, ...args),
            'log': console.log.bind(console),
            uboLog(...args) {
                if ( scriptletGlobals.has('canDebug') === false ) { return; }
                if ( args.length === 0 ) { return; }
                if ( `${args[0]}` === '' ) { return; }
                this.log('[uBO]', ...args);
            },
            initPattern(pattern, options = {}) {
                if ( pattern === '' ) {
                    return { matchAll: true };
                }
                const expect = (options.canNegate !== true || pattern.startsWith('!') === false);
                if ( expect === false ) {
                    pattern = pattern.slice(1);
                }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match !== null ) {
                    return {
                        re: new this.RegExp(
                            match[1],
                            match[2] || options.flags
                        ),
                        expect,
                    };
                }
                if ( options.flags !== undefined ) {
                    return {
                        re: new this.RegExp(pattern.replace(
                            /[.*+?^${}()|[\]\\]/g, '\\$&'),
                            options.flags
                        ),
                        expect,
                    };
                }
                return { pattern, expect };
            },
            testPattern(details, haystack) {
                if ( details.matchAll ) { return true; }
                if ( details.re ) {
                    return this.RegExp_test.call(details.re, haystack) === details.expect;
                }
                return haystack.includes(details.pattern) === details.expect;
            },
            patternToRegex(pattern, flags = undefined, verbatim = false) {
                if ( pattern === '' ) { return /^/; }
                const match = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
                if ( match === null ) {
                    const reStr = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return new RegExp(verbatim ? `^${reStr}$` : reStr, flags);
                }
                try {
                    return new RegExp(match[1], match[2] || undefined);
                }
                catch(ex) {
                }
                return /^/;
            },
            getExtraArgs(args, offset = 0) {
                const entries = args.slice(offset).reduce((out, v, i, a) => {
                    if ( (i & 1) === 0 ) {
                        const rawValue = a[i+1];
                        const value = /^\d+$/.test(rawValue)
                            ? parseInt(rawValue, 10)
                            : rawValue;
                        out.push([ a[i], value ]);
                    }
                    return out;
                }, []);
                return Object.fromEntries(entries);
            },
        };
        scriptletGlobals.set('safeSelf', safe);
        return safe;
    }
    
      (function spoofCSS(
        selector,
        ...args
    ) {
        if ( typeof selector !== 'string' ) { return; }
        if ( selector === '' ) { return; }
        const toCamelCase = s => s.replace(/-[a-z]/g, s => s.charAt(1).toUpperCase());
        const propToValueMap = new Map();
        for ( let i = 0; i < args.length; i += 2 ) {
            if ( typeof args[i+0] !== 'string' ) { break; }
            if ( args[i+0] === '' ) { break; }
            if ( typeof args[i+1] !== 'string' ) { break; }
            propToValueMap.set(toCamelCase(args[i+0]), args[i+1]);
        }
        const safe = safeSelf();
        const canDebug = scriptletGlobals.has('canDebug');
        const shouldDebug = canDebug && propToValueMap.get('debug') || 0;
        const shouldLog = canDebug && propToValueMap.has('log') || 0;
        const spoofStyle = (prop, real) => {
            const normalProp = toCamelCase(prop);
            const shouldSpoof = propToValueMap.has(normalProp);
            const value = shouldSpoof ? propToValueMap.get(normalProp) : real;
            if ( shouldLog === 2 || shouldSpoof && shouldLog === 1 ) {
                safe.uboLog(prop, value);
            }
            return value;
        };
        self.getComputedStyle = new Proxy(self.getComputedStyle, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const style = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(args[0]) === false ) { return style; }
                const proxiedStyle = new Proxy(style, {
                    get(target, prop, receiver) {
                        if ( typeof target[prop] === 'function' ) {
                            if ( prop === 'getPropertyValue' ) {
                                return (function(prop) {
                                    return spoofStyle(prop, target[prop]);
                                }).bind(target);
                            }
                            return target[prop].bind(target);
                        }
                        return spoofStyle(prop, Reflect.get(target, prop, receiver));
                    },
                    getOwnPropertyDescriptor(target, prop) {
                        if ( propToValueMap.has(prop) ) {
                            return {
                                configurable: true,
                                enumerable: true,
                                value: propToValueMap.get(prop),
                                writable: true,
                            };
                        }
                        return Reflect.getOwnPropertyDescriptor(target, prop);
                    },
                });
                return proxiedStyle;
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        Element.prototype.getBoundingClientRect = new Proxy(Element.prototype.getBoundingClientRect, {
            apply: function(target, thisArg, args) {
                if ( shouldDebug !== 0 ) { debugger; }    // jshint ignore: line
                const rect = Reflect.apply(target, thisArg, args);
                const targetElements = new WeakSet(document.querySelectorAll(selector));
                if ( targetElements.has(thisArg) === false ) { return rect; }
                let { height, width } = rect;
                if ( propToValueMap.has('width') ) {
                    width = parseFloat(propToValueMap.get('width'));
                }
                if ( propToValueMap.has('height') ) {
                    height = parseFloat(propToValueMap.get('height'));
                }
                return new self.DOMRect(rect.x, rect.y, width, height);
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    })(...args.slice(0, last_arg_index))
    }
    } catch ( e ) { }
    
    })()