const {test,expect}=require('@playwright/test');

test.describe('PRESENCIA · public bilingual online pages', () => {
  for(const [lang,path,heading,contact] of [
    ['es','clases-online.html','Tu presencia.','#contacto'],
    ['en','clases-online-en.html','Your presence.','#contact']
  ]){
    test(lang+' · responsive, accessible and enquiry-only at 320/390/768/1440',async({page})=>{
      test.setTimeout(120000);
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      for(const width of [320,390,768,1440]){
        await page.setViewportSize({width,height:900});
        const response=await page.goto('/dist/'+path,{waitUntil:'domcontentloaded'});
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('lang',lang);
        await expect(page.getByRole('heading',{level:1})).toContainText(heading);
        await expect(page.locator(contact)).toBeVisible();
        await expect(page.getByRole('link',{name:lang==='es'?'Consultar disponibilidad':'Ask about availability'})).toHaveAttribute('href',/mailto:/);
        await expect(page.getByRole('link',{name:lang==='es'?'Ver huecos para conversar ↗':'See conversation slots ↗'})).toHaveAttribute('href',/calendar\.app\.google/);
        const metrics=await page.evaluate(()=>({
          scrollWidth:document.documentElement.scrollWidth,
          innerWidth:window.innerWidth,
          style:getComputedStyle(document.querySelector('.hero')).paddingTop
        }));
        expect(metrics.scrollWidth,lang+' '+width+'px overflow').toBeLessThanOrEqual(metrics.innerWidth+1);
        expect(metrics.style).not.toBe('0px');
      }
      expect(errors).toEqual([]);
    });
  }

  test('ES ↔ EN switch preserves correct page and enquiry boundaries',async({page})=>{
    const res=await page.goto('/dist/clases-online.html',{waitUntil:'domcontentloaded'});
    expect(res?.status()).toBe(200);
    await page.getByRole('link',{name:'Read this page in English'}).click();
    await expect(page).toHaveURL(/clases-online-en\.html$/);
    await expect(page.getByRole('heading',{level:1})).toContainText('Your presence.');
    await page.getByRole('link',{name:'Leer esta página en español'}).click();
    await expect(page).toHaveURL(/clases-online\.html$/);
    await expect(page.getByRole('heading',{level:1})).toContainText('Tu presencia.');
    for(const name of ['clases-online.html','clases-online-en.html']){
      const css=await page.request.get('/dist/presencia-online.css?v=1');
      expect(css.status(),name+' stylesheet').toBe(200);
    }
    const calendar=page.getByRole('link',{name:'Ver huecos para conversar ↗'});
    await expect(calendar).toHaveAttribute('target','_blank');
    await expect(calendar).toHaveAttribute('rel',/noopener/);
    await expect(page.locator('form')).toHaveCount(0);
  });
});
