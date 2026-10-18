const {test,expect}=require("@playwright/test");

for(const path of ["/anatomy-lab.html","/dist/anatomy-lab.html"]){
 test("anatomy lab responds to slider, body measurements and heatmap: "+path,async({page})=>{
  await page.goto(path);
  await expect(page.getByRole("heading",{name:"Laboratorio anatómico"})).toBeVisible();
  await expect(page.locator("#stage line")).toHaveCount(46);
  await expect(page.locator("#knee-left")).toContainText("°");
  await page.locator("#progress").evaluate(input=>{
   input.value="50";input.dispatchEvent(new Event("input",{bubbles:true}));
  });
  await expect(page.locator("#value")).toHaveText("50%");
  await expect(page.locator("#hip-left")).toContainText("°");
  await page.locator("#error-map").check();
  await expect(page.locator("#findings li")).toHaveCount(3);
  await page.locator("#compare").check();
  // WebKit sometimes reports zero-area SVG <line> elements as hidden. Verify
  // the overlay state and actual computed presentation instead of box visibility.
  await expect(page.locator("#compare")).toBeChecked();
  await expect(page.locator("line.reference").first()).not.toHaveCSS("display","none");
  await expect(page.locator("line.reference").first()).toHaveAttribute("x1",/^[0-9.]+$/);
  // Capture reproducible rendered evidence of the mid-transition and fold.
  // Reports are visual review material, not unapproved snapshot baselines.
  if(path==="/anatomy-lab.html")await test.info().attach("transition-halfway",{
   body:await page.screenshot({animations:"disabled"}),contentType:"image/png"
  });
  await page.getByRole("button",{name:"Uttanasana"}).click();
  await expect(page.locator("#value")).toHaveText("100%");
  if(path==="/anatomy-lab.html")await test.info().attach("uttanasana-fold",{
   body:await page.screenshot({animations:"disabled"}),contentType:"image/png"
  });
  await page.getByRole("button",{name:"Tadasana"}).click();
  await expect(page.locator("#value")).toHaveText("0%");
  await expect(page.locator("#status")).toContainText("Error máximo");
 });
}

test("anatomy controls work with keyboard and without automatic motion",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/anatomy-lab.html");
 await expect(page.locator("#play")).toHaveAttribute("aria-pressed","false");
 await page.locator("#overlay").uncheck();
 await expect(page.locator("#stage circle").last()).toHaveCSS("display","none");
 await page.locator("#progress").focus();
 await page.keyboard.press("ArrowRight");
 await expect(page.locator("#value")).not.toHaveText("0%");
 const tooWide=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
 expect(tooWide).toBe(false);
});
