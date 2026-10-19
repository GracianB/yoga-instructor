/* Yoga Practice: standalone studio using the proven PracticeClock. */
(()=>{
"use strict";
const root=document.getElementById("practice-app"),Time=window.YOGA_STUDIO_CLOCK;
if(!root||!Time?.create){const e=document.getElementById("practice-status");if(e)e.textContent="No se pudo iniciar el reloj.";return}
const $=s=>root.querySelector(s);
const modes=[...root.querySelectorAll("[data-mode]")],durations=[...root.querySelectorAll("[data-minutes]")];
const clock=Time.create();
const ui={time:$("#practice-time"),step:$("#practice-step"),cue:$("#practice-cue"),bar:$("#practice-progress"),fill:$("#practice-progress-fill"),primary:$("#practice-primary"),reset:$("#practice-reset"),status:$("#practice-status"),picture:$("#practice-visual"),visualLabel:$("#practice-visual-label"),modeNumber:$("#practice-mode-number"),language:$("#switch-language"),theme:$("#switch-theme")};
const phases={
 movement:[
  {end:.17,name:["Llegar","Arrive"],cue:["Ponte cómodo. Observa los apoyos y cómo te sientes hoy.","Find a comfortable position. Notice your support and how you feel."]},
  {end:.40,name:["Despertar el cuerpo","Warm up"],cue:["Moviliza hombros, columna y caderas de forma lenta, sin dolor.","Gently mobilize shoulders, spine and hips without pain."]},
  {end:.81,name:["Mover con atención","Mindful movement"],cue:["Alterna posturas sencillas, con descansos y apoyos cuando los necesites.","Explore simple postures with breaks and supports whenever needed."]},
  {end:1,name:["Integrar y descansar","Rest and integrate"],cue:["Reduce el movimiento. Observa la respiración y suelta la tensión.","Slow down. Notice your breathing and let tension release."]}
 ],
 breath:[
  {end:.13,name:["Acomodarte","Settle in"],cue:["Encuentra una postura cómoda y permite que la respiración llegue sola.","Get comfortable and let your breath settle naturally."]},
  {end:.84,name:["Respirar con suavidad","Breathe gently"],cue:["Prueba un ritmo sin esfuerzo: cuatro tiempos al inhalar y seis al exhalar. Adáptalo si lo necesitas.","Try an effortless rhythm: four counts in and six counts out. Adapt it as needed."]},
  {end:1,name:["Volver al ritmo natural","Natural rhythm"],cue:["Deja de contar y respira como te resulte cómodo.","Stop counting and breathe in whatever way feels comfortable."]}
 ],
 meditation:[
  {end:.18,name:["Encontrar estabilidad","Find a seat"],cue:["Siéntate o túmbate de forma cómoda. Puedes mantener los ojos abiertos.","Sit or lie comfortably. You can keep your eyes open."]},
  {end:.83,name:["Observar","Observe"],cue:["Lleva la atención a un punto de apoyo o un sonido. Si te distraes, vuelve con calma.","Notice a point of support or a sound. When distracted, gently return."]},
  {end:1,name:["Cerrar con calma","Close gently"],cue:["Nota el espacio alrededor. Mueve manos y pies antes de terminar.","Notice the space around you. Move your hands and feet before finishing."]}
 ]};
const labels={
 es:{start:"Empezar",pause:"Pausar",resume:"Continuar",again:"Repetir",ready:"Listo para empezar",running:"Sesión en curso",paused:"Sesión en pausa",finished:"Sesión terminada. Gracias por practicar.",hidden:"Sesión pausada al salir de la pestaña",mode:"Sesión cambiada; reloj reiniciado",duration:"Duración actualizada",inhale:"Inhala sin esfuerzo",exhale:"Exhala suavemente"},
 en:{start:"Start",pause:"Pause",resume:"Resume",again:"Repeat",ready:"Ready to start",running:"Session in progress",paused:"Session paused",finished:"Session complete. Thank you for practising.",hidden:"Session paused when you left the tab",mode:"Session changed; timer reset",duration:"Duration updated",inhale:"Inhale gently",exhale:"Exhale easily"}
};
let mode="movement",minutes=5,lang="es",interval=null,lastStage=-1,lastStatus="idle";
const t=()=>labels[lang],idx=()=>lang==="es"?0:1;
const mmss=ms=>{const n=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")};
const notify=message=>{ui.status.textContent=message};
const stopLoop=()=>{if(interval!==null){clearInterval(interval);interval=null}};
const runLoop=()=>{if(interval===null)interval=setInterval(draw,250)};
function draw(){
 const snap=clock.snapshot();
 const stage=phases[mode].findIndex(p=>snap.progress<p.end);
 const n=stage<0?phases[mode].length-1:stage,item=phases[mode][n];
 ui.time.textContent=mmss(snap.remainingMs);
 ui.bar.setAttribute("aria-valuenow",String(Math.round(snap.progress*100)));
 ui.fill.style.width=(snap.progress*100).toFixed(2)+"%";
 ui.step.textContent=item.name[idx()];ui.cue.textContent=item.cue[idx()];
 ui.picture.dataset.mode=mode;ui.picture.classList.toggle("is-running",snap.status==="running");
 ui.primary.textContent=snap.status==="running"?t().pause:snap.status==="paused"?t().resume:snap.status==="finished"?t().again:t().start;
 ui.visualLabel.textContent=(mode==="movement"?"MOVEMENT":mode==="breath"?"BREATH":"MEDITATION")+" · "+String(n+1).padStart(2,"0");
 if(mode==="breath"&&snap.status==="running"&&n===1)ui.visualLabel.textContent=snap.elapsedMs%10000<4000?t().inhale:t().exhale;
 if(n!==lastStage&&snap.status==="running"){lastStage=n;notify(item.name[idx()])}
 if(snap.status!==lastStatus){lastStatus=snap.status;if(snap.status==="finished"){stopLoop();notify(t().finished)}}
}
function idle(message=""){stopLoop();clock.reset(minutes);lastStage=-1;lastStatus="idle";draw();notify(message)}
function setMode(next,focus=false){
 if(!phases[next])return;mode=next;
 modes.forEach((b,i)=>{const active=b.dataset.mode===mode;b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;if(active)ui.modeNumber.textContent=String(i+1).padStart(2,"0")+" / 03"});
 idle(t().mode);if(focus)modes.find(b=>b.dataset.mode===mode)?.focus();
}
modes.forEach((b,i)=>{
 b.addEventListener("click",()=>setMode(b.dataset.mode));
 b.addEventListener("keydown",event=>{
  let next=null;
  if(event.key==="ArrowRight"||event.key==="ArrowDown")next=(i+1)%modes.length;
  if(event.key==="ArrowLeft"||event.key==="ArrowUp")next=(i+modes.length-1)%modes.length;
  if(event.key==="Home")next=0;
  if(event.key==="End")next=modes.length-1;
  if(next===null)return;event.preventDefault();setMode(modes[next].dataset.mode,true);
 });
});
durations.forEach(b=>b.addEventListener("click",()=>{
 const n=Number(b.dataset.minutes);if(![5,10,15].includes(n))return;
 minutes=n;durations.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));idle(t().duration);
}));
ui.primary.addEventListener("click",()=>{
 const state=clock.snapshot().status;
 if(state==="running"){clock.pause();stopLoop();notify(t().paused)}
 else if(state==="paused"){clock.resume();notify(t().running);runLoop()}
 else{clock.start(minutes);lastStage=-1;notify(t().running);runLoop()}
 draw();
});
ui.reset.addEventListener("click",()=>idle(t().ready));
ui.language.addEventListener("click",()=>{
 lang=lang==="es"?"en":"es";document.documentElement.lang=lang;
 ui.language.textContent=lang==="es"?"EN":"ES";
 ui.language.setAttribute("aria-label",lang==="es"?"Cambiar idioma a inglés":"Switch language to Spanish");
 document.title=lang==="es"?"Yoga Practice · Sesiones guiadas":"Yoga Practice · Guided sessions";
 lastStage=-1;draw();notify(t()[clock.snapshot().status]||t().ready);
});
ui.theme.addEventListener("click",()=>{
 const dark=document.body.dataset.theme!=="dark";
 document.body.dataset.theme=dark?"dark":"light";
 ui.theme.setAttribute("aria-pressed",String(dark));ui.theme.textContent=dark?"☀":"☾";
});
document.addEventListener("visibilitychange",()=>{
 if(document.hidden&&clock.snapshot().status==="running"){clock.pause();stopLoop();draw();notify(t().hidden)}
});
idle(t().ready);
})();