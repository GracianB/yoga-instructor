import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const css=read('yy-clock-legibility-v70.css'),index=read('index.html'),manifest=read('tools/build.mjs');
test('V70 explicitly fixes all real clock labels and timing values',()=>{
 for(const marker of ['flowClock','flow-phase-timing small > span','flow-phase-timing small > b','flow-session-time','flowSequence'])
  assert.ok(css.includes(marker),'Missing clock accessibility selector: '+marker);
 assert.match(css,/color:var\(--console-label\)!important/);
 assert.match(css,/opacity:1!important/);
 assert.match(css,/max-width:450px/);
});
test('V70 follows V69 in Pages CSS order and never runs an extra timer',()=>{
 const v69=index.indexOf('yy-console-legibility-v69.css?v=v69-1');
 const v70=index.indexOf('yy-clock-legibility-v70.css?v=v70-1');
 assert.ok(v69!==-1 && v70>v69);
 assert.ok(manifest.includes("'yy-clock-legibility-v70.css'"));
 assert.doesNotMatch(css,/setInterval\(|requestAnimationFrame\(/);
});