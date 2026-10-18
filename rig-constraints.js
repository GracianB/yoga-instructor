/* Deterministic length-preserving 2D joint solver. Independent of presentation. */
(function(root){
"use strict";
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function solve(reference,target,{iterations=48,anchors=["leftAnkle","rightAnkle"],tolerance=.75}={}){
 if(!reference?.joints||!target?.joints||!Array.isArray(reference.links))throw TypeError("Joint graphs required");
 if(!Number.isInteger(iterations)||iterations<1||iterations>500)throw RangeError("Invalid iteration count");
 const joints=Object.fromEntries(Object.entries(target.joints).map(([k,v])=>[k,[...v]]));
 const fixed=new Set(anchors);
 for(const key of fixed)if(!joints[key])throw RangeError("Unknown anchor: "+key);
 const lengths=reference.links.map(([a,b])=>({a,b,length:dist(reference.joints[a],reference.joints[b])}));
 for(let step=0;step<iterations;step++){
  let changed=false;
  for(const {a,b,length} of lengths){
   const A=joints[a],B=joints[b],current=dist(A,B);
   if(current<1e-9)continue;
   const diff=(current-length)/current;
   if(Math.abs(current-length)<=tolerance)continue;
   const af=fixed.has(a),bf=fixed.has(b);
   if(af&&bf)continue;
   const wa=af?0:bf?1:.5,wb=bf?0:af?1:.5;
   const dx=(B[0]-A[0])*diff,dy=(B[1]-A[1])*diff;
   A[0]+=dx*wa;A[1]+=dy*wa;
   B[0]-=dx*wb;B[1]-=dy*wb;
   changed=true;
  }
  if(!changed)break;
 }
 const errors=lengths.map(({a,b,length})=>Math.abs(dist(joints[a],joints[b])-length));
 const maxError=Math.max(0,...errors);
 return Object.freeze({joints:Object.freeze(Object.fromEntries(Object.entries(joints).map(([k,v])=>[k,Object.freeze(v)]))),
  anchors:Object.freeze([...fixed]),maxError,converged:maxError<=tolerance});
}
const api=Object.freeze({dist,solve});
if(root)root.YOGA_RIG_CONSTRAINTS=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
