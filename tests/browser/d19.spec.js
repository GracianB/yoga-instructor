const {test,expect}=require("@playwright/test");

test("D19: breathing and meditation reuse real D17 closed-eyed SVG poses",async({page})=>{
  await page.goto("/");
  const dragon=page.locator("#flow-guide");
  await expect(dragon).toHaveAttribute("data-ready","true",{timeout:12000});
  const companion=page.locator(".studio-companion");
  await expect(companion).toHaveCount(1);
  await expect(companion).toBeHidden();
  await expect(companion.locator(".yy-pose")).toHaveCount(2);
  await page.locator('button[data-studio-mode="breath"]').click();
  await expect(companion).toBeVisible();
  await expect(companion.locator('.yy-pose.is-current')).toHaveAttribute("data-pose","breath");
  await expect(companion.locator('.yy-pose.is-current .yy-d17-attachment')).toHaveCount(4);
  await expect(companion.locator('.yy-pose.is-current .yy-eye-closed')).toHaveCount(2);
  await expect(companion.locator('.yy-pose.is-current .yy-d12-unicorn-core')).toHaveCount(1);
  expect(await page.evaluate(()=>{
    const ids=[...document.querySelectorAll("[id]")].map(x=>x.id);
    return ids.length === new Set(ids).size;
  })).toBe(true);
  await page.locator('button[data-studio-mode="meditation"]').click();
  await expect(companion.locator('.yy-pose.is-current')).toHaveAttribute("data-pose","centering");
  await expect(page.locator("#studio-guided")).toHaveAttribute("data-studio-active","meditation");
  await page.locator('[data-studio-action="primary"]').click();
  await expect(companion).toHaveAttribute("data-status","running");
  await page.locator('[data-studio-action="primary"]').click();
  await expect(companion).toHaveAttribute("data-status","paused");
  await page.locator('[data-studio-action="reset"]').click();
  await expect(companion).toHaveAttribute("data-status","idle");
  await page.locator('button[data-studio-mode="asanas"]').click();
  await expect(companion).toBeHidden();
  await expect(dragon).toHaveAttribute("data-ready","true");
});

test("D19: Yin/Yang preference carries to guided mode, reduced motion stays static",async({page})=>{
  await page.setViewportSize({width:320,height:760});
  await page.goto("/");
  const guide=page.locator("#flow-guide");
  await expect(guide).toHaveAttribute("data-ready","true",{timeout:12000});
  await guide.locator('[data-yy-form="yin"]').click();
  await page.locator('button[data-studio-mode="meditation"]').click();
  const companion=page.locator(".studio-companion");
  await expect(companion).toHaveAttribute("data-spirit","yin");
  await page.locator('[data-studio-action="primary"]').click();
  await expect(companion).toHaveAttribute("data-status","running");
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(companion.locator(".yy-pose.is-current .yy-character")).toHaveCSS("animation-name","none");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
