import test from"node:test";import assert from"node:assert/strict";import{createRequire}from"node:module";import{readFileSync}from"node:fs";
const require=createRequire(import.meta.url);const f=require("../studio-breath-engine.js"),art=require("../breath-articulation-v86.js");
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V86 shape tracks source breath clock without a second oscillator",()=>{
const inhale=art.sculpt(f.frame(2100,"natural"),{status:"running"});
const exhale=art.sculpt(f.frame(7300,"natural"),{status:"running"});
const idle=art.sculpt(f.frame(2100,"natural"),{status:"idle"});
assert.equal(inhale.phase,"inhale");assert.equal(exhale.phase,"exhale");
assert.ok(+inhale.chest>+idle.chest);assert.ok(+inhale.wing>1);
assert.equal(idle.head,"0.00px");assert.equal(idle.phase,"rest");
assert.deepEqual(art.sculpt(f.frame(2100,"natural"),{status:"paused"}),art.sculpt(f.frame(2100,"natural"),{status:"paused"}));
assert.equal(art.sculpt(f.frame(4000,"free"),{status:"running"}).phase,"rest");
assert.equal(art.sculpt(f.frame(2100),{status:"running",quiet:true}).chest,"1.0000");
});
test("V86 production driver reuses PracticeClock and CSS honors pauses",()=>{
const js=read("practice-studio.js"),css=read("breath-articulation-v86.css"),html=read("index.html"),b=read("tools/build.mjs");
for(const word of ["Articulation?.sculpt(breathing","--v86-chest","--v86-wing","--v86-head","--v86-heart"])assert.ok(js.includes(word),word);
for(const word of ['data-studio-status="paused"',"prefers-reduced-motion:reduce","quiet-mode",".sd31-head-unit",".sd31-wings"])assert.ok(css.includes(word),word);
for(const asset of ["breath-articulation-v86.js","breath-articulation-v86.css"]){assert.ok(html.includes("./"+asset));assert.ok(b.includes("'"+asset+"'"))}
assert.ok(html.indexOf("breath-articulation-v86.js")<html.indexOf("practice-studio.js"));
assert.ok(!read("breath-articulation-v86.js").includes("setInterval("));
});
