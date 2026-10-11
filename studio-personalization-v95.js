/* V95 · An intentionally small, schema-checked visual & sequence profile.
 * Stored locally ONLY following a deliberate Save gesture. */
(function(global){
"use strict";
const comforts=Object.freeze(["balanced","calm","readable"]);
const defaultOrder=Object.freeze(["d24-mountain","v68-warrior-ii","v68-tree"]);
const validIds=new Set([
"d24-mountain","d24-downward","d24-butterfly","v68-warrior-ii",
"v68-tree","v68-triangle","v68-easy-seat","v68-twist",
"v68-seated-fold","v68-child","v68-forward-fold","v68-gratitude"
]);
function normalize(input){
 const data=input&&typeof input==="object"?input:{};
 const comfort=comforts.includes(data.comfort)?data.comfort:"balanced";
 const sequence=Array.isArray(data.sequence)&&data.sequence.length===3&&
  new Set(data.sequence).size===3&&data.sequence.every(id=>validIds.has(id))?
  data.sequence.slice():defaultOrder.slice();
 return Object.freeze({comfort,sequence:Object.freeze(sequence)});
}
function encode(value){return JSON.stringify({version:1,profile:normalize(value)})}
function decode(raw){
 try{const data=JSON.parse(raw);return normalize(data?.version===1?data.profile:null)}
 catch(_){return normalize(null)}
}
const api=Object.freeze({normalize,encode,decode,comforts,defaultOrder});
if(global)global.YOGA_PERSONALIZATION_V95=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
