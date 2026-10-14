import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const get=p=>readFile(new URL("../"+p,import.meta.url),"utf8");
test("P0 Rive lab ships only as an isolated route",async()=>{
 const [html,root,build]=await Promise.all([get("rive-lab.html"),get("index.html"),get("tools/build.mjs")]);
 assert.match(html,/<canvas id="rive-canvas"/);
 assert.match(html,/rive-nila-rig-template\.svg/);
 assert.match(html,/rive-lab\.js/);
 assert.doesNotMatch(root,/rive-lab\.js/);
 for(const asset of ["rive-lab.html","rive-lab.css","rive-lab.js","rive-nila-rig-template.svg"])assert.ok(build.includes("'"+asset+"'"),"asset omitted: "+asset);
});
test("P0 Rive viewer only loads its runtime after explicit file selection",async()=>{
 const source=await get("rive-lab.js");
 assert.match(source,/input\.addEventListener\("change"/);
 assert.match(source,/await ensureRuntime\(\)/);
 assert.match(source,/script\.src="https:\/\/unpkg\.com\/@rive-app\/canvas@2\.44\.2"/);
 assert.match(source,/file\.size>15\*1024\*1024/);
 assert.match(source,/URL\.revokeObjectURL\(objectUrl\)/);
 assert.match(source,/player\.cleanup\(\)/);
 assert.match(source,/prefers-reduced-motion: reduce/);
 assert.doesNotMatch(source,/fetch\(\s*["']https?:\/\/.*\.riv/);
});
test("P0 rig exposes two independently articulable legs and arms",async()=>{
 const svg=await get("rive-nila-rig-template.svg");
 const layers=["PELVIS","TORSO","NECK","HEAD","L_THIGH","R_THIGH","L_SHIN","R_SHIN","L_FOOT","R_FOOT","L_UPPER_ARM","R_UPPER_ARM","L_FOREARM","R_FOREARM","L_HAND","R_HAND"];
 for(const name of layers)assert.match(svg,new RegExp('id="'+name+'"'),"missing rig layer "+name);
 assert.match(svg,/viewBox="0 0 480 640"/);
});
test("P0 Rive lab has restrictive CSP with opt-in CDN",async()=>{
 const html=await get("rive-lab.html");
 assert.match(html,/Content-Security-Policy/);
 assert.match(html,/object-src 'none'/);
 assert.match(html,/connect-src 'self' blob: https:\/\/unpkg\.com/);
 assert.match(html,/form-action 'none'/);
});

test("P0: demo .riv loads only on explicit click, from same origin",async()=>{
 const [html,client,build]=await Promise.all([get("rive-lab.html"),get("rive-lab.js"),get("tools/build.mjs")]);
 assert.match(html,/id="rive-demo"/);
 assert.match(client,/demoButton\.addEventListener\("click"/);
 assert.match(client,/fetch\("\.\/rive-nila-demo-p0\.riv"/);
 assert.match(client,/new File\(\[blob\],"nila-yoga-p0\.riv"/);
 assert.match(build,/copyFile\('rive-nila-demo-p0\.riv'/);
});
