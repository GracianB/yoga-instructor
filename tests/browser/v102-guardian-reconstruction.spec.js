const{test,expect}=require("@playwright/test");

test("V102 · Nila has two visible forearms, sealed axillae and one pelvis on all ten poses",async({page})=>{
 test.setTimeout(90000);
 await page.goto("/");
 const guide=page.locator("#flow-guide");
 await expect(guide).toHaveAttribute("data-ready","true");
 const poses=guide.locator(".yy-pose .movement-guardian");
 await expect(poses).toHaveCount(10);
 for(let i=0;i<10;i++){
  const pose=poses.nth(i);
  await expect(pose.locator(".mg-v102-pelvis")).toHaveCount(1);
  await expect(pose.locator(".mg-v102-underarm")).toHaveCount(2);
  await expect(pose.locator(".mg-v102-forearm")).toHaveCount(2);
  await expect(pose.locator(".mg-paw.mg-hand")).toHaveCount(2);
  await expect(pose.locator(".mg-paw.mg-foot")).toHaveCount(2);
  const allPaths=await pose.locator(".mg-v102-pelvis,.mg-v102-underarm,.mg-v102-forearm").evaluateAll(nodes=>nodes.map(node=>node.getAttribute("d")));
  expect(allPaths.every(path=>path?.startsWith("M")&&!/NaN|undefined|Infinity/.test(path))).toBe(true);
 }
 // The same generator renders twelve additional standalone asanas.
 await expect(page.locator("#studio-asana-library .movement-guardian")).toHaveCount(12);
 await expect(page.locator("#studio-asana-library .mg-v102-forearm")).toHaveCount(24);
});

test("V102 · Dragon chest and belly visibly inflate, then freeze on pause",async({page})=>{
 test.setTimeout(30000);
 await page.goto("/");
 await page.locator('button.studio-mode[data-studio-mode="breath"]').evaluate(el=>el.click());
 const studio=page.locator("#studio-guided"),chest=studio.locator(".sd31-breath-core");
 await expect(studio.locator(".studio-breath-dragon")).toBeVisible();
 await expect(studio.locator(".sd31-v102-belly")).toHaveCount(1);
 await expect(studio.locator(".sd31-v102-exhale-mist")).toHaveCount(1);
 await studio.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(studio).toHaveAttribute("data-studio-status","running");
 await expect.poll(()=>studio.evaluate(el=>Number(el.style.getPropertyValue("--v102-chest-x"))),{timeout:8000}).toBeGreaterThan(1.07);
 await expect.poll(()=>studio.evaluate(el=>Number(el.style.getPropertyValue("--v102-belly-x"))),{timeout:8000}).toBeGreaterThan(1.06);
 await expect(chest).toHaveCSS("transform",/matrix\(/);
 await studio.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(studio).toHaveAttribute("data-studio-status","paused");
 const frozen=await studio.evaluate(el=>el.style.getPropertyValue("--v102-chest-x"));
 await page.waitForTimeout(480);
 expect(await studio.evaluate(el=>el.style.getPropertyValue("--v102-chest-x"))).toBe(frozen);
 await page.emulateMedia({reducedMotion:"reduce"});
 await expect(chest).toHaveCSS("transform","none");
});

test("V102 · Uma's sleepy firefly and lotus respond to the original Meditation clock",async({page})=>{
 test.setTimeout(30000);
 await page.goto("/");
 await page.locator('button.studio-mode[data-studio-mode="meditation"]').evaluate(el=>el.click());
 const studio=page.locator("#studio-guided"),guardian=studio.locator(".meditation-guardian");
 await expect(guardian).toBeVisible();
 for(const cls of [".uma-v102-pelvis",".uma-v102-firefly",".uma-v102-orbit-star",".uma-v102-lotus"])await expect(guardian.locator(cls)).toHaveCount(1);
 await expect(guardian.locator(".uma-v102-axilla")).toHaveCount(2);
 await studio.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(studio).toHaveAttribute("data-studio-status","running");
 await expect.poll(()=>studio.evaluate(el=>el.style.getPropertyValue("--v102-firefly-y")),{timeout:7000}).not.toBe("0.00px");
 await studio.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(studio).toHaveAttribute("data-studio-status","paused");
 const frozen=await studio.evaluate(el=>el.style.getPropertyValue("--v102-firefly-y"));
 await page.waitForTimeout(430);
 expect(await studio.evaluate(el=>el.style.getPropertyValue("--v102-firefly-y"))).toBe(frozen);
});

test("V102 · all guardians fit 320/390 px, dark mode and quiet/reduced settings",async({page})=>{
 test.setTimeout(90000);
 for(const width of [320,390]){
  await page.setViewportSize({width,height:840});
  await page.goto("/");
  await page.locator('[data-set-theme="dark"]').first().evaluate(el=>el.click());
  for(const mode of ["breath","meditation","asanas"]){
   await page.locator('button.studio-mode[data-studio-mode="'+mode+'"]').evaluate(el=>el.click());
   if(mode==="breath")await expect(page.locator(".studio-breath-dragon")).toBeVisible();
   if(mode==="meditation")await expect(page.locator(".meditation-guardian")).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  }
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.locator('button.studio-mode[data-studio-mode="meditation"]').evaluate(el=>el.click());
  await expect(page.locator(".uma-v102-firefly")).toHaveCSS("transition-duration","0s");
  await page.emulateMedia({reducedMotion:"no-preference"});
 }
});
