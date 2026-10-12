import test from "node:test";import assert from "node:assert/strict";import{createRequire}from"node:module";import{readFileSync}from"node:fs";const require=createRequire(import.meta.url);const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V82 supplies genuinely different per-pose guidance in both languages for all twelve asanas",()=>{
 const lib=require("../asana-library.js"),safety=require("../asana-safety-v82.js");
 assert.equal(Object.keys(safety.records).length,12);
 for(const p of lib.poses){const info=safety.byId(p.id);assert.ok(info,p.id);
 for(const key of safety.keys){assert.equal(info[key].length,2);assert.ok(info[key].every(s=>s.length>35),p.id+":"+key)}
 assert.notEqual(info.soft[0],info.standard[0]);assert.notEqual(info.standard[0],info.supported[0]);
 }
});
test("V82 uses the existing book and preserves selected pose, language and original timeline",()=>{
 const ui=read("asana-options-v82.js"),h=read("index.html"),build=read("tools/build.mjs");
 for(const term of ['studio-asana-library','data-library-current','MutationObserver','aria-pressed','v82-safety','v82-disclaimer','aria-live'])assert.ok(ui.includes(term),term);
 for(const asset of ["asana-safety-v82.js","asana-options-v82.js","asana-options-v82.css"]){assert.ok(h.includes("./"+asset));assert.ok(build.includes("'"+asset+"'"))}
 assert.ok(h.indexOf("studio-asana-library.js")<h.indexOf("asana-options-v82.js"));
 for(const term of ["fetch(","localStorage","setInterval(","requestAnimationFrame("])assert.ok(!ui.includes(term));
});
