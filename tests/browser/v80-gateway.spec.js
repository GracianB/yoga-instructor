const{test,expect}=require("@playwright/test");
// Legacy integration scenarios deliberately exercise the complete historical
// interface. P2's default short route-first mode is independently tested in
// p2-navigation.spec.js; neither experience is silently skipped.
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{
  try{sessionStorage.setItem("gb-yoga-reading-mode","full")}catch{}
 });
});

test("V80 directs practice visitors through real demo, studio and FAQ links",async({page})=>{
 await page.goto("/");const root=page.locator("#orientacion");
 await expect(root.locator('[data-v80-route="practice"]')).toHaveAttribute("aria-pressed","true");
 await expect(root.locator("#v80-route-steps a")).toHaveCount(3);
 for(const id of ["demostracion","instructor-flow","preguntas"])await expect(root.locator('#v80-route-steps a[href="#'+id+'"]')).toHaveCount(1);
 await expect(root.locator("#v80-primary")).toHaveAttribute("href","#demostracion");
});
test("V80 professional visitor finds evidence and contextual CV",async({page})=>{
 await page.goto("/");const root=page.locator("#orientacion");
 await root.locator('[data-v80-route="studio"]').evaluate(x=>x.click());
 await expect(root.locator("#v80-primary")).toHaveAttribute("href","#trayectoria");
 for(const id of ["trayectoria","casos","cv"])await expect(root.locator('#v80-route-steps a[href="#'+id+'"]')).toHaveCount(1);
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(root.locator("#v80-route-title")).toContainText("Meet the work");
 await expect(root.locator('[data-v80-route="studio"]')).toHaveAttribute("aria-pressed","true");
});
test("V80 workplace journey preselects the live enquiry without sending data",async({page})=>{
 await page.goto("/");const root=page.locator("#orientacion");
 await root.locator('[data-v80-route="teams"]').evaluate(el=>el.click());
 await expect(root.locator("#v80-primary")).toHaveAttribute("href","#v76-enquiry");
 await root.locator("#v80-primary").evaluate(el=>el.click());
 await expect(page.locator('#v76-enquiry input[name="v76-service"][value="equipos"]')).toBeChecked();
 await expect(page.locator("#v76-results")).toBeHidden();
});
test("V80 375px visitor navigation and reduced motion remain accessible",async({page})=>{
 await page.setViewportSize({width:375,height:812});await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");const root=page.locator("#orientacion");
 await expect(root.locator("#v80-title")).toBeVisible();
 await expect(root.locator('[data-v80-route="practice"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 const transition=await root.locator(".v80-options button").first().evaluate(x=>getComputedStyle(x).transitionDuration);
 expect(transition).toBe("0s");
});
