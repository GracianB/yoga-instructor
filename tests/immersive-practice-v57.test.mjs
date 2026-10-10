import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
test("V57 stage camera reframes the original Nila SVG without another rig",()=>{
 const camera=read("movement-camera-v57.js");
 assert.match(camera,/getBBox\(\)/);
 assert.match(camera,/yoga:pose-ready/);
 assert.match(camera,/618\/440/);
 assert.match(camera,/b\.width\+26>w\|\|b\.height\+26>h/);
 assert.match(camera,/viewBox/);
 assert.doesNotMatch(camera,/new Audio|setInterval|cloneNode/);
});
test("V57 mode selection describes the chosen practice and preserves canonical selectors",()=>{
 const context=read("practice-mode-context-v57.js");
 assert.match(context,/data-studio-mode/);
 assert.match(context,/aria-live/);
 assert.match(context,/MOVIMIENTO · NILA/);
 assert.match(context,/MEDITACIÓN · UMA/);
 assert.match(context,/BREATHING · DRAGON/);
 assert.match(context,/aria-controls/);
 assert.doesNotMatch(context,/setInterval|new Audio/);
});
test("V57 larger independent scenes and limits are guarded, not arbitrarily tiny",()=>{
 const html=read("index.html");
 const css=read("yy-immersive-practice-v57.css");
 for(const file of ["movement-camera-v57.js","practice-mode-context-v57.js","yy-immersive-practice-v57.css"]){
  assert.ok(html.includes(file+"?v=v57-1"),"asset not linked "+file);
  assert.ok(read("tools/build.mjs").includes("'"+file+"'"),"missing Pages "+file);
 }
 assert.ok(html.includes('id="movement-stage"'));
 assert.match(css,/studio-companion\.yy-guide/);
 assert.match(css,/studio-guided-stage/);
 assert.match(css,/flow-theater \.yy-stage/);
 const audit=read("tools/release-audit.mjs");
 assert.match(audit,/bytes<=512000/);
 assert.match(audit,/pageScriptStyleBytes<=24000000/);
 assert.match(audit,/audio\/sustained-focus\.mp3'\)\.size <= 24000000/);
 assert.match(read("tools/yoga-audit.mjs"),/\["index\.html", 400000\]/);
});
