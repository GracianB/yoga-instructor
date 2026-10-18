import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const rig=require("../articulated-rig.js");
const solver=require("../rig-constraints.js");
test("anatomy lab references independent engines, exposes reachable controls",async()=>{
 const html=await readFile(new URL("../anatomy-lab.html",import.meta.url),"utf8");
 const js=await readFile(new URL("../anatomy-lab.js",import.meta.url),"utf8");
 for(const id of ["stand","fold","progress","value","stage","status"])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(html.indexOf("articulated-rig.js")<html.indexOf("rig-constraints.js"));
 assert.ok(html.indexOf("rig-constraints.js")<html.indexOf("anatomy-lab.js"));
 assert.match(js,/addEventListener\("input",render\)/);
});
test("lab reference transition is finite and maintains anchored ankles",()=>{
 for(let i=0;i<=20;i++){
  const target=rig.interpolate(rig.standing,rig.fold,i/20);
  const out=solver.solve(rig.standing,target,{iterations:150,tolerance:.75});
  assert.ok(Number.isFinite(out.maxError));
  assert.deepEqual(out.joints.leftAnkle,target.joints.leftAnkle);
  assert.deepEqual(out.joints.rightAnkle,target.joints.rightAnkle);
  for(const point of Object.values(out.joints))assert.ok(point.every(Number.isFinite));
 }
});
