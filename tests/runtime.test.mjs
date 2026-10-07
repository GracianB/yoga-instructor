import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../runtime.js', import.meta.url), 'utf8');

test('browser APIs retain window as their receiver', () => {
  const window = {
    matchMedia(query) { assert.equal(this, window); return { matches: query === 'reduce' }; },
    requestAnimationFrame(callback) { assert.equal(this, window); callback(42); return 7; },
    cancelAnimationFrame(id) { assert.equal(this, window); assert.equal(id, 7); }
  };
  vm.runInNewContext(source, { window });
  assert.equal(window.YOGA_RUNTIME.mediaMatches('reduce'), true);
  assert.equal(window.YOGA_RUNTIME.frame(now => assert.equal(now, 42)), 7);
  window.YOGA_RUNTIME.cancel(7);
});

test('missing animation and media APIs have operational fallbacks', () => {
  let cancelled = false;
  const window = {
    setTimeout(callback, delay) { assert.equal(delay,16); callback(); return 9; },
    clearTimeout(id) { assert.equal(id,9); cancelled = true; }
  };
  vm.runInNewContext(source, { window, performance: { now: () => 123 } });
  assert.equal(window.YOGA_RUNTIME.mediaMatches('reduce'), false);
  assert.equal(window.YOGA_RUNTIME.frame(now => assert.equal(now,123)),9);
  window.YOGA_RUNTIME.cancel(9);
  assert.ok(cancelled);
});

test('throwing media API falls back without interrupting startup', () => {
  const window = { matchMedia() { throw new Error('unavailable'); } };
  vm.runInNewContext(source, { window });
  assert.equal(window.YOGA_RUNTIME.mediaMatches('reduce'), false);
});
