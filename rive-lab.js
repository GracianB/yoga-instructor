import {solveAsana} from "./anatomy-foundation-p0.mjs";
import {renderSkinnedAsana} from "./anatomy-skin-p0.mjs";
/* Yoga Rive lab P0: opt-in, sandboxed-by-page Rive preview.
 * No runtime requested on page load, no telemetry, no network file upload.
 * Runtime pinned: @rive-app/canvas 2.44.2 (MIT).
 */
const input=document.getElementById("rive-file");
const canvas=document.getElementById("rive-canvas");
const empty=document.getElementById("rive-empty");
const status=document.getElementById("rive-status");
const playButton=document.getElementById("rive-play");
const clearButton=document.getElementById("rive-clear");
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
let player=null,objectUrl=null,generation=0,requestedPlay=false;
let runtimePromise=null;
function notify(message){status.textContent=message;}
function dispose(){
 ++generation;
 if(player){try{player.cleanup();}catch(error){console.warn("Rive cleanup:",error);}player=null;}
 if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}
 requestedPlay=false;
 playButton.disabled=true;
 clearButton.disabled=true;
 playButton.textContent="Reproducir";
 empty.hidden=false;
 canvas.hidden=true;
}
function ensureRuntime(){
 if(window.rive?.Rive)return Promise.resolve(window.rive);
 if(runtimePromise)return runtimePromise;
 runtimePromise=new Promise((resolve,reject)=>{
  const script=document.createElement("script");
  script.src="https://unpkg.com/@rive-app/canvas@2.44.2";
  script.async=true;
  script.onload=()=>window.rive?.Rive?resolve(window.rive):reject(new Error("Runtime no disponible."));
  script.onerror=()=>reject(new Error("No se pudo descargar el runtime Rive."));
  document.head.appendChild(script);
 }).catch(error=>{runtimePromise=null;throw error;});
 return runtimePromise;
}
async function openFile(file){
 dispose();
 const run=generation;
 if(!file){notify("Sin archivo cargado.");return;}
 if(!/\.riv$/i.test(file.name)){notify("Selecciona un archivo con extensión .riv.");return;}
 if(file.size===0||file.size>15*1024*1024){notify("Archivo vacío o superior al límite de 15 MB.");return;}
 notify("Preparando el visor Rive…");
 try{
  const rive=await ensureRuntime();
  if(run!==generation)return;
  objectUrl=URL.createObjectURL(file);
  requestedPlay=!reduced.matches;
  empty.hidden=true;
  canvas.hidden=false;
  player=new rive.Rive({
   src:objectUrl,
   canvas,
   autoplay:requestedPlay,
   onLoad:()=>{
    if(run!==generation)return;
    player?.resizeDrawingSurfaceToCanvas();
    playButton.disabled=false;
    clearButton.disabled=false;
    playButton.textContent=requestedPlay?"Pausar":"Reproducir";
    notify("Archivo cargado: "+file.name+(reduced.matches?" · reproducción manual por accesibilidad.":" · animación lista."));
   },
   onLoadError:(err)=>{
    if(run!==generation)return;
    console.error("Rive load failed:",err);
    notify("No se pudo leer el archivo .riv. Comprueba la exportación y la versión del runtime.");
    dispose();
   },
  });
 }catch(error){
  if(run!==generation)return;
  notify("Error de visor: "+error.message);
  dispose();
 }
}
input.addEventListener("change",()=>{void openFile(input.files?.[0]);});
const demoButton=document.getElementById("rive-demo");
demoButton.addEventListener("click",async()=>{
 demoButton.disabled=true;
 notify("Descargando la demo local desde el mismo sitio…");
 try{
  const response=await fetch("./rive-nila-demo-p0.riv",{cache:"no-cache"});
  if(!response.ok)throw new Error("La animación todavía no está compilada para esta versión. Consulta el artefacto de GitHub Actions.");
  const blob=await response.blob();
  const file=new File([blob],"nila-yoga-p0.riv",{type:"application/octet-stream"});
  await openFile(file);
 }catch(error){
  notify("Demo no disponible: "+error.message);
 }finally{
  demoButton.disabled=false;
 }
});

playButton.addEventListener("click",()=>{
 if(!player)return;
 requestedPlay=!requestedPlay;
 if(requestedPlay)player.play();else player.pause();
 playButton.textContent=requestedPlay?"Pausar":"Reproducir";
});
clearButton.addEventListener("click",()=>{dispose();input.value="";notify("Sin archivo cargado.");});
document.addEventListener("visibilitychange",()=>{
 if(!player)return;
 if(document.hidden)player.pause();
 else if(requestedPlay&&!reduced.matches)player.play();
});
reduced.addEventListener?.("change",()=>{
 if(!player)return;
 if(reduced.matches){requestedPlay=false;player.pause();playButton.textContent="Reproducir";}
});
if(typeof ResizeObserver!=="undefined"){
 const resize=new ResizeObserver(()=>player?.resizeDrawingSurfaceToCanvas());
 resize.observe(canvas.parentElement);
 window.addEventListener("pagehide",()=>{resize.disconnect();dispose();},{once:true});
}else window.addEventListener("pagehide",dispose,{once:true});

// Isolated, joint-driven vector preview; no dependency on Rive CDN.
const foldSlider=document.getElementById("fold-progress");
const foldStage=document.getElementById("ik-stage");
const foldValue=document.getElementById("fold-value");
const jointsToggle=document.getElementById("fold-joints");
const animateButton=document.getElementById("fold-animate");
let foldFrame=0,animationStart=0;
const smooth=t=>t*t*(3-2*t);
function renderFold(){
 const progress=Number(foldSlider.value)/100;
 foldValue.textContent=foldSlider.value+"%";
 const pose=solveAsana("uttanasana",{progress});
 foldStage.innerHTML=renderSkinnedAsana(pose,{showJoints:jointsToggle.checked});
 foldStage.setAttribute("aria-label",progress===0?"Tadasana":progress===1?"Uttanasana":"Transición anatómica: "+foldSlider.value+" por ciento");
}
function stopFold(){
 if(foldFrame)cancelAnimationFrame(foldFrame);
 foldFrame=0;
 animationStart=0;
 animateButton.textContent="Animar transición";
}
function animateFold(now){
 if(document.hidden||reduced.matches){stopFold();return;}
 if(!animationStart)animationStart=now;
 const duration=6800;
 const phase=Math.min(1,(now-animationStart)/duration);
 const twoWay=phase<.5?smooth(phase*2):smooth((1-phase)*2);
 foldSlider.value=String(Math.round(twoWay*100));
 renderFold();
 if(phase>=1){stopFold();return;}
 foldFrame=requestAnimationFrame(animateFold);
}
foldSlider.addEventListener("input",()=>{stopFold();renderFold();});
jointsToggle.addEventListener("change",renderFold);
animateButton.addEventListener("click",()=>{
 if(foldFrame){stopFold();return;}
 if(reduced.matches)return;
 foldSlider.value="0";
 renderFold();
 animationStart=0;
 animateButton.textContent="Detener animación";
 foldFrame=requestAnimationFrame(animateFold);
});
const syncMotion=()=>{
 animateButton.disabled=reduced.matches;
 if(reduced.matches)stopFold();
};
reduced.addEventListener?.("change",syncMotion);
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopFold();});
window.addEventListener("pagehide",stopFold,{once:true});
syncMotion();
renderFold();
