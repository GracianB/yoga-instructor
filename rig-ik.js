/* Deterministic two-bone inverse kinematics.
 * Solves a knee or elbow between two endpoints with a chosen bend direction.
 * Pure geometric model, not a physiological joint-angle limit.
 */
(function(root){
"use strict";
const finitePoint=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
function solve(start,end,proximal,distal,{bend=1}={}){
 if(!finitePoint(start)||!finitePoint(end))throw TypeError("Both IK endpoints must be finite 2D points");
 if(!Number.isFinite(proximal)||proximal<=0||!Number.isFinite(distal)||distal<=0)throw RangeError("Bone lengths must be positive");
 if(bend!==1&&bend!==-1)throw RangeError("Bend direction must be +1 or -1");
 const dx=end[0]-start[0],dy=end[1]-start[1],separation=Math.hypot(dx,dy);
 // An overlapping start and end has no unique axis; pick a deterministic one.
 const ux=separation>1e-9?dx/separation:0,uy=separation>1e-9?dy/separation:1;
 const low=Math.abs(proximal-distal),high=proximal+distal;
 const effective=Math.max(low,Math.min(high,separation));
 const along=effective>1e-9?(proximal*proximal-distal*distal+effective*effective)/(2*effective):0;
 const radial=Math.sqrt(Math.max(0,proximal*proximal-along*along));
 const joint=Object.freeze([start[0]+ux*along-bend*uy*radial,start[1]+uy*along+bend*ux*radial]);
 const reachable=separation>=low-1e-9&&separation<=high+1e-9;
 return Object.freeze({joint,reachable,reachError:Math.abs(separation-effective),separation});
}
const api=Object.freeze({solve});
if(root)root.YOGA_LIMB_IK=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
