import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const build=read('tools/build.mjs');
const smoke=read('tools/pages-smoke.mjs');

test('GitHub Pages smoke verifies every local stylesheet from release HTML',()=>{
 const sheets=[...html.matchAll(/<link[^>]+href="\.\/([^"?#]+\.css)(?:\?[^"]*)?"/g)].map(m=>m[1]);
 assert.ok(sheets.length>=9);
 assert.ok(sheets.includes('yy-dragon-d9.css'));
 assert.ok(sheets.includes('yy-dragon-d10.css'));
 assert.match(smoke,/const declaredStylesheets/);
 assert.match(smoke,/expectedIndex\.matchAll/);
 assert.match(smoke,/\.\.\.declaredStylesheets/);
 assert.match(smoke,/yy-dragon-d10\.css/);
 assert.match(build,/Missing stylesheet from Pages bundle/);
});
