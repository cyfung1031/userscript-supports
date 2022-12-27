/* 
Copyright 2022 CY FUNG

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

function structurize(htmlText) {
  // FOR DEBUG ONLY
  const NODE_TYPES = new Map()
  for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(Node))) {
    if (typeof desc.value === 'number' && desc.writable === false && desc.enumerable === true && desc.configurable === false) {
      if (key.endsWith('_NODE')) {
        NODE_TYPES.set(desc.value, key)
      }
    }
  }
  function prettyElm(/** @type {Element} */ elm) {
    if (!elm || !elm.nodeName) return null;
    const eId = elm.id || null;
    const eClassList = elm.classList || null;
    return [elm.nodeName.toLowerCase(), typeof eId == 'string' ? "#" + eId : '', eClassList && eClassList.length > 0 ? '.' + [...eClassList].join('.') : ''].join('');
  }
  let template = document.createElement('template')
  template.innerHTML = htmlText
  let frag = template.content
  function looper( /** @type {DocumentFragment | Document | Node | HTMLElement | null} */ elm, parent) {
    if (!elm) return
    
    if (elm.nodeType === 3) {
      return {
        type: NODE_TYPES.get(elm.nodeType) || elm.nodeType,
        text: elm.textContent
      }
    } else if (elm.nodeType !== 1 && (elm.childNodes || []).length === 0) {
      return {
        type: NODE_TYPES.get(elm.nodeType) || elm.nodeType,
      }
    }
    
    let res = {
      type: NODE_TYPES.get(elm.nodeType) || elm.nodeType,
    }
    
    let childs = []
    let noChild = true
    if (elm.nodeName === 'SCRIPT' || elm.nodeName === 'STYLE') {
      noChild = false

    } else {
      if ('childNodes' in elm) {
        for (const node of elm.childNodes) {
          childs.push(looper(node, elm))
          noChild = false
        }
      }
    }

    if (elm.nodeType === 1) {
      res.selector = prettyElm(elm)
      /** @type {NamedNodeMap} */
      let attributes = elm.attributes
      res.selector += [...attributes].map(attribute => {
        if (attribute.name === 'id' || attribute.name === 'class') return null
        if (attribute.name === 'src' || attribute.name === 'href') return null
        if (attribute.name === 'rel' || attribute.name === 'content') return null
        if (attribute.name.length < 10) return attribute.name
        else res[`[${attribute.name}]`] = attribute.value
        return null
      }).filter(e => !!e).map(s => `[${s}]`).join('')
      function setResValues(k) {
        let t = elm.getAttribute(k)
        const N = 220
        const M = Math.round(N / 2 - 5)
        if (t.length > N) {
          t = `${t.substring(0, M)} ... ${t.substring(t.length - M, t.length)}`
        }
        res[k] = t
      }
      if (elm.nodeName === 'META' && elm.hasAttribute('content')) setResValues('content')
      if (elm.hasAttribute('href')) setResValues('href')
      else if (elm.hasAttribute('src')) setResValues('src')
    }

    if (noChild === true) {
      res.noChild = true
    } else if (childs.length > 0) {
      if (childs.length === 1 && childs[0].type === 'TEXT_NODE') {
        res.text = childs[0].text
      } else if (childs.length === 1) {
        res.child = childs[0]
      } else {
        res.childs = childs
      }
    }

    return res
  }

  console.log(JSON.stringify(looper(frag, null), null, 2))
}

if (typeof module !== 'undefined') {
  module.exports = structurize
}
