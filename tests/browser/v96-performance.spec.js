const{test,expect}=require("@playwright/test");
test("V96 maintains live seconds without continuously mutating focusable controls",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
await page.locator('[data-studio-action="primary"]').evaluate(x=>x.click());
const observed=await page.evaluate(async()=>{
 const root=document.getElementById("instructor-flow"),buttons=root.querySelectorAll('button[data-studio-mode],button[data-breath-pattern],button[data-studio-action]');
 let writes=0;const watcher=new MutationObserver(events=>{writes+=events.length});
 for(const button of buttons)watcher.observe(button,{attributes:true,attributeFilter:["aria-pressed","disabled","aria-label"]});
 await new Promise(resolve=>setTimeout(resolve,900));watcher.disconnect();return writes;
});
expect(observed).toBeLessThanOrEqual(3);
await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-status","running");
});
test("V96 still updates selected options on pause and on resume",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
const start=page.locator('[data-studio-action="primary"]');
await start.evaluate(x=>x.click());await expect(start).toHaveAttribute("aria-pressed","true");
await start.evaluate(x=>x.click());await expect(start).toHaveAttribute("aria-pressed","false");
await start.evaluate(x=>x.click());await expect(start).toHaveAttribute("aria-pressed","true");
});