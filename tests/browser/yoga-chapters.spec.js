const {test,expect}=require('@playwright/test');
test('chapters separate learning from practice and preserve Movement controls',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.yoga-paths a')).toHaveCount(3);
 await expect(page.locator('#learning #studio-asana-library')).toHaveCount(1);
 await expect(page.locator('#practice #instructor-flow')).toHaveCount(1);
 await expect(page.locator('.yoga-credentials')).not.toHaveAttribute('open','');
 await page.locator('.yoga-paths a[href="#practice"]').click();
 await page.locator('[data-flow-action="start"]').click();
 await expect(page.locator('#movement-stage')).toHaveAttribute('data-flow-status','running');
 await page.locator('[data-flow-action="pause"]').click();
 await expect(page.locator('#movement-stage')).toHaveAttribute('data-flow-status','paused');
 await page.goto('/#trayectoria');
 await expect(page.locator('.yoga-credentials')).toHaveAttribute('open','');
});
test('lotus is static with reduced motion and the three doors translate',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?lang=en');
 await expect(page.locator('.living-lotus-hero')).toHaveAttribute('data-motion','static');
 await expect(page.locator('.yoga-paths')).toContainText('Learn the asanas');
 await expect(page.locator('.living-lotus-movement')).toHaveCount(1);
});
