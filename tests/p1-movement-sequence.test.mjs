import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
import flow from "../flow-engine.js";
import model from "../movement-flow-v103.js";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("P1 · three curated routes and the custom V94 selection feed the same plan",()=>{
 for(const route of ["roots","mobility","restore"]){
  const ids=model.source(route);
  assert.equal(ids.length,3);
  assert.equal(new Set(ids).size,3);
  const p=model.build({poses:ids,minutes:20});
  assert.equal(p.phases.filter(x=>x.kind==="asana").length,3);
  assert.equal(p.phases.filter(x=>x.kind==="transition").length,2);
  assert.equal(p.totalSeconds,1200);
  assert.equal(p.phases.reduce((sum,x)=>sum+x.durationSeconds,0),1200);
 }
 assert.deepEqual(model.source("custom",["v68-tree","d24-mountain","v68-warrior-ii"]),
   ["v68-tree","d24-mountain","v68-warrior-ii"]);
});
test("P1 · all 3–8 postures, 10/15/20/30 minutes, with and without rest have exact schedules or safe error",()=>{
 const poses=require("../asana-library.js").poses.map(x=>x.id);
 for(let count=3;count<=8;count++){
  for(const minutes of model.MINUTES)for(const recovery of [false,true]){
   try{
    const plan=model.build({poses:poses.slice(0,count),minutes,recovery});
    assert.equal(plan.postureCount,count);
    assert.equal(plan.phases.length,count*2+4);
    assert.equal(plan.transitionCount,count-1);
    assert.equal(plan.phases[0].id,"seq-arrival");
    assert.equal(plan.phases.at(-1).id,"seq-finish");
    assert.equal(new Set(plan.phases.map(p=>p.id)).size,plan.phases.length);
    assert.equal(plan.phases.reduce((sum,p)=>sum+p.durationSeconds,0),minutes*60);
    assert.ok(plan.phases.every(p=>p.durationSeconds>=15&&p.localizedName.es&&p.localizedName.en&&p.localizedCue.es&&p.localizedCue.en));
    assert.ok(plan.phases.filter(x=>x.kind==="asana").every(x=>x.durationSeconds>=30));
    assert.ok(plan.phases.some(x=>x.kind==="savasana"));
   }catch(e){
    assert.match(e.message,/Increase duration or reduce rest/);
    assert.equal(minutes,10);
    assert.equal(recovery,true);
   }
  }
 }
});
test("P1 · invalid, repeated or out-of-range postures are rejected, immutable once built",()=>{
 const p=model.source("roots");
 assert.throws(()=>model.build({poses:[p[0],p[0],p[1]]}),RangeError);
 assert.throws(()=>model.build({poses:p.slice(0,2)}),RangeError);
 assert.throws(()=>model.build({poses:[...p,...p]}),RangeError);
 assert.throws(()=>model.build({poses:[p[0],p[1],"not-real"]}),RangeError);
 assert.throws(()=>model.build({poses:p,minutes:7}),RangeError);
 assert.throws(()=>model.source("invalid"),RangeError);
 const result=model.build({poses:p});
 assert.ok(Object.isFrozen(result)&&Object.isFrozen(result.phases));
 assert.ok(Object.isFrozen(result.phases[0].localizedCue));
 assert.equal(result.poses.length,3);
});
test("P1 · dynamic Flow retains native start/next/pause/resume/finish/reset semantics",()=>{
 const old=new flow.YogaFlowEngine();
 assert.equal(old.snapshot().total,10);
 const p=model.build({poses:require("../asana-library.js").poses.slice(0,8).map(x=>x.id),minutes:30});
 const engine=flow.create(p.phases);
 assert.equal(engine.snapshot().total,20);
 assert.equal(engine.snapshot().status,"idle");
 assert.equal(engine.snapshot().next,"seq-warmup");
 engine.start();
 for(let i=0;i<6;i++)engine.next();
 engine.pause();const before=engine.snapshot();
 assert.deepEqual(engine.next(),before);
 engine.resume();engine.previous();
 assert.equal(engine.snapshot().status,"running");
 while(engine.status!=="finished")engine.next();
 assert.equal(engine.snapshot().phase,"seq-finish");
 assert.equal(engine.snapshot().progress,1);
 assert.equal(engine.reset().status,"idle");
 assert.throws(()=>flow.create([{id:"seq-1",durationSeconds:0}]),/validated/);
});
test("P1 · one real Flow/Phase/Session clock, no second custom-timer in model/editor",()=>{
 for(const p of ["movement-flow-v103.js","movement-flow-ui-v103.js"]){
  const txt=read(p);
  for(const forbidden of ["setInterval(","requestAnimationFrame(","new Audio(","speechSynthesis","fetch(","XMLHttpRequest"])
   assert.ok(!txt.includes(forbidden),p+" should not create "+forbidden);
 }
 const ui=read("instructor-ui.js");
 assert.match(ui,/engine=engineApi\.create\(plan\.phases\)/);
 assert.match(ui,/session\.reset\(\);phase\.reset\(\)/);
 assert.match(ui,/window\.YOGA_MOVEMENT_FLOW_STAGE|YOGA_FLOW_STAGE\?\.configure|YOGA_FLOW_STAGE\?\.classic/);
 const guide=read("flow-guide.js");
 assert.match(guide,/window\.YOGA_FLOW_STAGE=Object\.freeze/);
 const html=read("index.html"),build=read("tools/build.mjs");
 for(const p of ["movement-flow-v103.js","movement-flow-ui-v103.js","movement-flow-v103.css"]){
  assert.ok(html.includes("./"+p+"?v=v103-1"));
  assert.ok(build.includes("'"+p+"'"));
 }
});
