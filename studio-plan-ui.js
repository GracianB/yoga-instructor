/* D20 · Accessible practice pace chooser. No new timer or session engine. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const api=window.YOGA_STUDIO_PLANS;
 const modes=root?.querySelector(".studio-modes");
 const guide=root?.querySelector("#flow-guide");
 if(!root||!api||!modes||!guide)return;
 let lang=document.documentElement.lang==="en"?"en":"es";
 const panel=document.createElement("div");
 panel.className="studio-plan";
 panel.innerHTML='<p class="studio-plan-heading" id="studio-plan-heading"></p><div class="studio-plan-options" role="group" aria-labelledby="studio-plan-heading"></div><p class="studio-plan-description" id="studio-plan-description"></p>';
 modes.insertAdjacentElement("afterend",panel);
 const group=panel.querySelector(".studio-plan-options");
 const desc=panel.querySelector(".studio-plan-description");
 let selected="balanced";
 try{
  const stored=localStorage.getItem("yoga-studio-pace");
  if(api.ids.includes(stored))selected=stored;
 }catch(_){}
 root.dataset.studioPace=selected;
 let sessionActive=false;
 for(const id of api.ids){
  const button=document.createElement("button");
  button.type="button";
  button.dataset.studioPlan=id;
  button.setAttribute("aria-pressed",String(id===selected));
  group.appendChild(button);
 }
 const draw=()=>{
  lang=document.documentElement.lang==="en"?"en":"es";
  panel.querySelector("#studio-plan-heading").textContent=
   lang==="en"?"CHOOSE YOUR RHYTHM":"ELIGE TU RITMO";
  for(const b of group.querySelectorAll("button")){
   const plan=api.get(b.dataset.studioPlan);
   b.textContent=plan.title[lang];
   b.setAttribute("aria-pressed",String(selected===plan.id));
   b.disabled=sessionActive;
  }
  desc.textContent=api.get(selected).desc[lang];
 };
 group.addEventListener("click",({target})=>{
  const b=target.closest("button[data-studio-plan]");
  if(!b||sessionActive)return;
  selected=b.dataset.studioPlan;
  root.dataset.studioPace=selected;
  const energy=api.get(selected).energy;
  if(energy)guide.querySelector('button[data-yy-form="'+energy+'"]')?.click();
  try{localStorage.setItem("yoga-studio-pace",selected);}catch(_){}
  draw();
  window.dispatchEvent(new CustomEvent("yoga:studio-plan",{detail:{id:selected}}));
 });
 root.querySelector(".studio-modes").addEventListener("click",({target})=>{
  // The plan affects the ten-pose Movement journey, not breathing/meditation.
  const next=target.closest("button[data-studio-mode]")?.dataset.studioMode;
  if(next)panel.hidden=next!=="asanas";
 });
 window.addEventListener("yoga:flow",({detail})=>{
  sessionActive=["running","paused"].includes(detail.status);
  draw();
 });
 new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 draw();
})();
