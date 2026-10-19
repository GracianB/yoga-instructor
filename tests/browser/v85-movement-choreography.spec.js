const{test,expect}=require("@playwright/test");
test("V85 manual Movement journey reuses original book and never starts canonical flow",async({page})=>{
await page.goto("/"); await page.locator("#p2-asana-toggle").evaluate(el=>el.click());const root=page.locator("#movement-mini"),book=page.locator("#studio-asana-library");
await expect(root).toBeVisible();
await expect(root.locator("progress")).toHaveAttribute("value","1");
await root.locator('[data-v85-action="next"]').evaluate(el=>el.click());
await expect(root.locator("progress")).toHaveAttribute("value","2");
await expect(book.locator('button[data-library-pose="v68-warrior-ii"]')).toHaveAttribute("aria-pressed","true");
await root.locator('[data-v85-action="next"]').evaluate(el=>el.click());
await expect(book.locator('button[data-library-pose="v68-tree"]')).toHaveAttribute("aria-pressed","true");
await expect(root.locator('[data-v85-action="next"]')).toBeDisabled();
await root.locator('[data-v85-action="restart"]').evaluate(el=>el.click());
await expect(root.locator("progress")).toHaveAttribute("value","1");
await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
});
test("V85 switch route and language without second studio or forced autoplay",async({page})=>{
await page.goto("/"); await page.locator("#p2-asana-toggle").evaluate(el=>el.click());const root=page.locator("#movement-mini");
await root.locator("#v85-route").selectOption("mobility");
await expect(root.locator(".v85-asana-title")).toContainText("Postura fácil");
await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
await expect(root.locator(".v85-asana-title")).toContainText("Easy pose");
await expect(root.locator(".v85-current h5")).toContainText("floor");
await expect(root.locator(".v85-main-link")).toHaveAttribute("href","#instructor-flow");
});
test("V85 reduced motion disables transition even after Nila pose change",async({page})=>{
await page.emulateMedia({reducedMotion:"reduce"});
await page.goto("/"); await page.locator("#p2-asana-toggle").evaluate(el=>el.click());const root=page.locator("#movement-mini");
await root.locator('[data-v85-action="next"]').evaluate(el=>el.click());
const active=page.locator("#studio-asana-library .yy-pose.is-current .movement-guardian").first();
await expect(active).toBeVisible();
expect(await active.evaluate(x=>getComputedStyle(x).animationName)).toBe("none");
});
