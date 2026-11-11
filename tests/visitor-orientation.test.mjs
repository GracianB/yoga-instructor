import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("index.html"),css=read("yoga-public-final.css"),js=read("yoga-showcase-v2.js"),readme=read("README.md");
test("The public 4-path guide covers actual enquiry services and never saves answers",()=>{
  for(const id of ["individual","sala","online","equipos"]){
    assert.match(html,new RegExp('data-match-choice="'+id+'"'));
    assert.match(html,new RegExp('data-match-answer="'+id+'"'));
    assert.match(html,new RegExp('data-yoga-service="'+id+'"'));
  }
  assert.match(html,/id="guia"/);
  assert.match(html,/id="dudas"/);
  assert.match(js,/data-yoga-service/);
  assert.doesNotMatch(js.split("Public practice orientation")[1],/localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/);
});
test("FAQ and orientation remain available to English and Spanish readers",()=>{
  assert.equal((html.match(/<details><summary>/g)||[]).length,5);
  assert.match(html,/The site prepares an editable email/);
  assert.match(html,/Esta selección no se guarda ni se envía/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(css,/focus-visible/);
  assert.match(read("styles.css"),/:not\(#dudas\) \{display:none!important;/);
  assert.match(css,/:not\(#dudas\)\{display:none!important\}/);
  assert.match(read("tools/build.mjs"),/"dudas","experiencia"/);
  assert.match(readme,/practice orientation/);
  assert.match(readme,/practical questions/);
});
