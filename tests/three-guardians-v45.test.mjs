import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("index.html"),build=read("tools/build.mjs");
const assets=["movement-guardian-v37.js","yy-three-guardians-v38.css",
 "studio-meditation-guardian-v42.js","yy-meditation-guardian-v43.css",
 "yy-movement-bridge-v44.css"];
test("V45: the three practices have three independent visual identities",()=>{
 const movement=read("movement-guardian-v37.js"),uma=read("studio-meditation-guardian-v42.js"),breath=read("studio-breath-dragon.js");
 assert.match(movement,/data-guardian="nila"/);
 assert.match(movement,/for\(const p of art\.poses\)/);
 assert.match(movement,/mg-limb-shell/);
 assert.match(movement,/mg-neck/);
 assert.match(movement,/mg-body/);
 assert.match(uma,/meditation-guardian/);
 assert.match(uma,/uma-wing-left/);
 assert.match(uma,/uma-head/);
 assert.match(breath,/studio-breath-dragon/);
 assert.ok(!movement.includes("studio-breath-dragon"));
 assert.ok(!uma.includes("sd31-breath-core"));
 for(const s of [movement,uma]){
   assert.doesNotMatch(s,/setInterval|setTimeout|requestAnimationFrame|new MutationObserver/);
 }
});
test("V45: the original asana engine remains deterministic and testable",()=>{
 const art=read("yin-yang-art.js");
 const rig=read("movement-guardian-v37.js");
 assert.match(art,/window\.YIN_YANG_ART=Object\.freeze/);
 assert.match(art,/poses\.map\(drawing\)/);
 assert.match(rig,/\.yy-pose\[data-pose=/);
 assert.match(rig,/insertAdjacentHTML\("beforeend",drawing\(p\)\)/);
 assert.match(read("flow-guide.js"),/signal\("yoga:pose-ready",true\)/);
 assert.match(read("yy-three-guardians-v38.css"),/\.yy-character>:not\(\.movement-guardian\)/);
});
test("V45: one Cat Cow clock powers movement without a second motion loop",()=>{
 const motion=read("yy-asana-motion.js");
 assert.match(motion,/--guardian-spine-pulse/);
 assert.match(motion,/0\.115\*curve/);
 assert.match(motion,/clock\.frame=rt\.frame\(frame\)/);
 assert.match(read("yy-three-guardians-v38.css"),/--guardian-spine-pulse/);
});
test("V45: one studio, no duplicated visible old character or meditation dragon",()=>{
 const movementCss=read("yy-three-guardians-v38.css");
 const medCss=read("yy-meditation-guardian-v43.css");
 const bridgeCss=read("yy-movement-bridge-v44.css");
 assert.match(movementCss,/\.yy-character>:not\(\.movement-guardian\)/);
 assert.match(medCss,/data-studio-active="meditation"\] \.studio-companion>\.yy-svg/);
 assert.match(medCss,/data-studio-active="meditation"\] \.studio-companion>\.studio-breath-dragon/);
 assert.match(bridgeCss,/\.flow-theater \.flow-guide figcaption/);
 assert.match(bridgeCss,/\.flow-console-top/);
 assert.match(read("practice-studio.js"),/guided\.dataset\.meditationFocus = meditationFocus/);
 assert.match(medCss,/prefers-reduced-motion:reduce/);
});
test("V45: guardian artwork is wired in the right order and published with Pages",()=>{
 for(const file of assets){
   assert.ok(html.includes("./"+file+"?v="),"Missing linked asset "+file);
   assert.ok(build.includes("'"+file+"'"),"Missing Pages asset "+file);
 }
 assert.ok(html.indexOf('flow-guide.js?v=')<html.indexOf('movement-guardian-v37.js?v='));
 assert.ok(html.indexOf('movement-guardian-v37.js?v=')<html.indexOf('yy-asana-motion.js?v='));
 assert.ok(html.indexOf('studio-companion.js?v=')<html.indexOf('studio-meditation-guardian-v42.js?v='));
 assert.ok(html.indexOf('studio-breath-dragon.js?v=')<html.indexOf('studio-meditation-guardian-v42.js?v='));
});
