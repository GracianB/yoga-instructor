import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
const i18n=readFileSync(new URL("../i18n.js",import.meta.url),"utf8");
const inactive=["orientacion","atlas","portfolio","casos","programa","campo","sobre","oferta","camino","trayectoria","demostracion","ritual","instructor-flow","studio-guided","soundtrack","formacion","filosofia","cv","preguntas"];
test("V1 only public content is exposed by default, without waiting for JavaScript",()=>{
 for(const id of inactive)assert.match(html,new RegExp('<section\\b[^>]*\\bid="'+id+'"[^>]*\\bhidden inert aria-hidden="true"'),"not retired: "+id);
 assert.match(css,/#main > section\[hidden\]/);
 assert.match(css,/body \.hub-music/);
 assert.match(html,/class="skip v97-skip"[^>]*hidden inert/);
});
test("V1 keeps the yoga experience as the only public app previews",()=>{
 const section=html.split('id="proyectos"')[1].split('<!-- V80')[0];
 assert.equal((section.match(/class="p26-project-card"/g)||[]).length,2);
 assert.equal((section.match(/class="yoga-offer-card"/g)||[]).length,4);
 assert.match(section,/En pausa/);
 assert.doesNotMatch(section,/Vortex|Ohana|Aigoritmo/);
});
test("V1 botanical lotus is smaller and has visible motion with accessibility fallback",()=>{
 assert.match(css,/width:clamp\(160px,19vw,248px\)!important/);
 assert.match(css,/width:clamp\(126px,34vw,185px\)!important/);
 for(const name of ["yogaLotusFloatV1","yogaLotusBloomV1","yogaLotusLeftV1","yogaLotusRightV1","yogaLotusGlowV1"])assert.ok(css.includes(name));
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/body\.quiet-mode #main #inicio\.hero/);
});
test("V1 has no CTA or visible skip route to the retired practice studio",()=>{
 assert.match(html,/href="#contacto" data-i18n="heroCtaPractice"/);
 assert.match(i18n,/heroCtaPractice: "Solicitar una sesión/);
 assert.match(i18n,/heroCtaPractice: "Plan a session/);
});
