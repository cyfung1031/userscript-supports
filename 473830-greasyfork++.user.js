// ==UserScript==
// @name               Greasy Fork++
// @namespace          https://github.com/iFelix18
// @version            3.3.7
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
// @match              *://cn-greasyfork.org/*
// @match              *://api.greasyfork.org/*
// @match              *://api.sleazyfork.org/*
// @match              *://api.cn-greasyfork.org/*
// @connect            greasyfork.org
// @connect            sleazyfork.org
// @connect            cn-greasyfork.org
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

/* ---- updated filter ---- */

// reference1: Greasy Fork+
// reference2: https://greasyfork.org/scripts/12179 and https://greasyfork.org/scripts/13514

const filters = {
    // NonASCII: /[^\x00-\x7F\s]+/,
    NonLatin: /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/gu,        //  /[^\u0000-\u024F\u2000-\u214F\s]+/
    Rules: [
        // ----------- game1 -----------
        /[^a-zA-Z](Aimbot|AntiGame|Agar|agar\.?io|agma\.?io|alis\.io|angel\.io|ExtencionRipXChetoMalo|AposBot|DFxLite|ZTx-Lite|AposFeedingBot|AposLoader|Balz|Blah Blah|Orc Clan Script|Astro\s*Empires|^\s*Attack|^\s*Battle|BiteFight|Blood\s*Wars|Bloble|Bonk|Bots|Bots4|Brawler|\bBvS\b|Business\s*Tycoon|Castle\s*Age|City\s*Ville|chopcoin\.io|Comunio|Conquer\s*Club|CosmoPulse|cursors\.io|Dark\s*Orbit|Dead\s*Frontier|Diep\.io|\bDOA\b|doblons\.io|DotD|Dossergame|Dragons\s*of\s*Atlantis|driftin\.io|Dugout|\bDS[a-z]+\n|elites\.io|Empire\s*Board|eRep(ublik)?|Epicmafia|Epic.*War|ExoPlanet|Falcon Tools|Feuerwache|Farming|FarmVille|Fightinfo|Frontier\s*Ville|Ghost\s*Trapper|Gladiatus|Goalline|Gondal|gota\.io|Grepolis|Hobopolis|\bhwm(\b|_)|Ikariam|\bIT2\b|Jellyneo|Kapi\s*Hospital|Kings\s*Age|Kingdoms?\s*of|knastv(o|oe)gel|Knight\s*Fight|\b(Power)?KoC(Atta?ck)?\b|\bKOL\b|Kongregate|Krunker|Last\s*Emperor|Legends?\s*of|Light\s*Rising|lite\.ext\.io|Lockerz|\bLoU\b|Mafia\s*(Wars|Mofo)|Menelgame|Mob\s*Wars|Mouse\s*Hunt|Molehill\s*Empire|MooMoo|MyFreeFarm|narwhale\.io|Neopets|NeoQuest|Nemexia|\bOGame\b|Ogar(io)?|Pardus|Pennergame|Pigskin\s*Empire|PlayerScripts|pokeradar\.io|Popmundo|Po?we?r\s*(Bot|Tools)|PsicoTSI|Ravenwood|Schulterglatze|Skribbl|slither\.io|slitherplus\.io|slitheriogameplay|SpaceWars|splix\.io|Survivio|\bSW_[a-z]+\n|\bSnP\b|The\s*Crims|The\s*West|torto\.io|Travian|Treasure\s*Isl(and|e)|Tribal\s*Wars|TW.?PRO|Vampire\s*Wars|vertix\.io|War\s*of\s*Ninja|World\s*of\s*Tanks|West\s*Wars|wings\.io|\bWoD\b|World\s*of\s*Dungeons|wtf\s*battles|Wurzelimperium|Yohoho|Zombs)[^a-zA-Z]/iu,
        // ----------- game2 -----------
        /\bagar(\.?io)?\b|\bagma(\.?io)?\b|\baimbot\b|\barras(\.?io)?\b|\bbots?\b|\bbubble(\.?am)?\b|\bcheats?\b|\bdiep(\.?io)?\b|\bfreebitco(\.?in)?\b|\bgota(\.?io)?\b|\bhacks?\b|\bkrunker(\.?io)?\b|\blostworld(\.?io)?\b|\bmoomoo(\.?io)?\b|\broblox(\.com)?\b|\bshell\sshockers\b|\bshellshock(\.?io)?\b|\bshellshockers\b|\bskribbl(\.?io)?\b|\bslither(\.?io)?\b|\bsurviv(\.?io)?\b|\btaming(\.?io)?\b|\bvenge(\.?io)?\b|\bvertix(\.?io)?\b|\bzombs(\.?io)?\b/iu
        // ----------- Social Networks -----------
        // /Face\s*book|Google(\+| Plus)|\bHabbo|Kaskus|\bLepra|Leprosorium|MySpace|meinVZ|odnoklassniki|Одноклассники|Orkut|sch(ue|ü)ler(VZ|\.cc)?|studiVZ|Unfriend|Valenth|VK|vkontakte|ВКонтакте|Qzone|Twitter|TweetDeck/iu,
        // ----------- Clutter -----------
        // /^\s*(.{1,3})\1+\n|^\s*(.+?)\n+\2\n*$|^\s*.{1,5}\n|do\s*n('|o)?t (install|download)|nicht installieren|(just )?(\ban? |\b)test(ing|s|\d|\b)|^\s*.{0,4}test.{0,4}\n|\ntest(ing)?\s*|^\s*(\{@|Smolka|Hacks)|\[\d{4,5}\]|free\s*download|theme|(night|dark) ?(mode)?/iu
    ],
};

/* ---- updated filter ---- */

/* global GM_config, VM, GM, WinComm */

const isInIframe = window !== top;

/**
 * @typedef { typeof import("./library/WinComm.js")  } WinComm
 */

// console.log(GM)

/** @type {WinComm} */
const WinComm = this.WinComm;

//  -------- UU Fucntion - original code: https://fastly.jsdelivr.net/npm/@ifelix18/utils@6.5.0/lib/index.min.js  --------
// optimized by CY Fung to remove $ dependency and observe creation
const UU = isInIframe || (function () {
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


const mWindow = isInIframe || (() => {


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
        hideRecentUsersWithin: {
            label: 'Hide Recent Users:<br><span>Hide new regeistered users within the last N hours - to avoid seeing comments from spam accounts</span>',
            labelPos: 'left',
            type: 'text',
            title: 'Number only. 0 means disabled. maximum is 168. (Suggested value: 48)',
            default: '0',
            size: 150
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
        #greasyfork-plus_milestoneNotification_var[class],
        #greasyfork-plus_hideRecentUsersWithin_var[class]{
            flex-direction:column;
            margin-left:21px;
        }

        #greasyfork-plus_customBlacklist_var[class]::before,
        #greasyfork-plus_hiddenList_var[class]::before,
        #greasyfork-plus_milestoneNotification_var[class]::before,
        #greasyfork-plus_hideRecentUsersWithin_var[class]::before{
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

         .discussion-list .hidden {
            display: none;
         }

         /* Greasy Fork Empty Ad Block */
        .ethical-ads-text[class]:empty {
            min-height: unset;
        }


        /* additional css */

        .discussion-item-by-recent-user{
            opacity: 0.2;
        }

        .discussion-list-item {
            position: relative;
        }

        .discussion-list-item .discussion-meta .discussion-meta-item{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            gap: 4px;

        }

        .discussion-list-item .discussion-meta .discussion-meta-item:last-of-type .discussion-meta-item{
            justify-content: end;
        }

        .discussion-list-item .discussion-title{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;

        }
        a.discussion-list-item-report-comment[class] {
            all: reset;
            position: relative;
            margin: 0 0 0 0;
            background: inherit;
            color: inherit;
            border: 0;
            opacity: 0.8;
            text-decoration: none;
            font-size: 100%;
        }
        a.discussion-list-item-report-comment[class]:hover {
            opacity: 1.0;
            text-decoration: underline;
        }

        .discussion-meta-item-script-name + .discussion-meta-item {
            display: inline-flex;
            flex-direction: row;
            gap: 4px;
            align-items: center;
            justify-content: flex-start;
            justify-items: center;
        }

        li[data-script-id] .install-link[class] {
            border-radius: 0;
            opacity: 0.8;
            cursor: pointer;
            display: inline-flex;
            white-space: nowrap;
            position: relative;
            z-index: 99;
        }

        li[data-script-id] .install-link[class]:hover {
            opacity: 1.0;
            cursor: pointer;
            display: inline-flex;
            white-space: nowrap;
        }

        .discussion-list-item span.discussion-snippet[class] {
            text-overflow: ellipsis;
            overflow: hidden;
        }

        div#script-list-cd[id]{
            /* all: revert; */
            padding: initial;
            width: initial;
            margin: initial;
        }

    `

    const window = {};

    /** @param {typeof WinComm.createInstance} createInstance */
    function contentScriptText(shObject, createInstance) {

        // avoid setupEthicalAdsFallback looping
        if (typeof window.ethicalads === "undefined") {
            const p = Promise.resolve([]);
            window.ethicalads = { wait: p };
        }

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
        }

        const { scriptName, scriptVersion, scriptNamespace, communicationId } = shObject;
        let scriptHandler = shObject.scriptHandler;

        const wincomm = createInstance(communicationId);

        const external = window.external;

        if (external[scriptHandler]) 1;
        else if (external && external.Violentmonkey && (scriptHandler || 'Violentmonkey') === 'Violentmonkey') scriptHandler = 'Violentmonkey';
        else if (external && external.Tampermonkey && (scriptHandler || 'Tampermonkey') === 'Tampermonkey') scriptHandler = 'Tampermonkey';
        else if (external && external.Scriptcat && (scriptHandler || 'ScriptCat') === 'ScriptCat') scriptHandler = 'Scriptcat';

        const manager = external[scriptHandler];

        if (!manager) {

            wincomm.send('userScriptManagerNotDetected', {
                code: 1
            });
            return;

        }

        const promiseWrap = (x) => {
            // bug in FireFox + Violentmonkey
            if (typeof (x || 0) === 'object' && typeof x.then === 'function') return x; else return Promise.resolve(x);
        };


        const pnIsInstalled2 = (type, scriptName, scriptNamespace) => new Promise((resolve, reject) => {
            const resultPr = promiseWrap(manager.isInstalled(scriptName, scriptNamespace));
            resultPr.then((result) => resolve({
                type,
                result: typeof result === 'string' ? { version: result } : result
            })).catch(reject);
        }).catch(console.warn);


        const pnIsInstalled3 = (type, scriptName, scriptNamespace) => new Promise((resolve, reject) => {
            try {
                manager.isInstalled(scriptName, scriptNamespace, (result) => {
                    resolve({
                        type,
                        result: typeof result === 'string' ? { version: result } : result
                    });
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

    }

    return { fields, logo, locales, settingsCSS, pageCSS, contentScriptText }

})();

const inIframeFn = isInIframe ? async () => {
    if (window.name) {
        const uo = new URL(location.href);
        const id38 = uo.searchParams.get('id38');
        if (id38 && `iframe-${id38}` === window.name) {

            const p38 = uo.searchParams.get('p38');
            const h38 = uo.searchParams.get('h38');

            if (`${p38}:` === uo.protocol && `${h38}` === uo.hostname) {
                window.addEventListener('message', (evt)=>{
                    if(evt && evt.data){
                        const {id38: id38_, msg, args, fetchId} = evt.data;
                        if(id38_ === id38){
                            if(msg === 'fetch' && fetchId){
                                const [url, options] = args;
                                if(options && options.headers){
                                    options.headers = new Headers(options.headers);
                                }
                                fetch(url, options).then(async (response) => {
                                    let json = null;
                                    if (response.ok === true) {
                                        try {
                                            json = await response.json();
                                        } catch (e) { }
                                    }
                                    const res = {
                                        status: response.status,
                                        url: response.url,
                                        ok: response.ok,
                                        json
                                    };
                                    evt.source.postMessage({
                                        id38,
                                        fetchId,
                                        msg: 'fetchResponse',
                                        args: [res]
                                    }, '*')
                                })
                            }
                        }
                    }
                });
                top.postMessage({
                    id38: id38,
                    msg: 'ready'
                }, '*');
            }
        }
    }

} : () => { };

inIframeFn() || (async () => {

    const GMA = {}; // compatible with ScriptCat
    const makeAsyncFn = (f) => {
        return async function () {
            return await f();
        };
    }
    for (const key of ['getValue', 'setValue', 'deleteValue']) {
        const f = GM[key];
        if (typeof f === 'function') {
            if (f.constructor.name === 'AsyncFunction') GMA[key] = f;
            else GMA[key] = makeAsyncFn(f);
        }
    }

    let rafPromise = null;

    const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
        requestAnimationFrame(hRes => {
            rafPromise = null;
            resolve(hRes);
        });
    }));

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

    const setupInstallLink = (button) => {
        return button;
    };

    function fixValue(key, def, test) {
        return GMA.getValue(key, def).then((v) => test(v) || GMA.deleteValue(key))
    }

    const isNaNx = Number.isNaN;

    function numberArr(arrVal) {
        if (!arrVal || typeof arrVal.length !== 'number') return [];
        return arrVal.filter(e => typeof e === 'number' && !isNaNx(e))
    }

    const isScriptFirstUse = await GMA.getValue('firstUse', true);
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

    const ruleFn = function (text) {
        /** @type {String[]} */
        const { rules, regExpArr } = this;
        let text0 = text.replace(/\uE084/g, '\uE084x');
        let j = 0;
        for (const rule of rules) {
            let r = false;
            if (!rule.includes('\uE084')) {
                r = (text.toLocaleLowerCase("en-US").includes(rule.toLocaleLowerCase("en-US")));
            } else {
                const s = rule.split(/\uE084(\d+)r/);
                r = s.every((t, i) => {
                    if (t === undefined || t.length === 0) return true;
                    if (i % 2) {
                        return regExpArr[+t].test(text0);
                    } else {
                        return text0.includes(t.trim());
                    }
                });
            }
            if (r) return j;
            j++;
        }
    }

    /** @param {String} txtRule */
    const preprocessRule = (txtRule) => {
        const regExpArr = [];
        txtRule = txtRule.replace(/\uE084/g, '\uE084x');
        let maxCount = 800; // avoid deadloop
        while (maxCount--) {
            const idx1 = txtRule.search(/\bre\//);
            if (idx1 < 0) break;
            const str = txtRule.substring(idx1 + 3);
            let idx2 = -1;
            const searcher = /(.?)\//g;
            let m;
            while (m = searcher.exec(str)) {
                if (m[1] === '\\') continue;
                idx2 = searcher.lastIndex + idx1 + 3;
                break;
            }
            if (idx2 < 0) break;
            const optionStr = txtRule.substring(idx2);
            const optionM = /^[a-z]+/.exec(optionStr);
            const option = optionM ? optionM[0] : '';
            const regexContent = txtRule.substring(idx1 + 2 + 1, idx2 - 1);
            txtRule = `${txtRule.substring(0, idx1)}${('\uE084' + regExpArr.length + 'r')}${txtRule.substring(idx2 + option.length)}`;
            regExpArr.push(new RegExp(regexContent, option));
        }
        const rules = txtRule.split(',').map(e => e.trim());
        return ruleFn.bind({ rules, regExpArr });
    }

    const useHashedScriptName = true;
    const fixLibraryScriptCodeLink = true;
    const addAdditionInfoLengthHint = true;

    const id = 'greasyfork-plus';
    const title = `${GM.info.script.name} v${GM.info.script.version} Settings`;
    const fields = mWindow.fields;
    const logo = mWindow.logo;
    const nonLatins = filters.NonLatin;
    const blacklistRules = filters.Rules;
    const hiddenList = numberArr(await GMA.getValue('hiddenList', []));
    const lang = document.documentElement.lang;
    const locales = mWindow.locales;

    const _isBlackList = (text) => {
        if (!text || typeof text !== 'string') return false;
        if (text.includes('hack') && (text.includes('EXPERIMENT_FLAGS') || text.includes('yt.'))) return false;
        const t = ` ${text} `;
        for (const regexRule of blacklistRules) {
            if (regexRule.test(t)) return true;
        }
        return false;
    }
    const isBlackList = (name, description) => {
        // To be reviewed
        if (!blacklistRules) return false;
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

                const hiddenSet = new Set(numberArr(await GMA.getValue('hiddenList', [])));
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
                    await GMA.setValue('hiddenList', hiddenListStrToArr(forgotten.hiddenList));

                    UU.alert('settings saved');
                    gmc.close();
                    setTimeout(() => window.location.reload(false), 500);
                }
            }
        }
    });
    gmc.initialized = new Promise(r => (gmc.initializedResolve = r));
    await gmc.initialized.then();
    const customBlacklistRF = preprocessRule(gmc.get('customBlacklist') || '');

    const valHideRecentUsersWithin_ = Math.floor(+gmc.get('hideRecentUsersWithin'));
    const valHideRecentUsersWithin = valHideRecentUsersWithin_ > 168 ? 168 : valHideRecentUsersWithin_ > 0 ? valHideRecentUsersWithin_ : 0;

    /**
     * 
     * Inserts element into the sorted array arr while maintaining order based on a comparator.
     * Uses binary search to find the insertion point and then splices the element into the array.
     *
     * @param {Array} arr - The sorted array. (ascending order)
     * @param {number} value - The number to compare.
     * @param {Function} keyFn - Obtain the comparable value of the element.
     */
    function binarySearchLeft(arr, value, keyFn) {
        let left = 0;
        let right = arr.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (keyFn(arr[mid]) < value) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }

    /**
     * Finds the smallest index i such that arr[i][1] >= targetTime.
     * Used to locate the first user in userCreations whose creation time is recent enough.
     *
     * @param {Array} arr - The sorted array. (ascending order)
     * @param {number} targetTime - targetTime
     */
    function findFirstIndex(arr, targetTime) {
        return binarySearchLeft(arr, targetTime, e => e[1]);
    }

    /**
     * Finds the insertion point for element in arr to maintain sorted order.
     * Used to find the range of uncertain requests in networkRequestsRCTake.
     *
     * @param {Array} arr - The sorted array. (ascending order)
     * @param {*} element - The element to be inserted.
     * @param {Function} keyFn - Obtain the comparable value of the element.
     */
    function insertSorted(arr, element, keyFn) {
        const idx = binarySearchLeft(arr, keyFn(element), keyFn);
        arr.splice(idx, 0, element);
        return arr;
    }

    // Assume targetHiddenRecentDateTime is set as Date.now() - valHideRecentUsersWithin * 3600000
    let targetHiddenRecentDateTime = 0;
    let userCreations = [];// [userId, creationTime] sorted by creationTime
    let networkRequestsRC = [];// [userId, processFn, result] sorted by userId
    let recentUserMP = Promise.resolve(0);
    const fetchUserCreations = () => {
        if (sessionStorage.__TMP_userCreations682__) {
            try {
                return JSON.parse(sessionStorage.__TMP_userCreations682__);
                // console.log(388, userCreations);
            } catch (e) {
                console.warn(e);
            }
        }
        return [];
    }
    userCreations = fetchUserCreations();
    
    // Clean up userCreations: merge with sessionStorage and trim
    const cleanupUserCreations = () => {

        // Merge with sessionStorage data
        // in case the record in sessionStorage is modified by other instances as well.
        const stored = fetchUserCreations();
        const currentSet = new Set(userCreations.map(e => e.join(',')));
        const missing = stored.filter(e => !currentSet.has(e.join(',')));
        for (const element of missing) {
            insertSorted(userCreations, element, e => e[1]);
        }

        // Remove redundant old entries
        // since targetHiddenRecentDateTime is expected monotonic increasing, small values are useless in checking.
        let deleteCount = 0;
        for (let i = 0; i < userCreations.length - 1; i++) {
            if (userCreations[i][1] < targetHiddenRecentDateTime && userCreations[i + 1][1] < targetHiddenRecentDateTime) {
                deleteCount++;
            } else {
                break;
            }
        }
        if (deleteCount > 0) {
            deleteCount === 1 ? userCreations.shift() : userCreations.splice(0, deleteCount);
        }

        // Trim to max 16 elements, keeping boundary-relevant entries
        while (userCreations.length > 16) {
            const leftIdx = 1;
            const rightIdx = userCreations.length - 2;
            userCreations = userCreations.filter((e, idx) => ((idx <= leftIdx) || (idx >= rightIdx) || ((idx % 2) === 1)));
        }

        sessionStorage.__TMP_userCreations682__ = JSON.stringify(userCreations);

    };

    // Test if a user is recent using cached data
    const testByUserCreations = (userId, targetTime)=>{
        const idxJ = findFirstIndex(userCreations, targetTime);
        let newFrom = Infinity, oldFrom = 0;
        if (idxJ < userCreations.length) {
            newFrom = userCreations[idxJ][0];
            if (userId >= newFrom) return true; // User is recent
        }
        if (idxJ > 0) {
            oldFrom = userCreations[idxJ - 1][0];
            if (userId <= oldFrom) return false; // User is not recent
        }
        return { newFrom, oldFrom }; // Uncertain, need network request
    }
    
    
    // Select the next network request from the uncertain range
    /** @returns {Promise | null} */
    function networkRequestsRCTake() {
        if (networkRequestsRC.length === 0) return null;

        let oldFrom = 0;
        let newFrom = Infinity;
        if (userCreations.length > 0) {
            const idx = findFirstIndex(userCreations, targetHiddenRecentDateTime);
            if (idx < userCreations.length) newFrom = userCreations[idx][0];
            if (idx > 0) oldFrom = userCreations[idx - 1][0];
        }

        // Find range of requests in uncertain zone (oldFrom < userId < newFrom)

        const left = binarySearchLeft(networkRequestsRC, oldFrom + 1, e => e[0]);
        // Prioritize certain not recent requests (at the beginning)
        if (left > 0) {
            return networkRequestsRC.shift(); // Take the first request (userId <= oldFrom)
        }

        const right = binarySearchLeft(networkRequestsRC, newFrom, e => e[0]);
        // Prioritize certain recent requests (at the end)
        if (right < networkRequestsRC.length) {
            return networkRequestsRC.pop(); // Take the last request (userId >= newFrom)
        }

        // No certain requests left, process an uncertain one
        // The entire remaining array is uncertain (left == 0, right == length)
        const midIdx = Math.floor(networkRequestsRC.length / 2);
        return networkRequestsRC.splice(midIdx, 1)[0];

    }

    // Main function to check if a user is recent
    function determineRecentUserAsync(userId) {
        return new Promise(resolve => {
            // Check cache first
            const initialCheck = testByUserCreations(userId, targetHiddenRecentDateTime);
            if (typeof initialCheck === 'boolean') return resolve(initialCheck);

            // Schedule network request
            const processAsyncFn = async () => {
                const check = testByUserCreations(userId, targetHiddenRecentDateTime);
                // console.log('processAsyncFn', userId, targetHiddenRecentDateTime, check)
                if (typeof check === 'boolean') return resolve(check);
                // console.log('network request', userId)
                const userData = await getUserData(userId, false); // Assume this exists
                if (userData.id !== userId) return resolve(false);
                const creationTime = +new Date(userData.created_at);
                insertSorted(userCreations, [userId, creationTime], e => e[1]);
                resolve(creationTime >= targetHiddenRecentDateTime);
                cleanupUserCreations();
            };

            const request = [userId, processAsyncFn, null];
            insertSorted(networkRequestsRC, request, e => e[0]);

            // Process requests sequentially
            recentUserMP = recentUserMP.then(async () => {
                const entity = networkRequestsRCTake();
                if (entity) await entity[1]();
            });
        });
    }

    if (typeof GM.registerMenuCommand === 'function') {
        GM.registerMenuCommand('Configure', () => gmc.open());
        GM.registerMenuCommand('Reset Everything', () => {
            Promise.all([
                GMA.deleteValue('hiddenList'),
                GMA.deleteValue('lastMilestone'),
                GMA.deleteValue('firstUse')
            ]).then(() => {
                setTimeout(() => window.location.reload(false), 50);
            })
        });
    }

    UU.init({ id, logging: gmc.get('logging') });
    UU.log(nonLatins);
    UU.log(blacklistRules);
    UU.log(hiddenList);

    const _VM = (typeof VM !== 'undefined' ? VM : null) || {
        shortcut: {
            register: () => { }
        }
    };

    const isGPUAccelerationAvailable = (() => {
        // https://gist.github.com/cvan/042b2448fcecefafbb6a91469484cdf8
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    })();

    const runLater = isGPUAccelerationAvailable ? (f) => {
        requestAnimationFrame(f);
    } : (f) => {
        setTimeout(f, 100);
    };

    const mutationRunner = (gn, elm, options) => {
        let rid = 0;
        (new MutationObserver((entries) => {
            if (entries && entries.length >= 1) {
                const tid = rid = (rid & 1073741823) + 1;
                runLater(() => {
                    if (tid === rid) gn();
                });
            }
        })).observe(elm, options);
        gn();
    }


    function fixLibraryCodeURL(code_url) {
        if (/\/scripts\/(\d+)(-[^/]+)\/code\//.test(code_url)) {
            code_url = code_url.replace(/\/scripts\/(\d+)(-[^/]+)\/code\//, '/scripts/$1/code/');
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
            if (`${window.getSelection()}` === "") {
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

    const addOptions = (scriptList) => {
        if (!scriptList) return;
        createListOptionGroup();
        mutationRunner(() => {
            let aBlackList = document.querySelector('#hyperlink-35389');
            let aHidden = document.querySelector('#hyperlink-40361');
            if (!aBlackList || !aHidden) return;
            aBlackList.textContent = `Blacklisted scripts (${document.querySelectorAll('.script-list li.blacklisted').length})`;
            aHidden.textContent = `Hidden scripts (${document.querySelectorAll('.script-list li.hidden').length})`;
        }, scriptList, { childList: true, subtree: true });
    };


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

    const corsFetchMap = new Map();

    const corsFetch = async (url, options) => {
        if (top !== window) return;
        const uo = new URL(url);
        const protocol = uo.protocol.replace(/[^\w]+/g, '');
        const hostname = uo.hostname;
        const origin0 = `${protocol}://${hostname}`;
        let promiseF = null;
        let prFn = corsFetchMap.get(origin0);
        for (let i = 0; i < 2; i++) {
            if (!prFn) {
                prFn = new Promise((resolve) => {
                    let iframe = document.createElement('iframe');
                    const rid = `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
                    iframe.id = `iframe-${rid}`;
                    iframe.name = `iframe-${rid}`;
                    window.addEventListener('message', (evt) => {
                        if (evt && evt.origin === origin0) {
                            const data = evt.data;
                            if (data && data.id38) {
                                const { id38, msg, fetchId: fetchId_, args } = data;
                                if (msg === 'ready') {
                                    const iframeWindow = evt.source;
                                    resolve((...args) => {
                                        if (!iframe.isConnected) return -1;
                                        const fetchId = `${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
                                        const promise = new PromiseExternal();
                                        corsFetchMap.set(`${id38}-${fetchId}`, promise);
                                        iframeWindow.postMessage({
                                            id38,
                                            msg: 'fetch',
                                            fetchId,
                                            args
                                        }, '*');
                                        return promise;
                                    });
                                } else if (msg === 'fetchResponse') {
                                    const promise = corsFetchMap.get(`${id38}-${fetchId_}`);
                                    if (promise) {
                                        corsFetchMap.delete(`${id38}-${fetchId_}`);
                                        promise.resolve(args[0]);
                                    }
                                }
                            }
                        }
                    });
                    iframe.src = `${protocol}://${hostname}/robots.txt?id38=${rid}&p38=${protocol}&h38=${hostname}`;
                    Object.assign(iframe.style, {
                        'position': 'fixed',
                        'left': '-300px',
                        'top': '-300px',
                        'width': '30px',
                        'height': '30px',
                        'pointerEvents': 'none',
                        'zIndex': '-1',
                        'contain': 'strict'
                    });
                    (document.body || document.documentElement).appendChild(iframe);
                });
                corsFetchMap.set(origin0, prFn);
            }
            const fetchFn = await prFn.then();
            const promise = fetchFn(url, options);
            if (promise === -1) {
                corsFetchMap.delete(origin0);
                prFn = null;
                continue;
            }
            if (promise && typeof promise.then === 'function') {
                promiseF = promise;
                break;
            }
        }
        if (!promiseF) return null;
        const promiseResult = await promiseF.then();
        return promiseResult;
    };

    const standardFetch = async (url, options) => {
        if (options && options.headers) {
            options.headers = new Headers(options.headers);
        }
        const response = await fetch(url, options);
        let json = null;
        if (response.ok === true) {
            try {
                json = await response.json();
            } catch (e) { }
        }
        const res = {
            status: response.status,
            url: response.url,
            ok: response.ok,
            json
        };
        return res;
    }

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
    let reqStoresA = new Map();
    let reqStoresB = new Map();

    const getOldestEntry = (noCache)=>{
        const reqStores = noCache ? reqStoresB : reqStoresA;
        const oldestEntry = reqStores.entries().next();
        if(!oldestEntry || !oldestEntry.value) return [];
        const id = oldestEntry.value[0]
        const req = oldestEntry.value[1]
        reqStores.delete(id);
        return [id, req];
    }

    let mutexC = Promise.resolve();
    const getScriptDataAN = (noCache)=>{

        mutexC = mutexC.then(async () => {

            const [id, req] = getOldestEntry(noCache);

            if (!(id > 0)) return;

            const DO_CORS = /^(cn-greasyfork|greasyfork|sleazyfork)\.org$/.test(window.location.hostname) ? `api.${window.location.hostname}` : '';
            const url = `https://${DO_CORS || window.location.hostname}/scripts/${id}.json`;
            const fetchUrl = sessionStorage.getItem(`redirect41-${url}`) || url;

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
                req.resolve(result);
                return;
            }
    
            await (networkMP1 = networkMP1.then(() => new Promise(unlock => {
    
                const maxAgeInSeconds = 900;
                const rd = previousIsCache ? 1 : Math.floor(Math.random() * 80 + 80);
                let fetchStart = 0;

                const fetchOptions = noCache ? {
                    method: 'GET',
                    cache: 'reload',
                    credentials: 'omit',
                    headers: {
                        'Cache-Control': `max-age=${maxAgeInSeconds}`,
                    }
                } : {
                    method: 'GET',
                    cache: 'force-cache',
                    credentials: 'omit',
                    headers: {
                        'Cache-Control': `max-age=${maxAgeInSeconds}`,
                    }
                };

                new Promise(r => setTimeout(r, rd))
                    .then(() => {
                        fetchStart = Date.now();
                    })
                    .then(() => DO_CORS ? corsFetch(fetchUrl, fetchOptions): standardFetch(fetchUrl, fetchOptions))
                    .then((response) => {

                        if (fetchUrl !== response.url) {
                            sessionStorage.setItem(`redirect41-${url}`, response.url);
                            sessionStorage.setItem(`redirect41-${fetchUrl}`, response.url);
                        }
    
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
                            return response.json;
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
                    .then((data) => req.resolve(data))
                    .catch((e) => {
                        unlock();
                        UU.log(id, url)
                        console.warn(e)
                        // reject(e)
                    })
    
            })).catch(() => { }))

        });

    }
    const getScriptData = (id, noCache) => {
        if (!(+id > 0)) return Promise.resolve();
        id = +id;
        const reqStores = noCache ? reqStoresB : reqStoresA;
        const cachedReq = reqStores.get(id);
        if (cachedReq) return cachedReq;
        const req = new PromiseExternal();
        reqStores.set(id, req);
        getScriptDataAN(noCache);
        return req;
    }

    /**
     * Get user data from Greasy Fork API
     *
     * @param {string} userID User ID
     * @returns {Promise} User data
     */
    const getUserData = (userID, noCache) => {
        if (!(userID >= 0)) return Promise.resolve()

        const DO_CORS = /^(cn-greasyfork|greasyfork|sleazyfork)\.org$/.test(window.location.hostname) ? `api.${window.location.hostname}` : '';
        const url = `https://${DO_CORS || window.location.hostname}/users/${userID}.json`;
        const fetchUrl = sessionStorage.getItem(`redirect41-${url}`) || url;
        return new Promise((resolve, reject) => {


            networkMP2 = networkMP2.then(() => new Promise(unlock => {

                const maxAgeInSeconds = 900;
                const rd = Math.floor(Math.random() * 80 + 80);

                const fetchOptions = noCache ? {
                    method: 'GET',
                    cache: 'reload',
                    credentials: 'omit',
                    headers: {
                        'Cache-Control': `max-age=${maxAgeInSeconds}`,
                    }
                } : {
                    method: 'GET',
                    cache: 'force-cache',
                    credentials: 'omit',
                    headers: {
                        'Cache-Control': `max-age=${maxAgeInSeconds}`,
                    }
                };

                new Promise(r => setTimeout(r, rd))

                    .then(() => DO_CORS ? corsFetch(fetchUrl, fetchOptions) : standardFetch(fetchUrl, fetchOptions))
                    .then((response) => {

                        if (fetchUrl !== response.url) {
                            sessionStorage.setItem(`redirect41-${url}`, response.url);
                            sessionStorage.setItem(`redirect41-${fetchUrl}`, response.url);
                        }

                        UU.log(`${response.status}: ${response.url}`)
                        if (response.ok === true) {
                            unlock();
                            return response.json;
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

                        getRafPromise() // foreground
                            .then(() => getScriptData(script.id))
                            .then((script) => {
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

        const count = Math.max(sv1.length, sv2.length);

        for (let index = 0; index < count; index++) {
            if (isNaNx(sv1[index]) || isNaNx(sv2[index])) return NaN;
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

    const hideBlacklistedDiscussion = (element, list) => {

        const scriptLink = element.querySelector('a.script-link')
        const m = /\/scripts\/(\d+)/.exec(scriptLink);
        const id = m ? +m[1] : 0;
        if (!(id > 0)) return;

        switch (list) {
            case 'hiddenList': {
                const container = element.closest('.discussion-list-container') || element;
                if (hiddenList.indexOf(id) >= 0) {
                    container.classList.add('hidden');
                }
                // if (customBlacklist && (customBlacklist.test(name) || customBlacklist.test(description)) && !element.classList.contains('blacklisted')) {
                //     element.classList.add('blacklisted', 'custom-blacklist');
                //     if (gmc.get('hideBlacklistedScripts') && gmc.get('debugging')) {
                //         let scriptLink = element.querySelector('.script-link');
                //         if (scriptLink) { scriptLink.textContent += ' (custom-blacklist)'; }
                //     }
                // }
                break;
            }
            default:
                UU.log('No blacklists');
                break;
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
                const customBlacklist = customBlacklistRF;
                if (customBlacklist && (customBlacklist(name) >= 0 || customBlacklist(description) >= 0) && !element.classList.contains('blacklisted')) {
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
                    GMA.setValue('hiddenList', hiddenList);

                    element.classList.add('hidden');
                    updateScriptLink(true);

                } else {
                    const index = hiddenList.indexOf(id);
                    hiddenList.splice(index, 1);
                    GMA.setValue('hiddenList', hiddenList);

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

        await getRafPromise().then();
        let _baseScript = null;
        if (element.nodeName === 'LI' && element.hasAttribute('data-script-id') && element.getAttribute('data-script-id') === `${scriptID}` && element.getAttribute('data-script-language') === 'js') {

            const version = element.getAttribute('data-script-version') || ''

            let scriptCodeURL = element.getAttribute('data-code-url');
            if (!scriptCodeURL || !isVaildURL(scriptCodeURL)) {

                const name = element.getAttribute('data-script-name') || ''
                const scriptFilename = element.getAttribute('data-script-type') === 'library' ? `${encodeFileName(name)}.js` : `${encodeFileName(name)}.user.js`;

                scriptCodeURL = `https://update.${location.hostname}/scripts/${scriptID}/${scriptFilename}`
            }
            _baseScript = {
                id: +scriptID,
                code_url: scriptCodeURL,
                version: version
            }

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

    const updateReqStoresWithElementsOrder = (x) => {
        try {
            const reqStoresA_ = reqStoresA;
            const reqStoresB_ = reqStoresB;
            const order2 = [...reqStoresA_.keys()];
            const order3 = [...reqStoresB_.keys()];
            const orders1 = x;
            const orders = new Set([...orders1, ...order2, ...order3]);
            const reqStoresA2 = new Map();
            const reqStoresB2 = new Map();
            for (const id of orders) {
                const reqA = reqStoresA_.get(id);
                if (reqA) reqStoresA2.set(id, reqA);
                const reqB = reqStoresB_.get(id);
                if (reqB) reqStoresB2.set(id, reqB);
            }
            reqStoresA = reqStoresA2;
            reqStoresB = reqStoresB2;
            reqStoresA_.clear();
            reqStoresB_.clear();
        } catch (e) {
            console.warn(e)
        }
    };

    let lastIdArrString = '';

    const foundScriptList = async (scriptList) => {

        // add options and style for blacklisted/hidden scripts
        if (gmc.get('hideBlacklistedScripts') || gmc.get('hideHiddenScript')) {
            addOptions(scriptList);
        }

        mutationRunner(() => {
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

            const idArr = [...scriptList.querySelectorAll('li[data-script-id]')].map(e => +e.getAttribute('data-script-id'));
            const idArrString = idArr.join(',');
            if (lastIdArrString !== idArrString) {
                lastIdArrString = idArrString;
                updateReqStoresWithElementsOrder(idArr);
            }

        }, scriptList, { subtree: true, childList: true });

    }

    const foundDiscussionList = (discussionsList) => {
        targetHiddenRecentDateTime = Date.now() - valHideRecentUsersWithin * 3600000;
        mutationRunner(() => {
            if (!discussionsList || discussionsList.isConnected !== true) return;
            const scriptElements = discussionsList.querySelectorAll('.discussion-list-item:not([e8kk])');
            for (const element of scriptElements) {
                element.setAttribute('e8kk', '1');

                // blacklisted scripts
                if (gmc.get('hideHiddenScript')) hideBlacklistedDiscussion(element, 'hiddenList');

                let t;
                let userId = 0;
                if (t = element.querySelector('a.user-link[href*="/users/"]')) {
                    const m = /\/users\/(\d+)/.exec(`${t.getAttribute('href')}`);
                    if (m) {
                        userId = +m[1];
                    }
                }
                if (userId > 0) {
                    determineRecentUserAsync(userId).then((isNewUser) => {
                        element.classList.toggle('discussion-item-by-recent-user', isNewUser);
                    });
                }
                let discussionId = 0;
                if (t = element.querySelector('a.discussion-title[href*="/discussions/')) {
                    const m = /\/\w+\/(\d+)/.exec(`${t.getAttribute('href')}`);
                    if (m) {
                        discussionId = +m[1];
                    }
                }
                let btnContainer = null;
                const meta = element.querySelector('div.discussion-meta');
                if (meta) {
                    btnContainer = document.createElement('additional-buttons');
                    meta.appendChild(btnContainer);
                }
                if (btnContainer) {
                    if (discussionId > 0) {
                        const btn = document.createElement('a');
                        btn.classList = 'discussion-list-item-report-comment'
                        btn.textContent = 'Report Comment';
                        btnContainer.appendChild(btn);
                        const m = /^(https?:\/\/[a-z-]{10,15}\.org\/(([a-z]{2,3}(-[a-zA-Z0-9]{2,3})?)\/)?)\w+/.exec(location.href);
                        if (m) {
                            btn.href = `${m[1]}reports/new?item_class=discussion&item_id=${discussionId}`;
                        }
                    }
                }
            }
        }, discussionsList, { subtree: true, childList: true });
    }

    const foundScriptDiscussionList = (discussionsList) => {
        targetHiddenRecentDateTime = Date.now() - valHideRecentUsersWithin * 3600000;
        mutationRunner(() => {
            if (!discussionsList || discussionsList.isConnected !== true) return;
            const scriptElements = discussionsList.querySelectorAll('.discussion-list-item:not([e8kk])');
            for (const element of scriptElements) {
                element.setAttribute('e8kk', '1');
                let t;
                let userId = 0;
                if (t = element.querySelector('a.user-link[href*="/users/"]')) {
                    const m = /\/users\/(\d+)/.exec(`${t.getAttribute('href')}`);
                    if (m) {
                        userId = +m[1];
                    }
                }
                if (userId > 0) {
                    determineRecentUserAsync(userId).then((isNewUser) => {
                        element.classList.toggle('discussion-item-by-recent-user', isNewUser);
                    });
                }
                let discussionId = 0;
                if (t = element.querySelector('a.discussion-title[href*="/discussions/')) {
                    const m = /\/\w+\/(\d+)/.exec(`${t.getAttribute('href')}`);
                    if (m) {
                        discussionId = +m[1];
                    }
                }
                let btnContainer = null;
                const meta = element.querySelector('div.discussion-meta');
                if(meta){
                    btnContainer = document.createElement('additional-buttons');
                    meta.appendChild(btnContainer);
                }
                if (btnContainer) {
                    if (discussionId > 0) {
                        const btn = document.createElement('a');
                        btn.classList = 'discussion-list-item-report-comment'
                        btn.textContent = 'Report Comment';
                        btnContainer.appendChild(btn);
                        const m = /^(https?:\/\/[a-z-]{10,15}\.org\/(([a-z]{2,3}(-[a-zA-Z0-9]{2,3})?)\/)?)\w+/.exec(location.href);
                        if (m) {
                            btn.href = `${m[1]}reports/new?item_class=discussion&item_id=${discussionId}`;
                        }
                    }
                }
            }
        }, discussionsList, { subtree: true, childList: true });
    }

    let promiseScriptCheckResolve = null;
    const promiseScriptCheck = new Promise(resolve => {
        promiseScriptCheckResolve = resolve
    });

    const milestoneNotificationFn = async (o) => {

        const { userLink, userID } = o;

        const milestones = gmc.get('milestoneNotification').replace(/\s/g, '').split(',').map(Number);

        if (!userID) return;

        await new Promise(resolve => setTimeout(resolve, 800)); // delay for reducing server burden
        await new Promise(resolve => requestAnimationFrame(resolve)); // foreground

        const userData = await getUserData(+userID.match(/\d+(?=\D)/g));
        if (!userData) return;

        const [totalInstalls, lastMilestone] = await Promise.all([
            getTotalInstalls(userData),
            GMA.getValue('lastMilestone', 0)]);

        const milestone = milestones.filter(milestone => totalInstalls >= milestone).pop();

        UU.log(`total installs are "${totalInstalls}", milestone reached is "${milestone}", last milestone reached is "${lastMilestone}"`);

        if (milestone <= lastMilestone) return;

        if (milestone && milestone >= 0) {

            GMA.setValue('lastMilestone', milestone);

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
                    });

                document.head.appendChild(document.createElement('script')).textContent = `;(${mWindow.contentScriptText})(${JSON.stringify(scriptHandlerObject)}, ${WinComm.createInstance});`;

            }

            addSettingsToMenu();

            setTimeout(() => {
                getRafPromise().then(() => {
                    const installBtn = document.querySelector('a[data-script-id][data-script-version]')
                    const scriptID = installBtn && installBtn.textContent ? +installBtn.getAttribute('data-script-id') : 0;
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
                });
            }, 740);

            const userLink = document.querySelector('.user-profile-link a[href]');
            const userID = userLink ? userLink.getAttribute('href') : undefined;

            const urlMatch = (url1, url2) => {
                url1 = `${url1}`
                url2 = `${url2}`;
                if (url1.includes(location.hostname)) {
                    url1 = url1.replace(`https://${location.hostname}/`, '/')
                    url1 = url1.replace(`http://${location.hostname}/`, '/')
                    url1 = url1.replace(/^\/+/, '/')
                } else if (!url1.startsWith('/')) {
                    url1 = `/${url1}`;
                }
                if (url2.includes(location.hostname)) {
                    url2 = url2.replace(`https://${location.hostname}/`, '/')
                    url2 = url2.replace(`http://${location.hostname}/`, '/')
                    url2 = url2.replace(/^\/+/, '/')
                } else if (!url2.startsWith('/')) {
                    url2 = `/${url2}`;
                }
                url1 = url1.replace(/\?\w+=\w+(&\w+=\w+)*$/, '');
                url2 = url2.replace(/\?\w+=\w+(&\w+=\w+)*$/, '');
                return url1.toLowerCase() === url2.toLowerCase();
            }

            UU.addStyle(mWindow.pageCSS);


            const elementLookup = (selector, fn) => {
                const elm0 = document.querySelector(selector);
                if (elm0) {
                    fn(elm0);
                } else {
                    const timeout = Date.now() + 3000;
                    (new MutationObserver((_, observer) => {
                        const elm = document.querySelector(selector);
                        if (elm && elm.childElementCount >= 1) {
                            observer.disconnect();
                            observer.takeRecords();
                            fn(elm);
                        } else if (Date.now() > timeout) {
                            observer.disconnect();
                            observer.takeRecords();
                        }
                    })).observe(document, { subtree: true, childList: true });
                }
            };

            // blacklisted scripts / hidden scripts / install button

            const isPageScriptBySite = location.pathname.includes('/scripts/by-site/');
            const isPageUnderScript = isPageScriptBySite ? false : location.pathname.includes('/scripts/');
            const pageType_ = isPageScriptBySite ? 'scripts' : /\/([a-z-]+)$/.exec(location.pathname);
            const pageType = typeof pageType_ === 'string' ? pageType_ : (pageType_ ? pageType_[1] : '');
            const isDiscussionListPage = !isPageUnderScript && (pageType === 'discussions' || (pageType_ && /\/discussions\/[a-z-]+$/.test(location.pathname)));
            const isFeedbackListPage = isPageUnderScript && pageType === 'feedback';
            const isScriptListPage = !isPageUnderScript && pageType === 'scripts';
            const isUserIDPage = !isPageUnderScript && urlMatch(window.location.pathname, userID);
            if (!isUserIDPage && !isDiscussionListPage && !isFeedbackListPage && (gmc.get('hideBlacklistedScripts') || gmc.get('hideHiddenScript') || gmc.get('showInstallButton'))) {

                if (isScriptListPage) {
                    elementLookup('.script-list', foundScriptList);
                } else if (isPageUnderScript) {

                    // hidden scripts on details page
                    const installLinkElement = document.querySelector('#script-info .install-link[data-script-id]');

                    if (installLinkElement) {
                        setupInstallLink(installLinkElement);
                        if (gmc.get('hideHiddenScript')) {
                            const id = +installLinkElement.getAttribute('data-script-id');
                            hideHiddenScript(document.querySelector('#script-info'), id, false);
                        }
                        installLinkElement.addEventListener('click', async function (e) {
                            if (e && e.isTrusted && location.pathname.includes('/scripts/')) {

                                await new Promise(r => setTimeout(r, 800));
                                await new Promise(r => window.requestAnimationFrame(r));
                                await new Promise(r => setTimeout(r, 100));
                                // let ethicalads497 = 'ethicalads' in window ? window.ethicalads : undefined;
                                // window.ethicalads = { wait: new Promise() }
                                document.dispatchEvent(new Event("DOMContentLoaded"));
                                document.documentElement.dispatchEvent(new Event("turbo:load"));
                                // if (ethicalads497 === undefined) delete window.ethicalads; else window.ethicalads = ethicalads497;
                            }
                        })
                    }


                }

            } else if (isDiscussionListPage) {
                elementLookup('.discussion-list', foundDiscussionList);
            } else if (isFeedbackListPage) {
                elementLookup('.script-discussion-list', foundScriptDiscussionList);
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

            if (isScriptFirstUse) GMA.setValue('firstUse', false).then(() => {
                gmc.open();
            });

            if (fixLibraryScriptCodeLink) {

                const xpath = "//code[contains(text(), '.js?version=') or contains(text(), '// @require https://')]";
                const snapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                for (let i = 0; i < snapshot.snapshotLength; i++) {
                    let element = snapshot.snapshotItem(i);
                    if (element.firstElementChild) continue;
                    element.textContent = element.textContent.replace(/\bhttps:\/\/(cn-greasyfork|greasyfork|sleazyfork)\.org\/scripts\/\d+-[^/]+\/code\/[^.]+\.js\?version=\d+\b/, (_) => {
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
