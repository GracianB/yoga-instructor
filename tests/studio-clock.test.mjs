import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {PracticeClock}=require("../studio-clock.js");

test("D18: clock starts from zero and counts monotonic time",()=>{
  let now=0;const clock=new PracticeClock(()=>now);
  assert.equal(clock.snapshot().status,"idle");
  clock.start(3);
  now=1400;
  assert.equal(clock.snapshot().elapsedMs,1400);
  assert.equal(clock.snapshot().remainingMs,178600);
  assert.equal(clock.snapshot().progress,1400/180000);
});
test("D18: pause freezes remaining time and resume keeps elapsed",()=>{
  let now=0;const clock=new PracticeClock(()=>now);
  clock.start(5);
  now=12500;clock.pause();
  now=90000;
  assert.equal(clock.snapshot().elapsedMs,12500);
  clock.resume();now=95500;
  assert.equal(clock.snapshot().elapsedMs,18000);
  clock.reset(8);
  assert.equal(clock.snapshot().status,"idle");
  assert.equal(clock.snapshot().durationMs,480000);
  assert.equal(clock.snapshot().elapsedMs,0);
});
test("D18: completion clamps time, prevents a second start, and can restart",()=>{
  let now=0;const clock=new PracticeClock(()=>now);
  clock.start(0.01);
  now=600;
  assert.equal(clock.snapshot().status,"finished");
  assert.equal(clock.snapshot().elapsedMs,600);
  now=1000000;
  assert.equal(clock.snapshot().remainingMs,0);
  assert.equal(clock.snapshot().progress,1);
  clock.start(3);
  assert.equal(clock.snapshot().status,"running");
  assert.equal(clock.snapshot().remainingMs,180000);
});
test("D18: duration input is validated, including NaN and negative values",()=>{
  const clock=new PracticeClock(()=>0);
  for(const value of [0,-2,NaN,Infinity,91]) assert.throws(()=>clock.reset(value),RangeError);
  clock.reset(15);assert.equal(clock.snapshot().durationMs,900000);
});
