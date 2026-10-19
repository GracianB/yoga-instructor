const {test,expect}=require("@playwright/test");

test("V1 final: teaching in the past tense and green-to-lilac plant",async({page})=>{
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 const heading=page.locator("#experiencia .section-head h2");
 const plant=page.locator("#experiencia .yoga-growth");
 await expect(heading).toContainText("Dónde he enseñado");
 await expect(plant).toBeVisible();
 const animation=await plant.evaluate(el=>getComputedStyle(el).animationName);
 expect(animation).toContain("yogaGrowthColor");
 await page.locator('[data-set-lang="en"]').first().click();
 await expect(heading).toContainText("Where I’ve taught");
 await page.emulateMedia({reducedMotion:"reduce"});
 expect(await plant.evaluate(el=>getComputedStyle(el).animationName)).toBe("none");
});

test("V1 final: lotus spotlight brightens on hover without accelerating or enlarging it",async({page})=>{
 await page.setViewportSize({width:1280,height:820});
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 const flower=page.locator("#inicio .hero-mandala");
 const region=page.locator("#inicio .mandala-parallax");
 await expect(flower).toBeVisible();
 const before=await flower.evaluate(el=>({
  width:el.getBoundingClientRect().width,
  duration:getComputedStyle(el).animationDuration,
  filter:getComputedStyle(el).filter
 }));
 await region.hover({force:true});
 const after=await flower.evaluate(el=>({
  width:el.getBoundingClientRect().width,
  duration:getComputedStyle(el).animationDuration,
  filter:getComputedStyle(el).filter
 }));
 expect(after.width).toBeCloseTo(before.width,0);
 expect(after.width).toBeLessThanOrEqual(190);
 expect(after.duration).toBe(before.duration);
 expect(after.filter).not.toBe(before.filter);
});
