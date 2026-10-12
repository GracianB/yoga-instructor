/* V101 · Calm, contextual orientation. No timers, storage or practice side-effects. */
(function(global){
"use strict";
const MODES=Object.freeze(["asanas","breath","meditation"]);
const STATUSES=Object.freeze(["idle","running","paused","finished"]);
const locales={
 es:{
  eyebrow:"TU SIGUIENTE PASO",stepsLabel:"Cómo usar este espacio",focus:"Encontrar el control",
  safety:"Puedes parar o cambiar a una opción cómoda en cualquier momento. No hay audio ni inicio automático.",
  names:{asanas:"Movimiento · Nila",breath:"Respiración · Dragón",meditation:"Meditación · Uma"},
  button:{idle:"Ir a Empezar",running:"Ir a Pausa",paused:"Ir a Reanudar",finished:"Volver a practicar"},
  mode:{
   asanas:{
    steps:["Elige el recorrido y revisa la secuencia de diez fases.","Pulsa Empezar práctica; usa Anterior o Siguiente para avanzar a tu ritmo.","Pausa cuando lo necesites; Reiniciar devuelve la práctica al comienzo."],
    cue:{idle:"Elige un recorrido. La secuencia empieza solo cuando pulses Empezar.",running:"Una fase cada vez: puedes avanzar, retroceder o pausar.",paused:"La secuencia está en pausa. Puedes reanudarla cuando quieras.",finished:"Secuencia completada. Puedes volver a empezar sin perder el control."}},
   breath:{
    steps:["Escoge Suave, Natural o Libre: Libre no impone una cuenta.","Elige una duración y pulsa Empezar. El dragón acompaña el mismo reloj.","Puedes pausar en cualquier momento y volver a tu respiración espontánea."],
    cue:{idle:"Ajusta el ritmo y la duración antes de comenzar.",running:"Observa el ritmo sin forzar. El botón principal permite pausar.",paused:"El reloj está detenido. Puedes retomar cuando te apetezca.",finished:"Respiración completada. Puedes repetirla o descansar."}},
   meditation:{
    steps:["Elige Acompañada o En silencio y, si quieres, un punto de atención.","Escoge cuánto tiempo dedicarte y pulsa Empezar.","Si te distraes, vuelve suavemente al foco. Pausar no borra lo recorrido."],
    cue:{idle:"Prepara un foco amable y una duración. No empezará sola.",running:"No tienes que lograr nada; vuelve al foco cuando lo necesites.",paused:"Tu meditación está en pausa. Puedes regresar al silencio.",finished:"La meditación terminó. Tómate un momento antes de continuar."}}
  },
  free:"Has elegido ritmo Libre: respira sin contar segundos.",
  silent:"Meditación silenciosa: ninguna voz se inicia desde esta guía.",
  labels:{entrance:"Sala de práctica",modes:"Elige el tipo de práctica",workspace:"Espacio de práctica",controls:"Controles de secuencia",breath:"Ritmo de respiración",meditation:"Tipo de meditación",focus:"Punto de atención",duration:"Duración de la práctica"}
 },
 en:{
  eyebrow:"YOUR NEXT STEP",stepsLabel:"How this space works",focus:"Find the control",
  safety:"Pause or choose a comfortable option whenever you wish. Nothing starts or plays audio automatically.",
  names:{asanas:"Movement · Nila",breath:"Breath · Dragon",meditation:"Meditation · Uma"},
  button:{idle:"Go to Start",running:"Go to Pause",paused:"Go to Resume",finished:"Practise again"},
  mode:{
   asanas:{
    steps:["Choose a route and explore the ten-phase sequence.","Press Start practice. Use Previous or Next to move at your own pace.","Pause whenever needed. Reset returns the sequence to the beginning."],
    cue:{idle:"Choose a route. The sequence starts only when you press Start.",running:"One phase at a time. Move forward, back, or pause.",paused:"Your sequence is paused. Resume whenever you wish.",finished:"Sequence complete. You can begin again when ready."}},
   breath:{
    steps:["Choose Gentle, Natural or Free: Free has no forced countdown.","Choose a duration and press Start. Dragon shares the same practice clock.","Pause at any time, and always return to a comfortable natural breath."],
    cue:{idle:"Choose a rhythm and duration before you begin.",running:"Follow gently, without strain. The main control can pause.",paused:"The clock is paused. Resume whenever you feel ready.",finished:"Breathing practice complete. Repeat or rest."}},
   meditation:{
    steps:["Choose Guided or Silent and optionally a focus point.","Choose a comfortable duration, then press Start.","If your attention wanders, return gently. Pausing keeps your progress."],
    cue:{idle:"Choose a gentle focus and duration. Nothing starts on its own.",running:"Nothing to achieve. Return to your focus whenever you need.",paused:"Meditation is paused. Return to stillness at your own pace.",finished:"Meditation complete. Give yourself a moment before moving on."}}
  },
  free:"Free rhythm selected: breathe without counting seconds.",
  silent:"Silent meditation: this guide never starts spoken audio.",
  labels:{entrance:"Practice studio",modes:"Choose a practice type",workspace:"Practice workspace",controls:"Sequence controls",breath:"Breathing rhythm",meditation:"Meditation style",focus:"Point of attention",duration:"Practice duration"}
 }
};
function guidance(input={},lang="es"){
 const t=locales[lang==="en"?"en":"es"],state=input&&typeof input==="object"?input:{};
 const mode=MODES.includes(state.mode)?state.mode:"asanas";
 const status=STATUSES.includes(state.status)?state.status:"idle";
 let cue=t.mode[mode].cue[status];
 if(mode==="breath"&&state.pattern==="free"&&status==="running")cue+=" "+t.free;
 if(mode==="meditation"&&state.style==="silent"&&status==="idle")cue+=" "+t.silent;
 return Object.freeze({
  mode,status,eyebrow:t.eyebrow,title:t.names[mode],cue,
  focusLabel:t.focus,action:t.button[status],stepsLabel:t.stepsLabel,
  steps:Object.freeze(t.mode[mode].steps.slice()),safety:t.safety,labels:Object.freeze({...t.labels})
 });
}
const api=Object.freeze({guidance,MODES,STATUSES});
if(global)global.YOGA_WAYFINDER_V101=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
