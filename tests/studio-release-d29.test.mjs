import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const get=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("D29: three-path feature modules are bundled once and in dependency order",()=>{
 const html=get("index.html"),build=get("tools/build.mjs");
 const assets=["studio-clock.js","studio-breath-engine.js","studio-meditation-d27.js","practice-studio.js","studio-companion.js"];
 for(const a of assets){
  assert.equal(html.split('./'+a+'?').length-1,1, a+" unique");
  assert.ok(build.includes("'"+a+"'"),a+" in deployed bundle");
 }
 const positions=assets.map(a=>html.indexOf('./'+a+'?'));
 assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
 for(const a of ["yy-studio-breath-d26.css","yy-studio-meditation-d27.css"]){
  assert.equal(html.split('./'+a+'?').length-1,1);
 }
});
