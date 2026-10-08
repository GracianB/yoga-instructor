const {test,expect}=require('@playwright/test');
async function open(page){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route('https://vortex-gilt-xi.vercel.app/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html>'}));
 await page.addInitScript(()=>{try{sessionStorage.setItem('gb-yoga-intro-seen','1')}catch(_){}});
 await page.goto('/');
 const guide=page.locator('#flow-guide');
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:10000});
 return guide;
}
test('D13: no empty stage between postures; leaving and arriving images overlap',async({page})=>{
 const guide=await open(page);
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-ready','true');
 const observed=await page.evaluate(()=>{
  document.querySelector('[data-flow-action="next"]').click();
  const root=document.querySelector('#flow-guide');
  return {
   phase:root.dataset.phase,
   ready:root.dataset.ready,
   incoming:[...root.querySelectorAll('.yy-pose.is-current')].map(x=>x.dataset.pose),
   leaving:[...root.querySelectorAll('.yy-pose.is-leaving')].map(x=>x.dataset.pose),
   entering:[...root.querySelectorAll('.yy-pose.is-entering')].map(x=>x.dataset.pose),
   duration:getComputedStyle(root.querySelector('.yy-pose.is-current')).transitionDuration
  };
 });
 expect(observed.phase).toBe('centering');
 expect(observed.ready).toBe('false');
 expect(observed.incoming).toEqual(['centering']);
 expect(observed.leaving).toEqual(['start']);
 expect(observed.entering).toEqual(['centering']);
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
 await expect(guide.locator('.yy-pose.is-current')).toHaveCount(1);
 await expect(guide.locator('.yy-pose.is-leaving,.yy-pose.is-entering')).toHaveCount(0);
});
test('D13: 320px cat/cow caudal silhouette is contained and anchored during motion',async({page})=>{
 await page.setViewportSize({width:320,height:760});
 const guide=await open(page);
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 for(const p of ['centering','breath','warmup']){
  await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
  await page.locator('[data-flow-action="next"]').evaluate(el=>el.click());
  await expect(guide).toHaveAttribute('data-phase',p);
 }
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
 await expect(guide).toHaveAttribute('data-asana-state','running');
 const m=await guide.evaluate(root=>{
  const pose=root.querySelector('.yy-pose.is-current');
  const stage=root.querySelector('.yy-stage').getBoundingClientRect();
  const tail=pose.querySelector('.yy-d13-table-tail').getBoundingClientRect();
  const pen=pose.querySelector('.yy-d12-tail-plume');
  const wrapper=pose.querySelector('.yy-tail-motion');
  return {phase:root.dataset.phase,stage:[stage.left,stage.right],tail:[tail.left,tail.right],
   plume:getComputedStyle(pen).animationName,transform:wrapper.getAttribute('transform')||''};
 });
 expect(m.phase).toBe('warmup');
 expect(m.tail[0]).toBeGreaterThanOrEqual(m.stage[0]-8);
 expect(m.tail[1]).toBeLessThanOrEqual(m.stage[1]+8);
 expect(m.plume).toBe('none');
 await expect.poll(()=>guide.locator('.yy-pose.is-current .yy-tail-motion').getAttribute('transform')).toMatch(/^rotate\(-?[\d.]+ 461 238\)$/);
 const value=await guide.locator('.yy-pose.is-current .yy-tail-motion').getAttribute('transform');
 expect(Math.abs(Number(value.match(/rotate\(([-\d.]+)/)[1]))).toBeLessThanOrEqual(1.31);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('D13: both energies keep horn/closed eyes through all ten poses',async({page})=>{
 test.setTimeout(90000); // 20 full crossfades in Firefox under parallel CI
 const guide=await open(page);
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 const next=page.locator('[data-flow-action="next"]');
 for(const spirit of ['yang','yin']){
  await guide.locator('[data-yy-form="'+spirit+'"]').evaluate(el=>el.click());
  await expect(guide).toHaveAttribute('data-spirit',spirit);
  for(let i=0;i<10;i++){
   await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
   const pose=guide.locator('.yy-pose.is-current');
   await expect(pose.locator('.yy-d12-unicorn-core')).toHaveCount(1);
   await expect(pose.locator('.yy-eye-closed')).toHaveCount(2);
   if(i<9){await next.evaluate(el=>el.click());}
  }
  if(spirit==='yang'){
    await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
    await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
    await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
  }
 }
});
test('D13: reduced-motion changes are instant, pause freezes ornament',async({page})=>{
 const guide=await open(page);
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 const feather=guide.locator('.yy-pose.is-current .yy-d12-tail-plume');
 await expect(feather).toHaveCSS('animation-name','yy-d13-tail-feather');
 await page.locator('[data-flow-action="pause"]').evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-asana-state','paused');
 await expect(feather).toHaveCSS('animation-play-state','paused');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(feather).toHaveCSS('animation-name','none');
 await page.locator('[data-flow-action="pause"]').evaluate(el=>el.click());
 await page.locator('[data-flow-action="next"]').evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:3000});
 await expect(guide.locator('.yy-pose.is-leaving,.yy-pose.is-entering')).toHaveCount(0);
});
