/* Yoga D.27 | Quiet meditation with optional focus.
 * Stateless cues are selected using the existing PracticeClock progress.
 * No autonomous clock, voice, extra timers or forced breathing. */
(function(global){
 "use strict";
 const STYLES=Object.freeze(["guided","silent"]);
 const FOCUSES=Object.freeze(["breath","body","space"]);
 function cue(progress,style="guided",focus="breath"){
  if(!Number.isFinite(progress))throw new RangeError("Invalid progress");
  if(style==="silent")return Object.freeze({title:"meditationFree",cue:"meditationFreeCue"});
  const p=Math.min(1,Math.max(0,progress));
  if(p<.12)return Object.freeze({title:"meditationBegin",cue:"meditationBeginCue"});
  if(p>=.86)return Object.freeze({title:"meditationEnd",cue:"meditationEndCue"});
  const cueKey=focus==="body"?"meditationBodyCue":focus==="space"?"meditationSpaceCue":"meditationFocusCue";
  return Object.freeze({title:"meditationFocus",cue:cueKey});
 }
 const api=Object.freeze({STYLES,FOCUSES,cue});
 if(global)global.YOGA_MEDITATION_D27=api;
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
