import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,mkdir,writeFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {analyze,collect,metrics} from "../tools/p3-architecture.mjs";
test("P3 · scripts, styles and locally linked assets are accounted for",async()=>{
 const result=await analyze();
 assert.deepEqual(result.failures,[]);
 assert.ok(result.measure.jsLinks>0);
 assert.ok(result.measure.cssLinks>0);
 assert.ok(result.measure.cssBytes>0);
 assert.ok(result.measure.jsBytes>0);
 assert.deepEqual([...metrics].sort(),["cssBytes","cssLinks","jsBytes","jsLinks"].sort());
 for(const name of metrics)assert.ok(Number.isFinite(result.measure[name]));
 assert.equal(result.pages.length,3);
});
test("P3 · captures duplicate, eager and missing resource references",()=>{
 const f=collect('<link rel="stylesheet" href="./a.css"><script src="./a.js" defer></script>'+
 '<script src="./a.js"></script><a href="./assets/CV.pdf">CV</a>');
 assert.deepEqual(f.sheet.map(x=>x.path),["a.css"]);
 assert.deepEqual(f.script.map(x=>x.path),["a.js","a.js"]);
 assert.ok(f.href.includes("assets/CV.pdf"));
});

test("P3 · real files, duplicate reference and eager scripts are checked without byte limits",async()=>{
 const dir=await mkdtemp(join(tmpdir(),"yoga-architecture-"));
 try{
  await mkdir(join(dir,"assets"));
  await writeFile(join(dir,"ok.css"),"body { color: green }");
  await writeFile(join(dir,"ok.js"),"void 0;");
  const html='<link rel="stylesheet" href="./ok.css"><script src="./ok.js" defer></script>';
  await writeFile(join(dir,"index.html"),html);
  await writeFile(join(dir,"cv.html"),"<p>CV</p>");
  await writeFile(join(dir,"404.html"),"<p>404</p>");
  assert.deepEqual((await analyze(dir)).failures,[]);
  await writeFile(join(dir,"index.html"),html+'<script src="./ok.js"></script>');
  const problems=(await analyze(dir)).failures.join(" | ");
  assert.match(problems,/duplicate runtime references/);
  assert.match(problems,/unexpected eager JavaScript/);
  await writeFile(join(dir,"index.html"),'<script src="./missing.js" defer></script>');
  assert.match((await analyze(dir)).failures.join(" | "),/Missing public file/);
  await writeFile(join(dir,"index.html"),'<script src="./%2e%2e/outside.js" defer></script>');
  assert.match((await analyze(dir)).failures.join(" | "),/Illegal local path/);
 }finally{await rm(dir,{recursive:true,force:true})}
});
