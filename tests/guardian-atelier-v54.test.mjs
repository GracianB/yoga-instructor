import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V54: Nila is a horned guardian with tapered connected limbs, not a woolly face",()=>{
 const js=read("movement-guardian-v37.js"),css=read("yy-guardian-atelier-v54.css");
 for(const piece of ["mg-horn","mg-cheek-fin","mg-crest","mg-snout","mg-chin","mg-pupil","limbVolume","mg-limb-volume","mg-socket","mg-hinge"]){
  assert.ok(js.includes(piece),"Missing anatomical feature "+piece);
 }
 assert.match(js,/const curveSections=curve=>/);
 assert.match(js,/const sample=\(section,t\)=>/);
 assert.match(css,/\.mg-limb-volume/);
 assert.match(css,/\.mg-limb-shell/);
 assert.match(js,/data-guardian="nila"/);
 assert.doesNotMatch(js,/requestAnimationFrame|setInterval|MutationObserver/);
});
test("V54: single large movement theatre, compact navigation, three large guardians",()=>{
 const css=read("yy-guardian-atelier-v54.css");
 for(const selector of [".flow-theater",".flow-side",".flow-rail-button",".yy-stage",".studio-companion.yy-guide",".studio-guided-stage",".studio-library-stage.yy-guide"])
  assert.ok(css.includes(selector),"Missing "+selector);
 assert.match(css,/max-width:1240px!important/);
 assert.match(css,/min-height:700px!important/);
 assert.match(css,/max-height:62px!important/);
 assert.match(css,/max-width:760px/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 const guide=read("flow-guide.js");
 assert.match(guide,/62 -4 618 440/);
 const breath=read("studio-breath-dragon.js"),med=read("studio-meditation-guardian-v42.js");
 assert.match(breath,/65 18 430 360/);
 assert.match(med,/75 20 410 355/);
});
test("V54: budgets allow future guardian growth but remain enforced",()=>{
 const audit=read("tools/yoga-audit.mjs");
 assert.match(audit,/\["index\.html", 160000\]/);
 assert.match(audit,/\["styles\.css", 320000\]/);
 assert.match(audit,/if \(bytes <= max\)/);
 assert.match(audit,/else fail\.push/);
});
test("V54: versioned source and linked skin in SHA-verified Pages artifact",()=>{
 const html=read("index.html"),build=read("tools/build.mjs");
 for(const asset of ["yy-guardian-atelier-v54.css?v=v54-1",
  "movement-guardian-v37.js?v=v56-1","studio-breath-dragon.js?v=v54-1",
  "studio-meditation-guardian-v42.js?v=v54-1","flow-guide.js?v=d16-1-v54-1"])
  assert.ok(html.includes(asset),"Missing asset "+asset);
 assert.match(build,/'yy-guardian-atelier-v54\.css'/);
 assert.ok(html.indexOf("yy-guardian-atelier-v54.css")>html.indexOf("yy-unified-gallery-v53.css"));
});
