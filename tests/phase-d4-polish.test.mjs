import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css = readFileSync(new URL("../yy-phase-d4-polish.css",import.meta.url),"utf8");
test("D4 styles layer after D1-D3 without replacing their files",()=>{
 const order=["yy-premium-stage.css","yy-phase-d2-d3.css","yy-phase-d4-polish.css"].map(s=>html.indexOf(s));
 assert.ok(order.every(i=>i>=0));assert.ok(order[0]<order[1]&&order[1]<order[2]);
});
test("D4 keeps rails, practice controls, focus and reduced motion",()=>{
 for(const s of ["flow-theater","flow-rail-button","flow-controls","flow-entry-actions","prefers-reduced-motion","focus-visible"]){assert.ok(css.includes(s),s);}
 for(const s of ['data-flow-action="previous"','data-flow-action="next"','data-flow-action="pause"','data-flow-action="reset"'])assert.ok(html.includes(s),s);
});
test("D4 respects both guardian forms and narrow layouts",()=>{
 assert.match(css,/data-spirit="yin"/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/@media\(max-width:380px\)/);
});
