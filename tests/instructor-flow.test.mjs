import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

import flowEngine from "../flow-engine.js";

const { PHASES, STATUS, YogaFlowEngine } = flowEngine;

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const ui = readFileSync(new URL("../instructor-ui.js", import.meta.url), "utf8");

test("E2E flow: completes the canonical 10-phase sequence", () => {
  const engine = new YogaFlowEngine();
  const visited = [];

  engine.start();
  visited.push(engine.snapshot().phase);

  while (engine.status !== STATUS.FINISHED) {
    engine.next();
    visited.push(engine.snapshot().phase);
  }

  assert.deepEqual(visited, PHASES.map((phase) => phase.id));
  assert.equal(engine.snapshot().status, STATUS.FINISHED);
  assert.equal(engine.snapshot().index, 9);
});

test("E2E controls: pause freezes progression and resume continues", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();

  const beforePause = engine.snapshot();
  engine.pause();

  assert.equal(engine.snapshot().status, STATUS.PAUSED);
  assert.deepEqual(engine.next(), engine.snapshot());
  assert.equal(engine.snapshot().index, beforePause.index);

  engine.resume();
  engine.next();
  assert.equal(engine.snapshot().index, beforePause.index + 1);
  assert.equal(engine.snapshot().status, STATUS.RUNNING);
});

test("E2E phase sync: previous returns to the prior phase", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();
  const returned = engine.previous();

  assert.equal(returned.phase, "start");
  assert.equal(returned.status, STATUS.RUNNING);
});

test("E2E state machine: previous preserves pause state", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();
  engine.pause();

  const returned = engine.previous();

  assert.equal(returned.phase, "start");
  assert.equal(returned.status, STATUS.PAUSED);
});

test("Hardening: pause synchronizes both clocks", () => {
  assert.match(ui, /session\.pause\(\); phase\.pause\(\)/);
  assert.match(ui, /session\.resume\(\); phase\.resume\(\)/);
});

test("Hardening: phase clock wiring covers rendered time and transitions", () => {
  for (const token of [
    "window.YOGA_PHASE",
    "phaseTime",
    "syncPhaseClock",
    "phase.reset()",
    "phase.start()"
  ]) {
    assert.match(ui, new RegExp(token.replace(/[.*+?^$()|[\]\\]/g, "\\$&")));
  }

  assert.match(index, /id="flow-phase-time"/);
});

test("E2E reset: returns to a clean idle state", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();
  engine.pause();
  engine.reset();

  assert.equal(engine.snapshot().phase, "start");
  assert.equal(engine.snapshot().status, STATUS.IDLE);
  assert.equal(engine.history.length, 0);
});

test("E2E boundaries: previous and next cannot escape the flow", () => {
  const engine = new YogaFlowEngine();

  assert.equal(engine.previous().index, 0);
  engine.start();

  for (let i = 0; i < PHASES.length - 1; i += 1) engine.next();

  assert.equal(engine.snapshot().phase, "finish");
  assert.equal(engine.snapshot().status, STATUS.FINISHED);
  assert.equal(engine.next().phase, "finish");
});

test("Hardening: invalid goTo is rejected without corrupting state", () => {
  const engine = new YogaFlowEngine();
  assert.throws(() => engine.goTo("not-a-phase"), /Unknown yoga flow phase/);
  assert.equal(engine.snapshot().phase, "start");
  assert.equal(engine.snapshot().status, STATUS.IDLE);
});

test("Hardening: instructor UI exposes keyboard and ARIA contract", () => {
  for (const token of [
    "ArrowLeft",
    "ArrowRight",
    "isTypingContext",
    "aria-keyshortcuts",
    "aria-valuenow",
    "aria-valuetext",
    "aria-pressed",
    "flow-session-time"
  ]) {
    assert.match(ui, new RegExp(token.replace(/[.*+?^$()|[\]\\]/g, "\\$&")));
  }

  assert.match(index, /class="flow-progress" role="progressbar"/);
  assert.doesNotMatch(index, /class="flow-progress"[^>]*aria-hidden="true"/);
});
