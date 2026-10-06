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

test("E2E UI contract: next from idle starts at START without skipping", () => {
  assert.match(
    ui,
    /next: \(\) => \{[\s\S]*?if \(engine\.status === "idle"\) \{[\s\S]*?engine\.start\(\);[\s\S]*?session\.start\(\);[\s\S]*?phase\.start\(\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?engine\.next\(\);/
  );
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

test("Hardening: phase clock preserves paused state across phase changes", () => {
  assert.match(ui, /snapshot\.status === "paused"/);
  assert.match(ui, /phase\.start\(\);\s*phase\.pause\(\)/);
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
  assert.equal(engine.previous().phase, "finish");
  assert.equal(engine.previous().status, STATUS.FINISHED);
  assert.equal(engine.next().phase, "finish");
});

test("Hardening: finish is terminal until reset", () => {
  const engine = new YogaFlowEngine();
  engine.start();

  while (engine.status !== STATUS.FINISHED) engine.next();

  assert.equal(engine.previous().status, STATUS.FINISHED);
  assert.equal(engine.snapshot().index, PHASES.length - 1);
  assert.equal(engine.reset().status, STATUS.IDLE);
  assert.equal(engine.start().status, STATUS.RUNNING);
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

test("Hardening #43: lifecycle actions synchronize clocks before engine emits", () => {
  assert.match(ui, /start: \(\) => \{ session\.start\(\); phase\.start\(\); engine\.start\(\);/);
  assert.match(ui, /if \(engine\.status === "paused"\) \{ session\.resume\(\); phase\.resume\(\); engine\.resume\(\); \}/);
  assert.match(ui, /else \{ session\.pause\(\); phase\.pause\(\); engine\.pause\(\); \}/);
  assert.match(ui, /reset: \(\) => \{ session\.reset\(\); phase\.reset\(\); engine\.reset\(\);/);
});

test("Hardening #44: flow events settle clocks before rendering", () => {
  assert.match(ui, /window\.addEventListener\("yoga:flow",[\s\S]*?syncPhaseClock\(snapshot\);[\s\S]*?if \(snapshot\.status === "finished"\) session\.finish\(\);[\s\S]*?render\(snapshot\);[\s\S]*?renderSession\(\);/);
});

test("Hardening #45: repeated start creates a fresh running session", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();
  engine.pause();
  const restarted = engine.start();

  assert.equal(restarted.phase, "start");
  assert.equal(restarted.status, STATUS.RUNNING);
  assert.equal(restarted.index, 0);
  assert.deepEqual(engine.history, ["start"]);
});

test("Hardening #49: history records every accepted phase transition", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();
  engine.next();
  engine.previous();

  assert.deepEqual(engine.history, ["start", "centering", "breath", "centering"]);
  assert.equal(engine.snapshot().phase, "centering");
});

test("Hardening #49: paused next is a no-op without history mutation", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();
  engine.pause();
  const before = [...engine.history];
  const snapshot = engine.next();

  assert.deepEqual(engine.history, before);
  assert.deepEqual(snapshot, engine.snapshot());
});
