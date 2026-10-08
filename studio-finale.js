/* D22 · A gentle closing ceremony, not gamification.
   Stores only the mode and date of the last completed practice on this device. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const guided=root?.querySelector("#studio-guided");
 const entrance=root?.querySelector(".studio-entrance");
 if(!root||!guided||!entrance)return;
 const copy={
  es:{
   kicker:"INTEGRACIÓN · FIN DE LA PRÁCTICA",title:"Llévate esta calma contigo.",
   body:"Una respiración más. No hace falta hacer nada especial para terminar.",
   journey:"Has recorrido las diez fases de movimiento.",
   toured:"Has explorado las diez posturas.",
   guided:"Has dedicado {time} a {name}.",
   last:"Última práctica",return:"Elegir otra práctica",
   asanas:"Movimiento",breath:"Respiración",meditation:"Meditación"
  },
  en:{
   kicker:"INTEGRATION · PRACTICE COMPLETE",title:"Take this calm with you.",
   body:"One more breath. Nothing special is required to finish.",
   journey:"You have travelled through ten phases of movement.",
   toured:"You have explored the ten poses.",
   guided:"You have given {time} to {name}.",
   last:"Last practice",return:"Choose another practice",
   asanas:"Movement",breath:"Breathing",meditation:"Meditation"
  }
 };
 const lang=()=>document.documentElement.lang==="en"?"en":"es";
 const words=()=>copy[lang()];
 const key="yoga-studio-last-completed";
 let preview=false,current=null,lastToken="",lastGuidedStatus="",previousFlowStatus="";
 const read=()=>{
  try{
   const record=JSON.parse(localStorage.getItem(key)||"null");
   return record&&["asanas","breath","meditation"].includes(record.mode)&&
     typeof record.at==="string" ? record : null;
  }catch(_){return null;}
 };
 const write=record=>{
  try{localStorage.setItem(key,JSON.stringify(record));}catch(_){}
 };
 const panel=document.createElement("section");
 panel.id="studio-finale";
 panel.className="studio-finale";
 panel.hidden=true;
 panel.tabIndex=-1;
 panel.setAttribute("aria-live","polite");
 panel.innerHTML='<span class="studio-finale-kicker"></span>'+
  '<h3 class="studio-finale-title"></h3>'+
  '<p class="studio-finale-lead"></p>'+
  '<p class="studio-finale-detail"></p>'+
  '<button type="button" class="studio-finale-return" data-studio-finale-return></button>';
 guided.insertAdjacentElement("afterend",panel);
 const recent=document.createElement("p");
 recent.className="studio-last-practice";
 recent.setAttribute("aria-live","off");
 entrance.appendChild(recent);
 const dateFor=date=>{
  const value=new Date(date);
  return Number.isNaN(value.getTime())?"":value.toLocaleDateString(lang()==="en"?"en-GB":"es-ES",{day:"numeric",month:"short"});
 };
 const renderLast=()=>{
  const r=read();
  recent.hidden=!r;
  if(r)recent.textContent=words().last+": "+words()[r.mode]+" · "+dateFor(r.at);
 };
 const hide=()=>{
  panel.hidden=true;
  current=null;
  lastToken="";
 };
 const render=()=>{
  if(!current)return;
  const w=words();
  panel.querySelector(".studio-finale-kicker").textContent=w.kicker;
  panel.querySelector(".studio-finale-title").textContent=w.title;
  panel.querySelector(".studio-finale-lead").textContent=w.body;
  const detail=current.mode==="asanas"?(current.preview?w.toured:w.journey):
   w.guided.replace("{time}",current.time).replace("{name}",w[current.mode].toLowerCase());
  panel.querySelector(".studio-finale-detail").textContent=detail;
  panel.querySelector(".studio-finale-return").textContent=w.return;
 };
 const complete=(mode,kind)=>{
  const token=mode+":"+kind;
  if(token===lastToken)return;
  lastToken=token;
  let time="";
  if(mode==="asanas")time=root.querySelector("#flow-session-time")?.textContent||"";
  else {
   const chosen=guided.querySelector('[data-studio-duration-index][aria-pressed="true"]');
   const num=(chosen?.textContent||"").match(/^\d+/)?.[0]||"5";
   time=num+(lang()==="en"?" minutes":" minutos");
  }
  current={mode,time,preview:mode==="asanas"&&preview};
  panel.hidden=false;
  render();
  if(!current.preview){
   write({mode,at:new Date().toISOString()});
   renderLast();
  }
 };
 root.addEventListener("click",event=>{
  const button=event.target.closest("[data-studio-finale-return]");
  if(!button)return;
  const mode=root.dataset.studioMode||"asanas";
  const selector=mode==="asanas"?'[data-flow-action="reset"]':'[data-studio-action="reset"]';
  const control=root.querySelector(selector);
  if(control&&!control.disabled)control.click();
  hide();
  const active=root.querySelector('button[data-studio-mode="'+mode+'"]');
  active?.focus();
  entrance.scrollIntoView({block:"nearest",behavior:"instant"});
 });
 window.addEventListener("yoga:preview",({detail})=>{preview=Boolean(detail);});
 window.addEventListener("yoga:flow",({detail})=>{
  if(detail.status==="finished"&&previousFlowStatus!=="finished")complete("asanas","finish");
  else if(detail.status==="idle"||detail.status==="running"&&previousFlowStatus==="finished")hide();
  previousFlowStatus=detail.status;
 });
 const checkGuided=()=>{
  const status=guided.dataset.studioStatus||"idle";
  if(status==="finished"&&lastGuidedStatus!=="finished"){
   const mode=root.dataset.studioMode;
   if(mode==="breath"||mode==="meditation")complete(mode,"finish");
  }else if(status==="idle"&&lastGuidedStatus!=="idle")hide();
  lastGuidedStatus=status;
 };
 new MutationObserver(checkGuided).observe(guided,{attributes:true,attributeFilter:["data-studio-status"]});
 new MutationObserver(()=>{hide();lastGuidedStatus=guided.dataset.studioStatus||"idle";})
  .observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
 new MutationObserver(()=>{render();renderLast();})
  .observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 renderLast();
})();
