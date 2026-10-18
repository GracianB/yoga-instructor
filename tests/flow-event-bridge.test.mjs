import test from "node:test";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const bridge=require("../flow-event-bridge.js");
const engine=require("../flow-engine.js");
test("flow bridge returns identical snapshot without browser DOM",()=>{
 const snapshot=Object.freeze({phase:"start",status:"running"});
 assert.equal(bridge.dispatch(snapshot),snapshot);
});
test("legacy flow API transitions unchanged with event bridge",()=>{
 const flow=engine.create();
 const started=flow.start();
 assert.equal(started.phase,"start");
 assert.equal(started.status,"running");
 assert.equal(flow.pause().status,"paused");
 assert.equal(flow.resume().status,"running");
 assert.equal(flow.next().index,1);
});
