import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const model=require("../studio-wayfinder-v101.js");
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("V101 gives distinct, readable ES/EN guidance for all 3 modes and 4 real lifecycle states",()=>{
 for(const lang of ["es","en"])for(const mode of model.MODES)for(const status of model.STATUSES){
  const x=model.guidance({mode,status},lang);
  assert.equal(x.mode,mode);assert.equal(x.status,status);
  assert.equal(x.steps.length,3);assert.equal(new Set(x.steps).size,3);
  assert.ok(x.steps.every(step=>step.length>=35));
  assert.ok(x.cue.length>30);assert.ok(x.action.length>=9);
  assert.ok(x.labels.workspace.length>=12);
  assert.ok(Object.isFrozen(x)&&Object.isFrozen(x.steps));
 }
 assert.equal(model.guidance({mode:"INVALID",status:"INVALID"}).mode,"asanas");
 assert.equal(model.guidance({mode:"INVALID",status:"INVALID"}).status,"idle");
 assert.match(model.guidance({mode:"breath",status:"running",pattern:"free"}).cue,/sin contar segundos/);
 assert.match(model.guidance({mode:"breath",status:"running",pattern:"free"},"en").cue,/without counting seconds/);
 assert.match(model.guidance({mode:"meditation",style:"silent"}).cue,/silenciosa/);
 assert.match(model.guidance({mode:"meditation",style:"silent"},"en").cue,/Silent meditation/);
 assert.notEqual(model.guidance({mode:"asanas"}).title,model.guidance({mode:"breath"}).title);
});

test("V101 does not start or persist anything; focus is opt-in and targets existing controllers",()=>{
 const ui=read("studio-wayfinder-ui-v101.js"),modelSource=read("studio-wayfinder-v101.js");
 for(const forbidden of ["setInterval(","setTimeout(","requestAnimationFrame(","fetch(","localStorage","sessionStorage","audio.play(",".click()"]){
  assert.ok(!ui.includes(forbidden),"UI must not invoke "+forbidden);
  assert.ok(!modelSource.includes(forbidden),"model must not invoke "+forbidden);
 }
 for(const s of ["target.focus({preventScroll:false})","data-studio-status","data-status","data-studio-mode","lang","MutationObserver","aria-label"]){
  assert.ok(ui.includes(s),s);
 }
 assert.ok(ui.includes('find.addEventListener("click"'));
 assert.ok(ui.includes('if(!target||target.disabled||!target.isConnected)return'));
});

test("V101 participates in production bundle and stays alongside the coherent V98 summary",()=>{
 const html=read("index.html"),build=read("tools/build.mjs");
 const assets=["studio-wayfinder-v101.js","studio-wayfinder-ui-v101.js","studio-wayfinder-v101.css"];
 for(const asset of assets){
  assert.ok(html.includes("./"+asset+"?v=v101-1"),"HTML missing "+asset);
  assert.ok(build.includes("'"+asset+"'"),"build missing "+asset);
 }
 assert.ok(html.indexOf("studio-coherence-ui-v98.js")<html.indexOf("studio-wayfinder-ui-v101.js"));
 assert.ok(html.indexOf("studio-wayfinder-v101.js")<html.indexOf("studio-wayfinder-ui-v101.js"));
 assert.ok(read("studio-wayfinder-v101.css").includes("prefers-reduced-motion:reduce"));
 assert.ok(read("studio-wayfinder-v101.css").includes('data-v101-mode="meditation"'));
 assert.ok(read("studio-wayfinder-v101.css").includes('data-v101-mode="breath"'));
});
