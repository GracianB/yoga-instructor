import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";

// Keep historical Yoga PDFs byte-for-byte intact for repository compatibility.
// New public links must point to the canonical, current documents in GracianB/GracianB.
// Update a historical digest only if those archived bytes are intentionally revised.
const pdfs=Object.freeze([
 {path:"assets/CV_Gracian_Baena_Yoga_EN.pdf",sha256:"731f5bdb5b4042d25e4f38a26365e59b43a715f5a862a4f4344dc98f5b6b0316",bytes:207226},
 {path:"assets/CV_Gracian_Baena_Yoga_ES.pdf",sha256:"801391b5c29c90cd5e286935df2f3e5d07caa10241440931c9d48b63ca7198db",bytes:207257},
 {path:"Gracian_Baena_Cover_Letter_Yoga_EN.pdf",sha256:"0cd62e143a195b6229b6952c61c64351e7ca623185847968d245dabba43e545b",bytes:161268},
 {path:"Gracian_Baena_Carta_Yoga_ES.pdf",sha256:"5bfe678a6da6820ed98d2abcb9dd7b105cdb442802fef7fa83598392f2727e12",bytes:163153}
]);
const homepage=await readFile(new URL("../index.html",import.meta.url),"utf8");
const hub = "https://gracianb.github.io/GracianB/";
const canonical = {
  "assets/CV_Gracian_Baena_Yoga_EN.pdf": "Gracian_Baena_CV_Yoga_EN.pdf",
  "assets/CV_Gracian_Baena_Yoga_ES.pdf": "Gracian_Baena_CV_Yoga_ES.pdf",
  "Gracian_Baena_Cover_Letter_Yoga_EN.pdf": "Gracian_Baena_Cover_Letter_Yoga_EN.pdf",
  "Gracian_Baena_Carta_Yoga_ES.pdf": "Gracian_Baena_Carta_Yoga_ES.pdf"
};
for(const doc of pdfs){
 test("Historical Yoga PDF remains byte-for-byte verified: "+doc.path,async()=>{
  const data=await readFile(new URL("../"+doc.path,import.meta.url));
  assert.equal(data.length,doc.bytes,"Unexpected Yoga PDF size");
  assert.equal(data.subarray(0,5).toString("ascii"),"%PDF-");
  assert.equal(createHash("sha256").update(data).digest("hex"),doc.sha256);
  assert.ok(homepage.includes(hub+canonical[doc.path]),"Public homepage must link to the current document in the hub");
  assert.ok(!homepage.includes('"./'+doc.path+'"'),"Public homepage must not link to the historical duplicate");
 });
}
