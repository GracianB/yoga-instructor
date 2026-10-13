/* V98 · A live summary, not a fourth practice engine or another preference form. */
(()=>{
"use strict";
const root=document.getElementById("instructor-flow"),model=window.YOGA_STUDIO_COHERENCE_V98;
const entrance=root?.querySelector(".studio-entrance"),guided=root?.querySelector("#studio-guided");
const movement=root?.querySelector("#flow-guide");
if(!root||!model||!entrance||!guided||!movement)return;
const panel=document.createElement("section");
panel.className="v98-readiness";panel.id="studio-readiness";
panel.setAttribute("aria-labelledby","v98-title");
panel.innerHTML='<div class="v98-top"><h4 id="v98-title"></h4><a href="#studio-preferences" class="v98-preferences"></a></div>'+
'<div class="v98-grid"><div><small class="v98-label-mode"></small><strong class="v98-mode"></strong></div>'+
'<div><small class="v98-label-detail"></small><strong class="v98-detail"></strong></div>'+
'<div><small class="v98-label-state"></small><output class="v98-state" aria-live="polite"></output></div></div>';
entrance.querySelector(".studio-modes")?.after(panel);
const route=document.getElementById("v85-route");
const prefs=document.getElementById("studio-preferences");
const chosen=(selector,attr)=>root.querySelector(selector+'[aria-pressed="true"]')?.getAttribute(attr)||"";
const language=()=>document.documentElement.lang==="en"?"en":"es";
function paint(){
 const mode=root.dataset.studioMode||"asanas";
 const state=mode==="asanas"?movement.dataset.status||"idle":guided.dataset.studioStatus||"idle";
 const summary=model.summarize({
   mode,status:state,
   route:route?.value||"roots",
   pattern:chosen("button[data-breath-pattern]","data-breath-pattern")||"natural",
   style:chosen("button[data-meditation-style]","data-meditation-style")||"guided",
   focus:chosen("button[data-meditation-focus]","data-meditation-focus")||"breath"
 },language());
 const guidedDetail=mode==="asanas"&&root.dataset.movementSequence==="guided"?
  (language()==="en"?"Guided · ":"Guiada · ")+
  (root.dataset.movementSequenceCount||"3")+(language()==="en"?" poses · ":" posturas · ")+
  (root.dataset.movementSequenceMinutes||"20")+" min":null;
 const entries={".v98-mode":summary.mode,".v98-detail":guidedDetail||summary.detail,
 ".v98-state":summary.status,".v98-label-mode":summary.modeLabel,
 ".v98-label-detail":summary.detailLabel,".v98-label-state":summary.stateLabel,
 "#v98-title":summary.heading,".v98-preferences":summary.preferences};
 for(const [selector,value]of Object.entries(entries)){
  const target=panel.querySelector(selector);if(target&&target.textContent!==value)target.textContent=value;
 }
 panel.dataset.v98Mode=mode;
 panel.dataset.v98Status=state;
}
panel.querySelector(".v98-preferences").addEventListener("click",()=>{
 if(prefs&&!prefs.open)prefs.open=true;
});
const observe=new MutationObserver(records=>{
 if(records.some(r=>["data-studio-mode","data-studio-status","data-status",
 "aria-pressed","lang"].includes(r.attributeName)))paint();
});
observe.observe(root,{attributes:true,attributeFilter:["data-studio-mode","data-movement-sequence","data-movement-sequence-count","data-movement-sequence-minutes"]});
observe.observe(guided,{attributes:true,attributeFilter:["data-studio-status"]});
observe.observe(movement,{attributes:true,attributeFilter:["data-status"]});
for(const button of root.querySelectorAll("button[data-breath-pattern],button[data-meditation-style],button[data-meditation-focus]")){
 observe.observe(button,{attributes:true,attributeFilter:["aria-pressed"]});
}
observe.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
route?.addEventListener("change",paint);
window.addEventListener("pagehide",()=>{observe.disconnect();route?.removeEventListener("change",paint)},{once:true});
paint();
})();
