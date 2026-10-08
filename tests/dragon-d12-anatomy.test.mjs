import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html'),art=read('yin-yang-art.js'),
  css=read('yy-dragon-d12.css'),build=read('tools/build.mjs');
const render=()=>{
 const context={window:{}};
 runInNewContext(art,context,{timeout:1500});
 return context.window.YIN_YANG_ART;
};
test('D12 release: latest assets deployed after D11, uncached and budgeted',()=>{
 assert.ok(html.indexOf('yy-dragon-d12.css')>html.indexOf('yy-dragon-d11.css'));
 assert.match(html,/yy-dragon-d12\.css\?v=d12-1/);
 assert.match(html,/yin-yang-art\.js\?v=phase-d12-1/);
 assert.match(build,/'yy-dragon-d12\.css'/);
 assert.ok(css.length<9000);
});
test('D12: one central unicorn horn with four spiral engravings for all ten poses',()=>{
 const svg=render().markup();
 assert.equal((svg.match(/class="yy-d12-unicorn-core"/g)||[]).length,10);
 assert.equal((svg.match(/class="yy-d12-unicorn-spiral"/g)||[]).length,10);
 assert.equal((svg.match(/class="yy-d12-unicorn-root"/g)||[]).length,10);
 assert.equal((svg.match(/class="yy-dragon-horn yy-horn-/g)||[]).length,20);
 assert.equal((svg.match(/class="yy-eye-closed yy-eye-/g)||[]).length,20);
 assert.doesNotMatch(svg,/yy-crown-mark|yy-third-eye|yy-eye-center|yy-eye-almond|yy-eye-core/);
 for(const phase of render().poses) {
  const top=phase.head[1]-137*phase.head[2];
  assert.ok(top>=0,phase.id+' central horn is cropped at top: '+top);
 }
});
test('D12: organic tapered tail and feather in every pose, no moss-green legacy tail',()=>{
 const svg=render().markup();
 for(const name of ['yy-d12-tail-shell','yy-d12-tail-ridge','yy-d12-tail-flow','yy-d12-tail-plume','yy-d12-tail-spines'])
  assert.equal((svg.match(new RegExp('class="[^"]*'+name+'[^"]*"','g'))||[]).length,10,name);
 assert.doesNotMatch(svg,/class="yy-tail-fur"|class="yy-tail-band"/);
 assert.match(css,/fill:url\(#yy-d12-tail\)!important/);
 assert.match(css,/--d12-tail-hi:#ffebef/);
 assert.match(css,/--d12-tail-hi:#effaff/);
 assert.doesNotMatch(css,/--d12-tail-(?:hi|mid|low):#[0-9a-f]*[^0-9a-f]/i.test('')?'__never__':'--d12-tail-(hi|mid|low):#(?:7dcaa5|8dab99|648b80)/);
});
test('D12: refines anatomical silhouette, preserves living cat/cow and all 40 contacts',()=>{
 const svg=render().markup();
 assert.equal((svg.match(/class="yy-fur yy-outline yy-d12-body-shell"/g)||[]).length,10);
 assert.equal((svg.match(/class="yy-d12-shoulder-arc"/g)||[]).length,10);
 assert.equal((svg.match(/class="yy-d12-ventral-arc"/g)||[]).length,10);
 assert.equal((svg.match(/class="yy-paw-group"/g)||[]).length,40);
 assert.equal((svg.match(/data-asana-back="true"/g)||[]).length,1);
 assert.equal((svg.match(/data-asana-spine="true"/g)||[]).length,1);
 assert.equal((svg.match(/data-asana-belly="true"/g)||[]).length,1);
 assert.ok(!/NaN|Infinity|undefined/.test(svg));
 assert.match(art,/p\.kind==="rest"\?\.78:p\.kind==="table"\?\.75/);
});
test('D12: animation belongs only to feather, respects pause/quiet/reduced motion',()=>{
 assert.match(css,/yy-d12-tail-tip 10\.8s/);
 assert.match(css,/animation-play-state:paused!important/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/quiet-mode/);
 assert.doesNotMatch(css,/(?:requestAnimationFrame|setInterval|\.yy-character\s*\{\s*animation)/);
});
