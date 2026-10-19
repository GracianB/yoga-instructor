import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,writeFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {inventory,serializeInventory} from "../tools/architecture-inventory.mjs";
test("architecture inventory preserves script/style order, de-duplicates and hashes",async()=>{
 const dir=await mkdtemp(join(tmpdir(),"yoga-inventory-"));
 try{
  await writeFile(join(dir,"a.css"),"body{}");
  await writeFile(join(dir,"b.js"),"void 0;");
  await writeFile(join(dir,"index.html"),'<link rel="stylesheet" href="./a.css"><script defer src="./b.js"></script>');
  await writeFile(join(dir,"cv.html"),'<script defer src="./b.js"></script>');
  await writeFile(join(dir,"404.html"),"<p>Missing</p>");
  const r=await inventory(dir);
  assert.deepEqual(r.entries[0].styles.map(x=>x.path),["a.css"]);
  assert.deepEqual(r.entries[0].scripts.map(x=>x.path),["b.js"]);
  assert.equal(r.entries[0].scripts[0].deferred,true);
  assert.equal(r.summary.uniqueAssets,2);
  assert.deepEqual(r.summary.missing,[]);
  assert.deepEqual(r.assets.find(x=>x.path==="b.js").usedBy,["index.html","cv.html"]);
  assert.match(r.assets[0].sha256,/^[a-f0-9]{64}$/);
 }finally{await rm(dir,{force:true,recursive:true})}
});

test("architecture inventory writes parseable JSON with a real final newline",()=>{
 const serial=serializeInventory({schema:1,entries:[],assets:[],summary:{missing:[]}});
 assert.ok(serial.endsWith("\n"));
 assert.equal(serial.charCodeAt(serial.length-1),10);
 assert.deepEqual(JSON.parse(serial).entries,[]);
});
