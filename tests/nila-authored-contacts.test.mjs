import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {poses}=require("../asana-library.js");

function endpoint(path){
 const values=[...String(path).matchAll(/-?\d+(?:\.\d+)?/g)].map(m=>Number(m[0]));
 assert.ok(values.length===6||values.length===10,"Expected authored quadratic limb path: "+path);
 return values.slice(-2);
}
for(const pose of poses){
 test("Nila authored hands and feet land exactly on the limb geometry: "+pose.id,()=>{
  for(const [type,paths,contacts] of [
   ["arm",pose.arms,pose.hands],
   ["leg",pose.legs,pose.feet]
  ]){
   assert.equal(paths.length,2);assert.equal(contacts.length,2);
   for(let i=0;i<2;i++){
    const last=endpoint(paths[i]);
    assert.deepEqual(last,contacts[i],pose.id+" "+type+" "+i+" detached limb contact");
    assert.ok(contacts[i].every(Number.isFinite));
   }
  }
  assert.ok(pose.head.slice(0,2).every(v=>Number.isFinite(v)&&v>=0&&v<=720));
 });
}
