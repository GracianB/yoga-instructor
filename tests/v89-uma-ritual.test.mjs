import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";import{createRequire}from"node:module";
const require=createRequire(import.meta.url),ritual=require("../uma-focus-ritual-v89.js");const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V89 every attention anchor has meaningful Spanish and English arrival, focus, return and recovery",()=>{
for(const focus of ["breath","body","space"])for(const lang of ["es","en"]){
const stages=["prepare","arrive","anchor","return","complete"].map(p=>ritual.cue(focus,p,lang));
assert.equal(stages.length,5);
assert.equal(stages[0].key,"arrive");assert.equal(stages[2].key,"anchor");
assert.equal(stages[4].key,"return");
for(const s of stages)assert.ok(s.body.length>42&&s.title.length>10);
assert.notEqual(ritual.cue(focus,"anchor",lang,true).body,ritual.cue(focus,"anchor",lang).body);
}
});
test("V89 remains independent of extra timers, voice and storage",()=>{
const ui=read("uma-focus-ritual-ui-v89.js"),h=read("index.html"),b=read("tools/build.mjs");
for(const word of ["data-meditation-step","data-meditation-focus","data-meditation-style","data-studio-mode","wandering","MutationObserver"])assert.ok(ui.includes(word),word);
for(const bad of ["setInterval(","setTimeout(","requestAnimationFrame(","speechSynthesis","localStorage.","fetch("])assert.ok(!ui.includes(bad),bad);
for(const asset of ["uma-focus-ritual-v89.js","uma-focus-ritual-ui-v89.js","uma-focus-ritual-v89.css"]){assert.ok(h.includes("./"+asset));assert.ok(b.includes("'"+asset+"'"))}
assert.ok(h.indexOf("uma-focus-ritual-v89.js")<h.indexOf("uma-focus-ritual-ui-v89.js"));
});
