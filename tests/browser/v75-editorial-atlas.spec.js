const {test,expect}=require("@playwright/test");
// Legacy integration scenarios deliberately exercise the complete historical
// interface. P2's default short route-first mode is independently tested in
// p2-navigation.spec.js; neither experience is silently skipped.
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{
  try{sessionStorage.setItem("gb-yoga-reading-mode","full")}catch{}
 });
});


test("V75: five visual chapter links navigate to the correct sections",async({page})=>{
 await page.goto("/");
 const atlas=page.locator("#atlas"),nav=page.locator("#v75-atlas-nav");
 await expect(atlas).toBeVisible();
 await expect(nav.locator("a")).toHaveCount(5);
 await expect(atlas.locator(".v75-art-petals")).toHaveCount(1);
 const hrefs=await nav.locator("a").evaluateAll(nodes=>nodes.map(x=>x.getAttribute("href")));
 expect(hrefs).toEqual(["#portfolio","#casos","#instructor-flow","#experiencia","#contacto"]);
 await nav.locator('a[href="#casos"]').click();
 await expect(nav.locator('a[href="#casos"]')).toHaveAttribute("aria-current","location");
 await expect(atlas.locator("#v75-current")).toHaveText("02");
 await expect(page).toHaveURL(/#casos$/);
});

test("V75: light and dark editorial identities remain readable at multiple widths",async({page})=>{
 await page.goto("/");
 for(const width of [320,375,768,1280]){
  await page.setViewportSize({width,height:900});
  for(const theme of ["dark","light"]){
   await page.locator('[data-set-theme="'+theme+'"]').first().evaluate(el=>el.click());
   await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
   await expect(page.locator("#atlas h2")).toBeVisible();
   await expect(page.locator("#casos .v74-case")).toHaveCount(3);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
 }
});

test("V75: English chapter labels and keyboard focus work; reduced motion disables petal animation",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 const atlas=page.locator("#atlas");
 await expect(atlas.locator("h2")).toContainText("From intention");
 await expect(atlas.locator("#v75-atlas-nav")).toHaveAttribute("aria-label","Yoga portfolio chapter map");
 await expect(atlas.locator('a[href="#experiencia"]')).toContainText("Background");
 const name=await atlas.locator(".v75-art-petals").evaluate(el=>getComputedStyle(el).animationName);
 expect(name).toBe("none");
 await atlas.locator('a[href="#contacto"]').focus();
 await page.keyboard.press("Enter");
 await expect(page).toHaveURL(/#contacto$/);
});
