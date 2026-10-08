const {test,expect}=require("@playwright/test");
for(const width of [320,390,768,1440]){
 test("D29: breath/meditation dragon remains grounded and usable at "+width+"px",async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height:850});
  await page.goto("/");
  await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true",{timeout:12000});
  await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
  const figure=page.locator(".studio-companion");
  await expect(figure).toBeVisible();
  await expect(figure.locator('.yy-pose.is-current')).toHaveAttribute("data-pose","breath");
  await expect(figure.locator('.yy-pose.is-current .yy-d17-attachment')).toHaveCount(4);
  await expect(figure.locator('.yy-pose.is-current .yy-eye-closed')).toHaveCount(2);
  await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
  await expect(figure.locator('.yy-pose.is-current')).toHaveAttribute("data-pose","centering");
  await expect(page.locator(".studio-meditation-choices")).toBeVisible();
  await page.locator('[data-set-theme="dark"]').evaluate(el=>el.click());
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
  await page.locator('[data-studio-mode="asanas"]').evaluate(el=>el.click());
  await expect(figure).toBeHidden();
  await expect(page.locator("#flow-guide .yy-pose")).toHaveCount(10);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
test("D29: mode and tongue never leave hidden controls active",async({page})=>{
 await page.goto("/");
 await page.locator('[data-set-lang="en"]').evaluate(el=>el.click());
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(page.locator(".studio-breath-patterns")).toHaveAttribute("aria-label","Breathing pace");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(page.locator('[data-studio-mode="meditation"]')).toBeDisabled();
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(page.locator('[data-studio-mode="meditation"]')).toBeDisabled();
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(page.locator(".studio-meditation-choices")).toHaveAttribute("aria-label","Meditation style");
 await expect(page.locator(".studio-breath-patterns")).toBeHidden();
 await page.locator('[data-studio-mode="asanas"]').evaluate(el=>el.click());
 await expect(page.locator(".studio-meditation-choices")).toBeHidden();
});
