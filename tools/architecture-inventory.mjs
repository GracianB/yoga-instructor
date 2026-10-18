/* Deterministic inventory of public entrypoint dependencies. Read-only. */
import {readFile,writeFile,mkdir,stat} from "node:fs/promises";
import {resolve,dirname,relative} from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {createHash} from "node:crypto";
import {collect} from "./p3-architecture.mjs";
const root=resolve(fileURLToPath(new URL("../",import.meta.url)));
const pages=["index.html","cv.html","404.html"];
const hash=s=>createHash("sha256").update(s).digest("hex");
export async function inventory(base=root){
 const entries=[],files=new Map();
 for(const page of pages){
  const html=await readFile(resolve(base,page),"utf8");
  const refs=collect(html);
  const scripts=refs.script.map((x,index)=>({path:x.path,index,deferred:/\\sdefer(?:\\s|>|$)/.test(x.tag),module:/\\stype="module"/.test(x.tag)}));
  const styles=refs.sheet.map((x,index)=>({path:x.path,index}));
  entries.push({page,scripts,styles});
  for(const path of [...new Set([...refs.href,...scripts.map(x=>x.path),...styles.map(x=>x.path)])]){
   if(!path||path.split("/").includes("..")||path.includes("\\")||path.startsWith("/"))continue;
   const location=resolve(base,path);
   if(relative(base,location).startsWith(".."))continue;
   let item=files.get(path);
   if(!item){
    try{const content=await readFile(location);item={path,bytes:content.byteLength,sha256:hash(content),kind:path.endsWith(".js")?"script":path.endsWith(".css")?"style":"asset",usedBy:[]}}
    catch{item={path,missing:true,usedBy:[]}}
    files.set(path,item);
   }
   if(!item.usedBy.includes(page))item.usedBy.push(page);
  }
 }
 const assets=[...files.values()].sort((a,b)=>a.path.localeCompare(b.path));
 const totalBytes=assets.reduce((sum,f)=>sum+(f.bytes||0),0);
 return {schema:1,entries,assets,summary:{uniqueAssets:assets.length,totalBytes,missing:assets.filter(x=>x.missing).map(x=>x.path)}};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 const report=await inventory();
 const json=JSON.stringify(report,null,2)+"\\n";
 if(process.argv.includes("--write")){
  const output=resolve(root,"artifacts/architecture-inventory.json");
  await mkdir(dirname(output),{recursive:true});await writeFile(output,json);
  console.log("Wrote "+output);
 }else console.log(json);
 if(report.summary.missing.length)process.exitCode=1;
}
