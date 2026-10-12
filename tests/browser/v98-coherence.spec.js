const{test,expect}=require("@playwright/test");
test("V98 studio readiness shows live mode, options and status without starting anything",async({page})=>{
await page.goto("/");const panel=page.locator("#studio-readiness");
await expect(panel).toHaveCount(1);await expect(panel.locator(".v98-mode")).toContainText("Nila");
await expect(panel.locator(".v98-state")).toContainText("Lista");
await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
await expect(panel.locator(".v98-mode")).toContainText("Dragón");
await page.locator('[data-breath-pattern="free"]').evaluate(x=>x.click());
await expect(panel.locator(".v98-detail")).toContainText("sin cuenta");
await page.locator('[data-studio-action="primary"]').evaluate(x=>x.click());
await expect(panel.locator(".v98-state")).toContainText("En práctica");
});
test("V98 readiness follows language, meditation focus and opens existing preferences",async({page})=>{
await page.goto("/");const panel=page.locator("#studio-readiness");
await page.locator('[data-studio-mode="meditation"]').first().evaluate(x=>x.click());
await page.locator('[data-meditation-focus="space"]').evaluate(x=>x.click());
await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
await expect(panel.locator(".v98-mode")).toContainText("Uma");
await expect(panel.locator(".v98-detail")).toContainText("surroundings");
await panel.locator(".v98-preferences").evaluate(x=>x.click());
await expect(page.locator("#studio-preferences")).toHaveAttribute("open","");
});
test("V98 remains horizontally contained at 320 and 375 px",async({page})=>{
for(const width of [320,375]){await page.setViewportSize({width,height:812});await page.goto("/");
await expect(page.locator("#studio-readiness")).toBeVisible();
const overflow=await page.locator("#studio-readiness").evaluate(el=>el.scrollWidth-el.clientWidth);
expect(overflow).toBeLessThanOrEqual(1);}
});