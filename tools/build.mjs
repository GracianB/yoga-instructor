import { mkdir, rm, copyFile, cp, readFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
const rootFiles = ['index.html', 'cv.html', 'cv.js', '404.html', 'styles.css', 'favicon.svg', 'og-cover.svg', 'og-cover.png', 'runtime.js', 'boot.js', 'main.js', 'i18n.js', 'flow-engine.js', 'flow-session.js', 'flow-phase.js', 'instructor-ui.js', 'yin-yang-art.js', 'flow-guide.js', 'flow-guide.css', 'yy-asana-motion.js', 'yy-asana-motion.css', 'yy-premium-stage.css', 'yy-phase-d2-d3.css', 'yy-phase-d4-polish.css', 'yy-guardian-soul.css', 'yy-practice-d6.css', 'yy-phase-d7-polish.css', 'yy-dragon-d9.css', 'yy-dragon-d10.css', 'yy-dragon-d11.css', 'yy-dragon-d12.css', 'yy-dragon-d13.css', 'yy-dragon-d14.css', 'yy-dragon-d15.css', 'yy-dragon-d16.css', 'yy-dragon-d17.css', 'yy-dragon-d23.css', 'yy-asana-library.css', 'asana-library.js', 'studio-asana-library.js', 'session-design.js', 'session-design-ui.js', 'yy-session-design.css', 'practice-pathways.js', 'studio-clock.js', 'studio-breath-engine.js', 'yy-studio-breath-d26.css', 'studio-meditation-d27.js', 'yy-studio-meditation-d27.css', 'studio-anatomy-d28.js', 'yy-dragon-d28.css', 'yy-studio-d29.css', 'practice-studio.js', 'studio-companion.js', 'yy-studio-companion.css', 'movement-guardian-v37.js', 'yy-three-guardians-v38.css', 'studio-meditation-guardian-v42.js', 'yy-meditation-guardian-v43.css', 'yy-movement-bridge-v44.css', 'yy-guardian-atelier-v54.css', 'yy-movement-stage-v55.css', 'yy-anatomy-depth-v56.css', 'yy-immersive-practice-v57.css', 'movement-camera-v57.js', 'practice-mode-context-v57.js', 'movement-cockpit-v55.js', 'yy-unified-gallery-v53.css', 'yoga-audio-bus.js', 'yy-unified-audio-v36.css', 'studio-breath-dragon.js', 'yy-breath-revival.css', 'studio-soundscape.js', 'yy-studio-soundscape.css', 'studio-plans.js', 'studio-plan-ui.js', 'yy-studio-plan.css', 'studio-immersion.js', 'yy-studio-immersion.css', 'studio-finale.js', 'yy-studio-finale.css', 'yy-practice-studio.css', 'sanctuary-experience.js', 'robots.txt', 'sitemap.xml', '.nojekyll', 'Gracian_Baena_Carta_Yoga_ES.pdf', 'Gracian_Baena_Cover_Letter_Yoga_EN.pdf'];
// Release contract: every root stylesheet referenced by HTML must be deployed.
// New visual layers must not silently disappear from GitHub Pages.
const html = await readFile('index.html', 'utf8');
for (const page of [html, await readFile('cv.html', 'utf8'), await readFile('404.html', 'utf8')]) {
  for (const [, sheet] of page.matchAll(/<link[^>]+href="\.\/([^"?#]+\.css)(?:\?[^\"]*)?"/g)) {
    if (!sheet.includes('/') && !rootFiles.includes(sheet)) throw Error('Missing stylesheet from Pages bundle: ' + sheet);
  }
  for (const [, script] of page.matchAll(/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)(?:\?[^"]*)?"/g)) {
    if (!script.includes('/') && !rootFiles.includes(script)) throw Error('Missing script from Pages bundle: ' + script);
  }
}
for (const file of rootFiles) await copyFile(file, `dist/${file}`);
for (const directory of ['assets', 'audio']) await cp(directory, `dist/${directory}`, { recursive: true });
console.log('Pages artifact ready');
