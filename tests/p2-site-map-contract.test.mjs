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

test("P2 keeps a legible short route-first experience and music beside the actual studio",()=>{
 const order=["inicio","explora","portfolio","sobre","oferta","experiencia","instructor-flow","soundtrack","contacto"];
 const at=order.map(id=>html.indexOf('id="'+id+'"'));
 assert.ok(at.every(x=>x>0));
 assert.deepEqual([...at].sort((a,b)=>a-b),at);
 assert.equal((html.match(/data-p2-route="/g)||[]).length,5);
 assert.match(html,/data-p2-mode="full"/); // Accessible content with JavaScript disabled
 assert.match(html,/id="p2-toggle"/);
 assert.match(html,/p2-navigation\.js\?v=p2/);
 const script=readFileSync(new URL("../p2-navigation.js",import.meta.url),"utf8");
 assert.match(script,/hashchange/);
 assert.match(script,/revealHash\(\)/);
 assert.match(script,/setFull\(remembered\)/);
});

test("P2 arrival animation is optional, not a mandatory splash slide",()=>{
 const boot=readFileSync(new URL("../boot.js",import.meta.url),"utf8");
 assert.match(boot,/get\("intro"\) === "1"/);
 assert.match(boot,/requested && !reduce && !seen/);
 const styles=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
 assert.match(styles,/#main\[data-p2-mode="short"\] #inicio \.hero-stats/);
});

test("P2 supports focused visitor chapters while preserving browser access to the full archive",()=>{
 const js=readFileSync(new URL("../p2-navigation.js",import.meta.url),"utf8");
 const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
 assert.match(js,/const chapterFor=node=>/);
 assert.match(js,/root\.dataset\.p2Focus=id/);
 assert.match(js,/scrollToTarget\(target\)/);
 for(const id of ["sobre","oferta","experiencia","instructor-flow","contacto"]){
  assert.ok(css.includes('[data-p2-focus="'+id+'"] > #'+id));
 }
 assert.match(css,/#main\[data-p2-mode="short"\]\[data-p2-focus\]/);
});

test("P2 keeps global music controls out of the short landing view without deleting audio",()=>{
 const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
 assert.match(css,/body:has\(#main\[data-p2-mode="short"\]\) \.sanctuary-dock\{display:none!important\}/);
 const js=readFileSync(new URL("../p2-navigation.js",import.meta.url),"utf8");
 assert.match(js,/aria-current","location"/);
 assert.match(js,/markCurrentRoute\(\)/);
 assert.match(html,/id="focus-audio"/);
});
