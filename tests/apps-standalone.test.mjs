import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const require=createRequire(import.meta.url);
const catalog=require("../asana-library.js");
const domain=require("../asana-domain.js").project(catalog);
const Clock=require("../studio-clock.js").PracticeClock;

test("two independent previews do not alter the professional portfolio",()=>{
 const yoga=read("apps/yoga-practice/index.html"),book=read("apps/asana-book/index.html"),site=read("index.html");
 assert.match(yoga,/<main id="practice-app"/);
 assert.match(book,/<main id="asana-app"/);
 assert.match(yoga,/src="\.\.\/\.\.\/studio-clock.js"/);
 assert.match(book,/src="\.\.\/\.\.\/asana-domain.js"/);
 assert.doesNotMatch(site,/href="\.\/apps\/(?:yoga-practice|asana-book)\//);
 assert.equal((site.match(/class="p26-project-card"/g)||[]).length,2);
 assert.match(site,/En construcción/);
});
test("twelve original asanas expose separate teaching and valid authored artwork",()=>{
 assert.equal(catalog.poses.length,12);
 assert.equal(domain.lessons.length,12);
 for(const p of domain.lessons){
  for(const key of ["name","cue","support"])assert.equal(p[key].length,2,p.id);
  for(const key of ["setup","breath","exit"])assert.equal(p.coaching[key].length,2,p.id);
  const d=domain.drawing(p.id);
  for(const key of ["arms","legs","hands","feet"])assert.equal(d[key].length,2,p.id);
 }
});
test("independent scripts reuse domain/timer but not old studio or portfolio bundles",()=>{
 assert.match(read("apps/yoga-practice/app.js"),/YOGA_STUDIO_CLOCK/);
 assert.match(read("apps/yoga-practice/app.js"),/visibilitychange/);
 assert.match(read("apps/asana-book/app.js"),/YOGA_ASANA_DOMAIN/);
 assert.match(read("apps/asana-book/app.js"),/createElementNS/);
 for(const name of ["yoga-practice","asana-book"]){
  const html=read("apps/"+name+"/index.html");
  assert.match(html,/name="robots" content="noindex,nofollow"/);
  assert.doesNotMatch(html,/<script[^>]+src="(?:\.\/|\.\.\/)*(?:sanctuary-experience|practice-studio|studio-asana-library|main)\.js"/);
 }
});
test("shared design supports mobile, themes and accessible reduced motion",()=>{
 const css=read("apps/shared/app.css");
 for(const rule of ['body[data-theme="dark"]','@media(max-width:600px)','@media(prefers-reduced-motion:reduce)','.asana-art','.practice-visual'])assert.ok(css.includes(rule),rule);
});
test("clock starts, pauses, resumes and finishes with accurate elapsed time",()=>{
 let now=0;const c=new Clock(()=>now);c.start(5);now=15000;
 assert.equal(c.snapshot().remainingMs,285000);
 c.pause();now=80000;assert.equal(c.snapshot().elapsedMs,15000);
 c.resume();now=365000;assert.equal(c.snapshot().status,"finished");
 assert.equal(c.snapshot().remainingMs,0);
 c.reset(10);assert.equal(c.snapshot().remainingMs,600000);
});
test("build ships previews separately and retains production portfolio allowlist",()=>{
 const build=read("tools/build.mjs");
 assert.match(build,/cp\("apps","dist\/apps",\{recursive:true\}\)/);
 assert.match(build,/stripRetiredPublicScripts/);
 assert.match(build,/const publicScripts=new Set\(\["runtime.js","boot.js","i18n.js","main.js","p2-navigation.js"\]\)/);
});
