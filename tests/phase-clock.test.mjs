import assert from "node:assert/strict";
import test from "node:test";

import phaseClock from "../flow-phase.js";

const { YogaPhaseClock } = phaseClock;

const createClock = () => {
  let now = 0;
  const clock = new YogaPhaseClock(() => now);
  return { clock, advance(ms) { now += ms; } };
};

test("Phase Clock: measures the active phase", () => {
  const { clock, advance } = createClock();
  clock.start();
  advance(9_500);
  assert.equal(clock.snapshot().elapsedSeconds, 9);
  assert.equal(clock.snapshot().status, "running");
});

test("Phase Clock: pause freezes phase time", () => {
  const { clock, advance } = createClock();
  clock.start();
  advance(4_000);
  clock.pause();
  advance(20_000);
  assert.equal(clock.snapshot().elapsedSeconds, 4);
  assert.equal(clock.snapshot().status, "paused");
});

test("Phase Clock: resume continues from the frozen phase time", () => {
  const { clock, advance } = createClock();
  clock.start();
  advance(3_000);
  clock.pause();
  advance(10_000);
  clock.resume();
  advance(2_000);
  assert.equal(clock.snapshot().elapsedSeconds, 5);
});

test("Phase Clock: reset clears the phase timer", () => {
  const { clock, advance } = createClock();
  clock.start();
  advance(6_000);
  clock.reset();
  assert.equal(clock.snapshot().elapsedMs, 0);
  assert.equal(clock.snapshot().status, "idle");
});

test("Phase Clock: resume preserves accumulated milliseconds", () => {
  let now = 0;
  const clock = new YogaPhaseClock(() => now);
  clock.start();
  now += 1_250;
  clock.pause();
  now += 9_000;
  clock.resume();
  now += 750;
  assert.equal(clock.snapshot().elapsedMs, 2_000);
});

test("Hardening #46: phase start after pause restarts from zero", () => {
  let now = 1000;
  const clock = new YogaPhaseClock(() => now);
  clock.start();
  now += 5000;
  clock.pause();
  now += 5000;
  clock.start();
  assert.equal(clock.snapshot().elapsedMs, 0);
  assert.equal(clock.snapshot().status, "running");
});

test("Hardening #48: paused phase clock is immutable until resume", () => {
  let now = 1000;
  const clock = new YogaPhaseClock(() => now);
  clock.start();
  now += 3500;
  clock.pause();
  const paused = clock.snapshot().elapsedMs;
  now += 10000;
  assert.equal(clock.snapshot().elapsedMs, paused);
  clock.resume();
  now += 1500;
  assert.equal(clock.snapshot().elapsedMs, paused + 1500);
});

test("Hardening #48: phase reset is a true idle zero state", () => {
  let now = 1000;
  const clock = new YogaPhaseClock(() => now);
  clock.start();
  now += 2500;
  clock.reset();
  assert.deepEqual(clock.snapshot(), { elapsedMs: 0, elapsedSeconds: 0, status: "idle" });
});
