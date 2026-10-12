const{test,expect}=require("@playwright/test");
test("V90 meditation silence and music control share a single existing soundtrack",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="meditation"]').first().evaluate(x=>x.click());
const panel=page.locator(".v90-sound");await expect(panel).toBeVisible();
await expect(panel.locator('[data-v90-action="silence"]')).toHaveAttribute("aria-pressed","true");
await expect(page.locator("audio#focus-audio")).toHaveCount(1);
await panel.locator('[data-v90-action="silence"]').evaluate(x=>x.click());
await expect(page.locator("audio#focus-audio")).toHaveJSProperty("paused",true);
await expect(panel.locator(".v90-status")).toContainText("Silencio");
});
test("V90 English accessibility and silent meditation disable voice guidance",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="meditation"]').first().evaluate(x=>x.click());
const panel=page.locator(".v90-sound");
await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
await expect(panel.locator("#v90-title")).toContainText("Listen only");
await page.locator('[data-meditation-style="silent"]').evaluate(x=>x.click());
await expect(panel.locator('[data-v90-action="voice"]')).toBeDisabled();
await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
await expect(panel).toBeHidden();
});
