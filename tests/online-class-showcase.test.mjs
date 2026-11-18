import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('online class landing is linked, private and included in Pages', () => {
  const page = readFileSync('clases-online.html', 'utf8');
  const home = readFileSync('index.html', 'utf8');
  const build = readFileSync('tools/build.mjs', 'utf8');
  const sitemap = readFileSync('sitemap.xml', 'utf8');
  assert.match(page, /<html lang="es">/);
  assert.match(page, /<main id="contenido">/);
  assert.match(page, /mailto:gracianbaenagonzalez@gmail\.com/);
  assert.match(page, /Duración y calendario/);
  assert.match(page, /Precio y condiciones/);
  assert.match(page, /Se concretan antes de confirmar/);
  assert.match(page, /<a class="skip" href="#contenido">/);
  assert.doesNotMatch(page, /<script\b/i);
  assert.doesNotMatch(page, /<form\b/i);
  assert.doesNotMatch(page, /type="tel"|itemprop="telephone"/);
  assert.match(home, /href="\.\/clases-online\.html"/);
  assert.match(build, /'clases-online\.html'/);
  assert.match(sitemap, /clases-online\.html/);
});
