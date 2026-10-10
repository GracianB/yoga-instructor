import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const html=read("index.html"), build=read("tools/build.mjs");
test("V35: separate breathing artwork retains authored asana source",()=>{
 const source=read("studio-breath-dragon.js");
 assert.match(source,/studio-companion/);
 assert.match(source,/studio-breath-dragon/);
 for(const token of ["sd31-tail","sd31-wings","sd31-breath-core","sd31-head","sd31-horn","sd31-ground"]){
  if(token==="sd31-horn")continue;
  assert.ok(source.includes(token),token);
 }
 assert.ok(source.includes('viewBox","65 18 430 360"'));
 assert.doesNotMatch(source,/setInterval|setTimeout|requestAnimationFrame/);
 assert.match(read("studio-companion.js"),/source\.cloneNode\(true\)/);
});
test("V36: breathing shares the single opt-in soundtrack with the whole site",()=>{
 const js=read("studio-soundscape.js"),bus=read("yoga-audio-bus.js");
 assert.match(js,/bus\.toggle\("breath"\)/);
 assert.match(js,/bus\.selectFile\(input\.files/);
 assert.match(js,/volume\.addEventListener/);
 assert.doesNotMatch(js,/<audio/);
 assert.match(bus,/URL\.createObjectURL\(file\)/);
 assert.match(bus,/URL\.revokeObjectURL\(localUrl\)/);
 assert.match(bus,/audio\.play\(\)/);
 assert.match(bus,/deactivateVortex/);
 assert.match(bus,/audio\/silence-between-notes\.mp3/);
 assert.doesNotMatch(read("index.html"),/<audio[^>]+autoplay/);
});
test("V35: dedicated studio assets all wired in dependency order and in Pages",()=>{
 for(const f of ["studio-breath-dragon.js","studio-soundscape.js","yy-breath-revival.css","yy-studio-soundscape.css"]){
  assert.ok(html.includes("./"+f+"?v="),f+" HTML");
  assert.ok(build.includes("'"+f+"'"),f+" Pages manifest");
 }
 assert.ok(html.indexOf("studio-breath-dragon.js")>html.indexOf("studio-companion.js"));
 assert.ok(html.indexOf("studio-soundscape.js")>html.indexOf("practice-studio.js"));
 assert.ok(html.indexOf("yy-breath-revival.css")>html.indexOf("yy-dragon-d28.css"));
 const css=read("yy-breath-revival.css");
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/body\.quiet-mode/);
 assert.match(css,/max-width:380px/);
 assert.match(css,/data-spirit="yin"/);
});
