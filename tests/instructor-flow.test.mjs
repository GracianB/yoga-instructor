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

test("D6 UI contract: next cannot start an idle or paused session", () => {
  assert.match(ui, /action === "next" && \(idle \|\| last \|\| paused\)/);
  assert.match(ui, /next: \(\) => \{[\s\S]*?engine\.status === "idle" \|\| engine\.status === "paused"/);
  assert.match(ui, /start: \(\) => \{ session\.start\(\); phase\.start\(\); engine\.start\(\);/);
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

test("Yin Yang art: ten distinct authored phases, exactly two arms and two legs", () => {
  const art=readFileSync(new URL("../yin-yang-art.js",import.meta.url),"utf8");
  const ids=["start","centering","breath","warmup","pose-1","transition","pose-2","cooldown","savasana","finish"];
  for(const id of ids)assert.ok(art.includes('id:"'+id+'"'),"Missing phase "+id);
  assert.equal((art.match(/id:"(?:start|centering|breath|warmup|pose-1|transition|pose-2|cooldown|savasana|finish)"/g)||[]).length,10);
  assert.match(art,/p\.legs\.map\(\(d,i\)=>limb\(d,'leg',i\)\)/);
  assert.match(art,/p\.arms\.map\(\(d,i\)=>limb\(d,'arm',i\)\)/);
  assert.match(art,/yy-head/);
  assert.match(art,/yy-tail/);
});
test("Yin Yang presentation: selectable dual palette, no deforming skeleton", () => {
  const guide=readFileSync(new URL("../flow-guide.js",import.meta.url),"utf8");
  const css=readFileSync(new URL("../flow-guide.css",import.meta.url),"utf8");
  assert.match(index,/yin-yang-art\.js\?v=phase-d1-1/);
  assert.match(index,/flow-guide\.js\?v=yin-yang-\d+/);
  assert.doesNotMatch(index,/flow-motion\.js/);
  assert.match(guide,/data-yy-form="yang"/);
  assert.match(guide,/data-yy-form="yin"/);
  assert.match(guide,/yoga:pose-changing/);
  assert.match(guide,/yoga:pose-ready/);
  assert.match(css,/\.yy-pose\.is-current/);
  assert.match(css,/\.yy-guide\[data-spirit="yin"\]/);
  assert.match(ui,/poseLocked/);
  assert.match(ui,/if \(!poseLocked && snapshot\.status/);
});
test("Yin Yang breath: existing 4-7-8 dock sends guide ticks and respects pause", () => {
  const dock=readFileSync(new URL("../sanctuary-experience.js",import.meta.url),"utf8");
  const guide=readFileSync(new URL("../flow-guide.js",import.meta.url),"utf8");
  assert.match(dock,/cycleSeconds = 19/);
  assert.match(dock,/guidedBreath/);
  assert.match(dock,/yoga:breath/);
  assert.match(dock,/state\.phase === "breath"/);
  assert.match(dock,/breathStarted \+= performance\.now\(\) - guidedPausedAt/);
  assert.match(guide,/window\.addEventListener\("yoga:breath"/);
});


test("Phase B: Cat-Cow changes only spine/head/tail; grounded limbs never multiply", () => {
  const motion=readFileSync(new URL("../yy-asana-motion.js",import.meta.url),"utf8");
  const art=readFileSync(new URL("../yin-yang-art.js",import.meta.url),"utf8");
  const style=readFileSync(new URL("../yy-asana-motion.css",import.meta.url),"utf8");
  assert.match(index,/yy-asana-motion\.js\?v=phase-c-\d+/);
  assert.match(index,/yy-asana-motion\.css\?v=phase-b-1/);
  assert.match(art,/data-asana-back/);
  assert.match(art,/data-asana-spine/);
  assert.match(motion,/8400/);
  assert.match(motion,/bend=-58-33\*curve/);
  assert.match(motion,/underside=57-21\*curve/);
  assert.match(art,/data-asana-belly/);
  assert.match(motion,/setAttribute\("d"/);
  assert.match(motion,/rotate\(/);
  assert.match(motion,/clock\.status!=="running"/);
  assert.match(motion,/prefers-reduced-motion/);
  assert.match(motion,/visibilitychange/);
  assert.match(motion,/MutationObserver/);
  assert.match(motion,/const belly=root\.querySelector/);
  assert.match(style,/data-asana-state="paused"/);
  assert.match(style,/data-asana-state="reduced"/);
});

test("Phase B: distinct authored rhythms for the ten phases, not a generic whole-body bob", () => {
  const style=readFileSync(new URL("../yy-asana-motion.css",import.meta.url),"utf8");
  for(const [kind,animation] of [
    ["rest","yy-rest"],["seat","yy-seated"],["breath","yy-breath-in"],
    ["warrior","yy-warrior-focus"],["flow","yy-flow-rise"],["tree","yy-tree-sway"],
    ["child","yy-head-bow"],["savasana","yy-savasana"],["finish","yy-finish-nod"]
  ]) {
    assert.match(style,new RegExp("yy-pose-"+kind));
    assert.ok(style.includes("@keyframes "+animation),animation+" missing");
  }
  assert.ok(style.includes("yy-pose-table"));
  assert.match(style,/yy-blink/);
  assert.match(style,/animation-play-state:paused!important/);
  assert.match(style,/@media\(prefers-reduced-motion:reduce\)/);
});


test("Phase C: adult mystical colors, side controls and full Cat-Cow abdomen",()=>{
 const stage=readFileSync(new URL("../yy-premium-stage.css",import.meta.url),"utf8");
 const motion=readFileSync(new URL("../yy-asana-motion.js",import.meta.url),"utf8");
 const art=readFileSync(new URL("../yin-yang-art.js",import.meta.url),"utf8");
 assert.match(index,/class="flow-theater"/);
 assert.match(index,/class="flow-side flow-side-prev"/);
 assert.match(index,/class="flow-side flow-side-next"/);
 assert.equal((index.match(/data-flow-action="previous"/g)||[]).length,1);
 assert.equal((index.match(/data-flow-action="next"/g)||[]).length,1);
 assert.match(index,/yy-premium-stage\.css\?v=phase-d1-1/);
 assert.match(stage,/grid-template-columns:clamp\(44px/);
 assert.match(stage,/max-height:365px/);
 assert.match(stage,/\.yy-guardian-lid/);
 assert.match(art,/data-asana-belly/);
 assert.match(motion,/underside=57-21\*curve/);
 assert.match(motion,/belly\.setAttribute\("d"/);
});


test("Phase D1: serene guardian eyes, two almond silhouettes not human staring eyes",()=>{
  const art=readFileSync(new URL("../yin-yang-art.js",import.meta.url),"utf8");
  const css=readFileSync(new URL("../yy-premium-stage.css",import.meta.url),"utf8");
  const previous=["yy-eye-white","yy-iris","yy-pupil","yy-spark-eye","yy-eye-tiny","yy-heavy-lid"];
  assert.match(art,/yy-eye-almond/);
  assert.match(art,/yy-guardian-lid/);
  assert.match(art,/yy-eye-sheen/);
  assert.match(art,/yy-sleep-brow/);
  for(const selector of previous){
    assert.doesNotMatch(art,new RegExp(selector),"Obsolete eye geometry: "+selector);
  }
  assert.match(css,/D\.1 · SERENE GUARDIAN FACE/);
  assert.match(css,/data-spirit="yin"\] \.yy-eye-almond/);
  assert.match(css,/\.yy-eye-closed/);
  assert.match(css,/\.yy-muzzle/);
  assert.match(index,/yin-yang-art\.js\?v=phase-d1-1/);
  assert.match(index,/yy-premium-stage\.css\?v=phase-d1-1/);
});
