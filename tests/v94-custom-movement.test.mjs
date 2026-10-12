import test from"node:test";import assert from"node:assert/strict";import{createRequire}from"node:module";import{readFileSync}from"node:fs";
const require=createRequire(import.meta.url),custom=require("../movement-custom-v94.js"),lib=require("../asana-library.js");const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V94 keeps exactly three unique valid original poses and supports deterministic reordering",()=>{
assert.equal(custom.current().length,3);
assert.throws(()=>custom.set(["v68-tree","v68-tree","d24-mountain"]),RangeError);
assert.throws(()=>custom.set(["bad","v68-tree","d24-mountain"]),RangeError);
assert.throws(()=>custom.set(["d24-mountain"]),RangeError);
const names=["v68-tree","d24-downward","v68-gratitude"];
custom.set(names);assert.deepEqual(custom.current(),names);
custom.swap(0,2);assert.deepEqual(custom.current(),["v68-gratitude","d24-downward","v68-tree"]);
assert.throws(()=>custom.swap(-1,2),RangeError);
assert.equal(custom.plan("en")[0].id,"v68-gratitude");
for(const s of custom.plan("es")){assert.ok(lib.byId(s.id));assert.ok(s.cue.length>14)}
});
test("V94 plugs into original V85 state without new renderer or timer",()=>{
const script=read("movement-journey-ui-v85.js"),ui=read("movement-custom-ui-v94.js"),h=read("index.html"),build=read("tools/build.mjs");
for(const x of ['getPlan(route,lang())','route==="custom"','v81-clear'])assert.ok(script.includes(x),x);
for(const x of ['data-v94-direction','v85-route','setCustom(read())','model.set','dispatchEvent(new Event("change"'])assert.ok(ui.includes(x),x);
for(const asset of ["movement-custom-v94.js","movement-custom-ui-v94.js","movement-custom-v94.css"]){assert.ok(h.includes("./"+asset));assert.ok(build.includes("'"+asset+"'"))}
assert.ok(h.indexOf("movement-custom-v94.js")<h.indexOf("movement-journey-ui-v85.js"));
assert.ok(h.indexOf("movement-custom-ui-v94.js")>h.indexOf("movement-journey-ui-v85.js"));
for(const bad of ["setInterval(","requestAnimationFrame(","localStorage.","fetch("])assert.ok(!ui.includes(bad),bad);
});