/* V87: optional display detail, computed solely from D26's existing breath frame. */
(function(global){
"use strict";
function reading(frame,pattern,display="numbers"){
 if(!frame||!Number.isFinite(frame.phaseRemaining))throw new TypeError("Valid breath frame required");
 if(frame.phase==="free"||!pattern?.inhale||!pattern?.exhale)return Object.freeze({phase:"free",progress:0,seconds:null});
 const duration=frame.phase==="inhale"?pattern.inhale:pattern.exhale;
 const progress=Math.max(0,Math.min(1,1-frame.phaseRemaining/duration));
 return Object.freeze({phase:frame.phase,progress,seconds:display==="numbers"?Math.ceil(frame.phaseRemaining):null});
}
const api=Object.freeze({reading});
if(global)global.YOGA_BREATH_GUIDANCE_V87=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
