const {test,expect}=require('@playwright/test');
async function guide(page){
 await page.goto('/');
 const root=page.locator('#flow-guide');
 await expect(root).toHaveAttribute('data-ready','true',{timeout:12000});
 return root;
}
test('D17: curved sockets, closed eyes and unicorn in both Yin and Yang',async({page})=>{
 const root=await guide(page);
 for(const form of ['yin','yang']){
  await root.locator('[data-yy-form="'+form+'"]').evaluate(e=>e.click());
  await expect(root).toHaveAttribute('data-spirit',form);
  const pose=root.locator('.yy-pose.is-current');
  await expect(pose.locator('.yy-d17-attachment')).toHaveCount(4);
  await expect(pose.locator('.yy-d17-root-blend')).toHaveCount(4);
  await expect(pose.locator('.yy-paw-group')).toHaveCount(4);
  await expect(pose.locator('.yy-eye-closed')).toHaveCount(2);
  await expect(pose.locator('.yy-d12-unicorn-core')).toHaveCount(1);
 }
});
test('D17: mobile reclining remains within scene; flow is alive but grounded',async({page})=>{
 test.setTimeout(25000);
 await page.setViewportSize({width:320,height:760});
 const root=await guide(page);
 await page.locator('[data-flow-action="start"]').evaluate(e=>e.click());
 const order=['centering','breath','warmup','pose-1','transition'];
 for(const phase of order){
  await expect(root).toHaveAttribute('data-ready','true',{timeout:8000});
  await page.locator('[data-flow-action="next"]').evaluate(e=>e.click());
  await expect(root).toHaveAttribute('data-phase',phase);
 }
 await expect(root).toHaveAttribute('data-ready','true',{timeout:8000});
 const active=root.locator('.yy-pose.is-current');
 await expect(active.locator('.yy-d17-attachment')).toHaveCount(4);
 await expect(active.locator('.yy-d15-pressure-mark')).toHaveCount(2);
 await expect(active.locator('.yy-d15-expression-smile')).toHaveCount(1);
 await expect(active.locator('.yy-arms')).toHaveCSS('animation-name','yy-d17-flow-gesture');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('[data-flow-action="pause"]').evaluate(e=>e.click());
 await expect(active.locator('.yy-arms')).toHaveCSS('animation-play-state','paused');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(active.locator('.yy-arms')).toHaveCSS('animation-name','none');
});
