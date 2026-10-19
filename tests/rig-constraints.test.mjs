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

test("collapsed bone reopens in rest-pose direction instead of silently remaining zero",()=>{
 const reference={joints:{A:[0,0],B:[2,0]},links:[["A","B"]]};
 const target={joints:{A:[0,0],B:[0,0]}};
 const out=solve(reference,target,{anchors:["A"],iterations:5,tolerance:.0001});
 assert.deepEqual(out.joints.A,[0,0]);
 assert.ok(Math.abs(out.joints.B[0]-2)<.0001);
 assert.equal(out.converged,true);
 assert.equal(out.segmentErrors.length,1);
 assert.ok(Object.isFrozen(out.segmentErrors[0]));
});
test("bad tolerances, duplicate anchors and non-finite joint coordinates are rejected",()=>{
 for(const tolerance of [-1,Infinity,NaN,101])assert.throws(()=>solve(rig.standing,rig.fold,{tolerance}),RangeError);
 assert.throws(()=>solve(rig.standing,rig.fold,{anchors:["leftAnkle","leftAnkle"]}),RangeError);
 const malformed={joints:{...rig.fold.joints,leftKnee:[NaN,100]}};
 assert.throws(()=>solve(rig.standing,malformed),TypeError);
});
test("conflicting pinned endpoints report residual error without moving anchors",()=>{
 const ref={joints:{A:[0,0],B:[10,0]},links:[["A","B"]]};
 const target={joints:{A:[0,0],B:[12,0]}};
 const out=solve(ref,target,{anchors:["A","B"],iterations:10,tolerance:.01});
 assert.deepEqual(out.joints,target.joints);
 assert.equal(out.converged,false);
 assert.ok(Math.abs(out.maxError-2)<1e-9);
});
