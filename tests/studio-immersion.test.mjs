import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),build=read("tools/build.mjs"),code=read("studio-immersion.js"),css=read("yy-studio-immersion.css");
test("D21: versioned assets are in the build with focus and voice controls",()=>{
 for(const p of ["studio-immersion.js","yy-studio-immersion.css"]){
  assert.ok(html.includes(p));
  assert.ok(build.includes("'"+p+"'"));
 }
 assert.match(code,/aria-modal/);
 assert.match(code,/SpeechSynthesisUtterance/);
 assert.match(code,/Escape/);
 assert.match(code,/cancel\(\)/);
 assert.match(css,/studio-focus/);
 assert.match(css,/prefers-reduced-motion/);
 assert.doesNotMatch(code,/\.play\(\)|autoPlay|autoplay/);
});
