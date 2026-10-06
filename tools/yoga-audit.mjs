import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");
const fail = [];
const pass = [];

const index = read("index.html");
const main = read("main.js");
const sanctuary = read("sanctuary-experience.js");
const i18n = read("i18n.js");
const css = read("styles.css");
const readme = read("README.md");

const instructorCore = [
  "title",
  "metaDescription",
  "heroKicker",
  "heroTitle",
  "heroLead",
  "heroManifesto",
  "heroTags",
  "aboutKicker",
  "aboutH2",
  "aboutP",
  "p1t",
  "p1p",
  "p2t",
  "p2p",
  "p3t",
  "p3p",
  "offerKicker",
  "offerH2",
  "o1t",
  "o1p",
  "o2t",
  "o2p",
  "o3t",
  "o3p",
  "pathKicker",
  "pathH2",
  "t0t",
  "t0p",
  "t1t",
  "t1p",
  "t2t",
  "t2p",
  "t3t",
  "t3p",
  "t4t",
  "t4p",
  "expKicker",
  "expH2",
  "expNow",
  "tagActive",
  "r1title",
  "r1p",
  "r2title",
  "r2p",
  "r3co",
  "r3title",
  "r3p",
  "eduKicker",
  "eduH2",
  "e1t",
  "e1p",
  "e2t",
  "e2p",
  "e3t",
  "e3p",
  "e4t",
  "e4p",
  "philoKicker",
  "philoQ1",
  "philoQ2",
  "philoFoot",
  "tag1",
  "tag2",
  "tag3",
  "tag4",
  "tag5",
  "tag6",
  "tag7",
  "contactKicker",
  "contactH2",
  "contactLead"
];

const extractI18nObject = (source, lang) => {
  const start = source.indexOf(`${lang}: {`);

  if (start < 0) {
    throw new Error(`Unable to locate i18n.${lang}`);
  }

  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = bodyStart; i < source.length; i += 1) {
    const char = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(bodyStart + 1, i);
      }
    }
  }

  throw new Error(`Unable to close i18n.${lang}`);
};

const extractKeys = (block) => [
  ...new Set(
    [...block.matchAll(/(?:^|,)\s*([A-Za-z0-9_]+)\s*:/gm)]
      .map((match) => match[1])
  )
];

const esI18n = extractI18nObject(i18n, "es");
const enI18n = extractI18nObject(i18n, "en");

const esKeys = extractKeys(esI18n);
const enKeys = extractKeys(enI18n);

const missingInstructorEs = instructorCore.filter(
  (key) => !esKeys.includes(key)
);

const missingInstructorEn = instructorCore.filter(
  (key) => !enKeys.includes(key)
);

const htmlBindings = new Set([
  ...[...index.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]),
  ...[...index.matchAll(/data-i18n-html="([^"]+)"/g)].map((m) => m[1])
]);

const missingInstructorBindings = instructorCore.filter(
  (key) =>
    key !== "title" &&
    key !== "metaDescription" &&
    !htmlBindings.has(key)
);

if (missingInstructorEs.length) {
  console.error(
    "Instructor Core missing ES:",
    missingInstructorEs.join(", ")
  );
  fail.push("instructor core ES");
}

if (missingInstructorEn.length) {
  console.error(
    "Instructor Core missing EN:",
    missingInstructorEn.join(", ")
  );
  fail.push("instructor core EN");
}

if (missingInstructorBindings.length) {
  console.error(
    "Instructor Core missing HTML bindings:",
    missingInstructorBindings.join(", ")
  );
  fail.push("instructor core HTML bindings");
}

if (
  missingInstructorEs.length === 0 &&
  missingInstructorEn.length === 0 &&
  missingInstructorBindings.length === 0
) {
  pass.push(`Instructor Core ${instructorCore.length} keys`);
}
/* ================================================================
   INSTRUCTOR FLOW ENGINE · #32
   ================================================================ */
const flowEngine = read("flow-engine.js");

const expectedFlow = [
  "start",
  "centering",
  "breath",
  "warmup",
  "pose-1",
  "transition",
  "pose-2",
  "cooldown",
  "savasana",
  "finish"
];

const flowOrder = [...flowEngine.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);

if (JSON.stringify(flowOrder) !== JSON.stringify(expectedFlow)) {
  console.error("Flow Engine sequence:", flowOrder.join(" -> "));
  fail.push("flow engine sequence");
} else {
  pass.push("Flow Engine 10-phase sequence");
}

for (const token of [
  "class YogaFlowEngine",
  "next()",
  "previous()",
  "pause()",
  "resume()",
  "reset()",
  "goTo(id)",
  "snapshot()",
  "yoga:flow",
  "window.YOGA_FLOW"
]) {
  if (!flowEngine.includes(token)) {
    fail.push(`flow engine contract: ${token}`);
  }
}

if (
  flowEngine.includes("class YogaFlowEngine") &&
  flowEngine.includes("snapshot()") &&
  flowEngine.includes("yoga:flow") &&
  flowEngine.includes("window.YOGA_FLOW")
) {
  pass.push("Flow Engine deterministic contract");
}

/* ================================================================
   INSTRUCTOR UI · #33
   ================================================================ */
const instructorUi = read("instructor-ui.js");
const instructorControls = [
  "updateAccessibility",
  "aria-valuenow",
  "aria-keyshortcuts",
  "ArrowLeft",
  "ArrowRight",
  "isTypingContext"
];

if (instructorControls.every((token) => instructorUi.includes(token))) {
  pass.push("Instructor Controls + Accessibility");
} else {
  const missing = instructorControls.filter((token) => !instructorUi.includes(token));
  fail.push(`Instructor Controls + Accessibility: ${missing.join(", ")}`);
}



if (
  instructorUi.includes("window.YOGA_FLOW") &&
  instructorUi.includes("data-flow-action") &&
  instructorUi.includes("yoga:flow")
) {
  pass.push("Instructor UI flow binding");
} else {
  fail.push("Instructor UI flow binding");
}

for (const token of [
  'id="instructor-flow"',
  'data-flow-action="start"',
  'data-flow-action="previous"',
  'data-flow-action="pause"',
  'data-flow-action="next"',
  'data-flow-action="reset"',
  'flow-phase-label',
  'flow-progress-bar'
]) {
  if (!index.includes(token)) {
    fail.push(`Instructor UI markup: ${token}`);
  }
}

if (
  index.includes('id="instructor-flow"') &&
  css.includes(".instructor-flow") &&
  css.includes(".flow-console")
) {
  pass.push("Instructor UI presentation");
} else {
  fail.push("Instructor UI presentation");
}

for (const key of [
  "flowKicker",
  "flowH2",
  "flowLead",
  "flowCurrent",
  "flowControlsLabel",
  "flowPrevious",
  "flowPause",
  "flowNext",
  "flowReset",
  "flowStart",
  "flowSequence"
]) {
  if (!i18n.includes(key)) {
    fail.push(`Instructor UI i18n: ${key}`);
  }
}

const e2e = read("tests/instructor-flow.test.mjs");
const qualityWorkflow = read(".github/workflows/quality.yml");

if (
  e2e.includes("canonical 10-phase sequence") &&
  e2e.includes("pause freezes progression") &&
  e2e.includes("reset: returns to a clean idle state") &&
  e2e.includes("invalid goTo is rejected") &&
  qualityWorkflow.includes("npm run test:e2e") &&
  index.includes('<div class="flow-progress" role="progressbar"')
) {
  pass.push("Instructor E2E + Hardening");
} else {
  fail.push("Instructor E2E + Hardening");
}


/* ================================================================
   SESSION CLOCK · #36
   ================================================================ */
const sessionClock = read("flow-session.js");
const sessionClockTests = read("tests/session-clock.test.mjs");

if (
  sessionClock.includes("class YogaSessionClock") &&
  sessionClock.includes("elapsedSeconds") &&
  sessionClock.includes("window.YOGA_SESSION") &&
  sessionClockTests.includes("pause freezes elapsed time") &&
  index.includes('id="flow-session-time"') &&
  instructorUi.includes("formatTime")
) {
  pass.push("Instructor Session Clock");
} else {
  fail.push("Instructor Session Clock");
}

const required = [
  ["doctype", /<!doctype html>/i.test(index)],
  ["language", /<html[^>]+lang="(?:es|en)"/i.test(index)],
  ["canonical", /rel="canonical"/i.test(index)],
  ["meta description", /name="description"/i.test(index)],
  ["theme controls", index.includes("data-set-theme")],
  ["language controls", index.includes("data-set-lang")],
  ["ritual module", index.includes('id="ritual"')],
  ["ritual interaction", main.includes("SANCTUARY PASS · ritual interaction")],
  ["ES ritual copy", i18n.includes('navRitual: "Práctica"')],
  ["EN ritual copy", i18n.includes('navRitual: "Practice"')],
  ["reduced motion", css.includes("prefers-reduced-motion")],
  ["CV ES canonical path", main.includes("./assets/CV_Gracian_Baena_Yoga_ES.pdf")],
  ["CV EN canonical path", main.includes("./assets/CV_Gracian_Baena_Yoga_EN.pdf")],
  ["README ritual docs", readme.includes("### El ritual")],
  ["sanctuary script include", index.includes("./sanctuary-experience.js")],
  ["editorial rail", index.includes('class="hero-rail"')],
  ["hero manifesto", index.includes('data-i18n="heroManifesto"')],
  ["visual system", index.includes("lotus-signature-3") && css.includes("LOTUS SIGNATURE v4 · BOTANICAL LOTUS")],
  ["hero visibility", css.includes(".hero-inner > *") && css.includes("opacity: 1 !important")],
  ["visual lock", css.includes("PRODUCTION VISUAL LOCK") && css.includes("ritual.section") && css.includes("campo-vortex-full iframe")],
  ["sanctuary finale", css.includes("LOTUS SIGNATURE v4 · BOTANICAL LOTUS") && index.includes("lotus-bloom")],
  ["lotus geometry", index.includes("lotus-bloom") && css.includes("SANCTUARY V2.1 · LOTUS IDENTITY + RITUAL EDITORIAL")],
  ["lotus no projection core", !index.includes('<circle cx="280" cy="280" r="7" fill="var(--mandala-accent)"') && css.includes("--lotus-color: #ffffff")],
  ["lotus light green", css.includes("--lotus-color: #46b879") && css.includes("--lotus-highlight: #7fd49d")],
  ["ritual v2", index.includes("ritual-panel-label") && index.includes("ritual-arrival") && css.includes(".ritual-arrival")],
  ["legacy spectacle absent", !css.includes("PORTADA SPECTACLE")],
  ["neon stack absent", !css.includes("YOGA FINAL — definitive neon mandala")],
  ["sanctuary persistence", sanctuary.includes("localStorage")],
  ["quiet mode", sanctuary.includes("quiet-mode")],
  ["one breath", sanctuary.includes("cycleSeconds = 19")],
  ["sound sync", sanctuary.includes("sound-active")],
  ["no autoplay", !/<audio[^>]+\bautoplay\b/i.test(index)]
];

for (const [name, ok] of required) (ok ? pass : fail).push(name);

if (!/src="\.\/main\.js[^"]*"/.test(index)) fail.push("main.js include");
if (!/src="\.\/sanctuary-experience\.js[^"]*"/.test(index)) fail.push("sanctuary-experience.js include");
if (!/styles\.css\?v=lotus-signature-3/.test(index)) fail.push("styles cache bust");
if (!/i18n\.js\?v=quiet-geometry-5/.test(index)) fail.push("i18n cache bust");
if (!/main\.js\?v=quiet-geometry-5/.test(index)) fail.push("main cache bust");
if (/(?:href|src)\s*=\s*["']http:\/\//i.test(index + main + css)) fail.push("insecure http resource URL");
if ((index.match(/<section\b/g) || []).length !== (index.match(/<\/section>/g) || []).length) fail.push("section balance");

for (const [file, max] of [
  ["index.html", 46000],
  ["styles.css", 184000],
  ["main.js", 22000],
  ["i18n.js", 18000],
  ["sanctuary-experience.js", 14000]
]) {
  const bytes = statSync(join(root, file)).size;
  if (bytes <= max) pass.push(`${file} size ${bytes}B`);
  else fail.push(`${file} size ${bytes}B > ${max}B`);
}

if (fail.length) {
  console.error("YOGA QUALITY GATE — FAIL");
  for (const item of fail) console.error("FAIL", item);
  process.exit(1);
}

/* ================================================================
   PHASE CLOCK · #37
   ================================================================ */
const phaseClock = read("flow-phase.js");
const phaseClockTests = read("tests/phase-clock.test.mjs");
if (
  phaseClock.includes("class YogaPhaseClock") &&
  phaseClock.includes("window.YOGA_PHASE") &&
  phaseClockTests.includes("pause freezes phase time") &&
  index.includes('id="flow-phase-time"') &&
  instructorUi.includes("phaseTime")
) {
  pass.push("Instructor Phase Clock");
}

console.log("YOGA QUALITY GATE — PASS");
for (const item of pass) console.log("PASS", item);

 else {
  fail.push("Instructor Phase Clock");
}
