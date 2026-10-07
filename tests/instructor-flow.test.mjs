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
    /next: \(\) => \{[\s\S]*?if \(engine\.status === "idle"\) \{[\s\S]*?session\.start\(\);[\s\S]*?phase\.start\(\);[\s\S]*?engine\.start\(\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?engine\.next\(\);/
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

test("Hardening #50: goTo lands on requested phase with deterministic status", () => {
  const engine = new YogaFlowEngine();
  const mid = engine.goTo("cooldown");
  assert.equal(mid.phase, "cooldown");
  assert.equal(mid.index, 7);
  assert.equal(mid.status, STATUS.RUNNING);

  const finish = engine.goTo("finish");
  assert.equal(finish.phase, "finish");
  assert.equal(finish.index, 9);
  assert.equal(finish.status, STATUS.FINISHED);
});

test("Hardening #50: invalid goTo does not mutate history or position", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();
  const before = engine.snapshot();
  const history = [...engine.history];

  assert.throws(() => engine.goTo("not-a-phase"), /Unknown yoga flow phase/);
  assert.deepEqual(engine.snapshot(), before);
  assert.deepEqual(engine.history, history);
});

test("Hardening #51: phase label is an accessible live region", () => {
  assert.match(index, /id="flow-phase-label"[^>]*aria-live="polite"/);
});

test("Hardening #54: next after finish is a strict no-op", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  while (engine.status !== STATUS.FINISHED) engine.next();
  const before = engine.snapshot();
  const history = [...engine.history];
  assert.deepEqual(engine.next(), before);
  assert.deepEqual(engine.history, history);
});

test("Hardening #55: goTo preserves paused state", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  engine.next();
  engine.pause();
  const moved = engine.goTo("cooldown");
  assert.equal(moved.phase, "cooldown");
  assert.equal(moved.status, STATUS.PAUSED);
});

test("Hardening #58: finished phase sync settles terminal phase marker", () => {
  assert.match(ui, /if \(snapshot\.status === "finished"\) \{\s*phase\.reset\(\);\s*lastPhase = snapshot\.phase;\s*\}/);
});

test("Hardening #59: pause and resume are idempotent outside valid states", () => {
  const engine = new YogaFlowEngine();
  assert.equal(engine.pause().status, STATUS.IDLE);
  assert.equal(engine.resume().status, STATUS.IDLE);
  engine.start();
  engine.pause();
  assert.equal(engine.pause().status, STATUS.PAUSED);
  engine.resume();
  assert.equal(engine.resume().status, STATUS.RUNNING);
});

test("Hardening #59: previous at first phase is a strict no-op", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  const before = engine.snapshot();
  assert.deepEqual(engine.previous(), before);
  assert.deepEqual(engine.history, ["start"]);
});

test("Hardening #60: finished flow can only re-enter through reset or start", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  while (engine.status !== STATUS.FINISHED) engine.next();

  assert.equal(engine.previous().status, STATUS.FINISHED);
  assert.equal(engine.next().status, STATUS.FINISHED);

  const restarted = engine.start();
  assert.equal(restarted.status, STATUS.RUNNING);
  assert.equal(restarted.phase, "start");

  const reset = engine.reset();
  assert.equal(reset.status, STATUS.IDLE);
  assert.equal(reset.phase, "start");
});

test("Hardening #61: progress is deterministic across all ten phases", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  const progress = [engine.snapshot().progress];

  while (engine.status !== STATUS.FINISHED) {
    engine.next();
    progress.push(engine.snapshot().progress);
  }

  assert.deepEqual(progress, [0, 1/9, 2/9, 3/9, 4/9, 5/9, 6/9, 7/9, 8/9, 1]);
  assert.equal(progress[0], 0);
  assert.equal(progress.at(-1), 1);
});

test("Hardening #62: snapshots expose stable navigation invariants", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  const start = engine.snapshot();
  assert.equal(start.previous, null);
  assert.equal(start.next, "centering");

  for (let i = 0; i < 8; i += 1) engine.next();
  const middle = engine.snapshot();
  assert.equal(middle.phase, "savasana");
  assert.equal(middle.previous, "cooldown");
  assert.equal(middle.next, "finish");

  engine.next();
  const finish = engine.snapshot();
  assert.equal(finish.previous, "savasana");
  assert.equal(finish.next, null);
});


test("Practice timer: every phase has a real target duration", () => {
  assert.deepEqual(PHASES.map((phase) => phase.durationSeconds), [30, 60, 90, 120, 180, 45, 180, 90, 180, 30]);
  assert.ok(PHASES.every((phase) => Number.isFinite(phase.durationSeconds) && phase.durationSeconds > 0));
});

test("Practice timer: snapshots expose the current phase target", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  assert.equal(engine.snapshot().durationSeconds, 30);
  engine.next();
  assert.equal(engine.snapshot().durationSeconds, 60);
});

test("Practice timer: UI counts down and advances at the target", () => {
  assert.match(ui, /remaining = Math\.max\(0, duration - elapsed\)/);
  assert.match(ui, /phase\.snapshot\(\)\.elapsedSeconds >= durationFor\(snapshot\)/);
  assert.match(ui, /engine\.next\(\)/);
  assert.match(index, /id="flow-phase-progress-bar"/);
});


test("Practice control layer: snapshots expose a usable phase cue", () => {
  const engine = new YogaFlowEngine();
  engine.start();
  assert.equal(engine.snapshot().cue, "Llegar y preparar la práctica.");
  engine.next();
  assert.equal(engine.snapshot().cue, "Encontrar estabilidad y atención.");
});

test("Practice control layer: UI renders target, remaining and cue", () => {
  assert.match(index, /id="flow-phase-cue"/);
  assert.match(index, /id="flow-phase-target"/);
  assert.match(ui, /snapshot\.cue/);
  assert.match(ui, /formatTime\(duration\)/);
});

test("Living yoga guide: articulated skeleton and lifecycle are present", () => {
  const motion = readFileSync(new URL("../flow-motion.js", import.meta.url), "utf8");
  assert.match(index, /flow-motion\.js\?v=atelier-3/);
  for (const part of ["rleg", "lleg", "rarm", "larm", "torso", "neck", "rfoot", "lfoot"]) {
    assert.ok(motion.includes('data-bone="' + part + '"'));
  }
  assert.match(motion, /function freeze\(\)/);
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(motion, /yoga:quiet/);
  assert.match(motion, /visibilitychange/);
  assert.match(motion, /yoga:preview/);
  assert.match(motion, /yoga:flow/);
  assert.match(motion, /640-x/);
});

test("Premium yoga avatar keeps its original rig and layered character artwork", () => {
  const motion = readFileSync(new URL("../flow-motion.js", import.meta.url), "utf8");
  const css = readFileSync(new URL("../flow-guide.css", import.meta.url), "utf8");
  const details = ["guide-hair-back", "guide-eyes", "guide-smile", "guide-beard",
    "guide-skin", "guide-sleeve", "guide-leg-lustre", "guide-collar",
    "guide-garden", "guide-mat"];
  for (const part of details) assert.ok(motion.includes(part), part + " missing");
  for (const finish of ["yoga-skin", "yoga-hair", "yoga-shirt", "yoga-pants"]) {
    assert.ok(motion.includes('id="' + finish + '"'));
    assert.ok(css.includes('url(#' + finish + ')'));
  }
  assert.ok(motion.includes('data-detail'));
  assert.ok(motion.includes('details.rsleeve.setAttribute'));
  assert.ok(motion.includes('details.rhand.setAttribute'));
  assert.ok(motion.includes('details.collar.setAttribute'));
  assert.ok(motion.includes('details.panel.setAttribute'));
  assert.ok(motion.includes("bones.rleg.setAttribute('d',limbShape"));
  assert.ok(motion.includes("bones.rarm.setAttribute('d',limbShape"));
  assert.ok(motion.includes("bones.torso.setAttribute('d'"));
  assert.match(css, /\.guide-animated \.guide-leg \{ fill: url\(#yoga-pants\)/);
});

test("Illustrated Warrior II has human arm span and a grounded front knee", () => {
  const art = readFileSync(new URL("../flow-motion.js", import.meta.url), "utf8");
  const match = art.match(/warrior: pose\('([^']+)'\)/);
  assert.ok(match, "Warrior II rig missing");
  const j = match[1].split(" ").map(point => point.split(",").map(Number));
  assert.equal(j.length, 16);
  const span = j[7][0] - j[6][0];
  const height = j[12][1] - j[0][1];
  assert.ok(span / height < 1.25, "Arms must be proportionate to body height");
  assert.ok(Math.abs(j[10][0] - j[12][0]) <= 5, "Front knee must track the ankle");
  assert.ok(j[13][0] > j[9][0] + 80, "Rear leg should extend");
  assert.match(art, /function gesture\(base, now\)/, "Pose-specific movements required");
});
