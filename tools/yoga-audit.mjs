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
const heroFix = read("hero-live-fix.css");
const readme = read("README.md");

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
  ["reduced motion", css.includes("prefers-reduced-motion") && heroFix.includes("prefers-reduced-motion")],
  ["CV ES canonical path", main.includes("./assets/CV_Gracian_Baena_Yoga_ES.pdf")],
  ["CV EN canonical path", main.includes("./assets/CV_Gracian_Baena_Yoga_EN.pdf")],
  ["README ritual docs", readme.includes("### El ritual")],
  ["sanctuary script include", index.includes("./sanctuary-experience.js")],
  ["editorial rail", index.includes('class="hero-rail"')],
  ["hero manifesto", index.includes('data-i18n="heroManifesto"')],
  ["quiet geometry", index.includes("production-visual-3") && css.includes("PRODUCTION VISUAL LOCK")],
  ["hero live fix", index.includes("./hero-live-fix.css?v=hero-live-1") && heroFix.includes(".hero-inner > *") && heroFix.includes("heroLiveMandala")],
  ["visual lock", css.includes("PRODUCTION VISUAL LOCK") && css.includes("ritual.section") && css.includes("campo-vortex-full iframe")],
  ["lotus geometry", index.includes("lotus-bloom") && css.includes("SANCTUARY V2.1 · LOTUS IDENTITY + RITUAL EDITORIAL")],
  ["lotus no projection core", !index.includes('<circle cx="280" cy="280" r="7" fill="var(--mandala-accent)"') && css.includes("--lotus-color: #f8fff9")],
  ["lotus light green", css.includes("--lotus-color: #3f9a68") && css.includes("--lotus-highlight: #63bb87")],
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
if (!/styles\.css\?v=production-visual-3/.test(index)) fail.push("styles cache bust");
if (!/i18n\.js\?v=quiet-geometry-5/.test(index)) fail.push("i18n cache bust");
if (!/main\.js\?v=quiet-geometry-5/.test(index)) fail.push("main cache bust");
if (/(?:href|src)\s*=\s*["']http:\/\//i.test(index + main + css + heroFix)) fail.push("insecure http resource URL");
if ((index.match(/<section\b/g) || []).length !== (index.match(/<\/section>/g) || []).length) fail.push("section balance");

for (const [file, max] of [
  ["index.html", 46000],
  ["styles.css", 165000],
  ["main.js", 22000],
  ["i18n.js", 18000],
  ["sanctuary-experience.js", 14000],
  ["hero-live-fix.css", 6000]
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

console.log("YOGA QUALITY GATE — PASS");
for (const item of pass) console.log("PASS", item);
