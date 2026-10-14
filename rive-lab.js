import {solveAsana,svgSkeleton} from "./anatomy-foundation-p0.mjs";
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

// Pure, user-controlled comparison; the actual Rive runtime remains opt-in.
const foldSlider=document.getElementById("fold-progress");
const foldStage=document.getElementById("ik-stage");
const foldValue=document.getElementById("fold-value");
function renderFold(){
 const progress=Number(foldSlider.value)/100;
 foldValue.textContent=foldSlider.value+"%";
 foldStage.innerHTML=svgSkeleton(solveAsana("uttanasana",{progress}));
 foldStage.setAttribute("aria-label",progress===0?"Tadasana":progress===1?"Uttanasana":"Transición anatómica: "+foldSlider.value+" por ciento");
}
foldSlider.addEventListener("input",renderFold);
renderFold();
