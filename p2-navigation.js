/* P2 · Short, route-first portfolio with accessible opt-in full archive.
   Original IDs, DOM modules, audio controls and deep links remain untouched. */
(() => {
 "use strict";
 const root=document.getElementById("main");
 const toggle=document.getElementById("p2-toggle");
 if(!root||!toggle)return;
 const hidden=new Set(["orientacion","atlas","casos","ritual","campo","camino","trayectoria","demostracion","formacion","filosofia","cv","preguntas"]);
 // These five chapters are available as a real interactive destination.
 // A route choice shows one chapter rather than another 15-screen journey.
 const chapters=new Set(["sobre","oferta","experiencia","instructor-flow","contacto"]);
 const chapterFor=node=>{
  if(!node)return null;
  for(const id of chapters)if(node.id===id||node.closest("#"+id))return id;
  return null;
 };
 const routes=[...document.querySelectorAll(".p2-route")];
 const markCurrentRoute=()=>{
  for(const route of routes){
   const active=root.dataset.p2Mode==="short"&&
    route.getAttribute("href")==="#"+root.dataset.p2Focus;
   if(active)route.setAttribute("aria-current","location");
   else route.removeAttribute("aria-current");
  }
 };
 const focus=id=>{
  if(id&&chapters.has(id)&&root.dataset.p2Mode==="short")root.dataset.p2Focus=id;
  else delete root.dataset.p2Focus;
  markCurrentRoute();
 };
 const scrollToTarget=target=>{
  if(!target)return;
  requestAnimationFrame(()=>target.scrollIntoView({block:"start",behavior:"instant"}));
 };
 const label=toggle.querySelector("[data-p2-toggle-label]");
 const translated=(es,en)=>document.documentElement.dataset.lang==="en"?en:es;
 const sync=()=>{
  const full=root.dataset.p2Mode==="full";
  toggle.setAttribute("aria-pressed",String(full));
  if(label)label.textContent=full?translated("Ver recorrido breve","Show shorter view"):translated("Ver todo el contenido","See everything");
 };
 const setFull=(full)=>{
  root.dataset.p2Mode=full?"full":"short";
  if(full)delete root.dataset.p2Focus;
  markCurrentRoute();
  sync();
 };
 const revealHash=()=>{
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
  const target=id&&document.getElementById(id);if(!target)return;
  if([...hidden].some(parent=>target.id===parent||target.closest("#"+parent))){
   setFull(true);
   focus(null);
   scrollToTarget(target);
  }else {
   const chapter=chapterFor(target);
   if(chapter) {
    focus(chapter);
    scrollToTarget(target);
   }else if(target.id==="explora"||target.id==="inicio")focus(null);
  }
 };
 toggle.addEventListener("click",()=>{
  const full=root.dataset.p2Mode!=="full";
  setFull(full);
  try{sessionStorage.setItem("gb-yoga-reading-mode",full?"full":"short")}catch{}
 });
 // Expand before the browser handles the anchor so direct links still work.
 document.addEventListener("click",event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  const id=link.getAttribute("href").slice(1);
  if(id){const node=document.getElementById(id);
   if(node && [...hidden].some(parent=>node.id===parent||node.closest("#"+parent))){
    setFull(true);focus(null);
   }else if(node){
    const chapter=chapterFor(node);
    if(chapter)focus(chapter);
    else if(id==="explora"||id==="inicio")focus(null);
   }
  }
  if(event.target.closest("[data-set-lang]"))sync();
 });
 window.addEventListener("hashchange",revealHash);
 const observer=new MutationObserver(sync);
 observer.observe(document.documentElement,{attributes:true,attributeFilter:["data-lang"]});
 let remembered=false;
 try{remembered=sessionStorage.getItem("gb-yoga-reading-mode")==="full"}catch{}
 setFull(remembered);
 revealHash();sync();
})();
