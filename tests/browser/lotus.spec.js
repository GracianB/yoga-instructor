const {test,expect}=require('@playwright/test');
for(const width of [320,390,768,1440])for(const theme of ['light','dark'])test(`canvas lotus is visible, rendered and contained at ${width}px in ${theme}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');
 await page.locator(`[data-set-theme="${theme}"]`).click();
 const canvas=page.locator('.living-lotus-hero');await expect(canvas).toBeVisible();
 expect(await canvas.evaluate(el=>{const pixels=el.getContext('2d').getImageData(0,0,el.width,el.height).data;return pixels.some((value,index)=>index%4===3&&value>0)})).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
});
test('live motion preference stops the lotus canvas and keeps its exact pixels',async({page})=>{
 await page.goto('/');const canvas=page.locator('.living-lotus-hero');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(canvas).toHaveAttribute('data-motion','static');
 const still=await canvas.evaluate(el=>el.toDataURL());await page.waitForTimeout(300);
 expect(await canvas.evaluate(el=>el.toDataURL())).toBe(still);
});
test('normal motion actually redraws the lotus',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');const canvas=page.locator('.living-lotus-hero');await expect(canvas).toHaveAttribute('data-motion','animated');
 const initial=await canvas.evaluate(el=>el.toDataURL());await expect.poll(()=>canvas.evaluate(el=>el.toDataURL())).not.toBe(initial);
});
