const {test,expect}=require("@playwright/test");
test("P1 · choosing three library poses prepares, but never autostarts, the SAME Flow",async({page})=>{
 test.setTimeout(90000);
 await page.goto("/#p1-sequence");
 const plan=page.locator("#p1-sequence"),flow=page.locator("#flow-guide");
 await expect(plan).toBeVisible();
 await expect(page.locator("#studio-asana-library .movement-guardian")).toHaveCount(12);
 await expect(page.locator("#flow-guide .yy-pose")).toHaveCount(10);
 await plan.locator('[data-p1="prepare"]').evaluate(el=>el.click());
 await expect(page.locator("#instructor-flow")).toHaveAttribute("data-movement-sequence","guided");
 await expect(flow).toHaveAttribute("data-phase","seq-arrival");
 await expect(flow).toHaveAttribute("data-ready","true");
 await expect(flow.locator('.yy-pose[data-pose="seq-asana-0"] .movement-guardian')).toHaveCount(1);
 await expect(flow.locator('.yy-pose[data-pose="seq-asana-1"] .movement-guardian')).toHaveCount(1);
 await expect(flow.locator('.yy-pose[data-pose="seq-asana-2"] .movement-guardian')).toHaveCount(1);
 await expect(page.locator("#flow-session-time")).toContainText("00:00");
 await expect(flow).toHaveAttribute("data-status","idle");
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 await expect(flow).toHaveAttribute("data-status","running");
 await expect(flow).toHaveAttribute("data-ready","true");
 await page.locator('[data-flow-action="next"]').evaluate(el=>el.click());
 await expect(flow).toHaveAttribute("data-phase","seq-warmup");
 await expect(flow).toHaveAttribute("data-ready","true");
 await page.locator('[data-flow-action="pause"]').evaluate(el=>el.click());
 await expect(flow).toHaveAttribute("data-status","paused");
 const paused=await page.locator("#flow-phase-time").textContent();
 await page.waitForTimeout(700);
 expect(await page.locator("#flow-phase-time").textContent()).toBe(paused);
 await page.locator('[data-flow-action="pause"]').evaluate(el=>el.click());
 await expect(flow).toHaveAttribute("data-status","running");
 await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
 await expect(flow).toHaveAttribute("data-status","idle");
 await plan.locator('[data-p1="classic"]').evaluate(el=>el.click());
 await expect(flow).toHaveAttribute("data-phase","start");
 await expect(page.locator("#instructor-flow")).toHaveAttribute("data-movement-sequence","classic");
 await expect(flow.locator('.yy-pose[data-p1-sequence="true"]')).toHaveCount(0);
 await expect(flow.locator(".yy-pose")).toHaveCount(10);
});
test("P1 · 8 distinct asanas become 20 phases, art exists, exact labels survive EN",async({page})=>{
 test.setTimeout(75000);
 await page.goto("/#p1-sequence");
 const panel=page.locator("#p1-sequence"),flow=page.locator("#flow-guide");
 for(let i=3;i<8;i++)await panel.locator('[data-p1="add"]').evaluate(el=>el.click());
 await expect(panel.locator(".p1-row")).toHaveCount(8);
 await panel.locator(".p1-duration").selectOption("30");
 await expect(panel.locator(".p1-summary")).toContainText("8 asanas");
 await panel.locator('[data-p1="prepare"]').evaluate(el=>el.click());
 await expect(flow).toHaveAttribute("data-ready","true");
 await expect(page.locator("#instructor-flow")).toHaveAttribute("data-movement-sequence-count","8");
 await expect(flow.locator('.yy-pose[data-p1-sequence="true"]')).toHaveCount(20);
 await expect(flow.locator('.yy-pose[data-pose^="seq-asana-"] .movement-guardian')).toHaveCount(8);
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(panel.locator(".p1-prepare")).toContainText("Prepare");
 await expect(flow.locator(".yy-count")).toContainText("/ 20");
 await expect(flow).toHaveAttribute("data-status","idle");
 const phases=await page.evaluate(()=>window.YOGA_MOVEMENT_FLOW_P1.build({
  poses:window.YOGA_ASANA_LIBRARY.poses.slice(0,8).map(x=>x.id),minutes:30}).phases);
 expect(phases.reduce((sum,p)=>sum+p.durationSeconds,0)).toBe(1800);
 expect(phases.filter(x=>x.kind==="asana")).toHaveLength(8);
});
test("P1 · impossible extra-rest combination fails safely without changing Flow",async({page})=>{
 await page.goto("/#p1-sequence");
 const panel=page.locator("#p1-sequence"),flow=page.locator("#flow-guide");
 for(let i=3;i<8;i++)await panel.locator('[data-p1="add"]').evaluate(el=>el.click());
 await panel.locator(".p1-duration").selectOption("10");
 await panel.locator(".p1-rest").check();
 await panel.locator('[data-p1="prepare"]').evaluate(el=>el.click());
 await expect(panel.locator(".p1-status")).toContainText(/revisa|choose/i);
 await expect(flow).toHaveAttribute("data-phase","start");
 await expect(flow).toHaveAttribute("data-status","idle");
 await panel.locator(".p1-duration").selectOption("15");
 await panel.locator('[data-p1="prepare"]').evaluate(el=>el.click());
 await expect(flow).toHaveAttribute("data-phase","seq-arrival");
 await expect(flow).toHaveAttribute("data-status","idle");
});
test("P1 · 320px, keyboard and dark mode preserve responsive planner and idle safety",async({page})=>{
 await page.setViewportSize({width:320,height:780});
 await page.goto("/#p1-sequence");
 await page.locator('[data-set-theme="dark"]').first().evaluate(el=>el.click());
 const panel=page.locator("#p1-sequence");
 await expect(panel).toBeVisible();
 await panel.locator('[data-p1="add"]').evaluate(el=>el.click());
 await expect(panel.locator(".p1-row")).toHaveCount(4);
 // Safari can report intrinsic scrollWidth from hidden option content even
 // when all visible controls remain inside their panel. Assert the actual
 // on-screen geometry, hit targets and the viewport, not that phantom width.
 const bounds=await panel.evaluate(el=>{
   const outer=el.getBoundingClientRect();
   const elements=[...el.querySelectorAll("button,select,input,output,label,.p1-row,.p1-options,.p1-actions,.p1-heading,.p1-summary")]
    .filter(n=>getComputedStyle(n).display!=="none"&&getComputedStyle(n).visibility!=="hidden");
   const invalid=elements.filter(n=>{
    const r=n.getBoundingClientRect();
    return r.left<outer.left-1||r.right>outer.right+1||r.width<0;
   }).map(n=>({tag:n.tagName,cls:n.className,left:n.getBoundingClientRect().left,right:n.getBoundingClientRect().right}));
   const clickTargets=elements.filter(n=>n.matches("button,select,input"));
   return {invalid,targets:clickTargets.length,bodyOverflow:document.documentElement.scrollWidth-innerWidth,
    internalScroll:el.scrollWidth-el.clientWidth};
 });
 expect(bounds.invalid,JSON.stringify(bounds)).toEqual([]);
 expect(bounds.targets).toBeGreaterThan(5);
 expect(bounds.bodyOverflow,JSON.stringify(bounds)).toBeLessThanOrEqual(1);
 await panel.locator(".p1-row").first().locator("select").focus();
 await expect(panel.locator(".p1-row").first().locator("select")).toBeFocused();
 await panel.locator('[data-p1="prepare"]').evaluate(el=>el.click());
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true");
});
