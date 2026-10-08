import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html = readFileSync(new URL('../index.html',import.meta.url),'utf8');
const build = readFileSync(new URL('../tools/build.mjs',import.meta.url),'utf8');
test('D9 published stylesheet is explicitly bundled and guarded by HTML manifest',()=>{
 assert.match(html,/yy-dragon-d9\.css\?v=d9-1/);
 assert.match(build,/'yy-dragon-d9\.css'/);
 assert.match(build,/Missing stylesheet from Pages bundle/);
});
