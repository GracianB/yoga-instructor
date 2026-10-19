import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),css=read("yoga-public-final.css");
const nav=read("p2-navigation.js"),enq=read("yoga-enquiry-v76.js");
test("Four teaching formats lead the public showcase; future apps are paused",()=>{
 assert.equal((html.match(/class="yoga-offer-card"/g)||[]).length,4);
 assert.equal((html.match(/class="p26-project-card"/g)||[]).length,2);
 for(const item of ["online","individual","sala","equipos"]){
   assert.ok(html.includes('data-yoga-service="'+item+'"'));
   assert.ok(html.includes('name="v76-service" value="'+item+'"'));
 }
 assert.match(html,/class="yoga-future"/);
 assert.match(html,/En pausa/);
});
test("Live form remains safe and deployed, with no automatic network submission",()=>{
 assert.doesNotMatch(html,/<section class="v76-enquiry"[^>]*hidden/);
 assert.match(css,/#contacto #v76-enquiry\.v76-enquiry/);
 assert.match(enq,/mailto:/);
 assert.match(enq,/subjectOnline/);
 assert.match(read("tools/build.mjs"),/p2-navigation\.js","yoga-enquiry-v76\.js"/);
});
test("Lotus constellation obeys reduced-motion and offscreen limits",()=>{
 assert.match(html,/id="yoga-lotus-field"/);
 assert.match(nav,/requestAnimationFrame\(tick\)/);
 assert.match(nav,/prefers-reduced-motion: reduce/);
 assert.match(nav,/IntersectionObserver/);
 assert.match(nav,/document\.hidden/);
 assert.match(css,/\.yoga-lotus-field/);
 assert.match(read("README.md"),/readme-yoga\.svg/);
 assert.ok(read("assets/readme-yoga.svg").startsWith("<svg"));
});
