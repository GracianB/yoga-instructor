/* V57: one contextual orientation bar for the selected practice, not a
   second player or clock. Existing mode buttons remain the only selectors. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const modes=root?.querySelector(".studio-modes");
 if(!root||!modes||modes.querySelector(".studio-path-context"))return;
 const panel=document.createElement("div");
 panel.className="studio-path-context";
 panel.setAttribute("role","status");
 panel.setAttribute("aria-live","polite");
 panel.innerHTML='<span class="studio-path-context-icon" aria-hidden="true"></span>'+
   '<div class="studio-path-context-copy"><strong></strong><p></p></div>';
 modes.insertAdjacentElement("afterend",panel);
 const data={
   es:{
     asanas:["↗","MOVIMIENTO · NILA","Diez fases guiadas. Cambia Yin o Yang en la escena y empieza cuando estés listo."],
     breath:["◌","RESPIRACIÓN · DRAGÓN","Observa cómo se expande el pecho y acompaña el ritmo sin forzarlo."],
     meditation:["✧","MEDITACIÓN · UMA","Una presencia quieta para descansar la mirada y la atención."]
   },
   en:{
     asanas:["↗","MOVEMENT · NILA","Ten guided phases. Choose Yin or Yang in the scene and start when ready."],
     breath:["◌","BREATHING · DRAGON","Watch the chest expand and follow at your own comfortable pace."],
     meditation:["✧","MEDITATION · UMA","A still companion for resting your gaze and attention."]
   }
 };
 const update=()=>{
   const lang=document.documentElement.lang==="en"?"en":"es";
   const selected=root.dataset.studioMode||"asanas";
   const [symbol,title,description]=data[lang][selected]||data[lang].asanas;
   panel.dataset.mode=selected;
   panel.querySelector(".studio-path-context-icon").textContent=symbol;
   panel.querySelector("strong").textContent=title;
   panel.querySelector("p").textContent=description;
 };
 const watch=new MutationObserver(update);
 watch.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
 watch.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 for(const button of root.querySelectorAll("[data-studio-mode]")){
   button.setAttribute("aria-controls",button.dataset.studioMode==="asanas"?"movement-stage":"studio-guided");
 }
 update();
 window.addEventListener("pagehide",()=>watch.disconnect());
})();
