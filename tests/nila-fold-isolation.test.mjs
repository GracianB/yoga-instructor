import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {createRequire} from "node:module";

const require=createRequire(import.meta.url);
const library=require("../asana-library.js");
const code=readFileSync(new URL("../movement-guardian-v37.js",import.meta.url),"utf8");
const fakeSvg={querySelector:()=>null};
const root={dataset:{},querySelector:key=>key==="svg.yy-svg"?fakeSvg:null};
const window={YIN_YANG_ART:{poses:[]}};
runInNewContext(code,{window,document:{getElementById:key=>key==="flow-guide"?root:null}});
const draw=window.YOGA_MOVEMENT_GUARDIAN.drawPose;

test("standing and seated forward folds keep separate authored torso rigs",()=>{
 const standing=library.byId("v68-forward-fold");
 const seated=library.byId("v68-seated-fold");
 assert.equal(standing.kind,"fold");
 assert.equal(seated.kind,"fold");
 const standingArt=draw(standing);
 const seatedArt=draw(seated);
 const body=html=>html.match(/<path class="mg-body" d="([^"]+)"/)?.[1];
 assert.ok(body(standingArt)?.startsWith("M342 294 C326 277"));
 assert.ok(body(seatedArt)?.startsWith("M"));
 assert.notEqual(body(standingArt),body(seatedArt),"No shared standing torso on seated fold");
 assert.doesNotMatch(seatedArt,/<g class="mg-head mg-head-fold"/);
 assert.match(standingArt,/<g class="mg-head mg-head-fold"/);
 assert.match(seatedArt,/class="mg-torso"[^>]*rotate\(-33(?:\.0)? 353(?:\.0)? 291(?:\.0)?\)/);
 assert.match(standingArt,/class="mg-torso"[^>]*rotate\(0(?:\.0)? 366(?:\.0)? 236(?:\.0)?\)/);
 for(const html of [standingArt,seatedArt]){
  assert.equal((html.match(/data-contact="(?:hand|foot)-[01]"/g)||[]).length,4);
  assert.doesNotMatch(html,/NaN|Infinity/);
 }
});
