import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const library=require("../asana-library.js");
const source=readFileSync(new URL("../movement-guardian-v37.js",import.meta.url),"utf8");
const fakeSvg={querySelector:()=>null};
const root={dataset:{},querySelector:key=>key==="svg.yy-svg"?fakeSvg:null};
const window={YIN_YANG_ART:{poses:[]}};
runInNewContext(source,{window,document:{getElementById:key=>key==="flow-guide"?root:null}});
const draw=window.YOGA_MOVEMENT_GUARDIAN.drawPose;
test("all twelve production guardian SVGs keep four contact points and two horns",()=>{
 for(const p of library.poses){
  const html=draw(p);
  for(const side of ["hand-0","hand-1","foot-0","foot-1"])
   assert.ok(html.includes('data-contact="'+side+'"'),p.id+" missing "+side);
  assert.equal((html.match(/class="mg-horn mg-horn-/g)||[]).length,2,p.id+" should have both horns");
  assert.equal((html.match(/class="mg-hinge mg-knee"/g)||[]).length,2,p.id+" needs two knees");
  assert.equal((html.match(/class="mg-hinge mg-elbow"/g)||[]).length,2,p.id+" needs two elbows");
  assert.doesNotMatch(html,/NaN|Infinity/);
 }
});
test("Mountain hands are relaxed, while the fold face points toward the mat",()=>{
 const mountain=draw(library.poses.find(p=>p.id==="d24-mountain"));
 const fold=draw(library.poses.find(p=>p.id==="v68-forward-fold"));
 for(const side of ["hand-0","hand-1"]){
  const m=mountain.match(new RegExp('data-contact="'+side+'" transform="[^"]* rotate\\(([^)]+)\\)"'));
  assert.ok(m,side);
  assert.equal(Number(m[1]),0);
 }
 assert.match(fold,/mg-head-fold[^>]*data-head-profile="side"/);
 const faceTag=fold.match(/<g class="mg-head mg-head-fold"[^>]+>/)?.[0];
 assert.ok(faceTag,"Forward-fold face must be present");
 const angle=faceTag.split("rotate(")[1]?.split(")")[0];
 assert.equal(Number(angle),-73);
});
