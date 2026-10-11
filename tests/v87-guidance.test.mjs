import test from"node:test";import assert from"node:assert/strict";import{createRequire}from"node:module";import{readFileSync}from"node:fs";
const require=createRequire(import.meta.url),breath=require("../studio-breath-engine.js"),guide=require("../breath-guidance-v87.js");
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V87 phase count and progress always come from same D26 time",()=>{
const frame=breath.frame(1000,"soft");
const shown=guide.reading(frame,breath.PATTERNS.soft);
const quiet=guide.reading(frame,breath.PATTERNS.soft,"simple");
assert.equal(shown.phase,"inhale");assert.equal(shown.seconds,2);assert.equal(quiet.seconds,null);
assert.equal(shown.progress,quiet.progress);assert.ok(shown.progress>0&&shown.progress<1);
assert.equal(guide.reading(breath.frame(14000,"free"),breath.PATTERNS.free).progress,0);
assert.throws(()=>guide.reading({phase:"inhale",phaseRemaining:NaN},breath.PATTERNS.soft),TypeError);
});
test("V87 panel doesn't create an autonomous breath clock or persistence",()=>{
const h=read("index.html"),b=read("tools/build.mjs"),ui=read("breath-guidance-ui-v87.js"),s=read("practice-studio.js");
for(const asset of ["breath-guidance-v87.js","breath-guidance-ui-v87.js","breath-guidance-v87.css"]){assert.ok(h.includes("./"+asset));assert.ok(b.includes("'"+asset+"'"))}
for(const token of ['yoga:breath-presentation','v87-cycle-progress','reading?.seconds','phaseGuide'])assert.ok(s.includes(token),token);
for(const bad of ["setInterval(","setTimeout(","requestAnimationFrame(","localStorage.","sessionStorage.","fetch("])assert.ok(!ui.includes(bad),bad);
});
