/* V102 · Guardian motion from the EXISTING 200ms PracticeClock only.
 * Pure functions: no timers, observers, RAF, persistence or audio. */
(function(global){
"use strict";
const clamp=value=>Math.max(0,Math.min(1,Number.isFinite(value)?value:0));
const fixed=n=>n.toFixed(4);
const px=n=>n.toFixed(2)+"px";
function breath(frame,{status="idle",quiet=false}={}){
 if(!frame||!Number.isFinite(frame.expansion))throw new TypeError("Breath frame required");
 const active=(status==="running"||status==="paused")&&frame.phase!=="free"&&!quiet;
 const e=active?clamp(frame.expansion):0;
 // Consciously legible without uprooting shoulders, tail or planted paws.
 return Object.freeze({
  chestX:fixed(1+.19*e),chestY:fixed(1+.09*e),
  bellyX:fixed(1+.16*e),bodyX:fixed(1+.045*e),
  halo:fixed(1+.16*e),haloOpacity:fixed(.39+.43*e),
  wing:fixed(1+.13*e),mistOpacity:fixed(active&&frame.phase==="exhale"?.30+.44*(1-e):0),
  active
 });
}
function meditation({elapsedMs=0,status="idle",quiet=false}={}){
 if(!Number.isFinite(elapsedMs)||elapsedMs<0)throw new RangeError("elapsedMs must be finite and non-negative");
 const participating=(status==="running"||status==="paused")&&!quiet;
 const complete=status==="finished"&&!quiet;
 // Only ornaments move, not Uma's grounded pelvis, knees or arms.
 const drift=participating?Math.sin(elapsedMs/1600):0;
 const orbit=participating?Math.sin(elapsedMs/2250):0;
 const glow=participating?.63+.20*Math.sin(elapsedMs/2350):complete?.94:.55;
 return Object.freeze({
  fireflyX:px(11*orbit),fireflyY:px(-7*drift),
  starX:px(-8*orbit),starY:px(6*drift),
  lanternGlow:fixed(glow),
  lotus:fixed(complete?1:participating?.30+.28*(.5+.5*drift):.22),
  awake:complete
 });
}
const api=Object.freeze({breath,meditation});
if(global)global.YOGA_GUARDIAN_MOTION_V102=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
