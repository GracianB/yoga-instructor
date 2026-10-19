const {test,expect}=require("@playwright/test");

test("P4 · production CSS preserves the public portfolio across source and Pages bundle",async({page})=>{
 test.setTimeout(100000);
 await page.setViewportSize({width:390,height:844});
 await page.goto("/index.html");
 await expect(page.locator("#proyectos")).toBeVisible();
 await expect(page.locator("#instructor-flow")).toBeHidden();
 await expect(page.locator("#studio-asana-library")).toBeHidden();
 const sample=()=>page.evaluate(()=>{
  const selectors=[".site-header","#explora .p2-route","#proyectos .p26-project-grid > a","#experiencia .role"];
  const fields=["display","position","color","backgroundColor","borderRadius","paddingLeft","boxShadow"];
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
  if(u.pathname.startsWith("/dist/")&&u.pathname.endsWith(".css"))localCss.push(u.pathname);
 });
 await page.goto("/dist/");
 await expect(page.locator("#proyectos")).toBeVisible();
 await expect(page.locator("#instructor-flow")).toBeHidden();
 await expect(page.locator("#studio-asana-library")).toBeHidden();
 const sheets=await page.locator('link[rel="stylesheet"][href^="./"]').count();
 expect(sheets).toBe(1);
 expect(localCss.length,localCss.join("\\n")).toBe(1);
 expect(localCss[0]).toMatch(/yoga-styles-v105\\.[0-9a-f]{16}\\.css$/);
 expect(await sample()).toEqual(baseline);
 expect(failed).toEqual([]);
 const cards=page.locator("#proyectos .p26-project-grid a");
 await expect(cards).toHaveCount(3);
 await expect(cards.nth(0)).toHaveAttribute("href","https://vortex-gilt-xi.vercel.app/");
});
