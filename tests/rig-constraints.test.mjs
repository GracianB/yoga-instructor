import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const rig=require("../articulated-rig.js");
const {solve,dist}=require("../rig-constraints.js");
test("solver retains ankles and minimizes segment-length drift",()=>{
 const raw=rig.interpolate(rig.standing,rig.fold,.7);
 const before=rig.links.map(([a,b])=>Math.abs(dist(raw.joints[a],raw.joints[b])-dist(rig.standing.joints[a],rig.standing.joints[b])));
 const result=solve(rig.standing,raw,{iterations:150,tolerance:.75});
 const after=rig.links.map(([a,b])=>Math.abs(dist(result.joints[a],result.joints[b])-dist(rig.standing.joints[a],rig.standing.joints[b])));
 assert.deepEqual(result.joints.leftAnkle,raw.joints.leftAnkle);
 assert.deepEqual(result.joints.rightAnkle,raw.joints.rightAnkle);
 assert.ok(Math.max(...after)<=Math.max(...before));
 assert.ok(result.maxError<Math.max(...before));
 assert.ok(Object.isFrozen(result.joints));
});
test("solver rejects invalid configuration",()=>{
 assert.throws(()=>solve(null,rig.standing),TypeError);
 assert.throws(()=>solve(rig.standing,rig.fold,{iterations:0}),RangeError);
 assert.throws(()=>solve(rig.standing,rig.fold,{anchors:["fictional"]}),RangeError);
});
