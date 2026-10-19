const{test,expect}=require("@playwright/test");
test("V97 direct keyboard navigation bypasses hero and respects language",async({page})=>{
await page.goto("/");const link=page.locator("body > [data-v97-skip]");
await expect(link).toHaveText("Ir a la sala de práctica");
await link.focus();await expect(link).toBeFocused();
await page.keyboard.press("Enter");
await expect(page).toHaveURL(/#instructor-flow$/);
await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
await expect(link).toHaveText("Skip to the practice studio");
});
test("V97 after moving custom pose, focus stays in the destination row with a helpful label",async({page})=>{
await page.goto("/");
await page.locator('#p2-asana-toggle').evaluate(x=>x.click());
await page.locator('#p2-asana-advanced > summary').evaluate(x=>x.click());
const editor=page.locator("#studio-asana-library .v94-editor");await editor.locator("summary").evaluate(x=>x.click());
const b=editor.locator('[data-v94-index="1"] [data-v94-direction="up"]');
await b.focus();await expect(b).toBeFocused();await page.keyboard.press("Enter");
const focus=page.locator(":focus");
await expect(focus).toHaveAttribute("id","v94-pose-0");
await expect(editor.locator('label[for="v94-pose-0"]')).toHaveText("Postura 1");
});
test("V97 user-invoked focus return is readable as its own message",async({page})=>{
await page.goto("/");await page.locator('[data-studio-mode="meditation"]').first().evaluate(x=>x.click());
const panel=page.locator(".v89-ritual");await panel.locator(".v89-return").evaluate(x=>x.click());
await expect(panel.locator(".v89-message")).toBeFocused();
await expect(panel.locator(".v89-message")).toContainText("mente");
});
