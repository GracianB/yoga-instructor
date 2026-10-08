const {test,expect}=require("@playwright/test");
test("D28: hiding the page sleeps visual tick and resumes the same live clock",async({page})=>{
 await page.goto("/");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true",{timeout:12000});
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 const guided=page.locator("#studio-guided");
 await expect(guided).toHaveAttribute("data-studio-status","running");
 await page.evaluate(()=>{
   window.yogaSimulatedHidden={value:true};
   Object.defineProperty(document,"hidden",{configurable:true,get(){return window.yogaSimulatedHidden.value;}});
   document.dispatchEvent(new Event("visibilitychange"));
 });
 const before=await guided.locator(".studio-breath-orb").evaluate(el=>el.style.getPropertyValue("--studio-breath-scale"));
 await page.waitForTimeout(500);
 const after=await guided.locator(".studio-breath-orb").evaluate(el=>el.style.getPropertyValue("--studio-breath-scale"));
 expect(after).toBe(before);
 await page.evaluate(()=>{
   window.yogaSimulatedHidden.value=false;
   document.dispatchEvent(new Event("visibilitychange"));
 });
 await expect.poll(()=>guided.locator(".studio-breath-orb").evaluate(el=>el.style.getPropertyValue("--studio-breath-scale")),{
  timeout:4000
 }).not.toBe(before);
 await expect(guided).toHaveAttribute("data-studio-status","running");
});
