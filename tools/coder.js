// javascript:((script,ci,b,bu)=>{(ci='4472e5a6f788cf6e6460624269160ce50b43e9ff')&&fetch(`https://raw.githubusercontent.com/cyfung1031/userscript-supports/${ci}/tools/coder.js`).then(r=>r.text()).then(t=>[(b=new Blob([t],{type:'text/javascript; charset=UTF-8'})),(bu=URL.createObjectURL(b)),(script.src=bu),document.head.appendChild(script)]&&new Promise(r=>script.onload=r)).then(k=>URL.revokeObjectURL(bu)).then(e=>console.log('JS Injected'))})(document.createElement('script'));

console.log('Coder.js');

const observablePromise = (proc, timeoutPromise) => {
    let promise = null;
    return {
      obtain() {
        if (!promise) {
          promise = new Promise(resolve => {
            let mo = null;
            const f = () => {
              let t = proc();
              if (t) {
                mo.disconnect();
                mo.takeRecords();
                mo = null;
                resolve(t);
              }
            }
            mo = new MutationObserver(f);
            mo.observe(document, { subtree: true, childList: true })
            f();
            timeoutPromise && timeoutPromise.then(() => {
              resolve(null)
            });
          });
        }
        return promise
      }
    }
  }

const onReadyPromise = new Promise(resolve=>{
    if (document.readyState !== 'loading') {
        resolve();
    } else {
        window.addEventListener("DOMContentLoaded", resolve, false);
    }
});

const darkThemeChecked = onReadyPromise.then(()=>{

    const bodyTextColor = window.getComputedStyle(document.body).color;

    let bodyM;
    if(bodyM= /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(bodyTextColor)){
        bodyM = [...bodyM].map(e=>+e);
        if(bodyM[1] === bodyM[2] && bodyM[2] === bodyM[3]){
            if(bodyM[1]<80) document.documentElement.removeAttribute('dark');
            else if(bodyM[1]>175) document.documentElement.setAttribute('dark','');
        }
    }

});

onReadyPromise.then(async ()=>{
    const cmBox = await observablePromise(()=>[...document.querySelectorAll('.CodeMirror')].filter(e=>e.CodeMirror && typeof e.CodeMirror.getValue === 'function' && typeof e.CodeMirror.setValue === 'function')[0]).obtain();
    const cm = cmBox.CodeMirror;
    if(!cm) return;

    Object.assign(cmBox.style,{
        display: 'none'
    });



    const vsPath = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs";
  
    const editorOptions = {
      automaticLayout: true,
      foldingStrategy: 'indentation',
      lineNumbers: 'on',
      readOnly: false,
      minimap: {
        enabled: false,
      },
      cursorStyle: 'line',
      scrollBeyondLastLine: false,
      showUnused: true,
      showDeprecated: true,
    };
  
    const compilerOptions = {
      allowNonTsExtensions: true,
      checkJs: true,
      noImplicitAny: true,
  
      allowJs: true,
      noUnusedLocals: false,
      noFallthroughCasesInSwitch: false,
      noImplicitThis: false,
  
    };
  
    const cssText01 = `
    .monaco-editor-container{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        /*display: none;*/
    }
    [monaco-editor-status="1"] .monaco-editor-container{
      display: block;
    }
    [monaco-editor-status="1"] .monaco-controlled-textarea{
      display: none;
    }
    [monaco-editor-status="2"] .monaco-editor-container{
      display: none;
    }
    [monaco-editor-status="2"] .monaco-controlled-textarea{
      display: block;
    }


    .editor-code {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .editor-code.flex-auto>div.monaco-editor-container {
        position: relative;
        flex-grow: 1;
    }

    `;
  
    const elmSet = {};
  
    function loadResource(type, url) {
      if (type === 'css') {
        return new Promise(resolve => {
          var link = document.createElement('link');
          var onload = function () {
            link.removeEventListener('load', onload, false);
            resolve();
          }
          link.addEventListener('load', onload, false);
          link.rel = 'stylesheet';
          link.href = url;
          document.head.appendChild(link);
        });
      } else if (type === 'js') {
        return new Promise(resolve => {
          var script = document.createElement('script');
          var onload = function () {
            script.removeEventListener('load', onload, false);
            resolve();
          }
          script.addEventListener('load', onload, false);
          script.src = url;
          document.head.appendChild(script);
        })
      }
    }


    /** @param {Map} m */
    function loadResourceWithBlobURL(type, url, m) {

        return new Promise(resolve => {
            let b, bu;
            const mime = type === 'js' ? 'text/javascript; charset=UTF-8' : type === 'css' ? 'text/css; charset=UTF-8' : 'text/plain; charset=UTF-8';
            fetch(url).then(r => r.text()).then(t => [(b = new Blob([t], { type: mime })), (bu = URL.createObjectURL(b))]).then(() => {


                if (type === 'css') {
                    var link = document.createElement('link');
                    link.dataset.url = url;
                    var onload = function () {
                        link.removeEventListener('load', onload, false);
                        if(m) m.set(url, bu);
                        resolve(bu);
                    }
                    link.addEventListener('load', onload, false);
                    link.rel = 'stylesheet';
                    link.href = bu;
                    document.head.appendChild(link);
                } else if (type === 'js') {
                    var script = document.createElement('script');
                    script.dataset.url = url;
                    var onload = function () {
                        script.removeEventListener('load', onload, false);
                        if(m) m.set(url, bu);
                        resolve(bu);
                    }
                    script.addEventListener('load', onload, false);
                    script.src = bu;
                    document.head.appendChild(script);
                }


            });

        })
      }

      function analyseURL(type, url,m){

        return new Promise(resolve => {
            let b, bu;
            const mime = type === 'js' ? 'text/javascript; charset=UTF-8' : type === 'css' ? 'text/css; charset=UTF-8' : 'text/plain; charset=UTF-8';
            fetch(url).then(r => r.text()).then(t => [(b = new Blob([t], { type: mime })), (bu = URL.createObjectURL(b))]).then(() => {

                if(m) m.set(url, bu);
                resolve(bu);

            });

        })

      }
  
    function createEditor(textArea) {
  
  
      // Setting up Monaco Editor requirements
      let require = {
        paths: {
          vs: vsPath,
        },
      };
  
      window.require = (window.require || {});
      window.require.paths = (window.require.paths || {});
      Object.assign(window.require.paths, require.paths);
  
  
      const addCssText = (id, text) => {
        if (document.getElementById(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = text;
        document.head.appendChild(style);
  
      }
  
      const codeLang = 'javascript';
  
      (async function () {

        const m = new Map();
  

        const setAttribute = Element.prototype.setAttribute78 = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(a, b){
            if (a === 'href' || a === 'src') {
                let c = m.get(b);
                if (c) b = c;
            }
            return arguments.length === 2 && typeof this.setAttribute78 === 'function' ? this.setAttribute78(a, b) : setAttribute.apply(this, arguments);
        };

        const WorkerClass = Worker;
        window.Worker = undefined;

        await analyseURL('js', `${vsPath}/language/typescript/tsWorker.js`, m);

        // Dynamically load CSS and JS
        await loadResourceWithBlobURL('css', `${vsPath}/editor/editor.main.css`, m);
        await loadResourceWithBlobURL('js', `${vsPath}/loader.js`, m);
        await loadResourceWithBlobURL('js', `${vsPath}/editor/editor.main.nls.js`, m);
        await loadResourceWithBlobURL('js', `${vsPath}/editor/editor.main.js`, m);

        await loadResourceWithBlobURL('js', `${vsPath}/basic-languages/javascript/javascript.js`,m);
        await loadResourceWithBlobURL('js', `${vsPath}/basic-languages/typescript/typescript.js`,m);
        await loadResourceWithBlobURL('js', `${vsPath}/language/typescript/tsMode.js`,m);
        await loadResourceWithBlobURL('js', `${vsPath}/language/typescript/tsWorker.js`,m);


        await darkThemeChecked.then();
        
  
        addCssText('rmbnctzOOksi', cssText01);
  
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions(Object.assign({
          target: monaco.languages.typescript.ScriptTarget.ES2018,
        }, compilerOptions));
  
        const container = document.createElement('div');
        container.className = 'monaco-editor-container';
        cmBox.parentNode.insertBefore(container, cmBox);
  
        elmSet.textArea = textArea;
        elmSet.container = container;

        if (textArea.style.display) textArea.style.display = '';
  
        const monacoLangs = {
          'javascript': 'javascript',
          'css': 'css',
        };
  
        const monacoLang = monacoLangs[codeLang];
  
  
        const editor = monaco.editor.create(container, Object.assign({
          value: textArea.value,
          language: monacoLang
        }, editorOptions));
  
        elmSet.editor = editor;
        
  
        if (document.documentElement.hasAttribute('dark')) monaco.editor.setTheme("vs-dark");

        window.cm = cm;
        window.cmBox=cmBox;
  
        let oldValue = editor.getValue();
        editor.onDidChangeModelContent(e => {
          const value = editor.getValue();
          if(value === oldValue) return;
          oldValue = value;
          elmSet.textArea.value = value;
          cm.replaceRange(" ", {line: 0, ch: 0});
          cm.setValue(value);
        });
  
  
        // console.log(monaco, monaco.onDidChangeModelContent)
  
        //   window.editor.getModel().onDidChangeContent((event) => {
        //   render();
        // });
  
        //   editor.setTheme
  
        //   onDidChangeContent is attached to a model, and will only apply to that model
        // onDidChangeModelContent
  
  
        // window.Worker = WorkerClass;
  
      })();
  
  
    }
  

        const mainTextArea= document.createElement('textarea');
        mainTextArea.value = cm.getValue();
        Object.assign(mainTextArea.style,{
            position:'fixed',
            top:'10vh',
            left:'10vw',
            bottom:'10vh',
            right:'10vw',
            zIndex: 99999

        });


        Object.assign(mainTextArea.style,{
            position:'absolute',
            height: '100px',
            top: '-200px',
            display: 'none'
        });
  

        document.body.appendChild(mainTextArea);
    
        createEditor(mainTextArea);

    
});
