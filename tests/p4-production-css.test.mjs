import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import postcss from "postcss";
import {compileProductionStyles,sourceSheets,sourceSheetsForOutput}
  from "../tools/p4-production-css.mjs";

const get=path=>readFile(new URL("../"+path,import.meta.url),"utf8");
const source=await get("index.html");
const links=sourceSheets(source);
const build=()=>compileProductionStyles(source,path=>get(path));

test("P4: 77 original sheets become one versioned request without changing cascade order",async()=>{
 const result=await build();
 assert.equal(links.length,78);
 assert.equal(result.sourceCount,78);
 assert.equal(sourceSheetsForOutput(result.html).length,1);
 assert.deepEqual(result.sources,links.map(x=>x.path));
 assert.ok(result.filename.startsWith("yoga-styles-v105."));
 assert.equal(createHash("sha256").update(result.css).digest("hex"),result.digest);
 assert.ok(result.filename.includes(result.digest.slice(0,16)));
 // Byte-for-byte reproduction of all 77 CSS modules in source order.
 const exact=(await Promise.all(links.map(async ({path})=>
   "/* P4 original: "+path+" */\n"+await get(path)+"\n"))).join("\n");
 assert.equal(result.css,exact);
 const tree=postcss.parse(result.css,{from:result.filename});
 assert.ok(tree.nodes.length>100);
 assert.equal(result.css.includes("@import"),false);
 assert.equal(result.css.includes("@charset"),false);
});

test("P4: build-only CSS optimization retains fonts, all deferred scripts and content",async()=>{
 const result=await build();
 const scripts=html=>[...html.matchAll(/<script\b[^>]*\bsrc="[^"]+"[^>]*>/g)].map(x=>x[0]);
 assert.deepEqual(scripts(result.html),scripts(source));
 assert.ok(result.html.includes("https://fonts.googleapis.com/css2"));
 assert.equal(result.html.replace('<link rel="stylesheet" href="./'+result.filename+'">',"")
   .replace(/\n\s*\n/g,"\n").includes("<body>"),true);
 assert.equal(result.html.match(/<link\b[^>]*rel="stylesheet"[^>]*>/g)?.length,2);
 assert.equal((result.html.match(/<script\b[^>]*\bsrc=/g)||[]).length,81);
 assert.ok(result.html.includes('id="studio-asana-library"')===source.includes('id="studio-asana-library"'));
});

test("P4: reject duplicate CSS, semantic media links and imports rather than silently reordering",async()=>{
 const original=links[0].tag;
 assert.throws(()=>sourceSheets(source.replace(original,original+original)),/duplicated CSS/);
 const media=original.replace(" href=", ' media="print" href=');
 assert.throws(()=>sourceSheets(source.replace(original,media)),/conditional CSS/);
 await assert.rejects(
   ()=>compileProductionStyles(source,async path=>path===links[0].path
     ?'@import url("./missing.css");':"body{color:red}"),
   /non-bundleable at-rule/);
 await assert.rejects(
   ()=>compileProductionStyles(source,async path=>path===links[0].path
     ?"":"body{color:red}"),/empty stylesheet/);
});
