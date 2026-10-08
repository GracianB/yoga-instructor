import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const plans=require("../studio-plans.js");
const {PHASES}=require("../flow-engine.js");
test("D20: three frozen plans preserve the original ten phases",()=>{
 assert.deepEqual([...plans.ids],["gentle","balanced","deep"]);
 assert.equal(PHASES.length,10);
 assert.equal(plans.total(PHASES,"balanced"),1005);
 assert.ok(plans.total(PHASES,"gentle")<1005);
 assert.ok(plans.total(PHASES,"deep")>1005);
 assert.equal(plans.duration(30,"gentle"),24);
 assert.equal(plans.duration(30,"deep"),36);
 assert.equal(plans.duration(90,"balanced"),90);
 assert.equal(plans.get("unknown").id,"balanced");
 assert.ok(Object.isFrozen(plans.get("gentle")));
 assert.ok(Object.isFrozen(PHASES));
});
