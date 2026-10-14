import test from "node:test";
import assert from "node:assert/strict";
import {solveAsana} from "../anatomy-foundation-p0.mjs";
import {renderSkinnedAsana} from "../anatomy-skin-p0.mjs";
import {readFile} from "node:fs/promises";
const get=p=>readFile(new URL("../"+p,import.meta.url),"utf8");
const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
test("P0: skinned Nila is generated from both arms and both knee chains",()=>{
 const pose=solveAsana("uttanasana");
 const svg=renderSkinnedAsana(pose,{showJoints:true});
 assert.match(svg,/role="img"/);
 for(const name of ["leftKnee","rightKnee","leftWrist","rightWrist","hip","lumbar","shoulder","neck","head"]){
  assert.ok(svg.includes('data-joint="'+name+'"'),"missing visible joint "+name);
 }
 assert.match(svg,/radialGradient/);
 assert.match(svg,/<\/svg>$/);
});
test("P0: surfaces stay well-formed across every fold frame and knee adaptation",()=>{
 for(const bend of [0,.1,.3,.5,.8]){
  for(let frame=0;frame<=100;frame++){
   const p=solveAsana("uttanasana",{progress:frame/100,kneeBend:bend});
   const s=renderSkinnedAsana(p,{showJoints:true});
   assert.doesNotMatch(s,/NaN|Infinity|undefined/);
   assert.equal((s.match(/<svg/g)||[]).length,1);
   assert.equal((s.match(/<\/svg>/g)||[]).length,1);
   for(const side of ["left","right"]){
    const j=p.joints;
    assert.ok(Math.abs(length(j[side+"Hip"],j[side+"Knee"])-112)<.001);
    assert.ok(Math.abs(length(j[side+"Knee"],j[side+"Ankle"])-111)<.001);
    assert.equal(j[side+"Ankle"].y,460);
   }
  }
 }
});
test("P0: laboratory ships both skin and skeleton geometry as ES modules",async()=>{
 const [html,client,build]=await Promise.all([get("rive-lab.html"),get("rive-lab.js"),get("tools/build.mjs")]);
 assert.match(html,/id="fold-joints"/);
 assert.match(html,/id="fold-animate"/);
 assert.match(client,/renderSkinnedAsana/);
 assert.match(client,/anatomy-skin-p0\.mjs/);
 assert.ok(build.includes("'anatomy-skin-p0.mjs'"));
 assert.ok(build.includes("'anatomy-foundation-p0.mjs'"));
});
test("P0: RML scene and GitHub Actions compile path are version-controlled",async()=>{
 const [rml,workflow]=await Promise.all([get("rive-p0/scene.rml"),get(".github/workflows/rive-p0.yml")]);
 assert.match(rml,/<Artboard/);
 assert.match(rml,/Tadasana a Uttanasana/);
 assert.match(rml,/KeyedProperty propertyKey="15"/);
 assert.match(workflow,/rive rive-p0 --verify/);
 assert.match(workflow,/rive rive-p0 --once/);
 assert.match(workflow,/upload-artifact/);
});
