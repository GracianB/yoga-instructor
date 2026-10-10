const {test,expect}=require("@playwright/test");
test("V56 Nila's ten poses have torso covering arm sockets but hands over chest",async({page})=>{
 await page.goto("/");
 const poses=page.locator("#flow-guide .yy-pose");
 await expect(poses).toHaveCount(10);
 for(const pose of await poses.all()){
  const guardian=pose.locator(".movement-guardian");
  await expect(guardian).toHaveCount(1);
  await expect(guardian.locator(".mg-arms-behind .mg-shoulder")).toHaveCount(2);
  await expect(guardian.locator(".mg-arms-behind .mg-elbow")).toHaveCount(2);
  await expect(guardian.locator(".mg-hands .mg-paw")).toHaveCount(2);
  const depth=await guardian.evaluate(el=>{
    const children=[...el.children];return [
      children.findIndex(x=>x.classList.contains("mg-arms-behind")),
      children.findIndex(x=>x.classList.contains("mg-torso")),
      children.findIndex(x=>x.classList.contains("mg-hands"))
    ];
  });
  expect(depth[0]).toBeGreaterThan(-1);
  expect(depth[0]).toBeLessThan(depth[1]);
  expect(depth[1]).toBeLessThan(depth[2]);
 }
 await expect(page.locator('#flow-guide .yy-pose[data-pose="finish"] .mg-gesture-forearm')).toHaveCount(2);
 await expect(page.locator('#flow-guide .yy-pose[data-pose="pose-1"] .mg-gesture-forearm')).toHaveCount(0);
});
test("V56 three additional asanas reuse the exact same shoulder construction",async({page})=>{
 await page.goto("/");
 const gallery=page.locator("#studio-asana-library .movement-guardian");
 await expect(gallery).toHaveCount(3);
 await expect(gallery.locator(".mg-arms-behind .mg-shoulder")).toHaveCount(6);
 await expect(gallery.locator(".mg-hands .mg-paw")).toHaveCount(6);
});
