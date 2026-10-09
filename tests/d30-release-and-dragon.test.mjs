import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const pages = ['index.html', 'cv.html', '404.html'].map(read);
const build = read('tools/build.mjs');
const smoke = read('tools/pages-smoke.mjs');

test('D30: every first-party JS and CSS loaded by public pages is bundled', () => {
  const scripts = pages.flatMap(html => [...html.matchAll(/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)(?:\?[^"]*)?"/g)].map(match => match[1]));
  const sheets = pages.flatMap(html => [...html.matchAll(/<link[^>]+href="\.\/([^"?#]+\.css)(?:\?[^"]*)?"/g)].map(match => match[1]));
  assert.ok(scripts.length >= 25, 'Production JavaScript manifest must not shrink unnoticed');
  assert.ok(sheets.length >= 25, 'Production stylesheet manifest must not shrink unnoticed');
  for (const path of [...scripts, ...sheets]) {
    if (path.includes('/')) continue;
    assert.ok(build.includes("'" + path + "'"), 'Missing release asset: ' + path);
  }
  assert.match(build, /Missing script from Pages bundle/);
  assert.match(build, /Missing stylesheet from Pages bundle/);
});

test('D30: public release hashes all referenced scripts and styles without unbounded polling', () => {
  assert.match(smoke, /const declaredScripts/);
  assert.match(smoke, /\.\.\.declaredStylesheets, \.\.\.declaredScripts/);
  assert.match(smoke, /const pending = new Map\(expected\.map/);
  assert.match(smoke, /Math\.min\(8, queue\.length\)/);
  assert.match(smoke, /pending\.delete\(file\.name\)/);
  assert.match(smoke, /actual !== file\.digest/);
  assert.match(smoke, /Verified .* exact SHA-256 asset matches/);
});

test('D30: studio dragon keeps its footing and never starts a second breath oscillator', () => {
  const css = read('yy-studio-companion.css');
  const js = read('studio-companion.js');
  assert.doesNotMatch(css, /@keyframes studio-companion-breath/);
  assert.doesNotMatch(css, /animation-duration:\s*13s/);
  assert.match(css, /\.studio-companion \.yy-character\{\s*animation:none!important/);
  assert.equal((js.match(/new MutationObserver\(/g) || []).length, 1);
  assert.match(js, /if \(id === currentPose\) return/);
  assert.match(js, /observer\.observe\(host/);
  assert.match(js, /observer\.observe\(guide/);
  assert.match(js, /observer\.observe\(studio/);
  assert.doesNotMatch(js, /setInterval|setTimeout|requestAnimationFrame/);
});
