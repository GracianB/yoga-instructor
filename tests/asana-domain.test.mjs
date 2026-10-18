import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
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
  assert.equal(lesson.name,pose.name);
  assert.equal(drawing.arms,pose.arms);
  assert.equal(Object.hasOwn(lesson,"arms"),false);
  assert.equal(Object.hasOwn(drawing,"coaching"),false);
 }
 assert.equal(domain.lesson("missing"),null);
 assert.ok(Object.isFrozen(domain.lessons));
 assert.ok(Object.isFrozen(domain.geometry));
 assert.equal(domain.library,library);
});
