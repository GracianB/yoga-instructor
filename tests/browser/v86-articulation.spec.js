const{test,expect}=require("@playwright/test");
test("V86 dragon breath articulates only with the existing studio clock",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="breath"]').first().evaluate(el=>el.click());
const guided=page.locator("#studio-guided");
await expect(guided).toHaveAttribute("data-studio-active","breath");
await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
await expect(guided).toHaveAttribute("data-studio-status","running");
const chest=await guided.evaluate(el=>el.style.getPropertyValue("--v86-chest"));
expect(Number(chest)).toBeGreaterThanOrEqual(1);
await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
await expect(guided).toHaveAttribute("data-studio-status","paused");
const frozen=await guided.evaluate(el=>el.style.getPropertyValue("--v86-chest"));
await page.waitForTimeout(320);
expect(await guided.evaluate(el=>el.style.getPropertyValue("--v86-chest"))).toBe(frozen);
});
test("V86 free breathing and reduced motion do not force guardian movement",async({page})=>{
await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");
await page.locator('[data-studio-mode="breath"]').first().evaluate(el=>el.click());
await page.locator('[data-breath-pattern="free"]').evaluate(el=>el.click());
await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
const stage=page.locator("#studio-guided");
await expect(stage).toHaveAttribute("data-v86-breath","rest");
await expect(stage.locator(".sd31-head-unit")).toHaveCSS("transform","none");
});
