import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");

const journeys=[
 ["About","sobre"],
 ["Classes","oferta"],
 ["Studio","instructor-flow"],
 ["Experience","experiencia"],
 ["Contact","contacto"]
];

test("P2 visitor destinations exist without breaking current deep links",()=>{
 for(const [label,id] of journeys){
  assert.match(html,new RegExp('\\bid="'+id+'"'),label+" landmark missing");
 }
 for(const id of ["inicio","orientacion","atlas","ritual","casos","programa","cv","preguntas"]){
  assert.match(html,new RegExp('\\bid="'+id+'"'),"Legacy anchor missing: "+id);
 }
});
test("head keeps real anchors, skip navigation and current language/theme controls",()=>{
 assert.match(html,/href="#main"/);
 assert.match(html,/id="nav"/);
 assert.match(html,/data-set-lang="es"/);
 assert.match(html,/data-set-lang="en"/);
 assert.match(html,/data-set-theme="dark"/);
 assert.match(html,/data-set-theme="light"/);
});
