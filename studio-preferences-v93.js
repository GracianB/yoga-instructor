/* V93 · Privacy-minded, schema-checked practice choices. Only user-requested storage. */
(function(global){
"use strict";
const SCHEMA=Object.freeze({
 mode:Object.freeze(["asanas","breath","meditation"]),
 route:Object.freeze(["roots","mobility","restore","custom"]),
 pattern:Object.freeze(["soft","natural","free"]),
 style:Object.freeze(["guided","silent"]),
 focus:Object.freeze(["breath","body","space"])
});
const DEFAULT=Object.freeze({mode:"asanas",route:"roots",pattern:"natural",style:"guided",focus:"breath"});
function normalize(value){
 const raw=value&&typeof value==="object"?value:{};
 const output={};
 for(const [key,values] of Object.entries(SCHEMA)){
  output[key]=values.includes(raw[key])?raw[key]:DEFAULT[key];
 }
 return Object.freeze(output);
}
function encode(data){return JSON.stringify({version:1,settings:normalize(data)})}
function decode(serialized){
 try{const data=JSON.parse(serialized);return data?.version===1?normalize(data.settings):normalize(null)}
 catch(_){return normalize(null)}
}
const api=Object.freeze({SCHEMA,DEFAULT,normalize,encode,decode});
if(global)global.YOGA_PREFERENCES_V93=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
