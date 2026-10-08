const { test, expect } = require('@playwright/test');

async function openPractice(page){
  await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
  await page.route('https://vortex-gilt-xi.vercel.app/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html></html>'}));
  await page.addInitScript(()=>{try{sessionStorage.setItem('gb-yoga-intro-seen','1');}catch(_){}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text())});
  await page.goto('/');
  await expect(page.locator('#flow-guide')).toHaveAttribute('data-ready','true',{timeout:10000});
  return errors;
}

test('D6: one-click start, no idle Next, separated pause/reset and clean reset',async ({page})=>{
  test.setTimeout(80000);
  const errors=await openPractice(page);
  const guide=page.locator('#flow-guide');
  const start=page.locator('[data-flow-action="start"]');
  const next=page.locator('[data-flow-action="next"]');
  const pause=page.locator('[data-flow-action="pause"]');
  const reset=page.locator('[data-flow-action="reset"]');
  const controls=page.locator('.flow-controls');
  await expect(start).toBeVisible();
  await expect(start).toBeEnabled();
  await expect(next).toBeDisabled();
  await expect(controls).toBeHidden();
  await next.evaluate(btn=>btn.click());
  await expect(guide).toHaveAttribute('data-status','idle');
  await start.click();
  await expect(guide).toHaveAttribute('data-phase','start');
  await expect(guide).toHaveAttribute('data-status','running');
  await expect(start).toBeHidden();
  await expect(controls).toBeVisible();
  await expect(next).toBeEnabled({timeout:8000});
  await pause.click();
  await expect(guide).toHaveAttribute('data-status','paused');
  await expect(next).toBeDisabled();
  await expect(pause).toHaveText(/Continuar|Resume/);
  await pause.click();
  await expect(guide).toHaveAttribute('data-status','running');
  await next.click();
  await expect(guide).toHaveAttribute('data-phase','centering');
  await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    const p=await pause.boundingBox(),r=await reset.boundingBox();
    expect(p&&r,'pause/reset boxes must exist').toBeTruthy();
    expect(p.x+p.width<=r.x+2||p.y+p.height<=r.y+2,'pause/reset must not overlap').toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await reset.click();
  await expect(guide).toHaveAttribute('data-status','idle');
  await expect(next).toBeDisabled();
  await expect(start).toBeVisible();
  await expect(controls).toBeHidden();
  expect(errors).toEqual([]);
});

test('D6: real calm eyes and green/blush backdrop in Yin and Yang',async ({page,browserName})=>{
  test.skip(browserName!=='chromium','Exhaustive visual matrix in Chromium; core transport is tested in every engine.');
  test.setTimeout(100000);
  const errors=await openPractice(page);
  const guide=page.locator('#flow-guide');
  await page.locator('[data-flow-action="start"]').click();
  await expect(page.locator('[data-flow-action="next"]')).toBeEnabled({timeout:8000});
  await page.locator('[data-flow-action="next"]').click();
  await expect(guide).toHaveAttribute('data-phase','centering');
  await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
  const colors={};
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    for(const spirit of ['yang','yin']){
      await guide.locator('[data-yy-form="'+spirit+'"]').click();
      await expect(guide).toHaveAttribute('data-spirit',spirit);
      const eyes=guide.locator('.yy-pose.is-current .yy-eye-core');
      await expect(eyes).toHaveCount(2);
      await expect(guide.locator('.yy-pose.is-current .yy-eye-center')).toHaveCount(2);
      for(const eye of await eyes.all()){await expect(eye).toBeVisible();}
      colors[spirit]=await eyes.first().evaluate(el=>getComputedStyle(el).fill);
      const stage=await guide.locator('.yy-stage').evaluate(el=>getComputedStyle(el).backgroundImage);
      expect(stage).toContain('gradient');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(width===390||width===1440){
        await test.info().attach('d6-eye-stage-'+width+'-'+spirit,{
          body:await guide.screenshot({animations:'disabled'}),contentType:'image/png'
        });
      }
    }
    expect(colors.yang).not.toBe(colors.yin);
  }
  expect(errors).toEqual([]);
});
