const{test,expect}=require("@playwright/test");
test("V88 changes the existing Breath environment without resetting PracticeClock",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
const panel=page.locator(".v88-atmosphere"),stage=page.locator("#studio-guided");
await expect(panel).toBeVisible();
await page.locator('[data-studio-action="primary"]').evaluate(x=>x.click());
await expect(stage).toHaveAttribute("data-studio-status","running");
await panel.locator('[data-v88-atmosphere="ocean"]').evaluate(x=>x.click());
await expect(stage).toHaveAttribute("data-v88-atmosphere","ocean");
await panel.locator('[data-v88-intensity="still"]').evaluate(x=>x.click());
await expect(stage).toHaveAttribute("data-v88-intensity","still");
await expect(stage).toHaveAttribute("data-studio-status","running");
await expect(stage).toHaveCSS("--v86-chest","1.0000");
});
test("V88 keeps palette and intensity after language change, hides in Meditation",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
const panel=page.locator(".v88-atmosphere"),stage=page.locator("#studio-guided");
await panel.locator('[data-v88-atmosphere="twilight"]').evaluate(x=>x.click());
await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
await expect(panel.locator(".v88-head strong")).toContainText("BREATHING ENVIRONMENT");
await expect(stage).toHaveAttribute("data-v88-atmosphere","twilight");
await page.locator('[data-studio-mode="meditation"]').first().evaluate(x=>x.click());
await expect(panel).toBeHidden();
});
