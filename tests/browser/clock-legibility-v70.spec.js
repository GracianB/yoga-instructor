const {test,expect}=require('@playwright/test');
const rgb=s=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
const linear=n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};
const lum=([r,g,b])=>.2126*linear(r)+.7152*linear(g)+.0722*linear(b);
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));

test('V70: timer labels remain legible for Yang, Yin and narrow mobile',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/');
 const stage=page.locator('#movement-stage');
 const guide=page.locator('#flow-guide');
 await expect(stage).toBeVisible();
 const labels=[
  '.flow-session-clock > [data-i18n="flowClock"]',
  '.flow-phase-timing [data-i18n="guideRemaining"]',
  '.flow-phase-timing [data-i18n="guideTarget"]',
  '.flow-phase-timing #flow-phase-time',
  '.flow-phase-timing #flow-phase-target'
 ];
 for(const spirit of ['yang','yin']){
   await guide.locator('[data-yy-form="'+spirit+'"]').evaluate(el=>el.click());
   await expect(guide).toHaveAttribute('data-spirit',spirit);
   const base=await stage.evaluate(el=>getComputedStyle(el).getPropertyValue('--console-base').trim());
   for(const selector of labels){
     const element=stage.locator(selector);
     await expect(element).toBeVisible();
     const c=await element.evaluate(el=>({fg:getComputedStyle(el).color,opacity:getComputedStyle(el).opacity}));
     expect(contrast(rgb(c.fg),hex(base)),selector+' in '+spirit).toBeGreaterThanOrEqual(4.5);
     expect(Number(c.opacity),selector).toBeGreaterThanOrEqual(0.99);
   }
 }
 await page.setViewportSize({width:375,height:812});
 await expect(stage.locator('.flow-phase-timing')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
