!function() {

  // https://www.youtube.com/s/desktop/28b0985e/jsbin/desktop_polymer.vflset/desktop_polymer.js

  /*
  var Lx = function(a) {
    this.event = a
};
*/

/*

    if (window.ShadyDOM && window.ShadyDOM.inUse && window.ShadyDOM.noPatch && window.ShadyDOM.Wrapper) {
        var NUa = window.ShadyDOM.Wrapper
          , OUa = function() {  // MUa
            return NUa.apply(this, arguments) || this  
        };
*/
       

/*

CP = new WeakMap();

Ki = {
  cancelDebouncedJobMap: new WeakMap(),
  cancelThrottledJobMap: new WeakMap(),
}

*/


/*

// psudeo element
    function kD(a) {
        return a instanceof lD ? a : new lD(a)
    }

    */



    var addToPool = function(element) { // Fib
        const componentName = element.is;
        if (componentName) {
            let pool = Cib.get(componentName);
            if (!pool) {
                pool = [];
                Cib.set(componentName, pool);
            }
            const poolConfig = getConfigEntry("ELEMENT_POOL_CONFIG") || {};
            let poolCap = poolConfig[componentName];
            if (void 0 === poolCap) {
                poolCap = sl("ELEMENT_POOL_DEFAULT_CAP", 0);
            }
            if (pool.length < poolCap) pool.push(element);
        } else
            zq(new Cm("Element pool should only handle custom elements:",element.nodeName))
    }


  /**
   * @param {string} componentName
   * @param {Element} elementNode
   * @param {boolean} isCustomCreation
   * @return {undefined}
   */
  function removeRendererStamper(componentName, elementNode, isCustomCreation) { // zUb
    if (isCustomCreation) {
      if (elementNode.is) {
        if (DP.has(elementNode)) {
          let options = DP.get(elementNode);
          let item = options.listener;
          delete elementNode[options.property];
          if ("element" === item.type) {
            elementNode.removeEventListener(item.eventName, item.handler);
          } else {
            if ("polymer" === item.type) {
              elementNode.unlisten(elementNode, item.eventName, item.methodName);
            }
          }
          DP.delete(elementNode);
        }
        addToPool(elementNode);
      } else {
        if (elementNode.__proto__ == HTMLElement.prototype) {
          elementNode = new Cm("Rendererstamper removed a non custom element", "Stamper: " + componentName + " element: " + (elementNode && elementNode.nodeName));
          zq(elementNode);
        }
      }
    }
  }


  var ytConfigData = yt.config_; // ql

  /**
   * @param {Text} componentName
   * @param {Node} parentNode
   * @param {Object} node
   * @param {boolean} isCustomCreation
   * @return {undefined}
   */
  function remove(componentName, parentNode, node, isCustomCreation) { // AUb
    var root = parentNode.node ? parentNode.node : parentNode;
    if (kD(node).parentNode === root) {
      parentNode.removeChild(node);
      removeRendererStamper(componentName, node, isCustomCreation);
    }
    let handler = CP.get(node);
    if (handler) {
      CP.delete(node);
      Ki.cancelJob(handler);
    }
    /** @type {boolean} */
    node.hidden = false;
  }
  /**
   * @param {string} name
   * @param {boolean} def
   * @return {any}
   */
  function getConfigEntry(name, def) { // sl
    return name in ytConfigData ? ytConfigData[name] : def;
  }
  /**
   * @param {string} name
   * @param {boolean} def
   * @return {boolean}
   */
  function hasConfigEntry(name, def) { // tl
    return !!getConfigEntry(name, def);
  }
  /**
   * @param {Object} obj
   * @param {Object} context
   * @return {string | null}
   */
  function getObjectTag(obj, context) { // vUb
    var key;
    for (key in obj) {
      if (obj.hasOwnProperty(key) && context[key]) {
        return key;
      }
    }
    return null;
  }
  /**
   * @param {any} val
   * @return {?}
   */
  function isReusedVal(val) { // yUb
      if (void 0 === val) {
          if (H("kevlar_tuner_should_test_reuse_components")) {
              return H("kevlar_tuner_should_reuse_components");
          } else {
              return hasConfigEntry("REUSE_COMPONENTS", false);
          }
      }
    return  val || false;
  }
  /**
   * @param {string} componentName
   * @param {Element} parent
   * @param {number} idx
   * @param {boolean} isCustomCreation
   * @return {undefined}
   */
  function removeAfterChildIdx(componentName, parent, idx, isCustomCreation) { // BUb
    if (!parent) return;
    if (!parent.children) return;
    /** @type {Element} */
    var child = parent.children[idx];
    if (child) {
      if (hasConfigEntry("DEFERRED_DETACH")) {
        for (; child && !CP.has(child); child = child.nextElementSibling) {
          /** @type {Object} */
          var node = child;
          /** @type {boolean} */
          node.hidden = true;
          var pdataOld = Gm(Ki, remove.bind(null, componentName, parent, node, isCustomCreation), 0);
          CP.set(node, pdataOld);
        }
      } else {
        for (; (node = parent.lastElementChild);) {
          parent.removeChild(node);
          removeRendererStamper(componentName, node, isCustomCreation);
          if (node == child) break;
        }
      }
    }
  }
  /**
   * @param {EventTarget} target
   * @param {string} evtType
   * @param {any} detail
   * @param {Object} eventOptions
   * @return {?}
   */
  function dispatchCustomEvent(target, evtType, detail, eventOptions) { // Xz
    if (!eventOptions) {
      eventOptions = {
        bubbles : true,
        cancelable : false,
        composed : true
      };
    }
    if (null !== detail) {
      if (void 0 !== detail) {
        /** @type {number} */
        eventOptions.detail = detail;
      }
    }
    /** @type {CustomEvent} */
    evtType = new CustomEvent(evtType, eventOptions);
    target.dispatchEvent(evtType);
    return evtType;
  }
  /**
   * @param {Element} elem
   * @return {?}
   */
  var getDomApi = function(elem) { // Mx
    elem = elem || document;
    if (elem instanceof MUa) {
      return elem;
    }
    if (elem instanceof Lx) {
      return elem;
    }
    var obj = elem.__domApi;
    if (!obj) {
      if (elem instanceof Event) {
        obj = new Lx(elem);
      } else {
        obj = new MUa(elem);
      }
      elem.__domApi = obj;
    }
    return obj;
  };

  const stableListKey1 = "kevlar_tuner_should_test_maintain_stable_list";
  const stableListKey2 = "kevlar_should_maintain_stable_list";
  window.myFuncs = {
    /**
     * @param {(Array<>|null)} dataArray
     * @param {string} containerId
     * @param {Object} childComponents
     * @param {boolean} isCustomCreation
     * @param {boolean} toDispatchFinished
     * @param {boolean} isStableList
     * @return {undefined}
     */
    stampDomArray_ : function(dataArray, containerId, childComponents, isCustomCreation, toDispatchFinished, isStableList) {
      var container = this.getStampContainer_(containerId);
      if (container) {
        let nativeElement = getDomApi(container)
        isCustomCreation = isReusedVal(isCustomCreation)
        if (dataArray) {
          /** @type {number} */
          let counter = 0;
          /** @type {number} */
          var idx = 0;
          var child;
          if (void 0 === isStableList) {
            isStableList = H(stableListKey1) ? H(stableListKey2) : hasConfigEntry("STAMPER_STABLE_LIST", false)
          } else {
            isStableList = isStableList || false;
          }
          if (isStableList) {
            for (child = nativeElement.firstElementChild;child && (!CP.has(child) && dataArray.length > idx);) {
              let dataEntry = dataArray[idx];
              let objectTag = getObjectTag(childComponents, dataEntry);
              if (objectTag) {
                var componentName = this.getComponentName_(childComponents[objectTag], dataEntry[objectTag])
                if (componentName != child.is) {
                  var node = this.createComponent_(childComponents[objectTag], dataEntry[objectTag], isCustomCreation);
                  var nextElm = getDomApi(child).nextElementSibling;
                  if (nextElm) {
                    nativeElement.insertBefore(node, nextElm);
                  } else {
                    nativeElement.appendChild(node);
                  }
                  remove(this.is, nativeElement, child, isCustomCreation);
                  child = node;
                } else {
                  this.telemetry_.reuse++;
                }
                this.deferRenderStamperBinding_(child, childComponents[objectTag], dataEntry[objectTag]);
                counter++;
                idx++;
                child = getDomApi(child).nextElementSibling;
              } else {
                idx++;
              }
            }
          }
          removeAfterChildIdx(this.is, nativeElement, counter, isCustomCreation);
          let childElement = child;
          if (dataArray.length > idx) {
            /** @type {DocumentFragment} */
            let newFragment = document.createDocumentFragment();
            /** @type {number} */
            let fragmentListCount = dataArray.length;
            for (;idx < fragmentListCount;idx++) {
              let oldFragment = dataArray[idx]
              const objectTag = getObjectTag(childComponents, oldFragment)
              if (objectTag) {
                child = this.createComponent_(childComponents[objectTag], oldFragment[objectTag], isCustomCreation);
                this.deferRenderStamperBinding_(child, childComponents[objectTag], oldFragment[objectTag]);
                newFragment.appendChild(child);
              }
            }
            if (childElement && (getDomApi(childElement).parentNode && (child && !CP.has(child)))) {
              nativeElement.insertBefore(newFragment, childElement);
            } else {
              nativeElement.appendChild(newFragment);
            }
          }
          this.flushRenderStamperComponentBindings_();
          if (this.markDirty) {
            this.markDirty();
          }
          if (toDispatchFinished) {
            dispatchCustomEvent(this.hostElement, "yt-rendererstamper-finished", {
              container : container
            });
          }
        } else {
          removeAfterChildIdx(this.is, nativeElement, 0, isCustomCreation);
        }
      } else {
        yq(new Cm("Container object not found", containerId, this.hostElement ? this.hostElement.is : ""));
      }
    }
  };
}();
