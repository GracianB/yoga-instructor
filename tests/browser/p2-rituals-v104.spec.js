const {test,expect}=require("@playwright/test");

test("P2 · Dragon has five accessible ritual moments but never starts or plays sound automatically",async({page})=>{
 test.setTimeout(70000);
 await page.goto("/");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 const root=page.locator("#instructor-flow"),stage=page.locator("#studio-guided");
 const ritual=page.locator("#p2-ritual");
 await expect(root).toHaveAttribute("data-studio-mode","breath");
 await expect(ritual).toBeVisible();
 await expect(ritual.locator(".p2-ritual-track li")).toHaveCount(5);
 await expect(stage).toHaveAttribute("data-studio-status","idle");
 await expect(page.locator("#studio-guided-countdown")).toHaveText("05:00");
 const audio=await page.evaluate(()=>window.YOGA_AUDIO_BUS?.audio?.paused);
 expect(audio).toBe(true);
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(stage).toHaveAttribute("data-studio-status","running");
 await expect(stage).toHaveAttribute("data-p2-ritual-stage","arrive");
 const first=await page.locator("#studio-guided-cue").textContent();
 expect(first).toMatch(/apoyo|support|respira|breath/i);
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(stage).toHaveAttribute("data-studio-status","paused");
 const saved=await page.locator("#studio-guided-countdown").textContent();
 await page.waitForTimeout(650);
 expect(await page.locator("#studio-guided-countdown").textContent()).toBe(saved);
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await expect(stage).toHaveAttribute("data-studio-status","idle");
 await page.locator('[data-breath-pattern="free"]').evaluate(el=>el.click());
 const free=await page.evaluate(()=>window.YOGA_PRACTICE_RITUAL_V104.frame({
  mode:"breath",status:"running",progress:.45,pattern:"free"}));
 expect(free.envelope).toBe(0);
});

test("P2 · Uma focuses on body or surroundings in five stages, with silence intact",async({page})=>{
 await page.goto("/");
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 const stage=page.locator("#studio-guided"),ritual=page.locator("#p2-ritual");
 await expect(stage).toHaveAttribute("data-studio-active","meditation");
 await expect(ritual).toBeVisible();
 await expect(ritual.locator(".p2-ritual-track li")).toHaveCount(5);
 await page.locator('[data-meditation-focus="body"]').evaluate(el=>el.click());
 await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
 await expect(stage).toHaveAttribute("data-studio-status","running");
 await expect(stage).toHaveAttribute("data-meditation-focus","body");
 await expect(stage.locator(".v89-message")).toContainText(/apoyo|cuerpo|postura/i);
 await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 await page.locator('[data-meditation-style="silent"]').evaluate(el=>el.click());
 await expect(ritual).toBeHidden();
 await expect(stage.locator(".v89-ritual")).toBeHidden();
 await expect(stage.locator('[data-v90-action="voice"]')).toBeDisabled();
 const noVoice=await page.evaluate(()=>window.YOGA_PRACTICE_RITUAL_V104.frame({
  mode:"meditation",status:"running",style:"silent",progress:.38}).canNarrate);
 expect(noVoice).toBe(false);
});

test("P2 · English, 320px and reduced motion remain readable without introducing a second timer",async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 const ritual=page.locator("#p2-ritual");
 await expect(ritual.locator("#p2-ritual-title")).toContainText("ONE BREATH");
 const overflow=await ritual.evaluate(el=>el.scrollWidth-el.clientWidth);
 expect(overflow).toBeLessThanOrEqual(1);
 const item=ritual.locator(".p2-ritual-track li").first();
 await expect(item).toBeVisible();
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(ritual.locator("#p2-ritual-title")).toContainText("FIVE MOMENTS");
 await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-status","idle");
});
