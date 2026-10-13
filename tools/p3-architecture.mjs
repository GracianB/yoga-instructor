/* P3 · Fail-fast public dependency audit. The 75+ stylesheets are an
 * architectural debt, but collapsing them without preserving cascade order
 * would risk moving a guardian limb. Measure first, enforce budgets in CI. */
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, relative, sep } from "node:path";

const root=resolve(fileURLToPath(new URL("../",import.meta.url)));
const pages=["index.html","cv.html","404.html"];
const limits=Object.freeze({
  cssLinks:83,jsLinks:83,cssBytes:750_000,jsBytes:850_000
});
const eager=new Set(["runtime.js","boot.js","i18n.js"]);
const part=(tag,key)=>tag.match(new RegExp("\\b"+key+'="([^"]+)"'))?.[1]||null;
const own=(href)=>href?.startsWith("./")&&!href.startsWith("//")
  ?href.slice(2).split(/[?#]/,1)[0]:null;
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
   if(path.includes("../")||path.startsWith("/")){failures.push("Illegal local path: "+path);continue}
   resources.set(path,true);
  }
  if(name==="index.html")Object.assign(measure,{cssLinks:parsed.sheet.length,jsLinks:parsed.script.length});
  pagesReport.push({page:name,css:parsed.sheet.length,js:parsed.script.length});
 }
 measure.cssBytes=0;measure.jsBytes=0;
 for(const path of resources.keys()){
  try{
   const file=resolve(base,path);
   if(relative(base,file).startsWith(".."+sep))throw Error("Outside repository");
   const s=await stat(file);
   if(!s.isFile()||s.size===0)throw Error("Missing or empty");
   if(path.endsWith(".css"))measure.cssBytes+=s.size;
   if(path.endsWith(".js"))measure.jsBytes+=s.size;
  }catch(e){failures.push("Missing public file "+path+": "+e.message)}
 }
 // Only current initial-page references are used for quantity budgets.
 // Other HTML pages still receive full existence/duplicate/eagerness checks.
 for(const [key,limit] of Object.entries(limits)){
  if(measure[key]>limit)failures.push(key+": "+measure[key]+" exceeds budget "+limit);
 }
 const audit=Object.freeze({measure,limits,pages:pagesReport,failures});
 return audit;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 const result=await analyze();
 console.log("P3_RESOURCE_AUDIT "+JSON.stringify(result));
 if(result.failures.length)process.exitCode=1;
}
export {analyze,collect,limits};
