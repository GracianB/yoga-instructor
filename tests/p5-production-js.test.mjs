import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {Script} from "node:vm";
import {listScripts,compileDeferredScripts,listScriptsForOutput,MAX_BYTES,MAX_FILES}
 from "../tools/p5-production-js.mjs";

const read=name=>readFile(new URL("../"+name,import.meta.url),"utf8");
const index=await read("index.html");
const scripts=listScripts(index);
const compile=()=>compileDeferredScripts(index,read);

test("P5: only 73 deferred scripts form bounded and deterministic executable chunks",async()=>{
 const result=await compile();
 assert.equal(scripts.length,76);
 assert.deepEqual(scripts.filter(s=>!s.defer).map(s=>s.file),["runtime.js","boot.js","i18n.js"]);
 assert.equal(result.sourceCount,73);
 assert.ok(result.productionCount>=4&&result.productionCount<=12);
 assert.equal(result.requestsAvoided,73-result.productionCount);
 const all=result.chunks.flatMap(c=>c.sources);
 assert.deepEqual(all,scripts.filter(s=>s.defer).map(s=>s.file));
 for(const c of result.chunks){
  assert.ok(c.sources.length<=MAX_FILES);
  assert.ok(c.bytes<MAX_BYTES+MAX_FILES*65+1024);
  const original=(await Promise.all(c.sources.map(async f=>
   "/* P5 source: "+f+" */\n"+await read(f)+"\n;\n"))).join("\n");
  assert.equal(c.code,original);
  assert.equal(createHash("sha256").update(c.code).digest("hex"),c.sha256);
  assert.ok(c.file.includes(c.sha256.slice(0,16)));
  assert.doesNotThrow(()=>new Script(c.code));
 }
 assert.deepEqual(listScriptsForOutput(result.html).slice(0,3),
  ["runtime.js","boot.js","i18n.js"]);
 assert.deepEqual(listScriptsForOutput(result.html).slice(3),
  result.chunks.map(c=>c.file));
 assert.equal((result.html.match(/\bdefer><\/script>/g)||[]).length,result.productionCount);
 assert.ok(result.html.includes("https://fonts.googleapis.com"));
 assert.equal((result.html.match(/<link\b[^>]*rel="stylesheet"/g)||[]).length,
  (index.match(/<link\b[^>]*rel="stylesheet"/g)||[]).length);
});

test("P5: reject changed eager ordering, duplicate scripts, dynamic dependencies and invalid syntax",async()=>{
 const first=scripts.find(s=>s.defer);
 assert.throws(()=>listScripts(index.replace(first.tag,first.tag+first.tag)),/duplicate script/);
 const boot=scripts[0];
 assert.throws(()=>listScripts(index.replace(boot.tag,"")),/bootstrap order changed/);
 const altered=first.tag.replace(" defer>"," async defer>");
 assert.throws(()=>listScripts(index.replace(first.tag,altered)),/unsafe script tag/);
 await assert.rejects(
  ()=>compileDeferredScripts(index,async f=>f===first.file?"document.currentScript;":"(()=>{})()"),
  /unsafe classic-script dependency/);
 await assert.rejects(
  ()=>compileDeferredScripts(index,async f=>f===first.file?"(() => {":"(()=>{})()"),
  /Unexpected end of input|Unexpected token/);
 await assert.rejects(
  ()=>compileDeferredScripts(index,async f=>f===first.file?"":"(()=>{})()"),
  /empty script/);
});
