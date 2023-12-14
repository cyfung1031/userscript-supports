/*!
 * pangu.js
 * --------
 * @version: ???
 * @homepage: https://github.com/vinta/pangu.js
 * @license: MIT
 * @author: Vinta Chen <vinta.chen@gmail.com> (https://github.com/vinta)
 */
/* Modified by CY Fung; Follow MIT License */
/*
Copyright (c) 2013 Vinta
Copyright (c) 2023 CY Fung
This software is released under the MIT License, see LICENSE.
*/


var pangu = (() => {

  let WebPangu = function () {

    const CJK = "\u2E80-\u2EFF\u2F00-\u2FDF\u3040-\u309F\u30A0-\u30FA\u30FC-\u30FF\u3100-\u312F\u3200-\u32FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF";
    const ANY_CJK = new RegExp("[" + CJK + "]");

    const M_ADD_SPACE = new RegExp(`([${CJK}])([a-zA-Z0-9]+|[a-zA-Z0-9]+[\\x20-\\xFF]+[a-zA-Z0-9]+|[a-zA-Z0-9][a-zA-Z0-9.,]*[a-zA-Z0-9][%°]|[a-zA-Z0-9][%°]|[a-zA-Z0-9][a-zA-Z0-9\/,.]+[a-zA-Z0-9])([${CJK}])`, 'g')
    const P_ADD_SPACE = new RegExp(`(^|[\\r\\n])([a-zA-Z0-9]+|[a-zA-Z0-9]+[\\x20-\\xFF]+[a-zA-Z0-9]+)([${CJK}])`, 'g')
    const S_ADD_SPACE = new RegExp(`([${CJK}])([a-zA-Z0-9]+|[a-zA-Z0-9]+[\\x20-\\xFF]+[a-zA-Z0-9]+)([\\r\\n]|$)`, 'g')

    const CMB = "\uff01-\uff64\u3001\u3002";
    const CMB2 = `${CMB}」》】〉｝］）〗〕』`;

    const M_ADD_SPACE_2 = new RegExp(`([${CMB}])([a-zA-Z0-9]+|[a-zA-Z0-9]+[\\x20-\\xFF]+[a-zA-Z0-9]+)([${CJK}])`, 'g')
    const M_ADD_SPACE_3 = new RegExp(`([${CJK}])([a-zA-Z0-9]+|[a-zA-Z0-9]+[\\x20-\\xFF]+[a-zA-Z0-9]+|[a-zA-Z0-9][a-zA-Z0-9.,]*[a-zA-Z0-9][%°]|[a-zA-Z0-9][%°])([${CMB}])`, 'g')

    const M_COV_SYMBOL = new RegExp(`([${CJK}])([~!;:,?])([${CJK}])`, 'g')
    const S_ADD_SPACE_2 = new RegExp(`([a-zA-Z0-9]+)([~!;:,?])([${CJK}])`, 'g')

    const CJK2 = `${CJK}\\d,.\\/\\\\`;

    const A_ADD_SPACE = new RegExp(`([${CJK}])([!#$%&\\x2A-\\x5A\\x5E\\x5F\\x61-\\x7A~\\x80-\\xFF]+)\\x20([${CJK}])`, 'g')
    const Q_ADD_SPACE = new RegExp(`([${CJK}])(['"])([${CJK2}]+)\\2([${CJK}])`, 'g')
    const Q_ADD_SPACE_2 = new RegExp(`([${CJK}])([“])([${CJK2}]+)([”])([${CJK}])`, 'g')
    const Q_ADD_SPACE_3 = new RegExp(`([${CJK}])([‘])([${CJK2}]+)([’])([${CJK}])`, 'g')
    const Q_ADD_SPACE_4 = new RegExp(`([${CJK}])([(])([${CJK2}]+)([)])([${CJK}])`, 'g')
    const Q_ADD_SPACE_5 = new RegExp(`([${CJK}])([\\[])([${CJK2}]+)([\\]])([${CJK}])`, 'g')
    const Q_ADD_SPACE_6 = new RegExp(`([${CJK}])([\\{])([${CJK2}]+)([\\}])([${CJK}])`, 'g')

    const Q_ADD_SPACE_1b = new RegExp(`([${CMB}])(['"])([${CJK2}]+)\\2([${CJK}])`, 'g')
    const Q_ADD_SPACE_2b = new RegExp(`([${CMB}])([“])([${CJK2}]+)([”])([${CJK}])`, 'g')
    const Q_ADD_SPACE_3b = new RegExp(`([${CMB}])([‘])([${CJK2}]+)([’])([${CJK}])`, 'g')
    const Q_ADD_SPACE_4b = new RegExp(`([${CMB}])([(])([${CJK2}]+)([)])([${CJK}])`, 'g')
    const Q_ADD_SPACE_5b = new RegExp(`([${CMB}])([\\[])([${CJK2}]+)([\\]])([${CJK}])`, 'g')
    const Q_ADD_SPACE_6b = new RegExp(`([${CMB}])([\\{])([${CJK2}]+)([\\}])([${CJK}])`, 'g')

    const QA_ADD_SPACE = new RegExp(`([${CJK}])(['"“”‘’(){}\\[\\]])([^'"“”‘’(){}\\[\\]]+)(['"“”‘’(){}\\[\\]])([${CMB2}])`)
    const QA_ADD_SPACE_2 = new RegExp(`([${CJK}])(['"“”‘’(){}\\[\\]])([a-zA-Z0-9.,]+)(['"“”‘’(){}\\[\\]])([${CJK}])`)

    // const M_ADD_SPACE_4 = new RegExp(`([${CJK}${CMB}]\\x20\\d+\\x20[${CJK}])(\\d+)`, 'g') // to be reviewed; 将火药用棉布包裹起来，用铁板夹住，以 60 至120Kgf/cm2的速度挤压，以增加比重密度。


    let _nativeHTMLElement;
    let _nativeText;

    try {
      const q = document.createElement('template');
      q.innerHTML = '<nil-01></nil-01>T';
      const c = q.content;
      _nativeHTMLElement = c.firstChild.constructor;
      _nativeText = c.lastChild.constructor;
    } catch (e) { }

    const HTMLElementNative = _nativeHTMLElement || HTMLElement; // prevent modified by YouTube Polymer
    const TextNative = _nativeText || Text;

    function loopReplace(text, search, replacement) {
      let maxN = Math.round(text.length / 2) + 4;
      while (maxN-- > 0) {
        const t = text.replace(search, replacement);
        if (t === text) return t;
        text = t;
      }
    }

    function convertToFullwidth(symbols) {
      return symbols.replace(/[~!;:,?]/g, (x) => String.fromCharCode(x.charCodeAt() + 65248)) // .replace(/\./g, '。')
    }

    function bracket(b, d) {
      let z = false;
      if (b === '\'' || b === '"') {
        if (d === b) z = true;
      } else if (b === '“') {
        if (d === '”') z = true;
      } else if (b === '‘') {
        if (d === '’') z = true;
      } else if (b === '(') {
        if (d === ')') z = true;
      } else if (b === '[') {
        if (d === ']') z = true;
      } else if (b === '{') {
        if (d === '}') z = true;
      }
      return z;
    }

    /**
     * 
     * @param {string} text 
     * @returns {string}
     */
    function replacer(text) {

      let newText = text;

      const nLen = text.length;
      if (nLen <= 1) return text;

      if (nLen >= 3) newText = loopReplace(newText, M_ADD_SPACE, '$1 $2 $3');
      newText = loopReplace(newText, P_ADD_SPACE, '$1$2 $3');
      newText = loopReplace(newText, S_ADD_SPACE, '$1 $2$3');

      if (nLen >= 3) newText = loopReplace(newText, M_ADD_SPACE_2, '$1$2 $3');
      if (nLen >= 3) newText = loopReplace(newText, M_ADD_SPACE_3, '$1 $2$3');
      // if (nLen >= 4) newText = loopReplace(newText, M_ADD_SPACE_4, '$1 $2');

      if (nLen >= 3) newText = loopReplace(newText, M_COV_SYMBOL, (_, a, b, c) => {

        let d = convertToFullwidth(b);
        if (typeof d === 'string' && d !== b) {
          return a + d + c;
        }
        return _;
      });

      if (nLen >= 3) newText = loopReplace(newText, S_ADD_SPACE_2, '$1$2 $3');
      if (nLen >= 3) newText = loopReplace(newText, A_ADD_SPACE, '$1 $2 $3');

      if (nLen >= 5 && /['"“”‘’(){}\[\]]/.test(newText)) {

        newText = loopReplace(newText, Q_ADD_SPACE, '$1 $2$3$2 $4');
        newText = loopReplace(newText, Q_ADD_SPACE_2, '$1 $2$3$4 $5');
        newText = loopReplace(newText, Q_ADD_SPACE_3, '$1 $2$3$4 $5');
        newText = loopReplace(newText, Q_ADD_SPACE_4, '$1 $2$3$4 $5');
        newText = loopReplace(newText, Q_ADD_SPACE_5, '$1 $2$3$4 $5');
        newText = loopReplace(newText, Q_ADD_SPACE_6, '$1 $2$3$4 $5');
        newText = loopReplace(newText, QA_ADD_SPACE, (_, a, b, c, d, e) => {
          let z = bracket(b, d);
          return z ? `${a} ${b}${c}${d}${e}` : _;
        })
        newText = loopReplace(newText, QA_ADD_SPACE_2, (_, a, b, c, d, e) => {
          let z = bracket(b, d);
          return z ? `${a} ${b}${c}${d} ${e}` : _;
        })

        newText = loopReplace(newText, Q_ADD_SPACE_1b, '$1$2$3$2 $4');
        newText = loopReplace(newText, Q_ADD_SPACE_2b, '$1$2$3$4 $5');
        newText = loopReplace(newText, Q_ADD_SPACE_3b, '$1$2$3$4 $5');
        newText = loopReplace(newText, Q_ADD_SPACE_4b, '$1$2$3$4 $5');
        newText = loopReplace(newText, Q_ADD_SPACE_5b, '$1$2$3$4 $5');
        newText = loopReplace(newText, Q_ADD_SPACE_6b, '$1$2$3$4 $5');

      }

      return newText;
    }

    function replacerM(text) {

      let s = text.split(/([a-z0-9]+\:\/\/[^\s]+)/);
      if (s.length >= 3) {
        for (let i = 0; i < s.length; i++) {
          if ((i % 2) === 0) {
            let t = s[i];
            if (t.length >= 2) s[i] = replacer(t);
          }
        }
        return s.join('');
      } else {
        return replacer(text);
      }

    }

    function anyPossibleCJK(s) {
      for (let i = 0, l = s.length; i < l; i++) {
        if (s[i] >= '\u2E80') return true;
      }
      return false;
    }

    function anyPossibleCJK_(s, a, b) {
      for (let i = a; i < b; i++) {
        if (s[i] >= '\u2E80') return true;
      }
      return false;
    }

    function trimTextStart(s) {
      // "  ab cd ef  " => ["  ab", " cd ef  "]
      if (typeof s !== 'string') return [s, ""];
      if (!s.length) return ["", ""];
      let j = 0;
      for (let i = 0; i < s.length; i++) {
        if (s[i] === ' ') j = i + 1;
        else break;
      }
      let idx1 = s.indexOf(' ', j);
      if (idx1 < 0) return [s, ""];
      return [`${s.substring(0, idx1)}`, `${s.substring(idx1)}`];
    }

    function trimTextEnd(s) {
      // "  ab cd ef  " => ["  ab cd ", "ef  "]
      if (typeof s !== 'string') return ["", s];
      if (!s.length) return ["", ""];
      let j = s.length;
      for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] === ' ') j = i;
        else break;
      }
      let idx2 = s.lastIndexOf(' ', j - 1);
      if (idx2 < 0) return ["", s];
      return [`${s.substring(0, idx2 + 1)}`, `${s.substring(idx2 + 1)}`];
    }

    function trimTextMiddle(s) {
      if (typeof s !== 'string') return s;

      if (!s.length) return s;

      let j1 = 0;
      for (let i = 0; i < s.length; i++) {
        if (s[i] === ' ') j1 = i + 1;
        else break;
      }


      let j2 = s.length;
      for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] === ' ') j2 = i;
        else break;
      }

      let idx1 = s.indexOf(' ', j1);
      if (idx1 < 0) return s;
      if (idx1 >= j2) return s;
      let idx2 = s.substring(0, j2).lastIndexOf(' ');
      if (idx2 < idx1) return s;
      return `${s.substring(0, idx1)} ${s.substring(idx2 + 1)}`;
    }

    const weakSet = new WeakSet();

    /** 
     * @param {Node} node
     */
    function extract(node) {
      if (node.previousSibling === null && node.nextSibling === null) {
        node = node.parentNode;
      }
      let prevNode = node.previousSibling;
      let nextNode = node.nextSibling;
      return { prevNode, nextNode, middleNode: node }
    }


    function getText(node) {

      let textNode = null;
      if (node instanceof Element) {
        if (node.firstChild === node.lastChild) textNode = node;
      } else {
        textNode = node;
      }
      textNode = textNode instanceof TextNative ? textNode : null;
      return textNode;
    }


    const skipExecutor = new Set([
      'HTML', 'BODY', 'HEAD', 'META', 'SCRIPT', 'STYLE', 'LINK', 'TITLE', 'BASE',
      'DIV', 'P', 'UL', 'OL',
      'BR', 'HR', 'SELECT',
      'VIDEO', 'AUDIO', 'IFRAME', 'EMBED', 'DIALOG',
      'LI',
      'TEXTAREA', 'PRE', 'BLOCKQUOTE', 'INPUT', 'FORM',
      'SVG', 'PATH', 'SHAPE', 'SOLID', 'SLOT', 'SOURCE',
      'MAIN', 'ARTICLE', 'FOOTER', 'HEADER', 'MENU',
      'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
      'TBODY', 'TR', 'TD', 'TFOOT', 'TH', 'THEAD',
      'SUP', 'SUB',
      'DD', 'DT', 'DL', 'MARK', 'RP', 'RT'
    ]);

    const tagsNotForContent = new Set([

      'IMG', 'INPUT', 'BR', 'META', 'LINK', 'HR', 'SOURCE', 'TRACK', 'IFRAME', 'VIDEO', 'CANVAS', 'SELECT',
      'AREA', 'BASE', 'EMBED', 'COMMAND', 'KEYGEN', 'MENUITEM', 'BASEFONT', 'BGSOUND', 'ISINDEX', 'NEXTID', 'TEMPLATE', 'NOFRAMES',
      'COL', 'WBR', 'MEDIA', 'FRAME', 'APPLET', 'OBJECT', 'SVG', 'MATH', 'SCRIPT', 'STYLE', 'AUDIO',

      'SLOT', 'DEFINE', 'DIALOG', 'MARK', 'MAP', 'COLGROUP', 'FIGURE', 'DATALIST',
      // 'ABBR', 'DATA', 'BUTTON',

      'svg', 'g', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'text', 'tspan', 'image', 'use',
      'defs', 'pattern', 'linearGradient', 'radialGradient', 'mask', 'clipPath', 'symbol', 'marker', 'animate', 'filter',
      'foreignObject', 'metadata'

    ]);

    function textContentFn(node) {
      if (node instanceof HTMLElement) {
        if (tagsNotForContent.has(node.nodeName)) return null;
        return node.textContent;
      }
      return null;
    }

    function executor(node, spacing, adjSet) {

      if (!node) return;
      if (adjSet.has(node)) return;
      adjSet.add(node);

      const elementNode = node.nodeType === 1 ? node : node.parentNode;
      if (!(elementNode instanceof Element)) return;

      if (skipExecutor.has(elementNode.nodeName)) return;

      const prevNode = node.previousSibling;
      const nextNode = node.nextSibling;

      const middTextNode = getText(node);
      const prevTextNode = getText(prevNode);
      const nextTextNode = getText(nextNode);

      if ((prevTextNode || nextTextNode)) {

        let prevTextNodeNewText = null;
        let middTextNodeNewText = null;
        let nextTextNodeNewText = null;
        if (prevTextNode && !this.isIgnored(prevTextNode.parentNode)) prevTextNodeNewText = spacing(prevTextNode.data);
        if (middTextNode && elementNode === middTextNode.parentNode && !this.isIgnored(elementNode)) middTextNodeNewText = spacing(middTextNode.data);
        if (nextTextNode && !this.isIgnored(nextTextNode.parentNode)) nextTextNodeNewText = spacing(nextTextNode.data);

        const textMiddle = trimTextMiddle(!middTextNode ? (textContentFn(node) || '') : (middTextNodeNewText || middTextNode.data));

        if (textMiddle) {

          const [textPrevTr, textPrev] = trimTextEnd(!prevTextNode ? (textContentFn(prevNode) || '') : (prevTextNodeNewText || prevTextNode.data));
          const [textNext, textNextTr] = trimTextStart(!nextTextNode ? (textContentFn(nextNode) || '') : (nextTextNodeNewText || nextTextNode.data));

          const testRes = this.spacing(textPrev + textMiddle + textNext);

          if (testRes) {

            if (textPrev && prevTextNode) {
              const tz = textPrev.trim();
              let targetLen = tz.length;
              if (targetLen > 0) {
                let z = 0;
                for (let k = 0; k < testRes.length; k++) {
                  if (testRes[k] !== ' ') {
                    z++;
                    if (z === targetLen) {
                      const base = testRes.substring(0, k + 1);
                      if (base.replace(/\x20/g, '') === tz) {
                        const space = testRes[k + 1] === ' ' && !textMiddle.startsWith(' ') && !textPrev.endsWith(' ');
                        prevTextNodeNewText = textPrevTr + base + (space ? ' ' : '');
                      }
                      break;
                    }
                  }
                }
              }
            }

            if (textNext && nextTextNode) {
              const tz = textNext.trim();
              let targetLen = tz.length;
              if (targetLen > 0) {
                let z = 0;
                for (let k = testRes.length - 1; k >= 0; k--) {
                  if (testRes[k] !== ' ') {
                    z++;
                    if (z === targetLen) {
                      const base = testRes.substring(k);
                      if (base.replace(/\x20/g, '') === tz) {
                        const space = (k >= 1 && testRes[k - 1] === ' ' && !textMiddle.endsWith(' ') && !textNext.startsWith(' '));
                        nextTextNodeNewText = (space ? ' ' : '') + base + textNextTr;
                      }
                      break;
                    }
                  }
                }
              }
            }

          }

        }


        if (prevTextNodeNewText) prevTextNode.data = prevTextNodeNewText;
        if (middTextNodeNewText) middTextNode.data = middTextNodeNewText;
        if (nextTextNodeNewText) nextTextNode.data = nextTextNodeNewText;
      }


    }

    const FILTER_REJECT_CHECKER = `
    |NIL|IFRAME|FRAME|EMBED|VIDEO|AUDIO|NOFRAMES|OBJECT|TEMPLATE
    |DOM-IF|DOM-REPEAT|SCRIPT|STYLE|TEXTAREA|PRE|SVG|NOSCRIPT
    |RUBY|RT|RP|CODE|IMG|INPUT|SLOT|SOURCE|SELECT|CANVAS
    |RELATIVE-TIME|DEFS
    |YT-IMG-SHADOW|YT-ICON|YT-LIVE-CHAT-AUTHOR-BADGE-RENDERER
    |`.replace(/\s+/g, '');

    const FILTER_REJECT_CHECKER_MAP = new Set(FILTER_REJECT_CHECKER.split('|').filter(e=>!!e));

    const {FILTER_REJECT, FILTER_ACCEPT, FILTER_SKIP} = NodeFilter;

    const mxSymbol = Symbol();

    const walkerNodeFilter = 
    {
      acceptNode: function (node) {
        const pn = node.parentNode;
        const nData = node.data;
        if (pn instanceof HTMLElementNative && nData) {
          
          if(node[mxSymbol] === nData) return FILTER_REJECT;
          node[mxSymbol] = nData;

          let pns = pn[mxSymbol];
          if (pns === true){
            return FILTER_REJECT;
          }else if (pns === false){
          }else{
            pns = pn[mxSymbol] = FILTER_REJECT_CHECKER_MAP.has(pn.nodeName || 'NIL');
            if (pns === true) {
              return FILTER_REJECT;
            }
          }


          if (!nData.trim()) {
            return FILTER_REJECT;
          }

          return FILTER_ACCEPT;
        }
        return FILTER_REJECT;
      }
    };


    const Promise = (async () => { })().constructor;

    const PromiseExternal = ((resolve_, reject_) => {
      const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
      return class PromiseExternal extends Promise {
        constructor(cb = h) {
          super(cb);
          if (cb === h) {
            /** @type {(value: any) => void} */
            this.resolve = resolve_;
            /** @type {(reason?: any) => void} */
            this.reject = reject_;
          }
        }
      };
    })();

    let moPromise = new PromiseExternal();
    const mo = new MutationObserver(()=>{
      moPromise.resolve();
      moPromise = new PromiseExternal();
    })

    class WebPangu {
      constructor() {
        // this.blockTags = ["DIV", "P", "H1", "H2", "H3", "H4", "H5", "H6"];
        this.ignoredTags = new Set([
          "SCRIPT", "STYLE", "TEXTAREA", "PRE", "SVG", "CODE",

          'IMG', 'INPUT', 'BR', 'META', 'LINK', 'HR', 'SOURCE', 'TRACK', 'IFRAME', 'VIDEO', 'CANVAS', 'SELECT',
          'AREA', 'BASE', 'EMBED', 'COMMAND', 'KEYGEN', 'MENUITEM', 'BASEFONT', 'BGSOUND', 'ISINDEX', 'NEXTID', 'TEMPLATE', 'NOFRAMES',
          'COL', 'WBR', 'MEDIA', 'FRAME', 'APPLET', 'OBJECT', 'MATH', 'AUDIO',

          'SLOT', 'DEFINE', 'DIALOG', 'MARK', 'MAP', 'COLGROUP', 'FIGURE', 'DATALIST',
          // 'ABBR', 'DATA', 'BUTTON',

          'svg', 'g', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'text', 'tspan', 'image', 'use',
          'defs', 'pattern', 'linearGradient', 'radialGradient', 'mask', 'clipPath', 'symbol', 'marker', 'animate', 'filter',
          'foreignObject', 'metadata'

        ]);
        // this.presentationalTags = ["B", "CODE", "DEL", "EM", "I", "S", "STRONG", "KBD", "U", "INS"];
        // this.spaceLikeTags = ["BR", "HR", "I", "IMG", "PANGU"];
        // this.spaceSensitiveTags = ["A", "DEL", "PRE", "S", "STRIKE", "U"];

      }
      isIgnored(node) {
        return node instanceof HTMLElementNative && (this.ignoredTags.has(node.nodeName) || node.isContentEditable || node.getAttribute('g_editable') === 'true');
      }
      canIgnoreNode(node) {
        while (node instanceof HTMLElementNative) {
          if (this.isIgnored(node)) return true;
          node = node.parentNode;
        }
        return false;
      }
      isFirstTextChild(parentNode, targetNode) {
        for (let childNode = parentNode.firstChild; childNode instanceof Node; childNode = childNode.nextSibling) {
          if (childNode.nodeType !== Node.COMMENT_NODE && (textContentFn(childNode) || '')) {
            return childNode === targetNode;
          }
        }
        return false;
      }
      isLastTextChild(parentNode, targetNode) {
        for (let childNode = parentNode.lastChild; childNode instanceof Node; childNode = childNode.previousSibling) {
          if (childNode.nodeType !== Node.COMMENT_NODE && (textContentFn(childNode) || '')) {
            return childNode === targetNode;
          }
        }
        return false;
      }
      /** @param {TreeWalker} walker */
      spacingNodeByTreeWalker(walker) {

        const strCache = new Map();
        const adjSet = new WeakSet();

        const spacing = (s) => {

          let j1 = 0;
          for (let i = 0; i < s.length; i++) {
            if (s[i] === ' ') j1 = i + 1;
            else break;
          }

          let j2 = s.length;
          for (let i = s.length - 1; i >= 0; i--) {
            if (s[i] === ' ') j2 = i;
            else break;
          }

          if (j1 === j2) return null;
          if (!anyPossibleCJK_(s, j1, j2)) return null;

          let trimmed = s.substring(j1, j2);

          let r = strCache.get(trimmed);

          if (r === undefined) {
            r = this.spacing(trimmed);
            strCache.set(trimmed, r);
            if (r !== null) strCache.set(r, r);
          }
          return r ? s.substring(0, j1) + r + s.substring(j2) : null;

        }

        const runner =  (currentTextNode)=>{


          const currentTextNodeData = currentTextNode.data;

          if (!anyPossibleCJK(currentTextNodeData)) return;

          const elementNode = currentTextNode.parentNode;

          let currentTextNodeNewText = null;
          if (!this.canIgnoreNode(elementNode)) {
            currentTextNodeNewText = spacing(currentTextNodeData);
            if (currentTextNodeNewText !== null) {
              currentTextNode.data = currentTextNodeNewText;
              const pElement = currentTextNode.parentElement;
              if(pElement){
                const reactroot = pElement.closest('[data-reactroot]');
                if(reactroot){
                  let currentTextNode_ = currentTextNode;
                  mo.observe(reactroot, {subtree: true, childList: true});
                  moPromise.then(()=>{

                    if(currentTextNode_ instanceof Node) Promise.resolve(currentTextNode_).then(runner);
                    currentTextNode_ = null;

                  });

                }
              }
            }
          }

          const { prevNode, nextNode, middleNode } = extract(currentTextNode);

          const eitherSibling = prevNode || nextNode;
          if (eitherSibling && !this.canIgnoreNode(eitherSibling.parentNode) && eitherSibling.parentNode instanceof HTMLElementNative) {
            executor.call(this, middleNode, spacing, adjSet);
            executor.call(this, prevNode, spacing, adjSet);
            executor.call(this, nextNode, spacing, adjSet);
          }

        }

        for (let walkerNode; walkerNode = walker.nextNode();) {

          const currentTextNode = walkerNode;

          if (!(currentTextNode instanceof TextNative)) continue;
          if (weakSet.has(currentTextNode)) continue;
          weakSet.add(currentTextNode);

          runner(currentTextNode)

        }

      }
      /** @param {Node} node */
      spacingNode_(node) {
        const doc = node.ownerDocument;
        if(!(doc instanceof Document)) return;
        let mWalker = doc.createTreeWalker(
          node,
          NodeFilter.SHOW_TEXT, walkerNodeFilter,
          false
        );
        const walker = mWalker;
        this.spacingNodeByTreeWalker(walker);
      }
      spacingNode(contextNode) {
        if (!(contextNode instanceof Node) || contextNode instanceof DocumentFragment) return;
        const document = contextNode.ownerDocument;
        if (!(document instanceof Document)) return;

        /** @type {TreeWalker} */
        const node = contextNode;
        this.spacingNode_(node);

      }
      spacingPageTitle() {
        let node = (document.head || document).querySelector('title');
        if (!node) return;
        let textNode = node.firstChild;

        let i = 0;
        let walker = {
          nextNode() {
            if (++i === 1) return textNode;
          },
          get currentNode() {
            return i === 1 ? textNode : null;
          }
        };
        this.spacingNodeByTreeWalker(walker);
        walker = null;
        node = null;
        textNode = null;

      }
      spacingPageBody() {
        const node = document.body;
        this.spacingNode_(node);
      }
      spacing(text) {
        if (typeof text !== 'string') {
          console.warn("spacing(text) only accepts string but got " + _typeof(text));
          return null;
        }
        if (text.length <= 1 || !ANY_CJK.test(text)) {
          return null;
        }
        const nText = replacerM(text);
        if (nText === text) return null;
        return nText;
      }

    }

    return WebPangu;
  }();

  return new WebPangu;

})();