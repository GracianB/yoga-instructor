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

test("D28: sculpted body channels are connected to clock, freeze, and still under reduced motion",async({page})=>{
 await page.goto("/");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true",{timeout:12000});
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 const panel=page.locator("#studio-guided");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(panel).toHaveAttribute("data-studio-status","running");
 const readChannels=()=>panel.evaluate(el=>({
  rib:el.style.getPropertyValue("--studio-rib-expansion"),
  wing:el.style.getPropertyValue("--studio-d28-wing-vein"),
  meridian:el.style.getPropertyValue("--studio-d28-horn"),
  halo:el.style.getPropertyValue("--studio-d28-halo")
 }));
 const a=await readChannels();
 await page.waitForTimeout(1100);
 const b=await readChannels();
 expect(b.rib).not.toBe(a.rib);
 expect(+b.rib).toBeGreaterThanOrEqual(1);
 expect(+b.rib).toBeLessThanOrEqual(1.018);
 expect(+b.wing).toBeGreaterThanOrEqual(.32);
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(panel).toHaveAttribute("data-studio-status","paused");
 const pause=await readChannels();
 await page.waitForTimeout(600);
 expect(await readChannels()).toEqual(pause);
 await page.emulateMedia({reducedMotion:"reduce"});
 await expect(panel.locator(".studio-companion .yy-d14-rib-cage").first()).toHaveCSS("transform","none");
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await page.locator('[data-breath-pattern="free"]').evaluate(el=>el.click());
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 expect((await readChannels()).rib).toBe("1.0000");
});
