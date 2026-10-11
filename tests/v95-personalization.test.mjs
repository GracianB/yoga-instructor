import test from"node:test";import assert from"node:assert/strict";import{createRequire}from"node:module";import{readFileSync}from"node:fs";
const require=createRequire(import.meta.url),model=require("../studio-personalization-v95.js");const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V95 rejects arbitrary serialized data and keeps only comfort and three known poses",()=>{
const entry={comfort:"readable",sequence:["v68-tree","d24-downward","v68-gratitude"],health:"PRIVATE",email:"private@example.com"};
const encoded=model.encode(entry);assert.ok(!encoded.includes("PRIVATE"));assert.ok(!encoded.includes("email"));
assert.deepEqual(model.decode(encoded).sequence,entry.sequence);
assert.equal(model.decode(encoded).comfort,"readable");
assert.equal(model.normalize({comfort:"invalid",sequence:["x","y","z"]}).comfort,"balanced");
assert.deepEqual(model.normalize({sequence:["v68-tree","v68-tree","d24-mountain"]}).sequence,model.defaultOrder);
assert.deepEqual(model.decode("{unparseable").sequence,model.defaultOrder);
});
test("V95 lives in existing preference sheet and only saves after deliberate gesture",()=>{
const s=read("studio-personalization-ui-v95.js"),h=read("index.html"),build=read("tools/build.mjs"),css=read("studio-personalization-v95.css");
for(const term of ["studio-preferences","data-v95-guardian","data-v95-comfort","yoga:v94-restore",'action==="save"','action==="clear"'])assert.ok(s.includes(term),term);
assert.ok(s.indexOf('action==="save"')<s.indexOf("localStorage.setItem(KEY"));
for(const file of ["studio-personalization-v95.js","studio-personalization-ui-v95.js","studio-personalization-v95.css"]){assert.ok(h.includes("./"+file));assert.ok(build.includes("'"+file+"'"))}
for(const attr of ['data-v95-comfort="calm"','data-v95-comfort="readable"',"prefers-reduced-motion:reduce"])assert.ok(css.includes(attr),attr);
assert.ok(h.indexOf("studio-personalization-v95.js")<h.indexOf("studio-personalization-ui-v95.js"));
for(const forbidden of ["setInterval(","setTimeout(","requestAnimationFrame(","fetch("])assert.ok(!s.includes(forbidden),forbidden);
});
test("V95 saved custom route restores the real three-pose editor, not just opaque identifiers",()=>{
const prefs=require("../studio-preferences-v93.js");
const route=prefs.normalize({mode:"asanas",route:"custom"});
assert.equal(prefs.decode(prefs.encode(route)).route,"custom");
const ui=read("studio-personalization-ui-v95.js"),editor=read("movement-custom-ui-v94.js");
assert.ok(ui.includes('movementRoute?.addEventListener("change"'));
assert.ok(editor.includes('window.addEventListener("yoga:v94-restore"'));
});
