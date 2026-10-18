import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const rig=require("../articulated-rig.js");
test("rig has distinct articulated joints and complete links",()=>{
 assert.equal(rig.names.length,16);
 assert.equal(rig.validate(rig.standing.joints),true);
 assert.equal(rig.validate(rig.fold.joints),true);
 for(const [a,b] of rig.links)assert.ok(rig.names.includes(a)&&rig.names.includes(b));
 assert.ok(rig.standing.joints.head[1]<rig.standing.joints.pelvis[1]);
 assert.ok(rig.fold.joints.head[1]>rig.fold.joints.pelvis[1]);
 assert.deepEqual(rig.standing.joints.leftAnkle,rig.fold.joints.leftAnkle);
 assert.deepEqual(rig.standing.joints.rightAnkle,rig.fold.joints.rightAnkle);
});
test("transition interpolates deterministically without changing originals",()=>{
 const initial=rig.interpolate(rig.standing,rig.fold,0);
 const final=rig.interpolate(rig.standing,rig.fold,1);
 const mid=rig.interpolate(rig.standing,rig.fold,.5);
 assert.deepEqual(initial.joints,rig.standing.joints);
 assert.deepEqual(final.joints,rig.fold.joints);
 assert.equal(mid.joints.chest[0],(rig.standing.joints.chest[0]+rig.fold.joints.chest[0])/2);
 assert.ok(Object.isFrozen(mid.joints));
 for(const t of [-.1,1.1,NaN])assert.throws(()=>rig.interpolate(rig.standing,rig.fold,t),RangeError);
});
