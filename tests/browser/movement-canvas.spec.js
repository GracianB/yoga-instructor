const {test,expect}=require('@playwright/test');
test('Canvas presents every library posture with full-body framing',async({page})=>{
 await page.goto('/#studio-asana-library');
 const canvas=page.locator('#studio-asana-library .asana-canvas');await expect(canvas).toHaveCount(1);
 const buttons=page.locator('[data-library-pose]');
 for(const button of await buttons.all()){
  await button.click();const id=await button.getAttribute('data-library-pose');
  await expect(canvas).toHaveAttribute('data-pose',id);
  await expect(canvas).toHaveAttribute('data-skin','anatomical');
  await expect(canvas).toHaveAttribute('data-framing','full-body');
  expect(await canvas.evaluate(el=>{const pixels=el.getContext('2d').getImageData(0,0,el.width,el.height).data;let occupied=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0)occupied++;return occupied;})).toBeGreaterThan(100);
  expect(await canvas.evaluate(el=>el.width>0&&el.height>0)).toBe(true);
 }
 await page.locator('#studio-asana-library .canvas-view-controls .canvas-joints-toggle').click();
 await expect(page.locator('#studio-asana-library .canvas-view-controls .canvas-joints-toggle')).toHaveAttribute('aria-pressed','true');
});
