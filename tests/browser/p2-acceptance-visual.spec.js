const {test,expect}=require("@playwright/test");
const screens=[320,375,768,1440];
for(const width of screens){
 for(const theme of ["light","dark"]){
  test(`P2 VISUAL acceptance · ${width}px · ${theme}`,async({page},info)=>{
   test.setTimeout(75000);
   const failures=[];page.on("pageerror",error=>failures.push(error.message));
   await page.setViewportSize({width,height:850});
   await page.addInitScript(()=>{try{sessionStorage.setItem("gb-yoga-intro-seen","1")}catch{}});
   await page.emulateMedia({reducedMotion:"reduce"});
   await page.goto("/",{waitUntil:"domcontentloaded"});
   await expect(page.locator("#p2-lotus-focus")).toBeVisible();
   await expect(page.locator("#flow-guide")).toHaveAttribute("data-ready","true",{timeout:15000});
   await page.locator('[data-set-theme="'+theme+'"]').first().evaluate(x=>x.click());
   const html=page.locator("html");
   await expect(html).toHaveAttribute("data-theme",theme);
   const hero=page.locator("#inicio");
   const lotus=page.locator("#p2-lotus-focus");
   const studio=page.locator("#instructor-flow");
   const book=page.locator("#studio-asana-library");
   await expect(page.locator("#nav a")).toHaveCount(3);
   await expect(book.locator(".studio-library-stage")).toBeHidden();
   await expect(page.locator("#p2-dock-expand")).toBeVisible();
   await expect(page.locator("#p2-dock-expand")).toHaveAttribute("aria-expanded","false");
   await expect(page.locator(".sanctuary-dock-tools")).toBeHidden();
   await page.locator("#p2-dock-expand").evaluate(el=>el.click());
   await expect(page.locator(".sanctuary-dock-tools")).toBeVisible();
   await page.locator("#p2-dock-expand").evaluate(el=>el.click());
   await expect(page.locator(".sanctuary-dock-tools")).toBeHidden();
   const bounds=await page.evaluate(()=>{
    const h=document.getElementById("inicio").getBoundingClientRect();
    const l=document.getElementById("p2-lotus-focus").getBoundingClientRect();
    return {hero:h.toJSON(),lotus:l.toJSON(),viewport:innerWidth};
   });
   expect(bounds.lotus.width).toBeLessThanOrEqual(150);
   if(width<=375){
     const header=page.locator(".site-header");
     const rect=await header.boundingBox();
     expect(rect.height).toBeLessThanOrEqual(65);
     const menu=await page.locator(".site-header .menu-toggle").boundingBox();
     const brand=await page.locator(".site-header .brand-mark").boundingBox();
     expect(menu.y).toBeGreaterThanOrEqual(brand.y-9);
     expect(menu.y).toBeLessThanOrEqual(brand.y+9);
   }
   expect(bounds.lotus.x).toBeGreaterThanOrEqual(-1);
   expect(bounds.lotus.right).toBeLessThanOrEqual(width+1);
   expect(bounds.lotus.top).toBeGreaterThanOrEqual(bounds.hero.top-1);
   expect(bounds.lotus.bottom).toBeLessThanOrEqual(bounds.hero.bottom+1);
   await info.attach("p2-home-"+width+"-"+theme,{body:await page.screenshot({animations:"disabled"}),contentType:"image/png"});
   await studio.evaluate(el=>el.scrollIntoView({behavior:"instant",block:"start"}));
   await expect(page.locator("#flow-guide")).toBeVisible();
   await info.attach("p2-practice-"+width+"-"+theme,{body:await page.screenshot({animations:"disabled"}),contentType:"image/png"});
   await book.locator("#p2-asana-toggle").evaluate(el=>el.click());
   await expect(book.locator("#p2-asana-advanced")).not.toHaveAttribute("open",/./);
   await expect(book.locator("#p2-asana-advanced > summary")).toBeVisible();
   await expect(book.locator(".studio-library-stage")).toBeVisible();
   if(width<=375 && theme==="dark"){
    const colors=await book.locator(".studio-library-name").evaluate(el=>({
      actual:getComputedStyle(el).color,
      expected:getComputedStyle(document.documentElement).getPropertyValue("--ink").trim()
    }));
    const p=document.createElement("span");
    p.style.color=colors.expected;document.body.append(p);
    const resolved=getComputedStyle(p).color;p.remove();
    expect(colors.actual).toBe(resolved);
   }
   await expect(studio.locator(".studio-entrance")).toBeHidden();
   await expect(page.locator("#movement-stage")).toBeHidden();
   await book.evaluate(el=>el.scrollIntoView({behavior:"instant",block:"start"}));
   if(width<=375){
     const position=await page.evaluate(()=>{
       const stage=document.querySelector("#studio-asana-library .studio-library-stage");
       const choices=document.querySelector("#studio-asana-library .studio-library-choices");
       return {stage:stage.getBoundingClientRect().top,choices:choices.getBoundingClientRect().top};
     });
     expect(position.stage).toBeLessThan(position.choices);
   }
   await info.attach("p2-asanas-"+width+"-"+theme,{body:await page.screenshot({animations:"disabled"}),contentType:"image/png"});
   await book.locator("#p2-asana-toggle").evaluate(el=>el.click());
   await expect(page.locator("#movement-stage")).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   expect(await page.locator("audio").count()).toBe(1);
   expect(await page.locator("#focus-audio").evaluate(x=>x.paused)).toBe(true);
   expect(failures).toEqual([]);
  });
 }
}
test("P2 VISUAL · direct deep links, keyboard lotus and two languages",async({page},info)=>{
 await page.setViewportSize({width:390,height:844});
 await page.addInitScript(()=>{try{sessionStorage.setItem("gb-yoga-intro-seen","1")}catch{}});
 await page.goto("/#studio-asana-library",{waitUntil:"domcontentloaded"});
 await expect(page.locator("#p2-asana-toggle")).toHaveAttribute("aria-expanded","true");
 await expect(page.locator("#studio-asana-library .studio-library-stage")).toBeVisible();
 await page.locator('[data-set-lang="en"]').first().evaluate(x=>x.click());
 await expect(page.locator("#p2-asana-toggle")).toContainText("Return to");
 await page.locator("#p2-asana-toggle").evaluate(x=>x.click());
 const lotus=page.locator("#p2-lotus-focus");
 await lotus.focus();
 await page.keyboard.press("Enter");
 await expect(page.locator("#instructor-flow")).toHaveAttribute("data-studio-mode","breath");
 await expect(page.locator("#studio-guided")).toBeVisible();
 await expect(page.locator("#focus-audio")).toHaveJSProperty("paused",true);
 await info.attach("p2-breath-keyboard-en",{body:await page.screenshot({animations:"disabled"}),contentType:"image/png"});
});
