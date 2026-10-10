import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const source=read('yin-yang-art.js'),css=read('yy-dragon-d17.css'),
 html=read('index.html'),build=read('tools/build.mjs'),audit=read('tools/release-audit.mjs');
const art=()=>{const ctx={window:{}};runInNewContext(source,ctx,{timeout:1700});return ctx.window.YIN_YANG_ART;};
const count=(s,n)=>[...s.matchAll(/class="([^"]+)"/g)].filter(m=>m[1].split(/\s+/).includes(n)).length;
test('D17 curves axillary and pelvic anatomy without losing any grounded contact',()=>{
 const svg=art().markup();
 assert.equal(count(svg,'yy-d17-root-blend'),40);
 assert.equal(count(svg,'yy-d17-attachment'),40);
 assert.equal(count(svg,'yy-d17-arm-attachment'),20);
 assert.equal(count(svg,'yy-d17-leg-attachment'),20);
 assert.equal(count(svg,'yy-paw-group'),40);
 assert.equal(count(svg,'yy-d12-unicorn-core'),10);
 assert.equal(count(svg,'yy-eye-closed'),20);
 assert.doesNotMatch(svg,/NaN|Infinity|undefined/);
 assert.match(source,/const attachments=\(p,type\)=>/);
 assert.doesNotMatch(source,/<ellipse rx="'\+major\+'"/);
});
test('D17 real reclining silhouettes do not use old rotated egg or wide-open forehead',()=>{
 const p=art().poses;
 for(const id of ['start','savasana']){
  const shape=p.find(x=>x.id===id);
  assert.ok(shape.body[3]<=42,id+' tall body');
  assert.ok(shape.head[3]<=-60,id+' head rests sideways');
  assert.ok(shape.feet.every(x=>x[1]>=325),id+' grounded legs');
 }
 assert.match(source,/horizontal\?/);
 assert.match(source,/rx\*\.91/);
 assert.match(css,/yy-torso:is\(\[data-kind="rest"\],\[data-kind="savasana"\]\)/);
});
test('D17 lively Flow is asymmetric and two planted feet stay unchanged',()=>{
 const flow=art().poses.find(x=>x.id==='transition');
 assert.equal(flow.kind,'flow');
 assert.equal(flow.head[4],'smile');
 assert.deepEqual(Array.from(flow.feet,x=>Array.from(x)),[[240,378],[520,381]]);
 assert.ok(flow.hands[0][1]<120&&flow.hands[1][1]<200);
 assert.match(css,/@keyframes yy-d17-flow-gesture/);
 assert.match(css,/transform-origin:365px 200px/);
 assert.match(css,/animation-play-state:paused!important/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/quiet-mode/);
});
test('D17 release keeps mode foundation and versioned files with budget',()=>{
 assert.match(html,/yy-dragon-d17\.css\?v=d17-1/);
 assert.match(html,/yin-yang-art\.js\?v=phase-d17-1/);
 assert.ok(html.indexOf('yy-dragon-d17.css')>html.indexOf('yy-dragon-d16.css'));
 assert.match(build,/'yy-dragon-d17\.css'/);
 const limit=Number(audit.match(/yy-dragon-d17\\.css\'\\)\\.size <= (\\d+)/)?.[1]);
 assert.ok(limit>=7000, "yy-dragon-d17.css must have a tested, nonzero growth budget");
 assert.ok(css.length<7000);
 assert.match(build,/'practice-pathways\.js'/);
});

test('D17 instructor controls resync when first pose-ready event precedes UI listeners',()=>{
 const ui=read('instructor-ui.js');
 assert.match(ui,/poseLocked=!guideReady \|\| guideReady\.dataset\.ready!=="true"/);
 assert.match(html,/instructor-ui\.js\?v=d20-1-d25-1/);
});
