import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V53 optional asanas use the SAME Nila SVG drawing, not a second visual dragon",()=>{
 const movement=read("movement-guardian-v37.js");
 const extra=read("studio-asana-library.js");
 assert.match(movement,/YOGA_MOVEMENT_GUARDIAN=Object\.freeze\(\{drawPose:drawing\}\)/);
 assert.match(extra,/guardian\.drawPose\(pose\)/);
 assert.match(extra,/originalBody\.appendChild/);
 assert.match(extra,/stage\.dataset\.libraryGuardian="nila"/);
 assert.match(extra,/data-spirit/);
 assert.doesNotMatch(extra,/setInterval\(|requestAnimationFrame\(/);
});
test("V53 shared skin and visibility across flow and lower gallery",()=>{
 const skin=read("yy-three-guardians-v38.css"),css=read("yy-unified-gallery-v53.css");
 assert.match(skin,/:is\(#flow-guide,\.studio-library-stage\)/);
 assert.match(css,/\.yy-character>:not\(\.movement-guardian\)/);
 assert.match(css,/\[data-spirit="yin"\]/);
 assert.match(css,/--mg-coat/);
 assert.match(css,/\.studio-library-display/);
});
test("V53 dark UI cannot render pale-on-pale breathing instructions",()=>{
 const css=read("yy-unified-gallery-v53.css");
 for(const selector of [".studio-guided-title",".studio-guided-cue",".studio-guided-countdown"]){
  assert.ok(css.includes(selector));
 }
 assert.match(css,/html\[data-theme="dark"\]/);
 assert.match(css,/color:#234a40!important/);
});
test("V53 every updated asset is versioned and in Pages bundle",()=>{
 const html=read("index.html"),build=read("tools/build.mjs");
 for(const asset of ["yy-unified-gallery-v53.css?v=v53-1",
  "studio-asana-library.js?v=v53-1","movement-guardian-v37.js?v=v56-1",
  "yy-three-guardians-v38.css?v=v53-1"])assert.ok(html.includes(asset),asset);
 assert.ok(build.includes("'yy-unified-gallery-v53.css'"));
 assert.ok(html.indexOf("movement-guardian-v37.js?v=v54-1")<html.indexOf("studio-asana-library.js?v=v53-1"));
});
