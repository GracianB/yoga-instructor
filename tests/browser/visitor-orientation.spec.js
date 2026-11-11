const {test,expect}=require("@playwright/test");
const open=async(page,width=390,path="/index.html")=>{
  await page.setViewportSize({width,height:844});
  await page.addInitScript(()=>{try{sessionStorage.setItem("gb-yoga-intro-seen","1")}catch{}});
  // The test server intentionally routes / to a *retired studio fixture*.
  // This public journey must run against the real site, not that fixture.
  await page.goto(path,{waitUntil:"domcontentloaded"});
  await expect(page.locator("#guia")).toBeVisible();
};
for(const [choice,service,width] of [["individual","individual",320],["online","online",390],["equipos","equipos",768]]){
  test("Visitor orientation selects "+service+" without saving data at "+width+"px",async({page})=>{
    const errors=[];page.on("pageerror",e=>errors.push(e.message));
    await open(page,width);
    const guide=page.locator("#guia");
    const button=guide.locator('[data-match-choice="'+choice+'"]');
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed","true");
    await expect(guide.locator('[data-match-answer="'+service+'"]')).toBeVisible();
    await expect(guide.locator('[data-match-result]')).toBeVisible();
    await guide.locator("[data-match-enquire]").click();
    await expect(page.locator('#v76-form input[name="v76-service"][value="'+service+'"]')).toBeChecked();
    await expect(page).toHaveURL(/#contacto$/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
test("Practice orientation and FAQ translate and work by keyboard",async({page})=>{
  await open(page,390);
  await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
  await expect(page.locator("html")).toHaveAttribute("lang","en");
  await expect(page.locator('#guia h3 [data-p2-lang="en"]')).toBeVisible();
  const choice=page.locator('[data-match-choice="sala"]');
  await choice.focus();await page.keyboard.press("Enter");
  await expect(choice).toHaveAttribute("aria-pressed","true");
  await expect(page.locator('[data-match-answer="sala"] [data-p2-lang="en"]')).toBeVisible();
  const faq=page.locator("#dudas details").first();
  await faq.locator("summary").focus();await page.keyboard.press("Enter");
  await expect(faq).toHaveAttribute("open","");
  await expect(faq.locator('p [data-p2-lang="en"]')).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(faq).not.toHaveAttribute("open","");
});

test("Production Pages bundle includes usable visitor guidance and honest enquiry",async({page})=>{
  await open(page,390,"/dist/index.html");
  await expect(page.locator("#dudas")).toBeVisible();
  await expect(page.locator("#dudas details")).toHaveCount(5);
  const buttons=page.locator("#guia [data-match-choice]");
  await expect(buttons).toHaveCount(4);
  await buttons.nth(0).click();
  await expect(page.locator('#guia [data-match-answer="individual"]')).toBeVisible();
  await page.locator("#guia [data-match-enquire]").click();
  await expect(page.locator('#v76-form input[name="v76-service"][value="individual"]')).toBeChecked();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
