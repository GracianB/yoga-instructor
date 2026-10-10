import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V55: one flow snapshot powers the new ten-step presentation",()=>{
 const app=read("movement-cockpit-v55.js"),existing=read("instructor-ui.js");
 assert.match(app,/addEventListener\("yoga:flow"/);
 assert.match(app,/event\.detail\.index/);
 assert.match(app,/const total=10/);
 assert.match(app,/role","img"/);
 assert.match(app,/is-current/);
 assert.match(app,/is-complete/);
 assert.doesNotMatch(app,/setInterval\s*\(|setTimeout\s*\(/);
 assert.match(existing,/poseLocked/);
 assert.match(existing,/yoga:pose-ready/);
});
test("V55: actual visitors receive intentional studio navigation with reduced-motion support",()=>{
 const app=read("movement-cockpit-v55.js");
 assert.match(app,/event\.isTrusted/);
 assert.match(app,/scrollIntoView/);
 assert.match(app,/prefers-reduced-motion: reduce/);
 assert.match(app,/target\.disabled/);
});
test("V55: movement theatre has accessible focus and distinct session stages",()=>{
 const css=read("yy-movement-stage-v55.css");
 for(const selector of [".flow-console-top",".flow-theater",".flow-progress",".flow-phase-progress",".flow-controls",".flow-console-foot",".flow-step",".flow-start",".yy-stage"])
  assert.ok(css.includes(selector),"Missing "+selector);
 assert.match(css,/min-height:clamp\(445px,44vw,635px\)/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.mg-hinge-crease/);
 assert.match(css,/\.mg-socket-shape/);
});
test("V55: preserve independent guardians, unchanged audio, build and cache revision",()=>{
 const html=read("index.html"),b=read("tools/build.mjs");
 assert.match(html,/yy-movement-stage-v55\.css\?v=v55-1/);
 assert.match(html,/movement-cockpit-v55\.js\?v=v55-1/);
 assert.match(b,/'yy-movement-stage-v55\.css'/);
 assert.match(b,/'movement-cockpit-v55\.js'/);
 for(const f of ["studio-breath-dragon.js","studio-meditation-guardian-v42.js","yoga-audio-bus.js"])
   assert.ok(html.includes(f));
});
