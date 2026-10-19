import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,writeFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {references,coupling} from "../tools/runtime-coupling.mjs";
test("coupling scanner collects literal references and deduplicates",()=>{
 const x=references('window.YOGA_STUDIO; globalThis.YOGA_STUDIO; document.getElementById("studio"); dispatchEvent(new CustomEvent("yoga:ready")); addEventListener("yoga:ready",fn)');
 assert.deepEqual(x.globalRead,["YOGA_STUDIO"]);
 assert.deepEqual(x.domId,["studio"]);
 assert.deepEqual(x.eventEmit,["yoga:ready"]);
 assert.deepEqual(x.eventListen,["yoga:ready"]);
});
test("coupling report connects event emitter to listener",async()=>{
 const dir=await mkdtemp(join(tmpdir(),"yoga-coupling-"));
 try{
  await writeFile(join(dir,"a.js"),'dispatchEvent(new CustomEvent("session:ready"))');
  await writeFile(join(dir,"b.js"),'addEventListener("session:ready",handler)');
  await writeFile(join(dir,"index.html"),'<script defer src="./a.js"></script><script defer src="./b.js"></script>');
  await writeFile(join(dir,"cv.html"),"<p>CV</p>");
  await writeFile(join(dir,"404.html"),"<p>404</p>");
  const report=await coupling(dir);
  assert.equal(report.summary.modules,2);
  assert.deepEqual(report.events,[{from:"a.js",to:"b.js",event:"session:ready"}]);
 }finally{await rm(dir,{recursive:true,force:true})}
});
