const {test,expect}=require('@playwright/test');
test('Canvas presents every library posture with full-body framing',async({page})=>{
 await page.goto('/#studio-asana-library');
 const canvas=page.locator('#studio-asana-library .asana-canvas');await expect(canvas).toHaveCount(1);
 const buttons=page.locator('[data-library-pose]');
 for(const button of await buttons.all()){
  await button.click();const id=await button.getAttribute('data-library-pose');
  await expect(canvas).toHaveAttribute('data-pose',id);
  await expect(canvas).toHaveAttribute('data-skin','anatomical');
  expect(await canvas.evaluate(el=>el.width>0&&el.height>0)).toBe(true);
 }
 await page.locator('#studio-asana-library .canvas-view-controls button').click();
 await expect(page.locator('#studio-asana-library .canvas-view-controls button')).toHaveAttribute('aria-pressed','true');
});
