const {test,expect}=require("@playwright/test");

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
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
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
