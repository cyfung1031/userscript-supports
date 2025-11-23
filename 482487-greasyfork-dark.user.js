// ==UserScript==
// @name                GreasyFork Dark
// @version             0.3.31
// @license             MIT
// @author              CY Fung
// @name:ja             GreasyFork Dark ダークモード
// @name:zh-TW          GreasyFork Dark 深色模式
// @name:zh-CN          GreasyFork Dark 深色模式
// @namespace           Violentmonkey Scripts
// @match               https://greasyfork.org/*
// @match               https://sleazyfork.org/*
// @match               https://cn-greasyfork.org/*
// @grant               none
// @description         GreasyFork Dark Theme (adapative css)
// @description:ja      GreasyFork Dark Theme (adapative css)
// @description:zh-TW   GreasyFork Dark Theme (adapative css)
// @description:zh-CN   GreasyFork Dark Theme (adapative css)
// @run-at              document-start
// @unwrap
// @inject-into         page
// @require             https://cdn.jsdelivr.net/npm/stylis@4.3.6/dist/umd/stylis.min.js
// ==/UserScript==


if (!localStorage.darkMode) localStorage.darkMode = 'true';

(() => {


    const generalCSSFn = () => `

        [dark] .user-content[class] [style*="color:"] {
            filter: invert(1);
        }

        [dark] .user-content[class] [style*="color:"] [style*="color:"] {
            filter: initial;
        }

        [dark] .user-content[class] [style*="color:"] a  {
            filter: invert(1);
        }

        [dark] .user-content[class] [style*="color:"] code  {
            filter: invert(1);
        }

        [dark] .user-content[class] code  {
            color: #b3f6d1;
        }

        /*
            .comment-meta a.self-link,a.self-link:visited {
                opacity: 0.4;
            }
        */

    `;

    const cssTextFn = () => [

        // general
        `



html {
    overflow-y: scroll
}

body {
    margin: 0;
    background-color: #24272d;
    color: #e9e9e9;
}

body,select,input {
    font-family: Open Sans,sans-serif,"Segoe UI Emoji"
}

body:lang(zh-CN),select:lang(zh-CN),input:lang(zh-CN) {
    font-family: Open Sans,Microsoft YaHei UI,sans-serif,"Segoe UI Emoji"
}

body:lang(zh-TW),select:lang(zh-TW),input:lang(zh-TW) {
    font-family: Open Sans,Microsoft JHengHei UI,sans-serif,"Segoe UI Emoji"
}

input, select {
    color: #dadada;
    background-color: #1e1e1e;
    outline:0;
}

input {
    border: 1px solid #575757;
}

textarea {
    background-color: #1e1e1e;
    color: #fff;
    outline: 0;
}
body .preview-results{
   border: 1px solid #565c70;
}


pre,code {
    direction: ltr !important
}

textarea {
    resize: vertical
}

a {
    color: #f7c67f; /*#f65e5e;*/
}

a:visited {
    color: #c9a573; /*#e97575;*/
}

input[type=checkbox],input[type=radio] {
    vertical-align: middle
}

.width-constraint {
    margin: auto;
    max-width: 1200px
}

@media screen and (max-width: 1228px) {
    .width-constraint {
        margin:auto 1.2vw
    }
}

@media screen and (max-width: 400px) {
	.width-constraint {
		margin: auto 0
	}
}

.inline-list,.block-list {
    padding-left: 0;
    padding-right: 0;
    list-style: none
}

.inline-list {
    display: inline
}

.block-list {
    display: block;
    margin: 0
}

.inline-list li,.block-list li {
    display: inline
}

.inline-list li:after,.block-list li:after {
    content: ", "
}

body:lang(he) .inline-list li:after,body:lang(he) .block-list li:after,body:lang(ar) .inline-list li:after,body:lang(ar) .block-list li:after,body:lang(ug) .inline-list li:after,body:lang(ug) .block-list li:after,body:lang(ckb) .inline-list li:after,body:lang(ckb) .block-list li:after {
    content: "،"
}

.inline-list li:last-child:after,.block-list li:last-child:after {
    content: ""
}

dt[title]>span {
    border-bottom: 1px dotted black
}

.form-section {
    margin-bottom: 2em
}

.form-control {
    margin-bottom: 1em
}

.form-control textarea,#ace-editor {
    width: 100%;
    box-sizing: border-box;
    margin-top: 1px;
    margin-bottom: 1px
}

.form-control textarea:not([rows]),#ace-editor {
    height: 20em
}

#ace-editor {
    border: 1px solid #BBB;
    border-style: inset;
    resize: both
}

.form-control input:not([type=radio]):not([type=file]):not([type=checkbox]):not([type=search]):not([type=submit]):not([size]) {
    box-sizing: border-box;
    width: 100%
}

.radio-group input[type=radio] {
    margin-left: 1em
}

.form-control label {
    font-weight: 700
}

.form-control label.radio-label,.form-control label.checkbox-label {
    font-weight: 400
}

label.subselection-radio-title {
    font-weight: 400;
    font-size: small;
    display: block;
    margin-left: 3px
}

.field_with_errors textarea {
    background-color: #3b3535;
}

.label-note {
    font-size: smaller
}

.screenshots-controls>*:not(label) {
    padding-left: 1em
}

.add-screenshot-control,.screenshot-control {
    clear: left
}

.screenshot-control>* {
    vertical-align: middle
}

.screenshot-control a {
    float: left;
    min-width: 150px;
    text-align: center
}

#script-info,.user-list,.text-content,.discussion-list,.notification-list {
    padding: 0 1em 1em
}

#script-info>*:last-child,.user-list>*:last-child,.text-content>*:last-child,.discussion-list>*:last-child,.notification-list>*:last-child {
    margin-bottom: 0
}

.script-list {
    padding: 0
}

.script-list,.user-list,.text-content,.discussion-list,.notification-list {
    list-style-type: none;
    box-shadow: 0 0 5px #101011;
    background-color: #31343e;
    color: #e0e0e0;
    border: 1px solid #27282c;
    border-radius: 5px;
    box-sizing: border-box;
    margin: 14px 0
}

.discussion-list {
    background-color: #343b4a;
}

.text-content:last-child {
	margin-bottom: 0
}

.user-list {
    padding: 1em;
    margin: 1em 0
}

.script-link,.script-description,.user-link {
    unicode-bidi: isolate
}

.list-option-groups~ol {
    width: calc(960px - 14em)
}

.text-content .list-option-groups~ol {
    width: calc(960px - 16em)
}

@media screen and (max-width: 960px) {
    #script-info,.user-list,.text-content {
        padding:0 1.2vw 1.2vw
    }
}


@media screen and (max-width: 400px) {
	.script-list, .user-list, .text-content, .discussion-list, .notification-list {
		border-left: 0;
		border-right: 0
	}

	.user-list, .text-content, .discussion-list, .notification-list, .script-list-description {
		padding-left: 1em;
		padding-right: 1em
	}

	.discussion-list-header, .user-list-header, .library-list-header {
		padding-left: 1em;
		padding-right: 1em;
		margin-top: 15px;
		margin-bottom: 10px
	}

	#script-info {
		padding-left: 1em;
		padding-right: 1em
	}

	#script-links {
		margin-left: -1em;
		margin-right: -1em;
		padding: 0
	}

	#additional-info {
		margin-left: -1em;
		margin-right: -1em
	}

}

.script-list li:not(.ad-entry) {
    border-bottom: 1px solid #000000;
    padding: 1em
}

.script-list .cf-wrapper {
    margin: 0 !important
}

@media screen and (max-width: 960px) {
    .script-list li:not(.ad-entry) {
        padding: 1.2vw
    }
}

.script-list h2 {
    margin: 0;
    font-size: 18px
}

.script-list p {
    margin: 0
}

.script-list footer {
    margin-top: .25em
}

.list-current,.script-list h2 {
    font-weight: 700
}

.script-list .description {
    font-weight: 400;
    display: block;
    margin: .5em 0;
    font-size: smaller
}

.script-list .name-description-separator {
    display: none
}

#script-description,.script-list h2>a,.script-list .description {
    word-wrap: break-word
}

@media screen and (max-width: 720px) {
    .script-list,#script-content {
        margin-left: unset
    }
}

.pagination,.script-list+.pagination,.user-list+.pagination {
    font-size: 18px;
    display: block;
    background-color: transparent;
    padding: 0;
    margin: 0;
    border-radius: 5px
}

.pagination>*,.script-list+.pagination>*,.user-list+.pagination>* {
    display: inline-block;
    background-color: #1b1b1e;
    padding: .5em;
    border-radius: 5px;
    text-decoration: none
}

.pagination .disabled {
    display: none
}

.pagination .current {
    font-style: normal;
    font-weight: 700
}

.pagination .current,.pagination .gap {
    background-color: transparent
}

.pagination>a:hover,.pagination>a:focus {
    background-color: #100f0b
}

@media screen and (max-width:400px) {
	.pagination, .script-list + .pagination, .user-list + .pagination {
		padding-left: 1em;
		padding-right: 1em
	}
}

.good-rating-count,.ok-rating-count,.bad-rating-count {
    display: inline-block;
    min-width: 1em;
    text-align: center;
    padding: 0 .25em;
    border: 1px solid #DDDDDD;
    border-radius: 10px
}

.good-rating-count {
    background-color: #d8fff8;
    border-color: #339b334d;
    color: #1f7c1f
}

.ok-rating-count {
    background-color: #f9fec1;
    border-color: #9b9b004d;
    color: #626221
}

.bad-rating-count {
    background-color: #ffdada;
    border-color: #9b33334d;
    color: #7a1f1f
}

.select-all,.select-none {
    display: none
}

.diff {
    border: 2px solid black
}

#help-allowed-elements,#help-allowed-styles {
    -moz-column-width: 20em;
    -webkit-column-width: 20em;
    column-width: 20em
}

#help-allowed-elements li,#help-allowed-styles li {
    padding-right: 1em
}

#by-site-list {
    list-style-type: none;
    padding: 0
}

#by-site-list li {
    display: inline;
    vertical-align: middle
}

#user_profile {
    width: 100%;
    height: 10em
}

.preview-result {
    display: none;
    background-color: #ffa;
    padding: .5em
}

.failed-sync {
    background-color: #fcc
}

.alert {
    font-style: italic;
    background-color: #787825; /* #ffc; */
    border: none;
    border-left: 6px solid #d7d171; /* 6px solid #FFEB3B; */
    padding: .5em
}

.notice {
    background-color: #2b556a;
    border: none;
    border-left: 6px solid #5aa5cb;
    padding: .5em
}

.validation-errors {
    background-color: #626240;
    border: none;
    border-left: 6px solid #FFEB3B;
    padding: .5em;
    margin: .5em 0
}

.validation-errors>p:first-child {
    margin-top: 0
}

.validation-errors>p:last-child {
    margin-bottom: 0
}

#install-stats-chart {
    width: 100%;
    height: 400px
}

.stats-table {
    border-collapse: collapse
}

.stats-table th,.stats-table td {
    border: 1px solid gray;
    padding: 0 .5em
}

td.numeric,th.numeric {
    text-align: right
}

.translation_missing {
    outline: dashed red
}

#edit_user>div {
    margin-bottom: .5em
}

#edit_user>div>label:first-child {
    font-weight: 700
}

.inline-form {
    display: inline
}

a.self-link,a.self-link:visited {
    text-decoration: none;
    color: #fff; /* #000; */
    opacity: .2
}

.indented {
    padding-left: 1em
}

.external-login {
    padding: 2px 2px 3px 25px;
    border: 1px solid black;
    border-radius: 2px;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    background-position: 5px 2px
}

.external-login-container {
    display: inline-block;
    vertical-align: top
}

.external-login-container * {
    text-align: center;
    display: block
}

.external-login-container>*:not(button) {
    font-size: smaller
}

.external-login-container:not(:last-child) {
    margin-right: 5px
}

.external-login-container .github-login {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNTE3OEEyQTk5QTAxMUUyOUExNUJDMTA0NkE4OTA0RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNTE3OEEyQjk5QTAxMUUyOUExNUJDMTA0NkE4OTA0RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU1MTc4QTI4OTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU1MTc4QTI5OTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+m4QGuQAAAyRJREFUeNrEl21ojWEYx895TDPbMNlBK46IUiNmPvHBSUjaqc0H8pF5+aDUKPEBqU2NhRQpX5Rv5jWlDIWlMCv7MMSWsWwmb3tpXub4XXWdPHvc9/Gc41nu+nedc7/8r/99PffLdYdDPsvkwsgkTBwsA/PADJCnzX2gHTwBt8Hl7p537/3whn04XoDZDcpBlk+9P8AFcAghzRkJwPF4zGGw0Y9QS0mAM2AnQj77FqCzrtcwB1Hk81SYojHK4DyGuQ6mhIIrBWB9Xm7ug/6B/nZrBHBegrkFxoVGpnwBMSLR9EcEcC4qb8pP14BWcBcUgewMnF3T34VqhWMFkThLJAalwnENOAKiHpJq1FZgI2AT6HZtuxZwR9GidSHtI30jOrbawxlVX78/AbNfhHlomEUJJI89O2MqeE79T8/nk8nMBm/dK576hZgmA3cp/R4l9/UeSxiHLVIlNm4nFfT0bxyuIj7LHRTKai+zdJobwMKzcZSJb0ePV5PKN+BqAAKE47UlMnERELMM3EdYP/yrd+XYb2mOiYBiQ8OQnoRBlXrl9JZix7D1pHTazu4MoyBcnYamqAjIMTR8G4FT8LuhLsexXYYjICBiqhQBvYb6fLZIJCjPypVvaOoVAW2WcasCnL2Nq82xHJNSqlCeFcDshaPK0twkAhosjZL31QYw+1rlMpWGMArl23SBsZZO58F2tlJXmjOXS+s4WGvpMiBJT/I2PInZ6lIs9/hBsNS1hS6BG0DSqmYEDRlCXQrmy50P1oDRKTSegmNbUsA0zDMwRhPJXeCE3vWLPQMvan6X8AgIa1vcR4AkGZkDR4ejJ1UHpsaVI0g2LInpOsNFUud1rhxSV+fzC9Woz2EZkWQuja7/B+jUrgtIMpy9YCW4n4K41YfzRneW5E1KJTe4B2Zq1Q5EHEtj4U3AfEzR5SVY4l7QYQPJdN2as7RKBF0BPZqqH4VgMAMBL8Byxr7y8zCZiDlnOcEKIPmUpgB5Z2ww5RdOiiRiNajUmWda5IG6WbhsyY2fx6m8gLcoJDJFkH219M3We1+cnda93pfycZpIJEL/s/wSYADmOAwAQgdpBAAAAABJRU5ErkJggg==)
}

.external-login-container .gitlab-login {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACoUlEQVRYhc3WzW+UVRQG8N/MtKKYsEFMmpo27DUEFgSiSIHSsDAxsYr6L4Cs+AMkMWiMCwgB2lQMhIWJ0Rip7owbXbhjhekGTFBQkC9rTCxBWxb3vpkzb2Y6H+00PsnN3Hve8zznzL3nfvA/xQRm8Qk2rUBnU9aYxf5OSevxF5ZyO7eCBM4Fnb/xVCekyUBawl0M9BB8EPdLWq92Qvy0RFrCvh4SmGiic7EdaZ3G6S/aVA8JzDTR+RNPLEd6JTi/h19z/zZqXQQfwB+Zex3Hg+6B5Yjng+MWnAzjl7tIYE/gncDWMP64FSkWzVVUsCsQT3WRwOnAeylr/ZzHd7Qo6v2B9GG21XAr226i2kHwKn7LnN8D56Ogv6cZcTo4bA/2qWDf2UECLwb/s8G+I9jPFMZK/q3lrJ+VCm80O8I4vs39RRxtk8CJ0B/Hd7lfxS8YlmbmuawHxjQWTcSgdBiVt1S71uwAOxW+7yqygteD05cl0iNcaPl/W+MC/i3Zvgj9g6QlqOIGhqSCGxamJqOKbXiyw+ALuNxEpyYt8ZB0tgyTCqtZ0fQLcRn2VqXLp0B5+vuBz0L/TbiWs7knFVy/UVU/4u9QP7Pn5crsM8bVl+AfeDcY/svjXu7/dhjAMY1b9Trpejxf+vA9RlYx+Ah+KMX4HBui09vSMhQO9/HaKgSfxIOgO4+3Wjlvxo+lTKeld2K3WK/xflnK2pvbEQelB8RiIF7B810EfwE/Bf5i1uxql+1Vv1aLij2kfoE1QwWHpZOw4N3MWj3hGXytcRq/wsYmvhtxqeQ7mzVWhAqO4GEQvoHdwWcs24rvC3jH8rPVNbZgTuO6vo8PNNbLXPbtC56WHpWt3gAz2afveEN64xeBH2h8U6wJRvFNbqNrHXzV8BjO7vx8x02KpQAAAABJRU5ErkJggg==)
}

.external-login-container .google_oauth2-login {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAnFJREFUOI2FU11Ik1EYfs75zvZ9c35buAKpaWaSSVZoiheBKVmYdWF1ERi7kMhFUeqNFxLURRAhFKvhTcHMioQiCBG8iOgH8QfFKZj4M81ES0fONfe5tW87XcQncw17rs7znud5f87LIUgCn8u1jQaWL2MtWMTBGZGkKUgpLvPVxolELYkn3if3ZP38ytvQ8EAZCa6RzUoK4WDBrJiXey61rtH9T4LVx86cWF/PsPp1OjVZVxpo+q6wpfSUTOz2CAAwAIg5HOJqf89QvFnI3KNQa6ab6vTB2Ir3QGRsdCeMqVw8WmbTzBsJFPNSmzo7bfpbgkI6UeWSm25dIgDXhAHn/YtgRJWvNLza1BLnIOHPWZFwVyVfrizhvjvNXVuNkAimTjVV0PADBnEBpuYiVRnfXRMvaOkMOaOcpyUz7zDgJiPRtRKtTyrBn2a3++NFg7NqnTcAXbIE1UWsjwJkY07ON6/1v4hBYlxn6tP4SHS7yTH5zFS/z/ZLix3OEDrDUVg0PjSjlioRQgBA1GGSsb1334cXsyMd5Liudd7HKuB9CeC0Zmg+azivnR92h6qVCDkGAAYd53pB7KaEgLeJ1147F1YQ4xzv5nurbvc/eoqEcZwfh0r7PWqHxvOtwlhtOQkRAHBMOsQBz9zShH/OrAky5PT1LKN1lDG6/nPdnzPu81gPyeWYGbkAA2P8zBF9YV256N6o0jr6IvvT4qB7evWbvNW75Znzo8VCU8ONk0YnkPCZWtztRp+y/Kb3x0hF4LdC4+8oIci37P9eYMmtuV5g+6DFk66txd1uRFStDarBYnAuiYLkSREMz+sLbV8StX8AjxDtgxiuzNwAAAAASUVORK5CYII=)
}

.centered-sections h2,.centered-sections h3 {
    text-align: center
}

form.external-login-form {
    position: relative;
    display: table;
    margin: 0 auto;
    padding: 1em;
    background-color: #393939;
    border: 1px solid #1c242a;
    border-radius: 5px;
    text-align: center
}

form.external-login-form .remember-me {
    margin-top: 12px
}

form.new_user {
    position: relative;
    width: 340px;
    margin: 0 auto;
    padding: 1em;
    background-color: #393939;
    border: 1px solid #1c242a;
    border-radius: 5px;
    text-align: start
}

@media screen and (max-width: 440px) {
    form.new_user {
        width:unset
    }
}

form.new_user label,form.new_user em {
    display: block;
    font-size: small
}

form.new_user br {
    display: none
}

form.new_user input[type=text],form.new_user input[type=email],form.new_user input[type=password] {
    display: block;
    width: 100%;
    min-height: 34px;
    box-sizing: border-box;
    margin-top: .2em;
    margin-bottom: .5em;
    padding: 6px 8px;
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    color: #c8c8c8;
    background-color: #1e1e1e;
    border: 1px solid #070707;
    border-radius: 3px;
    outline: none;
    box-shadow: inset 0 1px 2px #0000001a
}

form input[type=checkbox],form input[type=checkbox]+label,form input[type=radio],form input[type=radio]+label {
    display: inline-block;
    font-size: small
}

.radio-note {
    font-size: small;
    margin-top: 5px
}

@media screen and (max-width: 440px) {
    form input[type=checkbox]+label {
        display: unset;
        word-wrap: break-word
    }
}

form.new_user input[type=submit] {
    display: block;
    width: 100%;
    min-height: 34px;
    box-sizing: border-box;
    margin: .5em 0 0;
    padding: 6px 8px;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
    vertical-align: middle;
    color: #fff;
    background-color: #670000;
    background-image: linear-gradient(#990000,#670000);
    border: 0px solid #ddd;
    box-shadow: 0 4px 8px #0003,0 6px 20px #00000030;
    border-radius: 3px;
    white-space: normal
}

form.new_user~br {
    display: none
}

form.new_user~a {
    width: 340px;
    display: block;
    margin: 0 auto 2em;
    font-size: small
}

form.new_user+a {
    width: 340px;
    display: block;
    margin: 0 auto
}

.sidebar-search,.home-search {
    position: relative;
    vertical-align: middle
}

.sidebar-search input[type=search],.home-search input[type=search] {
    padding-inline-end:20px
}

.sidebar-search input[type=search] {
    width: 100%;
    margin: 0 0 1em
}

.sidebar-search input[type=submit],.home-search input[type=submit] {
    position: absolute;
    -moz-appearance: none;
    -webkit-appearance: none;
    inset-inline-end: 0;
    top: 0;
    border-color: transparent;
    padding-inline-start:0;padding-inline-end:6px;margin-left: 0;
    margin-right: 0;
    background: none;
    opacity: .5
}

@media screen and (max-width: 680px) {
    .sidebar-search input[type=search],.home-search input[type=search] {
        font-size:unset
    }
}

figure {
    padding: 5px;
    box-shadow: 0 4px 8px #00000026,0 6px 10px #00000026;
    border-radius: 5px
}

figcaption {
    font-size: smaller;
    text-align: center
}

.multiform-page:not(:first-child) {
    margin-top: 30px
}

.multiform-page:not(:last-child) {
    padding-bottom: 30px;
    border-bottom: 1px solid lightgray
}

summary {
    cursor: pointer
}

@media screen and (max-width:400px) {
	.user-list {
		padding-top: 1em;
		padding-bottom: 1em
	}
}

.blocked-script-codes {
    font-size: smaller;
    border-collapse: collapse;
    width: 100%;
    text-align: left
}

.blocked-script-codes .pattern-row code {
    font-size: medium
}

.blocked-script-codes .pattern-row {
    border-top: 1px solid gray
}

.blocked-script-codes .info-row td:first-child {
    width: 2em
}

.ad {
    margin-top: 1em;
    margin-bottom: 1em
}

.script-list-cd-entry {
	border-bottom: 1px solid #DDDDDD
}

#script-list-cd, #discussion-show-cd {
	width: 300px;
	margin-left: auto;
	margin-right: auto
}

#script-list-cd {
	padding: 1em
}

.ethical-ads-text .ea-placement {
	position: relative
}

.ethical-ads-text .ea-callout {
	position: absolute;
	bottom: 0;
	right: 0
}

.ethical-ads-text:empty {
	min-height: 46px
}

.ethical-ads.text-content-top-ad {
	margin: 0 calc(-1em - 1px);
	border-radius: 5px 5px 0 0
}

@media screen and (max-width:960px) {
	.ethical-ads.text-content-top-ad {
		margin: 0 calc(-1.2vw - 1px)
	}

}

@media screen and (max-width:400px) {
	.ethical-ads.text-content-top-ad {
		margin: 0 calc(-1em - 1px);
		border-radius: 5px 5px 0 0
	}

}

@media screen and (max-width:400px) {
	.script-list li.ad-entry {
		padding: 0
	}

}

#script-info .ethical-ads-text {
	margin: 0 calc(-1em - 1px)
}

#script-info .ethical-ads-text .ea-content {
	border-radius: 0 !important
}

@media screen and (max-width:960px) {
	#script-info .ethical-ads-text {
		margin: 0 calc(-1.2vw - 1px)
	}
}

.after-radio-chosen {
    display: none;
    margin-left: 29px
}

input[type=radio]:checked~.after-radio-chosen {
    display: block
}

.announcement {
    margin: 14px 0;
    text-align: center;
    font-size: smaller
}

.announcement form {
    display: inline
}

.announcement input {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: none;
    margin: 0 0 0 4px;
    padding: 0;
    cursor: pointer
}

.announcement,.announcement input {
    font-size: 12px
}

.badge {
    margin-left: 1ex;
    border-radius: 10%/25%;
    font-size: 70%;
    padding: 0 .5ex;
    text-transform: uppercase;
    position: relative;
    top: -.2ex
}

.badge-banned,.badge-deleted {
    background-color: #e52020; /* #ff0000e6; */
    color: #ebebeb; /* #fff */
}

.badge-deleted {
    margin-left: 0;
    border-color: #ff0000e6
}

.badge-moderator {
    background-color: #1a1da8e6;
    color: #fff
}

.badge-author {
    background-color: #1e971ee6;
    color: #fff
}

.badge-js {
    background-color: #efd81d;
    color: #000
}

.badge-css {
    background-color: #254bdd;
    color: #fff
}

.badge-js,.badge-css {
    display: none
}

.showing-all-languages .badge-js,.showing-all-languages .badge-css {
    display: inline
}

code {
    background-color: #5c4b5e
}

pre code {
    background: none;
    border: 0
}

pre,code {
    border-radius: 2px;
    border: 1px solid #685c71
}

pre {
    padding: 1em
}

.prettyprint {
    min-width: calc(100% - 6px);
    background-color: #1e1e1e; /* #3c3e45; */ /* to be reviewed */
    color: #e9e9e9; /* #e8e6e3; */ /* to be reviewed */
    color: #cdcdcd;
}

.prettyprint.wrap {
    white-space: pre-wrap;
    line-break: anywhere
}

.prettyprint:not(.wrap) {
    width: max-content
}

.code-container {
    max-height: calc(100vh - 54px);
    overflow-x: auto;
    border-radius: 2px;
    border: 1px solid #E6DDD6
}

.code-container pre {
    border: 0;
    margin: 0
}

li.L0,li.L1,li.L2,li.L3,li.L4,li.L5,li.L6,li.L7,li.L8,li.L9 {
    list-style-type: decimal!important
}

@media screen and (max-width: 440px) {
    #code-container {
        font-size: small
    }
}

.diff_options input[type=number] {
    width: 10ch
}

.diff {
    overflow: auto
}

.diff ul {
    background: #343439;
    overflow: auto;
    font-size: 13px;
    list-style: none;
    margin: 0;
    padding: 0;
    display: table;
    width: 100%
}

.diff del,.diff ins {
    display: block;
    text-decoration: none
}

.diff li {
    padding: 0;
    display: table-row;
    margin: 0;
    height: 1em;
    --gfdark-diff-li-background-hover: #495678;
}

.diff li.ins {
    background: #346634;
    color: #dfffdf;
    --gfdark-diff-li-background-hover: #318e31;
}

.diff li.del {
    background: #82373a;
    color: #ffecec;
    --gfdark-diff-li-background-hover: #bb3636;
}

__DISABLED__ .diff li:hover {
    background: #ffc /* to be reviewed */
}

.diff li:hover {
    background: var(--gfdark-diff-li-background-hover);
}

.diff del,.diff ins,.diff span {
    white-space: pre;
    font-family: courier
}

.diff del strong {
    font-weight: 400;
    background: #362222;
}

.diff ins strong {
    font-weight: 400;
    background: #213e21;
}

.diff li.diff-comment {
    display: none
}

.diff li.diff-block-info {
    background: none repeat scroll 0 0 #403f3f
}

.diff del,.diff ins,.diff span {
    font-family: monospace
}

.diff {
    max-height: calc(100vh - 54px);
    overflow-y: auto
}

.report-diff .diff {
    max-height: 75vh
}

.report-diff form {
    display: inline
}

.diff ul {
    background-color: #1e1e1e; /* black; */ /* !! to be reviewed */
    color: #e9e9e9 /* white */ /* !! to be reviewed */
}

.diff {
    border: 2px solid #575757 /* #666 */ /* !! to be reviewed */
}

__DISABLE__ .diff li:hover {
    background: #2c303a /* #550 */ /* !! to be reviewed */
}

/* @media (prefers-color-scheme: dark) { */
    #ace-editor.ace-tm {
        background-color: #1e1e1e; /* #181a1b; */ /* !! to be reviewed */
        color: #e9e9e9; /* #e8e6e3; */ /* !! to be reviewed */
        border-color: #575757 /* #43494c */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_indent-guide {
        opacity: .1
    }

    #ace-editor.ace-tm .ace_scroller {
        background-color: #1e1e1e /* #181a1b */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_gutter {
        background: #24272d; /* #202325; */ /* !! to be reviewed */
        color: #e9e9e9 /* #c8c3bc */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_print-margin {
        background: #24272d /* #25282a */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_fold {
        background-color: #31343e /* #161d84 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_cursor {
        color: #e9e9e9 /* #e8e6e3 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_invisible {
        color: #575757 /* #c0bab2 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_storage,#ace-editor.ace-tm .ace_keyword {
        color: #f7c67f /* #337dff */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_constant {
        color: #b3f6d1 /* #f94448 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_constant.ace_buildin {
        color: #f7c67f /* #5e4ef6 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_constant.ace_language {
        color: #f7c67f /* #5a94f6 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_constant.ace_library {
        color: #b3f6d1 /* #65f96d */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_invalid {
        background-color: #670000; /* #cc00001a; */ /* !! to be reviewed */
        color: #e9e9e9 /* #ff1a1a */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_support.ace_function {
        color: #f7c67f /* #99b0c9 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_support.ace_constant {
        color: #b3f6d1 /* #65f96d */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_support.ace_type,#ace-editor.ace-tm .ace_support.ace_class {
        color: #f7c67f /* #6f9cde */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_keyword.ace_operator {
        color: #dadada /* #9d9487 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_string {
        color: #b3f6d1 /* #83fb88 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_comment {
        color: #70767d /* #7fb89c */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_comment.ace_doc {
        color: #70767d /* #339cff */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_comment.ace_doc.ace_tag {
        color: #f7c67f /* #84a6c1 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_constant.ace_numeric {
        color: #b3f6d1 /* #5190ff */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_variable {
        color: #e9e9e9 /* #70c0d0 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_xml-pe {
        color: #dadada /* #aaa398 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_entity.ace_name.ace_function {
        color: #f7c67f /* #6ba1ff */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_heading {
        color: #f7c67f /* #1e6fff */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_list {
        color: #e9e9e9 /* #f94cd2 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_meta.ace_tag {
        color: #f7c67f /* #77b0ff */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_string.ace_regex {
        color: #b3f6d1 /* #ff1a1a */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_marker-layer .ace_selection {
        background: #343b4a /* #2d3133 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm.ace_multiselect .ace_selection.ace_start {
        box-shadow: 0 0 3px #1e1e1e /* 0 0 3px #181a1b */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_marker-layer .ace_step {
        background: #f7c67f /* #989900 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_marker-layer .ace_stack {
        background: #1f7c1f /* #5d8817 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_marker-layer .ace_bracket {
        margin: -1px 0 0 -1px;
        border: 1px solid #575757 /* 1px solid #42474a */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_marker-layer .ace_active-line {
        background: #24272d /* #00000012 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_gutter-active-line {
        background-color: #24272d /* #2c2f31 */ /* !! to be reviewed */
    }

    #ace-editor.ace-tm .ace_marker-layer .ace_selected-word {
        background: #343b4a; /* #191c1d; */ /* !! to be reviewed */
        border: 1px solid #343b4a /* 1px solid #0a0a6e */ /* !! to be reviewed */
    }
/* } */

/* @media (prefers-color-scheme: dark) { */
    .code-container pre.prettyprint {
        border: 1px solid #575757 /* 1px solid #52585c */ /* !! to be reviewed */
    }

    .prettyprint li.L1,.prettyprint li.L3,.prettyprint li.L5,.prettyprint li.L7,.prettyprint li.L9 {
        background: #24272d /* #222426 */ /* !! to be reviewed */
    }

    .prettyprint .pln {
        color: #e9e9e9 /* #e8e6e3 */ /* !! to be reviewed */
    }

    .prettyprint .str {
        color: #b3f6d1 /* #6dff6d */ /* !! to be reviewed */
    }

    .prettyprint .kwd {
        color:  #f7c67f /* #7aabff */ /* !! to be reviewed */
    }

    .prettyprint .com {
        color:  #70767d; /* #ff6d6d */ /* !! to be reviewed */
        color: #d06868;
    }

    .prettyprint .typ {
        color: #f7c67f /* #ff85ff */ /* !! to be reviewed */
    }

    .prettyprint .lit {
        color: #b3f6d1 /* #85ffff */ /* !! to be reviewed */
    }

    .prettyprint .clo,.prettyprint .opn,.prettyprint .pun {
        color: #dadada /* #ffff85 */ /* !! to be reviewed */
    }

    .prettyprint .tag {
        color: #f7c67f /* #7aabff */ /* !! to be reviewed */
    }

    .prettyprint .atn {
        color: #e9e9e9 /* #ff85ff */ /* !! to be reviewed */
    }

    .prettyprint .atv {
        color: #b3f6d1 /* #6dff6d */ /* !! to be reviewed */
    }

    .prettyprint .var,.prettyprint .dec {
        color: #e9e9e9 /* #ff85ff */ /* !! to be reviewed */
    }

    .prettyprint .fun {
        color: #f7c67f /* red */ /* !! to be reviewed */
    }
/* } */

.ea-content,.ea-callout {
    margin: 0 !important
}

#about-user .ethical-ads {
    margin: 0 calc(-1em - 5px)
}

@media screen and (max-width: 960px) {
    #about-user .ethical-ads {
        margin:0 -1.2vw
    }
}

@media screen and (max-width: 400px) {
    #about-user .ethical-ads {
        margin:0 -1em
    }
}

#user-show-ea+.report-link {
    top: 65px
}

.expander {
    cursor: pointer;
    display: block;
    color: #670000;
    border-radius: 3px;
    background-color: #1b1b1e;
    position: absolute;
    width: 20px;
    height: 20px;
    text-align: center;
    inset-inline-end: -22px;
    bottom: 0
}

.expanded {
    overflow: auto
}

.collapsed {
    overflow: hidden
}

.comment {
    margin-bottom: 20px
}

.comment-entry {
    width: 100%;
    height: 10em
}

.discussion-meta,.comment-meta,.notification-meta {
    display: flex;
    align-items: flex-end
}

.discussion-meta,.notification-meta {
    font-size: 11px
}

.comment-meta {
    font-size: smaller;
    margin-bottom: 2px
}

.comment-meta-item-main {
    font-size: medium;
    font-weight: 700
}

.comment-meta-item+.comment-meta-item {
    margin-left: 15px
}

.discussion-meta-item,.notification-meta-item {
    flex: 1;
    text-align: left
}

.discussion-meta-item:not(:first-child) {
    margin-left: 8px
}

.discussion-meta-item:not(:last-child) {
    margin-right: 8px
}

.discussion-meta-item:last-child {
    text-align: right
}

.comment-meta-spacer {
    flex: 1
}

.post-reply {
    margin-top: 20px
}

.post-reply h3,.edit-comment-form h3 {
    margin-bottom: 0
}

.post-reply input[type=submit],.edit-comment-form input[type=submit] {
    margin-top: 5px
}

.discussion-up-level {
    font-size: smaller;
    margin-top: 0
}

.edit-comment-form {
    display: none
}

.edit-comment-mode .edit-comment-form {
    display: block
}

.edit-comment-mode .user-content,.edit-comment-mode .comment-meta {
    display: none
}

.discussion-rating {
    margin-top: 10px
}

.discussion-list,.notification-list {
    padding-bottom: 0
}

.discussion-list-item,.notification-list-item {
    padding-top: 10px;
    border-top: 1px solid #565656
}

.discussion-list-container:first-child .discussion-list-item {
    border-top: 0
}

.discussion-list-logged-in .discussion-read,.notification-read {
    background-color: #2c303a;
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px
}

.script-discussion-list .discussion-list-item:last-child {
    border-bottom: 1px solid #CCC
}

a.discussion-title,.notification-list-item a  {
    display: block;
    text-decoration: none;
    color: #d0d0d0;
    padding: 4px 0 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}

.discussion-title,.notification-list-item a {
    vertical-align: middle
}

.discussion-title:hover,.notification-list-item a {
    color: #f6f6f6;
}

.rating-icon,.badge-deleted {
    border: 2px solid black;
    border-radius: 5px;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 800;
    padding: 2px 5px;
    margin-right: 5px;
    display: inline-block;
    text-align: center;
    min-width: 45px;
    position: relative;
    top: -1px
}

.rating-icon-good {
    border-color: #258925;
    background-color: #cce9cc;
    color: #0f4d0f
}

.rating-icon-ok {
    border-color: #a7a71e;
    background-color: #ffffd4;
    color: #4f4f12
}

.rating-icon-bad {
    border-color: #cf2929;
    background-color: #f2c7c7;
    color: #440d0d
}

.discussion-meta-item-script-name {
    overflow: hidden
}

.discussion-meta-item-script-name a {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block
}

.comment .user-content>*:first-child {
    margin-top: 0
}

.comment-screenshot-control {
    font-size: smaller;
    padding: .5em 0
}

.discussion-header,.discussion-list-header,.notification-list-header {
    display: flex;
    margin-top: 30px;
    margin-bottom: 20px
}

@media screen and (max-width:400px) {
	.discussion-header, .discussion-list-header, .notification-list-header, .user-list-header {
		margin-top: 15px;
		margin-bottom: 10px
	}
}

.discussion-header-no-script {
    margin-top: 16px
}

.discussion-header>*:first-child,.discussion-list-header h2,.notification-list-header>*:first-child {
    flex: 1;
    margin: 0 !important
}

.discussion-header h2,.discussion-header .discussion-up-level,.notification-list-header h2 {
    margin: 0
}

.discussion-header .badge {
    vertical-align: middle
}

.discussion-actions,.notification-actions {
    font-size: smaller
}

.discussion-subscribed .discussion-subscribe,.discussion-not-subscribed .discussion-unsubscribe {
    display: none
}

.post-discussion label:not(.radio-label),.post-reply label:not(.radio-label),.post-discussion .form-note,.post-reply .form-note {
    font-size: smaller
}

#main-header {
    background-color: #967474;
    background-image: linear-gradient(#b93030,#891b1b);
    box-shadow: 0 0 15px 2px #00000080;
    padding: .25em 0
}

#main-header .width-constraint {
    padding: 0 0 .25em;
    position: relative
}

#site-name img {
    vertical-align: bottom
}

#site-name-text {
    display: inline-block;
    vertical-align: top
}

#site-name-text h1 {
    line-height: 1.1em
}

#main-header,#main-header a,#main-header a:visited,#main-header a:active {
    color: #fff;
}

#main-header h1 {
    font-size: 72px;
    margin: 0;
    letter-spacing: -2px
}

#main-header h1 a {
    text-decoration: none
}

#main-header .subtitle {
    margin: -8px 0 0 10px;
    font-size: .7em;
    text-shadow: -1px -1px 0px #670000,1px -1px 0px #670000,-1px 1px 0px #670000,1px 1px 0px #670000
}

#site-nav>nav,#nav-user-info {
    text-align: end;
    position: absolute;
    right: 0
}

#site-nav>nav {
    bottom: 0
}

#nav-user-info {
    top: 0
}

#site-nav>nav a:hover {
    color: #fff
}

#site-nav>nav {
    padding: 0
}

#site-nav>nav>li {
    list-style-type: none;
    display: inline-block
}

#site-nav>nav>li+li {
    margin-left: .5em
}

#script-search,.language-selector {
    display: inline
}

#nav-user-info {
    font-size: small
}

#nav-user-info select,#nav-user-info input {
    font-size: 11px
}

nav nav {
    position: absolute;
    right: 0;
    background-color: #9c2323;
    min-width: 100%;
    display: none;
    padding: 5px 0;
    z-index: 10
}

nav nav li {
    white-space: nowrap;
    margin: 0
}

nav nav li a {
    display: block;
    padding: 5px 15px
}

nav a:hover+nav,nav nav:hover,nav a:focus+nav {
    display: block
}

.with-submenu {
    position: relative;
    padding-right: 15px
}

nav .with-submenu>a:after {
    content: " ▾"
}

@media screen and (max-width: 920px) {
    #site-name img {
        max-width:96px;
        max-height: 96px;
        width: 12%;
        height: 12%
    }

    #site-name-text {
        margin-top: 2.3vw;
        margin-bottom: 1.15vw
    }

    #main-header h1 {
        font-size: 8.3vw
    }

    #main-header .subtitle {
        margin: -.8em 0 0 10px;
        font-size: 2vw
    }

    #site-nav {
        margin-top: -1vw
    }

    #site-nav>nav,#nav-user-info {
        display: block;
        position: unset;
        right: unset;
        padding-top: .3em
    }

    #site-nav>nav {
        bottom: unset
    }

    #nav-user-info {
        top: unset;
        font-size: unset;
        width: 100%
    }

    #nav-user-info .sign-in-link {
        padding-right: .7em
    }

    #script-search,.language-selector {
        display: unset
    }
}

#mobile-nav {
	display: none
}

.mobile-nav-opener {
	cursor: pointer;
	position: absolute;
	right: 0;
	top: 0;
	font-size: 8.3vw;
	padding: 0 2vw
}

#mobile-nav .collapsed {
	display: none
}

#mobile-nav nav {
	text-align: end;
	position: absolute;
	top: calc(100% + 4px);
	right: -1.2vw;
	background-color: #900;
	z-index: 1000;
	border-radius: 0 0 0 5px;
	font-size: 24px
}

#mobile-nav nav li {
	list-style-type: none
}

#mobile-nav nav li > a {
	display: block;
	padding: 10px 15px
}

#mobile-nav nav select {
	margin: 10px 15px
}

#mobile-nav nav li.multi-link-nav {
	padding: 10px 15px
}

#mobile-nav nav li.multi-link-nav a {
	display: inline;
	padding: 0
}

@media screen and (max-width:920px) {
	#site-nav {
		display: none
	}

	#mobile-nav {
		display: block
	}
}

@media screen and (max-width:400px) {
	#site-name {
		margin-left: 1em
	}
}

#test-require-result-ok,#test-require-result-not-ok {
    display: none;
    font-weight: 700
}

#test-require-result-ok {
    color: green
}

#test-require-result-not-ok {
    color: red
}

#home-script-nav {
    max-width: 700px;
    margin: 0 auto 15px;
    padding-bottom: 20px;
    border-bottom: 1px solid #BBBBBB
}

.home-search input {
    font-size: large
}

.home-search input[type=search] {
    width: 100%
}

#home-top-sites {
    overflow: hidden;
    margin-top: 5px
}

#home-top-sites a {
    margin: 0 5px
}

#home-step-1,#home-step-2,#home-step-3 {
    overflow: auto
}

#home-step-1 figure {
    float: right;
    max-width: 50%;
    margin-inline-end:10px;margin-top: 0
}

#home-step-2 figure {
    float: left;
    max-width: 50%;
    margin-inline-start:7px;margin-top: 0
}

#home-step-2 li {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
}

@media screen and (max-width: 680px) {
    #home-step-1 figure,#home-step-2 figure,#home-step-3 figure {
        float: unset;
        max-width: unset;
        width: fit-content;
        margin: 0 auto
    }

    [id^=home-step-] figure img {
        width: 100%;
        height: auto
    }
}

.super-title {
    text-align: center
}

.browser-list {
    display: none
}

#desktop-browser-list {
    display: block
}

.browser-list-selector:not(.browser-list-selector-active) {
    text-decoration: underline;
    cursor: pointer
}

.browser-list-selector-active {
    font-weight: 700
}

.browser-list-selector:not(:last-child) {
    margin-right: 1em
}

.highlight {
    background-color: #ff0
}

#install-area {
    margin-bottom: 1em
}

#install-area .install-link:hover,#install-area .install-link:focus,#install-area .install-help-link:hover,#install-area .install-help-link:focus {
    transition: box-shadow .2s;
    box-shadow: 0 8px 16px #0003,0 6px 20px #00000030
}

.install-link,.install-link:visited,.install-link:active,.install-link:hover,.install-help-link {
    transition: box-shadow .2s;
    display: inline-block;
    background-color: #236d23;
    padding: .5em 1em;
    color: #fff;
    text-decoration: none;
    border-radius: .25rem 0 0 .25rem
}

.install-help-link,.install-help-link:visited,.install-help-link:active,.install-help-link:hover {
    background-color: #1e971e;
    color: #fff;
    border-radius: 0 .25rem .25rem 0
}

.installation-instructions-modal-content-firefox,.installation-instructions-modal-content-chrome,.installation-instructions-modal-content-opera,.installation-instructions-modal-content-safari,.installation-instructions-modal-content-edge,.installation-instructions-modal-content-other {
    display: none
}

.installation-instructions-modal-firefox .installation-instructions-modal-content-firefox,.installation-instructions-modal-chrome .installation-instructions-modal-content-chrome,.installation-instructions-modal-opera .installation-instructions-modal-content-opera,.installation-instructions-modal-safari .installation-instructions-modal-content-safari,.installation-instructions-modal-edge .installation-instructions-modal-content-edge,.installation-instructions-modal-other .installation-instructions-modal-content-other {
    display: block
}

.installation-instructions-modal-content-bypass,.list-option-groups {
    font-size: smaller
}

.list-option-group {
    margin-bottom: 1em
}

.list-option-group ul {
    margin: .5em 0 0;
    list-style-type: none;
    padding: 1em 0;
    box-shadow: 0 0 5px #17181b;
    border: 1px solid #1b1c1f;
    border-radius: 5px;
    background-color: #2b2f38;
}

.list-option-group a {
    padding: .35em 1em;
    display: block
}

.list-option-group a:hover,.list-option-group a:focus {
    background: linear-gradient(#3a455c,#343f53);
    text-decoration: none;
    box-shadow: inset 0 -1px #212530, inset 0 1px #1e2127;
}

.list-option-group .list-current {
    border-left: 7px solid #d63535;
    box-shadow: inset 0 1px #0000001a,inset 0 -1px #0000001a;
    margin: 0 0 0 -4px;
    padding: .4em 1em .4em calc(1em - 3px);
    background: linear-gradient(#495a71,#3d485a);
}

@media screen and (min-width: 440px) and (max-width: 960px) {
    .list-option-group a,.list-option-group .list-current {
        padding-left:1.2vw;
        padding-right: 1.2vw
    }
}

.list-option-button {
    display: block;
    background-color: #3c3e45;
    text-align: center;
    text-decoration: none;
    color: #d7d7d7!important;
    border: 1px solid #BBBBBB;
    padding: .5em;
    font-weight: 700
}

.list-option-button:hover,.list-option-button:focus {
    background: linear-gradient(#46464f,#3b424a);
    text-decoration: none
}

.list-option:not(.list-current) select {
    width: calc(100% - 1.4em + 3px);
    margin: .4em 1em .4em calc(1em - 3px)
}

.list-option.list-current select,.log-table {
    width: 100%
}

.log-table th {
    text-align: left
}

.log-table td,.log-table th {
    padding: 0 5px
}

.log-table td .possibly-long-text {
    max-width: 500px;
    overflow-wrap: break-word
}

::backdrop {
    background: #00000080 /* to be reviewed */
}

@media (prefers-color-scheme: dark) {
    ::backdrop {
        background:#fff9 /* to be reviewed */
    }
}

dialog {
    background-color: #24272d; /* to be reviewed */
    color: #e9e9e9; /* to be reviewed */
    padding: 30px;
    max-width: 500px;
    max-height: 100vh;
    border-radius: 4px;
    overflow-y: auto;
    box-sizing: border-box
}

.modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center
}

.modal__title {
    margin-top: 0!important;
    margin-bottom: 0;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.25;
    box-sizing: border-box
}

.modal__close {
    background: transparent;
    border: 0;
    padding: 0
}

.modal__header .modal__close:before {
    content: "✕"
}

.modal__content {
    margin-bottom: 2rem
}

.modal__content q {
    font-style: italic
}

.modal__btn {
    font-size: .875rem;
    padding: .5rem 1rem;
    background-color: #e6e6e6;
    color: #000c;
    border-radius: .25rem;
    border-style: none;
    border-width: 0;
    cursor: pointer;
    -webkit-appearance: button;
    text-transform: none;
    overflow: visible;
    line-height: 1.15;
    margin: 0 0 0 .5rem;
    will-change: transform;
    -moz-osx-font-smoothing: grayscale;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    transition: -webkit-transform .25s ease-out;
    transition: transform .25s ease-out;
    transition: transform .25s ease-out,-webkit-transform .25s ease-out
}

.modal__btn:focus,.modal__btn:hover {
    -webkit-transform: scale(1.05);
    transform: scale(1.05)
}

.modal__accept {
    background-color: #147914;
    color: #f4f4f4;
}

.modal__footer {
    text-align: right
}

.notification-widget {
    display: inline-block;
    width: 1em;
    height: 1em;
    text-align: center;
    line-height: 1em;
    padding: 2px;
    background-color: #1e3f83; 
    border-radius: 50%;
    color: #fff;
    text-decoration: none
}

.notification-type-consecutive_bad_ratings a {
    white-space: normal
}

.post-install {
    margin: 1em 0;
    border-radius: 2px;
    padding: 5px;
    max-width: 600px;
    display: none;
    align-items: center;
    background-color: #264955;
    border: 1px solid #264955;
    position: relative
}

.post-install-label {
    font-size: xx-small;
    position: absolute;
    top: -2px;
    left: 2px;
    opacity: .5
}

.post-install-text {
    text-align: center;
    align-items: center;
    flex: 1
}

.post-install-text p {
    margin: 0;
    padding: 0
}

.post-install-button {
    text-align: center;
    margin-left: 10px;
    white-space: nowrap
}

.preview-results {
    border: 1px solid gray;
    overflow: auto;
    box-sizing: border-box;
    margin: 0;
    padding: 16px
}

.preview-results>p:first-child {
    margin-top: 0
}

.preview-results>p:last-child {
    margin-bottom: 0
}

.previewable textarea {
    margin: 0
}

.previewable .tabs {
    margin-top: 10px;
    margin-bottom: -4px
}

#report_explanation {
    width: 100%;
    height: 10em
}

.reportable {
    position: relative
}

.report-link-abs {
    position: absolute;
    top: 0;
    right: 0;
    font-size: smaller;
    margin-right: 16px;
    margin-top: 8px
}

.report-list-item:not(:last-child) {
    padding-bottom: 20px;
    border-bottom: 1px solid gray;
    margin-bottom: 20px
}

.report-list-item .inline-form {
    margin-right: 5px
}

.report-resolution-options {
    display: inline-block;
    vertical-align: top;
    min-width: 30%
}

.report-resolution-options+.report-resolution-options {
    margin-left: 1em
}

.report-resolution-options input[type=submit] {
    margin-top: .5em
}

.report-resolution-options textarea {
    width: 100%
}

.report-screenshot-control {
    font-size: smaller;
    padding: .5em 0
}

.unauthorized-code-comparison th {
    text-align: left
}

.unauthorized-code-comparison th,.unauthorized-code-comparison td {
    padding-right: 1em
}

body:lang(he),body:lang(ar),body:lang(ug),body:lang(ckb) {
    direction: rtl
}

:not(:lang(he)):not(:lang(ar)):not(:lang(ug)):not(:lang(ckb)) {
    direction: ltr
}

body:lang(he) #main-header,body:lang(ar) #main-header,body:lang(ug) #main-header,body:lang(ckb) #main-header {
    direction: ltr
}

:lang(ar) #home-step-1 figure,:lang(he) #home-step-1 figure,:lang(ug) #home-step-1 figure,:lang(ckb) #home-step-1 figure {
    float: left
}

:lang(ar) #home-step-2 figure,:lang(he) #home-step-2 figure,:lang(ug) #home-step-2 figure,:lang(ckb) #home-step-2 figure {
    float: right
}

#script-info {
    border: 1px solid #000000;
    border-radius: 5px;
    clear: left;
    background-color: #2e3037;
    margin: 1em 0 0;
    box-shadow: 0 0 5px #282828;
}

#script-content {
    margin-top: 1.5em
}

#script-content>*:first-child {
    margin-top: 0
}

#script-info header h2 {
    margin: .25em 0 0;
    font-size: 2em;
    overflow-wrap: anywhere
}

#script-description {
    margin: 0
}

#version-note,#reported-note,#deleted-note {
    font-style: italic;
    background-color: #5b5b09;
    border: 2px dotted #CC9999;
    color: #e9e9e9; /* to be reviewed */
    padding: .5em
}

#script-feedback-suggestion {
    margin: .75em 0
}

#script-content h3 {
    margin-top: 30px
}

.checkup-list {
    padding-inline-start: 1em
}

.checkup-list li {
    list-style-type: "✗";
    padding-inline-start: .5em
}

.checkup-list li::marker {
    color: red
}

.checkup-list li.good-check {
    list-style-type: "✓"
}

.checkup-list li.good-check::marker {
    color: green
}

.script-meta-block {
    max-width: 600px;
    column-count: 2
}

.script-meta-block>*:last-child {
    margin-bottom: 1em
}

.inline-script-stats {
    display: grid;
    grid-template-columns: max-content auto;
    margin: 0 22px 0 0
}

.inline-script-stats,.inline-script-stats dt,.inline-script-stats dd {
    vertical-align: top;
    padding: 0;
    font-size: small
}

.inline-script-stats dt,.inline-script-stats dd {
    box-sizing: border-box;
    overflow-wrap: break-word;
    margin: 1px 0
}

.inline-script-stats dt {
    font-weight: 700;
    text-align: end;
    padding-inline-end: 1em
}

dd.script-list-ratings {
    margin-top: 0;
    margin-bottom: 0
}

@media screen and (max-width: 600px) {
    .script-meta-block {
        column-count:1
    }
}

.script-antifeatures span[title] {
    text-decoration: underline;
    text-decoration-style: dotted
}

.script-show-compatibility {
    vertical-align: bottom
}

.browser-compatible,.browser-incompatible,.browser-incompatible-marker {
    width: 16px;
    height: 16px
}

.browser-incompatible {
    opacity: .5
}

.browser-incompatible-marker {
    position: absolute
}

.script-lock-appeal-actions form {
    display: inline-block;
    margin-top: 1em
}

.change-script-set section {
    border-bottom: 1px solid #DDDDDD;
    padding-bottom: 1em
}

.change-script-set textarea {
    height: 5em
}

.change-script-set .selection-box {
    width: 45%;
    display: inline-block;
    vertical-align: top;
    margin-bottom: 1em
}

@media screen and (max-width: 720px) {
    .change-script-set .selection-box {
        width:100%
    }
}

.change-script-set select[multiple] {
    width: 100%
}

.add-script-set label {
    font-weight: 700;
    display: block
}

.add-automatic-script-set-4>* {
    vertical-align: top
}

.history_versions {
    display: table;
    padding: 0
}

.history_versions > li {
    display: table-row
}

.diff-controls,.version-number,.version-date,.version-changelog {
    display: table-cell;
    padding-bottom: .5em
}

.diff-controls,.version-number,.version-date {
    white-space: nowrap;
    padding-right: 1em
}

.version-changelog {
    overflow-wrap: anywhere
}

.version-changelog img {
    max-width: 100%
}

.version-changelog p:first-child {
    margin-top: 0
}

.version-changelog p:last-child {
    margin-bottom: 0
}

.remove-attachment {
    margin-top: 20px
}

.remove-attachment input {
    margin-left: 0
}

.sidebarred {
    display: flex
}

.sidebarred-main-content {
    flex: 1
}

.sidebar {
    width: 200px;
    padding-top: 1.75em;
    padding-bottom: .75em;
    margin-inline-start:1.5em;
    flex: none
}

.close-sidebar, .open-sidebar {
	cursor: pointer
}

.close-sidebar {
	display: none
}

.open-sidebar {
	visibility: hidden;
    float: right;
    background-color: #fff;
    padding: 2px 1.2vw;
	margin-left: 1.2vw;
    margin-right: -1.2vw;
    border-radius: 3px 0 0 3px;
    border-width: 1px 0 1px 1px;
    border-style: solid;
    border-color: gray
}

.sidebar-title {
    flex: 1
}

@media screen and (max-width: 800px) {
    .sidebarred {
        display:block;
        position: relative
    }

    .sidebar {
        position: absolute;
        right: -1.2vw;
        top: 0;
        background: white;
        padding-top: 0;
        padding-left: 1em;
        padding-right: 1em;
        border-width: 1px 0 1px 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 3px 0 0 3px
    }

    .sidebar.collapsed {
        display: none
    }

    .close-sidebar {
        display: flex;
        margin-bottom: 1.5em;
        background-color: #eee;
        border-bottom: 1px solid black;
        margin-left: -16px;
        margin-right: -16px;
        padding: .25em 1.2vw .25em 16px
    }

    .open-sidebar.sidebar-collapsed {
        visibility: visible
    }
}

@media screen and (min-width: 800px) {
    .sidebarred-main-content {
        max-width:calc(100% - 224px)
    }
}

@media screen and (max-width:400px) {
	.open-sidebar {
		margin-right: 0
	}

	.close-sidebar {
		padding-right: 2.4vw;
		margin-right: -1em
	}
}

.tabs {
    list-style: none;
    padding: 0 1em;
    margin: 0 -1em;
    display: flex;
    position: relative;
    top: -3.5px;
    flex-wrap: wrap
}

.tabs>* {
    align-items: stretch
}

.tabs>*>* {
    padding: .25em .5em .5em;
    display: block
}

.tabs a {
    text-decoration: none;
    cursor: pointer
}

.tabs .current,.tabs>*:not(.current) a:hover,.tabs>*:not(.current) a:focus {
    background: #ffffff08;
    box-shadow: inset 1px 0 #0000001a,inset -1px 0 #0000001a,inset 0 -1px #0000001a
}

.tabs .current {
    box-shadow: inset 1px 0 #ffffff1a, inset -1px 0 #ffffff1a, inset 0 -1px #ffffff1a; /* to be reviewed - omit ? */
    border-top: 7px solid #d63535
}

.tabs>*:not(.current) a {
    margin-top: 3.5px;
    padding-top: calc(.25em + 3.5px)
}

.user-content {
    /* outline: 1px solid transparent; */
    background: linear-gradient(to right,transparent,transparent 1em);
    border-left: 2px solid #70767d;
    padding: .5em 1em;
    overflow-x: auto
}

.user-content>p:first-child {
    margin-top: 0
}

.user-content>p:last-child {
    margin-bottom: 0
}

.user-content img {
    max-width: 100%
}

.user-screenshots * {
    vertical-align: middle
}

.user-screenshots a {
    text-decoration: none
}

.comment-screenshot-control {
    margin: 10px 0
}

.remove-images {
    display: flex;
    margin-top: 5px
}

.remove-image {
    border: 2px solid black;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    flex-direction: column
}

.remove-image:not(:first-child) {
    margin-left: 5px
}

.remove-image img {
    display: block
}

.remove-image-selecter,.comment .user-content .user-screenshots {
    margin-top: 10px
}

#additional-info .user-screenshots {
    margin-top: 1em
}

.user-content blockquote {
    margin-left: 10px;
    padding-left: 10px;
    border-left: 2px solid #CCC
}

.user-content>ol:first-child,.user-content>ul:first-child {
    margin-top: 0
}

.user-content>ol:last-child,.user-content>ul:last-child {
    margin-bottom: 0
}

@keyframes lum-fade {
    0% {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

@keyframes lum-fadeZoom {
    0% {
        transform: scale(.5);
        opacity: 0
    }

    to {
        transform: scale(1);
        opacity: 1
    }
}

@keyframes lum-loader-rotate {
    0% {
        transform: translate(-50%,-50%) rotate(0)
    }

    50% {
        transform: translate(-50%,-50%) rotate(-180deg)
    }

    to {
        transform: translate(-50%,-50%) rotate(-360deg)
    }
}

@keyframes lum-loader-before {
    0% {
        transform: scale(1)
    }

    10% {
        transform: scale(1.2) translate(6px)
    }

    25% {
        transform: scale(1.3) translate(8px)
    }

    40% {
        transform: scale(1.2) translate(6px)
    }

    50% {
        transform: scale(1)
    }

    60% {
        transform: scale(.8) translate(6px)
    }

    75% {
        transform: scale(.7) translate(8px)
    }

    90% {
        transform: scale(.8) translate(6px)
    }

    to {
        transform: scale(1)
    }
}

@keyframes lum-loader-after {
    0% {
        transform: scale(1)
    }

    10% {
        transform: scale(1.2) translate(-6px)
    }

    25% {
        transform: scale(1.3) translate(-8px)
    }

    40% {
        transform: scale(1.2) translate(-6px)
    }

    50% {
        transform: scale(1)
    }

    60% {
        transform: scale(.8) translate(-6px)
    }

    75% {
        transform: scale(.7) translate(-8px)
    }

    90% {
        transform: scale(.8) translate(-6px)
    }

    to {
        transform: scale(1)
    }
}

.lum-lightbox {
	background: #0009
}

.lum-lightbox-inner {
    top: 2.5%;
    right: 2.5%;
    bottom: 2.5%;
    left: 2.5%
}

.lum-lightbox-inner img {
    position: relative
}

.lum-lightbox-inner .lum-lightbox-caption {
    margin: 0 auto;
    color: #fff;
    max-width: 700px;
    text-align: center
}

.lum-loading .lum-lightbox-loader {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 66px;
    height: 20px;
    animation: lum-loader-rotate 1.8s infinite linear
}

.lum-lightbox-loader:before,.lum-lightbox-loader:after {
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    margin-top: -10px;
    border-radius: 20px;
	background: #ffffffe6
}

.lum-lightbox-loader:before {
    left: 0;
    animation: lum-loader-before 1.8s infinite linear
}

.lum-lightbox-loader:after {
    right: 0;
    animation: lum-loader-after 1.8s infinite linear;
    animation-delay: -.9s
}

.lum-lightbox.lum-opening {
    animation: lum-fade .18s ease-out
}

.lum-lightbox.lum-opening .lum-lightbox-inner {
    animation: lum-fadeZoom .18s ease-out
}

.lum-lightbox.lum-closing {
    animation: lum-fade .3s ease-in;
    animation-direction: reverse
}

.lum-lightbox.lum-closing .lum-lightbox-inner {
    animation: lum-fadeZoom .3s ease-in;
    animation-direction: reverse
}

.lum-img {
    transition: opacity .12s ease-out
}

.lum-loading .lum-img {
    opacity: 0
}

.lum-gallery-button {
    overflow: hidden;
    text-indent: 150%;
    white-space: nowrap;
    background: transparent;
    border: 0;
    margin: 0;
    padding: 0;
    outline: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 100px;
    max-height: 100%;
    width: 60px;
    cursor: pointer
}

.lum-close-button {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 32px;
    height: 32px;
    opacity: .3
}

.lum-close-button:hover {
    opacity: 1
}

.lum-close-button:before,.lum-close-button:after {
    position: absolute;
    left: 15px;
    content: " ";
    height: 33px;
    width: 2px;
    background-color: #fff
}

.lum-close-button:before {
    transform: rotate(45deg)
}

.lum-close-button:after {
    transform: rotate(-45deg)
}

.lum-previous-button {
    left: 12px
}

.lum-next-button {
    right: 12px
}

.lum-gallery-button:after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    width: 36px;
    height: 36px;
    border-top: 4px solid rgba(255,255,255,.8)
}

.lum-previous-button:after {
    transform: translateY(-50%) rotate(-45deg);
    border-left: 4px solid rgba(255,255,255,.8);
    box-shadow: -2px 0 #0003;
    left: 12%;
    border-radius: 3px 0 0
}

.lum-next-button:after {
    transform: translateY(-50%) rotate(45deg);
    border-right: 4px solid rgba(255,255,255,.8);
    box-shadow: 2px 0 #0003;
    right: 12%;
    border-radius: 0 3px 0 0
}

@media (max-width: 460px) {
    .lum-lightbox-image-wrapper {
        display:flex;
        overflow: auto;
        -webkit-overflow-scrolling: touch
    }

    .lum-lightbox-caption {
        width: 100%;
        position: absolute;
        bottom: 0
    }

    .lum-lightbox-position-helper {
        margin: auto
    }

    .lum-lightbox-inner img {
        max-width: none;
        max-height: none
    }
}




input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  transition: background-color 9000000000s ease-in-out 0s, color 9000000000s ease-in-out 0s;
}



[style~="color:#21c"] {
    color: #35deff !important;
}
[style~="color:#601d9f"] {
    color: #a47cca !important;
}

[style~="color:blue"] {
    color: #39adff !important;
}

[style~="color:#4183c4"], [style~="color: #4183c4"], [style*="color:#4183c4;"], [style*="color: #4183c4;"]{
    color: #9fceea !important;
}


    .user-content[class] div[style*="color:"] {
        filter:invert(1);
    }
    
    .user-content[class] div[style*="color:"] a {
        filter:invert(1);
    }

`,

// https://greasyfork.org/en/users/webhook-info
`

  
  `,
  
  // https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/prettify.css

  `
  
  /*

[dark] .pln {
    color: #d2cdcd
}

@media screen {
    [dark] .str {
        color: #66ac66
    }

    [dark] .kwd {
        color: #6f6f9f
    }

    [dark] .com {
        color: #ca9b9b
    }

    [dark] .typ {
        color: #8a608a
    }

    [dark] .lit {
        color: #507a7a
    }

    [dark] .clo,[dark] .opn,[dark] .pun {
        color: #7e7e50
    }

    [dark] .tag {
        color: #58588c
    }

    [dark] .atn {
        color: #7f4c7f
    }

    [dark] .atv {
        color: #528152
    }

    [dark] .dec,[dark] .var {
        color: #724872
    }

    [dark] .fun {
        color: #a64f4f
    }
}

@media print,projection {
    [dark] .kwd,[dark] .tag,[dark] .typ {
        font-weight: 700
    }

    [dark] .str {
        color: #496e49
    }

    [dark] .kwd {
        color: #47476d
    }

    [dark] .com {
        color: #774d4d;
        font-style: italic
    }

    [dark] .typ {
        color: #583a58
    }

    [dark] .lit {
        color: #466d6d
    }

    [dark] .clo,[dark] .opn,[dark] .pun {
        color: #636341
    }

    [dark] .tag {
        color: #53537d
    }

    [dark] .atn {
        color: #6f466f
    }

    [dark] .atv {
        color: #497749
    }
}

[dark] pre.prettyprint {
    padding: 2px;
    border: 1px solid #888
}

[dark] ol.linenums {
    margin-top: 0;
    margin-bottom: 0
}


[dark] li.L0,
[dark] li.L2,
[dark] li.L4,
[dark] li.L6,
[dark] li.L8 {
    background: rgb(38, 35, 35);
}


[dark] li.L1,
[dark] li.L3,
[dark] li.L5,
[dark] li.L7,
[dark] li.L9 {
    background: #161111;
}

*/



  
  `,

// https://greasyfork.org/en/scripts/482487-greasyfork-dark/stats
// https://github.com/greasyfork-org/greasyfork/blob/main/app/views/scripts/stats.html.erb#L28
`

[dark] #install-stats-chart-container,
[dark] #weekly-install-stats-chart-container,
[dark] #update-check-stats-chart-container {
    filter: invert(1) brightness(2);
    background-color: #e9e3d9;
}

.notification-widget {
    box-shadow: 0px 0px 6px #69d6c7; /* additional rule for making notification being easy to notice
}
`,


`

.prettyprint.linenums {
    background-color: initial;
}

`
  
  ].join('\n\n');

    const key01 = "7QdSEuQ5k8dH"
    const key02 = "SQwUTxgG6hhi"

    const removeNonColor = (text) => {

        const oriText = text;
        const cache01 = sessionStorage.getItem(key01);
        const cache02 = sessionStorage.getItem(key02);
        if (cache01 === `${text}` && cache02 && typeof cache02 === 'string') return cache02;

        let csso = stylis.compile(text);
        const ruleSet = new Set();
        const pp = new Set([
            // "overflow-y",
            // "margin",
            "background-color",
            "color",
            // "font-family",
            "outline",
            "border",
            // "direction",
            // "resize",
            // "vertical-align",
            "background-image",
            "box-shadow",
            // "padding",
            // "max-width",
            // "position",
            // "display",
            // "line-height",
            // "font-size",
            // "letter-spacing",
            // "text-decoration",
            "text-shadow",
            // "text-align",
            // "right",
            // "bottom",
            // "top",
            // "list-style-type",
            // "margin-left",
            // "min-width",
            // "z-index",
            // "white-space",
            // "padding-right",
            // "content",
            "border-radius",
            // "clear",
            // "margin-top",
            // "overflow-wrap",
            // "font-style",
            // "margin-bottom",
            "transition",
            // "padding-left",
            // "list-style",
            "border-bottom",
            // "width",
            // "box-sizing",
            // "height",
            "border-style",
            // "font-weight",
            // "float",
            // "unicode-bidi",
            // "word-wrap",
            "border-color",
            // "-moz-column-width",
            // "-webkit-column-width",
            // "column-width",
            "border-left",
            "border-collapse",
            // "opacity",
            "background-repeat",
            "background-size",
            "background-position",
            // "margin-right",
            // "min-height",
            // "padding-inline-end",
            // "-moz-appearance",
            // "-webkit-appearance",
            // "inset-inline-end",
            // "padding-inline-start",
            "background",
            // "padding-bottom",
            // "cursor",
            "border-top",
            // "appearance",
            "text-transform",
            // "overflow",
            // "max-height",
            // "overflow-x",
            // "align-items",
            // "flex",
            // "padding-top",
            "text-overflow",
            // "margin-inline-end",
            // "margin-inline-start",
            // "left",
            // "justify-content",
            "border-width",
            // "will-change",
            // "-moz-osx-font-smoothing",
            // "-webkit-backface-visibility",
            // "backface-visibility",
            "-webkit-transform",
            "transform",
            "animation",
            // "column-count",
            // "grid-template-columns",
            "text-decoration-style",
            // "flex-wrap",
            // "flex-direction",
            "animation-delay",
            "animation-direction",
            // "text-indent",
            "border-right",
            "filter"
        ]);

        function baseCSSO(csso) {

            let newCsso = new Set();

            for (const entry of csso) {
                newCsso.add(entry);
                if (entry.type === 'rule' && typeof entry.children === 'object' && (entry.children || 0).length >= 1) {

                    for (const childEntry of entry.children) {
                        ruleSet.add(childEntry)
                        if (childEntry.type === 'decl' && typeof childEntry.children === 'string' && typeof childEntry.props === 'string') {
                            // pp.add(childEntry.props)

                            if (childEntry.props === 'background-image' && childEntry.parent.value.startsWith('.external-login-container .')) {
                                ruleSet.delete(childEntry)
                            } else if (!pp.has(childEntry.props) && !childEntry.props.startsWith("--gfdark-")) {
                                ruleSet.delete(childEntry)
                            }

                        }

                    }
                    entry.children = [...ruleSet]
                    ruleSet.clear();
                } else if (entry.type === '@media') {

                    if (typeof entry.children === 'object' && (entry.children || 0).length >= 1) {
                        entry.children = baseCSSO(entry.children)
                    }

                } else if (entry.type === '@keyframes') {
                    newCsso.delete(entry);
                } else {

                    console.log(331, entry)
                }
            }

            return [...newCsso];


        }

        csso = baseCSSO(csso);





        text = stylis.serialize(csso, stylis.stringify)

        // console.log(stylis.compile(text))
        // console.log(text)

        // console.log([...pp])


        sessionStorage.setItem(key01, `${oriText}`);
        sessionStorage.setItem(key02, `${text}`);

        return text



    }

    const mo = new MutationObserver(() => {
        const head = document.head;
        if (!head) return;
        const css = head.querySelector('link[rel="stylesheet"][href*="/vite/assets/application-"][href*=".css"][media="screen"]');
        if (!css || css.parentNode !== head) return;
        mo.disconnect();
        mo.takeRecords();

        const text = `${removeNonColor(cssTextFn())}${generalCSSFn()}`;
        const blob = new Blob([text], { type: 'text/css; charset=UTF-8' });
        const blobURL = URL.createObjectURL(blob);
        const newLinkElm = document.createElement('link');
        newLinkElm.rel = 'stylesheet'
        newLinkElm.media = 'screen'
        newLinkElm.href = blobURL;
        newLinkElm.disabled = true;
        head.insertBefore(newLinkElm, css.nextSibling);

        const aoChange = () => {
            if (document.documentElement.hasAttribute('dark')) {
                newLinkElm.disabled = false;
            } else {
                newLinkElm.disabled = true;
            }
        }

        if (localStorage.darkMode === 'true') {
            document.documentElement.setAttribute('dark', '');
        }
        aoChange();
        let ao = new MutationObserver(aoChange);
        ao.observe(document.documentElement, { attributes: true, attributeFilter: ['dark'] });


    });
    mo.observe(document, { subtree: true, childList: true })


})();
