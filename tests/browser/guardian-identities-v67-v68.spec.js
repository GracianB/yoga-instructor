const {test,expect}=require('@playwright/test');

test('V68: twelve distinct asanas and their accessible category filters',async({page})=>{
  await page.goto('/');
  const root=page.locator('#instructor-flow');
  const library=page.locator('#studio-asana-library');
  await expect(library).toBeVisible();
  await expect(library.locator('.yy-pose')).toHaveCount(12);
  await expect(library.locator('.movement-guardian')).toHaveCount(12);
  await expect(library.locator('button[data-library-pose]')).toHaveCount(12);
  const ids=await library.locator('button[data-library-pose]').evaluateAll(nodes=>nodes.map(n=>n.dataset.libraryPose));
  expect(new Set(ids).size).toBe(12);
  for(const cat of ['standing','seated','restorative']){
    await library.locator('[data-asana-filter="'+cat+'"]').evaluate(el=>el.click());
    await expect(library.locator('[data-asana-filter="'+cat+'"]')).toHaveAttribute('aria-pressed','true');
    const visible=library.locator('button[data-library-pose]:visible');
    expect(await visible.count()).toBeGreaterThan(0);
    expect((await visible.evaluateAll(nodes=>nodes.map(n=>n.dataset.category))).every(x=>x===cat)).toBe(true);
  }
  await library.locator('[data-asana-filter="all"]').evaluate(el=>el.click());
  await expect(library.locator('button[data-library-pose]:visible')).toHaveCount(12);
  await library.locator('[data-library-pose="v68-gratitude"]').evaluate(el=>el.click());
  await expect(library.locator('.yy-pose.is-current')).toHaveAttribute('data-pose','v68-gratitude');
  await expect(library.locator('.yy-pose.is-current .movement-guardian .mg-gesture-forearms')).toHaveCount(1);
  await expect(root.locator('#flow-guide .yy-pose')).toHaveCount(10);
});

test('V67: mode palettes are unique and character titles follow language',async({page})=>{
  await page.goto('/');
  const root=page.locator('#instructor-flow');
  const palettes=[];
  for(const [mode,guardian] of [['asanas','.movement-guardian'],['breath','.studio-breath-dragon'],['meditation','.meditation-guardian']]){
    await page.locator('button[data-studio-mode="'+mode+'"]').evaluate(el=>el.click());
    await expect(root).toHaveAttribute('data-studio-mode',mode);
    palettes.push(await root.evaluate(el=>getComputedStyle(el).getPropertyValue('--guardian-accent').trim()));
    await expect(root.locator(guardian).first()).toBeAttached();
  }
  expect(new Set(palettes).size).toBe(3);
  await expect(root.locator('#studio-guided > .studio-v67-identity')).toContainText('UMA');
  await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
  await expect(root.locator('#studio-guided > .studio-v67-identity')).toContainText('MEDITATION');
});

test('V68: twelve anatomies remain finite and mobile has no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto('/');
  const gallery=page.locator('#studio-asana-library');
  await expect(gallery).toBeVisible();
  const paths=await gallery.locator('.movement-guardian path').evaluateAll(nodes=>nodes.map(el=>el.getAttribute('d')||''));
  expect(paths.length).toBeGreaterThan(170);
  expect(paths.every(d=>!d.includes('NaN')&&!d.includes('Infinity'))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await gallery.locator('[data-library-pose="v68-tree"]').evaluate(el=>el.click());
  await expect(gallery.locator('.yy-pose.is-current')).toHaveAttribute('data-pose','v68-tree');
});


test('V67/V68 art review: each console and two distinct new asanas',async({page,browserName},testInfo)=>{
  test.skip(browserName!=='chromium','Capture a single canonical contact set in Chromium');
  test.setTimeout(75000);
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const root=page.locator('#instructor-flow');
  const snap=async(name,selector)=>{
    await page.locator(selector).evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
    await page.screenshot({path:testInfo.outputPath(name+'.jpg'),type:'jpeg',quality:84,animations:'disabled',timeout:10000});
  };
  await snap('v67-nila-movement','#movement-stage');
  await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
  await expect(root.locator('.studio-breath-dragon')).toBeVisible();
  await snap('v67-dragon-breath','#studio-guided');
  await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
  await expect(root.locator('.meditation-guardian')).toBeVisible();
  await snap('v67-uma-meditation','#studio-guided');
  await page.locator('[data-studio-mode="asanas"]').evaluate(el=>el.click());
  for(const id of ['v68-tree','v68-gratitude']){
    await page.locator('[data-library-pose="'+id+'"]').evaluate(el=>el.click());
    await expect(page.locator('#studio-asana-library .yy-pose.is-current')).toHaveAttribute('data-pose',id);
    await snap(id,'#studio-asana-library');
  }
});
