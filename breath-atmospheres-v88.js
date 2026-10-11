/* V88 · Breath room customization; no saved personal data or new animation loop. */
(()=>{
"use strict";
const root=document.getElementById("instructor-flow"),stage=root?.querySelector("#studio-guided");
const guide=stage?.querySelector(".v87-guidance");if(!root||!stage||!guide)return;
const panel=document.createElement("div");panel.className="v88-atmosphere";
panel.hidden=true;
panel.innerHTML='<div class="v88-head"><strong></strong><p></p></div>'+
'<div class="v88-options" role="group"><button type="button" data-v88-atmosphere="forest" aria-pressed="true"></button>'+
'<button type="button" data-v88-atmosphere="ocean" aria-pressed="false"></button>'+
'<button type="button" data-v88-atmosphere="twilight" aria-pressed="false"></button></div>'+
'<div class="v88-visual" role="group"><span class="v88-visual-label"></span>'+
'<button type="button" data-v88-intensity="still" aria-pressed="false"></button>'+
'<button type="button" data-v88-intensity="gentle" aria-pressed="true"></button>'+
'<button type="button" data-v88-intensity="expressive" aria-pressed="false"></button></div>'+
'<p class="v88-note"></p>';
guide.after(panel);
const copy={
es:{heading:"EL AMBIENTE DE TU RESPIRACIÓN",lead:"Tres atmósferas con personalidad propia; no cambian el ritmo ni el temporizador.",
forest:"Bosque sereno",ocean:"Agua clara",twilight:"Atardecer",visual:"Movimiento del dragón",
still:"Quieto",gentle:"Sutil",expressive:"Expresivo",
note:"La respiración libre y el silencio visual siempre tienen prioridad. Sin audio automático."},
en:{heading:"YOUR BREATHING ENVIRONMENT",lead:"Three distinct atmospheres; they never change the pacing or session clock.",
forest:"Quiet forest",ocean:"Clear water",twilight:"Twilight",visual:"Dragon movement",
still:"Still",gentle:"Subtle",expressive:"Expressive",
note:"Free breathing and visual quiet always take priority. No automatic audio."}
};
const language=()=>document.documentElement.lang==="en"?"en":"es";
let atmosphere="forest",intensity="gentle";
function paint(){
 const lex=copy[language()];
 panel.hidden=root.dataset.studioMode!=="breath";
 panel.querySelector(".v88-head strong").textContent=lex.heading;
 panel.querySelector(".v88-head p").textContent=lex.lead;
 panel.querySelector(".v88-visual-label").textContent=lex.visual;
 panel.querySelector(".v88-note").textContent=lex.note;
 for(const b of panel.querySelectorAll("[data-v88-atmosphere]")){
 b.textContent=lex[b.dataset.v88Atmosphere];
 b.setAttribute("aria-pressed",String(atmosphere===b.dataset.v88Atmosphere));
 }
 for(const b of panel.querySelectorAll("[data-v88-intensity]")){
 b.textContent=lex[b.dataset.v88Intensity];
 b.setAttribute("aria-pressed",String(intensity===b.dataset.v88Intensity));
 }
 panel.querySelector(".v88-options").setAttribute("aria-label",lex.heading);
 panel.querySelector(".v88-visual").setAttribute("aria-label",lex.visual);
 stage.dataset.v88Atmosphere=atmosphere;
 stage.dataset.v88Intensity=intensity;
}
panel.addEventListener("click",event=>{
 const a=event.target.closest("[data-v88-atmosphere]"),b=event.target.closest("[data-v88-intensity]");
 if(!a&&!b)return;
 if(a)atmosphere=a.dataset.v88Atmosphere;
 if(b)intensity=b.dataset.v88Intensity;
 paint();root.dispatchEvent(new Event("yoga:breath-atmosphere"));
});
const watcher=new MutationObserver(events=>{if(events.some(e=>e.attributeName==="lang"||e.attributeName==="data-studio-mode"))paint()});
watcher.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
watcher.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>watcher.disconnect(),{once:true});
paint();
})();
