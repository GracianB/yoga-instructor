import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
test("Yoga social preview is botanical, distinct from professional hub, and deployed", () => {
  const html=readFileSync("index.html","utf8");
  const build=readFileSync("tools/build.mjs","utf8");
  const svg=readFileSync("og-cover.svg","utf8");
  const png=readFileSync("og-cover.png");
  assert.equal(png.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16),1200);
  assert.equal(png.readUInt32BE(20),630);
  assert.ok(html.includes("https://gracianb.github.io/yoga-instructor/og-cover.png?v=1"), "Social image URL must be portfolio-specific");
  assert.ok(!html.includes('property="og:image" content="https://gracianb.github.io/GracianB/'));
  assert.match(svg,/RESPIRACIÓN/);
  assert.ok(build.includes("'og-cover.png'"));
});
