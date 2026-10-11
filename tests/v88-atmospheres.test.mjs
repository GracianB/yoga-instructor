import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";import{createRequire}from"node:module";
const require=createRequire(import.meta.url),B=require("../studio-breath-engine.js"),A=require("../breath-articulation-v86.js");const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V88 still, gentle and expressive modes are bounded while source clock remains identical",()=>{
const frame=B.frame(2300,"natural");
const calm=A.sculpt(frame,{status:"running",intensity:0});
const gentle=A.sculpt(frame,{status:"running",intensity:.55});
const full=A.sculpt(frame,{status:"running",intensity:1});
assert.equal(calm.chest,"1.0000");assert.equal(calm.head,"0.00px");
assert.ok(+gentle.chest>+calm.chest&&+full.chest>+gentle.chest);
assert.ok(+full.wing>+gentle.wing);
});
test("V88 atmosphere controls are ES/EN, session-clock-neutral, reduced-motion safe and bundled",()=>{
const h=read("index.html"),s=read("breath-atmospheres-v88.js"),css=read("breath-atmospheres-v88.css"),b=read("tools/build.mjs"),studio=read("practice-studio.js");
for(const term of ["forest","ocean","twilight","still","gentle","expressive",'aria-pressed','data-studio-mode','lang'])assert.ok(s.includes(term),term);
for(const term of ["quiet-mode","prefers-reduced-motion:reduce",'data-v88-atmosphere="ocean"','data-v88-atmosphere="twilight"'])assert.ok(css.includes(term),term);
assert.ok(studio.includes('guided.dataset.v88Intensity==="still"?0'));assert.ok(studio.includes("yoga:breath-atmosphere"));
for(const a of ["breath-atmospheres-v88.js","breath-atmospheres-v88.css"]){assert.ok(h.includes("./"+a));assert.ok(b.includes("'"+a+"'"))}
for(const forbidden of ["setTimeout(","setInterval(","requestAnimationFrame(","localStorage.","fetch("])assert.ok(!s.includes(forbidden),forbidden);
});
