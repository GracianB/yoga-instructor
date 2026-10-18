import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {runInNewContext} from "node:vm";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const rig=require("../articulated-rig.js");
const solver=require("../rig-constraints.js");
const motion=require("../rig-motion.js");

class Element {
 constructor(tag="div"){this.tagName=tag;this.children=[];this.attributes={};this.style={};this.handlers={};this.textContent="";this.value="0";this.checked=false}
 append(node){this.children.push(node);return node}
 insertBefore(node,before){const i=this.children.indexOf(before);this.children.splice(i<0?this.children.length:i,0,node);return node}
 setAttribute(key,value){this.attributes[key]=String(value)}
 getAttribute(key){return this.attributes[key]}
 addEventListener(type,callback){this.handlers[type]=callback}
 fire(type){assert.equal(typeof this.handlers[type],"function",this.tagName+"."+type);this.handlers[type]()}
}
test("anatomy laboratory renders real SVG nodes and readable angles without a browser",async()=>{
 const ids=["stage","progress","status","stand","fold","play","reverse","overlay","compare","value","knee-left","knee-right","hip-left","torso-angle"];
 const nodes=Object.fromEntries(ids.map(id=>[id,new Element(id)]));
 nodes.overlay.checked=true;
 const requested=[],canceled=[];
 const document={getElementById:id=>nodes[id],createElementNS:(_ns,tag)=>new Element(tag)};
 const context={window:{YOGA_ARTICULATED_RIG:rig,YOGA_RIG_CONSTRAINTS:solver,YOGA_RIG_MOTION:motion},document,
  requestAnimationFrame:cb=>{requested.push(cb);return requested.length},cancelAnimationFrame:id=>canceled.push(id)};
 const source=await readFile(new URL("../anatomy-lab.js",import.meta.url),"utf8");
 runInNewContext(source,context,{timeout:5000});
 assert.equal(nodes.stage.children.filter(n=>n.tagName==="line").length,rig.links.length*3);
 assert.ok(nodes.stage.children.filter(n=>n.tagName==="circle").length>=rig.names.length);
 assert.match(nodes["knee-left"].textContent,/°$/);
 assert.match(nodes.status.textContent,/Error máximo/);
 nodes.progress.value="50";nodes.progress.fire("input");
 assert.equal(nodes.value.textContent,"50%");
 assert.match(nodes["torso-angle"].textContent,/°$/);
 nodes.overlay.checked=false;nodes.overlay.fire("change");
 assert.ok(nodes.stage.children.filter(n=>n.tagName==="circle").some(n=>n.style.display==="none"));
 nodes.compare.checked=true;nodes.compare.fire("change");
 assert.ok(nodes.stage.children.some(n=>n.attributes.class==="reference"&&n.style.display===""));
 nodes.play.fire("click");assert.equal(nodes.play.getAttribute("aria-pressed"),"true");
 assert.ok(requested.length>0);
 requested[0](100);if(requested.length>1)requested[1](135);
 nodes.progress.value="70";nodes.progress.fire("input");
 assert.equal(nodes.play.getAttribute("aria-pressed"),"false");
 assert.ok(canceled.length>0);
 nodes.fold.fire("click");assert.equal(nodes.value.textContent,"100%");
 nodes.stand.fire("click");assert.equal(nodes.value.textContent,"0%");
});
