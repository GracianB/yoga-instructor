/* V94 · A deterministic three-pose plan; native Asana Book remains the renderer. */
(function(global){
"use strict";
const lib=typeof window!=="undefined"?window.YOGA_ASANA_LIBRARY:typeof require==="function"?require("./asana-library.js"):null;
const fallback=["d24-mountain","v68-warrior-ii","v68-tree"];
let ids=fallback.slice();
function validate(items){
 if(!Array.isArray(items)||items.length!==3)throw new RangeError("Exactly 3 postures required");
 if(new Set(items).size!==3)throw new RangeError("Each posture must be different");
 if(!lib||items.some(id=>!lib.byId(id)))throw new RangeError("Unknown posture");
 return items.slice();
}
function set(items){ids=validate(items);return current()}
function current(){return Object.freeze(ids.slice())}
function swap(a,b){
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||a>2||b<0||b>2)throw new RangeError("Step index");
 const next=ids.slice();[next[a],next[b]]=[next[b],next[a]];
 return set(next);
}
function plan(language="es"){
 const ix=language==="en"?1:0;
 const titles=ix?["Find your starting point","Explore the movement","Integrate and finish"]:["Encuentra un comienzo","Explora el movimiento","Integra y termina"];
 return Object.freeze(ids.map((id,index)=>{
  const p=lib.byId(id);
  return Object.freeze({id,index,ordinal:index+1,progress:(index+1)/3,title:titles[index],cue:p.cue[ix]});
 }));
}
const api=Object.freeze({set,current,swap,plan,validate});
if(global)global.YOGA_MOVEMENT_CUSTOM_V94=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
