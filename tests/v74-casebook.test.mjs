import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("V74: applied experience chapter has three substantial, distinct case studies",()=>{
 const html=read("index.html");
 const portfolio=html.indexOf('id="portfolio"'),cases=html.indexOf('id="casos"'),studio=html.indexOf('id="instructor-flow"');
 assert.ok(portfolio>0 && portfolio<cases && cases<studio);
 assert.equal((html.match(/class="v74-case v74-case--/g)||[]).length,3);
 assert.equal((html.match(/class="v74-facts"/g)||[]).length,3);
 assert.equal((html.match(/data-v74-text="contextLabel"/g)||[]).length,3);
 assert.equal((html.match(/data-v74-text="approachLabel"/g)||[]).length,3);
 assert.equal((html.match(/data-v74-text="judgmentLabel"/g)||[]).length,3);
 assert.equal((html.match(/data-v74-text="transferLabel"/g)||[]).length,3);
 for(const term of ["Mood Fitness","Majorel","2022–06.2026","2019–2022","2020–2021"])assert.ok(html.includes(term),term);
});

test("V74: a four-phase configurable sample lesson and safety caveat are included",()=>{
 const html=read("index.html"),script=read("teaching-casebook-v74.js");
 for(const id of ["v74-setting","v74-duration","v74-total","v74-plan-bar","v74-steps","v74-adaptation","v74-contact"])assert.ok(html.includes('id="'+id+'"'));
 assert.match(html, /id="v74-setting"[\s\S]*?<option value="sala"/);
 for(const duration of ["15","30","45","60"])assert.ok(html.includes('<option value="'+duration+'"'));
 assert.match(script,/const allocate = \(minutes, weights\) =>/);
 assert.match(script,/minutes - parts\.reduce/);
 assert.match(script,/steps\.replaceChildren/);
 assert.match(script,/encodeURIComponent\(data\.subject\)/);
 assert.doesNotMatch(script,/setInterval\(|fetch\(|localStorage\.|navigator\.clipboard/);
 assert.match(html,/consulta a un profesional sanitario/i);
});

test("V74: ES and EN, accessible controls, scoped stylesheet and release included",()=>{
 const html=read("index.html"),script=read("teaching-casebook-v74.js"),style=read("teaching-casebook-v74.css"),build=read("tools/build.mjs");
 for(const file of ["teaching-casebook-v74.css","teaching-casebook-v74.js"]){
  assert.ok(html.includes(file+"?v=v74-1"));
  assert.ok(build.includes("'"+file+"'"));
 }
 for(const lang of ["es: {","en: {"])assert.ok(script.includes(lang));
 assert.match(script,/new MutationObserver/);
 assert.match(html,/<label for="v74-setting"/);
 assert.match(html,/<label for="v74-duration"/);
 assert.match(style,/:focus-visible/);
 assert.match(style,/@media\(max-width:520px\)/);
 assert.match(style,/@media print/);
});
