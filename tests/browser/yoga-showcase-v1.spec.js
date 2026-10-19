const {test,expect}=require("@playwright/test");

test("Yoga public portfolio offers four teaching formats and a working client-side enquiry",async({page})=>{
 await page.setViewportSize({width:1280,height:820});
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#yoga-lotus-field")).toBeVisible();
 await expect(page.locator("#explora .p2-route")).toHaveCount(4);
 await expect(page.locator("#proyectos .yoga-offer-card")).toHaveCount(4);
 await expect(page.locator("#proyectos .yoga-future")).not.toHaveAttribute("open","");
 await page.locator('#proyectos [data-yoga-service="online"]').click();
 await expect(page.locator("#contacto")).toBeVisible();
 await expect(page.locator("#v76-enquiry")).toBeVisible();
 await expect(page.locator('#v76-form [value="online"][name="v76-service"]')).toBeChecked();
 await expect(page.locator("#v76-format")).toHaveValue("online");
 await page.locator("#v76-details").fill("Primera consulta: horarios de sesiones online.");
 await page.locator("#v76-compose").click();
 await expect(page.locator("#v76-results")).toBeVisible();
 const href=await page.locator("#v76-mail").getAttribute("href");
 expect(href).toMatch(/^mailto:/);
 expect(decodeURIComponent(href)).toContain("Primera consulta");
 await page.locator('[data-set-lang="en"]').first().click();
 await expect(page.locator("#v76-title")).toContainText("Tell me");
 await expect(page.locator('#v76-form [value="online"][name="v76-service"]')).toBeChecked();
});

test("Yoga remains readable on mobile and static when reduced motion is requested",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#inicio .hero-mandala")).toBeVisible();
 await expect(page.locator("#explora .p2-route")).toHaveCount(4);
 await expect(page.locator("#proyectos .yoga-offer-card")).toHaveCount(4);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
 await page.locator('#proyectos [data-yoga-service="equipos"]').click();
 await expect(page.locator('#v76-form [value="equipos"][name="v76-service"]')).toBeChecked();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
});
