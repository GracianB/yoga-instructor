const {test,expect}=require("@playwright/test");
test("V81 routes and search filter the existing library without starting the Flow clock",async({page})=>{
await page.goto("/"); await page.locator("#p2-asana-toggle").evaluate(el=>el.click()); await page.locator("#p2-asana-advanced > summary").evaluate(el=>el.click());const root=page.locator("#studio-asana-library");
await expect(root).toHaveCount(1);
const buttons=root.locator("button[data-library-pose]");
await expect(buttons).toHaveCount(12);
await root.locator('[data-v81-route="roots"]').evaluate(x=>x.click());
await expect(root.locator("button[data-library-pose]:not([hidden])")).toHaveCount(3);
await expect(root.locator('[data-v81-route="roots"]')).toHaveAttribute("aria-pressed","true");
await root.locator("#v81-search").fill("árbol");
await expect(root.locator("button[data-library-pose]:not([hidden])")).toHaveCount(1);
await root.locator(".v81-clear").evaluate(x=>x.click());
await expect(root.locator("button[data-library-pose]:not([hidden])")).toHaveCount(12);
await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
});
test("V81 English and category contextual guidance follow selected pose",async({page})=>{
await page.goto("/"); await page.locator("#p2-asana-toggle").evaluate(el=>el.click()); await page.locator("#p2-asana-advanced > summary").evaluate(el=>el.click());const root=page.locator("#studio-asana-library");
await root.locator('button[data-library-pose="d24-downward"]').evaluate(x=>x.click());
await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
await expect(root.locator(".v81-familynote strong")).toContainText("Standing");
await expect(root.locator(".v81-search label")).toContainText("Search");
await expect(root.locator(".studio-library-name")).toContainText("Downward dog");
});
