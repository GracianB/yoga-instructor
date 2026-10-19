import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

test("Cat-Cow resumes animation and ignores stale pose-ready events from previous scenes",()=>{
 const handlers=new Map();
 const events=(name,fn)=>handlers.set(name,fn);
 const attrs={};
 const node=()=>({
  textContent:"",
  setAttribute(k,v){this[k]=v},
  getAttribute(k){return this[k]||null},
  removeAttribute(k){delete this[k]}
 });
 const back=node(),spine=node(),belly=node(),label=node();
 const root={
  dataset:{phase:"start",status:"idle",ready:"true"},
  style:{setProperty(){}},
  querySelector(selector){
   if(selector==="[data-asana-back]")return back;
   if(selector==="[data-asana-spine]")return spine;
   if(selector==="[data-asana-belly]")return belly;
   if(selector===".yy-asana-step")return label;
   return null;
  }
 };
 let now=1000,raf=null,rafId=0;
 const window={
  YOGA_RUNTIME:{
   mediaMatches:()=>false,
   frame:callback=>{raf=callback;return ++rafId},
   cancel:()=>{}
  },
  YIN_YANG_ART:{},
  addEventListener:events,
  matchMedia:()=>({addEventListener(){}})
 };
 const document={
  hidden:false,
  body:{classList:{contains:()=>false}},
  documentElement:{lang:"es"},
  getElementById:key=>key==="flow-guide"?root:null,
  addEventListener(){}
 };
 class MutationObserver{observe(){}}
 const source=readFileSync(new URL("../yy-asana-motion.js",import.meta.url),"utf8");
 runInNewContext(source,{
  window,document,MutationObserver,
  performance:{now:()=>now},
  setTimeout:()=>1,clearTimeout:()=>{}
 },{timeout:2000});
 const emit=(name,detail)=>{const fn=handlers.get(name);assert.equal(typeof fn,"function");fn({detail})};
 root.dataset.phase="warmup";
 emit("yoga:flow",{phase:"warmup",status:"running"});
 assert.equal(root.dataset.asanaState,"running");
 assert.equal(typeof raf,"function");
 now=1200;raf(now);
 const animated=back.getAttribute("d");
 assert.ok(animated?.includes("Q0 "));
 emit("yoga:flow",{phase:"warmup",status:"paused"});
 assert.equal(root.dataset.asanaState,"paused");
 const frozen=back.getAttribute("d");
 assert.equal(frozen,animated);
 emit("yoga:pose-ready",{phase:"start",ok:false});
 assert.equal(root.dataset.asanaState,"paused","Stale pose event must not change pause state");
 emit("yoga:flow",{phase:"warmup",status:"running"});
 assert.equal(root.dataset.asanaState,"running");
 assert.notEqual(back.getAttribute("d"),frozen,"Resume should paint a fresh phase");
 const resumed=back.getAttribute("d");
 emit("yoga:pose-ready",{phase:"start",ok:false});
 assert.equal(root.dataset.asanaState,"running","Old scene cannot disable current motion");
 now=1400;raf(now);
 assert.notEqual(back.getAttribute("d"),resumed,"Current scene keeps animating");
});
