import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("V75: editorial atlas precedes the portfolio, evidence and live studio",()=>{
 const html=read("index.html");
 const indices=['id="atlas"','id="portfolio"','id="casos"','id="instructor-flow"','id="experiencia"'].map(x=>html.indexOf(x));
 assert.ok(indices.every(x=>x>0));
 assert.deepEqual([...indices].sort((a,b)=>a-b),indices);
 assert.equal((html.match(/data-v75-step="/g)||[]).length,5);
 assert.match(html, /id="v75-atlas-nav"/);
 assert.match(html, /id="v75-title"/);
 assert.match(html, /id="v75-current"/);
 assert.match(html, /v75-art-petals/);
 assert.match(html, /v75-art-orbits/);
 assert.match(html, /<svg viewBox="0 0 540 380"/);
});

test("V75: bilingual accessible chapter navigation is native and reduced-motion safe",()=>{
 const script=read("editorial-atlas-v75.js"),css=read("editorial-atlas-v75.css"),html=read("index.html");
 for(const token of ["es:{","en:{","new MutationObserver","IntersectionObserver","aria-current","aria-label","requestedChapter = link.dataset.v75Step","activate(requestedChapter)","rootMargin"])assert.ok(script.includes(token),token);
 for(const path of ['href="#portfolio"','href="#casos"','href="#instructor-flow"','href="#experiencia"','href="#contacto"'])assert.ok(html.includes(path),path);
 assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
 assert.match(css,/@media\(max-width:480px\)/);
 assert.match(css, /:focus-visible/);
 assert.doesNotMatch(script,/setInterval\(|setTimeout\(|localStorage\.|fetch\(|new Audio\(/);
});

test("V75: a cohesive design touches all seven professional surfaces without overriding yoga clocks",()=>{
 const css=read("editorial-atlas-v75.css");
 for(const selector of ["#inicio.hero","#portfolio.portfolio-v73","#casos.v74-casebook","#sobre","#oferta","#experiencia","#formacion","#contacto.section"])assert.ok(css.includes(selector),selector);
 for(const tone of ["--v75-forest","--v75-clay","--v75-dusk","--v75-parchment","--v75-divider"])assert.ok(css.includes(tone));
 assert.ok(css.includes('html[data-theme="dark"]'));
 assert.ok(css.includes('html[data-theme="light"]'));
 assert.doesNotMatch(css, /#studio-guided|#flow-guide|#studio-v66-workspace|--studio-guardian-wing/);
});

test("V75: exact-release manifest includes new assets and historic assets",()=>{
 const html=read("index.html"),build=read("tools/build.mjs");
 for(const file of ["editorial-atlas-v75.js","editorial-atlas-v75.css","teaching-casebook-v74.js","teaching-casebook-v74.css","portfolio-v73.js","portfolio-v73.css"]){
  assert.ok(html.includes(file+"?v=v"+(file.includes("v75")?75:file.includes("v74")?74:73)+"-1"),file);
  assert.ok(build.includes("'"+file+"'"),file);
 }
});
