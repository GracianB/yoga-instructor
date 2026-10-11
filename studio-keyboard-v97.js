/* V97 · Keyboard skip text follows the existing ES/EN document language. */
(()=>{
"use strict";
const link=document.querySelector("[data-v97-skip]");if(!link)return;
const words={es:"Ir a la sala de práctica",en:"Skip to the practice studio"};
const update=()=>{link.textContent=words[document.documentElement.lang==="en"?"en":"es"]};
const observer=new MutationObserver(update);
observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
update();
})();
