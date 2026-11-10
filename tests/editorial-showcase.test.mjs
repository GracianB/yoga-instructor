import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const i18n=readFileSync(new URL("../i18n.js",import.meta.url),"utf8");
const readme=readFileSync(new URL("../README.md",import.meta.url),"utf8");

test("Yoga public showcase does not promise direct booking",()=>{
  assert.doesNotMatch(html,/Reserva una clase|Plan a class/);
  assert.match(html,/Hablemos de una clase/);
  assert.match(html,/Discuss a class/);
  assert.match(readme,/editable email/);
});
test("Yoga working languages are specific and localized",()=>{
  assert.match(html,/ES · EN · IT/);
  assert.match(i18n,/stat4:\s*"idiomas de trabajo"/);
  assert.match(i18n,/stat4:\s*"working languages"/);
});
test("GitHub README is an English visitor storefront",()=>{
  assert.match(readme,/Presence · Breath · Movement · Teaching/);
  assert.match(readme,/Mood Fitness/);
  assert.match(readme,/Professional Deck/);
  assert.match(readme,/Systems Lab/);
  assert.doesNotMatch(readme,/Versión pública|npm run quality|Workflow V[0-9]/);
});
