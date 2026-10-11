const {test,expect}=require('@playwright/test');

const rgb=s=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
const srgb=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};
const luminance=([r,g,b])=>.2126*srgb(r)+.7152*srgb(g)+.0722*srgb(b);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));

test('V69: Yang and Yin share readable controls but have distinct palette and identity',async({page})=>{
 await page.goto('/');
 const root=page.locator('#instructor-flow');
 const guide=root.locator('#flow-guide');
 const pane=root.locator('#movement-stage .studio-v66-control-pane');
 const label=pane.locator('.studio-adaptation-heading');
 const title=pane.locator('.studio-v67-identity strong');
 const caption=pane.locator('.studio-v67-identity small');
 const palette=async()=>{
  return await label.evaluate(el=>{
   const c=getComputedStyle(el);
   const root=getComputedStyle(document.querySelector('#movement-stage'));
   return {color:c.color,base:root.getPropertyValue('--console-base').trim(),
           accent:root.getPropertyValue('--console-accent').trim()};
  });
 };
 await expect(guide).toHaveAttribute('data-spirit','yang');
 await expect(caption).toContainText('Yang');
 let style=await palette();
 expect(contrast(rgb(style.color),hex(style.base))).toBeGreaterThanOrEqual(4.5);
 expect(style.accent).toBe('#f0b795');

 await guide.locator('[data-yy-form="yin"]').evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-spirit','yin');
 await expect(title).toContainText('YIN');
 await expect(caption).toContainText('Yin');
 style=await palette();
 expect(contrast(rgb(style.color),hex(style.base))).toBeGreaterThanOrEqual(4.5);
 expect(style.accent).toBe('#c2addf');

 await guide.locator('[data-yy-form="yang"]').evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-spirit','yang');
 await expect(caption).toContainText('Yang');
});

test('V69: helper text and finish phase hierarchy remain readable in mobile',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto('/');
 const root=page.locator('#instructor-flow');
 const pane=root.locator('#movement-stage');
 await expect(pane.locator('.studio-plan-heading')).toBeVisible();
 await expect(pane.locator('.studio-adaptation-rest')).toBeVisible();
 const s=await pane.locator('.studio-plan-description').evaluate(el=>{
   const fg=getComputedStyle(el).color;
   const bg=getComputedStyle(document.querySelector('#movement-stage')).getPropertyValue('--console-base').trim();
   return {fg,bg};
 });
 expect(contrast(rgb(s.fg),hex(s.bg))).toBeGreaterThanOrEqual(4.5);
 await expect(pane.locator('.flow-phase-kicker')).toBeVisible();
 await expect(pane.locator('#flow-phase-label')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('V69: source color contrast review capture',async({page,browserName},testInfo)=>{
 test.skip(browserName!=='chromium','One screenshot set is enough');
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/');
 const guide=page.locator('#flow-guide');
 await guide.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await page.screenshot({path:testInfo.outputPath('v69-yang-contrast.jpg'),type:'jpeg',quality:88,animations:'disabled'});
 await guide.locator('[data-yy-form="yin"]').evaluate(el=>el.click());
 await expect(guide).toHaveAttribute('data-spirit','yin');
 await page.screenshot({path:testInfo.outputPath('v69-yin-contrast.jpg'),type:'jpeg',quality:88,animations:'disabled'});
});
