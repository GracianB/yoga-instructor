/* V96 · Pure policy for reducing expensive DOM control writes.
 * The 200ms animation clock remains authoritative and unmodified. */
(function(global){
"use strict";
function key(s){
 if(!s||!["asanas","breath","meditation"].includes(s.mode))throw new TypeError("Invalid studio mode");
 return [s.mode,s.status,s.durationIndex,s.breathPattern,s.meditationStyle,
  s.meditationFocus,Boolean(s.immersive),s.language,Boolean(s.asanaBusy)].join("|");
}
const api=Object.freeze({key});
if(global)global.YOGA_STUDIO_RENDER_POLICY_V96=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
