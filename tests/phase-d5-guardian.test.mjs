import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../yy-guardian-soul.css",import.meta.url),"utf8");
const art=readFileSync(new URL("../yin-yang-art.js",import.meta.url),"utf8");
test("D5 is layered after D4 without replacing guardian artwork",()=>{
 assert.ok(html.indexOf("yy-guardian-soul.css")>html.indexOf("yy-phase-d4-polish.css"));
 assert.match(art,/const poses = \[/);
 assert.match(art,/yy-anim-eyes/);
});
test("D5 respects pause, quiet, motion preferences and Yin/Yang",()=>{
 for(const k of ['data-spirit="yin"','data-spirit="yang"','data-asana-state="paused"','data-asana-state="reduced"','prefers-reduced-motion:reduce','body.quiet-mode'])assert.ok(css.includes(k),k);
});
test("D5 uses restrained face styling without modifying pose geometry",()=>{
 for(const k of ["yy-guardian-lid","yy-eye-sheen","yy-smile","yy-cheek-shine","yy-pose-warrior","yy-pose-finish"])assert.ok(css.includes(k),k);
});
