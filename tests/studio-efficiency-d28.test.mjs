import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("D28: the practice clock remains authoritative when the tab sleeps",()=>{
 const js=read("practice-studio.js");
 assert.match(js,/document\.addEventListener\("visibilitychange"/);
 assert.match(js,/if \(document\.hidden\) stopTick\(\)/);
 assert.match(js,/if \(!document\.hidden\) ticker = setInterval\(tick, 200\)/);
 assert.match(js,/if \(element\.dataset\[key\] !== value\)/);
 assert.match(js,/setData\(guided, "studioStatus", snapshot\.status\)/);
 assert.ok(!js.includes("ticker = setInterval(render, 200)"));
 assert.equal((js.match(/new Clock\(/g)||[]).length,1);
});
test("D28: accessible names are translated and motion safety cannot be removed",()=>{
 const js=read("practice-studio.js"),html=read("index.html");
 for(const str of ["Breathing pace","Ritmo de respiración","Meditation style","Tipo de meditación"])
  assert.ok(js.includes(str));
 assert.match(html,/data-meditation-style="silent"/);
 assert.match(html,/data-breath-pattern="free"/);
 for(const css of ["yy-studio-breath-d26.css","yy-studio-meditation-d27.css"]){
  assert.match(read(css),/prefers-reduced-motion/);
 }
});
