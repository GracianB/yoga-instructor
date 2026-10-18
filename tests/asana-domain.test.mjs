import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {readFile} from "node:fs/promises";
const require=createRequire(import.meta.url);
const library=require("../asana-library.js");
const {project}=require("../asana-domain.js");
test("asana projections preserve catalog identifiers and separate instructional data from SVG",()=>{
 const domain=project(library);
 assert.equal(domain.lessons.length,library.poses.length);
 assert.equal(domain.geometry.length,library.poses.length);
 for(const pose of library.poses){
  const lesson=domain.lesson(pose.id),drawing=domain.drawing(pose.id);
  assert.equal(lesson.id,pose.id);
  assert.equal(drawing.id,pose.id);
  assert.deepEqual(lesson.name,pose.name);
  assert.notEqual(lesson.name,pose.name);
  assert.deepEqual(drawing.arms,pose.arms);
  assert.notEqual(drawing.arms,pose.arms);
  assert.ok(Object.isFrozen(lesson.coaching.setup));
  assert.ok(Object.isFrozen(drawing.hands[0]));
  assert.equal(Object.hasOwn(lesson,"arms"),false);
  assert.equal(Object.hasOwn(drawing,"coaching"),false);
 }
 assert.equal(domain.lesson("missing"),null);
 assert.ok(Object.isFrozen(domain.lessons));
 assert.ok(Object.isFrozen(domain.geometry));
 assert.equal(domain.library,library);
});

test("the studio consumes lesson projections for UI but renderer keeps original geometry",async()=>{
 const source=await readFile(new URL("../studio-asana-library.js",import.meta.url),"utf8");
 assert.ok(source.includes("lessonDomain.lessons"));
 assert.ok(source.includes("editorial.byId(current)"));
 assert.ok(source.includes("Curriculum.search(editorial.poses"));
 assert.ok(source.includes("for(const pose of library.poses)"));
});
test("domain rejects missing or duplicate identifiers",()=>{
 assert.throws(()=>project({poses:[{id:"duplicate"},{id:"duplicate"}],byId:()=>null}),TypeError);
 assert.throws(()=>project({poses:[{id:""}],byId:()=>null}),TypeError);
});
