import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
const require=createRequire(import.meta.url);
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const art=read('yin-yang-art.js'),css=read('yy-dragon-d16.css'),
 html=read('index.html'),guide=read('flow-guide.js'),
 bundle=read('tools/build.mjs'),audit=read('tools/release-audit.mjs');
const {YOGA_FLOW}=(()=>{const obj=require('../flow-engine.js');return {YOGA_FLOW:obj}})();
const pathways=require('../practice-pathways.js');
const svg=()=>{const c={window:{}};runInNewContext(art,c,{timeout:1800});return c.window.YIN_YANG_ART.markup()};
const cls=(s,c)=>[...s.matchAll(/class="([^"]+)"/g)].filter(m=>m[1].split(/\s+/).includes(c)).length;
test('D16: wings and anatomical meridian rendered for each of ten poses',()=>{
 const view=svg();
 assert.equal(cls(view,'yy-d16-wings'),10);
 assert.equal(cls(view,'yy-d16-wing'),20);
 assert.equal(cls(view,'yy-d16-wing-membrane'),20);
 assert.equal(cls(view,'yy-d16-wing-vein'),20);
 assert.equal(cls(view,'yy-d16-wing-struts'),20);
 assert.equal(cls(view,'yy-d16-body-meridian'),10);
 assert.equal(cls(view,'yy-d16-meridian-line'),10);
 assert.equal(cls(view,'yy-d16-breath-arch'),10);
 assert.equal(cls(view,'yy-d12-unicorn-core'),10);
 assert.equal(cls(view,'yy-eye-closed'),20);
 assert.equal(cls(view,'yy-paw-group'),40);
 assert.equal((view.match(/id="yy-d16-wing"/g)||[]).length,1);
 assert.doesNotMatch(view,/NaN|Infinity|undefined/);
});
test('D16: wing geometry folds in grounded phases',()=>{
 const view=svg();
 const get=id=>{
  const offset=view.indexOf('<g data-pose="'+id+'"');
  if(offset<0)return '';
  const next=view.indexOf('<g data-pose="',offset+13);
  return view.slice(offset,next<0?undefined:next);
 };
 for(const id of ['start','warmup','cooldown','savasana'])
   assert.match(get(id),/data-fold="rest"/,id);
 for(const id of ['centering','breath','pose-1','transition','pose-2','finish'])
   assert.match(get(id),/data-fold="raised"/,id);
});
test('D16: cinematic transitions obey one existing flow clock and motion safety',()=>{
 assert.match(guide,/stage\.dataset\.passage=passageFor\(phase\)/);
 assert.match(guide,/return "ground"/);
 assert.match(guide,/return "breath"/);
 assert.match(guide,/return "balance"/);
 assert.match(guide,/if\(mine!==epoch\)return/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/data-asana-state="paused"/);
 assert.match(css,/body\.quiet-mode/);
 assert.match(css,/data-breath-step="inhale"/);
 assert.match(css,/data-breath-step="exhale"/);
 assert.doesNotMatch(css,/setInterval|requestAnimationFrame|filter:blur/);
});
test('D16: session modes are independent data, only asanas active',()=>{
 assert.deepEqual(Array.from(pathways.ids),['asanas','breath','meditation']);
 assert.equal(pathways.isAvailable('asanas'),true);
 assert.equal(pathways.isAvailable('breath'),false);
 assert.equal(pathways.isAvailable('meditation'),false);
 const yoga=pathways.get('asanas');
 assert.deepEqual(Array.from(yoga.phases,x=>x.id),Array.from(YOGA_FLOW.PHASES,x=>x.id));
 assert.deepEqual(Array.from(yoga.phases,x=>x.seconds),Array.from(YOGA_FLOW.PHASES,x=>x.durationSeconds));
 assert.deepEqual(Array.from(pathways.get('breath').phases.slice(1,4),x=>x.seconds),[4,7,8]);
 assert.ok(pathways.get('meditation').phases.length>2);
 assert.equal(pathways.get('__unknown'),null);
 assert.ok(Object.isFrozen(yoga));
});
test('D16: Pages contains all versioned visual files and future pathway data',()=>{
 assert.match(html,/yy-dragon-d16\.css\?v=d16-1/);
 assert.match(html,/yin-yang-art\.js\?v=phase-d17-1/);
 assert.match(html,/flow-guide\.js\?v=d16-1/);
 assert.match(bundle,/'yy-dragon-d16\.css'/);
 assert.match(bundle,/'practice-pathways\.js'/);
 const limit=Number(audit.match(/yy-dragon-d16\\.css\'\\)\\.size <= (\\d+)/)?.[1]);
 assert.ok(limit>=7000, "yy-dragon-d16.css must have a tested, nonzero growth budget");
 assert.ok(html.indexOf('yy-dragon-d16.css')>html.indexOf('yy-dragon-d15.css'));
 assert.ok(css.length<7000);
});
