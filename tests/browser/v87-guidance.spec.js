const{test,expect}=require("@playwright/test");
test("V87 can hide seconds while preserving the real breath session",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="breath"]').first().evaluate(el=>el.click());
const panel=page.locator(".v87-guidance"),guided=page.locator("#studio-guided");
await expect(panel).toBeVisible();
await panel.locator('[data-v87-display="simple"]').evaluate(b=>b.click());
await expect(guided).toHaveAttribute("data-v87-display","simple");
await page.locator('[data-studio-action="primary"]').evaluate(b=>b.click());
await expect(guided).toHaveAttribute("data-studio-status","running");
await expect(page.locator("#studio-breath-phase-detail")).not.toContainText(/\d+ s/);
await panel.locator('[data-v87-display="numbers"]').evaluate(b=>b.click());
await expect(page.locator("#studio-breath-phase-detail")).toContainText(/\d+ s/);
});
test("V87 toggles language and hides in Meditation",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="breath"]').first().evaluate(b=>b.click());
await page.locator('[data-set-lang="en"]').first().evaluate(b=>b.click());
await expect(page.locator(".v87-guidance-heading strong")).toHaveText("GUIDANCE IS OPTIONAL");
await page.locator('[data-studio-mode="meditation"]').first().evaluate(b=>b.click());
await expect(page.locator(".v87-guidance")).toBeHidden();
});
