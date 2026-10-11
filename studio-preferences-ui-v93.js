/* V93 · Saved defaults never start a practice, play audio or submit forms. */
(()=>{
"use strict";
const app=document.getElementById("instructor-flow"),entrance=app?.querySelector(".studio-entrance");
const model=window.YOGA_PREFERENCES_V93;
if(!app||!entrance||!model)return;
const KEY="yoga-practice-defaults-v93";
let settings=model.normalize(null);
let saved=false;
try{
 const data=window.localStorage.getItem(KEY);
 if(data){settings=model.decode(data);saved=true}
}catch(_){/* storage is optional: private mode still works */}
const panel=document.createElement("details");
panel.className="v93-preferences";panel.id="studio-preferences";
panel.innerHTML='<summary class="v93-summary"><span class="v93-summary-main"></span><span class="v93-summary-hint"></span></summary>'+
'<div class="v93-fields">'+
'<label><span data-v93-label="mode"></span><select data-v93-setting="mode"><option value="asanas"></option><option value="breath"></option><option value="meditation"></option></select></label>'+
'<label><span data-v93-label="route"></span><select data-v93-setting="route"><option value="roots"></option><option value="mobility"></option><option value="restore"></option><option value="custom"></option></select></label>'+
'<label><span data-v93-label="pattern"></span><select data-v93-setting="pattern"><option value="soft"></option><option value="natural"></option><option value="free"></option></select></label>'+
'<label><span data-v93-label="style"></span><select data-v93-setting="style"><option value="guided"></option><option value="silent"></option></select></label>'+
'<label><span data-v93-label="focus"></span><select data-v93-setting="focus"><option value="breath"></option><option value="body"></option><option value="space"></option></select></label>'+
'</div><div class="v93-actions"><button type="button" data-v93-action="apply"></button>'+
'<button type="button" data-v93-action="save"></button>'+
'<button type="button" data-v93-action="clear"></button></div>'+
'<p class="v93-privacy"></p><p class="v93-status" aria-live="polite" role="status"></p>';
entrance.querySelector(".studio-modes")?.insertAdjacentElement("afterend",panel);
const fields=[...panel.querySelectorAll("[data-v93-setting]")],status=panel.querySelector(".v93-status");
const i18n={
es:{
 title:"PREPARA TU PRÁCTICA",hint:"Preferencias · opcionales",
 intro:"Modo",mode:"Modo",route:"Recorrido Movement",pattern:"Ritmo Breath",style:"Meditation · guía",focus:"Meditation · foco",
 asanas:"Movement · Nila",breath:"Breath · Dragón",meditation:"Meditation · Uma",
 roots:"Enraizar",mobility:"Movilidad amable",restore:"Descanso activo",
 soft:"Suave 3/5",natural:"Natural 4/6",free:"Libre",guided:"Acompañada",silent:"En silencio",body:"Cuerpo",space:"Entorno",
 apply:"Aplicar sin comenzar",save:"Guardar en este dispositivo",clear:"Borrar lo guardado",
 privacy:"Solo al pulsar Guardar se conservan estas cinco elecciones, la presentación visual y tu secuencia de tres posturas. No se guarda historial ni información de salud. Puedes borrarlo todo aquí.",
 applied:"Preferencias aplicadas. La práctica sigue parada hasta que pulses Empezar.",
 busy:"Primero termina o reinicia la práctica activa para cambiar la configuración.",
 kept:"Guardadas en este dispositivo. Al volver, pulsa Aplicar para activarlas.",
 blocked:"Este navegador no permite guardar. Puedes aplicarlas mientras mantengas la página abierta.",
 cleared:"Preferencias locales borradas. Ninguna sesión se ha iniciado."},
en:{
 title:"PREPARE YOUR PRACTICE",hint:"Preferences · optional",
 mode:"Mode",route:"Movement route",pattern:"Breath pace",style:"Meditation guidance",focus:"Meditation focus",
 asanas:"Movement · Nila",breath:"Breath · Dragon",meditation:"Meditation · Uma",
 roots:"Find your base",mobility:"Gentle mobility",restore:"Active rest",
 soft:"Gentle 3/5",natural:"Natural 4/6",free:"Free",guided:"Guided",silent:"Silent",body:"Body",space:"Surroundings",
 apply:"Apply without starting",save:"Save on this device",clear:"Clear saved preferences",
 privacy:"Only when you click Save are these five choices, visual comfort and your three-pose sequence stored locally. No practice history or health data is stored. You can clear everything here.",
 applied:"Preferences applied. Your practice stays stopped until you press Begin.",
 busy:"Finish or reset the active session before changing its settings.",
 kept:"Saved on this device. Next visit, press Apply to use them.",
 blocked:"Storage isn't available in this browser. You can still apply settings this visit.",
 cleared:"Local preferences cleared. No session has started."}
};
const locale=()=>document.documentElement.lang==="en"?"en":"es";
const words=()=>i18n[locale()];
function collect(){
 const obj={};for(const input of fields)obj[input.dataset.v93Setting]=input.value;
 return model.normalize(obj);
}
function refresh(){
 const dict=words();
 panel.querySelector(".v93-summary-main").textContent=dict.title;
 panel.querySelector(".v93-summary-hint").textContent=dict.hint;
 panel.querySelector(".v93-privacy").textContent=dict.privacy;
 for(const input of fields){
  const kind=input.dataset.v93Setting;
  panel.querySelector('[data-v93-label="'+kind+'"]').textContent=dict[kind];
  for(const option of input.options)option.textContent=dict[option.value];
  // Disabled only visually? No: irrelevant settings stay configurable for future visits.
 }
 for(const button of panel.querySelectorAll("[data-v93-action]"))button.textContent=dict[button.dataset.v93Action];
}
function setFields(values){
 for(const input of fields)input.value=values[input.dataset.v93Setting];
}
function canApply(){
 const status=app.querySelector("#studio-guided")?.dataset.studioStatus||"idle";
 const movement=app.querySelector("#flow-guide")?.dataset.status||"idle";
 return !["running","paused"].includes(status)&&!["running","paused"].includes(movement);
}
function clickOption(selector){
 const btn=app.querySelector(selector);
 if(!btn||btn.disabled)return false;
 if(btn.getAttribute("aria-pressed")!=="true")btn.click();
 return true;
}
function apply(){
 if(!canApply()){status.textContent=words().busy;return}
 settings=collect();
 if(!clickOption('button.studio-mode[data-studio-mode="'+settings.mode+'"]')){
  status.textContent=words().busy;return;
 }
 if(settings.mode==="asanas"){
  const route=document.querySelector("#v85-route");
  if(route){route.value=settings.route;route.dispatchEvent(new Event("change",{bubbles:true}))}
 }
 if(settings.mode==="breath")clickOption('button[data-breath-pattern="'+settings.pattern+'"]');
 if(settings.mode==="meditation"){
  clickOption('button[data-meditation-style="'+settings.style+'"]');
  if(settings.style==="guided")clickOption('button[data-meditation-focus="'+settings.focus+'"]');
 }
 status.textContent=words().applied;
}
panel.addEventListener("click",event=>{
 const action=event.target.closest("button[data-v93-action]")?.dataset.v93Action;
 if(!action)return;
 if(action==="apply"){apply();return}
 if(action==="save"){
  settings=collect();
  try{window.localStorage.setItem(KEY,model.encode(settings));saved=true;status.textContent=words().kept}
  catch(_){status.textContent=words().blocked}
 }else if(action==="clear"){
  try{window.localStorage.removeItem(KEY)}catch(_){}
  saved=false;settings=model.normalize(null);setFields(settings);
  status.textContent=words().cleared;
 }
});
const watcher=new MutationObserver(refresh);
watcher.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>watcher.disconnect(),{once:true});
setFields(settings);refresh();
})();
