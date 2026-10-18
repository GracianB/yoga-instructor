/* Shared pure time calculations. No DOM, timers or background loops. */
(function(root){
"use strict";
function elapsed(before,startedAt,now,duration){
 const delta=startedAt===null?0:Math.max(0,now-startedAt);
 return Math.min(duration,before+delta);
}
function frame(status,durationMs,elapsedMs){
 const safe=Math.max(0,Math.min(durationMs,elapsedMs));
 return Object.freeze({status,durationMs,elapsedMs:safe,remainingMs:durationMs-safe,progress:durationMs?safe/durationMs:0});
}
const api=Object.freeze({elapsed,frame});
if(root)root.YOGA_TIME_CORE=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
