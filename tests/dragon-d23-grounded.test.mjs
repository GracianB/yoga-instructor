import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=file=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
const html=read("index.html"),style=read("yy-dragon-d23.css"),
 motion=read("yy-asana-motion.js"),build=read("tools/build.mjs");
test("D23: zero-foot-slip transitions are shipped and guard the classic D17 drawing",()=>{
 assert.match(html,/yy-dragon-d23\.css\?v=d23-1/);
 assert.ok(html.indexOf("yy-dragon-d23.css")>html.indexOf("yy-studio-finale.css"));
 assert.match(html,/yy-asana-motion\.js\?v=d14-1-d23-1/);
 assert.match(build,/'yy-dragon-d23\.css'/);
 assert.match(style,/\.yy-pose\.is-leaving/);
 assert.match(style,/\.yy-pose\.is-entering/);
 assert.match(style,/will-change:opacity/);
 assert.match(style,/transform:none/);
 assert.match(style,/prefers-reduced-motion:reduce/);
 assert.match(style,/body\.quiet-mode/);
 assert.doesNotMatch(style,/filter:blur|@import|animation:.*infinite/);
 assert.ok(style.length<4400);
});
test("D23: Cat/Cow begins neutral, restarts without displaced spine and retains D14 phase welding",()=>{
 assert.match(motion,/Math\.sin\(angle\)\*Math\.min\(1,clock\.elapsed\/1400\)/);
 assert.match(motion,/neutralWarmup\(\)/);
 assert.match(motion,/M-105 -24Q0 -61\.0 104 -24/);
 assert.match(motion,/M-95 27Q0 43\.0 95 27Q0 56\.0 -95 27Z/);
 assert.match(motion,/244\+curve\*5\.8/);
 assert.match(motion,/278\+curve\*5\.8/);
 assert.match(motion,/fmt\(-curve\*1\.3\)\+" 461 238/);
 assert.match(motion,/clock\.status==="paused"/);
 assert.ok(motion.length<7000);
});
test("D23: all 10 original postures preserve authored feet and closed eyes",()=>{
 const context={window:{}};
 runInNewContext(read("yin-yang-art.js"),context,{timeout:1600});
 const poses=context.window.YIN_YANG_ART.poses;
 assert.equal(poses.length,10);
 assert.ok(poses.every(p=>p.hands.length===2&&p.feet.length===2));
 const markup=context.window.YIN_YANG_ART.markup();
 assert.equal((markup.match(/class="yy-paw-group"/g)||[]).length,40);
 assert.equal([...markup.matchAll(/class="([^"]+)"/g)].filter(m=>m[1].split(/\s+/).includes("yy-d17-attachment")).length,40);
 assert.equal((markup.match(/class="yy-eye-closed yy-eye-/g)||[]).length,20);
});
