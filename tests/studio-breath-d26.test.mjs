import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const {PATTERNS,frame}=require("../studio-breath-engine.js");
test("D26: three safe choices and no breath retention",()=>{
 assert.deepEqual(Object.keys(PATTERNS),["soft","natural","free"]);
 for(const p of Object.values(PATTERNS)) assert.equal(p.hold,undefined);
 assert.equal(frame(0,"natural").phase,"inhale");
 assert.equal(frame(4000,"natural").phase,"exhale");
 assert.equal(frame(10000,"natural").phase,"inhale");
 assert.equal(frame(3000,"soft").phase,"exhale");
 assert.equal(frame(8000,"soft").phase,"inhale");
});
test("D26: breath geometry remains continuous at transitions",()=>{
 for(const id of ["soft","natural"]){
  const p=PATTERNS[id], before=frame(p.inhale*1000-1,id),
   after=frame(p.inhale*1000,id);
  assert.ok(Math.abs(before.scale-after.scale)<.00001);
  const cycle=frame((p.inhale+p.exhale)*1000,id);
  assert.equal(cycle.scale,.89);
  assert.ok(frame(p.inhale*1000,id).scale>cycle.scale);
 }
});
test("D26: free rhythm imposes no instructions or motion, invalid clock is rejected",()=>{
 assert.equal(frame(50000,"free").phase,"free");
 assert.equal(frame(50000,"free").scale,1);
 assert.equal(frame(50000,"free").cycleSeconds,0);
 for(const value of [-1,NaN,Infinity]) assert.throws(()=>frame(value),RangeError);
 assert.deepEqual(frame(5000,"not-a-choice"),frame(5000,"natural"));
});
test("D26: release includes both assets, respects original shared anatomy",()=>{
 const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
 const html=read("index.html"),build=read("tools/build.mjs"),js=read("practice-studio.js"),css=read("yy-studio-breath-d26.css");
 for(const asset of ["studio-breath-engine.js","yy-studio-breath-d26.css"]){
  assert.ok(html.includes(asset));assert.ok(build.includes("'"+asset+"'"));
 }
 assert.ok(html.indexOf("studio-breath-engine.js")<html.indexOf("practice-studio.js"));
 assert.match(js,/Breath\.frame\(elapsed, breathPattern\)/);
 assert.doesNotMatch(read("studio-breath-engine.js"),/setInterval\(|requestAnimationFrame\(/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/quiet-mode/);
 assert.match(css,/\.yy-d16-breath-arch/);
 assert.match(css,/\.yy-d14-rib-cage/);
 assert.match(js,/--studio-rib-expansion/);
 assert.doesNotMatch(css,/\.studio-companion \.yy-character\s*\{[^}]*scale\(/);
});
