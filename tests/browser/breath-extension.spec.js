const {test,expect}=require('@playwright/test');
test('breathing companion is opt-in, minimizable and closable',async({page})=>{
 await page.goto('/');await expect(page.locator('.sanctuary-dock')).toBeHidden();
 await page.locator('.studio-modes [data-studio-mode="breath"]').click();
 await page.locator('.breath-extension-open').click();await expect(page.locator('.sanctuary-dock')).toBeVisible();
 await page.locator('[data-companion="minimize"]').click();await expect(page.locator('.sanctuary-dock')).toHaveClass(/is-minimized/);
 await page.locator('[data-companion="minimize"]').click();await expect(page.locator('.sanctuary-dock')).not.toHaveClass(/is-minimized/);
 await page.locator('[data-companion="close"]').click();await expect(page.locator('.sanctuary-dock')).toBeHidden();
});
