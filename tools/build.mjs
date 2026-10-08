import { mkdir, rm, copyFile, cp, readFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
const rootFiles = ['index.html', 'cv.html', 'cv.js', '404.html', 'styles.css', 'favicon.svg', 'runtime.js', 'boot.js', 'main.js', 'i18n.js', 'flow-engine.js', 'flow-session.js', 'flow-phase.js', 'instructor-ui.js', 'yin-yang-art.js', 'flow-guide.js', 'flow-guide.css', 'yy-asana-motion.js', 'yy-asana-motion.css', 'yy-premium-stage.css', 'yy-phase-d2-d3.css', 'yy-phase-d4-polish.css', 'yy-guardian-soul.css', 'yy-practice-d6.css', 'yy-phase-d7-polish.css', 'yy-dragon-d9.css', 'yy-dragon-d10.css', 'yy-dragon-d11.css', 'yy-dragon-d12.css', 'yy-dragon-d13.css', 'yy-dragon-d14.css', 'yy-dragon-d15.css', 'yy-dragon-d16.css', 'practice-pathways.js', 'sanctuary-experience.js', 'robots.txt', 'sitemap.xml', '.nojekyll', 'Gracian_Baena_Carta_Yoga_ES.pdf', 'Gracian_Baena_Cover_Letter_Yoga_EN.pdf'];
// Release contract: every root stylesheet referenced by HTML must be deployed.
// New visual layers must not silently disappear from GitHub Pages.
const html = await readFile('index.html', 'utf8');
for (const [, sheet] of html.matchAll(/<link[^>]+href="\.\/([^"?#]+\.css)(?:\?[^\"]*)?"/g)) {
  if (!sheet.includes('/') && !rootFiles.includes(sheet)) throw Error('Missing stylesheet from Pages bundle: ' + sheet);
}
for (const file of rootFiles) await copyFile(file, `dist/${file}`);
for (const directory of ['assets', 'audio']) await cp(directory, `dist/${directory}`, { recursive: true });
console.log('Pages artifact ready');
