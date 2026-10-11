import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const css=read('yy-console-legibility-v69.css');
const html=read('index.html');
const build=read('tools/build.mjs');
const identity=read('studio-guardian-identities-v67.js');

test('V69 restores legible labels across every Movement practice control',()=>{
  for(const selector of ['.studio-plan-heading','.studio-adaptation-heading',
   '.studio-adaptation-field','.studio-adaptation-rest',
   '.studio-adaptation-summary','.studio-plan-description','.flow-phase-kicker'])
    assert.ok(css.includes(selector),'Missing visible control: '+selector);
  assert.match(css,/--console-text:#f5f2e9/);
  assert.match(css,/--console-label:#d5e7da/);
  assert.match(css,/\.flow-phase\{/);
  assert.match(css,/grid-template-columns:minmax\(0,1fr\) auto/);
});
test('V69 differentiates light Yang from moonlit Yin, without another timer',()=>{
  assert.match(css,/:has\(#flow-guide\[data-spirit="yin"\]\)/);
  assert.match(css,/--console-accent:#c2addf/);
  assert.match(css,/--console-accent:#f0b795/);
  assert.match(identity,/asanasYin:/);
  assert.match(identity,/data-spirit/);
  assert.doesNotMatch(identity,/setInterval\(|setTimeout\(|requestAnimationFrame\(/);
});
test('V69 is last console layer in source and in Pages manifest',()=>{
  const previous=html.indexOf('yy-guardian-identities-v67.css?v=v67-1');
  const current=html.indexOf('yy-console-legibility-v69.css?v=v69-1');
  assert.ok(previous>=0&&current>previous);
  assert.ok(build.includes("'yy-console-legibility-v69.css'"));
});
