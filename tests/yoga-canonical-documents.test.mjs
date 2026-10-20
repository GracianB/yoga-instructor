import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = 'https://gracianb.github.io/GracianB/';
const names = {
  cvEs: 'Gracian_Baena_CV_Yoga_ES.pdf',
  cvEn: 'Gracian_Baena_CV_Yoga_EN.pdf',
  letterEs: 'Gracian_Baena_Carta_Yoga_ES.pdf',
  letterEn: 'Gracian_Baena_Cover_Letter_Yoga_EN.pdf',
};
const files = ['index.html', 'main.js', 'cv.html', 'cv.js', 'credential-ledger-v77.js'];
const source = Object.fromEntries(files.map(path => [path, readFileSync(path, 'utf8')]));

test('Yoga public entrypoints use the 12-PDF hub as the one authoritative Yoga document source', () => {
  const index = source['index.html'];
  for (const name of Object.values(names)) {
    assert.ok(index.includes(base + name), 'Public portfolio omits canonical ' + name);
  }
  for (const path of ['main.js', 'cv.js']) {
    assert.ok(source[path].includes(base + names.cvEs), path + ' must link the ES CV from the hub');
    assert.ok(source[path].includes(base + names.cvEn), path + ' must link the EN CV from the hub');
  }
  assert.ok(source['cv.html'].includes(base + names.cvEs), 'Printable CV initially links the canonical Spanish PDF');
  assert.ok(source['main.js'].includes(base + names.letterEs));
  assert.ok(source['main.js'].includes(base + names.letterEn));
  assert.ok(source['credential-ledger-v77.js'].includes(base + 'Gracian_Baena_CV_Yoga_'));
  assert.ok(source['credential-ledger-v77.js'].includes(base + names.letterEs));
  assert.ok(source['credential-ledger-v77.js'].includes(base + names.letterEn));
});

test('Active Yoga HTML and language handlers do not send users to historically duplicated PDFs', () => {
  const legacy = [
    './assets/CV_Gracian_Baena_Yoga_ES.pdf',
    './assets/CV_Gracian_Baena_Yoga_EN.pdf',
    './Gracian_Baena_Carta_Yoga_ES.pdf',
    './Gracian_Baena_Cover_Letter_Yoga_EN.pdf',
  ];
  for (const [path, content] of Object.entries(source)) {
    for (const old of legacy) {
      assert.ok(!content.includes(old), path + ' still references superseded PDF: ' + old);
    }
  }
});
