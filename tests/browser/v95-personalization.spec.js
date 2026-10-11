const{test,expect}=require("@playwright/test");
test("V95 guardian shortcut prepares settings without starting practice",async({page})=>{
await page.goto("/");const panel=page.locator("#studio-preferences");await panel.locator("summary").evaluate(el=>el.click());
const personal=panel.locator(".v95-panel");await expect(personal).toBeVisible();
await personal.locator('[data-v95-guardian="meditation"]').evaluate(el=>el.click());
await expect(panel.locator('[data-v93-setting="mode"]')).toHaveValue("meditation");
await expect(panel.locator('[data-v93-setting="focus"]')).toHaveValue("space");
await expect(page.locator("#instructor-flow")).toHaveAttribute("data-studio-mode","asanas");
await panel.locator('[data-v93-action="apply"]').evaluate(el=>el.click());
await expect(page.locator("#instructor-flow")).toHaveAttribute("data-studio-mode","meditation");
await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-status","idle");
});
test("V95 visual comfort and saved sequence are opt-in and removable",async({page})=>{
await page.goto("/");const panel=page.locator("#studio-preferences");await panel.locator("summary").evaluate(el=>el.click());
await panel.locator('[data-v95-comfort="readable"]').evaluate(el=>el.click());
await expect(page.locator("#instructor-flow")).toHaveAttribute("data-v95-comfort","readable");
await expect.poll(()=>page.evaluate(()=>localStorage.getItem("yoga-personalization-v95"))).toBeNull();
await panel.locator('[data-v93-action="save"]').evaluate(el=>el.click());
await expect.poll(()=>page.evaluate(()=>localStorage.getItem("yoga-personalization-v95"))).toContain('"comfort":"readable"');
await panel.locator('[data-v93-action="clear"]').evaluate(el=>el.click());
await expect(page.locator("#instructor-flow")).toHaveAttribute("data-v95-comfort","balanced");
await expect.poll(()=>page.evaluate(()=>localStorage.getItem("yoga-personalization-v95"))).toBeNull();
});