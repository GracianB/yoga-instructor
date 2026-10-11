import test from"node:test";import assert from"node:assert/strict";import{createRequire}from"node:module";import{readFileSync}from"node:fs";const require=createRequire(import.meta.url);const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const engine=require("../nila-kinematics-v84.js"),lib=require("../asana-library.js");
test("V84 all 12 postures produce finite limb joints and contact coordinates",()=>{
for(const pose of lib.poses){
 const shape=engine.support(pose);
 assert.equal(shape.joints.elbows.length,2,pose.id);
 assert.equal(shape.joints.knees.length,2,pose.id);
 for(const xy of [...shape.joints.elbows,...shape.joints.knees])assert.ok(xy.every(Number.isFinite),pose.id);
 assert.ok(shape.load.length>=1,pose.id);
 assert.ok(shape.floor.minX<=shape.floor.maxX&&shape.floor.minY<=shape.floor.maxY);
}
});
test("V84 support topology distinguishes Tree from Downward Dog",()=>{
const tree=engine.support(lib.byId("v68-tree"));
assert.equal(tree.load.length,1);assert.equal(tree.load[0].kind,"foot");assert.ok(!tree.feet[1].grounded);
const dog=engine.support(lib.byId("d24-downward"));
assert.equal(dog.load.length,4);assert.equal(dog.hands.filter(x=>x.grounded).length,2);assert.equal(dog.feet.filter(x=>x.grounded).length,2);
assert.throws(()=>engine.curve("M0 0Q10 10 1000 1000"),RangeError);
});
test("V84 actual Nila renderer consumes single support contract in both experiences",()=>{
const render=read("movement-guardian-v37.js"),html=read("index.html"),build=read("tools/build.mjs");
for(const word of ["YOGA_NILA_KINEMATICS_V84","grounding(p)+shadows(p)","mg-ground-line",'data-ground='])assert.ok(render.includes(word),word);
for(const asset of ["nila-kinematics-v84.js","nila-kinematics-v84.css"]){assert.ok(html.includes("./"+asset));assert.ok(build.includes("'"+asset+"'"))}
assert.ok(html.indexOf("nila-kinematics-v84.js")<html.indexOf("movement-guardian-v37.js"));
});
