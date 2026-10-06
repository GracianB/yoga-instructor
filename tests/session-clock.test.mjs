import assert from "node:assert/strict";
import test from "node:test";

import sessionClock from "../flow-session.js";

const { STATUS, YogaSessionClock } = sessionClock;

const createClock = () => {
  let now = 0;
  const clock = new YogaSessionClock(() => now);
  return {
    clock,
    advance(ms) { now += ms; }
  };
};

test("Session Clock: starts at zero and measures elapsed time", () => {
  const { clock, advance } = createClock();

  assert.equal(clock.snapshot().elapsedSeconds, 0);
  clock.start();
  advance(12_500);

  assert.equal(clock.snapshot().elapsedSeconds, 12);
  assert.equal(clock.snapshot().status, STATUS.RUNNING);
});

test("Session Clock: pause freezes elapsed time and resume continues", () => {
  const { clock, advance } = createClock();

  clock.start();
  advance(5_000);
  clock.pause();
  advance(20_000);

  assert.equal(clock.snapshot().elapsedSeconds, 5);
  assert.equal(clock.snapshot().status, STATUS.PAUSED);

  clock.resume();
  advance(3_000);

  assert.equal(clock.snapshot().elapsedSeconds, 8);
  assert.equal(clock.snapshot().status, STATUS.RUNNING);
});

test("Session Clock: finish freezes the final duration", () => {
  const { clock, advance } = createClock();

  clock.start();
  advance(7_250);
  clock.finish();
  advance(10_000);

  assert.equal(clock.snapshot().elapsedSeconds, 7);
  assert.equal(clock.snapshot().status, STATUS.FINISHED);
});

test("Session Clock: reset returns to a clean idle state", () => {
  const { clock, advance } = createClock();

  clock.start();
  advance(4_000);
  clock.pause();
  clock.reset();

  assert.equal(clock.snapshot().elapsedMs, 0);
  assert.equal(clock.snapshot().status, STATUS.IDLE);
});

test("Hardening #46: session start after pause restarts from zero", () => {
  let now = 1000;
  const clock = new YogaSessionClock(() => now);
  clock.start();
  now += 5000;
  clock.pause();
  now += 5000;
  clock.start();
  assert.equal(clock.snapshot().elapsedMs, 0);
  assert.equal(clock.snapshot().status, "running");
});

test("Hardening #47: finishing a paused session preserves elapsed time", () => {
  let now = 1000;
  const clock = new YogaSessionClock(() => now);
  clock.start();
  now += 4000;
  clock.pause();
  now += 9000;
  const before = clock.snapshot().elapsedMs;
  const finished = clock.finish();

  assert.equal(finished.status, "finished");
  assert.equal(finished.elapsedMs, before);
  now += 9000;
  assert.equal(clock.snapshot().elapsedMs, before);
});

test("Hardening #47: finishing an idle session is stable and zeroed", () => {
  const clock = new YogaSessionClock(() => 1000);
  const finished = clock.finish();
  assert.equal(finished.status, "finished");
  assert.equal(finished.elapsedMs, 0);
});

test("Hardening #56: session elapsed never becomes negative when clock moves backward", () => {
  let now = 5000;
  const clock = new YogaSessionClock(() => now);
  clock.start();
  now = 1000;
  assert.equal(clock.snapshot().elapsedMs, 0);
});

test("Hardening #57: session reset clears terminal state completely", () => {
  let now = 1000;
  const clock = new YogaSessionClock(() => now);
  clock.start();
  now += 3000;
  clock.finish();
  const reset = clock.reset();
  assert.deepEqual(reset, { elapsedMs: 0, elapsedSeconds: 0, status: "idle" });
});
