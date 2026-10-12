const{test,expect}=require("@playwright/test");
test("V92 the same three real mode buttons expose different identities in Spanish and English",async({page})=>{
await page.goto("/");const buttons=page.locator("#instructor-flow .studio-modes button[data-studio-mode]");
await expect(buttons).toHaveCount(3);
await expect(buttons.nth(0).locator(".v92-identity-signature")).toContainText("TIERRA");
await expect(buttons.nth(1).locator(".v92-identity-signature")).toContainText("AGUA");
await expect(buttons.nth(2).locator(".v92-identity-signature")).toContainText("LUNA");
await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
await expect(buttons.nth(0).locator(".v92-identity-signature")).toContainText("EARTH");
await expect(buttons.nth(2).locator(".v92-identity-signature")).toContainText("MOON");
});