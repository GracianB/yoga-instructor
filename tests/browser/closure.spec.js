const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function open(page, options = {}) {
  // Ambient third-party resources are not necessary for local interaction tests.
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  await page.route('https://vortex-gilt-xi.vercel.app/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><head><title>Vortex fixture</title></head><body></body></html>' }));
  await page.addInitScript(() => { try { sessionStorage.setItem('gb-yoga-intro-seen', '1'); } catch (_) {} });
  const errors = [];
  page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:4185') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await page.goto(options.url || '/');
  await expect(page.locator('h1')).toBeVisible();
  return errors;
}

for (const width of [320, 390, 768, 1440]) {
  test(`navigation, ES/EN, themes and layout at ${width}px`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 900 });
    const errors = await open(page);
    await test.info().attach("hero-light", { body: await page.screenshot({ animations: "disabled" }), contentType: "image/png" });
    await page.locator('[data-set-lang="en"]').click();
    await expect(page.locator('h1')).toContainText('Presence');
    expect(await page.locator('.hero-line').evaluateAll(lines => lines.every(line => line.scrollWidth <= line.clientWidth + 2))).toBe(true);
    await expect(page.locator('#flow-phase-cue')).toHaveText('Arrive and prepare for practice.');
    await expect(page.locator('#audio-vol')).toHaveAttribute('aria-label', 'Volume');
    await expect(page.locator('[data-cv-link]').first()).toHaveAttribute('href', './assets/CV_Gracian_Baena_Yoga_EN.pdf');
    await page.locator('[data-set-theme="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const toggle = page.locator('.menu-toggle');
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
      await toggle.click();
      await page.locator('#nav a[href="#contacto"]').click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    }
    await page.locator('#contacto').scrollIntoViewIfNeeded();
    await expect(page.locator('#contacto a[href^="mailto:"]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('[data-set-lang="es"]').click();
    await page.locator('[data-set-theme="light"]').click();
    await expect(page.locator('h1')).toContainText('Presencia');
    expect(errors).toEqual([]);
    await test.info().attach("contact-light", { body: await page.screenshot({ animations: "disabled" }), contentType: "image/png" });
  });
}

test('complete practice, pause clocks, resume, previous and reset', async ({ page }) => {
  test.setTimeout(60000);
  const errors = await open(page);
  const clickControl = async action => {
    const button = page.locator(`[data-flow-action="${action}"]`);
    await button.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await button.click();
  };
  await clickControl('start');
  await expect(page.locator('#flow-state')).toHaveText('EN PRÁCTICA');
  await expect(page.locator('#flow-session-time')).not.toHaveText('00:00');
  await clickControl('pause');
  const paused = await page.locator('#flow-session-time').textContent();
  await page.waitForTimeout(1100);
  await expect(page.locator('#flow-session-time')).toHaveText(paused);
  await clickControl('pause');
  await clickControl('next');
  await expect(page.locator('#flow-phase-label')).toHaveText('CENTRADO');
  await clickControl('previous');
  await expect(page.locator('#flow-phase-label')).toHaveText('INICIO');
  for (let phase = 0; phase < 9; phase++) await clickControl('next');
  await expect(page.locator('#flow-state')).toHaveText('COMPLETADA');
  await expect(page.locator('[data-flow-action="next"]')).toBeDisabled();
  await clickControl('reset');
  await expect(page.locator('#flow-session-time')).toHaveText('00:00');
  await expect(page.locator('#flow-state')).toHaveText('EN ESPERA');
  expect(errors).toEqual([]);
});

test('ritual persistence, breathing, quiet mode and audio controls', async ({ page }) => {
  const errors = await open(page);
  await page.locator('[data-practice="focus"]').click();
  await page.reload();
  await expect(page.locator('#ritual-state')).toHaveText('Afinar');
  await page.locator('.sanctuary-breath').click();
  await expect(page.locator('.sanctuary-breath')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.sanctuary-breath').click();
  await expect(page.locator('.sanctuary-breath')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('.sanctuary-quiet').click();
  await expect(page.locator('body')).toHaveClass(/quiet-mode/);
  await page.reload();
  await expect(page.locator('body')).toHaveClass(/quiet-mode/);
  await page.locator('#audio-play').evaluate(button => button.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.locator('#audio-play').click();
  await expect.poll(() => page.locator('#focus-audio').evaluate(audio => audio.paused)).toBe(false);
  await page.locator('#audio-mute').click();
  await expect.poll(() => page.locator('#focus-audio').evaluate(audio => audio.muted)).toBe(true);
  await page.locator('#audio-play').click();
  await expect.poll(() => page.locator('#focus-audio').evaluate(audio => audio.paused)).toBe(true);
  expect(errors).toEqual([]);
});

test('blocked storage and missing optional APIs preserve core controls', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked storage'); } });
    window.matchMedia = undefined;
    window.requestAnimationFrame = undefined;
    window.cancelAnimationFrame = undefined;
    window.IntersectionObserver = undefined;
    HTMLCanvasElement.prototype.getContext = () => { throw new Error('canvas unavailable'); };
  });
  const errors = await open(page);
  await page.locator('[data-set-lang="en"]').click();
  await expect(page.locator('h1')).toContainText('Presence');
  await page.locator('[data-flow-action="start"]').click();
  await expect(page.locator('#flow-state')).toHaveText('PRACTICE');
  await page.locator('.sanctuary-breath').click();
  await expect(page.locator('.sanctuary-breath')).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('browser method bindings retain their receiver', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeFrame = window.requestAnimationFrame;
    const nativeMedia = window.matchMedia;
    window.requestAnimationFrame = function(callback) {
      if (this !== window) throw new Error('unbound requestAnimationFrame');
      return nativeFrame.call(window, callback);
    };
    window.matchMedia = function(query) {
      if (this !== window) throw new Error('unbound matchMedia');
      return nativeMedia.call(window, query);
    };
  });
  const errors = await open(page);
  await page.locator('.sanctuary-breath').click();
  await page.locator('[data-set-lang="en"]').click();
  await expect(page.locator('h1')).toContainText('Presence');
  expect(errors).toEqual([]);
});

test('reduced motion, accessibility and document links', async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = await open(page);
  await expect(page.locator('.zintro')).toBeHidden();
  for (const theme of ['light', 'dark']) {
    await page.locator(`[data-set-theme="${theme}"]`).click();
    const result = await new AxeBuilder({ page }).options({ preload: false }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  }
  for (const path of ['./assets/CV_Gracian_Baena_Yoga_ES.pdf', './assets/CV_Gracian_Baena_Yoga_EN.pdf', './Gracian_Baena_Carta_Yoga_ES.pdf', './Gracian_Baena_Cover_Letter_Yoga_EN.pdf']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect((await response.body()).subarray(0,4).toString()).toBe('%PDF');
  }
  await page.goto('/cv.html');
  await page.locator('#en').click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  expect(errors).toEqual([]);
});

test('living guide follows all ten phases, pauses and restores full practice timing', async ({ page }) => {
  test.setTimeout(60000);
  let now = Date.parse('2026-10-07T10:00:00Z');
  await page.clock.setFixedTime(now);
  const errors = await open(page);
  const guide = page.locator('#flow-guide');
  const clickAction = async action => {
    const button = page.locator(`[data-flow-action="${action}"]`);
    await button.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await button.click();
  };
  await expect(guide).toHaveAttribute('data-phase','start');
  await clickAction('preview');
  await expect(page.locator('#flow-phase-target')).toHaveText('00:05');
  await clickAction('pause');
  now += 10000; await page.clock.setFixedTime(now);
  await expect(guide).toHaveAttribute('data-status','paused');
  expect(await guide.locator('.is-current .guide-body').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  await expect(guide).toHaveAttribute('data-phase','start');
  await clickAction('pause');
  const phases = ['centering','breath','warmup','pose-1','transition','pose-2','cooldown','savasana','finish'];
  for (const phase of phases) {
    now += 5000; await page.clock.setFixedTime(now);
    await expect(guide).toHaveAttribute('data-phase',phase);
    await expect(guide.locator('.guide-pose.is-current')).toHaveCount(1);
    if (phase === 'pose-1') {
      await guide.scrollIntoViewIfNeeded();
      await test.info().attach('guide-warrior-light', { body: await guide.screenshot({ animations: 'disabled' }), contentType: 'image/png' });
    }
  }
  await expect(guide).toHaveAttribute('data-status','finished');
  await page.locator('[data-set-lang="en"]').click();
  await expect(page.locator('#guide-pose-name')).toHaveText('A moment of gratitude');
  await clickAction('start');
  await expect(page.locator('#flow-phase-target')).toHaveText('00:30');
  await clickAction('next');
  await clickAction('previous');
  await expect(guide).toHaveAttribute('data-phase','start');
  await clickAction('reset');
  await expect(guide).toHaveAttribute('data-status','idle');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await guide.locator('.is-current .guide-body').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.locator('[data-set-theme="dark"]').click();
  await page.setViewportSize({ width: 320, height: 900 });
  await guide.scrollIntoViewIfNeeded();
  await test.info().attach('guide-mobile-dark', { body: await guide.screenshot({ animations: 'disabled' }), contentType: 'image/png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
