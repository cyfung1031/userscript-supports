* Use them in chrome-extension://jinjaccalgkegednnccohejagnlnfdag/options/index.html (Editor Mode)

## Setup

1. Open Dev Tools (Meta+Opt+I in Mac)
2. Sources -> Snippet -> Add a new Snippet
3. Copy and Paste
```js
javascript:((script,ci,b,bu)=>{(ci='4472e5a6f788cf6e6460624269160ce50b43e9ff')&&fetch(`https://raw.githubusercontent.com/cyfung1031/userscript-supports/${ci}/tools/coder.js`).then(r=>r.text()).then(t=>[(b=new Blob([t],{type:'text/javascript; charset=UTF-8'})),(bu=URL.createObjectURL(b)),(script.src=bu),document.head.appendChild(script)]&&new Promise(r=>script.onload=r)).then(k=>URL.revokeObjectURL(bu)).then(e=>console.log('JS Injected'))})(document.createElement('script'));
```
4. Save with name "0"


![img](https://na.cx/i/udzA65H.png)

## Usage

1. Open Dev Tools (Meta+Opt+I in Mac)
2. CMD+O
3. Type "0" and Enter
4. Ctrl+Enter to execute
