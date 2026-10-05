import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");
const fail = [];
const pass = [];

const index = read("index.html");
const main = read("main.js");
const i18n = read("i18n.js");
const css = read("styles.css");
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
  ["reduced motion", css.includes("prefers-reduced-motion")],
  ["CV ES canonical path", main.includes("./assets/CV_Gracian_Baena_Yoga_ES.pdf")],
  ["CV EN canonical path", main.includes("./assets/CV_Gracian_Baena_Yoga_EN.pdf")],
  ["README ritual docs", readme.includes("### El ritual")]
];

for (const [name, ok] of required) (ok ? pass : fail).push(name);

if (!/src="\.\/main\.js[^"]*"/.test(index)) fail.push("main.js include");
if (!/styles\.css\?v=sanctuary-1/.test(index)) fail.push("sanctuary cache bust");
if (/http:\/\//i.test(index + main + css)) fail.push("insecure http URL");
if ((index.match(/<section\b/g) || []).length !== (index.match(/<\/section>/g) || []).length) fail.push("section balance");

for (const [file, max] of [
  ["index.html", 46000],
  ["styles.css", 155000],
  ["main.js", 22000],
  ["i18n.js", 18000]
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
