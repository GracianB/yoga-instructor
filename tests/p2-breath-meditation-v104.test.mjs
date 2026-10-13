import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const rituals=require("../practice-ritual-v104.js");
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("P2 · both practices have five deterministic, unique, ordered stages",()=>{
 for(const mode of ["breath","meditation"]){
  const stages=rituals.rituals[mode];
  assert.equal(stages.length,5);
  assert.deepEqual(stages.map(x=>x.id).at(0),"arrive");
  assert.deepEqual(stages.map(x=>x.id).at(-1),"return");
  assert.equal(new Set(stages.map(x=>x.id)).size,5);
  assert.ok(stages.every((s,i)=>s.until>(stages[i-1]?.until??0)));
  assert.equal(stages.at(-1).until,1);
  for(let t=0;t<=1000;t++){
   const progress=t/1000;
   const frame=rituals.frame({mode,progress,status:"running"});
   assert.ok(frame.index>=0&&frame.index<5);
   assert.ok(frame.stageProgress>=0&&frame.stageProgress<=1);
   assert.ok(frame.title&&frame.body&&frame.steps.length===5);
  }
 }
});
test("P2 · focus-specific guided meditation works in Spanish and English and never overrides silence",()=>{
 for(const lang of ["es","en"])for(const focus of ["breath","body","space"]){
  const p=rituals.frame({mode:"meditation",status:"running",progress:.40,lang,focus});
  assert.equal(p.stage,"observe");assert.equal(p.canNarrate,true);
  assert.ok(p.body.length>25);
  const s=rituals.frame({mode:"meditation",status:"running",progress:.40,lang,focus,style:"silent"});
  assert.equal(s.quiet,true);assert.equal(s.canNarrate,false);
  assert.notEqual(s.body,p.body);
 }
 const x=["breath","body","space"].map(focus=>rituals.frame({
  mode:"meditation",status:"running",progress:.45,lang:"es",focus}).body);
 assert.equal(new Set(x).size,3);
});
test("P2 · Dragon enters and releases gradually, paused frame stays frozen; free breathing never moves",()=>{
 const options={mode:"breath",status:"running",pattern:"natural"};
 const entering=rituals.frame({...options,progress:0});
 const first=rituals.frame({...options,progress:.003});
 const middle=rituals.frame({...options,progress:.40});
 const leaving=rituals.frame({...options,progress:.997});
 const end=rituals.frame({...options,progress:1});
 assert.equal(entering.envelope,0);
 assert.ok(first.envelope>0&&first.envelope<1);
 assert.equal(middle.envelope,1);
 assert.ok(leaving.envelope>0&&leaving.envelope<1);
 assert.equal(end.envelope,0);
 assert.equal(rituals.frame({...options,status:"paused",progress:.4}).envelope,middle.envelope);
 assert.equal(rituals.frame({...options,pattern:"free",progress:.4}).envelope,0);
 assert.equal(rituals.frame({...options,status:"idle",progress:.4}).envelope,0);
 assert.equal(rituals.frame({...options,status:"finished",progress:1}).envelope,0);
});
test("P2 · invalid progress/mode cannot silently corrupt the ritual",()=>{
 assert.throws(()=>rituals.frame({mode:"swimming"}),RangeError);
 assert.throws(()=>rituals.frame({progress:Infinity}),RangeError);
 assert.throws(()=>rituals.frame({progress:NaN}),RangeError);
 assert.equal(rituals.frame({progress:-1}).index,0);
 assert.equal(rituals.frame({progress:2}).index,4);
 assert.equal(rituals.frame({mode:"meditation",status:"paused",progress:.43}).canNarrate,false);
});
test("P2 · 200ms studio clock is sole heartbeat; optional voice follows visible stage",()=>{
 const model=read("practice-ritual-v104.js"),ui=read("practice-ritual-ui-v104.js");
 const practice=read("practice-studio.js"),audio=read("uma-audio-v90.js");
 for(const source of [model,ui]){
  for(const banned of ["setInterval(", "requestAnimationFrame(", "new Audio(", "speechSynthesis", "fetch(", "XMLHttpRequest", "localStorage"])
   assert.ok(!source.includes(banned),"P2 ritual must be pure and opt-in");
 }
 assert.match(practice,/const breathingVisual=\{\.\.\.breathing,/);
 assert.match(practice,/p2RitualStage/);
 assert.match(practice,/p2RitualVoice/);
 assert.match(practice,/YOGA_PRACTICE_RITUAL_V104\?\.frame/);
 assert.match(audio,/stage\.dataset\.p2RitualVoice\|\|cue\.body/);
 assert.match(audio,/!voiceEnabled\|\|!voiceAvailable\|\|document\.hidden/);
 const html=read("index.html"),build=read("tools/build.mjs");
 for(const p of ["practice-ritual-v104.js","practice-ritual-ui-v104.js","practice-ritual-v104.css"]){
  assert.ok(html.includes(p+"?v=v104-1"));
  assert.ok(build.includes("'"+p+"'"));
 }
 assert.ok(html.indexOf("./practice-ritual-v104.js")<html.indexOf("./practice-studio.js"));
});
