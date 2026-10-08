import { mkdir, rm, copyFile, cp } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const file of ['index.html', 'cv.html', 'cv.js', '404.html', 'styles.css', 'favicon.svg', 'runtime.js', 'boot.js', 'main.js', 'i18n.js', 'flow-engine.js', 'flow-session.js', 'flow-phase.js', 'instructor-ui.js', 'yin-yang-art.js', 'flow-guide.js', 'flow-guide.css', 'sanctuary-experience.js', 'robots.txt', 'sitemap.xml', '.nojekyll', 'Gracian_Baena_Carta_Yoga_ES.pdf', 'Gracian_Baena_Cover_Letter_Yoga_EN.pdf']) await copyFile(file, `dist/${file}`);
for (const directory of ['assets', 'audio']) await cp(directory, `dist/${directory}`, { recursive: true });
console.log('Pages artifact ready');
