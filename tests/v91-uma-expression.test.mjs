import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V91 expressive Uma remains a single SVG and derives all states from shared meditation phase",()=>{
const svg=read("studio-meditation-guardian-v42.js"),css=read("uma-expression-v91.css"),h=read("index.html");
for(const key of ["uma-closed-eyes","uma-open-eyes","uma-focus-sparks","meditation-guardian"])assert.ok(svg.includes(key),key);
for(const phase of ['data-meditation-step="anchor"','data-meditation-step="return"','data-meditation-step="complete"'])assert.ok(css.includes(phase),phase);
assert.ok(css.includes('data-meditation-style="silent"'));assert.ok(css.includes("prefers-reduced-motion:reduce"));
assert.ok(css.includes("body.quiet-mode"));assert.ok(h.includes("./uma-expression-v91.css"));
assert.ok(read("tools/build.mjs").includes("'uma-expression-v91.css'"));
assert.ok(!css.includes("@keyframes"));assert.ok(!svg.includes("setInterval("));
});