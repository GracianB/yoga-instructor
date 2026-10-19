const {test,expect}=require("@playwright/test");
// Legacy integration scenarios deliberately exercise the complete historical
// interface. P2's default short route-first mode is independently tested in
// p2-navigation.spec.js; neither experience is silently skipped.
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{
  try{sessionStorage.setItem("gb-yoga-reading-mode","full")}catch{}
 });
});

test("V74: casebook has three evidence cards and a transparent example plan",async({page})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const root=page.locator("#casos");
 await expect(root).toBeVisible();
 await expect(root.locator(".v74-case")).toHaveCount(3);
 await expect(root.locator(".v74-facts > div")).toHaveCount(12);
 await expect(root.locator(".v74-case-illustration svg")).toHaveCount(3);
 await expect(root.locator(".v74-trust")).toContainText("sin cifras inventadas");
 await expect(root.locator("#v74-steps li")).toHaveCount(4);
});
test("V74: minute allocations sum perfectly for each setting and length",async({page})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const root=page.locator("#casos");
 for(const setting of ["sala","individual","equipos"]){
  await root.locator("#v74-setting").selectOption(setting);
  for(const mins of ["15","30","45","60"]){
   await root.locator("#v74-duration").selectOption(mins);
   const parts=await root.locator("#v74-steps li > small").allTextContents();
   expect(parts.reduce((s,x)=>s+parseInt(x,10),0)).toBe(Number(mins));
   await expect(root.locator("#v74-total")).toContainText(mins);
  }
 }
 await expect(root.locator("#v74-contact")).toHaveAttribute("href",/subject=/);
 await expect(root.locator('a[data-v74-text="trySequence"]')).toHaveAttribute("href","#studio-asana-library");
});
test("V74: links from each case open the matching example session",async({page})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 for(const [study,selected] of [["sala","sala"],["personal","individual"],["corporate","equipos"]]){
  const link=page.locator(".v74-case--"+study+" [data-v74-choose]");
  await expect(link).toHaveAttribute("href","#programa");
  await link.click();
  await expect(page.locator("#v74-setting")).toHaveValue(selected);
  await expect(page).toHaveURL(/#programa$/);
 }
});
test("V74: English translation and small-screen sizing",async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 const root=page.locator("#casos");
 await expect(root.locator("#v74-title")).toContainText("teaching poses");
 await expect(root.locator(".v74-trust")).toContainText("without invented numbers");
 await root.locator("#v74-setting").selectOption("individual");
 await root.locator("#v74-duration").selectOption("45");
 await expect(root.locator("#v74-adaptation")).toContainText("listen");
 await expect(root.locator("#v74-contact")).toHaveAttribute("href",/subject=Enquiry/);
 await expect(root.locator('a[data-v74-text="trySequence"]')).toContainText("Build a sequence");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
