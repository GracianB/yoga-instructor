const{test,expect}=require("@playwright/test");
// Legacy integration scenarios deliberately exercise the complete historical
// interface. P2's default short route-first mode is independently tested in
// p2-navigation.spec.js; neither experience is silently skipped.
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{
  try{sessionStorage.setItem("gb-yoga-reading-mode","full")}catch{}
 });
});

test("V78 opens paused, supports chapter seeking and supplies full alternative text",async({page})=>{
 await page.goto("/");const root=page.locator("#demostracion");
 await expect(root.locator("#v78-play")).toHaveAttribute("aria-pressed","false");
 await expect(root.locator("#v78-timer")).toHaveText("00:00 / 01:00");
 await root.locator('[data-v78-jump="20"]').evaluate(b=>b.click());
 await expect(root.locator("#v78-phase-title")).toContainText("explorar");
 await expect(root.locator("#v78-timer")).toContainText("00:20");
 await root.locator("#v78-seek").evaluate(input=>{
   input.value="50";
   input.dispatchEvent(new Event("input",{bubbles:true}));
 });
 await expect(root.locator("#v78-phase-title")).toContainText("integrar");
 await root.locator(".v78-transcript summary").evaluate(b=>b.click());
 await expect(root.locator(".v78-transcript-grid")).toBeVisible();
});
test("V78 translates every chapter and preserves chosen scene",async({page})=>{
 await page.goto("/");const root=page.locator("#demostracion");
 await root.locator('[data-v78-jump="42"]').evaluate(el=>el.click());
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(root.locator("#v78-title")).toContainText("How a class");
 await expect(root.locator("#v78-phase-title")).toContainText("integrate");
 await expect(root.locator("#v78-timer")).toContainText("00:42");
 await expect(root.locator(".v78-note")).toContainText("No audio");
});
test("V78 375px and reduced motion preserve timeline and readable transcript",async({page})=>{
 await page.setViewportSize({width:375,height:812});await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");
 const root=page.locator("#demostracion");await expect(root.locator("#v78-play")).toBeVisible();
 const animation=await root.locator(".v78-outer").evaluate(el=>getComputedStyle(el).animationName);expect(animation).toBe("none");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
