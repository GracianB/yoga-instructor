import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html');
const js=read('studio-unified-v66.js');
const lib=read('studio-asana-library.js');
const css=read('yy-unified-practice-v66.css');
const build=read('tools/build.mjs');
const nila=read('movement-guardian-v37.js');
const breath=read('studio-breath-dragon.js');
const uma=read('studio-meditation-guardian-v42.js');

test('V66: explicit movement selector is accessible and defaults to guided sequence',()=>{
 assert.match(html,/data-movement-view="sequence" aria-pressed="true"/);
 assert.match(html,/data-movement-view="library" aria-pressed="false"/);
 assert.match(html,/id="instructor-flow" data-movement-view="sequence"/);
 assert.match(js,/workspace\.append\(sequence,guided,gallery\)/);
 assert.match(js,/aria-controls/);
 assert.match(lib,/root\.dataset\.movementView\|\|"sequence"/);
});

test('V66: three practice modes keep one room and no new timers',()=>{
 assert.match(css,/grid-template-areas:"status art"/);
 assert.match(css,/\.studio-guided:not\(\[hidden\]\)/);
 assert.match(css,/\.studio-library-body/);
 assert.doesNotMatch(js,/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
 assert.doesNotMatch(js,/\.cloneNode\(/);
});

test('V66: guardian eyes are readable lines, not filled pupils',()=>{
 assert.match(nila,/class="mg-eye mg-eye-line"/);
 assert.doesNotMatch(nila,/class="mg-pupil"/);
 assert.match(breath,/class="sd31-eye-lines"/);
 assert.match(uma,/class="uma-closed-eyes uma-eye-lines"/);
 assert.match(css,/\.mg-eye-line/);
});

test('V66: public deployment contains CSS and JS with versioned references',()=>{
 assert.match(html,/yy-unified-practice-v66\.css\?v=v66-1/);
 assert.match(html,/studio-unified-v66\.js\?v=v66-1/);
 for(const file of ['studio-unified-v66.js','yy-unified-practice-v66.css'])
   assert.ok(build.includes("'"+file+"'"),'Not bundled: '+file);
});
