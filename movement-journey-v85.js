/* V85: deterministic, manual asana choreography. No autonomous practice clock. */
(function(global){
"use strict";
const curriculum=typeof window!=="undefined"?window.YOGA_CURRICULUM_V81:typeof require==="function"?require("./asana-curriculum-v81.js"):null;
const instructions={
es:{
 roots:[["Encontrar apoyo","Apoya ambos pies y nota cómo se distribuye el peso."],["Abrir espacio","Desde una base firme, permite que los brazos se extiendan."],["Explorar equilibrio","Apoya una mano si hace falta. Baja el pie cuando lo necesites."]],
 mobility:[["Llegar al suelo","Elige una forma de sentarte sin comprimir caderas ni espalda."],["Mover sin forzar","Gira un poco, vuelve al centro y no retengas la respiración."],["Soltar las caderas","Sostén las piernas con cojines si lo necesitas."]],
 restore:[["Descansar","Encuentra un apoyo cómodo para el torso y los brazos."],["Integrar","Observa cómo estás, con los hombros y la mandíbula blandos."],["Volver de pie","Recupera apoyo en ambos pies sin apresurarte."]]
},
en:{
 roots:[["Find your base","Place both feet and notice how your weight is shared."],["Make room","With a steady stance, allow the arms to extend."],["Explore balance","Use a hand for support. Lower the foot whenever you need."]],
 mobility:[["Find the floor","Choose a seat that does not compress the hips or back."],["Move without force","Rotate a little, return to centre and keep breathing normally."],["Release the hips","Use cushions to support the legs if helpful."]],
 restore:[["Rest","Find comfortable support for the torso and arms."],["Integrate","Notice how you feel, with soft shoulders and jaw."],["Return to standing","Regain balance through both feet without rushing."]]
}};
function plan(route="roots",lang="es"){
 const group=curriculum?.route(route);if(!group)throw new RangeError("Unknown movement learning route");
 const lines=instructions[lang==="en"?"en":"es"][route];
 return Object.freeze(group.poses.map((id,i)=>Object.freeze({
 id,index:i,title:lines[i][0],cue:lines[i][1],ordinal:i+1,progress:(i+1)/group.poses.length
 })));
}
function clampStep(value){return Math.max(0,Math.min(2,Number.isFinite(value)?Math.trunc(value):0))}
const api=Object.freeze({plan,clampStep,routes:Object.freeze(["roots","mobility","restore"])});
if(global)global.YOGA_MOVEMENT_JOURNEY_V85=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
