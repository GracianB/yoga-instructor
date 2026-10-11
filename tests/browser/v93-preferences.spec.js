const{test,expect}=require("@playwright/test");
test("V93 applies Breath settings without starting session and saves only after explicit click",async({page})=>{
await page.goto("/");const prefs=page.locator("#studio-preferences");
await prefs.locator("summary").evaluate(x=>x.click());
await prefs.locator('[data-v93-setting="mode"]').selectOption("breath");
await prefs.locator('[data-v93-setting="pattern"]').selectOption("free");
await expect.poll(()=>page.evaluate(()=>localStorage.getItem("yoga-practice-defaults-v93"))).toBeNull();
await prefs.locator('[data-v93-action="apply"]').evaluate(x=>x.click());
await expect(page.locator("#instructor-flow")).toHaveAttribute("data-studio-mode","breath");
await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-status","idle");
await expect(page.locator('button[data-breath-pattern="free"]')).toHaveAttribute("aria-pressed","true");
await prefs.locator('[data-v93-action="save"]').evaluate(x=>x.click());
await expect.poll(()=>page.evaluate(()=>localStorage.getItem("yoga-practice-defaults-v93"))).toContain('"mode":"breath"');
await prefs.locator('[data-v93-action="clear"]').evaluate(x=>x.click());
await expect.poll(()=>page.evaluate(()=>localStorage.getItem("yoga-practice-defaults-v93"))).toBeNull();
});
test("V93 blocks mutation of a running practice",async({page})=>{
await page.goto("/");const prefs=page.locator("#studio-preferences");await prefs.locator("summary").evaluate(x=>x.click());
await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
await page.locator('[data-studio-action="primary"]').evaluate(x=>x.click());
await prefs.locator('[data-v93-setting="mode"]').selectOption("meditation");
await prefs.locator('[data-v93-action="apply"]').evaluate(x=>x.click());
await expect(page.locator("#instructor-flow")).toHaveAttribute("data-studio-mode","breath");
await expect(prefs.locator(".v93-status")).toContainText("Primero termina");
});