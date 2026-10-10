import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const studio=readFileSync(new URL("../practice-studio.js",import.meta.url),"utf8");

test("V47: all practice cards describe the correct three separate guardians before JavaScript hydration",()=>{
 const expected=[
  ["asanas","asanasDetail","Nila · 10 posturas Yin/Yang"],
  ["breath","breathDetail","Dragón sereno · a tu ritmo"],
  ["meditation","meditationDetail","Uma · guardiana lunar"]
 ];
 for(const [mode,key,caption] of expected){
  const button=html.match(new RegExp('<button[^>]+data-studio-mode="'+mode+'"[^>]*>([\\s\\S]*?)<\\/button>'))?.[1];
  assert.ok(button,"Missing "+mode+" button");
  assert.ok(button.includes('data-studio-copy="'+key+'">'+caption+"</small>"),
   "Incorrect initial accessible description for "+mode);
  assert.ok(studio.includes(key+': "'+caption+'"'),
   "Initial HTML and Spanish runtime copy must agree for "+mode);
 }
 assert.ok(!html.includes("10 fases · dragón Yin / Yang"),
  "Retired Movement copy must not call Nila a dragon");
 assert.equal((html.match(/data-studio-mode="(?:asanas|breath|meditation)"/g)||[]).length,3);
 assert.ok(html.includes('./practice-studio.js?v=v49-1'),
  "New guardian names must not be hidden by a stale JavaScript cache");
});
test("V47: English copy identifies each guardian without cloning their identity",()=>{
 for(const token of [
  'asanasDetail: "Nila · 10 Yin/Yang poses"',
  'breathDetail: "Calm dragon · at your pace"',
  'meditationDetail: "Uma · lunar guardian"'
 ])assert.ok(studio.includes(token),"English guardian copy missing: "+token);
 assert.ok(studio.includes('asanas: "Movement"'));
 assert.ok(studio.includes('breath: "Breathing"'));
 assert.ok(studio.includes('meditation: "Meditation"'));
});
