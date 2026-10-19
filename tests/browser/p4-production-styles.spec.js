const {test,expect}=require("@playwright/test");

test("P4 · bundled Pages CSS retains source cascade and interactive studio across engines",async({page})=>{
 test.setTimeout(100000);
 await page.setViewportSize({width:390,height:844});
 await page.goto("/");
 await page.locator('#p2-extras > summary').evaluate(x=>x.click());
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true");
 await expect(page.locator("#p1-sequence")).toBeVisible();
 const sample=()=>page.evaluate(()=>{
  const selectors=[".site-header","#flow-guide .yy-stage",
   "#studio-asana-library .p1-sequence","#studio-guided"];
  const fields=["display","position","color","backgroundColor",
   "borderRadius","paddingLeft","boxShadow"];
  return selectors.map(selector=>{
   const el=document.querySelector(selector);
   if(!el)throw Error("P4 source element missing: "+selector);
   const s=getComputedStyle(el);
   return fields.map(name=>s[name]);
  });
 });
 const baseline=await sample();
 const failed=[],localCss=[];
 page.on("pageerror",error=>failed.push(error.message));
 page.on("request",request=>{
  const u=new URL(request.url());
  if(u.pathname.startsWith("/dist/")&&u.pathname.endsWith(".css"))
   localCss.push(u.pathname);
 });
 await page.goto("/dist/");
 await page.locator('#p2-extras > summary').evaluate(x=>x.click());
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true");
 await expect(page.locator("#p1-sequence")).toBeVisible();
 const sheets=await page.locator('link[rel="stylesheet"][href^="./"]').count();
 expect(sheets).toBe(1);
 expect(localCss.length,localCss.join("\n")).toBe(1);
 expect(localCss[0]).toMatch(/yoga-styles-v105\.[0-9a-f]{16}\.css$/);
 expect(await sample()).toEqual(baseline);
 expect(failed).toEqual([]);
 // Functional smoke on the actual build, not merely syntactic CSS checks.
 await page.locator('#p1-sequence [data-p1="prepare"]').evaluate(el=>el.click());
 await expect(page.locator("#instructor-flow")).toHaveAttribute("data-movement-sequence","guided");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true");
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","running");
 await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(page.locator("#p2-ritual")).toBeVisible();
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(page.locator("#p2-ritual")).toBeVisible();
 expect(failed).toEqual([]);
});
