import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import {runInNewContext} from "node:vm";
const require=createRequire(import.meta.url);
const art=()=>{const sandbox={window:{}};runInNewContext(readFileSync(new URL("../yin-yang-art.js",import.meta.url),"utf8"),sandbox,{timeout:1500});return sandbox.window.YIN_YANG_ART;};
const motion=require("../guardian-motion-v102.js");
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
test("V102: every canonical SVG dragon has a filled pelvis and two joined axillae",()=>{
 const svg=art().markup();
 assert.equal((svg.match(/class="yy-v102-pelvis-solid"/g)||[]).length,10);
 assert.equal((svg.match(/class="yy-v102-axilla-solid"/g)||[]).length,20);
 assert.equal((svg.match(/data-axilla="0"/g)||[]).length,10);
 assert.equal((svg.match(/data-axilla="1"/g)||[]).length,10);
 assert.doesNotMatch(svg,/NaN|Infinity|undefined/);
 for(const p of art().poses){
  const piece=art().drawPose(p);
  assert.equal((piece.match(/yy-v102-axilla-solid/g)||[]).length,2,p.id);
  assert.equal((piece.match(/yy-v102-pelvis-solid/g)||[]).length,1,p.id);
  assert.equal((piece.match(/data-limb="arm-/g)||[]).length,2,p.id);
 }
});
test("V102: Tree's two paws remain outside the scaled head instead of vanishing behind its face",()=>{
 const p=art().poses.find(p=>p.id==="pose-2");
 assert.ok(p,"Tree pose must exist");
 const [headX,,scale]=p.head;
 const safeX=70*scale+19;
 assert.ok(p.hands[0][0]<headX-safeX,"Left palm clears the head and horns");
 assert.ok(p.hands[1][0]>headX+safeX,"Right palm clears the head and horns");
 assert.ok(p.hands.every(([x,y])=>y<90&&x>=200&&x<=520),"Raised hands stay within the stage");
 for(let i=0;i<2;i++){
  const nums=(p.arms[i].match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
  assert.deepEqual(nums.slice(-2),Array.from(p.hands[i]),"Palm follows the canonical authored arm endpoint");
 }
});
test("V102: Nila uses original roots for visible paired arms, hip and shoulder webs",()=>{
 const source=read("movement-guardian-v37.js");
 for(const s of ["mg-v102-pelvis","mg-v102-underarm","mg-v102-forearm","frontArms(p)","curveSections(d)","sample(sections[index]","mg-arms-behind"])
  assert.ok(source.includes(s),s);
 const style=read("yy-guardian-reconstruction-v102.css");
 for(const s of ["mg-v102-hip-web","mg-v102-axillary-web","mg-v102-arms-front"])
  assert.ok(source.includes(s),s);
 assert.ok(style.includes("mg-v102-forearm"));
});
test("V102: real breath has obvious amplitude but never moves a grounded paw",()=>{
 const idle=motion.breath({expansion:1,phase:"inhale"},{status:"idle"});
 const low=motion.breath({expansion:0,phase:"inhale"},{status:"running"});
 const high=motion.breath({expansion:1,phase:"inhale"},{status:"running"});
 assert.equal(idle.chestX,"1.0000");
 assert.equal(low.chestX,"1.0000");
 assert.ok(Number(high.chestX)>=1.18);
 assert.ok(Number(high.bellyX)>=1.15);
 assert.ok(Number(high.halo)>1.10);
 assert.equal(high.mistOpacity,"0.0000");
 const exhale=motion.breath({expansion:.25,phase:"exhale"},{status:"running"});
 assert.ok(Number(exhale.mistOpacity)>.5);
 assert.deepEqual(motion.breath({expansion:.75,phase:"inhale"},{status:"paused"}),motion.breath({expansion:.75,phase:"inhale"},{status:"running"}));
 for(const quiet of [true,false]){
  const rest=motion.breath({expansion:1,phase:"free"},{status:"running",quiet});
  assert.equal(rest.chestX,"1.0000");
 }
 assert.equal(motion.breath({expansion:1,phase:"inhale"},{status:"running",quiet:true}).chestX,"1.0000");
 assert.throws(()=>motion.breath(null),TypeError);
});
test("V102: Uma firefly, star and lotus are deterministic, freeze on pause and finish in bloom",()=>{
 const state={elapsedMs:4260,status:"running"};
 const active=motion.meditation(state);
 assert.deepEqual(active,motion.meditation({...state,status:"paused"}));
 assert.notEqual(active.fireflyX,"0.00px");
 assert.notEqual(active.starY,"0.00px");
 const idle=motion.meditation({elapsedMs:0,status:"idle"});
 assert.equal(idle.fireflyX,"0.00px");
 assert.equal(idle.fireflyY,"0.00px");
 const done=motion.meditation({elapsedMs:90000,status:"finished"});
 assert.equal(done.lotus,"1.0000");
 const reduced=motion.meditation({...state,quiet:true});
 assert.equal(reduced.fireflyY,"0.00px");
 assert.throws(()=>motion.meditation({elapsedMs:-1,status:"running"}),RangeError);
});
test("V102: guardians never add clocks, autoplay, network, persistent user data or forced breathing",()=>{
 const pure=read("guardian-motion-v102.js"),ui=read("practice-studio.js");
 for(const token of ["setTimeout(","setInterval(","requestAnimationFrame(","localStorage","sessionStorage","fetch(",".play("]){
  assert.ok(!pure.includes(token),"motion model must not use "+token);
 }
 assert.ok(ui.includes("v102?.breath(breathing"));
 assert.ok(ui.includes("v102?.meditation({elapsedMs:elapsed"));
 assert.ok(read("studio-breath-dragon.js").includes("sd31-v102-belly"));
 assert.ok(read("studio-breath-dragon.js").includes("sd31-v102-exhale-mist"));
 for(const token of ["uma-v102-pelvis","uma-v102-axilla","uma-v102-firefly","uma-v102-orbit-star","uma-v102-lotus"])
  assert.ok(read("studio-meditation-guardian-v42.js").includes(token),token);
 const css=read("yy-guardian-reconstruction-v102.css");
 for(const token of ["prefers-reduced-motion:reduce","body.quiet-mode","data-studio-active=\"breath\"","data-studio-active=\"meditation\""])
  assert.ok(css.includes(token),token);
 const html=read("index.html"),build=read("tools/build.mjs");
 for(const name of ["guardian-motion-v102.js","yy-guardian-reconstruction-v102.css"]){
  assert.ok(html.includes("./"+name+"?v=v102-1"));
  assert.ok(build.includes("'"+name+"'"));
 }
 assert.ok(html.indexOf("guardian-motion-v102.js")<html.indexOf("practice-studio.js"));
});
