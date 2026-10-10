import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const art=read('yin-yang-art.js'),css=read('yy-dragon-d15.css'),
 html=read('index.html'),bundle=read('tools/build.mjs'),audit=read('tools/release-audit.mjs');
const scene=()=>{const c={window:{}};runInNewContext(art,c,{timeout:1800});return c.window.YIN_YANG_ART;};
const chunk=(svg,id)=>svg.match(new RegExp('<g data-pose="'+id+'"[\\s\\S]*?(?=<g data-pose="|</svg>)'))?.[0]||'';
const countClass=(svg,cls)=>[...svg.matchAll(/class="([^"]+)"/g)].filter(m=>m[1].split(/\s+/).includes(cls)).length;
test('D15: 10 faces, 40 shoulder/hip sockets, 40 grounded paw groups and unicorn horn',()=>{
 const svg=scene().markup();
 assert.equal(countClass(svg,'yy-d15-expression'),10);
 assert.equal(countClass(svg,'yy-d15-brow-gesture'),10);
 assert.equal(countClass(svg,'yy-d15-cheek-gesture'),10);
 assert.equal(countClass(svg,'yy-d15-socket'),40);
 assert.equal(countClass(svg,'yy-d15-socket-relief'),40);
 assert.equal(countClass(svg,'yy-d15-limb-unit'),40);
 assert.equal(countClass(svg,'yy-paw-group'),40);
 assert.equal(countClass(svg,'yy-d12-unicorn-core'),10);
 assert.equal(countClass(svg,'yy-eye-closed'),20);
 assert.equal(countClass(svg,'yy-d15-joint'),countClass(svg,'yy-d15-joint-fold'));
 assert.ok(countClass(svg,'yy-d15-joint')>=2,'Warrior bent knees and Tree knee folds');
 assert.doesNotMatch(svg,/NaN|Infinity|undefined/);
});
test('D15: precise support distribution across all ten yoga poses',()=>{
 const svg=scene().markup();
 const poses={start:4,centering:2,breath:2,warmup:4,'pose-1':2,transition:2,'pose-2':1,cooldown:4,savasana:4,finish:2};
 for(const [id,n] of Object.entries(poses)){
  const part=chunk(svg,id);
  assert.ok(part,id+' missing');
  assert.equal(countClass(part,'yy-stance-shadow'),n,id+' shade');
  assert.equal(countClass(part,'yy-d15-pressure-mark'),n,id+' pressure');
 }
 // No fake floor contact at extended hands of Warrior, Flow or Tree.
 for(const id of ['pose-1','transition','pose-2'])
  assert.ok(!chunk(svg,id).includes('class="yy-d15-pressure-mark" cx="155"'),id);
});
test('D15: every authored expression has two CLOSED eyes and no third-eye elements',()=>{
 const svg=scene().markup();
 const kinds={start:'closed',centering:'soft',breath:'soft',warmup:'open','pose-1':'focus',
  transition:'smile','pose-2':'focus',cooldown:'closed',savasana:'closed',finish:'smile'};
 for(const [id,kind] of Object.entries(kinds)){
  const p=chunk(svg,id);
  assert.equal(countClass(p,'yy-d15-expression-'+kind),1,id);
  assert.equal(countClass(p,'yy-eye-closed'),2,id);
  assert.equal(countClass(p,'yy-d15-brow-gesture'),1,id);
  assert.equal(countClass(p,'yy-d15-cheek-gesture'),1,id);
 }
 assert.doesNotMatch(svg,/yy-third-eye|yy-crown-mark|yy-eye-center/);
});
test('D15: pressure is purely optical, tracks crossfade, pauses correctly and respects stillness',()=>{
 assert.match(css,/\.yy-pose\.is-current .yy-d15-pressure-mark/);
 assert.match(css,/\.yy-pose\.is-leaving .yy-d15-pressure-mark/);
 assert.match(css,/\.yy-pose-tree\.is-current .yy-d15-pressure-mark/);
 assert.match(css,/\.yy-pose-savasana\.is-current .yy-d15-pressure-mark/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/body\.quiet-mode/);
 assert.match(css,/transform:none!important/);
 assert.doesNotMatch(css,/requestAnimationFrame|setInterval|filter:blur|translate[XY]\(|@import/);
});
test('D15: its version, bundle entry and budget are in SHA-verified Pages release',()=>{
 assert.match(html,/yy-dragon-d15\.css\?v=d15-1/);
 assert.match(html,/yin-yang-art\.js\?v=phase-d17-1/);
 assert.ok(html.indexOf('yy-dragon-d15.css')>html.indexOf('yy-dragon-d14.css'));
 assert.match(bundle,/'yy-dragon-d15\.css'/);
 const budgetLine=audit.split("\n").find(line=>line.includes("statSync('yy-dragon-d15.css').size <="));
 assert.ok(budgetLine, "yy-dragon-d15.css must retain a release size gate");
 assert.ok(Number(budgetLine.match(/size <= (\d+)/)?.[1])>=8000,"yy-dragon-d15.css growth budget must remain guarded");
 assert.ok(css.length<8000);
});
