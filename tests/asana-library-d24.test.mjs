import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import {runInNewContext} from "node:vm";
const require=createRequire(import.meta.url);
const library=require("../asana-library.js");
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const context={window:{}};
runInNewContext(read("yin-yang-art.js"),context,{timeout:1800});
const art=context.window.YIN_YANG_ART;
const html=read("index.html"),build=read("tools/build.mjs"),
 guide=read("studio-asana-library.js"),css=read("yy-asana-library.css");
const count=(markup,cls)=>[...markup.matchAll(/class="([^"]+)"/g)]
 .filter(x=>x[1].split(/\s+/).includes(cls)).length;

test("D24: exactly three independently authored postures, canonical Flow remains at ten",()=>{
 assert.deepEqual(library.poses.map(p=>p.id),["d24-mountain","d24-downward","d24-butterfly"]);
 assert.equal(art.poses.length,10);
 assert.equal(count(art.markup(),"yy-pose"),10);
 assert.equal(typeof art.drawPose,"function");
 for(const pose of library.poses){
   assert.ok(pose.arms.length===2&&pose.legs.length===2);
   assert.ok(pose.hands.length===2&&pose.feet.length===2);
   assert.equal(pose.name.length,2);
   assert.equal(pose.cue.length,2);
   assert.equal(pose.support.length,2);
   assert.ok(Object.isFrozen(pose));
 }
 assert.equal(library.byId("missing"),null);
});

test("D24: new poses use genuine distinct four-limb vectors and complete D17 anatomy",()=>{
 const shapes=library.poses.map(p=>art.drawPose(p));
 for(const markup of shapes){
   assert.equal(count(markup,"yy-paw-group"),4);
   assert.equal(count(markup,"yy-d17-attachment"),4);
   assert.equal(count(markup,"yy-eye-closed"),2);
   assert.equal(count(markup,"yy-d12-unicorn-core"),1);
   assert.equal(count(markup,"yy-torso"),1);
   assert.doesNotMatch(markup,/NaN|Infinity|undefined/);
 }
 assert.equal(count(shapes[0],"yy-stance-shadow"),2);
 assert.equal(count(shapes[1],"yy-stance-shadow"),4);
 assert.equal(count(shapes[2],"yy-stance-shadow"),2);
 const profiles=new Set(library.poses.map(p=>JSON.stringify([p.body,p.head,p.arms,p.legs,p.hands,p.feet])));
 assert.equal(profiles.size,3);
 assert.ok(library.byId("d24-downward").body[4]<-20);
 assert.ok(library.byId("d24-mountain").body[3]>85);
 assert.ok(library.byId("d24-butterfly").feet[0][0]>300);
});

test("D24: library is a separate accessible exploration with no extra clock",()=>{
 for(const f of ["asana-library.js","studio-asana-library.js","yy-asana-library.css"]){
   assert.ok(build.includes("'"+f+"'"),f);
   assert.ok(html.includes(f),f);
 }
 assert.ok(html.includes("yin-yang-art.js?v=phase-d17-1-d24-1"));
 assert.match(guide,/aria-pressed/);
 assert.match(guide,/aria-live/);
 assert.match(guide,/ArrowLeft/);
 assert.match(guide,/MutationObserver/);
 assert.match(guide,/new DOMParser/);
 assert.match(guide,/d24-/);
 assert.doesNotMatch(guide,/setInterval\(|requestAnimationFrame\(|fetch\(/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/max-width:420px/);
 assert.ok(css.length<6500);
});
