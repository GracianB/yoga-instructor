const{test,expect}=require("@playwright/test");
/* Capture only the relevant viewport of the Asana Book.
 * Full-page shots of this long portfolio can exceed the 30s test timeout.
 * Browser visual audits capture complete pages independently.
 */
const capturePose=async(page,testInfo,name)=>{
 await page.locator("#studio-asana-library .studio-library-stage").evaluate(
  el=>el.scrollIntoView({block:"center",behavior:"instant"})
 );
 await testInfo.attach(name,{
  body:await page.screenshot({animations:"disabled",timeout:15000}),
  contentType:"image/png"
 });
};

test("V83: Nila draws four grounded Downward Dog contacts in the real book",async({page})=>{
await page.goto("/",{waitUntil:"domcontentloaded"});const book=page.locator("#studio-asana-library");
await book.locator('button[data-library-pose="d24-downward"]').evaluate(e=>e.click());
const dog=book.locator('.yy-pose[data-pose="d24-downward"] .movement-guardian');
await expect(dog).toBeVisible();
await expect(dog.locator("[data-contact]")).toHaveCount(4);
await expect(dog.locator(".mg-torso[data-pose-kind='downward'] .mg-body")).toHaveAttribute("d",/M274 264/);
});
test("V83: balance pose shows one grounded shadow and raised calf contact",async({page})=>{
await page.goto("/",{waitUntil:"domcontentloaded"});const book=page.locator("#studio-asana-library");
await book.locator('button[data-library-pose="v68-tree"]').evaluate(e=>e.click());
const tree=book.locator('.yy-pose[data-pose="v68-tree"] .movement-guardian');
await expect(tree).toBeVisible();
await expect(tree.locator(".mg-contact-shadows .mg-shadow")).toHaveCount(1);
await expect(tree.locator(".mg-paw.mg-foot")).toHaveCount(2);
await expect(page.locator("#flow-guide")).toHaveAttribute("data-status","idle");
});


test("Nila's Downward Dog profile has a distinct readable face in Yin and Yang",async({page},testInfo)=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const book=page.locator("#studio-asana-library");
 await book.locator('button[data-library-pose="d24-downward"]').evaluate(node=>node.click());
 const pose=book.locator('.yy-pose.is-current[data-pose="d24-downward"]');
 await expect(pose).toHaveCSS("visibility","visible");
 const head=pose.locator(".movement-guardian .mg-head-downward");
 await expect(head).toHaveCount(1);
 await expect(head).toHaveAttribute("data-head-profile","side");
 for(const selector of [".mg-downward-face",".mg-downward-muzzle",".mg-downward-eye",".mg-downward-nostril",".mg-downward-mouth"]){
  await expect(head.locator(selector)).toHaveCount(1);
 }
 const stage=book.locator(".studio-library-stage");
 for(const spirit of ["yang","yin"]){
  await stage.evaluate((el,value)=>{el.dataset.spirit=value},spirit);
  const info=await head.evaluate(node=>{
   const face=node.querySelector(".mg-downward-face");
   const muzzle=node.querySelector(".mg-downward-muzzle");
   const rect=node.getBoundingClientRect();
   return {face:getComputedStyle(face).fill,muzzle:getComputedStyle(muzzle).fill,
    visibility:getComputedStyle(node).visibility,width:rect.width,height:rect.height};
  });
  expect(info.visibility).toBe("visible");
  expect(info.width).toBeGreaterThan(15);
  expect(info.height).toBeGreaterThan(15);
  expect(info.face).not.toBe(info.muzzle);
  await capturePose(page,testInfo,"nila-downward-"+spirit);
 }
});


test("Tadasana's relaxed hands point downward and Uttanasana's head faces the mat",async({page},testInfo)=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const book=page.locator("#studio-asana-library");
 for(const data of [
  {id:"d24-mountain",profile:false,name:"tadasana"},
  {id:"v68-forward-fold",profile:true,name:"uttanasana"}
 ]){
  await book.locator('button[data-library-pose="'+data.id+'"]').evaluate(node=>node.click());
  const active=book.locator('.yy-pose.is-current[data-pose="'+data.id+'"]');
  await expect(active).toHaveCSS("visibility","visible");
  const guardian=active.locator(".movement-guardian");
  await expect(guardian.locator(".mg-knee")).toHaveCount(2);
  await expect(guardian.locator('[data-contact^="foot-"]')).toHaveCount(2);
  if(data.profile){
   const face=guardian.locator(".mg-head-fold");
   await expect(face).toHaveAttribute("data-head-profile","side");
   await expect(face.locator(".mg-horn")).toHaveCount(2);
   const rotation=Number((await face.getAttribute("transform")).match(/rotate\(([^)]+)\)/)?.[1]);
   expect(rotation).toBe(-73);
  }else{
   await expect(guardian.locator(".mg-head-fold")).toHaveCount(0);
   const hands=await guardian.locator(".mg-hand").evaluateAll(nodes=>nodes.map(n=>n.getAttribute("transform")));
   expect(hands).toHaveLength(2);
   for(const hand of hands){
    const angle=Number(hand.match(/rotate\(([^)]+)\)/)?.[1]);
    expect(angle).toBe(0);
   }
  }
  await capturePose(page,testInfo,"nila-"+data.name+"-anatomy");
 }
});

test("Warrior II front knee is bent over its foot; forward fold hinges from the pelvis",async({page},testInfo)=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const book=page.locator("#studio-asana-library");
 await book.locator('button[data-library-pose="v68-warrior-ii"]').evaluate(node=>node.click());
 let active=book.locator('.yy-pose.is-current[data-pose="v68-warrior-ii"]');
 await expect(active).toHaveCSS("visibility","visible");
 const front=active.locator('[data-mg-limb="leg-0"]');
 await expect(front).toHaveAttribute("data-mg-limb","leg-0");
 await expect(front.locator(".mg-knee")).toHaveAttribute("data-rig-source","authored");
 const bend=await front.locator(".mg-limb-plane").getAttribute("d");
 expect((bend.match(/Q/g)||[]).length).toBe(2);
 await capturePose(page,testInfo,"warrior-ii-knee");
 await book.locator('button[data-library-pose="v68-forward-fold"]').evaluate(node=>node.click());
 active=book.locator('.yy-pose.is-current[data-pose="v68-forward-fold"]');
 await expect(active).toHaveCSS("visibility","visible");
 const torso=active.locator(".mg-torso");
 await expect(torso).toHaveAttribute("transform",/rotate\(0\.0 380\.0 192\.0\)/);
 await expect(torso.locator(".mg-body")).toHaveAttribute("d",/^M396 168 C379 166/);
 const contour=await torso.locator(".mg-body").evaluate(el=>{
   const bounds=el.getBBox();
   return {width:bounds.width,height:bounds.height};
 });
 expect(contour.height,"Folded torso should hang more vertically than it spans horizontally")
  .toBeGreaterThan(contour.width*1.2);
 const head=active.locator(".mg-head-fold");
 const headBox=await head.boundingBox(),feetBox=await active.locator('[data-contact="foot-0"]').boundingBox();
 expect(headBox&&feetBox&&headBox.y<feetBox.y,"Head should remain suspended above the soles").toBeTruthy();
 await capturePose(page,testInfo,"uttanasana-hip-hinge");
});
