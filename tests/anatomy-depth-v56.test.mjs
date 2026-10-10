import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("V56 shoulders are layered beneath Nila's torso and hands remain in front",()=>{
 const src=read("movement-guardian-v37.js");
 const render=src.slice(src.indexOf("const drawing=p=>"));
 const before=render.indexOf("'<g class=\"mg-arms mg-arms-behind\">");
 const torso=render.indexOf("neck(p)+trunk(p)");
 const after=render.indexOf("'<g class=\"mg-hands\">");
 assert.ok(before>=0 && torso>before && after>torso,"Depth ordering must be arms, torso, hands");
 assert.match(render,/const joined=p\.kind==="finish"/);
 assert.match(render,/mg-gesture-forearm/);
 assert.match(render,/window\.YOGA_MOVEMENT_GUARDIAN=Object\.freeze/);
 assert.doesNotMatch(render,/setInterval\(|requestAnimationFrame\(|MutationObserver/);
});
test("V56 roots, elbows and neutral paw contacts retain the same canonical pose curves",()=>{
 const src=read("movement-guardian-v37.js");
 assert.match(src,/const sections=curveSections\(curve\)/);
 assert.match(src,/data-socket=/);
 assert.match(src,/data-joint=/);
 assert.match(src,/const feet=p\.feet\.map/);
 assert.match(src,/const hands=p\.hands\.map/);
 assert.match(src,/mg-arms-behind/);
});
test("V56 anatomy styles appear for main Flow and the optional Nila gallery",()=>{
 const css=read("yy-anatomy-depth-v56.css");
 assert.match(css,/:is\(#flow-guide,\.studio-library-stage\)/);
 assert.match(css,/\.mg-gesture-forearm/);
 assert.match(css,/\.mg-hinge-shell/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 const html=read("index.html");
 const build=read("tools/build.mjs");
 assert.match(html,/yy-anatomy-depth-v56\.css\?v=v56-1/);
 assert.match(html,/movement-guardian-v37\.js\?v=v56-1/);
 assert.match(build,/'yy-anatomy-depth-v56\.css'/);
});
