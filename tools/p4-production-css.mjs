/* P4 · Build-time CSS request consolidation.
 * The source stays modular; production combines sheets in their EXACT cascade
 * order. All sheets and the output live in the same directory, so url(#ids),
 * relative URLs and data: SVG references keep their original base path.
 */
import {createHash} from "node:crypto";

const LINK=/<link\b[^>]*>/gi;
const STYLESHEET=/\brel="stylesheet"/i;
const HREF=/\bhref="([^"]+)"/i;
const LOCAL=/^\.\/([a-z0-9][a-z0-9._-]*\.css)(?:\?[^"#]*)?$/i;
const PLAIN=/^<link\s+rel="stylesheet"\s+href="\.\/[a-z0-9][a-z0-9._-]*\.css(?:\?[^"#]*)?"\s*\/?>$/i;

function sourceSheets(html){
  const sheets=[],seen=new Set();
  for(const match of html.matchAll(LINK)){
    const tag=match[0],href=tag.match(HREF)?.[1];
    if(!STYLESHEET.test(tag)||!href?.startsWith("./"))continue;
    const path=href.match(LOCAL)?.[1];
    if(!path||!PLAIN.test(tag))throw Error("P4: unsafe or conditional CSS link: "+tag);
    if(seen.has(path))throw Error("P4: duplicated CSS source "+path);
    seen.add(path);
    sheets.push({tag,path});
  }
  if(sheets.length<70)throw Error("P4: missing baseline stylesheets; refusing incomplete cascade");
  return sheets;
}

async function compileProductionStyles(html,readStylesheet){
  const sheets=sourceSheets(html),fragments=[];
  for(const {path} of sheets){
    const css=await readStylesheet(path);
    if(!css?.trim())throw Error("P4: empty stylesheet "+path);
    // These at-rules can behave differently when moved away from the top
    // of a standalone file. Reject them until a dedicated transform exists.
    if(/@(?:charset|import)\b/i.test(css))throw Error("P4: non-bundleable at-rule in "+path);
    fragments.push({path,css});
  }
  const css=fragments.map(({path,css})=>"/* P4 original: "+path+" */\n"+css+"\n").join("\n");
  const digest=createHash("sha256").update(css).digest("hex");
  const filename="yoga-styles-v105."+digest.slice(0,16)+".css";
  let inserted=false;
  const optimized=html.replace(LINK,tag=>{
    if(!STYLESHEET.test(tag))return tag;
    const href=tag.match(HREF)?.[1];
    if(!href?.startsWith("./"))return tag;
    if(!inserted){inserted=true;return '<link rel="stylesheet" href="./'+filename+'">';}
    return "";
  });
  if(!inserted)throw Error("P4: no stylesheet replacement position");
  const remaining=sourceSheetsForOutput(optimized);
  if(remaining.length!==1||remaining[0]!==filename)
    throw Error("P4: output unexpectedly contains more than one local stylesheet");
  return {html:optimized,css,filename,digest,sourceCount:sheets.length,sources:sheets.map(x=>x.path)};
}

function sourceSheetsForOutput(html){
  return [...html.matchAll(LINK)]
    .map(x=>x[0]).filter(x=>STYLESHEET.test(x))
    .map(tag=>tag.match(HREF)?.[1]?.match(LOCAL)?.[1]).filter(Boolean);
}

export {compileProductionStyles,sourceSheets,sourceSheetsForOutput};
