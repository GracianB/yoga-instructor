/* Yoga D.27 | Meditation is an invitation, not a stream of interruptions.
 * Stateless cues share the same studio PracticeClock. */
(function(global){
 "use strict";
 const STYLES=Object.freeze(["guided","silent"]);
 function cue(progress,style="guided"){
  if(!Number.isFinite(progress))throw new RangeError("Invalid progress");
  if(style==="silent")return Object.freeze({title:"meditationFree",cue:"meditationFreeCue"});
  const p=Math.min(1,Math.max(0,progress));
  if(p<.12)return Object.freeze({title:"meditationBegin",cue:"meditationBeginCue"});
  if(p<.86)return Object.freeze({title:"meditationFocus",cue:"meditationFocusCue"});
  return Object.freeze({title:"meditationEnd",cue:"meditationEndCue"});
 }
 const api=Object.freeze({STYLES,cue});
 if(global)global.YOGA_MEDITATION_D27=api;
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
