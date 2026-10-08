/* D.28 · Quiet anatomical choreography.
 * A pure function: existing breathing clock -> subtle SVG surface changes.
 * No timers, no independent gait, no transformed paws, eyes or tail root. */
(function(global){
 "use strict";
 const clamp=(n)=>Math.max(0,Math.min(1,n));
 const round=(n)=>n.toFixed(4);
 function sculpt(breath,active=true){
  if(!breath||!Number.isFinite(breath.expansion))throw new TypeError("Breath frame required");
  const e=active&&breath.phase!=="free"?clamp(breath.expansion):0;
  return Object.freeze({
   rib:round(1+0.018*e),
   dorsal:round(.3+.44*e),
   arch:round(.33+.42*e),
   wing:round(.76+.19*e),
   wingVein:round(.32+.34*e),
   tailLight:round(.2+.11*e),
   halo:round(.16+.25*e),
   horn:round(.35+.33*e)
  });
 }
 const api=Object.freeze({sculpt});
 if(global)global.YOGA_ANATOMY_D28=api;
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
