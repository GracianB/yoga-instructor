import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";import{execFileSync}from"node:child_process";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V99 offline production gate covers all guardian and privacy contracts",()=>{
const audit=read("tools/v99-integrity.mjs"),p=JSON.parse(read("package.json"));
assert.ok(p.scripts.quality.includes("audit:v99"));
for(const k of ["studio-asana-library","studio-preferences","movement-mini","focus-audio","Content-Security-Policy","controlsKey!==lastControlsKey","v95","studio-coherence-ui-v98.js"])assert.ok(audit.includes(k),k);
const output=execFileSync(process.execPath,["tools/v99-integrity.mjs"],{encoding:"utf8"});
assert.match(output,/V99_RELEASE_INTEGRITY_OK/);
});
test("V99 no new independent clocks, remote telemetry, fake users or unsafe persistence",()=>{
const files=["studio-render-policy-v96.js","studio-keyboard-v97.js","studio-coherence-ui-v98.js","studio-personalization-ui-v95.js"];
for(const path of files){const text=read(path);for(const bad of ["setInterval(","requestAnimationFrame(","navigator.sendBeacon","XMLHttpRequest(","fetch("])assert.ok(!text.includes(bad),path+":"+bad)}
});
