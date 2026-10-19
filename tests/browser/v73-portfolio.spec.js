const {test, expect} = require("@playwright/test");

test("V73: hiring-facing teaching portfolio precedes the studio", async ({page}) => {
  await page.goto("/");
  const portfolio = page.locator("#portfolio");
  await expect(portfolio).toBeVisible();
  await expect(portfolio.locator(".p73-proof-card")).toHaveCount(3);
  // P2: the interactive studio appears first. The portfolio is a concise,
  // separate professional section and remains directly reachable.
  const layout=await page.evaluate(()=>{
    const studio=document.getElementById("instructor-flow");
    const portfolio=document.getElementById("portfolio");
    return studio.nextElementSibling?.id==="p2-audio" &&
      document.getElementById("p2-extras").contains(document.getElementById("trayectoria")) &&
      !!(studio.compareDocumentPosition(portfolio) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(layout).toBe(true);
  await expect(page.locator('#nav a[href="#portfolio"]')).toHaveCount(1);
});

test("V73: keyboard tabs update offer, evidence and email context", async ({page}) => {
  await page.goto("/");
  const group = page.locator("#portfolio .p73-tablist");
  await expect(group.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
  await group.getByRole("tab", {name:"En sala"}).focus();
  await page.keyboard.press("ArrowRight");
  await expect(group.getByRole("tab", {name:"Individual"})).toHaveAttribute("aria-selected","true");
  await expect(page.locator("#portfolio-v73-offer")).toContainText("propia práctica");
  await expect(page.locator("#portfolio-v73-source")).toContainText("2019");
  await expect(page.locator("#portfolio-v73-contact")).toHaveAttribute("href",/subject=Consulta/);
  await page.keyboard.press("End");
  await expect(group.getByRole("tab", {name:"Equipos"})).toHaveAttribute("aria-selected","true");
  await expect(page.locator("#portfolio-v73-panel")).toHaveAttribute("aria-labelledby","portfolio-v73-tab-equipos");
  await expect(page.locator("#portfolio-v73-offer")).toContainText("corporativo");
  await expect(page.locator("#portfolio-v73-source")).toContainText("Majorel");
});

test("V73: ES/EN switch and mobile reading retain meaningful navigation", async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto("/");
  await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
  await expect(page.locator("#portfolio-v73-title")).toContainText("Teaching yoga means");
  await expect(page.locator("#portfolio .p73-tablist [role=tab]").first()).toContainText("Group classes");
  await page.locator("#portfolio .p73-tablist [data-v73-track=equipos]").evaluate(el=>el.click());
  await expect(page.locator("#portfolio-v73-offer")).toContainText("Workplace wellbeing");
  await expect(page.locator("#portfolio-v73-contact")).toHaveAttribute("href",/subject=Enquiry/);
  await expect(page.locator("#portfolio .p73-proof-card")).toHaveCount(3);
  const width = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  expect(width).toBe(true);
});
