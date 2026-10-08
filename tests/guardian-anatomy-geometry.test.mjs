import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const source=readFileSync(new URL("../yin-yang-art.js",import.meta.url),"utf8");
function artwork(){
 const sandbox={window:{}};
 runInNewContext(source,sandbox,{timeout:1000});
 return sandbox.window.YIN_YANG_ART;
}
const pos=(p)=>p.reduce((out,item)=>{out[item.id]=item;return out;},{});
const end=d=>{const nums=[...d.matchAll(/-?\d+(?:\.\d+)?/g)].map(m=>Number(m[0]));return nums.slice(-2);};
test("all ten poses render finite polygonal arms and legs without malformed SVG",()=>{
 const art=artwork();
 assert.equal(art.poses.length,10);
 const svg=art.markup();
 assert.equal((svg.match(/class="yy-limb yy-arm"/g)||[]).length,20);
 assert.equal((svg.match(/class="yy-limb yy-leg"/g)||[]).length,20);
 assert.equal((svg.match(/class="yy-paw-group"/g)||[]).length,40);
 assert.ok(!/NaN|Infinity|undefined/.test(svg));
 for(const p of art.poses){
   for(const [kind,paths,ends] of [['arm',p.arms,p.hands],['leg',p.legs,p.feet]]){
     assert.equal(paths.length,2,p.id+" "+kind);
     paths.forEach((d,i)=>{
       assert.match(d,/^M-?\d+/);
       assert.ok((d.match(/Q/g)||[]).length>=1);
       const coords=end(d);
       assert.equal(coords[0],ends[i][0],p.id+" "+kind+" endpoint X");
       assert.equal(coords[1],ends[i][1],p.id+" "+kind+" endpoint Y");
     });
   }
 }
});
test("Warrior II and Tree have physically authored knee bends, other grounded paws intact",()=>{
 const poses=pos(artwork().poses);
 assert.equal((poses['pose-1'].legs[0].match(/Q/g)||[]).length,2);
 assert.equal((poses['pose-1'].legs[1].match(/Q/g)||[]).length,2);
 assert.equal((poses['pose-2'].legs[1].match(/Q/g)||[]).length,2);
 assert.equal(poses['pose-2'].feet[1][0],355);
 assert.equal(poses['pose-2'].feet[1][1],313);
 assert.deepEqual(Array.from(poses.warmup.feet[0]),[451,368]);
 assert.deepEqual(Array.from(poses.warmup.feet[1]),[505,363]);
});
