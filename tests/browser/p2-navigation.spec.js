const {test,expect}=require("@playwright/test");

test("P2 short homepage presents five real routes and can reveal the legacy archive",async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const main=page.locator("#main");
 await expect(main).toHaveAttribute("data-p2-mode","short");
 const grid=page.locator("#explora .p2-route");
 await expect(grid).toHaveCount(5);
 await expect(page.locator("#explora")).toBeVisible();
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
