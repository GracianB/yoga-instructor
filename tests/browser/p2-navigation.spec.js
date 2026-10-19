const {test,expect}=require("@playwright/test");

test("P2.6 professional landing offers three concise destinations, without yoga apps",async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 const root=page.locator("#main");
 await expect(root).toHaveAttribute("data-p2-mode","short");
 await expect(page.locator("#explora .p2-route")).toHaveCount(3);
 await expect(page.locator("#proyectos")).toBeVisible();
 await expect(page.locator("#experiencia")).toBeVisible();
 await expect(page.locator("#instructor-flow")).toBeHidden();
 await expect(page.locator("#studio-asana-library")).toBeHidden();
 await expect(page.locator("#campo")).toBeHidden();
 await expect(page.locator(".sanctuary-dock")).toBeHidden();
 await expect(page.locator("#soundtrack")).toBeHidden();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await testInfo.attach("p26-portfolio-mobile",{body:await page.screenshot({animations:"disabled",timeout:15000}),contentType:"image/png"});
});

test("P2.6 verified Vortex, Ohana and Aigoritmo showcase links",async({page})=>{
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 const cards=page.locator("#proyectos .p26-project-grid a");
 await expect(cards).toHaveCount(3);
 const urls=await cards.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("href")));
 expect(urls).toEqual([
  "https://vortex-gilt-xi.vercel.app/",
  "https://gracianb.github.io/project-ohana/",
  "https://aigoritmo.vercel.app/"
 ]);
 for(const card of await cards.all()){
  await expect(card).toHaveAttribute("target","_blank");
  await expect(card).toHaveAttribute("rel",/noreferrer/);
 }
});

test("P2.6 keyboard navigation and ES/EN remain functional",async({page},testInfo)=>{
 await page.setViewportSize({width:1280,height:800});
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 await page.locator('[data-set-lang="en"]').first().click();
 await expect(page.locator("#p26-projects-title")).toContainText("Explore the work");
 await expect(page.locator('#nav a[href="#proyectos"]')).toContainText("Projects");
 await expect(page.locator("#p2-explore-title")).toContainText("Choose your path");
 const hero=await page.locator("#inicio").boundingBox();
 expect(hero).toBeTruthy();
 expect(hero.height).toBeLessThan(750);
 await testInfo.attach("p26-portfolio-desktop",{body:await page.screenshot({animations:"disabled",timeout:15000}),contentType:"image/png"});
});

test("P2.6 section navigation focuses visible content without revealing retired essays",async({page})=>{
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 const root=page.locator("#main");
 await page.locator('[data-p2-route="experience"]').click();
 await expect(root).toHaveAttribute("data-p2-focus","experiencia");
 await expect(page.locator("#experiencia")).toBeVisible();
 await expect(page.locator("#proyectos")).toBeHidden();
 await expect(page.locator("#portfolio")).toBeHidden();
 await page.locator('#nav a[href="#proyectos"]').click();
 await expect(root).toHaveAttribute("data-p2-focus","proyectos");
 await expect(page.locator("#proyectos")).toBeVisible();
 // The public portfolio no longer offers the old full archive.
 await expect(page.locator("#p2-toggle")).toBeHidden();
 await expect(page.locator("#instructor-flow")).toBeHidden();
 await expect(page.locator("#portfolio")).toBeHidden();
 await expect(page.locator("#campo")).toBeHidden();
 await expect(page.locator("#orientacion")).toBeHidden();
 await expect(page.locator("#formacion")).toBeHidden();
});

test("P2.6 deep links open published chapters and legacy studio remains hidden",async({page})=>{
 await page.goto("/index.html#experiencia",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#main")).toHaveAttribute("data-p2-focus","experiencia");
 await expect(page.locator("#experiencia")).toBeVisible();
 await page.goto("/index.html#instructor-flow",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#instructor-flow")).toBeHidden();
 await expect(page.locator("#studio-asana-library")).toBeHidden();
});

test("P2.6 portfolio never autoplays music",async({page})=>{
 await page.goto("/index.html",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#focus-audio")).toHaveCount(1);
 expect(await page.locator("#focus-audio").evaluate(el=>el.paused)).toBe(true);
 await expect(page.locator("#soundtrack")).toBeHidden();
});
