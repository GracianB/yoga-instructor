const {test,expect}=require("@playwright/test");
test("V53: the three additional poses show Nila, with no visible old skeleton",async({page})=>{
 await page.goto("/");
 const explorer=page.locator("#studio-asana-library");
 await expect(explorer).toBeVisible();
 await expect(explorer.locator(".movement-guardian")).toHaveCount(3);
 await expect(explorer.locator(".yy-pose")).toHaveCount(3);
 await expect(explorer.locator(".studio-library-stage")).toHaveAttribute("data-library-guardian","nila");
 for(const id of ["d24-mountain","d24-downward","d24-butterfly"]){
  await explorer.locator('[data-library-pose="'+id+'"]').evaluate(el=>el.click());
  const active=explorer.locator(".yy-pose.is-current");
  await expect(active).toHaveAttribute("data-pose",id);
  await expect(active.locator(".movement-guardian")).toHaveCount(1);
  await expect(active.locator(".mg-elbow")).toHaveCount(2);
  await expect(active.locator(".mg-knee")).toHaveCount(2);
  await expect(active.locator(".mg-head")).toHaveCount(1);
  const old=await active.locator(".yy-character>:not(.movement-guardian)").first().evaluate(el=>getComputedStyle(el).opacity);
  expect(old).toBe("0");
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test("V53: Yin/Yang change gallery palette while preserving Nila geometry",async({page})=>{
 await page.goto("/");
 const root=page.locator("#flow-guide");
 const gallery=page.locator(".studio-library-stage");
 const shape=await gallery.locator(".yy-pose.is-current .mg-body").getAttribute("d");
 await root.locator('[data-yy-form="yin"]').evaluate(el=>el.click());
 await expect(gallery).toHaveAttribute("data-spirit","yin");
 const yin=await gallery.evaluate(el=>getComputedStyle(el).getPropertyValue("--mg-coat").trim());
 await root.locator('[data-yy-form="yang"]').evaluate(el=>el.click());
 await expect(gallery).toHaveAttribute("data-spirit","yang");
 const yang=await gallery.evaluate(el=>getComputedStyle(el).getPropertyValue("--mg-coat").trim());
 expect(yin).not.toBe(yang);
 expect(await gallery.locator(".yy-pose.is-current .mg-body").getAttribute("d")).toBe(shape);
});
test("V53: breathing title and countdown readable against bright stage in dark mode",async({page})=>{
 await page.goto("/");
 await page.evaluate(()=>document.documentElement.dataset.theme="dark");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-active","breath");
 await expect(page.locator("#studio-guided .studio-guided-title")).toHaveCSS("color","rgb(33, 71, 61)");
 await expect(page.locator("#studio-guided .studio-guided-countdown")).toHaveCSS("color","rgb(35, 74, 64)");
});
