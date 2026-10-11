const{test,expect}=require("@playwright/test");
test("V84 grounded contact marks follow selected Nila pose geometry",async({page})=>{
 await page.goto("/");const book=page.locator("#studio-asana-library");
 await book.locator('button[data-library-pose="d24-downward"]').evaluate(e=>e.click());
 const dog=book.locator('.yy-pose[data-pose="d24-downward"] .mg-grounding');
 await expect(dog.locator("[data-ground]")).toHaveCount(4);
 await book.locator('button[data-library-pose="v68-tree"]').evaluate(e=>e.click());
 const tree=book.locator('.yy-pose[data-pose="v68-tree"] .mg-grounding');
 await expect(tree.locator("[data-ground]")).toHaveCount(1);
 await expect(book.locator(".studio-library-ground")).toContainText("APOYO");
});
test("V84 authentic Movement tree also uses the same single-foot base",async({page})=>{
 await page.goto("/");
 const guardian=page.locator('#flow-guide .yy-pose[data-pose="pose-2"] .mg-grounding');
 await expect(guardian.locator("[data-ground]")).toHaveCount(1);
 await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
});
