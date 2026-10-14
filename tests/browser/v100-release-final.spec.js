const{test,expect}=require("@playwright/test");
test("V100 320px studio behaves in three languages/modes without a duplicate guardian",async({page})=>{
await page.setViewportSize({width:320,height:780});
await page.goto("/");await page.locator(".studio-status-drawer>summary").click();
const root=page.locator("#instructor-flow");await expect(page.locator("#studio-readiness")).toBeVisible();
await expect(page.locator(".meditation-guardian")).toHaveCount(1);
await expect(page.locator(".studio-breath-dragon")).toHaveCount(1);
await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
await expect(root).toHaveAttribute("data-studio-mode","breath");
await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
await expect(page.locator("#studio-readiness .v98-mode")).toContainText("Dragon");
await page.locator('[data-studio-mode="meditation"]').first().evaluate(x=>x.click());
await expect(page.locator("#studio-readiness .v98-mode")).toContainText("Uma");
await expect(page.locator("#focus-audio")).toHaveJSProperty("paused",true);
await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-status","idle");
const overflow=await page.locator("#instructor-flow").evaluate(el=>el.scrollWidth-el.clientWidth);
expect(overflow).toBeLessThanOrEqual(1);
});
test("V100 browser respects a reduced-motion meditation and a silent exit",async({page})=>{
await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");await page.locator(".studio-status-drawer>summary").click();
await page.locator('[data-studio-mode="meditation"]').first().evaluate(x=>x.click());
const guided=page.locator("#studio-guided");
await page.locator('button[data-meditation-style="silent"]').evaluate(x=>x.click());
await expect(page.locator(".v89-ritual")).toBeHidden();
await expect(page.locator('[data-v90-action="voice"]')).toBeDisabled();
await expect(page.locator(".meditation-guardian")).toHaveCount(1);
const animation=await page.locator(".meditation-guardian").evaluate(el=>getComputedStyle(el).animationName);
expect(animation).toBe("none");
});
