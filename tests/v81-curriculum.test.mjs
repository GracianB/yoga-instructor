import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";import{createRequire}from"node:module";
const require=createRequire(import.meta.url);const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V81 curricula cover all 12 original asanas without duplicate family mapping",()=>{
const lib=require("../asana-curriculum-v81.js"), poses=require("../asana-library.js").poses;
assert.equal(poses.length,12);assert.deepEqual(new Set(Object.keys(lib.idFamilies)),new Set(poses.map(p=>p.id)));
for(const p of poses)assert.ok(lib.families[lib.family(p)]);
for(const [name,route]of Object.entries(lib.learn)){assert.equal(route.poses.length,3,name);for(const id of route.poses)assert.ok(lib.family(id),id)}
});
test("V81 accent-insensitive search and route invariants",()=>{
const lib=require("../asana-curriculum-v81.js"),poses=require("../asana-library.js").poses;
assert.ok(lib.search(poses,"arbol").some(p=>p.id==="v68-tree"));
assert.ok(lib.search(poses,"RODILLAS").length>0);
assert.equal(lib.search(poses,"").length,12);
assert.equal(lib.route("not-a-route"),null);
});
test("V81 original book gets search, routes and deploy assets",()=>{
const book=read("studio-asana-library.js"),h=read("index.html"),build=read("tools/build.mjs");
for(const token of ["v81-search","v81-tracks","v81-familynote","button[data-v81-route]","routeId","Curriculum.search","data-library-pose"])assert.ok(book.includes(token),token);
for(const asset of ["asana-curriculum-v81.js","asana-curriculum-v81.css"]){assert.ok(h.includes("./"+asset));assert.ok(build.includes("'"+asset+"'"))}
assert.ok(h.indexOf('asana-curriculum-v81.js')<h.indexOf('studio-asana-library.js'));
});
