import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../yy-phase-d2-d3.css", import.meta.url), "utf8");
test("D2/D3 finishing layer loads after D1", () => {
  assert.ok(html.indexOf("yy-phase-d2-d3.css") > html.indexOf("yy-premium-stage.css"));
});
test("lateral navigation is retained and no button handlers are replaced", () => {
  assert.match(html, /flow-side-prev/);
  assert.match(html, /flow-side-next/);
  assert.match(html, /data-flow-action="previous"/);
  assert.match(html, /data-flow-action="next"/);
  assert.match(css, /flow-rail-button/);
});
test("D2 controls and D3 backgrounds cover mobile, Yin and dark mode", () => {
  assert.match(css, /\.flow-controls/);
  assert.match(css, /\.flow-entry-actions/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /data-theme="dark"/);
  assert.match(css, /data-spirit="yin"/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
