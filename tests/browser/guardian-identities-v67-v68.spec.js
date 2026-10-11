const {test,expect}=require('@playwright/test');

test('V68: twelve distinct asanas and their accessible category filters',async({page})=>{
  await page.goto('/');
  const root=page.locator('#instructor-flow');
  const library=root.locator('#studio-asana-library');
  await expect(library).toBeHidden();
  await root.locator('button[data-movement-view="library"]').evaluate(el=>el.click());
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
    await page.locator('[data-studio-mode="'+mode+'"]').evaluate(el=>el.click());
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
  await page.locator('[data-movement-view="library"]').evaluate(el=>el.click());
  const gallery=page.locator('#studio-asana-library');
  await expect(gallery).toBeVisible();
  const paths=await gallery.locator('.movement-guardian path').evaluateAll(nodes=>nodes.map(el=>el.getAttribute('d')||''));
  expect(paths.length).toBeGreaterThan(170);
  expect(paths.every(d=>!d.includes('NaN')&&!d.includes('Infinity'))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await gallery.locator('[data-library-pose="v68-tree"]').evaluate(el=>el.click());
  await expect(gallery.locator('.yy-pose.is-current')).toHaveAttribute('data-pose','v68-tree');
});
