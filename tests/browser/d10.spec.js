const {test,expect}=require('@playwright/test');

async function openPractice(page){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route('https://vortex-gilt-xi.vercel.app/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html>'}));
 await page.addInitScript(()=>{try{sessionStorage.setItem('gb-yoga-intro-seen','1')}catch(_){}});
 await page.goto('/');
 const guide=page.locator('#flow-guide');
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:12000});
 return guide;
}

test('D10: Yin and Yang dragon ornament pauses and resumes without resetting animation',async({page})=>{
 const guide=await openPractice(page);
 await page.locator('[data-flow-action="start"]').click();
 await expect(guide).toHaveAttribute('data-asana-state','running',{timeout:8000});
 for(const spirit of ['yang','yin']){
  await guide.locator('[data-yy-form="'+spirit+'"]').click();
  await expect(guide).toHaveAttribute('data-spirit',spirit);
  const whisker=guide.locator('.yy-pose.is-current .yy-dragon-whisker').first();
  await expect(whisker).toHaveCSS('animation-name',/yy-d9-whisker/);
  await expect(whisker).toHaveCSS('animation-play-state','running');
  await page.locator('[data-flow-action="pause"]').click();
  await expect(guide).toHaveAttribute('data-asana-state','paused');
  await expect(whisker).toHaveCSS('animation-name',/yy-d9-whisker/);
  await expect(whisker).toHaveCSS('animation-play-state','paused');
  await page.locator('[data-flow-action="pause"]').click();
  await expect(guide).toHaveAttribute('data-asana-state','running');
  await expect(whisker).toHaveCSS('animation-play-state','running');
 }
});

test('D10: breath inhale/hold/exhale changes only muzzle animation; quiet mode stops it',async({page})=>{
 const guide=await openPractice(page);
 await page.locator('[data-flow-action="start"]').click();
 const next=page.locator('[data-flow-action="next"]');
 for(const phase of ['centering','breath']){
  await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
  await expect(next).toBeEnabled({timeout:8000});
  await next.evaluate(el=>el.click());
  await expect(guide).toHaveAttribute('data-phase',phase);
 }
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
 await expect(guide).toHaveAttribute('data-asana-state','running');
 const names=await guide.evaluate(el=>{
  const original=el.dataset.breathStep;
  const muzzle=el.querySelector('.yy-pose.is-current .yy-dragon-bridge-layer');
  if(!muzzle)throw Error('D10 muzzle group missing');
  const states={};
  for(const mode of ['inhale','hold','exhale']){
   el.dataset.breathStep=mode;
   states[mode]=getComputedStyle(muzzle).animationName;
  }
  el.dataset.breathStep=original;
  return states;
 });
 expect(names.inhale).toContain('yy-d10-inhale');
 expect(names.hold).toBe('none');
 expect(names.exhale).toContain('yy-d10-exhale');
 await page.evaluate(()=>document.body.classList.add('quiet-mode'));
 await expect(guide).toHaveAttribute('data-asana-state','reduced');
 await expect(guide.locator('.yy-pose.is-current .yy-dragon-bridge-layer')).toHaveCSS('animation-name','none');
});

test('D10: OS reduced motion disables figure motion even in idle',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const guide=await openPractice(page);
 const whisker=guide.locator('.yy-pose.is-current .yy-dragon-whisker').first();
 await expect(whisker).toHaveCSS('animation-name','none');
});
