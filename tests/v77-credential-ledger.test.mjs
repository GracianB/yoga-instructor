import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V77 career ledger is complete, candid and linked to existing documents",()=>{
 const html=read("index.html");assert.ok(html.includes('id="trayectoria"'));
 for(const text of ["Mood Fitness","Wellness Ambassador","Google/YouTube","2019–2022","2022–2026","2019","Gracian_Baena_Carta_Yoga_ES.pdf","Cover_Letter_Yoga_EN.pdf"])assert.ok(html.includes(text),text);
 assert.equal((html.match(/data-v77-role="/g)||[]).length,4);assert.equal((html.match(/data-v77-filter="/g)||[]).length,5);
 assert.match(html,/no sustituyen una verificación independiente/);
 assert.ok(html.indexOf('id="trayectoria"')<html.indexOf('id="experiencia"'));
});
test("V77 native filters and alternative language are functional without telemetry",()=>{
const js=read("credential-ledger-v77.js");
for(const term of ['aria-pressed','card.hidden=!match','new MutationObserver','lang==="en"','window.print()','CV_Gracian_Baena_Yoga_','Cover_Letter_Yoga_EN.pdf','count.textContent'])assert.ok(js.includes(term),term);
for(const term of ["fetch(","localStorage.","sendBeacon","XMLHttpRequest"])assert.ok(!js.includes(term));
});
test("V77 release includes accessibility and print layout",()=>{
const html=read("index.html"),css=read("credential-ledger-v77.css"),build=read("tools/build.mjs");
for(const a of ["credential-ledger-v77.css","credential-ledger-v77.js"]){assert.ok(html.includes("./"+a));assert.ok(build.includes("'"+a+"'"))}
for(const term of [':focus-visible','@media print','[hidden]','max-width:620px'])assert.ok(css.includes(term));
});
