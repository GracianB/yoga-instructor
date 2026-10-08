/* D20 · Practice plans. Fixed ten-phase Flow, personal pacing without mutating the engine. */
(() => {
 "use strict";
 const plans=Object.freeze({
  gentle:Object.freeze({id:"gentle",factor:.8,energy:"yin",title:Object.freeze({es:"Suave",en:"Gentle"}),desc:Object.freeze({es:"Sin prisa · 13 min aprox.",en:"Unhurried · about 13 min"})}),
  balanced:Object.freeze({id:"balanced",factor:1,energy:null,title:Object.freeze({es:"Natural",en:"Natural"}),desc:Object.freeze({es:"Tu ritmo · 17 min aprox.",en:"Your pace · about 17 min"})}),
  deep:Object.freeze({id:"deep",factor:1.2,energy:"yang",title:Object.freeze({es:"Profundo",en:"Deep"}),desc:Object.freeze({es:"Más tiempo · 20 min aprox.",en:"More time · about 20 min"})})
 });
 const ids=Object.freeze(Object.keys(plans));
 const get=id=>plans[id]||plans.balanced;
 const duration=(seconds,id)=>Math.max(1,Math.round(Number(seconds||0)*get(id).factor));
 const total=(phases,id)=>phases.reduce((sum,phase)=>sum+duration(phase.durationSeconds,id),0);
 const api=Object.freeze({ids,get,duration,total});
 if(typeof window!=="undefined") window.YOGA_STUDIO_PLANS=api;
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
})();
