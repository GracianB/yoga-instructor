/* P1 · Design in the Book, practise in the existing Movement Flow.
 * Only an explicit user click configures the Flow. Nothing autoplays. */
(()=>{
"use strict";
const book=document.getElementById("studio-asana-library");
const movement=document.getElementById("movement-mini");
const studio=document.getElementById("instructor-flow");
const model=window.YOGA_MOVEMENT_FLOW_P1,library=window.YOGA_ASANA_LIBRARY;
const custom=window.YOGA_MOVEMENT_CUSTOM_V94;
const controller=window.YOGA_MOVEMENT_FLOW;
if(!book||!movement||!studio||!model||!library||!controller)return;
const panel=document.createElement("section");
panel.className="p1-sequence";panel.id="p1-sequence";
panel.setAttribute("aria-labelledby","p1-sequence-heading");
panel.innerHTML='<div class="p1-heading"><span class="p1-kicker"></span><h4 id="p1-sequence-heading"></h4><p class="p1-lead"></p></div>'+
 '<div class="p1-rows" role="group" aria-label="Asanas"></div>'+
 '<div class="p1-addline"><button type="button" data-p1="add"></button><output class="p1-count"></output></div>'+
 '<div class="p1-options"><label><span class="p1-duration-label"></span><select class="p1-duration">'+
 '<option value="10">10 min</option><option value="15">15 min</option>'+
 '<option value="20" selected>20 min</option><option value="30">30 min</option></select></label>'+
 '<label class="p1-recovery"><input type="checkbox" class="p1-rest"><span class="p1-rest-label"></span></label></div>'+
 '<p class="p1-summary"></p><div class="p1-actions">'+
 '<button type="button" class="p1-prepare" data-p1="prepare"></button>'+
 '<button type="button" class="p1-classic" data-p1="classic"></button></div>'+
 '<p class="p1-status" role="status" aria-live="polite"></p>';
movement.after(panel);
// The old V20/V25 "10-minute" controls are classic-only: explain the exact
// guided plan beside the active studio instead of showing contradictory time.
const banner=document.createElement("section");
banner.className="p1-live-banner";banner.hidden=true;
banner.setAttribute("aria-live","polite");
banner.innerHTML='<strong class="p1-live-title"></strong><span class="p1-live-detail"></span>'+
 '<a href="#p1-sequence" class="p1-live-edit"></a>';
(studio.querySelector("#studio-readiness")||studio.querySelector(".studio-entrance"))?.after(banner);
const rowHost=panel.querySelector(".p1-rows"),duration=panel.querySelector(".p1-duration");
const rest=panel.querySelector(".p1-rest"),status=panel.querySelector(".p1-status");
const routes=document.getElementById("v85-route");
const lang=()=>document.documentElement.lang==="en"?"en":"es";
const words={
 es:{kicker:"P1 · MOVEMENT GUIADO",title:"Convierte tu secuencia en una práctica",
 lead:"Elige entre tres y ocho posturas. Nila las acompaña en el Flow, con preparación, transiciones y Savasana. Nada empieza solo.",
 pose:"Asana",up:"Subir",down:"Bajar",remove:"Quitar",add:"+ Añadir postura",
 duration:"Duración total",rest:"Dar más tiempo a las transiciones y al descanso",
 prepare:"Preparar sesión con Nila",classic:"Volver al Flow clásico",
 ready:"Secuencia preparada. Pulsa Empezar práctica cuando estés listo.",
 busy:"Detén o reinicia la práctica activa antes de cambiar de secuencia.",
 invalid:"Revisa las posturas: deben ser distintas. Para 8 posturas con descanso extra, aumenta la duración.",
 restored:"Flow clásico recuperado, sin iniciar ningún temporizador.",
 live:"Sesión guiada con Nila",edit:"Editar posturas en el Libro ↗",
 count:n=>n+" / 8 posturas",summary:p=>p.minutes+" minutos · "+p.postureCount+
 " asanas · "+p.transitionCount+" transiciones · "+p.phases.length+" fases"},
 en:{kicker:"P1 · GUIDED MOVEMENT",title:"Turn your sequence into a real practice",
 lead:"Choose three to eight postures. Nila guides them inside Flow, with preparation, transitions and Savasana. Nothing starts automatically.",
 pose:"Pose",up:"Move up",down:"Move down",remove:"Remove",add:"+ Add posture",
 duration:"Total duration",rest:"Allow more time for transitions and rest",
 prepare:"Prepare practice with Nila",classic:"Return to classic Flow",
 ready:"Your sequence is ready. Press Begin practice when you are ready.",
 busy:"Reset or finish the current practice before changing its sequence.",
 invalid:"Choose different postures. For 8 poses and extra rest, increase the duration.",
 restored:"Classic Flow restored without starting a clock.",
 live:"Guided practice with Nila",edit:"Edit poses in the Asana Book ↗",
 count:n=>n+" / 8 poses",summary:p=>p.minutes+" minutes · "+p.postureCount+
 " asanas · "+p.transitionCount+" transitions · "+p.phases.length+" phases"}
};
let ids=model.source("roots"),dirty=false;
const route=()=>routes?.value||"roots";
const locked=()=>["running","paused"].includes(controller.snapshot().status)||
 studio.dataset.studioMode!=="asanas";
function rowMarkup(){
 rowHost.replaceChildren();
 ids.forEach((poseId,index)=>{
  const row=document.createElement("div");row.className="p1-row";row.dataset.p1Index=index;
  const label=document.createElement("label");label.htmlFor="p1-pose-"+index;
  const select=document.createElement("select");select.id=label.htmlFor;select.dataset.p1Pose=index;
  for(const pose of library.poses){const option=document.createElement("option");option.value=pose.id;select.append(option)}
  select.value=poseId;
  const actions=document.createElement("div");actions.className="p1-reorder";
  for(const operation of ["up","down","remove"]){
   const button=document.createElement("button");button.type="button";button.dataset.p1=operation;
   button.disabled=(operation==="up"&&index===0)||(operation==="down"&&index===ids.length-1)||
    (operation==="remove"&&ids.length<=model.MIN);
   actions.append(button);
  }
  row.append(label,select,actions);rowHost.append(row);
 });
 paint();
}
function paint(){
 const t=words[lang()],ix=lang()==="en"?1:0;
 const guided=studio.dataset.movementSequence==="guided"&&studio.dataset.studioMode==="asanas";
 banner.hidden=!guided;
 banner.querySelector(".p1-live-title").textContent=t.live;
 banner.querySelector(".p1-live-detail").textContent=(studio.dataset.movementSequenceCount||ids.length)+
  (lang()==="en"?" poses · ":" posturas · ")+(studio.dataset.movementSequenceMinutes||duration.value)+" min";
 banner.querySelector(".p1-live-edit").textContent=t.edit;
 panel.querySelector(".p1-kicker").textContent=t.kicker;
 panel.querySelector("#p1-sequence-heading").textContent=t.title;
 panel.querySelector(".p1-lead").textContent=t.lead;
 panel.querySelector('[data-p1="add"]').textContent=t.add;
 panel.querySelector(".p1-count").textContent=t.count(ids.length);
 panel.querySelector(".p1-duration-label").textContent=t.duration;
 panel.querySelector(".p1-rest-label").textContent=t.rest;
 panel.querySelector('[data-p1="prepare"]').textContent=t.prepare;
 panel.querySelector('[data-p1="classic"]').textContent=t.classic;
 for(const row of rowHost.children){
  const i=Number(row.dataset.p1Index);
  row.querySelector("label").textContent=t.pose+" "+(i+1);
  row.querySelectorAll("option").forEach(option=>option.textContent=library.byId(option.value).name[ix]);
  for(const btn of row.querySelectorAll("[data-p1]")){
   btn.textContent=t[btn.dataset.p1];
   btn.setAttribute("aria-label",t.pose+" "+(i+1)+" · "+t[btn.dataset.p1]);
  }
 }
 const disabled=locked();
 panel.querySelector('[data-p1="prepare"]').disabled=disabled;
 panel.querySelector('[data-p1="classic"]').disabled=disabled;
 panel.querySelector('[data-p1="add"]').disabled=disabled||ids.length>=model.MAX;
 rowHost.querySelectorAll("select,button").forEach(el=>{
  if(disabled)el.disabled=true;
  else if(el.matches("[data-p1=up]"))el.disabled=Number(el.closest(".p1-row").dataset.p1Index)===0;
  else if(el.matches("[data-p1=down]"))el.disabled=Number(el.closest(".p1-row").dataset.p1Index)===ids.length-1;
  else if(el.matches("[data-p1=remove]"))el.disabled=ids.length<=model.MIN;
  else el.disabled=false;
 });
 duration.disabled=disabled;rest.disabled=disabled;
 try{panel.querySelector(".p1-summary").textContent=t.summary(model.build({
  poses:ids,minutes:Number(duration.value),recovery:rest.checked}));
 }catch(_){panel.querySelector(".p1-summary").textContent=t.invalid}
}
function updateFromRoute(){
 if(locked())return;
 try{ids=model.source(route(),custom?.current());dirty=false;rowMarkup()}catch(_){}
}
routes?.addEventListener("change",updateFromRoute);
rowHost.addEventListener("change",event=>{
 const select=event.target.closest("select[data-p1-pose]");
 if(!select||locked())return;
 ids[Number(select.dataset.p1Pose)]=select.value;dirty=true;paint();
});
panel.addEventListener("change",event=>{
 if(event.target===duration||event.target===rest)paint();
});
panel.addEventListener("click",event=>{
 const btn=event.target.closest("button[data-p1]");if(!btn||btn.disabled)return;
 const operation=btn.dataset.p1,t=words[lang()];
 if(operation==="prepare"){
  try{
   const plan=model.build({poses:ids,minutes:Number(duration.value),recovery:rest.checked});
   if(!controller.configure(plan)){status.textContent=t.busy;return}
   status.textContent=t.ready;
   studio.scrollIntoView({block:"start",behavior:"instant"});
   studio.querySelector('[data-flow-action="start"]')?.focus({preventScroll:true});
  }catch(_){status.textContent=t.invalid}
  paint();return;
 }
 if(operation==="classic"){
  status.textContent=controller.classic()?t.restored:t.busy;paint();return;
 }
 if(locked())return;
 if(operation==="add"){
  const next=library.poses.find(p=>!ids.includes(p.id));
  if(next&&ids.length<model.MAX){ids.push(next.id);dirty=true;rowMarkup()}
  return;
 }
 const row=btn.closest(".p1-row");if(!row)return;
 const index=Number(row.dataset.p1Index);
 if(operation==="remove"&&ids.length>model.MIN){ids.splice(index,1);dirty=true;rowMarkup()}
 if(operation==="up"&&index>0){[ids[index],ids[index-1]]=[ids[index-1],ids[index]];dirty=true;rowMarkup()}
 if(operation==="down"&&index<ids.length-1){[ids[index],ids[index+1]]=[ids[index+1],ids[index]];dirty=true;rowMarkup()}
});
const obs=new MutationObserver(paint);
obs.observe(studio,{attributes:true,attributeFilter:["data-studio-mode"]});
obs.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("yoga:flow",paint);
window.addEventListener("pagehide",()=>{obs.disconnect();window.removeEventListener("yoga:flow",paint)},{once:true});
window.addEventListener("yoga:v94-restore",()=>{if(route()==="custom")updateFromRoute()});
rowMarkup();
})();
