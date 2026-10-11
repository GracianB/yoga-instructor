const{test,expect}=require("@playwright/test");
test("V82 supported and soft variations follow Nila posture and do not start the session",async({page})=>{
 await page.goto("/");const book=page.locator("#studio-asana-library");
 await book.locator('button[data-library-pose="v68-tree"]').evaluate(b=>b.click());
 const v=book.locator(".v82-options");await expect(v).toBeVisible();
 await expect(v.locator("#v82-advice")).toContainText("dedos del pie libre");
 await v.locator('[data-v82-mode="supported"]').evaluate(b=>b.click());
 await expect(v.locator("#v82-advice")).toContainText("pared");
 await book.locator('button[data-library-pose="d24-downward"]').evaluate(b=>b.click());
 await expect(v.locator("#v82-advice")).toContainText("pared");
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
});
test("V82 updates instructions on language switch and uses native caution disclosure",async({page})=>{
 await page.goto("/");const book=page.locator("#studio-asana-library"),v=book.locator(".v82-options");
 await book.locator('button[data-library-pose="v68-tree"]').evaluate(b=>b.click());
 await v.locator('[data-v82-mode="supported"]').evaluate(b=>b.click());
 await page.locator('[data-set-lang="en"]').first().evaluate(b=>b.click());
 await expect(v.locator("#v82-advice")).toContainText("wall");
 await v.locator("summary").evaluate(b=>b.click());
 await expect(v.locator("details")).toHaveAttribute("open","");
 await expect(v.locator(".v82-disclaimer")).toContainText("not medical");
});
