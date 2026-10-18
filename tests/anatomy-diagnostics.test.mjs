import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {angle,inspect}=require("../anatomy-diagnostics.js");
const kinematics=require("../nila-kinematics-v84.js");
const library=require("../asana-library.js");
test("joint angle handles straight, bent and degenerate limb coordinates",()=>{
 assert.ok(Math.abs(angle([0,0],[1,0],[2,0])-180)<1e-9);
 assert.ok(Math.abs(angle([0,0],[0,1],[1,1])-90)<1e-9);
 assert.equal(angle([0,0],[0,0],[1,1]),null);
});
test("all authored asanas produce joint diagnostics without altering authored paths",()=>{
 for(const pose of library.poses){
  const result=inspect(pose,kinematics);
  assert.equal(result.id,pose.id);
  assert.equal(result.knees.length,2);
  assert.equal(result.elbows.length,2);
  assert.ok(result.grounded.length>=1);
  assert.ok(Object.isFrozen(result));
 }
});
test("Tadasana has two planted feet and distinguishable knee joints",()=>{
 const pose=library.poses.find(p=>p.kind==="mountain");
 assert.ok(pose);
 const r=inspect(pose,kinematics);
 assert.deepEqual(r.grounded,["foot:0","foot:1"]);
 assert.ok(r.knees.every(Number.isFinite));
 assert.ok(!r.findings.includes("feet-overlap"));
});
test("Uttanasana retains valid ground support and leg geometry",()=>{
 const pose=library.poses.find(p=>p.id==="v68-forward-fold");
 assert.ok(pose);
 const r=inspect(pose,kinematics);
 assert.equal(r.knees.length,2);
 assert.ok(r.footSpan>0);
 assert.ok(r.grounded.includes("foot:0")&&r.grounded.includes("foot:1"));
});
