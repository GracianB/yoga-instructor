const {test,expect}=require("@playwright/test");
async function enter(page){
 await page.addInitScript(()=>{try{sessionStorage.setItem("gb-yoga-intro-seen","1")}catch(_){}});
 await page.goto("/");
 const root=page.locator("#flow-guide");
 await expect(root).toHaveAttribute("data-ready","true",{timeout:12000});
 await page.locator('[data-flow-action="start"]').evaluate(el=>el.click());
 return root;
}
async function next(page,root,phase){
 await expect(root).toHaveAttribute("data-ready","true",{timeout:8000});
 await page.locator('[data-flow-action="next"]').evaluate(el=>el.click());
 await expect(root).toHaveAttribute("data-phase",phase);
}
test("D23: crossfade only pigment while the arriving paws remain planted at 320px",async({page})=>{
 await page.setViewportSize({width:320,height:760});
 const root=await enter(page);
 await next(page,root,"centering");
 const pose=root.locator('.yy-pose[data-pose="centering"]');
 const measure=()=>pose.evaluate(el=>({
  transform:getComputedStyle(el).transform,
  paws:[...el.querySelectorAll(".yy-paw-group")].map(p=>{
   const r=p.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];
  })
 }));
 const a=await measure();
 await page.waitForTimeout(220);
 const b=await measure();
 expect(a.transform).toBe("none");
 expect(b.transform).toBe("none");
 for(let i=0;i<4;i++){
  expect(Math.hypot(a.paws[i][0]-b.paws[i][0],a.paws[i][1]-b.paws[i][1])).toBeLessThan(1.3);
 }
 await expect(root).toHaveAttribute("data-ready","true",{timeout:8000});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test("D23: Cat/Cow holds the ground, freezes in pause and returns to neutral when leaving",async({page})=>{
 const root=await enter(page);
 for(const phase of ["centering","breath","warmup"])await next(page,root,phase);
 await expect(root).toHaveAttribute("data-ready","true",{timeout:8000});
 const capture=()=>root.evaluate(el=>{
  const pose=el.querySelector('.yy-pose[data-pose="warmup"]');
  const paws=[...pose.querySelectorAll(".yy-paw-group")].map(p=>{
   const r=p.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];
  });
  return {
   paws,spine:pose.querySelector("[data-asana-spine]").getAttribute("d"),
   neck:pose.querySelector(".yy-d14-neck-table").getAttribute("d")
  };
 });
 const a=await capture();
 await page.waitForTimeout(300);
 const b=await capture();
 expect(a.neck).not.toEqual(b.neck);
 for(let i=0;i<4;i++)expect(Math.hypot(a.paws[i][0]-b.paws[i][0],a.paws[i][1]-b.paws[i][1])).toBeLessThan(1.3);
 await page.locator('[data-flow-action="pause"]').evaluate(el=>el.click());
 await expect(root).toHaveAttribute("data-asana-state","paused");
 const c=await capture();
 await page.waitForTimeout(260);
 expect((await capture()).spine).toBe(c.spine);
 // Navigation is intentionally disabled while paused by the original flow.
 await page.locator('[data-flow-action="pause"]').evaluate(el=>el.click());
 await expect(root).toHaveAttribute("data-asana-state","running");
 await next(page,root,"pose-1");
 await expect.poll(()=>root.locator('.yy-pose[data-pose="warmup"] [data-asana-spine]').getAttribute("d")).toBe("M-105 -24Q0 -61.0 104 -24");
 const neutral=await root.locator('.yy-pose[data-pose="warmup"] .yy-head-motion').getAttribute("transform");
 expect(neutral).toBeNull();
});
test("D23: reduced motion uses instant, still geometry and no displaced paws",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});
 const root=await enter(page);
 await next(page,root,"centering");
 await expect(root).toHaveAttribute("data-ready","true",{timeout:2000});
 await expect(root.locator(".yy-pose.is-current")).toHaveCSS("transform","none");
 await expect(root.locator(".yy-pose.is-current")).toHaveCSS("transition-duration","0s");
});
