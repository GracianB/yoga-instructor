import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("index.html"),publicCss=read("yoga-public-final.css"),legacyCss=read("styles.css"),nav=read("p2-navigation.js");

test("One final public method slide, not another yoga application",()=>{
 assert.equal((html.match(/id="metodo"/g)||[]).length,1);
 const slide=html.split('id="metodo"')[1].split('<!-- LANGUAGES + CONTACT -->')[0];
 assert.equal((slide.match(/data-method-tab="/g)||[]).length,3);
 assert.equal((slide.match(/data-method-panel="/g)||[]).length,3);
 assert.match(slide,/data-method-tab="presence"/);
 assert.match(slide,/data-method-tab="breath"/);
 assert.match(slide,/data-method-tab="move"/);
 assert.match(slide,/aria-selected="true"/);
 assert.match(slide,/yoga-method-visual/);
 assert.doesNotMatch(slide,/instructor-flow|studio-asana-library|yoga-app|asana-book/i);
 assert.match(html,/href="#metodo"/);
 assert.match(html,/id="experiencia"[\s\S]*?href="#metodo"/);
 assert.match(publicCss,/section:not\(#inicio\):not\(#explora\):not\(#proyectos\):not\(#experiencia\):not\(#metodo\):not\(#contacto\)/);
 assert.match(legacyCss,/section:not\(#inicio\):not\(#explora\):not\(#proyectos\):not\(#experiencia\):not\(#metodo\):not\(#contacto\)/);
});

test("Method tabs are accessible by click, arrows, Home and End without a new JS payload",()=>{
 assert.match(nav,/const chapters=new Set\(\["proyectos","experiencia","metodo","contacto"\]\)/);
 assert.match(nav,/setAttribute\("aria-selected",String\(active\)\)/);
 assert.match(nav,/tabs\[i\]\.tabIndex=active\?0:-1/);
 assert.match(nav,/panel\.hidden=panel\.dataset\.methodPanel!==state/);
 for(const name of ["ArrowRight","ArrowLeft","ArrowDown","ArrowUp","Home","End"])assert.ok(nav.includes(name),name);
 assert.match(html,/role="tablist"/);
 assert.equal((html.match(/role="tabpanel"/g)||[]).length,3);
 assert.match(html,/aria-controls="method-panel-move"/);
 assert.match(html,/aria-labelledby="method-tab-breath"/);
});

test("Slide animates gently in both themes but respects reduced motion",()=>{
 assert.match(publicCss,/html\[data-theme="dark"\] #metodo/);
 assert.match(publicCss,/@keyframes yogaMethodOrbit/);
 assert.match(publicCss,/@keyframes yogaMethodPulse/);
 assert.match(publicCss,/@media\(max-width:800px\)/);
 assert.match(publicCss,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(publicCss,/body\.quiet-mode #metodo/);
 assert.doesNotMatch(publicCss,/text-shadow:.*#ff0000/);
});
