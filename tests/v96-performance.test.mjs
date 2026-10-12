import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";import{createRequire}from"node:module";
const require=createRequire(import.meta.url), policy=require("../studio-render-policy-v96.js");
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V96 policy stabilizes across elapsed frames and invalidates each user-visible state change",()=>{
const base={mode:"breath",status:"running",durationIndex:1,breathPattern:"natural",meditationStyle:"guided",meditationFocus:"breath",immersive:false,language:"es",asanaBusy:false};
const original=policy.key(base);
assert.equal(policy.key({...base,elapsedMs:3200}),original,"elapsed time must not rewrite control attributes");
for(const [field,value]of Object.entries({status:"paused",durationIndex:2,breathPattern:"free",meditationFocus:"space",immersive:true,language:"en",asanaBusy:true,mode:"meditation",meditationStyle:"silent"})){
 assert.notEqual(policy.key({...base,[field]:value}),original,field);
}
assert.throws(()=>policy.key({mode:"fake"}),TypeError);
});
test("V96 renderer uses identity key to avoid unnecessary 5Hz control updates",()=>{
const s=read("practice-studio.js");
for(const token of ["lastControlsKey","controlsKey!==lastControlsKey","syncDurations();","syncBreathButtons();","syncMeditationButtons();","syncFocusButtons();","lockChoices();"])assert.ok(s.includes(token),token);
assert.ok(s.indexOf("if(controlsKey!==lastControlsKey)")<s.lastIndexOf("syncDurations();"));
const h=read("index.html"),b=read("tools/build.mjs");assert.ok(h.includes("./studio-render-policy-v96.js"));assert.ok(b.includes("'studio-render-policy-v96.js'"));
});
