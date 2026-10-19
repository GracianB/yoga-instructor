const {test,expect}=require("@playwright/test");
async function open(page){
 await page.addInitScript(()=>{try{sessionStorage.setItem("gb-yoga-intro-seen","1")}catch(_){}});
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true",{timeout:12000});
}
for(const width of [320,375,1440]){
 test(`P2 clean home and one main Movement experience at ${width}px`,async({page})=>{
  test.setTimeout(60000);
  await page.setViewportSize({width,height:850});
  await open(page);
  await expect(page.locator('#inicio a.btn.primary[href="#instructor-flow"]')).toBeVisible();
  await expect(page.locator("#p2-lotus-focus")).toBeVisible();
  await expect(page.locator("#p2-asana-toggle")).toBeVisible();
  await expect(page.locator("#p2-asana-toggle")).toHaveAttribute("aria-expanded","false");
  await expect(page.locator("#studio-asana-library .studio-library-stage")).toBeHidden();
  await expect(page.locator("#flow-guide")).toBeVisible();
  const correctOrder=await page.evaluate(()=>{
   const h=document.getElementById("inicio"),s=document.getElementById("instructor-flow");
   const book=document.getElementById("studio-asana-library");
   const soundtrack=document.getElementById("soundtrack");
   const details=document.getElementById("p2-audio");
   return h.nextElementSibling===s && s.contains(book) &&
      details.contains(soundtrack) && s.nextElementSibling===details;
  });
  expect(correctOrder).toBe(true);
  await page.locator("#p2-asana-toggle").evaluate(el=>el.click());
  await expect(page.locator("#studio-asana-library .studio-library-stage")).toBeVisible();
  await expect(page.locator("#movement-stage")).toBeHidden();
  await page.locator("#p2-asana-toggle").evaluate(el=>el.click());
  await expect(page.locator("#flow-guide")).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}

test("P2 lotus focus opens breathing without extra app or audio",async({page})=>{
 await open(page);
 const lotus=page.locator("#p2-lotus-focus");
 await lotus.focus();
 await expect(lotus).toBeFocused();
 await page.keyboard.press("Enter");
 await expect(page.locator("#instructor-flow")).toHaveAttribute("data-studio-mode","breath");
 await expect(page.locator("#studio-guided")).toBeVisible();
 await expect(page.locator("#p2-audio")).not.toHaveAttribute("open",/./);
 await expect(page.locator("#focus-audio")).toHaveJSProperty("paused",true);
});

test("P2 extra portfolio journeys remain accessible and bilingual",async({page})=>{
 await open(page);
 const extras=page.locator("#p2-extras");
 await expect(extras).not.toHaveAttribute("open",/./);
 await extras.locator("summary").click();
 await expect(extras).toHaveAttribute("open","");
 const routes=page.locator("#orientacion [data-v80-route]");
 await expect(routes).toHaveCount(3);
 await routes.nth(2).evaluate(el=>el.click());
 await expect(page.locator("#v80-primary")).toHaveAttribute("href","#v76-enquiry");
 await page.locator('[data-set-lang="en"]').evaluate(el=>el.click());
 await expect(page.locator("#orientacion h2")).toContainText("Find your");
 await expect(page.locator("#nav a[href='#instructor-flow']")).toContainText("Practice");
 await expect(page.locator("#p2-asana-toggle")).toContainText("12 asanas");
});
