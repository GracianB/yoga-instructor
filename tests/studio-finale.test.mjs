import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),build=read("tools/build.mjs"),code=read("studio-finale.js");
test("D22: independent finale asset contract, no tracking, autoplay or extra timers",()=>{
 for(const filename of ["studio-finale.js","yy-studio-finale.css"]){
  assert.ok(html.includes(filename));
  assert.ok(build.includes("'"+filename+"'"));
 }
 assert.match(code,/yoga:flow/);
 assert.match(code,/studio-guided/);
 assert.match(code,/localStorage/);
 assert.match(code,/yoga-studio-last-completed/);
 assert.match(code,/aria-live/);
 assert.doesNotMatch(code,/setInterval|requestAnimationFrame|fetch\(|XMLHttpRequest|autoPlay/);
});
