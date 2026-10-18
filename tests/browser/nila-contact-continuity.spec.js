const {test,expect}=require("@playwright/test");

// Geometry is checked in screen coordinates, so CSS/SVG transforms and stage
// scaling cannot hide disconnected paws behind correct-looking source data.
test("Nila contact anchors are attached to their actual SVG limb terminals in 12 asanas",async({page})=>{
 test.setTimeout(90000);
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const book=page.locator("#studio-asana-library");
 await expect(book.locator(".movement-guardian")).toHaveCount(12);
 const report=[];
 const buttons=book.locator('button[data-library-pose]');
 await expect(buttons).toHaveCount(12);
 const ids=await buttons.evaluateAll(nodes=>nodes.map(node=>node.dataset.libraryPose));
 for(const id of ids){
  await book.locator('button[data-library-pose="'+id+'"]').evaluate(node=>node.click());
  const pose=book.locator('.yy-pose.is-current');
  await expect(pose).toHaveAttribute("data-pose",id);
  const pairs=await pose.locator(".movement-guardian").evaluate(guardian=>{
   const values=[];
   for(const type of ["arm","leg"])for(let i=0;i<2;i++){
    const limb=guardian.querySelector('[data-mg-limb="'+type+'-'+i+'"] .mg-limb-plane');
    const paw=guardian.querySelector('[data-contact="'+(type==="arm"?"hand":"foot")+'-'+i+'"]');
    if(!limb||!paw){values.push({type,i,missing:true});continue}
    const end=limb.getPointAtLength(limb.getTotalLength()).matrixTransform(limb.getScreenCTM());
    const origin=new DOMPoint(0,0).matrixTransform(paw.getScreenCTM());
    const delta=Math.hypot(end.x-origin.x,end.y-origin.y);
    values.push({type,i,delta,opacity:getComputedStyle(paw).opacity,visibility:getComputedStyle(paw).visibility});
   }
   return values;
  });
  report.push({id,pairs});
 }
 for(const pose of report){
  expect(pose.pairs,"Four hands/feet required on "+pose.id).toHaveLength(4);
  for(const x of pose.pairs){
   expect(x.missing,pose.id+"/"+x.type+x.i).not.toBe(true);
   expect(x.delta,pose.id+"/"+x.type+x.i+" disconnected contact").toBeLessThan(3);
   expect(x.visibility,pose.id+"/"+x.type+x.i).not.toBe("hidden");
   expect(Number(x.opacity),pose.id+"/"+x.type+x.i).toBeGreaterThan(.8);
  }
 }
});

test("Warrior II and Tree now connect the upper arms visually and align raised hands",async({page})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const book=page.locator("#studio-asana-library");
 for(const id of ["v68-warrior-ii","v68-tree"]){
  await book.locator('button[data-library-pose="'+id+'"]').evaluate(node=>node.click());
  const active=book.locator(".yy-pose.is-current .movement-guardian");
  await expect(active).toHaveCount(1);
  const distances=await active.evaluate(guardian=>[0,1].map(index=>{
   const arm=guardian.querySelector('[data-mg-limb="arm-'+index+'"] .mg-limb-plane');
   const visible=guardian.querySelector('[data-visible-arm="'+index+'"]');
   const paw=guardian.querySelector('[data-contact="hand-'+index+'"]');
   const root=arm.getPointAtLength(0);
   const start=visible.getPointAtLength(0);
   const terminal=arm.getPointAtLength(arm.getTotalLength());
   const point=new DOMPoint(0,0).matrixTransform(paw.getScreenCTM());
   const end=terminal.matrixTransform(arm.getScreenCTM());
   return {shoulder:Math.hypot(root.x-start.x,root.y-start.y),
    wrist:Math.hypot(point.x-end.x,point.y-end.y)};
  }));
  for(const [i,d] of distances.entries()){
   expect(d.shoulder,id+" arm "+i+" shoulder gap").toBeLessThan(33);
   expect(d.wrist,id+" arm "+i+" wrist gap").toBeLessThan(3);
  }
 }
 const warrior=book.locator('button[data-library-pose="v68-warrior-ii"]');
 await warrior.evaluate(node=>node.click());
 const palms=await book.locator(".yy-pose.is-current .mg-hand").evaluateAll(nodes=>nodes.map(el=>{
  const m=(el.getAttribute("transform")||"").match(/rotate\(([-\d.]+)\)/);
  return m?Number(m[1]):NaN;
 }));
 expect(palms).toHaveLength(2);
 expect(palms.every(v=>Number.isFinite(v)&&Math.abs(v)<20)).toBe(true);
});
