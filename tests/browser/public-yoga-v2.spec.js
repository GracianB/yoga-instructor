const {test,expect}=require('@playwright/test');

test('V2 published portfolio keeps apps unavailable, while formation and route are readable',async({page})=>{
  await page.goto('/dist/index.html?lang=es',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#inicio .hero-mandala')).toBeVisible();
  await expect(page.locator('#proyectos .p26-project-card')).toHaveCount(2);
  await expect(page.locator('#instructor-flow')).toHaveCount(0);
  await expect(page.locator('#studio-asana-library')).toHaveCount(0);
  await expect(page.locator('#yoga-journey-title')).toBeVisible();
  await expect(page.locator('#yoga-credentials-title')).toBeVisible();
  await expect(page.locator('#pausa')).toBeVisible();
  await expect(page.locator('[data-pause-audio]')).toHaveJSProperty('paused',true);
  await expect(page.locator('[data-pause-toggle]')).toHaveAttribute('aria-pressed','false');
  const cssResponse=await page.request.get('/dist/yoga-showcase-v2.css');
  const jsResponse=await page.request.get('/dist/yoga-showcase-v2.js');
  expect(cssResponse.status()).toBe(200);
  expect(jsResponse.status()).toBe(200);
});

test('V2 journey calibrates route with real markers; ES/EN and keyboard work',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/index.html#experiencia',{waitUntil:'domcontentloaded'});
  const map=page.locator('[data-journey-map]');
  await expect(map).toBeVisible();
  await expect(map.locator('[data-journey-stop]')).toHaveCount(3);
  await expect(map.locator('svg')).toHaveAttribute('data-calibrated','true');
  await map.locator('[data-journey-stop="madrid"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(map.locator('[data-journey-stop="lisboa"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-journey-title]')).toContainText('Acompañar a equipos');
  await page.locator('[data-set-lang="en"]').first().click();
  await expect(page.locator('[data-journey-title]')).toContainText('Supporting teams');
  await map.locator('[data-journey-stop="murcia"]').click();
  await expect(page.locator('[data-journey-body]')).toContainText('Mood Fitness');
  const viewport=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
  expect(viewport.scroll).toBeLessThanOrEqual(viewport.view+1);
});

test('V2 30-second break never autoplays sound, can start and stop independently',async({page})=>{
  await page.goto('/index.html#proyectos',{waitUntil:'domcontentloaded'});
  const player=page.locator('[data-pause-audio]');
  const start=page.locator('[data-pause-toggle]');
  await expect(player).toHaveJSProperty('paused',true);
  await start.click();
  await expect(start).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-pause-counter]')).toContainText(/00:(29|30)/);
  await expect(player).toHaveJSProperty('paused',true);
  await start.click();
  await expect(start).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('[data-pause-counter]')).toHaveText('00:30');
  await expect(page.locator('[data-pause-sound]')).toHaveAttribute('aria-pressed','false');
});

test('V2 320px responsive and reduced-motion avoid extra UI and horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:780});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/dist/index.html?lang=en',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#pausa')).toBeVisible();
  await expect(page.locator('[data-pause-toggle]')).toBeVisible();
  await expect(page.locator('#yoga-credentials-title')).toBeVisible();
  const core=page.locator('.yoga-pause-core');
  await expect(core).toHaveCSS('transform',/matrix\(/);
  const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
  expect(noOverflow).toBe(true);
  await expect(page.locator('[data-pause-audio]')).toHaveJSProperty('paused',true);
});
