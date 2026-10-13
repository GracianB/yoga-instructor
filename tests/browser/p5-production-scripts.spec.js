const {test,expect}=require("@playwright/test");

test("P5 · the built Pages app loads bounded JS chunks with unchanged globals, controls and no errors",async({page})=>{
 test.setTimeout(105000);
 await page.setViewportSize({width:390,height:844});
 await page.goto("/");
 const apis=()=>page.evaluate(()=>Object.keys(window).filter(k=>k.startsWith("YOGA_")).sort());
 const sourceApis=await apis();
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true");
 expect(sourceApis).toContain("YOGA_MOVEMENT_FLOW_P1");
 expect(sourceApis).toContain("YOGA_PRACTICE_RITUAL_V104");
 expect(sourceApis).toContain("YOGA_ASANA_LIBRARY");
 const errors=[],requested=[];
 page.on("pageerror",error=>errors.push(error.message));
 page.on("request",r=>{
  const url=new URL(r.url());
  if(url.pathname.startsWith("/dist/")&&url.pathname.endsWith(".js"))
   requested.push(url.pathname);
 });
 await page.goto("/dist/");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true");
 const htmlScripts=await page.locator('script[src^="./"][src$=".js"], script[src^="./"][src*=".js?"]').count();
 expect(htmlScripts).toBeLessThan(20);
 expect(htmlScripts).toBeGreaterThan(6);
 expect(requested.length).toBe(htmlScripts);
 expect(new Set(requested).size).toBe(requested.length);
 expect(requested.filter(p=>/yoga-scripts-v106-\d+\.[0-9a-f]{16}\.js$/.test(p)).length)
  .toBe(htmlScripts-3);
 expect(await apis()).toEqual(sourceApis);
 expect(errors).toEqual([]);
 await page.locator('#p1-sequence [data-p1="prepare"]').evaluate(el=>el.click());
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true");
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","running");
 await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(page.locator("#p1-sequence .p1-prepare")).toContainText("Prepare");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(page.locator("#p2-ritual")).toBeVisible();
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(page.locator("#p2-ritual")).toBeVisible();
 const noAutoAudio=await page.evaluate(()=>window.YOGA_AUDIO_BUS?.audio?.paused);
 expect(noAutoAudio).toBe(true);
 expect(errors).toEqual([]);
});
