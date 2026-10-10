import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const movement = readFileSync(new URL('../movement-guardian-v37.js', import.meta.url), 'utf8');
const release = readFileSync(new URL('../tools/build.mjs', import.meta.url), 'utf8');
const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('V60: cervical connection retains authored endpoints and a cubic contour', () => {
  assert.match(movement, /const dx=endX-topX,dy=endY-topY/);
  assert.match(movement, /C'\+point\(c1x,c1y\)/);
  assert.match(movement, /point\(endX,endY\)/);
  assert.doesNotMatch(movement, /setInterval\(|requestAnimationFrame\(/);
});

test('V60: limb joints interpolate tangent without moving contact endpoints', () => {
  assert.match(movement, /u>\.41 && u<\.59/);
  assert.match(movement, /v\*v\*\(3-2\*v\)/);
  assert.match(movement, /const pos=sample\(sections\[seg\],t\)/);
  assert.match(movement, /p\.feet\.map\(\(pt,i\)=>paw\(pt,"foot",i\)\)/);
});

test('V58/V60: guardian styling included in release', () => {
  assert.ok(release.includes("'yy-guardian-finish-v58.css'"));
  assert.ok(page.includes('yy-guardian-finish-v58.css?v=v58-1'));
});
