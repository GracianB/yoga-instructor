import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("V76: professional enquiry is integrated without replacing direct contact routes",()=>{
 const html=read("index.html");
 for(const id of ["v76-enquiry","v76-form","v76-preview","v76-mail","v76-reset","v76-results","v76-live","v76-counter"]){
  assert.ok(html.includes('id="'+id+'"'),"Missing "+id);
 }
 assert.ok(html.indexOf('id="contacto"')<html.indexOf('id="v76-enquiry"'));
 assert.match(html,/class="contact-actions"/);
 assert.match(html,/https:\/\/calendar\.app\.google\//);
 assert.match(html,/type="submit"/);
 assert.match(html,/type="radio" name="v76-service" value="sala"/);
 assert.match(html,/type="radio" name="v76-service" value="online"/);
 assert.match(html,/type="radio" name="v76-service" value="individual"/);
 assert.match(html,/type="radio" name="v76-service" value="equipos"/);
 assert.match(html,/id="v76-details"[^>]*maxlength="500"/);
 assert.match(html,/<section class="v76-results"[^>]*hidden>/);
});

test("V76: no telemetry or storage, just deliberate mailto link with encoded text",()=>{
 const js=read("yoga-enquiry-v76.js");
 for(const forbidden of ["fetch(","XMLHttpRequest","sendBeacon","localStorage.","sessionStorage.","indexedDB","WebSocket","document.cookie"]){
  assert.ok(!js.includes(forbidden),"Unexpected data transmission or storage: "+forbidden);
 }
 assert.match(js,/event\.preventDefault\(\)/);
 assert.match(js,/mailto:/);
 assert.match(js,/encodeURIComponent\(subject\)/);
 assert.match(js,/encodeURIComponent\(message\)/);
 assert.match(js,/preview\.addEventListener\("input"/);
 assert.match(js,/form\.reset\(\)/);
});

test("V76: three independent settings, bilingual native form semantics",()=>{
 const html=read("index.html"),js=read("yoga-enquiry-v76.js");
 assert.match(js,/es:\s*\{/);
 assert.match(js,/en:\s*\{/);
 assert.match(js,/new MutationObserver/);
 for(const control of ["v76-format","v76-focus","v76-size","v76-details"])
  assert.ok(html.includes('for="'+control+'"'));
 assert.equal((html.match(/<fieldset class="v76-/g)||[]).length,3);
 assert.equal((html.match(/name="v76-service"/g)||[]).length,4);
 assert.match(html,/role="status"/);
 assert.match(js,/details\.value\.trim\(\)/);
});

test("V76: responsive, two themes and reduced motion are bundled in Pages",()=>{
 const css=read("yoga-enquiry-v76.css"),html=read("index.html"),build=read("tools/build.mjs");
 for(const asset of ["yoga-enquiry-v76.css","yoga-enquiry-v76.js"]){
  assert.ok(html.includes(asset+"?v=v76-1"));
  assert.ok(build.includes("'"+asset+"'"));
 }
 assert.match(css,/@media\(max-width:640px\)/);
 assert.match(css,/html\[data-theme="dark"\]/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\[hidden\]\{display:none!important\}/);
});
