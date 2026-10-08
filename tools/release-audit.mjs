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
postcss.parse(readFileSync('yy-premium-stage.css', 'utf8'));
for (const sheet of [...html.matchAll(/<link[^>]+href="(\.\/[^"?#]+\.css)(?:\?[^"]*)?"/g)].map(match=>match[1])) {
  assert.ok(existsSync(sheet), 'Stylesheet missing: '+sheet);
  const root=postcss.parse(readFileSync(sheet,'utf8'),{from:sheet});
  assert.ok(root.nodes.length>0,'Empty stylesheet: '+sheet);
}
for (const file of ['yy-phase-d2-d3.css','yy-phase-d4-polish.css','yy-guardian-soul.css']) {
  assert.ok(html.includes(file),'Practice finishing layer missing: '+file);
}
assert.ok(html.indexOf('yy-premium-stage.css')<html.indexOf('yy-phase-d2-d3.css') &&
  html.indexOf('yy-phase-d2-d3.css')<html.indexOf('yy-phase-d4-polish.css') &&
  html.indexOf('yy-phase-d4-polish.css')<html.indexOf('yy-guardian-soul.css'),
  'Practice CSS cascade must preserve D1 to D5 order');
assert.ok((html.match(/id="audio-play"/g)||[]).length===1,'Exactly one audio play button');
assert.ok((html.match(/id="focus-audio"/g)||[]).length===1,'Exactly one audio media element');

assert.ok(statSync('yy-premium-stage.css').size <= 12000, 'Premium theater CSS budget');
assert.ok(html.includes('yy-premium-stage.css?v=phase-d1-1'), 'Premium theater stylesheet required');
assert.ok(html.includes('flow-theater'), 'Side-navigation theater is required');
assert.ok((html.match(/data-flow-action="previous"/g)||[]).length === 1, 'Exactly one previous control');
assert.ok((html.match(/data-flow-action="next"/g)||[]).length === 1, 'Exactly one next control');
assert.ok(statSync('yy-asana-motion.css').size <= 12000, 'Asana motion CSS budget');
assert.ok(statSync('yy-asana-motion.js').size <= 7000, 'Asana motion JS budget, includes D14 living neckline');
assert.ok(html.includes('yy-asana-motion.js?v=d14-1'), 'Asana motion script must load');
assert.ok(html.includes('yy-asana-motion.css?v=phase-b-1'), 'Asana motion styles must load');
assert.ok(statSync('flow-guide.css').size <= 16000, 'Guide CSS budget');
assert.ok(statSync('flow-guide.js').size <= 16000, 'Guide JS budget');
assert.ok(statSync('yin-yang-art.js').size <= 48000, 'Yin Yang vector art budget');
assert.ok(statSync('yy-dragon-d9.css').size <= 14000, 'D9 dragon motion CSS budget');
assert.ok(statSync('yy-dragon-d12.css').size <= 9000, 'D12 anatomy CSS budget');
assert.ok(statSync('yy-dragon-d13.css').size <= 8500, 'D13 transition CSS budget');
assert.ok(statSync('yy-dragon-d14.css').size <= 8500, 'D14 grounded anatomy CSS budget');
assert.ok(statSync('yy-dragon-d15.css').size <= 8000, 'D15 kinetics CSS budget');
assert.ok(statSync('yy-dragon-d16.css').size <= 7000, 'D16 premium wings CSS budget');
assert.ok(statSync('practice-pathways.js').size <= 3500, 'Future practice pathways data budget');
assert.ok(html.indexOf('yy-dragon-d16.css')>html.indexOf('yy-dragon-d15.css'), 'D16 motion cascade must load last');
assert.ok(html.indexOf('yy-dragon-d15.css')>html.indexOf('yy-dragon-d14.css'), 'D15 style must load after D14');
assert.ok(html.indexOf('yy-dragon-d14.css')>html.indexOf('yy-dragon-d13.css'), 'D14 anatomy must load after D13');
assert.ok(html.indexOf('yy-dragon-d13.css')>html.indexOf('yy-dragon-d12.css'), 'D13 choreography loads after D12');
assert.ok(html.indexOf('yy-dragon-d12.css')>html.indexOf('yy-dragon-d11.css'), 'D12 art loads after D11');
assert.ok(html.indexOf('yy-dragon-d9.css')>html.indexOf('yy-phase-d7-polish.css'), 'D9 art loads after D7');
assert.ok(!html.includes('flow-motion.js'), 'Obsolete bone-morphing script must not load');
assert.match(html, /<script src="\.\/yin-yang-art\.js\?v=phase-d\d+-\d+" defer><\/script>/, 'Versioned Yin Yang art module required');
assert.ok(statSync('styles.css').size <= 174000, 'CSS budget');
assert.ok(statSync('main.js').size <= 22500, 'Main JS budget');
assert.ok(statSync('audio/sustained-focus.mp3').size <= 4500000, 'Audio budget');
for (const file of ['main.js', 'instructor-ui.js', 'sanctuary-experience.js']) {
  const source = readFileSync(file, 'utf8');
  assert.ok(!/const\s+\w+\s*=\s*(?:window\.)?requestAnimationFrame\b/.test(source), `${file}: unbound animation API`);
}
console.log('Release links, CSS syntax and resource budgets passed');
