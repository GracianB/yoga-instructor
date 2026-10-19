const {test,expect}=require("@playwright/test");

test("P2 short homepage presents five real routes and can reveal the legacy archive",async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const main=page.locator("#main");
 await expect(main).toHaveAttribute("data-p2-mode","short");
 const grid=page.locator("#explora .p2-route");
 await expect(grid).toHaveCount(5);
 await expect(page.locator("#explora")).toBeVisible();
 // The route index must remain a compact list, not five mobile slides.
 const routeGrid=await page.locator(".p2-route-grid").boundingBox();
 expect(routeGrid).toBeTruthy();
 expect(routeGrid.height).toBeLessThan(600);
 await expect(page.locator("#orientacion")).toBeHidden();
 await expect(page.locator("#instructor-flow")).toBeVisible();
 await expect(page.locator("#soundtrack")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await testInfo.attach("p2-compact-mobile",{body:await page.screenshot({animations:"disabled",timeout:15000}),contentType:"image/png"});
 const button=page.locator("#p2-toggle");
 await button.click();
 await expect(main).toHaveAttribute("data-p2-mode","full");
 await expect(button).toHaveAttribute("aria-pressed","true");
 await expect(page.locator("#orientacion")).toBeVisible();
 await button.click();
 await expect(main).toHaveAttribute("data-p2-mode","short");
});

test("P2 route links work bilingually; deep links reopen hidden chapters",async({page},testInfo)=>{
 await page.setViewportSize({width:1280,height:800});
 await page.goto("/",{waitUntil:"domcontentloaded"});
 // Desktop P2 must not inherit the previous full-viewport presentation frame.
 const hero=await page.locator("#inicio").boundingBox();
 expect(hero).toBeTruthy();
 expect(hero.height).toBeLessThan(750);
 await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
 await expect(page.locator("#p2-explore-title")).toContainText("Less scrolling");
 await expect(page.locator('#nav a[href="#instructor-flow"]')).toContainText("Studio");
 await expect(page.locator('#explora a[href="#oferta"]')).toContainText("What we can do");
 await page.locator("#explora a[href='#sobre']").click();
 await expect(page).toHaveURL(/#sobre$/);
 await expect(page.locator("#sobre")).toBeVisible();
 await page.goto("/#casos",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#main")).toHaveAttribute("data-p2-mode","full");
 await expect(page.locator("#casos")).toBeVisible();
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#main")).toHaveAttribute("data-p2-mode","short");
 await testInfo.attach("p2-compact-desktop",{body:await page.screenshot({animations:"disabled",timeout:15000}),contentType:"image/png"});
});

test("P2 music follows studio physically and starts silent",async({page})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const order=await page.evaluate(()=>{
  const studio=document.getElementById("instructor-flow"),music=document.getElementById("soundtrack");
  return Boolean(studio.compareDocumentPosition(music)&Node.DOCUMENT_POSITION_FOLLOWING);
 });
 expect(order).toBe(true);
 await expect(page.locator("#focus-audio")).toHaveCount(1);
 expect(await page.locator("#focus-audio").evaluate(el=>el.paused)).toBe(true);
});

test("P2 choosing a destination reveals one chapter without mandatory endless scrolling",async({page})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const root=page.locator("#main");
 await page.locator('[data-p2-route="classes"]').click();
 await expect(root).toHaveAttribute("data-p2-focus","oferta");
 await expect(page.locator("#oferta")).toBeVisible();
 await expect(page.locator("#instructor-flow")).toBeHidden();
 await expect(page.locator("#sobre")).toBeHidden();
 await expect(page.locator("#portfolio")).toBeHidden();
 await page.locator('#nav a[href="#instructor-flow"]').click();
 await expect(root).toHaveAttribute("data-p2-focus","instructor-flow");
 await expect(page.locator("#instructor-flow")).toBeVisible();
 await expect(page.locator("#soundtrack")).toBeVisible();
 await expect(page.locator("#oferta")).toBeHidden();
 await page.locator("#p2-toggle").click();
 await expect(root).toHaveAttribute("data-p2-mode","full");
 await expect(page.locator("#oferta")).toBeVisible();
 await page.locator('#nav a[href="#contacto"]').click();
 await expect(page.locator("#contacto")).toBeVisible();
});
test("P2 direct URL focuses the requested chapter rather than losing it in hidden content",async({page})=>{
 await page.goto("/#experiencia",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#main")).toHaveAttribute("data-p2-focus","experiencia");
 await expect(page.locator("#experiencia")).toBeVisible();
 await expect(page.locator("#sobre")).toBeHidden();
 await page.locator('#explora a[href="#sobre"]').click();
 await expect(page.locator("#main")).toHaveAttribute("data-p2-focus","sobre");
 await expect(page.locator("#sobre")).toBeVisible();
 await page.locator('.hero-scroll-cue').evaluate(el=>el.click());
 await expect(page.locator("#main")).not.toHaveAttribute("data-p2-focus",/./);
});

test("P2 removes the distracting global music dock from the compact homepage",async({page})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await expect(page.locator(".sanctuary-dock")).toHaveCount(1);
 await expect(page.locator(".sanctuary-dock")).toBeHidden();
 await expect(page.locator("#soundtrack")).toBeVisible();
 await page.locator('[data-p2-route="studio"]').click();
 await expect(page.locator(".sanctuary-dock")).toBeHidden();
 await expect(page.locator("#soundtrack")).toBeVisible();
 await expect(page.locator('[data-p2-route="studio"]')).toHaveAttribute("aria-current","location");
 await page.locator('[data-p2-route="about"]').click();
 await expect(page.locator('[data-p2-route="about"]')).toHaveAttribute("aria-current","location");
 await expect(page.locator('[data-p2-route="studio"]')).not.toHaveAttribute("aria-current",/./);
 await page.locator("#p2-toggle").click();
 await expect(page.locator("#main")).toHaveAttribute("data-p2-mode","full");
 await expect(page.locator(".sanctuary-dock")).toBeVisible();
 await expect(page.locator('[data-p2-route="about"]')).not.toHaveAttribute("aria-current",/./);
});

test("P2 portfolio overview remains reachable after focusing a chapter",async({page})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await page.locator('[data-p2-route="classes"]').click();
 await expect(page.locator("#portfolio")).toBeHidden();
 await page.locator('#explora a[href="#portfolio"]').click();
 await expect(page.locator("#main")).not.toHaveAttribute("data-p2-focus",/./);
 await expect(page.locator("#portfolio")).toBeVisible();
 await expect(page).toHaveURL(/#portfolio$/);
});
