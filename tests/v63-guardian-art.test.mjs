import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const movement=read('movement-guardian-v37.js');
const breath=read('studio-breath-dragon.js');
const meditation=read('studio-meditation-guardian-v42.js');
const index=read('index.html');
const build=read('tools/build.mjs');
const css=read('yy-guardian-art-v63.css');

test('V63 Nila: single filled cervical volume retains authored pose endpoints',()=>{
 assert.match(movement,/const left=\[\],right=\[\]/);
 assert.match(movement,/const topX=lateral\?x-rx\*\.63:x/);
 assert.match(movement,/const endX=lateral\?hx\+46\*scale:hx/);
 assert.match(movement,/return '<path class="mg-neck" d="M'/);
 assert.match(movement,/right\.reverse\(\)\.join\(' L'\)\+'Z'/);
 assert.match(css,/\.movement-guardian \.mg-neck\{/);
 assert.doesNotMatch(movement,/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
});

test('V63 breathing companion: existing breath core and clock remain sole source',()=>{
 assert.match(breath,/class="sd31-breath-core"/);
 assert.match(breath,/class="sd31-breath-line"/);
 assert.match(breath,/class="sd31-wings"/);
 assert.match(breath,/class="sd31-snout-bridge"/);
 assert.doesNotMatch(breath,/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
});

test('V63 Uma: both arms modelled as volumes, still meditative',()=>{
 assert.match(meditation,/class="uma-arm-left"/);
 assert.match(meditation,/class="uma-arm-right"/);
 assert.match(meditation,/class="uma-closed-eyes"/);
 assert.match(meditation,/class="uma-moon"/);
 assert.doesNotMatch(meditation,/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
});

test('V63 art stylesheet must be last guardian layer and bundled in Pages',()=>{
 const old=index.indexOf('yy-guardian-finish-v58.css');
 const next=index.indexOf('yy-guardian-art-v63.css?v=v63-1');
 assert.ok(old>=0&&next>old);
 assert.ok(build.includes("'yy-guardian-art-v63.css'"));
 assert.ok(css.includes('prefers-reduced-motion:reduce'));
 assert.ok(css.includes('body.quiet-mode'));
});
