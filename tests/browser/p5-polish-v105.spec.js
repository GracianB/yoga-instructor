const {test,expect}=require("@playwright/test");

test("P5 · Dragon visibly grows while inhaling and Uma gains decorative magic, without errors",async({page})=>{
 test.setTimeout(60000);
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 const dragon=page.locator("#studio-guided .studio-companion>svg.studio-breath-dragon");
 const scaleY=()=>dragon.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).d);
 expect(await scaleY()).toBeCloseTo(1,2);
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect.poll(scaleY,{timeout:8000}).toBeGreaterThan(1.04);
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 const uma=page.locator("#instructor-flow .meditation-guardian");
 await expect(uma.locator(".v105-magic")).toHaveCount(2);
 await expect(uma.locator(".v105-spark")).toHaveCount(14);
 await page.evaluate(()=>window.YOGA_PRACTICE_POLISH_V105.scan());
 await expect(uma.locator(".v105-magic")).toHaveCount(2);
 expect(errors).toEqual([]);
});

test("P5 · Floating dock collapses to a pill while the practice console is on screen",async({page})=>{
 await page.goto("/");
 await page.locator("#instructor-flow").scrollIntoViewIfNeeded();
 await expect(page.locator("body")).toHaveAttribute("data-v105-console","in-view");
 await expect(page.locator(".sanctuary-dock .sanctuary-dock-tools")).toBeHidden();
});
