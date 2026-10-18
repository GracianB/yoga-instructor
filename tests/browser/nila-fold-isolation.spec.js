const {test,expect}=require("@playwright/test");

test("Standing Uttanasana and seated Paschimottanasana use distinct torso geometry",async({page},testInfo)=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const book=page.locator("#studio-asana-library");
 const results=[];
 for(const [id,label] of [["v68-forward-fold","standing"],["v68-seated-fold","seated"]]){
  await book.locator('button[data-library-pose="'+id+'"]').evaluate(el=>el.click());
  const pose=book.locator('.yy-pose.is-current[data-pose="'+id+'"]');
  await expect(pose).toHaveCSS("visibility","visible");
  const torso=pose.locator(".movement-guardian .mg-torso");
  const body=torso.locator(".mg-body");
  await expect(body).toHaveCount(1);
  const geometry=await body.getAttribute("d");
  const transform=await torso.getAttribute("transform");
  const profile=await pose.locator(".mg-head-fold").count();
  const contacts=await pose.locator('.movement-guardian [data-contact]').count();
  expect(contacts).toBe(4);
  expect(geometry.length).toBeGreaterThan(35);
  results.push({label,geometry,transform,profile});
  await pose.locator(".movement-guardian").evaluate(el=>el.scrollIntoView({block:"center",behavior:"instant"}));
  await testInfo.attach("nila-"+label+"-forward-fold",{
    body:await page.screenshot({animations:"disabled",timeout:15000}),contentType:"image/png"
  });
 }
 expect(results[0].geometry).not.toBe(results[1].geometry);
 expect(results[0].transform).toContain("rotate(0");
 expect(results[1].transform).toContain("rotate(-33");
 expect(results[0].profile).toBe(1);
 expect(results[1].profile).toBe(0);
});
