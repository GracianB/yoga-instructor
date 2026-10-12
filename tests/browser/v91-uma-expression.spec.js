const{test,expect}=require("@playwright/test");
test("V91 Uma keeps closed eyes at arrival, opens eyes at return and stays one guardian",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="meditation"]').first().evaluate(b=>b.click());
const guided=page.locator("#studio-guided"),uma=guided.locator(".meditation-guardian");
await expect(uma).toHaveCount(1);
await expect(uma.locator(".uma-open-eyes")).toHaveCSS("opacity","0");
await guided.evaluate(el=>el.dataset.meditationStep="return");
await expect(uma.locator(".uma-open-eyes")).toHaveCSS("opacity","1");
await expect(uma.locator(".uma-closed-eyes")).toHaveCSS("opacity","0");
});