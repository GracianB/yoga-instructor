import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const main=await readFile(new URL("../index.html",import.meta.url),"utf8");
const lab=await readFile(new URL("../anatomy-lab.html",import.meta.url),"utf8");
const build=await readFile(new URL("../tools/build.mjs",import.meta.url),"utf8");

test("experimental anatomy lab does not cost extra requests on the public homepage",()=>{
 for(const asset of ["articulated-rig.js","rig-constraints.js","rig-ik.js","rig-motion.js","anatomy-lab.js"]){
  assert.ok(!main.includes('src="./'+asset+'"')&&!main.includes('src="./'+asset+'?'),
   "Unexpected eagerly loaded lab module: "+asset);
  assert.ok(lab.includes('src="./'+asset+'"'),"Anatomy lab must load "+asset);
  assert.ok(build.includes("'"+asset+"'"),"Production preview must include "+asset);
 }
 assert.ok(!main.includes('src="./anatomy-diagnostics.js?'),"Diagnostics must not load on the homepage");
});
test("studio still loads its clock, flow and lesson domain boundaries in order",()=>{
 for(const [before,after] of [
  ["practice-time-core.js","studio-clock.js"],
  ["flow-event-bridge.js","flow-engine.js"],
  ["asana-library.js","asana-domain.js"],
  ["asana-domain.js","studio-asana-library.js"]
 ]){
  const a=main.indexOf('src="./'+before),b=main.indexOf('src="./'+after);
  assert.ok(a>=0&&b>a,before+" must load before "+after);
 }
});
