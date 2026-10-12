/* V101 · A low-noise compass for all three practices. Never starts a session. */
(()=>{
"use strict";
const root=document.getElementById("instructor-flow"),model=window.YOGA_WAYFINDER_V101;
const entrance=root?.querySelector(".studio-entrance"),guided=root?.querySelector("#studio-guided");
const movement=root?.querySelector("#flow-guide");
if(!root||!model||!entrance||!guided||!movement)return;
const panel=document.createElement("section");
panel.className="v101-wayfinder";
panel.id="studio-wayfinder";
panel.setAttribute("aria-labelledby","v101-title");
panel.innerHTML='<div class="v101-main"><div class="v101-message">'+
 '<p class="v101-eyebrow"></p><h4 id="v101-title"></h4><p class="v101-cue"></p>'+
 '</div><button type="button" class="v101-find" data-v101-action="focus"></button></div>'+
 '<details class="v101-details"><summary class="v101-summary"></summary>'+
 '<ol class="v101-steps"><li></li><li></li><li></li></ol>'+
 '<p class="v101-safety"></p></details>';
const ready=entrance.querySelector("#studio-readiness");
(ready||entrance.querySelector(".studio-modes")).after(panel);
const find=panel.querySelector(".v101-find");
const locale=()=>document.documentElement.lang==="en"?"en":"es";
const choose=(selector)=>root.querySelector(selector);
function current(){
 const mode=root.dataset.studioMode||"asanas";
 const status=mode==="asanas"?movement.dataset.status||"idle":guided.dataset.studioStatus||"idle";
 return model.guidance({mode,status,
  pattern:choose('[data-breath-pattern][aria-pressed="true"]')?.dataset.breathPattern,
  style:choose('[data-meditation-style][aria-pressed="true"]')?.dataset.meditationStyle
 },locale());
}
function targetFor(state){
 if(state.mode!=="asanas")return choose('[data-studio-action="primary"]');
 const action=state.status==="idle"?"start":state.status==="finished"?"reset":"pause";
 return choose('[data-flow-action="'+action+'"]');
}
function setText(selector,value){
 const el=panel.querySelector(selector);
 if(el&&el.textContent!==value)el.textContent=value;
}
function paintLabels(labels){
 const map=[
 // The existing practice controller owns mode, breath and meditation
 // group names. V101 must never overwrite them or fight its language updates.
 [entrance,labels.entrance],
 [choose("#studio-v66-workspace"),labels.workspace],
 [choose(".studio-v66-control-pane"),labels.controls],
 [choose(".studio-duration"),labels.duration]
 ];
 for(const [element,value]of map){
  if(element&&element.getAttribute("aria-label")!==value)element.setAttribute("aria-label",value);
 }
}
function paint(){
 const state=current(),target=targetFor(state);
 panel.dataset.v101Mode=state.mode;
 panel.dataset.v101Status=state.status;
 setText(".v101-eyebrow",state.eyebrow);
 setText("#v101-title",state.title);
 setText(".v101-cue",state.cue);
 setText(".v101-summary",state.stepsLabel);
 setText(".v101-safety",state.safety);
 panel.querySelectorAll(".v101-steps li").forEach((li,i)=>{
  if(li.textContent!==state.steps[i])li.textContent=state.steps[i];
 });
 find.textContent=state.action;
 find.disabled=!target||target.disabled||!target.isConnected;
 find.setAttribute("aria-label",state.focusLabel+": "+state.action);
 paintLabels(state.labels);
}
find.addEventListener("click",()=>{
 const target=targetFor(current());
 if(!target||target.disabled||!target.isConnected)return;
 // The button locates the original controller; it never clicks it.
 target.focus({preventScroll:false});
});
const observer=new MutationObserver(records=>{
 if(records.some(record=>["data-studio-mode","data-studio-status","data-status","lang","aria-pressed","disabled"].includes(record.attributeName)))paint();
});
observer.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
observer.observe(guided,{attributes:true,attributeFilter:["data-studio-status"]});
observer.observe(movement,{attributes:true,attributeFilter:["data-status"]});
observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
for(const button of root.querySelectorAll('[data-breath-pattern],[data-meditation-style],[data-flow-action],[data-studio-action="primary"]')){
 observer.observe(button,{attributes:true,attributeFilter:["aria-pressed","disabled"]});
}
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
paint();
})();
