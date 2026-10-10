const {test,expect}=require('@playwright/test');

/* Captures all authored asanas and both guided companions as CI artifacts.
   These screenshots are an art-review aid, never a substitute for human review.
   Use the existing yoga:flow event to enter each real scene. */
test('V63 visual review: ten asanas, breathing and meditation',async({page,browserName},testInfo)=>{
  test.skip(browserName!=='chromium','Art contact sheets are captured once, in Chromium');
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const guide=page.locator('#flow-guide');
  await expect(guide).toHaveAttribute('data-ready','true');
  const ids=await guide.locator('.yy-pose').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-pose')));
  expect(ids.length).toBe(10);
  for(const [i,id] of ids.entries()){
    await page.evaluate(({id,i})=>{
      const snapshot=window.YOGA_FLOW.create().snapshot();
      window.dispatchEvent(new CustomEvent('yoga:flow',{detail:{...snapshot,phase:id,index:i}}));
    },{id,i});
    await expect(guide).toHaveAttribute('data-phase',id);
    await expect(guide.locator('.yy-pose.is-current')).toHaveCount(1);
    await page.waitForTimeout(600);
    await guide.locator('.yy-stage').screenshot({path:testInfo.outputPath('asana-'+String(i+1).padStart(2,'0')+'-'+id+'.png')});
  }
  const studio=page.locator('#studio-guided');
  await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
  await expect(studio.locator('.studio-breath-dragon')).toBeVisible();
  await studio.locator('.studio-companion').screenshot({path:testInfo.outputPath('guardian-breath.png')});
  await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
  await expect(studio.locator('.meditation-guardian')).toBeVisible();
  await studio.locator('.studio-companion').screenshot({path:testInfo.outputPath('guardian-meditation.png')});
});
