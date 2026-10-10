const {test,expect}=require("@playwright/test");
test("V57: one large Nila stage and the current pose always stays in frame",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/");
 const root=page.locator("#flow-guide");
 await expect(root).toHaveAttribute("data-ready","true");
 const stage=page.locator("#instructor-flow .flow-theater .yy-stage");
 const rect=await stage.boundingBox();
 expect(rect.width).toBeGreaterThan(900);
 expect(rect.height).toBeGreaterThan(535);
 const svg=root.locator("svg.yy-svg");
 await expect.poll(()=>svg.getAttribute("viewBox")).not.toBe(null);
 const v=(await svg.getAttribute("viewBox")).split(" ").map(Number);
 expect(v).toHaveLength(4);
 expect(v[2]).toBeGreaterThanOrEqual(438);
 expect(v[2]).toBeLessThanOrEqual(618);
 expect(v[3]).toBeLessThanOrEqual(440);
 await expect(root.locator(".yy-pose.is-current .movement-guardian")).toHaveCount(1);
});
test("V57: path selection is bilingual, contextual and screen-reader linked",async({page})=>{
 await page.goto("/");
 const panel=page.locator(".studio-path-context");
 await expect(panel).toContainText(/MOVIMIENTO|MOVEMENT/);
 await expect(page.locator('button[data-studio-mode="asanas"]')).toHaveAttribute("aria-controls","movement-stage");
 await page.locator('button[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(panel).toContainText(/RESPIRACIÓN|BREATHING/);
 await expect(page.locator('button[data-studio-mode="breath"]')).toHaveAttribute("aria-controls","studio-guided");
 await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(panel).toContainText(/MEDITACIÓN|MEDITATION/);
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(panel).toContainText("MEDITATION");
 await expect(page.locator(".meditation-guardian")).toBeVisible();
});
for (const width of [320,390,768,1024,1440]){
 test("V57: enlarged three characters fit viewport "+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto("/");
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   await expect(page.locator(".studio-path-context")).toBeVisible();
   await page.locator('button[data-studio-mode="breath"]').evaluate(el=>el.click());
   await expect(page.locator(".studio-breath-dragon")).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
   await expect(page.locator(".meditation-guardian")).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}
