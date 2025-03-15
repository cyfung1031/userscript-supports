/*
MIT License

Copyright (c) 2020 Anton Medvedev
Copyright (c) 2025 CY Fung

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

/**
 * Returns position of cursor on the page.
 * @param toStart Position of beginning of selection or end of selection.
 */
export function cursorPosition(toStart = true) {
    const s = window.getSelection();
    if (s.rangeCount > 0) {
        const cursor = document.createElement("span");
        cursor.textContent = "|";
        const r = s.getRangeAt(0).cloneRange();
        r.collapse(toStart);
        r.insertNode(cursor);
        const { x, y, height } = cursor.getBoundingClientRect();
        const top = (window.scrollY + y + height) + "px";
        const left = (window.scrollX + x) + "px";
        cursor.parentNode.removeChild(cursor);
        return { top, left };
    }
    return undefined;
}
/**
 * Returns selected text.
 */
export function selectedText() {
    const s = window.getSelection();
    if (s.rangeCount === 0)
        return '';
    return s.getRangeAt(0).toString();
}
/**
 * Returns text before the cursor.
 * @param editor Editor DOM node.
 */
export function textBeforeCursor(editor) {
    const s = window.getSelection();
    if (s.rangeCount === 0)
        return '';
    const r0 = s.getRangeAt(0);
    const r = document.createRange();
    r.selectNodeContents(editor);
    r.setEnd(r0.startContainer, r0.startOffset);
    return r.toString();
}
/**
 * Returns text after the cursor.
 * @param editor Editor DOM node.
 */
export function textAfterCursor(editor) {
    const s = window.getSelection();
    if (s.rangeCount === 0)
        return '';
    const r0 = s.getRangeAt(0);
    const r = document.createRange();
    r.selectNodeContents(editor);
    r.setStart(r0.endContainer, r0.endOffset);
    return r.toString();
}
