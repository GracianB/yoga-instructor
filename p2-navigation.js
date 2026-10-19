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
 // A real offer card selects a service before navigating to the enquiry.
 document.querySelectorAll("[data-yoga-service]").forEach(button=>{
   button.addEventListener("click",()=>{
     const value=button.dataset.yogaService;
     const radio=document.querySelector('#v76-form input[name="v76-service"][value="'+value+'"]');
     if(!radio)return;
     radio.checked=true;
     if(value==="online"){const format=document.getElementById("v76-format");if(format)format.value="online";}
     radio.dispatchEvent(new Event("change",{bubbles:true}));
     focus("contacto");
     const destination=document.getElementById("contacto");
     history.replaceState(null,"","#contacto");
     scrollToTarget(destination);
   });
 });
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

// Systems Lab-inspired ambient field, redrawn as lotus petals, not a generic orbit.
(() => {
 "use strict";
 const canvas=document.getElementById("yoga-lotus-field");
 const hero=document.getElementById("inicio");
 if(!canvas||!hero)return;
 const ctx=canvas.getContext("2d",{alpha:true});
 if(!ctx)return;
 const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
 let visible=true,frame=0,last=0,width=0,height=0,dpr=1;
 function resize(){
   const box=hero.getBoundingClientRect();
   width=Math.max(1,box.width);height=Math.max(1,box.height);
   dpr=Math.min(1.5,window.devicePixelRatio||1);
   canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
   canvas.style.width=width+"px";canvas.style.height=height+"px";
 }
 function draw(time){
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   const dark=document.documentElement.dataset.theme==="dark";
   const color=dark?"122,215,207":"69,129,108";
   const cx=width*(width>900?.73:.50),cy=height*(width>900?.46:.34);
   const scale=Math.min(width*.37,height*.54,330);
   const phase=motion.matches?0:Math.sin(time*.00022)*.1;
   for(let ring=0;ring<3;ring++){
     const petals=ring===0?8:ring===1?12:16;
     const length=scale*(.35+ring*.31);
     const breadth=length*(.32-ring*.035);
     for(let n=0;n<petals;n++){
       const angle=n*Math.PI*2/petals+ring*.19+phase*(ring+1)*.6;
       const opacity=(ring===0?.19:ring===1?.12:.075)*(dark?1:.88);
       ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
       ctx.beginPath();ctx.moveTo(0,0);
       ctx.bezierCurveTo(-breadth,-length*.41,-breadth*.56,-length*.87,0,-length);
       ctx.bezierCurveTo(breadth*.56,-length*.87,breadth,-length*.41,0,0);
       ctx.strokeStyle="rgba("+color+","+opacity+")";
       ctx.lineWidth=ring===0?1.15:.75;ctx.stroke();
       ctx.restore();
     }
   }
   const halo=ctx.createRadialGradient(cx,cy,2,cx,cy,scale*.66);
   halo.addColorStop(0,"rgba("+color+","+(dark?.07:.05)+")");
   halo.addColorStop(1,"rgba("+color+",0)");
   ctx.fillStyle=halo;ctx.beginPath();ctx.arc(cx,cy,scale*.66,0,Math.PI*2);ctx.fill();
   for(let i=0;i<12;i++){
     const angle=i*Math.PI*2/12+phase*.5;
     const r=scale*(.52+i%3*.16);
     ctx.fillStyle="rgba("+color+","+(dark?.38:.26)+")";
     ctx.beginPath();ctx.arc(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,i%4===0?2:1.2,0,Math.PI*2);ctx.fill();
   }
 }
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;}
 function tick(t){
   frame=0;
   if(document.hidden||!visible||motion.matches)return;
   if(t-last>=42){draw(t);last=t;}
   frame=requestAnimationFrame(tick);
 }
 function resume(){
   stop();resize();draw(0);last=0;
   if(!motion.matches&&!document.hidden&&visible)frame=requestAnimationFrame(tick);
 }
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?resume():stop()},{threshold:0});
 observer.observe(hero);
 const changes=new MutationObserver(()=>{if(visible)resume()});
 changes.observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
 motion.addEventListener?.("change",resume);
 window.addEventListener("resize",resume,{passive:true});
 document.addEventListener("visibilitychange",()=>document.hidden?stop():resume());
 resume();
})();
