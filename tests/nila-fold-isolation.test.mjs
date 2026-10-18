import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {createRequire} from "node:module";

const require=createRequire(import.meta.url);
const library=require("../asana-library.js");
const code=readFileSync(new URL("../movement-guardian-v37.js",import.meta.url),"utf8");
const fakeSvg={querySelector:()=>null};
const root={dataset:{},querySelector:key=>key==="svg.yy-svg"?fakeSvg:null};
const window={YIN_YANG_ART:{poses:[]}};
runInNewContext(code,{window,document:{getElementById:key=>key==="flow-guide"?root:null}});
const draw=window.YOGA_MOVEMENT_GUARDIAN.drawPose;

test("standing and seated forward folds keep separate authored torso rigs",()=>{
 const standing=library.byId("v68-forward-fold");
 const seated=library.byId("v68-seated-fold");
 assert.equal(standing.kind,"fold");
 assert.equal(seated.kind,"fold");
 const standingArt=draw(standing);
 const seatedArt=draw(seated);
 const body=html=>html.match(/<path class="mg-body" d="([^"]+)"/)?.[1];
 assert.ok(body(standingArt)?.startsWith("M398 234 C372 218"));
 assert.ok(body(seatedArt)?.startsWith("M"));
 assert.notEqual(body(standingArt),body(seatedArt),"No shared standing torso on seated fold");
 assert.doesNotMatch(seatedArt,/<g class="mg-head mg-head-fold"/);
 assert.match(standingArt,/<g class="mg-head mg-head-fold"/);
 assert.match(seatedArt,/class="mg-torso"[^>]*rotate\(-33(?:\.0)? 353(?:\.0)? 291(?:\.0)?\)/);
 assert.match(standingArt,/class="mg-torso"[^>]*rotate\(0(?:\.0)? 370(?:\.0)? 250(?:\.0)?\)/);
 for(const html of [standingArt,seatedArt]){
  assert.equal((html.match(/data-contact="(?:hand|foot)-[01]"/g)||[]).length,4);
  assert.doesNotMatch(html,/NaN|Infinity/);
 }
});

test("Uttanasana hands hang beside the shins instead of becoming extra ground supports",()=>{
 const pose=library.byId("v68-forward-fold");
 for(let i=0;i<2;i++){
  const [hx,hy]=pose.hands[i], [fx,fy]=pose.feet[i];
  assert.ok(fy-hy>=20,"Hand must remain above the supporting foot");
  assert.ok(Math.abs(fx-hx)<=36,"Relaxed wrist should stay near its shin");
  const numbers=pose.arms[i].match(/[0-9]+/g).map(Number);
  assert.deepEqual(numbers.slice(-2),[hx,hy]);
 }
 assert.deepEqual(pose.feet,[[337,384],[401,384]]);
});

test("Uttanasana retains vertical supporting legs and a forward-downward shoulder and head",()=>{
 const pose=library.byId("v68-forward-fold");
 const leftLeg=[...pose.legs[0].matchAll(/[0-9]+/g)].map(Number);
 const rightLeg=[...pose.legs[1].matchAll(/[0-9]+/g)].map(Number);
 const leftArm=[...pose.arms[0].matchAll(/[0-9]+/g)].map(Number);
 const rightArm=[...pose.arms[1].matchAll(/[0-9]+/g)].map(Number);
 for(const n of [leftLeg,rightLeg,leftArm,rightArm])assert.equal(n.length,6);
 for(const leg of [leftLeg,rightLeg]){
  assert.ok(leg[1]<265,"Leg starts at elevated pelvis, rather than crouching");
  assert.ok(leg[5]>375,"Leg supports the standing body to ground");
  assert.ok(Math.abs(leg[0]-leg[4])<20,"Shin remains nearly vertical");
 }
 assert.ok(leftArm[1]>leftLeg[1]&&rightArm[1]>rightLeg[1],
  "Shoulders must hang beneath the hinged pelvis");
 assert.ok(pose.head[1]>leftArm[1],
  "Head must hang beneath the shoulders");
 assert.ok(pose.head[0]<leftLeg[0],
  "Head hangs ahead of the support legs");
});
