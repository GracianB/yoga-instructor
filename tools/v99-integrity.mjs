/* V99 · Offline production integrity audit.
 * Quality gate must fail on broken core journey, missing script, unsafe nav or
 * accidental reintroduction of duplicate stage/clock/audio transports. */
import {readFile,stat} from "node:fs/promises";
const read=path=>readFile(path,"utf8"),errors=[];
const h=await read("index.html"),b=await read("tools/build.mjs");
const pkg=JSON.parse(await read("package.json"));
const failures=[];
function requireToken(source,token,name){if(!source.includes(token))failures.push(name||"Missing "+token)}
const unique=(pattern,label,expected=1)=>{
 const count=[...h.matchAll(pattern)].length;
 if(count!==expected)failures.push(label+" must occur "+expected+" time(s), got "+count);
};
for(const [id,label] of [["main","main landmark"],["instructor-flow","single yoga studio"],
 ["studio-guided","guided practice stage"],["movement-stage","movement stage"],
 ["preguntas","public FAQ"],["demostracion","real demonstration"],
 ["orientacion","visitor journey"],["v76-enquiry","private enquiry"]]){
 unique(new RegExp('id="'+id+'"',"g"),label);
}
unique(/id="focus-audio"/g,"single audio element");
for(const id of ["studio-asana-library","studio-preferences","movement-mini"]){
const script=id==="studio-asana-library"?"studio-asana-library.js":
 id==="studio-preferences"?"studio-preferences-ui-v93.js":"movement-journey-ui-v85.js";
const source=await read(script);
if(!source.includes('id="'+id+'"')&&!source.includes('.id="'+id+'"'))
 failures.push(id+" must have one owner");
}
const core={
 "asanas":["asana-library.js","movement-guardian-v37.js","studio-asana-library.js","movement-custom-ui-v94.js"],
 "breath":["studio-clock.js","studio-breath-engine.js","practice-studio.js","breath-articulation-v86.js"],
 "meditation":["studio-meditation-d27.js","studio-meditation-guardian-v42.js","uma-focus-ritual-ui-v89.js"],
 "preferences":["studio-preferences-v93.js","studio-personalization-v95.js","studio-personalization-ui-v95.js"],
 "publication":["studio-coherence-ui-v98.js","studio-keyboard-v97.js","studio-render-policy-v96.js"]
};
for(const [mode,files]of Object.entries(core)){
 for(const file of files){
  requireToken(h,"./"+file,mode+": HTML omits "+file);
  requireToken(b,"'"+file+"'",mode+": build omits "+file);
  const size=(await stat(file)).size;
  if(size<=0||size>260000)failures.push(mode+": suspicious asset size for "+file+" ("+size+")");
 }
}
for(const [type,re]of [
 ["stylesheet",/<link[^>]+href="\.\/([^"?#]+\.css)(?:\?[^"]*)?"/g],
 ["script",/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)(?:\?[^"]*)?"/g]
]){
 const files=[...h.matchAll(re)].map(x=>x[1]).filter(x=>!x.includes("/"));
 for(const file of files){
  requireToken(b,"'"+file+"'",type+" omitted from release package: "+file);
  await stat(file).catch(()=>failures.push(type+" is missing on disk: "+file));
 }
}
requireToken(h,'Content-Security-Policy',"CSP missing");
requireToken(h,"script-src 'self'","CSP must keep scripts same-origin");
requireToken(h,"object-src 'none'","CSP must reject embedded objects");
const clock=await read("practice-studio.js");
requireToken(clock,"new Clock(","PracticeClock is only timed session");
requireToken(clock,"controlsKey!==lastControlsKey","5Hz control churn returned");
for(const file of ["movement-custom-ui-v94.js","studio-personalization-ui-v95.js","studio-coherence-ui-v98.js"]){
 const content=await read(file);
 for(const unsafe of ["setInterval(","requestAnimationFrame(","fetch("])
  if(content.includes(unsafe))failures.push(file+" now contains an autonomous loop/request: "+unsafe);
}
requireToken(await read("studio-personalization-ui-v95.js"),'action==="save"',"opt-in personalization removed");
requireToken(await read("studio-personalization-ui-v95.js"),'action==="clear"',"local deletion removed");
requireToken(await read("yoga-audio-bus.js"),'const audio = document.getElementById("focus-audio")',"Shared audio bus missing");
if(!pkg.scripts.quality?.includes("audit:v99"))failures.push("V99 integrity audit must run in npm run quality");
if(failures.length){console.error("V99_RELEASE_INTEGRITY_FAILED\\n"+failures.join("\\n"));process.exitCode=1}
else console.log("V99_RELEASE_INTEGRITY_OK: "+Object.keys(core).length+" protected systems; "+[...h.matchAll(/<script\b/g)].length+" HTML scripts checked; exact audio/clock/privacy boundaries.");
