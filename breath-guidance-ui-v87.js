/* V87: opt-in visible numbers, or one-word breath guidance; native studio owns clock. */
(()=>{
"use strict";
const stage=document.getElementById("studio-guided"),root=document.getElementById("instructor-flow");
const rhythms=stage?.querySelector(".studio-breath-patterns");
if(!stage||!root||!rhythms)return;
const panel=document.createElement("div");
panel.className="v87-guidance";
panel.hidden=true;
panel.innerHTML='<div class="v87-guidance-heading"><strong></strong><span class="v87-guidance-note"></span></div>'+
'<div class="v87-guidance-buttons" role="group"><button type="button" data-v87-display="numbers" aria-pressed="true"></button>'+
'<button type="button" data-v87-display="simple" aria-pressed="false"></button></div>'+
'<div class="v87-phase-track" aria-hidden="true"><span class="v87-phase-fill"></span></div>'+
'<p class="v87-guidance-foot"></p>';
rhythms.after(panel);
const copy={
 es:{heading:"LA GUÍA ES OPCIONAL",note:"Nunca es una orden",numbers:"Con segundos",simple:"Solo palabras",
 foot:"Puedes cambiar la presentación durante la práctica. Si algo incomoda, vuelve a tu ritmo natural."},
 en:{heading:"GUIDANCE IS OPTIONAL",note:"Never a command",numbers:"Show seconds",simple:"Words only",
 foot:"Switch the display during the session. If anything feels uncomfortable, return to natural breathing."}
};
const language=()=>document.documentElement.lang==="en"?"en":"es";
let chosen="numbers";
function render(){
 const t=copy[language()];
 panel.hidden=root.dataset.studioMode!=="breath";
 panel.querySelector(".v87-guidance-heading strong").textContent=t.heading;
 panel.querySelector(".v87-guidance-note").textContent=t.note;
 panel.querySelector(".v87-guidance-foot").textContent=t.foot;
 panel.querySelector(".v87-guidance-buttons").setAttribute("aria-label",t.heading);
 panel.querySelectorAll("[data-v87-display]").forEach(button=>{
 button.textContent=t[button.dataset.v87Display];
 button.setAttribute("aria-pressed",String(button.dataset.v87Display===chosen));
 });
 stage.dataset.v87Display=chosen;
}
panel.addEventListener("click",event=>{
 const button=event.target.closest("button[data-v87-display]");
 if(!button)return;
 chosen=button.dataset.v87Display;render();
 root.dispatchEvent(new Event("yoga:breath-presentation"));
});
const watcher=new MutationObserver(records=>{
 if(records.some(r=>r.attributeName==="data-studio-mode"||r.attributeName==="lang"))render();
});
watcher.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
watcher.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>watcher.disconnect(),{once:true});
render();
})();
