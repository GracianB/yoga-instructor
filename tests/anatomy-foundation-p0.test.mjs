import test from "node:test";
import assert from "node:assert/strict";
import {solveAsana,svgSkeleton} from "../anatomy-foundation-p0.mjs";
test("Tadasana is upright with grounded feet",()=>{
 const j=solveAsana("tadasana").joints;
 assert.ok(Math.abs(j.shoulder.x-j.hip.x)<1);
 assert.ok(j.head.y<j.shoulder.y);
 assert.equal(j.ankle.y,460);
});
test("Uttanasana folds at hips, head forward, arms hang",()=>{
 const j=solveAsana("uttanasana").joints;
 assert.ok(j.shoulder.x>j.hip.x+90);
 assert.ok(j.head.x>j.shoulder.x);
 assert.ok(j.wrist.y>j.shoulder.y+110);
});
test("Interpolation preserves shared joint endpoints",()=>{
 for(let i=0;i<=20;i++){
  const pose=solveAsana("uttanasana",{progress:i/20,kneeBend:.1});
  assert.equal(pose.segments.length,8);
  for(const [a,b] of pose.segments)for(const k of [a,b])assert.ok(Number.isFinite(pose.joints[k].x));
  assert.match(svgSkeleton(pose),/<svg/);
 }
});
test("Invalid pose is rejected",()=>assert.throws(()=>solveAsana("fake"),RangeError));

test("Halfway fold remains above the hip and never rotates below it",()=>{
 const j=solveAsana("uttanasana",{progress:0.5}).joints;
 assert.ok(j.shoulder.y<j.hip.y,"torso must remain above hip at midpoint");
 assert.ok(j.shoulder.x>j.hip.x,"torso must fold forward");
});
