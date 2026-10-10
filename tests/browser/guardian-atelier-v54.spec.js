const {test,expect}=require("@playwright/test");
test("V54: Nila has dragon horns, sculpted tapered limbs and keeps the 10 asanas",async({page})=>{
 await page.goto("/");
 const main=page.locator("#flow-guide");
 await expect(main).toHaveAttribute("data-movement-guardian","nila");
 await expect(main.locator(".movement-guardian")).toHaveCount(10);
 await expect(main.locator(".movement-guardian .mg-horn")).toHaveCount(20);
 await expect(main.locator(".movement-guardian .mg-limb-volume")).toHaveCount(40);
 await expect(main.locator(".movement-guardian .mg-hinge")).toHaveCount(40);
 const pane=main.locator(".yy-pose.is-current");
 await expect(pane.locator(".mg-head")).toHaveCount(1);
 await expect(pane.locator(".mg-horn")).toHaveCount(2);
 const art=pane.locator(".mg-limb-volume").first();
 await expect(art).toHaveCSS("stroke-width","2.2px");
 const skeletal=await pane.locator(".mg-limb-shell").first().evaluate(el=>getComputedStyle(el).display);
 expect(skeletal).toBe("none");
 const gallery=page.locator("#studio-asana-library");
 await expect(gallery.locator(".movement-guardian")).toHaveCount(3);
 await expect(gallery.locator(".mg-horn")).toHaveCount(6);
});
test("V54: desktop stage is spacious and navigation no longer consists of full-height rails",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/");
 const scene=page.locator("#instructor-flow .flow-theater .yy-stage");
 const box=await scene.boundingBox();
 // V66 keeps the artwork spacious inside a shared two-column studio.
 expect(box.width).toBeGreaterThan(560);
 expect(box.height).toBeGreaterThan(425);
 const rail=page.locator("#instructor-flow .flow-theater .flow-rail-button").first();
 const railBox=await rail.boundingBox();
 expect(railBox.height).toBeLessThan(85);
 expect(railBox.height).toBeGreaterThan(42);
 const selector=page.locator("#instructor-flow");
 expect((await selector.boundingBox()).width).toBeGreaterThan(950);
});
test("V54: Breathing and Meditation each have enlarged independent artwork",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/");
 const studio=page.locator("#studio-guided");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(studio.locator(".studio-breath-dragon")).toBeVisible();
 expect((await studio.locator(".studio-breath-dragon").boundingBox()).width).toBeGreaterThan(540);
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(studio.locator(".meditation-guardian")).toBeVisible();
 await expect(studio.locator(".studio-breath-dragon")).toBeHidden();
 expect((await studio.locator(".meditation-guardian").boundingBox()).width).toBeGreaterThan(540);
});
for(const width of [320,390,760,1024]){
 test("V54: theatre and guardians do not cause horizontal overflow at "+width,async({page})=>{
  await page.setViewportSize({width,height:850});
  await page.goto("/");
  await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
  await expect(page.locator(".studio-breath-dragon")).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
  await expect(page.locator(".meditation-guardian")).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}
