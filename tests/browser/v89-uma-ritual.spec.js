const{test,expect}=require("@playwright/test");
test("V89 Uma introduces focus stages inside Meditation, never a second clock",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="meditation"]').first().evaluate(b=>b.click());
const panel=page.locator(".v89-ritual"),studio=page.locator("#studio-guided");
await expect(panel).toBeVisible();
await expect(panel.locator("#v89-title")).toContainText("respiración");
await panel.locator(".v89-return").evaluate(b=>b.click());
await expect(panel.locator(".v89-message")).toContainText("mente");
await page.locator('[data-meditation-focus="body"]').evaluate(b=>b.click());
await expect(panel.locator("#v89-title")).toContainText("apoyo");
await page.locator('[data-studio-action="primary"]').evaluate(b=>b.click());
await expect(studio).toHaveAttribute("data-studio-status","running");
await expect(studio).toHaveAttribute("data-meditation-step",/arrive|anchor/);
});
test("V89 Uma silent mode suppresses prompts and translates returning guidance",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="meditation"]').first().evaluate(b=>b.click());
const panel=page.locator(".v89-ritual");
await page.locator('[data-set-lang="en"]').first().evaluate(b=>b.click());
await expect(panel.locator("#v89-title")).toContainText("breath");
await page.locator('[data-meditation-style="silent"]').evaluate(b=>b.click());
await expect(panel).toBeHidden();
await page.locator('[data-meditation-style="guided"]').evaluate(b=>b.click());
await expect(panel).toBeVisible();
});
