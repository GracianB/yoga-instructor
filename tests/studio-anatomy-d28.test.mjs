import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {sculpt}=require("../studio-anatomy-d28.js");
const {frame}=require("../studio-breath-engine.js");
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("D28: anatomical values have finite, gentle limits across entire breath",()=>{
 for(const pattern of ["soft","natural"]){
  const period=pattern==="soft"?8000:10000;
  for(let t=0;t<=period;t+=7){
   const channels=sculpt(frame(t,pattern));
   for(const value of Object.values(channels)){
    assert.ok(Number.isFinite(+value),pattern+" finite at "+t);
    assert.ok(+value>=0 && +value<1.1,pattern+" physical range at "+t);
   }
   assert.ok(+channels.rib>=1 && +channels.rib<=1.018);
  }
 }
});
test("D28: closed cycle and phase continuity retain their exact shape",()=>{
 for(const p of ["soft","natural"]){
  const end=p==="soft"?8000:10000;
  assert.deepEqual(sculpt(frame(0,p)),sculpt(frame(end,p)));
  const half=p==="soft"?3000:4000;
  const a=sculpt(frame(half-1,p)),b=sculpt(frame(half,p));
  assert.ok(Math.abs(+a.rib-+b.rib)<=.0001);
  assert.ok(Math.abs(+a.wingVein-+b.wingVein)<=.0001);
 }
});
test("D28: free/unstarted breathing is restful; values remain stable",()=>{
 const free=sculpt(frame(300000,"free"));
 assert.equal(free.rib,"1.0000");
 assert.deepEqual(free,sculpt(frame(0,"natural"),false));
 assert.throws(()=>sculpt(null),TypeError);
 assert.throws(()=>sculpt({expansion:Infinity}),TypeError);
});
test("D28: breath sculpt is pure and has no private animation clock",()=>{
 const model=read("studio-anatomy-d28.js"),css=read("yy-dragon-d28.css");
 assert.doesNotMatch(model,/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
 assert.match(read("practice-studio.js"),/Sculpt\.sculpt\(breathing, activeBreath\)/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/quiet-mode/);
 assert.match(css,/data-studio-status="paused"/);
 assert.match(css,/\.yy-d16-wing-vein/);
 assert.match(css,/\.yy-d14-rib-cage/);
 assert.doesNotMatch(css,/\.yy-character\s*\{[^}]*translateY\(/);
});
