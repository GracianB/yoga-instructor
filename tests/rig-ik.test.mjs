import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {solve}=require("../rig-ik.js");
const {dist}=require("../rig-constraints.js");

test("two-bone IK preserves both bone lengths and mirrors the bend side",()=>{
 const start=[0,0],end=[0,10];
 const left=solve(start,end,6,6,{bend:1});
 const right=solve(start,end,6,6,{bend:-1});
 assert.equal(left.reachable,true);
 assert.ok(Math.abs(dist(start,left.joint)-6)<1e-8);
 assert.ok(Math.abs(dist(end,left.joint)-6)<1e-8);
 assert.ok(left.joint[0]<0&&right.joint[0]>0);
 assert.equal(left.joint[1],right.joint[1]);
 assert.ok(Object.isFrozen(left.joint));
});
test("unreachable IK reports a non-zero reach error rather than fabricating contact",()=>{
 const far=solve([0,0],[0,20],6,6);
 assert.equal(far.reachable,false);
 assert.ok(Math.abs(far.reachError-8)<1e-9);
 const near=solve([0,0],[0,0],8,3);
 assert.equal(near.reachable,false);
 assert.equal(near.reachError,5);
});
test("IK rejects invalid limb geometry and direction",()=>{
 assert.throws(()=>solve([NaN,0],[0,1],3,4),TypeError);
 assert.throws(()=>solve([0,0],[0,1],0,4),RangeError);
 assert.throws(()=>solve([0,0],[0,1],4,4,{bend:0}),RangeError);
});
