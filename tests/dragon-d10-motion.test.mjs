import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const build=read('tools/build.mjs');
const d9=read('yy-dragon-d9.css');
const d10=read('yy-dragon-d10.css');
const art=read('yin-yang-art.js');
const motion=read('yy-asana-motion.js');

test('D10 is loaded after D9 and included in the guarded Pages bundle',()=>{
 assert.ok(html.indexOf('yy-dragon-d10.css')>html.indexOf('yy-dragon-d9.css'));
 assert.match(build,/'yy-dragon-d10\.css'/);
 assert.match(build,/Missing stylesheet from Pages bundle/);
});
test('D10 breath follows the real inhale-hold-exhale event, not an independent timer',()=>{
 assert.match(motion,/root\.dataset\.breathStep=detail\?\.phase\|\|"idle"/);
 for(const part of ['inhale','hold','exhale']){
  assert.match(d10,new RegExp('data-breath-step="'+part+'"'));
 }
 assert.match(d10,/yy-d10-inhale 4s/);
 assert.match(d10,/yy-d10-exhale 8s/);
 assert.match(d10,/data-breath-step="hold"[\s\S]*?animation:none!important/);
});
test('pause retains the same D9 timeline and freezes all active figure animation',()=>{
 assert.match(d9,/data-asana-state="paused"\]\) \.yy-pose\.is-current \.yy-dragon-whisker/);
 assert.match(d9,/data-asana-state="paused"\]\) \.yy-pose\.is-current \.yy-dragon-bridge-layer/);
 assert.match(d10,/data-asana-state="paused"\] \.yy-pose\.is-current \*/);
 assert.match(d10,/animation-play-state:paused!important/);
});
test('D10 preserves anatomy, closed eyes, savasana rest, quiet and reduced motion',()=>{
 assert.match(art,/yy-eye-closed/);
 assert.doesNotMatch(art,/yy-eye-core|yy-eye-center|yy-eye-glint|yy-crown-mark/);
 assert.match(d10,/data-phase="savasana"/);
 assert.match(d10,/data-asana-state="reduced"/);
 assert.match(d10,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(d10,/\.yy-character\s*\{\s*transform:/);
});
