import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {readFileSync} from "node:fs";
const require=createRequire(import.meta.url);
const library=require("../asana-library.js");
const source=readFileSync(new URL("../movement-guardian-v37.js",import.meta.url),"utf8");
const get=id=>library.byId(id);

test("Warrior II places an actual bent knee above the front supporting foot",()=>{
 const pose=get("v68-warrior-ii");
 const n=[...pose.legs[0].matchAll(/-?\d+(?:\.\d+)?/g)].map(x=>+x[0]);
 assert.equal(n.length,10,"Front leg needs two explicit quadratic segments");
 const knee=[n[4],n[5]],foot=pose.feet[0],hip=[n[0],n[1]];
 assert.ok(Math.abs(knee[0]-foot[0])<=3);
 assert.ok(Math.abs(knee[1]-foot[1])>=40);
 const a=[hip[0]-knee[0],hip[1]-knee[1]],b=[foot[0]-knee[0],foot[1]-knee[1]];
 const radians=Math.acos((a[0]*b[0]+a[1]*b[1])/(Math.hypot(...a)*Math.hypot(...b)));
 const angle=radians*180/Math.PI;
 assert.ok(angle>=90&&angle<=115,"Front knee should be visibly flexed, found "+angle);
 assert.deepEqual([n[8],n[9]],foot,"The sole anchor must not move");
});

test("Uttanasana has a horizontal hip-hinged body, not a rotating detached oval",()=>{
 const pose=get("v68-forward-fold");
 assert.equal(pose.body[4],0);
 assert.ok(pose.head[0]<pose.body[0]&&pose.head[1]>pose.body[1]);
 assert.ok(pose.head[3]<0);
 assert.match(source,/standingFold=p=>p\.id==="v68-forward-fold"/);
 assert.match(source,/if\(standingFold\(p\)\)return "M342 294 C326 277/);
 assert.match(source,/p\.kind==="downward"\|\|standingFold\(p\)\?0:r/);
 assert.deepEqual(pose.feet,[[337,384],[401,384]]);
});
