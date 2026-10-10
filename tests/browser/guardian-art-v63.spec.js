const {test,expect}=require('@playwright/test');

test('V63 guardians retain one silhouette and their existing anatomy anchors',async({page})=>{
  await page.goto('/');
  const theater=page.locator('#flow-guide');
  await expect(theater.locator('.movement-guardian')).toHaveCount(10);
  const necks=theater.locator('.movement-guardian .mg-neck');
  await expect(necks).toHaveCount(10);
  const paths=await necks.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('d')));
  expect(paths.every(path=>path.startsWith('M')&&path.endsWith('Z')&&!/NaN|Infinity/.test(path))).toBe(true);
  await expect(theater.locator('.movement-guardian .mg-snout')).toHaveCount(10);
  const breath=page.locator('#studio-guided .studio-companion > .studio-breath-dragon');
  const meditation=page.locator('#studio-guided .studio-companion > .meditation-guardian');
  await expect(breath).toHaveCount(1);
  await expect(meditation).toHaveCount(1);
  await expect(breath.locator('.sd31-breath-core')).toHaveCount(1);
  await expect(breath.locator('.sd31-wings')).toHaveCount(1);
  await expect(meditation.locator('.uma-arm-left')).toHaveCount(1);
  await expect(meditation.locator('.uma-arm-right')).toHaveCount(1);
  await expect(meditation.locator('.uma-closed-eyes')).toHaveCount(1);
});

test('V63 guardian stage remains robust on narrow viewport',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto('/');
  const stage=page.locator('#flow-guide .yy-stage');
  const rect=await stage.boundingBox();
  expect(rect).toBeTruthy();
  expect(rect.width).toBeLessThanOrEqual(375);
  await expect(page.locator('#flow-guide .yy-pose.is-current .movement-guardian .mg-neck')).toHaveCount(1);
});


test('V64 breathing wings follow existing clock and respect reduced motion',async({page})=>{
  await page.goto('/');
  await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
  const studio=page.locator('#studio-guided');
  const wings=studio.locator('.studio-breath-dragon .sd31-wings');
  await expect(wings).toBeVisible();
  const scaled=await studio.evaluate(el=>{
    el.style.setProperty('--studio-guardian-wing','1.06');
    const wings=el.querySelector('.sd31-wings');
    return getComputedStyle(wings).transform;
  });
  expect(scaled).not.toBe('none');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(wings).toHaveCSS('transform','none');
  await page.setViewportSize({width:375,height:812});
  await expect(studio.locator('.studio-breath-dragon')).toHaveCSS('filter','none');
});
