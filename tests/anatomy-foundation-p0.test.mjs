import test from "node:test";
import assert from "node:assert/strict";
import {solveAsana,solveLeg,svgSkeleton} from "../anatomy-foundation-p0.mjs";
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
test("Tadasana: centre aligned, two separate legs and feet on floor",()=>{
 const j=solveAsana("tadasana").joints;
 assert.ok(Math.abs(j.shoulder.x-j.hip.x)<1);
 assert.ok(j.head.y<j.shoulder.y);
 assert.equal(j.leftAnkle.y,460);
 assert.equal(j.rightAnkle.y,460);
 assert.notEqual(j.leftAnkle.x,j.rightAnkle.x);
});
test("Uttanasana: torso actually goes down, head descends, hands near ground",()=>{
 const j=solveAsana("uttanasana").joints;
 assert.ok(j.shoulder.y>j.hip.y+60,"forward fold must not remain horizontal");
 assert.ok(j.head.y>j.hip.y+100,"head descends below pelvis");
 assert.ok(j.shoulder.x>j.hip.x,"torso hinges forwards");
 assert.ok(j.rightWrist.y>=430&&j.rightWrist.y<=460,"hands near floor");
});
test("Intermediate fold turns forwards instead of rotating through the back",()=>{
 const j=solveAsana("uttanasana",{progress:0.5}).joints;
 assert.ok(j.shoulder.x>j.hip.x+85);
 assert.ok(j.shoulder.y<j.hip.y);
});
test("Tadasana → Uttanasana preserves both fixed bone lengths and foot contacts",()=>{
 for(let i=0;i<=40;i++){
  const pose=solveAsana("uttanasana",{progress:i/40,kneeBend:0.12});
  const j=pose.joints;
  assert.equal(j.leftAnkle.y,460);assert.equal(j.rightAnkle.y,460);
  for(const side of ["left","right"]){
   assert.ok(Math.abs(distance(j[side+"Hip"],j[side+"Knee"])-112)<.001,"thigh length "+side);
   assert.ok(Math.abs(distance(j[side+"Knee"],j[side+"Ankle"])-111)<.001,"shin length "+side);
   assert.ok(Math.abs(distance(j[side+"Shoulder"],j[side+"Elbow"])-53)<.001);
   assert.ok(Math.abs(distance(j[side+"Elbow"],j[side+"Wrist"])-55)<.001);
  }
  assert.ok(pose.segments.length>=18);
  assert.ok(Math.abs(distance(j.hip,j.lumbar)-45)<.001,"lumbar length");
  assert.ok(Math.abs(distance(j.lumbar,j.shoulder)-63)<.001,"thoracic length");
  assert.match(svgSkeleton(pose),/<svg/);
 }
});
test("More knee bend lowers pelvis but preserves ankle contacts",()=>{
 const a=solveAsana("uttanasana",{kneeBend:0}).joints;
 const b=solveAsana("uttanasana",{kneeBend:.5}).joints;
 assert.ok(b.hip.y>a.hip.y);
 assert.equal(b.rightAnkle.y,a.rightAnkle.y);
});
test("Unreachable knee target is exposed rather than silently lengthening bone",()=>{
 const result=solveLeg({x:0,y:0},{x:0,y:500});
 assert.equal(result.reachable,false);
});
test("Invalid poses and lengths rejected",()=>{
 assert.throws(()=>solveAsana("fake"),RangeError);
 assert.throws(()=>solveLeg({x:0,y:0},{x:2,y:2},{thigh:-1}),RangeError);
});
