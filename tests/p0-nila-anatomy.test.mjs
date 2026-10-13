import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
const require=createRequire(import.meta.url);
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const artwork={window:{}};
runInNewContext(read("yin-yang-art.js"),artwork,{timeout:1500});
const stages=[];
const fakeSvg={querySelector:()=>null};
const root={querySelector:()=>fakeSvg,dataset:{}};
const sandbox={window:{YIN_YANG_ART:artwork.window.YIN_YANG_ART},
  document:{getElementById:id=>id==="flow-guide"?root:null}};
runInNewContext(read("movement-guardian-v37.js"),sandbox,{timeout:1500});
const draw=sandbox.window.YOGA_MOVEMENT_GUARDIAN.drawPose;
const book=require("../asana-library.js").poses;
stages.push(...artwork.window.YIN_YANG_ART.poses,...book);

test("P0 · real knees, elbows and ankles in all 22 canonical SVG drawings",()=>{
 assert.equal(stages.length,22);
 for(const pose of stages){
  const markup=draw(pose);
  assert.equal((markup.match(/class="mg-hinge mg-knee"/g)||[]).length,2,pose.id);
  assert.equal((markup.match(/class="mg-hinge mg-elbow"/g)||[]).length,2,pose.id);
  assert.equal((markup.match(/class="mg-p0-kneecap"/g)||[]).length,2,pose.id);
  assert.equal((markup.match(/class="mg-p0-ankle"/g)||[]).length,2,pose.id);
  assert.equal((markup.match(/class="mg-p0-elbow-fold"/g)||[]).length,2,pose.id);
  assert.equal((markup.match(/class="mg-paw mg-foot/g)||[]).length,2,pose.id);
  assert.equal((markup.match(/class="mg-paw mg-hand/g)||[]).length,2,pose.id);
  assert.doesNotMatch(markup,/NaN|undefined|Infinity/);
  const joints=[...markup.matchAll(/data-joint="leg-[01]" data-rig-source="(derived|authored)" data-flex-deg="([\d.]+)" transform="translate\(([\d.]+) ([\d.]+)\)/g)];
  assert.equal(joints.length,2,pose.id);
  for(const [,source,angle,x,y] of joints){
   assert.ok(source==="authored"||source==="derived");
   assert.ok(Number(angle)>=0&&Number(angle)<=180,pose.id);
   assert.ok(Number(x)>=0&&Number(x)<=720&&Number(y)>=0&&Number(y)<=420,pose.id);
  }
 }
});
test("P0 · the standalone Asana Book receives all guardian palette and anatomical rules",()=>{
 const common=[
  "yy-three-guardians-v38.css","yy-guardian-atelier-v54.css",
  "yy-anatomy-depth-v56.css","yy-guardian-finish-v58.css",
  "yy-guardian-art-v63.css","yy-guardian-identities-v67.css",
  "yy-guardian-reconstruction-v102.css","yy-asana-atelier-v71.css",
  "yy-unified-practice-v66.css","yy-movement-stage-v55.css"
 ];
 for(const name of common){
  const text=read(name);
  assert.ok(text.includes(":is(#instructor-flow,#studio-asana-library) :is(#flow-guide,.studio-library-stage)"),name);
  assert.ok(!text.includes("#instructor-flow :is(#flow-guide,.studio-library-stage)"),name);
 }
 const colors=read("yy-unified-gallery-v53.css");
 assert.match(colors,/#studio-asana-library \.studio-library-stage\[data-spirit="yin"\]/);
 assert.match(colors,/#studio-asana-library \.studio-library-stage\{/);
 const css=read("yy-guardian-reconstruction-v102.css");
 for(const part of ["mg-knee .mg-hinge-shell","mg-p0-kneecap","mg-p0-ankle-crease","mg-p0-elbow-fold"])
  assert.ok(css.includes(part),part);
});
