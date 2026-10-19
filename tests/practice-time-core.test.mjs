import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const core=require("../practice-time-core.js");
const {PracticeClock}=require("../studio-clock.js");
test("pure time core clamps, freezes and preserves pause time",()=>{
 assert.equal(core.elapsed(1000,null,9000,6000),1000);
 assert.equal(core.elapsed(1000,2000,5000,6000),4000);
 assert.equal(core.elapsed(1000,5000,1000,6000),1000);
 const frame=core.frame("running",6000,7000);
 assert.deepEqual(frame,{status:"running",durationMs:6000,elapsedMs:6000,remainingMs:0,progress:1});
 assert.ok(Object.isFrozen(frame));
});
test("studio adapter remains compatible with existing public snapshot",()=>{
 let now=100;
 const clock=new PracticeClock(()=>now);
 clock.start(1);now=1100;
 assert.equal(clock.snapshot().elapsedMs,1000);
 clock.pause();now=9000;
 assert.equal(clock.snapshot().elapsedMs,1000);
 clock.resume();now=10000;
 assert.equal(clock.snapshot().elapsedMs,2000);
});
