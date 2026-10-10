const {test,expect}=require("@playwright/test");

test("V52: Nila has real articulated elbows, shoulders, hips and knees in all ten poses",async({page})=>{
 await page.goto("/");
 const root=page.locator("#flow-guide");
 await expect(root).toHaveAttribute("data-ready","true");
 const poses=root.locator(".yy-pose");
 await expect(poses).toHaveCount(10);
 for(const pose of await poses.all()){
  await expect(pose.locator(".movement-guardian .mg-socket")).toHaveCount(4);
  await expect(pose.locator(".movement-guardian .mg-hinge")).toHaveCount(4);
  await expect(pose.locator(".movement-guardian .mg-elbow")).toHaveCount(2);
  await expect(pose.locator(".movement-guardian .mg-shoulder")).toHaveCount(2);
  await expect(pose.locator(".movement-guardian .mg-knee")).toHaveCount(2);
  await expect(pose.locator(".movement-guardian .mg-hip")).toHaveCount(2);
  await expect(pose.locator(".movement-guardian [data-mg-limb]")).toHaveCount(4);
 }
 const first=poses.first();
 await page.locator('[data-yy-form="yang"]').evaluate(el=>el.click());
 const shape=await first.locator(".mg-body").getAttribute("d");
 const warm=await root.evaluate(el=>getComputedStyle(el).getPropertyValue("--mg-coat").trim());
 await page.locator('[data-yy-form="yin"]').evaluate(el=>el.click());
 const cool=await root.evaluate(el=>getComputedStyle(el).getPropertyValue("--mg-coat").trim());
 expect(warm).not.toBe(cool);
 expect(await first.locator(".mg-body").getAttribute("d")).toBe(shape);
});

test("V52: the same breath clock moves dragon and sanctuary, meditation stays still",async({page})=>{
 await page.goto("/");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 const guided=page.locator("#studio-guided");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(guided).toHaveAttribute("data-studio-status","running");
 await expect.poll(()=>guided.evaluate(el=>Number(el.style.getPropertyValue("--studio-guardian-expansion"))),{timeout:6000}).toBeGreaterThan(1.03);
 await expect.poll(()=>guided.evaluate(el=>el.style.getPropertyValue("--studio-breath-scale")),{timeout:6000}).not.toBe("1");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(guided).toHaveAttribute("data-studio-status","paused");
 const before=await guided.evaluate(el=>el.style.getPropertyValue("--studio-guardian-expansion"));
 await page.waitForTimeout(480);
 expect(await guided.evaluate(el=>el.style.getPropertyValue("--studio-guardian-expansion"))).toBe(before);
 await page.emulateMedia({reducedMotion:"reduce"});
 const transform=await page.locator(".studio-guided-stage").evaluate(el=>getComputedStyle(el,"::before").transform);
 expect(transform).toBe("none");
 // A paused session intentionally locks mode switching: reset it first.
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await expect(guided).toHaveAttribute("data-studio-status","idle");
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(page.locator(".meditation-guardian")).toBeVisible();
 await expect(page.locator(".meditation-guardian")).toHaveCSS("animation-name","none");
});
