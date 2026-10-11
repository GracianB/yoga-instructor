import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("V80 has three truthful, native routes with actual connected sections",()=>{
 const h=read("index.html"),js=read("visitor-gateway-v80.js");
 assert.ok(h.includes('id="orientacion"'));assert.equal((h.match(/data-v80-route="/g)||[]).length,3);
 for(const section of ["demostracion","instructor-flow","preguntas","trayectoria","casos","cv","programa","v76-enquiry"]){
  assert.ok(h.includes('id="'+section+'"'),"Broken V80 route to #"+section);
  assert.ok(js.includes('"#'+section+'"'),"Missing route in navigation model: "+section);
 }
 for(const name of ["practice","studio","teams"])assert.ok(js.includes(name+':{title:'),"Route "+name);
 assert.match(js,/setAttribute\("aria-pressed"/);assert.match(js,/createElement\("a"\)/);assert.match(js,/a\.href=href/);
 assert.match(js,/prepareCorporateContext/);
 assert.match(js,/input\.click\(\)/);
});

test("V80 release completeness and no preference collection",()=>{
 const h=read("index.html"),js=read("visitor-gateway-v80.js"),css=read("visitor-gateway-v80.css"),build=read("tools/build.mjs");
 for(const a of ["visitor-gateway-v80.css","visitor-gateway-v80.js"]){assert.ok(h.includes("./"+a));assert.ok(build.includes("'"+a+"'"))}
 for(const forbidden of ["fetch(","XMLHttpRequest","sendBeacon","localStorage","sessionStorage","document.cookie"])assert.ok(!js.includes(forbidden));
 for(const property of ["focus-visible","prefers-reduced-motion:reduce","max-width:620px"])assert.ok(css.includes(property));
 assert.ok(h.indexOf('id="orientacion"')<h.indexOf('id="atlas"'));
});

test("V80 multi-version system is discoverable without duplicated IDs or phantom assets",()=>{
 const h=read("index.html");
 const required=["orientacion","atlas","portfolio","casos","programa","demostracion","trayectoria","experiencia","cv","preguntas","contacto","v76-enquiry","instructor-flow"];
 for(const id of required){const count=(h.match(new RegExp('id="'+id+'"','g'))||[]).length;assert.equal(count,1,"Duplicate or missing #"+id)}
 const expectedAssets=[
 "credential-ledger-v77.js","credential-ledger-v77.css",
 "professional-demo-v78.js","professional-demo-v78.css",
 "discoverability-v79.js","discoverability-v79.css",
 "visitor-gateway-v80.js","visitor-gateway-v80.css"
 ];
 const build=read("tools/build.mjs");
 for(const name of expectedAssets)assert.ok(build.includes("'"+name+"'"),"Pages missing "+name);
 assert.ok(h.includes('href="#contacto"'));assert.ok(h.includes('href="#instructor-flow"'));
});
