import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import postcss from 'postcss';
const html = readFileSync('index.html', 'utf8');
for (const file of ['index.html', 'cv.html', '404.html']) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:href|src)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g)) assert.ok(existsSync(match[1]), `${file}: missing ${match[1]}`);
}
assert.ok(!html.includes('frame-ancestors'), 'Unsupported meta directive');
assert.ok(html.includes('Content-Security-Policy'));
const css = readFileSync('styles.css', 'utf8');
postcss.parse(css);
postcss.parse(readFileSync('flow-guide.css', 'utf8'));
postcss.parse(readFileSync('yy-asana-motion.css', 'utf8'));
assert.ok(statSync('yy-asana-motion.css').size <= 12000, 'Asana motion CSS budget');
assert.ok(statSync('yy-asana-motion.js').size <= 6000, 'Asana motion JS budget');
assert.ok(html.includes('yy-asana-motion.js?v=phase-b-1'), 'Asana motion script must load');
assert.ok(html.includes('yy-asana-motion.css?v=phase-b-1'), 'Asana motion styles must load');
assert.ok(statSync('flow-guide.css').size <= 16000, 'Guide CSS budget');
assert.ok(statSync('flow-guide.js').size <= 16000, 'Guide JS budget');
assert.ok(statSync('yin-yang-art.js').size <= 16000, 'Yin Yang vector art budget');
assert.ok(!html.includes('flow-motion.js'), 'Obsolete bone-morphing script must not load');
assert.ok(html.includes('yin-yang-art.js?v=yin-yang-1'), 'Yin Yang art module required');
assert.ok(statSync('styles.css').size <= 174000, 'CSS budget');
assert.ok(statSync('main.js').size <= 22500, 'Main JS budget');
assert.ok(statSync('audio/sustained-focus.mp3').size <= 4500000, 'Audio budget');
for (const file of ['main.js', 'instructor-ui.js', 'sanctuary-experience.js']) {
  const source = readFileSync(file, 'utf8');
  assert.ok(!/const\s+\w+\s*=\s*(?:window\.)?requestAnimationFrame\b/.test(source), `${file}: unbound animation API`);
}
console.log('Release links, CSS syntax and resource budgets passed');
