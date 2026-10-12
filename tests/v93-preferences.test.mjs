import test from"node:test";import assert from"node:assert/strict";import{createRequire}from"node:module";import{readFileSync}from"node:fs";
const require=createRequire(import.meta.url),prefs=require("../studio-preferences-v93.js");
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V93 rejects invalid or unexpected settings and never serializes unknown health fields",()=>{
const input={mode:"breath",pattern:"free",route:"roots",focus:"body",style:"guided",health:"private",timer:999};
const normalized=prefs.normalize(input);
assert.deepEqual(Object.keys(normalized),["mode","route","pattern","style","focus"]);
assert.ok(!prefs.encode(input).includes("health"));
assert.equal(prefs.decode(prefs.encode(input)).pattern,"free");
assert.equal(prefs.decode("{bad").mode,"asanas");
assert.equal(prefs.normalize({mode:"hacker",pattern:"broken"}).pattern,"natural");
assert.equal(prefs.decode(JSON.stringify({version:99,settings:input})).mode,"asanas");
});
test("V93 stores only on user click and never starts a clock",()=>{
const js=read("studio-preferences-ui-v93.js"),h=read("index.html"),build=read("tools/build.mjs");
for(const word of ['data-v93-action="apply"','data-v93-action="save"','data-v93-action="clear"','getItem(KEY)','setItem(KEY','removeItem(KEY)','studioStatus','data-meditation-style','data-breath-pattern'])assert.ok(js.includes(word),word);
assert.ok(js.indexOf('action==="save"')<js.indexOf('window.localStorage.setItem(KEY'));
for(const bad of ["setInterval(","setTimeout(","requestAnimationFrame(","fetch(","speechSynthesis"])assert.ok(!js.includes(bad),bad);
for(const file of ["studio-preferences-v93.js","studio-preferences-ui-v93.js","studio-preferences-v93.css"]){assert.ok(h.includes("./"+file));assert.ok(build.includes("'"+file+"'"))}
});