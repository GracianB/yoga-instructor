const {test,expect}=require('@playwright/test');

function contrast(fg,bg){
  const lum=c=>{
    const source=String(c).trim();
    const channels=source.startsWith('#')?[1,3,5].map(i=>parseInt(source.slice(i,i+2),16)):source.match(/[\d.]+/g).slice(0,3).map(Number);
    const values=channels.map(v=>{
      const t=v/255;
      return t<=0.04045?t/12.92:((t+0.055)/1.055)**2.4;
    });
    return values[0]*.2126+values[1]*.7152+values[2]*.0722;
  };
  const a=lum(fg),b=lum(bg);
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}

test('V2.2 evergreen palette preserves readable text and cohesive surfaces in light/dark',async({page})=>{
  await page.goto('/dist/index.html',{waitUntil:'domcontentloaded'});
  for(const theme of ['light','dark']){
    await page.evaluate(mode=>document.documentElement.dataset.theme=mode,theme);
    const ui=await page.evaluate(()=>{
      const html=document.documentElement;
      const root=getComputedStyle(html);
      const get=(name)=>root.getPropertyValue(name).trim();
      const computed=(selector)=>getComputedStyle(document.querySelector(selector));
      return {
        sage:get('--sage'),ink:get('--ink'),muted:get('--muted'),
        bg:get('--bg'),surface:get('--surface'),accentInk:get('--accent-ink'),
        bodyBg:computed('body').backgroundImage,
        indexBg:computed('#explora').backgroundImage,
        cardsBg:computed('#proyectos .yoga-offer-card').backgroundImage,
        formBg:computed('#contacto #v76-enquiry').backgroundImage,
        methodAccent:computed('#metodo').getPropertyValue('--method-lilac').trim(),
        selectedButton:{bg:computed('#metodo .yoga-method-tabs [aria-selected="true"]').backgroundColor,
          color:computed('#metodo .yoga-method-tabs [aria-selected="true"]').color},
        enquiryColumns:computed('#v76-enquiry').gridTemplateColumns.split(' ').length,
        previewVisible:computed('#v76-results').display
      };
    });
    expect(ui.sage).toBe(theme==='light'?'#256448':'#9bddb6');
    expect(ui.bg).toBe(theme==='light'?'#f3f7f1':'#07140f');
    expect(contrast(ui.ink,ui.surface),'Core text should meet WCAG AA').toBeGreaterThanOrEqual(4.5);
    expect(contrast(ui.muted,ui.surface),'Muted text should meet WCAG AA').toBeGreaterThanOrEqual(4.5);
    expect(contrast(ui.sage,ui.surface),'Green labels should meet WCAG AA').toBeGreaterThanOrEqual(4.5);
    expect(contrast(ui.selectedButton.color,ui.selectedButton.bg),'Selected tab text should meet AA').toBeGreaterThanOrEqual(4.5);
    expect(ui.enquiryColumns,'Enquiry is one centered column').toBe(1);
    expect(ui.previewVisible,'Hidden preview remains hidden').toBe('none');
    expect(ui.indexBg).toContain('gradient');
    expect(ui.cardsBg).toContain('gradient');
    expect(ui.formBg).toContain('gradient');
    expect(ui.methodAccent).toBe(theme==='light'?'#4c8d68':'#a8e1c2');
  }
});

test('V2.2 buttons and cards remain stable on hover and no horizontal spill at 320px',async({page})=>{
  await page.setViewportSize({width:320,height:780});
  await page.goto('/dist/index.html',{waitUntil:'domcontentloaded'});
  const button=page.locator('#explora [data-p2-route=contact]');
  await expect(button).toBeVisible();
  const before=await button.boundingBox();
  await button.hover();
  const after=await button.boundingBox();
  expect(Math.abs(after.width-before.width)).toBeLessThan(.2);
  expect(Math.abs(after.height-before.height)).toBeLessThan(.2);
  const width=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(321);
  await expect(page.locator('#v76-enquiry')).toBeVisible();
  await expect(page.locator('#v76-enquiry .v76-workspace')).toBeVisible();
  await expect(page.locator('#inicio .hero-mandala')).toBeVisible();
});