/* V98 · One coherent practice readiness summary based on live controls. */
(function(global){
"use strict";
const locales={
 es:{
 modes:{asanas:"Movement con Nila",breath:"Breath con Dragón",meditation:"Meditation con Uma"},
 routes:{roots:"Enraizar",mobility:"Movilidad amable",restore:"Descanso activo",custom:"Mi secuencia"},
 patterns:{soft:"Suave · 3/5",natural:"Natural · 4/6",free:"A tu ritmo, sin cuenta"},
 styles:{guided:"Con guía",silent:"En silencio"},
 focuses:{breath:"Atención a la respiración",body:"Atención al cuerpo",space:"Atención al entorno"},
 states:{idle:"Lista para empezar",running:"En práctica",paused:"En pausa",finished:"Completada"},
 heading:"LA PRÁCTICA QUE HAS PREPARADO",mode:"TU CAMINO",detail:"CONFIGURACIÓN",state:"ESTADO",preferences:"Ajustar mi práctica ↗"
 },
 en:{
 modes:{asanas:"Movement with Nila",breath:"Breath with Dragon",meditation:"Meditation with Uma"},
 routes:{roots:"Find your base",mobility:"Gentle mobility",restore:"Active rest",custom:"My sequence"},
 patterns:{soft:"Gentle · 3/5",natural:"Natural · 4/6",free:"Your own pace, no countdown"},
 styles:{guided:"Guided",silent:"Silent"},
 focuses:{breath:"Focus on breath",body:"Focus on body",space:"Focus on surroundings"},
 states:{idle:"Ready to begin",running:"Practising",paused:"Paused",finished:"Complete"},
 heading:"THE PRACTICE YOU'VE PREPARED",mode:"YOUR PATH",detail:"CONFIGURATION",state:"STATUS",preferences:"Adjust my practice ↗"
 }};
function summarize(state,lang="es"){
 const t=locales[lang==="en"?"en":"es"];
 const mode=t.modes[state.mode]?state.mode:"asanas";
 let detail=t.routes[state.route]||t.routes.roots;
 if(mode==="breath")detail=t.patterns[state.pattern]||t.patterns.natural;
 if(mode==="meditation")detail=(t.styles[state.style]||t.styles.guided)+
   (state.style==="silent"?"":" · "+(t.focuses[state.focus]||t.focuses.breath));
 return Object.freeze({
  heading:t.heading,modeLabel:t.mode,detailLabel:t.detail,stateLabel:t.state,
  mode:t.modes[mode],detail,
  status:t.states[state.status]||t.states.idle,
  preferences:t.preferences
 });
}
const api=Object.freeze({summarize,locales});
if(global)global.YOGA_STUDIO_COHERENCE_V98=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
