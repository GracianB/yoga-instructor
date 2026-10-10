import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("V47-V48: every movement limb gets an authentic shared socket and hinge",()=>{
 const js=read("movement-guardian-v37.js"),css=read("yy-three-guardians-v38.css");
 assert.match(js,/const curveSections=curve=>/);
 assert.match(js,/const sample=\(section,t\)=>/);
 assert.match(js,/data-joint=/);
 assert.match(js,/data-socket=/);
 assert.match(js,/mg-shoulder/);
 assert.match(js,/mg-elbow/);
 assert.match(js,/mg-hip/);
 assert.match(js,/mg-knee/);
 assert.match(js,/data-mg-limb=/);
 assert.match(css,/\.mg-hinge-crease/);
 assert.match(css,/\.mg-socket-shape/);
 assert.doesNotMatch(js,/setInterval|requestAnimationFrame|MutationObserver/);
});
test("V49: breathing room, torso and wings derive from the original session clock",()=>{
 const js=read("practice-studio.js"),css=read("yy-breath-revival.css");
 assert.match(js,/setVar\(guided, "--studio-breath-scale", roomScale\)/);
 assert.match(js,/\.14 \* breathing\.expansion/);
 assert.match(js,/\.06 \* breathing\.expansion/);
 assert.match(css,/\.studio-guided-stage::before/);
 assert.match(css,/\.sd31-halo/);
 assert.match(css,/--studio-breath-scale/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/quiet-mode/);
});
test("V50-V51: Yin and Yang change colors, never a guardian skeleton",()=>{
 const flow=read("flow-guide.js"),med=read("yy-meditation-guardian-v43.css");
 assert.match(flow,/root\.dataset\.spirit=form/);
 assert.match(med,/data-spirit="yang"/);
 assert.match(med,/data-spirit="yin"/);
 assert.match(med,/\.meditation-guardian \*/);
 assert.match(med,/animation:none!important/);
 assert.match(read("yy-three-guardians-v38.css"),/data-spirit="yin"/);
});
test("V52: revised assets are cache-busted, retaining the old tested yoga runtime",()=>{
 const html=read("index.html");
 for(const entry of ["movement-guardian-v37.js?v=v47-1","yy-three-guardians-v38.css?v=v48-1",
 "practice-studio.js?v=v49-1","yy-breath-revival.css?v=v49-1","yy-meditation-guardian-v43.css?v=v50-1"]){
  assert.ok(html.includes(entry),"Missing updated asset: "+entry);
 }
 assert.match(html,/studio-breath-dragon\.js/);
 assert.match(html,/studio-meditation-guardian-v42\.js/);
 assert.match(html,/yoga-audio-bus\.js/);
});
