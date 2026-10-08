import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {STYLES,cue}=require("../studio-meditation-d27.js");
test("D27: guided prompts move only at deliberate thresholds",()=>{
 assert.deepEqual(STYLES,["guided","silent"]);
 assert.equal(cue(0).title,"meditationBegin");
 assert.equal(cue(.119).title,"meditationBegin");
 assert.equal(cue(.12).title,"meditationFocus");
 assert.equal(cue(.859).title,"meditationFocus");
 assert.equal(cue(.86).title,"meditationEnd");
 assert.equal(cue(1).title,"meditationEnd");
});
test("D27: silent style never introduces a new prompt",()=>{
 for(const p of [0,.1,.4,.9,1])assert.deepEqual(cue(p,"silent"),{
  title:"meditationFree",cue:"meditationFreeCue"
 });
 for(const bad of [NaN,Infinity])assert.throws(()=>cue(bad),RangeError);
});
test("D27: no independent animation clock; full build includes mode",()=>{
 const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
 for(const p of ["studio-meditation-d27.js","yy-studio-meditation-d27.css"]){
  assert.ok(read("index.html").includes(p));
  assert.ok(read("tools/build.mjs").includes("'"+p+"'"));
 }
 assert.doesNotMatch(read("studio-meditation-d27.js"),/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
 assert.match(read("yy-studio-meditation-d27.css"),/prefers-reduced-motion/);
 assert.match(read("practice-studio.js"),/Meditation\.cue\(snapshot\.progress, meditationStyle, meditationFocus\)/);
});

test("D27: breath, body and surroundings use distinct quiet focus cues",()=>{
 const {FOCUSES}=require("../studio-meditation-d27.js");
 assert.deepEqual(FOCUSES,["breath","body","space"]);
 assert.equal(cue(.5,"guided","breath").cue,"meditationFocusCue");
 assert.equal(cue(.5,"guided","body").cue,"meditationBodyCue");
 assert.equal(cue(.5,"guided","space").cue,"meditationSpaceCue");
 assert.equal(cue(.05,"guided","body").cue,"meditationBeginCue");
 assert.equal(cue(.95,"guided","space").cue,"meditationEndCue");
 assert.equal(cue(.5,"guided","unknown").cue,"meditationFocusCue");
 assert.equal(cue(.5,"silent","body").cue,"meditationFreeCue");
});
test("D27: selected attention is UI-only; silent mode keeps the figure grounded",()=>{
 const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
 const js=read("practice-studio.js"),html=read("index.html"),css=read("yy-studio-meditation-d27.css");
 assert.match(js,/syncFocusButtons/);
 assert.match(js,/Meditation\.FOCUSES\.includes/);
 assert.match(html,/data-meditation-focus="body"/);
 assert.match(html,/data-meditation-focus="space"/);
 assert.match(css,/data-studio-active="meditation"/);
 assert.match(css,/animation:none!important;transform:none!important/);
});
