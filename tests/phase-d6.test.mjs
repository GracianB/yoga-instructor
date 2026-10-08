import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const css=read('yy-practice-d6.css');
const art=read('yin-yang-art.js');
const ui=read('instructor-ui.js');
test('D6 order and explicit start hierarchy',()=>{
  assert.ok(html.indexOf('yy-practice-d6.css')>html.indexOf('yy-guardian-soul.css'));
  assert.match(css,/data-flow-status="idle"\] \.flow-controls/);
  assert.match(css,/data-flow-status="running"\] \.flow-entry-actions/);
  assert.match(ui,/action === "next" && \(idle \|\| last \|\| paused\)/);
  assert.match(ui,/if \(poseLocked \|\| engine.status === "idle"/);
});
test('D6 guardian gaze is formed of actual irises and pupils without white eyes',()=>{
  assert.match(art,/class="yy-eye-core"/);
  assert.match(art,/yy-eye-center/);
  assert.match(art,/yy-eye-glint/);
  assert.match(art,/head:\[360,145,\.87,0,"soft"\]/);
  assert.match(art,/head:\[361,141,\.86,0,"soft"\]/);
  assert.doesNotMatch(art,/yy-eye-white/);
});
test('D6 stage has floral tones, responsive breakpoints and reduced motion',()=>{
  assert.match(css,/#cd9eaa/);
  assert.match(css,/rgba\(219,155,173/);
  assert.match(css,/@media\(max-width:600px\)/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});
