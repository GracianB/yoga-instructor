import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const library=require('../asana-library.js');
const html=read('index.html'),build=read('tools/build.mjs');
const css=read('yy-guardian-identities-v67.css'),brand=read('studio-guardian-identities-v67.js');
const gallery=read('studio-asana-library.js');

test('V68 keeps ten guided phases while expanding independent library to twelve',()=>{
 assert.equal(library.poses.length,12);
 assert.equal(new Set(library.poses.map(p=>p.id)).size,12);
 assert.deepEqual(library.poses.slice(0,3).map(p=>p.id),['d24-mountain','d24-downward','d24-butterfly']);
 const groups=new Set(library.poses.map(p=>p.category||(
  ['mountain','downward'].includes(p.kind)?'standing':'seated')));
 for(const cat of ['standing','seated','restorative'])
  assert.ok(groups.has(cat),'Missing pose family '+cat);
 for(const p of library.poses){
  assert.equal(p.arms.length,2);
  assert.equal(p.legs.length,2);
  assert.equal(p.hands.length,2);
  assert.equal(p.feet.length,2);
  assert.ok(p.name.every(Boolean)&&p.cue.every(Boolean)&&p.support.every(Boolean));
  for(const n of [...p.body,...p.head.slice(0,4),...p.hands.flat(),...p.feet.flat()])
    assert.ok(Number.isFinite(n),'Non-finite pose geometry: '+p.id);
 }
 assert.ok(read('flow-guide.js').includes('const phases=art.poses'));
});

test('V68 filters twelve asanas, never instantiates a second timer',()=>{
 assert.match(gallery,/data-asana-filter/);
 assert.match(gallery,/data-library-pose/);
 assert.match(gallery,/filter!=="all"/);
 assert.match(gallery,/category\(p\)/);
 assert.doesNotMatch(gallery,/setInterval\(|requestAnimationFrame\(/);
 assert.match(read('movement-guardian-v37.js'),/v68-gratitude/);
});

test('V67 guardian-specific brand palettes, bilingual tone and real SVG artwork',()=>{
 for(const key of ['asanas','breath','meditation'])assert.ok(css.includes('data-studio-mode="'+key+'"'));
 for(const key of ['standing','seated','restorative'])assert.ok(gallery.includes(key));
 for(const name of ['NILA','UMA','DRAGÓN','DRAGON'])assert.ok(brand.includes(name));
 for(const cls of ['mg-forehead-mark','sd31-wing-shimmer','uma-lunar-thread'])
  assert.ok(css.includes(cls),'Style missing for '+cls);
 assert.doesNotMatch(brand,/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
});

test('V67 identity code and styles included in GitHub Pages with versioning',()=>{
 for(const [file,suffix] of [
  ['yy-guardian-identities-v67.css','v67-1'],
  ['studio-guardian-identities-v67.js','v67-1']]){
   assert.ok(build.includes("'"+file+"'"));
   assert.ok(html.includes(file+'?v='+suffix));
 }
});
