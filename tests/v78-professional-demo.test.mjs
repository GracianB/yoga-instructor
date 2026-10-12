import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V78 contains native controls, full text transcript and a non-autoplay timeline",()=>{
const h=read("index.html");
for(const id of ["demostracion","v78-play","v78-reset","v78-seek","v78-phase-title","v78-timer","v78-live"])assert.ok(h.includes('id="'+id+'"'),id);
for(const time of ["00–20","20–42","42–60"])assert.ok(h.includes(time));
assert.equal((h.match(/data-v78-jump="/g)||[]).length,3);
assert.match(h,/type="range" min="0" max="60" step="1"/);
assert.match(h,/v78-transcript-grid/);
assert.ok(h.indexOf('id="trayectoria"')<h.indexOf('id="demostracion"'));
});
test("V78 uses only opt-in playback, one animation loop, visibility pause and no remote APIs",()=>{
const s=read("professional-demo-v78.js");
for(const token of ["DURATION=60","requestAnimationFrame(tick)","cancelAnimationFrame(frameId)","visibilitychange",'document.hidden','pagehide',"slider.addEventListener(\"input\"","stop()","lang==="])assert.ok(s.includes(token),token);
for(const unsafe of ["fetch(","localStorage","new Audio(","autoplay","setInterval(","setTimeout(","sendBeacon"])assert.ok(!s.includes(unsafe),unsafe);
assert.ok(s.indexOf("play.addEventListener(\"click\"")<s.indexOf("window.YOGA_DEMO_V78="));
});
test("V78 release and reduced-motion semantics survive",()=>{
const h=read("index.html"),css=read("professional-demo-v78.css"),b=read("tools/build.mjs");
for(const file of ["professional-demo-v78.css","professional-demo-v78.js"]){assert.ok(h.includes("./"+file));assert.ok(b.includes("'"+file+"'"))}
for(const token of ["prefers-reduced-motion:reduce",":focus-visible","@media(max-width:450px)"])assert.ok(css.includes(token));
});
