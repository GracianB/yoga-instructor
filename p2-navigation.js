/* P2 · Short, route-first portfolio with accessible opt-in full archive.
   Original IDs, DOM modules, audio controls and deep links remain untouched. */
(() => {
 "use strict";
 const root=document.getElementById("main");
 const toggle=document.getElementById("p2-toggle");
 if(!root||!toggle)return;
 const hidden=new Set(["orientacion","atlas","camino","trayectoria","demostracion","formacion","filosofia","cv","preguntas"]);
 // These five chapters are available as a real interactive destination.
 // A route choice shows one chapter rather than another 15-screen journey.
 const chapters=new Set(["proyectos","experiencia","metodo","contacto"]);
 const retired=new Set(["portfolio","casos","ritual","sobre","oferta","campo","instructor-flow","soundtrack"]);
 const retiredTarget=node=>node&&[...retired].some(id=>node.id===id||node.closest("#"+id));
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
  if(label)label.textContent=full?translated("Volver al inicio breve","Back to short page"):translated("Ver archivo completo","Open full archive");
 };
 const setFull=(full)=>{
  root.dataset.p2Mode=full?"full":"short";
  if(full)delete root.dataset.p2Focus;
  markCurrentRoute();
  sync();
 };
 const revealHash=()=>{
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
  const target=id&&document.getElementById(id);if(!target||retiredTarget(target))return;
  if([...hidden].some(parent=>target.id===parent||target.closest("#"+parent))){
   setFull(true);
   focus(null);
   scrollToTarget(target);
  }else {
   const chapter=chapterFor(target);
   if(chapter) {
    focus(chapter);
    scrollToTarget(target);
   }else focus(null); // The overview and other public anchors must never stay hidden.
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
   if(retiredTarget(node)){event.preventDefault();return;}
   if(node && [...hidden].some(parent=>node.id===parent||node.closest("#"+parent))){
    setFull(true);focus(null);
   }else if(node){
    const chapter=chapterFor(node);
    if(chapter)focus(chapter);
    else focus(null); // Non-chapter destination, such as portfolio or explore.
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

 /* Single interactive chapter: no application engine or extra network scripts. */
 const method=document.getElementById("metodo");
 if(method){
  const tabs=[...method.querySelectorAll("[data-method-tab]")];
  const panels=[...method.querySelectorAll("[data-method-panel]")];
  const counter=method.querySelector("[data-method-counter]");
  const setMethod=(index,focusTab=false)=>{
   const selected=(index+tabs.length)%tabs.length;
   const state=tabs[selected].dataset.methodTab;
   method.dataset.methodState=state;
   for(let i=0;i<tabs.length;i++){
    const active=i===selected;
    tabs[i].setAttribute("aria-selected",String(active));
    tabs[i].tabIndex=active?0:-1;
   }
   for(const panel of panels)panel.hidden=panel.dataset.methodPanel!==state;
   if(counter)counter.textContent=String(selected+1).padStart(2,"0")+" / 03";
   if(focusTab)tabs[selected].focus();
  };
  tabs.forEach((tab,index)=>{
   tab.addEventListener("click",()=>setMethod(index));
   tab.addEventListener("keydown",event=>{
    let next=null;
    if(event.key==="ArrowRight"||event.key==="ArrowDown")next=index+1;
    if(event.key==="ArrowLeft"||event.key==="ArrowUp")next=index-1;
    if(event.key==="Home")next=0;
    if(event.key==="End")next=tabs.length-1;
    if(next===null)return;
    event.preventDefault();
    setMethod(next,true);
   });
  });
  setMethod(0);
 }
})();
