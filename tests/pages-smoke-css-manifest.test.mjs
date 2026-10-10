import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';

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
 assert.match(smoke,/localPages\.flatMap/);
 assert.match(smoke,/const declaredScripts/);
 assert.match(smoke,/\.\.\.declaredStylesheets/);
 assert.match(smoke,/yy-dragon-d10\.css/);
 assert.match(build,/Missing stylesheet from Pages bundle/);
});

test('Silence Between Notes is shipped as a real opt-in MP3, with a remote SHA release gate',()=>{
 const fs=requireAudioFile();
 const player=read('studio-soundscape.js'),bus=read('yoga-audio-bus.js');
 assert.ok(fs.size>1000000 && fs.size<10000000, 'MP3 must exist and stay inside size budget');
 assert.match(smoke,/audio\/silence-between-notes\.mp3/);
 assert.match(smoke,/ownerSongExists/);
 assert.match(smoke,/actual !== file\.digest/);
 assert.match(build,/for \(const directory of \['assets', 'audio'\]\)/);
 assert.match(bus,/silence-between-notes\.mp3/);
 assert.match(player,/toggle\.addEventListener\("click"/);
 assert.match(player,/bus\.toggle\("breath"\)/);
});

function requireAudioFile(){
 return statSync(new URL('../audio/silence-between-notes.mp3',import.meta.url));
}
