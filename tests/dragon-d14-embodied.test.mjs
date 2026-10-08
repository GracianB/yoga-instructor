import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const art=read('yin-yang-art.js'),motion=read('yy-asana-motion.js'),
 css=read('yy-dragon-d14.css'),html=read('index.html'),
 bundle=read('tools/build.mjs'),audit=read('tools/release-audit.mjs');
const render=()=>{const ctx={window:{}};runInNewContext(art,ctx,{timeout:1500});return ctx.window.YIN_YANG_ART;};
test('D14: ten authored necks, rib engravings, scapula and living unicorn signature',()=>{
 const svg=render().markup();
 const classes=[...svg.matchAll(/class="([^"]+)"/g)].map(x=>x[1].split(/\s+/));
 for(const part of ['yy-d14-neck-bridge','yy-d14-rib-cage','yy-d14-scapula','yy-d14-shoulder-blade','yy-d14-breath-line'])
   assert.equal(classes.filter(list=>list.includes(part)).length,10,part);
 assert.equal(classes.filter(list=>list.includes('yy-d14-neck-table')).length,1);
 assert.equal((svg.match(/class="yy-paw-group"/g)||[]).length,40);
 assert.equal((svg.match(/class="yy-eye-closed yy-eye-/g)||[]).length,20);
 assert.equal((svg.match(/class="yy-d12-unicorn-core"/g)||[]).length,10);
 assert.doesNotMatch(svg,/NaN|Infinity|undefined/);
});
test('D14: cat/cow neck is deformed by the SAME clock, not another loop',()=>{
 assert.match(motion,/const neck=warmup\?\.querySelector\("\.yy-d14-neck-table"\)/);
 assert.match(motion,/if\(neck\)neck\.setAttribute\("d"/);
 assert.match(motion,/244\+curve\*5\.8/);
 assert.match(motion,/278\+curve\*5\.8/);
 assert.match(motion,/clock\.status==="idle"/);
 assert.match(motion,/neck\?\.setAttribute\("d","M265 244/);
 assert.match(motion,/fmt\(-curve\*1\.3\)\+" 461 238/);
 assert.equal((motion.match(/requestAnimationFrame/g)||[]).length,0);
});
test('D14: Flow feet get 2 ground contacts; Tree one and Cat/Cow four',()=>{
 const svg=render().markup();
 const pick=id=>svg.match(new RegExp('<g data-pose="'+id+'"[\\s\\S]*?(?=<g data-pose="|</svg>)'))?.[0]||'';
 const counts={warmup:4,'pose-1':2,transition:2,'pose-2':1};
 for(const [id,expected] of Object.entries(counts))
   assert.equal((pick(id).match(/class="yy-stance-shadow"/g)||[]).length,expected,id);
});
test('D14: whole-body float removed in grounded/supine asanas; Tree rotates around foot',()=>{
 for(const shape of ['rest','seat','breath','flow','child','savasana'])
  assert.ok(css.includes('.yy-pose-'+shape+'.is-current .yy-character'),shape);
 assert.match(css,/transform-origin:353px 387px/);
 assert.match(css,/animation:yy-d14-tree-root 11s/);
 assert.match(css,/@keyframes yy-d14-lungs/);
 assert.match(css,/@keyframes yy-d14-inhale/);
 assert.match(css,/@keyframes yy-d14-exhale/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/animation-play-state:paused!important/);
});
test('D14: latest assets are present in Pages and size-budgeted',()=>{
 assert.match(html,/yy-dragon-d14\.css\?v=d14-1/);
 assert.match(html,/yin-yang-art\.js\?v=phase-d16-1/);
 assert.match(html,/yy-asana-motion\.js\?v=d14-1/);
 assert.ok(html.indexOf('yy-dragon-d14.css')>html.indexOf('yy-dragon-d13.css'));
 assert.match(bundle,/'yy-dragon-d14\.css'/);
 assert.match(audit,/yy-dragon-d14\.css/);
 assert.match(audit,/yy-asana-motion\.js'\)\.size <= 7000/);
 assert.ok(css.length<=8500);
});
