import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V92 3 distinct design identities and bilingual signatures occupy existing buttons",()=>{
const s=read("guardian-identities-v92.js"),css=read("guardian-identities-v92.css"),h=read("index.html"),build=read("tools/build.mjs");
for(const mode of ["asanas","breath","meditation"]){assert.ok(s.includes(mode+":"));assert.ok(css.includes('data-studio-mode="'+mode+'"'))}
assert.match(css,/#b96948/);assert.match(css,/#287f82/);assert.match(css,/#7562a6/);
assert.ok(s.includes('querySelectorAll(".studio-modes button[data-studio-mode]")'));
for(const a of ["guardian-identities-v92.js","guardian-identities-v92.css"]){assert.ok(h.includes("./"+a));assert.ok(build.includes("'"+a+"'"))}
for(const bad of ["setInterval(","setTimeout(","requestAnimationFrame(","fetch(","localStorage"])assert.ok(!s.includes(bad),bad);
});