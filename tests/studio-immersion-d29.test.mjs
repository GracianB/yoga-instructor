import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("D29: focus view retains a keyboard-exitable, visible control",()=>{
 const html=read("index.html"),js=read("practice-studio.js"),css=read("yy-studio-d29.css");
 assert.match(html,/data-studio-action="immersion"/);
 assert.match(html,/aria-pressed="false" data-studio-copy="enterImmersion"/);
 assert.match(js,/event\.key === "Escape" && immersive/);
 assert.match(js,/setImmersive\(false\)/);
 assert.match(js,/immersionButton\.focus\(\)/);
 assert.match(css,/data-studio-immersion="true"/);
 assert.match(css,/\.studio-duration/);
 assert.doesNotMatch(css,/\.studio-action-buttons\s*\{\s*display:none/);
});
test("D29: versioned, singleton assets are shipped in dependency order",()=>{
 const html=read("index.html"),build=read("tools/build.mjs");
 const scripts=["studio-clock.js","studio-breath-engine.js","studio-meditation-d27.js",
 "studio-anatomy-d28.js","practice-studio.js","studio-companion.js"];
 const locs=scripts.map(file=>{
  const found=html.indexOf("./"+file+"?");assert.ok(found>=0,file+" missing");
  assert.equal(html.split("./"+file+"?").length-1,1,file+" duplicate");
  assert.ok(build.includes("'"+file+"'"),file+" must be deployed");
  return found;
 });
 assert.deepEqual(locs,[...locs].sort((a,b)=>a-b));
 for(const sheet of ["yy-dragon-d28.css","yy-studio-d29.css"]){
  assert.equal(html.split("./"+sheet+"?").length-1,1);
  assert.ok(build.includes("'"+sheet+"'"));
 }
});
test("D29: minimal mode has light/dark, narrow viewport and reduced-motion contracts",()=>{
 const css=read("yy-studio-d29.css"),js=read("practice-studio.js");
 assert.match(css,/max-width:380px/);
 assert.match(css,/max-width:600px/);
 assert.match(css,/data-theme="dark"/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(js,/immersionA11yOn/);
 assert.match(js,/immersionA11yOff/);
});
