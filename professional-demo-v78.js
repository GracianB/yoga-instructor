/* V78: 60-second silent professional demo. One RAF only while playing. */
(()=>{
"use strict";
const root=document.getElementById("demostracion");if(!root)return;
const stage=root.querySelector(".v78-player"),slider=root.querySelector("#v78-seek"),
play=root.querySelector("#v78-play"),reset=root.querySelector("#v78-reset"),
label=root.querySelector("#v78-phase-label"),title=root.querySelector("#v78-phase-title"),
cue=root.querySelector("#v78-phase-cue"),counter=root.querySelector("#v78-timer"),
sceneNumber=root.querySelector("#v78-scene-number"),status=root.querySelector("#v78-live"),
jumps=[...root.querySelectorAll("[data-v78-jump]")];
const DURATION=60;
const sections=Object.freeze([
 Object.freeze({start:0,end:20,name:"arrival",marker:"markerArrival"}),
 Object.freeze({start:20,end:42,name:"explore",marker:"markerExplore"}),
 Object.freeze({start:42,end:60,name:"integrate",marker:"markerIntegrate"})
]);
const lex={
es:{kicker:"04 / PRESENCIA EN UN MINUTO",titleOne:"Así comienza",titleTwo:"una clase.",
intro:"Una demostración editorial de mi forma de acompañar. Tres momentos, una guía de sesenta segundos y control total para quien la visita.",
note:"Recreación didáctica, no grabación de una clase real. Sin sonido ni reproducción automática.",
sceneMarker:"ESCENA",timeline:"Recorrer la demostración",chapters:"Escenas",
arrival:"Llegada",explore:"Explorar",integrate:"Integrar",
play:"▶ Reproducir",pause:"Ⅱ Pausar",restart:"↶ Desde el principio",
transcript:"Leer la demostración completa",transcriptArrival:"Nos situamos. Puedes sentarte, quedarte de pie o buscar otra postura cómoda. No hay una forma única de comenzar.",
transcriptExplore:"Observamos el cuerpo, elegimos un movimiento amable y ofrecemos alternativas. La respiración acompaña, no impone.",
transcriptIntegrate:"Volvemos a un punto estable y notamos cómo estamos. La pausa forma parte de la práctica.",
cta:"Explorar el estudio completo ↗",done:"Demostración completada. Puedes volver a empezar.",
markerArrival:"LLEGADA · 00–20",markerExplore:"MOVIMIENTO · 20–42",markerIntegrate:"CIERRE · 42–60",
phaseArrival:"Primero, llegar.",cueArrival:"Una postura cómoda, un punto de atención y permiso para empezar desde donde estás.",
phaseExplore:"Después, explorar.",cueExplore:"Un pequeño movimiento con opciones: la atención importa más que la amplitud.",
phaseIntegrate:"Finalmente, integrar.",cueIntegrate:"Una pausa para notar. Lo importante es cómo te relacionas con la práctica."},
en:{kicker:"04 / PRESENCE IN A MINUTE",titleOne:"How a class",titleTwo:"begins.",
intro:"An editorial demonstration of how I guide. Three moments, a sixty-second journey and full control for the visitor.",
note:"Educational reconstruction, not a recording of a real class. No audio or automatic playback.",
sceneMarker:"SCENE",timeline:"Explore the demonstration",chapters:"Scenes",
arrival:"Arrive",explore:"Explore",integrate:"Integrate",
play:"▶ Play",pause:"Ⅱ Pause",restart:"↶ Back to start",
transcript:"Read the full demonstration",transcriptArrival:"We arrive. Sit, stand or find another comfortable posture. There is no single right way to begin.",
transcriptExplore:"Notice the body, choose a gentle movement and allow alternatives. Breathing accompanies rather than commands.",
transcriptIntegrate:"Return to a stable point and notice how you are. Pausing is part of the practice.",
cta:"Visit the full practice studio ↗",done:"Demonstration finished. You can start again.",
markerArrival:"ARRIVAL · 00–20",markerExplore:"MOVEMENT · 20–42",markerIntegrate:"CLOSING · 42–60",
phaseArrival:"First, arrive.",cueArrival:"A comfortable position, a point of attention and permission to start where you are.",
phaseExplore:"Then, explore.",cueExplore:"A small movement with options: attention matters more than range.",
phaseIntegrate:"Finally, integrate.",cueIntegrate:"A moment to notice. How you relate to the practice matters most."}
};
const lang=()=>document.documentElement.lang==="en"?"en":"es";
const words=()=>lex[lang()];
const clamp=s=>Math.max(0,Math.min(DURATION,Number.isFinite(s)?s:0));
function sceneAt(seconds){const n=clamp(seconds);return n>=42?2:n>=20?1:0}
let seconds=0,running=false,frameId=null,stamp=null;
const format=v=>"00:"+String(Math.floor(v)).padStart(2,"0");
function draw(){
 const w=words(),scene=sceneAt(seconds),record=sections[scene];
 root.querySelectorAll("[data-v78-text]").forEach(el=>{const value=w[el.dataset.v78Text];if(typeof value==="string"&&el!==play)el.textContent=value});
 stage.dataset.v78Scene=String(scene);
 root.querySelector("[data-v78-chapter-label]").setAttribute("aria-label",w.chapters);
 slider.setAttribute("aria-label",w.timeline);
 slider.value=String(Math.floor(seconds));
 slider.style.setProperty("--v78-progress",(seconds/DURATION*100).toFixed(2)+"%");
 sceneNumber.textContent="0"+(scene+1)+" / 03";
 label.textContent=w[record.marker];title.textContent=w["phase"+record.name[0].toUpperCase()+record.name.slice(1)];
 cue.textContent=w["cue"+record.name[0].toUpperCase()+record.name.slice(1)];
 counter.textContent=format(seconds)+" / 01:00";
 jumps.forEach((btn,index)=>btn.setAttribute("aria-pressed",String(index===scene)));
 play.textContent=running?w.pause:seconds===60?w.restart:w.play;
 play.setAttribute("aria-pressed",String(running));
}
function stop(){running=false;stamp=null;if(frameId!==null&&typeof cancelAnimationFrame==="function")cancelAnimationFrame(frameId);frameId=null;draw()}
function tick(now){
 if(!running)return;
 if(stamp!==null)seconds=clamp(seconds+(now-stamp)/1000);
 stamp=now;
 if(seconds>=DURATION){seconds=DURATION;stop();status.textContent=words().done;return}
 draw();
 frameId=window.requestAnimationFrame(tick);
}
function start(){if(seconds>=DURATION)seconds=0;if(running)return;running=true;stamp=null;status.textContent="";draw();if(typeof requestAnimationFrame==="function")frameId=window.requestAnimationFrame(tick);else stop()}
play.addEventListener("click",()=>{if(running)stop();else start()});
reset.addEventListener("click",()=>{stop();seconds=0;status.textContent="";draw()});
slider.addEventListener("input",()=>{seconds=clamp(Number(slider.value));stamp=null;if(seconds>=DURATION){stop();status.textContent=words().done}else draw()});
jumps.forEach(btn=>btn.addEventListener("click",()=>{seconds=clamp(Number(btn.dataset.v78Jump));stamp=null;status.textContent="";draw()}));
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop()});
window.addEventListener("pagehide",stop,{once:true});
new MutationObserver(items=>{if(items.some(x=>x.attributeName==="lang")){draw();if(seconds===60)status.textContent=words().done}}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.YOGA_DEMO_V78=Object.freeze({DURATION,sections,sceneAt});
draw();
})();
