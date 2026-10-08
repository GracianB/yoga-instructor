const {test,expect}=require("@playwright/test");
test("D26: dragon breath and orb follow one clock; pause holds exact frame",async({page})=>{
 await page.goto("/");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true",{timeout:12000});
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 const panel=page.locator("#studio-guided");
 const choices=panel.locator(".studio-breath-patterns");
 await expect(choices).toBeVisible();
 await expect(choices.locator('button[aria-pressed="true"]')).toHaveAttribute("data-breath-pattern","natural");
 await choices.locator('[data-breath-pattern="soft"]').evaluate(el=>el.click());
 await expect(panel).toHaveAttribute("data-breath-pattern","soft");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(panel).toHaveAttribute("data-studio-status","running");
 await expect(choices.locator('[data-breath-pattern="soft"]')).toBeDisabled();
 await expect(panel.locator(".studio-companion .yy-character").first()).toHaveCSS("animation-name","none");
 await page.waitForTimeout(500);
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(panel).toHaveAttribute("data-studio-status","paused");
 const frame=await panel.evaluate(el=>({
  scale:el.querySelector(".studio-breath-orb").style.getPropertyValue("--studio-breath-scale"),
  glow:el.style.getPropertyValue("--studio-breath-glow")
 }));
 await page.waitForTimeout(600);
 const frozen=await panel.evaluate(el=>({
  scale:el.querySelector(".studio-breath-orb").style.getPropertyValue("--studio-breath-scale"),
  glow:el.style.getPropertyValue("--studio-breath-glow")
 }));
 expect(frozen).toEqual(frame);
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await choices.locator('[data-breath-pattern="free"]').evaluate(el=>el.click());
 await expect(panel).toHaveAttribute("data-breath-pattern","free");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(panel).toHaveAttribute("data-breath-phase","free");
 await expect(panel.locator("#studio-guided-title")).toContainText("Respira a tu ritmo");
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
});
test("D26: controls translate, hide outside breathing, remain accessible at 320px",async({page})=>{
 await page.setViewportSize({width:320,height:760});
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 const controls=page.locator(".studio-breath-patterns");
 await expect(controls).toBeVisible();
 await page.locator('[data-set-lang="en"]').evaluate(el=>el.click());
 await expect(controls.locator('[data-breath-pattern="free"]')).toHaveText("Free");
 await expect(controls.locator('[data-breath-pattern="natural"]')).toHaveText("Natural · 4/6");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(page.locator(".studio-companion .yy-character").first()).toHaveCSS("animation-name","none");
 await expect(page.locator(".studio-breath-orb")).toHaveCSS("transition-duration","0s");
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(controls).toBeHidden();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
