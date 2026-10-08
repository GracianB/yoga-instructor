import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),build=read('tools/build.mjs'),
  art=read('yin-yang-art.js'),d11=read('yy-dragon-d11.css'),
  pages=read('tools/pages-smoke.mjs');

test('D11 ships after D10, busts art cache, and passes Pages stylesheet manifest',()=>{
 assert.ok(html.indexOf('yy-dragon-d11.css')>html.indexOf('yy-dragon-d10.css'));
 assert.match(html,/yy-dragon-d11\.css\?v=d11-1/);
 assert.match(html,/yin-yang-art\.js\?v=phase-d17-1/);
 assert.match(build,/'yy-dragon-d11\.css'/);
 assert.match(pages,/expectedIndex\.matchAll/);
 assert.match(pages,/\.\.\.declaredStylesheets/);
});

test('All ten authored phases define one deliberate aura focus',()=>{
 for(const phase of ['start','centering','breath','warmup','pose-1','transition','pose-2','cooldown','savasana','finish']){
  assert.match(d11,new RegExp('data-phase="'+phase+'"'));
 }
 assert.match(d11,/--d11-focus-x:31%/);
 assert.match(d11,/@media\(max-width:700px\)/);
 assert.match(d11,/--d11-focus-x:21%/);
});

test('New sculpture adds fine details without a forehead eye or bitmap artwork',()=>{
 for(const cls of ['yy-d11-horn-engraving','yy-d11-crest-engraving','yy-d11-cheek-engraving','yy-d11-beard-engraving']){
  assert.match(art,new RegExp(cls));
  assert.match(d11,new RegExp('\\.'+cls));
 }
 assert.match(art,/yy-eye-closed/);
 assert.doesNotMatch(art,/yy-eye-core|yy-eye-center|yy-eye-glint|yy-crown-mark/);
 assert.doesNotMatch(d11,/url\(['"]?https?:|\.png|\.jpg|\.gif|canvas/i);
});

test('Aurora follows real breath modes, not a new timer or whole-body transform',()=>{
 for(const phase of ['inhale','hold','exhale'])assert.match(d11,new RegExp('data-breath-step="'+phase+'"'));
 assert.match(d11,/yy-d11-inhale 4s/);
 assert.match(d11,/yy-d11-exhale 8s/);
 assert.match(d11,/animation-play-state:paused!important/);
 assert.match(d11,/prefers-reduced-motion:reduce/);
 assert.match(d11,/quiet-mode/);
 assert.match(d11,/pointer-events:none/);
 assert.doesNotMatch(d11,/setInterval|requestAnimationFrame|\.yy-character\s*\{/);
});
