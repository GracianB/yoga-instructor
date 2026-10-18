/* Yoga anatomy laboratory: deterministic easing, anchored solving and measurable geometry.
 * This is an illustrative 2D study, not a range-of-motion or safety assessor.
 * Engine dependencies are injected, so neither this module nor its tests need a DOM.
 */
(function(root){
"use strict";
const clamp=t=>Math.max(0,Math.min(1,t));
const xy=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function ease(t){
 if(!Number.isFinite(t)||t<0||t>1)throw RangeError("Progress must be between 0 and 1");
 return t*t*t*(t*(6*t-15)+10);
}
function jointAngle(a,b,c){
 const u=[a[0]-b[0],a[1]-b[1]],v=[c[0]-b[0],c[1]-b[1]];
 const lengths=Math.hypot(...u)*Math.hypot(...v);
 if(lengths<1e-9)return null;
 return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/lengths)))*180/Math.PI;
}
function measure(j){
 const knees=Object.freeze(["left","right"].map(side=>jointAngle(j[side+"Hip"],j[side+"Knee"],j[side+"Ankle"])));
 const hips=Object.freeze(["left","right"].map(side=>jointAngle(j.chest,j[side+"Hip"],j[side+"Knee"])));
 const wrists=Object.freeze(["left","right"].map(side=>xy(j[side+"Wrist"],j[side+"Ankle"])));
 const torsoInclination=Math.atan2(j.chest[0]-j.pelvis[0],j.pelvis[1]-j.chest[1])*180/Math.PI;
 return Object.freeze({knees,hips,wrists,torsoInclination});
}
function frame(rig,solver,t,options={}){
 if(!rig?.standing||!rig?.fold||typeof rig.interpolate!=="function"||typeof solver?.solve!=="function")throw TypeError("Rig and constraint solver are required");
 const eased=ease(t);
 const target=rig.interpolate(rig.standing,rig.fold,eased);
 const result=solver.solve(rig.standing,target,{iterations:options.iterations??180,tolerance:options.tolerance??0.75,anchors:["leftAnkle","rightAnkle"]});
 return Object.freeze({progress:t,eased,joints:result.joints,maxError:result.maxError,
  converged:result.converged,metrics:measure(result.joints)});
}
const api=Object.freeze({ease,measure,jointAngle,frame});
if(root)root.YOGA_RIG_MOTION=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
