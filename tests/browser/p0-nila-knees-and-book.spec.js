const {test,expect}=require("@playwright/test");
test("P0 · 22 Nila poses have connected knees and same nonblack body/leg paint",async({page})=>{
 test.setTimeout(90000);
 await page.goto("/");
 await expect(page.locator("#studio-asana-library .movement-guardian")).toHaveCount(12);
 await expect(page.locator("#flow-guide .movement-guardian")).toHaveCount(10);
 const review=await page.evaluate(()=>{
  const groups=[
   ...document.querySelectorAll("#flow-guide .movement-guardian"),
   ...document.querySelectorAll("#studio-asana-library .movement-guardian")
  ];
  return groups.map((guardian,i)=>{
   const body=guardian.querySelector(".mg-body");
   const leg=guardian.querySelector(".mg-leg .mg-limb-volume");
   const knee=guardian.querySelector(".mg-knee .mg-p0-kneecap");
   const shell=guardian.querySelector(".mg-knee .mg-hinge-shell");
   return {index:i,kind:guardian.dataset.kind,
    body:body&&getComputedStyle(body).fill,
    leg:leg&&getComputedStyle(leg).fill,
    knee:knee&&getComputedStyle(knee).fill,
    kneeOpacity:knee&&getComputedStyle(knee).opacity,
    shellOpacity:shell&&getComputedStyle(shell).opacity,
    knees:guardian.querySelectorAll(".mg-p0-kneecap").length,
    ankles:guardian.querySelectorAll(".mg-p0-ankle").length};
  });
 });
 expect(review).toHaveLength(22);
 for(const p of review){
  expect(p.leg,p.index+" "+p.kind).toBe(p.body);
  expect(p.body,p.index+" "+p.kind).not.toBe("rgb(0, 0, 0)");
  expect(p.knee,p.index+" "+p.kind).not.toBe("rgb(0, 0, 0)");
  expect(Number(p.kneeOpacity),p.index+" "+p.kind).toBeGreaterThan(.7);
  expect(Number(p.shellOpacity),p.index+" "+p.kind).toBeGreaterThan(.5);
  expect(p.knees).toBe(2);
  expect(p.ankles).toBe(2);
 }
});
test("P0 · book's yin/yang material follows its stage and no floor contact moves",async({page})=>{
 await page.goto("/");
 const book=page.locator("#studio-asana-library");
 const stage=book.locator(".studio-library-stage");
 for(const spirit of ["yin","yang"]){
  await stage.evaluate((el,v)=>{el.dataset.spirit=v},spirit);
  const colors=await stage.locator(".movement-guardian").first().evaluate(el=>({
   coat:getComputedStyle(el.querySelector(".mg-body")).fill,
   knee:getComputedStyle(el.querySelector(".mg-p0-kneecap")).fill
  }));
  expect(colors.coat).not.toBe("rgb(0, 0, 0)");
  expect(colors.knee).not.toBe("rgb(0, 0, 0)");
 }
 const points=await stage.locator(".movement-guardian").first().evaluate(el=>[...el.querySelectorAll(".mg-foot")].map(n=>n.getAttribute("transform")));
 await page.emulateMedia({reducedMotion:"reduce"});
 const still=await stage.locator(".movement-guardian").first().evaluate(el=>[...el.querySelectorAll(".mg-foot")].map(n=>n.getAttribute("transform")));
 expect(still).toEqual(points);
});
