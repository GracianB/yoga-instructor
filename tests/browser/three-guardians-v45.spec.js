const {test,expect}=require("@playwright/test");
test("V45: movement has exactly one current Nila guardian per pose, old art retained but invisible",async({page})=>{
 await page.goto("/");
 const root=page.locator("#flow-guide");
 await expect(root).toHaveAttribute("data-ready","true");
 await expect(root).toHaveAttribute("data-movement-guardian","nila");
 await expect(root.locator(".yy-pose .movement-guardian")).toHaveCount(10);
 await expect(root.locator(".yy-pose.is-current .movement-guardian")).toHaveCount(1);
 await expect(root.locator(".yy-pose.is-current .mg-head")).toHaveCount(1);
 const old=await root.locator(".yy-pose.is-current .yy-character>.yy-legs").evaluate(el=>getComputedStyle(el).opacity);
 expect(old).toBe("0");
 // Navigate all ten without duplicating the character or changing Flow's source of truth.
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 for(let i=0;i<9;i++){
   await page.locator('[data-flow-action="next"]').evaluate(el=>el.click());
   await expect.poll(()=>root.locator(".yy-pose.is-current .movement-guardian").count(),{timeout:5000}).toBe(1);
 }
 await expect(root).toHaveAttribute("data-phase","finish");
 await expect(root.locator(".yy-pose.is-current .movement-guardian")).toHaveCount(1);
});
test("V45: three different silhouettes appear in their matching practice only",async({page})=>{
 await page.goto("/");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(page.locator("#studio-guided .studio-breath-dragon")).toBeVisible();
 await expect(page.locator("#studio-guided .meditation-guardian")).toBeHidden();
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(page.locator("#studio-guided .meditation-guardian")).toBeVisible();
 await expect(page.locator("#studio-guided .studio-breath-dragon")).toBeHidden();
 await page.locator('[data-meditation-focus="body"]').evaluate(el=>el.click());
 await expect(page.locator("#studio-guided")).toHaveAttribute("data-meditation-focus","body");
 await page.locator('[data-studio-mode="asanas"]').evaluate(el=>el.click());
 await expect(page.locator("#flow-guide .movement-guardian").first()).toBeAttached();
 await expect(page.locator("#studio-guided")).toBeHidden();
});
for (const width of [320,390,768,1440]){
 test("V45: connected Movement and Meditation stages do not overflow at "+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto("/");
   await expect(page.locator("#flow-guide .movement-guardian")).toHaveCount(10);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
   await expect(page.locator(".meditation-guardian")).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}
test("V45: quiet mode and reduced motion do not activate new character motion",async({page})=>{
 await page.goto("/");
 await page.emulateMedia({reducedMotion:"reduce"});
 await expect(page.locator("#flow-guide .movement-guardian").first()).toHaveCSS("filter","none");
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 const node=page.locator(".meditation-guardian");
 await expect(node).toBeVisible();
 await expect(node).toHaveCSS("animation-name","none");
});
