/* V89 · Uma's attention ritual lives inside the existing Meditation stage. */
(()=>{
"use strict";
const root=document.getElementById("instructor-flow"),stage=root?.querySelector("#studio-guided");
const focus=stage?.querySelector(".studio-meditation-focus");
const ritual=window.YOGA_MEDITATION_RITUAL_V89;
if(!root||!stage||!focus||!ritual)return;
const panel=document.createElement("section");panel.className="v89-ritual";panel.hidden=true;
panel.setAttribute("aria-labelledby","v89-title");
panel.innerHTML='<div class="v89-top"><span class="v89-kicker"></span><span class="v89-caption"></span></div>'+
'<div class="v89-sequence" role="group"><span data-v89-phase="arrive"></span><span data-v89-phase="anchor"></span><span data-v89-phase="return"></span></div>'+
'<div class="v89-heart"><div class="v89-moon" aria-hidden="true">☾</div><div><h4 id="v89-title"></h4>'+
'<p class="v89-message" tabindex="-1"></p></div></div>'+
'<div class="v89-actions"><button type="button" class="v89-return"></button>'+
'<span class="v89-advice"></span></div>';
focus.after(panel);
const copy={
 es:{kicker:"UMA · RITUAL DE ATENCIÓN",caption:"Un regreso amable al presente",arrive:"01 · LLEGAR",anchor:"02 · OBSERVAR",return:"03 · VOLVER",
 button:"Me he distraído · volver al foco",advice:"No necesitas hacerlo perfecto. Puedes detenerte en cualquier momento.",silent:"La guía visual se oculta cuando eliges silencio."},
 en:{kicker:"UMA · ATTENTION RITUAL",caption:"A gentle return to the present",arrive:"01 · ARRIVE",anchor:"02 · NOTICE",return:"03 · RETURN",
 button:"My mind wandered · return to focus",advice:"There is nothing to get right. Pause at any time.",silent:"Visual coaching is hidden when you choose silence."}
};
let wandering=false,previousFocus="",previousStep="";
const language=()=>document.documentElement.lang==="en"?"en":"es";
function render(){
 const w=copy[language()],mode=root.dataset.studioMode,style=stage.dataset.meditationStyle;
 panel.hidden=mode!=="meditation"||style==="silent";
 if(panel.hidden)return;
 const phase=stage.dataset.meditationStep||"prepare";
 const point=stage.dataset.meditationFocus||"breath";
 if(point!==previousFocus||phase!==previousStep){wandering=false;previousFocus=point;previousStep=phase}
 const data=ritual.cue(point,phase,language(),wandering);
 const isGuided=style!=="silent",p2=window.YOGA_PRACTICE_RITUAL_V104;
 const ceremony=p2?.frame({
   mode:"meditation",
   progress:stage.dataset.p2RitualStage==="arrive"?.05:
     stage.dataset.p2RitualStage==="anchor"?.23:
     stage.dataset.p2RitualStage==="observe"?.49:
     stage.dataset.p2RitualStage==="soften"?.76:.95,
   focus:point,lang:language(),style,status:stage.dataset.studioStatus
 });
 panel.querySelector(".v89-kicker").textContent=w.kicker;
 panel.querySelector(".v89-caption").textContent=w.caption;
 panel.querySelector("#v89-title").textContent=data.title;
 panel.querySelector(".v89-message").textContent=wandering?data.body:ceremony&&isGuided?ceremony.body:data.body;
 panel.querySelector(".v89-return").textContent=w.button;
 panel.querySelector(".v89-advice").textContent=w.advice;
 panel.querySelector(".v89-sequence").setAttribute("aria-label",w.kicker);
 for(const p of panel.querySelectorAll("[data-v89-phase]")){
  p.textContent=w[p.dataset.v89Phase];
  p.dataset.active=String(p.dataset.v89Phase===data.key);
 }
}
panel.querySelector(".v89-return").addEventListener("click",()=>{
 wandering=true;render();panel.querySelector(".v89-message").focus?.();
});
const observer=new MutationObserver(changes=>{
 if(changes.some(c=>["data-meditation-step","data-meditation-focus","data-meditation-style","data-studio-active","data-p2-ritual-stage","data-studio-status","lang","data-studio-mode"].includes(c.attributeName)))render();
});
observer.observe(stage,{attributes:true,attributeFilter:["data-meditation-step","data-meditation-focus","data-meditation-style","data-studio-active","data-p2-ritual-stage","data-studio-status"]});
observer.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});render();
})();
