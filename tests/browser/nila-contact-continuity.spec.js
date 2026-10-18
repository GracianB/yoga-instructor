const {test,expect}=require("@playwright/test");

// Geometry is checked in screen coordinates, so CSS/SVG transforms and stage
// scaling cannot hide disconnected paws behind correct-looking source data.
test("Nila contact anchors are attached to their actual SVG limb terminals in 12 asanas",async({page})=>{
 test.setTimeout(90000);
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const book=page.locator("#studio-asana-library");
 await expect(book.locator(".movement-guardian")).toHaveCount(12);
 const report=await book.locator(".movement-guardian").evaluateAll(guardians=>guardians.map((guardian,index)=>{
  const m=guardian.closest(".yy-pose");
  const pairs=[];
  for(const type of ["arm","leg"])for(let i=0;i<2;i++){
   const limb=guardian.querySelector('[data-mg-limb="'+type+'-'+i+'"] .mg-limb-shell');
   const paw=guardian.querySelector('[data-contact="'+(type==="arm"?"hand":"foot")+'-'+i+'"]');
   if(!limb||!paw){pairs.push({type,i,missing:true});continue}
   const end=limb.getPointAtLength(limb.getTotalLength()).matrixTransform(limb.getScreenCTM());
   const origin=new DOMPoint(0,0).matrixTransform(paw.getScreenCTM());
   const delta=Math.hypot(end.x-origin.x,end.y-origin.y);
   pairs.push({type,i,delta,opacity:getComputedStyle(paw).opacity,visibility:getComputedStyle(paw).visibility});
  }
  return {id:m?.getAttribute("data-pose"),index,pairs};
 }));
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
