// ==UserScript==
// @name                YtDLS: YouTube Dual Language Subtitle (Modified)
// @name:zh-CN          YtDLS: Youtube 双语字幕（改）
// @name:zh-TW          YtDLS: Youtube 雙語字幕（改）
// @version             2.0.3
// @description         Enhances YouTube with dual language subtitles.
// @description:zh-CN   为YouTube添加双语字幕增强功能。
// @description:zh-TW   增強YouTube的雙語字幕功能。
// @author              CY Fung
// @author              Coink Wang
// @match               https://www.youtube.com/*
// @match               https://m.youtube.com/*
// @require             https://cdn.jsdelivr.net/npm/ajax-hook@3.0.1/dist/ajaxhook.min.js
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @run-at              document-start
// @namespace           Y2BDoubleSubs
// @license             MIT
// @supportURL          https://github.com/cyfung1031/Y2BDoubleSubs/tree/translation-api
// ==/UserScript==

/* global ah */

/* 

original script: https://greasyfork.org/scripts/397363
based on v1.8.0 + PR#18 ( https://github.com/CoinkWang/Y2BDoubleSubs/pull/18 ) [v2.0.0]
added m.youtube.com support based on two scripts (https://greasyfork.org/scripts/457476 & https://greasyfork.org/scripts/464879 ) which are fork from v1.8.0

*/

(function () {
    let localeLangFn = () => document.documentElement.lang || navigator.language || 'en' // follow the language used in YouTube Page
    // localeLangFn = () => 'zh'  // uncomment this line to define the language you wish here

    const Promise = (async () => { })().constructor
    const _ah = ah
    const fetch = window.fetch.bind(window)
    const pReady = new Promise(resolve => {
        if (document.documentElement) return resolve()
        let mo = new MutationObserver(function () {
            if (mo && document.documentElement) {
                mo.disconnect()
                mo.takeRecords()
                mo = null
                resolve()
            }
        })
        mo.observe(document, { childList: true, subtree: false })
    })
    pReady.then(() => {

        const localeLang = localeLangFn();
        let enableFullWidthSpaceSeparation = true
        function encodeFullwidthSpace(text) {
            if (!enableFullWidthSpaceSeparation) return text
            return text.replace(/\n/g, '\n1\n').replace(/\u3000/g, '\n2\n')
        }
        function decodeFullwidthSpace(text) {
            if (!enableFullWidthSpaceSeparation) return text
            return text.replace(/\n2\n/g, '\u3000').replace(/\n1\n/g, '\n')
        }
        _ah.proxy({
            onRequest: (config, handler) => {
                handler.next(config);
            },
            onResponse: (response, handler) => {
                function defaultAction() {
                    handler.resolve(response)
                }
                try {
                    if (!response.config.url.includes('/api/timedtext') || response.config.url.includes('&translate_h00ked')) return defaultAction()
                    let defaultJson = null
                    if (response.response) {
                        const jsonResponse = JSON.parse(response.response)
                        if (jsonResponse.events) defaultJson = jsonResponse
                    }
                    if (defaultJson === null) return defaultAction()
                    let lines = []
                    for (const event of defaultJson.events) {
                        for (const seg of event.segs) {
                            if (seg && typeof seg.utf8 === 'string') {
                                lines.push(...seg.utf8.split('\n'))
                            }
                        }
                    }
                    let linesText = lines.join('\n')
                    linesText = encodeFullwidthSpace(linesText)
                    let q = encodeURIComponent(linesText)
                    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${localeLang}&dj=1&dt=t&dt=rm&q=${q}`)
                        .then(res => {
                            return res.json()
                        })
                        .then(result => {
                            let resultText = result.sentences.map((function (s) {
                                return "trans" in s ? s.trans : "";
                            })).join("")
                            resultText = decodeFullwidthSpace(resultText)
                            return resultText.split("\n");
                        })
                        .then(translatedLines => {
                            const addTranslation = (line, idx) => {
                                if (line !== lines[i + idx]) return line
                                let translated = translatedLines[i + idx]
                                if (line === translated) return line
                                return `${line}\n${translated}`
                            }
                            let i = 0
                            for (const event of defaultJson.events) {
                                for (const seg of event.segs) {
                                    if ('utf8' in seg && typeof seg.utf8 === 'string') {
                                        let s = seg.utf8.split('\n')
                                        let st = s.map(addTranslation)
                                        seg.utf8 = st.join('\n')
                                        i += s.length
                                    }
                                }
                            }
                            response.response = JSON.stringify(defaultJson)
                            handler.resolve(response)
                        }).catch(e => {
                            console.warn(e)
                            defaultAction()
                        })
                } catch (e) {
                    console.warn(e)
                    defaultAction()
                }
            }
        })

    })

})();