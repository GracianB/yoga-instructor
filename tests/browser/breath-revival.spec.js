const {test,expect}=require("@playwright/test");

for(const width of [320,390,768,1440]){
 test("V35 breathing guardian is seated, legible and contained at "+width+"px",async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto("/");
  await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true",{timeout:12000});
  await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
  const stage=page.locator("#studio-guided");
  const guardian=stage.locator(".studio-breath-dragon");
  await expect(guardian).toBeVisible();
  for(const path of [".sd31-tail",".sd31-wings",".sd31-body",".sd31-head",".sd31-breath-core",".sd31-ground"]){
   await expect(guardian.locator(path)).toHaveCount(1);
  }
  const bounds=await guardian.boundingBox();
  expect(bounds.width).toBeGreaterThan(200);
  expect(bounds.height).toBeGreaterThan(220);
  expect(bounds.x).toBeGreaterThanOrEqual(-1);
  expect(bounds.x+bounds.width).toBeLessThanOrEqual(width+1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('[data-breath-pattern="free"]').evaluate(el=>el.click());
  await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
  await expect(stage).toHaveAttribute("data-breath-phase","free");
  await page.locator('[data-studio-action="primary"]').evaluate(el=>el.click());
  await expect(stage).toHaveAttribute("data-studio-status","paused");
  await page.locator('[data-studio-action="reset"]').evaluate(el=>el.click());
 });
}
test("V35 soundtrack stays opt-in and accepts provided local MP3 with working controls",async({page})=>{
 await page.goto("/");
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 const player=page.locator(".studio-soundscape");
 await expect(player).toBeVisible();
 const button=player.locator(".studio-sound-toggle");
 await expect(button).toHaveAttribute("aria-pressed","false");
 await player.locator(".studio-sound-file").setInputFiles({
  name:"Silence Between Notes.mp3",
  mimeType:"audio/mpeg",
  buffer:Buffer.from("ID3\\u0004\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000")
 });
 await expect(player.locator(".studio-sound-track")).toContainText("Silence Between Notes.mp3");
 expect(await page.locator("#focus-audio").evaluate(el=>el.src.startsWith("blob:"))).toBe(true);
 await player.locator(".studio-sound-volume").evaluate(el=>{el.value="0.5";el.dispatchEvent(new Event("input",{bubbles:true}));});
 expect(await page.locator("#focus-audio").evaluate(el=>el.volume)).toBe(.5);
 await page.locator('[data-studio-mode="meditation"]').evaluate(el=>el.click());
 await expect(player).toBeHidden();
 await page.locator('[data-studio-mode="breath"]').evaluate(el=>el.click());
 await expect(button).toHaveAttribute("aria-pressed","false");
});
