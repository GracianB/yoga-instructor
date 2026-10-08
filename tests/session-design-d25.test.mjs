import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {readFileSync} from "node:fs";
const require=createRequire(import.meta.url);
const model=require("../session-design.js");
const flow=require("../flow-engine.js");
const paths=require("../studio-plans.js");
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("D25: default exactly preserves all original D20 timings and ten phases",()=>{
 for(const pace of paths.ids){
  const plan=model.build(flow.PHASES,{pace});
  assert.equal(Object.keys(plan.durations).length,10);
  for(const phase of flow.PHASES)assert.equal(plan.durations[phase.id],paths.duration(phase.durationSeconds,pace));
  assert.equal(plan.totalSeconds,paths.total(flow.PHASES,pace));
 }
 assert.equal(flow.PHASES.length,10);
});
test("D25: requested durations sum exactly, with safe minimum time in every phase",()=>{
 for(const length of ["short","balanced","extended"]){
  for(const level of ["steady","gentle"]){
   for(const recovery of [false,true]){
    const plan=model.build(flow.PHASES,{length,level,recovery,pace:"deep"});
    assert.equal(plan.totalSeconds,model.targets[length]);
    assert.equal(Object.values(plan.durations).reduce((a,b)=>a+b,0),model.targets[length]);
    for(const id of model.order)assert.ok(plan.durations[id]>=model.minimum[id],id);
    assert.ok(Object.isFrozen(plan));
    assert.ok(Object.isFrozen(plan.durations));
   }
  }
 }
});
test("D25: beginner + recovery means gentler holds and more actual cooldown time",()=>{
 const standard=model.build(flow.PHASES,{length:"balanced",level:"steady",recovery:false});
 const beginner=model.build(flow.PHASES,{length:"balanced",level:"gentle",recovery:true});
 for(const id of ["pose-1","pose-2"])assert.ok(beginner.durations[id]<standard.durations[id],id);
 for(const id of ["cooldown","savasana"])assert.ok(beginner.durations[id]>standard.durations[id],id);
 assert.match(model.cue("pose-1","es",{level:"gentle"}),/Guerrero II/);
 assert.match(model.cue("pose-2","en",{level:"gentle"}),/wall/);
 assert.match(model.cue("savasana","es",{level:"steady",recovery:true}),/Descansa/);
 assert.equal(model.cue("pose-1","es",{level:"steady",recovery:false}),null);
});
test("D25: settings reject unsupported inputs and immutable canonical order",()=>{
 const fallback=model.normalize({level:"danger",length:"infinite",recovery:1,pace:"wrong"});
 assert.deepEqual(fallback,{level:"steady",length:"auto",recovery:false,pace:"balanced"});
 assert.throws(()=>model.build(flow.PHASES.slice(0,9)),/ten canonical/);
 assert.throws(()=>model.build(flow.PHASES.slice().reverse()),/ten canonical/);
 assert.ok(Object.isFrozen(model.order));
});
test("D25: audited and ordered assets use existing clock, no second frame loop",()=>{
 const index=read("index.html"),build=read("tools/build.mjs"),
 ui=read("instructor-ui.js"),logic=read("session-design-ui.js"),
 audit=read("tools/release-audit.mjs");
 for(const path of ["session-design.js","session-design-ui.js","yy-session-design.css"]){
  assert.ok(index.includes(path),path);
  assert.ok(build.includes("'"+path+"'"),path);
  assert.ok(audit.includes(path),path);
 }
 assert.ok(index.indexOf("session-design.js")<index.indexOf("instructor-ui.js"));
 assert.ok(index.indexOf("session-design-ui.js")>index.indexOf("studio-plan-ui.js"));
 assert.match(ui,/yoga:session-design/);
 assert.match(ui,/plannedDurations/);
 assert.match(logic,/localStorage/);
 assert.match(logic,/data-d25-option/);
 assert.doesNotMatch(logic,/setInterval|requestAnimationFrame|fetch\(/);
 assert.doesNotMatch(read("session-design.js"),/setInterval|requestAnimationFrame|fetch\(/);
});
