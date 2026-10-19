const {test,expect}=require('@playwright/test');

const openLibrary=async (page,{full=false}={})=>{
  await page.goto('/');
  // The global dock belongs to the opt-in complete view in P2.
  if(full){
    await page.locator('#p2-toggle').click();
    await expect(page.locator('#main')).toHaveAttribute('data-p2-mode','full');
  }
  const gallery=page.locator('#studio-asana-library');
  await expect(gallery).toBeVisible();
  await gallery.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await expect(page.locator('body')).toHaveAttribute('data-asana-book-visible','true');
  return gallery;
};

test('V71: twelve posture guides provide setup, breath and release in both languages',async({page})=>{
  const gallery=await openLibrary(page);
  await expect(gallery.locator('.yy-pose')).toHaveCount(12);
  const buttons=gallery.locator('button[data-library-pose]');
  await expect(buttons).toHaveCount(12);
  for(const id of ['d24-mountain','d24-downward','v68-warrior-ii','v68-gratitude']){
    await gallery.locator('button[data-library-pose="'+id+'"]').evaluate(el=>el.click());
    await expect(gallery.locator('.yy-pose.is-current')).toHaveAttribute('data-pose',id);
    const guide=gallery.locator('.studio-library-steps li');
    await expect(guide).toHaveCount(3);
    for(let i=0;i<3;i++){
      expect((await guide.nth(i).locator('.studio-library-step-text').textContent()).trim().length).toBeGreaterThan(25);
    }
  }
  await page.evaluate(()=>document.documentElement.setAttribute('lang','en'));
  await expect(gallery.locator('#studio-library-how-title')).toHaveText('Explore the posture');
  await expect(gallery.locator('.studio-library-step-label').first()).toHaveText('1 · Set up');
  await expect(gallery.locator('.studio-library-step-text').first()).not.toBeEmpty();
  await expect(page.locator('#flow-guide .yy-pose')).toHaveCount(10);
});

test('V71: Nila uses raised-hand anatomy, prayer palms and four dog contacts',async({page})=>{
  const gallery=await openLibrary(page);
  await gallery.locator('button[data-library-pose="v68-gratitude"]').evaluate(el=>el.click());
  const active=gallery.locator('.yy-pose.is-current');
  await expect(active.locator('.mg-prayer-palm')).toHaveCount(2);
  await expect(active.locator('.mg-paw')).toHaveCount(4);
  await gallery.locator('button[data-library-pose="d24-downward"]').evaluate(el=>el.click());
  await expect(gallery.locator('.yy-pose.is-current .mg-contact-shadows ellipse')).toHaveCount(4);
  await gallery.locator('button[data-library-pose="v68-tree"]').evaluate(el=>el.click());
  const rotations=await gallery.locator('.yy-pose.is-current .mg-hand').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('transform')));
  expect(rotations).toHaveLength(2);
  expect(rotations.every(v=>/rotate\(-?\d+\.\d+\)/.test(v))).toBe(true);
  expect(rotations.some(v=>Math.abs(Number(v.match(/rotate\(([-\d.]+)/)[1]))>10)).toBe(true);
  const paths=await gallery.locator('.yy-pose.is-current .movement-guardian path').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('d')||''));
  expect(paths.every(d=>!d.includes('NaN')&&!d.includes('Infinity'))).toBe(true);
});

test('V71: category filters and vertical keyboard navigation keep labels and mobile layout accessible',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  const gallery=await openLibrary(page);
  await gallery.locator('[data-asana-filter="seated"]').evaluate(el=>el.click());
  const choices=gallery.locator('button[data-library-pose]:visible');
  expect(await choices.count()).toBeGreaterThan(1);
  await choices.first().focus();
  await choices.first().press('ArrowDown');
  await expect(choices.nth(1)).toBeFocused();
  await choices.nth(1).press('Home');
  await expect(choices.first()).toBeFocused();
  await choices.first().press('End');
  await expect(choices.last()).toBeFocused();
  await expect(gallery.locator('.studio-library-coaching')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('V71: visual anatomy references for four individual postures',async({page,browserName},testInfo)=>{
  test.skip(browserName!=='chromium','Single browser image review');
  test.setTimeout(75000);
  await page.setViewportSize({width:1440,height:1050});
  await page.emulateMedia({reducedMotion:'reduce'});
  const gallery=await openLibrary(page);
  for(const id of ['d24-downward','v68-tree','v68-gratitude','v68-warrior-ii']){
    await gallery.locator('button[data-library-pose="'+id+'"]').evaluate(el=>el.click());
    await expect(gallery.locator('.yy-pose.is-current')).toHaveAttribute('data-pose',id);
    await gallery.locator('.studio-library-stage').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
    await page.screenshot({path:testInfo.outputPath('v71-'+id+'.jpg'),type:'jpeg',quality:83,animations:'disabled',timeout:10000});
  }
});

test('V71: asana coaching is not covered by the global breathing dock, but controls remain available',async({page})=>{
  const gallery=await openLibrary(page,{full:true});
  const dock=page.locator('.sanctuary-dock');
  const toggle=gallery.locator('.studio-library-dock-toggle');
  await expect(gallery.locator('.studio-library-coaching')).toBeVisible();
  await expect(dock).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-pressed','false');
  await toggle.evaluate(el=>el.click());
  await expect(dock).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  await toggle.evaluate(el=>el.click());
  await expect(dock).toBeHidden();
  await gallery.locator('.studio-book-practice-link').evaluate(el=>el.click());
  await expect(page.locator('body')).toHaveAttribute('data-asana-book-visible','false');
  await expect(dock).toBeVisible();
});
