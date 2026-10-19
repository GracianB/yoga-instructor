import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("index.html");
const i18n=read("i18n.js");
const css=read("yoga-public-final.css");

test("Yoga experience states where the instructor has taught, not where he currently teaches",()=>{
 assert.match(html,/data-i18n-html="expH2">Dónde he enseñado<br><em>y cómo\.<\/em>/);
 assert.match(i18n,/expH2: "Dónde he enseñado<br><em>y cómo\.<\/em>"/);
 assert.match(i18n,/expH2: "Where I’ve taught<br><em>and how\.<\/em>"/);
 assert.doesNotMatch(i18n,/expH2: "Where I teach/);
});

test("Restored botanical plant cycles smoothly from green to lilac and respects motion settings",()=>{
 assert.match(html,/<svg class="yoga-growth"[^>]*aria-hidden="true"/);
 assert.match(css,/--yoga-growth-green:/);
 assert.match(css,/--yoga-growth-lilac:/);
 assert.match(css,/@keyframes yogaGrowthColor/);
 assert.match(css,/@keyframes yogaGrowthSway/);
 assert.match(css,/45%,60%\{color:var\(--yoga-growth-lilac\)\}/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/quiet-mode #experiencia/);
});

test("Lotus hover becomes a focus light, never a magnified or speeded-up lotus",()=>{
 const hover=css.split("/* Hover is a soft spotlight")[1].split("@media(max-width:480px)")[0];
 assert.match(hover,/filter:brightness\(1\.16\)/);
 assert.match(hover,/drop-shadow/);
 assert.match(hover,/animation-duration:7s!important/);
 assert.match(hover,/animation-duration:13s!important/);
 assert.doesNotMatch(hover,/scale\(/);
 assert.doesNotMatch(hover,/animation-duration:3\.5s/);
});
