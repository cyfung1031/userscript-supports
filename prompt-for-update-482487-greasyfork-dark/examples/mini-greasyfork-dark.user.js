// Small fixture that mirrors the real cssTextFn/generalCSSFn boundary.
function miniGreasyForkDark() {
    const cssTextFn = () => [

        // general
        `
html {
    overflow-y: scroll;
}
body {
    background-color: #24272d;
    color: #e9e9e9;
}
a {
    color: #f7c67f; /* owner link color */
}
@media screen and (width <= 1228px) {
    .width-constraint {
        margin: auto 1.2vw;
    }
}
@media screen and (width <= 400px) {
    .width-constraint {
        margin: auto 0;
    }
}
:is(.pagination, .pagy) {
    display: block;
}
#site-nav > nav {
    display: flex;
}
.inline-script-stats {
    display: inline-block;
}
.diff ul {
    background: #1e1e1e;
}
.diff ul {
    color: #e9e9e9;
}
.diff li {
    --gfdark-diff-li-background-hover: #495678;
}
.diff li:hover {
    background: var(--gfdark-diff-li-background-hover);
}
[style~="color:#4183c4"] {
    color: #9fceea !important;
}
        `,

        // https://greasyfork.org/en/users/webhook-info
        ``,

        // stats and PrettyPrint supplemental fixture markers
        `.prettyprint.linenums { color: #b3f6d1; }`,
        `// https://greasyfork.org/en/scripts/482487-greasyfork-dark/stats`,
    ];

    return cssTextFn();
}

miniGreasyForkDark();
