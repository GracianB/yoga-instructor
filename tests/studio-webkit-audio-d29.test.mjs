import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const get=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("D29: WebKit playback tests must not wait for audio-driven RAF stability to pause",()=>{
 const browser=get("tests/browser/closure.spec.js");
 const section=browser.split("test('ritual persistence, breathing, quiet mode and audio controls'")[1]
   .split("test('blocked storage")[0];
 assert.match(section,/await page\.locator\('#audio-play'\)\.click\(\)/);
 assert.match(section,/await page\.locator\('#audio-play'\)\.evaluate\(button=>button\.click\(\)\)/);
 assert.match(section,/expect\.poll\(\(\) => page\.locator\('#focus-audio'\)\.evaluate\(audio => audio\.paused\)\)\.toBe\(true\)/);
});
test("D29: WebKit executes both partitions without oversubscribing the browser",()=>{
 const ci=get(".github/workflows/quality.yml");
 assert.match(ci,/--project=webkit --shard=1\/2 --workers=2/);
 assert.match(ci,/--project=webkit --shard=2\/2 --workers=2/);
});
