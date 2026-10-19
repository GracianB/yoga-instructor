import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("V73: substantive portfolio and evidence lead to the cohesive practice/music destination", () => {
  const page = read("index.html");
  const portfolio = page.indexOf('id="portfolio"');
  const soundtrack = page.indexOf('id="soundtrack"');
  const studio = page.indexOf('id="instructor-flow"');
  const experience = page.indexOf('id="experiencia"');
  assert.ok(portfolio > 0 && portfolio < experience && experience < studio && studio < soundtrack);
  assert.match(page, /<a href="#portfolio" data-v73-nav>/);
  for (const item of [
    'id="portfolio-v73-title"',
    'id="portfolio-v73-proof-title"',
    'id="portfolio-v73-tab-sala"',
    'id="portfolio-v73-tab-individual"',
    'id="portfolio-v73-tab-equipos"',
    'id="portfolio-v73-panel"',
    'href="#instructor-flow"',
    'href="#experiencia"',
    'data-cv-link'
  ]) assert.ok(page.includes(item), "Missing portfolio contract " + item);
});

test("V73: three trustworthy teaching references, without unsupported marketing statistics", () => {
  const html = read("index.html"), js = read("portfolio-v73.js");
  for (const marker of ["2019", "Mood Fitness", "Majorel", "2022", "2026", "2020", "2021"]) {
    assert.ok(html.includes(marker), "Missing verified credential " + marker);
  }
  assert.match(js, /Majorel \(entorno Google \/ YouTube\)/);
  assert.match(js, /Mood Fitness · Murcia/);
  assert.doesNotMatch(js, /100%|garantizado|cure anxiety|curar la ansiedad|transformación asegurada/i);
});

test("V73: bilingual, semantic, keyboard-accessible, zero-autoplay portfolio navigation", () => {
  const html = read("index.html"), js = read("portfolio-v73.js"), css = read("portfolio-v73.css");
  const build = read("tools/build.mjs");
  for (const file of ["portfolio-v73.css","portfolio-v73.js"]) {
    assert.ok(build.includes("'" + file + "'"), "Not published: " + file);
    assert.ok(html.includes(file + "?v=v73-1"), "Not loaded: " + file);
  }
  assert.match(js, /lang === "en" \? "en" : "es"/);
  assert.match(js, /new MutationObserver/);
  assert.match(js, /aria-selected/);
  assert.match(js, /ArrowRight/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /Home/);
  assert.match(js, /End/);
  assert.match(js, /encodeURIComponent\(item\.subject\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(js, /setInterval\(|fetch\(|new Audio\(|localStorage\./);
  assert.equal((html.match(/id="portfolio"/g)||[]).length, 1);
});
