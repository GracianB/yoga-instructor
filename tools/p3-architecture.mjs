/* P3 · Validate local dependencies without arbitrary count or byte ceilings.
 * Resource sizes are reported for optimization, not used to block new features.
 * Missing, duplicate, invalid or unexpectedly eager assets remain fatal. */
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, relative, sep } from "node:path";

const root=resolve(fileURLToPath(new URL("../",import.meta.url)));
const pages=["index.html","cv.html","404.html"];
const metrics=Object.freeze(["cssLinks","jsLinks","cssBytes","jsBytes"]);
const eager=new Set(["runtime.js","boot.js","i18n.js"]);
const part=(tag,key)=>tag.match(new RegExp("\\b"+key+'="([^"]+)"'))?.[1]||null;
const own=(href)=>{
 if(!href?.startsWith("./")||href.startsWith("//"))return null;
 const raw=href.slice(2).split(/[?#]/,1)[0];
 try{return decodeURIComponent(raw)}catch{return raw}
};
function collect(html){
 const sheet=[...html.matchAll(/<link\b[^>]*>/gi)].map(x=>x[0])
  .filter(x=>/\brel="stylesheet"/.test(x))
  .map(tag=>({tag,path:own(part(tag,"href"))})).filter(x=>x.path?.endsWith(".css"));
 const script=[...html.matchAll(/<script\b[^>]*>/gi)].map(x=>x[0])
  .map(tag=>({tag,path:own(part(tag,"src"))})).filter(x=>x.path?.endsWith(".js"));
 const href=[...html.matchAll(/\b(?:href|src)="(\.\/[^"]+)"/g)]
  .map(x=>own(x[1])).filter(Boolean);
 return {sheet,script,href};
}
async function analyze(base=root){
 const failures=[],measure={},resources=new Map(),pagesReport=[];
 for(const name of pages){
  const html=await readFile(resolve(base,name),"utf8");
  const parsed=collect(html);
  const all=[...parsed.sheet,...parsed.script];
  const duplicates=all.map(x=>x.path).filter((path,i,a)=>a.indexOf(path)!==i);
  if(duplicates.length)failures.push(name+": duplicate runtime references "+[...new Set(duplicates)].join(", "));
  for(const item of parsed.script)if(!eager.has(item.path)&&
    !/\sdefer(?:\s|>|$)|\stype="module"/.test(item.tag))
      failures.push(name+": unexpected eager JavaScript "+item.path);
  for(const path of parsed.href){
   if(path.split("/").includes("..")||path.startsWith("/")||path.includes("\\")||path.includes("\0")){failures.push("Illegal local path: "+path);continue}
   resources.set(path,true);
  }
  if(name==="index.html")Object.assign(measure,{cssLinks:parsed.sheet.length,jsLinks:parsed.script.length});
  pagesReport.push({page:name,css:parsed.sheet.length,js:parsed.script.length});
 }
 measure.cssBytes=0;measure.jsBytes=0;
 for(const path of resources.keys()){
  try{
   const file=resolve(base,path);
   if(relative(base,file)===".."||relative(base,file).startsWith(".."+sep))throw Error("Outside repository");
   const s=await stat(file);
   if(!s.isFile()||s.size===0)throw Error("Missing or empty");
   if(path.endsWith(".css"))measure.cssBytes+=s.size;
   if(path.endsWith(".js"))measure.jsBytes+=s.size;
  }catch(e){failures.push("Missing public file "+path+": "+e.message)}
 }
 // Counts and byte sizes are telemetry, never feature ceilings.
 const audit=Object.freeze({measure,metrics,pages:pagesReport,failures});
 return audit;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 const result=await analyze();
 console.log("P3_RESOURCE_AUDIT "+JSON.stringify(result));
 if(result.failures.length)process.exitCode=1;
}
export {analyze,collect,metrics};
