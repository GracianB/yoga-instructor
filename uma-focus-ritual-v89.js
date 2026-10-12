/* V89 · Non-clinical, phase-linked meditation attention cues. */
(function(global){
"use strict";
const words=Object.freeze({
 es:Object.freeze({
  breath:Object.freeze({title:"Deja llegar la respiración",arrive:"Busca una postura cómoda y observa una respiración sin modificarla.",anchor:"Nota la entrada y salida del aire. No necesitas contar.",return:"Cuando lo sientas, amplía la mirada y nota dónde estás.",reset:"La mente se ha ido. Puedes volver a una exhalación natural."}),
  body:Object.freeze({title:"Encuentra un apoyo",arrive:"Siente la superficie que sostiene tu cuerpo, sin buscar una postura perfecta.",anchor:"Percibe mandíbula, hombros y manos, y deja que descansen.",return:"Reconoce los puntos de contacto y mueve las manos con suavidad.",reset:"Volver a sentir las manos o los pies también es meditar."}),
  space:Object.freeze({title:"Escucha el espacio",arrive:"Observa la luz o el sonido más cercano, sin darle nombre.",anchor:"Deja que los sonidos aparezcan y desaparezcan; no hace falta silencio absoluto.",return:"Recupera el espacio de la habitación antes de continuar.",reset:"Un sonido puede ser el camino de vuelta al presente."})
 }),
 en:Object.freeze({
  breath:Object.freeze({title:"Welcome the breath",arrive:"Settle comfortably and notice one breath without changing it.",anchor:"Notice the air coming and going. There is no need to count.",return:"When ready, soften your gaze and notice where you are.",reset:"Your mind wandered. Return to one natural exhale."}),
  body:Object.freeze({title:"Find your support",arrive:"Feel what is supporting you without searching for the perfect posture.",anchor:"Notice the jaw, shoulders and hands, then let them rest.",return:"Notice contact with the surface and move the hands gently.",reset:"Feeling your hands or feet again also counts as practice."}),
  space:Object.freeze({title:"Listen to the room",arrive:"Notice a nearby sound or the light without giving it a label.",anchor:"Let sounds come and go; absolute silence is not required.",return:"Become aware of the room before moving on.",reset:"A sound can also bring your attention back."})
 })
});
const stage=Object.freeze({prepare:"arrive",arrive:"arrive",anchor:"anchor",return:"return",complete:"return"});
function cue(focus="breath",phase="prepare",lang="es",wandering=false){
 const locale=lang==="en"?"en":"es",record=words[locale][focus]||words[locale].breath;
 const key=stage[phase]||"arrive";
 return Object.freeze({title:record.title,body:wandering?record.reset:record[key],key,focus});
}
const api=Object.freeze({cue,words,stage});
if(global)global.YOGA_MEDITATION_RITUAL_V89=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
