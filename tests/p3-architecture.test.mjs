import test from "node:test";
import assert from "node:assert/strict";
import {analyze,collect,metrics} from "../tools/p3-architecture.mjs";
test("P3 · scripts, styles and locally linked assets are accounted for",async()=>{
 const result=await analyze();
 assert.deepEqual(result.failures,[]);
 assert.ok(result.measure.jsLinks>=70,"the current source baseline is not silently missing");
 assert.ok(result.measure.cssLinks>=70);
 assert.ok(result.measure.cssBytes>100_000);
 assert.ok(result.measure.jsBytes>100_000);
 assert.deepEqual([...metrics].sort(),["cssBytes","cssLinks","jsBytes","jsLinks"].sort());\n for(const name of metrics)assert.ok(Number.isFinite(result.measure[name]));
 assert.equal(result.pages.length,3);
});
test("P3 · captures duplicate, eager and missing resource references",()=>{
 const f=collect('<link rel="stylesheet" href="./a.css"><script src="./a.js" defer></script>'+
 '<script src="./a.js"></script><a href="./assets/CV.pdf">CV</a>');
 assert.deepEqual(f.sheet.map(x=>x.path),["a.css"]);
 assert.deepEqual(f.script.map(x=>x.path),["a.js","a.js"]);
 assert.ok(f.href.includes("assets/CV.pdf"));
});
