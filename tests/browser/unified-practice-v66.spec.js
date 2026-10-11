const {test,expect}=require('@playwright/test');

test('V72: the twelve-asana book precedes the studio and Movement only has a sequence',async({page})=>{
 await page.goto('/');
 const book=page.locator('#studio-asana-library');
 const root=page.locator('#instructor-flow');
 await expect(book).toBeVisible();
 await expect(book).toHaveAttribute('data-book-standalone','true');
 await expect(book.locator('button[data-library-pose]')).toHaveCount(12);
 await expect(root.locator('.studio-v66-submodes')).toHaveCount(0);
 await expect(root.locator('#movement-stage')).toBeVisible();
 await expect(root.locator('.studio-plan')).toBeVisible();
 await expect(root.locator('.studio-adaptation')).toBeVisible();
 expect(await page.evaluate(()=>{
  const book=document.querySelector('#studio-asana-library');
  const root=document.querySelector('#instructor-flow');
  return !root.contains(book)&&Boolean(book.compareDocumentPosition(root)&Node.DOCUMENT_POSITION_FOLLOWING);
 })).toBe(true);
 await expect(book.locator('.studio-book-practice-link')).toHaveAttribute('href','#instructor-flow');
});

test('V72: Breath and Meditation retain the shared workspace while the book remains independent',async({page})=>{
 await page.goto('/');
 const root=page.locator('#instructor-flow');
 const space=root.locator('#studio-v66-workspace');
 const book=page.locator('#studio-asana-library');
 await expect(space.locator('> #movement-stage')).toHaveCount(1);
 await expect(space.locator('> #studio-guided')).toHaveCount(1);
 await expect(space.locator('> #studio-asana-library')).toHaveCount(0);
 await page.locator('button[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(root).toHaveAttribute('data-studio-mode','breath');
 await expect(space.locator('.studio-breath-dragon')).toBeVisible();
 await expect(book).toBeVisible();
 await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(root).toHaveAttribute('data-studio-mode','meditation');
 await expect(space.locator('.meditation-guardian')).toBeVisible();
 await expect(space.locator('.studio-breath-dragon')).toBeHidden();
 await expect(book).toBeVisible();
 await page.locator('button[data-studio-mode="asanas"]').evaluate(el=>el.click());
 await expect(root.locator('#movement-stage')).toBeVisible();
});

test('V72: line-eyed guardians and standalone asanas fit narrow screens',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto('/');
 const root=page.locator('#instructor-flow');
 const book=page.locator('#studio-asana-library');
 await expect(root.locator('#flow-guide .yy-pose.is-current .mg-eye-line')).toHaveCount(1);
 await expect(root.locator('.movement-guardian .mg-pupil')).toHaveCount(0);
 await expect(root.locator('.studio-breath-dragon .sd31-eye-lines')).toHaveCount(1);
 await expect(root.locator('.meditation-guardian .uma-eye-lines')).toHaveCount(1);
 await expect(book.locator('.studio-library-stage .movement-guardian')).toHaveCount(12);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});