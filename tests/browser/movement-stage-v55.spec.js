const {test,expect}=require("@playwright/test");
test("V55: flow cockpit begins ready, has one 10-step rail, and follows real phases",async({page})=>{
 await page.goto("/");
 const rail=page.locator("#instructor-flow .flow-steps");
 await expect(rail).toHaveCount(1);
 await expect(rail.locator(".flow-step")).toHaveCount(10);
 await expect(rail.locator(".flow-step.is-current")).toHaveCount(1);
 await expect(rail).toHaveAttribute("aria-label",/fase 1 de 10|phase 1 of 10/);
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 await expect.poll(()=>page.locator(".flow-console").getAttribute("data-stage-index")).toBe("1");
 const next=page.locator('[data-flow-action="next"]');
 await expect(next).toBeEnabled({timeout:10000});
 await next.evaluate(el=>el.click());
 await expect.poll(()=>page.locator(".flow-console").getAttribute("data-stage-index")).toBe("2");
 await expect(rail.locator(".flow-step.is-complete")).toHaveCount(1);
 await expect(rail.locator(".flow-step.is-current")).toHaveCount(1);
});
test("V55: desktop stage is spacious, figure and controls stay in one cockpit",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/");
 const stage=page.locator("#instructor-flow .flow-theater .yy-stage");
 const rect=await stage.boundingBox();
 expect(rect.width).toBeGreaterThan(900);
 expect(rect.height).toBeGreaterThan(500);
 const consoleRoot=page.locator(".flow-console");
 await expect(consoleRoot).toHaveCSS("display","flex");
 await expect(consoleRoot.locator(".flow-console-top")).toBeVisible();
 // Pause/Reset intentionally stay hidden before Start; the primary CTA
 // remains the only entry point to a live session.
 await expect(consoleRoot.locator(".flow-controls")).toBeHidden();
 await expect(consoleRoot.locator(".flow-start")).toBeVisible();
 await consoleRoot.locator(".flow-start").evaluate(el=>el.click());
 await expect(consoleRoot.locator(".flow-controls")).toBeVisible();
 await expect(consoleRoot.locator(".flow-steps")).toBeVisible();
});
test("V55: three characters keep their own artworks and no second audio is created",async({page})=>{
 await page.goto("/");
 await expect(page.locator("#flow-guide .movement-guardian")).toHaveCount(10);
 await expect(page.locator("audio")).toHaveCount(1);
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(page.locator(".studio-breath-dragon")).toBeVisible();
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(page.locator(".meditation-guardian")).toBeVisible();
 await expect(page.locator("audio")).toHaveCount(1);
});
for(const w of [320,390,760,1024]){
 test("V55: new cockpit does not overflow at "+w,async({page})=>{
  await page.setViewportSize({width:w,height:850});await page.goto("/");
  await expect(page.locator(".flow-steps")).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await expect(page.locator(".flow-start")).toBeVisible();
 });
}
test("V55: reduced motion disables progress scale and UI transitions",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");
 await expect(page.locator(".flow-step.is-current")).toHaveCSS("scale","1");
 await expect(page.locator(".flow-step.is-current")).toHaveCSS("transition-duration","0s");
});
