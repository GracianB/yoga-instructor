/* Domain boundary for asana curriculum versus authored SVG geometry. */
(function(root){
"use strict";
function project(api){
 if(!api||!Array.isArray(api.poses)||typeof api.byId!=="function")throw TypeError("Asana library required");
 const lessons=api.poses.map(p=>Object.freeze({
  id:p.id,kind:p.kind,category:p.category||null,
  name:p.name,cue:p.cue,support:p.support,coaching:p.coaching
 }));
 const geometry=api.poses.map(p=>Object.freeze({
  id:p.id,body:p.body,head:p.head,arms:p.arms,legs:p.legs,
  hands:p.hands,feet:p.feet,tail:p.tail
 }));
 const byId=(list,id)=>list.find(p=>p.id===id)||null;
 return Object.freeze({
  library:api,
  lessons:Object.freeze(lessons),
  geometry:Object.freeze(geometry),
  lesson:id=>byId(lessons,id),
  drawing:id=>byId(geometry,id)
 });
}
const api=Object.freeze({project});
if(root){
 root.YOGA_ASANA_DOMAIN=project(root.YOGA_ASANA_LIBRARY);
 root.YOGA_ASANA_DOMAIN_FACTORY=api;
}
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
