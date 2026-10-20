const {test,expect}=require('@playwright/test');

test('Public Yoga V2.1 uses one centered grid for every main chapter on desktop and tablet',async({page})=>{
  for(const width of [1440,1100,800]){
    await page.setViewportSize({width,height:880});
    await page.goto('/dist/index.html?lang=es',{waitUntil:'domcontentloaded'});
    const layout=await page.evaluate(()=>{
      const ids=['explora','proyectos','experiencia','metodo','contacto'];
      return ids.map(id=>{
        const node=document.getElementById(id),b=node.getBoundingClientRect();
        return {id,left:b.left,right:b.right,width:b.width,center:b.left+b.width/2,display:getComputedStyle(node).display};
      });
    });
    for(const part of layout){
      expect(part.display,part.id+' must be visible').not.toBe('none');
      expect(Math.abs(part.center-width/2),part.id+' must share viewport center').toBeLessThan(3);
      expect(part.width,part.id+' must not exceed master width').toBeLessThanOrEqual(1121);
      expect(part.left,part.id+' left edge must stay on the common axis').toBeCloseTo(layout[0].left,0);
      expect(part.right,part.id+' right edge must stay on the common axis').toBeCloseTo(layout[0].right,0);
    }
    const contact=await page.locator('#contacto').evaluate(node=>{
      const center=element=>{const b=element.getBoundingClientRect();return b.left+b.width/2};
      const form=node.querySelector('.v76-workspace');
      return {
        chapterCenter:center(node),
        cardCenter:center(node.querySelector('#v76-enquiry')),
        formCenter:center(form),
        columns:getComputedStyle(node.querySelector('#v76-enquiry')).gridTemplateColumns.split(' ').length
      };
    });
    expect(contact.columns,'Contact title and form should no longer form two unequal columns').toBe(1);
    expect(Math.abs(contact.formCenter-contact.chapterCenter),'Form should be centered in chapter').toBeLessThan(3);
    expect(Math.abs(contact.cardCenter-contact.chapterCenter)).toBeLessThan(3);
  }
});

test('Public Yoga V2.1 preserves spacing and centered form on narrow mobile in both themes',async({page})=>{
  for(const width of [390,320]){
    await page.setViewportSize({width,height:780});
    await page.goto('/dist/index.html?lang=en',{waitUntil:'domcontentloaded'});
    const viewport=await page.evaluate(()=>{
      const ids=['explora','proyectos','experiencia','metodo','contacto'];
      const all=ids.map(id=>{
        const b=document.getElementById(id).getBoundingClientRect();
        return {id,left:b.left,right:b.right,width:b.width};
      });
      const form=document.querySelector('#v76-enquiry .v76-workspace').getBoundingClientRect();
      const layout=document.querySelector('#v76-enquiry .v76-service-grid');
      return {all,formCenter:form.left+form.width/2,screen:innerWidth,
        cardColumns:getComputedStyle(layout).gridTemplateColumns.split(' ').length,
        scrollWidth:document.documentElement.scrollWidth};
    });
    expect(viewport.scrollWidth,'No horizontal overflow').toBeLessThanOrEqual(width+1);
    for(const item of viewport.all){
      expect(item.left,item.id+' left aligned').toBeCloseTo(viewport.all[0].left,0);
      expect(item.right,item.id+' right aligned').toBeCloseTo(viewport.all[0].right,0);
      expect(item.left).toBeGreaterThanOrEqual(0);
      expect(item.right).toBeLessThanOrEqual(width+1);
    }
    expect(Math.abs(viewport.formCenter-width/2)).toBeLessThan(3);
    expect(viewport.cardColumns,'Form choices must stack to remain readable').toBe(1);
    await page.locator('#proyectos [data-yoga-service="individual"]').click();
    await expect(page.locator('#v76-form [name="v76-service"][value="individual"]')).toBeChecked();
    await expect(page.locator('#contacto')).toBeVisible();
  }
});