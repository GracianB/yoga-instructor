const {test,expect}=require('@playwright/test');
test('D16: two folded shoulder wings and one unicorn horn in both energies',async({page})=>{
 await page.goto('/');
 const root=page.locator('#flow-guide');
 await expect(root).toHaveAttribute('data-ready','true',{timeout:12000});
 for(const spirit of ['yin','yang']){
   await root.locator('[data-yy-form="'+spirit+'"]').evaluate(el=>el.click());
   await expect(root).toHaveAttribute('data-spirit',spirit);
   const active=root.locator('.yy-pose.is-current');
   await expect(active.locator('.yy-d16-wing')).toHaveCount(2);
   await expect(active.locator('.yy-d16-breath-arch')).toHaveCount(1);
   await expect(active.locator('.yy-d12-unicorn-core')).toHaveCount(1);
   await expect(active.locator('.yy-eye-closed')).toHaveCount(2);
 }
});
test('D16: compact wings and cinematic passage in 320px cat-cow',async({page})=>{
 await page.setViewportSize({width:320,height:760});
 await page.goto('/');
 const root=page.locator('#flow-guide');
 await expect(root).toHaveAttribute('data-ready','true',{timeout:12000});
 await page.locator('[data-flow-action="start"]').evaluate(e=>e.click());
 for(const phase of ['centering','breath','warmup']){
   await expect(root).toHaveAttribute('data-ready','true',{timeout:8000});
   await page.locator('[data-flow-action="next"]').evaluate(e=>e.click());
   await expect(root).toHaveAttribute('data-phase',phase);
 }
 await expect(root).toHaveAttribute('data-ready','true',{timeout:8000});
 await expect(root.locator('.yy-pose.is-current .yy-d16-wings')).toHaveAttribute('data-fold','rest');
 await expect(root.locator('.yy-stage')).toHaveAttribute('data-passage','ground');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(root.locator('.yy-pose.is-current .yy-d16-wing').first()).toHaveCSS('animation-name','none');
});
