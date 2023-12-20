// ==UserScript==
// @name               Greasy Fork++
// @namespace          https://github.com/iFelix18
// @version            3.2.45
// @author             CY Fung <https://greasyfork.org/users/371179> & Davide <iFelix18@protonmail.com>
// @icon               https://www.google.com/s2/favicons?domain=https://greasyfork.org
// @description        Adds various features and improves the Greasy Fork experience
// @description:de     Fügt verschiedene Funktionen hinzu und verbessert das Greasy Fork-Erlebnis
// @description:es     Agrega varias funciones y mejora la experiencia de Greasy Fork
// @description:fr     Ajoute diverses fonctionnalités et améliore l'expérience Greasy Fork
// @description:it     Aggiunge varie funzionalità e migliora l'esperienza di Greasy Fork
// @description:ru     Добавляет различные функции и улучшает работу с Greasy Fork
// @description:zh-CN  添加各种功能并改善 Greasy Fork 体验
// @description:zh-TW  加入多種功能並改善Greasy Fork的體驗
// @description:ja     Greasy Forkの体験を向上させる様々な機能を追加
// @description:ko     Greasy Fork 경험을 향상시키고 다양한 기능을 추가
// @copyright          2023, CY Fung (https://greasyfork.org/users/371179); 2021, Davide (https://github.com/iFelix18)
// @license            MIT
// @require            https://fastly.jsdelivr.net/gh/sizzlemctwizzle/GM_config@06f2015c04db3aaab9717298394ca4f025802873/gm_config.min.js
// @require            https://fastly.jsdelivr.net/npm/@violentmonkey/shortcut@1.4.1/dist/index.min.js
// @require            https://fastly.jsdelivr.net/gh/cyfung1031/userscript-supports@3fa07109efca28a21094488431363862ccd52d7c/library/WinComm.min.js
// @match              *://greasyfork.org/*
// @match              *://sleazyfork.org/*
// @connect            greasyfork.org
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         safari
// @compatible         brave
// @grant              GM.deleteValue
// @grant              GM.getValue
// @grant              GM.notification
// @grant              GM.registerMenuCommand
// @grant              GM.setValue
// @grant              unsafeWindow
// @run-at             document-start
// @inject-into        content
// ==/UserScript==

/* global GM_config, VM, GM, WinComm */

/**
 * @typedef { typeof import("./library/WinComm.js")  } WinComm
 */

// console.log(GM)

/** @type {WinComm} */
const WinComm = this.WinComm;

//  -------- UU Fucntion - original code: https://fastly.jsdelivr.net/npm/@ifelix18/utils@6.5.0/lib/index.min.js  --------
// optimized by CY Fung to remove $ dependency and observe creation
const UU = (function () {
    const scriptName = GM.info.script.name; // not name_i18n
    const scriptVersion = GM.info.script.version;
    const authorMatch = /^(.*?)\s<\S[^\s@]*@\S[^\s.]*\.\S+>$/.exec(GM.info.script.author);
    const author = authorMatch ? authorMatch[1] : GM.info.script.author;
    let scriptId = scriptName.toLowerCase().replace(/\s/g, "-");
    let loggingEnabled = false;

    const log = (message) => {
        if (loggingEnabled) {
            console.log(`${scriptName}:`, message);
        }
    };

    const error = (message) => {
        console.error(`${scriptName}:`, message);
    };

    const warn = (message) => {
        console.warn(`${scriptName}:`, message);
    };

    const alert = (message) => {
        window.alert(`${scriptName}: ${message}`);
    };

    /** @param {string} text */
    const short = (text, length) => {
        const s = text.split(" ");
        const l = Number(length);
        return s.length > l
            ? `${s.slice(0, l).join(" ")} [...]`
            : text;
    };

    const addStyle = (css) => {
        const head = document.head || document.querySelector("head");
        const style = document.createElement("style");
        style.textContent = css;
        head.appendChild(style);
    };

    const init = async (options = {}) => {
        scriptId = options.id || scriptId;
        loggingEnabled = typeof options.logging === "boolean" ? options.logging : false;
        console.info(
            `%c${scriptName}\n%cv${scriptVersion}${author ? ` by ${author}` : ""} is running!`,
            "color:red;font-weight:700;font-size:18px;text-transform:uppercase",
            ""
        );
    };

    return {
        init,
        log,
        error,
        warn,
        alert,
        short,
        addStyle
    };
})();

//  -------- UU Fucntion - original code: https://fastly.jsdelivr.net/npm/@ifelix18/utils@6.5.0/lib/index.min.js  --------


const mWindow = (() => {


    const fields = {
        hideBlacklistedScripts: {
            label: 'Hide blacklisted scripts:<br><span>Choose which lists to activate in the section below, press <b>Ctrl + Alt + B</b> to show Blacklisted scripts</span>',
            section: ['Features'],
            labelPos: 'right',
            type: 'checkbox',
            default: true
        },
        hideHiddenScript: {
            label: 'Hide scripts:<br><span>Add a button to hide the script<br>See and edit the list of hidden scripts below, press <b>Ctrl + Alt + H</b> to show Hidden script',
            labelPos: 'right',
            type: 'checkbox',
            default: true
        },
        showInstallButton: {
            label: 'Install button:<br><span>Add to the scripts list a button to install the script directly</span>',
            labelPos: 'right',
            type: 'checkbox',
            default: true
        },
        showTotalInstalls: {
            label: 'Installations:<br><span>Shows the number of daily and total installations on the user profile</span>',
            labelPos: 'right',
            type: 'checkbox',
            default: true
        },
        milestoneNotification: {
            label: 'Milestone notifications:<br><span>Get notified whenever your total installs got over any of these milestone<br>Separate milestones with a comma, leave blank to turn off notifications</span>',
            labelPos: 'left',
            type: 'text',
            title: 'Separate milestones with a comma!',
            size: 150,
            default: '10, 100, 500, 1000, 2500, 5000, 10000, 100000, 1000000'
        },
        nonLatins: {
            label: 'Non-Latin:<br><span>This list blocks all scripts with non-Latin characters in the title/description</span>',
            section: ['Lists'],
            labelPos: 'right',
            type: 'checkbox',
            default: false // not true
        },
        blacklist: {
            label: 'Blacklist:<br><span>A "non-opinionable" list that blocks all scripts with specific words in the title/description, references to "bots", "cheats" and some online game sites, and other "bullshit"</span>',
            labelPos: 'right',
            type: 'checkbox',
            default: true
        },
        customBlacklist: {
            label: 'Custom Blacklist:<br><span>Personal blacklist defined by a set of unwanted words<br>Separate unwanted words with a comma (example: YouTube, Facebook, pizza), leave blank to disable this list</span>',
            labelPos: 'left',
            type: 'text',
            title: 'Separate unwanted words with a comma!',
            size: 150,
            default: ''
        },
        hiddenList: {
            label: 'Hidden Scripts:<br><span>Block individual undesired scripts by their unique IDs<br>Separate IDs with a comma</span>',
            labelPos: 'left',
            type: 'textarea',
            title: 'Separate IDs with a comma!',
            default: '',
            save: false
        },
        logging: {
            label: 'Logging',
            section: ['Developer options'],
            labelPos: 'right',
            type: 'checkbox',
            default: false
        },
        debugging: {
            label: 'Debugging',
            labelPos: 'right',
            type: 'checkbox',
            default: false
        }
    }

    const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAASFBMVEVHcEwBAQEDAwMAAAACAgIBAQEAAAAREREDAwMBAQH///8WFhYuLi7U1NSdnZ1bW1vExMTq6uqtra309PRERETf399ycnKGhoaVOQEOAAAACnRSTlMAg87/rjLgE1rzhWrqxgAABexJREFUaN61WouSpCAMVPEJKCqi//+nF4IKKig6e1SduzfupEkT8oIkiRlVVdRpnmdlQ0hTZnme1kVV4Zvk96Fla8nH0ZSI8rP0Ks2uwi1Ilv4EURW5K5xS0slhMb/BkD0hrMk/q1HVeSP6QVILMFIY8wagn6ojTV5Xn8RnbFZaoAPQc9bR3gXQ/yaWvYYA8VfKKeXACZVnAE1V9o4on/izWPsb/q9Ji3j5OcrjhiCXohsAQso6lh6QL9qOEd6GAAbKYAInAFAiiqYC5LMeLIaFKeppR3h/BiAkj6CpLuEPmbbHngUBhFZsdAGiaUL5xLBzRrAAZBlk5wpnVJEohHTbuZoAD0uhMUu+uY/bLZHaryBCH4vQCuugbnSoYf5sk+llKWaEETT/Qu2TecmSHaF1KPT6gmkM4hNLLkIR2l/guAZK1fQrS3kVXmChEX5mKb0xICH/gKXrQtf2pbhlyfqFoL/1LUOVEbFwcsuSs5GfAcjJ8dVkknbafpYUfUXSQYWqRP81THcs8fbVMmTVaQU6ENNOdyxNgGRYmFsp2/mQaFiKzGeC1IcVmAjrDjq4LAF9RgdF13CAo3cTDRcAP2OOCjX6UAwCPpbWyGZsCWTMAM0YTGF2Eg0XAD8bramue9jocGVpi5y7LbUUVRO0dRINF2D9bN/PBSqgAizt8gHByJAUddEyTqa7rYF57oZkkgiYj48lYeVTuuh4Hw1A8pWhxr68snQYioOxHSm6A2gq1wuZz68suUMKELst8oCLfAew+rzMecmOLO251wYwa4CDmd4B8GyPM1YDlyXeUp8Gx412A9Chy6vP9cXO0kW+5e6N104vH68sXeW/jwzptss8OihFf1UAY2dVkgDCdQz8dfiv1m3sZek62rcIsJlr/5uADv1bhNqzxrcIb3VIkzz06m9YykMAM39kidIoAG+5R7icHlm6BViUVDqSZknpfd8NZh2MO1Xz+JKlcYsfZeK3UqjBTDRexn680PVoSxMFBiCST6RJJmXzg2FTegaPzyRWRWu9cERAHW4o6jANmPU0Ewwqe36wa8j1wyQLADHyk1FphM760H1sBY/+PtS5ECQTvucHynoapYPiZJKFDoSNnFxZYl0QYG2gQExtcJFN8LNl1voHOA++5yQelh5yVPhRopma8M3OALMO8p0GhgDT+lgKDatBhhvN5gcuRWaZJeQ8CzVBLmBLd2tgdrLND9xFxh9CW8JABYRSNQVYugJYK8rB2bn5gWOmaM4dzmXQVjvuidMzS3YfpEm9uPnBtp5yNFRJLRUTb9OaiN1x+06uk0q4+cG+U+SqCeoKLmMwrYkp1pYWRbUvgoDjDZng7EScG3/wSxAyK7+/Xvrgl974JZ1gp69r1Bc7LvUlXhEIsSxh4lWU5Ecdwixh6lhlhPwvlkyZlpIvCFEspW4B8h9YWguQYOZynzZEsJTvRWBPxwDABnKuXWJY2ovAKu8H9h7gkSXblqqFIB8AHlhyekbGUk2PYUbXtvgAXGnYjfWwNA+QcDHN3+x2Q2rngENgiSeeAUZfjDMVHkSn1m2GGBVwCh0d8NlfhJ4owiyE+VjiPV0WKQ7tHCxD1h6DeQ7PAMKWvUcERtt2PDakkio9f/1pkdcsxMOSLq7ldD5LAJf3BeCaCfQmDl57s/Xak4sHEJiPjOcdN4f61+n8CDDQaX/iIk8KcrOTDqCC4Km3tdw9AeBM1+dq1IqRE0stI8LbWk6K7AmAjYPeX/jEdF/qJtgpX+pDzfH9eCVunFyt1UEQUt8dUHwE2BE6b2f8A8I1WMxqGLQfyqu7I8zmOwBh08TJrfy36+ANw1XcQdrHEXOeWeTf5edRJ7JV+t/o+UKTc+hRxx8oF+lLaxKCvTmw1vcRshcAbGFZ8eFUv4kF4NnHewn5pM91sauv7z9gumDPPNgoobBq54/XHraLGyAZXPLqaFrnzIMpKoeR/3BxY7t6woWY2hYqZZ0u2DOPeZzZr1dP7OUZbk4MVE+wecrmqcn+5vLMevsneP3ncfwDNtu0vRpuz80AAAAASUVORK5CYII='

    const locales = { /* cSpell: disable */
        de: {
            downgrade: 'Auf zurückstufen',
            hide: '❌ Dieses skript ausblenden',
            install: 'Installieren',
            notHide: '✔️ Dieses skript nicht ausblenden',
            milestone: 'Herzlichen Glückwunsch, Ihre Skripte haben den Meilenstein von insgesamt $1 Installationen überschritten!',
            reinstall: 'Erneut installieren',
            update: 'Auf aktualisieren'
        },
        en: {
            downgrade: 'Downgrade to',
            hide: '❌ Hide this script',
            install: 'Install',
            notHide: '✔️ Not hide this script',
            milestone: 'Congrats, your scripts got over the milestone of $1 total installs!',
            reinstall: 'Reinstall',
            update: 'Update to'
        },
        es: {
            downgrade: 'Degradar a',
            hide: '❌ Ocultar este script',
            install: 'Instalar',
            notHide: '✔️ No ocultar este script',
            milestone: '¡Felicidades, sus scripts superaron el hito de $1 instalaciones totales!',
            reinstall: 'Reinstalar',
            update: 'Actualizar a'
        },
        fr: {
            downgrade: 'Revenir à',
            hide: '❌ Cacher ce script',
            install: 'Installer',
            notHide: '✔️ Ne pas cacher ce script',
            milestone: 'Félicitations, vos scripts ont franchi le cap des $1 installations au total!',
            reinstall: 'Réinstaller',
            update: 'Mettre à'
        },
        it: {
            downgrade: 'Riporta a',
            hide: '❌ Nascondi questo script',
            install: 'Installa',
            notHide: '✔️ Non nascondere questo script',
            milestone: 'Congratulazioni, i tuoi script hanno superato il traguardo di $1 installazioni totali!',
            reinstall: 'Reinstalla',
            update: 'Aggiorna a'
        },
        ru: {
            downgrade: 'Откатить до',
            hide: '❌ Скрыть этот скрипт',
            install: 'Установить',
            notHide: '✔️ Не скрывать этот сценарий',
            milestone: 'Поздравляем, ваши скрипты преодолели рубеж в $1 установок!',
            reinstall: 'Переустановить',
            update: 'Обновить до'
        },
        'zh-CN': {
            downgrade: '降级到',
            hide: '❌ 隐藏此脚本',
            install: '安装',
            notHide: '✔️ 不隐藏此脚本',
            milestone: '恭喜，您的脚本超过了 $1 次总安装的里程碑！',
            reinstall: '重新安装',
            update: '更新到'
        },
        'zh-TW': {
            downgrade: '降級至',
            hide: '❌ 隱藏此腳本',
            install: '安裝',
            notHide: '✔️ 不隱藏此腳本',
            milestone: '恭喜，您的腳本安裝總數已超過 $1！',
            reinstall: '重新安裝',
            update: '更新至'
        },
        'ja': {
            downgrade: 'ダウングレードする',
            hide: '❌ このスクリプトを隠す',
            install: 'インストール',
            notHide: '✔️ このスクリプトを隠さない',
            milestone: 'おめでとうございます、あなたのスクリプトの合計インストール回数が $1 を超えました！',
            reinstall: '再インストール',
            update: '更新する'
        },
        'ko': {
            downgrade: '다운그레이드하기',
            hide: '❌ 이 스크립트 숨기기',
            install: '설치',
            notHide: '✔️ 이 스크립트 숨기지 않기',
            milestone: '축하합니다, 스크립트의 총 설치 횟수가 $1을 넘었습니다!',
            reinstall: '재설치',
            update: '업데이트하기'
        }

    };

    const blacklist = [
        '\\bagar((\\.)?io)?\\b', '\\bagma((\\.)?io)?\\b', '\\baimbot\\b', '\\barras((\\.)?io)?\\b', '\\bbot(s)?\\b',
        '\\bbubble((\\.)?am)?\\b', '\\bcheat(s)?\\b', '\\bdiep((\\.)?io)?\\b', '\\bfreebitco((\\.)?in)?\\b', '\\bgota((\\.)?io)?\\b',
        '\\bhack(s)?\\b', '\\bkrunker((\\.)?io)?\\b', '\\blostworld((\\.)?io)?\\b', '\\bmoomoo((\\.)?io)?\\b', '\\broblox(\\.com)?\\b',
        '\\bshell\\sshockers\\b', '\\bshellshock((\\.)?io)?\\b', '\\bshellshockers\\b', '\\bskribbl((\\.)?io)?\\b', '\\bslither((\\.)?io)?\\b',
        '\\bsurviv((\\.)?io)?\\b', '\\btaming((\\.)?io)?\\b', '\\bvenge((\\.)?io)?\\b', '\\bvertix((\\.)?io)?\\b', '\\bzombs((\\.)?io)?\\b',
        // '\\p{Extended_Pictographic}'
    ];


    const settingsCSS = `

        /*
        #greasyfork-plus label::before {
        content:'';
        display:block;
        position:absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
        z-index:1;
        }
        #greasyfork-plus label {
        position:relative;
        z-index:0;
        }
        */

        html {
        color: #222;
        background: #f9f9f9;
        }

        #greasyfork-plus{
            --config-var-display: flex;
        }
        #greasyfork-plus * {
            font-family:Open Sans,sans-serif,Segoe UI Emoji !important;
            font-size:12px
        }
        #greasyfork-plus .section_header[class] {
            background-color:#670000;
            background-image:linear-gradient(#670000,#900);
            border:1px solid transparent;
            color:#fff
        }
        #greasyfork-plus .field_label[class]{
            margin-bottom:4px
        }
        #greasyfork-plus .field_label[class] span{
            font-size:95%;
            font-style:italic;
            opacity:.8;
        }
        #greasyfork-plus .field_label[class] b{
            color:#670000
        }
        #greasyfork-plus_logging_var[class],
        #greasyfork-plus_debugging_var[class] {
            --config-var-display: inline-flex;
        }
        #greasyfork-plus #greasyfork-plus_logging_var label.field_label[class],
        #greasyfork-plus #greasyfork-plus_debugging_var label.field_label[class] {
            margin-bottom:0;
            align-self: center;
        }
        #greasyfork-plus .config_var[class]{
            display:var(--config-var-display);
            position: relative;
        }
        #greasyfork-plus_customBlacklist_var[class],
        #greasyfork-plus_hiddenList_var[class],
        #greasyfork-plus_milestoneNotification_var[class]{
            flex-direction:column;
            margin-left:21px;
        }

        #greasyfork-plus_customBlacklist_var[class]::before,
        #greasyfork-plus_hiddenList_var[class]::before,
        #greasyfork-plus_milestoneNotification_var[class]::before{
            /* content: "◉"; */
            content: "◎";
            position: absolute;
            left: auto;
            top: auto;
            margin-left: -16px;
        }
        #greasyfork-plus_field_customBlacklist[class],
        #greasyfork-plus_field_milestoneNotification[class]{
            flex:1;
        }
        #greasyfork-plus_field_hiddenList[class]{
            box-sizing:border-box;
            overflow:hidden;
            resize:none;
            width:100%
        }

        body > #greasyfork-plus_wrapper:only-child {
            box-sizing: border-box;
            overflow: auto;
            max-height: calc(100vh - 72px);
            padding: 12px;
            /* overflow: auto; */
            scrollbar-gutter: both-edges;
            background: rgba(127,127,127,0.05);
            border: 1px solid rgba(127,127,127,0.5);
        }

        #greasyfork-plus_wrapper > #greasyfork-plus_buttons_holder:last-child {
            position: fixed;
            bottom: 0;
            right: 0;
            margin: 0 12px 6px 0;
        }

        #greasyfork-plus .saveclose_buttons[class] {
            padding: 4px 14px;
            margin: 6px;
        }
        #greasyfork-plus .section_header_holder#greasyfork-plus_section_2[class] {
            position: fixed;
            left: 0;
            bottom: 0;
            margin: 8px;
        }
        #greasyfork-plus .section_header#greasyfork-plus_section_header_2[class] {
            background: #000;
            color: #eee;
        }

        #greasyfork-plus_header[class]{
            font-size: 16pt;
            font-weight: bold;
        }

    `;

    const pageCSS = `

        .script-list li.blacklisted{
            display:none;
            background:#321919;
            color:#e8e6e3
        }
        .script-list li.hidden{
            display:none;
            background:#321932;
            color:#e8e6e3
        }
        .script-list li.blacklisted a:not(.install-link),.script-list li.hidden a:not(.install-link){
            color:#ff8484
        }
        #script-info.hidden,#script-info.hidden .user-content{
            background:#321932;
            color:#e8e6e3
        }
        #script-info.hidden a:not(.install-link):not(.install-help-link){
            color:#ff8484
        }
        #script-info.hidden code{
            background-color:transparent
        }
        html {
            --block-btn-color:#111;
            --block-btn-bgcolor:#eee;
        }
        #script-info.hidden, #script-info.hidden .user-content {
            --block-btn-color:#eee;
            --block-btn-bgcolor:#111;
        }

        [style-54998]{
            float:right;
            font-size: 70%;
            text-decoration:none;
        }

        [style-16377]{
            cursor:pointer;
            font-size:70%;
            white-space:nowrap;
            border: 1px solid #888;
            background: var(--block-btn-bgcolor, #eee);
            color: var(--block-btn-color);
            border-radius: 4px;
            padding: 0px 6px;
            margin: 0 8px;
        }
        [style-77329] {
            cursor: pointer;
            margin-left: 1ex;
            white-space: nowrap;
            float: right;
            border: 1px solid #888;
            background: var(--block-btn-bgcolor, #eee);
            color: var(--block-btn-color);
            border-radius: 4px;
            padding: 0px 6px;
        }

        a#hyperlink-35389,
        a#hyperlink-40361,
        a#hyperlink-35389:visited,
        a#hyperlink-40361:visited,
        a#hyperlink-35389:hover,
        a#hyperlink-40361:hover,
        a#hyperlink-35389:focus,
        a#hyperlink-40361:focus,
        a#hyperlink-35389:active,
        a#hyperlink-40361:active {

            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            appearance: none !important;
            background: none !important;
            color:inherit !important;
        }

        a#hyperlink-35389{
            opacity: var(--hyperlink-blacklisted-option-opacity);

        }
        a#hyperlink-40361{
            opacity: var(--hyperlink-hidden-option-opacity);
        }


        html {

            --hyperlink-blacklisted-option-opacity: 0.5;
            --hyperlink-hidden-option-opacity: 0.5;
        }


        .list-option.list-current[class] > a[href] {

            text-decoration:none;
        }

        html {
            --blacklisted-display: none;
            --hidden-display: none;
        }

        [blacklisted-shown] {
            --blacklisted-display: list-item;
            --hyperlink-blacklisted-option-opacity: 1;
        }
        [hidden-shown] {
            --hidden-display: list-item;
            --hyperlink-hidden-option-opacity: 1;
        }

        .script-list li.blacklisted{
            display: var(--blacklisted-display);

        }

        .script-list li.hidden{
            display: var(--hidden-display);

        }

        .install-link.install-status-checking,
        .install-link.install-status-checking:visited,
        .install-link.install-status-checking:active,
        .install-link.install-status-checking:hover,
        .install-help-link.install-status-checking {
            background-color: #405458;
        }

        div.previewable{
            display: flex;
            flex-direction: column;
        }
        .script-version-ainfo-span {
            align-self:end;
            font-size: 90%;
            padding: 4px 8px;
            margin: 0;
        }
        [style*="display:"] + .script-version-ainfo-span{
            display: none;
        }


        /* Greasy Fork Enhance - Flat Layout  */

        [greasyfork-enhance-k37*="|flat-layout|"] ol.script-list > li > article > h2 {
            width: 0;
            flex-grow: 1;
            flex-basis: 60%;
        }

        [greasyfork-enhance-k37*="|flat-layout|"] ol.script-list > li > article > div.script-meta-block {
            width: auto;
            flex-basis: 40%;
            flex-shrink: 0;
            flex-grow: 0;
        }

        [greasyfork-enhance-k37*="|flat-layout|"] .script-list li:not(.ad-entry) {
            padding: 1em;
            margin: 0;
        }

        [greasyfork-enhance-k37*="|flat-layout|"] .script-list li:not(.ad-entry) article {
            padding: 0;
            margin: 0;
        }

        [greasyfork-enhance-k37*="|flat-layout|"]  #script-info div.script-meta-block + #additional-info {

            max-width: calc( 100% - 340px );
            min-height: 300px;
            box-sizing: border-box;
        }

         [greasyfork-enhance-k37*="|basic|"] ul.outline {
            margin-bottom: -99vh;

         }


    `

    const window = {};

    /** @param {typeof WinComm.createInstance} createInstance */
    function contentScriptText(shObject, createInstance) {

        /*
         *

        return new Promise((resolve, reject) => {
          const external = unsafeWindow.external;
          console.log(334, external)
          const scriptHandler = GM.info.scriptHandler;
          if (external && external.Violentmonkey && (scriptHandler || 'Violentmonkey') === 'Violentmonkey' ) {
            external.Violentmonkey.isInstalled(name, namespace).then((data) => resolve(data));
            return;
          }

          if (external && external.Tampermonkey && (scriptHandler || 'Tampermonkey') === 'Tampermonkey') {
            external.Tampermonkey.isInstalled(name, namespace, (data) => {
              (data.installed) ? resolve(data.version) : resolve();
            });
            return;
          }

          resolve();
        });

        */

        if (document.querySelector('#greasyfork-enhance-basic')) {



            const setScriptOnDisabled = async (style) => {

                try {
                    const pd = Object.getOwnPropertyDescriptor(style.constructor.prototype, 'disabled');
                    const { get, set } = pd;
                    Object.defineProperty(style, 'disabled', {
                        get() {
                            return get.call(this);
                        },
                        set(nv) {
                            let r = set.call(this, nv);
                            Promise.resolve().then(chHead);
                            return r;
                        }
                    })
                } catch (e) {

                }
            };

            document.addEventListener('style-s48', function (evt) {
                const target = (evt || 0).target || 0;
                if (!target) return;
                setScriptOnDisabled(target)

            }, true);


            const isScriptEnabled = (style) => {

                if (style instanceof HTMLStyleElement) {
                    if (!style.hasAttribute('s48')) {
                        style.setAttribute('s48', '');
                        style.dispatchEvent(new CustomEvent('style-s48'));
                        // setScriptOnDisabled(style);
                    }
                    return style.disabled !== true;
                }
                return false;
            }
            const chHead = () => {
                let p = [];
                if (isScriptEnabled(document.getElementById('greasyfork-enhance-basic')))
                    p.push('basic');
                if (isScriptEnabled(document.getElementById('greasyfork-enhance-flat-layout')))
                    p.push('flat-layout');
                if (isScriptEnabled(document.getElementById('greasyfork-enhance-animation')))
                    p.push('animation');
                if (p.length >= 1)
                    document.documentElement.setAttribute('greasyfork-enhance-k37', `|${p.join('|')}|`);
                else
                    document.documentElement.removeAttribute('greasyfork-enhance-k37');
            }
            const moHead = new MutationObserver(chHead);
            moHead.observe(document.head, { subtree: false, childList: true });
            chHead();

            /*
            const outline = document.querySelector('aside.panel > ul.outline');
            if(outline) {
              const div = document.createElement('div');
              //outline.replaceWith(div);
              //div.appendChild(outline)
            }
            */

            //         Promise.resolve().then(()=>{
            //           let outline = document.querySelector('[greasyfork-enhance-k37*="|basic|"] header + aside.panel ul.outline');
            //           if(outline){
            //             let aside = outline.closest('aside.panel');
            //           let header = aside.parentNode.querySelector('header');
            //             let p = header.getBoundingClientRect().height;

            //             document.body.parentNode.insertBefore(aside, document.body);
            //             // outline.style.top='0'
            //             p+=(parseFloat(getComputedStyle(outline).marginTop.replace('px',''))||0)
            //             outline.style.marginTop= p.toFixed(2)+'px';
            //           }

            //         })

        }



        const { scriptHandler, scriptName, scriptVersion, scriptNamespace, communicationId } = shObject;

        const wincomm = createInstance(communicationId);

        const external = window.external;

        if (external[scriptHandler]) 1;
        else if (external && external.Violentmonkey && (scriptHandler || 'Violentmonkey') === 'Violentmonkey') scriptHandler = 'Violentmonkey';
        else if (external && external.Tampermonkey && (scriptHandler || 'Tampermonkey') === 'Tampermonkey') scriptHandler = 'Tampermonkey';

        const manager = external[scriptHandler];

        if (!manager) {

            wincomm.send('userScriptManagerNotDetected', {
                code: 1
            });
            return;

        }


        const pnIsInstalled2 = (type, scriptName, scriptNamespace) => new Promise((resolve, reject) => {
            const result = manager.isInstalled(scriptName, scriptNamespace);
            if (result instanceof Promise) {
                result.then((result) => resolve({
                    type,
                    result: typeof result === 'string' ? { version: result } : result
                })).catch(reject);
            } else {
                resolve({
                    type,
                    result: typeof result === 'string' ? { version: result } : result
                })
            }

        }).catch(console.warn);


        const pnIsInstalled3 = (type, scriptName, scriptNamespace) => new Promise((resolve, reject) => {
            try {
                manager.isInstalled(scriptName, scriptNamespace, (result) => {
                    resolve({
                        type,
                        result: typeof result === 'string' ? { version: result } : result
                    })

                });
            } catch (e) {
                reject(e);
            }
        }).catch(console.warn);



        const enableScriptInstallChecker = (r) => {

            const { type, result } = r;
            let version = result.version;
            // console.log(type, result, version)
            if (version !== scriptVersion) return;

            const pnIsInstalled = type < 25 ? pnIsInstalled2 : pnIsInstalled3;

            wincomm.hook('_$GreasyFork$Msg$OnScriptInstallCheck', {

                'installedVersion.req': (d, evt) => {
                    pnIsInstalled(type, d.data.name, d.data.namespace).then((r) => {
                        if (r && 'result' in r) {
                            wincomm.response(evt, 'installedVersion.res', {
                                version: r.result ? (r.result.version || '') : ''
                            });
                        }
                    })
                }

            });

            wincomm.send('ready', { type });

            // console.log('enableScriptInstallChecker', r)


        }

        const kl = manager.isInstalled.length;

        if (!(kl === 2 || kl === 3)) return;
        const puds = kl === 2 ? [
            pnIsInstalled2(21, scriptName, scriptNamespace), // scriptName is GM.info.script.name not GM.info.script.name_i18n
            pnIsInstalled2(20, scriptName, '')
        ] : [
            pnIsInstalled3(31, scriptName, scriptNamespace),
            pnIsInstalled3(30, scriptName, '')
        ];

        Promise.all(puds).then((rs) => {
            const [r1, r0] = rs;
            if (r0 && r0.result && r0.result.version) enableScriptInstallChecker(r0); // '3.1.4'
            else if (r1 && r1.result && r1.result.version) enableScriptInstallChecker(r1);
        });



        // console.log(327, shObject, scriptHandler);

    }



    return { fields, logo, locales, blacklist, settingsCSS, pageCSS, contentScriptText }



})();

(async () => {

    const isVaildURL = (url) => {
        if (!url || typeof url !== 'string' || url.length < 23) return;
        let obj = null;
        try {
            obj = new URL(url);
        } catch (e) {
            return false;
        }
        if (obj && obj.host === obj.hostname && !obj.port && (obj.protocol || '').startsWith('http') && obj.pathname) {
            return true;
        }
        return false;
    };

    const installLinkPointerDownHandler = function (e) {
        if (!e || !e.isTrusted) return;
        const button = e.target || this;
        if (button.hasAttribute('acnmd')) return;
        const href = button.href;
        if (!href || !isVaildURL(href)) return;
        if (/\.js[^-.\w\d\s:\/\\]*$/.test(href)) {
            0 && fetch(href, {
                method: "GET",
                cache: 'reload',
                redirect: "follow"
            }).then(() => {
                console.debug('code url reloaded', href);
            }).catch((e) => {
                console.debug(e);
            });
            const m = /^(https\:\/\/(greasyfork|sleazyfork)\.org\/[_-\w\/]*scripts\/(\d+)[-\w%]*)(\/|$)/.exec(location.href)
            if (m && m[1]) {
                const href = `${m[1]}/code`
                0 && fetch(href, {
                    method: "GET",
                    cache: 'reload',
                    redirect: "follow"
                }).then(() => {
                    console.debug('code url reloaded', href);
                }).catch((e) => {
                    console.debug(e);
                });
            }

            if (m && m[3] && href.includes('.user.js')) {
                const href = `https://${location.hostname}/scripts/${m[3]}-fetching/code/${crypto.randomUUID()}.user.js?version_=${Date.now()}`
                fetch(href, {
                    method: "GET",
                    cache: 'reload',
                    redirect: "follow"
                }).then(() => {
                    console.debug('code url reloaded', href);
                }).catch((e) => {
                    console.debug(e);
                });
            }


        }
        
        button.setAttribute('acnmd', '');
    };

    const setupInstallLink = (button) => {
        if (!button || button.className !== 'install-link' || button.nodeName !== "A" || !button.href) return button;
        button.addEventListener('pointerdown', installLinkPointerDownHandler);
        return button;
    };

    function fixValue(key, def, test) {
        return GM.getValue(key, def).then((v) => test(v) || GM.deleteValue(key))
    }

    function numberArr(arrVal) {
        if (!arrVal || typeof arrVal.length !== 'number') return [];
        return arrVal.filter(e => typeof e === 'number' && !isNaN(e))
    }

    const isScriptFirstUse = await GM.getValue('firstUse', true);
    await Promise.all([
        fixValue('hiddenList', [], v => v && typeof v === 'object' && typeof v.length === 'number' && (v.length === 0 || typeof v[0] === 'number')),
        fixValue('lastMilestone', 0, v => v && typeof v === 'number' && v >= 0)
    ])

    function createRE(t, ...opt) {
        try {
            return new RegExp(t, ...opt);
        } catch (e) { }
        return null;
    }

    const useHashedScriptName = true;
    const fixLibraryScriptCodeLink = true;
    const addAdditionInfoLengthHint = true;

    const id = 'greasyfork-plus';
    const title = `${GM.info.script.name} v${GM.info.script.version} Settings`;
    const fields = mWindow.fields;
    const logo = mWindow.logo;
    const nonLatins = /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/gu;
    const blacklist = createRE((mWindow.blacklist || []).filter(e => !!e).join('|'), 'giu');
    const hiddenList = numberArr(await GM.getValue('hiddenList', []));
    const lang = document.documentElement.lang;
    const locales = mWindow.locales;

    const _isBlackList = (text) => {
        if (!text || typeof text !== 'string') return false;
        if (text.includes('hack') && (text.includes('EXPERIMENT_FLAGS') || text.includes('yt.'))) return false;
        return blacklist.test(text);
    }
    const isBlackList = (name, description) => {
        // To be reviewed
        if (!blacklist) return false;
        return _isBlackList(name) || _isBlackList(description);
    }

    function hiddenListStrToArr(str) {
        if (!str || typeof str !== 'string') str = '';
        return [...new Set(str ? numberArr(str.split(',').map(e => parseInt(e))) : [])];
    }

    const gmc = new GM_config({
        id,
        title,
        fields,
        css: mWindow.settingsCSS,
        events: {
            init: () => {
                gmc.initializedResolve && gmc.initializedResolve();
                gmc.initializedResolve = null;

            },
            /** @param {Document} document */
            open: async (document) => {
                const textarea = document.querySelector(`#${id}_field_hiddenList`);

                const hiddenSet = new Set(numberArr(await GM.getValue('hiddenList', [])));
                if (hiddenSet.size !== 0) {
                    const unsavedHiddenList = hiddenListStrToArr(gmc.get('hiddenList'));
                    const unsavedHiddenSet = new Set(unsavedHiddenList);

                    const hasDifferentItems = [...hiddenSet].some(item => !unsavedHiddenSet.has(item)) || [...unsavedHiddenSet].some(item => !hiddenSet.has(item));

                    if (hasDifferentItems) {

                        gmc.fields.hiddenList.value = [...hiddenSet].sort((a, b) => a - b).join(', ');

                        gmc.close();
                        gmc.open();

                    }


                }

                const resize = (target) => {
                    target.style.height = '';
                    target.style.height = `${target.scrollHeight}px`;
                };

                if (textarea) {
                    resize(textarea);
                    textarea.addEventListener('input', (event) => resize(event.target));

                }

                document.body.addEventListener('mousedown', (event) => {
                    if (event.detail > 1 && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey && !event.defaultPrevented) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                    }
                }, true);
            },
            save: async (forgotten) => {

                if (gmc.isOpen) {
                    await GM.setValue('hiddenList', hiddenListStrToArr(forgotten.hiddenList));

                    UU.alert('settings saved');
                    gmc.close();
                    setTimeout(() => window.location.reload(false), 500);
                }
            }
        }
    });
    gmc.initialized = new Promise(r => (gmc.initializedResolve = r));
    await gmc.initialized.then();
    const customBlacklistRE = createRE((gmc.get('customBlacklist') || '').replace(/\s/g, '').split(',').join('|'), 'giu');

    if (typeof GM.registerMenuCommand === 'function') {
        GM.registerMenuCommand('Configure', () => gmc.open());
        GM.registerMenuCommand('Reset Everything', () => {
            Promise.all([
                GM.deleteValue('hiddenList'),
                GM.deleteValue('lastMilestone'),
                GM.deleteValue('firstUse')
            ]).then(() => {
                setTimeout(() => window.location.reload(false), 50);
            })
        });
    }

    UU.init({ id, logging: gmc.get('logging') });
    UU.log(nonLatins);
    UU.log(blacklist);
    UU.log(hiddenList);

    const _VM = (typeof VM !== 'undefined' ? VM : null) || {
        shortcut: {
            register: () => { }
        }
    };


    function fixLibraryCodeURL(code_url) {
        if (/\/scripts\/(\d+)(\-[^\/]+)\/code\//.test(code_url)) {
            code_url = code_url.replace(/\/scripts\/(\d+)(\-[^\/]+)\/code\//, '/scripts/$1/code/');
            let qm = code_url.indexOf('?');
            let s1 = code_url.substring(0, qm);
            let s2 = code_url.substring(qm + 1);
            if (qm > 0) {
                code_url = `${decodeURI(s1)}?${s2}`;
            }
        }
        return code_url;
    }

    function setClickToSelect(elm) {
        elm.addEventListener('click', function () {
            if (window.getSelection() + "" === "") {
                if (typeof this.select === 'function') {
                    this.select();
                } else {
                    const range = document.createRange();  // Create a range object
                    range.selectNode(this);        // Select the text within the element
                    const selection = window.getSelection(); // Get the selection object
                    selection.removeAllRanges();  // First clear any existing selections
                    selection.addRange(range);    // Add the new range to the selection
                }
            }
        });
        elm.addEventListener('drag', function (evt) {
            evt.preventDefault();
        });
        elm.addEventListener('drop', function (evt) {
            evt.preventDefault();
        });
        elm.addEventListener('dragstart', function (evt) {
            evt.preventDefault();
        });
    }

    const copyText = typeof (((window.navigator || 0).clipboard || 0).writeText) === 'function' ? (text) => {
        navigator.clipboard.writeText(text).then(function () {
            //
        }).catch(function (err) {
            alert("Unable to Copy");
        });
    } : (text) => {
        const textToCopy = document.createElement('strong');
        textToCopy.style.position = 'fixed';
        textToCopy.style.opacity = '0';
        textToCopy.style.top = '-900vh';
        textToCopy.textContent = text;
        document.body.appendChild(textToCopy);

        const range = document.createRange();  // Create a range object
        range.selectNode(textToCopy);        // Select the text within the element

        const selection = window.getSelection(); // Get the selection object
        selection.removeAllRanges();  // First clear any existing selections
        selection.addRange(range);    // Add the new range to the selection

        try {
            document.execCommand('copy');  // Try to copy the selected text
        } catch (err) {
            alert("Unable to Copy");
        }

        selection.removeAllRanges();  // Remove the selection range after copying
        textToCopy.remove();
    };


    let avoidDuplication = 0;
    const avoidDuplicationF = () => {
        const p = avoidDuplication;
        avoidDuplication = Date.now();
        if (avoidDuplication - p < 30) return false;
        return true;
    }
    // https://violentmonkey.github.io/vm-shortcut/
    const shortcuts = [
        ['ctrlcmd-alt-keys', () => avoidDuplicationF() && gmc.open()],
        ['ctrlcmd-alt-keyb', () => avoidDuplicationF() && toggleListDisplayingItem('blacklisted')],
        ['ctrlcmd-alt-keyh', () => avoidDuplicationF() && toggleListDisplayingItem('hidden')]
    ]
    for (const [scKey, scFn] of shortcuts) {
        _VM.shortcut.register(scKey, scFn);
    }

    const addSettingsToMenu = () => {
        const nav = document.querySelector('#site-nav > nav')
        if (!nav) return;

        const scriptName = GM.info.script.name;
        const scriptVersion = GM.info.script.version;
        const menu = document.createElement('li');
        menu.classList.add(id);
        menu.setAttribute('alt', `${scriptName} ${scriptVersion}`);
        menu.setAttribute('title', `${scriptName} ${scriptVersion}`);
        const link = document.createElement('a');
        link.setAttribute('href', '#');
        link.textContent = GM.info.script.name;
        menu.appendChild(link);
        nav.insertBefore(menu, document.querySelector('#site-nav > nav > li:first-of-type'));

        menu.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            gmc.open();
        });
    };


    const toggleListDisplayingItem = (t) => {

        const m = document.documentElement;

        const p = t + '-shown';
        let currentIsShown = m.hasAttribute(p)
        if (!currentIsShown) {
            m.setAttribute(p, '')
        } else {
            m.removeAttribute(p)
        }

    }

    const createListOptionGroup = () => {

        const html = `<div class="list-option-group" id="${id}-options">${GM.info.script.name} Lists:<ul>
      <li class="list-option blacklisted"><a href="#" id="hyperlink-35389"></a></li>
      <li class="list-option hidden"><a href="#" id="hyperlink-40361"></a></li>
      </ul></div>`;
        const firstOptionGroup = document.querySelector('.list-option-groups > div');
        firstOptionGroup && firstOptionGroup.insertAdjacentHTML('beforebegin', html);

        const blacklistedOption = document.querySelector(`#${id}-options li.blacklisted`);
        blacklistedOption && blacklistedOption.addEventListener('click', (evt) => {
            evt.preventDefault();
            toggleListDisplayingItem('blacklisted');
        }, false);

        const hiddenOption = document.querySelector(`#${id}-options li.hidden`);
        hiddenOption && hiddenOption.addEventListener('click', (evt) => {
            evt.preventDefault();
            toggleListDisplayingItem('hidden');
        }, false);

    }

    const addOptions = () => {

        const gn = () => {

            let aBlackList = document.querySelector('#hyperlink-35389');
            let aHidden = document.querySelector('#hyperlink-40361');
            if (!aBlackList || !aHidden) return;
            aBlackList.textContent = `Blacklisted scripts (${document.querySelectorAll('.script-list li.blacklisted').length})`;
            aHidden.textContent = `Hidden scripts (${document.querySelectorAll('.script-list li.hidden').length})`

        }
        const callback = (entries) => {
            if (entries && entries.length >= 1) requestAnimationFrame(gn);
        }

        const setupScriptList = async () => {
            let scriptList;
            let i = 8;
            while (i-- > 0) {
                scriptList = document.querySelector('.script-list li')
                if (scriptList) scriptList = scriptList.closest('.script-list')
                if (scriptList) break;
                await new Promise(r => requestAnimationFrame(r))
            }
            if (!scriptList) return;
            createListOptionGroup();
            const mo = new MutationObserver(callback);
            mo.observe(scriptList, { childList: true, subtree: true });
            gn();
        }
        setupScriptList();

    };


    /**
     * Get script data from Greasy Fork API
     *
     * @param {number} id Script ID
     * @returns {Promise} Script data
     */
    let networkMP1 = Promise.resolve();
    let networkMP2 = Promise.resolve();
    let previousIsCache = false;
    // let ss = [];
    // var sum = function(nums) {
    //   var total = 0;
    //   for (var i = 0, len = nums.length; i < len; i++) total += nums[i];
    //   return total;
    // };
    const getScriptData = async (id, noCache) => {

        if (!(id >= 0)) return Promise.resolve()
        const url = `https://${window.location.hostname}/scripts/${id}.json`;
        return new Promise((resolve, reject) => {

            const onPageElement = document.querySelector(`[data-script-namespace][data-script-id="${id || 'null'}"][data-script-name][data-script-version][href]`)
            if (onPageElement && /^https\:\/\/update\.\w+\.org\/scripts\/\d+\/[^.?\/]+\.user\.js$/.test(onPageElement.getAttribute('href') || '')) {

                const result = {
                    "id": +onPageElement.getAttribute('data-script-id'),
                    // "created_at": "2023-08-24T21:16:50.000Z",
                    // "daily_installs": 21,
                    // "total_installs": 3310,
                    // "code_updated_at": "2023-12-20T07:46:54.000Z",
                    // "support_url": null,
                    // "fan_score": "74.1",
                    "namespace": `${onPageElement.getAttribute('data-script-namespace')}`,
                    // "contribution_url": null,
                    // "contribution_amount": null,
                    // "good_ratings": 11,
                    // "ok_ratings": 0,
                    // "bad_ratings": 0,
                    // "users": [
                    //     {
                    //         "id": 371179,
                    //         "name": "𝖢𝖸 𝖥𝗎𝗇𝗀",
                    //         "url": "https://greasyfork.org/users/371179-%F0%9D%96%A2%F0%9D%96%B8-%F0%9D%96%A5%F0%9D%97%8E%F0%9D%97%87%F0%9D%97%80"
                    //     }
                    // ],
                    "name": `${onPageElement.getAttribute('data-script-name')}`,
                    // "description": "Adds various features and improves the Greasy Fork experience",
                    // "url": "https://greasyfork.org/scripts/473830-greasy-fork",
                    // "code_url": "https://update.greasyfork.org/scripts/473830/Greasy%20Fork%2B%2B.user.js",
                    "code_url": `${onPageElement.getAttribute('href')}`,
                    // "license": "MIT License",
                    "version": `${onPageElement.getAttribute('data-script-version')}`,
                    // "locale": "en",
                    // "deleted": false
                };
                resolve(result);
                return;
            }

            networkMP1 = networkMP1.then(() => new Promise(unlock => {

                const maxAgeInSeconds = 900;
                const rd = previousIsCache ? 1 : Math.floor(Math.random() * 80 + 80);
                let fetchStart = 0;
                new Promise(r => setTimeout(r, rd))
                    .then(() => {
                        fetchStart = Date.now();
                    })
                    .then(() => fetch(url, noCache ? {
                        method: 'GET',
                        cache: 'reload',
                        credentials: 'omit',
                        headers: new Headers({
                            'Cache-Control': `max-age=${maxAgeInSeconds}`,
                        })
                    } : {
                        method: 'GET',
                        cache: 'force-cache',
                        credentials: 'omit',
                        headers: new Headers({
                            'Cache-Control': `max-age=${maxAgeInSeconds}`,
                        }),
                    }))
                    .then((response) => {

                        let fetchStop = Date.now();
                        // const dd = fetchStop - fetchStart;
                        // dd (cache) = {min: 1, max: 8, avg: 3.7}
                        // dd (normal) = {min: 136, max: 316, avg: 162.62}

                        // ss.push(dd)
                        // ss.maxValue = Math.max(...ss);
                        // ss.minValue = Math.min(...ss);
                        // ss.avgValue = sum(ss)/ss.length;
                        // console.log(dd)
                        // console.log(ss)
                        previousIsCache = (fetchStop - fetchStart) < (3.7 + 162.62) / 2;
                        UU.log(`${response.status}: ${response.url}`)
                        // UU.log(response)
                        if (response.ok === true) {
                            unlock();
                            return response.json()
                        }
                        if (response.status === 503) {
                            return new Promise(r => setTimeout(r, 270 + rd)).then(() => {
                                unlock();
                                return getScriptData(id, true);
                            });
                        }
                        if (response.status === 404) {
                            // script XXXX has been reported and is pending review by a moderator.
                            unlock();
                            return null
                        }
                        console.warn(response.status, response);
                        new Promise(r => setTimeout(r, 470)).then(unlock); // reload later
                    })
                    .then((data) => resolve(data))
                    .catch((e) => {
                        unlock();
                        UU.log(id, url)
                        console.warn(e)
                        // reject(e)
                    })

            })).catch(() => { })

        });
    }

    /**
     * Get user data from Greasy Fork API
     *
     * @param {string} userID User ID
     * @returns {Promise} User data
     */
    const getUserData = (userID, noCache) => {

        if (!(userID >= 0)) return Promise.resolve()

        const url = `https://${window.location.hostname}/users/${userID}.json`;
        return new Promise((resolve, reject) => {


            networkMP2 = networkMP2.then(() => new Promise(unlock => {

                const maxAgeInSeconds = 900;
                const rd = Math.floor(Math.random() * 80 + 80);

                new Promise(r => setTimeout(r, rd))
                    .then(() => fetch(url, noCache ? {
                        method: 'GET',
                        cache: 'reload',
                        credentials: 'omit',
                        headers: new Headers({
                            'Cache-Control': `max-age=${maxAgeInSeconds}`,
                        })
                    } : {
                        method: 'GET',
                        cache: 'force-cache',
                        credentials: 'omit',
                        headers: new Headers({
                            'Cache-Control': `max-age=${maxAgeInSeconds}`,
                        }),
                    }))
                    .then((response) => {
                        UU.log(`${response.status}: ${response.url}`)
                        if (response.ok === true) {
                            unlock();
                            return response.json()
                        }
                        if (response.status === 503) {
                            return new Promise(r => setTimeout(r, 270 + rd)).then(() => {
                                unlock();
                                return getUserData(userID, true); // reload later
                            });
                        }
                        if (response.status === 404) {
                            // user XXXX has been reported and is pending review by a moderator. ????
                            unlock();
                            return null
                        }
                        console.warn(response.status, response);
                        new Promise(r => setTimeout(r, 470)).then(unlock);
                    })
                    .then((data) => resolve(data))
                    .catch((e) => {
                        setTimeout(() => {
                            unlock()
                        }, 270)
                        UU.log(userID, url)
                        console.warn(e)
                        // reject(e)
                    })



            })).catch(() => { })

        });
    }
    const getTotalInstalls = (data) => {
        if (!data || !data.scripts) return;
        return new Promise((resolve, reject) => {
            const totalInstalls = [];

            data.scripts.forEach((element) => {
                totalInstalls.push(parseInt(element.total_installs, 10));
            });

            resolve(totalInstalls.reduce((a, b) => a + b, 0));
        });
    };


    const communicationId = WinComm.newCommunicationId();
    const wincomm = WinComm.createInstance(communicationId);


    const isInstalled = (script) => {
        return new Promise((resolve, reject) => {

            promiseScriptCheck.then(d => {

                if (!d) return null;

                const data = d.data;
                const al = data.type % 10;
                if (al === 0) {
                    // no namespace
                    resolve([null, script.name, '']);
                } else if (al === 1) {
                    // namespace

                    if (!script.namespace) {

                        getScriptData(script.id).then((script) => {
                            resolve([null, script.name, script.namespace]);
                        });

                    } else {

                        resolve([null, script.name, script.namespace]);
                    }

                }


            })


        }).then((res) => {


            return new Promise((resolve, reject) => {

                if (!res) return '';


                const [_, name, namespace] = res;
                wincomm.request('installedVersion.req', {
                    name,
                    namespace
                }).then(d => {
                    resolve(d.data.version)
                })

            })

        })

        /*
        const external = unsafeWindow.external;
        const scriptHandler = GM.info.scriptHandler;
        if (external && external.Violentmonkey && (scriptHandler || 'Violentmonkey') === 'Violentmonkey') {
          external.Violentmonkey.isInstalled(name, namespace).then((data) => resolve(data));
          return;
        }

        if (external && external.Tampermonkey && (scriptHandler || 'Tampermonkey') === 'Tampermonkey') {
          external.Tampermonkey.isInstalled(name, namespace, (data) => {
            (data.installed) ? resolve(data.version) : resolve();
          });
          return;
        }
        */


    };

    const compareVersions = (v1, v2) => {
        if (!v1 || !v2) return NaN;
        if (v1 === null || v2 === null) return NaN;
        if (v1 === v2) return 0;

        const sv1 = v1.split('.').map((index) => parseInt(index));
        const sv2 = v2.split('.').map((index) => parseInt(index));

        for (let index = 0; index < Math.max(sv1.length, sv2.length); index++) {
            if (isNaN(sv1[index]) || isNaN(sv2[index])) return NaN;
            if (sv1[index] > sv2[index]) return 1;
            if (sv1[index] < sv2[index]) return -1;
        }

        return 0;
    };


    /**
     * Return label for the hide script button
     *
     * @param {boolean} hidden Is hidden
     * @returns {string} Label
     */
    const blockLabel = (hidden) => {
        return hidden ? (locales[lang] ? locales[lang].notHide : locales.en.notHide) : (locales[lang] ? locales[lang].hide : locales.en.hide)
    }

    /**
     * Return label for the install button
     *
     * @param {number} update Update value
     * @returns {string} Label
     */
    const installLabel = (update) => {
        switch (update) {
            case 0: {
                return locales[lang] ? locales[lang].reinstall : locales.en.reinstall
            }
            case 1: {
                return locales[lang] ? locales[lang].update : locales.en.update
            }
            case -1: {
                return locales[lang] ? locales[lang].downgrade : locales.en.downgrade
            }
            default: {
                return locales[lang] ? locales[lang].install : locales.en.install
            }
        }
    }

    const hideBlacklistedScript = (element, list) => {
        if (!element) return;
        const scriptLink = element.querySelector('.script-link')

        const name = scriptLink ? scriptLink.textContent : '';
        const descriptionElem = element.querySelector('.script-description')
        const description = descriptionElem ? descriptionElem.textContent : '';

        if (!name) return;

        switch (list) {
            case 'nonLatins':
                if ((nonLatins.test(name) || nonLatins.test(description)) && !element.classList.contains('blacklisted')) {
                    element.classList.add('blacklisted', 'non-latins');
                    if (gmc.get('hideBlacklistedScripts') && gmc.get('debugging')) {
                        let scriptLink = element.querySelector('.script-link');
                        if (scriptLink) { scriptLink.textContent += ' (non-latin)'; }
                    }
                }
                break;
            case 'blacklist':
                if (isBlackList(name, description) && !element.classList.contains('blacklisted')) {
                    element.classList.add('blacklisted', 'blacklist');
                    if (gmc.get('hideBlacklistedScripts') && gmc.get('debugging')) {
                        let scriptLink = element.querySelector('.script-link');
                        if (scriptLink) { scriptLink.textContent += ' (blacklist)'; }
                    }
                }
                break;
            case 'customBlacklist': {
                const customBlacklist = customBlacklistRE;
                if (customBlacklist && (customBlacklist.test(name) || customBlacklist.test(description)) && !element.classList.contains('blacklisted')) {
                    element.classList.add('blacklisted', 'custom-blacklist');
                    if (gmc.get('hideBlacklistedScripts') && gmc.get('debugging')) {
                        let scriptLink = element.querySelector('.script-link');
                        if (scriptLink) { scriptLink.textContent += ' (custom-blacklist)'; }
                    }
                }
                break;
            }
            default:
                UU.log('No blacklists');
                break;
        }
    };

    const hideHiddenScript = (element, id, list) => {
        id = +id;
        if (!(id >= 0)) return;

        const isInHiddenList = () => hiddenList.indexOf(id) !== -1;
        const updateScriptLink = (shouldHide) => {
            if (gmc.get('hideHiddenScript') && gmc.get('debugging')) {
                let scriptLink = element.querySelector('.script-link');
                if (scriptLink) {
                    if (shouldHide) {
                        scriptLink.innerHTML += ' (hidden)';
                    } else {
                        scriptLink.innerHTML = scriptLink.innerHTML.replace(' (hidden)', '');
                    }
                }
            }
        };

        // Check for initial state and set it
        if (isInHiddenList()) {
            element.classList.add('hidden');
            updateScriptLink(true);
        }

        // Add button to hide the script
        const insertButtonHTML = (selector, html) => {
            const target = element.querySelector(selector);
            if (!target) return;
            let p = document.createElement('template');
            p.innerHTML = html;
            target.parentNode.insertBefore(p.content.firstChild, target.nextSibling);
        };

        const isHidden = element.classList.contains('hidden');
        const blockButtonHTML = `<span class=block-button role=button style-16377>${blockLabel(isHidden)}</span>`;
        const blockButtonHeaderHTML = `<span class=block-button role=button style-77329 style="">${blockLabel(isHidden)}</span>`;

        insertButtonHTML('.badge-js, .badge-css', blockButtonHTML);
        insertButtonHTML('header h2', blockButtonHeaderHTML);

        // Add event listener
        const button = element.querySelector('.block-button');
        if (button) {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (!isInHiddenList()) {
                    hiddenList.push(id);
                    GM.setValue('hiddenList', hiddenList);

                    element.classList.add('hidden');
                    updateScriptLink(true);

                } else {
                    const index = hiddenList.indexOf(id);
                    hiddenList.splice(index, 1);
                    GM.setValue('hiddenList', hiddenList);

                    element.classList.remove('hidden');
                    updateScriptLink(false);
                }

                const blockBtn = element.querySelector('.block-button');
                if (blockBtn) blockBtn.textContent = blockLabel(element.classList.contains('hidden'));
            });
        }
    };

    const insertButtonHTML = (element, selector, html) => {
        const target = element.querySelector(selector);
        if (!target) return;
        let p = document.createElement('template');
        p.innerHTML = html;
        let button = p.content.firstChild
        target.parentNode.insertBefore(button, target.nextSibling);
        return button;
    };

    const addInstallButton = (element, url) => {
        return setupInstallLink(insertButtonHTML(element, '.badge-js, .badge-css', `<a class="install-link" href="${url}" style-54998></a>`));
    };

    async function digestMessage(message, algo) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await crypto.subtle.digest(algo, data);
        return hash;
    }

    function qexString(buffer) {
        const byteArray = new Uint8Array(buffer);
        const len = byteArray.length;
        const hexCodes = new Array(len * 2);
        const chars = 'a4b3c5d7e6f9h2t';
        for (let i = 0, j = 0; i < len; i++) {
            const byte = byteArray[i];
            hexCodes[j++] = chars[byte >> 4];
            hexCodes[j++] = chars[byte & 0x0F];
        };
        return hexCodes.join('');
    }

    const encodeFileName = (s) => {
        if (!s || typeof s !== 'string') return s;
        s = s.replace(/[.!~*'"();\/\\?@&=$,#]/g, '-').replace(/\s+/g, ' ');
        return encodeURI(s);
    }

    const isLibraryURLWithVersion = (url) => {
        if (!url || typeof url !== 'string') return;

        if (url.includes('.js?version=')) return true;

        if (/\/scripts\/\d+\/\d+\/[^.!~*'"();\/\\?@&=$,#]+\.js/.test(url)) return true;
        return false;

    }

    const showInstallButton = async (scriptID, element) => {

        // if(document.querySelector(`li[data-script-id="${scriptID}"]`))
        let _baseScript = null;
        if (element.nodeName === 'LI' && element.hasAttribute('data-script-id') && element.getAttribute('data-script-id') === `${scriptID}` && element.getAttribute('data-script-language') === 'js') {

            const version = element.getAttribute('data-script-version') || ''

            let scriptCodeURL = element.getAttribute('data-code-url');
            if (!scriptCodeURL || !isVaildURL(scriptCodeURL)) {

                const name = element.getAttribute('data-script-name') || ''
                // if (!/[^\x00-\x7F]/.test(name)) {

                // const scriptName = useHashedScriptName ? qexString(await digestMessage(`${+scriptID} ${version}`, 'SHA-1')).substring(0, 8) : encodeURI(name);
                // const token = useHashedScriptName ? `${scriptName.substring(0, 2)}${scriptName.substring(scriptName.length - 2, scriptName.length)}` : String.fromCharCode(Date.now() % 26 + 97) + Math.floor(Math.random() * 19861 + 19861).toString(36);
                const scriptFilename = element.getAttribute('data-script-type') === 'library' ? `${encodeFileName(name)}.js` : `${encodeFileName(name)}.user.js`;
                // const scriptFilename = `${scriptName}.user.js`;

                // code_url: `https://${location.hostname}/scripts/${scriptID}-${token}/code/${scriptFilename}`,
                // code_url: `https://update.${location.hostname}/scripts/${scriptID}.user.js`,
                scriptCodeURL = `https://update.${location.hostname}/scripts/${scriptID}/${scriptFilename}`
            }
            _baseScript = {
                id: +scriptID,
                // name: name,
                code_url: scriptCodeURL,
                version: version
            }
            // }

        }

        const baseScript = _baseScript || (await getScriptData(scriptID));

        if ((element.nodeName === 'LI' && element.getAttribute('data-script-type') === 'library') || (baseScript.code_url.includes('.js?version='))) {

            let scriptCodeURL = element.getAttribute('data-code-url');

            if (!scriptCodeURL || !isVaildURL(scriptCodeURL)) {
                const script = baseScript.code_url.includes('.js?version=') ? baseScript : (await getScriptData(scriptID));
                scriptCodeURL = script.code_url;
            }

            if (scriptCodeURL && isLibraryURLWithVersion(scriptCodeURL)) {


                const code_url = fixLibraryCodeURL(scriptCodeURL);

                const button = addInstallButton(element, code_url);
                button.textContent = `Copy URL`;
                button.addEventListener('click', function (evt) {

                    const target = (evt || 0).target;
                    if (!target) return;

                    let a = target.nodeName === 'A' ? target : target.querySelector('a[href]');

                    if (!a) return;
                    let href = target.getAttribute('href');
                    if (!href) return;

                    evt.preventDefault();

                    copyText(href);


                });

            }


        } else {


            if (!baseScript || !baseScript.code_url || !baseScript.version) return;
            const button = addInstallButton(element, baseScript.code_url);
            button.classList.add('install-status-checking');
            button.textContent = `${installLabel()} ${baseScript.version}`;
            const script = baseScript && baseScript.name && baseScript.namespace ? baseScript : (await getScriptData(scriptID));
            if (!script) return;

            const installed = await isInstalled(script);
            const version = (
                baseScript.version && script.version && compareVersions(baseScript.version, script.version) === 1
            ) ? baseScript.version : script.version;

            const update = compareVersions(version, installed);  // NaN  1  -1  0
            const label = installLabel(update);
            button.textContent = `${label} ${version}`;
            button.classList.remove('install-status-checking');


        }

    }


    const foundScriptList = async (scriptList) => {

        let rid = 0;
        let g = () => {
            if (!scriptList || scriptList.isConnected !== true) return;

            const scriptElements = scriptList.querySelectorAll('li[data-script-id]:not([e8kk])');

            for (const element of scriptElements) {
                element.setAttribute('e8kk', '1');

                const scriptID = +element.getAttribute('data-script-id');
                if (!(scriptID > 0)) continue;

                // blacklisted scripts
                if (gmc.get('nonLatins')) hideBlacklistedScript(element, 'nonLatins');
                if (gmc.get('blacklist')) hideBlacklistedScript(element, 'blacklist');
                if (gmc.get('customBlacklist')) hideBlacklistedScript(element, 'customBlacklist');

                // hidden scripts
                if (gmc.get('hideHiddenScript')) hideHiddenScript(element, scriptID, true);

                // install button
                if (gmc.get('showInstallButton')) {
                    showInstallButton(scriptID, element)
                }
            }

        }
        let f = (entries) => {
            const tid = ++rid
            if (entries && entries.length) requestAnimationFrame(() => {
                if (tid === rid) g();
            });
        }
        let mo = new MutationObserver(f);
        mo.observe(scriptList, { subtree: true, childList: true });

        g();

    }

    let promiseScriptCheckResolve = null;
    const promiseScriptCheck = new Promise(resolve => {
        promiseScriptCheckResolve = resolve
    });

    const milestoneNotificationFn = async (o) => {

        const { userLink, userID } = o;


        const milestones = gmc.get('milestoneNotification').replace(/\s/g, '').split(',').map(Number);

        if (!userID) return;

        const userData = await getUserData(+userID.match(/\d+(?=\D)/g));
        if (!userData) return;

        const [totalInstalls, lastMilestone] = await Promise.all([
            getTotalInstalls(userData),
            GM.getValue('lastMilestone', 0)]);

        const milestone = milestones.filter(milestone => totalInstalls >= milestone).pop();

        UU.log(`total installs are "${totalInstalls}", milestone reached is "${milestone}", last milestone reached is "${lastMilestone}"`);

        if (milestone <= lastMilestone) return;

        if (milestone && milestone >= 0) {


            GM.setValue('lastMilestone', milestone);

            const lang = document.documentElement.lang;
            const text = (locales[lang] ? locales[lang].milestone : locales.en.milestone).replace('$1', milestone.toLocaleString());

            if (typeof GM.notification === 'function') {
                GM.notification({
                    text,
                    title: GM.info.script.name,
                    image: logo,
                    onclick: () => {
                        window.location = `https://${window.location.hostname}${userID}#user-script-list-section`;
                    }
                });
            } else {
                UU.alert(text);
            }

        }

    }
    const onReady = async () => {

        try {

            const gminfo = GM.info || 0;
            if (gminfo) {

                const gminfoscript = gminfo.script || 0;


                const scriptHandlerObject = {
                    scriptHandler: gminfo.scriptHandler || '',
                    scriptName: gminfoscript.name || '', // not name_i18n
                    scriptVersion: gminfoscript.version || '',
                    scriptNamespace: gminfoscript.namespace || '',
                    communicationId
                };


                wincomm.hook('_$GreasyFork$Msg$OnScriptInstallFeedback',
                    {

                        ready: (d, evt) => promiseScriptCheckResolve(d),
                        userScriptManagerNotDetected: (d, evt) => promiseScriptCheckResolve(null),
                        'installedVersion.res': wincomm.handleResponse


                    })


                document.head.appendChild(document.createElement('script')).textContent = `;(${mWindow.contentScriptText})(${JSON.stringify(scriptHandlerObject)}, ${WinComm.createInstance});`;


            }


            addSettingsToMenu();


            setTimeout(() => {
                let installBtn = document.querySelector('a[data-script-id][data-script-version]')
                let scriptID = installBtn && installBtn.textContent ? +installBtn.getAttribute('data-script-id') : 0;
                if (scriptID > 0) {
                    getScriptData(scriptID, true);
                } else {


                    const userLink = document.querySelector('#site-nav .user-profile-link a[href]');
                    let userID = userLink ? userLink.getAttribute('href') : '';

                    userID = userID ? /users\/(\d+)/.exec(userID) : null;
                    if (userID) userID = userID[1];
                    if (userID) {
                        userID = +userID;
                        if (userID > 0) {
                            getUserData(userID, true);
                        }
                    }


                }
            }, 740);

            const userLink = document.querySelector('.user-profile-link a[href]');
            const userID = userLink ? userLink.getAttribute('href') : undefined;

            UU.addStyle(mWindow.pageCSS);
            // blacklisted scripts / hidden scripts / install button
            if (window.location.pathname !== userID && !/discussions/.test(window.location.pathname) && (gmc.get('hideBlacklistedScripts') || gmc.get('hideHiddenScript') || gmc.get('showInstallButton'))) {

                const scriptList = document.querySelector('.script-list');
                if (scriptList) {
                    foundScriptList(scriptList);
                } else {
                    const timeout = Date.now() + 3000;
                    /** @type {MutationObserver | null} */
                    let mo = null;
                    const mutationCallbackForScriptList = () => {
                        if (!mo) return;
                        const scriptList = document.querySelector('.script-list');
                        if (scriptList) {
                            mo.disconnect();
                            mo.takeRecords();
                            mo = null;
                            foundScriptList(scriptList);
                        } else if (Date.now() > timeout) {
                            mo.disconnect();
                            mo.takeRecords();
                            mo = null;
                        }
                    }
                    mo = new MutationObserver(mutationCallbackForScriptList);
                    mo.observe(document, { subtree: true, childList: true });
                }


                // hidden scripts on details page
                const installLinkElement = document.querySelector('#script-info .install-link[data-script-id]');
                setupInstallLink(installLinkElement);
                if (gmc.get('hideHiddenScript') && installLinkElement) {
                    const id = +installLinkElement.getAttribute('data-script-id');
                    hideHiddenScript(document.querySelector('#script-info'), id, false);
                }

                // add options and style for blacklisted/hidden scripts
                if (gmc.get('hideBlacklistedScripts') || gmc.get('hideHiddenScript')) {
                    addOptions();
                }

                if (installLinkElement && location.pathname.includes('/scripts/')) {

                    installLinkElement.addEventListener('click', async function (e) {
                        if (e && e.isTrusted && location.pathname.includes('/scripts/')) {

                            await new Promise(r => setTimeout(r, 800));
                            await new Promise(r => window.requestAnimationFrame(r));
                            await new Promise(r => setTimeout(r, 100));
                            document.dispatchEvent(new Event("DOMContentLoaded"));
                        }
                    })
                }
            }

            // total installs
            if (gmc.get('showTotalInstalls') && document.querySelector('#user-script-list')) {
                const dailyInstalls = [];
                const totalInstalls = [];

                const dailyInstallElements = document.querySelectorAll('#user-script-list li dd.script-list-daily-installs');
                for (const element of dailyInstallElements) {
                    dailyInstalls.push(parseInt(element.textContent.replace(/\D/g, ''), 10));
                }

                const totalInstallElements = document.querySelectorAll('#user-script-list li dd.script-list-total-installs');
                for (const element of totalInstallElements) {
                    totalInstalls.push(parseInt(element.textContent.replace(/\D/g, ''), 10));
                }

                const dailyInstallsSum = dailyInstalls.reduce((a, b) => a + b, 0);
                const totalInstallsSum = totalInstalls.reduce((a, b) => a + b, 0);

                const convertLi = (li) => {

                    if (!li) return null;
                    const a = li.firstElementChild
                    if (a === null) return li;
                    if (a === li.lastElementChild && a.nodeName === 'A') return a;


                    return null;
                }

                const plusSign = document.querySelector('#user-script-list-section a[rel="next"][href*="page="], #user-script-list-section a[rel="prev"][href*="page="]') ? '+' : '';

                const dailyOption = convertLi(document.querySelector('#script-list-sort .list-option:nth-child(1)'));
                dailyOption && dailyOption.insertAdjacentHTML('beforeend', `<span> (${dailyInstallsSum.toLocaleString()}${plusSign})</span>`);

                const totalOption = convertLi(document.querySelector('#script-list-sort .list-option:nth-child(2)'));
                totalOption && totalOption.insertAdjacentHTML('beforeend', `<span> (${totalInstallsSum.toLocaleString()}${plusSign})</span>`);
            }

            // milestone notification
            if (gmc.get('milestoneNotification')) {
                milestoneNotificationFn({ userLink, userID });
            }

            if (isScriptFirstUse) GM.setValue('firstUse', false).then(() => {
                gmc.open();
            });

            if (fixLibraryScriptCodeLink) {


                let xpath = "//code[contains(text(), '.js?version=') or contains(text(), '// @require https://update.greasyfork.org/scripts/')]";
                let snapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                for (let i = 0; i < snapshot.snapshotLength; i++) {
                    let element = snapshot.snapshotItem(i);
                    if (element.firstElementChild) continue;
                    element.textContent = element.textContent.replace(/\bhttps:\/\/(greasyfork|sleazyfork)\.org\/scripts\/\d+\-[^\/]+\/code\/[^\.]+\.js\?version=\d+\b/, (_) => {
                        return fixLibraryCodeURL(_);
                    });
                    element.parentNode.insertBefore(document.createTextNode('\u200B'), element);
                    element.style.display = 'inline-flex';
                    setClickToSelect(element);
                }


            }




            if (addAdditionInfoLengthHint && location.pathname.includes('/scripts/') && location.pathname.includes('/versions')) {

                function contentLength(text) {
                    return text.replace(/\n/g, '  ').length;
                }
                function contentLengthMax() {
                    return 50000;
                }
                let _spanContent = null;
                function updateText(ainfo, span) {
                    const value = ainfo.value;
                    if (typeof value !== 'string') return;

                    if (_spanContent !== value) {
                        _spanContent = value;
                        span.textContent = `Text Length: ${contentLength(value)} / ${contentLengthMax()}`;


                    }
                }
                function onChange(evt) {
                    let ainfo = (evt || 0).target;
                    if (!ainfo) return;
                    let span = ainfo.parentNode.querySelector('.script-version-ainfo-span');
                    if (!span) return;

                    updateText(ainfo, span);

                }
                function kbEvent(evt) {
                    Promise.resolve().then(() => {
                        onChange(evt);

                    })
                }
                for (const ainfo of document.querySelectorAll('textarea[id^="script-version-additional-info"]')) {
                    let span = document.createElement('span');
                    span.classList.add('script-version-ainfo-span');
                    ainfo.addEventListener('change', onChange, false);
                    ainfo.addEventListener('keydown', kbEvent, false);
                    ainfo.addEventListener('keypress', kbEvent, false);
                    ainfo.addEventListener('keyup', kbEvent, false);
                    updateText(ainfo, span);
                    ainfo.parentNode.insertBefore(span, ainfo.nextSibling);


                }


            }

        } catch (e) {
            console.log(e);
        }



    }




    Promise.resolve().then(() => {
        if (document.readyState !== 'loading') {
            onReady();
        } else {
            window.addEventListener("DOMContentLoaded", onReady, false);
        }
    });

})();
