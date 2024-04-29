

(() => {


    if (!document.getElementById('afscript')) {
        const style = document.createElement('style');
        style.id = 'afscript';
        style.textContent = `
      @keyFrames aF1 {
        0% {
          order: 0;
        }
        100% {
          order: 1;
        }
      }
      #a-f[id] {
        visibility: collapse !important;
        position: fixed !important;
        display: block !important;
        top: -100px !important;
        left: -100px !important;
        margin:0 !important;
        padding:0 !important;
        outline:0 !important;
        border:0 !important;
        z-index:-1 !important;
        width: 0px !important;
        height: 0px !important;
        contain: strict !important;
        pointer-events: none !important;
        animation: 1ms steps(2, jump-none) 0ms infinite alternate forwards running aF1 !important;
      }
    `;
        (document.head || document.documentElement).appendChild(style);
    }

    /** @type {HTMLVideoElement} */
    const vv = document.querySelector('#movie_player video[src]');
    if (!vv) throw 'VIDEO is not found';
    const asc = document.createElement('a-f');
    asc.id = 'a-f';
    window.p44 = 0;
    window.p45 = 0;
    window.p46 = 0;
    let qr = null;
    asc.onanimationiteration = function () {
        if (qr !== null) qr = (qr(), null);
    }
    const pn1 = (resolve) => (qr = resolve);

    const pn2 = (resolve) => {
        vv.requestVideoFrameCallback(resolve);
    };
    const pn3 = (resolve) => {
        requestAnimationFrame(resolve);
    };
    document.documentElement.insertBefore(asc, document.documentElement.firstChild);

    let t0 = Date.now();
    (async () => {

        while (Date.now() - t0 < 5000) {
            window.p44++;
            await new Promise(pn1);
        }

    })();

    (async () => {

        while (Date.now() - t0 < 5000) {
            window.p45++;
            await new Promise(pn2);
        }

    })();

    (async () => {

        while (Date.now() - t0 < 5000) {
            window.p46++;
            await new Promise(pn3);
        }

    })();


})();