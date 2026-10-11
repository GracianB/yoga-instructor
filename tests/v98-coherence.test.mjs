import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";import{createRequire}from"node:module";
const require=createRequire(import.meta.url),model=require("../studio-coherence-v98.js"),read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V98 summary gives clear ES/EN identity, setup and state for every studio mode",()=>{
for(const lang of ["es","en"])for(const mode of ["asanas","breath","meditation"]){
const s=model.summarize({mode,status:"idle",route:"custom",pattern:"free",style:"silent",focus:"space"},lang);
assert.ok(s.mode.length>9);assert.ok(s.detail.length>5);assert.ok(s.status.length>4);
}
assert.match(model.summarize({mode:"asanas",route:"custom"}).detail,/Mi secuencia/);
assert.match(model.summarize({mode:"breath",pattern:"free"}).detail,/sin cuenta/);
assert.match(model.summarize({mode:"meditation",style:"silent"}).detail,/silencio/);
assert.equal(model.summarize({mode:"breath",status:"paused"},"en").status,"Paused");
});
test("V98 update listener observes meaningful changes, never creates a second clock",()=>{
const ui=read("studio-coherence-ui-v98.js"),css=read("studio-coherence-v98.css");
for(const k of ["data-studio-mode","data-studio-status","data-status","aria-pressed","MutationObserver","v85-route","studio-preferences"])assert.ok(ui.includes(k),k);
for(const bad of ["setInterval(","setTimeout(","requestAnimationFrame(","fetch(","localStorage"])assert.ok(!ui.includes(bad),bad);
for(const size of ["max-width:720px","max-width:400px","prefers-reduced-motion:reduce"])assert.ok(css.includes(size),size);
for(const file of ["studio-coherence-v98.js","studio-coherence-ui-v98.js","studio-coherence-v98.css"]){assert.ok(read("index.html").includes("./"+file));assert.ok(read("tools/build.mjs").includes("'"+file+"'"))}
});

test("V98 waits for the custom route and preferences before binding live summary",()=>{
const h=read("index.html");
assert.ok(h.indexOf("movement-custom-ui-v94.js")<h.indexOf("studio-coherence-ui-v98.js"));
assert.ok(h.indexOf("studio-personalization-ui-v95.js")<h.indexOf("studio-coherence-ui-v98.js"));
});
