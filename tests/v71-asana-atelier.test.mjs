import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const library=require('../asana-library.js');
const guardian=read('movement-guardian-v37.js');
const gallery=read('studio-asana-library.js');
const css=read('yy-asana-atelier-v71.css');
const html=read('index.html');
const build=read('tools/build.mjs');

test('V71: twelve bilingual asanas each have setup, breath and release',()=>{
  assert.equal(library.poses.length,12);
  for(const pose of library.poses){
    assert.ok(pose.coaching,'Missing coaching for '+pose.id);
    for(const key of ['setup','breath','exit']){
      assert.equal(pose.coaching[key].length,2);
      assert.ok(pose.coaching[key].every(s=>s.length>25));
    }
    assert.equal(Object.isFrozen(pose.coaching),true);
    assert.equal(Object.isFrozen(pose),true);
  }
});

test('V71: same Nila rig gives a tangent-based palm and grounded feet',()=>{
  assert.match(guardian,/paw=\(xy,kind,index,curve,atHeart,poseKind\)=>/);
  assert.match(guardian,/const tip=sample\(parts\[parts\.length-1\],\.985\)/);
  assert.match(guardian,/vertical\|\|y>=346\?0/);
  assert.match(guardian,/mg-prayer-palm/);
  assert.match(guardian,/p\.kind==="downward"/);
  assert.match(guardian,/p\.hands\.map\(\(pt,i\)=>paw\(pt,"hand",i,p\.arms\[i\],joined,p\.kind\)\)/);
  assert.doesNotMatch(guardian,/setInterval\(|requestAnimationFrame\(/);
});

test('V71: the independent library shows three steps without changing the guided engine',()=>{
  for(const cls of ['studio-library-coaching','studio-library-steps','studio-library-step-label','studio-library-step-text'])
    assert.ok(gallery.includes(cls));
  assert.match(gallery,/\["setup","breath","exit"\]/);
  assert.match(gallery,/ArrowUp/);
  assert.match(gallery,/ArrowDown/);
  assert.match(gallery,/Home/);
  assert.match(gallery,/End/);
  assert.ok(read('flow-guide.js').includes('const phases=art.poses'));
});

test('V71: the coaching styles are bundled after V70, with no new animation timers',()=>{
  const v70=html.indexOf('yy-clock-legibility-v70.css?v=v70-1');
  const v71=html.indexOf('yy-asana-atelier-v71.css?v=v71-1');
  assert.ok(v70>=0&&v71>v70);
  assert.ok(build.includes("'yy-asana-atelier-v71.css'"));
  assert.match(css,/prefers-reduced-motion/);
  assert.doesNotMatch(css,/\@keyframes|animation-duration/);
});