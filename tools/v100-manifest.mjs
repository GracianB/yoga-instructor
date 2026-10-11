/* V100 · Deterministic content manifest of the exact Pages artifact.
 * No timestamps, local paths, personal data or build-machine identifiers. */
import {readdir,readFile,writeFile} from"node:fs/promises";
import {createHash} from"node:crypto";
import {join,relative,resolve,sep} from"node:path";
const NAME="release-manifest-v100.json";
const digest=data=>createHash("sha256").update(data).digest("hex");
async function enumerate(root,current=root){
 const output=[];
 for(const entry of await readdir(current,{withFileTypes:true})){
  const full=join(current,entry.name);
  if(entry.isDirectory())output.push(...await enumerate(root,full));
  else if(entry.isFile()&&entry.name!==NAME)output.push({
   name:relative(root,full).split(sep).join("/"),full
  });
 }
 return output;
}
export async function entries(directory){
 const root=resolve(directory);
 const files=(await enumerate(root)).sort((a,b)=>a.name.localeCompare(b.name,"en"));
 return Promise.all(files.map(async file=>{
 const contents=await readFile(file.full);
 return {path:file.name,bytes:contents.byteLength,sha256:digest(contents)};
 }));
}
export async function writeManifest(directory){
 const list=await entries(directory);
 if(!list.some(x=>x.path==="index.html")||!list.some(x=>x.path==="studio-render-policy-v96.js"))
 throw Error("V100 manifest: missing critical production files");
 const manifest={schema:"yoga-pages-manifest-v100",version:100,algorithm:"SHA-256",
  files:list,assets:list.length,totalBytes:list.reduce((sum,x)=>sum+x.bytes,0)};
 const result=JSON.stringify(manifest,null,2)+"\n";
 await writeFile(join(resolve(directory),NAME),result,"utf8");
 return {manifest,sha256:digest(Buffer.from(result))};
}
export async function verifyManifest(directory){
 const root=resolve(directory);
 const published=JSON.parse(await readFile(join(root,NAME),"utf8"));
 const actual=await entries(root);
 if(published.schema!=="yoga-pages-manifest-v100"||published.version!==100||
    JSON.stringify(actual)!==JSON.stringify(published.files)||
    actual.length!==published.assets||
    actual.reduce((sum,x)=>sum+x.bytes,0)!==published.totalBytes)
 throw Error("V100 manifest does not match production bytes");
 return {assets:actual.length,totalBytes:published.totalBytes};
}
