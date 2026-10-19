const {test,expect}=require("@playwright/test");

for(const width of [375,1440]){
 test(`P2 routes and page order at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(()=>{try{sessionStorage.setItem("gb-yoga-intro-seen","1")}catch(_){}});
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect(page.locator('#inicio a.btn.primary[href="#instructor-flow"]')).toBeVisible();
  const order=await page.evaluate(()=>{
   const studio=document.getElementById("instructor-flow");
   const music=document.getElementById("soundtrack");
   return !!(studio&&music&&studio.nextElementSibling===music);
  });
  expect(order).toBe(true);
  const paths=page.locator("#orientacion [data-v80-route]");
  await expect(paths).toHaveCount(3);
  await paths.nth(2).click();
  await expect(paths.nth(2)).toHaveAttribute("aria-pressed","true");
  await expect(page.locator("#v80-primary")).toHaveAttribute("href","#v76-enquiry");
  await page.locator('[data-set-lang="en"]').evaluate(el=>el.click());
  await expect(page.locator("#orientacion h2")).toContainText("Find your");
  await expect(page.locator("#nav a[href='#instructor-flow']")).toContainText("Practice");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}
