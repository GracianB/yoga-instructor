const {test,expect}=require("@playwright/test");
test("V77 role filters expose only selected narrative and preserve native disclosure",async({page})=>{
 await page.goto("/");
 const root=page.locator("#trayectoria");
 await expect(root.locator(".v77-entry")).toHaveCount(4);
 await root.locator('[data-v77-filter="workplace"]').evaluate(x=>x.click());
 await expect(root.locator("#v77-count")).toContainText("1 experiencia");
 await expect(root.locator('.v77-entry:not([hidden])')).toHaveCount(1);
 await root.locator('.v77-entry:not([hidden]) summary').evaluate(x=>x.click());
 await expect(root.locator(".v77-entry:not([hidden]) details")).toHaveAttribute("open","");
 await root.locator('[data-v77-filter="all"]').evaluate(x=>x.click());
 await expect(root.locator('.v77-entry:not([hidden])')).toHaveCount(4);
});
test("V77 English language switches CV and letter without losing a filter",async({page})=>{
 await page.goto("/");const root=page.locator("#trayectoria");
 await root.locator('[data-v77-filter="training"]').evaluate(el=>el.click());
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(root.locator("#v77-title")).toContainText("Beyond the dates");
 await expect(root.locator("#v77-count")).toContainText("1 experience");
 await expect(root.locator("#v77-cv")).toHaveAttribute("href",/Yoga_EN\.pdf$/);
 await expect(root.locator("#v77-letter")).toHaveAttribute("href",/Cover_Letter_Yoga_EN\.pdf$/);
});
