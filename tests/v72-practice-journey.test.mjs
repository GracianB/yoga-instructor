import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('V72: the Asana Book is a separate chapter before all guided modes',()=>{
 const html=read('index.html'),library=read('studio-asana-library.js');
 const modes=read('studio-unified-v66.js');
 assert.doesNotMatch(html,/class="studio-v66-submodes"/);
 assert.match(library,/root\.before\(section\)/);
 assert.match(library,/studio-asana-book/);
 assert.match(library,/studio-book-practice-link/);
 assert.match(library,/section\.hidden=false/);
 assert.match(modes,/workspace\.append\(sequence,guided\)/);
 assert.doesNotMatch(modes,/workspace\.append\(sequence,guided,gallery\)/);
});

test("V72: the dragon's geometry follows the existing studio clock without an independent oscillator",()=>{
 const clock=read('practice-studio.js'),dragon=read('studio-breath-dragon.js'),css=read('yy-practice-journey-v72.css');
 for(const property of ['--studio-guardian-wing','--studio-body-width','--studio-head-lift','--studio-rib-expansion'])
  assert.ok(clock.includes(property),'Missing shared phase property: '+property);
 assert.match(dragon,/class="sd31-head-unit"/);
 assert.match(css,/\.sd31-head-unit/);
 assert.match(css,/\.sd31-body/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/body\.quiet-mode/);
 assert.doesNotMatch(dragon,/setInterval\(|requestAnimationFrame\(/);
});

test('V72: Uma focus guidance has three distinct anchors with existing clock landmarks',()=>{
 const presence=read('studio-presence-v72.js'),clock=read('practice-studio.js');
 assert.match(presence,/const copy=/);
 for(const x of ['breath','body','space','arrive','anchor','return','complete','silent'])
  assert.ok(presence.includes(x),'Missing meditation anchor '+x);
 assert.match(clock,/setData\(guided, "meditationStep", meditationStep\)/);
 assert.match(clock,/snapshot\.progress<\.18/);
 assert.match(clock,/snapshot\.progress<\.78/);
 assert.doesNotMatch(presence,/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
});

test('V72: stylesheet and focus script deployed in Pages',()=>{
 const html=read('index.html'),build=read('tools/build.mjs');
 for(const item of ['yy-practice-journey-v72.css','studio-presence-v72.js']){
   assert.ok(build.includes("'"+item+"'"),'Missing release asset '+item);
   assert.ok(html.includes(item+'?v=v72-1'),'Missing HTML asset '+item);
 }
 const css=read('yy-practice-journey-v72.css');
 assert.match(css,/#studio-asana-library\.studio-asana-book/);
 assert.match(css,/#instructor-flow \.studio-presence-journey/);
});