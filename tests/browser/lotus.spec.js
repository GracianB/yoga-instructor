const { test, expect } = require('@playwright/test');

const clockStart = new Date('2026-10-09T12:00:00Z');

async function advance(page, milliseconds) {
  // Long intervals need one real source update, then a short window in which
  // the hero can consume it. Replaying unrelated particles for thousands of
  // animation frames would make cross-browser tests depend on CPU speed.
  if (milliseconds > 500) {
    await page.clock.fastForward(milliseconds - 250);
    await page.clock.runFor(250);
  } else {
    await page.clock.runFor(milliseconds);
  }
}

async function openLotus(page, { reducedMotion = 'no-preference' } = {}) {
  // Remote ambience uses the same isolated fixtures as closure.spec.js.
  // The real font layout is separately reviewed in the visual QA; every
  // first-party SVG, stylesheet and script remains the production resource.
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  await page.route('https://vortex-gilt-xi.vercel.app/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><head><title>Vortex fixture</title></head><body></body></html>' }));
  await page.emulateMedia({ reducedMotion });
  await page.clock.install({ time: clockStart });
  await page.clock.pauseAt(new Date(clockStart.getTime() + 1000));
  // Use the site's own returning-visitor state; do not replace artwork or APIs.
  await page.addInitScript(() => sessionStorage.setItem('gb-yoga-intro-seen', '1'));
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('requestfailed', request => {
    if (new URL(request.url()).origin === 'http://127.0.0.1:4185' &&
        ['document', 'script', 'stylesheet', 'image', 'font'].includes(request.resourceType())) {
      failures.push(`${request.failure()?.errorText} ${request.url()}`);
    }
  });
  page.on('response', response => {
    if (new URL(response.url()).origin === 'http://127.0.0.1:4185' && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero-mandala')).toBeVisible();
  await expect(page.locator('.sanctuary-breath')).toBeVisible();
  await advance(page, 250);
  return failures;
}

async function openness(page) {
  return page.locator('.hero').evaluate(hero => Number.parseFloat(hero.style.getPropertyValue('--lotus-open')));
}

async function frame(page) {
  return page.locator('.hero').evaluate(hero => ({
    open: hero.style.getPropertyValue('--lotus-open'),
    shapes: [...hero.querySelectorAll('.lotus-bloom, .lotus-layer, .lotus-wing, .lotus-petal')].map(shape => {
      const style = getComputedStyle(shape);
      return { transform: style.transform, opacity: style.opacity };
    })
  }));
}

const click = (page, selector) => page.locator(selector).evaluate(button => button.click());

function overlap(a, b) {
  return Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) + 1 &&
    Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y) + 1;
}

async function expectContained(page, width) {
  const [svg, bloom, title, actions, hero] = await Promise.all([
    page.locator('.hero-mandala').boundingBox(),
    page.locator('.hero-mandala .lotus-bloom').boundingBox(),
    page.locator('.hero h1').boundingBox(),
    page.locator('.hero-actions').boundingBox(),
    page.locator('.hero').boundingBox()
  ]);
  expect(svg && bloom && title && actions && hero).toBeTruthy();
  expect(svg.x).toBeGreaterThanOrEqual(-1);
  expect(svg.x + svg.width).toBeLessThanOrEqual(width + 1);
  expect(svg.y).toBeGreaterThanOrEqual(hero.y - 1);
  expect(svg.y + svg.height).toBeLessThanOrEqual(hero.y + hero.height + 1);
  expect(bloom.width).toBeGreaterThanOrEqual(width <= 900 ? 190 : 250);
  expect(bloom.height).toBeGreaterThanOrEqual(100);
  expect(overlap(svg, title)).toBe(false);
  expect(overlap(svg, actions)).toBe(false);
  if (width <= 900) {
    expect(svg.y + svg.height).toBeLessThanOrEqual(title.y + 1);
  } else {
    expect(svg.x).toBeGreaterThanOrEqual(title.x + title.width - 1);
  }
  const petals = await page.locator('.hero-mandala .lotus-petal').evaluateAll(shapes => shapes.map(shape => {
    const box = shape.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height };
  }));
  for (const petal of petals) {
    expect(petal.x).toBeGreaterThanOrEqual(svg.x - 2);
    expect(petal.y).toBeGreaterThanOrEqual(svg.y - 2);
    expect(petal.x + petal.width).toBeLessThanOrEqual(svg.x + svg.width + 2);
    expect(petal.y + petal.height).toBeLessThanOrEqual(svg.y + svg.height + 2);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const width of [320, 390, 768, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`lotus is complete and clear at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const failures = await openLotus(page);
      await click(page, `[data-set-theme="${theme}"]`);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const svg = page.locator('.hero-mandala');
      await expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(await svg.locator('.lotus-bloom .lotus-layer').count()).toBeGreaterThanOrEqual(3);
      expect(await svg.locator('.lotus-petal').count()).toBeGreaterThanOrEqual(11);
      const integrity = await svg.evaluate(element => {
        const missing = [];
        const resolve = (value, description) => {
          if (!value) return;
          const reference = new URL(value, location.href);
          const id = decodeURIComponent(reference.hash.slice(1));
          if (reference.origin !== location.origin || reference.pathname !== location.pathname || !id ||
              !element.querySelector(`#${CSS.escape(id)}`) ||
              document.querySelectorAll(`#${CSS.escape(id)}`).length !== 1) missing.push(description);
        };
        for (const node of element.querySelectorAll('*')) {
          for (const name of ['href', 'xlink:href']) resolve(node.getAttribute(name), `${node.tagName} ${name}`);
          const style = getComputedStyle(node);
          for (const name of ['fill', 'stroke', 'filter', 'clip-path', 'mask']) {
            const value = node.getAttribute(name) || style.getPropertyValue(name);
            for (const match of (value || '').matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) resolve(match[1], `${node.tagName} ${name}`);
          }
        }
        return {
          missing,
          gradients: [...element.querySelectorAll('linearGradient, radialGradient')].map(gradient =>
            [...gradient.querySelectorAll('stop')].map(stop => stop.offset.baseVal)),
          petals: [...element.querySelectorAll('.lotus-petal')].map(petal => {
            const box = petal.getBBox();
            return { length: petal.getTotalLength(), width: box.width, height: box.height, fill: getComputedStyle(petal).fill };
          })
        };
      });
      expect(integrity.missing).toEqual([]);
      expect(integrity.gradients.length).toBeGreaterThan(0);
      for (const stops of integrity.gradients) expect(new Set(stops).size).toBeGreaterThanOrEqual(2);
      for (const petal of integrity.petals) {
        expect(petal.length).toBeGreaterThan(20);
        expect(petal.width).toBeGreaterThan(2);
        expect(petal.height).toBeGreaterThan(2);
        expect(petal.fill).not.toBe('none');
      }
      // Check both ends of the real motion rather than forcing a test-only
      // transform. The dock's hold phase supplies a stable, fully open frame.
      await click(page, '.sanctuary-breath');
      await advance(page, 250);
      await expectContained(page, width);
      await advance(page, 4250);
      await expect(page.locator('#breath-phase')).toHaveText('Sostén');
      expect(await openness(page)).toBeGreaterThanOrEqual(0.95);
      await expectContained(page, width);
      expect(failures).toEqual([]);
    });
  }
}

test('ambient breathing moves the petals and visual quiet holds the exact frame', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const failures = await openLotus(page);
  const first = await frame(page);
  await advance(page, 1250);
  const inhale = await openness(page);
  expect(inhale).toBeGreaterThan(0.15);
  expect(inhale).toBeLessThan(0.7);
  expect((await frame(page)).shapes).not.toEqual(first.shapes);
  await expect(page.locator('.hero .breath-phase')).toContainText('Inhala');
  await click(page, '.sanctuary-quiet');
  await expect(page.locator('body')).toHaveClass(/quiet-mode/);
  const frozen = await frame(page);
  await advance(page, 8000);
  expect(await frame(page)).toEqual(frozen);
  await click(page, '.sanctuary-quiet');
  await advance(page, 1000);
  expect(await openness(page)).toBeGreaterThan(inhale + 0.1);
  await advance(page, 2000);
  await expect(page.locator('.hero .breath-phase')).toContainText('Sostén');
  expect(await openness(page)).toBeGreaterThanOrEqual(0.95);
  await advance(page, 8000);
  await expect(page.locator('.hero .breath-phase')).toContainText('Exhala');
  expect(await openness(page)).toBeLessThan(0.9);
  expect(failures).toEqual([]);
});

test('one breath synchronizes the hero and dock through inhale, hold and exhale', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const failures = await openLotus(page);
  await click(page, '.sanctuary-breath');
  await expect(page.locator('.sanctuary-breath')).toHaveAttribute('aria-pressed', 'true');
  await advance(page, 250);
  const start = await openness(page);
  const first = await frame(page);
  await expect(page.locator('#breath-phase')).toHaveText('Inhala');
  await expect(page.locator('.hero .breath-phase')).toContainText('Inhala');
  await advance(page, 1500);
  expect(await openness(page)).toBeGreaterThan(start + 0.2);
  expect((await frame(page)).shapes).not.toEqual(first.shapes);
  await advance(page, 2750);
  await expect(page.locator('body')).toHaveAttribute('data-breath-phase', 'hold');
  await expect(page.locator('#breath-phase')).toHaveText('Sostén');
  await expect(page.locator('.hero .breath-phase')).toContainText('Sostén');
  const held = await openness(page);
  expect(held).toBeGreaterThanOrEqual(0.95);
  await advance(page, 3000);
  expect(await openness(page)).toBe(held);
  await advance(page, 4500);
  await expect(page.locator('body')).toHaveAttribute('data-breath-phase', 'exhale');
  await expect(page.locator('#breath-phase')).toHaveText('Exhala');
  await expect(page.locator('.hero .breath-phase')).toContainText('Exhala');
  const exhaling = await openness(page);
  expect(exhaling).toBeLessThan(held);
  await advance(page, 4000);
  expect(await openness(page)).toBeLessThan(exhaling - 0.2);
  await advance(page, 4000);
  await expect(page.locator('.sanctuary-breath')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#breath-phase')).toHaveText('Ya estás aquí.');
  expect(await openness(page)).toBeGreaterThanOrEqual(0);
  expect(await openness(page)).toBeLessThanOrEqual(1);
  expect(failures).toEqual([]);
});

test('reduced motion freezes the lotus at load and after a live preference change', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const failures = await openLotus(page, { reducedMotion: 'reduce' });
  const initial = await frame(page);
  expect(Number.parseFloat(initial.open)).toBeGreaterThanOrEqual(0);
  expect(Number.parseFloat(initial.open)).toBeLessThanOrEqual(1);
  await click(page, '.sanctuary-breath');
  await advance(page, 6000);
  await expect(page.locator('#breath-phase')).toHaveText('Sostén');
  expect(await frame(page)).toEqual(initial);
  const motion = await page.locator('.hero-mandala, .lotus-bloom, .lotus-layer, .lotus-wing, .lotus-petal').evaluateAll(shapes =>
    shapes.map(shape => getComputedStyle(shape).animationName));
  expect(motion.every(name => name === 'none')).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await advance(page, 6500);
  const moving = await openness(page);
  await advance(page, 500);
  expect(await openness(page)).toBeLessThan(moving);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await advance(page, 250);
  const changed = await frame(page);
  await advance(page, 6000);
  expect(await frame(page)).toEqual(changed);
  // Changing the preference back also restores ambient motion after the
  // manual breath completes, without requiring a navigation or a reload.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await advance(page, 500);
  const resumed = await openness(page);
  await advance(page, 1000);
  expect(Math.abs((await openness(page)) - resumed)).toBeGreaterThan(0.1);
  expect(failures).toEqual([]);
});

test('guided breath preserves its position across pause and overlapping page visibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const failures = await openLotus(page);
  const guide = page.locator('#flow-guide');
  const act = action => click(page, `[data-flow-action="${action}"]`);
  await expect(guide).toHaveAttribute('data-ready', 'true');
  await act('start');
  for (const phase of ['centering', 'breath']) {
    await expect(page.locator('[data-flow-action="next"]')).toBeEnabled();
    await act('next');
    // These short sequential pose waits must both execute; skipping to their
    // final timestamp would schedule the second wait after that timestamp.
    await page.clock.runFor(600);
    await expect(guide).toHaveAttribute('data-phase', phase);
    await expect(guide).toHaveAttribute('data-ready', 'true');
  }
  await advance(page, 650);
  await expect(page.locator('.sanctuary-dock')).toHaveClass(/yy-dock-active/);
  await expect(page.locator('#breath-phase')).toHaveText('Inhala');
  await act('pause');
  await advance(page, 250);
  await expect(guide).toHaveAttribute('data-status', 'paused');
  // The position is already paused; allow the authored 300ms interpolation
  // to reach that last position before comparing the rendered geometry.
  await page.waitForTimeout(350);
  const paused = await frame(page);
  const label = await page.locator('#breath-phase').textContent();
  const seconds = await page.locator('.breath-time').textContent();
  await advance(page, 2000);
  expect(await frame(page)).toEqual(paused);
  const visibility = hidden => page.evaluate(value => {
    // Simulate only the lifecycle signal, retaining the production clocks,
    // phase engine, pause handlers and frame scheduling.
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => value });
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
  await visibility(true);
  await advance(page, 3000);
  expect(await frame(page)).toEqual(paused);
  await act('pause');
  await expect(guide).toHaveAttribute('data-status', 'running');
  await advance(page, 4000);
  expect(await frame(page)).toEqual(paused);
  await expect(page.locator('#breath-phase')).toHaveText(label);
  await expect(page.locator('.breath-time')).toHaveText(seconds);
  await visibility(false);
  await advance(page, 250);
  await expect(page.locator('#breath-phase')).toHaveText('Inhala');
  await advance(page, 1000);
  expect(await openness(page)).toBeGreaterThan(Number.parseFloat(paused.open) + 0.15);
  await advance(page, 2000);
  await expect(page.locator('#breath-phase')).toHaveText('Sostén');
  await expect(page.locator('.hero .breath-phase')).toContainText('Sostén');
  expect(await openness(page)).toBeGreaterThanOrEqual(0.95);
  await act('reset');
  await page.clock.runFor(600);
  await expect(page.locator('.sanctuary-dock')).not.toHaveClass(/yy-dock-active/);
  expect(failures).toEqual([]);
});

test('quiet and reduced motion keep the lotus wrapper still under real pointer movement', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const failures = await openLotus(page);
  const wrapper = page.locator('.hero .mandala-parallax');
  const hero = page.locator('.hero');
  const area = await hero.boundingBox();
  expect(area).toBeTruthy();
  const pointerY = Math.min(500, area.y + area.height * 0.3);
  const left = { x: area.x + area.width * 0.2, y: pointerY };
  const right = { x: area.x + area.width * 0.8, y: pointerY };
  const move = async point => {
    await page.mouse.move(point.x, point.y);
    await advance(page, 250);
  };
  await move(left);
  const pointerBefore = await hero.evaluate(element => element.style.getPropertyValue('--px'));
  await move(right);
  expect(await hero.evaluate(element => element.style.getPropertyValue('--px'))).not.toBe(pointerBefore);
  // Validate the pointer input first, so the stillness assertions cannot pass
  // because the hero never received an event or the pointer API was mocked.
  await click(page, '.sanctuary-quiet');
  await expect(wrapper).toHaveCSS('transform', 'none');
  await expect(wrapper).toHaveCSS('transition-duration', '0s');
  const quietPointer = await hero.evaluate(element => element.style.getPropertyValue('--px'));
  await move(left);
  const quiet = await wrapper.boundingBox();
  await move(right);
  await expect(wrapper).toHaveCSS('transform', 'none');
  expect(await wrapper.boundingBox()).toEqual(quiet);
  expect(await hero.evaluate(element => element.style.getPropertyValue('--px'))).toBe(quietPointer);
  await click(page, '.sanctuary-quiet');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(wrapper).toHaveCSS('transform', 'none');
  await expect(wrapper).toHaveCSS('transition-duration', '0s');
  const reducedPointer = await hero.evaluate(element => element.style.getPropertyValue('--px'));
  await move(left);
  const reduced = await wrapper.boundingBox();
  await move(right);
  await expect(wrapper).toHaveCSS('transform', 'none');
  expect(await wrapper.boundingBox()).toEqual(reduced);
  expect(await hero.evaluate(element => element.style.getPropertyValue('--px'))).toBe(reducedPointer);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await move(left);
  const restoredPointer = await hero.evaluate(element => element.style.getPropertyValue('--px'));
  await move(right);
  expect(await hero.evaluate(element => element.style.getPropertyValue('--px'))).not.toBe(restoredPointer);
  expect(failures).toEqual([]);
});
