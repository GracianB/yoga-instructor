const {test,expect}=require('@playwright/test');

test('V72 book stands before the three-mode app, without hijacking Movement',async({page})=>{
 await page.goto('/');
 const book=page.locator('#studio-asana-library'),room=page.locator('#instructor-flow');
 await expect(book).toBeVisible();
 // Book is created after the site's static reveal observer initializes;
 // it must not remain opacity:0 and visually vanish.
 const opacity=await book.evaluate(el=>getComputedStyle(el).opacity);
 expect(Number(opacity)).toBeGreaterThanOrEqual(.99);
 await expect(book.locator('.studio-library-stage .movement-guardian')).toHaveCount(12);
 await expect(room.locator('.studio-v66-submodes')).toHaveCount(0);
 await expect(room.locator('#movement-stage')).toBeVisible();
 expect(await page.evaluate(()=>{
   const book=document.getElementById('studio-asana-library'),studio=document.getElementById('instructor-flow');
   return !studio.contains(book)&&Boolean(book.compareDocumentPosition(studio)&Node.DOCUMENT_POSITION_FOLLOWING);
 })).toBe(true);
 await page.locator('button[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(book).toBeVisible();
 await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(book).toBeVisible();
 await expect(book.locator('.studio-book-practice-link')).toHaveAttribute('href','#instructor-flow');
});

test('V72 dragon visibly breathes in sync with the existing clock, then holds when paused',async({page})=>{
 await page.goto('/');
 await page.locator('button[data-studio-mode="breath"]').evaluate(el=>el.click());
 const guided=page.locator('#studio-guided');
 const dragon=guided.locator('.studio-breath-dragon');
 await expect(dragon).toBeVisible();
 await expect(dragon.locator('.sd31-head-unit')).toHaveCount(1);
 await guided.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(guided).toHaveAttribute('data-studio-status','running');
 await page.waitForTimeout(1000);
 const initial=await guided.evaluate(el=>({
   body:parseFloat(el.style.getPropertyValue('--studio-body-width')),
   wing:parseFloat(el.style.getPropertyValue('--studio-guardian-wing')),
   lift:parseFloat(el.style.getPropertyValue('--studio-head-lift'))
 }));
 expect(initial.body).toBeGreaterThan(1);
 expect(initial.wing).toBeGreaterThan(1);
 expect(initial.lift).toBeLessThan(0);
 await guided.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(guided).toHaveAttribute('data-studio-status','paused');
 const paused=await guided.evaluate(el=>el.style.getPropertyValue('--studio-body-width'));
 await page.waitForTimeout(490);
 expect(await guided.evaluate(el=>el.style.getPropertyValue('--studio-body-width'))).toBe(paused);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(dragon.locator('.sd31-head-unit')).toHaveCSS('transform','none');
});

test('V72 Uma has a practical focus invitation for breath, body and surroundings',async({page})=>{
 await page.goto('/');
 await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 const guided=page.locator('#studio-guided');
 const journey=guided.locator('.studio-presence-journey');
 await expect(journey).toBeVisible();
 await expect(journey.locator('.studio-presence-steps li')).toHaveCount(3);
 for(const focus of ['breath','body','space']){
   await guided.locator('[data-meditation-focus="'+focus+'"]').evaluate(el=>el.click());
   await expect(journey).toHaveAttribute('data-focus',focus);
   expect((await journey.locator('.studio-presence-invitation').textContent()).length).toBeGreaterThan(50);
 }
 await guided.locator('[data-meditation-focus="breath"]').evaluate(el=>el.click());
 await guided.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(guided).toHaveAttribute('data-meditation-step','arrive');
 await expect(journey.locator('[data-presence-step="0"]')).toHaveAttribute('aria-current','step');
 await guided.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(guided).toHaveAttribute('data-studio-status','paused');
 await guided.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await guided.locator('[data-meditation-style="silent"]').evaluate(el=>el.click());
 await expect(journey.locator('.studio-presence-return')).toContainText('silencio');
});

test('V72 mobile reading remains bounded, focus visible and guided studio remains usable',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto('/');
 const book=page.locator('#studio-asana-library');
 await book.locator('[data-asana-filter="seated"]').evaluate(el=>el.click());
 await expect(book.locator('button[data-library-pose]:visible').first()).toBeVisible();
 await expect(book.locator('.studio-library-coaching')).toBeVisible();
 await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(page.locator('.studio-presence-journey')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
