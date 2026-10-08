import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=file=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
test("D29: audio transport cannot be clicked before media event handlers exist",()=>{
 const html=read("index.html"),js=read("main.js"),e2e=read("tests/browser/closure.spec.js");
 assert.match(html,/<button[^>]+id="audio-play"[^>]*\bdisabled>/);
 const playListener=js.indexOf('audio.addEventListener("play"');
 const pauseListener=js.indexOf('audio.addEventListener("pause"');
 const enabled=js.indexOf('playBtn.disabled = false');
 const marked=js.indexOf('playBtn.dataset.audioReady = "true"');
 assert.ok(playListener>0 && pauseListener>playListener);
 assert.ok(marked>pauseListener && enabled>marked);
 assert.match(e2e,/toHaveAttribute\('data-audio-ready','true'\)/);
 assert.match(e2e,/await button\.click\(\)/);
});
