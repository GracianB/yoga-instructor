const {test,expect}=require('@playwright/test');

test('P2: one Movement studio and a closed optional twelve-asana reference',async({page})=>{
 await page.goto('/');
 const book=page.locator('#studio-asana-library');
 const root=page.locator('#instructor-flow');
 await expect(book).toBeVisible();
 await expect(book).toHaveAttribute('data-book-standalone','false');
 await expect(book.locator('button[data-library-pose]')).toHaveCount(12);
 await expect(root.locator('.studio-v66-submodes')).toHaveCount(0);
 await expect(root.locator('#movement-stage')).toBeVisible();
 await expect(book.locator('.studio-library-stage')).toBeHidden();
 expect(await page.evaluate(()=>document.getElementById('instructor-flow').contains(document.getElementById('studio-asana-library')))).toBe(true);
 await book.locator('#p2-asana-toggle').evaluate(el=>el.click());
 await expect(book.locator('.studio-library-stage')).toBeVisible();
 await expect(root.locator('#movement-stage')).toBeHidden();
 await book.locator('#p2-asana-toggle').evaluate(el=>el.click());
 await expect(root.locator('#movement-stage')).toBeVisible();
});

test('P2: Breathing and Meditation keep one workspace; book is unavailable in unrelated modes',async({page})=>{
 await page.goto('/');
 const root=page.locator('#instructor-flow');
 const space=root.locator('#studio-v66-workspace');
 const book=root.locator('#studio-asana-library');
 await expect(space.locator('> #movement-stage')).toHaveCount(1);
 await expect(space.locator('> #studio-guided')).toHaveCount(1);
 await page.locator('button[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(root).toHaveAttribute('data-studio-mode','breath');
 await expect(space.locator('.studio-breath-dragon')).toBeVisible();
 await expect(book).toBeHidden();
 await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(root).toHaveAttribute('data-studio-mode','meditation');
 await expect(space.locator('.meditation-guardian')).toBeVisible();
 await expect(book).toBeHidden();
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