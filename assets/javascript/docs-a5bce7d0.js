const t=new WeakMap,e=e=>(...s)=>{const n=e(...s);return t.set(n,!0),n},s=e=>"function"==typeof e&&t.has(e),n="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(t,e,s=null)=>{for(;e!==s;){const s=e.nextSibling;t.removeChild(e),e=s}},r={},o={},a=`{{lit-${String(Math.random()).slice(2)}}}`,l=`\x3c!--${a}--\x3e`,c=new RegExp(`${a}|${l}`);class h{constructor(t,e){this.parts=[],this.element=e;const s=[],n=[],i=document.createTreeWalker(e.content,133,null,!1);let r=0,o=-1,l=0;const{strings:h,values:{length:d}}=t;for(;l<d;){const t=i.nextNode();if(null!==t){if(o++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:s}=e;let n=0;for(let t=0;t<s;t++)u(e[t].name,"$lit$")&&n++;for(;n-- >0;){const e=h[l],s=m.exec(e)[2],n=s.toLowerCase()+"$lit$",i=t.getAttribute(n);t.removeAttribute(n);const r=i.split(c);this.parts.push({type:"attribute",index:o,name:s,strings:r}),l+=r.length-1}}"TEMPLATE"===t.tagName&&(n.push(t),i.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(a)>=0){const n=t.parentNode,i=e.split(c),r=i.length-1;for(let e=0;e<r;e++){let s,r=i[e];if(""===r)s=p();else{const t=m.exec(r);null!==t&&u(t[2],"$lit$")&&(r=r.slice(0,t.index)+t[1]+t[2].slice(0,-"$lit$".length)+t[3]),s=document.createTextNode(r)}n.insertBefore(s,t),this.parts.push({type:"node",index:++o})}""===i[r]?(n.insertBefore(p(),t),s.push(t)):t.data=i[r],l+=r}}else if(8===t.nodeType)if(t.data===a){const e=t.parentNode;null!==t.previousSibling&&o!==r||(o++,e.insertBefore(p(),t)),r=o,this.parts.push({type:"node",index:o}),null===t.nextSibling?t.data="":(s.push(t),o--),l++}else{let e=-1;for(;-1!==(e=t.data.indexOf(a,e+1));)this.parts.push({type:"node",index:-1}),l++}}else i.currentNode=n.pop()}for(const t of s)t.parentNode.removeChild(t)}}const u=(t,e)=>{const s=t.length-e.length;return s>=0&&t.slice(s)===e},d=t=>-1!==t.index,p=()=>document.createComment(""),m=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class b{constructor(t,e,s){this.__parts=[],this.template=t,this.processor=e,this.options=s}update(t){let e=0;for(const s of this.__parts)void 0!==s&&s.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=n?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],s=this.template.parts,i=document.createTreeWalker(t,133,null,!1);let r,o=0,a=0,l=i.nextNode();for(;o<s.length;)if(r=s[o],d(r)){for(;a<r.index;)a++,"TEMPLATE"===l.nodeName&&(e.push(l),i.currentNode=l.content),null===(l=i.nextNode())&&(i.currentNode=e.pop(),l=i.nextNode());if("node"===r.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,r.name,r.strings,this.options));o++}else this.__parts.push(void 0),o++;return n&&(document.adoptNode(t),customElements.upgrade(t)),t}}const f=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),g=` ${a} `;class v{constructor(t,e,s,n){this.strings=t,this.values=e,this.type=s,this.processor=n}getHTML(){const t=this.strings.length-1;let e="",s=!1;for(let n=0;n<t;n++){const t=this.strings[n],i=t.lastIndexOf("\x3c!--");s=(i>-1||s)&&-1===t.indexOf("--\x3e",i+1);const r=m.exec(t);e+=null===r?t+(s?g:l):t.substr(0,r.index)+r[1]+r[2]+"$lit$"+r[3]+a}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");let e=this.getHTML();return void 0!==f&&(e=f.createHTML(e)),t.innerHTML=e,t}}const _=t=>null===t||!("object"==typeof t||"function"==typeof t),x=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class y{constructor(t,e,s){this.dirty=!0,this.element=t,this.name=e,this.strings=s,this.parts=[];for(let t=0;t<s.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new w(this)}_getValue(){const t=this.strings,e=t.length-1,s=this.parts;if(1===e&&""===t[0]&&""===t[1]){const t=s[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!x(t))return t}let n="";for(let i=0;i<e;i++){n+=t[i];const e=s[i];if(void 0!==e){const t=e.value;if(_(t)||!x(t))n+="string"==typeof t?t:String(t);else for(const e of t)n+="string"==typeof e?e:String(e)}}return n+=t[e],n}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class w{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===r||_(t)&&t===this.value||(this.value=t,s(t)||(this.committer.dirty=!0))}commit(){for(;s(this.value);){const t=this.value;this.value=r,t(this)}this.value!==r&&this.committer.commit()}}class E{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(p()),this.endNode=t.appendChild(p())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=p()),t.__insert(this.endNode=p())}insertAfterPart(t){t.__insert(this.startNode=p()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;s(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}const t=this.__pendingValue;t!==r&&(_(t)?t!==this.value&&this.__commitText(t):t instanceof v?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):x(t)?this.__commitIterable(t):t===o?(this.value=o,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,s="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=s:this.__commitNode(document.createTextNode(s)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof b&&this.value.template===e)this.value.update(t.values);else{const s=new b(e,t.processor,this.options),n=s._clone();s.update(t.values),this.__commitNode(n),this.value=s}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let s,n=0;for(const i of t)s=e[n],void 0===s&&(s=new E(this.options),e.push(s),0===n?s.appendIntoPart(this):s.insertAfterPart(e[n-1])),s.setValue(i),s.commit(),n++;n<e.length&&(e.length=n,this.clear(s&&s.endNode))}clear(t=this.startNode){i(this.startNode.parentNode,t.nextSibling,this.endNode)}}class N{constructor(t,e,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=s}setValue(t){this.__pendingValue=t}commit(){for(;s(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}if(this.__pendingValue===r)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=r}}class $ extends y{constructor(t,e,s){super(t,e,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new V(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class V extends w{}let C=!1;(()=>{try{const t={get capture(){return C=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class T{constructor(t,e,s){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=s,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;s(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}if(this.__pendingValue===r)return;const t=this.__pendingValue,e=this.value,n=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||n);n&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=S(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=r}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const S=t=>t&&(C?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);const P=new class{handleAttributeExpressions(t,e,s,n){const i=e[0];if("."===i){return new $(t,e.slice(1),s).parts}if("@"===i)return[new T(t,e.slice(1),n.eventContext)];if("?"===i)return[new N(t,e.slice(1),s)];return new y(t,e,s).parts}handleTextExpression(t){return new E(t)}};function L(t){let e=A.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},A.set(t.type,e));let s=e.stringsArray.get(t.strings);if(void 0!==s)return s;const n=t.strings.join(a);return s=e.keyString.get(n),void 0===s&&(s=new h(t,t.getTemplateElement()),e.keyString.set(n,s)),e.stringsArray.set(t.strings,s),s}const A=new Map,M=new WeakMap,k=(t,e,s)=>{let n=M.get(e);void 0===n&&(i(e,e.firstChild),M.set(e,n=new E(Object.assign({templateFactory:L},s))),n.appendInto(e)),n.setValue(t),n.commit()};"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.3.0");const I=(t,...e)=>new v(t,e,"html",P);class O{constructor(t){this.classes=new Set,this.changed=!1,this.element=t;const e=(t.getAttribute("class")||"").split(/\s+/);for(const t of e)this.classes.add(t)}add(t){this.classes.add(t),this.changed=!0}remove(t){this.classes.delete(t),this.changed=!0}commit(){if(this.changed){let t="";this.classes.forEach((e=>t+=e+" ")),this.element.setAttribute("class",t)}}}const j=new WeakMap,H=e((t=>e=>{if(!(e instanceof w)||e instanceof V||"class"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:s}=e,{element:n}=s;let i=j.get(e);void 0===i&&(n.setAttribute("class",s.strings.join(" ")),j.set(e,i=new Set));const r=n.classList||new O(n);i.forEach((e=>{e in t||(r.remove(e),i.delete(e))}));for(const e in t){const s=t[e];s!=i.has(e)&&(s?(r.add(e),i.add(e)):(r.remove(e),i.delete(e)))}"function"==typeof r.commit&&r.commit()})),R=new WeakMap,B=e((t=>e=>{if(!(e instanceof w)||e instanceof V||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:s}=e,{style:n}=s.element;let i=R.get(e);void 0===i&&(n.cssText=s.strings.join(" "),R.set(e,i=new Set)),i.forEach((e=>{e in t||(i.delete(e),-1===e.indexOf("-")?n[e]=null:n.removeProperty(e))}));for(const e in t)i.add(e),-1===e.indexOf("-")?n[e]=t[e]:n.setProperty(e,t[e])})),W=new WeakMap,Z=e(((...t)=>e=>{let s=W.get(e);void 0===s&&(s={lastRenderedIndex:2147483647,values:[]},W.set(e,s));const n=s.values;let i=n.length;s.values=t;for(let r=0;r<t.length&&!(r>s.lastRenderedIndex);r++){const o=t[r];if(_(o)||"function"!=typeof o.then){e.setValue(o),s.lastRenderedIndex=r;break}r<i&&o===n[r]||(s.lastRenderedIndex=2147483647,i=0,Promise.resolve(o).then((t=>{const n=s.values.indexOf(o);n>-1&&n<s.lastRenderedIndex&&(s.lastRenderedIndex=n,e.setValue(t),e.commit())})))}}));class D{constructor(t){this.executor=t}subscribe(t){const e=this.asSubscriber(t),s=this.executor(e)||null;return{unsubscribe:()=>{e.complete(),null==s||s()}}}asSubscriber(t){return"function"==typeof t?{next:t,error:()=>{},complete:()=>{}}:void 0===t?{next:()=>{},error:()=>{},complete:()=>{}}:t}pipe(...t){return t.reduce(((t,e)=>e(t)),this)}}function F(t){return new D((e=>{const s=t.map((t=>t.subscribe(e)));return()=>s.forEach((t=>t.unsubscribe()))}))}function z(t){return e=>new D((s=>{const n=e.subscribe((e=>s.next(t(e))));return()=>{n.unsubscribe()}}))}function Y(t){return e=>new D((s=>{const n=e.subscribe({next:e=>{t(e),s.next(e)},error:t=>s.error(t),complete:()=>s.complete()});return()=>n.unsubscribe()}))}const q={x:0,y:0},X=Q(((t,e)=>t+e)),K=Q(((t,e)=>t-e)),G=Q(((t,e)=>t*e)),J=Q(((t,e)=>t/e));function Q(t){return(e,s)=>(e=U(e),s=U(s),{x:t(e.x,s.x),y:t(e.y,s.y)})}function U(t){return"number"==typeof t?{x:t,y:t}:t}function tt(t){return{x:t.pageX,y:t.pageY}}function et(t){return{x:t.touches[0].pageX,y:t.touches[0].pageY}}function st(t,e){return new D((s=>{const n=t=>s.next(t),i=Array.isArray(e)?e:[e];return i.forEach((e=>t.addEventListener(e,n))),()=>i.forEach((e=>t.removeEventListener(e,n)))}))}function nt(t){return e=>new D((s=>{const n=e.subscribe((e=>{t(e)&&s.next(e)}));return()=>{n.unsubscribe()}}))}function it(t){return e=>new D((s=>{const n=e.subscribe(s),i=t.subscribe((()=>{n.unsubscribe(),i.unsubscribe()}));return()=>{n.unsubscribe(),i.unsubscribe()}}))}class rt{static enablePanning(t,e){const s=Object.assign({sensibility:1},e||{});let n=null;const i=st(document,["mouseup","touchend"]).pipe(Y((()=>{document.body.style.userSelect=""}))),r=st(document,["mousemove","touchmove"]).pipe(nt((t=>!(window.TouchEvent&&t instanceof TouchEvent&&t.touches.length>1))),Y((()=>{document.body.style.userSelect="none"})),it(i));return st(t,["mousedown","touchstart"]).pipe(Y((t=>{n=t instanceof MouseEvent?new ot:new at})),(o=r,t=>new D((e=>{let s=null;const n=t.subscribe({next:()=>{null==s||s.unsubscribe(),s=o.subscribe(e)},error:()=>{},complete:()=>null==s?void 0:s.unsubscribe()});return()=>{n.unsubscribe()}}))),z((t=>null==n?void 0:n.getDelta(t))),nt((t=>null!==t)),z((t=>G(t,s.sensibility))));var o}}class ot{getDelta(t){if(!(t instanceof MouseEvent))return null;if(!this.prevPos)return this.prevPos=tt(t),null;const e=tt(t),s=K(e,this.prevPos);return this.prevPos=e,s}}class at{getDelta(t){if(!(t instanceof TouchEvent))return null;if(!this.prevPos)return this.prevPos=et(t),null;const e=et(t),s=K(e,this.prevPos);return this.prevPos=e,s}}class lt{static enableZoom(t,e){const s=Object.assign({sensibility:1,max:2.5,min:.5},e),n=.1*s.sensibility,i=.005*s.sensibility;let r=1;var o;return F([st(t,"touchstart").pipe(nt((t=>2===t.touches.length)),(o=()=>{return st(t,"touchmove").pipe(nt((t=>2===t.touches.length)),z((t=>(t.preventDefault(),Math.hypot(t.touches[0].pageX-t.touches[1].pageX,t.touches[0].pageY-t.touches[1].pageY)))),(e=([t,e])=>(e-t)*i,t=>new D((s=>{let n,i=!1;const r=t.subscribe((t=>{i&&s.next(e([n,t])),n=t,i=!0}));return()=>{r.unsubscribe()}}))),it(st(t,"touchend")));var e},t=>new D((e=>{let s=null;const n=t.subscribe({next:t=>{null==s||s.unsubscribe(),s=o(t).subscribe(e)},error:()=>{},complete:()=>null==s?void 0:s.unsubscribe()});return()=>{n.unsubscribe()}})))),st(t,"wheel").pipe(nt((t=>t.ctrlKey)),z((t=>(t.preventDefault(),t.deltaY<0?n:-n))))]).pipe(z((t=>(r+=t*r,r=Math.min(r,s.max),r=Math.max(r,s.min),r))))}}function ct(t,e,s,n){const i=J(function(t){const e=t.getBoundingClientRect();return{x:e.width,y:e.height}}(t),2),r=K(i,s);e.style.transformOrigin=`${r.x}px ${r.y}px 0`,e.style.transform=function(t,e){return"matrix("+e+", 0, 0, "+e+", "+t.x+", "+t.y+")"}(s,n)}class ht extends D{constructor(){super((t=>{})),this.observers=[]}subscribe(t){const e=this.asSubscriber(t);return this.observers=[...this.observers,e],{unsubscribe:()=>this.observers=this.observers.filter((t=>t!==e))}}next(t){for(const e of this.observers)e.next(t)}error(t){for(const e of this.observers)e.error(t)}complete(){for(const t of this.observers)t.complete()}}function ut(t){const e=t.getBoundingClientRect();return{position:{x:e.left,y:e.top},scale:{x:e.width,y:e.height}}}function dt(t){return`translate(${t.position.x}px, ${t.position.y}px) scale(${t.scale.x}, ${t.scale.y})`}function pt(t,e=document){return function(t,e){if(!t)throw e;return t}(e.querySelector(t),Error(`Cannot find ${t}`))}class mt{constructor(t,e,s){var n,i;this.labelEl=t,this.label=e,this.card=s,this.content=pt(".roadmap__card__content",this.card),this.makeVisible(),this.first=ut(this.labelEl),this.last=ut(this.card),this.delta=(n=this.first,i=this.last,{position:K(n.position,i.position),scale:J(n.scale,i.scale)}),this.makeInvisible()}makeVisible(){this.card.classList.add("roadmap__card--visible")}makeInvisible(){this.card.classList.remove("roadmap__card--visible")}play(){this.makeVisible(),this.content.style.opacity="1",this.card.scrollTop=0,this.renderCardContent(),this.content.animate([{transform:`translate(0, ${this.last.scale.y}px)`,opacity:0},{offset:.5},{transform:"none",opacity:1}],{duration:420,easing:"ease-in"}),this.card.animate([{transformOrigin:"0 0",transform:dt(this.delta)},{transformOrigin:"0 0",transform:"none"}],{duration:220,easing:"ease-in"})}reverse(){this.content.style.opacity="0",this.content.animate([{transform:"none",opacity:1},{transform:`translate(0, ${this.last.scale.y}px)`,opacity:0}],{duration:220,easing:"ease-out"}),this.card.animate([{transformOrigin:"0 0",transform:"none"},{transformOrigin:"0 0",transform:dt(this.delta)}],{duration:220,easing:"ease-out",delay:120}).finished.then((()=>this.makeInvisible()))}renderCardContent(){k(this.cardTemplate(),this.content)}cardTemplate(){var t,e;return I` ${Z(null===(e=(t=this.label).fullContent)||void 0===e?void 0:e.call(t))} `}}const bt=document.querySelector(".roadmap__wrapper"),ft=[{id:"label1",content:"Label 1",top:100,left:100,width:100,height:35},{id:"label2",content:"Label 2",fullContent:()=>import("./label2.view-fbfbd589.js").then((t=>t.default)),top:150,left:100,width:100,height:35,style:"secondary"}],gt=new class{constructor(t,e){var s,n;this.wrapper=t,this.data=e,this.labelsById={},this.labels=[],this.arrows=[],this.panzoomSub=null,this.currentPanZoom=null,this.clickLabelSubject=new ht,this.closeCardSubject=new ht,this.wrapper.innerHTML='\n<div class="roadmap__graph"></div>\n\n<div class="roadmap__card">\n  <button class="roadmap__card__close" aria-label="Close Card">\n    <span class="fa fa-times fa-2x"></span>\n  </button>\n\n  <div class="roadmap__card__content"></div>\n</div>\n',this.card=pt(".roadmap__card",this.wrapper),this.container=pt(".roadmap__graph",this.wrapper),this.labelsById=(s=e.labels,n=t=>t.id,s.reduce(((t,e)=>Object.assign(Object.assign({},t),{[n(e)]:e})),{})),this.arrows=e.arrows.map((t=>{const e=this.labelsById[t.from],s=this.labelsById[t.to];if(!e)throw Error(`Cannot find fromEl: ${t.from}`);if(!s)throw Error(`Cannot find toEl: ${t.to}`);return Object.assign(Object.assign({},t),{fromEl:e,toEl:s,active:!1})})),this.labels=[...e.labels],this.render(),this.enablePanZoom()}render(){const t=I`
      ${this.arrows.map((t=>this.renderArrow(t)))}
      ${this.labels.map((t=>this.renderLabel(t)))}
    `;k(t,this.container)}highlightConnections(t,e=!0){let s=!1;this.arrows=this.arrows.map((n=>n.from!==t.id?n:(s=!0,Object.assign(Object.assign({},n),{active:e})))),s&&this.render()}renderLabel(t){const{width:e,height:s,top:n,left:i}=t;return I`
      <button
        id="label-${t.id}"
        class="${H({roadmap__label:!0,"roadmap__label--primary":"primary"===t.style,"roadmap__label--secondary":"secondary"===t.style,"roadmap__label--outline":"outline"===t.style})}"
        style="${B({top:n+"px",left:i+"px",width:e+"px",height:s+"px"})}"
        @focusin=${()=>this.highlightConnections(t)}
        @focusout=${()=>this.highlightConnections(t,!1)}
        @click=${()=>{this.clickLabelSubject.next(t)}}
      >
        ${t.content}
      </button>
    `}labelClick(){return this.clickLabelSubject}closeCard(){return this.closeCardSubject}openLabel(t){const e=this.labelsById[t];if(!e)throw Error("Cannot find label with id "+t);const s=pt(`#label-${t}`,this.container);if(!e.fullContent)throw Error(`Label with id ${t} does not have full content`);this.container.childNodes.forEach((t=>t instanceof HTMLElement&&t.setAttribute("tabindex","-1"))),this.disablePanZoom();const n=new mt(s,e,this.card);n.play();pt(".roadmap__card__close",this.card).addEventListener("click",(()=>{this.enablePanZoom(),this.container.childNodes.forEach((t=>t instanceof HTMLElement&&t.removeAttribute("tabindex"))),n.reverse(),this.closeCardSubject.next(e)}),{once:!0})}closeCurrentLabel(){pt(".roadmap__card__close",this.card).click()}renderArrow(t){const e=this.getConnectionPoint(t.fromDir,t.fromEl),s=this.getConnectionPoint(t.toDir,t.toEl),n=Math.sqrt(Math.pow(e.x-s.x,2)+Math.pow(e.y-s.y,2)),i=this.getRotation(e,s);return I`
      <div
        id="arrow-${t.from}__${t.to}"
        class=${H({roadmap__arrow:!0,"roadmap__arrow--dotted":"dotted"===t.style,"roadmap__arrow--secondary":"secondary"===t.style,"roadmap__arrow--active":t.active})}
        style="top: ${e.y}px; left: ${e.x}px; height: ${n}px; transform: rotate(${i}rad)"
      ></div>
    `}getConnectionPoint(t,{top:e,left:s,width:n,height:i}){switch(t){case"left":return{x:s,y:e+i/2};case"right":return{x:s+n,y:e+i/2};case"top":return{x:s+n/2,y:e};case"bottom":return{x:s+n/2,y:e+i}}}getRotation(t,e){const s=t.x-e.x,n=e.y-t.y;return Math.atan2(s,n)}enablePanZoom(){const t=this.wrapper.offsetWidth,e=this.currentPanZoom||{pan:{x:.5*-(this.data.width-t),y:0},zoom:1};this.panzoomSub=function(t,e,s){let n=s.pan,i=s.zoom,r=!0;return ct(t,e,n,i),F([rt.enablePanning(t).pipe(Y((t=>{const e=J(t||q,i);n=X(n,e)}))),lt.enableZoom(t,{sensibility:1}).pipe(Y((t=>i=t||1)))]).pipe(z((()=>(r&&(r=!1,requestAnimationFrame((()=>{r=!0,ct(t,e,n,i)}))),{pan:n,zoom:i}))))}(this.wrapper,this.container,e).subscribe((t=>{this.currentPanZoom=t}))}disablePanZoom(){var t;null===(t=this.panzoomSub)||void 0===t||t.unsubscribe()}}(bt,{labels:ft,arrows:[{from:"label1",fromDir:"bottom",to:"label2",toDir:"top",style:"dotted"}],width:512});gt.labelClick().subscribe((t=>{t.fullContent&&gt.openLabel(t.id)}));export{I as h};