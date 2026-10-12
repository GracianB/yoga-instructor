const {test,expect}=require("@playwright/test");

test("V101 opens calmly, explains Nila and focuses Start without starting the flow",async({page})=>{
 await page.goto("/");
 const guide=page.locator("#studio-wayfinder");
 await expect(guide).toHaveCount(1);
 await expect(guide.locator("#v101-title")).toContainText("Nila");
 await expect(guide.locator(".v101-cue")).toContainText("solo cuando pulses Empezar");
 await expect(guide.locator(".v101-find")).toHaveText("Ir a Empezar");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
 await guide.locator(".v101-find").evaluate(button=>button.click());
 await expect(page.locator('[data-flow-action="start"]')).toBeFocused();
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
 await guide.locator(".v101-summary").evaluate(el=>el.click());
 await expect(guide.locator(".v101-steps li")).toHaveCount(3);
 await expect(guide.locator(".v101-safety")).toContainText("No hay audio ni inicio automático");
});

test("V101 follows Dragon free breathing and pause/resume with one original controller",async({page})=>{
 await page.goto("/");
 const guide=page.locator("#studio-wayfinder");
 await page.locator('button.studio-mode[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(guide.locator("#v101-title")).toContainText("Dragón");
 await page.locator('button[data-breath-pattern="free"]').evaluate(el=>el.click());
 await guide.locator(".v101-find").evaluate(el=>el.click());
 await expect(page.locator('[data-studio-action="primary"]')).toBeFocused();
 await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-status","idle");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(guide.locator(".v101-cue")).toContainText("sin contar segundos");
 await expect(guide.locator(".v101-find")).toHaveText("Ir a Pausa");
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(guide.locator(".v101-find")).toHaveText("Ir a Reanudar");
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await expect(guide.locator(".v101-find")).toHaveText("Ir a Empezar");
});

test("V101 follows Uma silent meditation without turning on audio",async({page})=>{
 await page.goto("/");
 const guide=page.locator("#studio-wayfinder");
 await page.locator('button.studio-mode[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await page.locator('button[data-meditation-style="silent"]').evaluate(el=>el.click());
 await expect(guide.locator("#v101-title")).toContainText("Uma");
 await expect(guide.locator(".v101-cue")).toContainText("ninguna voz");
 await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-status","idle");
 const player=page.locator("#focus-audio");
 await expect.poll(()=>player.evaluate(audio=>audio.paused)).toBe(true);
 await guide.locator(".v101-find").evaluate(el=>el.click());
 await expect(page.locator('[data-studio-action="primary"]')).toBeFocused();
 await expect.poll(()=>player.evaluate(audio=>audio.paused)).toBe(true);
});

test("V101 translates live labels and guidance to English without resetting the studio",async({page})=>{
 await page.goto("/");
 const guide=page.locator("#studio-wayfinder");
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(guide.locator(".v101-eyebrow")).toHaveText("YOUR NEXT STEP");
 await expect(guide.locator(".v101-summary")).toHaveText("How this space works");
 await expect(page.locator(".studio-entrance")).toHaveAttribute("aria-label","Practice studio");
 await expect(page.locator("#studio-v66-workspace")).toHaveAttribute("aria-label","Practice workspace");
 await expect(page.locator(".studio-modes")).toHaveAttribute("aria-label","Choose practice type");
 await page.locator('button.studio-mode[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(guide.locator(".v101-cue")).toContainText("Nothing starts on its own");
 await expect(guide.locator(".v101-find")).toHaveText("Go to Start");
 await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-status","idle");
});

test("V101 stays contained at 320/375 px, in dark mode and reduced motion",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});
 for(const width of [320,375]){
  await page.setViewportSize({width,height:812});
  await page.goto("/");
  await page.locator('[data-set-theme="dark"]').first().evaluate(el=>el.click());
  const guide=page.locator("#studio-wayfinder");
  await expect(guide).toBeVisible();
  await guide.locator(".v101-summary").evaluate(el=>el.click());
  await expect(guide.locator(".v101-steps li")).toHaveCount(3);
  expect(await guide.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
  await page.locator('button.studio-mode[data-studio-mode="breath"]').evaluate(el=>el.click());
  await expect(guide).toHaveAttribute("data-v101-mode","breath");
  expect(await guide.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
 }
});
