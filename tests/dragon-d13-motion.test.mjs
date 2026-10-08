import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),art=read('yin-yang-art.js'),guide=read('flow-guide.js'),
 motion=read('yy-asana-motion.js'),css=read('yy-dragon-d13.css'),build=read('tools/build.mjs');
const render=()=>{const context={window:{}};runInNewContext(art,context,{timeout:1200});return context.window.YIN_YANG_ART.markup();};
test('D13 assets: CSS last, art and motion cache-busted, public bundle complete',()=>{
 assert.ok(html.indexOf('yy-dragon-d13.css')>html.indexOf('yy-dragon-d12.css'));
 assert.match(html,/yy-dragon-d13\.css\?v=d13-1/);
 assert.match(html,/yin-yang-art\.js\?v=phase-d16-1/);
 assert.match(html,/flow-guide\.js\?v=d16-1/);
 assert.match(html,/yy-asana-motion\.js\?v=d14-1/);
 assert.match(build,/'yy-dragon-d13\.css'/);
 assert.ok(css.length<8500);
});
test('D13 cat/cow tail is physically authored, shorter and not a squeezed giant coil',()=>{
 const svg=render();
 const classes=[...svg.matchAll(/class="([^"]+)"/g)].map(x=>x[1].split(' '));
 assert.equal(classes.filter(x=>x.includes('yy-d13-table-tail')).length,1);
 assert.equal(classes.filter(x=>x.includes('yy-d12-tail-plume')).length,10);
 assert.equal(classes.filter(x=>x.includes('yy-d12-tail-shell')).length,10);
 assert.equal((svg.match(/class="yy-eye-closed yy-eye-/g)||[]).length,20);
 assert.equal((svg.match(/class="yy-d12-unicorn-core"/g)||[]).length,10);
 assert.equal((svg.match(/class="yy-paw-group"/g)||[]).length,40);
 assert.match(art,/M-24-10C2-25 34-30 58-16/);
 assert.match(art,/const table=p\.kind==="table"/);
 assert.match(art,/table\?\.82/);
 assert.match(css,/yy-pose-table .yy-d13-table-tail .yy-d12-tail-plume/);
});
test('D13 cat/cow animation pivots at hip and cap is 1.3°, not 7°',()=>{
 assert.match(motion,/fmt\(-curve\*1\.3\)\+" 461 238/);
 assert.match(motion,/fmt\(curve\*4\.2\)\+" 223 236/);
 assert.doesNotMatch(motion,/curve\*7\)\+" 461 238/);
 assert.match(motion,/clock\.status==="idle"/);
 assert.match(motion,/clock\.status==="paused"/);
});
test('D13 cinematic crossfade never leaves stage vacant, is interrupt-safe',()=>{
 assert.match(guide,/old\.classList\.add\("is-leaving"\)/);
 assert.match(guide,/next\.classList\.add\("is-current","is-entering"\)/);
 assert.match(guide,/await wait\(34\)/);
 assert.match(guide,/await wait\(540\)/);
 assert.match(guide,/if\(mine!==epoch\)return/);
 assert.doesNotMatch(guide,/await wait\(220\)/);
 assert.match(css,/\.yy-pose\.is-entering/);
 assert.match(css,/\.yy-pose\.is-leaving/);
 assert.match(css,/cubic-bezier\(\.22,\.61,\.36,1\)/);
 assert.doesNotMatch(css,/requestAnimationFrame|setInterval|@import|filter:blur/);
});
test('D13 honors pause, quiet mode and OS reduced motion',()=>{
 assert.match(css,/animation-play-state:paused!important/);
 assert.match(css,/body\.quiet-mode/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/yy-pose-savasana .yy-d12-tail-plume/);
 assert.match(css,/yy-pose-tree\.is-current .yy-tail-motion/);
});
