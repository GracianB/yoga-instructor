const {test,expect}=require("@playwright/test");

test("Final method slide: discoverable, genuinely interactive and bilingual",async({page})=>{
 await page.setViewportSize({width:1280,height:820});
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 const root=page.locator("#main");
 const slide=page.locator("#metodo");
 await expect(slide).toBeVisible();
 await expect(slide.locator(".yoga-method-visual")).toBeVisible();
 await page.locator('#nav a[href="#metodo"]').click();
 await expect(root).toHaveAttribute("data-p2-focus","metodo");
 await expect(slide).toBeVisible();
 await expect(page.locator("#experiencia")).toBeHidden();

 const presence=page.locator("#method-tab-presence");
 const breath=page.locator("#method-tab-breath");
 const move=page.locator("#method-tab-move");
 await expect(presence).toHaveAttribute("aria-selected","true");
 await breath.click();
 await expect(slide).toHaveAttribute("data-method-state","breath");
 await expect(breath).toHaveAttribute("aria-selected","true");
 await expect(page.locator("#method-panel-breath")).toBeVisible();
 await expect(page.locator("#method-panel-presence")).toBeHidden();
 await expect(slide.locator("[data-method-counter]")).toHaveText("02 / 03");
 await breath.press("ArrowRight");
 await expect(move).toBeFocused();
 await expect(slide).toHaveAttribute("data-method-state","move");
 await move.press("Home");
 await expect(presence).toBeFocused();
 await expect(slide).toHaveAttribute("data-method-state","presence");
 await presence.press("End");
 await expect(move).toBeFocused();
 await expect(slide).toHaveAttribute("data-method-state","move");

 await page.locator('[data-set-lang="en"]').first().click();
 await expect(slide.locator("h2")).toContainText("Every person.");
 await expect(page.locator("#method-panel-move")).toContainText("Many possibilities.");
 await expect(slide.locator(".yoga-method-contact")).toContainText("Bring this approach");
 await page.locator('[data-set-lang="es"]').first().click();
 await expect(slide.locator("h2")).toContainText("Cada persona.");
 await expect(page.locator("#method-panel-move")).toContainText("Muchas posibilidades.");
});

test("Final method slide is mobile-safe and stops moving for reduced motion",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 const slide=page.locator("#metodo");
 await expect(slide).toBeVisible();
 await expect(slide.locator(".yoga-method-art")).toBeVisible();
 await slide.locator('[data-method-tab="breath"]').click();
 await expect(slide.locator("#method-panel-breath")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.emulateMedia({reducedMotion:"reduce"});
 expect(await slide.locator(".yoga-method-ring-one").evaluate(el=>getComputedStyle(el).animationName)).toBe("none");
 expect(await slide.locator(".yoga-method-pulse").evaluate(el=>getComputedStyle(el).animationName)).toBe("none");
});
