import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";import{createRequire}from"node:module";
const require=createRequire(import.meta.url);const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const pose=require("../asana-library.js").byId;
test("V83: inverted V contacts form a stable four-point polygon",()=>{
 const dog=pose("d24-downward");assert.ok(dog);
 assert.equal(dog.kind,"downward");assert.equal(dog.hands.length,2);assert.equal(dog.feet.length,2);
 assert.ok(dog.hands.every(p=>p[1]>360));assert.ok(dog.feet.every(p=>p[1]>360));
 assert.ok(Math.max(...dog.hands.map(p=>p[0]))<Math.min(...dog.feet.map(p=>p[0])));
 assert.ok(dog.body[1]-dog.body[3]<200,"Pelvis/ribcage lifted above mat");
});
test("V83: Tree has exactly one grounded foot and a supported raised foot",()=>{
 const tree=pose("v68-tree");assert.equal(tree.kind,"tree");assert.ok(tree.feet[0][1]>=375);
 assert.ok(tree.feet[1][1]<350);assert.ok(tree.feet[1][0]>tree.feet[0][0]);
 assert.equal(tree.legs.length,2);assert.match(tree.legs[1],/Q.*Q/);
});
test("V83: authored poses remain valid while renderer shares their geometry",()=>{
const source=read("movement-guardian-v37.js"),flow=read("yin-yang-art.js");
assert.match(source,/p\.kind==="downward"/);assert.match(source,/torsoAngle/);
assert.match(source,/vertical&&y<350/);
assert.match(flow,/id:"pose-2"/);assert.match(flow,/feet:\[\[349,386\],\[371,329\]\]/);
});
