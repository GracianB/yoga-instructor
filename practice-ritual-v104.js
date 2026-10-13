/* V104 / P2 · Pure ceremony choreography from the EXISTING 200ms PracticeClock.
 * No independent timer, breath holding, sound, persistence or network activity. */
(function (global) {
"use strict";
const safe=(n)=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const easing=n=>{const x=safe(n);return x*x*(3-2*x);};
const rituals=Object.freeze({
 breath:Object.freeze([
  {id:"arrive",until:.08},
  {id:"settle",until:.21},
  {id:"breathe",until:.81},
  {id:"soften",until:.93},
  {id:"return",until:1}
 ]),
 meditation:Object.freeze([
  {id:"arrive",until:.12},
  {id:"anchor",until:.32},
  {id:"observe",until:.66},
  {id:"soften",until:.85},
  {id:"return",until:1}
 ])
});
const messages={
 es:{
  breath:{
   arrive:["Llegar a tu respiración","Encuentra un apoyo cómodo. Respira naturalmente antes de seguir cualquier ritmo."],
   settle:["Escuchar al cuerpo","Observa el movimiento del pecho sin intentar hacerlo más profundo."],
   breathe:["Un aliento a la vez","Permite que el aire llegue y salga sin esfuerzo. El ritmo mostrado es opcional."],
   soften:["Soltar el ritmo","Si lo deseas, deja de seguir la cuenta y vuelve a tu respiración espontánea."],
   return:["Volver con calma","Nota los pies, abre la mirada y continúa a tu propio ritmo."]
  },
  meditation:{
   arrive:["Hacer espacio","Acomódate sin buscar la postura perfecta. Deja que termine la prisa."],
   anchor:["Elegir un apoyo","Vuelve suavemente a tu punto de atención, sin obligarte a concentrarte."],
   observe:["Dejar pasar","Si aparece un pensamiento, reconócelo y vuelve cuando puedas."],
   soften:["Ampliar la atención","Siente también el espacio alrededor. Nada necesita ser corregido."],
   return:["Regresar despacio","Mueve las manos, siente el suelo y abre los ojos cuando te apetezca."]
  },
  focus:{
   breath:{anchor:"Observa cómo entra y sale el aire sin dirigirlo.",observe:"Sigue una exhalación natural. Puedes perder el hilo y regresar."},
   body:{anchor:"Percibe la mandíbula, los hombros y las manos, sin forzarlos.",observe:"Recorre lentamente el cuerpo y descansa en una sensación cómoda."},
   space:{anchor:"Escucha un sonido cercano, sin juzgarlo.",observe:"Deja que los sonidos lleguen y se alejen. No necesitas silencio."}
  },
  free:"No hay ritmo impuesto. Deja que tu cuerpo marque la respiración.",
  silent:"Meditación en silencio, sin instrucciones cambiantes.",
  ready:"Prepara tu espacio. La sesión comienza solo cuando tú quieras.",
  paused:"Has puesto la práctica en pausa. Puedes continuar cuando quieras.",
  finished:"Práctica terminada. Quédate un momento si lo necesitas."
 },
 en:{
  breath:{
   arrive:["Arrive with your breath","Find comfortable support. Breathe naturally before following any rhythm."],
   settle:["Listen to your body","Notice the chest moving without trying to make each breath deeper."],
   breathe:["One breath at a time","Let air come and go without effort. The displayed pace is optional."],
   soften:["Release the rhythm","If you like, stop following the count and return to your natural breathing."],
   return:["Return gently","Notice your feet, soften your gaze and continue at your own pace."]
  },
  meditation:{
   arrive:["Make room","Get comfortable without looking for a perfect posture. Let the rush settle."],
   anchor:["Find an anchor","Return gently to your chosen focus without forcing concentration."],
   observe:["Let thoughts pass","When a thought appears, notice it and return when you can."],
   soften:["Widen your attention","Include the space around you. Nothing needs fixing."],
   return:["Come back slowly","Move your hands, notice the ground and open your eyes when ready."]
  },
  focus:{
   breath:{anchor:"Notice air coming and going without guiding it.",observe:"Follow one natural exhale. Losing focus and returning is part of practice."},
   body:{anchor:"Notice your jaw, shoulders and hands without forcing them.",observe:"Move attention slowly through your body and rest on a comfortable sensation."},
   space:{anchor:"Listen for a nearby sound without judging it.",observe:"Let sounds arrive and fade. You do not need perfect silence."}
  },
  free:"There is no imposed pace. Let your body lead your breathing.",
  silent:"Silent meditation without changing instructions.",
  ready:"Prepare your space. The session starts only when you choose.",
  paused:"Your practice is paused. Continue whenever you want.",
  finished:"Your practice is complete. Stay a little longer if you need to."
 }
};
function frame({mode="breath",progress=0,status="idle",lang="es",style="guided",focus="breath",pattern="natural"}={}){
 if(!["breath","meditation"].includes(mode))throw new RangeError("Unknown practice mode");
 if(!Number.isFinite(progress))throw new RangeError("Invalid progress");
 const locale=lang==="en"?"en":"es",w=messages[locale],p=safe(progress);
 const items=rituals[mode],at=items.findIndex(s=>p<s.until),index=at<0?items.length-1:at,stage=items[index].id;
 const bounds=index?items[index-1].until:0,span=items[index].until-bounds;
 const stageProgress=safe((p-bounds)/span);
 const inactive=status!=="running"&&status!=="paused";
 const quiet=mode==="meditation"&&style==="silent";
 const key=mode==="meditation"&&["breath","body","space"].includes(focus)?focus:"breath";
 const lines=w[mode][stage], focusCue=mode==="meditation"?w.focus[key][stage]:undefined;
 let title=lines[0],body=focusCue||lines[1];
 if(mode==="breath"&&pattern==="free"&&stage==="breathe")body=w.free;
 if(quiet){title=lines[0];body=w.silent;}
 if(status==="idle"){title=lines[0];body=w.ready;}
 if(status==="paused")body=w.paused;
 if(status==="finished"){title=w[mode].return[0];body=w.finished;}
 // The guide eases the Dragon's chest into/out of the already-authored
 // breathing cycle. Free breathing stays still; the clock keeps running.
 const entry=easing(p/.01),exit=easing((1-p)/.01);
 const envelope=mode==="breath"&&pattern!=="free"&&["running","paused"].includes(status)?
  Math.min(entry,exit):0;
 return Object.freeze({mode,stage,index,total:items.length,progress:p,
  stageProgress,stageId:stage,title,body,quiet,inactive,envelope,
  canNarrate:mode==="meditation"&&!quiet&&status==="running",
  steps:Object.freeze(items.map(x=>x.id))});
}
const api=Object.freeze({frame,rituals});
if(global)global.YOGA_PRACTICE_RITUAL_V104=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
