/* V95 · One personalization surface, added to the existing V93 preference sheet. */
(()=>{
"use strict";
const prefs=document.getElementById("studio-preferences"),root=document.getElementById("instructor-flow");
const model=window.YOGA_PERSONALIZATION_V95,sequence=window.YOGA_MOVEMENT_CUSTOM_V94;
if(!prefs||!root||!model||!sequence)return;
const KEY="yoga-personalization-v95";
const pane=document.createElement("div");pane.className="v95-panel";
pane.innerHTML='<div class="v95-heading"><h4></h4><p></p></div>'+
'<div class="v95-presets" role="group">'+
'<button type="button" data-v95-guardian="asanas"><strong></strong><span></span></button>'+
'<button type="button" data-v95-guardian="breath"><strong></strong><span></span></button>'+
'<button type="button" data-v95-guardian="meditation"><strong></strong><span></span></button>'+
'</div>'+
'<div class="v95-reading" role="group"><strong class="v95-reading-heading"></strong>'+
'<button type="button" data-v95-comfort="balanced" aria-pressed="true"></button>'+
'<button type="button" data-v95-comfort="calm" aria-pressed="false"></button>'+
'<button type="button" data-v95-comfort="readable" aria-pressed="false"></button></div>'+
'<p class="v95-note"></p><p class="v95-status" aria-live="polite" role="status"></p>';
prefs.querySelector(".v93-fields")?.before(pane);
const status=pane.querySelector(".v95-status");
const copy={
es:{title:"ELIGE CÓMO QUIERES SENTIR EL ESTUDIO",lead:"Una identidad visual por guardián, sin cambiar el motor de práctica.",
 asanas:["Nila · Tierra","Base y movimiento"],breath:["Dragón · Agua","Respirar sin prisa"],meditation:["Uma · Luna","Atención y silencio"],
 reading:"COMODIDAD VISUAL",balanced:"Equilibrada",calm:"Muy tranquila",readable:"Lectura cómoda",
 note:"Los accesos rápidos preparan las preferencias de arriba. Pulsa Aplicar para usarlas. Guardar es opcional e incluye el orden de tus tres posturas.",
 preset:"Ruta preparada. Pulsa Aplicar sin comenzar.",
 comfort:"Comodidad visual aplicada sin tocar tu sesión.",
 stored:"Presentación y secuencia guardadas en este dispositivo.",
 cleared:"Personalización local borrada y vista normal recuperada."},
en:{title:"MAKE THIS STUDIO FEEL LIKE YOURS",lead:"A distinct guardian identity without changing the practice engine.",
 asanas:["Nila · Earth","Grounding and movement"],breath:["Dragon · Water","Unhurried breathing"],meditation:["Uma · Moon","Focus and quiet"],
 reading:"VISUAL COMFORT",balanced:"Balanced",calm:"Extra calm",readable:"Comfortable reading",
 note:"Guardian shortcuts prepare the preferences above. Press Apply to use them. Saving is optional and includes your three-pose order.",
 preset:"Route prepared. Press Apply without starting.",
 comfort:"Visual comfort updated without changing your session.",
 stored:"Presentation and sequence saved on this device.",
 cleared:"Local personalization cleared; balanced view restored."}
};
const presets={
 asanas:{mode:"asanas",route:"roots",pattern:"natural",style:"guided",focus:"body"},
 breath:{mode:"breath",route:"roots",pattern:"soft",style:"guided",focus:"breath"},
 meditation:{mode:"meditation",route:"restore",pattern:"free",style:"guided",focus:"space"}
};
let comfort="balanced";
function locale(){return document.documentElement.lang==="en"?"en":"es"}
function paint(){
 const t=copy[locale()];
 pane.querySelector(".v95-heading h4").textContent=t.title;
 pane.querySelector(".v95-heading p").textContent=t.lead;
 pane.querySelector(".v95-reading-heading").textContent=t.reading;
 pane.querySelector(".v95-note").textContent=t.note;
 for(const b of pane.querySelectorAll("[data-v95-guardian]")){
  const arr=t[b.dataset.v95Guardian];b.querySelector("strong").textContent=arr[0];b.querySelector("span").textContent=arr[1];
 }
 for(const b of pane.querySelectorAll("[data-v95-comfort]")){
  b.textContent=t[b.dataset.v95Comfort];b.setAttribute("aria-pressed",String(comfort===b.dataset.v95Comfort));
 }
 pane.querySelector(".v95-presets").setAttribute("aria-label",t.title);
 pane.querySelector(".v95-reading").setAttribute("aria-label",t.reading);
 root.dataset.v95Comfort=comfort;
}
pane.addEventListener("click",event=>{
 const g=event.target.closest("button[data-v95-guardian]");
 if(g){
  const data=presets[g.dataset.v95Guardian];
  for(const [key,value]of Object.entries(data)){
   const field=prefs.querySelector('select[data-v93-setting="'+key+'"]');
   if(field)field.value=value;
  }
  status.textContent=copy[locale()].preset;return;
 }
 const c=event.target.closest("button[data-v95-comfort]");
 if(c){comfort=c.dataset.v95Comfort;paint();status.textContent=copy[locale()].comfort}
});
// This listener observes the exact existing V93 Save/Clear gestures.
// Never save on a change of selected options or via automatic effects.
prefs.addEventListener("click",event=>{
 const action=event.target.closest("button[data-v93-action]")?.dataset.v93Action;
 if(action==="save"){
  try{localStorage.setItem(KEY,model.encode({comfort,sequence:sequence.current()}));
    status.textContent=copy[locale()].stored;
  }catch(_){status.textContent=""}
 }else if(action==="clear"){
  try{localStorage.removeItem(KEY)}catch(_){}
  comfort="balanced";sequence.set(model.defaultOrder);
  window.dispatchEvent(new Event("yoga:v94-restore"));
  paint();status.textContent=copy[locale()].cleared;
 }
});
try{
 const stored=localStorage.getItem(KEY);
 if(stored){
  const saved=model.decode(stored);
  comfort=saved.comfort;sequence.set(saved.sequence);
  window.dispatchEvent(new Event("yoga:v94-restore"));
 }
}catch(_){/* privacy mode is fully supported */}
const observer=new MutationObserver(changes=>{if(changes.some(c=>c.attributeName==="lang"))paint()});
observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
paint();
})();
