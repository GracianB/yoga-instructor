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
  // Exercise every engine transition deterministically; pointer behavior is
  // covered separately. Scroll/hover animations must not drop a virtual click.
  for (let phase = 0; phase < 9; phase++) {
    await expect(page.locator('#flow-guide')).toHaveAttribute('data-ready','true',{timeout:8000});
    await page.locator('[data-flow-action="next"]').evaluate(button => button.click());
    await expect(page.locator('#flow-phase-meta')).toHaveText(`${phase + 2} / 10`);
  }
  await expect(page.locator('#flow-state')).toHaveText('COMPLETADA');
  await expect(page.locator('[data-flow-action="next"]')).toBeDisabled();
  await clickControl('reset');
  await expect(page.locator('#flow-session-time')).toHaveText('00:00');
  await expect(page.locator('#flow-state')).toHaveText('EN ESPERA');
  expect(errors).toEqual([]);
});

test('ritual persistence, breathing, quiet mode and audio controls', async ({ page }) => {
  const errors = await open(page);
  await page.locator('[data-practice="focus"]').evaluate(button=>button.click());
  await expect(page.locator('#ritual-state')).toHaveText('Afinar');
  expect(await page.evaluate(() => localStorage.getItem('gb-yoga-practice'))).toBe('focus');
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

test('Yin Yang ten-phase yoga flow: distinct poses, navigation gate and 4-7-8 dock', async ({ page }) => {
  test.setTimeout(90000);
  const errors=await open(page);
  const guide=page.locator('#flow-guide');
  await expect(guide).toHaveClass(/yy-guide/);
  await expect(guide).toHaveAttribute('data-ready','true');
  expect(await guide.locator('.yy-pose').count()).toBe(10);
  await guide.locator('[data-yy-form="yin"]').evaluate(button=>button.click());
  await expect(guide).toHaveAttribute('data-spirit','yin');
  await guide.locator('[data-yy-form="yang"]').evaluate(button=>button.click());
  await expect(guide).toHaveAttribute('data-spirit','yang');
  const trigger=async action=>page.locator('[data-flow-action="'+action+'"]').evaluate(button=>button.click());
  await expect(page.locator('[data-flow-action="preview"]')).toBeEnabled();
  await trigger('preview');
  await expect(guide).toHaveAttribute('data-status','running');
  await expect(page.locator('#flow-phase-target')).toHaveText('00:05');
  await trigger('pause');
  await expect(guide).toHaveAttribute('data-status','paused');
  await trigger('pause');
  await expect(guide).toHaveAttribute('data-status','running');
  const phases=['centering','breath','warmup','pose-1','transition','pose-2','cooldown','savasana','finish'];
  for(const id of phases){
    await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
    await page.locator('[data-flow-action="next"]').evaluate(el=>el.click());
    await expect(guide).toHaveAttribute('data-phase',id);
    await expect(guide.locator('.yy-pose.is-current')).toHaveCount(1,{timeout:8000});
    await expect(guide.locator('.yy-pose.is-current')).toHaveAttribute('data-pose',id);
    if(id!=='finish')await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
    if(id==='breath'){
      await expect(page.locator('.sanctuary-dock')).toHaveClass(/yy-dock-active/);
      await expect(guide.locator('.yy-breath-panel')).toHaveAttribute('aria-hidden','false');
    }
    if(['breath','pose-1','pose-2','savasana'].includes(id)){
      await guide.evaluate(el=>{
        el.scrollIntoView({block:'start',behavior:'instant'});
        window.scrollBy({top:-128,behavior:'instant'});
      });
      await test.info().attach('yin-yang-'+id,{body:await guide.screenshot({animations:'disabled'}),contentType:'image/png'});
    }
  }
  await expect(guide).toHaveAttribute('data-status','finished');
  await page.locator('[data-set-lang="en"]').click();
  await expect(page.locator('#guide-pose-name')).toHaveText('A moment of gratitude');
  await page.locator('[data-flow-action="reset"]').click();
  await expect(guide).toHaveAttribute('data-phase','start');
  await expect(page.locator('#flow-state')).toHaveText('IDLE');
  expect(errors).toEqual([]);
});

test('saved ritual is restored even when animation frames never run', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('gb-yoga-practice', 'focus');
    // Browsers can suppress animation callbacks when a tab is hidden.
    window.requestAnimationFrame = () => 0;
  });
  const errors = await open(page);
  await expect(page.locator('#ritual-state')).toHaveText('Afinar');
  await expect(page.locator('.ritual-choice[data-practice="focus"]')).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('Yin Yang visual matrix: desktop/mobile, both energies, reduced motion and no overflow', async ({page})=>{
  test.setTimeout(90000);
  const errors=await open(page);
  await page.emulateMedia({reducedMotion:'reduce'});
  const guide=page.locator('#flow-guide');
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    await expect(guide.locator(".yy-svg")).toHaveAttribute("viewBox",width<=700?"120 0 480 435":"0 0 720 460");
    for(const form of ['yin','yang']){
      await guide.locator('[data-yy-form="'+form+'"]').evaluate(button=>button.click());
      await expect(guide).toHaveAttribute('data-spirit',form);
      await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
      await expect(guide).toHaveAttribute('data-ready','true');
      for(let i=0;i<4;i++){
        await page.locator('[data-flow-action="next"]').evaluate(el=>el.click());
        await expect(guide).toHaveAttribute('data-ready','true');
      }
      await expect(guide).toHaveAttribute('data-phase','pose-1');
      expect(await guide.locator('.yy-pose[data-pose="pose-1"] [data-limb^="leg-"]').count()).toBe(2);
      expect(await guide.locator('.yy-pose[data-pose="pose-1"] [data-limb^="arm-"]').count()).toBe(2);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(width===320||width===1440){
        await guide.evaluate(el=>{
          el.scrollIntoView({block:'start',behavior:'instant'});
          window.scrollBy({top:-128,behavior:'instant'});
        });
        await test.info().attach('yin-yang-'+form+'-'+width,{body:await guide.screenshot({animations:'disabled'}),contentType:'image/png'});
      }
      await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
      await expect(guide).toHaveAttribute('data-ready','true');
    }
  }
  expect(errors).toEqual([]);
});


test('Phase B: cat-cow visibly flexes back with anchored paws and freezes on pause', async ({page})=>{
  test.setTimeout(60000);
  const errors=await open(page);
  const guide=page.locator('#flow-guide');
  const act=async action=>page.locator('[data-flow-action="'+action+'"]').evaluate(el=>el.click());
  await expect(guide).toHaveAttribute('data-ready','true');
  await act('preview');
  await expect(guide).toHaveAttribute('data-status','running');
  for(const phase of ['centering','breath','warmup']){
    await expect(guide).toHaveAttribute('data-ready','true');
    await act('next');
    await expect(guide).toHaveAttribute('data-phase',phase);
  }
  await expect(guide).toHaveAttribute('data-ready','true');
  await expect(guide).toHaveAttribute('data-asana-state','running');
  const back=guide.locator('.yy-pose[data-pose="warmup"] [data-asana-back]');
  const spine=guide.locator('.yy-pose[data-pose="warmup"] [data-asana-spine]');
  const belly=guide.locator('.yy-pose[data-pose="warmup"] [data-asana-belly]');
  const grounded=await guide.locator('.yy-pose[data-pose="warmup"] .yy-paw-group').evaluateAll(nodes=>nodes.map(n=>n.getAttribute("transform")));
  expect(await guide.locator('.yy-pose[data-pose="warmup"] [data-limb^="arm-"]').count()).toBe(2);
  expect(await guide.locator('.yy-pose[data-pose="warmup"] [data-limb^="leg-"]').count()).toBe(2);
  const initial=await back.getAttribute('d');
  await page.waitForTimeout(650);
  const animated=await back.getAttribute('d');
  expect(animated).not.toBe(initial);
  const bellyA=await belly.getAttribute('d');
  await page.waitForTimeout(590);
  expect(await belly.getAttribute('d')).not.toBe(bellyA);
  expect(await guide.locator('.yy-pose[data-pose="warmup"] .yy-paw-group')
    .evaluateAll(nodes=>nodes.map(n=>n.getAttribute("transform")))).toEqual(grounded);
  const spineNow=await spine.getAttribute('d');
  expect(spineNow).toContain('Q0 ');
  await act('pause');
  await expect(guide).toHaveAttribute('data-asana-state','paused');
  const frozen=await back.getAttribute('d');
  await page.waitForTimeout(450);
  expect(await back.getAttribute('d')).toBe(frozen);
  await act('pause');
  await expect(guide).toHaveAttribute('data-asana-state','running');
  await page.waitForTimeout(600);
  expect(await back.getAttribute('d')).not.toBe(frozen);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(guide).toHaveAttribute('data-asana-state','reduced');
  const reduced=await back.getAttribute('d');
  await page.waitForTimeout(420);
  expect(await back.getAttribute('d')).toBe(reduced);
  await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
  await expect(guide).toHaveAttribute('data-phase','start');
  expect(errors).toEqual([]);
});

test('Phase B: each asana has a separate movement recipe and reduced-motion disables it', async ({page})=>{
  const errors=await open(page);
  const guide=page.locator('#flow-guide');
  const act=action=>page.locator('[data-flow-action="'+action+'"]').evaluate(el=>el.click());
  await expect(guide).toHaveAttribute('data-ready','true');
  await act('preview');
  const samples=[
    ['start','.yy-character'],
    ['centering','.yy-character'],
    ['breath','.yy-character'],
    ['warmup','.yy-head-motion'],
    ['pose-1','.yy-head-motion'],
    ['transition','.yy-character'],
    ['pose-2','.yy-character'],
    ['cooldown','.yy-head-motion'],
    ['savasana','.yy-character'],
    ['finish','.yy-head-motion']
  ];
  for(let i=0;i<samples.length;i++){
    if(i){
      await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
      await act('next');
    }
    await expect(guide).toHaveAttribute('data-phase',samples[i][0]);
    await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
    if(samples[i][0]==='warmup'){
      await expect(guide).toHaveAttribute('data-asana-state','running');
      await expect(guide.locator('.yy-asana-step')).toBeVisible();
    }else{
      const animation=await guide.locator('.yy-pose.is-current '+samples[i][1]).first()
        .evaluate(el=>getComputedStyle(el).animationName);
      expect(animation).not.toBe('none');
    }
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
  await expect(guide).toHaveAttribute('data-asana-state','reduced');
  const animation=await guide.locator('.yy-pose.is-current .yy-character').evaluate(el=>getComputedStyle(el).animationName);
  expect(animation).toBe('none');
  expect(errors).toEqual([]);
});


test('Phase C: compact theater, actual side buttons, 320-1440 layouts and serious dual form', async ({page})=>{
 test.setTimeout(90000);
 const errors=await open(page);
 const theater=page.locator('.flow-theater');
 const guide=page.locator('#flow-guide');
 const left=theater.locator('[data-flow-action="previous"]');
 const right=theater.locator('[data-flow-action="next"]');
 await expect(theater).toBeVisible();
 expect(await page.locator('[data-flow-action="previous"]').count()).toBe(1);
 expect(await page.locator('[data-flow-action="next"]').count()).toBe(1);
 for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const variant of ['yang','yin']){
     await guide.locator('[data-yy-form="'+variant+'"]').evaluate(el=>el.click());
     await expect(guide).toHaveAttribute('data-spirit',variant);
     const g=await guide.boundingBox(),l=await left.boundingBox(),r=await right.boundingBox();
     expect(g && l && r).toBeTruthy();
     expect(l.x+l.width/2).toBeLessThan(g.x+Math.min(g.width/3,60));
     expect(r.x+r.width/2).toBeGreaterThan(g.x+g.width-Math.min(g.width/3,60));
     expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
     const stage=await page.locator('.yy-stage').boundingBox();
     expect(stage.height).toBeLessThanOrEqual(width<=700?321:366);
     if(width===320||width===1440){
       await theater.evaluate(el=>{el.scrollIntoView({behavior:'instant',block:'start'});scrollBy(0,-125);});
       await test.info().attach('phase-c-'+variant+'-'+width,{
         body:await theater.screenshot({animations:'disabled'}),contentType:'image/png'
       });
     }
   }
 }
 await expect(left).toHaveAttribute('aria-label','Postura anterior');
 await expect(right).toHaveAttribute('aria-label','Postura siguiente');
 await page.locator('[data-set-lang="en"]').evaluate(el=>el.click());
 await expect(left).toHaveAttribute('aria-label','Previous pose');
 await expect(right).toHaveAttribute('aria-label','Next pose');
 expect(errors).toEqual([]);
});


test('Phase D1: calm Yin/Yang guardian eyes in awake and resting asanas',async ({page})=>{
  test.setTimeout(80000);
  const errors=await open(page);
  const guide=page.locator('#flow-guide');
  await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
  const act=action=>page.locator('[data-flow-action="'+action+'"]').evaluate(el=>el.click());
  // All ten authored faces use one identical, intentionally non-human eye style.
  expect(await guide.locator('.yy-eye-white,.yy-pupil,.yy-heavy-lid').count()).toBe(0);
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});
    for(const form of ['yin','yang']){
      await guide.locator('[data-yy-form="'+form+'"]').evaluate(el=>el.click());
      await expect(guide).toHaveAttribute('data-spirit',form);
      await expect(guide.locator('.yy-pose.is-current .yy-eye-closed')).toHaveCount(1);
      await act('preview');
      for(const phase of ['centering','breath','warmup','pose-1']){
        await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
        await act('next');
        await expect(guide).toHaveAttribute('data-phase',phase);
      }
      await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
      const face=guide.locator('.yy-pose.is-current .yy-head');
      await expect(face.locator('.yy-eye-almond')).toHaveCount(2);
      await expect(face.locator('.yy-guardian-lid')).toHaveCount(1);
      const eyeStyle=await face.locator('.yy-eye-almond').first().evaluate(el=>{
        const s=getComputedStyle(el);
        return {fill:s.fill,stroke:s.stroke,opacity:s.opacity};
      });
      expect(eyeStyle.fill).not.toBe('rgb(255, 255, 255)');
      expect(eyeStyle.opacity).not.toBe('0');
      if(width===390||width===1440){
        await guide.evaluate(el=>{el.scrollIntoView({behavior:'instant',block:'start'});scrollBy(0,-120);});
        await test.info().attach('d1-guardian-'+form+'-'+width,{
          body:await guide.screenshot({animations:'disabled'}),contentType:'image/png'
        });
      }
      await act('reset');
      await expect(guide).toHaveAttribute('data-phase','start');
      await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
    }
  }
  expect(errors).toEqual([]);
});

test('D2/D3: ten postures in Yin/Yang with non-overlapping rails and green sanctuary', async ({page,browserName})=>{
 test.skip(browserName !== 'chromium', 'Exhaustive matrix on Chromium; cross-browser regression covered by the existing suite.');
 test.setTimeout(150000);
 const errors=await open(page);
 const guide=page.locator('#flow-guide');
 const theater=page.locator('.flow-theater');
 const left=theater.locator('[data-flow-action="previous"]');
 const right=theater.locator('[data-flow-action="next"]');
 const act=action=>page.locator('[data-flow-action="'+action+'"]').evaluate(el=>el.click());
 const expected=['start','centering','breath','warmup','pose-1','transition','pose-2','cooldown','savasana','finish'];
 for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const theme of ['light','dark']){
     await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
     for(const spirit of ['yin','yang']){
       await guide.locator('[data-yy-form="'+spirit+'"]').evaluate(el=>el.click());
       await expect(guide).toHaveAttribute('data-spirit',spirit);
       await act('reset');
       await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
       await act('preview');
       for(let i=0;i<expected.length;i++){
         if(i){await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});await act('next');}
         await expect(guide).toHaveAttribute('data-phase',expected[i]);
         await expect(guide.locator('.yy-pose.is-current')).toHaveCount(1);
       }
       const bounds=await Promise.all([guide.boundingBox(),left.boundingBox(),right.boundingBox()]);
       const [g,l,r]=bounds;
       expect(g&&l&&r).toBeTruthy();
       expect(l.x+l.width).toBeLessThanOrEqual(g.x+2);
       expect(r.x).toBeGreaterThanOrEqual(g.x+g.width-2);
       expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
       const bg=await page.locator('#instructor-flow').evaluate(el=>getComputedStyle(el).backgroundImage);
       expect(bg).toContain('gradient');
       const stage=await guide.locator('.yy-stage').evaluate(el=>getComputedStyle(el).backgroundImage);
       expect(stage).toContain('gradient');
       if(width===390||width===1440){
         await test.info().attach('d23-'+spirit+'-'+theme+'-'+width,{
           body:await theater.screenshot({animations:'disabled'}),contentType:'image/png'
         });
       }
     }
   }
 }
 expect(errors).toEqual([]);
});

test('D4 audio player shows only the correct Play/Pause icon',async ({page})=>{
 const errors=await open(page);
 const player=page.locator('#focus-player');
 const button=player.locator('#audio-play');
 const playIcon=button.locator('.ico-play');
 const pauseIcon=button.locator('.ico-pause');
 await expect(button).toBeVisible();
 await expect(playIcon).toBeVisible();
 await expect(pauseIcon).toBeHidden();
 await player.evaluate(el=>el.classList.add('is-playing'));
 await expect(playIcon).toBeHidden();
 await expect(pauseIcon).toBeVisible();
 await player.evaluate(el=>el.classList.remove('is-playing'));
 await expect(playIcon).toBeVisible();
 await expect(pauseIcon).toBeHidden();
 await expect(button).toHaveAttribute('type','button');
 expect(errors).toEqual([]);
});
