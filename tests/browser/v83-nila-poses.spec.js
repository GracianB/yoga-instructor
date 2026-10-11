const{test,expect}=require("@playwright/test");
test("V83: Nila draws four grounded Downward Dog contacts in the real book",async({page})=>{
await page.goto("/");const book=page.locator("#studio-asana-library");
await book.locator('button[data-library-pose="d24-downward"]').evaluate(e=>e.click());
const dog=book.locator('.yy-pose[data-pose="d24-downward"] .movement-guardian');
await expect(dog).toBeVisible();
await expect(dog.locator("[data-contact]")).toHaveCount(4);
await expect(dog.locator(".mg-torso[data-pose-kind='downward'] .mg-body")).toHaveAttribute("d",/M274 264/);
});
test("V83: balance pose shows one grounded shadow and raised calf contact",async({page})=>{
await page.goto("/");const book=page.locator("#studio-asana-library");
await book.locator('button[data-library-pose="v68-tree"]').evaluate(e=>e.click());
const tree=book.locator('.yy-pose[data-pose="v68-tree"] .movement-guardian');
await expect(tree).toBeVisible();
await expect(tree.locator(".mg-contact-shadows .mg-shadow")).toHaveCount(1);
await expect(tree.locator(".mg-paw.mg-foot")).toHaveCount(2);
await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
});
