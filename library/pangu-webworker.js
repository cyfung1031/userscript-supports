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

/**
 * 
 via.js : https://github.com/AshleyScirra/via.js
 * 
 */

var panguWebWorker = (() => {


  function workerScript(ws) {



    // pangu.js

    function obtainWebPangu() {

      const document = typeof via === 'undefined' ? window.document : via.document;
      const XPathResult_ORDERED_NODE_SNAPSHOT_TYPE = 7;

      const isNode = async (o)=> (await get(o.nodeType)) > -1
      const isText = async (o)=> (await get(o.nodeType)) === 3

      const CJK = "\u2E80-\u2EFF\u2F00-\u2FDF\u3040-\u309F\u30A0-\u30FA\u30FC-\u30FF\u3100-\u312F\u3200-\u32FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF";
      const ANY_CJK = new RegExp("[" + CJK + "]");
      // const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK = new RegExp("([" + CJK + "])[ ]*([\\:]+|\\.)[ ]*([" + CJK + "])", 'g');
      // const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS = new RegExp("([" + CJK + "])[ ]*([~\\!;,\\?]+)[ ]*", 'g');
      // const DOTS_CJK = new RegExp("([\\.]{2,}|\u2026)([" + CJK + "])", 'g');
      // const FIX_CJK_COLON_ANS = new RegExp("([" + CJK + "])\\:([A-Z0-9\\(\\)])", 'g');
      // const CJK_QUOTE = new RegExp("([" + CJK + "])([`\"\u05F4])", 'g');
      // const QUOTE_CJK = new RegExp("([`\"\u05F4])([" + CJK + "])", 'g');
      // const FIX_QUOTE_ANY_QUOTE = /([`"\u05f4]+)[ ]*(.+?)[ ]*([`"\u05f4]+)/g;
      // const CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new RegExp("([" + CJK + "])('[^s])", 'g');
      // const SINGLE_QUOTE_CJK = new RegExp("(')([" + CJK + "])", 'g');
      // const FIX_POSSESSIVE_SINGLE_QUOTE = new RegExp("([A-Za-z0-9" + CJK + "])( )('s)", 'g');
      // const HASH_ANS_CJK_HASH = new RegExp("([" + CJK + "])(#)([" + CJK + "]+)(#)([" + CJK + "])", 'g');
      // const CJK_HASH = new RegExp("([" + CJK + "])(#([^ ]))", 'g');
      // const HASH_CJK = new RegExp("(([^ ])#)([" + CJK + "])", 'g');
      // const CJK_OPERATOR_ANS = new RegExp("([" + CJK + "])([\\+\\-\\*\\/=&\\|<>])([A-Za-z0-9])", 'g');
      // const ANS_OPERATOR_CJK = new RegExp("([A-Za-z0-9])([\\+\\-\\*\\/=&\\|<>])([" + CJK + "])", 'g');
      // const FIX_SLASH_AS = /([/]) ([a-z\-_\./]+)/g;
      // const FIX_SLASH_AS_SLASH = /([/\.])([A-Za-z\-_\./]+) ([/])/g;
      // const CJK_LEFT_BRACKET = new RegExp("([" + CJK + "])([\\(\\[\\{<>\u201C])", 'g');
      // const RIGHT_BRACKET_CJK = new RegExp("([\\)\\]\\}<>\u201D])([" + CJK + "])", 'g');
      // const FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET = /([\(\[\{<\u201c]+)[ ]*(.+?)[ ]*([\)\]\}>\u201d]+)/;
      // const ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET = new RegExp("([A-Za-z0-9" + CJK + "])[ ]*([\u201C])([A-Za-z0-9" + CJK + "\\-_ ]+)([\u201D])", 'g');
      // const LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK = new RegExp("([\u201C])([A-Za-z0-9" + CJK + "\\-_ ]+)([\u201D])[ ]*([A-Za-z0-9" + CJK + "])", 'g');
      // const AN_LEFT_BRACKET = /([A-Za-z0-9])([\(\[\{])/g;
      // const RIGHT_BRACKET_AN = /([\)\]\}])([A-Za-z0-9])/g;
      // const CJK_ANS = new RegExp("([" + CJK + "])([A-Za-z\u0370-\u03FF0-9@\\$%\\^&\\*\\-\\+\\\\=\\|/\xA1-\xFF\u2150-\u218F\u2700\u2014\u27BF])", 'g');
      // const ANS_CJK = new RegExp("([A-Za-z\u0370-\u03FF0-9~\\$%\\^&\\*\\-\\+\\\\=\\|/!;:,\\.\\?\xA1-\xFF\u2150-\u218F\u2700\u2014\u27BF])([" + CJK + "])", 'g');
      // const S_A = /(%)([A-Za-z])/g;
      // const MIDDLE_DOT = /([ ]*)([\u00b7\u2022\u2027])([ ]*)/g;

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

        // let self = this;
        let newText = text;
        /*
        newText = newText.replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK, function (match, leftCjk, symbols, rightCjk) {
          let fullwidthSymbols = convertToFullwidth(symbols);
          return "" + leftCjk + fullwidthSymbols + rightCjk;
        });
        newText = newText.replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS, function (match, cjk, symbols) {
          let fullwidthSymbols = convertToFullwidth(symbols);
          return "" + cjk + fullwidthSymbols;
        });
        */

        /*
        newText = newText.replace(DOTS_CJK, '$1 $2');
        // newText = newText.replace(FIX_CJK_COLON_ANS, '$1：$2');
        newText = newText.replace(CJK_QUOTE, '$1 $2');
        newText = newText.replace(QUOTE_CJK, '$1 $2');
        // newText = newText.replace(FIX_QUOTE_ANY_QUOTE, '$1$2$3');
        newText = newText.replace(CJK_SINGLE_QUOTE_BUT_POSSESSIVE, '$1 $2');
        newText = newText.replace(SINGLE_QUOTE_CJK, '$1 $2');
        newText = newText.replace(FIX_POSSESSIVE_SINGLE_QUOTE, "$1's");
        newText = newText.replace(HASH_ANS_CJK_HASH, '$1 $2$3$4 $5');
        newText = newText.replace(CJK_HASH, '$1 $2');
        newText = newText.replace(HASH_CJK, '$1 $3');
        newText = newText.replace(CJK_OPERATOR_ANS, '$1 $2 $3');
        newText = newText.replace(ANS_OPERATOR_CJK, '$1 $2 $3');
        // newText = newText.replace(FIX_SLASH_AS, '$1$2');
        // newText = newText.replace(FIX_SLASH_AS_SLASH, '$1$2$3');
        newText = newText.replace(CJK_LEFT_BRACKET, '$1 $2');
        newText = newText.replace(RIGHT_BRACKET_CJK, '$1 $2');
        // newText = newText.replace(FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET, '$1$2$3');
        newText = newText.replace(ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET, '$1 $2$3$4');
        newText = newText.replace(LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK, '$1$2$3 $4');
        // newText = newText.replace(AN_LEFT_BRACKET, '$1 $2');
        // newText = newText.replace(RIGHT_BRACKET_AN, '$1 $2');
        newText = newText.replace(CJK_ANS, '$1 $2');
        newText = newText.replace(ANS_CJK, '$1 $2');
        // newText = newText.replace(S_A, '$1 $2');
        // newText = newText.replace(MIDDLE_DOT, '・');
     
        */


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
        textNode = textNode instanceof Text ? textNode : null;
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

          const xPathQueryArr = ['/html/body//*//text()[normalize-space(.)]'];
          for (const tag of ['script', 'style', 'textarea', 'pre', 'svg']) {
            xPathQueryArr.push(`[translate(name(..),"${tag.toUpperCase()}","${tag.toLowerCase()}")!="${tag}"]`);
          }
          const xPathQuery = xPathQueryArr.join('');

          this.bodyXpath = xPathQuery;
        }
        isIgnored(node) {
          return node instanceof HTMLElement && (this.ignoredTags.has(node.nodeName) || node.isContentEditable || node.getAttribute('g_editable') === 'true');
        }
        canIgnoreNode(node) {
          while (node instanceof HTMLElement) {
            if (this.isIgnored(node)) return true;
            node = node.parentNode;
          }
          return false;
        }
        isFirstTextChild(parentNode, targetNode) {
          for (let childNode = parentNode.firstChild; isNode(childNode); childNode = childNode.nextSibling) {
            if (childNode.nodeType !== Node.COMMENT_NODE && (textContentFn(childNode) || '')) {
              return childNode === targetNode;
            }
          }
          return false;
        }
        isLastTextChild(parentNode, targetNode) {
          for (let childNode = parentNode.lastChild; isNode(childNode); childNode = childNode.previousSibling) {
            if (childNode.nodeType !== Node.COMMENT_NODE && (textContentFn(childNode) || '')) {
              return childNode === targetNode;
            }
          }
          return false;
        }
        async spacingNodeByXPathSnapShots(...snapshots) {


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


          const snapshotsLen = await get(snapshots.length);

          for (let si = 0; si < snapshotsLen; si++) {
            const snapshot = snapshots[si];
            for (let sj = 0, shLen = await get(snapshot.snapshotLength); sj < shLen; sj++) {

              const currentTextNode = snapshot.snapshotItem(sj);

              if (!(currentTextNode instanceof Text)) continue;
              if (weakSet.has(currentTextNode)) continue;
              weakSet.add(currentTextNode);

              const currentTextNodeData = currentTextNode.data;

              if (!anyPossibleCJK(currentTextNodeData)) continue;

              const elementNode = currentTextNode.parentNode;

              let currentTextNodeNewText = null;
              if (!this.canIgnoreNode(elementNode)) {
                currentTextNodeNewText = spacing(currentTextNodeData);
                if (currentTextNodeNewText !== null) {
                  currentTextNode.data = currentTextNodeNewText;
                }
              }

              const { prevNode, nextNode, middleNode } = extract(currentTextNode);

              const eitherSibling = prevNode || nextNode;
              if (eitherSibling && !this.canIgnoreNode(eitherSibling.parentNode) && eitherSibling.parentNode instanceof HTMLElement) {
                executor.call(this, middleNode, spacing, adjSet);
                executor.call(this, prevNode, spacing, adjSet);
                executor.call(this, nextNode, spacing, adjSet);
              }

            }
          }



        }
        spacingNode(contextNode) {
          if (!(contextNode instanceof Node) || contextNode instanceof DocumentFragment) return;
          const document = contextNode.ownerDocument;
          if (!(document instanceof Document)) return;
          const xPathQuery = contextNode.firstElementChild === null ? './/text()[normalize-space(.)]' : './/*//text()[normalize-space(.)]';
          const snapshot = document.evaluate(xPathQuery, contextNode, null, XPathResult_ORDERED_NODE_SNAPSHOT_TYPE, null);
          this.spacingNodeByXPathSnapShots(snapshot);
        }
        spacingPageTitle() {
          const xPathQuery = '/html/head/title/text()';
          const snapshot = document.evaluate(xPathQuery, document, null, XPathResult_ORDERED_NODE_SNAPSHOT_TYPE, null);
          this.spacingNodeByXPathSnapShots(snapshot);
        }
        spacingPageBody() {
          const snapshot1 = document.evaluate('/html/body//text()[normalize-space(.)]', document, null, XPathResult_ORDERED_NODE_SNAPSHOT_TYPE, null);
          const snapshot2 = document.evaluate(this.bodyXpath, document, null, XPathResult_ORDERED_NODE_SNAPSHOT_TYPE, null);
          this.spacingNodeByXPathSnapShots(snapshot1, snapshot2);
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
    }

    if (ws && typeof ws === 'object') {
      ws.obtainWebPangu = obtainWebPangu;
      return;
    }


    // object.js

    "use strict";

    {
      if (!self.Via933)
        self.Via933 = {};

      const ViaObjectHandler =
      {
        get(target, property, receiver) {
          // Return a Via933 property proxy, unless the special object symbol is passed,
          // in which case return the backing object ID.
          if (property === Via933.__ObjectSymbol)
            return target._objectId;

          return Via933._MakeProperty(target._objectId, [property]);
        },

        set(target, property, value, receiver) {
          // Add a set command to the queue.
          Via933._AddToQueue([1 /* set */, target._objectId, [property], Via933._WrapArg(value)]);

          return true;
        }
      };

      Via933._MakeObject = function (id) {
        // For the apply and construct traps to work, the target must be callable.
        // So use a function object as the target, and stash the object ID on it.
        const func = function () { };
        func._objectId = id;
        const ret = new Proxy(func, ViaObjectHandler);

        // When supported, register the returned object in the finalization registry with
        // its associated ID. This allows GC of the Proxy object to notify the receiver
        // side that its ID can be dropped, ensuring the real object can be collected
        // as well. If this is not supported it will leak memory!
        if (Via933.finalizationRegistry)
          Via933.finalizationRegistry.register(ret, id);

        return ret;
      }
    }


    // property.js

    "use strict";

    {
      if (!self.Via933)
        self.Via933 = {};

      const ViaPropertyHandler =
      {
        get(target, property, receiver) {
          // Return another Via933 property proxy with an extra property in its path,
          // unless the special target symbol is passed, in which case return the actual target.
          if (property === Via933.__TargetSymbol)
            return target;

          // It's common to repeatedly look up the same properties, e.g. calling
          // via.document.body.appendChild() in a loop. To speed this up and relieve pressure on the GC,
          // cache the proxy for the next property in the chain, so we return the same proxy every time.
          // Proxys are immutable (apart from this cache) so this doesn't change any behavior, and avoids
          // having to repeatedly re-create the Proxy and property array. Profiling shows this does help.
          const nextCache = target._nextCache;
          const existing = nextCache.get(property);
          if (existing)
            return existing;

          const path = target._path.slice(0);
          path.push(property);
          const ret = Via933._MakeProperty(target._objectId, path);
          nextCache.set(property, ret);		// add to next property cache
          return ret;
        },

        set(target, property, value, receiver) {
          // Add a set command to the queue, including a copy of the property path.
          const path = target._path.slice(0);
          path.push(property);

          Via933._AddToQueue([1 /* set */, target._objectId, path, Via933._WrapArg(value)]);

          return true;
        },

        apply(target, thisArg, argumentsList) {
          // Allocate a new object ID for the return value, add a call command to the queue, and then return
          // a Via933 object proxy representing the returned object ID.
          const returnObjectId = Via933._GetNextObjectId();

          Via933._AddToQueue([0 /* call */, target._objectId, target._path, argumentsList.map(Via933._WrapArg), returnObjectId]);

          return Via933._MakeObject(returnObjectId);
        },

        construct(target, argumentsList, newTarget) {
          // This is the same as the apply trap except a different command is used for construct instead of call.
          // The command handler is also the same as when calling a function, except it uses 'new'.
          const returnObjectId = Via933._GetNextObjectId();

          Via933._AddToQueue([3 /* construct */, target._objectId, target._path, argumentsList.map(Via933._WrapArg), returnObjectId]);

          return Via933._MakeObject(returnObjectId);
        }
      };

      Via933._MakeProperty = function (objectId, path) {
        // For the apply and construct traps to work, the target must be callable.
        // So use a function object as the target, and stash the object ID and
        // the property path on it.
        const func = function () { };
        func._objectId = objectId;
        func._path = path;
        func._nextCache = new Map();		// for recycling sub-property lookups
        return new Proxy(func, ViaPropertyHandler);
      }
    }



    // controller.js

    "use strict";

    {
      // Namespace for controller side (note the uppercase)
      if (!self.Via933)
        self.Via933 = {};

      // Symbols used to look up the hidden values behind the Proxy objects.
      Via933.__TargetSymbol = Symbol();
      Via933.__ObjectSymbol = Symbol();

      // A FinalizationRegistry (if supported) that can identify when objects are garbage collected to notify the
      // receiver to also drop references. If this is not supported, it will unavoidably leak memory.
      Via933.finalizationRegistry = (typeof FinalizationRegistry === "undefined" ? null : new FinalizationRegistry(FinalizeID));

      if (!Via933.finalizationRegistry)
        console.warn("[Via933.js] No WeakRefs support - will leak memory");

      // FinalizeID is called once per ID. To improve the efficiency when posting cleanup messages to the other
      // side, batch together all finalized IDs that happen in an interval using a timer, and post one message
      // at the end of that timer.
      let finalizeTimerId = -1;
      const finalizeIntervalMs = 10;
      const finalizeIdQueue = [];

      function FinalizeID(id) {
        finalizeIdQueue.push(id);

        if (finalizeTimerId === -1)
          finalizeTimerId = setTimeout(CleanupIDs, finalizeIntervalMs);
      }

      function CleanupIDs() {
        finalizeTimerId = -1;

        Via933.postMessage({
          "type": "cleanup",
          "ids": finalizeIdQueue
        });

        finalizeIdQueue.length = 0;
      }

      let nextObjectId = 1;							// next object ID to allocate (controller side uses positive IDs)
      const queue = [];								// queue of messages waiting to post
      let nextGetId = 0;								// next get request ID to allocate
      const pendingGetResolves = new Map();			// map of get request ID -> promise resolve function
      let nextFlushId = 0;							// next flush ID to allocate
      const pendingFlushResolves = new Map();			// map of flush ID -> promise resolve function
      let isPendingFlush = false;						// has set a flush to run at the next microtask

      // Callback functions are assigned an ID which is passed to a call's arguments.
      // The receiver creates a shim which forwards the callback back to the controller, where
      // it's looked up in the map by its ID again and then the controller-side callback invoked.
      let nextCallbackId = 0;
      const callbackToId = new Map();
      const idToCallback = new Map();

      // Create a default 'via' object (note the lowercase) representing the
      // global object on the receiver side
      self.via = Via933._MakeObject(0);

      Via933._GetNextObjectId = function () {
        return nextObjectId++;
      };

      Via933._AddToQueue = function (d) {
        queue.push(d);

        // Automatically flush queue at next microtask
        if (!isPendingFlush) {
          isPendingFlush = true;
          Promise.resolve().then(Via933.Flush);
        }
      };

      // Post the queue to the receiver. Returns a promise which resolves when the receiver
      // has finished executing all the commands.
      Via933.Flush = function () {
        isPendingFlush = false;

        if (!queue.length)
          return Promise.resolve();

        const flushId = nextFlushId++;

        Via933.postMessage({
          "type": "cmds",
          "cmds": queue,
          "flushId": flushId
        });

        queue.length = 0;

        return new Promise(resolve => {
          pendingFlushResolves.set(flushId, resolve);
        });
      };

      // Called when a message received from the receiver
      Via933.OnMessage = function (data) {
        switch (data.type) {
          case "done":
            OnDone(data);
            break;
          case "callback":
            OnCallback(data);
            break;
          default:
            throw new Error("invalid message type: " + data.type);
        }
      };

      // Called when the receiver has finished a batch of commands passed by a flush.
      function OnDone(data) {
        // Resolve any pending get requests with the values retrieved from the receiver.
        for (const [getId, valueData] of data.getResults) {
          const resolve = pendingGetResolves.get(getId);
          if (!resolve)
            throw new Error("invalid get id");

          pendingGetResolves.delete(getId);
          resolve(Via933._UnwrapArg(valueData));
        }

        // Resolve the promise returned by the original Flush() call.
        const flushId = data.flushId;
        const flushResolve = pendingFlushResolves.get(flushId);
        if (!flushResolve)
          throw new Error("invalid flush id");

        pendingFlushResolves.delete(flushId);
        flushResolve();
      }

      // Called when a callback is invoked on the receiver and this was forwarded to the controller.
      function OnCallback(data) {
        const func = idToCallback.get(data.id);
        if (!func)
          throw new Error("invalid callback id");

        const args = data.args.map(Via933._UnwrapArg);
        func(...args);
      }

      function GetCallbackId(func) {
        // Lazy-create IDs
        let id = callbackToId.get(func);

        if (typeof id === "undefined") {
          id = nextCallbackId++;
          callbackToId.set(func, id);
          idToCallback.set(id, func);
        }

        return id;
      }

      function CanStructuredClone(o) {
        const type = typeof o;
        return type === "undefined" || o === null || type === "boolean" || type === "number" || type === "string" ||
          (o instanceof Blob) || (o instanceof ArrayBuffer) || (o instanceof ImageData);
      }

      // Wrap an argument to a small array representing the value, object, property or callback for
      // posting to the receiver.
      Via933._WrapArg = function (arg) {
        // The Proxy objects used for objects and properties identify as functions.
        // Use the special accessor symbols to see what they really are. If they're not a Proxy
        // that Via933 knows about, assume it is a callback function instead.
        if (typeof arg === "function") {
          // Identify Via933 object proxy by testing if its object symbol returns a number
          const objectId = arg[Via933.__ObjectSymbol];
          if (typeof objectId === "number") {
            return [1 /* object */, objectId];
          }

          // Identify Via933 property proxy by testing if its target symbol returns anything
          const propertyTarget = arg[Via933.__TargetSymbol];

          if (propertyTarget) {
            return [3 /* object property */, propertyTarget._objectId, propertyTarget._path];
          }

          // Neither symbol applied; assume an ordinary callback function
          return [2 /* callback */, GetCallbackId(arg)];
        }
        // Pass basic types that can be transferred via postMessage as-is.
        else if (CanStructuredClone(arg)) {
          return [0 /* primitive */, arg];
        }
        else
          throw new Error("invalid argument");
      }

      // Unwrap an argument for a callback sent by the receiver.
      Via933._UnwrapArg = function (arr) {
        switch (arr[0]) {
          case 0:		// primitive
            return arr[1];
          case 1:		// object
            return Via933._MakeObject(arr[1]);
          default:
            throw new Error("invalid arg type");
        }
      }

      // Add a command to the queue representing a get request.
      function AddGet(objectId, path) {
        const getId = nextGetId++;

        Via933._AddToQueue([2 /* get */, getId, objectId, path]);

        return new Promise(resolve => {
          pendingGetResolves.set(getId, resolve);
        });
      };

      // Return a promise that resolves with the real value of a property, e.g. get(via.document.title).
      // This involves a message round-trip, but multiple gets can be requested in parallel, and they will
      // all be processed in the same round-trip.
      self.get = function (proxy) {
        if (typeof proxy === "function") {
          // Identify Via933 object proxy by testing if its object symbol returns a number
          const objectId = proxy[Via933.__ObjectSymbol];
          if (typeof objectId === "number")
            return AddGet(objectId, null);		// null path will return object itself (e.g. in case it's a primitive)

          // Identify Via933 property proxy by testing if its target symbol returns anything
          const target = proxy[Via933.__TargetSymbol];
          if (target)
            return AddGet(target._objectId, target._path);
        }

        // If the passed object isn't recognized as a Via933 object, just return it wrapped in a promise.
        return Promise.resolve(proxy);
      }
    }


    // worker.js

    "use strict";

    let pangu = null;

    self.addEventListener("message", e => {
      if (e.data === "start") {


        Via933.postMessage = (data => self.postMessage(data));

        pangu = new (obtainWebPangu());
        console.log('pangu', pangu)
      } else if (e.data === "spacingPageTitle") {
        console.log('spacingPageTitle', pangu)

        pangu.spacingPageTitle();

      } else if (e.data === "spacingPageBody") {


        pangu.spacingPageBody();

      } else if (typeof e.data === "string" && e.data.length > 11 && e.data.startsWith("spacingNode")) {

        const nodeI = +e.data.substring("spacingNode".length);
        if (nodeI >= 1) {
          const nodeWR = via.spacingNodes933.get(nodeI);
          const node = nodeWR ? nodeWR.deref() : null;
          if (node instanceof Node) pangu.spacingNode(node);
        }



      }
      else {
        Via933.OnMessage(e.data);
      }
    });


  }

  const receiverScript = () => {

    // receiver.js

    "use strict";

    {
      // Namespace for receiver side (which receives calls from the controller side)
      self.ViaReceiver933 = {};

      // The master map of object ID to the real object. Object ID 0 is always the global object on
      // the receiver (i.e. window or self). IDs are removed by cleanup messages, which are sent
      // by the controller when the Proxy with that ID is garbage collected (which requires WeakCell
      // support), indicating it cannot be used any more. This is important to avoid a memory leak,
      // since if the IDs are left behind they will prevent the associated object being collected.
      const idMap = new Map([[0, self]]);

      // Some objects are allocated an ID here on the receiver side, when running callbacks with
      // object parameters. To avoid ID collisions with the controller, receiver object IDs are
      // negative and decrement, and controller object IDs are positive and increment.
      let nextObjectId = -1;

      // Get the real object from an ID.
      function IdToObject(id) {
        const ret = idMap.get(id);

        if (typeof ret === "undefined")
          throw new Error("missing object id: " + id);

        return ret;
      }

      // Allocate new ID for an object on the receiver side.
      // The receiver uses negative IDs to prevent ID collisions with the controller.
      function ObjectToId(object) {
        const id = nextObjectId--;
        idMap.set(id, object);
        return id;
      }

      // Get the real value from an ID and a property path, e.g. object ID 0, path ["document", "title"]
      // will return window.document.title.
      function IdToObjectProperty(id, path) {
        const ret = idMap.get(id);

        if (typeof ret === "undefined")
          throw new Error("missing object id: " + id);

        let base = ret;

        for (let i = 0, len = path.length; i < len; ++i)
          base = base[path[i]];

        return base;
      }

      function CanStructuredClone(o) {
        const type = typeof o;
        return type === "undefined" || o === null || type === "boolean" || type === "number" || type === "string" ||
          (o instanceof Blob) || (o instanceof ArrayBuffer) || (o instanceof ImageData);
      }

      // Wrap an argument. This is used for sending values back to the controller. Anything that can be directly
      // posted is sent as-is, but any kind of object is represented by its object ID instead.
      function WrapArg(arg) {
        if (CanStructuredClone(arg)) {
          return [0 /* primitive */, arg];
        }
        else {
          return [1 /* object */, ObjectToId(arg)];
        }
      }

      // Get a shim function for a given callback ID. This creates a new function that forwards the
      // call with its arguments to the controller, where it will run the real callback.
      // Callback functions are not re-used to allow them to be garbage collected normally.
      function GetCallbackShim(id) {
        return ((...args) => ViaReceiver933.postMessage({
          "type": "callback",
          "id": id,
          "args": args.map(WrapArg)
        }));
      }

      // Unwrap an argument sent from the controller. Arguments are transported as small arrays indicating
      // the type and any object IDs/property paths, so they can be looked up on the receiver side.
      function UnwrapArg(arr) {
        switch (arr[0]) {
          case 0:		// primitive
            return arr[1];
          case 1:		// object
            return IdToObject(arr[1]);
          case 2:		// callback
            return GetCallbackShim(arr[1]);
          case 3:		// object property
            return IdToObjectProperty(arr[1], arr[2]);
          default:
            throw new Error("invalid arg type");
        }
      }

      // Called when receiving a message from the controller.
      ViaReceiver933.OnMessage = function (data) {
        switch (data.type) {
          case "cmds":
            OnCommandsMessage(data);
            break;
          case "cleanup":
            OnCleanupMessage(data);
            break;
          default:
            console.error("Unknown message type: " + data.type);
            break;
        }
      };

      function OnCommandsMessage(data) {
        const getResults = [];		// list of values requested to pass back to controller

        // Run all sent commands
        for (const cmd of data.cmds) {
          RunCommand(cmd, getResults);
        }

        // Post back that we're done (so the flush promise resolves), and pass along any get values.
        ViaReceiver933.postMessage({
          "type": "done",
          "flushId": data.flushId,
          "getResults": getResults
        });
      }

      function RunCommand(arr, getResults) {
        const type = arr[0];

        switch (type) {
          case 0:		// call
            ViaCall(arr[1], arr[2], arr[3], arr[4]);
            break;
          case 1:		// set
            ViaSet(arr[1], arr[2], arr[3]);
            break;
          case 2:		// get
            ViaGet(arr[1], arr[2], arr[3], getResults);
            break;
          case 3:		// constructor
            ViaConstruct(arr[1], arr[2], arr[3], arr[4]);
            break;
          default:
            throw new Error("invalid cmd type: " + type);
        }
      }

      function ViaCall(objectId, path, argsData, returnObjectId) {
        const obj = IdToObject(objectId);
        const args = argsData.map(UnwrapArg);
        const methodName = path[path.length - 1];

        let base = obj;

        for (let i = 0, len = path.length - 1; i < len; ++i) {
          base = base[path[i]];
        }

        const ret = base[methodName](...args);
        idMap.set(returnObjectId, ret);
      }

      function ViaConstruct(objectId, path, argsData, returnObjectId) {
        const obj = IdToObject(objectId);
        const args = argsData.map(UnwrapArg);
        const methodName = path[path.length - 1];

        let base = obj;

        for (let i = 0, len = path.length - 1; i < len; ++i) {
          base = base[path[i]];
        }

        const ret = new base[methodName](...args);
        idMap.set(returnObjectId, ret);
      }

      function ViaSet(objectId, path, valueData) {
        const obj = IdToObject(objectId);
        const value = UnwrapArg(valueData);
        const propertyName = path[path.length - 1];

        let base = obj;

        for (let i = 0, len = path.length - 1; i < len; ++i) {
          base = base[path[i]];
        }

        base[propertyName] = value;
      }

      function ViaGet(getId, objectId, path, getResults) {
        const obj = IdToObject(objectId);

        if (path === null) {
          getResults.push([getId, WrapArg(obj)]);
          return;
        }

        const propertyName = path[path.length - 1];

        let base = obj;

        for (let i = 0, len = path.length - 1; i < len; ++i) {
          base = base[path[i]];
        }

        const value = base[propertyName];
        getResults.push([getId, WrapArg(value)]);
      }

      function OnCleanupMessage(data) {
        // Delete a list of IDs sent from the controller from the ID map. This happens when
        // the Proxys on the controller side with these IDs are garbage collected, so the IDs
        // on the receiver can be dropped ensuring the associated objects can be collected.
        for (const id of data.ids)
          idMap.delete(id);
      }
    }

  }

  if (typeof Worker === "undefined") {
    throw new Error("Sorry, your browser does not support Web Workers...");
  }
  if (typeof WeakRef === "undefined") {
    throw new Error("Sorry, your browser does not support WeakRef...");
  }

  let nodeI = 0;
  class PanguWebWorker extends Worker{
    constructor(scriptURL, options){
      super(scriptURL, options);
    }

    spacingPageTitle() {
      this.postMessage("spacingPageTitle");
    }
    
    spacingPageBody() {
      this.postMessage("spacingPageBody");
    }
    
    spacingNode(node) {
      self.spacingNodes933 = self.spacingNodes933 || new Map();
      if(nodeI>1e9)nodeI = 9;
      nodeI++;
      self.spacingNodes933.set(nodeI, new WeakRef(node));
      this.postMessage(`spacingNode${nodeI}`);
    }
    
    


  }

  const createWorker = () => {

    if (typeof ViaReceiver933 === 'undefined') receiverScript();

    const workerCode = `(${workerScript})();`;

    // Step 2: Create a Blob from the worker code
    const blob = new Blob([workerCode], { type: 'application/javascript' });

    // Step 3: Create a Blob URL
    const blobURL = URL.createObjectURL(blob);

    const worker = new PanguWebWorker(blobURL);
    // Hook up Via933's messages with the worker's postMessage bridge
    worker.onmessage = (e => ViaReceiver933.OnMessage(e.data));
    ViaReceiver933.postMessage = (data => worker.postMessage(data));

    // Start the worker
    worker.postMessage("start");

    return worker;
  }


  return {
    receiverScript,
    workerScript,
    createWorker,
    getWebPangu(){
      const res = {};
      workerScript(res);
      return res.obtainWebPangu;
    }
  }


})()
