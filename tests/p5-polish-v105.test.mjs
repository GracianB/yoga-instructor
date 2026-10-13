import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const get=p=>readFile(new URL("../"+p,import.meta.url),"utf8");

test("P5 · V105 layers load last and ship in the Pages bundle",async()=>{
 const html=await get("index.html"),build=await get("tools/build.mjs");
 const sheets=[...html.matchAll(/href="\.\/([^"?]+\.css)/g)].map(m=>m[1]);
 assert.equal(sheets.at(-1),"practice-polish-v105.css");
 assert.match(html,/practice-polish-v105\.js\?v=v105-1" defer/);
 for(const f of ["practice-polish-v105.css","practice-polish-v105.js"])assert.ok(build.includes("'"+f+"'"));
});

test("P5 · Nila's seated poses keep both arms outside the torso silhouette",async()=>{
 const src=await get("yin-yang-art.js");
 for(const id of ["centering","finish"]){
  const line=src.split("\n").find(l=>l.includes('{id:"'+id+'"'));
  const [cx,,rx]=JSON.parse(line.match(/body:(\[[^\]]+\])/)[1]);
  const arms=JSON.parse(line.match(/arms:(\[[^\]]+\])/)[1]);
  for(const d of arms){
   const q=+d.match(/Q(\d+)/)[1];
   assert.ok(Math.abs(q-cx)>rx,id+" elbow must be visible outside the body: "+d);
  }
 }
});

test("P5 · Dragon breath uses the existing clock variables and honours every calm switch",async()=>{
 const css=await get("practice-polish-v105.css");
 assert.match(css,/svg\.studio-breath-dragon\{[^}]*--v102-chest-y/);
 assert.match(css,/\.sd31-wings\{[^}]*--v102-wing-scale/);
 for(const guard of ["prefers-reduced-motion:reduce","body.quiet-mode",'data-v95-comfort="calm"','data-breath-pattern="free"'])
  assert.ok(css.includes(guard),guard);
});

test("P5 · Uma's magic is decorative, idempotent and never starts sound or clocks",async()=>{
 const js=await get("practice-polish-v105.js");
 assert.match(js,/aria-hidden","true"/);
 assert.match(js,/querySelector\("\.v105-magic"\)\)return false/);
 assert.doesNotMatch(js,/\.play\(|setInterval|requestAnimationFrame|localStorage|fetch\(/);
});
