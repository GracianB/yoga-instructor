import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("index.html"),js=read("studio-companion.js"),css=read("yy-studio-companion.css"),build=read("tools/build.mjs");
test("D19 scripts and styles are wired after original D17 anatomy",()=>{
  assert.ok(html.includes("studio-companion.js?v=d19-1"));
  assert.ok(html.includes("yy-studio-companion.css?v=d19-1"));
  assert.ok(html.indexOf("yy-studio-companion.css")>html.indexOf("yy-dragon-d17.css"));
  assert.ok(html.indexOf("studio-companion.js")>html.indexOf("flow-guide.js"));
  assert.match(build,/'studio-companion.js'/);
  assert.match(build,/'yy-studio-companion.css'/);
});
test("D19 uses authored D17 SVG, no new anatomy or independent timer",()=>{
  assert.match(js,/source\.cloneNode\(true\)/);
  assert.match(js,/\["breath", "centering"\]/);
  assert.match(js,/refs\.set\(previous, unique\)/);
  assert.doesNotMatch(js,/setTimeout|setInterval|requestAnimationFrame/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/quiet-mode/);
});
