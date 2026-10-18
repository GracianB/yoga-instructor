/* Transport for yoga flow snapshots, separate from flow state logic. */
(function(root){
"use strict";
function dispatch(snapshot,target=root){
 if(target&&typeof target.dispatchEvent==="function"&&typeof CustomEvent==="function"){
  target.dispatchEvent(new CustomEvent("yoga:flow",{detail:snapshot}));
 }
 return snapshot;
}
const api=Object.freeze({dispatch});
if(root)root.YOGA_FLOW_EVENTS=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
