const {test,expect}=require('@playwright/test');
async function guideFor(page){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route('https://vortex-gilt-xi.vercel.app/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html>'}));
 await page.addInitScript(()=>{try{sessionStorage.setItem('gb-yoga-intro-seen','1')}catch(_){}});
 await page.goto('/');
 const guide=page.locator('#flow-guide');
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:12000});
 return guide;
}
test('D12: central spiral horn, mature body and new tail appear in both Yin/Yang',async({page})=>{
 const guide=await guideFor(page);
 for(const spirit of ['yang','yin']){
  await guide.locator('[data-yy-form="'+spirit+'"]').evaluate(el=>el.click());
  await expect(guide).toHaveAttribute('data-spirit',spirit);
  const pose=guide.locator('.yy-pose.is-current');
  await expect(pose.locator('.yy-d12-unicorn-core')).toHaveCount(1);
  await expect(pose.locator('.yy-d12-unicorn-spiral')).toHaveCount(1);
  await expect(pose.locator('.yy-eye-closed')).toHaveCount(2);
  await expect(pose.locator('.yy-d12-body-shell')).toHaveCount(1);
  await expect(pose.locator('.yy-d12-tail-shell')).toHaveCount(1);
  await expect(pose.locator('.yy-d12-tail-plume')).toHaveCount(1);
  await expect(pose.locator('.yy-tail-fur,.yy-tail-band,.yy-third-eye')).toHaveCount(0);
  await expect(pose.locator('.yy-d12-tail-shell')).toHaveCSS('fill',/url\("#yy-d12-tail"\)/);
  await expect(pose.locator('.yy-d12-unicorn-core')).toHaveCSS('fill',/url\("#yy-d12-unicorn"\)/);
 }
});
test('D12: entire long tail fits 320px mobile crop at rest/cat-cow/savasana',async({page})=>{
 const guide=await guideFor(page);
 await page.setViewportSize({width:320,height:840});
 for(const phase of ['start','warmup','savasana']){
  const m=await guide.evaluate((root,id)=>{
   const pose=root.querySelector('.yy-pose[data-pose="'+id+'"]');
   const stage=root.querySelector('.yy-stage').getBoundingClientRect();
   const head=pose.querySelector('.yy-d12-unicorn-core').getBoundingClientRect();
   const tail=pose.querySelector('.yy-d12-tail').getBoundingClientRect();
   return {stage:[stage.left,stage.right,stage.top],tail:[tail.left,tail.right],horn:head.top};
  },phase);
  expect(m.tail[0]).toBeGreaterThanOrEqual(m.stage[0]-8);
  expect(m.tail[1]).toBeLessThanOrEqual(m.stage[1]+8);
  expect(m.horn).toBeGreaterThanOrEqual(m.stage[2]-8);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('D12: ornamental plume freezes under pause and respects quiet/reduced motion',async({page})=>{
 const guide=await guideFor(page);
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-asana-state','running');
 const plume=guide.locator('.yy-pose.is-current .yy-d12-tail-plume');
 await expect(plume).toHaveCSS('animation-name','yy-d12-tail-tip');
 await page.locator('[data-flow-action="pause"]').evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-asana-state','paused');
 await expect(plume).toHaveCSS('animation-play-state','paused');
 await page.evaluate(()=>document.body.classList.add('quiet-mode'));
 await expect(guide).toHaveAttribute('data-asana-state','reduced');
 await expect(plume).toHaveCSS('animation-name','none');
});
test('D12: OS reduced motion eliminates caudal animation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const guide=await guideFor(page);
 const plume=guide.locator('.yy-pose.is-current .yy-d12-tail-plume');
 await expect(plume).toHaveCSS('animation-name','none');
});
