/* Immutable projection boundary between teaching content and authored SVG geometry.
 * The existing renderer may keep consuming library, but presentation code should
 * consume lessons and movement/render code should consume geometry.
 */
(function(root){
"use strict";
const list=values=>Object.freeze(Array.isArray(values)?values.slice():[]);
const points=values=>Object.freeze(values.map(point=>list(point)));
const coaching=value=>Object.freeze(Object.fromEntries(["setup","breath","exit"].map(key=>[key,list(value[key])])));
function project(api){
 if(!api||!Array.isArray(api.poses)||typeof api.byId!=="function")throw TypeError("Asana library required");
 const seen=new Set();
 const lessons=[],geometry=[];
 for(const p of api.poses){
  if(!p||typeof p.id!=="string"||!p.id||seen.has(p.id))throw TypeError("Invalid or duplicate asana identifier");
  seen.add(p.id);
  if(!p.coaching||!Array.isArray(p.name)||!Array.isArray(p.cue)||!Array.isArray(p.support)||
     !Array.isArray(p.arms)||!Array.isArray(p.legs)||!Array.isArray(p.hands)||!Array.isArray(p.feet))throw TypeError("Incomplete asana: "+p.id);
  lessons.push(Object.freeze({
   id:p.id,kind:p.kind,category:p.category||null,
   name:list(p.name),cue:list(p.cue),support:list(p.support),coaching:coaching(p.coaching)
  }));
  geometry.push(Object.freeze({
   id:p.id,body:list(p.body),head:list(p.head),arms:list(p.arms),legs:list(p.legs),
   hands:points(p.hands),feet:points(p.feet),tail:list(p.tail)
  }));
 }
 const lessonMap=new Map(lessons.map(p=>[p.id,p]));
 const geometryMap=new Map(geometry.map(p=>[p.id,p]));
 return Object.freeze({
  library:api,
  lessons:Object.freeze(lessons),
  geometry:Object.freeze(geometry),
  lesson:id=>lessonMap.get(id)||null,
  drawing:id=>geometryMap.get(id)||null
 });
}
const api=Object.freeze({project});
if(root){
 root.YOGA_ASANA_DOMAIN=project(root.YOGA_ASANA_LIBRARY);
 root.YOGA_ASANA_DOMAIN_FACTORY=api;
}
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
