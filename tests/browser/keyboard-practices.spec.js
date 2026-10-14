const {test,expect}=require('@playwright/test');
test('practice tabs can be selected from keyboard without triggering hidden Flow shortcuts',async({page})=>{
 await page.goto('/#instructor-flow');const tabs=page.locator('.studio-modes button');
 await tabs.nth(0).focus();await page.keyboard.press('ArrowRight');
 await expect(page.locator('#instructor-flow')).toHaveAttribute('data-studio-mode','breath');
 await expect(tabs.nth(1)).toBeFocused();await page.keyboard.press('End');
 await expect(page.locator('#instructor-flow')).toHaveAttribute('data-studio-mode','meditation');
 await page.keyboard.press('Home');await expect(page.locator('#instructor-flow')).toHaveAttribute('data-studio-mode','asanas');
 await expect(page.locator('#movement-stage')).toHaveAttribute('data-flow-status','idle');
});
