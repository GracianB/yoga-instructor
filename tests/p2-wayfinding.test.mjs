import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const build=readFileSync(new URL("../tools/build.mjs",import.meta.url),"utf8");
const gateway=readFileSync(new URL("../visitor-gateway-v80.js",import.meta.url),"utf8");
const style=readFileSync(new URL("../p2-wayfinding.css",import.meta.url),"utf8");

test("P2 keeps one direct studio entrance and all visitor journeys reachable",()=>{
 const nav=html.match(/<nav class="nav" id="nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1]??"";
 assert.match(nav,/href="#instructor-flow"/);
 assert.match(nav,/href="#portfolio"/);
 assert.match(nav,/href="#experiencia"/);
 assert.match(nav,/href="#contacto"/);
 assert.equal((html.match(/class="btn primary" href="#instructor-flow"/g)||[]).length,1);
 for(const dest of ["instructor-flow","portfolio","orientacion","experiencia","contacto","demostracion","preguntas"]){
  assert.ok(html.includes('id="'+dest+'"'),"missing destination "+dest);
 }
});

test("P2 retains a real three-path navigator and the music follows the studio",()=>{
 for(const route of ["practice","studio","teams"])assert.match(gateway,new RegExp("data-v80-route|"+route));
 assert.match(gateway,/studio\.after\(soundtrack\)/);
 assert.match(gateway,/"#demostracion"/);
 assert.match(gateway,/"#instructor-flow"/);
 assert.match(gateway,/"#v76-enquiry"/);
});

test("P2 stylesheet is shipped, responsive and preserves reduced motion",()=>{
 assert.match(html,/href="\.\/p2-wayfinding\.css/);
 assert.match(build,/'p2-wayfinding\.css'/);
 assert.match(style,/@media\(max-width:620px\)/);
 assert.match(style, /prefers-reduced-motion:reduce/);
});
