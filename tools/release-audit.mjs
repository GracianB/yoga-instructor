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

assert.ok(statSync('yy-premium-stage.css').size <= 144000, 'Premium theater CSS budget');
assert.ok(html.includes('yy-premium-stage.css?v=phase-d1-1'), 'Premium theater stylesheet required');
assert.ok(html.includes('flow-theater'), 'Side-navigation theater is required');
assert.ok((html.match(/data-flow-action="previous"/g)||[]).length === 1, 'Exactly one previous control');
assert.ok((html.match(/data-flow-action="next"/g)||[]).length === 1, 'Exactly one next control');
assert.ok(statSync('yy-asana-motion.css').size <= 144000, 'Asana motion CSS budget');
assert.ok(statSync('yy-asana-motion.js').size <= 128000, 'Asana motion JS budget, includes D14 living neckline');
assert.ok(html.includes('yy-asana-motion.js?v=d14-1'), 'Asana motion script must load');
assert.ok(html.includes('yy-asana-motion.css?v=phase-b-1'), 'Asana motion styles must load');
assert.ok(statSync('flow-guide.css').size <= 192000, 'Guide CSS budget');
assert.ok(statSync('flow-guide.js').size <= 192000, 'Guide JS budget');
assert.ok(statSync('yin-yang-art.js').size <= 576000, 'Yin Yang vector art budget');
assert.ok(statSync('yy-dragon-d9.css').size <= 168000, 'D9 dragon motion CSS budget');
assert.ok(statSync('yy-dragon-d12.css').size <= 128000, 'D12 anatomy CSS budget');
assert.ok(statSync('yy-dragon-d13.css').size <= 128000, 'D13 transition CSS budget');
assert.ok(statSync('yy-dragon-d14.css').size <= 128000, 'D14 grounded anatomy CSS budget');
assert.ok(statSync('yy-dragon-d15.css').size <= 128000, 'D15 kinetics CSS budget');
assert.ok(statSync('yy-dragon-d16.css').size <= 128000, 'D16 premium wings CSS budget');
assert.ok(statSync('yy-dragon-d17.css').size <= 128000, 'D17 organic finale CSS budget');
assert.ok(statSync('yy-dragon-d23.css').size <= 128000, 'D23 grounded transitions CSS budget');
assert.ok(statSync('yy-asana-library.css').size <= 128000, 'D24 asana library CSS budget');
assert.ok(statSync('asana-library.js').size <= 128000, 'D24 authored asanas budget');
assert.ok(statSync('studio-asana-library.js').size <= 128000, 'D24 library interaction budget');
assert.ok(statSync('session-design.js').size <= 128000, 'D25 ten-phase session adaptation budget');
assert.ok(statSync('session-design-ui.js').size <= 128000, 'D25 options UI budget');
assert.ok(statSync('yy-session-design.css').size <= 128000, 'D25 adaptable practice CSS budget');
assert.ok(statSync('studio-breath-engine.js').size <= 128000, 'D26 pure breath model budget');
assert.ok(statSync('yy-studio-breath-d26.css').size <= 128000, 'D26 breath visuals budget');
assert.ok(statSync('studio-meditation-d27.js').size <= 128000, 'D27 meditation model budget');
assert.ok(statSync('yy-studio-meditation-d27.css').size <= 128000, 'D27 meditation visuals budget');
assert.ok(statSync('studio-anatomy-d28.js').size <= 128000, 'D28 pure rig budget');
assert.ok(statSync('yy-dragon-d28.css').size <= 128000, 'D28 performance-safe dragon finish');
assert.ok(statSync('yy-studio-d29.css').size <= 128000, 'D29 immersive style budget');
assert.ok(html.indexOf('studio-anatomy-d28.js') < html.indexOf('practice-studio.js'), 'D28 pure module must load before controller');
for (const file of ['studio-anatomy-d28.js','yy-dragon-d28.css','yy-studio-d29.css']) {
 assert.ok(html.includes(file), 'D28/29 resource must have a versioned HTML link: '+file);
}
assert.match(readFileSync('practice-studio.js','utf8'),/setImmersive\(false\)/, 'D29 focus must safely reset on mode change');
assert.ok(html.indexOf('studio-meditation-d27.js') < html.indexOf('practice-studio.js'), 'D27 cues must load before practice controller');
assert.ok(html.indexOf('studio-breath-engine.js') < html.indexOf('practice-studio.js'), 'D26 model must load before practice controller');
assert.ok(html.indexOf('yy-dragon-d23.css')>html.indexOf('yy-studio-finale.css'), 'D23 transition geometry must load after the D22 studio layers');
assert.ok(html.indexOf('yy-dragon-d17.css')>html.indexOf('yy-dragon-d16.css'), 'D17 organic art must load last');
assert.ok(statSync('practice-pathways.js').size <= 128000, 'Future practice pathways data budget');
assert.ok(html.indexOf('yy-dragon-d16.css')>html.indexOf('yy-dragon-d15.css'), 'D16 motion cascade must load last');
assert.ok(html.indexOf('yy-dragon-d15.css')>html.indexOf('yy-dragon-d14.css'), 'D15 style must load after D14');
assert.ok(html.indexOf('yy-dragon-d14.css')>html.indexOf('yy-dragon-d13.css'), 'D14 anatomy must load after D13');
assert.ok(html.indexOf('yy-dragon-d13.css')>html.indexOf('yy-dragon-d12.css'), 'D13 choreography loads after D12');
assert.ok(html.indexOf('yy-dragon-d12.css')>html.indexOf('yy-dragon-d11.css'), 'D12 art loads after D11');
assert.ok(html.indexOf('yy-dragon-d9.css')>html.indexOf('yy-phase-d7-polish.css'), 'D9 art loads after D7');
assert.ok(!html.includes('flow-motion.js'), 'Obsolete bone-morphing script must not load');
assert.match(html, /<script src="\.\/yin-yang-art\.js\?v=phase-d\d+-\d+(?:-d\d+-\d+)?" defer><\/script>/, 'Versioned Yin Yang art module required');
assert.ok(statSync('styles.css').size <= 720000, 'CSS budget');
assert.ok(statSync('main.js').size <= 280000, 'Main JS budget');
assert.ok(statSync('audio/sustained-focus.mp3').size <= 24000000, 'Audio budget');
for (const file of ['main.js', 'instructor-ui.js', 'sanctuary-experience.js']) {
  const source = readFileSync(file, 'utf8');
  assert.ok(!/const\s+\w+\s*=\s*(?:window\.)?requestAnimationFrame\b/.test(source), `${file}: unbound animation API`);
}

/* V57: future guardians and asanas have generous, consistent caps. Every
   loaded script/style still needs to exist, parse, and fit a real payload
   envelope. New characters do not require another arbitrary 3 KB exception. */
let pageScriptStyleBytes=0;
const checkedResources=new Set();
for (const match of html.matchAll(/(?:href|src)="\.\/([^"?#]+\.(?:css|js))(?:\?[^"]*)?"/g)) {
 const file=match[1];
 if(checkedResources.has(file))continue;
 checkedResources.add(file);
 const bytes=statSync(file).size;
 const extension=file.endsWith(".css")?"CSS":"JavaScript";
 assert.ok(bytes<=512000,extension+" module too large: "+file+" ("+bytes+" bytes)");
 pageScriptStyleBytes+=bytes;
}
assert.ok(pageScriptStyleBytes<=24000000,"Page scripts/styles exceed 24 MB growth envelope");

console.log('Release links, CSS syntax and resource budgets passed');
