/* Read-only static map of legacy runtime coupling. Heuristic, not an AST proof. */
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import {pathToFileURL,fileURLToPath} from "node:url";
import {inventory} from "./architecture-inventory.mjs";
const root=fileURLToPath(new URL("../",import.meta.url));
const patterns=[
 ["globalRead",/\b(?:window|globalThis)\.([A-Za-z_$][\w$]*)/g],
 ["domId",/\bgetElementById\(\s*["']([^"']+)["']\s*\)/g],
 ["eventEmit",/\bdispatchEvent\(\s*new\s+(?:CustomEvent|Event)\(\s*["']([^"']+)["']/g],
 ["eventListen",/\baddEventListener\(\s*["']([^"']+)["']/g]
];
export function references(source){
 const result={};
 for(const [kind,re] of patterns){
  const values=new Set();
  for(const m of source.matchAll(re))values.add(m[1]);
  result[kind]=[...values].sort();
 }
 return result;
}
export async function coupling(base=root){
 const inv=await inventory(base);
 const modules=[];
 for(const asset of inv.assets.filter(x=>x.kind==="script"&&!x.missing)){
  const source=await readFile(resolve(base,asset.path),"utf8");
  modules.push({path:asset.path,bytes:asset.bytes,...references(source)});
 }
 const owners=new Map();
 for(const m of modules)for(const id of m.eventEmit){
  if(!owners.has(id))owners.set(id,[]);
  owners.get(id).push(m.path);
 }
 const eventEdges=[];
 for(const m of modules)for(const id of m.eventListen){
  for(const source of owners.get(id)||[])if(source!==m.path)eventEdges.push({from:source,to:m.path,event:id});
 }
 return {schema:1,notice:"Heuristic literal-reference inventory; dynamic access and closures are not resolved",modules,events:eventEdges.sort((a,b)=>a.event.localeCompare(b.event)||a.from.localeCompare(b.from)||a.to.localeCompare(b.to)),summary:{modules:modules.length,events:eventEdges.length,globalReferences:modules.reduce((n,m)=>n+m.globalRead.length,0)}};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 const report=await coupling();console.log(JSON.stringify(report,null,2));
}
