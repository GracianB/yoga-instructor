/* Deterministic length-preserving 2D joint solver, independent from any renderer.
 * Diagnostic geometry only: length constraints do not establish biomechanical safety.
 */
(function(root){
"use strict";
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const point=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
function solve(reference,target,{iterations=48,anchors=["leftAnkle","rightAnkle"],tolerance=.75}={}){
 if(!reference?.joints||!target?.joints||!Array.isArray(reference.links))throw TypeError("Joint graphs required");
 if(!Number.isInteger(iterations)||iterations<1||iterations>500)throw RangeError("Invalid iteration count");
 if(!Number.isFinite(tolerance)||tolerance<0||tolerance>100)throw RangeError("Invalid segment tolerance");
 if(!Array.isArray(anchors)||new Set(anchors).size!==anchors.length)throw RangeError("Invalid anchor set");
 for(const [key,xy] of Object.entries(reference.joints)){
  if(!point(xy)||!point(target.joints[key]))throw TypeError("Invalid joint: "+key);
 }
 const joints=Object.fromEntries(Object.entries(target.joints).map(([k,v])=>[k,[...v]]));
 const fixed=new Set(anchors);
 for(const key of fixed)if(!joints[key])throw RangeError("Unknown anchor: "+key);
 const lengths=reference.links.map(([a,b])=>{
  if(!point(reference.joints[a])||!point(reference.joints[b])||!point(joints[a])||!point(joints[b]))throw TypeError("Invalid segment: "+a+"/"+b);
  return {a,b,length:dist(reference.joints[a],reference.joints[b])};
 });
 let iterationsUsed=0;
 for(let step=0;step<iterations;step++){
  let changed=false;iterationsUsed=step+1;
  for(const {a,b,length} of lengths){
   const A=joints[a],B=joints[b],current=dist(A,B);
   if(Math.abs(current-length)<=tolerance)continue;
   const af=fixed.has(a),bf=fixed.has(b);
   if(af&&bf)continue;
   // A collapsed segment needs a deterministic direction based on its rest pose.
   const restA=reference.joints[a],restB=reference.joints[b];
   const referenceDistance=dist(restA,restB);
   if(current<1e-9&&referenceDistance<1e-9)continue;
   const ux=current<1e-9?(restB[0]-restA[0])/referenceDistance:(B[0]-A[0])/current;
   const uy=current<1e-9?(restB[1]-restA[1])/referenceDistance:(B[1]-A[1])/current;
   const delta=current-length;
   const wa=af?0:bf?1:.5,wb=bf?0:af?1:.5;
   A[0]+=ux*delta*wa;A[1]+=uy*delta*wa;
   B[0]-=ux*delta*wb;B[1]-=uy*delta*wb;
   changed=true;
  }
  if(!changed)break;
 }
 const segmentErrors=Object.freeze(lengths.map(({a,b,length})=>
  Object.freeze({a,b,reference:length,actual:dist(joints[a],joints[b]),
   error:Math.abs(dist(joints[a],joints[b])-length)})));
 const maxError=Math.max(0,...segmentErrors.map(item=>item.error));
 return Object.freeze({
  joints:Object.freeze(Object.fromEntries(Object.entries(joints).map(([k,v])=>[k,Object.freeze(v)]))),
  anchors:Object.freeze([...fixed]),maxError,converged:maxError<=tolerance,
  iterationsUsed,segmentErrors
 });
}
const api=Object.freeze({dist,solve});
if(root)root.YOGA_RIG_CONSTRAINTS=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
