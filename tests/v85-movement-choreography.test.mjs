import test from"node:test";import assert from"node:assert/strict";import{createRequire}from"node:module";import{readFileSync}from"node:fs";const require=createRequire(import.meta.url);const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const model=require("../movement-journey-v85.js"),asanas=require("../asana-library.js");
test("V85 3 routes are complete, safe, bilingual and connected to 12 real asanas",()=>{
for(const route of model.routes){
 const es=model.plan(route,"es"),en=model.plan(route,"en");
 assert.equal(es.length,3);assert.equal(en.length,3);
 assert.deepEqual(es.map(x=>x.id),en.map(x=>x.id));
 es.forEach((step,i)=>{assert.ok(asanas.byId(step.id));assert.equal(step.ordinal,i+1);assert.equal(step.progress,(i+1)/3);assert.ok(step.cue.length>30)});
}
assert.equal(model.clampStep(-5),0);assert.equal(model.clampStep(100),2);
assert.throws(()=>model.plan("unknown"),RangeError);
});
test("V85 reuse of original Nila book never starts second practice clock",()=>{
const script=read("movement-journey-ui-v85.js");
for(const token of ['studio-asana-library','data-library-pose','data-v81-route','poseButton.click()','aria-live','aria-pressed','book.dataset.v85Active'])assert.ok(script.includes(token),token);
for(const forbidden of ["setTimeout(","setInterval(","requestAnimationFrame(","fetch(","localStorage.","sessionStorage."])assert.ok(!script.includes(forbidden),forbidden);
});
test("V85 new choreography respects reduced motion and release packaging",()=>{
const html=read("index.html"),b=read("tools/build.mjs"),css=read("movement-journey-v85.css");
for(const asset of ["movement-journey-v85.js","movement-journey-ui-v85.js","movement-journey-v85.css"]){assert.ok(html.includes("./"+asset));assert.ok(b.includes("'"+asset+"'"))}
assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/body\.quiet-mode/);
assert.ok(html.indexOf('movement-journey-v85.js')<html.indexOf('movement-journey-ui-v85.js'));
});
