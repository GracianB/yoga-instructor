const{test,expect}=require("@playwright/test");
const AxeBuilder=require("@axe-core/playwright").default;
test("V99 complete guardian handoff preserves one stage and no surprise playback",async({page})=>{
const errors=[];page.on("pageerror",error=>errors.push(error.message));
await page.goto("/");const root=page.locator("#instructor-flow"),guided=page.locator("#studio-guided");
await expect(root).toHaveAttribute("data-studio-mode","asanas");
await expect(page.locator("#focus-audio")).toHaveCount(1);
await page.locator('[data-studio-mode="breath"]').first().evaluate(x=>x.click());
await expect(guided).toHaveAttribute("data-studio-status","idle");
await page.locator('button[data-breath-pattern="free"]').evaluate(x=>x.click());
await page.locator('[data-studio-action="primary"]').evaluate(x=>x.click());
await expect(guided).toHaveAttribute("data-studio-status","running");
await expect(page.locator("#focus-audio")).toHaveJSProperty("paused",true);
await page.locator('[data-studio-action="primary"]').evaluate(x=>x.click());
await expect(guided).toHaveAttribute("data-studio-status","paused");
await page.locator('[data-studio-action="reset"]').evaluate(x=>x.click());
await expect(guided).toHaveAttribute("data-studio-status","idle");
await page.locator('[data-studio-mode="meditation"]').first().evaluate(x=>x.click());
await expect(root).toHaveAttribute("data-studio-mode","meditation");
await expect(page.locator(".meditation-guardian")).toHaveCount(1);
await expect(page.locator(".studio-breath-dragon")).toHaveCount(1);
await page.locator('button[data-meditation-style="silent"]').evaluate(x=>x.click());
await expect(page.locator(".v89-ritual")).toBeHidden();
await expect(page.locator(".v90-sound button[data-v90-action=voice]")).toBeDisabled();
await expect(guided).toHaveAttribute("data-studio-status","idle");
expect(errors).toEqual([]);
});
test("V99 persisted custom route, language and reading mode survive refresh with no autoplay",async({page})=>{
await page.goto("/");
const prefs=page.locator("#studio-preferences");await prefs.locator("summary").evaluate(x=>x.click());
const editor=page.locator(".v94-editor");await editor.locator("summary").evaluate(x=>x.click());
const selects=editor.locator("select[data-v94-position]");
await selects.nth(0).selectOption("v68-tree");
await selects.nth(1).selectOption("d24-downward");
await selects.nth(2).selectOption("v68-gratitude");
await editor.locator(".v94-apply").evaluate(x=>x.click());
await prefs.locator('button[data-v95-comfort="readable"]').evaluate(x=>x.click());
await prefs.locator('button[data-v93-action="save"]').evaluate(x=>x.click());
await page.reload();
await expect(page.locator("#instructor-flow")).toHaveAttribute("data-v95-comfort","readable");
await page.locator("#studio-preferences summary").evaluate(x=>x.click());
await expect(page.locator('[data-v93-setting="route"]')).toHaveValue("custom");
await page.locator('[data-v93-action="apply"]').evaluate(x=>x.click());
await expect(page.locator("#movement-mini .v85-asana-title")).toContainText("Árbol");
await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
await expect(page.locator("#studio-readiness .v98-mode")).toContainText("Nila");
await page.locator('[data-v93-action="clear"]').evaluate(x=>x.click());
await expect.poll(()=>page.evaluate(()=>localStorage.getItem("yoga-personalization-v95"))).toBeNull();
});
test("V99 Axe audits keyboard/personalization surfaces, not just the hero",async({page})=>{
await page.goto("/");
await page.locator("#studio-preferences summary").evaluate(x=>x.click());
await page.locator("#studio-asana-library .v94-editor summary").evaluate(x=>x.click());
const report=await new AxeBuilder({page}).options({preload:false})
.include("#studio-preferences").include("#studio-readiness").include("#studio-asana-library .v94-editor")
.withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
expect(report.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
});
