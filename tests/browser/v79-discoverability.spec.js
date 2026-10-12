const{test,expect}=require("@playwright/test");
test("V79 visible answers match structured metadata without hidden SEO text",async({page})=>{
 await page.goto("/");const root=page.locator("#preguntas");
 await expect(root.locator("details")).toHaveCount(6);
 await root.locator('details[data-v79-faq="privacy"] summary').evaluate(el=>el.click());
 await expect(root.locator('details[data-v79-faq="privacy"]')).toHaveAttribute("open","");
 const parsed=JSON.parse(await page.locator("#v79-faq-schema").textContent());
 expect(parsed["@type"]).toBe("FAQPage");expect(parsed.mainEntity).toHaveLength(6);
 const visible=await root.locator('details[data-v79-faq="privacy"] p').textContent();
 expect(parsed.mainEntity.some(q=>q.acceptedAnswer.text===visible)).toBe(true);
});
test("V79 ES/EN metadata and FAQs change without collapsing answers",async({page})=>{
 await page.goto("/");const root=page.locator("#preguntas");
 await root.locator('details[data-v79-faq="levels"] summary').evaluate(el=>el.click());
 await page.locator('[data-set-lang="en"]').first().evaluate(el=>el.click());
 await expect(root.locator("#v79-title")).toContainText("Good questions");
 await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content","en_GB");
 await expect(page.locator('meta[name="description"]')).toHaveAttribute("content",/Murcia, Spain/);
 await expect(root.locator('details[data-v79-faq="levels"]')).toHaveAttribute("open","");
 const schema=JSON.parse(await page.locator("#v79-faq-schema").textContent());
 expect(schema.inLanguage).toBe("en");expect(schema.mainEntity).toHaveLength(6);
});
