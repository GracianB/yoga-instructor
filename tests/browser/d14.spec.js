const {test,expect}=require('@playwright/test');
async function open(page){
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.route('https://vortex-gilt-xi.vercel.app/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html>'}));
 await page.addInitScript(()=>{try{sessionStorage.setItem('gb-yoga-intro-seen','1')}catch(_){}});
 await page.goto('/');
 const root=page.locator('#flow-guide');
 await expect(root).toHaveAttribute('data-ready','true',{timeout:12000});
 return root;
}
async function advance(page,root,to){
 const sequence=['start','centering','breath','warmup','pose-1','transition','pose-2','cooldown','savasana','finish'];
 const current=await root.getAttribute('data-phase');
 const a=sequence.indexOf(current),b=sequence.indexOf(to);
 if(b<a)throw Error('Cannot navigate backwards: '+current+' → '+to);
 for(let i=a+1;i<=b;i++){
  await expect(root).toHaveAttribute('data-ready','true',{timeout:8000});
  await page.locator('[data-flow-action="next"]').evaluate(e=>e.click());
  await expect(root).toHaveAttribute('data-phase',sequence[i]);
 }
 await expect(root).toHaveAttribute('data-ready','true',{timeout:8000});
}
test('D14: all ten phases include connected neck, ribcage, scapula and central horn',async({page})=>{
 const root=await open(page);
 await page.locator('[data-flow-action="start"]').evaluate(e=>e.click());
 const all=['start','centering','breath','warmup','pose-1','transition','pose-2','cooldown','savasana','finish'];
 for(const spirit of ['yang','yin']){
  await root.locator('[data-yy-form="'+spirit+'"]').evaluate(e=>e.click());
  await expect(root).toHaveAttribute('data-spirit',spirit);
  for(let i=0;i<all.length;i++){
   await expect(root).toHaveAttribute('data-ready','true',{timeout:8000});
   const pose=root.locator('.yy-pose.is-current');
   for(const cls of ['yy-d14-neck-bridge','yy-d14-rib-cage','yy-d14-scapula','yy-d12-unicorn-core'])
    await expect(pose.locator('.'+cls)).toHaveCount(1);
   await expect(pose.locator('.yy-eye-closed')).toHaveCount(2);
   if(i<all.length-1)await advance(page,root,all[i+1]);
  }
  if(spirit==='yang'){
   await page.locator('[data-flow-action="reset"]').evaluate(e=>e.click());
   await expect(root).toHaveAttribute('data-ready','true',{timeout:8000});
   await page.locator('[data-flow-action="start"]').evaluate(e=>e.click());
  }
 }
});
test('D14: Cat/Cow neck bends but all four contact paws stay fixed at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:760});
 const root=await open(page);
 await page.locator('[data-flow-action="start"]').evaluate(e=>e.click());
 await advance(page,root,'warmup');
 await expect(root).toHaveAttribute('data-asana-state','running');
 const get=()=>root.evaluate(el=>{
  const pose=el.querySelector('.yy-pose.is-current');
  const paw=[...pose.querySelectorAll('.yy-paw-group')].map(e=>{const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  const d=pose.querySelector('.yy-d14-neck-table').getAttribute('d');
  return {paw,d,tail:pose.querySelector('.yy-d13-table-tail')!==null};
 });
 const before=await get();
 await page.waitForTimeout(360);
 const after=await get();
 expect(before.tail).toBe(true);
 expect(before.d).not.toBe(after.d);
 for(let i=0;i<4;i++)expect(Math.hypot(before.paw[i][0]-after.paw[i][0],before.paw[i][1]-after.paw[i][1])).toBeLessThan(1.2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('D14: Tree balance pivots on planted sole without sliding',async({page})=>{
 const root=await open(page);
 await page.locator('[data-flow-action="start"]').evaluate(e=>e.click());
 await advance(page,root,'pose-2');
 const data=()=>root.evaluate(el=>{
  const pose=el.querySelector('.yy-pose.is-current');
  const planted=pose.querySelector('.yy-foot').getBoundingClientRect();
  const figure=pose.querySelector('.yy-character');
  return {x:planted.x+planted.width/2,y:planted.y+planted.height/2,
    origin:getComputedStyle(figure).transformOrigin,
    anim:getComputedStyle(figure).animationName};
 });
 const a=await data();
 await page.waitForTimeout(220);
 const b=await data();
 expect(a.anim).toContain('yy-d14-tree-root');
 expect(Math.hypot(a.x-b.x,a.y-b.y)).toBeLessThan(1.3);
});
test('D14: pause and reduced-motion stop rib breathing without stopping the controls',async({page})=>{
 const root=await open(page);
 await page.locator('[data-flow-action="start"]').evaluate(e=>e.click());
 await advance(page,root,'centering');
 const rib=root.locator('.yy-pose.is-current .yy-d14-rib-cage');
 await expect(rib).toHaveCSS('animation-name','yy-d14-lungs');
 await page.locator('[data-flow-action="pause"]').evaluate(e=>e.click());
 await expect(root).toHaveAttribute('data-asana-state','paused');
 await expect(rib).toHaveCSS('animation-play-state','paused');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(rib).toHaveCSS('animation-name','none');
});
