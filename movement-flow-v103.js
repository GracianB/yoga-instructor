/* P1: deterministic 3–8 pose Movement practice, no additional clock. */
(function(global){"use strict";
const library=typeof window!=="undefined"?window.YOGA_ASANA_LIBRARY:require("./asana-library.js");
const curriculum=typeof window!=="undefined"?window.YOGA_CURRICULUM_V81:require("./asana-curriculum-v81.js");
const MINUTES=Object.freeze([10,15,20,30]),MIN=3,MAX=8;
const vocab={
 es:{arrive:["Llegada","Encuentra un apoyo cómodo y observa cómo estás."],warmup:["Preparación","Moviliza el cuerpo gradualmente y sin forzar."],transition:["Transición","Cambia de postura lentamente; usa apoyo si cambias de altura."],cooldown:["Vuelta a la calma","Afloja las articulaciones y reduce la intensidad."],savasana:["Savasana","Descansa con comodidad; puedes doblar las rodillas."],finish:["Cierre","Deja que la respiración se asiente antes de continuar."]},
 en:{arrive:["Arrival","Find a comfortable support and notice how you feel."],warmup:["Preparation","Move gradually and without forcing."],transition:["Transition","Change posture slowly; use support if changing levels."],cooldown:["Cool down","Soften your joints and ease out of movement."],savasana:["Savasana","Rest comfortably; your knees can remain bent."],finish:["Closing","Allow your breathing to settle before continuing."]}
};
const validate=items=>{
 if(!Array.isArray(items)||items.length<MIN||items.length>MAX)throw new RangeError("Choose 3 to 8 postures");
 if(new Set(items).size!==items.length||items.some(id=>!library.byId(id)))throw new RangeError("Postures must exist and be different");
 return items.slice();
};
const source=(route="roots",custom)=>route==="custom"?validate(custom):validate(curriculum.route(route)?.poses);
function build(input={}){
 const ids=validate(input.poses),minutes=Number(input.minutes??20),recovery=input.recovery===true;
 if(!MINUTES.includes(minutes))throw new RangeError("Unsupported duration");
 const target=minutes*60;
 const fixed=[["seq-arrival","arrive","centering",30],["seq-warmup","warmup","warmup",60]];
 const ending=[["seq-cooldown","cooldown","cooldown",40],["seq-savasana","savasana","savasana",recovery?85:60],["seq-finish","finish","finish",20]];
 const bridge=recovery?25:15;
 const floor=fixed.reduce((a,r)=>a+r[3],0)+ending.reduce((a,r)=>a+r[3],0)+
  (ids.length-1)*bridge+ids.length*30;
 if(floor>target)throw new RangeError("Increase duration or reduce rest");
 const weights=ids.map(id=>({standing:1.1,seated:1,restorative:.92})[library.byId(id).category]||1);
 const extras=weights.map(x=>(target-floor)*x/weights.reduce((a,b)=>a+b,0));
 const holds=extras.map(x=>30+Math.floor(x));
 let remain=target-floor-extras.reduce((a,x)=>a+Math.floor(x),0);
 const order=extras.map((x,i)=>({i,rem:x%1})).sort((a,b)=>b.rem-a.rem||a.i-b.i);
 for(let i=0;i<remain;i++)holds[order[i].i]++;
 const translated=(key,id,stagePose,durationSeconds)=>({
  id,kind:key,stagePose,durationSeconds,label:key.toUpperCase(),
  localizedName:{es:vocab.es[key][0],en:vocab.en[key][0]},
  localizedCue:{es:vocab.es[key][1],en:vocab.en[key][1]},
  cue:vocab.es[key][1]});
 const steps=fixed.map(([id,key,pose,s])=>translated(key,id,pose,s));
 for(let i=0;i<ids.length;i++){
  const pose=library.byId(ids[i]);
  steps.push({id:"seq-asana-"+i,kind:"asana",poseId:pose.id,stagePose:pose.id,
   durationSeconds:holds[i],label:"ASANA",
   localizedName:{es:pose.name[0],en:pose.name[1]},
   localizedCue:{es:pose.cue[0],en:pose.cue[1]},cue:pose.cue[0]});
  if(i<ids.length-1)steps.push(translated("transition","seq-transition-"+i,"transition",bridge));
 }
 steps.push(...ending.map(([id,key,pose,s])=>translated(key,id,pose,s)));
 const phases=Object.freeze(steps.map(p=>Object.freeze({...p,
  localizedName:Object.freeze(p.localizedName),localizedCue:Object.freeze(p.localizedCue)})));
 return Object.freeze({poses:Object.freeze(ids),minutes,recovery,totalSeconds:target,phases,
  postureCount:ids.length,transitionCount:ids.length-1});
}
const api=Object.freeze({MINUTES,MIN,MAX,validate,source,build});
if(global)global.YOGA_MOVEMENT_FLOW_P1=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
