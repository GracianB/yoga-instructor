import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),final=read("yoga-public-final.css"),build=read("tools/build.mjs"),deploy=read(".github/workflows/deploy.yml");
test("Public stylesheet is LAST and forces near-fullscreen hero",()=>{
 const links=[...html.matchAll(/<link rel="stylesheet" href="\.\/[^"]+"/g)].map(x=>x[0]);
 assert.match(links.at(-1),/yoga-public-final\.css/);
 assert.match(final,/min-height:calc\(92svh - var\(--header\)\)/);
 assert.match(final,/min-height:calc\(90svh - var\(--header\)\)/);
 assert.match(final,/width:clamp\(120px,14vw,190px\)/);
 assert.match(final,/width:clamp\(98px,27vw,143px\)/);
});
test("Published index strips whole hidden sections, not just CSS-hiding a live application",()=>{
 assert.match(build,/function stripRetiredSections/);
 assert.match(build,/PUBLIC_PORTFOLIO_ONLY/);
 assert.match(build,/Retired public module still present/);
 assert.match(html,/id="instructor-flow"[^>]*hidden inert aria-hidden="true"/);
});
test("Direct verified SHA release is triggered by push main without waiting for browser shards",()=>{
 assert.match(deploy,/push:\s*\n\s*branches: \[main\]/);
 assert.match(deploy,/github\.event\.workflow_run\.head_sha \|\| github\.sha/);
 assert.match(deploy,/npm run quality/);
 assert.match(deploy,/npm run build/);
 assert.match(deploy,/pages-smoke\.mjs --root=dist/);
});