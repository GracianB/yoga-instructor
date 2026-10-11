/* V80 audit: guard portfolio and studio against missing anchors/packaged assets.
 * It is intentionally static, quick, and independent of external network access. */
import{readFileSync}from"node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),build=read("tools/build.mjs"),routes=read("visitor-gateway-v80.js");
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const owned=new Set(ids);const errors=[];
for(const id of ids){if(ids.indexOf(id)!==ids.lastIndexOf(id))errors.push("Duplicate ID: "+id)}
for(const target of ["#demostracion","#instructor-flow","#preguntas","#trayectoria","#casos","#cv","#programa","#v76-enquiry"]){
 if(!owned.has(target.slice(1))||!routes.includes('"'+target+'"'))errors.push("Broken V80 path: "+target);
}
for(const asset of ["credential-ledger-v77.js","credential-ledger-v77.css",
"professional-demo-v78.js","professional-demo-v78.css",
"discoverability-v79.js","discoverability-v79.css",
"visitor-gateway-v80.js","visitor-gateway-v80.css"]){
if(!build.includes("'"+asset+"'")||!html.includes("./"+asset))errors.push("Missing Pages asset: "+asset)
}
for(const selector of ['meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]']){
 if(!read("discoverability-v79.js").includes(selector))errors.push("Bilingual SEO selector missing: "+selector);
}
for(const forbidden of ["To be updated","Lorem ipsum","TODO: publish"]){
if(html.includes(forbidden))errors.push("Release placeholder: "+forbidden);
}
if(errors.length){console.error(errors.join("\n"));process.exitCode=1}
else console.log("V80_STATIC_AUDIT_OK: "+ids.length+" unique anchors; eight release assets; 3 journeys; bilingual metadata.");
