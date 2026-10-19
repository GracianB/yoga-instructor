const {test,expect}=require("@playwright/test");
async function expectNoHorizontalOverflow(page){
 const info=await page.evaluate(()=>{
  const offenders=[...document.querySelectorAll("body *")].map(el=>{
   const r=el.getBoundingClientRect();
   return {tag:el.tagName.toLowerCase(),id:el.id||"",className:el.getAttribute("class")||"",right:Math.round(r.right),left:Math.round(r.left),width:Math.round(r.width)};
  }).filter(x=>x.right>innerWidth+2||x.left< -2).slice(0,25);
  return {page:location.pathname,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,offenders};
 });
 if(info.scrollWidth>info.viewport+1)console.log("MOBILE_OVERFLOW_DIAGNOSTIC",JSON.stringify(info));
 expect(info.scrollWidth).toBeLessThanOrEqual(info.viewport+1);
}


test("Practice V1 is visually coherent and movement follows three fixed actions",async({page})=>{
 await page.goto("/apps/yoga-practice/",{waitUntil:"domcontentloaded"});
 await expect(page.getByRole("tab")).toHaveCount(3);
 await expect(page.locator("#figure-root .yoga-figure")).toBeVisible();
 await expect(page.locator("#movement-steps li")).toHaveCount(3);
 await expect(page.locator("#clock")).toHaveText("04:00");
 await page.locator("#primary").click();
 await expect(page.locator("#stage-status")).toContainText("En curso");
 await expect(page.locator(".yoga-figure")).toHaveAttribute("data-pose","mountain");
 await page.locator("#primary").click();
 await expect(page.locator("#stage-status")).toContainText("En pausa");
 await page.locator("#reset").click();
 await expect(page.locator("#clock")).toHaveText("04:00");
 await page.locator('[data-mode="breath"]').click();
 await expect(page.locator("#breath-options")).toBeVisible();
 await expect(page.locator("#movement-options")).toBeHidden();
 await expect(page.locator(".yoga-figure")).toHaveAttribute("data-pose","seated");
 await page.locator('[data-pattern="478"]').click();
 await expect(page.locator('[data-pattern="478"]')).toHaveAttribute("aria-pressed","true");
 await page.locator('[data-mode="meditation"]').click();
 await page.locator('[data-meditation="guided"]').click();
 await expect(page.locator("#guided-options a")).toHaveCount(3);
 await expect(page.locator("#controls")).toBeHidden();
 await page.locator('[data-meditation="silent"]').click();
 await expect(page.locator("#guided-options")).toBeHidden();
 await expect(page.locator("#controls")).toBeVisible();
 await page.locator('[data-minutes="10"]').click();
 await expect(page.locator("#clock")).toHaveText("10:00");
});

test("Book V1 reuses the same figure and filters six postures",async({page})=>{
 await page.goto("/apps/yoga-asana-book/",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#pose-list button")).toHaveCount(10);
 await expect(page.locator(".yoga-figure")).toBeVisible();
 await expect(page.locator("#pose-name")).toContainText("Montaña");
 await page.locator('[data-category="rest"]').click();
 await expect(page.locator("#pose-list button")).toHaveCount(2);
 await expect(page.locator("#pose-name")).toContainText("Postura del niño");
 await expect(page.locator(".yoga-figure")).toHaveAttribute("data-pose","child");
 await page.locator('[data-category="all"]').click();
 await expect(page.locator("#pose-list button")).toHaveCount(10);
 await page.locator('[data-lang="en"]').click();
 await expect(page.locator("#pose-name")).toContainText("Child’s pose");
 await page.locator("#previous").click();
 await expect(page.locator("#pose-name")).toContainText("Easy seat");
});

test("Standalone apps stay usable on mobile without horizontal scroll or autoplay",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const url of ["/apps/yoga-practice/","/apps/yoga-asana-book/"]){
  await page.goto(url,{waitUntil:"domcontentloaded"});
  await expect(page.locator(".yoga-figure")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(page.locator("audio,video,iframe")).toHaveCount(0);
 }
});

test("Practice action opens that exact asana in the Book; filtering keeps the URL in sync",async({page})=>{
 await page.goto("/apps/yoga-practice/",{waitUntil:"domcontentloaded"});
 const a=page.locator("#pose-book-link");
 await expect(a).toBeVisible();
 await expect(a).toHaveAttribute("href",/\?pose=mountain$/);
 await a.click();
 await expect(page).toHaveURL(/\/apps\/yoga-asana-book\/\?pose=mountain$/);
 await expect(page.locator("#pose-name")).toContainText("Montaña");
 await page.locator('[data-pose-id="triangle"]').click();
 await expect(page).toHaveURL(/\?pose=triangle$/);
 await expect(page.locator(".yoga-figure")).toHaveAttribute("data-pose","triangle");
 await page.reload();
 await expect(page.locator("#pose-name")).toContainText("Triángulo");
 await page.locator('[data-category="rest"]').click();
 await expect(page.locator("#pose-list button")).toHaveCount(2);
 await expect(page).toHaveURL(/\?pose=child$/);
 await page.locator('[data-pose-id="sphinx"]').click();
 await expect(page.locator(".yoga-figure")).toHaveAttribute("data-pose","sphinx");
 await expect(page).toHaveURL(/\?pose=sphinx$/);
});
test("Book ignores untrusted pose links and chooses a real posture",async({page})=>{
 await page.goto("/apps/yoga-asana-book/?pose=%3Cscript%3Ealert(1)%3C%2Fscript%3E",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#pose-name")).toContainText("Montaña");
 await expect(page.locator(".yoga-figure")).toHaveAttribute("data-pose","mountain");
});

test("Breathing uses the same figure, announces each phase and respects reduced motion",async({page})=>{
 await page.goto("/apps/yoga-practice/",{waitUntil:"domcontentloaded"});
 await page.locator('[data-mode="breath"]').click();
 const figure=page.locator(".yoga-figure");
 await expect(figure).toHaveAttribute("data-mode","breath");
 await expect(figure).toHaveAttribute("data-phase","inhale");
 await page.locator('[data-pattern="444"]').click();
 await expect(page.locator("#phase-label")).toHaveText("Inhala");
 await expect(figure).toHaveAttribute("aria-label",/Respiración: Inhala/);
 await page.emulateMedia({reducedMotion:"reduce"});
 const transform=await figure.locator(".figure-human").evaluate(e=>getComputedStyle(e).transform);
 expect(transform).toBe("none");
});

test("Keyboard switching updates the real practice tabpanel",async({page})=>{
 await page.goto("/apps/yoga-practice/",{waitUntil:"domcontentloaded"});
 const panel=page.getByRole("tabpanel");
 await expect(panel).toHaveAttribute("aria-labelledby","tab-movement");
 await page.locator("#tab-movement").focus();
 await page.locator("#tab-movement").press("ArrowRight");
 await expect(page.locator("#tab-breath")).toBeFocused();
 await expect(panel).toHaveAttribute("aria-labelledby","tab-breath");
 await page.locator("#tab-breath").press("End");
 await expect(panel).toHaveAttribute("aria-labelledby","tab-meditation");
 await page.locator("#tab-meditation").press("Home");
 await expect(panel).toHaveAttribute("aria-labelledby","tab-movement");
});

test("Practice V1.4 preserves English breathing deep links and cross-app language",async({page})=>{
 await page.goto("/apps/yoga-practice/?mode=breath&pattern=4444&lang=en",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#tab-breath")).toHaveAttribute("aria-selected","true");
 await expect(page.locator('[data-pattern="4444"]')).toHaveAttribute("aria-pressed","true");
 await expect(page.locator("#phase-label")).toHaveText("Inhale");
 await page.reload();
 await expect(page.locator("#tab-breath")).toHaveAttribute("aria-selected","true");
 await expect(page.locator("#phase-label")).toHaveText("Inhale");
 await page.locator('[data-mode="movement"]').click();
 await expect(page.locator("#pose-book-link")).toHaveAttribute("href",/pose=mountain&lang=en$/);
 await page.locator("#pose-book-link").click();
 await expect(page.locator("#pose-name")).toHaveText("Mountain");
 await expect(page).toHaveURL(/pose=mountain&lang=en/);
});
test("Asana Book V1.4 keeps keyboard focus when changing postures",async({page})=>{
 await page.goto("/apps/yoga-asana-book/",{waitUntil:"domcontentloaded"});
 const first=page.locator('[data-pose-id="mountain"]');
 await first.focus();
 await first.press("ArrowDown");
 await expect(page.locator('[data-pose-id="tree"]')).toBeFocused();
 await expect(page.locator("#pose-name")).toHaveText("Árbol");
 await expect(page.locator('[data-pose-id="tree"]')).toHaveAttribute("aria-current","true");
 await page.locator('[data-pose-id="tree"]').press("End");
 await expect(page.locator('[data-pose-id="sphinx"]')).toBeFocused();
 await expect(page.locator("#pose-name")).toContainText("Esfinge");
 await page.setViewportSize({width:390,height:844});
 await expect(page.locator(".pose-list")).toHaveCSS("overflow-x","auto");
 await expectNoHorizontalOverflow(page);
});
