/* D25 · Practice options intentionally change the actual phase clock.
   Existing D20 pace is preserved when duration is "my rhythm". */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const section=root?.querySelector(".studio-plan");
 const design=window.YOGA_SESSION_DESIGN;
 if(!root||!section||!design||!window.YOGA_FLOW)return;
 const key="yoga-d25-session-options";
 const defaults={level:"steady",length:"auto",recovery:false};
 const valid=x=>design.normalize(x);
 let settings=defaults;
 try{
   const stored=JSON.parse(localStorage.getItem(key)||"null");
   if(stored && typeof stored==="object"){
     const safe=valid(stored);
     settings={level:safe.level,length:safe.length,recovery:safe.recovery};
   }
 }catch(_){}
 let locked=false;
 const ui=document.createElement("div");
 ui.className="studio-adaptation";
 ui.innerHTML='<h4 class="studio-adaptation-heading" id="studio-adaptation-title"></h4>'+
 '<div class="studio-adaptation-grid">'+
 '<label class="studio-adaptation-field"><span data-d25-label="level"></span><select data-d25-option="level"></select></label>'+
 '<label class="studio-adaptation-field"><span data-d25-label="length"></span><select data-d25-option="length"></select></label>'+
 '</div>'+
 '<label class="studio-adaptation-rest"><input type="checkbox" data-d25-option="recovery"><span data-d25-label="recovery"></span></label>'+
 '<p class="studio-adaptation-summary" aria-live="polite"></p>';
 section.insertAdjacentElement("afterend",ui);
 const level=ui.querySelector('[data-d25-option="level"]');
 const length=ui.querySelector('[data-d25-option="length"]');
 const recovery=ui.querySelector('[data-d25-option="recovery"]');
 const copy={
   es:{
     heading:"PERSONALIZA TU PRÁCTICA",level:"Experiencia",length:"Tiempo disponible",
     recovery:"Quiero dedicar más tiempo al descanso",
     steady:"Habitual",gentle:"Iniciación · sin exigencia",
     auto:"Mi ritmo (D.20)",short:"10 minutos",balanced:"17 minutos",extended:"24 minutos",
     summary:"Práctica de {time}. Los descansos se realizan en las fases existentes de calma y Savasana.",
     practice:"práctica",locked:"Los ajustes vuelven a estar disponibles al terminar."
   },
   en:{
     heading:"TAILOR YOUR PRACTICE",level:"Experience",length:"Time available",
     recovery:"I want more time for rest",
     steady:"Regular",gentle:"Getting started · no pressure",
     auto:"My rhythm (D.20)",short:"10 minutes",balanced:"17 minutes",extended:"24 minutes",
     summary:"{time} practice. Rest remains part of the existing calm and Savasana phases.",
     practice:"practice",locked:"Options return when the session ends."
   }
 };
 const lang=()=>document.documentElement.lang==="en"?"en":"es";
 const fmt=s=>Math.floor(s/60)+" min"+(s%60?" "+String(s%60).padStart(2,"0")+" s":"");
 for(const id of ["steady","gentle"]){const o=document.createElement("option");o.value=id;level.appendChild(o);}
 for(const id of ["auto","short","balanced","extended"]){const o=document.createElement("option");o.value=id;length.appendChild(o);}
 const current=()=>({...settings,pace:root.dataset.studioPace||"balanced"});
 const announce=()=>{
   root.dataset.sessionLevel=settings.level;
   root.dataset.sessionLength=settings.length;
   root.dataset.sessionRecovery=String(settings.recovery);
   window.dispatchEvent(new CustomEvent("yoga:session-design",{detail:current()}));
 };
 const sync=()=>{
   const w=copy[lang()];
   ui.querySelector(".studio-adaptation-heading").textContent=w.heading;
   for(const name of ["level","length","recovery"]){
     ui.querySelector('[data-d25-label="'+name+'"]').textContent=w[name];
   }
   for(const el of [level,length]){
     for(const option of el.options)option.textContent=w[option.value];
   }
   level.value=settings.level;
   length.value=settings.length;
   recovery.checked=settings.recovery;
   for(const el of [level,length,recovery])el.disabled=locked;
   const plan=design.build(window.YOGA_FLOW.PHASES,current());
   ui.querySelector(".studio-adaptation-summary").textContent=
     w.summary.replace("{time}",fmt(plan.totalSeconds))+(locked?" "+w.locked:"");
 };
 const change=()=>{
   if(locked)return;
   const normalized=valid({level:level.value,length:length.value,recovery:recovery.checked});
   settings={level:normalized.level,length:normalized.length,recovery:normalized.recovery};
   try{localStorage.setItem(key,JSON.stringify(settings));}catch(_){}
   announce();sync();
 };
 level.addEventListener("change",change);
 length.addEventListener("change",change);
 recovery.addEventListener("change",change);
 window.addEventListener("yoga:studio-plan",sync);
 window.addEventListener("yoga:flow",({detail})=>{
   locked=detail.status==="running"||detail.status==="paused";
   sync();
 });
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 new MutationObserver(()=>{
   ui.hidden=(root.dataset.studioMode||"asanas")!=="asanas";
 }).observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
 ui.hidden=(root.dataset.studioMode||"asanas")!=="asanas";
 announce();sync();
})();
