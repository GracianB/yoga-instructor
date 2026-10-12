/* V86 · Shape-safe articulation driven by the existing PracticeClock frame.
 * Pure math: no timers, listeners, canvas or independent state. */
(function(global){
 "use strict";
 const clamp=x=>Math.max(0,Math.min(1,x));
 function sculpt(breath,{status="idle",quiet=false,intensity=1}={}){
   if(!breath||!Number.isFinite(breath.expansion))throw new TypeError("Breath frame required");
   const active=(status==="running"||status==="paused")&&!quiet&&breath.phase!=="free";
   const e=active?clamp(breath.expansion)*clamp(intensity):0;
   return Object.freeze({
    chest:(1+.032*e).toFixed(4),
    wing:(1+.035*e).toFixed(4),
    head:(-1.9*e).toFixed(2)+"px",
    heart:(.22+.26*e).toFixed(4),
    ribs:(.4+.38*e).toFixed(4),
    phase:active?breath.phase:"rest",
    active
   });
 }
 const api=Object.freeze({sculpt});
 if(global)global.YOGA_BREATH_ARTICULATION_V86=api;
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
