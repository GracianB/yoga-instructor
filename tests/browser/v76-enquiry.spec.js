const {test, expect}=require("@playwright/test");

test("V76: enquiry creates a contextual email without submitting data",async({page})=>{
 await page.goto("/");
 const root=page.locator("#v76-enquiry");
 await expect(root).toBeVisible();
 await expect(root.locator("#v76-results")).toBeHidden();
 await root.locator('input[name="v76-service"][value="equipos"]').check();
 await root.locator("#v76-format").selectOption("empresa");
 await root.locator("#v76-focus").selectOption("equipo");
 await root.locator("#v76-size").selectOption("medium");
 await root.locator("#v76-details").fill("Viernes por la tarde, 12 participantes.");
 await root.locator("#v76-compose").click();
 await expect(root.locator("#v76-results")).toBeVisible();
 const text=await root.locator("#v76-preview").inputValue();
 expect(text).toContain("Bienestar para equipos");
 expect(text).toContain("Viernes por la tarde, 12 participantes.");
 const href=await root.locator("#v76-mail").getAttribute("href");
 expect(href).toMatch(/^mailto:gracianbaenagonzalez@gmail\.com\?subject=/);
 expect(decodeURIComponent(href)).toContain("Viernes por la tarde, 12 participantes.");
});

test("V76: edited preview overrides generated body and reset erases values",async({page})=>{
 await page.goto("/");
 const root=page.locator("#v76-enquiry");
 await root.locator("#v76-compose").click();
 await root.locator("#v76-preview").fill("Texto propio y revisado.");
 const href=await root.locator("#v76-mail").getAttribute("href");
 expect(decodeURIComponent(href)).toContain("Texto propio y revisado.");
 await root.locator("#v76-reset").click();
 await expect(root.locator("#v76-results")).toBeHidden();
 await expect(root.locator("#v76-details")).toHaveValue("");
 await expect(root.locator('input[name="v76-service"][value="sala"]')).toBeChecked();
});

test("V76: language change keeps selected options and translates the new mail",async({page})=>{
 await page.goto("/");
 const root=page.locator("#v76-enquiry");
 // Keep the earlier end-to-end test for real pointer selection;
 // this translation test isolates the radio change event from page scrolling.
 await root.locator('input[name="v76-service"][value="individual"]').evaluate(input=>input.click());
 await root.locator("#v76-focus").selectOption("movilidad");
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(root.locator("#v76-title")).toContainText("Tell me what you need");
 await expect(root.locator('input[name="v76-service"][value="individual"]')).toBeChecked();
 await root.locator("#v76-compose").click();
 await expect(root.locator("#v76-preview")).toHaveValue(/One-to-one/);
 await expect(root.locator("#v76-preview")).toHaveValue(/Movement and mobility/);
 await expect(root.locator("#v76-mail")).toHaveAttribute("href",/subject=Enquiry/);
});

test("V76: form and its email preview work on a 375px screen and without motion",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.setViewportSize({width:375,height:812});
 await page.goto("/");
 const root=page.locator("#v76-enquiry");
 await root.locator("#v76-details").fill("Consulta de yoga.");
 await root.locator("#v76-compose").click();
 await expect(root.locator("#v76-results")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 const transition=await root.locator(".v76-service").first().evaluate(el=>getComputedStyle(el).transitionDuration);
 expect(transition).toBe("0s");
});
