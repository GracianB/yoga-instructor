import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V79 FAQ is public content, directly accessible and traceable to source text",()=>{
const h=read("index.html"),js=read("discoverability-v79.js");
assert.ok(h.includes('id="preguntas"'));assert.ok(h.includes('id="v79-faq-schema"'));
assert.equal((h.match(/data-v79-faq="/g)||[]).length,6);
for(const id of ["services","levels","locations","teams","documents","privacy"])assert.ok(js.includes(id+':["')||js.includes(id+':["'));
for(const topic of ["Murcia","sin promesas","datos","trabajas"])assert.ok(h.toLowerCase().includes(topic.toLowerCase()));
assert.match(js,/"@type":"FAQPage"/);assert.match(js,/"@type":"Question"/);
assert.match(js,/querySelectorAll\("\[data-v79-faq\]"\)/);
});
test("V79 metadata updates in ES/EN and follows displayed answers",()=>{
const js=read("discoverability-v79.js"),h=read("index.html"),sitemap=read("sitemap.xml");
for(const selector of ["description","og:title","og:description","og:locale","twitter:title","twitter:description"])assert.ok(js.includes(selector),selector);
assert.ok(js.includes("Object.values(content.faq).map"));
assert.ok(js.includes("new MutationObserver"));
assert.ok(h.includes('meta name="twitter:description"'));
assert.ok(sitemap.includes("<lastmod>2026-10-11</lastmod>"));
assert.ok(read("robots.txt").includes("Sitemap:"));
assert.ok(!js.includes("fetch("));
});
test("V79 audited release bundles FAQ script, CSS, and focus-visible layout",()=>{
const h=read("index.html"),b=read("tools/build.mjs"),css=read("discoverability-v79.css");
for(const asset of ["discoverability-v79.css","discoverability-v79.js"]){assert.ok(h.includes("./"+asset));assert.ok(b.includes("'"+asset+"'"))}
assert.match(css,/:focus-visible/);assert.match(css,/@media\(max-width:450px\)/);
});
