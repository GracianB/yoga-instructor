/* V58: each practice owns its instructions, controls and guardian, in that order. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 if(!root)return;
 const movement=root.querySelector("#movement-stage");
 const theater=movement?.querySelector(".flow-theater");
 if(movement&&theater){
   for(const selector of [".flow-console-top",".flow-progress",".flow-phase-progress",".flow-console-foot",".flow-controls"]){
     const node=movement.querySelector(":scope > "+selector);
     if(node)movement.insertBefore(node,theater);
   }
   movement.classList.add("v58-practice-order");
 }
 const guided=root.querySelector("#studio-guided");
 const stage=guided?.querySelector(".studio-guided-stage");
 if(guided&&stage){
   const companion=stage.querySelector(".studio-companion");
   // Preserve the current guide/cue/countdown and all existing event handlers.
   for(const selector of [".studio-breath-patterns",".studio-meditation-choices",".studio-meditation-focus",".studio-guided-controls",".studio-guided-note"]){
     const node=guided.querySelector(":scope > "+selector);
     if(node)stage.appendChild(node);
   }
   if(companion)stage.appendChild(companion);
   stage.classList.add("v58-practice-order");
 }
 const vortex=document.querySelector(".campo-vortex-full");
 const mount=vortex?.querySelector(".vortex-frame-mount");
 if(vortex&&mount){
   const url=mount.dataset.vortexSrc;
   if(url){
     const fallback=document.createElement("a");
     fallback.className="v58-vortex-direct";
     fallback.href=url;
     fallback.target="_blank";
     fallback.rel="noopener noreferrer";
     const translate=()=>fallback.textContent=document.documentElement.lang==="en"?"Open Vortex in a new tab ↗":"Abrir Vortex en otra pestaña ↗";
     translate();
     vortex.querySelector(".vortex-activation")?.appendChild(fallback);
     const tip=document.createElement("p");
     tip.className="v58-vortex-hint";
     tip.setAttribute("role","status");
     tip.textContent=document.documentElement.lang==="en"?"If the embedded version stays blank, use the direct link.":"Si el recuadro aparece vacío, utiliza el enlace directo.";
     vortex.appendChild(tip);
     new MutationObserver(()=>{translate();tip.textContent=document.documentElement.lang==="en"?"If the embedded version stays blank, use the direct link.":"Si el recuadro aparece vacío, utiliza el enlace directo."}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
   }
 }
})();