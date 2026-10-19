/* P2 · Short, route-first portfolio with accessible opt-in full archive.
   Original IDs, DOM modules, audio controls and deep links remain untouched. */
(() => {
 "use strict";
 const root=document.getElementById("main");
 const toggle=document.getElementById("p2-toggle");
 if(!root||!toggle)return;
 const hidden=new Set(["orientacion","atlas","casos","ritual","campo","camino","trayectoria","demostracion","formacion","filosofia","cv","preguntas"]);
 const label=toggle.querySelector("[data-p2-toggle-label]");
 const translated=(es,en)=>document.documentElement.dataset.lang==="en"?en:es;
 const sync=()=>{
  const full=root.dataset.p2Mode==="full";
  toggle.setAttribute("aria-pressed",String(full));
  if(label)label.textContent=full?translated("Ver recorrido breve","Show shorter view"):translated("Ver todo el contenido","See everything");
 };
 const setFull=(full)=>{root.dataset.p2Mode=full?"full":"short";sync()};
 const revealHash=()=>{
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
  const target=id&&document.getElementById(id);if(!target)return;
  if([...hidden].some(parent=>target.id===parent||target.closest("#"+parent)))setFull(true);
 };
 toggle.addEventListener("click",()=>setFull(root.dataset.p2Mode!=="full"));
 // Expand before the browser handles the anchor so direct links still work.
 document.addEventListener("click",event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  const id=link.getAttribute("href").slice(1);
  if(id){const node=document.getElementById(id);
   if(node && [...hidden].some(parent=>node.id===parent||node.closest("#"+parent)))setFull(true);
  }
  if(event.target.closest("[data-set-lang]"))sync();
 });
 window.addEventListener("hashchange",revealHash);
 const observer=new MutationObserver(sync);
 observer.observe(document.documentElement,{attributes:true,attributeFilter:["data-lang"]});
 revealHash();sync();
})();
