const{test,expect}=require("@playwright/test");
test("V94 chooses 3 real asanas and V85 controls follow new order",async({page})=>{
await page.goto("/");const studio=page.locator("#studio-asana-library"),editor=studio.locator(".v94-editor");
await editor.locator("summary").evaluate(b=>b.click());
const choices=editor.locator(".v94-steps select");
await choices.nth(0).selectOption("v68-tree");
await choices.nth(1).selectOption("d24-downward");
await choices.nth(2).selectOption("v68-gratitude");
await editor.locator(".v94-apply").evaluate(b=>b.click());
await expect(studio.locator("#v85-route")).toHaveValue("custom");
await expect(studio.locator(".v85-asana-title")).toContainText("Árbol");
await studio.locator('[data-v85-action="next"]').evaluate(b=>b.click());
await expect(studio.locator(".v85-asana-title")).toContainText("Perro");
await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
});
test("V94 rejects duplicate poses instead of silently launching a sequence",async({page})=>{
await page.goto("/");const editor=page.locator(".v94-editor");await editor.locator("summary").evaluate(b=>b.click());
await editor.locator(".v94-steps select").nth(1).selectOption("d24-mountain");
await editor.locator(".v94-apply").evaluate(b=>b.click());
await expect(editor.locator(".v94-status")).toContainText("diferentes");
await expect(page.locator("#v85-route")).toHaveValue("roots");
});