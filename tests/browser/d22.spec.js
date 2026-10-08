const {test,expect}=require("@playwright/test");
test("D22: complete guided practice shows finale, stores only last mode/date and can return",async({page})=>{
 await page.goto("/");
 await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await page.locator("#studio-guided").evaluate(el=>{el.dataset.studioStatus="finished";});
 await expect(page.locator("#studio-finale")).toBeVisible();
 await expect(page.locator(".studio-finale-title")).toContainText("calma");
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem("yoga-studio-last-completed")));
 expect(record.mode).toBe("meditation");
 expect(Object.keys(record).sort()).toEqual(["at","mode"]);
 await page.locator("[data-studio-finale-return]").evaluate(el=>el.click());
 await expect(page.locator("#studio-finale")).toBeHidden();
 await page.reload();
 await expect(page.locator(".studio-last-practice")).toContainText("Meditación");
});
test("D22: brief asana tour ends respectfully but is not saved as a full practice",async({page})=>{
 await page.goto("/");
 await page.evaluate(()=>{
  window.dispatchEvent(new CustomEvent("yoga:preview",{detail:true}));
  const engine=window.YOGA_FLOW.create();
  engine.goTo("finish");
 });
 await expect(page.locator("#studio-finale")).toBeVisible();
 await expect(page.locator(".studio-finale-detail")).toContainText("explorado");
 expect(await page.evaluate(()=>localStorage.getItem("yoga-studio-last-completed"))).toBeNull();
});
