import {BREATH_PATTERNS,MOVEMENT_STEPS,GUIDED_VIDEOS,SessionClock,breathFrame,movementFrame,sumMovementSeconds} from "../shared/core.mjs";
import {createFigure,setFigurePose,setFigureBreath} from "../shared/figure.mjs";

const $=s=>document.querySelector(s), $=s=>[...document.querySelectorAll(s)];
const updateText=(key,value)=>{const node=$(key);if(node.textContent!==value)node.textContent=value;};
const updateHTML=(key,value)=>{const node=$(key);if(node.innerHTML!==value)node.innerHTML=value;};
let lang="es",mode="movement",pattern="natural",meditation="silent",minutes=5,lastPose="";
const clock=new SessionClock();
let frameHandle=null;
const figure=createFigure($("#figure-root"),{pose:"mountain",label:"Representación vectorial de una persona realizando una postura"});
const vocabulary={
 es:{movement:["01 / MOVIMIENTO","Tres acciones.<br><em>Un solo recorrido.</em>","Una secuencia fija y progresiva: estar de pie, flexionar con apoyo y descansar."],
 breath:["02 / RESPIRACIÓN","Un ritmo.<br><em>Tu propia respiración.</em>","Observa cómo la figura acompaña cada fase sin pedir que fuerces el aire."],
 meditation:["03 / MEDITACIÓN","Estar presente.<br><em>Sin artificios.</em>","Si eliges silencio, solo verás el tiempo y la figura. Si eliges guía, abre la voz que prefieras."],
 phases:{inhale:"Inhala",hold:"Mantén (opcional)",exhale:"Exhala",rest:"Descansa"},
 statuses:{idle:"Listo para empezar",running:"En curso",paused:"En pausa",finished:"Sesión finalizada"},
 actions:{start:"Empezar",pause:"Pausar",resume:"Continuar",restart:"Repetir"},
 silent:["Meditación silenciosa","Siéntate con comodidad. Puedes mirar la figura o cerrar los ojos. No se reproduce audio."],
 guided:["Meditación guiada","Elige una sesión externa. YouTube se abre solo si pulsas el enlace."],
 cue:"Si algo resulta incómodo, deja de seguir la cuenta y respira naturalmente.",
 breathSupport:"Los ritmos con retención son opcionales. Evítalos si te provocan molestias.",
 noAudio:"No se reproducirá ninguna voz automáticamente."},
 en:{movement:["01 / MOVEMENT","Three actions.<br><em>One clear sequence.</em>","One fixed, progressive route: stand, fold with support, and rest."],
 breath:["02 / BREATH","One rhythm.<br><em>Your own breath.</em>","Notice how the figure follows each phase without forcing your breathing."],
 meditation:["03 / MEDITATION","Be present.<br><em>Without distractions.</em>","In silence, only the timer and figure remain. With guidance, choose an external video."],
 phases:{inhale:"Inhale",hold:"Hold (optional)",exhale:"Exhale",rest:"Rest"},
 statuses:{idle:"Ready to begin",running:"In progress",paused:"Paused",finished:"Session complete"},
 actions:{start:"Start",pause:"Pause",resume:"Continue",restart:"Repeat"},
 silent:["Silent meditation","Sit comfortably. Watch the figure or close your eyes. No audio will play."],
 guided:["Guided meditation","Choose an external session. YouTube opens only when you click it."],
 cue:"If anything feels uncomfortable, stop counting and breathe naturally.",
 breathSupport:"Breath holds are optional. Avoid them if they cause discomfort.",
 noAudio:"No voice will play automatically."}
};
function applyLanguage(next){
 lang=next==="en"?"en":"es";
 document.documentElement.lang=lang;
 for(const el of $$("[data-es][data-en]")){
  const value=el.getAttribute("data-"+lang);
  if(value.includes("<br>"))el.innerHTML=value;
  else el.textContent=value;
 }
 for(const btn of $$("[data-lang]"))btn.setAttribute("aria-pressed",String(btn.dataset.lang===lang));
 paint();
}
const durationFor=()=>mode==="movement"?sumMovementSeconds():mode==="breath"?300:minutes*60;
function stopFrames(){if(frameHandle!==null){cancelAnimationFrame(frameHandle);frameHandle=null;}}
function startFrames(){
 stopFrames();
 let lastPaint=-Infinity;
 const loop=(now)=>{
  // 10Hz is sufficient for slow breathing: SVG transitions interpolate between updates.
  if(now-lastPaint>=100){paint();lastPaint=now;}
  if(clock.status==="running")frameHandle=requestAnimationFrame(loop);
  else frameHandle=null;
 };
 frameHandle=requestAnimationFrame(loop);
}
function resetSession(){
 stopFrames();clock.reset(durationFor());paint();
}
function setMode(next,{focus=false}={}){
 if(!["movement","breath","meditation"].includes(next))return;
 mode=next;
 for(const button of $$("[data-mode]")){
  const active=button.dataset.mode===mode;
  button.setAttribute("aria-selected",String(active));button.tabIndex=active?0:-1;
  if(active&&focus)button.focus();
 }
 $("#movement-options").hidden=mode!=="movement";
 $("#breath-options").hidden=mode!=="breath";
 $("#meditation-options").hidden=mode!=="meditation";
 document.documentElement.dataset.mode=mode;
 $("#mode-panel").setAttribute("aria-labelledby","tab-"+mode);
 resetSession();
}
function formatTime(seconds){
 const whole=Math.ceil(Math.max(0,seconds));
 return String(Math.floor(whole/60)).padStart(2,"0")+":"+String(whole%60).padStart(2,"0");
}
function paint(){
 const t=vocabulary[lang],snapshot=clock.snapshot(),guided=mode==="meditation"&&meditation==="guided";
 figure.setAttribute("data-active",String(snapshot.status==="running"&&!guided));
 figure.dataset.mode=mode;figure.dataset.phase="";
 const base=t[mode];
 updateText("#stage-eyebrow",base[0]);
 updateHTML("#stage-title",base[1]);
 updateText("#stage-cue",base[2]);
 $("#controls").hidden=guided;
 $("#pose-book-link").hidden=mode!=="movement";
 updateText("#clock",guided?"—:—":formatTime(snapshot.remaining));
 updateText("#stage-status",guided?t.noAudio:t.statuses[snapshot.status]);
 updateText("#primary",snapshot.status==="running"?t.actions.pause:snapshot.status==="paused"?t.actions.resume:snapshot.status==="finished"?t.actions.restart:t.actions.start);
 let progress=snapshot.progress,phase="",detail="",pose="seated",expansion=.5;
 if(mode==="movement"){
  const f=movementFrame(snapshot.elapsed);
  $("#pose-book-link").href="../yoga-asana-book/?pose="+encodeURIComponent(f.item.id);
  phase=f.item.title[lang];detail=f.item.support[lang];
  pose=f.item.pose;progress=f.totalProgress;
  updateText("#phase-remaining",formatTime(f.remaining));
  $$("#movement-steps li").forEach((node,i)=>{node.classList.toggle("current",i===f.index);});
  updateText("#visual-caption",f.item.pose.toUpperCase());
  // Subtle body response. No fantasy creature and no animated face.
  expansion=.45+.06*Math.sin(snapshot.elapsed*2*Math.PI/6);
  updateText("#stage-cue",f.item.cue[lang]);
 }else if(mode==="breath"){
  const f=breathFrame(snapshot.elapsed,pattern);
  figure.dataset.phase=f.phase;
  phase=t.phases[f.phase];detail=t.breathSupport;
  expansion=snapshot.status==="running"||snapshot.status==="paused"?f.expansion:.5;
  updateText("#phase-remaining",formatTime(f.remaining));
  updateText("#visual-caption",f.pattern.name);
  updateText("#stage-cue",base[2]+" "+t.cue);
 }else{
  phase=guided?t.guided[0]:t.silent[0];
  detail=guided?t.guided[1]:t.silent[1];
  progress=guided?0:snapshot.progress;
  updateText("#phase-remaining",guided?"YOUTUBE":formatTime(snapshot.remaining));
  updateText("#visual-caption",guided?"GUIDED":"SILENCE");
  updateText("#stage-cue",detail);
  expansion=.48+.02*Math.sin(snapshot.elapsed/6);
 }
 updateText("#phase-label",phase);
 updateText("#stage-support",detail);
 $("#progress-fill").style.width=(Math.max(0,Math.min(1,progress))*100).toFixed(2)+"%";
 $(".progress").setAttribute("aria-valuenow",String(Math.round(progress*100)));
 if(pose!==lastPose){setFigurePose(figure,pose);lastPose=pose;}
 const figureLabel=mode==="movement"?(lang==="es"?"Postura: ":"Pose: ")+phase:mode==="breath"?(lang==="es"?"Respiración: ":"Breathing: ")+phase:(lang==="es"?"Figura humana en meditación":"Human figure in meditation");
 if(figure.getAttribute("aria-label")!==figureLabel)figure.setAttribute("aria-label",figureLabel);
 setFigureBreath(figure,expansion);
}
function play(){
 const status=clock.snapshot().status;
 if(status==="running"){clock.pause();stopFrames();}
 else if(status==="paused"){clock.resume();startFrames();}
 else{clock.reset(durationFor());clock.start();startFrames();}
 paint();
}
for(const button of $$("[data-mode]")){
 button.addEventListener("click",()=>setMode(button.dataset.mode));
 button.addEventListener("keydown",event=>{
  const allowed=["ArrowRight","ArrowLeft","Home","End"];
  if(!allowed.includes(event.key))return;
  event.preventDefault();
  const values=["movement","breath","meditation"],index=values.indexOf(mode);
  const next=event.key==="Home"?0:event.key==="End"?2:(index+(event.key==="ArrowRight"?1:2))%3;
  setMode(values[next],{focus:true});
 });
}
$("#primary").addEventListener("click",play);
$("#reset").addEventListener("click",resetSession);
for(const button of $$("[data-pattern]")){
 button.addEventListener("click",()=>{
  pattern=button.dataset.pattern;
  $$("[data-pattern]").forEach(el=>el.setAttribute("aria-pressed",String(el===button)));
  resetSession();
 });
}
for(const button of $$("[data-meditation]")){
 button.addEventListener("click",()=>{
  meditation=button.dataset.meditation;
  $$("[data-meditation]").forEach(el=>el.setAttribute("aria-pressed",String(el===button)));
  $("#silent-options").hidden=meditation!=="silent";
  $("#guided-options").hidden=meditation!=="guided";
  resetSession();
 });
}
for(const button of $$("[data-minutes]")){
 button.addEventListener("click",()=>{
  minutes=Number(button.dataset.minutes);
  $$("[data-minutes]").forEach(el=>el.setAttribute("aria-pressed",String(el===button)));
  resetSession();
 });
}
for(const button of $$("[data-lang]"))button.addEventListener("click",()=>applyLanguage(button.dataset.lang));
for(const video of GUIDED_VIDEOS){
 const a=document.createElement("a");
 a.href=video.url;a.target="_blank";a.rel="noopener noreferrer";
 const minutes=document.createElement("span");minutes.className="duration";minutes.textContent=video.minutes+"′";
 const detail=document.createElement("span");const name=document.createElement("strong");name.textContent=video.title;
 const credit=document.createElement("small");credit.textContent=video.channel;
 detail.append(name,document.createElement("br"),credit);
 const arrow=document.createElement("span");arrow.textContent="↗";
 a.append(minutes,detail,arrow);$("#video-list").append(a);
}
// Never leave the session "running" unattended in a background tab.
document.addEventListener("visibilitychange",()=>{
 if(document.hidden&&clock.status==="running"){clock.pause();stopFrames();paint();}
});
window.addEventListener("pagehide",stopFrames,{once:true});
setMode("movement");
applyLanguage("es");
