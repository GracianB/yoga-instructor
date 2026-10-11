import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V97 studio has a second real keyboard skip link in two languages",()=>{
const h=read("index.html"),js=read("studio-keyboard-v97.js"),css=read("studio-keyboard-v97.css"),build=read("tools/build.mjs");
assert.ok(h.includes('href="#instructor-flow" data-v97-skip'));
assert.ok(h.includes('id="instructor-flow"'));
assert.ok(js.includes("Skip to the practice studio")&&js.includes("Ir a la sala de práctica"));
for(const a of ["studio-keyboard-v97.js","studio-keyboard-v97.css"]){assert.ok(h.includes("./"+a));assert.ok(build.includes("'"+a+"'"))}
assert.ok(css.includes("focus-visible")&&css.includes("prefers-reduced-motion:reduce"));
});
test("V97 reordering preserves real keyboard focus and informative aria labels",()=>{
const s=read("movement-custom-ui-v94.js"),meditation=read("uma-focus-ritual-ui-v89.js");
for(const token of ['button.setAttribute("aria-label"','focusDirection?.focus({preventScroll:true})','words.step(i+1)'])assert.ok(s.includes(token),token);
assert.ok(meditation.includes('class="v89-message" tabindex="-1"'));
assert.ok(meditation.includes('querySelector(".v89-message").focus?.()'));
});
