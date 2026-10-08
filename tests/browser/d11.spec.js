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

test('D11: both dragon forms retain closed eyes and visible sculpted engraving',async({page})=>{
 const guide=await openPractice(page);
 const stage=guide.locator('.yy-stage');
 const palettes=[];
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const spirit of ['yang','yin']){
   await guide.locator('[data-yy-form="'+spirit+'"]').evaluate(el=>el.click());
   await expect(guide).toHaveAttribute('data-spirit',spirit);
   const current=guide.locator('.yy-pose.is-current');
   await expect(current.locator('.yy-eye-closed')).toHaveCount(2);
   await expect(current.locator('.yy-eye-core,.yy-eye-center,.yy-crown-mark')).toHaveCount(0);
   for(const part of ['horn','crest','cheek','beard']){
    await expect(current.locator('.yy-d11-'+part+'-engraving')).toHaveCount(1);
   }
   const metrics=await stage.evaluate(el=>{
    const s=getComputedStyle(el,'::before');
    const r=el.getBoundingClientRect();
    return {background:s.backgroundImage,events:s.pointerEvents,filter:s.filter,etch:getComputedStyle(el.closest('.yy-guide')).getPropertyValue('--d11-etch').trim(),width:r.width};
   });
   expect(metrics.background).toContain('radial-gradient');
   expect(metrics.events).toBe('none');
   expect(metrics.filter).toBe('none');
   expect(metrics.width).toBeGreaterThan(100);
   palettes.push({width,spirit,color:metrics.etch});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 expect(palettes.find(p=>p.spirit==='yang').color).not.toBe(palettes.find(p=>p.spirit==='yin').color);
});

test('D11: focus tracks the pose, and the aurora pauses with real 4·7·8 breathing',async({page})=>{
 const guide=await openPractice(page);
 const focus=()=>guide.evaluate(el=>getComputedStyle(el).getPropertyValue('--d11-focus-x').trim());
 expect(await focus()).toBe('31%');
 await page.locator('[data-flow-action="start"]').click();
 const next=page.locator('[data-flow-action="next"]');
 await expect(next).toBeEnabled({timeout:8000});
 await next.evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-phase','centering');
 expect(await focus()).toBe('50%');
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
 await next.evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-phase','breath');
 await expect(guide).toHaveAttribute('data-ready','true',{timeout:8000});
 const observed=await guide.evaluate(el=>{
  const stage=el.querySelector('.yy-stage');
  const before=()=>getComputedStyle(stage,'::before');
  const original=el.dataset.breathStep;
  const names={};
  for(const value of ['inhale','hold','exhale']){
   el.dataset.breathStep=value;
   names[value]=before().animationName;
  }
  el.dataset.breathStep=original;
  return names;
 });
 expect(observed.inhale).toContain('yy-d11-inhale');
 expect(observed.hold).toBe('none');
 expect(observed.exhale).toContain('yy-d11-exhale');
 await page.evaluate(()=>document.querySelector('#flow-guide').dataset.breathStep='inhale');
 await page.locator('[data-flow-action="pause"]').click();
 await expect(guide).toHaveAttribute('data-asana-state','paused');
 expect(await guide.locator('.yy-stage').evaluate(el=>getComputedStyle(el,'::before').animationPlayState)).toBe('paused');
 await page.evaluate(()=>document.body.classList.add('quiet-mode'));
 await expect(guide).toHaveAttribute('data-asana-state','reduced');
 expect(await guide.locator('.yy-stage').evaluate(el=>getComputedStyle(el,'::before').animationName)).toBe('none');
});

test('D11: reduced-motion preference leaves the stage still',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const guide=await openPractice(page);
 const stage=guide.locator('.yy-stage');
 expect(await stage.evaluate(el=>getComputedStyle(el,'::before').animationName)).toBe('none');
 expect(await stage.evaluate(el=>getComputedStyle(el,'::before').transitionDuration)).toBe('0s');
});
