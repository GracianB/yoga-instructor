import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const rig=require("../articulated-rig.js");
const solver=require("../rig-constraints.js");
const motion=require("../rig-motion.js");

test("rig motion uses a smooth monotone easing with stationary endpoints",()=>{
 assert.equal(motion.ease(0),0);
 assert.equal(motion.ease(1),1);
 assert.equal(motion.ease(.5),.5);
 let previous=0;
 for(let i=1;i<=100;i++){
  const current=motion.ease(i/100);
  assert.ok(current>=previous&&current<=1,"easing must remain monotone");
  previous=current;
 }
 for(const x of [-.01,1.01,Infinity,NaN])assert.throws(()=>motion.ease(x),RangeError);
 assert.ok(motion.ease(.01)<.01,"slow in");
 assert.ok(motion.ease(.99)>.99,"slow out");
});
test("joint angle discriminates extended versus flexed knee and degenerate segments",()=>{
 assert.ok(Math.abs(motion.jointAngle([0,0],[0,1],[0,2])-180)<1e-9);
 assert.ok(Math.abs(motion.jointAngle([0,0],[0,1],[1,1])-90)<1e-9);
 assert.equal(motion.jointAngle([0,0],[0,0],[1,1]),null);
});
test("twenty-one transition snapshots stay finite, deterministic and planted",()=>{
 for(let i=0;i<=20;i++){
  const t=i/20;
  const f=motion.frame(rig,solver,t),again=motion.frame(rig,solver,t);
  assert.deepEqual(f,again);
  assert.equal(f.progress,t);
  assert.deepEqual(f.joints.leftAnkle,rig.standing.joints.leftAnkle);
  assert.deepEqual(f.joints.rightAnkle,rig.standing.joints.rightAnkle);
  assert.ok(Number.isFinite(f.maxError));
  assert.ok(Number.isFinite(f.metrics.torsoInclination));
  assert.equal(f.metrics.knees.length,2);
  assert.equal(f.metrics.hips.length,2);
  assert.ok(f.metrics.knees.every(a=>a===null||(Number.isFinite(a)&&a>=0&&a<=180)));
  assert.ok(Object.isFrozen(f));
 }
 assert.throws(()=>motion.frame(rig,solver,-.5),RangeError);
 assert.throws(()=>motion.frame(null,solver,.5),TypeError);
});
