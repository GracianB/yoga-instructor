/* V104 · A single five-moment ritual display in the existing Guided room.
 * The existing 200-ms PracticeClock owns all progress; no interval or media. */
(()=>{
"use strict";
const root=document.getElementById("instructor-flow"),stage=root?.querySelector("#studio-guided");
const model=window.YOGA_PRACTICE_RITUAL_V104;
if(!root||!stage||!model)return;
const arc=document.createElement("section");
arc.id="p2-ritual";arc.className="p2-ritual";
arc.setAttribute("aria-labelledby","p2-ritual-title");
arc.innerHTML='<div class="p2-ritual-top"><strong id="p2-ritual-title"></strong><span class="p2-ritual-position"></span></div>'+
 '<ol class="p2-ritual-track"></ol><p class="p2-ritual-note"></p>';
const mount=stage.querySelector(".studio-guided-stage");
mount?.querySelector(".studio-guided-progress")?.after(arc);
const track=arc.querySelector(".p2-ritual-track");
const labels={
 es:{breath:"UN ALIENTO · UN REGRESO",meditation:"CINCO MOMENTOS DE PRESENCIA",
 stages:{arrive:"LLEGAR",settle:"ESCUCHAR",breathe:"RESPIRAR",soften:"SOLTAR",return:"VOLVER",anchor:"ANCLAR",observe:"OBSERVAR"},
 point:(i,n)=>"Momento "+i+" de "+n,
 note:"Puedes pausar, adaptar o terminar la práctica en cualquier momento."},
 en:{breath:"ONE BREATH · ONE RETURN",meditation:"FIVE MOMENTS OF PRESENCE",
 stages:{arrive:"ARRIVE",settle:"LISTEN",breathe:"BREATHE",soften:"SOFTEN",return:"RETURN",anchor:"ANCHOR",observe:"NOTICE"},
 point:(i,n)=>"Moment "+i+" of "+n,
 note:"Pause, adapt or end the practice whenever you need."}
};
const language=()=>document.documentElement.lang==="en"?"en":"es";
function update(){
 const mode=root.dataset.studioMode,style=stage.dataset.meditationStyle;
 const hidden=mode==="asanas"||(mode==="meditation"&&style==="silent");
 arc.hidden=hidden;if(hidden)return;
 const lang=language(),t=labels[lang];
 const phases=model.rituals[mode]||[];
 if(track.children.length!==phases.length||track.dataset.mode!==mode){
  track.replaceChildren();
  phases.forEach(phase=>{
   const item=document.createElement("li");item.dataset.p2Step=phase.id;
   item.innerHTML='<span class="p2-dot" aria-hidden="true"></span><span class="p2-step-text"></span>';
   track.append(item);
  });
  track.dataset.mode=mode;
 }
 const key=stage.dataset.p2RitualStage||"arrive";
 const index=Math.max(0,phases.findIndex(x=>x.id===key));
 arc.querySelector("#p2-ritual-title").textContent=t[mode];
 arc.querySelector(".p2-ritual-position").textContent=t.point(index+1,phases.length);
 arc.querySelector(".p2-ritual-note").textContent=t.note;
 const group=stage.dataset.studioStatus||"idle";
 const current=group==="idle"?-1:group==="finished"?phases.length:index;
 for(const [i,item] of [...track.children].entries()){
  const id=item.dataset.p2Step;
  item.querySelector(".p2-step-text").textContent=t.stages[id];
  item.dataset.current=String(i===current);
  item.dataset.complete=String(i<current);
  if(i===current)item.setAttribute("aria-current","step");
  else item.removeAttribute("aria-current");
 }
 arc.setAttribute("aria-label",t.point(index+1,phases.length));
}
const watch=new MutationObserver(records=>{
 if(records.some(x=>["data-studio-mode","data-studio-status","data-meditation-style","data-p2-ritual-stage","lang"].includes(x.attributeName)))update();
});
watch.observe(stage,{attributes:true,attributeFilter:["data-studio-status","data-meditation-style","data-p2-ritual-stage"]});
watch.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
watch.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>watch.disconnect(),{once:true});
update();
})();
