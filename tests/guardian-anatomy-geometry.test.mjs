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

test("supporting limbs cast only intentional grounded shadows",()=>{
 const svg=artwork().markup();
 const stanceFor=id=>{
  const region=svg.split('data-pose="'+id+'"')[1]?.split('</g></g>')[0]||"";
  return (region.match(/class="yy-stance-shadow"/g)||[]).length;
 };
 assert.equal(stanceFor('warmup'),4);
 assert.equal(stanceFor('pose-1'),2);
 assert.equal(stanceFor('pose-2'),1);
 assert.equal(stanceFor('savasana'),0);
});

test("dragon anatomy: two closed eyes, paired horns, beard and fin in every pose",()=>{
 const svg=artwork().markup(),count=s=>svg.split(s).length-1;
 assert.equal(count('yy-eye-closed yy-eye-'),20);
 assert.equal(count('yy-dragon-horn yy-horn-'),20);
 assert.equal(count('class="yy-dragon-beard"'),10);
 assert.equal(count('yy-whisker yy-dragon-whisker'),40);
 assert.equal(count('yy-dragon-tail-fin yy-d12-tail-plume'),10);
 assert.doesNotMatch(svg,/yy-crown-mark|yy-eye-core|yy-eye-center|yy-eye-almond|yy-third-eye/);
 assert.equal(count('class="yy-limb yy-arm"'),20);
 assert.equal(count('class="yy-limb yy-leg"'),20);
 assert.equal(count('class="yy-paw-group"'),40);
});

test("D9 sculpted muzzle is integrated and both eyes stay closed across the practice",()=>{
 const svg=artwork().markup(),count=s=>svg.split(s).length-1;
 assert.equal(count('yy-dragon-face-plane'),10);
 assert.equal(count('yy-dragon-nose-pad'),10);
 assert.equal(count('yy-dragon-bridge-layer'),10);
 assert.equal(count('yy-dragon-body-scales'),10);
 assert.equal(count('yy-dragon-freckle'),40);
 assert.equal(count('yy-dragon-motes'),10);
 assert.equal(count('yy-eye-closed yy-eye-'),20);
 assert.equal(count('class="yy-paw-group"'),40);
 assert.doesNotMatch(svg,/yy-crown-mark|yy-eye-core|yy-eye-center|yy-eye-almond/);
});
