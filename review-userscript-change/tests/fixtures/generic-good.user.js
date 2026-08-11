// ==UserScript==
// @name         Generic review fixture
// @match        https://example.test/*
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-start
// ==/UserScript==

(async () => {
    const panel = document.createElement('section');
    panel.classList.add('panel');
    panel.addEventListener('click', async () => {
        const value = await GM.getValue('key', 'default');
        panel.innerHTML = String(value);
        await fetch('/state', { method: 'POST', body: value });
    });
    const style = document.createElement('style');
    style.textContent = '.panel { color: red; }';
    document.documentElement.append(panel, style);
})();
