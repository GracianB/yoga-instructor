import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V90 keeps full silent and written alternatives and never auto-enables a voice",()=>{
const js=read("uma-audio-v90.js");
for(const term of ["voiceEnabled=false","spokenKey=null","SpeechSynthesisUtterance","synth.speak(utterance)","synth.cancel()","document.hidden","data-studio-mode","data-meditation-style","stage.dataset.studioStatus"])assert.ok(js.includes(term),term);
for(const term of ['bus.play("meditation")','bus.stop()','bus.selectFile','aria-pressed','data-v90-action="silence"','data-v90-action="voice"'])assert.ok(js.includes(term),term);
assert.ok(js.indexOf('panel.addEventListener("click"')<js.indexOf('synth.speak')?false:true,"voice must exist in a guarded opt-in function");
for(const bad of ["setInterval(","setTimeout(","requestAnimationFrame(","fetch(","localStorage.","sessionStorage."])assert.ok(!js.includes(bad),bad);
});
test("V90 voice/ambient tools are shipped with ES/EN, aria status and reduced motion",()=>{
const h=read("index.html"),b=read("tools/build.mjs"),css=read("uma-audio-v90.css");
for(const a of ["uma-audio-v90.js","uma-audio-v90.css"]){assert.ok(h.includes("./"+a));assert.ok(b.includes("'"+a+"'"))}
assert.ok(h.indexOf("yoga-audio-bus.js")<h.indexOf("uma-audio-v90.js"));
assert.ok(h.indexOf("uma-focus-ritual-ui-v89.js")<h.indexOf("uma-audio-v90.js"));
for(const term of ["prefers-reduced-motion:reduce","data-theme","focus-visible"])assert.ok(css.includes(term),term);
});
