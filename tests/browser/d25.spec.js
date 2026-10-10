const {test,expect}=require("@playwright/test");
async function enableRecovery(root){
 const checkbox=root.locator('[data-d25-option="recovery"]');
 await expect(checkbox).toBeEnabled();
 // A real keyboard interaction, independent of scrolling animations that
 // sometimes displace the small checkbox while Playwright attempts a click.
 await checkbox.focus();
 await checkbox.press("Space");
 await expect(checkbox).toBeChecked();
}

async function open(page){
 await page.addInitScript(()=>{try{sessionStorage.setItem("gb-yoga-intro-seen","1")}catch(_){}});
 await page.goto("/");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true",{timeout:12000});
 return page.locator("#instructor-flow");
}
test("D25: changing time changes the live phase clock without adding or removing poses",async({page})=>{
 const root=await open(page);
 const picker=root.locator('[data-d25-option="length"]');
 const level=root.locator('[data-d25-option="level"]');
 await expect(picker).toBeVisible();
 await expect(level).toHaveValue("steady");
 await picker.selectOption("short");
 await level.selectOption("gentle");
 const expected=await page.evaluate(()=>window.YOGA_SESSION_DESIGN.build(window.YOGA_FLOW.PHASES,{
  length:"short",level:"gentle",recovery:false,pace:document.querySelector("#instructor-flow").dataset.studioPace
 }).durations.start);
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 await expect(page.locator("#flow-phase-target")).toHaveText(
  String(Math.floor(expected/60)).padStart(2,"0")+":"+String(expected%60).padStart(2,"0"));
 await expect(root.locator('[data-d25-option="length"]')).toBeDisabled();
 await expect(root.locator('[data-d25-option="level"]')).toBeDisabled();
 await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
 await expect(root.locator('[data-d25-option="length"]')).toBeEnabled();
 await expect(root.locator("#flow-guide .yy-pose")).toHaveCount(10);
});
test("D25: recovery increases actual resting time and keeps exact total requested",async({page})=>{
 const root=await open(page);
 await root.locator('[data-d25-option="length"]').selectOption("balanced");
 const get=()=>page.evaluate(()=>{
  const root=document.getElementById("instructor-flow");
  return window.YOGA_SESSION_DESIGN.build(window.YOGA_FLOW.PHASES,{
   length:root.dataset.sessionLength,level:root.dataset.sessionLevel,
   recovery:root.dataset.sessionRecovery==="true",pace:root.dataset.studioPace
  });
 });
 const first=await get();
 await enableRecovery(root);
 const updated=await get();
 expect(first.totalSeconds).toBe(1020);
 expect(updated.totalSeconds).toBe(1020);
 expect(updated.durations.savasana).toBeGreaterThan(first.durations.savasana);
 expect(updated.durations.cooldown).toBeGreaterThan(first.durations.cooldown);
 await root.locator('[data-d25-option="level"]').selectOption("gentle");
 await expect(root).toHaveAttribute("data-session-level","gentle");
});
test("D25: options survive reload, disappear in meditation and fit 320px reduced motion",async({page})=>{
 await page.setViewportSize({width:320,height:760});
 await page.emulateMedia({reducedMotion:"reduce"});
 const root=await open(page);
 await root.locator('[data-d25-option="length"]').selectOption("extended");
 await root.locator('[data-d25-option="level"]').selectOption("gentle");
 await enableRecovery(root);
 await page.reload();
 await expect(root.locator('[data-d25-option="length"]')).toHaveValue("extended");
 await expect(root.locator('[data-d25-option="recovery"]')).toBeChecked();
 await root.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(root.locator(".studio-adaptation")).toBeHidden();
 await root.locator('button[data-studio-mode="asanas"]').evaluate(el=>el.click());
 await expect(root.locator(".studio-adaptation")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
