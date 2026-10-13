/* P5 · Safe build-only grouping of deferred classic scripts.
 * The three eager bootstrap files remain untouched; authored module
 * order is preserved, without wrapping or scope rewriting individual files.
 */
import {createHash} from "node:crypto";
import {Script} from "node:vm";

const TAG=/<script\b[^>]*>\s*<\/script>/gi;
const SRC=/\bsrc="([^"]+)"/i;
const PATH=/^\.\/([a-z0-9][a-z0-9._-]*\.js)(?:\?[^"#]*)?$/i;
const EXPECT_EAGER=["runtime.js","boot.js","i18n.js"];
const MAX_BYTES=100_000;
const MAX_FILES=15;
const BANNED=/document\.currentScript|\bdocument\.write\s*\(|\bimport\s*\(|sourceMappingURL|sourceURL|\bnew Function\s*\(/;

function listScripts(html){
 const items=[],seen=new Set();
 for(const m of html.matchAll(TAG)){
  const tag=m[0],ref=tag.match(SRC)?.[1];
  if(!ref?.startsWith("./"))continue;
  const file=ref.match(PATH)?.[1];
  const defer=/\sdefer(?=>|\s)/i.test(tag);
  const literal=defer
   ?/^<script src="\.\/[a-z0-9][a-z0-9._-]*\.js(?:\?[^"#]*)?" defer><\/script>$/i
   :/^<script src="\.\/[a-z0-9][a-z0-9._-]*\.js(?:\?[^"#]*)?"><\/script>$/i;
  if(!file||!literal.test(tag))throw Error("P5: unsafe script tag "+tag);
  if(seen.has(file))throw Error("P5: duplicate script "+file);
  seen.add(file);items.push({tag,file,defer});
 }
 const eager=items.filter(x=>!x.defer).map(x=>x.file);
 if(JSON.stringify(eager)!==JSON.stringify(EXPECT_EAGER))
  throw Error("P5: bootstrap order changed: "+eager.join(","));
 if(items.filter(x=>x.defer).length<70)throw Error("P5: missing deferred script sources");
 if(items.some((x,i)=>x.defer&&i<3)||items.some((x,i)=>!x.defer&&i>=3))
  throw Error("P5: eager scripts must precede deferred chunks");
 return items;
}

async function compileDeferredScripts(html,readScript){
 const original=listScripts(html),deferred=original.filter(x=>x.defer);
 const entries=[];
 for(const {file} of deferred){
  const source=await readScript(file);
  if(!source?.trim())throw Error("P5: empty script "+file);
  if(BANNED.test(source))throw Error("P5: unsafe classic-script dependency in "+file);
  const bytes=Buffer.byteLength(source);
  if(bytes>MAX_BYTES)throw Error("P5: oversized individual script "+file);
  entries.push({file,source,bytes});
 }
 const groups=[];let batch=[],bytes=0;
 const flush=()=>{
  if(!batch.length)return;
  const code=batch.map(({file,source})=>"/* P5 source: "+file+" */\n"+source+"\n;\n").join("\n");
  // Validate the entire chunk as a CLASSIC script to detect lexical collisions.
  new Script(code,{filename:"yoga-p5-chunk-"+(groups.length+1)+".js"});
  const hash=createHash("sha256").update(code).digest("hex");
  groups.push({file:"yoga-scripts-v106-"+String(groups.length+1).padStart(2,"0")+"."+hash.slice(0,16)+".js",
   code,sha256:hash,sources:batch.map(x=>x.file),bytes:Buffer.byteLength(code)});
  batch=[];bytes=0;
 };
 for(const entry of entries){
  if(batch.length&&(batch.length>=MAX_FILES||bytes+entry.bytes>MAX_BYTES))flush();
  batch.push(entry);bytes+=entry.bytes;
 }
 flush();
 if(groups.length<2||groups.length>20)throw Error("P5: unexpected chunk count "+groups.length);
 const first=new Map();
 for(const chunk of groups)first.set(chunk.sources[0],chunk.file);
 const selected=new Set(deferred.map(x=>x.file));
 const changed=html.replace(TAG,tag=>{
  const source=tag.match(SRC)?.[1]?.match(PATH)?.[1];
  if(!selected.has(source))return tag;
  const chunk=first.get(source);
  return chunk?'<script src="./'+chunk+'" defer></script>':"";
 });
 const final=listScriptsForOutput(changed);
 if(final.length!==3+groups.length||final.slice(0,3).join()!==EXPECT_EAGER.join())
  throw Error("P5: production script inventory differs from expected chunks");
 return {html:changed,chunks:groups,sourceCount:deferred.length,productionCount:groups.length,
  requestsAvoided:deferred.length-groups.length,unchangedBoot:EXPECT_EAGER};
}

function listScriptsForOutput(html){
 return [...html.matchAll(TAG)].map(x=>x[0].match(SRC)?.[1]?.match(PATH)?.[1]).filter(Boolean);
}

export {listScripts,compileDeferredScripts,listScriptsForOutput,MAX_BYTES,MAX_FILES};
