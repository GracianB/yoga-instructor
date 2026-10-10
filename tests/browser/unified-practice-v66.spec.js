const {test,expect}=require('@playwright/test');

test('V66: Movement defaults to guided sequence, asanas are deliberate and independent',async({page})=>{
  await page.goto('/');
  const root=page.locator('#instructor-flow');
  const tabs=root.locator('.studio-v66-submodes');
  const sequence=root.locator('#movement-stage');
  const gallery=root.locator('#studio-asana-library');
  await expect(root).toHaveAttribute('data-movement-view','sequence');
  await expect(tabs).toBeVisible();
  await expect(tabs.locator('[data-movement-view="sequence"]')).toHaveAttribute('aria-pressed','true');
  await expect(sequence).toBeVisible();
  await expect(gallery).toBeHidden();
  await tabs.locator('[data-movement-view="library"]').click();
  await expect(root).toHaveAttribute('data-movement-view','library');
  await expect(sequence).toBeHidden();
  await expect(gallery).toBeVisible();
  await expect(gallery.locator('button[data-library-pose]')).toHaveCount(3);
  await expect(root.locator('.studio-plan')).toBeHidden();
  await expect(root.locator('.studio-adaptation')).toBeHidden();
  await tabs.locator('[data-movement-view="sequence"]').click();
  await expect(gallery).toBeHidden();
  await expect(sequence).toBeVisible();
});

test('V66: Breath and Meditation use the same room as Movement, with distinct guardians',async({page})=>{
  await page.goto('/');
  const root=page.locator('#instructor-flow');
  const space=root.locator('#studio-v66-workspace');
  await expect(space).toBeVisible();
  await expect(space.locator('> #movement-stage')).toHaveCount(1);
  await expect(space.locator('> #studio-guided')).toHaveCount(1);
  await expect(space.locator('> #studio-asana-library')).toHaveCount(1);
  await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
  await expect(root).toHaveAttribute('data-studio-mode','breath');
  await expect(space.locator('#studio-guided')).toBeVisible();
  await expect(space.locator('.studio-breath-dragon')).toBeVisible();
  await expect(root.locator('.studio-v66-submodes')).toBeHidden();
  await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
  await expect(root).toHaveAttribute('data-studio-mode','meditation');
  await expect(space.locator('.meditation-guardian')).toBeVisible();
  await expect(space.locator('.studio-breath-dragon')).toBeHidden();
  await page.locator('[data-studio-mode="asanas"]').evaluate(el=>el.click());
  await expect(space.locator('#movement-stage')).toBeVisible();
  await expect(root.locator('.studio-v66-submodes')).toBeVisible();
});

test('V66: line faces, accessible controls, consistent mobile room',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto('/');
  const root=page.locator('#instructor-flow');
  await expect(root.locator('#flow-guide .yy-pose.is-current .mg-eye-line')).toHaveCount(1);
  await expect(root.locator('.movement-guardian .mg-pupil')).toHaveCount(0);
  await expect(root.locator('.studio-breath-dragon .sd31-eye-lines')).toHaveCount(1);
  await expect(root.locator('.meditation-guardian .uma-eye-lines')).toHaveCount(1);
  const tabs=root.locator('.studio-v66-submodes');
  await tabs.locator('[data-movement-view="library"]').focus();
  await tabs.locator('[data-movement-view="library"]').press('Enter');
  await expect(root.locator('#studio-asana-library')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
