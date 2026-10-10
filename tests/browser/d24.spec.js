const {test,expect}=require("@playwright/test");
async function open(page){
 await page.addInitScript(()=>{try{sessionStorage.setItem("gb-yoga-intro-seen","1")}catch(_){}});
 await page.goto("/");
 const guide=page.locator("#flow-guide");
 await expect(guide).toHaveAttribute("data-ready","true",{timeout:12000});
 const explorer=page.locator("#studio-asana-library");
 // V66: the single-asana explorer is genuinely opt-in, never the default.
 await expect(explorer).toBeHidden();
 await page.locator('[data-movement-view="library"]').evaluate(el=>el.click());
 await expect(explorer).toBeVisible();
 return {guide,explorer};
}
test("D24: three distinct authored postures share one anatomically complete dragon",async({page})=>{
 const {guide,explorer}=await open(page);
 await expect(explorer.locator("button[data-library-pose]")).toHaveCount(3);
 await expect(explorer.locator(".yy-pose")).toHaveCount(3);
 await expect(guide.locator(".yy-pose")).toHaveCount(10);
 const torsos=new Set();
 for(const id of ["d24-mountain","d24-downward","d24-butterfly"]){
   await explorer.locator('button[data-library-pose="'+id+'"]').evaluate(el=>el.click());
   const active=explorer.locator(".yy-pose.is-current");
   await expect(active).toHaveAttribute("data-pose",id);
   await expect(active.locator(".yy-paw-group")).toHaveCount(4);
   await expect(active.locator(".yy-d17-attachment")).toHaveCount(4);
   await expect(active.locator(".yy-eye-closed")).toHaveCount(2);
   await expect(active.locator(".yy-d12-unicorn-core")).toHaveCount(1);
   torsos.add(await active.locator(".yy-torso").getAttribute("transform"));
 }
 expect(torsos.size).toBe(3);
 expect(await page.evaluate(()=>{
   const ids=[...document.querySelectorAll("[id]")].map(x=>x.id);
   return ids.length===new Set(ids).size;
 })).toBe(true);
});

test("D24: Yin/Yang and bilingual keyboard exploration, no interference with guided sessions",async({page})=>{
 const {guide,explorer}=await open(page);
 await guide.locator('[data-yy-form="yin"]').evaluate(el=>el.click());
 await expect(explorer.locator(".studio-library-stage")).toHaveAttribute("data-spirit","yin");
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(explorer.locator(".studio-library-heading h3")).toHaveText("Explore asanas");
 const first=explorer.locator("button[data-library-pose]").first();
 await first.focus();
 await page.keyboard.press("ArrowRight");
 await expect(explorer.locator('button[data-library-pose="d24-downward"]')).toHaveAttribute("aria-pressed","true");
 await page.locator('button[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(explorer).toBeHidden();
 await page.locator('button[data-studio-mode="asanas"]').evaluate(el=>el.click());
 await expect(explorer).toBeVisible();
 await page.locator('[data-movement-view="sequence"]').evaluate(el=>el.click());
 await expect(explorer).toBeHidden();
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 await expect(explorer).toBeHidden();
 await page.locator('[data-flow-action="reset"]').evaluate(el=>el.click());
 await expect(explorer).toBeHidden();
 await page.locator('[data-movement-view="library"]').evaluate(el=>el.click());
 await expect(explorer).toBeVisible();
});

test("D24: small screens and reduced motion preserve contact points without overflow",async({page})=>{
 await page.setViewportSize({width:320,height:760});
 await page.emulateMedia({reducedMotion:"reduce"});
 const {explorer}=await open(page);
 await explorer.locator('button[data-library-pose="d24-downward"]').evaluate(el=>el.click());
 const active=explorer.locator(".yy-pose.is-current");
 await expect(active).toHaveCSS("animation-name","none");
 await expect(active).toHaveCSS("transition-duration","0s");
 const contacts=await active.locator(".yy-stance-shadow").count();
 expect(contacts).toBe(4);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
